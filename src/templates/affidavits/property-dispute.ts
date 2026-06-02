import { TemplateDefinition } from "../types";

export const propertyDisputeAffidavit: TemplateDefinition = {
  category: "affidavit",
  subType: "property-dispute",
  name: "Property Dispute Affidavit",
  nameUrdu: "جائیداد تنازعہ حلف نامہ",
  description: "Affidavit for property dispute claims and declarations",
  descriptionUrdu: "جائیداد کے تنازعے کے دعوے اور اعلان کا حلف نامہ",
  icon: "Home",
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
      name: "propertyDescription",
      label: "Property Description",
      labelUrdu: "جائیداد کی تفصیل",
      type: "textarea",
      required: true,
      placeholder: "Describe the property (location, area, khasra/plot number, etc.)",
      aiSuggestable: true,
      group: "Property Details",
    },
    {
      name: "propertyAddress",
      label: "Property Address / Location",
      labelUrdu: "جائیداد کا پتہ / مقام",
      type: "address",
      required: true,
      placeholder: "Enter property address",
      group: "Property Details",
    },
    {
      name: "disputeNature",
      label: "Nature of Dispute",
      labelUrdu: "تنازعے کی نوعیت",
      type: "select",
      required: true,
      options: [
        { value: "ownership", label: "Ownership Dispute", labelUrdu: "ملکیت کا تنازعہ" },
        { value: "possession", label: "Possession Dispute", labelUrdu: "قبضے کا تنازعہ" },
        { value: "boundary", label: "Boundary Dispute", labelUrdu: "حد بندی کا تنازعہ" },
        { value: "inheritance", label: "Inheritance Dispute", labelUrdu: "وراثتی تنازعہ" },
        { value: "encroachment", label: "Encroachment", labelUrdu: "تجاوزات" },
        { value: "fraud", label: "Fraudulent Transfer", labelUrdu: "فراڈ منتقلی" },
        { value: "other", label: "Other", labelUrdu: "دیگر" },
      ],
      group: "Dispute Details",
    },
    {
      name: "opposingPartyName",
      label: "Opposing Party Name",
      labelUrdu: "مخالف فریق کا نام",
      type: "text",
      required: true,
      placeholder: "Enter opposing party's name",
      group: "Dispute Details",
    },
    {
      name: "opposingPartyCnic",
      label: "Opposing Party CNIC",
      labelUrdu: "مخالف فریق کا شناختی کارڈ",
      type: "cnic",
      required: false,
      placeholder: "XXXXX-XXXXXXX-X",
      group: "Dispute Details",
    },
    {
      name: "disputeDetails",
      label: "Dispute Details / Facts",
      labelUrdu: "تنازعے کی تفصیلات / حقائق",
      type: "textarea",
      required: true,
      placeholder: "Describe the dispute in detail including timeline and facts",
      aiSuggestable: true,
      group: "Dispute Details",
    },
    {
      name: "supportingDocuments",
      label: "Supporting Documents",
      labelUrdu: "معاون دستاویزات",
      type: "textarea",
      required: false,
      placeholder: "List supporting documents (registry, fard, mutation, sale deed, etc.)",
      aiSuggestable: true,
      group: "Supporting Evidence",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a formal Property Dispute Affidavit (جائیداد تنازعہ حلف نامہ) in {{language}}.

DEPONENT DETAILS:
- Name: {{deponentName}}
- Father's/Husband's Name: {{fatherName}}
- CNIC: {{cnic}}
- Address: {{address}}

PROPERTY DETAILS:
- Description: {{propertyDescription}}
- Address/Location: {{propertyAddress}}

DISPUTE DETAILS:
- Nature of Dispute: {{disputeNature}}
- Opposing Party: {{opposingPartyName}} (CNIC: {{opposingPartyCnic}})
- Details: {{disputeDetails}}

SUPPORTING DOCUMENTS: {{supportingDocuments}}

Generate a complete, legally valid Property Dispute Affidavit following Pakistani law format under the Transfer of Property Act 1882 and relevant property laws. Include:
1. Title and heading
2. Deponent identification paragraph
3. Detailed property description with survey/khasra numbers
4. Nature and history of the dispute
5. Deponent's claim and basis of ownership/rights
6. Opposing party details
7. Reference to supportingREFERENCE FORMAT - Follow this exact Pakistani legal format:

AFFIDAVIT REGARDING PROPERTY DISPUTE

I, [Deponent Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address], do hereby solemnly affirm and declare as under:

1. That I am the lawful owner / occupant of property situated at [Property Address], measuring [Area], bearing Khasra / Plot No. [Number], Mouza [Mouza], Tehsil [Tehsil], District [District].
2. That the said property was acquired / purchased by me on [Date] vide Sale Deed / Mutation No. [Number] dated [Date].
3. That [Opposing Party Name] S/o [Father Name] has unlawfully / wrongfully claimed ownership of / encroached upon the said property.
4. That I have all lawful title documents in my possession and am the rightful owner.
5. That no court order, stay, or injunction exists against me in respect of the said property.
6. That I am making this affidavit to establish my ownership and contest the false claim.
7. That the contents of this affidavit are true and correct to the best of my knowledge and belief and nothing has been concealed.

DEPONENT
[Deponent Name] S/o [Father Name]
CNIC: ___________

VERIFICATION:
Verified on oath at [City] on this ___ day of ___________ that the contents of the above affidavit are true and correct to the best of my knowledge and belief and nothing has been concealed therein.

DEPONENT

ATTESTED
(Oath Commissioner / Notary Public / Class-1 Officer)

INSTRUCTIONS:
- Title: AFFIDAVIT REGARDING PROPERTY DISPUTE (centered, bold)
- "That..." numbered clauses
- Include property description with Khasra/Plot/Mouza/Tehsil/District
- Include ownership basis and opposing party claim
- Include VERIFICATION paragraph
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
