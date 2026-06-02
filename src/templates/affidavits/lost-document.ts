import { TemplateDefinition } from "../types";

export const lostDocumentAffidavit: TemplateDefinition = {
  category: "affidavit",
  subType: "lost-document",
  name: "Lost Document Affidavit",
  nameUrdu: "گم شدہ دستاویز کا حلف نامہ",
  description: "Affidavit for lost CNIC, passport, degree, or other documents",
  descriptionUrdu: "شناختی کارڈ، پاسپورٹ، ڈگری یا دیگر گم شدہ دستاویزات کا حلف نامہ",
  icon: "FileQuestion",
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
      label: "Residential Address",
      labelUrdu: "رہائشی پتہ",
      type: "address",
      required: true,
      placeholder: "Enter complete address",
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
      name: "documentType",
      label: "Type of Lost Document",
      labelUrdu: "گم شدہ دستاویز کی قسم",
      type: "select",
      required: true,
      options: [
        { value: "cnic", label: "CNIC / National ID Card", labelUrdu: "شناختی کارڈ" },
        { value: "passport", label: "Passport", labelUrdu: "پاسپورٹ" },
        { value: "driving-license", label: "Driving License", labelUrdu: "ڈرائیونگ لائسنس" },
        { value: "degree", label: "Educational Degree/Certificate", labelUrdu: "تعلیمی ڈگری/سند" },
        { value: "birth-certificate", label: "Birth Certificate", labelUrdu: "پیدائشی سرٹیفکیٹ" },
        { value: "nikah-nama", label: "Nikah Nama", labelUrdu: "نکاح نامہ" },
        { value: "property-deed", label: "Property Deed", labelUrdu: "جائیداد کے کاغذات" },
        { value: "vehicle-documents", label: "Vehicle Registration/Documents", labelUrdu: "گاڑی کے کاغذات" },
        { value: "other", label: "Other", labelUrdu: "دیگر" },
      ],
      group: "Document Details",
    },
    {
      name: "documentNumber",
      label: "Document Number (if known)",
      labelUrdu: "دستاویز نمبر (اگر معلوم ہو)",
      type: "text",
      required: false,
      placeholder: "Enter document number if available",
      group: "Document Details",
    },
    {
      name: "dateLost",
      label: "Approximate Date of Loss",
      labelUrdu: "گم ہونے کی تخمینی تاریخ",
      type: "date",
      required: true,
      group: "Document Details",
    },
    {
      name: "placeLost",
      label: "Place/Circumstances of Loss",
      labelUrdu: "گم ہونے کی جگہ / حالات",
      type: "textarea",
      required: true,
      placeholder: "Describe where and how the document was lost",
      aiSuggestable: true,
      group: "Document Details",
    },
    {
      name: "firDetails",
      label: "FIR Details (if filed)",
      labelUrdu: "ایف آئی آر کی تفصیلات (اگر درج کرائی ہو)",
      type: "textarea",
      required: false,
      placeholder: "FIR number, police station, date (if applicable)",
      group: "Document Details",
    },
    {
      name: "undertaking",
      label: "Additional Undertaking",
      labelUrdu: "اضافی عہد",
      type: "textarea",
      required: false,
      placeholder: "Any additional undertaking or statement",
      aiSuggestable: true,
      group: "Document Details",
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
      group: "Document Details",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a formal Lost Document Affidavit in {{language}}.

PARTY DETAILS:
- Deponent Name: {{deponentName}}
- Father's/Husband's Name: {{fatherName}}
- CNIC: {{cnic}}
- Address: {{address}}
- City: {{city}}

DOCUMENT DETAILS:
- Document Type: {{documentType}}
- Document Number: {{documentNumber}}
- Date Lost: {{dateLost}}
- Place/Circumstances: {{placeLost}}
- FIR Details: {{firDetails}}
- Additional Undertaking: {{undertaking}}

REFERENCE FORMAT — Follow this exact Pakistani legal format:

AFFIDAVIT

I, [Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address], do hereby solemnly affirm and declare as under:-

1. That I am the lawful owner of [Document Type] bearing No. [Document Number].
2. That I have misplaced / lost the original [Document Type] and the same has not been used by me or on my behalf for any purpose including sale, gift, or mortgage to any financial institution or individual.
3. That I may kindly be issued a duplicate [Document Type].
4. That if the original [Document Type] is found subsequently it will not be misused by me and the same will be surrendered to the concerned authority.
5. That if anything is found contrary to the above mentioned statement I will be held personally responsible for the same.
6. That the contents of this affidavit are true and correct to the best of my knowledge and belief.

(Sign & Thumb Impression)
DEPONENT

VERIFICATION:
Verified on Oath at [City], this ___ day of ___________ that the contents of above affidavit are true to the best of my knowledge and belief and nothing has been concealed therefrom.

(Sign & Thumb Impression)
DEPONENT

ATTESTED
(Oath Commissioner / Notary Public)

INSTRUCTIONS:
- Title: AFFIDAVIT (centered, bold)
- Each clause starts with "That..."
- Include (Sign & Thumb Impression) with DEPONENT block
- Include VERIFICATION paragraph at end
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
