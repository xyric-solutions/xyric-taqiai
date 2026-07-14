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
import { latestFinanceFeeAmendments } from "@/lib/statute-db-runtime";
import { legalUpdatesBlock } from "@/lib/legal-updates-reference";
import { getSafeAiError } from "@/lib/ai-error";

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

function wantsTaqiGuidance(q: string): boolean {
  const text = q.toLowerCase();
  const asksHowOrWhere =
    /\b(how|how can|how do|where|which|option|options|what feature|what module|kaise|kese|kahan|kaha|kidhar|konsa|kaunsa|tareeqa|tarika)\b/i.test(text);
  const explicitlyDraftHere =
    !asksHowOrWhere &&
    (/\b(draft|write|type|prepare|generate|create)\b.*\b(for me|here|now|complete|full|the document|the petition|the application)\b/i.test(text) ||
      /\b(please\s+)?(draft|write|type|generate)\b/i.test(text) ||
      /\b(likh\s+do|bana\s+do|draft\s+kar\s+do|type\s+kar\s+do|tayyar\s+kar\s+do)\b/i.test(text));
  if (explicitlyDraftHere) return false;

  const explicitPlatform =
    /\b(taqi|taqi ai|platform|app|module|feature|tool|dashboard|case builder|legal advisor|ai advisor|templates?|document drafting|voice case|copy from photo|case law|judgments?|statute search|lawyer diary|my documents|translate|tax calculator)\b/i.test(text);
  const asksNavigation =
    /\b(how|where|which|what feature|what module|when should|should i use|use|open|go to|start|search|type|typing|best feature|best module|guide|steps?|kaise|kahan|kaha|kidhar|konsa|kaunsa|konse|kis|kis jagah|istamal|istemal|tareeqa|tarika)\b/i.test(text);
  const asksWhereToWork =
    /\b(where|where should|where can|kahan|kaha|kidhar|kis jagah|which module|which feature|kaun(?:sa|si|se)|kon(?:sa|si|se)|konsa|kaunsa)\b/i.test(text) &&
    /\b(type|typing|draft|prepare|search|make|create|draft\s+kar|type\s+kar|search\s+kar|tayyar)\b/i.test(text);
  const asksHowToDraft =
    asksHowOrWhere &&
    /\b(draft|prepare|type|typing|create|make|generate|case|document|petition|application|draft\s+kar|draft\s+karna|type\s+kar|type\s+karna|tayyar|tayyar\s+karna)\b/i.test(text);
  const asksToStartDraftingWorkflow =
    /\b(i want|i need|need to|want to|mujhe|muje|mera|meri|main|ma|mai)\b/i.test(text) &&
    /\b(draft|prepare|type|typing|create|make|generate|case|document|petition|application|draft\s+karna|type\s+karna|tayyar\s+karna)\b/i.test(text);
  const taskChoice =
    /\b(i want to prepare this case|prepare this case|where can i draft this case|where should i type this case|where should i prepare this case|which module .*legal task|which feature .*legal task|best module .*legal task|how do i use case builder)\b/i.test(text);
  return taskChoice || asksWhereToWork || asksHowToDraft || asksToStartDraftingWorkflow || (explicitPlatform && asksNavigation);
}

function prefersRomanUrdu(q: string): boolean {
  return /\b(mera|meri|kaha|kahan|kidhar|karoo|karo|karna|ma|mai|main|meny|mene|ha|hai|ka|ki|kis|konsa|kaunsa|tayyar)\b/i.test(q);
}

function documentCategory(question: string): { category: string; route: string; templateHint: string } {
  const text = question.toLowerCase();
  if (/\b(302|324|506|489\s*[-/]?\s*f|ppc|crpc|criminal|fir|bail|murder|qatl|zamanat|cheque|accused|mulzim)\b/i.test(text)) {
    return {
      category: "Criminal Law",
      route: "All Document Types -> Criminal Law",
      templateHint: /\b302|murder|qatl\b/i.test(text)
        ? "select the relevant Section 302 / murder case document or criminal petition template"
        : "select the relevant criminal document template",
    };
  }
  if (/\b(divorce|khula|talaq|family|maintenance|custody|nikah|mehr|wife|husband|biwi|shohar|bachay)\b/i.test(text)) {
    return {
      category: "Family Law",
      route: "All Document Types -> Family Law",
      templateHint: /\b(divorce|khula|talaq)\b/i.test(text)
        ? "select the appropriate divorce / khula document template"
        : "select the matching family-law template",
    };
  }
  if (/\b(property|possession|injunction|declaration|land|plot|qabza|zameen|registry|fard)\b/i.test(text)) {
    return {
      category: "Property Law",
      route: "All Document Types -> Property Law",
      templateHint: "select the matching property, possession, declaration, or injunction template",
    };
  }
  if (/\b(civil|recovery|suit|contract|agreement|damages|specific performance|stay)\b/i.test(text)) {
    return {
      category: "Civil Law",
      route: "All Document Types -> Civil Law",
      templateHint: "select the matching civil suit, recovery, notice, or injunction template",
    };
  }
  if (/\b(writ|article\s*199|constitutional|high court)\b/i.test(text)) {
    return {
      category: "Constitutional Law",
      route: "All Document Types -> Constitutional Law",
      templateHint: "select the writ petition or constitutional petition template",
    };
  }
  return {
    category: "the relevant category",
    route: "All Document Types",
    templateHint: "select the template that matches your document",
  };
}

