import { NextRequest, NextResponse } from "next/server";
import { geminiGenerate } from "@/lib/gemini-helper";
import { Part } from "@google/generative-ai";
import { getCurrentUser } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const session = await getCurrentUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!rateLimit(session.userId, 20, 60_000)) {
    return NextResponse.json({ error: "Too many requests. Please wait a minute and try again." }, { status: 429 });
  }

  try {
    const formData = await req.formData();
    const query = formData.get("query") as string | null;
    const pdfText = formData.get("pdfText") as string | null;
    const imageFile = formData.get("image") as File | null;
    const mode = (formData.get("mode") as string) || "search";

    if (pdfText && pdfText.length > 50000) {
      return NextResponse.json({ error: "PDF text is too large (max 50000 characters)" }, { status: 400 });
    }

    const parts: Part[] = [];

    // Build prompt based on mode
    if (mode === "search") {
      const searchQuery = query || "";
      parts.push({
        text: `You are an expert legal researcher specializing in Pakistani case law. A lawyer has searched for: "${searchQuery}"

Search Pakistani legal databases and provide detailed information about this judgment or legal topic. Include:
1. **Citation**: Full citation (reporter, year, page)
2. **Court**: Which court decided this (Supreme Court, High Court, etc.)
3. **Year**: Year of the judgment
4. **Parties**: Names of parties (if applicable)
5. **Summary**: Brief factual and procedural summary
6. **Legal Principle / Ratio Decidendi**: The key legal principle established
7. **Relevance**: Why this judgment matters for Pakistani law
8. **Related Citations**: 2-3 related judgments on the same principle

Pakistani reporter formats include: SCMR (Supreme Court Monthly Review), PLD (Pakistan Legal Decisions), PCrLJ (Pakistan Criminal Law Journal), MLD (Monthly Law Digest), CLC (Civil Law Cases), YLR (Yearly Law Reporter), PLJ (Pakistan Law Journal), NLR (National Law Reporter), SBLR (Sindh Balochistan Law Reporter).

If searching by keyword/topic, list the most relevant judgments. Format the response clearly with headers.`,
      });
    } else if (mode === "summarize") {
      let contentProvided = false;

      if (imageFile) {
        const buffer = Buffer.from(await imageFile.arrayBuffer());
        const base64 = buffer.toString("base64");
        parts.push({
          inlineData: {
            mimeType: imageFile.type as "image/jpeg" | "image/png" | "image/webp",
            data: base64,
          },
        });
        contentProvided = true;
      }

      if (pdfText && pdfText.trim()) {
        parts.push({ text: `Judgment Text:\n${pdfText}\n\n` });
        contentProvided = true;
      }

      if (!contentProvided) {
        return NextResponse.json({ error: "No judgment content provided" }, { status: 400 });
      }

      parts.push({
        text: `You are a Pakistani legal expert. Summarize this judgment comprehensively for a lawyer. Include:

**JUDGMENT SUMMARY / فیصلے کا خلاصہ**

1. **Citation & Court**: Full citation, court, bench
2. **Facts**: Key facts of the case (3-5 sentences)
3. **Issues**: Legal issues framed by the court
4. **Decision**: What the court decided
5. **Ratio Decidendi**: The binding legal principle / ratio
6. **Obiter Dicta**: Any significant non-binding observations
7. **Key Statutes**: Laws, sections, and articles referred to
8. **Practical Significance**: How this judgment affects similar cases
9. **Dissenting Opinion**: If any

Keep it precise and useful for a practicing lawyer.`,
      });
    } else if (mode === "qa") {
      const question = query || "";
      let contentProvided = false;

      if (imageFile) {
        const buffer = Buffer.from(await imageFile.arrayBuffer());
        const base64 = buffer.toString("base64");
        parts.push({
          inlineData: {
            mimeType: imageFile.type as "image/jpeg" | "image/png" | "image/webp",
            data: base64,
          },
        });
        contentProvided = true;
      }

      if (pdfText && pdfText.trim()) {
        parts.push({ text: `Judgment Text:\n${pdfText}\n\n` });
        contentProvided = true;
      }

      if (!contentProvided || !question.trim()) {
        return NextResponse.json({ error: "Judgment content and question are required" }, { status: 400 });
      }

      parts.push({
        text: `You are a Pakistani legal expert. Based on the judgment provided above, answer this specific question from a lawyer:

**Question**: ${question}

Provide a precise, legally accurate answer. Reference specific paragraphs, pages, or parts of the judgment where relevant. Consider:
- Whether the point is part of ratio decidendi or obiter dicta
- Applicability to subordinate courts
- Any exceptions or limitations
- Related principles from other judgments if helpful`,
      });
    } else if (mode === "strategy") {
      const facts = query || "";
      let contentProvided = false;

      if (imageFile) {
        const buffer = Buffer.from(await imageFile.arrayBuffer());
        const base64 = buffer.toString("base64");
        parts.push({
          inlineData: {
            mimeType: imageFile.type as "image/jpeg" | "image/png" | "image/webp",
            data: base64,
          },
        });
        contentProvided = true;
      }

      if (pdfText && pdfText.trim()) {
        parts.push({ text: `Judgment Text:\n${pdfText}\n\n` });
        contentProvided = true;
      }

      if (!contentProvided) {
        return NextResponse.json({ error: "No judgment content provided" }, { status: 400 });
      }

      parts.push({
        text: `You are a senior Pakistani advocate with 20+ years of experience. Analyze this judgment and suggest legal strategy and arguments for a lawyer who wants to use or distinguish this judgment.

${facts ? `Case Facts / مقدمے کے حقائق:\n${facts}\n\n` : ""}

Provide a comprehensive strategy guide:

**LEGAL STRATEGY / قانونی حکمت عملی**

1. **How to Use This Judgment (Relying Side)**:
   - Key arguments to extract
   - Exact quotes/principles to cite
   - Courts where binding (Supreme Court → all; High Court → within province)

2. **How to Distinguish (Opposing Side)**:
   - Factual distinctions
   - Legal distinctions
   - Arguments to limit its scope

3. **Key Arguments to Make**:
   - 3-5 strong arguments derived from this judgment
   - Supporting statutes or constitutional provisions

4. **Possible Weaknesses**:
   - Where opposing counsel may attack
   - Counter-arguments to prepare for

5. **Related Judgments to Also Cite**:
   - Suggest 3-5 related Pakistani judgments that strengthen the position

6. **Drafting Tips**:
   - How to frame the legal proposition in pleadings
   - Suggested prayer/relief language

Keep advice practical and actionable for a Pakistani courtroom.`,
      });
    } else {
      return NextResponse.json({ error: "Invalid mode" }, { status: 400 });
    }

    const result = await geminiGenerate(parts);
    return NextResponse.json({ result });
  } catch (err) {
    console.error("[judgment API]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Request failed" },
      { status: 500 }
    );
  }
}
