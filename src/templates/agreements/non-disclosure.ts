import { TemplateDefinition } from "../types";

export const nonDisclosure: TemplateDefinition = {
  category: "agreement",
  subType: "non-disclosure",
  name: "Non-Disclosure Agreement (NDA)",
  nameUrdu: "رازداری معاہدہ",
  description: "Non-disclosure / confidentiality agreement",
  descriptionUrdu: "رازداری کا معاہدہ",
  icon: "ShieldCheck",
  formFields: [
    {
      name: "disclosingPartyName",
      label: "Disclosing Party Name",
      labelUrdu: "معلومات فراہم کنندہ کا نام",
      type: "text",
      required: true,
      group: "Disclosing Party Details",
    },
    {
      name: "disclosingPartyCnic",
      label: "Disclosing Party CNIC",
      labelUrdu: "معلومات فراہم کنندہ کا شناختی کارڈ",
      type: "cnic",
      required: true,
      group: "Disclosing Party Details",
    },
    {
      name: "disclosingPartyAddress",
      label: "Disclosing Party Address",
      labelUrdu: "معلومات فراہم کنندہ کا پتہ",
      type: "address",
      required: true,
      group: "Disclosing Party Details",
    },
    {
      name: "receivingPartyName",
      label: "Receiving Party Name",
      labelUrdu: "معلومات وصول کنندہ کا نام",
      type: "text",
      required: true,
      group: "Receiving Party Details",
    },
    {
      name: "receivingPartyCnic",
      label: "Receiving Party CNIC",
      labelUrdu: "معلومات وصول کنندہ کا شناختی کارڈ",
      type: "cnic",
      required: true,
      group: "Receiving Party Details",
    },
    {
      name: "receivingPartyAddress",
      label: "Receiving Party Address",
      labelUrdu: "معلومات وصول کنندہ کا پتہ",
      type: "address",
      required: true,
      group: "Receiving Party Details",
    },
    {
      name: "purposeOfDisclosure",
      label: "Purpose of Disclosure",
      labelUrdu: "معلومات فراہم کرنے کا مقصد",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "NDA Details",
    },
    {
      name: "confidentialInfoDefinition",
      label: "Definition of Confidential Information",
      labelUrdu: "خفیہ معلومات کی تعریف",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "NDA Details",
    },
    {
      name: "durationOfConfidentiality",
      label: "Duration of Confidentiality (years)",
      labelUrdu: "رازداری کی مدت (سال)",
      type: "number",
      required: true,
      group: "NDA Details",
    },
    {
      name: "penaltiesForBreach",
      label: "Penalties for Breach",
      labelUrdu: "خلاف ورزی کی صورت میں سزا",
      type: "textarea",
      required: false,
      aiSuggestable: true,
      group: "Terms",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a Non-Disclosure Agreement (NDA) in {{language}}.

DISCLOSING PARTY:
- Name: {{disclosingPartyName}}
- CNIC: {{disclosingPartyCnic}}
- Address: {{disclosingPartyAddress}}

RECEIVING PARTY:
- Name: {{receivingPartyName}}
- CNIC: {{receivingPartyCnic}}
- Address: {{receivingPartyAddress}}

NDA DETAILS:
- Purpose: {{purposeOfDisclosure}}
- Confidential Info Definition: {{confidentialInfoDefinition}}
- Duration: {{durationOfConfidentiality}} years

PENALTIES: {{penaltiesForBreach}}

Generate a complete NDREFERENCE FORMAT - Follow this exact Pakistani legal format:

NON-DISCLOSURE AGREEMENT (NDA) / CONFIDENTIALITY AGREEMENT

This Non-Disclosure Agreement is made and executed on this ___ day of ___________, 20___ at [City].

BETWEEN:

[Disclosing Party Name / Company], [Address]
(hereinafter called the "DISCLOSING PARTY")

AND

[Receiving Party Name / Company], [Address]
(hereinafter called the "RECEIVING PARTY")

NOW THEREFORE BOTH PARTIES AGREE AS UNDER:

1. That the Disclosing Party intends to disclose certain confidential and proprietary information relating to [Subject Matter] to the Receiving Party for the purpose of [Purpose].
2. That the Receiving Party shall keep all such information strictly confidential and shall not disclose it to any third party.
3. That the Receiving Party shall use the confidential information solely for [Permitted Purpose] and for no other purpose.
4. That confidential information shall not include information that is publicly known, independently developed, or disclosed by a court order.
5. That the Receiving Party shall return or destroy all confidential information upon request or termination of this agreement.
6. That this agreement shall remain in force for [Duration] years and shall be governed by Pakistani law.

DISCLOSING PARTY                        RECEIVING PARTY
[Name / Company]                        [Name / Company]
CNIC / NTN: ___________                 CNIC / NTN: ___________

Witness 1: ___________________   Witness 2: ___________________

INSTRUCTIONS:
- Title: NON-DISCLOSURE AGREEMENT (centered, bold)
- BETWEEN / AND party structure
- Numbered "That..." clauses
- Include definition of confidential info, obligations, exclusions, return/destruction
- Both signatures at bottom
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
