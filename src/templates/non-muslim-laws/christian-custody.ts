import { TemplateDefinition } from "../types";

export const christianCustody: TemplateDefinition = {
  category: "non-muslim-laws",
  subType: "christian-custody",
  name: "Child Custody (Christian)",
  nameUrdu: "بچوں کی تحویل (مسیحی)",
  description: "Custody petition for Christian families under Guardians & Wards Act 1890",
  descriptionUrdu: "گارڈینز اینڈ وارڈز ایکٹ 1890 کے تحت مسیحی خاندان میں بچوں کی تحویل",
  icon: "Users",
  formFields: [
    { name: "petitionerName", label: "Petitioner's Name", labelUrdu: "درخواست گزار", type: "text", required: true, group: "Petitioner" },
    { name: "petitionerCnic", label: "CNIC", labelUrdu: "شناختی کارڈ", type: "cnic", required: true, group: "Petitioner" },
    { name: "petitionerAddress", label: "Address", labelUrdu: "پتہ", type: "address", required: true, group: "Petitioner" },
    { name: "respondentName", label: "Respondent's Name", labelUrdu: "مدعا علیہ", type: "text", required: true, group: "Respondent" },
    { name: "respondentAddress", label: "Respondent's Address", labelUrdu: "پتہ", type: "address", required: true, group: "Respondent" },
    { name: "childName", label: "Child's Name", labelUrdu: "بچے کا نام", type: "text", required: true, group: "Child Details" },
    { name: "childAge", label: "Child's Age", labelUrdu: "بچے کی عمر", type: "number", required: true, group: "Child Details" },
    { name: "marriageDate", label: "Marriage Date", labelUrdu: "شادی کی تاریخ", type: "date", required: true, group: "Marriage Details" },
    { name: "separationDate", label: "Date of Separation", labelUrdu: "علیحدگی کی تاریخ", type: "date", required: false, group: "Marriage Details" },
    { name: "grounds", label: "Grounds for Custody", labelUrdu: "تحویل کی وجوہات", type: "textarea", required: true, group: "Case Details" },
  ],
  promptTemplate: `Generate a Child Custody Petition for a Christian family under Guardians & Wards Act 1890 (Pakistan).
Petitioner: {petitionerName}, CNIC: {petitionerCnic}, Address: {petitionerAddress}
Respondent: {respondentName}, Address: {respondentAddress}
Child: {childName}, Age: {childAge}
Marriage: {marriageDate}, Separation: {separationDate}
Grounds: {grounds}
Cite Section 17 - welfare of child is paramount. File in Family Court / District Court.

REFERENCE FORMAT - Follow this exact Pakistani legal format:

IN THE FAMILY COURT / DISTRICT COURT AT [CITY]

GUARDIANSHIP PETITION NO. _______ OF 20___
(Under Sections 7, 10 & 17, Guardians and Wards Act 1890)

[Petitioner Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
                                                    ...PETITIONER
VERSUS
[Respondent Name] S/o [Father Name], CNIC No. [CNIC]
                                                    ...RESPONDENT

CHILD: [Child Name], Date of Birth: [DOB], Age: [Age]

RESPECTFULLY SHEWETH:

1. That the parties are Christian citizens married on [Date] at [Church Name].
2. That they separated on [Date] and have a minor child [Child Name] aged [Age].
3. That the welfare of the minor child is best served by granting custody to the Petitioner.
4. That Section 17, Guardians and Wards Act 1890 makes welfare of the child the paramount consideration.

PRAYER:
(a) Grant custody of [Child Name] to the Petitioner;
(b) Grant visitation rights to the Respondent;
(c) Any other appropriate relief.

INSTRUCTIONS:
- Court heading: IN THE FAMILY COURT AT [CITY] (centered, bold)
- Guardians and Wards Act 1890 reference
- "RESPECTFULLY SHEWETH:" opening
- Welfare of child as paramount (Section 17)
- Prayer clause with (a), (b), (c) items
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
