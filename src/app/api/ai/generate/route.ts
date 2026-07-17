import { NextRequest, NextResponse } from "next/server";
import { getAllTemplates, getTemplate } from "@/templates";
import { generateDocument } from "@/lib/gemini";
import { isIncompleteLegalDocument, normalizeGeneratedHtml } from "@/lib/document-html";
import { formatAmountFull, isAmountField } from "@/lib/pk-format";
import { TemplateDefinition } from "@/templates/types";
import { getCurrentUser } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { findCaseIntakeProfile, knowledgeBlock } from "@/lib/case-builder-knowledge";
import {
  auditCourtDraftStructure,
  buildCourtReformatPrompt,
  getCourtDraftingStandard,
} from "@/lib/court-drafting-standard";

function getDocumentGenerationError(message: string): { error: string; status: number } {
  const msg = message.toLowerCase();

  if (msg.includes("429") || msg.includes("quota") || msg.includes("exhausted")) {
    return {
      error: "AI quota exhausted. Please wait a moment and try again.",
      status: 429,
    };
  }

  if (msg.includes("api_key") || msg.includes("401") || msg.includes("403")) {
    return {
      error: "Gemini API key is invalid. Please set the correct key in the .env.local file.",
      status: 401,
    };
  }

  if (
    msg.includes("fetch failed") ||
    msg.includes("network") ||
    msg.includes("econnreset") ||
    msg.includes("etimedout") ||
    msg.includes("timeout") ||
    msg.includes("503") ||
    msg.includes("500") ||
    msg.includes("overloaded") ||
    msg.includes("service unavailable")
  ) {
    return {
      error: "The AI service is temporarily unavailable. Please check your internet connection and try again.",
      status: 503,
    };
  }

  return {
    error: "Document generation failed. Please try again.",
    status: 500,
  };
}

// Category-specific formatting rules (injected into every prompt)
function getCategoryRules(category: string, language: string): string {
  const isUrdu = language === "ur";

  if (category === "affidavit") {
    return `

CRITICAL RULES FOR AFFIDAVITS (STRICTLY FOLLOW):
1. DO NOT include any "Witnesses" or "گواہان" section with Witness 1 / Witness 2 fields
2. DO NOT add name, father's name, CNIC, or signature blocks for witnesses
3. DO NOT include "تصدیق از اوتھ کمشنر / نوٹری پبلک" (Attestation by Oath Commissioner / Notary Public) section
4. DO NOT add any notary attestation paragraph
5. DO NOT include lines like "تصدیق کی جاتی ہے کہ حلف کنندہ..." or similar attestation statements
6. ONLY include: Title, Deponent details, Declaration body, Verification clause, Deponent signature
7. End the affidavit at the deponent's signature - NOTHING after that
8. If any field value is "N/A" or missing, write "___________" (blank underline) as placeholder — NEVER write explanatory notes, asterisks (*...*), or any commentary about why a field is missing. No brackets with notes like [Field - *Not provided...*]`;
  }

  if (category === "agreement") {
    return `

CRITICAL RULES FOR AGREEMENTS (STRICTLY FOLLOW):
0. If any field value is "N/A" or missing, write "___________" as placeholder — NEVER add explanatory notes, asterisks, or commentary about missing fields anywhere in the document
1. For witnesses section, use SIMPLE format ONLY - do NOT include name/father/CNIC/signature fields
2. Witness section must be exactly like this (2 witnesses maximum):

${isUrdu ? `
گواہ شد: ________________________________

گواہ شد: ________________________________
` : `
Witness (گواہ شد): ________________________________

Witness (گواہ شد): ________________________________
`}

3. DO NOT add separate lines for name, father's name, CNIC, or signature of witnesses
4. DO NOT include "تصدیق از اوتھ کمشنر / نوٹری پبلک" or notary attestation section
5. Just simple blank lines labeled "گواہ شد" for signatures only`;
  }

  if (category === "family-law" || category === "power-of-attorney") {
    return `

CRITICAL RULES (STRICTLY FOLLOW):
1. DO NOT include detailed "Witnesses" section with name, father, CNIC, signature fields
2. If witnesses are needed, use SIMPLE format: "گواہ شد: _______________" (just a blank line)
3. DO NOT include notary/oath commissioner attestation section
4. Keep the document clean - end at the party's signature blocks`;
  }

  return "";
}

