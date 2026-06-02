import { TemplateDefinition } from "../types";

export const minorityRightsPetition: TemplateDefinition = {
  category: "non-muslim-laws",
  subType: "minority-rights-petition",
  name: "Minority Rights Constitutional Petition",
  nameUrdu: "اقلیتی حقوق کی آئینی درخواست",
  description: "Constitutional petition under Articles 20, 25, 36 for protection of minority rights",
  descriptionUrdu: "آرٹیکل 20، 25، 36 کے تحت اقلیتی حقوق کے تحفظ کی درخواست",
  icon: "Shield",
  formFields: [
    { name: "petitionerName", label: "Petitioner's Name", labelUrdu: "درخواست گزار", type: "text", required: true, group: "Petitioner" },
    { name: "petitionerCnic", label: "CNIC", labelUrdu: "شناختی کارڈ", type: "cnic", required: true, group: "Petitioner" },
    { name: "petitionerReligion", label: "Religion", labelUrdu: "مذہب", type: "select", required: true, group: "Petitioner",
      options: [
        { value: "christian", label: "Christian" },
        { value: "hindu", label: "Hindu" },
        { value: "sikh", label: "Sikh" },
        { value: "parsi", label: "Parsi" },
        { value: "buddhist", label: "Buddhist" },
        { value: "kalash", label: "Kalash" },
        { value: "other", label: "Other Minority" },
      ],
    },
    { name: "petitionerAddress", label: "Address", labelUrdu: "پتہ", type: "address", required: true, group: "Petitioner" },
    { name: "respondent", label: "Respondent (Government Authority)", labelUrdu: "مدعا علیہ", type: "text", required: true, group: "Respondent" },
    { name: "rightViolated", label: "Right Violated", labelUrdu: "حق کی خلاف ورزی", type: "select", required: true, group: "Details",
      options: [
        { value: "religious-freedom", label: "Religious Freedom (Article 20)" },
        { value: "equality", label: "Equality Before Law (Article 25)" },
        { value: "discrimination", label: "Discrimination in Services (Article 27)" },
        { value: "worship-place", label: "Place of Worship Violation (PPC 295)" },
        { value: "forced-conversion", label: "Forced Conversion" },
        { value: "property", label: "Religious Property Encroachment" },
        { value: "education", label: "Educational Institution Rights (Article 22)" },
        { value: "cultural", label: "Cultural/Language Rights (Article 28)" },
      ],
    },
    { name: "facts", label: "Detailed Facts", labelUrdu: "تفصیلی حقائق", type: "textarea", required: true, group: "Details" },
    { name: "reliefSought", label: "Relief Sought", labelUrdu: "مطلوبہ ریلیف", type: "textarea", required: true, group: "Details" },
  ],
  promptTemplate: `Generate a Constitutional Petition for protection of minority rights in Pakistan.
Petitioner: {petitionerName}, CNIC: {petitionerCnic}, Religion: {petitionerReligion}, Address: {petitionerAddress}
Respondent: {respondent}
Right Violated: {rightViolated}
Facts: {facts}
Relief: {reliefSought}
File under Article 199 in High Court. Cite Articles 20, 25, 26, 27, 28, 36 of Constitution. Reference Suo Motu Case 1/2014 (Supreme Court minority rights judgment).

REFERENCE FORMAT - Follow this exact Pakistani legal format:

IN THE HIGH COURT OF [PROVINCE] AT [CITY]

WRIT PETITION NO. _______ OF 20___
(Under Article 199 - Protection of Minority Rights)

[Petitioner Name] S/o [Father Name], CNIC No. [CNIC], Religion: [Religion], resident of [Address]
                                                    ...PETITIONER
VERSUS
[Respondent Authority Name], [Designation], [Address]
                                                    ...RESPONDENT

PETITION FOR PROTECTION OF MINORITY RIGHTS

RESPECTFULLY SHEWETH:

1. That the Petitioner is a [Christian / Hindu / Sikh / other] minority citizen of Pakistan.
2. That the Respondent has violated the Petitioner's fundamental rights under Articles [20/25/26/27/28/36] of the Constitution.
3. That the facts of the violation are: [Detailed Facts].
4. That the Supreme Court in Suo Motu Case 1/2014 held that minority rights must be protected.
5. That this Court has jurisdiction under Article 199 to enforce fundamental rights.

PRAYER:
(a) Issue directions to protect the Petitioner's minority rights;
(b) Declare the Respondent's action unconstitutional;
(c) Award compensation and costs.

INSTRUCTIONS:
- Court heading: IN THE HIGH COURT AT [CITY] (centered, bold)
- Article 199 petition
- Reference Articles 20, 25, 26, 27, 28, 36 Constitution
- Reference Suo Motu Case 1/2014
- "RESPECTFULLY SHEWETH:" opening
- Prayer clause with (a), (b), (c) items
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
