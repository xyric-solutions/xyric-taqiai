import { TemplateDefinition } from "../types";

export const rentAgreement: TemplateDefinition = {
  category: "agreement",
  subType: "rent-agreement",
  name: "Rent Agreement",
  nameUrdu: "کرایہ نامہ",
  description: "Rental agreement for property",
  descriptionUrdu: "جائیداد کا کرایہ نامہ",
  icon: "Home",
  formFields: [
    {
      name: "landlordName",
      label: "Landlord Name",
      labelUrdu: "مالک مکان کا نام",
      type: "text",
      required: true,
      group: "Landlord Details",
    },
    {
      name: "landlordCnic",
      label: "Landlord CNIC",
      labelUrdu: "مالک مکان کا شناختی کارڈ",
      type: "cnic",
      required: true,
      group: "Landlord Details",
    },
    {
      name: "landlordAddress",
      label: "Landlord Address",
      labelUrdu: "مالک مکان کا پتہ",
      type: "address",
      required: true,
      group: "Landlord Details",
    },
    {
      name: "tenantName",
      label: "Tenant Name",
      labelUrdu: "کرایہ دار کا نام",
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
      name: "propertyAddress",
      label: "Rental Property Address",
      labelUrdu: "کرایہ پر دی جانے والی جائیداد کا پتہ",
      type: "address",
      required: true,
      group: "Property Details",
    },
    {
      name: "monthlyRent",
      label: "Monthly Rent (PKR)",
      labelUrdu: "ماہانہ کرایہ (روپے)",
      type: "number",
      required: true,
      group: "Rent Details",
    },
    {
      name: "securityDeposit",
      label: "Security Deposit (PKR)",
      labelUrdu: "سیکیورٹی ڈپازٹ (روپے)",
      type: "number",
      required: true,
      group: "Rent Details",
    },
    {
      name: "leasePeriod",
      label: "Lease Period (months)",
      labelUrdu: "کرایہ کی مدت (مہینے)",
      type: "number",
      required: true,
      group: "Rent Details",
    },
    {
      name: "startDate",
      label: "Lease Start Date",
      labelUrdu: "کرایہ شروع ہونے کی تاریخ",
      type: "date",
      required: true,
      group: "Rent Details",
    },
    {
      name: "additionalTerms",
      label: "Additional Terms",
      labelUrdu: "اضافی شرائط",
      type: "textarea",
      required: false,
      aiSuggestable: true,
      group: "Terms",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a Rent Agreement in {{language}}.

LANDLORD:
- Name: {{landlordName}}
- CNIC: {{landlordCnic}}
- Address: {{landlordAddress}}

TENANT:
- Name: {{tenantName}}
- CNIC: {{tenantCnic}}

PROPERTY: {{propertyAddress}}

RENT DETAILS:
- Monthly Rent: PKR {{monthlyRent}}
- Security Deposit: PKR {{securityDeposit}}
- Lease Period: {{leasePeriod}} months
- Start Date: {{startDate}}

ADDITIONAL TERMS: {{additionalTerms}}

REFERENCE FORMAT — Follow this exact Pakistani legal format:

RENT AGREEMENT

This Rent Agreement is made and executed on this ___ day of ___________, 20___ at [City].

BETWEEN:

[Landlord Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
(hereinafter referred to as the "LANDLORD" / First Party)

AND

[Tenant Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
(hereinafter referred to as the "TENANT" / Second Party)

WHEREAS both parties have agreed to the following terms and conditions:

1. That the Landlord hereby lets out the property situated at [Property Address] to the Tenant.
2. That the monthly rent agreed upon is PKR [Amount] per month.
3. That the Tenant has paid a security deposit of PKR [Security Deposit] which shall be refunded at the time of vacating.
4. That the tenancy shall commence from [Start Date] for a period of [Duration] months.
5. That the Tenant shall not sublet or transfer the property without prior written consent of the Landlord.
6. That the Tenant shall keep the premises in good condition and shall be responsible for any damage caused.
7. That either party may terminate this agreement by giving [notice period] days written notice.
8. That all dues including electricity, gas, water bills shall be paid by the Tenant.

LANDLORD                                    TENANT
[Name]                                      [Name]
CNIC: ___________                           CNIC: ___________

Witness 1: ___________________     Witness 2: ___________________
CNIC: ___________                  CNIC: ___________

INSTRUCTIONS:
- Title: RENT AGREEMENT (centered, bold)
- Number all clauses, each starting with "That..."
- Include BETWEEN / AND party structure clearly
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
