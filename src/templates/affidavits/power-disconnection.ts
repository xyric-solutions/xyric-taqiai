import { TemplateDefinition } from "../types";

export const powerDisconnectionAffidavit: TemplateDefinition = {
  category: "affidavit",
  subType: "power-disconnection",
  name: "Electricity / Gas Connection Affidavit",
  nameUrdu: "بجلی / گیس کنکشن حلف نامہ",
  description: "Affidavit for new connection, transfer, or name change of utility",
  descriptionUrdu: "نیا کنکشن، منتقلی، یا یوٹیلیٹی میں نام کی تبدیلی کا حلف نامہ",
  icon: "Zap",
  formFields: [
    {
      name: "deponentName",
      label: "Applicant Name",
      labelUrdu: "درخواست گزار کا نام",
      type: "text",
      required: true,
      placeholder: "Enter full name",
      placeholderUrdu: "پورا نام درج کریں",
      group: "Applicant Details",
    },
    {
      name: "fatherName",
      label: "Father's / Husband's Name",
      labelUrdu: "والد / شوہر کا نام",
      type: "text",
      required: true,
      placeholder: "Enter father's or husband's name",
      group: "Applicant Details",
    },
    {
      name: "cnic",
      label: "CNIC Number",
      labelUrdu: "شناختی کارڈ نمبر",
      type: "cnic",
      required: true,
      placeholder: "XXXXX-XXXXXXX-X",
      validation: { pattern: "^[0-9]{5}-[0-9]{7}-[0-9]$" },
      group: "Applicant Details",
    },
    {
      name: "address",
      label: "Residential Address",
      labelUrdu: "رہائشی پتہ",
      type: "address",
      required: true,
      placeholder: "Enter complete address",
      group: "Applicant Details",
    },
    {
      name: "city",
      label: "City",
      labelUrdu: "شہر",
      type: "text",
      required: true,
      placeholder: "Enter city name",
      group: "Applicant Details",
    },
    {
      name: "connectionType",
      label: "Connection Type",
      labelUrdu: "کنکشن کی قسم",
      type: "select",
      required: true,
      options: [
        { value: "electricity", label: "Electricity", labelUrdu: "بجلی" },
        { value: "gas", label: "Gas (Sui Gas)", labelUrdu: "گیس (سوئی گیس)" },
      ],
      group: "Connection Details",
    },
    {
      name: "meterNumber",
      label: "Meter Number (if existing)",
      labelUrdu: "میٹر نمبر (اگر موجود ہو)",
      type: "text",
      required: false,
      placeholder: "Enter existing meter number",
      group: "Connection Details",
    },
    {
      name: "referenceNumber",
      label: "Reference / Consumer Number",
      labelUrdu: "حوالہ / صارف نمبر",
      type: "text",
      required: false,
      placeholder: "Enter reference or consumer number",
      group: "Connection Details",
    },
    {
      name: "propertyAddress",
      label: "Property Address for Connection",
      labelUrdu: "کنکشن والی جائیداد کا پتہ",
      type: "address",
      required: true,
      placeholder: "Enter property address where connection is needed",
      group: "Connection Details",
    },
    {
      name: "purpose",
      label: "Purpose",
      labelUrdu: "مقصد",
      type: "select",
      required: true,
      options: [
        { value: "new-connection", label: "New Connection", labelUrdu: "نیا کنکشن" },
        { value: "transfer", label: "Transfer of Connection", labelUrdu: "کنکشن کی منتقلی" },
        { value: "name-change", label: "Name Change on Connection", labelUrdu: "کنکشن پر نام کی تبدیلی" },
        { value: "reconnection", label: "Reconnection", labelUrdu: "دوبارہ کنکشن" },
        { value: "disconnection", label: "Disconnection", labelUrdu: "کنکشن کاٹنا" },
      ],
      group: "Connection Details",
    },
    {
      name: "additionalDetails",
      label: "Additional Details",
      labelUrdu: "اضافی تفصیلات",
      type: "textarea",
      required: false,
      placeholder: "Any additional details about the connection request",
      aiSuggestable: true,
      group: "Connection Details",
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
      group: "Connection Details",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a formal Electricity/Gas Connection Affidavit in {{language}}.

APPLICANT DETAILS:
- Name: {{deponentName}}
- Father's/Husband's Name: {{fatherName}}
- CNIC: {{cnic}}
- Address: {{address}}
- City: {{city}}

CONNECTION DETAILS:
- Type: {{connectionType}}
- Meter Number: {{meterNumber}}
- Reference Number: {{referenceNumber}}
- Property Address: {{propertyAddress}}
- Purpose: {{purpose}}
- Additional Details: {{additionalDetails}}

Generate a complete, legally valid Electricity/Gas Connection Affidavit following Pakistani law format. Include:
1. Title and heading with proper formatting
2. Applicant identification paragraph
3. Property details where connection is needed
4. Purpose of the affidavit (new connection/transfer/name change/etc.)
5. Declaration of property ownership or authorized occupancy
6. Declaration that no outstanding dues exist (for transfer/naREFERENCE FORMAT - Follow this exact Pakistani legal format:

AFFIDAVIT FOR ELECTRICITY CONNECTION / NAME TRANSFER

I, [Deponent Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address], do hereby solemnly affirm and declare as under:

1. That the electricity connection bearing Consumer No. [Consumer Number] is installed at [Property Address] under the name of [Current Holder Name].
2. That I am the [Owner / Legal Heir / New Occupant] of the said premises and request [connection / disconnection / name transfer] of the said electricity connection.
3. That the previous owner / holder [Name] has [vacated / deceased / transferred ownership] and has no objection to the transfer.
4. That all outstanding electricity bills up to date have been paid / shall be cleared before the transfer.
5. That I undertake to pay all future electricity bills in respect of the said premises regularly.
6. That the contents of this affidavit are true and correct to the best of my knowledge and belief and nothing has been concealed.

DEPONENT
[Deponent Name] S/o [Father Name]
CNIC: ___________
Consumer No.: ___________

VERIFICATION:
Verified on oath at [City] on this ___ day of ___________ that the contents of the above affidavit are true and correct to the best of my knowledge and belief and nothing has been concealed therein.

DEPONENT

ATTESTED
(Oath Commissioner / Notary Public / Class-1 Officer)

INSTRUCTIONS:
- Title: AFFIDAVIT FOR ELECTRICITY CONNECTION / NAME TRANSFER (centered, bold)
- "That..." numbered clauses
- Include consumer number, property address, outstanding bills clearance
- Include VERIFICATION paragraph
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
