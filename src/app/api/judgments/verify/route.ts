import { NextRequest, NextResponse } from "next/server";
import { findReportedByCitations } from "@/lib/judgment-db-runtime";
import { getCurrentUser } from "@/lib/auth";

// POST { citations: string[] }
// → { matches: { [normalisedCitation]: judgmentId } }
// Lets the reader mark which cited cases actually exist in the archive.
export async function POST(req: NextRequest) {
  const session = await getCurrentUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let citations: unknown;
  try {
    ({ citations } = await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!Array.isArray(citations)) {
    return NextResponse.json({ matches: {} });
  }

  const clean = citations.filter((c): c is string => typeof c === "string").slice(0, 60);
  const matches = await findReportedByCitations(clean);
  return NextResponse.json({ matches });
}
