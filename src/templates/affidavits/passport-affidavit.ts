import { TemplateDefinition } from "../types";

export const passportAffidavit: TemplateDefinition = {
  category: "affidavit",
  subType: "passport-affidavit",
  name: "Passport Affidavit",
  nameUrdu: "پاسپورٹ حلف نامہ",
  description: "Affidavit for passport related issues (lost, name change, renewal)",
  descriptionUrdu: "پاسپورٹ سے متعلق مسائل (گم شدہ، نام تبدیلی، تجدید) کا حلف نامہ",
  icon: "BookOpen",
  formFields: [
    {
      name: "deponentName",
      label: "Deponent Name",
      labelUrdu: "حلف اٹھانے والے کا نام",
      type: "text",
      required: true,
      placeholder: "Enter full name as per CNIC",
      placeholderUrdu: "شناختی کارڈ کے مطابق پورا نام درج کریں",
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
      name: "passportNumber",
      label: "Passport Number",
      labelUrdu: "پاسپورٹ نمبر",
      type: "text",
      required: false,
      placeholder: "Enter passport number (if available)",
      group: "Passport Details",
    },
    {
      name: "issueDate",
      label: "Passport Issue Date",
      labelUrdu: "پاسپورٹ اجراء کی تاریخ",
      type: "date",
      required: false,
      group: "Passport Details",
    },
    {
      name: "expiryDate",
      label: "Passport Expiry Date",
      labelUrdu: "پاسپورٹ کی میعاد ختم ہونے کی تاریخ",
      type: "date",
      required: false,
      group: "Passport Details",
    },
    {
      name: "purpose",
      label: "Purpose of Affidavit",
      labelUrdu: "حلف نامے کا مقصد",
      type: "select",
      required: true,
      options: [
        { value: "lost", label: "Lost Passport", labelUrdu: "گم شدہ پاسپورٹ" },
        { value: "damaged", label: "Damaged Passport", labelUrdu: "خراب پاسپورٹ" },
        { value: "name-change", label: "Name Change in Passport", labelUrdu: "پاسپورٹ میں نام کی تبدیلی" },
        { value: "renewal", label: "Passport Renewal", labelUrdu: "پاسپورٹ کی تجدید" },
        { value: "new-passport", label: "New Passport Application", labelUrdu: "نئے پاسپورٹ کی درخواست" },
        { value: "other", label: "Other", labelUrdu: "دیگر" },
      ],
      group: "Purpose",
    },
    {
      name: "details",
      label: "Details / Circumstances",
      labelUrdu: "تفصیلات / حالات",
      type: "textarea",
      required: true,
      placeholder: "Describe the circumstances (how passport was lost, reason for name change, etc.)",
      aiSuggestable: true,
      group: "Purpose",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a formal Passport Affidavit (پاسپورٹ حلف نامہ) in {{language}}.

DEPONENT DETAILS:
- Name: {{deponentName}}
- Father's/Husband's Name: {{fatherName}}
- CNIC: {{cnic}}
- Address: {{address}}

PASSPORT DETAILS:
- Passport Number: {{passportNumber}}
- Issue Date: {{issueDate}}
- Expiry Date: {{expiryDate}}

PURPOSE: {{purpose}}
DETAILS: {{details}}

REFERENCE FORMAT — Follow this exact Pakistani legal format:

AFFIDAVIT FOR PASSPORT APPLICATION

I, [Deponent Name] S/o [Father Name], CNIC No. [CNIC], Date of Birth: [DOB], resident of [Address], [City], do hereby solemnly affirm and declare as under:

1. That I am a Pakistani citizen by birth / naturalization and have never held dual nationality or citizenship of any other country.
2. That all the particulars mentioned in my passport application are true and correct.
3. That [specific purpose — first passport / renewal / lost passport / name correction in passport].
4. That [additional facts relevant to the application].
5. That I have never been involved in any criminal activity and no case is pending against me.
6. That the contents of this affidavit are true and correct to the best of my knowledge and belief.

DEPONENT
[Name] S/o [Father Name]
CNIC: ___________

VERIFICATION:
Verified on oath at [City] on this ___ day of ___________ that the contents of the above affidavit are true and correct to the best of my knowledge and belief and nothing has been concealed therein.

DEPONENT

ATTESTED
(Oath Commissioner / Notary Public / Class-1 Officer)

INSTRUCTIONS:
- Title: AFFIDAVIT FOR PASSPORT APPLICATION (centered, bold)
- Key clause: Pakistani citizen, all particulars true
- Include VERIFICATION paragraph
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
