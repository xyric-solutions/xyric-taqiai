import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { isIncompleteLegalDocument, normalizeGeneratedHtml, repairIncompleteCourtDocument } from "@/lib/document-html";
import { getCurrentUser } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";

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

async function regenerateCompleteDocument(prompt: string, incompleteHtml: string): Promise<string> {
  const retryPrompt = `${prompt}

The previous draft was incomplete and stopped too early. Regenerate the COMPLETE legal document from the beginning.

Incomplete draft received:
${incompleteHtml}

Mandatory completion requirements:
- Do not stop at "RESPECTFULLY SHEWETH:".
- Add at least 7 complete numbered factual/legal paragraphs after "RESPECTFULLY SHEWETH:".
- Add a full PRAYER clause where applicable.
- Add verification and signature blocks where applicable.
- If any detail is missing, use "___________"; do not omit the section.
- Return ONLY complete valid HTML, no markdown or explanation.`;

  return cleanHtmlOutput(await tryGenerate(retryPrompt));
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

  const prompt = `You are an expert Pakistani legal document drafter with advocate-level expertise. Draft a complete, professional legal document using the information provided.

Today's Date: ${today} — USE THIS DATE in the document wherever a date is required (agreement date, affidavit date, notice date, etc.). Do NOT leave date fields blank.

User's Request: "${userRequest}"
${answersText ? `\nCollected Information:\n${answersText}` : ""}

Output Language: ${isUrdu ? "Urdu (Urdu script only)" : "English"}

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

6. COURT DOCUMENTS must include:
   - Header: IN THE COURT OF ___________ / IN THE HON'BLE HIGH COURT OF ___________
   - Case title: [Petitioner] vs [Respondent]
   - At least 7 numbered paragraphs after "RESPECTFULLY SHEWETH:"
   - PRAYER CLAUSE with specific reliefs
   - ADVOCATE for Petitioner / Applicant signature line
   - Relevant law sections (PPC, CrPC, CPC, Constitution of Pakistan 1973)

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

  const raw = await tryGenerate(prompt);
  let html = cleanHtmlOutput(raw);
  for (let attempt = 0; attempt < 2 && isIncompleteLegalDocument(html); attempt++) {
    html = await regenerateCompleteDocument(prompt, html);
  }
  html = repairIncompleteCourtDocument(html);
  if (isIncompleteLegalDocument(html)) {
    throw new Error("The AI returned an incomplete document. Please generate again.");
  }
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
  Always ask: petitioner_name, respondent_name, court_name, case_facts, relief_sought
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
   - If language is English: placeholders in English (e.g. "Muhammad Ahmed", "House No. 12, Gulberg, Lahore", "35201-1234567-1", "Rs. 25,000")
   - If language is Urdu: placeholders in Urdu script (e.g. "محمد احمد", "مکان نمبر ۱۲، گلبرگ، لاہور", "۳۵۲۰۱-۱۲۳۴۵۶۷-۱", "۲۵،۰۰۰ روپے")
   - Document language is: ${language === "ur" ? "URDU — write all placeholders in Urdu script" : "ENGLISH — write all placeholders in English"}
7. For LONG NARRATIVE fields (brief facts, grounds, reasons, details, description, relief sought, statement of the case, etc.), the placeholder must be a COMPLETE multi-sentence example that walks the lawyer step-by-step through everything to write — do NOT cut it off mid-sentence. Show the full structure using bracketed blanks they replace, e.g. "Marriage was solemnized on [date] at [place]. Haq Mehr was agreed at [amount] as per Nikah Nama. The husband has refused to pay the Haq Mehr despite repeated demands on [dates]. A legal notice was sent on [date] but no payment was made. The petitioner therefore seeks recovery of Rs. [amount] along with costs." Always finish every sentence.

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
          { id: "address", label: "Complete Address / مکمل پتہ", placeholder: "e.g. House 12, Street 4, Lahore", required: true },
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
