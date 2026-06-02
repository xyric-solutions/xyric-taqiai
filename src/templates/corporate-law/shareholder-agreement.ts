import { TemplateDefinition } from "../types";

export const shareholderAgreement: TemplateDefinition = {
  category: "corporate-law",
  subType: "shareholder-agreement",
  name: "Shareholder Agreement / شیئر ہولڈر معاہدہ",
  nameUrdu: "شیئر ہولڈر معاہدہ",
  description: "Shareholder agreement under the Companies Act 2017",
  descriptionUrdu: "کمپنیز ایکٹ 2017 کے تحت شیئر ہولڈر معاہدہ",
  icon: "FileCheck",
  formFields: [
    {
      name: "companyName",
      label: "Company Name",
      labelUrdu: "کمپنی کا نام",
      type: "text",
      required: true,
      group: "Company Details",
    },
    {
      name: "companyRegistrationNo",
      label: "Company Registration Number",
      labelUrdu: "کمپنی رجسٹریشن نمبر",
      type: "text",
      required: true,
      group: "Company Details",
    },
    {
      name: "shareholdersDetails",
      label: "Shareholders Details (Names, CNICs, Addresses)",
      labelUrdu: "شیئر ہولڈرز کی تفصیلات (نام، شناختی کارڈ، پتے)",
      type: "textarea",
      required: true,
      group: "Shareholders",
    },
    {
      name: "sharePercentages",
      label: "Share Percentages / Allocation",
      labelUrdu: "حصص کی تقسیم / فیصد",
      type: "textarea",
      required: true,
      group: "Share Details",
    },
    {
      name: "rights",
      label: "Shareholder Rights (Voting, Dividends, etc.)",
      labelUrdu: "شیئر ہولڈر حقوق (ووٹنگ، منافع وغیرہ)",
      type: "textarea",
      required: true,
      group: "Rights & Restrictions",
    },
    {
      name: "restrictions",
      label: "Transfer Restrictions / Pre-emption Rights",
      labelUrdu: "منتقلی کی پابندیاں / حق شفعہ",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Rights & Restrictions",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a Shareholder Agreement in {{language}}.

COMPANY:
- Name: {{companyName}}
- Registration No: {{companyRegistrationNo}}

SHAREHOLDERS:
{{shareholdersDetails}}

SHARE DETAILS:
{{sharePercentages}}

RIGHTS & RESTRICTIONS:
- Rights: {{rights}}
- Restrictions: {{restrictions}}

Generate a complete Shareholder Agreement under the Companies Act 2017 as applicable in Pakistan.
Include definitions, share capital structure, shareholder rights, transfer restrictions, pre-emption rights, tag-along/drag-along clREFERENCE FORMAT - Follow this exact Pakistani legal format:

SHAREHOLDERS AGREEMENT

This Shareholders Agreement is made and executed on this ___ day of ___________, 20___ at [City].

BETWEEN:

1. [Shareholder 1 Name / Company], CNIC No. / NTN [Number], [Address]
   (holding [Share%]% / [Number] shares — "SHAREHOLDER 1")
2. [Shareholder 2 Name / Company], CNIC No. / NTN [Number], [Address]
   (holding [Share%]% / [Number] shares — "SHAREHOLDER 2")
(collectively referred to as "SHAREHOLDERS" in respect of [Company Name] (Private) Limited)

NOW THEREFORE THE SHAREHOLDERS AGREE AS UNDER:

1. BOARD COMPOSITION: The Board shall consist of [Number] directors. Shareholder 1 shall appoint [Number] directors and Shareholder 2 shall appoint [Number] directors.
2. SHARE TRANSFER: No shareholder shall transfer shares to a third party without first offering them to other shareholders (right of first refusal).
3. DIVIDEND POLICY: Dividends shall be declared at [Frequency] if net profits exceed PKR [Threshold]/-.
4. DEADLOCK: In case of deadlock, the matter shall be referred to an independent mediator / arbitrator.
5. NON-COMPETE: No shareholder shall engage in any competing business for [Duration] after exit.
6. CONFIDENTIALITY: All shareholders shall maintain confidentiality of proprietary information.
7. DISPUTE RESOLUTION: Disputes shall be resolved through arbitration under the Arbitration Act 1940.

[SHAREHOLDER 1]                        [SHAREHOLDER 2]
[Name / Company]                       [Name / Company]
CNIC / NTN: ___________               CNIC / NTN: ___________

Witness 1: ___________________   Witness 2: ___________________

INSTRUCTIONS:
- Title: SHAREHOLDERS AGREEMENT (centered, bold)
- List all shareholders with shareholding percentages
- Numbered clauses: Board, Share Transfer, Dividends, Deadlock, Non-compete, Confidentiality, Dispute Resolution
- Right of first refusal clause
- All shareholders sign
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
