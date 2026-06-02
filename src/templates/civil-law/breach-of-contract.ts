import { TemplateDefinition } from "../types";

export const breachOfContract: TemplateDefinition = {
  category: "civil-law",
  subType: "breach-of-contract",
  name: "Breach of Contract Suit / معاہدے کی خلاف ورزی کا دعویٰ",
  nameUrdu: "معاہدے کی خلاف ورزی کا دعویٰ",
  description: "Suit for breach of contract under the Contract Act 1872",
  descriptionUrdu: "قانون معاہدہ 1872 کے تحت معاہدے کی خلاف ورزی کا دعویٰ",
  icon: "FileWarning",
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
      name: "contractDetails",
      label: "Contract Details (Date, Nature, Terms)",
      labelUrdu: "معاہدے کی تفصیلات (تاریخ، نوعیت، شرائط)",
      type: "textarea",
      required: true,
      group: "Contract Details",
    },
    {
      name: "breachDescription",
      label: "Description of Breach",
      labelUrdu: "خلاف ورزی کی تفصیل",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Breach Details",
    },
    {
      name: "damagesClaimed",
      label: "Damages Claimed (PKR)",
      labelUrdu: "مطالبہ نقصانات (روپے)",
      type: "number",
      required: true,
      group: "Breach Details",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a Breach of Contract Suit in {{language}}.

PLAINTIFF:
- Name: {{plaintiffName}}
- Address: {{plaintiffAddress}}
- CNIC: {{plaintiffCnic}}

DEFENDANT:
- Name: {{defendantName}}
- Address: {{defendantAddress}}

CONTRACT DETAILS:
{{contractDetails}}

BREACH DETAILS:
- Description: {{breachDescription}}
- Damages Claimed: PKR {{damagesClaimed}}

Generate a complete Suit for Breach of Contract under the Contract Act 1872 as applicable in Pakistan.
Include proper court heading, causeREFERENCE FORMAT - Follow this exact Pakistani legal format:

IN THE CIVIL COURT / COURT OF [JUDGE] AT [CITY]

SUIT FOR DAMAGES FOR BREACH OF CONTRACT
(Under Sections 73 & 74, Contract Act 1872)

[Plaintiff Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
                                                    ...PLAINTIFF
VERSUS
[Defendant Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
                                                    ...DEFENDANT

RESPECTFULLY SHEWETH:

1. That the Plaintiff and Defendant entered into a contract dated [Contract Date] for [Subject Matter] at a total consideration of PKR [Amount]/-.
2. That the Plaintiff duly performed his/her obligations under the said contract.
3. That the Defendant failed / refused to perform his/her obligations under the contract by [Description of Breach].
4. That the Plaintiff suffered losses / damages of PKR [Damages Amount]/- as a direct result of the said breach.
5. That the Plaintiff is entitled to recover the said damages under Section 73 of the Contract Act 1872.
6. That the cause of action arose on [Date of Breach] at [City] and this Court has jurisdiction.

It is therefore most respectfully prayed that this Honourable Court may be pleased to:
(a) Decree a sum of PKR [Amount]/- in favor of the Plaintiff as damages;
(b) Award costs of this suit;
(c) Any other relief as deemed appropriate.

VERIFICATION:
Verified on oath at [City] that the contents are true and correct to the best of my knowledge.

Plaintiff:
[Name] S/o [Father Name]
CNIC: ___________

Advocate: ___________________
Bar No.: ___________________

INSTRUCTIONS:
- Court heading: IN THE CIVIL COURT AT [CITY] (centered, bold)
- Plaintiff vs Defendant identification
- "RESPECTFULLY SHEWETH:" opening
- Numbered "That..." paragraphs
- Reference Contract Act 1872 Sections 73 & 74
- Prayer clause with (a), (b), (c) items
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
