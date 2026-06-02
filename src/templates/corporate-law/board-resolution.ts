import { TemplateDefinition } from "../types";

export const boardResolution: TemplateDefinition = {
  category: "corporate-law",
  subType: "board-resolution",
  name: "Board Resolution / بورڈ قرارداد",
  nameUrdu: "بورڈ قرارداد",
  description: "Board of Directors resolution under the Companies Act 2017",
  descriptionUrdu: "کمپنیز ایکٹ 2017 کے تحت بورڈ آف ڈائریکٹرز کی قرارداد",
  icon: "ClipboardCheck",
  formFields: [
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
      required: false,
      group: "Company Details",
    },
    {
      name: "resolutionSubject",
      label: "Subject of Resolution",
      labelUrdu: "قرارداد کا موضوع",
      type: "text",
      required: true,
      group: "Resolution Details",
    },
    {
      name: "directorsPresent",
      label: "Directors Present (Names & Designations)",
      labelUrdu: "حاضر ڈائریکٹرز (نام اور عہدے)",
      type: "textarea",
      required: true,
      group: "Resolution Details",
    },
    {
      name: "decision",
      label: "Decision / Resolution Text",
      labelUrdu: "فیصلہ / قرارداد کی عبارت",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Resolution Details",
    },
    {
      name: "meetingDate",
      label: "Date of Board Meeting",
      labelUrdu: "بورڈ میٹنگ کی تاریخ",
      type: "date",
      required: true,
      group: "Resolution Details",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a Board Resolution in {{language}}.

COMPANY:
- Name: {{companyName}}
- Registration No: {{companyRegistrationNo}}

RESOLUTION DETAILS:
- Subject: {{resolutionSubject}}
- Directors Present: {{directorsPresent}}
- Decision: {{decision}}
- Date: {{meetingDate}}

Generate a complete Board Resolution under the Companies Act 2017 as applicable in Pakistan.
Include proper heading with company name, meeting date, quorum confirmation, resolution text with RESOLREFERENCE FORMAT - Follow this exact Pakistani legal format:

RESOLUTION OF THE BOARD OF DIRECTORS
OF
[COMPANY NAME] (PRIVATE) LIMITED

A meeting of the Board of Directors of [Company Name] (Private) Limited was held on [Date] at [Time] at the registered office of the Company at [Company Address].

The following Directors were present:
1. [Director 1 Name]                    (Director)
2. [Director 2 Name]                    (Director)
3. [Director 3 Name]                    (Chairman / CEO)

[Director 1 Name] presided over the meeting.

RESOLVED THAT:

1. [First resolution - e.g., to open a bank account / appoint an officer / approve a transaction]

FURTHER RESOLVED THAT:

2. [Second resolution if any]

FURTHER RESOLVED THAT:

3. [Director Name(s)] be and are hereby authorized to sign / execute / do all acts necessary to give effect to the above resolution(s).

The aforesaid resolutions were unanimously passed by the Directors present.

CERTIFIED TRUE COPY

________________________           ________________________
[Director 1 Name]                  [Director 2 Name]
Director                           Director
CNIC: ___________                  CNIC: ___________

________________________
[Chairman / Company Secretary]
CNIC: ___________

Company Seal: ___________
Date: ___________

INSTRUCTIONS:
- Title: RESOLUTION OF THE BOARD OF DIRECTORS (centered, bold)
- Company name prominently shown
- List directors present
- RESOLVED THAT / FURTHER RESOLVED THAT format
- Authorization clause
- All directors sign
- Reference Companies Act 2017 if applicable
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
