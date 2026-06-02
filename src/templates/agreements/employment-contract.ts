import { TemplateDefinition } from "../types";

export const employmentContract: TemplateDefinition = {
  category: "agreement",
  subType: "employment-contract",
  name: "Employment Contract",
  nameUrdu: "ملازمت کا معاہدہ",
  description: "Employment contract between employer and employee",
  descriptionUrdu: "ملازم اور آجر کے درمیان ملازمت کا معاہدہ",
  icon: "Briefcase",
  formFields: [
    {
      name: "employerName",
      label: "Employer / Company Representative Name",
      labelUrdu: "آجر / کمپنی کے نمائندے کا نام",
      type: "text",
      required: true,
      group: "Employer Details",
    },
    {
      name: "companyName",
      label: "Company / Organization Name",
      labelUrdu: "کمپنی / ادارے کا نام",
      type: "text",
      required: true,
      group: "Employer Details",
    },
    {
      name: "employerCnic",
      label: "Employer CNIC",
      labelUrdu: "آجر کا شناختی کارڈ",
      type: "cnic",
      required: true,
      group: "Employer Details",
    },
    {
      name: "companyAddress",
      label: "Company Address",
      labelUrdu: "کمپنی کا پتہ",
      type: "address",
      required: true,
      group: "Employer Details",
    },
    {
      name: "employeeName",
      label: "Employee Name",
      labelUrdu: "ملازم کا نام",
      type: "text",
      required: true,
      group: "Employee Details",
    },
    {
      name: "employeeFatherName",
      label: "Employee's Father's Name",
      labelUrdu: "ملازم کے والد کا نام",
      type: "text",
      required: true,
      group: "Employee Details",
    },
    {
      name: "employeeCnic",
      label: "Employee CNIC",
      labelUrdu: "ملازم کا شناختی کارڈ",
      type: "cnic",
      required: true,
      group: "Employee Details",
    },
    {
      name: "employeeAddress",
      label: "Employee Address",
      labelUrdu: "ملازم کا پتہ",
      type: "address",
      required: true,
      group: "Employee Details",
    },
    {
      name: "designation",
      label: "Designation / Job Title",
      labelUrdu: "عہدہ / ملازمت کا عنوان",
      type: "text",
      required: true,
      group: "Job Details",
    },
    {
      name: "department",
      label: "Department",
      labelUrdu: "شعبہ",
      type: "text",
      required: false,
      group: "Job Details",
    },
    {
      name: "salary",
      label: "Monthly Salary (PKR)",
      labelUrdu: "ماہانہ تنخواہ (روپے)",
      type: "number",
      required: true,
      group: "Job Details",
    },
    {
      name: "joiningDate",
      label: "Joining Date",
      labelUrdu: "ملازمت شروع ہونے کی تاریخ",
      type: "date",
      required: true,
      group: "Job Details",
    },
    {
      name: "probationPeriod",
      label: "Probation Period (months)",
      labelUrdu: "آزمائشی مدت (مہینے)",
      type: "number",
      required: false,
      group: "Job Details",
    },
    {
      name: "workingHours",
      label: "Working Hours (e.g., 9 AM - 5 PM)",
      labelUrdu: "کام کے اوقات",
      type: "text",
      required: false,
      group: "Job Details",
    },
    {
      name: "termsAndConditions",
      label: "Additional Terms & Conditions",
      labelUrdu: "اضافی شرائط و ضوابط",
      type: "textarea",
      required: false,
      aiSuggestable: true,
      group: "Terms",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate an Employment Contract in {{language}}.

EMPLOYER:
- Representative Name: {{employerName}}
- Company: {{companyName}}
- CNIC: {{employerCnic}}
- Address: {{companyAddress}}

EMPLOYEE:
- Name: {{employeeName}}
- Father's Name: {{employeeFatherName}}
- CNIC: {{employeeCnic}}
- Address: {{employeeAddress}}

JOB DETAILS:
- Designation: {{designation}}
- Department: {{department}}
- Monthly Salary: PKR {{salary}}
- Joining Date: {{joiningDate}}
- Probation Period: {{probationPeriod}} months
- Working Hours: {{workingHours}}

ADDITIONAL TERMS: {{termsAndConditions}}

REFERENCE FORMAT — Follow this exact Pakistani legal format:

EMPLOYMENT CONTRACT / LETTER OF APPOINTMENT

This Employment Contract is made and executed on this ___ day of ___________, 20___ at [City].

BETWEEN:

[Company Name], a company/firm registered at [Company Address], represented by [Employer Representative Name], CNIC No. [Employer CNIC]
(hereinafter called the "EMPLOYER")

AND

[Employee Name] S/o [Father Name], CNIC No. [Employee CNIC], resident of [Employee Address]
(hereinafter called the "EMPLOYEE")

WHEREAS the Employer desires to engage the services of the Employee, both parties hereby agree as under:

1. DESIGNATION: The Employee is hereby appointed as [Designation] in the [Department] Department.
2. COMMENCEMENT: The employment shall commence from [Joining Date].
3. PROBATION: The Employee shall be on probation for a period of [Probation Period] months, during which either party may terminate the employment with [notice period] days' notice.
4. SALARY: The Employee shall be paid a monthly salary of PKR [Salary]/- ([Amount in words] only) payable on or before the [__] day of each month.
5. WORKING HOURS: The Employee shall work from [Working Hours], Monday to Saturday (or as applicable).
6. LEAVE ENTITLEMENT: The Employee shall be entitled to leaves as per company policy and applicable labor laws.
7. DUTIES: The Employee shall faithfully perform all duties assigned by the Employer and shall not engage in any other business or employment without prior written consent.
8. CONFIDENTIALITY: The Employee shall keep all proprietary information, trade secrets, and business information strictly confidential during and after employment.
9. TERMINATION: Either party may terminate this contract by giving [notice period] months' written notice. The Employer may terminate immediately for cause or misconduct.
10. GOVERNING LAW: This contract shall be governed by the laws of Pakistan and applicable labor legislation.

EMPLOYER                                  EMPLOYEE
[Company Name]                            [Employee Name]
[Employer Representative]                 CNIC: ___________
CNIC: ___________

Date: _______________

INSTRUCTIONS:
- Title: EMPLOYMENT CONTRACT (centered, bold)
- BETWEEN / AND party structure (Company and Employee)
- WHEREAS clause
- Numbered sections: DESIGNATION, SALARY, HOURS, LEAVE, DUTIES, CONFIDENTIALITY, TERMINATION
- Both signatures at bottom
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
