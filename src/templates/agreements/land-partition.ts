import { TemplateDefinition } from "../types";

export const landPartition: TemplateDefinition = {
  category: "agreement",
  subType: "land-partition",
  name: "Land Partition Deed",
  nameUrdu: "تقسیم زمین نامہ",
  description: "Division of jointly owned land among co-owners",
  descriptionUrdu: "مشترکہ ملکیت والی زمین کی شریک مالکان میں تقسیم",
  icon: "Grid3X3",
  formFields: [
    {
      name: "coOwner1Name",
      label: "Co-Owner 1 Name",
      labelUrdu: "شریک مالک 1 کا نام",
      type: "text",
      required: true,
      group: "Co-Owner 1",
    },
    {
      name: "coOwner1FatherName",
      label: "Co-Owner 1 Father's Name",
      labelUrdu: "شریک مالک 1 کے والد کا نام",
      type: "text",
      required: true,
      group: "Co-Owner 1",
    },
    {
      name: "coOwner1Cnic",
      label: "Co-Owner 1 CNIC",
      labelUrdu: "شریک مالک 1 کا شناختی کارڈ",
      type: "cnic",
      required: true,
      group: "Co-Owner 1",
    },
    {
      name: "coOwner1Share",
      label: "Co-Owner 1 Share",
      labelUrdu: "شریک مالک 1 کا حصہ",
      type: "text",
      required: true,
      group: "Co-Owner 1",
    },
    {
      name: "coOwner2Name",
      label: "Co-Owner 2 Name",
      labelUrdu: "شریک مالک 2 کا نام",
      type: "text",
      required: true,
      group: "Co-Owner 2",
    },
    {
      name: "coOwner2FatherName",
      label: "Co-Owner 2 Father's Name",
      labelUrdu: "شریک مالک 2 کے والد کا نام",
      type: "text",
      required: true,
      group: "Co-Owner 2",
    },
    {
      name: "coOwner2Cnic",
      label: "Co-Owner 2 CNIC",
      labelUrdu: "شریک مالک 2 کا شناختی کارڈ",
      type: "cnic",
      required: true,
      group: "Co-Owner 2",
    },
    {
      name: "coOwner2Share",
      label: "Co-Owner 2 Share",
      labelUrdu: "شریک مالک 2 کا حصہ",
      type: "text",
      required: true,
      group: "Co-Owner 2",
    },
    {
      name: "additionalCoOwners",
      label: "Additional Co-Owners (Names, CNICs, Shares)",
      labelUrdu: "اضافی شریک مالکان (نام، شناختی کارڈ، حصے)",
      type: "textarea",
      required: false,
      aiSuggestable: true,
      group: "Additional Co-Owners",
    },
    {
      name: "totalLandDescription",
      label: "Total Land Description (Area, Location, Khasra/Khata No)",
      labelUrdu: "کل زمین کی تفصیل (رقبہ، مقام، خسرہ/کھاتہ نمبر)",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Land Details",
    },
    {
      name: "totalArea",
      label: "Total Area (Kanals/Marlas/Acres)",
      labelUrdu: "کل رقبہ (کنال/مرلے/ایکڑ)",
      type: "text",
      required: true,
      group: "Land Details",
    },
    {
      name: "partitionPlanDescription",
      label: "Partition Plan / Demarcation Details",
      labelUrdu: "تقسیم کا نقشہ / حد بندی کی تفصیل",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Partition Details",
    },
    {
      name: "commonAreaArrangement",
      label: "Common Area / Shared Access Arrangement",
      labelUrdu: "مشترکہ رقبہ / مشترکہ راستے کا انتظام",
      type: "textarea",
      required: false,
      aiSuggestable: true,
      group: "Partition Details",
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
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a Land Partition Deed (Taqseem Zameen Nama) in {{language}}.

CO-OWNER 1:
- Name: {{coOwner1Name}}
- Father's Name: {{coOwner1FatherName}}
- CNIC: {{coOwner1Cnic}}
- Share: {{coOwner1Share}}

CO-OWNER 2:
- Name: {{coOwner2Name}}
- Father's Name: {{coOwner2FatherName}}
- CNIC: {{coOwner2Cnic}}
- Share: {{coOwner2Share}}

ADDITIONAL CO-OWNERS: {{additionalCoOwners}}

LAND DETAILS:
- Description: {{totalLandDescription}}
- Total Area: {{totalArea}}

PARTITION:
- Plan: {{partitionPlanDescription}}
- Common Areas: {{commonAreaArrangement}}

WITNESSES:
- Witness 1: {{witness1Name}}
- Witness 2: {{witness2Name}}

Generate a complete Land Partition Deed following Pakistani Partition Act 1893 and Transfer of Property Act. Include recitals of joint ownership, share of eachREFERENCE FORMAT - Follow this exact Pakistani legal format:

PARTITION DEED / TAQSEEM NAMA

This Partition Deed is made and executed on this ___ day of ___________, 20___ at [City].

BETWEEN:

[First Co-owner Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
(hereinafter called the "FIRST PARTY")

AND

[Second Co-owner Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
(hereinafter called the "SECOND PARTY")

PROPERTY DETAILS:
- Khasra / Plot No.: [Number]
- Mouza / Colony: [Mouza]
- Tehsil: [Tehsil], District: [District]
- Total Area: [Total Area]

WHEREAS both parties are co-owners of the above-described land / property in equal / [Share] shares.

NOW THEREFORE BOTH PARTIES AGREE AS UNDER:

1. That both parties mutually agree to partition the said property and have divided it as follows:
   - First Party's Share: [Description of portion - Khasra/Plot, Area, Location]
   - Second Party's Share: [Description of portion - Khasra/Plot, Area, Location]
2. That each party shall be the exclusive owner of their respective share after this partition.
3. That neither party shall interfere with the other party's portion after partition.
4. That the cost of mutation and registration shall be borne [equally / by each party for their own portion].
5. That this partition is final and binding on all heirs, successors, and assigns.

FIRST PARTY                             SECOND PARTY
[Name]                                  [Name]
CNIC: ___________                       CNIC: ___________

Witness 1: ___________________   Witness 2: ___________________

INSTRUCTIONS:
- Title: PARTITION DEED / TAQSEEM NAMA (centered, bold)
- BETWEEN / AND party structure
- PROPERTY DETAILS section with Khasra/Mouza/Tehsil/District
- WHEREAS recital
- Numbered "That..." clauses with partition details
- Both signatures at bottom
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
