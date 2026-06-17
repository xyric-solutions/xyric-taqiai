/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-explicit-any */
import path from "path";
import fs from "fs";

const DB_PATH = path.join(process.cwd(), "data", "judgments.db");
const CITE_DB_PATH = path.join(process.cwd(), "data", "citations.db");

export type SortMode = "relevance" | "newest" | "oldest";

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
    const cdb = getCiteDb();
    if (!cdb) return 0;
    const key = citation.replace(/[^a-z0-9]/gi, "").toUpperCase();
    if (key.length < 5) return 0;
    const row = cdb.prepare("SELECT n FROM cited_counts WHERE cited_key = ?").get(key) as any;
    return row?.n || 0;
  } catch {
    return 0;
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

function toResult(r: any, query: string, related = false): JudgmentSearchResult {
  const real = r.real_citation && String(r.real_citation).trim();
  return {
    id: r.id,
    citation: real || r.citation,
    reported: !!real,
    court: r.court || "Unknown Court",
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

    const likeQ = `%${query.trim()}%`;
    const params: (string | number)[] = [likeQ, likeQ, likeQ];

    let where =
      "(citation LIKE ? COLLATE NOCASE OR real_citation LIKE ? COLLATE NOCASE OR (processed = 1 AND content LIKE ?))";
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

    for (const variant of variants.slice(0, 2)) {
      if (rows.length >= offset + limit) break;
      const likeQ = `%${variant}%`;
      const { where, params } = buildFilters();
      const contentRows = db.prepare(`
        SELECT id, citation, real_citation, court, year, title, processed,
          CASE WHEN content IS NOT NULL THEN substr(content, 1, 4000) ELSE NULL END AS content
        FROM judgments
        WHERE ${where} AND processed = 1 AND content LIKE ? COLLATE NOCASE
        ORDER BY year DESC, ${courtPrioritySql()} ASC, id ASC
        LIMIT ?
      `).all(...params, likeQ, Math.max(4, offset + limit - rows.length)) as any[];
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

    const terms = query
      .split(/[^A-Za-z0-9]+/)
      .filter((t) => t.length >= 4)
      .slice(0, 6);
    if (!terms.length) return [];

    const ors = terms.map(() => "content LIKE ? COLLATE NOCASE").join(" OR ");
    const params: (string | number)[] = terms.map((t) => `%${t}%`);

    let where = `processed = 1 AND (${ors})`;
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

    const ors = cleaned.map(() => "content LIKE ? COLLATE NOCASE").join(" OR ");
    const params: (string | number)[] = cleaned.map((t) => `%${t}%`);
    let where = `processed = 1 AND (${ors})`;
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

    const likeQ = `%${query.trim()}%`;
    const params: (string | number)[] = [likeQ, likeQ, likeQ];
    let where =
      "(citation LIKE ? COLLATE NOCASE OR real_citation LIKE ? COLLATE NOCASE OR (processed = 1 AND content LIKE ?))";
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
    const terms = query.split(/[^A-Za-z0-9]+/).filter((t) => t.length >= 4).slice(0, 6);
    if (!terms.length) return 0;

    const ors = terms.map(() => "content LIKE ? COLLATE NOCASE").join(" OR ");
    const params: (string | number)[] = terms.map((t) => `%${t}%`);
    let where = `processed = 1 AND (${ors})`;
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
