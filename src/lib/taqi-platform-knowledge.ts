import { DOCUMENT_SUGGESTIONS } from "@/lib/document-suggestions";

export interface TaqiModule {
  id: string;
  name: string;
  href: string;
  section: string;
  purpose: string;
  aliases: string[];
  category?: string;
}

export interface PlatformRecommendation {
  module: TaqiModule;
  templateName?: string;
  answer: string;
}

const DOCUMENT_MODULES: TaqiModule[] = [
  { id: "affidavits", name: "Affidavits", href: "/affidavits", section: "Draft", category: "affidavit", purpose: "Create sworn declarations, NOCs, indemnity bonds, undertakings, and other affidavits.", aliases: ["affidavit", "halaf nama", "sworn declaration", "noc", "undertaking"] },
  { id: "agreements", name: "Agreements", href: "/agreements", section: "Draft", category: "agreement", purpose: "Create vehicle sale, rent, property, employment, loan, partnership, and other agreements.", aliases: ["agreement", "contract", "deed", "mou", "vehicle sale", "rent agreement"] },
  { id: "applications", name: "Applications", href: "/applications", section: "Draft", category: "application", purpose: "Create police-station and general legal applications.", aliases: ["application", "darkhwast", "arzi", "police application"] },
  { id: "family-law", name: "Family Law", href: "/family-law", section: "Draft", category: "family-law", purpose: "Create khula, maintenance, custody, guardianship, inheritance, and other family-law matters.", aliases: ["family law", "family case", "khula", "divorce", "talaq", "maintenance", "custody", "guardianship", "mehr"] },
  { id: "criminal-law", name: "Criminal Law", href: "/criminal-law", section: "Draft", category: "criminal-law", purpose: "Create bail, FIR, quashment, criminal complaint, appeal, and defence documents.", aliases: ["criminal law", "criminal case", "bail", "fir", "quashment", "murder defence", "fraud case"] },
  { id: "property-law", name: "Property Law", href: "/property-law", section: "Draft", category: "property-law", purpose: "Create possession, mutation, partition, injunction, title, rent, and transfer matters.", aliases: ["property law", "property case", "land case", "possession", "mutation", "partition", "injunction", "title suit"] },
  { id: "civil-law", name: "Civil Law", href: "/civil-law", section: "Draft", category: "civil-law", purpose: "Create civil suits, notices, recovery, consumer, defamation, arbitration, and stay matters.", aliases: ["civil law", "civil case", "civil suit", "legal notice", "money recovery", "damages", "stay order"] },
  { id: "corporate-law", name: "Corporate Law", href: "/corporate-law", section: "Draft", category: "corporate-law", purpose: "Create company, partnership, shareholder, board, and winding-up documents.", aliases: ["corporate law", "company law", "company registration", "partnership registration", "board resolution", "shareholder"] },
  { id: "tax-law", name: "Tax Law", href: "/tax-law", section: "Draft", category: "tax-law", purpose: "Create tax appeals, exemptions, FBR complaints, and withholding certificates.", aliases: ["tax law", "tax appeal", "fbr complaint", "tax exemption", "withholding certificate"] },
  { id: "immigration-law", name: "Immigration", href: "/immigration-law", section: "Draft", category: "immigration-law", purpose: "Create visa, passport, NICOP, citizenship, and deportation matters.", aliases: ["immigration", "visa", "passport", "nicop", "citizenship", "deportation"] },
  { id: "constitutional-law", name: "Constitutional Law", href: "/constitutional-law", section: "Draft", category: "constitutional-law", purpose: "Create writ, fundamental-rights, habeas corpus, and contempt petitions.", aliases: ["constitutional law", "constitutional case", "writ petition", "article 199", "habeas corpus", "contempt"] },
  { id: "non-muslim-laws", name: "Non-Muslim Laws", href: "/non-muslim-laws", section: "Draft", category: "non-muslim-laws", purpose: "Create Christian, Hindu, Sikh, Parsi, minority-rights, and related personal-law matters.", aliases: ["non muslim law", "minority law", "christian law", "hindu law", "sikh law", "parsi law", "forced conversion"] },
  { id: "power-of-attorney", name: "Power of Attorney", href: "/power-of-attorney", section: "Draft", category: "power-of-attorney", purpose: "Create a general power of attorney, special power of attorney, or Vakalatnama.", aliases: ["power of attorney", "poa", "vakalatnama", "wakalatnama", "mukhtar nama"] },
];

