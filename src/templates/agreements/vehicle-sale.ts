import type { TemplateDefinition } from "../types";

export const VEHICLE_SALE_LEGAL_REQUIREMENTS = `MANDATORY VEHICLE SALE AGREEMENT REQUIREMENTS:
- State that the Seller is the lawful owner of the Vehicle, has full authority to sell it, and that the Vehicle is free from theft claims, liens, bank finance, hypothecation, encumbrances, court orders, and undisclosed third-party claims.
- State that both parties enter into the sale voluntarily, with free consent, without pressure, coercion, fraud, or undue influence.
- State that the Purchaser has inspected and test-checked the Vehicle, is satisfied with its current condition, and accepts it on an as-is basis, without protecting the Seller from fraud, concealed defects, or defective title.
- State the agreed sale price and that payment has been made or shall be made strictly according to the parties' stated Payment Terms. Acknowledge only the amount actually stated as received.
- Include this liability cutoff in substance: All liabilities, taxes, challans, fines, and legal responsibilities arising before the date of this Agreement shall remain the Seller's responsibility. From the date of this Agreement onward, all liabilities, taxes, challans, fines, and legal responsibilities relating to the Vehicle shall be the Purchaser's responsibility.
- Require both parties to cooperate in lawful transfer of registration/ownership, including signatures, biometric verification, Excise and Taxation formalities, and delivery of required original documents.
- Allocate risk, possession, use, accidents, and third-party claims from the effective handover/agreement date to the Purchaser, while preserving the Seller's responsibility for pre-agreement matters and title defects.
- Include reciprocal indemnities: Seller indemnifies Purchaser for pre-agreement liabilities and title defects; Purchaser indemnifies Seller for post-agreement possession, use, challans, accidents, taxes, and claims.
- State that the Agreement becomes effective on the date it is signed, contains the entire agreement, and may be amended only by a written document signed by both parties.
- Include governing law of Pakistan and jurisdiction of the competent courts at the place of execution, without inventing a city.
- End with signature blocks for the Seller and Purchaser and separate signature lines for two witnesses.`;

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
      name: "sellerFatherName",
      label: "Seller Father's Name",
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
      label: "Buyer Father's Name",
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
- Father's Name: {{sellerFatherName}}
- CNIC: {{sellerCnic}}
- Address: {{sellerAddress}}

BUYER:
- Name: {{buyerName}}
- Father's Name: {{buyerFatherName}}
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
- Sale Price: {{salePrice}}
- Payment Terms: {{paymentTerms}}
- Transfer Date: {{transferDate}}

REFERENCE FORMAT — Follow this exact Pakistani legal format:

VEHICLE SALE AGREEMENT

This Vehicle Sale Agreement is made and executed on this ___ day of ___________, 20___ at [City].

BETWEEN:

