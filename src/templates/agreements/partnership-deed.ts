import { TemplateDefinition } from "../types";

export const partnershipDeed: TemplateDefinition = {
  category: "agreement",
  subType: "partnership-deed",
  name: "Partnership Deed",
  nameUrdu: "شراکت نامہ",
  description: "Partnership agreement between business partners",
  descriptionUrdu: "کاروباری شراکت داروں کے درمیان معاہدہ",
  icon: "Handshake",
  formFields: [
    {
      name: "partner1Name",
      label: "Partner 1 Name",
      labelUrdu: "شراکت دار 1 کا نام",
      type: "text",
      required: true,
      group: "Partner 1",
    },
    {
      name: "partner1Cnic",
      label: "Partner 1 CNIC",
      labelUrdu: "شراکت دار 1 کا شناختی کارڈ",
      type: "cnic",
      required: true,
      group: "Partner 1",
    },
    {
      name: "partner1Share",
      label: "Partner 1 Share (%)",
      labelUrdu: "شراکت دار 1 کا حصہ (%)",
      type: "number",
      required: true,
      group: "Partner 1",
    },
    {
      name: "partner2Name",
      label: "Partner 2 Name",
      labelUrdu: "شراکت دار 2 کا نام",
      type: "text",
      required: true,
      group: "Partner 2",
    },
    {
      name: "partner2Cnic",
      label: "Partner 2 CNIC",
      labelUrdu: "شراکت دار 2 کا شناختی کارڈ",
      type: "cnic",
      required: true,
      group: "Partner 2",
    },
    {
      name: "partner2Share",
      label: "Partner 2 Share (%)",
      labelUrdu: "شراکت دار 2 کا حصہ (%)",
      type: "number",
      required: true,
      group: "Partner 2",
    },
    {
      name: "firmName",
      label: "Firm/Business Name",
      labelUrdu: "فرم/کاروبار کا نام",
      type: "text",
      required: true,
      group: "Business Details",
    },
    {
      name: "businessNature",
      label: "Nature of Business",
      labelUrdu: "کاروبار کی نوعیت",
      type: "text",
      required: true,
      group: "Business Details",
    },
    {
      name: "businessAddress",
      label: "Business Address",
      labelUrdu: "کاروبار کا پتہ",
      type: "address",
      required: true,
      group: "Business Details",
    },
    {
      name: "capitalAmount",
      label: "Total Capital (PKR)",
      labelUrdu: "کل سرمایہ (روپے)",
      type: "number",
      required: true,
      group: "Financial",
    },
    {
      name: "additionalTerms",
      label: "Additional Terms",
      labelUrdu: "اضافی شرائط",
      type: "textarea",
      required: false,
      aiSuggestable: true,
      group: "Terms",
    },
  ],
  promptTemplate: `You are a Pakistani legal document drafting assistant. Generate a Partnership Deed in {{language}}.

PARTNER 1:
- Name: {{partner1Name}}
- CNIC: {{partner1Cnic}}
- Share: {{partner1Share}}%

PARTNER 2:
- Name: {{partner2Name}}
- CNIC: {{partner2Cnic}}
- Share: {{partner2Share}}%

BUSINESS:
- Firm Name: {{firmName}}
- Nature: {{businessNature}}
- Address: {{businessAddress}}
- Total Capital: PKR {{capitalAmount}}

ADDITIONAL TERMS: {{additionalTerms}}

REFERENCE FORMAT — Follow this exact Pakistani legal format:

PARTNERSHIP DEED

This Deed of Partnership is executed at [City] this ___ day of ___________, 20___ by and between the following:

First Partner: [Partner1 Name] S/o [Father Name], CNIC: [CNIC]
Second Partner: [Partner2 Name] S/o [Father Name], CNIC: [CNIC]

WHEREAS the above mentioned partners have mutually agreed to start a business under the name of "[Firm Name]" situated at [Business Address]. Therefore this deed is witnessed as under:

1. Name and Place: The name and style of the firm shall be M/S "[Firm Name]" with office situated at [Business Address]. Branches may be opened or closed at other places as deemed fit by the parties.
2. The Business: That the business of the firm shall be [Nature of Business] and any such other allied business as the parties may decide to conduct.
3. Capital: That the initial capital of investment shall be PKR [Capital Amount]/- ([Amount in words] only) as per books of account.
4. Profit and Loss: That irrespective of capital investment, the parties shall share profit or loss as follows:
   [Partner1 Name]: [Share1]%     [Partner2 Name]: [Share2]%
5. Accounts: That the firm shall maintain regular books of account. On 30th June every year, the statement of profit and loss shall be drawn up and adjusted into each partner's account per ratio of this deed.
6. Bank: That the bank account(s) shall be operated by both partners jointly or as deemed convenient.
7. Liabilities: That each party shall bear his/her own income tax and personal liabilities.
8. Dispute: That any dispute regarding partnership shall be settled mutually or referred to arbitration according to law.
9. Duration: That this partnership is at will and any partner desirous of dissolution shall give two months' written notice.
10. That all provisions of the Partnership Act 1932 not herein contained shall apply.

In witness whereof, parties set their respective hands in the presence of witnesses.

First Partner: [Partner1 Name]          Second Partner: [Partner2 Name]
CNIC: ___________                       CNIC: ___________
Signature: _________________________    Signature: _________________________

Witness 1: ___________________     Witness 2: ___________________

INSTRUCTIONS:
- Title: PARTNERSHIP DEED (centered, bold)
- WHEREAS clause for mutual agreement
- Numbered clauses for each term
- Profit/Loss ratio table
- Both partners' signature blocks
- Output as clean HTML. If language is Urdu, use Urdu script with dir="rtl"
- Wrap Name, Father's Name, CNIC, and Address values in <strong> tags (applies to both Urdu and English)
- Do NOT include markdown - only valid HTML tags`,
};
