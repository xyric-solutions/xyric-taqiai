/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-explicit-any */
import path from "path";
import fs from "fs";

// Built offline by the Python scrapers (scrape_*_statutes.py) + an FTS5 index
// from scripts/build_statute_fts.py. Holds the LATEST statute text — federal +
// all four provinces — so the Advisor can answer on current law instead of the
// model's stale training memory.
const DB_PATH = path.join(process.cwd(), "data", "statutes.db");

export interface StatuteHit {
  actId: number;
  actName: string;
  province: string;
  docType: string;
  year: number | null;
  sectionNo: string | null;
  title: string | null;
  body: string;
}

export interface AmendmentDoc {
  actName: string;
  province: string;
  year: number | null;
  snippet: string;
}

let _db: any = null;
let _hasFts: boolean | null = null;

function getDb(): any {
  if (_db) return _db;
  if (!fs.existsSync(DB_PATH)) return null;
  try {
    const { DatabaseSync } = require("node:sqlite");
    // Read-only: the corpus is built offline; never written at runtime.
    _db = new DatabaseSync(DB_PATH, { readOnly: true });
    return _db;
  } catch {
    return null;
  }
}

function hasFts(db: any): boolean {
  if (_hasFts !== null) return _hasFts;
  try {
    const row = db
      .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='sections_fts'")
      .get();
    _hasFts = !!row;
  } catch {
    _hasFts = false;
  }
  return _hasFts;
}

/** Turn free-text terms into a safe FTS5 MATCH expression: each term quoted as a
 *  phrase (so hyphens/punctuation can't be read as FTS operators) and OR-joined. */
