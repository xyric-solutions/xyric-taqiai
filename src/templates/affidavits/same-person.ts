import { TemplateDefinition } from "../types";

export const samePersonAffidavit: TemplateDefinition = {
  category: "affidavit",
  subType: "same-person",
  name: "One and Same Person Affidavit",
  nameUrdu: "ایک ہی شخص ہونے کا حلف نامہ",
  description: "When name appears differently in different documents",
  descriptionUrdu: "جب مختلف دستاویزات میں نام مختلف ہو",
  icon: "UserCog",
  formFields: [
    {
      name: "deponentName",
      label: "Deponent Name (Primary Name)",
      labelUrdu: "حلف اٹھانے والے کا نام (بنیادی نام)",
      type: "text",
      required: true,
      placeholder: "Enter primary/preferred full name",
      placeholderUrdu: "بنیادی/ترجیحی پورا نام درج کریں",
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
      name: "nameVariation1",
      label: "Name as in Document 1",
      labelUrdu: "پہلی دستاویز میں نام",
      type: "text",
      required: true,
      placeholder: "Name as it appears in first document",
      group: "Name Variations",
    },
    {
      name: "document1",
      label: "Document 1 Type",
      labelUrdu: "پہلی دستاویز کی قسم",
      type: "text",
      required: true,
      placeholder: "e.g., CNIC, Passport, Matric Certificate",
      group: "Name Variations",
    },
    {
      name: "nameVariation2",
      label: "Name as in Document 2",
      labelUrdu: "دوسری دستاویز میں نام",
      type: "text",
      required: true,
      placeholder: "Name as it appears in second document",
      group: "Name Variations",
    },
    {
      name: "document2",
      label: "Document 2 Type",
      labelUrdu: "دوسری دستاویز کی قسم",
      type: "text",
      required: true,
      placeholder: "e.g., Birth Certificate, Degree, Nikah Nama",
      group: "Name Variations",
    },
    {
      name: "additionalVariations",
      label: "Additional Name Variations (if any)",
      labelUrdu: "اضافی نام کی تبدیلیاں (اگر کوئی ہوں)",
      type: "textarea",
      required: false,
      placeholder: "List any other name variations with their document types",
      group: "Name Variations",
    },
    {
      name: "reasonForDifference",
      label: "Reason for Name Difference",
      labelUrdu: "نام کے فرق کی وجہ",
      type: "textarea",
      required: true,
      placeholder: "Explain why the name appears differently in different documents",
      aiSuggestable: true,
      group: "Name Variations",
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
      group: "Name Variations",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a formal One and Same Person Affidavit in {{language}}.

PARTY DETAILS:
- Deponent Name: {{deponentName}}
- Father's/Husband's Name: {{fatherName}}
- CNIC: {{cnic}}
- Address: {{address}}
- City: {{city}}

NAME VARIATIONS:
- Name in Document 1 ({{document1}}): {{nameVariation1}}
- Name in Document 2 ({{document2}}): {{nameVariation2}}
- Additional Variations: {{additionalVariations}}
- Reason for Difference: {{reasonForDifference}}

REFERENCE FORMAT — Follow this exact Pakistani legal format:

AFFIDAVIT
(ONE AND THE SAME PERSON)

I, [Deponent Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address], [City], do hereby solemnly affirm and declare as under:

1. That I am known by the following names in my various documents:
   - "[Name Variation 1]" as appearing in my [Document 1 Type]
   - "[Name Variation 2]" as appearing in my [Document 2 Type]
   [Additional variations if any]

2. That all the above-mentioned names appearing in different documents belong to one and the same person i.e. myself only — [Primary Name] S/o [Father Name], CNIC No. [CNIC].

3. That the difference in names in different documents is due to [reason — spelling variation / clerical error / transliteration / different spellings used at different times].

4. That the bearer of all the above names is one and the same person and no other person is meant.

5. That this affidavit is being made on my own free will for the purpose of record correction and clarification.

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
- Title: AFFIDAVIT / ONE AND THE SAME PERSON (centered, bold)
- "That..." numbered clauses
- List all name variations with document types
- Key clause: "all names belong to one and the same person i.e., myself only"
- Include VERIFICATION paragraph
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
