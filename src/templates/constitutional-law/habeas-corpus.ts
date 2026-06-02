import { TemplateDefinition } from "../types";

export const habeasCorpus: TemplateDefinition = {
  category: "constitutional-law",
  subType: "habeas-corpus",
  name: "Habeas Corpus Petition / ہیبیس کارپس درخواست",
  nameUrdu: "ہیبیس کارپس درخواست",
  description: "Habeas corpus petition for illegal detention under Article 199 of the Constitution",
  descriptionUrdu: "آئین کے آرٹیکل 199 کے تحت غیر قانونی حراست کے خلاف ہیبیس کارپس درخواست",
  icon: "Unlock",
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
      name: "petitionerRelation",
      label: "Relation with Detainee",
      labelUrdu: "قیدی سے تعلق",
      type: "text",
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
      name: "petitionerCnic",
      label: "Petitioner's CNIC",
      labelUrdu: "درخواست گزار کا شناختی کارڈ",
      type: "cnic",
      required: true,
      group: "Petitioner Details",
    },
    {
      name: "detaineeName",
      label: "Detainee's Name",
      labelUrdu: "زیر حراست شخص کا نام",
      type: "text",
      required: true,
      group: "Detainee Details",
    },
    {
      name: "detaineeCnic",
      label: "Detainee's CNIC",
      labelUrdu: "زیر حراست شخص کا شناختی کارڈ",
      type: "cnic",
      required: false,
      group: "Detainee Details",
    },
    {
      name: "detainingAuthority",
      label: "Detaining Authority",
      labelUrdu: "حراست میں رکھنے والا ادارہ",
      type: "text",
      required: true,
      group: "Detention Details",
    },
    {
      name: "detentionDate",
      label: "Date of Detention",
      labelUrdu: "حراست کی تاریخ",
      type: "date",
      required: true,
      group: "Detention Details",
    },
    {
      name: "detentionPlace",
      label: "Place of Detention (if known)",
      labelUrdu: "حراست کی جگہ (اگر معلوم ہو)",
      type: "text",
      required: false,
      group: "Detention Details",
    },
    {
      name: "illegalityGrounds",
      label: "Grounds of Illegality of Detention",
      labelUrdu: "حراست کی غیر قانونیت کی بنیادیں",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Detention Details",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a Habeas Corpus Petition in {{language}}.

PETITIONER:
- Name: {{petitionerName}}
- Relation with Detainee: {{petitionerRelation}}
- Address: {{petitionerAddress}}
- CNIC: {{petitionerCnic}}

DETAINEE:
- Name: {{detaineeName}}
- CNIC: {{detaineeCnic}}

DETENTION DETAILS:
- Detaining Authority: {{detainingAuthority}}
- Date of Detention: {{detentionDate}}
- Place of Detention: {{detentionPlace}}
- Grounds of Illegality: {{illegalityGrounds}}

REFERENCE FORMAT — Follow this exact Pakistani legal format:

IN THE HIGH COURT OF [PROVINCE] AT [CITY]

CONSTITUTIONAL PETITION NO. _______ OF 20___

[Petitioner Name], CNIC No. [CNIC], [Relationship] of the Detainee, resident of [Address]
                                                                    ...PETITIONER
VERSUS
[Detaining Authority / Official Name], [Designation], [Address]
                                                                    ...RESPONDENT

PETITION UNDER ARTICLE 199 OF THE CONSTITUTION FOR ISSUANCE OF WRIT OF HABEAS CORPUS

RESPECTFULLY SHEWETH:

1. That [Detainee Name] S/o [Father Name], CNIC No. [Detainee CNIC], a citizen of Pakistan, was detained / arrested by [Detaining Authority] on [Date of Detention] from [Place of Detention].
2. That the Petitioner is the [Relationship] of the above-named detainee and files this petition on his/her behalf.
3. That the detention of the detainee is illegal, unlawful and without any lawful authority for the following reasons:
   (i) [Ground 1 — no FIR registered / no charge framed / no judicial order for detention];
   (ii) [Ground 2 — violation of Article 9 Constitution — right to life and liberty];
   (iii) [Ground 3 — violation of Article 10 — right to be informed of grounds of arrest];
   (iv) [Ground 4 — violation of Article 10-A — right to fair trial].
4. That the continued detention is arbitrary and amounts to an infringement of the fundamental rights guaranteed under Articles 9, 10, and 10-A of the Constitution of Pakistan 1973.
5. That the Petitioner has no other adequate remedy at law.

It is therefore most respectfully prayed that this Honourable Court may be pleased to:
(a) Issue a Writ of Habeas Corpus directing the Respondent to produce the body of [Detainee Name] before this Court;
(b) Release [Detainee Name] from illegal detention forthwith;
(c) Pass any other order as deemed just and proper.

[Petitioner Name]
CNIC: ___________

Advocate: ___________________

INSTRUCTIONS:
- Court heading: IN THE HIGH COURT OF [PROVINCE] AT [CITY]
- PETITION UNDER ARTICLE 199 for HABEAS CORPUS
- Petitioner and Respondent identification
- "RESPECTFULLY SHEWETH:" opening
- Numbered "That..." paragraphs
- Constitutional articles: 9, 10, 10-A
- Prayer clause with (a), (b), (c) items
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
