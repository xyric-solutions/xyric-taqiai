export const LEGAL_RELIABILITY_RULES = `LEGAL RELIABILITY AND SOURCE CONTROL (highest priority):
- Treat all general handler notes below as issue-classification hints, not as legal authority.
- Separate each distinct legal issue in the user's question. Do not answer only the first issue.
- State material assumptions. If province, forum, date, procedural stage, document wording, or party status could change the answer, identify that limitation and ask one focused follow-up question when necessary.
- Distinguish criminal liability, civil liability, evidentiary admissibility, regulatory responsibility, and procedural steps. Do not collapse them into one conclusion.
- Use an exact statute, section, amendment, fee, limitation period, punishment, or legal test only when it is supported by the retrieved statute material supplied with this request or quoted by the user.
- The Qanun-e-Shahadat Order, 1984 is divided into Articles, not sections. Always write "Article 164 QSO" or "Article 164 of the Qanun-e-Shahadat Order, 1984"; never write "Section 164 QSO".
- For Article 164 QSO, distinguish evidence or witnesses recorded by the Court through modern devices from privately created chats or recordings. A platform name in the provision does not make every private message automatically admissible. Describe authenticity, integrity, attribution, relevance, and chain of custody as evidentiary foundation issues, not as verbatim statutory conditions unless the retrieved text says so.
- Use quotation marks for statutory text only when the quoted words appear verbatim in retrieved material. Otherwise paraphrase and identify the point that still requires verification.
- Cite a judgment only when it appears in the retrieved judgment material supplied with this request and its facts or legal proposition directly address the issue. Never invent, recall, or guess a citation from model memory.
- When verified judgments are supplied for a case-specific dispute, use the smallest useful set (normally 1-4), state the precise proposition from each excerpt, and explain briefly how that proposition bears on the user's issue. Do not merely list citations.
- A retrieved source is evidence, not permission to overstate. If its excerpt does not establish the proposition, do not cite it for that proposition.
- Keep remedies and causes of action separate. Never transfer a holding about one remedy (for example partition) to a different remedy (for example declaration, cancellation of a sale, or limitation) unless the retrieved excerpt expressly supports that extension.
- If retrieval is unavailable or does not directly answer the point, give the general legal framework without an unverified section or citation and clearly say what must be checked in the current official text.
- Never present a disputed, fact-sensitive, province-specific, recently amended, or unsettled position as automatic or certain.
- Never guarantee an outcome. Explain the likely position, competing arguments, required proof, and the competent forum where relevant.
- Prefer a concise, reasoned answer over a long list of laws. Every law and judgment mentioned must do real work in the answer.`;

export type JudgmentRetrievalReason =
  | "explicit-request"
  | "case-specific-dispute"
  | "interpretive-legal-question"
  | "statutory-interpretation"
  | "general-information";

export interface JudgmentRetrievalDecision {
  shouldRetrieve: boolean;
  reason: JudgmentRetrievalReason;
  maxResults: number;
}

const EXPLICIT_JUDGMENT_REQUEST = /\b(case[ -]?law|judg?ements?|judgments?|precedents?|rulings?|authorit(?:y|ies)|citations?|scmr|pld|plj|ylr|mld|faisl[ae]|nazair|misal)\b/i;
const LEGAL_PROVISION = /(?:\b(?:section|sections|sec\.?|article|dafa)\s*\d{1,4}(?:\s*[-/]?\s*[A-Z])?\b|\b\d{2,4}\s*[-/]?\s*[A-Z]\s*(?:PPC|Cr\.?P\.?C\.?|C\.?P\.?C\.?|CrPC|CPC|QSO)?\b)/i;
const PERSONAL_CONTEXT = /\b(?:i|we|my|our|me|us|client|this\s+(?:case|matter|dispute)|our\s+(?:case|matter)|my\s+(?:case|matter))\b/i;
const CASE_ROLE_CONTEXT = /\b(?:accused|complainant|plaintiff|defendant|petitioner|respondent|appellant|landlord|tenant|seller|buyer|purchaser|husband|wife|employee|employer|owner|police|fir|suit|petition|appeal|trial|proceedings?)\b/i;
const DISPUTED_EVENT = /\b(?:arrested|detained|charged|accused|registered|filed|dismissed|terminated|refused|failed|defaulted|breached|forged|threatened|assaulted|injured|killed|died|sold|purchased|transferred|occupied|possessed|evicted|divorced|separated|inherited|seized|confiscated|cancelled|dishonou?red|unpaid|not paid|never transferred)\b/i;
const LEGAL_CONSEQUENCE = /\b(?:liable|liability|valid|invalid|void|illegal|lawful|admissible|inadmissible|maintainable|entitled|responsible|remedy|rights?|relief|recover|evict|ejectment|eviction|quash(?:ed|ing)?|bail|custody|maintenance|khula|divorce|dissolution|partition|declaration|cancellation|injunction|damages|compensation|convict|acquit|challenge|appeal|sue|enforce|performance|succession|inheritance|limitation|jurisdiction|ownership|possession)\b/i;
const OUTCOME_QUESTION = /\b(?:can\s+(?:i|we|he|she|they|a|an|the|this|that|fir|suit|petition|appeal)|what\s+should|what\s+remedy|who\s+(?:is|will\s+be)\s+(?:liable|responsible)|whether|(?:is|are)\s+.+\s+(?:valid|illegal|admissible|maintainable)|does\s+.+\s+amount\s+to|how\s+can\s+(?:i|we))\b/i;
const TAQI_NAVIGATION = /\b(?:taqi\s*ai|where\s+(?:can|do)\s+i|which\s+(?:module|section|feature)|open\s+(?:the\s+)?(?:module|page)|create\s+(?:a\s+)?(?:case|document))\b/i;

