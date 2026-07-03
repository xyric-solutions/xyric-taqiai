import { NextRequest, NextResponse } from "next/server";
import { getLocalJudgmentById, getCitedByCount } from "@/lib/judgment-db-runtime";
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

  let judgment;
  try {
    judgment = await getLocalJudgmentById(numId);
  } catch {
    // Transient DB/proxy failure — tell the client to retry rather than letting
    // it show "Full text not yet extracted" for a judgment that actually exists.
    return NextResponse.json({ error: "Temporarily unavailable" }, { status: 503 });
  }
  if (!judgment) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const citedBy = await getCitedByCount(judgment.real_citation || judgment.citation);

  return NextResponse.json({ judgment, citedBy });
}
