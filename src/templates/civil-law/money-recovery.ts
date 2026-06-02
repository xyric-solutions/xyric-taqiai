import { TemplateDefinition } from "../types";

export const moneyRecovery: TemplateDefinition = {
  category: "civil-law",
  subType: "money-recovery",
  name: "Money Recovery Suit / رقم کی وصولی کا دعویٰ",
  nameUrdu: "رقم کی وصولی کا دعویٰ",
  description: "Suit for recovery of money under Order XXXVII of the Code of Civil Procedure 1908",
  descriptionUrdu: "ضابطہ دیوانی 1908 کے آرڈر XXXVII کے تحت رقم کی وصولی کا دعویٰ",
  icon: "Banknote",
  formFields: [
    {
      name: "plaintiffName",
      label: "Plaintiff's Name",
      labelUrdu: "مدعی کا نام",
      type: "text",
      required: true,
      group: "Plaintiff Details",
    },
    {
      name: "plaintiffAddress",
      label: "Plaintiff's Address",
      labelUrdu: "مدعی کا پتہ",
      type: "address",
      required: true,
      group: "Plaintiff Details",
    },
    {
      name: "plaintiffCnic",
      label: "Plaintiff's CNIC",
      labelUrdu: "مدعی کا شناختی کارڈ",
      type: "cnic",
      required: true,
      group: "Plaintiff Details",
    },
    {
      name: "defendantName",
      label: "Defendant's Name",
      labelUrdu: "مدعا علیہ کا نام",
      type: "text",
      required: true,
      group: "Defendant Details",
    },
    {
      name: "defendantAddress",
      label: "Defendant's Address",
      labelUrdu: "مدعا علیہ کا پتہ",
      type: "address",
      required: true,
      group: "Defendant Details",
    },
    {
      name: "defendantCnic",
      label: "Defendant's CNIC",
      labelUrdu: "مدعا علیہ کا شناختی کارڈ",
      type: "cnic",
      required: false,
      group: "Defendant Details",
    },
    {
      name: "amount",
      label: "Amount to be Recovered (PKR)",
      labelUrdu: "وصولی کی رقم (روپے)",
      type: "number",
      required: true,
      group: "Claim Details",
    },
    {
      name: "basis",
      label: "Basis of Claim",
      labelUrdu: "دعوے کی بنیاد",
      type: "select",
      required: true,
      options: [
        { value: "loan", label: "Loan / Debt", labelUrdu: "قرض" },
        { value: "cheque", label: "Dishonoured Cheque", labelUrdu: "واپس آنے والا چیک" },
        { value: "agreement", label: "Agreement / Contract", labelUrdu: "معاہدہ" },
        { value: "goods", label: "Goods Sold / Services Rendered", labelUrdu: "سامان فروخت / خدمات" },
        { value: "other", label: "Other", labelUrdu: "دیگر" },
      ],
      group: "Claim Details",
    },
    {
      name: "evidence",
      label: "Evidence Available",
      labelUrdu: "دستیاب ثبوت",
      type: "textarea",
      required: true,
      group: "Claim Details",
    },
    {
      name: "facts",
      label: "Facts of the Case",
      labelUrdu: "مقدمے کے حقائق",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Claim Details",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a Suit for Recovery of Money in {{language}}.

PLAINTIFF:
- Name: {{plaintiffName}}
- Address: {{plaintiffAddress}}
- CNIC: {{plaintiffCnic}}

DEFENDANT:
- Name: {{defendantName}}
- Address: {{defendantAddress}}
- CNIC: {{defendantCnic}}

CLAIM DETAILS:
- Amount: PKR {{amount}}
- Basis: {{basis}}
- Evidence: {{evidence}}
- Facts: {{facts}}

REFERENCE FORMAT — Follow this exact Pakistani legal format:

IN THE CIVIL COURT OF [RANK] AT [CITY]

SUIT FOR RECOVERY OF MONEY

[Plaintiff Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
                                                                    ...PLAINTIFF

VERSUS

[Defendant Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
                                                                    ...DEFENDANT

SUIT FOR RECOVERY OF PKR [Amount] (Order XXXVII CPC / Contract Act 1872)

RESPECTFULLY SHEWETH:

1. That the Plaintiff is a citizen of Pakistan and the Defendant is known to the Plaintiff personally.
2. That [basis of claim — loan / cheque / contract / goods supplied / services rendered] and the Defendant owes the Plaintiff a sum of PKR [Amount]/- ([Amount in words] only.
3. That [detailed facts establishing the debt / obligation / default].
4. That despite repeated requests and a legal notice dated [Notice Date], the Defendant has failed and refused to pay the said amount.
5. That the cause of action arose on [Date] and the suit is within limitation under the Limitation Act 1908.

It is therefore most respectfully prayed that this Honourable Court may be pleased to:
(a) Decree the suit in favour of the Plaintiff for PKR [Amount]/- together with markup / interest @ [Rate]% per annum from [Date] till realization;
(b) Award costs of the suit;
(c) [Any other relief].

VERIFICATION:
Verified on oath at [City] that the contents are true and correct.

Plaintiff:
[Name] S/o [Father Name]
CNIC: ___________

Advocate: ___________________

INSTRUCTIONS:
- Court heading: IN THE CIVIL COURT AT [CITY]
- SUIT FOR RECOVERY heading with amount
- Plaintiff and Defendant identification
- "RESPECTFULLY SHEWETH:" opening
- Numbered "That..." paragraphs
- Prayer clause with (a), (b), (c)
- VERIFICATION paragraph
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
