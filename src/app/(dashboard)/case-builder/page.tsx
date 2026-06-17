"use client";

import { useState } from "react";
import { saveDocument, updateDocumentContent } from "@/lib/document-store";
import DocumentPreview from "@/components/documents/DocumentPreview";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import {
  Search, Sparkles, ArrowLeft, Scale, BookOpen,
  ChevronRight, TrendingUp, TrendingDown, Minus,
  FileText, AlertTriangle, Eye, Plus, Trash2, X,
} from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────────────

type Stage = "input" | "researching" | "results" | "asking" | "generating" | "done";

interface PreparedJudgment {
  id: number;
  citation: string;
  court: string;
  year: number;
  title: string | null;
  reason: string;
  ratio: string;
  stance: "favorable" | "adverse" | "neutral";
}

interface ResearchResult {
  searchTerms: { primaryTerms: string[]; secondaryTerms: string[]; clientPosition: string };
  totalCandidates: number;
  judgments: PreparedJudgment[];
  legalStrategy: string;
}

interface Question {
  id: string;
  label: string;
  placeholder: string;
  required: boolean;
}

interface JudgmentSearchItem {
  id: number;
  citation: string;
  court: string;
  year: number;
  title: string | null;
  passages?: string[];
}

const COURTS = [
  "All Courts", "Supreme Court", "Federal Shariat Court",
  "Lahore High Court", "Sindh High Court",
  "Peshawar High Court", "Balochistan High Court", "Islamabad High Court",
];

const DOCUMENT_TYPES = [
  "Bail Application",
  "Written Statement",
  "Writ Petition",
  "Civil Suit",
  "Criminal Complaint",
  "Appeal",
  "Legal Notice",
  "Vakalatnama",
  "Power of Attorney",
  "Affidavit",
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function StanceBadge({ stance }: { stance: PreparedJudgment["stance"] }) {
  if (stance === "favorable") return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold" style={{ background: "rgba(16,185,129,0.12)", color: "#10b981" }}>
      <TrendingUp className="h-3 w-3" /> Favorable
    </span>
  );
  if (stance === "adverse") return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold" style={{ background: "rgba(239,68,68,0.12)", color: "#ef4444" }}>
      <TrendingDown className="h-3 w-3" /> Adverse
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold" style={{ background: "rgba(100,116,139,0.12)", color: "var(--text-tertiary)" }}>
      <Minus className="h-3 w-3" /> Neutral
    </span>
  );
}

