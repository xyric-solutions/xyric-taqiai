import { TemplateDefinition } from "../types";

export const bankAffidavit: TemplateDefinition = {
  category: "affidavit",
  subType: "bank-affidavit",
  name: "Bank Account Affidavit",
  nameUrdu: "بینک اکاؤنٹ حلف نامہ",
  description: "Affidavit for bank account related claims and issues",
  descriptionUrdu: "بینک اکاؤنٹ سے متعلق دعووں اور مسائل کا حلف نامہ",
  icon: "Landmark",
  formFields: [
    {
      name: "deponentName",
      label: "Deponent Name",
      labelUrdu: "حلف اٹھانے والے کا نام",
      type: "text",
      required: true,
      placeholder: "Enter full name",
      placeholderUrdu: "پورا نام درج کریں",
      group: "Deponent Details",
    },
    {
      name: "fatherName",
      label: "Father's / Husband's Name",
      labelUrdu: "والد / شوہر کا نام",
      type: "text",
      required: true,
      placeholder: "Enter father's or husband's name",
      group: "Deponent Details",
    },
    {
      name: "cnic",
      label: "CNIC Number",
      labelUrdu: "شناختی کارڈ نمبر",
      type: "cnic",
      required: true,
      placeholder: "XXXXX-XXXXXXX-X",
      validation: { pattern: "^[0-9]{5}-[0-9]{7}-[0-9]$" },
      group: "Deponent Details",
    },
    {
      name: "address",
      label: "Residential Address",
      labelUrdu: "رہائشی پتہ",
      type: "address",
      required: true,
      placeholder: "Enter complete address",
      group: "Deponent Details",
    },
    {
      name: "bankName",
      label: "Bank Name",
      labelUrdu: "بینک کا نام",
      type: "text",
      required: true,
      placeholder: "Enter bank name",
      placeholderUrdu: "بینک کا نام درج کریں",
      group: "Bank Details",
    },
    {
      name: "branchName",
      label: "Branch Name / Code",
      labelUrdu: "برانچ کا نام / کوڈ",
      type: "text",
      required: true,
      placeholder: "Enter branch name or code",
      group: "Bank Details",
    },
    {
      name: "accountNumber",
      label: "Account Number",
      labelUrdu: "اکاؤنٹ نمبر",
      type: "text",
      required: true,
      placeholder: "Enter account number",
      group: "Bank Details",
    },
    {
      name: "accountHolderName",
      label: "Account Holder Name",
      labelUrdu: "اکاؤنٹ ہولڈر کا نام",
      type: "text",
      required: false,
      placeholder: "Enter account holder's name (if different from deponent)",
      group: "Bank Details",
    },
    {
      name: "purpose",
      label: "Purpose",
      labelUrdu: "مقصد",
      type: "select",
      required: true,
      options: [
        { value: "deceased-claim", label: "Claim Deceased's Account", labelUrdu: "مرحوم کے اکاؤنٹ کا دعویٰ" },
        { value: "unblock", label: "Unblock Account", labelUrdu: "اکاؤنٹ ان بلاک" },
        { value: "lost-passbook", label: "Lost Passbook/Cheque Book", labelUrdu: "گم شدہ پاس بک / چیک بک" },
        { value: "name-correction", label: "Name Correction", labelUrdu: "نام درستگی" },
        { value: "signature-mismatch", label: "Signature Mismatch", labelUrdu: "دستخط مماثلت" },
        { value: "other", label: "Other", labelUrdu: "دیگر" },
      ],
      group: "Claim Details",
    },
    {
      name: "details",
      label: "Details / Circumstances",
      labelUrdu: "تفصیلات / حالات",
      type: "textarea",
      required: true,
      placeholder: "Describe the issue or claim in detail",
      aiSuggestable: true,
      group: "Claim Details",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a formal Bank Account Affidavit (بینک اکاؤنٹ حلف نامہ) in {{language}}.

DEPONENT DETAILS:
- Name: {{deponentName}}
- Father's/Husband's Name: {{fatherName}}
- CNIC: {{cnic}}
- Address: {{address}}

BANK DETAILS:
- Bank: {{bankName}}
- Branch: {{branchName}}
- Account Number: {{accountNumber}}
- Account Holder: {{accountHolderName}}

CLAIM DETAILS:
- Purpose: {{purpose}}
- Details: {{details}}

REFERENCE FORMAT — Follow this exact Pakistani legal format:

AFFIDAVIT FOR BANK ACCOUNT

I, [Deponent Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address], do hereby solemnly affirm and declare as under:

1. That I am the account holder / legal heir / claimant of Bank Account No. [Account Number] maintained with [Bank Name], Branch [Branch Name / Address].
2. That the purpose of this affidavit is: [Purpose — claim of deceased's account / unblocking account / lost passbook / name correction].
3. That [specific facts relevant to purpose]:
   - For deceased account: That [Deceased Name] passed away on [Date] and I am his/her [Relationship] and entitled to claim the said account.
   - For unblock: That the account was blocked due to [Reason] and I request its unblocking.
   - For lost passbook: That the original passbook was lost on [Date] and I request issuance of a duplicate.
4. That I hereby indemnify and hold harmless [Bank Name] against all losses, claims, damages, or expenses arising out of acting on this affidavit.
5. That the contents of this affidavit are true and correct to the best of my knowledge and belief and nothing has been concealed.

DEPONENT
[Name] S/o [Father Name]
CNIC: ___________
Account No.: ___________

VERIFICATION:
Verified on oath at [City] on this ___ day of ___________ that the contents of the above affidavit are true and correct to the best of my knowledge and belief and nothing has been concealed therein.

DEPONENT

ATTESTED
(Oath Commissioner / Notary Public / Class-1 Officer)

INSTRUCTIONS:
- Title: AFFIDAVIT FOR BANK ACCOUNT (centered, bold)
- "That..." numbered clauses
- Include bank name and account number
- Purpose-specific facts
- Include indemnity clause for the bank
- Include VERIFICATION paragraph
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
