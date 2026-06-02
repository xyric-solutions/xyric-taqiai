import { TemplateDefinition } from "../types";

export const deathCertificateAffidavit: TemplateDefinition = {
  category: "affidavit",
  subType: "death-certificate",
  name: "Death Certificate Affidavit",
  nameUrdu: "وفاتی سرٹیفکیٹ حلف نامہ",
  description: "Affidavit for death certificate issuance",
  descriptionUrdu: "وفاتی سرٹیفکیٹ کے اجراء کے لیے حلف نامہ",
  icon: "FileX",
  formFields: [
    {
      name: "deponentName",
      label: "Deponent Name",
      labelUrdu: "حلف اٹھانے والے کا نام",
      type: "text",
      required: true,
      group: "Deponent Details",
    },
    {
      name: "deponentCnic",
      label: "Deponent CNIC",
      labelUrdu: "شناختی کارڈ",
      type: "cnic",
      required: true,
      group: "Deponent Details",
    },
    {
      name: "relationToDeceased",
      label: "Relation to Deceased",
      labelUrdu: "مرحوم سے تعلق",
      type: "text",
      required: true,
      group: "Deponent Details",
    },
    {
      name: "deceasedName",
      label: "Deceased Person's Name",
      labelUrdu: "مرحوم کا نام",
      type: "text",
      required: true,
      group: "Deceased Details",
    },
    {
      name: "deceasedFatherName",
      label: "Deceased's Father's Name",
      labelUrdu: "مرحوم کے والد کا نام",
      type: "text",
      required: true,
      group: "Deceased Details",
    },
    {
      name: "deceasedCnic",
      label: "Deceased CNIC",
      labelUrdu: "مرحوم کا شناختی کارڈ",
      type: "cnic",
      required: false,
      group: "Deceased Details",
    },
    {
      name: "dateOfDeath",
      label: "Date of Death",
      labelUrdu: "تاریخ وفات",
      type: "date",
      required: true,
      group: "Death Details",
    },
    {
      name: "placeOfDeath",
      label: "Place of Death",
      labelUrdu: "جائے وفات",
      type: "text",
      required: true,
      group: "Death Details",
    },
    {
      name: "causeOfDeath",
      label: "Cause of Death",
      labelUrdu: "وجہ وفات",
      type: "text",
      required: false,
      group: "Death Details",
    },
    {
      name: "reason",
      label: "Reason for Affidavit",
      labelUrdu: "حلف نامے کی وجہ",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Details",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a Death Certificate Affidavit in {{language}}.

DEPONENT:
- Name: {{deponentName}}
- CNIC: {{deponentCnic}}
- Relation to Deceased: {{relationToDeceased}}

DECEASED:
- Name: {{deceasedName}}
- Father's Name: {{deceasedFatherName}}
- CNIC: {{deceasedCnic}}
- Date of Death: {{dateOfDeath}}
- Place of Death: {{placeOfDeath}}
- Cause of Death: {{causeOfDeath}}

REASON: {{reason}}

REFERENCE FORMAT — Follow this exact Pakistani legal format:

AFFIDAVIT FOR DEATH CERTIFICATE

I, [Deponent Name] S/o [Father Name], CNIC No. [CNIC], [Relation] of the deceased, resident of [Address], do hereby solemnly affirm and declare as under:

1. That [Deceased Name] S/o [Deceased Father Name], CNIC No. [Deceased CNIC], was a resident of [Address].
2. That the said [Deceased Name] passed away on [Date of Death] at [Place of Death] due to [Cause of Death / natural causes / illness].
3. That the death of the said [Deceased Name] has not been registered / has been registered late due to [Reason — administrative delay / remote area].
4. That I am the [Relation — son / daughter / spouse / brother] of the deceased and am making this affidavit for the purpose of obtaining the death certificate from the relevant authority / NADRA.
5. That the contents of this affidavit are true and correct to the best of my knowledge and belief and nothing has been concealed.

DEPONENT
[Deponent Name] S/o [Father Name]
CNIC: ___________
(Relation to Deceased: [Relation])

VERIFICATION:
Verified on oath at [City] on this ___ day of ___________ that the contents of the above affidavit are true and correct to the best of my knowledge and belief and nothing has been concealed therein.

DEPONENT

ATTESTED
(Oath Commissioner / Notary Public / Class-1 Officer)

INSTRUCTIONS:
- Title: AFFIDAVIT FOR DEATH CERTIFICATE (centered, bold)
- "That..." numbered clauses
- Include deceased's full name, CNIC, date and place of death
- Include cause of death
- Include reason for late registration if applicable
- Include VERIFICATION paragraph
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
