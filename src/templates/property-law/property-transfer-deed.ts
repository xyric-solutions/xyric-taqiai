import { TemplateDefinition } from "../types";

export const propertyTransferDeed: TemplateDefinition = {
  category: "property-law",
  subType: "property-transfer-deed",
  name: "Property Sale / Transfer Deed / فروخت نامہ / انتقال نامہ",
  nameUrdu: "فروخت نامہ / انتقال نامہ",
  description: "Property sale/transfer deed under the Transfer of Property Act 1882 and Registration Act 1908",
  descriptionUrdu: "ٹرانسفر آف پراپرٹی ایکٹ 1882 اور رجسٹریشن ایکٹ 1908 کے تحت فروخت نامہ / انتقال نامہ",
  icon: "HandShake",
  formFields: [
    {
      name: "sellerName",
      label: "Seller's Name",
      labelUrdu: "فروخت کنندہ کا نام",
      type: "text",
      required: true,
      group: "Seller Details",
    },
    {
      name: "sellerCnic",
      label: "Seller's CNIC",
      labelUrdu: "فروخت کنندہ کا شناختی کارڈ",
      type: "cnic",
      required: true,
      group: "Seller Details",
    },
    {
      name: "sellerAddress",
      label: "Seller's Address",
      labelUrdu: "فروخت کنندہ کا پتہ",
      type: "address",
      required: true,
      group: "Seller Details",
    },
    {
      name: "buyerName",
      label: "Buyer's Name",
      labelUrdu: "خریدار کا نام",
      type: "text",
      required: true,
      group: "Buyer Details",
    },
    {
      name: "buyerCnic",
      label: "Buyer's CNIC",
      labelUrdu: "خریدار کا شناختی کارڈ",
      type: "cnic",
      required: true,
      group: "Buyer Details",
    },
    {
      name: "buyerAddress",
      label: "Buyer's Address",
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
      group: "Property Details",
    },
    {
      name: "propertyAddress",
      label: "Property Address",
      labelUrdu: "جائیداد کا پتہ",
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
      group: "Transaction Details",
    },
    {
      name: "paymentTerms",
      label: "Payment Terms",
      labelUrdu: "ادائیگی کی شرائط",
      type: "textarea",
      required: true,
      group: "Transaction Details",
    },
    {
      name: "witnesses",
      label: "Witnesses (Names & CNICs)",
      labelUrdu: "گواہان (نام اور شناختی کارڈ نمبر)",
      type: "textarea",
      required: true,
      group: "Witnesses",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a Property Sale/Transfer Deed in {{language}}.

SELLER:
- Name: {{sellerName}}
- CNIC: {{sellerCnic}}
- Address: {{sellerAddress}}

BUYER:
- Name: {{buyerName}}
- CNIC: {{buyerCnic}}
- Address: {{buyerAddress}}

PROPERTY DETAILS:
- Description: {{propertyDescription}}
- Address: {{propertyAddress}}

TRANSACTION DETAILS:
- Sale Price: {{salePrice}} PKR
- Payment Terms: {{paymentTerms}}

WITNESSES:
{{witnesses}}

Generate a complete Property Sale/Transfer Deed under the Transfer of Property Act 1882 and Registration Act 1908 as applicable in Pakistan.
Include proper deed heading, parties identification with CNIC, recitals, property description with boundaries, consideration and payment tREFERENCE FORMAT - Follow this exact Pakistani legal format:

PROPERTY TRANSFER DEED / SALE DEED

This Sale Deed is made and executed on this ___ day of ___________, 20___ at [City].

BETWEEN:

[Transferor / Seller Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
(hereinafter called the "TRANSFEROR / SELLER")

AND

[Transferee / Buyer Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
(hereinafter called the "TRANSFEREE / BUYER")

PROPERTY DETAILS:
- Plot / Khasra No.: [Number]
- Mouza / Colony: [Mouza/Colony]
- Tehsil: [Tehsil], District: [District]
- Area: [Area]
- Bounded by: East [___], West [___], North [___], South [___]

NOW THEREFORE IT IS WITNESSED as follows:

1. That the Transferor in consideration of PKR [Sale Price]/- (receipt of which is hereby acknowledged) hereby transfers, sells, and conveys the above-described property to the Transferee.
2. That the Transferor warrants that the said property is free from all encumbrances, liens, mortgages, and disputes.
3. That the Transferor agrees to execute any further documents required for completion of the transfer.
4. That the Transferee shall be entitled to all rights, benefits, and responsibilities of ownership.
5. That the Transferor indemnifies the Transferee against any third-party claim.

TRANSFEROR                              TRANSFEREE
[Name]                                  [Name]
CNIC: ___________                       CNIC: ___________

Witness 1: ___________________   Witness 2: ___________________

INSTRUCTIONS:
- Title: PROPERTY TRANSFER DEED / SALE DEED (centered, bold)
- BETWEEN / AND party structure
- PROPERTY DETAILS section with boundaries
- Numbered "That..." clauses
- Include free from encumbrances warranty and indemnity
- Both signatures + witnesses at bottom
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
