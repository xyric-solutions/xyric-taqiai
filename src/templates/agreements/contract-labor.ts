import { TemplateDefinition } from "../types";

export const contractLabor: TemplateDefinition = {
  category: "agreement",
  subType: "contract-labor",
  name: "Contract Labor Agreement",
  nameUrdu: "ٹھیکہ مزدوری معاہدہ",
  description: "Agreement for contract labor / daily wage workers",
  descriptionUrdu: "ٹھیکہ مزدوری / یومیہ اجرت کا معاہدہ",
  icon: "Hammer",
  formFields: [
    {
      name: "contractorName",
      label: "Contractor Name",
      labelUrdu: "ٹھیکیدار کا نام",
      type: "text",
      required: true,
      group: "Contractor Details",
    },
    {
      name: "contractorCnic",
      label: "Contractor CNIC",
      labelUrdu: "ٹھیکیدار کا شناختی کارڈ",
      type: "cnic",
      required: true,
      group: "Contractor Details",
    },
    {
      name: "contractorAddress",
      label: "Contractor Address",
      labelUrdu: "ٹھیکیدار کا پتہ",
      type: "address",
      required: true,
      group: "Contractor Details",
    },
    {
      name: "workerName",
      label: "Worker / Laborer Name",
      labelUrdu: "مزدور / کارکن کا نام",
      type: "text",
      required: true,
      group: "Worker Details",
    },
    {
      name: "workerFatherName",
      label: "Worker's Father's Name",
      labelUrdu: "مزدور کے والد کا نام",
      type: "text",
      required: true,
      group: "Worker Details",
    },
    {
      name: "workerCnic",
      label: "Worker CNIC",
      labelUrdu: "مزدور کا شناختی کارڈ",
      type: "cnic",
      required: true,
      group: "Worker Details",
    },
    {
      name: "workerAddress",
      label: "Worker Address",
      labelUrdu: "مزدور کا پتہ",
      type: "address",
      required: true,
      group: "Worker Details",
    },
    {
      name: "workDescription",
      label: "Description of Work",
      labelUrdu: "کام کی تفصیل",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Work Details",
    },
    {
      name: "duration",
      label: "Duration of Work",
      labelUrdu: "کام کی مدت",
      type: "text",
      required: true,
      group: "Work Details",
    },
    {
      name: "wages",
      label: "Daily / Monthly Wages (PKR)",
      labelUrdu: "یومیہ / ماہانہ اجرت (روپے)",
      type: "number",
      required: true,
      group: "Financial Details",
    },
    {
      name: "workingConditions",
      label: "Working Conditions",
      labelUrdu: "کام کے حالات",
      type: "textarea",
      required: false,
      aiSuggestable: true,
      group: "Work Details",
    },
    {
      name: "safetyProvisions",
      label: "Safety Provisions",
      labelUrdu: "حفاظتی انتظامات",
      type: "textarea",
      required: false,
      aiSuggestable: true,
      group: "Terms",
    },
    {
      name: "terminationTerms",
      label: "Termination Terms",
      labelUrdu: "معاہدہ ختم کرنے کی شرائط",
      type: "textarea",
      required: false,
      aiSuggestable: true,
      group: "Terms",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a Contract Labor Agreement in {{language}}.

CONTRACTOR:
- Name: {{contractorName}}
- CNIC: {{contractorCnic}}
- Address: {{contractorAddress}}

WORKER/LABORER:
- Name: {{workerName}}
- Father's Name: {{workerFatherName}}
- CNIC: {{workerCnic}}
- Address: {{workerAddress}}

WORK DETAILS:
- Description: {{workDescription}}
- Duration: {{duration}}
- Wages: PKR {{wages}}
- Working Conditions: {{workingConditions}}

SAFETY: {{safetyProvisions}}
TERMINATION: {{terminationTerms}}

Generate a complete Contract Labor Agreement following REFERENCE FORMAT - Follow this exact Pakistani legal format:

CONTRACT LABOR AGREEMENT

This Contract Labor Agreement is made and executed on this ___ day of ___________, 20___ at [City].

BETWEEN:

[Employer Name / Company Name], CNIC No. / NTN [Number], [Address]
(hereinafter called the "EMPLOYER / PRINCIPAL EMPLOYER")

AND

[Contractor Name / Labor Firm], CNIC No. / Registration No. [Number], [Address]
(hereinafter called the "CONTRACTOR")

NOW THEREFORE BOTH PARTIES AGREE AS UNDER:

1. That the Contractor shall supply [Number] skilled / unskilled workers to the Employer for [Type of Work] at [Work Site].
2. That the duration of this contract shall be from [Start Date] to [End Date] / [Duration] months.
3. That the Contractor shall pay wages as per the Government's minimum wage notification and in compliance with the Payment of Wages Act.
4. That the Contractor shall ensure compliance with all applicable labor laws including the Factories Act, Workmen's Compensation Act, and EOBI.
5. That the Contractor shall maintain all records, attendance registers, and wage sheets.
6. That the Employer shall pay the Contractor PKR [Rate] per worker per [day / month].
7. That any dispute arising from this agreement shall be resolved through [labor courts / arbitration].

EMPLOYER                                CONTRACTOR
[Name / Firm Name]                      [Name / Firm Name]
CNIC / NTN: ___________                 CNIC / Reg No.: ___________

Witness 1: ___________________   Witness 2: ___________________

INSTRUCTIONS:
- Title: CONTRACT LABOR AGREEMENT (centered, bold)
- BETWEEN / AND party structure
- Numbered "That..." clauses
- Include labor law compliance, minimum wages, EOBI
- Both signatures at bottom
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
