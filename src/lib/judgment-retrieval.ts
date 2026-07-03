// Retrieval layer that grounds free-text AI features (the Advisor chat) in the
// real local judgment corpus, so the model cites judgments that actually exist
// instead of inventing citations.

import { relatedLocalJudgments } from "@/lib/judgment-db-runtime";

export interface GroundingSource {
  id: number;
  citation: string;
  court: string;
  year: number;
  title: string | null;
  reported: boolean;
}

const STOP = new Set([
  "the", "and", "with", "from", "against", "under", "section", "sections",
  "court", "high", "honble", "honourable", "case", "legal", "law", "please",
  "what", "which", "whom", "that", "this", "have", "does", "about", "into",
  "their", "there", "would", "could", "should", "advice", "question", "answer",
  "draft", "document", "client", "matter", "issue", "regarding", "respect",
  "pakistan", "pakistani", "lawyer", "advocate", "kindly", "tell", "explain",
]);

/** Pull a handful of search terms out of a free-text legal question. */
export function termsFromQuestion(question: string): string[] {
  const text = question.replace(/\s+/g, " ").trim();
  const terms: string[] = [];

  // statute/section references — "302 PPC", "497 Cr.P.C", "489-F"
  const sectionRe = /\b\d{1,4}[-/]?[A-Z]{0,2}\s*(?:PPC|Cr\.?P\.?C\.?|C\.?P\.?C\.?|CrPC|CPC)\b/gi;
  for (const m of text.matchAll(sectionRe)) terms.push(m[0].replace(/\s+/g, " ").trim());

  // bare section numbers with a letter suffix — "489-F", "9-A"
  for (const m of text.matchAll(/\b\d{2,4}-[A-Z]\b/g)) terms.push(m[0]);

  // meaningful keywords
  const words = text.toLowerCase().split(/[^a-z0-9؀-ۿ-]+/);
  for (const w of words) {
    if (w.length >= 4 && !STOP.has(w)) terms.push(w);
  }

  // de-dupe, cap
  const seen = new Set<string>();
  const out: string[] = [];
  for (const t of terms) {
    const k = t.toLowerCase();
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(t);
    if (out.length >= 6) break;
  }
  return out;
}

export interface Grounding {
  sources: GroundingSource[];
  /** Text block to splice into the model prompt, or "" when nothing relevant. */
  block: string;
}

/**
 * Find real judgments relevant to a legal question and build a grounding block.
 * Prefers reported (citable) judgments. Always safe — returns empty on any error.
 *
 * IMPORTANT: this searches the SAME corpus the Judgment Reader opens (Postgres at
 * runtime), and only cites judgments that actually have readable full text — so a
 * cited judgment always opens with its text instead of "full text not yet
 * extracted". (Previously it read the local SQLite corpus, which contained
 * judgments that are missing or empty in Postgres, so the reader showed nothing.)
 */
export async function retrieveGrounding(question: string, max = 5): Promise<Grounding> {
  try {
    const terms = termsFromQuestion(question);
    if (!terms.length) return { sources: [], block: "" };

    // OR-match the key terms over the Postgres corpus. Fetch a few extra so we
    // can drop any text-less rows and still fill `max`.
    const query = terms.join(" ");
    const candidates = await relatedLocalJudgments(query, undefined, undefined, max + 8);
    if (!candidates.length) return { sources: [], block: "" };

    // Keep only judgments that carry real text (so the citation opens with
    // content), and put reported (citable) ones first.
    const withText = candidates.filter(
      (c) => c.passages.some((p) => p.replace(/\s+/g, " ").trim().length >= 60),
    );
    const ranked = [...withText].sort((a, b) => Number(b.reported) - Number(a.reported));
    const picked = ranked.slice(0, max);

    const sources: GroundingSource[] = [];
    const blocks: string[] = [];
    picked.forEach((c, i) => {
      // Cap each snippet — the model only needs enough to recognise the case,
      // and a smaller prompt means a faster first token.
      const snippet = (c.passages.join(" ") || "").replace(/\s+/g, " ").trim().slice(0, 700);
      if (snippet.length < 60) return;
      sources.push({
        id: c.id, citation: c.citation, court: c.court,
        year: c.year, title: c.title, reported: c.reported,
      });
      blocks.push(
        `[${i + 1}] ${c.citation} | ${c.court}${c.year ? ` | ${c.year}` : ""}${c.title ? `\nTitle: ${c.title}` : ""}\n${snippet}`
      );
    });

    if (!sources.length) return { sources: [], block: "" };

    const block = `
RETRIEVED JUDGMENTS FROM THE LOCAL PAKISTANI CASE-LAW DATABASE (these are REAL, verified judgments):
${blocks.join("\n\n---\n\n")}

GROUNDING RULES (mandatory):
- When you cite case-law, cite ONLY from the retrieved judgments above. Do NOT invent or recall any citation that is not listed here.
- If none of the retrieved judgments are relevant to the question, say so plainly and answer on statute/principle alone — do NOT fabricate a citation.
- For statute sections, prefer any "RETRIEVED STATUTE SECTIONS" provided below; only fall back to your own legal knowledge for sections not covered there.`;

    return { sources, block };
  } catch {
    return { sources: [], block: "" };
  }
}
