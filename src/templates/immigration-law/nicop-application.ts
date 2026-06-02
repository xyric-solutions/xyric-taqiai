import { TemplateDefinition } from "../types";

export const nicopApplication: TemplateDefinition = {
  category: "immigration-law",
  subType: "nicop-application",
  name: "NICOP / POC Application / نکاپ / پی او سی درخواست",
  nameUrdu: "نکاپ / پی او سی درخواست",
  description: "Application for NICOP (National Identity Card for Overseas Pakistanis) or POC (Pakistan Origin Card)",
  descriptionUrdu: "بیرون ملک پاکستانیوں کے شناختی کارڈ (نکاپ) یا پاکستان اوریجن کارڈ (پی او سی) کی درخواست",
  icon: "CreditCard",
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
      name: "fatherName",
      label: "Father's Name",
      labelUrdu: "والد کا نام",
      type: "text",
      required: true,
      group: "Applicant Details",
    },
    {
      name: "countryOfResidence",
      label: "Country of Residence",
      labelUrdu: "رہائش کا ملک",
      type: "text",
      required: true,
      group: "Applicant Details",
    },
    {
      name: "overseasAddress",
      label: "Overseas Address",
      labelUrdu: "بیرون ملک پتہ",
      type: "address",
      required: true,
      group: "Applicant Details",
    },
    {
      name: "cnicDetails",
      label: "Existing CNIC / NICOP Number (if any)",
      labelUrdu: "موجودہ شناختی کارڈ / نکاپ نمبر (اگر ہو)",
      type: "text",
      required: false,
      group: "Document Details",
    },
    {
      name: "applicationType",
      label: "Application Type",
      labelUrdu: "درخواست کی قسم",
      type: "select",
      required: true,
      options: [
        { value: "nicop-new", label: "New NICOP", labelUrdu: "نیا نکاپ" },
        { value: "nicop-renewal", label: "NICOP Renewal", labelUrdu: "نکاپ تجدید" },
        { value: "poc-new", label: "New POC (Pakistan Origin Card)", labelUrdu: "نیا پی او سی" },
        { value: "poc-renewal", label: "POC Renewal", labelUrdu: "پی او سی تجدید" },
      ],
      group: "Document Details",
    },
    {
      name: "documents",
      label: "Supporting Documents Available",
      labelUrdu: "دستیاب معاون دستاویزات",
      type: "textarea",
      required: true,
      group: "Document Details",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a NICOP/POC Application Support Document in {{language}}.

APPLICANT:
- Name: {{applicantName}}
- Father's Name: {{fatherName}}
- Country of Residence: {{countryOfResidence}}
- Overseas Address: {{overseasAddress}}

DOCUMENT DETAILS:
- Existing CNIC/NICOP: {{cnicDetails}}
- Application Type: {{applicationType}}
- Supporting Documents: {{documents}}

Generate a complete NICOP/POC Application Support Document under NADRA regulations as applicable in Pakistan.
Include application letter to NADRA, applicant details, purpose, requiredREFERENCE FORMAT - Follow this exact Pakistani legal format:

APPLICATION FOR NICOP / CARD FOR OVERSEAS PAKISTANIS (NADRA)

Applicant Details:
Name: [Full Name as per Passport]
Father's Name: [Father's Name]
CNIC No. (if existing): [CNIC]
Date of Birth: [DOB]
Country of Residence: [Country]
Address Abroad: [Complete Address]
Pakistani Address: [Address in Pakistan]
Passport No.: [Passport Number]

DECLARATION:
I, [Applicant Name] S/o [Father Name], hereby declare that:
1. I am a Pakistani national residing abroad.
2. All information provided in this application is true and correct.
3. I request issuance of NICOP / Smart NICOP as per NADRA Ordinance 2000.

REQUIRED DOCUMENTS:
- Pakistani Passport (copy)
- Previous CNIC / NICOP (if any)
- Birth Certificate
- Proof of residence abroad
- Two recent photographs (biometric)

Applicant's Signature: ___________
Date: ___________

INSTRUCTIONS:
- Title: APPLICATION FOR NICOP (centered, bold)
- Include applicant details section
- Reference NADRA Ordinance 2000
- Include documents checklist
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
