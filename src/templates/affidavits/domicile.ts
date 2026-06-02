import { TemplateDefinition } from "../types";

export const domicileAffidavit: TemplateDefinition = {
  category: "affidavit",
  subType: "domicile",
  name: "Domicile Affidavit",
  nameUrdu: "ڈومیسائل حلف نامہ",
  description: "Affidavit for domicile certificate application",
  descriptionUrdu: "ڈومیسائل سرٹیفکیٹ کی درخواست کے لیے حلف نامہ",
  icon: "MapPin",
  formFields: [
    {
      name: "deponentName",
      label: "Deponent Name",
      labelUrdu: "حلف اٹھانے والے کا نام",
      type: "text",
      required: true,
      placeholder: "Enter full name",
      placeholderUrdu: "پورا نام درج کریں",
      group: "Deponent Details",
    },
    {
      name: "fatherName",
      label: "Father's / Husband's Name",
      labelUrdu: "والد / شوہر کا نام",
      type: "text",
      required: true,
      placeholder: "Enter father's or husband's name",
      group: "Deponent Details",
    },
    {
      name: "cnic",
      label: "CNIC Number",
      labelUrdu: "شناختی کارڈ نمبر",
      type: "cnic",
      required: true,
      placeholder: "XXXXX-XXXXXXX-X",
      validation: { pattern: "^[0-9]{5}-[0-9]{7}-[0-9]$" },
      group: "Deponent Details",
    },
    {
      name: "address",
      label: "Permanent Address",
      labelUrdu: "مستقل پتہ",
      type: "address",
      required: true,
      placeholder: "Enter complete permanent address",
      group: "Deponent Details",
    },
    {
      name: "city",
      label: "City",
      labelUrdu: "شہر",
      type: "text",
      required: true,
      placeholder: "Enter city name",
      group: "Deponent Details",
    },
    {
      name: "district",
      label: "District",
      labelUrdu: "ضلع",
      type: "text",
      required: true,
      placeholder: "Enter district name",
      group: "Domicile Details",
    },
    {
      name: "province",
      label: "Province",
      labelUrdu: "صوبہ",
      type: "select",
      required: true,
      options: [
        { value: "punjab", label: "Punjab", labelUrdu: "پنجاب" },
        { value: "sindh", label: "Sindh", labelUrdu: "سندھ" },
        { value: "kpk", label: "Khyber Pakhtunkhwa", labelUrdu: "خیبر پختونخوا" },
        { value: "balochistan", label: "Balochistan", labelUrdu: "بلوچستان" },
        { value: "islamabad", label: "Islamabad Capital Territory", labelUrdu: "اسلام آباد وفاقی دارالحکومت" },
        { value: "ajk", label: "Azad Jammu & Kashmir", labelUrdu: "آزاد جموں و کشمیر" },
        { value: "gb", label: "Gilgit-Baltistan", labelUrdu: "گلگت بلتستان" },
      ],
      group: "Domicile Details",
    },
    {
      name: "residenceDuration",
      label: "Duration of Residence",
      labelUrdu: "رہائش کی مدت",
      type: "text",
      required: true,
      placeholder: "e.g., Since birth / 15 years",
      group: "Domicile Details",
    },
    {
      name: "purpose",
      label: "Purpose of Domicile",
      labelUrdu: "ڈومیسائل کا مقصد",
      type: "textarea",
      required: true,
      placeholder: "e.g., Government job application, admission, etc.",
      aiSuggestable: true,
      group: "Domicile Details",
    },
    {
      name: "language",
      label: "Language",
      labelUrdu: "زبان",
      type: "select",
      required: true,
      options: [
        { value: "english", label: "English", labelUrdu: "انگریزی" },
        { value: "urdu", label: "Urdu", labelUrdu: "اردو" },
      ],
      group: "Domicile Details",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a formal Domicile Affidavit in {{language}}.

PARTY DETAILS:
- Deponent Name: {{deponentName}}
- Father's/Husband's Name: {{fatherName}}
- CNIC: {{cnic}}
- Address: {{address}}
- City: {{city}}

DOMICILE DETAILS:
- District: {{district}}
- Province: {{province}}
- Duration of Residence: {{residenceDuration}}
- Purpose: {{purpose}}

REFERENCE FORMAT — Follow this exact Pakistani legal format:

AFFIDAVIT FOR DOMICILE CERTIFICATE

I, [Name] S/o [Father Name], CNIC No. [CNIC], aged [Age] years, resident of [Address], [City], do hereby solemnly affirm and declare as under:

1. That I am a bonafide permanent resident of District [District], Province [Province], Pakistan.
2. That I have been residing continuously in [District] District since [Duration / birth].
3. That I was born at [City / District] and have never changed my permanent domicile.
4. That I am a citizen of Pakistan and have never migrated to any other country.
5. That I require this domicile certificate for the purpose of [Purpose].
6. That all the above contents are true and correct to the best of my knowledge and nothing has been concealed.

DEPONENT
[Name] S/o [Father Name]
CNIC: [CNIC]

VERIFICATION:
Verified on Oath at [City], this ___ day of ___________ that the contents of above affidavit are true to the best of my knowledge and belief and nothing has been concealed therefrom.

DEPONENT

ATTESTED
(Oath Commissioner / Notary Public / Class-1 Officer)

INSTRUCTIONS:
- Title: AFFIDAVIT FOR DOMICILE CERTIFICATE (centered, bold)
- Each clause starts with "That..."
- Include S/o / D/o / W/o notation
- Include VERIFICATION paragraph
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
