/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-explicit-any */
import path from "path";
import fs from "fs";

const DB_PATH = path.join(process.cwd(), "data", "judgments.db");
const CITE_DB_PATH = path.join(process.cwd(), "data", "citations.db");

export type SortMode = "relevance" | "newest" | "oldest" | "cited";

export interface JudgmentRow {
  id: number;
  citation: string;
  court: string;
  year: number;
  content: string | null;
  processed: number;
  title: string | null;
  real_citation: string | null;
}

export interface JudgmentSearchResult {
  id: number;
  /** Reported citation if we have one, else the raw import id. */
  citation: string;
  /** True when `citation` is a real reported citation (e.g. "2013 YLR 2054"). */
  reported: boolean;
  court: string;
  year: number;
  /** Party names "X vs Y" when we could extract them, else null. */
  title: string | null;
  /** Case number label used as a fallback heading when title is null. */
  caseNo: string | null;
  /** Matching excerpts for the snippet carousel. */
  passages: string[];
  processed: number;
  related?: boolean;
  citedBy?: number;
}

let _db: any = null;

function getDb(): any {
  if (_db) return _db;
  if (!fs.existsSync(DB_PATH)) return null;
  const { DatabaseSync } = require("node:sqlite");
  // Open read-only: the app never writes the judgment corpus at runtime (it's
  // built offline by the Python scrapers). A read-write connection in WAL mode
  // grows/checkpoints the .db-wal/.db-shm files on every search, which churns
  // the data/ folder and makes the dev file-watcher reload the page (the
  // "flashing window" + lag). Read-only avoids that and is marginally faster.
  _db = new DatabaseSync(DB_PATH, { readOnly: true });
  return _db;
}

// ── Full-text search (FTS5) ────────────────────────────────────────────────────
// data/judgments.db has an external-content FTS5 index `judgments_fts` (built by
// scripts/pg-migrate/build-judgments-fts.mjs). Searching it with MATCH replaces a
// 3.4GB `content LIKE '%...%'` table scan (47s -> ~5ms). If the index is absent
// (e.g. an un-indexed corpus copy) every helper falls back to the old LIKE path,
// so search keeps working either way.
let _hasFts: boolean | null = null;
function hasFts(db: any): boolean {
  if (_hasFts !== null) return _hasFts;
  try {
    _hasFts = !!db
      .prepare("SELECT 1 FROM sqlite_master WHERE type='table' AND name='judgments_fts'")
      .get();
  } catch {
    _hasFts = false;
  }
  return _hasFts;
}

/** Subquery that resolves an FTS MATCH (bound as the next `?`) to judgment ids. */
const FTS_MATCH_SUBQ =
  "id IN (SELECT rowid FROM judgments_fts WHERE judgments_fts MATCH ?)";

