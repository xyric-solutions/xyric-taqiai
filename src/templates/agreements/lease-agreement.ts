import { TemplateDefinition } from "../types";

export const leaseAgreement: TemplateDefinition = {
  category: "agreement",
  subType: "lease-agreement",
  name: "Lease Agreement (Commercial)",
  nameUrdu: "لیز نامہ",
  description: "Commercial lease agreement for property",
  descriptionUrdu: "تجارتی جائیداد کا لیز نامہ",
  icon: "Building2",
  formFields: [
    {
      name: "lessorName",
      label: "Lessor (Owner) Name",
      labelUrdu: "لیز دہندہ (مالک) کا نام",
      type: "text",
      required: true,
      group: "Lessor Details",
    },
    {
      name: "lessorCnic",
      label: "Lessor CNIC",
      labelUrdu: "لیز دہندہ کا شناختی کارڈ",
      type: "cnic",
      required: true,
      group: "Lessor Details",
    },
    {
      name: "lessorAddress",
      label: "Lessor Address",
      labelUrdu: "لیز دہندہ کا پتہ",
      type: "address",
      required: true,
      group: "Lessor Details",
    },
    {
      name: "lesseeName",
      label: "Lessee (Tenant) Name",
      labelUrdu: "لیز لینے والے (کرایہ دار) کا نام",
      type: "text",
      required: true,
      group: "Lessee Details",
    },
    {
      name: "lesseeCnic",
      label: "Lessee CNIC",
      labelUrdu: "لیز لینے والے کا شناختی کارڈ",
      type: "cnic",
      required: true,
      group: "Lessee Details",
    },
    {
      name: "lesseeAddress",
      label: "Lessee Address",
      labelUrdu: "لیز لینے والے کا پتہ",
      type: "address",
      required: true,
      group: "Lessee Details",
    },
    {
      name: "propertyDescription",
      label: "Property Description",
      labelUrdu: "جائیداد کی تفصیل",
      type: "textarea",
      required: true,
      aiSuggestable: true,
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
      name: "leasePeriod",
      label: "Lease Period (years)",
      labelUrdu: "لیز کی مدت (سال)",
      type: "number",
      required: true,
      group: "Lease Terms",
    },
    {
      name: "monthlyRent",
      label: "Monthly Rent (PKR)",
      labelUrdu: "ماہانہ کرایہ (روپے)",
      type: "number",
      required: true,
      group: "Lease Terms",
    },
    {
      name: "securityDeposit",
      label: "Security Deposit (PKR)",
      labelUrdu: "سیکیورٹی ڈپازٹ (روپے)",
      type: "number",
      required: true,
      group: "Lease Terms",
    },
    {
      name: "maintenanceResponsibility",
      label: "Maintenance Responsibility",
      labelUrdu: "مرمت کی ذمہ داری",
      type: "textarea",
      required: false,
      aiSuggestable: true,
      group: "Lease Terms",
    },
    {
      name: "renewalTerms",
      label: "Renewal Terms",
      labelUrdu: "تجدید کی شرائط",
      type: "textarea",
      required: false,
      aiSuggestable: true,
      group: "Terms",
    },
    {
      name: "terminationClause",
      label: "Termination Clause",
      labelUrdu: "معاہدہ ختم کرنے کی شق",
      type: "textarea",
      required: false,
      aiSuggestable: true,
      group: "Terms",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a Commercial Lease Agreement in {{language}}.

LESSOR:
- Name: {{lessorName}}
- CNIC: {{lessorCnic}}
- Address: {{lessorAddress}}

LESSEE:
- Name: {{lesseeName}}
- CNIC: {{lesseeCnic}}
- Address: {{lesseeAddress}}

PROPERTY:
- Description: {{propertyDescription}}
- Address: {{propertyAddress}}

LEASE TERMS:
- Period: {{leasePeriod}} years
- Monthly Rent: PKR {{monthlyRent}}
- Security Deposit: PKR {{securityDeposit}}
- Maintenance: {{maintenanceResponsibility}}

RENEWAL: {{renewalTerms}}
TERMINATION: {{terminationClause}}

REFERENCE FORMAT — Follow this exact Pakistani legal format:

LEASE AGREEMENT

This Lease Agreement is made and executed on this ___ day of ___________, 20___ at [City].

BETWEEN:

[Lessor Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
(hereinafter referred to as the "LESSOR" / First Party)

AND

[Lessee Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
(hereinafter referred to as the "LESSEE" / Second Party)

WHEREAS both parties have agreed to the following terms and conditions:

1. That the Lessor hereby lets out the commercial property situated at [Property Address] described as [Property Description] to the Lessee.
2. That this lease shall be for a period of [Lease Period] years commencing from __________ and ending on __________.
3. That the monthly rent agreed upon is PKR [Monthly Rent]/- ([Amount in words] only), payable on or before the [__] day of each calendar month.
4. That the Lessee has paid a security deposit of PKR [Security Deposit]/- ([Amount in words] only) which shall be refunded at the time of vacating, after deducting any outstanding dues or damages.
5. That the Lessee shall use the premises solely for [commercial / specified] purpose and shall not sublet or transfer without prior written consent of the Lessor.
6. That the Lessee shall bear all costs of electricity, gas, water and other utility bills during the lease period.
7. That the Lessee shall maintain the premises in good condition and shall not make any structural alterations without the Lessor's written consent.
8. That either party may terminate this agreement by giving [notice period] days written notice.
9. That in case of default in rent payment for [__] consecutive months, the Lessor shall be entitled to terminate this lease and take possession of the premises.

LESSOR                                    LESSEE
[Name]                                    [Name]
CNIC: ___________                         CNIC: ___________

Witness 1: ___________________     Witness 2: ___________________
CNIC: ___________                  CNIC: ___________

INSTRUCTIONS:
- Title: LEASE AGREEMENT (centered, bold)
- BETWEEN / AND party structure with hereinafter clauses
- WHEREAS clause
- Numbered "That..." clauses
- Include security deposit, maintenance, utility, termination clauses
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
