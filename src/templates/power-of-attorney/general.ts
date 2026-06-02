import { TemplateDefinition } from "../types";

export const generalPOA: TemplateDefinition = {
  category: "power-of-attorney",
  subType: "general",
  name: "General Power of Attorney",
  nameUrdu: "جنرل مختار نامہ",
  description: "General power of attorney for broad authority",
  descriptionUrdu: "وسیع اختیارات کے لیے عام مختار نامہ",
  icon: "UserCheck",
  formFields: [
    {
      name: "principalName",
      label: "Principal Name (Grantor)",
      labelUrdu: "مؤکل کا نام",
      type: "text",
      required: true,
      group: "Principal Details",
    },
    {
      name: "principalFatherName",
      label: "Principal's Father's Name",
      labelUrdu: "مؤکل کے والد کا نام",
      type: "text",
      required: true,
      group: "Principal Details",
    },
    {
      name: "principalCnic",
      label: "Principal CNIC",
      labelUrdu: "مؤکل کا شناختی کارڈ",
      type: "cnic",
      required: true,
      group: "Principal Details",
    },
    {
      name: "principalAddress",
      label: "Principal Address",
      labelUrdu: "مؤکل کا پتہ",
      type: "address",
      required: true,
      group: "Principal Details",
    },
    {
      name: "attorneyName",
      label: "Attorney Name (Agent)",
      labelUrdu: "مختار کا نام",
      type: "text",
      required: true,
      group: "Attorney Details",
    },
    {
      name: "attorneyFatherName",
      label: "Attorney's Father's Name",
      labelUrdu: "مختار کے والد کا نام",
      type: "text",
      required: true,
      group: "Attorney Details",
    },
    {
      name: "attorneyCnic",
      label: "Attorney CNIC",
      labelUrdu: "مختار کا شناختی کارڈ",
      type: "cnic",
      required: true,
      group: "Attorney Details",
    },
    {
      name: "powers",
      label: "Powers Granted",
      labelUrdu: "دیے گئے اختیارات",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      placeholder: "Describe the powers being granted",
      group: "Powers",
    },
    {
      name: "duration",
      label: "Duration/Validity",
      labelUrdu: "مدت/مؤثریت",
      type: "text",
      required: false,
      placeholder: "e.g., Until revoked, 1 year",
      group: "Terms",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a General Power of Attorney in {{language}}.

PRINCIPAL (GRANTOR):
- Name: {{principalName}}
- Father's Name: {{principalFatherName}}
- CNIC: {{principalCnic}}
- Address: {{principalAddress}}

ATTORNEY (AGENT):
- Name: {{attorneyName}}
- Father's Name: {{attorneyFatherName}}
- CNIC: {{attorneyCnic}}

POWERS GRANTED: {{powers}}
DURATION: {{duration}}

REFERENCE FORMAT — Follow this exact Pakistani legal format:

GENERAL POWER OF ATTORNEY

This General Power of Attorney is made and executed on this ___ day of ___________, 20___ by:

[Principal Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
(Hereinafter called the "EXECUTANT")

IN FAVOUR OF:

[Attorney Name] S/o [Father Name], CNIC No. [Attorney CNIC], resident of [Attorney Address]
(Hereinafter called the "ATTORNEY")

WHEREAS the Executant is the owner of [property/assets description] and desires to appoint the above-named as his/her lawful attorney for the purposes stated herein.

I do hereby appoint [Attorney Name] S/o [Father Name] as my lawful attorney, for me, in my name and on my behalf to do and execute the following acts, deeds, and things:

1. To sell, exchange, surrender, lease or rent the above property in whatever manner the Attorney may deem fit, receive the sale price, execute sale deed and get the same registered with the Sub Registrar as required by law.
2. To commence, carry on and defend all actions and proceedings in any Court of Law concerning the above-said properties or any matter relating thereto.
3. To sign, verify and present all pleadings, affidavits, applications, appeals and petitions in all courts, civil, criminal, revenue or appellate, in Registration offices and all other offices on my behalf.
4. To mortgage, pledge or otherwise encumber the said property and to collect No Encumbrance Certificate (NEC) from the concerned office.
5. To appoint Advocates or Attorneys whenever the Attorney shall think proper and to appoint Special Power of Attorney.

AND GENERALLY to do, execute and perform any other act, deed or thing whatsoever which in the opinion of the Attorney ought to be done in relation to the above-stated matters as fully and effectually as I could do personally.

AND I HEREBY agree and undertake to ratify and confirm all acts done by my above-named Attorney by virtue of this General Power of Attorney.

__________________________          __________________________
[Principal Name]                    [Attorney Name]
CNIC: ___________                   CNIC: ___________
(EXECUTANT)                         (ATTORNEY)

WITNESSES:
1. _______________________     2. _______________________

ATTESTED
(Oath Commissioner / Notary Public)

INSTRUCTIONS:
- Title: GENERAL POWER OF ATTORNEY (centered, bold)
- EXECUTANT and ATTORNEY identification with CNIC
- WHEREAS clause for property ownership
- Numbered powers granted starting with "To..."
- AND GENERALLY clause for broad powers
- AND I HEREBY ratification clause
- Both signatures at bottom
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
