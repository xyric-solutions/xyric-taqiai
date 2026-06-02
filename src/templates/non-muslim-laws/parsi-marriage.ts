import { TemplateDefinition } from "../types";

export const parsiMarriage: TemplateDefinition = {
  category: "non-muslim-laws",
  subType: "parsi-marriage",
  name: "Parsi Marriage & Divorce",
  nameUrdu: "پارسی شادی و طلاق",
  description: "Marriage and divorce under Parsi Marriage and Divorce Act 1936",
  descriptionUrdu: "پارسی میرج اینڈ ڈائیورس ایکٹ 1936 کے تحت",
  icon: "Heart",
  formFields: [
    { name: "applicantName", label: "Applicant's Name", labelUrdu: "درخواست گزار", type: "text", required: true, group: "Applicant" },
    { name: "applicantCnic", label: "CNIC", labelUrdu: "شناختی کارڈ", type: "cnic", required: true, group: "Applicant" },
    { name: "applicantAddress", label: "Address", labelUrdu: "پتہ", type: "address", required: true, group: "Applicant" },
    { name: "spouseName", label: "Spouse's Name", labelUrdu: "شریک حیات کا نام", type: "text", required: true, group: "Spouse" },
    { name: "spouseCnic", label: "Spouse CNIC", labelUrdu: "شناختی کارڈ", type: "cnic", required: true, group: "Spouse" },
    { name: "marriageDate", label: "Date of Marriage", labelUrdu: "شادی کی تاریخ", type: "date", required: true, group: "Details" },
    { name: "documentType", label: "Document Type", labelUrdu: "دستاویز کی قسم", type: "select", required: true, group: "Details",
      options: [
        { value: "marriage-certificate", label: "Marriage Certificate" },
        { value: "divorce-petition", label: "Divorce Petition" },
        { value: "judicial-separation", label: "Judicial Separation" },
        { value: "nullity", label: "Nullity of Marriage" },
      ],
    },
    { name: "grounds", label: "Grounds (if divorce/separation)", labelUrdu: "وجوہات", type: "textarea", required: false, group: "Details" },
    { name: "witness1", label: "Witness 1", labelUrdu: "گواہ 1", type: "text", required: true, group: "Witnesses" },
    { name: "witness2", label: "Witness 2", labelUrdu: "گواہ 2", type: "text", required: true, group: "Witnesses" },
  ],
  promptTemplate: `Generate a professional legal document under Parsi Marriage and Divorce Act 1936 (Pakistan).
Type: {documentType}
Applicant: {applicantName}, CNIC: {applicantCnic}, Address: {applicantAddress}
Spouse: {spouseName}, CNIC: {spouseCnic}
Marriage Date: {marriageDate}
Grounds: {grounds}
Witnesses: {witness1}, {witness2}
Cite specific sections of Parsi Marriage and Divorce Act 1936.

REFERENCE FORMAT - Follow this exact Pakistani legal format:

PARSI MARRIAGE CERTIFICATE

(Under Parsi Marriage and Divorce Act 1936)

This is to certify that:

HUSBAND: [Husband Name] S/o [Father Name], CNIC No. [CNIC], Age: [Age], resident of [Address]
WIFE: [Wife Name] D/o [Father Name], CNIC No. [CNIC], Age: [Age], resident of [Address]

Were joined in Holy Matrimony according to Parsi Zoroastrian rites and ceremonies on [Date] at [Place].

Officiating Priest: [Priest Name]
Witnesses:
1. [Witness 1 Name], CNIC: ___________
2. [Witness 2 Name], CNIC: ___________

Registered under the Parsi Marriage and Divorce Act 1936.
Certificate No.: ___________ Date: ___________

INSTRUCTIONS:
- Title: PARSI MARRIAGE CERTIFICATE (centered, bold)
- Reference Parsi Marriage and Divorce Act 1936
- Include husband, wife, priest details
- Include witnesses and registration
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
