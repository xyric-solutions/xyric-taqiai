// ============================================
// SMART INTENT DETECTION ENGINE v2
// Supports: Urdu + English mixed input
//           Multi-intent detection
//           Drafting priority routing
// ============================================

// Core intent keywords (English + Urdu Roman + common misspellings)
const intents: Record<string, string[]> = {
  drafting: [
    // English
    "draft", "application", "petition", "write", "format", "type", "template", "prepare", "create", "make",
    // Urdu Roman
    "likhna", "likho", "likh do", "likh dein", "likh dijiye", "likhen",
    "banana", "banao", "bana do", "bana dein", "banayen", "banwa do",
    "darkhwast", "arzi", "tayyar", "tayyar karo", "tayyar kar do",
    "typing", "type karo", "type kar do", "type kren", "type krdo", "type kryn",
    "bna do", "bna dyn", "bnao", "bnwa do",
    // Action words
    "generate", "print", "download",
  ],
  criminal: [
    // English
    "murder", "theft", "FIR", "police", "crime", "fraud", "robbery", "assault",
    "kidnap", "bail", "arrest", "jail", "stolen", "criminal", "accused", "victim",
    "weapon", "gun", "knife", "injury", "hurt", "death", "killed", "beating",
    // Legal sections
    "section 302", "section 420", "section 406", "section 379", "section 506",
    "section 324", "section 337", "section 354", "section 376", "section 365",
    "PPC", "crpc",
    // Urdu Roman
    "qatl", "chori", "dhoka", "dhamki", "maar peet", "zakhmi",
    "thana", "griftar", "giraftari", "giraftar", "qaid", "rihai",
    "muqadma", "mulzim", "mujrim", "saza", "challan", "zamanat", "zamant",
    "FIR darj", "report darj", "maar kutai", "loot maar", "daku",
    "jaali", "forgery", "nakli", "cyber crime",
  ],
  property: [
    // English
    "property", "land", "plot", "registry", "possession", "transfer", "mutation",
    "trespass", "encroachment", "boundary", "demolition", "construction",
    "mortgage", "lease", "eviction", "illegal occupation",
    // Urdu Roman
    "qabza", "zameen", "jaidad", "jaedad", "jayedad", "jaaidad",
    "intiqal", "khasra", "khatauni", "ghar", "makan", "makaan",
    "flat", "dukan", "dukaan", "kiraya", "kiraydar", "kiraye dar",
    "rehn", "rehan", "girvi", "fard", "registry", "registri",
    "naksha", "marla", "kanal", "acre",
    "malik", "malkiyat", "waris", "stamp duty",
    "tajawuz", "tajawuzat", "na jaiz qabza",
    // Common phrases
    "mera plot", "meri zameen", "mera ghar", "mera makan",
    "hamari jaidad", "property dispute",
  ],
  family: [
    // English
    "divorce", "khula", "maintenance", "custody", "marriage", "nikah",
    "adoption", "guardianship", "domestic violence", "dowry", "jahez",
    "alimony", "conjugal",
    // Urdu Roman
    "talaq", "talak", "mehr", "mehar", "haq mehr", "haq mehar",
    "nafqa", "nafka", "kharcha", "bachay", "bacha", "bachon",
    "biwi", "shohar", "shadi", "shaadi", "nikah nama",
    "iddat", "iddat", "wirasat", "wiraasat", "virasat",
    "sarparat", "sarparast", "sarprast",
    "halala", "rukhsati", "valima", "walima",
    "sasural", "mayke", "jahez",
    // Common phrases
    "meri biwi", "mera shohar", "bachon ki", "talaq dena",
    "khula lena", "mehr wapas", "ghar chorna",
  ],
  civil: [
    // English
    "agreement", "contract", "dispute", "notice", "suit", "decree",
    "recovery", "damages", "injunction", "breach", "compensation",
    "settlement", "arbitration", "specific performance",
    // Urdu Roman
    "dawa", "daawa", "muqadma", "faisla", "decree",
    "notice bhejo", "notice bhejna", "legal notice",
    "muawza", "muawaza", "harjana", "tawan",
    "raqam wapas", "paisa wapas", "qarz wapas",
    "samjhota", "salis", "razi nama", "razinama",
    "stay order", "rok",
  ],
  corporate: [
    // English
    "company", "business", "partnership", "firm", "NTN", "SECP",
    "shareholder", "director", "incorporation", "LLC", "franchise",
    "joint venture", "startup", "investment",
    // Urdu Roman
    "karobar", "karobaar", "shirakat", "hissa", "hissedar",
    "munafa", "nuqsan", "sarmaya", "sarmayakari",
  ],
  tax: [
    // English
    "tax", "FBR", "income tax", "stamp duty", "withholding", "gain tax",
    "CVT", "PLRA", "property tax", "sales tax", "return", "audit",
    // Urdu Roman
    "tax bharna", "tax jama", "mehsool", "malia", "aamdani",
    "filer", "non filer", "non-filer", "nonfiler",
  ],
  immigration: [
    // English
    "visa", "passport", "immigration", "travel", "abroad", "NICOP",
    "overseas", "embassy", "consulate", "work permit", "asylum",
    "deportation", "nationality", "citizenship",
    // Urdu Roman
    "bahar jana", "mulk chhorna", "safar", "videsh",
    "shahri", "shehriyat", "gaari passport",
  ],
  "non-muslim": [
    // English
    "christian", "hindu", "sikh", "parsi", "zoroastrian", "buddhist", "kalash",
    "minority", "minorities", "non-muslim", "non muslim", "non-muslims",
    "church", "temple", "gurdwara", "mandir",
    "blasphemy", "forced conversion", "conversion",
    "christmas", "easter", "diwali", "holi", "vaisakhi", "navroz",
    // Acts
    "christian marriage act", "divorce act 1869", "hindu marriage act",
    "parsi marriage", "succession act 1925", "anand karaj",
    "section 295", "295-a", "295-b", "295-c", "ppc 295", "ppc 298",
    "evacuee trust", "etpb",
    "article 20", "article 25", "article 36",
    // Urdu Roman
    "isai", "maseehi", "masihi", "ghair muslim", "ghair musalman",
    "aqaliyat", "aqalliyat", "aqliyat", "church", "gireja", "girja",
    "mandir", "gurdwara", "toheen", "toheen mazhab",
    "jabri tabdeeli", "jabri mazhab", "mazhab tabdeel",
    "minority rights", "aqaliyati huqooq",
    "asia bibi", "blasphemy case",
  ],
};

