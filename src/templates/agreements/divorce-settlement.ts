import { TemplateDefinition } from "../types";

export const divorceSettlement: TemplateDefinition = {
  category: "agreement",
  subType: "divorce-settlement",
  name: "Divorce Settlement Agreement",
  nameUrdu: "طلاق کی تصفیہ نامہ",
  description: "Mutual divorce settlement agreement",
  descriptionUrdu: "باہمی رضامندی سے طلاق کے تصفیے کا معاہدہ",
  icon: "Scale",
  formFields: [
    {
      name: "husbandName",
      label: "Husband Name",
      labelUrdu: "شوہر کا نام",
      type: "text",
      required: true,
      group: "Husband Details",
    },
    {
      name: "husbandFatherName",
      label: "Husband's Father's Name",
      labelUrdu: "شوہر کے والد کا نام",
      type: "text",
      required: true,
      group: "Husband Details",
    },
    {
      name: "husbandCnic",
      label: "Husband CNIC",
      labelUrdu: "شوہر کا شناختی کارڈ",
      type: "cnic",
      required: true,
      group: "Husband Details",
    },
    {
      name: "husbandAddress",
      label: "Husband Address",
      labelUrdu: "شوہر کا پتہ",
      type: "address",
      required: true,
      group: "Husband Details",
    },
    {
      name: "wifeName",
      label: "Wife Name",
      labelUrdu: "بیوی کا نام",
      type: "text",
      required: true,
      group: "Wife Details",
    },
    {
      name: "wifeFatherName",
      label: "Wife's Father's Name",
      labelUrdu: "بیوی کے والد کا نام",
      type: "text",
      required: true,
      group: "Wife Details",
    },
    {
      name: "wifeCnic",
      label: "Wife CNIC",
      labelUrdu: "بیوی کا شناختی کارڈ",
      type: "cnic",
      required: true,
      group: "Wife Details",
    },
    {
      name: "wifeAddress",
      label: "Wife Address",
      labelUrdu: "بیوی کا پتہ",
      type: "address",
      required: true,
      group: "Wife Details",
    },
    {
      name: "marriageDate",
      label: "Marriage Date",
      labelUrdu: "نکاح کی تاریخ",
      type: "date",
      required: true,
      group: "Marriage Details",
    },
    {
      name: "marriagePlace",
      label: "Place of Marriage",
      labelUrdu: "نکاح کی جگہ",
      type: "text",
      required: false,
      group: "Marriage Details",
    },
    {
      name: "mehrSettlement",
      label: "Mehr Settlement Details",
      labelUrdu: "مہر کے تصفیے کی تفصیل",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Settlement Terms",
    },
    {
      name: "childrenCustody",
      label: "Children Custody Arrangement",
      labelUrdu: "بچوں کی تحویل کا انتظام",
      type: "textarea",
      required: false,
      aiSuggestable: true,
      group: "Settlement Terms",
    },
    {
      name: "maintenanceTerms",
      label: "Maintenance / Nafqa Terms",
      labelUrdu: "نفقہ / خرچے کی شرائط",
      type: "textarea",
      required: false,
      aiSuggestable: true,
      group: "Settlement Terms",
    },
    {
      name: "propertyDivision",
      label: "Property Division",
      labelUrdu: "جائیداد کی تقسیم",
      type: "textarea",
      required: false,
      aiSuggestable: true,
      group: "Settlement Terms",
    },
    {
      name: "mutualConsentTerms",
      label: "Mutual Consent Terms",
      labelUrdu: "باہمی رضامندی کی شرائط",
      type: "textarea",
      required: false,
      aiSuggestable: true,
      group: "Terms",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a Divorce Settlement Agreement in {{language}}.

HUSBAND:
- Name: {{husbandName}}
- Father's Name: {{husbandFatherName}}
- CNIC: {{husbandCnic}}
- Address: {{husbandAddress}}

WIFE:
- Name: {{wifeName}}
- Father's Name: {{wifeFatherName}}
- CNIC: {{wifeCnic}}
- Address: {{wifeAddress}}

MARRIAGE:
- Date: {{marriageDate}}
- Place: {{marriagePlace}}

SETTLEMENT TERMS:
- Mehr: {{mehrSettlement}}
- Children Custody: {{childrenCustody}}
- Maintenance/Nafqa: {{maintenanceTerms}}
- Property Division: {{propertyDivision}}
- Mutual Consent: {{mutualConsentTerms}}

Generate a complete Divorce Settlement Agreement following REFERENCE FORMAT - Follow this exact Pakistani legal format:

DIVORCE SETTLEMENT DEED / DEED OF SEPARATION

This Divorce Settlement Deed is made and executed on this ___ day of ___________, 20___ at [City].

BETWEEN:

[Husband Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
(hereinafter called the "HUSBAND")

AND

Mst. [Wife Name] D/o [Father Name], CNIC No. [CNIC], resident of [Address]
(hereinafter called the "WIFE")

WHEREAS the parties were married on [Nikah Date] and the Husband has pronounced Talaq on [Divorce Date] and the Iddat period has been / will be observed as per Islamic law.

NOW THEREFORE BOTH PARTIES AGREE AS UNDER:

1. That the Husband shall pay the Haq Mehr of PKR [Mehr Amount]/- to the Wife [immediately / within [Duration]].
2. That the custody of minor child/children [Names and Ages] shall vest with the [Mother / Father] and the other parent shall have visiting rights.
3. That the Husband shall pay monthly maintenance of PKR [Maintenance Amount]/- for the minor children.
4. That all matrimonial property shall be divided as follows: [Property Division Details].
5. That both parties release each other from all claims, demands, and obligations arising out of the marriage.
6. That the Wife waives her right to claim further Mehr / dower beyond what is agreed herein.

HUSBAND                                 WIFE
[Name]                                  Mst. [Name]
CNIC: ___________                       CNIC: ___________

Witness 1: ___________________   Witness 2: ___________________

INSTRUCTIONS:
- Title: DIVORCE SETTLEMENT DEED (centered, bold)
- BETWEEN / AND party structure
- WHEREAS recital with Nikah and divorce dates
- Numbered "That..." clauses
- Include Mehr, custody, maintenance, mutual release
- Reference Muslim Family Laws Ordinance 1961
- Both signatures at bottom
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
