import { TemplateDefinition } from "../types";

export const arbitrationApplication: TemplateDefinition = {
  category: "civil-law",
  subType: "arbitration-application",
  name: "Arbitration Application / ثالثی کی درخواست",
  nameUrdu: "ثالثی کی درخواست",
  description: "Application for arbitration under the Arbitration Act 1940",
  descriptionUrdu: "ثالثی ایکٹ 1940 کے تحت ثالثی کی درخواست",
  icon: "Scale",
  formFields: [
    {
      name: "applicantName",
      label: "Applicant's Name",
      labelUrdu: "درخواست گزار کا نام",
      type: "text",
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
      name: "applicantCnic",
      label: "Applicant's CNIC",
      labelUrdu: "درخواست گزار کا شناختی کارڈ",
      type: "cnic",
      required: true,
      group: "Applicant Details",
    },
    {
      name: "respondentName",
      label: "Respondent's Name",
      labelUrdu: "مدعا علیہ کا نام",
      type: "text",
      required: true,
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
      name: "dispute",
      label: "Nature of Dispute",
      labelUrdu: "تنازعے کی نوعیت",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Arbitration Details",
    },
    {
      name: "arbitrationClause",
      label: "Arbitration Clause Details",
      labelUrdu: "ثالثی شق کی تفصیلات",
      type: "textarea",
      required: true,
      group: "Arbitration Details",
    },
    {
      name: "relief",
      label: "Relief Sought",
      labelUrdu: "مطلوبہ ریلیف",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Arbitration Details",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate an Arbitration Application in {{language}}.

APPLICANT:
- Name: {{applicantName}}
- Address: {{applicantAddress}}
- CNIC: {{applicantCnic}}

RESPONDENT:
- Name: {{respondentName}}
- Address: {{respondentAddress}}

ARBITRATION DETAILS:
- Dispute: {{dispute}}
- Arbitration Clause: {{arbitrationClause}}
- Relief Sought: {{relief}}

Generate a complete Arbitration Application under the Arbitration Act 1940 as applicable in Pakistan.
Include proper couREFERENCE FORMAT - Follow this exact Pakistani legal format:

IN THE COURT OF DISTRICT JUDGE / CIVIL COURT AT [CITY]

APPLICATION UNDER SECTION 20, ARBITRATION ACT 1940

[Applicant Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
                                                    ...APPLICANT
VERSUS
[Respondent Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
                                                    ...RESPONDENT

APPLICATION FOR APPOINTMENT OF ARBITRATOR / REFERENCE TO ARBITRATION

RESPECTFULLY SHEWETH:

1. That the parties had entered into an agreement / contract dated [Date] containing an arbitration clause / a separate Arbitration Agreement dated [Date].
2. That a dispute has arisen between the parties regarding [Subject Matter of Dispute] amounting to PKR [Amount].
3. That the Applicant has invoked the arbitration clause and requested the Respondent to appoint an arbitrator, but the Respondent has failed / refused to do so.
4. That the Applicant is entitled under Section 20 of the Arbitration Act 1940 to seek appointment of an arbitrator by this Honourable Court.
5. That this Court has jurisdiction to entertain this application as [Reason for Jurisdiction].

It is therefore most respectfully prayed that this Honourable Court may be pleased to:
(a) Appoint [Proposed Arbitrator Name] or any other suitable person as arbitrator;
(b) Direct the parties to proceed with arbitration;
(c) Award costs of this application.

VERIFICATION:
Verified on oath at [City] that the contents are true and correct to the best of my knowledge.

Applicant:
[Name] S/o [Father Name]
CNIC: ___________

Advocate: ___________________
Bar No.: ___________________

INSTRUCTIONS:
- Court heading: IN THE COURT OF DISTRICT JUDGE AT [CITY] (centered, bold)
- Applicant vs Respondent identification
- "RESPECTFULLY SHEWETH:" opening
- Numbered "That..." paragraphs
- Prayer clause with (a), (b), (c) items
- Reference Arbitration Act 1940 Section 20
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
