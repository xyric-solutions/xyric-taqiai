import { TemplateDefinition } from "../types";

export const licenseAgreement: TemplateDefinition = {
  category: "agreement",
  subType: "license-agreement",
  name: "License Agreement",
  nameUrdu: "لائسنس معاہدہ",
  description: "Agreement granting license to use property, IP, or brand",
  descriptionUrdu: "جائیداد، دانشورانہ ملکیت، یا برانڈ استعمال کرنے کا لائسنس معاہدہ",
  icon: "BadgeCheck",
  formFields: [
    {
      name: "licensorName",
      label: "Licensor Name",
      labelUrdu: "لائسنس دینے والے کا نام",
      type: "text",
      required: true,
      group: "Licensor Details",
    },
    {
      name: "licensorCnic",
      label: "Licensor CNIC / Registration No",
      labelUrdu: "لائسنس دینے والے کا شناختی کارڈ / رجسٹریشن نمبر",
      type: "text",
      required: true,
      group: "Licensor Details",
    },
    {
      name: "licensorAddress",
      label: "Licensor Address",
      labelUrdu: "لائسنس دینے والے کا پتہ",
      type: "address",
      required: true,
      group: "Licensor Details",
    },
    {
      name: "licenseeName",
      label: "Licensee Name",
      labelUrdu: "لائسنس لینے والے کا نام",
      type: "text",
      required: true,
      group: "Licensee Details",
    },
    {
      name: "licenseeCnic",
      label: "Licensee CNIC / Registration No",
      labelUrdu: "لائسنس لینے والے کا شناختی کارڈ / رجسٹریشن نمبر",
      type: "text",
      required: true,
      group: "Licensee Details",
    },
    {
      name: "licenseeAddress",
      label: "Licensee Address",
      labelUrdu: "لائسنس لینے والے کا پتہ",
      type: "address",
      required: true,
      group: "Licensee Details",
    },
    {
      name: "subjectOfLicense",
      label: "Subject of License (Property / IP / Brand / Software)",
      labelUrdu: "لائسنس کا موضوع (جائیداد / دانشورانہ ملکیت / برانڈ / سافٹ ویئر)",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "License Details",
    },
    {
      name: "scopeOfLicense",
      label: "Scope of License",
      labelUrdu: "لائسنس کا دائرہ کار",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "License Details",
    },
    {
      name: "licenseFee",
      label: "License Fee / Royalty (PKR)",
      labelUrdu: "لائسنس فیس / رائلٹی (روپے)",
      type: "text",
      required: true,
      group: "Financial Terms",
    },
    {
      name: "paymentSchedule",
      label: "Payment Schedule",
      labelUrdu: "ادائیگی کا شیڈول",
      type: "textarea",
      required: false,
      aiSuggestable: true,
      group: "Financial Terms",
    },
    {
      name: "duration",
      label: "License Duration",
      labelUrdu: "لائسنس کی مدت",
      type: "text",
      required: true,
      group: "Duration & Restrictions",
    },
    {
      name: "startDate",
      label: "Start Date",
      labelUrdu: "شروع ہونے کی تاریخ",
      type: "date",
      required: true,
      group: "Duration & Restrictions",
    },
    {
      name: "restrictions",
      label: "Restrictions / Limitations",
      labelUrdu: "پابندیاں / حدود",
      type: "textarea",
      required: false,
      aiSuggestable: true,
      group: "Duration & Restrictions",
    },
    {
      name: "terminationClause",
      label: "Termination Clause",
      labelUrdu: "معاہدہ ختم کرنے کی شق",
      type: "textarea",
      required: false,
      aiSuggestable: true,
      group: "Duration & Restrictions",
    },
    {
      name: "additionalTerms",
      label: "Additional Terms",
      labelUrdu: "اضافی شرائط",
      type: "textarea",
      required: false,
      aiSuggestable: true,
      group: "Additional Terms",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a License Agreement (License Muahida) in {{language}}.

LICENSOR:
- Name: {{licensorName}}
- CNIC/Registration: {{licensorCnic}}
- Address: {{licensorAddress}}

LICENSEE:
- Name: {{licenseeName}}
- CNIC/Registration: {{licenseeCnic}}
- Address: {{licenseeAddress}}

LICENSE DETAILS:
- Subject: {{subjectOfLicense}}
- Scope: {{scopeOfLicense}}
- Fee/Royalty: {{licenseFee}}
- Payment Schedule: {{paymentSchedule}}
- Duration: {{duration}}
- Start Date: {{startDate}}
- Restrictions: {{restrictions}}
- Termination: {{terminationClause}}

ADDITIONAL: {{additionalTerms}}

Generate a complete License Agreement following Pakistani Contract Act and applicable IP laws. Include grant of license, scope and limitations, fee structure, iREFERENCE FORMAT - Follow this exact Pakistani legal format:

LICENSE AGREEMENT

This License Agreement is made and executed on this ___ day of ___________, 20___ at [City].

BETWEEN:

[Licensor Name / Company], CNIC No. / NTN [Number], [Address]
(hereinafter called the "LICENSOR")

AND

[Licensee Name / Company], CNIC No. / NTN [Number], [Address]
(hereinafter called the "LICENSEE")

NOW THEREFORE BOTH PARTIES AGREE AS UNDER:

1. That the Licensor hereby grants to the Licensee a [exclusive / non-exclusive] license to use [Licensed Property - software / trademark / technology / formula] for [Purpose] in [Territory].
2. That the License shall be valid from [Start Date] to [End Date] / for a period of [Duration].
3. That the Licensee shall pay a license fee of PKR [Fee]/- per [year / month / unit].
4. That the Licensee shall not sub-license, assign, or transfer the license to any third party.
5. That the Licensor retains all intellectual property rights in the licensed property.
6. That the Licensee shall maintain confidentiality of any proprietary information.
7. That either party may terminate this agreement for material breach with [Notice Period] days notice.

LICENSOR                                LICENSEE
[Name / Company]                        [Name / Company]
CNIC / NTN: ___________                 CNIC / NTN: ___________

Witness 1: ___________________   Witness 2: ___________________

INSTRUCTIONS:
- Title: LICENSE AGREEMENT (centered, bold)
- BETWEEN / AND party structure
- Numbered "That..." clauses
- Include license fee, territory, duration, no sub-licensing
- Both signatures at bottom
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
