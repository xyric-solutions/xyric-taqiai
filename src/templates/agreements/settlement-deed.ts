import { TemplateDefinition } from "../types";

export const settlementDeed: TemplateDefinition = {
  category: "agreement",
  subType: "settlement-deed",
  name: "Property Settlement Deed",
  nameUrdu: "تصفیہ نامہ",
  description: "Deed for settling property among family members or beneficiaries",
  descriptionUrdu: "خاندان کے افراد یا مستفیدین میں جائیداد کے تصفیے کا نامہ",
  icon: "ClipboardCheck",
  formFields: [
    {
      name: "settlorName",
      label: "Settlor Name",
      labelUrdu: "تصفیہ کنندہ کا نام",
      type: "text",
      required: true,
      group: "Settlor Details",
    },
    {
      name: "settlorFatherName",
      label: "Settlor's Father's Name",
      labelUrdu: "تصفیہ کنندہ کے والد کا نام",
      type: "text",
      required: true,
      group: "Settlor Details",
    },
    {
      name: "settlorCnic",
      label: "Settlor CNIC",
      labelUrdu: "تصفیہ کنندہ کا شناختی کارڈ",
      type: "cnic",
      required: true,
      group: "Settlor Details",
    },
    {
      name: "settlorAddress",
      label: "Settlor Address",
      labelUrdu: "تصفیہ کنندہ کا پتہ",
      type: "address",
      required: true,
      group: "Settlor Details",
    },
    {
      name: "beneficiariesList",
      label: "Beneficiaries (Names, CNICs, Relationship, Shares)",
      labelUrdu: "مستفیدین (نام، شناختی کارڈ، رشتہ، حصے)",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Beneficiaries",
    },
    {
      name: "propertyDescription",
      label: "Property Description",
      labelUrdu: "جائیداد کی تفصیل",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Property Details",
    },
    {
      name: "propertyValue",
      label: "Estimated Property Value (PKR)",
      labelUrdu: "جائیداد کی تخمینی قیمت (روپے)",
      type: "number",
      required: false,
      group: "Property Details",
    },
    {
      name: "shareDistribution",
      label: "Share Distribution Details",
      labelUrdu: "حصوں کی تقسیم کی تفصیل",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Settlement Terms",
    },
    {
      name: "conditions",
      label: "Conditions of Settlement",
      labelUrdu: "تصفیے کی شرائط",
      type: "textarea",
      required: false,
      aiSuggestable: true,
      group: "Settlement Terms",
    },
    {
      name: "irrevocabilityClause",
      label: "Irrevocability Declaration",
      labelUrdu: "ناقابل تنسیخ ہونے کا اعلان",
      type: "textarea",
      required: false,
      aiSuggestable: true,
      group: "Settlement Terms",
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
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a Property Settlement Deed (Tasfiya Nama) in {{language}}.

SETTLOR:
- Name: {{settlorName}}
- Father's Name: {{settlorFatherName}}
- CNIC: {{settlorCnic}}
- Address: {{settlorAddress}}

BENEFICIARIES: {{beneficiariesList}}

PROPERTY:
- Description: {{propertyDescription}}
- Value: PKR {{propertyValue}}

SETTLEMENT:
- Share Distribution: {{shareDistribution}}
- Conditions: {{conditions}}
- Irrevocability: {{irrevocabilityClause}}

WITNESSES:
- Witness 1: {{witness1Name}}
- Witness 2: {{witness2Name}}

Generate a complete Property Settlement Deed following Pakistani Transfer of Property Act and Succession Act. Include recitals, settlor's deREFERENCE FORMAT - Follow this exact Pakistani legal format:

SETTLEMENT DEED / HIBA SETTLEMENT NAMA

This Settlement Deed is made and executed on this ___ day of ___________, 20___ at [City].

BETWEEN:

[Settlor Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
(hereinafter called the "SETTLOR")

AND

[Beneficiary Name] S/o / D/o [Father Name], CNIC No. [CNIC], resident of [Address]
(hereinafter called the "BENEFICIARY")

PROPERTY / ASSET DETAILS:
- [Description of property / assets being settled]
- Khasra / Plot No.: [Number], Mouza: [Mouza], Tehsil: [Tehsil], District: [District]

WHEREAS the Settlor is the absolute owner of the above-described property and has out of natural love and affection / in settlement of family matters agreed to settle the said property.

NOW THEREFORE THE SETTLOR HEREBY DECLARES AND AGREES AS UNDER:

1. That the Settlor hereby settles / transfers the above-described property in favor of the Beneficiary with immediate effect.
2. That the Beneficiary's share is [Share / 100%] of the said property.
3. That the Settlor directs the Revenue Authorities to effect mutation in the name of the Beneficiary.
4. That this settlement is final, irrevocable, and binding on all heirs, successors, and assigns.
5. That the Beneficiary accepts the settlement and takes possession of the said property.

SETTLOR                                 BENEFICIARY
[Name]                                  [Name]
CNIC: ___________                       CNIC: ___________

Witness 1: ___________________   Witness 2: ___________________

INSTRUCTIONS:
- Title: SETTLEMENT DEED (centered, bold)
- BETWEEN / AND party structure
- PROPERTY DETAILS section with Khasra/Mouza details
- WHEREAS recital
- Numbered "That..." clauses
- Include irrevocability, mutation direction
- Both signatures at bottom
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
