import { TranslationTemplate } from "./types";

export const idCardTranslation: TranslationTemplate = {
  id: "id-card",
  name: "National Identity Card (CNIC)",
  nameUrdu: "شناختی کارڈ",
  description: "True English translation of NADRA National Identity Card — front and back",
  icon: "CreditCard",

  extractionPrompt: `You are a Pakistani legal document translator. Extract all fields from this National Identity Card (CNIC / Shnaakhti Card) and return them as a JSON object.

Extract these fields (use empty string if not found):
{
  "cnic_no": "14-digit CNIC number (e.g. 35201-5614992-0)",
  "name": "Card holder full name",
  "sex": "MALE or FEMALE",
  "father_name": "Father's name (or husband's name)",
  "id_mark": "Identification mark (or None)",
  "dob": "Date of birth",
  "family_no": "Family number on back",
  "present_address": "Present address",
  "permanent_address": "Permanent address (or 'Same' if same as present)",
  "issue_date": "Date of issue",
  "expiry_date": "Date of expiry"
}

Return ONLY the JSON object, no other text.`,

  buildHtml: (f) => `
<div style="font-family:'Times New Roman',serif;font-size:13pt;line-height:1.9;color:#000;max-width:650px;margin:0 auto;">

  <h1 style="text-align:center;font-size:15pt;font-weight:bold;text-decoration:underline;margin-bottom:5px;">TRUE ENGLISH TRANSLATION OF</h1>
  <h2 style="text-align:center;font-size:14pt;font-weight:bold;margin:0 0 20px 0;">NATIONAL IDENTITY CARD</h2>

  <!-- Front Side -->
  <div style="border:2px solid #000;padding:15px;margin-bottom:20px;">
    <h3 style="text-align:center;margin:0 0 10px 0;font-size:13pt;border-bottom:1px solid #000;padding-bottom:5px;">FRONT SIDE</h3>
    <p style="text-align:center;font-weight:bold;margin:0;">GOVERNMENT OF PAKISTAN</p>
    <p style="text-align:center;margin:2px 0;">National Identity Card</p>
    <p style="text-align:center;font-size:14pt;font-weight:bold;margin:5px 0;letter-spacing:1px;">${f.cnic_no || "_______________"}</p>

    <table style="width:100%;border-collapse:collapse;margin-top:10px;">
      <tr>
        <td style="width:65%;padding:3px 5px;">
          <table style="width:100%;">
            <tr>
              <td style="width:45%;font-weight:bold;padding:3px 0;">Name:</td>
              <td><strong>${f.name || "_______________"}</strong></td>
            </tr>
            <tr>
              <td style="font-weight:bold;padding:3px 0;">Sex:</td>
              <td>${f.sex || "_______________"}</td>
            </tr>
            <tr>
              <td style="font-weight:bold;padding:3px 0;">Father Name:</td>
              <td><strong>${f.father_name || "_______________"}</strong></td>
            </tr>
            <tr>
              <td style="font-weight:bold;padding:3px 0;">Identification Mark:</td>
              <td>${f.id_mark || "None"}</td>
            </tr>
            <tr>
              <td style="font-weight:bold;padding:3px 0;">Date of Birth:</td>
              <td>${f.dob || "_______________"}</td>
            </tr>
          </table>
        </td>
        <td style="width:35%;vertical-align:top;text-align:center;padding:5px;">
          <div style="border:1px solid #999;width:90px;height:110px;margin:0 auto;display:flex;align-items:center;justify-content:center;font-size:9pt;color:#999;">
            Photograph<br/>of Card Holder
          </div>
          <div style="margin-top:8px;font-size:9pt;">
            <div style="border:1px solid #999;width:60px;height:30px;margin:0 auto;"></div>
            <p style="font-size:8pt;margin:2px 0;">Thumb Impression</p>
          </div>
        </td>
      </tr>
    </table>

    <div style="margin-top:15px;display:flex;justify-content:space-between;font-size:10pt;">
      <div>Signature Registrar General<br/>_______________</div>
      <div>Signature of Card Holder<br/>_______________</div>
    </div>
  </div>

  <!-- Back Side -->
  <div style="border:2px solid #000;padding:15px;">
    <h3 style="text-align:center;margin:0 0 10px 0;font-size:13pt;border-bottom:1px solid #000;padding-bottom:5px;">BACK SIDE</h3>
    <table style="width:100%;">
      <tr>
        <td style="font-weight:bold;width:45%;padding:4px 0;">Identification Number:</td>
        <td><strong>${f.cnic_no || "_______________"}</strong></td>
      </tr>
      ${f.family_no ? `<tr>
        <td style="font-weight:bold;padding:4px 0;">Family Number:</td>
        <td>${f.family_no}</td>
      </tr>` : ""}
      <tr>
        <td style="font-weight:bold;padding:4px 0;">Present Address:</td>
        <td><strong>${f.present_address || "_______________"}</strong></td>
      </tr>
      <tr>
        <td style="font-weight:bold;padding:4px 0;">Permanent Address:</td>
        <td><strong>${f.permanent_address || "Same"}</strong></td>
      </tr>
      <tr>
        <td style="font-weight:bold;padding:4px 0;">Date of Issue:</td>
        <td>${f.issue_date || "_______________"}</td>
      </tr>
      <tr>
        <td style="font-weight:bold;padding:4px 0;">Date of Expiry:</td>
        <td>${f.expiry_date || "_______________"}</td>
      </tr>
    </table>
    <p style="font-size:9pt;margin-top:10px;color:#555;">
      Drop the Lost Card in nearest Letter Box, if found.
    </p>
  </div>

  <p style="font-size:9pt;text-align:center;margin-top:20px;color:#555;">
    True Translation — Urdu to English
  </p>
</div>`,
};
