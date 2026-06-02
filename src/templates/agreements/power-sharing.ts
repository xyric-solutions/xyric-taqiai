import { TemplateDefinition } from "../types";

export const powerSharing: TemplateDefinition = {
  category: "agreement",
  subType: "power-sharing",
  name: "Profit/Power Sharing Agreement (Mudarabah)",
  nameUrdu: "منافع بانٹنے کا معاہدہ",
  description: "Mudarabah-style profit sharing agreement",
  descriptionUrdu: "مضاربہ طرز کا منافع بانٹنے کا معاہدہ",
  icon: "PieChart",
  formFields: [
    {
      name: "investorName",
      label: "Investor (Rab ul Maal) Name",
      labelUrdu: "سرمایہ کار (رب المال) کا نام",
      type: "text",
      required: true,
      group: "Investor Details",
    },
    {
      name: "investorCnic",
      label: "Investor CNIC",
      labelUrdu: "سرمایہ کار کا شناختی کارڈ",
      type: "cnic",
      required: true,
      group: "Investor Details",
    },
    {
      name: "investorAddress",
      label: "Investor Address",
      labelUrdu: "سرمایہ کار کا پتہ",
      type: "address",
      required: true,
      group: "Investor Details",
    },
    {
      name: "workingPartnerName",
      label: "Working Partner (Mudarib) Name",
      labelUrdu: "کام کرنے والا شراکت دار (مضارب) کا نام",
      type: "text",
      required: true,
      group: "Working Partner Details",
    },
    {
      name: "workingPartnerCnic",
      label: "Working Partner CNIC",
      labelUrdu: "مضارب کا شناختی کارڈ",
      type: "cnic",
      required: true,
      group: "Working Partner Details",
    },
    {
      name: "workingPartnerAddress",
      label: "Working Partner Address",
      labelUrdu: "مضارب کا پتہ",
      type: "address",
      required: true,
      group: "Working Partner Details",
    },
    {
      name: "investmentAmount",
      label: "Investment Amount (PKR)",
      labelUrdu: "سرمایہ کاری کی رقم (روپے)",
      type: "number",
      required: true,
      group: "Investment Details",
    },
    {
      name: "businessType",
      label: "Type of Business",
      labelUrdu: "کاروبار کی قسم",
      type: "text",
      required: true,
      group: "Investment Details",
    },
    {
      name: "profitSharingRatio",
      label: "Profit Sharing Ratio (e.g., 60:40)",
      labelUrdu: "منافع کی تقسیم کا تناسب",
      type: "text",
      required: true,
      group: "Investment Details",
    },
    {
      name: "lossBearingTerms",
      label: "Loss Bearing Terms",
      labelUrdu: "نقصان برداشت کرنے کی شرائط",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Investment Details",
    },
    {
      name: "duration",
      label: "Duration (months)",
      labelUrdu: "مدت (مہینے)",
      type: "number",
      required: true,
      group: "Investment Details",
    },
    {
      name: "reportingRequirements",
      label: "Reporting Requirements",
      labelUrdu: "رپورٹنگ کی ضروریات",
      type: "textarea",
      required: false,
      aiSuggestable: true,
      group: "Terms",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a Profit/Power Sharing Agreement (Mudarabah) in {{language}}.

INVESTOR (RAB UL MAAL):
- Name: {{investorName}}
- CNIC: {{investorCnic}}
- Address: {{investorAddress}}

WORKING PARTNER (MUDARIB):
- Name: {{workingPartnerName}}
- CNIC: {{workingPartnerCnic}}
- Address: {{workingPartnerAddress}}

INVESTMENT:
- Amount: PKR {{investmentAmount}}
- Business Type: {{businessType}}
- Profit Sharing: {{profitSharingRatio}}
- Loss Bearing: {{lossBearingTerms}}
- Duration: {{duration}} months

REPORTING: {{reportingRequirements}}

Generate a complete Mudarabah-style Profit Sharing Agreement following Pakistani law and Islamic finance principlREFERENCE FORMAT - Follow this exact Pakistani legal format:

POWER SHARING / MANAGEMENT AGREEMENT

This Power Sharing Agreement is made and executed on this ___ day of ___________, 20___ at [City].

BETWEEN:

[First Party Name / Company] CNIC No. / NTN [Number], [Address]
(hereinafter called the "FIRST PARTY")

AND

[Second Party Name / Company], CNIC No. / NTN [Number], [Address]
(hereinafter called the "SECOND PARTY")

NOW THEREFORE BOTH PARTIES AGREE AS UNDER:

1. That the parties agree to share management and decision-making powers regarding [Subject - company / property / business] as specified herein.
2. That [First Party] shall be responsible for [Responsibilities 1].
3. That [Second Party] shall be responsible for [Responsibilities 2].
4. That major decisions requiring amounts exceeding PKR [Threshold]/- shall require mutual written consent.
5. That profits and losses from the said [business / property] shall be distributed in the ratio of [Ratio].
6. That accounts shall be maintained and reviewed [monthly / quarterly] by both parties.
7. That any dispute shall be resolved through arbitration under Pakistani law.

FIRST PARTY                             SECOND PARTY
[Name / Company]                        [Name / Company]
CNIC / NTN: ___________                 CNIC / NTN: ___________

Witness 1: ___________________   Witness 2: ___________________

INSTRUCTIONS:
- Title: POWER SHARING / MANAGEMENT AGREEMENT (centered, bold)
- BETWEEN / AND party structure
- Numbered "That..." clauses
- Include responsibilities, profit ratio, decision threshold
- Both signatures at bottom
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
