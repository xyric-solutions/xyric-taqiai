import { TemplateDefinition } from "../types";

export const exchangeDeed: TemplateDefinition = {
  category: "agreement",
  subType: "exchange-deed",
  name: "Exchange Deed",
  nameUrdu: "تبادلہ نامہ",
  description: "Mutual exchange of properties between two parties",
  descriptionUrdu: "دو فریقین کے درمیان جائیدادوں کا باہمی تبادلہ",
  icon: "ArrowLeftRight",
  formFields: [
    {
      name: "party1Name",
      label: "Party 1 (First Exchanger) Name",
      labelUrdu: "فریق اول (پہلے تبادلہ کنندہ) کا نام",
      type: "text",
      required: true,
      group: "Party 1 Details",
    },
    {
      name: "party1FatherName",
      label: "Party 1 Father's Name",
      labelUrdu: "فریق اول کے والد کا نام",
      type: "text",
      required: true,
      group: "Party 1 Details",
    },
    {
      name: "party1Cnic",
      label: "Party 1 CNIC",
      labelUrdu: "فریق اول کا شناختی کارڈ",
      type: "cnic",
      required: true,
      group: "Party 1 Details",
    },
    {
      name: "party1Address",
      label: "Party 1 Address",
      labelUrdu: "فریق اول کا پتہ",
      type: "address",
      required: true,
      group: "Party 1 Details",
    },
    {
      name: "party1PropertyDescription",
      label: "Party 1 Property Description",
      labelUrdu: "فریق اول کی جائیداد کی تفصیل",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Party 1 Property",
    },
    {
      name: "party1PropertyValue",
      label: "Party 1 Property Value (PKR)",
      labelUrdu: "فریق اول کی جائیداد کی قیمت (روپے)",
      type: "number",
      required: true,
      group: "Party 1 Property",
    },
    {
      name: "party2Name",
      label: "Party 2 (Second Exchanger) Name",
      labelUrdu: "فریق دوم (دوسرے تبادلہ کنندہ) کا نام",
      type: "text",
      required: true,
      group: "Party 2 Details",
    },
    {
      name: "party2FatherName",
      label: "Party 2 Father's Name",
      labelUrdu: "فریق دوم کے والد کا نام",
      type: "text",
      required: true,
      group: "Party 2 Details",
    },
    {
      name: "party2Cnic",
      label: "Party 2 CNIC",
      labelUrdu: "فریق دوم کا شناختی کارڈ",
      type: "cnic",
      required: true,
      group: "Party 2 Details",
    },
    {
      name: "party2Address",
      label: "Party 2 Address",
      labelUrdu: "فریق دوم کا پتہ",
      type: "address",
      required: true,
      group: "Party 2 Details",
    },
    {
      name: "party2PropertyDescription",
      label: "Party 2 Property Description",
      labelUrdu: "فریق دوم کی جائیداد کی تفصیل",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Party 2 Property",
    },
    {
      name: "party2PropertyValue",
      label: "Party 2 Property Value (PKR)",
      labelUrdu: "فریق دوم کی جائیداد کی قیمت (روپے)",
      type: "number",
      required: true,
      group: "Party 2 Property",
    },
    {
      name: "differenceAmount",
      label: "Difference Amount (PKR) - if any",
      labelUrdu: "فرق کی رقم (روپے) - اگر کوئی ہو",
      type: "number",
      required: false,
      group: "Exchange Terms",
    },
    {
      name: "additionalTerms",
      label: "Additional Terms",
      labelUrdu: "اضافی شرائط",
      type: "textarea",
      required: false,
      aiSuggestable: true,
      group: "Exchange Terms",
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
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate an Exchange Deed (Tabadla Nama) in {{language}}.

PARTY 1:
- Name: {{party1Name}}
- Father's Name: {{party1FatherName}}
- CNIC: {{party1Cnic}}
- Address: {{party1Address}}
- Property: {{party1PropertyDescription}}
- Property Value: PKR {{party1PropertyValue}}

PARTY 2:
- Name: {{party2Name}}
- Father's Name: {{party2FatherName}}
- CNIC: {{party2Cnic}}
- Address: {{party2Address}}
- Property: {{party2PropertyDescription}}
- Property Value: PKR {{party2PropertyValue}}

EXCHANGE TERMS:
- Difference Amount: PKR {{differenceAmount}}
- Additional Terms: {{additionalTerms}}

WITNESSES:
- Witness 1: {{witness1Name}}
- Witness 2: {{witness2Name}}

Generate a complete Exchange Deed following Pakistani Transfer of Property Act (Section 118-121). IncluREFERENCE FORMAT - Follow this exact Pakistani legal format:

DEED OF EXCHANGE / TABADLA NAMA

This Deed of Exchange is made and executed on this ___ day of ___________, 20___ at [City].

BETWEEN:

[First Party Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
(hereinafter called the "FIRST PARTY / TRANSFEROR 1")

AND

[Second Party Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
(hereinafter called the "SECOND PARTY / TRANSFEROR 2")

WHEREAS:
- First Party owns property: [Property 1 Description - Khasra/Plot No., Area, Mouza/Location]
- Second Party owns property: [Property 2 Description - Khasra/Plot No., Area, Mouza/Location]

NOW THEREFORE BOTH PARTIES AGREE AS UNDER:

1. That both parties hereby mutually exchange the above-described properties with each other.
2. That the value of Property 1 is PKR [Value 1]/- and the value of Property 2 is PKR [Value 2]/-.
3. That the difference of PKR [Difference Amount]/- shall be paid by [First / Second Party] to the other.
4. That each party warrants that the property transferred by them is free from all encumbrances, liens, and liabilities.
5. That both parties shall cooperate for mutation and registration of the exchange.

FIRST PARTY                             SECOND PARTY
[Name]                                  [Name]
CNIC: ___________                       CNIC: ___________

Witness 1: ___________________   Witness 2: ___________________

INSTRUCTIONS:
- Title: DEED OF EXCHANGE / TABADLA NAMA (centered, bold)
- BETWEEN / AND party structure
- WHEREAS recital with both property descriptions
- Numbered "That..." clauses
- Include valuation, difference payment, title warranties
- Both signatures at bottom
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
