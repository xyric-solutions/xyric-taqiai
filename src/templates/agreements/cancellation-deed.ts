import { TemplateDefinition } from "../types";

export const cancellationDeed: TemplateDefinition = {
  category: "agreement",
  subType: "cancellation-deed",
  name: "Cancellation Deed",
  nameUrdu: "منسوخی نامہ",
  description: "Cancellation of a previously registered deed or agreement",
  descriptionUrdu: "پہلے سے رجسٹرڈ دستاویز یا معاہدے کی منسوخی",
  icon: "Ban",
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
      name: "subRegistrarOffice",
      label: "Sub-Registrar Office",
      labelUrdu: "سب رجسٹرار دفتر",
      type: "text",
      required: false,
      group: "Original Deed Details",
    },
    {
      name: "originalDeedDescription",
      label: "Original Deed Description / Subject Matter",
      labelUrdu: "اصل دستاویز کی تفصیل / موضوع",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Original Deed Details",
    },
    {
      name: "reasonForCancellation",
      label: "Reason for Cancellation",
      labelUrdu: "منسوخی کی وجہ",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Cancellation Details",
    },
    {
      name: "mutualConsent",
      label: "Mutual Consent Declaration",
      labelUrdu: "باہمی رضامندی کا اعلان",
      type: "textarea",
      required: false,
      aiSuggestable: true,
      group: "Cancellation Details",
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
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a Cancellation Deed (Mansookhi Nama) in {{language}}.

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
- Sub-Registrar Office: {{subRegistrarOffice}}
- Description: {{originalDeedDescription}}

CANCELLATION:
- Reason: {{reasonForCancellation}}
- Mutual Consent: {{mutualConsent}}

WITNESSES:
- Witness 1: {{witness1Name}}
- Witness 2: {{witness2Name}}

Generate a complete Cancellation Deed following Pakistani Registration Act and Contract Act. IncREFERENCE FORMAT - Follow this exact Pakistani legal format:

DEED OF CANCELLATION

This Deed of Cancellation is made and executed on this ___ day of ___________, 20___ at [City].

BETWEEN:

[First Party Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
(hereinafter called the "FIRST PARTY")

AND

[Second Party Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
(hereinafter called the "SECOND PARTY")

WHEREAS the parties had executed a [Type of Original Deed - Sale Deed / Agreement to Sell / Power of Attorney] dated [Original Date] registered as Document No. [Doc No.] at [Registration Office].

NOW THEREFORE BOTH PARTIES AGREE AND DECLARE AS UNDER:

1. That both parties mutually agree to cancel the above-mentioned deed / agreement with effect from the date of this deed.
2. That the reason for cancellation is [Reason - mutual consent / failure of conditions / non-payment].
3. That upon cancellation, all rights, obligations, and liabilities under the said original deed shall stand null and void.
4. That the parties shall be restored to their original positions as if the said deed had never been executed.
5. That neither party shall have any claim against the other arising out of the cancelled deed.

FIRST PARTY                             SECOND PARTY
[Name]                                  [Name]
CNIC: ___________                       CNIC: ___________

Witness 1: ___________________   Witness 2: ___________________

INSTRUCTIONS:
- Title: DEED OF CANCELLATION (centered, bold)
- BETWEEN / AND party structure
- WHEREAS recital identifying the original deed
- Numbered "That..." clauses
- Include restoration of original positions
- Both signatures at bottom
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
