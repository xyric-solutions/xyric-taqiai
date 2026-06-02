import { TemplateDefinition } from "../types";

export const oathAffidavit: TemplateDefinition = {
  category: "affidavit",
  subType: "oath-affidavit",
  name: "General Oath Affidavit",
  nameUrdu: "حلفیہ بیان",
  description: "Sworn statement used in courts for oath-based declarations",
  descriptionUrdu: "عدالتی کارروائی کے لیے حلفیہ بیان",
  icon: "Scale",
  formFields: [
    {
      name: "deponentName",
      label: "Deponent Name",
      labelUrdu: "حلف اٹھانے والے کا نام",
      type: "text",
      required: true,
      placeholder: "Enter full name",
      placeholderUrdu: "پورا نام درج کریں",
      group: "Deponent Details",
    },
    {
      name: "fatherName",
      label: "Father's / Husband's Name",
      labelUrdu: "والد / شوہر کا نام",
      type: "text",
      required: true,
      placeholder: "Enter father's or husband's name",
      group: "Deponent Details",
    },
    {
      name: "cnic",
      label: "CNIC Number",
      labelUrdu: "شناختی کارڈ نمبر",
      type: "cnic",
      required: true,
      placeholder: "XXXXX-XXXXXXX-X",
      validation: { pattern: "^[0-9]{5}-[0-9]{7}-[0-9]$" },
      group: "Deponent Details",
    },
    {
      name: "address",
      label: "Residential Address",
      labelUrdu: "رہائشی پتہ",
      type: "address",
      required: true,
      placeholder: "Enter complete address",
      group: "Deponent Details",
    },
    {
      name: "courtName",
      label: "Court Name",
      labelUrdu: "عدالت کا نام",
      type: "text",
      required: true,
      placeholder: "e.g., Civil Court Lahore",
      placeholderUrdu: "مثلاً سول کورٹ لاہور",
      group: "Case Details",
    },
    {
      name: "caseNumber",
      label: "Case Number",
      labelUrdu: "مقدمہ نمبر",
      type: "text",
      required: false,
      placeholder: "Enter case number if applicable",
      group: "Case Details",
    },
    {
      name: "caseTitle",
      label: "Case Title",
      labelUrdu: "مقدمہ کا عنوان",
      type: "text",
      required: false,
      placeholder: "e.g., Plaintiff vs Defendant",
      group: "Case Details",
    },
    {
      name: "statementFacts",
      label: "Statement of Facts",
      labelUrdu: "بیان حقائق",
      type: "textarea",
      required: true,
      placeholder: "Enter the detailed sworn statement and facts",
      aiSuggestable: true,
      group: "Statement",
    },
    {
      name: "prayerClause",
      label: "Prayer Clause",
      labelUrdu: "التجائی فقرہ",
      type: "textarea",
      required: false,
      placeholder: "Enter prayer/relief sought",
      aiSuggestable: true,
      group: "Statement",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a formal General Oath Affidavit (حلفیہ بیان) in {{language}}.

DEPONENT DETAILS:
- Name: {{deponentName}}
- Father's/Husband's Name: {{fatherName}}
- CNIC: {{cnic}}
- Address: {{address}}

CASE DETAILS:
- Court: {{courtName}}
- Case Number: {{caseNumber}}
- Case Title: {{caseTitle}}

STATEMENT OF FACTS: {{statementFacts}}
PRAYER CLAUSE: {{prayerClause}}

Generate a complete, legally valid Oath Affidavit following Pakistani law format under the Oaths Act 1873. Include:
1. Title and heading with court details
2. Deponent identification paragraph
3. Numbered statement of facts with sworn oath
4. Prayer clause
5. Verification clause on oath
6. Oath statement ("I solemnly affirm and declare that the REFERENCE FORMAT - Follow this exact Pakistani legal format:

OATH / AFFIDAVIT

I, [Deponent Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address], do hereby solemnly affirm and declare as under:

1. That I [statement of oath / affirmation based on specific purpose].
2. That [supporting fact / second declaration].
3. That I undertake to fulfill my obligations faithfully and honestly.
4. That the contents of this oath / affidavit are true and correct to the best of my knowledge and belief and nothing has been concealed.

DEPONENT
[Deponent Name] S/o [Father Name]
CNIC: ___________

VERIFICATION:
Verified on oath at [City] on this ___ day of ___________ that the contents of the above are true and correct to the best of my knowledge and belief and nothing has been concealed therein.

DEPONENT

ATTESTED
(Oath Commissioner / Notary Public / Class-1 Officer)

INSTRUCTIONS:
- Title: OATH / AFFIDAVIT (centered, bold) - adapt to specific purpose
- "That..." numbered clauses
- Include specific oath statements based on purpose
- Include VERIFICATION paragraph
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
