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
    const formData = await request.formData();
    const audio = formData.get("audio") as File;

    if (!audio) {
      return NextResponse.json({ error: "Audio required" }, { status: 400 });
    }

    const bytes = await audio.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");
    const mimeType = audio.type || "audio/webm";

    const prompt = `You are a professional transcriber. This is a voice recording of a legal discussion in Pakistan — usually a lawyer and a client talking about the client's legal matter (there may be one or more speakers).

TRANSCRIBE the audio completely from start to end. The speakers may use:
- English
- Urdu
- Roman Urdu (English letters, Urdu words)
- Mixed (Urdu + English)

If you can clearly tell that different people are speaking, you may start a new line for each turn — but do NOT guess or invent speaker names.

OUTPUT FORMAT:
Return ONLY the transcribed text in the original language spoken. If Urdu Roman, keep it Roman. If Urdu script, keep Urdu script. If English, keep English. Mixed is fine.

Do NOT translate. Do NOT summarize. Just transcribe what is said.`;

    const transcription = await geminiGenerate([
      { inlineData: { mimeType, data: base64 } },
      { text: prompt },
    ]);

    return NextResponse.json({ transcription });
  } catch (error: unknown) {
    console.error("Voice transcribe error:", error);
    const msg = error instanceof Error ? error.message : "";
    if (msg.includes("429") || msg.includes("quota") || msg.includes("exhausted")) {
      return NextResponse.json({ error: "AI quota exhausted. Thori der baad try karein." }, { status: 429 });
    }
    return NextResponse.json({ error: `Voice transcribe failed: ${msg}` }, { status: 500 });
  }
}