[Seller Name] S/o [Seller Father's Name], CNIC No. [Seller CNIC], resident of [Seller Address]
(hereinafter called the "SELLER" / Transferor)

AND

[Buyer Name] S/o [Buyer Father's Name], CNIC No. [Buyer CNIC], resident of [Buyer Address]
(hereinafter called the "PURCHASER" / Transferee)

VEHICLE DETAILS:
- Make / Company: [Vehicle Make]
- Model: [Vehicle Model]
- Year of Manufacture: [Vehicle Year]
- Color: [Vehicle Color]
- Registration No.: [Registration Number]
- Engine No.: [Engine Number]
- Chassis No.: [Chassis Number]

NOW THEREFORE BOTH PARTIES AGREE AS UNDER:

1. LAWFUL OWNERSHIP AND AUTHORITY: The Seller represents and warrants that the Seller is the lawful and beneficial owner of the Vehicle, has full legal authority to sell it, and that the particulars stated in this Agreement are true and correct.
2. CLEAN TITLE: The Seller represents that the Vehicle is free from theft claims, bank finance, hypothecation, liens, encumbrances, court orders, superdari restrictions, and undisclosed third-party claims. Any title defect or pre-existing claim remains the Seller's responsibility.
3. VOLUNTARY TRANSACTION: Both parties confirm that they are entering into this Agreement voluntarily, with free consent and sound understanding, without pressure, coercion, fraud, misrepresentation, or undue influence.
4. SALE AND CONSIDERATION: The Seller sells the Vehicle to the Purchaser for the agreed sale price of Rs. [Sale Price]/- (Rupees [Amount in Pakistani words] Only). Payment has been made or shall be made strictly according to the Payment Terms agreed by the parties, and the Seller acknowledges only the amount actually received.
5. INSPECTION AND CONDITION: The Purchaser confirms having inspected and, where practicable, test-checked the Vehicle and accepts its present condition on an as-is basis. This acceptance does not excuse fraud, concealment of a material defect, or defective title by the Seller.
6. DELIVERY OF POSSESSION AND DOCUMENTS: Physical possession of the Vehicle and the available original documents, keys, registration record, and related papers shall be delivered to the Purchaser on [Transfer Date / Handover Date], as agreed by the parties.
7. PRE-AGREEMENT AND POST-AGREEMENT LIABILITIES: All liabilities, taxes, challans, fines, and legal responsibilities arising before the date of this Agreement shall remain the Seller's responsibility. From the date of this Agreement onward, all liabilities, taxes, challans, fines, and legal responsibilities relating to the possession, use, or operation of the Vehicle shall be the Purchaser's responsibility.
8. TRANSFER OF OWNERSHIP: Both parties shall promptly cooperate to transfer registration and ownership according to applicable law, including signing forms, completing biometric verification, attending the relevant Excise and Taxation authority where required, and supplying the necessary original documents. Transfer fees and expenses shall be borne as stated in the Payment Terms or, if not stated, according to applicable law.
9. RISK AND USE: From the effective handover/agreement date, the Purchaser shall bear the risks and responsibilities arising from possession, custody, use, operation, accidents, offences, and third-party claims relating to the Vehicle, without affecting the Seller's responsibility for pre-agreement matters or title defects.
10. RECIPROCAL INDEMNITY: The Seller shall indemnify the Purchaser against losses arising from defective title, undisclosed encumbrances, or liabilities attributable to the period before this Agreement. The Purchaser shall indemnify the Seller against losses arising from possession, use, challans, taxes, accidents, offences, or claims attributable to the period from the date of this Agreement onward.
11. NO FURTHER CLAIM: After receipt of the agreed consideration and completion of the parties' obligations, the Seller shall have no ownership claim over the Vehicle, except for enforcement of any unpaid amount expressly recorded in the Payment Terms.
12. ENTIRE AGREEMENT AND AMENDMENT: This Agreement records the entire understanding between the parties concerning the Vehicle. Any amendment must be in writing and signed by both parties.
13. GOVERNING LAW AND JURISDICTION: This Agreement shall be governed by the laws of Pakistan. Any dispute shall first be addressed in good faith and, if unresolved, shall be subject to the competent courts at the place of execution.
14. EFFECTIVE DATE: This Agreement shall become effective and binding on the date it is signed by both parties.

SELLER                                    BUYER
[Name]                                    [Name]
CNIC: ___________                         CNIC: ___________

Witness 1: ___________________     Witness 2: ___________________
CNIC: ___________                  CNIC: ___________

${VEHICLE_SALE_LEGAL_REQUIREMENTS}

INSTRUCTIONS:
- Title: VEHICLE SALE AGREEMENT (centered, bold)
- BETWEEN / AND party structure
- VEHICLE DETAILS section with all numbers
- Numbered "That..." clauses
- Use Purchaser consistently in the operative clauses.
- Include every mandatory vehicle-sale requirement stated above; do not shorten, merge away, or omit the liability cutoff or reciprocal indemnity clauses.
- Both party signatures and two witness signatures must appear at the bottom.
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
