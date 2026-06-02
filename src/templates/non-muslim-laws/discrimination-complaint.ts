import { TemplateDefinition } from "../types";

export const discriminationComplaint: TemplateDefinition = {
  category: "non-muslim-laws",
  subType: "discrimination-complaint",
  name: "Religious Discrimination Complaint",
  nameUrdu: "مذہبی امتیاز کی شکایت",
  description: "Complaint against discrimination in employment, services, or public places under Articles 25-27",
  descriptionUrdu: "آرٹیکل 25-27 کے تحت ملازمت، خدمات یا عوامی مقامات میں امتیاز کی شکایت",
  icon: "Scale",
  formFields: [
    { name: "complainantName", label: "Complainant's Name", labelUrdu: "شکایت کنندہ", type: "text", required: true, group: "Complainant" },
    { name: "complainantCnic", label: "CNIC", labelUrdu: "شناختی کارڈ", type: "cnic", required: true, group: "Complainant" },
    { name: "complainantReligion", label: "Religion", labelUrdu: "مذہب", type: "text", required: true, group: "Complainant" },
    { name: "complainantAddress", label: "Address", labelUrdu: "پتہ", type: "address", required: true, group: "Complainant" },
    { name: "respondent", label: "Against Whom (Person/Organization/Govt)", labelUrdu: "کس کے خلاف", type: "text", required: true, group: "Respondent" },
    { name: "discriminationType", label: "Type of Discrimination", labelUrdu: "امتیاز کی نوعیت", type: "select", required: true, group: "Details",
      options: [
        { value: "employment", label: "Employment/Job Denial" },
        { value: "promotion", label: "Promotion Denial" },
        { value: "public-place", label: "Public Place Access Denied" },
        { value: "education", label: "Educational Institution" },
        { value: "housing", label: "Housing/Rental Refusal" },
        { value: "services", label: "Government Services" },
        { value: "hate-speech", label: "Hate Speech/Incitement" },
        { value: "social-boycott", label: "Social Boycott" },
      ],
    },
    { name: "facts", label: "Detailed Facts", labelUrdu: "تفصیلی حقائق", type: "textarea", required: true, group: "Details" },
    { name: "evidence", label: "Available Evidence", labelUrdu: "دستیاب شواہد", type: "textarea", required: false, group: "Details" },
  ],
  promptTemplate: `Generate a Religious Discrimination Complaint in Pakistan.
Complainant: {complainantName}, CNIC: {complainantCnic}, Religion: {complainantReligion}, Address: {complainantAddress}
Against: {respondent}
Type: {discriminationType}
Facts: {facts}
Evidence: {evidence}
Cite Articles 25 (equality), 26 (non-discrimination in public places), 27 (safeguard against discrimination in services) of Constitution. File with National Commission for Human Rights (NCHR Act 2012), Ombudsman, or High Court under Article 199.

REFERENCE FORMAT - Follow this exact Pakistani legal format:

COMPLAINT AGAINST RELIGIOUS / MINORITY DISCRIMINATION

To,
The Chairman,
National Commission for Human Rights (NCHR),
Islamabad.

SUBJECT: Complaint Under NCHR Act 2012 / Articles 25 & 27 Constitution

[Complainant Name] S/o [Father Name], CNIC No. [CNIC], Religion: [Religion], resident of [Address]
                                                    ...COMPLAINANT

Respected Sir,

1. That the Complainant is a [Christian / Hindu / Sikh / other] minority citizen of Pakistan.
2. That on [Date], the Complainant was subjected to [Discrimination - denial of employment / service / education / access to public place] by [Institution / Person Name].
3. That the said discrimination is based solely on the Complainant's religion in violation of Articles 25 and 27 of the Constitution.
4. That Articles 25 (equality) and 27 (no discrimination in services) guarantee equal treatment to all citizens.

PRAYER:
(i) Investigate the complaint;
(ii) Direct the Respondent to cease discriminatory practice;
(iii) Award compensation to the Complainant.

Complainant: ___________
Date: ___________

INSTRUCTIONS:
- Addressing: To the NCHR Chairman
- Reference Articles 20, 25, 26, 27 Constitution
- Include discrimination description
- Prayer clause with (i)(ii)(iii) items
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
