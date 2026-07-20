"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  compactPaginationWhitespace,
  isMeaningfulPaginationPage,
  normalizeGeneratedHtml,
  textFromHtml,
} from "@/lib/document-html";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  ChevronDown,
  ClipboardCopy,
  Download,
  Eye,
  FileText,
  Italic,
  Layout,
  List,
  ListOrdered,
  Printer,
  Save,
  Search,
  Underline,
  Wand2,
  X,
} from "lucide-react";

const LEGAL_W_IN = 8.5;
const LEGAL_H_IN = 14;
const IN_TO_MM = 25.4;
const LEGAL_W_MM = LEGAL_W_IN * IN_TO_MM;
const LEGAL_H_MM = LEGAL_H_IN * IN_TO_MM;
const PAGE_GAP_PX = 24;
const WORD_NORMAL_MARGIN_MM = 25.4;
const WORD_SAFE_BOTTOM_MARGIN_MM = 32;

const MARGIN_PRESETS = [
  { label: "Normal", top: WORD_NORMAL_MARGIN_MM, bottom: WORD_SAFE_BOTTOM_MARGIN_MM, left: WORD_NORMAL_MARGIN_MM, right: WORD_NORMAL_MARGIN_MM },
  { label: "Narrow", top: 12.7, bottom: 18, left: 12.7, right: 12.7 },
  { label: "Moderate", top: WORD_NORMAL_MARGIN_MM, bottom: WORD_SAFE_BOTTOM_MARGIN_MM, left: 19.05, right: 19.05 },
  { label: "Wide", top: WORD_NORMAL_MARGIN_MM, bottom: WORD_SAFE_BOTTOM_MARGIN_MM, left: 50.8, right: 50.8 },
] as const;

const EDITOR_BLOCK_SELECTOR = "p,h1,h2,h3,li,blockquote,td,th";
const SPLITTABLE_BLOCK_SELECTOR = "p,h1,h2,h3,blockquote,li";

interface FullscreenDocModalProps {
  html: string;
  language?: string;
  onClose: () => void;
  onSave: (html: string) => void;
}

