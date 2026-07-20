"use client";

import Button from "@/components/ui/Button";
import RichTextToolbar from "@/components/ui/RichTextToolbar";
import FullscreenDocModal from "@/components/documents/FullscreenDocModal";
import { normalizeGeneratedHtml } from "@/lib/document-html";
import {
  Download, Copy, Check, X, Save, Sparkles,
  RefreshCw, FileText, Wand2, Printer, RotateCcw,
  ShieldCheck, AlertTriangle, PenLine,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const LEGAL_PAGE_WIDTH_MM = 215.9;
const LEGAL_PAGE_HEIGHT_MM = 355.6;
const WORD_NORMAL_MARGIN_MM = 25.4;
const WORD_SAFE_BOTTOM_MARGIN_MM = 32;
const WORD_LEGAL_PAGE_STYLE = {
  top: WORD_NORMAL_MARGIN_MM,
  right: WORD_NORMAL_MARGIN_MM,
  bottom: WORD_SAFE_BOTTOM_MARGIN_MM,
  left: WORD_NORMAL_MARGIN_MM,
};
const WORD_LEGAL_CONTENT_WIDTH_MM =
  LEGAL_PAGE_WIDTH_MM - WORD_LEGAL_PAGE_STYLE.left - WORD_LEGAL_PAGE_STYLE.right;

interface DocumentPreviewProps {
  content: string;
  title: string;
  language?: string;
  onDownloadPDF?: () => void;
  onContentChange?: (newContent: string) => void;
}

export default function DocumentPreview({
  content,
  title,
  language = "en",
  onDownloadPDF,
  onContentChange,
}: DocumentPreviewProps) {
  const [downloadingPDF, setDownloadingPDF] = useState(false);
  // S01-02 / S01-05: Approve & Export gate
  const [approved, setApproved] = useState(false);
  const [showApproveConfirm, setShowApproveConfirm] = useState(false);

  const cleanContent = (raw: string): string => {
    return normalizeGeneratedHtml(raw, {
      preserveEmptyBlocks: true,
      preserveInlineStyles: true,
    });
  };

  const [currentContent, setCurrentContent] = useState(cleanContent(content));
  const [editedContent, setEditedContent] = useState(cleanContent(content));
  const [editKey, setEditKey] = useState(0);
  const [aiEditMode, setAiEditMode] = useState(false);
  const [aiInstruction, setAiInstruction] = useState("");
  const [aiEditing, setAiEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [stampPrintOpen, setStampPrintOpen] = useState(false);
  const [stampPage1Top, setStampPage1Top] = useState("4.5");
  const [stampPage2Top, setStampPage2Top] = useState("1.0");
  const [showFullscreen, setShowFullscreen] = useState(false);
  const editRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (aiEditing) return;

    const nextContent = cleanContent(content);
    if (nextContent === currentContent) return;

    setCurrentContent(nextContent);
    setEditedContent(nextContent);
    setEditKey((k) => k + 1);
  }, [aiEditing, content, currentContent]);

  const getLatestContent = (): string => editRef.current?.innerHTML ?? currentContent;

  const buildPrintableHtml = (): string => {
    const isUrdu = language === "ur";
    return `<!DOCTYPE html>
<html dir="${isUrdu ? "rtl" : "ltr"}" lang="${language}">
<head>
<title>${title}</title>
<link href="https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400;700&display=swap" rel="stylesheet">
<style>
@page {
  size:${LEGAL_PAGE_WIDTH_MM}mm ${LEGAL_PAGE_HEIGHT_MM}mm;
  margin:${WORD_LEGAL_PAGE_STYLE.top}mm ${WORD_LEGAL_PAGE_STYLE.right}mm ${WORD_LEGAL_PAGE_STYLE.bottom}mm ${WORD_LEGAL_PAGE_STYLE.left}mm;
}
*,*::before,*::after { color:#000 !important; background:transparent !important; -webkit-print-color-adjust:exact; }
a { color:#000 !important; text-decoration:none !important; }
body {
  font-family:${isUrdu ? "'Noori Nastaliq','Jameel Noori Nastaleeq','Noto Nastaliq Urdu',serif" : "'Times New Roman',Georgia,serif"};
  font-size:${isUrdu ? "19pt" : "13pt"};
  line-height:${isUrdu ? "2.8" : "1.8"};
  color:#000;
  margin:0;
  padding:0;
  word-wrap:break-word;
  overflow-wrap:break-word;
  word-break:break-word;
}
h1 { text-align:center; font-size:${isUrdu ? "30pt" : "16pt"}; font-weight:bold; text-decoration:underline; margin-bottom:16px; line-height:${isUrdu ? "2.4" : "1.4"}; }
h2 { font-size:${isUrdu ? "18pt" : "14pt"}; font-weight:bold; margin-top:14px; margin-bottom:6px; line-height:${isUrdu ? "2.4" : "1.4"}; }
h3 { font-size:${isUrdu ? "16pt" : "13pt"}; font-weight:bold; margin-top:10px; margin-bottom:4px; }
p { margin:0 0 ${isUrdu ? "10px" : "6px"}; text-align:${isUrdu ? "right" : "justify"}; word-wrap:break-word; overflow-wrap:break-word; }
ol,ul { ${isUrdu ? "padding-right:20px;padding-left:0;" : "padding-left:20px;"} margin:6px 0; }
li { margin-bottom:4px; line-height:${isUrdu ? "2.6" : "1.8"}; }
table { border-collapse:collapse; width:100%; table-layout:fixed; word-wrap:break-word; break-inside:avoid; }
td,th { border:1px solid #000; padding:4px 8px; word-wrap:break-word; overflow-wrap:break-word; }
table[border="0"] td,table[border="0"] th { border:0; padding:2px 6px; vertical-align:top; }
[data-document-format="vakalatnama"] { font-size:10pt; line-height:1.25; }
[data-document-format="vakalatnama"] h2 { text-align:center; margin:0 0 8px; }
[data-document-format="vakalatnama"] p { margin:0 0 4px; line-height:1.25; }
[data-document-format="vakalatnama"] ol { margin:4px 0; padding-left:22px; }
[data-document-format="vakalatnama"] li { margin-bottom:2px; line-height:1.25; }
strong { font-weight:bold; }
hr { border:none; border-top:1px solid #000; margin:12px 0; }
h1,h2,h3,h4 { break-after:avoid; }
</style>
</head>
<body>${getLatestContent()}</body>
</html>`;
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    const html = buildPrintableHtml().replace(
      "</body>",
      `<script>window.onload=function(){window.print();window.onafterprint=function(){window.close()}}</script></body>`
    );
    printWindow.document.write(html);
    printWindow.document.close();
  };

  const handleStampPrint = () => {
    const p1TopIn = parseFloat(stampPage1Top) || 4.5;
    const p2TopIn = parseFloat(stampPage2Top) || 1.0;
    const p1TopMm = p1TopIn * 25.4;   // e.g. 4.5" → 114.3mm
    const p2TopMm = p2TopIn * 25.4;   // e.g. 1.0" → 25.4mm
    const isUrdu  = language === "ur";

    // Legal 8.5"×14" = 216×356mm — Pakistani legal standard
    const PAGE_W_MM = 216;
    const PAGE_H_MM = 356;
    const PX_PER_MM = 96 / 25.4; // screen px per mm at 96dpi

    // Progressive margin presets (Word-style auto-fit):
    // Try from standard → compact → tight until content fits one page.
    // Min looks: left≥8mm right≥6mm bottom≥2mm font≥10pt
    const PRESETS = [
      { left: 25.4, right: 19.1, bottom: 4.8, fontSize: 13, lineH: 2.0 },
      { left: 19.1, right: 12.7, bottom: 3.5, fontSize: 12, lineH: 1.9 },
      { left: 12.7, right: 10.0, bottom: 2.5, fontSize: 12, lineH: 1.8 },
      { left: 10.0, right:  8.0, bottom: 2.0, fontSize: 11, lineH: 1.7 },
      { left:  8.0, right:  6.0, bottom: 2.0, fontSize: 10, lineH: 1.6 },
    ];

    // Measure rendered height of content at a given preset
    const measureHeight = (preset: typeof PRESETS[0]): number => {
      const widthPx = (PAGE_W_MM - preset.left - preset.right) * PX_PER_MM;
      const probe = document.createElement("div");
      probe.style.cssText = [
        "position:fixed", "left:-99999px", "top:0",
        `width:${widthPx}px`,
        `font-family:'Times New Roman',serif`,
        `font-size:${preset.fontSize}pt`,
        `line-height:${preset.lineH}`,
        "visibility:hidden", "pointer-events:none",
      ].join(";");
      probe.innerHTML = currentContent;
      document.body.appendChild(probe);
      const h = probe.scrollHeight;
      document.body.removeChild(probe);
      return h / PX_PER_MM; // convert px → mm
    };

    // Pick the first preset that fits on one page
    let chosen = PRESETS[PRESETS.length - 1];
    for (const preset of PRESETS) {
      const availMm = PAGE_H_MM - p1TopMm - preset.bottom;
      if (measureHeight(preset) <= availMm) {
        chosen = preset;
        break;
      }
    }

    // Spacer = difference between page-1 and page-2 top margins
    // @page uses p2TopMm for all pages; spacer fills the rest on page 1
    const spacerMm = (p1TopMm - p2TopMm).toFixed(1);

    const stampHtml = `<!DOCTYPE html>
<html dir="${isUrdu ? "rtl" : "ltr"}">
<head>
  <title>${title}</title>
  <style>
    @page {
      size: ${PAGE_W_MM}mm ${PAGE_H_MM}mm;
      margin-top: ${p2TopMm.toFixed(1)}mm;
      margin-bottom: ${chosen.bottom}mm;
      margin-left: ${chosen.left}mm;
      margin-right: ${chosen.right}mm;
    }
    body {
      font-family: ${isUrdu
        ? "'Noori Nastaliq','Jameel Noori Nastaleeq','Noto Nastaliq Urdu',serif"
        : "'Times New Roman',serif"};
      font-size: ${isUrdu ? "19pt" : `${chosen.fontSize}pt`};
      line-height: ${isUrdu ? "2.8" : chosen.lineH};
      color: #000;
      margin: 0;
      padding: 0;
    }
    h1 {
      text-align: center;
      font-size: ${isUrdu ? "28pt" : `${chosen.fontSize + 3}pt`};
      font-weight: bold;
      text-decoration: underline;
      margin-bottom: 10px;
    }
    p { margin-bottom: 4px; text-align: justify; }
    ol, ul { margin: 4px 0; padding-left: 18px; }
    li { margin-bottom: 3px; }
    .stamp-spacer { display: block; height: ${spacerMm}mm; }
    @media print { body { padding: 0; } }
  </style>
</head>
<body>
  <div class="stamp-spacer"></div>
  ${currentContent}
  <script>window.onload=function(){window.print();window.onafterprint=function(){window.close()}}<\/script>
</body>
</html>`;

    const pw = window.open("", "_blank");
    if (!pw) return;
    pw.document.write(stampHtml);
    pw.document.close();
    setStampPrintOpen(false);
  };

  const handleDownloadPDF = async () => {
    setError("");
    setDownloadingPDF(true);
    try {
      const html2pdf = (await import("html2pdf.js")).default;
      const isUrdu = language === "ur";
      const latestContent = getLatestContent();

      const container = document.createElement("div");
      container.innerHTML = buildPrintableHtml();
      const body = container.querySelector("body");
      const wrapper = document.createElement("div");
      wrapper.style.padding = "0";
      wrapper.style.width = `${WORD_LEGAL_CONTENT_WIDTH_MM}mm`;
      wrapper.style.maxWidth = `${WORD_LEGAL_CONTENT_WIDTH_MM}mm`;
      wrapper.style.margin = "0 auto";
      wrapper.style.fontFamily = isUrdu
        ? "'Noori Nastaliq','Jameel Noori Nastaleeq','Noto Nastaliq Urdu',serif"
        : "'Times New Roman',Georgia,serif";
      wrapper.style.fontSize = isUrdu ? "19pt" : "13pt";
      wrapper.style.lineHeight = isUrdu ? "2.8" : "1.8";
      wrapper.style.color = "#000";
      wrapper.dir = isUrdu ? "rtl" : "ltr";
      wrapper.innerHTML = body ? body.innerHTML : latestContent;

      const offscreen = document.createElement("div");
      offscreen.style.position = "fixed";
      offscreen.style.left = "-99999px";
      offscreen.style.top = "0";
      offscreen.appendChild(wrapper);
      document.body.appendChild(offscreen);

      try {
        const safeTitle = (title || "document").replace(/[^a-zA-Z0-9-_\u0600-\u06FF]+/g, "_").slice(0, 80);
        await html2pdf()
          .set({
            margin: [
              WORD_LEGAL_PAGE_STYLE.top,
              WORD_LEGAL_PAGE_STYLE.right,
              WORD_LEGAL_PAGE_STYLE.bottom,
              WORD_LEGAL_PAGE_STYLE.left,
            ],
            filename: `${safeTitle}.pdf`,
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, letterRendering: true },
            jsPDF: { unit: "mm", format: [LEGAL_PAGE_WIDTH_MM, LEGAL_PAGE_HEIGHT_MM], orientation: "portrait" },
            pagebreak: { mode: ["css", "legacy"] },
          })
          .from(wrapper)
          .save();
      } finally {
        document.body.removeChild(offscreen);
      }
    } catch (err) {
      console.error("PDF download error", err);
      setError(
        language === "ur"
          ? "PDF download failed. Try the Print option instead."
          : "PDF download failed. Try the Print option instead."
      );
    } finally {
      setDownloadingPDF(false);
    }
  };

  const handleCopy = () => {
    const temp = document.createElement("div");
    temp.innerHTML = currentContent;
    navigator.clipboard.writeText(temp.textContent || temp.innerText || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const saveEdit = () => {
    const newHtml = editRef.current?.innerHTML ?? editedContent;
    setCurrentContent(newHtml);
    setEditedContent(newHtml);
    onContentChange?.(newHtml);
  };

  const handleEditableInput = () => {
    const newHtml = editRef.current?.innerHTML ?? "";
    setCurrentContent(newHtml);
    setEditedContent(newHtml);
    onContentChange?.(newHtml);
  };

  const cancelEdit = () => {
    setEditedContent(currentContent);
    setEditKey((k) => k + 1);
  };

  const startAiEdit = () => {
    setAiEditMode(true);
    setAiInstruction("");
    setError("");
  };

  const cancelAiEdit = () => {
    setAiEditMode(false);
    setAiInstruction("");
    setError("");
  };

  const applyAiEdit = async () => {
    if (!aiInstruction.trim()) return;
    setAiEditing(true);
    setError("");
    try {
      const res = await fetch("/api/ai/edit-document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentContent,
          editInstruction: aiInstruction,
          language,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Edit failed");
      }
      const data = await res.json();
      setCurrentContent(data.html);
      setEditedContent(data.html);
      setEditKey((k) => k + 1);
      onContentChange?.(data.html);
      setAiInstruction("");
      setAiEditMode(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Edit failed");
    } finally {
      setAiEditing(false);
    }
  };

  const quickEditSuggestions = [
    { label: "Change names", text: "Change name from X to Y" },
    { label: "Add a clause", text: "Add a clause about..." },
    { label: "Shorten", text: "Make this shorter and more concise" },
    { label: "Add details", text: "Add more details about..." },
    { label: "Fix dates", text: "Change the date to..." },
  ];

  return (
    <>
      {showFullscreen && (
        <FullscreenDocModal
          html={editedContent}
          language={language}
          onClose={() => setShowFullscreen(false)}
          onSave={(html) => {
            setCurrentContent(html);
            setEditedContent(html);
            setEditKey(k => k + 1);
            onContentChange?.(html);
          }}
        />
      )}

    <div className="space-y-4">
      {/* Header + Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h2 className="text-lg sm:text-xl font-bold text-[var(--text-primary)]">{title}</h2>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <Button variant="ghost" size="sm" onClick={handleCopy} className="flex-1 sm:flex-auto">
            {copied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy"}
          </Button>
          <Button
            size="sm"
            onClick={() => setShowFullscreen(true)}
            className="flex-1 sm:flex-auto bg-primary-500 hover:bg-primary-600 text-white font-bold"
          >
            <PenLine className="h-3.5 w-3.5" /> Manual Edit
          </Button>
          {!aiEditMode && (
            <Button variant="outline" size="sm" onClick={startAiEdit} className="flex-1 sm:flex-auto">
              <Wand2 className="h-3.5 w-3.5" /> AI Edit
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="flex-1 sm:flex-auto"
            title="Print or Save as PDF"
          >
            <Printer className="h-3.5 w-3.5" /> Print
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setStampPrintOpen((v) => !v)}
            className="flex-1 sm:flex-auto"
            title="Stamp Paper Print"
          >
            <FileText className="h-3.5 w-3.5" /> Stamp Paper
          </Button>
          {/* S01-02/S01-05: Approve & Export gate */}
          {!approved ? (
            <Button
              size="sm"
              onClick={() => setShowApproveConfirm(true)}
              className="flex-1 sm:flex-auto bg-green-600 hover:bg-green-700 text-white"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              Approve &amp; Export
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={onDownloadPDF || handleDownloadPDF}
              loading={downloadingPDF}
              className="flex-1 sm:flex-auto"
            >
              <Download className="h-3.5 w-3.5" />
              {downloadingPDF ? "Downloading..." : "Download PDF"}
            </Button>
          )}
        </div>
      </div>

      {error && !aiEditMode && (
        <div className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg p-2.5">
          {error}
        </div>
      )}

      {/* S01-02/S01-05: Approve & Export confirmation panel */}
      {showApproveConfirm && (
        <div className="bg-green-50 border-2 border-green-400 rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-green-600" />
            <h3 className="text-sm font-bold text-green-800">Approve & Export — Confirmation</h3>
          </div>
          <div className="flex items-start gap-2 text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-3">
            <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <p>
              By approving, you confirm this document is reviewed and ready for use.
              This action will be logged with your name and timestamp.
              <span className="block mt-1 font-medium">
                Once approved, the PDF download will unlock.
              </span>
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => { setApproved(true); setShowApproveConfirm(false); void (onDownloadPDF || handleDownloadPDF)(); }}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              <ShieldCheck className="h-3.5 w-3.5" /> Yes, Approve &amp; Download PDF
            </Button>
            <Button size="sm" variant="outline" onClick={() => setShowApproveConfirm(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* S01-02: Approved status banner */}
      {approved && !showApproveConfirm && (
        <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-xl text-xs text-green-700">
          <ShieldCheck className="h-4 w-4 text-green-500" />
          <span className="font-semibold">Approved</span> — Document approved for export. Download PDF is now unlocked.
        </div>
      )}

      {/* AI Edit Panel */}
      {aiEditMode && (
        <div className="bg-gradient-to-br from-primary-50 to-purple-50 border border-primary-200 rounded-2xl p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary-600" />
              AI Edit / اے آئی ایڈٹ
            </h3>
            <button onClick={cancelAiEdit} className="text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]">
              <X className="h-4 w-4" />
            </button>
          </div>

          <p className="text-xs text-[var(--text-secondary)]">
            AI ko batayein kya change karna hai - jaisa instruction dengay waisa edit ho jayega
          </p>

          <textarea
            value={aiInstruction}
            onChange={(e) => setAiInstruction(e.target.value)}
            placeholder="Example:
- Change deponent name to Ali Ahmed
- Add a clause about property ownership
- Make the declaration section shorter
- Fix the date to 2026-04-15
- Add witness details"
            rows={4}
            className="w-full px-4 py-3 bg-white border border-[var(--border-default)] rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 resize-none"
          />

          {/* Quick suggestions */}
          <div className="flex flex-wrap gap-1.5">
            <span className="text-xs text-[var(--text-tertiary)] self-center">Quick:</span>
            {quickEditSuggestions.map((s) => (
              <button
                key={s.label}
                onClick={() => setAiInstruction(s.text)}
                className="px-2.5 py-1 text-xs rounded-full bg-white border border-[var(--border-default)] text-[var(--text-secondary)] hover:bg-primary-50 hover:border-primary-300 hover:text-primary-700"
              >
                {s.label}
              </button>
            ))}
          </div>

          {error && (
            <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg p-2.5">
              {error}
            </div>
          )}

          <div className="flex gap-2">
            <Button onClick={applyAiEdit} loading={aiEditing} disabled={!aiInstruction.trim()} className="flex-1">
              <Sparkles className="h-4 w-4" />
              {aiEditing ? "AI edit kar raha hai..." : "Apply AI Edit"}
            </Button>
            <Button variant="outline" onClick={cancelAiEdit}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Stamp Paper Print Panel */}
      {stampPrintOpen && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Printer className="h-4 w-4 text-amber-600" />
              Stamp Paper Print Settings
            </h3>
            <button onClick={() => setStampPrintOpen(false)} className="text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]">
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="text-xs text-amber-700 bg-amber-100 rounded-lg px-3 py-1.5">
            📄 Paper: <strong>Legal 8.5" × 14"</strong> (216 × 356mm) — Left: 25.4mm, Right: 19.1mm, Bottom: 4.8mm
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-[var(--text-primary)]">Page 1 Top Margin (inches)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={stampPage1Top}
                onChange={(e) => setStampPage1Top(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-[var(--border-default)] rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400/30"
              />
              <p className="text-xs text-[var(--text-tertiary)]">
                4.5" = {(parseFloat(stampPage1Top || "4.5") * 25.4).toFixed(1)}mm — letterhead ke liye
              </p>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-[var(--text-primary)]">Page 2+ Top Margin (inches)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={stampPage2Top}
                onChange={(e) => setStampPage2Top(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-[var(--border-default)] rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400/30"
              />
              <p className="text-xs text-[var(--text-tertiary)]">
                1.0" = {(parseFloat(stampPage2Top || "1.0") * 25.4).toFixed(1)}mm — normal pages
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleStampPrint} className="flex-1">
              <Printer className="h-4 w-4" /> Print Now
            </Button>
            <Button variant="outline" onClick={() => setStampPrintOpen(false)}>Cancel</Button>
          </div>
        </div>
      )}

      {/* Document — always editable */}
      <div className="space-y-3">
        {/* Toolbar */}
        <div className="space-y-2">
          <RichTextToolbar editorRef={editRef} />
          <div className="flex items-center justify-between">
            <p className="text-[11px] text-[var(--text-tertiary)]">
              Select text then click a format button to edit
            </p>
            <div className="flex gap-2">
              <button
                onClick={cancelEdit}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-[var(--bg-surface-2)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] border border-[var(--border-default)] transition-all"
              >
                <RotateCcw className="h-3 w-3" /> Revert
              </button>
              <button
                onClick={saveEdit}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-all"
              >
                <Save className="h-3 w-3" /> Save
              </button>
            </div>
          </div>
        </div>

        {/* AI-edit loading indicator */}
        {aiEditing && (
          <div className="bg-primary-500/10 border border-primary-500/20 rounded-xl p-3 flex items-center gap-3">
            <RefreshCw className="h-4 w-4 text-primary-400 animate-spin" />
            <p className="text-sm text-primary-400">AI edit apply kar raha hai...</p>
          </div>
        )}

        {/* Document paper — MS Word style: white page on gray bg */}
        <div className="bg-[#e8e8e8] rounded-2xl p-4 sm:p-6">
          <div
            className={`mx-auto transition-opacity shadow-xl ${
              aiEditing ? "opacity-40 pointer-events-none" : ""
            }`}
            style={{
              backgroundColor: "#ffffff",
              width: "216mm",
              maxWidth: "100%",
              minHeight: "356mm",
              // MS Word Legal page, Normal margins: top right bottom left
              padding: `${WORD_LEGAL_PAGE_STYLE.top}mm ${WORD_LEGAL_PAGE_STYLE.right}mm ${WORD_LEGAL_PAGE_STYLE.bottom}mm ${WORD_LEGAL_PAGE_STYLE.left}mm`,
              boxSizing: "border-box",
              overflow: "hidden",
            }}
          >
            <div
              key={editKey}
              ref={editRef}
              contentEditable
              suppressContentEditableWarning
              onInput={handleEditableInput}
              dir={language === "ur" ? "rtl" : "ltr"}
              className="focus:outline-none focus:ring-2 focus:ring-primary-500/20 [&_*]:text-black [&_a]:no-underline"
              style={{
                color: "#000000",
                fontFamily: language === "ur"
                  ? "'Noori Nastaliq','Jameel Noori Nastaleeq','Noto Nastaliq Urdu',serif"
                  : "'Times New Roman', Georgia, serif",
                fontSize: "13pt",
                lineHeight: 1.8,
                wordWrap: "break-word",
                overflowWrap: "break-word",
                wordBreak: "break-word",
                minHeight: "200px",
              }}
              dangerouslySetInnerHTML={{ __html: editedContent }}
            />
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
