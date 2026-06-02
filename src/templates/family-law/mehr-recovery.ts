import { TemplateDefinition } from "../types";

export const mehrRecovery: TemplateDefinition = {
  category: "family-law",
  subType: "mehr-recovery",
  name: "Haq Mehr Recovery Suit",
  nameUrdu: "حق مہر کی وصولی کا دعویٰ",
  description: "Suit for recovery of dower/haq mehr from husband",
  descriptionUrdu: "شوہر سے حق مہر کی وصولی کا مقدمہ",
  icon: "HandHeart",
  formFields: [
    {
      name: "wifeName",
      label: "Wife's Name",
      labelUrdu: "بیوی کا نام",
      type: "text",
      required: true,
      group: "Wife Details",
    },
    {
      name: "wifeFatherName",
      label: "Wife's Father's Name",
      labelUrdu: "بیوی کے والد کا نام",
      type: "text",
      required: true,
      group: "Wife Details",
    },
    {
      name: "wifeCnic",
      label: "Wife's CNIC",
      labelUrdu: "بیوی کا شناختی کارڈ",
      type: "cnic",
      required: true,
      group: "Wife Details",
    },
    {
      name: "wifeAddress",
      label: "Wife's Address",
      labelUrdu: "بیوی کا پتہ",
      type: "address",
      required: true,
      group: "Wife Details",
    },
    {
      name: "husbandName",
      label: "Husband's Name",
      labelUrdu: "شوہر کا نام",
      type: "text",
      required: true,
      group: "Husband Details",
    },
    {
      name: "husbandFatherName",
      label: "Husband's Father's Name",
      labelUrdu: "شوہر کے والد کا نام",
      type: "text",
      required: true,
      group: "Husband Details",
    },
    {
      name: "husbandCnic",
      label: "Husband's CNIC",
      labelUrdu: "شوہر کا شناختی کارڈ",
      type: "cnic",
      required: false,
      group: "Husband Details",
    },
    {
      name: "husbandAddress",
      label: "Husband's Address",
      labelUrdu: "شوہر کا پتہ",
      type: "address",
      required: true,
      group: "Husband Details",
    },
    {
      name: "marriageDate",
      label: "Date of Marriage",
      labelUrdu: "تاریخ نکاح",
      type: "date",
      required: true,
      group: "Marriage Details",
    },
    {
      name: "nikahRegistrationNo",
      label: "Nikah Registration No.",
      labelUrdu: "نکاح رجسٹریشن نمبر",
      type: "text",
      required: false,
      group: "Marriage Details",
    },
    {
      name: "mehrType",
      label: "Mehr Type",
      labelUrdu: "مہر کی قسم",
      type: "select",
      required: true,
      options: [
        { value: "muajjal", label: "Muajjal (Prompt)", labelUrdu: "معجل (فوری)" },
        { value: "muwajjal", label: "Muwajjal (Deferred)", labelUrdu: "مؤجل (مؤخر)" },
        { value: "both", label: "Both", labelUrdu: "دونوں" },
      ],
      group: "Mehr Details",
    },
    {
      name: "totalMehrAmount",
      label: "Total Mehr Amount (PKR)",
      labelUrdu: "کل مہر کی رقم (روپے)",
      type: "number",
      required: true,
      group: "Mehr Details",
    },
    {
      name: "amountPaid",
      label: "Amount Already Paid (PKR)",
      labelUrdu: "ادا شدہ رقم (روپے)",
      type: "number",
      required: true,
      group: "Mehr Details",
    },
    {
      name: "amountRemaining",
      label: "Amount Remaining (PKR)",
      labelUrdu: "باقی رقم (روپے)",
      type: "number",
      required: true,
      group: "Mehr Details",
    },
    {
      name: "grounds",
      label: "Grounds for Recovery",
      labelUrdu: "وصولی کی بنیاد",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Case Details",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a Haq Mehr Recovery Suit in {{language}}.

WIFE (PLAINTIFF):
- Name: {{wifeName}}
- Father's Name: {{wifeFatherName}}
- CNIC: {{wifeCnic}}
- Address: {{wifeAddress}}

HUSBAND (DEFENDANT):
- Name: {{husbandName}}
- Father's Name: {{husbandFatherName}}
- CNIC: {{husbandCnic}}
- Address: {{husbandAddress}}

MARRIAGE:
- Date: {{marriageDate}}
- Registration No: {{nikahRegistrationNo}}

MEHR:
- Type: {{mehrType}}
- Total Amount: PKR {{totalMehrAmount}}
- Amount Paid: PKR {{amountPaid}}
- Amount Remaining: PKR {{amountRemaining}}

GROUNDS: {{grounds}}

Generate a complete Haq Mehr Recovery Suit under the West Pakistan Family Courts Act 1964.
Reference Muslim Family REFERENCE FORMAT - Follow this exact Pakistani legal format:

IN THE FAMILY COURT AT [CITY]

SUIT FOR RECOVERY OF MEHR / DOWER
(Under Section 5, West Pakistan Family Courts Act 1964)

Mst. [Wife Name] D/o [Father Name], CNIC No. [CNIC], resident of [Address]
                                                    ...PLAINTIFF
VERSUS
[Husband Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
                                                    ...DEFENDANT

RESPECTFULLY SHEWETH:

1. That the Plaintiff and Defendant were married on [Nikah Date] and the Haq Mehr was fixed at PKR [Total Mehr Amount]/-.
2. That PKR [Prompt Mehr]/- was fixed as Muajjal (prompt) Mehr payable immediately, and PKR [Deferred Mehr]/- as Muwajjal (deferred) Mehr payable on demand / divorce.
3. That the Defendant has not paid the outstanding Mehr of PKR [Unpaid Amount]/- to the Plaintiff despite repeated demands.
4. That on [Date of Divorce / Talaq], the parties got divorced and the Mehr became immediately payable.
5. That the Plaintiff is entitled to recover the Mehr as it is a legal and Islamic obligation under the Muslim Family Laws Ordinance 1961.

It is therefore most respectfully prayed that this Honourable Court may be pleased to:
(a) Decree PKR [Amount]/- as Haq Mehr in favor of the Plaintiff;
(b) Award costs of this suit;
(c) Any other appropriate relief.

VERIFICATION:
Verified on oath at [City] that the contents are true and correct to the best of my knowledge.

Plaintiff:
Mst. [Name] D/o [Father Name]
CNIC: ___________

Advocate: ___________________

INSTRUCTIONS:
- Court heading: IN THE FAMILY COURT AT [CITY] (centered, bold)
- SUIT FOR RECOVERY OF MEHR heading
- Wife as Plaintiff, Husband as Defendant
- "RESPECTFULLY SHEWETH:" opening
- Numbered "That..." paragraphs: Nikah date, Mehr amount (Muajjal/Muwajjal), non-payment, divorce date
- Reference Muslim Family Laws Ordinance 1961
- Prayer clause with (a), (b), (c) items
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
