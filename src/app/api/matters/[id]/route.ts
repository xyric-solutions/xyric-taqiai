import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

function isValidDate(dateStr: string): boolean {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  return !isNaN(d.getTime());
}

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: RouteContext) {
  const session = await getCurrentUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;
  const matter = await prisma.matter.findFirst({
    where: { id, userId: session.userId },
    include: {
      hearings: { orderBy: { date: "desc" } },
    },
  });

  if (!matter) {
    return NextResponse.json({ error: "Matter not found" }, { status: 404 });
  }

  return NextResponse.json({ matter });
}

export async function PATCH(req: Request, ctx: RouteContext) {
  const session = await getCurrentUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;

  const existing = await prisma.matter.findFirst({
    where: { id, userId: session.userId },
  });
  if (!existing) {
    return NextResponse.json({ error: "Matter not found" }, { status: 404 });
  }

  let body: {
    title?: string;
    caseNo?: string;
    court?: string;
    caseType?: string;
    status?: string;
    role?: string;
    clientName?: string;
    opponentName?: string;
    judgeName?: string;
    dateFiled?: string | null;
    nextHearing?: string | null;
    notes?: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (body.dateFiled && !isValidDate(body.dateFiled)) {
    return NextResponse.json({ error: "Invalid dateFiled format" }, { status: 400 });
  }
  if (body.nextHearing && !isValidDate(body.nextHearing)) {
    return NextResponse.json({ error: "Invalid nextHearing format" }, { status: 400 });
  }

  const updated = await prisma.matter.update({
    where: { id },
    data: {
      ...(body.title !== undefined && { title: body.title }),
      ...(body.caseNo !== undefined && { caseNo: body.caseNo || null }),
      ...(body.court !== undefined && { court: body.court }),
      ...(body.caseType !== undefined && { caseType: body.caseType }),
      ...(body.status !== undefined && { status: body.status }),
      ...(body.role !== undefined && { role: body.role }),
      ...(body.clientName !== undefined && { clientName: body.clientName }),
      ...(body.opponentName !== undefined && { opponentName: body.opponentName || null }),
      ...(body.judgeName !== undefined && { judgeName: body.judgeName || null }),
      ...(body.dateFiled !== undefined && {
        dateFiled: body.dateFiled ? new Date(body.dateFiled) : null,
      }),
      ...(body.nextHearing !== undefined && {
        nextHearing: body.nextHearing ? new Date(body.nextHearing) : null,
      }),
      ...(body.notes !== undefined && { notes: body.notes || null }),
    },
    include: { hearings: { orderBy: { date: "desc" } } },
  });

  return NextResponse.json({ matter: updated });
}

export async function DELETE(_req: Request, ctx: RouteContext) {
  const session = await getCurrentUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;

  const existing = await prisma.matter.findFirst({
    where: { id, userId: session.userId },
  });
  if (!existing) {
    return NextResponse.json({ error: "Matter not found" }, { status: 404 });
  }

  // Soft delete — archive instead of hard delete
  await prisma.matter.update({
    where: { id },
    data: { archived: true },
  });

  return NextResponse.json({ success: true });
}