interface Margins {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

interface CaretSnapshot {
  start: number;
  end: number;
}

const FONT_OPTIONS = [
  { key: "nastaliq", label: "Jameel Noori Nastaliq", css: "'Noori Nastaliq','Jameel Noori Nastaleeq','Noto Nastaliq Urdu',serif" },
  { key: "noto", label: "Noto Nastaliq Urdu", css: "'Noto Nastaliq Urdu','Jameel Noori Nastaleeq',serif" },
  { key: "times", label: "Times New Roman", css: "'Times New Roman', Georgia, serif" },
  { key: "arial", label: "Arial", css: "Arial, sans-serif" },
] as const;

type FontKey = typeof FONT_OPTIONS[number]["key"];

function normalizeForPages(html: string): string {
  const container = document.createElement("div");
  container.innerHTML = compactPaginationWhitespace(
    normalizeGeneratedHtml(html, { preserveInlineStyles: true, preserveEmptyBlocks: true })
  );

  for (let pass = 0; pass < 6; pass++) {
    if (container.children.length !== 1) break;
    const only = container.firstElementChild as HTMLElement;
    if (!["DIV", "ARTICLE", "SECTION", "MAIN", "BODY"].includes(only.tagName)) break;
    const fragment = document.createDocumentFragment();
    while (only.firstChild) fragment.appendChild(only.firstChild);
    container.replaceChild(fragment, only);
  }

  container.querySelectorAll("div, article, section, main").forEach((node) => {
    const el = node as HTMLElement;
    if (el.querySelector("table")) return;
    const fragment = document.createDocumentFragment();
    while (el.firstChild) fragment.appendChild(el.firstChild);
    el.replaceWith(fragment);
  });

  container.querySelectorAll<HTMLElement>("[style]").forEach((element) => {
    element.style.removeProperty("font-size");
    element.style.removeProperty("line-height");
    if (!element.getAttribute("style")?.trim()) element.removeAttribute("style");
  });

  container.querySelectorAll("ol, ul").forEach((node) => {
    const list = node as HTMLOListElement | HTMLUListElement;
    const ordered = list.tagName.toLowerCase() === "ol";
    const fragment = document.createDocumentFragment();
    Array.from(list.children).forEach((child, index) => {
      const p = document.createElement("p");
      p.textContent = `${ordered ? `${index + 1}. ` : ""}${(child.textContent || "").trim()}`;
      fragment.appendChild(p);
    });
    list.replaceWith(fragment);
  });

  Array.from(container.querySelectorAll("p, li")).forEach((node) => {
    const el = node as HTMLElement;
    const text = (el.textContent || "").replace(/\s+/g, " ").trim();
    if (text.length <= 850) return;

    const fragment = document.createDocumentFragment();
    let current = "";
    const parts = text.split(/(?<=[.!?۔])\s+|(?=\b\d+\.\s+)/).filter(Boolean);
    for (const part of parts) {
      if (current && `${current} ${part}`.length > 520) {
        const p = document.createElement("p");
        p.textContent = current;
        fragment.appendChild(p);
        current = part;
      } else {
        current = current ? `${current} ${part}` : part;
      }
    }
    if (current) {
      const p = document.createElement("p");
      p.textContent = current;
      fragment.appendChild(p);
    }
    el.replaceWith(fragment);
  });

  return compactPaginationWhitespace(
    normalizeGeneratedHtml(container.innerHTML, { preserveInlineStyles: true, preserveEmptyBlocks: true })
  );
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function htmlToPlainText(html: string): string {
  const el = document.createElement("div");
  el.innerHTML = html;
  return el.innerText || el.textContent || "";
}

function isEmptyEditorElement(element: Element): boolean {
  if (element.matches("table,img,hr,input,textarea")) return false;
  return !(element.textContent || "").replace(/\u00a0/g, " ").trim();
}

function trimTrailingEmptyBlocks(container: HTMLElement): void {
  let child = container.lastElementChild;
  while (child && isEmptyEditorElement(child)) {
    const previous = child.previousElementSibling;
    child.remove();
    child = previous;
  }
}

function removeEditorArtifacts(html: string): string {
  const container = document.createElement("div");
  container.innerHTML = html;
  container.querySelectorAll<HTMLElement>("[data-editor-selection-id]").forEach((node) => {
    node.removeAttribute("data-editor-selection-id");
    if (node.tagName === "SPAN" && !node.getAttribute("style") && node.attributes.length === 0) {
      const fragment = document.createDocumentFragment();
      while (node.firstChild) fragment.appendChild(node.firstChild);
      node.replaceWith(fragment);
    }
  });
  return normalizeGeneratedHtml(container.innerHTML, { preserveInlineStyles: true, preserveEmptyBlocks: true });
}

function legalPageContentCss(selector: string): string {
  return `
${selector} {
  word-wrap: break-word;
  overflow-wrap: break-word;
}
${selector} p {
  margin: 0 0 6px;
}
${selector} h1,
${selector} h2,
${selector} h3 {
  margin: 0 0 10px;
  text-align: center;
  font-weight: bold;
}
${selector} h1 { font-size: 16pt; }
${selector} h2 { font-size: 14pt; }
${selector} h3 { font-size: 13pt; }
${selector} table {
  border-collapse: collapse;
  width: 100%;
  table-layout: fixed;
}
${selector} td,
${selector} th {
  border: 1px solid #000;
  padding: 4px 8px;
  word-wrap: break-word;
}
${selector} table[border="0"] td,
${selector} table[border="0"] th {
  border: 0;
  padding: 2px 6px;
  vertical-align: top;
}
${selector} [data-document-format="vakalatnama"] {
  font-size: 10pt;
  line-height: 1.25;
}
${selector} [data-document-format="vakalatnama"] h2 {
  text-align: center;
  margin: 0 0 8px;
}
${selector} [data-document-format="vakalatnama"] p {
  margin: 0 0 4px;
  line-height: 1.25;
}
${selector} [data-document-format="vakalatnama"] ol {
  margin: 4px 0;
  padding-left: 22px;
}
${selector} [data-document-format="vakalatnama"] li {
  margin-bottom: 2px;
  line-height: 1.25;
}
${selector} ul,
${selector} ol {
  margin: 6px 0;
  padding-left: 20px;
}
${selector} li {
  margin: 0 0 4px;
}
${selector} hr {
  border: none;
  border-top: 1px solid #000;
  margin: 12px 0;
}`;
}

export default function FullscreenDocModal({ html, language = "en", onClose, onSave }: FullscreenDocModalProps) {
  const isUrdu = language === "ur";
  const [editorLanguage, setEditorLanguage] = useState<"en" | "ur">(isUrdu ? "ur" : "en");
  const [direction, setDirection] = useState<"ltr" | "rtl">(isUrdu ? "rtl" : "ltr");
  const [lineSpacing, setLineSpacing] = useState(isUrdu ? 2.8 : 1.65);
  const [fontSize, setFontSize] = useState(isUrdu ? 19 : 12);
  const [fontFamilyChoice, setFontFamilyChoice] = useState<FontKey>(isUrdu ? "nastaliq" : "times");
  const [margins, setMargins] = useState<Margins>({
    top: WORD_NORMAL_MARGIN_MM,
    bottom: WORD_SAFE_BOTTOM_MARGIN_MM,
    left: WORD_NORMAL_MARGIN_MM,
    right: WORD_NORMAL_MARGIN_MM,
  });
  const [pages, setPages] = useState<string[]>([""]);
  const [showPageLayout, setShowPageLayout] = useState(false);
  const [showFindReplace, setShowFindReplace] = useState(false);
  const [findText, setFindText] = useState("");
  const [replaceText, setReplaceText] = useState("");
  const [reviewMode, setReviewMode] = useState(false);
  const [copied, setCopied] = useState(false);

  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const layoutPanelRef = useRef<HTMLDivElement>(null);
  const currentHtmlRef = useRef("");
  const loadedHtmlRef = useRef<string | null>(null);
  const repaginateTimer = useRef<number | null>(null);
  const pendingCaretRef = useRef<CaretSnapshot | null>(null);
  const savedRangeRef = useRef<Range | null>(null);
  const activeSelectionIdRef = useRef<string | null>(null);

  const fontFamily = FONT_OPTIONS.find((f) => f.key === fontFamilyChoice)?.css ?? FONT_OPTIONS[1].css;

  const paginateHtml = useCallback((sourceHtml: string): string[] => {
    const normalized = normalizeForPages(sourceHtml);
    const source = document.createElement("div");
    source.innerHTML = normalized;
    trimTrailingEmptyBlocks(source);

    const nodes: Node[] = [];
    for (const node of Array.from(source.childNodes)) {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = (node.textContent || "").trim();
        if (!text) continue;
        const p = document.createElement("p");
        p.textContent = text;
        nodes.push(p);
        continue;
      }
      if (node.nodeType === Node.ELEMENT_NODE) nodes.push(node);
    }

    if (!nodes.length) return [""];

    const contentWidthMm = LEGAL_W_MM - margins.left - margins.right;
    const contentHeightMm = LEGAL_H_MM - margins.top - margins.bottom;
    const measurer = document.createElement("div");
    measurer.className = "legal-page-content";
    measurer.style.cssText = [
      "position:fixed",
      "left:-10000px",
      "top:0",
      "visibility:hidden",
      "pointer-events:none",
      `width:${contentWidthMm}mm`,
      `height:${contentHeightMm}mm`,
      `font-family:${fontFamily}`,
      `font-size:${fontSize}pt`,
      `line-height:${lineSpacing}`,
      "box-sizing:border-box",
      "color:#000",
      "overflow:hidden",
    ].join(";");
    document.body.appendChild(measurer);
    const maxHeight = measurer.getBoundingClientRect().height;

    let pageNodes: Node[] = [];
    const output: string[] = [];
    const serialize = (items: Node[]) => items.map((item) => {
      const wrap = document.createElement("div");
      wrap.appendChild(item.cloneNode(true));
      return wrap.innerHTML;
    }).join("");
    const measure = (items: Node[]) => {
      measurer.innerHTML = "";
      for (const item of items) measurer.appendChild(item.cloneNode(true));
      return measurer.scrollHeight;
    };
    const fits = (items: Node[]) => measure(items) <= maxHeight + 2;
    const pushPage = () => {
      const html = serialize(pageNodes);
      if (html.trim() && isMeaningfulPaginationPage(html)) output.push(html);
      pageNodes = [];
    };
    const cloneTextBlock = (sourceNode: Element, text: string) => {
      const clone = sourceNode.cloneNode(false) as HTMLElement;
      clone.textContent = text;
      return clone;
    };
    const splitOversizedTextBlock = (sourceNode: Element) => {
      const text = (sourceNode.textContent || "").replace(/\s+/g, " ").trim();
      if (!text) return;

      const words = text.split(" ");
      let index = 0;

      while (index < words.length) {
        let low = index + 1;
        let high = words.length;
        let best = low;

        while (low <= high) {
          const mid = Math.floor((low + high) / 2);
          const candidate = cloneTextBlock(sourceNode, words.slice(index, mid).join(" "));
          if (fits([...pageNodes, candidate])) {
            best = mid;
            low = mid + 1;
          } else {
            high = mid - 1;
          }
        }

        if (best === index + 1 && !fits([...pageNodes, cloneTextBlock(sourceNode, words[index])])) {
          if (pageNodes.length) pushPage();
          const word = words[index];
          let charIndex = 0;
          while (charIndex < word.length) {
            let charLow = charIndex + 1;
            let charHigh = word.length;
            let charBest = charLow;
            while (charLow <= charHigh) {
              const mid = Math.floor((charLow + charHigh) / 2);
              const candidate = cloneTextBlock(sourceNode, word.slice(charIndex, mid));
              if (fits([candidate])) {
                charBest = mid;
                charLow = mid + 1;
              } else {
                charHigh = mid - 1;
              }
            }
            pageNodes.push(cloneTextBlock(sourceNode, word.slice(charIndex, charBest)));
            pushPage();
            charIndex = charBest;
          }
          index += 1;
          continue;
        }

        pageNodes.push(cloneTextBlock(sourceNode, words.slice(index, best).join(" ")));
        index = best;
        if (index < words.length) pushPage();
      }
    };

    for (const node of nodes) {
      if (fits([...pageNodes, node])) {
        pageNodes.push(node);
        continue;
      }

      if (pageNodes.length) pushPage();

      if (node.nodeType === Node.ELEMENT_NODE && (node as Element).matches(SPLITTABLE_BLOCK_SELECTOR)) {
        splitOversizedTextBlock(node as Element);
        continue;
      }

      pageNodes.push(node);
      pushPage();
    }

    if (pageNodes.length) pushPage();
    document.body.removeChild(measurer);
    return output.length ? output : [""];
  }, [fontFamily, fontSize, lineSpacing, margins.bottom, margins.left, margins.right, margins.top]);

  const readEditorHtml = useCallback(() => (
    pageRefs.current
      .filter(Boolean)
      .map((el) => el!.innerHTML)
      .join("")
  ), []);

  const collectContent = useCallback((options: { includeEditorMarkers?: boolean } = {}) => {
    const combined = readEditorHtml();
    const cleaned = normalizeGeneratedHtml(combined || currentHtmlRef.current, { preserveInlineStyles: true, preserveEmptyBlocks: true });
    return options.includeEditorMarkers === false ? removeEditorArtifacts(cleaned) : cleaned;
  }, [readEditorHtml]);

  const textLengthForPage = (page: HTMLElement) => page.innerText.length;

  const getTextOffset = useCallback((container: Node, offset: number) => {
    let total = 0;

    for (const page of pageRefs.current) {
      if (!page) continue;
      if (!page.contains(container)) {
        total += textLengthForPage(page);
        continue;
      }

      const range = document.createRange();
      range.selectNodeContents(page);
      try {
        range.setEnd(container, offset);
      } catch {
        return total;
      }
      return total + range.toString().length;
    }

    return total;
  }, []);

  const captureCaret = useCallback((): CaretSnapshot | null => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return null;
    const range = selection.getRangeAt(0);
    if (!editorContainsNode(range.startContainer) || !editorContainsNode(range.endContainer)) return null;
    return {
      start: getTextOffset(range.startContainer, range.startOffset),
      end: getTextOffset(range.endContainer, range.endOffset),
    };
  }, [getTextOffset]);

