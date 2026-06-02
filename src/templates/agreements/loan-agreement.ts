import { TemplateDefinition } from "../types";

export const loanAgreement: TemplateDefinition = {
  category: "agreement",
  subType: "loan-agreement",
  name: "Loan Agreement",
  nameUrdu: "قرض نامہ",
  description: "Loan agreement between lender and borrower",
  descriptionUrdu: "قرض دہندہ اور قرض لینے والے کے درمیان معاہدہ",
  icon: "Banknote",
  formFields: [
    {
      name: "lenderName",
      label: "Lender Name",
      labelUrdu: "قرض دہندہ کا نام",
      type: "text",
      required: true,
      group: "Lender Details",
    },
    {
      name: "lenderCnic",
      label: "Lender CNIC",
      labelUrdu: "قرض دہندہ کا شناختی کارڈ",
      type: "cnic",
      required: true,
      group: "Lender Details",
    },
    {
      name: "lenderAddress",
      label: "Lender Address",
      labelUrdu: "قرض دہندہ کا پتہ",
      type: "address",
      required: true,
      group: "Lender Details",
    },
    {
      name: "borrowerName",
      label: "Borrower Name",
      labelUrdu: "قرض لینے والے کا نام",
      type: "text",
      required: true,
      group: "Borrower Details",
    },
    {
      name: "borrowerCnic",
      label: "Borrower CNIC",
      labelUrdu: "قرض لینے والے کا شناختی کارڈ",
      type: "cnic",
      required: true,
      group: "Borrower Details",
    },
    {
      name: "borrowerAddress",
      label: "Borrower Address",
      labelUrdu: "قرض لینے والے کا پتہ",
      type: "address",
      required: true,
      group: "Borrower Details",
    },
    {
      name: "loanAmount",
      label: "Loan Amount (PKR)",
      labelUrdu: "قرض کی رقم (روپے)",
      type: "number",
      required: true,
      group: "Loan Details",
    },
    {
      name: "interestRate",
      label: "Interest / Mark-up Rate (% per annum)",
      labelUrdu: "سود / مارک اپ کی شرح (% سالانہ)",
      type: "text",
      required: false,
      placeholder: "Enter rate or 0 for interest-free (Qarz-e-Hasna)",
      placeholderUrdu: "شرح درج کریں یا بلا سود قرض کے لیے 0",
      group: "Loan Details",
    },
    {
      name: "repaymentSchedule",
      label: "Repayment Schedule",
      labelUrdu: "واپسی کا شیڈول",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Loan Details",
    },
    {
      name: "collateral",
      label: "Collateral / Security (if any)",
      labelUrdu: "ضمانت / سیکیورٹی (اگر کوئی ہو)",
      type: "textarea",
      required: false,
      aiSuggestable: true,
      group: "Security Details",
    },
    {
      name: "guarantorName",
      label: "Guarantor Name (if any)",
      labelUrdu: "ضامن کا نام (اگر کوئی ہو)",
      type: "text",
      required: false,
      group: "Security Details",
    },
    {
      name: "guarantorCnic",
      label: "Guarantor CNIC",
      labelUrdu: "ضامن کا شناختی کارڈ",
      type: "cnic",
      required: false,
      group: "Security Details",
    },
    {
      name: "defaultClause",
      label: "Default / Late Payment Clause",
      labelUrdu: "ادائیگی میں تاخیر کی شق",
      type: "textarea",
      required: false,
      aiSuggestable: true,
      group: "Terms",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a Loan Agreement in {{language}}.

LENDER:
- Name: {{lenderName}}
- CNIC: {{lenderCnic}}
- Address: {{lenderAddress}}

BORROWER:
- Name: {{borrowerName}}
- CNIC: {{borrowerCnic}}
- Address: {{borrowerAddress}}

LOAN DETAILS:
- Amount: PKR {{loanAmount}}
- Interest/Mark-up Rate: {{interestRate}}%
- Repayment Schedule: {{repaymentSchedule}}

SECURITY:
- Collateral: {{collateral}}
- Guarantor: {{guarantorName}} (CNIC: {{guarantorCnic}})

DEFAULT CLAUSE: {{defaultClause}}

REFERENCE FORMAT — Follow this exact Pakistani legal format:

LOAN AGREEMENT (QARZ NAMA)

This Loan Agreement is made and executed at [City] on this ___ day of ___________, 20___.

BETWEEN:

[Lender Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
(hereinafter called the "LENDER" / First Party)

AND

[Borrower Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
(hereinafter called the "BORROWER" / Second Party)

WHEREAS both parties have agreed to the following terms and conditions:

1. That the Lender has agreed to lend and the Borrower has agreed to borrow a sum of PKR [Loan Amount]/- ([Amount in words] only).
2. That the said loan has been advanced by the Lender to the Borrower this date, receipt of which is hereby acknowledged by the Borrower.
3. That the said loan shall be repaid as per the following schedule: [Repayment Schedule].
4. That the loan shall carry [interest/markup at [Rate]% per annum / no interest — Qarz-e-Hasna].
5. That as security for repayment, the Borrower hereby provides [Collateral / Guarantor details if any].
6. That [Guarantor Name] S/o [Father Name], CNIC No. [Guarantor CNIC], stands as guarantor and undertakes to repay the said loan in case of default by the Borrower.
7. That in case of default in repayment, the Lender shall be entitled to take legal action for recovery of the entire outstanding amount.
8. That any dispute arising out of this agreement shall be settled through mutual negotiation or through arbitration under Pakistani law.

LENDER                                    BORROWER
[Name]                                    [Name]
CNIC: ___________                         CNIC: ___________

GUARANTOR
[Name] S/o [Father Name]
CNIC: ___________

Witness 1: ___________________     Witness 2: ___________________
CNIC: ___________                  CNIC: ___________

INSTRUCTIONS:
- Title: LOAN AGREEMENT (centered, bold)
- BETWEEN / AND party structure
- WHEREAS clause
- Numbered "That..." clauses
- Include guarantor signature block if applicable
- If interest-free: use "Qarz-e-Hasna" language
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
