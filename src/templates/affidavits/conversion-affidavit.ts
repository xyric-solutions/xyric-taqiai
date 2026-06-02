import { TemplateDefinition } from "../types";

export const conversionAffidavit: TemplateDefinition = {
  category: "affidavit",
  subType: "conversion-affidavit",
  name: "Religion Conversion Affidavit",
  nameUrdu: "تبدیلی مذہب حلف نامہ",
  description: "Affidavit declaring conversion of religion",
  descriptionUrdu: "مذہب کی تبدیلی کے اعلان کا حلف نامہ",
  icon: "BookOpen",
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
      name: "previousReligion",
      label: "Previous Religion",
      labelUrdu: "سابقہ مذہب",
      type: "text",
      required: true,
      placeholder: "Enter previous religion",
      placeholderUrdu: "سابقہ مذہب درج کریں",
      group: "Conversion Details",
    },
    {
      name: "newReligion",
      label: "New Religion",
      labelUrdu: "نیا مذہب",
      type: "text",
      required: true,
      placeholder: "Enter new religion",
      placeholderUrdu: "نیا مذہب درج کریں",
      group: "Conversion Details",
    },
    {
      name: "conversionDate",
      label: "Date of Conversion",
      labelUrdu: "تبدیلی مذہب کی تاریخ",
      type: "date",
      required: true,
      group: "Conversion Details",
    },
    {
      name: "reason",
      label: "Reason for Conversion",
      labelUrdu: "تبدیلی مذہب کی وجہ",
      type: "textarea",
      required: false,
      placeholder: "Enter reason for conversion (voluntary, by conviction, etc.)",
      aiSuggestable: true,
      group: "Conversion Details",
    },
    {
      name: "newName",
      label: "New Name (if changed)",
      labelUrdu: "نیا نام (اگر تبدیل کیا)",
      type: "text",
      required: false,
      placeholder: "Enter new name if adopted after conversion",
      group: "Conversion Details",
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
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a formal Religion Conversion Affidavit (تبدیلی مذہب حلف نامہ) in {{language}}.

DEPONENT DETAILS:
- Name: {{deponentName}}
- Father's/Husband's Name: {{fatherName}}
- CNIC: {{cnic}}
- Address: {{address}}

CONVERSION DETAILS:
- Previous Religion: {{previousReligion}}
- New Religion: {{newReligion}}
- Date of Conversion: {{conversionDate}}
- Reason: {{reason}}
- New Name (if changed): {{newName}}

WITNESSES:
- Witness 1: {{witness1Name}} (CNIC: {{witness1Cnic}})
- Witness 2: {{witness2Name}} (CNIC: {{witness2Cnic}})

Generate a complete, legally valid Religion Conversion Affidavit following Pakistani law. Include:
1. Title and heading
2. Deponent identification paragraph
3. Declaration of voluntary conversion from previous religion to new religion
4. Date and circumstances of conversion
5. Statement that conversion is voluntary and without coercion
6. New name declaration if applicable
7. Request for NREFERENCE FORMAT - Follow this exact Pakistani legal format:

AFFIDAVIT OF RELIGIOUS CONVERSION

I, [Deponent Name] S/o [Father Name], CNIC No. [CNIC], formerly of [Previous Religion] faith, resident of [Address], do hereby solemnly affirm and declare as under:

1. That I was previously a follower of [Previous Religion] faith.
2. That I have voluntarily and of my own free will embraced [New Religion - Islam / Christianity / other] on [Date of Conversion].
3. That my new name (if changed) is [New Name] and I wish to be known by this name henceforth.
4. That I have taken the Shahada / been baptized in the presence of [Witness / Religious Leader] at [Place].
5. That I have not been coerced, threatened, or induced by any person to convert and this decision is entirely my own.
6. That I request NADRA / the relevant authority to update my records accordingly.
7. That the contents of this affidavit are true and correct to the best of my knowledge and belief and nothing has been concealed.

DEPONENT
[New Name / Previous Name] S/o [Father Name]
CNIC: ___________

WITNESSES:
1. Name: _______________ CNIC: ___________
2. Name: _______________ CNIC: ___________

VERIFICATION:
Verified on oath at [City] on this ___ day of ___________ that the contents of the above affidavit are true and correct to the best of my knowledge and belief and nothing has been concealed therein.

DEPONENT

ATTESTED
(Oath Commissioner / Notary Public / Class-1 Officer)

INSTRUCTIONS:
- Title: AFFIDAVIT OF RELIGIOUS CONVERSION (centered, bold)
- "That..." numbered clauses
- Include previous and new religion, voluntary conversion, no coercion
- Include two witnesses
- Include VERIFICATION paragraph
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
