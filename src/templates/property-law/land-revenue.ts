import { TemplateDefinition } from "../types";

export const landRevenue: TemplateDefinition = {
  category: "property-law",
  subType: "land-revenue",
  name: "Land Revenue Record Correction / محاصل زمین ریکارڈ کی درستی",
  nameUrdu: "محاصل زمین ریکارڈ کی درستی",
  description: "Application for correction of land revenue record under the Land Revenue Act 1967",
  descriptionUrdu: "لینڈ ریونیو ایکٹ 1967 کے تحت زمین کے ریونیو ریکارڈ کی درستی کی درخواست",
  icon: "Edit",
  formFields: [
    {
      name: "applicantName",
      label: "Applicant's Name",
      labelUrdu: "درخواست گزار کا نام",
      type: "text",
      required: true,
      group: "Applicant Details",
    },
    {
      name: "applicantCnic",
      label: "Applicant's CNIC",
      labelUrdu: "درخواست گزار کا شناختی کارڈ",
      type: "cnic",
      required: true,
      group: "Applicant Details",
    },
    {
      name: "applicantAddress",
      label: "Applicant's Address",
      labelUrdu: "درخواست گزار کا پتہ",
      type: "address",
      required: true,
      group: "Applicant Details",
    },
    {
      name: "propertyKhasra",
      label: "Khasra Number(s)",
      labelUrdu: "خسرہ نمبر",
      type: "text",
      required: true,
      group: "Property Details",
    },
    {
      name: "propertyKhata",
      label: "Khata Number",
      labelUrdu: "کھاتہ نمبر",
      type: "text",
      required: true,
      group: "Property Details",
    },
    {
      name: "mouza",
      label: "Mouza / Village",
      labelUrdu: "موضع / گاؤں",
      type: "text",
      required: true,
      group: "Property Details",
    },
    {
      name: "tehsil",
      label: "Tehsil / District",
      labelUrdu: "تحصیل / ضلع",
      type: "text",
      required: true,
      group: "Property Details",
    },
    {
      name: "currentError",
      label: "Current Error in Record",
      labelUrdu: "ریکارڈ میں موجودہ غلطی",
      type: "textarea",
      required: true,
      group: "Correction Details",
    },
    {
      name: "correctionNeeded",
      label: "Correction Needed",
      labelUrdu: "مطلوبہ درستی",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Correction Details",
    },
    {
      name: "supportingDocuments",
      label: "Supporting Documents",
      labelUrdu: "معاون دستاویزات",
      type: "textarea",
      required: false,
      group: "Correction Details",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a Land Revenue Record Correction Application in {{language}}.

APPLICANT:
- Name: {{applicantName}}
- CNIC: {{applicantCnic}}
- Address: {{applicantAddress}}

PROPERTY DETAILS:
- Khasra Number(s): {{propertyKhasra}}
- Khata Number: {{propertyKhata}}
- Mouza / Village: {{mouza}}
- Tehsil / District: {{tehsil}}

CORRECTION DETAILS:
- Current Error: {{currentError}}
- Correction Needed: {{correctionNeeded}}
- Supporting Documents: {{supportingDocuments}}

Generate a complete Application for Correction of Land Revenue Record under the Land Revenue Act 1967 addressed to the relevant Revenue Authority.
Include proper heading addressed to the Board of Revenue / Settlement Officer / Tehsildar, applicant details, REFERENCE FORMAT - Follow this exact Pakistani legal format:

APPLICATION FOR CORRECTION OF REVENUE RECORD / MUTATION

To,
The Patwari / Revenue Officer / Tehsildar,
Tehsil [Tehsil Name], District [District Name].

SUBJECT: Application for Correction of Revenue Record / Fard

[Applicant Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]

PROPERTY DETAILS:
- Khasra No.: [Khasra Number]
- Khata No.: [Khata Number]
- Mouza: [Mouza]
- Tehsil: [Tehsil], District: [District]
- Area: [Area]

With due respect it is submitted that:

1. That the Applicant is the lawful owner of the above property as per Sale Deed / Inheritance / Mutation No. [Number].
2. That the Revenue Record / Fard (Record of Rights) contains the following error: [Description of Error].
3. That the correct information is: [Correct Details with supporting evidence].
4. That the error is a result of a clerical/entry mistake and the Applicant requests its correction.

PRAYER:
(i) Correct the Revenue Record as specified above;
(ii) Issue a corrected Fard / Record of Rights;
(iii) Any other appropriate relief.

Applicant: ___________
Date: ___________

INSTRUCTIONS:
- Heading: APPLICATION FOR CORRECTION OF REVENUE RECORD (centered, bold)
- PROPERTY DETAILS section with Khasra/Khata/Mouza/Tehsil/District
- Numbered paragraphs with error description and correct details
- Prayer clause with (i)(ii)(iii) items
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
