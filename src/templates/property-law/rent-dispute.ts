import { TemplateDefinition } from "../types";

export const rentDispute: TemplateDefinition = {
  category: "property-law",
  subType: "rent-dispute",
  name: "Tenant Eviction Petition / کرایہ دار کی بے دخلی کی درخواست",
  nameUrdu: "کرایہ دار کی بے دخلی کی درخواست",
  description: "Tenant eviction petition under the Punjab Rented Premises Act 2009",
  descriptionUrdu: "پنجاب کرایہ داری ایکٹ 2009 کے تحت کرایہ دار کی بے دخلی کی درخواست",
  icon: "DoorOpen",
  formFields: [
    {
      name: "landlordName",
      label: "Landlord's Name",
      labelUrdu: "مالک مکان کا نام",
      type: "text",
      required: true,
      group: "Landlord Details",
    },
    {
      name: "landlordCnic",
      label: "Landlord's CNIC",
      labelUrdu: "مالک مکان کا شناختی کارڈ",
      type: "cnic",
      required: true,
      group: "Landlord Details",
    },
    {
      name: "landlordAddress",
      label: "Landlord's Address",
      labelUrdu: "مالک مکان کا پتہ",
      type: "address",
      required: true,
      group: "Landlord Details",
    },
    {
      name: "tenantName",
      label: "Tenant's Name",
      labelUrdu: "کرایہ دار کا نام",
      type: "text",
      required: true,
      group: "Tenant Details",
    },
    {
      name: "tenantAddress",
      label: "Tenant's Address",
      labelUrdu: "کرایہ دار کا پتہ",
      type: "address",
      required: true,
      group: "Tenant Details",
    },
    {
      name: "propertyDescription",
      label: "Rented Property Description",
      labelUrdu: "کرایہ پر دی گئی جائیداد کی تفصیل",
      type: "textarea",
      required: true,
      group: "Property Details",
    },
    {
      name: "rentAmount",
      label: "Monthly Rent Amount (PKR)",
      labelUrdu: "ماہانہ کرایہ کی رقم (روپے)",
      type: "number",
      required: true,
      group: "Rent Details",
    },
    {
      name: "arrears",
      label: "Arrears Amount (PKR)",
      labelUrdu: "واجبات کی رقم (روپے)",
      type: "number",
      required: false,
      group: "Rent Details",
    },
    {
      name: "evictionGround",
      label: "Ground for Eviction",
      labelUrdu: "بے دخلی کی بنیاد",
      type: "select",
      required: true,
      options: [
        { value: "non-payment", label: "Non-Payment of Rent", labelUrdu: "کرایہ کی عدم ادائیگی" },
        { value: "subletting", label: "Unauthorized Subletting", labelUrdu: "غیر مجاز ذیلی کرایہ داری" },
        { value: "personal-use", label: "Personal Need of Landlord", labelUrdu: "مالک مکان کی ذاتی ضرورت" },
        { value: "damage", label: "Damage to Property", labelUrdu: "جائیداد کو نقصان" },
        { value: "nuisance", label: "Nuisance / Misuse", labelUrdu: "مزاحمت / غلط استعمال" },
        { value: "other", label: "Other", labelUrdu: "دیگر" },
      ],
      group: "Eviction Details",
    },
    {
      name: "facts",
      label: "Facts of the Case",
      labelUrdu: "مقدمے کے حقائق",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Eviction Details",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a Tenant Eviction Petition in {{language}}.

LANDLORD:
- Name: {{landlordName}}
- CNIC: {{landlordCnic}}
- Address: {{landlordAddress}}

TENANT:
- Name: {{tenantName}}
- Address: {{tenantAddress}}

PROPERTY:
- Description: {{propertyDescription}}

RENT DETAILS:
- Monthly Rent: {{rentAmount}} PKR
- Arrears: {{arrears}} PKR

EVICTION DETAILS:
- Ground for Eviction: {{evictionGround}}
- Facts: {{facts}}

Generate a complete Tenant Eviction Petition under the Punjab Rented Premises Act 2009 before the Rent Tribunal.
Include proper tribunal heading, parties details, tenREFERENCE FORMAT - Follow this exact Pakistani legal format:

IN THE RENT CONTROLLER COURT AT [CITY]

RENT PETITION NO. _______ OF 20___
(Under [Punjab Rented Premises Act 2009 / Sindh Rented Premises Ordinance / KPK Rented Premises Act])

[Landlord Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
                                                    ...PETITIONER (LANDLORD)
VERSUS
[Tenant Name] S/o [Father Name], CNIC No. [CNIC], occupying [Property Address]
                                                    ...RESPONDENT (TENANT)

PETITION FOR EVICTION OF TENANT

RESPECTFULLY SHEWETH:

1. That the Petitioner is the owner of premises at [Property Address] as per Title Deed / Mutation No. [Number].
2. That [Tenant Name] has been a tenant in the said premises since [Date] at a monthly rent of PKR [Amount]/-.
3. That the grounds for eviction under the applicable Rent Act are: [Ground - non-payment of rent / sub-letting / personal requirement / expiry of tenancy].
4. That rent arrears of PKR [Amount]/- have accumulated since [Date] / the tenancy period has expired on [Date].
5. That a legal notice was served on [Date] but the tenant has not vacated.

It is therefore prayed that:
(a) Decree eviction of the tenant from the said premises;
(b) Direct payment of all rent arrears;
(c) Award costs of this petition.

VERIFICATION:
Verified on oath at [City] that the contents are true and correct.

Petitioner: ___________     Advocate: ___________________

INSTRUCTIONS:
- Court heading: IN THE RENT CONTROLLER COURT AT [CITY] (centered, bold)
- Reference applicable provincial Rent Act
- PETITION FOR EVICTION heading
- "RESPECTFULLY SHEWETH:" opening
- Include grounds for eviction, arrears, notice
- Prayer clause with (a), (b), (c) items
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
