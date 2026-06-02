import { TemplateDefinition } from "../types";

export const partitionSuit: TemplateDefinition = {
  category: "property-law",
  subType: "partition-suit",
  name: "Suit for Partition of Joint Property / مشترکہ جائیداد کی تقسیم کا دعویٰ",
  nameUrdu: "مشترکہ جائیداد کی تقسیم کا دعویٰ",
  description: "Suit for partition of joint property under the Partition Act 1893",
  descriptionUrdu: "پارٹیشن ایکٹ 1893 کے تحت مشترکہ جائیداد کی تقسیم کا دعویٰ",
  icon: "Split",
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
      name: "defendants",
      label: "Defendants / Co-Owners (Names & Addresses)",
      labelUrdu: "مدعا علیہان / شریک مالکان (نام اور پتے)",
      type: "textarea",
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
      name: "sharesClaimed",
      label: "Shares Claimed by Plaintiff",
      labelUrdu: "مدعی کا دعویٰ شدہ حصہ",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Partition Details",
    },
    {
      name: "facts",
      label: "Facts of the Case",
      labelUrdu: "مقدمے کے حقائق",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Partition Details",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a Suit for Partition of Joint Property in {{language}}.

PLAINTIFF:
- Name: {{plaintiffName}}
- CNIC: {{plaintiffCnic}}
- Address: {{plaintiffAddress}}

DEFENDANTS / CO-OWNERS:
{{defendants}}

PROPERTY DETAILS:
- Description: {{propertyDescription}}
- Address: {{propertyAddress}}

PARTITION DETAILS:
- Shares Claimed: {{sharesClaimed}}
- Facts: {{facts}}

Generate a complete Suit for Partition of Joint Property under the Partition Act 1893 and Section 4 of the Specific Relief Act 1877 as applicable in Pakistan.
Include proper court heading, title of suit, parties and their shares, property descripREFERENCE FORMAT - Follow this exact Pakistani legal format:

IN THE CIVIL COURT AT [CITY]

SUIT FOR PARTITION OF PROPERTY

[Plaintiff Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
                                                    ...PLAINTIFF
VERSUS
1. [Defendant 1 Name] S/o [Father Name], CNIC No. [CNIC]    ...DEFENDANT 1
2. [Defendant 2 Name] S/o [Father Name], CNIC No. [CNIC]    ...DEFENDANT 2

PROPERTY DETAILS:
- Khasra / Plot No.: [Number]
- Mouza / Colony: [Mouza/Colony], Tehsil: [Tehsil], District: [District]
- Total Area: [Area]

RESPECTFULLY SHEWETH:

1. That the Plaintiff and Defendants are co-owners of the above property in the following shares: Plaintiff: [Share], Defendants: [Shares].
2. That the said property came into joint ownership by [Inheritance / Purchase / Gift] from [Origin].
3. That the Plaintiff has requested the Defendants to agree to partition but they have refused.
4. That the Plaintiff is entitled to partition of his/her share under the law.

It is therefore prayed that:
(a) Decree partition of the said property;
(b) Allot separate share to the Plaintiff;
(c) Award costs of this suit.

VERIFICATION:
Verified on oath at [City] that the contents are true and correct.

Plaintiff: ___________     Advocate: ___________________

INSTRUCTIONS:
- Court heading: IN THE CIVIL COURT AT [CITY] (centered, bold)
- SUIT FOR PARTITION heading
- PROPERTY DETAILS section
- "RESPECTFULLY SHEWETH:" opening
- Include co-ownership basis and share details
- Prayer clause with (a), (b), (c) items
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
