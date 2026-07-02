import { NextRequest, NextResponse } from "next/server";
import {
  searchLocalJudgments,
  searchSectionJudgments,
  relatedLocalJudgments,
  getJudgmentDbStats,
  getCitedByCounts,
  type SortMode,
} from "@/lib/judgment-db-runtime";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getCurrentUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = req.nextUrl;
  const query = searchParams.get("q") || "";
  const court = searchParams.get("court") || "";
  const year = searchParams.get("year") || "";
  const sortParam = (searchParams.get("sort") || "relevance") as SortMode;
  const sort: SortMode = ["relevance", "newest", "oldest", "cited"].includes(sortParam)
    ? sortParam
    : "relevance";

  const limitParam = parseInt(searchParams.get("limit") || "100", 10);
  const PAGE_SIZE = Math.min(100, Math.max(1, Number.isFinite(limitParam) ? limitParam : 100));
  const page = Math.max(1, parseInt(searchParams.get("page") || "1") || 1);
  const offset = (page - 1) * PAGE_SIZE;
  // Fetch one extra so we know whether a further page exists.
  const relatedMode = searchParams.get("related") === "1";
  // Default to reported (citable) judgments only — the signal a lawyer can use in
  // court. Pass reported=0 to include unreported/uncitable judgments too.
  const reportedOnly = searchParams.get("reported") !== "0";

  if (!query.trim() || query.length < 2) {
    return NextResponse.json({ results: [], related: false, hasMore: false, page, total: 0, totalPages: 0, stats: await getJudgmentDbStats() });
  }

  const withCitedBy = async <T extends { citation: string; reported: boolean; citedBy?: number }>(results: T[]) => {
    const norm = (value: string) => value.replace(/[^a-z0-9]/gi, "").toUpperCase();
    const counts = await getCitedByCounts(results.filter((item) => item.reported).map((item) => item.citation));
    const enriched = results.map((item) => ({
      ...item,
      citedBy: item.reported ? counts[norm(item.citation)] || 0 : 0,
    }));
    if (sort === "cited") {
      enriched.sort((a, b) => (b.citedBy || 0) - (a.citedBy || 0));
    }
    return enriched;
  };
  const sectionMode = /\b\d{2,4}\s*[-/]?\s*[A-Za-z]?\b/.test(query);

  if (sectionMode && !relatedMode) {
    const found = await searchSectionJudgments(query, court, year, PAGE_SIZE + 1, offset, reportedOnly);
    const hasMore = found.length > PAGE_SIZE;
    return NextResponse.json({
      results: await withCitedBy(found.slice(0, PAGE_SIZE)),
      related: false,
      hasMore,
      page,
      total: hasMore ? offset + PAGE_SIZE + 1 : offset + found.length,
      totalPages: page + (hasMore ? 1 : 0),
      stats: await getJudgmentDbStats(),
    });
  }

  // When page 1 found no exact match the client switches to related mode and
  // pages through related judgments instead.
  if (relatedMode) {
    const rel = await relatedLocalJudgments(query, court, year, PAGE_SIZE + 1, sort, offset, reportedOnly);
    const hasMore = rel.length > PAGE_SIZE;
    const total = hasMore ? offset + PAGE_SIZE + 1 : offset + rel.length;
    return NextResponse.json({
      results: await withCitedBy(rel.slice(0, PAGE_SIZE)), related: true, hasMore, page, total, totalPages: page + (hasMore ? 1 : 0), stats: await getJudgmentDbStats(),
    });
  }

  const found = await searchLocalJudgments(query, court, year, PAGE_SIZE + 1, sort, offset, reportedOnly);

  // Never a dead end: if nothing matched on the first page, surface related judgments by keyword.
  if (found.length === 0 && page === 1) {
    const rel = await relatedLocalJudgments(query, court, year, PAGE_SIZE + 1, sort, offset, reportedOnly);
    const hasMore = rel.length > PAGE_SIZE;
    const total = hasMore ? offset + PAGE_SIZE + 1 : offset + rel.length;
    return NextResponse.json({
      results: await withCitedBy(rel.slice(0, PAGE_SIZE)), related: true, hasMore, page, total, totalPages: page + (hasMore ? 1 : 0), stats: await getJudgmentDbStats(),
    });
  }

  const hasMore = found.length > PAGE_SIZE;
  const total = hasMore ? offset + PAGE_SIZE + 1 : offset + found.length;
  return NextResponse.json({
    results: await withCitedBy(found.slice(0, PAGE_SIZE)), related: false, hasMore, page, total, totalPages: page + (hasMore ? 1 : 0), stats: await getJudgmentDbStats(),
  });
}
