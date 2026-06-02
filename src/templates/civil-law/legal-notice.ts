import { TemplateDefinition } from "../types";

export const legalNotice: TemplateDefinition = {
  category: "civil-law",
  subType: "legal-notice",
  name: "Legal Notice / قانونی نوٹس",
  nameUrdu: "قانونی نوٹس",
  description: "Legal notice under Section 80 of the Code of Civil Procedure 1908",
  descriptionUrdu: "ضابطہ دیوانی 1908 کی دفعہ 80 کے تحت قانونی نوٹس",
  icon: "Mail",
  formFields: [
    {
      name: "senderName",
      label: "Sender's Name",
      labelUrdu: "بھیجنے والے کا نام",
      type: "text",
      required: true,
      group: "Sender Details",
    },
    {
      name: "senderAddress",
      label: "Sender's Address",
      labelUrdu: "بھیجنے والے کا پتہ",
      type: "address",
      required: true,
      group: "Sender Details",
    },
    {
      name: "senderCnic",
      label: "Sender's CNIC",
      labelUrdu: "بھیجنے والے کا شناختی کارڈ",
      type: "cnic",
      required: false,
      group: "Sender Details",
    },
    {
      name: "recipientName",
      label: "Recipient's Name",
      labelUrdu: "وصول کنندہ کا نام",
      type: "text",
      required: true,
      group: "Recipient Details",
    },
    {
      name: "recipientAddress",
      label: "Recipient's Address",
      labelUrdu: "وصول کنندہ کا پتہ",
      type: "address",
      required: true,
      group: "Recipient Details",
    },
    {
      name: "subject",
      label: "Subject of Notice",
      labelUrdu: "نوٹس کا موضوع",
      type: "text",
      required: true,
      group: "Notice Details",
    },
    {
      name: "demand",
      label: "Demand / Relief Sought",
      labelUrdu: "مطالبہ / مطلوبہ ریلیف",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Notice Details",
    },
    {
      name: "deadline",
      label: "Deadline for Compliance (Days)",
      labelUrdu: "تعمیل کی آخری مہلت (دن)",
      type: "number",
      required: true,
      group: "Notice Details",
    },
    {
      name: "facts",
      label: "Facts of the Case",
      labelUrdu: "مقدمے کے حقائق",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Notice Details",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a Legal Notice in {{language}}.

SENDER:
- Name: {{senderName}}
- Address: {{senderAddress}}
- CNIC: {{senderCnic}}

RECIPIENT:
- Name: {{recipientName}}
- Address: {{recipientAddress}}

NOTICE DETAILS:
- Subject: {{subject}}
- Demand: {{demand}}
- Deadline: {{deadline}} days
- Facts: {{facts}}

REFERENCE FORMAT — Follow this exact Pakistani legal format:

LEGAL NOTICE

FROM:
[Sender Name] S/o [Father Name], CNIC No. [CNIC]
[Sender Address]
Through: [Advocate Name], Advocate, [Bar Council]

TO:
[Recipient Name]
[Recipient Address]

SUBJECT: Legal Notice — [Subject]

Dear Sir/Madam,

Under instructions from and on behalf of my client [Sender Name], I hereby serve upon you this Legal Notice as under:

1. That my client [Sender Name] [background facts and relationship with recipient].
2. That [factual background of the dispute/grievance in detail].
3. That [specific instance of breach / wrong / default / liability].
4. That despite repeated requests and reminders, you have failed and refused to [comply with obligation / pay the amount / perform the act].
5. That my client's loss/damage on account of your default amounts to PKR [Amount]/-.

You are hereby called upon to [specific demand — pay / vacate / stop / perform] within [Deadline] days from the date of receipt of this notice, failing which my client shall be constrained to initiate legal proceedings against you before the competent court of law for recovery of [Amount] together with damages, costs, and charges, at your risk and cost.

This Notice is being issued without prejudice to any other rights and remedies available to my client under law.

[Advocate Name]
Advocate, [Bar Council]
Phone: ___________
On behalf of: [Sender Name]

Date: _______________

INSTRUCTIONS:
- Title: LEGAL NOTICE (centered, bold)
- FROM: and TO: header blocks
- SUBJECT: line
- "Under instructions from and on behalf of my client..." opening
- Numbered "That..." paragraphs for facts
- Clear demand with deadline
- "Without prejudice" statement
- Signed by Advocate on behalf of client
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
