import { NextRequest, NextResponse } from "next/server";
import { getCitedByCounts, getJudgmentsByIds, searchLocalJudgments } from "@/lib/judgment-db-runtime";
import { getCurrentUser } from "@/lib/auth";

const SERVICE = process.env.SEMANTIC_URL || "http://127.0.0.1:8137";

// Semantic ("Smart") search. Asks the local embedding service for the nearest
// judgments by meaning, then hydrates + filters them. If the service is down,
// transparently falls back to keyword search so the feature never hard-fails.
export async function GET(req: NextRequest) {
  const session = await getCurrentUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = req.nextUrl;
  const query = (searchParams.get("q") || "").trim();
  const court = searchParams.get("court") || "";
  const year = searchParams.get("year") || "";
  const reportedOnly = searchParams.get("reported") !== "0";
  const limitParam = parseInt(searchParams.get("limit") || "100", 10);
  const limit = Math.min(100, Math.max(1, Number.isFinite(limitParam) ? limitParam : 100));

  if (query.length < 2) {
    return NextResponse.json({ results: [], mode: "semantic", available: true });
  }

  const withCitedBy = async <T extends { citation: string; reported: boolean; citedBy?: number }>(results: T[]) => {
    const norm = (value: string) => value.replace(/[^a-z0-9]/gi, "").toUpperCase();
    const counts = await getCitedByCounts(results.filter((item) => item.reported).map((item) => item.citation));
    return results.map((item) => ({
      ...item,
      citedBy: item.reported ? counts[norm(item.citation)] || 0 : 0,
    }));
  };

  // Ask the embedding service for ranked ids (over-fetch so filters still fill a page).
  let ids: number[] = [];
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 4000);
    const k = Math.min(500, Math.max(200, limit * 4));
    const res = await fetch(`${SERVICE}/search?q=${encodeURIComponent(query)}&k=${k}`, { signal: ctrl.signal });
    clearTimeout(t);
    if (res.ok) {
      const data = (await res.json()) as { results?: { id: number; score: number }[] };
      ids = (data.results || []).map((r) => r.id);
    }
  } catch {
    ids = [];
  }

  // Service unavailable → fall back to keyword search, flagged so the UI can hint.
  if (ids.length === 0) {
    const kw = await searchLocalJudgments(query, court, year, limit, "relevance", 0, reportedOnly);
    return NextResponse.json({ results: await withCitedBy(kw), mode: "keyword-fallback", available: false });
  }

  const results = await getJudgmentsByIds(ids, query, { court, year, reportedOnly, limit });
  return NextResponse.json({ results: await withCitedBy(results), mode: "semantic", available: true });
}
