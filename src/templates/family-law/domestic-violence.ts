import { TemplateDefinition } from "../types";

export const domesticViolence: TemplateDefinition = {
  category: "family-law",
  subType: "domestic-violence",
  name: "Domestic Violence Protection Application",
  nameUrdu: "گھریلو تشدد سے تحفظ کی درخواست",
  description: "Protection application under Punjab Protection of Women Against Violence Act 2016",
  descriptionUrdu: "پنجاب پروٹیکشن آف ویمن اگینسٹ وائلنس ایکٹ 2016 کے تحت تحفظ کی درخواست",
  icon: "Shield",
  formFields: [
    {
      name: "victimName",
      label: "Victim's Name",
      labelUrdu: "متاثرہ کا نام",
      type: "text",
      required: true,
      group: "Victim Details",
    },
    {
      name: "victimFatherName",
      label: "Victim's Father/Husband Name",
      labelUrdu: "متاثرہ کے والد/شوہر کا نام",
      type: "text",
      required: true,
      group: "Victim Details",
    },
    {
      name: "victimCnic",
      label: "Victim's CNIC",
      labelUrdu: "متاثرہ کا شناختی کارڈ",
      type: "cnic",
      required: true,
      group: "Victim Details",
    },
    {
      name: "victimAddress",
      label: "Victim's Address",
      labelUrdu: "متاثرہ کا پتہ",
      type: "address",
      required: true,
      group: "Victim Details",
    },
    {
      name: "accusedName",
      label: "Accused's Name",
      labelUrdu: "ملزم کا نام",
      type: "text",
      required: true,
      group: "Accused Details",
    },
    {
      name: "accusedCnic",
      label: "Accused's CNIC",
      labelUrdu: "ملزم کا شناختی کارڈ",
      type: "cnic",
      required: false,
      group: "Accused Details",
    },
    {
      name: "accusedAddress",
      label: "Accused's Address",
      labelUrdu: "ملزم کا پتہ",
      type: "address",
      required: true,
      group: "Accused Details",
    },
    {
      name: "relationship",
      label: "Relationship with Accused",
      labelUrdu: "ملزم سے رشتہ",
      type: "select",
      required: true,
      options: [
        { value: "husband", label: "Husband", labelUrdu: "شوہر" },
        { value: "father_in_law", label: "Father-in-law", labelUrdu: "سسر" },
        { value: "mother_in_law", label: "Mother-in-law", labelUrdu: "ساس" },
        { value: "brother_in_law", label: "Brother-in-law", labelUrdu: "دیور/جیٹھ" },
        { value: "other_relative", label: "Other Relative", labelUrdu: "دیگر رشتہ دار" },
      ],
      group: "Relationship",
    },
    {
      name: "violenceType",
      label: "Type of Violence",
      labelUrdu: "تشدد کی قسم",
      type: "select",
      required: true,
      options: [
        { value: "physical", label: "Physical Violence", labelUrdu: "جسمانی تشدد" },
        { value: "emotional", label: "Emotional/Psychological", labelUrdu: "جذباتی/نفسیاتی تشدد" },
        { value: "economic", label: "Economic Abuse", labelUrdu: "معاشی استحصال" },
        { value: "stalking", label: "Stalking/Cybercrime", labelUrdu: "تعاقب/سائبر کرائم" },
        { value: "multiple", label: "Multiple Types", labelUrdu: "متعدد اقسام" },
      ],
      group: "Violence Details",
    },
    {
      name: "incidentDetails",
      label: "Incident Details",
      labelUrdu: "واقعے کی تفصیلات",
      type: "textarea",
      required: true,
      group: "Violence Details",
    },
    {
      name: "witnesses",
      label: "Witnesses (if any)",
      labelUrdu: "گواہان (اگر کوئی ہوں)",
      type: "textarea",
      required: false,
      group: "Violence Details",
    },
    {
      name: "reliefSought",
      label: "Relief Sought",
      labelUrdu: "مطلوبہ ریلیف",
      type: "select",
      required: true,
      options: [
        { value: "protection_order", label: "Protection Order", labelUrdu: "تحفظ کا حکم" },
        { value: "residence_order", label: "Residence Order", labelUrdu: "رہائش کا حکم" },
        { value: "monetary_relief", label: "Monetary Relief", labelUrdu: "مالی ریلیف" },
        { value: "all", label: "All of the Above", labelUrdu: "مذکورہ بالا سب" },
      ],
      group: "Relief",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a Domestic Violence Protection Application in {{language}}.

VICTIM:
- Name: {{victimName}}
- Father/Husband Name: {{victimFatherName}}
- CNIC: {{victimCnic}}
- Address: {{victimAddress}}

ACCUSED:
- Name: {{accusedName}}
- CNIC: {{accusedCnic}}
- Address: {{accusedAddress}}

RELATIONSHIP: {{relationship}}

VIOLENCE:
- Type: {{violenceType}}
- Incident Details: {{incidentDetails}}
- Witnesses: {{witnesses}}

RELIEF SOUGHT: {{reliefSought}}

Generate a complete Domestic Violence Protection Application under the Punjab Protection of Women Against Violence Act 2016 (or applicable provincial law).
Reference SectREFERENCE FORMAT - Follow this exact Pakistani legal format:

IN THE COURT OF PROTECTION OFFICER / FAMILY COURT AT [CITY]

APPLICATION NO. _______ OF 20___
(Under Sections 4, 5, 7 & 8, Prevention of Domestic Violence Act [Province])

Mst. [Applicant/Victim Name] D/o / W/o [Father Name], CNIC No. [CNIC], resident of [Address]
                                                    ...APPLICANT
VERSUS
[Respondent Name] S/o [Father Name], CNIC No. [CNIC], resident of [Address]
                                                    ...RESPONDENT (Abuser)

APPLICATION FOR PROTECTION ORDER / RESIDENCE ORDER

RESPECTFULLY SHEWETH:

1. That the Applicant is the [wife / mother / daughter] of the Respondent and is a victim of domestic violence.
2. That the Respondent has been subjecting the Applicant to [physical / psychological / economic / sexual] abuse since [Period].
3. That on [Date], the Respondent [Description of Specific Violent Incident].
4. That the Applicant fears for her safety and that of her minor children and requires immediate protection.
5. That the Applicant is entitled to protection under the Prevention of Domestic Violence Act.

It is therefore most respectfully prayed that this Honourable Court may be pleased to:
(a) Issue an immediate Protection Order restraining the Respondent from approaching the Applicant;
(b) Issue a Residence Order allowing the Applicant to remain in the matrimonial home;
(c) Direct the Respondent to pay maintenance to the Applicant;
(d) Take any other protective measures as deemed appropriate.

VERIFICATION:
Verified on oath at [City] that the contents are true and correct to the best of my knowledge.

Applicant:
Mst. [Name] D/o / W/o [Father Name]
CNIC: ___________

Advocate: ___________________

INSTRUCTIONS:
- Court heading: IN THE COURT OF FAMILY COURT AT [CITY] (centered, bold)
- Domestic Violence Act reference with Sections 4, 5, 7, 8
- Applicant (victim) vs Respondent (abuser)
- "RESPECTFULLY SHEWETH:" opening
- Numbered "That..." paragraphs with abuse description
- Prayer clause: protection order, residence order, maintenance
- Include VERIFICATION paragraph
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
