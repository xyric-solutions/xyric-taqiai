import { TemplateDefinition } from "../types";

export const worshipPlaceProtection: TemplateDefinition = {
  category: "non-muslim-laws",
  subType: "worship-place-protection",
  name: "Place of Worship Protection",
  nameUrdu: "عبادت گاہ کا تحفظ",
  description: "Application for protection of church, temple, gurdwara under PPC 295-297",
  descriptionUrdu: "PPC 295-297 کے تحت چرچ، مندر، گردوارہ کے تحفظ کی درخواست",
  icon: "Church",
  formFields: [
    { name: "applicantName", label: "Applicant's Name", labelUrdu: "درخواست گزار", type: "text", required: true, group: "Applicant" },
    { name: "applicantCnic", label: "CNIC", labelUrdu: "شناختی کارڈ", type: "cnic", required: true, group: "Applicant" },
    { name: "applicantCapacity", label: "Capacity (Trustee/Caretaker/Member)", labelUrdu: "حیثیت", type: "text", required: true, group: "Applicant" },
    { name: "worshipPlaceType", label: "Type of Worship Place", labelUrdu: "عبادت گاہ کی قسم", type: "select", required: true, group: "Place Details",
      options: [
        { value: "church", label: "Church" },
        { value: "temple", label: "Hindu Temple" },
        { value: "gurdwara", label: "Sikh Gurdwara" },
        { value: "fire-temple", label: "Parsi Fire Temple" },
        { value: "buddhist-monastery", label: "Buddhist Monastery" },
        { value: "other", label: "Other" },
      ],
    },
    { name: "worshipPlaceName", label: "Name of Place of Worship", labelUrdu: "عبادت گاہ کا نام", type: "text", required: true, group: "Place Details" },
    { name: "worshipPlaceAddress", label: "Address/Location", labelUrdu: "مقام", type: "address", required: true, group: "Place Details" },
    { name: "threatType", label: "Type of Threat/Violation", labelUrdu: "خطرے کی نوعیت", type: "select", required: true, group: "Case Details",
      options: [
        { value: "encroachment", label: "Land Encroachment/Illegal Occupation" },
        { value: "demolition", label: "Threat of Demolition" },
        { value: "desecration", label: "Desecration/Damage" },
        { value: "denied-access", label: "Access Denied" },
        { value: "forced-takeover", label: "Forced Takeover" },
        { value: "government-action", label: "Government/ETPB Action" },
      ],
    },
    { name: "facts", label: "Detailed Facts", labelUrdu: "تفصیلی حقائق", type: "textarea", required: true, group: "Case Details" },
    { name: "reliefSought", label: "Relief Sought", labelUrdu: "مطلوبہ ریلیف", type: "textarea", required: true, group: "Case Details" },
  ],
  promptTemplate: `Generate a legal application for Protection of Place of Worship in Pakistan.
Applicant: {applicantName}, CNIC: {applicantCnic}, Capacity: {applicantCapacity}
Place: {worshipPlaceType} - {worshipPlaceName}, Address: {worshipPlaceAddress}
Threat: {threatType}
Facts: {facts}
Relief: {reliefSought}
Cite PPC Sections 295 (injuring place of worship), 296 (disturbing religious assembly), 297 (trespassing burial places). Article 20 & 36 Constitution. Evacuee Trust Properties Act 1975 if applicable. File in Civil Court for injunction and/or High Court under Article 199.

REFERENCE FORMAT - Follow this exact Pakistani legal format:

IN THE HIGH COURT OF [PROVINCE] AT [CITY]

WRIT PETITION NO. _______ OF 20___
(Under Article 199 - Protection of Place of Worship)

[Petitioner Name / Church Committee / Temple Trust], CNIC No. [CNIC], resident of [Address]
                                                    ...PETITIONER
VERSUS
[Respondent - Government Authority / Individual], [Address]
                                                    ...RESPONDENT

PETITION FOR PROTECTION OF PLACE OF WORSHIP

RESPECTFULLY SHEWETH:

1. That the [Church / Temple / Gurdwara / Cemetery] situated at [Address] has been used for religious purposes by the [Community] for [Duration] years.
2. That the said place of worship is protected under Article 20 of the Constitution (freedom to profess religion and manage religious institutions).
3. That the Respondent is encroaching / damaging / attempting to demolish the said place of worship.
4. That PPC Sections 295 (injury to place of worship) and 296 (disturbing religious assembly) protect such places.

PRAYER:
(a) Issue an injunction restraining the Respondent from interfering with the place of worship;
(b) Declare the Respondent's action unconstitutional;
(c) Direct restoration of damage if any.

INSTRUCTIONS:
- Court heading: IN THE HIGH COURT AT [CITY] (centered, bold)
- Article 199 petition
- Reference Article 20 and 36 Constitution
- Reference PPC Sections 295, 296, 297
- "RESPECTFULLY SHEWETH:" opening
- Prayer clause with (a), (b), (c) items
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
