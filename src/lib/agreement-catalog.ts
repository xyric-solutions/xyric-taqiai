export interface AgreementCatalogItem {
  subType: string;
  label: string;
  labelUrdu: string;
  request: string;
  keywords: string[];
}

export interface AgreementCatalogGroup {
  id: string;
  label: string;
  labelUrdu: string;
  items: AgreementCatalogItem[];
}

export const AGREEMENT_CATALOG: AgreementCatalogGroup[] = [
  {
    id: "property-tenancy",
    label: "Property & Tenancy",
    labelUrdu: "جائیداد اور کرایہ داری",
    items: [
      { subType: "sale-deed", label: "Sale Deed / Agreement to Sell", labelUrdu: "بیع نامہ / معاہدہ فروخت", request: "Sale Deed / Agreement to Sell", keywords: ["property sale", "bai nama", "registry"] },
      { subType: "property-agreement", label: "Property Purchase Agreement (Byana)", labelUrdu: "بیعانہ نامہ", request: "Property Purchase Agreement (Byana)", keywords: ["property purchase", "advance", "token money", "bayana"] },
      { subType: "rent-agreement", label: "House / Residential Rent Agreement", labelUrdu: "رہائشی کرایہ نامہ", request: "Rent Agreement", keywords: ["house rent", "residential rent", "kiraya nama"] },
      { subType: "shop-rent", label: "Shop / Commercial Rent Agreement", labelUrdu: "دکان / تجارتی کرایہ نامہ", request: "Shop / Commercial Rent Agreement", keywords: ["shop rent", "commercial rent", "dukan kiraya"] },
      { subType: "lease-agreement", label: "Commercial Lease Agreement", labelUrdu: "تجارتی لیز معاہدہ", request: "Lease Agreement (Commercial)", keywords: ["commercial lease", "property lease"] },
      { subType: "agricultural-lease", label: "Agricultural Land Lease", labelUrdu: "زرعی زمین کا ٹھیکہ", request: "Agricultural Land Lease", keywords: ["farm lease", "agriculture lease", "land theka"] },
      { subType: "mortgage-deed", label: "Mortgage Deed (Rahn Nama)", labelUrdu: "رہن نامہ", request: "Mortgage Deed", keywords: ["mortgage", "rahn nama", "girvi property"] },
      { subType: "land-partition", label: "Land Partition Deed", labelUrdu: "تقسیم اراضی نامہ", request: "Land Partition Deed", keywords: ["partition deed", "land division", "taqseem"] },
      { subType: "settlement-deed", label: "Property Settlement Deed", labelUrdu: "تصفیہ جائیداد نامہ", request: "Property Settlement Deed", keywords: ["property settlement", "family property settlement"] },
      { subType: "tenancy-termination", label: "Tenancy Termination Agreement", labelUrdu: "اختتام کرایہ داری معاہدہ", request: "Tenancy Termination Agreement", keywords: ["end tenancy", "rent termination", "vacate agreement"] },
      { subType: "surrender-deed", label: "Surrender Deed", labelUrdu: "دستبرداری نامہ", request: "Surrender Deed", keywords: ["surrender lease", "relinquish tenancy"] },
    ],
  },
  {
    id: "business-commercial",
    label: "Business & Commercial",
    labelUrdu: "کاروباری اور تجارتی",
    items: [
      { subType: "partnership-deed", label: "Partnership Deed", labelUrdu: "شراکت داری نامہ", request: "Partnership Deed", keywords: ["business partnership", "partnership agreement", "shirkat"] },
      { subType: "joint-venture", label: "Joint Venture Agreement", labelUrdu: "مشترکہ منصوبہ معاہدہ", request: "Joint Venture Agreement", keywords: ["joint venture", "jv agreement"] },
      { subType: "business-sale", label: "Business Sale Agreement", labelUrdu: "کاروبار فروخت معاہدہ", request: "Business Sale Agreement", keywords: ["sell business", "business transfer"] },
      { subType: "franchise-agreement", label: "Franchise Agreement", labelUrdu: "فرنچائز معاہدہ", request: "Franchise Agreement", keywords: ["franchise contract"] },
      { subType: "agency-agreement", label: "Agency Agreement", labelUrdu: "ایجنسی معاہدہ", request: "Agency Agreement", keywords: ["agent appointment", "commission agent"] },
      { subType: "distribution-agreement", label: "Distribution Agreement", labelUrdu: "تقسیم کاری معاہدہ", request: "Distribution Agreement", keywords: ["distributor", "distribution contract"] },
      { subType: "power-sharing", label: "Profit Sharing Agreement (Mudarabah)", labelUrdu: "منافع شراکت معاہدہ", request: "Profit/Power Sharing Agreement (Mudarabah)", keywords: ["profit sharing", "mudarabah", "investment sharing"] },
      { subType: "mou", label: "Memorandum of Understanding (MOU)", labelUrdu: "مفاہمتی یادداشت", request: "Memorandum of Understanding (MOU)", keywords: ["mou", "memorandum understanding"] },
      { subType: "non-disclosure", label: "Non-Disclosure Agreement (NDA)", labelUrdu: "رازداری معاہدہ", request: "Non-Disclosure Agreement (NDA)", keywords: ["nda", "confidentiality", "secrecy agreement"] },
    ],
  },
  {
    id: "employment-services",
    label: "Employment & Services",
    labelUrdu: "ملازمت اور خدمات",
    items: [
      { subType: "employment-contract", label: "Employment Contract", labelUrdu: "ملازمت کا معاہدہ", request: "Employment Contract", keywords: ["employment agreement", "job contract", "employee"] },
      { subType: "contract-labor", label: "Contract Labour Agreement", labelUrdu: "ٹھیکہ مزدوری معاہدہ", request: "Contract Labor Agreement", keywords: ["contract labour", "labor supply", "manpower"] },
      { subType: "service-agreement", label: "Service / Consultancy Agreement", labelUrdu: "خدمات / مشاورتی معاہدہ", request: "Service Agreement", keywords: ["consultancy", "professional services", "freelance"] },
      { subType: "construction-contract", label: "Construction Contract", labelUrdu: "تعمیراتی معاہدہ", request: "Construction Contract", keywords: ["building contract", "construction agreement", "contractor"] },
      { subType: "sub-contract", label: "Sub-Contract Agreement", labelUrdu: "ذیلی ٹھیکہ معاہدہ", request: "Sub-Contract Agreement", keywords: ["subcontract", "sub contractor"] },
      { subType: "license-agreement", label: "License Agreement", labelUrdu: "لائسنس معاہدہ", request: "License Agreement", keywords: ["software license", "brand license", "ip license"] },
    ],
  },
  {
    id: "finance-security",
    label: "Finance & Security",
    labelUrdu: "قرض اور ضمانت",
    items: [
      { subType: "loan-agreement", label: "Loan Agreement", labelUrdu: "قرض نامہ", request: "Loan Agreement", keywords: ["personal loan", "business loan", "qarz"] },
      { subType: "guarantor-agreement", label: "Guarantor / Surety Agreement", labelUrdu: "ضمانت نامہ", request: "Guarantor / Surety Agreement", keywords: ["guarantee", "surety", "zamanat"] },
      { subType: "indemnity-agreement", label: "Indemnity Agreement", labelUrdu: "معاوضہ ضمانتی معاہدہ", request: "Indemnity Agreement", keywords: ["indemnity bond", "hold harmless"] },
      { subType: "pledge-agreement", label: "Pledge Agreement", labelUrdu: "رہن منقولہ معاہدہ", request: "Pledge Agreement", keywords: ["pledge", "girvi", "security asset"] },
      { subType: "escrow-agreement", label: "Escrow Agreement", labelUrdu: "ایسکرو معاہدہ", request: "Escrow Agreement", keywords: ["escrow", "stakeholder", "held funds"] },
      { subType: "arbitration-agreement", label: "Arbitration Agreement", labelUrdu: "ثالثی معاہدہ", request: "Arbitration Agreement", keywords: ["arbitration clause", "dispute resolution", "salisi"] },
    ],
  },
  {
    id: "personal-assets",
    label: "Personal & Movable Assets",
    labelUrdu: "ذاتی اور منقولہ اثاثے",
    items: [
      { subType: "vehicle-sale", label: "Vehicle / Car / Motorcycle Sale Agreement", labelUrdu: "گاڑی / کار / موٹر سائیکل فروخت نامہ", request: "Vehicle Sale Agreement", keywords: ["car sale", "motorcycle sale", "bike sale", "motor vehicle", "gaari farokht"] },
      { subType: "gift-deed", label: "Gift Deed (Hiba Nama)", labelUrdu: "ہبہ نامہ", request: "Gift Deed", keywords: ["gift agreement", "hiba nama", "property gift"] },
      { subType: "exchange-deed", label: "Exchange Deed", labelUrdu: "تبادلہ نامہ", request: "Exchange Deed", keywords: ["property exchange", "asset swap", "tabadla"] },
      { subType: "divorce-settlement", label: "Divorce Settlement Agreement", labelUrdu: "طلاق تصفیہ معاہدہ", request: "Divorce Settlement Agreement", keywords: ["mutual divorce settlement", "family settlement"] },
      { subType: "will-wasiyat", label: "Will / Wasiyat Nama", labelUrdu: "وصیت نامہ", request: "Will / Wasiyat Nama", keywords: ["will", "wasiyat", "testament"] },
    ],
  },
  {
    id: "deeds-corrections",
    label: "Deeds & Corrections",
    labelUrdu: "دستاویزات اور اصلاح",
    items: [
      { subType: "cancellation-deed", label: "Cancellation Deed", labelUrdu: "منسوخی نامہ", request: "Cancellation Deed", keywords: ["cancel deed", "agreement cancellation"] },
      { subType: "rectification-deed", label: "Rectification Deed", labelUrdu: "تصحیح نامہ", request: "Rectification Deed", keywords: ["correct deed", "deed correction", "rectify agreement"] },
      { subType: "release-deed", label: "Release / Relinquishment Deed", labelUrdu: "دستبرداری / حق برداری نامہ", request: "Release Deed", keywords: ["relinquishment", "release rights", "haq bardari"] },
    ],
  },
  {
    id: "other",
    label: "Other",
    labelUrdu: "دیگر",
    items: [
      { subType: "custom-agreement", label: "Custom / Other Agreement", labelUrdu: "حسب ضرورت دیگر معاہدہ", request: "Custom / AI-Guided Agreement", keywords: ["custom agreement", "other agreement", "special agreement"] },
    ],
  },
];

