#!/usr/bin/env node

import assert from "node:assert/strict";
import fs from "node:fs";
import { detectMultiIntent } from "../src/lib/intent-detection.ts";
import { verifiedAuthorityGrounding } from "../src/lib/verified-legal-authorities.ts";
import {
  decideJudgmentRetrieval,
  LEGAL_RELIABILITY_RULES,
  splitLegalIssues,
} from "../src/lib/advisor-reliability.ts";

const evidenceAndVehicleQuestion = "A digital WhatsApp chat and voice recordings are the main evidence in a fraud case. Are they admissible in Pakistani courts? What conditions must be fulfilled? A vehicle was sold through a sale agreement, but ownership was never transferred in the Excise record. The buyer caused a fatal accident. Who will be legally liable and why?";

assert.equal(detectMultiIntent(evidenceAndVehicleQuestion).isDrafting, false);
assert.equal(detectMultiIntent("What makes electronic evidence admissible?").isDrafting, false);
assert.equal(detectMultiIntent("What is the application of Section 164 QSO?").isDrafting, false);
assert.equal(detectMultiIntent("Please draft a bail application").isDrafting, true);
assert.equal(detectMultiIntent("Prepare my written statement for this civil suit").isDrafting, true);
assert.equal(detectMultiIntent("what is 295C").primary, "criminal");

const section295CGrounding = verifiedAuthorityGrounding("what is 295C");
assert.equal(section295CGrounding.exclusive, true);
assert.equal(section295CGrounding.sources.length, 4);
assert.ok(section295CGrounding.sources.every((source) => source.externalUrl?.startsWith("https://")));
assert.match(section295CGrounding.block, /Mst\. Asia Bibi/);
assert.match(section295CGrounding.block, /current punishment only as death and fine/);
assert.match(section295CGrounding.block, /Do not state an exact cessation date or cite PLD 1992 SC 153/);
assert.match(section295CGrounding.block, /do not say that a breach automatically nullifies/);
assert.match(section295CGrounding.block, /Tahir Naqash/);
assert.match(section295CGrounding.block, /Salamat Mansha Masih/);
assert.match(section295CGrounding.block, /PLD 1991 FSC 10/);

for (const [expected, question] of [
  ["criminal", "Who can obtain post arrest bail in a fraud FIR?"],
  ["property", "How can I recover possession of my land?"],
  ["family", "What is the procedure for child custody?"],
  ["civil", "Can I recover damages for breach of contract?"],
  ["corporate", "How do shareholders remove a company director?"],
  ["tax", "How do I challenge an FBR tax assessment?"],
  ["immigration", "How can I appeal passport cancellation?"],
  ["constitutional", "How do I file an Article 199 writ petition?"],
  ["non-muslim", "What law applies to Christian divorce?"],
  ["general", "What is natural justice?"],
]) {
  assert.equal(detectMultiIntent(question).primary, expected, `Wrong intent for: ${question}`);
}
assert.equal(detectMultiIntent("Draft an Article 199 writ petition").contextCategory, "constitutional");
assert.equal(detectMultiIntent("Draft a Christian divorce petition").contextCategory, "non-muslim");

const issues = splitLegalIssues(evidenceAndVehicleQuestion);
assert.ok(issues.length >= 2, "Multi-issue legal questions must be split for retrieval");
assert.ok(issues.some((issue) => /whatsapp|recording/i.test(issue)));
assert.ok(issues.some((issue) => /vehicle|ownership|accident/i.test(issue)));

assert.match(LEGAL_RELIABILITY_RULES, /Separate each distinct legal issue/);
assert.match(LEGAL_RELIABILITY_RULES, /Never invent, recall, or guess a citation/);
assert.match(LEGAL_RELIABILITY_RULES, /divided into Articles, not sections/);
assert.match(LEGAL_RELIABILITY_RULES, /never write "Section 164 QSO"/);
assert.match(LEGAL_RELIABILITY_RULES, /does not make every private message automatically admissible/);
assert.match(LEGAL_RELIABILITY_RULES, /quotation marks for statutory text only/);
assert.match(LEGAL_RELIABILITY_RULES, /smallest useful set \(normally 1-4\)/);

