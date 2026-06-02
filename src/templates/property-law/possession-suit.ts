import { TemplateDefinition } from "../types";

export const possessionSuit: TemplateDefinition = {
  category: "property-law",
  subType: "possession-suit",
  name: "Suit for Recovery of Possession / قبضے کی بازیابی کا دعویٰ",
  nameUrdu: "قبضے کی بازیابی کا دعویٰ",
  description: "Suit for recovery of possession under Section 8/9 of the Specific Relief Act 1877",
  descriptionUrdu: "سپیسفک ریلیف ایکٹ 1877 کی دفعہ 8/9 کے تحت قبضے کی بازیابی کا دعویٰ",
  icon: "Home",
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
      name: "howPossessionLost",
      label: "How Possession Was Lost",
      labelUrdu: "قبضہ کیسے چھینا گیا",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Case Details",
    },
    {
      name: "facts",
      label: "Facts of the Case",
      labelUrdu: "مقدمے کے حقائق",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Case Details",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a Suit for Recovery of Possession in {{language}}.

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

CASE DETAILS:
- How Possession Was Lost: {{howPossessionLost}}
- Facts: {{facts}}

Generate a complete Suit for Recovery of Possession under Section 8/9 of the Specific Relief Act 1877 as applicable in Pakistan.
Include proper court heading, title of suit, parties description, factual REFERENCE FORMAT - Follow this exact Pakistani legal format:

IN THE CIVIL COURT AT [CITY]

SUIT FOR RECOVERY OF POSSESSION OF PROPERTY
(Under Sections 8/9, Specific Relief Act 1877)

[Plaintiff Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
                                                    ...PLAINTIFF
VERSUS
[Defendant Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
                                                    ...DEFENDANT

PROPERTY DETAILS:
- Plot / House No.: [Number], [Address]
- Khasra No.: [Number], Mouza: [Mouza], District: [District]
- Area: [Area]

RESPECTFULLY SHEWETH:

1. That the Plaintiff is the rightful owner of the above property as per Title Deed / Mutation No. [Number] dated [Date].
2. That the Defendant wrongfully and unlawfully dispossessed the Plaintiff from the said property on [Date].
3. That the Plaintiff is entitled to recovery of possession under Section 8/9 of the Specific Relief Act 1877.
4. That the Plaintiff has been in possession of the said property for [Duration] years.

It is therefore prayed that:
(a) Decree recovery of possession of the said property in favor of the Plaintiff;
(b) Direct the Defendant to vacate and handover possession;
(c) Award costs of this suit.

VERIFICATION:
Verified on oath at [City] that the contents are true and correct.

Plaintiff: ___________     Advocate: ___________________

INSTRUCTIONS:
- Court heading: IN THE CIVIL COURT AT [CITY] (centered, bold)
- SUIT FOR RECOVERY OF POSSESSION heading
- Reference Specific Relief Act 1877 Sections 8/9
- PROPERTY DETAILS section
- "RESPECTFULLY SHEWETH:" opening
- Prayer clause with (a), (b), (c) items
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
