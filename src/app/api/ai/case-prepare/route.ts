import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { searchCandidatesFast, getLocalJudgmentById } from "@/lib/judgment-db";
import { getCurrentUser } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { buildNoJudgmentLegalStrategy, findCaseIntakeProfile } from "@/lib/case-builder-knowledge";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const MODEL_CANDIDATES = [
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-1.5-flash-latest",
  "gemini-1.5-flash",
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
];

const GEMINI_TIMEOUT_MS = 12_000;

function sleep(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error("AI request timed out.")), ms)),
  ]);
}

async function tryGenerate(prompt: string, modelIndex = 0, attempt = 0): Promise<string> {
  const modelName = MODEL_CANDIDATES[modelIndex];
  if (!modelName) throw new Error("All Gemini models exhausted.");
  try {
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await withTimeout(model.generateContent(prompt), GEMINI_TIMEOUT_MS);
    return result.response.text();
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "";
    if (msg.includes("timed out")) {
      throw err;
    }
    if (msg.includes("429") || msg.includes("quota") || msg.includes("resource_exhausted") || msg.includes("404") || msg.includes("not found")) {
      return tryGenerate(prompt, modelIndex + 1, 0);
    }
    if ((msg.includes("503") || msg.includes("timeout") || msg.includes("network") || msg.includes("econnreset")) && attempt < 2) {
      await sleep(700 * (attempt + 1));
      return tryGenerate(prompt, modelIndex, attempt + 1);
    }
    if (modelIndex + 1 < MODEL_CANDIDATES.length) {
      return tryGenerate(prompt, modelIndex + 1, 0);
    }
    throw err;
  }
}

export interface PreparedJudgment {
  id: number;
  citation: string;
  court: string;
  year: number;
  title: string | null;
  reason: string;
  ratio: string;
  stance: "favorable" | "adverse" | "neutral";
}

type ClientPosition = "prosecution" | "defence" | "petitioner" | "respondent" | "appellant";

function looksLikeSection(term: string): boolean {
  return /\b\d{2,4}\s*[-/]?\s*[A-Za-z]?\b/.test(term);
}

const CASE_TYPE_SEARCH_HINTS: Array<{ pattern: RegExp; terms: string[]; position?: ClientPosition }> = [
  { pattern: /\b(murder|qatl|قتل|homicide)\b/i, terms: ["302 PPC", "murder", "qatl"], position: "defence" },
  { pattern: /\b(attempt(?:ed)? murder|attempt to murder)\b/i, terms: ["324 PPC", "attempt murder"], position: "defence" },
  { pattern: /\b(bail|ضمانت)\b/i, terms: ["497 CrPC", "bail"], position: "defence" },
  { pattern: /\b(cheque|check|dishonou?red cheque|489[-\s]?f)\b/i, terms: ["489-F PPC", "dishonoured cheque"], position: "defence" },
  { pattern: /\b(custody|guardian|guardianship|minor custody)\b/i, terms: ["Guardian and Wards Act", "custody", "welfare of minor"], position: "petitioner" },
  { pattern: /\b(adoption|child adoption)\b/i, terms: ["Guardian and Wards Act", "adoption", "minor"], position: "petitioner" },
  { pattern: /\b(maintenance|نان نفقہ|nafaqah)\b/i, terms: ["9 Family Courts Act", "maintenance"], position: "petitioner" },
  { pattern: /\b(khula|خلع)\b/i, terms: ["Family Courts Act", "khula", "dissolution of marriage"], position: "petitioner" },
  { pattern: /\b(property|declaration|injunction|possession)\b/i, terms: ["declaration", "injunction", "possession"], position: "petitioner" },
];

const SEARCH_STOP_WORDS = new Set([
  "case", "legal", "document", "application", "petition", "the", "and", "with", "from",
  "against", "under", "section", "sections", "court", "high", "honble", "honourable",
  "client", "opponent", "respondent", "petitioner", "accused", "complainant",
]);