// Drafting trigger words - if ANY of these found, drafting is always included
const draftingTriggers = [
  "likh", "likho", "likh do", "likh dein", "likhen", "likhna", "likh dijiye",
  "bana", "banao", "bna", "bnao", "bna do", "bnwa", "banana", "banayen",
  "type kr", "type karo", "type kar do", "type kren", "type krdo", "type kryn",
  "draft", "draft karo", "draft kar do", "draft kren",
  "tayyar", "tayyar karo", "tayyar kar do",
  "generate", "create", "prepare", "make",
  "application likh", "petition likh", "darkhwast likh",
  "document bana", "khat likh",
];

// ============================================
// DETECTION FUNCTIONS
// ============================================

// Simple detection - returns primary category
export function detectIntent(text: string): string {
  const result = detectMultiIntent(text);
  return result.primary;
}

// Multi-intent detection with drafting priority
export function detectMultiIntent(text: string): {
  primary: string;
  secondary: string | null;
  isDrafting: boolean;
  contextCategory: string;
  allMatched: string[];
} {
  const lower = text.toLowerCase();

  // Step 1: Check if user is asking for drafting
  const isDrafting = draftingTriggers.some((trigger) => lower.includes(trigger));

  // Step 2: Find ALL matching categories (except drafting - handled separately)
  const matched: { category: string; count: number; keywords: string[] }[] = [];

  for (const category in intents) {
    if (category === "drafting") continue; // Skip drafting, handled by draftingTriggers

    const matchedWords = intents[category].filter((word) =>
      lower.includes(word.toLowerCase())
    );

    if (matchedWords.length > 0) {
      matched.push({
        category,
        count: matchedWords.length,
        keywords: matchedWords,
      });
    }
  }

  // Sort by match count (most specific wins)
  matched.sort((a, b) => b.count - a.count);

  const allMatched = matched.map((m) => m.category);
  const contextCategory = matched[0]?.category || "general";

  // Step 3: Determine primary and secondary intent
  if (isDrafting) {
    // User wants a document → drafting is primary, context is secondary
    return {
      primary: "drafting",
      secondary: contextCategory !== "general" ? contextCategory : null,
      isDrafting: true,
      contextCategory,
      allMatched: ["drafting", ...allMatched],
    };
  }

  return {
    primary: contextCategory,
    secondary: matched[1]?.category || null,
    isDrafting: false,
    contextCategory,
    allMatched,
  };
}

