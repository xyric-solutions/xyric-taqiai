import { TemplateDefinition } from "../types";

export const residenceAffidavit: TemplateDefinition = {
  category: "affidavit",
  subType: "residence",
  name: "Residence Affidavit",
  nameUrdu: "رہائش کا حلف نامہ",
  description: "Affidavit declaring current residence for admissions, utility connections, etc.",
  descriptionUrdu: "داخلے، یوٹیلیٹی کنکشن وغیرہ کے لیے رہائش کا حلف نامہ",
  icon: "Building",
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
      label: "Current Residential Address",
      labelUrdu: "موجودہ رہائشی پتہ",
      type: "address",
      required: true,
      placeholder: "Enter complete current address",
      group: "Residence Details",
    },
    {
      name: "city",
      label: "City",
      labelUrdu: "شہر",
      type: "text",
      required: true,
      placeholder: "Enter city name",
      group: "Residence Details",
    },
    {
      name: "residenceDuration",
      label: "Duration of Residence",
      labelUrdu: "رہائش کی مدت",
      type: "text",
      required: true,
      placeholder: "e.g., 5 years, Since 2015, Since birth",
      group: "Residence Details",
    },
    {
      name: "purpose",
      label: "Purpose",
      labelUrdu: "مقصد",
      type: "select",
      required: true,
      options: [
        { value: "school-admission", label: "School/College Admission", labelUrdu: "اسکول/کالج داخلہ" },
        { value: "utility", label: "Utility Connection (Gas/Electricity/Water)", labelUrdu: "یوٹیلیٹی کنکشن" },
        { value: "bank", label: "Bank Account Opening", labelUrdu: "بینک اکاؤنٹ کھولنا" },
        { value: "domicile", label: "Domicile Application", labelUrdu: "ڈومیسائل درخواست" },
        { value: "visa", label: "Visa Application", labelUrdu: "ویزا درخواست" },
        { value: "other", label: "Other", labelUrdu: "دیگر" },
      ],
      group: "Residence Details",
    },
    {
      name: "purposeDetails",
      label: "Additional Details",
      labelUrdu: "اضافی تفصیلات",
      type: "textarea",
      required: false,
      placeholder: "Any additional details about the purpose",
      aiSuggestable: true,
      group: "Residence Details",
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
      group: "Residence Details",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a formal Residence Affidavit in {{language}}.

PARTY DETAILS:
- Deponent Name: {{deponentName}}
- Father's/Husband's Name: {{fatherName}}
- CNIC: {{cnic}}

RESIDENCE DETAILS:
- Current Address: {{address}}
- City: {{city}}
- Duration of Residence: {{residenceDuration}}
- Purpose: {{purpose}}
- Additional Details: {{purposeDetails}}

REFERENCE FORMAT — Follow this exact Pakistani legal format:

AFFIDAVIT FOR RESIDENCE / PROOF OF RESIDENCE

I, [Deponent Name] S/o [Father Name], CNIC No. [CNIC], do hereby solemnly affirm and declare as under:

1. That I am a permanent resident of [Address], [City], and have been residing continuously at the above-mentioned address for the past [Duration of Residence].
2. That I am a bonafide resident of [City / District] and the above address is my permanent residential address.
3. That I require this residence affidavit for the purpose of [Purpose — school admission / utility connection / bank account / domicile / visa].
4. That [additional details if any — ownership status, relationship to property owner, etc.].
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
- Title: AFFIDAVIT FOR RESIDENCE (centered, bold)
- "That..." numbered clauses
- Clearly state address and duration
- State the purpose
- Include VERIFICATION paragraph
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
