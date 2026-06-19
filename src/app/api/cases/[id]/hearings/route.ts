import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

// Verify the case belongs to the logged-in user before touching its hearings.
async function ownedCase(id: string, userId: string) {
  const c = await prisma.legalCase.findUnique({ where: { id } });
  return c && c.userId === userId ? c : null;
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getCurrentUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  if (!(await ownedCase(id, session.userId))) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const hearings = await prisma.caseHearing.findMany({
    where: { caseId: id },
    orderBy: { date: "desc" },
  });
  return NextResponse.json({ hearings });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getCurrentUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  if (!(await ownedCase(id, session.userId))) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let body;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid body" }, { status: 400 }); }

  if (!body.date) return NextResponse.json({ error: "Hearing date is required" }, { status: 400 });

  const hearing = await prisma.caseHearing.create({
    data: {
      caseId: id,
      date: new Date(body.date),
      purpose: body.purpose || null,
      result: body.result || null,
      nextDate: body.nextDate ? new Date(body.nextDate) : null,
    },
  });

  // Logging a hearing with a next date sets the case's next hearing, so it
  // surfaces in the "Upcoming Hearings" widget on the Cases page.
  if (hearing.nextDate) {
    await prisma.legalCase.update({
      where: { id },
      data: { nextHearingDate: hearing.nextDate },
    });
  }

  return NextResponse.json({ hearing }, { status: 201 });
}
