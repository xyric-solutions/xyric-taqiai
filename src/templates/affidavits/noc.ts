import { TemplateDefinition } from "../types";

export const nocAffidavit: TemplateDefinition = {
  category: "affidavit",
  subType: "noc",
  name: "No Objection Certificate (NOC)",
  nameUrdu: "عدم اعتراض سرٹیفکیٹ",
  description: "NOC for various purposes like property, vehicle, employment",
  descriptionUrdu: "جائیداد، گاڑی، ملازمت وغیرہ کے لیے عدم اعتراض سرٹیفکیٹ",
  icon: "ShieldCheck",
  formFields: [
    {
      name: "issuerName",
      label: "Issuer Name (Person giving NOC)",
      labelUrdu: "جاری کنندہ کا نام",
      type: "text",
      required: true,
      group: "Issuer Details",
    },
    {
      name: "issuerFatherName",
      label: "Issuer's Father's Name",
      labelUrdu: "جاری کنندہ کے والد کا نام",
      type: "text",
      required: true,
      group: "Issuer Details",
    },
    {
      name: "issuerCnic",
      label: "Issuer CNIC",
      labelUrdu: "جاری کنندہ کا شناختی کارڈ",
      type: "cnic",
      required: true,
      placeholder: "XXXXX-XXXXXXX-X",
      group: "Issuer Details",
    },
    {
      name: "issuerAddress",
      label: "Issuer Address",
      labelUrdu: "جاری کنندہ کا پتہ",
      type: "address",
      required: true,
      group: "Issuer Details",
    },
    {
      name: "recipientName",
      label: "Recipient Name (Person receiving NOC)",
      labelUrdu: "وصول کنندہ کا نام",
      type: "text",
      required: true,
      group: "Recipient Details",
    },
    {
      name: "recipientCnic",
      label: "Recipient CNIC",
      labelUrdu: "وصول کنندہ کا شناختی کارڈ",
      type: "cnic",
      required: false,
      placeholder: "XXXXX-XXXXXXX-X",
      group: "Recipient Details",
    },
    {
      name: "nocPurpose",
      label: "Purpose of NOC",
      labelUrdu: "عدم اعتراض کا مقصد",
      type: "select",
      required: true,
      options: [
        { value: "property", label: "Property Transfer", labelUrdu: "جائیداد کی منتقلی" },
        { value: "vehicle", label: "Vehicle Transfer", labelUrdu: "گاڑی کی منتقلی" },
        { value: "employment", label: "Employment/Job", labelUrdu: "ملازمت" },
        { value: "education", label: "Education", labelUrdu: "تعلیم" },
        { value: "travel", label: "Travel/Passport", labelUrdu: "سفر / پاسپورٹ" },
        { value: "other", label: "Other", labelUrdu: "دیگر" },
      ],
      group: "NOC Details",
    },
    {
      name: "nocDetails",
      label: "NOC Details / Description",
      labelUrdu: "عدم اعتراض کی تفصیل",
      type: "textarea",
      required: true,
      placeholder: "Describe what the NOC is for",
      aiSuggestable: true,
      group: "NOC Details",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a formal No Objection Certificate (NOC) in {{language}}.

ISSUER DETAILS:
- Name: {{issuerName}}
- Father's Name: {{issuerFatherName}}
- CNIC: {{issuerCnic}}
- Address: {{issuerAddress}}

RECIPIENT DETAILS:
- Name: {{recipientName}}
- CNIC: {{recipientCnic}}

NOC PURPOSE: {{nocPurpose}}
NOC DETAILS: {{nocDetails}}

REFERENCE FORMAT — Follow this exact Pakistani legal format:

NO OBJECTION CERTIFICATE

I, [Issuer Name] S/o [Father Name] CNIC No. [CNIC], resident of [Address], do hereby certify and declare that:

1. That I have NO OBJECTION to [Recipient Name] S/o [Father Name] CNIC No. [CNIC] for the purpose of [NOC Purpose].
2. That [supporting detail or condition].
3. That this NOC is issued on my own free will without any coercion or pressure.
4. That this NOC is valid for [duration/purpose] only.

ISSUER
[Name] S/o [Father Name]
CNIC: [CNIC]
Address: [Address]

Date: _______________     Place: _______________

Witness 1: ___________________     Witness 2: ___________________

ATTESTED
(Oath Commissioner / Notary Public)

INSTRUCTIONS:
- Title: NO OBJECTION CERTIFICATE (centered, bold, all caps)
- Each clause starts with "That..."
- Include purpose clearly
- Output as clean HTML. If language is Urdu, write in Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
