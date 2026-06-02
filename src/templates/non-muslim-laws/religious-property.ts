import { TemplateDefinition } from "../types";

export const religiousProperty: TemplateDefinition = {
  category: "non-muslim-laws",
  subType: "religious-property",
  name: "Religious Property Dispute (ETPB)",
  nameUrdu: "مذہبی جائیداد کا تنازعہ",
  description: "Application regarding Evacuee Trust Property Board matters for minority religious properties",
  descriptionUrdu: "اقلیتی مذہبی جائیدادوں کے لیے ای ٹی پی بی معاملات",
  icon: "Church",
  formFields: [
    { name: "applicantName", label: "Applicant's Name", labelUrdu: "درخواست گزار", type: "text", required: true, group: "Applicant" },
    { name: "applicantCnic", label: "CNIC", labelUrdu: "شناختی کارڈ", type: "cnic", required: true, group: "Applicant" },
    { name: "applicantCapacity", label: "Capacity", labelUrdu: "حیثیت", type: "select", required: true, group: "Applicant",
      options: [
        { value: "trustee", label: "Trustee" },
        { value: "community-leader", label: "Community Leader" },
        { value: "caretaker", label: "Caretaker/Pujari/Pastor" },
        { value: "member", label: "Community Member" },
      ],
    },
    { name: "propertyType", label: "Property Type", labelUrdu: "جائیداد کی قسم", type: "select", required: true, group: "Property" },
    { name: "propertyAddress", label: "Property Address", labelUrdu: "جائیداد کا پتہ", type: "address", required: true, group: "Property" },
    { name: "propertyDescription", label: "Property Description", labelUrdu: "جائیداد کی تفصیل", type: "textarea", required: true, group: "Property" },
    { name: "issueType", label: "Issue Type", labelUrdu: "مسئلے کی نوعیت", type: "select", required: true, group: "Details",
      options: [
        { value: "encroachment", label: "Encroachment by Outsiders" },
        { value: "etpb-mismanagement", label: "ETPB Mismanagement" },
        { value: "illegal-allotment", label: "Illegal Allotment by ETPB" },
        { value: "restoration", label: "Restoration to Community" },
        { value: "maintenance", label: "Lack of Maintenance/Repair" },
        { value: "commercial-use", label: "Illegal Commercial Use" },
      ],
    },
    { name: "facts", label: "Detailed Facts", labelUrdu: "تفصیلی حقائق", type: "textarea", required: true, group: "Details" },
  ],
  promptTemplate: `Generate a legal application regarding minority religious property in Pakistan.
Applicant: {applicantName}, CNIC: {applicantCnic}, Capacity: {applicantCapacity}
Property: {propertyType}, Address: {propertyAddress}, Description: {propertyDescription}
Issue: {issueType}
Facts: {facts}
Cite Evacuee Trust Properties (Management & Disposal) Act 1975. Article 20 & 36 Constitution. Supreme Court Suo Motu Case 1/2014 directions on minority property protection. File application to ETPB Chairman and/or writ petition in High Court.

REFERENCE FORMAT - Follow this exact Pakistani legal format:

APPLICATION FOR PROTECTION OF MINORITY RELIGIOUS PROPERTY

To,
The Chairman,
Evacuee Trust Properties Board (ETPB) / District Collector,
[City].

SUBJECT: Protection of [Church / Temple / Gurdwara / Cemetery] Property

[Applicant Name] S/o [Father Name], CNIC No. [CNIC], Religion: [Religion], resident of [Address]

1. That the [Church / Temple / Gurdwara / Cemetery] situated at [Location] has been the place of worship of [Community] for [Duration] years.
2. That the said property is protected under the Evacuee Trust Properties (Management and Disposal) Act 1975.
3. That [Encroacher / Government Body] is attempting to encroach / demolish / misappropriate the said property.
4. That Articles 20 and 36 of the Constitution guarantee protection of places of worship and minority interests.
5. That the Supreme Court in Suo Motu Case 1/2014 issued directions for protection of minority religious property.

PRAYER:
(i) Take action to protect the said property;
(ii) Restrain any encroachment or demolition;
(iii) Register the said property in the name of the religious community.

Applicant: ___________
Date: ___________

INSTRUCTIONS:
- Addressing: To ETPB Chairman or District Collector
- Reference Evacuee Trust Properties Act 1975
- Reference Articles 20 and 36 Constitution
- Reference Suo Motu Case 1/2014
- Prayer clause with (i)(ii)(iii) items
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
