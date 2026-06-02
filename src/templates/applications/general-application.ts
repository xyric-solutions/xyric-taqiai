import { TemplateDefinition } from "../types";

export const generalApplication: TemplateDefinition = {
  category: "application",
  subType: "general-application",
  name: "General Legal Application",
  nameUrdu: "عام قانونی درخواست",
  description: "General purpose legal application",
  descriptionUrdu: "عام مقاصد کی قانونی درخواست",
  icon: "FileEdit",
  formFields: [
    {
      name: "applicantName",
      label: "Applicant Name",
      labelUrdu: "درخواست گزار کا نام",
      type: "text",
      required: true,
      group: "Applicant",
    },
    {
      name: "applicantCnic",
      label: "CNIC",
      labelUrdu: "شناختی کارڈ",
      type: "cnic",
      required: true,
      group: "Applicant",
    },
    {
      name: "applicantAddress",
      label: "Address",
      labelUrdu: "پتہ",
      type: "address",
      required: true,
      group: "Applicant",
    },
    {
      name: "addressedTo",
      label: "Addressed To",
      labelUrdu: "بنام",
      type: "text",
      required: true,
      placeholder: "e.g., Deputy Commissioner, Chairman Union Council",
      group: "Recipient",
    },
    {
      name: "subject",
      label: "Subject",
      labelUrdu: "موضوع",
      type: "text",
      required: true,
      group: "Application",
    },
    {
      name: "applicationBody",
      label: "Application Body",
      labelUrdu: "درخواست کی تفصیل",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Application",
    },
    {
      name: "reliefSought",
      label: "Relief/Action Requested",
      labelUrdu: "مطلوبہ کارروائی",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Application",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a formal Legal Application in {{language}}.

APPLICANT:
- Name: {{applicantName}}
- CNIC: {{applicantCnic}}
- Address: {{applicantAddress}}

ADDRESSED TO: {{addressedTo}}
SUBJECT: {{subject}}
BODY: {{applicationBody}}
RELIEF SOUGHT: {{reliefSought}}

REFERENCE FORMAT — Follow this exact Pakistani legal format:

To,
[Addressed To — Authority/Officer Name],
[Department/Office],
[City]

Subject: [Subject of Application]

Respected Sir/Madam,

With due respect it is submitted that I, [Applicant Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address], do hereby most respectfully state as under:

1. That [state the first factual point / background].
2. That [state the second factual point].
3. That [state additional relevant facts].
4. That [state the specific request or need].

It is therefore most respectfully prayed that Your Honour / Your Good Self may kindly:
(i) [First specific relief sought]
(ii) [Second specific relief sought, if any]

The act of Your Honour shall be a matter of justice and shall be highly appreciated.

Yours faithfully,

[Applicant Name]
CNIC: ___________
Address: ___________
Phone: ___________

Date: _______________

INSTRUCTIONS:
- Formal To: / Subject: header
- "With due respect it is submitted that I, [Name] S/o [Father Name]..." opening
- Numbered "That..." paragraphs for facts
- Prayer clause starting "It is therefore most respectfully prayed..."
- Roman numeral relief items
- "Yours faithfully" closing
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
