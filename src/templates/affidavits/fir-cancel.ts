import { TemplateDefinition } from "../types";

export const firCancelAffidavit: TemplateDefinition = {
  category: "affidavit",
  subType: "fir-cancel",
  name: "FIR Cancellation Affidavit",
  nameUrdu: "ایف آئی آر منسوخی حلف نامہ",
  description: "Affidavit for cancellation/withdrawal of FIR",
  descriptionUrdu: "ایف آئی آر کی منسوخی/واپسی کے لیے حلف نامہ",
  icon: "FileX2",
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
      name: "sections",
      label: "Sections of Law",
      labelUrdu: "قانون کی دفعات",
      type: "text",
      required: true,
      placeholder: "e.g., 420, 406 PPC",
      group: "FIR Details",
    },
    {
      name: "accusedName",
      label: "Accused Name",
      labelUrdu: "ملزم کا نام",
      type: "text",
      required: true,
      group: "FIR Details",
    },
    {
      name: "cancellationReason",
      label: "Reason for Cancellation",
      labelUrdu: "منسوخی کی وجہ",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      placeholder: "e.g., Matter resolved amicably, compromise reached",
      group: "Cancellation Details",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate an FIR Cancellation Affidavit in {{language}}.

COMPLAINANT:
- Name: {{complainantName}}
- CNIC: {{complainantCnic}}
- Address: {{complainantAddress}}

FIR DETAILS:
- FIR No: {{firNumber}}
- Date: {{firDate}}
- Police Station: {{policeStation}}
- Sections: {{sections}}
- Accused: {{accusedName}}

REASON FOR CANCELLATION: {{cancellationReason}}

Generate a complete FIR Cancellation Affidavit following Pakistani legal fREFERENCE FORMAT - Follow this exact Pakistani legal format:

AFFIDAVIT FOR CANCELLATION / WITHDRAWAL OF FIR

I, [Complainant Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address], do hereby solemnly affirm and declare as under:

1. That I am the complainant in FIR No. [FIR Number] dated [FIR Date] registered at Police Station [Police Station], under Sections [Sections], against [Accused Name].
2. That the dispute / matter between the parties has since been amicably settled and I have no further grievance against the accused.
3. That I have received / waived all my claims and demands arising out of the said matter.
4. That I have no objection to the cancellation / withdrawal of the said FIR and do not wish to pursue the matter further.
5. That I undertake not to file any fresh complaint in respect of the same occurrence.
6. That no pressure, coercion, or inducement has been applied upon me and this withdrawal is voluntary.
7. That the contents of this affidavit are true and correct to the best of my knowledge and belief and nothing has been concealed.

DEPONENT (COMPLAINANT)
[Complainant Name] S/o [Father Name]
CNIC: ___________

VERIFICATION:
Verified on oath at [City] on this ___ day of ___________ that the contents of the above affidavit are true and correct to the best of my knowledge and belief and nothing has been concealed therein.

DEPONENT

ATTESTED
(Oath Commissioner / Notary Public / Class-1 Officer)

INSTRUCTIONS:
- Title: AFFIDAVIT FOR CANCELLATION / WITHDRAWAL OF FIR (centered, bold)
- "That..." numbered clauses
- Include FIR number, date, police station, sections
- Include settlement clause and voluntary withdrawal
- Include VERIFICATION paragraph
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