for (const question of [
  "My tenant has not paid rent for six months. Can I evict him?",
  "A buyer caused an accident after the vehicle sale but before Excise transfer. Who is liable?",
  "Are WhatsApp messages admissible as evidence in a fraud trial?",
  "Can an FIR be quashed when its allegations do not disclose an offence?",
  "Are WhatsApp messages admissible?",
  "My wife wants khula. What remedy is available?",
  "What is Section 295-C PPC?",
]) {
  assert.equal(decideJudgmentRetrieval(question).shouldRetrieve, true, `Judgments should be retrieved for: ${question}`);
}
assert.equal(decideJudgmentRetrieval("Please provide judgments about post-arrest bail").reason, "explicit-request");
assert.equal(decideJudgmentRetrieval("What is natural justice?").shouldRetrieve, false);
assert.equal(decideJudgmentRetrieval("What is an FIR?").shouldRetrieve, false);
assert.equal(decideJudgmentRetrieval("What is the procedure for filing a civil suit?").shouldRetrieve, false);
assert.equal(decideJudgmentRetrieval("What rights does a tenant generally have?").shouldRetrieve, false);
assert.equal(decideJudgmentRetrieval("Where can I create a family law case in TaqiAI?").shouldRetrieve, false);

const platformSource = fs.readFileSync("src/lib/taqi-platform-knowledge.ts", "utf8");
for (const route of [
  "/ai-advisor", "/case-law", "/case-builder", "/statute-search", "/voice-case",
  "/copy-from-photo", "/affidavits", "/agreements", "/applications", "/family-law",
  "/criminal-law", "/property-law", "/civil-law", "/corporate-law", "/tax-law",
  "/immigration-law", "/constitutional-law", "/non-muslim-laws", "/power-of-attorney",
  "/documents", "/lawyer-diary", "/cases", "/chamber", "/translate",
  "/property-transfer/tax-calculator", "/settings",
]) {
  assert.ok(platformSource.includes(`href: "${route}"`), `Missing TaqiAI module route: ${route}`);
}
assert.match(platformSource, /DOCUMENT_SUGGESTIONS/, "Platform guidance must use the complete lightweight document catalog");
assert.match(platformSource, /document\.cat === "court-cases"[\s\S]*?item\.id === "case-builder"/);
assert.match(platformSource, /bana\(\?:na\|ni\|ne\|o\|yen\)\?/);

const suggestionSource = [
  fs.readFileSync("src/lib/document-suggestions.ts", "utf8"),
  fs.readFileSync("src/lib/agreement-catalog.ts", "utf8"),
].join("\n");
for (const category of [
  "affidavit", "agreement", "application", "family-law", "criminal-law",
  "property-law", "civil-law", "corporate-law", "tax-law", "immigration-law",
  "constitutional-law", "non-muslim-laws", "power-of-attorney", "court-cases",
]) {
  assert.match(suggestionSource, new RegExp(`cat:\\s*"${category}"`), `Missing document category: ${category}`);
}

