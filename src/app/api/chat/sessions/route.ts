import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { ensurePrismaUser } from "@/lib/user-sync";

export async function GET() {
  const session = await getCurrentUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await prisma.chatSession.findMany({
    where: { userId: session.userId },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      createdAt: true,
      updatedAt: true,
      _count: { select: { messages: true } },
      // First user message — used as a fallback label for older chats that
      // were created before auto-titling existed (title is null).
      messages: {
        where: { role: "user" },
        orderBy: { createdAt: "asc" },
        take: 1,
        select: { content: true },
      },
    },
  });

  const sessions = rows.map(({ messages, ...s }) => ({
    ...s,
    preview: messages[0]?.content?.slice(0, 80) ?? null,
  }));

  return NextResponse.json({ sessions });
}

export async function POST(req: Request) {
  const session = await getCurrentUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { title?: string };
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  await ensurePrismaUser(session.userId, session.email);

  const created = await prisma.chatSession.create({
    data: {
      userId: session.userId,
      title: body.title ?? null,
    },
  });

  return NextResponse.json({ session: created }, { status: 201 });
}
