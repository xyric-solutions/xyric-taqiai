import { TemplateDefinition } from "../types";

export const firRegistration: TemplateDefinition = {
  category: "criminal-law",
  subType: "fir-registration",
  name: "FIR Registration Application / ایف آئی آر درج کرانے کی درخواست",
  nameUrdu: "ایف آئی آر درج کرانے کی درخواست",
  description: "Application for FIR registration under Section 154 CrPC",
  descriptionUrdu: "دفعہ 154 ضابطہ فوجداری کے تحت ایف آئی آر درج کرانے کی درخواست",
  icon: "FileText",
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
      name: "accusedAddress",
      label: "Accused Address (if known)",
      labelUrdu: "ملزم کا پتہ (اگر معلوم ہو)",
      type: "address",
      required: false,
      group: "Accused Details",
    },
    {
      name: "accusedDescription",
      label: "Accused Description/Identification",
      labelUrdu: "ملزم کی شناخت/حلیہ",
      type: "textarea",
      required: false,
      group: "Accused Details",
    },
    {
      name: "offenceType",
      label: "Type of Offence",
      labelUrdu: "جرم کی نوعیت",
      type: "select",
      required: true,
      options: [
        { value: "theft", label: "Theft/Robbery (Section 379-402 PPC)", labelUrdu: "چوری/ڈکیتی (دفعہ 379-402)" },
        { value: "assault", label: "Assault/Hurt (Section 332-337 PPC)", labelUrdu: "حملہ/ایذا رسانی (دفعہ 332-337)" },
        { value: "murder", label: "Murder/Qatl (Section 302 PPC)", labelUrdu: "قتل (دفعہ 302)" },
        { value: "fraud", label: "Fraud/Cheating (Section 420 PPC)", labelUrdu: "فراڈ/دھوکہ (دفعہ 420)" },
        { value: "kidnapping", label: "Kidnapping/Abduction (Section 363-369 PPC)", labelUrdu: "اغوا (دفعہ 363-369)" },
        { value: "criminal_breach", label: "Criminal Breach of Trust (Section 406 PPC)", labelUrdu: "بدعنوانی (دفعہ 406)" },
        { value: "trespass", label: "Criminal Trespass (Section 447-462 PPC)", labelUrdu: "بے جا مداخلت (دفعہ 447-462)" },
        { value: "other", label: "Other", labelUrdu: "دیگر" },
      ],
      group: "Offence Details",
    },
    {
      name: "dateOfIncident",
      label: "Date of Incident",
      labelUrdu: "واقعہ کی تاریخ",
      type: "date",
      required: true,
      group: "Offence Details",
    },
    {
      name: "timeOfIncident",
      label: "Approximate Time of Incident",
      labelUrdu: "واقعہ کا تخمینی وقت",
      type: "text",
      required: false,
      group: "Offence Details",
    },
    {
      name: "placeOfIncident",
      label: "Place of Incident",
      labelUrdu: "واقعہ کی جگہ",
      type: "address",
      required: true,
      group: "Offence Details",
    },
    {
      name: "factsOfCase",
      label: "Facts of the Case",
      labelUrdu: "واقعے کی تفصیلات",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Case Details",
    },
    {
      name: "evidenceDetails",
      label: "Evidence Available",
      labelUrdu: "دستیاب شواہد",
      type: "textarea",
      required: false,
      group: "Case Details",
    },
    {
      name: "witnessDetails",
      label: "Witness Details",
      labelUrdu: "گواہوں کی تفصیلات",
      type: "textarea",
      required: false,
      group: "Case Details",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate an FIR Registration Application in {{language}}.

COMPLAINANT:
- Name: {{complainantName}}
- Father's Name: {{complainantFatherName}}
- CNIC: {{complainantCnic}}
- Address: {{complainantAddress}}

ACCUSED:
- Name: {{accusedName}}
- Address: {{accusedAddress}}
- Description: {{accusedDescription}}

OFFENCE DETAILS:
- Type: {{offenceType}}
- Date of Incident: {{dateOfIncident}}
- Time of Incident: {{timeOfIncident}}
- Place of Incident: {{placeOfIncident}}

CASE DETAILS:
- Facts: {{factsOfCase}}
- Evidence: {{evidenceDetails}}
- Witnesses: {{witnessDetails}}

REFERENCE FORMAT — Follow this exact Pakistani legal format:

To,
The SHO,
Police Station [Police Station Name],
[City]

Subject: Application for Registration of FIR u/s 154 CrPC

Respected Sir,

With due respect it is submitted that I, [Complainant Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address], do hereby report as under:

1. That on [Date of Incident] at approximately [Time] at [Place of Incident], the following incident occurred:
   [Detailed facts of the case]

2. That the accused person(s):
   - [Accused Name] S/o [Father Name], resident of [Address] — [Description]
   [Additional accused if any]

3. That the said accused committed the offence of [Offence Type] punishable under Section [PPC Sections] of the Pakistan Penal Code 1860 / [Other applicable law].

4. That the following witnesses were present at the time of the incident:
   [Witness Details]

5. That the following evidence is available:
   [Evidence Details]

6. That I hereby request Your Honour to register the FIR against the above-mentioned accused under the applicable sections.

It is therefore most respectfully prayed that Your Honour may be pleased to:
(i) Register the FIR against the accused under Sections [Sections] PPC;
(ii) Take appropriate legal action against the accused as per law.

Complainant:
[Name] S/o [Father Name]
CNIC: ___________
Phone: ___________

Date: _______________     Place: _______________

NOTE: If police refuses to register FIR, application may be made to the Justice of Peace under Section 22-A and 22-B CrPC.

INSTRUCTIONS:
- Formal application to SHO
- Subject: "Application for Registration of FIR u/s 154 CrPC"
- "That..." numbered paragraphs for facts
- Accused identification
- Applicable PPC sections
- Prayer clause with (i), (ii) items
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
