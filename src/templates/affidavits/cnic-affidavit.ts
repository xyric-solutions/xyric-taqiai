import { TemplateDefinition } from "../types";

export const cnicAffidavit: TemplateDefinition = {
  category: "affidavit",
  subType: "cnic-affidavit",
  name: "CNIC/NADRA Affidavit",
  nameUrdu: "شناختی کارڈ حلف نامہ",
  description: "Affidavit for CNIC related issues (new, lost, correction, blocked)",
  descriptionUrdu: "شناختی کارڈ سے متعلق مسائل (نیا، گم شدہ، درستگی، بلاک) کا حلف نامہ",
  icon: "CreditCard",
  formFields: [
    {
      name: "deponentName",
      label: "Deponent Name",
      labelUrdu: "حلف اٹھانے والے کا نام",
      type: "text",
      required: true,
      placeholder: "Enter full name as per records",
      placeholderUrdu: "ریکارڈ کے مطابق پورا نام درج کریں",
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
      name: "address",
      label: "Residential Address",
      labelUrdu: "رہائشی پتہ",
      type: "address",
      required: true,
      placeholder: "Enter complete address",
      group: "Deponent Details",
    },
    {
      name: "dateOfBirth",
      label: "Date of Birth",
      labelUrdu: "تاریخ پیدائش",
      type: "date",
      required: true,
      group: "Deponent Details",
    },
    {
      name: "issueType",
      label: "Issue Type",
      labelUrdu: "مسئلے کی قسم",
      type: "select",
      required: true,
      options: [
        { value: "new", label: "New CNIC Application", labelUrdu: "نیا شناختی کارڈ" },
        { value: "lost", label: "Lost CNIC", labelUrdu: "گم شدہ شناختی کارڈ" },
        { value: "correction", label: "Data Correction", labelUrdu: "ڈیٹا درستگی" },
        { value: "blocked", label: "Blocked CNIC", labelUrdu: "بلاک شناختی کارڈ" },
        { value: "renewal", label: "CNIC Renewal", labelUrdu: "شناختی کارڈ تجدید" },
        { value: "family-tree", label: "Family Tree Correction", labelUrdu: "خاندانی شجرہ درستگی" },
      ],
      group: "CNIC Details",
    },
    {
      name: "oldCnicNumber",
      label: "Old/Existing CNIC Number",
      labelUrdu: "پرانا / موجودہ شناختی کارڈ نمبر",
      type: "cnic",
      required: false,
      placeholder: "XXXXX-XXXXXXX-X (if applicable)",
      group: "CNIC Details",
    },
    {
      name: "details",
      label: "Issue Details",
      labelUrdu: "مسئلے کی تفصیلات",
      type: "textarea",
      required: true,
      placeholder: "Describe the issue in detail (what correction is needed, how CNIC was lost, etc.)",
      aiSuggestable: true,
      group: "CNIC Details",
    },
    {
      name: "correctionFrom",
      label: "Correction From (Old Data)",
      labelUrdu: "درستگی - پرانا ڈیٹا",
      type: "text",
      required: false,
      placeholder: "Enter incorrect data to be changed",
      group: "Correction Details",
    },
    {
      name: "correctionTo",
      label: "Correction To (New Data)",
      labelUrdu: "درستگی - نیا ڈیٹا",
      type: "text",
      required: false,
      placeholder: "Enter correct data",
      group: "Correction Details",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a formal CNIC/NADRA Affidavit (شناختی کارڈ حلف نامہ) in {{language}}.

DEPONENT DETAILS:
- Name: {{deponentName}}
- Father's/Husband's Name: {{fatherName}}
- Address: {{address}}
- Date of Birth: {{dateOfBirth}}

CNIC DETAILS:
- Issue Type: {{issueType}}
- Old/Existing CNIC: {{oldCnicNumber}}
- Details: {{details}}

CORRECTION DETAILS (if applicable):
- From: {{correctionFrom}}
- To: {{correctionTo}}

Generate a complete, legally valid CNIC/NADRA Affidavit following Pakistani law format under the NADRA Ordinance 2000. Include:
1. Title and heading
2. Deponent identification paragraph
3. Issue-specific declarations:
   - Lost: circumstances of loss, FIR reference if filed
   - Correction: old data vs new data, reason for correction
   - Blocked: reason for blocking, request for unblocking
   - New: reason for late application if applicable
4. Request to NADRA for approREFERENCE FORMAT - Follow this exact Pakistani legal format:

AFFIDAVIT FOR CNIC CORRECTION / ISSUANCE

I, [Deponent Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address], do hereby solemnly affirm and declare as under:

1. That my name / date of birth / address on my CNIC bears an error and the correct information is: [Correct Information].
2. That the said error occurred due to [Reason - clerical mistake / data entry error / incorrect documents submitted].
3. That I have been using the name / date of birth [Correct Details] throughout my life and all my educational and official documents bear the same.
4. That I am making this affidavit for the purpose of getting my CNIC corrected / issued by NADRA.
5. That no claim, case, or dispute exists regarding my identity.
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
- Title: AFFIDAVIT FOR CNIC CORRECTION / ISSUANCE (centered, bold)
- "That..." numbered clauses
- Include correct vs incorrect information
- Include VERIFICATION paragraph
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
