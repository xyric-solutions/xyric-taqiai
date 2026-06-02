import { TemplateDefinition } from "../types";

export const noDemandAffidavit: TemplateDefinition = {
  category: "affidavit",
  subType: "no-demand",
  name: "No Demand Certificate Affidavit",
  nameUrdu: "عدم مطالبہ حلف نامہ",
  description: "Affidavit stating no remaining claims or demands exist",
  descriptionUrdu: "کوئی باقی دعویٰ یا مطالبہ نہ ہونے کا حلف نامہ",
  icon: "CheckCircle",
  formFields: [
    {
      name: "deponentName",
      label: "Deponent Name",
      labelUrdu: "حلف اٹھانے والے کا نام",
      type: "text",
      required: true,
      placeholder: "Enter full name",
      placeholderUrdu: "پورا نام درج کریں",
      group: "Deponent Details",
    },
    {
      name: "fatherName",
      label: "Father's / Husband's Name",
      labelUrdu: "والد / شوہر کا نام",
      type: "text",
      required: true,
      placeholder: "Enter father's or husband's name",
      group: "Deponent Details",
    },
    {
      name: "cnic",
      label: "CNIC Number",
      labelUrdu: "شناختی کارڈ نمبر",
      type: "cnic",
      required: true,
      placeholder: "XXXXX-XXXXXXX-X",
      validation: { pattern: "^[0-9]{5}-[0-9]{7}-[0-9]$" },
      group: "Deponent Details",
    },
    {
      name: "address",
      label: "Residential Address",
      labelUrdu: "رہائشی پتہ",
      type: "address",
      required: true,
      placeholder: "Enter complete address",
      group: "Deponent Details",
    },
    {
      name: "otherPartyName",
      label: "Other Party Name",
      labelUrdu: "دوسرے فریق کا نام",
      type: "text",
      required: true,
      placeholder: "Enter other party's full name",
      placeholderUrdu: "دوسرے فریق کا پورا نام درج کریں",
      group: "Other Party Details",
    },
    {
      name: "otherPartyCnic",
      label: "Other Party CNIC",
      labelUrdu: "دوسرے فریق کا شناختی کارڈ",
      type: "cnic",
      required: false,
      placeholder: "XXXXX-XXXXXXX-X",
      group: "Other Party Details",
    },
    {
      name: "otherPartyAddress",
      label: "Other Party Address",
      labelUrdu: "دوسرے فریق کا پتہ",
      type: "address",
      required: false,
      placeholder: "Enter other party's address",
      group: "Other Party Details",
    },
    {
      name: "transactionDetails",
      label: "Original Transaction / Matter Details",
      labelUrdu: "اصل لین دین / معاملے کی تفصیلات",
      type: "textarea",
      required: true,
      placeholder: "Describe the original transaction, agreement, or matter",
      aiSuggestable: true,
      group: "Transaction Details",
    },
    {
      name: "settlementDetails",
      label: "Settlement Details",
      labelUrdu: "تصفیے کی تفصیلات",
      type: "textarea",
      required: true,
      placeholder: "Describe how the matter was settled (payment received, work completed, etc.)",
      aiSuggestable: true,
      group: "Transaction Details",
    },
    {
      name: "noDemandStatement",
      label: "No Further Claims Statement",
      labelUrdu: "مزید دعوے نہ ہونے کا بیان",
      type: "textarea",
      required: false,
      placeholder: "Statement that no further demands or claims exist",
      aiSuggestable: true,
      group: "Declaration",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a formal No Demand Certificate Affidavit (عدم مطالبہ حلف نامہ) in {{language}}.

DEPONENT DETAILS:
- Name: {{deponentName}}
- Father's/Husband's Name: {{fatherName}}
- CNIC: {{cnic}}
- Address: {{address}}

OTHER PARTY DETAILS:
- Name: {{otherPartyName}}
- CNIC: {{otherPartyCnic}}
- Address: {{otherPartyAddress}}

TRANSACTION/MATTER DETAILS: {{transactionDetails}}
SETTLEMENT DETAILS: {{settlementDetails}}
NO DEMAND STATEMENT: {{noDemandStatement}}

Generate a complete, legally valid No Demand Certificate Affidavit following Pakistani law format under the Contract Act 1872. Include:
1. Title and heading
2. Deponent identification paragraph
3. Details of the original transaction or matter
4. How the matter was settled or resolved
5. Clear statement that all dues have been cleared and settled
6. Declaration that deponent has no further claims, demands, or grievances
7. Statement releasing the other party from all obligations
REFERENCE FORMAT - Follow this exact Pakistani legal format:

AFFIDAVIT OF NO DEMAND / NO OBJECTION

I, [Deponent Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address], do hereby solemnly affirm and declare as under:

1. That I was employed / associated with [Organization / Person Name] as [Designation / Relation] from [Start Date] to [End Date].
2. That I have received all my dues including salary, gratuity, provident fund, arrears, and other benefits in full and nothing is outstanding.
3. That I have no claim, demand, or grievance of any nature whatsoever against [Organization / Person Name] arising out of my employment / association.
4. That I shall not raise any claim or demand in any court, tribunal, or forum in future in respect of the same matter.
5. That this affidavit is being given voluntarily and without any coercion.
6. That the contents of this affidavit are true and correct to the best of my knowledge and belief and nothing has been concealed.

DEPONENT
[Deponent Name] S/o [Father Name]
CNIC: ___________

VERIFICATION:
Verified on oath at [City] on this ___ day of ___________ that the contents of the above affidavit are true and correct to the best of my knowledge and belief and nothing has been concealed therein.

DEPONENT

ATTESTED
(Oath Commissioner / Notary Public / Class-1 Officer)

INSTRUCTIONS:
- Title: AFFIDAVIT OF NO DEMAND / NO OBJECTION (centered, bold)
- "That..." numbered clauses
- Include all dues received in full and waiver of future claims
- Include VERIFICATION paragraph
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
