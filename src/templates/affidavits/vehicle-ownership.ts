import { TemplateDefinition } from "../types";

export const vehicleOwnershipAffidavit: TemplateDefinition = {
  category: "affidavit",
  subType: "vehicle-ownership",
  name: "Vehicle Ownership Affidavit",
  nameUrdu: "گاڑی کی ملکیت کا حلف نامہ",
  description: "Affidavit declaring ownership of a vehicle",
  descriptionUrdu: "گاڑی کی ملکیت کے اعلان کا حلف نامہ",
  icon: "Car",
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
      name: "city",
      label: "City",
      labelUrdu: "شہر",
      type: "text",
      required: true,
      placeholder: "Enter city name",
      group: "Deponent Details",
    },
    {
      name: "vehicleMake",
      label: "Vehicle Make",
      labelUrdu: "گاڑی کی کمپنی",
      type: "text",
      required: true,
      placeholder: "e.g., Toyota, Honda, Suzuki",
      group: "Vehicle Details",
    },
    {
      name: "vehicleModel",
      label: "Vehicle Model",
      labelUrdu: "گاڑی کا ماڈل",
      type: "text",
      required: true,
      placeholder: "e.g., Corolla, Civic, Mehran",
      group: "Vehicle Details",
    },
    {
      name: "vehicleYear",
      label: "Year of Manufacture",
      labelUrdu: "سال تیاری",
      type: "number",
      required: true,
      placeholder: "e.g., 2020",
      group: "Vehicle Details",
    },
    {
      name: "registrationNumber",
      label: "Registration Number",
      labelUrdu: "رجسٹریشن نمبر",
      type: "text",
      required: true,
      placeholder: "e.g., LEA-1234",
      group: "Vehicle Details",
    },
    {
      name: "engineNumber",
      label: "Engine Number",
      labelUrdu: "انجن نمبر",
      type: "text",
      required: true,
      placeholder: "Enter engine number",
      group: "Vehicle Details",
    },
    {
      name: "chassisNumber",
      label: "Chassis Number",
      labelUrdu: "چیسس نمبر",
      type: "text",
      required: true,
      placeholder: "Enter chassis number",
      group: "Vehicle Details",
    },
    {
      name: "ownershipDetails",
      label: "Ownership Claim Details",
      labelUrdu: "ملکیت کے دعوے کی تفصیلات",
      type: "textarea",
      required: true,
      placeholder: "How did you acquire this vehicle? (purchased, inherited, gifted, etc.)",
      aiSuggestable: true,
      group: "Ownership Details",
    },
    {
      name: "language",
      label: "Language",
      labelUrdu: "زبان",
      type: "select",
      required: true,
      options: [
        { value: "english", label: "English", labelUrdu: "انگریزی" },
        { value: "urdu", label: "Urdu", labelUrdu: "اردو" },
      ],
      group: "Ownership Details",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a formal Vehicle Ownership Affidavit in {{language}}.

PARTY DETAILS:
- Deponent Name: {{deponentName}}
- Father's/Husband's Name: {{fatherName}}
- CNIC: {{cnic}}
- Address: {{address}}
- City: {{city}}

VEHICLE DETAILS:
- Make: {{vehicleMake}}
- Model: {{vehicleModel}}
- Year: {{vehicleYear}}
- Registration Number: {{registrationNumber}}
- Engine Number: {{engineNumber}}
- Chassis Number: {{chassisNumber}}

OWNERSHIP DETAILS: {{ownershipDetails}}

REFERENCE FORMAT — Follow this exact Pakistani legal format:

AFFIDAVIT OF VEHICLE OWNERSHIP

I, [Deponent Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address], [City], do hereby solemnly affirm and declare as under:

1. That I am the lawful owner of the following vehicle:
   - Make: [Vehicle Make]
   - Model: [Vehicle Model]
   - Year: [Year of Manufacture]
   - Registration No.: [Registration Number]
   - Engine No.: [Engine Number]
   - Chassis No.: [Chassis Number]

2. That I acquired the said vehicle through [purchase/inheritance/gift] from [Seller/Previous Owner Name] and the same is registered in my name with the relevant Motor Registration Authority.
3. That the said vehicle is not stolen, not mortgaged, not hypothecated, and is free from all encumbrances and legal disputes.
4. That all applicable taxes, token fees, and dues have been duly paid.
5. That I am making this affidavit for the purpose of [Purpose — bank loan / transfer / insurance / NOC].
6. That the contents of this affidavit are true and correct to the best of my knowledge and belief and nothing has been concealed.

DEPONENT
[Name] S/o [Father Name]
CNIC: ___________

VERIFICATION:
Verified on oath at [City] on this ___ day of ___________ that the contents of the above affidavit are true and correct to the best of my knowledge and belief and nothing has been concealed therein.

DEPONENT

ATTESTED
(Oath Commissioner / Notary Public / Class-1 Officer)

INSTRUCTIONS:
- Title: AFFIDAVIT OF VEHICLE OWNERSHIP (centered, bold)
- List vehicle details in a structured block
- "That..." numbered clauses
- Key clause: "not stolen, not mortgaged, free from all encumbrances"
- Include VERIFICATION paragraph
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
