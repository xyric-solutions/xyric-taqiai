import { TemplateDefinition } from "../types";

export const employmentAffidavit: TemplateDefinition = {
  category: "affidavit",
  subType: "employment",
  name: "Employment Affidavit",
  nameUrdu: "ملازمت کا حلف نامہ",
  description: "Affidavit declaring employment details",
  descriptionUrdu: "ملازمت کی تفصیلات کے اعلان کا حلف نامہ",
  icon: "Briefcase",
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
      name: "employerName",
      label: "Employer / Organization Name",
      labelUrdu: "آجر / ادارے کا نام",
      type: "text",
      required: true,
      placeholder: "Enter employer or organization name",
      group: "Employment Details",
    },
    {
      name: "employerAddress",
      label: "Employer Address",
      labelUrdu: "آجر کا پتہ",
      type: "address",
      required: true,
      placeholder: "Enter employer's address",
      group: "Employment Details",
    },
    {
      name: "designation",
      label: "Designation / Position",
      labelUrdu: "عہدہ / پوزیشن",
      type: "text",
      required: true,
      placeholder: "Enter your designation",
      group: "Employment Details",
    },
    {
      name: "employmentFrom",
      label: "Employment Start Date",
      labelUrdu: "ملازمت شروع ہونے کی تاریخ",
      type: "date",
      required: true,
      group: "Employment Details",
    },
    {
      name: "employmentTo",
      label: "Employment End Date (leave empty if current)",
      labelUrdu: "ملازمت ختم ہونے کی تاریخ (اگر جاری ہے تو خالی چھوڑیں)",
      type: "date",
      required: false,
      group: "Employment Details",
    },
    {
      name: "purpose",
      label: "Purpose of Affidavit",
      labelUrdu: "حلف نامے کا مقصد",
      type: "textarea",
      required: true,
      placeholder: "e.g., Visa application, bank loan, verification, etc.",
      aiSuggestable: true,
      group: "Employment Details",
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
      group: "Employment Details",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a formal Employment Affidavit in {{language}}.

PARTY DETAILS:
- Deponent Name: {{deponentName}}
- Father's/Husband's Name: {{fatherName}}
- CNIC: {{cnic}}
- Address: {{address}}
- City: {{city}}

EMPLOYMENT DETAILS:
- Employer: {{employerName}}
- Employer Address: {{employerAddress}}
- Designation: {{designation}}
- Employment Period: {{employmentFrom}} to {{employmentTo}}
- Purpose: {{purpose}}

REFERENCE FORMAT — Follow this exact Pakistani legal format:

AFFIDAVIT OF EMPLOYMENT

I, [Deponent Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address], [City], do hereby solemnly affirm and declare as under:

1. That I am currently employed at [Employer Name], [Employer Address], and have been working since [Employment Start Date] in the capacity of [Designation].
2. That my employment is permanent / regular / contractual in nature and I am drawing salary / remuneration as per terms of my employment.
3. That I am making this affidavit for the purpose of [Purpose — visa application / bank loan / government record / verification].
4. That all the particulars mentioned herein are true and correct to the best of my knowledge and belief.
5. That the contents of this affidavit are true and correct to the best of my knowledge and belief and nothing has been concealed.

DEPONENT
[Name] S/o [Father Name]
Designation: [Designation]
Employer: [Employer Name]
CNIC: ___________

VERIFICATION:
Verified on oath at [City] on this ___ day of ___________ that the contents of the above affidavit are true and correct to the best of my knowledge and belief and nothing has been concealed therein.

DEPONENT

ATTESTED
(Oath Commissioner / Notary Public / Class-1 Officer)

INSTRUCTIONS:
- Title: AFFIDAVIT OF EMPLOYMENT (centered, bold)
- "That..." numbered clauses
- Clearly state employer, designation, employment start date
- State purpose
- Include designation in DEPONENT block
- Include VERIFICATION paragraph
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
