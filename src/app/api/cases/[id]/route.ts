import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getCurrentUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const legalCase = await prisma.legalCase.findUnique({
    where: { id },
    include: { hearings: { orderBy: { date: "desc" } } },
  });
  if (!legalCase || legalCase.userId !== session.userId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ case: legalCase });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getCurrentUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const existing = await prisma.legalCase.findUnique({ where: { id } });
  if (!existing || existing.userId !== session.userId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let body;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid body" }, { status: 400 }); }

  // documentIds is stored as a JSON string. Accept an array from the client.
  let documentIdsValue: string | undefined;
  if (body.documentIds !== undefined) {
    const arr = Array.isArray(body.documentIds) ? body.documentIds.filter((d: unknown) => typeof d === "string") : [];
    documentIdsValue = JSON.stringify(arr);
  }

  const updated = await prisma.legalCase.update({
    where: { id },
    data: {
      ...(body.name !== undefined && { name: body.name }),
      ...(body.status !== undefined && { status: body.status }),
      ...(body.courtName !== undefined && { courtName: body.courtName || null }),
      ...(body.nextHearingDate !== undefined && { nextHearingDate: body.nextHearingDate ? new Date(body.nextHearingDate) : null }),
      ...(body.clientName !== undefined && { clientName: body.clientName || null }),
      ...(body.clientCnic !== undefined && { clientCnic: body.clientCnic || null }),
      ...(body.clientPhone !== undefined && { clientPhone: body.clientPhone || null }),
      ...(documentIdsValue !== undefined && { documentIds: documentIdsValue }),
    },
  });
  return NextResponse.json({ case: updated });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getCurrentUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const existing = await prisma.legalCase.findUnique({ where: { id } });
  if (!existing || existing.userId !== session.userId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.legalCase.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
