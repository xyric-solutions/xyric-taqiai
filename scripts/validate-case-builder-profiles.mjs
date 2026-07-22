#!/usr/bin/env node

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  collectCaseBuilderFieldMemory,
  rememberedAnswerForQuestion,
} from "../src/lib/case-builder-field-memory.ts";
import {
  findPriorCaseFormAnswer,
  resolveCaseFormSchema,
} from "../src/lib/case-builder-form-schema.ts";
import {
  extractSubsectionText,
  parseLegalProvisionReference,
} from "../src/lib/legal-provision-reference.ts";
import {
  isPlainLanguageCaseName,
  resolveKnownCaseName,
  resolveProfileCaseName,
} from "../src/lib/case-name-provision-resolver.ts";

const root = process.cwd();
const knowledgePath = path.join(root, "src", "lib", "case-builder-knowledge.ts");
const templatesRoot = path.join(root, "src", "templates");

function read(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(fullPath) : [fullPath];
  });
}

function pct(part, total) {
  if (!total) return 0;
  return Math.round((part / total) * 100);
}

const source = read(knowledgePath);

assert.equal(isPlainLanguageCaseName("Murder Case"), true);
assert.equal(isPlainLanguageCaseName("Section 302 PPC"), false);
assert.equal(resolveKnownCaseName("Murder Case")?.sections, "Section 302 PPC");
assert.equal(resolveKnownCaseName("Muder Case")?.sections, "Section 302 PPC");
assert.equal(resolveKnownCaseName("Mourder Case")?.sections, "Section 302 PPC");
assert.equal(resolveKnownCaseName("Child Rape Case")?.sections, "Section 376(3) PPC");
assert.equal(resolveKnownCaseName("Car Theft Case")?.sections, "Section 379 PPC");
const sisterPropertySale = resolveKnownCaseName("Brother property Sale without permission sister");
assert.match(sisterPropertySale?.sections || "", /Sections 7 and 44 of the Transfer of Property Act, 1882/);
assert.match(sisterPropertySale?.sections || "", /Sections 39, 42 and 54 of the Specific Relief Act, 1877/);
assert.ok(sisterPropertySale?.alternatives.some((alternative) => alternative.sections === "Section 498-A PPC"));
const womanHarassment = resolveKnownCaseName("Woman Harassment");
assert.equal(womanHarassment?.sections, "Section 509 PPC");
assert.ok(womanHarassment?.alternatives.some((alternative) => alternative.sections.includes("Workplace Act, 2010")));
assert.ok(womanHarassment?.alternatives.some((alternative) => alternative.sections.includes("Section 24 PECA")));
assert.equal(resolveKnownCaseName("WhatsApp cyber harassment")?.sections, "Section 24 PECA, 2016");

const profileCaseName = resolveProfileCaseName("Dishonoured cheque case", {
  id: "ppc-489f-dishonoured-cheque",
  title: "Dishonoured Cheque",
  matterType: "Criminal complaint",
  sectionRefs: ["Section 489-F PPC"],
});
assert.equal(profileCaseName?.sections, "Section 489-F PPC");

const subsection376 = parseLegalProvisionReference("Section 376(3)");
assert.ok(subsection376);
assert.equal(subsection376.canonical, "Section 376(3) PPC");
assert.equal(subsection376.lookupQuery, "Section 376 PPC");
assert.deepEqual(subsection376.subsections, ["3"]);

const subsection22A = parseLegalProvisionReference("u/s 22-A(6) Cr.P.C.");
assert.ok(subsection22A);
assert.equal(subsection22A.canonical, "Section 22-A(6) CrPC");
assert.deepEqual(subsection22A.subsections, ["6"]);

const nestedSubsection = parseLegalProvisionReference("section 337(3)(iv) PPC");
assert.ok(nestedSubsection);
assert.equal(nestedSubsection.canonical, "Section 337(3)(iv) PPC");
assert.deepEqual(nestedSubsection.subsections, ["3", "iv"]);

const cyberStalking = parseLegalProvisionReference("Section 24 PECA, 2016");
assert.ok(cyberStalking);
assert.equal(cyberStalking.canonical, "Section 24 PECA");
assert.equal(parseLegalProvisionReference("164 QSO")?.canonical, "Article 164 QSO");

const section376Body = "376. Punishment for rape. (1) General punishment. (1A) Clauses of sub-section (3) of section 337 may apply. 3[(3) Whoever commits rape of a minor or a person with mental or physical disability shall be punished with death or imprisonment for life and fine. (4) Whoever being a public servant commits rape shall be punished with death or imprisonment for life and fine. 376A. Disclosure of identity.";
const exact376Subsection = extractSubsectionText(section376Body, ["3"]);
assert.match(exact376Subsection, /^\(3\) Whoever commits rape of a minor/);
assert.doesNotMatch(exact376Subsection, /public servant/);

