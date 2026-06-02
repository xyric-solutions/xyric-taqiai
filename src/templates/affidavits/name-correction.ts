import { TemplateDefinition } from "../types";

export const nameCorrectionAffidavit: TemplateDefinition = {
  category: "affidavit",
  subType: "name-correction",
  name: "Name Correction Affidavit",
  nameUrdu: "نام کی درستگی کا حلف نامہ",
  description: "For correcting name in CNIC, passport, certificates, or other documents",
  descriptionUrdu: "شناختی کارڈ، پاسپورٹ، اسناد یا دیگر دستاویزات میں نام کی درستگی",
  icon: "PenLine",
  formFields: [
    {
      name: "deponentName",
      label: "Deponent Name (Correct Name)",
      labelUrdu: "حلف اٹھانے والے کا نام (درست نام)",
      type: "text",
      required: true,
      placeholder: "Enter your correct full name",
      placeholderUrdu: "اپنا درست پورا نام درج کریں",
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
      name: "incorrectName",
      label: "Incorrect Name (as appearing in document)",
      labelUrdu: "غلط نام (جیسا کہ دستاویز میں لکھا ہے)",
      type: "text",
      required: true,
      placeholder: "Enter the incorrect name as it appears",
      group: "Correction Details",
    },
    {
      name: "correctName",
      label: "Correct Name",
      labelUrdu: "درست نام",
      type: "text",
      required: true,
      placeholder: "Enter the correct name",
      group: "Correction Details",
    },
    {
      name: "documentType",
      label: "Document Requiring Correction",
      labelUrdu: "جس دستاویز میں درستگی درکار ہے",
      type: "select",
      required: true,
      options: [
        { value: "cnic", label: "CNIC / National ID", labelUrdu: "شناختی کارڈ" },
        { value: "passport", label: "Passport", labelUrdu: "پاسپورٹ" },
        { value: "birth-certificate", label: "Birth Certificate", labelUrdu: "پیدائشی سرٹیفکیٹ" },
        { value: "education", label: "Educational Certificate", labelUrdu: "تعلیمی سند" },
        { value: "nikah-nama", label: "Nikah Nama", labelUrdu: "نکاح نامہ" },
        { value: "property", label: "Property Document", labelUrdu: "جائیداد کی دستاویز" },
        { value: "other", label: "Other", labelUrdu: "دیگر" },
      ],
      group: "Correction Details",
    },
    {
      name: "reason",
      label: "Reason for Difference",
      labelUrdu: "فرق کی وجہ",
      type: "textarea",
      required: true,
      placeholder: "Explain why the name was recorded incorrectly",
      aiSuggestable: true,
      group: "Correction Details",
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
      group: "Correction Details",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a formal Name Correction Affidavit in {{language}}.

PARTY DETAILS:
- Deponent Name: {{deponentName}}
- Father's/Husband's Name: {{fatherName}}
- CNIC: {{cnic}}
- Address: {{address}}
- City: {{city}}

CORRECTION DETAILS:
- Incorrect Name: {{incorrectName}}
- Correct Name: {{correctName}}
- Document Type: {{documentType}}
- Reason for Difference: {{reason}}

REFERENCE FORMAT — Follow this exact Pakistani legal format:

AFFIDAVIT FOR DIFFERENCE IN NAME / NAME CORRECTION

I, [Deponent Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address], [City], do hereby solemnly affirm and declare as under:

1. That my name as appearing on my [Document Type] is "[Incorrect Name]" whereas my correct name as per my CNIC / other official documents is "[Correct Name]".
2. That the name "[Incorrect Name]" and "[Correct Name]" appearing on my documents pertain to the same person i.e., myself only.
3. That [reason for difference — spelling variation / clerical error / transliteration difference].
4. That both names in all my documents and certificates refer to the same person i.e., [Correct Name].
5. That the contents of this affidavit are true and correct to the best of my knowledge and nothing has been concealed.

DEPONENT

VERIFICATION:
Verified on oath at [City] on this ___ day of ___________ that the contents of the above affidavit are true and correct to the best of my knowledge and belief and nothing has been concealed therein.

DEPONENT

ATTESTED
(Oath Commissioner / Notary Public / Class-1 Officer)

INSTRUCTIONS:
- Title: AFFIDAVIT FOR DIFFERENCE IN NAME (centered, bold) — adjust title based on document type
- I, [Name] S/o [Father] identification paragraph
- "That..." numbered clauses
- Key clause: both names refer to same person
- VERIFICATION paragraph at end
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
