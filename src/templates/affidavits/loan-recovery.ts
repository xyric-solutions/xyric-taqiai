import { TemplateDefinition } from "../types";

export const loanRecoveryAffidavit: TemplateDefinition = {
  category: "affidavit",
  subType: "loan-recovery",
  name: "Loan / Debt Recovery Affidavit",
  nameUrdu: "قرض کی وصولی کا حلف نامہ",
  description: "Affidavit for loan or debt recovery claim",
  descriptionUrdu: "قرض کی وصولی کے دعوے کا حلف نامہ",
  icon: "HandCoins",
  formFields: [
    {
      name: "deponentName",
      label: "Lender / Creditor Name",
      labelUrdu: "قرض دینے والے کا نام",
      type: "text",
      required: true,
      placeholder: "Enter lender's full name",
      placeholderUrdu: "قرض دینے والے کا پورا نام درج کریں",
      group: "Lender Details",
    },
    {
      name: "fatherName",
      label: "Father's / Husband's Name",
      labelUrdu: "والد / شوہر کا نام",
      type: "text",
      required: true,
      placeholder: "Enter father's or husband's name",
      group: "Lender Details",
    },
    {
      name: "cnic",
      label: "CNIC Number",
      labelUrdu: "شناختی کارڈ نمبر",
      type: "cnic",
      required: true,
      placeholder: "XXXXX-XXXXXXX-X",
      validation: { pattern: "^[0-9]{5}-[0-9]{7}-[0-9]$" },
      group: "Lender Details",
    },
    {
      name: "address",
      label: "Residential Address",
      labelUrdu: "رہائشی پتہ",
      type: "address",
      required: true,
      placeholder: "Enter complete address",
      group: "Lender Details",
    },
    {
      name: "city",
      label: "City",
      labelUrdu: "شہر",
      type: "text",
      required: true,
      placeholder: "Enter city name",
      group: "Lender Details",
    },
    {
      name: "debtorName",
      label: "Debtor / Borrower Name",
      labelUrdu: "قرض لینے والے کا نام",
      type: "text",
      required: true,
      placeholder: "Enter borrower's full name",
      group: "Debtor Details",
    },
    {
      name: "debtorFatherName",
      label: "Debtor's Father's Name",
      labelUrdu: "قرض لینے والے کے والد کا نام",
      type: "text",
      required: true,
      placeholder: "Enter debtor's father's name",
      group: "Debtor Details",
    },
    {
      name: "debtorCnic",
      label: "Debtor's CNIC",
      labelUrdu: "قرض لینے والے کا شناختی کارڈ",
      type: "cnic",
      required: false,
      placeholder: "XXXXX-XXXXXXX-X",
      group: "Debtor Details",
    },
    {
      name: "debtorAddress",
      label: "Debtor's Address",
      labelUrdu: "قرض لینے والے کا پتہ",
      type: "address",
      required: true,
      placeholder: "Enter debtor's address",
      group: "Debtor Details",
    },
    {
      name: "loanAmount",
      label: "Total Loan Amount (PKR)",
      labelUrdu: "کل قرض کی رقم (روپے)",
      type: "number",
      required: true,
      placeholder: "Enter total loan amount",
      group: "Loan Details",
    },
    {
      name: "dateOfLoan",
      label: "Date of Loan",
      labelUrdu: "قرض کی تاریخ",
      type: "date",
      required: true,
      group: "Loan Details",
    },
    {
      name: "loanTerms",
      label: "Terms and Conditions of Loan",
      labelUrdu: "قرض کی شرائط و ضوابط",
      type: "textarea",
      required: true,
      placeholder: "Interest rate, repayment schedule, due date, etc.",
      aiSuggestable: true,
      group: "Loan Details",
    },
    {
      name: "amountPending",
      label: "Amount Pending / Outstanding (PKR)",
      labelUrdu: "باقی رقم (روپے)",
      type: "number",
      required: true,
      placeholder: "Enter outstanding amount",
      group: "Loan Details",
    },
    {
      name: "witness1Name",
      label: "Witness 1 Name",
      labelUrdu: "گواہ 1 کا نام",
      type: "text",
      required: false,
      placeholder: "Enter witness name",
      group: "Witnesses",
    },
    {
      name: "witness1Cnic",
      label: "Witness 1 CNIC",
      labelUrdu: "گواہ 1 کا شناختی کارڈ",
      type: "cnic",
      required: false,
      placeholder: "XXXXX-XXXXXXX-X",
      group: "Witnesses",
    },
    {
      name: "witness2Name",
      label: "Witness 2 Name",
      labelUrdu: "گواہ 2 کا نام",
      type: "text",
      required: false,
      placeholder: "Enter witness name",
      group: "Witnesses",
    },
    {
      name: "witness2Cnic",
      label: "Witness 2 CNIC",
      labelUrdu: "گواہ 2 کا شناختی کارڈ",
      type: "cnic",
      required: false,
      placeholder: "XXXXX-XXXXXXX-X",
      group: "Witnesses",
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
      group: "Witnesses",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a formal Loan/Debt Recovery Affidavit in {{language}}.

LENDER DETAILS:
- Name: {{deponentName}}
- Father's/Husband's Name: {{fatherName}}
- CNIC: {{cnic}}
- Address: {{address}}
- City: {{city}}

DEBTOR DETAILS:
- Name: {{debtorName}}
- Father's Name: {{debtorFatherName}}
- CNIC: {{debtorCnic}}
- Address: {{debtorAddress}}

LOAN DETAILS:
- Total Amount: PKR {{loanAmount}}
- Date of Loan: {{dateOfLoan}}
- Terms: {{loanTerms}}
- Amount Pending: PKR {{amountPending}}

WITNESSES:
- Witness 1: {{witness1Name}} (CNIC: {{witness1Cnic}})
- Witness 2: {{witness2Name}} (CNIC: {{witness2Cnic}})

REFERENCE FORMAT — Follow this exact Pakistani legal format:

AFFIDAVIT FOR LOAN / DEBT RECOVERY

I, [Lender Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address], [City], do hereby solemnly affirm and declare as under:

1. That I am personally well acquainted with [Debtor Name] S/o [Debtor Father Name], CNIC No. [Debtor CNIC], resident of [Debtor Address].
2. That on [Date of Loan], I advanced a loan of PKR [Loan Amount]/- ([Amount in words] only) to the said [Debtor Name] in good faith without any coercion or pressure.
3. That the said amount was given on the agreed terms that: [Loan Terms — repayment date, interest if any, conditions].
4. That despite repeated requests and demands, [Debtor Name] has failed and refused to repay the said loan amount of PKR [Amount Pending]/- still outstanding.
5. That I hereby demand repayment of the outstanding amount of PKR [Amount Pending]/- ([Amount in words] only) and put [Debtor Name] on legal notice.
6. That if the above amount is not repaid within [notice period] days, I shall be constrained to initiate legal proceedings for recovery of the said amount together with costs.
7. That the contents of this affidavit are true and correct to the best of my knowledge and belief and nothing has been concealed.

DEPONENT
[Name] S/o [Father Name]
CNIC: ___________

Witness 1: ___________________     Witness 2: ___________________
CNIC: ___________                  CNIC: ___________

ATTESTED
(Oath Commissioner / Notary Public)

INSTRUCTIONS:
- Title: AFFIDAVIT FOR LOAN / DEBT RECOVERY (centered, bold)
- "That..." numbered clauses
- Include loan amount, date, terms, outstanding balance
- Include demand notice with timeframe
- Both witnesses and Oath Commissioner blocks
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
