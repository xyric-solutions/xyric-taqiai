import { NextRequest, NextResponse } from "next/server";
import { geminiGenerate } from "@/lib/gemini-helper";
import { getCurrentUser } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { getSafeAiError } from "@/lib/ai-error";
import { formatMonetaryAmountsInHtml } from "@/lib/pk-format";

export async function POST(request: NextRequest) {
  const session = await getCurrentUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!rateLimit(session.userId, 20, 60_000)) {
    return NextResponse.json({ error: "Too many requests. Please wait a minute and try again." }, { status: 429 });
  }

  try {
    const { currentContent, editInstruction, language } = await request.json();

    if (!currentContent || !editInstruction) {
      return NextResponse.json(
        { error: "Current content and edit instruction are required" },
        { status: 400 }
      );
    }

    const prompt = `You are a Pakistani legal document editor. You are given an existing legal document and editing instructions. Apply the changes and return the updated document.

LANGUAGE: ${language === "ur" ? "Urdu" : "English"}

CURRENT DOCUMENT:
${currentContent}

EDIT INSTRUCTION FROM USER:
${editInstruction}

INSTRUCTIONS:
1. Apply the user's requested changes to the document
2. Keep the document structure and formatting intact (HTML tags)
3. Only modify what the user asked to change
4. Maintain legal language and formal tone
5. Keep all other parts of the document exactly as they were
6. If user asks to add something, add it in the appropriate place
7. If user asks to remove something, remove it cleanly
8. If user asks to change wording, replace only that part
9. Preserve all proper nouns (names, CNIC numbers, addresses, dates)
10. Format every monetary amount with Pakistani comma grouping and words, for example Rs. 1,00,000/- (Rupees One Lac Only) and Rs. 5,00,00,000/- (Rupees Five Crore Only). Never use million, billion, or trillion.

Return ONLY the complete updated document as clean HTML (no markdown, no code fences, no explanations before or after). Just the HTML content.`;

    const updatedHtml = await geminiGenerate(prompt);

    // Clean up markdown fences + extract body if full HTML doc was returned
    let cleaned = updatedHtml.trim();
    cleaned = cleaned.replace(/^```(?:html|HTML)?\s*\n?/i, "");
    cleaned = cleaned.replace(/\n?```\s*$/i, "");
    cleaned = cleaned.trim();

    const bodyMatch = cleaned.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    if (bodyMatch) {
      cleaned = bodyMatch[1].trim();
    } else {
      cleaned = cleaned.replace(/<!DOCTYPE[^>]*>/gi, "");
      cleaned = cleaned.replace(/<\/?html[^>]*>/gi, "");
      cleaned = cleaned.replace(/<head[\s\S]*?<\/head>/gi, "");
      cleaned = cleaned.trim();
    }

    cleaned = formatMonetaryAmountsInHtml(cleaned);
    return NextResponse.json({ html: cleaned });
  } catch (error: unknown) {
    console.error("Edit document error:", error);
    const friendly = getSafeAiError(
      error,
      "Edit failed. Please try again.",
      "AI quota khatam. Thori der baad try karein."
    );
    return NextResponse.json(
      { error: friendly.error },
      { status: friendly.status }
    );
  }
}
