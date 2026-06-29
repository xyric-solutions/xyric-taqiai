// Grounds the Advisor in the LOCAL statute corpus (statutes.db) — the latest
// federal + provincial Act text — so it answers statute questions from current
// law instead of the model's stale training memory. Mirrors judgment-retrieval.

import { termsFromQuestion } from "@/lib/judgment-retrieval";
import {
  searchStatuteSections,
  findRelatedAmendments,
  type StatuteHit,
} from "@/lib/statute-db";

export interface StatuteGrounding {
  hits: StatuteHit[];
  /** Text block to splice into the model prompt, or "" when nothing relevant. */
  block: string;
}

function cite(h: StatuteHit): string {
  const prov = h.province && h.province !== "Federal" ? `${h.province} — ` : "";
  const yr = h.year ? `, ${h.year}` : "";
  const sec = h.sectionNo ? `, s.${h.sectionNo}` : "";
  return `${prov}${h.actName}${yr}${sec}`;
}

/**
 * Retrieve the statute sections most relevant to a legal question and build a
 * grounding block instructing the model to answer FROM this latest law text.
 * Always safe — returns empty on any error.
 */
export function retrieveStatuteGrounding(question: string, max = 5): StatuteGrounding {
  try {
    const terms = termsFromQuestion(question);
    if (!terms.length) return { hits: [], block: "" };

    const hits = searchStatuteSections(terms, max, question);
    if (!hits.length) return { hits: [], block: "" };

    const blocks = hits.map((h, i) => {
      // Cap each section so the prompt stays small (faster first token).
      const text = h.body.slice(0, 900);
      const heading = h.title ? ` — ${h.title}` : "";
      return `[S${i + 1}] ${cite(h)}${heading}\n${text}`;
    });

    // Consolidation: for the top matched Act, pull in its amendment Acts so the
    // model sees base + every change and can state the CURRENT position. This is
    // what catches "has this law been amended?" — the core reliability concern.
    const top = hits[0];
    const amendments = findRelatedAmendments(top.actName, top.province, top.actId);
    const amendBlock = amendments.length
      ? `\n\nAMENDMENTS TO "${top.actName}" FOUND IN THE DATABASE (apply these — they change the base text above):\n` +
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
- DO NOT GUESS. If the retrieved text does not clearly settle the point — especially an exact amount, fee, rate or deadline — say so plainly and tell the user to verify against the latest Finance Act / official gazette / e-Stamp portal. A flagged "please verify" is REQUIRED over a confident wrong figure. Never invent a section number or amount.`;

    return { hits, block };
  } catch {
    return { hits: [], block: "" };
  }
}
