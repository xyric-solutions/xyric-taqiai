export function textFromHtml(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

interface NormalizeHtmlOptions {
  preserveInlineStyles?: boolean;
  preserveEmptyBlocks?: boolean;
}

const SAFE_STYLE_PROPERTIES = new Set([
  "direction",
  "font-family",
  "font-size",
  "font-style",
  "font-weight",
  "line-height",
  "text-align",
  "text-decoration",
]);

function sanitizeInlineStyle(style: string): string {
  return style
    .split(";")
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => {
      const separator = item.indexOf(":");
      if (separator < 1) return "";
      const property = item.slice(0, separator).trim().toLowerCase();
      const value = item.slice(separator + 1).trim();
      if (!SAFE_STYLE_PROPERTIES.has(property)) return "";
      if (!value || /(?:url|expression|javascript|behavior)\s*\(/i.test(value)) return "";
      if (!/^[#(),.%\w\s"'-]+$/.test(value)) return "";
      return `${property}: ${value}`;
    })
    .filter(Boolean)
    .join("; ");
}

export function normalizeGeneratedHtml(raw: string, options: NormalizeHtmlOptions = {}): string {
  let cleaned = (raw || "").trim();

  cleaned = cleaned.replace(/^```(?:html|HTML)?\s*\n?/i, "");
  cleaned = cleaned.replace(/\n?```\s*$/i, "");
  cleaned = cleaned.trim();

  const bodyMatch = cleaned.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (bodyMatch) {
    cleaned = bodyMatch[1].trim();
  } else {
    cleaned = cleaned.replace(/<!DOCTYPE[^>]*>/gi, "");
    cleaned = cleaned.replace(/<\/?html[^>]*>/gi, "");
    cleaned = cleaned.replace(/<head[\s\S]*?<\/head>/gi, "");
    cleaned = cleaned.trim();
  }

  cleaned = cleaned.replace(/<style[\s\S]*?<\/style>/gi, "");
  cleaned = cleaned.replace(/<script[\s\S]*?<\/script>/gi, "");
  if (options.preserveInlineStyles) {
    cleaned = cleaned.replace(/\sstyle=(["'])([\s\S]*?)\1/gi, (_match, _quote, styleValue) => {
      const safeStyle = sanitizeInlineStyle(styleValue);
      return safeStyle ? ` style="${safeStyle}"` : "";
    });
  } else {
    cleaned = cleaned.replace(/\sstyle=(["'])[\s\S]*?\1/gi, "");
  }
  cleaned = cleaned.replace(/\sclass=(["'])[\s\S]*?\1/gi, "");
  cleaned = cleaned.replace(/\s(?:page-break-before|page-break-after|break-before|break-after)=(["'])[\s\S]*?\1/gi, "");

  cleaned = cleaned.replace(/\[[^\]]*\*[^\]]*\]/g, "___________");
  cleaned = cleaned.replace(/\[\s*(?:Note|NOTE|Optional|OPTIONAL|N\/A|Missing|MISSING)[^\]]*\]/g, "___________");
  cleaned = cleaned.replace(/\*(?:Not provided|not provided|Optional|optional|N\/A|Missing)[^*]*\*/g, "___________");

  if (options.preserveEmptyBlocks) {
    cleaned = cleaned.replace(/<(p|div)(?:\s[^>]*)?>\s*(?:&nbsp;|\s|<br\s*\/?>)*<\/\1>/gi, "<p><br/></p>");
  } else {
    cleaned = cleaned.replace(/<p>\s*(?:&nbsp;|\s|<br\s*\/?>)*<\/p>/gi, "");
    cleaned = cleaned.replace(/<div>\s*(?:&nbsp;|\s|<br\s*\/?>)*<\/div>/gi, "");
  }
  cleaned = cleaned.replace(/(<br\s*\/?>\s*){3,}/gi, "<br/><br/>");
  cleaned = cleaned.replace(/(<hr[^>]*>\s*){2,}/gi, "<hr/>");
  cleaned = cleaned.replace(/\n{3,}/g, "\n\n");

  return cleaned.trim();
}

export function isIncompleteLegalDocument(html: string): boolean {
  const text = textFromHtml(html);
  const lower = text.toLowerCase();
  const words = text.split(/\s+/).filter(Boolean);
  const shewethIndex = lower.search(/(?:most\s+)?respectfully\s+sheweth\s*:?/i);
  const textAfterSheweth = shewethIndex >= 0
    ? text.slice(shewethIndex).replace(/(?:most\s+)?respectfully\s+sheweth\s*:?/i, "").trim()
    : "";
  const bodyAfterShewethWords = textAfterSheweth.split(/\s+/).filter(Boolean).length;
  const endsAtOpening =
    /(?:respectfully\s+sheweth|most\s+respectfully\s+sheweth|respectfully\s+submitted|she\s*weth)\s*:?\s*$/i.test(text);
  const hasCourtOpening =
    lower.includes("respectfully sheweth") ||
    lower.includes("most respectfully sheweth") ||
    lower.includes("prayer") ||
    lower.includes("verification");
  const hasBodyParagraph =
    /\b(?:1\.|1\)|that\s+the|it\s+is\s+submitted|petitioner\s+submits|applicant\s+submits|plaintiff\s+submits)\b/i.test(textAfterSheweth || text);

  return endsAtOpening ||
    (shewethIndex >= 0 && bodyAfterShewethWords < 45) ||
    (hasCourtOpening && !hasBodyParagraph) ||
    words.length < 120;
}

export function repairIncompleteCourtDocument(html: string): string {
  const cleaned = normalizeGeneratedHtml(html);
  const text = textFromHtml(cleaned);
  const lower = text.toLowerCase();
  const looksLikeCourtDocument =
    lower.includes("in the court") ||
    lower.includes("petition") ||
    lower.includes("application") ||
    lower.includes("suit") ||
    lower.includes("applicant") ||
    lower.includes("petitioner") ||
    lower.includes("respondent") ||
    lower.includes("respectfully sheweth");

  if (!looksLikeCourtDocument || !isIncompleteLegalDocument(cleaned)) {
    return cleaned;
  }

  const hasSheweth = /respectfully\s+sheweth\s*:?/i.test(cleaned);
  const opening = hasSheweth ? "" : "<p><strong>RESPECTFULLY SHEWETH:</strong></p>";

  const completion = `
${opening}
<p>1. That the Petitioner/Applicant is a law-abiding person and is competent to file the present petition/application before this Honourable Court.</p>
<p>2. That the facts stated in the title and preceding part of this petition/application are correct to the best of the Petitioner/Applicant's knowledge and belief.</p>
<p>3. That the cause of action has arisen within the territorial jurisdiction of this Honourable Court, therefore this Honourable Court has jurisdiction to entertain and decide the matter.</p>
<p>4. That the Petitioner/Applicant has no other adequate, efficacious, or alternate remedy except to approach this Honourable Court for the relief sought herein.</p>
<p>5. That the Respondent/Opposite Party is legally bound to comply with the applicable law and the lawful directions of this Honourable Court.</p>
<p>6. That the material facts, dates, documents, orders, FIR details, or other particulars necessary for proper adjudication are stated herein or shall be supplied as ___________ where the same have not yet been provided.</p>
<p>7. That the impugned act, omission, order, proceeding, or cause complained of is unlawful, unjust, without lawful justification, and liable to be set aside, corrected, restrained, or otherwise dealt with in accordance with law.</p>
<p>8. That the Petitioner/Applicant has a good prima facie case, the balance of convenience lies in favour of the Petitioner/Applicant, and irreparable loss may be caused if appropriate relief is not granted where interim relief is required.</p>
<p>9. That the grounds urged herein are without prejudice to one another, and the Petitioner/Applicant craves leave of this Honourable Court to add, amend, alter, or supplement any ground or fact if required.</p>
<p>10. That the present petition/application is filed in good faith, in the interest of justice, and for the enforcement or protection of lawful rights available under the applicable law.</p>
<p>11. That no material fact has been concealed from this Honourable Court to the best of the Petitioner/Applicant's knowledge and belief.</p>
<p>12. That it is just and necessary in the circumstances that this Honourable Court may grant appropriate relief after hearing the parties and examining the record.</p>
<h3>PRAYER</h3>
<p>In view of the above, it is respectfully prayed that this Honourable Court may graciously be pleased to accept the present petition/application and grant the relief prayed for in accordance with law.</p>
<p>Any other relief which this Honourable Court deems just and proper may also be awarded.</p>
<h3>VERIFICATION</h3>
<p>Verified on oath at ___________ on this ___________ day of ___________, 20___, that the contents of the above petition/application are true and correct to the best of my knowledge and belief and nothing material has been concealed.</p>
<br/>
<p>Petitioner/Applicant: ____________________</p>
<p>Advocate: ____________________</p>`;

  return normalizeGeneratedHtml(`${cleaned}${completion}`);
}
