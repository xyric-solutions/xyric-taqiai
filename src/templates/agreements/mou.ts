import { TemplateDefinition } from "../types";

export const mouAgreement: TemplateDefinition = {
  category: "agreement",
  subType: "mou",
  name: "Memorandum of Understanding (MOU)",
  nameUrdu: "یادداشت مفاہمت",
  description: "MOU between two parties for cooperation",
  descriptionUrdu: "دو فریقین کے درمیان تعاون کی یادداشت",
  icon: "ScrollText",
  formFields: [
    {
      name: "party1Name",
      label: "Party 1 Name",
      labelUrdu: "فریق اول کا نام",
      type: "text",
      required: true,
      group: "Party 1 Details",
    },
    {
      name: "party1Cnic",
      label: "Party 1 CNIC",
      labelUrdu: "فریق اول کا شناختی کارڈ",
      type: "cnic",
      required: true,
      group: "Party 1 Details",
    },
    {
      name: "party1Address",
      label: "Party 1 Address",
      labelUrdu: "فریق اول کا پتہ",
      type: "address",
      required: true,
      group: "Party 1 Details",
    },
    {
      name: "party2Name",
      label: "Party 2 Name",
      labelUrdu: "فریق دوم کا نام",
      type: "text",
      required: true,
      group: "Party 2 Details",
    },
    {
      name: "party2Cnic",
      label: "Party 2 CNIC",
      labelUrdu: "فریق دوم کا شناختی کارڈ",
      type: "cnic",
      required: true,
      group: "Party 2 Details",
    },
    {
      name: "party2Address",
      label: "Party 2 Address",
      labelUrdu: "فریق دوم کا پتہ",
      type: "address",
      required: true,
      group: "Party 2 Details",
    },
    {
      name: "purpose",
      label: "Purpose of MOU",
      labelUrdu: "یادداشت کا مقصد",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "MOU Details",
    },
    {
      name: "scopeOfCooperation",
      label: "Scope of Cooperation",
      labelUrdu: "تعاون کا دائرہ کار",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "MOU Details",
    },
    {
      name: "responsibilitiesParty1",
      label: "Responsibilities of Party 1",
      labelUrdu: "فریق اول کی ذمہ داریاں",
      type: "textarea",
      required: false,
      aiSuggestable: true,
      group: "Responsibilities",
    },
    {
      name: "responsibilitiesParty2",
      label: "Responsibilities of Party 2",
      labelUrdu: "فریق دوم کی ذمہ داریاں",
      type: "textarea",
      required: false,
      aiSuggestable: true,
      group: "Responsibilities",
    },
    {
      name: "duration",
      label: "Duration (months)",
      labelUrdu: "مدت (مہینے)",
      type: "number",
      required: true,
      group: "MOU Details",
    },
    {
      name: "disputeResolution",
      label: "Dispute Resolution Mechanism",
      labelUrdu: "تنازعات کے حل کا طریقہ",
      type: "textarea",
      required: false,
      aiSuggestable: true,
      group: "Terms",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a Memorandum of Understanding (MOU) in {{language}}.

PARTY 1:
- Name: {{party1Name}}
- CNIC: {{party1Cnic}}
- Address: {{party1Address}}

PARTY 2:
- Name: {{party2Name}}
- CNIC: {{party2Cnic}}
- Address: {{party2Address}}

MOU DETAILS:
- Purpose: {{purpose}}
- Scope: {{scopeOfCooperation}}
- Duration: {{duration}} months

RESPONSIBILITIES:
- Party 1: {{responsibilitiesParty1}}
- Party 2: {{responsibilitiesParty2}}

DISPUTE RESOLUTION: {{disputeResolution}}

REFERENCE FORMAT — Follow this exact Pakistani legal format:

MEMORANDUM OF UNDERSTANDING (MOU)

This Memorandum of Understanding is entered into on this ___ day of ___________, 20___ at [City].

BETWEEN:

[Party 1 Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
(hereinafter referred to as "PARTY 1" / First Party)

AND

[Party 2 Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
(hereinafter referred to as "PARTY 2" / Second Party)

WHEREAS both parties desire to formalize their mutual understanding regarding [Purpose / Subject Matter], both parties hereby agree as under:

1. PURPOSE: The purpose of this MOU is to [state the purpose and objectives].

2. SCOPE OF COOPERATION: The parties agree to cooperate in the following areas:
   [Scope of cooperation]

3. RESPONSIBILITIES OF PARTY 1:
   [Party 1 responsibilities]

4. RESPONSIBILITIES OF PARTY 2:
   [Party 2 responsibilities]

5. DURATION: This MOU shall be effective for a period of [Duration] months from the date of signing and may be renewed by mutual written consent.

6. CONFIDENTIALITY: Both parties agree to keep all information exchanged under this MOU confidential and shall not disclose the same to any third party without prior written consent.

7. TERMINATION: Either party may terminate this MOU by giving [notice period] days written notice to the other party.

8. DISPUTE RESOLUTION: Any dispute arising out of this MOU shall be settled amicably through mutual negotiation. [Arbitration clause if applicable].

9. GOVERNING LAW: This MOU shall be governed by and construed in accordance with the laws of Pakistan.

IN WITNESS WHEREOF, both parties have set their hands to this MOU on the day and year first written above.

PARTY 1                                   PARTY 2
[Name]                                    [Name]
CNIC: ___________                         CNIC: ___________

Witness 1: ___________________     Witness 2: ___________________

INSTRUCTIONS:
- Title: MEMORANDUM OF UNDERSTANDING (MOU) (centered, bold)
- BETWEEN / AND party structure
- WHEREAS clause for purpose
- Numbered sections: PURPOSE, SCOPE, RESPONSIBILITIES, DURATION, CONFIDENTIALITY, TERMINATION, DISPUTE RESOLUTION, GOVERNING LAW
- Both signatures at bottom
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