// Detect ALL intents with full details (for UI display)
export function detectAllIntents(text: string): DetectedIntent[] {
  const lower = text.toLowerCase();
  const results: DetectedIntent[] = [];
  const multi = detectMultiIntent(text);

  // If drafting detected, add it first
  if (multi.isDrafting) {
    const meta = intentMeta.drafting;
    const matchedWords = draftingTriggers.filter((t) => lower.includes(t));
    results.push({
      type: "drafting",
      label: meta.label,
      labelUrdu: meta.labelUrdu,
      confidence: 1.0,
      color: meta.color,
      keywords: matchedWords.slice(0, 5),
      actions: meta.actions,
      laws: meta.laws,
      systemPrompt: meta.systemPrompt,
      isPrimary: true,
    });
  }

  // Add all other matched categories
  for (const category in intents) {
    if (category === "drafting") continue;

    const matchedWords = intents[category].filter((w) =>
      lower.includes(w.toLowerCase())
    );

    if (matchedWords.length > 0) {
      const meta = intentMeta[category];
      if (meta) {
        results.push({
          type: category,
          label: meta.label,
          labelUrdu: meta.labelUrdu,
          confidence: Math.min(matchedWords.length / 3, 1),
          color: meta.color,
          keywords: matchedWords,
          actions: meta.actions,
          laws: meta.laws,
          systemPrompt: meta.systemPrompt,
          isPrimary: !multi.isDrafting && category === multi.primary,
        });
      }
    }
  }

  results.sort((a, b) => {
    // Primary always first
    if (a.isPrimary && !b.isPrimary) return -1;
    if (!a.isPrimary && b.isPrimary) return 1;
    return b.confidence - a.confidence;
  });

  return results;
}

// ============================================
// TYPES
// ============================================

export interface DetectedIntent {
  type: string;
  label: string;
  labelUrdu: string;
  confidence: number;
  color: string;
  keywords: string[];
  actions: IntentAction[];
  laws: string[];
  systemPrompt: string;
  isPrimary: boolean;
}

export interface IntentAction {
  label: string;
  labelUrdu: string;
  href: string;
  type: "template" | "tool";
}

// ============================================
// INTENT METADATA
// ============================================

