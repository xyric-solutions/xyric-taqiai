import { TemplateDefinition } from "../types";

export const pensionAffidavit: TemplateDefinition = {
  category: "affidavit",
  subType: "pension-affidavit",
  name: "Pension Affidavit",
  nameUrdu: "پنشن حلف نامہ",
  description: "Affidavit for claiming pension of a deceased pensioner",
  descriptionUrdu: "فوت شدہ پنشنر کی پنشن کے دعوے کا حلف نامہ",
  icon: "Banknote",
  formFields: [
    {
      name: "deponentName",
      label: "Claimant Name",
      labelUrdu: "دعویدار کا نام",
      type: "text",
      required: true,
      placeholder: "Enter claimant's full name",
      placeholderUrdu: "دعویدار کا پورا نام درج کریں",
      group: "Claimant Details",
    },
    {
      name: "fatherName",
      label: "Father's / Husband's Name",
      labelUrdu: "والد / شوہر کا نام",
      type: "text",
      required: true,
      placeholder: "Enter father's or husband's name",
      group: "Claimant Details",
    },
    {
      name: "cnic",
      label: "CNIC Number",
      labelUrdu: "شناختی کارڈ نمبر",
      type: "cnic",
      required: true,
      placeholder: "XXXXX-XXXXXXX-X",
      validation: { pattern: "^[0-9]{5}-[0-9]{7}-[0-9]$" },
      group: "Claimant Details",
    },
    {
      name: "address",
      label: "Residential Address",
      labelUrdu: "رہائشی پتہ",
      type: "address",
      required: true,
      placeholder: "Enter complete address",
      group: "Claimant Details",
    },
    {
      name: "relationship",
      label: "Relationship with Deceased",
      labelUrdu: "مرحوم سے رشتہ",
      type: "select",
      required: true,
      options: [
        { value: "wife", label: "Wife", labelUrdu: "بیوی" },
        { value: "husband", label: "Husband", labelUrdu: "شوہر" },
        { value: "son", label: "Son", labelUrdu: "بیٹا" },
        { value: "daughter", label: "Daughter", labelUrdu: "بیٹی" },
        { value: "father", label: "Father", labelUrdu: "والد" },
        { value: "mother", label: "Mother", labelUrdu: "والدہ" },
        { value: "other", label: "Other", labelUrdu: "دیگر" },
      ],
      group: "Claimant Details",
    },
    {
      name: "deceasedName",
      label: "Deceased Pensioner's Name",
      labelUrdu: "مرحوم پنشنر کا نام",
      type: "text",
      required: true,
      placeholder: "Enter deceased pensioner's full name",
      group: "Deceased Pensioner Details",
    },
    {
      name: "deceasedCnic",
      label: "Deceased's CNIC",
      labelUrdu: "مرحوم کا شناختی کارڈ نمبر",
      type: "cnic",
      required: false,
      placeholder: "XXXXX-XXXXXXX-X",
      group: "Deceased Pensioner Details",
    },
    {
      name: "dateOfDeath",
      label: "Date of Death",
      labelUrdu: "تاریخ وفات",
      type: "date",
      required: true,
      group: "Deceased Pensioner Details",
    },
    {
      name: "pensionNumber",
      label: "Pension/PPO Number",
      labelUrdu: "پنشن / پی پی او نمبر",
      type: "text",
      required: true,
      placeholder: "Enter pension payment order number",
      group: "Pension Details",
    },
    {
      name: "department",
      label: "Department / Organization",
      labelUrdu: "محکمہ / ادارہ",
      type: "text",
      required: true,
      placeholder: "Enter department or organization name",
      group: "Pension Details",
    },
    {
      name: "noOtherClaimant",
      label: "No Other Claimant Statement",
      labelUrdu: "کوئی اور دعویدار نہیں کا بیان",
      type: "textarea",
      required: false,
      placeholder: "State that no other person has a superior claim to the pension",
      aiSuggestable: true,
      group: "Pension Details",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a formal Pension Affidavit (پنشن حلف نامہ) in {{language}}.

CLAIMANT DETAILS:
- Name: {{deponentName}}
- Father's/Husband's Name: {{fatherName}}
- CNIC: {{cnic}}
- Address: {{address}}
- Relationship with Deceased: {{relationship}}

DECEASED PENSIONER DETAILS:
- Name: {{deceasedName}}
- CNIC: {{deceasedCnic}}
- Date of Death: {{dateOfDeath}}

PENSION DETAILS:
- Pension/PPO Number: {{pensionNumber}}
- Department: {{department}}
- No Other Claimant Statement: {{noOtherClaimant}}

REFERENCE FORMAT — Follow this exact Pakistani legal format:

AFFIDAVIT FOR PENSION

I, [Deponent Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address], do hereby solemnly affirm and declare as under:

1. That I am the pensioner / widow / legal heir of [Pensioner Name], who served as [Designation] in [Department/Organization].
2. That [Pensioner Name] is alive and in good health [OR] That [Pensioner Name] passed away on [Date of Death] and I am his/her [Relationship] entitled to family pension.
3. That I have not remarried since the death of my husband [if applicable].
4. That I am not employed in any government or private sector organization that would disqualify me from receiving the pension.
5. That the above information is true and I undertake to notify the pension authorities of any change in my status.
6. That the contents of this affidavit are true and correct to the best of my knowledge and belief.

DEPONENT
[Name] S/o/W/o/D/o [Father/Husband Name]
CNIC: ___________
Pension File No.: ___________

VERIFICATION:
Verified on oath at [City] on this ___ day of ___________ that the contents are true and correct.

DEPONENT

ATTESTED
(Oath Commissioner / Notary Public / Class-1 Officer)

INSTRUCTIONS:
- Title: AFFIDAVIT FOR PENSION (centered, bold)
- Include pension file number
- For widow pension: "have not remarried"
- For family pension: specify relationship to deceased
- Include VERIFICATION paragraph
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
