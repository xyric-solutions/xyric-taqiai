import { textFromHtml } from "@/lib/document-html";

export type CourtDraftKind =
  | "justice-of-peace"
  | "bail"
  | "written-statement"
  | "appeal-revision"
  | "civil-suit"
  | "constitutional-writ"
  | "family-petition"
  | "execution"
  | "court-petition"
  | "non-court";

export interface CourtDraftingStandard {
  id: CourtDraftKind;
  isCourtDocument: boolean;
  label: string;
  orderedHeadings: string[];
  minimumNumberedItems: number;
  prompt: string;
}

export interface CourtDraftAudit {
  valid: boolean;
  issues: string[];
}

const NON_COURT_PATTERN = /\b(?:agreement|affidavit|legal notice|notice|deed|power of attorney|noc|certificate|undertaking|contract|memorandum|mou)\b/i;
const EXPLICIT_NON_COURT_REQUEST = /^(?:draft\s+(?:an?\s+)?)?(?:[a-z-]+\s+){0,3}(?:agreement|affidavit|legal notice|notice|deed|power of attorney|noc|certificate|undertaking|contract|memorandum|mou)\b/i;
const COURT_PATTERN = /\b(?:case|court|tribunal|petition|plaint|suit|appeal|revision|bail|written statement|complaint|quashment|injunction|guardian|guardianship|custody|maintenance|khula|dissolution|ejectment|rent petition|succession|probate|letters of administration|execution|contempt|consumer|service matter|employment dispute|labou?r|industrial relations|banking court|recovery of finance|tax|customs|revenue|mutation|partition of land|arbitration|arbitral award|cybercrime|company petition|shareholder dispute|election petition|justice of peace|22\s*[-/]?\s*[ab]|561\s*[-/]?\s*a|order\s*(?:vii|7)\s*rule\s*11)\b/i;

function detectKind(request: string): CourtDraftKind {
  if (EXPLICIT_NON_COURT_REQUEST.test(request.trim())) return "non-court";
  if (!COURT_PATTERN.test(request) && NON_COURT_PATTERN.test(request)) return "non-court";
  if (/\b22\s*[-/]?\s*[ab]\b|justice of peace|fir registration direction/i.test(request)) return "justice-of-peace";
  if (/\bbail\b|\b497\b|\b498\b|pre[- ]?arrest|post[- ]?arrest/i.test(request)) return "bail";
  if (/written statement|jawab dawa|para[- ]?wise reply|order\s*(?:vii|7)\s*rule\s*11/i.test(request)) return "written-statement";
  if (/\bappeal\b|\brevision\b|\b561\s*[-/]?\s*a\b|quashment|impugned order/i.test(request)) return "appeal-revision";
  if (/\bwrit\b|constitutional petition|article\s*199/i.test(request)) return "constitutional-writ";
  if (/\bkhula\b|dissolution of marriage|maintenance|family petition|family suit|custody|guardianship|restitution of conjugal rights|dowry articles/i.test(request)) return "family-petition";
  if (/\bexecution\b|execution petition|execution application|enforcement of (?:decree|order|award)/i.test(request)) return "execution";
  if (/\bplaint\b|civil suit|specific performance|declaration|possession|permanent injunction/i.test(request)) return "civil-suit";
  if (COURT_PATTERN.test(request)) return "court-petition";
  return "non-court";
}

