import { TemplateDefinition } from "../types";

export const vehicleSale: TemplateDefinition = {
  category: "agreement",
  subType: "vehicle-sale",
  name: "Vehicle Sale Agreement",
  nameUrdu: "گاڑی فروخت نامہ",
  description: "Agreement for sale of vehicle",
  descriptionUrdu: "گاڑی کی فروخت کا معاہدہ",
  icon: "Car",
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
      name: "vehicleMake",
      label: "Vehicle Make (e.g., Toyota, Honda)",
      labelUrdu: "گاڑی کی کمپنی",
      type: "text",
      required: true,
      group: "Vehicle Details",
    },
    {
      name: "vehicleModel",
      label: "Vehicle Model",
      labelUrdu: "گاڑی کا ماڈل",
      type: "text",
      required: true,
      group: "Vehicle Details",
    },
    {
      name: "vehicleYear",
      label: "Year of Manufacture",
      labelUrdu: "سنہ تیاری",
      type: "number",
      required: true,
      group: "Vehicle Details",
    },
    {
      name: "vehicleColor",
      label: "Vehicle Color",
      labelUrdu: "گاڑی کا رنگ",
      type: "text",
      required: true,
      group: "Vehicle Details",
    },
    {
      name: "registrationNo",
      label: "Registration Number",
      labelUrdu: "رجسٹریشن نمبر",
      type: "text",
      required: true,
      group: "Vehicle Details",
    },
    {
      name: "engineNo",
      label: "Engine Number",
      labelUrdu: "انجن نمبر",
      type: "text",
      required: true,
      group: "Vehicle Details",
    },
    {
      name: "chassisNo",
      label: "Chassis Number",
      labelUrdu: "چیسس نمبر",
      type: "text",
      required: true,
      group: "Vehicle Details",
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
      name: "paymentTerms",
      label: "Payment Terms",
      labelUrdu: "ادائیگی کی شرائط",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Financial Details",
    },
    {
      name: "vehicleCondition",
      label: "Condition of Vehicle",
      labelUrdu: "گاڑی کی حالت",
      type: "textarea",
      required: false,
      aiSuggestable: true,
      group: "Vehicle Details",
    },
    {
      name: "transferDate",
      label: "Transfer Date",
      labelUrdu: "منتقلی کی تاریخ",
      type: "date",
      required: true,
      group: "Financial Details",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a Vehicle Sale Agreement in {{language}}.

SELLER:
- Name: {{sellerName}}
- CNIC: {{sellerCnic}}
- Address: {{sellerAddress}}

BUYER:
- Name: {{buyerName}}
- CNIC: {{buyerCnic}}
- Address: {{buyerAddress}}

VEHICLE:
- Make: {{vehicleMake}}
- Model: {{vehicleModel}}
- Year: {{vehicleYear}}
- Color: {{vehicleColor}}
- Registration No: {{registrationNo}}
- Engine No: {{engineNo}}
- Chassis No: {{chassisNo}}
- Condition: {{vehicleCondition}}

FINANCIAL:
- Sale Price: PKR {{salePrice}}
- Payment Terms: {{paymentTerms}}
- Transfer Date: {{transferDate}}

REFERENCE FORMAT — Follow this exact Pakistani legal format:

VEHICLE SALE AGREEMENT

This Vehicle Sale Agreement is made and executed on this ___ day of ___________, 20___ at [City].

BETWEEN:

[Seller Name] S/o [Father Name], CNIC No. [Seller CNIC], resident of [Seller Address]
(hereinafter called the "SELLER" / Transferor)

AND

[Buyer Name] S/o [Father Name], CNIC No. [Buyer CNIC], resident of [Buyer Address]
(hereinafter called the "BUYER" / Transferee)

VEHICLE DETAILS:
- Make / Company: [Vehicle Make]
- Model: [Vehicle Model]
- Year of Manufacture: [Vehicle Year]
- Color: [Vehicle Color]
- Registration No.: [Registration Number]
- Engine No.: [Engine Number]
- Chassis No.: [Chassis Number]

NOW THEREFORE BOTH PARTIES AGREE AS UNDER:

1. That the Seller hereby sells, transfers and conveys the above-described vehicle to the Buyer for a total sale consideration of PKR [Sale Price]/- ([Amount in words] only), receipt of which is hereby acknowledged by the Seller.
2. That the Seller confirms that the said vehicle is free from all encumbrances, bank loans, hypothecation, court orders, and any other legal impediments.
3. That the Seller has handed over the complete physical possession of the vehicle along with all documents (registration book, insurance, etc.) to the Buyer on [Transfer Date].
4. That the Buyer shall be responsible for transfer of registration in his/her name and payment of all related taxes and fees.
5. That all outstanding token taxes, insurance dues and any other liabilities up to the date of transfer shall be cleared by the Seller.
6. That after the execution of this agreement, the Seller shall have no claim over the said vehicle.

SELLER                                    BUYER
[Name]                                    [Name]
CNIC: ___________                         CNIC: ___________

Witness 1: ___________________     Witness 2: ___________________
CNIC: ___________                  CNIC: ___________

INSTRUCTIONS:
- Title: VEHICLE SALE AGREEMENT (centered, bold)
- BETWEEN / AND party structure
- VEHICLE DETAILS section with all numbers
- Numbered "That..." clauses
- Key clauses: free from encumbrances, possession transferred, buyer to do registration
- Both signatures at bottom
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
