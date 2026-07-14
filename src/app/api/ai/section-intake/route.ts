import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getCurrentUser } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { buildKnowledgeInterpretation, findCaseIntakeProfile } from "@/lib/case-builder-knowledge";

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

  if (!sections?.trim()) {
    return NextResponse.json({ error: "Law section(s) or case type is required." }, { status: 400 });
  }

  // ── Step 1: Interpret the section — what is this matter about? ────────────────
  if (action === "interpret") {
    if (knowledgeProfile) {
      return NextResponse.json({
        interpretation: buildKnowledgeInterpretation(knowledgeProfile),
        alternatives: [],
        profile: {
          id: knowledgeProfile.id,
          title: knowledgeProfile.title,
          law: knowledgeProfile.law,
          sectionRefs: knowledgeProfile.sectionRefs,
          ingredients: knowledgeProfile.ingredients,
        },
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
        profile: {
          id: knowledgeProfile.id,
          title: knowledgeProfile.title,
          law: knowledgeProfile.law,
          sectionRefs: knowledgeProfile.sectionRefs,
          ingredients: knowledgeProfile.ingredients,
          draftingGuidance: knowledgeProfile.draftingGuidance,
        },
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

STRICT RULES:
1. Ask ONLY the case-specific facts for this matter. DO NOT ask for generic party identity that the form already collects: client/opponent name, father name, CNIC, address, court name, district/city. Skip those entirely.
2. Return between 3 and 8 questions. If fewer genuinely apply, return fewer.
3. Field "id" must be snake_case English (e.g. "vehicle_registration_no", "date_of_theft").
4. Write each "label" in ${labelLang}.
5. Placeholders must be realistic Pakistani examples written in ${isUrdu ? "Urdu script" : "English"}.
6. Mark a question "required": true only if the draft would be materially incomplete without it.

Return ONLY valid JSON (no markdown, no explanation):
{
  "questions": [
    { "id": "field_id", "label": "question in ${labelLang}", "placeholder": "realistic example", "required": true }
  ]
}`;

    try {
      const raw = await withTimeout(tryGenerate(questionsPrompt), GEMINI_TIMEOUT_MS);
      const parsed = parseJson<{
        questions?: { id?: string; label?: string; placeholder?: string; required?: boolean }[];
      }>(raw);
      const questions = Array.isArray(parsed?.questions)
        ? parsed!.questions
            .filter((q) => q?.id && q?.label)
            .map((q) => ({
              id: String(q.id),
              label: String(q.label),
              placeholder: String(q.placeholder || ""),
              required: Boolean(q.required),
            }))
            .slice(0, 8)
        : [];
      return NextResponse.json({ questions });
    } catch {
      return NextResponse.json({ questions: [] });
    }
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
