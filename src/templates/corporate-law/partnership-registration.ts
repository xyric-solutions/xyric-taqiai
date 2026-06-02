import { TemplateDefinition } from "../types";

export const partnershipRegistration: TemplateDefinition = {
  category: "corporate-law",
  subType: "partnership-registration",
  name: "Partnership Firm Registration / شراکت داری فرم کی رجسٹریشن",
  nameUrdu: "شراکت داری فرم کی رجسٹریشن",
  description: "Partnership firm registration under the Partnership Act 1932",
  descriptionUrdu: "پارٹنرشپ ایکٹ 1932 کے تحت شراکت داری فرم کی رجسٹریشن",
  icon: "Users",
  formFields: [
    {
      name: "firmName",
      label: "Firm Name",
      labelUrdu: "فرم کا نام",
      type: "text",
      required: true,
      group: "Firm Details",
    },
    {
      name: "firmAddress",
      label: "Principal Place of Business",
      labelUrdu: "کاروبار کا بنیادی مقام",
      type: "address",
      required: true,
      group: "Firm Details",
    },
    {
      name: "businessNature",
      label: "Nature of Business",
      labelUrdu: "کاروبار کی نوعیت",
      type: "textarea",
      required: true,
      group: "Firm Details",
    },
    {
      name: "partnersDetails",
      label: "Partners Details (Names, CNICs, Addresses, Contributions)",
      labelUrdu: "شراکت داروں کی تفصیلات (نام، شناختی کارڈ، پتے، سرمایہ)",
      type: "textarea",
      required: true,
      group: "Partners",
    },
    {
      name: "totalCapital",
      label: "Total Capital (PKR)",
      labelUrdu: "کل سرمایہ (روپے)",
      type: "number",
      required: true,
      group: "Financial Details",
    },
    {
      name: "profitRatio",
      label: "Profit/Loss Sharing Ratio",
      labelUrdu: "نفع/نقصان کی تقسیم کا تناسب",
      type: "text",
      required: true,
      group: "Financial Details",
    },
    {
      name: "commencementDate",
      label: "Date of Commencement",
      labelUrdu: "آغاز کی تاریخ",
      type: "date",
      required: true,
      group: "Firm Details",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate Partnership Firm Registration Documents in {{language}}.

FIRM DETAILS:
- Name: {{firmName}}
- Address: {{firmAddress}}
- Business Nature: {{businessNature}}
- Commencement Date: {{commencementDate}}

PARTNERS:
{{partnersDetails}}

FINANCIAL DETAILS:
- Total Capital: PKR {{totalCapital}}
- Profit/Loss Ratio: {{profitRatio}}

Generate complete Partnership Firm Registration Documents under the Partnership Act 1932 as applicable in Pakistan.
Include Partnership Deed with all essential clauses (caREFERENCE FORMAT - Follow this exact Pakistani legal format:

PARTNERSHIP DEED

This Partnership Deed is made and executed on this ___ day of ___________, 20___ at [City].

BETWEEN:

1. [Partner 1 Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address] — First Partner
2. [Partner 2 Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address] — Second Partner
(hereinafter collectively called the "PARTNERS")

WHEREAS the above mentioned partners have mutually agreed to form a partnership for carrying on the business of [Business Nature].

NOW THEREFORE THE PARTNERS AGREE AS UNDER:

1. NAME AND PLACE: The Partnership shall be carried on under the name of [Firm Name] at [Principal Place of Business].
2. CAPITAL: The total capital shall be PKR [Total Capital]/- contributed as: [Partner 1]: PKR [Amount] ([Share%]%), [Partner 2]: PKR [Amount] ([Share%]%).
3. PROFIT AND LOSS: [Partner 1]: [Share1]%  [Partner 2]: [Share2]%
4. MANAGEMENT: The business shall be managed by [Managing Partner Name].
5. BANK ACCOUNT: A joint bank account shall be maintained in the name of the firm.
6. ACCOUNTS: Books of accounts shall be maintained and audited annually.
7. DURATION: The partnership shall commence from [Date] and continue unless dissolved.
8. DISSOLUTION: The partnership may be dissolved by mutual written consent or as per the Partnership Act 1932.

[PARTNER 1 NAME]                       [PARTNER 2 NAME]
CNIC: ___________                      CNIC: ___________

Witness 1: ___________________   Witness 2: ___________________

INSTRUCTIONS:
- Title: PARTNERSHIP DEED (centered, bold)
- List all partners with CNIC
- WHEREAS clause
- Numbered clauses: Name, Capital, Profit/Loss, Management, Bank, Accounts, Duration, Dissolution
- Reference Partnership Act 1932
- All partners sign
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
