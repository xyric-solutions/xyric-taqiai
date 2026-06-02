import { TemplateDefinition } from "../types";

export const suretyBondAffidavit: TemplateDefinition = {
  category: "affidavit",
  subType: "surety-bond",
  name: "Surety Bond Affidavit",
  nameUrdu: "ضمانتی حلف نامہ",
  description: "Surety bond for bail and court proceedings",
  descriptionUrdu: "ضمانت اور عدالتی کارروائی کے لیے ضمانتی حلف نامہ",
  icon: "ShieldCheck",
  formFields: [
    {
      name: "suretyName",
      label: "Surety Name",
      labelUrdu: "ضامن کا نام",
      type: "text",
      required: true,
      placeholder: "Enter surety's full name",
      placeholderUrdu: "ضامن کا پورا نام درج کریں",
      group: "Surety Details",
    },
    {
      name: "suretyFatherName",
      label: "Surety's Father's Name",
      labelUrdu: "ضامن کے والد کا نام",
      type: "text",
      required: true,
      placeholder: "Enter father's name",
      group: "Surety Details",
    },
    {
      name: "suretyCnic",
      label: "Surety CNIC",
      labelUrdu: "ضامن کا شناختی کارڈ نمبر",
      type: "cnic",
      required: true,
      placeholder: "XXXXX-XXXXXXX-X",
      validation: { pattern: "^[0-9]{5}-[0-9]{7}-[0-9]$" },
      group: "Surety Details",
    },
    {
      name: "suretyAddress",
      label: "Surety Address",
      labelUrdu: "ضامن کا پتہ",
      type: "address",
      required: true,
      placeholder: "Enter surety's complete address",
      group: "Surety Details",
    },
    {
      name: "accusedName",
      label: "Accused Name",
      labelUrdu: "ملزم کا نام",
      type: "text",
      required: true,
      placeholder: "Enter accused's full name",
      placeholderUrdu: "ملزم کا پورا نام درج کریں",
      group: "Accused Details",
    },
    {
      name: "accusedFatherName",
      label: "Accused's Father's Name",
      labelUrdu: "ملزم کے والد کا نام",
      type: "text",
      required: true,
      placeholder: "Enter father's name",
      group: "Accused Details",
    },
    {
      name: "accusedCnic",
      label: "Accused CNIC",
      labelUrdu: "ملزم کا شناختی کارڈ نمبر",
      type: "cnic",
      required: false,
      placeholder: "XXXXX-XXXXXXX-X",
      group: "Accused Details",
    },
    {
      name: "caseNumber",
      label: "Case / FIR Number",
      labelUrdu: "مقدمہ / ایف آئی آر نمبر",
      type: "text",
      required: true,
      placeholder: "Enter case or FIR number",
      group: "Case Details",
    },
    {
      name: "courtName",
      label: "Court Name",
      labelUrdu: "عدالت کا نام",
      type: "text",
      required: true,
      placeholder: "e.g., Sessions Court Lahore",
      group: "Case Details",
    },
    {
      name: "bondAmount",
      label: "Bond Amount (PKR)",
      labelUrdu: "ضمانت کی رقم (روپے)",
      type: "text",
      required: true,
      placeholder: "Enter bond amount in PKR",
      group: "Bond Details",
    },
    {
      name: "conditions",
      label: "Bond Conditions",
      labelUrdu: "ضمانت کی شرائط",
      type: "textarea",
      required: false,
      placeholder: "Enter any specific conditions of the surety bond",
      aiSuggestable: true,
      group: "Bond Details",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a formal Surety Bond Affidavit (ضمانتی حلف نامہ) in {{language}}.

SURETY DETAILS:
- Name: {{suretyName}}
- Father's Name: {{suretyFatherName}}
- CNIC: {{suretyCnic}}
- Address: {{suretyAddress}}

ACCUSED DETAILS:
- Name: {{accusedName}}
- Father's Name: {{accusedFatherName}}
- CNIC: {{accusedCnic}}

CASE DETAILS:
- Case/FIR Number: {{caseNumber}}
- Court: {{courtName}}

BOND DETAILS:
- Amount: {{bondAmount}} PKR
- Conditions: {{conditions}}

REFERENCE FORMAT — Follow this exact Pakistani legal format:

SURETY BOND

Whereas, [Accused Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address] (hereinafter referred to as the accused/employee) is required to appear before [Court Name] in Case/FIR No. [Case Number].

I, [Surety Name] S/o [Surety Father Name], CNIC No. [Surety CNIC], adult resident of [Surety Address], do hereby give surety and solemnly undertake as under:

1. That I stand surety for [Accused Name] and undertake that he/she shall appear before the Honourable [Court Name] on every date of hearing as required.
2. That in the event of the accused failing to appear before the Court as required, I bind myself to pay the sum of PKR [Amount]/- ([Amount in words] only) on demand.
3. That I am solvent and financially able to pay the said amount.
4. That in the event of breach of any of the aforesaid terms, I shall be held personally responsible and liable for payment of the bond amount.
5. That the contents of this surety bond are true and correct to the best of my knowledge and belief.

In witness whereof the surety has set his hand on this day.

SURETY                                    ACCUSED
[Surety Name] S/o [Father Name]           [Accused Name] S/o [Father Name]
CNIC: ___________                         CNIC: ___________
Address: ___________                      Address: ___________

Witness 1: ___________________     Witness 2: ___________________

ATTESTED
(Oath Commissioner / Notary Public)

INSTRUCTIONS:
- Title: SURETY BOND (centered, bold)
- Include WHEREAS clause identifying the accused and court
- Each undertaking starts with "That..."
- Include both SURETY and ACCUSED signature blocks
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
