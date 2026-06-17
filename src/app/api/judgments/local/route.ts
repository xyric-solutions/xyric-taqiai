import { NextRequest, NextResponse } from "next/server";
import {
  searchLocalJudgments,
  searchSectionJudgments,
  relatedLocalJudgments,
  countLocalJudgments,
  countRelatedJudgments,
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

  const PAGE_SIZE = 25;
  const page = Math.max(1, parseInt(searchParams.get("page") || "1") || 1);
  const offset = (page - 1) * PAGE_SIZE;
  // Fetch one extra so we know whether a further page exists.
  const relatedMode = searchParams.get("related") === "1";
  // Default to reported (citable) judgments only — the signal a lawyer can use in
  // court. Pass reported=0 to include unreported/uncitable judgments too.
  const reportedOnly = searchParams.get("reported") !== "0";

  if (!query.trim() || query.length < 2) {
    return NextResponse.json({ results: [], related: false, hasMore: false, page, total: 0, totalPages: 0, stats: getJudgmentDbStats() });
  }

  const pagesFor = (total: number) => Math.max(1, Math.ceil(total / PAGE_SIZE));
  const sectionMode = /\b\d{2,4}\s*[-/]?\s*[A-Za-z]?\b/.test(query);

  if (sectionMode && !relatedMode) {
    const found = searchSectionJudgments(query, court, year, PAGE_SIZE + 1, offset, reportedOnly);
    const hasMore = found.length > PAGE_SIZE;
    return NextResponse.json({
      results: found.slice(0, PAGE_SIZE),
      related: false,
      hasMore,
      page,
      total: hasMore ? offset + PAGE_SIZE + 1 : offset + found.length,
      totalPages: page + (hasMore ? 1 : 0),
      stats: getJudgmentDbStats(),
    });
  }

  // When page 1 found no exact match the client switches to related mode and
  // pages through related judgments instead.
  if (relatedMode) {
    const rel = relatedLocalJudgments(query, court, year, PAGE_SIZE + 1, sort, offset, reportedOnly);
    const total = countRelatedJudgments(query, court, year, reportedOnly);
    const hasMore = rel.length > PAGE_SIZE;
    return NextResponse.json({
      results: rel.slice(0, PAGE_SIZE), related: true, hasMore, page, total, totalPages: pagesFor(total), stats: getJudgmentDbStats(),
    });
  }

  const found = searchLocalJudgments(query, court, year, PAGE_SIZE + 1, sort, offset, reportedOnly);

  // Never a dead end: if nothing matched on the first page, surface related judgments by keyword.
  if (found.length === 0 && page === 1) {
    const rel = relatedLocalJudgments(query, court, year, PAGE_SIZE + 1, sort, offset, reportedOnly);
    const total = countRelatedJudgments(query, court, year, reportedOnly);
    const hasMore = rel.length > PAGE_SIZE;
    return NextResponse.json({
      results: rel.slice(0, PAGE_SIZE), related: true, hasMore, page, total, totalPages: pagesFor(total), stats: getJudgmentDbStats(),
    });
  }

  const total = countLocalJudgments(query, court, year, reportedOnly);
  const hasMore = found.length > PAGE_SIZE;
  return NextResponse.json({
    results: found.slice(0, PAGE_SIZE), related: false, hasMore, page, total, totalPages: pagesFor(total), stats: getJudgmentDbStats(),
  });
}
