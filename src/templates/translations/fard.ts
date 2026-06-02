import { TranslationTemplate } from "./types";

export const fardTranslation: TranslationTemplate = {
  id: "fard",
  name: "Fard (Property Record / Jamabandi)",
  nameUrdu: "فرد جمع بندی",
  description: "Urdu to English translation of Patwari Form XXXIV-A — Register Haqdaran Land",
  icon: "ScrollText",

  extractionPrompt: `You are a Pakistani legal document translator. Extract all fields from this Fard / Jamabandi (Patwari Form XXXIV-A property record) and return them as a JSON object.

Extract these fields (use empty string if not found):
{
  "mohal": "Mohal / village / chak name",
  "tehsil": "Tehsil",
  "district": "District",
  "year": "Record year",
  "book_no": "Book number",
  "khewat_no": "Khewat number",
  "owner_name": "Owner full name",
  "owner_father": "Owner's father/husband name",
  "owner_caste": "Owner's caste",
  "owner_cnic": "Owner's CNIC number",
  "owner_address": "Owner's residential address",
  "khatooni_no": "Khatooni number",
  "intaqal_no": "Intaqal number",
  "intaqal_date": "Intaqal date",
  "khasra_details": "Khasra numbers with details",
  "land_area": "Land area (e.g. 2 Kanal 5 Marla)",
  "land_area_words": "Land area in words",
  "land_type": "Type of land (agricultural/urban/etc.)",
  "share": "Owner's share (e.g. 9000/258075)",
  "irrigation": "Source of irrigation",
  "remarks": "Any additional remarks or notes"
}

Return ONLY the JSON object, no other text.`,

  buildHtml: (f) => `
<div style="font-family:'Times New Roman',serif;font-size:12pt;line-height:1.8;color:#000;max-width:750px;margin:0 auto;">

  <div style="text-align:center;margin-bottom:15px;">
    <p style="margin:0;font-size:11pt;font-style:italic;">True Translation — Urdu to English</p>
    <h1 style="margin:5px 0;font-size:15pt;font-weight:bold;text-decoration:underline;">REGISTER HAQDARAN LAND</h1>
    <p style="margin:2px 0;font-size:12pt;font-weight:bold;">Patwari Form No. XXXIV-A</p>
    <p style="margin:2px 0;">Missal Periodically DLR</p>
  </div>

  <table style="width:100%;border-collapse:collapse;border:1px solid #000;margin-bottom:15px;">
    <tr>
      <td style="padding:5px 10px;border:1px solid #000;font-weight:bold;width:25%;">Mohal:</td>
      <td style="padding:5px 10px;border:1px solid #000;"><strong>${f.mohal || "_______________"}</strong></td>
      <td style="padding:5px 10px;border:1px solid #000;font-weight:bold;width:20%;">Tehsil:</td>
      <td style="padding:5px 10px;border:1px solid #000;">${f.tehsil || "_______________"}</td>
    </tr>
    <tr>
      <td style="padding:5px 10px;border:1px solid #000;font-weight:bold;">District:</td>
      <td style="padding:5px 10px;border:1px solid #000;">${f.district || "_______________"}</td>
      <td style="padding:5px 10px;border:1px solid #000;font-weight:bold;">Year:</td>
      <td style="padding:5px 10px;border:1px solid #000;">${f.year || "_______________"}</td>
    </tr>
    ${f.book_no ? `<tr>
      <td style="padding:5px 10px;border:1px solid #000;font-weight:bold;">Book No.:</td>
      <td style="padding:5px 10px;border:1px solid #000;" colspan="3">${f.book_no}</td>
    </tr>` : ""}
  </table>

  <h3 style="text-align:center;text-decoration:underline;margin:10px 0;">OWNERSHIP DETAILS</h3>

  <table style="width:100%;border-collapse:collapse;border:1px solid #000;margin-bottom:15px;">
    <thead>
      <tr style="background:#e8e8e8;">
        <th style="padding:6px 10px;border:1px solid #000;text-align:left;width:25%;">Field</th>
        <th style="padding:6px 10px;border:1px solid #000;text-align:left;">Details</th>
        <th style="padding:6px 10px;border:1px solid #000;text-align:left;width:25%;">Field</th>
        <th style="padding:6px 10px;border:1px solid #000;text-align:left;">Details</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="padding:5px 10px;border:1px solid #000;font-weight:bold;">Khewat No.:</td>
        <td style="padding:5px 10px;border:1px solid #000;">${f.khewat_no || "___"}</td>
        <td style="padding:5px 10px;border:1px solid #000;font-weight:bold;">Khatooni No.:</td>
        <td style="padding:5px 10px;border:1px solid #000;">${f.khatooni_no || "___"}</td>
      </tr>
      <tr>
        <td style="padding:5px 10px;border:1px solid #000;font-weight:bold;">Owner Name:</td>
        <td style="padding:5px 10px;border:1px solid #000;"><strong>${f.owner_name || "_______________"}</strong></td>
        <td style="padding:5px 10px;border:1px solid #000;font-weight:bold;">Father / Husband:</td>
        <td style="padding:5px 10px;border:1px solid #000;"><strong>${f.owner_father || "_______________"}</strong></td>
      </tr>
      <tr>
        <td style="padding:5px 10px;border:1px solid #000;font-weight:bold;">Caste:</td>
        <td style="padding:5px 10px;border:1px solid #000;">${f.owner_caste || "_______________"}</td>
        <td style="padding:5px 10px;border:1px solid #000;font-weight:bold;">CNIC No.:</td>
        <td style="padding:5px 10px;border:1px solid #000;"><strong>${f.owner_cnic || "_______________"}</strong></td>
      </tr>
      <tr>
        <td style="padding:5px 10px;border:1px solid #000;font-weight:bold;">Address:</td>
        <td style="padding:5px 10px;border:1px solid #000;" colspan="3"><strong>${f.owner_address || "_______________"}</strong></td>
      </tr>
      ${f.intaqal_no ? `<tr>
        <td style="padding:5px 10px;border:1px solid #000;font-weight:bold;">Intaqal No.:</td>
        <td style="padding:5px 10px;border:1px solid #000;">${f.intaqal_no}</td>
        <td style="padding:5px 10px;border:1px solid #000;font-weight:bold;">Intaqal Date:</td>
        <td style="padding:5px 10px;border:1px solid #000;">${f.intaqal_date || "___"}</td>
      </tr>` : ""}
    </tbody>
  </table>

  <h3 style="text-align:center;text-decoration:underline;margin:10px 0;">LAND DETAILS</h3>

  <table style="width:100%;border-collapse:collapse;border:1px solid #000;margin-bottom:15px;">
    <tr>
      <td style="padding:5px 10px;border:1px solid #000;font-weight:bold;width:30%;">Khasra Nos. / Details:</td>
      <td style="padding:5px 10px;border:1px solid #000;" colspan="3">${f.khasra_details || "_______________"}</td>
    </tr>
    <tr>
      <td style="padding:5px 10px;border:1px solid #000;font-weight:bold;">Land Area:</td>
      <td style="padding:5px 10px;border:1px solid #000;"><strong>${f.land_area || "_______________"}</strong></td>
      <td style="padding:5px 10px;border:1px solid #000;font-weight:bold;width:25%;">Land Area (Words):</td>
      <td style="padding:5px 10px;border:1px solid #000;">${f.land_area_words || "_______________"}</td>
    </tr>
    <tr>
      <td style="padding:5px 10px;border:1px solid #000;font-weight:bold;">Land Type:</td>
      <td style="padding:5px 10px;border:1px solid #000;">${f.land_type || "Agricultural"}</td>
      <td style="padding:5px 10px;border:1px solid #000;font-weight:bold;">Irrigation Source:</td>
      <td style="padding:5px 10px;border:1px solid #000;">${f.irrigation || "_______________"}</td>
    </tr>
    ${f.share ? `<tr>
      <td style="padding:5px 10px;border:1px solid #000;font-weight:bold;">Owner's Share:</td>
      <td style="padding:5px 10px;border:1px solid #000;" colspan="3">${f.share}</td>
    </tr>` : ""}
    ${f.remarks ? `<tr>
      <td style="padding:5px 10px;border:1px solid #000;font-weight:bold;">Remarks:</td>
      <td style="padding:5px 10px;border:1px solid #000;" colspan="3">${f.remarks}</td>
    </tr>` : ""}
  </table>

  <div style="margin-top:20px;text-align:center;">
    <p style="display:inline-block;border-top:1px solid #000;padding-top:5px;min-width:200px;">
      Signature / Stamp of Patwari
    </p>
  </div>

  <p style="font-size:9pt;text-align:center;margin-top:20px;color:#555;">
    True Translation — Urdu to English
  </p>
</div>`,
};
