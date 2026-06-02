import { TemplateDefinition } from "../types";

export const distributionAgreement: TemplateDefinition = {
  category: "agreement",
  subType: "distribution-agreement",
  name: "Distribution Agreement",
  nameUrdu: "تقسیم کاری معاہدہ",
  description: "Agreement between manufacturer/supplier and distributor",
  descriptionUrdu: "مصنوعہ ساز / سپلائر اور تقسیم کار کے درمیان معاہدہ",
  icon: "Truck",
  formFields: [
    {
      name: "supplierName",
      label: "Manufacturer / Supplier Name",
      labelUrdu: "مصنوعہ ساز / سپلائر کا نام",
      type: "text",
      required: true,
      group: "Supplier Details",
    },
    {
      name: "supplierRegistration",
      label: "Supplier Registration / NTN No",
      labelUrdu: "سپلائر کا رجسٹریشن / این ٹی این نمبر",
      type: "text",
      required: true,
      group: "Supplier Details",
    },
    {
      name: "supplierAddress",
      label: "Supplier Address",
      labelUrdu: "سپلائر کا پتہ",
      type: "address",
      required: true,
      group: "Supplier Details",
    },
    {
      name: "distributorName",
      label: "Distributor Name",
      labelUrdu: "تقسیم کار کا نام",
      type: "text",
      required: true,
      group: "Distributor Details",
    },
    {
      name: "distributorCnic",
      label: "Distributor CNIC / Registration No",
      labelUrdu: "تقسیم کار کا شناختی کارڈ / رجسٹریشن نمبر",
      type: "text",
      required: true,
      group: "Distributor Details",
    },
    {
      name: "distributorAddress",
      label: "Distributor Address",
      labelUrdu: "تقسیم کار کا پتہ",
      type: "address",
      required: true,
      group: "Distributor Details",
    },
    {
      name: "products",
      label: "Products Description",
      labelUrdu: "مصنوعات کی تفصیل",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Product Details",
    },
    {
      name: "territory",
      label: "Distribution Territory",
      labelUrdu: "تقسیم کاری کا علاقہ",
      type: "text",
      required: true,
      group: "Distribution Terms",
    },
    {
      name: "pricingTerms",
      label: "Pricing & Discount Terms",
      labelUrdu: "قیمت اور رعایت کی شرائط",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Distribution Terms",
    },
    {
      name: "minimumPurchase",
      label: "Minimum Purchase Quantity / Amount",
      labelUrdu: "کم سے کم خریداری کی مقدار / رقم",
      type: "text",
      required: false,
      group: "Distribution Terms",
    },
    {
      name: "paymentTerms",
      label: "Payment Terms",
      labelUrdu: "ادائیگی کی شرائط",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Financial Terms",
    },
    {
      name: "duration",
      label: "Agreement Duration",
      labelUrdu: "معاہدے کی مدت",
      type: "text",
      required: true,
      group: "Duration",
    },
    {
      name: "startDate",
      label: "Start Date",
      labelUrdu: "شروع ہونے کی تاریخ",
      type: "date",
      required: true,
      group: "Duration",
    },
    {
      name: "additionalTerms",
      label: "Additional Terms",
      labelUrdu: "اضافی شرائط",
      type: "textarea",
      required: false,
      aiSuggestable: true,
      group: "Additional Terms",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a Distribution Agreement (Taqseem Kari Muahida) in {{language}}.

SUPPLIER:
- Name: {{supplierName}}
- Registration/NTN: {{supplierRegistration}}
- Address: {{supplierAddress}}

DISTRIBUTOR:
- Name: {{distributorName}}
- CNIC/Registration: {{distributorCnic}}
- Address: {{distributorAddress}}

DISTRIBUTION TERMS:
- Products: {{products}}
- Territory: {{territory}}
- Pricing: {{pricingTerms}}
- Minimum Purchase: {{minimumPurchase}}
- Payment: {{paymentTerms}}
- Duration: {{duration}}
- Start Date: {{startDate}}

ADDITIONAL: {{additionalTerms}}

Generate a complete Distribution Agreement following Pakistani Contract Act and Sale of Goods Act. Include appointment as distributor, product specifications, territory exclusivity,REFERENCE FORMAT - Follow this exact Pakistani legal format:

DISTRIBUTION AGREEMENT

This Distribution Agreement is made and executed on this ___ day of ___________, 20___ at [City].

BETWEEN:

[Supplier / Manufacturer Name], NTN [Number], [Address]
(hereinafter called the "SUPPLIER / MANUFACTURER")

AND

[Distributor Name / Firm], NTN [Number], [Address]
(hereinafter called the "DISTRIBUTOR")

NOW THEREFORE BOTH PARTIES AGREE AS UNDER:

1. That the Supplier hereby appoints the Distributor as its [exclusive / non-exclusive] distributor for [Territory] for the products listed in Schedule A.
2. That the Distributor shall purchase products at the agreed trade price and shall maintain a minimum monthly purchase of PKR [Minimum Target]/-
3. That the Distributor shall not deal in competing products during the term of this agreement.
4. That the Supplier shall provide promotional materials and marketing support to the Distributor.
5. That either party may terminate this agreement by giving [Notice Period] days written notice.
6. That this agreement shall be governed by the laws of Pakistan and disputes shall be resolved in courts at [City].

SUPPLIER                                DISTRIBUTOR
[Name / Firm]                           [Name / Firm]
NTN: ___________                        NTN: ___________

Witness 1: ___________________   Witness 2: ___________________

INSTRUCTIONS:
- Title: DISTRIBUTION AGREEMENT (centered, bold)
- BETWEEN / AND party structure
- Numbered "That..." clauses
- Include territory, minimum targets, exclusivity, termination notice
- Both signatures at bottom
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