function isDraftingWorkflowQuestion(question: string): boolean {
  const text = question.toLowerCase();
  return /\b(draft|prepare|type|typing|create|make|generate|case|document|petition|application|draft\s+kar|type\s+kar|tayyar)\b/i.test(text);
}

function recommendedFeature(question: string): { feature: string; steps: string[]; reason: string } {
  const text = question.toLowerCase();
  if (/\b(judg?ements?|judgments?|case law|precedent|citation|nazair|faisla|faislay|authority)\b/i.test(text)) {
    return {
      feature: "Judgments / Case Law",
      reason: "Best when you only want to search authorities or precedent.",
      steps: [
        "Open Judgments / Case Law from the sidebar.",
        "Search by section, citation, party name, court, or keyword.",
        "Open the relevant judgments and then use Case Builder if you also need a draft.",
      ],
    };
  }

  if (/\b(statute|act|ordinance|rules?|section meaning|bare law|section text|law text)\b/i.test(text)) {
    return {
      feature: "Statute Search",
      reason: "Best when you need the legal provision or section text.",
      steps: [
        "Open Statute Search.",
        "Search the Act name or section number.",
        "Use the section text as reference before drafting in Case Builder or Templates.",
      ],
    };
  }

  if (/\b(photo|image|scan|scanned|picture|tasveer)\b/i.test(text)) {
    return {
      feature: "Copy from Photo",
      reason: "Best when your starting point is a photo or scanned document.",
      steps: [
        "Open Copy from Photo.",
        "Upload the document image.",
        "Review extracted text, then send it to drafting if needed.",
      ],
    };
  }

  if (/\b(voice|audio|record|recording|client meeting|discussion)\b/i.test(text)) {
    return {
      feature: "Voice Case",
      reason: "Best when your starting point is a recorded client discussion.",
      steps: [
        "Open Voice Case.",
        "Record or upload the audio.",
        "Review the transcript and case analysis, then use it for drafting.",
      ],
    };
  }

  if (/\b(affidavit|agreement|deed|power of attorney|poa|notice|template|rent|sale deed|undertaking|noc)\b/i.test(text)) {
    const doc = documentCategory(question);
    return {
      feature: "All Document Types",
      reason: "Best when you already know the exact document type and do not need judgment research first.",
      steps: [
        `Open ${doc.route}.`,
        `Choose ${doc.templateHint}.`,
        "Fill the required fields and generate the draft.",
      ],
    };
  }

  if (/\b(advice|advise|legal opinion|what should i do|which law applies|procedure|rahnamai|mashwara)\b/i.test(text)) {
    return {
      feature: "AI Advisor",
      reason: "Best for legal guidance, procedure, and choosing the next step.",
      steps: [
        "Stay in AI Advisor for the legal question.",
        "Ask the specific issue, facts, and jurisdiction.",
        "If you later need a draft, move to Case Builder or Templates.",
      ],
    };
  }

  return {
    feature: "Case Builder",
    reason: "Best when you have a case section or case type and want judgment-guided case preparation and drafting.",
    steps: [
      "Open Case Builder from the sidebar.",
      "Enter the relevant law section or case type, such as 506 PPC.",
      "Confirm the matter and answer the Case Details questions.",
      "Add Client Information and court details.",
      "Run Judgment Research, then generate the draft.",
    ],
  };
}