export const TAQI_MODULES: TaqiModule[] = [
  { id: "dashboard", name: "Dashboard", href: "/dashboard", section: "Main", purpose: "View recent work and open TaqiAI tools.", aliases: ["dashboard", "home"] },
  { id: "advisor", name: "AI Legal Advisor", href: "/ai-advisor", section: "Main", purpose: "Ask Pakistani legal questions and receive grounded legal guidance.", aliases: ["legal advisor", "ai advisor", "legal advice", "mashwara"] },
  { id: "judgments", name: "Judgments", href: "/case-law", section: "Research", purpose: "Search reported and unreported Pakistani judgments by citation, section, court, or keywords.", aliases: ["judgment", "judgments", "case law", "precedent", "citation", "scmr", "pld"] },
  { id: "case-builder", name: "Case Builder", href: "/case-builder", section: "Research", purpose: "Prepare a case through structured intake, judgment research, and guided drafting.", aliases: ["case builder", "prepare case", "build case", "case drafting", "section case"] },
  { id: "statute-search", name: "Statute Search", href: "/statute-search", section: "Research", purpose: "Find Acts, Ordinances, statutory sections, and bare-law text.", aliases: ["statute search", "bare law", "act text", "ordinance", "law section", "section text"] },
  { id: "voice-case", name: "Voice Case", href: "/voice-case", section: "Draft", purpose: "Record or upload a client discussion and convert it into structured case material.", aliases: ["voice case", "audio case", "record client", "voice recording", "client meeting"] },
  { id: "copy-photo", name: "Copy from Photo", href: "/copy-from-photo", section: "Draft", purpose: "Extract and reproduce legal text from a photographed or scanned document.", aliases: ["copy from photo", "photo document", "scan document", "image typing", "ocr"] },
  ...DOCUMENT_MODULES,
  { id: "documents", name: "My Documents", href: "/documents", section: "Management", purpose: "Open, edit, download, and manage saved documents.", aliases: ["my documents", "saved documents", "drafts", "files"] },
  { id: "diary", name: "Lawyer Diary", href: "/lawyer-diary", section: "Management", purpose: "Track hearings, dates, reminders, notes, and chamber work.", aliases: ["lawyer diary", "diary", "hearing date", "court date", "reminder"] },
  { id: "cases", name: "Court Cases", href: "/cases", section: "Management", purpose: "Track active court cases and matter details.", aliases: ["court cases", "case tracker", "case management", "active cases"] },
  { id: "chamber", name: "Chamber", href: "/chamber", section: "Management", purpose: "Manage chamber-level case and practice information.", aliases: ["chamber", "law office", "practice management"] },
  { id: "translate", name: "Translate", href: "/translate", section: "Tools", purpose: "Translate legal text between English and Urdu.", aliases: ["translate", "translation", "urdu translation", "english translation", "tarjuma"] },
  { id: "tax-calculator", name: "Property Transfer Tax Calculator", href: "/property-transfer/tax-calculator", section: "Tools", purpose: "Estimate property-transfer taxes and charges.", aliases: ["tax calculator", "property tax calculator", "transfer tax", "stamp duty calculator"] },
  { id: "property-transfer", name: "Property Transfer", href: "/property-transfer", section: "Tools", purpose: "Review property-transfer information and related calculations.", aliases: ["property transfer", "transfer property"] },
  { id: "settings", name: "Settings", href: "/settings", section: "Settings", purpose: "Manage profile, appearance, language, and account preferences.", aliases: ["settings", "profile", "account", "appearance", "password"] },
];

const NAVIGATION_LOCATION = /\b(where|where can|where should|which module|which feature|which section|which page|which tool|kahan|kaha|kidhar|kis section|kis module)\b/i;
const NAVIGATION_ACTION = /\b(create|prepare|draft|make|type|record|upload|search|find|translate|calculate|manage|track|open|use|bana(?:na|ni|ne|o|yen)?|tayyar(?:\s+kar(?:na|ni|ne|ein|o)?)?|likh(?:na|ni|ne|ein|o)?|type kar(?:na|ni|ne|ein|o)?|search kar(?:na|ni|ne|ein|o)?)\b/i;
const EXPLICIT_PLATFORM = /\b(taqi\s*ai|taqiai|this app|the app|platform|dashboard|sidebar|module|feature|tool)\b/i;

