import { NextRequest, NextResponse } from "next/server";
import { geminiGenerate } from "@/lib/gemini-helper";
import { getCurrentUser } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { getSafeAiError } from "@/lib/ai-error";

export async function POST(request: NextRequest) {
  const session = await getCurrentUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!rateLimit(session.userId, 20, 60_000)) {
    return NextResponse.json({ error: "Too many requests. Please wait a minute and try again." }, { status: 429 });
  }

  try {
    const { audio, mimeType } = await request.json();

    if (!audio) {
      return NextResponse.json({ error: "Audio data required" }, { status: 400 });
    }

    // Strip any codec suffix (e.g. "audio/webm;codecs=opus") — Gemini expects a
    // bare container type. Fall back to webm for older clients that omit it.
    const audioMime = (typeof mimeType === "string" && mimeType ? mimeType : "audio/webm").split(";")[0].trim();

    const prompt = `You are a professional transcriber. This is a voice recording from a person in Pakistan discussing a legal matter. The speaker may use English, Urdu, Roman Urdu, or a mix.

TRANSCRIBE the audio completely, word for word.

SCRIPT RULE (VERY IMPORTANT — always follow):
- Write EVERY SINGLE WORD using the English (Latin / a-z) alphabet only.
- ABSOLUTELY NO non-Latin scripts — no Urdu/Arabic script (دائر), no Hindi/Devanagari script (दायर), no other alphabet. Not even for a single word.
- Any Urdu speech MUST be written as ROMAN URDU — Urdu words spelled with English letters (e.g. "dayar", "qabza", "adalat"), NOT in Urdu or Hindi script.
- English words stay in English. For mixed speech, keep English words in English and write the Urdu words in Roman Urdu.
- Example: for the Urdu sentence meaning "he filed a case in court", write "usne court mein ek case dayar kiya" — NOT "usne court mein ek case दायर kiya" and NOT "دائر".

Do NOT translate Urdu into English. Do NOT summarize. Just transcribe what is said, in Roman Urdu + English (Latin letters) only.`;

    const text = await geminiGenerate([
      { inlineData: { mimeType: audioMime, data: audio } },
      { text: prompt },
    ]);

    return NextResponse.json({ text: text.trim() });
  } catch (error: unknown) {
    console.error("Voice error:", error);
    const friendly = getSafeAiError(
      error,
      "Voice processing failed. Please try again.",
      "AI quota exhausted. Try again later."
    );
    return NextResponse.json({ error: friendly.error }, { status: friendly.status });
  }
}