function buildDraftingWorkflowAnswer(question: string): string {
  const doc = documentCategory(question);
  if (prefersRomanUrdu(question)) {
    return [
      "Aap ke paas 2 options hain:",
      "",
      "1. Case Builder - Recommended agar aap chahte hain AI step by step case-specific questions pooch kar complete draft banaye.",
      `2. All Documents - Sidebar me ${doc.route} open karein aur ${doc.templateHint}.`,
      "",
      `Best option: Case Builder use karein agar ${doc.category} case ki facts abhi collect karni hain ya judgment-guided drafting chahiye. Agar document type already clear hai, All Documents se direct template select kar lein.`,
      "",
      "AI Legal Advisor yahan document khud draft nahi karega jab tak aap specifically na kahein ke yahin complete draft likh do.",
    ].join("\n");
  }

  return [
    "You have two options:",
    "",
    "1. Case Builder - Recommended if you want the AI to guide you step by step by asking case-specific questions and then generate the complete draft.",
    `2. All Documents - Go to ${doc.route} and ${doc.templateHint}.`,
    "",
    `Best option: use Case Builder if you want guided ${doc.category} case preparation with facts, client information, judgment research, and draft generation. Use All Documents if you already know the exact template and want to draft it directly.`,
    "",
    "AI Legal Advisor will guide you to the correct feature first. It will not start drafting unless you explicitly ask it to draft the document here.",
  ].join("\n");
}

function buildTaqiGuidanceAnswer(question: string): string {
  if (isDraftingWorkflowQuestion(question)) {
    return buildDraftingWorkflowAnswer(question);
  }

  const route = recommendedFeature(question);
  if (prefersRomanUrdu(question)) {
    return [
      `Aap is kaam ke liye ${route.feature} module use karein. ${route.reason}`,
      "",
      ...route.steps.map((step, i) => `${i + 1}. ${step}`),
      "",
      "AI Advisor yahan case khud draft/type nahi karega jab aap sirf pooch rahe hon ke Taqi AI me kahan prepare karna hai. Drafting ke liye recommended module open karein.",
    ].join("\n");
  }

  return [
    `Use ${route.feature} for this. ${route.reason}`,
    "",
    ...route.steps.map((step, i) => `${i + 1}. ${step}`),
    "",
    "AI Advisor will guide you to the right Taqi AI feature for this kind of question; it will not start drafting unless you explicitly ask it to draft here.",
  ].join("\n");
}

function streamStaticAdvisorAnswer(text: string, intent: string, sources: GroundingSource[] = []): Response {
  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(encoder.encode(JSON.stringify({ type: "delta", text }) + "\n"));
      controller.enqueue(encoder.encode(JSON.stringify({ type: "done", intent, sources }) + "\n"));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "X-Accel-Buffering": "no",
    },
  });
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
    const finalLanguageRule = buildLanguageRule(realQuestion || message || "");
    const platformGuidance = wantsTaqiGuidance(realQuestion);
    if (platformGuidance && !image) {
      return streamStaticAdvisorAnswer(
        buildTaqiGuidanceAnswer(realQuestion || "How should I use Taqi AI?"),
        intent,
      );
    }

    const prompt = buildAIPrompt(message || "Analyze this legal document", compacted);

    // Only surface judgments when they're actually wanted — a fresh (first)
    // question, or whenever the user explicitly asks for case-law/precedent.
    // Plain conversational follow-ups stay clean (no judgment dump every turn).
    const isFollowUp = compacted.length > 0;
    const groundNow = !platformGuidance && !image && !!message && (!isFollowUp || wantsCaseLaw(realQuestion));
    // Statute grounding runs on EVERY text turn — the latest Act text should
    // ground the answer to the law itself (e.g. stamp paper), unlike judgments
    // which we only surface when actually wanted.
    const statuteNow = !platformGuidance && !image && !!message;

    let sources: GroundingSource[] = [];
    const blocks: string[] = [];
    if (groundNow) {
      const { sources: found, block } = await retrieveGrounding(realQuestion);
      if (block) {
        sources = found;
        blocks.push(block);
      }
    }
    let statuteCount = 0;
    if (statuteNow) {
      const { hits, block: statuteBlock } = await retrieveStatuteGrounding(realQuestion);
      if (statuteBlock) {
        statuteCount = hits.length;
        blocks.push(statuteBlock);
      }
      // Fee/stamp-duty amounts go LAST so they sit closest to the question and
      // take precedence over the raw schedule text. Combines curated verified
      // amounts with the latest provincial Finance-Act amendment text (covers
      // every province / instrument, not just the curated ones).
      const financeAmends = await latestFinanceFeeAmendments(feeProvinceOf(realQuestion));
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
          const friendly = getSafeAiError(
            error,
            "AI response failed. Please try again.",
            "AI quota exhausted. Please wait 1 minute and try again."
          );
          send({ type: "error", error: friendly.error });
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
    const friendly = getSafeAiError(
      error,
      "AI response failed. Please try again.",
      "AI quota exhausted. Please wait 1 minute and try again."
    );

    return NextResponse.json(
      { error: friendly.error },
      { status: friendly.status }
    );
  }
}