function sectionPlan(kind: CourtDraftKind): { headings: string[]; guidance: string } {
  if (kind === "justice-of-peace") {
    return {
      headings: [
        "CASE / COMPLAINT PARTICULARS",
        "PRELIMINARY SUBMISSIONS",
        "FACTS OF THE OCCURRENCE",
        "PRIOR POLICE APPLICATIONS AND INACTION",
        "LEGAL GROUNDS",
        "INTERIM RELIEF",
        "PRAYER",
        "SIGNATURE",
        "VERIFICATION",
        "AFFIDAVIT",
        "LIST OF ANNEXURES",
      ],
      guidance: "Identify the exact Section 22-A(6) function invoked, the cognizable offence, each proposed accused's role, the SHO/higher-police applications, police refusal or neglect, supporting material, and the precise lawful direction requested. Do not ask the Justice of Peace to determine guilt or conduct the investigation.",
    };
  }

  if (kind === "bail") {
    return {
      headings: [
        "FIR AND CASE PARTICULARS",
        "PRELIMINARY SUBMISSIONS",
        "FACTS OF THE CASE",
        "GROUNDS FOR BAIL",
        "UNDERTAKING",
        "INTERIM RELIEF",
        "PRAYER",
        "SIGNATURE",
        "VERIFICATION",
        "AFFIDAVIT",
        "LIST OF ANNEXURES",
      ],
      guidance: "State FIR number/date, police station, offences, exact role, arrest/apprehension status, lower-court history, custody, investigation and recovery status. For pre-arrest bail connect mala fide and abuse of process to facts; for post-arrest bail address prohibitory clause, further inquiry, delay, custody, recovery, and completion of investigation.",
    };
  }

  if (kind === "written-statement") {
    return {
      headings: [
        "CASE PARTICULARS",
        "PRELIMINARY OBJECTIONS",
        "PARA-WISE REPLY ON MERITS",
        "ADDITIONAL LEGAL PLEAS",
        "PRAYER",
        "SIGNATURE",
        "VERIFICATION",
        "LIST OF DOCUMENTS / ANNEXURES",
      ],
      guidance: "Preserve the plaint paragraph numbering, answer every material averment expressly, separate threshold objections from merits, plead limitation/jurisdiction/cause-of-action/statutory bars where factually available, preserve alternative defences, and seek the exact dismissal/rejection/costs relief supported by law.",
    };
  }

  if (kind === "appeal-revision") {
    return {
      headings: [
        "IMPUGNED ORDER AND CASE PARTICULARS",
        "SYNOPSIS AND CHRONOLOGY",
        "FACTS AND PROCEDURAL HISTORY",
        "MAINTAINABILITY AND LIMITATION",
        "GROUNDS",
        "INTERIM RELIEF",
        "PRAYER",
        "SIGNATURE",
        "VERIFICATION",
        "AFFIDAVIT",
        "LIST OF ANNEXURES",
      ],
      guidance: "Identify the impugned order, forum, date, underlying proceeding, procedural history, limitation, maintainability and alternate remedy. Frame each ground as a distinct error of law, jurisdiction, procedure, evidence, or material irregularity; distinguish revision, appeal, quashment, remand and stay relief.",
    };
  }

  if (kind === "civil-suit") {
    return {
      headings: [
        "SUIT AND PROPERTY / TRANSACTION PARTICULARS",
        "JURISDICTION, VALUATION AND COURT FEE",
        "FACTS AND CAUSE OF ACTION",
        "LEGAL BASIS AND GROUNDS",
        "INTERIM RELIEF",
        "PRAYER",
        "SIGNATURE",
        "VERIFICATION",
        "AFFIDAVIT",
        "LIST OF ANNEXURES",
      ],
      guidance: "Plead exact property/transaction identity, title or contractual basis, chronology, cause-of-action date, territorial and pecuniary jurisdiction, valuation, court fee, limitation, documentary chain, substantive relief, and the three injunction tests where interim restraint is sought.",
    };
  }

  if (kind === "constitutional-writ") {
    return {
      headings: [
        "IMPUGNED ACTION AND PUBLIC AUTHORITY",
        "SYNOPSIS AND CHRONOLOGY",
        "FACTS OF THE CASE",
        "MAINTAINABILITY AND ALTERNATE REMEDY",
        "CONSTITUTIONAL AND LEGAL GROUNDS",
        "INTERIM RELIEF",
        "PRAYER",
        "SIGNATURE",
        "VERIFICATION",
        "AFFIDAVIT",
        "LIST OF ANNEXURES",
      ],
      guidance: "Identify the public functionary, impugned order/action/omission, jurisdictional facts, legal right, alternate remedy and any exceptional ground for constitutional intervention. Frame each ground around lawful authority, jurisdiction, due process, non-discrimination, fundamental rights, or statutory duty, and request precise certiorari, mandamus, prohibition, declaration, or interim protection as applicable.",
    };
  }

  if (kind === "family-petition") {
    return {
      headings: [
        "FAMILY CASE PARTICULARS",
        "MARRIAGE, RELATIONSHIP AND CHILDREN",
        "FACTS AND CAUSE OF ACTION",
        "JURISDICTION AND MAINTAINABILITY",
        "LEGAL GROUNDS AND WELFARE CONSIDERATIONS",
        "INTERIM RELIEF",
        "PRAYER",
        "SIGNATURE",
        "VERIFICATION",
        "AFFIDAVIT",
        "LIST OF ANNEXURES",
      ],
      guidance: "Identify the relationship, marriage and registration details, children, current living/custody position, jurisdiction, material dates, financial facts, prior proceedings and connected claims. Tailor the grounds to khula, dissolution, maintenance, custody, guardianship, dower, dowry, restitution, or visitation; keep the welfare of the minor paramount where children are involved.",
    };
  }

  if (kind === "execution") {
    return {
      headings: [
        "DECREE / ORDER / AWARD PARTICULARS",
        "PROCEDURAL HISTORY",
        "SATISFACTION AND OUTSTANDING OBLIGATION",
        "JURISDICTION, LIMITATION AND MAINTAINABILITY",
        "MODE AND GROUNDS OF EXECUTION",
        "INTERIM PROTECTIVE RELIEF",
        "PRAYER",
        "SIGNATURE",
        "VERIFICATION",
        "AFFIDAVIT",
        "LIST OF ANNEXURES",
      ],
      guidance: "Identify the executable decree, order or award, date, court, parties, relief granted, appellate status, payments or partial satisfaction, outstanding obligation, assets or person against which execution is sought, limitation, notice requirements, objections, and the precise lawful mode of execution.",
    };
  }

  return {
    headings: [
      "CASE PARTICULARS",
      "PRELIMINARY SUBMISSIONS",
      "FACTS OF THE CASE",
      "MAINTAINABILITY, JURISDICTION AND LIMITATION",
      "LEGAL GROUNDS",
      "INTERIM RELIEF",
      "PRAYER",
      "SIGNATURE",
      "VERIFICATION",
      "AFFIDAVIT",
      "LIST OF ANNEXURES",
    ],
    guidance: "State the complete procedural and factual chronology, identify the enabling and substantive law, address maintainability, jurisdiction and limitation, apply each legal ingredient to the supplied facts, anticipate the strongest opposing point, and request precise final and interim relief.",
  };
}

