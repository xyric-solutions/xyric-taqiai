// Retrieval layer that grounds free-text AI features (the Advisor chat) in the
// real local judgment corpus, so the model cites judgments that actually exist
// instead of inventing citations.

import {
  searchAdvisorJudgmentsFast,
  searchAdvisorSectionJudgments,
} from "@/lib/judgment-db-runtime";
import { splitLegalIssues } from "@/lib/advisor-reliability";

export interface GroundingSource {
  id: number | string;
  citation: string;
  court: string;
  year: number;
  title: string | null;
  reported: boolean;
  externalUrl?: string;
}

const STOP = new Set([
  "the", "and", "with", "from", "against", "under", "section", "sections",
  "court", "high", "honble", "honourable", "case", "legal", "law", "please",
  "what", "which", "whom", "that", "this", "have", "does", "about", "into",
  "their", "there", "would", "could", "should", "advice", "question", "answer",
  "draft", "document", "client", "matter", "issue", "regarding", "respect",
  "pakistan", "pakistani", "lawyer", "advocate", "kindly", "tell", "explain",
  "judgment", "judgments", "precedent", "precedents", "authority", "authorities",
  "citation", "citations", "reported", "decision", "decisions", "ruling", "rulings",
  "user", "person", "someone", "want", "wants", "need", "needs", "asked", "provide",
]);

function conceptTerms(question: string): string[] {
  const text = question.toLowerCase();
  const concepts: string[] = [];
  const add = (...terms: string[]) => concepts.push(...terms);

  if (/whatsapp|voice recording|electronic evidence|digital evidence/.test(text)) add("electronic", "evidence", "admissibility", "authenticity");
  if (/tenant|landlord|rent|kiraya|evict/.test(text)) add("landlord", "tenant", "eviction", "rent", "default");
  if (/inherit|inherited|virasat|co-sharer|brother|sister/.test(text)) add("inheritance", "co-sharer", "partition", "alienation");
  if (/vehicle|car|excise|registration|accident/.test(text)) add("vehicle", "ownership", "transfer", "registered", "accident", "liability");
  if (/dishonou?red cheque|489\s*[-/]?\s*f|cheque bounce/.test(text)) add("cheque", "dishonour", "obligation", "loan");
  if (/bail|zamanat|further inquiry/.test(text)) add("bail", "grounds", "inquiry");
  if (/quash|quashing|fir/.test(text)) add("FIR", "quashing", "offence", "process");
  if (/custody|guardian|minor|child/.test(text)) add("minor", "welfare", "custody", "guardianship");
  if (/maintenance|nafqa/.test(text)) add("maintenance", "wife", "child", "family");
  if (/khula|dissolution|divorce|talaq/.test(text)) add("dissolution", "marriage", "khula", "family");
  if (/contract|agreement|breach|specific performance|damages/.test(text)) add("contract", "breach", "damages", "performance");
  if (/property|land|plot|possession|injunction|title/.test(text)) add("property", "possession", "title", "injunction");
  if (/employee|employer|termination|dismissal|service/.test(text)) add("service", "termination", "employee", "reinstatement");
  if (/murder|qatl|homicide|302/.test(text)) add("murder", "intention", "evidence", "motive");
  if (/assault|hurt|injur|324/.test(text)) add("hurt", "injury", "intention", "evidence");
  if (/threat|intimidation|506/.test(text)) add("intimidation", "threat", "alarm", "offence");
  if (/fraud|cheat|deception|420/.test(text)) add("cheating", "fraud", "deception", "dishonest");
  if (/loan|debt|recovery|unpaid/.test(text)) add("recovery", "debt", "acknowledgment", "proof");
  if (/negligen|accident|compensation/.test(text)) add("negligence", "liability", "compensation", "damages");
  if (/defamation|reputation|libel|slander/.test(text)) add("defamation", "reputation", "publication", "damages");
  if (/tax|assessment|fbr/.test(text)) add("assessment", "appeal", "tax", "jurisdiction");
  if (/company|shareholder|director/.test(text)) add("company", "shareholder", "director", "resolution");
  if (/writ|constitutional|public authority|article 199/.test(text)) add("constitutional", "jurisdiction", "alternate", "remedy");

  return Array.from(new Set(concepts));
}

function focusedSearchQueries(issueTerms: string[], concepts: string[]): string[] {
  const variants: string[] = [];
  if (concepts.length >= 3) variants.push(concepts.slice(0, 3).join(" "));
  if (concepts.length >= 4) variants.push(concepts.slice(1, 4).join(" "));
  if (concepts.length >= 5) variants.push([concepts[1], concepts[3], concepts[4]].join(" "));
  const topical = issueTerms.filter((term) => !/^\d+$/.test(term)).slice(0, 3);
  if (topical.length >= 2) variants.push(topical.join(" "));
  return Array.from(new Set(variants.filter((query) => query.split(/\s+/).length >= 2))).slice(0, 4);
}

