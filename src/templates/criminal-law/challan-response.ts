import { TemplateDefinition } from "../types";

export const challanResponse: TemplateDefinition = {
  category: "criminal-law",
  subType: "challan-response",
  name: "Response to Police Challan / پولیس چالان کا جواب",
  nameUrdu: "پولیس چالان کا جواب",
  description: "Written response/defense to police challan submitted in court",
  descriptionUrdu: "عدالت میں پیش کردہ پولیس چالان کا تحریری جواب/دفاع",
  icon: "FileText",
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
      name: "caseNumber",
      label: "Case Number",
      labelUrdu: "مقدمہ نمبر",
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
      name: "courtName",
      label: "Court Name",
      labelUrdu: "عدالت کا نام",
      type: "text",
      required: true,
      group: "Case Details",
    },
    {
      name: "judgeName",
      label: "Presiding Judge/Magistrate Name",
      labelUrdu: "صدر مقام جج/مجسٹریٹ کا نام",
      type: "text",
      required: false,
      group: "Case Details",
    },
    {
      name: "challanDate",
      label: "Challan Submission Date",
      labelUrdu: "چالان جمع کرانے کی تاریخ",
      type: "date",
      required: true,
      group: "Challan Details",
    },
    {
      name: "sectionsCharged",
      label: "Sections in Challan",
      labelUrdu: "چالان میں درج دفعات",
      type: "text",
      required: true,
      group: "Challan Details",
    },
    {
      name: "defensePoints",
      label: "Points of Defense Against Challan",
      labelUrdu: "چالان کے خلاف دفاعی نکات",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Defense Details",
    },
    {
      name: "weaknessesInChallan",
      label: "Weaknesses/Contradictions in Challan",
      labelUrdu: "چالان میں کمزوریاں/تضادات",
      type: "textarea",
      required: false,
      aiSuggestable: true,
      group: "Defense Details",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a Response to Police Challan in {{language}}.

ACCUSED:
- Name: {{accusedName}}
- Father's Name: {{accusedFatherName}}
- CNIC: {{accusedCnic}}
- Address: {{accusedAddress}}

CASE DETAILS:
- Case No: {{caseNumber}}
- FIR No: {{firNumber}}
- Police Station: {{policeStation}}
- Court: {{courtName}}
- Presiding Judge: {{judgeName}}

CHALLAN DETAILS:
- Challan Date: {{challanDate}}
- Sections Charged: {{sectionsCharged}}

DEFENSE:
- Defense Points: {{defensePoints}}
- Weaknesses in Challan: {{weaknessesInChallan}}

Generate a complete written response/defense to the police challan under the Code of Criminal Procedure 1898 (CrPC). Reference Section 173 CrPC (Report of police officer on completion of investigation), Section 265-C to 265-F CrPC (charge and trialREFERENCE FORMAT - Follow this exact Pakistani legal format:

IN THE COURT OF [JUDICIAL MAGISTRATE / SESSIONS JUDGE] AT [CITY]

STATE VS. [ACCUSED NAME]
FIR No. [FIR Number], Police Station [Police Station], Sections [Sections PPC]

WRITTEN STATEMENT / RESPONSE TO CHALLAN ON BEHALF OF THE ACCUSED

[Accused Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
                                                    ...ACCUSED

RESPECTFULLY SHEWETH:

1. That the accused is innocent and has been falsely implicated in this case.

PARA-WISE REPLY:

Para 1: [Reply to first paragraph of challan / charge sheet]
Para 2: [Reply to second paragraph of challan]
Para 3: [Reply to evidence / witnesses listed in challan]

LEGAL ARGUMENTS:

1. That the prosecution has failed to comply with Section 173 CrPC requirements in the challan.
2. That the evidence collected is inadmissible as [Reason].
3. That no independent witness supports the prosecution version.
4. That the accused is entitled to acquittal as the prosecution has not made out a prima facie case.

It is therefore most respectfully prayed that:
(a) The accused be acquitted / discharged under Section 265-K CrPC;
(b) The accused be granted bail during trial;
(c) Any other appropriate relief be granted.

Accused:
[Name] S/o [Father Name]
CNIC: ___________

Advocate: ___________________

INSTRUCTIONS:
- Court heading: IN THE COURT OF [MAGISTRATE / SESSIONS JUDGE] AT [CITY] (centered, bold)
- Case identification with FIR number
- RESPECTFULLY SHEWETH: opening
- Para-wise response to challan
- Legal arguments numbered
- Prayer clause with (a), (b), (c) items
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
