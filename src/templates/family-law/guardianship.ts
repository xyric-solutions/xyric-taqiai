import { TemplateDefinition } from "../types";

export const guardianship: TemplateDefinition = {
  category: "family-law",
  subType: "guardianship",
  name: "Guardianship Petition",
  nameUrdu: "سرپرستی کی درخواست",
  description: "Guardianship petition under Guardian and Wards Act 1890",
  descriptionUrdu: "گارڈین اینڈ وارڈز ایکٹ 1890 کے تحت سرپرستی کی درخواست",
  icon: "UserCheck",
  formFields: [
    {
      name: "petitionerName",
      label: "Petitioner's Name",
      labelUrdu: "درخواست گزار کا نام",
      type: "text",
      required: true,
      group: "Petitioner Details",
    },
    {
      name: "petitionerFatherName",
      label: "Petitioner's Father's Name",
      labelUrdu: "درخواست گزار کے والد کا نام",
      type: "text",
      required: true,
      group: "Petitioner Details",
    },
    {
      name: "petitionerCnic",
      label: "Petitioner's CNIC",
      labelUrdu: "درخواست گزار کا شناختی کارڈ",
      type: "cnic",
      required: true,
      group: "Petitioner Details",
    },
    {
      name: "petitionerAddress",
      label: "Petitioner's Address",
      labelUrdu: "درخواست گزار کا پتہ",
      type: "address",
      required: true,
      group: "Petitioner Details",
    },
    {
      name: "petitionerRelationship",
      label: "Relationship to Minor",
      labelUrdu: "نابالغ سے رشتہ",
      type: "text",
      required: true,
      group: "Petitioner Details",
    },
    {
      name: "wardName",
      label: "Ward (Minor) Name",
      labelUrdu: "نابالغ کا نام",
      type: "text",
      required: true,
      group: "Ward Details",
    },
    {
      name: "wardFatherName",
      label: "Ward's Father's Name",
      labelUrdu: "نابالغ کے والد کا نام",
      type: "text",
      required: true,
      group: "Ward Details",
    },
    {
      name: "wardAge",
      label: "Ward's Age",
      labelUrdu: "نابالغ کی عمر",
      type: "number",
      required: true,
      group: "Ward Details",
    },
    {
      name: "wardGender",
      label: "Ward's Gender",
      labelUrdu: "نابالغ کی جنس",
      type: "select",
      required: true,
      options: [
        { value: "male", label: "Male", labelUrdu: "لڑکا" },
        { value: "female", label: "Female", labelUrdu: "لڑکی" },
      ],
      group: "Ward Details",
    },
    {
      name: "guardianshipReason",
      label: "Reason for Guardianship (Orphan/Parent Deceased/Incapacitated)",
      labelUrdu: "سرپرستی کی وجہ (یتیم/والدین کا انتقال/معذوری)",
      type: "select",
      required: true,
      options: [
        { value: "orphan", label: "Orphan", labelUrdu: "یتیم" },
        { value: "father_deceased", label: "Father Deceased", labelUrdu: "والد کا انتقال" },
        { value: "both_deceased", label: "Both Parents Deceased", labelUrdu: "دونوں والدین کا انتقال" },
        { value: "incapacitated", label: "Parent Incapacitated", labelUrdu: "والدین معذور" },
        { value: "other", label: "Other", labelUrdu: "دیگر" },
      ],
      group: "Guardianship Details",
    },
    {
      name: "reasonDetails",
      label: "Detailed Reason for Seeking Guardianship",
      labelUrdu: "سرپرستی حاصل کرنے کی تفصیلی وجہ",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Guardianship Details",
    },
    {
      name: "minorPropertyDetails",
      label: "Property/Assets of Minor (if any)",
      labelUrdu: "نابالغ کی جائیداد/اثاثے (اگر کوئی ہو)",
      type: "textarea",
      required: false,
      group: "Property Details",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a Guardianship Petition in {{language}}.

PETITIONER:
- Name: {{petitionerName}}
- Father's Name: {{petitionerFatherName}}
- CNIC: {{petitionerCnic}}
- Address: {{petitionerAddress}}
- Relationship to Minor: {{petitionerRelationship}}

WARD (MINOR):
- Name: {{wardName}}
- Father's Name: {{wardFatherName}}
- Age: {{wardAge}}
- Gender: {{wardGender}}

GUARDIANSHIP:
- Reason: {{guardianshipReason}}
- Details: {{reasonDetails}}
- Minor's Property: {{minorPropertyDetails}}

Generate a complete Guardianship Petition under the Guardian and Wards Act 1890, Sections 7-10.
Include welfaREFERENCE FORMAT - Follow this exact Pakistani legal format:

IN THE GUARDIAN COURT / FAMILY COURT AT [CITY]

GUARDIANSHIP PETITION NO. _______ OF 20___
(Under Sections 7, 10 & 17, Guardians and Wards Act 1890)

[Petitioner Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
                                                    ...PETITIONER
VERSUS
[Respondent Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
                                                    ...RESPONDENT

IN THE MATTER OF MINOR: [Minor Name], DOB: [Date of Birth]

PETITION FOR APPOINTMENT AS GUARDIAN OF MINOR

RESPECTFULLY SHEWETH:

1. That the minor [Minor Name] was born on [Date] and is currently [Age] years old.
2. That the Petitioner is the [Relation] of the minor and has been taking care of the minor since [Date].
3. That the minor's natural [father / mother] has [passed away / abandoned the minor / is unable to care for the minor].
4. That the Petitioner is a fit and proper person to be appointed as guardian of the person / property of the minor.
5. That the welfare of the minor is best served by appointing the Petitioner as guardian as per Section 17, Guardians and Wards Act 1890.

It is therefore most respectfully prayed that this Honourable Court may be pleased to:
(a) Appoint the Petitioner as guardian of the person / property of minor [Minor Name];
(b) Issue a Certificate of Guardianship;
(c) Any other relief as deemed appropriate.

VERIFICATION:
Verified on oath at [City] that the contents are true and correct to the best of my knowledge.

Petitioner:
[Name] S/o [Father Name]
CNIC: ___________

Advocate: ___________________

INSTRUCTIONS:
- Court heading: IN THE GUARDIAN COURT AT [CITY] (centered, bold)
- Reference Guardians and Wards Act 1890 Sections 7, 10, 17
- PETITION FOR GUARDIANSHIP heading
- Minor's details prominently shown
- "RESPECTFULLY SHEWETH:" opening
- Numbered "That..." paragraphs
- Welfare of minor as paramount consideration per Section 17
- Prayer clause with (a), (b), (c) items
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
