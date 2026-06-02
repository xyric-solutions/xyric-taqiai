import { TemplateDefinition } from "../types";

export const releaseDeed: TemplateDefinition = {
  category: "agreement",
  subType: "release-deed",
  name: "Release Deed",
  nameUrdu: "دستاویز برات",
  description: "Release of rights or claims over property or matter",
  descriptionUrdu: "جائیداد یا معاملے پر حقوق یا دعووں سے دست برداری",
  icon: "Unlock",
  formFields: [
    {
      name: "releasorName",
      label: "Releasor Name",
      labelUrdu: "حق چھوڑنے والے کا نام",
      type: "text",
      required: true,
      group: "Releasor Details",
    },
    {
      name: "releasorFatherName",
      label: "Releasor's Father's Name",
      labelUrdu: "حق چھوڑنے والے کے والد کا نام",
      type: "text",
      required: true,
      group: "Releasor Details",
    },
    {
      name: "releasorCnic",
      label: "Releasor CNIC",
      labelUrdu: "حق چھوڑنے والے کا شناختی کارڈ",
      type: "cnic",
      required: true,
      group: "Releasor Details",
    },
    {
      name: "releasorAddress",
      label: "Releasor Address",
      labelUrdu: "حق چھوڑنے والے کا پتہ",
      type: "address",
      required: true,
      group: "Releasor Details",
    },
    {
      name: "releaseeName",
      label: "Releasee Name",
      labelUrdu: "جس کے حق میں چھوڑا جا رہا ہے اس کا نام",
      type: "text",
      required: true,
      group: "Releasee Details",
    },
    {
      name: "releaseeFatherName",
      label: "Releasee's Father's Name",
      labelUrdu: "مستفید کے والد کا نام",
      type: "text",
      required: true,
      group: "Releasee Details",
    },
    {
      name: "releaseeCnic",
      label: "Releasee CNIC",
      labelUrdu: "مستفید کا شناختی کارڈ",
      type: "cnic",
      required: true,
      group: "Releasee Details",
    },
    {
      name: "releaseeAddress",
      label: "Releasee Address",
      labelUrdu: "مستفید کا پتہ",
      type: "address",
      required: true,
      group: "Releasee Details",
    },
    {
      name: "natureOfClaim",
      label: "Nature of Claim Being Released",
      labelUrdu: "چھوڑے جانے والے دعوے کی نوعیت",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Release Details",
    },
    {
      name: "propertyOrMatterDetails",
      label: "Property / Matter Details",
      labelUrdu: "جائیداد / معاملے کی تفصیل",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Release Details",
    },
    {
      name: "consideration",
      label: "Consideration Amount (PKR) - if any",
      labelUrdu: "معاوضہ کی رقم (روپے) - اگر کوئی ہو",
      type: "number",
      required: false,
      group: "Release Details",
    },
    {
      name: "additionalTerms",
      label: "Additional Terms",
      labelUrdu: "اضافی شرائط",
      type: "textarea",
      required: false,
      aiSuggestable: true,
      group: "Terms",
    },
    {
      name: "witness1Name",
      label: "Witness 1 Name",
      labelUrdu: "گواہ 1 کا نام",
      type: "text",
      required: true,
      group: "Witnesses",
    },
    {
      name: "witness2Name",
      label: "Witness 2 Name",
      labelUrdu: "گواہ 2 کا نام",
      type: "text",
      required: true,
      group: "Witnesses",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a Release Deed (Dastawez-e-Barat) in {{language}}.

RELEASOR:
- Name: {{releasorName}}
- Father's Name: {{releasorFatherName}}
- CNIC: {{releasorCnic}}
- Address: {{releasorAddress}}

RELEASEE:
- Name: {{releaseeName}}
- Father's Name: {{releaseeFatherName}}
- CNIC: {{releaseeCnic}}
- Address: {{releaseeAddress}}

RELEASE DETAILS:
- Nature of Claim: {{natureOfClaim}}
- Property/Matter: {{propertyOrMatterDetails}}
- Consideration: PKR {{consideration}}

ADDITIONAL TERMS: {{additionalTerms}}

WITNESSES:
- Witness 1: {{witness1Name}}
- Witness 2: {{witness2Name}}

Generate a complete Release Deed following Pakistani Transfer of Property Act. IncREFERENCE FORMAT - Follow this exact Pakistani legal format:

DEED OF RELEASE / RELINQUISHMENT

This Deed of Release is made and executed on this ___ day of ___________, 20___ at [City].

BETWEEN:

[Releasor Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
(hereinafter called the "RELEASOR")

AND

[Releasee Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
(hereinafter called the "RELEASEE")

WHEREAS the Releasor had / has certain rights, claims, or interests in [Subject Matter - property / money / business] arising from [Origin - inheritance / contract / dispute].

NOW THEREFORE IN CONSIDERATION of PKR [Consideration]/- (OR as natural love and affection), the Releasor hereby agrees as under:

1. That the Releasor hereby voluntarily releases, relinquishes, and forever discharges the Releasee from all claims, rights, demands, and causes of action in respect of [Subject Matter].
2. That the Releasor confirms having received full and final settlement of all dues.
3. That the Releasor shall not raise any further claim, demand, or proceedings against the Releasee in respect of the released matter.
4. That this release is given voluntarily and without any coercion, undue influence, or misrepresentation.

RELEASOR                                RELEASEE
[Name]                                  [Name]
CNIC: ___________                       CNIC: ___________

Witness 1: ___________________   Witness 2: ___________________

INSTRUCTIONS:
- Title: DEED OF RELEASE / RELINQUISHMENT (centered, bold)
- BETWEEN / AND party structure
- WHEREAS recital identifying the claim/right being released
- Numbered "That..." clauses
- Include consideration, voluntary release, no future claims
- Both signatures at bottom
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
