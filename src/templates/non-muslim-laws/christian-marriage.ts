import { TemplateDefinition } from "../types";

export const christianMarriage: TemplateDefinition = {
  category: "non-muslim-laws",
  subType: "christian-marriage",
  name: "Christian Marriage Certificate",
  nameUrdu: "مسیحی نکاح نامہ",
  description: "Marriage registration under Christian Marriage Act 1872",
  descriptionUrdu: "کرسچین میرج ایکٹ 1872 کے تحت شادی کی رجسٹریشن",
  icon: "Heart",
  formFields: [
    { name: "groomName", label: "Groom's Full Name", labelUrdu: "دولہا کا نام", type: "text", required: true, group: "Groom Details" },
    { name: "groomFatherName", label: "Groom's Father's Name", labelUrdu: "دولہا کے والد کا نام", type: "text", required: true, group: "Groom Details" },
    { name: "groomCnic", label: "Groom's CNIC", labelUrdu: "دولہا کا شناختی کارڈ", type: "cnic", required: true, group: "Groom Details" },
    { name: "groomAddress", label: "Groom's Address", labelUrdu: "دولہا کا پتہ", type: "address", required: true, group: "Groom Details" },
    { name: "groomChurch", label: "Groom's Church/Parish", labelUrdu: "دولہا کا چرچ", type: "text", required: true, group: "Groom Details" },
    { name: "brideName", label: "Bride's Full Name", labelUrdu: "دلہن کا نام", type: "text", required: true, group: "Bride Details" },
    { name: "brideFatherName", label: "Bride's Father's Name", labelUrdu: "دلہن کے والد کا نام", type: "text", required: true, group: "Bride Details" },
    { name: "brideCnic", label: "Bride's CNIC", labelUrdu: "دلہن کا شناختی کارڈ", type: "cnic", required: true, group: "Bride Details" },
    { name: "brideAddress", label: "Bride's Address", labelUrdu: "دلہن کا پتہ", type: "address", required: true, group: "Bride Details" },
    { name: "marriageDate", label: "Date of Marriage", labelUrdu: "شادی کی تاریخ", type: "date", required: true, group: "Marriage Details" },
    { name: "churchName", label: "Church Name & Location", labelUrdu: "چرچ کا نام اور مقام", type: "text", required: true, group: "Marriage Details" },
    { name: "ministerName", label: "Minister/Priest Name", labelUrdu: "پادری کا نام", type: "text", required: true, group: "Marriage Details" },
    { name: "witness1", label: "Witness 1 Name & CNIC", labelUrdu: "گواہ 1", type: "text", required: true, group: "Witnesses" },
    { name: "witness2", label: "Witness 2 Name & CNIC", labelUrdu: "گواہ 2", type: "text", required: true, group: "Witnesses" },
  ],
  promptTemplate: `Generate a professional Christian Marriage Certificate under Christian Marriage Act 1872 (Pakistan).
Groom: {groomName} s/o {groomFatherName}, CNIC: {groomCnic}, Address: {groomAddress}, Church: {groomChurch}
Bride: {brideName} d/o {brideFatherName}, CNIC: {brideCnic}, Address: {brideAddress}
Marriage Date: {marriageDate}, Church: {churchName}, Minister: {ministerName}
Witnesses: {witness1}, {witness2}
Include all legal requirements under Christian Marriage Act 1872 Sections 27-31.

REFERENCE FORMAT - Follow this exact Pakistani legal format:

CHRISTIAN MARRIAGE CERTIFICATE / CERTIFICATE OF MARRIAGE

(Under Christian Marriage Act 1872)

This is to certify that:

GROOM: [Groom Name] S/o [Father Name], CNIC No. [CNIC], Age: [Age], resident of [Address]
BRIDE: [Bride Name] D/o [Father Name], CNIC No. [CNIC], Age: [Age], resident of [Address]

Were joined in Holy Matrimony on [Date of Marriage] at [Church Name], [City].

Minister: [Minister Name], [Denomination]
Witnesses:
1. [Witness 1 Name], CNIC: ___________
2. [Witness 2 Name], CNIC: ___________

Registered under Section 27 of the Christian Marriage Act 1872.
Certificate No.: ___________ Date: ___________

Signature of Minister: ___________
Signature of Registrar: ___________

INSTRUCTIONS:
- Title: CHRISTIAN MARRIAGE CERTIFICATE (centered, bold)
- Reference Christian Marriage Act 1872 Sections 27-31
- Include groom and bride details
- Include minister and witnesses
- Both parties sign
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
