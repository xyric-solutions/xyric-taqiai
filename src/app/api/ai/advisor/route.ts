import { NextRequest, NextResponse } from "next/server";
import { buildAIPrompt, buildLanguageRule } from "@/lib/intent-handlers";
import { detectIntent } from "@/lib/intent-detection";
import { geminiGenerateStream } from "@/lib/gemini-helper";
import { Part } from "@google/generative-ai";
import { getCurrentUser } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { retrieveGrounding, type GroundingSource } from "@/lib/judgment-retrieval";
import { verifiedAuthorityGrounding } from "@/lib/verified-legal-authorities";
import { retrieveStatuteGrounding } from "@/lib/statute-retrieval";
import { stampDutyBlock, feeProvinceOf } from "@/lib/stamp-duty-reference";
import { latestFinanceFeeAmendments } from "@/lib/statute-db-runtime";
import { legalUpdatesBlock } from "@/lib/legal-updates-reference";
import { getSafeAiError } from "@/lib/ai-error";
import { getPlatformRecommendation, isTaqiNavigationQuery } from "@/lib/taqi-platform-knowledge";
import {
  decideJudgmentRetrieval,
  LEGAL_RELIABILITY_RULES,
  type JudgmentRetrievalDecision,
} from "@/lib/advisor-reliability";

export const dynamic = "force-dynamic";

const GROUNDING_BUDGET_MS = 2_500;
const MAX_MESSAGE_CHARS = 12_000;
const MAX_IMAGE_DATA_URL_CHARS = 14_000_000;
const SUPPORTED_IMAGE_DATA_URL = /^data:image\/(?:jpeg|png|webp|gif);base64,/i;

async function withinLatencyBudget<T>(
  work: Promise<T>,
  fallback: T,
  label: string,
): Promise<T> {
  return new Promise<T>((resolve) => {
    let settled = false;
    const finish = (value: T) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve(value);
    };
    const timer = setTimeout(() => {
      console.warn(`[AI Advisor] ${label} exceeded ${GROUNDING_BUDGET_MS}ms; continuing without it.`);
      finish(fallback);
    }, GROUNDING_BUDGET_MS);
    work.then(finish, () => finish(fallback));
  });
}

/** The advisor message arrives with a system/intent prologue; pull out the real question. */
function userQuestionFrom(message: string): string {
  const marker = "USER QUESTION:";
  const idx = message.lastIndexOf(marker);
  return idx !== -1 ? message.slice(idx + marker.length).trim() : message;
}

function compactHistory(history: unknown): { role: string; content: string }[] {
  if (!Array.isArray(history)) return [];

  return history
    .slice(-16)
    .filter((msg): msg is { role: string; content: string } =>
      (msg?.role === "user" || msg?.role === "assistant") && typeof msg?.content === "string"
    )
    .slice(-8)
    .map((msg) => ({
      role: msg.role,
      content: msg.content.slice(0, 1200),
    }));
}

function isProvisionExplanationQuery(q: string): boolean {
  return (
    /\b(?:section|sections|sec\.?|article|dafa)\s*\d{1,4}(?:\s*[-/]?\s*[A-Z])?\b/i.test(q) ||
    /\b\d{2,4}\s*[-/]?\s*[A-Z]\s*(?:PPC|Cr\.?P\.?C\.?|C\.?P\.?C\.?|CrPC|CPC|QSO)?\b/i.test(q) ||
    /\b(?:what is|explain|meaning of|ingredients of|punishment under|scope of)\s+(?:section\s*)?\d{2,4}\b/i.test(q)
  );
}

