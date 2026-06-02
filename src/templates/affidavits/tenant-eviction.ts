import { TemplateDefinition } from "../types";

export const tenantEvictionAffidavit: TemplateDefinition = {
  category: "affidavit",
  subType: "tenant-eviction",
  name: "Tenant Eviction Affidavit",
  nameUrdu: "کرایہ دار بے دخلی کا حلف نامہ",
  description: "Affidavit for tenant eviction proceedings",
  descriptionUrdu: "کرایہ دار کی بے دخلی کی کارروائی کا حلف نامہ",
  icon: "DoorOpen",
  formFields: [
    {
      name: "deponentName",
      label: "Landlord Name",
      labelUrdu: "مالک مکان کا نام",
      type: "text",
      required: true,
      placeholder: "Enter landlord's full name",
      placeholderUrdu: "مالک مکان کا پورا نام درج کریں",
      group: "Landlord Details",
    },
    {
      name: "fatherName",
      label: "Father's / Husband's Name",
      labelUrdu: "والد / شوہر کا نام",
      type: "text",
      required: true,
      placeholder: "Enter father's or husband's name",
      group: "Landlord Details",
    },
    {
      name: "cnic",
      label: "CNIC Number",
      labelUrdu: "شناختی کارڈ نمبر",
      type: "cnic",
      required: true,
      placeholder: "XXXXX-XXXXXXX-X",
      validation: { pattern: "^[0-9]{5}-[0-9]{7}-[0-9]$" },
      group: "Landlord Details",
    },
    {
      name: "address",
      label: "Landlord's Address",
      labelUrdu: "مالک مکان کا پتہ",
      type: "address",
      required: true,
      placeholder: "Enter landlord's address",
      group: "Landlord Details",
    },
    {
      name: "city",
      label: "City",
      labelUrdu: "شہر",
      type: "text",
      required: true,
      placeholder: "Enter city name",
      group: "Landlord Details",
    },
    {
      name: "tenantName",
      label: "Tenant Name",
      labelUrdu: "کرایہ دار کا نام",
      type: "text",
      required: true,
      placeholder: "Enter tenant's full name",
      group: "Tenant Details",
    },
    {
      name: "tenantFatherName",
      label: "Tenant's Father's Name",
      labelUrdu: "کرایہ دار کے والد کا نام",
      type: "text",
      required: true,
      placeholder: "Enter tenant's father's name",
      group: "Tenant Details",
    },
    {
      name: "tenantCnic",
      label: "Tenant's CNIC",
      labelUrdu: "کرایہ دار کا شناختی کارڈ",
      type: "cnic",
      required: false,
      placeholder: "XXXXX-XXXXXXX-X",
      group: "Tenant Details",
    },
    {
      name: "propertyAddress",
      label: "Rented Property Address",
      labelUrdu: "کرایے کی جائیداد کا پتہ",
      type: "address",
      required: true,
      placeholder: "Enter complete property address",
      group: "Property & Agreement Details",
    },
    {
      name: "rentAmount",
      label: "Monthly Rent (PKR)",
      labelUrdu: "ماہانہ کرایہ (روپے)",
      type: "number",
      required: true,
      placeholder: "Enter monthly rent amount",
      group: "Property & Agreement Details",
    },
    {
      name: "agreementDate",
      label: "Rent Agreement Date",
      labelUrdu: "کرایہ نامے کی تاریخ",
      type: "date",
      required: false,
      group: "Property & Agreement Details",
    },
    {
      name: "reasonForEviction",
      label: "Reason for Eviction",
      labelUrdu: "بے دخلی کی وجہ",
      type: "textarea",
      required: true,
      placeholder: "e.g., Non-payment of rent, personal need, subletting, property damage, etc.",
      aiSuggestable: true,
      group: "Eviction Details",
    },
    {
      name: "noticeDate",
      label: "Date of Eviction Notice",
      labelUrdu: "بے دخلی نوٹس کی تاریخ",
      type: "date",
      required: false,
      group: "Eviction Details",
    },
    {
      name: "language",
      label: "Language",
      labelUrdu: "زبان",
      type: "select",
      required: true,
      options: [
        { value: "english", label: "English", labelUrdu: "انگریزی" },
        { value: "urdu", label: "Urdu", labelUrdu: "اردو" },
      ],
      group: "Eviction Details",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a formal Tenant Eviction Affidavit in {{language}}.

LANDLORD DETAILS:
- Name: {{deponentName}}
- Father's/Husband's Name: {{fatherName}}
- CNIC: {{cnic}}
- Address: {{address}}
- City: {{city}}

TENANT DETAILS:
- Name: {{tenantName}}
- Father's Name: {{tenantFatherName}}
- CNIC: {{tenantCnic}}

PROPERTY & AGREEMENT:
- Property Address: {{propertyAddress}}
- Monthly Rent: PKR {{rentAmount}}
- Agreement Date: {{agreementDate}}

EVICTION DETAILS:
- Reason: {{reasonForEviction}}
- Notice Date: {{noticeDate}}

Generate a complete, legally valid Tenant Eviction Affidavit following Pakistani law format and relevant rent laws. Include:
1. Title and heading with proper formatting
2. Landlord identification paragraph
3. Tenant identification
4. Property description and rent agreement details
5. Grounds for eviction with detailed reasoning
6. Reference to notice served (if applicable)
7. Prayer/requestREFERENCE FORMAT - Follow this exact Pakistani legal format:

AFFIDAVIT FOR EVICTION OF TENANT

I, [Landlord Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address], do hereby solemnly affirm and declare as under:

1. That I am the owner of property situated at [Property Address] as per Title Deed / Mutation No. [Number].
2. That [Tenant Name] S/o [Father Name], CNIC No. [CNIC], has been occupying the said premises as tenant since [Date] under Rent Agreement dated [Agreement Date].
3. That the monthly rent of PKR [Rent Amount]/- has not been paid since [Date of Default], and total arrears amount to PKR [Total Arrears]/-.
4. That a notice for vacation was served upon the tenant on [Notice Date] but he/she has refused to vacate.
5. That the tenancy period has expired / I am required to personally use the premises and the tenant has not vacated.
6. That I am making this affidavit as evidence for initiation of eviction proceedings.
7. That the contents of this affidavit are true and correct to the best of my knowledge and belief and nothing has been concealed.

DEPONENT (LANDLORD)
[Landlord Name] S/o [Father Name]
CNIC: ___________

VERIFICATION:
Verified on oath at [City] on this ___ day of ___________ that the contents of the above affidavit are true and correct to the best of my knowledge and belief and nothing has been concealed therein.

DEPONENT

ATTESTED
(Oath Commissioner / Notary Public / Class-1 Officer)

INSTRUCTIONS:
- Title: AFFIDAVIT FOR EVICTION OF TENANT (centered, bold)
- "That..." numbered clauses
- Include property address, rent arrears, eviction notice date
- Include VERIFICATION paragraph
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
