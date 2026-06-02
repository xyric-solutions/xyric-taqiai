import { TemplateDefinition } from "../types";

export const shopRent: TemplateDefinition = {
  category: "agreement",
  subType: "shop-rent",
  name: "Shop / Commercial Rent Agreement",
  nameUrdu: "دکان کرایہ نامہ",
  description: "Rental agreement specifically for commercial shops and premises",
  descriptionUrdu: "تجارتی دکانوں اور احاطوں کے لیے کرایہ نامہ",
  icon: "Store",
  formFields: [
    {
      name: "landlordName",
      label: "Landlord / Owner Name",
      labelUrdu: "مالک مکان کا نام",
      type: "text",
      required: true,
      group: "Landlord Details",
    },
    {
      name: "landlordFatherName",
      label: "Landlord's Father's Name",
      labelUrdu: "مالک کے والد کا نام",
      type: "text",
      required: true,
      group: "Landlord Details",
    },
    {
      name: "landlordCnic",
      label: "Landlord CNIC",
      labelUrdu: "مالک کا شناختی کارڈ",
      type: "cnic",
      required: true,
      group: "Landlord Details",
    },
    {
      name: "landlordAddress",
      label: "Landlord Address",
      labelUrdu: "مالک کا پتہ",
      type: "address",
      required: true,
      group: "Landlord Details",
    },
    {
      name: "tenantName",
      label: "Tenant / Shopkeeper Name",
      labelUrdu: "کرایہ دار / دکاندار کا نام",
      type: "text",
      required: true,
      group: "Tenant Details",
    },
    {
      name: "tenantFatherName",
      label: "Tenant's Father's Name",
      labelUrdu: "کرایہ دار کے والد کا نام",
      type: "text",
      required: true,
      group: "Tenant Details",
    },
    {
      name: "tenantCnic",
      label: "Tenant CNIC",
      labelUrdu: "کرایہ دار کا شناختی کارڈ",
      type: "cnic",
      required: true,
      group: "Tenant Details",
    },
    {
      name: "shopNumber",
      label: "Shop Number",
      labelUrdu: "دکان نمبر",
      type: "text",
      required: true,
      group: "Shop Details",
    },
    {
      name: "floorNumber",
      label: "Floor Number",
      labelUrdu: "منزل نمبر",
      type: "text",
      required: false,
      group: "Shop Details",
    },
    {
      name: "marketName",
      label: "Market / Plaza / Building Name",
      labelUrdu: "مارکیٹ / پلازا / عمارت کا نام",
      type: "text",
      required: true,
      group: "Shop Details",
    },
    {
      name: "shopAddress",
      label: "Shop Full Address",
      labelUrdu: "دکان کا مکمل پتہ",
      type: "address",
      required: true,
      group: "Shop Details",
    },
    {
      name: "shopArea",
      label: "Shop Area (sq ft)",
      labelUrdu: "دکان کا رقبہ (مربع فٹ)",
      type: "number",
      required: false,
      group: "Shop Details",
    },
    {
      name: "businessTypeAllowed",
      label: "Business Type Allowed",
      labelUrdu: "اجازت شدہ کاروبار کی قسم",
      type: "text",
      required: true,
      group: "Business Terms",
    },
    {
      name: "monthlyRent",
      label: "Monthly Rent (PKR)",
      labelUrdu: "ماہانہ کرایہ (روپے)",
      type: "number",
      required: true,
      group: "Financial Terms",
    },
    {
      name: "advanceAmount",
      label: "Advance / Security Deposit (PKR)",
      labelUrdu: "ایڈوانس / سیکیورٹی ڈپازٹ (روپے)",
      type: "number",
      required: true,
      group: "Financial Terms",
    },
    {
      name: "goodwillPagri",
      label: "Goodwill / Pagri Amount (PKR) - if any",
      labelUrdu: "گڈول / پگڑی کی رقم (روپے) - اگر کوئی ہو",
      type: "number",
      required: false,
      group: "Financial Terms",
    },
    {
      name: "rentIncrease",
      label: "Annual Rent Increase (%)",
      labelUrdu: "سالانہ کرایہ میں اضافہ (%)",
      type: "text",
      required: false,
      group: "Financial Terms",
    },
    {
      name: "leasePeriod",
      label: "Lease Period (months)",
      labelUrdu: "کرایہ کی مدت (مہینے)",
      type: "number",
      required: true,
      group: "Lease Terms",
    },
    {
      name: "startDate",
      label: "Lease Start Date",
      labelUrdu: "کرایہ شروع ہونے کی تاریخ",
      type: "date",
      required: true,
      group: "Lease Terms",
    },
    {
      name: "additionalTerms",
      label: "Additional Terms & Conditions",
      labelUrdu: "اضافی شرائط و ضوابط",
      type: "textarea",
      required: false,
      aiSuggestable: true,
      group: "Additional Terms",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a Shop/Commercial Rent Agreement (Dukaan Kiraya Nama) in {{language}}.

LANDLORD:
- Name: {{landlordName}}
- Father's Name: {{landlordFatherName}}
- CNIC: {{landlordCnic}}
- Address: {{landlordAddress}}

TENANT/SHOPKEEPER:
- Name: {{tenantName}}
- Father's Name: {{tenantFatherName}}
- CNIC: {{tenantCnic}}

SHOP DETAILS:
- Shop No: {{shopNumber}}
- Floor: {{floorNumber}}
- Market/Plaza: {{marketName}}
- Address: {{shopAddress}}
- Area: {{shopArea}} sq ft
- Business Type: {{businessTypeAllowed}}

FINANCIAL:
- Monthly Rent: PKR {{monthlyRent}}
- Advance/Security: PKR {{advanceAmount}}
- Goodwill/Pagri: PKR {{goodwillPagri}}
- Annual Increase: {{rentIncrease}}%
- Lease Period: {{leasePeriod}} months
- Start Date: {{startDate}}

ADDITIONAL: {{additionalTerms}}

Generate a complete Shop/Commercial Rent Agreement following Pakistani Rent Restriction laws. Include shop description, permitted business use, rent payment terms, maintenance responsibilities, signageREFERENCE FORMAT - Follow this exact Pakistani legal format:

SHOP RENT AGREEMENT / DUKAN KIRAYA NAMA

This Shop Rent Agreement is made and executed on this ___ day of ___________, 20___ at [City].

BETWEEN:

[Landlord Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
(hereinafter called the "LANDLORD / LESSOR")

AND

[Tenant Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
(hereinafter called the "TENANT / LESSEE")

SHOP DETAILS:
- Shop No.: [Shop Number]
- Address: [Complete Shop Address]
- Area: [Area] sq. ft.

NOW THEREFORE BOTH PARTIES AGREE AS UNDER:

1. That the Landlord hereby lets out the above-described shop to the Tenant for commercial purposes for a period of [Duration] from [Start Date] to [End Date].
2. That the monthly rent shall be PKR [Monthly Rent]/- payable in advance on or before the [Payment Date] of each month.
3. That the Tenant has paid a security deposit of PKR [Security Deposit]/- which shall be refunded on vacation subject to deduction of damages if any.
4. That the Tenant shall use the shop only for [Permitted Use - retail / office / other] and shall not sub-let without written consent.
5. That the Tenant shall not make any structural changes without prior written consent of the Landlord.
6. That the Tenant shall vacate the shop at the expiry of the tenancy period or upon [Notice Period] days notice.
7. That in case of default in rent for more than [Grace Period] months, the Landlord shall be entitled to terminate the tenancy.

LANDLORD                                TENANT
[Name]                                  [Name]
CNIC: ___________                       CNIC: ___________

Witness 1: ___________________   Witness 2: ___________________

INSTRUCTIONS:
- Title: SHOP RENT AGREEMENT (centered, bold)
- BETWEEN / AND party structure
- SHOP DETAILS section
- Numbered "That..." clauses
- Include monthly rent, security deposit, no sub-letting, notice period
- Both signatures at bottom
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
