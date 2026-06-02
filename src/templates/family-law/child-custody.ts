import { TemplateDefinition } from "../types";

export const childCustody: TemplateDefinition = {
  category: "family-law",
  subType: "child-custody",
  name: "Hizanat / Child Custody Petition",
  nameUrdu: "حضانت / بچے کی تحویل کی درخواست",
  description: "Child custody petition under Guardian and Wards Act 1890",
  descriptionUrdu: "گارڈین اینڈ وارڈز ایکٹ 1890 کے تحت بچے کی تحویل کی درخواست",
  icon: "Baby",
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
      label: "Petitioner's Father/Husband Name",
      labelUrdu: "درخواست گزار کے والد/شوہر کا نام",
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
      name: "respondentName",
      label: "Respondent's Name",
      labelUrdu: "مدعا علیہ کا نام",
      type: "text",
      required: true,
      group: "Respondent Details",
    },
    {
      name: "respondentCnic",
      label: "Respondent's CNIC",
      labelUrdu: "مدعا علیہ کا شناختی کارڈ",
      type: "cnic",
      required: false,
      group: "Respondent Details",
    },
    {
      name: "respondentAddress",
      label: "Respondent's Address",
      labelUrdu: "مدعا علیہ کا پتہ",
      type: "address",
      required: true,
      group: "Respondent Details",
    },
    {
      name: "childrenDetails",
      label: "Children Details (Names, Ages, Gender)",
      labelUrdu: "بچوں کی تفصیلات (نام، عمریں، جنس)",
      type: "textarea",
      required: true,
      group: "Children Details",
    },
    {
      name: "currentCustodyStatus",
      label: "Current Custody Status",
      labelUrdu: "موجودہ تحویل کی صورتحال",
      type: "textarea",
      required: true,
      group: "Custody Details",
    },
    {
      name: "reasonForCustody",
      label: "Reason for Seeking Custody",
      labelUrdu: "تحویل حاصل کرنے کی وجہ",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Custody Details",
    },
    {
      name: "childPreference",
      label: "Child's Preference (if applicable)",
      labelUrdu: "بچے کی ترجیح (اگر لاگو ہو)",
      type: "textarea",
      required: false,
      group: "Custody Details",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a Child Custody (Hizanat) Petition in {{language}}.

PETITIONER:
- Name: {{petitionerName}}
- Father/Husband Name: {{petitionerFatherName}}
- CNIC: {{petitionerCnic}}
- Address: {{petitionerAddress}}

RESPONDENT:
- Name: {{respondentName}}
- CNIC: {{respondentCnic}}
- Address: {{respondentAddress}}

CHILDREN: {{childrenDetails}}
CURRENT CUSTODY STATUS: {{currentCustodyStatus}}
REASON FOR SEEKING CUSTODY: {{reasonForCustody}}
CHILD'S PREFERENCE: {{childPreference}}

REFERENCE FORMAT — Follow this exact Pakistani legal format:

IN THE FAMILY COURT AT [CITY]
PETITION UNDER SECTION 25, GUARDIAN AND WARDS ACT 1890

[Petitioner Name] [S/o or D/o or W/o] [Father/Husband Name], CNIC No. [CNIC], resident of [Address]
                                                                    ...PETITIONER

VERSUS

[Respondent Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
                                                                    ...RESPONDENT

PETITION FOR CUSTODY OF MINOR CHILD / HIZANAT

RESPECTFULLY SHEWETH:

1. That the Petitioner is the [mother/father/guardian] of the following minor child/children: [Children Details — Name, Age, DOB].
2. That the said minor children are presently in the custody of [Respondent Name] / the Respondent.
3. That as per Islamic law and the Guardian and Wards Act 1890, the Petitioner is legally entitled to the custody (Hizanat) of the said minor children.
4. That [reasons why petitioner should have custody — welfare of child, Islamic law rights, etc.].
5. That [current custody situation and why it is not in the best interest of the child].
6. That the welfare and best interests of the minor children require that their custody be awarded to the Petitioner.

It is therefore most respectfully prayed that this Honourable Court may be pleased to:
(a) Award custody (Hizanat) of the minor child/children to the Petitioner;
(b) Fix visitation rights for the Respondent;
(c) Pass any other order as deemed fit in the interest of justice.

VERIFICATION:
Verified on oath at [City] that the contents are true and correct to the best of my knowledge.

Petitioner:
[Petitioner Name]
CNIC: ___________

Advocate: ___________________

INSTRUCTIONS:
- Court heading: IN THE FAMILY COURT AT [CITY]
- PETITION UNDER GUARDIAN AND WARDS ACT heading
- Petitioner and Respondent identification
- "RESPECTFULLY SHEWETH:" opening
- Numbered "That..." paragraphs
- Prayer clause with (a), (b), (c) items
- Focus on "welfare of child" as key principle
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