  const restoreCaret = useCallback((snapshot: CaretSnapshot) => {
    const selection = window.getSelection();
    if (!selection) return;

    const range = document.createRange();
    let remainingStart = snapshot.start;
    let remainingEnd = snapshot.end;
    let startSet = false;
    let endSet = false;

    const setBoundary = (textNode: Text, position: number, isStart: boolean) => {
      const clamped = Math.max(0, Math.min(textNode.data.length, position));
      if (isStart) {
        range.setStart(textNode, clamped);
        startSet = true;
      } else {
        range.setEnd(textNode, clamped);
        endSet = true;
      }
    };

    for (const page of pageRefs.current) {
      if (!page) continue;
      const walker = document.createTreeWalker(page, NodeFilter.SHOW_TEXT);
      let node = walker.nextNode() as Text | null;

      while (node) {
        const length = node.data.length;
        if (!startSet && remainingStart <= length) setBoundary(node, remainingStart, true);
        if (!endSet && remainingEnd <= length) setBoundary(node, remainingEnd, false);
        if (startSet && endSet) break;
        remainingStart -= length;
        remainingEnd -= length;
        node = walker.nextNode() as Text | null;
      }

      if (startSet && endSet) break;
    }

    const lastPage = pageRefs.current.filter(Boolean).at(-1);
    if ((!startSet || !endSet) && lastPage) {
      const fallback = lastPage.lastChild ?? lastPage;
      range.selectNodeContents(fallback);
      range.collapse(false);
    }

    selection.removeAllRanges();
    selection.addRange(range);
    const activePage = pageRefs.current.find((page) => page?.contains(range.startContainer));
    activePage?.focus();
    savedRangeRef.current = range.cloneRange();
  }, []);

