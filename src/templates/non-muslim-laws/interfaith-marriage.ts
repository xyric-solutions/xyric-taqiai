import { TemplateDefinition } from "../types";

export const interfaithMarriage: TemplateDefinition = {
  category: "non-muslim-laws",
  subType: "interfaith-marriage",
  name: "Interfaith Marriage Registration",
  nameUrdu: "بین المذاہب شادی رجسٹریشن",
  description: "Marriage registration and legal documentation for interfaith couples",
  descriptionUrdu: "بین المذاہب جوڑوں کے لیے شادی کی رجسٹریشن اور قانونی دستاویزات",
  icon: "Heart",
  formFields: [
    { name: "party1Name", label: "Party 1 Name", labelUrdu: "فریق 1 کا نام", type: "text", required: true, group: "Party 1" },
    { name: "party1Cnic", label: "CNIC", labelUrdu: "شناختی کارڈ", type: "cnic", required: true, group: "Party 1" },
    { name: "party1Religion", label: "Religion", labelUrdu: "مذہب", type: "text", required: true, group: "Party 1" },
    { name: "party1Address", label: "Address", labelUrdu: "پتہ", type: "address", required: true, group: "Party 1" },
    { name: "party2Name", label: "Party 2 Name", labelUrdu: "فریق 2 کا نام", type: "text", required: true, group: "Party 2" },
    { name: "party2Cnic", label: "CNIC", labelUrdu: "شناختی کارڈ", type: "cnic", required: true, group: "Party 2" },
    { name: "party2Religion", label: "Religion", labelUrdu: "مذہب", type: "text", required: true, group: "Party 2" },
    { name: "party2Address", label: "Address", labelUrdu: "پتہ", type: "address", required: true, group: "Party 2" },
    { name: "marriageDate", label: "Date of Marriage", labelUrdu: "شادی کی تاریخ", type: "date", required: true, group: "Details" },
    { name: "marriageUnder", label: "Marriage Solemnized Under", labelUrdu: "شادی کس قانون کے تحت", type: "select", required: true, group: "Details",
      options: [
        { value: "special-marriage", label: "Special Marriage (Civil)" },
        { value: "christian-act", label: "Christian Marriage Act 1872" },
        { value: "hindu-act", label: "Hindu Marriage Act 2017" },
        { value: "conversion", label: "After Conversion of One Party" },
      ],
    },
    { name: "witness1", label: "Witness 1", labelUrdu: "گواہ 1", type: "text", required: true, group: "Witnesses" },
    { name: "witness2", label: "Witness 2", labelUrdu: "گواہ 2", type: "text", required: true, group: "Witnesses" },
  ],
  promptTemplate: `Generate a legal document for an Interfaith Marriage in Pakistan.
Party 1: {party1Name}, CNIC: {party1Cnic}, Religion: {party1Religion}, Address: {party1Address}
Party 2: {party2Name}, CNIC: {party2Cnic}, Religion: {party2Religion}, Address: {party2Address}
Date: {marriageDate}, Solemnized Under: {marriageUnder}
Witnesses: {witness1}, {witness2}
Note: Pakistan has no specific interfaith marriage statute. Marriage is governed by the personal law under which it is solemnized. Cite relevant Act based on the chosen law. Include affidavit of free will if conversion involved.

REFERENCE FORMAT - Follow this exact Pakistani legal format:

INTERFAITH MARRIAGE AFFIDAVIT / DECLARATION

I, [Party 1 Name] S/o [Father Name], CNIC No. [CNIC], Religion: [Religion], resident of [Address], AND
Mst. / [Party 2 Name] D/o / S/o [Father Name], CNIC No. [CNIC], Religion: [Religion], resident of [Address],

Do hereby jointly declare as under:

1. That we are of different faiths and wish to solemnize our marriage.
2. That [Party 1 Name] / [Party 2 Name] has voluntarily converted to [Religion] of his/her own free will without any coercion.
3. That this marriage is being conducted under [Applicable Law - Muslim Personal Law / Christian Marriage Act 1872 / Hindu Marriage Act 2017] as per our chosen faith.
4. That both parties are adults and are entering this marriage voluntarily.
5. That no court order, injunction, or objection exists against this marriage.

JOINT DECLARATION
Party 1: ___________          Party 2: ___________
CNIC: ___________             CNIC: ___________

Witness 1: ___________        Witness 2: ___________

INSTRUCTIONS:
- Title: INTERFAITH MARRIAGE AFFIDAVIT / DECLARATION (centered, bold)
- Include voluntary conversion statement
- Reference applicable personal law
- Both parties sign jointly
- Include witnesses
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