export function decideJudgmentRetrieval(question: string): JudgmentRetrievalDecision {
  const text = question.replace(/\s+/g, " ").trim();
  if (!text || TAQI_NAVIGATION.test(text)) {
    return { shouldRetrieve: false, reason: "general-information", maxResults: 0 };
  }
  if (EXPLICIT_JUDGMENT_REQUEST.test(text)) {
    return { shouldRetrieve: true, reason: "explicit-request", maxResults: 4 };
  }
  if (LEGAL_PROVISION.test(text)) {
    return { shouldRetrieve: true, reason: "statutory-interpretation", maxResults: 4 };
  }

  const hasPersonalContext = PERSONAL_CONTEXT.test(text);
  const hasCaseRoleContext = CASE_ROLE_CONTEXT.test(text);
  const hasDisputedEvent = DISPUTED_EVENT.test(text);
  const hasLegalConsequence = LEGAL_CONSEQUENCE.test(text);
  if (
    (hasPersonalContext && hasLegalConsequence) ||
    (hasDisputedEvent && (hasPersonalContext || hasCaseRoleContext || hasLegalConsequence)) ||
    (hasCaseRoleContext && hasLegalConsequence && OUTCOME_QUESTION.test(text))
  ) {
    return { shouldRetrieve: true, reason: "case-specific-dispute", maxResults: 4 };
  }
  if (hasLegalConsequence && OUTCOME_QUESTION.test(text)) {
    return { shouldRetrieve: true, reason: "interpretive-legal-question", maxResults: 3 };
  }
  return { shouldRetrieve: false, reason: "general-information", maxResults: 0 };
}

export function splitLegalIssues(question: string, maxIssues = 3): string[] {
  const cleaned = question.replace(/\s+/g, " ").trim();
  if (!cleaned) return [];

  const sentences = cleaned.match(/[^?.!]+[?.!]?/g)?.map((part) => part.trim()).filter(Boolean) || [cleaned];
  const issues: string[] = [];
  let pending: string[] = [];

  for (const sentence of sentences) {
    pending.push(sentence);
    if (!sentence.endsWith("?")) continue;

    const candidate = pending.join(" ").trim();
    const isShortFollowUp = pending.length === 1
      && candidate.split(/\s+/).length <= 8
      && /^(what conditions|what requirements|why|how|and who|and what)/i.test(candidate);
    if (isShortFollowUp && issues.length) {
      issues[issues.length - 1] = `${issues[issues.length - 1]} ${candidate}`;
    } else if (candidate.length >= 12) {
      issues.push(candidate);
    }
    pending = [];
  }

  if (pending.length) {
    const remainder = pending.join(" ").trim();
    if (remainder.length >= 12) issues.push(remainder);
  }

  if (issues.length <= maxIssues) return issues.length ? issues : [cleaned];

  const selected: string[] = [];
  for (let index = 0; index < maxIssues; index++) {
    const sourceIndex = Math.round(index * (issues.length - 1) / Math.max(1, maxIssues - 1));
    selected.push(issues[sourceIndex]);
  }
  return Array.from(new Set(selected));
}
