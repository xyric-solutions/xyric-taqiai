import { TemplateDefinition } from "../types";

export const agriculturalLease: TemplateDefinition = {
  category: "agreement",
  subType: "agricultural-lease",
  name: "Agricultural Land Lease",
  nameUrdu: "زرعی زمین کا لیز نامہ",
  description: "Lease agreement for agricultural land (Batai/Muzaraah)",
  descriptionUrdu: "زرعی زمین کا لیز نامہ (بٹائی / مزارعہ)",
  icon: "Wheat",
  formFields: [
    {
      name: "landownerName",
      label: "Landowner Name",
      labelUrdu: "زمیندار / مالک زمین کا نام",
      type: "text",
      required: true,
      group: "Landowner Details",
    },
    {
      name: "landownerFatherName",
      label: "Landowner's Father's Name",
      labelUrdu: "مالک زمین کے والد کا نام",
      type: "text",
      required: true,
      group: "Landowner Details",
    },
    {
      name: "landownerCnic",
      label: "Landowner CNIC",
      labelUrdu: "مالک زمین کا شناختی کارڈ",
      type: "cnic",
      required: true,
      group: "Landowner Details",
    },
    {
      name: "landownerAddress",
      label: "Landowner Address",
      labelUrdu: "مالک زمین کا پتہ",
      type: "address",
      required: true,
      group: "Landowner Details",
    },
    {
      name: "tenantFarmerName",
      label: "Tenant Farmer (Muzaray) Name",
      labelUrdu: "مزارع / کاشتکار کا نام",
      type: "text",
      required: true,
      group: "Tenant Farmer Details",
    },
    {
      name: "tenantFarmerFatherName",
      label: "Tenant Farmer's Father's Name",
      labelUrdu: "مزارع کے والد کا نام",
      type: "text",
      required: true,
      group: "Tenant Farmer Details",
    },
    {
      name: "tenantFarmerCnic",
      label: "Tenant Farmer CNIC",
      labelUrdu: "مزارع کا شناختی کارڈ",
      type: "cnic",
      required: true,
      group: "Tenant Farmer Details",
    },
    {
      name: "tenantFarmerAddress",
      label: "Tenant Farmer Address",
      labelUrdu: "مزارع کا پتہ",
      type: "address",
      required: true,
      group: "Tenant Farmer Details",
    },
    {
      name: "landDescription",
      label: "Land Description (Khasra No, Mouza, Tehsil, District)",
      labelUrdu: "زمین کی تفصیل (خسرہ نمبر، موضع، تحصیل، ضلع)",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Land Details",
    },
    {
      name: "landArea",
      label: "Land Area (Acres/Kanals)",
      labelUrdu: "زمین کا رقبہ (ایکڑ/کنال)",
      type: "text",
      required: true,
      group: "Land Details",
    },
    {
      name: "cropType",
      label: "Permitted Crop Type(s)",
      labelUrdu: "اجازت شدہ فصل کی قسم",
      type: "text",
      required: true,
      group: "Farming Terms",
    },
    {
      name: "leasePeriod",
      label: "Lease Period",
      labelUrdu: "لیز کی مدت",
      type: "text",
      required: true,
      group: "Farming Terms",
    },
    {
      name: "cropSharingRatio",
      label: "Crop Sharing Ratio (Batai) - e.g., 50:50, 60:40",
      labelUrdu: "فصل کی تقسیم کا تناسب (بٹائی) - مثلاً 50:50، 60:40",
      type: "text",
      required: true,
      group: "Financial Terms",
    },
    {
      name: "fixedRent",
      label: "Fixed Rent per Season (PKR) - if applicable",
      labelUrdu: "فی موسم مقررہ کرایہ (روپے) - اگر لاگو ہو",
      type: "number",
      required: false,
      group: "Financial Terms",
    },
    {
      name: "waterIrrigation",
      label: "Water / Irrigation Arrangement",
      labelUrdu: "پانی / آبپاشی کا انتظام",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Farming Terms",
    },
    {
      name: "inputCostsSharing",
      label: "Input Costs Sharing (Seeds, Fertilizer, etc.)",
      labelUrdu: "لاگت کی تقسیم (بیج، کھاد وغیرہ)",
      type: "textarea",
      required: false,
      aiSuggestable: true,
      group: "Financial Terms",
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
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate an Agricultural Land Lease (Zarai Zameen ka Lease Nama / Batai Nama) in {{language}}.

LANDOWNER:
- Name: {{landownerName}}
- Father's Name: {{landownerFatherName}}
- CNIC: {{landownerCnic}}
- Address: {{landownerAddress}}

TENANT FARMER (MUZARAY):
- Name: {{tenantFarmerName}}
- Father's Name: {{tenantFarmerFatherName}}
- CNIC: {{tenantFarmerCnic}}
- Address: {{tenantFarmerAddress}}

LAND:
- Description: {{landDescription}}
- Area: {{landArea}}
- Crop Type: {{cropType}}
- Lease Period: {{leasePeriod}}

FINANCIAL:
- Crop Sharing (Batai): {{cropSharingRatio}}
- Fixed Rent: PKR {{fixedRent}}
- Water/Irrigation: {{waterIrrigation}}
- Input Costs: {{inputCostsSharing}}

ADDITIONAL: {{additionalTerms}}

Generate a complete Agricultural Land Lease following Pakistani Punjab Tenancy Act / Sindh Tenancy Act as applicable. Include land description, crop sharing (batai) terms, irrigation rights, input cost shaREFERENCE FORMAT - Follow this exact Pakistani legal format:

AGRICULTURAL LEASE AGREEMENT / LAND LEASE (THEKA NAMA)

This Agricultural Lease Agreement is made on this ___ day of ___________, 20___ at [City].

BETWEEN:

[Landowner Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
(hereinafter called the "LESSOR / OWNER")

AND

[Tenant Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
(hereinafter called the "LESSEE / TENANT")

LAND DETAILS:
- Khasra No.: [Khasra Number]
- Khata No.: [Khata Number]
- Mouza: [Mouza]
- Tehsil: [Tehsil], District: [District]
- Area: [Area] Acres / Kanals / Marlas

NOW THEREFORE BOTH PARTIES AGREE AS UNDER:

1. That the Owner hereby leases the above-described land to the Tenant for agricultural purposes only for a period of [Duration] from [Start Date] to [End Date].
2. That the annual / seasonal rent shall be PKR [Amount]/- payable [at sowing time / at harvest / in two installments].
3. That the Tenant shall cultivate the land with [Crops - wheat / sugarcane / rice / other] and maintain it in good condition.
4. That the costs of seeds, fertilizer, irrigation, and other inputs shall be borne by the [Tenant / equally by both parties].
5. That the Tenant shall not sub-let or transfer the land to any third party.
6. That upon expiry of this lease, the Tenant shall vacate and hand over the land in its original condition.
7. That any dispute arising out of this agreement shall be resolved amicably or through arbitration.

LESSOR (OWNER)                          LESSEE (TENANT)
[Name]                                  [Name]
CNIC: ___________                       CNIC: ___________

Witness 1: ___________________   Witness 2: ___________________

INSTRUCTIONS:
- Title: AGRICULTURAL LEASE AGREEMENT (centered, bold)
- BETWEEN / AND party structure
- LAND DETAILS section with Khasra/Khata/Mouza/Tehsil/District
- Numbered "That..." clauses
- Include rent amount, crop type, duration
- Both signatures at bottom
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