function toMatchExpr(terms: string[]): string {
  const cleaned = terms
    .map((t) => t.replace(/["']/g, " ").replace(/\s+/g, " ").trim())
    .filter((t) => t.length >= 3)
    .map((t) => `"${t}"`);
  return cleaned.join(" OR ");
}

// Map a code abbreviation in the question to its parent Act name, so "302 PPC"
// resolves precisely to the Penal Code's section 302 instead of any Act whose
// name happens to contain "murder".
const CODE_MAP: { re: RegExp; like: string }[] = [
  { re: /\b(ppc|p\.p\.c)\b|penal\s+code/i, like: "%Penal Code%" },
  { re: /\b(crpc|cr\.?p\.?c)\b|criminal\s+procedure/i, like: "%Criminal Procedure%" },
  { re: /\b(cpc|c\.p\.c)\b|civil\s+procedure/i, like: "%Civil Procedure%" },
  { re: /\b(qso)\b|qanun-?e-?shahadat/i, like: "%Qanun-e-Shahadat%" },
  { re: /\bconstitution\b|\barticle\b/i, like: "%Constitution of the Islamic%" },
];

/**
 * Precise lookup for "section N of <code>" style questions (302 PPC, 497 CrPC,
 * Article 199, dafa 420). Returns the exact section of the right Act first —
 * this is the most common legal query and FTS bm25 alone ranks it poorly.
 */
/** Extract the BODY occurrence of "<num>. Heading ..." from an act's full_text.
 *  Section headings appear twice (contents list + body); the body occurrence is
 *  the one followed by the most text, so we take the last/longest match. */
function excerptForSection(fullText: string, num: string, suffix: string): string | null {
  const numEsc = num.replace(/[.*+?^${}()|[\]\\]/g, "\\");
  // e.g. "302.", "489-F.", "22-A." — allow optional hyphen+letter
  const re = new RegExp(`(^|[\\s.])(?:\\d+\\[)?${numEsc}\\s*[-]?\\s*${suffix || "[A-Z]?"}\\.?[\\s\\u2014:.-]+[A-Z\\u201c"\\[]`, "g");
  let best = -1;
  let m: RegExpExecArray | null;
  while ((m = re.exec(fullText)) !== null) {
    // prefer occurrences with substantial following text (the body, not contents)
    const follow = fullText.slice(m.index, m.index + 400);
    if (follow.length > 120) best = m.index;
  }
  if (best < 0) return null;
  return fullText.slice(best, best + 1100).replace(/\s+/g, " ").trim();
}

// Common legal topics → the canonical Act that governs them. Fixes pure-keyword
// queries (no section number) where FTS bm25 otherwise ranks an Act whose NAME
// happens to contain the word above the Act that actually governs the topic
// (e.g. "khula maintenance" was matching "Graveyards (Preservation & Maintenance)
// Act" instead of the Family Courts Act).
const TOPIC_HINTS: { re: RegExp; like: string; kw: string }[] = [
  { re: /\b(whatsapp|digital|electronic|audio|voice recording|video recording|electronic evidence)\b/i, like: "%Qanun-e-Shahadat%", kw: "modern devices" },
  { re: /\b(vehicle|motor vehicle|car)\b.*\b(transfer|ownership|registration|excise)\b|\b(transfer|ownership|registration|excise)\b.*\b(vehicle|motor vehicle|car)\b/i, like: "%Motor Vehicles%", kw: "transfer of ownership" },
  { re: /\bkhula\b/i, like: "%Family Courts%", kw: "khula" },
  { re: /\b(maintenance|nafqa|nan\s*nafqa)\b/i, like: "%Family Courts%", kw: "maintenance" },
  { re: /\b(dower|mehr|haq\s*mehr)\b/i, like: "%Muslim Family Laws%", kw: "dower" },
  { re: /\b(custody|hizanat|guardian)\b/i, like: "%Guardians and Wards%", kw: "custody" },
  { re: /\b(limitation|time[- ]?barred|muddat)\b/i, like: "%Limitation Act%", kw: "limitation" },
  { re: /\b(pre[- ]?emption|shufa|shuffa)\b/i, like: "%Pre-emption%", kw: "pre-emption" },
  { re: /\bspecific\s+performance\b/i, like: "%Specific Relief%", kw: "specific performance" },
  { re: /\b(rent|ejectment|tenancy)\b/i, like: "%Rent Restriction%", kw: "rent" },
  { re: /\b(succession|inheritance|wirasat)\b/i, like: "%Succession Act%", kw: "succession" },
  { re: /\b(dissolution|talaq|divorce)\b/i, like: "%Dissolution of Muslim Marriages%", kw: "dissolution" },
];

/** For a recognised topic with no explicit section number, surface the canonical
 *  Act that governs it (with a keyword excerpt) so it ranks first. */
function topicHints(question: string): StatuteHit[] {
  const db = getDb();
  if (!db) return [];
  const hint = TOPIC_HINTS.find((h) => h.re.test(question));
  if (!hint) return [];
  const row = db
    .prepare(
      `SELECT id, act_name, full_text, act_year, COALESCE(province,'Federal') province, COALESCE(doc_type,'act') doc_type
       FROM acts WHERE act_name LIKE ? AND full_text IS NOT NULL ORDER BY length(full_text) DESC LIMIT 1`
    )
    .get(hint.like) as any;
  if (!row) return [];
  const t: string = row.full_text || "";
  const idx = t.toLowerCase().lastIndexOf(hint.kw.toLowerCase());
  const body = (idx > -1 ? t.slice(Math.max(0, idx - 80), idx + 900) : t.slice(0, 900))
    .replace(/\s+/g, " ")
    .trim();
  return [
    {
      actId: row.id, actName: row.act_name, province: row.province, docType: row.doc_type,
      year: row.act_year ?? null, sectionNo: null, title: null, body,
    },
  ];
}

function preciseSectionHits(question: string): StatuteHit[] {
  const db = getDb();
  if (!db) return [];
  const code = CODE_MAP.find((c) => c.re.test(question));
  if (!code) return [];
  const m = question.match(/\b(\d{1,4})\s*[-]?\s*([A-Z])?\b/);
  if (!m) return [];
  const num = m[1];
  const suffix = m[2] || "";
  const isConstitution = code.like.includes("Constitution");
  const isQso = code.like.includes("Qanun-e-Shahadat");

  // pick the right Act (biggest full_text matching the code), read its text,
  // and pull the exact section/article excerpt from it.
  const row = (isConstitution
    ? db.prepare(`SELECT id, act_name, full_text, act_year, province, doc_type FROM acts WHERE doc_type='constitution' LIMIT 1`).get()
    : db.prepare(`SELECT id, act_name, full_text, act_year, COALESCE(province,'Federal') province, COALESCE(doc_type,'act') doc_type FROM acts WHERE act_name LIKE ? AND full_text IS NOT NULL ORDER BY length(full_text) DESC LIMIT 1`).get(code.like)) as any;
  if (!row) return [];

  const body = excerptForSection(row.full_text || "", num, suffix);
  if (!body) return [];
  return [
    {
      actId: row.id,
      actName: row.act_name,
      province: row.province || "Federal",
      docType: row.doc_type || "act",
      year: row.act_year ?? null,
      sectionNo: isConstitution || isQso ? `Article ${num}` : `${num}${suffix ? "-" + suffix : ""}`,
      title: null,
      body,
    },
  ];
}

/**
 * Find the statute sections most relevant to a question. Tries a PRECISE
 * section/code lookup first (302 PPC → Penal Code s.302), then FTS bm25 for the
 * rest. Caps sections-per-act so results span multiple laws.
 * Always safe — returns [] on any error or missing DB/index.
 */
export function searchStatuteSections(terms: string[], max = 5, question = ""): StatuteHit[] {
  try {
    const db = getDb();
    if (!db || !hasFts(db)) return [];

    // 1) precise "section N of code" hits first, then canonical-Act topic hints
    const precise = question
      ? [...preciseSectionHits(question), ...topicHints(question)]
      : [];

    const expr = toMatchExpr(terms);
    if (!expr) return precise.slice(0, max);

    const rows = db
      .prepare(
        `SELECT act_id, act_name, province, doc_type, act_year, section_no, title, body
         FROM sections_fts
         WHERE sections_fts MATCH ?
         ORDER BY bm25(sections_fts, 8.0, 1.0, 1.0, 1.0, 4.0, 1.0)
         LIMIT ?`
      )
      .all(expr, max * 5) as any[];

    const perAct = new Map<number, number>();
    const seen = new Set<string>();
    const out: StatuteHit[] = [];
    // precise "section N of code" hits seed the result first
    for (const h of precise) {
      const k = `${h.actId}:${h.sectionNo}`;
      if (seen.has(k)) continue;
      seen.add(k);
      perAct.set(h.actId, (perAct.get(h.actId) || 0) + 1);
      out.push(h);
    }
    for (const r of rows) {
      if (out.length >= max) break;
      const k = `${r.act_id}:${r.section_no}`;
      if (seen.has(k)) continue;
      const used = perAct.get(r.act_id) || 0;
      if (used >= 2) continue; // at most 2 sections per act → spread across laws
      perAct.set(r.act_id, used + 1);
      seen.add(k);
      out.push({
        actId: r.act_id,
        actName: r.act_name,
        province: r.province || "Federal",
        docType: r.doc_type || "act",
        year: r.act_year ?? null,
        sectionNo: r.section_no ?? null,
        title: r.title ?? null,
        body: (r.body || "").replace(/\s+/g, " ").trim(),
      });
    }
    return out;
  } catch {
    return [];
  }
}

/** Core subject of an act name, e.g. "Stamp Act 1899" -> "stamp",
 *  "West Pakistan Family Courts Act 1964" -> "family courts". Used to link a
 *  base Act to its amendment Acts (which share that subject in their name). */
function coreSubject(actName: string): string {
  const s = actName
    .replace(/\([^)]*\)/g, " ") // drop "(Amendment)", "(Punjab Amendment)"
    .replace(/\b(the|an?|of|and|for)\b/gi, " ")
    .replace(/\b(act|ordinance|order|regulation|regulations|rules?|bill|code)\b/gi, " ")
    .replace(/\b(west\s+pakistan|punjab|sindh|khyber\s+pakhtunkhwa|kpk|balochistan|federal)\b/gi, " ")
    .replace(/\b(1[89]\d{2}|20\d{2})\b/g, " ")
    .replace(/[^A-Za-z\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
  return s.split(" ").filter(Boolean).slice(0, 2).join(" ");
}

/**
 * Given a base Act, find its amendment Acts (and same-subject related laws) so
 * the model can see the WHOLE picture — base + every change — and state the
 * current consolidated position instead of an out-of-date base text. Matched by
 * the subject keyword shared in the names; same province or Federal.
 */
export function findRelatedAmendments(
  actName: string,
  province: string,
  excludeActId: number,
  max = 4
): AmendmentDoc[] {
  try {
    const db = getDb();
    if (!db) return [];
    const subject = coreSubject(actName);
    const first = subject.split(" ")[0];
    if (!first || first.length < 4) return [];

    const rows = db
      .prepare(
        `SELECT id, act_name, province, act_year, substr(full_text, 1, 1500) AS snip
         FROM acts
         WHERE id <> ?
           AND (province = ? OR province = 'Federal')
           AND act_name LIKE '%' || ? || '%'
           AND act_name LIKE '%mendment%'
         ORDER BY act_year DESC
         LIMIT ?`
      )
      .all(excludeActId, province, first, max) as any[];

    return rows.map((r) => ({
      actName: r.act_name,
      province: r.province || "Federal",
      year: r.act_year ?? null,
      snippet: (r.snip || "").replace(/\s+/g, " ").trim().slice(0, 500),
    }));
  } catch {
    return [];
  }
}

/**
 * Pull the actual Stamp-Act / Court-Fees-Act amendment paragraphs from a
 * province's most recent Finance Acts. These carry the CURRENT fee/duty figures
 * (as "in Article X, for 'A' substitute 'B'") and extract cleanly as prose — so
 * the model gets the authoritative latest change for ANY instrument, in ANY
 * province, without us hand-curating every amount. Honesty rule covers the rest.
 */
export function latestFinanceFeeAmendments(
  province: string,
  max = 2
): { actName: string; year: number | null; text: string }[] {
  try {
    const db = getDb();
    if (!db) return [];
    const rows = db
      .prepare(
        `SELECT act_name, act_year, full_text
         FROM acts
         WHERE (province = ? OR province = 'Federal')
           AND act_name LIKE '%Finance%'
           AND full_text LIKE '%Stamp Act%'
           AND act_year >= 2018
         ORDER BY act_year DESC
         LIMIT ?`
      )
      .all(province, max * 3) as any[];

    const out: { actName: string; year: number | null; text: string }[] = [];
    const seen = new Set<string>();
    for (const r of rows) {
      const t: string = r.full_text || "";
      // grab the Stamp Act and Court Fees Act amendment paragraphs
      const parts: string[] = [];
      for (const law of ["Stamp Act", "Court Fees Act", "Court-Fees Act"]) {
        const i = t.indexOf(law);
        if (i !== -1) parts.push(t.slice(i, i + 1500).replace(/\s+/g, " ").trim());
      }
      if (!parts.length) continue;
      const key = `${r.act_name}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({ actName: r.act_name, year: r.act_year ?? null, text: parts.join(" … ").slice(0, 1800) });
      if (out.length >= max) break;
    }
    return out;
  } catch {
    return [];
  }
}
