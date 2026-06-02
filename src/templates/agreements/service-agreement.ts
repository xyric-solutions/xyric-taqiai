import { TemplateDefinition } from "../types";

export const serviceAgreement: TemplateDefinition = {
  category: "agreement",
  subType: "service-agreement",
  name: "Service Agreement",
  nameUrdu: "خدمات کا معاہدہ",
  description: "Agreement for provision of services",
  descriptionUrdu: "خدمات کی فراہمی کا معاہدہ",
  icon: "Wrench",
  formFields: [
    {
      name: "providerName",
      label: "Service Provider Name",
      labelUrdu: "خدمات فراہم کنندہ کا نام",
      type: "text",
      required: true,
      group: "Service Provider Details",
    },
    {
      name: "providerCnic",
      label: "Service Provider CNIC",
      labelUrdu: "خدمات فراہم کنندہ کا شناختی کارڈ",
      type: "cnic",
      required: true,
      group: "Service Provider Details",
    },
    {
      name: "providerAddress",
      label: "Service Provider Address",
      labelUrdu: "خدمات فراہم کنندہ کا پتہ",
      type: "address",
      required: true,
      group: "Service Provider Details",
    },
    {
      name: "clientName",
      label: "Client Name",
      labelUrdu: "مؤکل کا نام",
      type: "text",
      required: true,
      group: "Client Details",
    },
    {
      name: "clientCnic",
      label: "Client CNIC",
      labelUrdu: "مؤکل کا شناختی کارڈ",
      type: "cnic",
      required: true,
      group: "Client Details",
    },
    {
      name: "clientAddress",
      label: "Client Address",
      labelUrdu: "مؤکل کا پتہ",
      type: "address",
      required: true,
      group: "Client Details",
    },
    {
      name: "serviceDescription",
      label: "Description of Services",
      labelUrdu: "خدمات کی تفصیل",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Service Details",
    },
    {
      name: "duration",
      label: "Duration of Service (months)",
      labelUrdu: "خدمات کی مدت (مہینے)",
      type: "number",
      required: true,
      group: "Service Details",
    },
    {
      name: "paymentTerms",
      label: "Payment Terms",
      labelUrdu: "ادائیگی کی شرائط",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Financial Details",
    },
    {
      name: "deliverables",
      label: "Deliverables",
      labelUrdu: "حاصلات / نتائج",
      type: "textarea",
      required: false,
      aiSuggestable: true,
      group: "Service Details",
    },
    {
      name: "penaltiesForBreach",
      label: "Penalties for Breach",
      labelUrdu: "خلاف ورزی کی صورت میں جرمانہ",
      type: "textarea",
      required: false,
      aiSuggestable: true,
      group: "Terms",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a Service Agreement in {{language}}.

SERVICE PROVIDER:
- Name: {{providerName}}
- CNIC: {{providerCnic}}
- Address: {{providerAddress}}

CLIENT:
- Name: {{clientName}}
- CNIC: {{clientCnic}}
- Address: {{clientAddress}}

SERVICE DETAILS:
- Description: {{serviceDescription}}
- Duration: {{duration}} months
- Deliverables: {{deliverables}}

PAYMENT TERMS: {{paymentTerms}}

PENALTIES FOR BREACH: {{penaltiesForBreach}}

Generate a complete ServREFERENCE FORMAT - Follow this exact Pakistani legal format:

SERVICE AGREEMENT

This Service Agreement is made and executed on this ___ day of ___________, 20___ at [City].

BETWEEN:

[Client Name / Company], CNIC No. / NTN [Number], [Address]
(hereinafter called the "CLIENT")

AND

[Service Provider Name / Company], CNIC No. / NTN [Number], [Address]
(hereinafter called the "SERVICE PROVIDER")

NOW THEREFORE BOTH PARTIES AGREE AS UNDER:

1. That the Service Provider shall provide [Description of Services] to the Client as detailed in Schedule A.
2. That the services shall be provided from [Start Date] to [End Date] / on an ongoing basis.
3. That the Client shall pay the Service Provider PKR [Fee]/- per [month / project / milestone] as agreed.
4. That the Service Provider shall maintain confidentiality of all client information and data.
5. That either party may terminate this agreement by giving [Notice Period] days written notice.
6. That the Service Provider shall not be liable for delays caused by circumstances beyond its control.
7. That any dispute shall be resolved through arbitration under the Arbitration Act 1940 or courts at [City].

CLIENT                                  SERVICE PROVIDER
[Name / Company]                        [Name / Company]
CNIC / NTN: ___________                 CNIC / NTN: ___________

Witness 1: ___________________   Witness 2: ___________________

INSTRUCTIONS:
- Title: SERVICE AGREEMENT (centered, bold)
- BETWEEN / AND party structure
- Numbered "That..." clauses
- Include service description, fee, termination notice, confidentiality
- Both signatures at bottom
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
