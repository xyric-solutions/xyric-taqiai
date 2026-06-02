import { TemplateDefinition } from "../types";

export const divorceAffidavit: TemplateDefinition = {
  category: "affidavit",
  subType: "divorce-affidavit",
  name: "Divorce/Talaq Affidavit",
  nameUrdu: "طلاق حلف نامہ",
  description: "Sworn statement for divorce/talaq proceedings",
  descriptionUrdu: "طلاق کی کارروائی کے لیے حلفیہ بیان",
  icon: "HeartCrack",
  formFields: [
    {
      name: "deponentName",
      label: "Deponent Name (Husband)",
      labelUrdu: "حلف اٹھانے والے کا نام (شوہر)",
      type: "text",
      required: true,
      placeholder: "Enter full name",
      placeholderUrdu: "پورا نام درج کریں",
      group: "Deponent Details",
    },
    {
      name: "fatherName",
      label: "Father's Name",
      labelUrdu: "والد کا نام",
      type: "text",
      required: true,
      placeholder: "Enter father's name",
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
      label: "Address",
      labelUrdu: "پتہ",
      type: "address",
      required: true,
      placeholder: "Enter complete address",
      group: "Deponent Details",
    },
    {
      name: "spouseName",
      label: "Wife's Name",
      labelUrdu: "بیوی کا نام",
      type: "text",
      required: true,
      placeholder: "Enter wife's full name",
      placeholderUrdu: "بیوی کا پورا نام درج کریں",
      group: "Spouse Details",
    },
    {
      name: "spouseFatherName",
      label: "Wife's Father's Name",
      labelUrdu: "بیوی کے والد کا نام",
      type: "text",
      required: true,
      placeholder: "Enter wife's father's name",
      group: "Spouse Details",
    },
    {
      name: "spouseCnic",
      label: "Wife's CNIC",
      labelUrdu: "بیوی کا شناختی کارڈ نمبر",
      type: "cnic",
      required: false,
      placeholder: "XXXXX-XXXXXXX-X",
      group: "Spouse Details",
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
      name: "nikahRegNo",
      label: "Nikah Registration Number",
      labelUrdu: "نکاح رجسٹریشن نمبر",
      type: "text",
      required: false,
      placeholder: "Enter nikah nama registration number",
      group: "Marriage Details",
    },
    {
      name: "divorceDate",
      label: "Date of Divorce/Talaq",
      labelUrdu: "طلاق کی تاریخ",
      type: "date",
      required: true,
      group: "Divorce Details",
    },
    {
      name: "divorceType",
      label: "Type of Divorce",
      labelUrdu: "طلاق کی قسم",
      type: "select",
      required: true,
      options: [
        { value: "talaq-e-ahsan", label: "Talaq-e-Ahsan (Single Revocable)", labelUrdu: "طلاقِ احسن" },
        { value: "talaq-e-hasan", label: "Talaq-e-Hasan (Three in Three Months)", labelUrdu: "طلاقِ حسن" },
        { value: "talaq-e-biddat", label: "Talaq-e-Biddat (Triple Talaq)", labelUrdu: "طلاقِ بدعت" },
        { value: "mubarat", label: "Mubarat (Mutual Consent)", labelUrdu: "مبارات" },
      ],
      group: "Divorce Details",
    },
    {
      name: "childrenDetails",
      label: "Children Details",
      labelUrdu: "بچوں کی تفصیلات",
      type: "textarea",
      required: false,
      placeholder: "Enter names, ages, and custody details of children (if any)",
      aiSuggestable: true,
      group: "Divorce Details",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a formal Divorce/Talaq Affidavit (طلاق حلف نامہ) in {{language}}.

DEPONENT (HUSBAND) DETAILS:
- Name: {{deponentName}}
- Father's Name: {{fatherName}}
- CNIC: {{cnic}}
- Address: {{address}}

SPOUSE (WIFE) DETAILS:
- Name: {{spouseName}}
- Father's Name: {{spouseFatherName}}
- CNIC: {{spouseCnic}}

MARRIAGE DETAILS:
- Marriage Date: {{marriageDate}}
- Nikah Registration No: {{nikahRegNo}}

DIVORCE DETAILS:
- Divorce Date: {{divorceDate}}
- Type of Divorce: {{divorceType}}
- Children Details: {{childrenDetails}}

Generate a complete, legally valid Divorce/Talaq Affidavit following Pakistani law format under the Muslim Family Laws Ordinance 1961. Include:
1. Title and heading
2. Deponent identification paragraph
3. Marriage details and nikah reference
4. Declaration of talaq/divorce with date and type
5. Notice to Union Council as required under Section 7 MFLO 1961
6. Children and custody arrangement if applicable
7. Mehr and finaREFERENCE FORMAT - Follow this exact Pakistani legal format:

AFFIDAVIT OF DIVORCE / TALAQ NAMA

I, [Husband Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address], do hereby solemnly affirm and declare as under:

1. That I was married to Mst. [Wife Name] D/o [Father Name], CNIC No. [Wife CNIC], on [Date of Nikah] at [Place of Nikah].
2. That I have pronounced three / [Number] Talaqs upon my wife Mst. [Wife Name] on [Date of Divorce].
3. That the period of Iddat has been / will be observed as per Islamic Sharia from the date of Talaq.
4. That the Haq Mehr of PKR [Amount]/- has been / shall be paid to the wife.
5. That all financial obligations including dower have been settled as agreed.
6. That I have sent the prescribed notice under Section 7 of the Muslim Family Laws Ordinance 1961 to the Chairman, Union Council, [UC Name].
7. That the contents of this affidavit are true and correct to the best of my knowledge and belief and nothing has been concealed.

DEPONENT (HUSBAND)
[Husband Name] S/o [Father Name]
CNIC: ___________

VERIFICATION:
Verified on oath at [City] on this ___ day of ___________ that the contents of the above affidavit are true and correct to the best of my knowledge and belief and nothing has been concealed therein.

DEPONENT

ATTESTED
(Oath Commissioner / Notary Public / Class-1 Officer)

INSTRUCTIONS:
- Title: AFFIDAVIT OF DIVORCE / TALAQ NAMA (centered, bold)
- "That..." numbered clauses
- Include Nikah date, divorce date, Haq Mehr, Iddat period
- Include Section 7 MFLO 1961 notice reference
- Include VERIFICATION paragraph
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
