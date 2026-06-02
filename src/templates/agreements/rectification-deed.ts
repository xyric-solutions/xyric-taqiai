import { TemplateDefinition } from "../types";

export const rectificationDeed: TemplateDefinition = {
  category: "agreement",
  subType: "rectification-deed",
  name: "Rectification Deed",
  nameUrdu: "اصلاحی نامہ",
  description: "Deed to correct errors in a previously registered document",
  descriptionUrdu: "پہلے سے رجسٹرڈ دستاویز میں غلطیوں کی تصحیح کا نامہ",
  icon: "PenLine",
  formFields: [
    {
      name: "party1Name",
      label: "Party 1 Name",
      labelUrdu: "فریق اول کا نام",
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
      name: "party2Name",
      label: "Party 2 Name",
      labelUrdu: "فریق دوم کا نام",
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
      name: "originalDeedType",
      label: "Original Deed Type",
      labelUrdu: "اصل دستاویز کی قسم",
      type: "text",
      required: true,
      group: "Original Deed Details",
    },
    {
      name: "originalDeedDate",
      label: "Original Deed Date",
      labelUrdu: "اصل دستاویز کی تاریخ",
      type: "date",
      required: true,
      group: "Original Deed Details",
    },
    {
      name: "registrationNumber",
      label: "Registration Number",
      labelUrdu: "رجسٹریشن نمبر",
      type: "text",
      required: false,
      group: "Original Deed Details",
    },
    {
      name: "errorDescription",
      label: "Description of Error(s)",
      labelUrdu: "غلطی / غلطیوں کی تفصیل",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Rectification Details",
    },
    {
      name: "correctionDetails",
      label: "Correction Details (What it should read)",
      labelUrdu: "تصحیح کی تفصیل (درست عبارت)",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Rectification Details",
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
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a Rectification Deed (Islahi Nama) in {{language}}.

PARTY 1:
- Name: {{party1Name}}
- Father's Name: {{party1FatherName}}
- CNIC: {{party1Cnic}}
- Address: {{party1Address}}

PARTY 2:
- Name: {{party2Name}}
- Father's Name: {{party2FatherName}}
- CNIC: {{party2Cnic}}
- Address: {{party2Address}}

ORIGINAL DEED:
- Type: {{originalDeedType}}
- Date: {{originalDeedDate}}
- Registration No: {{registrationNumber}}

RECTIFICATION:
- Error Description: {{errorDescription}}
- Correction: {{correctionDetails}}

WITNESSES:
- Witness 1: {{witness1Name}}
- Witness 2: {{witness2Name}}

Generate a complete Rectification Deed following Pakistani Registration Act. Include recitals of originalREFERENCE FORMAT - Follow this exact Pakistani legal format:

RECTIFICATION DEED / DEED OF CORRECTION

This Rectification Deed is made and executed on this ___ day of ___________, 20___ at [City].

BETWEEN:

[First Party Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
(hereinafter called the "FIRST PARTY")

AND

[Second Party Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
(hereinafter called the "SECOND PARTY")

WHEREAS the parties had executed a [Type of Original Deed] dated [Original Date], registered as Document No. [Doc No.] at [Registration Office], and it has been found that the said deed contains the following error(s):

ERROR(S) FOUND:
- [Clause / Field with error]: "[Incorrect text as written in original deed]"

NOW THEREFORE BOTH PARTIES AGREE AND DECLARE AS UNDER:

1. That the above-mentioned error(s) in the original deed are the result of a clerical / typographical mistake.
2. That the correct text / information is: "[Corrected Text]"
3. That all other terms and conditions of the original deed dated [Original Date] shall remain unchanged and in full force and effect.
4. That this rectification deed shall be read and construed as part of the original deed.

FIRST PARTY                             SECOND PARTY
[Name]                                  [Name]
CNIC: ___________                       CNIC: ___________

Witness 1: ___________________   Witness 2: ___________________

INSTRUCTIONS:
- Title: RECTIFICATION DEED / DEED OF CORRECTION (centered, bold)
- BETWEEN / AND party structure
- WHEREAS recital identifying original deed and error(s)
- Numbered "That..." clauses with corrected text
- Declaration that all other terms unchanged
- Both signatures at bottom
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
