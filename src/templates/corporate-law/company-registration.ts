import { TemplateDefinition } from "../types";

export const companyRegistration: TemplateDefinition = {
  category: "corporate-law",
  subType: "company-registration",
  name: "Company Incorporation / کمپنی کی رجسٹریشن",
  nameUrdu: "کمپنی کی رجسٹریشن",
  description: "Company incorporation documents under the Companies Act 2017",
  descriptionUrdu: "کمپنیز ایکٹ 2017 کے تحت کمپنی کی رجسٹریشن کی دستاویزات",
  icon: "Building2",
  formFields: [
    {
      name: "companyName",
      label: "Proposed Company Name",
      labelUrdu: "مجوزہ کمپنی کا نام",
      type: "text",
      required: true,
      group: "Company Details",
    },
    {
      name: "companyType",
      label: "Type of Company",
      labelUrdu: "کمپنی کی قسم",
      type: "select",
      required: true,
      options: [
        { value: "private-limited", label: "Private Limited Company", labelUrdu: "پرائیویٹ لمیٹڈ کمپنی" },
        { value: "public-limited", label: "Public Limited Company", labelUrdu: "پبلک لمیٹڈ کمپنی" },
        { value: "single-member", label: "Single Member Company", labelUrdu: "سنگل ممبر کمپنی" },
        { value: "not-for-profit", label: "Not-for-Profit (Section 42)", labelUrdu: "غیر منافع بخش (دفعہ 42)" },
      ],
      group: "Company Details",
    },
    {
      name: "registeredOffice",
      label: "Registered Office Address",
      labelUrdu: "رجسٹرڈ دفتر کا پتہ",
      type: "address",
      required: true,
      group: "Company Details",
    },
    {
      name: "businessNature",
      label: "Nature of Business",
      labelUrdu: "کاروبار کی نوعیت",
      type: "textarea",
      required: true,
      group: "Company Details",
    },
    {
      name: "authorizedCapital",
      label: "Authorized Share Capital (PKR)",
      labelUrdu: "مجاز سرمایہ (روپے)",
      type: "number",
      required: true,
      group: "Capital Details",
    },
    {
      name: "directorsDetails",
      label: "Directors Details (Names, CNICs, Addresses)",
      labelUrdu: "ڈائریکٹرز کی تفصیلات (نام، شناختی کارڈ، پتے)",
      type: "textarea",
      required: true,
      group: "Directors & Shareholders",
    },
    {
      name: "shareholdersDetails",
      label: "Shareholders Details (Names, Shares)",
      labelUrdu: "شیئر ہولڈرز کی تفصیلات (نام، حصص)",
      type: "textarea",
      required: true,
      group: "Directors & Shareholders",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate Company Incorporation Documents in {{language}}.

COMPANY DETAILS:
- Proposed Name: {{companyName}}
- Type: {{companyType}}
- Registered Office: {{registeredOffice}}
- Nature of Business: {{businessNature}}
- Authorized Capital: PKR {{authorizedCapital}}

DIRECTORS:
{{directorsDetails}}

SHAREHOLDERS:
{{shareholdersDetails}}

Generate complete Company Incorporation Documents under the Companies Act 2017 as applicable in Pakistan.
Include Memorandum of Association, Articles of Association, Form 1 (Declaration of Compliance), Form 21 (Notice of Situation of Registered OffiREFERENCE FORMAT - Follow this exact Pakistani legal format:

MEMORANDUM OF ASSOCIATION
AND
ARTICLES OF ASSOCIATION
OF
[COMPANY NAME] (PRIVATE) LIMITED

MEMORANDUM OF ASSOCIATION

1. NAME: The name of the Company is [Company Name] (Private) Limited.

2. REGISTERED OFFICE: The registered office of the Company will be situated in the Province of [Province], Pakistan. Address: [Address].

3. OBJECTS: The objects for which the Company is established are:
   (a) To carry on the business of [Main Business Activity].
   (b) To do all such things as are incidental or conducive to the attainment of the main objects.

4. LIABILITY: The liability of the members is limited.

5. AUTHORIZED CAPITAL: The authorized share capital of the Company is PKR [Amount]/- divided into [Number] ordinary shares of PKR [Face Value]/- each.

We, the persons whose names and addresses are subscribed, are desirous of being formed into a Company in pursuance of this Memorandum of Association:

Name: [Subscriber 1 Name], CNIC: [CNIC], Shares: [Number]
Name: [Subscriber 2 Name], CNIC: [CNIC], Shares: [Number]

Dated this ___ day of ___________

ARTICLES OF ASSOCIATION
(Key Provisions)

1. INTERPRETATION: [Standard definitions]
2. SHARES: [Share transfer restrictions for private company]
3. DIRECTORS: Minimum [2] directors; [Names of first directors]
4. MEETINGS: Annual General Meeting within [Period] of each financial year.

INSTRUCTIONS:
- Title: MEMORANDUM OF ASSOCIATION (centered, bold) then ARTICLES OF ASSOCIATION
- Standard Memorandum format with Name, Registered Office, Objects, Liability, Capital
- Subscribers table with CNIC and shares
- Reference Companies Act 2017 and SECP requirements
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
