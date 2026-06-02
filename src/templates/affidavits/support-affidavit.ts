import { TemplateDefinition } from "../types";

export const supportAffidavit: TemplateDefinition = {
  category: "affidavit",
  subType: "support-affidavit",
  name: "Support Affidavit",
  nameUrdu: "کفالت نامہ",
  description: "Affidavit of financial support/sponsorship",
  descriptionUrdu: "مالی کفالت کا حلف نامہ",
  icon: "HandHeart",
  formFields: [
    {
      name: "sponsorName",
      label: "Sponsor Name",
      labelUrdu: "کفیل کا نام",
      type: "text",
      required: true,
      group: "Sponsor Details",
    },
    {
      name: "sponsorFatherName",
      label: "Sponsor's Father's Name",
      labelUrdu: "کفیل کے والد کا نام",
      type: "text",
      required: true,
      group: "Sponsor Details",
    },
    {
      name: "sponsorCnic",
      label: "Sponsor CNIC",
      labelUrdu: "کفیل کا شناختی کارڈ",
      type: "cnic",
      required: true,
      group: "Sponsor Details",
    },
    {
      name: "sponsorOccupation",
      label: "Sponsor's Occupation",
      labelUrdu: "کفیل کا پیشہ",
      type: "text",
      required: true,
      group: "Sponsor Details",
    },
    {
      name: "sponsorIncome",
      label: "Monthly Income (PKR)",
      labelUrdu: "ماہانہ آمدنی (روپے)",
      type: "number",
      required: true,
      group: "Sponsor Details",
    },
    {
      name: "dependentName",
      label: "Dependent's Name",
      labelUrdu: "زیر کفالت کا نام",
      type: "text",
      required: true,
      group: "Dependent Details",
    },
    {
      name: "relation",
      label: "Relation to Dependent",
      labelUrdu: "زیر کفالت سے تعلق",
      type: "text",
      required: true,
      group: "Dependent Details",
    },
    {
      name: "supportPurpose",
      label: "Purpose of Support",
      labelUrdu: "کفالت کا مقصد",
      type: "select",
      required: true,
      options: [
        { value: "education", label: "Education", labelUrdu: "تعلیم" },
        { value: "visa", label: "Visa/Immigration", labelUrdu: "ویزا/ہجرت" },
        { value: "general", label: "General Support", labelUrdu: "عمومی کفالت" },
        { value: "medical", label: "Medical", labelUrdu: "طبی" },
      ],
      group: "Support Details",
    },
    {
      name: "additionalDetails",
      label: "Additional Details",
      labelUrdu: "مزید تفصیلات",
      type: "textarea",
      required: false,
      aiSuggestable: true,
      group: "Support Details",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a Financial Support Affidavit in {{language}}.

SPONSOR:
- Name: {{sponsorName}}
- Father's Name: {{sponsorFatherName}}
- CNIC: {{sponsorCnic}}
- Occupation: {{sponsorOccupation}}
- Monthly Income: PKR {{sponsorIncome}}

DEPENDENT:
- Name: {{dependentName}}
- Relation: {{relation}}

PURPOSE: {{supportPurpose}}
DETAILS: {{additionalDetails}}

REFERENCE FORMAT — Follow this exact Pakistani legal format:

AFFIDAVIT FOR FINANCIAL SUPPORT

I, Mr./Mrs. [Sponsor Name] S/o or W/o [Father Name] Resident of [Address], Citizen of Pakistan, having CNIC No. [CNIC] deponent of this affidavit solemnly declares as under:

1. That [Dependent Name] S/o/D/o [Father Name] is my real [Relation] who intends to [purpose e.g. pursue education / travel abroad].
2. That the deponent shall finance [Dependent Name] for all expenses including education, accommodation, food, travelling and other miscellaneous expenses during his/her stay.
3. That the deponent is solvent and is in a position to bear all the educational and living expenses of [Dependent Name].
4. That the contents of above mentioned affidavit are true and correct to the best of my knowledge, belief and information and nothing has been concealed by me.

DEPONENT
[Sponsor Name] S/o [Father Name]
CNIC: [CNIC]

Witness 1: ___________________     Witness 2: ___________________
CNIC: ___________________           CNIC: ___________________

ATTESTED
(Oath Commissioner / Notary Public)

INSTRUCTIONS:
- Use numbered clauses (1, 2, 3...) for each declaration point
- Start each clause with "That..."
- Use S/o for son of, D/o for daughter of, W/o for wife of
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
