#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

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
