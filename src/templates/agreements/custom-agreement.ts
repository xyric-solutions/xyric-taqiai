import { TemplateDefinition } from "../types";

export const customAgreement: TemplateDefinition = {
  category: "agreement",
  subType: "custom-agreement",
  name: "Custom / AI-Guided Agreement",
  nameUrdu: "حسب ضرورت معاہدہ",
  description: "Apni zaroorat batayein, AI agreement generate kar dega",
  descriptionUrdu: "اپنی ضرورت بتائیں، اے آئی معاہدہ تیار کر دے گا",
  icon: "Sparkles",
  formFields: [
    {
      name: "party1Name",
      label: "Party 1 Name",
      labelUrdu: "فریق اول کا نام",
      type: "text",
      required: true,
      placeholder: "Enter full name",
      placeholderUrdu: "پورا نام درج کریں",
      group: "Party Details",
    },
    {
      name: "party1Cnic",
      label: "Party 1 CNIC",
      labelUrdu: "فریق اول کا شناختی کارڈ",
      type: "cnic",
      required: true,
      placeholder: "XXXXX-XXXXXXX-X",
      group: "Party Details",
    },
    {
      name: "party2Name",
      label: "Party 2 Name",
      labelUrdu: "فریق دوم کا نام",
      type: "text",
      required: true,
      placeholder: "Enter full name",
      placeholderUrdu: "پورا نام درج کریں",
      group: "Party Details",
    },
    {
      name: "party2Cnic",
      label: "Party 2 CNIC",
      labelUrdu: "فریق دوم کا شناختی کارڈ",
      type: "cnic",
      required: true,
      placeholder: "XXXXX-XXXXXXX-X",
      group: "Party Details",
    },
    {
      name: "description",
      label: "Tell AI - What kind of agreement do you need?",
      labelUrdu: "اے آئی کو بتائیں - آپ کو کس قسم کا معاہدہ چاہیے؟",
      type: "textarea",
      required: true,
      placeholder: "Describe the type of agreement you need and what it should include. The more detail you provide, the better the agreement will be.\n\nExample: I need an agreement with my house painter covering work details, payment terms, and timeline...",
      placeholderUrdu: "یہاں لکھیں کہ آپ کو کس قسم کا معاہدہ چاہیے اور اس میں کیا کیا لکھنا ہے۔",
      aiSuggestable: true,
      group: "Agreement Details",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Based on the user's description, identify the appropriate agreement type and generate a complete legally valid agreement following Pakistani law format.

PARTY 1:
- Name: {{party1Name}}
- CNIC: {{party1Cnic}}

PARTY 2:
- Name: {{party2Name}}
- CNIC: {{party2Cnic}}

USER'S REQUIREMENT:
{{description}}

Based on the above description:
1. Identify the appropriate agreement type
2. Generate a complete, legally valid agreement in {{language}}
3. Include appropriate title and heading
4. Include all necessary clauses and legal provisions under Pakistani law
5. Add signature blocks for both parties
6. Add witness section
7. Include dREFERENCE FORMAT - Follow this exact Pakistani legal format:

AGREEMENT

This Agreement is made and executed on this ___ day of ___________, 20___ at [City].

BETWEEN:

[First Party Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
(hereinafter called the "FIRST PARTY")

AND

[Second Party Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
(hereinafter called the "SECOND PARTY")

NOW THEREFORE BOTH PARTIES AGREE AS UNDER:

1. That [First agreement clause based on custom content].
2. That [Second clause].
3. That [Third clause - continue as needed].
4. That any dispute arising from this agreement shall be resolved amicably or through arbitration / courts at [City].

FIRST PARTY                             SECOND PARTY
[Name]                                  [Name]
CNIC: ___________                       CNIC: ___________

Witness 1: ___________________   Witness 2: ___________________

INSTRUCTIONS:
- Title: AGREEMENT (centered, bold) - adapt title to match the custom purpose
- BETWEEN / AND party structure
- Numbered "That..." clauses based on custom content
- Both signatures at bottom
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
