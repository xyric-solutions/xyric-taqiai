import { TemplateDefinition } from "../types";

export const sikhMarriage: TemplateDefinition = {
  category: "non-muslim-laws",
  subType: "sikh-marriage",
  name: "Sikh Anand Karaj Marriage",
  nameUrdu: "سکھ آنند کارج شادی",
  description: "Marriage registration under Sikh Anand Karaj Marriage Act 2007/2018",
  descriptionUrdu: "سکھ آنند کارج میرج ایکٹ کے تحت شادی کی رجسٹریشن",
  icon: "Heart",
  formFields: [
    { name: "groomName", label: "Groom's Name", labelUrdu: "دولہا کا نام", type: "text", required: true, group: "Groom" },
    { name: "groomFatherName", label: "Father's Name", labelUrdu: "والد کا نام", type: "text", required: true, group: "Groom" },
    { name: "groomCnic", label: "CNIC", labelUrdu: "شناختی کارڈ", type: "cnic", required: true, group: "Groom" },
    { name: "groomAddress", label: "Address", labelUrdu: "پتہ", type: "address", required: true, group: "Groom" },
    { name: "brideName", label: "Bride's Name", labelUrdu: "دلہن کا نام", type: "text", required: true, group: "Bride" },
    { name: "brideFatherName", label: "Father's Name", labelUrdu: "والد کا نام", type: "text", required: true, group: "Bride" },
    { name: "brideCnic", label: "CNIC", labelUrdu: "شناختی کارڈ", type: "cnic", required: true, group: "Bride" },
    { name: "brideAddress", label: "Address", labelUrdu: "پتہ", type: "address", required: true, group: "Bride" },
    { name: "marriageDate", label: "Date of Marriage", labelUrdu: "شادی کی تاریخ", type: "date", required: true, group: "Details" },
    { name: "gurdwaraName", label: "Gurdwara Name & Location", labelUrdu: "گردوارہ کا نام", type: "text", required: true, group: "Details" },
    { name: "granthiName", label: "Granthi/Priest Name", labelUrdu: "گرنتھی کا نام", type: "text", required: true, group: "Details" },
    { name: "witness1", label: "Witness 1", labelUrdu: "گواہ 1", type: "text", required: true, group: "Witnesses" },
    { name: "witness2", label: "Witness 2", labelUrdu: "گواہ 2", type: "text", required: true, group: "Witnesses" },
  ],
  promptTemplate: `Generate a Sikh Anand Karaj Marriage Certificate under Sikh Anand Karaj Marriage Act 2007/2018 (Pakistan).
Groom: {groomName} s/o {groomFatherName}, CNIC: {groomCnic}, Address: {groomAddress}
Bride: {brideName} d/o {brideFatherName}, CNIC: {brideCnic}, Address: {brideAddress}
Date: {marriageDate}, Gurdwara: {gurdwaraName}, Granthi: {granthiName}
Witnesses: {witness1}, {witness2}

REFERENCE FORMAT - Follow this exact Pakistani legal format:

SIKH ANAND KARAJ MARRIAGE CERTIFICATE

(Under Sikh Anand Karaj Marriage Act 2018, Pakistan)

This is to certify that:

GROOM: [Groom Name] S/o [Father Name], CNIC No. [CNIC], Age: [Age], resident of [Address]
BRIDE: [Bride Name] D/o [Father Name], CNIC No. [CNIC], Age: [Age], resident of [Address]

Were joined in matrimony according to Sikh Anand Karaj ceremony on [Date of Marriage] at [Gurdwara Name], [City].

Granthi: [Granthi Name]
Witnesses:
1. [Witness 1 Name], CNIC: ___________
2. [Witness 2 Name], CNIC: ___________

Registered under the Sikh Anand Karaj Marriage Act 2018.
Certificate No.: ___________ Date: ___________

Signature of Granthi: ___________
Signature of Registrar: ___________

INSTRUCTIONS:
- Title: SIKH ANAND KARAJ MARRIAGE CERTIFICATE (centered, bold)
- Reference Sikh Anand Karaj Marriage Act 2018
- Include groom, bride, Granthi details
- Include witnesses and registration
- Both parties sign
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
