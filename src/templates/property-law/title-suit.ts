import { TemplateDefinition } from "../types";

export const titleSuit: TemplateDefinition = {
  category: "property-law",
  subType: "title-suit",
  name: "Declaratory Suit for Title / اعلان ملکیت کا دعویٰ",
  nameUrdu: "اعلان ملکیت کا دعویٰ",
  description: "Declaratory suit for title/ownership under Section 42 of the Specific Relief Act 1877",
  descriptionUrdu: "سپیسفک ریلیف ایکٹ 1877 کی دفعہ 42 کے تحت اعلان ملکیت کا دعویٰ",
  icon: "Award",
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
      name: "plaintiffCnic",
      label: "Plaintiff's CNIC",
      labelUrdu: "مدعی کا شناختی کارڈ",
      type: "cnic",
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
      name: "propertyDescription",
      label: "Property Description",
      labelUrdu: "جائیداد کی تفصیل",
      type: "textarea",
      required: true,
      group: "Property Details",
    },
    {
      name: "propertyAddress",
      label: "Property Address",
      labelUrdu: "جائیداد کا پتہ",
      type: "address",
      required: true,
      group: "Property Details",
    },
    {
      name: "titleDocuments",
      label: "Title Documents (List)",
      labelUrdu: "ملکیتی دستاویزات (فہرست)",
      type: "textarea",
      required: true,
      group: "Title Details",
    },
    {
      name: "claimBasis",
      label: "Basis of Claim (Inheritance / Purchase / Adverse Possession etc.)",
      labelUrdu: "دعوے کی بنیاد (وراثت / خریداری / تصرف معاکسانہ وغیرہ)",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Title Details",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a Declaratory Suit for Title/Ownership in {{language}}.

PLAINTIFF:
- Name: {{plaintiffName}}
- CNIC: {{plaintiffCnic}}
- Address: {{plaintiffAddress}}

DEFENDANT:
- Name: {{defendantName}}
- Address: {{defendantAddress}}

PROPERTY DETAILS:
- Description: {{propertyDescription}}
- Address: {{propertyAddress}}

TITLE DETAILS:
- Title Documents: {{titleDocuments}}
- Basis of Claim: {{claimBasis}}

Generate a complete Declaratory Suit for Title/Ownership under Section 42 of the Specific Relief Act 1877 as applicable in Pakistan.
Include proper court heading, title of suit, parties description, property details, chain of title, cauREFERENCE FORMAT - Follow this exact Pakistani legal format:

IN THE CIVIL COURT AT [CITY]

SUIT FOR DECLARATION OF TITLE
(Under Section 42, Specific Relief Act 1877)

[Plaintiff Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
                                                    ...PLAINTIFF
VERSUS
[Defendant Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
                                                    ...DEFENDANT

PROPERTY DETAILS:
- Khasra / Plot No.: [Number]
- Mouza / Colony: [Mouza/Colony], Tehsil: [Tehsil], District: [District]
- Area: [Area]

RESPECTFULLY SHEWETH:

1. That the Plaintiff is the lawful owner of the above property as per Title Deed / Mutation No. [Number] dated [Date].
2. That the Defendant is wrongfully claiming ownership of / interest in the said property.
3. That the Defendant's claim is based on a forged / fictitious document / there is no valid basis for his/her claim.
4. That the Plaintiff is entitled to a declaration of ownership under Section 42 of the Specific Relief Act 1877.
5. That the cause of action arose on [Date] when the Defendant made the false claim.

It is therefore prayed that:
(a) Declare the Plaintiff as the rightful owner of the said property;
(b) Declare any document relied upon by the Defendant as void;
(c) Award permanent injunction restraining the Defendant;
(d) Award costs of this suit.

VERIFICATION:
Verified on oath at [City] that the contents are true and correct.

Plaintiff: ___________     Advocate: ___________________

INSTRUCTIONS:
- Court heading: IN THE CIVIL COURT AT [CITY] (centered, bold)
- SUIT FOR DECLARATION OF TITLE heading
- Reference Specific Relief Act 1877 Section 42
- PROPERTY DETAILS section
- "RESPECTFULLY SHEWETH:" opening
- Prayer clause with (a), (b), (c), (d) items
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
