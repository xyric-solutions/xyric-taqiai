// Curated, source-verified knowledge of RECENT legal reforms / notifications that
// are NOT captured as Acts in statutes.db — e.g. things created by regulations,
// SROs or Board-of-Revenue notifications (which live on department sites, not the
// laws portals). Each entry is hand-verified against official reporting so the
// Advisor can answer current-affairs legal questions correctly with sources,
// instead of saying "no information". Extend as new reforms land.

export interface LegalUpdate {
  topic: string;
  aliases: string[]; // search keywords (incl. Roman-Urdu) — NOT shown to users
  province: string;
  summary: string; // the verified facts the model should ground on
  legalBasis: string;
  status: string; // timeline / current status (date-stamped)
  sources: string[];
}

export const LEGAL_UPDATES: LegalUpdate[] = [
  {
    topic: "Green Property Certificate (Punjab)",
    aliases: [
      "green certificate",
      "green property certificate",
      "gpc",
      "fard",
      "fard system",
      "fard khatam",
      "fard abolish",
      "property certificate",
      "land record certificate",
      "record of rights",
      "plra certificate",
    ],
    province: "Punjab",
    summary:
      "The Punjab Land Records Authority describes the Green Property Certificate as an electronically generated ownership document that verifies the legal status, ownership, and possession of land and includes secure verification features.",
    legalBasis:
      "Official PLRA Green Property Certificate service. Any claim that it replaces another record, or that a transaction is invalid without it, must be checked against the applicable Board of Revenue notification for the district and date concerned.",
    status:
      "Available through the PLRA process described on its official website. Current fees, district rollout, and transaction requirements must be confirmed directly with PLRA or the relevant Board of Revenue notification.",
    sources: [
      "https://www.punjab-zameen.gov.pk/gpcinfo",
    ],
  },
  {
    topic: "26th Amendment to the Constitution of Pakistan (2024)",
    aliases: [
      "26th amendment",
      "twenty-sixth amendment",
      "26 amendment",
      "constitutional bench",
      "judicial commission",
      "chief justice tenure",
      "suo motu",
    ],
    province: "Federal",
    summary:
      "The amendment inserted Article 9A and amended multiple constitutional provisions concerning judicial appointments, the Judicial Commission, constitutional benches, court jurisdiction, and related institutional arrangements. Its exact effect on a pending matter must be read from the amended article and any later amendment.",
    legalBasis:
      "The Constitution (Twenty-sixth Amendment) Act, 2024 (Act No. XXVI of 2024), in force from 21 October 2024.",
    status: "In force since 21 October 2024.",
    sources: [
      "https://na.gov.pk/uploads/documents/671f74b8da9e0_263.pdf",
    ],
  },
  {
    topic: "27th Amendment to the Constitution of Pakistan (2025)",
    aliases: [
      "27th amendment",
      "twenty-seventh amendment",
      "27 amendment",
      "federal constitutional court",
      "fcc",
      "article 175b",
      "chief of defence forces",
      "article 243",
    ],
    province: "Federal",
    summary:
      "The amendment created and integrated a Federal Constitutional Court into the constitutional structure and amended provisions concerning constitutional jurisdiction, the judiciary, judicial transfers, and other institutions. Apply its provisions from the official Gazette text, without adding political commentary or inferring effects not stated there.",
    legalBasis:
      "The Constitution (Twenty-seventh Amendment) Act, 2025 (Act No. XXXII of 2025), assented to and published on 13 November 2025.",
    status: "In force from 13 November 2025, subject to the commencement terms of the official Act.",
    sources: [
      "https://na.gov.pk/uploads/documents/691ec19a6a212_270.pdf",
    ],
  },
];

const TRIGGER =
  /\b(green\s*(property\s*)?certificate|gpc|fard|record\s+of\s+rights|land\s+record|plra|property\s+certificate|intiqal|registry|2[0-9](st|nd|rd|th)?\s*(constitutional\s*)?amendment|twenty[- ](sixth|seventh)\s*amendment|federal\s+constitutional\s+court|constitutional\s+bench|suo\s*motu|article\s*243|article\s*175b)\b/i;

/** Detect a question about a curated reform and return matching entries. */
export function findLegalUpdates(question: string, max = 2): LegalUpdate[] {
  const q = question.toLowerCase();
  if (!TRIGGER.test(q)) return [];
  const scored = LEGAL_UPDATES.map((u) => {
    const hits = u.aliases.reduce((n, a) => {
      const head = a.split(/\s+/)[0];
      return n + (head.length >= 3 && q.includes(head) ? 1 : 0);
    }, 0);
    return { u, hits };
  })
    .filter((x) => x.hits > 0)
    .sort((a, b) => b.hits - a.hits);
  return scored.slice(0, max).map((x) => x.u);
}

/** Grounding block of curated reform knowledge to splice into the model prompt. */
export function legalUpdatesBlock(question: string): string {
  const hits = findLegalUpdates(question);
  if (!hits.length) return "";
  const items = hits
    .map(
      (u) =>
        `• ${u.topic}\n  What it is: ${u.summary}\n  Legal basis: ${u.legalBasis}\n  Status: ${u.status}\n  Sources: ${u.sources.join(", ")}`
    )
    .join("\n\n");
  return `
VERIFIED RECENT LEGAL REFORM (curated from official sources):
${items}

RULE: Answer from the verified facts above and cite the legal basis. For the exact current fee, procedure or district status (which can change), tell the user to confirm on the PLRA / Punjab e-Stamp / Board of Revenue portal — do not guess beyond what is stated.`;
}
