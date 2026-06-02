import { TemplateDefinition } from "../types";

export const propertyAgreement: TemplateDefinition = {
  category: "agreement",
  subType: "property-agreement",
  name: "Property Purchase Agreement (Byana)",
  nameUrdu: "بیعانہ نامہ",
  description: "Advance/token money agreement before final sale deed",
  descriptionUrdu: "حتمی بیع نامے سے پہلے بیعانہ / ٹوکن رقم کا معاہدہ",
  icon: "Landmark",
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
      name: "sellerFatherName",
      label: "Seller's Father's Name",
      labelUrdu: "فروخت کنندہ کے والد کا نام",
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
      name: "buyerFatherName",
      label: "Buyer's Father's Name",
      labelUrdu: "خریدار کے والد کا نام",
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
      name: "propertyDescription",
      label: "Property Description",
      labelUrdu: "جائیداد کی تفصیل",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Property Details",
    },
    {
      name: "totalPrice",
      label: "Total Agreed Price (PKR)",
      labelUrdu: "کل طے شدہ قیمت (روپے)",
      type: "number",
      required: true,
      group: "Financial Details",
    },
    {
      name: "byanaAmount",
      label: "Byana / Advance Amount (PKR)",
      labelUrdu: "بیعانہ / پیشگی رقم (روپے)",
      type: "number",
      required: true,
      group: "Financial Details",
    },
    {
      name: "remainingPaymentDate",
      label: "Remaining Payment Due Date",
      labelUrdu: "بقایا رقم کی ادائیگی کی تاریخ",
      type: "date",
      required: true,
      group: "Financial Details",
    },
    {
      name: "conditions",
      label: "Conditions",
      labelUrdu: "شرائط",
      type: "textarea",
      required: false,
      aiSuggestable: true,
      group: "Terms",
    },
    {
      name: "forfeitureClause",
      label: "Forfeiture Clause (if buyer defaults)",
      labelUrdu: "ضبطی کی شق (اگر خریدار معاہدہ توڑے)",
      type: "textarea",
      required: false,
      aiSuggestable: true,
      group: "Terms",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a Property Purchase Agreement (Byana Nama) in {{language}}.

SELLER:
- Name: {{sellerName}}
- Father's Name: {{sellerFatherName}}
- CNIC: {{sellerCnic}}
- Address: {{sellerAddress}}

BUYER:
- Name: {{buyerName}}
- Father's Name: {{buyerFatherName}}
- CNIC: {{buyerCnic}}
- Address: {{buyerAddress}}

PROPERTY: {{propertyDescription}}

FINANCIAL:
- Total Price: PKR {{totalPrice}}
- Byana/Advance: PKR {{byanaAmount}}
- Remaining Payment Date: {{remainingPaymentDate}}

CONDITIONS: {{conditions}}
FORFEITURE CLAUSE: {{forfeitureClause}}

Generate a complete Byana Nama / Property Purchase Agreement following REFERENCE FORMAT - Follow this exact Pakistani legal format:

PROPERTY AGREEMENT TO SELL / BAYANA NAMA

This Agreement to Sell is made and executed on this ___ day of ___________, 20___ at [City].

BETWEEN:

[Seller Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
(hereinafter called the "SELLER / VENDOR")

AND

[Buyer Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
(hereinafter called the "BUYER / VENDEE")

PROPERTY DETAILS:
- Plot / House No.: [Number]
- Street / Colony: [Street/Colony]
- Tehsil: [Tehsil], District: [District]
- Total Area: [Area]

NOW THEREFORE BOTH PARTIES AGREE AS UNDER:

1. That the Seller agrees to sell the above-described property to the Buyer for a total sale price of PKR [Total Price]/-
2. That an advance / token money of PKR [Advance Amount]/- has been received by the Seller at the time of this agreement, receipt of which is hereby acknowledged.
3. That the remaining balance of PKR [Balance Amount]/- shall be paid by the Buyer on or before [Final Payment Date].
4. That on receipt of the full sale price, the Seller shall execute the Sale Deed in favor of the Buyer.
5. That if the Buyer fails to pay the balance amount by the agreed date, the advance shall stand forfeited.
6. That if the Seller refuses to sell, he/she shall refund double the advance amount to the Buyer.
7. That the property is free from all encumbrances, loans, litigation, and disputes.

SELLER                                  BUYER
[Name]                                  [Name]
CNIC: ___________                       CNIC: ___________

Witness 1: ___________________   Witness 2: ___________________

INSTRUCTIONS:
- Title: AGREEMENT TO SELL / BAYANA NAMA (centered, bold)
- BETWEEN / AND party structure
- PROPERTY DETAILS section
- Numbered "That..." clauses
- Include forfeiture and double refund clauses
- Both signatures at bottom
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
