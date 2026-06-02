import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const session = await getCurrentUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const cases = await prisma.legalCase.findMany({
    where: { userId: session.userId },
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json({ cases });
}

export async function POST(req: NextRequest) {
  const session = await getCurrentUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid body" }, { status: 400 }); }

  const { name, status, courtName, nextHearingDate, clientName, clientCnic, clientPhone } = body;
  if (!name?.trim()) return NextResponse.json({ error: "Case name is required" }, { status: 400 });

  const legalCase = await prisma.legalCase.create({
    data: {
      userId: session.userId,
      name: name.trim(),
      status: status || "in-progress",
      courtName: courtName || null,
      nextHearingDate: nextHearingDate ? new Date(nextHearingDate) : null,
      clientName: clientName || null,
      clientCnic: clientCnic || null,
      clientPhone: clientPhone || null,
      documentIds: "[]",
    },
  });
  return NextResponse.json({ case: legalCase }, { status: 201 });
}
