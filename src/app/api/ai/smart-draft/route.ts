import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { isIncompleteLegalDocument, normalizeGeneratedHtml } from "@/lib/document-html";
import { getCurrentUser } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { findCaseIntakeProfile, knowledgeBlock } from "@/lib/case-builder-knowledge";
import {
  auditCourtDraftStructure,
  buildCourtReformatPrompt,
  getCourtDraftingStandard,
} from "@/lib/court-drafting-standard";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const MODEL_CANDIDATES = [
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-1.5-flash-latest",
  "gemini-1.5-flash",
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
];

const TRANSIENT_RETRY_ATTEMPTS = 2;

function isTransientGeminiError(message: string): boolean {
  const msg = message.toLowerCase();
  return (
    msg.includes("fetch failed") ||
    msg.includes("network") ||
    msg.includes("econnreset") ||
    msg.includes("etimedout") ||
    msg.includes("timeout") ||
    msg.includes("503") ||
    msg.includes("500") ||
    msg.includes("overloaded") ||
    msg.includes("service unavailable")
  );
}

function isFallbackGeminiError(message: string): boolean {
  const msg = message.toLowerCase();
  return (
    msg.includes("429") ||
    msg.includes("quota") ||
    msg.includes("resource_exhausted") ||
    msg.includes("404") ||
    msg.includes("not found")
  );
}

