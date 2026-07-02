/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/lib/prisma";
import {
  countLocalJudgments as countLocalJudgmentsSqlite,
  countRelatedJudgments as countRelatedJudgmentsSqlite,
  findReportedByCitations as findReportedByCitationsSqlite,
  getCitedByCount as getCitedByCountSqlite,
  getJudgmentDbStats as getJudgmentDbStatsSqlite,
  getJudgmentsByIds as getJudgmentsByIdsSqlite,
  getLocalJudgmentById as getLocalJudgmentByIdSqlite,
  relatedLocalJudgments as relatedLocalJudgmentsSqlite,
  searchLocalJudgments as searchLocalJudgmentsSqlite,
  searchSectionJudgments as searchSectionJudgmentsSqlite,
  getCitedByCounts as getCitedByCountsSqlite,
  type JudgmentRow,
  type JudgmentSearchResult,
  type SortMode,
} from "@/lib/judgment-db";

export type { JudgmentRow, JudgmentSearchResult, SortMode };

function usePostgres(): boolean {
  return /^postgres(?:ql)?:\/\//i.test(process.env.DATABASE_URL || "");
}

function cleanSearchTerm(value: string): string {
  return value
    .replace(/["']/g, " ")
    .replace(/[^\p{L}\p{N}\s-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function phraseExpr(query: string): string | null {
  const cleaned = cleanSearchTerm(query);
  return cleaned.length >= 2 ? `"${cleaned}"` : null;
}

function anyExpr(terms: string[]): string | null {
  const parts = terms
    .map(cleanSearchTerm)
    .filter((term) => term.length >= 2)
    .map((term) => `"${term}"`);
  return parts.length ? parts.join(" OR ") : null;
}

const CITATION_RE =
  /\b(19|20)\d{2}\b|\b(SCMR|PLD|PCrLJ|PCRLJ|MLD|CLC|YLR|PLJ|NLR|SBLR|CLD|GBLR|KLR)\b/i;

function looksLikeCitation(query: string): boolean {
  return CITATION_RE.test(query);
}

function textVectorSql(alias = "j"): string {
  return `to_tsvector(
    'simple',
    COALESCE(${alias}.citation, '') || ' ' ||
    COALESCE(${alias}.real_citation, '') || ' ' ||
    COALESCE(${alias}.title, '') || ' ' ||
    COALESCE(${alias}.content, '')
  )`;
}

function courtPrioritySql(alias = "j"): string {
  return `CASE
    WHEN ${alias}.court ILIKE 'Supreme Court%' THEN 0
    WHEN ${alias}.court ILIKE 'Lahore High Court%' THEN 1
    WHEN ${alias}.court ILIKE 'Federal Shariat Court%' THEN 2
    WHEN ${alias}.court ILIKE 'Islamabad High Court%' THEN 3
    WHEN ${alias}.court ILIKE 'Peshawar High Court%' THEN 3
    WHEN ${alias}.court ILIKE 'Balochistan High Court%' THEN 3
    WHEN ${alias}.court ILIKE 'Sindh High Court%' THEN 4
    ELSE 5
  END`;
}

function orderBy(sort: SortMode, alias = "j", rank = "rank"): string {
  if (sort === "newest") return `${alias}.year DESC, ${alias}.id DESC`;
  if (sort === "oldest") return `${alias}.year ASC, ${alias}.id ASC`;
  return `${rank} DESC, (${alias}.real_citation IS NOT NULL) DESC, (${alias}.title IS NOT NULL) DESC, ${alias}.year DESC, ${courtPrioritySql(alias)} ASC, ${alias}.id ASC`;
}

function buildPassages(content: string | null, query: string, max = 4): string[] {
  if (!content) return [];
  const clean = content.replace(/\s+/g, " ").trim();
  const terms = query
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((term) => term.length >= 3);

  const lower = clean.toLowerCase();
  const windows: string[] = [];
  const used: Array<[number, number]> = [];

  const pushWindow = (idx: number) => {
    const start = Math.max(0, idx - 90);
    const end = Math.min(clean.length, idx + 200);
    if (used.some(([s, e]) => idx >= s && idx <= e)) return;
    used.push([start, end]);
    let frag = clean.slice(start, end).trim();
    if (start > 0) frag = "... " + frag;
    if (end < clean.length) frag = frag + " ...";
    windows.push(frag);
  };

  if (terms.length) {
    outer: for (const term of terms) {
      let from = 0;
      while (windows.length < max) {
        const idx = lower.indexOf(term, from);
        if (idx === -1) break;
        pushWindow(idx);
        from = idx + term.length;
        if (windows.length >= max) break outer;
      }
    }
  }

  if (windows.length === 0) {
    const body = clean.replace(/^.{0,300}?(JUDGMENT|ORDER)\s+/i, "").trim();
    windows.push(body.slice(0, 260).trim() + (body.length > 260 ? " ..." : ""));
  }
  return windows;
}

const CASE_NO = /\b((?:W\.?P|Crl\.?\s?A|C\.?R|F\.?A\.?O|R\.?F\.?A|Civil Revision|Writ Petition|Cr\.?\s?Misc|Crl\.?\s?Misc|Election Petition|Suit|Appeal|R\.?S\.?A|I\.?C\.?A|Constitution Petition)[^\n.]{0,40}?No\.?\s*[0-9][0-9A-Za-z\-/ ]{0,18})/i;

function extractCaseNo(content: string | null): string | null {
  if (!content) return null;
  const match = content.slice(0, 1200).match(CASE_NO);
  return match ? match[1].replace(/\s+/g, " ").trim() : null;
}

function dedupeKey(row: any): string {
  if (row.content) return row.content.replace(/\s+/g, " ").trim().slice(0, 300).toLowerCase();
  if (row.real_citation) return String(row.real_citation).toLowerCase();
  return `id:${row.id}`;
}

function dedupeRows(rows: any[], limit: number, offset = 0): any[] {
  const seen = new Set<string>();
  const out: any[] = [];
  let skipped = 0;
  for (const row of rows) {
    const key = dedupeKey(row);
    if (seen.has(key)) continue;
    seen.add(key);
    if (skipped < offset) {
      skipped++;
      continue;
    }
    out.push(row);
    if (out.length >= limit) break;
  }
  return out;
}

function toResult(row: any, query: string, related = false): JudgmentSearchResult {
  const real = row.real_citation && String(row.real_citation).trim();
  const content = row.content || null;
  return {
    id: Number(row.id),
    citation: real || row.citation,
    reported: !!real,
    court: row.court || "Unknown Court",
    year: Number(row.year || 0),
    title: row.title || null,
    caseNo: row.title ? null : extractCaseNo(content),
    passages: buildPassages(content, query),
    processed: Number(row.processed || 0),
    related,
  };
}

function sectionVariants(query: string): string[] {
  const cleaned = query.trim();
  const match = cleaned.match(/\b(\d{2,4})\s*[-/]?\s*([A-Za-z])?\b/);
  if (!match) return [];
  const base = match[1];
  const suffix = match[2]?.toUpperCase();
  return Array.from(
    new Set(
      [
        cleaned,
        suffix ? `${base}-${suffix}` : base,
        suffix ? `${base}${suffix}` : base,
        suffix ? `${base} ${suffix}` : base,
        `section ${suffix ? `${base}-${suffix}` : base}`,
        `sec ${suffix ? `${base}-${suffix}` : base}`,
      ].filter((value) => value.length >= 2)
    )
  );
}

function queryTerms(query: string): string[] {
  return query
    .split(/[^A-Za-z0-9]+/)
    .filter((term) => term.length >= 4)
    .slice(0, 6);
}

function addFilters(
  where: string[],
  params: any[],
  opts: { court?: string; year?: string; reportedOnly?: boolean }
) {
  if (opts.reportedOnly) where.push("j.real_citation IS NOT NULL");
  if (opts.court && opts.court !== "All Courts") {
    params.push(`${opts.court}%`);
    where.push(`j.court ILIKE $${params.length}`);
  }
  if (opts.year && opts.year !== "All years") {
    params.push(parseInt(opts.year));
    where.push(`j.year = $${params.length}`);
  }
}

async function searchPg(
  query: string,
  court: string | undefined,
  year: string | undefined,
  limit: number,
  sort: SortMode,
  offset: number,
  reportedOnly: boolean,
  related: boolean
): Promise<JudgmentSearchResult[] | null> {
  try {
    const expr = related ? anyExpr(queryTerms(query)) : phraseExpr(query);
    if (!expr) return [];

    const params: any[] = [expr];
    const where = ["j.processed = 1"];
    addFilters(where, params, { court, year, reportedOnly });

    const citationLike = `%${query.trim()}%`;
    let matchSql = `${textVectorSql("j")} @@ q.query`;
    if (!related && looksLikeCitation(query)) {
      params.push(citationLike);
      matchSql = `(${matchSql} OR j.citation ILIKE $${params.length} OR j.real_citation ILIKE $${params.length})`;
    }
    where.push(matchSql);
    params.push(Math.min(350, Math.max(limit + offset + 25, (offset + limit) * 2)));

    const rows = await prisma.$queryRawUnsafe<any[]>(
      `
        WITH q AS (SELECT websearch_to_tsquery('simple', $1) AS query)
        SELECT j.id, j.citation, j.real_citation, j.court, j.year, j.title, j.processed,
               substr(j.content, 1, 4000) AS content,
               ts_rank_cd(${textVectorSql("j")}, q.query) AS rank
        FROM legal_judgments j
        CROSS JOIN q
        WHERE numnode(q.query) > 0
          AND ${where.join(" AND ")}
        ORDER BY ${orderBy(sort, "j", "rank")}
        LIMIT $${params.length}
      `,
      ...params
    );

    return dedupeRows(rows, limit, offset).map((row) => toResult(row, query, related));
  } catch {
    return null;
  }
}

export async function searchLocalJudgments(
  query: string,
  court?: string,
  year?: string,
  limit = 25,
  sort: SortMode = "relevance",
  offset = 0,
  reportedOnly = false
): Promise<JudgmentSearchResult[]> {
  if (usePostgres()) {
    const rows = await searchPg(query, court, year, limit, sort, offset, reportedOnly, false);
    if (rows) return rows;
  }
  return searchLocalJudgmentsSqlite(query, court, year, limit, sort, offset, reportedOnly);
}

export async function relatedLocalJudgments(
  query: string,
  court?: string,
  year?: string,
  limit = 15,
  sort: SortMode = "relevance",
  offset = 0,
  reportedOnly = false
): Promise<JudgmentSearchResult[]> {
  if (usePostgres()) {
    const rows = await searchPg(query, court, year, limit, sort, offset, reportedOnly, true);
    if (rows) return rows;
  }
  return relatedLocalJudgmentsSqlite(query, court, year, limit, sort, offset, reportedOnly);
}

export async function searchSectionJudgments(
  query: string,
  court?: string,
  year?: string,
  limit = 16,
  offset = 0,
  reportedOnly = false
): Promise<JudgmentSearchResult[]> {
  if (usePostgres()) {
    try {
      const variants = sectionVariants(query);
      const expr = anyExpr(variants.slice(0, 4));
      if (!expr) return [];

      const params: any[] = [expr];
      const where = ["j.processed = 1", `${textVectorSql("j")} @@ q.query`];
      addFilters(where, params, { court, year, reportedOnly });
      params.push(Math.min(300, Math.max(limit + offset + 20, (offset + limit) * 2)));

      const rows = await prisma.$queryRawUnsafe<any[]>(
        `
          WITH q AS (SELECT websearch_to_tsquery('simple', $1) AS query)
          SELECT j.id, j.citation, j.real_citation, j.court, j.year, j.title, j.processed,
                 substr(j.content, 1, 4000) AS content,
                 ts_rank_cd(${textVectorSql("j")}, q.query) AS rank
          FROM legal_judgments j
          CROSS JOIN q
          WHERE numnode(q.query) > 0
            AND ${where.join(" AND ")}
          ORDER BY rank DESC, j.year DESC, ${courtPrioritySql("j")} ASC, j.id ASC
          LIMIT $${params.length}
        `,
        ...params
      );
      return dedupeRows(rows, limit, offset).map((row) => toResult(row, query));
    } catch {
      return [];
    }
  }
  return searchSectionJudgmentsSqlite(query, court, year, limit, offset, reportedOnly);
}

async function countPg(
  query: string,
  court: string | undefined,
  year: string | undefined,
  reportedOnly: boolean,
  related: boolean
): Promise<number | null> {
  try {
    const expr = related ? anyExpr(queryTerms(query)) : phraseExpr(query);
    if (!expr) return 0;

    const params: any[] = [expr];
    const where = ["j.processed = 1", `${textVectorSql("j")} @@ q.query`];
    addFilters(where, params, { court, year, reportedOnly });

    const rows = await prisma.$queryRawUnsafe<{ count: bigint }[]>(
      `
        WITH q AS (SELECT websearch_to_tsquery('simple', $1) AS query)
        SELECT COUNT(*)::bigint AS count
        FROM legal_judgments j
        CROSS JOIN q
        WHERE numnode(q.query) > 0
          AND ${where.join(" AND ")}
      `,
      ...params
    );
    return Number(rows[0]?.count || 0);
  } catch {
    return null;
  }
}

export async function countLocalJudgments(
  query: string,
  court?: string,
  year?: string,
  reportedOnly = false
): Promise<number> {
  if (usePostgres()) {
    const count = await countPg(query, court, year, reportedOnly, false);
    if (count !== null) return count;
  }
  return countLocalJudgmentsSqlite(query, court, year, reportedOnly);
}

export async function countRelatedJudgments(
  query: string,
  court?: string,
  year?: string,
  reportedOnly = false
): Promise<number> {
  if (usePostgres()) {
    const count = await countPg(query, court, year, reportedOnly, true);
    if (count !== null) return count;
  }
  return countRelatedJudgmentsSqlite(query, court, year, reportedOnly);
}

export async function getJudgmentDbStats(): Promise<{ total: number; processed: number }> {
  if (usePostgres()) {
    try {
      const rows = await prisma.$queryRawUnsafe<{ total: bigint; processed: bigint }[]>(`
        SELECT COUNT(*)::bigint AS total, COALESCE(SUM(processed), 0)::bigint AS processed
        FROM legal_judgments
      `);
      return {
        total: Number(rows[0]?.total || 0),
        processed: Number(rows[0]?.processed || 0),
      };
    } catch {
      return { total: 0, processed: 0 };
    }
  }
  return getJudgmentDbStatsSqlite();
}

export async function getLocalJudgmentById(id: number): Promise<JudgmentRow | null> {
  if (usePostgres()) {
    try {
      const rows = await prisma.$queryRawUnsafe<JudgmentRow[]>(
        "SELECT * FROM legal_judgments WHERE id = $1 LIMIT 1",
        id
      );
      return rows[0] || null;
    } catch {
      return null;
    }
  }
  return getLocalJudgmentByIdSqlite(id);
}

export async function getJudgmentsByIds(
  ids: number[],
  query: string,
  opts: { court?: string; year?: string; reportedOnly?: boolean; limit?: number } = {}
): Promise<JudgmentSearchResult[]> {
  if (usePostgres()) {
    try {
      if (!ids.length) return [];
      const placeholders = ids.map((_, idx) => `$${idx + 1}`).join(",");
      const rows = await prisma.$queryRawUnsafe<any[]>(
        `
          SELECT id, citation, real_citation, court, year, title, processed,
                 substr(content, 1, 4000) AS content
          FROM legal_judgments
          WHERE id IN (${placeholders})
        `,
        ...ids
      );
      const byId = new Map<number, any>();
      for (const row of rows) byId.set(Number(row.id), row);

      const yearNum = opts.year && opts.year !== "All years" ? parseInt(opts.year) : null;
      const seen = new Set<string>();
      const out: JudgmentSearchResult[] = [];
      for (const id of ids) {
        const row = byId.get(id);
        if (!row) continue;
        if (opts.reportedOnly && !row.real_citation) continue;
        if (opts.court && opts.court !== "All Courts" && !(row.court || "").startsWith(opts.court)) continue;
        if (yearNum !== null && Number(row.year) !== yearNum) continue;
        const key = dedupeKey(row);
        if (seen.has(key)) continue;
        seen.add(key);
        out.push(toResult(row, query));
        if (out.length >= (opts.limit || 25)) break;
      }
      return out;
    } catch {
      return [];
    }
  }
  return getJudgmentsByIdsSqlite(ids, query, opts);
}

export async function findReportedByCitations(citations: string[]): Promise<Record<string, number>> {
  if (usePostgres()) {
    try {
      const norm = (value: string) => value.replace(/[^a-z0-9]/gi, "").toUpperCase();
      const keys = Array.from(new Set(citations.map(norm).filter((key) => key.length >= 4))).slice(0, 60);
      if (!keys.length) return {};

      const placeholders = keys.map((_, idx) => `$${idx + 1}`).join(",");
      const rows = await prisma.$queryRawUnsafe<{ id: number; real_citation: string }[]>(
        `
          SELECT id, real_citation
          FROM legal_judgments
          WHERE real_citation IS NOT NULL
            AND upper(regexp_replace(real_citation, '[^a-zA-Z0-9]', '', 'g')) IN (${placeholders})
        `,
        ...keys
      );

      const out: Record<string, number> = {};
      for (const row of rows) {
        const key = norm(row.real_citation);
        if (!(key in out)) out[key] = Number(row.id);
      }
      return out;
    } catch {
      return {};
    }
  }
  return findReportedByCitationsSqlite(citations);
}

export async function getCitedByCount(citation: string | null): Promise<number> {
  if (usePostgres()) {
    try {
      if (!citation) return 0;
      const key = citation.replace(/[^a-z0-9]/gi, "").toUpperCase();
      if (key.length < 5) return 0;
      const rows = await prisma.$queryRawUnsafe<{ n: number }[]>(
        "SELECT n FROM legal_cited_counts WHERE cited_key = $1 LIMIT 1",
        key
      );
      return Number(rows[0]?.n || 0);
    } catch {
      return 0;
    }
  }
  return getCitedByCountSqlite(citation);
}

export async function getCitedByCounts(citations: string[]): Promise<Record<string, number>> {
  if (usePostgres()) {
    try {
      const keys = Array.from(
        new Set(citations.map((citation) => citation.replace(/[^a-z0-9]/gi, "").toUpperCase()).filter((key) => key.length >= 5))
      ).slice(0, 120);
      if (!keys.length) return {};
      const placeholders = keys.map((_, idx) => `$${idx + 1}`).join(",");
      const rows = await prisma.$queryRawUnsafe<{ cited_key: string; n: number }[]>(
        `SELECT cited_key, n FROM legal_cited_counts WHERE cited_key IN (${placeholders})`,
        ...keys
      );
      const out: Record<string, number> = {};
      for (const row of rows) out[row.cited_key] = Number(row.n || 0);
      return out;
    } catch {
      return {};
    }
  }
  return getCitedByCountsSqlite(citations);
}