function getGlobalDocumentRules(): string {
  return `

GLOBAL FORMAT RULES (STRICTLY FOLLOW FOR EVERY DOCUMENT):
1. Return document body HTML only. Do NOT include <style>, <script>, <html>, <head>, or <body> tags.
2. Do NOT add custom CSS, body padding, page margins, page-break rules, font-size rules, or large blank spaces.
3. Use clean legal structure with <h2>, <h3>, <p>, <strong>, <table>, <ol>, <li>, <hr>, and <br> only.
4. Court cases, petitions, applications, and suits must NOT stop at "RESPECTFULLY SHEWETH:".
5. After "RESPECTFULLY SHEWETH:", include at least 7 complete numbered paragraphs, then prayer, verification, and signature blocks where applicable.
6. Affidavits, agreements, notices, deeds, and powers of attorney must include complete body clauses and signature sections.
7. If information is missing, write "___________"; do not omit the clause or section.`;
}

// Remove unwanted witness/notary sections from AI output
function stripUnwantedSections(html: string, category: string): string {
  if (category !== "affidavit" && category !== "agreement" && category !== "family-law" && category !== "power-of-attorney") {
    return html;
  }

  let cleaned = html;

  // Patterns to remove (works for both Urdu and English)
  const patternsToRemove = [
    // Notary / Oath Commissioner attestation section
    /<h[1-6][^>]*>\s*(تصدیق\s+از\s+اوتھ\s+کمشنر|Attestation\s+by\s+Oath\s+Commissioner|Notary\s+Public|تصدیق\s+ازاں|NOTARY\s+ATTESTATION|OATH\s+COMMISSIONER)[^<]*<\/h[1-6]>[\s\S]*?(?=<h[1-6]|$)/gi,
    // "تصدیق کی جاتی ہے" paragraph
    /<p[^>]*>\s*تصدیق\s+کی\s+جاتی\s+ہے[\s\S]*?<\/p>/gi,
    // "I hereby certify that" paragraph (notary certification)
    /<p[^>]*>\s*I\s+hereby\s+certify\s+that[\s\S]*?<\/p>/gi,
    // "میں حافظ تصدیق کرتا ہوں" paragraph
    /<p[^>]*>\s*میں\s+حافظ[\s\S]*?<\/p>/gi,
    // "اوتھ کمشنر / نوٹری پبلک" signature line at end
    /<p[^>]*>\s*(اوتھ\s+کمشنر|نوٹری\s+پبلک|Oath\s+Commissioner|Notary\s+Public)\s*<\/p>/gi,
  ];

  // For affidavits - also remove detailed witness section
  if (category === "affidavit") {
    const affidavitPatterns = [
      // Witness heading
      /<h[1-6][^>]*>\s*(گواہان|Witnesses|WITNESSES)\s*<\/h[1-6]>[\s\S]*?(?=<h[1-6]|$)/gi,
      // Witness 1 / Witness 2 blocks with name, father, CNIC
      /<(p|div)[^>]*>\s*(گواہ\s+نمبر|Witness\s+(?:No\.|Number)?\s*[12]|WITNESS\s+[12])[\s\S]*?(دستخط|Signature)[\s\S]*?<\/(p|div)>/gi,
    ];
    patternsToRemove.push(...affidavitPatterns);
  }

  // Apply all removal patterns
  for (const pattern of patternsToRemove) {
    cleaned = cleaned.replace(pattern, "");
  }

  // Clean up multiple empty lines/divs
  cleaned = cleaned.replace(/(<br\s*\/?>\s*){3,}/gi, "<br/><br/>");
  cleaned = cleaned.replace(/(<hr[^>]*>\s*){2,}/gi, "<hr/>");

  return cleaned;
}