function Dots() {
  return (
    <div className="flex items-center gap-1.5">
      {[0, 150, 300].map((d) => (
        <div key={d} className="w-2 h-2 rounded-full animate-bounce" style={{ background: "var(--primary-500)", animationDelay: `${d}ms` }} />
      ))}
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

function fieldLabel(id: string) {
  return id
    .replace(/_/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase())
    .replace(/\bCnic\b/g, "CNIC")
    .replace(/\bFir\b/g, "FIR");
}

function FilledDetails({ items }: { items: { label: string; value: string }[] }) {
  if (items.length === 0) return null;
  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-tertiary)" }}>Already Filled</p>
        <span className="rounded-md px-2 py-0.5 text-[11px] font-semibold" style={{ background: "rgba(16,185,129,0.1)", color: "#10b981", border: "1px solid rgba(16,185,129,0.2)" }}>
          {items.length} field{items.length !== 1 ? "s" : ""}
        </span>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item.label} className="rounded-md px-3 py-2" style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border-subtle)" }}>
            <p className="text-[11px] font-medium" style={{ color: "var(--text-tertiary)" }}>{item.label}</p>
            <p className="truncate text-sm" style={{ color: "var(--text-primary)" }}>{item.value}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default function CaseBuilderPage() {
  const [stage, setStage] = useState<Stage>("input");
  const [error, setError] = useState<string | null>(null);

  // Input fields — required
  const [sections, setSections] = useState("");
  const [facts, setFacts] = useState("");
  const [documentNeeded, setDocumentNeeded] = useState("");
  // Input fields — optional party / case details
  const [clientName, setClientName] = useState("");
  const [clientFatherName, setClientFatherName] = useState("");
  const [clientCnic, setClientCnic] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [opponentName, setOpponentName] = useState("");
  const [opponentFatherName, setOpponentFatherName] = useState("");
  const [opponentCnic, setOpponentCnic] = useState("");
  const [opponentAddress, setOpponentAddress] = useState("");
  const [firNo, setFirNo] = useState("");
  const [policeStation, setPoliceStation] = useState("");
  const [courtName, setCourtName] = useState("");
  const [districtName, setDistrictName] = useState("");
  const [court, setCourt] = useState("All Courts");
  const [language, setLanguage] = useState("en");

  // Research results
  const [result, setResult] = useState<ResearchResult | null>(null);

  // Smart-draft phase
  const [documentType, setDocumentType] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [sectionWarning, setSectionWarning] = useState<string | null>(null);

  // Done phase
  const [generatedHtml, setGeneratedHtml] = useState("");
  const [savedDocId, setSavedDocId] = useState<string | null>(null);
  const [blankCount, setBlankCount] = useState(0);
  const [reviewJudgment, setReviewJudgment] = useState<{ id: number; title: string; content: string } | null>(null);
  const [reviewLoadingId, setReviewLoadingId] = useState<number | null>(null);
  const [changeJudgmentsOpen, setChangeJudgmentsOpen] = useState(false);
  const [judgmentSearchQuery, setJudgmentSearchQuery] = useState("");
  const [judgmentSearchResults, setJudgmentSearchResults] = useState<JudgmentSearchItem[]>([]);
  const [judgmentSearchLoading, setJudgmentSearchLoading] = useState(false);
  const [judgmentSearchPage, setJudgmentSearchPage] = useState(1);
  const [judgmentSearchHasMore, setJudgmentSearchHasMore] = useState(false);
  const [judgmentSearchTotal, setJudgmentSearchTotal] = useState(0);
  const [judgmentSearchRelated, setJudgmentSearchRelated] = useState(false);
  const [selectedMorePage, setSelectedMorePage] = useState(0);
  const [selectedMoreLoading, setSelectedMoreLoading] = useState(false);
  const [selectedMoreHasMore, setSelectedMoreHasMore] = useState(true);
  const [selectedMoreRelated, setSelectedMoreRelated] = useState(false);

  const providedDetails = [
    { label: "Law Sections / Case Type", value: sections },
    { label: "FIR / Case No.", value: firNo },
    { label: "Police Station", value: policeStation },
    { label: "Court Name", value: courtName },
    { label: "District / City", value: districtName },
    { label: "Client Name", value: clientName },
    { label: "Client Father Name", value: clientFatherName },
    { label: "Client CNIC", value: clientCnic },
    { label: "Client Address", value: clientAddress },
    { label: "Opponent Name", value: opponentName },
    { label: "Opponent Father Name", value: opponentFatherName },
    { label: "Opponent CNIC", value: opponentCnic },
    { label: "Opponent Address", value: opponentAddress },
    { label: "Case Facts", value: facts },
    { label: "Document Needed", value: documentNeeded },
    { label: "Judgment Court Filter", value: court !== "All Courts" ? court : "" },
    { label: "Draft Language", value: language === "ur" ? "Urdu" : "English" },
  ].filter((item) => item.value.trim());

  const answerDetails = Object.entries(answers)
    .filter(([, value]) => value?.trim())
    .map(([id, value]) => ({ label: fieldLabel(id), value }));

  const filledDetails = [
    ...providedDetails,
    ...answerDetails.filter((answer) => !providedDetails.some((item) => item.label === answer.label || item.value === answer.value)),
  ];

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleResearch = async () => {
    if (!sections.trim()) { setError("Please enter the law section(s) or case type."); return; }
    setError(null);
    setStage("researching");
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 60_000);
    try {
      const res = await fetch("/api/ai/case-prepare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          sections, facts, documentNeeded, clientName, clientFatherName, clientCnic, clientAddress,
          opponentName, opponentFatherName, opponentCnic, opponentAddress, firNo, policeStation, courtName, districtName, court, year: "All years",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Research failed");
      setResult(data);
      setSelectedMorePage(0);
      setSelectedMoreHasMore(true);
      setSelectedMoreRelated(false);
      setStage("results");
    } catch (err) {
      setError(err instanceof DOMException && err.name === "AbortError"
        ? "Research took too long. Please try fewer sections/case keywords or choose a specific court filter."
        : err instanceof Error ? err.message : "Research failed");
      setStage("input");
    } finally {
      window.clearTimeout(timeoutId);
    }
  };

  const handleReviewJudgment = async (judgment: PreparedJudgment) => {
    setError(null);
    if (reviewJudgment?.id === judgment.id) {
      setReviewJudgment(null);
      return;
    }
    setReviewLoadingId(judgment.id);
    try {
      const res = await fetch(`/api/judgments/local/${encodeURIComponent(String(judgment.id))}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not load judgment");
      const content = String(data.judgment?.content || "").replace(/\s+/g, " ").trim();
      setReviewJudgment({
        id: judgment.id,
        title: `${judgment.citation} — ${judgment.title || judgment.court}`,
        content: content || "No full text available for this judgment.",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load judgment");
    } finally {
      setReviewLoadingId(null);
    }
  };

  const handleSearchJudgments = async (page = 1) => {
    if (!judgmentSearchQuery.trim()) return;
    setJudgmentSearchLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        q: judgmentSearchQuery,
        court,
        sort: "relevance",
        page: String(page),
      });
      if (page > 1 && judgmentSearchRelated) params.set("related", "1");
      const res = await fetch(`/api/judgments/local?${params}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Judgment search failed");
      setJudgmentSearchResults((prev) => page === 1 ? (data.results || []) : [...prev, ...(data.results || [])]);
      setJudgmentSearchPage(page);
      setJudgmentSearchHasMore(Boolean(data.hasMore));
      setJudgmentSearchTotal(Number(data.total || 0));
      setJudgmentSearchRelated(Boolean(data.related));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Judgment search failed");
    } finally {
      setJudgmentSearchLoading(false);
    }
  };

  const handleLoadMoreJudgments = () => {
    if (judgmentSearchLoading || !judgmentSearchHasMore) return;
    void handleSearchJudgments(judgmentSearchPage + 1);
  };

  const handleLoadMoreSelectedJudgments = async () => {
    if (!result || selectedMoreLoading || !selectedMoreHasMore) return;
    const sectionLike = result.searchTerms.primaryTerms.find((term) => /\b\d{2,4}\s*[-/]?\s*[A-Za-z]?\b/.test(term));
    const query = sectionLike || result.searchTerms.primaryTerms[0] || sections;
    if (!query?.trim()) return;

    const nextPage = selectedMorePage + 1;
    setSelectedMoreLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        q: query,
        court,
        sort: "relevance",
        page: String(nextPage),
      });
      if (nextPage > 1 && selectedMoreRelated) params.set("related", "1");
      const res = await fetch(`/api/judgments/local?${params}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not load more judgments");

      const existingIds = new Set(result.judgments.map((j) => j.id));
      const additional: PreparedJudgment[] = (data.results || [])
        .filter((j: JudgmentSearchItem) => !existingIds.has(j.id))
        .map((j: JudgmentSearchItem) => ({
          id: j.id,
          citation: j.citation,
          court: j.court,
          year: j.year,
          title: j.title,
          reason: `Additional related judgment from DB search for "${query}".`,
          ratio: j.passages?.[0] || "Review the judgment text for the exact legal principle and factual match.",
          stance: "neutral" as const,
        }));

      setResult({ ...result, judgments: [...result.judgments, ...additional] });
      setSelectedMorePage(nextPage);
      setSelectedMoreHasMore(Boolean(data.hasMore));
      setSelectedMoreRelated(Boolean(data.related));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load more judgments");
    } finally {
      setSelectedMoreLoading(false);
    }
  };

  const addJudgmentToResearch = (judgment: JudgmentSearchItem) => {
    if (!result) return;
    if (result.judgments.some((j) => j.id === judgment.id)) return;
    const added: PreparedJudgment = {
      id: judgment.id,
      citation: judgment.citation,
      court: judgment.court,
      year: judgment.year,
      title: judgment.title,
      reason: "Added manually by user for review and drafting guidance.",
      ratio: judgment.passages?.[0] || "Review the judgment text for the exact principle.",
      stance: "neutral",
    };
    setResult({ ...result, judgments: [...result.judgments, added] });
  };

  const removeJudgmentFromResearch = (id: number) => {
    if (!result) return;
    setResult({ ...result, judgments: result.judgments.filter((j) => j.id !== id) });
  };

  const handleDraftWithJudgments = async () => {
    if (!result) return;
    setError(null);

    const favorable = result.judgments.filter((j) => j.stance === "favorable");
    const neutral = result.judgments.filter((j) => j.stance === "neutral");
    const usable = [...favorable, ...neutral].slice(0, 5);

    const citationList = usable.map((j) => `${j.citation} (${j.court}, ${j.year})`).join("; ");
    const docRequest = documentNeeded
      ? `Draft a ${documentNeeded} for a case involving ${sections}.`
      : `Draft a legal document for a case involving ${sections}.`;

    const alreadyKnown = [
      clientName && `Petitioner/Accused/Client Name: ${clientName}`,
      clientFatherName && `Petitioner/Accused/Client Father Name: ${clientFatherName}`,
      clientCnic && `Petitioner/Accused/Client CNIC: ${clientCnic}`,
      clientAddress && `Petitioner/Accused/Client Address: ${clientAddress}`,
      opponentName && `Respondent/Opponent/Complainant: ${opponentName}`,
      opponentFatherName && `Respondent/Opponent Father Name: ${opponentFatherName}`,
      opponentCnic && `Respondent/Opponent CNIC: ${opponentCnic}`,
      opponentAddress && `Respondent/Opponent Address: ${opponentAddress}`,
      firNo && `FIR/Case No: ${firNo}`,
      policeStation && `Police Station: ${policeStation}`,
      courtName && `Court Name for document heading: ${courtName}`,
      districtName && `District/City for document heading: ${districtName}`,
      facts && `Case Facts: ${facts}`,
    ].filter(Boolean).join("\n");

    const richRequest = `${docRequest}
${alreadyKnown ? `\nALREADY PROVIDED — do NOT ask for these again:\n${alreadyKnown}\n` : ""}
Supporting Judgments for research guidance only: ${citationList || "None"}
Do not add a standalone reliance/citation paragraph such as "In this regard, reliance is placed..." unless the user expressly asks for authorities to be cited.
Court heading policy: Use only the provided Court Name and District/City. Never assume Lahore or any other city.
Client Position: ${result.searchTerms.clientPosition}`;

    setStage("asking");
    try {
      const res = await fetch("/api/ai/smart-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "analyze", userRequest: richRequest, language }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to analyze request");

      if (data.action === "generated") {
        setGeneratedHtml(data.html);
        setBlankCount(data.blankCount || 0);
        setStage("done");
        return;
      }

      setDocumentType(data.documentType || documentNeeded || "Legal Document");
      setSectionWarning(data.sectionWarning || null);

      // Auto-fill answers from first form — so user doesn't re-enter what they already gave
      const autoFilled: Record<string, string> = {};
      (data.questions || []).forEach((q: Question) => {
        const hint = (q.label + " " + q.id).toLowerCase();
        const clientSide = hint.includes("petitioner") || hint.includes("accused") || hint.includes("applicant") || hint.includes("appellant") || hint.includes("client");
        const opponentSide = hint.includes("respondent") || hint.includes("opponent") || hint.includes("complainant") || hint.includes("defendant");
        if (clientFatherName && clientSide && hint.includes("father")) {
          autoFilled[q.id] = clientFatherName;
        } else if (clientCnic && clientSide && hint.includes("cnic")) {
          autoFilled[q.id] = clientCnic;
        } else if (clientAddress && clientSide && hint.includes("address")) {
          autoFilled[q.id] = clientAddress;
        } else if (opponentFatherName && opponentSide && hint.includes("father")) {
          autoFilled[q.id] = opponentFatherName;
        } else if (opponentCnic && opponentSide && hint.includes("cnic")) {
          autoFilled[q.id] = opponentCnic;
        } else if (opponentAddress && opponentSide && hint.includes("address")) {
          autoFilled[q.id] = opponentAddress;
        } else if (clientFatherName && hint.includes("father") && !opponentSide) {
          autoFilled[q.id] = clientFatherName;
        } else if (clientCnic && hint.includes("cnic") && !opponentSide) {
          autoFilled[q.id] = clientCnic;
        } else if (clientAddress && hint.includes("address") && !opponentSide) {
          autoFilled[q.id] = clientAddress;
        } else if (clientName && clientSide) {
          autoFilled[q.id] = clientName;
        } else if (opponentName && opponentSide) {
          autoFilled[q.id] = opponentName;
        } else if (firNo && (hint.includes("fir") || hint.includes("case no") || hint.includes("case number") || hint.includes("challan"))) {
          autoFilled[q.id] = firNo;
        } else if (policeStation && (hint.includes("police station") || hint.includes("police_station") || hint.includes("thana"))) {
          autoFilled[q.id] = policeStation;
        } else if (courtName && (hint.includes("court name") || hint.includes("court_name") || hint.includes("court"))) {
          autoFilled[q.id] = courtName;
        } else if (districtName && (hint.includes("district") || hint.includes("city") || hint.includes("place"))) {
          autoFilled[q.id] = districtName;
        } else if (facts && (hint.includes("fact") || hint.includes("circumstance") || hint.includes("allegation") || hint.includes("background"))) {
          autoFilled[q.id] = facts;
        }
      });

      const mergedAnswers = { ...(data.extractedInfo || {}), ...autoFilled };
      // Only show questions that weren't auto-filled from first form
      const unanswered = (data.questions || []).filter((q: Question) => !mergedAnswers[q.id]?.trim());
      setQuestions(unanswered);
      setAnswers(mergedAnswers);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
      setStage("results");
    }
  };

  const handleGenerate = async () => {
    if (!result) return;
    setError(null);
    setStage("generating");

    const favorable = result.judgments.filter((j) => j.stance === "favorable");
    const neutral = result.judgments.filter((j) => j.stance === "neutral");
    const usable = [...favorable, ...neutral].slice(0, 5);

    const citationList = usable.map((j) => `${j.citation} (${j.court}, ${j.year})`).join("; ");
    const docRequest = documentNeeded
      ? `Draft a ${documentNeeded} for a case involving ${sections}.`
      : `Draft a legal document for a case involving ${sections}.`;

    const alreadyKnown2 = [
      clientName && `Petitioner/Accused/Client Name: ${clientName}`,
      clientFatherName && `Petitioner/Accused/Client Father Name: ${clientFatherName}`,
      clientCnic && `Petitioner/Accused/Client CNIC: ${clientCnic}`,
      clientAddress && `Petitioner/Accused/Client Address: ${clientAddress}`,
      opponentName && `Respondent/Opponent/Complainant: ${opponentName}`,
      opponentFatherName && `Respondent/Opponent Father Name: ${opponentFatherName}`,
      opponentCnic && `Respondent/Opponent CNIC: ${opponentCnic}`,
      opponentAddress && `Respondent/Opponent Address: ${opponentAddress}`,
      firNo && `FIR/Case No: ${firNo}`,
      policeStation && `Police Station: ${policeStation}`,
      courtName && `Court Name for document heading: ${courtName}`,
      districtName && `District/City for document heading: ${districtName}`,
      facts && `Case Facts: ${facts}`,
    ].filter(Boolean).join("\n");

    const richRequest = `${docRequest}
${alreadyKnown2 ? `\nALREADY PROVIDED — do NOT ask for these again:\n${alreadyKnown2}\n` : ""}
Supporting Judgments for research guidance only: ${citationList || "None"}
Do not add a standalone reliance/citation paragraph such as "In this regard, reliance is placed..." unless the user expressly asks for authorities to be cited.
Court heading policy: Use only the provided Court Name and District/City. Never assume Lahore or any other city.
Client Position: ${result.searchTerms.clientPosition}`;

    const enrichedAnswers = {
      ...answers,
      ...(usable.length > 0 ? {
        research_guidance_from_judgments: usable.map((j) => `${j.citation} — ${j.ratio}`).join("; "),
        citation_policy: "Use these judgments only as drafting guidance. Do not insert a generic reliance paragraph or citation list unless the user expressly asks for authorities.",
      } : {}),
    };

    try {
      const res = await fetch("/api/ai/smart-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "generate", userRequest: richRequest, answers: enrichedAnswers, language }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setGeneratedHtml(data.html);
      setBlankCount(data.blankCount || 0);
      const saved = await saveDocument({
        title: documentType || documentNeeded || "Case Builder Document",
        category: "case-builder",
        subType: "judgment-draft",
        language,
        content: data.html,
      });
      if (saved) setSavedDocId(saved.id);
      setStage("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed");
      setStage("asking");
    }
  };

  const reset = () => {
    setStage("input");
    setResult(null);
    setError(null);
    setSections("");
    setFacts("");
    setDocumentNeeded("");
    setClientName("");
    setClientFatherName("");
    setClientCnic("");
    setClientAddress("");
    setOpponentName("");
    setOpponentFatherName("");
    setOpponentCnic("");
    setOpponentAddress("");
    setFirNo("");
    setPoliceStation("");
    setCourtName("");
    setDistrictName("");
    setCourt("All Courts");
    setDocumentType("");
    setQuestions([]);
    setAnswers({});
    setSectionWarning(null);
    setGeneratedHtml("");
    setSavedDocId(null);
    setBlankCount(0);
    setReviewJudgment(null);
    setChangeJudgmentsOpen(false);
    setJudgmentSearchQuery("");
    setJudgmentSearchResults([]);
    setJudgmentSearchLoading(false);
    setJudgmentSearchPage(1);
    setJudgmentSearchHasMore(false);
    setJudgmentSearchTotal(0);
    setJudgmentSearchRelated(false);
    setSelectedMorePage(0);
    setSelectedMoreLoading(false);
    setSelectedMoreHasMore(true);
    setSelectedMoreRelated(false);
  };

  // ── Render ────────────────────────────────────────────────────────────────

  // Done: document preview
  if (stage === "done" && generatedHtml) {
    return (
      <div className="space-y-4">
        <Button variant="outline" onClick={reset} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> New Research
        </Button>
        {blankCount > 0 && (
          <div className="flex items-start gap-2.5 rounded-lg px-4 py-3 text-sm" style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.25)", color: "#b45309" }}>
            <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>{blankCount} field{blankCount > 1 ? "s" : ""} left blank — fill them in before filing.</span>
          </div>
        )}
        <DocumentPreview
          content={generatedHtml}
          title={documentType || documentNeeded || "Case Builder Document"}
          language={language}
          onContentChange={(c) => { if (savedDocId) void updateDocumentContent(savedDocId, c); }}
        />
      </div>
    );
  }

  // Asking: smart-draft questions form
  if (stage === "asking") {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <button onClick={() => setStage("results")} style={{ color: "var(--text-tertiary)" }}>
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>{documentType}</h1>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              {questions.length > 0 ? `${questions.length} detail${questions.length > 1 ? "s" : ""} needed — rest is pre-filled` : "All details ready"}
            </p>
          </div>
        </div>

        {sectionWarning && (
          <div className="flex items-start gap-2.5 rounded-lg px-4 py-3 text-sm" style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.25)", color: "#b45309" }}>
            <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>{sectionWarning}</span>
          </div>
        )}

        {error && (
          <div className="rounded-lg px-4 py-3 text-sm" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444" }}>
            {error}
          </div>
        )}

        <FilledDetails items={filledDetails} />

        <Card className="p-6 space-y-5">
          {questions.length === 0 ? (
            <div className="space-y-4">
              <p className="text-sm text-center" style={{ color: "var(--text-secondary)" }}>All details collected — ready to generate.</p>
              <Button onClick={handleGenerate} className="w-full flex items-center justify-center gap-2">
                <Sparkles className="h-4 w-4" />
                Generate Document
              </Button>
            </div>
          ) : (
            <>
              {questions.map((q) => (
                <div key={q.id} className="space-y-1.5">
                  <label className="block text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                    {q.label}
                    {q.required && <span style={{ color: "#ef4444" }}> *</span>}
                  </label>
                  {q.id.includes("fact") || q.id.includes("detail") || q.id.includes("ground") || q.id.includes("reason") || q.id.includes("description") ? (
                    <textarea
                      rows={3}
                      value={answers[q.id] || ""}
                      onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))}
                      placeholder={q.placeholder}
                      className="w-full rounded-lg px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary-500/50"
                      style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }}
                    />
                  ) : (
                    <input
                      type="text"
                      value={answers[q.id] || ""}
                      onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))}
                      placeholder={q.placeholder}
                      className="w-full rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500/50"
                      style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }}
                    />
                  )}
                </div>
              ))}

              <Button onClick={handleGenerate} className="w-full flex items-center justify-center gap-2 mt-2">
                <Sparkles className="h-4 w-4" />
                Generate Document
              </Button>
            </>
          )}
        </Card>
      </div>
    );
  }

  // Generating: loading
  if (stage === "generating") {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="p-12">
          <div className="text-center space-y-4">
            <LoadingSpinner size="lg" />
            <p className="font-medium" style={{ color: "var(--text-primary)" }}>Drafting document from case details…</p>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>This may take 15–30 seconds</p>
          </div>
        </Card>
      </div>
    );
  }

  // Results: judgment cards + legal strategy
  if (stage === "results" && result) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button onClick={() => setStage("input")} style={{ color: "var(--text-tertiary)" }}>
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>Research Results</h1>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Found {result.judgments.length} relevant judgment{result.judgments.length !== 1 ? "s" : ""} from {result.totalCandidates} candidates
            </p>
          </div>
        </div>

        {/* Search terms used */}
        <div className="flex flex-wrap gap-2">
          {result.searchTerms.primaryTerms.map((t) => (
            <span key={t} className="px-2.5 py-1 rounded-full text-xs font-medium" style={{ background: "rgba(6,182,212,0.1)", color: "#06b6d4", border: "1px solid rgba(6,182,212,0.2)" }}>
              {t}
            </span>
          ))}
          {result.searchTerms.secondaryTerms.map((t) => (
            <span key={t} className="px-2.5 py-1 rounded-full text-xs font-medium" style={{ background: "var(--bg-surface-2)", color: "var(--text-secondary)", border: "1px solid var(--border-subtle)" }}>
              {t}
            </span>
          ))}
        </div>

        {error && (
          <div className="rounded-lg px-4 py-3 text-sm" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444" }}>
            {error}
          </div>
        )}

        <FilledDetails items={filledDetails} />

        <Card className="p-4 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Selected Judgments</p>
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Review, remove, or add judgments before drafting.</p>
            </div>
            <Button variant="outline" onClick={() => setChangeJudgmentsOpen((open) => !open)} className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Change Judgments
            </Button>
          </div>

          {changeJudgmentsOpen && (
            <div className="space-y-3 pt-3" style={{ borderTop: "1px solid var(--border-subtle)" }}>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={judgmentSearchQuery}
                  onChange={(e) => {
                    setJudgmentSearchQuery(e.target.value);
                    setJudgmentSearchResults([]);
                    setJudgmentSearchPage(1);
                    setJudgmentSearchHasMore(false);
                    setJudgmentSearchTotal(0);
                    setJudgmentSearchRelated(false);
                  }}
                  onKeyDown={(e) => { if (e.key === "Enter") void handleSearchJudgments(); }}
                  placeholder="Search by section, citation, party name, or keyword"
                  className="w-full rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500/50"
                  style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }}
                />
                <Button onClick={() => void handleSearchJudgments()} disabled={judgmentSearchLoading || !judgmentSearchQuery.trim()} className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  {judgmentSearchLoading ? "Searching" : "Search"}
                </Button>
              </div>
              {judgmentSearchResults.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                      Showing {judgmentSearchResults.length}{judgmentSearchTotal ? ` of ${judgmentSearchTotal}` : ""} judgment{judgmentSearchResults.length !== 1 ? "s" : ""}
                      {judgmentSearchRelated ? " (related results)" : ""}
                    </p>
                    {judgmentSearchHasMore && (
                      <button
                        type="button"
                        onClick={handleLoadMoreJudgments}
                        disabled={judgmentSearchLoading}
                        className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition-colors"
                        style={{ background: "var(--bg-surface-2)", color: "var(--text-secondary)", border: "1px solid var(--border-subtle)" }}
                      >
                        {judgmentSearchLoading ? "Loading" : "See more"}
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                  {judgmentSearchResults.map((j) => {
                    const selected = result.judgments.some((picked) => picked.id === j.id);
                    return (
                      <div key={j.id} className="flex items-start justify-between gap-3 rounded-md p-3" style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border-subtle)" }}>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>{j.citation}</p>
                          <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>{j.court} · {j.year}</p>
                          {j.title && <p className="text-xs truncate" style={{ color: "var(--text-secondary)" }}>{j.title}</p>}
                        </div>
                        <Button variant="outline" onClick={() => addJudgmentToResearch(j)} disabled={selected} className="flex items-center gap-2">
                          <Plus className="h-4 w-4" />
                          {selected ? "Added" : "Add"}
                        </Button>
                      </div>
                    );
                  })}
                  {judgmentSearchHasMore && (
                    <Button variant="outline" onClick={handleLoadMoreJudgments} disabled={judgmentSearchLoading} className="w-full flex items-center justify-center gap-2">
                      {judgmentSearchLoading ? "Loading more judgments" : "See more judgments"}
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
        </Card>

        {/* No results */}
        {result.judgments.length === 0 ? (
          <Card className="p-8 text-center space-y-3">
            <BookOpen className="h-10 w-10 mx-auto" style={{ color: "var(--text-tertiary)" }} />
            <p className="font-medium" style={{ color: "var(--text-primary)" }}>No judgments found</p>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{result.legalStrategy}</p>
            <Button variant="outline" onClick={() => setStage("input")}>Try Different Search</Button>
          </Card>
        ) : (
          <>
            {/* Judgment cards */}
            <div className="space-y-3">
              {result.judgments.map((j) => (
                <Card key={j.id} className="p-4 space-y-3" style={{ borderLeft: `3px solid ${j.stance === "favorable" ? "#10b981" : j.stance === "adverse" ? "#ef4444" : "var(--border-default)"}` }}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-0.5">
                      <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{j.citation}</p>
                      <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>{j.court} · {j.year}</p>
                      {j.title && <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{j.title}</p>}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <StanceBadge stance={j.stance} />
                      <div className="flex gap-1.5">
                        <button
                          type="button"
                          onClick={() => void handleReviewJudgment(j)}
                          disabled={reviewLoadingId === j.id}
                          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold transition-colors"
                          style={{ background: "var(--bg-surface-2)", color: "var(--text-secondary)", border: "1px solid var(--border-subtle)" }}
                        >
                          <Eye className="h-3.5 w-3.5" />
                          {reviewLoadingId === j.id ? "Loading" : reviewJudgment?.id === j.id ? "Hide" : "Review"}
                        </button>
                        <button
                          type="button"
                          onClick={() => removeJudgmentFromResearch(j.id)}
                          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold transition-colors"
                          style={{ background: "rgba(239,68,68,0.08)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)" }}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-1" style={{ borderTop: "1px solid var(--border-subtle)" }}>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wide mb-0.5" style={{ color: "var(--text-tertiary)" }}>Why Useful</p>
                      <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{j.reason}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wide mb-0.5" style={{ color: "var(--text-tertiary)" }}>Key Principle</p>
                      <p className="text-sm italic" style={{ color: "var(--text-secondary)" }}>{j.ratio}</p>
                    </div>
                  </div>

                  {reviewJudgment?.id === j.id && (
                    <div className="space-y-2 rounded-md p-3" style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border-subtle)" }}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: "var(--text-tertiary)" }}>Judgment Review</p>
                          <p className="truncate text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{reviewJudgment.title}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setReviewJudgment(null)}
                          className="h-7 w-7 rounded-md flex items-center justify-center transition-colors"
                          style={{ color: "var(--text-tertiary)", background: "var(--bg-surface-1)", border: "1px solid var(--border-subtle)" }}
                          aria-label="Close judgment review"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="max-h-80 overflow-y-auto whitespace-pre-wrap text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                        {reviewJudgment.content.slice(0, 6000)}
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>

            {selectedMoreHasMore && (
              <Button
                variant="outline"
                onClick={() => void handleLoadMoreSelectedJudgments()}
                disabled={selectedMoreLoading}
                className="w-full flex items-center justify-center gap-2"
              >
                {selectedMoreLoading ? "Loading more judgments" : "See more related judgments"}
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}

            {/* Legal strategy */}
            <Card className="p-4" style={{ background: "rgba(6,182,212,0.04)", borderColor: "rgba(6,182,212,0.2)" }}>
              <div className="flex items-start gap-3">
                <Scale className="h-5 w-5 mt-0.5 flex-shrink-0" style={{ color: "#06b6d4" }} />
                <div>
                  <p className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Legal Strategy</p>
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{result.legalStrategy}</p>
                </div>
              </div>
            </Card>

            {/* Language + Draft button */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setLanguage("en")}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={language === "en" ? { background: "rgba(6,182,212,0.15)", color: "#06b6d4", border: "1px solid rgba(6,182,212,0.3)" } : { background: "var(--bg-surface-2)", color: "var(--text-secondary)", border: "1px solid var(--border-default)" }}
                >
                  English
                </button>
                <button
                  onClick={() => setLanguage("ur")}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={language === "ur" ? { background: "rgba(6,182,212,0.15)", color: "#06b6d4", border: "1px solid rgba(6,182,212,0.3)" } : { background: "var(--bg-surface-2)", color: "var(--text-secondary)", border: "1px solid var(--border-default)" }}
                >
                  اردو
                </button>
              </div>
              <Button onClick={handleDraftWithJudgments} className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Draft {documentNeeded || "Document"} Using This Research
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </div>
    );
  }

  // Researching: loading state
  if (stage === "researching") {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="p-12">
          <div className="text-center space-y-5">
            <LoadingSpinner size="lg" />
            <div className="space-y-2">
              <p className="font-medium" style={{ color: "var(--text-primary)" }}>Researching judgments…</p>
              <div className="space-y-1.5 text-sm" style={{ color: "var(--text-secondary)" }}>
                <p>Extracting search terms from case details</p>
                <p>Searching all Pakistani judgments in database</p>
                <p>AI analyzing most relevant results</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Input stage (default)
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Page header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(6,182,212,0.15)" }}>
            <Search className="h-4 w-4" style={{ color: "#06b6d4" }} />
          </div>
          <h1 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>Case Builder</h1>
        </div>
        <p className="text-sm pl-0.5" style={{ color: "var(--text-secondary)" }}>
          Enter your case details — AI will find relevant judgments and draft your document.
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-2.5 rounded-lg px-4 py-3 text-sm" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444" }}>
          <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          {error}
        </div>
      )}

      <Card className="p-6 space-y-6">

        {/* ── Section A: Case Identification ── */}
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest mb-3 pb-1.5" style={{ color: "var(--text-tertiary)", borderBottom: "1px solid var(--border-subtle)" }}>Case Identification</p>
          <div className="space-y-4">

            {/* Law sections / case type */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                Law Section(s) / Case Type <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <input
                type="text"
                value={sections}
                onChange={(e) => setSections(e.target.value)}
                placeholder="e.g. 489-F PPC / 497 CrPC / custody / maintenance"
                className="w-full rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500/50"
                style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }}
              />
              <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>Use sections with law name, or a short case type if section is not known.</p>
            </div>

            {/* FIR No + Police Station */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium" style={{ color: "var(--text-primary)" }}>FIR / Case No. <span style={{ color: "var(--text-tertiary)", fontWeight: 400 }}>(optional)</span></label>
                <input
                  type="text"
                  value={firNo}
                  onChange={(e) => setFirNo(e.target.value)}
                  placeholder="e.g. 123/2024 or Crl. A. 45/2023"
                  className="w-full rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500/50"
                  style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }}
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium" style={{ color: "var(--text-primary)" }}>Police Station <span style={{ color: "var(--text-tertiary)", fontWeight: 400 }}>(optional)</span></label>
                <input
                  type="text"
                  value={policeStation}
                  onChange={(e) => setPoliceStation(e.target.value)}
                  placeholder="e.g. PS City, Faisalabad"
                  className="w-full rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500/50"
                  style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium" style={{ color: "var(--text-primary)" }}>Court Name <span style={{ color: "var(--text-tertiary)", fontWeight: 400 }}>(for heading)</span></label>
                <input
                  type="text"
                  value={courtName}
                  onChange={(e) => setCourtName(e.target.value)}
                  placeholder="e.g. Court of Sessions Judge"
                  className="w-full rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500/50"
                  style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }}
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium" style={{ color: "var(--text-primary)" }}>District / City <span style={{ color: "var(--text-tertiary)", fontWeight: 400 }}>(for heading)</span></label>
                <input
                  type="text"
                  value={districtName}
                  onChange={(e) => setDistrictName(e.target.value)}
                  placeholder="e.g. Faisalabad / Multan / Sahiwal"
                  className="w-full rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500/50"
                  style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Section B: Parties ── */}
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest mb-3 pb-1.5" style={{ color: "var(--text-tertiary)", borderBottom: "1px solid var(--border-subtle)" }}>Parties <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(optional)</span></p>
          <div className="space-y-3">
            <div className="grid gap-3 md:grid-cols-2">
              <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-tertiary)" }}>Client / Petitioner / Accused</p>
              <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-tertiary)" }}>Opponent / Respondent / Complainant</p>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium" style={{ color: "var(--text-primary)" }}>Name</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. Muhammad Aslam"
                  className="w-full rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500/50"
                  style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }}
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium" style={{ color: "var(--text-primary)" }}>Name</label>
                <input
                  type="text"
                  value={opponentName}
                  onChange={(e) => setOpponentName(e.target.value)}
                  placeholder="e.g. State / Tariq Mehmood"
                  className="w-full rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500/50"
                  style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }}
                />
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium" style={{ color: "var(--text-primary)" }}>Father Name</label>
                <input
                  type="text"
                  value={clientFatherName}
                  onChange={(e) => setClientFatherName(e.target.value)}
                  placeholder="e.g. Muhammad Ali"
                  className="w-full rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500/50"
                  style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }}
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium" style={{ color: "var(--text-primary)" }}>Father Name</label>
                <input
                  type="text"
                  value={opponentFatherName}
                  onChange={(e) => setOpponentFatherName(e.target.value)}
                  placeholder="e.g. Muhammad Yousaf"
                  className="w-full rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500/50"
                  style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }}
                />
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium" style={{ color: "var(--text-primary)" }}>CNIC</label>
                <input
                  type="text"
                  value={clientCnic}
                  onChange={(e) => setClientCnic(e.target.value)}
                  placeholder="e.g. 35201-1234567-1"
                  className="w-full rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500/50"
                  style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }}
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium" style={{ color: "var(--text-primary)" }}>CNIC</label>
                <input
                  type="text"
                  value={opponentCnic}
                  onChange={(e) => setOpponentCnic(e.target.value)}
                  placeholder="e.g. 35202-1234567-1"
                  className="w-full rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500/50"
                  style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }}
                />
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium" style={{ color: "var(--text-primary)" }}>Address</label>
                <input
                  type="text"
                  value={clientAddress}
                  onChange={(e) => setClientAddress(e.target.value)}
                  placeholder="e.g. House 12, Civil Lines, Faisalabad"
                  className="w-full rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500/50"
                  style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }}
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium" style={{ color: "var(--text-primary)" }}>Address</label>
                <input
                  type="text"
                  value={opponentAddress}
                  onChange={(e) => setOpponentAddress(e.target.value)}
                  placeholder="e.g. House 20, Cantt Road, Multan"
                  className="w-full rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500/50"
                  style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Section C: Case Details ── */}
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest mb-3 pb-1.5" style={{ color: "var(--text-tertiary)", borderBottom: "1px solid var(--border-subtle)" }}>Case Details</p>
          <div className="space-y-4">

            {/* Case facts */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                Case Facts <span style={{ color: "var(--text-tertiary)", fontWeight: 400 }}>(optional — blank fields will appear as ___ in draft)</span>
              </label>
              <textarea
                rows={4}
                value={facts}
                onChange={(e) => setFacts(e.target.value)}
                placeholder={`Include the facts you know:\n• What happened and when\n• Parties involved\n• FIR/case/order details, if any\n• Important documents or dates\n• Your side's main grounds\n• Relief you want from the court`}
                className="w-full rounded-lg px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary-500/50"
                style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }}
              />
              <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>More detail = better judgment matching and stronger draft</p>
            </div>

            {/* Document type */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Document Needed</label>
              <input
                type="text"
                value={documentNeeded}
                onChange={(e) => setDocumentNeeded(e.target.value)}
                placeholder="e.g. Bail Application, Written Statement, Writ Petition, Legal Notice, Appeal"
                list="doc-types"
                className="w-full rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500/50"
                style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }}
              />
              <datalist id="doc-types">
                {DOCUMENT_TYPES.map((d) => <option key={d} value={d} />)}
              </datalist>
            </div>

            {/* Court filter + Language */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-tertiary)" }}>Search Judgments From</label>
                <select
                  value={court}
                  onChange={(e) => setCourt(e.target.value)}
                  className="w-full rounded-lg px-3 py-2.5 text-sm focus:outline-none"
                  style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border-default)", color: "var(--text-secondary)" }}
                >
                  {COURTS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-tertiary)" }}>Draft Language</label>
                <div className="flex gap-2 pt-0.5">
                  <button
                    onClick={() => setLanguage("en")}
                    className="flex-1 py-2 rounded-lg text-sm font-medium transition-colors"
                    style={language === "en" ? { background: "rgba(6,182,212,0.15)", color: "#06b6d4", border: "1px solid rgba(6,182,212,0.3)" } : { background: "var(--bg-surface-2)", color: "var(--text-secondary)", border: "1px solid var(--border-default)" }}
                  >
                    English
                  </button>
                  <button
                    onClick={() => setLanguage("ur")}
                    className="flex-1 py-2 rounded-lg text-sm font-medium transition-colors"
                    style={language === "ur" ? { background: "rgba(6,182,212,0.15)", color: "#06b6d4", border: "1px solid rgba(6,182,212,0.3)" } : { background: "var(--bg-surface-2)", color: "var(--text-secondary)", border: "1px solid var(--border-default)" }}
                  >
                    اردو
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleResearch}
          disabled={!sections.trim()}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: "linear-gradient(135deg, #06b6d4, #7c3aed)",
            color: "white",
            boxShadow: sections.trim() ? "0 0 20px rgba(6,182,212,0.3)" : "none",
          }}
        >
          <Sparkles className="h-4 w-4" />
          Research Judgments & Build Case
        </button>
      </Card>

      {/* How it works */}
      <Card className="p-4" style={{ background: "var(--bg-surface-1)", borderColor: "var(--border-subtle)" }}>
        <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "var(--text-tertiary)" }}>How It Works</p>
        <div className="space-y-2.5">
          {[
            { icon: Search, text: "AI extracts keywords and searches all Pakistani judgments" },
            { icon: Scale, text: "Selects the 5 most relevant judgments with favorable/adverse analysis" },
            { icon: FileText, text: "Drafts your document using the research without adding blanket reliance lines" },
          ].map(({ icon: Icon, text }, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: "rgba(6,182,212,0.1)" }}>
                <Icon className="h-3.5 w-3.5" style={{ color: "#06b6d4" }} />
              </div>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{text}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
