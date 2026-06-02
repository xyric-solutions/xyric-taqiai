import { TemplateDefinition } from "../types";

export const citizenshipApplication: TemplateDefinition = {
  category: "immigration-law",
  subType: "citizenship-application",
  name: "Pakistan Citizenship Application / پاکستانی شہریت کی درخواست",
  nameUrdu: "پاکستانی شہریت کی درخواست",
  description: "Application for Pakistan citizenship under the Pakistan Citizenship Act 1951",
  descriptionUrdu: "پاکستان سٹیزن شپ ایکٹ 1951 کے تحت پاکستانی شہریت کی درخواست",
  icon: "Flag",
  formFields: [
    {
      name: "applicantName",
      label: "Applicant's Full Name",
      labelUrdu: "درخواست گزار کا مکمل نام",
      type: "text",
      required: true,
      group: "Applicant Details",
    },
    {
      name: "applicantAddress",
      label: "Current Address in Pakistan",
      labelUrdu: "پاکستان میں موجودہ پتہ",
      type: "address",
      required: true,
      group: "Applicant Details",
    },
    {
      name: "currentNationality",
      label: "Current Nationality",
      labelUrdu: "موجودہ شہریت",
      type: "text",
      required: true,
      group: "Applicant Details",
    },
    {
      name: "basisForCitizenship",
      label: "Basis for Citizenship",
      labelUrdu: "شہریت کی بنیاد",
      type: "select",
      required: true,
      options: [
        { value: "birth", label: "By Birth (Section 4)", labelUrdu: "پیدائش کی بنیاد پر (دفعہ 4)" },
        { value: "descent", label: "By Descent (Section 5)", labelUrdu: "نسب کی بنیاد پر (دفعہ 5)" },
        { value: "migration", label: "By Migration (Section 6)", labelUrdu: "ہجرت کی بنیاد پر (دفعہ 6)" },
        { value: "naturalization", label: "By Naturalization (Section 9)", labelUrdu: "قدرتی حصول (دفعہ 9)" },
        { value: "marriage", label: "By Marriage", labelUrdu: "شادی کی بنیاد پر" },
      ],
      group: "Citizenship Details",
    },
    {
      name: "residenceDuration",
      label: "Duration of Residence in Pakistan",
      labelUrdu: "پاکستان میں رہائش کی مدت",
      type: "text",
      required: true,
      group: "Citizenship Details",
    },
    {
      name: "supportingFacts",
      label: "Supporting Facts & Background",
      labelUrdu: "معاون حقائق اور پس منظر",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Citizenship Details",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a Pakistan Citizenship Application in {{language}}.

APPLICANT:
- Name: {{applicantName}}
- Address: {{applicantAddress}}
- Current Nationality: {{currentNationality}}

CITIZENSHIP DETAILS:
- Basis: {{basisForCitizenship}}
- Residence Duration: {{residenceDuration}}
- Supporting Facts: {{supportingFacts}}

Generate a complete Pakistan Citizenship Application under the Pakistan Citizenship Act 1951.
Include proper addressing to the Federal Government / Ministry of Interior, applicant backgroundREFERENCE FORMAT - Follow this exact Pakistani legal format:

APPLICATION FOR CITIZENSHIP / NATIONALITY CERTIFICATE

To,
The Director General,
Directorate General of Immigration & Passports / NADRA,
[City].

SUBJECT: Application for Grant of Pakistani Citizenship

[Applicant Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]

Respected Sir,

With due respect it is submitted that:

1. That I am a Pakistani national by birth / by descent / by naturalization (Section 3/4/5, Pakistan Citizenship Act 1951).
2. That I have been residing in Pakistan continuously since [Date] and am a law-abiding citizen.
3. That I hereby declare allegiance to Pakistan and the Constitution of the Islamic Republic of Pakistan.
4. That all the information and documents provided in support of this application are true and correct.

REQUIRED DOCUMENTS:
- CNIC / NICOP copy
- Birth Certificate
- Domicile Certificate
- Two photographs
- Other as required

Applicant's Signature: ___________
Date: ___________

INSTRUCTIONS:
- Heading: APPLICATION FOR CITIZENSHIP (centered, bold)
- Reference Pakistan Citizenship Act 1951 with specific sections
- Include declaration of allegiance
- Include supporting documents checklist
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
