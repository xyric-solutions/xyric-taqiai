import { TranslationTemplate } from "./types";

export const birthCertificateTranslation: TranslationTemplate = {
  id: "birth-certificate",
  name: "Birth Certificate (Form-B / NADRA)",
  nameUrdu: "پیدائش سرٹیفکیٹ",
  description: "Urdu to English translation of NADRA Certificate of Children Under 18 (Form-B)",
  icon: "Baby",

  extractionPrompt: `You are a Pakistani legal document translator. Extract all fields from this NADRA Birth Certificate / Certificate of Children Under Eighteen Years of Age and return them as a JSON object.

Extract these fields (use empty string if not found):
{
  "crc_no": "CRC Number",
  "form_no": "Form Number",
  "applicant_name": "Applicant (parent) full name",
  "applicant_cnic": "Applicant CNIC number",
  "children": [
    {
      "name": "Child full name",
      "father_name": "Father name",
      "father_cnic": "Father CNIC",
      "mother_name": "Mother name",
      "mother_cnic": "Mother CNIC",
      "gender": "MALE or FEMALE",
      "district": "District of birth",
      "dob": "Date of birth (YYYY-MM-DD)",
      "disability": "Disability or Nil",
      "cnic_no": "Child CNIC/registration number"
    }
  ],
  "total_children": "Number of children under 18",
  "issue_date": "Issue date",
  "address": "Family address"
}

Return ONLY the JSON object, no other text.`,

  buildHtml: (f) => {
    let children: Array<Record<string, string>> = [];
    try {
      children = JSON.parse(f.children || "[]");
    } catch {
      children = [];
    }

    const childRows = children.map((c, i) => `
      <tr style="background:${i % 2 === 0 ? "#fff" : "#f9f9f9"};">
        <td style="padding:5px 8px;border:1px solid #ccc;"><strong>${c.name || "___"}</strong></td>
        <td style="padding:5px 8px;border:1px solid #ccc;">${c.father_name || "___"}<br/><small>${c.father_cnic || ""}</small></td>
        <td style="padding:5px 8px;border:1px solid #ccc;">${c.mother_name || "___"}<br/><small>${c.mother_cnic || ""}</small></td>
        <td style="padding:5px 8px;border:1px solid #ccc;text-align:center;">${c.gender || "___"}</td>
        <td style="padding:5px 8px;border:1px solid #ccc;">${c.district || "___"}</td>
        <td style="padding:5px 8px;border:1px solid #ccc;text-align:center;">${c.dob || "___"}</td>
        <td style="padding:5px 8px;border:1px solid #ccc;text-align:center;">${c.disability || "Nil"}</td>
        <td style="padding:5px 8px;border:1px solid #ccc;"><strong>${c.cnic_no || "___"}</strong></td>
      </tr>`).join("");

    return `
<div style="font-family:'Times New Roman',serif;font-size:12pt;line-height:1.8;color:#000;max-width:750px;margin:0 auto;">

  <div style="text-align:center;margin-bottom:15px;">
    <p style="margin:0;font-weight:bold;font-size:12pt;">GOVERNMENT OF PAKISTAN</p>
    <p style="margin:2px 0;font-weight:bold;">NATIONAL DATABASE AND REGISTRATION AUTHORITY</p>
    <p style="margin:2px 0;">(MINISTRY OF INTERIOR)</p>
    <h1 style="margin:8px 0;font-size:15pt;font-weight:bold;text-decoration:underline;">
      CERTIFICATE OF CHILDREN UNDER EIGHTEEN YEARS OF AGE
    </h1>
    <table style="margin:5px auto;border-collapse:collapse;">
      <tr>
        <td style="padding:3px 15px;"><strong>CRC No.:</strong> ${f.crc_no || "_______________"}</td>
        <td style="padding:3px 15px;"><strong>Form No.:</strong> ${f.form_no || "_______________"}</td>
      </tr>
    </table>
  </div>

  <table style="width:100%;border-collapse:collapse;margin-bottom:10px;border:1px solid #000;">
    <tr style="background:#f0f0f0;">
      <td style="padding:5px 10px;border:1px solid #000;font-weight:bold;width:40%;">Applicant's Name:</td>
      <td style="padding:5px 10px;border:1px solid #000;"><strong>${f.applicant_name || "_______________"}</strong></td>
    </tr>
    <tr>
      <td style="padding:5px 10px;border:1px solid #000;font-weight:bold;">Applicant's CNIC No.:</td>
      <td style="padding:5px 10px;border:1px solid #000;"><strong>${f.applicant_cnic || "_______________"}</strong></td>
    </tr>
    ${f.address ? `<tr>
      <td style="padding:5px 10px;border:1px solid #000;font-weight:bold;">Address:</td>
      <td style="padding:5px 10px;border:1px solid #000;">${f.address}</td>
    </tr>` : ""}
  </table>

  <div style="overflow-x:auto;margin-bottom:15px;">
    <table style="width:100%;border-collapse:collapse;font-size:11pt;">
      <thead>
        <tr style="background:#ddd;">
          <th style="padding:6px 8px;border:1px solid #999;text-align:left;">Child's Name</th>
          <th style="padding:6px 8px;border:1px solid #999;text-align:left;">Father's Name / NIC</th>
          <th style="padding:6px 8px;border:1px solid #999;text-align:left;">Mother's Name / NIC</th>
          <th style="padding:6px 8px;border:1px solid #999;text-align:center;">Gender</th>
          <th style="padding:6px 8px;border:1px solid #999;text-align:left;">District &amp; Birth</th>
          <th style="padding:6px 8px;border:1px solid #999;text-align:center;">Date of Birth</th>
          <th style="padding:6px 8px;border:1px solid #999;text-align:center;">Disability</th>
          <th style="padding:6px 8px;border:1px solid #999;text-align:left;">NIC No.</th>
        </tr>
      </thead>
      <tbody>
        ${childRows || `<tr><td colspan="8" style="padding:10px;text-align:center;border:1px solid #ccc;">No children data extracted</td></tr>`}
      </tbody>
    </table>
  </div>

  <p style="margin:10px 0;">According to our record this family has aforementioned <strong>${f.total_children || "___"}</strong> child/children under eighteen years of age. Submit the application for obtaining the Identity Card as soon as a child attains age eighteen. Keep this certificate safe because as the children reach eighteen years of age the cards will be issued with reference to these numbers. Newborns must be promptly registered and a new registration certificate obtained. Obtain a new registration certificate in case there is any change in the particulars.</p>

  <div style="margin-top:25px;display:flex;justify-content:space-between;">
    <div>
      <p style="margin:0;">Signature of Registrar General</p>
      <p style="margin:3px 0;">_______________</p>
    </div>
    <div>
      <p style="margin:0;">Date of Issue: ${f.issue_date || "_______________"}</p>
    </div>
  </div>

  <p style="font-size:9pt;text-align:center;margin-top:20px;color:#555;">
    True Translation — Urdu to English
  </p>
</div>`;
  },
};
