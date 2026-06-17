"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Search, Upload, MessageSquare, X, Copy, Check,
  Scale, Send, Lightbulb, FileText, Gavel,
  BookMarked, Sparkles, Database, ChevronDown,
  Bookmark, BookOpen, Eye, ChevronLeft, ChevronRight, Building2,
} from "lucide-react";
import {
  isJudgmentSaved, toggleSavedJudgment, onSavedJudgmentsChange,
} from "@/lib/judgment-store";
import JudgmentReader from "@/components/documents/JudgmentReader";

// ── Types ──────────────────────────────────────────────────────────────────────

type SearchMode = "smart" | "keyword" | "citation";
type ToolTab = "search" | "upload" | "qa";
type SortMode = "relevance" | "newest" | "oldest";
interface ChatMessage { role: "user" | "ai"; text: string; }
interface LocalJudgment {
  id: number;
  citation: string;
  reported: boolean;
  court: string;
  year: number;
  title: string | null;
  caseNo: string | null;
  passages: string[];
  processed: number;
  related?: boolean;
}

// ── Constants ──────────────────────────────────────────────────────────────────

const COURTS = [
  "All Courts", "Supreme Court", "Federal Shariat Court",
  "Lahore High Court", "Sindh High Court",
  "Peshawar High Court", "Balochistan High Court", "Islamabad High Court",
];
const YEARS = ["All years", ...Array.from({ length: 2026 - 1947 + 1 }, (_, i) => String(2026 - i))];
const SORTS: { id: SortMode; label: string; note: string }[] = [
  { id: "relevance", label: "Relevance", note: "Most relevant first" },
  { id: "newest", label: "Newest first", note: "Latest year first" },
  { id: "oldest", label: "Oldest first", note: "Earliest year first" },
];

function authority(court: string): "binding" | "persuasive" | null {
  if (/supreme court/i.test(court)) return "binding";
  if (/high court|shariat/i.test(court)) return "persuasive";
  return null;
}

// ── Shared bits ──────────────────────────────────────────────────────────────────

const Dots = ({ tone = "primary" }: { tone?: "primary" | "success" }) => (
  <div className="flex items-center gap-1.5">
    {[0, 150, 300].map((d) => (
      <div key={d} className={`w-2 h-2 rounded-full animate-bounce ${tone === "success" ? "bg-success-500" : "bg-primary-400"}`} style={{ animationDelay: `${d}ms` }} />
    ))}
  </div>
);

