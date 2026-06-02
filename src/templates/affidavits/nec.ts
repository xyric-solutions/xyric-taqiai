import { TemplateDefinition } from "../types";

export const necAffidavit: TemplateDefinition = {
  category: "affidavit",
  subType: "nec",
  name: "No Entry Certificate (NEC)",
  nameUrdu: "عدم اندراج سرٹیفکیٹ",
  description: "Affidavit when name is not in records (NADRA, school, property)",
  descriptionUrdu: "جب نام ریکارڈ میں موجود نہ ہو (نادرا، اسکول، جائیداد)",
  icon: "FileSearch",
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
      label: "Purpose of NEC",
      labelUrdu: "عدم اندراج سرٹیفکیٹ کا مقصد",
      type: "textarea",
      required: true,
      placeholder: "Describe why you need a No Entry Certificate",
      aiSuggestable: true,
      group: "NEC Details",
    },
    {
      name: "recordType",
      label: "Record / Register Type",
      labelUrdu: "ریکارڈ / رجسٹر کی قسم",
      type: "select",
      required: true,
      options: [
        { value: "nadra", label: "NADRA Records", labelUrdu: "نادرا ریکارڈ" },
        { value: "school", label: "School Records", labelUrdu: "اسکول ریکارڈ" },
        { value: "property", label: "Property Records (Revenue)", labelUrdu: "جائیداد ریکارڈ (ریونیو)" },
        { value: "municipal", label: "Municipal Records", labelUrdu: "میونسپل ریکارڈ" },
        { value: "other", label: "Other", labelUrdu: "دیگر" },
      ],
      group: "NEC Details",
    },
    {
      name: "recordDetails",
      label: "Details of Missing Record",
      labelUrdu: "گمشدہ ریکارڈ کی تفصیلات",
      type: "textarea",
      required: true,
      placeholder: "Describe what record is missing and where it should have been",
      aiSuggestable: true,
      group: "NEC Details",
    },
    {
      name: "relevantAuthority",
      label: "Relevant Authority",
      labelUrdu: "متعلقہ ادارہ",
      type: "text",
      required: true,
      placeholder: "e.g., NADRA, Board of Revenue, School Administration",
      group: "NEC Details",
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
      group: "NEC Details",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a formal No Entry Certificate (NEC) Affidavit in {{language}}.

PARTY DETAILS:
- Deponent Name: {{deponentName}}
- Father's/Husband's Name: {{fatherName}}
- CNIC: {{cnic}}
- Address: {{address}}
- City: {{city}}

PURPOSE: {{purpose}}
RECORD TYPE: {{recordType}}
RECORD DETAILS: {{recordDetails}}
RELEVANT AUTHORITY: {{relevantAuthority}}

REFERENCE FORMAT — Follow this exact Pakistani legal format:

AFFIDAVIT / NO ENCUMBRANCE CERTIFICATE (NEC)

I, [Deponent Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address], [City], do hereby solemnly affirm and declare as under:

1. That I am the lawful owner of the property situated at [Property Address] described as [Property Description], bearing Khasra No. [Khasra No.], Khata No. [Khata No.], Mouza [Mouza], Tehsil [Tehsil], District [District].
2. That the said property is free from all encumbrances, charges, mortgages, hypothecations, court orders, and any legal disputes of any nature whatsoever.
3. That no loan has been obtained on the security of the said property from any bank or financial institution.
4. That no other person has any right, interest, or claim over the said property.
5. That I hereby undertake to indemnify any loss caused to any party by reason of any encumbrance on the said property not disclosed herein.
6. That the contents of this affidavit are true and correct to the best of my knowledge and belief.

DEPONENT
[Name] S/o [Father Name]
CNIC: ___________

VERIFICATION:
Verified on oath at [City] on this ___ day of ___________ that the contents are true and correct.

DEPONENT

ATTESTED
(Oath Commissioner / Notary Public / Class-1 Officer)

INSTRUCTIONS:
- Title: AFFIDAVIT / NO ENCUMBRANCE CERTIFICATE (NEC) (centered, bold)
- Include full property details: Khasra, Khata, Mouza, Tehsil, District
- Key clauses: free from all encumbrances, no bank loan, no other claims
- Include indemnity clause
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
