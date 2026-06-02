import { TemplateDefinition } from "../types";

export const injunctionApplication: TemplateDefinition = {
  category: "property-law",
  subType: "injunction-application",
  name: "Temporary Injunction Application / عارضی حکم امتناعی کی درخواست",
  nameUrdu: "عارضی حکم امتناعی کی درخواست",
  description: "Application for temporary injunction under Order XXXIX Rules 1 & 2 CPC",
  descriptionUrdu: "ضابطہ دیوانی آرڈر XXXIX قواعد 1 و 2 کے تحت عارضی حکم امتناعی کی درخواست",
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
      name: "propertyDescription",
      label: "Property Description",
      labelUrdu: "جائیداد کی تفصیل",
      type: "textarea",
      required: true,
      group: "Property Details",
    },
    {
      name: "propertyAddress",
      label: "Property Address",
      labelUrdu: "جائیداد کا پتہ",
      type: "address",
      required: true,
      group: "Property Details",
    },
    {
      name: "threat",
      label: "Nature of Threat / Apprehended Action",
      labelUrdu: "خطرے کی نوعیت / متوقع کارروائی",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Injunction Details",
    },
    {
      name: "urgency",
      label: "Urgency / Irreparable Loss",
      labelUrdu: "فوری ضرورت / ناقابل تلافی نقصان",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Injunction Details",
    },
    {
      name: "facts",
      label: "Facts of the Case",
      labelUrdu: "مقدمے کے حقائق",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Injunction Details",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a Temporary Injunction Application in {{language}}.

APPLICANT:
- Name: {{applicantName}}
- CNIC: {{applicantCnic}}
- Address: {{applicantAddress}}

RESPONDENT:
- Name: {{respondentName}}
- Address: {{respondentAddress}}

PROPERTY DETAILS:
- Description: {{propertyDescription}}
- Address: {{propertyAddress}}

INJUNCTION DETAILS:
- Threat: {{threat}}
- Urgency / Irreparable Loss: {{urgency}}
- Facts: {{facts}}

Generate a complete Application for Temporary Injunction under Order XXXIX Rules 1 & 2 of the Code of Civil Procedure 1908 as applicable in Pakistan.
Include proper court heading, case title, applicant's pREFERENCE FORMAT - Follow this exact Pakistani legal format:

IN THE COURT OF [CIVIL JUDGE / DISTRICT JUDGE] AT [CITY]

Suit No. _______ of 20___

APPLICATION UNDER ORDER XXXIX RULES 1 & 2 CPC FOR PERMANENT / TEMPORARY INJUNCTION

[Applicant / Plaintiff Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
                                                    ...APPLICANT
VERSUS
[Respondent / Defendant Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
                                                    ...RESPONDENT

APPLICATION FOR INJUNCTION RESTRAINING DISPOSITION/ALIENATION OF PROPERTY

RESPECTFULLY SHEWETH:

1. That the Applicant is the rightful owner / co-owner of property at [Property Address], Khasra/Plot No. [Number].
2. That the Respondent is about to [sell / transfer / construct / damage] the said property illegally.
3. That the Applicant has a prima facie case to protect his/her rights in the said property.
4. That if injunction is not granted, the Applicant will suffer irreparable loss as [Reason].
5. That the balance of convenience lies in favor of the Applicant.

It is therefore prayed that this Honourable Court may:
(a) Grant a temporary injunction restraining the Respondent from [Specific Act] till the next date;
(b) On hearing, make the injunction permanent;
(c) Award costs of this application.

VERIFICATION:
Verified on oath at [City] that the contents are true and correct to the best of my knowledge.

Applicant: ___________
Advocate: ___________________

INSTRUCTIONS:
- Court heading: IN THE COURT OF [JUDGE] AT [CITY] (centered, bold)
- ORDER XXXIX RULES 1 & 2 CPC reference
- Prima facie case, irreparable injury, balance of convenience
- "RESPECTFULLY SHEWETH:" opening
- Prayer clause with (a), (b), (c) items
- Include VERIFICATION paragraph
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
