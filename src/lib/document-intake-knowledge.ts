export type DocumentQuestionCategory =
  | "identity"
  | "document"
  | "facts"
  | "terms"
  | "property"
  | "court"
  | "relief"
  | "evidence"
  | "execution"
  | "optional"
  | "template";

export interface DocumentIntakeQuestion {
  id: string;
  label: string;
  placeholder: string;
  required: boolean;
  category: DocumentQuestionCategory;
  source: "profile" | "template" | "ai";
}

export interface DocumentIntakeProfile {
  id: string;
  title: string;
  categories: string[];
  family: string;
  aliases: string[];
  patterns: RegExp[];
  questions: DocumentIntakeQuestion[];
  formatChecklist: string[];
  riskFlags: string[];
  draftingGuidance: string;
  templateHints: string[];
}

export interface DocumentIntakeInput {
  category?: string;
  userRequest?: string;
}

export const MAX_DOCUMENT_CLASSIFICATION_LENGTH = 1000;

export function resolvePrimaryDocumentRequest(documentRequest: unknown, userRequest: string): string {
  const candidate = typeof documentRequest === "string" && documentRequest.trim()
    ? documentRequest.trim()
    : userRequest.trim();
  if (candidate.length <= MAX_DOCUMENT_CLASSIFICATION_LENGTH) return candidate;

  const firstParagraph = candidate.split(/\n\s*\n/, 1)[0].trim();
  if (firstParagraph && firstParagraph.length <= MAX_DOCUMENT_CLASSIFICATION_LENGTH) {
    return firstParagraph;
  }
  return candidate.slice(0, MAX_DOCUMENT_CLASSIFICATION_LENGTH).trimEnd();
}

export function filterDocumentIntakeValues(
  values: Record<string, unknown>,
  questions: DocumentIntakeQuestion[]
): Record<string, string> {
  const allowedIds = new Set(questions.map((question) => question.id));
  const filteredValues: Record<string, string> = {};
  for (const [id, value] of Object.entries(values)) {
    if (allowedIds.has(id) && typeof value === "string" && value.trim()) {
      filteredValues[id] = value;
    }
  }
  return filteredValues;
}

const q = (
  id: string,
  label: string,
  placeholder: string,
  required = true,
  category: DocumentQuestionCategory = "facts"
): DocumentIntakeQuestion => ({
  id,
  label,
  placeholder,
  required,
  category,
  source: "profile",
});

const partyIdentityQuestions = [
  q("client_name", "Client / requesting party name", "e.g. Muhammad Ahmed", true, "identity"),
  q("client_father_name", "Father's / spouse name", "e.g. Muhammad Ali", false, "identity"),
  q("client_cnic", "CNIC or registration number", "e.g. 35201-1234567-1 / NTN ___", false, "identity"),
  q("client_address", "Complete address", "e.g. House 12, Civil Lines, Faisalabad", false, "identity"),
];

const courtQuestions = [
  q("court_name", "Court or authority name", "e.g. Court of Civil Judge, Lahore / Secretary ___", false, "court"),
  q("case_title_number", "Case title and number, if any", "e.g. Ali vs Ahmed, Suit No. 123/2026", false, "court"),
  q("party_role", "Client role in the matter", "e.g. plaintiff / respondent / accused / appellant", false, "court"),
];

