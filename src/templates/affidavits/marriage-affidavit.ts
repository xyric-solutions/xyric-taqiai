import { TemplateDefinition } from "../types";

export const marriageAffidavit: TemplateDefinition = {
  category: "affidavit",
  subType: "marriage-affidavit",
  name: "Marriage Affidavit",
  nameUrdu: "شادی کا حلف نامہ",
  description: "Sworn statement confirming marriage details",
  descriptionUrdu: "شادی کی تفصیلات کی تصدیق کا حلفیہ بیان",
  icon: "Heart",
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
      label: "Father's Name",
      labelUrdu: "والد کا نام",
      type: "text",
      required: true,
      placeholder: "Enter father's name",
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
      name: "spouseName",
      label: "Spouse's Name",
      labelUrdu: "شریک حیات کا نام",
      type: "text",
      required: true,
      placeholder: "Enter spouse's full name",
      placeholderUrdu: "شریک حیات کا پورا نام درج کریں",
      group: "Spouse Details",
    },
    {
      name: "spouseFatherName",
      label: "Spouse's Father's Name",
      labelUrdu: "شریک حیات کے والد کا نام",
      type: "text",
      required: true,
      placeholder: "Enter spouse's father's name",
      group: "Spouse Details",
    },
    {
      name: "spouseCnic",
      label: "Spouse's CNIC",
      labelUrdu: "شریک حیات کا شناختی کارڈ نمبر",
      type: "cnic",
      required: false,
      placeholder: "XXXXX-XXXXXXX-X",
      group: "Spouse Details",
    },
    {
      name: "marriageDate",
      label: "Date of Marriage (Nikah)",
      labelUrdu: "تاریخ نکاح",
      type: "date",
      required: true,
      group: "Marriage Details",
    },
    {
      name: "marriagePlace",
      label: "Place of Marriage",
      labelUrdu: "نکاح کی جگہ",
      type: "text",
      required: true,
      placeholder: "Enter place/city where nikah was performed",
      group: "Marriage Details",
    },
    {
      name: "nikahRegistrar",
      label: "Nikah Registrar / Nikah Khawan",
      labelUrdu: "نکاح رجسٹرار / نکاح خواں",
      type: "text",
      required: false,
      placeholder: "Enter name of nikah registrar",
      group: "Marriage Details",
    },
    {
      name: "witness1Name",
      label: "Witness 1 Name",
      labelUrdu: "گواہ 1 کا نام",
      type: "text",
      required: true,
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
      required: true,
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
      name: "purpose",
      label: "Purpose of Affidavit",
      labelUrdu: "حلف نامے کا مقصد",
      type: "textarea",
      required: false,
      placeholder: "e.g., visa application, NADRA record, passport",
      aiSuggestable: true,
      group: "Purpose",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a formal Marriage Affidavit (شادی کا حلف نامہ) in {{language}}.

DEPONENT DETAILS:
- Name: {{deponentName}}
- Father's Name: {{fatherName}}
- CNIC: {{cnic}}
- Address: {{address}}

SPOUSE DETAILS:
- Name: {{spouseName}}
- Father's Name: {{spouseFatherName}}
- CNIC: {{spouseCnic}}

MARRIAGE DETAILS:
- Date of Marriage: {{marriageDate}}
- Place of Marriage: {{marriagePlace}}
- Nikah Registrar: {{nikahRegistrar}}

WITNESSES:
- Witness 1: {{witness1Name}} (CNIC: {{witness1Cnic}})
- Witness 2: {{witness2Name}} (CNIC: {{witness2Cnic}})

PURPOSE: {{purpose}}

REFERENCE FORMAT — Follow this exact Pakistani legal format:

MARRIAGE AFFIDAVIT

I, [Deponent Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address], [City], do hereby solemnly affirm and declare as under:

1. That I am married to [Spouse Name] D/o [Father Name], CNIC No. [Spouse CNIC], according to Muslim rites and the Nikah was solemnized on [Marriage Date] at [Place of Marriage].
2. That the Nikah was registered vide No. [Nikah Registration No.] with the Nikah Registrar.
3. That the Haq Mehr agreed upon was PKR [Mehr Amount]/-.
4. That out of this wedlock, we have [number] children: [Children Names and Ages if applicable].
5. That our marriage is subsisting and neither party has obtained divorce from the other.
6. That I am making this affidavit for the purpose of [Purpose — visa / NADRA / bank / official record].
7. That the contents of this affidavit are true and correct to the best of my knowledge and belief.

DEPONENT
[Name] S/o [Father Name]
CNIC: ___________

VERIFICATION:
Verified on oath at [City] on this ___ day of ___________ that the contents of the above affidavit are true and correct to the best of my knowledge and belief and nothing has been concealed therein.

DEPONENT

ATTESTED
(Oath Commissioner / Notary Public / Class-1 Officer)

INSTRUCTIONS:
- Title: MARRIAGE AFFIDAVIT (centered, bold)
- Include Nikah registration number and date
- Include Haq Mehr amount
- Key clause: marriage subsisting, no divorce
- Include VERIFICATION paragraph
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
