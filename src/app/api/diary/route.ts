import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getCurrentUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const entries = await prisma.diaryEntry.findMany({
    where: { userId: session.userId },
    orderBy: { nextDate: "asc" },
  });

  return NextResponse.json({ entries });
}

export async function POST(req: NextRequest) {
  const session = await getCurrentUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  const { caseNumber, lastDate, title, courtName, stage, proceeding, nextDate, clientPhone } = body;

  if (!title || !courtName || !stage) {
    return NextResponse.json({ error: "Title, court name, and stage are required" }, { status: 400 });
  }

  const entry = await prisma.diaryEntry.create({
    data: {
      userId: session.userId,
      caseNumber: caseNumber || null,
      lastDate: lastDate ? new Date(lastDate) : null,
      title,
      courtName,
      stage,
      proceeding: proceeding || null,
      nextDate: nextDate ? new Date(nextDate) : null,
      clientPhone: clientPhone || null,
    },
  });

  return NextResponse.json({ entry }, { status: 201 });
}
