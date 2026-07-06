import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

function isValidDate(dateStr: string): boolean {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  return !isNaN(d.getTime());
}

export async function GET() {
  const session = await getCurrentUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const matters = await prisma.matter.findMany({
    where: { userId: session.userId, archived: false },
    orderBy: { nextHearing: "asc" },
    include: {
      hearings: {
        orderBy: { date: "desc" },
        take: 5,
      },
    },
  });

  return NextResponse.json({ matters });
}

export async function POST(req: Request) {
  const session = await getCurrentUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    title?: string;
    caseNo?: string;
    court?: string;
    caseType?: string;
    status?: string;
    role?: string;
    clientName?: string;
    clientPhone?: string;
    opponentName?: string;
    judgeName?: string;
    dateFiled?: string;
    nextHearing?: string;
    notes?: string;
    stage?: string;
    proceeding?: string;
    lastDate?: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.title?.trim() || !body.clientName?.trim()) {
    return NextResponse.json(
      { error: "Title and client name are required" },
      { status: 400 }
    );
  }

  if (body.dateFiled && !isValidDate(body.dateFiled)) {
    return NextResponse.json({ error: "Invalid dateFiled format" }, { status: 400 });
  }
  if (body.nextHearing && !isValidDate(body.nextHearing)) {
    return NextResponse.json({ error: "Invalid nextHearing format" }, { status: 400 });
  }

  const matter = await prisma.matter.create({
    data: {
      userId: session.userId,
      title: body.title.trim(),
      caseNo: body.caseNo?.trim() || null,
      court: body.court?.trim() || "",
      caseType: body.caseType?.trim() || "Civil",
      status: body.status || "active",
      role: body.role?.trim() || "",
      clientName: body.clientName.trim(),
      clientPhone: body.clientPhone?.trim() || null,
      opponentName: body.opponentName?.trim() || null,
      judgeName: body.judgeName?.trim() || null,
      dateFiled: body.dateFiled ? new Date(body.dateFiled) : null,
      nextHearing: body.nextHearing ? new Date(body.nextHearing) : null,
      notes: body.notes?.trim() || null,
      stage: body.stage?.trim() || null,
      proceeding: body.proceeding?.trim() || null,
      lastDate: body.lastDate ? new Date(body.lastDate) : null,
    },
  });

  return NextResponse.json({ matter }, { status: 201 });
}
