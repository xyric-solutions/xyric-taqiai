import { TemplateDefinition } from "../types";

export const deportationDefense: TemplateDefinition = {
  category: "immigration-law",
  subType: "deportation-defense",
  name: "Defense Against Deportation / ملک بدری کے خلاف دفاع",
  nameUrdu: "ملک بدری کے خلاف دفاع",
  description: "Legal defense against deportation proceedings",
  descriptionUrdu: "ملک بدری کی کارروائی کے خلاف قانونی دفاع",
  icon: "ShieldCheck",
  formFields: [
    {
      name: "applicantName",
      label: "Applicant's Full Name",
      labelUrdu: "درخواست گزار کا مکمل نام",
      type: "text",
      required: true,
      group: "Applicant Details",
    },
    {
      name: "applicantPassport",
      label: "Passport Number",
      labelUrdu: "پاسپورٹ نمبر",
      type: "text",
      required: true,
      group: "Applicant Details",
    },
    {
      name: "applicantAddress",
      label: "Current Address",
      labelUrdu: "موجودہ پتہ",
      type: "address",
      required: true,
      group: "Applicant Details",
    },
    {
      name: "country",
      label: "Country Issuing Deportation",
      labelUrdu: "ملک بدری جاری کرنے والا ملک",
      type: "text",
      required: true,
      group: "Deportation Details",
    },
    {
      name: "reasonForDeportation",
      label: "Reason Given for Deportation",
      labelUrdu: "ملک بدری کی بتائی گئی وجہ",
      type: "textarea",
      required: true,
      group: "Deportation Details",
    },
    {
      name: "groundsToStay",
      label: "Legal Grounds to Stay / Challenge",
      labelUrdu: "رہنے / چیلنج کرنے کی قانونی بنیادیں",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Defense Details",
    },
    {
      name: "familyTies",
      label: "Family Ties in the Country",
      labelUrdu: "ملک میں خاندانی تعلقات",
      type: "textarea",
      required: false,
      group: "Defense Details",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a Defense Against Deportation Document in {{language}}.

APPLICANT:
- Name: {{applicantName}}
- Passport: {{applicantPassport}}
- Address: {{applicantAddress}}

DEPORTATION DETAILS:
- Country: {{country}}
- Reason for Deportation: {{reasonForDeportation}}

DEFENSE DETAILS:
- Legal Grounds to Stay: {{groundsToStay}}
- Family Ties: {{familyTies}}

Generate a complete legal defense document against deportation proceedings.
Include proper addressing to the relevant immigration authority, applicant background, legal grounds for challenging deportation, humanitarian considerations, family ties argument, and prayer for relief.
RefereREFERENCE FORMAT - Follow this exact Pakistani legal format:

IN THE HIGH COURT OF [PROVINCE] AT [CITY]

WRIT PETITION NO. _______ OF 20___
(Under Article 199, Constitution of Pakistan 1973 - Against Deportation Order)

[Petitioner Name], Passport No. [Passport No.], Nationality: [Nationality], resident of [Address in Pakistan]
                                                    ...PETITIONER
VERSUS
1. The Federal Government through Secretary Interior, Islamabad    ...RESPONDENT 1
2. The Director General, Directorate of Immigration, [City]       ...RESPONDENT 2

PETITION AGAINST DEPORTATION ORDER

RESPECTFULLY SHEWETH:

1. That the Petitioner is a [Nationality] national lawfully present in Pakistan on [Visa Type] visa since [Date].
2. That the Respondents have issued a deportation order dated [Date] directing the Petitioner to leave Pakistan.
3. That the deportation order is illegal, mala fide, and violates the Petitioner's fundamental rights under Articles 9 and 10 of the Constitution.
4. That deporting the Petitioner would violate the principle of Non-Refoulement as the Petitioner faces [Risk] in the country of deportation.
5. That the Foreigners Act 1946 and ICCPR obligations require due process before deportation.

It is therefore prayed that this Honourable Court may:
(a) Suspend the deportation order during pendency of this petition;
(b) Declare the deportation order illegal;
(c) Any other appropriate relief.

Petitioner: ___________
Advocate: ___________________

INSTRUCTIONS:
- Court heading: IN THE HIGH COURT AT [CITY] (centered, bold)
- Article 199 Constitution petition
- Reference Foreigners Act 1946 and Non-Refoulement principle
- "RESPECTFULLY SHEWETH:" opening
- Prayer clause with (a), (b), (c) items
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
