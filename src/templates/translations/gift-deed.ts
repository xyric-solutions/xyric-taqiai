import { TranslationTemplate } from "./types";

export const giftDeedTranslation: TranslationTemplate = {
  id: "gift-deed",
  name: "Gift Deed (Hiba Nama)",
  nameUrdu: "ہبہ نامہ",
  description: "Urdu to English translation of Gift Deed (Hiba Nama) for cash or property",
  icon: "Gift",

  extractionPrompt: `You are a Pakistani legal document translator. Extract all fields from this Gift Deed (Hiba Nama) and return them as a JSON object.

Extract these fields (use empty string if not found):
{
  "deed_date": "Date of gift deed",
  "deed_city": "City of execution",
  "donor_name": "Donor (person giving gift) full name",
  "donor_father": "Donor's father name",
  "donor_cnic": "Donor CNIC number",
  "donor_address": "Donor's address",
  "donee_name": "Donee (person receiving gift) full name",
  "donee_father": "Donee's father name",
  "donee_cnic": "Donee CNIC number",
  "donee_address": "Donee's address",
  "relationship": "Relationship between donor and donee",
  "gift_type": "Type of gift (Cash/Property/Land/House/Plot)",
  "gift_amount": "Gift amount in figures (if cash)",
  "gift_amount_words": "Gift amount in words (if cash)",
  "property_description": "Property description (if property gift)",
  "reason": "Reason for gift (love, affection, services, etc.)",
  "witness1": "First witness name",
  "witness2": "Second witness name"
}

Return ONLY the JSON object, no other text.`,

  buildHtml: (f) => `
<div style="font-family:'Times New Roman',serif;font-size:13pt;line-height:2.0;color:#000;max-width:700px;margin:0 auto;">

  <h1 style="text-align:center;font-size:16pt;font-weight:bold;text-decoration:underline;margin-bottom:5px;">GIFT DEED</h1>
  <p style="text-align:center;font-style:italic;margin-top:0;">(Hiba Nama)</p>

  <p>THIS DEED OF GIFT executed on <strong>${f.deed_date || "_______________"}</strong> at <strong>${f.deed_city || "_______________"}</strong>, by <strong>${f.donor_name || "_______________"}</strong> S/o <strong>${f.donor_father || "_______________"}</strong>, resident of <strong>${f.donor_address || "_______________"}</strong>, CNIC No. <strong>${f.donor_cnic || "_______________"}</strong>, hereinafter referred to as the <strong>Donor</strong>.</p>

  <p>In favor of <strong>${f.donee_name || "_______________"}</strong> S/o / D/o <strong>${f.donee_father || "_______________"}</strong>, resident of <strong>${f.donee_address || "_______________"}</strong>, CNIC No. <strong>${f.donee_cnic || "_______________"}</strong>, hereinafter referred to as the <strong>Donee</strong>.</p>

  ${f.relationship ? `<p>The Donee is the <strong>${f.relationship}</strong> of the Donor.</p>` : ""}

  ${f.gift_type === "Cash" || f.gift_amount ? `
  <p>THAT the Donor, out of natural love, affection${f.reason ? ` and ${f.reason}` : ""} for the Donee, hereby gifts the sum of <strong>${f.gift_amount || "Rs. _______________"}</strong> (Rupees <strong>${f.gift_amount_words || "_______________"}</strong> only) as a free gift to the Donee.</p>
  ` : `
  <p>THAT the Donor, out of natural love, affection${f.reason ? ` and ${f.reason}` : ""} for the Donee, hereby gifts the following property as a free gift to the Donee:</p>
  <p style="padding:8px 20px;border-left:3px solid #000;margin:10px 0;">${f.property_description || "_______________"}</p>
  `}

  <p>The Donor hereby declares and confirms that:</p>

  <ol style="margin:10px 0;padding-left:25px;line-height:2.0;">
    <li>The gift is made voluntarily, without any pressure, coercion or undue influence.</li>
    <li>The Donor is the rightful owner of the gifted property/amount and has full authority to make this gift.</li>
    <li>The gifted property/amount is free from all encumbrances, charges, mortgages and disputes.</li>
    <li>The Donee has accepted the gift and taken possession thereof.</li>
    <li>After this gift deed, the Donor shall have no claim or right over the gifted property/amount.</li>
  </ol>

  <p>IN WITNESS WHEREOF the Donor has signed this deed on the date mentioned above.</p>

  <div style="margin-top:30px;">
    <table style="width:100%;">
      <tr>
        <td style="width:50%;vertical-align:top;">
          <p><strong>Donor:</strong><br/>
          ${f.donor_name || "_______________"}<br/>
          CNIC: ${f.donor_cnic || "_______________"}<br/>
          <br/>Signature: _______________</p>
        </td>
        <td style="width:50%;vertical-align:top;">
          <p><strong>Donee (Acceptance):</strong><br/>
          ${f.donee_name || "_______________"}<br/>
          CNIC: ${f.donee_cnic || "_______________"}<br/>
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
