import { TemplateDefinition } from "../types";

export const consumerComplaint: TemplateDefinition = {
  category: "civil-law",
  subType: "consumer-complaint",
  name: "Consumer Complaint / صارف شکایت",
  nameUrdu: "صارف شکایت",
  description: "Consumer complaint under the Punjab Consumer Protection Act 2005 / relevant provincial law",
  descriptionUrdu: "پنجاب صارف تحفظ ایکٹ 2005 / متعلقہ صوبائی قانون کے تحت صارف شکایت",
  icon: "ShieldAlert",
  formFields: [
    {
      name: "complainantName",
      label: "Complainant's Name",
      labelUrdu: "شکایت کنندہ کا نام",
      type: "text",
      required: true,
      group: "Complainant Details",
    },
    {
      name: "complainantAddress",
      label: "Complainant's Address",
      labelUrdu: "شکایت کنندہ کا پتہ",
      type: "address",
      required: true,
      group: "Complainant Details",
    },
    {
      name: "complainantCnic",
      label: "Complainant's CNIC",
      labelUrdu: "شکایت کنندہ کا شناختی کارڈ",
      type: "cnic",
      required: true,
      group: "Complainant Details",
    },
    {
      name: "companySeller",
      label: "Company / Seller Name",
      labelUrdu: "کمپنی / فروخت کنندہ کا نام",
      type: "text",
      required: true,
      group: "Respondent Details",
    },
    {
      name: "companyAddress",
      label: "Company / Seller Address",
      labelUrdu: "کمپنی / فروخت کنندہ کا پتہ",
      type: "address",
      required: true,
      group: "Respondent Details",
    },
    {
      name: "productService",
      label: "Product / Service",
      labelUrdu: "مصنوعات / خدمت",
      type: "text",
      required: true,
      group: "Complaint Details",
    },
    {
      name: "defect",
      label: "Defect / Deficiency Description",
      labelUrdu: "خرابی / کمی کی تفصیل",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Complaint Details",
    },
    {
      name: "amount",
      label: "Amount Paid (PKR)",
      labelUrdu: "ادا کی گئی رقم (روپے)",
      type: "number",
      required: true,
      group: "Complaint Details",
    },
    {
      name: "receiptDetails",
      label: "Receipt / Invoice Details",
      labelUrdu: "رسید / انوائس کی تفصیلات",
      type: "textarea",
      required: true,
      group: "Complaint Details",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a Consumer Complaint in {{language}}.

COMPLAINANT:
- Name: {{complainantName}}
- Address: {{complainantAddress}}
- CNIC: {{complainantCnic}}

RESPONDENT (COMPANY/SELLER):
- Name: {{companySeller}}
- Address: {{companyAddress}}

COMPLAINT DETAILS:
- Product/Service: {{productService}}
- Defect/Deficiency: {{defect}}
- Amount Paid: PKR {{amount}}
- Receipt/Invoice: {{receiptDetails}}

Generate a complete Consumer Complaint under the Punjab Consumer Protection Act 2005 (or relevant provincial consumer protection law) as applicable in Pakistan.
Include proper consumer court REFERENCE FORMAT - Follow this exact Pakistani legal format:

IN THE CONSUMER COURT / CONSUMER PROTECTION TRIBUNAL AT [CITY]

CONSUMER COMPLAINT NO. _______ OF 20___
(Under Consumer Protection Act [Province] 2019)

[Complainant Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
                                                    ...COMPLAINANT
VERSUS
[Trader / Service Provider Name], [Address]
                                                    ...RESPONDENT

CONSUMER COMPLAINT

RESPECTFULLY SHEWETH:

1. That the Complainant purchased [Product / Service] from the Respondent on [Date] for PKR [Amount]/-.
2. That the said [product / service] was defective / did not conform to the description / representations made.
3. That the Complainant notified the Respondent about the defect on [Date] but the Respondent failed to rectify / refund.
4. That the Respondent has committed an unfair trade practice by [Description] in violation of the Consumer Protection Act.
5. That the Complainant has suffered a loss of PKR [Amount]/- and is entitled to compensation.

It is therefore most respectfully prayed that this Honourable Tribunal may be pleased to:
(a) Direct the Respondent to refund PKR [Amount]/- or replace the defective product;
(b) Award compensation of PKR [Amount]/- for inconvenience and loss;
(c) Award costs of this complaint.

VERIFICATION:
Verified on oath at [City] that the contents are true and correct to the best of my knowledge.

Complainant:
[Name] S/o [Father Name]
CNIC: ___________

Advocate: ___________________

INSTRUCTIONS:
- Court heading: IN THE CONSUMER COURT AT [CITY] (centered, bold)
- Complainant vs Respondent identification
- "RESPECTFULLY SHEWETH:" opening
- Numbered "That..." paragraphs
- Reference Consumer Protection Act
- Prayer clause with (a), (b), (c) items
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
