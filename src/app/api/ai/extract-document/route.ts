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
    const formData = await request.formData();
    const image = formData.get("image") as File;
    const language = (formData.get("language") as string) || "en";

    if (!image) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }

    if (image.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "Image must be under 10MB" }, { status: 400 });
    }
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(image.type)) {
      return NextResponse.json({ error: "Only image files are supported (JPG, PNG, WebP)" }, { status: 400 });
    }

    const imageBytes = await image.arrayBuffer();
    const base64 = Buffer.from(imageBytes).toString("base64");
    const mimeType = image.type || "image/jpeg";

    // Step 1: Extract raw text line by line — strictly what is visible
    const step1Prompt = `Look at this handwritten document image very carefully.

Your task: Go through the image LINE BY LINE from top to bottom. For each line, read each word carefully and write EXACTLY what you see written.

STRICT RULES:
- Write ONLY words that are clearly visible in the image
- If a word is hard to read, write your best attempt followed by [?]
- If a word is completely unreadable, write [UNCLEAR]
- If a full line is unreadable, write [UNCLEAR LINE]
- Do NOT add any word that is not physically written in the image
- Do NOT guess based on context or what "sounds right"
- Do NOT use your legal knowledge to fill in gaps
- Names, numbers, CNIC, dates: copy exactly character by character

Output format: plain text, one line per line. No formatting, no HTML. Just the raw transcription.`;

    const rawText = await geminiGenerate([
      { inlineData: { mimeType, data: base64 } },
      { text: step1Prompt },
    ]);

    // Step 2: Format the raw transcription into clean HTML
    const isUrdu = language === "ur";
    const step2Prompt = `Below is a raw transcription of a handwritten ${isUrdu ? "Urdu" : "English"} document. Convert it into clean formatted HTML.

RAW TRANSCRIPTION:
${rawText}

RULES:
- Do NOT change, add, or remove any word — use ONLY the text provided above
- Keep [UNCLEAR] and [?] markers exactly where they are
- ${isUrdu ? 'Use <p dir="rtl"> for paragraphs and <h2 dir="rtl"> for headings — Urdu is right-to-left' : "Use <p> for paragraphs and <h2> for headings"}
- Group lines into logical paragraphs based on the content
- If there is a heading/title at the top, wrap it in <h2>
- Do NOT add <html>, <head>, or <body> tags
- Return ONLY the HTML, no explanation`;

    const html = await geminiGenerate([{ text: step2Prompt }]);

    // Strip any accidental markdown code fences
    const cleanHtml = html.replace(/^```html?\n?/i, "").replace(/\n?```$/i, "").trim();

    return NextResponse.json({ html: cleanHtml, rawText });
  } catch (error: unknown) {
    console.error("Document extraction error:", error);
    const friendly = getSafeAiError(
      error,
      "Document extract nahi ho saka. Please try again.",
      "AI quota exhausted. Thori der baad try karein."
    );
    return NextResponse.json({ error: friendly.error }, { status: friendly.status });
  }
}
