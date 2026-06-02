import { TemplateDefinition } from "../types";

export const declarationAffidavit: TemplateDefinition = {
  category: "affidavit",
  subType: "declaration",
  name: "Declaration Affidavit",
  nameUrdu: "حلف نامہ اعلان",
  description: "General declaration affidavit for various purposes",
  descriptionUrdu: "مختلف مقاصد کے لیے عام اعلامیہ حلف نامہ",
  icon: "FileText",
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
      name: "city",
      label: "City",
      labelUrdu: "شہر",
      type: "text",
      required: true,
      placeholder: "Enter city name",
      group: "Deponent Details",
    },
    {
      name: "purpose",
      label: "Purpose of Declaration",
      labelUrdu: "اعلان کا مقصد",
      type: "textarea",
      required: true,
      placeholder: "Describe the purpose of this declaration",
      aiSuggestable: true,
      group: "Declaration Details",
    },
    {
      name: "declarationBody",
      label: "Declaration Statement",
      labelUrdu: "اعلامیہ کی تفصیل",
      type: "textarea",
      required: true,
      placeholder: "Enter the detailed declaration statement",
      aiSuggestable: true,
      group: "Declaration Details",
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
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a formal Declaration Affidavit in {{language}}.

PARTY DETAILS:
- Deponent Name: {{deponentName}}
- Father's/Husband's Name: {{fatherName}}
- CNIC: {{cnic}}
- Address: {{address}}
- City: {{city}}

DECLARATION PURPOSE: {{purpose}}
DECLARATION DETAILS: {{declarationBody}}

WITNESSES:
- Witness 1: {{witness1Name}} (CNIC: {{witness1Cnic}})
- Witness 2: {{witness2Name}} (CNIC: {{witness2Cnic}})

REFERENCE FORMAT — Follow this exact Pakistani legal format:

AFFIDAVIT

I, [Name] S/o [Father Name] holding CNIC No. [CNIC], resident of [Address], do hereby solemnly affirm and declare as under:

1. That [first declaration point].
2. That [second declaration point].
3. That the contents of this affidavit are true and correct to the best of my knowledge and belief and nothing has been concealed.

THE DEPONENT
[Name] S/o [Father Name]
CNIC: [CNIC]

Witness 1: ___________________     Witness 2: ___________________
CNIC: ___________________           CNIC: ___________________

ATTESTED
(Oath Commissioner / Notary Public / Class-1 Officer)

INSTRUCTIONS:
- Title: AFFIDAVIT (centered, bold)
- Each clause starts with "That..."
- Use S/o / D/o / W/o properly
- End with deponent signature block and attestation
- Output as clean HTML. Use <h1>, <p>, <ol>, <li> tags
- If language is Urdu, write entirely in Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
