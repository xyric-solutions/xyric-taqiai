import { TemplateDefinition } from "../types";

export const defamationSuit: TemplateDefinition = {
  category: "civil-law",
  subType: "defamation-suit",
  name: "Defamation Suit (Civil) / ہتک عزت کا دعویٰ",
  nameUrdu: "ہتک عزت کا دعویٰ",
  description: "Civil suit for defamation under the Defamation Ordinance 2002",
  descriptionUrdu: "ہتک عزت آرڈیننس 2002 کے تحت ہتک عزت کا دیوانی دعویٰ",
  icon: "MessageSquareWarning",
  formFields: [
    {
      name: "plaintiffName",
      label: "Plaintiff's Name",
      labelUrdu: "مدعی کا نام",
      type: "text",
      required: true,
      group: "Plaintiff Details",
    },
    {
      name: "plaintiffAddress",
      label: "Plaintiff's Address",
      labelUrdu: "مدعی کا پتہ",
      type: "address",
      required: true,
      group: "Plaintiff Details",
    },
    {
      name: "plaintiffCnic",
      label: "Plaintiff's CNIC",
      labelUrdu: "مدعی کا شناختی کارڈ",
      type: "cnic",
      required: true,
      group: "Plaintiff Details",
    },
    {
      name: "defendantName",
      label: "Defendant's Name",
      labelUrdu: "مدعا علیہ کا نام",
      type: "text",
      required: true,
      group: "Defendant Details",
    },
    {
      name: "defendantAddress",
      label: "Defendant's Address",
      labelUrdu: "مدعا علیہ کا پتہ",
      type: "address",
      required: true,
      group: "Defendant Details",
    },
    {
      name: "defamatoryStatement",
      label: "Defamatory Statement / Content",
      labelUrdu: "ہتک آمیز بیان / مواد",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Defamation Details",
    },
    {
      name: "medium",
      label: "Medium of Publication",
      labelUrdu: "اشاعت کا ذریعہ",
      type: "select",
      required: true,
      options: [
        { value: "social-media", label: "Social Media", labelUrdu: "سوشل میڈیا" },
        { value: "newspaper", label: "Newspaper / Print Media", labelUrdu: "اخبار / پرنٹ میڈیا" },
        { value: "television", label: "Television / Electronic Media", labelUrdu: "ٹیلی ویژن / الیکٹرانک میڈیا" },
        { value: "verbal", label: "Verbal / Spoken", labelUrdu: "زبانی" },
        { value: "online", label: "Website / Online Portal", labelUrdu: "ویب سائٹ / آن لائن" },
        { value: "other", label: "Other", labelUrdu: "دیگر" },
      ],
      group: "Defamation Details",
    },
    {
      name: "damagesClaimed",
      label: "Damages Claimed (PKR)",
      labelUrdu: "مطالبہ نقصانات (روپے)",
      type: "number",
      required: true,
      group: "Defamation Details",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a Civil Defamation Suit in {{language}}.

PLAINTIFF:
- Name: {{plaintiffName}}
- Address: {{plaintiffAddress}}
- CNIC: {{plaintiffCnic}}

DEFENDANT:
- Name: {{defendantName}}
- Address: {{defendantAddress}}

DEFAMATION DETAILS:
- Defamatory Statement: {{defamatoryStatement}}
- Medium: {{medium}}
- Damages Claimed: PKR {{damagesClaimed}}

Generate a complete Civil Defamation Suit under the Defamation Ordinance 2002 as applicable in Pakistan.
Include proper court headinREFERENCE FORMAT - Follow this exact Pakistani legal format:

IN THE CIVIL COURT AT [CITY]

SUIT FOR DAMAGES FOR DEFAMATION / LIBEL / SLANDER

[Plaintiff Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
                                                    ...PLAINTIFF
VERSUS
[Defendant Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
                                                    ...DEFENDANT

RESPECTFULLY SHEWETH:

1. That the Plaintiff is a respectable citizen of [City] enjoying a good reputation in the community.
2. That on [Date], the Defendant made/published false and defamatory statements against the Plaintiff by [Medium - newspaper / social media / verbal statement] in the following words: "[Defamatory Statement]".
3. That the said statements are false, baseless, and were made maliciously with intent to damage the Plaintiff's reputation.
4. That as a result of the said defamation, the Plaintiff has suffered injury to his/her reputation, social standing, and business amounting to PKR [Amount]/-.
5. That the Plaintiff demands that the Defendant retract and apologize publicly and pay damages.

It is therefore most respectfully prayed that this Honourable Court may be pleased to:
(a) Decree damages of PKR [Amount]/- in favor of the Plaintiff;
(b) Restrain the Defendant from making further defamatory statements;
(c) Direct publication of an apology;
(d) Award costs of this suit.

VERIFICATION:
Verified on oath at [City] that the contents are true and correct to the best of my knowledge.

Plaintiff:
[Name] S/o [Father Name]
CNIC: ___________

Advocate: ___________________

INSTRUCTIONS:
- Court heading: IN THE CIVIL COURT AT [CITY] (centered, bold)
- Plaintiff vs Defendant identification
- "RESPECTFULLY SHEWETH:" opening
- Numbered "That..." paragraphs including the defamatory statement
- Prayer clause with (a), (b), (c), (d) items
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
