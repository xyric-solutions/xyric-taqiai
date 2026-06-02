import { TemplateDefinition } from "../types";

export const windingUpPetition: TemplateDefinition = {
  category: "corporate-law",
  subType: "winding-up-petition",
  name: "Company Winding Up Petition / کمپنی ختم کرنے کی درخواست",
  nameUrdu: "کمپنی ختم کرنے کی درخواست",
  description: "Petition for winding up of a company under Section 301 of the Companies Act 2017",
  descriptionUrdu: "کمپنیز ایکٹ 2017 کی دفعہ 301 کے تحت کمپنی ختم کرنے کی درخواست",
  icon: "XCircle",
  formFields: [
    {
      name: "petitionerName",
      label: "Petitioner's Name",
      labelUrdu: "درخواست گزار کا نام",
      type: "text",
      required: true,
      group: "Petitioner Details",
    },
    {
      name: "petitionerAddress",
      label: "Petitioner's Address",
      labelUrdu: "درخواست گزار کا پتہ",
      type: "address",
      required: true,
      group: "Petitioner Details",
    },
    {
      name: "petitionerCnic",
      label: "Petitioner's CNIC",
      labelUrdu: "درخواست گزار کا شناختی کارڈ",
      type: "cnic",
      required: true,
      group: "Petitioner Details",
    },
    {
      name: "companyName",
      label: "Company Name",
      labelUrdu: "کمپنی کا نام",
      type: "text",
      required: true,
      group: "Company Details",
    },
    {
      name: "companyRegistrationNo",
      label: "Company Registration Number",
      labelUrdu: "کمپنی رجسٹریشن نمبر",
      type: "text",
      required: true,
      group: "Company Details",
    },
    {
      name: "companyAddress",
      label: "Company Registered Office",
      labelUrdu: "کمپنی کا رجسٹرڈ دفتر",
      type: "address",
      required: true,
      group: "Company Details",
    },
    {
      name: "grounds",
      label: "Grounds for Winding Up",
      labelUrdu: "کمپنی ختم کرنے کی بنیادیں",
      type: "select",
      required: true,
      options: [
        { value: "inability-to-pay", label: "Inability to Pay Debts", labelUrdu: "قرض ادا کرنے سے قاصر" },
        { value: "just-equitable", label: "Just and Equitable", labelUrdu: "منصفانہ اور مناسب" },
        { value: "special-resolution", label: "Special Resolution by Company", labelUrdu: "کمپنی کی خصوصی قرارداد" },
        { value: "oppression", label: "Oppression / Mismanagement", labelUrdu: "جبر / بدانتظامی" },
        { value: "other", label: "Other Grounds", labelUrdu: "دیگر بنیادیں" },
      ],
      group: "Winding Up Details",
    },
    {
      name: "facts",
      label: "Facts Supporting the Petition",
      labelUrdu: "درخواست کی حمایت میں حقائق",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Winding Up Details",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a Company Winding Up Petition in {{language}}.

PETITIONER:
- Name: {{petitionerName}}
- Address: {{petitionerAddress}}
- CNIC: {{petitionerCnic}}

COMPANY:
- Name: {{companyName}}
- Registration No: {{companyRegistrationNo}}
- Registered Office: {{companyAddress}}

WINDING UP DETAILS:
- Grounds: {{grounds}}
- Facts: {{facts}}

Generate a complete Winding Up Petition under Section 301 of the Companies Act 2017 as applicable in Pakistan.
Include proper High Court heading, petitioner's locus standi, groundsREFERENCE FORMAT - Follow this exact Pakistani legal format:

IN THE HIGH COURT OF [PROVINCE] AT [CITY]
COMPANY JURISDICTION

COMPANY PETITION NO. _______ OF 20___
(Under Section 301, Companies Act 2017)

IN THE MATTER OF:
[Company Name] (Private) Limited
Registration No.: [SECP No.], having registered office at [Address]
                                                    ...RESPONDENT COMPANY

AND

[Petitioner Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
(Creditor / Contributory / Director)
                                                    ...PETITIONER

PETITION FOR WINDING UP OF COMPANY

RESPECTFULLY SHEWETH:

1. That [Company Name] (Private) Limited was incorporated under the Companies Act on [Date] bearing Registration No. [Number].
2. That the Petitioner is a creditor / contributory holding [Amount / Shares] in the Company.
3. That the Company has ceased to carry on business / is unable to pay its debts exceeding PKR [Amount]/-.
4. That the Company is just and equitable to be wound up as [Reason].
5. That the grounds for winding up under Section 301 of the Companies Act 2017 are: [Specific grounds].

It is therefore most respectfully prayed that this Honourable Court may be pleased to:
(a) Order the winding up of [Company Name] (Private) Limited;
(b) Appoint an Official Liquidator;
(c) Direct the Company to file its Statement of Affairs;
(d) Award costs of this petition.

VERIFICATION:
Verified on oath at [City] that the contents are true and correct to the best of my knowledge.

Petitioner:
[Name] S/o [Father Name]
CNIC: ___________

Advocate: ___________________

INSTRUCTIONS:
- Court heading: IN THE HIGH COURT OF [PROVINCE] AT [CITY] - COMPANY JURISDICTION (centered, bold)
- Company Petition heading
- Reference Companies Act 2017 Section 301
- "RESPECTFULLY SHEWETH:" opening
- Numbered "That..." paragraphs
- Prayer clause with (a), (b), (c), (d) items
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
