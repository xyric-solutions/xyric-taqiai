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

const ALLOWED_HTML_TAGS = new Set([
  "blockquote",
  "br",
  "div",
  "em",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "hr",
  "i",
  "li",
  "ol",
  "p",
  "small",
  "span",
  "strong",
  "sub",
  "sup",
  "table",
  "tbody",
  "td",
  "tfoot",
  "th",
  "thead",
  "tr",
  "u",
  "ul",
]);

const VOID_HTML_TAGS = new Set(["br", "hr"]);
const DANGEROUS_BLOCK_TAGS = /<(script|style|iframe|object|embed|svg|math|form)[\s\S]*?<\/\1>/gi;
const DANGEROUS_TAGS = /<\/?(?:script|style|iframe|object|embed|svg|math|form|input|button|select|textarea|link|meta|base)[^>]*>/gi;
const HTML_TAG_PATTERN = /<\/?([a-zA-Z][\w:-]*)([^>]*)>/g;
const HTML_ATTRIBUTE_PATTERN = /([:\w-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;

function sanitizeInlineStyle(style: string): string {
  return style
    .split(";")
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => {
      const separator = item.indexOf(":");
      if (separator < 1) return "";
      const property = item.slice(0, separator).trim().toLowerCase();
      const value = item.slice(separator + 1).trim().replace(/["']/g, "");
      if (!SAFE_STYLE_PROPERTIES.has(property)) return "";
      if (!value || /(?:url|expression|javascript|behavior)\s*\(/i.test(value)) return "";
      if (!/^[#(),.%\w\s-]+$/.test(value)) return "";
      return `${property}: ${value}`;
    })
    .filter(Boolean)
    .join("; ");
}

function sanitizeHtmlAttributes(
  tagName: string,
  rawAttributes: string,
  options: NormalizeHtmlOptions
): string {
  const attributes: string[] = [];

  rawAttributes.replace(
    HTML_ATTRIBUTE_PATTERN,
    (_match, rawName: string, doubleQuoted?: string, singleQuoted?: string, unquoted?: string) => {
      const name = rawName.toLowerCase();
      const value = (doubleQuoted ?? singleQuoted ?? unquoted ?? "").trim();

      if (!value || name.startsWith("on")) return "";

      if (name === "style" && options.preserveInlineStyles) {
        const safeStyle = sanitizeInlineStyle(value);
        if (safeStyle) {
          attributes.push(`style="${safeStyle}"`);
        }
        return "";
      }

      if (name === "dir" && /^(ltr|rtl|auto)$/i.test(value)) {
        attributes.push(`dir="${value.toLowerCase()}"`);
        return "";
      }

      if (name === "align" && /^(left|right|center|justify)$/i.test(value)) {
        attributes.push(`align="${value.toLowerCase()}"`);
        return "";
      }

      if (
        (tagName === "td" || tagName === "th") &&
        (name === "colspan" || name === "rowspan") &&
        /^\d{1,2}$/.test(value)
      ) {
        const numericValue = Math.max(1, Math.min(20, Number(value)));
        attributes.push(`${name}="${numericValue}"`);
      }

      return "";
    }
  );

  return attributes.length ? ` ${attributes.join(" ")}` : "";
}

function sanitizeHtmlTags(html: string, options: NormalizeHtmlOptions): string {
  return html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(DANGEROUS_BLOCK_TAGS, "")
    .replace(DANGEROUS_TAGS, "")
    .replace(HTML_TAG_PATTERN, (match, rawTagName: string, rawAttributes: string) => {
      const tagName = rawTagName.toLowerCase();
      if (!ALLOWED_HTML_TAGS.has(tagName)) {
        return "";
      }

      const isClosingTag = /^<\s*\//.test(match);
      if (isClosingTag) {
        return VOID_HTML_TAGS.has(tagName) ? "" : `</${tagName}>`;
      }

      const safeAttributes = sanitizeHtmlAttributes(tagName, rawAttributes || "", options);
      return `<${tagName}${safeAttributes}>`;
    });
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
  cleaned = sanitizeHtmlTags(cleaned, options);

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
