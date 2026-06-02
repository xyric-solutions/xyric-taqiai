import { TemplateDefinition } from "../types";

export const successionCertificate: TemplateDefinition = {
  category: "family-law",
  subType: "succession-certificate",
  name: "Succession Certificate Application",
  nameUrdu: "سکسیشن سرٹیفکیٹ کی درخواست",
  description: "Application for succession certificate under Succession Act 1925",
  descriptionUrdu: "سکسیشن ایکٹ 1925 کے تحت سکسیشن سرٹیفکیٹ کی درخواست",
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
      name: "applicantFatherName",
      label: "Applicant's Father/Husband Name",
      labelUrdu: "درخواست گزار کے والد/شوہر کا نام",
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
      name: "relationshipToDeceased",
      label: "Relationship to Deceased",
      labelUrdu: "مرحوم سے رشتہ",
      type: "text",
      required: true,
      group: "Applicant Details",
    },
    {
      name: "deceasedName",
      label: "Deceased's Name",
      labelUrdu: "مرحوم کا نام",
      type: "text",
      required: true,
      group: "Deceased Details",
    },
    {
      name: "deceasedFatherName",
      label: "Deceased's Father's Name",
      labelUrdu: "مرحوم کے والد کا نام",
      type: "text",
      required: true,
      group: "Deceased Details",
    },
    {
      name: "deceasedCnic",
      label: "Deceased's CNIC",
      labelUrdu: "مرحوم کا شناختی کارڈ",
      type: "cnic",
      required: false,
      group: "Deceased Details",
    },
    {
      name: "dateOfDeath",
      label: "Date of Death",
      labelUrdu: "تاریخ وفات",
      type: "date",
      required: true,
      group: "Deceased Details",
    },
    {
      name: "legalHeirsList",
      label: "List of Legal Heirs (Names and Relationships)",
      labelUrdu: "قانونی ورثاء کی فہرست (نام اور رشتے)",
      type: "textarea",
      required: true,
      group: "Heirs Details",
    },
    {
      name: "propertyDetails",
      label: "Property/Assets Details",
      labelUrdu: "جائیداد/اثاثوں کی تفصیلات",
      type: "textarea",
      required: true,
      group: "Estate Details",
    },
    {
      name: "debtsDetails",
      label: "Debts/Liabilities (if any)",
      labelUrdu: "قرضے/ذمہ داریاں (اگر کوئی ہوں)",
      type: "textarea",
      required: false,
      group: "Estate Details",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a Succession Certificate Application in {{language}}.

APPLICANT:
- Name: {{applicantName}}
- Father/Husband Name: {{applicantFatherName}}
- CNIC: {{applicantCnic}}
- Address: {{applicantAddress}}
- Relationship to Deceased: {{relationshipToDeceased}}

DECEASED:
- Name: {{deceasedName}}
- Father's Name: {{deceasedFatherName}}
- CNIC: {{deceasedCnic}}
- Date of Death: {{dateOfDeath}}

LEGAL HEIRS: {{legalHeirsList}}

ESTATE:
- Property/Assets: {{propertyDetails}}
- Debts: {{debtsDetails}}

Generate a complete Succession CertificatREFERENCE FORMAT - Follow this exact Pakistani legal format:

IN THE COURT OF DISTRICT JUDGE AT [CITY]

SUCCESSION PETITION NO. _______ OF 20___
(Under Sections 370-390, Succession Act 1925)

[Petitioner Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
                                                    ...PETITIONER

IN THE MATTER OF ESTATE OF LATE: [Deceased Name]

PETITION FOR SUCCESSION CERTIFICATE

RESPECTFULLY SHEWETH:

1. That [Deceased Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address], passed away on [Date of Death] at [Place of Death].
2. That the Petitioner is the [Relation - son / daughter / widow / legal heir] of the deceased.
3. That the deceased left behind the following legal heirs: [Names and Relations].
4. That the deceased had the following debts and securities owed to him: [Bank Account / Fixed Deposits / NSS / Other Securities worth PKR Amount].
5. That the Petitioner is entitled to apply for Succession Certificate as per the Succession Act 1925.
6. That no other application for Succession Certificate in respect of the estate of the deceased is pending.

It is therefore most respectfully prayed that this Honourable Court may be pleased to:
(a) Grant a Succession Certificate in respect of the estate of the deceased;
(b) Direct all concerned banks / financial institutions to release the said funds to the Petitioner;
(c) Award costs of this petition.

VERIFICATION:
Verified on oath at [City] that the contents are true and correct to the best of my knowledge.

Petitioner:
[Name] S/o [Father Name]
CNIC: ___________

Advocate: ___________________

INSTRUCTIONS:
- Court heading: IN THE COURT OF DISTRICT JUDGE AT [CITY] (centered, bold)
- SUCCESSION PETITION heading
- Reference Succession Act 1925 Sections 370-390
- "RESPECTFULLY SHEWETH:" opening
- Numbered "That..." paragraphs: deceased details, heirs, assets
- Prayer clause with (a), (b), (c) items
- Include VERIFICATION paragraph
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
