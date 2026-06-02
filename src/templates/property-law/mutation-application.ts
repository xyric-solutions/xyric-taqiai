import { TemplateDefinition } from "../types";

export const mutationApplication: TemplateDefinition = {
  category: "property-law",
  subType: "mutation-application",
  name: "Mutation / Intiqal Application / انتقال کی درخواست",
  nameUrdu: "انتقال کی درخواست",
  description: "Mutation (Intiqal) application for transfer of land revenue record",
  descriptionUrdu: "زمین کے ریونیو ریکارڈ کی منتقلی کے لیے انتقال کی درخواست",
  icon: "FileText",
  formFields: [
    {
      name: "applicantName",
      label: "Applicant's Name",
      labelUrdu: "درخواست گزار کا نام",
      type: "text",
      required: true,
      group: "Applicant Details",
    },
    {
      name: "applicantCnic",
      label: "Applicant's CNIC",
      labelUrdu: "درخواست گزار کا شناختی کارڈ",
      type: "cnic",
      required: true,
      group: "Applicant Details",
    },
    {
      name: "applicantAddress",
      label: "Applicant's Address",
      labelUrdu: "درخواست گزار کا پتہ",
      type: "address",
      required: true,
      group: "Applicant Details",
    },
    {
      name: "deceasedOrSellerName",
      label: "Deceased / Seller Name",
      labelUrdu: "مرحوم / فروخت کنندہ کا نام",
      type: "text",
      required: true,
      group: "Transferor Details",
    },
    {
      name: "deceasedOrSellerRelation",
      label: "Relation with Deceased / Seller",
      labelUrdu: "مرحوم / فروخت کنندہ سے تعلق",
      type: "text",
      required: true,
      group: "Transferor Details",
    },
    {
      name: "propertyKhasra",
      label: "Khasra Number(s)",
      labelUrdu: "خسرہ نمبر",
      type: "text",
      required: true,
      group: "Property Details",
    },
    {
      name: "propertyKhata",
      label: "Khata Number",
      labelUrdu: "کھاتہ نمبر",
      type: "text",
      required: true,
      group: "Property Details",
    },
    {
      name: "tehsil",
      label: "Tehsil / District",
      labelUrdu: "تحصیل / ضلع",
      type: "text",
      required: true,
      group: "Property Details",
    },
    {
      name: "mouza",
      label: "Mouza / Village",
      labelUrdu: "موضع / گاؤں",
      type: "text",
      required: true,
      group: "Property Details",
    },
    {
      name: "documents",
      label: "Supporting Documents",
      labelUrdu: "معاون دستاویزات",
      type: "textarea",
      required: true,
      group: "Documents",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a Mutation (Intiqal) Application in {{language}}.

APPLICANT:
- Name: {{applicantName}}
- CNIC: {{applicantCnic}}
- Address: {{applicantAddress}}

DECEASED / SELLER:
- Name: {{deceasedOrSellerName}}
- Relation: {{deceasedOrSellerRelation}}

PROPERTY DETAILS:
- Khasra Number(s): {{propertyKhasra}}
- Khata Number: {{propertyKhata}}
- Tehsil / District: {{tehsil}}
- Mouza / Village: {{mouza}}

SUPPORTING DOCUMENTS:
{{documents}}

REFERENCE FORMAT — Follow this exact Pakistani legal format:

To,
The Revenue Officer / Tehsildar,
Tehsil [Tehsil Name], District [District Name]

SUBJECT: Application for Mutation / Intiqal of Land

Respected Sir,

With due respect it is submitted that I, [Applicant Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address], do hereby apply for mutation of the following land in my name:

PROPERTY DETAILS:
- Khasra Number(s): [Property Khasra]
- Khata Number: [Khata Number]
- Mouza / Village: [Mouza]
- Tehsil: [Tehsil]
- District: [District]

BASIS OF MUTATION:
1. That I am entitled to the above-described land through [inheritance/purchase/gift/court decree].
2. That [Deceased Name / Seller Name], who was the previous owner, [has deceased on [Date] / has sold / transferred the land to me].
3. That the said land rightfully belongs to me and I am requesting mutation in the revenue records.

SUPPORTING DOCUMENTS ATTACHED:
1. [Document 1 — Registry / Fard / Aks-e-Shajra / Death Certificate / Sale Deed]
2. [Document 2]
3. CNIC Copy of Applicant

It is therefore most respectfully prayed that this Honourable Revenue Officer may be pleased to:
(i) Enter mutation of the above-described land in favour of the applicant in the revenue records;
(ii) Issue the updated Fard (land record document) in the name of the applicant.

Yours faithfully,

[Applicant Name]
CNIC: ___________
Address: ___________
Phone: ___________

Date: _______________

INSTRUCTIONS:
- Formal application to Revenue Officer / Tehsildar
- PROPERTY DETAILS section with Khasra/Khata numbers
- BASIS OF MUTATION "That..." clauses
- Supporting documents listed
- Prayer clause with roman numerals
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
