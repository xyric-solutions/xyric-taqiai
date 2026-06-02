import { TemplateDefinition } from "../types";

export const christianDivorce: TemplateDefinition = {
  category: "non-muslim-laws",
  subType: "christian-divorce",
  name: "Christian Divorce Petition",
  nameUrdu: "مسیحی طلاق کی درخواست",
  description: "Divorce petition under Divorce Act 1869 for Christians",
  descriptionUrdu: "ڈائیورس ایکٹ 1869 کے تحت مسیحی طلاق کی درخواست",
  icon: "FileX",
  formFields: [
    { name: "petitionerName", label: "Petitioner's Name", labelUrdu: "درخواست گزار کا نام", type: "text", required: true, group: "Petitioner" },
    { name: "petitionerCnic", label: "Petitioner's CNIC", labelUrdu: "شناختی کارڈ", type: "cnic", required: true, group: "Petitioner" },
    { name: "petitionerAddress", label: "Petitioner's Address", labelUrdu: "پتہ", type: "address", required: true, group: "Petitioner" },
    { name: "respondentName", label: "Respondent's Name", labelUrdu: "مدعا علیہ کا نام", type: "text", required: true, group: "Respondent" },
    { name: "respondentCnic", label: "Respondent's CNIC", labelUrdu: "شناختی کارڈ", type: "cnic", required: true, group: "Respondent" },
    { name: "respondentAddress", label: "Respondent's Address", labelUrdu: "پتہ", type: "address", required: true, group: "Respondent" },
    { name: "marriageDate", label: "Date of Marriage", labelUrdu: "شادی کی تاریخ", type: "date", required: true, group: "Marriage Details" },
    { name: "marriagePlace", label: "Place of Marriage", labelUrdu: "شادی کا مقام", type: "text", required: true, group: "Marriage Details" },
    { name: "groundsForDivorce", label: "Grounds for Divorce", labelUrdu: "طلاق کی وجوہات", type: "select", required: true, group: "Divorce Details",
      options: [
        { value: "adultery", label: "Adultery (Section 10)" },
        { value: "conversion", label: "Conversion to another religion (Section 10)" },
        { value: "cruelty", label: "Cruelty (Section 10-A)" },
        { value: "desertion", label: "Desertion for 2+ years (Section 10-A)" },
        { value: "unsoundMind", label: "Unsound mind for 2+ years (Section 10-A)" },
        { value: "imprisonment", label: "Imprisonment for 7+ years (Section 10-A)" },
        { value: "notHeard", label: "Not heard alive for 7+ years (Section 10-A)" },
        { value: "mutual", label: "Mutual Consent" },
      ],
    },
    { name: "children", label: "Number of Children", labelUrdu: "بچوں کی تعداد", type: "number", required: false, group: "Divorce Details" },
    { name: "facts", label: "Brief Facts of the Case", labelUrdu: "مقدمے کے حقائق", type: "textarea", required: true, group: "Divorce Details" },
  ],
  promptTemplate: `Generate a professional Divorce Petition under Divorce Act 1869 (Pakistan) for a Christian petitioner.
Petitioner: {petitionerName}, CNIC: {petitionerCnic}, Address: {petitionerAddress}
Respondent: {respondentName}, CNIC: {respondentCnic}, Address: {respondentAddress}
Marriage Date: {marriageDate}, Place: {marriagePlace}
Grounds: {groundsForDivorce}, Children: {children}
Facts: {facts}
File in Family Court / District Court. Cite specific sections of Divorce Act 1869.

REFERENCE FORMAT - Follow this exact Pakistani legal format:

IN THE FAMILY COURT / DISTRICT COURT AT [CITY]

DIVORCE PETITION NO. _______ OF 20___
(Under Sections 7/10/14, Divorce Act 1869)

[Petitioner Name] S/o / D/o [Father Name], CNIC No. [CNIC], resident of [Address]
                                                    ...PETITIONER
VERSUS
[Respondent Name] S/o / D/o [Father Name], CNIC No. [CNIC]
                                                    ...RESPONDENT

RESPECTFULLY SHEWETH:

1. That the parties are Christians and were married on [Date] at [Church Name], [City].
2. That grounds for divorce under the Divorce Act 1869 exist as follows: [Grounds - adultery / desertion / cruelty / unsound mind].
3. That the parties have been separated since [Date] and reconciliation is not possible.
4. That the Petitioner prays for dissolution of marriage under Section [7/10/14] of the Divorce Act 1869.

PRAYER:
(a) Dissolve the marriage under the Divorce Act 1869;
(b) Grant custody of children and maintenance;
(c) Any other appropriate relief.

INSTRUCTIONS:
- Court heading: IN THE DISTRICT COURT AT [CITY] (centered, bold)
- Divorce Act 1869 reference with specific sections
- "RESPECTFULLY SHEWETH:" opening
- Include grounds for divorce under the Act
- Prayer clause with (a), (b), (c) items
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
