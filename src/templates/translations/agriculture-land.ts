import { TranslationTemplate } from "./types";

export const agricultureLandTranslation: TranslationTemplate = {
  id: "agriculture-land",
  name: "Agriculture Land (Contract / Lease)",
  nameUrdu: "زرعی زمین معاہدہ",
  description: "Urdu to English translation of Agriculture Land lease/contract agreement",
  icon: "Leaf",

  extractionPrompt: `You are a Pakistani legal document translator. Extract all fields from this Agriculture Land lease/contract document and return them as a JSON object.

Extract these fields (use empty string if not found):
{
  "party1_name": "First party (lessee) full name",
  "party1_father": "First party's father name",
  "party1_cnic": "First party CNIC",
  "party1_address": "First party address",
  "party1_role": "Role of first party (Lessee/Owner/etc.)",
  "party2_name": "Second party (owner) full name",
  "party2_father": "Second party's father name",
  "party2_cnic": "Second party CNIC",
  "party2_address": "Second party address",
  "party2_role": "Role of second party (Owner/Lessee/etc.)",
  "land_area": "Land area (e.g. 400 Kanals, 10 Acres)",
  "land_area_unit": "Unit (Kanals/Acres/Marlas)",
  "land_location": "Land location (Mouza/Tehsil/District)",
  "contract_years": "Contract duration in years",
  "contract_amount": "Total contract amount in figures",
  "contract_amount_words": "Contract amount in words",
  "contract_date": "Date of contract",
  "conditions": "Special terms and conditions",
  "witness1_name": "First witness name",
  "witness1_father": "First witness father name",
  "witness1_cnic": "First witness CNIC",
  "witness2_name": "Second witness name",
  "witness2_father": "Second witness father name",
  "witness2_cnic": "Second witness CNIC"
}

Return ONLY the JSON object, no other text.`,

  buildHtml: (f) => `
<div style="font-family:'Times New Roman',serif;font-size:13pt;line-height:2.0;color:#000;max-width:700px;margin:0 auto;">

  <h1 style="text-align:center;font-size:16pt;font-weight:bold;text-decoration:underline;margin-bottom:15px;">
    AGRICULTURE LAND CONTRACT
  </h1>

  <p>I, <strong>${f.party1_name || "_______________"}</strong> S/o <strong>${f.party1_father || "_______________"}</strong>, CNIC No. <strong>${f.party1_cnic || "_______________"}</strong>, Resident of <strong>${f.party1_address || "_______________"}</strong>.</p>

  <p>As for the agricultural land measuring <strong>${f.land_area || "_______________"} ${f.land_area_unit || "Kanals"}</strong>, situated at <strong>${f.land_location || "_______________"}</strong>, the contract is for <strong>${f.contract_years || "___"} years</strong> and the agreed amount is <strong>${f.contract_amount || "Rs. _______________"}</strong> (Rupees <strong>${f.contract_amount_words || "_______________"}</strong>).</p>

  <p>Between <strong>${f.party2_name || "_______________"}</strong> S/o <strong>${f.party2_father || "_______________"}</strong>, CNIC No. <strong>${f.party2_cnic || "_______________"}</strong>, Resident of <strong>${f.party2_address || "_______________"}</strong>, and the contract is fixed for <strong>${f.contract_years || "___"} years</strong>, which may be extended by mutual consent.</p>

  <p>The following terms and conditions have been agreed upon:</p>

  <ol style="margin:10px 0;padding-left:25px;line-height:2.0;">
    <li>The lessee shall not occupy or sublet the land to any other person without prior written consent of the owner.</li>
    <li>The lessee shall use the land only for agricultural purposes as agreed.</li>
    <li>After expiration of the contract period, the lessee shall hand over the land to the owner in its original condition.</li>
    <li>The owner shall be bound to give possession to the lessee upon commencement of the contract.</li>
    ${f.conditions ? `<li>${f.conditions}</li>` : ""}
  </ol>

  <p>Therefore, this contract letter has been written so that it remains safe and available at the time of need.</p>

  ${f.contract_date ? `<p><strong>Dated:</strong> ${f.contract_date}</p>` : ""}

  <div style="margin-top:30px;">
    <table style="width:100%;">
      <tr>
        <td style="width:50%;vertical-align:top;">
          <p><strong>First Party (${f.party1_role || "Lessee"}):</strong><br/>
          ${f.party1_name || "_______________"}<br/>
          CNIC: ${f.party1_cnic || "_______________"}<br/>
          <br/>Signature: _______________</p>
        </td>
        <td style="width:50%;vertical-align:top;">
          <p><strong>Second Party (${f.party2_role || "Owner"}):</strong><br/>
          ${f.party2_name || "_______________"}<br/>
          CNIC: ${f.party2_cnic || "_______________"}<br/>
          <br/>Signature: _______________</p>
        </td>
      </tr>
    </table>

    <div style="margin-top:20px;">
      <strong>Witnesses:</strong>
      <table style="width:100%;margin-top:8px;border-collapse:collapse;">
        <tr>
          <td style="width:50%;padding-right:15px;vertical-align:top;">
            <p style="margin:3px 0;"><strong>Witness 1:</strong><br/>
            ${f.witness1_name || "_______________"}<br/>
            ${f.witness1_father ? `S/o ${f.witness1_father}<br/>` : ""}
            CNIC: ${f.witness1_cnic || "_______________"}<br/>
            Signature: _______________</p>
          </td>
          <td style="width:50%;padding-left:15px;vertical-align:top;">
            <p style="margin:3px 0;"><strong>Witness 2:</strong><br/>
            ${f.witness2_name || "_______________"}<br/>
            ${f.witness2_father ? `S/o ${f.witness2_father}<br/>` : ""}
            CNIC: ${f.witness2_cnic || "_______________"}<br/>
            Signature: _______________</p>
          </td>
        </tr>
      </table>
    </div>
  </div>

  <p style="font-size:9pt;text-align:center;margin-top:20px;color:#555;">
    True Translation — Urdu to English
  </p>
</div>`,
};
