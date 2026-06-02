import { TemplateDefinition } from "../types";

export const constructionContract: TemplateDefinition = {
  category: "agreement",
  subType: "construction-contract",
  name: "Construction Contract",
  nameUrdu: "تعمیراتی معاہدہ",
  description: "Construction contract between owner and contractor",
  descriptionUrdu: "مالک اور ٹھیکیدار کے درمیان تعمیراتی معاہدہ",
  icon: "HardHat",
  formFields: [
    {
      name: "ownerName",
      label: "Owner / Client Name",
      labelUrdu: "مالک / کلائنٹ کا نام",
      type: "text",
      required: true,
      group: "Owner Details",
    },
    {
      name: "ownerCnic",
      label: "Owner CNIC",
      labelUrdu: "مالک کا شناختی کارڈ",
      type: "cnic",
      required: true,
      group: "Owner Details",
    },
    {
      name: "ownerAddress",
      label: "Owner Address",
      labelUrdu: "مالک کا پتہ",
      type: "address",
      required: true,
      group: "Owner Details",
    },
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
      name: "projectDescription",
      label: "Project Description",
      labelUrdu: "منصوبے کی تفصیل",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Project Details",
    },
    {
      name: "projectAddress",
      label: "Project / Construction Site Address",
      labelUrdu: "تعمیراتی مقام کا پتہ",
      type: "address",
      required: true,
      group: "Project Details",
    },
    {
      name: "estimatedCost",
      label: "Estimated Cost (PKR)",
      labelUrdu: "تخمینی لاگت (روپے)",
      type: "number",
      required: true,
      group: "Financial Details",
    },
    {
      name: "paymentSchedule",
      label: "Payment Schedule",
      labelUrdu: "ادائیگی کا شیڈول",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Financial Details",
    },
    {
      name: "timeline",
      label: "Project Timeline / Completion Date",
      labelUrdu: "منصوبے کی تکمیل کی تاریخ",
      type: "text",
      required: true,
      group: "Project Details",
    },
    {
      name: "materialSpecifications",
      label: "Material Specifications",
      labelUrdu: "مواد کی تفصیلات",
      type: "textarea",
      required: false,
      aiSuggestable: true,
      group: "Project Details",
    },
    {
      name: "warrantyPeriod",
      label: "Warranty Period (months)",
      labelUrdu: "گارنٹی کی مدت (مہینے)",
      type: "number",
      required: false,
      group: "Terms",
    },
    {
      name: "penaltyForDelay",
      label: "Penalty for Delay",
      labelUrdu: "تاخیر کی صورت میں جرمانہ",
      type: "textarea",
      required: false,
      aiSuggestable: true,
      group: "Terms",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a Construction Contract in {{language}}.

OWNER/CLIENT:
- Name: {{ownerName}}
- CNIC: {{ownerCnic}}
- Address: {{ownerAddress}}

CONTRACTOR:
- Name: {{contractorName}}
- CNIC: {{contractorCnic}}
- Address: {{contractorAddress}}

PROJECT:
- Description: {{projectDescription}}
- Site Address: {{projectAddress}}
- Timeline: {{timeline}}
- Materials: {{materialSpecifications}}

FINANCIAL:
- Estimated Cost: PKR {{estimatedCost}}
- Payment Schedule: {{paymentSchedule}}

TERMS:
- Warranty: {{warrantyPeriod}} months
- Delay Penalty: {{penaltyForDelay}}

Generate a complete Construction Contract following PakistanREFERENCE FORMAT - Follow this exact Pakistani legal format:

CONSTRUCTION CONTRACT AGREEMENT

This Construction Contract is made and executed on this ___ day of ___________, 20___ at [City].

BETWEEN:

[Owner Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
(hereinafter called the "OWNER / CLIENT")

AND

[Contractor Name / Firm Name], CNIC No. / Registration No. [CNIC/RegNo], [Address]
(hereinafter called the "CONTRACTOR")

PROJECT DETAILS:
- Site Address: [Construction Site Address]
- Project: [Type - House / Commercial Building / Other]
- Total Built-up Area: [Area]

NOW THEREFORE BOTH PARTIES AGREE AS UNDER:

1. That the Contractor shall complete the construction of [Project Description] as per the approved drawings and specifications within [Duration] months from [Start Date].
2. That the total contract price shall be PKR [Amount]/- payable in installments as per the agreed schedule.
3. That the Contractor shall provide all labor, materials, and equipment unless otherwise specified.
4. That the quality of materials and workmanship shall conform to PSQCA standards and specifications.
5. That any variation in scope shall be agreed in writing before execution.
6. That the Contractor shall be liable for any defects in construction for a period of [Defect Liability Period] after completion.
7. That any dispute shall be resolved through arbitration under the Arbitration Act 1940.

OWNER / CLIENT                          CONTRACTOR
[Name]                                  [Name / Firm Name]
CNIC: ___________                       CNIC / Reg No.: ___________

Witness 1: ___________________   Witness 2: ___________________

INSTRUCTIONS:
- Title: CONSTRUCTION CONTRACT AGREEMENT (centered, bold)
- BETWEEN / AND party structure
- PROJECT DETAILS section
- Numbered "That..." clauses
- Include payment schedule, quality standards, defect liability
- Both signatures at bottom
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
