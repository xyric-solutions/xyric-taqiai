import { TemplateDefinition } from "../types";

export const franchiseAgreement: TemplateDefinition = {
  category: "agreement",
  subType: "franchise-agreement",
  name: "Franchise Agreement",
  nameUrdu: "فرنچائز معاہدہ",
  description: "Franchise agreement between franchisor and franchisee",
  descriptionUrdu: "فرنچائز دہندہ اور فرنچائز لینے والے کے درمیان معاہدہ",
  icon: "Store",
  formFields: [
    {
      name: "franchisorName",
      label: "Franchisor Name",
      labelUrdu: "فرنچائز دہندہ کا نام",
      type: "text",
      required: true,
      group: "Franchisor Details",
    },
    {
      name: "franchisorCnic",
      label: "Franchisor CNIC",
      labelUrdu: "فرنچائز دہندہ کا شناختی کارڈ",
      type: "cnic",
      required: true,
      group: "Franchisor Details",
    },
    {
      name: "franchisorAddress",
      label: "Franchisor Address",
      labelUrdu: "فرنچائز دہندہ کا پتہ",
      type: "address",
      required: true,
      group: "Franchisor Details",
    },
    {
      name: "franchiseeName",
      label: "Franchisee Name",
      labelUrdu: "فرنچائز لینے والے کا نام",
      type: "text",
      required: true,
      group: "Franchisee Details",
    },
    {
      name: "franchiseeCnic",
      label: "Franchisee CNIC",
      labelUrdu: "فرنچائز لینے والے کا شناختی کارڈ",
      type: "cnic",
      required: true,
      group: "Franchisee Details",
    },
    {
      name: "franchiseeAddress",
      label: "Franchisee Address",
      labelUrdu: "فرنچائز لینے والے کا پتہ",
      type: "address",
      required: true,
      group: "Franchisee Details",
    },
    {
      name: "franchiseName",
      label: "Franchise Name / Brand",
      labelUrdu: "فرنچائز کا نام / برانڈ",
      type: "text",
      required: true,
      group: "Franchise Details",
    },
    {
      name: "territory",
      label: "Territory / Area",
      labelUrdu: "علاقہ / حدود",
      type: "text",
      required: true,
      group: "Franchise Details",
    },
    {
      name: "franchiseFee",
      label: "Franchise Fee (PKR)",
      labelUrdu: "فرنچائز فیس (روپے)",
      type: "number",
      required: true,
      group: "Financial Details",
    },
    {
      name: "royaltyPercentage",
      label: "Royalty Percentage (%)",
      labelUrdu: "رائلٹی کا فیصد (%)",
      type: "number",
      required: true,
      group: "Financial Details",
    },
    {
      name: "duration",
      label: "Agreement Duration (years)",
      labelUrdu: "معاہدے کی مدت (سال)",
      type: "number",
      required: true,
      group: "Franchise Details",
    },
    {
      name: "terms",
      label: "Additional Terms & Conditions",
      labelUrdu: "اضافی شرائط و ضوابط",
      type: "textarea",
      required: false,
      aiSuggestable: true,
      group: "Terms",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a Franchise Agreement in {{language}}.

FRANCHISOR:
- Name: {{franchisorName}}
- CNIC: {{franchisorCnic}}
- Address: {{franchisorAddress}}

FRANCHISEE:
- Name: {{franchiseeName}}
- CNIC: {{franchiseeCnic}}
- Address: {{franchiseeAddress}}

FRANCHISE DETAILS:
- Brand/Name: {{franchiseName}}
- Territory: {{territory}}
- Duration: {{duration}} years

FINANCIAL:
- Franchise Fee: PKR {{franchiseFee}}
- Royalty: {{royaltyPercentage}}%

ADDITIONAL TERMS: {{terms}}

Generate a complete Franchise Agreement following Pakistani law REFERENCE FORMAT - Follow this exact Pakistani legal format:

FRANCHISE AGREEMENT

This Franchise Agreement is made and executed on this ___ day of ___________, 20___ at [City].

BETWEEN:

[Franchisor Name / Company], NTN [Number], [Address]
(hereinafter called the "FRANCHISOR")

AND

[Franchisee Name / Company], CNIC No. / NTN [Number], [Address]
(hereinafter called the "FRANCHISEE")

NOW THEREFORE BOTH PARTIES AGREE AS UNDER:

1. That the Franchisor hereby grants the Franchisee a [exclusive / non-exclusive] license to operate under the brand name [Brand Name] at [Location] for a period of [Duration].
2. That the Franchisee shall pay an initial franchise fee of PKR [Franchise Fee]/- and ongoing royalty of [Royalty %] of gross sales.
3. That the Franchisee shall strictly adhere to the Franchisor's quality standards, operational manuals, and brand guidelines.
4. That the Franchisor shall provide initial training, marketing support, and ongoing assistance to the Franchisee.
5. That the Franchisee shall not use the brand name or intellectual property beyond the scope of this agreement.
6. That either party may terminate this agreement for material breach with [Notice Period] days written notice.
7. That this agreement shall be governed by Pakistani law and disputes resolved in courts at [City].

FRANCHISOR                              FRANCHISEE
[Name / Company]                        [Name / Company]
NTN: ___________                        CNIC / NTN: ___________

Witness 1: ___________________   Witness 2: ___________________

INSTRUCTIONS:
- Title: FRANCHISE AGREEMENT (centered, bold)
- BETWEEN / AND party structure
- Numbered "That..." clauses
- Include franchise fee, royalty, brand standards, training
- Both signatures at bottom
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
