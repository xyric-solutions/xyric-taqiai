// Monetary formatting for Pakistani legal documents

const ones = [
  "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
  "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
  "Seventeen", "Eighteen", "Nineteen",
];
const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

function twoDigitWords(n: number): string {
  if (n === 0) return "";
  if (n < 20) return ones[n];
  return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + ones[n % 10] : "");
}

function threeDigitWords(n: number): string {
  const hundred = Math.floor(n / 100);
  const remainder = n % 100;
  const parts: string[] = [];
  if (hundred) parts.push(`${ones[hundred]} Hundred`);
  if (remainder) parts.push(twoDigitWords(remainder));
  return parts.join(" ");
}

function formatPakistaniNumber(n: number): string {
  const digits = Math.floor(Math.abs(n)).toString();
  if (digits.length <= 3) return digits;

  const groups = [digits.slice(-3)];
  let remaining = digits.slice(0, -3);
  while (remaining.length > 0) {
    groups.unshift(remaining.slice(-2));
    remaining = remaining.slice(0, -2);
  }
  return groups.join(",");
}

export function formatPKR(n: number): string {
  return `Rs. ${formatPakistaniNumber(n)}/-`;
}

export function toPKWords(n: number): string {
  if (n === 0) return "Rupees Zero Only";
  let remaining = Math.floor(Math.abs(n));
  const scales = [
    { value: 100_000_000_000, label: "Kharab" },
    { value: 1_000_000_000, label: "Arab" },
    { value: 10_000_000, label: "Crore" },
    { value: 100_000, label: "Lac" },
    { value: 1_000, label: "Thousand" },
  ];
  const parts: string[] = [];
  for (const scale of scales) {
    const chunk = Math.floor(remaining / scale.value);
    if (chunk) {
      parts.push(`${threeDigitWords(chunk)} ${scale.label}`);
      remaining %= scale.value;
    }
  }
  if (remaining) parts.push(threeDigitWords(remaining));

  return `Rupees ${parts.join(" ")} Only`;
}

export function formatAmountFull(n: number): string {
  if (isNaN(n) || n <= 0) return "";
  const amount = `${formatPKR(n)} (${toPKWords(n)})`;
  if (n < 100_000) return amount;

  const half = n / 2;
  return `${amount} | Half Amount: ${formatPKR(half)} (${toPKWords(half)})`;
}

// Detect if a form field is a monetary amount field (by label)
const MONEY_URDU = ["روپے", "رقم", "قیمت", "اجرت", "تنخواہ", "فیس", "ڈپازٹ", "سرمایہ", "معاوضہ", "امانت"];
const MONEY_EN = ["amount", "price", "rent", "salary", "fee", "deposit", "capital", "cost", "consideration", "value", "payment", "goodwill", "compensation", "liability"];

export function isAmountField(label: string, labelUrdu: string): boolean {
  const lowerLabel = label.toLowerCase();
  return MONEY_URDU.some((k) => labelUrdu.includes(k)) || MONEY_EN.some((k) => lowerLabel.includes(k));
}

const NON_AMOUNT_HINTS = /(?:date|day|duration|term|method|mode|schedule|status|type|percentage|percent|rate|number|no\b)/i;
const AMOUNT_HINTS = /(?:amount|price|rent|salary|fee|deposit|capital|cost|consideration|value|compensation|liability|damages|income|mehr|dower|maintenance|balance|payment|advance|arrears|tax|fine|penalty|goodwill|royalty|expense|charges?)/i;

export function isMonetaryField(id: string, label = ""): boolean {
  const text = `${id.replace(/([a-z])([A-Z])/g, "$1 $2")} ${label}`;
  return AMOUNT_HINTS.test(text) && !NON_AMOUNT_HINTS.test(text);
}

export function parseMonetaryValue(value: string): number | null {
  const match = value.replace(/,/g, "").match(/(?:PKR|Rs\.?|Rupees)?\s*(\d+(?:\.\d+)?)/i);
  if (!match) return null;
  const amount = Number(match[1]);
  return Number.isFinite(amount) && amount > 0 ? amount : null;
}

export function formatMonetaryRecord(values: Record<string, string>): Record<string, string> {
  const formatted = { ...values };
  for (const [id, value] of Object.entries(values)) {
    if (!value?.trim() || !isMonetaryField(id)) continue;
    const amount = parseMonetaryValue(value);
    if (amount !== null) formatted[id] = formatAmountFull(amount);
  }
  return formatted;
}

export function formatMonetaryAmountsInHtml(html: string): string {
  const amountPattern = /\b(?:PKR|Rs\.?|Rupees)\s*([0-9][0-9,]*(?:\.\d+)?)\s*(?:\/-)?(?:(\s*(?:<\/(?:strong|b|span|bdi)>\s*)*)\(\s*(?:Rupees\s+)?(?:[A-Za-z _-]+|<\/?(?:strong|b|span|bdi)>)+Only\s*\))?/gi;
  const normalizedCurrency = html.replace(/\bPKR\s+(?=Rs\.)/gi, "");
  const formattedHtml = normalizedCurrency.replace(amountPattern, (full, numericValue: string, closingMarkup: string | undefined, offset: number, source: string) => {
    const amount = parseMonetaryValue(numericValue);
    if (amount === null) return full;
    const figureAndWords = `${formatPKR(amount)} (${toPKWords(amount)})`;
    const hasExistingHalf = /^\s*(?:\||-)?\s*Half Amount\s*:/i.test(source.slice(offset + full.length));
    const isHalfAmount = /Half Amount\s*:\s*$/i.test(source.slice(Math.max(0, offset - 30), offset));
    const formatted = amount >= 100_000 && !hasExistingHalf && !isHalfAmount
      ? `${figureAndWords} | Half Amount: ${formatPKR(amount / 2)} (${toPKWords(amount / 2)})`
      : figureAndWords;
    if (!closingMarkup?.includes("</")) return formatted;
    const firstAmountEnd = formatted.indexOf(" (Rupees");
    if (firstAmountEnd < 0) return formatted;
    return `${formatted.slice(0, firstAmountEnd)}${closingMarkup.trim()}${formatted.slice(firstAmountEnd)}`;
  });
  return formattedHtml.replace(/(\(Rupees [A-Za-z -]+ Only\))\s*PKR\b/gi, "$1");
}
