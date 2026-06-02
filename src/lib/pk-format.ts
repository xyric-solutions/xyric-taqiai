// Pakistani number formatting for legal documents

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

function pkNumberFormat(n: number): string {
  const str = Math.floor(Math.abs(n)).toString();
  if (str.length <= 3) return str;
  let result = str.slice(-3);
  let remaining = str.slice(0, -3);
  while (remaining.length > 0) {
    result = remaining.slice(-2) + "," + result;
    remaining = remaining.slice(0, -2);
  }
  return result;
}

export function formatPKR(n: number): string {
  return "Rs. " + pkNumberFormat(Math.floor(n)) + "/-";
}

export function toPKWords(n: number): string {
  if (n === 0) return "Zero Only";
  const num = Math.floor(Math.abs(n));

  const crore = Math.floor(num / 10000000);
  const rem1 = num % 10000000;
  const lakh = Math.floor(rem1 / 100000);
  const rem2 = rem1 % 100000;
  const thousand = Math.floor(rem2 / 1000);
  const rem3 = rem2 % 1000;
  const hundred = Math.floor(rem3 / 100);
  const rest = rem3 % 100;

  const parts: string[] = [];
  if (crore) parts.push(twoDigitWords(crore) + " Crore");
  if (lakh) parts.push(twoDigitWords(lakh) + " Lac");
  if (thousand) parts.push(twoDigitWords(thousand) + " Thousand");
  if (hundred) parts.push(ones[hundred] + " Hundred");
  if (rest) parts.push(twoDigitWords(rest));

  return parts.join(" ") + " Only";
}

// Full formatted amount with half if >= 1 lac
export function formatAmountFull(n: number): string {
  if (isNaN(n) || n <= 0) return "";
  const pkr = formatPKR(n);
  const words = toPKWords(n);
  let result = `${pkr} (${words})`;
  if (n >= 100000) {
    const half = n / 2;
    result += ` | Half Amount: ${formatPKR(half)} (${toPKWords(half)})`;
  }
  return result;
}

// Detect if a form field is a monetary amount field (by label)
const MONEY_URDU = ["روپے", "رقم", "قیمت", "اجرت", "تنخواہ", "فیس", "ڈپازٹ", "سرمایہ", "معاوضہ", "امانت"];
const MONEY_EN = ["amount", "price", "rent", "salary", "fee", "deposit", "capital", "cost", "consideration", "value", "payment", "goodwill", "compensation", "liability"];

export function isAmountField(label: string, labelUrdu: string): boolean {
  const lowerLabel = label.toLowerCase();
  return MONEY_URDU.some((k) => labelUrdu.includes(k)) || MONEY_EN.some((k) => lowerLabel.includes(k));
}
