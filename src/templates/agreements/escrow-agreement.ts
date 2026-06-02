import { TemplateDefinition } from "../types";

export const escrowAgreement: TemplateDefinition = {
  category: "agreement",
  subType: "escrow-agreement",
  name: "Escrow Agreement",
  nameUrdu: "امانت معاہدہ",
  description: "Agreement for holding funds or property in escrow by a neutral agent",
  descriptionUrdu: "غیر جانبدار ایجنٹ کے ذریعے رقم یا جائیداد امانت میں رکھنے کا معاہدہ",
  icon: "Vault",
  formFields: [
    {
      name: "depositorName",
      label: "Depositor Name",
      labelUrdu: "امانت رکھوانے والے کا نام",
      type: "text",
      required: true,
      group: "Depositor Details",
    },
    {
      name: "depositorCnic",
      label: "Depositor CNIC",
      labelUrdu: "امانت رکھوانے والے کا شناختی کارڈ",
      type: "cnic",
      required: true,
      group: "Depositor Details",
    },
    {
      name: "depositorAddress",
      label: "Depositor Address",
      labelUrdu: "امانت رکھوانے والے کا پتہ",
      type: "address",
      required: true,
      group: "Depositor Details",
    },
    {
      name: "beneficiaryName",
      label: "Beneficiary Name",
      labelUrdu: "مستفید کا نام",
      type: "text",
      required: true,
      group: "Beneficiary Details",
    },
    {
      name: "beneficiaryCnic",
      label: "Beneficiary CNIC",
      labelUrdu: "مستفید کا شناختی کارڈ",
      type: "cnic",
      required: true,
      group: "Beneficiary Details",
    },
    {
      name: "beneficiaryAddress",
      label: "Beneficiary Address",
      labelUrdu: "مستفید کا پتہ",
      type: "address",
      required: true,
      group: "Beneficiary Details",
    },
    {
      name: "escrowAgentName",
      label: "Escrow Agent Name",
      labelUrdu: "امانت دار / ایجنٹ کا نام",
      type: "text",
      required: true,
      group: "Escrow Agent Details",
    },
    {
      name: "escrowAgentCnic",
      label: "Escrow Agent CNIC / Registration No",
      labelUrdu: "امانت دار کا شناختی کارڈ / رجسٹریشن نمبر",
      type: "text",
      required: true,
      group: "Escrow Agent Details",
    },
    {
      name: "escrowAgentAddress",
      label: "Escrow Agent Address",
      labelUrdu: "امانت دار کا پتہ",
      type: "address",
      required: true,
      group: "Escrow Agent Details",
    },
    {
      name: "escrowProperty",
      label: "Escrow Amount / Property Description",
      labelUrdu: "امانت کی رقم / جائیداد کی تفصیل",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Escrow Details",
    },
    {
      name: "escrowAmount",
      label: "Escrow Amount (PKR) - if monetary",
      labelUrdu: "امانت کی رقم (روپے) - اگر مالی ہو",
      type: "number",
      required: false,
      group: "Escrow Details",
    },
    {
      name: "releaseConditions",
      label: "Conditions for Release of Escrow",
      labelUrdu: "امانت کی واپسی کی شرائط",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Release Terms",
    },
    {
      name: "timeline",
      label: "Timeline / Deadline",
      labelUrdu: "مدت / آخری تاریخ",
      type: "text",
      required: true,
      group: "Release Terms",
    },
    {
      name: "agentFee",
      label: "Escrow Agent Fee (PKR)",
      labelUrdu: "امانت دار کی فیس (روپے)",
      type: "number",
      required: false,
      group: "Financial Terms",
    },
    {
      name: "disputeResolution",
      label: "Dispute Resolution Mechanism",
      labelUrdu: "تنازعات کے حل کا طریقہ",
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
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate an Escrow Agreement (Amanat Muahida) in {{language}}.

DEPOSITOR:
- Name: {{depositorName}}
- CNIC: {{depositorCnic}}
- Address: {{depositorAddress}}

BENEFICIARY:
- Name: {{beneficiaryName}}
- CNIC: {{beneficiaryCnic}}
- Address: {{beneficiaryAddress}}

ESCROW AGENT:
- Name: {{escrowAgentName}}
- CNIC/Registration: {{escrowAgentCnic}}
- Address: {{escrowAgentAddress}}

ESCROW DETAILS:
- Property/Amount: {{escrowProperty}}
- Amount: PKR {{escrowAmount}}
- Release Conditions: {{releaseConditions}}
- Timeline: {{timeline}}
- Agent Fee: PKR {{agentFee}}

DISPUTE RESOLUTION: {{disputeResolution}}
ADDITIONAL: {{additionalTerms}}

Generate a complete Escrow Agreement following Pakistani Contract Act and Trust Act. Include escrow deposit terms, agent's duties and liabilitREFERENCE FORMAT - Follow this exact Pakistani legal format:

ESCROW AGREEMENT

This Escrow Agreement is made and executed on this ___ day of ___________, 20___ at [City].

BETWEEN:

[Depositor Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
(hereinafter called the "DEPOSITOR / FIRST PARTY")

AND

[Beneficiary Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
(hereinafter called the "BENEFICIARY / SECOND PARTY")

AND

[Escrow Agent Name / Bank Name], [Address]
(hereinafter called the "ESCROW AGENT")

NOW THEREFORE ALL PARTIES AGREE AS UNDER:

1. That the Depositor shall deposit PKR [Amount]/- / [Documents/Assets] with the Escrow Agent to be held in escrow.
2. That the Escrow Agent shall hold the said amount / documents until the occurrence of [Condition for Release].
3. That upon fulfillment of the said condition, the Escrow Agent shall release the funds / documents to the Beneficiary.
4. That the Escrow Agent's fee of PKR [Fee]/- shall be borne by [Depositor / Beneficiary / equally].
5. That neither party shall instruct the Escrow Agent to release funds without mutual written consent or the specified condition being met.

DEPOSITOR                   BENEFICIARY               ESCROW AGENT
[Name]                      [Name]                    [Name]
CNIC: ___________           CNIC: ___________         CNIC: ___________

Witness 1: ___________________   Witness 2: ___________________

INSTRUCTIONS:
- Title: ESCROW AGREEMENT (centered, bold)
- THREE party structure (Depositor, Beneficiary, Escrow Agent)
- Numbered "That..." clauses
- Include release conditions, escrow agent fee
- Three signatures at bottom
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
