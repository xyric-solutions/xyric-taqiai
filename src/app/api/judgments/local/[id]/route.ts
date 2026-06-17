import { NextRequest, NextResponse } from "next/server";
import { getLocalJudgmentById, getCitedByCount } from "@/lib/judgment-db";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getCurrentUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const numId = parseInt(id);
  if (isNaN(numId)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

  const judgment = getLocalJudgmentById(numId);
  if (!judgment) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const citedBy = getCitedByCount(judgment.real_citation || judgment.citation);

  return NextResponse.json({ judgment, citedBy });
}
