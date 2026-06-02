import { TranslationTemplate } from "./types";

export const nikahNamaTraditionalTranslation: TranslationTemplate = {
  id: "nikah-nama-traditional",
  name: "Nikah Nama (Traditional / Handwritten)",
  nameUrdu: "نکاح نامہ (پرانا / ہاتھ سے لکھا)",
  description: "Urdu to English — Traditional Nikah Nama, FORM NO. 2, Muslim Family Laws Ordinance 1961",
  icon: "ScrollText",

  extractionPrompt: `You are a Pakistani legal document expert. This is a traditional/handwritten Nikah Nama — FORM NO. 2 under Muslim Family Laws Ordinance, 1961.

Extract ALL visible fields carefully. Translate Urdu values to English. Use empty string if not visible.

Return ONLY this JSON:
{
  "ward_uc": "Name of ward, Union Council name and number (e.g. Ward 54 Town / Union Council Peer Maki)",
  "tehsil": "Tehsil or Thana name",
  "district": "District name (where marriage took place)",

  "groom_name": "Bridegroom full name",
  "groom_father": "Bridegroom's father name",
  "groom_address": "Bridegroom's residence/address",
  "groom_dob": "Age or Date of Birth of bridegroom",

  "bride_name": "Bride full name",
  "bride_father": "Bride's father name",
  "bride_address": "Bride's residence/address",
  "bride_cnic": "Bride's CNIC number if visible",
  "bride_marital_status": "Whether bride is Maiden / Widow / Divorcee",
  "bride_children": "If widow or divorcee — names and number of children, else empty",
  "bride_dob": "Age or Date of Birth of bride",

  "bride_vakeel_name": "Name of lawyer/vakeel appointed by bride",
  "bride_vakeel_father": "Bride's vakeel father name",
  "bride_vakeel_address": "Bride's vakeel address",
  "bride_vakeel_witnesses": "Names, fathers, residences of witnesses to bride's vakeel appointment",

  "groom_vakeel_name": "Name of lawyer/vakeel appointed by bridegroom if any",
  "groom_vakeel_father": "Groom's vakeel father name if any",
  "groom_vakeel_address": "Groom's vakeel address if any",
  "groom_vakeel_witnesses": "Names, fathers, residences of witnesses to groom's vakeel appointment",

  "marriage_witnesses": "Names, fathers, residences of witnesses to the marriage (usually 2 witnesses listed as 1) and 2))",

  "marriage_date": "Date on which the marriage was contracted",
  "mehr_total": "Total amount of Dower (Rs)",
  "mehr_prompt": "Mahar Moajjal — prompt/immediate mehr amount",
  "mehr_deferred": "Mahar Ghair Moajjal — deferred mehr amount",
  "mehr_paid_at_time": "Whether any portion of dower was paid at time of marriage and how much",
  "mehr_property": "Whether any property was given in lieu of dower — description and valuation",

  "special_conditions": "Special conditions if any",
  "divorce_delegation": "Whether husband delegated power of divorce to wife, and under what conditions",
  "divorce_restricted": "Whether husband's right of divorce is in any way restricted/corralled",
  "dower_document": "Whether any document was drawn up at time of marriage relating to dower/maintenance",

  "existing_wife": "Whether bridegroom has existing wife and Arbitration Council permission status",
  "arbitration_ref": "Number and date of Arbitration Council communication/permission",
  "existing_wife_children": "Children from existing/previous marriage if mentioned",

  "solemnized_by": "Name and address of person who solemnized the marriage and his father",
  "registration_date": "Date of registration of marriage",
  "registration_fee": "Registration fee paid",
  "serial_no": "Serial number or register number"
}

Return ONLY the JSON object, no other text.`,

  buildHtml: (f) => `
<div style="font-family:'Times New Roman',serif;font-size:12pt;line-height:1.8;color:#000;max-width:750px;margin:0 auto;">

  <!-- Header -->
  <div style="text-align:center;margin-bottom:14px;border-bottom:3px double #000;padding-bottom:10px;">
    <p style="margin:0 0 2px 0;font-size:11pt;font-weight:bold;letter-spacing:1px;">TRUE ENGLISH TRANSLATION OF MARRIAGE DEED</p>
    <p style="margin:0 0 2px 0;font-size:11pt;font-weight:bold;">FORM NO. 2</p>
    <p style="margin:0 0 4px 0;font-size:10pt;">(SEE RULES NO. 8, 10)</p>
    <p style="margin:0;font-size:10pt;font-style:italic;">Prescribed according to the Rule No. 8 and 10 of the Muslim Family Laws Ordinance, 1961, (VIII of 1961).</p>
    <h2 style="margin:6px 0 0 0;font-size:15pt;font-weight:bold;text-decoration:underline;letter-spacing:2px;">MARRIAGE DEED</h2>
  </div>

  <!-- Numbered Form Table -->
  <table style="width:100%;border-collapse:collapse;border:1px solid #000;">
    <colgroup>
      <col style="width:5%"/>
      <col style="width:50%"/>
      <col style="width:45%"/>
    </colgroup>
    <thead>
      <tr style="background:#e8e8e8;">
        <th style="padding:5px 8px;border:1px solid #000;text-align:center;font-size:11pt;">No.</th>
        <th style="padding:5px 8px;border:1px solid #000;text-align:center;font-size:11pt;">Particulars</th>
        <th style="padding:5px 8px;border:1px solid #000;text-align:center;font-size:11pt;">Details</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="padding:6px 8px;border:1px solid #000;text-align:center;vertical-align:top;font-weight:bold;">1</td>
        <td style="padding:6px 8px;border:1px solid #000;vertical-align:top;">Name of ward / Union Council / Tehsil / Thana / District in which the marriage took place.</td>
        <td style="padding:6px 8px;border:1px solid #000;vertical-align:top;">
          ${f.ward_uc ? `<strong>${f.ward_uc}</strong><br/>` : ""}
          ${f.tehsil ? `Tehsil / Thana: <strong>${f.tehsil}</strong><br/>` : ""}
          ${f.district ? `District: <strong>${f.district}</strong>` : ""}
          ${!f.ward_uc && !f.tehsil && !f.district ? "_______________" : ""}
        </td>
      </tr>
      <tr style="background:#fafafa;">
        <td style="padding:6px 8px;border:1px solid #000;text-align:center;vertical-align:top;font-weight:bold;">2</td>
        <td style="padding:6px 8px;border:1px solid #000;vertical-align:top;">Name of bridegroom and his father with their respective residence.</td>
        <td style="padding:6px 8px;border:1px solid #000;vertical-align:top;">
          ${f.groom_name ? `<strong>${f.groom_name}</strong>` : "_______________"}
          ${f.groom_father ? ` S/o ${f.groom_father}` : ""}
          ${f.groom_address ? ` R/o ${f.groom_address}` : ""}
        </td>
      </tr>
      <tr>
        <td style="padding:6px 8px;border:1px solid #000;text-align:center;vertical-align:top;font-weight:bold;">3</td>
        <td style="padding:6px 8px;border:1px solid #000;vertical-align:top;">Age of bridegroom or Date of Birth.</td>
        <td style="padding:6px 8px;border:1px solid #000;vertical-align:top;"><strong>${f.groom_dob || "_______________"}</strong></td>
      </tr>
      <tr style="background:#fafafa;">
        <td style="padding:6px 8px;border:1px solid #000;text-align:center;vertical-align:top;font-weight:bold;">4</td>
        <td style="padding:6px 8px;border:1px solid #000;vertical-align:top;">Names of the bride and her father, with their respective residence.</td>
        <td style="padding:6px 8px;border:1px solid #000;vertical-align:top;">
          ${f.bride_name ? `<strong>${f.bride_name}</strong>` : "_______________"}
          ${f.bride_father ? ` D/o ${f.bride_father}` : ""}
          ${f.bride_address ? ` R/o ${f.bride_address}` : ""}
          ${f.bride_cnic ? `<br/>${f.bride_cnic}` : ""}
        </td>
      </tr>
      <tr>
        <td style="padding:6px 8px;border:1px solid #000;text-align:center;vertical-align:top;font-weight:bold;">5</td>
        <td style="padding:6px 8px;border:1px solid #000;vertical-align:top;">Whether the bride is a maiden, a widow or a divorcee.</td>
        <td style="padding:6px 8px;border:1px solid #000;vertical-align:top;"><strong>${f.bride_marital_status || "Maiden"}</strong></td>
      </tr>
      <tr style="background:#fafafa;">
        <td style="padding:6px 8px;border:1px solid #000;text-align:center;vertical-align:top;font-weight:bold;">6</td>
        <td style="padding:6px 8px;border:1px solid #000;vertical-align:top;">Whether bride is Widow or Divorced and she have children then the name and number.</td>
        <td style="padding:6px 8px;border:1px solid #000;vertical-align:top;">${f.bride_children || "N/A"}</td>
      </tr>
      <tr>
        <td style="padding:6px 8px;border:1px solid #000;text-align:center;vertical-align:top;font-weight:bold;">7</td>
        <td style="padding:6px 8px;border:1px solid #000;vertical-align:top;">Age of the bride or Date of Birth.</td>
        <td style="padding:6px 8px;border:1px solid #000;vertical-align:top;"><strong>${f.bride_dob || "_______________"}</strong></td>
      </tr>
      <tr style="background:#fafafa;">
        <td style="padding:6px 8px;border:1px solid #000;text-align:center;vertical-align:top;font-weight:bold;">8</td>
        <td style="padding:6px 8px;border:1px solid #000;vertical-align:top;">Name of lawyer, if any appointed by the bride, his father's name and his residence.</td>
        <td style="padding:6px 8px;border:1px solid #000;vertical-align:top;">
          ${f.bride_vakeel_name
            ? `${f.bride_vakeel_name}${f.bride_vakeel_father ? ` S/o ${f.bride_vakeel_father}` : ""}${f.bride_vakeel_address ? ` R/o ${f.bride_vakeel_address}` : ""}`
            : "N/A"}
        </td>
      </tr>
      <tr>
        <td style="padding:6px 8px;border:1px solid #000;text-align:center;vertical-align:top;font-weight:bold;">9</td>
        <td style="padding:6px 8px;border:1px solid #000;vertical-align:top;">Name of the witnesses to the appointment of the bride's Lawyer, with their father's names, residences and their relationship with the bride.</td>
        <td style="padding:6px 8px;border:1px solid #000;vertical-align:top;">${f.bride_vakeel_witnesses || "N/A"}</td>
      </tr>
      <tr style="background:#fafafa;">
        <td style="padding:6px 8px;border:1px solid #000;text-align:center;vertical-align:top;font-weight:bold;">10</td>
        <td style="padding:6px 8px;border:1px solid #000;vertical-align:top;">Name of the Lawyer, if any appointed by the bridegroom, his father's name and his residence.</td>
        <td style="padding:6px 8px;border:1px solid #000;vertical-align:top;">
          ${f.groom_vakeel_name
            ? `${f.groom_vakeel_name}${f.groom_vakeel_father ? ` S/o ${f.groom_vakeel_father}` : ""}${f.groom_vakeel_address ? ` R/o ${f.groom_vakeel_address}` : ""}`
            : "N/A"}
        </td>
      </tr>
      <tr>
        <td style="padding:6px 8px;border:1px solid #000;text-align:center;vertical-align:top;font-weight:bold;">11</td>
        <td style="padding:6px 8px;border:1px solid #000;vertical-align:top;">Name of witnesses to the appointment of the bridegroom's Lawyer, with their father's names and their residence.</td>
        <td style="padding:6px 8px;border:1px solid #000;vertical-align:top;">${f.groom_vakeel_witnesses || "N/A"}</td>
      </tr>
      <tr style="background:#fafafa;">
        <td style="padding:6px 8px;border:1px solid #000;text-align:center;vertical-align:top;font-weight:bold;">12</td>
        <td style="padding:6px 8px;border:1px solid #000;vertical-align:top;">Name of the witnesses to the marriage, their father's names and their residences.</td>
        <td style="padding:6px 8px;border:1px solid #000;vertical-align:top;"><strong>${f.marriage_witnesses || "_______________"}</strong></td>
      </tr>
      <tr>
        <td style="padding:6px 8px;border:1px solid #000;text-align:center;vertical-align:top;font-weight:bold;">13</td>
        <td style="padding:6px 8px;border:1px solid #000;vertical-align:top;">Date on which the marriage was contracted.</td>
        <td style="padding:6px 8px;border:1px solid #000;vertical-align:top;"><strong>${f.marriage_date || "_______________"}</strong></td>
      </tr>
      <tr style="background:#fafafa;">
        <td style="padding:6px 8px;border:1px solid #000;text-align:center;vertical-align:top;font-weight:bold;">14</td>
        <td style="padding:6px 8px;border:1px solid #000;vertical-align:top;">Amount of Dower.</td>
        <td style="padding:6px 8px;border:1px solid #000;vertical-align:top;"><strong>${f.mehr_total || "_______________"}</strong></td>
      </tr>
      <tr>
        <td style="padding:6px 8px;border:1px solid #000;text-align:center;vertical-align:top;font-weight:bold;">15</td>
        <td style="padding:6px 8px;border:1px solid #000;vertical-align:top;">How much the amount of Mahar Moajjal and the amount of Mahar Ghair Moajjal.</td>
        <td style="padding:6px 8px;border:1px solid #000;vertical-align:top;">
          ${f.mehr_prompt ? `Prompt (Moajjal): <strong>${f.mehr_prompt}</strong><br/>` : ""}
          ${f.mehr_deferred ? `Deferred (Ghair Moajjal): <strong>${f.mehr_deferred}</strong>` : ""}
          ${!f.mehr_prompt && !f.mehr_deferred ? "_______________" : ""}
        </td>
      </tr>
      <tr style="background:#fafafa;">
        <td style="padding:6px 8px;border:1px solid #000;text-align:center;vertical-align:top;font-weight:bold;">16</td>
        <td style="padding:6px 8px;border:1px solid #000;vertical-align:top;">Whether any portion of the dower was paid at the time of marriage, if so, how much.</td>
        <td style="padding:6px 8px;border:1px solid #000;vertical-align:top;">${f.mehr_paid_at_time || "N/A"}</td>
      </tr>
      <tr>
        <td style="padding:6px 8px;border:1px solid #000;text-align:center;vertical-align:top;font-weight:bold;">17</td>
        <td style="padding:6px 8px;border:1px solid #000;vertical-align:top;">Whether any property was given, in lieu of the whole or portion of the dower with specification of the same and its valuation agreed to between the parties.</td>
        <td style="padding:6px 8px;border:1px solid #000;vertical-align:top;">${f.mehr_property || "N/A"}</td>
      </tr>
      <tr style="background:#fafafa;">
        <td style="padding:6px 8px;border:1px solid #000;text-align:center;vertical-align:top;font-weight:bold;">18</td>
        <td style="padding:6px 8px;border:1px solid #000;vertical-align:top;">Special conditions if any.</td>
        <td style="padding:6px 8px;border:1px solid #000;vertical-align:top;">${f.special_conditions || "Nill"}</td>
      </tr>
      <tr>
        <td style="padding:6px 8px;border:1px solid #000;text-align:center;vertical-align:top;font-weight:bold;">19</td>
        <td style="padding:6px 8px;border:1px solid #000;vertical-align:top;">Whether the husband has delegated the power of divorce to the wife. If so, under what conditions.</td>
        <td style="padding:6px 8px;border:1px solid #000;vertical-align:top;">${f.divorce_delegation || "No"}</td>
      </tr>
      <tr style="background:#fafafa;">
        <td style="padding:6px 8px;border:1px solid #000;text-align:center;vertical-align:top;font-weight:bold;">20</td>
        <td style="padding:6px 8px;border:1px solid #000;vertical-align:top;">Whether the husband's right of divorce is in any way restricted.</td>
        <td style="padding:6px 8px;border:1px solid #000;vertical-align:top;">${f.divorce_restricted || "No"}</td>
      </tr>
      <tr>
        <td style="padding:6px 8px;border:1px solid #000;text-align:center;vertical-align:top;font-weight:bold;">21</td>
        <td style="padding:6px 8px;border:1px solid #000;vertical-align:top;">Whether any document was drawn up at the time of marriage relating to dower, maintenance, etc. if so, contents thereof in brief.</td>
        <td style="padding:6px 8px;border:1px solid #000;vertical-align:top;">${f.dower_document || "Nill"}</td>
      </tr>
      <tr style="background:#fafafa;">
        <td style="padding:6px 8px;border:1px solid #000;text-align:center;vertical-align:top;font-weight:bold;">22</td>
        <td style="padding:6px 8px;border:1px solid #000;vertical-align:top;">Whether the bridegroom has any existing wife, and if so, whether he has secured the permission of the Arbitration Council under the Muslim Family Laws Ordinance, 1961 to contract another marriage.</td>
        <td style="padding:6px 8px;border:1px solid #000;vertical-align:top;">${f.existing_wife || "No"}</td>
      </tr>
      <tr>
        <td style="padding:6px 8px;border:1px solid #000;text-align:center;vertical-align:top;font-weight:bold;">23</td>
        <td style="padding:6px 8px;border:1px solid #000;vertical-align:top;">Number and date of the communication conveying to the bridegroom the permission of the Arbitration Council to contract another marriage.</td>
        <td style="padding:6px 8px;border:1px solid #000;vertical-align:top;">${f.arbitration_ref || "N/A"}${f.existing_wife_children ? `<br/>${f.existing_wife_children}` : ""}</td>
      </tr>
      <tr style="background:#fafafa;">
        <td style="padding:6px 8px;border:1px solid #000;text-align:center;vertical-align:top;font-weight:bold;">24</td>
        <td style="padding:6px 8px;border:1px solid #000;vertical-align:top;">Name and address of the person by whom the marriage was solemnized and his father.</td>
        <td style="padding:6px 8px;border:1px solid #000;vertical-align:top;"><strong>${f.solemnized_by || "_______________"}</strong></td>
      </tr>
      <tr>
        <td style="padding:6px 8px;border:1px solid #000;text-align:center;vertical-align:top;font-weight:bold;">25</td>
        <td style="padding:6px 8px;border:1px solid #000;vertical-align:top;">Date of registration of marriage.</td>
        <td style="padding:6px 8px;border:1px solid #000;vertical-align:top;"><strong>${f.registration_date || f.marriage_date || "_______________"}</strong></td>
      </tr>
      <tr style="background:#fafafa;">
        <td style="padding:6px 8px;border:1px solid #000;text-align:center;vertical-align:top;font-weight:bold;">26</td>
        <td style="padding:6px 8px;border:1px solid #000;vertical-align:top;">Registration fee paid.</td>
        <td style="padding:6px 8px;border:1px solid #000;vertical-align:top;">${f.registration_fee || "_______________"}</td>
      </tr>
    </tbody>
  </table>

  <!-- Signatures -->
  <table style="width:100%;border-collapse:collapse;border:1px solid #000;margin-top:20px;">
    <tr>
      <td style="padding:8px;border:1px solid #000;text-align:center;width:33%;vertical-align:top;">
        <div style="min-height:50px;border-bottom:1px solid #000;margin-bottom:5px;"></div>
        <p style="margin:0;font-size:10pt;">Signature of Bridegroom<br/>or his Attorney<br/><em>sd/-</em></p>
      </td>
      <td style="padding:8px;border:1px solid #000;text-align:center;width:33%;vertical-align:top;">
        <div style="min-height:50px;border-bottom:1px solid #000;margin-bottom:5px;"></div>
        <p style="margin:0;font-size:10pt;">Signature of Bride<br/>/ Signature of Bride's Attorney<br/><em>sd/-</em></p>
      </td>
      <td style="padding:8px;border:1px solid #000;text-align:center;width:34%;vertical-align:top;">
        <div style="min-height:50px;border-bottom:1px solid #000;margin-bottom:5px;"></div>
        <p style="margin:0;font-size:10pt;">Signature and Seal of<br/>the Nikah Registrar<br/><em>sd/-</em></p>
      </td>
    </tr>
    <tr>
      <td style="padding:8px;border:1px solid #000;text-align:center;vertical-align:top;">
        <div style="min-height:40px;border-bottom:1px solid #000;margin-bottom:5px;"></div>
        <p style="margin:0;font-size:10pt;">Signature of Witnesses to<br/>Appointment of Bridegroom's Attorney<br/><em>sd/- &nbsp;&nbsp; sd/-</em></p>
      </td>
      <td style="padding:8px;border:1px solid #000;text-align:center;vertical-align:top;">
        <div style="min-height:40px;border-bottom:1px solid #000;margin-bottom:5px;"></div>
        <p style="margin:0;font-size:10pt;">Signature of Witnesses to<br/>Appointment of Bride's Attorney<br/><em>sd/- &nbsp;&nbsp; sd/-</em></p>
      </td>
      <td style="padding:8px;border:1px solid #000;text-align:center;vertical-align:top;">
        <div style="min-height:40px;border-bottom:1px solid #000;margin-bottom:5px;"></div>
        <p style="margin:0;font-size:10pt;">Signature of Witnesses<br/>to the Marriage<br/><em>sd/- &nbsp;&nbsp; sd/-</em></p>
      </td>
    </tr>
  </table>

  <p style="font-size:9pt;text-align:center;margin-top:15px;color:#666;border-top:1px solid #ccc;padding-top:8px;">
    True Translation — Urdu to English &nbsp;|&nbsp; Muslim Family Laws Ordinance, 1961 — Form No. 2
  </p>
</div>`,
};