const combinedFirQuestion = {
  id: "fir_details",
  label: "What are the FIR number, date, and police station?",
};
const combinedFirMemory = collectCaseBuilderFieldMemory(
  [combinedFirQuestion],
  { fir_details: "FIR No. 26/5414 Date 19-07-2026 Police Station Lower Mall" },
);
assert.equal(combinedFirMemory.firNo, "26/5414");
assert.equal(combinedFirMemory.firDate, "19-07-2026");
assert.equal(combinedFirMemory.policeStation, "Lower Mall");
assert.equal(
  rememberedAnswerForQuestion({ id: "fir_number", label: "FIR / Case No." }, combinedFirMemory).complete,
  true,
);
assert.equal(
  rememberedAnswerForQuestion({ id: "police_station", label: "Police Station" }, combinedFirMemory).complete,
  true,
);

const partialFirMemory = collectCaseBuilderFieldMemory(
  [combinedFirQuestion],
  { fir_details: "FIR No. 123/2024 Police Station Civil Lines" },
);
const partialFirAnswer = rememberedAnswerForQuestion(combinedFirQuestion, partialFirMemory);
assert.equal(partialFirAnswer.complete, false);
assert.match(partialFirAnswer.value, /123\/2024/);
assert.match(partialFirAnswer.value, /Civil Lines/);
assert.ok(partialFirAnswer.missingFields.includes("firDate"));

const partyMemory = collectCaseBuilderFieldMemory(
  [
    { id: "petitioner_name", label: "Petitioner Name" },
    { id: "petitioner_cnic", label: "Petitioner CNIC" },
    { id: "respondent_address", label: "Respondent Address" },
  ],
  {
    petitioner_name: "Ali Khan",
    petitioner_cnic: "35202-1234567-1",
    respondent_address: "12 Mall Road, Lahore",
  },
);
assert.equal(partyMemory.clientName, "Ali Khan");
assert.equal(partyMemory.clientCnic, "35202-1234567-1");
assert.equal(partyMemory.opponentAddress, "12 Mall Road, Lahore");
assert.equal(partyMemory.opponentCnic, undefined);

const schemaFields = (schema) => schema.groups.flatMap((group) => group.fields);
const schemaLabels = (schema) => schemaFields(schema).map((field) => field.label);

const bailForm = resolveCaseFormSchema({ profileId: "crpc-bail", profileTitle: "Bail Matter" });
assert.equal(bailForm.kind, "bail");
assert.ok(schemaLabels(bailForm).includes("Arrest / Custody Details"));
assert.ok(schemaLabels(bailForm).includes("Police Station"));
assert.equal(schemaFields(bailForm).find((field) => field.id === "case_number")?.coreField, undefined);

const criminalForm = resolveCaseFormSchema({ profileId: "criminal-general", matterType: "General criminal case" });
assert.equal(criminalForm.kind, "criminal");
assert.ok(schemaLabels(criminalForm).includes("Investigating Officer"));
assert.ok(!schemaLabels(criminalForm).includes("Property Details"));

const civilPropertyForm = resolveCaseFormSchema({ profileId: "civil-injunction-property", profileTitle: "Declaration / Injunction / Possession" });
assert.equal(civilPropertyForm.kind, "civil-property");
assert.ok(schemaLabels(civilPropertyForm).includes("Property Details"));
assert.ok(!schemaLabels(civilPropertyForm).includes("Police Station"));

const familyForm = resolveCaseFormSchema({ profileId: "family-maintenance", profileTitle: "Maintenance / Nafaqa" });
assert.equal(familyForm.kind, "family-maintenance");
assert.ok(schemaLabels(familyForm).includes("Monthly Maintenance Claimed"));

const constitutionalForm = resolveCaseFormSchema({ profileId: "constitutional-writ", profileTitle: "Constitutional Writ" });
assert.equal(constitutionalForm.kind, "constitutional");
assert.ok(schemaLabels(constitutionalForm).includes("Authority / Department"));
assert.ok(schemaLabels(constitutionalForm).includes("Impugned Order / Action"));

const vehicleSaleForm = resolveCaseFormSchema({ sections: "Vehicle sale and ownership transfer dispute" });
assert.equal(vehicleSaleForm.kind, "vehicle-sale");
assert.ok(schemaLabels(vehicleSaleForm).includes("Registration Number"));
assert.ok(schemaLabels(vehicleSaleForm).includes("Engine Number"));
assert.ok(schemaLabels(vehicleSaleForm).includes("Chassis Number"));

const vehicleTheftForm = resolveCaseFormSchema({ sections: "Car theft FIR" });
assert.equal(vehicleTheftForm.kind, "vehicle-theft");
assert.ok(schemaLabels(vehicleTheftForm).includes("Police Station"));

