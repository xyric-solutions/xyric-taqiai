import { TemplateDefinition } from "../types";

export const gapCertificateAffidavit: TemplateDefinition = {
  category: "affidavit",
  subType: "gap-certificate",
  name: "Gap / Study Break Affidavit",
  nameUrdu: "تعلیمی وقفے کا حلف نامہ",
  description: "Affidavit explaining educational gap period",
  descriptionUrdu: "تعلیمی وقفے کی وضاحت کے لیے حلف نامہ",
  icon: "GraduationCap",
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
      name: "lastInstitution",
      label: "Last Educational Institution",
      labelUrdu: "آخری تعلیمی ادارہ",
      type: "text",
      required: true,
      placeholder: "Name of last school/college/university attended",
      group: "Education Details",
    },
    {
      name: "lastQualification",
      label: "Last Qualification",
      labelUrdu: "آخری تعلیمی قابلیت",
      type: "text",
      required: true,
      placeholder: "e.g., Matric, Intermediate, BA, etc.",
      group: "Education Details",
    },
    {
      name: "gapFrom",
      label: "Gap Period From",
      labelUrdu: "وقفے کی مدت شروع",
      type: "date",
      required: true,
      group: "Gap Details",
    },
    {
      name: "gapTo",
      label: "Gap Period To",
      labelUrdu: "وقفے کی مدت ختم",
      type: "date",
      required: true,
      group: "Gap Details",
    },
    {
      name: "reasonForGap",
      label: "Reason for Gap",
      labelUrdu: "وقفے کی وجہ",
      type: "textarea",
      required: true,
      placeholder: "Explain the reason for the educational gap (financial, health, family, etc.)",
      aiSuggestable: true,
      group: "Gap Details",
    },
    {
      name: "currentStatus",
      label: "Current Status",
      labelUrdu: "موجودہ حیثیت",
      type: "textarea",
      required: true,
      placeholder: "What are you doing now? (seeking admission, employed, etc.)",
      aiSuggestable: true,
      group: "Gap Details",
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
      group: "Gap Details",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a formal Gap/Study Break Affidavit in {{language}}.

PARTY DETAILS:
- Deponent Name: {{deponentName}}
- Father's/Husband's Name: {{fatherName}}
- CNIC: {{cnic}}
- Address: {{address}}
- City: {{city}}

EDUCATION DETAILS:
- Last Institution: {{lastInstitution}}
- Last Qualification: {{lastQualification}}

GAP DETAILS:
- Gap Period: {{gapFrom}} to {{gapTo}}
- Reason: {{reasonForGap}}
- Current Status: {{currentStatus}}

REFERENCE FORMAT — Follow this exact Pakistani legal format:

AFFIDAVIT FOR STUDY GAP / BREAK IN EDUCATION

I, [Deponent Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address], [City], do hereby solemnly affirm and declare as under:

1. That I passed my [Last Qualification] examination from [Last Institution] in the year [Year].
2. That from [Gap Start Date] to [Gap End Date], I remained at home and did not pursue any formal education due to [Reason for Gap — illness / family issues / financial constraints / personal reasons].
3. That during the said gap period, I was not involved in any criminal or illegal activity.
4. That during the gap period, I was [Current Status — preparing for further studies / engaged in family responsibilities / unwell].
5. That I am now desirous of continuing my education and have applied for admission in [Institution / Programme].
6. That the contents of this affidavit are true and correct to the best of my knowledge and belief and nothing has been concealed.

DEPONENT
[Name] S/o [Father Name]
CNIC: ___________

VERIFICATION:
Verified on oath at [City] on this ___ day of ___________ that the contents of the above affidavit are true and correct to the best of my knowledge and belief and nothing has been concealed therein.

DEPONENT

ATTESTED
(Oath Commissioner / Notary Public / Class-1 Officer)

INSTRUCTIONS:
- Title: AFFIDAVIT FOR STUDY GAP (centered, bold)
- State last qualification and institution
- State gap period dates and reason
- Key clause: "not involved in any criminal or illegal activity"
- Include VERIFICATION paragraph
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags
Do NOT include any markdown formatting - only valid HTML tags.`,
};
