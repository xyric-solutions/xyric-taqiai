import { TemplateDefinition } from "../types";

export const writPetition: TemplateDefinition = {
  category: "constitutional-law",
  subType: "writ-petition",
  name: "Writ Petition / رٹ پٹیشن",
  nameUrdu: "رٹ پٹیشن",
  description: "Writ petition under Article 199 of the Constitution of Pakistan 1973",
  descriptionUrdu: "آئین پاکستان 1973 کے آرٹیکل 199 کے تحت رٹ پٹیشن",
  icon: "Gavel",
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
      name: "respondentName",
      label: "Respondent (Government Authority)",
      labelUrdu: "مدعا علیہ (سرکاری ادارہ)",
      type: "text",
      required: true,
      group: "Respondent Details",
    },
    {
      name: "respondentDesignation",
      label: "Respondent's Designation / Office",
      labelUrdu: "مدعا علیہ کا عہدہ / دفتر",
      type: "text",
      required: true,
      group: "Respondent Details",
    },
    {
      name: "respondentAddress",
      label: "Respondent's Office Address",
      labelUrdu: "مدعا علیہ کے دفتر کا پتہ",
      type: "address",
      required: true,
      group: "Respondent Details",
    },
    {
      name: "fundamentalRight",
      label: "Fundamental Right Violated",
      labelUrdu: "خلاف ورزی شدہ بنیادی حق",
      type: "select",
      required: true,
      options: [
        { value: "art-9", label: "Article 9 - Right to Life & Liberty", labelUrdu: "آرٹیکل 9 - حق زندگی و آزادی" },
        { value: "art-10", label: "Article 10 - Safeguard against Arrest", labelUrdu: "آرٹیکل 10 - گرفتاری سے تحفظ" },
        { value: "art-10a", label: "Article 10-A - Right to Fair Trial", labelUrdu: "آرٹیکل 10-الف - منصفانہ مقدمے کا حق" },
        { value: "art-14", label: "Article 14 - Right to Dignity", labelUrdu: "آرٹیکل 14 - حق عزت" },
        { value: "art-15", label: "Article 15 - Freedom of Movement", labelUrdu: "آرٹیکل 15 - نقل و حرکت کی آزادی" },
        { value: "art-16", label: "Article 16 - Freedom of Assembly", labelUrdu: "آرٹیکل 16 - اجتماع کی آزادی" },
        { value: "art-17", label: "Article 17 - Freedom of Association", labelUrdu: "آرٹیکل 17 - انجمن سازی کی آزادی" },
        { value: "art-18", label: "Article 18 - Freedom of Trade/Business", labelUrdu: "آرٹیکل 18 - تجارت کی آزادی" },
        { value: "art-19", label: "Article 19 - Freedom of Speech", labelUrdu: "آرٹیکل 19 - آزادی اظہار" },
        { value: "art-19a", label: "Article 19-A - Right to Information", labelUrdu: "آرٹیکل 19-الف - حق معلومات" },
        { value: "art-20", label: "Article 20 - Freedom of Religion", labelUrdu: "آرٹیکل 20 - مذہبی آزادی" },
        { value: "art-23", label: "Article 23 - Right to Property", labelUrdu: "آرٹیکل 23 - حق ملکیت" },
        { value: "art-25", label: "Article 25 - Equality Before Law", labelUrdu: "آرٹیکل 25 - قانون کے سامنے مساوات" },
        { value: "art-25a", label: "Article 25-A - Right to Education", labelUrdu: "آرٹیکل 25-الف - حق تعلیم" },
        { value: "other", label: "Other Fundamental Right", labelUrdu: "دیگر بنیادی حق" },
      ],
      group: "Writ Details",
    },
    {
      name: "facts",
      label: "Facts of the Case",
      labelUrdu: "مقدمے کے حقائق",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Writ Details",
    },
    {
      name: "relief",
      label: "Relief Sought",
      labelUrdu: "مطلوبہ ریلیف",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Writ Details",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a Writ Petition in {{language}}.

PETITIONER:
- Name: {{petitionerName}}
- Address: {{petitionerAddress}}
- CNIC: {{petitionerCnic}}

RESPONDENT:
- Name: {{respondentName}}
- Designation: {{respondentDesignation}}
- Address: {{respondentAddress}}

WRIT DETAILS:
- Fundamental Right Violated: {{fundamentalRight}}
- Facts: {{facts}}
- Relief Sought: {{relief}}

REFERENCE FORMAT — Follow this exact Pakistani legal format:

IN THE HIGH COURT OF [PROVINCE] AT [CITY]

WRIT PETITION NO. _______ OF 20___

[Petitioner Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
                                                                    ...PETITIONER

VERSUS

[Respondent Name / Authority], [Designation], [Address]
                                                                    ...RESPONDENT

CONSTITUTIONAL PETITION UNDER ARTICLE 199 OF THE CONSTITUTION OF THE ISLAMIC REPUBLIC OF PAKISTAN 1973

RESPECTFULLY SHEWETH:

1. That the Petitioner is a citizen of Pakistan whose fundamental right of [Fundamental Right] guaranteed under [Article No.] of the Constitution of Pakistan 1973 has been violated by the Respondent.

2. That the brief facts of the case are as follows:
   [Detailed factual background]

3. That the Respondent has acted [illegally / without lawful authority / in excess of jurisdiction / arbitrarily] by [specific impugned act or order].

4. That the impugned action / order / decision of the Respondent is:
   (i) Unconstitutional being in violation of Article [___] of the Constitution;
   (ii) Illegal and without lawful authority;
   (iii) An infringement of the Petitioner's fundamental rights.

5. That the Petitioner has no other adequate remedy available except through this Constitutional Petition.

It is therefore most respectfully prayed that this Honourable Court may be pleased to:
(a) Issue a Writ of [Mandamus / Certiorari / Prohibition / Quo Warranto] directing the Respondent to [specific relief];
(b) Suspend the impugned order/action during pendency of this petition;
(c) [Any additional relief];
(d) Award costs of this petition.

VERIFICATION:
Verified on oath at [City] that the contents are true and correct to the best of my knowledge.

Petitioner:
[Name] S/o [Father Name]
CNIC: ___________

Advocate: ___________________
Bar No.: ___________________

INSTRUCTIONS:
- Court heading: IN THE HIGH COURT OF [PROVINCE] AT [CITY] (centered, bold)
- Petitioner vs Respondent identification
- "RESPECTFULLY SHEWETH:" opening
- Numbered "That..." paragraphs
- Constitutional grounds: Article references
- Prayer clause with (a), (b), (c), (d) items — specify writ type
- Article 199 reference
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
