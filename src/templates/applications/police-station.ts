import { TemplateDefinition } from "../types";

export const policeStationApplication: TemplateDefinition = {
  category: "application",
  subType: "police-station",
  name: "Police Station Application",
  nameUrdu: "تھانے میں درخواست",
  description: "Application/complaint to police station",
  descriptionUrdu: "تھانے میں درخواست/شکایت",
  icon: "ShieldAlert",
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
      label: "Applicant CNIC",
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
      name: "applicantPhone",
      label: "Phone Number",
      labelUrdu: "فون نمبر",
      type: "phone",
      required: true,
      group: "Applicant",
    },
    {
      name: "policeStationName",
      label: "Police Station Name",
      labelUrdu: "تھانے کا نام",
      type: "text",
      required: true,
      group: "Police Station",
    },
    {
      name: "applicationSubject",
      label: "Subject",
      labelUrdu: "موضوع",
      type: "text",
      required: true,
      group: "Application",
    },
    {
      name: "incidentDate",
      label: "Incident Date",
      labelUrdu: "واقعے کی تاریخ",
      type: "date",
      required: true,
      group: "Application",
    },
    {
      name: "incidentDetails",
      label: "Incident Details",
      labelUrdu: "واقعے کی تفصیل",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Application",
    },
    {
      name: "accusedDetails",
      label: "Accused Person Details (if known)",
      labelUrdu: "ملزم کی تفصیلات (اگر معلوم ہو)",
      type: "textarea",
      required: false,
      group: "Application",
    },
    {
      name: "reliefSought",
      label: "Relief Sought",
      labelUrdu: "مطلوبہ ریلیف",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Application",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a Police Station Application in {{language}}.

APPLICANT:
- Name: {{applicantName}}
- CNIC: {{applicantCnic}}
- Address: {{applicantAddress}}
- Phone: {{applicantPhone}}

TO: SHO, {{policeStationName}}
SUBJECT: {{applicationSubject}}
INCIDENT DATE: {{incidentDate}}
DETAILS: {{incidentDetails}}
ACCUSED: {{accusedDetails}}
RELIEF SOUGHT: {{reliefSought}}

REFERENCE FORMAT — Follow this exact Pakistani legal format:

To,
The SHO,
[Police Station Name],
[City]

Subject: [Application Subject]

Respected Sir,

With due respect it is submitted that I, [Applicant Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address], [City], Phone: [Phone], do hereby state as under:

1. That on [Incident Date], [describe the incident / complaint in detail].
2. That [accused person details if known — name, address, description].
3. That [additional relevant facts / evidence / witnesses].
4. That I hereby request your honour to take cognizance of the matter and register the FIR / take appropriate action under the law.

It is therefore most respectfully prayed that Your Honour may kindly:
(i) [Specific relief sought — FIR registration, recovery, arrest, etc.]
(ii) [Any additional prayer]

The act of Your Honour shall be a matter of justice.

Yours faithfully,

[Applicant Name]
CNIC: ___________
Phone: ___________
Address: ___________

Date: _______________     Place: _______________

INSTRUCTIONS:
- Formal application format to SHO
- To: / Subject: header
- "With due respect it is submitted that..." opening
- Numbered "That..." paragraphs for facts
- Prayer clause with roman numeral sub-items
- "Yours faithfully" closing with applicant details
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
