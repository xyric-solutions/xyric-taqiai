import { TemplateDefinition } from "../types";

export const propertyOwnershipAffidavit: TemplateDefinition = {
  category: "affidavit",
  subType: "property-ownership",
  name: "Property Ownership Affidavit",
  nameUrdu: "جائیداد کی ملکیت کا حلف نامہ",
  description: "Affidavit declaring ownership of property (land, house, plot)",
  descriptionUrdu: "جائیداد (زمین، مکان، پلاٹ) کی ملکیت کے اعلان کا حلف نامہ",
  icon: "Home",
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
      name: "propertyDescription",
      label: "Property Description",
      labelUrdu: "جائیداد کی تفصیل",
      type: "textarea",
      required: true,
      placeholder: "Describe the property (type, area, khasra/plot number, etc.)",
      aiSuggestable: true,
      group: "Property Details",
    },
    {
      name: "propertyAddress",
      label: "Property Address",
      labelUrdu: "جائیداد کا پتہ",
      type: "address",
      required: true,
      placeholder: "Enter complete property address",
      group: "Property Details",
    },
    {
      name: "ownershipProof",
      label: "Ownership Proof / Basis of Claim",
      labelUrdu: "ملکیت کا ثبوت / دعوے کی بنیاد",
      type: "textarea",
      required: true,
      placeholder: "e.g., Registry deed, inheritance, purchase agreement, allotment letter",
      aiSuggestable: true,
      group: "Property Details",
    },
    {
      name: "purpose",
      label: "Purpose of Affidavit",
      labelUrdu: "حلف نامے کا مقصد",
      type: "textarea",
      required: true,
      placeholder: "e.g., Bank loan, sale, transfer, mutation, etc.",
      aiSuggestable: true,
      group: "Property Details",
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
      group: "Property Details",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a formal Property Ownership Affidavit in {{language}}.

PARTY DETAILS:
- Deponent Name: {{deponentName}}
- Father's/Husband's Name: {{fatherName}}
- CNIC: {{cnic}}
- Address: {{address}}
- City: {{city}}

PROPERTY DETAILS:
- Description: {{propertyDescription}}
- Property Address: {{propertyAddress}}
- Ownership Proof: {{ownershipProof}}
- Purpose: {{purpose}}

REFERENCE FORMAT — Follow this exact Pakistani legal format:

AFFIDAVIT OF PROPERTY OWNERSHIP

I, [Deponent Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address], [City], do hereby solemnly affirm and declare as under:

1. That I am the lawful owner of the property situated at [Property Address] described as [Property Description].
2. That I acquired the said property through [purchase/inheritance/allotment] vide [deed/document reference] and the same is duly registered/recorded in my name.
3. That the said property is free from all encumbrances, mortgages, charges, liens, litigation and legal disputes of any nature whatsoever.
4. That no other person has any claim or right over the said property and I am the sole and absolute owner thereof.
5. That I am making this affidavit for the purpose of [Purpose — bank loan / sale / transfer / mutation / registry].
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
- Title: AFFIDAVIT OF PROPERTY OWNERSHIP (centered, bold)
- "That..." numbered clauses
- Include property description and acquisition basis
- Key clause: "free from all encumbrances" and "sole and absolute owner"
- Include VERIFICATION paragraph
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
