import { TemplateDefinition } from "../types";

export const stayOrder: TemplateDefinition = {
  category: "civil-law",
  subType: "stay-order",
  name: "Stay Order Application / حکم امتناعی کی درخواست",
  nameUrdu: "حکم امتناعی کی درخواست",
  description: "Application for stay order / temporary injunction under Order XXXIX CPC",
  descriptionUrdu: "ضابطہ دیوانی آرڈر XXXIX کے تحت حکم امتناعی / عارضی حکم کی درخواست",
  icon: "ShieldCheck",
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
      name: "caseNumber",
      label: "Case Number (if any)",
      labelUrdu: "مقدمہ نمبر (اگر ہو)",
      type: "text",
      required: false,
      group: "Case Details",
    },
    {
      name: "orderChallenged",
      label: "Order / Action Being Challenged",
      labelUrdu: "چیلنج شدہ حکم / کارروائی",
      type: "textarea",
      required: true,
      group: "Case Details",
    },
    {
      name: "urgency",
      label: "Urgency / Irreparable Loss",
      labelUrdu: "فوری ضرورت / ناقابل تلافی نقصان",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Stay Order Details",
    },
    {
      name: "grounds",
      label: "Grounds for Stay Order",
      labelUrdu: "حکم امتناعی کی بنیادیں",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Stay Order Details",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a Stay Order Application in {{language}}.

APPLICANT:
- Name: {{applicantName}}
- Address: {{applicantAddress}}

RESPONDENT:
- Name: {{respondentName}}
- Address: {{respondentAddress}}

CASE DETAILS:
- Case Number: {{caseNumber}}
- Order/Action Challenged: {{orderChallenged}}

STAY ORDER DETAILS:
- Urgency/Irreparable Loss: {{urgency}}
- Grounds: {{grounds}}

Generate a complete Stay Order / Temporary Injunction Application under Order XXXIX Rules 1 and 2 of the Code of Civil Procedure 1908 as applicable in Pakistan.
Include pREFERENCE FORMAT - Follow this exact Pakistani legal format:

IN THE COURT OF [JUDGE] AT [CITY]

Suit No. _______ of 20___

APPLICATION UNDER ORDER XXXIX RULES 1 & 2 CPC FOR TEMPORARY INJUNCTION / STAY ORDER

[Applicant / Plaintiff Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
                                                    ...APPLICANT
VERSUS
[Respondent / Defendant Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
                                                    ...RESPONDENT

APPLICATION FOR TEMPORARY INJUNCTION / STAY ORDER

RESPECTFULLY SHEWETH:

1. That the Applicant has filed Suit No. ___ of 20___ against the Respondent in this Honourable Court for [Subject of Main Suit].
2. That the Applicant has a prima facie case as the Respondent is [Specific Threatened/Wrongful Act].
3. That if stay is not granted, the Applicant will suffer irreparable loss and injury as [Reason - property will be transferred / construction will be completed / rights will be extinguished].
4. That the balance of convenience lies in favor of granting the stay as the Respondent will not be prejudiced.
5. That no adequate alternative remedy exists except this application.

It is therefore most respectfully prayed that this Honourable Court may be pleased to:
(a) Grant an ad-interim stay / temporary injunction restraining the Respondent from [Specific Action] till the next date;
(b) On hearing, make the injunction absolute during pendency of the suit;
(c) Award costs of this application.

VERIFICATION:
Verified on oath at [City] that the contents are true and correct to the best of my knowledge.

Applicant:
[Name] S/o [Father Name]
CNIC: ___________

Advocate: ___________________

INSTRUCTIONS:
- Court heading: IN THE COURT OF [JUDGE] AT [CITY] (centered, bold)
- APPLICATION UNDER ORDER XXXIX RULES 1 & 2 CPC heading
- "RESPECTFULLY SHEWETH:" opening
- Numbered "That..." paragraphs: prima facie case, irreparable injury, balance of convenience
- Prayer clause with (a), (b), (c) items
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
