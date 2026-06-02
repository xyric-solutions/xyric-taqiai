import { TemplateDefinition } from "../types";

export const indemnityBond: TemplateDefinition = {
  category: "affidavit",
  subType: "indemnity-bond",
  name: "Indemnity Bond",
  nameUrdu: "ضمانتی بانڈ",
  description: "Indemnity bond for financial or legal protection",
  descriptionUrdu: "مالی یا قانونی تحفظ کے لیے ضمانتی بانڈ",
  icon: "Shield",
  formFields: [
    {
      name: "indemnifierName",
      label: "Indemnifier Name",
      labelUrdu: "ضامن کا نام",
      type: "text",
      required: true,
      group: "Indemnifier Details",
    },
    {
      name: "indemnifierFatherName",
      label: "Father's Name",
      labelUrdu: "والد کا نام",
      type: "text",
      required: true,
      group: "Indemnifier Details",
    },
    {
      name: "indemnifierCnic",
      label: "CNIC",
      labelUrdu: "شناختی کارڈ",
      type: "cnic",
      required: true,
      placeholder: "XXXXX-XXXXXXX-X",
      group: "Indemnifier Details",
    },
    {
      name: "indemnifierAddress",
      label: "Address",
      labelUrdu: "پتہ",
      type: "address",
      required: true,
      group: "Indemnifier Details",
    },
    {
      name: "beneficiaryName",
      label: "Beneficiary Name",
      labelUrdu: "مستفید کا نام",
      type: "text",
      required: true,
      group: "Beneficiary Details",
    },
    {
      name: "indemnityAmount",
      label: "Indemnity Amount (PKR)",
      labelUrdu: "ضمانت کی رقم (روپے)",
      type: "number",
      required: true,
      placeholder: "Enter amount in PKR",
      group: "Bond Details",
    },
    {
      name: "indemnityPurpose",
      label: "Purpose of Indemnity",
      labelUrdu: "ضمانت کا مقصد",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Bond Details",
    },
    {
      name: "conditions",
      label: "Terms & Conditions",
      labelUrdu: "شرائط و ضوابط",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Bond Details",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a formal Indemnity Bond in {{language}}.

INDEMNIFIER:
- Name: {{indemnifierName}}
- Father's Name: {{indemnifierFatherName}}
- CNIC: {{indemnifierCnic}}
- Address: {{indemnifierAddress}}

BENEFICIARY: {{beneficiaryName}}
AMOUNT: PKR {{indemnityAmount}}
PURPOSE: {{indemnityPurpose}}
CONDITIONS: {{conditions}}

REFERENCE FORMAT — Follow this exact Pakistani legal format:

AFFIDAVIT / INDEMNITY BOND

I, [Name] S/o [Father Name] CNIC No. [CNIC] Resident of [Address] do hereby solemnly declare as under:

1. That [state the subject matter / reason for indemnity bond].
2. That I have [lost / surrendered / undertaken] [document/item/obligation].
3. That I hereby indemnify and keep indemnified [Beneficiary Name] against all losses, claims, damages and expenses that may arise due to [reason].
4. That I bind myself to pay the sum of PKR [Amount] in case of any loss or damage caused.
5. That the contents of this affidavit/indemnity bond are true and correct to the best of my knowledge and nothing has been concealed.

DEPONENT
[Name] S/o [Father Name]
CNIC: [CNIC]

Witness 1: ___________________     Witness 2: ___________________

ATTESTED
(Oath Commissioner / Notary Public)

INSTRUCTIONS:
- Title: AFFIDAVIT / INDEMNITY BOND (centered, bold)
- Each clause starts with "That..."
- Include PKR amount clearly
- Output as clean HTML. If language is Urdu, write in Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
