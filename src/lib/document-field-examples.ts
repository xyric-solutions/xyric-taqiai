import { formatAmountFull, isMonetaryField } from "@/lib/pk-format";

interface DocumentFieldExampleInput {
  id: string;
  label: string;
  documentType?: string;
  fieldType?: string;
  language?: string;
  providedExample?: string;
  options?: { value: string; label: string; labelUrdu?: string }[];
}

const GENERIC_EXAMPLE = /^(?:enter|provide|describe|list|select|type|write|specify|state|xxxxx|03xx|n\/a)\b/i;

function amountExample(text: string): string {
  if (/rent|salary|maintenance|monthly|fee|royalty/i.test(text)) return formatAmountFull(50_000);
  if (/deposit|advance|byana|mehr|dower/i.test(text)) return formatAmountFull(500_000);
  if (/sale price|vehicle|car/i.test(text)) return formatAmountFull(2_500_000);
  if (/capital|business|property value/i.test(text)) return formatAmountFull(5_000_000);
  if (/damages|compensation/i.test(text)) return formatAmountFull(1_000_000);
  return formatAmountFull(1_000_000);
}

export function getDocumentFieldExample(input: DocumentFieldExampleInput): string {
  const text = `${input.id.replace(/([a-z])([A-Z])/g, "$1 $2")} ${input.label} ${input.documentType || ""}`.toLowerCase();
  const provided = input.providedExample?.trim() || "";
  if (isMonetaryField(input.id, input.label)) return amountExample(text);
  if (provided && !GENERIC_EXAMPLE.test(provided)) return provided.replace(/^e\.g\.\s*/i, "");
  const isUrdu = input.language === "ur";

  if (input.options?.length) {
    const option = input.options[0];
    return isUrdu ? option.labelUrdu || option.label : option.label;
  }
  if (/father|parentage|spouse/.test(text)) return isUrdu ? "محمد اسلم" : "Muhammad Aslam";
  if (/seller.*name|vendor.*name|owner.*name|first party.*name/.test(text)) return isUrdu ? "علی خان" : "Ali Khan";
  if (/buyer.*name|purchaser.*name|vendee.*name|second party.*name/.test(text)) return isUrdu ? "احمد رضا" : "Ahmed Raza";
  if (/advocate.*name|lawyer.*name/.test(text)) return isUrdu ? "ایڈووکیٹ فاطمہ علی" : "Advocate Fatima Ali";
  if (/company.*name|business.*name|entity.*name/.test(text)) return "ABC Traders (Private) Limited";
  if (/name/.test(text) && /deceased/.test(text)) return isUrdu ? "محمد یوسف مرحوم" : "Late Muhammad Yousaf";
  if (/name/.test(text)) return isUrdu ? "محمد احمد" : "Muhammad Ahmed";
  if (/cnic|identity card/.test(text)) return "35202-1234567-1";
  if (/ntn/.test(text)) return "1234567-8";
  if (/registration/.test(text) && /vehicle|car|motorcycle/.test(text)) return "LEA-1234";
  if (/registration/.test(text) && /company|business|secp|entity/.test(text)) return "SECP CUIN 0123456";
  if (/registration|reference|case number|case no|fir/.test(text)) return /fir/.test(text) ? "FIR No. 123/2026" : "Suit No. 145/2026";
  if (/engine/.test(text)) return "2ZR-FE123456";
  if (/chassis/.test(text)) return "JTDBR32E123456789";
  if (/vehicle.*make|make.*vehicle/.test(text)) return "Toyota";
  if (/vehicle.*model|model.*vehicle/.test(text)) return "Corolla GLi";
  if (/manufacture|model year|vehicle year/.test(text)) return "2021";
  if (/vehicle.*color|colour/.test(text)) return "White";
  if (/phone|mobile|contact number/.test(text)) return "0300-1234567";
  if (/email/.test(text)) return "ali.khan@example.com";
  if (/address|residence|resident/.test(text)) return isUrdu ? "مکان نمبر 12، گلبرگ، لاہور" : "House No. 12, Gulberg, Lahore";
  if (/court|tribunal|forum/.test(text)) return "Court of Civil Judge, Lahore";
  if (/police station|thana/.test(text)) return "Police Station Gulberg, Lahore";
  if (/district|city|place of execution|location/.test(text)) return "Lahore, Punjab";
  if (/section|legal provision|law invoked/.test(text)) return "Section 497 Cr.P.C.";
  if (/date of arrest/.test(text)) return "10 July 2026";
  if (/date|execution day|transfer day/.test(text) || input.fieldType === "date") return "20 July 2026";
  if (/property.*type/.test(text)) return "Residential house";
  if (/property.*address|premises/.test(text)) return "House No. 12, Block B, Gulberg III, Lahore";
  if (/plot|khasra|survey|property number/.test(text)) return "Plot No. 24, Khasra No. 115/2";
  if (/area|measurement|size/.test(text)) return "10 Marla";
  if (/payment.*terms|installment/.test(text)) return "Full payment on signing through bank transfer; receipt acknowledged by the Seller.";
  if (/vehicle.*condition|condition.*vehicle/.test(text)) return "Used vehicle in good running condition, inspected and accepted by the Buyer.";
  if (/facts|chronology|background|incident|occurrence/.test(text)) return "The agreement was signed on 1 June 2026. The other party failed to perform the agreed obligation despite written notice dated 15 June 2026.";
  if (/relief|prayer|desired result|requested action/.test(text)) return "Direct the respondent to comply with the agreement and grant any other appropriate relief.";
  if (/evidence|supporting document|annexure/.test(text)) return "Signed agreement, payment receipt, CNIC copies, and relevant correspondence.";
  if (/scope|authority|power/.test(text)) return "Authority to sign, submit, and collect documents relating only to the identified matter.";
  if (/purpose|subject/.test(text)) return `Preparation of a ${input.documentType || input.label} for the stated transaction or matter.`;
  if (/description|detail|particular|special condition|clause|term/.test(text)) return `State the exact ${input.label.toLowerCase()} agreed by the parties, including relevant dates and identifiers.`;
  if (/percentage|share|ratio/.test(text)) return "50%";
  if (/interest|markup|rate/.test(text)) return "0% for an interest-free loan, or 10% per annum if agreed.";
  if (/duration|period|tenure/.test(text)) return "One year commencing from 20 July 2026";

  return `Provide the exact ${input.label.toLowerCase()} relevant to this ${input.documentType || "legal document"}.`;
}
