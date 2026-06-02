import { TemplateDefinition } from "../types";

export const unmarriedCertificateAffidavit: TemplateDefinition = {
  category: "affidavit",
  subType: "unmarried-certificate",
  name: "Unmarried / Single Status Affidavit",
  nameUrdu: "غیر شادی شدہ حلف نامہ",
  description: "Affidavit declaring unmarried/single status for visa, scholarship, etc.",
  descriptionUrdu: "ویزا، وظیفہ وغیرہ کے لیے غیر شادی شدہ ہونے کا حلف نامہ",
  icon: "UserX",
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
      name: "city",
      label: "City",
      labelUrdu: "شہر",
      type: "text",
      required: true,
      placeholder: "Enter city name",
      group: "Deponent Details",
    },
    {
      name: "dateOfBirth",
      label: "Date of Birth",
      labelUrdu: "تاریخ پیدائش",
      type: "date",
      required: true,
      group: "Declaration Details",
    },
    {
      name: "purpose",
      label: "Purpose",
      labelUrdu: "مقصد",
      type: "select",
      required: true,
      options: [
        { value: "visa", label: "Visa Application", labelUrdu: "ویزا درخواست" },
        { value: "scholarship", label: "Scholarship", labelUrdu: "وظیفہ" },
        { value: "immigration", label: "Immigration", labelUrdu: "ہجرت" },
        { value: "job", label: "Employment", labelUrdu: "ملازمت" },
        { value: "other", label: "Other", labelUrdu: "دیگر" },
      ],
      group: "Declaration Details",
    },
    {
      name: "purposeDetails",
      label: "Additional Details",
      labelUrdu: "اضافی تفصیلات",
      type: "textarea",
      required: false,
      placeholder: "Any additional information relevant to the declaration",
      aiSuggestable: true,
      group: "Declaration Details",
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
      group: "Declaration Details",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a formal Unmarried / Single Status Affidavit in {{language}}.

PARTY DETAILS:
- Deponent Name: {{deponentName}}
- Father's Name: {{fatherName}}
- CNIC: {{cnic}}
- Address: {{address}}
- City: {{city}}
- Date of Birth: {{dateOfBirth}}

PURPOSE: {{purpose}}
ADDITIONAL DETAILS: {{purposeDetails}}

REFERENCE FORMAT — Follow this exact Pakistani legal format:

AFFIDAVIT OF UNMARRIED STATUS / SINGLE STATUS CERTIFICATE

I, [Deponent Name] S/o [Father Name], CNIC No. [CNIC], Date of Birth: [DOB], resident of [Address], [City], do hereby solemnly affirm and declare as under:

1. That I am a Muslim / [Religion], Pakistani national, single / unmarried as of the date of this affidavit.
2. That no Nikah / marriage ceremony has ever been performed in my name anywhere in Pakistan or abroad.
3. That I have never been married and there is no valid marriage registered in my name.
4. That I am making this affidavit for the purpose of [Purpose — visa application / scholarship / immigration / employment].
5. That all the above-mentioned facts are true and correct to the best of my knowledge and belief.

DEPONENT
[Name] S/o [Father Name]
CNIC: ___________
Date of Birth: ___________

VERIFICATION:
Verified on oath at [City] on this ___ day of ___________ that the contents of the above affidavit are true and correct to the best of my knowledge and belief and nothing has been concealed therein.

DEPONENT

ATTESTED
(Oath Commissioner / Notary Public / Class-1 Officer)

INSTRUCTIONS:
- Title: AFFIDAVIT OF UNMARRIED STATUS (centered, bold)
- "That..." numbered clauses
- Key clause: "no Nikah / marriage has been performed"
- Include Date of Birth in DEPONENT block
- Include VERIFICATION paragraph
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
