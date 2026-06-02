import { TemplateDefinition } from "../types";

export const characterCertificateAffidavit: TemplateDefinition = {
  category: "affidavit",
  subType: "character-certificate",
  name: "Character Certificate Affidavit",
  nameUrdu: "کردار سرٹیفکیٹ حلف نامہ",
  description: "Affidavit declaring good character and no criminal record",
  descriptionUrdu: "اچھے کردار اور کسی مجرمانہ ریکارڈ نہ ہونے کا حلف نامہ",
  icon: "UserCheck",
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
      label: "Purpose",
      labelUrdu: "مقصد",
      type: "select",
      required: true,
      options: [
        { value: "job", label: "Government/Private Job", labelUrdu: "سرکاری/نجی ملازمت" },
        { value: "visa", label: "Visa Application", labelUrdu: "ویزا درخواست" },
        { value: "admission", label: "Educational Admission", labelUrdu: "تعلیمی داخلہ" },
        { value: "license", label: "License/Permit", labelUrdu: "لائسنس/اجازت نامہ" },
        { value: "other", label: "Other", labelUrdu: "دیگر" },
      ],
      group: "Certificate Details",
    },
    {
      name: "purposeDetails",
      label: "Purpose Details",
      labelUrdu: "مقصد کی تفصیلات",
      type: "textarea",
      required: false,
      placeholder: "Provide additional details about the purpose",
      aiSuggestable: true,
      group: "Certificate Details",
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
      group: "Certificate Details",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a formal Character Certificate Affidavit in {{language}}.

PARTY DETAILS:
- Deponent Name: {{deponentName}}
- Father's/Husband's Name: {{fatherName}}
- CNIC: {{cnic}}
- Address: {{address}}
- City: {{city}}

PURPOSE: {{purpose}}
PURPOSE DETAILS: {{purposeDetails}}

REFERENCE FORMAT — Follow this exact Pakistani legal format:

AFFIDAVIT OF GOOD CHARACTER / CHARACTER CERTIFICATE

I, [Deponent Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address], [City], do hereby solemnly affirm and declare as under:

1. That I am a Pakistani citizen, Muslim, adult, of good moral character and conduct.
2. That I have never been convicted of any crime or offence by any court of law.
3. That no criminal case is pending against me in any court of Pakistan.
4. That my conduct and character are exemplary and I am known as a law-abiding citizen in my community.
5. That I am making this affidavit for the purpose of [Purpose — employment / visa / admission / passport].
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
- Title: AFFIDAVIT OF GOOD CHARACTER (centered, bold)
- Key clauses: never convicted, no pending case, good moral character
- Include VERIFICATION paragraph
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
