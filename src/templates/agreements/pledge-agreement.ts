import { TemplateDefinition } from "../types";

export const pledgeAgreement: TemplateDefinition = {
  category: "agreement",
  subType: "pledge-agreement",
  name: "Pledge Agreement",
  nameUrdu: "گروی نامہ",
  description: "Agreement for pledging movable property as security for a loan",
  descriptionUrdu: "قرض کی ضمانت کے طور پر منقولہ جائیداد گروی رکھنے کا معاہدہ",
  icon: "Lock",
  formFields: [
    {
      name: "pledgorName",
      label: "Pledgor (Owner) Name",
      labelUrdu: "گروی رکھنے والے (مالک) کا نام",
      type: "text",
      required: true,
      group: "Pledgor Details",
    },
    {
      name: "pledgorFatherName",
      label: "Pledgor's Father's Name",
      labelUrdu: "گروی رکھنے والے کے والد کا نام",
      type: "text",
      required: true,
      group: "Pledgor Details",
    },
    {
      name: "pledgorCnic",
      label: "Pledgor CNIC",
      labelUrdu: "گروی رکھنے والے کا شناختی کارڈ",
      type: "cnic",
      required: true,
      group: "Pledgor Details",
    },
    {
      name: "pledgorAddress",
      label: "Pledgor Address",
      labelUrdu: "گروی رکھنے والے کا پتہ",
      type: "address",
      required: true,
      group: "Pledgor Details",
    },
    {
      name: "pledgeeName",
      label: "Pledgee (Lender) Name",
      labelUrdu: "گروی لینے والے (قرض دہندہ) کا نام",
      type: "text",
      required: true,
      group: "Pledgee Details",
    },
    {
      name: "pledgeeFatherName",
      label: "Pledgee's Father's Name",
      labelUrdu: "گروی لینے والے کے والد کا نام",
      type: "text",
      required: true,
      group: "Pledgee Details",
    },
    {
      name: "pledgeeCnic",
      label: "Pledgee CNIC",
      labelUrdu: "گروی لینے والے کا شناختی کارڈ",
      type: "cnic",
      required: true,
      group: "Pledgee Details",
    },
    {
      name: "pledgeeAddress",
      label: "Pledgee Address",
      labelUrdu: "گروی لینے والے کا پتہ",
      type: "address",
      required: true,
      group: "Pledgee Details",
    },
    {
      name: "pledgedGoodsDescription",
      label: "Pledged Goods Description",
      labelUrdu: "گروی رکھے جانے والے سامان کی تفصیل",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Pledge Details",
    },
    {
      name: "estimatedValue",
      label: "Estimated Value of Pledged Goods (PKR)",
      labelUrdu: "گروی شدہ سامان کی تخمینی قیمت (روپے)",
      type: "number",
      required: true,
      group: "Pledge Details",
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
      name: "pledgePeriod",
      label: "Pledge Period (months)",
      labelUrdu: "گروی کی مدت (مہینے)",
      type: "number",
      required: true,
      group: "Financial Details",
    },
    {
      name: "termsOfPledge",
      label: "Terms of Pledge",
      labelUrdu: "گروی کی شرائط",
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
    {
      name: "defaultClause",
      label: "Default / Forfeiture Clause",
      labelUrdu: "ادائیگی میں کوتاہی / ضبطی کی شق",
      type: "textarea",
      required: false,
      aiSuggestable: true,
      group: "Terms",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a Pledge Agreement (Girvi Nama) in {{language}}.

PLEDGOR (OWNER):
- Name: {{pledgorName}}
- Father's Name: {{pledgorFatherName}}
- CNIC: {{pledgorCnic}}
- Address: {{pledgorAddress}}

PLEDGEE (LENDER):
- Name: {{pledgeeName}}
- Father's Name: {{pledgeeFatherName}}
- CNIC: {{pledgeeCnic}}
- Address: {{pledgeeAddress}}

PLEDGED GOODS:
- Description: {{pledgedGoodsDescription}}
- Estimated Value: PKR {{estimatedValue}}

FINANCIAL:
- Loan Amount: PKR {{loanAmount}}
- Pledge Period: {{pledgePeriod}} months

TERMS:
- Pledge Terms: {{termsOfPledge}}
- Redemption: {{redemptionTerms}}
- Default Clause: {{defaultClause}}

Generate a complete Pledge Agreement following Pakistani Contract Act (Section 172-179). Include descriptioREFERENCE FORMAT - Follow this exact Pakistani legal format:

PLEDGE AGREEMENT / GIRWI NAMA

This Pledge Agreement is made and executed on this ___ day of ___________, 20___ at [City].

BETWEEN:

[Pledger Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
(hereinafter called the "PLEDGER / DEBTOR")

AND

[Pledgee Name / Lender] S/o [Father Name] / [Company], CNIC No. / NTN [Number], [Address]
(hereinafter called the "PLEDGEE / CREDITOR")

NOW THEREFORE BOTH PARTIES AGREE AS UNDER:

1. That the Pledger hereby pledges [Description of Pledged Asset - jewelry / vehicle / goods / property documents] to the Pledgee as security for a loan of PKR [Loan Amount]/-.
2. That the said pledged asset has been delivered / handed over to the Pledgee on the date of this agreement.
3. That the Pledgee shall keep the pledged asset safely and shall be liable for any loss due to negligence.
4. That the Pledger shall repay the loan amount of PKR [Amount]/- with markup of [Rate]% by [Repayment Date].
5. That upon repayment, the Pledgee shall immediately return the pledged asset to the Pledger.
6. That in case of default, the Pledgee shall be entitled to sell the pledged asset and recover the outstanding amount.

PLEDGER                                 PLEDGEE
[Name]                                  [Name / Firm]
CNIC: ___________                       CNIC / NTN: ___________

Witness 1: ___________________   Witness 2: ___________________

INSTRUCTIONS:
- Title: PLEDGE AGREEMENT / GIRWI NAMA (centered, bold)
- BETWEEN / AND party structure
- Numbered "That..." clauses
- Include description of pledged asset, loan amount, repayment date, default consequences
- Both signatures at bottom
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
