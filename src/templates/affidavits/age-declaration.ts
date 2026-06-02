import { TemplateDefinition } from "../types";

export const ageDeclarationAffidavit: TemplateDefinition = {
  category: "affidavit",
  subType: "age-declaration",
  name: "Age Declaration Affidavit",
  nameUrdu: "عمر کے اعلان کا حلف نامہ",
  description: "Affidavit declaring date of birth / age",
  descriptionUrdu: "تاریخ پیدائش / عمر کے اعلان کا حلف نامہ",
  icon: "Calendar",
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
      name: "declaredDob",
      label: "Declared Date of Birth",
      labelUrdu: "اعلان شدہ تاریخ پیدائش",
      type: "date",
      required: true,
      group: "Age Details",
    },
    {
      name: "reason",
      label: "Reason for Age Declaration",
      labelUrdu: "عمر کے اعلان کی وجہ",
      type: "select",
      required: true,
      options: [
        { value: "no-birth-cert", label: "No Birth Certificate", labelUrdu: "پیدائشی سرٹیفکیٹ نہیں ہے" },
        { value: "late-registration", label: "Late Birth Registration", labelUrdu: "تاخیر سے اندراج پیدائش" },
        { value: "discrepancy", label: "Age Discrepancy in Documents", labelUrdu: "دستاویزات میں عمر کا فرق" },
        { value: "school-age", label: "School Admission Age Proof", labelUrdu: "اسکول داخلے کے لیے عمر کا ثبوت" },
        { value: "other", label: "Other", labelUrdu: "دیگر" },
      ],
      group: "Age Details",
    },
    {
      name: "reasonDetails",
      label: "Additional Details",
      labelUrdu: "اضافی تفصیلات",
      type: "textarea",
      required: false,
      placeholder: "Provide any additional context for the age declaration",
      aiSuggestable: true,
      group: "Age Details",
    },
    {
      name: "purpose",
      label: "Purpose",
      labelUrdu: "مقصد",
      type: "text",
      required: true,
      placeholder: "e.g., NADRA, school admission, passport, etc.",
      group: "Age Details",
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
      group: "Age Details",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a formal Age Declaration Affidavit in {{language}}.

PARTY DETAILS:
- Deponent Name: {{deponentName}}
- Father's/Husband's Name: {{fatherName}}
- CNIC: {{cnic}}
- Address: {{address}}
- City: {{city}}

AGE DETAILS:
- Declared Date of Birth: {{declaredDob}}
- Reason: {{reason}}
- Additional Details: {{reasonDetails}}
- Purpose: {{purpose}}

REFERENCE FORMAT — Follow this exact Pakistani legal format:

AFFIDAVIT FOR AGE / DATE OF BIRTH DECLARATION

I, [Deponent Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address], [City], do hereby solemnly affirm and declare as under:

1. That my date of birth is [Declared Date of Birth] as per my best knowledge and belief.
2. That [reason — no birth certificate available / late birth registration / discrepancy in documents].
3. That the correct and true date of birth of the deponent is [Date of Birth] which is being declared for the purpose of [Purpose — NADRA, school admission, passport, etc.].
4. That this affidavit is being made on my own free will without any coercion or pressure from anyone.
5. That the contents of this affidavit are true and correct to the best of my knowledge and belief and nothing has been concealed.

DEPONENT
[Name] S/o [Father Name]
CNIC: ___________

VERIFICATION:
Verified on oath at [City] on this ___ day of ___________ that the contents of the above affidavit are true and correct to the best of my knowledge and belief and nothing has been concealed therein.

DEPONENT

ATTESTED
(Oath Commissioner / Notary Public / Class-1 Officer)

INSTRUCTIONS:
- Title: AFFIDAVIT FOR AGE / DATE OF BIRTH DECLARATION (centered, bold)
- "That..." numbered clauses
- State the date of birth clearly and the purpose
- Include VERIFICATION paragraph
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
