import { TemplateDefinition } from "../types";

export const specialCourtPOA: TemplateDefinition = {
  category: "power-of-attorney",
  subType: "special-court",
  name: "Special Power of Attorney (Courts)",
  nameUrdu: "خصوصی مختار نامہ (عدالتی)",
  description: "Special power of attorney for court proceedings",
  descriptionUrdu: "عدالتی کارروائی کے لیے خصوصی مختار نامہ",
  icon: "Gavel",
  formFields: [
    {
      name: "principalName",
      label: "Principal Name",
      labelUrdu: "مؤکل کا نام",
      type: "text",
      required: true,
      group: "Principal",
    },
    {
      name: "principalCnic",
      label: "Principal CNIC",
      labelUrdu: "مؤکل کا شناختی کارڈ",
      type: "cnic",
      required: true,
      group: "Principal",
    },
    {
      name: "principalAddress",
      label: "Principal Address",
      labelUrdu: "مؤکل کا پتہ",
      type: "address",
      required: true,
      group: "Principal",
    },
    {
      name: "attorneyName",
      label: "Attorney/Advocate Name",
      labelUrdu: "وکیل کا نام",
      type: "text",
      required: true,
      group: "Attorney",
    },
    {
      name: "attorneyBarId",
      label: "Bar Council License No.",
      labelUrdu: "بار کونسل لائسنس نمبر",
      type: "text",
      required: true,
      group: "Attorney",
    },
    {
      name: "courtName",
      label: "Court Name",
      labelUrdu: "عدالت کا نام",
      type: "text",
      required: true,
      placeholder: "e.g., Civil Court Lahore",
      group: "Case Details",
    },
    {
      name: "caseNumber",
      label: "Case Number",
      labelUrdu: "مقدمہ نمبر",
      type: "text",
      required: false,
      group: "Case Details",
    },
    {
      name: "caseTitle",
      label: "Case Title",
      labelUrdu: "مقدمے کا عنوان",
      type: "text",
      required: true,
      placeholder: "e.g., Ali vs State",
      group: "Case Details",
    },
    {
      name: "specificPowers",
      label: "Specific Powers for Court",
      labelUrdu: "عدالتی مخصوص اختیارات",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Powers",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a Special Power of Attorney for Court Proceedings in {{language}}.

PRINCIPAL:
- Name: {{principalName}}
- CNIC: {{principalCnic}}
- Address: {{principalAddress}}

ATTORNEY/ADVOCATE:
- Name: {{attorneyName}}
- Bar Council License: {{attorneyBarId}}

CASE:
- Court: {{courtName}}
- Case No: {{caseNumber}}
- Title: {{caseTitle}}

SPECIFIC POWERS: {{specificPowers}}

REFERENCE FORMAT — Follow this exact Pakistani legal format:

SPECIAL POWER OF ATTORNEY

NOW ALL MEN BY THESE PRESENTS that I, [Principal Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address], do hereby appoint [Attorney Name], Advocate, Bar Council License No. [Bar ID], as my lawful attorney for the limited and specific purpose mentioned hereunder, in connection with [Case Title] pending before the Honourable [Court Name] in Case No. [Case Number]:

1. To appear, plead and act for me in the above-mentioned case before [Court Name] and all other courts, including appellate courts, to which the matter may be transferred.
2. To sign, verify and present all pleadings, affidavits, applications, written statements, appeals, revisions and petitions on my behalf.
3. To engage and instruct counsel, file documents, accept service of process and take all steps necessary in the said case.
4. To compromise, compound or withdraw the case or refer it to arbitration as my Attorney deems fit.
5. [Specific Powers: as entered by user]

This Power of Attorney is being granted solely for the purpose stated above and does not confer any other authority.

IN WITNESS WHEREOF I have executed this Special Power of Attorney on this ___ day of ___________, 20___ at [City].

Signature                                     Signature
[Principal Name]                              [Attorney Name]
CNIC: ___________                             Bar License: ___________

Witness 1: ___________________     Witness 2: ___________________

ATTESTED
(Oath Commissioner / Notary Public)

INSTRUCTIONS:
- Title: SPECIAL POWER OF ATTORNEY (centered, bold)
- NOW ALL MEN BY THESE PRESENTS opening clause
- Numbered powers starting with "To..."
- Limiting clause: "solely for the purpose stated above"
- IN WITNESS WHEREOF closing
- Both signatures at bottom
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
