import { TemplateDefinition } from "../types";

export const agencyAgreement: TemplateDefinition = {
  category: "agreement",
  subType: "agency-agreement",
  name: "Agency Agreement",
  nameUrdu: "ایجنسی معاہدہ",
  description: "Agreement for appointing an agent for business purposes",
  descriptionUrdu: "کاروباری مقاصد کے لیے ایجنٹ مقرر کرنے کا معاہدہ",
  icon: "UserCog",
  formFields: [
    {
      name: "principalName",
      label: "Principal (Company/Person) Name",
      labelUrdu: "مؤکل (کمپنی/شخص) کا نام",
      type: "text",
      required: true,
      group: "Principal Details",
    },
    {
      name: "principalCnic",
      label: "Principal CNIC / Registration No",
      labelUrdu: "مؤکل کا شناختی کارڈ / رجسٹریشن نمبر",
      type: "text",
      required: true,
      group: "Principal Details",
    },
    {
      name: "principalAddress",
      label: "Principal Address",
      labelUrdu: "مؤکل کا پتہ",
      type: "address",
      required: true,
      group: "Principal Details",
    },
    {
      name: "agentName",
      label: "Agent Name",
      labelUrdu: "ایجنٹ کا نام",
      type: "text",
      required: true,
      group: "Agent Details",
    },
    {
      name: "agentFatherName",
      label: "Agent's Father's Name",
      labelUrdu: "ایجنٹ کے والد کا نام",
      type: "text",
      required: true,
      group: "Agent Details",
    },
    {
      name: "agentCnic",
      label: "Agent CNIC",
      labelUrdu: "ایجنٹ کا شناختی کارڈ",
      type: "cnic",
      required: true,
      group: "Agent Details",
    },
    {
      name: "agentAddress",
      label: "Agent Address",
      labelUrdu: "ایجنٹ کا پتہ",
      type: "address",
      required: true,
      group: "Agent Details",
    },
    {
      name: "scopeOfAgency",
      label: "Scope of Agency",
      labelUrdu: "ایجنسی کا دائرہ کار",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Agency Terms",
    },
    {
      name: "territory",
      label: "Territory / Area",
      labelUrdu: "علاقہ / حدود",
      type: "text",
      required: false,
      group: "Agency Terms",
    },
    {
      name: "commissionRate",
      label: "Commission / Remuneration",
      labelUrdu: "کمیشن / معاوضہ",
      type: "text",
      required: true,
      group: "Financial Terms",
    },
    {
      name: "paymentTerms",
      label: "Payment Terms",
      labelUrdu: "ادائیگی کی شرائط",
      type: "textarea",
      required: false,
      aiSuggestable: true,
      group: "Financial Terms",
    },
    {
      name: "duration",
      label: "Duration of Agreement",
      labelUrdu: "معاہدے کی مدت",
      type: "text",
      required: true,
      group: "Duration & Termination",
    },
    {
      name: "startDate",
      label: "Start Date",
      labelUrdu: "شروع ہونے کی تاریخ",
      type: "date",
      required: true,
      group: "Duration & Termination",
    },
    {
      name: "terminationClause",
      label: "Termination Clause",
      labelUrdu: "معاہدہ ختم کرنے کی شق",
      type: "textarea",
      required: false,
      aiSuggestable: true,
      group: "Duration & Termination",
    },
    {
      name: "additionalTerms",
      label: "Additional Terms & Conditions",
      labelUrdu: "اضافی شرائط و ضوابط",
      type: "textarea",
      required: false,
      aiSuggestable: true,
      group: "Additional Terms",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate an Agency Agreement (Agency Muahida) in {{language}}.

PRINCIPAL:
- Name: {{principalName}}
- CNIC/Registration: {{principalCnic}}
- Address: {{principalAddress}}

AGENT:
- Name: {{agentName}}
- Father's Name: {{agentFatherName}}
- CNIC: {{agentCnic}}
- Address: {{agentAddress}}

AGENCY TERMS:
- Scope: {{scopeOfAgency}}
- Territory: {{territory}}
- Commission: {{commissionRate}}
- Payment Terms: {{paymentTerms}}
- Duration: {{duration}}
- Start Date: {{startDate}}
- Termination: {{terminationClause}}

ADDITIONAL: {{additionalTerms}}

Generate a complete Agency Agreement following Pakistani Contract Act (Sections 182-238). Include appointment clause, scope of authority, agREFERENCE FORMAT - Follow this exact Pakistani legal format:

AGENCY AGREEMENT

This Agency Agreement is made and executed on this ___ day of ___________, 20___ at [City].

BETWEEN:

[Principal Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
(hereinafter called the "PRINCIPAL")

AND

[Agent Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
(hereinafter called the "AGENT")

NOW THEREFORE BOTH PARTIES AGREE AS UNDER:

1. That the Principal hereby appoints the Agent as his/her authorized agent for [Territory / Area] to [Purpose - sell products / collect payments / represent the Principal].
2. That the Agent shall perform his/her duties diligently and in the best interests of the Principal.
3. That the Agent's commission / remuneration shall be [Commission %] on [Gross Sales / Net Receipts] payable [monthly / upon collection].
4. That the Agent shall maintain proper records and submit monthly accounts to the Principal.
5. That the Agent shall not represent any competitor or conflicting interests during the term of this agreement.
6. That either party may terminate this agreement by giving [Notice Period] days written notice to the other party.
7. That this agreement shall be governed by the laws of Pakistan and any dispute shall be resolved through [arbitration / courts at City].

PRINCIPAL                               AGENT
[Name]                                  [Name]
CNIC: ___________                       CNIC: ___________

Witness 1: ___________________   Witness 2: ___________________
CNIC: ___________                CNIC: ___________

INSTRUCTIONS:
- Title: AGENCY AGREEMENT (centered, bold)
- BETWEEN / AND party structure
- Numbered "That..." clauses
- Include commission terms, duties, termination notice
- Both signatures at bottom
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