  const getActivePageIndex = useCallback((node: Node | null) => (
    pageRefs.current.findIndex((page) => !!node && !!page?.contains(node))
  ), []);

  const repaginate = useCallback((options: { preserveCaret?: boolean } = {}) => {
    const caret = options.preserveCaret ? captureCaret() : null;
    currentHtmlRef.current = collectContent();
    pendingCaretRef.current = caret;
    setPages(paginateHtml(currentHtmlRef.current));
  }, [captureCaret, collectContent, paginateHtml]);

  const scheduleRepaginate = useCallback(() => {
    if (repaginateTimer.current) window.clearTimeout(repaginateTimer.current);
    repaginateTimer.current = window.setTimeout(() => repaginate({ preserveCaret: true }), 450);
  }, [repaginate]);

  const moveCaretAcrossPageBoundary = useCallback((direction: "previous" | "next") => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || !selection.isCollapsed) return false;
    const range = selection.getRangeAt(0);
    const pageIndex = getActivePageIndex(range.startContainer);
    if (pageIndex < 0) return false;

    const page = pageRefs.current[pageIndex];
    if (!page) return false;

    const pageRange = document.createRange();
    pageRange.selectNodeContents(page);
    pageRange.setEnd(range.startContainer, range.startOffset);
    const offsetInPage = pageRange.toString().length;
    const pageTextLength = page.innerText.length;

    if (direction === "previous") {
      if (offsetInPage > 0 || pageIndex === 0) return false;
      const previousPage = pageRefs.current[pageIndex - 1];
      if (!previousPage) return false;
      const nextRange = document.createRange();
      nextRange.selectNodeContents(previousPage);
      nextRange.collapse(false);
      selection.removeAllRanges();
      selection.addRange(nextRange);
      previousPage.focus();
      savedRangeRef.current = nextRange.cloneRange();
      scheduleRepaginate();
      return true;
    }

