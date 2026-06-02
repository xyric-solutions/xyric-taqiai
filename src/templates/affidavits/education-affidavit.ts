import { TemplateDefinition } from "../types";

export const educationAffidavit: TemplateDefinition = {
  category: "affidavit",
  subType: "education-affidavit",
  name: "Educational Qualification Affidavit",
  nameUrdu: "تعلیمی اہلیت حلف نامہ",
  description: "Affidavit declaring educational qualifications and degrees",
  descriptionUrdu: "تعلیمی قابلیت اور ڈگریوں کے اعلان کا حلف نامہ",
  icon: "GraduationCap",
  formFields: [
    {
      name: "deponentName",
      label: "Deponent Name",
      labelUrdu: "حلف اٹھانے والے کا نام",
      type: "text",
      required: true,
      placeholder: "Enter full name",
      placeholderUrdu: "پورا نام درج کریں",
      group: "Deponent Details",
    },
    {
      name: "fatherName",
      label: "Father's / Husband's Name",
      labelUrdu: "والد / شوہر کا نام",
      type: "text",
      required: true,
      placeholder: "Enter father's or husband's name",
      group: "Deponent Details",
    },
    {
      name: "cnic",
      label: "CNIC Number",
      labelUrdu: "شناختی کارڈ نمبر",
      type: "cnic",
      required: true,
      placeholder: "XXXXX-XXXXXXX-X",
      validation: { pattern: "^[0-9]{5}-[0-9]{7}-[0-9]$" },
      group: "Deponent Details",
    },
    {
      name: "address",
      label: "Residential Address",
      labelUrdu: "رہائشی پتہ",
      type: "address",
      required: true,
      placeholder: "Enter complete address",
      group: "Deponent Details",
    },
    {
      name: "degree",
      label: "Degree / Qualification",
      labelUrdu: "ڈگری / قابلیت",
      type: "text",
      required: true,
      placeholder: "e.g., B.A., M.Sc., Matric, Intermediate",
      placeholderUrdu: "مثلاً بی اے، ایم ایس سی، میٹرک، انٹرمیڈیٹ",
      group: "Qualification Details",
    },
    {
      name: "institution",
      label: "Institution / College / University",
      labelUrdu: "ادارہ / کالج / یونیورسٹی",
      type: "text",
      required: true,
      placeholder: "Enter institution name",
      group: "Qualification Details",
    },
    {
      name: "boardUniversity",
      label: "Board / University Name",
      labelUrdu: "بورڈ / یونیورسٹی کا نام",
      type: "text",
      required: true,
      placeholder: "e.g., Punjab University, BISE Lahore",
      group: "Qualification Details",
    },
    {
      name: "passingYear",
      label: "Year of Passing",
      labelUrdu: "سال کامیابی",
      type: "text",
      required: true,
      placeholder: "Enter year of passing",
      group: "Qualification Details",
    },
    {
      name: "rollNo",
      label: "Roll Number",
      labelUrdu: "رول نمبر",
      type: "text",
      required: false,
      placeholder: "Enter roll number",
      group: "Qualification Details",
    },
    {
      name: "purpose",
      label: "Purpose of Affidavit",
      labelUrdu: "حلف نامے کا مقصد",
      type: "select",
      required: true,
      options: [
        { value: "employment", label: "Employment / Job", labelUrdu: "ملازمت" },
        { value: "admission", label: "Admission", labelUrdu: "داخلہ" },
        { value: "verification", label: "Degree Verification", labelUrdu: "ڈگری تصدیق" },
        { value: "lost-certificate", label: "Lost Certificate", labelUrdu: "گم شدہ سرٹیفکیٹ" },
        { value: "immigration", label: "Immigration", labelUrdu: "امیگریشن" },
        { value: "other", label: "Other", labelUrdu: "دیگر" },
      ],
      group: "Purpose",
    },
    {
      name: "additionalDetails",
      label: "Additional Details",
      labelUrdu: "اضافی تفصیلات",
      type: "textarea",
      required: false,
      placeholder: "Any additional details about the qualification",
      aiSuggestable: true,
      group: "Purpose",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a formal Educational Qualification Affidavit (تعلیمی اہلیت حلف نامہ) in {{language}}.

DEPONENT DETAILS:
- Name: {{deponentName}}
- Father's/Husband's Name: {{fatherName}}
- CNIC: {{cnic}}
- Address: {{address}}

QUALIFICATION DETAILS:
- Degree: {{degree}}
- Institution: {{institution}}
- Board/University: {{boardUniversity}}
- Year of Passing: {{passingYear}}
- Roll Number: {{rollNo}}

PURPOSE: {{purpose}}
ADDITIONAL DETAILS: {{additionalDetails}}

Generate a complete, legally valid Educational Qualification Affidavit following Pakistani law format. Include:
1. Title and heading
2. Deponent identification paragraph
3. Declaration of educational qualification with full details
4. Institution, board/university, and year of passing
5. Statement that the qualification is genuine and verifiaREFERENCE FORMAT - Follow this exact Pakistani legal format:

AFFIDAVIT FOR EDUCATIONAL PURPOSE

I, [Deponent Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address], do hereby solemnly affirm and declare as under:

1. That I obtained [Degree / Certificate] from [Institution Name] in the year [Year] with Roll No. [Roll No.] / Registration No. [Reg. No.].
2. That I am the same person who appeared in the examination of [Board / University] in [Year] and obtained the said certificate.
3. That my name / date of birth in the said certificate is [Name/DOB in Certificate] whereas on my CNIC it is [Name/DOB on CNIC] - the difference is due to a clerical / spelling variation and both refer to the same person.
4. That I am making this affidavit for the purpose of [HEC Attestation / Scholarship / Employment / Admission] and the said certificate is genuine and original.
5. That the contents of this affidavit are true and correct to the best of my knowledge and belief and nothing has been concealed.

DEPONENT
[Deponent Name] S/o [Father Name]
CNIC: ___________

VERIFICATION:
Verified on oath at [City] on this ___ day of ___________ that the contents of the above affidavit are true and correct to the best of my knowledge and belief and nothing has been concealed therein.

DEPONENT

ATTESTED
(Oath Commissioner / Notary Public / Class-1 Officer)

INSTRUCTIONS:
- Title: AFFIDAVIT FOR EDUCATIONAL PURPOSE (centered, bold)
- "That..." numbered clauses
- Include institution, degree, year, roll number
- Include name/DOB variation explanation if applicable
- Include VERIFICATION paragraph
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
