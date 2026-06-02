import { TemplateDefinition } from "../types";

export const quashmentPetition: TemplateDefinition = {
  category: "criminal-law",
  subType: "quashment-petition",
  name: "FIR Quashment Petition / ایف آئی آر منسوخی کی درخواست",
  nameUrdu: "ایف آئی آر منسوخی کی درخواست",
  description: "Petition for quashment of FIR under Section 561-A CrPC",
  descriptionUrdu: "دفعہ 561-A ضابطہ فوجداری کے تحت ایف آئی آر منسوخ کرنے کی درخواست",
  icon: "FileX",
  formFields: [
    {
      name: "petitionerName",
      label: "Petitioner Name",
      labelUrdu: "درخواست گزار کا نام",
      type: "text",
      required: true,
      group: "Petitioner Details",
    },
    {
      name: "petitionerFatherName",
      label: "Petitioner Father's Name",
      labelUrdu: "درخواست گزار کے والد کا نام",
      type: "text",
      required: true,
      group: "Petitioner Details",
    },
    {
      name: "petitionerCnic",
      label: "Petitioner CNIC",
      labelUrdu: "درخواست گزار کا شناختی کارڈ",
      type: "cnic",
      required: true,
      group: "Petitioner Details",
    },
    {
      name: "petitionerAddress",
      label: "Petitioner Address",
      labelUrdu: "درخواست گزار کا پتہ",
      type: "address",
      required: true,
      group: "Petitioner Details",
    },
    {
      name: "firNumber",
      label: "FIR Number",
      labelUrdu: "ایف آئی آر نمبر",
      type: "text",
      required: true,
      group: "FIR Details",
    },
    {
      name: "firDate",
      label: "FIR Date",
      labelUrdu: "ایف آئی آر کی تاریخ",
      type: "date",
      required: true,
      group: "FIR Details",
    },
    {
      name: "policeStation",
      label: "Police Station",
      labelUrdu: "تھانہ",
      type: "text",
      required: true,
      group: "FIR Details",
    },
    {
      name: "sectionsInFir",
      label: "Sections in FIR",
      labelUrdu: "ایف آئی آر میں درج دفعات",
      type: "text",
      required: true,
      group: "FIR Details",
    },
    {
      name: "complainantName",
      label: "Complainant/Mushtaki Name",
      labelUrdu: "مشتکی کا نام",
      type: "text",
      required: true,
      group: "FIR Details",
    },
    {
      name: "groundsForQuashment",
      label: "Grounds for Quashment",
      labelUrdu: "منسوخی کی بنیادیں",
      type: "select",
      required: true,
      options: [
        { value: "no_offence", label: "No Cognizable Offence Made Out", labelUrdu: "کوئی قابل دست اندازی پولیس جرم نہیں بنتا" },
        { value: "civil_dispute", label: "Matter is Civil in Nature", labelUrdu: "معاملہ دیوانی نوعیت کا ہے" },
        { value: "malafide", label: "FIR Filed with Mala Fide Intent", labelUrdu: "بدنیتی سے ایف آئی آر درج کرائی گئی" },
        { value: "compromise", label: "Parties Have Compromised/Settled", labelUrdu: "فریقین میں صلح/سمجھوتہ ہو گیا" },
        { value: "abuse_of_process", label: "Abuse of Process of Court", labelUrdu: "عدالتی عمل کا غلط استعمال" },
        { value: "other", label: "Other Grounds", labelUrdu: "دیگر بنیادیں" },
      ],
      group: "Quashment Details",
    },
    {
      name: "detailedGrounds",
      label: "Detailed Grounds for Quashment",
      labelUrdu: "منسوخی کی تفصیلی بنیادیں",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Quashment Details",
    },
    {
      name: "factsOfCase",
      label: "Brief Facts of the Case",
      labelUrdu: "مقدمے کے مختصر حقائق",
      type: "textarea",
      required: true,
      group: "Case Details",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate an FIR Quashment Petition in {{language}}.

PETITIONER:
- Name: {{petitionerName}}
- Father's Name: {{petitionerFatherName}}
- CNIC: {{petitionerCnic}}
- Address: {{petitionerAddress}}

FIR DETAILS:
- FIR No: {{firNumber}}
- FIR Date: {{firDate}}
- Police Station: {{policeStation}}
- Sections: {{sectionsInFir}}
- Complainant: {{complainantName}}

QUASHMENT DETAILS:
- Primary Ground: {{groundsForQuashment}}
- Detailed Grounds: {{detailedGrounds}}
- Facts: {{factsOfCase}}

Generate a complete FIR Quashment Petition under Section 561-A of the Code of Criminal Procedure 1898 (CrPC) to be filed before the Honourable High Court. Reference the inherent powers of the High Court under Section 561-A CrPC. Cite relevant case law from PLD, SCMR, and PCrLJ regarding quashment of FIRREFERENCE FORMAT - Follow this exact Pakistani legal format:

IN THE HIGH COURT OF [PROVINCE] AT [CITY]

CRIMINAL MISCELLANEOUS APPLICATION / PETITION NO. _______ OF 20___
(Under Section 561-A CrPC / Article 199 Constitution for Quashment of FIR)

[Petitioner Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
                                                    ...PETITIONER
VERSUS
1. The State / Province through [AG / AAG]          ...RESPONDENT 1
2. [Complainant Name] S/o [Father Name], [Address]  ...RESPONDENT 2

PETITION FOR QUASHMENT OF FIR

RESPECTFULLY SHEWETH:

1. That FIR No. [FIR Number] dated [FIR Date] has been registered at Police Station [Police Station], under Sections [Sections PPC], at the instance of Respondent No. 2.
2. That the said FIR is the product of mala fides and is registered due to [Enmity / Personal Grudge / Abuse of Process].
3. That the allegations in the FIR do not constitute any cognizable offence as the essential ingredients of the offence are missing.
4. That the FIR is an abuse of the process of the court and if allowed to proceed, will cause irreparable harm to the Petitioner.
5. That this is a fit case for exercise of inherent jurisdiction under Section 561-A CrPC.

It is therefore most respectfully prayed that this Honourable Court may be pleased to:
(a) Quash FIR No. [FIR Number] dated [Date];
(b) Grant ad-interim stay of arrest during pendency of this petition;
(c) Award costs of this petition.

Petitioner:
[Name] S/o [Father Name]
CNIC: ___________

Advocate: ___________________

INSTRUCTIONS:
- Court heading: IN THE HIGH COURT OF [PROVINCE] AT [CITY] (centered, bold)
- Reference Section 561-A CrPC and/or Article 199 Constitution
- Petitioner vs State + Complainant (two respondents)
- "RESPECTFULLY SHEWETH:" opening
- Numbered "That..." paragraphs: mala fides, no cognizable offence, abuse of process
- Prayer clause with (a), (b), (c) items including stay of arrest
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
