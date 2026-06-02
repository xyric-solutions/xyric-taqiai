import { TemplateDefinition } from "../types";

export const anticipatoryBail: TemplateDefinition = {
  category: "criminal-law",
  subType: "anticipatory-bail",
  name: "Anticipatory/Protective Bail / حفاظتی ضمانت",
  nameUrdu: "حفاظتی ضمانت",
  description: "Anticipatory/Protective bail application under Section 498 CrPC",
  descriptionUrdu: "دفعہ 498 ضابطہ فوجداری کے تحت حفاظتی ضمانت کی درخواست",
  icon: "Shield",
  formFields: [
    {
      name: "applicantName",
      label: "Applicant Name",
      labelUrdu: "درخواست گزار کا نام",
      type: "text",
      required: true,
      group: "Applicant Details",
    },
    {
      name: "applicantFatherName",
      label: "Applicant Father's Name",
      labelUrdu: "درخواست گزار کے والد کا نام",
      type: "text",
      required: true,
      group: "Applicant Details",
    },
    {
      name: "applicantCnic",
      label: "Applicant CNIC",
      labelUrdu: "درخواست گزار کا شناختی کارڈ",
      type: "cnic",
      required: true,
      group: "Applicant Details",
    },
    {
      name: "applicantAddress",
      label: "Applicant Address",
      labelUrdu: "درخواست گزار کا پتہ",
      type: "address",
      required: true,
      group: "Applicant Details",
    },
    {
      name: "applicantOccupation",
      label: "Applicant Occupation",
      labelUrdu: "درخواست گزار کا پیشہ",
      type: "text",
      required: false,
      group: "Applicant Details",
    },
    {
      name: "apprehensionReason",
      label: "Reason for Apprehension of Arrest",
      labelUrdu: "گرفتاری کے خدشے کی وجہ",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Apprehension Details",
    },
    {
      name: "firNumber",
      label: "FIR Number (if registered)",
      labelUrdu: "ایف آئی آر نمبر (اگر درج ہو)",
      type: "text",
      required: false,
      group: "FIR Details",
    },
    {
      name: "firDate",
      label: "FIR Date (if registered)",
      labelUrdu: "ایف آئی آر کی تاریخ (اگر درج ہو)",
      type: "date",
      required: false,
      group: "FIR Details",
    },
    {
      name: "policeStation",
      label: "Police Station",
      labelUrdu: "تھانہ",
      type: "text",
      required: false,
      group: "FIR Details",
    },
    {
      name: "sectionsApprehended",
      label: "Sections Apprehended/Charged",
      labelUrdu: "متوقع/عائد دفعات",
      type: "text",
      required: false,
      group: "FIR Details",
    },
    {
      name: "groundsForBail",
      label: "Grounds for Anticipatory Bail",
      labelUrdu: "حفاظتی ضمانت کی بنیادیں",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Bail Grounds",
    },
    {
      name: "malafideAllegation",
      label: "Details of Mala Fide/False Implication (if any)",
      labelUrdu: "بدنیتی/جھوٹے الزام کی تفصیلات (اگر ہوں)",
      type: "textarea",
      required: false,
      group: "Bail Grounds",
    },
    {
      name: "suretyDetails",
      label: "Surety Details",
      labelUrdu: "ضامن کی تفصیلات",
      type: "textarea",
      required: false,
      group: "Surety Details",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate an Anticipatory/Protective Bail Application in {{language}}.

APPLICANT:
- Name: {{applicantName}}
- Father's Name: {{applicantFatherName}}
- CNIC: {{applicantCnic}}
- Address: {{applicantAddress}}
- Occupation: {{applicantOccupation}}

APPREHENSION:
- Reason: {{apprehensionReason}}

FIR DETAILS (IF ANY):
- FIR No: {{firNumber}}
- FIR Date: {{firDate}}
- Police Station: {{policeStation}}
- Sections: {{sectionsApprehended}}

BAIL GROUNDS:
- Grounds: {{groundsForBail}}
- Mala Fide Allegations: {{malafideAllegation}}

SURETY:
{{suretyDetails}}

REFERENCE FORMAT — Follow this exact Pakistani legal format:

IN THE COURT OF SESSIONS JUDGE / HON'BLE HIGH COURT AT [CITY]

APPLICATION UNDER SECTION 498, CODE OF CRIMINAL PROCEDURE 1898 FOR GRANT OF PRE-ARREST / ANTICIPATORY BAIL

IN THE MATTER OF:

[Applicant Name] S/o [Father Name]         ...APPLICANT
VERSUS
The State                                   ...RESPONDENT

FIR No. [FIR Number] (if registered) dated [FIR Date]
Police Station: [Police Station]
Sections Apprehended: [Sections under PPC/Other Laws]

PRE-ARREST / ANTICIPATORY BAIL APPLICATION

RESPECTFULLY SHEWETH:

1. That the applicant [Applicant Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address], is a law-abiding citizen and has never been involved in any criminal activity.
2. That the applicant apprehends his/her arrest in connection with [apprehension reason / FIR No.] on account of [brief facts / mala fide implication].
3. That the applicant is being falsely implicated due to [details of mala fide / false implication / enmity].
4. That the grounds on which pre-arrest bail is sought are:
   (i) The applicant has been falsely implicated due to personal enmity;
   (ii) [Other ground — no recovery possible / not an absconder / cooperating with investigation];
   (iii) Bail is a rule and refusal is an exception as per settled law (PLD, SCMR).
5. That the applicant undertakes to join investigation whenever required and shall not flee from justice.
6. That [Surety Details] is ready to stand surety for the applicant.

It is therefore most respectfully prayed that this Honourable Court may be pleased to:
(a) Grant ad-interim pre-arrest bail to the applicant till the next date;
(b) On hearing, confirm the pre-arrest bail in the sum of PKR ____________;
(c) Direct the police not to arrest the applicant without prior notice.

Applicant:
[Name] S/o [Father Name]
CNIC: ___________

Advocate: ___________________
Bar No.: ___________________

INSTRUCTIONS:
- Court heading: IN THE COURT OF SESSIONS JUDGE / HIGH COURT AT [CITY]
- APPLICATION UNDER SECTION 498 CrPC heading
- Applicant vs State case structure
- "RESPECTFULLY SHEWETH:" opening
- Numbered "That..." paragraphs
- Prayer clause with (a), (b), (c) items
- Bail is rule, refusal exception principle
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
