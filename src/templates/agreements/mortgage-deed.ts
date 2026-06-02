import { TemplateDefinition } from "../types";

export const mortgageDeed: TemplateDefinition = {
  category: "agreement",
  subType: "mortgage-deed",
  name: "Mortgage Deed",
  nameUrdu: "رہن نامہ",
  description: "Mortgage deed for securing a loan against property",
  descriptionUrdu: "جائیداد کے عوض قرض کی ضمانت کا رہن نامہ",
  icon: "KeyRound",
  formFields: [
    {
      name: "mortgagorName",
      label: "Mortgagor (Borrower) Name",
      labelUrdu: "رہن رکھنے والے (قرض لینے والے) کا نام",
      type: "text",
      required: true,
      group: "Mortgagor Details",
    },
    {
      name: "mortgagorFatherName",
      label: "Mortgagor's Father's Name",
      labelUrdu: "رہن رکھنے والے کے والد کا نام",
      type: "text",
      required: true,
      group: "Mortgagor Details",
    },
    {
      name: "mortgagorCnic",
      label: "Mortgagor CNIC",
      labelUrdu: "رہن رکھنے والے کا شناختی کارڈ",
      type: "cnic",
      required: true,
      group: "Mortgagor Details",
    },
    {
      name: "mortgagorAddress",
      label: "Mortgagor Address",
      labelUrdu: "رہن رکھنے والے کا پتہ",
      type: "address",
      required: true,
      group: "Mortgagor Details",
    },
    {
      name: "mortgageeName",
      label: "Mortgagee (Lender) Name",
      labelUrdu: "رہن لینے والے (قرض دینے والے) کا نام",
      type: "text",
      required: true,
      group: "Mortgagee Details",
    },
    {
      name: "mortgageeFatherName",
      label: "Mortgagee's Father's Name",
      labelUrdu: "رہن لینے والے کے والد کا نام",
      type: "text",
      required: true,
      group: "Mortgagee Details",
    },
    {
      name: "mortgageeCnic",
      label: "Mortgagee CNIC",
      labelUrdu: "رہن لینے والے کا شناختی کارڈ",
      type: "cnic",
      required: true,
      group: "Mortgagee Details",
    },
    {
      name: "mortgageeAddress",
      label: "Mortgagee Address",
      labelUrdu: "رہن لینے والے کا پتہ",
      type: "address",
      required: true,
      group: "Mortgagee Details",
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
      name: "loanAmount",
      label: "Loan Amount (PKR)",
      labelUrdu: "قرض کی رقم (روپے)",
      type: "number",
      required: true,
      group: "Financial Details",
    },
    {
      name: "interestRate",
      label: "Interest / Markup Rate (% per annum)",
      labelUrdu: "سود / مارک اپ کی شرح (% سالانہ)",
      type: "text",
      required: false,
      group: "Financial Details",
    },
    {
      name: "repaymentTerms",
      label: "Repayment Terms",
      labelUrdu: "واپسی کی شرائط",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Financial Details",
    },
    {
      name: "defaultClause",
      label: "Default Clause",
      labelUrdu: "ادائیگی میں کوتاہی کی شق",
      type: "textarea",
      required: false,
      aiSuggestable: true,
      group: "Terms",
    },
    {
      name: "redemptionTerms",
      label: "Redemption Terms",
      labelUrdu: "فکاک / واپسی کی شرائط",
      type: "textarea",
      required: false,
      aiSuggestable: true,
      group: "Terms",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a Mortgage Deed (Rehn Nama) in {{language}}.

MORTGAGOR (BORROWER):
- Name: {{mortgagorName}}
- Father's Name: {{mortgagorFatherName}}
- CNIC: {{mortgagorCnic}}
- Address: {{mortgagorAddress}}

MORTGAGEE (LENDER):
- Name: {{mortgageeName}}
- Father's Name: {{mortgageeFatherName}}
- CNIC: {{mortgageeCnic}}
- Address: {{mortgageeAddress}}

PROPERTY:
- Description: {{propertyDescription}}
- Address: {{propertyAddress}}

FINANCIAL:
- Loan Amount: PKR {{loanAmount}}
- Interest/Markup: {{interestRate}}%
- Repayment: {{repaymentTerms}}

DEFAULT: {{defaultClause}}
REDEMPTION: {{redemptionTerms}}

REFERENCE FORMAT — Follow this exact Pakistani legal format:

MORTGAGE DEED (REHN NAMA)

This Mortgage Deed is made and executed at [City] on this ___ day of ___________, 20___.

BETWEEN:

[Mortgagor Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
(hereinafter called the "MORTGAGOR" / First Party)

AND

[Mortgagee Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
(hereinafter called the "MORTGAGEE" / Second Party)

WHEREAS the Mortgagor requires a loan and the Mortgagee has agreed to advance the same against mortgage of the property described below.

PROPERTY DESCRIPTION:
[Property Description] situated at [Property Address]

NOW THEREFORE THESE PRESENTS WITNESSETH:

1. That in consideration of the loan of PKR [Loan Amount]/- ([Amount in words] only) advanced by the Mortgagee to the Mortgagor (receipt of which is hereby acknowledged), the Mortgagor hereby mortgages the above-described property to the Mortgagee as security for repayment.
2. That the Mortgagor shall repay the said loan amount along with markup/interest at [Interest Rate]% per annum within [Repayment Terms].
3. That the Mortgagor warrants that the property is free from all prior encumbrances and he/she has full authority to mortgage the same.
4. That in case of default in repayment, the Mortgagee shall have the right to take possession of the mortgaged property and apply for foreclosure as per law.
5. That upon repayment of the full loan amount, this mortgage shall stand redeemed and the Mortgagee shall release all claims on the said property.
6. That the Mortgagor shall maintain the mortgaged property in good condition and shall not sell, transfer or further encumber it without prior written consent of the Mortgagee.

MORTGAGOR                                 MORTGAGEE
[Name]                                    [Name]
CNIC: ___________                         CNIC: ___________

Witness 1: ___________________     Witness 2: ___________________
CNIC: ___________                  CNIC: ___________

INSTRUCTIONS:
- Title: MORTGAGE DEED (centered, bold)
- BETWEEN / AND party structure with hereinafter clauses
- WHEREAS clause for loan need
- PROPERTY DESCRIPTION section
- Numbered "That..." clauses covering: loan amount, repayment, warranty, default, redemption
- Both signatures at bottom
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
