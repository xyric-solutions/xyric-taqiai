#!/usr/bin/env node

import assert from "node:assert/strict";
import {
  compactPaginationWhitespace,
  isMeaningfulPaginationPage,
} from "../src/lib/document-html.ts";

const blankLine = "<p><br/></p>";
const source = `<p>Final clause.</p>${blankLine.repeat(25)}<hr/><p>Ali Khan</p><p>Seller</p>`;
const compacted = compactPaginationWhitespace(source);

assert.equal((compacted.match(/<p><br\/><\/p>/g) || []).length, 2);
assert.ok(compacted.includes("<p>Final clause.</p>"));
assert.ok(compacted.includes("<p>Ali Khan</p>"));
assert.ok(compacted.includes("<p>Seller</p>"));

assert.equal(compactPaginationWhitespace("<p>Text only</p>"), "<p>Text only</p>");
assert.equal(isMeaningfulPaginationPage(blankLine.repeat(4)), false);
assert.equal(isMeaningfulPaginationPage("<p>Ali Khan</p>"), true);
assert.equal(isMeaningfulPaginationPage("<hr/>"), true);

console.log("Document pagination validation: OK");
