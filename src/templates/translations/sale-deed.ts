import { TranslationTemplate } from "./types";

export const saleDeedTranslation: TranslationTemplate = {
  id: "sale-deed",
  name: "Sale Deed",
  nameUrdu: "بیع نامہ",
  description: "Urdu to English translation of Sale Deed for property (house, plot, shop, land)",
  icon: "Home",

  extractionPrompt: `You are a Pakistani legal document translator. Extract all fields from this Sale Deed (Bai Nama) and return them as a JSON object.

Extract these fields (use empty string if not found):
{
  "deed_date": "Date of deed execution",
  "deed_city": "City where deed was made",
  "vendor_name": "Vendor (seller) full name",
  "vendor_father": "Vendor's father name",
  "vendor_cnic": "Vendor CNIC number",
  "vendor_address": "Vendor's full address",
  "vendee_name": "Vendee (buyer) full name",
  "vendee_father": "Vendee's father name",
  "vendee_cnic": "Vendee CNIC number",
  "vendee_address": "Vendee's full address",
  "consideration_amount": "Sale price in figures (e.g. Rs. 9,50,000/-)",
  "consideration_words": "Sale price in words",
  "property_type": "Type of property (House/Plot/Shop/Land)",
  "property_area": "Area of property (e.g. 5 Marlas, 1 Kanal)",
  "property_location": "Full property location / mohallah / colony",
  "khewat_no": "Khewat number",
  "khatooni_no": "Khatooni number",
  "khasra_no": "Khasra number",
  "total_area": "Total area in khasra",
  "jamabandi_year": "Jamabandi year",
  "east_boundary": "Eastern boundary",
  "west_boundary": "Western boundary",
  "north_boundary": "Northern boundary",
  "south_boundary": "Southern boundary",
  "witness1": "First witness name",
  "witness2": "Second witness name"
}

Return ONLY the JSON object, no other text.`,

  buildHtml: (f) => `
<div style="font-family:'Times New Roman',serif;font-size:13pt;line-height:2.0;color:#000;max-width:700px;margin:0 auto;">

  <h1 style="text-align:center;font-size:16pt;font-weight:bold;text-decoration:underline;margin-bottom:5px;">SALE DEED</h1>
  <p style="text-align:center;font-style:italic;margin-top:0;">In the Name of Allah, Most Gracious, Most Merciful</p>

  <p>THIS DEED OF SALE made on <strong>${f.deed_date || "_______________"}</strong> at <strong>${f.deed_city || "_______________"}</strong>, between <strong>${f.vendor_name || "_______________"}</strong> S/o <strong>${f.vendor_father || "_______________"}</strong> resident of <strong>${f.vendor_address || "_______________"}</strong>, having National Identity Card No. <strong>${f.vendor_cnic || "_______________"}</strong>, hereinafter referred to as the <strong>Vendor</strong> (which expressions shall unless excluded by or repugnant to the context be deemed to include its successors, executors, administrators, representatives and assignees) of the one part;</p>

  <p>In Favor of <strong>${f.vendee_name || "_______________"}</strong> S/o <strong>${f.vendee_father || "_______________"}</strong> having Permanent Address: <strong>${f.vendee_address || "_______________"}</strong>, having National Identity Card No. <strong>${f.vendee_cnic || "_______________"}</strong>, hereinafter referred to as the <strong>Vendee</strong> (which expressions shall unless excluded by or repugnant to the context be deemed to include its successors, executors, administrators, representatives and assignees) of the Other part;</p>

  <p>For a Consideration of <strong>${f.consideration_amount || "Rs. _______________"}</strong> (Rupees <strong>${f.consideration_words || "_______________"}</strong> only)</p>

  <p>WHEREAS the Vendor is the owner of a <strong>${f.property_type || "property"}</strong> measuring <strong>${f.property_area || "_______________"}</strong> situated at <strong>${f.property_location || "_______________"}</strong>${f.khewat_no ? ` vide Khewat No. <strong>${f.khewat_no}</strong>` : ""}${f.khatooni_no ? ` Khatooni No. <strong>${f.khatooni_no}</strong>` : ""}${f.khasra_no ? ` Khasra No. <strong>${f.khasra_no}</strong>` : ""}${f.total_area ? ` Total Area <strong>${f.total_area}</strong>` : ""}${f.jamabandi_year ? ` vide Jamabandi Year <strong>${f.jamabandi_year}</strong>` : ""} as described and shown in the schedule and plan annexed hereto.</p>

  <p>WHEREAS the Vendor has already agreed to sell the aforesaid <strong>${f.property_type || "property"}</strong> for a Consideration of <strong>${f.consideration_amount || "Rs. _______________"}</strong> (Rupees <strong>${f.consideration_words || "_______________"}</strong> only).</p>

  <p><strong>NOW THE DEED WITNESSES AS FOLLOWING:</strong></p>

  <p>THAT the Vendee has already paid the entire sale price of the ${f.property_type || "property"} amounting to <strong>${f.consideration_amount || "Rs. _______________"}</strong> (Rupees <strong>${f.consideration_words || "_______________"}</strong> only) in advance before the execution of the Sale Deed and there is nothing outstanding against the Vendee.</p>

  <p>That all costs of the execution and registration of the sale deed, cost of non-judicial stamp paper, registration fee etc., have been and shall be borne by the Vendee and will remain liable to any further demand/raise, if any, the Vendee indemnifies the vendor for the same.</p>

  <p><strong>THE VENDOR HEREBY COVENANTS WITH THE VENDEE AS FOLLOWS:</strong></p>

  <p>That the ${f.property_type || "property"} be quietly entered into, held, enjoyed, rents and profits received therefrom by Vendee without any interruption or disturbance by the Vendor or any person claiming through or under it and without any lawful disturbance or interruption by any other person whomsoever.</p>

  <p>That the Vendor further assures the Vendee that the ${f.property_type || "property"} hereby sold, is free from Sale Deed, agreement to sell, mortgage, gift, exchange and from all other encumbrances.</p>

  <p>That the Vendor hereby further agrees that at all times hereinafter upon any reasonable request and at the expense of the Vendee to execute or cause to be done all such lawful acts, deeds and things whatever for the better and more perfectly conveying and assuring the ${f.property_type || "property"} to the Vendee, its heirs, executors, assigns and administrators as shall be reasonably required by the Vendee.</p>

  ${(f.east_boundary || f.west_boundary || f.north_boundary || f.south_boundary) ? `
  <p><strong>The property aforementioned is bounded as follows:</strong></p>
  <table style="width:100%;border-collapse:collapse;border:1px solid #000;margin:10px 0;">
    ${f.east_boundary ? `<tr><td style="padding:5px 10px;border:1px solid #000;font-weight:bold;width:20%;">EAST BY:</td><td style="padding:5px 10px;border:1px solid #000;">${f.east_boundary}</td></tr>` : ""}
    ${f.west_boundary ? `<tr><td style="padding:5px 10px;border:1px solid #000;font-weight:bold;">WEST BY:</td><td style="padding:5px 10px;border:1px solid #000;">${f.west_boundary}</td></tr>` : ""}
    ${f.north_boundary ? `<tr><td style="padding:5px 10px;border:1px solid #000;font-weight:bold;">NORTH BY:</td><td style="padding:5px 10px;border:1px solid #000;">${f.north_boundary}</td></tr>` : ""}
    ${f.south_boundary ? `<tr><td style="padding:5px 10px;border:1px solid #000;font-weight:bold;">SOUTH BY:</td><td style="padding:5px 10px;border:1px solid #000;">${f.south_boundary}</td></tr>` : ""}
  </table>` : ""}

  <p>IN WITNESS WHEREOF the parties have signed this deed on the date mentioned above against their respective signatures.</p>

  <div style="margin-top:30px;">
    <table style="width:100%;">
      <tr>
        <td style="width:50%;vertical-align:top;">
          <p><strong>VENDOR:</strong><br/>
          ${f.vendor_name || "_______________"}<br/>
          CNIC: ${f.vendor_cnic || "_______________"}<br/>
          <br/>Signature: _______________</p>
        </td>
        <td style="width:50%;vertical-align:top;">
          <p><strong>VENDEE:</strong><br/>
          ${f.vendee_name || "_______________"}<br/>
          CNIC: ${f.vendee_cnic || "_______________"}<br/>
          <br/>Signature: _______________</p>
        </td>
      </tr>
    </table>
    <p style="margin-top:20px;"><strong>WITNESSES:</strong><br/>
    1. ${f.witness1 || "_______________"}<br/>
    2. ${f.witness2 || "_______________"}</p>
  </div>

  <p style="font-size:9pt;text-align:center;margin-top:20px;color:#555;">
    True Translation — Urdu to English
  </p>
</div>`,
};
