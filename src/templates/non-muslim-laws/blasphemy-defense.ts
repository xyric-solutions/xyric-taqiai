import { TemplateDefinition } from "../types";

export const blasphemyDefense: TemplateDefinition = {
  category: "non-muslim-laws",
  subType: "blasphemy-defense",
  name: "Blasphemy Case Defense / Bail",
  nameUrdu: "توہین مذہب کیس دفاع / ضمانت",
  description: "Defense petition and bail application in blasphemy cases (PPC 295-A/B/C)",
  descriptionUrdu: "توہین مذہب کیس میں دفاعی درخواست اور ضمانت (PPC 295)",
  icon: "Scale",
  formFields: [
    { name: "accusedName", label: "Accused's Name", labelUrdu: "ملزم کا نام", type: "text", required: true, group: "Accused" },
    { name: "accusedCnic", label: "CNIC", labelUrdu: "شناختی کارڈ", type: "cnic", required: true, group: "Accused" },
    { name: "accusedReligion", label: "Religion", labelUrdu: "مذہب", type: "text", required: true, group: "Accused" },
    { name: "accusedAddress", label: "Address", labelUrdu: "پتہ", type: "address", required: true, group: "Accused" },
    { name: "firNumber", label: "FIR Number", labelUrdu: "ایف آئی آر نمبر", type: "text", required: true, group: "Case Details" },
    { name: "policeStation", label: "Police Station", labelUrdu: "تھانہ", type: "text", required: true, group: "Case Details" },
    { name: "section", label: "PPC Section Charged", labelUrdu: "دفعہ", type: "select", required: true, group: "Case Details",
      options: [
        { value: "295-A", label: "295-A (Outraging religious feelings)", labelUrdu: "295-A (مذہبی جذبات کو ٹھیس پہنچانا)" },
        { value: "295-B", label: "295-B (Defiling Holy Quran)", labelUrdu: "295-B (قرآن پاک کی بے حرمتی)" },
        { value: "295-C", label: "295-C (Derogatory remarks)", labelUrdu: "295-C (توہین آمیز کلمات)" },
        { value: "298", label: "298 (Wounding religious feelings)", labelUrdu: "298 (مذہبی جذبات مجروح کرنا)" },
        { value: "multiple", label: "Multiple Sections", labelUrdu: "متعدد دفعات" },
      ],
    },
    { name: "documentType", label: "Document Type", labelUrdu: "دستاویز کی قسم", type: "select", required: true, group: "Case Details",
      options: [
        { value: "bail", label: "Bail Application (Pre-Arrest/Post-Arrest)", labelUrdu: "ضمانت کی درخواست (قبل از/بعد از گرفتاری)" },
        { value: "quashment", label: "FIR Quashment Petition", labelUrdu: "ایف آئی آر منسوخی کی درخواست" },
        { value: "defense", label: "Written Defense Statement", labelUrdu: "تحریری دفاعی بیان" },
        { value: "appeal", label: "Appeal against Conviction", labelUrdu: "سزا کے خلاف اپیل" },
      ],
    },
    { name: "facts", label: "Brief Facts & Defense Grounds", labelUrdu: "حقائق اور دفاعی بنیادیں", type: "textarea", required: true, group: "Defense" },
    { name: "evidence", label: "Evidence in Favor", labelUrdu: "حق میں شواہد", type: "textarea", required: false, group: "Defense" },
  ],
  promptTemplate: `Generate a professional {documentType} in a blasphemy case in Pakistan.
Accused: {accusedName}, CNIC: {accusedCnic}, Religion: {accusedReligion}, Address: {accusedAddress}
FIR: {firNumber}, Police Station: {policeStation}, Section: {section}
Facts & Defense: {facts}
Evidence: {evidence}
Reference: Asia Bibi v State (2018 SCMR 1969) - Supreme Court acquittal precedent on evidentiary standards. Salamat Masih v State (1995). Cite Section 497 CrPC for bail. Argue: (i) false accusation/mala fide (ii) no independent witness (iii) personal enmity (iv) evidentiary gaps. File in Sessions Court/High Court.

REFERENCE FORMAT - Follow this exact Pakistani legal format:

IN THE COURT OF SESSIONS JUDGE / HIGH COURT AT [CITY]

BAIL APPLICATION / WRITTEN DEFENSE IN BLASPHEMY CASE
(Under Sections 295-A/B/C/D PPC and Section 497/498 CrPC)

[Accused Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
                                                    ...ACCUSED

FIR No. [FIR Number], Police Station [Police Station], Sections 295-[A/B/C/D] PPC

RESPECTFULLY SHEWETH:

1. That the accused is a [Christian / Hindu / Sikh / other] minority community member and has been falsely implicated under Section 295-[___] PPC.
2. That the allegation is mala fide, motivated by personal enmity / property dispute, and no independent witness supports the accusation.
3. That the Supreme Court in Zaibun Nisa Hamidullah vs. State (PLD 1995) held that Section 295-C requires proof of "deliberate and malicious" intent.
4. That courts must exercise utmost caution in such cases as per Supreme Court guidelines to prevent misuse.

PRAYER:
(a) Grant bail to the accused;
(b) Acquit the accused as no prima facie case is made out;
(c) Any other appropriate relief.

INSTRUCTIONS:
- Court heading: IN THE COURT OF SESSIONS JUDGE AT [CITY] (centered, bold)
- "RESPECTFULLY SHEWETH:" opening
- Numbered paragraphs with defense arguments
- Cite Supreme Court precedents on blasphemy misuse
- Prayer clause with (a), (b), (c) items
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
