import { TemplateDefinition } from "../types";

export const incomeCertificateAffidavit: TemplateDefinition = {
  category: "affidavit",
  subType: "income-certificate",
  name: "Income Certificate Affidavit",
  nameUrdu: "آمدنی سرٹیفکیٹ حلف نامہ",
  description: "Affidavit declaring income details for official purposes",
  descriptionUrdu: "سرکاری مقاصد کے لیے آمدنی کی تفصیلات کا حلف نامہ",
  icon: "Banknote",
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
      name: "occupation",
      label: "Occupation",
      labelUrdu: "پیشہ",
      type: "text",
      required: true,
      placeholder: "e.g., Government servant, Businessman, Farmer",
      group: "Income Details",
    },
    {
      name: "employerBusiness",
      label: "Employer / Business Name",
      labelUrdu: "آجر / کاروبار کا نام",
      type: "text",
      required: false,
      placeholder: "Enter employer or business name",
      group: "Income Details",
    },
    {
      name: "monthlyIncome",
      label: "Monthly Income (PKR)",
      labelUrdu: "ماہانہ آمدنی (روپے)",
      type: "number",
      required: true,
      placeholder: "Enter monthly income in PKR",
      group: "Income Details",
    },
    {
      name: "annualIncome",
      label: "Annual Income (PKR)",
      labelUrdu: "سالانہ آمدنی (روپے)",
      type: "number",
      required: true,
      placeholder: "Enter annual income in PKR",
      group: "Income Details",
    },
    {
      name: "incomeSources",
      label: "Sources of Income",
      labelUrdu: "آمدنی کے ذرائع",
      type: "textarea",
      required: true,
      placeholder: "List all sources of income (salary, business, rental, agricultural, etc.)",
      aiSuggestable: true,
      group: "Income Details",
    },
    {
      name: "purpose",
      label: "Purpose",
      labelUrdu: "مقصد",
      type: "select",
      required: true,
      options: [
        { value: "scholarship", label: "Scholarship Application", labelUrdu: "وظیفے کی درخواست" },
        { value: "loan", label: "Bank Loan", labelUrdu: "بینک قرض" },
        { value: "visa", label: "Visa Application", labelUrdu: "ویزا درخواست" },
        { value: "tax", label: "Tax Purpose", labelUrdu: "ٹیکس مقصد" },
        { value: "fee-concession", label: "Fee Concession", labelUrdu: "فیس میں رعایت" },
        { value: "social-welfare", label: "Social Welfare / BISP", labelUrdu: "سماجی بہبود / بی آئی ایس پی" },
        { value: "other", label: "Other", labelUrdu: "دیگر" },
      ],
      group: "Income Details",
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
      group: "Income Details",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a formal Income Certificate Affidavit in {{language}}.

PARTY DETAILS:
- Deponent Name: {{deponentName}}
- Father's/Husband's Name: {{fatherName}}
- CNIC: {{cnic}}
- Address: {{address}}
- City: {{city}}

INCOME DETAILS:
- Occupation: {{occupation}}
- Employer/Business: {{employerBusiness}}
- Monthly Income: PKR {{monthlyIncome}}
- Annual Income: PKR {{annualIncome}}
- Income Sources: {{incomeSources}}
- Purpose: {{purpose}}

REFERENCE FORMAT — Follow this exact Pakistani legal format:

AFFIDAVIT / INCOME DECLARATION

I, [Deponent Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address], [City], do hereby solemnly declare as under:

1. That I am the deponent of this affidavit and fully aware of the facts stated herein.
2. That I am a [Occupation] at/with [Employer/Business Name].
3. That my total family monthly income from all sources is approximately PKR [Monthly Income]/- and yearly income for the year [Year] is approximately PKR [Annual Income]/-.
4. That my sources of income are as follows: [Income Sources — salary / business / rental / agricultural / other].
5. That I am making this affidavit for the purpose of [Purpose — scholarship / bank loan / visa / fee concession / social welfare].
6. That the above stated income is my total income from all sources and nothing has been concealed.
7. That the contents of this affidavit are true and correct to the best of my knowledge and belief.

DEPONENT
[Name] S/o [Father Name]
CNIC: ___________
Occupation: ___________

VERIFICATION:
Verified on oath at [City] on this ___ day of ___________ that the contents of the above affidavit are true and correct to the best of my knowledge and nothing has been concealed therein.

DEPONENT

ATTESTED
(Oath Commissioner / Notary Public / Class-1 Officer)

INSTRUCTIONS:
- Title: AFFIDAVIT / INCOME DECLARATION (centered, bold)
- "That..." numbered clauses
- State monthly and annual income clearly
- State all income sources
- State purpose
- Include VERIFICATION paragraph
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
