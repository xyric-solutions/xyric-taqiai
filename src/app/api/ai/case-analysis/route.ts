import { NextRequest, NextResponse } from "next/server";
import { geminiGenerate } from "@/lib/gemini-helper";
import { getCurrentUser } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { getSafeAiError } from "@/lib/ai-error";

/**
 * Case Analysis from an advocate–client discussion transcript.
 * Input:  { transcript: string, language?: "en" | "ur" }
 * Output: structured analysis (parties, facts, legal issues, suggested document,
 *         applicable law, missing info) + a ready-to-use draftRequest string that
 *         the smart-draft generator can turn into the actual document.
 */
export async function POST(request: NextRequest) {
  const session = await getCurrentUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!rateLimit(session.userId, 20, 60_000)) {
    return NextResponse.json({ error: "Too many requests. Please wait a minute and try again." }, { status: 429 });
  }

  try {
    const { transcript, language } = await request.json();

    if (!transcript?.trim()) {
      return NextResponse.json({ error: "Discussion transcript is required." }, { status: 400 });
    }
    if (transcript.length > 30000) {
      return NextResponse.json({ error: "Discussion is too long. Please shorten it." }, { status: 400 });
    }

    const isUrdu = language === "ur";

    const prompt = `You are a senior Pakistani advocate. Below is a transcript of a discussion between a lawyer and a client about the client's legal matter. The speakers may not be labelled — work out from the content who the client is (the person whose problem it is / the party) and what the lawyer is asking. The transcript may be in English, Urdu, Roman Urdu, or mixed.

Carefully ANALYSE the discussion and prepare the case. Identify the parties, the facts, the legal problem, the correct legal document to file, the applicable Pakistani law, and what important information is still missing.

DISCUSSION TRANSCRIPT:
"""
${transcript}
"""

STRICT RULES:
- Use ONLY information present in the transcript. Do NOT invent names, dates, amounts, CNICs, or sections.
- If something important was not said, list it under "missingInfo" — do NOT guess it.
- Choose the SINGLE most appropriate Pakistani legal document for this matter (e.g. "Bail Application under Section 497 CrPC", "Complaint under Section 489-F PPC", "Khula Petition", "Suit for Recovery", "Legal Notice", etc.).
- "draftRequest" must be a clear one-paragraph instruction describing exactly what document to draft and the key facts to include — written so a drafting AI can act on it directly.
- Write the analysis text fields in ${isUrdu ? "Urdu script" : "English"}. Keep "suggestedDocument", "applicableLaw", and "draftRequest" in English regardless (legal/document names).

Return ONLY a valid JSON object — no markdown, no commentary:
{
  "caseSummary": "2-3 sentence summary of the matter",
  "parties": [ { "role": "Client / Complainant / Petitioner / etc.", "name": "name or ___________ if not given", "details": "CNIC/address/relation if mentioned, else empty" } ],
  "facts": [ "fact 1", "fact 2" ],
  "legalIssues": [ "the legal question / wrong done" ],
  "suggestedDocument": "Exact document type to draft",
  "applicableLaw": [ "Section 489-F PPC", "Article 199 Constitution", "..." ],
  "missingInfo": [ "important detail not provided in the discussion" ],
  "draftRequest": "Draft a ... for ... based on these facts: ..."
}`;

    const raw = await geminiGenerate(prompt);
    const cleaned = raw.replace(/```json\n?/gi, "").replace(/```\n?/gi, "").trim();

    let analysis;
    try {
      analysis = JSON.parse(cleaned);
    } catch {
      // Fallback: surface a minimal analysis so the user can still proceed to draft
      return NextResponse.json({
        analysis: {
          caseSummary: "",
          parties: [],
          facts: [],
          legalIssues: [],
          suggestedDocument: "",
          applicableLaw: [],
          missingInfo: [],
          draftRequest: transcript,
        },
        rawFallback: true,
      });
    }

    return NextResponse.json({ analysis });
  } catch (error: unknown) {
    console.error("Case analysis error:", error);
    const friendly = getSafeAiError(error, "Case analysis failed. Please try again.");
    return NextResponse.json({ error: friendly.error }, { status: friendly.status });
  }
}
