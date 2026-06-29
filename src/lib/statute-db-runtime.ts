/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/lib/prisma";
import {
  searchStatuteSections as searchStatuteSectionsSqlite,
  findRelatedAmendments as findRelatedAmendmentsSqlite,
  latestFinanceFeeAmendments as latestFinanceFeeAmendmentsSqlite,
  type AmendmentDoc,
  type StatuteHit,
} from "@/lib/statute-db";

export type { AmendmentDoc, StatuteHit };

function usePostgres(): boolean {
  return /^postgres(?:ql)?:\/\//i.test(process.env.DATABASE_URL || "");
}

function toWebsearchExpr(terms: string[]): string {
  return terms
    .map((t) =>
      t
        .replace(/["']/g, " ")
        .replace(/[^\p{L}\p{N}\s-]/gu, " ")
        .replace(/\s+/g, " ")
        .trim()
    )
    .filter((t) => t.length >= 3)
    .map((t) => `"${t}"`)
    .join(" OR ");
}

const CODE_MAP: { re: RegExp; like: string }[] = [
  { re: /\b(ppc|p\.p\.c)\b|penal\s+code/i, like: "%Penal Code%" },
  { re: /\b(crpc|cr\.?p\.?c)\b|criminal\s+procedure/i, like: "%Criminal Procedure%" },
  { re: /\b(cpc|c\.p\.c)\b|civil\s+procedure/i, like: "%Civil Procedure%" },
  { re: /\b(qso)\b|qanun-?e-?shahadat/i, like: "%Qanun-e-Shahadat%" },
  { re: /\bconstitution\b|\barticle\b/i, like: "%Constitution of the Islamic%" },
];

const TOPIC_HINTS: { re: RegExp; like: string; kw: string }[] = [
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

function excerptForSection(fullText: string, num: string, suffix: string): string | null {
  const numEsc = num.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(
    `(^|[\\s.])${numEsc}\\s*[-]?\\s*${suffix || "[A-Z]?"}\\.?[\\s\\u2014:.-]+[A-Z\\u201c"\\[]`,
    "g"
  );
  let best = -1;
  let match: RegExpExecArray | null;
  while ((match = re.exec(fullText)) !== null) {
    const follow = fullText.slice(match.index, match.index + 400);
    if (follow.length > 120) best = match.index;
  }
  if (best < 0) return null;
  return fullText.slice(best, best + 1100).replace(/\s+/g, " ").trim();
}

function rowToHit(row: any): StatuteHit {
  return {
    actId: Number(row.act_id ?? row.id),
    actName: row.act_name,
    province: row.province || "Federal",
    docType: row.doc_type || "act",
    year: row.act_year ?? null,
    sectionNo: row.section_no ?? null,
    title: row.title ?? null,
    body: (row.body || "").replace(/\s+/g, " ").trim(),
  };
}

function dedupeHits(hits: StatuteHit[], max: number): StatuteHit[] {
  const perAct = new Map<number, number>();
  const seen = new Set<string>();
  const out: StatuteHit[] = [];

  for (const hit of hits) {
    if (out.length >= max) break;
    const key = `${hit.actId}:${hit.sectionNo || ""}:${hit.title || ""}`;
    if (seen.has(key)) continue;
    const used = perAct.get(hit.actId) || 0;
    if (used >= 2) continue;
    seen.add(key);
    perAct.set(hit.actId, used + 1);
    out.push(hit);
  }

  return out;
}

async function preciseSectionHitsPg(question: string): Promise<StatuteHit[]> {
  const code = CODE_MAP.find((c) => c.re.test(question));
  if (!code) return [];
  const match = question.match(/\b(\d{1,4})\s*[-]?\s*([A-Z])?\b/);
  if (!match) return [];

  const num = match[1];
  const suffix = match[2] || "";
  const isConstitution = /constitution|article/i.test(question);

  const rows = isConstitution
    ? await prisma.$queryRawUnsafe<any[]>(
        `
          SELECT id, act_name, full_text, act_year, province, doc_type
          FROM legal_acts
          WHERE lower(COALESCE(doc_type, '')) = 'constitution'
          LIMIT 1
        `
      )
    : await prisma.$queryRawUnsafe<any[]>(
        `
          SELECT id, act_name, full_text, act_year,
                 COALESCE(province, 'Federal') AS province,
                 COALESCE(doc_type, 'act') AS doc_type
          FROM legal_acts
          WHERE act_name ILIKE $1 AND full_text IS NOT NULL
          ORDER BY length(full_text) DESC
          LIMIT 1
        `,
        code.like
      );

  const row = rows[0];
  if (!row) return [];
  const body = excerptForSection(row.full_text || "", num, suffix);
  if (!body) return [];

  return [
    {
      actId: Number(row.id),
      actName: row.act_name,
      province: row.province || "Federal",
      docType: row.doc_type || "act",
      year: row.act_year ?? null,
      sectionNo: isConstitution ? `Article ${num}` : `${num}${suffix ? "-" + suffix : ""}`,
      title: null,
      body,
    },
  ];
}

async function topicHintsPg(question: string): Promise<StatuteHit[]> {
  const hint = TOPIC_HINTS.find((h) => h.re.test(question));
  if (!hint) return [];

  const rows = await prisma.$queryRawUnsafe<any[]>(
    `
      SELECT id, act_name, full_text, act_year,
             COALESCE(province, 'Federal') AS province,
             COALESCE(doc_type, 'act') AS doc_type
      FROM legal_acts
      WHERE act_name ILIKE $1 AND full_text IS NOT NULL
      ORDER BY length(full_text) DESC
      LIMIT 1
    `,
    hint.like
  );
  const row = rows[0];
  if (!row) return [];

  const text: string = row.full_text || "";
  const idx = text.toLowerCase().indexOf(hint.kw.toLowerCase());
  const body = (idx > -1 ? text.slice(Math.max(0, idx - 80), idx + 900) : text.slice(0, 900))
    .replace(/\s+/g, " ")
    .trim();

  return [
    {
      actId: Number(row.id),
      actName: row.act_name,
      province: row.province || "Federal",
      docType: row.doc_type || "act",
      year: row.act_year ?? null,
      sectionNo: null,
      title: null,
      body,
    },
  ];
}

async function searchStatuteSectionsPg(
  terms: string[],
  max: number,
  question: string
): Promise<StatuteHit[] | null> {
  try {
    const precise = question
      ? [...(await preciseSectionHitsPg(question)), ...(await topicHintsPg(question))]
      : [];

    const expr = toWebsearchExpr(terms);
    if (!expr) return precise.slice(0, max);

    const rows = await prisma.$queryRawUnsafe<any[]>(
      `
        WITH q AS (SELECT websearch_to_tsquery('simple', $1) AS query)
        SELECT s.act_id, a.act_name, a.province, a.doc_type, a.act_year,
               s.section_no, s.title, s.body
        FROM legal_sections s
        JOIN legal_acts a ON a.id = s.act_id
        CROSS JOIN q
        WHERE numnode(q.query) > 0
          AND to_tsvector(
            'simple',
            COALESCE(s.section_no, '') || ' ' ||
            COALESCE(s.title, '') || ' ' ||
            COALESCE(s.body, '')
          ) @@ q.query
        ORDER BY ts_rank_cd(
          to_tsvector(
            'simple',
            COALESCE(s.section_no, '') || ' ' ||
            COALESCE(s.title, '') || ' ' ||
            COALESCE(s.body, '')
          ),
          q.query
        ) DESC, s.id ASC
        LIMIT $2
      `,
      expr,
      max * 5
    );

    return dedupeHits([...precise, ...rows.map(rowToHit)], max);
  } catch {
    return null;
  }
}

export async function searchStatuteSections(
  terms: string[],
  max = 5,
  question = ""
): Promise<StatuteHit[]> {
  if (usePostgres()) {
    const hits = await searchStatuteSectionsPg(terms, max, question);
    if (hits) return hits;
  }
  return searchStatuteSectionsSqlite(terms, max, question);
}

function coreSubject(actName: string): string {
  const subject = actName
    .replace(/\([^)]*\)/g, " ")
    .replace(/\b(the|an?|of|and|for)\b/gi, " ")
    .replace(/\b(act|ordinance|order|regulation|regulations|rules?|bill|code)\b/gi, " ")
    .replace(/\b(west\s+pakistan|punjab|sindh|khyber\s+pakhtunkhwa|kpk|balochistan|federal)\b/gi, " ")
    .replace(/\b(1[89]\d{2}|20\d{2})\b/g, " ")
    .replace(/[^A-Za-z\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
  return subject.split(" ").filter(Boolean).slice(0, 2).join(" ");
}

async function findRelatedAmendmentsPg(
  actName: string,
  province: string,
  excludeActId: number,
  max: number
): Promise<AmendmentDoc[] | null> {
  try {
    const subject = coreSubject(actName);
    const first = subject.split(" ")[0];
    if (!first || first.length < 4) return [];

    const rows = await prisma.$queryRawUnsafe<any[]>(
      `
        SELECT id, act_name, province, act_year, substr(full_text, 1, 1500) AS snip
        FROM legal_acts
        WHERE id <> $1
          AND (province = $2 OR province = 'Federal')
          AND act_name ILIKE '%' || $3 || '%'
          AND act_name ILIKE '%mendment%'
        ORDER BY act_year DESC NULLS LAST
        LIMIT $4
      `,
      excludeActId,
      province,
      first,
      max
    );

    return rows.map((row) => ({
      actName: row.act_name,
      province: row.province || "Federal",
      year: row.act_year ?? null,
      snippet: (row.snip || "").replace(/\s+/g, " ").trim().slice(0, 500),
    }));
  } catch {
    return null;
  }
}

export async function findRelatedAmendments(
  actName: string,
  province: string,
  excludeActId: number,
  max = 4
): Promise<AmendmentDoc[]> {
  if (usePostgres()) {
    const docs = await findRelatedAmendmentsPg(actName, province, excludeActId, max);
    if (docs) return docs;
  }
  return findRelatedAmendmentsSqlite(actName, province, excludeActId, max);
}

function financeRowsToAmendments(
  rows: any[],
  max: number
): { actName: string; year: number | null; text: string }[] {
  const out: { actName: string; year: number | null; text: string }[] = [];
  const seen = new Set<string>();

  for (const row of rows) {
    const text: string = row.full_text || "";
    const parts: string[] = [];
    for (const law of ["Stamp Act", "Court Fees Act", "Court-Fees Act"]) {
      const idx = text.indexOf(law);
      if (idx !== -1) parts.push(text.slice(idx, idx + 1500).replace(/\s+/g, " ").trim());
    }
    if (!parts.length) continue;
    const key = `${row.act_name}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({
      actName: row.act_name,
      year: row.act_year ?? null,
      text: parts.join(" ... ").slice(0, 1800),
    });
    if (out.length >= max) break;
  }

  return out;
}

async function latestFinanceFeeAmendmentsPg(
  province: string,
  max: number
): Promise<{ actName: string; year: number | null; text: string }[] | null> {
  try {
    const rows = await prisma.$queryRawUnsafe<any[]>(
      `
        SELECT act_name, act_year, full_text
        FROM legal_acts
        WHERE (province = $1 OR province = 'Federal')
          AND act_name ILIKE '%Finance%'
          AND full_text ILIKE '%Stamp Act%'
          AND act_year >= 2018
        ORDER BY act_year DESC NULLS LAST
        LIMIT $2
      `,
      province,
      max * 3
    );
    return financeRowsToAmendments(rows, max);
  } catch {
    return null;
  }
}

export async function latestFinanceFeeAmendments(
  province: string,
  max = 2
): Promise<{ actName: string; year: number | null; text: string }[]> {
  if (usePostgres()) {
    const docs = await latestFinanceFeeAmendmentsPg(province, max);
    if (docs) return docs;
  }
  return latestFinanceFeeAmendmentsSqlite(province, max);
}
