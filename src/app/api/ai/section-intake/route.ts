import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getCurrentUser } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { buildKnowledgeInterpretation, findCaseIntakeProfile, type CaseDetailQuestion, type CaseIntakeProfile } from "@/lib/case-builder-knowledge";
import { isPlainLanguageCaseName, resolveKnownCaseName, resolveProfileCaseName, type ProvisionAlternative } from "@/lib/case-name-provision-resolver";
import { parseLegalProvisionReference, summarizeProvisionText, type LegalProvisionReference } from "@/lib/legal-provision-reference";
import { searchStatuteSections, type StatuteHit } from "@/lib/statute-db-runtime";
import { getAllTemplates } from "@/templates";
import type { FormField, TemplateDefinition } from "@/templates/types";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const MODEL_CANDIDATES = [
  "gemini-2.5-flash",
  "gemini-3.5-flash",
  "gemini-3.1-flash-lite",
  "gemini-2.5-flash-lite",
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
    if (msg.includes("timed out")) throw err;
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

function parseJson<T>(raw: string): T | null {
  try {
    const cleaned = raw.replace(/```json\n?/gi, "").replace(/```\n?/gi, "").trim();
    return JSON.parse(cleaned) as T;
  } catch {
    return null;
  }
}

function toSnakeCase(value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/[^A-Za-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toLowerCase();
}

function normalizeText(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

const GENERIC_TEMPLATE_TERMS = new Set([
  "application",
  "petition",
  "complaint",
  "case",
  "matter",
  "document",
  "legal",
  "criminal",
  "civil",
  "family",
  "law",
  "under",
  "section",
  "sections",
  "act",
  "ppc",
  "crpc",
  "cpc",
]);

function searchTokens(value: string): string[] {
  return normalizeText(value)
    .split(" ")
    .filter((word) => word.length >= 2)
    .filter((word) => /^\d/.test(word) || !GENERIC_TEMPLATE_TERMS.has(word));
}

const LEGAL_ISSUE_STOP_WORDS = new Set([
  "about", "after", "against", "before", "being", "case", "did", "does", "from",
  "has", "have", "into", "matter", "not", "only", "other", "the", "their", "there",
  "this", "through", "was", "were", "what", "when", "where", "which", "with", "without",
]);

function legalIssueSearchTerms(value: string): string[] {
  const words = searchTokens(value).filter((word) => !LEGAL_ISSUE_STOP_WORDS.has(word));
  const expanded = new Set(words);
  const normalized = normalizeText(value);

  if (/\b(?:sell|sold|sale|transfer|transferred|alienate|alienated|alienation)\b/.test(normalized)) {
    expanded.add("transfer");
    expanded.add("sale");
  }
  if (/\b(?:permission|consent|authority|unauthorized|unauthorised)\b/.test(normalized)) {
    expanded.add("authority");
    expanded.add("consent");
  }
  if (/\b(?:sister|daughter|female|widow|woman|women)\b/.test(normalized)) {
    expanded.add("woman");
    expanded.add("inheritance");
  }
  if (/\b(?:property|land|house|plot|share|estate)\b/.test(normalized)) {
    expanded.add("property");
    expanded.add("ownership");
  }

  return Array.from(expanded).slice(0, 18);
}

function cleanActName(value: string): string {
  return value
    .replace(/\s*\(Under (?:Final )?Review\)\s*/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function statuteHitCitation(hit: StatuteHit): string {
  const section = String(hit.sectionNo || "").trim();
  const provision = !section
    ? ""
    : /^(?:section|article|order|rule)\b/i.test(section)
      ? section
      : `Section ${section}`;
  return [provision, cleanActName(hit.actName)].filter(Boolean).join(", ");
}

function rankStatuteHitsForIssue(issue: string, hits: StatuteHit[]): StatuteHit[] {
  const terms = legalIssueSearchTerms(issue);
  return hits
    .filter((hit) => Boolean(hit.sectionNo))
    .map((hit) => {
      const act = normalizeText(hit.actName);
      const heading = normalizeText(hit.title || "");
      const body = normalizeText(hit.body);
      const matchedTerms = terms.filter((term) => act.includes(term) || heading.includes(term) || body.includes(term));
      const score = matchedTerms.length
        + terms.filter((term) => act.includes(term)).length * 2
        + terms.filter((term) => heading.includes(term)).length * 4;
      return { hit, matchedTerms: matchedTerms.length, score };
    })
    .filter((item) => item.matchedTerms >= 2 && item.score >= 4)
    .sort((first, second) => second.score - first.score)
    .map((item) => item.hit);
}

function statuteCandidateContext(hits: StatuteHit[]): string {
  if (!hits.length) return "No directly matching section was found in the local statute corpus.";
  return hits.slice(0, 6).map((hit, index) => {
    const heading = hit.title ? ` — ${hit.title}` : "";
    return `[V${index + 1}] ${statuteHitCitation(hit)}${heading}: ${summarizeProvisionText(hit.body, 420)}`;
  }).join("\n");
}

function statuteIssueFallback(issue: string, hits: StatuteHit[]): {
  sections: string;
  interpretation: string;
  matterSummary: string;
  alternatives: ProvisionAlternative[];
} | null {
  const ranked = rankStatuteHitsForIssue(issue, hits);
  const primary = ranked[0];
  if (!primary) return null;

  const sections = statuteHitCitation(primary);
  const title = primary.title?.trim() || cleanActName(primary.actName);
  const alternatives = ranked.slice(1, 4).map((hit) => ({
    label: hit.title?.trim() || cleanActName(hit.actName),
    sections: statuteHitCitation(hit),
    interpretation: `This verified provision may apply depending on the precise facts: ${summarizeProvisionText(hit.body, 220)}`,
  }));
  return {
    sections,
    interpretation: `${sections} is the closest verified statutory match for this description (${title}). Confirm or correct it before the case is prepared.`,
    matterSummary: `${issue.trim()} — provision matched from the local Pakistani statute corpus: ${sections}.`,
    alternatives,
  };
}

function templateScore(template: TemplateDefinition, query: string, profile?: CaseIntakeProfile | null): number {
  const normalizedQuery = normalizeText(query);
  const profileQuery = profile
    ? [
        profile.title,
        profile.matterType,
        ...profile.sectionRefs,
        ...profile.searchTerms,
        ...profile.documentTypeMappings,
      ].join(" ")
    : "";
  if (!normalizedQuery && !profileQuery) return 0;
  const candidates = [
    template.name,
    template.nameUrdu,
    template.description,
    template.category,
    template.subType,
  ].map(normalizeText);
  const candidateText = candidates.join(" ");
  const candidateTokens = new Set(searchTokens(candidateText));
  let score = 0;

  for (const candidate of candidates) {
    if (!candidate || !normalizedQuery) continue;
    if (candidate === normalizedQuery) score += 100;
    else if (candidate.includes(normalizedQuery) || normalizedQuery.includes(candidate)) score += 45;
  }

  for (const token of searchTokens(query)) {
    if (candidateTokens.has(token)) score += /^\d/.test(token) ? 22 : 10;
    else if (candidateText.includes(token)) score += /^\d/.test(token) ? 14 : 5;
  }

  if (profile) {
    const profilePhrases = [
      profile.title,
      profile.matterType,
      ...profile.sectionRefs,
      ...profile.searchTerms,
      ...profile.documentTypeMappings,
    ].map(normalizeText).filter(Boolean);

    const normalizedSubType = normalizeText(template.subType);
    const normalizedName = normalizeText(template.name);
    if (profile.documentTypeMappings.some((mapping) => {
      const normalizedMapping = normalizeText(mapping);
      return normalizedMapping === normalizedSubType ||
        normalizedName.includes(normalizedMapping) ||
        normalizedMapping.includes(normalizedSubType);
    })) {
      score += 80;
    }

    for (const phrase of profilePhrases) {
      if (phrase.length >= 3 && candidateText.includes(phrase)) score += /^\d/.test(phrase) ? 45 : 35;
    }

    for (const token of searchTokens(profileQuery)) {
      if (candidateTokens.has(token)) score += /^\d/.test(token) ? 30 : 16;
      else if (candidateText.includes(token)) score += /^\d/.test(token) ? 20 : 8;
    }
  }

  return score;
}

function findMatchingTemplate(documentNeeded?: string, sections?: string, profile?: CaseIntakeProfile | null): TemplateDefinition | null {
  if (!documentNeeded?.trim() && profile?.id.endsWith("-general")) return null;
  const query = [documentNeeded, sections].filter(Boolean).join(" ");
  const minimumScore = profile ? 45 : 32;
  const ranked = getAllTemplates()
    .map((template) => ({ template, score: templateScore(template, query, profile) }))
    .filter((item) => item.score >= minimumScore)
    .sort((first, second) => second.score - first.score);
  return ranked[0]?.template || null;
}

function isGenericIdentityField(field: FormField): boolean {
  const text = `${field.name} ${field.label}`.toLowerCase();
  return /\b(name|father|cnic|address|court|district|city|applicant|petitioner|plaintiff|respondent|defendant|accused|opponent|client)\b/.test(text);
}

function templateFieldToQuestion(field: FormField, isUrdu: boolean): CaseDetailQuestion {
  return {
    id: `template_${toSnakeCase(field.name)}`,
    label: isUrdu ? field.labelUrdu || field.label : field.label,
    placeholder: isUrdu ? field.placeholderUrdu || field.placeholder || "" : field.placeholder || "",
    required: field.required,
    category: "template",
    source: "template",
  };
}

function buildTemplateQuestions(documentNeeded: string | undefined, sections: string | undefined, isUrdu: boolean, profile?: CaseIntakeProfile | null): {
  template: Pick<TemplateDefinition, "category" | "subType" | "name"> | null;
  questions: CaseDetailQuestion[];
} {
  const template = findMatchingTemplate(documentNeeded, sections, profile);
  if (!template) return { template: null, questions: [] };

  return {
    template: {
      category: template.category,
      subType: template.subType,
      name: template.name,
    },
    questions: template.formFields
      .filter((field) => field.required && !isGenericIdentityField(field))
      .map((field) => templateFieldToQuestion(field, isUrdu))
      .slice(0, 10),
  };
}

interface ExactProvisionResolution {
  reference: string;
  provision: string;
  subsections: string[];
  lawCode: string | null;
  actName: string | null;
  text: string;
  verified: boolean;
}

function profilePayload(
  profile: CaseIntakeProfile,
  template: ReturnType<typeof buildTemplateQuestions>["template"],
  exactProvision?: ExactProvisionResolution | null
) {
  const sectionRefs = exactProvision
    ? [exactProvision.reference, ...profile.sectionRefs.filter((item) => item !== exactProvision.reference)]
    : profile.sectionRefs;
  return {
    id: profile.id,
    title: profile.title,
    law: profile.law,
    matterType: profile.matterType,
    sectionRefs,
    ingredients: profile.ingredients,
    legalIngredients: profile.legalIngredients,
    evidenceChecklist: profile.evidenceChecklist,
    riskFlags: profile.riskFlags,
    draftingGuidance: profile.draftingGuidance,
    documentTypeMappings: profile.documentTypeMappings,
    template,
    exactProvision: exactProvision || null,
  };
}

function actMatchesReference(hit: StatuteHit, reference: LegalProvisionReference): boolean {
  const act = hit.actName.toLowerCase();
  if (reference.lawCode === "PPC") return act.includes("penal code");
  if (reference.lawCode === "CrPC") return act.includes("criminal procedure");
  if (reference.lawCode === "CPC") return act.includes("civil procedure");
  if (reference.lawCode === "QSO") return act.includes("qanun-e-shahadat");
  if (reference.lawCode === "PECA") return act.includes("electronic crimes");
  if (reference.lawCode === "Constitution") return act.includes("constitution");
  return true;
}

async function resolveExactProvision(reference: LegalProvisionReference): Promise<ExactProvisionResolution> {
  if (!reference.lawCode) {
    return {
      reference: reference.canonical,
      provision: reference.provision,
      subsections: reference.subsections,
      lawCode: null,
      actName: null,
      text: "",
      verified: false,
    };
  }

  const hits = await searchStatuteSections(
    [reference.provision, reference.lawCode, ...reference.subsections],
    4,
    reference.canonical
  );
  const hit = hits.find((item) => actMatchesReference(item, reference)) || null;
  return {
    reference: reference.canonical,
    provision: reference.provision,
    subsections: reference.subsections,
    lawCode: reference.lawCode,
    actName: hit?.actName || null,
    text: hit?.body || "",
    verified: Boolean(hit?.body),
  };
}

function exactProvisionInterpretation(exactProvision: ExactProvisionResolution): string {
  const matterSummary = exactProvisionMatterSummary(exactProvision);
  return `${matterSummary} Is this the exact provision you want to proceed with?`;
}

function exactProvisionMatterSummary(exactProvision: ExactProvisionResolution): string {
  const statute = exactProvision.actName ? ` of ${exactProvision.actName}` : "";
  const summary = summarizeProvisionText(exactProvision.text);
  if (summary) {
    return `${exactProvision.reference}${statute} provides: ${summary}`;
  }
  return `${exactProvision.reference}${statute}.`;
}

function exactProvisionQuestion(exactProvision: ExactProvisionResolution | null, isUrdu: boolean): CaseDetailQuestion | null {
  if (!exactProvision) return null;
  const summary = summarizeProvisionText(exactProvision.text, 360);
  return {
    id: "exact_provision_facts",
    label: isUrdu
      ? `وہ کون سے مخصوص حقائق ہیں جو ${exactProvision.reference} کے تقاضے پورے کرتے ہیں؟`
      : `What specific facts bring this matter under ${exactProvision.reference}?`,
    placeholder: isUrdu
      ? `مثال: اس قانونی تقاضے سے متعلق تاریخ، کردار، حیثیت اور عمل بیان کریں${summary ? ` — ${summary}` : ""}`
      : `Example: State the facts proving each part of this provision${summary ? ` — ${summary}` : ""}`,
    required: true,
    category: "mandatory",
    source: "profile",
  };
}

export async function POST(request: NextRequest) {
  const session = await getCurrentUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!rateLimit(session.userId, 20, 60_000)) {
    return NextResponse.json({ error: "Too many requests. Please wait a minute." }, { status: 429 });
  }

  let body: {
    action?: string;
    sections?: string;
    documentNeeded?: string;
    purpose?: string;
    facts?: string;
    language?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { action, sections, documentNeeded, purpose, facts, language } = body;

  if (!sections?.trim()) {
    return NextResponse.json({ error: "Law section(s) or case type is required." }, { status: 400 });
  }

  const isUrdu = language === "ur";
  const labelLang = isUrdu ? "Urdu script" : "English";
  const requestedProfile = findCaseIntakeProfile({ sections, documentNeeded, purpose, facts });
  const caseNameResolution = isPlainLanguageCaseName(sections)
    ? resolveKnownCaseName(sections) || resolveProfileCaseName(sections, requestedProfile)
    : null;
  const provisionInput = caseNameResolution?.sections || sections;
  const exactReference = parseLegalProvisionReference(provisionInput);
  const preserveProvisionInput = Boolean(
    exactReference &&
    (/\bsections\b/i.test(provisionInput) || !exactReference.lawCode)
  );
  const normalizedSections = caseNameResolution?.sections ||
    (preserveProvisionInput ? provisionInput.trim() : exactReference?.canonical) ||
    sections.trim();
  const exactProvision = exactReference ? await resolveExactProvision(exactReference) : null;
  const knowledgeProfile = findCaseIntakeProfile({ sections: normalizedSections, documentNeeded, purpose, facts }) || requestedProfile;
  const templateMatch = buildTemplateQuestions(documentNeeded, normalizedSections, isUrdu, knowledgeProfile);

  // ── Step 1: Interpret the section — what is this matter about? ────────────────
  if (action === "interpret") {
    if (caseNameResolution) {
      return NextResponse.json({
        interpretation: caseNameResolution.interpretation,
        matterSummary: caseNameResolution.matterSummary,
        alternatives: caseNameResolution.alternatives.map((alternative) => alternative.label),
        provisionAlternatives: caseNameResolution.alternatives,
        normalizedSections,
        exactProvision,
        caseNameResolved: true,
        provisionVerified: Boolean(exactProvision?.verified) || caseNameResolution.source === "rule",
        profile: knowledgeProfile ? profilePayload(knowledgeProfile, templateMatch.template, exactProvision) : null,
      });
    }

    if (exactProvision?.verified) {
      return NextResponse.json({
        interpretation: exactProvisionInterpretation(exactProvision),
        matterSummary: exactProvisionMatterSummary(exactProvision),
        alternatives: [],
        normalizedSections,
        exactProvision,
        caseNameResolved: false,
        provisionVerified: true,
        profile: knowledgeProfile ? profilePayload(knowledgeProfile, templateMatch.template, exactProvision) : null,
      });
    }

    if (knowledgeProfile && !isPlainLanguageCaseName(sections)) {
      return NextResponse.json({
        interpretation: exactProvision
          ? `${exactProvision.reference}: ${buildKnowledgeInterpretation(knowledgeProfile)} Is this the exact provision you want to proceed with?`
          : buildKnowledgeInterpretation(knowledgeProfile),
        matterSummary: exactProvision
          ? `${exactProvision.reference}: ${buildKnowledgeInterpretation(knowledgeProfile)}`
          : buildKnowledgeInterpretation(knowledgeProfile),
        alternatives: [],
        normalizedSections,
        exactProvision,
        caseNameResolved: false,
        provisionVerified: Boolean(exactProvision?.verified),
        profile: profilePayload(knowledgeProfile, templateMatch.template, exactProvision),
      });
    }

    const statuteCandidates = isPlainLanguageCaseName(sections)
      ? await searchStatuteSections(legalIssueSearchTerms(sections), 8, sections)
      : [];
    const verifiedStatuteContext = statuteCandidateContext(statuteCandidates);
    const interpretPrompt = `You are an expert Pakistani advocate helping identify a legal matter.

The user typed this into the "Law Section(s) / Case Type" field: "${sections}"
${exactProvision ? `The exact normalized citation is "${exactProvision.reference}". Preserve every subsection exactly and never replace it with the parent section.` : ""}
${documentNeeded ? `They want to prepare: "${documentNeeded}"` : ""}

The input may be a case name or an ordinary-language description of a legal dispute. Identify the exact Pakistani legal provision that most directly governs the facts described. Do not merely repeat or rephrase the user's text as the legal provision. Do not add common intention, abetment, conspiracy, attempt, evidentiary, or procedural sections unless the user's words make them applicable. Explain the result in one short sentence so the user can confirm or correct it.

VERIFIED CANDIDATES FROM THE LOCAL PAKISTANI STATUTE CORPUS:
${verifiedStatuteContext}

Prefer a directly relevant verified candidate above. A candidate is not automatically applicable merely because it was retrieved. Where ownership, province, relationship, forum, or criminal intent changes the governing law, select the safest primary civil or criminal provision and place fact-dependent possibilities in alternatives.

If the case name is ambiguous, select the most likely primary provision and return up to 3 alternatives. Each alternative must include its own exact sections. Use only Pakistani statutes and section numbers you are highly confident exist. Never invent a section.

Write the user-facing text in ${labelLang}. Keep each alternative label short. Keep statute names and citations in their official form.

Return ONLY valid JSON (no markdown, no explanation):
{
  "interpretation": "one short sentence describing the matter and selected law",
  "matterSummary": "short confirmed matter description without a question",
  "resolvedSections": "exact section citation(s) and Pakistani statute name",
  "alternatives": [
    { "label": "short alternative", "sections": "exact alternative sections", "interpretation": "why it may apply" }
  ]
}`;

    try {
      const raw = await withTimeout(tryGenerate(interpretPrompt), GEMINI_TIMEOUT_MS);
      const parsed = parseJson<{
        interpretation?: string;
        matterSummary?: string;
        resolvedSections?: string;
        alternatives?: ProvisionAlternative[];
      }>(raw);
      const inferredSections = String(parsed?.resolvedSections || "").replace(/\s+/g, " ").trim();
      const repeatedRawIssue = normalizeText(inferredSections) === normalizeText(sections);
      if (!parsed?.interpretation || (isPlainLanguageCaseName(sections) && (!inferredSections || repeatedRawIssue))) throw new Error("bad shape");
      const inferredReference = inferredSections ? parseLegalProvisionReference(inferredSections) : exactReference;
      const inferredExactProvision = inferredReference ? await resolveExactProvision(inferredReference) : exactProvision;
      const inferredProfile = inferredSections
        ? findCaseIntakeProfile({ sections: inferredSections, documentNeeded, purpose: parsed.matterSummary, facts }) || knowledgeProfile
        : knowledgeProfile;
      const provisionAlternatives = Array.isArray(parsed.alternatives)
        ? parsed.alternatives
            .filter((alternative) => alternative?.label && alternative?.sections)
            .map((alternative) => ({
              label: String(alternative.label).trim(),
              sections: String(alternative.sections).replace(/\s+/g, " ").trim(),
              interpretation: String(alternative.interpretation || alternative.label).trim(),
            }))
            .slice(0, 3)
        : [];
      return NextResponse.json({
        interpretation: inferredExactProvision && !String(parsed.interpretation).includes(inferredExactProvision.provision)
          ? `${inferredExactProvision.reference}: ${String(parsed.interpretation).trim()}`
          : String(parsed.interpretation).trim(),
        matterSummary: String(parsed.matterSummary || parsed.interpretation).trim(),
        alternatives: provisionAlternatives.map((alternative) => alternative.label),
        provisionAlternatives,
        normalizedSections: inferredSections || normalizedSections,
        exactProvision: inferredExactProvision,
        caseNameResolved: Boolean(inferredSections && isPlainLanguageCaseName(sections)),
        provisionVerified: Boolean(inferredExactProvision?.verified),
        profile: inferredProfile
          ? profilePayload(
              inferredProfile,
              buildTemplateQuestions(documentNeeded, inferredSections || normalizedSections, isUrdu, inferredProfile).template,
              inferredExactProvision
            )
          : null,
      });
    } catch {
      // Graceful fallback — let the UI proceed without blocking the user.
      const statuteFallback = statuteIssueFallback(sections, statuteCandidates);
      if (statuteFallback) {
        const fallbackProfile = findCaseIntakeProfile({
          sections: statuteFallback.sections,
          documentNeeded,
          purpose: statuteFallback.matterSummary,
          facts,
        }) || knowledgeProfile;
        return NextResponse.json({
          interpretation: statuteFallback.interpretation,
          matterSummary: statuteFallback.matterSummary,
          alternatives: statuteFallback.alternatives.map((alternative) => alternative.label),
          provisionAlternatives: statuteFallback.alternatives,
          normalizedSections: statuteFallback.sections,
          exactProvision: null,
          caseNameResolved: true,
          provisionVerified: true,
          profile: fallbackProfile
            ? profilePayload(
                fallbackProfile,
                buildTemplateQuestions(documentNeeded, statuteFallback.sections, isUrdu, fallbackProfile).template,
                null
              )
            : null,
        });
      }

      if (isPlainLanguageCaseName(sections)) {
        return NextResponse.json({
          error: "TaqiAI could not safely identify a verified Pakistani legal provision from this description. Please add the parties' relationship, disputed right, act complained of, and requested relief.",
          resolutionFailed: true,
        }, { status: 422 });
      }

      return NextResponse.json({
        interpretation: exactProvision ? exactProvisionInterpretation(exactProvision) : "",
        matterSummary: exactProvision ? exactProvisionMatterSummary(exactProvision) : "",
        alternatives: [],
        normalizedSections,
        exactProvision,
        caseNameResolved: false,
        provisionVerified: Boolean(exactProvision?.verified),
      });
    }
  }

  // ── Step 2: Build section-specific fact questions ─────────────────────────────
  if (action === "questions") {
    const questionProvision = exactProvision && !exactProvision.verified && normalizedSections !== exactProvision.reference
      ? { ...exactProvision, reference: normalizedSections }
      : exactProvision;
    const requiresExactAiQuestions = Boolean(exactProvision && knowledgeProfile?.id.endsWith("-general"));
    if (knowledgeProfile && !requiresExactAiQuestions) {
      return NextResponse.json({
        questions: knowledgeProfile.questions,
        profile: profilePayload(knowledgeProfile, templateMatch.template, exactProvision),
        templateQuestions: [],
        normalizedSections,
        exactProvision,
      });
    }

    const questionsPrompt = `You are an expert Pakistani advocate taking case intake from a client.

Law Section(s) / Case Type: "${normalizedSections}"
Nature of the matter (confirmed by the user): "${purpose?.trim() || normalizedSections}"
${exactProvision?.text ? `Verified statutory text for the exact provision: "${summarizeProvisionText(exactProvision.text, 900)}"` : ""}
${documentNeeded ? `Document to prepare: "${documentNeeded}"` : ""}
${facts?.trim() ? `Facts already given: "${facts.trim()}"` : ""}

List the important CASE-SPECIFIC factual questions a lawyer must ask to build and draft THIS specific kind of matter — the concrete incident/subject details that make this case unique.

Examples of the level of detail wanted:
- Vehicle theft → vehicle registration number, make & model, engine number, chassis number, date & place of theft, FIR number + police station + FIR date, estimated value, recovery status.
- Cheque dishonour (489-F) → cheque number, cheque amount, cheque date, bank name, reason of dishonour, date of dishonour, underlying transaction.
- Bail → offence & sections, FIR number + police station, date of arrest, custody status, role assigned to the accused.
- Maintenance/khula → date of marriage, haq mehr, number & ages of children, amount demanded, date of desertion.

The examples above illustrate specificity only. Never copy a field from an example unless it belongs to the exact confirmed matter and intended document.

STRICT RULES:
1. Ask ONLY the case-specific facts for this matter. DO NOT ask for generic party identity that the form already collects: client/opponent name, father name, CNIC, address, court name, district/city. Skip those entirely.
2. Return between 6 and 14 questions. If fewer genuinely apply, return fewer.
3. Field "id" must be snake_case English (e.g. "vehicle_registration_no", "date_of_theft").
4. Write each "label" in ${labelLang}.
5. Placeholders must be realistic Pakistani examples written in ${isUrdu ? "Urdu script" : "English"}.
6. Mark a question "required": true only if the draft would be materially incomplete without it.
7. Adapt the questions to the exact procedural posture and intended document. Cover, where relevant: the client's side, enabling law, incident or transaction chronology, impugned FIR/order/notice/decree, current proceeding stage, limitation dates, jurisdiction or forum, statutory ingredients, supporting documents and witnesses, prior proceedings or alternate remedy, likely opposing contention, interim protection, and exact final relief.
8. Do not ask the user to provide legal arguments or case citations. Ask for facts and documents from which the system can build arguments and research authenticated judgments.
9. Never assume a court, province, procedural remedy, or legal provision merely from a vague label. Ask a focused clarification when it changes jurisdiction or maintainability.
10. If the citation contains a subsection, every question must address that exact subsection. Never broaden it to the parent section.

Return ONLY valid JSON (no markdown, no explanation):
{
  "questions": [
    { "id": "field_id", "label": "question in ${labelLang}", "placeholder": "realistic example", "required": true, "category": "mandatory" }
  ]
}`;

    try {
      const raw = await withTimeout(tryGenerate(questionsPrompt), GEMINI_TIMEOUT_MS);
      const parsed = parseJson<{
        questions?: { id?: string; label?: string; placeholder?: string; required?: boolean; category?: string }[];
      }>(raw);
      const generatedQuestions = Array.isArray(parsed?.questions)
        ? parsed!.questions
            .filter((q) => q?.id && q?.label)
            .map((q) => ({
              id: String(q.id),
              label: String(q.label),
              placeholder: String(q.placeholder || ""),
              required: Boolean(q.required),
              category: ["mandatory", "procedural", "evidence", "limitation", "jurisdiction", "relief", "optional"].includes(String(q.category || ""))
                ? q.category as CaseDetailQuestion["category"]
                : (q.required ? "mandatory" : "optional"),
              source: "ai" as const,
            }))
            .slice(0, 14)
        : [];
      const statutoryQuestion = exactProvisionQuestion(questionProvision, isUrdu);
      const questions = statutoryQuestion
        ? [statutoryQuestion, ...generatedQuestions.filter((question) => question.id !== statutoryQuestion.id)].slice(0, 14)
        : generatedQuestions;
      return NextResponse.json({
        questions,
        templateQuestions: [],
        profile: knowledgeProfile ? profilePayload(knowledgeProfile, templateMatch.template, exactProvision) : null,
        normalizedSections,
        exactProvision,
      });
    } catch {
      const fallbackQuestions = templateMatch.questions.length
        ? templateMatch.questions
        : knowledgeProfile?.questions || [];
      const statutoryQuestion = exactProvisionQuestion(questionProvision, isUrdu);
      const questions = statutoryQuestion
        ? [statutoryQuestion, ...fallbackQuestions.filter((question) => question.id !== statutoryQuestion.id)].slice(0, 14)
        : fallbackQuestions;
      return NextResponse.json({
        questions,
        templateQuestions: templateMatch.questions,
        profile: knowledgeProfile ? profilePayload(knowledgeProfile, templateMatch.template, exactProvision) : null,
        normalizedSections,
        exactProvision,
      });
    }
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
