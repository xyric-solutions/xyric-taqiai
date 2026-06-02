import { TemplateDefinition } from "../types";

export const fraudCheating: TemplateDefinition = {
  category: "criminal-law",
  subType: "fraud-cheating",
  name: "Fraud/Cheating Complaint / فراڈ/دھوکہ دہی کی شکایت",
  nameUrdu: "فراڈ/دھوکہ دہی کی شکایت",
  description: "Criminal complaint for fraud and cheating under Section 420/406 PPC",
  descriptionUrdu: "دفعہ 420/406 تعزیرات پاکستان کے تحت فراڈ اور دھوکہ دہی کی فوجداری شکایت",
  icon: "AlertTriangle",
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
      name: "accusedAddress",
      label: "Accused Address",
      labelUrdu: "ملزم کا پتہ",
      type: "address",
      required: true,
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
      name: "amountInvolved",
      label: "Amount Involved (PKR)",
      labelUrdu: "متعلقہ رقم (روپے)",
      type: "number",
      required: true,
      group: "Fraud Details",
    },
    {
      name: "fraudType",
      label: "Type of Fraud",
      labelUrdu: "فراڈ کی قسم",
      type: "select",
      required: true,
      options: [
        { value: "cheating", label: "Cheating (Section 420 PPC)", labelUrdu: "دھوکہ دہی (دفعہ 420)" },
        { value: "breach_of_trust", label: "Criminal Breach of Trust (Section 406 PPC)", labelUrdu: "خیانت (دفعہ 406)" },
        { value: "forgery", label: "Forgery (Section 463-474 PPC)", labelUrdu: "جعل سازی (دفعہ 463-474)" },
        { value: "property_fraud", label: "Property Fraud (Section 420/468 PPC)", labelUrdu: "جائیداد فراڈ (دفعہ 420/468)" },
        { value: "dishonoured_cheque", label: "Dishonoured Cheque (Section 489-F PPC)", labelUrdu: "باؤنس چیک (دفعہ 489-F)" },
        { value: "misappropriation", label: "Criminal Misappropriation (Section 403 PPC)", labelUrdu: "بددیانتی (دفعہ 403)" },
      ],
      group: "Fraud Details",
    },
    {
      name: "dateOfFraud",
      label: "Date of Fraud/Cheating",
      labelUrdu: "فراڈ/دھوکہ دہی کی تاریخ",
      type: "date",
      required: true,
      group: "Fraud Details",
    },
    {
      name: "factsOfFraud",
      label: "Facts of Fraud/Cheating",
      labelUrdu: "فراڈ/دھوکہ دہی کی تفصیلات",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Case Details",
    },
    {
      name: "evidenceDetails",
      label: "Evidence Available (Documents, Receipts, etc.)",
      labelUrdu: "دستیاب شواہد (دستاویزات، رسیدیں وغیرہ)",
      type: "textarea",
      required: true,
      group: "Case Details",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a Fraud/Cheating Complaint in {{language}}.

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

FRAUD DETAILS:
- Amount Involved: PKR {{amountInvolved}}
- Fraud Type: {{fraudType}}
- Date of Fraud: {{dateOfFraud}}

CASE DETAILS:
- Facts: {{factsOfFraud}}
- Evidence: {{evidenceDetails}}

Generate a complete Fraud/Cheating criminal complaint following Pakistani law, specifically under Sections 406, 415, 417, 418, 420, and 489-F of the Pakistan Penal Code 1860 (PPC). Reference relevant provisions for the specific fraud type selected. Include proper heading (addressed to SHO/SSP or Judicial Magistrate as appropriate), detailed facts establishing ingredients of the offREFERENCE FORMAT - Follow this exact Pakistani legal format:

To,
The SHO,
Police Station [Police Station Name],
[City].

SUBJECT: Application for Registration of FIR Under Sections 420/406/468/471/34 PPC

[Complainant Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
                                                    ...COMPLAINANT

With due respect it is submitted that:

1. That I, [Complainant Name], am a resident of [Address] and a law-abiding citizen.
2. That on [Date], the accused [Accused Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address] approached me / entered into a transaction with me regarding [Subject of Fraud].
3. That the accused fraudulently induced me to [Pay Money / Sign Documents / Transfer Property] worth PKR [Amount]/- by making false representations that [False Representation].
4. That the accused has committed fraud, cheating, and criminal breach of trust under Sections 420/406 PPC.
5. That the accused has also forged / used forged documents under Sections 468/471 PPC.
6. That I suffered a loss of PKR [Amount]/- due to the said fraud.
7. That the following evidence is available: [List of Evidence - receipts / messages / documents].

PRAYER:
(i) Register an FIR against the accused under Sections [420/406/468/471/34 PPC];
(ii) Arrest the accused and recover the misappropriated amount;
(iii) Any other appropriate legal action.

Complainant:
[Name] S/o [Father Name]
CNIC: ___________
Date: ___________

INSTRUCTIONS:
- Addressing: To the SHO, Police Station
- SUBJECT: Application for FIR Under fraud/cheating sections PPC
- Numbered paragraphs with complete fraud narrative
- Include PPC sections: 420 (cheating), 406 (breach of trust), 468 (forgery), 471 (using forged document)
- Prayer clause with (i)(ii)(iii) items
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
