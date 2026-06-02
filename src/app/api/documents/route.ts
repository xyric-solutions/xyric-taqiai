import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { ensurePrismaUser } from "@/lib/user-sync";

export async function GET() {
  const session = await getCurrentUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await ensurePrismaUser(session.userId, session.email);

  const docs = await prisma.document.findMany({
    where: { userId: session.userId },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      category: true,
      subType: true,
      language: true,
      status: true,
      generatedContent: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return NextResponse.json({ documents: docs });
}

export async function POST(req: Request) {
  const session = await getCurrentUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    title?: string;
    category?: string;
    subType?: string;
    language?: string;
    content?: string;
    formData?: Record<string, unknown>;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { title, category, subType, language, content, formData } = body;
  if (!title || !category || !subType || !content) {
    return NextResponse.json(
      { error: "Missing required fields: title, category, subType, content" },
      { status: 400 }
    );
  }

  await ensurePrismaUser(session.userId, session.email);

  const doc = await prisma.document.create({
    data: {
      userId: session.userId,
      title,
      category,
      subType,
      language: language ?? "en",
      generatedContent: content,
      formData: JSON.stringify(formData ?? {}),
    },
  });

  return NextResponse.json({ document: doc }, { status: 201 });
}