function getDocumentGenerationError(message: string): { error: string; status: number } {
  const msg = message.toLowerCase();

  if (msg.includes("429") || msg.includes("quota") || msg.includes("exhausted")) {
    return {
      error: "AI quota exhausted. Please wait a moment and try again.",
      status: 429,
    };
  }

  if (msg.includes("api_key") || msg.includes("401") || msg.includes("403")) {
    return {
      error: "Gemini API key is invalid. Please set the correct key in the .env.local file.",
      status: 401,
    };
  }

  if (isTransientGeminiError(message)) {
    return {
      error: "The AI service is temporarily unavailable. Please check your internet connection and try again.",
      status: 503,
    };
  }

  return {
    error: "Document generation failed. Please try again.",
    status: 500,
  };
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function tryGenerate(prompt: string, modelIndex = 0, attempt = 0): Promise<string> {
  const modelName = MODEL_CANDIDATES[modelIndex];
  if (!modelName) throw new Error("All Gemini models exhausted. Please wait or use a different API key.");

  try {
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "";

    if (isTransientGeminiError(msg) && attempt < TRANSIENT_RETRY_ATTEMPTS) {
      console.log(`[Gemini] ${modelName} network issue, retrying...`);
      await sleep(700 * (attempt + 1));
      return tryGenerate(prompt, modelIndex, attempt + 1);
    }

    if (isFallbackGeminiError(msg) || isTransientGeminiError(msg)) {
      console.log(`[Gemini] ${modelName} failed, trying next...`);
      return tryGenerate(prompt, modelIndex + 1, 0);
    }

    throw err;
  }
}

// Illegal document keywords - AI refuses these
const ILLEGAL_KEYWORDS = [
  "fake affidavit", "forged", "false affidavit", "fake noc", "bogus", "fraud document",
  "fabricated", "fake certificate", "counterfeit", "jali", "جعلی", "جھوٹا حلف نامہ",
];

function isIllegalRequest(text: string): boolean {
  const lower = text.toLowerCase();
  return ILLEGAL_KEYWORDS.some((k) => lower.includes(k));
}

// Count blanks in generated HTML
function countBlanks(html: string): number {
  return (html.match(/___________/g) || []).length;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function labelFromKey(key: string): string {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
    .replace(/\bCnic\b/g, "CNIC")
    .replace(/\bFir\b/g, "FIR");
}

function findAnswer(answers: Record<string, string>, patterns: RegExp[]): string {
  for (const [key, value] of Object.entries(answers)) {
    if (!value?.trim()) continue;
    if (patterns.some((pattern) => pattern.test(key))) return value.trim();
  }
  return "___________";
}

function splitAuthorities(value: string | undefined): string[] {
  if (!value?.trim()) return [];
  return value
    .split(";")
    .map((item) => item.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .slice(0, 5);
}

function fallbackLegalDocument(
  userRequest: string,
  answers: Record<string, string>
): string {
  const standard = getCourtDraftingStandard(userRequest);
  const today = escapeHtml(todayFormatted());
  const courtName = escapeHtml(findAnswer(answers, [/court/i, /authority/i]));
  const district = escapeHtml(findAnswer(answers, [/district/i, /city/i, /place/i]));
  const clientName = escapeHtml(findAnswer(answers, [/client.*name/i, /petitioner.*name/i, /applicant.*name/i, /complainant.*name/i, /^full_name$/i]));
  const clientFather = escapeHtml(findAnswer(answers, [/client.*father/i, /petitioner.*father/i, /applicant.*father/i, /father_name/i]));
  const clientCnic = escapeHtml(findAnswer(answers, [/client.*cnic/i, /petitioner.*cnic/i, /applicant.*cnic/i, /\bcnic\b/i]));
  const clientAddress = escapeHtml(findAnswer(answers, [/client.*address/i, /petitioner.*address/i, /applicant.*address/i, /\baddress\b/i]));
  const opponentName = escapeHtml(findAnswer(answers, [/opponent.*name/i, /respondent.*name/i, /accused.*name/i, /defendant.*name/i]));
  const opponentFather = escapeHtml(findAnswer(answers, [/opponent.*father/i, /respondent.*father/i, /accused.*father/i, /defendant.*father/i]));
  const opponentAddress = escapeHtml(findAnswer(answers, [/opponent.*address/i, /respondent.*address/i, /accused.*address/i, /defendant.*address/i]));
  const firNo = escapeHtml(findAnswer(answers, [/fir/i, /case.*no/i, /case.*number/i]));
  const policeStation = escapeHtml(findAnswer(answers, [/police/i, /station/i, /thana/i]));
  const relief = escapeHtml(findAnswer(answers, [/relief/i, /prayer/i, /direction/i]));
  const facts = escapeHtml(findAnswer(answers, [/facts/i, /case_facts/i, /background/i, /occurrence/i, /details/i]));
  const authorities = splitAuthorities(answers.research_guidance_from_judgments);
  const adverseAuthorities = splitAuthorities(answers.adverse_judgments_to_distinguish);
  const provided = Object.entries(answers)
    .filter(([, value]) => value?.trim())
    .slice(0, 18)
    .map(([key, value]) => `<li><strong>${escapeHtml(labelFromKey(key))}:</strong> ${escapeHtml(value.trim())}</li>`)
    .join("");

  if (!standard.isCourtDocument) {
    return `
<h2>${escapeHtml(userRequest || "LEGAL DOCUMENT")}</h2>
<p><strong>Date:</strong> ${today}</p>
<h3>PARTICULARS</h3>
<ol>${provided || "<li>Relevant particulars: ___________</li>"}</ol>
<h3>RECITALS AND FACTS</h3>
<ol>
  <li>The document is prepared on the basis of the information supplied by the user. Missing particulars are intentionally left as ___________ for later completion.</li>
  <li>${facts}</li>
</ol>
<h3>OPERATIVE TERMS</h3>
<ol>
  <li>The parties shall act in accordance with the applicable Pakistani law and the facts stated above.</li>
  <li>Any missing names, dates, addresses, amounts, descriptions, and annexure references shall be completed before execution or filing.</li>
</ol>
<h3>SIGNATURE</h3>
<p>___________</p>`;
  }

  const authorityItems = authorities.length
    ? authorities.map((authority) => `<li>The authenticated database authority ${escapeHtml(authority)} may be relied upon only for the specific legal proposition reflected in its supplied ratio and only where factually applicable.</li>`).join("")
    : "<li>No authenticated judgment citation is inserted because no selected judgment was supplied for this ground. The argument is framed on statute, legal ingredients, and supplied facts only.</li>";
  const adverseItems = adverseAuthorities.length
    ? adverseAuthorities.map((authority) => `<li>The potentially adverse authenticated authority ${escapeHtml(authority)} should be distinguished on facts, evidence, procedural posture, or the exact statutory ingredient in issue.</li>`).join("")
    : "<li>No adverse selected authority was supplied. Any authority later added by counsel should be addressed in the relevant ground instead of in a generic citation list.</li>";

  return `
<h2>IN THE COURT OF ${courtName}${district !== "___________" ? `, ${district}` : ""}</h2>
<p><strong>${escapeHtml(standard.label)} No. ___________ of 20__</strong></p>
<p>${clientName} S/o ${clientFather}, CNIC No. ${clientCnic}, R/o ${clientAddress} .......... Petitioner / Applicant / Complainant</p>
<p><strong>VERSUS</strong></p>
<p>${opponentName} S/o ${opponentFather}, R/o ${opponentAddress} .......... Respondent / Accused / Opposite Party</p>
<h2>${escapeHtml(standard.label.toUpperCase())}</h2>
<p><strong>UNDER THE RELEVANT PROVISIONS OF PAKISTANI LAW INCLUDING THE SECTIONS IDENTIFIED IN THE CASE BUILDER</strong></p>
<h3>RESPECTFULLY SHEWETH:</h3>
<h3>${escapeHtml(standard.orderedHeadings[0] || "CASE PARTICULARS")}</h3>
<ol>
  <li>The petitioner/applicant/complainant seeks the indulgence of this Honourable Court in respect of the matter described in the Case Builder request: ${escapeHtml(userRequest)}.</li>
  <li>FIR/case number is ${firNo}; police station or relevant forum is ${policeStation}; remaining procedural particulars, if any, are left as ___________.</li>
</ol>
<h3>${escapeHtml(standard.orderedHeadings[1] || "PRELIMINARY SUBMISSIONS")}</h3>
<ol>
  <li>The present draft is prepared from supplied facts only. Every missing fact, date, document number, annexure mark, and procedural history item is deliberately shown as ___________.</li>
  <li>The matter is maintainable before the competent forum subject to completion of jurisdictional, limitation, and court-fee particulars by counsel before filing.</li>
</ol>
<h3>${escapeHtml(standard.orderedHeadings[2] || "FACTS OF THE CASE")}</h3>
<ol>
  <li>${facts}</li>
  <li>The available record and supporting documents are: ___________. The exact annexure numbers shall be inserted after review of the file.</li>
  <li>The cause of action arose when the facts stated above occurred and continued through the refusal, omission, accusation, or threatened legal consequence complained of.</li>
</ol>
<h3>${escapeHtml(standard.orderedHeadings[3] || "MAINTAINABILITY, JURISDICTION AND LIMITATION")}</h3>
<ol>
  <li>This Honourable Court has jurisdiction subject to the supplied court and district particulars. Any missing territorial or pecuniary facts shall be completed before filing.</li>
  <li>The matter is within limitation, or delay if any requires explanation as follows: ___________.</li>
</ol>
<h3>${escapeHtml(standard.orderedHeadings[4] || "LEGAL GROUNDS")}</h3>
<ol>
  <li>The essential statutory ingredients must be strictly proved or satisfied according to the applicable law, and the supplied facts should be tested against each ingredient separately.</li>
  <li>The opposing version is liable to be challenged on the basis of omissions, contradictions, absence of supporting material, mala fide, jurisdictional defect, procedural illegality, or failure to satisfy the relevant statutory threshold, as applicable.</li>
  ${authorityItems}
  ${adverseItems}
</ol>
<h3>${escapeHtml(standard.orderedHeadings[5] || "INTERIM RELIEF")}</h3>
<ol>
  <li>Interim protection, if required, may be sought to preserve the subject matter, personal liberty, record, possession, custody, status quo, or lawful process pending final decision: ___________.</li>
</ol>
<h3>${escapeHtml(standard.orderedHeadings[6] || "PRAYER")}</h3>
<ol>
  <li>It is respectfully prayed that this Honourable Court may graciously grant the principal relief sought: ${relief}.</li>
  <li>Any other relief deemed just and proper in the circumstances may also be granted.</li>
</ol>
<h3>SIGNATURE</h3>
<p>___________<br>ADVOCATE<br>for the Petitioner / Applicant / Complainant</p>
<h3>VERIFICATION</h3>
<p>Verified on oath at ___________ on this ${today} that the contents of the above paras are true and correct to the best of knowledge and belief, and nothing material has been concealed.</p>
<p>___________<br>Petitioner / Deponent</p>
<h3>AFFIDAVIT</h3>
<p>I, ${clientName}, do hereby solemnly affirm that the facts stated in the accompanying pleading are true and correct to the best of my knowledge and belief.</p>
<p>___________<br>Deponent</p>
<h3>LIST OF ANNEXURES</h3>
<ol>
  <li>Copy of FIR / complaint / impugned order / relevant document: Annexure ___________.</li>
  <li>Supporting documents, if any: Annexure ___________.</li>
</ol>`;
}

async function regenerateCompleteDocument(prompt: string, incompleteHtml: string): Promise<string> {
  const retryPrompt = `${prompt}

The previous draft was incomplete and stopped too early. Regenerate the COMPLETE legal document from the beginning.

Incomplete draft received:
${incompleteHtml}

Mandatory completion requirements:
- Do not stop at "RESPECTFULLY SHEWETH:".
- Prepare a complete professional court draft, not a short skeletal draft.
- Add normally 12-18 complete numbered factual/legal/ground paragraphs after "RESPECTFULLY SHEWETH:" when the provided facts allow it.
- Cover every necessary area that fits the document type: facts, detailed facts, jurisdiction/maintainability, limitation if relevant, grounds, legal grounds, interim relief if relevant, and final relief.
- Add a full PRAYER clause where applicable.
- Add verification and signature blocks where applicable.
- If any detail is missing, use "___________"; do not omit the section.
- Do not add irrelevant padding or invented facts merely to increase length.
- Return ONLY complete valid HTML, no markdown or explanation.`;

  return cleanHtmlOutput(await tryGenerate(retryPrompt));
}

async function enforceCourtDraftingStandard(
  prompt: string,
  html: string,
  request: string
): Promise<string> {
  const standard = getCourtDraftingStandard(request);
  if (!standard.isCourtDocument) return html;

  const firstAudit = auditCourtDraftStructure(html, standard);
  if (firstAudit.valid) return html;

  try {
    const corrected = cleanHtmlOutput(await tryGenerate(
      buildCourtReformatPrompt(prompt, html, standard, firstAudit.issues)
    ));
    const finalAudit = auditCourtDraftStructure(corrected, standard);
    if (!finalAudit.valid) {
      console.warn("Court draft structural audit still has issues:", finalAudit.issues);
    }
    return corrected || html;
  } catch (err) {
    console.warn("Court draft reformat failed; returning original draft:", err);
    return html;
  }
}

function cleanHtmlOutput(text: string): string {
  return normalizeGeneratedHtml(text);
}

function todayFormatted(): string {
  const d = new Date();
  const day = d.getDate();
  const month = d.toLocaleString("en-US", { month: "long" });
  const year = d.getFullYear();
  return `${day}th day of ${month}, ${year}`;
}

function hasExplicitCourtName(userRequest: string, answers: Record<string, string>): boolean {
  const answerHasCourt = Object.entries(answers).some(([key, value]) =>
    Boolean(value?.trim()) && /\bcourt\b/i.test(key)
  );
  if (answerHasCourt) return true;

  return /Court Name for document heading:\s*(?!_{3,}|\s*$).+/i.test(userRequest);
}

function blankInferredCourtHeading(html: string): string {
  return html
    .replace(/IN THE COURT OF(?: THE)?(?: HON'?BLE\s+)?[^<\n]{3,160}/i, "IN THE COURT OF ___________")
    .replace(/IN THE HON'?BLE HIGH COURT OF[^<\n]{3,160}/i, "IN THE HON'BLE HIGH COURT OF ___________");
}

async function generateSmartDocument(
  userRequest: string,
  answers: Record<string, string>,
  language: string
): Promise<{ html: string; filledFields: string[]; blankCount: number }> {
  const isUrdu = language === "ur";
  const filledEntries = Object.entries(answers).filter(([, v]) => v?.trim());
  const filledFields = filledEntries.map(([k, v]) => `${k}: ${v}`);
  const answersText = filledEntries
    .map(([k, v]) => `- ${k}: ${v}`)
    .join("\n");

  const today = todayFormatted();
  const courtStandard = getCourtDraftingStandard(userRequest);
  const intakeProfile = findCaseIntakeProfile({ sections: userRequest, documentNeeded: userRequest });
  const corpusKnowledge = knowledgeBlock(intakeProfile);

  const prompt = `You are an expert Pakistani legal document drafter with advocate-level expertise. Draft a complete, professional legal document using the information provided.

Today's Date: ${today} — USE THIS DATE in the document wherever a date is required (agreement date, affidavit date, notice date, etc.). Do NOT leave date fields blank.

User's Request: "${userRequest}"
${answersText ? `\nCollected Information:\n${answersText}` : ""}

Output Language: ${isUrdu ? "Urdu (Urdu script only)" : "English"}
${corpusKnowledge ? `\nANONYMIZED CORPUS-DERIVED LEGAL KNOWLEDGE:\n${corpusKnowledge}\n` : ""}
${courtStandard.prompt}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CRITICAL RULES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Output ONLY valid HTML — no markdown, no explanations outside HTML tags
2. Use ALL provided information — do not ignore any collected field
3. ███ STRICT NO-FABRICATION RULE — MOST IMPORTANT ███
   - ONLY use information explicitly provided by the user
   - If the user did NOT provide a value (name, time, date, address, amount, section, etc.) → write "___________" as blank
   - NEVER invent, guess, or assume ANY detail not given by the user
   - NEVER fill in a name, time, place, section number, or any fact on your own
   - Example: user gave name but no time → leave time as "___________"
   - Example: user gave facts but no accused name → leave accused name as "___________"
   - A document with many blanks is CORRECT — a document with invented details is WRONG
   - NEVER add notes like "[not provided]", "[missing]", asterisks (*), or explanations for blanks — just "___________"

4. DRAFT THE EXACT DOCUMENT TYPE REQUESTED:
   - Bail Application → under Section 497/498 CrPC with all grounds
   - Petition / Suit → IN THE COURT OF ___ with proper case heading
   - Written Statement → paragraph-by-paragraph Jawab Dawa
   - Legal Notice → formal notice with specific demand and reply deadline
   - Writ Petition → under Article 199 Constitution of Pakistan
   - Appeal → with numbered Grounds of Appeal
   - Affidavit → sworn statement ending at deponent's signature only
   - Rent/Sale/Loan Agreement → with all clauses, parties, terms, signatures
   - Partnership Deed → with capital, profit/loss ratio, duties
   - Power of Attorney → with specific authority scope and clauses
   - Application → formal letter to relevant authority
   - Talaq Notice (1st/2nd/3rd) → proper Islamic/legal divorce notice per Muslim Family Laws Ordinance 1961
   - Khula Petition → family court petition with proper grounds
   - NOC → formal No Objection Certificate with scope
   - Undertaking → formal undertaking letter

5. NEVER substitute document types. If user asked for agreement — write AGREEMENT, not affidavit.

6. COURT DOCUMENTS must follow the injected CORPUS-BACKED COURT DRAFTING STANDARD exactly. Its opening order and family-specific headings override every general example below. These rules supplement that standard:
   a. CAUSE-TITLE / HEADING:
      - IN THE COURT OF ___________ / IN THE HON'BLE HIGH COURT OF ___________ (use user's provided court + district/city exactly)
      - Case number line on its own: e.g. "Bail Application No. _______ of 20__" / "Writ Petition No. _______ of 20__" / "Suit No. _______ of 20__" (correct document type, year blank as "20__" if not given)
      - Statute line: "(Under Section ___ ...)" / "(Under Article 199 of the Constitution of Pakistan, 1973)" — use the correct enabling provision for the document type
   b. MEMO OF PARTIES (case title): full description, one party per line —
      "[Name] S/o [Father], R/o [Address] .......... Petitioner/Applicant/Plaintiff"
      "VERSUS"
      "[Name] S/o [Father], R/o [Address] .......... Respondent/Complainant/Defendant"
      Use "___________" for any part not provided. Add "The State" as respondent in criminal matters when no private respondent is given.
   c. Subject line naming the exact document, followed by a separate enabling-provision line: e.g. "APPLICATION FOR POST-ARREST BAIL" then "UNDER SECTION 497 Cr.P.C."
   d. "RESPECTFULLY SHEWETH:" followed by NUMBERED FACTS paragraphs (1, 2, 3 …) — introductory facts, chronology, FIR/case/order details, what happened and when. Facts only state WHAT happened; do NOT argue law here.
   e. A SEPARATE "GROUNDS:" section after the facts — LETTERED paragraphs (a), (b), (c) … each a distinct legal argument (maintainability, jurisdiction, limitation if relevant, illegality/infirmity, merits, why relief is justified). This is where the law is argued — keep it distinct from Facts.
   f. "PRAYER:" — "It is, therefore, most respectfully prayed that …" with specific, numbered reliefs tailored to the document type, plus "any other relief deemed fit may also be granted."
   g. Date and place line, then signature block on the right:
      "___________
       ADVOCATE
       for the Petitioner/Applicant"
   h. VERIFICATION clause (for plaints, petitions, writs, applications on oath): a separate block —
      "VERIFICATION:
       Verified on oath at ___________ on this ___ day of ___________, 20__ that the contents of paras No. ___ to ___ are true and correct to the best of my knowledge and belief and nothing material has been concealed therefrom.
       ___________
       Petitioner / Deponent"
   - Body length: develop fully — bail, writ, civil suit, appeal, quashment, revision, and contested petitions normally need 8-15 fact paragraphs plus well-reasoned grounds. Simple applications may be proportionately shorter.
   - Do NOT add irrelevant filler, repeated paragraphs, or invented facts just to increase length. If a necessary fact is missing, keep "___________".
   - Relevant law sections must be accurate (PPC, Cr.P.C., CPC, Qanun-e-Shahadat 1984, Constitution of Pakistan 1973, relevant special laws).
   - NEVER assume Lahore, Karachi, Islamabad, or any other city if the user did not provide it.
   - NEVER infer the court rank/designation from document type. Do not write Sessions Judge, Additional Sessions Judge, Civil Judge, Family Court, or High Court unless the user provided it. If court name or district/city is missing, use "___________".
   - If authenticated judgments/citations and ratios are provided, apply each materially relevant authority within the specific legal ground it supports. Never alter its citation metadata or claimed ratio.
   - If the request states that no actual matching judgments were found, do NOT invent reported cases, citations, court names, or case titles. Draft from statutes, legal ingredients, collected facts, analogous legal principles, and AI-generated legal reasoning only.
   - Clearly distinguish actual cited judgments from AI-generated statutory/legal reasoning. If no actual citations were provided, do not present AI reasoning as case law.
   - DO NOT add a standalone reliance paragraph, citation dump, or generic list of authorities. Integrate authenticated authority only into the exact ground it supports.
   - DO NOT list supporting judgments merely because they were used to prepare the case.

7. AFFIDAVITS must include:
   - Title: AFFIDAVIT
   - "I, [name], son/daughter of [father], CNIC No. [cnic], resident of [address], do hereby solemnly affirm and declare..."
   - Numbered declaration paragraphs
   - Signature line label rules (CRITICAL — never write the deponent's actual name under the signature):
       * Urdu document  → write ONLY "من محلف" under the signature line
       * English document → write ONLY "Deponent" under the signature line
   - NO notary, NO witnesses section, NO name in parentheses under signature

8. AGREEMENTS must include:
   - Title and date at top
   - "THIS AGREEMENT is made and entered into on [date] between:"
   - PARTY 1 and PARTY 2 complete details in box format
   - Numbered clauses covering all agreed terms
   - Witnesses: simple "Witness 1: ___________  Witness 2: ___________" lines only
   - NO notary attestation

9. TALAQ NOTICES must follow Muslim Family Laws Ordinance 1961:
   - State which notice number (First/Second/Third)
   - Include Union Council notification requirement
   - 90-day reconciliation period for 1st and 2nd notices
   - Third notice = final and irrevocable

10. Use clean HTML tags only: <h2>, <h3>, <p>, <strong>, <table>, <hr>, <br>, <ol>, <li>.
    Do NOT include <style> tags, body padding, page margins, custom CSS, page breaks, or font-size rules.
    The application will apply the same legal-page spacing to every document.

11. URDU DOCUMENTS — RTL NUMBER FIX (CRITICAL):
    In RTL Urdu text, numbers (CNIC, phone, dates, amounts) display in REVERSED order without special handling.
    ALWAYS wrap ALL numbers in <bdi> tags so they display left-to-right correctly inside RTL text.
    Examples:
      شناختی کارڈ نمبر <bdi>35202-1234567-5</bdi>
      فون نمبر <bdi>0300-1234567</bdi>
      تاریخ <bdi>01-01-2024</bdi>
      رقم <bdi>Rs. 25,000</bdi>
    NEVER write CNIC, phone numbers, dates, or amounts as plain text in Urdu documents — always use <bdi> tags.

Generate the complete document as HTML now:`;

  let html: string;
  try {
    const raw = await tryGenerate(prompt);
    html = cleanHtmlOutput(raw);
  } catch (err) {
    console.warn("AI generation failed; returning deterministic fallback draft:", err);
    html = fallbackLegalDocument(userRequest, answers);
  }
  for (let attempt = 0; attempt < 2 && isIncompleteLegalDocument(html); attempt++) {
    try {
      html = await regenerateCompleteDocument(prompt, html);
    } catch (err) {
      console.warn("Document completion retry failed; returning best available draft:", err);
      break;
    }
  }
  if (!hasExplicitCourtName(userRequest, answers)) {
    html = blankInferredCourtHeading(html);
  }
  if (isIncompleteLegalDocument(html)) {
    console.warn("Generated document may still be incomplete after retries.");
  }
  html = await enforceCourtDraftingStandard(prompt, html, userRequest);
  const blankCount = countBlanks(html);
  return { html, filledFields, blankCount };
}

export async function POST(request: NextRequest) {
  const session = await getCurrentUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!rateLimit(session.userId, 20, 60_000)) {
    return NextResponse.json({ error: "Too many requests. Please wait a minute and try again." }, { status: 429 });
  }

  try {
    const { action, userRequest, answers, language } = await request.json();

    if (!userRequest?.trim()) {
      return NextResponse.json({ error: "Please describe what document you need." }, { status: 400 });
    }

    if (userRequest.length > 5000) {
      return NextResponse.json({ error: "Request is too long (max 5000 characters)" }, { status: 400 });
    }

    // Step 1: Analyze user request, decide if questions needed
    if (action === "analyze") {
      const analyzePrompt = `You are a professional Pakistani Legal Drafting Assistant. Your job is to ALWAYS collect required information before drafting any legal document.

User Request: "${userRequest}"

STEP 1 — Identify the exact document type.
STEP 2 — Extract any information already provided in the request.
STEP 3 — Determine which essential fields are still missing and ask for them.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MANDATORY QUESTION RULES BY DOCUMENT TYPE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FOR AFFIDAVITS (General, Property, Identity, Income, Character, Residence, NOC, Undertaking, Heirship, Khula, etc.):
  Always ask: deponent_name, father_name (REQUIRED — never skip), cnic, address
  Also ask based on type:
    - Property affidavit: property_description
    - NOC/Vehicle: vehicle_details (make, model, registration)
    - Heirship: deceased_name, relationship
    - General: affidavit_purpose (specific subject of the affidavit)

FOR AGREEMENTS (Rent, Sale, Partnership, Employment, Loan, Service, MOU, NDA, etc.):
  MANDATORY for BOTH parties — ask ALL of these, never skip:
    party1_name      → "Name of Seller / Owner / First Party"
    party1_father    → "Father's Name of Seller / First Party"   ← REQUIRED, never skip
    party1_cnic      → "CNIC of Seller / First Party"
    party1_address   → "Address of Seller / First Party"
    party2_name      → "Name of Buyer / Tenant / Second Party"
    party2_father    → "Father's Name of Buyer / Second Party"   ← REQUIRED, never skip
    party2_cnic      → "CNIC of Buyer / Second Party"
    party2_address   → "Address of Buyer / Second Party"
  Financial: amount (rent/price/loan amount), advance_deposit
  Terms: start_date, duration
  Property (if rent/sale): property_address, property_type, property_size
  Special: special_conditions (any extra clauses, optional)
  NOTE: For agreements allow up to 12 questions — party details are all required

FOR APPLICATIONS (FIR, Bail, Court Application, NOC, Character Certificate, DC Office, etc.):
  Always ask: applicant_name, father_name, cnic, address
  Also ask: authority_name (to whom — police station / court / DC office), subject_matter (what the application is about), facts (brief description of case/incident)

FOR COURT CASES / PETITIONS (Bail, Writ, Civil Suit, Criminal Complaint, Appeal, Notice):
  Always ask: petitioner_name, petitioner_father_name, petitioner_cnic, petitioner_address, respondent_name, court_name, district_city, case_facts, relief_sought
  The court heading must be based on court_name + district_city. Never default to Lahore.
  If court_name is missing, ask for it or leave it blank. Do not infer Sessions Judge/Civil Judge/High Court from the document type.
  If respondent is a private person and details are missing, also ask: respondent_father_name, respondent_cnic, respondent_address
  For bail: section_charged, police_station, date_of_arrest
  For legal notice: notice_subject, demand, deadline_days

FOR FAMILY LAW (Khula, Talaq, Custody, Maintenance, Nikah Nama, Divorce Notice):
  Always ask: husband_name, wife_name, marriage_date, nikah_registration
  For talaq notices: talaq_number (1st/2nd/3rd), date_of_notice
  For custody: child_names, child_ages
  For maintenance: monthly_amount_demanded

FOR POWER OF ATTORNEY:
  Always ask: principal_name, principal_cnic, attorney_name, attorney_cnic, authority_scope, purpose

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STRICT RULES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. NEVER return empty "questions" array for affidavits, agreements, or applications — at minimum always ask for names, CNIC, and address if not already given.
2. Extract information already provided in user's request into "extractedInfo" — do NOT ask again for fields already given.
3. Ask only the truly missing fields — maximum 8 questions for most documents, up to 12 for agreements (because both party full details are mandatory).
4. Write question labels in the SAME LANGUAGE the user used (Urdu, Roman Urdu, or English).
5. Field IDs must be snake_case English (e.g. "seller_name", "property_address", "rent_amount").
6. Placeholders must be realistic Pakistani examples — written in the DOCUMENT LANGUAGE:
   - If language is English: placeholders in English (e.g. "Muhammad Ahmed", "House No. 12, Civil Lines, Faisalabad", "35201-1234567-1", "Rs. 25,000")
   - If language is Urdu: placeholders in Urdu script (e.g. "محمد احمد", "مکان نمبر ۱۲، گلبرگ، لاہور", "۳۵۲۰۱-۱۲۳۴۵۶۷-۱", "۲۵،۰۰۰ روپے")
   - Document language is: ${language === "ur" ? "URDU — write all placeholders in Urdu script" : "ENGLISH — write all placeholders in English"}
7. For LONG NARRATIVE fields (brief facts, grounds, reasons, details, description, relief sought, statement of the case, etc.), keep the placeholder SHORT — only 1 to 2 sentences covering the main points, using bracketed blanks the lawyer replaces. Do NOT write long, multi-line paragraphs. e.g. "Marriage was solemnized on [date]. The husband refused to pay the agreed Haq Mehr of Rs. [amount] despite repeated demands, so the petitioner seeks its recovery." Keep it brief and finish every sentence.

SECTION NUMBER VALIDATION:
- If the user mentioned a specific law section (e.g. "Section 302", "497 CrPC", "420 PPC"), verify if it is correct for the document type.
- If the section seems WRONG (e.g. user said "Section 500 for theft" but correct is 379 PPC), add a "sectionWarning" field in your JSON response.
- Format: "sectionWarning": "You mentioned Section 500 PPC but for theft the correct section is 379 PPC. AI will use Section 500 as you provided — confirm to proceed."
- If sections are correct or not mentioned, omit "sectionWarning" from the JSON.

Return ONLY a valid JSON object — no markdown, no explanation, nothing else:
{
  "documentType": "Document name in English",
  "documentTypeUrdu": "دستاویز کا نام اردو میں",
  "extractedInfo": { "field_id": "value already provided by user" },
  "questions": [
    { "id": "field_id", "label": "Question label in user's language", "placeholder": "realistic Pakistani example", "required": true }
  ],
  "sectionWarning": "optional — only if wrong section detected"
}`;

      // ── Illegal document check ──
      if (isIllegalRequest(userRequest)) {
        return NextResponse.json(
          { error: "This request appears to be for an illegal or fraudulent document. AI cannot generate this." },
          { status: 403 }
        );
      }

      const raw = await tryGenerate(analyzePrompt);

      let parsed: {
        documentType?: string;
        documentTypeUrdu?: string;
        extractedInfo?: Record<string, string>;
        questions?: { id: string; label: string; placeholder: string; required: boolean }[];
        sectionWarning?: string;
      };
      try {
        const cleaned = raw.replace(/```json\n?/gi, "").replace(/```\n?/gi, "").trim();
        parsed = JSON.parse(cleaned);
      } catch {
        const result = await generateSmartDocument(userRequest, {}, language || "en");
        return NextResponse.json({ action: "generated", html: result.html, blankCount: result.blankCount, documentType: "" });
      }

      const alwaysAskTypes = ["affidavit", "agreement", "application", "power of attorney", "poa", "deed", "contract", "notice", "petition", "suit"];
      const docTypeLower = (parsed.documentType || "").toLowerCase();
      const requestLower = userRequest.toLowerCase();
      const mustAsk = alwaysAskTypes.some(t => docTypeLower.includes(t) || requestLower.includes(t));

      if (!mustAsk && (!parsed.questions || parsed.questions.length === 0)) {
        const result = await generateSmartDocument(userRequest, parsed.extractedInfo || {}, language || "en");
        return NextResponse.json({
          action: "generated",
          html: result.html,
          blankCount: result.blankCount,
          documentType: parsed.documentType || "",
        });
      }

      if (parsed.questions && parsed.questions.length === 0 && mustAsk) {
        parsed.questions = [
          { id: "full_name", label: "Full Name / پورا نام", placeholder: "e.g. Muhammad Ahmed", required: true },
          { id: "father_name", label: "Father's Name / والد کا نام", placeholder: "e.g. Muhammad Ali", required: true },
          { id: "cnic", label: "CNIC Number", placeholder: "e.g. 35201-1234567-1", required: true },
          { id: "address", label: "Complete Address / مکمل پتہ", placeholder: "e.g. House 12, Street 4, Faisalabad", required: true },
        ];
      }

      return NextResponse.json({
        action: "ask",
        documentType: parsed.documentType || "",
        documentTypeUrdu: parsed.documentTypeUrdu || "",
        extractedInfo: parsed.extractedInfo || {},
        questions: parsed.questions,
        sectionWarning: parsed.sectionWarning || null,
      });
    }

    // Step 2: Generate with user's answers
    if (action === "generate") {
      const result = await generateSmartDocument(userRequest, answers || {}, language || "en");
      return NextResponse.json({ action: "generated", html: result.html, blankCount: result.blankCount });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: unknown) {
    console.error("Smart draft error:", error);
    const message = error instanceof Error ? error.message : "";
    const friendly = getDocumentGenerationError(message);

    return NextResponse.json(
      { error: friendly.error },
      { status: friendly.status }
    );
  }
}
