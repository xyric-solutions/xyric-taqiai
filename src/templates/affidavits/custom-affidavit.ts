import { TemplateDefinition } from "../types";

export const customAffidavit: TemplateDefinition = {
  category: "affidavit",
  subType: "custom-affidavit",
  name: "Custom / AI-Guided Affidavit",
  nameUrdu: "حسب ضرورت حلف نامہ",
  description: "Apni zaroorat batayein, AI affidavit generate kar dega",
  descriptionUrdu: "اپنی ضرورت بتائیں، اے آئی حلف نامہ تیار کر دے گا",
  icon: "Sparkles",
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
      name: "description",
      label: "Tell AI - What do you want in your affidavit?",
      labelUrdu: "اے آئی کو بتائیں - آپ کے حلف نامے میں کیا لکھنا ہے؟",
      type: "textarea",
      required: true,
      placeholder: "Describe the type of affidavit you need and what it should contain. The more detail you provide, the better the affidavit will be.\n\nExample: I need a property ownership affidavit stating that this land is registered in my name and no other party has any claim over it...",
      placeholderUrdu: "یہاں لکھیں کہ آپ کو کس قسم کا حلف نامہ چاہیے اور اس میں کیا کیا لکھنا ہے۔",
      group: "Affidavit Details",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. The user will describe what kind of affidavit they need. Based on their description, you must:

1. Identify the appropriate affidavit type
2. Generate a complete, legally valid affidavit in {{language}}

DEPONENT DETAILS:
- Name: {{deponentName}}
- Father's/Husband's Name: {{fatherName}}
- CNIC: {{cnic}}
- Address: {{address}}
- City: {{city}}

USER'S REQUIREMENT:
{{description}}

Based on the above description, generate a complete legally valid affidavit following Pakistani legal format. Include:
1. Appropriate title and heading (you decide based on the description)
2. Deponent identification paragraph
3. Numbered clauses covering all facts and declarations
4. Relevant legal provisions and references under Pakistani law
5. REFERENCE FORMAT - Follow this exact Pakistani legal format:

AFFIDAVIT

I, [Deponent Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address], do hereby solemnly affirm and declare as under:

1. That [First statement of fact / declaration based on custom content].
2. That [Second statement of fact / declaration].
3. That [Third statement - continue as needed based on the facts provided].
4. That the contents of this affidavit are true and correct to the best of my knowledge and belief and nothing has been concealed.

DEPONENT
[Deponent Name] S/o [Father Name]
CNIC: ___________

VERIFICATION:
Verified on oath at [City] on this ___ day of ___________ that the contents of the above affidavit are true and correct to the best of my knowledge and belief and nothing has been concealed therein.

DEPONENT

ATTESTED
(Oath Commissioner / Notary Public / Class-1 Officer)

INSTRUCTIONS:
- Title: AFFIDAVIT (centered, bold) - adapt title to match the custom purpose
- "That..." numbered clauses based on the custom content
- Include VERIFICATION paragraph
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
