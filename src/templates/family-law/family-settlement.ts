import { TemplateDefinition } from "../types";

export const familySettlement: TemplateDefinition = {
  category: "family-law",
  subType: "family-settlement",
  name: "Family Settlement / Razinama",
  nameUrdu: "خاندانی صلح نامہ / رضی نامہ",
  description: "Family settlement/compromise deed (Razinama) for resolving family disputes",
  descriptionUrdu: "خاندانی تنازعات کے حل کے لیے صلح نامہ / رضی نامہ",
  icon: "Handshake",
  formFields: [
    {
      name: "partyOneName",
      label: "First Party Name",
      labelUrdu: "فریق اول کا نام",
      type: "text",
      required: true,
      group: "Party One",
    },
    {
      name: "partyOneFatherName",
      label: "First Party Father's Name",
      labelUrdu: "فریق اول کے والد کا نام",
      type: "text",
      required: true,
      group: "Party One",
    },
    {
      name: "partyOneCnic",
      label: "First Party CNIC",
      labelUrdu: "فریق اول کا شناختی کارڈ",
      type: "cnic",
      required: true,
      group: "Party One",
    },
    {
      name: "partyTwoName",
      label: "Second Party Name",
      labelUrdu: "فریق دوم کا نام",
      type: "text",
      required: true,
      group: "Party Two",
    },
    {
      name: "partyTwoFatherName",
      label: "Second Party Father's Name",
      labelUrdu: "فریق دوم کے والد کا نام",
      type: "text",
      required: true,
      group: "Party Two",
    },
    {
      name: "partyTwoCnic",
      label: "Second Party CNIC",
      labelUrdu: "فریق دوم کا شناختی کارڈ",
      type: "cnic",
      required: true,
      group: "Party Two",
    },
    {
      name: "disputeDetails",
      label: "Details of Dispute",
      labelUrdu: "تنازعے کی تفصیلات",
      type: "textarea",
      required: true,
      group: "Dispute Details",
    },
    {
      name: "settlementTerms",
      label: "Settlement Terms",
      labelUrdu: "صلح کی شرائط",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Settlement Terms",
    },
    {
      name: "propertyDivision",
      label: "Property Division Details (if any)",
      labelUrdu: "جائیداد کی تقسیم کی تفصیلات (اگر ہو)",
      type: "textarea",
      required: false,
      group: "Settlement Terms",
    },
    {
      name: "maintenanceTerms",
      label: "Maintenance Terms (if any)",
      labelUrdu: "نفقے کی شرائط (اگر ہوں)",
      type: "textarea",
      required: false,
      group: "Settlement Terms",
    },
    {
      name: "custodyTerms",
      label: "Custody Terms (if any)",
      labelUrdu: "تحویل کی شرائط (اگر ہوں)",
      type: "textarea",
      required: false,
      group: "Settlement Terms",
    },
    {
      name: "witnesses",
      label: "Witnesses (Names and CNICs)",
      labelUrdu: "گواہان (نام اور شناختی کارڈ)",
      type: "textarea",
      required: true,
      group: "Witnesses",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a Family Settlement Deed (Razinama) in {{language}}.

FIRST PARTY:
- Name: {{partyOneName}}
- Father's Name: {{partyOneFatherName}}
- CNIC: {{partyOneCnic}}

SECOND PARTY:
- Name: {{partyTwoName}}
- Father's Name: {{partyTwoFatherName}}
- CNIC: {{partyTwoCnic}}

DISPUTE: {{disputeDetails}}

SETTLEMENT TERMS: {{settlementTerms}}
PROPERTY DIVISION: {{propertyDivision}}
MAINTENANCE TERMS: {{maintenanceTerms}}
CUSTODY TERMS: {{custodyTerms}}

WITNESSES: {{witnesses}}

Generate a complete Family Settlement Deed (Razinama) following Pakistani legal format.
Include clauses for mutual consent, bindinREFERENCE FORMAT - Follow this exact Pakistani legal format:

FAMILY SETTLEMENT DEED

This Family Settlement Deed is made and executed on this ___ day of ___________, 20___ at [City].

BETWEEN THE FOLLOWING FAMILY MEMBERS:

1. [First Party Name] S/o [Father Name], CNIC No. [CNIC] — [Relation]
2. [Second Party Name] S/o [Father Name], CNIC No. [CNIC] — [Relation]
3. [Third Party Name] S/o [Father Name], CNIC No. [CNIC] — [Relation]
(All being legal heirs / family members of late [Deceased Name])

WHEREAS the family members have amicably agreed to settle the following matters:

MATTERS IN DISPUTE:
[Description of family dispute - inheritance / property / maintenance / custody]

NOW THEREFORE THE PARTIES AGREE AS UNDER:

1. That [First Party] shall receive / retain: [Description of First Party's Share / Rights].
2. That [Second Party] shall receive / retain: [Description of Second Party's Share / Rights].
3. That all pending litigation / cases between the parties shall be withdrawn within [Days] days.
4. That this settlement is final and binding on all parties and their heirs.
5. That no party shall raise any future claim in respect of the matters settled herein.

[PARTY 1]        [PARTY 2]        [PARTY 3]
CNIC: ___        CNIC: ___        CNIC: ___

Witness 1: ___________________   Witness 2: ___________________

INSTRUCTIONS:
- Title: FAMILY SETTLEMENT DEED (centered, bold)
- List all family member parties with their relation
- WHEREAS recital with dispute description
- Numbered "That..." clauses with each party's share
- Include withdrawal of litigation clause
- Include finality and binding clause
- All parties sign
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
