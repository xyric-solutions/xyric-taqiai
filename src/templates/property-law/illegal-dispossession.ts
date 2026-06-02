import { TemplateDefinition } from "../types";

export const illegalDispossession: TemplateDefinition = {
  category: "property-law",
  subType: "illegal-dispossession",
  name: "Complaint under Illegal Dispossession Act / غیر قانونی بے دخلی کی شکایت",
  nameUrdu: "غیر قانونی بے دخلی کی شکایت",
  description: "Complaint under the Illegal Dispossession Act 2005",
  descriptionUrdu: "غیر قانونی بے دخلی ایکٹ 2005 کے تحت شکایت",
  icon: "ShieldAlert",
  formFields: [
    {
      name: "complainantName",
      label: "Complainant's Name",
      labelUrdu: "شکایت کنندہ کا نام",
      type: "text",
      required: true,
      group: "Complainant Details",
    },
    {
      name: "complainantCnic",
      label: "Complainant's CNIC",
      labelUrdu: "شکایت کنندہ کا شناختی کارڈ",
      type: "cnic",
      required: true,
      group: "Complainant Details",
    },
    {
      name: "complainantAddress",
      label: "Complainant's Address",
      labelUrdu: "شکایت کنندہ کا پتہ",
      type: "address",
      required: true,
      group: "Complainant Details",
    },
    {
      name: "accusedName",
      label: "Accused's Name",
      labelUrdu: "ملزم کا نام",
      type: "text",
      required: true,
      group: "Accused Details",
    },
    {
      name: "accusedAddress",
      label: "Accused's Address",
      labelUrdu: "ملزم کا پتہ",
      type: "address",
      required: true,
      group: "Accused Details",
    },
    {
      name: "propertyDescription",
      label: "Property Description",
      labelUrdu: "جائیداد کی تفصیل",
      type: "textarea",
      required: true,
      group: "Property Details",
    },
    {
      name: "propertyAddress",
      label: "Property Address",
      labelUrdu: "جائیداد کا پتہ",
      type: "address",
      required: true,
      group: "Property Details",
    },
    {
      name: "dateOfDispossession",
      label: "Date of Dispossession",
      labelUrdu: "بے دخلی کی تاریخ",
      type: "date",
      required: true,
      group: "Dispossession Details",
    },
    {
      name: "facts",
      label: "Facts of the Case",
      labelUrdu: "مقدمے کے حقائق",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Dispossession Details",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a Complaint under the Illegal Dispossession Act 2005 in {{language}}.

COMPLAINANT:
- Name: {{complainantName}}
- CNIC: {{complainantCnic}}
- Address: {{complainantAddress}}

ACCUSED:
- Name: {{accusedName}}
- Address: {{accusedAddress}}

PROPERTY DETAILS:
- Description: {{propertyDescription}}
- Address: {{propertyAddress}}

DISPOSSESSION DETAILS:
- Date of Dispossession: {{dateOfDispossession}}
- Facts: {{facts}}

Generate a complete Complaint under the Illegal Dispossession Act 2005 as applicable in Pakistan.
Include proper court heading, complainant and accused particulars, property details, factual narrative of illegal disREFERENCE FORMAT - Follow this exact Pakistani legal format:

APPLICATION UNDER SECTION 3/4, PUNJAB PROHIBITION OF ILLEGAL DISPOSSESSION ACT 2005 (OR APPLICABLE PROVINCIAL ACT)

To,
The [Deputy Commissioner / Assistant Commissioner / Court],
[District / City].

SUBJECT: Complaint of Illegal Dispossession

[Complainant Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
                                                    ...COMPLAINANT
VERSUS
[Accused Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
                                                    ...ACCUSED

1. That the Complainant is the lawful owner / occupant of property at [Property Address], Khasra/Plot No. [Number], District [District].
2. That on [Date], the accused [Accused Name] illegally and forcibly dispossessed the Complainant from the said property using [Force / Threats / Fraud].
3. That the accused has no lawful title, right, or permission to occupy the said property.
4. That this dispossession is an offence under Section 3 of the Punjab Prohibition of Illegal Dispossession Act 2005.
5. That the Complainant is entitled to restoration of possession and the accused is liable to punishment.

PRAYER:
(i) Restore possession of the property to the Complainant;
(ii) Take legal action against the accused under the Illegal Dispossession Act;
(iii) Any other appropriate relief.

VERIFICATION:
Verified on oath at [City] that the contents are true and correct to the best of my knowledge.

Complainant:
[Name] S/o [Father Name]
CNIC: ___________

INSTRUCTIONS:
- Heading: APPLICATION UNDER ILLEGAL DISPOSSESSION ACT (centered, bold)
- Reference provincial Illegal Dispossession Act
- Include property description and date of dispossession
- Prayer clause with (i)(ii)(iii) items
- Include VERIFICATION paragraph
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
