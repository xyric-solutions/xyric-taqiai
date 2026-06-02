import { TemplateDefinition } from "../types";

export const birthCertificateAffidavit: TemplateDefinition = {
  category: "affidavit",
  subType: "birth-certificate",
  name: "Birth Certificate Affidavit",
  nameUrdu: "پیدائشی سرٹیفکیٹ حلف نامہ",
  description: "Affidavit for birth certificate issuance or correction",
  descriptionUrdu: "پیدائشی سرٹیفکیٹ کے اجراء یا درستگی کے لیے حلف نامہ",
  icon: "Baby",
  formFields: [
    {
      name: "deponentName",
      label: "Deponent Name (Parent/Guardian)",
      labelUrdu: "حلف اٹھانے والے کا نام (والدین/سرپرست)",
      type: "text",
      required: true,
      group: "Deponent Details",
    },
    {
      name: "deponentCnic",
      label: "Deponent CNIC",
      labelUrdu: "حلف اٹھانے والے کا شناختی کارڈ",
      type: "cnic",
      required: true,
      group: "Deponent Details",
    },
    {
      name: "deponentRelation",
      label: "Relation to Child",
      labelUrdu: "بچے سے تعلق",
      type: "select",
      required: true,
      options: [
        { value: "father", label: "Father", labelUrdu: "والد" },
        { value: "mother", label: "Mother", labelUrdu: "والدہ" },
        { value: "guardian", label: "Guardian", labelUrdu: "سرپرست" },
      ],
      group: "Deponent Details",
    },
    {
      name: "childName",
      label: "Child's Name",
      labelUrdu: "بچے کا نام",
      type: "text",
      required: true,
      group: "Child Details",
    },
    {
      name: "dateOfBirth",
      label: "Date of Birth",
      labelUrdu: "تاریخ پیدائش",
      type: "date",
      required: true,
      group: "Child Details",
    },
    {
      name: "placeOfBirth",
      label: "Place of Birth",
      labelUrdu: "جائے پیدائش",
      type: "text",
      required: true,
      group: "Child Details",
    },
    {
      name: "fatherName",
      label: "Father's Name",
      labelUrdu: "والد کا نام",
      type: "text",
      required: true,
      group: "Parents Details",
    },
    {
      name: "motherName",
      label: "Mother's Name",
      labelUrdu: "والدہ کا نام",
      type: "text",
      required: true,
      group: "Parents Details",
    },
    {
      name: "reason",
      label: "Reason for Affidavit",
      labelUrdu: "حلف نامے کی وجہ",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      placeholder: "e.g., Late registration, name correction, etc.",
      group: "Details",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a Birth Certificate Affidavit in {{language}}.

DEPONENT:
- Name: {{deponentName}}
- CNIC: {{deponentCnic}}
- Relation: {{deponentRelation}}

CHILD:
- Name: {{childName}}
- Date of Birth: {{dateOfBirth}}
- Place of Birth: {{placeOfBirth}}

PARENTS:
- Father: {{fatherName}}
- Mother: {{motherName}}

REASON: {{reason}}

REFERENCE FORMAT — Follow this exact Pakistani legal format:

AFFIDAVIT FOR BIRTH CERTIFICATE

I, [Deponent Name] S/o [Father Name], CNIC No. [CNIC], [Relation] of [Child Name], resident of [Address], do hereby solemnly affirm and declare as under:

1. That [Child Name] was born on [Date of Birth] at [Place of Birth].
2. That the father of the child is [Father Name] S/o [Grandfather Name], CNIC No. [Father CNIC], and the mother is Mst. [Mother Name] W/o [Father Name].
3. That the birth of the said child has not been registered / has been registered late due to [Reason — administrative oversight / no hospital birth record].
4. That I am making this affidavit for the purpose of getting the birth certificate / B-Form issued from NADRA.
5. That the contents of this affidavit are true and correct to the best of my knowledge and belief and nothing has been concealed.

DEPONENT
[Deponent Name] S/o [Father Name]
CNIC: ___________
(Relation to Child: [Relation])

VERIFICATION:
Verified on oath at [City] on this ___ day of ___________ that the contents of the above affidavit are true and correct to the best of my knowledge and belief and nothing has been concealed therein.

DEPONENT

ATTESTED
(Oath Commissioner / Notary Public / Class-1 Officer)

INSTRUCTIONS:
- Title: AFFIDAVIT FOR BIRTH CERTIFICATE (centered, bold)
- "That..." numbered clauses
- Include child's full name, DOB, place of birth
- Include both parents' names with CNICs
- Include reason for late registration
- Include VERIFICATION paragraph
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
