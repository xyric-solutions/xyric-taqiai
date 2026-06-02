import { TemplateDefinition } from "../types";

export const nationalityAffidavit: TemplateDefinition = {
  category: "affidavit",
  subType: "nationality-affidavit",
  name: "Nationality/Citizenship Affidavit",
  nameUrdu: "شہریت حلف نامہ",
  description: "Affidavit declaring nationality and citizenship status",
  descriptionUrdu: "قومیت اور شہریت کی حیثیت کے اعلان کا حلف نامہ",
  icon: "Flag",
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
      name: "nationality",
      label: "Nationality",
      labelUrdu: "قومیت",
      type: "text",
      required: true,
      placeholder: "e.g., Pakistani",
      placeholderUrdu: "مثلاً پاکستانی",
      group: "Nationality Details",
    },
    {
      name: "fatherNationality",
      label: "Father's Nationality",
      labelUrdu: "والد کی قومیت",
      type: "text",
      required: true,
      placeholder: "Enter father's nationality",
      group: "Nationality Details",
    },
    {
      name: "motherNationality",
      label: "Mother's Nationality",
      labelUrdu: "والدہ کی قومیت",
      type: "text",
      required: false,
      placeholder: "Enter mother's nationality",
      group: "Nationality Details",
    },
    {
      name: "placeOfBirth",
      label: "Place of Birth",
      labelUrdu: "جائے پیدائش",
      type: "text",
      required: true,
      placeholder: "Enter city and country of birth",
      group: "Nationality Details",
    },
    {
      name: "dateOfBirth",
      label: "Date of Birth",
      labelUrdu: "تاریخ پیدائش",
      type: "date",
      required: true,
      group: "Nationality Details",
    },
    {
      name: "purpose",
      label: "Purpose",
      labelUrdu: "مقصد",
      type: "select",
      required: true,
      options: [
        { value: "passport", label: "Passport Application", labelUrdu: "پاسپورٹ درخواست" },
        { value: "visa", label: "Visa Application", labelUrdu: "ویزا درخواست" },
        { value: "nicop", label: "NICOP Application", labelUrdu: "نکاپ درخواست" },
        { value: "poc", label: "POC Application", labelUrdu: "پاکستان اوریجن کارڈ" },
        { value: "immigration", label: "Immigration", labelUrdu: "امیگریشن" },
        { value: "other", label: "Other", labelUrdu: "دیگر" },
      ],
      group: "Purpose",
    },
    {
      name: "additionalDetails",
      label: "Additional Details",
      labelUrdu: "اضافی تفصیلات",
      type: "textarea",
      required: false,
      placeholder: "Any additional details regarding nationality claim",
      aiSuggestable: true,
      group: "Purpose",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a formal Nationality/Citizenship Affidavit (شہریت حلف نامہ) in {{language}}.

DEPONENT DETAILS:
- Name: {{deponentName}}
- Father's/Husband's Name: {{fatherName}}
- CNIC: {{cnic}}
- Address: {{address}}

NATIONALITY DETAILS:
- Nationality: {{nationality}}
- Father's Nationality: {{fatherNationality}}
- Mother's Nationality: {{motherNationality}}
- Place of Birth: {{placeOfBirth}}
- Date of Birth: {{dateOfBirth}}

PURPOSE: {{purpose}}
ADDITIONAL DETAILS: {{additionalDetails}}

Generate a complete, legally valid Nationality/Citizenship Affidavit following Pakistani law format under the Pakistan Citizenship Act 1951. Include:
1. Title and heading
2. Deponent identification paragraph
3. Declaration of nationality with parents' nationality details
4. Place and date of birth
5. Statement that deponent has not acquired citizenship of any REFERENCE FORMAT - Follow this exact Pakistani legal format:

AFFIDAVIT OF NATIONALITY / CITIZENSHIP

I, [Deponent Name] S/o [Father Name], CNIC No. [CNIC], Passport No. [Passport No.], resident of [Address], do hereby solemnly affirm and declare as under:

1. That I am a Pakistani national by birth / descent and hold a valid CNIC / Passport No. [Number].
2. That I was born on [Date of Birth] at [Place of Birth], Pakistan.
3. That my father [Father Name] is / was also a Pakistani national.
4. That I do not hold any other nationality / citizenship except Pakistani nationality.
5. That I am making this affidavit for the purpose of [Purpose - visa / employment / education].
6. That the contents of this affidavit are true and correct to the best of my knowledge and belief and nothing has been concealed.

DEPONENT
[Deponent Name] S/o [Father Name]
CNIC: ___________
Passport No.: ___________

VERIFICATION:
Verified on oath at [City] on this ___ day of ___________ that the contents of the above affidavit are true and correct to the best of my knowledge and belief and nothing has been concealed therein.

DEPONENT

ATTESTED
(Oath Commissioner / Notary Public / Class-1 Officer)

INSTRUCTIONS:
- Title: AFFIDAVIT OF NATIONALITY / CITIZENSHIP (centered, bold)
- "That..." numbered clauses
- Include CNIC and passport number, birthplace, parents nationality
- Include no other nationality clause
- Include VERIFICATION paragraph
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