function buildPrompt(label: string, headings: string[], guidance: string): string {
  const orderedSections = headings.map((heading, index) => `${index + 1}. <h3>${heading}</h3>`).join("\n");
  return `

CORPUS-BACKED COURT DRAFTING STANDARD — MANDATORY
This standard was distilled from 150 high-value unique practitioner files selected from 5,116 reviewed Pakistani case files. Treat those files as drafting-pattern material only, never as reported or binding precedent.

DOCUMENT FAMILY: ${label}

FIXED OPENING — USE THIS EXACT ORDER AND HTML SHAPE:
1. <h2>IN THE COURT OF ___________</h2> (use the supplied court and district; otherwise keep the blank)
2. <p><strong>[Correct case/document number line]</strong></p>
3. Memo of parties: each party's supplied description in a separate <p>, then <p><strong>VERSUS</strong></p>, then the opposing parties.
4. <h2>[EXACT DOCUMENT TITLE]</h2>
5. <p><strong>UNDER [CORRECT ENABLING PROVISION]</strong></p>
6. <h3>RESPECTFULLY SHEWETH:</h3>

AFTER THE OPENING, USE THESE HEADINGS VERBATIM AND IN THIS EXACT ORDER:
${orderedSections}

CONTENT STANDARD:
- Under every factual or legal heading, use a real <ol> with complete <li> paragraphs. Do not fake numbering with plain text.
- Normally include 10–18 substantive numbered items across the body. Use fewer only when the matter genuinely cannot support more without invention.
- Keep FACTS separate from GROUNDS. Facts state what happened; grounds explain why the law entitles the client to relief.
- State the enabling provision and every relevant substantive/procedural law supplied or safely identifiable from the document type. Explain how each provision applies; never dump an unexplained list of sections.
- Build the strongest fact-supported primary arguments, alternative arguments, maintainability, jurisdiction, limitation, burden/evidence points, statutory ingredients, procedural defects, interim-relief tests, and answer to the most likely opposing contention.
- Use actual judgment citations only when they were supplied from the authenticated judgment database. Tie each citation to the exact ground it supports. Never invent a citation, party name, court, year, quotation, or ratio.
- Use the private corpus for structure and issue coverage only. Never copy a source client's name, address, facts, phone number, CNIC, case number, or other personal data.
- Never invent a case fact. Put ___________ for every missing fact while still providing complete legally framed clauses around the blank.
- The PRAYER must contain separately numbered, document-specific final relief, interim relief if applicable, costs where legally supportable, and the standard further-relief clause.
- The SIGNATURE block must identify the correct party role and counsel role. VERIFICATION must distinguish personal-knowledge paragraphs from information/belief where possible.
- AFFIDAVIT must support the pleading without adding new facts. For a written statement, do not add an affidavit unless the applicable procedure or user request requires one.
- LIST OF ANNEXURES must identify each supplied document by neutral description; use blank annexure numbers for missing labels and never invent an attachment.
- If interim relief is not legally applicable, retain the INTERIM RELIEF heading and state in one sentence that no separate interim relief is sought. This preserves the fixed structure.

DOCUMENT-SPECIFIC LEGAL COVERAGE:
${guidance}

FORMAT LOCK:
- Do not rename, omit, duplicate, or reorder the mandatory headings.
- Do not place facts after GROUNDS except where necessary to explain a particular ground.
- Do not add a generic citation/reliance paragraph.
- Return only complete valid HTML using the allowed tags.`;
}

