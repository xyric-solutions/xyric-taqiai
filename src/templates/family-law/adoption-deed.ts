import { TemplateDefinition } from "../types";

export const adoptionDeed: TemplateDefinition = {
  category: "family-law",
  subType: "adoption-deed",
  name: "Adoption Deed",
  nameUrdu: "گود نامہ",
  description: "Legal deed for child adoption",
  descriptionUrdu: "بچے کی گود لینے کا قانونی دستاویز",
  icon: "Users",
  formFields: [
    {
      name: "adoptiveParentName",
      label: "Adoptive Parent Name",
      labelUrdu: "گود لینے والے کا نام",
      type: "text",
      required: true,
      group: "Adoptive Parent",
    },
    {
      name: "adoptiveParentCnic",
      label: "Adoptive Parent CNIC",
      labelUrdu: "شناختی کارڈ",
      type: "cnic",
      required: true,
      group: "Adoptive Parent",
    },
    {
      name: "adoptiveParentAddress",
      label: "Address",
      labelUrdu: "پتہ",
      type: "address",
      required: true,
      group: "Adoptive Parent",
    },
    {
      name: "childName",
      label: "Child's Name",
      labelUrdu: "بچے کا نام",
      type: "text",
      required: true,
      group: "Child Details",
    },
    {
      name: "childAge",
      label: "Child's Age",
      labelUrdu: "بچے کی عمر",
      type: "number",
      required: true,
      group: "Child Details",
    },
    {
      name: "biologicalParentName",
      label: "Biological Parent/Guardian Name",
      labelUrdu: "حقیقی والدین/سرپرست کا نام",
      type: "text",
      required: false,
      group: "Biological Parent",
    },
    {
      name: "adoptionReason",
      label: "Reason for Adoption",
      labelUrdu: "گود لینے کی وجہ",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Details",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate an Adoption Deed in {{language}}.

ADOPTIVE PARENT:
- Name: {{adoptiveParentName}}
- CNIC: {{adoptiveParentCnic}}
- Address: {{adoptiveParentAddress}}

CHILD:
- Name: {{childName}}
- Age: {{childAge}}

BIOLOGICAL PARENT/GUARDIAN: {{biologicalParentName}}
REASON: {{adoptionReason}}

Generate a compREFERENCE FORMAT - Follow this exact Pakistani legal format:

DEED OF GUARDIANSHIP / DEED OF CUSTODY
(Note: Pakistan does not recognize formal adoption under Islamic law; this deed establishes legal guardianship under Guardians and Wards Act 1890)

IN THE FAMILY COURT / GUARDIAN COURT AT [CITY]

APPLICATION UNDER SECTIONS 7 & 10, GUARDIANS AND WARDS ACT 1890

[Applicant Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
                                                    ...APPLICANT

IN THE MATTER OF GUARDIANSHIP OF MINOR:
[Minor Name], Date of Birth: [DOB], Age: [Age]

RESPECTFULLY SHEWETH:

1. That the Applicant is the [Relative - paternal uncle / maternal uncle / family friend] of the minor [Minor Name].
2. That the natural parents of the minor are [Father Name] and [Mother Name] who have [died / given consent / are unable to care for the minor].
3. That the Applicant is willing and able to provide care, education, and welfare to the minor.
4. That it is in the paramount interest and welfare of the minor to be placed under the guardianship of the Applicant.
5. That the Applicant undertakes to maintain and educate the minor as per his/her own resources.

GUARDIANSHIP DEED:

[Applicant Name] hereby declares that he/she shall act as legal guardian of [Minor Name] and shall be responsible for his/her education, welfare, maintenance, and upbringing.

Consent of Natural Parent / Court Order: [Reference]

GUARDIAN
[Applicant Name] S/o [Father Name]
CNIC: ___________

INSTRUCTIONS:
- Title: DEED OF GUARDIANSHIP (centered, bold)
- Note about Islamic law and Guardians and Wards Act 1890
- "RESPECTFULLY SHEWETH:" if court application
- Include welfare of minor as paramount consideration
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
