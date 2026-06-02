import { TranslationTemplate } from "./types";

export const divorceCertificateTranslation: TranslationTemplate = {
  id: "divorce-certificate",
  name: "Divorce Registration Certificate",
  nameUrdu: "طلاق سرٹیفکیٹ / خلع نامہ",
  description: "Urdu to English — CRMS Divorce / Khula Registration Certificate",
  icon: "FileX",

  extractionPrompt: `You are a Pakistani legal document expert. Extract all fields from this Divorce/Talaq/Khula Registration Certificate and return as JSON.

This document may be CRMS computerized (bilingual) or traditional Urdu format.
Read BOTH Urdu and English portions if present.

Extract these fields (use empty string if not found):
{
  "tracking_id": "Tracking ID / CRMS No",
  "office": "Union Council name",
  "mode_of_divorce": "Mode of divorce: Talaq / Khula / Mutual Consent / Mubarat / طلاق / خلع",
  "husband_name": "Husband full name",
  "husband_cnic": "Husband CNIC",
  "husband_father_name": "Husband father name",
  "husband_address": "Husband address",
  "husband_tehsil": "Husband tehsil",
  "husband_district": "Husband district",
  "wife_name": "Wife full name",
  "wife_cnic": "Wife CNIC",
  "wife_father_name": "Wife father name",
  "wife_address": "Wife address",
  "wife_tehsil": "Wife tehsil",
  "wife_district": "Wife district",
  "nikah_date": "Original marriage/nikah date",
  "divorce_date": "Date divorce was pronounced",
  "mehr_returned": "Mehr amount returned if mentioned",
  "iddat": "Iddat period if mentioned",
  "witnesses": "Witness names",
  "issue_date": "Certificate issue date"
}

Return ONLY the JSON object, no other text.`,

  buildHtml: (f) => `
<div style="font-family:'Times New Roman',serif;font-size:13pt;line-height:1.8;color:#000;max-width:700px;margin:0 auto;">

  <div style="text-align:center;border-bottom:3px double #000;padding-bottom:10px;margin-bottom:15px;">
    <p style="margin:0;font-size:11pt;font-weight:bold;">THE GOVERNMENT OF PUNJAB, PAKISTAN</p>
    <h1 style="margin:6px 0;font-size:16pt;font-weight:bold;text-decoration:underline;">DIVORCE REGISTRATION CERTIFICATE</h1>
    ${f.tracking_id ? `<p style="margin:2px 0;font-size:10pt;">Tracking ID / CRMS No.: <strong>${f.tracking_id}</strong></p>` : ""}
    ${f.office ? `<p style="margin:2px 0;font-size:10pt;">Office: ${f.office}</p>` : ""}
    ${f.mode_of_divorce ? `<p style="margin:4px 0;font-size:12pt;font-weight:bold;">Mode of Divorce: ${f.mode_of_divorce}</p>` : ""}
  </div>

  <table style="width:100%;border-collapse:collapse;margin-bottom:15px;">
    <tr>
      <td style="width:50%;vertical-align:top;padding-right:15px;border-right:2px solid #000;">
        <h3 style="text-align:center;text-decoration:underline;margin:0 0 8px 0;font-size:13pt;">HUSBAND'S DETAILS</h3>
        <table style="width:100%;font-size:12pt;line-height:1.9;">
          <tr><td style="width:45%;font-weight:bold;">Name:</td><td><strong>${f.husband_name || "_______________"}</strong></td></tr>
          <tr><td style="font-weight:bold;">Nationality:</td><td>PAKISTANI</td></tr>
          <tr><td style="font-weight:bold;">CNIC No:</td><td><strong>${f.husband_cnic || "_______________"}</strong></td></tr>
          <tr><td style="font-weight:bold;">Religion:</td><td>ISLAM</td></tr>
          <tr><td style="font-weight:bold;">Father's Name:</td><td><strong>${f.husband_father_name || "_______________"}</strong></td></tr>
          <tr><td style="font-weight:bold;">Address:</td><td><strong>${f.husband_address || "_______________"}</strong></td></tr>
          ${f.husband_tehsil ? `<tr><td style="font-weight:bold;">Tehsil:</td><td>${f.husband_tehsil}</td></tr>` : ""}
          ${f.husband_district ? `<tr><td style="font-weight:bold;">District:</td><td>${f.husband_district}</td></tr>` : ""}
        </table>
      </td>
      <td style="width:50%;vertical-align:top;padding-left:15px;">
        <h3 style="text-align:center;text-decoration:underline;margin:0 0 8px 0;font-size:13pt;">WIFE'S DETAILS</h3>
        <table style="width:100%;font-size:12pt;line-height:1.9;">
          <tr><td style="width:45%;font-weight:bold;">Name:</td><td><strong>${f.wife_name || "_______________"}</strong></td></tr>
          <tr><td style="font-weight:bold;">Nationality:</td><td>PAKISTANI</td></tr>
          <tr><td style="font-weight:bold;">CNIC No:</td><td><strong>${f.wife_cnic || "_______________"}</strong></td></tr>
          <tr><td style="font-weight:bold;">Religion:</td><td>ISLAM</td></tr>
          <tr><td style="font-weight:bold;">Father's Name:</td><td><strong>${f.wife_father_name || "_______________"}</strong></td></tr>
          <tr><td style="font-weight:bold;">Address:</td><td><strong>${f.wife_address || "_______________"}</strong></td></tr>
          ${f.wife_tehsil ? `<tr><td style="font-weight:bold;">Tehsil:</td><td>${f.wife_tehsil}</td></tr>` : ""}
          ${f.wife_district ? `<tr><td style="font-weight:bold;">District:</td><td>${f.wife_district}</td></tr>` : ""}
        </table>
      </td>
    </tr>
  </table>

  <table style="width:100%;border-collapse:collapse;border:1px solid #000;margin-bottom:15px;">
    ${f.nikah_date ? `<tr style="background:#f5f5f5;">
      <td style="padding:6px 10px;border:1px solid #000;font-weight:bold;width:40%;">Original Nikah Date:</td>
      <td style="padding:6px 10px;border:1px solid #000;">${f.nikah_date}</td>
    </tr>` : ""}
    <tr>
      <td style="padding:6px 10px;border:1px solid #000;font-weight:bold;">Divorce Date:</td>
      <td style="padding:6px 10px;border:1px solid #000;"><strong>${f.divorce_date || "_______________"}</strong></td>
    </tr>
    <tr>
      <td style="padding:6px 10px;border:1px solid #000;font-weight:bold;">Mode of Divorce:</td>
      <td style="padding:6px 10px;border:1px solid #000;"><strong>${f.mode_of_divorce || "_______________"}</strong></td>
    </tr>
    ${f.mehr_returned ? `<tr>
      <td style="padding:6px 10px;border:1px solid #000;font-weight:bold;">Mehr Returned:</td>
      <td style="padding:6px 10px;border:1px solid #000;">${f.mehr_returned}</td>
    </tr>` : ""}
    ${f.iddat ? `<tr>
      <td style="padding:6px 10px;border:1px solid #000;font-weight:bold;">Iddat Period:</td>
      <td style="padding:6px 10px;border:1px solid #000;">${f.iddat}</td>
    </tr>` : ""}
    ${f.witnesses ? `<tr>
      <td style="padding:6px 10px;border:1px solid #000;font-weight:bold;">Witnesses:</td>
      <td style="padding:6px 10px;border:1px solid #000;">${f.witnesses}</td>
    </tr>` : ""}
    <tr>
      <td style="padding:6px 10px;border:1px solid #000;font-weight:bold;">Issue Date:</td>
      <td style="padding:6px 10px;border:1px solid #000;">${f.issue_date || "_______________"}</td>
    </tr>
  </table>

  <div style="margin-top:30px;display:flex;justify-content:space-between;">
    <div style="text-align:center;width:45%;">
      <div style="border-top:1px solid #000;padding-top:5px;">Signature of Husband</div>
    </div>
    <div style="text-align:center;width:45%;">
      <div style="border-top:1px solid #000;padding-top:5px;">Secretary Union Council</div>
    </div>
  </div>

  <p style="font-size:9pt;text-align:center;margin-top:20px;color:#555;">
    True Translation — Urdu to English
  </p>
</div>`,
};
