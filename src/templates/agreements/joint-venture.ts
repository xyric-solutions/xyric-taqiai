import { TemplateDefinition } from "../types";

export const jointVenture: TemplateDefinition = {
  category: "agreement",
  subType: "joint-venture",
  name: "Joint Venture Agreement",
  nameUrdu: "مشترکہ کاروبار معاہدہ",
  description: "Joint venture agreement between two parties",
  descriptionUrdu: "دو فریقین کے درمیان مشترکہ کاروبار کا معاہدہ",
  icon: "Users",
  formFields: [
    {
      name: "party1Name",
      label: "Party 1 Name",
      labelUrdu: "فریق اول کا نام",
      type: "text",
      required: true,
      group: "Party 1 Details",
    },
    {
      name: "party1Cnic",
      label: "Party 1 CNIC",
      labelUrdu: "فریق اول کا شناختی کارڈ",
      type: "cnic",
      required: true,
      group: "Party 1 Details",
    },
    {
      name: "party1Address",
      label: "Party 1 Address",
      labelUrdu: "فریق اول کا پتہ",
      type: "address",
      required: true,
      group: "Party 1 Details",
    },
    {
      name: "party1Capital",
      label: "Party 1 Capital Contribution (PKR)",
      labelUrdu: "فریق اول کا سرمایہ (روپے)",
      type: "number",
      required: true,
      group: "Party 1 Details",
    },
    {
      name: "party2Name",
      label: "Party 2 Name",
      labelUrdu: "فریق دوم کا نام",
      type: "text",
      required: true,
      group: "Party 2 Details",
    },
    {
      name: "party2Cnic",
      label: "Party 2 CNIC",
      labelUrdu: "فریق دوم کا شناختی کارڈ",
      type: "cnic",
      required: true,
      group: "Party 2 Details",
    },
    {
      name: "party2Address",
      label: "Party 2 Address",
      labelUrdu: "فریق دوم کا پتہ",
      type: "address",
      required: true,
      group: "Party 2 Details",
    },
    {
      name: "party2Capital",
      label: "Party 2 Capital Contribution (PKR)",
      labelUrdu: "فریق دوم کا سرمایہ (روپے)",
      type: "number",
      required: true,
      group: "Party 2 Details",
    },
    {
      name: "venturePurpose",
      label: "Purpose of Joint Venture",
      labelUrdu: "مشترکہ کاروبار کا مقصد",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Venture Details",
    },
    {
      name: "profitLossRatio",
      label: "Profit/Loss Sharing Ratio (e.g., 60:40)",
      labelUrdu: "نفع/نقصان کی تقسیم کا تناسب",
      type: "text",
      required: true,
      group: "Venture Details",
    },
    {
      name: "managementResponsibilities",
      label: "Management Responsibilities",
      labelUrdu: "انتظامی ذمہ داریاں",
      type: "textarea",
      required: false,
      aiSuggestable: true,
      group: "Venture Details",
    },
    {
      name: "duration",
      label: "Duration (years)",
      labelUrdu: "مدت (سال)",
      type: "number",
      required: true,
      group: "Venture Details",
    },
    {
      name: "exitClause",
      label: "Exit Clause",
      labelUrdu: "اخراج کی شق",
      type: "textarea",
      required: false,
      aiSuggestable: true,
      group: "Terms",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a Joint Venture Agreement in {{language}}.

PARTY 1:
- Name: {{party1Name}}
- CNIC: {{party1Cnic}}
- Address: {{party1Address}}
- Capital Contribution: PKR {{party1Capital}}

PARTY 2:
- Name: {{party2Name}}
- CNIC: {{party2Cnic}}
- Address: {{party2Address}}
- Capital Contribution: PKR {{party2Capital}}

VENTURE DETAILS:
- Purpose: {{venturePurpose}}
- Profit/Loss Ratio: {{profitLossRatio}}
- Management: {{managementResponsibilities}}
- Duration: {{duration}} years

EXIT CLAUSE: {{exitClause}}

Generate a complete Joint Venture Agreement following PaREFERENCE FORMAT - Follow this exact Pakistani legal format:

JOINT VENTURE AGREEMENT

This Joint Venture Agreement is made and executed on this ___ day of ___________, 20___ at [City].

BETWEEN:

[First Venturer Name / Company], CNIC No. / NTN [Number], [Address]
(hereinafter called the "FIRST VENTURER")

AND

[Second Venturer Name / Company], CNIC No. / NTN [Number], [Address]
(hereinafter called the "SECOND VENTURER")

NOW THEREFORE BOTH PARTIES AGREE AS UNDER:

1. That the parties hereby agree to form a Joint Venture for the purpose of [JV Purpose] under the name [JV Name] (if any).
2. That the capital contribution shall be: First Venturer: PKR [Amount] ([Share%]%), Second Venturer: PKR [Amount] ([Share%]%).
3. That profits and losses shall be shared in the ratio of [Ratio] between the First and Second Venturers.
4. That the management of the joint venture shall be handled by [Managing Partner / Joint Committee].
5. That the accounts shall be maintained jointly and audited [annually / as agreed].
6. That the Joint Venture shall continue for [Duration] years from the date of this agreement.
7. That any dispute shall be resolved through arbitration under the Arbitration Act 1940.

FIRST VENTURER                          SECOND VENTURER
[Name / Firm]                           [Name / Firm]
CNIC / NTN: ___________                 CNIC / NTN: ___________

Witness 1: ___________________   Witness 2: ___________________

INSTRUCTIONS:
- Title: JOINT VENTURE AGREEMENT (centered, bold)
- BETWEEN / AND party structure
- Numbered "That..." clauses
- Include capital contributions, profit/loss ratio, management, duration
- Both signatures at bottom
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
