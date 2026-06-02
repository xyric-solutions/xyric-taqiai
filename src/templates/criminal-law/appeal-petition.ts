import { TemplateDefinition } from "../types";

export const appealPetition: TemplateDefinition = {
  category: "criminal-law",
  subType: "appeal-petition",
  name: "Criminal Appeal Petition / فوجداری اپیل کی درخواست",
  nameUrdu: "فوجداری اپیل کی درخواست",
  description: "Criminal appeal against conviction before appellate court",
  descriptionUrdu: "اپیلیٹ عدالت میں سزا کے خلاف فوجداری اپیل",
  icon: "Scale",
  formFields: [
    {
      name: "appellantName",
      label: "Appellant (Convicted Person) Name",
      labelUrdu: "اپیل کنندہ (سزا یافتہ) کا نام",
      type: "text",
      required: true,
      group: "Appellant Details",
    },
    {
      name: "appellantFatherName",
      label: "Appellant Father's Name",
      labelUrdu: "اپیل کنندہ کے والد کا نام",
      type: "text",
      required: true,
      group: "Appellant Details",
    },
    {
      name: "appellantCnic",
      label: "Appellant CNIC",
      labelUrdu: "اپیل کنندہ کا شناختی کارڈ",
      type: "cnic",
      required: true,
      group: "Appellant Details",
    },
    {
      name: "appellantAddress",
      label: "Appellant Address",
      labelUrdu: "اپیل کنندہ کا پتہ",
      type: "address",
      required: true,
      group: "Appellant Details",
    },
    {
      name: "caseNumberTrial",
      label: "Trial Court Case Number",
      labelUrdu: "ٹرائل کورٹ مقدمہ نمبر",
      type: "text",
      required: true,
      group: "Case Details",
    },
    {
      name: "trialCourt",
      label: "Trial Court Name",
      labelUrdu: "ٹرائل کورٹ کا نام",
      type: "text",
      required: true,
      group: "Case Details",
    },
    {
      name: "firNumber",
      label: "FIR Number",
      labelUrdu: "ایف آئی آر نمبر",
      type: "text",
      required: true,
      group: "Case Details",
    },
    {
      name: "policeStation",
      label: "Police Station",
      labelUrdu: "تھانہ",
      type: "text",
      required: true,
      group: "Case Details",
    },
    {
      name: "convictionDate",
      label: "Date of Conviction",
      labelUrdu: "سزا کی تاریخ",
      type: "date",
      required: true,
      group: "Conviction Details",
    },
    {
      name: "convictionSections",
      label: "Sections Under Which Convicted",
      labelUrdu: "جن دفعات کے تحت سزا ہوئی",
      type: "text",
      required: true,
      group: "Conviction Details",
    },
    {
      name: "sentenceDetails",
      label: "Sentence Awarded",
      labelUrdu: "دی گئی سزا کی تفصیلات",
      type: "textarea",
      required: true,
      group: "Conviction Details",
    },
    {
      name: "groundsOfAppeal",
      label: "Grounds of Appeal",
      labelUrdu: "اپیل کی بنیادیں",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Appeal Details",
    },
    {
      name: "trialDefects",
      label: "Defects in Trial/Misreading of Evidence",
      labelUrdu: "ٹرائل میں خامیاں/شواہد کی غلط تعبیر",
      type: "textarea",
      required: false,
      aiSuggestable: true,
      group: "Appeal Details",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a Criminal Appeal Petition in {{language}}.

APPELLANT:
- Name: {{appellantName}}
- Father's Name: {{appellantFatherName}}
- CNIC: {{appellantCnic}}
- Address: {{appellantAddress}}

CASE DETAILS:
- Trial Court Case No: {{caseNumberTrial}}
- Trial Court: {{trialCourt}}
- FIR No: {{firNumber}}
- Police Station: {{policeStation}}

CONVICTION DETAILS:
- Date of Conviction: {{convictionDate}}
- Sections Convicted Under: {{convictionSections}}
- Sentence: {{sentenceDetails}}

APPEAL DETAILS:
- Grounds of Appeal: {{groundsOfAppeal}}
- Trial Defects: {{trialDefects}}

Generate a complete Criminal Appeal Petition under Sections 410-423 of the Code of Criminal Procedure 1898 (CrPC). Reference Section 417 CrPC (Appeal by State against acquittal), Section 411 CrPC (Appellate Courts), and relevant provisions of the Qanun-e-Shahadat Order 1984 for misreading/non-reading of evidence. Cite relevant case law from PLD, SCMR, and PCrLJ on grounds of appeal, particularly regarding reappraisal of evidence by appellate courts. Include proper High CourtREFERENCE FORMAT - Follow this exact Pakistani legal format:

IN THE COURT OF SESSIONS JUDGE / HIGH COURT OF [PROVINCE] AT [CITY]

CRIMINAL APPEAL NO. _______ OF 20___

[Appellant Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
                                                    ...APPELLANT
VERSUS
The State                                           ...RESPONDENT

(Against judgment / sentence dated [Date] passed by [Trial Court Name] in [Case No.] / FIR No. [Number])

MEMO OF APPEAL

RESPECTFULLY SHEWETH:

1. That the learned trial court convicted the Appellant under Section [PPC Section] and sentenced him/her to [Sentence] vide judgment dated [Conviction Date].
2. That the impugned judgment and conviction are against the law, facts, and weight of evidence.
3. That the grounds of appeal are:
   (i) That the prosecution failed to prove its case beyond reasonable doubt;
   (ii) That the medical / forensic evidence does not support the prosecution version;
   (iii) That the witnesses are related / interested and their statements are unreliable;
   (iv) That no independent corroboration of the prosecution evidence exists;
   (v) That the benefit of doubt must be given to the Appellant as per settled law.
4. That the Appellant is a first offender / has dependents and deserves leniency.

It is therefore most respectfully prayed that this Honourable Court may be pleased to:
(a) Accept this appeal;
(b) Suspend the sentence during pendency of this appeal;
(c) Acquit the Appellant of all charges;
(d) Award costs as deemed appropriate.

Appellant:
[Name] S/o [Father Name]
CNIC: ___________

Advocate: ___________________
Bar No.: ___________________

INSTRUCTIONS:
- Court heading: IN THE COURT OF SESSIONS JUDGE / HIGH COURT AT [CITY] (centered, bold)
- CRIMINAL APPEAL heading
- Appellant vs State identification
- Reference original case and conviction date
- "RESPECTFULLY SHEWETH:" opening
- Numbered "That..." paragraphs with grounds (i)(ii)(iii)(iv)
- Prayer clause with (a), (b), (c), (d) items including sentence suspension
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
