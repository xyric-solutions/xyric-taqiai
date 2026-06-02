import { TemplateDefinition } from "../types";

export const bailApplication: TemplateDefinition = {
  category: "criminal-law",
  subType: "bail-application",
  name: "Bail Application / ضمانت کی درخواست",
  nameUrdu: "ضمانت کی درخواست",
  description: "Pre-arrest and post-arrest bail application under Section 497/498 CrPC",
  descriptionUrdu: "دفعہ 497/498 ضابطہ فوجداری کے تحت قبل از گرفتاری اور بعد از گرفتاری ضمانت کی درخواست",
  icon: "Shield",
  formFields: [
    {
      name: "accusedName",
      label: "Accused Name",
      labelUrdu: "ملزم کا نام",
      type: "text",
      required: true,
      group: "Accused Details",
    },
    {
      name: "accusedFatherName",
      label: "Accused Father's Name",
      labelUrdu: "ملزم کے والد کا نام",
      type: "text",
      required: true,
      group: "Accused Details",
    },
    {
      name: "accusedCnic",
      label: "Accused CNIC",
      labelUrdu: "ملزم کا شناختی کارڈ",
      type: "cnic",
      required: true,
      group: "Accused Details",
    },
    {
      name: "accusedAddress",
      label: "Accused Address",
      labelUrdu: "ملزم کا پتہ",
      type: "address",
      required: true,
      group: "Accused Details",
    },
    {
      name: "firNumber",
      label: "FIR Number",
      labelUrdu: "ایف آئی آر نمبر",
      type: "text",
      required: true,
      group: "FIR Details",
    },
    {
      name: "firDate",
      label: "FIR Date",
      labelUrdu: "ایف آئی آر کی تاریخ",
      type: "date",
      required: true,
      group: "FIR Details",
    },
    {
      name: "policeStation",
      label: "Police Station",
      labelUrdu: "تھانہ",
      type: "text",
      required: true,
      group: "FIR Details",
    },
    {
      name: "sectionsCharged",
      label: "Sections Charged (PPC/Other)",
      labelUrdu: "عائد دفعات (تعزیرات پاکستان/دیگر)",
      type: "text",
      required: true,
      group: "FIR Details",
    },
    {
      name: "bailType",
      label: "Bail Type",
      labelUrdu: "ضمانت کی قسم",
      type: "select",
      required: true,
      options: [
        { value: "pre-arrest", label: "Pre-Arrest Bail (Section 498 CrPC)", labelUrdu: "قبل از گرفتاری ضمانت (دفعہ 498)" },
        { value: "post-arrest", label: "Post-Arrest Bail (Section 497 CrPC)", labelUrdu: "بعد از گرفتاری ضمانت (دفعہ 497)" },
      ],
      group: "Bail Details",
    },
    {
      name: "groundsForBail",
      label: "Grounds for Bail",
      labelUrdu: "ضمانت کی بنیادیں",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Bail Details",
    },
    {
      name: "suretyName",
      label: "Surety Name",
      labelUrdu: "ضامن کا نام",
      type: "text",
      required: true,
      group: "Surety Details",
    },
    {
      name: "suretyCnic",
      label: "Surety CNIC",
      labelUrdu: "ضامن کا شناختی کارڈ",
      type: "cnic",
      required: true,
      group: "Surety Details",
    },
    {
      name: "suretyAddress",
      label: "Surety Address",
      labelUrdu: "ضامن کا پتہ",
      type: "address",
      required: false,
      group: "Surety Details",
    },
    {
      name: "suretyRelation",
      label: "Surety Relation with Accused",
      labelUrdu: "ضامن کا ملزم سے رشتہ",
      type: "text",
      required: false,
      group: "Surety Details",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a Bail Application in {{language}}.

ACCUSED (APPLICANT):
- Name: {{accusedName}}
- Father's Name: {{accusedFatherName}}
- CNIC: {{accusedCnic}}
- Address: {{accusedAddress}}

FIR DETAILS:
- FIR No: {{firNumber}}
- FIR Date: {{firDate}}
- Police Station: {{policeStation}}
- Sections Charged: {{sectionsCharged}}

BAIL DETAILS:
- Bail Type: {{bailType}}
- Grounds for Bail: {{groundsForBail}}

SURETY DETAILS:
- Surety Name: {{suretyName}}
- Surety CNIC: {{suretyCnic}}
- Surety Address: {{suretyAddress}}
- Relation with Accused: {{suretyRelation}}

REFERENCE FORMAT — Follow this exact Pakistani legal format:

IN THE COURT OF SESSIONS JUDGE / HON'BLE HIGH COURT AT [CITY]

APPLICATION UNDER SECTION 497/498, CODE OF CRIMINAL PROCEDURE 1898 FOR GRANT OF BAIL

IN THE MATTER OF:

State vs. [Accused Name]
FIR No. [FIR Number] dated [FIR Date]
Police Station: [Police Station]
Sections: [Sections Charged under PPC/Other Laws]

BAIL APPLICATION

[Accused Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
                                                                    ...APPLICANT/ACCUSED

THROUGH ADVOCATE

RESPECTFULLY SHEWETH:

1. That the applicant is an innocent person and has been falsely implicated in the above-mentioned FIR registered at [Police Station] on [FIR Date].
2. That the brief facts of the case are that [brief facts of the alleged incident].
3. That the applicant has been arrested / apprehended by the police on [Arrest Date] in connection with the said FIR.
4. That the applicant is entitled to bail on the following grounds:
   (i) [Ground 1 — false implication, lack of evidence, etc.]
   (ii) [Ground 2 — no recovery, no identification, etc.]
   (iii) [Ground 3 — bail-able offence / good conduct / family responsibilities / health]
5. That [Surety Name] S/o [Father Name], CNIC No. [Surety CNIC], [Relation], is ready to stand as surety for the applicant.
6. That the applicant undertakes that he/she will not abscond and will appear before the court on every date of hearing.

It is therefore most respectfully prayed that this Honourable Court may be pleased to:
(a) Admit the applicant to bail in the sum of PKR ____________ with one / two surety/sureties of like amount;
(b) Release the applicant from custody forthwith.

APPLICANT (ACCUSED)
[Name] S/o [Father Name]
CNIC: ___________

Advocate: ___________________
Bar No.: ___________________

INSTRUCTIONS:
- Court heading: IN THE COURT OF SESSIONS JUDGE / HIGH COURT AT [CITY]
- State vs. [Accused Name] case reference
- FIR details in header
- "RESPECTFULLY SHEWETH:" opening
- Numbered "That..." paragraphs with grounds
- Prayer clause with (a), (b) items
- Section 497 (post-arrest) or Section 498 (pre-arrest) reference
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
