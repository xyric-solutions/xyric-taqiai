// Grounds the Advisor in the LOCAL statute corpus (statutes.db) — the latest
// federal + provincial Act text — so it answers statute questions from current
// law instead of the model's stale training memory. Mirrors judgment-retrieval.

import { termsFromQuestion } from "@/lib/judgment-retrieval";
import {
  searchStatuteSections,
  findRelatedAmendments,
  type StatuteHit,
} from "@/lib/statute-db-runtime";
import { splitLegalIssues } from "@/lib/advisor-reliability";

export interface StatuteGrounding {
  hits: StatuteHit[];
  /** Text block to splice into the model prompt, or "" when nothing relevant. */
  block: string;
}

function cite(h: StatuteHit): string {
  const prov = h.province && h.province !== "Federal" ? `${h.province} — ` : "";
  const yr = h.year ? `, ${h.year}` : "";
  const sec = h.sectionNo
    ? h.sectionNo.startsWith("Article ") ? `, ${h.sectionNo}` : `, s.${h.sectionNo}`
    : "";
  return `${prov}${h.actName}${yr}${sec}`;
}

function expandLegalConcept(issue: string): string {
  if (/\b295\s*[-/]?\s*C\b/i.test(issue)) {
    return `Section 295-C PPC Pakistan Penal Code derogatory remarks sacred name Holy Prophet ${issue}`;
  }
  if (
    /\b(whatsapp|electronic|digital|voice recording|audio recording|video recording|screenshot|modern device)\b/i.test(issue)
    && /\b(evidence|admissib|proof|recording|authenticate|forensic)\b/i.test(issue)
  ) {
    return `Article 164 QSO Qanun-e-Shahadat electronic evidence modern devices authenticity ${issue}`;
  }
  if (
    /\b(vehicle|car|motorcycle)\b/i.test(issue)
    && /\b(transfer|registration|registered owner|excise|accident|liability)\b/i.test(issue)
  ) {
    return `Motor Vehicles Ordinance registration transfer ownership vehicle liability ${issue}`;
  }
  return issue;
}

/**
 * Retrieve the statute sections most relevant to a legal question and build a
 * grounding block instructing the model to answer FROM this latest law text.
 * Always safe — returns empty on any error.
 */
export async function retrieveStatuteGrounding(question: string, max = 5): Promise<StatuteGrounding> {
  try {
    const issues = splitLegalIssues(question, 3);
    const batches = await Promise.all(
      issues.map(async (issue) => {
        const expandedIssue = expandLegalConcept(issue);
        const relatedQueries = [expandedIssue];
        if (expandedIssue.startsWith("Section 295-C PPC")) {
          relatedQueries.push("Section 156-A CrPC investigation safeguard Superintendent of Police");
        }
        const terms = termsFromQuestion(relatedQueries.join(" "));
        if (!terms.length) return [];
        const found = (await Promise.all(
          relatedQueries.map((query) => searchStatuteSections(termsFromQuestion(query), Math.min(3, max), query)),
        )).flat();
        const tokens = terms
          .flatMap((term) => term.toLowerCase().split(/[^a-z0-9]+/))
          .filter((token) => token.length >= 3 || /^\d{1,4}$/.test(token));
        const ranked = found
          .map((hit) => {
            const searchable = `${hit.actName} ${hit.sectionNo || ""} ${hit.title || ""} ${hit.body}`.toLowerCase();
            const score = tokens.filter((token) => searchable.includes(token)).length;
            return { hit, score };
          })
          .filter(({ score }) => score >= (tokens.length <= 3 ? 1 : 2))
          .sort((a, b) => b.score - a.score);

        const preferredAct = expandedIssue.startsWith("Article 164 QSO")
          ? /qanun.*shahadat|qanoon.*shahadat/i
          : expandedIssue.startsWith("Motor Vehicles Ordinance")
            ? /motor vehicles?/i
            : null;
        const preferred = preferredAct
          ? ranked.filter(({ hit }) => preferredAct.test(hit.actName))
          : [];
        return (preferred.length ? preferred : ranked).map(({ hit }) => hit);
      }),
    );

    const seen = new Set<string>();
    const hits = batches
      .flat()
      .filter((hit) => {
        const key = `${hit.actId}:${hit.sectionNo || ""}:${hit.title || ""}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .slice(0, max);
    if (!hits.length) return { hits: [], block: "" };

    const blocks = hits.map((h, i) => {
      // Cap each section so the prompt stays small (faster first token).
      const text = h.body.slice(0, 900);
      const heading = h.title ? ` — ${h.title}` : "";
      return `[S${i + 1}] ${cite(h)}${heading}\n${text}`;
    });

    // Retrieve amendments for the top distinct Acts so later issues are not
    // ignored in a multi-issue question.
    const topActs = hits.filter(
      (hit, index, all) => all.findIndex((candidate) => candidate.actId === hit.actId) === index,
    ).slice(0, 2);
    const amendments = (await Promise.all(
      topActs.map((hit) => findRelatedAmendments(hit.actName, hit.province, hit.actId, 2)),
    )).flat();
    const amendBlock = amendments.length
      ? `\n\nRELATED AMENDMENTS FOUND IN THE DATABASE (apply only when they amend a retrieved Act above):\n` +
        amendments
          .map(
            (a) =>
              `- ${a.province !== "Federal" ? a.province + " — " : ""}${a.actName}${
                a.year ? ` (${a.year})` : ""
              }: ${a.snippet}`
          )
          .join("\n")
      : "";

    const block = `
RETRIEVED STATUTE SECTIONS FROM THE LOCAL PAKISTANI LAW DATABASE (current, in-force Act texts — federal + provincial):
${blocks.join("\n\n---\n\n")}${amendBlock}

STATUTE GROUNDING RULES (mandatory — accuracy is critical, this is for a practising lawyer):
- Answer the law itself (sections, requirements, procedure, amounts/fees, time limits) FROM the retrieved text above, NOT from your training memory, which may be outdated.
- ACCOUNT FOR AMENDMENTS: if an amendment is listed above, apply it — the amended text is the current law and overrides the base. A later Finance Act / Amendment Act prevails over the original section.
- Cite the exact Act name, year, province and section (e.g. "Punjab Stamp Act, 1899, s.13"). Prefer the province-specific Act for a province-specific question.
- Quote statutory wording only when those exact words appear in a retrieved excerpt. Never reconstruct or expand a quotation from memory.
- DO NOT GUESS. If the retrieved text does not clearly settle the point — especially an exact amount, fee, rate or deadline — say so plainly and tell the user to verify against the latest Finance Act / official gazette / e-Stamp portal. A flagged "please verify" is REQUIRED over a confident wrong figure. Never invent a section number or amount.`;

    return { hits, block };
  } catch {
    return { hits: [], block: "" };
  }
}