const routeSource = fs.readFileSync("src/app/api/ai/advisor/route.ts", "utf8");
assert.match(routeSource, /getPlatformRecommendation/);
assert.match(routeSource, /decideJudgmentRetrieval\(realQuestion\)/);
assert.match(routeSource, /provisionAnswerRequirements\(realQuestion\)/);
assert.match(routeSource, /verifiedAuthorityGrounding\(realQuestion\)/);
assert.match(routeSource, /groundNow && !verifiedAuthorities\.exclusive/);
assert.match(routeSource, /judgmentAnswerRequirements\(judgmentDecision, sources\.length\)/);
assert.match(routeSource, /GROUNDING_BUDGET_MS = 2_500/);
assert.match(routeSource, /source === "legal-advisor"/);
assert.match(routeSource, /buildAIPrompt\(realQuestion/);
assert.match(routeSource, /export async function GET\(\)/);
assert.match(routeSource, /ready: true/);
assert.match(routeSource, /MAX_MESSAGE_CHARS = 12_000/);
assert.match(routeSource, /MAX_IMAGE_DATA_URL_CHARS = 14_000_000/);
assert.match(routeSource, /SUPPORTED_IMAGE_DATA_URL/);
assert.match(routeSource, /msg\?\.role === "user" \|\| msg\?\.role === "assistant"/);
assert.doesNotMatch(routeSource, /\(!isFollowUp \|\| wantsCaseLaw/);
assert.doesNotMatch(routeSource, /function wantsCaseLaw/);

const judgmentSource = fs.readFileSync("src/lib/judgment-retrieval.ts", "utf8");
assert.match(judgmentSource, /searchAdvisorSectionJudgments/);
assert.match(judgmentSource, /candidate\.reported/);
assert.match(judgmentSource, /requiredMatches/);
assert.match(judgmentSource, /Compact and spaced suffix forms/);
assert.match(judgmentSource, /issueTerms\.some/);
assert.match(judgmentSource, /conceptTerms/);
assert.match(judgmentSource, /focusedSearchQueries/);
assert.match(judgmentSource, /rankedByIssue/);
assert.match(judgmentSource, /selectedIds/);

const judgmentRuntimeSource = fs.readFileSync("src/lib/judgment-db-runtime.ts", "utf8");
assert.match(judgmentRuntimeSource, /ts_headline\('simple'/);
assert.match(judgmentRuntimeSource, /search_excerpt/);
assert.match(judgmentRuntimeSource, /searchAdvisorJudgmentsFastSqlite/);
assert.match(judgmentRuntimeSource, /searchAdvisorSectionJudgments/);

const judgmentDbSource = fs.readFileSync("src/lib/judgment-db.ts", "utf8");
assert.match(judgmentDbSource, /export function searchAdvisorJudgmentsFast/);
assert.match(judgmentDbSource, /snippet\(judgments_fts/);
assert.match(judgmentDbSource, /bm25\(judgments_fts\)/);

const statuteSource = fs.readFileSync("src/lib/statute-retrieval.ts", "utf8");
const statuteDbSource = fs.readFileSync("src/lib/statute-db.ts", "utf8");
const statuteRuntimeSource = fs.readFileSync("src/lib/statute-db-runtime.ts", "utf8");
const legalProvisionReferenceSource = fs.readFileSync("src/lib/legal-provision-reference.ts", "utf8");
assert.match(statuteSource, /Article 164 QSO Qanun-e-Shahadat electronic evidence/);
assert.match(statuteSource, /Motor Vehicles Ordinance registration transfer ownership/);
assert.match(statuteSource, /Section 295-C PPC Pakistan Penal Code derogatory remarks/);
assert.match(statuteSource, /Section 156-A CrPC investigation safeguard Superintendent of Police/);
assert.match(statuteSource, /score >= \(tokens\.length <= 3 \? 1 : 2\)/);
assert.match(statuteSource, /qanun\.\*shahadat\|qanoon\.\*shahadat/);
assert.match(statuteSource, /preferred\.length \? preferred : ranked/);
assert.match(statuteSource, /sectionNo\.startsWith\("Article "\)/);
assert.match(statuteSource, /Quote statutory wording only when those exact words appear/);
assert.match(legalProvisionReferenceSource, /lawCode === "QSO"/);
for (const source of [statuteDbSource, statuteRuntimeSource]) {
  assert.match(source, /const isConstitution = code\.like\.includes\("Constitution"\)/);
  assert.match(source, /reference\.canonical\.replace\(\/\^\(\?:Section\|Article\)/);
  assert.ok(source.includes("(?:\\\\d+\\\\[)?"), "Footnote-marked provisions must be extractable");
  assert.match(source, /lastIndexOf\(hint\.kw\.toLowerCase\(\)\)/);
}
assert.match(statuteDbSource, /whatsapp\|digital\|electronic/);
assert.match(statuteDbSource, /transfer of ownership/);

const clientSource = fs.readFileSync("src/app/(dashboard)/ai-advisor/page.tsx", "utf8");
assert.match(clientSource, /ADVISOR_RESPONSE_TIMEOUT_MS = 20_000/);
assert.match(clientSource, /ADVISOR_STREAM_IDLE_TIMEOUT_MS = 22_000/);
assert.match(clientSource, /Voice transcription took too long/);
assert.match(clientSource, /Preparing a grounded legal answer/);
assert.match(clientSource, /source: "legal-advisor"/);
assert.match(clientSource, /fetch\("\/api\/ai\/advisor", \{/);
assert.match(clientSource, /method: "GET"/);
assert.match(clientSource, /isError: true/);
assert.match(clientSource, /activeAdvisorRequestRef/);
assert.match(clientSource, /setUploadedImage\(currentImage\)/);
assert.match(clientSource, /<textarea/);
assert.match(clientSource, /maxLength=\{MAX_MESSAGE_CHARS\}/);
assert.match(clientSource, /TAQI_LINK_ROUTES\.has\(part\.toLowerCase\(\)\)/);
assert.match(clientSource, /Verified legal authorities/);
assert.match(clientSource, /s\.externalUrl/);
assert.match(clientSource, /noreferrer noopener/);
assert.doesNotMatch(clientSource, /\^\\\/\[a-z0-9-\]\/i\.test\(part\)/);
assert.doesNotMatch(clientSource, /getIntentSystemPrompt/);

const handlersSource = fs.readFileSync("src/lib/intent-handlers.ts", "utf8");
assert.doesNotMatch(handlersSource, /ALL 511 sections memorized|every section memorized|every article memorized/);
assert.doesNotMatch(handlersSource, /Key case|Peter John v|Reshma v|Reeta Kumari|Suo Motu Case 1\/2014/);
assert.doesNotMatch(handlersSource, /PPC 295-C: Derogatory remarks about Holy Prophet - death\/life/);
assert.match(handlersSource, /Rs\. 1,00,000\/- \(Rupees One Lac Only\)/);
assert.match(handlersSource, /function handleConstitutionalCase/);
assert.ok((handlersSource.match(/LEGAL_RELIABILITY_RULES/g) || []).length >= 3, "Reliability rules must wrap every prompt");
assert.match(routeSource, /new Set\(markers\.map\(\(marker\) => marker\.toLowerCase\(\)\)\)\.size >= 2/);

for (const modelFile of [
  "src/lib/gemini-helper.ts",
  "src/lib/gemini.ts",
  "src/app/api/ai/case-prepare/route.ts",
  "src/app/api/ai/smart-draft/route.ts",
  "src/app/api/ai/section-intake/route.ts",
]) {
  const modelSource = fs.readFileSync(modelFile, "utf8");
  assert.match(modelSource, /gemini-3\.5-flash/, `Current primary model missing in ${modelFile}`);
  assert.match(modelSource, /gemini-3\.1-flash-lite/, `Current fallback model missing in ${modelFile}`);
  assert.doesNotMatch(modelSource, /gemini-(?:1\.5|2\.0)|gemini-flash-latest/, `Shutdown model remains in ${modelFile}`);
  assert.ok(
    modelSource.indexOf('"gemini-2.5-flash"') < modelSource.indexOf('"gemini-3.5-flash"'),
    `Low-latency legal model must be tried before the thinking-heavy fallback in ${modelFile}`,
  );
}

const updatesSource = fs.readFileSync("src/lib/legal-updates-reference.ts", "utf8");
assert.match(updatesSource, /punjab-zameen\.gov\.pk\/gpcinfo/);
assert.match(updatesSource, /na\.gov\.pk\/uploads\/documents\/671f74b8da9e0_263\.pdf/);
assert.match(updatesSource, /na\.gov\.pk\/uploads\/documents\/691ec19a6a212_270\.pdf/);
assert.doesNotMatch(updatesSource, /wikipedia\.org|dawn\.com|pakistantoday\.com\.pk/);

console.log("Legal Advisor regression validation passed.");
