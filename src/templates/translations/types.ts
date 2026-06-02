export interface TranslationTemplate {
  id: string;
  name: string;
  nameUrdu: string;
  description: string;
  icon: string;
  extractionPrompt: string;
  buildHtml: (fields: Record<string, string>) => string;
}
