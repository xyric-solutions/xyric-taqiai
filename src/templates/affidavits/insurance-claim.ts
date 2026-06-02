import { TemplateDefinition } from "../types";

export const insuranceClaimAffidavit: TemplateDefinition = {
  category: "affidavit",
  subType: "insurance-claim",
  name: "Insurance Claim Affidavit",
  nameUrdu: "انشورنس دعوی حلف نامہ",
  description: "Affidavit for filing insurance claims",
  descriptionUrdu: "انشورنس کے دعوے کے لیے حلف نامہ",
  icon: "ShieldCheck",
  formFields: [
    {
      name: "deponentName",
      label: "Claimant Name",
      labelUrdu: "دعویدار کا نام",
      type: "text",
      required: true,
      placeholder: "Enter claimant's full name",
      placeholderUrdu: "دعویدار کا پورا نام درج کریں",
      group: "Claimant Details",
    },
    {
      name: "fatherName",
      label: "Father's / Husband's Name",
      labelUrdu: "والد / شوہر کا نام",
      type: "text",
      required: true,
      placeholder: "Enter father's or husband's name",
      group: "Claimant Details",
    },
    {
      name: "cnic",
      label: "CNIC Number",
      labelUrdu: "شناختی کارڈ نمبر",
      type: "cnic",
      required: true,
      placeholder: "XXXXX-XXXXXXX-X",
      validation: { pattern: "^[0-9]{5}-[0-9]{7}-[0-9]$" },
      group: "Claimant Details",
    },
    {
      name: "address",
      label: "Residential Address",
      labelUrdu: "رہائشی پتہ",
      type: "address",
      required: true,
      placeholder: "Enter complete address",
      group: "Claimant Details",
    },
    {
      name: "relationship",
      label: "Relationship with Insured/Deceased",
      labelUrdu: "بیمہ شدہ / مرحوم سے رشتہ",
      type: "text",
      required: true,
      placeholder: "e.g., Self, Spouse, Son, Daughter, Nominee",
      group: "Claimant Details",
    },
    {
      name: "insuredName",
      label: "Insured/Deceased Person's Name",
      labelUrdu: "بیمہ شدہ / مرحوم شخص کا نام",
      type: "text",
      required: true,
      placeholder: "Enter insured person's full name",
      group: "Insured Details",
    },
    {
      name: "insuredCnic",
      label: "Insured Person's CNIC",
      labelUrdu: "بیمہ شدہ کا شناختی کارڈ نمبر",
      type: "cnic",
      required: false,
      placeholder: "XXXXX-XXXXXXX-X",
      group: "Insured Details",
    },
    {
      name: "policyNumber",
      label: "Policy Number",
      labelUrdu: "پالیسی نمبر",
      type: "text",
      required: true,
      placeholder: "Enter insurance policy number",
      group: "Policy Details",
    },
    {
      name: "insuranceCompany",
      label: "Insurance Company",
      labelUrdu: "انشورنس کمپنی",
      type: "text",
      required: true,
      placeholder: "Enter insurance company name",
      group: "Policy Details",
    },
    {
      name: "claimAmount",
      label: "Claim Amount (PKR)",
      labelUrdu: "دعوے کی رقم (روپے)",
      type: "text",
      required: false,
      placeholder: "Enter claim amount",
      group: "Policy Details",
    },
    {
      name: "causeOfClaimLoss",
      label: "Cause of Death/Loss/Claim",
      labelUrdu: "وفات / نقصان / دعوے کی وجہ",
      type: "textarea",
      required: true,
      placeholder: "Describe the cause of death, loss, or reason for claim",
      aiSuggestable: true,
      group: "Claim Details",
    },
    {
      name: "dateOfIncident",
      label: "Date of Incident/Death",
      labelUrdu: "واقعے / وفات کی تاریخ",
      type: "date",
      required: true,
      group: "Claim Details",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a formal Insurance Claim Affidavit (انشورنس دعوی حلف نامہ) in {{language}}.

CLAIMANT DETAILS:
- Name: {{deponentName}}
- Father's/Husband's Name: {{fatherName}}
- CNIC: {{cnic}}
- Address: {{address}}
- Relationship with Insured: {{relationship}}

INSURED PERSON DETAILS:
- Name: {{insuredName}}
- CNIC: {{insuredCnic}}

POLICY DETAILS:
- Policy Number: {{policyNumber}}
- Insurance Company: {{insuranceCompany}}
- Claim Amount: {{claimAmount}} PKR

CLAIM DETAILS:
- Cause of Death/Loss: {{causeOfClaimLoss}}
- Date of Incident: {{dateOfIncident}}

Generate a complete, legally valid Insurance Claim Affidavit following Pakistani law format under the Insurance Ordinance 2000. Include:
1. Title and heading
2. Claimant identification paragraph
3. Details of insured person and policy
4. Relationship with insured/deceased
5. Circumstances of death/loss/incident
6. Claim amount and basis
7. Declaration that claimant is the rightful nominee/benefREFERENCE FORMAT - Follow this exact Pakistani legal format:

AFFIDAVIT FOR INSURANCE CLAIM

I, [Claimant Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address], do hereby solemnly affirm and declare as under:

1. That I am the policyholder / nominee / legal heir of [Deceased / Insured Name], holding Policy No. [Policy Number] issued by [Insurance Company Name].
2. That the insured / policyholder suffered [death / accident / loss] on [Date] at [Place].
3. That the cause of [death / loss] was [Cause - natural / accidental / fire, etc.].
4. That I am entitled to claim the insurance benefit as [Nominee / Legal Heir / Policyholder].
5. That no other person has filed or intends to file any claim against the said policy.
6. That the claim being made by me is genuine and I am not making any false or fraudulent claim.
7. That the contents of this affidavit are true and correct to the best of my knowledge and belief and nothing has been concealed.

DEPONENT
[Claimant Name] S/o [Father Name]
CNIC: ___________
Policy No.: ___________

VERIFICATION:
Verified on oath at [City] on this ___ day of ___________ that the contents of the above affidavit are true and correct to the best of my knowledge and belief and nothing has been concealed therein.

DEPONENT

ATTESTED
(Oath Commissioner / Notary Public / Class-1 Officer)

INSTRUCTIONS:
- Title: AFFIDAVIT FOR INSURANCE CLAIM (centered, bold)
- "That..." numbered clauses
- Include policy number, insurance company, cause of loss/death
- Include no false claim declaration
- Include VERIFICATION paragraph
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
