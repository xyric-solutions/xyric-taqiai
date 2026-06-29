import { NextRequest, NextResponse } from "next/server";
import { buildAIPrompt, buildLanguageRule } from "@/lib/intent-handlers";
import { detectIntent } from "@/lib/intent-detection";
import { geminiGenerateStream } from "@/lib/gemini-helper";
import { Part } from "@google/generative-ai";
import { getCurrentUser } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { retrieveGrounding, type GroundingSource } from "@/lib/judgment-retrieval";
import { retrieveStatuteGrounding } from "@/lib/statute-retrieval";
import { stampDutyBlock, feeProvinceOf } from "@/lib/stamp-duty-reference";
import { latestFinanceFeeAmendments } from "@/lib/statute-db";
import { legalUpdatesBlock } from "@/lib/legal-updates-reference";

export const dynamic = "force-dynamic";

/** The advisor message arrives with a system/intent prologue; pull out the real question. */
function userQuestionFrom(message: string): string {
  const marker = "USER QUESTION:";
  const idx = message.lastIndexOf(marker);
  return idx !== -1 ? message.slice(idx + marker.length).trim() : message;
}

function compactHistory(history: unknown): { role: string; content: string }[] {
  if (!Array.isArray(history)) return [];

  return history
    .filter((msg): msg is { role: string; content: string } =>
      typeof msg?.role === "string" && typeof msg?.content === "string"
    )
    .slice(-8)
    .map((msg) => ({
      role: msg.role,
      content: msg.content.slice(0, 1200),
    }));
}

/** Does the user actually want case-law / precedent shown? */
function wantsCaseLaw(q: string): boolean {
  return /\b(case[ -]?law|judg?ements?|judgments?|precedents?|rulings?|authorit(y|ies)|citations?|scmr|\bpld\b|\bplj\b|\bylr\b|\bmld\b|faisl[ae]|nazair|misal)\b/i.test(q);
}

export async function POST(request: NextRequest) {
  const session = await getCurrentUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!rateLimit(session.userId, 20, 60_000)) {
    return NextResponse.json({ error: "Too many requests. Please wait a minute and try again." }, { status: 429 });
  }

  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }
    const { message, history, image } = body;

    if (!message && !image) {
      return NextResponse.json({ error: "Message or image is required" }, { status: 400 });
    }

    const realQuestion = userQuestionFrom(message || "");
    const compacted = compactHistory(history);
    const intent = detectIntent(realQuestion);
    const prompt = buildAIPrompt(message || "Analyze this legal document", compacted);
    const finalLanguageRule = buildLanguageRule(realQuestion || message || "");

    // Only surface judgments when they're actually wanted — a fresh (first)
    // question, or whenever the user explicitly asks for case-law/precedent.
    // Plain conversational follow-ups stay clean (no judgment dump every turn).
    const isFollowUp = compacted.length > 0;
    const groundNow = !image && !!message && (!isFollowUp || wantsCaseLaw(realQuestion));
    // Statute grounding runs on EVERY text turn — the latest Act text should
    // ground the answer to the law itself (e.g. stamp paper), unlike judgments
    // which we only surface when actually wanted.
    const statuteNow = !image && !!message;

    let sources: GroundingSource[] = [];
    const blocks: string[] = [];
    if (groundNow) {
      const { sources: found, block } = retrieveGrounding(realQuestion);
      if (block) {
        sources = found;
        blocks.push(block);
      }
    }
    let statuteCount = 0;
    if (statuteNow) {
      const { hits, block: statuteBlock } = retrieveStatuteGrounding(realQuestion);
      if (statuteBlock) {
        statuteCount = hits.length;
        blocks.push(statuteBlock);
      }
      // Fee/stamp-duty amounts go LAST so they sit closest to the question and
      // take precedence over the raw schedule text. Combines curated verified
      // amounts with the latest provincial Finance-Act amendment text (covers
      // every province / instrument, not just the curated ones).
      const financeAmends = latestFinanceFeeAmendments(feeProvinceOf(realQuestion));
      const stampBlock = stampDutyBlock(realQuestion, financeAmends);
      if (stampBlock) blocks.push(stampBlock);

      // Curated recent reforms not captured as Acts (e.g. Green Property
      // Certificate / Fard) — so the Advisor answers instead of "no info".
      const updatesBlock = legalUpdatesBlock(realQuestion);
      if (updatesBlock) blocks.push(updatesBlock);
    }
    const groundedPrompt = blocks.length
      ? `${prompt}\n\n${blocks.join("\n\n")}\n\n${finalLanguageRule}`
      : prompt;

    console.log(`[AI Advisor] Intent: ${intent}, Has Image: ${!!image}, Judgments: ${sources.length}, Statutes: ${statuteCount}`);

    // Build the model input (image + prompt, or grounded text prompt).
    let parts: string | Part[];
    if (image) {
      const base64Data = image.split(",")[1] || image;
      const mimeMatch = image.match(/data:([^;]+);/);
      const mimeType = mimeMatch ? mimeMatch[1] : "image/jpeg";
      parts = [
        { inlineData: { mimeType, data: base64Data } },
        { text: `${prompt}\n\nIMPORTANT: Analyze the uploaded image/document. Extract all relevant legal text, identify the document type, applicable law sections, and provide legal guidance. Keep response concise (under 300 words).\n\n${finalLanguageRule}` },
      ];
    } else {
      parts = groundedPrompt;
    }

    // Stream the answer back as newline-delimited JSON so the UI can render it
    // progressively (feels far faster than waiting for the whole reply).
    const encoder = new TextEncoder();
    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        const send = (obj: unknown) =>
          controller.enqueue(encoder.encode(JSON.stringify(obj) + "\n"));
        try {
          for await (const delta of geminiGenerateStream(parts)) {
            send({ type: "delta", text: delta });
          }
          // Attach the verified judgments at the END so they appear under the
          // finished answer, not as a lone block before any text arrives.
          send({ type: "done", intent, sources });
        } catch (error: unknown) {
          const m = error instanceof Error ? error.message : "";
          const friendly =
            m.includes("429") || m.includes("quota") || m.includes("exhausted")
              ? "AI quota exhausted. Please wait 1 minute and try again."
              : `AI response failed: ${m || "Unknown error"}`;
          send({ type: "error", error: friendly });
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "application/x-ndjson; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (error: unknown) {
    console.error("AI advisor error:", error);
    const msg = error instanceof Error ? error.message : "";

    if (msg.includes("429") || msg.includes("quota") || msg.includes("exhausted")) {
      return NextResponse.json(
        { error: "AI quota exhausted. Please wait 1 minute and try again." },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: `AI response failed: ${msg || "Unknown error"}` },
      { status: 500 }
    );
  }
}
