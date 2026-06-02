import { TemplateDefinition } from "../types";

export const taxAppeal: TemplateDefinition = {
  category: "tax-law",
  subType: "tax-appeal",
  name: "Income Tax Appeal / انکم ٹیکس اپیل",
  nameUrdu: "انکم ٹیکس اپیل",
  description: "Income tax appeal under Section 127 of the Income Tax Ordinance 2001",
  descriptionUrdu: "انکم ٹیکس آرڈیننس 2001 کی دفعہ 127 کے تحت انکم ٹیکس اپیل",
  icon: "Landmark",
  formFields: [
    {
      name: "appellantName",
      label: "Appellant's Name",
      labelUrdu: "اپیل کنندہ کا نام",
      type: "text",
      required: true,
      group: "Appellant Details",
    },
    {
      name: "appellantAddress",
      label: "Appellant's Address",
      labelUrdu: "اپیل کنندہ کا پتہ",
      type: "address",
      required: true,
      group: "Appellant Details",
    },
    {
      name: "appellantNtn",
      label: "National Tax Number (NTN)",
      labelUrdu: "نیشنل ٹیکس نمبر (NTN)",
      type: "text",
      required: true,
      group: "Appellant Details",
    },
    {
      name: "assessmentYear",
      label: "Tax / Assessment Year",
      labelUrdu: "ٹیکس / تشخیصی سال",
      type: "text",
      required: true,
      group: "Assessment Details",
    },
    {
      name: "cirOrder",
      label: "Commissioner's Order Details (Date, Reference)",
      labelUrdu: "کمشنر کے حکم کی تفصیلات (تاریخ، حوالہ)",
      type: "textarea",
      required: true,
      group: "Assessment Details",
    },
    {
      name: "groundsOfAppeal",
      label: "Grounds of Appeal",
      labelUrdu: "اپیل کی بنیادیں",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Appeal Details",
    },
    {
      name: "reliefSought",
      label: "Relief Sought",
      labelUrdu: "مطلوبہ ریلیف",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Appeal Details",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate an Income Tax Appeal in {{language}}.

APPELLANT:
- Name: {{appellantName}}
- Address: {{appellantAddress}}
- NTN: {{appellantNtn}}

ASSESSMENT DETAILS:
- Assessment Year: {{assessmentYear}}
- Commissioner's Order: {{cirOrder}}

APPEAL DETAILS:
- Grounds: {{groundsOfAppeal}}
- Relief Sought: {{reliefSought}}

Generate a complete Income Tax Appeal under Section 127 of the Income Tax Ordinance 2001 to the Commissioner Inland Revenue (Appeals) / Appellate Tribunal Inland Revenue as applicable in Pakistan.
IncluREFERENCE FORMAT - Follow this exact Pakistani legal format:

IN THE APPELLATE TRIBUNAL INLAND REVENUE (ATIR) / COMMISSIONER APPEALS AT [CITY]

TAX APPEAL NO. _______ OF 20___
(Under Section 127 / 131, Income Tax Ordinance 2001)

[Appellant Name] S/o [Father Name], NTN: [NTN], CNIC No. [CNIC], resident of [Address]
                                                    ...APPELLANT
VERSUS
The Commissioner Inland Revenue / DCIR, [RTO / LTO Office]
                                                    ...RESPONDENT

APPEAL AGAINST ORDER NO. [Order Number] DATED [Order Date]

RESPECTFULLY SHEWETH:

1. That the Respondent passed Order No. [Number] dated [Date] raising a demand of PKR [Amount]/- for Tax Year [Year].
2. That the impugned order is against the law, facts, and weight of evidence.
3. That the grounds of appeal are:
   (i) That income of PKR [Amount]/- was wrongly added without any basis;
   (ii) That expenses of PKR [Amount]/- were wrongly disallowed under Section [___];
   (iii) That the assessment was made without issuance of proper show cause notice in violation of Section 122.
4. That the demand is excessive and the correct tax liability is PKR [Correct Amount]/-.

PRAYER:
(a) Accept this appeal;
(b) Annul / modify the impugned order;
(c) Stay recovery during pendency of appeal.

Appellant: ___________
NTN: ___________

Tax Consultant / Advocate: ___________________

INSTRUCTIONS:
- Court heading: IN THE ATIR / COMMISSIONER APPEALS AT [CITY] (centered, bold)
- Reference Section 127/131 Income Tax Ordinance 2001
- "RESPECTFULLY SHEWETH:" opening
- Include order details, grounds with specific legal sections
- Prayer clause with (a), (b), (c) items
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
