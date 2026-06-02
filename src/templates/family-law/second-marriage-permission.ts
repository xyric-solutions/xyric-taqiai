import { TemplateDefinition } from "../types";

export const secondMarriagePermission: TemplateDefinition = {
  category: "family-law",
  subType: "second-marriage-permission",
  name: "Second Marriage Permission Application",
  nameUrdu: "دوسری شادی کی اجازت کی درخواست",
  description: "Application for permission for second marriage under Section 6 MFLO 1961",
  descriptionUrdu: "مسلم فیملی لاز آرڈیننس 1961 کی دفعہ 6 کے تحت دوسری شادی کی اجازت کی درخواست",
  icon: "FileText",
  formFields: [
    {
      name: "applicantName",
      label: "Applicant's Name (Husband)",
      labelUrdu: "درخواست گزار کا نام (شوہر)",
      type: "text",
      required: true,
      group: "Applicant Details",
    },
    {
      name: "applicantFatherName",
      label: "Applicant's Father's Name",
      labelUrdu: "درخواست گزار کے والد کا نام",
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
      name: "firstWifeName",
      label: "First Wife's Name",
      labelUrdu: "پہلی بیوی کا نام",
      type: "text",
      required: true,
      group: "First Wife Details",
    },
    {
      name: "firstWifeCnic",
      label: "First Wife's CNIC",
      labelUrdu: "پہلی بیوی کا شناختی کارڈ",
      type: "cnic",
      required: true,
      group: "First Wife Details",
    },
    {
      name: "firstMarriageDate",
      label: "Date of First Marriage",
      labelUrdu: "پہلی شادی کی تاریخ",
      type: "date",
      required: true,
      group: "First Wife Details",
    },
    {
      name: "firstWifeConsent",
      label: "First Wife's Consent",
      labelUrdu: "پہلی بیوی کی رضامندی",
      type: "select",
      required: true,
      options: [
        { value: "yes", label: "Yes - Consent Given", labelUrdu: "ہاں - رضامندی دی" },
        { value: "no", label: "No - Consent Not Given", labelUrdu: "نہیں - رضامندی نہیں دی" },
      ],
      group: "First Wife Details",
    },
    {
      name: "proposedWifeName",
      label: "Proposed Second Wife's Name",
      labelUrdu: "مجوزہ دوسری بیوی کا نام",
      type: "text",
      required: true,
      group: "Proposed Wife Details",
    },
    {
      name: "proposedWifeFatherName",
      label: "Proposed Second Wife's Father's Name",
      labelUrdu: "مجوزہ دوسری بیوی کے والد کا نام",
      type: "text",
      required: true,
      group: "Proposed Wife Details",
    },
    {
      name: "reasonForSecondMarriage",
      label: "Reason for Second Marriage",
      labelUrdu: "دوسری شادی کی وجہ",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Case Details",
    },
    {
      name: "financialCapability",
      label: "Financial Capability / Monthly Income (PKR)",
      labelUrdu: "مالی استطاعت / ماہانہ آمدنی (روپے)",
      type: "number",
      required: true,
      group: "Case Details",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a Second Marriage Permission Application in {{language}}.

APPLICANT (HUSBAND):
- Name: {{applicantName}}
- Father's Name: {{applicantFatherName}}
- CNIC: {{applicantCnic}}
- Address: {{applicantAddress}}

FIRST WIFE:
- Name: {{firstWifeName}}
- CNIC: {{firstWifeCnic}}
- Marriage Date: {{firstMarriageDate}}
- Consent: {{firstWifeConsent}}

PROPOSED SECOND WIFE:
- Name: {{proposedWifeName}}
- Father's Name: {{proposedWifeFatherName}}

REASON: {{reasonForSecondMarriage}}
FINANCIAL CAPABILITY: PKR {{financialCapability}} per month

Generate a complete Application for Permission of Second Marriage addressed to the Chairman, Arbitration Council under Section 6 ofREFERENCE FORMAT - Follow this exact Pakistani legal format:

To,
The Chairman,
Arbitration Council / Union Council,
[UC Name], [District].

APPLICATION FOR PERMISSION FOR SECOND MARRIAGE
(Under Section 6, Muslim Family Laws Ordinance 1961)

[Applicant Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
                                                    ...APPLICANT

Respected Sir,

With due respect it is submitted that:

1. That the Applicant intends to contract a second marriage with [Second Wife Name] D/o [Father Name], resident of [Address].
2. That the Applicant's first wife is Mst. [First Wife Name] D/o [Father Name], CNIC No. [CNIC], and she is [living with the Applicant / chronically ill / physically incapacitated].
3. That the justification / necessity for the second marriage is: [Reason - first wife medically unable to have children / chronically ill / applicant's genuine need].
4. That the Applicant undertakes to treat both wives equally in all respects as required by Islamic law.
5. That notice is being given to the first wife through this application as required under Section 6 of the Muslim Family Laws Ordinance 1961.

PRAYER:
The Applicant prays for grant of permission to contract the second marriage as per Section 6 of the Muslim Family Laws Ordinance 1961.

Applicant:
[Name] S/o [Father Name]
CNIC: ___________
Date: ___________

INSTRUCTIONS:
- Addressing: To the Chairman, Arbitration Council
- APPLICATION FOR PERMISSION FOR SECOND MARRIAGE heading
- Reference Section 6 Muslim Family Laws Ordinance 1961
- Numbered paragraphs: first wife's details, justification, equal treatment undertaking
- Equal treatment / just necessity as per Ordinance
- Prayer for permission
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