const registrationField = schemaFields(vehicleSaleForm).find((field) => field.id === "vehicle_registration_number");
assert.ok(registrationField);
assert.equal(
  findPriorCaseFormAnswer(
    registrationField,
    [{ id: "registration_no", label: "What is the vehicle registration number?" }],
    { registration_no: "LEA-1234" },
  ),
  "LEA-1234",
);

const profileStarts = [...source.matchAll(/^\s*{\s*\r?\n\s*id:\s*"([^"]+)"/gm)];
const profileBlocks = profileStarts.map((match, index) => {
  const next = profileStarts[index + 1];
  return {
    id: match[1],
    body: source.slice(match.index, next?.index ?? source.length),
  };
});

const profileIds = profileBlocks.map((profile) => profile.id);
const duplicates = profileIds.filter((id, index) => profileIds.indexOf(id) !== index);

const expectedProfiles = [
  "ppc-489f-dishonoured-cheque",
  "crpc-22a-22b-justice-of-peace",
  "crpc-bail",
  "ppc-302-murder",
  "ppc-420-406-fraud",
  "family-khula",
  "family-maintenance",
  "family-custody",
  "civil-recovery",
  "civil-injunction-property",
  "cpc-civil-revision-115",
  "cpc-order-vii-rule-11",
  "rent-appeal-punjab",
  "constitutional-writ",
  "crpc-criminal-revision-561a",
  "civil-specific-performance",
  "criminal-fir-quashment",
  "tax-appeal-fbr",
  "constitutional-service-writ",
  "non-muslim-guardianship-family",
  "service-labour-general",
  "consumer-general",
  "banking-finance-general",
  "succession-probate-general",
  "revenue-land-general",
  "tax-customs-general",
  "corporate-commercial-general",
  "cybercrime-general",
  "arbitration-general",
  "execution-contempt-general",
  "criminal-general",
  "family-general",
  "civil-general",
];

const requiredMarkers = [
  "legalIngredients",
  "mandatoryQuestions",
  "optionalQuestions",
  "proceduralQuestions",
  "evidenceChecklist",
  "limitationQuestions",
  "jurisdictionQuestions",
  "reliefQuestions",
  "riskFlags",
  "documentTypeMappings",
  "commonProceduralQuestions",
  "commonLimitationQuestions",
  "commonJurisdictionQuestions",
  "commonReliefQuestions",
  "commonEvidenceChecklist",
  "commonRiskFlags",
  "normalizeProfile",
  "getCaseIntakeProfiles",
  "knowledgeBlock",
];

const missingExpected = expectedProfiles.filter((id) => !profileIds.includes(id));
const missingMarkers = requiredMarkers.filter((marker) => !source.includes(marker));
const sparseProfiles = profileBlocks
  .map((profile) => ({
    id: profile.id,
    questions: (profile.body.match(/\bq\("/g) || []).length,
    hasPatterns: profile.body.includes("patterns:"),
    hasDraftingGuidance: profile.body.includes("draftingGuidance:"),
  }))
  .filter((profile) => profile.questions < 3 || !profile.hasPatterns || !profile.hasDraftingGuidance);

const templateFiles = walk(templatesRoot)
  .filter((filePath) => filePath.endsWith(".ts"))
  .filter((filePath) => !/[\\/]translations[\\/]/.test(filePath))
  .filter((filePath) => !/[\\/]index\.ts$/.test(filePath))
  .filter((filePath) => !/[\\/]types\.ts$/.test(filePath));

const templateDefinitions = templateFiles.filter((filePath) => read(filePath).includes("TemplateDefinition ="));

const issues = [
  ...duplicates.map((id) => `Duplicate profile id: ${id}`),
  ...missingExpected.map((id) => `Expected profile missing: ${id}`),
  ...missingMarkers.map((marker) => `Completeness marker missing from knowledge file: ${marker}`),
  ...sparseProfiles.map((profile) => (
    `Profile needs review: ${profile.id} (${profile.questions} local questions, patterns=${profile.hasPatterns}, draftingGuidance=${profile.hasDraftingGuidance})`
  )),
];

console.log("Case Builder profile validation");
console.log(`Profiles: ${profileIds.length}`);
console.log(`Expected coverage targets: ${expectedProfiles.length - missingExpected.length}/${expectedProfiles.length}`);
console.log(`Template definitions: ${templateDefinitions.length}`);
console.log(`Profile/template ratio: ${pct(profileIds.length, templateDefinitions.length)}%`);
console.log("Note: the ratio is an audit signal only; fallback profiles and AI intake still handle matters outside deterministic profiles.");

if (issues.length) {
  console.error("\nIssues:");
  for (const issue of issues) console.error(`- ${issue}`);
  process.exitCode = 1;
} else {
  console.log("Status: OK");
}
