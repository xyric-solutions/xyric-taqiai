import { TemplateDefinition } from "../types";

export const maintenance: TemplateDefinition = {
  category: "family-law",
  subType: "maintenance",
  name: "Maintenance / Nafqa Application",
  nameUrdu: "نفقہ کی درخواست",
  description: "Maintenance application under Section 9 West Pakistan Family Courts Act 1964",
  descriptionUrdu: "ویسٹ پاکستان فیملی کورٹس ایکٹ 1964 کی دفعہ 9 کے تحت نفقہ کی درخواست",
  icon: "Scale",
  formFields: [
    {
      name: "applicantName",
      label: "Applicant's Name (Wife/Guardian)",
      labelUrdu: "درخواست گزار کا نام (بیوی/سرپرست)",
      type: "text",
      required: true,
      group: "Applicant Details",
    },
    {
      name: "applicantFatherName",
      label: "Applicant's Father/Husband Name",
      labelUrdu: "درخواست گزار کے والد/شوہر کا نام",
      type: "text",
      required: true,
      group: "Applicant Details",
    },
    {
      name: "applicantCnic",
      label: "Applicant's CNIC",
      labelUrdu: "درخواست گزار کا شناختی کارڈ",
      type: "cnic",
      required: true,
      group: "Applicant Details",
    },
    {
      name: "applicantAddress",
      label: "Applicant's Address",
      labelUrdu: "درخواست گزار کا پتہ",
      type: "address",
      required: true,
      group: "Applicant Details",
    },
    {
      name: "respondentName",
      label: "Respondent's Name (Husband/Father)",
      labelUrdu: "مدعا علیہ کا نام (شوہر/والد)",
      type: "text",
      required: true,
      group: "Respondent Details",
    },
    {
      name: "respondentCnic",
      label: "Respondent's CNIC",
      labelUrdu: "مدعا علیہ کا شناختی کارڈ",
      type: "cnic",
      required: false,
      group: "Respondent Details",
    },
    {
      name: "respondentAddress",
      label: "Respondent's Address",
      labelUrdu: "مدعا علیہ کا پتہ",
      type: "address",
      required: true,
      group: "Respondent Details",
    },
    {
      name: "marriageDate",
      label: "Date of Marriage",
      labelUrdu: "تاریخ نکاح",
      type: "date",
      required: true,
      group: "Marriage Details",
    },
    {
      name: "childrenDetails",
      label: "Children Names & Ages",
      labelUrdu: "بچوں کے نام اور عمریں",
      type: "textarea",
      required: false,
      group: "Children Details",
    },
    {
      name: "respondentIncome",
      label: "Monthly Income of Respondent (PKR)",
      labelUrdu: "مدعا علیہ کی ماہانہ آمدنی (روپے)",
      type: "number",
      required: true,
      group: "Financial Details",
    },
    {
      name: "currentMaintenance",
      label: "Current Maintenance Being Paid (PKR)",
      labelUrdu: "موجودہ نفقہ جو ادا ہو رہا ہے (روپے)",
      type: "number",
      required: false,
      group: "Financial Details",
    },
    {
      name: "requestedAmount",
      label: "Requested Maintenance Amount (PKR per month)",
      labelUrdu: "مطلوبہ نفقہ کی رقم (ماہانہ روپے)",
      type: "number",
      required: true,
      group: "Financial Details",
    },
    {
      name: "grounds",
      label: "Grounds for Maintenance",
      labelUrdu: "نفقہ کی بنیاد",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Case Details",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a Maintenance (Nafqa) Application in {{language}}.

APPLICANT:
- Name: {{applicantName}}
- Father/Husband Name: {{applicantFatherName}}
- CNIC: {{applicantCnic}}
- Address: {{applicantAddress}}

RESPONDENT:
- Name: {{respondentName}}
- CNIC: {{respondentCnic}}
- Address: {{respondentAddress}}

MARRIAGE DATE: {{marriageDate}}
CHILDREN: {{childrenDetails}}

FINANCIAL:
- Respondent's Monthly Income: PKR {{respondentIncome}}
- Current Maintenance: PKR {{currentMaintenance}}
- Requested Amount: PKR {{requestedAmount}}

GROUNDS: {{grounds}}

REFERENCE FORMAT — Follow this exact Pakistani legal format:

IN THE FAMILY COURT AT [CITY]
SUIT FOR MAINTENANCE / NAFQA

[Applicant Name] W/o [Husband Name], D/o [Father Name], CNIC No. [CNIC], resident of [Address]
                                                                    ...PLAINTIFF/APPLICANT

VERSUS

[Respondent Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
                                                                    ...DEFENDANT/RESPONDENT

SUIT FOR RECOVERY OF MAINTENANCE UNDER SECTION 9, WEST PAKISTAN FAMILY COURTS ACT 1964

RESPECTFULLY SHEWETH:

1. That the Plaintiff is the legally wedded wife of the Defendant having been married on [Marriage Date]. The Nikah was registered vide No. [Nikah Registration No.].
2. That out of the said wedlock the following children were born: [Children Details — Name, Age].
3. That the Defendant is a person of means earning approximately PKR [Respondent Income]/- per month and has the financial capacity to pay maintenance.
4. That the Defendant has failed and refused to pay maintenance to the Plaintiff and minor children despite being legally obligated to do so.
5. That the Plaintiff is in need of PKR [Requested Amount]/- per month as maintenance for herself and PKR [children maintenance] for each minor child.
6. That [additional grounds — desertion, cruelty, financial hardship, etc.].

It is therefore most respectfully prayed that this Honourable Court may be pleased to:
(a) Decree maintenance of PKR [Amount]/- per month in favour of the Plaintiff from the date of filing;
(b) Decree maintenance for each minor child;
(c) Award costs of the suit.

VERIFICATION:
Verified on oath at [City] that the contents are true and correct to the best of my knowledge.

Plaintiff:
[Applicant Name] W/o [Husband Name]
CNIC: ___________

Advocate: ___________________

INSTRUCTIONS:
- Court heading: IN THE FAMILY COURT AT [CITY]
- SUIT FOR MAINTENANCE heading
- Plaintiff and Respondent identification
- "RESPECTFULLY SHEWETH:" opening
- Numbered "That..." paragraphs
- Prayer clause with (a), (b), (c) items
- VERIFICATION paragraph
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
