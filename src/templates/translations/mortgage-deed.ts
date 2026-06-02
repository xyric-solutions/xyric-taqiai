import { TranslationTemplate } from "./types";

export const mortgageDeedTranslation: TranslationTemplate = {
  id: "mortgage-deed",
  name: "Mortgage Deed (Girvi Nama)",
  nameUrdu: "گروی نامہ",
  description: "Urdu to English translation of Mortgage Deed with possession (Girvi Nama)",
  icon: "Building2",

  extractionPrompt: `You are a Pakistani legal document translator. Extract all fields from this Mortgage Deed (Girvi Nama) and return them as a JSON object.

Extract these fields (use empty string if not found):
{
  "mortgagor_name": "Mortgagor (property owner giving mortgage) full name",
  "mortgagor_father": "Mortgagor's father name",
  "mortgagor_address": "Mortgagor's full address",
  "mortgagor_cnic": "Mortgagor CNIC if mentioned",
  "mortgagee_name": "Mortgagee (lender receiving mortgage) full name",
  "mortgagee_father": "Mortgagee's father name",
  "mortgagee_address": "Mortgagee's full address",
  "mortgagee_cnic": "Mortgagee CNIC if mentioned",
  "property_description": "Full property description (address, area, rooms etc.)",
  "loan_amount": "Mortgage/loan amount in figures",
  "loan_amount_words": "Loan amount in words",
  "deed_date": "Date of deed",
  "mortgage_period": "Duration/period of mortgage",
  "conditions": "Special conditions or terms if any",
  "witness1": "First witness name",
  "witness2": "Second witness name"
}

Return ONLY the JSON object, no other text.`,

  buildHtml: (f) => `
<div style="font-family:'Times New Roman',serif;font-size:13pt;line-height:2.0;color:#000;max-width:700px;margin:0 auto;">

  <h1 style="text-align:center;font-size:16pt;font-weight:bold;text-decoration:underline;margin-bottom:15px;">
    MORTGAGE DEED<br/><span style="font-size:13pt;font-weight:normal;">(With Possession)</span>
  </h1>

  <p>In the name of <strong>${f.mortgagor_name || "_______________"}</strong> son of <strong>${f.mortgagor_father || "_______________"}</strong>${f.mortgagor_cnic ? `, CNIC No. <strong>${f.mortgagor_cnic}</strong>` : ""}, resident of <strong>${f.mortgagor_address || "_______________"}</strong>.</p>

  <p>From: <strong>${f.mortgagee_name || "_______________"}</strong> son of <strong>${f.mortgagee_father || "_______________"}</strong>${f.mortgagee_cnic ? `, CNIC No. <strong>${f.mortgagee_cnic}</strong>` : ""}, resident of <strong>${f.mortgagee_address || "_______________"}</strong>, who is the owner and occupant of the property described below.</p>

  <p><strong>Property Description:</strong> ${f.property_description || "_______________"}</p>

  <p>The person who has all the powers to sell, gift, mortgage etc., has now mortgaged the above-mentioned property with all rights and privileges of every kind, with full mental capacity and free will, without coercion or unwillingness, to <strong>${f.mortgagor_name || "_______________"}</strong> son of <strong>${f.mortgagor_father || "_______________"}</strong>, on the following terms and conditions:</p>

  <ol style="margin:10px 0;padding-left:25px;line-height:2.0;">
    <li>The amount of the mortgage loan has been fixed at <strong>${f.loan_amount || "_______________"}</strong> (Rupees <strong>${f.loan_amount_words || "_______________"}</strong>).</li>
    <li>The mortgagee has received the full loan amount from the mortgagor and has handed over possession of the property.</li>
    <li>The mortgage period is: <strong>${f.mortgage_period || "as agreed between the parties"}</strong>.</li>
    <li>The electricity, water, gas and security bills shall be the responsibility of the mortgagee, who shall pay them every month and submit original receipts to the mortgagor.</li>
    <li>The mortgagor shall be bound to clear all outstanding bills upon vacating the property.</li>
    <li>In case of vacating the property, one month's prior notice shall be given by either party.</li>
    <li>The property shall be returned in the same condition in which the mortgagor handed it over.</li>
    <li>The mortgagee shall not carry out any kind of structural changes or vandalism in the above-mentioned property, and if any damage occurs, the mortgagee shall be bound to repair it.</li>
    <li>If the mortgagor fails to repay the loan amount within the agreed notice period, the mortgage period may be extended by mutual consent, or the mortgagor shall have the right to recover the amount by further mortgaging the said property.</li>
    ${f.conditions ? `<li>${f.conditions}</li>` : ""}
  </ol>

  <p>This mortgage deed has been written so that it remains a legal record and can be used when needed.</p>

  <p><strong>Dated:</strong> ${f.deed_date || "_______________"}</p>

  <div style="margin-top:30px;">
    <table style="width:100%;">
      <tr>
        <td style="width:50%;vertical-align:top;">
          <p><strong>Mortgagor (Property Owner):</strong><br/>
          ${f.mortgagee_name || "_______________"}<br/>
          <br/>Signature: _______________</p>
        </td>
        <td style="width:50%;vertical-align:top;">
          <p><strong>Mortgagee (Lender):</strong><br/>
          ${f.mortgagor_name || "_______________"}<br/>
          <br/>Signature: _______________</p>
        </td>
      </tr>
    </table>
    <p style="margin-top:15px;"><strong>Witnesses:</strong><br/>
    1. ${f.witness1 || "_______________"}<br/>
    2. ${f.witness2 || "_______________"}</p>
  </div>

  <p style="font-size:9pt;text-align:center;margin-top:20px;color:#555;">
    True Translation — Urdu to English
  </p>
</div>`,
};
