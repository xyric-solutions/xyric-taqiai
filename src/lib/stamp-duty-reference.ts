// Curated, source-verified stamp-duty / fixed-fee amounts for the most-asked
// instruments. WHY this exists: stamp-duty amounts live in the Stamp Act
// Schedule (a two-column table that doesn't extract cleanly from the govt PDFs)
// and are revised every year by the provincial Finance Act, which amends the
// schedule by ARTICLE NUMBER in words ("in Article 4, for 'One' substitute
// 'Three'"). So no single scraped document yields "affidavit = Rs 300" directly.
// This hand-verified layer gives the Advisor the correct current amount with its
// exact legal basis. Each entry is cross-checked against the provincial Finance
// Act text in statutes.db + official reporting. Extend as new rates are confirmed.

export interface StampDutyEntry {
  province: string;
  instrument: string; // canonical name
  aliases: string[]; // extra search keywords (incl. Roman-Urdu) — NOT shown to users
  amount: string; // current amount, e.g. "Rs 300"
  basis: string; // Stamp Act schedule article
  effective: string; // amending Finance Act + when
  note?: string;
}

// Punjab — rates as revised by the Punjab Finance Act 2024 (Budget 2024-25,
// w.e.f. 1 July 2024), amending Schedule I of the Stamp Act, 1899.
export const STAMP_DUTY: StampDutyEntry[] = [
  {
    province: "Punjab",
    instrument: "Affidavit",
    aliases: ["affidavit", "halaf nama", "halafnama", "iqrar nama oath"],
    amount: "Rs 300",
    basis: "Stamp Act 1899, Schedule I, Article 4",
    effective: "Punjab Finance Act 2024 (w.e.f. 1 July 2024) — raised from Rs 100",
  },
  {
    province: "Punjab",
    instrument: "Agreement / contract (incl. agreement to sell immovable property)",
    aliases: ["agreement", "contract", "muahida", "iqrar e bbusinesss", "agreement to sell", "bayana"],
    amount: "Rs 3,000",
    basis: "Stamp Act 1899, Schedule I, Article 5(cc)",
    effective: "Punjab Finance Act 2024 (w.e.f. 1 July 2024) — raised from Rs 1,200",
    note: "A general/other agreement under Article 5(d) is Rs 500.",
  },
  {
    province: "Punjab",
    instrument: "General Power of Attorney",
    aliases: ["power of attorney", "general power of attorney", "gpa", "mukhtarnama", "mukhtar nama"],
    amount: "Rs 2,000",
    basis: "Stamp Act 1899, Schedule I, Article 48(a)",
    effective: "Punjab Finance Act 2024 (w.e.f. 1 July 2024) — raised from Rs 500",
    note: "A Power of Attorney to sell/transfer immovable property to a person OUTSIDE the family attracts 2% ad valorem stamp duty on the property value, not the fixed amount.",
  },
  {
    province: "Punjab",
    instrument: "Divorce deed (Talaqnama)",
    aliases: ["divorce", "talaq", "talaqnama", "talaq nama", "khula deed"],
    amount: "Rs 1,000",
    basis: "Stamp Act 1899, Schedule I, Article 29",
    effective: "Punjab Finance Act 2024 (w.e.f. 1 July 2024) — raised from Rs 100",
  },
  {
    province: "Punjab",
    instrument: "Sale of immovable property — fixed stamp component",
    aliases: ["sale deed fixed", "conveyance fixed", "registry stamp fixed"],
    amount: "Rs 3,000 (fixed component)",
    basis: "Stamp Act 1899, Schedule I, Article 22-A / 23",
    effective: "Punjab Finance Act 2024 (w.e.f. 1 July 2024) — raised from Rs 1,200",
    note: "This is only the FIXED component. The main conveyance duty on a property sale is ad valorem (a percentage of the value/DC rate) and is charged in addition.",
  },

  // Sindh — from the Sindh-applicable Stamp Act, 1899 Schedule (official Sindh
  // Govt schedule, sindhzameen.gos.pk). Sindh did NOT raise these the way Punjab
  // did in 2024, so the figures are lower. Only the instruments confirmed from
  // the official schedule are listed; others fall back to the honesty rule.
  {
    province: "Sindh",
    instrument: "Affidavit",
    aliases: ["affidavit", "halaf nama", "halafnama"],
    amount: "Rs 50",
    basis: "Stamp Act 1899 (Sindh) Schedule, Article 4",
    effective: "Sindh-applicable Stamp Act Schedule (official Sindh Govt schedule)",
  },
  {
    province: "Sindh",
    instrument: "Agreement relating to sale/transfer of property",
    aliases: ["agreement", "contract", "muahida", "agreement to sell", "bayana"],
    amount: "Rs 500",
    basis: "Stamp Act 1899 (Sindh) Schedule, Article 5(a)",
    effective: "Sindh-applicable Stamp Act Schedule (official Sindh Govt schedule)",
  },
];

