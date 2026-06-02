import { TemplateDefinition } from "../types";

export const restitutionConjugalRights: TemplateDefinition = {
  category: "family-law",
  subType: "restitution-conjugal-rights",
  name: "Restitution of Conjugal Rights",
  nameUrdu: "بحالی ازدواجی حقوق",
  description: "Restitution of conjugal rights under Section 9 Muslim Family Laws Ordinance 1961",
  descriptionUrdu: "مسلم فیملی لاز آرڈیننس 1961 کی دفعہ 9 کے تحت ازدواجی حقوق کی بحالی",
  icon: "Home",
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
      name: "petitionerFatherName",
      label: "Petitioner's Father's Name",
      labelUrdu: "درخواست گزار کے والد کا نام",
      type: "text",
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
      name: "petitionerRole",
      label: "Petitioner is",
      labelUrdu: "درخواست گزار ہے",
      type: "select",
      required: true,
      options: [
        { value: "husband", label: "Husband", labelUrdu: "شوہر" },
        { value: "wife", label: "Wife", labelUrdu: "بیوی" },
      ],
      group: "Petitioner Details",
    },
    {
      name: "respondentName",
      label: "Respondent's Name",
      labelUrdu: "مدعا علیہ کا نام",
      type: "text",
      required: true,
      group: "Respondent Details",
    },
    {
      name: "respondentCnic",
      label: "Respondent's CNIC",
      labelUrdu: "مدعا علیہ کا شناختی کارڈ",
      type: "cnic",
      required: false,
      group: "Respondent Details",
    },
    {
      name: "respondentAddress",
      label: "Respondent's Address",
      labelUrdu: "مدعا علیہ کا پتہ",
      type: "address",
      required: true,
      group: "Respondent Details",
    },
    {
      name: "marriageDate",
      label: "Date of Marriage",
      labelUrdu: "تاریخ نکاح",
      type: "date",
      required: true,
      group: "Marriage Details",
    },
    {
      name: "nikahRegistrationNo",
      label: "Nikah Registration No.",
      labelUrdu: "نکاح رجسٹریشن نمبر",
      type: "text",
      required: false,
      group: "Marriage Details",
    },
    {
      name: "dateOfLeaving",
      label: "Date Spouse Left Matrimonial Home",
      labelUrdu: "ازدواجی گھر چھوڑنے کی تاریخ",
      type: "date",
      required: true,
      group: "Case Details",
    },
    {
      name: "reconciliationEfforts",
      label: "Efforts Made for Reconciliation",
      labelUrdu: "صلح کی کوششیں",
      type: "textarea",
      required: true,
      group: "Case Details",
    },
    {
      name: "grounds",
      label: "Grounds for Restitution",
      labelUrdu: "بحالی کی بنیاد",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Case Details",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a Restitution of Conjugal Rights petition in {{language}}.

PETITIONER:
- Name: {{petitionerName}}
- Father's Name: {{petitionerFatherName}}
- CNIC: {{petitionerCnic}}
- Role: {{petitionerRole}}

RESPONDENT:
- Name: {{respondentName}}
- CNIC: {{respondentCnic}}
- Address: {{respondentAddress}}

MARRIAGE:
- Date: {{marriageDate}}
- Registration No: {{nikahRegistrationNo}}

CASE DETAILS:
- Date Spouse Left: {{dateOfLeaving}}
- Reconciliation Efforts: {{reconciliationEfforts}}
- Grounds: {{grounds}}

Generate a complete Restitution of Conjugal Rights petition under Section 9 of the West PakistanREFERENCE FORMAT - Follow this exact Pakistani legal format:

IN THE FAMILY COURT AT [CITY]

SUIT FOR RESTITUTION OF CONJUGAL RIGHTS
(Under Section 10, West Pakistan Family Courts Act 1964)

[Husband Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
                                                    ...PLAINTIFF
VERSUS
Mst. [Wife Name] D/o [Father Name], CNIC No. [CNIC], resident of [Address]
                                                    ...DEFENDANT

RESPECTFULLY SHEWETH:

1. That the Plaintiff and Defendant were married on [Nikah Date] at [Place] and the Haq Mehr was PKR [Amount]/-.
2. That the parties lived together as husband and wife at [Matrimonial Home Address].
3. That since [Date], the Defendant has without lawful reason refused to live with the Plaintiff and has left the matrimonial home.
4. That the Plaintiff has made sincere efforts to bring the Defendant back but she has refused to return.
5. That the Plaintiff is ready and willing to fulfill all his marital obligations and has paid / is ready to pay all dues including Mehr and maintenance.

It is therefore most respectfully prayed that this Honourable Court may be pleased to:
(a) Decree restitution of conjugal rights in favor of the Plaintiff;
(b) Direct the Defendant to resume cohabitation within [Period];
(c) Award costs of this suit.

VERIFICATION:
Verified on oath at [City] that the contents are true and correct to the best of my knowledge.

Plaintiff:
[Name] S/o [Father Name]
CNIC: ___________

Advocate: ___________________

INSTRUCTIONS:
- Court heading: IN THE FAMILY COURT AT [CITY] (centered, bold)
- SUIT FOR RESTITUTION OF CONJUGAL RIGHTS heading
- Husband as Plaintiff, Wife as Defendant
- "RESPECTFULLY SHEWETH:" opening
- Numbered "That..." paragraphs: Nikah date, cohabitation, desertion, plaintiff's willingness
- Reference West Pakistan Family Courts Act 1964
- Prayer clause with (a), (b), (c) items
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
