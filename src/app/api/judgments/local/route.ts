import { NextRequest, NextResponse } from "next/server";
import {
  searchLocalJudgments,
  relatedLocalJudgments,
  getJudgmentDbStats,
  type SortMode,
} from "@/lib/judgment-db";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getCurrentUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = req.nextUrl;
  const query = searchParams.get("q") || "";
  const court = searchParams.get("court") || "";
  const year = searchParams.get("year") || "";
  const sortParam = (searchParams.get("sort") || "relevance") as SortMode;
  const sort: SortMode = ["relevance", "newest", "oldest"].includes(sortParam)
    ? sortParam
    : "relevance";

  if (!query.trim() || query.length < 2) {
    return NextResponse.json({ results: [], related: false, stats: getJudgmentDbStats() });
  }

  const results = searchLocalJudgments(query, court, year, 25, sort);

  // Never a dead end: if nothing matched, surface related judgments by keyword.
  if (results.length === 0) {
    const related = relatedLocalJudgments(query, court, year, 15, sort);
    return NextResponse.json({ results: related, related: true, stats: getJudgmentDbStats() });
  }

  return NextResponse.json({ results, related: false, stats: getJudgmentDbStats() });
}
