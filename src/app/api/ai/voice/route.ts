import { NextRequest, NextResponse } from "next/server";
import { geminiGenerate } from "@/lib/gemini-helper";
import { getCurrentUser } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const session = await getCurrentUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!rateLimit(session.userId, 20, 60_000)) {
    return NextResponse.json({ error: "Too many requests. Please wait a minute and try again." }, { status: 429 });
  }

  try {
    const { audio } = await request.json();

    if (!audio) {
      return NextResponse.json({ error: "Audio data required" }, { status: 400 });
    }

    const prompt = `You are a professional transcriber. This is a voice recording from a person in Pakistan discussing a legal matter.

TRANSCRIBE the audio completely. The speaker may use:
- English
- Urdu
- Roman Urdu (English letters, Urdu words)
- Mixed (Urdu + English)

OUTPUT FORMAT:
Return ONLY the transcribed text. Do NOT translate. Do NOT summarize. Just transcribe word by word.`;

    const text = await geminiGenerate([
      { inlineData: { mimeType: "audio/webm", data: audio } },
      { text: prompt },
    ]);

    return NextResponse.json({ text: text.trim() });
  } catch (error: unknown) {
    console.error("Voice error:", error);
    const msg = error instanceof Error ? error.message : "";
    if (msg.includes("429") || msg.includes("quota")) {
      return NextResponse.json({ error: "AI quota exhausted. Try again later." }, { status: 429 });
    }
    return NextResponse.json({ error: `Voice failed: ${msg}` }, { status: 500 });
  }
}
