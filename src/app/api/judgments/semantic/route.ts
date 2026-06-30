import { NextRequest, NextResponse } from "next/server";
import { getJudgmentsByIds, searchLocalJudgments } from "@/lib/judgment-db-runtime";
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
  const limit = 25;

  if (query.length < 2) {
    return NextResponse.json({ results: [], mode: "semantic", available: true });
  }

  // Ask the embedding service for ranked ids (over-fetch so filters still fill a page).
  let ids: number[] = [];
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 4000);
    const res = await fetch(`${SERVICE}/search?q=${encodeURIComponent(query)}&k=200`, { signal: ctrl.signal });
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
    return NextResponse.json({ results: kw, mode: "keyword-fallback", available: false });
  }

  const results = await getJudgmentsByIds(ids, query, { court, year, reportedOnly, limit });
  return NextResponse.json({ results, mode: "semantic", available: true });
}