const intentMeta: Record<string, {
  label: string;
  labelUrdu: string;
  color: string;
  laws: string[];
  systemPrompt: string;
  actions: IntentAction[];
}> = {
  drafting: {
    label: "Document Drafting",
    labelUrdu: "دستاویز ڈرافٹنگ",
    color: "blue",
    laws: ["CPC Order VII", "CrPC Section 200", "Qanun-e-Shahadat 1984"],
    systemPrompt: "Focus on document drafting. Provide properly formatted legal documents with correct headings, numbered paragraphs, prayer clause, and signature blocks.",
    actions: [
      { label: "Custom Affidavit", labelUrdu: "حلف نامہ", href: "/affidavits/custom-affidavit", type: "template" },
      { label: "Custom Agreement", labelUrdu: "معاہدہ", href: "/agreements/custom-agreement", type: "template" },
      { label: "Court Case Draft", labelUrdu: "عدالتی مسودہ", href: "/applications", type: "tool" },
    ],
  },
  criminal: {
    label: "Criminal Law",
    labelUrdu: "فوجداری قانون",
    color: "red",
    laws: ["Pakistan Penal Code 1860 (PPC)", "Code of Criminal Procedure 1898 (CrPC)", "Anti-Terrorism Act 1997", "Prevention of Electronic Crimes Act 2016"],
    systemPrompt: "This is a criminal law matter. Reference relevant PPC sections, CrPC procedures, bail provisions (Section 497, 498 CrPC). Explain rights of accused and complainant.",
    actions: [
      { label: "FIR Cancel Affidavit", labelUrdu: "ایف آئی آر منسوخی", href: "/affidavits/fir-cancel", type: "template" },
      { label: "Bail Application", labelUrdu: "ضمانت درخواست", href: "/criminal-law", type: "tool" },
      { label: "Surety Bond", labelUrdu: "ضمانتی بانڈ", href: "/affidavits/surety-bond", type: "template" },
      { label: "Police Application", labelUrdu: "تھانے میں درخواست", href: "/applications/police-station", type: "template" },
    ],
  },
  property: {
    label: "Property Law",
    labelUrdu: "جائیداد قانون",
    color: "emerald",
    laws: ["Transfer of Property Act 1882", "Registration Act 1908", "Specific Relief Act 1877", "Punjab Land Revenue Act 1967", "Stamp Act 1899", "Illegal Dispossession Act 2005"],
    systemPrompt: "This is a property law matter. Reference Transfer of Property Act, Registration Act, Revenue laws, stamp duty, and possession rights.",
    actions: [
      { label: "Sale Deed", labelUrdu: "بیع نامہ", href: "/agreements/sale-deed", type: "template" },
      { label: "Property Affidavit", labelUrdu: "جائیداد حلف نامہ", href: "/affidavits/property-ownership", type: "template" },
      { label: "Rent Agreement", labelUrdu: "کرایہ نامہ", href: "/agreements/rent-agreement", type: "template" },
      { label: "Tax Calculator", labelUrdu: "ٹیکس کیلکولیٹر", href: "/property-transfer/tax-calculator", type: "tool" },
    ],
  },
  family: {
    label: "Family Law",
    labelUrdu: "خاندانی قانون",
    color: "pink",
    laws: ["Muslim Family Laws Ordinance 1961", "Family Courts Act 1964", "Guardian and Wards Act 1890", "Dissolution of Muslim Marriages Act 1939"],
    systemPrompt: "This is a family law matter. Reference MFLO 1961, Family Courts Act 1964, Guardian and Wards Act 1890. Discuss mehr rights, custody, and maintenance.",
    actions: [
      { label: "Divorce Deed", labelUrdu: "طلاق نامہ", href: "/family-law/divorce-deed", type: "template" },
      { label: "Khula Application", labelUrdu: "خلع درخواست", href: "/family-law/khula", type: "template" },
      { label: "Maintenance", labelUrdu: "نفقہ", href: "/family-law/maintenance", type: "template" },
      { label: "Child Custody", labelUrdu: "حضانت", href: "/family-law/child-custody", type: "template" },
      { label: "Mehr Recovery", labelUrdu: "حق مہر وصولی", href: "/family-law/mehr-recovery", type: "template" },
    ],
  },
  civil: {
    label: "Civil Law",
    labelUrdu: "دیوانی قانون",
    color: "amber",
    laws: ["Code of Civil Procedure 1908 (CPC)", "Contract Act 1872", "Specific Relief Act 1877", "Limitation Act 1908"],
    systemPrompt: "This is a civil law matter. Reference CPC procedures, Contract Act 1872, Specific Relief Act, and Limitation Act.",
    actions: [
      { label: "Legal Notice", labelUrdu: "قانونی نوٹس", href: "/applications", type: "tool" },
      { label: "Custom Agreement", labelUrdu: "معاہدہ", href: "/agreements/custom-agreement", type: "template" },
      { label: "Settlement Deed", labelUrdu: "تصفیہ نامہ", href: "/agreements/settlement-deed", type: "template" },
    ],
  },
  corporate: {
    label: "Corporate / Business",
    labelUrdu: "کاروباری قانون",
    color: "indigo",
    laws: ["Companies Act 2017", "Partnership Act 1932", "SECP Regulations", "Sale of Goods Act 1930"],
    systemPrompt: "This is a corporate/business law matter. Reference Companies Act 2017, Partnership Act, SECP regulations.",
    actions: [
      { label: "Partnership Deed", labelUrdu: "شراکت نامہ", href: "/agreements/partnership-deed", type: "template" },
      { label: "Business Registration", labelUrdu: "کاروبار رجسٹریشن", href: "/affidavits/business-registration", type: "template" },
      { label: "Employment Contract", labelUrdu: "ملازمت معاہدہ", href: "/agreements/employment-contract", type: "template" },
      { label: "NDA", labelUrdu: "رازداری معاہدہ", href: "/agreements/non-disclosure", type: "template" },
    ],
  },
  tax: {
    label: "Tax / Revenue",
    labelUrdu: "ٹیکس / محصولات",
    color: "cyan",
    laws: ["Income Tax Ordinance 2001", "Stamp Act 1899", "Federal Excise Act 2005", "Sales Tax Act 1990"],
    systemPrompt: "This is a tax/revenue matter. Reference Income Tax Ordinance 2001, FBR notifications, stamp duty rates.",
    actions: [
      { label: "Tax Calculator", labelUrdu: "ٹیکس کیلکولیٹر", href: "/property-transfer/tax-calculator", type: "tool" },
      { label: "Income Affidavit", labelUrdu: "آمدنی حلف نامہ", href: "/affidavits/income-certificate", type: "template" },
    ],
  },
  immigration: {
    label: "Immigration",
    labelUrdu: "امیگریشن",
    color: "sky",
    laws: ["Pakistan Citizenship Act 1951", "Passport Act 1974", "Emigration Ordinance 1979"],
    systemPrompt: "This is an immigration matter. Reference Pakistan Citizenship Act, Passport Act, and relevant procedures.",
    actions: [
      { label: "Immigration Affidavit", labelUrdu: "امیگریشن حلف نامہ", href: "/affidavits/immigration-affidavit", type: "template" },
      { label: "Passport Affidavit", labelUrdu: "پاسپورٹ حلف نامہ", href: "/affidavits/passport-affidavit", type: "template" },
      { label: "NOC", labelUrdu: "عدم اعتراض", href: "/affidavits/noc", type: "template" },
    ],
  },
  "non-muslim": {
    label: "Non-Muslim / Minority Laws",
    labelUrdu: "غیر مسلم / اقلیتی قوانین",
    color: "indigo",
    laws: [
      "Christian Marriage Act 1872",
      "Divorce Act 1869 (Christian Divorce)",
      "Hindu Marriage Act 2017",
      "Sindh Hindu Marriage Act 2016",
      "Sikh Anand Karaj Marriage Act 2007/2018",
      "Parsi Marriage and Divorce Act 1936",
      "Succession Act 1925 (Non-Muslim Inheritance)",
      "Guardians and Wards Act 1890",
      "Evacuee Trust Properties Act 1975 (ETPB)",
      "Constitution Articles 20, 25, 26, 27, 28, 36 (Minority Rights)",
      "PPC Sections 295, 295-A, 295-B, 295-C (Blasphemy)",
      "PPC Sections 296-298 (Religious Assembly & Feelings)",
      "Child Marriage Restraint Act 1929",
      "NCHR Act 2012 (National Commission for Human Rights)",
    ],
    systemPrompt: `This is a NON-MUSLIM / MINORITY LAW matter in Pakistan. You are an expert in all personal laws applicable to non-Muslims in Pakistan.

KEY LAWS YOU MUST KNOW:
CHRISTIAN: Christian Marriage Act 1872 (Sections 27-31 marriage, Section 60 penalties), Divorce Act 1869 (Section 10 grounds, Section 10-A added grounds, Section 36-37 alimony).
HINDU: Hindu Marriage Act 2017 (Sections 4-6 conditions, Section 8 registration, Section 12 divorce), Sindh Hindu Marriage Act 2016.
SIKH: Sikh Anand Karaj Marriage Act 2007/2018.
PARSI: Parsi Marriage and Divorce Act 1936 (complete marriage & divorce framework).
SUCCESSION: Succession Act 1925 (Sections 370-390 succession certificate, equal shares for sons & daughters unlike Muslim law).
GUARDIANSHIP: Guardians & Wards Act 1890 (Section 7, 10, 17 - welfare of child paramount).
BLASPHEMY DEFENSE: PPC 295-A/B/C - cite Asia Bibi v State (2018 SCMR 1969), Salamat Masih v State (1995).
FORCED CONVERSION: Article 20 Constitution, PPC 365-B, 371-A. Reference Smt. Reeta Kumari v Province of Sindh.
MINORITY RIGHTS: Articles 20, 25, 26, 27, 28, 36 Constitution. Supreme Court Suo Motu Case 1/2014.
PROPERTY: Evacuee Trust Properties Act 1975 for religious property (churches, temples, gurdwaras).
MAINTENANCE: CrPC Section 488 applies to ALL citizens regardless of religion.

IMPORTANT: Non-Muslim personal law differs significantly from Muslim personal law. Do NOT apply Muslim Family Laws Ordinance 1961 or Dissolution of Muslim Marriages Act 1939 to non-Muslims.`,
    actions: [
      { label: "Christian Marriage", labelUrdu: "مسیحی شادی", href: "/non-muslim-laws/christian-marriage", type: "template" },
      { label: "Christian Divorce", labelUrdu: "مسیحی طلاق", href: "/non-muslim-laws/christian-divorce", type: "template" },
      { label: "Hindu Marriage", labelUrdu: "ہندو شادی", href: "/non-muslim-laws/hindu-marriage", type: "template" },
      { label: "Blasphemy Defense", labelUrdu: "توہین مذہب دفاع", href: "/non-muslim-laws/blasphemy-defense", type: "template" },
      { label: "Minority Rights Petition", labelUrdu: "اقلیتی حقوق", href: "/non-muslim-laws/minority-rights-petition", type: "template" },
      { label: "Forced Conversion", labelUrdu: "جبری تبدیلی مذہب", href: "/non-muslim-laws/forced-conversion", type: "template" },
    ],
  },
  general: {
    label: "General Legal",
    labelUrdu: "عمومی قانونی",
    color: "slate",
    laws: ["Constitution of Pakistan 1973", "General Clauses Act 1897"],
    systemPrompt: "Provide general Pakistani legal guidance. Reference relevant laws and procedures.",
    actions: [
      { label: "AI Legal Advisor", labelUrdu: "قانونی مشیر", href: "/ai-advisor", type: "tool" },
      { label: "Custom Affidavit", labelUrdu: "حلف نامہ", href: "/affidavits/custom-affidavit", type: "template" },
    ],
  },
};