export const AGREEMENT_SUGGESTIONS = AGREEMENT_CATALOG.flatMap((group) =>
  group.items.map((item) => ({
    label: item.request,
    kw: [item.label.toLowerCase(), item.subType.replace(/-/g, " "), ...item.keywords],
    cat: "agreement",
  }))
);

export const AGREEMENT_TEMPLATE_COUNT = AGREEMENT_CATALOG.reduce(
  (count, group) => count + group.items.length,
  0
);

function normalizeAgreementSearch(value: string): string {
  return value
    .toLowerCase()
    .replace(/\b(sell|selling|sold)\b/g, "sale")
    .replace(/\b(motorbike|bike)\b/g, "motorcycle")
    .replace(/\bautomobile\b/g, "vehicle")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

const GENERIC_AGREEMENT_WORDS = new Set([
  "a", "an", "the", "for", "of", "to", "my", "our", "agreement", "contract", "deed", "document",
]);

export function findAgreementCatalogItem(value: string): AgreementCatalogItem | null {
  const query = normalizeAgreementSearch(value);
  if (!query) return null;
  const queryTokens = new Set(query.split(" ").filter(Boolean));

  const ranked = AGREEMENT_CATALOG.flatMap((group) => group.items)
    .map((item) => {
      const terms = [item.request, item.label, item.subType, ...item.keywords]
        .map(normalizeAgreementSearch)
        .filter(Boolean);
      let score = 0;

      for (const term of terms) {
        if (query === term) score = Math.max(score, 200 + term.length);
        else if (query.includes(term)) score = Math.max(score, 120 + term.length);
        else if (term.includes(query) && query.length >= 4) score = Math.max(score, 70 + query.length);

        const meaningfulTokens = [...new Set(
          term
            .split(" ")
            .filter((token) => token.length > 1 && !GENERIC_AGREEMENT_WORDS.has(token))
        )];
        if (meaningfulTokens.length > 0 && meaningfulTokens.every((token) => queryTokens.has(token))) {
          score = Math.max(score, 70 + meaningfulTokens.length * 35);
        }
      }

      return { item, score };
    })
    .filter(({ score }) => score > 0)
    .sort((first, second) => second.score - first.score);

  return ranked[0]?.item || null;
}
