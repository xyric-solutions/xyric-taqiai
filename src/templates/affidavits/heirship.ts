import { TemplateDefinition } from "../types";

export const heirshipAffidavit: TemplateDefinition = {
  category: "affidavit",
  subType: "heirship",
  name: "Heirship / Legal Heir Affidavit",
  nameUrdu: "وارثان کا حلف نامہ",
  description: "Affidavit declaring legal heirs of a deceased person",
  descriptionUrdu: "مرحوم شخص کے قانونی وارثان کے اعلان کا حلف نامہ",
  icon: "Users",
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
      name: "relationToDeceased",
      label: "Relationship to Deceased",
      labelUrdu: "مرحوم سے رشتہ",
      type: "text",
      required: true,
      placeholder: "e.g., Son, Daughter, Wife, Brother",
      group: "Deponent Details",
    },
    {
      name: "deceasedName",
      label: "Name of Deceased",
      labelUrdu: "مرحوم کا نام",
      type: "text",
      required: true,
      placeholder: "Enter full name of the deceased",
      group: "Deceased Details",
    },
    {
      name: "deceasedFatherName",
      label: "Deceased's Father's Name",
      labelUrdu: "مرحوم کے والد کا نام",
      type: "text",
      required: true,
      placeholder: "Enter deceased's father's name",
      group: "Deceased Details",
    },
    {
      name: "deceasedCnic",
      label: "Deceased's CNIC (if available)",
      labelUrdu: "مرحوم کا شناختی کارڈ نمبر",
      type: "cnic",
      required: false,
      placeholder: "XXXXX-XXXXXXX-X",
      group: "Deceased Details",
    },
    {
      name: "dateOfDeath",
      label: "Date of Death",
      labelUrdu: "تاریخ وفات",
      type: "date",
      required: true,
      group: "Deceased Details",
    },
    {
      name: "placeOfDeath",
      label: "Place of Death",
      labelUrdu: "جائے وفات",
      type: "text",
      required: true,
      placeholder: "Enter city/place of death",
      group: "Deceased Details",
    },
    {
      name: "legalHeirs",
      label: "List of All Legal Heirs",
      labelUrdu: "تمام قانونی وارثان کی فہرست",
      type: "textarea",
      required: true,
      placeholder: "List each heir: Name, Relationship, CNIC, Age\ne.g.,\n1. Ahmad Ali - Son - 35401-1234567-1 - 30 years\n2. Fatima Bibi - Wife - 35401-7654321-2 - 45 years",
      aiSuggestable: true,
      group: "Heir Details",
    },
    {
      name: "propertyDetails",
      label: "Property Details (if applicable)",
      labelUrdu: "جائیداد کی تفصیلات (اگر قابل اطلاق ہو)",
      type: "textarea",
      required: false,
      placeholder: "Details of property left by deceased (if relevant)",
      aiSuggestable: true,
      group: "Heir Details",
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
      group: "Heir Details",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a formal Heirship / Legal Heir Affidavit in {{language}}.

DEPONENT DETAILS:
- Deponent Name: {{deponentName}}
- Father's/Husband's Name: {{fatherName}}
- CNIC: {{cnic}}
- Address: {{address}}
- City: {{city}}
- Relationship to Deceased: {{relationToDeceased}}

DECEASED DETAILS:
- Name: {{deceasedName}}
- Father's Name: {{deceasedFatherName}}
- CNIC: {{deceasedCnic}}
- Date of Death: {{dateOfDeath}}
- Place of Death: {{placeOfDeath}}

LEGAL HEIRS:
{{legalHeirs}}

PROPERTY DETAILS: {{propertyDetails}}

REFERENCE FORMAT — Follow this exact Pakistani legal format:

AFFIDAVIT / AUTHORIZATION FOR SUCCESSION CERTIFICATE / LEGAL HEIR DECLARATION

I, [Deponent Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address], being the [Relationship] of the deceased, do hereby state on oath that:

1. That Mr./Mrs. [Deceased Name] S/o [Deceased Father Name], CNIC No. [Deceased CNIC], expired on [Date of Death] at [Place of Death].
2. That the deceased has left behind the following legal heirs:

   S.No. | Name | Relationship | CNIC No. | Age
   ------|------|--------------|----------|----
   1.    | [Heir 1 Name] | [Relationship] | [CNIC] | [Age]
   2.    | [Heir 2 Name] | [Relationship] | [CNIC] | [Age]

3. That the above-mentioned is the complete list of legal heirs and no heir has been omitted or concealed.
4. That the deceased has left behind the following moveable/immoveable properties: [Property Details].
5. That all legal heirs mentioned above have authorized the undersigned to act on their behalf for the purpose of applying for Succession Certificate / Letter of Administration.
6. That the list of legal heirs and details of assets provided are true and correct to the best of my knowledge and belief and nothing has been concealed.

DEPONENT
[Name] S/o [Father Name]
CNIC: ___________

Date: _______________     Place: _______________

___________________________               ______________________________
Sign/Thumb Impression (Applicant)         Attested by Oath Commissioner

Witness 1: ___________________     Witness 2: ___________________

INSTRUCTIONS:
- Title: AFFIDAVIT / AUTHORIZATION FOR SUCCESSION CERTIFICATE (centered, bold)
- "That..." numbered clauses
- Legal heirs in a formatted table: Name, Relationship, CNIC, Age
- Declaration that list is complete (no heir omitted)
- Both deponent and Oath Commissioner signature blocks
- Output as clean HTML using <table> for heirs list. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
