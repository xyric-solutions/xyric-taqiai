import { TranslationTemplate } from "./types";

export const nikahNamaTranslation: TranslationTemplate = {
  id: "nikah-nama",
  name: "Nikah Nama (Marriage Certificate)",
  nameUrdu: "نکاح نامہ / شادی سرٹیفکیٹ",
  description: "Urdu to English — CRMS computerized OR traditional handwritten Nikah Nama",
  icon: "Heart",

  extractionPrompt: `You are a Pakistani legal document expert. Extract all fields from this Nikah Nama / Marriage Registration Certificate document.

This document may be one of two types:
TYPE A — CRMS Computerized (bilingual: half English + half Urdu in two columns)
TYPE B — Traditional handwritten/printed Nikah Nama (all in Urdu/Arabic script)

For BOTH types, extract the same fields and return as JSON. Read BOTH Urdu and English portions.

Extract these fields (use empty string if not found):
{
  "doc_type": "CRMS Certificate OR Traditional Nikah Nama",
  "tracking_id": "Tracking ID / CRMS No / Form No / رجسٹریشن نمبر",
  "office": "Union Council name and number / یونین کونسل",
  "groom_name": "Groom full name (English) — from either language portion",
  "groom_cnic": "Groom CNIC number",
  "groom_age": "Groom age in years",
  "groom_marital_status": "UNMARRIED / MARRIED / WIDOWER / یا اردو سے ترجمہ",
  "groom_father_name": "Groom father name",
  "groom_father_cnic": "Groom father CNIC if available",
  "groom_address": "Groom full address",
  "groom_tehsil": "Groom tehsil",
  "groom_district": "Groom district",
  "bride_name": "Bride full name",
  "bride_cnic": "Bride CNIC number",
  "bride_age": "Bride age in years",
  "bride_marital_status": "UNMARRIED / MARRIED / DIVORCED / WIDOW",
  "bride_father_name": "Bride father name",
  "bride_father_cnic": "Bride father CNIC if available",
  "bride_address": "Bride full address",
  "bride_tehsil": "Bride tehsil",
  "bride_district": "Bride district",
  "marriage_date": "Date of marriage",
  "solemnized_by": "Nikah Registrar / Qazi / Maulvi name",
  "mehr": "Mehr amount (حق مہر) if mentioned",
  "witnesses": "Names of witnesses (گواہان) if mentioned",
  "issue_date": "Date of certificate issue"
}

For traditional Nikah Nama: translate Urdu field values to English in your extraction.
Return ONLY the JSON object, no other text.`,

  buildHtml: (f) => `
<div style="font-family:'Times New Roman',serif;font-size:13pt;line-height:1.8;color:#000;max-width:700px;margin:0 auto;">

  <div style="text-align:center;border-bottom:3px double #000;padding-bottom:10px;margin-bottom:15px;">
    <p style="margin:0;font-size:11pt;font-weight:bold;">THE GOVERNMENT OF PUNJAB, PAKISTAN</p>
    <h1 style="margin:6px 0;font-size:16pt;font-weight:bold;text-decoration:underline;">MARRIAGE REGISTRATION CERTIFICATE</h1>
    ${f.tracking_id ? `<p style="margin:2px 0;font-size:10pt;">Tracking ID / CRMS No.: <strong>${f.tracking_id}</strong></p>` : ""}
    ${f.office ? `<p style="margin:2px 0;font-size:10pt;">Office: ${f.office}</p>` : ""}
  </div>

  <table style="width:100%;border-collapse:collapse;margin-bottom:15px;">
    <tr>
      <td style="width:50%;vertical-align:top;padding-right:15px;border-right:2px solid #000;">
        <h3 style="text-align:center;text-decoration:underline;margin:0 0 8px 0;font-size:13pt;">PARTICULARS OF GROOM</h3>
        <table style="width:100%;font-size:12pt;line-height:1.9;">
          <tr><td style="width:45%;font-weight:bold;">Name:</td><td><strong>${f.groom_name || "_______________"}</strong></td></tr>
          <tr><td style="font-weight:bold;">Nationality:</td><td>PAKISTANI</td></tr>
          <tr><td style="font-weight:bold;">CNIC No:</td><td><strong>${f.groom_cnic || "_______________"}</strong></td></tr>
          <tr><td style="font-weight:bold;">Religion:</td><td>ISLAM</td></tr>
          <tr><td style="font-weight:bold;">Age:</td><td>${f.groom_age || "___"} Year(s)</td></tr>
          <tr><td style="font-weight:bold;">Marital Status:</td><td>${f.groom_marital_status || "UNMARRIED"}</td></tr>
          <tr><td style="font-weight:bold;">Father's Name:</td><td><strong>${f.groom_father_name || "_______________"}</strong></td></tr>
          ${f.groom_father_cnic ? `<tr><td style="font-weight:bold;">Father CNIC:</td><td><strong>${f.groom_father_cnic}</strong></td></tr>` : ""}
          <tr><td style="font-weight:bold;">Address:</td><td><strong>${f.groom_address || "_______________"}</strong></td></tr>
          ${f.groom_tehsil ? `<tr><td style="font-weight:bold;">Tehsil:</td><td>${f.groom_tehsil}</td></tr>` : ""}
          ${f.groom_district ? `<tr><td style="font-weight:bold;">District:</td><td>${f.groom_district}</td></tr>` : ""}
        </table>
      </td>
      <td style="width:50%;vertical-align:top;padding-left:15px;">
        <h3 style="text-align:center;text-decoration:underline;margin:0 0 8px 0;font-size:13pt;">PARTICULARS OF BRIDE</h3>
        <table style="width:100%;font-size:12pt;line-height:1.9;">
          <tr><td style="width:45%;font-weight:bold;">Name:</td><td><strong>${f.bride_name || "_______________"}</strong></td></tr>
          <tr><td style="font-weight:bold;">Nationality:</td><td>PAKISTANI</td></tr>
          <tr><td style="font-weight:bold;">CNIC No:</td><td><strong>${f.bride_cnic || "_______________"}</strong></td></tr>
          <tr><td style="font-weight:bold;">Religion:</td><td>ISLAM</td></tr>
          <tr><td style="font-weight:bold;">Age:</td><td>${f.bride_age || "___"} Year(s)</td></tr>
          <tr><td style="font-weight:bold;">Marital Status:</td><td>${f.bride_marital_status || "UNMARRIED"}</td></tr>
          <tr><td style="font-weight:bold;">Father's Name:</td><td><strong>${f.bride_father_name || "_______________"}</strong></td></tr>
          ${f.bride_father_cnic ? `<tr><td style="font-weight:bold;">Father CNIC:</td><td><strong>${f.bride_father_cnic}</strong></td></tr>` : ""}
          <tr><td style="font-weight:bold;">Address:</td><td><strong>${f.bride_address || "_______________"}</strong></td></tr>
          ${f.bride_tehsil ? `<tr><td style="font-weight:bold;">Tehsil:</td><td>${f.bride_tehsil}</td></tr>` : ""}
          ${f.bride_district ? `<tr><td style="font-weight:bold;">District:</td><td>${f.bride_district}</td></tr>` : ""}
        </table>
      </td>
    </tr>
  </table>

  <table style="width:100%;border-collapse:collapse;border:1px solid #000;margin-bottom:15px;">
    <tr style="background:#f5f5f5;">
      <td style="padding:6px 10px;border:1px solid #000;font-weight:bold;width:40%;">Marriage Date:</td>
      <td style="padding:6px 10px;border:1px solid #000;"><strong>${f.marriage_date || "_______________"}</strong></td>
    </tr>
    ${f.solemnized_by ? `<tr>
      <td style="padding:6px 10px;border:1px solid #000;font-weight:bold;">Solemnized / Registered By:</td>
      <td style="padding:6px 10px;border:1px solid #000;">${f.solemnized_by}</td>
    </tr>` : ""}
    ${f.mehr ? `<tr>
      <td style="padding:6px 10px;border:1px solid #000;font-weight:bold;">Mehr (Dower):</td>
      <td style="padding:6px 10px;border:1px solid #000;"><strong>${f.mehr}</strong></td>
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
      <div style="border-top:1px solid #000;padding-top:5px;">Signature of Groom</div>
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
