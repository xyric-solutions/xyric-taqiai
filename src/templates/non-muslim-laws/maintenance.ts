import { TemplateDefinition } from "../types";

export const nonMuslimMaintenance: TemplateDefinition = {
  category: "non-muslim-laws",
  subType: "maintenance",
  name: "Maintenance Application (Non-Muslim)",
  nameUrdu: "نان نفقہ کی درخواست (غیر مسلم)",
  description: "Maintenance suit under Family Courts Act 1964 & CrPC Section 488",
  descriptionUrdu: "فیملی کورٹ ایکٹ 1964 اور CrPC سیکشن 488 کے تحت نفقہ",
  icon: "Scale",
  formFields: [
    { name: "applicantName", label: "Applicant's Name", labelUrdu: "درخواست گزار", type: "text", required: true, group: "Applicant" },
    { name: "applicantCnic", label: "CNIC", labelUrdu: "شناختی کارڈ", type: "cnic", required: true, group: "Applicant" },
    { name: "applicantAddress", label: "Address", labelUrdu: "پتہ", type: "address", required: true, group: "Applicant" },
    { name: "religion", label: "Religion", labelUrdu: "مذہب", type: "select", required: true, group: "Applicant",
      options: [
        { value: "christian", label: "Christian" },
        { value: "hindu", label: "Hindu" },
        { value: "sikh", label: "Sikh" },
        { value: "parsi", label: "Parsi" },
        { value: "other", label: "Other" },
      ],
    },
    { name: "respondentName", label: "Respondent's Name", labelUrdu: "مدعا علیہ", type: "text", required: true, group: "Respondent" },
    { name: "respondentAddress", label: "Address", labelUrdu: "پتہ", type: "address", required: true, group: "Respondent" },
    { name: "respondentIncome", label: "Respondent's Approximate Income", labelUrdu: "مدعا علیہ کی تخمینی آمدنی", type: "text", required: true, group: "Respondent" },
    { name: "marriageDate", label: "Date of Marriage", labelUrdu: "شادی کی تاریخ", type: "date", required: true, group: "Details" },
    { name: "children", label: "Children Details (names & ages)", labelUrdu: "بچوں کی تفصیلات", type: "textarea", required: false, group: "Details" },
    { name: "maintenanceAmount", label: "Monthly Maintenance Claimed", labelUrdu: "ماہانہ نفقہ کی رقم", type: "text", required: true, group: "Details" },
    { name: "facts", label: "Brief Facts", labelUrdu: "مختصر حقائق", type: "textarea", required: true, group: "Details" },
  ],
  promptTemplate: `Generate a Maintenance Application for a non-Muslim applicant in Pakistan.
Applicant: {applicantName}, CNIC: {applicantCnic}, Address: {applicantAddress}, Religion: {religion}
Respondent: {respondentName}, Address: {respondentAddress}, Income: {respondentIncome}
Marriage: {marriageDate}, Children: {children}
Claimed Amount: {maintenanceAmount}
Facts: {facts}
File under Section 488 CrPC (for all citizens) and/or Family Courts Act 1964. For Christians also cite Divorce Act 1869 Section 36-37 for alimony.

REFERENCE FORMAT - Follow this exact Pakistani legal format:

IN THE FAMILY COURT AT [CITY]

APPLICATION FOR MAINTENANCE
(Under Section 488 CrPC / Section 9, West Pakistan Family Courts Act 1964)

[Applicant Name] D/o / W/o [Father Name], CNIC No. [CNIC], Religion: [Religion], resident of [Address]
                                                    ...APPLICANT
VERSUS
[Respondent Name] S/o [Father Name], CNIC No. [CNIC]
                                                    ...RESPONDENT

RESPECTFULLY SHEWETH:

1. That the Applicant and Respondent are related as [wife / mother / daughter] of the Respondent.
2. That the Respondent is legally obligated to maintain the Applicant but has failed / refused to do so.
3. That the Applicant has no independent source of income and requires maintenance of PKR [Amount]/- per month.
4. That Section 488 CrPC applies to all citizens regardless of religion.

PRAYER:
(a) Order maintenance of PKR [Amount]/- per month;
(b) Order arrears of maintenance;
(c) Any other appropriate relief.

INSTRUCTIONS:
- Court heading: IN THE FAMILY COURT AT [CITY] (centered, bold)
- Reference Section 488 CrPC (applicable to all citizens)
- "RESPECTFULLY SHEWETH:" opening
- Prayer clause with (a), (b), (c) items
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
