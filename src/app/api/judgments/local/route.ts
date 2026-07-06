import { NextRequest, NextResponse } from "next/server";
import {
  searchLocalJudgments,
  searchSectionJudgments,
  searchCitationExact,
  relatedLocalJudgments,
  getJudgmentDbStats,
  getCitedByCounts,
  type SortMode,
} from "@/lib/judgment-db-runtime";
import { getCurrentUser } from "@/lib/auth";

// A query is treated as a legal-section lookup ONLY when it genuinely looks like a
// section reference — an explicit "section/sec/u/s 302", or a bare section token
// optionally followed by a statute name ("302", "489-F", "497 CrPC", "302 PPC").
// A stray number inside a keyword search (a year like 2021, a quantity, a case
// number) must NOT hijack the query into section mode — that was returning
// judgments that merely contained the number instead of matching the keywords.
function isSectionQuery(q: string): boolean {
  const s = q.trim();
  if (!s) return false;
  // explicit section reference: "section 302", "sec. 420", "u/s 497", "s. 302"
  if (/\b(?:section|sec|u\/s|under\s+section)\b\s*\.?\s*\d{1,4}[-\s]?[a-z]?\b/i.test(s)) return true;
  if (/\bs\.\s*\d{1,4}[-\s]?[a-z]?\b/i.test(s)) return true;
  // bare section token, optionally with a statute name
  if (/^\d{1,4}\s*[-/]?\s*[a-z]?(?:\s+(?:ppc|crpc|cpc|cr\.?\s*p\.?\s*c|c\.?\s*p\.?\s*c|p\.?\s*p\.?\s*c|qso|qanun[-\s]?e[-\s]?shahadat|constitution|art(?:icle)?))?\s*$/i.test(s)) {
    // a bare 4-digit year is not a section
    if (/^\d{4}$/.test(s) && Number(s) >= 1800 && Number(s) <= 2099) return false;
    return true;
  }
  return false;
}

// A query the user clearly meant as a REPORTED CITATION (not a keyword search):
// a law-report token (SCMR/PLD/…) or a "<year> <CODE> <number>" style reference
// like "2020-LHR-541" or "PLD 2019 SC 304". Used so that, when no such judgment
// exists, we tell the user honestly instead of dumping every same-year judgment.
function looksLikeCitationQuery(q: string): boolean {
  const s = q.trim();
  if (/\b(?:SCMR|PLD|PCrLJ|PCRLJ|MLD|CLC|YLR|PLJ|NLR|SBLR|CLD|GBLR|KLR)\b/i.test(s)) return true;
  if (/\b(?:19|20)\d{2}\b[\s-]+[A-Za-z]{2,5}[\s-]+\d{1,5}\b/.test(s)) return true;
  return false;
}

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
  // Explicit Citation-mode search (the "Citation" tab): match the judgment's OWN
  // citation, not its text. Either we hold that exact reference or we don't — no
  // dumping every judgment that merely mentions the tokens.
  const mode = searchParams.get("mode") || "";
  if (mode === "citation" && !relatedMode) {
    const found = await searchCitationExact(query, PAGE_SIZE + 1, offset, reportedOnly);
    const hasMore = found.length > PAGE_SIZE;
    return NextResponse.json({
      results: await withCitedBy(found.slice(0, PAGE_SIZE)),
      related: false,
      citationNotFound: found.length === 0 && page === 1,
      hasMore,
      page,
      total: hasMore ? offset + PAGE_SIZE + 1 : offset + found.length,
      totalPages: page + (hasMore ? 1 : 0),
      stats: await getJudgmentDbStats(),
    });
  }

  const sectionMode = isSectionQuery(query);

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
      results: await withCitedBy(rel.slice(0, PAGE_SIZE)), related: true, citationNotFound: looksLikeCitationQuery(query), hasMore, page, total, totalPages: page + (hasMore ? 1 : 0), stats: await getJudgmentDbStats(),
    });
  }

  const found = await searchLocalJudgments(query, court, year, PAGE_SIZE + 1, sort, offset, reportedOnly);

  // Never a dead end: if nothing matched on the first page, surface related judgments by keyword.
  if (found.length === 0 && page === 1) {
    const rel = await relatedLocalJudgments(query, court, year, PAGE_SIZE + 1, sort, offset, reportedOnly);
    const hasMore = rel.length > PAGE_SIZE;
    const total = hasMore ? offset + PAGE_SIZE + 1 : offset + rel.length;
    return NextResponse.json({
      results: await withCitedBy(rel.slice(0, PAGE_SIZE)), related: true, citationNotFound: looksLikeCitationQuery(query), hasMore, page, total, totalPages: page + (hasMore ? 1 : 0), stats: await getJudgmentDbStats(),
    });
  }

  const hasMore = found.length > PAGE_SIZE;
  const total = hasMore ? offset + PAGE_SIZE + 1 : offset + found.length;
  return NextResponse.json({
    results: await withCitedBy(found.slice(0, PAGE_SIZE)), related: false, hasMore, page, total, totalPages: page + (hasMore ? 1 : 0), stats: await getJudgmentDbStats(),
  });
}