const TRIGGER =
  /\b(stamp|stamp[- ]?paper|stamp[- ]?duty|duty|fee|affidavit|halaf|power\s+of\s+attorney|mukhtar|attorney|agreement|contract|muahida|talaq|divorce|conveyance|sale\s+deed|registry|bond)\b/i;

/** Detect a stamp-duty / fixed-fee amount question and return the matching
 *  curated entries (province-aware). Empty when the question isn't about fees. */
export function findStampDuty(question: string, max = 4): StampDutyEntry[] {
  const q = question.toLowerCase();
  if (!TRIGGER.test(q)) return [];

  // province hint (default to Punjab — the only set curated so far)
  const province = /\bsindh\b/.test(q)
    ? "Sindh"
    : /\b(kpk|khyber|pakhtunkhwa)\b/.test(q)
    ? "KPK"
    : /\bbaloch/.test(q)
    ? "Balochistan"
    : "Punjab";

  const scored = STAMP_DUTY.filter((e) => e.province === province)
    .map((e) => {
      const keys = [e.instrument.toLowerCase(), ...e.aliases];
      const hits = keys.reduce((n, k) => {
        const head = k.split(/[\s/]/)[0];
        return n + (head.length >= 3 && q.includes(head) ? 1 : 0);
      }, 0);
      return { e, hits };
    })
    .filter((x) => x.hits > 0)
    .sort((a, b) => b.hits - a.hits);

  return scored.slice(0, max).map((x) => x.e);
}

const FEE_TRIGGER = TRIGGER;

/** Which province a fee question is about (defaults to Punjab). */
export function feeProvinceOf(question: string): string {
  const q = question.toLowerCase();
  return /\bsindh\b/.test(q)
    ? "Sindh"
    : /\b(kpk|khyber|pakhtunkhwa)\b/.test(q)
    ? "KPK"
    : /\bbaloch/.test(q)
    ? "Balochistan"
    : "Punjab";
}

/**
 * Grounding block for fee/stamp-duty questions. Combines TWO authoritative
 * sources so the Advisor is right across all provinces, not just curated ones:
 *  1) curated, hand-verified exact amounts (highest confidence), and
 *  2) the raw latest Finance-Act amendment text for that province (passed in),
 *     so the model can derive amounts we haven't curated — and the honesty rule
 *     makes it flag anything it still can't settle.
 */
export function stampDutyBlock(
  question: string,
  financeAmendments: { actName: string; year: number | null; text: string }[] = []
): string {
  if (!FEE_TRIGGER.test(question)) return "";
  const hits = findStampDuty(question);
  if (!hits.length && !financeAmendments.length) return "";

  const curated = hits.length
    ? "VERIFIED CURRENT AMOUNTS (curated & cross-checked — use these EXACT figures, they override any older amount in your memory or raw schedule text):\n" +
      hits
        .map(
          (e) =>
            `- ${e.instrument} (${e.province}): ${e.amount}. Basis: ${e.basis}. ${e.effective}.${
              e.note ? ` ${e.note}` : ""
            }`
        )
        .join("\n")
    : "";

  const fa = financeAmendments.length
    ? "LATEST FINANCE-ACT FEE AMENDMENTS for this province (authoritative — these word-substitutions to the Stamp Act / Court Fees Act Schedules set the CURRENT figures; read 'for One substitute Three' as the new value, e.g. One hundred → Three hundred = Rs 300):\n" +
      financeAmendments
        .map((a) => `- ${a.actName}${a.year ? ` (${a.year})` : ""}: ${a.text}`)
        .join("\n")
    : "";

  return `
${[curated, fa].filter(Boolean).join("\n\n")}

FEE RULES (mandatory — for a practising lawyer, accuracy is critical):
- Use the curated verified amount when listed; otherwise derive the current figure from the latest Finance-Act amendment above and cite the Article + Finance Act year.
- Stamp-duty / court-fee amounts are revised every year by the provincial Finance Act and the base Stamp Act schedule shows OLDER figures — always prefer the latest amendment.
- DO NOT GUESS. If neither source clearly settles the exact amount, say so and tell the user to verify on the provincial e-Stamp portal / latest Finance Act — never quote an unverified figure.`;
}
