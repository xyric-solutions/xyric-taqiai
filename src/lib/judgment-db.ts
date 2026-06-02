/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-explicit-any */
import path from "path";
import fs from "fs";

const DB_PATH = path.join(process.cwd(), "data", "judgments.db");

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
  _db = new DatabaseSync(DB_PATH);
  return _db;
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

function orderBy(sort: SortMode): string {
  if (sort === "newest") return "year DESC, id DESC";
  if (sort === "oldest") return "year ASC, id ASC";
  // relevance: reported citations first, then has-title, then newest
  return "(real_citation IS NOT NULL) DESC, (title IS NOT NULL) DESC, year DESC, id ASC";
}

/** The archive contains many exact-duplicate imports of the same judgment.
 *  Collapse them by a normalised prefix of the text so each judgment shows once. */
function dedupeKey(r: any): string {
  if (r.content) return r.content.replace(/\s+/g, " ").trim().slice(0, 300).toLowerCase();
  if (r.real_citation) return String(r.real_citation).toLowerCase();
  return `id:${r.id}`;
}

function dedupeRows(rows: any[], limit: number): any[] {
  const seen = new Set<string>();
  const out: any[] = [];
  for (const r of rows) {
    const k = dedupeKey(r);
    if (seen.has(k)) continue;
    seen.add(k);
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
  sort: SortMode = "relevance"
): JudgmentSearchResult[] {
  try {
    const db = getDb();
    if (!db || !query.trim()) return [];

    const likeQ = `%${query.trim()}%`;
    const params: (string | number)[] = [likeQ, likeQ, likeQ];

    let where =
      "(citation LIKE ? COLLATE NOCASE OR real_citation LIKE ? COLLATE NOCASE OR (processed = 1 AND content LIKE ?))";

    if (court && court !== "All Courts") {
      where += " AND court LIKE ?";
      params.push(`${court}%`);
    }
    if (year && year !== "All years") {
      where += " AND year = ?";
      params.push(parseInt(year));
    }
    // Over-fetch so we can drop duplicate imports and still fill the page.
    params.push(limit * 6);

    const sql = `
      SELECT id, citation, real_citation, court, year, title, processed,
        CASE WHEN content IS NOT NULL THEN substr(content, 1, 4000) ELSE NULL END AS content
      FROM judgments
      WHERE ${where}
      ORDER BY ${orderBy(sort)}
      LIMIT ?
    `;

    const rows = db.prepare(sql).all(...params) as any[];
    return dedupeRows(rows, limit).map((r) => toResult(r, query));
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
  sort: SortMode = "relevance"
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
    if (court && court !== "All Courts") {
      where += " AND court LIKE ?";
      params.push(`${court}%`);
    }
    if (year && year !== "All years") {
      where += " AND year = ?";
      params.push(parseInt(year));
    }
    params.push(limit * 6);

    const sql = `
      SELECT id, citation, real_citation, court, year, title, processed,
        CASE WHEN content IS NOT NULL THEN substr(content, 1, 4000) ELSE NULL END AS content
      FROM judgments
      WHERE ${where}
      ORDER BY ${orderBy(sort)}
      LIMIT ?
    `;

    const rows = db.prepare(sql).all(...params) as any[];
    return dedupeRows(rows, limit).map((r) => toResult(r, query, true));
  } catch {
    return [];
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
