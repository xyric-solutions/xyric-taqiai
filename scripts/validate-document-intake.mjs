#!/usr/bin/env node

import assert from "node:assert/strict";
import { findAgreementCatalogItem } from "../src/lib/agreement-catalog.ts";
import {
  VEHICLE_SALE_LEGAL_REQUIREMENTS,
  vehicleSale,
} from "../src/templates/agreements/vehicle-sale.ts";
import {
  buildVakalatnamaHtml,
  VAKALATNAMA_SAMPLE_REQUIREMENTS,
  vakalatnama,
} from "../src/templates/power-of-attorney/vakalatnama.ts";
import {
  filterDocumentIntakeValues,
  resolvePrimaryDocumentRequest,
} from "../src/lib/document-intake-knowledge.ts";
import { normalizeGeneratedHtml } from "../src/lib/document-html.ts";
import {
  formatAmountFull,
  formatMonetaryAmountsInHtml,
  formatMonetaryRecord,
  formatPKR,
  toPKWords,
} from "../src/lib/pk-format.ts";

const primaryRequest = resolvePrimaryDocumentRequest(
  "Car Sale Agreement",
  "Car Sale Agreement\n\nAttached old rent agreement mentioning monthly rent and security deposit"
);

assert.equal(primaryRequest, "Car Sale Agreement");
assert.equal(findAgreementCatalogItem(primaryRequest)?.subType, "vehicle-sale");

const vehicleQuestions = [
  {
    id: "seller_name",
    label: "Seller Name",
    placeholder: "",
    required: true,
    category: "template",
    source: "template",
  },
  {
    id: "registration_no",
    label: "Registration Number",
    placeholder: "",
    required: true,
    category: "template",
    source: "template",
  },
];

assert.deepEqual(
  filterDocumentIntakeValues(
    {
      seller_name: "Muhammad Ahmed",
      registration_no: "LEA-1234",
      landlord_name: "Unrelated Landlord",
      monthly_rent: "Rs. 50,000",
      security_deposit: "Rs. 100,000",
    },
    vehicleQuestions
  ),
  {
    seller_name: "Muhammad Ahmed",
    registration_no: "LEA-1234",
  }
);

for (const request of [
  "Vehicle Sale Agreement",
  "car sale agreement",
  "motorcycle sale agreement",
  "I need an agreement to sell my car",
  "prepare a document for sale of my automobile",
]) {
  assert.equal(
    findAgreementCatalogItem(request)?.subType,
    "vehicle-sale",
    `Expected ${request} to resolve to vehicle-sale`
  );
}

