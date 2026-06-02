import { TemplateDefinition } from "../types";

export const inheritance: TemplateDefinition = {
  category: "family-law",
  subType: "inheritance",
  name: "Wirasat / Inheritance Distribution Deed",
  nameUrdu: "وراثت نامہ / تقسیم وراثت",
  description: "Inheritance distribution deed according to Islamic law shares",
  descriptionUrdu: "اسلامی قانون کے مطابق وراثت کی تقسیم کا دستاویز",
  icon: "Scale",
  formFields: [
    {
      name: "deceasedName",
      label: "Deceased's Name",
      labelUrdu: "مرحوم کا نام",
      type: "text",
      required: true,
      group: "Deceased Details",
    },
    {
      name: "deceasedFatherName",
      label: "Deceased's Father's Name",
      labelUrdu: "مرحوم کے والد کا نام",
      type: "text",
      required: true,
      group: "Deceased Details",
    },
    {
      name: "deceasedCnic",
      label: "Deceased's CNIC",
      labelUrdu: "مرحوم کا شناختی کارڈ",
      type: "cnic",
      required: false,
      group: "Deceased Details",
    },
    {
      name: "dateOfDeath",
      label: "Date of Death",
      labelUrdu: "تاریخ وفات",
      type: "date",
      required: true,
      group: "Deceased Details",
    },
    {
      name: "legalHeirsWithShares",
      label: "List of Legal Heirs with Islamic Law Shares",
      labelUrdu: "قانونی ورثاء کی فہرست اسلامی حصص کے ساتھ",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Heirs Details",
    },
    {
      name: "propertyDetails",
      label: "Property Details (Land, House, etc.)",
      labelUrdu: "جائیداد کی تفصیلات (زمین، مکان وغیرہ)",
      type: "textarea",
      required: true,
      group: "Property Details",
    },
    {
      name: "movableAssets",
      label: "Movable Assets (Cash, Vehicles, etc.)",
      labelUrdu: "منقولہ اثاثے (نقدی، گاڑیاں وغیرہ)",
      type: "textarea",
      required: false,
      group: "Property Details",
    },
    {
      name: "wasiyat",
      label: "Will/Wasiyat Details (if any)",
      labelUrdu: "وصیت کی تفصیلات (اگر کوئی ہو)",
      type: "textarea",
      required: false,
      group: "Will Details",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate an Inheritance Distribution Deed (Wirasat Nama) in {{language}}.

DECEASED:
- Name: {{deceasedName}}
- Father's Name: {{deceasedFatherName}}
- CNIC: {{deceasedCnic}}
- Date of Death: {{dateOfDeath}}

LEGAL HEIRS WITH SHARES: {{legalHeirsWithShares}}

PROPERTY:
- Immovable Property: {{propertyDetails}}
- Movable Assets: {{movableAssets}}

WILL/WASIYAT: {{wasiyat}}

Generate a complete Inheritance Distribution Deed following Pakistani Muslim Personal Law and Islamic inheritance principles (Faraid).
Include share calculations per Quran and Sunnah.
ReferenceREFERENCE FORMAT - Follow this exact Pakistani legal format:

INHERITANCE / SUCCESSION DECLARATION AFFIDAVIT

I, [Deponent Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address], do hereby solemnly affirm and declare as under:

1. That [Deceased Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address], passed away on [Date of Death].
2. That at the time of death, the deceased left behind the following legal heirs:

LEGAL HEIRS TABLE:
Name | Relation | CNIC | Share (Islamic Law)
[Heir 1] | [Wife/Son/Daughter/etc.] | [CNIC] | [Share per Sharia]
[Heir 2] | [Relation] | [CNIC] | [Share]
[Heir 3] | [Relation] | [CNIC] | [Share]

3. That the above are the only legal heirs of the deceased and there are no other heirs.
4. That the deceased left behind the following property / estate: [Description of Property].
5. That the inheritance shall be distributed as per Muslim Personal Law (Shariat) Application Act 1962.
6. That no Will / Wasiyat has been executed by the deceased OR the Wasiyat is attached herewith.

DEPONENT
[Deponent Name] S/o [Father Name]
CNIC: ___________

VERIFICATION:
Verified on oath at [City] on this ___ day of ___________ that the contents of the above affidavit are true and correct to the best of my knowledge and belief and nothing has been concealed therein.

DEPONENT

ATTESTED
(Oath Commissioner / Notary Public / Class-1 Officer)

INSTRUCTIONS:
- Title: INHERITANCE / SUCCESSION DECLARATION AFFIDAVIT (centered, bold)
- Include deceased's details
- HTML table for legal heirs with Islamic law shares
- Reference Muslim Personal Law (Shariat) Application Act 1962
- Include VERIFICATION paragraph
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
