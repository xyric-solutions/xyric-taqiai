import { TemplateDefinition } from "../types";

export const subContract: TemplateDefinition = {
  category: "agreement",
  subType: "sub-contract",
  name: "Sub-Contract Agreement",
  nameUrdu: "ذیلی ٹھیکہ معاہدہ",
  description: "Sub-contracting agreement for delegating project work",
  descriptionUrdu: "پروجیکٹ کا کام سونپنے کے لیے ذیلی ٹھیکہ معاہدہ",
  icon: "GitBranch",
  formFields: [
    {
      name: "mainContractorName",
      label: "Main Contractor Name",
      labelUrdu: "مرکزی ٹھیکیدار کا نام",
      type: "text",
      required: true,
      group: "Main Contractor Details",
    },
    {
      name: "mainContractorCnic",
      label: "Main Contractor CNIC / Registration No",
      labelUrdu: "مرکزی ٹھیکیدار کا شناختی کارڈ / رجسٹریشن نمبر",
      type: "text",
      required: true,
      group: "Main Contractor Details",
    },
    {
      name: "mainContractorAddress",
      label: "Main Contractor Address",
      labelUrdu: "مرکزی ٹھیکیدار کا پتہ",
      type: "address",
      required: true,
      group: "Main Contractor Details",
    },
    {
      name: "subContractorName",
      label: "Sub-Contractor Name",
      labelUrdu: "ذیلی ٹھیکیدار کا نام",
      type: "text",
      required: true,
      group: "Sub-Contractor Details",
    },
    {
      name: "subContractorCnic",
      label: "Sub-Contractor CNIC / Registration No",
      labelUrdu: "ذیلی ٹھیکیدار کا شناختی کارڈ / رجسٹریشن نمبر",
      type: "text",
      required: true,
      group: "Sub-Contractor Details",
    },
    {
      name: "subContractorAddress",
      label: "Sub-Contractor Address",
      labelUrdu: "ذیلی ٹھیکیدار کا پتہ",
      type: "address",
      required: true,
      group: "Sub-Contractor Details",
    },
    {
      name: "mainProjectReference",
      label: "Main Project / Contract Reference",
      labelUrdu: "مرکزی پروجیکٹ / ٹھیکہ حوالہ",
      type: "text",
      required: true,
      group: "Project Details",
    },
    {
      name: "projectLocation",
      label: "Project Location",
      labelUrdu: "پروجیکٹ کا مقام",
      type: "address",
      required: true,
      group: "Project Details",
    },
    {
      name: "scopeOfWork",
      label: "Scope of Sub-Contract Work",
      labelUrdu: "ذیلی ٹھیکے کے کام کا دائرہ کار",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Work Details",
    },
    {
      name: "contractAmount",
      label: "Sub-Contract Amount (PKR)",
      labelUrdu: "ذیلی ٹھیکے کی رقم (روپے)",
      type: "number",
      required: true,
      group: "Financial Terms",
    },
    {
      name: "paymentTerms",
      label: "Payment Terms & Schedule",
      labelUrdu: "ادائیگی کی شرائط و شیڈول",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Financial Terms",
    },
    {
      name: "startDate",
      label: "Work Start Date",
      labelUrdu: "کام شروع ہونے کی تاریخ",
      type: "date",
      required: true,
      group: "Timeline",
    },
    {
      name: "completionDate",
      label: "Expected Completion Date",
      labelUrdu: "متوقع تکمیل کی تاریخ",
      type: "date",
      required: true,
      group: "Timeline",
    },
    {
      name: "penaltyClause",
      label: "Delay Penalty Clause",
      labelUrdu: "تاخیر پر جرمانے کی شق",
      type: "textarea",
      required: false,
      aiSuggestable: true,
      group: "Terms",
    },
    {
      name: "additionalTerms",
      label: "Additional Terms",
      labelUrdu: "اضافی شرائط",
      type: "textarea",
      required: false,
      aiSuggestable: true,
      group: "Terms",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a Sub-Contract Agreement (Zaili Theka Muahida) in {{language}}.

MAIN CONTRACTOR:
- Name: {{mainContractorName}}
- CNIC/Registration: {{mainContractorCnic}}
- Address: {{mainContractorAddress}}

SUB-CONTRACTOR:
- Name: {{subContractorName}}
- CNIC/Registration: {{subContractorCnic}}
- Address: {{subContractorAddress}}

PROJECT:
- Main Project Reference: {{mainProjectReference}}
- Location: {{projectLocation}}
- Scope of Work: {{scopeOfWork}}

FINANCIAL:
- Contract Amount: PKR {{contractAmount}}
- Payment Terms: {{paymentTerms}}

TIMELINE:
- Start: {{startDate}}
- Completion: {{completionDate}}

TERMS:
- Penalty: {{penaltyClause}}
- Additional: {{additionalTerms}}

Generate a complete Sub-Contract Agreement following Pakistani Contract Act. Include scope of work, relationship to main contract, materials and labor,REFERENCE FORMAT - Follow this exact Pakistani legal format:

SUB-CONTRACT AGREEMENT

This Sub-Contract Agreement is made and executed on this ___ day of ___________, 20___ at [City].

BETWEEN:

[Main Contractor Name / Firm], Registration No. [Number], [Address]
(hereinafter called the "MAIN CONTRACTOR")

AND

[Sub-Contractor Name / Firm], CNIC No. / Registration No. [Number], [Address]
(hereinafter called the "SUB-CONTRACTOR")

PROJECT DETAILS:
- Project: [Project Name / Description]
- Site: [Site Address]
- Sub-Contracted Work: [Description of Sub-Contracted Work]

NOW THEREFORE BOTH PARTIES AGREE AS UNDER:

1. That the Main Contractor sub-contracts to the Sub-Contractor the work described above to be completed within [Duration] from [Start Date].
2. That the total sub-contract price shall be PKR [Amount]/- payable in installments as per the agreed milestone schedule.
3. That the Sub-Contractor shall comply with all quality standards and specifications as per the main contract.
4. That the Sub-Contractor shall be liable for all safety, labor welfare, and compliance obligations at the site.
5. That a delay penalty of PKR [Penalty Amount]/- per day shall apply for any delays beyond the agreed completion date.
6. That the Main Contractor may terminate this sub-contract for breach with [Notice Period] days written notice.

MAIN CONTRACTOR                         SUB-CONTRACTOR
[Name / Firm]                           [Name / Firm]
Reg No.: ___________                    CNIC / Reg No.: ___________

Witness 1: ___________________   Witness 2: ___________________

INSTRUCTIONS:
- Title: SUB-CONTRACT AGREEMENT (centered, bold)
- BETWEEN / AND party structure
- PROJECT DETAILS section
- Numbered "That..." clauses
- Include price, quality standards, delay penalty
- Both signatures at bottom
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
