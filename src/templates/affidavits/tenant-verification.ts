import { TemplateDefinition } from "../types";

export const tenantVerificationAffidavit: TemplateDefinition = {
  category: "affidavit",
  subType: "tenant-verification",
  name: "Tenant Verification Affidavit",
  nameUrdu: "کرایہ دار تصدیقی حلف نامہ",
  description: "Affidavit for tenant verification by landlord for police records",
  descriptionUrdu: "پولیس ریکارڈ کے لیے مالک مکان کی جانب سے کرایہ دار کی تصدیق کا حلف نامہ",
  icon: "UserCheck",
  formFields: [
    {
      name: "landlordName",
      label: "Landlord Name",
      labelUrdu: "مالک مکان کا نام",
      type: "text",
      required: true,
      placeholder: "Enter landlord's full name",
      placeholderUrdu: "مالک مکان کا پورا نام درج کریں",
      group: "Landlord Details",
    },
    {
      name: "landlordFatherName",
      label: "Landlord's Father's Name",
      labelUrdu: "مالک مکان کے والد کا نام",
      type: "text",
      required: true,
      placeholder: "Enter father's name",
      group: "Landlord Details",
    },
    {
      name: "landlordCnic",
      label: "Landlord CNIC",
      labelUrdu: "مالک مکان کا شناختی کارڈ نمبر",
      type: "cnic",
      required: true,
      placeholder: "XXXXX-XXXXXXX-X",
      validation: { pattern: "^[0-9]{5}-[0-9]{7}-[0-9]$" },
      group: "Landlord Details",
    },
    {
      name: "landlordAddress",
      label: "Landlord's Address",
      labelUrdu: "مالک مکان کا پتہ",
      type: "address",
      required: true,
      placeholder: "Enter landlord's address",
      group: "Landlord Details",
    },
    {
      name: "tenantName",
      label: "Tenant Name",
      labelUrdu: "کرایہ دار کا نام",
      type: "text",
      required: true,
      placeholder: "Enter tenant's full name",
      placeholderUrdu: "کرایہ دار کا پورا نام درج کریں",
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
      label: "Tenant CNIC",
      labelUrdu: "کرایہ دار کا شناختی کارڈ نمبر",
      type: "cnic",
      required: true,
      placeholder: "XXXXX-XXXXXXX-X",
      validation: { pattern: "^[0-9]{5}-[0-9]{7}-[0-9]$" },
      group: "Tenant Details",
    },
    {
      name: "tenantPermanentAddress",
      label: "Tenant's Permanent Address",
      labelUrdu: "کرایہ دار کا مستقل پتہ",
      type: "address",
      required: true,
      placeholder: "Enter tenant's permanent address",
      group: "Tenant Details",
    },
    {
      name: "propertyAddress",
      label: "Rented Property Address",
      labelUrdu: "کرایے کی جائیداد کا پتہ",
      type: "address",
      required: true,
      placeholder: "Enter rented property address",
      group: "Property Details",
    },
    {
      name: "rentAmount",
      label: "Monthly Rent (PKR)",
      labelUrdu: "ماہانہ کرایہ (روپے)",
      type: "text",
      required: true,
      placeholder: "Enter monthly rent amount",
      group: "Property Details",
    },
    {
      name: "tenureFrom",
      label: "Tenancy Start Date",
      labelUrdu: "کرایہ داری شروع ہونے کی تاریخ",
      type: "date",
      required: true,
      group: "Property Details",
    },
    {
      name: "purpose",
      label: "Purpose",
      labelUrdu: "مقصد",
      type: "select",
      required: true,
      options: [
        { value: "police-verification", label: "Police Verification", labelUrdu: "پولیس تصدیق" },
        { value: "registration", label: "Tenant Registration", labelUrdu: "کرایہ دار رجسٹریشن" },
        { value: "other", label: "Other", labelUrdu: "دیگر" },
      ],
      group: "Purpose",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a formal Tenant Verification Affidavit (کرایہ دار تصدیقی حلف نامہ) in {{language}}.

LANDLORD DETAILS:
- Name: {{landlordName}}
- Father's Name: {{landlordFatherName}}
- CNIC: {{landlordCnic}}
- Address: {{landlordAddress}}

TENANT DETAILS:
- Name: {{tenantName}}
- Father's Name: {{tenantFatherName}}
- CNIC: {{tenantCnic}}
- Permanent Address: {{tenantPermanentAddress}}

PROPERTY DETAILS:
- Property Address: {{propertyAddress}}
- Monthly Rent: {{rentAmount}} PKR
- Tenancy Start Date: {{tenureFrom}}

PURPOSE: {{purpose}}

Generate a complete, legally valid Tenant Verification Affidavit following Pakistani law format under the Punjab/Sindh/KPK Tenant Registration requirements. Include:
1. Title and heading
2. Landlord identification paragraph
3. Tenant details and identification
4. Property details and location
5. Rent amount and tenancy period
6. Landlord's declaration verifying tenant's identity and character
7. Statement of responsibility by landlord
8. UndertREFERENCE FORMAT - Follow this exact Pakistani legal format:

AFFIDAVIT FOR TENANT VERIFICATION

I, [Landlord Name] S/o [Father Name], CNIC No. [CNIC], owner of property at [Property Address], do hereby solemnly affirm and declare as under:

1. That I am the owner of premises situated at [Property Address] and have let out the same to [Tenant Name] S/o [Father Name], CNIC No. [Tenant CNIC].
2. That the tenant has been residing at the above address since [Date] and is known to me personally.
3. That to the best of my knowledge, the tenant is a law-abiding citizen and no criminal case or FIR is pending against him/her.
4. That the tenant is residing with his/her family consisting of [Number] members.
5. That I undertake to inform the local police station if the tenant vacates the premises or any suspicious activity is observed.
6. That the contents of this affidavit are true and correct to the best of my knowledge and belief and nothing has been concealed.

DEPONENT (LANDLORD)
[Landlord Name] S/o [Father Name]
CNIC: ___________

TENANT ACKNOWLEDGMENT:
[Tenant Name] S/o [Father Name]
CNIC: ___________
Signature: ___________

VERIFICATION:
Verified on oath at [City] on this ___ day of ___________ that the contents of the above affidavit are true and correct to the best of my knowledge and belief and nothing has been concealed therein.

LANDLORD                    TENANT

ATTESTED
(Oath Commissioner / Notary Public / Class-1 Officer)

INSTRUCTIONS:
- Title: AFFIDAVIT FOR TENANT VERIFICATION (centered, bold)
- "That..." numbered clauses
- Include landlord and tenant details, police reporting undertaking
- Include both landlord and tenant signature blocks
- Include VERIFICATION paragraph
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
