import { TemplateDefinition } from "../types";

export const dowerDeed: TemplateDefinition = {
  category: "family-law",
  subType: "dower-deed",
  name: "Dower / Mehr Agreement Deed",
  nameUrdu: "مہر نامہ",
  description: "Dower/Mehr agreement deed documenting mehr terms between spouses",
  descriptionUrdu: "میاں بیوی کے درمیان مہر کی شرائط کا دستاویز",
  icon: "Heart",
  formFields: [
    {
      name: "husbandName",
      label: "Husband's Name",
      labelUrdu: "شوہر کا نام",
      type: "text",
      required: true,
      group: "Husband Details",
    },
    {
      name: "husbandFatherName",
      label: "Husband's Father's Name",
      labelUrdu: "شوہر کے والد کا نام",
      type: "text",
      required: true,
      group: "Husband Details",
    },
    {
      name: "husbandCnic",
      label: "Husband's CNIC",
      labelUrdu: "شوہر کا شناختی کارڈ",
      type: "cnic",
      required: true,
      group: "Husband Details",
    },
    {
      name: "husbandAddress",
      label: "Husband's Address",
      labelUrdu: "شوہر کا پتہ",
      type: "address",
      required: true,
      group: "Husband Details",
    },
    {
      name: "wifeName",
      label: "Wife's Name",
      labelUrdu: "بیوی کا نام",
      type: "text",
      required: true,
      group: "Wife Details",
    },
    {
      name: "wifeFatherName",
      label: "Wife's Father's Name",
      labelUrdu: "بیوی کے والد کا نام",
      type: "text",
      required: true,
      group: "Wife Details",
    },
    {
      name: "wifeCnic",
      label: "Wife's CNIC",
      labelUrdu: "بیوی کا شناختی کارڈ",
      type: "cnic",
      required: true,
      group: "Wife Details",
    },
    {
      name: "marriageDate",
      label: "Date of Marriage",
      labelUrdu: "تاریخ نکاح",
      type: "date",
      required: true,
      group: "Marriage Details",
    },
    {
      name: "mehrType",
      label: "Mehr Type",
      labelUrdu: "مہر کی قسم",
      type: "select",
      required: true,
      options: [
        { value: "muajjal", label: "Muajjal (Prompt)", labelUrdu: "معجل (فوری)" },
        { value: "muwajjal", label: "Muwajjal (Deferred)", labelUrdu: "مؤجل (مؤخر)" },
        { value: "both", label: "Both (Muajjal + Muwajjal)", labelUrdu: "دونوں (معجل + مؤجل)" },
      ],
      group: "Mehr Details",
    },
    {
      name: "mehrAmount",
      label: "Total Mehr Amount (PKR)",
      labelUrdu: "کل مہر کی رقم (روپے)",
      type: "number",
      required: true,
      group: "Mehr Details",
    },
    {
      name: "muajjalAmount",
      label: "Muajjal (Prompt) Amount (PKR)",
      labelUrdu: "معجل (فوری) رقم (روپے)",
      type: "number",
      required: false,
      group: "Mehr Details",
    },
    {
      name: "muwajjalAmount",
      label: "Muwajjal (Deferred) Amount (PKR)",
      labelUrdu: "مؤجل (مؤخر) رقم (روپے)",
      type: "number",
      required: false,
      group: "Mehr Details",
    },
    {
      name: "paymentSchedule",
      label: "Payment Schedule / Terms",
      labelUrdu: "ادائیگی کا شیڈول / شرائط",
      type: "textarea",
      required: false,
      group: "Mehr Details",
    },
    {
      name: "witnesses",
      label: "Witnesses (Names and CNICs)",
      labelUrdu: "گواہان (نام اور شناختی کارڈ)",
      type: "textarea",
      required: true,
      group: "Witnesses",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a Dower/Mehr Agreement Deed in {{language}}.

HUSBAND:
- Name: {{husbandName}}
- Father's Name: {{husbandFatherName}}
- CNIC: {{husbandCnic}}
- Address: {{husbandAddress}}

WIFE:
- Name: {{wifeName}}
- Father's Name: {{wifeFatherName}}
- CNIC: {{wifeCnic}}

MARRIAGE DATE: {{marriageDate}}

MEHR:
- Type: {{mehrType}}
- Total Amount: PKR {{mehrAmount}}
- Muajjal Amount: PKR {{muajjalAmount}}
- Muwajjal Amount: PKR {{muwajjalAmount}}
- Payment Schedule: {{paymentSchedule}}

WITNESSES: {{witnesses}}

Generate a complete Dower/Mehr Agreement Deed following Pakistani Muslim FaREFERENCE FORMAT - Follow this exact Pakistani legal format:

DOWER DEED / HAQQ MEHR NAMA

This Dower Deed is made and executed on this ___ day of ___________, 20___ at [City].

BETWEEN:

[Husband Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
(hereinafter called the "HUSBAND")

AND

Mst. [Wife Name] D/o [Father Name], CNIC No. [CNIC], resident of [Address]
(hereinafter called the "WIFE")

WHEREAS the parties solemnized their Nikah on [Nikah Date] at [Place of Nikah] before the Nikah Registrar of [Union Council].

NOW THEREFORE THE HUSBAND AGREES AND ACKNOWLEDGES AS UNDER:

1. That the Haq Mehr (Dower) of the Wife has been fixed at PKR [Total Mehr Amount]/-.
2. That PKR [Muajjal - Prompt Mehr Amount]/- shall be paid as Muajjal (prompt dower) at the time of Nikah / immediately.
3. That PKR [Muwajjal - Deferred Mehr Amount]/- shall be paid as Muwajjal (deferred dower) on demand / on divorce / on death.
4. That this dower is the exclusive right of the Wife and is enforceable as a legal obligation under Islamic law and Pakistani law.
5. That in addition to the cash mehr, the Husband shall also give [Additional Items - jewelry / gold / property] as part of dower.
6. That the Wife acknowledges receipt of PKR [Paid Amount]/- as part payment of the Muajjal Mehr.

HUSBAND                                 WIFE
[Name]                                  Mst. [Name]
CNIC: ___________                       CNIC: ___________

Witness 1: ___________________   Witness 2: ___________________

Nikah Registrar: ___________________

INSTRUCTIONS:
- Title: DOWER DEED / HAQQ MEHR NAMA (centered, bold)
- BETWEEN / AND party structure
- WHEREAS recital with Nikah date
- Numbered "That..." clauses
- Include Muajjal (prompt) and Muwajjal (deferred) Mehr amounts
- Reference Muslim Family Laws Ordinance 1961
- Both parties + witnesses + Nikah Registrar sign
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