function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/\blabour\b/g, "labor")
    .replace(/\bcar\b/g, "vehicle")
    .replace(/\bwakalatnama\b/g, "vakalatnama")
    .replace(/[^a-z0-9\u0600-\u06ff]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function aliasScore(query: string, aliases: string[]): number {
  let best = 0;
  for (const rawAlias of aliases) {
    const alias = normalize(rawAlias);
    if (!alias) continue;
    if (query.includes(alias)) {
      best = Math.max(best, 10 + alias.split(" ").length * 3);
      continue;
    }
    const tokens = alias.split(" ").filter((token) => token.length >= 3);
    const matched = tokens.filter((token) => query.includes(token)).length;
    if (tokens.length >= 2 && matched === tokens.length) best = Math.max(best, matched * 3);
  }
  return best;
}

export function isTaqiNavigationQuery(question: string): boolean {
  const query = normalize(question);
  if (!query) return false;
  const asksLocation = NAVIGATION_LOCATION.test(query) && NAVIGATION_ACTION.test(query);
  const asksPlatformHelp = EXPLICIT_PLATFORM.test(query) && /\b(how|where|what|which|use|open|find|help|guide|kaise|kese|kahan)\b/i.test(query);
  return asksLocation || asksPlatformHelp;
}

function bestModule(query: string): TaqiModule | null {
  let winner: { targetModule: TaqiModule; score: number } | null = null;
  for (const targetModule of TAQI_MODULES) {
    const score = aliasScore(query, [targetModule.name, ...targetModule.aliases]);
    if (score > 0 && (!winner || score > winner.score)) winner = { targetModule, score };
  }
  return winner?.targetModule || null;
}

function bestTemplate(query: string): { name: string; targetModule: TaqiModule; score: number } | null {
  let winner: { name: string; targetModule: TaqiModule; score: number } | null = null;
  for (const document of DOCUMENT_SUGGESTIONS) {
    const targetModule = DOCUMENT_MODULES.find((item) => item.category === document.cat)
      || (document.cat === "court-cases" ? TAQI_MODULES.find((item) => item.id === "case-builder") : undefined);
    if (!targetModule) continue;
    const score = aliasScore(query, [document.label, ...document.kw]);
    if (score < 13) continue;
    if (!winner || score > winner.score) winner = { name: document.label, targetModule, score };
  }
  return winner;
}

function responseLanguage(question: string): "english" | "roman-urdu" | "urdu" {
  if (/[\u0600-\u06ff]/.test(question)) return "urdu";
  const roman = question.match(/\b(kahan|kaha|kidhar|kaise|kese|mujhe|muje|bana(?:na|ni|ne|o|yen)?|tayyar|karna|karein|chahiye|kis)\b/gi) || [];
  return new Set(roman.map((token) => token.toLowerCase())).size >= 2 ? "roman-urdu" : "english";
}

function buildAnswer(question: string, targetModule: TaqiModule, templateName?: string): string {
  const language = responseLanguage(question);
  const destination = templateName ? `${targetModule.name} > ${templateName}` : targetModule.name;
  if (language === "urdu") {
    return [
      `اس کام کے لیے TaqiAI میں ${destination} استعمال کریں۔`,
      `راستہ: Sidebar > ${targetModule.section} > ${targetModule.name}`,
      `صفحہ: ${targetModule.href}`,
      targetModule.purpose,
      templateName ? `${targetModule.name} کھول کر “${templateName}” منتخب کریں۔` : "متعلقہ آپشن منتخب کریں اور اپنی معلومات درج کریں۔",
    ].join("\n");
  }
  if (language === "roman-urdu") {
    return [
      `Is kaam ke liye TaqiAI mein ${destination} use karein.`,
      `Rasta: Sidebar > ${targetModule.section} > ${targetModule.name}`,
      `Page: ${targetModule.href}`,
      targetModule.purpose,
      templateName ? `${targetModule.name} khol kar “${templateName}” select karein.` : "Relevant option select karke apni details enter karein.",
    ].join("\n");
  }
  return [
    `Use ${destination} in TaqiAI.`,
    `Path: Sidebar > ${targetModule.section} > ${targetModule.name}`,
    `Page: ${targetModule.href}`,
    targetModule.purpose,
    templateName ? `Open ${targetModule.name}, then select “${templateName}”.` : "Select the relevant option and enter the case or document details.",
  ].join("\n");
}

export function getPlatformRecommendation(question: string): PlatformRecommendation | null {
  if (!isTaqiNavigationQuery(question)) return null;
  const query = normalize(question);
  const template = bestTemplate(query);
  const fallbackId = /\b(case|matter|petition|suit|section\s*\d+|ppc|crpc|cpc)\b/i.test(query)
    ? "case-builder"
    : "advisor";
  const targetModule = template?.targetModule || bestModule(query) || TAQI_MODULES.find((item) => item.id === fallbackId)!;
  return {
    module: targetModule,
    templateName: template?.name,
    answer: buildAnswer(question, targetModule, template?.name),
  };
}
