import { TemplateDefinition } from "../types";

export const divorceDeed: TemplateDefinition = {
  category: "family-law",
  subType: "divorce-deed",
  name: "Divorce Deed / Talaq Nama",
  nameUrdu: "طلاق نامہ",
  description: "Divorce deed as per Muslim Family Laws",
  descriptionUrdu: "مسلم خاندانی قوانین کے مطابق طلاق نامہ",
  icon: "FileX",
  formFields: [
    {
      name: "husbandName",
      label: "Husband's Name",
      labelUrdu: "شوہر کا نام",
      type: "text",
      required: true,
      group: "Husband Details",
    },
    {
      name: "husbandFatherName",
      label: "Husband's Father's Name",
      labelUrdu: "شوہر کے والد کا نام",
      type: "text",
      required: true,
      group: "Husband Details",
    },
    {
      name: "husbandCnic",
      label: "Husband's CNIC",
      labelUrdu: "شوہر کا شناختی کارڈ",
      type: "cnic",
      required: true,
      group: "Husband Details",
    },
    {
      name: "wifeName",
      label: "Wife's Name",
      labelUrdu: "بیوی کا نام",
      type: "text",
      required: true,
      group: "Wife Details",
    },
    {
      name: "wifeFatherName",
      label: "Wife's Father's Name",
      labelUrdu: "بیوی کے والد کا نام",
      type: "text",
      required: true,
      group: "Wife Details",
    },
    {
      name: "wifeCnic",
      label: "Wife's CNIC",
      labelUrdu: "بیوی کا شناختی کارڈ",
      type: "cnic",
      required: true,
      group: "Wife Details",
    },
    {
      name: "marriageDate",
      label: "Date of Marriage (Nikah)",
      labelUrdu: "تاریخ نکاح",
      type: "date",
      required: true,
      group: "Marriage Details",
    },
    {
      name: "nikahRegistrationNo",
      label: "Nikah Registration No.",
      labelUrdu: "نکاح رجسٹریشن نمبر",
      type: "text",
      required: false,
      group: "Marriage Details",
    },
    {
      name: "mehrAmount",
      label: "Haq Mehr Amount (PKR)",
      labelUrdu: "حق مہر کی رقم (روپے)",
      type: "number",
      required: true,
      group: "Financial",
    },
    {
      name: "divorceType",
      label: "Type of Divorce",
      labelUrdu: "طلاق کی قسم",
      type: "select",
      required: true,
      options: [
        { value: "talaq", label: "Talaq (by Husband)", labelUrdu: "طلاق (شوہر کی طرف سے)" },
        { value: "khula", label: "Khula (by Wife)", labelUrdu: "خلع (بیوی کی طرف سے)" },
        { value: "mubarat", label: "Mubarat (Mutual)", labelUrdu: "مبارات (باہمی رضامندی)" },
      ],
      group: "Divorce Details",
    },
    {
      name: "divorceReason",
      label: "Reason for Divorce",
      labelUrdu: "طلاق کی وجہ",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Divorce Details",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a Divorce Deed (Talaq Nama) in {{language}}.

HUSBAND:
- Name: {{husbandName}}
- Father's Name: {{husbandFatherName}}
- CNIC: {{husbandCnic}}

WIFE:
- Name: {{wifeName}}
- Father's Name: {{wifeFatherName}}
- CNIC: {{wifeCnic}}

MARRIAGE:
- Date: {{marriageDate}}
- Registration No: {{nikahRegistrationNo}}
- Haq Mehr: PKR {{mehrAmount}}

DIVORCE:
- Type: {{divorceType}}
- Reason: {{divorceReason}}

REFERENCE FORMAT — Follow this exact Pakistani legal format:

DIVORCE DEED (FIRST NOTICE)

From: [Husband Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address].

That I was married with Mst. [Wife Name] D/o [Wife Father Name] on [Marriage Date] according to Muslim rites and the Nikah was registered vide No. [Nikah Registration No.] The Haq Mehr agreed was PKR [Mehr Amount]/-.

That [reason for divorce/incompatibility].

That in these circumstances we cannot live as husband and wife according to the limits of God. So I, [Husband Name], do hereby pronounce Today [Date] First Notice of Divorce upon Mst. [Wife Name] and free her from marital ties. Henceforth, she is at liberty to contract a second marriage of her choice after spending the Iddat period, on which the undersigned has no objection.

That the Haq Mehr amounting to PKR [Mehr Amount]/- shall be paid as per agreed terms.

That both parties have no claim against each other legally and judicially after the completion of Iddat period.

Therefore this Divorce Deed has been executed before two witnesses for certification to use it when needed.

Date: _____________

EXECUTANT
[Husband Name] S/o [Father Name]
CNIC No. ___________

Witness 1:                              Witness 2:
Name: ___________________              Name: ___________________
CNIC No.: _________________            CNIC No.: _________________

NOTE: Under Muslim Family Laws Ordinance 1961, Section 7, this divorce notice shall be sent to the Chairman, Union Council concerned. Divorce becomes effective after 90 days (or upon completion of Iddat period).

INSTRUCTIONS:
- Title: DIVORCE DEED (FIRST NOTICE) for first notice; change to SECOND or THIRD for subsequent notices
- From: clause identifying husband with CNIC
- "That..." paragraphs for marriage details, reason, and divorce pronouncement
- Date and EXECUTANT signature block
- Two witness signature blocks
- Include Section 7 notice requirement
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
