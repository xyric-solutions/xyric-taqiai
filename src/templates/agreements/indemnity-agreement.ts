import { TemplateDefinition } from "../types";

export const indemnityAgreement: TemplateDefinition = {
  category: "agreement",
  subType: "indemnity-agreement",
  name: "Indemnity Agreement",
  nameUrdu: "معاوضہ معاہدہ",
  description: "Agreement to indemnify and hold harmless against losses",
  descriptionUrdu: "نقصانات سے تحفظ اور معاوضے کا معاہدہ",
  icon: "Shield",
  formFields: [
    {
      name: "indemnifierName",
      label: "Indemnifier Name",
      labelUrdu: "معاوضہ دینے والے کا نام",
      type: "text",
      required: true,
      group: "Indemnifier Details",
    },
    {
      name: "indemnifierFatherName",
      label: "Indemnifier's Father's Name",
      labelUrdu: "معاوضہ دینے والے کے والد کا نام",
      type: "text",
      required: true,
      group: "Indemnifier Details",
    },
    {
      name: "indemnifierCnic",
      label: "Indemnifier CNIC",
      labelUrdu: "معاوضہ دینے والے کا شناختی کارڈ",
      type: "cnic",
      required: true,
      group: "Indemnifier Details",
    },
    {
      name: "indemnifierAddress",
      label: "Indemnifier Address",
      labelUrdu: "معاوضہ دینے والے کا پتہ",
      type: "address",
      required: true,
      group: "Indemnifier Details",
    },
    {
      name: "indemnifiedName",
      label: "Indemnified Party Name",
      labelUrdu: "محفوظ فریق کا نام",
      type: "text",
      required: true,
      group: "Indemnified Party Details",
    },
    {
      name: "indemnifiedCnic",
      label: "Indemnified Party CNIC / Registration No",
      labelUrdu: "محفوظ فریق کا شناختی کارڈ / رجسٹریشن نمبر",
      type: "text",
      required: true,
      group: "Indemnified Party Details",
    },
    {
      name: "indemnifiedAddress",
      label: "Indemnified Party Address",
      labelUrdu: "محفوظ فریق کا پتہ",
      type: "address",
      required: true,
      group: "Indemnified Party Details",
    },
    {
      name: "scopeOfIndemnity",
      label: "Scope of Indemnity",
      labelUrdu: "معاوضے کا دائرہ کار",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Indemnity Terms",
    },
    {
      name: "coveredRisks",
      label: "Covered Risks / Events",
      labelUrdu: "شامل خطرات / واقعات",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Indemnity Terms",
    },
    {
      name: "maximumLiability",
      label: "Maximum Liability Amount (PKR) - if capped",
      labelUrdu: "زیادہ سے زیادہ ذمہ داری کی رقم (روپے) - اگر محدود ہو",
      type: "number",
      required: false,
      group: "Indemnity Terms",
    },
    {
      name: "exclusions",
      label: "Exclusions / Limitations",
      labelUrdu: "مستثنیات / حدود",
      type: "textarea",
      required: false,
      aiSuggestable: true,
      group: "Indemnity Terms",
    },
    {
      name: "duration",
      label: "Duration of Indemnity",
      labelUrdu: "معاوضے کی مدت",
      type: "text",
      required: true,
      group: "Duration",
    },
    {
      name: "additionalTerms",
      label: "Additional Terms",
      labelUrdu: "اضافی شرائط",
      type: "textarea",
      required: false,
      aiSuggestable: true,
      group: "Additional Terms",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate an Indemnity Agreement (Muawza Muahida) in {{language}}.

INDEMNIFIER:
- Name: {{indemnifierName}}
- Father's Name: {{indemnifierFatherName}}
- CNIC: {{indemnifierCnic}}
- Address: {{indemnifierAddress}}

INDEMNIFIED PARTY:
- Name: {{indemnifiedName}}
- CNIC/Registration: {{indemnifiedCnic}}
- Address: {{indemnifiedAddress}}

INDEMNITY TERMS:
- Scope: {{scopeOfIndemnity}}
- Covered Risks: {{coveredRisks}}
- Maximum Liability: PKR {{maximumLiability}}
- Exclusions: {{exclusions}}
- Duration: {{duration}}

ADDITIONAL: {{additionalTerms}}

Generate a complete Indemnity Agreement following Pakistani Contract Act (Sections 124-125). Include indemnity undertakREFERENCE FORMAT - Follow this exact Pakistani legal format:

INDEMNITY AGREEMENT

This Indemnity Agreement is made and executed on this ___ day of ___________, 20___ at [City].

BETWEEN:

[Indemnifier Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
(hereinafter called the "INDEMNIFIER")

AND

[Indemnitee Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
(hereinafter called the "INDEMNITEE")

NOW THEREFORE BOTH PARTIES AGREE AS UNDER:

1. That the Indemnifier hereby agrees to indemnify and hold harmless the Indemnitee from and against all losses, claims, damages, expenses, and liabilities arising from [Specific Risk / Transaction].
2. That the indemnity covers [Scope - legal fees / third party claims / financial losses] arising directly from [Cause].
3. That the Indemnitee shall promptly notify the Indemnifier of any claim for which indemnification is sought.
4. That the Indemnifier shall have the right to defend or settle any claim at its own cost.
5. That this indemnity shall remain in force for a period of [Duration] years / until [Event].
6. That this agreement shall be governed by the laws of Pakistan.

INDEMNIFIER                             INDEMNITEE
[Name]                                  [Name]
CNIC: ___________                       CNIC: ___________

Witness 1: ___________________   Witness 2: ___________________

INSTRUCTIONS:
- Title: INDEMNITY AGREEMENT (centered, bold)
- BETWEEN / AND party structure
- Numbered "That..." clauses
- Include scope, covered risks, notification requirement, duration
- Both signatures at bottom
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
