import { TemplateDefinition } from "../types";

export const passportApplication: TemplateDefinition = {
  category: "immigration-law",
  subType: "passport-application",
  name: "Passport Issuance / Renewal / پاسپورٹ اجرا / تجدید",
  nameUrdu: "پاسپورٹ اجرا / تجدید",
  description: "Application for passport issuance or renewal under the Passports Act 1974",
  descriptionUrdu: "پاسپورٹ ایکٹ 1974 کے تحت پاسپورٹ اجرا یا تجدید کی درخواست",
  icon: "BookOpen",
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
      label: "Father's / Husband's Name",
      labelUrdu: "والد / شوہر کا نام",
      type: "text",
      required: true,
      group: "Applicant Details",
    },
    {
      name: "applicantCnic",
      label: "CNIC Number",
      labelUrdu: "شناختی کارڈ نمبر",
      type: "cnic",
      required: true,
      group: "Applicant Details",
    },
    {
      name: "applicantAddress",
      label: "Permanent Address",
      labelUrdu: "مستقل پتہ",
      type: "address",
      required: true,
      group: "Applicant Details",
    },
    {
      name: "passportType",
      label: "Passport Type",
      labelUrdu: "پاسپورٹ کی قسم",
      type: "select",
      required: true,
      options: [
        { value: "ordinary", label: "Ordinary Passport", labelUrdu: "عام پاسپورٹ" },
        { value: "official", label: "Official Passport", labelUrdu: "سرکاری پاسپورٹ" },
        { value: "diplomatic", label: "Diplomatic Passport", labelUrdu: "سفارتی پاسپورٹ" },
      ],
      group: "Passport Details",
    },
    {
      name: "applicationPurpose",
      label: "Purpose (New / Renewal / Lost)",
      labelUrdu: "مقصد (نیا / تجدید / گم شدہ)",
      type: "select",
      required: true,
      options: [
        { value: "new", label: "New Issuance", labelUrdu: "نیا اجرا" },
        { value: "renewal", label: "Renewal", labelUrdu: "تجدید" },
        { value: "lost", label: "Lost / Damaged", labelUrdu: "گم شدہ / خراب" },
      ],
      group: "Passport Details",
    },
    {
      name: "urgency",
      label: "Urgency",
      labelUrdu: "فوری ضرورت",
      type: "select",
      required: true,
      options: [
        { value: "normal", label: "Normal Processing", labelUrdu: "عام کارروائی" },
        { value: "urgent", label: "Urgent Processing", labelUrdu: "فوری کارروائی" },
        { value: "fast-track", label: "Fast Track", labelUrdu: "فاسٹ ٹریک" },
      ],
      group: "Passport Details",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a Passport Application Support Document in {{language}}.

APPLICANT:
- Name: {{applicantName}}
- Father/Husband: {{fatherName}}
- CNIC: {{applicantCnic}}
- Address: {{applicantAddress}}

PASSPORT DETAILS:
- Type: {{passportType}}
- Purpose: {{applicationPurpose}}
- Urgency: {{urgency}}

Generate a complete Passport Application Support Document under the Passports Act 1974 as applicable in Pakistan.
Include application letter to the Directorate General of Immigration & Passports, applicant detailsREFERENCE FORMAT - Follow this exact Pakistani legal format:

APPLICATION FOR PASSPORT / RENEWAL / DUPLICATE PASSPORT

To,
The Regional Passport Officer / Director,
Passport Office,
[City].

SUBJECT: Application for [New / Renewal / Duplicate] Passport

[Applicant Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]

Respected Sir,

With due respect it is submitted that:

1. That I am a Pakistani national holding CNIC No. [CNIC].
2. That I require a [new / renewed / duplicate] passport for the purpose of [Travel / Employment / Education].
3. That my existing passport bearing No. [Previous Passport No.] has [expired / been lost / been damaged].
4. That in case of lost passport: FIR No. [Number] dated [Date] has been registered at Police Station [Name] and an affidavit is enclosed.

REQUIRED DOCUMENTS:
- CNIC (original + copy)
- Previous Passport (if any)
- Two photographs (passport size)
- FIR (if lost) + Affidavit

Applicant's Signature: ___________
Date: ___________

INSTRUCTIONS:
- Heading: APPLICATION FOR PASSPORT (centered, bold)
- Include applicant details and purpose
- Include lost passport FIR reference and affidavit note if applicable
- Include documents checklist
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
