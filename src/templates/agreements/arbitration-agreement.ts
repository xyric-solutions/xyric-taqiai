import { TemplateDefinition } from "../types";

export const arbitrationAgreement: TemplateDefinition = {
  category: "agreement",
  subType: "arbitration-agreement",
  name: "Arbitration Agreement",
  nameUrdu: "ثالثی معاہدہ",
  description: "Agreement for dispute resolution through arbitration",
  descriptionUrdu: "ثالثی کے ذریعے تنازعات کے حل کا معاہدہ",
  icon: "Gavel",
  formFields: [
    {
      name: "party1Name",
      label: "Party 1 Name",
      labelUrdu: "فریق اول کا نام",
      type: "text",
      required: true,
      group: "Party 1 Details",
    },
    {
      name: "party1Cnic",
      label: "Party 1 CNIC / Registration No",
      labelUrdu: "فریق اول کا شناختی کارڈ / رجسٹریشن نمبر",
      type: "text",
      required: true,
      group: "Party 1 Details",
    },
    {
      name: "party1Address",
      label: "Party 1 Address",
      labelUrdu: "فریق اول کا پتہ",
      type: "address",
      required: true,
      group: "Party 1 Details",
    },
    {
      name: "party2Name",
      label: "Party 2 Name",
      labelUrdu: "فریق دوم کا نام",
      type: "text",
      required: true,
      group: "Party 2 Details",
    },
    {
      name: "party2Cnic",
      label: "Party 2 CNIC / Registration No",
      labelUrdu: "فریق دوم کا شناختی کارڈ / رجسٹریشن نمبر",
      type: "text",
      required: true,
      group: "Party 2 Details",
    },
    {
      name: "party2Address",
      label: "Party 2 Address",
      labelUrdu: "فریق دوم کا پتہ",
      type: "address",
      required: true,
      group: "Party 2 Details",
    },
    {
      name: "subjectMatter",
      label: "Subject Matter of Dispute",
      labelUrdu: "تنازعہ کا موضوع",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Dispute Details",
    },
    {
      name: "arbitratorName",
      label: "Arbitrator Name (if agreed)",
      labelUrdu: "ثالث کا نام (اگر طے ہو)",
      type: "text",
      required: false,
      group: "Arbitration Details",
    },
    {
      name: "arbitratorQualification",
      label: "Arbitrator Qualification / Selection Method",
      labelUrdu: "ثالث کی اہلیت / انتخاب کا طریقہ",
      type: "textarea",
      required: false,
      aiSuggestable: true,
      group: "Arbitration Details",
    },
    {
      name: "numberOfArbitrators",
      label: "Number of Arbitrators",
      labelUrdu: "ثالثین کی تعداد",
      type: "select",
      required: true,
      options: [
        { value: "1", label: "Sole Arbitrator", labelUrdu: "واحد ثالث" },
        { value: "3", label: "Panel of Three", labelUrdu: "تین ثالثین کا پینل" },
      ],
      group: "Arbitration Details",
    },
    {
      name: "arbitrationRules",
      label: "Arbitration Rules / Law",
      labelUrdu: "ثالثی کے قوانین",
      type: "select",
      required: true,
      options: [
        { value: "pakistan-arbitration-act-1940", label: "Pakistan Arbitration Act 1940", labelUrdu: "پاکستان ثالثی ایکٹ 1940" },
        { value: "icc-rules", label: "ICC Arbitration Rules", labelUrdu: "آئی سی سی ثالثی قواعد" },
        { value: "uncitral-rules", label: "UNCITRAL Rules", labelUrdu: "یو این سی آئی ٹی آر اے ایل قواعد" },
      ],
      group: "Arbitration Details",
    },
    {
      name: "venue",
      label: "Venue / Seat of Arbitration",
      labelUrdu: "ثالثی کا مقام",
      type: "text",
      required: true,
      group: "Arbitration Details",
    },
    {
      name: "language",
      label: "Language of Arbitration",
      labelUrdu: "ثالثی کی زبان",
      type: "select",
      required: true,
      options: [
        { value: "english", label: "English", labelUrdu: "انگریزی" },
        { value: "urdu", label: "Urdu", labelUrdu: "اردو" },
        { value: "both", label: "English & Urdu", labelUrdu: "انگریزی اور اردو" },
      ],
      group: "Arbitration Details",
    },
    {
      name: "bindingNature",
      label: "Binding Nature of Award",
      labelUrdu: "فیصلے کی پابند نوعیت",
      type: "select",
      required: true,
      options: [
        { value: "binding", label: "Final and Binding", labelUrdu: "حتمی اور پابند" },
        { value: "non-binding", label: "Non-Binding (Advisory)", labelUrdu: "غیر پابند (مشاورتی)" },
      ],
      group: "Arbitration Details",
    },
    {
      name: "costSharing",
      label: "Cost Sharing Arrangement",
      labelUrdu: "اخراجات کی تقسیم کا انتظام",
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
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate an Arbitration Agreement (Salisi Muahida) in {{language}}.

PARTY 1:
- Name: {{party1Name}}
- CNIC/Registration: {{party1Cnic}}
- Address: {{party1Address}}

PARTY 2:
- Name: {{party2Name}}
- CNIC/Registration: {{party2Cnic}}
- Address: {{party2Address}}

DISPUTE: {{subjectMatter}}

ARBITRATION:
- Arbitrator: {{arbitratorName}}
- Qualification/Selection: {{arbitratorQualification}}
- Number of Arbitrators: {{numberOfArbitrators}}
- Rules: {{arbitrationRules}}
- Venue: {{venue}}
- Language: {{language}}
- Binding: {{bindingNature}}
- Costs: {{costSharing}}

ADDITIONAL: {{additionalTerms}}

Generate a complete Arbitration Agreement following Pakistan Arbitration Act 1940. Include agreement to arbitrate, scope of disputes covered, appointment of arbitratREFERENCE FORMAT - Follow this exact Pakistani legal format:

ARBITRATION AGREEMENT

This Arbitration Agreement is made on this ___ day of ___________, 20___ at [City].

BETWEEN:

[First Party Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
(hereinafter called the "FIRST PARTY")

AND

[Second Party Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
(hereinafter called the "SECOND PARTY")

BOTH PARTIES AGREE AS UNDER:

1. That a dispute has arisen between the parties regarding [Subject Matter of Dispute].
2. That both parties have mutually agreed to resolve the said dispute through arbitration under the Arbitration Act 1940.
3. That [Arbitrator Name] S/o [Father Name] of [Address] is hereby appointed as the sole arbitrator, OR a panel of [Number] arbitrators shall be appointed.
4. That the arbitrator(s) shall conduct proceedings at [Venue] and issue a written award within [Duration] days.
5. That the decision of the arbitrator(s) shall be final and binding on both parties.
6. That the costs of arbitration shall be borne [equally / by the losing party].
7. That this agreement shall be governed by the laws of Pakistan.

FIRST PARTY                             SECOND PARTY
[Name]                                  [Name]
CNIC: ___________                       CNIC: ___________

Witness 1: ___________________   Witness 2: ___________________

INSTRUCTIONS:
- Title: ARBITRATION AGREEMENT (centered, bold)
- BETWEEN / AND party structure
- Numbered "That..." clauses
- Include arbitrator name, venue, timeline, binding award
- Reference Arbitration Act 1940
- Both signatures at bottom
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
