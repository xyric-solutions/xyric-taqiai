import { TemplateDefinition } from "../types";

export const cyberCrime: TemplateDefinition = {
  category: "criminal-law",
  subType: "cyber-crime",
  name: "Cyber Crime Complaint / سائبر کرائم شکایت",
  nameUrdu: "سائبر کرائم شکایت",
  description: "Cyber crime complaint under Prevention of Electronic Crimes Act (PECA) 2016",
  descriptionUrdu: "الیکٹرانک جرائم کی روک تھام ایکٹ (پیکا) 2016 کے تحت سائبر کرائم شکایت",
  icon: "AlertTriangle",
  formFields: [
    {
      name: "complainantName",
      label: "Complainant Name",
      labelUrdu: "مدعی کا نام",
      type: "text",
      required: true,
      group: "Complainant Details",
    },
    {
      name: "complainantFatherName",
      label: "Complainant Father's Name",
      labelUrdu: "مدعی کے والد کا نام",
      type: "text",
      required: true,
      group: "Complainant Details",
    },
    {
      name: "complainantCnic",
      label: "Complainant CNIC",
      labelUrdu: "مدعی کا شناختی کارڈ",
      type: "cnic",
      required: true,
      group: "Complainant Details",
    },
    {
      name: "complainantAddress",
      label: "Complainant Address",
      labelUrdu: "مدعی کا پتہ",
      type: "address",
      required: true,
      group: "Complainant Details",
    },
    {
      name: "complainantContact",
      label: "Complainant Phone/Email",
      labelUrdu: "مدعی کا فون/ای میل",
      type: "text",
      required: true,
      group: "Complainant Details",
    },
    {
      name: "accusedName",
      label: "Accused Name (if known)",
      labelUrdu: "ملزم کا نام (اگر معلوم ہو)",
      type: "text",
      required: false,
      group: "Accused Details",
    },
    {
      name: "accusedOnlineIdentity",
      label: "Accused Online Identity/Username",
      labelUrdu: "ملزم کی آن لائن شناخت/یوزرنیم",
      type: "text",
      required: false,
      group: "Accused Details",
    },
    {
      name: "cyberCrimeType",
      label: "Type of Cyber Crime",
      labelUrdu: "سائبر کرائم کی قسم",
      type: "select",
      required: true,
      options: [
        { value: "hacking", label: "Unauthorized Access/Hacking (Section 3 PECA)", labelUrdu: "غیر مجاز رسائی/ہیکنگ (دفعہ 3 پیکا)" },
        { value: "stalking", label: "Cyber Stalking (Section 24 PECA)", labelUrdu: "سائبر اسٹاکنگ (دفعہ 24 پیکا)" },
        { value: "harassment", label: "Online Harassment (Section 24 PECA)", labelUrdu: "آن لائن ہراسانی (دفعہ 24 پیکا)" },
        { value: "defamation", label: "Online Defamation (Section 20 PECA)", labelUrdu: "آن لائن ہتک عزت (دفعہ 20 پیکا)" },
        { value: "fraud", label: "Electronic Fraud (Section 13 PECA)", labelUrdu: "الیکٹرانک فراڈ (دفعہ 13 پیکا)" },
        { value: "identity_theft", label: "Identity Theft (Section 16 PECA)", labelUrdu: "شناخت کی چوری (دفعہ 16 پیکا)" },
        { value: "data_breach", label: "Unauthorized Data Access (Section 4 PECA)", labelUrdu: "غیر مجاز ڈیٹا تک رسائی (دفعہ 4 پیکا)" },
        { value: "obscene_content", label: "Sending Obscene Content (Section 22 PECA)", labelUrdu: "فحش مواد بھیجنا (دفعہ 22 پیکا)" },
      ],
      group: "Crime Details",
    },
    {
      name: "platform",
      label: "Platform/Medium Used",
      labelUrdu: "استعمال شدہ پلیٹ فارم/ذریعہ",
      type: "select",
      required: true,
      options: [
        { value: "facebook", label: "Facebook", labelUrdu: "فیس بک" },
        { value: "whatsapp", label: "WhatsApp", labelUrdu: "واٹس ایپ" },
        { value: "instagram", label: "Instagram", labelUrdu: "انسٹاگرام" },
        { value: "twitter", label: "Twitter/X", labelUrdu: "ٹوئٹر/ایکس" },
        { value: "email", label: "Email", labelUrdu: "ای میل" },
        { value: "website", label: "Website", labelUrdu: "ویب سائٹ" },
        { value: "sms", label: "SMS/Phone", labelUrdu: "ایس ایم ایس/فون" },
        { value: "other", label: "Other", labelUrdu: "دیگر" },
      ],
      group: "Crime Details",
    },
    {
      name: "evidenceScreenshots",
      label: "Evidence Description (Screenshots, URLs, etc.)",
      labelUrdu: "شواہد کی تفصیل (اسکرین شاٹس، یو آر ایلز وغیرہ)",
      type: "textarea",
      required: true,
      group: "Evidence",
    },
    {
      name: "evidenceUrls",
      label: "Relevant URLs/Links",
      labelUrdu: "متعلقہ یو آر ایلز/لنکس",
      type: "textarea",
      required: false,
      group: "Evidence",
    },
    {
      name: "factsOfCase",
      label: "Detailed Facts of the Incident",
      labelUrdu: "واقعے کی تفصیلی حقائق",
      type: "textarea",
      required: true,
      aiSuggestable: true,
      group: "Case Details",
    },
    {
      name: "dateOfIncident",
      label: "Date of Incident",
      labelUrdu: "واقعہ کی تاریخ",
      type: "date",
      required: true,
      group: "Case Details",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a Cyber Crime Complaint in {{language}}.

COMPLAINANT:
- Name: {{complainantName}}
- Father's Name: {{complainantFatherName}}
- CNIC: {{complainantCnic}}
- Address: {{complainantAddress}}
- Contact: {{complainantContact}}

ACCUSED:
- Name: {{accusedName}}
- Online Identity: {{accusedOnlineIdentity}}

CRIME DETAILS:
- Type: {{cyberCrimeType}}
- Platform: {{platform}}
- Date of Incident: {{dateOfIncident}}

EVIDENCE:
- Screenshots/Description: {{evidenceScreenshots}}
- URLs: {{evidenceUrls}}

FACTS:
{{factsOfCase}}

Generate a complete Cyber Crime Complaint under the Prevention of Electronic Crimes Act 2016 (PECA), to be filed with the FIA Cyber Crime Circle. Reference the specific PECA section based on the crime type, along with any applicable PPC sections. Include proper heading addressed to the Director FIA Cyber Crime Wing, statement of facts, list of digital evidence, applicable sections under PECA 20REFERENCE FORMAT - Follow this exact Pakistani legal format:

To,
The Director / Additional Director,
Federal Investigation Agency (FIA),
Cyber Crime Circle, [City].

SUBJECT: Complaint Under Prevention of Electronic Crimes Act (PECA) 2016

[Complainant Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
                                                    ...COMPLAINANT

RESPECTFULLY SHEWETH:

1. That the Complainant is a Pakistani national and a law-abiding citizen.
2. That on [Date], the Complainant discovered that [Description of Cyber Crime - hacking / fake profile / harassment / financial fraud / defamation online].
3. That the said act is an offence under Section [PECA Section - 10/11/14/15/16/17/18/20/21] of the Prevention of Electronic Crimes Act 2016.
4. That the digital evidence / electronic evidence includes: [URLs / Screenshots / IP Address / Device Details].
5. That the Complainant requests preservation of electronic evidence under Section 39 of PECA 2016.
6. That the identity of the accused is: [Known details - account username / phone number / IP address].

PRAYER:
(i) Register an FIR under PECA 2016;
(ii) Preserve all electronic evidence related to this complaint;
(iii) Investigate and take legal action against the accused;
(iv) Block / take down the offending content.

Complainant:
[Name] S/o [Father Name]
CNIC: ___________
Contact: ___________

INSTRUCTIONS:
- Addressing: To the FIA Cyber Crime Circle
- SUBJECT: Complaint Under PECA 2016
- "RESPECTFULLY SHEWETH:" opening
- Numbered "That..." paragraphs with cyber crime description
- Include PECA 2016 section numbers
- Section 39 PECA for evidence preservation
- Prayer clause with (i)(ii)(iii)(iv) items
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
