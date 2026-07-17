/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from "fs";
import path from "path";
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
  searchCitationExact as searchCitationExactSqlite,
  searchSectionJudgments as searchSectionJudgmentsSqlite,
  getCitedByCounts as getCitedByCountsSqlite,
  deriveCourtFromContent,
  hasKnownCourt,
  type JudgmentRow,
  type JudgmentSearchResult,
  type SortMode,
} from "@/lib/judgment-db";

export type { JudgmentRow, JudgmentSearchResult, SortMode };

const SQLITE_JUDGMENTS = path.join(process.cwd(), "data", "judgments.db");
let _localSqlite: boolean | null = null;
function localSqliteAvailable(): boolean {
  if (_localSqlite === null) {
    try {
      _localSqlite = fs.existsSync(SQLITE_JUDGMENTS);
    } catch {
      _localSqlite = false;
    }
  }
  return _localSqlite;
}

function shouldUsePostgres(): boolean {
  const isPg = /^postgres(?:ql)?:\/\//i.test(process.env.DATABASE_URL || "");
  if (!isPg) return false;
  // PostgreSQL is the primary judgment store; SQLite is opt-in for local debugging only.
  return process.env.USE_SQLITE_JUDGMENTS !== "1";
}

function cleanSearchTerm(value: string): string {
  return value
    .replace(/["']/g, " ")
    .replace(/[^\p{L}\p{N}\s-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
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
  if (row.real_citation) return `citation:${String(row.real_citation).replace(/[^a-z0-9]/gi, "").toUpperCase()}`;
  if (row.content) return `content:${row.content.replace(/\s+/g, " ").trim().slice(0, 300).toLowerCase()}`;
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
  // Seat tag in the citation text is authoritative; stored court is often wrong.
  const court = deriveCourtFromContent(content) || (hasKnownCourt(row.court) ? String(row.court).trim() : "Unknown Court");
  return {
    id: Number(row.id),
    citation: real || row.citation,
    reported: !!real,
    court,
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

function statuteTagValues(query: string): string[] {
  const match = query.match(/\b(\d{1,4})\s*[-/]?\s*([A-Za-z])?\b/);
  if (!match) return [];

  const base = match[1];
  const suffix = match[2]?.toUpperCase() || "";
  const compactSection = `${base}${suffix}`;
  const dashedSection = suffix ? `${base}-${suffix}` : base;
  const underscoredSection = suffix ? `${base}_${suffix}` : base;
  const statutes: string[] = [];

  if (/\bppc\b|pakistan penal code|qatl|murder|homicide/i.test(query)) statutes.push("PPC");
  if (/\bcr\.?\s*p\.?\s*c\b|\bcrpc\b|code of criminal procedure/i.test(query)) statutes.push("CRPC");
  if (/\bc\.?\s*p\.?\s*c\b|\bcpc\b|civil procedure/i.test(query)) statutes.push("CPC");
  if (/\bqso\b|qanun|shahadat|evidence/i.test(query)) statutes.push("QSO");
  if (/\bconstitution|article|art\./i.test(query)) statutes.push("CONSTITUTION");

  // Bare section numbers are common in Case Builder. Try the main Pakistani
  // statutes, with PPC first because criminal sections like 302/324/489-F are
  // the most common bare-number inputs.
  if (!statutes.length) statutes.push("PPC", "CRPC", "CPC");

  const values: string[] = [];
  for (const statute of Array.from(new Set(statutes))) {
    values.push(`${statute}_${compactSection}`, `${statute}_${dashedSection}`, `${statute}_${underscoredSection}`);
  }

  return Array.from(new Set(values));
}

function statuteTagPrefixes(query: string): string[] {
  const exact = statuteTagValues(query);
  const match = query.match(/\b(\d{1,4})\s*[-/]?\s*([A-Za-z])?\b/);
  if (!match) return [];
  const hasSuffix = Boolean(match[2]);
  if (hasSuffix) return exact;

  return exact
    .filter((value) => /_\d{1,4}$/.test(value))
    .map((value) => `${value}%`);
}

function sectionRegexPattern(query: string): string | null {
  const match = query.match(/\b(\d{1,4})\s*[-/]?\s*([A-Za-z])?\b/);
  if (!match) return null;

  const base = match[1];
  const suffix = match[2]?.toUpperCase();
  const section = suffix
    ? `${base}\\s*[-/]?\\s*${suffix}`
    : `${base}\\s*(?:[-/]?\\s*[A-Za-z])?`;

  const statute = /ppc|pakistan penal code|murder|qatl|homicide/i.test(query)
    ? "(?:P\\.?\\s*P\\.?\\s*C\\.?|PPC|Pakistan\\s+Penal\\s+Code)"
    : "(?:P\\.?\\s*P\\.?\\s*C\\.?|PPC|Cr\\.?\\s*P\\.?\\s*C\\.?|CrPC|C\\.?\\s*P\\.?\\s*C\\.?|CPC|QSO|Constitution|Act|Ordinance)";

  return `(?:\\m(?:s\\.?|sec\\.?|section|sections|ss\\.?)\\s*(?:no\\.?\\s*)?${section}\\M|\\m${section}\\s*[-,;:/()]*\\s*${statute}\\M)`;
}

// Reporter / court abbreviations that carry no content meaning â€” dropping them
// from the keyword-fallback keeps "related" matching on real legal terms instead
// of on a year or a citation code (which would flood every same-year judgment).
const CITATION_NOISE = new Set([
  "scmr", "pld", "pcrlj", "mld", "clc", "ylr", "plj", "nlr", "sblr", "cld", "gblr",
  "klr", "lhr", "lhc", "khi", "hyd", "isb", "pesh", "scp", "shc", "fsc", "ihc",
]);

function isYearToken(term: string): boolean {
  return /^\d{4}$/.test(term) && Number(term) >= 1800 && Number(term) <= 2099;
}

function queryTerms(query: string): string[] {
  return query
    .split(/[^A-Za-z0-9]+/)
    // Real keywords only: drop short tokens, bare numbers (years, citation page
    // numbers), and reporter/court codes â€” none are content keywords.
    .filter((term) => term.length >= 4 && !/^\d+$/.test(term) && !isYearToken(term) && !CITATION_NOISE.has(term.toLowerCase()))
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
    const cleaned = cleanSearchTerm(query);
    // Primary (non-related): AND of every term â€” websearch_to_tsquery ANDs
    // unquoted words, so a result must contain ALL the searched keywords, not
    // just one. Related fallback: OR of the significant terms (broadest net).
    const expr = related ? anyExpr(queryTerms(query)) : (cleaned.length >= 2 ? cleaned : null);
    if (!expr) return [];

    // Inline the tsquery instead of a `WITH q â€¦ CROSS JOIN q` CTE. The CTE form
    // hides the tsquery from the planner, which then can't use the GIN index
    // (legal_judgments_search_idx) and falls back to a full seq scan of ~278k
    // rows â€” minutes over the slow proxy. Inlined, it uses a Bitmap Index Scan
    // (~10ms). $1 is the tsquery string and can be referenced multiple times.
    const tsq = "websearch_to_tsquery('simple', $1)";

    const params: any[] = [expr];
    const where = ["j.processed = 1"];
    addFilters(where, params, { court, year, reportedOnly });

    const citationLike = `%${query.trim()}%`;
    let matchSql = `${textVectorSql("j")} @@ ${tsq}`;
    if (!related && looksLikeCitation(query)) {
      params.push(citationLike);
      matchSql = `(${matchSql} OR j.citation ILIKE $${params.length} OR j.real_citation ILIKE $${params.length})`;
    }
    where.push(matchSql);

    // Relevance ordering: float exact-phrase matches to the very top, then rank
    // by how well the keywords match, before the quality/court tie-breakers.
    let phraseBoost = "";
    if (!related && sort === "relevance" && cleaned.length >= 2) {
      params.push(`"${cleaned}"`);
      phraseBoost = `(${textVectorSql("j")} @@ websearch_to_tsquery('simple', $${params.length})) DESC, `;
    }

    params.push(Math.min(350, Math.max(limit + offset + 25, (offset + limit) * 2)));

    const rows = await prisma.$queryRawUnsafe<any[]>(
      `
        SELECT j.id, j.citation, j.real_citation, j.court, j.year, j.title, j.processed,
               substr(j.content, 1, 4000) AS content,
               ts_rank_cd(${textVectorSql("j")}, ${tsq}) AS rank
        FROM legal_judgments j
        WHERE ${where.join(" AND ")}
        ORDER BY ${phraseBoost}${orderBy(sort, "j", "rank")}
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
  if (shouldUsePostgres()) {
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
  if (shouldUsePostgres()) {
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
  if (shouldUsePostgres()) {
    try {
      const tagValues = statuteTagValues(query);
      const tagPrefixes = statuteTagPrefixes(query);
      const tagResults: JudgmentSearchResult[] = [];

      if (tagValues.length || tagPrefixes.length) {
        const tagParams: any[] = [tagValues, tagPrefixes];
        const tagWhere = [
          "j.processed = 1",
          "(jt.tag_value = ANY($1::text[]) OR jt.tag_value ILIKE ANY($2::text[]))",
        ];
        addFilters(tagWhere, tagParams, { court, year, reportedOnly });
        tagParams.push(Math.min(120, Math.max(limit + offset + 20, (offset + limit) * 2)));

        const tagRows = await prisma.$queryRawUnsafe<any[]>(
          `
          SELECT j.id, j.citation, j.real_citation, j.court, j.year, j.title, j.processed,
                 substr(j.content, 1, 4000) AS content,
                 0 AS rank
            FROM legal_judgment_tags jt
            JOIN legal_judgments j ON j.id = jt.judgment_id
            WHERE ${tagWhere.join(" AND ")}
          ORDER BY (j.real_citation IS NOT NULL) DESC, ${courtPrioritySql("j")} ASC, j.year DESC, j.id ASC
          LIMIT $${tagParams.length}
        `,
          ...tagParams
        );

        tagResults.push(...dedupeRows(tagRows, limit, offset).map((row) => toResult(row, query)));
        if (tagResults.length >= limit) return tagResults.slice(0, limit);
      }

      const variants = sectionVariants(query);
      const expr = anyExpr(variants.slice(0, 4));
      if (!expr) return tagResults;

      // Inline the tsquery so the GIN index is used (see searchPg for details).
      const tsq = "websearch_to_tsquery('simple', $1)";
      const params: any[] = [expr];
      const where = ["j.processed = 1", `${textVectorSql("j")} @@ ${tsq}`];
      addFilters(where, params, { court, year, reportedOnly });
      const sectionRegex = sectionRegexPattern(query);
      if (sectionRegex) {
        params.push(sectionRegex);
        where.push(`COALESCE(j.content, '') ~* $${params.length}`);
      }
      params.push(Math.min(300, Math.max(limit + offset + 20, (offset + limit) * 2)));

      const rows = await prisma.$queryRawUnsafe<any[]>(
        `
          SELECT j.id, j.citation, j.real_citation, j.court, j.year, j.title, j.processed,
                 substr(j.content, 1, 4000) AS content,
                 ts_rank_cd(${textVectorSql("j")}, ${tsq}) AS rank
          FROM legal_judgments j
          WHERE ${where.join(" AND ")}
          ORDER BY rank DESC, (j.real_citation IS NOT NULL) DESC, ${courtPrioritySql("j")} ASC, j.year DESC, j.id ASC
          LIMIT $${params.length}
        `,
        ...params
      );
      return dedupeRows(
        [
          ...tagResults.map((result) => ({
            id: result.id,
            citation: result.citation,
            real_citation: result.reported ? result.citation : null,
            court: result.court,
            year: result.year,
            title: result.title,
            processed: result.processed,
            content: result.passages.join(" "),
          })),
          ...rows,
        ],
        limit,
        0
      ).map((row) => toResult(row, query));
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
    const cleaned = cleanSearchTerm(query);
    const expr = related ? anyExpr(queryTerms(query)) : (cleaned.length >= 2 ? cleaned : null);
    if (!expr) return 0;

    // Inline the tsquery so the GIN index is used (see searchPg for details).
    const tsq = "websearch_to_tsquery('simple', $1)";
    const params: any[] = [expr];
    const where = ["j.processed = 1", `${textVectorSql("j")} @@ ${tsq}`];
    addFilters(where, params, { court, year, reportedOnly });

    const rows = await prisma.$queryRawUnsafe<{ count: bigint }[]>(
      `
        SELECT COUNT(*)::bigint AS count
        FROM legal_judgments j
        WHERE ${where.join(" AND ")}
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
  if (shouldUsePostgres()) {
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
  if (shouldUsePostgres()) {
    const count = await countPg(query, court, year, reportedOnly, true);
    if (count !== null) return count;
  }
  return countRelatedJudgmentsSqlite(query, court, year, reportedOnly);
}

export async function getJudgmentDbStats(): Promise<{ total: number; processed: number }> {
  if (shouldUsePostgres()) {
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
  if (shouldUsePostgres()) {
    // Retry several times: a flaky proxy (or a transient Railway pool blip) can
    // drop a connection, and a single failure here otherwise surfaces as a bogus
    // "connection was slow" even though the judgment HAS content. Select only the
    // columns we need (lighter than SELECT *).
    let lastErr: unknown = null;
    for (let attempt = 0; attempt < 5; attempt++) {
      try {
        const rows = await prisma.$queryRawUnsafe<JudgmentRow[]>(
          "SELECT id, citation, real_citation, court, year, title, content, processed FROM legal_judgments WHERE id = $1 LIMIT 1",
          id
        );
        return rows[0] || null;
      } catch (e) {
        lastErr = e;
        await new Promise((r) => setTimeout(r, 400 + attempt * 300));
      }
    }
    // All attempts failed â€” signal a transient error (not "no such judgment")
    // so the caller can tell it apart from a genuine miss.
    throw lastErr instanceof Error ? lastErr : new Error("judgment lookup failed");
  }
  return getLocalJudgmentByIdSqlite(id);
}

export async function getJudgmentsByIds(
  ids: number[],
  query: string,
  opts: { court?: string; year?: string; reportedOnly?: boolean; limit?: number } = {}
): Promise<JudgmentSearchResult[]> {
  if (shouldUsePostgres()) {
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
  if (shouldUsePostgres()) {
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

// Citation-mode search: match the query against a judgment's OWN citation field
// (normalized, ignoring spaces/punctuation), NOT the full text. A citation number
// carries no topic, so a content search for "PLD 2019 SC 304" wrongly returns every
// judgment that merely mentions those tokens. Here we only return the judgment(s)
// whose real_citation/citation actually IS that reference.
export async function searchCitationExact(
  query: string,
  limit = 20,
  offset = 0,
  reportedOnly = false
): Promise<JudgmentSearchResult[]> {
  const key = query.replace(/[^a-z0-9]/gi, "").toUpperCase();
  if (key.length < 4) return [];
  if (shouldUsePostgres()) {
    try {
      const params: any[] = [key];
      const citationMatch = reportedOnly
        ? "(j.real_citation IS NOT NULL AND upper(regexp_replace(j.real_citation, '[^a-zA-Z0-9]', '', 'g')) = $1)"
        : "(upper(regexp_replace(COALESCE(j.real_citation, j.citation, ''), '[^a-zA-Z0-9]', '', 'g')) = $1)";
      params.push(Math.min(60, limit + offset + 5));
      const rows = await prisma.$queryRawUnsafe<any[]>(
        `
          SELECT j.id, j.citation, j.real_citation, j.court, j.year, j.title, j.processed,
                 substr(j.content, 1, 4000) AS content, 0 AS rank
          FROM legal_judgments j
          WHERE j.processed = 1 AND ${citationMatch}
          ORDER BY (j.real_citation IS NOT NULL) DESC, j.year DESC, j.id ASC
          LIMIT $${params.length}
        `,
        ...params
      );
      // One judgment per citation: collapse duplicate imports of the same
      // reference. Prefer a copy with a real court, then the one with the most
      // text (some are header-only stubs; others lost their court metadata).
      const norm = (v: any) => (v ? String(v).replace(/[^a-z0-9]/gi, "").toUpperCase() : "");
      const better = (r: any, prev: any) => {
        const rc = hasKnownCourt(r.court), pc = hasKnownCourt(prev.court);
        if (rc !== pc) return rc;
        return (r.content?.length || 0) > (prev.content?.length || 0);
      };
      const best = new Map<string, any>();
      for (const row of rows) {
        const k = norm(row.real_citation) || norm(row.citation) || `id:${row.id}`;
        const prev = best.get(k);
        if (!prev || better(row, prev)) best.set(k, row);
      }
      return Array.from(best.values()).slice(offset, offset + limit).map((row) => toResult(row, query));
    } catch {
      return [];
    }
  }
  return searchCitationExactSqlite(query, limit, offset, reportedOnly);
}

export async function getCitedByCount(citation: string | null): Promise<number> {
  if (shouldUsePostgres()) {
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
  if (shouldUsePostgres()) {
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
