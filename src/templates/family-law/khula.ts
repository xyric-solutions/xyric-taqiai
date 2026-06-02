import { TemplateDefinition } from "../types";

export const khula: TemplateDefinition = {
  category: "family-law",
  subType: "khula",
  name: "Khula Application / خلع کی درخواست",
  nameUrdu: "خلع کی درخواست",
  description: "Wife seeking divorce through court under Dissolution of Muslim Marriages Act 1939",
  descriptionUrdu: "تحلیل ازدواج مسلم ایکٹ 1939 کے تحت بیوی کی طرف سے عدالت کے ذریعے طلاق کی درخواست",
  icon: "FileX",
  formFields: [
    {
      name: "wifeName",
      label: "Wife's Name",
      labelUrdu: "بیوی کا نام",
      type: "text",
      required: true,
      group: "Wife Details",
    },
    {
      name: "wifeFatherName",
      label: "Wife's Father's Name",
      labelUrdu: "بیوی کے والد کا نام",
      type: "text",
      required: true,
      group: "Wife Details",
    },
    {
      name: "wifeCnic",
      label: "Wife's CNIC",
      labelUrdu: "بیوی کا شناختی کارڈ",
      type: "cnic",
      required: true,
      group: "Wife Details",
    },
    {
      name: "wifeAddress",
      label: "Wife's Address",
      labelUrdu: "بیوی کا پتہ",
      type: "address",
      required: true,
      group: "Wife Details",
    },
    {
      name: "husbandName",
      label: "Husband's Name",
      labelUrdu: "شوہر کا نام",
      type: "text",
      required: true,
      group: "Husband Details",
    },
    {
      name: "husbandFatherName",
      label: "Husband's Father's Name",
      labelUrdu: "شوہر کے والد کا نام",
      type: "text",
      required: true,
      group: "Husband Details",
    },
    {
      name: "husbandCnic",
      label: "Husband's CNIC",
      labelUrdu: "شوہر کا شناختی کارڈ",
      type: "cnic",
      required: true,
      group: "Husband Details",
    },
    {
      name: "husbandAddress",
      label: "Husband's Address",
      labelUrdu: "شوہر کا پتہ",
      type: "address",
      required: true,
      group: "Husband Details",
    },
    {
      name: "marriageDate",
      label: "Date of Marriage (Nikah)",
      labelUrdu: "تاریخ نکاح",
      type: "date",
      required: true,
      group: "Marriage Details",
    },
    {
      name: "nikahRegistrationNo",
      label: "Nikah Registration No.",
      labelUrdu: "نکاح رجسٹریشن نمبر",
      type: "text",
      required: false,
      group: "Marriage Details",
    },
    {
      name: "mehrAmount",
      label: "Haq Mehr Amount (PKR)",
      labelUrdu: "حق مہر کی رقم (روپے)",
      type: "number",
      required: true,
      group: "Marriage Details",
    },
    {
      name: "reasonForKhula",
      label: "Reason for Seeking Khula",
      labelUrdu: "خلع کی وجہ",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Khula Details",
    },
    {
      name: "childrenDetails",
      label: "Children Details (Names, Ages)",
      labelUrdu: "بچوں کی تفصیلات (نام، عمریں)",
      type: "textarea",
      required: false,
      group: "Children",
    },
    {
      name: "returningMehr",
      label: "Whether Wife is Returning Mehr",
      labelUrdu: "کیا بیوی مہر واپس کر رہی ہے",
      type: "select",
      required: true,
      options: [
        { value: "yes", label: "Yes - Returning Full Mehr", labelUrdu: "ہاں - پورا مہر واپس" },
        { value: "partial", label: "Returning Partial Mehr", labelUrdu: "جزوی مہر واپس" },
        { value: "no", label: "No - Not Returning", labelUrdu: "نہیں - واپس نہیں" },
      ],
      group: "Khula Details",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a Khula Application in {{language}}.

WIFE (APPLICANT):
- Name: {{wifeName}}
- Father's Name: {{wifeFatherName}}
- CNIC: {{wifeCnic}}
- Address: {{wifeAddress}}

HUSBAND (RESPONDENT):
- Name: {{husbandName}}
- Father's Name: {{husbandFatherName}}
- CNIC: {{husbandCnic}}
- Address: {{husbandAddress}}

MARRIAGE DETAILS:
- Date: {{marriageDate}}
- Registration No: {{nikahRegistrationNo}}
- Haq Mehr: PKR {{mehrAmount}}

KHULA DETAILS:
- Reason: {{reasonForKhula}}
- Children: {{childrenDetails}}
- Returning Mehr: {{returningMehr}}

REFERENCE FORMAT — Follow this exact Pakistani legal format:

IN THE FAMILY COURT AT [CITY]
SUIT FOR KHULA / DISSOLUTION OF MARRIAGE

[Wife Name] D/o [Father Name], CNIC No. [CNIC], resident of [Address]
                                                                    ...PLAINTIFF/APPLICANT

VERSUS

[Husband Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
                                                                    ...DEFENDANT/RESPONDENT

SUIT FOR DISSOLUTION OF MARRIAGE (KHULA) UNDER DISSOLUTION OF MUSLIM MARRIAGES ACT 1939

RESPECTFULLY SHEWETH:

1. That the Plaintiff is the legally wedded wife of the Defendant having been married to him on [Marriage Date] vide Nikah Nama No. [Nikah Registration No.], registered at [Place].
2. That the Haq Mehr agreed upon at the time of Nikah was PKR [Mehr Amount]/- ([Amount in words] only).
3. That the parties have [no children / the following children: details].
4. That [detailed reasons for seeking dissolution: cruelty / non-maintenance / desertion / incompatibility / etc.].
5. That the marital relationship between the parties has broken down irretrievably and it is no longer possible for the Plaintiff to live within the limits prescribed by Allah.
6. That the Plaintiff is willing to return the Haq Mehr of PKR [Mehr Amount]/- [or partial amount / or states she is not returning] to the Defendant.
7. That the Plaintiff prays that this Honourable Court may be pleased to:
   (a) Dissolve the marriage between the parties through Khula;
   (b) [Any additional relief — custody, maintenance, etc.]

VERIFICATION:
Verified on oath at [City] that the contents of above plaint are true and correct to the best of my knowledge and nothing has been concealed.

Plaintiff:
[Wife Name] D/o [Father Name]
CNIC: ___________

Advocate: ___________________

INSTRUCTIONS:
- Court heading: IN THE FAMILY COURT AT [CITY] (centered, bold)
- SUIT FOR KHULA heading
- Plaintiff vs Defendant identification with CNIC
- "RESPECTFULLY SHEWETH:" opening
- Numbered "That..." paragraphs
- Prayer clause with roman numerals
- VERIFICATION paragraph
- Based on Dissolution of Muslim Marriages Act 1939
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
