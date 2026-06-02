import { TemplateDefinition } from "../types";

export const hinduDivorce: TemplateDefinition = {
  category: "non-muslim-laws",
  subType: "hindu-divorce",
  name: "Hindu Divorce Petition",
  nameUrdu: "ہندو طلاق کی درخواست",
  description: "Divorce petition under Hindu Marriage Act 2017",
  descriptionUrdu: "ہندو میرج ایکٹ 2017 کے تحت طلاق",
  icon: "FileX",
  formFields: [
    { name: "petitionerName", label: "Petitioner's Name", labelUrdu: "درخواست گزار", type: "text", required: true, group: "Petitioner" },
    { name: "petitionerCnic", label: "CNIC", labelUrdu: "شناختی کارڈ", type: "cnic", required: true, group: "Petitioner" },
    { name: "petitionerAddress", label: "Address", labelUrdu: "پتہ", type: "address", required: true, group: "Petitioner" },
    { name: "respondentName", label: "Respondent's Name", labelUrdu: "مدعا علیہ", type: "text", required: true, group: "Respondent" },
    { name: "respondentCnic", label: "CNIC", labelUrdu: "شناختی کارڈ", type: "cnic", required: true, group: "Respondent" },
    { name: "respondentAddress", label: "Address", labelUrdu: "پتہ", type: "address", required: true, group: "Respondent" },
    { name: "marriageDate", label: "Date of Marriage", labelUrdu: "شادی کی تاریخ", type: "date", required: true, group: "Marriage" },
    { name: "marriagePlace", label: "Place of Marriage", labelUrdu: "شادی کا مقام", type: "text", required: true, group: "Marriage" },
    { name: "grounds", label: "Grounds for Divorce", labelUrdu: "طلاق کی وجوہات", type: "select", required: true, group: "Case Details",
      options: [
        { value: "cruelty", label: "Cruelty" },
        { value: "desertion", label: "Desertion for 2+ years" },
        { value: "conversion", label: "Conversion to another religion" },
        { value: "unsoundMind", label: "Unsound mind" },
        { value: "notHeard", label: "Not heard alive for 7+ years" },
        { value: "mutual", label: "Mutual Consent" },
      ],
    },
    { name: "facts", label: "Brief Facts", labelUrdu: "مختصر حقائق", type: "textarea", required: true, group: "Case Details" },
    { name: "children", label: "Number of Children", labelUrdu: "بچوں کی تعداد", type: "number", required: false, group: "Case Details" },
  ],
  promptTemplate: `Generate a Hindu Divorce Petition under Hindu Marriage Act 2017 (Pakistan).
Petitioner: {petitionerName}, CNIC: {petitionerCnic}, Address: {petitionerAddress}
Respondent: {respondentName}, CNIC: {respondentCnic}, Address: {respondentAddress}
Marriage: {marriageDate}, Place: {marriagePlace}
Grounds: {grounds}, Children: {children}
Facts: {facts}
File in Family Court. Cite Hindu Marriage Act 2017 Section 12 for divorce grounds.

REFERENCE FORMAT - Follow this exact Pakistani legal format:

IN THE FAMILY COURT AT [CITY]

DIVORCE PETITION NO. _______ OF 20___
(Under Section 12, Hindu Marriage Act 2017, Pakistan)

[Petitioner Name] S/o / D/o [Father Name], CNIC No. [CNIC], Religion: Hindu, resident of [Address]
                                                    ...PETITIONER
VERSUS
[Respondent Name] S/o / D/o [Father Name], CNIC No. [CNIC]
                                                    ...RESPONDENT

RESPECTFULLY SHEWETH:

1. That the parties are Hindus and were married on [Date] at [Place] as per Hindu rites and customs.
2. That the marriage was registered under the Hindu Marriage Act 2017 / is solemnized as per tradition.
3. That grounds for divorce under Section 12 of the Hindu Marriage Act 2017 exist: [Grounds - adultery / desertion / cruelty / conversion / mental disorder].
4. That reconciliation has been attempted but has failed.

PRAYER:
(a) Dissolve the marriage under Section 12 Hindu Marriage Act 2017;
(b) Award custody and maintenance as appropriate;
(c) Any other appropriate relief.

INSTRUCTIONS:
- Court heading: IN THE FAMILY COURT AT [CITY] (centered, bold)
- Hindu Marriage Act 2017 Section 12 reference
- Include grounds for divorce per the Act
- "RESPECTFULLY SHEWETH:" opening
- Prayer clause with (a), (b), (c) items
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
