import { TemplateDefinition } from "../types";

export const contemptPetition: TemplateDefinition = {
  category: "constitutional-law",
  subType: "contempt-petition",
  name: "Contempt of Court Petition / توہین عدالت کی درخواست",
  nameUrdu: "توہین عدالت کی درخواست",
  description: "Contempt of court petition under the Contempt of Court Ordinance 2003",
  descriptionUrdu: "توہین عدالت آرڈیننس 2003 کے تحت توہین عدالت کی درخواست",
  icon: "AlertTriangle",
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
      name: "contemnorName",
      label: "Contemnor's Name (Person in Contempt)",
      labelUrdu: "ملزم توہین کا نام",
      type: "text",
      required: true,
      group: "Contemnor Details",
    },
    {
      name: "contemnorDesignation",
      label: "Contemnor's Designation / Position",
      labelUrdu: "ملزم توہین کا عہدہ / حیثیت",
      type: "text",
      required: true,
      group: "Contemnor Details",
    },
    {
      name: "contemnorAddress",
      label: "Contemnor's Address",
      labelUrdu: "ملزم توہین کا پتہ",
      type: "address",
      required: true,
      group: "Contemnor Details",
    },
    {
      name: "courtOrderViolated",
      label: "Court Order Violated (Details)",
      labelUrdu: "خلاف ورزی شدہ عدالتی حکم (تفصیلات)",
      type: "textarea",
      required: true,
      group: "Contempt Details",
    },
    {
      name: "orderDate",
      label: "Date of Court Order",
      labelUrdu: "عدالتی حکم کی تاریخ",
      type: "date",
      required: true,
      group: "Contempt Details",
    },
    {
      name: "violationDetails",
      label: "Details of Violation / Non-Compliance",
      labelUrdu: "خلاف ورزی / عدم تعمیل کی تفصیلات",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Contempt Details",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a Contempt of Court Petition in {{language}}.

APPLICANT:
- Name: {{applicantName}}
- Address: {{applicantAddress}}
- CNIC: {{applicantCnic}}

CONTEMNOR:
- Name: {{contemnorName}}
- Designation: {{contemnorDesignation}}
- Address: {{contemnorAddress}}

CONTEMPT DETAILS:
- Court Order Violated: {{courtOrderViolated}}
- Order Date: {{orderDate}}
- Violation Details: {{violationDetails}}

Generate a complete Contempt of Court Petition under the Contempt of Court Ordinance 2003 and Article 204 of the Constitution of Pakistan 1973.
Include proper court heading, original order details, willful disobedienceREFERENCE FORMAT - Follow this exact Pakistani legal format:

IN THE HIGH COURT OF [PROVINCE] AT [CITY]

CONTEMPT PETITION NO. _______ OF 20___
(Under Article 204 of the Constitution and Contempt of Court Ordinance 2003)

[Petitioner Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
                                                    ...PETITIONER
VERSUS
[Respondent Name], [Designation], [Address]
                                                    ...RESPONDENT

PETITION FOR INITIATION OF CONTEMPT PROCEEDINGS

RESPECTFULLY SHEWETH:

1. That this Honourable Court / the Supreme Court had passed an order / judgment dated [Order Date] in [Case No.] directing the Respondent to [Specific Direction].
2. That despite the said order, the Respondent has willfully failed / refused to comply with the same till date.
3. That the non-compliance of the said order by the Respondent constitutes willful contempt of court.
4. That the Petitioner drew the attention of the Respondent to the order on [Date] but no compliance has been made.
5. That this is a fit case for initiation of contempt proceedings under Article 204 of the Constitution.

It is therefore most respectfully prayed that this Honourable Court may be pleased to:
(a) Initiate contempt proceedings against the Respondent;
(b) Direct the Respondent to comply with the order dated [Date] forthwith;
(c) Impose appropriate punishment for contempt;
(d) Award costs of this petition.

VERIFICATION:
Verified on oath at [City] that the contents are true and correct to the best of my knowledge.

Petitioner:
[Name] S/o [Father Name]
CNIC: ___________

Advocate: ___________________

INSTRUCTIONS:
- Court heading: IN THE HIGH COURT OF [PROVINCE] AT [CITY] (centered, bold)
- CONTEMPT PETITION heading
- Article 204 Constitution reference
- "RESPECTFULLY SHEWETH:" opening
- Numbered "That..." paragraphs with non-compliance details
- Prayer clause with (a), (b), (c), (d) items
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
