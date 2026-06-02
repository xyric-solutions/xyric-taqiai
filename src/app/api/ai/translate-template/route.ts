import { NextRequest, NextResponse } from "next/server";
import { geminiGenerate } from "@/lib/gemini-helper";
import { getTranslationTemplate } from "@/templates/translations";
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
    const templateId = formData.get("templateId") as string;
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

    if (!templateId) {
      return NextResponse.json({ error: "Template ID required" }, { status: 400 });
    }

    const template = getTranslationTemplate(templateId);
    if (!template) {
      return NextResponse.json({ error: `Template '${templateId}' not found` }, { status: 404 });
    }

    if (!text && !image) {
      return NextResponse.json({ error: "Text or image is required" }, { status: 400 });
    }

    let extractedJson: string;

    if (image) {
      const imageBytes = await image.arrayBuffer();
      const base64 = Buffer.from(imageBytes).toString("base64");
      const mimeType = image.type || "image/jpeg";

      extractedJson = await geminiGenerate([
        { inlineData: { mimeType, data: base64 } },
        { text: template.extractionPrompt },
      ]);
    } else {
      const prompt = `${template.extractionPrompt}

---DOCUMENT TEXT---
${text}`;

      extractedJson = await geminiGenerate(prompt);
    }

    // Parse the extracted JSON
    let fields: Record<string, string> = {};
    try {
      // Strip markdown code fences if present
      const clean = extractedJson
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/```\s*$/i, "")
        .trim();
      fields = JSON.parse(clean);
    } catch {
      // If JSON parse fails, return the raw extraction
      return NextResponse.json({
        html: null,
        rawExtraction: extractedJson,
        error: "Could not parse extracted fields as JSON. Raw extraction returned.",
      });
    }

    // Build the final HTML using the template
    const html = template.buildHtml(fields);

    return NextResponse.json({ html, fields });
  } catch (error: unknown) {
    console.error("Template translation error:", error);
    const msg = error instanceof Error ? error.message : "";

    if (msg.includes("429") || msg.includes("quota") || msg.includes("exhausted")) {
      return NextResponse.json(
        { error: "AI quota exhausted. Please wait 1 minute and try again." },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: `Translation failed: ${msg || "Unknown error"}` },
      { status: 500 }
    );
  }
}
