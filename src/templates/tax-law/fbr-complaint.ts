import { TemplateDefinition } from "../types";

export const fbrComplaint: TemplateDefinition = {
  category: "tax-law",
  subType: "fbr-complaint",
  name: "FBR Complaint / Rectification / ایف بی آر شکایت / درستگی",
  nameUrdu: "ایف بی آر شکایت / درستگی",
  description: "FBR complaint or rectification application under Section 221 of the Income Tax Ordinance 2001",
  descriptionUrdu: "انکم ٹیکس آرڈیننس 2001 کی دفعہ 221 کے تحت ایف بی آر شکایت یا درستگی کی درخواست",
  icon: "FileSearch",
  formFields: [
    {
      name: "taxpayerName",
      label: "Taxpayer's Name",
      labelUrdu: "ٹیکس دہندہ کا نام",
      type: "text",
      required: true,
      group: "Taxpayer Details",
    },
    {
      name: "taxpayerAddress",
      label: "Taxpayer's Address",
      labelUrdu: "ٹیکس دہندہ کا پتہ",
      type: "address",
      required: true,
      group: "Taxpayer Details",
    },
    {
      name: "ntn",
      label: "National Tax Number (NTN)",
      labelUrdu: "نیشنل ٹیکس نمبر (NTN)",
      type: "text",
      required: true,
      group: "Taxpayer Details",
    },
    {
      name: "assessmentYear",
      label: "Assessment Year",
      labelUrdu: "تشخیصی سال",
      type: "text",
      required: true,
      group: "Complaint Details",
    },
    {
      name: "errorDescription",
      label: "Error / Mistake Description",
      labelUrdu: "غلطی / خامی کی تفصیل",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Complaint Details",
    },
    {
      name: "correctionNeeded",
      label: "Correction Needed",
      labelUrdu: "مطلوبہ درستگی",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Complaint Details",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate an FBR Complaint/Rectification Application in {{language}}.

TAXPAYER:
- Name: {{taxpayerName}}
- Address: {{taxpayerAddress}}
- NTN: {{ntn}}

COMPLAINT DETAILS:
- Assessment Year: {{assessmentYear}}
- Error: {{errorDescription}}
- Correction Needed: {{correctionNeeded}}

Generate a complete FBR Complaint/Rectification Application under Section 221 of the Income Tax Ordinance 2001 as applicable in Pakistan.
Include proper CIR/FBR heading, taxpayer details, desREFERENCE FORMAT - Follow this exact Pakistani legal format:

APPLICATION FOR RECTIFICATION / COMPLAINT TO FBR

To,
The Commissioner / Chief Commissioner,
Federal Board of Revenue (FBR),
Regional Tax Office, [City].

SUBJECT: Application for Rectification / Complaint Under Section 221, Income Tax Ordinance 2001

[Taxpayer Name] S/o [Father Name], CNIC No. [CNIC], NTN: [NTN], resident of [Address]
(hereinafter "TAXPAYER")

With due respect it is submitted that:

1. That the Taxpayer is registered with FBR bearing NTN [Number] and files tax returns regularly.
2. That the Tax Year [Year] assessment order / tax demand notice contains an error apparent from record as follows: [Description of Error].
3. That the correct tax liability based on actual income / declared figures is PKR [Correct Amount]/-.
4. That the error has occurred due to [Reason - data entry mistake / wrong rate applied / income double-counted].
5. That the Taxpayer is entitled to rectification under Section 221 of the Income Tax Ordinance 2001.

PRAYER:
(i) Rectify the assessment order / tax demand;
(ii) Issue a corrected notice showing correct liability;
(iii) Stay recovery proceedings during pendency.

Declaration: I declare that the above information is true and correct.

Taxpayer: ___________
NTN: ___________
Date: ___________

INSTRUCTIONS:
- Heading: APPLICATION FOR RECTIFICATION TO FBR (centered, bold)
- Reference Section 221, Income Tax Ordinance 2001
- Include taxpayer NTN, error description, correct calculation
- Prayer clause with (i)(ii)(iii) items
- Include declaration of truthfulness
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
