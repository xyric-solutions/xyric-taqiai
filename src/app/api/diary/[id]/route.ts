import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getCurrentUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const entry = await prisma.diaryEntry.findUnique({ where: { id } });
  if (!entry || entry.userId !== session.userId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  const { caseNumber, lastDate, title, courtName, stage, proceeding, nextDate } = body;

  const updated = await prisma.diaryEntry.update({
    where: { id },
    data: {
      ...(caseNumber !== undefined && { caseNumber: caseNumber || null }),
      ...(lastDate !== undefined && { lastDate: lastDate ? new Date(lastDate) : null }),
      ...(title !== undefined && { title }),
      ...(courtName !== undefined && { courtName }),
      ...(stage !== undefined && { stage }),
      ...(proceeding !== undefined && { proceeding: proceeding || null }),
      ...(nextDate !== undefined && { nextDate: nextDate ? new Date(nextDate) : null }),
    },
  });

  return NextResponse.json({ entry: updated });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getCurrentUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const entry = await prisma.diaryEntry.findUnique({ where: { id } });
  if (!entry || entry.userId !== session.userId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.diaryEntry.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