function uniqueTerms(terms: string[], limit = 6): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const term of terms) {
    const cleaned = term.replace(/\s+/g, " ").trim();
    if (cleaned.length < 2) continue;
    const key = cleaned.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(cleaned);
    if (out.length >= limit) break;
  }
  return out;
}

function splitKeywordTerms(input: string, limit = 4): string[] {
  return input
    .split(/[^A-Za-z0-9-]+/)
    .map((t) => t.trim())
    .filter((t) => t.length >= 4 && !SEARCH_STOP_WORDS.has(t.toLowerCase()))
    .slice(0, limit);
}

function mappedCaseTypeTerms(input: string): { terms: string[]; position?: ClientPosition } {
  const terms: string[] = [];
  let position: ClientPosition | undefined;

  for (const hint of CASE_TYPE_SEARCH_HINTS) {
    if (!hint.pattern.test(input)) continue;
    terms.push(...hint.terms);
    position ||= hint.position;
  }

  return {
    terms: Array.from(new Set(terms)).slice(0, 4),
    position,
  };
}

function deterministicSearchTerms(
  sections: string,
  facts: string | undefined,
  documentNeeded: string | undefined,
  directSectionTerms: string[],
  caseTypeHintTerms: string[]
): string[] {
  const originalIssue = sections.trim();
  const shortIssuePhrase = originalIssue.length <= 80 ? [originalIssue] : [];
  const sectionOrIssueParts = sections
    .split(/[,;/]+/)
    .map((t) => t.trim())
    .filter((t) => t.length >= 3);

  return uniqueTerms([
    ...directSectionTerms,
    ...caseTypeHintTerms,
    ...shortIssuePhrase,
    ...sectionOrIssueParts,
    ...splitKeywordTerms(documentNeeded || "", 2),
    ...splitKeywordTerms(facts || "", 3),
  ], 6);
}

