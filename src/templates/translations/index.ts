import { TranslationTemplate } from "./types";
import { nikahNamaTranslation } from "./nikah-nama";
import { nikahNamaTraditionalTranslation } from "./nikah-nama-traditional";
import { divorceCertificateTranslation } from "./divorce-certificate";
import { saleDeedTranslation } from "./sale-deed";
import { idCardTranslation } from "./id-card";
import { birthCertificateTranslation } from "./birth-certificate";
import { fardTranslation } from "./fard";
import { mortgageDeedTranslation } from "./mortgage-deed";
import { agricultureLandTranslation } from "./agriculture-land";
import { giftDeedTranslation } from "./gift-deed";

export const TRANSLATION_TEMPLATES: TranslationTemplate[] = [
  nikahNamaTranslation,
  nikahNamaTraditionalTranslation,
  divorceCertificateTranslation,
  saleDeedTranslation,
  idCardTranslation,
  birthCertificateTranslation,
  fardTranslation,
  mortgageDeedTranslation,
  agricultureLandTranslation,
  giftDeedTranslation,
];

export function getTranslationTemplate(id: string): TranslationTemplate | undefined {
  return TRANSLATION_TEMPLATES.find((t) => t.id === id);
}

export type { TranslationTemplate };