function FilterSelect({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void; options: string[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
        className="appearance-none w-full rounded-lg pl-3 pr-8 py-2 text-[12px] cursor-pointer transition-colors focus:outline-none focus:ring-1 focus:ring-primary-500/40"
        style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border-default)", color: "var(--text-secondary)" }}
      >
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown aria-hidden className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 pointer-events-none" style={{ color: "var(--text-tertiary)" }} />
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function JudgmentSearchPage() {
  const [searchMode, setSearchMode] = useState<SearchMode>("keyword");
  const [toolTab, setToolTab] = useState<ToolTab>("search");

  // Search
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);
  const [copied, setCopied] = useState(false);

  // Filters / sort
  const [courtFilter, setCourtFilter] = useState("All Courts");
  const [yearFilter, setYearFilter] = useState("All years");
  const [sortMode, setSortMode] = useState<SortMode>("relevance");
  // Default: only reported (citable) judgments — the noise-free, court-usable set.
  const [reportedOnly, setReportedOnly] = useState(true);

  // Local results
  const [localResults, setLocalResults] = useState<LocalJudgment[]>([]);
  const [isRelated, setIsRelated] = useState(false);
  // Smart (semantic) search fell back to keyword because the local model is offline
  const [semanticFallback, setSemanticFallback] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);
  const [localStats, setLocalStats] = useState<{ total: number; processed: number } | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const resultsTopRef = useRef<HTMLDivElement>(null);

  // Per-card UI state
  const [passageIdx, setPassageIdx] = useState<Record<number, number>>({});
  const [reader, setReader] = useState<LocalJudgment | null>(null);
  const [headnotes, setHeadnotes] = useState<Record<number, { loading: boolean; text: string | null }>>({});
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set());

  // AI answer (lazy "Ask AI")
  const [aiResult, setAiResult] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  // Upload & Analyze
  const [uploadMode, setUploadMode] = useState<"image" | "text">("image");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [judgmentText, setJudgmentText] = useState("");
  const [analyzeResult, setAnalyzeResult] = useState("");
  const [analyzeLoading, setAnalyzeLoading] = useState(false);
  const [analyzeError, setAnalyzeError] = useState("");
  const [analyzeAction, setAnalyzeAction] = useState<"summarize" | "strategy">("summarize");
  const [strategyFacts, setStrategyFacts] = useState("");
  const [savedToNotes, setSavedToNotes] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Q&A
  const [qaText, setQaText] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [qaQuestion, setQaQuestion] = useState("");
  const [qaLoading, setQaLoading] = useState(false);
  const [qaError, setQaError] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  // ── Saved judgments sync ──────────────────────────────────────────────────────
  const refreshSaved = useCallback(() => {
    setSavedIds((prev) => {
      const next = new Set<number>();
      localResults.forEach((j) => { if (isJudgmentSaved(j.id)) next.add(j.id); });
      // keep any saved ids already known (for cards no longer in view)
      prev.forEach((id) => { if (isJudgmentSaved(id)) next.add(id); });
      return next;
    });
  }, [localResults]);

  useEffect(() => {
    refreshSaved();
    return onSavedJudgmentsChange(refreshSaved);
  }, [refreshSaved]);

  // Deep-link search: e.g. /case-law?q=2015%20PLJ%201122&mode=citation
  // (used by the AI Advisor's verified-source links and cited-case jumps).
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const q = sp.get("q");
    if (!q) return;
    const mode = sp.get("mode");
    if (mode === "citation" || mode === "keyword") setSearchMode(mode);
    setQuery(q);
    runSearch(q);
    // run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Handlers ──────────────────────────────────────────────────────────────────

  const runSearch = async (
    overrideQuery?: string,
    opts?: { court?: string; year?: string; sort?: SortMode; page?: number; reported?: boolean }
  ) => {
    const q = (overrideQuery ?? query).trim();
    if (!q) return;
    const court = opts?.court ?? courtFilter;
    const year = opts?.year ?? yearFilter;
    const sort = opts?.sort ?? sortMode;
    const nextPage = opts?.page ?? 1;
    const reported = opts?.reported ?? reportedOnly;

    setToolTab("search");
    setSearched(true);
    setLocalLoading(true);
    setAiResult(""); setAiError("");

    // Smart (semantic) search: one ranked page from the local embedding model.
    if (searchMode === "smart") {
      try {
        const params = new URLSearchParams({ q });
        if (court !== "All Courts") params.set("court", court);
        if (year !== "All years") params.set("year", year);
        if (!reported) params.set("reported", "0");
        const res = await fetch(`/api/judgments/semantic?${params}`);
        const data = await res.json();
        setLocalResults(data.results || []);
        setIsRelated(false);
        setSemanticFallback(data.available === false);
        setHasMore(false); setPage(1); setTotalPages(1);
        setPassageIdx({});
      } catch {
        setLocalResults([]);
      }
      setLocalLoading(false);
      return;
    }
    setSemanticFallback(false);

    try {
      const params = new URLSearchParams({ q, sort, page: String(nextPage) });
      if (court !== "All Courts") params.set("court", court);
      if (year !== "All years") params.set("year", year);
      if (!reported) params.set("reported", "0");
      // After page 1 we already know whether we're in related-fallback mode.
      if (nextPage > 1 && isRelated) params.set("related", "1");
      const res = await fetch(`/api/judgments/local?${params}`);
      const data = await res.json();
      setLocalResults(data.results || []);
      setIsRelated(!!data.related);
      setHasMore(!!data.hasMore);
      setPage(data.page || nextPage);
      setTotalPages(data.totalPages || 1);
      setPassageIdx({});
      if (data.stats) setLocalStats(data.stats);
      // jump back to the top of the list when paging
      if (nextPage > 1) resultsTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch {
      setLocalResults([]);
    }
    setLocalLoading(false);
  };

  const goToPage = (p: number) => {
    if (p < 1 || localLoading) return;
    runSearch(undefined, { page: p });
  };

  const handleAskAI = async () => {
    if (!query.trim()) return;
    setAiLoading(true); setAiError(""); setAiResult("");
    try {
      const courtLabel = courtFilter !== "All Courts" ? courtFilter : "";
      const yearLabel = yearFilter !== "All years" ? `year ${yearFilter}` : "";
      const filters = [courtLabel, yearLabel].filter(Boolean).join(", ");
      const fd = new FormData();
      fd.append("query", filters ? `${query} (${filters})` : query);
      fd.append("mode", "search");
      const res = await fetch("/api/ai/judgment", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "AI search failed");
      setAiResult(data.result as string);
    } catch (err) {
      setAiError(err instanceof Error ? err.message : "AI search failed");
    } finally {
      setAiLoading(false);
    }
  };

  // Open a judgment in the full-screen reader, and let the reader's cited-case
  // links bounce back here to run a fresh citation search.
  const handleSearchCitation = (citation: string) => {
    setReader(null);
    setSearchMode("citation");
    setQuery(citation);
    runSearch(citation);
  };

  const handleHeadnote = async (j: LocalJudgment) => {
    const existing = headnotes[j.id];
    if (existing && (existing.text || existing.loading)) {
      // toggle off
      setHeadnotes((h) => { const n = { ...h }; delete n[j.id]; return n; });
      return;
    }
    setHeadnotes((h) => ({ ...h, [j.id]: { loading: true, text: null } }));
    try {
      const docRes = await fetch(`/api/judgments/local/${j.id}`);
      const docData = await docRes.json();
      const content: string = docData.judgment?.content || "";
      if (!content) throw new Error("No text available");
      const fd = new FormData();
      fd.append("mode", "summarize");
      fd.append("pdfText", content.slice(0, 12000));
      const res = await fetch("/api/ai/judgment", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setHeadnotes((h) => ({ ...h, [j.id]: { loading: false, text: data.result } }));
    } catch (err) {
      setHeadnotes((h) => ({ ...h, [j.id]: { loading: false, text: err instanceof Error ? err.message : "Could not generate headnote." } }));
    }
  };

  const handleSave = (j: LocalJudgment) => {
    toggleSavedJudgment({
      id: j.id, citation: j.citation, reported: j.reported,
      court: j.court, year: j.year, title: j.title, caseNo: j.caseNo,
    });
  };

  const movePassage = (id: number, total: number, dir: 1 | -1) => {
    setPassageIdx((p) => {
      const cur = p[id] ?? 0;
      return { ...p, [id]: (cur + dir + total) % total };
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { setAnalyzeError("Only image files are supported (JPG, PNG)"); return; }
    if (file.size > 10 * 1024 * 1024) { setAnalyzeError("Image must be under 10MB"); return; }
    setImageFile(file); setAnalyzeError("");
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async (action: "summarize" | "strategy") => {
    const hasContent = uploadMode === "image" ? !!imageFile : !!judgmentText.trim();
    if (!hasContent) return;
    setAnalyzeAction(action); setAnalyzeLoading(true); setAnalyzeError(""); setAnalyzeResult("");
    try {
      const fd = new FormData();
      fd.append("mode", action);
      if (uploadMode === "image" && imageFile) fd.append("image", imageFile);
      else fd.append("pdfText", judgmentText);
      if (action === "strategy" && strategyFacts.trim()) fd.append("query", strategyFacts);
      const res = await fetch("/api/ai/judgment", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");
      setAnalyzeResult(data.result);
    } catch (err) {
      setAnalyzeError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setAnalyzeLoading(false);
    }
  };

  const handleQaSubmit = async () => {
    if (!qaQuestion.trim() || !qaText.trim()) return;
    const userMsg: ChatMessage = { role: "user", text: qaQuestion };
    setChatMessages((p) => [...p, userMsg]); setQaQuestion(""); setQaLoading(true); setQaError("");
    try {
      const fd = new FormData();
      fd.append("mode", "qa"); fd.append("pdfText", qaText); fd.append("query", userMsg.text);
      const res = await fetch("/api/ai/judgment", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Q&A failed");
      setChatMessages((p) => [...p, { role: "ai", text: data.result }]);
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch (err) {
      setQaError(err instanceof Error ? err.message : "Q&A failed");
    } finally {
      setQaLoading(false);
    }
  };

  const smartExamples = ["Landlord wants to evict a tenant who stopped paying rent", "Accused seeking bail in a narcotics case", "Buyer suing seller to enforce a sale agreement"];
  const keywordExamples = ["Adverse possession", "Bail cancellation", "Specific performance", "Defamation", "Qatl-e-Amd"];
  const citationExamples = ["2023 SCMR 1450", "PLD 2019 SC 304", "2021 PCrLJ 500", "2020 MLD 1000"];
  const examples = searchMode === "smart" ? smartExamples : searchMode === "keyword" ? keywordExamples : citationExamples;

  const cardStyle = { background: "var(--bg-surface-1)", border: "1px solid var(--border-subtle)" };
  const errorBox = (msg: string, onClose: () => void) => (
    <div className="flex items-center justify-between p-4 rounded-xl text-sm text-danger-500 bg-danger-500/10 border border-danger-500/20">
      <span>{msg}</span><button onClick={onClose}><X className="h-4 w-4" /></button>
    </div>
  );

  const TOOLS: { id: ToolTab; label: string; icon: React.ElementType }[] = [
    { id: "search", label: "Search Case Law", icon: Search },
    { id: "upload", label: "Upload & Analyze", icon: Upload },
    { id: "qa",     label: "Q&A on Judgment",  icon: MessageSquare },
  ];

  // ── Result card ────────────────────────────────────────────────────────────────

  const ResultCard = (j: LocalJudgment) => {
    const auth = authority(j.court);
    const saved = savedIds.has(j.id);
    const idx = passageIdx[j.id] ?? 0;
    const heading = j.title || j.caseNo || j.citation;
    const hn = headnotes[j.id];

    return (
      <div key={j.id} className="rounded-2xl overflow-hidden" style={cardStyle}>
        <div className="p-5">
          {/* top row: citation + court + save */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5 flex-wrap min-w-0">
              {j.reported ? (
                <span className="px-2.5 py-1 text-[12px] font-bold rounded-lg font-mono bg-primary-500/12 text-primary-300 border border-primary-500/25">{j.citation}</span>
              ) : (
                <span className="px-2.5 py-1 text-[11px] font-semibold rounded-lg" style={{ background: "var(--bg-surface-3)", color: "var(--text-tertiary)" }}>Unreported</span>
              )}
              <span className="flex items-center gap-1.5 text-[13px]" style={{ color: "var(--text-secondary)" }}>
                <Building2 className="h-3.5 w-3.5" strokeWidth={1.75} style={{ color: "var(--text-tertiary)" }} />
                {j.court}{j.year ? ` · ${j.year}` : ""}
              </span>
              {auth && (
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-md ${auth === "binding" ? "bg-success-500/10 text-success-500 border border-success-500/25" : "bg-warning-500/10 text-warning-500 border border-warning-500/25"}`}>
                  <Scale className="h-2.5 w-2.5" strokeWidth={2.5} />{auth === "binding" ? "Binding" : "Persuasive"}
                </span>
              )}
            </div>
            <button onClick={() => handleSave(j)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium rounded-lg flex-shrink-0 transition-all"
              style={saved
                ? { background: "rgba(6,182,212,0.12)", border: "1px solid rgba(6,182,212,0.35)", color: "var(--color-primary-300)" }
                : { background: "var(--bg-surface-2)", border: "1px solid var(--border-default)", color: "var(--text-secondary)" }}>
              <Bookmark className="h-3.5 w-3.5" fill={saved ? "currentColor" : "none"} strokeWidth={1.75} />
              {saved ? "Saved" : "Save"}
            </button>
          </div>

          {/* title */}
          <h3 className="font-display text-[17px] font-bold mt-3 leading-snug" style={{ color: "var(--text-primary)" }}>{heading}</h3>

          {/* passage carousel */}
          {j.passages.length > 0 && (
            <div className="mt-3 rounded-xl p-4" style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border-subtle)" }}>
              <div className="flex items-start gap-3">
                {j.passages.length > 1 && (
                  <button onClick={() => movePassage(j.id, j.passages.length, -1)} aria-label="Previous excerpt"
                    className="mt-0.5 p-1 rounded-md hover:text-primary-400 flex-shrink-0" style={{ color: "var(--text-tertiary)" }}>
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                )}
                <p className="flex-1 text-[13px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>{j.passages[idx]}</p>
                {j.passages.length > 1 && (
                  <button onClick={() => movePassage(j.id, j.passages.length, 1)} aria-label="Next excerpt"
                    className="mt-0.5 p-1 rounded-md hover:text-primary-400 flex-shrink-0" style={{ color: "var(--text-tertiary)" }}>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                )}
              </div>
              {j.passages.length > 1 && (
                <div className="text-center text-[11px] mt-2 font-mono" style={{ color: "var(--text-tertiary)" }}>{idx + 1} of {j.passages.length}</div>
              )}
            </div>
          )}

          {/* headnote (lazy AI) */}
          {hn && (
            <div className="mt-3 rounded-xl p-4 bg-ai-500/[0.06] border border-ai-500/15">
              <div className="flex items-center gap-1.5 mb-2"><Sparkles className="h-3.5 w-3.5 text-ai-500" /><span className="text-[11px] font-semibold text-ai-500">AI Headnote</span></div>
              {hn.loading
                ? <div className="flex items-center gap-2"><Dots /><span className="text-xs" style={{ color: "var(--text-tertiary)" }}>Generating headnote…</span></div>
                : <p className="whitespace-pre-wrap text-[13px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>{hn.text}</p>}
            </div>
          )}

          {/* actions */}
          <div className="flex items-center justify-end gap-2 mt-4">
            {j.processed === 1 && (
              <button onClick={() => handleHeadnote(j)}
                className="flex items-center gap-1.5 px-3.5 py-2 text-[12px] font-medium rounded-lg transition-all hover:text-[var(--text-primary)]"
                style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border-default)", color: "var(--text-secondary)" }}>
                <Eye className="h-3.5 w-3.5" /> Headnote
              </button>
            )}
            <button onClick={() => setReader(j)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-[12px] font-semibold rounded-lg transition-all"
              style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }}>
              <BookOpen className="h-3.5 w-3.5" /> Read
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-5">

      {/* full-screen judgment reader */}
      {reader && (
        <JudgmentReader
          judgment={reader}
          onClose={() => setReader(null)}
          onSearchCitation={handleSearchCitation}
        />
      )}

      {/* ── Header ── */}
      <div>
        <h1 className="font-display text-2xl font-extrabold tracking-tight flex items-center gap-2.5" style={{ color: "var(--text-primary)" }}>
          <span className="w-9 h-9 rounded-xl grid place-items-center bg-primary-500/10"><Gavel className="h-5 w-5 text-primary-400" strokeWidth={1.75} /></span>
          Judgment Search
        </h1>
        <p className="text-[13px] mt-1.5" style={{ color: "var(--text-secondary)" }}>Search Pakistani case law by keyword or citation. Read, bookmark, or analyse any judgment.</p>
      </div>

      {/* ── Tool pills ── */}
      <div className="flex gap-2 flex-wrap">
        {TOOLS.map((t) => {
          const Icon = t.icon;
          const on = toolTab === t.id;
          return (
            <button key={t.id} onClick={() => setToolTab(t.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold transition-all"
              style={on
                ? { background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.4)", color: "var(--color-primary-400)" }
                : { background: "var(--bg-surface-1)", border: "1px solid var(--border-subtle)", color: "var(--text-secondary)" }}>
              <Icon className="h-4 w-4" strokeWidth={1.75} /> {t.label}
            </button>
          );
        })}
      </div>

      {/* ══ TOOL: SEARCH ══ */}
      {toolTab === "search" && (
        <div className="space-y-4">
          {/* search bar */}
          <div className="flex gap-2">
            <div className="flex items-center gap-3 flex-1 rounded-xl px-4 focus-within:border-primary-500/40 transition-colors" style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border-default)" }}>
              <Search className="h-5 w-5 flex-shrink-0" strokeWidth={1.75} style={{ color: "var(--text-tertiary)" }} />
              <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && runSearch()}
                placeholder={searchMode === "smart" ? "Describe the matter in plain words, e.g. tenant not paying rent, want eviction" : searchMode === "keyword" ? "Search with keywords, e.g. bail cancellation principles" : 'Enter a citation, e.g. "2023 SCMR 1450" or "PLD 2019 SC 304"'}
                className="flex-1 bg-transparent text-sm py-3.5 focus:outline-none border-0" style={{ color: "var(--text-primary)" }} />
              {query && <button onClick={() => setQuery("")} style={{ color: "var(--text-tertiary)" }} className="hover:text-[var(--text-primary)]"><X className="h-4 w-4" /></button>}
            </div>
            <button onClick={() => runSearch()} disabled={!query.trim() || localLoading}
              className="flex items-center gap-2 px-6 bg-primary-500 hover:bg-primary-400 text-[#07090f] font-semibold text-sm rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0">
              <Search className="h-4 w-4" strokeWidth={2.25} /> Search
            </button>
          </div>

          {/* mode toggle */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="inline-flex p-0.5 rounded-lg" style={{ background: "var(--bg-surface-1)", border: "1px solid var(--border-default)" }}>
              {([{ id: "smart", label: "Smart" }, { id: "keyword", label: "Keyword" }, { id: "citation", label: "Citation" }] as { id: SearchMode; label: string }[]).map((t) => (
                <button key={t.id} onClick={() => setSearchMode(t.id)}
                  className={`px-4 py-1.5 text-[12px] font-semibold rounded-md transition-all ${searchMode === t.id ? "bg-primary-500 text-[#07090f]" : "hover:text-[var(--text-primary)]"}`}
                  style={searchMode === t.id ? undefined : { color: "var(--text-tertiary)" }}>
                  {t.id === "smart" && <Sparkles className="inline h-3 w-3 mr-1 -mt-0.5" />}{t.label}
                </button>
              ))}
            </div>
            {searchMode === "smart" && (
              <span className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>Search by meaning — describe the issue in your own words.</span>
            )}
          </div>

          {!searched && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] mr-1" style={{ color: "var(--text-tertiary)" }}>Try:</span>
              {examples.map((ex) => (
                <button key={ex} onClick={() => { setQuery(ex); runSearch(ex); }}
                  className="px-3 py-1 text-[11px] font-medium rounded-lg hover:text-primary-400 hover:border-primary-500/30 transition-all"
                  style={{ background: "var(--bg-surface-1)", border: "1px solid var(--border-subtle)", color: "var(--text-secondary)" }}>
                  {ex}
                </button>
              ))}
            </div>
          )}

          {/* results + sidebar */}
          {searched && (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5 items-start">
              {/* main column */}
              <div ref={resultsTopRef} className="space-y-3 min-w-0 scroll-mt-4">
                {/* fallback / count line */}
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <p className="text-[13px] flex items-center gap-1.5" style={{ color: "var(--text-secondary)" }}>
                    {searchMode === "smart" && !localLoading && !semanticFallback && localResults.length > 0 && <Sparkles className="h-3.5 w-3.5 text-ai-500" />}
                    {localLoading ? "Searching…"
                      : localResults.length === 0 ? "No judgments found."
                      : isRelated ? `No exact match — ${localResults.length} related judgment${localResults.length > 1 ? "s" : ""}`
                      : searchMode === "smart" && !semanticFallback ? `${localResults.length} judgment${localResults.length > 1 ? "s" : ""} by meaning`
                      : `${localResults.length} judgment${localResults.length > 1 ? "s" : ""}`}
                  </p>
                  <div className="flex items-center gap-1.5 text-[12px]">
                    <span style={{ color: "var(--text-tertiary)" }}>Didn&apos;t find it?</span>
                    <button onClick={handleAskAI} disabled={aiLoading || !query.trim()} className="font-semibold text-primary-400 hover:text-primary-300 disabled:opacity-50">Ask AI</button>
                  </div>
                </div>

                {/* Smart search offline → keyword fallback notice */}
                {semanticFallback && !localLoading && (
                  <div className="flex items-start gap-2 px-3 py-2 rounded-xl text-[12px] bg-warning-500/10 border border-warning-500/25" style={{ color: "var(--text-secondary)" }}>
                    <Sparkles className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-warning-500" />
                    <span>Smart search is offline — showing keyword matches instead. Start the semantic service to enable meaning-based search.</span>
                  </div>
                )}

                {/* AI answer (lazy) */}
                {(aiLoading || aiResult || aiError) && (
                  <div className="rounded-2xl overflow-hidden" style={{ background: "var(--bg-surface-1)", border: "1px solid rgba(167,139,250,0.22)" }}>
                    <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                      <span className="flex items-center gap-2 text-sm font-bold" style={{ color: "var(--text-primary)" }}><Sparkles className="h-4 w-4 text-ai-500" /> AI Answer</span>
                      {aiResult && (
                        <button onClick={() => { navigator.clipboard.writeText(aiResult); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium rounded-lg" style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border-default)", color: "var(--text-secondary)" }}>
                          {copied ? <Check className="h-3 w-3 text-success-500" /> : <Copy className="h-3 w-3" />}{copied ? "Copied" : "Copy"}
                        </button>
                      )}
                    </div>
                    <div className="p-5">
                      {aiLoading ? <div className="flex items-center gap-3"><Dots /><span className="text-sm" style={{ color: "var(--text-tertiary)" }}>Asking AI about Pakistani case law…</span></div>
                        : aiError ? <span className="text-sm text-danger-500">{aiError}</span>
                        : <div className="whitespace-pre-wrap text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{aiResult}</div>}
                    </div>
                  </div>
                )}

                {localLoading && (
                  <div className="rounded-2xl p-12 flex flex-col items-center gap-4" style={cardStyle}>
                    <Dots /><p className="text-sm" style={{ color: "var(--text-tertiary)" }}>Searching the judgment archive…</p>
                  </div>
                )}

                {!localLoading && localResults.length === 0 && (
                  <div className="rounded-2xl p-12 flex flex-col items-center text-center" style={cardStyle}>
                    <div className="w-16 h-16 rounded-2xl grid place-items-center mb-4" style={{ background: "var(--bg-surface-2)" }}><BookMarked className="h-7 w-7" style={{ color: "var(--text-tertiary)" }} /></div>
                    <h3 className="text-sm font-bold" style={{ color: "var(--text-secondary)" }}>No judgments matched your search</h3>
                    <p className="text-[12px] mt-1.5 max-w-sm" style={{ color: "var(--text-tertiary)" }}>Try fewer or different keywords, or click <span className="text-primary-400 font-semibold">Ask AI</span> above.</p>
                  </div>
                )}

                {!localLoading && localResults.map((j) => ResultCard(j))}

                {/* pagination */}
                {!localLoading && localResults.length > 0 && (page > 1 || hasMore) && (
                  <div className="flex items-center justify-center gap-3 pt-3">
                    <button onClick={() => goToPage(page - 1)} disabled={page <= 1 || localLoading} aria-label="Previous page"
                      className="grid place-items-center w-9 h-9 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:text-[var(--text-primary)]"
                      style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border-default)", color: "var(--text-secondary)" }}>
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <span className="text-[13px] font-medium px-1" style={{ color: "var(--text-secondary)" }}>Page {page} of {totalPages}</span>
                    <button onClick={() => goToPage(page + 1)} disabled={!hasMore || localLoading} aria-label="Next page"
                      className="grid place-items-center w-9 h-9 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:text-[var(--text-primary)]"
                      style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border-default)", color: "var(--text-secondary)" }}>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* sidebar */}
              <aside className="space-y-4 lg:sticky lg:top-4">
                <div className="rounded-2xl p-4" style={cardStyle}>
                  <div className="flex items-center gap-2 text-[12px] font-medium" style={{ color: "var(--text-secondary)" }}>
                    <span className="text-base">🇵🇰</span> Pakistan
                  </div>
                </div>

                <div className="rounded-2xl p-4" style={cardStyle}>
                  <h4 className="text-[11px] font-bold tracking-wide uppercase mb-3" style={{ color: "var(--text-tertiary)" }}>Sort Results</h4>
                  <div className="space-y-1.5">
                    {SORTS.map((s) => {
                      const on = sortMode === s.id;
                      return (
                        <button key={s.id} onClick={() => { setSortMode(s.id); runSearch(undefined, { sort: s.id }); }}
                          className="w-full flex items-start gap-2.5 px-3 py-2 rounded-xl text-left transition-all"
                          style={on
                            ? { background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.35)" }
                            : { background: "var(--bg-surface-2)", border: "1px solid var(--border-subtle)" }}>
                          <span className="mt-0.5 w-3.5 h-3.5 rounded-full flex-shrink-0 grid place-items-center" style={{ border: `1px solid ${on ? "var(--color-primary-400)" : "var(--border-strong)"}` }}>
                            {on && <span className="w-1.5 h-1.5 rounded-full bg-primary-400" />}
                          </span>
                          <span className="min-w-0">
                            <span className="block text-[12px] font-semibold" style={{ color: on ? "var(--color-primary-300)" : "var(--text-primary)" }}>{s.label}</span>
                            <span className="block text-[10px]" style={{ color: "var(--text-tertiary)" }}>{s.note}</span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-2xl p-4 space-y-3" style={cardStyle}>
                  <h4 className="text-[11px] font-bold tracking-wide uppercase" style={{ color: "var(--text-tertiary)" }}>Refine Results</h4>
                  <button
                    onClick={() => { const v = !reportedOnly; setReportedOnly(v); runSearch(undefined, { reported: v }); }}
                    className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-left transition-all"
                    style={reportedOnly
                      ? { background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.35)" }
                      : { background: "var(--bg-surface-2)", border: "1px solid var(--border-subtle)" }}>
                    <span className="min-w-0">
                      <span className="block text-[12px] font-semibold" style={{ color: reportedOnly ? "var(--color-primary-300)" : "var(--text-primary)" }}>Reported only</span>
                      <span className="block text-[10px]" style={{ color: "var(--text-tertiary)" }}>Citable judgments with a law-report citation</span>
                    </span>
                    <span className="w-9 h-5 rounded-full flex-shrink-0 relative transition-colors" style={{ background: reportedOnly ? "var(--color-primary-500)" : "var(--border-strong)" }}>
                      <span className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all" style={{ left: reportedOnly ? "18px" : "2px" }} />
                    </span>
                  </button>
                  <div>
                    <label className="block text-[11px] mb-1.5" style={{ color: "var(--text-secondary)" }}>Court</label>
                    <FilterSelect label="Court" value={courtFilter} options={COURTS} onChange={(v) => { setCourtFilter(v); runSearch(undefined, { court: v }); }} />
                  </div>
                  <div>
                    <label className="block text-[11px] mb-1.5" style={{ color: "var(--text-secondary)" }}>Year</label>
                    <FilterSelect label="Year" value={yearFilter} options={YEARS} onChange={(v) => { setYearFilter(v); runSearch(undefined, { year: v }); }} />
                  </div>
                  {(courtFilter !== "All Courts" || yearFilter !== "All years") && (
                    <button onClick={() => { setCourtFilter("All Courts"); setYearFilter("All years"); runSearch(undefined, { court: "All Courts", year: "All years" }); }}
                      className="text-[11px] font-medium text-primary-400 hover:text-primary-300">Clear filters</button>
                  )}
                </div>

                {localStats && (
                  <div className="rounded-2xl p-4 flex items-center gap-2 text-[11px]" style={cardStyle}>
                    <Database className="h-3.5 w-3.5 text-success-500" />
                    <span style={{ color: "var(--text-tertiary)" }}>{localStats.total.toLocaleString()} judgments indexed</span>
                  </div>
                )}
              </aside>
            </div>
          )}
        </div>
      )}

      {/* ══ TOOL: UPLOAD & ANALYZE ══ */}
      {toolTab === "upload" && (
        <div className="space-y-4">
          {analyzeError && errorBox(analyzeError, () => setAnalyzeError(""))}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="rounded-xl p-4" style={cardStyle}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: "var(--text-primary)" }}><Upload className="h-4 w-4 text-primary-400" /> Judgment Input</h3>
                  <div className="flex p-0.5 rounded-lg" style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border-subtle)" }}>
                    {(["image", "text"] as const).map((m) => (
                      <button key={m} onClick={() => setUploadMode(m)}
                        className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${uploadMode === m ? "bg-primary-500 text-[#07090f]" : ""}`}
                        style={uploadMode === m ? undefined : { color: "var(--text-tertiary)" }}>
                        {m.charAt(0).toUpperCase() + m.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                {uploadMode === "image" ? (
                  imagePreview ? (
                    <div className="relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={imagePreview} alt="Judgment" className="w-full max-h-[300px] object-contain rounded-xl" style={{ border: "1px solid var(--border-default)" }} />
                      <button onClick={() => { setImageFile(null); setImagePreview(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-danger-500 text-white hover:brightness-110 shadow-lg"><X className="h-4 w-4" /></button>
                    </div>
                  ) : (
                    <div onClick={() => fileInputRef.current?.click()}
                      className="min-h-[200px] rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-primary-500/40 hover:bg-primary-500/5 group transition-all"
                      style={{ border: "2px dashed var(--border-default)" }}>
                      <Upload className="h-8 w-8 mb-2 group-hover:text-primary-400 transition-colors" style={{ color: "var(--text-tertiary)" }} />
                      <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Click to upload a judgment image</p>
                      <p className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>JPG, PNG — Max 10MB</p>
                    </div>
                  )
                ) : (
                  <textarea value={judgmentText} onChange={(e) => setJudgmentText(e.target.value)} placeholder="Paste judgment text here…"
                    className="w-full min-h-[220px] px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 resize-none" style={{ border: "1px solid var(--border-default)", color: "var(--text-primary)" }} />
                )}
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </div>
              <div className="rounded-xl p-4" style={cardStyle}>
                <h4 className="text-xs font-semibold mb-2 flex items-center gap-1.5" style={{ color: "var(--text-secondary)" }}><Lightbulb className="h-3.5 w-3.5 text-warning-500" /> Your Case Facts (for Strategy mode)</h4>
                <textarea value={strategyFacts} onChange={(e) => setStrategyFacts(e.target.value)} placeholder="Brief facts of your current case…"
                  className="w-full min-h-[70px] px-3 py-2 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary-500/30 resize-none" style={{ border: "1px solid var(--border-default)", color: "var(--text-primary)" }} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => handleAnalyze("summarize")} disabled={analyzeLoading || (uploadMode === "image" ? !imageFile : !judgmentText.trim())}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary-500 hover:bg-primary-400 text-[#07090f] text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                  <FileText className="h-4 w-4" />{analyzeLoading && analyzeAction === "summarize" ? "Analyzing…" : "Summarize"}
                </button>
                <button onClick={() => handleAnalyze("strategy")} disabled={analyzeLoading || (uploadMode === "image" ? !imageFile : !judgmentText.trim())}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed" style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }}>
                  <Lightbulb className="h-4 w-4 text-warning-500" />{analyzeLoading && analyzeAction === "strategy" ? "Analyzing…" : "Get Strategy"}
                </button>
              </div>
            </div>
            <div className="rounded-xl flex flex-col min-h-[380px]" style={cardStyle}>
              <div className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: "var(--text-primary)" }}><Sparkles className="h-4 w-4 text-ai-500" />{analyzeAction === "strategy" ? "Strategy" : "Summary"}</h3>
                {analyzeResult && (
                  <button onClick={() => { navigator.clipboard.writeText(analyzeResult); setSavedToNotes(true); setTimeout(() => setSavedToNotes(false), 2000); }}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium rounded-lg hover:text-[var(--text-primary)] transition-all" style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border-default)", color: "var(--text-secondary)" }}>
                    {savedToNotes ? <Check className="h-3 w-3 text-success-500" /> : <Copy className="h-3 w-3" />}{savedToNotes ? "Copied!" : "Copy"}
                  </button>
                )}
              </div>
              <div className="flex-1 p-5 overflow-y-auto">
                {analyzeLoading ? (
                  <div className="h-full flex flex-col items-center justify-center gap-3"><Dots /><p className="text-sm" style={{ color: "var(--text-tertiary)" }}>Analyzing judgment…</p></div>
                ) : analyzeResult ? (
                  <div className="whitespace-pre-wrap text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{analyzeResult}</div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center"><Scale className="h-10 w-10 mb-3" style={{ color: "var(--border-strong)" }} /><p className="text-sm" style={{ color: "var(--text-tertiary)" }}>Upload a judgment, then Summarize or Get Strategy.</p></div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══ TOOL: Q&A ══ */}
      {toolTab === "qa" && (
        <div className="space-y-4">
          {qaError && errorBox(qaError, () => setQaError(""))}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-xl p-4" style={cardStyle}>
              <h3 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: "var(--text-primary)" }}><FileText className="h-4 w-4 text-primary-400" /> Paste Judgment</h3>
              <textarea value={qaText} onChange={(e) => setQaText(e.target.value)} placeholder="Paste the full judgment text here…"
                className="w-full min-h-[280px] px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 resize-none" style={{ border: "1px solid var(--border-default)", color: "var(--text-primary)" }} />
              <div className="mt-3 p-3 rounded-xl bg-ai-500/[0.06] border border-ai-500/15">
                <p className="text-[11px] text-ai-500 font-medium mb-1.5">Quick questions:</p>
                <div className="flex flex-wrap gap-1.5">
                  {["Is this binding?", "What principle does this establish?", "Can this be distinguished?", "What statutes are cited?"].map((q) => (
                    <button key={q} onClick={() => setQaQuestion(q)} className="px-2 py-1 text-[10px] rounded-md hover:text-ai-500 hover:border-ai-500/30 transition-all" style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border-subtle)", color: "var(--text-secondary)" }}>{q}</button>
                  ))}
                </div>
              </div>
            </div>
            <div className="rounded-xl flex flex-col min-h-[400px]" style={cardStyle}>
              <div className="px-5 py-3.5" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: "var(--text-primary)" }}><MessageSquare className="h-4 w-4 text-ai-500" /> Q&amp;A</h3>
              </div>
              <div className="flex-1 min-h-[280px] max-h-[380px] overflow-y-auto p-4 space-y-3">
                {chatMessages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-8"><MessageSquare className="h-10 w-10 mb-3" style={{ color: "var(--border-strong)" }} /><p className="text-sm" style={{ color: "var(--text-tertiary)" }}>Ask any question about the judgment.</p><p className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>Paste the judgment text on the left first.</p></div>
                ) : (
                  chatMessages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${msg.role === "user" ? "bg-primary-500 text-[#07090f] rounded-br-md" : "rounded-bl-md"}`}
                        style={msg.role === "user" ? undefined : { background: "var(--bg-surface-2)", border: "1px solid var(--border-default)", color: "var(--text-secondary)" }}>
                        <div className="whitespace-pre-wrap">{msg.text}</div>
                      </div>
                    </div>
                  ))
                )}
                {qaLoading && <div className="flex justify-start"><div className="rounded-2xl rounded-bl-md px-4 py-3" style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border-default)" }}><Dots /></div></div>}
                <div ref={chatEndRef} />
              </div>
              <div className="p-3 flex gap-2" style={{ borderTop: "1px solid var(--border-subtle)" }}>
                <input type="text" value={qaQuestion} onChange={(e) => setQaQuestion(e.target.value)} onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleQaSubmit()}
                  placeholder="Ask a question about the judgment…" disabled={!qaText.trim() || qaLoading}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 disabled:opacity-40" style={{ border: "1px solid var(--border-default)", color: "var(--text-primary)" }} />
                <button onClick={handleQaSubmit} disabled={!qaQuestion.trim() || !qaText.trim() || qaLoading}
                  className="p-2.5 rounded-xl bg-primary-500 hover:bg-primary-400 text-[#07090f] disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0 transition-all"><Send className="h-4 w-4" /></button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
