import { TemplateDefinition } from "../types";

export const fundamentalRights: TemplateDefinition = {
  category: "constitutional-law",
  subType: "fundamental-rights",
  name: "Fundamental Rights Petition / بنیادی حقوق کی درخواست",
  nameUrdu: "بنیادی حقوق کی درخواست",
  description: "Fundamental rights petition under Article 184(3) of the Constitution of Pakistan 1973",
  descriptionUrdu: "آئین پاکستان 1973 کے آرٹیکل 184(3) کے تحت بنیادی حقوق کی درخواست",
  icon: "Scale",
  formFields: [
    {
      name: "petitionerName",
      label: "Petitioner's Name",
      labelUrdu: "درخواست گزار کا نام",
      type: "text",
      required: true,
      group: "Petitioner Details",
    },
    {
      name: "petitionerAddress",
      label: "Petitioner's Address",
      labelUrdu: "درخواست گزار کا پتہ",
      type: "address",
      required: true,
      group: "Petitioner Details",
    },
    {
      name: "petitionerCnic",
      label: "Petitioner's CNIC",
      labelUrdu: "درخواست گزار کا شناختی کارڈ",
      type: "cnic",
      required: true,
      group: "Petitioner Details",
    },
    {
      name: "rightViolated",
      label: "Fundamental Right Violated (Articles 9-28)",
      labelUrdu: "خلاف ورزی شدہ بنیادی حق (آرٹیکل 9-28)",
      type: "select",
      required: true,
      options: [
        { value: "art-9", label: "Article 9 - Security of Person", labelUrdu: "آرٹیکل 9 - شخصی تحفظ" },
        { value: "art-10", label: "Article 10 - Safeguard as to Arrest", labelUrdu: "آرٹیکل 10 - گرفتاری سے تحفظ" },
        { value: "art-10a", label: "Article 10-A - Right to Fair Trial", labelUrdu: "آرٹیکل 10-الف - منصفانہ مقدمے کا حق" },
        { value: "art-14", label: "Article 14 - Inviolability of Dignity", labelUrdu: "آرٹیکل 14 - عزت نفس کا تحفظ" },
        { value: "art-18", label: "Article 18 - Freedom of Trade", labelUrdu: "آرٹیکل 18 - تجارت کی آزادی" },
        { value: "art-19", label: "Article 19 - Freedom of Speech", labelUrdu: "آرٹیکل 19 - آزادی اظہار" },
        { value: "art-19a", label: "Article 19-A - Right to Information", labelUrdu: "آرٹیکل 19-الف - حق معلومات" },
        { value: "art-20", label: "Article 20 - Freedom of Religion", labelUrdu: "آرٹیکل 20 - مذہبی آزادی" },
        { value: "art-23", label: "Article 23 - Right to Property", labelUrdu: "آرٹیکل 23 - حق ملکیت" },
        { value: "art-25", label: "Article 25 - Equality Before Law", labelUrdu: "آرٹیکل 25 - قانون کے سامنے مساوات" },
        { value: "art-25a", label: "Article 25-A - Right to Education", labelUrdu: "آرٹیکل 25-الف - حق تعلیم" },
        { value: "multiple", label: "Multiple Rights Violated", labelUrdu: "متعدد حقوق کی خلاف ورزی" },
      ],
      group: "Petition Details",
    },
    {
      name: "publicImportance",
      label: "Matter of Public Importance (Justification)",
      labelUrdu: "عوامی اہمیت کا معاملہ (جواز)",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Petition Details",
    },
    {
      name: "facts",
      label: "Facts of the Case",
      labelUrdu: "مقدمے کے حقائق",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Petition Details",
    },
    {
      name: "relief",
      label: "Relief Sought",
      labelUrdu: "مطلوبہ ریلیف",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Petition Details",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a Fundamental Rights Petition in {{language}}.

PETITIONER:
- Name: {{petitionerName}}
- Address: {{petitionerAddress}}
- CNIC: {{petitionerCnic}}

PETITION DETAILS:
- Right Violated: {{rightViolated}}
- Public Importance: {{publicImportance}}
- Facts: {{facts}}
- Relief Sought: {{relief}}

Generate a complete Fundamental Rights Petition under Article 184(3) of the Constitution of Pakistan 1973 before the Supreme Court of Pakistan.
Include proper Supreme Court heading, locus standi, public importance justification, fundamental rights enforcement ground, factual background, questions of law, grounds, prayer clause, and verification.
Demonstrate how the mattREFERENCE FORMAT - Follow this exact Pakistani legal format:

IN THE SUPREME COURT OF PAKISTAN
(ORIGINAL JURISDICTION)

HUMAN RIGHTS CASE / PETITION NO. _______ OF 20___
(Under Article 184(3) of the Constitution of Pakistan 1973)

[Petitioner Name / Organization] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
                                                    ...PETITIONER
VERSUS
[Respondent - Government Authority / Ministry / Department], [Address]
                                                    ...RESPONDENT

PETITION FOR ENFORCEMENT OF FUNDAMENTAL RIGHTS
(Public Importance Petition)

RESPECTFULLY SHEWETH:

1. That this petition involves a question of public importance with reference to enforcement of fundamental rights under [Article No.] of the Constitution.
2. That the Respondent has taken / failed to take action that has resulted in violation of the fundamental rights of [Petitioner / class of persons] guaranteed under Article [___] of the Constitution.
3. That the facts of the case are: [Detailed factual background of the violation].
4. That the Respondent's actions are unconstitutional, arbitrary, and violate the Petitioner's fundamental rights.
5. That this matter involves public importance as [Reason - affects large number of people / systemic violation / constitutional question].

It is therefore most respectfully prayed that this Honourable Court may be pleased to:
(a) Issue directions to the Respondent to [Specific Relief];
(b) Declare the Respondent's action as unconstitutional;
(c) Award appropriate compensation / remedies;
(d) Award costs of this petition.

VERIFICATION:
Verified on oath at [City] that the contents are true and correct to the best of my knowledge.

Petitioner:
[Name] S/o [Father Name]
CNIC: ___________

Advocate: ___________________

INSTRUCTIONS:
- Court heading: IN THE SUPREME COURT OF PAKISTAN (centered, bold)
- Article 184(3) Constitution reference
- PUBLIC IMPORTANCE criteria - both fundamental rights AND public importance must be stated
- "RESPECTFULLY SHEWETH:" opening
- Numbered "That..." paragraphs
- Prayer clause with (a), (b), (c), (d) items
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
