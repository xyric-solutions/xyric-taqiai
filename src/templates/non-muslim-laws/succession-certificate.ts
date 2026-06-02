import { TemplateDefinition } from "../types";

export const nonMuslimSuccession: TemplateDefinition = {
  category: "non-muslim-laws",
  subType: "succession-certificate",
  name: "Succession Certificate (Non-Muslim)",
  nameUrdu: "سکسیشن سرٹیفکیٹ (غیر مسلم)",
  description: "Application for Succession Certificate under Succession Act 1925",
  descriptionUrdu: "سکسیشن ایکٹ 1925 کے تحت وراثت کا سرٹیفکیٹ",
  icon: "FileText",
  formFields: [
    { name: "applicantName", label: "Applicant's Name", labelUrdu: "درخواست گزار کا نام", type: "text", required: true, group: "Applicant Details" },
    { name: "applicantCnic", label: "Applicant's CNIC", labelUrdu: "شناختی کارڈ", type: "cnic", required: true, group: "Applicant Details" },
    { name: "applicantAddress", label: "Applicant's Address", labelUrdu: "پتہ", type: "address", required: true, group: "Applicant Details" },
    { name: "relationToDeceased", label: "Relation to Deceased", labelUrdu: "مرحوم سے تعلق", type: "text", required: true, group: "Applicant Details" },
    { name: "religion", label: "Religion", labelUrdu: "مذہب", type: "select", required: true, group: "Applicant Details",
      options: [
        { value: "christian", label: "Christian" },
        { value: "hindu", label: "Hindu" },
        { value: "sikh", label: "Sikh" },
        { value: "parsi", label: "Parsi/Zoroastrian" },
        { value: "buddhist", label: "Buddhist" },
        { value: "other", label: "Other" },
      ],
    },
    { name: "deceasedName", label: "Deceased's Name", labelUrdu: "مرحوم کا نام", type: "text", required: true, group: "Deceased Details" },
    { name: "deceasedCnic", label: "Deceased's CNIC", labelUrdu: "مرحوم کا شناختی کارڈ", type: "cnic", required: true, group: "Deceased Details" },
    { name: "dateOfDeath", label: "Date of Death", labelUrdu: "تاریخ وفات", type: "date", required: true, group: "Deceased Details" },
    { name: "placeOfDeath", label: "Place of Death", labelUrdu: "مقام وفات", type: "text", required: true, group: "Deceased Details" },
    { name: "propertyDetails", label: "Property/Assets Details", labelUrdu: "جائیداد کی تفصیلات", type: "textarea", required: true, group: "Estate Details" },
    { name: "legalHeirs", label: "List of All Legal Heirs", labelUrdu: "قانونی وارثین کی فہرست", type: "textarea", required: true, group: "Estate Details" },
  ],
  promptTemplate: `Generate a professional Succession Certificate Application under Succession Act 1925 (Pakistan) for a non-Muslim applicant.
Applicant: {applicantName}, CNIC: {applicantCnic}, Address: {applicantAddress}, Relation: {relationToDeceased}, Religion: {religion}
Deceased: {deceasedName}, CNIC: {deceasedCnic}, Death Date: {dateOfDeath}, Place: {placeOfDeath}
Property/Assets: {propertyDetails}
Legal Heirs: {legalHeirs}
File in Civil Court under Sections 370-390 of Succession Act 1925. Include all legal requirements.

REFERENCE FORMAT - Follow this exact Pakistani legal format:

IN THE COURT OF DISTRICT JUDGE AT [CITY]

SUCCESSION PETITION NO. _______ OF 20___
(Under Sections 370-390, Succession Act 1925)

[Petitioner Name] S/o [Father Name], CNIC No. [CNIC], Religion: [Religion], resident of [Address]
                                                    ...PETITIONER

IN THE MATTER OF ESTATE OF LATE: [Deceased Name], Religion: [Religion]

RESPECTFULLY SHEWETH:

1. That [Deceased Name] S/o [Father Name], CNIC No. [CNIC], Religion: [Religion], passed away on [Date] at [Place].
2. That the Petitioner is the [Relation] of the deceased.
3. That the deceased left behind assets / securities worth PKR [Amount]/-.
4. That the distribution of estate shall be governed by [Applicable Personal Law - Succession Act 1925 / Hindu Succession / Christian personal law].

PRAYER:
(a) Grant Succession Certificate in respect of deceased's estate;
(b) Direct banks / institutions to release funds to the Petitioner;
(c) Any other appropriate relief.

INSTRUCTIONS:
- Court heading: IN THE COURT OF DISTRICT JUDGE AT [CITY] (centered, bold)
- Reference Succession Act 1925 Sections 370-390
- Include deceased's religion for applicable personal law
- "RESPECTFULLY SHEWETH:" opening
- Prayer clause with (a), (b), (c) items
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
