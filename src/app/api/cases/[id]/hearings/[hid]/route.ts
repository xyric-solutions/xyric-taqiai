import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string; hid: string }> }) {
  const session = await getCurrentUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, hid } = await params;
  const legalCase = await prisma.legalCase.findUnique({ where: { id } });
  if (!legalCase || legalCase.userId !== session.userId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const hearing = await prisma.caseHearing.findUnique({ where: { id: hid } });
  if (!hearing || hearing.caseId !== id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.caseHearing.delete({ where: { id: hid } });
  return NextResponse.json({ success: true });
}
