import { TemplateDefinition } from "../types";

export const murderDefense: TemplateDefinition = {
  category: "criminal-law",
  subType: "murder-defense",
  name: "Murder/Qatl Defense / قتل کے مقدمے میں دفاع",
  nameUrdu: "قتل کے مقدمے میں دفاع",
  description: "Defense in murder/qatl cases under Section 302 PPC",
  descriptionUrdu: "دفعہ 302 تعزیرات پاکستان کے تحت قتل کے مقدمے میں دفاع",
  icon: "Scale",
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
      group: "Case Details",
    },
    {
      name: "firDate",
      label: "FIR Date",
      labelUrdu: "ایف آئی آر کی تاریخ",
      type: "date",
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
      name: "dateOfIncident",
      label: "Date of Incident",
      labelUrdu: "واقعہ کی تاریخ",
      type: "date",
      required: true,
      group: "Case Details",
    },
    {
      name: "victimName",
      label: "Victim (Maqtool) Name",
      labelUrdu: "مقتول کا نام",
      type: "text",
      required: true,
      group: "Victim Details",
    },
    {
      name: "victimRelation",
      label: "Relation with Victim",
      labelUrdu: "مقتول سے رشتہ",
      type: "text",
      required: false,
      group: "Victim Details",
    },
    {
      name: "defenseType",
      label: "Type of Defense",
      labelUrdu: "دفاع کی قسم",
      type: "select",
      required: true,
      options: [
        { value: "alibi", label: "Alibi - Was Not Present at Scene", labelUrdu: "عدم موجودگی - واقعے کی جگہ پر موجود نہیں تھا" },
        { value: "self_defense", label: "Right of Private Defense (Section 100 PPC)", labelUrdu: "حق دفاع (دفعہ 100 تعزیرات پاکستان)" },
        { value: "accident", label: "Accident/Unintentional (Section 304 PPC)", labelUrdu: "حادثہ/غیر ارادی (دفعہ 304)" },
        { value: "grave_provocation", label: "Grave & Sudden Provocation (Exception 1, S.300 PPC)", labelUrdu: "شدید اشتعال (استثنیٰ 1، دفعہ 300)" },
        { value: "false_implication", label: "False Implication/Fabricated Case", labelUrdu: "جھوٹا مقدمہ/من گھڑت الزام" },
        { value: "insanity", label: "Unsoundness of Mind (Section 84 PPC)", labelUrdu: "دماغی عدم توازن (دفعہ 84)" },
      ],
      group: "Defense Details",
    },
    {
      name: "factsOfDefense",
      label: "Facts Supporting Defense",
      labelUrdu: "دفاع کے حق میں حقائق",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Defense Details",
    },
    {
      name: "witnessDetails",
      label: "Defense Witness Details",
      labelUrdu: "دفاعی گواہوں کی تفصیلات",
      type: "textarea",
      required: false,
      group: "Defense Details",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a Murder/Qatl Defense document in {{language}}.

ACCUSED:
- Name: {{accusedName}}
- Father's Name: {{accusedFatherName}}
- CNIC: {{accusedCnic}}
- Address: {{accusedAddress}}

CASE DETAILS:
- FIR No: {{firNumber}}
- FIR Date: {{firDate}}
- Police Station: {{policeStation}}
- Court: {{courtName}}
- Date of Incident: {{dateOfIncident}}

VICTIM:
- Name: {{victimName}}
- Relation with Accused: {{victimRelation}}

DEFENSE:
- Type: {{defenseType}}
- Supporting Facts: {{factsOfDefense}}
- Defense Witnesses: {{witnessDetails}}

Generate a complete defense statement/written arguments for a murder case under Section 302 of the Pakistan Penal Code 1860 (PPC). Reference relevant provisions including Sections 299-311 PPC (Qatl provisions), Section 96-106 PPC (Right of Private Defense), and applicable sections of Qanun-e-Shahadat Order 1984. Cite relevant case law from PLD, SCMR, and PCrLJ. Include prREFERENCE FORMAT - Follow this exact Pakistani legal format:

IN THE COURT OF SESSIONS JUDGE AT [CITY]

STATE VS. [ACCUSED NAME]
FIR No. [FIR Number], Police Station [Police Station], Section 302/34 PPC

STATEMENT OF DEFENSE / WRITTEN ARGUMENTS ON BEHALF OF ACCUSED

[Accused Name] S/o [Father Name], CNIC No. [CNIC]
                                                    ...ACCUSED

RESPECTFULLY SHEWETH:

FACTS OF DEFENSE:

1. That the accused is innocent and has been falsely implicated due to [Enmity / Motive of false implication].
2. That on the alleged date [Date], the accused was present at [Alibi Location] and did not commit any offence.
3. That [Witness Name(s)] can vouch for the alibi of the accused.

LEGAL ARGUMENTS:

1. OCULAR EVIDENCE: The eyewitnesses are [related to deceased / interested witnesses] and their testimony is unreliable as per PLD/SCMR precedents.
2. MEDICAL EVIDENCE: The medical evidence does not corroborate the prosecution's version as [Reason].
3. BENEFIT OF DOUBT: In cases of capital punishment, the court must apply strict scrutiny; any doubt must favor the accused.
4. MOTIVE: The prosecution has failed to establish a clear and cogent motive.
5. INVESTIGATIONAL DEFECTS: [Specific defects in investigation - delayed FIR / planted evidence / no scene of crime examination].

PRAYER:
(a) Acquit the accused of all charges under Section 302/34 PPC;
(b) Release the accused from custody;
(c) Any other appropriate relief.

Accused:
[Name] S/o [Father Name]
CNIC: ___________

Advocate: ___________________

INSTRUCTIONS:
- Court heading: IN THE COURT OF SESSIONS JUDGE AT [CITY] (centered, bold)
- Case identification with FIR number
- FACTS OF DEFENSE section
- LEGAL ARGUMENTS numbered section
- Arguments: ocular evidence reliability, medical evidence, benefit of doubt, motive, investigation defects
- Prayer clause with (a), (b), (c) items
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
