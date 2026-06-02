import { TemplateDefinition } from "../types";

export const specificPerformance: TemplateDefinition = {
  category: "property-law",
  subType: "specific-performance",
  name: "Suit for Specific Performance / تعمیل معاہدہ کا دعویٰ",
  nameUrdu: "تعمیل معاہدہ کا دعویٰ",
  description: "Suit for specific performance of contract under Section 12 of the Specific Relief Act 1877",
  descriptionUrdu: "سپیسفک ریلیف ایکٹ 1877 کی دفعہ 12 کے تحت تعمیل معاہدہ کا دعویٰ",
  icon: "FileCheck",
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
      name: "agreementDetails",
      label: "Agreement Details (Date, Terms, Consideration)",
      labelUrdu: "معاہدے کی تفصیلات (تاریخ، شرائط، عوض)",
      type: "textarea",
      required: true,
      group: "Agreement Details",
    },
    {
      name: "propertyDescription",
      label: "Property Description",
      labelUrdu: "جائیداد کی تفصیل",
      type: "textarea",
      required: true,
      group: "Agreement Details",
    },
    {
      name: "breach",
      label: "Details of Breach / Non-Performance",
      labelUrdu: "خلاف ورزی / عدم تعمیل کی تفصیلات",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Breach Details",
    },
    {
      name: "relief",
      label: "Relief Sought",
      labelUrdu: "مطلوبہ ریلیف",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Breach Details",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a Suit for Specific Performance in {{language}}.

PLAINTIFF:
- Name: {{plaintiffName}}
- CNIC: {{plaintiffCnic}}
- Address: {{plaintiffAddress}}

DEFENDANT:
- Name: {{defendantName}}
- Address: {{defendantAddress}}

AGREEMENT DETAILS:
- Details: {{agreementDetails}}
- Property: {{propertyDescription}}

BREACH:
- Details of Breach: {{breach}}
- Relief Sought: {{relief}}

Generate a complete Suit for Specific Performance under Section 12 of the Specific Relief Act 1877 as applicable in Pakistan.
Include proper court heading, title of suit, parties description, agreement background, breach narrative, plaintiff's readiREFERENCE FORMAT - Follow this exact Pakistani legal format:

IN THE CIVIL COURT AT [CITY]

SUIT FOR SPECIFIC PERFORMANCE OF CONTRACT
(Under Section 12, Specific Relief Act 1877)

[Plaintiff Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
                                                    ...PLAINTIFF
VERSUS
[Defendant Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
                                                    ...DEFENDANT

PROPERTY DETAILS:
- [Property Description - Plot No., Area, Mouza/Colony, Tehsil, District]
- Agreed Sale Price: PKR [Total Price]/-

RESPECTFULLY SHEWETH:

1. That the Plaintiff and Defendant entered into an Agreement to Sell dated [Agreement Date] for the above property at PKR [Price]/-.
2. That the Plaintiff paid an advance of PKR [Advance Amount]/- and is ready and willing to pay the remaining balance.
3. That the Defendant has refused to execute the Sale Deed in breach of the Agreement to Sell.
4. That the Plaintiff is entitled to specific performance under Section 12 of the Specific Relief Act 1877.
5. That the subject matter is unique land / property and monetary damages are inadequate.

It is therefore prayed that:
(a) Decree specific performance directing the Defendant to execute the Sale Deed;
(b) In alternative, refund of double the advance PKR [Amount]/-;
(c) Award costs of this suit.

VERIFICATION:
Verified on oath at [City] that the contents are true and correct.

Plaintiff: ___________     Advocate: ___________________

INSTRUCTIONS:
- Court heading: IN THE CIVIL COURT AT [CITY] (centered, bold)
- SUIT FOR SPECIFIC PERFORMANCE heading
- Reference Specific Relief Act 1877 Section 12
- PROPERTY DETAILS section
- "RESPECTFULLY SHEWETH:" opening
- Plaintiff's readiness and willingness
- Prayer clause with (a), (b), (c) items
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
