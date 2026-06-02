import { TemplateDefinition } from "../types";

export const surrenderDeed: TemplateDefinition = {
  category: "agreement",
  subType: "surrender-deed",
  name: "Surrender Deed",
  nameUrdu: "دست برداری نامہ",
  description: "Deed for surrendering rights or claims on property",
  descriptionUrdu: "جائیداد پر حقوق یا دعوے سے دست برداری کا نامہ",
  icon: "HandMetal",
  formFields: [
    {
      name: "surrendererName",
      label: "Surrenderer Name",
      labelUrdu: "دست بردار ہونے والے کا نام",
      type: "text",
      required: true,
      group: "Surrenderer Details",
    },
    {
      name: "surrendererFatherName",
      label: "Surrenderer's Father's Name",
      labelUrdu: "دست بردار ہونے والے کے والد کا نام",
      type: "text",
      required: true,
      group: "Surrenderer Details",
    },
    {
      name: "surrendererCnic",
      label: "Surrenderer CNIC",
      labelUrdu: "دست بردار ہونے والے کا شناختی کارڈ",
      type: "cnic",
      required: true,
      group: "Surrenderer Details",
    },
    {
      name: "surrendererAddress",
      label: "Surrenderer Address",
      labelUrdu: "دست بردار ہونے والے کا پتہ",
      type: "address",
      required: true,
      group: "Surrenderer Details",
    },
    {
      name: "beneficiaryName",
      label: "Beneficiary Name",
      labelUrdu: "مستفید کا نام",
      type: "text",
      required: true,
      group: "Beneficiary Details",
    },
    {
      name: "beneficiaryFatherName",
      label: "Beneficiary's Father's Name",
      labelUrdu: "مستفید کے والد کا نام",
      type: "text",
      required: true,
      group: "Beneficiary Details",
    },
    {
      name: "beneficiaryCnic",
      label: "Beneficiary CNIC",
      labelUrdu: "مستفید کا شناختی کارڈ",
      type: "cnic",
      required: true,
      group: "Beneficiary Details",
    },
    {
      name: "beneficiaryAddress",
      label: "Beneficiary Address",
      labelUrdu: "مستفید کا پتہ",
      type: "address",
      required: true,
      group: "Beneficiary Details",
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
      name: "rightsBeingSurrendered",
      label: "Rights Being Surrendered",
      labelUrdu: "جن حقوق سے دست برداری ہو رہی ہے",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Surrender Details",
    },
    {
      name: "reasonForSurrender",
      label: "Reason for Surrender",
      labelUrdu: "دست برداری کی وجہ",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Surrender Details",
    },
    {
      name: "consideration",
      label: "Consideration Amount (PKR) - if any",
      labelUrdu: "معاوضہ کی رقم (روپے) - اگر کوئی ہو",
      type: "number",
      required: false,
      group: "Surrender Details",
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
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a Surrender Deed (Dastbardari Nama) in {{language}}.

SURRENDERER:
- Name: {{surrendererName}}
- Father's Name: {{surrendererFatherName}}
- CNIC: {{surrendererCnic}}
- Address: {{surrendererAddress}}

BENEFICIARY:
- Name: {{beneficiaryName}}
- Father's Name: {{beneficiaryFatherName}}
- CNIC: {{beneficiaryCnic}}
- Address: {{beneficiaryAddress}}

PROPERTY: {{propertyDescription}}

SURRENDER DETAILS:
- Rights Being Surrendered: {{rightsBeingSurrendered}}
- Reason: {{reasonForSurrender}}
- Consideration: PKR {{consideration}}

WITNESSES:
- Witness 1: {{witness1Name}}
- Witness 2: {{witness2Name}}

Generate a complete Surrender Deed following Pakistani Transfer of Property Act. Include REFERENCE FORMAT - Follow this exact Pakistani legal format:

DEED OF SURRENDER

This Deed of Surrender is made and executed on this ___ day of ___________, 20___ at [City].

BETWEEN:

[Surrenderor Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
(hereinafter called the "SURRENDEROR")

AND

[Recipient Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
(hereinafter called the "RECIPIENT")

WHEREAS the Surrenderor holds certain rights / interests in [Subject Matter - tenancy / property / lease / office] by virtue of [Origin - rent agreement / appointment / allotment letter] dated [Original Date].

NOW THEREFORE IN CONSIDERATION of PKR [Consideration]/- / [Other Consideration], the Surrenderor hereby agrees as under:

1. That the Surrenderor hereby voluntarily surrenders all his/her rights, interests, and claims in [Subject Matter] to the Recipient with effect from [Surrender Date].
2. That from the date of this surrender, the Surrenderor shall have no right, title, or interest in the said [property / tenancy / position].
3. That the Surrenderor has vacated / handed over possession of the said [premises / office] to the Recipient.
4. That this surrender is final, voluntary, and not under duress or coercion.

SURRENDEROR                             RECIPIENT
[Name]                                  [Name]
CNIC: ___________                       CNIC: ___________

Witness 1: ___________________   Witness 2: ___________________

INSTRUCTIONS:
- Title: DEED OF SURRENDER (centered, bold)
- BETWEEN / AND party structure
- WHEREAS recital identifying the right/interest being surrendered
- Numbered "That..." clauses
- Include voluntary surrender, no future claims, possession handover
- Both signatures at bottom
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
