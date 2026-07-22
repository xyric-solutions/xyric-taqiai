import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { searchStatuteSections } from "@/lib/statute-db-runtime";
import { parseLegalProvisionReference } from "@/lib/legal-provision-reference";

export const dynamic = "force-dynamic";

const STOP = new Set([
  "the", "and", "with", "from", "against", "under", "section", "sections",
  "court", "case", "legal", "law", "please", "what", "which", "that",
  "this", "have", "does", "about", "pakistan", "pakistani", "lawyer",
  "advocate", "tell", "explain", "find", "search",
]);

function searchTerms(query: string): string[] {
  const text = query.replace(/\s+/g, " ").trim();
  const terms: string[] = [];

  const exactReference = parseLegalProvisionReference(text);
  if (exactReference) {
    terms.push(exactReference.canonical, exactReference.provision, ...exactReference.subsections);
  }

  const sectionRef =
    /\b\d{1,4}(?:[-/]?[A-Z]{0,2})?(?:\s*\([0-9A-Za-z]+\))*\s*(?:PPC|P\.P\.C|Cr\.?P\.?C\.?|C\.?P\.?C\.?|CrPC|CPC|QSO|PECA)\b/gi;
  for (const match of text.matchAll(sectionRef)) {
    terms.push(match[0].replace(/\s+/g, " ").trim());
  }

  for (const match of text.matchAll(/\b\d{1,4}(?:[-/]?[A-Z]{0,2})?(?:\s*\([0-9A-Za-z]+\))*/g)) {
    terms.push(match[0]);
  }

  const words = text.toLowerCase().split(/[^a-z0-9]+/);
  for (const word of words) {
    if (word.length >= 3 && !STOP.has(word)) terms.push(word);
  }

  const seen = new Set<string>();
  const out: string[] = [];
  for (const term of terms) {
    const key = term.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(term);
    if (out.length >= 8) break;
  }
  return out;
}

export async function GET(req: NextRequest) {
  const session = await getCurrentUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = req.nextUrl;
  const query = (searchParams.get("q") || "").trim();
  const limitParam = parseInt(searchParams.get("limit") || "8", 10);
  const limit = Math.min(20, Math.max(1, Number.isFinite(limitParam) ? limitParam : 8));

  if (query.length < 2) {
    return NextResponse.json({ query, results: [] });
  }

  const terms = searchTerms(query);
  const results = await searchStatuteSections(terms, limit, query);
  return NextResponse.json({ query, results });
}
