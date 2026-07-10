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
    const sourceLang = formData.get("sourceLang") as string;
    const targetLang = formData.get("targetLang") as string;
    const text = formData.get("text") as string | null;
    const image = formData.get("image") as File | null;

    if (image) {
      if (image.size > 10 * 1024 * 1024) {
        return NextResponse.json({ error: "Image must be under 10MB" }, { status: 400 });
      }
      const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
      if (!allowedTypes.includes(image.type)) {
        return NextResponse.json({ error: "Only image files are supported (JPG, PNG, WebP)" }, { status: 400 });
      }
    }

    if (!sourceLang || !targetLang) {
      return NextResponse.json({ error: "Source and target language required" }, { status: 400 });
    }

    if (!text && !image) {
      return NextResponse.json({ error: "Text or image is required" }, { status: 400 });
    }

    const langNames: Record<string, string> = { ur: "Urdu", en: "English", ar: "Arabic" };
    const srcName = langNames[sourceLang] || sourceLang;
    const tgtName = langNames[targetLang] || targetLang;

    let response: string;

    if (image) {
      const imageBytes = await image.arrayBuffer();
      const base64 = Buffer.from(imageBytes).toString("base64");
      const mimeType = image.type || "image/jpeg";

      const prompt = `You are an expert legal document translator specializing in Pakistani law.

TASK: Extract ALL text from this image and translate it from ${srcName} to ${tgtName}.

INSTRUCTIONS:
1. First, carefully read and extract ALL text visible in the image
2. Then provide a professional legal translation to ${tgtName}
3. Maintain the exact same structure, formatting, and paragraph numbering
4. Keep legal terminology accurate and professional
5. Preserve names, CNIC numbers, dates, addresses, and case numbers as-is
6. If the document has stamps, seals text, or headers - translate those too

OUTPUT FORMAT:
---EXTRACTED TEXT---
[Show the original text extracted from image]

---TRANSLATION (${tgtName})---
[Show the complete translated text]

${targetLang === "ar" ? "For Arabic: use Modern Standard Arabic." : ""}
${targetLang === "ur" ? "For Urdu: use formal legal Urdu." : ""}
${targetLang === "en" ? "For English: use formal legal English." : ""}`;

      response = await geminiGenerate([
        { inlineData: { mimeType, data: base64 } },
        { text: prompt },
      ]);
    } else {
      const prompt = `You are an expert legal document translator specializing in Pakistani law.

TASK: Translate the following legal text from ${srcName} to ${tgtName}.

INSTRUCTIONS:
1. Provide a professional, accurate legal translation
2. Maintain the exact same structure, formatting, and paragraph numbering
3. Keep legal terminology accurate and professional
4. Preserve names, CNIC numbers, dates, addresses, and case numbers as-is
5. Maintain formal legal register and tone
6. If there are legal section references (like Section 420 PPC), keep them in original form

${targetLang === "ar" ? "Use Modern Standard Arabic." : ""}
${targetLang === "ur" ? "Use formal legal Urdu." : ""}
${targetLang === "en" ? "Use formal legal English." : ""}

---ORIGINAL TEXT (${srcName})---
${text}

---TRANSLATION (${tgtName})---`;

      response = await geminiGenerate(prompt);
    }

    return NextResponse.json({ translation: response });
  } catch (error: unknown) {
    console.error("Translation error:", error);
    const friendly = getSafeAiError(
      error,
      "Translation failed. Please try again.",
      "AI quota exhausted. Please wait 1 minute and try again."
    );

    return NextResponse.json(
      { error: friendly.error },
      { status: friendly.status }
    );
  }
}
