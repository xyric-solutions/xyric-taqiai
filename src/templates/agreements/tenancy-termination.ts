import { TemplateDefinition } from "../types";

export const tenancyTermination: TemplateDefinition = {
  category: "agreement",
  subType: "tenancy-termination",
  name: "Tenancy Termination Agreement",
  nameUrdu: "کرایہ داری ختم کرنے کا معاہدہ",
  description: "Agreement for termination of tenancy",
  descriptionUrdu: "کرایہ داری ختم کرنے کا معاہدہ",
  icon: "DoorOpen",
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
      name: "tenantAddress",
      label: "Tenant Current Address",
      labelUrdu: "کرایہ دار کا موجودہ پتہ",
      type: "address",
      required: true,
      group: "Tenant Details",
    },
    {
      name: "propertyAddress",
      label: "Rental Property Address",
      labelUrdu: "کرایہ پر دی گئی جائیداد کا پتہ",
      type: "address",
      required: true,
      group: "Property Details",
    },
    {
      name: "originalAgreementDate",
      label: "Original Rent Agreement Date",
      labelUrdu: "اصل کرایہ نامے کی تاریخ",
      type: "date",
      required: true,
      group: "Property Details",
    },
    {
      name: "terminationDate",
      label: "Termination / Vacating Date",
      labelUrdu: "کرایہ داری ختم ہونے / مکان خالی کرنے کی تاریخ",
      type: "date",
      required: true,
      group: "Termination Details",
    },
    {
      name: "pendingDues",
      label: "Pending Dues (PKR)",
      labelUrdu: "بقایا واجبات (روپے)",
      type: "number",
      required: false,
      group: "Financial Details",
    },
    {
      name: "securityDepositRefund",
      label: "Security Deposit Refund (PKR)",
      labelUrdu: "سیکیورٹی ڈپازٹ کی واپسی (روپے)",
      type: "number",
      required: false,
      group: "Financial Details",
    },
    {
      name: "propertyCondition",
      label: "Property Condition at Handover",
      labelUrdu: "حوالگی کے وقت جائیداد کی حالت",
      type: "textarea",
      required: false,
      aiSuggestable: true,
      group: "Termination Details",
    },
    {
      name: "handoverTerms",
      label: "Handover Terms",
      labelUrdu: "حوالگی کی شرائط",
      type: "textarea",
      required: false,
      aiSuggestable: true,
      group: "Termination Details",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a Tenancy Termination Agreement in {{language}}.

LANDLORD:
- Name: {{landlordName}}
- CNIC: {{landlordCnic}}
- Address: {{landlordAddress}}

TENANT:
- Name: {{tenantName}}
- CNIC: {{tenantCnic}}
- Address: {{tenantAddress}}

PROPERTY:
- Address: {{propertyAddress}}
- Original Agreement Date: {{originalAgreementDate}}

TERMINATION:
- Date: {{terminationDate}}
- Property Condition: {{propertyCondition}}
- Handover Terms: {{handoverTerms}}

FINANCIAL:
- Pending Dues: PKR {{pendingDues}}
- Security Deposit Refund: PKR {{securityDepositRefund}}

Generate a complete Tenancy Termination Agreement following Pakistani lawREFERENCE FORMAT - Follow this exact Pakistani legal format:

TENANCY TERMINATION AGREEMENT / VACATION DEED

This Tenancy Termination Agreement is made and executed on this ___ day of ___________, 20___ at [City].

BETWEEN:

[Landlord Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
(hereinafter called the "LANDLORD")

AND

[Tenant Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
(hereinafter called the "TENANT")

WHEREAS the parties had entered into a Tenancy / Rent Agreement dated [Original Agreement Date] in respect of premises at [Property Address].

NOW THEREFORE BOTH PARTIES MUTUALLY AGREE AS UNDER:

1. That both parties mutually agree to terminate the said tenancy with effect from [Termination Date].
2. That the Tenant has paid all outstanding rent and utility bills up to [Date] and nothing is outstanding.
3. That the Landlord has inspected the premises and confirms the property is in [good / satisfactory] condition.
4. That the Tenant has handed over the keys and vacated the premises on [Vacation Date].
5. That the Landlord hereby refunds the security deposit of PKR [Amount]/- to the Tenant after deduction of PKR [Deductions]/- for [Reason].
6. That both parties release each other from all claims and obligations arising from the said tenancy.

LANDLORD                                TENANT
[Name]                                  [Name]
CNIC: ___________                       CNIC: ___________

Witness 1: ___________________   Witness 2: ___________________

INSTRUCTIONS:
- Title: TENANCY TERMINATION AGREEMENT (centered, bold)
- BETWEEN / AND party structure
- WHEREAS recital identifying the original rent agreement
- Numbered "That..." clauses
- Include settlement of dues, security deposit refund, mutual release
- Both signatures at bottom
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