const profiles: DocumentIntakeProfile[] = [
  {
    id: "vakalatnama",
    title: "Vakalatnama",
    categories: ["power-of-attorney", "civil-law", "criminal-law", "family-law", "constitutional-law", "property-law", "non-muslim-laws"],
    family: "Court advocate appointment",
    aliases: ["vakalatnama", "vakalat nama", "wakalatnama", "advocate authority", "advocate appointment"],
    patterns: [/\bvakalat\s*nama\b/i, /\bvakalatnama\b/i, /\bwakalatnama\b/i, /\badvocate authority\b/i],
    questions: [
      ...partyIdentityQuestions,
      q("advocate_name", "Advocate name", "e.g. Advocate Ali Khan", true, "identity"),
      q("advocate_bar_id", "Advocate bar license / enrollment number", "e.g. PBC-LHR-12345", false, "identity"),
      ...courtQuestions,
      q("authority_scope", "Any special authority or limitation?", "e.g. appearance, filing applications, receiving copies, no compromise without written consent", false, "execution"),
    ],
    formatChecklist: [
      "Use the sample-format POWER OF ATTORNEY heading and court Vakalatnama layout.",
      "Include court and cause-title lines, fixed party-role lists, V E R S U S, advocate appointment, four powers, client signature/thumb impression, and advocate acceptance blocks.",
      "Appoint an advocate for court representation only; do not draft it as a general power of attorney.",
      "Use blanks for every missing court, case, party, advocate, date, signature, or enrollment detail.",
    ],
    riskFlags: [
      "Do not give general property, banking, sale, or compromise powers unless the user asks for them.",
      "Do not assume the court, city, case title, case number, or party role.",
      "Never copy any personal name, advocate detail, court detail, case detail, or date from the reference image.",
    ],
    draftingGuidance: "Follow the supplied sample's one-page court Vakalatnama structure and keep every user-specific field blank unless supplied by the user.",
    templateHints: ["vakalatnama", "special-court"],
  },
  {
    id: "affidavit-general",
    title: "Affidavit / Undertaking / Declaration",
    categories: ["affidavit"],
    family: "Sworn declaration",
    aliases: ["affidavit", "halaf nama", "undertaking", "declaration", "noc affidavit"],
    patterns: [/\baffidavit\b/i, /\bhalaf\b/i, /\bundertaking\b/i, /\bdeclaration\b/i, /\boath\b/i],
    questions: [
      q("deponent_name", "Deponent name", "e.g. Muhammad Ahmed", true, "identity"),
      q("deponent_father_name", "Father's / spouse name", "e.g. Muhammad Ali", true, "identity"),
      q("deponent_cnic", "Deponent CNIC", "e.g. 35201-1234567-1", true, "identity"),
      q("deponent_address", "Deponent address", "e.g. House 12, Civil Lines, Faisalabad", true, "identity"),
      q("affidavit_purpose", "What is the exact purpose of the affidavit?", "e.g. name correction, no demand, residence proof, lost document", true, "document"),
      q("declaration_facts", "What facts should be sworn?", "e.g. I lost my original degree on 10 May 2026 and need a duplicate", true, "facts"),
      q("supporting_documents", "Which documents support it?", "e.g. CNIC, FIR/roznamcha, certificate copy, utility bill", false, "evidence"),
    ],
    formatChecklist: [
      "Title AFFIDAVIT, declaration paragraphs, verification, and deponent signature.",
      "No detailed witness section unless specifically requested.",
      "No notary/oath commissioner attestation text unless the user asks for that format.",
    ],
    riskFlags: [
      "Do not invent sworn facts.",
      "Missing identity facts must be left as blanks.",
    ],
    draftingGuidance: "Draft concise numbered sworn statements in first person and end at the deponent signature block.",
    templateHints: ["affidavit", "undertaking-affidavit", "declaration"],
  },
  {
    id: "agreement-deed-contract",
    title: "Agreement / Deed / Contract",
    categories: ["agreement"],
    family: "Private transaction document",
    aliases: ["agreement", "contract", "deed", "mou", "sale deed", "rent agreement", "lease", "loan agreement"],
    patterns: [/\bagreement\b/i, /\bcontract\b/i, /\bdeed\b/i, /\bmou\b/i, /\brent\b/i, /\blease\b/i, /\bsale deed\b/i, /\bloan\b/i],
    questions: [
      q("party1_details", "First party details in the correct legal role", "Name, father's name, CNIC, and address", true, "identity"),
      q("party2_details", "Second party details in the correct legal role", "Name, father's name, CNIC, and address", true, "identity"),
      q("document_subject", "Exact subject of this agreement", "Describe only the transaction, asset, service, employment, finance, or business arrangement involved", true, "document"),
      q("consideration", "Exact consideration or value exchanged", "State the applicable price, fee, amount, benefit, or write not applicable", false, "terms"),
      q("applicable_dates", "Dates that apply to this agreement", "State only relevant execution, delivery, possession, completion, or termination dates", false, "terms"),
      q("subject_details", "Details of the exact subject matter", "Provide the identifying details needed for this document only", false, "property"),
      q("special_conditions", "Special conditions for this exact agreement", "Include only conditions agreed by these parties", false, "terms"),
    ],
    formatChecklist: [
      "Clear title and date.",
      "Party blocks with complete identity details where available.",
      "Recitals, operative clauses, consideration, obligations, default, termination, dispute resolution, and signatures.",
      "Simple witness signature lines only unless a special format is requested.",
    ],
    riskFlags: [
      "Do not invent payment terms or ownership facts.",
      "Missing property or amount details must remain blanks.",
    ],
    draftingGuidance: "Use clause-based drafting with parties, recitals, terms, obligations, default consequences, and execution blocks.",
    templateHints: ["agreement", "deed", "contract", "rent-agreement", "sale-deed", "loan-agreement"],
  },
  {
    id: "legal-notice",
    title: "Legal Notice / Demand Notice",
    categories: ["civil-law", "property-law", "corporate-law", "banking-finance", "consumer-general"],
    family: "Pre-litigation notice",
    aliases: ["legal notice", "demand notice", "default notice", "eviction notice"],
    patterns: [/\blegal notice\b/i, /\bdemand notice\b/i, /\bdefault notice\b/i, /\beviction notice\b/i],
    questions: [
      q("sender_details", "Sender/client details", "e.g. name, father's name, CNIC, address", true, "identity"),
      q("recipient_details", "Recipient/opposite party details", "e.g. name, business name, address", true, "identity"),
      q("notice_subject", "Subject of the notice", "e.g. recovery of loan, breach of agreement, eviction, defamation", true, "document"),
      q("facts_chronology", "Key facts and chronology", "e.g. agreement date, payment due date, breach/refusal date", true, "facts"),
      q("demand_relief", "Exact demand or relief", "e.g. pay Rs. 500,000 within 7 days; vacate premises; cease defamation", true, "relief"),
      q("reply_deadline", "Deadline for compliance or reply", "e.g. 7 days / 15 days from receipt", false, "terms"),
      q("supporting_documents", "Documents supporting the notice", "e.g. agreement, receipts, bank transfer, messages, invoices", false, "evidence"),
    ],
    formatChecklist: [
      "Advocate letterhead style, recipient address, subject, client instruction paragraph, numbered facts, demand, deadline, and consequence of non-compliance.",
      "No court heading unless the user asks for a court application.",
    ],
    riskFlags: [
      "Do not threaten criminal action unless facts support it.",
      "Do not invent amounts, dates, or reply deadlines.",
    ],
    draftingGuidance: "Keep a professional notice tone, state the factual basis, demand, deadline, and reserved rights without overclaiming.",
    templateHints: ["legal-notice"],
  },
  {
    id: "court-document",
    title: "Court Application / Petition / Suit / Appeal",
    categories: ["application", "civil-law", "criminal-law", "family-law", "constitutional-law", "property-law", "non-muslim-laws"],
    family: "Court filing",
    aliases: ["application", "petition", "suit", "appeal", "revision", "written statement", "complaint"],
    patterns: [/\bapplication\b/i, /\bpetition\b/i, /\bsuit\b/i, /\bappeal\b/i, /\brevision\b/i, /\bwritten statement\b/i, /\bcomplaint\b/i],
    questions: [
      ...partyIdentityQuestions,
      q("opposite_party_details", "Opposite party details", "e.g. respondent/defendant/complainant name and address", false, "identity"),
      ...courtQuestions,
      q("facts_chronology", "Material facts and chronology", "e.g. dates, orders, FIR/case number, notices, cause of action", true, "facts"),
      q("legal_basis", "Law section, order, rule, article, or legal basis", "e.g. Section 497 CrPC / Article 199 / Order XXXIX CPC", false, "document"),
      q("relief_sought", "Exact relief or prayer", "e.g. grant bail, set aside order, decree recovery, restrain dispossession", true, "relief"),
      q("supporting_documents", "Documents or evidence available", "e.g. FIR, agreement, impugned order, receipts, notices, medical record", false, "evidence"),
    ],
    formatChecklist: [
      "Court heading, case number line, memo of parties, document title, facts, grounds, prayer, verification, signatures, and annexures where applicable.",
      "Facts and legal grounds must be separated.",
      "Use blanks for court/district if not provided.",
    ],
    riskFlags: [
      "Do not assume court, city, forum, or section.",
      "Do not add a judgments or case-law research section in All Documents.",
    ],
    draftingGuidance: "Use the professional court format but do not perform judgment research. If no citation is supplied by the user, draft from statutes, facts, and legal ingredients only.",
    templateHints: ["application", "petition", "suit", "appeal", "writ-petition"],
  },
  {
    id: "family-document",
    title: "Family Law Document",
    categories: ["family-law"],
    family: "Family court and family instruments",
    aliases: ["khula", "maintenance", "custody", "guardian", "talaq", "mehr", "divorce"],
    patterns: [/\bkhula\b/i, /\bmaintenance\b/i, /\bcustody\b/i, /\bguardian/i, /\btalaq\b/i, /\bmehr\b/i, /\bdivorce\b/i],
    questions: [
      q("husband_details", "Husband details", "e.g. name, father's name, CNIC, address", false, "identity"),
      q("wife_details", "Wife details", "e.g. name, father's name, CNIC, address", false, "identity"),
      q("marriage_details", "Marriage / nikah details", "e.g. date, place, nikah registrar, haq mehr", false, "facts"),
      q("children_details", "Children details, if any", "e.g. names, ages, current custody", false, "facts"),
      q("family_dispute_facts", "Facts of the family dispute", "e.g. desertion, non-maintenance, cruelty, custody issue", true, "facts"),
      q("family_relief", "Relief required", "e.g. khula decree, maintenance, custody, visitation, recovery of dower", true, "relief"),
      q("supporting_documents", "Family documents available", "e.g. nikahnama, birth certificates, receipts, notices, school record", false, "evidence"),
    ],
    formatChecklist: [
      "Use family court format for petitions; use deed/notice format for private instruments.",
      "Mention children, dower, maintenance, custody, and relevant dates only when provided.",
    ],
    riskFlags: [
      "Do not invent marriage date, children, or dower amount.",
      "Keep sensitive allegations factual and specific.",
    ],
    draftingGuidance: "Classify whether the request is a petition, notice, deed, or affidavit, then ask family-specific facts before drafting.",
    templateHints: ["khula", "maintenance", "child-custody", "guardianship", "talaq"],
  },
  {
    id: "power-of-attorney",
    title: "Power of Attorney",
    categories: ["power-of-attorney"],
    family: "Authority instrument",
    aliases: ["power of attorney", "poa", "mukhtar nama", "special power", "general power"],
    patterns: [/\bpower of attorney\b/i, /\bpoa\b/i, /\bmukhtar/i, /\bspecial power\b/i, /\bgeneral power\b/i],
    questions: [
      q("principal_details", "Principal / executant details", "e.g. name, father's name, CNIC, address", true, "identity"),
      q("attorney_details", "Attorney / agent details", "e.g. name, father's name, CNIC, address", true, "identity"),
      q("poa_type", "Type of authority", "e.g. general, special court, property sale, banking, overseas", true, "document"),
      q("authority_scope", "Exact powers granted", "e.g. sell property, appear in court, operate bank account, collect documents", true, "execution"),
      q("subject_property_case", "Property, account, case, or subject matter", "e.g. plot number, bank account, case title", false, "property"),
      q("duration_revocation", "Duration or limitation", "e.g. until revoked, for one transaction, valid for 1 year", false, "terms"),
    ],
    formatChecklist: [
      "Identify principal and attorney.",
      "State exact authority scope and limitations.",
      "Include execution/signature and simple witness lines.",
    ],
    riskFlags: [
      "Do not draft broad general powers if user asked for a limited/special authority.",
      "Do not assume property details or sale authority.",
    ],
    draftingGuidance: "Separate general POA, special POA, and Vakalatnama. Keep powers no broader than requested.",
    templateHints: ["general", "special-court", "vakalatnama"],
  },
  {
    id: "tax-corporate-immigration",
    title: "Regulatory / Corporate / Tax / Immigration Document",
    categories: ["tax-law", "corporate-law", "immigration-law"],
    family: "Regulatory filing",
    aliases: ["tax", "fbr", "company", "corporate", "board resolution", "visa", "passport", "immigration"],
    patterns: [/\btax\b/i, /\bfbr\b/i, /\bcompany\b/i, /\bcorporate\b/i, /\bboard resolution\b/i, /\bvisa\b/i, /\bpassport\b/i, /\bimmigration\b/i],
    questions: [
      q("applicant_entity_details", "Applicant/entity details", "e.g. name, CNIC/NTN/SECP registration, address", true, "identity"),
      q("authority_or_forum", "Authority, department, embassy, or forum", "e.g. FBR, SECP, embassy, passport office", false, "court"),
      q("document_purpose", "Purpose of the document", "e.g. appeal, exemption, board resolution, visa application, complaint", true, "document"),
      q("reference_numbers", "Reference numbers and dates", "e.g. tax year, notice/order no., company registration no., application no.", false, "facts"),
      q("facts_or_basis", "Facts or basis for request", "e.g. assessment error, board decision, travel purpose, compliance issue", true, "facts"),
      q("requested_action", "Requested action or relief", "e.g. set aside demand, issue certificate, approve registration, grant visa", true, "relief"),
      q("supporting_documents", "Supporting documents", "e.g. returns, notices, board minutes, passport, bank statement, invitation", false, "evidence"),
    ],
    formatChecklist: [
      "Use the correct authority style, subject, reference, facts, grounds/request, and signature.",
      "For board resolutions, use meeting details, resolution text, certification, and authorized signatory.",
    ],
    riskFlags: [
      "Do not invent registration, tax, passport, or reference numbers.",
      "Do not assume the authority or statutory forum.",
    ],
    draftingGuidance: "Classify the regulatory forum first, then draft in the official application, appeal, resolution, or certificate format.",
    templateHints: ["tax-appeal", "fbr-complaint", "board-resolution", "company-registration", "visa-application"],
  },
  {
    id: "general-document",
    title: "General Legal Document",
    categories: ["*"],
    family: "General drafting",
    aliases: ["document", "draft", "general"],
    patterns: [/\b(document|draft|general)\b/i],
    questions: [
      ...partyIdentityQuestions,
      q("document_purpose", "What is the document for?", "e.g. request, notice, declaration, agreement, authority, complaint", true, "document"),
      q("material_facts", "Material facts to include", "e.g. dates, names, events, amounts, document numbers", true, "facts"),
      q("desired_result", "What result should the document seek?", "e.g. permission, payment, correction, cancellation, compliance", true, "relief"),
      q("supporting_documents", "Supporting documents, if any", "e.g. CNIC, receipt, notice, contract, certificate", false, "evidence"),
    ],
    formatChecklist: [
      "Classify the exact document before drafting.",
      "Use a professional Pakistani legal format suitable for the selected document type.",
      "Leave missing facts as blanks.",
    ],
    riskFlags: [
      "Do not guess the document type if the request is ambiguous.",
      "Do not invent facts, dates, amounts, or authorities.",
    ],
    draftingGuidance: "Ask targeted facts first, then draft in the closest professional Pakistani format.",
    templateHints: ["general-application", "declaration", "custom-agreement"],
  },
];

