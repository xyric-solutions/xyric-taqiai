"use client";

import { useState, useRef, useEffect } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import RichTextToolbar from "@/components/ui/RichTextToolbar";
import {
  Languages, ArrowRightLeft, Upload, Image as ImageIcon, FileText,
  Copy, Check, Download, Printer, Trash2, X, Camera, Stamp,
  Search, ChevronUp, ChevronDown,
} from "lucide-react";
import { TRANSLATION_TEMPLATES } from "@/templates/translations";

const languages = [
  { code: "ur", name: "Urdu", nameNative: "اردو", flag: "🇵🇰", dir: "rtl" },
  { code: "en", name: "English", nameNative: "English", flag: "🇬🇧", dir: "ltr" },
  { code: "ar", name: "Arabic", nameNative: "العربية", flag: "🇸🇦", dir: "rtl" },
];

const sanitize = (html: string) => {
  if (typeof window === "undefined") return html;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const DOMPurify = require("dompurify");
  return DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });
};

export default function TranslatePage() {
  const [sourceLang, setSourceLang] = useState("ur");
  const [targetLang, setTargetLang] = useState("en");
  const [inputText, setInputText] = useState("");
  const [translation, setTranslation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [mode, setMode] = useState<"text" | "image" | "legal">("text");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const legalFileInputRef = useRef<HTMLInputElement>(null);

  // Legal doc translation state
  const [selectedTemplate, setSelectedTemplate] = useState("nikah-nama-traditional");
  const [legalInputText, setLegalInputText] = useState("");
  const [legalImageFile, setLegalImageFile] = useState<File | null>(null);
  const [legalImagePreview, setLegalImagePreview] = useState<string | null>(null);
  const [legalInputMode, setLegalInputMode] = useState<"text" | "image">("image");
  const [legalHtml, setLegalHtml] = useState("");
  const [legalLoading, setLegalLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [aiEditText, setAiEditText] = useState("");
  const [aiEditLoading, setAiEditLoading] = useState(false);
  const [legalSpacing, setLegalSpacing] = useState(1.8);
  const editableRef = useRef<HTMLDivElement>(null);
  const translationRef = useRef<HTMLDivElement>(null);
  const [translationKey, setTranslationKey] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchIdx, setSearchIdx] = useState(0);
  const [searchTotal, setSearchTotal] = useState(0);
  const [printLoading, setPrintLoading] = useState(false);

  useEffect(() => {
    if (!editableRef.current) return;
    let styleEl = editableRef.current.querySelector<HTMLStyleElement>("style[data-spacing]");
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.setAttribute("data-spacing", "");
      editableRef.current.prepend(styleEl);
    }
    styleEl.textContent = `
      p, li { margin-bottom: ${Math.max(0, (legalSpacing - 1) * 6)}px; }
    `;
  }, [legalSpacing]);

  // Reset search when new document loads
  useEffect(() => {
    setSearchQuery("");
    setSearchTotal(0);
    setSearchIdx(0);
  }, [legalHtml]);

  const clearSearchMarks = () => {
    if (!editableRef.current) return;
    editableRef.current.querySelectorAll("mark[data-search]").forEach((mark) => {
      const parent = mark.parentNode;
      if (parent) {
        parent.replaceChild(document.createTextNode(mark.textContent || ""), mark);
        parent.normalize();
      }
    });
  };

  const applySearch = (query: string, goToIdx = 0) => {
    clearSearchMarks();
    if (!query.trim() || !editableRef.current) {
      setSearchTotal(0);
      setSearchIdx(0);
      return;
    }
    const lower = query.toLowerCase();
    const matches: { node: Text; start: number; end: number }[] = [];
    const walker = document.createTreeWalker(editableRef.current, NodeFilter.SHOW_TEXT);
    let node: Node | null;
    while ((node = walker.nextNode())) {
      const textNode = node as Text;
      const text = textNode.textContent || "";
      let start = 0;
      while (true) {
        const idx = text.toLowerCase().indexOf(lower, start);
        if (idx === -1) break;
        matches.push({ node: textNode, start: idx, end: idx + query.length });
        start = idx + 1;
      }
    }
    // Apply in reverse so earlier offsets stay valid after splits
    for (let i = matches.length - 1; i >= 0; i--) {
      const { node, start, end } = matches[i];
      try {
        const range = document.createRange();
        range.setStart(node, start);
        range.setEnd(node, end);
        const mark = document.createElement("mark");
        mark.setAttribute("data-search", String(i));
        mark.style.cssText = "background:#ffff00;color:#000;border-radius:2px;";
        range.surroundContents(mark);
      } catch { /* skip invalid ranges */ }
    }
    setSearchTotal(matches.length);
    const activeIdx = matches.length > 0 ? Math.max(0, Math.min(goToIdx, matches.length - 1)) : -1;
    setSearchIdx(activeIdx >= 0 ? activeIdx + 1 : 0);
    if (activeIdx >= 0 && editableRef.current) {
      const marks = editableRef.current.querySelectorAll<HTMLElement>("mark[data-search]");
      marks[activeIdx].style.background = "#ff9900";
      marks[activeIdx].scrollIntoView({ block: "center", behavior: "smooth" });
    }
  };

  const navigateSearch = (dir: "next" | "prev") => {
    if (!editableRef.current || searchTotal === 0) return;
    const marks = editableRef.current.querySelectorAll<HTMLElement>("mark[data-search]");
    marks.forEach((m) => { m.style.background = "#ffff00"; });
    const base = searchIdx - 1;
    const newIdx = dir === "next" ? (base + 1) % searchTotal : (base - 1 + searchTotal) % searchTotal;
    marks[newIdx].style.background = "#ff9900";
    marks[newIdx].scrollIntoView({ block: "center", behavior: "smooth" });
    setSearchIdx(newIdx + 1);
  };

  useEffect(() => {
    applySearch(searchQuery);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const swapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Only image files are supported (JPG, PNG, etc.)");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Image must be under 10MB");
      return;
    }
    setImageFile(file);
    setError("");
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleLegalImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Only image files are supported");
      return;
    }
    setLegalImageFile(file);
    setError("");
    const reader = new FileReader();
    reader.onload = (ev) => setLegalImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const removeLegalImage = () => {
    setLegalImageFile(null);
    setLegalImagePreview(null);
    if (legalFileInputRef.current) legalFileInputRef.current.value = "";
  };

  const handleTranslate = async () => {
    if (mode === "text" && !inputText.trim()) return;
    if (mode === "image" && !imageFile) return;
    setLoading(true);
    setError("");
    setTranslation("");
    try {
      const formData = new FormData();
      formData.append("sourceLang", sourceLang);
      formData.append("targetLang", targetLang);
      if (mode === "image" && imageFile) {
        formData.append("image", imageFile);
      } else {
        formData.append("text", inputText);
      }
      const res = await fetch("/api/ai/translate", { method: "POST", body: formData });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Translation failed");
      }
      const data = await res.json();
      setTranslation(sanitize(data.translation));
      setTranslationKey((k) => k + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Translation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLegalTranslate = async () => {
    if (legalInputMode === "text" && !legalInputText.trim()) return;
    if (legalInputMode === "image" && !legalImageFile) return;
    setLegalLoading(true);
    setError("");
    setLegalHtml("");
    setEditMode(false);
    try {
      const formData = new FormData();
      formData.append("templateId", selectedTemplate);
      if (legalInputMode === "image" && legalImageFile) {
        formData.append("image", legalImageFile);
      } else {
        formData.append("text", legalInputText);
      }
      const res = await fetch("/api/ai/translate-template", { method: "POST", body: formData });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Translation failed");
      }
      const data = await res.json();
      if (data.html) {
        setLegalHtml(sanitize(data.html));
      } else {
        throw new Error(data.error || "Translation result empty");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Translation failed");
    } finally {
      setLegalLoading(false);
    }
  };

  const handleCopy = () => {
    const text = translationRef.current?.innerText || translation;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    const srcLang = languages.find(l => l.code === sourceLang);
    const tgtLang = languages.find(l => l.code === targetLang);
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`<!DOCTYPE html><html><head><title>Legal Translation</title><style>@page{size:A4;margin:25mm 20mm 25mm 30mm}body{font-family:'Times New Roman',serif;font-size:13pt;line-height:2.0;color:#000}h2{text-align:center;border-bottom:2px solid #000;padding-bottom:10px;margin-bottom:20px}pre{white-space:pre-wrap;font-family:inherit;font-size:13pt;line-height:2.0}</style></head><body><h2>LEGAL TRANSLATION</h2><p><strong>From:</strong> ${srcLang?.name} | <strong>To:</strong> ${tgtLang?.name}</p><hr/><pre>${translation}</pre><p style="text-align:center;font-size:11pt;color:var(--text-tertiary);margin-top:30px">Generated by Legal AI</p><script>window.onload=function(){window.print();window.onafterprint=function(){window.close()}}</script></body></html>`);
    printWindow.document.close();
  };

  const handleLegalPrint = () => {
    const tpl = TRANSLATION_TEMPLATES.find(t => t.id === selectedTemplate);
    const htmlContent = editMode && editableRef.current
      ? editableRef.current.innerHTML
      : legalHtml;

    // Page size and margins matched from actual .docx files in the lawyer's office
    // All Pakistani legal doc translations use Legal size (216x356mm), NOT A4
    const PRINT_SETTINGS: Record<string, { size: string; margin: string }> = {
      "nikah-nama-traditional": { size: "216mm 356mm", margin: "25.4mm 25.4mm 25.4mm 22.2mm" },
      "nikah-nama":             { size: "216mm 356mm", margin: "25.4mm 6.3mm 25.4mm 25.4mm" },
      "divorce-certificate":    { size: "216mm 356mm", margin: "25.4mm 25.4mm 25.4mm 22.2mm" },
      "sale-deed":              { size: "210mm 297mm", margin: "25.4mm 25.4mm 25.4mm 25.4mm" },
      "id-card":                { size: "210mm 297mm", margin: "25.4mm 25.4mm 25.4mm 25.4mm" },
      "birth-certificate":      { size: "216mm 279mm", margin: "25.4mm 31.8mm 25.4mm 19.1mm" },
      "fard":                   { size: "216mm 356mm", margin: "25.4mm 25.4mm 25.4mm 25.4mm" },
      "mortgage-deed":          { size: "216mm 356mm", margin: "25.4mm 25.4mm 25.4mm 25.4mm" },
      "agriculture-land":       { size: "216mm 356mm", margin: "25.4mm 25.4mm 25.4mm 25.4mm" },
      "gift-deed":              { size: "216mm 356mm", margin: "17.8mm 17.8mm 17.8mm 17.8mm" },
    };
    const ps = PRINT_SETTINGS[selectedTemplate] ?? { size: "216mm 356mm", margin: "25.4mm 25.4mm 25.4mm 25.4mm" };

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`<!DOCTYPE html>
<html>
<head>
  <title>${tpl?.name || "Legal Translation"}</title>
  <style>
    @page { size: ${ps.size}; margin: ${ps.margin}; }
    body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.8; color: #000; margin: 0; padding: 0; }
    table { border-collapse: collapse; }
    @media print { body { padding: 0; } }
  </style>
</head>
<body>
  ${htmlContent}
  <script>window.onload=function(){window.print();window.onafterprint=function(){window.close()}}</script>
</body>
</html>`);
    printWindow.document.close();
  };

  const handleLegalPrintWithLoading = async () => {
    setPrintLoading(true);
    setTimeout(() => {
      handleLegalPrint();
      setPrintLoading(false);
    }, 300);
  };

  const handlePrintWithLoading = async () => {
    setPrintLoading(true);
    setTimeout(() => {
      handlePrint();
      setPrintLoading(false);
    }, 300);
  };

  const handleAiEdit = async () => {
    if (!aiEditText.trim() || !legalHtml) return;
    setAiEditLoading(true);
    try {
      const currentHtml = editableRef.current?.innerHTML || legalHtml;
      const res = await fetch("/api/ai/translate-edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html: currentHtml, instruction: aiEditText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Edit failed");
      setLegalHtml(sanitize(data.html));
      setAiEditText("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "AI edit failed");
    } finally {
      setAiEditLoading(false);
    }
  };

  const srcLangData = languages.find(l => l.code === sourceLang)!;
  const tgtLangData = languages.find(l => l.code === targetLang)!;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-br from-[#a78bfa] to-[#7c5cfc] shadow-lg">
            <Languages className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </div>
          Legal Translation / قانونی ترجمہ
        </h1>
        <p className="text-[var(--text-tertiary)] mt-1.5 text-sm">
          Translate legal documents — free-form or using standard legal formats
        </p>
      </div>

      {/* Mode Toggle */}
      <Card className="p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex bg-[var(--bg-surface-2)] rounded-xl p-1 w-full sm:w-auto">
            <button
              onClick={() => setMode("text")}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium flex-1 sm:flex-auto justify-center ${
                mode === "text" ? "bg-[var(--bg-surface-3)] text-[var(--text-primary)] shadow-sm" : "text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
              }`}
            >
              <FileText className="h-4 w-4" />
              Text
            </button>
            <button
              onClick={() => setMode("image")}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium flex-1 sm:flex-auto justify-center ${
                mode === "image" ? "bg-[var(--bg-surface-3)] text-[var(--text-primary)] shadow-sm" : "text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
              }`}
            >
              <Camera className="h-4 w-4" />
              Image
            </button>
            <button
              onClick={() => setMode("legal")}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium flex-1 sm:flex-auto justify-center ${
                mode === "legal" ? "bg-[var(--bg-surface-3)] text-[var(--text-primary)] shadow-sm" : "text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
              }`}
            >
              <Stamp className="h-4 w-4" />
              Legal Doc
            </button>
          </div>

          {/* Language selector (only for text/image modes) */}
          {mode !== "legal" && (
            <div className="flex items-center gap-2 sm:gap-3 flex-1 w-full sm:w-auto justify-center sm:justify-start">
              <select
                value={sourceLang}
                onChange={(e) => setSourceLang(e.target.value)}
                className="flex-1 sm:flex-none px-3 sm:px-4 py-2.5 border border-[var(--border-default)] rounded-xl text-sm font-medium text-[var(--text-primary)] bg-[var(--bg-surface-2)] focus:outline-none focus:ring-2 focus:ring-[#a78bfa]/30 hover:border-[var(--border-strong)]"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name} ({lang.nameNative})
                  </option>
                ))}
              </select>
              <button
                onClick={swapLanguages}
                className="p-2.5 rounded-xl bg-[rgba(167,139,250,0.12)] text-[#a78bfa] hover:bg-[rgba(167,139,250,0.2)] flex-shrink-0"
              >
                <ArrowRightLeft className="h-4 w-4" />
              </button>
              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className="flex-1 sm:flex-none px-3 sm:px-4 py-2.5 border border-[var(--border-default)] rounded-xl text-sm font-medium text-[var(--text-primary)] bg-[var(--bg-surface-2)] focus:outline-none focus:ring-2 focus:ring-[#a78bfa]/30 hover:border-[var(--border-strong)]"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name} ({lang.nameNative})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Legal doc info */}
          {mode === "legal" && (
            <p className="text-sm text-[#a78bfa] bg-[rgba(167,139,250,0.12)] px-3 py-1.5 rounded-lg">
              Urdu → English — Standard legal format / قانونی فارمیٹ
            </p>
          )}
        </div>
      </Card>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError("")} className="text-red-400 hover:text-red-300"><X className="h-4 w-4" /></button>
        </div>
      )}

      {/* ===== LEGAL DOC TRANSLATION MODE ===== */}
      {mode === "legal" && (
        <div className="space-y-4">
          {/* Document Type Selector */}
          <Card className="p-4 sm:p-5 space-y-4">
            <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Stamp className="h-4 w-4 text-[#a78bfa]" />
              Document Type / دستاویز کی قسم
            </h3>

            {/* ── Section 1: Nikah Nama ── */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="h-px flex-1 bg-[var(--border-subtle)]" />
                <span className="text-[11px] font-bold text-[#a78bfa] uppercase tracking-wide px-2">
                  Nikah Nama / نکاح نامہ
                </span>
                <div className="h-px flex-1 bg-[var(--border-subtle)]" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  TRANSLATION_TEMPLATES.find(t => t.id === "nikah-nama-traditional"),
                  TRANSLATION_TEMPLATES.find(t => t.id === "nikah-nama"),
                ].filter(Boolean).map((tpl) => (
                  <button
                    key={tpl!.id}
                    onClick={() => setSelectedTemplate(tpl!.id)}
                    className={`p-3 rounded-xl border text-left text-xs font-medium transition-all ${
                      selectedTemplate === tpl!.id
                        ? "border-[#a78bfa]/50 bg-[rgba(167,139,250,0.12)] text-[#a78bfa]"
                        : "border-[var(--border-default)] bg-[var(--bg-surface-2)] text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-surface-3)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    <div className="font-semibold text-[11px] leading-tight">{tpl!.name}</div>
                    <div className="text-[10px] mt-0.5 opacity-70" dir="rtl">{tpl!.nameUrdu}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* ── Section 2: Other Documents ── */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="h-px flex-1 bg-[var(--border-subtle)]" />
                <span className="text-[11px] font-bold text-[var(--text-tertiary)] uppercase tracking-wide px-2">
                  Other Documents / دیگر دستاویزات
                </span>
                <div className="h-px flex-1 bg-[var(--border-subtle)]" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {TRANSLATION_TEMPLATES.filter(
                  t => t.id !== "nikah-nama" && t.id !== "nikah-nama-traditional"
                ).map((tpl) => (
                  <button
                    key={tpl.id}
                    onClick={() => setSelectedTemplate(tpl.id)}
                    className={`p-3 rounded-xl border text-left text-xs font-medium transition-all ${
                      selectedTemplate === tpl.id
                        ? "border-[#a78bfa]/50 bg-[rgba(167,139,250,0.12)] text-[#a78bfa]"
                        : "border-[var(--border-default)] bg-[var(--bg-surface-2)] text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-surface-3)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    <div className="font-semibold text-[11px] leading-tight">{tpl.name}</div>
                    <div className="text-[10px] mt-0.5 opacity-70" dir="rtl">{tpl.nameUrdu}</div>
                  </button>
                ))}
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Input Panel */}
            <Card className="p-4 sm:p-6 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-[var(--text-primary)]">
                  🇵🇰 Urdu Document — Upload or Paste
                </h2>
                <div className="flex bg-[var(--bg-surface-2)] rounded-lg p-0.5">
                  <button
                    onClick={() => setLegalInputMode("image")}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium ${legalInputMode === "image" ? "bg-[var(--bg-surface-3)] text-[var(--text-primary)] shadow-sm" : "text-[var(--text-tertiary)]"}`}
                  >
                    <Camera className="h-3 w-3 inline mr-1" />Image
                  </button>
                  <button
                    onClick={() => setLegalInputMode("text")}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium ${legalInputMode === "text" ? "bg-[var(--bg-surface-3)] text-[var(--text-primary)] shadow-sm" : "text-[var(--text-tertiary)]"}`}
                  >
                    <FileText className="h-3 w-3 inline mr-1" />Text
                  </button>
                </div>
              </div>

              {legalInputMode === "image" ? (
                <div className="flex-1 min-h-[250px]">
                  {legalImagePreview ? (
                    <div className="relative h-full">
                      <img
                        src={legalImagePreview}
                        alt="Document"
                        className="w-full h-full max-h-[350px] object-contain rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface-2)]"
                      />
                      <button
                        onClick={removeLegalImage}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600 shadow-lg"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => legalFileInputRef.current?.click()}
                      className="h-full min-h-[250px] border-2 border-dashed border-[var(--border-default)] rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#a78bfa] hover:bg-[rgba(167,139,250,0.06)] group"
                    >
                      <div className="p-4 rounded-2xl bg-[var(--bg-surface-2)] group-hover:bg-[rgba(167,139,250,0.15)] mb-3">
                        <Upload className="h-7 w-7 text-[var(--text-tertiary)] group-hover:text-[#a78bfa]" />
                      </div>
                      <p className="text-sm font-semibold text-[var(--text-secondary)]">Click to upload document</p>
                      <p className="text-xs text-[var(--text-tertiary)] mt-1">JPG, PNG — Max 10MB</p>
                      <p className="text-xs text-[var(--text-tertiary)] mt-2" dir="rtl">دستاویز کی تصویر اپلوڈ کریں</p>
                    </div>
                  )}
                  <input
                    ref={legalFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLegalImageUpload}
                    className="hidden"
                  />
                </div>
              ) : (
                <textarea
                  value={legalInputText}
                  onChange={(e) => setLegalInputText(e.target.value)}
                  dir="rtl"
                  placeholder="یہاں اردو دستاویز کا متن پیسٹ کریں..."
                  className="flex-1 min-h-[250px] w-full px-4 py-3 border border-[var(--border-default)] rounded-xl text-[var(--text-primary)] placeholder-[var(--text-tertiary)] bg-[var(--bg-surface-2)] focus:outline-none focus:ring-2 focus:ring-[#a78bfa]/30 resize-none text-sm"
                  style={{ lineHeight: "2" }}
                />
              )}

              <Button
                onClick={handleLegalTranslate}
                loading={legalLoading}
                disabled={legalInputMode === "text" ? !legalInputText.trim() : !legalImageFile}
                className="w-full mt-4 bg-[#a78bfa] hover:bg-[#9474f5] text-[#0d1318]"
                size="lg"
              >
                {legalLoading ? (
                  "Translating with standard format..."
                ) : (
                  <>
                    <Stamp className="h-4 w-4" />
                    Translate — {TRANSLATION_TEMPLATES.find(t => t.id === selectedTemplate)?.name}
                  </>
                )}
              </Button>
            </Card>

            {/* Output Panel */}
            <Card className="p-4 sm:p-6 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-[var(--text-primary)]">🇬🇧 English — Legal Format</h2>
                {legalHtml && (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={handleLegalPrintWithLoading}
                      disabled={printLoading}
                      className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg bg-[var(--bg-surface-2)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-default)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Download className="h-3 w-3" /> {printLoading ? "..." : "PDF"}
                    </button>
                    <button
                      onClick={handleLegalPrintWithLoading}
                      disabled={printLoading}
                      className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg bg-[var(--bg-surface-2)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-default)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Printer className="h-3 w-3" /> {printLoading ? "..." : "Print"}
                    </button>
                  </div>
                )}
              </div>

              {legalHtml && (
                <div className="mb-3 space-y-2">
                  {/* Rich text formatting toolbar */}
                  <RichTextToolbar editorRef={editableRef} />

                  {/* Spacing controls */}
                  <div className="flex flex-wrap items-center gap-2 px-3 py-2 bg-[var(--bg-surface-1)] border border-[var(--border-default)] rounded-xl">
                    <span className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest flex-shrink-0">Line Spacing:</span>
                    {([
                      { label: "0",  val: 1.0 },
                      { label: "5",  val: 1.5 },
                      { label: "10", val: 2.0 },
                    ] as { label: string; val: number }[]).map((p) => (
                      <button
                        key={p.label}
                        type="button"
                        onClick={() => setLegalSpacing(p.val)}
                        className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border transition-all ${
                          legalSpacing === p.val
                            ? "bg-[#a78bfa] text-[#0d1318] border-[#a78bfa]"
                            : "bg-[var(--bg-surface-2)] text-[var(--text-tertiary)] border-[var(--border-default)] hover:text-[var(--text-primary)]"
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-[var(--text-tertiary)]">Custom:</span>
                      <input
                        type="number"
                        min="0.8"
                        max="4"
                        step="0.1"
                        value={legalSpacing}
                        onChange={(e) => {
                          const v = parseFloat(e.target.value);
                          if (!isNaN(v) && v >= 0.8 && v <= 4) setLegalSpacing(v);
                        }}
                        className="w-14 px-2 py-1 text-[11px] rounded-lg bg-[var(--bg-surface-2)] border border-[var(--border-default)] text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[#a78bfa]/30"
                      />
                    </div>
                  </div>

                  {/* Search Bar */}
                  <div className="flex items-center gap-2 px-3 py-2 bg-[var(--bg-surface-1)] border border-[var(--border-default)] rounded-xl">
                    <Search className="h-3.5 w-3.5 text-[var(--text-tertiary)] flex-shrink-0" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") navigateSearch("next");
                        if (e.key === "Escape") setSearchQuery("");
                      }}
                      placeholder="Search in document..."
                      className="flex-1 bg-transparent text-[12px] text-[var(--text-primary)] outline-none placeholder-[var(--text-tertiary)]"
                    />
                    {searchQuery && (
                      <>
                        <span className="text-[11px] text-[var(--text-tertiary)] whitespace-nowrap">
                          {searchTotal === 0 ? "0/0" : `${searchIdx}/${searchTotal}`}
                        </span>
                        <button type="button" onClick={() => navigateSearch("prev")} disabled={searchTotal === 0} className="p-0.5 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] disabled:opacity-30 transition-colors">
                          <ChevronUp className="h-3.5 w-3.5" />
                        </button>
                        <button type="button" onClick={() => navigateSearch("next")} disabled={searchTotal === 0} className="p-0.5 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] disabled:opacity-30 transition-colors">
                          <ChevronDown className="h-3.5 w-3.5" />
                        </button>
                        <button type="button" onClick={() => setSearchQuery("")} className="p-0.5 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors">
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </>
                    )}
                  </div>

                  {/* AI Edit Command */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={aiEditText}
                      onChange={(e) => setAiEditText(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && !aiEditLoading && handleAiEdit()}
                      placeholder='AI edit — e.g. "Change groom name to Ali Hassan"'
                      className="flex-1 px-3 py-2 text-xs border border-[var(--border-default)] rounded-lg bg-[var(--bg-surface-1)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#a78bfa]/30 placeholder-[var(--text-tertiary)]"
                    />
                    <button
                      onClick={handleAiEdit}
                      disabled={!aiEditText.trim() || aiEditLoading}
                      className="px-3 py-2 text-xs font-medium rounded-lg bg-[#a78bfa] text-[#0d1318] hover:bg-[#9474f5] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 whitespace-nowrap"
                    >
                      {aiEditLoading ? <span className="animate-pulse">Editing...</span> : <>✨ AI Edit</>}
                    </button>
                  </div>
                </div>
              )}

              {legalHtml ? (
                <div
                  ref={editableRef}
                  key={legalHtml}
                  contentEditable
                  suppressContentEditableWarning
                  className="flex-1 min-h-[300px] overflow-y-auto max-h-[600px] px-4 py-3 border border-[var(--border-default)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#a78bfa]/20"
                  style={{
                    backgroundColor: "#ffffff",
                    color: "#000000",
                    lineHeight: legalSpacing,
                  }}
                  dangerouslySetInnerHTML={{ __html: sanitize(legalHtml) }}
                />
              ) : (
                <div className="flex-1 min-h-[300px] border border-[var(--border-default)] rounded-xl bg-[var(--bg-surface-2)]/50 flex flex-col items-center justify-center">
                  <div className="p-4 rounded-2xl bg-[var(--bg-surface-2)]/80 mb-3">
                    <Stamp className="h-10 w-10 text-[var(--text-secondary)]" />
                  </div>
                  <h3 className="text-sm font-medium text-[var(--text-tertiary)]">Formatted translation will appear here</h3>
                  <p className="text-xs text-[var(--text-tertiary)] mt-1.5 text-center max-w-xs">
                    Upload a document or paste text — AI will extract fields and output in standard legal format
                  </p>
                </div>
              )}

              {legalHtml && (
                <div className="mt-3 p-3 bg-[rgba(245,158,11,0.1)] border border-[rgba(245,158,11,0.25)] rounded-xl flex items-start gap-2.5">
                  <ImageIcon className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-300">
                    <p className="font-semibold">Attestation Required / تصدیق ضروری ہے</p>
                    <p className="mt-0.5 text-amber-400">
                      Print and get it attested by a Notary Public or Oath Commissioner.
                    </p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      )}

      {/* ===== TEXT / IMAGE TRANSLATION MODE ===== */}
      {mode !== "legal" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Input Panel */}
          <Card className="p-4 sm:p-6 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
                <span className="text-lg">{srcLangData.flag}</span>
                {srcLangData.name} - Original
              </h2>
              {mode === "text" && inputText && (
                <button onClick={() => setInputText("")} className="text-xs text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] flex items-center gap-1">
                  <Trash2 className="h-3 w-3" /> Clear
                </button>
              )}
            </div>

            {mode === "text" ? (
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                dir={srcLangData.dir}
                placeholder={
                  sourceLang === "ur"
                    ? "یہاں قانونی دستاویز کا متن پیسٹ کریں...\n\nمثال: حلف نامہ، معاہدہ، عدالتی حکم نامہ، وکالت نامہ وغیرہ"
                    : sourceLang === "ar"
                    ? "الصق نص الوثيقة القانونية هنا..."
                    : "Paste your legal document text here...\n\nExample: Affidavit, Agreement, Court Order, Power of Attorney, etc."
                }
                className="flex-1 min-h-[250px] sm:min-h-[300px] w-full px-4 py-3 border border-[var(--border-default)] rounded-xl text-[var(--text-primary)] placeholder-[var(--text-tertiary)] bg-[var(--bg-surface-2)] focus:outline-none focus:ring-2 focus:ring-[#a78bfa]/30 resize-none text-sm leading-relaxed hover:border-[var(--border-strong)]"
                style={{ lineHeight: srcLangData.dir === "rtl" ? "2" : "1.8" }}
              />
            ) : (
              <div className="flex-1 min-h-[250px] sm:min-h-[300px]">
                {imagePreview ? (
                  <div className="relative h-full">
                    <img
                      src={imagePreview}
                      alt="Uploaded document"
                      className="w-full h-full max-h-[350px] object-contain rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface-2)]"
                    />
                    <button
                      onClick={removeImage}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600 shadow-lg"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <div className="absolute bottom-2 left-2 px-3 py-1 bg-black/60 text-white text-xs rounded-lg">
                      {imageFile?.name}
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="h-full min-h-[250px] sm:min-h-[300px] border-2 border-dashed border-[var(--border-default)] rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#a78bfa] hover:bg-[rgba(167,139,250,0.06)] group"
                  >
                    <div className="p-4 rounded-2xl bg-[var(--bg-surface-2)] group-hover:bg-[rgba(167,139,250,0.15)] mb-4">
                      <Upload className="h-8 w-8 text-[var(--text-tertiary)] group-hover:text-[#a78bfa]" />
                    </div>
                    <p className="text-sm font-semibold text-[var(--text-secondary)]">Click to upload document image</p>
                    <p className="text-xs text-[var(--text-tertiary)] mt-1">JPG, PNG - Max 10MB</p>
                    <p className="text-xs text-[var(--text-tertiary)] mt-3" dir="rtl">قانونی دستاویز کی تصویر اپلوڈ کریں</p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            )}

            <Button
              onClick={handleTranslate}
              loading={loading}
              disabled={(mode === "text" && !inputText.trim()) || (mode === "image" && !imageFile)}
              className="w-full mt-4"
              size="lg"
            >
              {loading ? (
                mode === "image" ? "Extracting text from image..." : "Translating..."
              ) : (
                <>
                  <Languages className="h-4 w-4" />
                  {mode === "image" ? `Extract & Translate to ${tgtLangData.name}` : `Translate to ${tgtLangData.name}`}
                </>
              )}
            </Button>
          </Card>

          {/* Output Panel */}
          <Card className="p-4 sm:p-6 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
                <span className="text-lg">{tgtLangData.flag}</span>
                {tgtLangData.name} - Translation
              </h2>
              {translation && (
                <div className="flex items-center gap-1.5">
                  <button onClick={handleCopy} className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg bg-[var(--bg-surface-2)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-3)]">
                    {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                  <button onClick={handlePrintWithLoading} disabled={printLoading} className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg bg-[rgba(167,139,250,0.12)] text-[#a78bfa] hover:bg-[rgba(167,139,250,0.2)] disabled:opacity-50 disabled:cursor-not-allowed">
                    <Download className="h-3 w-3" /> {printLoading ? "..." : "PDF"}
                  </button>
                  <button onClick={handlePrintWithLoading} disabled={printLoading} className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg bg-[var(--bg-surface-2)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-3)] disabled:opacity-50 disabled:cursor-not-allowed">
                    <Printer className="h-3 w-3" /> {printLoading ? "..." : "Print"}
                  </button>
                </div>
              )}
            </div>

            {translation ? (
              <div className="flex flex-col gap-2 flex-1">
                {/* Formatting toolbar */}
                <RichTextToolbar editorRef={translationRef} />
                {/* Editable output */}
                <div
                  key={translationKey}
                  ref={translationRef}
                  contentEditable
                  suppressContentEditableWarning
                  dir={tgtLangData.dir}
                  className="flex-1 min-h-[250px] sm:min-h-[300px] overflow-y-auto max-h-[500px] px-4 py-3 border border-[var(--border-default)] rounded-xl bg-[var(--bg-surface-1)] text-sm text-[var(--text-primary)] leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#a78bfa]/30"
                  style={{ lineHeight: tgtLangData.dir === "rtl" ? "2.2" : "1.8" }}
                  dangerouslySetInnerHTML={{ __html: translation.replace(/\n/g, "<br/>") }}
                />
              </div>
            ) : (
              <div className="flex-1 min-h-[250px] sm:min-h-[300px] border border-[var(--border-default)] rounded-xl bg-[var(--bg-surface-2)]/50 flex flex-col items-center justify-center">
                <div className="p-4 rounded-2xl bg-[var(--bg-surface-2)]/80 mb-4">
                  <Languages className="h-10 w-10 text-[var(--text-secondary)]" />
                </div>
                <h3 className="text-sm font-medium text-[var(--text-tertiary)]">Translation will appear here</h3>
                <p className="text-xs text-[var(--text-tertiary)] mt-1.5 text-center max-w-xs">
                  {mode === "text"
                    ? "Paste legal text and click Translate"
                    : "Upload a document image — AI will extract and translate the text"
                  }
                </p>
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  {["Affidavit", "Agreement", "Court Order", "Nikah Nama", "Power of Attorney"].map((doc) => (
                    <span key={doc} className="px-2.5 py-1 text-[10px] bg-[var(--bg-surface-2)] text-[var(--text-tertiary)] rounded-full">{doc}</span>
                  ))}
                </div>
              </div>
            )}

            {translation && (
              <div className="mt-3 p-3 bg-[rgba(245,158,11,0.1)] border border-[rgba(245,158,11,0.25)] rounded-xl flex items-start gap-2.5">
                <ImageIcon className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-amber-300">
                  <p className="font-semibold">Attestation Required / تصدیق ضروری ہے</p>
                  <p className="mt-0.5 text-amber-400">
                    This translation must be attested by a Notary Public or Oath Commissioner before submission to the department.
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { title: "Legal Accuracy", titleUrdu: "قانونی درستگی", desc: "Legal terminology accurately translated", icon: "⚖️" },
          { title: "Standard Formats", titleUrdu: "معیاری فارمیٹ", desc: "Nikah Nama, Sale Deed, CNIC, Fard, Birth Cert & more", icon: "📄" },
          { title: "Attest & Submit", titleUrdu: "تصدیق اور جمع", desc: "Print, get attested by Notary/Oath Commissioner", icon: "📋" },
        ].map((item) => (
          <Card key={item.title} className="p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">{item.icon}</span>
              <div>
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">{item.title}</h3>
                <p className="text-[11px] text-[var(--text-tertiary)]" dir="rtl">{item.titleUrdu}</p>
                <p className="text-xs text-[var(--text-tertiary)] mt-1">{item.desc}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
