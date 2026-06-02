import { TemplateDefinition } from "../types";

export const withholdingCertificate: TemplateDefinition = {
  category: "tax-law",
  subType: "withholding-certificate",
  name: "Withholding Tax Exemption Certificate / ود ہولڈنگ ٹیکس استثنیٰ سرٹیفکیٹ",
  nameUrdu: "ود ہولڈنگ ٹیکس استثنیٰ سرٹیفکیٹ",
  description: "Application for withholding tax exemption certificate under the Income Tax Ordinance 2001",
  descriptionUrdu: "انکم ٹیکس آرڈیننس 2001 کے تحت ود ہولڈنگ ٹیکس استثنیٰ سرٹیفکیٹ کی درخواست",
  icon: "Award",
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
      name: "ntn",
      label: "National Tax Number (NTN)",
      labelUrdu: "نیشنل ٹیکس نمبر (NTN)",
      type: "text",
      required: true,
      group: "Applicant Details",
    },
    {
      name: "incomeSource",
      label: "Source of Income",
      labelUrdu: "آمدنی کا ذریعہ",
      type: "textarea",
      required: true,
      group: "Income Details",
    },
    {
      name: "taxAlreadyPaid",
      label: "Tax Already Paid / Deducted (PKR)",
      labelUrdu: "پہلے سے ادا شدہ / کٹوتی شدہ ٹیکس (روپے)",
      type: "number",
      required: true,
      group: "Income Details",
    },
    {
      name: "exemptionReason",
      label: "Reason for Exemption",
      labelUrdu: "استثنیٰ کی وجہ",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Exemption Details",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a Withholding Tax Exemption Certificate Application in {{language}}.

APPLICANT:
- Name: {{applicantName}}
- Address: {{applicantAddress}}
- NTN: {{ntn}}

INCOME DETAILS:
- Source: {{incomeSource}}
- Tax Already Paid: PKR {{taxAlreadyPaid}}

EXEMPTION DETAILS:
- Reason: {{exemptionReason}}

Generate a complete Withholding Tax Exemption Certificate Application under the Income Tax Ordinance 2001 as applicable in Pakistan.
Include proper CIR heading, applicant details, income source details, tax already paid/deducted, legal basis for reduced/nil withREFERENCE FORMAT - Follow this exact Pakistani legal format:

APPLICATION FOR WITHHOLDING TAX CERTIFICATE / REDUCED WITHHOLDING RATE

To,
The Commissioner Inland Revenue,
Federal Board of Revenue, [RTO / LTO],
[City].

SUBJECT: Application for Withholding Certificate Under Section 159, Income Tax Ordinance 2001

[Applicant Name / Company], NTN: [NTN], CNIC No. [CNIC], Address: [Address]

With due respect it is submitted that:

1. That the Applicant is a taxpayer registered with FBR bearing NTN [Number] and has been filing returns regularly.
2. That the Applicant receives [Payments - contract payments / rent / services / profit on debt] on which withholding tax is being deducted at [Current Rate]% under Section [153/151/154/231A/236].
3. That the Applicant's actual tax liability is lower / nil as per the following calculation: [Tax Calculation].
4. That the Applicant is entitled to a withholding certificate / reduced rate under Section 159 of the Income Tax Ordinance 2001.

ENCLOSED DOCUMENTS:
- Last 3 years' tax returns
- NTN Certificate
- Latest tax payment receipts
- Audit report (if applicable)

Declaration: I declare that the above information is true and correct.

Applicant: ___________
NTN: ___________
Date: ___________

INSTRUCTIONS:
- Heading: APPLICATION FOR WITHHOLDING CERTIFICATE (centered, bold)
- Reference Section 159 Income Tax Ordinance 2001
- Include withholding sections being applied (153/151/154 etc.)
- Include current rate and basis for reduction/exemption
- Include documents checklist and declaration
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
