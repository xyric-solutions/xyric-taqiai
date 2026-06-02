import { TemplateDefinition } from "../types";

export const businessSale: TemplateDefinition = {
  category: "agreement",
  subType: "business-sale",
  name: "Business Sale Agreement",
  nameUrdu: "کاروبار فروخت نامہ",
  description: "Agreement for sale of a business",
  descriptionUrdu: "کاروبار کی فروخت کا معاہدہ",
  icon: "Building",
  formFields: [
    {
      name: "sellerName",
      label: "Seller Name",
      labelUrdu: "فروخت کنندہ کا نام",
      type: "text",
      required: true,
      group: "Seller Details",
    },
    {
      name: "sellerCnic",
      label: "Seller CNIC",
      labelUrdu: "فروخت کنندہ کا شناختی کارڈ",
      type: "cnic",
      required: true,
      group: "Seller Details",
    },
    {
      name: "sellerAddress",
      label: "Seller Address",
      labelUrdu: "فروخت کنندہ کا پتہ",
      type: "address",
      required: true,
      group: "Seller Details",
    },
    {
      name: "buyerName",
      label: "Buyer Name",
      labelUrdu: "خریدار کا نام",
      type: "text",
      required: true,
      group: "Buyer Details",
    },
    {
      name: "buyerCnic",
      label: "Buyer CNIC",
      labelUrdu: "خریدار کا شناختی کارڈ",
      type: "cnic",
      required: true,
      group: "Buyer Details",
    },
    {
      name: "buyerAddress",
      label: "Buyer Address",
      labelUrdu: "خریدار کا پتہ",
      type: "address",
      required: true,
      group: "Buyer Details",
    },
    {
      name: "businessName",
      label: "Business Name",
      labelUrdu: "کاروبار کا نام",
      type: "text",
      required: true,
      group: "Business Details",
    },
    {
      name: "businessType",
      label: "Business Type / Nature",
      labelUrdu: "کاروبار کی قسم / نوعیت",
      type: "text",
      required: true,
      group: "Business Details",
    },
    {
      name: "businessAddress",
      label: "Business Address",
      labelUrdu: "کاروبار کا پتہ",
      type: "address",
      required: true,
      group: "Business Details",
    },
    {
      name: "assetsIncluded",
      label: "Assets Included in Sale",
      labelUrdu: "فروخت میں شامل اثاثے",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Business Details",
    },
    {
      name: "liabilities",
      label: "Liabilities (if any)",
      labelUrdu: "واجبات (اگر کوئی ہوں)",
      type: "textarea",
      required: false,
      aiSuggestable: true,
      group: "Business Details",
    },
    {
      name: "goodwillAmount",
      label: "Goodwill Amount (PKR)",
      labelUrdu: "گڈ ول کی رقم (روپے)",
      type: "number",
      required: false,
      group: "Financial Details",
    },
    {
      name: "salePrice",
      label: "Total Sale Price (PKR)",
      labelUrdu: "کل فروخت کی قیمت (روپے)",
      type: "number",
      required: true,
      group: "Financial Details",
    },
    {
      name: "paymentTerms",
      label: "Payment Terms",
      labelUrdu: "ادائیگی کی شرائط",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Financial Details",
    },
    {
      name: "transitionPeriod",
      label: "Transition Period (days)",
      labelUrdu: "منتقلی کی مدت (دن)",
      type: "number",
      required: false,
      group: "Terms",
    },
    {
      name: "nonCompeteClause",
      label: "Non-Compete Clause",
      labelUrdu: "عدم مسابقت کی شق",
      type: "textarea",
      required: false,
      aiSuggestable: true,
      group: "Terms",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a Business Sale Agreement in {{language}}.

SELLER:
- Name: {{sellerName}}
- CNIC: {{sellerCnic}}
- Address: {{sellerAddress}}

BUYER:
- Name: {{buyerName}}
- CNIC: {{buyerCnic}}
- Address: {{buyerAddress}}

BUSINESS:
- Name: {{businessName}}
- Type: {{businessType}}
- Address: {{businessAddress}}
- Assets: {{assetsIncluded}}
- Liabilities: {{liabilities}}

FINANCIAL:
- Goodwill: PKR {{goodwillAmount}}
- Sale Price: PKR {{salePrice}}
- Payment Terms: {{paymentTerms}}

TERMS:
- Transition Period: {{transitionPeriod}} days
- Non-Compete: {{nonCompeteClause}}

Generate a complete Business Sale Agreement following Pakistani law formatREFERENCE FORMAT - Follow this exact Pakistani legal format:

BUSINESS SALE AGREEMENT

This Business Sale Agreement is made and executed on this ___ day of ___________, 20___ at [City].

BETWEEN:

[Seller Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
(hereinafter called the "SELLER")

AND

[Buyer Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
(hereinafter called the "BUYER")

BUSINESS DETAILS:
- Business Name: [Business Name]
- Business Address: [Business Address]
- NTN No.: [NTN Number]
- Nature of Business: [Nature]

NOW THEREFORE BOTH PARTIES AGREE AS UNDER:

1. That the Seller hereby sells, transfers, and assigns the above-described business along with all its assets, goodwill, inventory, and equipment to the Buyer for a total consideration of PKR [Amount]/-.
2. That an advance of PKR [Advance Amount]/- has been received and the remaining balance shall be paid by [Date].
3. That the Seller confirms the business is free from all liabilities, loans, and encumbrances except as disclosed.
4. That the Seller shall provide all books of accounts, licenses, and documents to the Buyer on completion.
5. That the Seller shall not open a competing business within [Radius] km / [Duration] years from the date of this agreement.
6. That any dispute arising from this agreement shall be resolved through [arbitration / courts at City].

SELLER                                  BUYER
[Name]                                  [Name]
CNIC: ___________                       CNIC: ___________

Witness 1: ___________________   Witness 2: ___________________

INSTRUCTIONS:
- Title: BUSINESS SALE AGREEMENT (centered, bold)
- BETWEEN / AND party structure
- BUSINESS DETAILS section
- Numbered "That..." clauses
- Include total consideration, non-compete clause
- Both signatures at bottom
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