export async function POST(request: NextRequest) {
  const session = await getCurrentUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!rateLimit(session.userId, 10, 60_000)) {
    return NextResponse.json({ error: "Too many requests. Please wait a minute." }, { status: 429 });
  }

  let sections: string, facts: string, documentNeeded: string, court: string, year: string;
  try {
    ({ sections, facts, documentNeeded, court, year } = await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!sections?.trim()) {
    return NextResponse.json({ error: "Law section(s) or case type is required." }, { status: 400 });
  }

  const knowledgeProfile = findCaseIntakeProfile({ sections, facts, documentNeeded });

  // Step 1: Extract search terms from case details
  const directSectionTerms = sections
    .split(/[,;\s]+/)
    .map((t) => t.trim())
    .filter((t) => t.length >= 2 && looksLikeSection(t))
    .slice(0, 3);
  const caseTypeHint = mappedCaseTypeTerms(`${sections} ${facts || ""}`);
  const deterministicTerms = deterministicSearchTerms(
    sections,
    facts,
    documentNeeded,
    directSectionTerms,
    caseTypeHint.terms
  );

  const extractPrompt = `You are a Pakistani legal researcher. Extract concise search terms for a case law database.

Case:
- Law Sections or Case Type/Issue: "${sections}"
- Facts: "${facts || "Not provided — use the section numbers, case type, or legal issue only"}"
- Document: "${documentNeeded || "legal document"}"

Return ONLY valid JSON (no markdown, no explanation):
{
  "primaryTerms": ["child adoption", "guardian"],
  "secondaryTerms": ["custody", "welfare of minor"],
  "clientPosition": "petitioner"
}

Rules:
- The first field may contain statute sections (e.g. 489-F PPC, 497 CrPC) OR a case type/legal issue (e.g. child adoption, custody, khula, property dispute).
- primaryTerms: section numbers and/or the core case type/legal issue keywords (max 3, short, specific)
- secondaryTerms: supporting legal keywords from facts or the likely practice area (max 3)
- clientPosition: one of "prosecution", "defence", "petitioner", "respondent", "appellant"`;

  let searchTerms: { primaryTerms: string[]; secondaryTerms: string[]; clientPosition: string };
  if (directSectionTerms.length > 0 && !facts?.trim()) {
    searchTerms = {
      primaryTerms: Array.from(new Set([...directSectionTerms, ...caseTypeHint.terms])).slice(0, 4),
      secondaryTerms: [],
      clientPosition: caseTypeHint.position || knowledgeProfile?.clientPosition || "defence",
    };
  } else if (caseTypeHint.terms.length > 0) {
    searchTerms = {
      primaryTerms: caseTypeHint.terms,
      secondaryTerms: [],
      clientPosition: caseTypeHint.position || knowledgeProfile?.clientPosition || "defence",
    };
  } else {
    try {
      const raw = await withTimeout(tryGenerate(extractPrompt), 12_000);
      const cleaned = raw.replace(/```json\n?/gi, "").replace(/```\n?/gi, "").trim();
      searchTerms = JSON.parse(cleaned);
      if (!Array.isArray(searchTerms.primaryTerms)) throw new Error("bad shape");
    } catch {
      searchTerms = {
        primaryTerms: deterministicTerms.slice(0, 4),
        secondaryTerms: [],
        clientPosition: knowledgeProfile?.clientPosition || "defence",
      };
    }
  }
  searchTerms = {
    primaryTerms: uniqueTerms([
      ...(knowledgeProfile?.searchTerms || []),
      ...directSectionTerms,
      ...caseTypeHint.terms,
      ...deterministicTerms,
      ...(Array.isArray(searchTerms.primaryTerms) ? searchTerms.primaryTerms : []),
    ], 6),
    secondaryTerms: uniqueTerms(Array.isArray(searchTerms.secondaryTerms) ? searchTerms.secondaryTerms : [], 3),
    clientPosition: searchTerms.clientPosition || caseTypeHint.position || knowledgeProfile?.clientPosition || "defence",
  };

  // Step 2: Search DB with extracted terms
  const courtParam = court && court !== "All Courts" ? court : undefined;
  const yearParam = year && year !== "All years" ? year : undefined;
  const allTerms = uniqueTerms([...searchTerms.primaryTerms, ...searchTerms.secondaryTerms], 5);
  const hasMappedSectionTerm = caseTypeHint.terms.some((term) => looksLikeSection(term));

  // Single fast query. A SQL `ORDER BY relevance` over ~240k rows with `content LIKE`
  // takes ~80s and was the cause of the 60s client abort; searchCandidatesFast skips
  // the ORDER BY (LIMIT short-circuits the scan) and relevance-sorts in memory (~1-2s).
  const candidates = searchCandidatesFast(allTerms, courtParam, yearParam, 30);

  if (candidates.length === 0) {
    return NextResponse.json({
      searchTerms,
      totalCandidates: 0,
      judgments: [],
      legalStrategy: buildNoJudgmentLegalStrategy(knowledgeProfile, sections),
    });
  }

  // Step 3: Fetch full content for top candidates from a court-diverse pool
  const topCandidates = candidates.slice(0, 14);
  const withContent = topCandidates
    .map((j) => {
      const full = getLocalJudgmentById(j.id);
      const content = full?.content?.slice(0, 2500) || j.passages.join(" ") || "";
      return { id: j.id, citation: j.citation, court: j.court, year: j.year, title: j.title, content };
    })
    .filter((j) => j.content.length > 50);

  // Step 4: Gemini — analyze and pick best judgments
  if (searchTerms.primaryTerms.some((term) => looksLikeSection(term)) && hasMappedSectionTerm) {
    const sectionTerms = searchTerms.primaryTerms.filter((term) => looksLikeSection(term));
    return NextResponse.json({
      searchTerms,
      totalCandidates: candidates.length,
      judgments: withContent.slice(0, 5).map((j) => ({
        id: j.id,
        citation: j.citation,
        court: j.court,
        year: j.year,
        title: j.title,
        reason: `Relevant judgment mentioning section ${sectionTerms.join(", ")}.`,
        ratio: "Review the judgment text for the exact legal principle and factual match.",
        stance: "neutral" as const,
      })),
      legalStrategy: facts?.trim()
        ? "These judgments were found directly from the mapped section/case type. Review them against the facts before drafting."
        : "These judgments were found directly from the section/case type. Add brief case facts for a stronger favorable/adverse analysis.",
    });
  }

  const summaries = withContent
    .map((j, i) => `[${i + 1}] ID:${j.id} | ${j.citation} | ${j.court} | ${j.year}\nTitle: ${j.title || "N/A"}\n${j.content.slice(0, 1100)}`)
    .join("\n\n---\n\n");

  const analyzePrompt = `You are an expert Pakistani advocate. Analyze the following judgments for a case and select the 5 most useful ones.

Case:
- Law Sections or Case Type/Issue: ${sections}
- Facts: ${facts || "Not provided"}
- Document: ${documentNeeded || "legal document"}
- Client Position: ${searchTerms.clientPosition}

Judgments from database:
${summaries}

Select up to 5 most useful judgments. For each, give:
- reason: why it helps this specific case (1-2 sentences)
- ratio: the key legal principle (1 sentence)
- stance: "favorable" (helps client), "adverse" (hurts client), or "neutral"

Selection policy:
- Pick the BEST judgments for this exact case. Do not select randomly and do not select only because a court is higher.
- Supreme Court judgments are strongest when they directly match the issue, but do NOT fill the list with Supreme Court judgments if High Court, District Court, or other court judgments match the facts/section better.
- Prefer a useful mix where available: binding Supreme Court authority + the most factually similar High Court/District Court authorities.
- Lahore High Court, Sindh High Court, Islamabad High Court, Peshawar High Court, Balochistan High Court, Federal Shariat Court, and District Court judgments may all be selected if their principle and facts are stronger for the case.
- For each selected judgment, explain the specific factual/legal match. If the match is weak, do not select it merely to complete five entries.

Drafting policy:
- Treat judgments as research guidance unless the lawyer expressly requests citations in the final draft.
- Do NOT recommend a generic paragraph like "In this regard, reliance is placed on the principles laid down in..." with a list of citations.
- If citations are needed later, each citation must be tied to a specific legal ground or argument instead of being listed as a blanket reliance line.

Return ONLY valid JSON (no markdown):
{
  "selected": [
    {
      "id": <number>,
      "citation": "<string>",
      "court": "<string>",
      "year": <number>,
      "reason": "<string>",
      "ratio": "<string>",
      "stance": "favorable" | "adverse" | "neutral"
    }
  ],
  "legalStrategy": "<2-3 sentences on how to use these judgments in the ${documentNeeded || "document"}>"
}`;

  let analysis: { selected: PreparedJudgment[]; legalStrategy: string };
  try {
    const raw = await withTimeout(tryGenerate(analyzePrompt), 18_000);
    const cleaned = raw.replace(/```json\n?/gi, "").replace(/```\n?/gi, "").trim();
    analysis = JSON.parse(cleaned);
    if (!Array.isArray(analysis.selected)) throw new Error("bad shape");
    // Attach title from withContent if missing
    analysis.selected = analysis.selected.map((s) => {
      const src = withContent.find((w) => w.id === s.id);
      return { ...s, title: s.title || src?.title || null };
    });
  } catch {
    analysis = {
      selected: withContent.slice(0, 5).map((j) => ({
        id: j.id,
        citation: j.citation,
        court: j.court,
        year: j.year,
        title: j.title,
        reason: "Relevant to the cited law section or case issue.",
        ratio: "See full judgment for the key legal principle.",
        stance: "neutral" as const,
      })),
      legalStrategy: "Review the selected judgments for guidance. Do not add a generic reliance paragraph unless the lawyer expressly wants authorities cited in the draft.",
    };
  }

  return NextResponse.json({
    searchTerms,
    totalCandidates: candidates.length,
    judgments: analysis.selected,
    legalStrategy: analysis.legalStrategy,
  });
}