function normalize(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function categoryMatches(profile: DocumentIntakeProfile, category?: string): boolean {
  if (!category) return true;
  return profile.categories.includes("*") || profile.categories.includes(category);
}

function profileScore(profile: DocumentIntakeProfile, input: DocumentIntakeInput): number {
  const text = normalize([input.category, input.userRequest].filter(Boolean).join(" "));
  const categoryBoost = categoryMatches(profile, input.category) ? 30 : -40;
  const patternScore = profile.patterns.filter((pattern) => pattern.test(input.userRequest || "")).length * 45;
  const aliasScore = profile.aliases.reduce((score, alias) => {
    const normalizedAlias = normalize(alias);
    if (!normalizedAlias) return score;
    if (text === normalizedAlias) return Math.max(score, 80);
    if (text.includes(normalizedAlias)) return Math.max(score, 55);
    const hits = normalizedAlias.split(" ").filter((part) => part.length > 2 && text.includes(part)).length;
    return Math.max(score, hits * 12);
  }, 0);
  const categoryTextScore = profile.categories.includes(input.category || "") ? 20 : 0;
  return categoryBoost + patternScore + aliasScore + categoryTextScore;
}

export function findDocumentIntakeProfile(input: DocumentIntakeInput): DocumentIntakeProfile {
  const ranked = profiles
    .map((profile) => ({ profile, score: profileScore(profile, input) }))
    .filter((item) => categoryMatches(item.profile, input.category) || item.score > 40)
    .sort((first, second) => second.score - first.score);
  return ranked[0]?.score > 0 ? ranked[0].profile : profiles[profiles.length - 1];
}

export function getDocumentIntakeProfiles(): DocumentIntakeProfile[] {
  return profiles;
}

export function mergeDocumentQuestions(...groups: DocumentIntakeQuestion[][]): DocumentIntakeQuestion[] {
  const seen = new Set<string>();
  const out: DocumentIntakeQuestion[] = [];
  for (const group of groups) {
    for (const question of group) {
      const key = question.id.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(question);
    }
  }
  return out;
}

export function documentKnowledgeBlock(
  profile: DocumentIntakeProfile | null,
  templateName?: string | null,
  options: { includeJudgmentPolicy?: boolean } = {}
): string {
  if (!profile) return "";
  const includeJudgmentPolicy = options.includeJudgmentPolicy ?? true;
  return `ALL DOCUMENTS STRUCTURED DRAFTING PROFILE
Classification: ${profile.title}
Family: ${profile.family}
${templateName ? `Template matched: ${templateName}` : ""}
Drafting guidance: ${profile.draftingGuidance}
Required structure:
${profile.formatChecklist.map((item) => `- ${item}`).join("\n")}
Risk controls:
${profile.riskFlags.map((item) => `- ${item}`).join("\n")}
${includeJudgmentPolicy ? `Judgment policy:
- Do not add judgment research, case-law search results, selected judgments, or a separate authorities section in All Documents.
- Do not claim any citation came from a database or research process.
- If the user independently supplied a citation, treat it as user-supplied text and do not expand beyond it.` : ""}`;
}
