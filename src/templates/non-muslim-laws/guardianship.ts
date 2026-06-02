import { TemplateDefinition } from "../types";

export const nonMuslimGuardianship: TemplateDefinition = {
  category: "non-muslim-laws",
  subType: "guardianship",
  name: "Guardianship Petition (Non-Muslim)",
  nameUrdu: "سرپرستی کی درخواست (غیر مسلم)",
  description: "Guardianship petition under Guardians & Wards Act 1890 for non-Muslims",
  descriptionUrdu: "گارڈینز اینڈ وارڈز ایکٹ 1890 کے تحت غیر مسلم سرپرستی",
  icon: "Shield",
  formFields: [
    { name: "petitionerName", label: "Petitioner's Name", labelUrdu: "درخواست گزار کا نام", type: "text", required: true, group: "Petitioner" },
    { name: "petitionerCnic", label: "CNIC", labelUrdu: "شناختی کارڈ", type: "cnic", required: true, group: "Petitioner" },
    { name: "petitionerAddress", label: "Address", labelUrdu: "پتہ", type: "address", required: true, group: "Petitioner" },
    { name: "religion", label: "Religion", labelUrdu: "مذہب", type: "select", required: true, group: "Petitioner",
      options: [
        { value: "christian", label: "Christian" },
        { value: "hindu", label: "Hindu" },
        { value: "sikh", label: "Sikh" },
        { value: "parsi", label: "Parsi" },
        { value: "other", label: "Other" },
      ],
    },
    { name: "minorName", label: "Minor's Name", labelUrdu: "نابالغ کا نام", type: "text", required: true, group: "Minor Details" },
    { name: "minorAge", label: "Minor's Age", labelUrdu: "نابالغ کی عمر", type: "number", required: true, group: "Minor Details" },
    { name: "relationToMinor", label: "Relation to Minor", labelUrdu: "نابالغ سے تعلق", type: "text", required: true, group: "Minor Details" },
    { name: "reasonForGuardianship", label: "Reason for Guardianship", labelUrdu: "سرپرستی کی وجہ", type: "textarea", required: true, group: "Details" },
    { name: "propertyDetails", label: "Minor's Property (if any)", labelUrdu: "نابالغ کی جائیداد", type: "textarea", required: false, group: "Details" },
  ],
  promptTemplate: `Generate a Guardianship Petition under Guardians & Wards Act 1890 for a non-Muslim petitioner in Pakistan.
Petitioner: {petitionerName}, CNIC: {petitionerCnic}, Address: {petitionerAddress}, Religion: {religion}
Minor: {minorName}, Age: {minorAge}, Relation: {relationToMinor}
Reason: {reasonForGuardianship}
Property: {propertyDetails}
File in District Court. Cite Sections 7, 10, 17 of Guardians & Wards Act 1890.

REFERENCE FORMAT - Follow this exact Pakistani legal format:

IN THE DISTRICT COURT AT [CITY]

GUARDIANSHIP PETITION NO. _______ OF 20___
(Under Sections 7, 10 & 17, Guardians and Wards Act 1890)

[Petitioner Name] S/o [Father Name], CNIC No. [CNIC], Religion: [Religion], resident of [Address]
                                                    ...PETITIONER

MINOR: [Minor Name], Date of Birth: [DOB], Age: [Age], Religion: [Religion]

RESPECTFULLY SHEWETH:

1. That the Petitioner is the [Relation] of the minor [Minor Name] and is applying for guardianship.
2. That the minor is a [Christian / Hindu / Sikh / Parsi] citizen and the welfare of the minor requires appointment of a guardian.
3. That Section 17, Guardians and Wards Act 1890 makes welfare of the child the paramount consideration.
4. That the Petitioner is a fit and proper person to act as guardian of the minor's person / property.

PRAYER:
(a) Appoint the Petitioner as guardian of [Minor Name];
(b) Issue a Guardianship Certificate;
(c) Any other appropriate relief.

INSTRUCTIONS:
- Court heading: IN THE DISTRICT COURT AT [CITY] (centered, bold)
- Guardians and Wards Act 1890 Sections 7, 10, 17
- Minor's religion included
- Welfare of child as paramount
- Prayer clause with (a), (b), (c) items
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
