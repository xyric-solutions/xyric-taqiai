import { TemplateDefinition } from "../types";

export const undertakingAffidavit: TemplateDefinition = {
  category: "affidavit",
  subType: "undertaking-affidavit",
  name: "Undertaking Affidavit",
  nameUrdu: "عہد نامہ حلف نامہ",
  description: "General undertaking/commitment affidavit for various purposes",
  descriptionUrdu: "مختلف مقاصد کے لیے عام عہد نامہ / وعدہ حلف نامہ",
  icon: "FileCheck",
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
      name: "addressedTo",
      label: "Addressed To (Authority/Person)",
      labelUrdu: "بنام (اتھارٹی / شخص)",
      type: "text",
      required: true,
      placeholder: "e.g., Deputy Commissioner, University Registrar, Court",
      placeholderUrdu: "مثلاً ڈپٹی کمشنر، رجسٹرار یونیورسٹی، عدالت",
      group: "Undertaking Details",
    },
    {
      name: "subject",
      label: "Subject of Undertaking",
      labelUrdu: "عہد نامے کا موضوع",
      type: "text",
      required: true,
      placeholder: "Enter subject/title of the undertaking",
      group: "Undertaking Details",
    },
    {
      name: "undertakingStatement",
      label: "Detailed Undertaking Statement",
      labelUrdu: "عہد نامے کی تفصیلی بیان",
      type: "textarea",
      required: true,
      placeholder: "Describe in detail what you undertake/commit to do or not do",
      aiSuggestable: true,
      group: "Undertaking Details",
    },
    {
      name: "consequences",
      label: "Consequences of Breach",
      labelUrdu: "خلاف ورزی کے نتائج",
      type: "textarea",
      required: false,
      placeholder: "Describe consequences if undertaking is breached",
      aiSuggestable: true,
      group: "Undertaking Details",
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
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a formal Undertaking Affidavit (عہد نامہ حلف نامہ) in {{language}}.

DEPONENT DETAILS:
- Name: {{deponentName}}
- Father's/Husband's Name: {{fatherName}}
- CNIC: {{cnic}}
- Address: {{address}}

UNDERTAKING DETAILS:
- Addressed To: {{addressedTo}}
- Subject: {{subject}}
- Undertaking Statement: {{undertakingStatement}}
- Consequences of Breach: {{consequences}}

WITNESSES:
- Witness 1: {{witness1Name}} (CNIC: {{witness1Cnic}})

REFERENCE FORMAT — Follow this exact Pakistani legal format:

UNDERTAKING

I/We, [Name] S/o [Father Name], Muslim, Adult, Resident of [Address], holding CNIC No. [CNIC], do hereby state on oath as under:

That, I/we am/are the deponent(s) of this undertaking, hence well conversant with the facts stated herein.
That, [state the subject/commitment/obligation clearly].
That, I/we hereby undertake and commit that [main undertaking statement].
That, in case of any breach of this undertaking, I/we shall be held personally responsible and liable.
That, the contents of this undertaking are true and correct to the best of my/our knowledge and nothing has been concealed.

DEPONENT(S)

1. ___________________     2. ___________________
   [Name]                     [Name]
   CNIC: ___________          CNIC: ___________

Witness 1: ___________________     Witness 2: ___________________

ATTESTED
(Oath Commissioner / Notary Public)

INSTRUCTIONS:
- Title: UNDERTAKING (centered, bold)
- Each clause starts with "That,"
- Use I/We based on number of deponents
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
