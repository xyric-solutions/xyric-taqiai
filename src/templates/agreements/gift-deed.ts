import { TemplateDefinition } from "../types";

export const giftDeed: TemplateDefinition = {
  category: "agreement",
  subType: "gift-deed",
  name: "Gift Deed",
  nameUrdu: "ہبہ نامہ",
  description: "Deed of gift for property, money or assets",
  descriptionUrdu: "جائیداد، رقم یا اثاثوں کا ہبہ نامہ",
  icon: "Gift",
  formFields: [
    {
      name: "donorName",
      label: "Donor (Gift Giver) Name",
      labelUrdu: "ہبہ کنندہ (دینے والے) کا نام",
      type: "text",
      required: true,
      group: "Donor Details",
    },
    {
      name: "donorFatherName",
      label: "Donor's Father's Name",
      labelUrdu: "ہبہ کنندہ کے والد کا نام",
      type: "text",
      required: true,
      group: "Donor Details",
    },
    {
      name: "donorCnic",
      label: "Donor CNIC",
      labelUrdu: "ہبہ کنندہ کا شناختی کارڈ",
      type: "cnic",
      required: true,
      group: "Donor Details",
    },
    {
      name: "donorAddress",
      label: "Donor Address",
      labelUrdu: "ہبہ کنندہ کا پتہ",
      type: "address",
      required: true,
      group: "Donor Details",
    },
    {
      name: "doneeName",
      label: "Donee (Gift Receiver) Name",
      labelUrdu: "ہبہ لینے والے کا نام",
      type: "text",
      required: true,
      group: "Donee Details",
    },
    {
      name: "doneeFatherName",
      label: "Donee's Father's Name",
      labelUrdu: "ہبہ لینے والے کے والد کا نام",
      type: "text",
      required: true,
      group: "Donee Details",
    },
    {
      name: "doneeCnic",
      label: "Donee CNIC",
      labelUrdu: "ہبہ لینے والے کا شناختی کارڈ",
      type: "cnic",
      required: true,
      group: "Donee Details",
    },
    {
      name: "doneeAddress",
      label: "Donee Address",
      labelUrdu: "ہبہ لینے والے کا پتہ",
      type: "address",
      required: true,
      group: "Donee Details",
    },
    {
      name: "giftDescription",
      label: "Gift Description (Property / Money / Assets)",
      labelUrdu: "ہبہ کی تفصیل (جائیداد / رقم / اثاثے)",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Gift Details",
    },
    {
      name: "giftValue",
      label: "Estimated Value (PKR)",
      labelUrdu: "تخمینی قیمت (روپے)",
      type: "number",
      required: false,
      group: "Gift Details",
    },
    {
      name: "reasonForGift",
      label: "Reason for Gift",
      labelUrdu: "ہبہ کی وجہ",
      type: "textarea",
      required: false,
      aiSuggestable: true,
      group: "Gift Details",
    },
    {
      name: "conditions",
      label: "Conditions (if any)",
      labelUrdu: "شرائط (اگر کوئی ہوں)",
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
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a Gift Deed (Hiba Nama) in {{language}}.

DONOR:
- Name: {{donorName}}
- Father's Name: {{donorFatherName}}
- CNIC: {{donorCnic}}
- Address: {{donorAddress}}

DONEE:
- Name: {{doneeName}}
- Father's Name: {{doneeFatherName}}
- CNIC: {{doneeCnic}}
- Address: {{doneeAddress}}

GIFT:
- Description: {{giftDescription}}
- Value: PKR {{giftValue}}
- Reason: {{reasonForGift}}

CONDITIONS: {{conditions}}

WITNESSES:
- Witness 1: {{witness1Name}}
- Witness 2: {{witness2Name}}

REFERENCE FORMAT — Follow this exact Pakistani legal format:

GIFT DEED

This Gift Deed is written at [City] on this ___ day of ___________, 20___.

BETWEEN:

1. [Donor Name] S/o [Father Name], CNIC No. [CNIC], adult resident of [Address]
   (hereinafter called the "DONOR" of the First Part)

2. [Donee Name] S/o [Father Name], CNIC No. [CNIC], adult resident of [Address]
   (hereinafter called the "DONEE" of the Second Part)

WHEREAS the Donor has great love and affection for the Donee and has decided to gift the following:

[Description of gift — property / amount / assets]

AND WHEREAS the Donor has decided to gift the said [gift description] to the Donee, hence this deed.

NOW THEREFORE THESE PRESENTS WITNESSETH:

1. That the Donor [Name] S/o [Father Name] do hereby gift [description of gift] to the Donee [Donee Name] S/o [Father Name] out of natural love and affection.
2. That the Donor has given complete possession of the gifted [property/amount/assets] to the Donee today and the Donee shall be entitled to use the same in any manner best suited.
3. That the said gift has become absolute and irrevocable in favour of the Donee and the Donor shall have no right of any kind over the gifted [property/amount/assets].
4. That this deed shall be binding on all heirs, assignees, executors and legal representatives of the Donor.
5. That the Donee hereby accepts the gift and takes possession of [description of gift].

IN WITNESSES WHEREOF THE PARTIES HAVE SET THEIR RESPECTIVE HANDS ON THE DAY AND YEAR WRITTEN FIRST ABOVE.

1. _______________________          2. _______________________
   [Donor Name] (DONOR)                [Donee Name] (DONEE)
   CNIC: ___________                   CNIC: ___________

Witness 1: ___________________     Witness 2: ___________________
CNIC: ___________                  CNIC: ___________

INSTRUCTIONS:
- Title: GIFT DEED (centered, bold)
- BETWEEN 1. and 2. party structure (not BETWEEN/AND)
- WHEREAS clause for love and affection
- NOW THEREFORE THESE PRESENTS WITNESSETH
- Numbered "That..." clauses
- IN WITNESSES WHEREOF closing with both signatures
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
