import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { geminiGenerate } from "@/lib/gemini-helper";

type RouteContext = { params: Promise<{ id: string }> };

/**
 * Generate a short, ChatGPT-style title for a chat from its first question
 * and save it. Falls back to a trimmed slice of the message if the model call
 * fails, so a chat never stays "New chat" once it has content.
 */
export async function POST(req: Request, ctx: RouteContext) {
  const session = await getCurrentUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;
  const existing = await prisma.chatSession.findFirst({
    where: { id, userId: session.userId },
  });
  if (!existing) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  let body: { message?: string };
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const message = (body.message || "").slice(0, 500).trim();
  if (!message) {
    return NextResponse.json({ error: "Message required" }, { status: 400 });
  }

  // Sensible fallback: first few words of the question.
  let title = message.split(/\s+/).slice(0, 6).join(" ").slice(0, 60);

  try {
    const raw = await geminiGenerate(
      "Create a very short title (3 to 5 words, Title Case) that summarizes this " +
        "legal question for a chat history list. Keep it in the same language as the " +
        "question. Reply with ONLY the title — no quotes, no punctuation at the end, " +
        "no 'Title:' prefix.\n\n" +
        `Question: ${message}\n\nTitle:`
    );
    const cleaned = raw
      .replace(/["'\n]/g, " ")
      .replace(/^\s*title\s*:\s*/i, "")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/[.:;,-]+$/, "");
    if (cleaned) {
      title = cleaned.split(/\s+/).slice(0, 7).join(" ").slice(0, 60);
    }
  } catch {
    // keep the fallback title
  }

  const updated = await prisma.chatSession.update({
    where: { id },
    data: { title },
  });

  return NextResponse.json({ title: updated.title });
}
