import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getCurrentUser } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { buildKnowledgeInterpretation, findCaseIntakeProfile, type CaseDetailQuestion, type CaseIntakeProfile } from "@/lib/case-builder-knowledge";
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

function profilePayload(profile: CaseIntakeProfile, template: ReturnType<typeof buildTemplateQuestions>["template"]) {
  return {
    id: profile.id,
    title: profile.title,
    law: profile.law,
    matterType: profile.matterType,
    sectionRefs: profile.sectionRefs,
    ingredients: profile.ingredients,
    legalIngredients: profile.legalIngredients,
    evidenceChecklist: profile.evidenceChecklist,
    riskFlags: profile.riskFlags,
    draftingGuidance: profile.draftingGuidance,
    documentTypeMappings: profile.documentTypeMappings,
    template,
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
  const isUrdu = language === "ur";
  const labelLang = isUrdu ? "Urdu script" : "English";
  const knowledgeProfile = findCaseIntakeProfile({ sections, documentNeeded, purpose, facts });
  const templateMatch = buildTemplateQuestions(documentNeeded, sections, isUrdu, knowledgeProfile);

  if (!sections?.trim()) {
    return NextResponse.json({ error: "Law section(s) or case type is required." }, { status: 400 });
  }

  // ── Step 1: Interpret the section — what is this matter about? ────────────────
  if (action === "interpret") {
    if (knowledgeProfile) {
      return NextResponse.json({
        interpretation: buildKnowledgeInterpretation(knowledgeProfile),
        alternatives: [],
        profile: profilePayload(knowledgeProfile, templateMatch.template),
      });
    }

    const interpretPrompt = `You are an expert Pakistani advocate helping identify a legal matter.

The user typed this into the "Law Section(s) / Case Type" field: "${sections}"
${documentNeeded ? `They want to prepare: "${documentNeeded}"` : ""}

Explain, in ONE short plain-language sentence, what kind of legal matter this section / case type usually refers to under Pakistani law — so the user can confirm or correct your understanding. If it is a bare section number, name the offence/subject and the statute (e.g. "379 PPC — theft of movable property").

If the input is ambiguous and could reasonably mean more than one distinct kind of matter, list up to 3 short alternative meanings the user can pick from. If it is clear, return an empty alternatives array.

Write the "interpretation" and "alternatives" in ${labelLang}. Keep each alternative to a few words.

Return ONLY valid JSON (no markdown, no explanation):
{
  "interpretation": "one short sentence describing the matter",
  "alternatives": ["short alternative meaning", "..."]
}`;

    try {
      const raw = await withTimeout(tryGenerate(interpretPrompt), GEMINI_TIMEOUT_MS);
      const parsed = parseJson<{ interpretation?: string; alternatives?: string[] }>(raw);
      if (!parsed?.interpretation) throw new Error("bad shape");
      return NextResponse.json({
        interpretation: String(parsed.interpretation).trim(),
        alternatives: Array.isArray(parsed.alternatives)
          ? parsed.alternatives.map((a) => String(a).trim()).filter(Boolean).slice(0, 3)
          : [],
      });
    } catch {
      // Graceful fallback — let the UI proceed without blocking the user.
      return NextResponse.json({ interpretation: "", alternatives: [] });
    }
  }

  // ── Step 2: Build section-specific fact questions ─────────────────────────────
  if (action === "questions") {
    if (knowledgeProfile) {
      return NextResponse.json({
        questions: knowledgeProfile.questions,
        profile: profilePayload(knowledgeProfile, templateMatch.template),
        templateQuestions: [],
      });
    }

    const questionsPrompt = `You are an expert Pakistani advocate taking case intake from a client.

Law Section(s) / Case Type: "${sections}"
Nature of the matter (confirmed by the user): "${purpose?.trim() || sections}"
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
      const questions = Array.isArray(parsed?.questions)
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
      return NextResponse.json({ questions, templateQuestions: [] });
    } catch {
      return NextResponse.json({ questions: templateMatch.questions, templateQuestions: templateMatch.questions });
    }
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