for (const requiredClause of [
  "lawful owner",
  "without pressure, coercion",
  "inspected and test-checked",
  "Payment Terms",
  "All liabilities, taxes, challans, fines, and legal responsibilities arising before the date of this Agreement",
  "transfer of registration/ownership",
  "reciprocal indemnities",
  "effective on the date it is signed",
  "two witnesses",
]) {
  assert.match(
    VEHICLE_SALE_LEGAL_REQUIREMENTS,
    new RegExp(requiredClause.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"),
    `Missing mandatory vehicle-sale requirement: ${requiredClause}`
  );
  assert.match(
    vehicleSale.promptTemplate,
    new RegExp(requiredClause.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"),
    `Vehicle-sale prompt omitted requirement: ${requiredClause}`
  );
}
assert.match(vehicleSale.promptTemplate, /WITNESS 1[\s\S]*WITNESS 2/i);
assert.match(vehicleSale.promptTemplate, /14\. EFFECTIVE DATE:/i);
assert.doesNotMatch(vehicleSale.promptTemplate, /PKR \[Sale Price\]/i);

const blankVakalatnama = buildVakalatnamaHtml({});
for (const samplePersonalDetail of [
  "Mahmood Ahmad Khan",
  "Aqeel Sharif Sandu",
  "Rajasab Ali Khan Bhatti",
  "Raja Muhammad Ahmad",
  "Muhammad Zubair Gujjar",
]) {
  assert.doesNotMatch(blankVakalatnama, new RegExp(samplePersonalDetail, "i"));
  assert.doesNotMatch(vakalatnama.promptTemplate, new RegExp(samplePersonalDetail, "i"));
}
for (const sampleSection of [
  "POWER OF ATTORNEY",
  "IN THE COURT OF",
  "PLAINTIFF",
  "APPELLANT",
  "PETITIONER",
  "COMPLAINANT",
  "V E R S U S",
  "DEFENDANT",
  "RESPONDENT",
  "ACCUSED",
  "Signature or thumb impression",
]) {
  assert.match(blankVakalatnama, new RegExp(sampleSection.replace(/\s+/g, "\\s+"), "i"));
}
assert.match(blankVakalatnama, /_{11,}/);
assert.doesNotMatch(blankVakalatnama, /\b2026\b/);
const normalizedBlankVakalatnama = normalizeGeneratedHtml(blankVakalatnama, {
  preserveInlineStyles: true,
  preserveEmptyBlocks: true,
});
assert.match(normalizedBlankVakalatnama, /data-document-format="vakalatnama"/);
assert.match(normalizedBlankVakalatnama, /<table border="0">/);
assert.match(VAKALATNAMA_SAMPLE_REQUIREMENTS, /Never copy names, court details, case details, dates, or advocate details/i);
assert.equal(vakalatnama.formFields.every((field) => field.required === false), true);
assert.equal(vakalatnama.formFields.every((field) => field.aiSuggestable === true), true);

const filledVakalatnama = buildVakalatnamaHtml({
  court_name: "Court of Civil Judge, Lahore",
  case_number: "Suit No. 123/2026",
  case_title: "Ali Khan versus Ahmed Raza",
  client_name: "Ali Khan",
  party_role: "Plaintiff",
  advocate_name: "Advocate Fatima Ali",
  advocate_designation: "Advocate High Court",
  advocate_bar_id: "PBC-LHR-12345",
  execution_date: "20 July 2026",
  additional_advocates: "Ahmed Noor | Advocate\nSara Khan | Advocate High Court",
});
for (const suppliedValue of [
  "Court of Civil Judge, Lahore",
  "Suit No. 123/2026",
  "Ali Khan",
  "Ahmed Raza",
  "Advocate Fatima Ali",
  "Advocate High Court",
  "PBC-LHR-12345",
  "20 July 2026",
  "Ahmed Noor",
  "Sara Khan",
]) {
  assert.match(filledVakalatnama, new RegExp(suppliedValue.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"));
}

assert.equal(
  formatAmountFull(1_000_000),
  "Rs. 10,00,000/- (Rupees Ten Lac Only) | Half Amount: Rs. 5,00,000/- (Rupees Five Lac Only)"
);
assert.equal(
  formatAmountFull(50_000),
  "Rs. 50,000/- (Rupees Fifty Thousand Only)"
);
assert.equal(formatPKR(100_000), "Rs. 1,00,000/-");
assert.equal(toPKWords(100_000), "Rupees One Lac Only");
assert.equal(formatPKR(50_000_000), "Rs. 5,00,00,000/-");
assert.equal(toPKWords(50_000_000), "Rupees Five Crore Only");
assert.doesNotMatch(toPKWords(1_000_000_000), /million|billion|trillion/i);
assert.equal(
  formatMonetaryRecord({ sale_price: "2500000", payment_terms: "bank transfer" }).sale_price,
  "Rs. 25,00,000/- (Rupees Twenty Five Lac Only) | Half Amount: Rs. 12,50,000/- (Rupees Twelve Lac Fifty Thousand Only)"
);
assert.equal(
  formatMonetaryAmountsInHtml("<p>Sale price: PKR 50000/-.</p>"),
  "<p>Sale price: Rs. 50,000/- (Rupees Fifty Thousand Only).</p>"
);
assert.equal(
  formatMonetaryAmountsInHtml("<p>Sale price: <strong>PKR 50000/-</strong> (Rupees Fifty Thousand Only).</p>"),
  "<p>Sale price: <strong>Rs. 50,000/-</strong> (Rupees Fifty Thousand Only).</p>"
);
assert.equal(
  formatMonetaryAmountsInHtml("<p>Sale price: <strong><bdi>PKR 50000/-</bdi></strong> (Rupees Fifty Thousand Only).</p>"),
  "<p>Sale price: <strong><bdi>Rs. 50,000/-</bdi></strong> (Rupees Fifty Thousand Only).</p>"
);
const salePriceWithHalf = "<p>Sale price: Rs. 25,00,000/- (Rupees Twenty Five Lac Only) | Half Amount: Rs. 12,50,000/- (Rupees Twelve Lac Fifty Thousand Only).</p>";
assert.equal(
  formatMonetaryAmountsInHtml("<p>Sale price: PKR 2500000/-.</p>"),
  salePriceWithHalf
);
assert.equal(formatMonetaryAmountsInHtml(salePriceWithHalf), salePriceWithHalf);
assert.equal(
  formatMonetaryAmountsInHtml("<p>Price: PKR Rs. 50000000 PKR</p>"),
  "<p>Price: Rs. 5,00,00,000/- (Rupees Five Crore Only) | Half Amount: Rs. 2,50,00,000/- (Rupees Two Crore Fifty Lac Only)</p>"
);
assert.equal(
  formatMonetaryAmountsInHtml("<p>Price: <strong>Rs. 9,50,000/-</strong> (Rupees <strong>Nine Lac Fifty Thousand</strong> Only)</p>"),
  "<p>Price: <strong>Rs. 9,50,000/-</strong> (Rupees Nine Lac Fifty Thousand Only) | Half Amount: Rs. 4,75,000/- (Rupees Four Lac Seventy Five Thousand Only)</p>"
);

console.log("Document intake validation: OK");