// ============================================
// PUBLIC API
// ============================================

export function getIntentMeta(intentType: string) {
  return intentMeta[intentType] || intentMeta.general;
}

// Build system prompt with multi-intent context
export function getIntentSystemPrompt(text: string): string {
  const multi = detectMultiIntent(text);
  const primaryMeta = getIntentMeta(multi.primary);

  if (multi.primary === "general") return "";

  let prompt = `\nDETECTED LEGAL AREA: ${primaryMeta.label}`;

  if (multi.secondary) {
    const secondaryMeta = getIntentMeta(multi.secondary);
    prompt += ` + ${secondaryMeta.label}`;
  }

  if (multi.isDrafting && multi.contextCategory !== "general") {
    const contextMeta = getIntentMeta(multi.contextCategory);
    prompt += `\n\nUSER WANTS A DOCUMENT DRAFTED. Context: ${contextMeta.label}`;
    prompt += `\n${primaryMeta.systemPrompt}`;
    prompt += `\n${contextMeta.systemPrompt}`;
    prompt += `\n\nRELEVANT LAWS:\n${[...primaryMeta.laws, ...contextMeta.laws].map((l) => `- ${l}`).join("\n")}`;
  } else {
    prompt += `\n${primaryMeta.systemPrompt}`;
    prompt += `\n\nRELEVANT LAWS:\n${primaryMeta.laws.map((l) => `- ${l}`).join("\n")}`;

    if (multi.secondary) {
      const secMeta = getIntentMeta(multi.secondary);
      prompt += `\n${secMeta.laws.map((l) => `- ${l}`).join("\n")}`;
    }
  }

  prompt += "\n\nAlways cite specific sections when applicable.";
  return prompt;
}
