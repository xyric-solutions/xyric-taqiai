import { TemplateDefinition } from "../types";

export const visitationRights: TemplateDefinition = {
  category: "family-law",
  subType: "visitation-rights",
  name: "Visitation / Access Rights Application",
  nameUrdu: "ملاقات کے حقوق کی درخواست",
  description: "Application for visitation/access rights for non-custodial parent",
  descriptionUrdu: "غیر تحویلی والدین کے لیے ملاقات کے حقوق کی درخواست",
  icon: "Users",
  formFields: [
    {
      name: "applicantName",
      label: "Applicant's Name (Non-custodial Parent)",
      labelUrdu: "درخواست گزار کا نام (غیر تحویلی والد/والدہ)",
      type: "text",
      required: true,
      group: "Applicant Details",
    },
    {
      name: "applicantFatherName",
      label: "Applicant's Father's Name",
      labelUrdu: "درخواست گزار کے والد کا نام",
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
      label: "Respondent's Name (Custodial Parent)",
      labelUrdu: "مدعا علیہ کا نام (تحویلی والد/والدہ)",
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
      name: "childrenDetails",
      label: "Children Details (Names, Ages, Gender)",
      labelUrdu: "بچوں کی تفصیلات (نام، عمریں، جنس)",
      type: "textarea",
      required: true,
      group: "Children Details",
    },
    {
      name: "custodyOrderDetails",
      label: "Current Custody Order Details",
      labelUrdu: "موجودہ تحویل کے حکم کی تفصیلات",
      type: "textarea",
      required: true,
      group: "Custody Details",
    },
    {
      name: "requestedSchedule",
      label: "Requested Visitation Schedule",
      labelUrdu: "مطلوبہ ملاقات کا شیڈول",
      type: "textarea",
      required: true,
      group: "Visitation Details",
    },
    {
      name: "reason",
      label: "Reason for Seeking Visitation Rights",
      labelUrdu: "ملاقات کے حقوق حاصل کرنے کی وجہ",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Visitation Details",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a Visitation/Access Rights Application in {{language}}.

APPLICANT (NON-CUSTODIAL PARENT):
- Name: {{applicantName}}
- Father's Name: {{applicantFatherName}}
- CNIC: {{applicantCnic}}
- Address: {{applicantAddress}}

RESPONDENT (CUSTODIAL PARENT):
- Name: {{respondentName}}
- CNIC: {{respondentCnic}}
- Address: {{respondentAddress}}

CHILDREN: {{childrenDetails}}
CURRENT CUSTODY ORDER: {{custodyOrderDetails}}
REQUESTED VISITATION SCHEDULE: {{requestedSchedule}}
REASON: {{reason}}

Generate a complete Visitation/Access Rights Application under the Guardian and Wards Act 1890 and West Pakistan Family Courts Act 1964.
Emphasize the best interests of the child and tREFERENCE FORMAT - Follow this exact Pakistani legal format:

IN THE FAMILY COURT AT [CITY]

APPLICATION / PETITION NO. _______ OF 20___
(Under Section 25, Guardians and Wards Act 1890)

[Applicant Name] S/o / D/o [Father Name], CNIC No. [CNIC], resident of [Address]
                                                    ...APPLICANT
VERSUS
[Respondent Name] S/o / D/o [Father Name], CNIC No. [CNIC], resident of [Address]
                                                    ...RESPONDENT

APPLICATION FOR VISITATION RIGHTS / ACCESS TO MINOR CHILDREN

RESPECTFULLY SHEWETH:

1. That the Applicant and Respondent were married on [Nikah Date] and have the following minor children: [Children Names and Ages].
2. That the parties are now separated / divorced since [Date] and the minor children are in the custody of the Respondent.
3. That the Applicant, being the [father / mother] of the children, has a fundamental right to maintain a relationship with his/her children.
4. That the Respondent is denying the Applicant access to the children without lawful justification.
5. That it is in the best interest and welfare of the children to maintain contact with both parents.

It is therefore most respectfully prayed that this Honourable Court may be pleased to:
(a) Grant visitation rights to the Applicant every [Frequency - alternate weekend / specific days];
(b) Allow the Applicant to take the children for [Duration] on [Specific Days / Vacations];
(c) Any other appropriate visitation schedule as the Court deems fit in the interest of the children.

VERIFICATION:
Verified on oath at [City] that the contents are true and correct to the best of my knowledge.

Applicant:
[Name] S/o / D/o [Father Name]
CNIC: ___________

Advocate: ___________________

INSTRUCTIONS:
- Court heading: IN THE FAMILY COURT AT [CITY] (centered, bold)
- APPLICATION FOR VISITATION RIGHTS heading
- Reference Guardians and Wards Act 1890 Section 25
- "RESPECTFULLY SHEWETH:" opening
- Numbered "That..." paragraphs: marriage, custody situation, right of access
- Welfare of children as paramount consideration
- Prayer clause with (a), (b), (c) items with specific visitation schedule
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
