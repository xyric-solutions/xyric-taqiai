import { TemplateDefinition } from "../types";

export const immigrationAffidavit: TemplateDefinition = {
  category: "affidavit",
  subType: "immigration-affidavit",
  name: "Immigration/Visa Support Affidavit",
  nameUrdu: "امیگریشن حلف نامہ",
  description: "Affidavit for visa/immigration sponsorship and support",
  descriptionUrdu: "ویزا / امیگریشن اسپانسرشپ اور مالی تعاون کا حلف نامہ",
  icon: "Plane",
  formFields: [
    {
      name: "sponsorName",
      label: "Sponsor Name",
      labelUrdu: "اسپانسر کا نام",
      type: "text",
      required: true,
      placeholder: "Enter sponsor's full name",
      placeholderUrdu: "اسپانسر کا پورا نام درج کریں",
      group: "Sponsor Details",
    },
    {
      name: "sponsorFatherName",
      label: "Sponsor's Father's Name",
      labelUrdu: "اسپانسر کے والد کا نام",
      type: "text",
      required: true,
      placeholder: "Enter father's name",
      group: "Sponsor Details",
    },
    {
      name: "sponsorCnic",
      label: "Sponsor CNIC / Passport Number",
      labelUrdu: "اسپانسر شناختی کارڈ / پاسپورٹ نمبر",
      type: "text",
      required: true,
      placeholder: "Enter CNIC or passport number",
      group: "Sponsor Details",
    },
    {
      name: "sponsorAddress",
      label: "Sponsor's Address",
      labelUrdu: "اسپانسر کا پتہ",
      type: "address",
      required: true,
      placeholder: "Enter sponsor's complete address",
      group: "Sponsor Details",
    },
    {
      name: "sponsorOccupation",
      label: "Sponsor's Occupation",
      labelUrdu: "اسپانسر کا پیشہ",
      type: "text",
      required: false,
      placeholder: "Enter occupation/profession",
      group: "Sponsor Details",
    },
    {
      name: "applicantName",
      label: "Applicant / Traveler Name",
      labelUrdu: "درخواست گزار / مسافر کا نام",
      type: "text",
      required: true,
      placeholder: "Enter applicant's full name",
      placeholderUrdu: "درخواست گزار کا پورا نام درج کریں",
      group: "Applicant Details",
    },
    {
      name: "applicantFatherName",
      label: "Applicant's Father's Name",
      labelUrdu: "درخواست گزار کے والد کا نام",
      type: "text",
      required: true,
      placeholder: "Enter applicant's father's name",
      group: "Applicant Details",
    },
    {
      name: "applicantCnic",
      label: "Applicant CNIC / Passport Number",
      labelUrdu: "درخواست گزار شناختی کارڈ / پاسپورٹ نمبر",
      type: "text",
      required: true,
      placeholder: "Enter CNIC or passport number",
      group: "Applicant Details",
    },
    {
      name: "relationship",
      label: "Relationship with Applicant",
      labelUrdu: "درخواست گزار سے رشتہ",
      type: "text",
      required: true,
      placeholder: "e.g., Father, Brother, Uncle, Friend",
      group: "Applicant Details",
    },
    {
      name: "purposeOfTravel",
      label: "Purpose of Travel",
      labelUrdu: "سفر کا مقصد",
      type: "select",
      required: true,
      options: [
        { value: "visit", label: "Visit / Tourism", labelUrdu: "ملاقات / سیاحت" },
        { value: "education", label: "Education / Study", labelUrdu: "تعلیم" },
        { value: "employment", label: "Employment / Work", labelUrdu: "ملازمت / کام" },
        { value: "medical", label: "Medical Treatment", labelUrdu: "طبی علاج" },
        { value: "business", label: "Business", labelUrdu: "کاروبار" },
        { value: "immigration", label: "Permanent Immigration", labelUrdu: "مستقل امیگریشن" },
        { value: "other", label: "Other", labelUrdu: "دیگر" },
      ],
      group: "Travel Details",
    },
    {
      name: "financialSupport",
      label: "Financial Support Details",
      labelUrdu: "مالی تعاون کی تفصیلات",
      type: "textarea",
      required: true,
      placeholder: "Describe the financial support being provided (accommodation, expenses, etc.)",
      aiSuggestable: true,
      group: "Travel Details",
    },
    {
      name: "durationOfStay",
      label: "Expected Duration of Stay",
      labelUrdu: "قیام کی متوقع مدت",
      type: "text",
      required: false,
      placeholder: "e.g., 30 days, 6 months, 1 year",
      group: "Travel Details",
    },
    {
      name: "destinationCountry",
      label: "Destination Country",
      labelUrdu: "منزل ملک",
      type: "text",
      required: true,
      placeholder: "Enter destination country",
      group: "Travel Details",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a formal Immigration/Visa Support Affidavit (امیگریشن حلف نامہ) in {{language}}.

SPONSOR DETAILS:
- Name: {{sponsorName}}
- Father's Name: {{sponsorFatherName}}
- CNIC/Passport: {{sponsorCnic}}
- Address: {{sponsorAddress}}
- Occupation: {{sponsorOccupation}}

APPLICANT DETAILS:
- Name: {{applicantName}}
- Father's Name: {{applicantFatherName}}
- CNIC/Passport: {{applicantCnic}}
- Relationship: {{relationship}}

TRAVEL DETAILS:
- Purpose: {{purposeOfTravel}}
- Destination Country: {{destinationCountry}}
- Duration of Stay: {{durationOfStay}}
- Financial Support: {{financialSupport}}

Generate a complete, legally valid Immigration/Visa Support Affidavit following Pakistani law format. Include:
1. Title and heading
2. Sponsor identification paragraph with occupation and financial standing
3. Applicant details and relationship
4. Purpose and destination of travel
5. Financial support undertaking (accommodation, travel, living expenses)
6. Duration of stay and return undertaking
7. Declaration that sponsor will be responsible for appREFERENCE FORMAT - Follow this exact Pakistani legal format:

AFFIDAVIT OF SPONSORSHIP FOR IMMIGRATION

I, [Sponsor Name] S/o [Father Name], CNIC No. [CNIC], Passport No. [Passport No.], resident of [Address], do hereby solemnly affirm and declare as under:

1. That I am a Pakistani national currently residing at [Sponsor Address].
2. That [Applicant Name] S/o / D/o [Father Name], CNIC No. [CNIC], is my [Relationship] and wishes to travel to [Destination Country] on a [Visa Type] visa.
3. That I hereby sponsor the visit / immigration of [Applicant Name] and undertake to bear all expenses of his/her stay, travel, and accommodation.
4. That [Applicant Name] shall return to Pakistan upon expiry of the visa / as required by immigration laws.
5. That I am financially capable of supporting the said applicant.
6. That the contents of this affidavit are true and correct to the best of my knowledge and belief and nothing has been concealed.

DEPONENT (SPONSOR)
[Sponsor Name] S/o [Father Name]
CNIC / Passport: ___________

VERIFICATION:
Verified on oath at [City] on this ___ day of ___________ that the contents of the above affidavit are true and correct to the best of my knowledge and belief and nothing has been concealed therein.

DEPONENT

ATTESTED
(Oath Commissioner / Notary Public / Class-1 Officer)

INSTRUCTIONS:
- Title: AFFIDAVIT OF SPONSORSHIP FOR IMMIGRATION (centered, bold)
- "That..." numbered clauses
- Include sponsor and applicant details with relationship
- Include financial support and return obligation
- Include VERIFICATION paragraph
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
