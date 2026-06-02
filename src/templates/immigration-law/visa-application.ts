import { TemplateDefinition } from "../types";

export const visaApplication: TemplateDefinition = {
  category: "immigration-law",
  subType: "visa-application",
  name: "Visa Application Support Letter / ویزا درخواست معاون خط",
  nameUrdu: "ویزا درخواست معاون خط",
  description: "Visa application support letter for Pakistani nationals",
  descriptionUrdu: "پاکستانی شہریوں کے لیے ویزا درخواست کا معاون خط",
  icon: "Plane",
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
      name: "applicantPassport",
      label: "Passport Number",
      labelUrdu: "پاسپورٹ نمبر",
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
      label: "Applicant's Address",
      labelUrdu: "درخواست گزار کا پتہ",
      type: "address",
      required: true,
      group: "Applicant Details",
    },
    {
      name: "destinationCountry",
      label: "Destination Country",
      labelUrdu: "منزل ملک",
      type: "text",
      required: true,
      group: "Visa Details",
    },
    {
      name: "visaType",
      label: "Visa Type",
      labelUrdu: "ویزا کی قسم",
      type: "select",
      required: true,
      options: [
        { value: "tourist", label: "Tourist Visa", labelUrdu: "سیاحتی ویزا" },
        { value: "business", label: "Business Visa", labelUrdu: "کاروباری ویزا" },
        { value: "student", label: "Student Visa", labelUrdu: "طالب علم ویزا" },
        { value: "work", label: "Work Visa", labelUrdu: "ورک ویزا" },
        { value: "medical", label: "Medical Visa", labelUrdu: "طبی ویزا" },
        { value: "family", label: "Family / Spouse Visa", labelUrdu: "خاندانی / ازدواجی ویزا" },
        { value: "transit", label: "Transit Visa", labelUrdu: "ٹرانزٹ ویزا" },
      ],
      group: "Visa Details",
    },
    {
      name: "purpose",
      label: "Purpose of Visit",
      labelUrdu: "سفر کا مقصد",
      type: "textarea",
      required: true,
      group: "Visa Details",
    },
    {
      name: "sponsor",
      label: "Sponsor / Host Details",
      labelUrdu: "کفیل / میزبان کی تفصیلات",
      type: "textarea",
      required: false,
      group: "Visa Details",
    },
    {
      name: "travelDates",
      label: "Intended Travel Dates",
      labelUrdu: "سفر کی متوقع تاریخیں",
      type: "text",
      required: true,
      group: "Visa Details",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a Visa Application Support Letter in {{language}}.

APPLICANT:
- Name: {{applicantName}}
- Passport: {{applicantPassport}}
- CNIC: {{applicantCnic}}
- Address: {{applicantAddress}}

VISA DETAILS:
- Destination: {{destinationCountry}}
- Visa Type: {{visaType}}
- Purpose: {{purpose}}
- Sponsor/Host: {{sponsor}}
- Travel Dates: {{travelDates}}

Generate a complete Visa Application Support Letter suitable for submission to the embassy/consulate of {{destinationCountry}}.
Include proper embassy addressing, aREFERENCE FORMAT - Follow this exact Pakistani legal format:

VISA APPLICATION SUPPORT LETTER / COVER LETTER

To,
The Visa Officer,
[Country] Embassy / Consulate,
[City].

SUBJECT: Visa Application for [Applicant Name]

Respected Sir / Madam,

I, [Applicant Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address], Pakistan, hereby submit my application for a [Visa Type - Tourist / Business / Student / Family] visa to [Country].

PURPOSE OF VISIT:
[Detailed purpose - tourism / business meetings / education / family visit]

FINANCIAL CAPABILITY:
I am financially capable of bearing all expenses of my visit. My monthly income is PKR [Amount]/- and bank statement is enclosed.

TIES TO PAKISTAN:
I am employed as [Designation] at [Organization] / I own property / I have family dependents in Pakistan and shall return upon expiry of the visa.

TRAVEL ITINERARY:
- Departure: [Date], Arrival: [Date]
- Duration of Stay: [Duration]
- Accommodation: [Hotel / Host Address]

UNDERTAKING:
I undertake to comply with all visa conditions and return to Pakistan on or before [Return Date].

Sincerely,
[Applicant Name]
CNIC: ___________
Contact: ___________
Date: ___________

INSTRUCTIONS:
- Heading: VISA APPLICATION SUPPORT LETTER (centered, bold)
- Include purpose of visit, financial capability, ties to Pakistan, return undertaking
- Include travel itinerary
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