function processAmountFields(formData: Record<string, string>, template: TemplateDefinition): Record<string, string> {
  const processed = { ...formData };
  for (const field of template.formFields) {
    const value = formData[field.name];
    if (!value || field.type !== "number") continue;
    if (!isAmountField(field.label, field.labelUrdu)) continue;
    const num = parseFloat(value.replace(/,/g, ""));
    if (!isNaN(num) && num > 0) {
      processed[field.name] = formatAmountFull(num);
    }
  }
  return processed;
}

const ALLOWED_CATEGORIES = new Set(getAllTemplates().map((template) => template.category));

export async function POST(request: NextRequest) {
  const session = await getCurrentUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!rateLimit(session.userId, 20, 60_000)) {
    return NextResponse.json({ error: "Too many requests. Please wait a minute and try again." }, { status: 429 });
  }

  try {
    const { category, subType, formData, language } = await request.json();

    if (!category || !subType || !formData) {
      return NextResponse.json(
        { error: "Missing required fields: category, subType, formData" },
        { status: 400 }
      );
    }

    if (!ALLOWED_CATEGORIES.has(category)) {
      return NextResponse.json({ error: "Invalid document category" }, { status: 400 });
    }

    const template = getTemplate(category, subType);
    if (!template) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    // Format amount fields to Pakistani format before sending to AI
    const processedFormData = processAmountFields(formData, template);

    // Inject category-specific rules into the prompt
    const categoryRules = getCategoryRules(category, language || "en");
    const draftingRequest = [template.name, template.description, category, subType].join(" ");
    const courtStandard = getCourtDraftingStandard(draftingRequest);
    const intakeProfile = findCaseIntakeProfile({ sections: draftingRequest, documentNeeded: template.name });
    const corpusKnowledge = knowledgeBlock(intakeProfile);
    const enhancedPrompt = template.promptTemplate
      + categoryRules
      + getGlobalDocumentRules()
      + (corpusKnowledge ? `\n\nANONYMIZED CORPUS-DERIVED LEGAL KNOWLEDGE:\n${corpusKnowledge}` : "")
      + courtStandard.prompt;

    let html = await generateDocument(
      enhancedPrompt,
      processedFormData,
      language || "en"
    );

    for (let attempt = 0; attempt < 2 && isIncompleteLegalDocument(html); attempt++) {
      html = await generateDocument(
        `${enhancedPrompt}

IMPORTANT: Regenerate the COMPLETE document from the beginning. The previous output was incomplete.
- Do not stop at "RESPECTFULLY SHEWETH:".
- Include at least 7 complete numbered paragraphs after the opening.
- Include prayer, verification, and signature blocks where applicable.
- If any value is missing, write "___________"; do not omit the section.
- Do not include <style> tags, CSS, body padding, or page-break rules.`,
        processedFormData,
        language || "en"
      );
    }

    if (isIncompleteLegalDocument(html)) {
      throw new Error("The AI returned an incomplete document. Please generate again.");
    }

    if (courtStandard.isCourtDocument) {
      const firstAudit = auditCourtDraftStructure(html, courtStandard);
      if (!firstAudit.valid) {
        html = await generateDocument(
          buildCourtReformatPrompt(enhancedPrompt, html, courtStandard, firstAudit.issues),
          {},
          language || "en"
        );
        const finalAudit = auditCourtDraftStructure(html, courtStandard);
        if (!finalAudit.valid) {
          throw new Error(`The AI could not satisfy the required court format: ${finalAudit.issues.join("; ")}`);
        }
      }
    }

    // Post-process: strip out witness/notary sections that shouldn't be there
    html = stripUnwantedSections(html, category);
    html = normalizeGeneratedHtml(html);

    return NextResponse.json({ html });
  } catch (error: unknown) {
    console.error("Document generation error:", error);
    const message = error instanceof Error ? error.message : "";
    const friendly = getDocumentGenerationError(message);

    return NextResponse.json(
      { error: friendly.error },
      { status: friendly.status }
    );
  }
}