/** Pull a handful of search terms out of a free-text legal question. */
export function termsFromQuestion(question: string): string[] {
  const text = question.replace(/\s+/g, " ").trim();
  const terms: string[] = [];

  // statute/section references — "302 PPC", "497 Cr.P.C", "489-F"
  const sectionRe = /\b\d{1,4}[-/]?[A-Z]{0,2}\s*(?:PPC|Cr\.?P\.?C\.?|C\.?P\.?C\.?|CrPC|CPC)\b/gi;
  for (const m of text.matchAll(sectionRe)) terms.push(m[0].replace(/\s+/g, " ").trim());

  // Compact and spaced suffix forms: 295C, 295-C, 295 C, section 295C.
  for (const match of text.matchAll(/\b(\d{1,4})\s*[-/]?\s*([A-Z])\b/gi)) {
    terms.push(`${match[1]}-${match[2].toUpperCase()}`);
  }

  for (const match of text.matchAll(/\b(?:section|sections|sec\.?|dafa|article)\s*(\d{1,4})(?:\s*[-/]?\s*([A-Z]))?\b/gi)) {
    terms.push(match[2] ? `${match[1]}-${match[2].toUpperCase()}` : match[1]);
  }

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
    if (out.length >= 8) break;
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

    const issues = splitLegalIssues(question, 2);
    const issueInputs = issues.map((issue) => ({
      issue,
      terms: termsFromQuestion(issue),
      concepts: conceptTerms(issue),
    }));
    const candidateBatches = await Promise.all(
      issueInputs.map(async ({ issue, terms: issueTerms, concepts }) => {
        if (!issueTerms.length) return [];
        const focusedQueries = focusedSearchQueries(issueTerms, concepts);
        const hasSection = issueTerms.some((term) => /^\d{1,4}(?:-[A-Z])?(?:\s*(?:PPC|Cr\.?P\.?C\.?|C\.?P\.?C\.?|CrPC|CPC|QSO))?$/i.test(term));
        const [exact, topical] = await Promise.all([
          hasSection
            ? searchAdvisorSectionJudgments(issue, max + 4)
            : Promise.resolve([]),
          searchAdvisorJudgmentsFast(focusedQueries, max + 8),
        ]);
        const seen = new Set<number>();
        return [...exact, ...topical].filter((candidate) => {
          if (seen.has(candidate.id)) return false;
          seen.add(candidate.id);
          return true;
        });
      }),
    );
    if (!candidateBatches.some((batch) => batch.length)) return { sources: [], block: "" };

    const rankedByIssue = candidateBatches.map((candidates, issueIndex) => {
      const issueTerms = Array.from(new Set([
        ...issueInputs[issueIndex].terms,
        ...issueInputs[issueIndex].concepts,
      ])).slice(0, 12);
      return candidates.map((candidate) => {
        const body = `${candidate.title || ""} ${candidate.passages.join(" ")}`.toLowerCase();
        const title = (candidate.title || "").toLowerCase();
        const matched = issueTerms.filter((term) => body.includes(term.toLowerCase()));
        const titleMatches = issueTerms.filter((term) => title.includes(term.toLowerCase())).length;
        return {
          candidate,
          matched: matched.length,
          score: matched.length * 4 + titleMatches * 3
            + (candidate.court.startsWith("Supreme Court") ? 2 : 0)
            + (candidate.court.includes("High Court") ? 1 : 0),
        };
      })
      .filter(({ candidate, matched }) => {
        const hasReadableText = candidate.passages.some((passage) => passage.replace(/\s+/g, " ").trim().length >= 60);
        const requiredMatches = issueTerms.length <= 2 ? 1 : 2;
        return candidate.reported && hasReadableText && matched >= requiredMatches;
      })
      .sort((a, b) => b.score - a.score);
    });

    const selected: typeof rankedByIssue[number] = [];
    const selectedIds = new Set<number>();
    for (const ranked of rankedByIssue) {
      const best = ranked.find(({ candidate }) => !selectedIds.has(candidate.id));
      if (!best) continue;
      selected.push(best);
      selectedIds.add(best.candidate.id);
    }
    const remaining = rankedByIssue.flat().sort((a, b) => b.score - a.score);
    for (const ranked of remaining) {
      if (selected.length >= max) break;
      if (selectedIds.has(ranked.candidate.id)) continue;
      selected.push(ranked);
      selectedIds.add(ranked.candidate.id);
    }
    const picked = selected.slice(0, max).map(({ candidate }) => candidate);

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
RETRIEVED REPORTED JUDGMENTS FROM THE LOCAL PAKISTANI CASE-LAW DATABASE:
${blocks.join("\n\n---\n\n")}

GROUNDING RULES (mandatory):
- Cite a judgment only if its excerpt directly supports the proposition and its facts or legal issue are materially relevant.
- Cite ONLY from the retrieved reported judgments above. Do NOT invent or recall any citation that is not listed here.
- If none of the retrieved judgments are relevant to the question, say so plainly and answer on statute/principle alone — do NOT fabricate a citation.
- For statute sections, prefer any "RETRIEVED STATUTE SECTIONS" provided below; only fall back to your own legal knowledge for sections not covered there.`;

    return { sources, block };
  } catch {
    return { sources: [], block: "" };
  }
}
