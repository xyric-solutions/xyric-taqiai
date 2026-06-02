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
    const { html, instruction } = await request.json();

    if (!html || !instruction) {
      return NextResponse.json({ error: "html and instruction are required" }, { status: 400 });
    }

    const prompt = `You are editing a legal HTML document. Apply ONLY the user's instruction to the document.

USER INSTRUCTION: "${instruction}"

RULES:
- Keep all HTML structure, tables, styles, and formatting exactly as-is
- Only change the specific text/values the user asked to change
- Do NOT add new rows, columns, or sections unless explicitly asked
- Do NOT change field labels — only change the values/content inside <td>, <strong>, or text nodes
- Return ONLY the complete modified HTML, no explanations, no markdown fences

CURRENT HTML DOCUMENT:
${html}`;

    const updated = await geminiGenerate(prompt);

    // Strip any accidental markdown fences
    const clean = updated
      .replace(/^```html\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();

    return NextResponse.json({ html: clean });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "";
    if (msg.includes("429") || msg.includes("quota") || msg.includes("exhausted")) {
      return NextResponse.json(
        { error: "AI quota khatam. 1 minute ruk ke try karein." },
        { status: 429 }
      );
    }
    return NextResponse.json({ error: `Edit failed: ${msg || "Unknown error"}` }, { status: 500 });
  }
}
