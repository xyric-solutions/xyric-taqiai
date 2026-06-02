import { TemplateDefinition } from "../types";

export const complaintPetition: TemplateDefinition = {
  category: "criminal-law",
  subType: "complaint-petition",
  name: "Private Criminal Complaint / نجی فوجداری شکایت",
  nameUrdu: "نجی فوجداری شکایت",
  description: "Private criminal complaint under Section 200 CrPC before Magistrate",
  descriptionUrdu: "دفعہ 200 ضابطہ فوجداری کے تحت مجسٹریٹ کے سامنے نجی فوجداری شکایت",
  icon: "Users",
  formFields: [
    {
      name: "complainantName",
      label: "Complainant Name",
      labelUrdu: "مدعی کا نام",
      type: "text",
      required: true,
      group: "Complainant Details",
    },
    {
      name: "complainantFatherName",
      label: "Complainant Father's Name",
      labelUrdu: "مدعی کے والد کا نام",
      type: "text",
      required: true,
      group: "Complainant Details",
    },
    {
      name: "complainantCnic",
      label: "Complainant CNIC",
      labelUrdu: "مدعی کا شناختی کارڈ",
      type: "cnic",
      required: true,
      group: "Complainant Details",
    },
    {
      name: "complainantAddress",
      label: "Complainant Address",
      labelUrdu: "مدعی کا پتہ",
      type: "address",
      required: true,
      group: "Complainant Details",
    },
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
      required: false,
      group: "Accused Details",
    },
    {
      name: "accusedCnic",
      label: "Accused CNIC (if known)",
      labelUrdu: "ملزم کا شناختی کارڈ (اگر معلوم ہو)",
      type: "cnic",
      required: false,
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
      name: "offenceSections",
      label: "Offence/Sections of Law",
      labelUrdu: "جرم/قانون کی دفعات",
      type: "text",
      required: true,
      group: "Offence Details",
    },
    {
      name: "offenceType",
      label: "Nature of Offence",
      labelUrdu: "جرم کی نوعیت",
      type: "select",
      required: true,
      options: [
        { value: "defamation", label: "Defamation (Section 499-500 PPC)", labelUrdu: "ہتک عزت (دفعہ 499-500)" },
        { value: "criminal_intimidation", label: "Criminal Intimidation (Section 506 PPC)", labelUrdu: "فوجداری دھمکی (دفعہ 506)" },
        { value: "dishonoured_cheque", label: "Dishonoured Cheque (Section 489-F PPC)", labelUrdu: "باؤنس چیک (دفعہ 489-F)" },
        { value: "trespass", label: "Criminal Trespass (Section 447 PPC)", labelUrdu: "بے جا مداخلت (دفعہ 447)" },
        { value: "breach_of_trust", label: "Breach of Trust (Section 406 PPC)", labelUrdu: "خیانت (دفعہ 406)" },
        { value: "other", label: "Other Offence", labelUrdu: "دیگر جرم" },
      ],
      group: "Offence Details",
    },
    {
      name: "factsOfCase",
      label: "Facts of the Case",
      labelUrdu: "مقدمے کے حقائق",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Case Details",
    },
    {
      name: "witnessDetails",
      label: "Witness Details (Names, Addresses)",
      labelUrdu: "گواہوں کی تفصیلات (نام، پتے)",
      type: "textarea",
      required: false,
      group: "Case Details",
    },
    {
      name: "evidenceDetails",
      label: "Evidence/Documents Available",
      labelUrdu: "دستیاب شواہد/دستاویزات",
      type: "textarea",
      required: true,
      group: "Case Details",
    },
    {
      name: "dateOfOffence",
      label: "Date of Offence",
      labelUrdu: "جرم کی تاریخ",
      type: "date",
      required: true,
      group: "Offence Details",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a Private Criminal Complaint Petition in {{language}}.

COMPLAINANT:
- Name: {{complainantName}}
- Father's Name: {{complainantFatherName}}
- CNIC: {{complainantCnic}}
- Address: {{complainantAddress}}

ACCUSED:
- Name: {{accusedName}}
- Father's Name: {{accusedFatherName}}
- CNIC: {{accusedCnic}}
- Address: {{accusedAddress}}

OFFENCE DETAILS:
- Sections: {{offenceSections}}
- Nature: {{offenceType}}
- Date of Offence: {{dateOfOffence}}

CASE DETAILS:
- Facts: {{factsOfCase}}
- Witnesses: {{witnessDetails}}
- Evidence: {{evidenceDetails}}

Generate a complete Private Criminal Complaint Petition under Section 200 of the Code of Criminal Procedure 1898 (CrPC), to be filed before the Judicial Magistrate. Reference Section 200 (Examination of complainant), Section 202 (Postponement of issue of process), and Section 203 CrPC (Dismissal of complaint). Include proper court heading addressed to the Judicial Magistrate, detailed facts establishing the ingredients of the offence, list of witnesses REFERENCE FORMAT - Follow this exact Pakistani legal format:

IN THE COURT OF JUDICIAL MAGISTRATE AT [CITY]

COMPLAINT NO. _______ OF 20___
(Under Section 200, Code of Criminal Procedure 1898)

[Complainant Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
                                                    ...COMPLAINANT
VERSUS
[Accused Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
                                                    ...ACCUSED

COMPLAINT PETITION

RESPECTFULLY SHEWETH:

1. That the Complainant is a law-abiding citizen of [City].
2. That on [Date] at [Place / Time], the accused [Description of Offence].
3. That the accused committed the following offences: Sections [PPC Sections] of the Pakistan Penal Code.
4. That the Complainant reported the matter to Police Station [Name] on [Date] but the police refused to register the FIR.
5. That the Complainant is thus approaching this Honourable Court under Section 200 CrPC.
6. That the following documentary evidence is available: [List of Documents].

It is therefore most respectfully prayed that this Honourable Court may be pleased to:
(a) Record the Complainant's statement on oath under Section 200 CrPC;
(b) Issue summons / warrants against the accused;
(c) Direct registration of FIR at Police Station [Name];
(d) Any other appropriate relief.

Complainant:
[Name] S/o [Father Name]
CNIC: ___________

Advocate: ___________________

INSTRUCTIONS:
- Court heading: IN THE COURT OF JUDICIAL MAGISTRATE AT [CITY] (centered, bold)
- COMPLAINT PETITION under Section 200 CrPC heading
- Complainant vs Accused identification
- "RESPECTFULLY SHEWETH:" opening
- Numbered "That..." paragraphs with offence description and PPC sections
- Prayer clause with (a), (b), (c), (d) items
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
