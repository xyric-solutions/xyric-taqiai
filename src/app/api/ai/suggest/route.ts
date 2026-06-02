import { NextRequest, NextResponse } from "next/server";
import { getFieldSuggestions } from "@/lib/gemini";
import { getCurrentUser } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const session = await getCurrentUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!rateLimit(session.userId, 20, 60_000)) {
    return NextResponse.json({ error: "Too many requests. Please wait a minute and try again." }, { status: 429 });
  }

  try {
    const { fieldName, documentType, context } = await request.json();

    if (!fieldName || !documentType) {
      return NextResponse.json(
        { error: "fieldName and documentType are required" },
        { status: 400 }
      );
    }

    const suggestions = await getFieldSuggestions(fieldName, documentType, context || {});

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error("AI suggest error:", error);
    return NextResponse.json(
      { error: "Failed to get suggestions" },
      { status: 500 }
    );
  }
}
