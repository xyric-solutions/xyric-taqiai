import { TemplateDefinition } from "../types";

export const guarantorAgreement: TemplateDefinition = {
  category: "agreement",
  subType: "guarantor-agreement",
  name: "Guarantor / Surety Agreement",
  nameUrdu: "ضامن نامہ",
  description: "Agreement where a guarantor undertakes liability for another's debt",
  descriptionUrdu: "معاہدہ جس میں ضامن کسی دوسرے کے قرض کی ذمہ داری لیتا ہے",
  icon: "ShieldCheck",
  formFields: [
    {
      name: "guarantorName",
      label: "Guarantor / Surety Name",
      labelUrdu: "ضامن کا نام",
      type: "text",
      required: true,
      group: "Guarantor Details",
    },
    {
      name: "guarantorFatherName",
      label: "Guarantor's Father's Name",
      labelUrdu: "ضامن کے والد کا نام",
      type: "text",
      required: true,
      group: "Guarantor Details",
    },
    {
      name: "guarantorCnic",
      label: "Guarantor CNIC",
      labelUrdu: "ضامن کا شناختی کارڈ",
      type: "cnic",
      required: true,
      group: "Guarantor Details",
    },
    {
      name: "guarantorAddress",
      label: "Guarantor Address",
      labelUrdu: "ضامن کا پتہ",
      type: "address",
      required: true,
      group: "Guarantor Details",
    },
    {
      name: "principalDebtorName",
      label: "Principal Debtor Name",
      labelUrdu: "اصل مقروض کا نام",
      type: "text",
      required: true,
      group: "Principal Debtor Details",
    },
    {
      name: "principalDebtorCnic",
      label: "Principal Debtor CNIC",
      labelUrdu: "اصل مقروض کا شناختی کارڈ",
      type: "cnic",
      required: true,
      group: "Principal Debtor Details",
    },
    {
      name: "principalDebtorAddress",
      label: "Principal Debtor Address",
      labelUrdu: "اصل مقروض کا پتہ",
      type: "address",
      required: true,
      group: "Principal Debtor Details",
    },
    {
      name: "creditorName",
      label: "Creditor Name",
      labelUrdu: "قرض دہندہ کا نام",
      type: "text",
      required: true,
      group: "Creditor Details",
    },
    {
      name: "creditorCnic",
      label: "Creditor CNIC / Registration No",
      labelUrdu: "قرض دہندہ کا شناختی کارڈ / رجسٹریشن نمبر",
      type: "text",
      required: true,
      group: "Creditor Details",
    },
    {
      name: "creditorAddress",
      label: "Creditor Address",
      labelUrdu: "قرض دہندہ کا پتہ",
      type: "address",
      required: true,
      group: "Creditor Details",
    },
    {
      name: "guaranteedAmount",
      label: "Guaranteed Amount (PKR)",
      labelUrdu: "ضمانت کی رقم (روپے)",
      type: "number",
      required: true,
      group: "Guarantee Terms",
    },
    {
      name: "scopeOfGuarantee",
      label: "Scope of Guarantee",
      labelUrdu: "ضمانت کا دائرہ کار",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Guarantee Terms",
    },
    {
      name: "duration",
      label: "Guarantee Duration",
      labelUrdu: "ضمانت کی مدت",
      type: "text",
      required: true,
      group: "Guarantee Terms",
    },
    {
      name: "conditions",
      label: "Conditions for Invoking Guarantee",
      labelUrdu: "ضمانت نافذ کرنے کی شرائط",
      type: "textarea",
      required: false,
      aiSuggestable: true,
      group: "Terms",
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
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a Guarantor/Surety Agreement (Zamin Nama) in {{language}}.

GUARANTOR:
- Name: {{guarantorName}}
- Father's Name: {{guarantorFatherName}}
- CNIC: {{guarantorCnic}}
- Address: {{guarantorAddress}}

PRINCIPAL DEBTOR:
- Name: {{principalDebtorName}}
- CNIC: {{principalDebtorCnic}}
- Address: {{principalDebtorAddress}}

CREDITOR:
- Name: {{creditorName}}
- CNIC/Registration: {{creditorCnic}}
- Address: {{creditorAddress}}

GUARANTEE:
- Amount: PKR {{guaranteedAmount}}
- Scope: {{scopeOfGuarantee}}
- Duration: {{duration}}
- Conditions: {{conditions}}

ADDITIONAL: {{additionalTerms}}

Generate a complete Guarantor/Surety Agreement following Pakistani Contract Act (Sections 124-147). Include guarantee undertaking, scope and extent ofREFERENCE FORMAT - Follow this exact Pakistani legal format:

GUARANTEE AGREEMENT / IQRAR NAMA ZAMIN

This Guarantee Agreement is made and executed on this ___ day of ___________, 20___ at [City].

BETWEEN:

[Creditor / Bank Name], [Address]
(hereinafter called the "CREDITOR / LENDER")

AND

[Principal Debtor Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
(hereinafter called the "PRINCIPAL DEBTOR / BORROWER")

AND

[Guarantor Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
(hereinafter called the "GUARANTOR / SURETY")

NOW THEREFORE ALL PARTIES AGREE AS UNDER:

1. That the Creditor has extended / agreed to extend a loan / credit facility of PKR [Amount]/- to the Principal Debtor.
2. That the Guarantor hereby unconditionally and irrevocably guarantees to the Creditor repayment of the said amount with interest / markup if the Principal Debtor fails to repay.
3. That this guarantee is a continuing guarantee and shall remain in force until full repayment.
4. That the Guarantor waives all rights of first proceeding against the Principal Debtor before demanding from the Guarantor.
5. That the Guarantor's liability shall not exceed PKR [Maximum Guarantee Amount]/-.
6. That the Guarantor shall be entitled to recover from the Principal Debtor any amount paid by him/her under this guarantee.

CREDITOR                   PRINCIPAL DEBTOR          GUARANTOR
[Name]                     [Name]                    [Name]
CNIC: ___________          CNIC: ___________         CNIC: ___________

Witness 1: ___________________   Witness 2: ___________________

INSTRUCTIONS:
- Title: GUARANTEE AGREEMENT (centered, bold)
- THREE party structure (Creditor, Principal Debtor, Guarantor)
- Numbered "That..." clauses
- Include guarantee amount, unconditional obligation, right of recovery
- Three signatures at bottom
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
