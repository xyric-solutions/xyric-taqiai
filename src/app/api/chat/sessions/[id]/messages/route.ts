import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(req: Request, ctx: RouteContext) {
  const session = await getCurrentUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;
  const chatSession = await prisma.chatSession.findFirst({
    where: { id, userId: session.userId },
  });
  if (!chatSession) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  let body: { role?: string; content?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.role || !body.content) {
    return NextResponse.json(
      { error: "role and content are required" },
      { status: 400 }
    );
  }

  if (body.role !== "user" && body.role !== "assistant") {
    return NextResponse.json(
      { error: "role must be 'user' or 'assistant'" },
      { status: 400 }
    );
  }

  const [message] = await prisma.$transaction([
    prisma.chatMessage.create({
      data: {
        sessionId: id,
        role: body.role,
        content: body.content,
      },
    }),
    prisma.chatSession.update({
      where: { id },
      data: { updatedAt: new Date() },
    }),
  ]);

  return NextResponse.json({ message }, { status: 201 });
}
