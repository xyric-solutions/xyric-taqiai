export type LegalCode = "PPC" | "CrPC" | "CPC" | "QSO" | "PECA" | "Constitution";

export interface LegalProvisionReference {
  kind: "section" | "article";
  provision: string;
  subsections: string[];
  lawCode: LegalCode | null;
  canonical: string;
  lookupQuery: string;
}

const LAW_PATTERNS: { code: LegalCode; pattern: RegExp }[] = [
  { code: "PPC", pattern: /\b(?:ppc|p\.?\s*p\.?\s*c\.?)\b|pakistan\s+penal\s+code|penal\s+code/i },
  { code: "CrPC", pattern: /\b(?:crpc|cr\.?\s*p\.?\s*c\.?)\b|code\s+of\s+criminal\s+procedure|criminal\s+procedure/i },
  { code: "CPC", pattern: /\b(?:cpc|c\.?\s*p\.?\s*c\.?)\b|code\s+of\s+civil\s+procedure|civil\s+procedure/i },
  { code: "QSO", pattern: /\bqso\b|qanun-?e-?shahadat/i },
  { code: "PECA", pattern: /\bpeca\b|prevention\s+of\s+electronic\s+crimes/i },
  { code: "Constitution", pattern: /\bconstitution\b/i },
];

const COMMON_PPC_PROVISIONS = new Set([
  "295-A", "295-B", "295-C", "302", "324", "354", "354-A", "365", "365-B",
  "376", "377", "379", "406", "420", "489-F", "509",
]);

const COMMON_CRPC_PROVISIONS = new Set([
  "22-A", "22-B", "154", "435", "439", "497", "498", "561-A",
]);

function detectLawCode(input: string): LegalCode | null {
  return LAW_PATTERNS.find(({ pattern }) => pattern.test(input))?.code || null;
}

function normalizeProvision(raw: string): string {
  const compact = raw.replace(/\s+/g, "").toUpperCase();
  const match = compact.match(/^(\d{1,4})(?:([-\/])?([A-Z]{1,3}))?$/);
  if (!match) return compact;
  const [, number, separator, suffix] = match;
  if (!suffix) return number;
  return separator ? `${number}-${suffix}` : `${number}${suffix}`;
}

function inferCommonLawCode(provision: string): LegalCode | null {
  const normalized = provision.replace(/\//g, "-");
  if (COMMON_PPC_PROVISIONS.has(normalized)) return "PPC";
  if (COMMON_CRPC_PROVISIONS.has(normalized)) return "CrPC";
  return null;
}

export function parseLegalProvisionReference(input: string): LegalProvisionReference | null {
  const text = input.replace(/[\u2010-\u2015]/g, "-").replace(/\s+/g, " ").trim();
  if (!text) return null;

  const match = text.match(
    /(?:\b(section|sections|sec\.?|s\.?|article|art\.?)\s*)?\b(\d{1,4}(?:(?:\s*[-\/]\s*[A-Za-z]{1,3})|[A-Za-z]{1,3})?)((?:\s*\(\s*[0-9A-Za-z]+\s*\))*)/i
  );
  if (!match) return null;

  const prefix = (match[1] || "").toLowerCase();
  const provision = normalizeProvision(match[2]);
  const subsections = Array.from(match[3].matchAll(/\(\s*([0-9A-Za-z]+)\s*\)/g), (item) => item[1]);
  const explicitLawCode = detectLawCode(text);
  const lawCode = explicitLawCode || inferCommonLawCode(provision);
  const kind = prefix.startsWith("art") || lawCode === "Constitution" || lawCode === "QSO" ? "article" : "section";
  const subsectionText = subsections.map((value) => `(${value})`).join("");
  const label = kind === "article" ? "Article" : "Section";
  const canonical = `${label} ${provision}${subsectionText}${lawCode ? ` ${lawCode}` : ""}`;
  const lookupQuery = `${label} ${provision}${lawCode ? ` ${lawCode}` : ""}`;

  return { kind, provision, subsections, lawCode, canonical, lookupQuery };
}

export function extractSubsectionText(body: string, subsections: string[]): string {
  let excerpt = body.replace(/\s+/g, " ").trim();
  if (!excerpt || subsections.length === 0) return excerpt;

  for (const subsection of subsections) {
    const escaped = subsection.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const marker = new RegExp(`(?:^|\\s)(?:\\d+\\[)?\\(${escaped}\\)\\s+(?!(?:of|under|to|and|or|in|as)\\b)`, "i");
    const start = marker.exec(excerpt);
    if (!start) return excerpt;

    const contentStart = start.index + start[0].length;
    const remainder = excerpt.slice(contentStart);
    const nextSibling = /\s(?:\d+\[)?\((?:\d+[A-Za-z]?|[a-z]|[ivxlcdm]+)\)\s+(?!(?:of|under|to|and|or|in|as)\b)/i.exec(remainder);
    const contentEnd = nextSibling ? contentStart + nextSibling.index : excerpt.length;
    excerpt = `${excerpt.slice(start.index, contentStart).trim()} ${excerpt.slice(contentStart, contentEnd).trim()}`.trim();
  }

  return excerpt.replace(/^\d+\[/, "").replace(/\]+$/, "").trim();
}

export function summarizeProvisionText(body: string, maxLength = 420): string {
  const cleaned = body
    .replace(/^\d+\[/, "")
    .replace(/\]+$/, "")
    .replace(/_{2,}/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (cleaned.length <= maxLength) return cleaned;
  const shortened = cleaned.slice(0, maxLength);
  const sentenceEnd = Math.max(shortened.lastIndexOf("."), shortened.lastIndexOf(";"));
  return `${shortened.slice(0, sentenceEnd > maxLength * 0.55 ? sentenceEnd + 1 : maxLength).trim()}\u2026`;
}
