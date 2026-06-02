import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: RouteContext) {
  const session = await getCurrentUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;

  // Verify matter belongs to user
  const matter = await prisma.matter.findFirst({
    where: { id, userId: session.userId },
  });
  if (!matter) {
    return NextResponse.json({ error: "Matter not found" }, { status: 404 });
  }

  const hearings = await prisma.matterHearing.findMany({
    where: { matterId: id },
    orderBy: { date: "desc" },
  });

  return NextResponse.json({ hearings });
}

export async function POST(req: Request, ctx: RouteContext) {
  const session = await getCurrentUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;

  // Verify matter belongs to user
  const matter = await prisma.matter.findFirst({
    where: { id, userId: session.userId },
  });
  if (!matter) {
    return NextResponse.json({ error: "Matter not found" }, { status: 404 });
  }

  let body: {
    date?: string;
    purpose?: string;
    result?: string;
    nextDate?: string | null;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.date) {
    return NextResponse.json({ error: "Hearing date is required" }, { status: 400 });
  }

  const hearing = await prisma.matterHearing.create({
    data: {
      matterId: id,
      date: new Date(body.date),
      purpose: body.purpose?.trim() || null,
      result: body.result?.trim() || null,
      nextDate: body.nextDate ? new Date(body.nextDate) : null,
    },
  });

  // If a next hearing date was provided, update the matter's nextHearing field
  if (body.nextDate) {
    await prisma.matter.update({
      where: { id },
      data: { nextHearing: new Date(body.nextDate) },
    });
  }

  return NextResponse.json({ hearing }, { status: 201 });
}
