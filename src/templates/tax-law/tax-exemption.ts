import { TemplateDefinition } from "../types";

export const taxExemption: TemplateDefinition = {
  category: "tax-law",
  subType: "tax-exemption",
  name: "Tax Exemption Application / ٹیکس استثنیٰ کی درخواست",
  nameUrdu: "ٹیکس استثنیٰ کی درخواست",
  description: "Application for tax exemption under the Income Tax Ordinance 2001",
  descriptionUrdu: "انکم ٹیکس آرڈیننس 2001 کے تحت ٹیکس استثنیٰ کی درخواست",
  icon: "BadgePercent",
  formFields: [
    {
      name: "applicantName",
      label: "Applicant's Name",
      labelUrdu: "درخواست گزار کا نام",
      type: "text",
      required: true,
      group: "Applicant Details",
    },
    {
      name: "applicantAddress",
      label: "Applicant's Address",
      labelUrdu: "درخواست گزار کا پتہ",
      type: "address",
      required: true,
      group: "Applicant Details",
    },
    {
      name: "applicantNtn",
      label: "National Tax Number (NTN)",
      labelUrdu: "نیشنل ٹیکس نمبر (NTN)",
      type: "text",
      required: true,
      group: "Applicant Details",
    },
    {
      name: "exemptionType",
      label: "Type of Exemption",
      labelUrdu: "استثنیٰ کی قسم",
      type: "select",
      required: true,
      options: [
        { value: "charitable", label: "Charitable / Non-Profit (Section 100C)", labelUrdu: "فلاحی / غیر منافع بخش (دفعہ 100C)" },
        { value: "agricultural", label: "Agricultural Income", labelUrdu: "زرعی آمدنی" },
        { value: "pension", label: "Pension / Gratuity", labelUrdu: "پنشن / گریجویٹی" },
        { value: "special-zone", label: "Special Economic Zone", labelUrdu: "خصوصی اقتصادی زون" },
        { value: "other", label: "Other Exemption", labelUrdu: "دیگر استثنیٰ" },
      ],
      group: "Exemption Details",
    },
    {
      name: "incomeDetails",
      label: "Income Details",
      labelUrdu: "آمدنی کی تفصیلات",
      type: "textarea",
      required: true,
      group: "Exemption Details",
    },
    {
      name: "grounds",
      label: "Grounds for Exemption",
      labelUrdu: "استثنیٰ کی بنیادیں",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Exemption Details",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a Tax Exemption Application in {{language}}.

APPLICANT:
- Name: {{applicantName}}
- Address: {{applicantAddress}}
- NTN: {{applicantNtn}}

EXEMPTION DETAILS:
- Type: {{exemptionType}}
- Income Details: {{incomeDetails}}
- Grounds: {{grounds}}

Generate a complete Tax Exemption Application under the Income Tax Ordinance 2001 as applicable in Pakistan.
Include proper FBR/CIR heading, applicant details,REFERENCE FORMAT - Follow this exact Pakistani legal format:

APPLICATION FOR TAX EXEMPTION / REDUCED RATE

To,
The Commissioner Inland Revenue,
Federal Board of Revenue, [RTO / LTO],
[City].

SUBJECT: Application for Tax Exemption Under Section [___ / 2nd Schedule], Income Tax Ordinance 2001

[Applicant Name / Organization], NTN: [NTN], CNIC No. [CNIC], Address: [Address]

With due respect it is submitted that:

1. That the Applicant is [a charitable organization / educational institution / individual pensioner / other] registered with [Registration Authority].
2. That the Applicant is entitled to tax exemption / reduced rate under [Section ___ / Second Schedule Part I Clause ___] of the Income Tax Ordinance 2001.
3. That the basis for claiming exemption is: [Description - charitable activities / government employee pension / eligible entity under law].
4. That all conditions required for the exemption have been / are being fulfilled.

ENCLOSED DOCUMENTS:
- Certificate of Registration / Trust Deed
- Audited Accounts
- CNIC / NTN
- Other supporting documents

Declaration: I declare that the information provided is true and correct.

Applicant: ___________
NTN: ___________
Date: ___________

INSTRUCTIONS:
- Heading: APPLICATION FOR TAX EXEMPTION (centered, bold)
- Reference specific section of Income Tax Ordinance 2001 or Second Schedule
- Include legal basis for exemption
- Include documents checklist
- Include declaration
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
