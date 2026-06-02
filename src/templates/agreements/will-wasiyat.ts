import { TemplateDefinition } from "../types";

export const willWasiyat: TemplateDefinition = {
  category: "agreement",
  subType: "will-wasiyat",
  name: "Will / Wasiyat Nama",
  nameUrdu: "وصیت نامہ",
  description: "Last will and testament",
  descriptionUrdu: "وصیت نامہ / آخری خواہشات",
  icon: "FileCheck",
  formFields: [
    {
      name: "testatorName",
      label: "Testator Name (Person Making Will)",
      labelUrdu: "وصیت کنندہ کا نام",
      type: "text",
      required: true,
      group: "Testator Details",
    },
    {
      name: "testatorFatherName",
      label: "Testator's Father's Name",
      labelUrdu: "وصیت کنندہ کے والد کا نام",
      type: "text",
      required: true,
      group: "Testator Details",
    },
    {
      name: "testatorCnic",
      label: "Testator CNIC",
      labelUrdu: "وصیت کنندہ کا شناختی کارڈ",
      type: "cnic",
      required: true,
      group: "Testator Details",
    },
    {
      name: "testatorAddress",
      label: "Testator Address",
      labelUrdu: "وصیت کنندہ کا پتہ",
      type: "address",
      required: true,
      group: "Testator Details",
    },
    {
      name: "beneficiaries",
      label: "Beneficiaries with Shares",
      labelUrdu: "وارثین اور ان کے حصے",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      placeholder: "List each beneficiary with their name, relationship, and share",
      placeholderUrdu: "ہر وارث کا نام، رشتہ اور حصہ لکھیں",
      group: "Beneficiaries",
    },
    {
      name: "executorName",
      label: "Executor Name",
      labelUrdu: "وصیت پر عمل کرنے والے کا نام",
      type: "text",
      required: true,
      group: "Executor Details",
    },
    {
      name: "executorCnic",
      label: "Executor CNIC",
      labelUrdu: "عامل وصیت کا شناختی کارڈ",
      type: "cnic",
      required: false,
      group: "Executor Details",
    },
    {
      name: "specificBequests",
      label: "Specific Bequests (property, items, etc.)",
      labelUrdu: "مخصوص وصیتیں (جائیداد، اشیاء وغیرہ)",
      type: "textarea",
      required: false,
      aiSuggestable: true,
      group: "Bequests",
    },
    {
      name: "conditions",
      label: "Conditions / Special Instructions",
      labelUrdu: "شرائط / خصوصی ہدایات",
      type: "textarea",
      required: false,
      aiSuggestable: true,
      group: "Terms",
    },
    {
      name: "witness1Name",
      label: "Witness 1 Name",
      labelUrdu: "گواہ 1 کا نام",
      type: "text",
      required: true,
      group: "Witnesses",
    },
    {
      name: "witness2Name",
      label: "Witness 2 Name",
      labelUrdu: "گواہ 2 کا نام",
      type: "text",
      required: true,
      group: "Witnesses",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a Will / Wasiyat Nama in {{language}}.

TESTATOR:
- Name: {{testatorName}}
- Father's Name: {{testatorFatherName}}
- CNIC: {{testatorCnic}}
- Address: {{testatorAddress}}

BENEFICIARIES AND SHARES:
{{beneficiaries}}

EXECUTOR:
- Name: {{executorName}}
- CNIC: {{executorCnic}}

SPECIFIC BEQUESTS: {{specificBequests}}

CONDITIONS: {{conditions}}

WITNESSES:
- Witness 1: {{witness1Name}}
- Witness 2: {{witness2Name}}

REFERENCE FORMAT — Follow this exact Pakistani legal format:

WILL / WASIYAT NAMA

I, [Testator Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address], [City], being of sound and disposing mind, memory and understanding, do hereby make this my Last Will and Testament in the following manner, hereby revoking all former Wills and Codicils heretofore made by me:

1. That I declare that I am of sound mind and this Will is being made by me voluntarily and out of my own free will without any coercion or undue influence.

2. That I appoint [Executor Name] S/o [Father Name], CNIC No. [Executor CNIC], as the Executor of this Will to carry out its terms and conditions.

3. That after my death, my estate and properties shall be distributed among my heirs and beneficiaries as follows:

   [Beneficiary 1 Name] [Relationship] — [Share / Specific Bequest]
   [Beneficiary 2 Name] [Relationship] — [Share / Specific Bequest]
   [Additional beneficiaries as needed]

4. That the following specific bequests are made: [Specific Bequests].

5. That any bequest to non-heirs shall not exceed one-third (1/3) of the estate as per Islamic law (Wasiyat limit).

6. That I direct my Executor to first pay all my debts, liabilities and funeral expenses from my estate before distribution.

7. That any conditions or special instructions regarding this Will are as follows: [Conditions].

8. That this Will may be amended or revoked by me at any time during my lifetime.

IN WITNESS WHEREOF, I have executed this Will on the day and year written above in the presence of the following witnesses.

TESTATOR
[Name] S/o [Father Name]
CNIC: ___________

Witness 1: ___________________     Witness 2: ___________________
Name: ___________________           Name: ___________________
CNIC: ___________                   CNIC: ___________

ATTESTED
(Oath Commissioner / Notary Public)

INSTRUCTIONS:
- Title: WILL / WASIYAT NAMA (centered, bold)
- Opening: "being of sound and disposing mind..."
- Numbered clauses: executor, beneficiaries, specific bequests, Islamic 1/3 limit
- Include "revoking all former Wills" clause
- TESTATOR and two Witnesses signature blocks
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
