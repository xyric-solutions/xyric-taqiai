import { NextRequest, NextResponse } from "next/server";
import { buildAIPrompt } from "@/lib/intent-handlers";
import { detectIntent } from "@/lib/intent-detection";
import { geminiGenerate } from "@/lib/gemini-helper";
import { Part } from "@google/generative-ai";
import { getCurrentUser } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";

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

    const intent = detectIntent(message || "");
    const prompt = buildAIPrompt(message || "Analyze this legal document", history || []);

    console.log(`[AI Advisor] Intent: ${intent}, Has Image: ${!!image}`);

    let response: string;

    if (image) {
      // Image analysis with Gemini vision
      const base64Data = image.split(",")[1] || image;
      const mimeMatch = image.match(/data:([^;]+);/);
      const mimeType = mimeMatch ? mimeMatch[1] : "image/jpeg";

      const parts: Part[] = [
        { inlineData: { mimeType, data: base64Data } },
        { text: `${prompt}\n\nIMPORTANT: Analyze the uploaded image/document. Extract all relevant legal text, identify the document type, applicable law sections, and provide legal guidance. Keep response concise (under 300 words).` },
      ];

      response = await geminiGenerate(parts);
    } else {
      response = await geminiGenerate(prompt);
    }

    return NextResponse.json({ response, intent });
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
