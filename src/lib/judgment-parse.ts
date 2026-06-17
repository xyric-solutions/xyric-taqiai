// Heuristic parsers that pull structured bits out of a raw judgment's text:
// the parties, the case-law it cites, and the statutes it leans on.
// These are best-effort regex extractions — useful, not authoritative.

// Pakistani law-report series, normalised to alphanumerics-only keys. Judgment
// text cites these in many spacings: "CLC", "C L C", "P Cr. L J", "PCrLJ" …
// so we match a loose shape then validate the middle against this set.
const REPORTER_SET = new Set([
  "PLD", "PLJ", "SCMR", "CLC", "YLR", "MLD", "PCRLJ", "PLC", "PLCCS",
  "CLD", "GBLR", "NLR", "PTD", "KLR", "SCR", "PLR", "PTCL", "CLR", "PCRLJ",
]);

// Court tokens for the report-first shape ("PLD 2019 SC 304").
const COURTS = "SC|Lah|Kar|Pesh|Quetta|Isl|FSC|Note|Trib";

// Loose year-first candidate: YEAR <letters/spaces/dots> NUMBER. The middle is
// validated and canonicalised below so noise ("2010 to 2015") is dropped.
const CITE_YEAR_FIRST = /\b((?:19|20)\d{2})\s+([A-Za-z][A-Za-z.\s]{0,16}?)\s+(\d{1,4})\b/g;
// Report-first: "PLD 2019 SC 304" (PLD/PLJ are rarely spaced in this form).
const CITE_REPORT_FIRST = new RegExp(
  `\\b(PLD|PLJ|PTD)\\s+((?:19|20)\\d{2})\\s+(${COURTS})\\s+(\\d{1,4})\\b`,
  "g"
);

const alnum = (s: string) => s.replace(/[^a-z0-9]/gi, "").toUpperCase();
const reporterKey = (mid: string) => mid.replace(/[^a-z]/gi, "").toUpperCase();

/**
 * Pull every case-law citation referenced in the text, canonicalised to a
 * compact "YEAR REPORTER NUMBER" form, de-duplicated, with the judgment's own
 * citation removed.
 */
export function extractCitations(text: string, self?: string): string[] {
  if (!text) return [];
  const selfKey = self ? alnum(self) : "";
  const seen = new Set<string>();
  const out: string[] = [];

  const push = (canonical: string) => {
    const key = alnum(canonical);
    if (key === selfKey || seen.has(key) || key.length < 5) return;
    seen.add(key);
    out.push(canonical);
  };

  CITE_YEAR_FIRST.lastIndex = 0;
  for (const m of text.matchAll(CITE_YEAR_FIRST)) {
    const [, year, mid, num] = m;
    const rep = reporterKey(mid);
    if (!REPORTER_SET.has(rep)) continue;
    push(`${year} ${rep} ${num}`);
  }

  CITE_REPORT_FIRST.lastIndex = 0;
  for (const m of text.matchAll(CITE_REPORT_FIRST)) {
    const [, rep, year, court, num] = m;
    push(`${rep.toUpperCase()} ${year} ${court} ${num}`);
  }

  return out;
}

/**
 * Statutes / provisions the judgment relies on: named Acts, Ordinances, Codes
 * and the Constitution, plus bare constitutional Articles.
 */
export function extractStatutes(text: string): string[] {
  if (!text) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  const add = (s: string) => {
    const v = s.replace(/\s+/g, " ").trim();
    const key = v.toLowerCase();
    if (v.length < 5 || seen.has(key)) return;
    seen.add(key);
    out.push(v);
  };

  // Named instruments — "Limitation Act, 1908", "Civil Procedure Code", etc.
  const NAMED = /\b((?:[A-Z][A-Za-z.&'-]+\s+){1,5}(?:Act|Ordinance|Code|Constitution|Rules))(?:,?\s+((?:19|20)\d{2}))?/g;
  for (const m of text.matchAll(NAMED)) {
    const name = m[1].trim();
    // skip sentence-start false positives like "The Court" / "This Act"
    if (/^(The|This|That|A|An|It|His|Her|Said|Such)\b/i.test(name) && !/\d/.test(m[0])) {
      if (!/Act|Ordinance|Code|Constitution/.test(name)) continue;
    }
    add(m[2] ? `${name}, ${m[2]}` : name);
  }

  // Constitutional articles — "Article 199", "Article 185(3)"
  for (const m of text.matchAll(/\bArticle\s+\d+[A-Z]?(?:\(\d+\))?\b/g)) add(m[0]);

  return out.slice(0, 14);
}

export interface Parties {
  petitioner: string;
  respondent: string;
}

/**
 * Split a "X versus Y" heading into the two sides. Falls back to scanning the
 * top of the judgment body when no title is available.
 */
export function parseParties(title: string | null, content?: string | null): Parties | null {
  const candidates: string[] = [];
  if (title) candidates.push(title);
  if (content) candidates.push(content.slice(0, 600));

  const SPLIT = /\b(?:versus|vs?\.?)\b/i;
  for (const raw of candidates) {
    const line = raw.replace(/\s+/g, " ").trim();
    if (!SPLIT.test(line)) continue;
    const [left, right] = line.split(SPLIT);
    const petitioner = left.replace(/[,.\s]+$/, "").trim();
    const respondent = (right || "").split(/[\n.]/)[0].replace(/^[,.\s]+/, "").trim();
    if (petitioner && respondent && petitioner.length < 120 && respondent.length < 120) {
      return { petitioner, respondent };
    }
  }
  return null;
}

/** Break raw extracted text into paragraphs for justified rendering. */
export function toParagraphs(content: string): string[] {
  if (!content) return [];
  const byBlank = content.split(/\n{2,}/).map((p) => p.replace(/\s+/g, " ").trim()).filter(Boolean);
  if (byBlank.length > 1) return byBlank;
  // single blob — fall back to single-newline splits, else one paragraph
  const byLine = content.split(/\n/).map((p) => p.trim()).filter((p) => p.length > 0);
  return byLine.length > 1 ? byLine : [content.replace(/\s+/g, " ").trim()];
}