function judgmentAnswerRequirements(
  decision: JudgmentRetrievalDecision,
  sourceCount: number,
): string {
  if (!decision.shouldRetrieve) {
    return `JUDGMENT POLICY: This is a general informational question. Answer it directly without adding judgments or case citations.`;
  }
  if (!sourceCount) {
    return `JUDGMENT POLICY: This query would benefit from precedent, but no sufficiently relevant verified judgment was retrieved. Answer from verified law and principle only, say that directly relevant case law should be checked, and never invent a citation.`;
  }
  return `JUDGMENT POLICY (mandatory for this ${decision.reason.replace(/-/g, " ")}):
- Include a short RELEVANT JUDGMENTS section after the legal analysis.
- Use only the 1-4 retrieved judgments that directly support the answer; omit marginal matches.
- For each judgment, give its case title or citation, the precise principle supported by the supplied excerpt, and one brief sentence connecting that principle to the user's issue.
- Do not provide a bare citation list, repeat the same proposition, or claim a holding that is absent from the supplied excerpt.`;
}

function provisionAnswerRequirements(q: string): string {
  if (!isProvisionExplanationQuery(q)) return "";
  return `PROVISION EXPLANATION REQUIREMENTS (mandatory):
- Give a substantive explanation, not a two-line definition.
- State the exact statutory subject and current punishment only from retrieved law.
- Explain the legal ingredients in plain language, including the prohibited act and any mental element supported by the retrieved text or authorities.
- Cover cognizability, bail, compounding, investigating authority, trial court, charge, and evidentiary safeguards only when the supplied sources establish them.
- Distinguish nearby provisions where confusion is likely.
- Summarize 2-4 directly relevant verified judgments when supplied, naming the case/citation and the precise proposition each supports.
- Separate the rule of law from fact-sensitive application. Never imply that an accusation itself proves the offence.`;
}

function wantsTaqiGuidance(q: string): boolean {
  return isTaqiNavigationQuery(q);
}

function prefersRomanUrdu(q: string): boolean {
  const markers = q.match(/\b(mera|meri|mujhe|muje|kaha|kahan|kidhar|karoo|karoon|karo|karna|mai|main|meny|mene|hai|kis|konsa|kaunsa|tayyar)\b/gi) || [];
  return new Set(markers.map((marker) => marker.toLowerCase())).size >= 2;
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
  const recommendation = getPlatformRecommendation(question);
  if (recommendation) return recommendation.answer;

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

export async function GET() {
  const session = await getCurrentUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ ready: true });
}

