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
    topic: "Green Property Certificate (Punjab) — replacing the Fard",
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
      "Punjab is replacing the traditional Fard (record of rights) with a digital, forgery-proof Green Property Certificate (GPC) issued by the Punjab Land Records Authority (PLRA). The GPC confirms ownership, possession and legal status of a property and is becoming the SOLE valid document for land-record transactions; the Fard is being abolished and will no longer be accepted as a transaction document.",
    legalBasis:
      "Punjab PLRA (Management of Land Records) Regulations 2025, framed and notified under sections 14, 15 and 16 of the Punjab Land Records Authority Act, 2017. Fard suspension effected by a Board of Revenue notification (under the Punjab Land Record Authority Rules).",
    status:
      "As of mid-2026: pilot in Sahiwal (Fard suspended there from 1 May 2026), extended to Lodhran and Hafizabad from 1 July 2026, with province-wide rollout (incl. Lahore and ~20 major districts) targeted by December 2026. From 1 July 2026, sale/purchase of residential, commercial or agricultural land WITHOUT a valid GPC has no legal standing in the rolled-out districts. GPC fee revised in January 2026 from Rs 700 to Rs 950.",
    sources: [
      "https://www.dawn.com/news/1995916",
      "https://www.pakistantoday.com.pk/2026/04/29/punjab-to-replace-fard-with-green-property-certificate",
      "https://www.punjab-zameen.gov.pk/ (PLRA — official)",
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
      "The 26th Constitutional Amendment overhauled the judiciary: it removed the Supreme Court's suo motu power, capped the Chief Justice of Pakistan's tenure at 3 years, made Parliament part of appointing the CJP (via a parliamentary committee from a panel of senior judges), reconstituted the Judicial Commission of Pakistan for judges' appointments, and created a separate Constitutional Bench in the Supreme Court to hear constitutional cases.",
    legalBasis:
      "The Constitution (Twenty-sixth Amendment) Act, 2024 — passed by Parliament 20–21 October 2024, presidential assent 21 October 2024. (NOTE: the Constitution PDF in this corpus is consolidated only up to 2018, so it does NOT yet show these changes.)",
    status: "In force since 21 October 2024.",
    sources: [
      "https://en.wikipedia.org/wiki/Twenty-sixth_Amendment_to_the_Constitution_of_Pakistan",
      "https://na.gov.pk/ (National Assembly — official text)",
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
      "The 27th Constitutional Amendment created a new Federal Constitutional Court (FCC) — added Articles 175B to 175L — whose decisions bind all other courts INCLUDING the Supreme Court; it changed the process for transferring judges, amended Article 243 (control of the armed forces) creating a Chief of Defence Forces with lifelong constitutional immunities, and revisited provinces' fiscal/administrative autonomy. It is highly controversial — two senior SC judges (Justices Mansoor Ali Shah and Athar Minallah) resigned, and bodies like the ICJ criticised it as undermining judicial independence.",
    legalBasis:
      "The Constitution (Twenty-seventh Amendment) Act, 2025 — passed 13 November 2025, presidential assent same period. (NOTE: not reflected in the up-to-2018 Constitution PDF in this corpus.)",
    status: "In force since November 2025 (most recent constitutional amendment).",
    sources: [
      "https://www.dawn.com/news/1954815",
      "https://en.wikipedia.org/wiki/Twenty-seventh_Amendment_to_the_Constitution_of_Pakistan",
      "https://na.gov.pk/ (National Assembly — official text)",
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
VERIFIED RECENT LEGAL REFORM (curated & fact-checked against official reporting — use this; do NOT say you have no information on it):
${items}

RULE: Answer from the verified facts above and cite the legal basis. For the exact current fee, procedure or district status (which can change), tell the user to confirm on the PLRA / Punjab e-Stamp / Board of Revenue portal — do not guess beyond what is stated.`;
}