function cleanFtsTerm(t: string): string {
  return t
    .replace(/["']/g, " ")
    .replace(/[^\p{L}\p{N}\s-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}
/** Whole query as one quoted phrase — mirrors the old `LIKE '%query%'` adjacency. */
function ftsPhrase(query: string): string | null {
  const cleaned = cleanFtsTerm(query);
  return cleaned.length >= 2 ? `"${cleaned}"` : null;
}
/** Does the query look like a reported citation (e.g. "2013 YLR 2054", "PLD 2020
 *  SC 1")? Only then do we OR-in the citation/real_citation columns — those LIKE
 *  scans cost a full table pass, so plain text queries skip them and stay on the
 *  FTS index. */
const CITATION_RE =
  /\b(19|20)\d{2}\b|\b(SCMR|PLD|PCrLJ|PCRLJ|MLD|CLC|YLR|PLJ|NLR|SBLR|CLD|GBLR|KLR)\b/i;
function looksLikeCitation(query: string): boolean {
  return CITATION_RE.test(query);
}

/** Every significant token quoted and AND-joined — a result must contain them
 *  all (FTS5 default is AND, but we make it explicit for clarity). This replaces
 *  the old whole-query phrase match, which required the words to be adjacent and
 *  so failed on most real searches, dropping to the loose any-term fallback. */
function ftsAllOf(query: string): string | null {
  const parts = cleanFtsTerm(query)
    .split(/\s+/)
    .filter((t) => t.length >= 2)
    .map((t) => `"${t}"`);
  return parts.length ? parts.join(" AND ") : null;
}

// Reporter / court abbreviations carry no content meaning — dropped from the
// keyword fallback so "related" matches real legal terms, not a year or code.
const CITATION_NOISE = new Set([
  "scmr", "pld", "pcrlj", "mld", "clc", "ylr", "plj", "nlr", "sblr", "cld", "gblr",
  "klr", "lhr", "lhc", "khi", "hyd", "isb", "pesh", "scp", "shc", "fsc", "ihc",
]);
function isYearToken(t: string): boolean {
  return /^\d{4}$/.test(t) && Number(t) >= 1800 && Number(t) <= 2099;
}
/** Significant keyword tokens for the related-judgment fallback. */
function relatedTerms(query: string): string[] {
  return query
    .split(/[^A-Za-z0-9]+/)
    // Real keywords only: drop short tokens, bare numbers (years, citation page
    // numbers), and reporter/court codes — none are content keywords.
    .filter((t) => t.length >= 4 && !/^\d+$/.test(t) && !isYearToken(t) && !CITATION_NOISE.has(t.toLowerCase()))
    .slice(0, 6);
}

/** Each term quoted and OR-joined — mirrors the old `content LIKE ? OR ...`. */
function ftsAnyOf(terms: string[]): string | null {
  const parts = terms
    .map(cleanFtsTerm)
    .filter((t) => t.length >= 2)
    .map((t) => `"${t}"`);
  return parts.length ? parts.join(" OR ") : null;
}

// Separate citation-network DB (built offline by scripts/build_citation_index.py).
// Opened lazily; absent until the index is built, so every consumer degrades to 0.
let _citeDb: any = null;
function getCiteDb(): any {
  if (_citeDb) return _citeDb;
  try {
    if (!fs.existsSync(CITE_DB_PATH)) return null;
    const { DatabaseSync } = require("node:sqlite");
    _citeDb = new DatabaseSync(CITE_DB_PATH, { readOnly: true });
    return _citeDb;
  } catch {
    return null;
  }
}

/** How many judgments in the corpus cite this judgment — a "good law" signal. */
export function getCitedByCount(citation: string | null): number {
  try {
    if (!citation) return 0;
    const key = citation.replace(/[^a-z0-9]/gi, "").toUpperCase();
    return getCitedByCounts([citation])[key] || 0;
  } catch {
    return 0;
  }
}

export function getCitedByCounts(citations: string[]): Record<string, number> {
  try {
    const cdb = getCiteDb();
    if (!cdb) return {};
    const keys = Array.from(
      new Set(citations.map((citation) => citation.replace(/[^a-z0-9]/gi, "").toUpperCase()).filter((key) => key.length >= 5))
    ).slice(0, 120);
    if (!keys.length) return {};
    const placeholders = keys.map(() => "?").join(",");
    const rows = cdb.prepare(`SELECT cited_key, n FROM cited_counts WHERE cited_key IN (${placeholders})`).all(...keys) as { cited_key: string; n: number }[];
    const out: Record<string, number> = {};
    for (const row of rows) out[row.cited_key] = Number(row.n || 0);
    return out;
  } catch {
    return {};
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const CASE_NO = /\b((?:W\.?P|Crl\.?\s?A|C\.?R|F\.?A\.?O|R\.?F\.?A|Civil Revision|Writ Petition|Cr\.?\s?Misc|Crl\.?\s?Misc|Election Petition|Suit|Appeal|R\.?S\.?A|I\.?C\.?A|Constitution Petition)[^\n.]{0,40}?No\.?\s*[0-9][0-9A-Za-z\-/ ]{0,18})/i;

function extractCaseNo(content: string | null): string | null {
  if (!content) return null;
  const m = content.slice(0, 1200).match(CASE_NO);
  return m ? m[1].replace(/\s+/g, " ").trim() : null;
}

/** Build up to `max` excerpts around occurrences of the query terms. */
function buildPassages(content: string | null, query: string, max = 4): string[] {
  if (!content) return [];
  const clean = content.replace(/\s+/g, " ").trim();
  const terms = query
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length >= 3);

  const lower = clean.toLowerCase();
  const windows: string[] = [];
  const used: Array<[number, number]> = [];

  const pushWindow = (idx: number) => {
    const start = Math.max(0, idx - 90);
    const end = Math.min(clean.length, idx + 200);
    // skip if it overlaps a window we already kept
    if (used.some(([s, e]) => idx >= s && idx <= e)) return;
    used.push([start, end]);
    let frag = clean.slice(start, end).trim();
    if (start > 0) frag = "… " + frag;
    if (end < clean.length) frag = frag + " …";
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

  // Fallback: opening of the judgment (skip the header block)
  if (windows.length === 0) {
    const body = clean.replace(/^.{0,300}?(JUDGMENT|ORDER)\s+/i, "").trim();
    windows.push(body.slice(0, 260).trim() + (body.length > 260 ? " …" : ""));
  }
  return windows;
}

function courtPrioritySql(): string {
  return `CASE
    WHEN court LIKE 'Supreme Court%' THEN 0
    WHEN court LIKE 'Lahore High Court%' THEN 1
    WHEN court LIKE 'Federal Shariat Court%' THEN 2
    WHEN court LIKE 'Islamabad High Court%' THEN 3
    WHEN court LIKE 'Peshawar High Court%' THEN 3
    WHEN court LIKE 'Balochistan High Court%' THEN 3
    WHEN court LIKE 'Sindh High Court%' THEN 4
    ELSE 5
  END`;
}

function orderBy(sort: SortMode): string {
  if (sort === "newest") return "year DESC, id DESC";
  if (sort === "oldest") return "year ASC, id ASC";
  // relevance: quality signals first, court hierarchy as a tie-breaker rather than a monopoly
  return "(real_citation IS NOT NULL) DESC, (title IS NOT NULL) DESC, year DESC, " + `${courtPrioritySql()} ASC, id ASC`;
}

/** The archive contains many exact-duplicate imports of the same judgment.
 *  Collapse them by a normalised prefix of the text so each judgment shows once. */
function dedupeKey(r: any): string {
  if (r.content) return r.content.replace(/\s+/g, " ").trim().slice(0, 300).toLowerCase();
  if (r.real_citation) return String(r.real_citation).toLowerCase();
  return `id:${r.id}`;
}

function dedupeRows(rows: any[], limit: number, offset = 0): any[] {
  const seen = new Set<string>();
  const out: any[] = [];
  let skipped = 0;
  for (const r of rows) {
    const k = dedupeKey(r);
    if (seen.has(k)) continue;
    seen.add(k);
    // skip the unique rows belonging to earlier pages
    if (skipped < offset) { skipped++; continue; }
    out.push(r);
    if (out.length >= limit) break;
  }
  return out;
}

// Map a law-report "seat" (the [City] tag reported citations carry, e.g.
// "2017 P Cr. L J 25[Peshawar]") to its court name.
function courtFromSeat(seat: string): string | null {
  const s = seat.toLowerCase();
  if (s.includes("peshawar")) return "Peshawar High Court";
  if (s.includes("lahore")) return "Lahore High Court";
  if (s.includes("karachi") || s.includes("sindh") || s.includes("hyderabad") || s.includes("sukkur")) return "Sindh High Court";
  if (s.includes("quetta") || s.includes("baluchistan") || s.includes("balochistan")) return "Balochistan High Court";
  if (s.includes("islamabad")) return "Islamabad High Court";
  if (s.includes("gilgit")) return "Gilgit-Baltistan Chief Court";
  if (s.includes("azad") || s.includes("kashmir")) return "Azad Jammu & Kashmir High Court";
  if (s.includes("federal shariat")) return "Federal Shariat Court";
  if (s.includes("supreme")) return "Supreme Court of Pakistan";
  return null;
}

/** Recover a missing/Unknown court from the "[City]" seat tag at the top of a
 *  reported judgment's text. Returns null when no confident seat is found. */
export function deriveCourtFromContent(content: string | null): string | null {
  if (!content) return null;
  const m = content.slice(0, 140).match(/\[\s*([A-Za-z][A-Za-z .&]{2,39}?)\s*\]/);
  return m ? courtFromSeat(m[1]) : null;
}

/** True when a stored court value is real (not blank / "Unknown"). */
export function hasKnownCourt(court: any): boolean {
  const c = court && String(court).trim();
  return !!c && c.toLowerCase() !== "unknown";
}

function toResult(r: any, query: string, related = false): JudgmentSearchResult {
  const real = r.real_citation && String(r.real_citation).trim();
  // The "[City]" seat tag reported citations carry is authoritative — the scraped
  // court column is often blank or wrong (the same citation appears tagged to
  // different courts). Trust the seat first, fall back to the stored court.
  const court = deriveCourtFromContent(r.content) || (hasKnownCourt(r.court) ? String(r.court).trim() : "Unknown Court");
  return {
    id: r.id,
    citation: real || r.citation,
    reported: !!real,
    court,
    year: r.year || 0,
    title: r.title || null,
    caseNo: r.title ? null : extractCaseNo(r.content),
    passages: buildPassages(r.content, query),
    processed: r.processed,
    related,
  };
}

// ── Search ───────────────────────────────────────────────────────────────────

export function searchLocalJudgments(
  query: string,
  court?: string,
  year?: string,
  limit = 25,
  sort: SortMode = "relevance",
  offset = 0,
  reportedOnly = false
): JudgmentSearchResult[] {
  try {
    const db = getDb();
    if (!db || !query.trim()) return [];

    // AND of every keyword: the result must contain them all, not merely be
    // adjacent (the old phrase match) or share a single word (the loose fallback).
    const matchExpr = hasFts(db) ? ftsAllOf(query) : null;
    const params: (string | number)[] = [];
    let where: string;
    if (matchExpr && !looksLikeCitation(query)) {
      // common case: plain text search — pure FTS, no full-scan citation OR
      where = `(processed = 1 AND ${FTS_MATCH_SUBQ})`;
      params.push(matchExpr);
    } else {
      // citation-style query (or no FTS): also match the citation columns
      const likeQ = `%${query.trim()}%`;
      const contentClause = matchExpr
        ? `(processed = 1 AND ${FTS_MATCH_SUBQ})`
        : "(processed = 1 AND content LIKE ?)";
      where = `(citation LIKE ? COLLATE NOCASE OR real_citation LIKE ? COLLATE NOCASE OR ${contentClause})`;
      params.push(likeQ, likeQ, matchExpr ?? likeQ);
    }
    if (reportedOnly) where += " AND real_citation IS NOT NULL";

    if (court && court !== "All Courts") {
      where += " AND court LIKE ?";
      params.push(`${court}%`);
    }
    if (year && year !== "All years") {
      where += " AND year = ?";
      params.push(parseInt(year));
    }
    // Over-fetch so we can drop duplicate imports and still fill every page up to `offset`.
    params.push((offset + limit) * 6);

    const sql = `
      SELECT id, citation, real_citation, court, year, title, processed,
        CASE WHEN content IS NOT NULL THEN substr(content, 1, 4000) ELSE NULL END AS content
      FROM judgments
      WHERE ${where}
      ORDER BY ${orderBy(sort)}
      LIMIT ?
    `;

    const rows = db.prepare(sql).all(...params) as any[];
    return dedupeRows(rows, limit, offset).map((r) => toResult(r, query));
  } catch {
    return [];
  }
}

/** Citation-mode search: return only judgments whose OWN citation IS the query
 *  reference (normalized, ignoring spaces/punctuation) — never a content match. */
export function searchCitationExact(
  query: string,
  limit = 20,
  offset = 0,
  reportedOnly = false
): JudgmentSearchResult[] {
  try {
    const db = getDb();
    const key = query.replace(/[^a-z0-9]/gi, "").toUpperCase();
    if (!db || key.length < 4) return [];

    // Cheap pre-filter on the citation columns, then an exact normalized check in
    // JS. Separators can appear INSIDE a stored citation ("2019 Y L R 757"), so put
    // a wildcard between every character rather than only between query tokens.
    const likeQ = "%" + key.split("").join("%") + "%";
    let where = "(citation LIKE ? COLLATE NOCASE OR real_citation LIKE ? COLLATE NOCASE)";
    const params: (string | number)[] = [likeQ, likeQ];
    if (reportedOnly) where += " AND real_citation IS NOT NULL";
    params.push((offset + limit) * 6 + 20);

    const sql = `
      SELECT id, citation, real_citation, court, year, title, processed,
        CASE WHEN content IS NOT NULL THEN substr(content, 1, 4000) ELSE NULL END AS content
      FROM judgments
      WHERE processed = 1 AND ${where}
      ORDER BY (real_citation IS NOT NULL) DESC, year DESC, id ASC
      LIMIT ?
    `;
    const norm = (v: string | null) => (v ? String(v).replace(/[^a-z0-9]/gi, "").toUpperCase() : "");
    const matched = (db.prepare(sql).all(...params) as any[]).filter(
      (r) => norm(r.real_citation) === key || norm(r.citation) === key
    );
    // One judgment per citation: collapse duplicate imports of the same reference.
    // Prefer a copy that carries a real court, then the one with the most text
    // (some imports are header-only stubs; others lost their court metadata).
    const better = (r: any, prev: any) => {
      const rc = hasKnownCourt(r.court), pc = hasKnownCourt(prev.court);
      if (rc !== pc) return rc;
      return (r.content?.length || 0) > (prev.content?.length || 0);
    };
    const best = new Map<string, any>();
    for (const r of matched) {
      const k = norm(r.real_citation) || norm(r.citation) || `id:${r.id}`;
      const prev = best.get(k);
      if (!prev || better(r, prev)) best.set(k, r);
    }
    return Array.from(best.values()).slice(offset, offset + limit).map((r) => toResult(r, query));
  } catch {
    return [];
  }
}

function sectionVariants(query: string): string[] {
  const cleaned = query.trim();
  const match = cleaned.match(/\b(\d{2,4})\s*[-/]?\s*([A-Za-z])?\b/);
  if (!match) return [];
  const base = match[1];
  const suffix = match[2]?.toUpperCase();
  return Array.from(new Set([
    cleaned,
    suffix ? `${base}-${suffix}` : base,
    suffix ? `${base}${suffix}` : base,
    suffix ? `${base} ${suffix}` : base,
    `section ${suffix ? `${base}-${suffix}` : base}`,
    `sec ${suffix ? `${base}-${suffix}` : base}`,
  ].filter((v) => v.length >= 2)));
}

/** Fast, section-focused search for legal sections such as 295-C or 497 CrPC. */
export function searchSectionJudgments(
  query: string,
  court?: string,
  year?: string,
  limit = 16,
  offset = 0,
  reportedOnly = false
): JudgmentSearchResult[] {
  try {
    const db = getDb();
    const variants = sectionVariants(query);
    if (!db || variants.length === 0) return [];

    const seen = new Set<string>();
    const rows: any[] = [];
    const addRows = (batch: any[]) => {
      for (const row of batch) {
        const key = dedupeKey(row);
        if (seen.has(key)) continue;
        seen.add(key);
        rows.push(row);
        if (rows.length >= offset + limit) break;
      }
    };

    const buildFilters = () => {
      const params: (string | number)[] = [];
      let where = "1=1";
      if (reportedOnly) where += " AND real_citation IS NOT NULL";
      if (court && court !== "All Courts") { where += " AND court LIKE ?"; params.push(`${court}%`); }
      if (year && year !== "All years") { where += " AND year = ?"; params.push(parseInt(year)); }
      return { where, params };
    };

    const useFts = hasFts(db);
    for (const variant of variants.slice(0, 2)) {
      if (rows.length >= offset + limit) break;
      const phrase = useFts ? ftsPhrase(variant) : null;
      const matchClause = phrase ? FTS_MATCH_SUBQ : "content LIKE ? COLLATE NOCASE";
      const matchParam = phrase ?? `%${variant}%`;
      const { where, params } = buildFilters();
      const contentRows = db.prepare(`
        SELECT id, citation, real_citation, court, year, title, processed,
          CASE WHEN content IS NOT NULL THEN substr(content, 1, 4000) ELSE NULL END AS content
        FROM judgments
        WHERE ${where} AND processed = 1 AND ${matchClause}
        ORDER BY year DESC, ${courtPrioritySql()} ASC, id ASC
        LIMIT ?
      `).all(...params, matchParam, Math.max(4, offset + limit - rows.length)) as any[];
      addRows(contentRows);
    }

    return rows.slice(offset, offset + limit).map((r) => toResult(r, query));
  } catch {
    return [];
  }
}

/**
 * Fallback when an exact search finds nothing: tokenise the query and match
 * any significant keyword, so the user always gets related judgments instead
 * of a dead end.
 */
export function relatedLocalJudgments(
  query: string,
  court?: string,
  year?: string,
  limit = 15,
  sort: SortMode = "relevance",
  offset = 0,
  reportedOnly = false
): JudgmentSearchResult[] {
  try {
    const db = getDb();
    if (!db) return [];

    const terms = relatedTerms(query);
    if (!terms.length) return [];

    const expr = hasFts(db) ? ftsAnyOf(terms) : null;
    const params: (string | number)[] = expr ? [expr] : terms.map((t) => `%${t}%`);
    const contentMatch = expr
      ? FTS_MATCH_SUBQ
      : `(${terms.map(() => "content LIKE ? COLLATE NOCASE").join(" OR ")})`;

    let where = `processed = 1 AND ${contentMatch}`;
    if (reportedOnly) where += " AND real_citation IS NOT NULL";
    if (court && court !== "All Courts") {
      where += " AND court LIKE ?";
      params.push(`${court}%`);
    }
    if (year && year !== "All years") {
      where += " AND year = ?";
      params.push(parseInt(year));
    }
    params.push((offset + limit) * 6);

    const sql = `
      SELECT id, citation, real_citation, court, year, title, processed,
        CASE WHEN content IS NOT NULL THEN substr(content, 1, 4000) ELSE NULL END AS content
      FROM judgments
      WHERE ${where}
      ORDER BY ${orderBy(sort)}
      LIMIT ?
    `;

    const rows = db.prepare(sql).all(...params) as any[];
    return dedupeRows(rows, limit, offset).map((r) => toResult(r, query, true));
  } catch {
    return [];
  }
}

/** In-memory court priority, mirroring courtPrioritySql() for JS-side sorting. */
function courtRankJs(court: string | null): number {
  const c = court || "";
  if (c.startsWith("Supreme Court")) return 0;
  if (c.startsWith("Lahore High Court")) return 1;
  if (c.startsWith("Federal Shariat Court")) return 2;
  if (c.startsWith("Islamabad High Court")) return 3;
  if (c.startsWith("Peshawar High Court")) return 3;
  if (c.startsWith("Balochistan High Court")) return 3;
  if (c.startsWith("Sindh High Court")) return 4;
  return 5;
}

/**
 * Fast candidate gathering for Case Builder.
 *
 * A SQL `ORDER BY relevance` over the ~240k-row table combined with `content LIKE`
 * forces SQLite to scan and sort every match — ~80s for a common term, which blew
 * past the client's 60s abort. This runs a single combined OR query with NO SQL
 * ORDER BY (so `LIMIT` short-circuits the scan after enough rows), then dedupes and
 * relevance-sorts the small result set in memory. Returns in ~1-2s.
 */
export function searchCandidatesFast(
  terms: string[],
  court?: string,
  year?: string,
  limit = 30
): JudgmentSearchResult[] {
  try {
    const db = getDb();
    if (!db) return [];

    const cleaned = Array.from(
      new Set(terms.map((t) => t.trim()).filter((t) => t.length >= 2))
    ).slice(0, 8);
    if (!cleaned.length) return [];

    const expr = hasFts(db) ? ftsAnyOf(cleaned) : null;
    const params: (string | number)[] = expr ? [expr] : cleaned.map((t) => `%${t}%`);
    const contentMatch = expr
      ? FTS_MATCH_SUBQ
      : `(${cleaned.map(() => "content LIKE ? COLLATE NOCASE").join(" OR ")})`;
    let where = `processed = 1 AND ${contentMatch}`;
    if (court && court !== "All Courts") {
      where += " AND court LIKE ?";
      params.push(`${court}%`);
    }
    if (year && year !== "All years") {
      where += " AND year = ?";
      params.push(parseInt(year));
    }
    // Over-fetch raw rows so dedupe still leaves enough unique judgments. No ORDER BY.
    params.push(Math.min(600, Math.max(300, limit * 12)));

    const sql = `
      SELECT id, citation, real_citation, court, year, title, processed,
        CASE WHEN content IS NOT NULL THEN substr(content, 1, 4000) ELSE NULL END AS content
      FROM judgments
      WHERE ${where}
      LIMIT ?
    `;

    const rows = db.prepare(sql).all(...params) as any[];
    const deduped = dedupeRows(rows, rows.length, 0);
    deduped.sort((a, b) => {
      const ra = a.real_citation ? 1 : 0;
      const rb = b.real_citation ? 1 : 0;
      if (ra !== rb) return rb - ra;
      const ta = a.title ? 1 : 0;
      const tb = b.title ? 1 : 0;
      if (ta !== tb) return tb - ta;
      if ((b.year || 0) !== (a.year || 0)) return (b.year || 0) - (a.year || 0);
      return courtRankJs(a.court) - courtRankJs(b.court);
    });

    const passageQuery = cleaned.join(" ");
    return deduped.slice(0, limit).map((r) => toResult(r, passageQuery));
  } catch {
    return [];
  }
}

/**
 * Hydrate a ranked list of judgment ids (from semantic search) into results,
 * preserving the incoming order and applying the same filters/dedupe as keyword
 * search. `query` is only used to build snippet excerpts.
 */
export function getJudgmentsByIds(
  ids: number[],
  query: string,
  opts: { court?: string; year?: string; reportedOnly?: boolean; limit?: number } = {}
): JudgmentSearchResult[] {
  try {
    const db = getDb();
    if (!db || !ids.length) return [];

    const placeholders = ids.map(() => "?").join(",");
    const sql = `
      SELECT id, citation, real_citation, court, year, title, processed,
        CASE WHEN content IS NOT NULL THEN substr(content, 1, 4000) ELSE NULL END AS content
      FROM judgments WHERE id IN (${placeholders})
    `;
    const rows = db.prepare(sql).all(...ids) as any[];
    const byId = new Map<number, any>();
    for (const r of rows) byId.set(r.id, r);

    const { court, year, reportedOnly = false, limit = 25 } = opts;
    const yearNum = year && year !== "All years" ? parseInt(year) : null;
    const seen = new Set<string>();
    const out: JudgmentSearchResult[] = [];

    for (const id of ids) {
      const r = byId.get(id);
      if (!r) continue;
      if (reportedOnly && !r.real_citation) continue;
      if (court && court !== "All Courts" && !(r.court || "").startsWith(court)) continue;
      if (yearNum !== null && r.year !== yearNum) continue;
      const key = dedupeKey(r);
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(toResult(r, query));
      if (out.length >= limit) break;
    }
    return out;
  } catch {
    return [];
  }
}

/** Count distinct (deduped) judgments matching an exact search — for pagination. */
export function countLocalJudgments(query: string, court?: string, year?: string, reportedOnly = false): number {
  try {
    const db = getDb();
    if (!db || !query.trim()) return 0;

    // Mirror searchLocalJudgments: AND of every keyword so the count matches the
    // results shown.
    const matchExpr = hasFts(db) ? ftsAllOf(query) : null;
    const params: (string | number)[] = [];
    let where: string;
    if (matchExpr && !looksLikeCitation(query)) {
      where = `(processed = 1 AND ${FTS_MATCH_SUBQ})`;
      params.push(matchExpr);
    } else {
      const likeQ = `%${query.trim()}%`;
      const contentClause = matchExpr
        ? `(processed = 1 AND ${FTS_MATCH_SUBQ})`
        : "(processed = 1 AND content LIKE ?)";
      where = `(citation LIKE ? COLLATE NOCASE OR real_citation LIKE ? COLLATE NOCASE OR ${contentClause})`;
      params.push(likeQ, likeQ, matchExpr ?? likeQ);
    }
    if (reportedOnly) where += " AND real_citation IS NOT NULL";
    if (court && court !== "All Courts") { where += " AND court LIKE ?"; params.push(`${court}%`); }
    if (year && year !== "All years") { where += " AND year = ?"; params.push(parseInt(year)); }

    const sql = `
      SELECT id, real_citation,
        CASE WHEN content IS NOT NULL THEN substr(content, 1, 300) ELSE NULL END AS content
      FROM judgments WHERE ${where} LIMIT 20000
    `;
    const rows = db.prepare(sql).all(...params) as any[];
    const seen = new Set<string>();
    for (const r of rows) seen.add(dedupeKey(r));
    return seen.size;
  } catch {
    return 0;
  }
}

/** Count distinct (deduped) related judgments (keyword fallback) — for pagination. */
export function countRelatedJudgments(query: string, court?: string, year?: string, reportedOnly = false): number {
  try {
    const db = getDb();
    if (!db) return 0;
    const terms = relatedTerms(query);
    if (!terms.length) return 0;

    const expr = hasFts(db) ? ftsAnyOf(terms) : null;
    const params: (string | number)[] = expr ? [expr] : terms.map((t) => `%${t}%`);
    const contentMatch = expr
      ? FTS_MATCH_SUBQ
      : `(${terms.map(() => "content LIKE ? COLLATE NOCASE").join(" OR ")})`;
    let where = `processed = 1 AND ${contentMatch}`;
    if (reportedOnly) where += " AND real_citation IS NOT NULL";
    if (court && court !== "All Courts") { where += " AND court LIKE ?"; params.push(`${court}%`); }
    if (year && year !== "All years") { where += " AND year = ?"; params.push(parseInt(year)); }

    const sql = `
      SELECT id, real_citation,
        CASE WHEN content IS NOT NULL THEN substr(content, 1, 300) ELSE NULL END AS content
      FROM judgments WHERE ${where} LIMIT 20000
    `;
    const rows = db.prepare(sql).all(...params) as any[];
    const seen = new Set<string>();
    for (const r of rows) seen.add(dedupeKey(r));
    return seen.size;
  } catch {
    return 0;
  }
}

export function getLocalJudgmentById(id: number): JudgmentRow | null {
  try {
    const db = getDb();
    if (!db) return null;
    return db.prepare("SELECT * FROM judgments WHERE id = ?").get(id) as JudgmentRow | null;
  } catch {
    return null;
  }
}

/**
 * Verify a batch of citation strings against the reported-citation column.
 * DB citations are spaced ("2010 C L C 1169"); inputs are compact ("2010 CLC 1169").
 * Both sides are normalised to alphanumerics so they match. Scans only the
 * ~26k reported rows (real_citation IS NOT NULL), so it's a single fast query.
 * Returns a map of normalised-citation → judgment id.
 */
export function findReportedByCitations(citations: string[]): Record<string, number> {
  try {
    const db = getDb();
    if (!db || !citations.length) return {};
    const norm = (s: string) => s.replace(/[^a-z0-9]/gi, "").toUpperCase();
    const keys = Array.from(new Set(citations.map(norm).filter((k) => k.length >= 4))).slice(0, 60);
    if (!keys.length) return {};

    const placeholders = keys.map(() => "?").join(",");
    const sql = `
      SELECT id, real_citation FROM judgments
      WHERE real_citation IS NOT NULL
        AND UPPER(REPLACE(REPLACE(REPLACE(REPLACE(real_citation,' ',''),'.',''),'-',''),',','')) IN (${placeholders})
    `;
    const rows = db.prepare(sql).all(...keys) as { id: number; real_citation: string }[];
    const out: Record<string, number> = {};
    for (const r of rows) {
      const k = norm(r.real_citation);
      if (!(k in out)) out[k] = r.id; // first (lowest id) wins
    }
    return out;
  } catch {
    return {};
  }
}

export function getJudgmentDbStats(): { total: number; processed: number } {
  try {
    const db = getDb();
    if (!db) return { total: 0, processed: 0 };
    const row = db
      .prepare("SELECT COUNT(*) as total, COALESCE(SUM(processed), 0) as processed FROM judgments")
      .get() as { total: number; processed: number };
    return row;
  } catch {
    return { total: 0, processed: 0 };
  }
}
