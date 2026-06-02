import { TemplateDefinition } from "../types";

export const saleDeed: TemplateDefinition = {
  category: "agreement",
  subType: "sale-deed",
  name: "Sale Deed / Agreement to Sell",
  nameUrdu: "بیع نامہ",
  description: "Agreement for sale of property or goods",
  descriptionUrdu: "جائیداد یا سامان کی فروخت کا معاہدہ",
  icon: "FileSignature",
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
      name: "propertyAddress",
      label: "Property Location/Address",
      labelUrdu: "جائیداد کا مقام/پتہ",
      type: "address",
      required: true,
      group: "Property Details",
    },
    {
      name: "salePrice",
      label: "Sale Price (PKR)",
      labelUrdu: "فروخت کی قیمت (روپے)",
      type: "number",
      required: true,
      group: "Financial Details",
    },
    {
      name: "advancePayment",
      label: "Advance Payment (PKR)",
      labelUrdu: "پیشگی رقم (روپے)",
      type: "number",
      required: false,
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
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a Sale Deed / Agreement to Sell in {{language}}.

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

PROPERTY:
- Description: {{propertyDescription}}
- Location: {{propertyAddress}}

FINANCIALS:
- Sale Price: PKR {{salePrice}}
- Advance: PKR {{advancePayment}}
- Payment Terms: {{paymentTerms}}

REFERENCE FORMAT — Follow this exact Pakistani legal format:

AGREEMENT TO SELL

This Agreement to Sell is made and executed at [City] on this ___ day of ___________, 20___.

BETWEEN:

[Seller Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
(hereinafter called the "SELLER" / Vendor of the First Part)

AND

[Buyer Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
(hereinafter called the "BUYER" / Vendee of the Second Part)

WHEREAS the Seller is the lawful owner of [Property Description] situated at [Property Address].

NOW THEREFORE THESE PRESENTS WITNESSETH:

1. That the Seller agrees to sell and the Buyer agrees to purchase the above described property for a total sale consideration of PKR [Sale Price]/- ([Amount in words] only).
2. That the Buyer has paid an advance amount of PKR [Advance Amount]/- ([Amount in words] only) to the Seller, receipt of which is hereby acknowledged.
3. That the remaining balance of PKR [Balance]/- ([Amount in words] only) shall be paid at the time of execution of the final Sale Deed.
4. That the Seller warrants that the property is free from all encumbrances, charges, mortgages, liabilities and legal disputes of any nature whatsoever.
5. That the Seller shall deliver vacant possession of the said property to the Buyer upon receipt of full payment.
6. That in case the Seller backs out of this agreement, he/she shall refund double the advance amount paid.
7. That in case the Buyer backs out, the advance paid shall be forfeited.
8. That the Seller shall bear all costs of mutation, transfer taxes and documentation charges as per law.

SELLER                                    BUYER
[Name]                                    [Name]
CNIC: ___________                         CNIC: ___________

Witness 1: ___________________     Witness 2: ___________________
CNIC: ___________                  CNIC: ___________

INSTRUCTIONS:
- Title: AGREEMENT TO SELL (centered, bold)
- BETWEEN / AND party structure with hereinafter clauses
- WHEREAS clause for property ownership
- Numbered clauses starting with "That..."
- Include advance, balance, forfeiture clauses
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
