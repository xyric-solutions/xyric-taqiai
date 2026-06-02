import { TemplateDefinition } from "../types";

export const businessRegistrationAffidavit: TemplateDefinition = {
  category: "affidavit",
  subType: "business-registration",
  name: "Business/Firm Registration Affidavit",
  nameUrdu: "کاروبار رجسٹریشن حلف نامہ",
  description: "Affidavit for business or firm registration purposes",
  descriptionUrdu: "کاروبار یا فرم کی رجسٹریشن کے لیے حلف نامہ",
  icon: "Building",
  formFields: [
    {
      name: "deponentName",
      label: "Proprietor / Partner Name",
      labelUrdu: "مالک / پارٹنر کا نام",
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
      placeholder: "Enter complete residential address",
      group: "Deponent Details",
    },
    {
      name: "businessName",
      label: "Business / Firm Name",
      labelUrdu: "کاروبار / فرم کا نام",
      type: "text",
      required: true,
      placeholder: "Enter business or firm name",
      placeholderUrdu: "کاروبار یا فرم کا نام درج کریں",
      group: "Business Details",
    },
    {
      name: "businessType",
      label: "Type of Business",
      labelUrdu: "کاروبار کی قسم",
      type: "select",
      required: true,
      options: [
        { value: "sole-proprietorship", label: "Sole Proprietorship", labelUrdu: "واحد ملکیت" },
        { value: "partnership", label: "Partnership Firm", labelUrdu: "شراکتی فرم" },
        { value: "company", label: "Private Limited Company", labelUrdu: "پرائیویٹ لمیٹڈ کمپنی" },
        { value: "ngo", label: "NGO / Non-Profit", labelUrdu: "این جی او / غیر منافع بخش" },
        { value: "other", label: "Other", labelUrdu: "دیگر" },
      ],
      group: "Business Details",
    },
    {
      name: "businessAddress",
      label: "Business Address",
      labelUrdu: "کاروباری پتہ",
      type: "address",
      required: true,
      placeholder: "Enter business address",
      group: "Business Details",
    },
    {
      name: "partnersDetails",
      label: "Partners Details (if Partnership)",
      labelUrdu: "شراکت داروں کی تفصیلات (اگر شراکت ہو)",
      type: "textarea",
      required: false,
      placeholder: "Enter names, CNICs, and shares of all partners",
      aiSuggestable: true,
      group: "Business Details",
    },
    {
      name: "ntnNumber",
      label: "NTN Number",
      labelUrdu: "این ٹی این نمبر",
      type: "text",
      required: false,
      placeholder: "Enter NTN number (if available)",
      group: "Registration Details",
    },
    {
      name: "purpose",
      label: "Purpose of Affidavit",
      labelUrdu: "حلف نامے کا مقصد",
      type: "select",
      required: true,
      options: [
        { value: "bank-account", label: "Bank Account Opening", labelUrdu: "بینک اکاؤنٹ کھولنا" },
        { value: "registration", label: "Business Registration", labelUrdu: "کاروباری رجسٹریشن" },
        { value: "license", label: "License Application", labelUrdu: "لائسنس کی درخواست" },
        { value: "tax", label: "Tax Registration", labelUrdu: "ٹیکس رجسٹریشن" },
        { value: "other", label: "Other", labelUrdu: "دیگر" },
      ],
      group: "Registration Details",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a formal Business/Firm Registration Affidavit (کاروبار رجسٹریشن حلف نامہ) in {{language}}.

DEPONENT DETAILS:
- Name: {{deponentName}}
- Father's/Husband's Name: {{fatherName}}
- CNIC: {{cnic}}
- Address: {{address}}

BUSINESS DETAILS:
- Business Name: {{businessName}}
- Business Type: {{businessType}}
- Business Address: {{businessAddress}}
- Partners Details: {{partnersDetails}}

REGISTRATION DETAILS:
- NTN Number: {{ntnNumber}}
- Purpose: {{purpose}}

Generate a complete, legally valid Business/Firm Registration Affidavit following Pakistani law format under the Partnership Act 1932 and relevant business laws. Include:
1. Title and heading
2. Deponent identification as proprietor/partner
3. Business name and nature of business
4. Business address and commencement date
5. Partners and their shares (if partnership)
6. NTN and registration details
7. Declaration thREFERENCE FORMAT - Follow this exact Pakistani legal format:

AFFIDAVIT FOR BUSINESS REGISTRATION

I, [Proprietor Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address], do hereby solemnly affirm and declare as under:

1. That I am the sole proprietor / partner of [Business Name] having its place of business at [Business Address].
2. That the said business is engaged in [Nature of Business] and has been in operation since [Year].
3. That the business bears NTN / STRN No. [NTN Number] (if applicable).
4. That no criminal case, FIR, or legal proceeding is pending against the said business or its proprietor.
5. That the said business is legally operated and is not involved in any unlawful activity.
6. That I am making this affidavit for the purpose of [Purpose - business registration / bank account / license].
7. That the contents of this affidavit are true and correct to the best of my knowledge and belief and nothing has been concealed.

DEPONENT
[Proprietor Name] S/o [Father Name]
CNIC: ___________
Business Name: ___________

VERIFICATION:
Verified on oath at [City] on this ___ day of ___________ that the contents of the above affidavit are true and correct to the best of my knowledge and belief and nothing has been concealed therein.

DEPONENT

ATTESTED
(Oath Commissioner / Notary Public / Class-1 Officer)

INSTRUCTIONS:
- Title: AFFIDAVIT FOR BUSINESS REGISTRATION (centered, bold)
- "That..." numbered clauses
- Include business name, address, NTN
- Include VERIFICATION paragraph
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
