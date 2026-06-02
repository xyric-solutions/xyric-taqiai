import { TemplateDefinition } from "../types";

export const hinduMarriage: TemplateDefinition = {
  category: "non-muslim-laws",
  subType: "hindu-marriage",
  name: "Hindu Marriage Registration",
  nameUrdu: "ہندو شادی رجسٹریشن",
  description: "Marriage registration under Hindu Marriage Act 2017",
  descriptionUrdu: "ہندو میرج ایکٹ 2017 کے تحت شادی کی رجسٹریشن",
  icon: "Heart",
  formFields: [
    { name: "groomName", label: "Groom's Full Name", labelUrdu: "دولہا کا نام", type: "text", required: true, group: "Groom Details" },
    { name: "groomFatherName", label: "Groom's Father's Name", labelUrdu: "دولہا کے والد کا نام", type: "text", required: true, group: "Groom Details" },
    { name: "groomCnic", label: "Groom's CNIC", labelUrdu: "شناختی کارڈ", type: "cnic", required: true, group: "Groom Details" },
    { name: "groomAddress", label: "Groom's Address", labelUrdu: "پتہ", type: "address", required: true, group: "Groom Details" },
    { name: "groomAge", label: "Groom's Age", labelUrdu: "عمر", type: "number", required: true, group: "Groom Details" },
    { name: "brideName", label: "Bride's Full Name", labelUrdu: "دلہن کا نام", type: "text", required: true, group: "Bride Details" },
    { name: "brideFatherName", label: "Bride's Father's Name", labelUrdu: "دلہن کے والد کا نام", type: "text", required: true, group: "Bride Details" },
    { name: "brideCnic", label: "Bride's CNIC", labelUrdu: "شناختی کارڈ", type: "cnic", required: true, group: "Bride Details" },
    { name: "brideAddress", label: "Bride's Address", labelUrdu: "پتہ", type: "address", required: true, group: "Bride Details" },
    { name: "brideAge", label: "Bride's Age", labelUrdu: "عمر", type: "number", required: true, group: "Bride Details" },
    { name: "marriageDate", label: "Date of Marriage", labelUrdu: "شادی کی تاریخ", type: "date", required: true, group: "Marriage Details" },
    { name: "marriagePlace", label: "Place of Marriage / Temple", labelUrdu: "شادی کا مقام / مندر", type: "text", required: true, group: "Marriage Details" },
    { name: "panditName", label: "Pandit/Priest Name", labelUrdu: "پنڈت کا نام", type: "text", required: true, group: "Marriage Details" },
    { name: "witness1", label: "Witness 1 Name & CNIC", labelUrdu: "گواہ 1", type: "text", required: true, group: "Witnesses" },
    { name: "witness2", label: "Witness 2 Name & CNIC", labelUrdu: "گواہ 2", type: "text", required: true, group: "Witnesses" },
  ],
  promptTemplate: `Generate a professional Hindu Marriage Registration Certificate under Hindu Marriage Act 2017 (Pakistan).
Groom: {groomName} s/o {groomFatherName}, CNIC: {groomCnic}, Age: {groomAge}, Address: {groomAddress}
Bride: {brideName} d/o {brideFatherName}, CNIC: {brideCnic}, Age: {brideAge}, Address: {brideAddress}
Marriage Date: {marriageDate}, Place/Temple: {marriagePlace}, Pandit: {panditName}
Witnesses: {witness1}, {witness2}
Include requirements under Hindu Marriage Act 2017 Sections 4-6. Marriage must be registered with relevant authority under Section 8.

REFERENCE FORMAT - Follow this exact Pakistani legal format:

HINDU MARRIAGE REGISTRATION CERTIFICATE

(Under Hindu Marriage Act 2017, Pakistan)

This is to certify that:

GROOM: [Groom Name] S/o [Father Name], CNIC No. [CNIC], Age: [Age], resident of [Address]
BRIDE: [Bride Name] D/o [Father Name], CNIC No. [CNIC], Age: [Age], resident of [Address]

Were joined in matrimony according to Hindu rites and ceremonies on [Date of Marriage] at [Place of Marriage].

Pandit / Officiating Priest: [Pandit Name]
Witnesses:
1. [Witness 1 Name], CNIC: ___________
2. [Witness 2 Name], CNIC: ___________

Registered under Section 8 of the Hindu Marriage Act 2017.
Registration No.: ___________ Date: ___________

Signature of Pandit: ___________
Signature of Registrar: ___________

INSTRUCTIONS:
- Title: HINDU MARRIAGE REGISTRATION CERTIFICATE (centered, bold)
- Reference Hindu Marriage Act 2017 Sections 4-6 and 8
- Include groom, bride, Pandit details
- Include witnesses
- Both parties sign
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
