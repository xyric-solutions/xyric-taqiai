import { TemplateDefinition } from "../types";

export const marriageDeed: TemplateDefinition = {
  category: "family-law",
  subType: "marriage-deed",
  name: "Marriage Deed / Nikah Nama",
  nameUrdu: "نکاح نامہ",
  description: "Marriage contract/deed",
  descriptionUrdu: "نکاح کا معاہدہ",
  icon: "Heart",
  formFields: [
    {
      name: "groomName",
      label: "Groom's Name",
      labelUrdu: "دولہا کا نام",
      type: "text",
      required: true,
      group: "Groom Details",
    },
    {
      name: "groomFatherName",
      label: "Groom's Father's Name",
      labelUrdu: "دولہا کے والد کا نام",
      type: "text",
      required: true,
      group: "Groom Details",
    },
    {
      name: "groomCnic",
      label: "Groom's CNIC",
      labelUrdu: "دولہا کا شناختی کارڈ",
      type: "cnic",
      required: true,
      group: "Groom Details",
    },
    {
      name: "groomAge",
      label: "Groom's Age",
      labelUrdu: "دولہا کی عمر",
      type: "number",
      required: true,
      group: "Groom Details",
    },
    {
      name: "brideName",
      label: "Bride's Name",
      labelUrdu: "دلہن کا نام",
      type: "text",
      required: true,
      group: "Bride Details",
    },
    {
      name: "brideFatherName",
      label: "Bride's Father's Name",
      labelUrdu: "دلہن کے والد کا نام",
      type: "text",
      required: true,
      group: "Bride Details",
    },
    {
      name: "brideCnic",
      label: "Bride's CNIC",
      labelUrdu: "دلہن کا شناختی کارڈ",
      type: "cnic",
      required: true,
      group: "Bride Details",
    },
    {
      name: "brideAge",
      label: "Bride's Age",
      labelUrdu: "دلہن کی عمر",
      type: "number",
      required: true,
      group: "Bride Details",
    },
    {
      name: "mehrAmount",
      label: "Haq Mehr Amount (PKR)",
      labelUrdu: "حق مہر (روپے)",
      type: "number",
      required: true,
      group: "Nikah Details",
    },
    {
      name: "mehrType",
      label: "Mehr Type",
      labelUrdu: "مہر کی قسم",
      type: "select",
      required: true,
      options: [
        { value: "muajjal", label: "Muajjal (Prompt)", labelUrdu: "معجل (فوری)" },
        { value: "muwajjal", label: "Muwajjal (Deferred)", labelUrdu: "مؤجل (مؤخر)" },
        { value: "both", label: "Both", labelUrdu: "دونوں" },
      ],
      group: "Nikah Details",
    },
    {
      name: "nikahDate",
      label: "Date of Nikah",
      labelUrdu: "تاریخ نکاح",
      type: "date",
      required: true,
      group: "Nikah Details",
    },
    {
      name: "nikahPlace",
      label: "Place of Nikah",
      labelUrdu: "مقام نکاح",
      type: "text",
      required: true,
      group: "Nikah Details",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a Marriage Deed (Nikah Nama) in {{language}}.

GROOM:
- Name: {{groomName}}
- Father's Name: {{groomFatherName}}
- CNIC: {{groomCnic}}
- Age: {{groomAge}}

BRIDE:
- Name: {{brideName}}
- Father's Name: {{brideFatherName}}
- CNIC: {{brideCnic}}
- Age: {{brideAge}}

NIKAH DETAILS:
- Haq Mehr: PKR {{mehrAmount}} ({{mehrType}})
- Date: {{nikahDate}}
- Place: {{nikahPlace}}

REFERENCE FORMAT — Follow this exact Pakistani legal format:

MARRIAGE DEED / CERTIFICATE OF NIKAH

This is to certify that on this ___ day of ___________, 20___, Nikah was solemnized between:

GROOM:
[Groom Name] S/o [Father Name], CNIC No. [CNIC], aged [Age] years, Muslim

AND

BRIDE:
[Bride Name] D/o [Father Name], CNIC No. [CNIC], aged [Age] years, Muslim

at [Place of Nikah]

TERMS OF NIKAH:

Haq Mehr: PKR [Mehr Amount]/- ([Amount in words] only)
Type of Mehr: [Muajjal (Prompt) / Muwajjal (Deferred) / Both]
[Prompt Mehr: PKR ___ / Deferred Mehr: PKR ___]

The above Nikah was solemnized with the free consent of both parties in the presence of the following witnesses.

Groom's Signature: ___________________
[Groom Name] S/o [Father Name]
CNIC: ___________

Bride's Signature: ___________________
[Bride Name] D/o [Father Name]
CNIC: ___________

Bride's Wali (Guardian): ___________________
[Wali Name] S/o [Father Name]
CNIC: ___________

Witness 1: ___________________     Witness 2: ___________________
CNIC: ___________                  CNIC: ___________

Nikah Registrar: ___________________
Registration No.: ___________________
Date: ___________________

INSTRUCTIONS:
- Title: MARRIAGE DEED / CERTIFICATE OF NIKAH (centered, bold)
- Groom and Bride with CNIC and age
- Haq Mehr amount clearly stated
- Groom, Bride, Wali, and two Witnesses signature blocks
- Nikah Registrar details at bottom
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