export function getCourtDraftingStandard(request: string): CourtDraftingStandard {
  const id = detectKind(request);
  if (id === "non-court") {
    return {
      id,
      isCourtDocument: false,
      label: "Non-court document",
      orderedHeadings: [],
      minimumNumberedItems: 0,
      prompt: "",
    };
  }

  const plan = sectionPlan(id);
  const labels: Record<Exclude<CourtDraftKind, "non-court">, string> = {
    "justice-of-peace": "Application under Sections 22-A and 22-B CrPC",
    bail: "Pre-arrest or post-arrest bail",
    "written-statement": "Written statement / threshold defence",
    "appeal-revision": "Appeal, revision, or quashment petition",
    "civil-suit": "Civil suit / plaint",
    "constitutional-writ": "Constitutional petition under Article 199",
    "family-petition": "Family or guardianship petition",
    execution: "Execution or enforcement petition",
    "court-petition": "Court petition / application",
  };

  return {
    id,
    isCourtDocument: true,
    label: labels[id],
    orderedHeadings: plan.headings,
    minimumNumberedItems: id === "written-statement" ? 8 : 10,
    prompt: buildPrompt(labels[id], plan.headings, plan.guidance),
  };
}

function headingIndex(text: string, heading: string): number {
  return text.indexOf(heading.toUpperCase());
}

export function auditCourtDraftStructure(html: string, standard: CourtDraftingStandard): CourtDraftAudit {
  if (!standard.isCourtDocument) return { valid: true, issues: [] };

  const text = textFromHtml(html).toUpperCase();
  const issues: string[] = [];
  const openingMarkers = ["IN THE COURT", "VERSUS", "UNDER", "RESPECTFULLY SHEWETH"];
  for (const marker of openingMarkers) {
    if (!text.includes(marker)) issues.push(`Missing opening marker: ${marker}`);
  }

  let priorIndex = -1;
  for (const heading of standard.orderedHeadings) {
    const currentIndex = headingIndex(text, heading);
    if (currentIndex < 0) {
      issues.push(`Missing heading: ${heading}`);
      continue;
    }
    if (currentIndex < priorIndex) issues.push(`Heading out of order: ${heading}`);
    priorIndex = Math.max(priorIndex, currentIndex);
  }

  const listItemCount = (html.match(/<li(?:\s[^>]*)?>/gi) || []).length;
  if (listItemCount < standard.minimumNumberedItems) {
    issues.push(`Only ${listItemCount} numbered items; minimum is ${standard.minimumNumberedItems}`);
  }

  const provisionCount = (text.match(/\b(?:SECTION|SECTIONS|ARTICLE|ORDER|RULE|ACT|ORDINANCE|CONSTITUTION)\b/g) || []).length;
  if (provisionCount < 2) issues.push("Relevant enabling and substantive/procedural law is not adequately identified");

  return { valid: issues.length === 0, issues };
}

export function buildCourtReformatPrompt(
  originalPrompt: string,
  previousHtml: string,
  standard: CourtDraftingStandard,
  issues: string[]
): string {
  return `${originalPrompt}

The previous draft failed the mandatory structural audit.
Audit issues:
${issues.map((issue) => `- ${issue}`).join("\n")}

Rebuild the complete document from the beginning in the exact corpus-backed format.
- Preserve every supplied fact and legally supportable argument.
- Do not invent facts or citations.
- Do not merely append missing headings to the end; place every section in the mandated order.
- Return only the corrected complete HTML.

PREVIOUS DRAFT TO RESTRUCTURE:
${previousHtml}

MANDATORY STANDARD:
${standard.prompt}`;
}
