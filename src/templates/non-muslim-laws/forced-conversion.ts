import { TemplateDefinition } from "../types";

export const forcedConversionComplaint: TemplateDefinition = {
  category: "non-muslim-laws",
  subType: "forced-conversion",
  name: "Forced Conversion Complaint",
  nameUrdu: "جبری تبدیلی مذہب کی شکایت",
  description: "Complaint against forced religious conversion under PPC & Constitutional provisions",
  descriptionUrdu: "PPC اور آئینی دفعات کے تحت جبری تبدیلی مذہب کے خلاف شکایت",
  icon: "Shield",
  formFields: [
    { name: "complainantName", label: "Complainant's Name", labelUrdu: "شکایت کنندہ", type: "text", required: true, group: "Complainant" },
    { name: "complainantCnic", label: "CNIC", labelUrdu: "شناختی کارڈ", type: "cnic", required: true, group: "Complainant" },
    { name: "complainantReligion", label: "Original Religion", labelUrdu: "اصل مذہب", type: "text", required: true, group: "Complainant" },
    { name: "complainantAddress", label: "Address", labelUrdu: "پتہ", type: "address", required: true, group: "Complainant" },
    { name: "victimName", label: "Victim's Name (if different)", labelUrdu: "متاثرہ کا نام", type: "text", required: false, group: "Victim" },
    { name: "victimAge", label: "Victim's Age", labelUrdu: "عمر", type: "number", required: true, group: "Victim" },
    { name: "victimGender", label: "Gender", labelUrdu: "جنس", type: "select", required: true, group: "Victim",
      options: [
        { value: "female", label: "Female" },
        { value: "male", label: "Male" },
        { value: "minor-girl", label: "Minor Girl" },
        { value: "minor-boy", label: "Minor Boy" },
      ],
    },
    { name: "accusedName", label: "Accused Person(s)", labelUrdu: "ملزم", type: "text", required: true, group: "Accused" },
    { name: "accusedAddress", label: "Accused Address", labelUrdu: "ملزم کا پتہ", type: "address", required: true, group: "Accused" },
    { name: "dateOfIncident", label: "Date of Incident", labelUrdu: "واقعے کی تاریخ", type: "date", required: true, group: "Incident" },
    { name: "facts", label: "Detailed Facts of Forced Conversion", labelUrdu: "جبری تبدیلی مذہب کی تفصیلات", type: "textarea", required: true, group: "Incident" },
    { name: "policeStation", label: "Police Station", labelUrdu: "تھانہ", type: "text", required: true, group: "Incident" },
  ],
  promptTemplate: `Generate a Forced Conversion Complaint/FIR Application for filing at police station and court in Pakistan.
Complainant: {complainantName}, CNIC: {complainantCnic}, Religion: {complainantReligion}, Address: {complainantAddress}
Victim: {victimName}, Age: {victimAge}, Gender: {victimGender}
Accused: {accusedName}, Address: {accusedAddress}
Date: {dateOfIncident}, Police Station: {policeStation}
Facts: {facts}
Cite Article 20 (Constitution), PPC Sections 365-B (kidnapping), 371-A (selling person), 493-A (cohabitation by deceit). If minor: Child Marriage Restraint Act 1929. Reference Smt. Reeta Kumari v Province of Sindh. Request FIR registration and recovery of victim.

REFERENCE FORMAT - Follow this exact Pakistani legal format:

To,
The SHO,
Police Station [Police Station Name],
[City].

SUBJECT: Application for Registration of FIR - Forced Conversion / Kidnapping

[Complainant Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]

1. That [Victim Name] D/o [Father Name], aged [Age], CNIC No. [CNIC], is my [Relation] and a [Hindu / Christian / other] citizen.
2. That on [Date], [Accused Name] S/o [Father Name] abducted / forcibly took away [Victim Name] under duress.
3. That the accused has forced [Victim Name] to change her religion against her will.
4. That this constitutes offences under Sections 365-B (kidnapping), 493-A (cohabitation by deceit) PPC and violates the Victim's right to religion under Article 20 of the Constitution.
5. That if victim is a minor: the Child Marriage Restraint Act 1929 and Protection of Minors Act apply.

PRAYER:
(i) Register FIR against the accused;
(ii) Recover [Victim Name] and produce before this court;
(iii) Arrest the accused and take appropriate legal action.

Complainant: ___________
Date: ___________

INSTRUCTIONS:
- Addressing: To the SHO, Police Station
- Include victim and accused details
- Reference Sections 365-B, 493-A PPC and Article 20 Constitution
- For minors: reference Child Marriage Restraint Act 1929
- Prayer clause with (i)(ii)(iii) items
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