    if (offsetInPage < pageTextLength || pageIndex >= pageRefs.current.length - 1) return false;
    const nextPage = pageRefs.current[pageIndex + 1];
    if (!nextPage) return false;
    const nextRange = document.createRange();
    nextRange.selectNodeContents(nextPage);
    nextRange.collapse(true);
    selection.removeAllRanges();
    selection.addRange(nextRange);
    nextPage.focus();
    savedRangeRef.current = nextRange.cloneRange();
    scheduleRepaginate();
    return true;
  }, [getActivePageIndex, scheduleRepaginate]);

  const handleEditorInput = useCallback(() => {
    currentHtmlRef.current = readEditorHtml();
    saveEditorSelection();
    scheduleRepaginate();
  }, [readEditorHtml, scheduleRepaginate]);

  useEffect(() => {
    if (loadedHtmlRef.current === html) return;
    loadedHtmlRef.current = html;
    currentHtmlRef.current = normalizeForPages(html);
    setPages(paginateHtml(currentHtmlRef.current));
  }, [html, paginateHtml]);

  useEffect(() => {
    if (!loadedHtmlRef.current) return;
    repaginate();
  }, [
    fontFamilyChoice,
    fontSize,
    lineSpacing,
    margins.bottom,
    margins.left,
    margins.right,
    margins.top,
    repaginate,
  ]);

  useEffect(() => {
    if (pendingCaretRef.current) {
      const caret = pendingCaretRef.current;
      pendingCaretRef.current = null;
      const frame = window.requestAnimationFrame(() => restoreCaret(caret));
      return () => window.cancelAnimationFrame(frame);
    }
    if (!activeSelectionIdRef.current) return;
    const frame = window.requestAnimationFrame(() => {
      const activeElement = getActiveSelectionElement();
      if (activeElement) selectElementContents(activeElement);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [pages, restoreCaret]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (layoutPanelRef.current && !layoutPanelRef.current.contains(e.target as Node)) {
        setShowPageLayout(false);
      }
    };
    if (showPageLayout) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showPageLayout]);

  useEffect(() => {
    return () => {
      if (repaginateTimer.current) window.clearTimeout(repaginateTimer.current);
    };
  }, []);

  const exec = (cmd: string, val?: string) => {
    if (cmd === "insertText" || cmd === "undo" || cmd === "redo") {
      restoreEditorSelection();
    } else {
      ensureActiveSelectionElement() ?? restoreEditorSelection();
    }
    document.execCommand(cmd, false, val);
    saveEditorSelection();
    currentHtmlRef.current = readEditorHtml();
    scheduleRepaginate();
  };
  const editorContainsNode = (node: Node | null) => (
    !!node && pageRefs.current.some((page) => page?.contains(node))
  );
  const getActiveSelectionElement = () => {
    const activeId = activeSelectionIdRef.current;
    if (!activeId) return null;
    for (const page of pageRefs.current) {
      const activeElement = Array.from(page?.querySelectorAll<HTMLElement>("[data-editor-selection-id]") ?? [])
        .find((node) => node.dataset.editorSelectionId === activeId);
      if (activeElement) return activeElement;
    }
    return null;
  };
  const selectElementContents = (element: HTMLElement) => {
    const selection = window.getSelection();
    if (!selection) return null;
    const range = document.createRange();
    range.selectNodeContents(element);
    selection.removeAllRanges();
    selection.addRange(range);
    element.closest<HTMLElement>("[contenteditable='true']")?.focus();
    savedRangeRef.current = range.cloneRange();
    return range;
  };
  const clearActiveSelectionMarker = () => {
    const activeId = activeSelectionIdRef.current;
    if (!activeId) return;
    pageRefs.current.forEach((page) => {
      page?.querySelectorAll<HTMLElement>("[data-editor-selection-id]").forEach((node) => {
        if (node.dataset.editorSelectionId === activeId) delete node.dataset.editorSelectionId;
      });
    });
    activeSelectionIdRef.current = null;
  };
  const saveEditorSelection = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);
    if (!editorContainsNode(range.startContainer) || !editorContainsNode(range.endContainer)) return;
    const activeElement = getActiveSelectionElement();
    if (!activeElement || !activeElement.contains(range.startContainer) || !activeElement.contains(range.endContainer)) {
      clearActiveSelectionMarker();
    }
    savedRangeRef.current = range.cloneRange();
  };
  const restoreEditorSelection = () => {
    const activeElement = getActiveSelectionElement();
    if (activeElement) return selectElementContents(activeElement);

    const savedRange = savedRangeRef.current;
    if (!savedRange || !editorContainsNode(savedRange.startContainer) || !editorContainsNode(savedRange.endContainer)) return null;
    const selection = window.getSelection();
    if (!selection) return null;
    selection.removeAllRanges();
    selection.addRange(savedRange);
    const page = pageRefs.current.find((item) => item?.contains(savedRange.startContainer));
    page?.focus();
    return savedRange;
  };
  const getEditorSelection = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      const restoredRange = restoreEditorSelection();
      return restoredRange ? { selection: window.getSelection(), range: restoredRange } : null;
    }
    const range = selection.getRangeAt(0);
    if (!editorContainsNode(range.startContainer) || !editorContainsNode(range.endContainer)) {
      const restoredRange = restoreEditorSelection();
      return restoredRange ? { selection: window.getSelection(), range: restoredRange } : null;
    }
    savedRangeRef.current = range.cloneRange();
    return { selection, range };
  };
  const ensureActiveSelectionElement = () => {
    const activeElement = getActiveSelectionElement();
    if (activeElement) {
      selectElementContents(activeElement);
      return activeElement;
    }

    const selectionContext = getEditorSelection();
    if (!selectionContext || selectionContext.range.collapsed) return null;
    const selectedContent = selectionContext.range.extractContents();
    const span = document.createElement("span");
    span.dataset.editorSelectionId = `sel-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    activeSelectionIdRef.current = span.dataset.editorSelectionId;
    span.appendChild(selectedContent);
    selectionContext.range.insertNode(span);
    selectElementContents(span);
    return span;
  };
  const getSelectionFontSizePt = () => {
    const selection = window.getSelection();
    const node = selection?.anchorNode;
    const element = node?.nodeType === Node.ELEMENT_NODE ? node as Element : node?.parentElement;
    if (!element) return fontSize;
    const computed = window.getComputedStyle(element);
    const px = parseFloat(computed.fontSize || "");
    return Number.isFinite(px) ? Math.round(px * 0.75) : fontSize;
  };
  const changeSelectedFontSize = (delta: number) => {
    const activeElement = ensureActiveSelectionElement();
    if (!activeElement) return;
    const currentSize = parseFloat(window.getComputedStyle(activeElement).fontSize || "");
    const currentPt = Number.isFinite(currentSize) ? Math.round(currentSize * 0.75) : getSelectionFontSizePt();
    activeElement.style.fontSize = `${Math.max(8, Math.min(72, currentPt + delta))}pt`;
    selectElementContents(activeElement);
    currentHtmlRef.current = readEditorHtml();
    scheduleRepaginate();
  };
  const getBlocksForRange = (range: Range) => {
    const blocks: HTMLElement[] = [];
    pageRefs.current.forEach((page) => {
      page?.querySelectorAll(EDITOR_BLOCK_SELECTOR).forEach((node) => {
        try {
          if (range.intersectsNode(node)) blocks.push(node as HTMLElement);
        } catch {
          // Ignore detached nodes while React is refreshing a page.
        }
      });
    });

    if (blocks.length) return blocks;
    const startElement = range.startContainer.nodeType === Node.ELEMENT_NODE
      ? range.startContainer as Element
      : range.startContainer.parentElement;
    const fallback = startElement?.closest(EDITOR_BLOCK_SELECTOR);
    return fallback ? [fallback as HTMLElement] : [];
  };
  const applySelectedLineSpacing = (value: number) => {
    const activeElement = ensureActiveSelectionElement();
    if (!activeElement) return;
    const range = selectElementContents(activeElement);
    if (!range) return;
    getBlocksForRange(range).forEach((block) => {
      block.style.lineHeight = String(value);
    });
    selectElementContents(activeElement);
    currentHtmlRef.current = readEditorHtml();
    scheduleRepaginate();
  };
  const setLanguageMode = (mode: "en" | "ur") => {
    setEditorLanguage(mode);
    setDirection(mode === "ur" ? "rtl" : "ltr");
    setFontFamilyChoice(mode === "ur" ? "nastaliq" : "times");
    setFontSize(mode === "ur" ? 19 : 12);
    setLineSpacing(mode === "ur" ? 2.8 : 1.65);
  };
  const formatAsLegalDocument = () => {
    const container = document.createElement("div");
    container.innerHTML = collectContent();
    container.querySelectorAll("p").forEach((node) => {
      const text = (node.textContent || "").trim();
      if (!text) return;
      if (/^(prayer|verification|respectfully sheweth|most respectfully sheweth|witnesses?|deponent|petitioner|respondent)\s*:?\s*$/i.test(text)) {
        const h = document.createElement("h3");
        h.textContent = text.replace(/:$/, "").toUpperCase();
        node.replaceWith(h);
      }
    });
    currentHtmlRef.current = normalizeGeneratedHtml(container.innerHTML, { preserveInlineStyles: true, preserveEmptyBlocks: true });
    setPages(paginateHtml(currentHtmlRef.current));
  };
  const replaceAll = () => {
    if (!findText.trim()) return;
    const pattern = new RegExp(escapeRegExp(findText), "gi");
    currentHtmlRef.current = collectContent().replace(pattern, replaceText);
    setPages(paginateHtml(currentHtmlRef.current));
  };
  const copyPlainText = async () => {
    await navigator.clipboard.writeText(htmlToPlainText(collectContent({ includeEditorMarkers: false })));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  };
  const downloadWord = () => {
    const docHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>@page{size:${LEGAL_W_IN}in ${LEGAL_H_IN}in;margin:0}body{font-family:${fontFamily};font-size:${fontSize}pt;line-height:${lineSpacing};direction:${direction};padding:${margins.top}mm ${margins.right}mm ${margins.bottom}mm ${margins.left}mm;color:#000}</style></head><body>${collectContent({ includeEditorMarkers: false })}</body></html>`;
    const blob = new Blob([docHtml], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "legal-document.doc";
    a.click();
    URL.revokeObjectURL(url);
  };
  const handleSave = () => onSave(collectContent({ includeEditorMarkers: false }));

  const printDoc = () => {
    const win = window.open("", "_blank");
    if (!win) return;
    const latestPages = paginateHtml(collectContent({ includeEditorMarkers: false }));
    setPages(latestPages);
    const printPages = latestPages.map((content) => `<section class="print-page"><div class="page-body legal-page-content">${content}</div></section>`).join("");
    win.document.write(`<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  @page { size: ${LEGAL_W_IN}in ${LEGAL_H_IN}in portrait; margin: 0; }
  html, body { margin: 0; padding: 0; background: #fff; }
  .print-page {
    width: ${LEGAL_W_IN}in;
    height: ${LEGAL_H_IN}in;
    box-sizing: border-box;
    page-break-after: always;
    break-after: page;
    overflow: hidden;
    background: #fff;
  }
  .print-page:last-child { page-break-after: auto; break-after: auto; }
  .page-body {
    width: 100%;
    height: 100%;
    padding: ${margins.top}mm ${margins.right}mm ${margins.bottom}mm ${margins.left}mm;
    box-sizing: border-box;
    font-family: ${fontFamily};
    font-size: ${fontSize}pt;
    line-height: ${lineSpacing};
    color: #000;
    direction: ${direction};
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  ${legalPageContentCss(".legal-page-content")}
  * { box-sizing: border-box; }
</style>
</head>
<body>${printPages}</body>
</html>`);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 400);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && moveCaretAcrossPageBoundary("previous")) {
      e.preventDefault();
      return;
    }
    if (e.key === "Delete" && moveCaretAcrossPageBoundary("next")) {
      e.preventDefault();
      return;
    }
    if (e.key === "Tab") { e.preventDefault(); exec("insertText", "    "); return; }
    if (!e.ctrlKey && !e.metaKey) return;
    const key = e.key.toLowerCase();

    if (e.shiftKey && (key === ">" || key === ".")) {
      e.preventDefault();
      changeSelectedFontSize(1);
      return;
    }
    if (e.shiftKey && (key === "<" || key === ",")) {
      e.preventDefault();
      changeSelectedFontSize(-1);
      return;
    }
    if (e.shiftKey && key === "l") {
      e.preventDefault();
      exec("insertUnorderedList");
      return;
    }
    if (e.shiftKey && key === "7") {
      e.preventDefault();
      exec("insertOrderedList");
      return;
    }
    if (e.shiftKey && key === "8") {
      e.preventDefault();
      exec("insertUnorderedList");
      return;
    }

    switch (key) {
      case "b": e.preventDefault(); exec("bold"); break;
      case "i": e.preventDefault(); exec("italic"); break;
      case "u": e.preventDefault(); exec("underline"); break;
      case "s": e.preventDefault(); handleSave(); break;
      case "f": e.preventDefault(); setShowFindReplace(true); break;
      case "h": e.preventDefault(); setShowFindReplace(true); break;
      case "e": e.preventDefault(); exec("justifyCenter"); break;
      case "j": e.preventDefault(); exec("justifyFull"); break;
      case "l": e.preventDefault(); exec("justifyLeft"); break;
      case "r": e.preventDefault(); exec("justifyRight"); break;
      case "p": e.preventDefault(); printDoc(); break;
      case "[": e.preventDefault(); changeSelectedFontSize(-1); break;
      case "]": e.preventDefault(); changeSelectedFontSize(1); break;
      case "1": e.preventDefault(); applySelectedLineSpacing(1); break;
      case "2": e.preventDefault(); applySelectedLineSpacing(2); break;
      case "5": e.preventDefault(); applySelectedLineSpacing(1.5); break;
    }
  };

  const setMarginField = (field: keyof Margins, value: string) => {
    const parsed = parseFloat(value);
    if (!Number.isNaN(parsed) && parsed >= 0 && parsed <= 80) {
      setMargins((prev) => ({ ...prev, [field]: parsed }));
    }
  };

  const btn = "px-2 py-1.5 rounded hover:bg-gray-200 text-gray-700 transition-colors flex items-center gap-1";
  const spBtn = (v: number) => lineSpacing === v
    ? "px-2.5 py-1 text-xs rounded bg-blue-600 text-white"
    : "px-2.5 py-1 text-xs rounded border border-gray-300 text-gray-600 hover:bg-gray-100";

  const inlineMarginInput = (label: string, field: keyof Margins) => (
    <div className="flex flex-col items-center gap-1">
      <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">{label}</span>
      <input
        type="number"
        min={0}
        max={80}
        step={1}
        value={Math.round(margins[field])}
        onChange={(e) => setMarginField(field, e.target.value)}
        className="w-14 border border-gray-300 rounded px-1.5 py-1 text-center text-xs text-gray-800 bg-white focus:border-blue-400 focus:outline-none"
      />
      <span className="text-[9px] text-gray-400">mm</span>
    </div>
  );

  const reviewText = textFromHtml(pages.join(""));
  const reviewIssues = [
    { label: "Blank fields", found: /_{3,}/.test(reviewText), okText: "No blank fields detected" },
    { label: "CNIC blanks", found: /cnic[^A-Za-z0-9]{0,20}_{3,}/i.test(reviewText), okText: "CNIC fields look filled" },
    { label: "Missing prayer", found: !/prayer/i.test(reviewText), okText: "Prayer section found" },
    { label: "Missing verification", found: !/verification/i.test(reviewText), okText: "Verification section found" },
  ];

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex flex-col" style={{ background: "#525659" }}>
      <style>{legalPageContentCss(".legal-page-content")}</style>
      <div style={{ background: "#f3f3f3", borderBottom: "1px solid #ccc" }} className="flex flex-wrap items-center gap-1 px-3 py-2">
        <button onClick={onClose} className={btn} title="Close"><X size={16} /></button>
        <div className="w-px h-5 bg-gray-300 mx-1" />

        <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-0.5">
          <button
            onClick={() => setLanguageMode("en")}
            className={`px-2 py-1 text-xs rounded-md ${editorLanguage === "en" ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-100"}`}
            title="English typing mode"
          >
            English
          </button>
          <button
            onClick={() => setLanguageMode("ur")}
            className={`px-2 py-1 text-xs rounded-md ${editorLanguage === "ur" ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-100"}`}
            title="Urdu typing mode"
          >
            اردو
          </button>
        </div>
        <div className="w-px h-5 bg-gray-300 mx-1" />

        <div className="relative" ref={layoutPanelRef}>
          <button
            onClick={() => setShowPageLayout((v) => !v)}
            className={`${btn} ${showPageLayout ? "bg-blue-100 text-blue-700" : ""}`}
            title="Page Layout"
          >
            <Layout size={15} />
            <span className="text-xs">Page Layout</span>
            <ChevronDown size={12} className={`transition-transform ${showPageLayout ? "rotate-180" : ""}`} />
          </button>

          {showPageLayout && (
            <div
              className="absolute left-0 top-full mt-1 z-50 bg-white border border-gray-200 rounded-xl shadow-2xl"
              style={{ width: "420px" }}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 rounded-t-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Page Layout</p>
                    <p className="text-xs text-gray-400 mt-0.5">Legal Size - {LEGAL_W_IN}" x {LEGAL_H_IN}"</p>
                  </div>
                  <button onClick={() => setShowPageLayout(false)} className="text-gray-400 hover:text-gray-600">
                    <X size={14} />
                  </button>
                </div>
              </div>

              <div className="p-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Preset Margins</p>
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {MARGIN_PRESETS.map((preset) => {
                    const active =
                      Math.round(margins.top) === Math.round(preset.top) &&
                      Math.round(margins.bottom) === Math.round(preset.bottom) &&
                      Math.round(margins.left) === Math.round(preset.left) &&
                      Math.round(margins.right) === Math.round(preset.right);
                    return (
                      <button
                        key={preset.label}
                        onClick={() => setMargins({ top: preset.top, bottom: preset.bottom, left: preset.left, right: preset.right })}
                        className={`py-2 px-1 text-xs rounded-lg border transition-all ${
                          active ? "border-blue-500 bg-blue-50 text-blue-700 font-semibold" : "border-gray-200 text-gray-600 hover:border-gray-400 hover:bg-gray-50"
                        }`}
                      >
                        <div className="font-medium">{preset.label}</div>
                        <div className="text-[9px] text-gray-400 mt-0.5">{Math.round((preset.top / IN_TO_MM) * 10) / 10}"</div>
                      </button>
                    );
                  })}
                </div>

                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Custom Margins</p>
                <div className="flex items-center justify-center gap-4">
                  {inlineMarginInput("Left", "left")}
                  <div className="flex flex-col items-center gap-1.5">
                    {inlineMarginInput("Top", "top")}
                    <div className="border-2 border-gray-300 bg-gray-50 rounded-sm flex items-center justify-center" style={{ width: "64px", height: "84px" }}>
                      <div className="bg-white border border-gray-300" style={{ width: "34px", height: "48px" }} />
                    </div>
                    {inlineMarginInput("Bottom", "bottom")}
                  </div>
                  {inlineMarginInput("Right", "right")}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="w-px h-5 bg-gray-300 mx-1" />
        <button onClick={formatAsLegalDocument} className={btn} title="Format as legal document">
          <Wand2 size={15} />
          <span className="text-xs">Format Legal</span>
        </button>
        <button
          onClick={() => setShowFindReplace((v) => !v)}
          className={`${btn} ${showFindReplace ? "bg-blue-50 text-blue-700" : ""}`}
          title="Find / Replace (Ctrl+F or Ctrl+H)"
        >
          <Search size={15} />
          <span className="text-xs">Find</span>
        </button>
        <button
          onClick={() => setReviewMode((v) => !v)}
          className={`${btn} ${reviewMode ? "bg-amber-50 text-amber-700" : ""}`}
          title="Review missing fields"
        >
          <Eye size={15} />
          <span className="text-xs">Review</span>
        </button>
        <div className="w-px h-5 bg-gray-300 mx-1" />
        <button onMouseDown={(e) => { e.preventDefault(); exec("bold"); }} className={btn} title="Bold (Ctrl+B)"><Bold size={16} /></button>
        <button onMouseDown={(e) => { e.preventDefault(); exec("italic"); }} className={btn} title="Italic (Ctrl+I)"><Italic size={16} /></button>
        <button onMouseDown={(e) => { e.preventDefault(); exec("underline"); }} className={btn} title="Underline (Ctrl+U)"><Underline size={16} /></button>
        <div className="w-px h-5 bg-gray-300 mx-1" />
        <button onMouseDown={(e) => { e.preventDefault(); exec("justifyLeft"); }} className={btn} title="Left (Ctrl+L)"><AlignLeft size={16} /></button>
        <button onMouseDown={(e) => { e.preventDefault(); exec("justifyCenter"); }} className={btn} title="Center (Ctrl+E)"><AlignCenter size={16} /></button>
        <button onMouseDown={(e) => { e.preventDefault(); exec("justifyRight"); }} className={btn} title="Right (Ctrl+R)"><AlignRight size={16} /></button>
        <button onMouseDown={(e) => { e.preventDefault(); exec("justifyFull"); }} className={btn} title="Justify (Ctrl+J)"><AlignJustify size={16} /></button>
        <div className="w-px h-5 bg-gray-300 mx-1" />
        <button onMouseDown={(e) => { e.preventDefault(); exec("insertUnorderedList"); }} className={btn} title="Bullets (Ctrl+Shift+L or Ctrl+Shift+8)"><List size={16} /></button>
        <button onMouseDown={(e) => { e.preventDefault(); exec("insertOrderedList"); }} className={btn} title="Numbering (Ctrl+Shift+7)"><ListOrdered size={16} /></button>
        <div className="w-px h-5 bg-gray-300 mx-1" />
        <button onMouseDown={(e) => { e.preventDefault(); changeSelectedFontSize(-1); }} className={btn} title="Smaller selected text (Ctrl+[ or Ctrl+Shift+<)"><span className="text-xs font-bold">A-</span></button>
        <span className="text-xs text-gray-500 px-1 tabular-nums">{fontSize}pt</span>
        <button onMouseDown={(e) => { e.preventDefault(); changeSelectedFontSize(1); }} className={btn} title="Larger selected text (Ctrl+] or Ctrl+Shift+>)"><span className="text-xs font-bold">A+</span></button>
        <div className="w-px h-5 bg-gray-300 mx-1" />
        <select
          value={fontFamilyChoice}
          onChange={(e) => setFontFamilyChoice(e.target.value as FontKey)}
          className="text-xs border border-gray-300 rounded px-1.5 py-1 text-gray-700 bg-white cursor-pointer"
        >
          {FONT_OPTIONS.map((f) => <option key={f.key} value={f.key}>{f.label}</option>)}
        </select>
        <div className="w-px h-5 bg-gray-300 mx-1" />
        <span className="text-xs text-gray-400 mr-1">Spacing:</span>
        {([1.35, 1.5, 1.65, 1.8, 2.2] as const).map((v) => (
          <button key={v} onMouseDown={(e) => { e.preventDefault(); applySelectedLineSpacing(v); }} className={spBtn(v)} title="Line spacing. Shortcuts: Ctrl+1, Ctrl+5, Ctrl+2">{v}</button>
        ))}
        <div className="w-px h-5 bg-gray-300 mx-1" />
        <button onClick={handleSave} className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors">
          <Save size={14} /> Save
        </button>
        <button onClick={copyPlainText} className={btn} title="Copy plain text">
          <ClipboardCopy size={15} />
          <span className="text-xs">{copied ? "Copied" : "Copy"}</span>
        </button>
        <button onClick={downloadWord} className={btn} title="Download Word-compatible file">
          <FileText size={15} />
          <span className="text-xs">Word</span>
        </button>
        <button onClick={printDoc} className={btn} title="Print or save as PDF">
          <Download size={15} />
          <span className="text-xs">PDF</span>
        </button>
        <button onClick={printDoc} className={btn} title="Print (Ctrl+P)"><Printer size={16} /></button>
      </div>

      {showFindReplace && (
        <div className="flex flex-wrap items-center gap-2 px-4 py-2 bg-white border-b border-gray-200">
          <span className="text-xs font-semibold text-gray-500">Find & Replace</span>
          <input
            value={findText}
            onChange={(e) => setFindText(e.target.value)}
            placeholder="Find name, CNIC, court..."
            className="h-8 w-56 rounded-md border border-gray-300 px-2 text-xs text-gray-800 bg-white"
          />
          <input
            value={replaceText}
            onChange={(e) => setReplaceText(e.target.value)}
            placeholder="Replace with..."
            className="h-8 w-56 rounded-md border border-gray-300 px-2 text-xs text-gray-800 bg-white"
          />
          <button onClick={replaceAll} className="h-8 px-3 rounded-md bg-gray-900 text-white text-xs font-semibold">
            Replace All
          </button>
        </div>
      )}

      {reviewMode && (
        <div className="flex flex-wrap items-center gap-2 px-4 py-2 bg-amber-50 border-b border-amber-200">
          <span className="text-xs font-semibold text-amber-800">Review</span>
          {reviewIssues.map((issue) => (
            <span
              key={issue.label}
              className={`px-2 py-1 rounded-md text-xs border ${issue.found ? "bg-white text-amber-800 border-amber-300" : "bg-white text-emerald-700 border-emerald-200"}`}
            >
              {issue.found ? issue.label : issue.okText}
            </span>
          ))}
        </div>
      )}

      <div style={{ background: "#f8f8f8", borderBottom: "1px solid #e0e0e0" }} className="px-4 py-1 flex flex-wrap gap-x-4 text-xs text-gray-400">
        <span>Pages: {pages.length}</span>
        <span>Ctrl+S Save</span>
        <span>Ctrl+P Print</span>
        <span>Ctrl+B/I/U</span>
        <span>Ctrl+Shift+&lt;/&gt; Size</span>
        <span>Ctrl+1/5/2 Spacing</span>
        <span className="ml-auto text-gray-300">
          Margins: T{Math.round(margins.top)} B{Math.round(margins.bottom)} L{Math.round(margins.left)} R{Math.round(margins.right)} mm
        </span>
      </div>

      <div className="flex-1 overflow-y-auto py-10" style={{ background: "#525659" }}>
        <div style={{ width: `${LEGAL_W_MM}mm`, margin: "0 auto" }}>
          {pages.map((page, i) => (
            <div key={`${i}-${pages.length}-${fontSize}-${lineSpacing}-${margins.top}-${margins.bottom}-${margins.left}-${margins.right}`} style={{ position: "relative", marginBottom: `${PAGE_GAP_PX}px` }}>
              <div style={{
                position: "absolute",
                top: `${margins.top}mm`,
                right: "-76px",
                fontSize: "11px",
                color: "#b0b4b8",
                fontFamily: "Arial, sans-serif",
                userSelect: "none",
                pointerEvents: "none",
              }}>
                Page {i + 1}
              </div>
              <div style={{
                height: `${LEGAL_H_MM}mm`,
                background: "#ffffff",
                boxShadow: "0 1px 4px rgba(0,0,0,0.28), 0 8px 24px rgba(0,0,0,0.32)",
                overflow: "hidden",
              }}>
                <div
                  ref={(el) => { pageRefs.current[i] = el; }}
                  contentEditable
                  suppressContentEditableWarning
                  onKeyDown={handleKeyDown}
                  onKeyUp={saveEditorSelection}
                  onMouseUp={saveEditorSelection}
                  onBlur={saveEditorSelection}
                  onInput={handleEditorInput}
                  className="outline-none h-full legal-page-content"
                  style={{
                    padding: `${margins.top}mm ${margins.right}mm ${margins.bottom}mm ${margins.left}mm`,
                    boxSizing: "border-box",
                    fontFamily,
                    fontSize: `${fontSize}pt`,
                    lineHeight: lineSpacing,
                    direction,
                    color: "#000",
                    overflow: "hidden",
                  }}
                  dangerouslySetInnerHTML={{ __html: page }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return typeof document !== "undefined"
    ? createPortal(modalContent, document.body)
    : modalContent;
}
