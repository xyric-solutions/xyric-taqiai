import { TemplateDefinition } from "../types";

export const schoolLeavingAffidavit: TemplateDefinition = {
  category: "affidavit",
  subType: "school-leaving",
  name: "School Leaving Certificate Affidavit",
  nameUrdu: "اسکول چھوڑنے کا حلف نامہ",
  description: "When original SLC is lost or school no longer exists",
  descriptionUrdu: "جب اصل اسکول چھوڑنے کا سرٹیفکیٹ گم ہو یا اسکول موجود نہ ہو",
  icon: "School",
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
      name: "schoolName",
      label: "School Name",
      labelUrdu: "اسکول کا نام",
      type: "text",
      required: true,
      placeholder: "Enter school name and location",
      group: "School Details",
    },
    {
      name: "lastClass",
      label: "Last Class Attended",
      labelUrdu: "آخری جماعت",
      type: "text",
      required: true,
      placeholder: "e.g., Class 10, Matric, 8th Grade",
      group: "School Details",
    },
    {
      name: "yearOfLeaving",
      label: "Year of Leaving",
      labelUrdu: "اسکول چھوڑنے کا سال",
      type: "text",
      required: true,
      placeholder: "e.g., 2015",
      group: "School Details",
    },
    {
      name: "reasonForAffidavit",
      label: "Reason for Affidavit",
      labelUrdu: "حلف نامے کی وجہ",
      type: "select",
      required: true,
      options: [
        { value: "lost-slc", label: "Original SLC Lost", labelUrdu: "اصل سرٹیفکیٹ گم ہو گیا" },
        { value: "school-closed", label: "School Closed / No Longer Exists", labelUrdu: "اسکول بند / موجود نہیں" },
        { value: "school-refuses", label: "School Refuses to Issue", labelUrdu: "اسکول جاری کرنے سے انکاری" },
        { value: "records-destroyed", label: "School Records Destroyed", labelUrdu: "اسکول کا ریکارڈ تباہ ہو گیا" },
        { value: "other", label: "Other", labelUrdu: "دیگر" },
      ],
      group: "School Details",
    },
    {
      name: "additionalDetails",
      label: "Additional Details",
      labelUrdu: "اضافی تفصیلات",
      type: "textarea",
      required: false,
      placeholder: "Any additional information about the circumstances",
      aiSuggestable: true,
      group: "School Details",
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
      group: "School Details",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a formal School Leaving Certificate Affidavit in {{language}}.

PARTY DETAILS:
- Deponent Name: {{deponentName}}
- Father's/Husband's Name: {{fatherName}}
- CNIC: {{cnic}}
- Address: {{address}}
- City: {{city}}

SCHOOL DETAILS:
- School Name: {{schoolName}}
- Last Class Attended: {{lastClass}}
- Year of Leaving: {{yearOfLeaving}}
- Reason for Affidavit: {{reasonForAffidavit}}
- Additional Details: {{additionalDetails}}

Generate a complete, legally valid School Leaving Certificate Affidavit following Pakistani law format. Include:
1. Title and heading with proper formatting
2. Deponent identification paragraph
3. Details of the school attended (name, location)
4. Last class attended and year of leaving
5. Reason why the original SLC cannot be obtained
6. Declaration that the student left the school voluntarily / completed studies
7. Declaration that no dues are pending with the school
8. Request to aREFERENCE FORMAT - Follow this exact Pakistani legal format:

AFFIDAVIT FOR SCHOOL LEAVING CERTIFICATE

I, [Deponent Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address], do hereby solemnly affirm and declare as under:

1. That I / my child [Student Name] was enrolled at [School Name], [City] from [Year] to [Year].
2. That the student passed [Class / Matric] examination from [Board / School] in the year [Year] with Roll No. [Roll No.].
3. That the original School Leaving Certificate / Matric Certificate has been lost / misplaced and despite all efforts it could not be found.
4. That I may kindly be issued a duplicate certificate / the institution may accept this affidavit in lieu of the original.
5. That if the original is found, it will be surrendered immediately to the concerned institution / board.
6. That the contents of this affidavit are true and correct to the best of my knowledge and belief and nothing has been concealed.

DEPONENT
[Deponent Name / Parent Name] S/o [Father Name]
CNIC: ___________

VERIFICATION:
Verified on oath at [City] on this ___ day of ___________ that the contents of the above affidavit are true and correct to the best of my knowledge and belief and nothing has been concealed therein.

DEPONENT

ATTESTED
(Oath Commissioner / Notary Public / Class-1 Officer)

INSTRUCTIONS:
- Title: AFFIDAVIT FOR SCHOOL LEAVING CERTIFICATE (centered, bold)
- "That..." numbered clauses
- Include school name, class, board, roll number
- Include lost certificate and request for duplicate + surrender undertaking
- Include VERIFICATION paragraph
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