export async function POST(request: NextRequest) {
  const session = await getCurrentUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!rateLimit(session.userId, 20, 60_000)) {
    return NextResponse.json({ error: "Too many requests. Please wait a minute and try again." }, { status: 429 });
  }

  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const payload = body as Record<string, unknown>;
    if (payload.message != null && typeof payload.message !== "string") {
      return NextResponse.json({ error: "Message must be text" }, { status: 400 });
    }
    if (payload.image != null && typeof payload.image !== "string") {
      return NextResponse.json({ error: "Image must be a supported data URL" }, { status: 400 });
    }

    const message = typeof payload.message === "string" ? payload.message.trim() : "";
    const history = payload.history;
    const image = typeof payload.image === "string" ? payload.image : "";
    const source = payload.source === "legal-advisor" ? "legal-advisor" : undefined;

    if (!message && !image) {
      return NextResponse.json({ error: "Message or image is required" }, { status: 400 });
    }
    if (message.length > MAX_MESSAGE_CHARS) {
      return NextResponse.json(
        { error: `Question is too long. Please keep it under ${MAX_MESSAGE_CHARS.toLocaleString("en-PK")} characters.` },
        { status: 413 },
      );
    }
    if (image.length > MAX_IMAGE_DATA_URL_CHARS) {
      return NextResponse.json({ error: "Image is too large. Please upload an image under 10 MB." }, { status: 413 });
    }
    if (image && !SUPPORTED_IMAGE_DATA_URL.test(image.slice(0, 64))) {
      return NextResponse.json({ error: "Unsupported image format. Use JPG, PNG, WEBP, or GIF." }, { status: 400 });
    }

    const realQuestion = userQuestionFrom(message || "");
    const compacted = compactHistory(history);
    const intent = detectIntent(realQuestion);
    const finalLanguageRule = buildLanguageRule(realQuestion || message || "");
    const platformGuidance = source === "legal-advisor" && wantsTaqiGuidance(realQuestion);
    if (platformGuidance && !image) {
      return streamStaticAdvisorAnswer(
        buildTaqiGuidanceAnswer(realQuestion || "How should I use Taqi AI?"),
        intent,
      );
    }

    const prompt = buildAIPrompt(realQuestion || "Analyze this legal document", compacted);

    const verifiedAuthorities = verifiedAuthorityGrounding(realQuestion);
    const judgmentDecision = decideJudgmentRetrieval(realQuestion);
    // Retrieve precedent for explicit requests, statutory interpretation, and
    // fact-specific disputes. Definitions, navigation, and routine general
    // information intentionally remain judgment-free.
    const groundNow = !platformGuidance && !image && !!message
      && judgmentDecision.shouldRetrieve;
    // Statute grounding runs on EVERY text turn — the latest Act text should
    // ground the answer to the law itself (e.g. stamp paper), unlike judgments
    // which we only surface when actually wanted.
    const statuteNow = !platformGuidance && !image && !!message;

    const blocks: string[] = [];
    const emptyJudgments = { sources: [] as GroundingSource[], block: "" };
    const emptyStatutes = { hits: [], block: "" };
    const needsFinanceGrounding = statuteNow && !!stampDutyBlock(realQuestion, []);
    const [judgmentGrounding, statuteGrounding, financeAmends] = await Promise.all([
      groundNow && !verifiedAuthorities.exclusive
        ? withinLatencyBudget(
            retrieveGrounding(realQuestion, judgmentDecision.maxResults),
            emptyJudgments,
            "judgment grounding",
          )
        : Promise.resolve(emptyJudgments),
      statuteNow
        ? withinLatencyBudget(retrieveStatuteGrounding(realQuestion, 6), emptyStatutes, "statute grounding")
        : Promise.resolve(emptyStatutes),
      needsFinanceGrounding
        ? withinLatencyBudget(
            latestFinanceFeeAmendments(feeProvinceOf(realQuestion)),
            [],
            "finance amendment grounding",
          )
        : Promise.resolve([]),
    ]);

    const sources = [...verifiedAuthorities.sources, ...judgmentGrounding.sources]
      .filter((source, index, all) => all.findIndex((candidate) => candidate.id === source.id) === index);
    if (verifiedAuthorities.block) blocks.push(verifiedAuthorities.block);
    if (judgmentGrounding.block) blocks.push(judgmentGrounding.block);
    const statuteCount = statuteGrounding.hits.length;
    if (statuteGrounding.block) blocks.push(statuteGrounding.block);
    if (statuteNow) {
      // Fee/stamp-duty amounts go LAST so they sit closest to the question and
      // take precedence over the raw schedule text. Combines curated verified
      // amounts with the latest provincial Finance-Act amendment text (covers
      // every province / instrument, not just the curated ones).
      const stampBlock = stampDutyBlock(realQuestion, financeAmends);
      if (stampBlock) blocks.push(stampBlock);

      // Curated recent reforms not captured as Acts (e.g. Green Property
      // Certificate / Fard) — so the Advisor answers instead of "no info".
      const updatesBlock = legalUpdatesBlock(realQuestion);
      if (updatesBlock) blocks.push(updatesBlock);
    }
    const groundedPrompt = [
      prompt,
      provisionAnswerRequirements(realQuestion),
      blocks.join("\n\n"),
      judgmentAnswerRequirements(judgmentDecision, sources.length),
      LEGAL_RELIABILITY_RULES,
      finalLanguageRule,
    ].filter(Boolean).join("\n\n");

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
          send({ type: "status", message: "Preparing legal answer" });
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
