import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { ensurePrismaUser } from "@/lib/user-sync";

export async function GET() {
  const session = await getCurrentUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sessions = await prisma.chatSession.findMany({
    where: { userId: session.userId },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      createdAt: true,
      updatedAt: true,
      _count: { select: { messages: true } },
    },
  });

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
