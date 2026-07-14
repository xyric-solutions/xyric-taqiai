"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { saveDocument, updateDocumentContent } from "@/lib/document-store";
import DocumentPreview from "@/components/documents/DocumentPreview";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import AutoGrowTextarea from "@/components/ui/AutoGrowTextarea";
import {
  Sparkles, ArrowLeft, ArrowRight, Paperclip, X,
  Image as ImageIcon, FileText as FileIcon, RefreshCw, Send,
  Mic, MicOff, Camera,
} from "lucide-react";
import { DOCUMENT_SUGGESTIONS, getDocSuggestions } from "@/lib/document-suggestions";

type Stage = "input" | "asking" | "confirm" | "generating" | "done";

interface Question {
  id: string;
  label: string;
  placeholder: string;
  required: boolean;
}

// Voice ("Speak") is only useful for long, narrative fields (facts, grounds,
// reasons, descriptions, etc.) — not for short identity fields like name,
// father's name, CNIC or address. Show the mic only when the field looks like
// a detail/narrative field.
const VOICE_FIELD_HINTS = [
  "detail", "description", "fact", "ground", "reason", "statement",
  "particular", "prayer", "relief", "dispute", "evidence", "complaint",
  "circumstance", "settlement", "violation", "narrat", "background",
  "summary", "justification", "schedule", "term", "brief", "remark",
  "explanation", "clause", "history", "argument", "submission",
  "تفصیل", "وجہ", "حقائق", "بنیاد",
];

function isVoiceField(q: { id: string; label: string }): boolean {
  const hay = `${q.id} ${q.label}`.toLowerCase();
  return VOICE_FIELD_HINTS.some((h) => hay.includes(h));
}

interface AttachedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  preview?: string;
}

const DRAFT_STORAGE_VERSION = 1;
const DRAFT_STORAGE_PREFIX = "taqi-ai-smart-draft";

interface PersistedSmartDraft {
  version: number;
  savedAt: number;
  category: string;
  stage: Stage;
  userRequest: string;
  extraInstructions: string;
  language: string;
  documentType: string;
  documentTypeUrdu: string;
  questions: Question[];
  answers: Record<string, string>;
  sectionWarning: string | null;
  sectionWarningDismissed: boolean;
  generatedHtml: string;
  savedDocId: string | null;
  draftTitle: string;
  blankCount: number;
  moreInstruction: string;
  extractedContext: string;
}

function getRestorableStage(draft: PersistedSmartDraft): Stage {
  if (draft.stage === "done" && draft.generatedHtml.trim()) return "done";
  if (draft.stage === "asking" || draft.stage === "confirm") return draft.stage;
  return "input";
}

function hasPersistableDraft(draft: PersistedSmartDraft): boolean {
  return Boolean(
    draft.userRequest.trim() ||
    draft.extraInstructions.trim() ||
    draft.generatedHtml.trim() ||
    draft.moreInstruction.trim() ||
    draft.extractedContext.trim() ||
    draft.questions.length > 0 ||
    Object.values(draft.answers).some((value) => value.trim())
  );
}

interface SmartDraftPageProps {
  title: string;
  titleUrdu: string;
  description: string;
  category: string;
  quickExamples: string[];
  placeholder: string;
}

function getFriendlyGenerationError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error || "");
  const lower = message.toLowerCase();

  if (lower.includes("quota") || lower.includes("429") || lower.includes("exhausted")) {
    return "AI quota exhausted. Please wait a moment and try again.";
  }

  if (
    lower.includes("fetch failed") ||
    lower.includes("generativelanguage.googleapis.com") ||
    lower.includes("network") ||
    lower.includes("econnreset") ||
    lower.includes("etimedout") ||
    lower.includes("timeout") ||
    lower.includes("503") ||
    lower.includes("overloaded") ||
    lower.includes("service unavailable")
  ) {
    return "The AI service is temporarily unavailable. Please check your internet connection and try again.";
  }

  if (lower.includes("api key") || lower.includes("api_key") || lower.includes("401") || lower.includes("403")) {
    return "Gemini API key is invalid. Please check the API key and try again.";
  }

  return message || "Document generation failed. Please try again.";
}

export default function SmartDraftPage({
  title,
  titleUrdu,
  description,
  category,
  quickExamples,
  placeholder,
}: SmartDraftPageProps) {
  const [stage, setStage] = useState<Stage>("input");
  const [userRequest, setUserRequest] = useState("");
  const [extraInstructions, setExtraInstructions] = useState("");
  const [language, setLanguage] = useState("en");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // affidavit + agreement: hide camera & file attach, but keep mic on input stage
  const showMediaFeatures = !["affidavit", "agreement"].includes(category);
  const showMic = true; // mic available on all categories on input stage

  // file attachment state
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [extracting, setExtracting] = useState(false);
  const [extractedContext, setExtractedContext] = useState("");
  const fileInputRef   = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // asking stage
  const [documentType, setDocumentType] = useState("");
  const [documentTypeUrdu, setDocumentTypeUrdu] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [sectionWarning, setSectionWarning] = useState<string | null>(null);
  const [sectionWarningDismissed, setSectionWarningDismissed] = useState(false);

  // done stage
  const [generatedHtml, setGeneratedHtml] = useState("");
  const [savedDocId, setSavedDocId] = useState<string | null>(null);
  const [draftTitle, setDraftTitle] = useState("");
  const [blankCount, setBlankCount] = useState(0);
  const savedDocIdRef = useRef<string | null>(null);
  const latestGeneratedHtmlRef = useRef("");
  const documentSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [draftStorageKey, setDraftStorageKey] = useState<string | null>(null);
  const [draftHydrated, setDraftHydrated] = useState(false);

  // "More changes" bar
  const [moreInstruction, setMoreInstruction] = useState("");
  const [moreLoading, setMoreLoading] = useState(false);
  const [moreError, setMoreError] = useState("");

  // Autocomplete
  const [suggestions, setSuggestions] = useState<typeof DOCUMENT_SUGGESTIONS>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionIdx, setSuggestionIdx] = useState(-1);
  const [debouncedRequest, setDebouncedRequest] = useState("");
  // After a suggestion is picked, suppress the dropdown until the user types again
  const justSelectedRef = useRef(false);
  // Whether the draft box is currently focused — empty-input browsing only opens on focus
  const inputFocusedRef = useRef(false);

  // ── Voice input state ──
  const [voiceTarget, setVoiceTarget] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  // ── Same Typing (affidavit + agreement only) ──
  const [sameTypingPreview, setSameTypingPreview] = useState<string | null>(null);
  const [sameTypingLoading, setSameTypingLoading] = useState(false);
  const sameTypingInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    savedDocIdRef.current = savedDocId;
  }, [savedDocId]);

  useEffect(() => {
    latestGeneratedHtmlRef.current = generatedHtml;
  }, [generatedHtml]);

  useEffect(() => {
    return () => {
      if (documentSaveTimerRef.current) {
        clearTimeout(documentSaveTimerRef.current);
      }

      const docId = savedDocIdRef.current;
      const html = latestGeneratedHtmlRef.current;
      if (docId && html.trim()) {
        void updateDocumentContent(docId, html);
      }
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function resolveDraftOwner() {
      let owner = "guest";
      try {
        const res = await fetch("/api/auth/session", { credentials: "include" });
        if (res.ok) {
          const data = await res.json() as { user?: { id?: string; email?: string } | null };
          owner = data.user?.id || data.user?.email || owner;
        }
      } catch {
        // Offline or unauthenticated users still get local draft recovery.
      }

      if (!cancelled) {
        setDraftStorageKey(`${DRAFT_STORAGE_PREFIX}:${category}:${owner}`);
      }
    }

    void resolveDraftOwner();
    return () => { cancelled = true; };
  }, [category]);

  useEffect(() => {
    if (!draftStorageKey || draftHydrated) return;

    let restored = false;
    try {
      const raw = localStorage.getItem(draftStorageKey);
      if (raw) {
        const draft = JSON.parse(raw) as PersistedSmartDraft;
        if (
          draft.version === DRAFT_STORAGE_VERSION &&
          draft.category === category &&
          hasPersistableDraft(draft)
        ) {
          setStage(getRestorableStage(draft));
          setUserRequest(draft.userRequest || "");
          setExtraInstructions(draft.extraInstructions || "");
          setLanguage(draft.language || "en");
          setDocumentType(draft.documentType || "");
          setDocumentTypeUrdu(draft.documentTypeUrdu || "");
          setQuestions(Array.isArray(draft.questions) ? draft.questions : []);
          setAnswers(draft.answers || {});
          setSectionWarning(draft.sectionWarning || null);
          setSectionWarningDismissed(Boolean(draft.sectionWarningDismissed));
          setGeneratedHtml(draft.generatedHtml || "");
          latestGeneratedHtmlRef.current = draft.generatedHtml || "";
          setSavedDocId(draft.savedDocId || null);
          savedDocIdRef.current = draft.savedDocId || null;
          setDraftTitle(draft.draftTitle || "");
          setBlankCount(draft.blankCount || 0);
          setMoreInstruction(draft.moreInstruction || "");
          setExtractedContext(draft.extractedContext || "");
          setLoading(false);
          setError(null);
          restored = true;
        }
      }
    } catch {
      localStorage.removeItem(draftStorageKey);
    }

    if (!restored) {
      const draft = new URLSearchParams(window.location.search).get("draft");
      if (draft) {
        justSelectedRef.current = true; // it's a chosen document, don't pop the dropdown
        setUserRequest(draft);
      }
    }

    setDraftHydrated(true);
  }, [category, draftHydrated, draftStorageKey]);

  const buildDraftSnapshot = useCallback((): PersistedSmartDraft => ({
    version: DRAFT_STORAGE_VERSION,
    savedAt: Date.now(),
    category,
    stage,
    userRequest,
    extraInstructions,
    language,
    documentType,
    documentTypeUrdu,
    questions,
    answers,
    sectionWarning,
    sectionWarningDismissed,
    generatedHtml,
    savedDocId,
    draftTitle,
    blankCount,
    moreInstruction,
    extractedContext,
  }), [
    answers,
    blankCount,
    category,
    documentType,
    documentTypeUrdu,
    draftTitle,
    extraInstructions,
    extractedContext,
    generatedHtml,
    language,
    moreInstruction,
    questions,
    savedDocId,
    sectionWarning,
    sectionWarningDismissed,
    stage,
    userRequest,
  ]);

  const persistDraftSnapshot = useCallback(() => {
    if (!draftStorageKey || !draftHydrated) return;

    const draft = buildDraftSnapshot();
    try {
      if (hasPersistableDraft(draft)) {
        localStorage.setItem(draftStorageKey, JSON.stringify(draft));
      } else {
        localStorage.removeItem(draftStorageKey);
      }
    } catch {
      // If storage is full, the database save still protects generated documents.
    }
  }, [buildDraftSnapshot, draftHydrated, draftStorageKey]);

  useEffect(() => {
    persistDraftSnapshot();
  }, [persistDraftSnapshot]);

  useEffect(() => {
    if (!draftHydrated) return;
    window.addEventListener("pagehide", persistDraftSnapshot);
    return () => window.removeEventListener("pagehide", persistDraftSnapshot);
  }, [draftHydrated, persistDraftSnapshot]);

  // ── Voice helpers ──
  const startVoice = (targetId: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      alert("Voice input is not supported in this browser.\nPlease use Google Chrome or Microsoft Edge.");
      return;
    }
    const rec = new SpeechRecognitionAPI();
    rec.lang = language === "ur" ? "ur-PK" : "en-US";
    rec.continuous = true;
    rec.interimResults = false;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rec.onresult = (event: any) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) transcript += event.results[i][0].transcript + " ";
      }
      if (!transcript) return;
      if (targetId === "request") {
        setUserRequest((prev) => prev + transcript);
        handleRequestChange((userRequest + transcript));
      } else {
        setAnswers((prev) => ({ ...prev, [targetId]: (prev[targetId] || "") + transcript }));
      }
    };

    rec.onend  = () => setVoiceTarget(null);
    rec.onerror = () => setVoiceTarget(null);

    recognitionRef.current = rec;
    rec.start();
    setVoiceTarget(targetId);
  };

  const stopVoice = () => {
    recognitionRef.current?.stop();
    setVoiceTarget(null);
  };

  const toggleVoice = (targetId: string) => {
    if (voiceTarget === targetId) {
      stopVoice();
    } else if (voiceTarget !== null) {
      stopVoice();
      setTimeout(() => startVoice(targetId), 250);
    } else {
      startVoice(targetId);
    }
  };

  // Inline mic button used in both stages
  const MicBtn = ({ targetId, small = false }: { targetId: string; small?: boolean }) => {
    const active = voiceTarget === targetId;
    return (
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => toggleVoice(targetId)}
        title={active ? "Stop recording" : `Speak in ${language === "ur" ? "Urdu" : "English"}`}
        className={`flex items-center gap-1 rounded-lg font-medium transition-all border flex-shrink-0
          ${small ? "px-2 py-1 text-[11px]" : "px-2.5 py-1.5 text-xs"}
          ${active
            ? "bg-red-500 text-white border-red-500 animate-pulse"
            : "bg-[var(--bg-surface-2)] text-[var(--text-secondary)] hover:bg-primary-50 hover:text-primary-700 border-[var(--border-default)] hover:border-primary-300"
          }`}
      >
        {active
          ? <><MicOff className="h-3.5 w-3.5" /> Stop</>
          : <><Mic    className="h-3.5 w-3.5" /> Speak</>
        }
      </button>
    );
  };

  // ── Autocomplete debounce ──
  // Suggestions are a local in-memory filter, so keep the delay tiny for instant feel
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedRequest(userRequest), 60);
    return () => clearTimeout(timer);
  }, [userRequest]);

  useEffect(() => {
    // Don't re-open the dropdown right after the user picked a suggestion
    if (justSelectedRef.current) {
      justSelectedRef.current = false;
      return;
    }
    const matches = getDocSuggestions(debouncedRequest, category);
    setSuggestions(matches);
    // Empty-input browsing should only pop open while the box is focused — never on mount
    const hasQuery = debouncedRequest.trim().length >= 2;
    setShowSuggestions(matches.length > 0 && (hasQuery || inputFocusedRef.current));
    setSuggestionIdx(-1);
  }, [debouncedRequest, category]);

  const handleRequestChange = useCallback((val: string) => {
    // Real typing always re-enables suggestions
    justSelectedRef.current = false;
    setUserRequest(val);
  }, []);

  const selectSuggestion = (doc: typeof DOCUMENT_SUGGESTIONS[0]) => {
    justSelectedRef.current = true;
    setUserRequest(doc.label);
    setDebouncedRequest(doc.label);
    setSuggestions([]);
    setShowSuggestions(false);
    setSuggestionIdx(-1);
  };

  const reset = () => {
    if (draftStorageKey) {
      localStorage.removeItem(draftStorageKey);
    }
    if (documentSaveTimerRef.current) {
      clearTimeout(documentSaveTimerRef.current);
      documentSaveTimerRef.current = null;
    }
    setStage("input");
    setUserRequest("");
    setGeneratedHtml("");
    setSavedDocId(null);
    savedDocIdRef.current = null;
    latestGeneratedHtmlRef.current = "";
    setDraftTitle("");
    setDocumentType("");
    setDocumentTypeUrdu("");
    setAnswers({});
    setQuestions([]);
    setError(null);
    setAttachedFiles([]);
    setExtractedContext("");
    setExtraInstructions("");
    setMoreInstruction("");
    setMoreError("");
    setSameTypingPreview(null);
    setSectionWarning(null);
    setSectionWarningDismissed(false);
    setBlankCount(0);
    stopVoice();
  };

  // ── Same Typing handler: extract text from image → generate clean typed document ──
  const handleSameTyping = async () => {
    if (!sameTypingPreview) return;
    setSameTypingLoading(true);
    setError(null);
    try {
      // Step 1: Extract all text from the image
      const extractRes = await fetch("/api/ai/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: "Extract ALL text from this document image exactly as written. Include every word, name, CNIC number, date, amount, and legal text. Return only the raw extracted text with no commentary.",
          history: [],
          image: sameTypingPreview,
        }),
      });
      const extractData = await extractRes.json();
      const extractedText = extractData.response || "";
      if (!extractedText.trim()) throw new Error("Could not read text from the image. Please ensure the image is clear.");

      // Step 2: Generate a clean professionally typed version
      const genRes = await fetch("/api/ai/smart-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generate",
          userRequest: `Retype this document in clean professional typed format in English. Reproduce the SAME document exactly — same content, same structure, same names, numbers and legal text — but formatted as a proper typed legal document with correct HTML. Do not add, remove, or change any content. Document text extracted from image:\n\n${extractedText}`,
          answers: {},
          language: "en",
        }),
      });
      const genData = await genRes.json();
      if (!genRes.ok) throw new Error(genData.error || "Could not generate typed document");
      await saveAndShowDocument(genData.html, "Typed Document");
    } catch (err) {
      setError(getFriendlyGenerationError(err));
    } finally {
      setSameTypingLoading(false);
    }
  };

  // ── File attachment helpers ──
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      if (file.size > 10 * 1024 * 1024) { alert(`${file.name} is too large (max 10MB)`); return; }
      const newFile: AttachedFile = { id: Math.random().toString(36).slice(2), name: file.name, size: file.size, type: file.type };
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          newFile.preview = ev.target?.result as string;
          setAttachedFiles((prev) => [...prev, newFile]);
        };
        reader.readAsDataURL(file);
      } else {
        setAttachedFiles((prev) => [...prev, newFile]);
      }
    });
    if (e.target) e.target.value = "";
  };

  const removeFile = (id: string) => setAttachedFiles((prev) => prev.filter((f) => f.id !== id));
  const formatSize  = (bytes: number) => bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(0)}KB` : `${(bytes / (1024 * 1024)).toFixed(1)}MB`;

  const extractFromImages = async () => {
    const images = attachedFiles.filter((f) => f.type.startsWith("image/") && f.preview);
    if (!images.length) return;
    setExtracting(true);
    try {
      const results: string[] = [];
      for (const img of images) {
        const res = await fetch("/api/ai/advisor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: "Extract all legal information from this document image: party names, case numbers, dates, FIR numbers, court names, amounts, facts, and any other relevant legal details. Give a structured summary.",
            history: [],
            image: img.preview,
          }),
        });
        if (!res.ok) continue;
        const data = await res.json();
        if (data.response) results.push(`[From ${img.name}]\n${data.response}`);
      }
      if (results.length) setExtractedContext(results.join("\n\n"));
    } catch {
      alert("Could not extract from image. Please describe the case manually.");
    } finally {
      setExtracting(false);
    }
  };

  // ── Main flow ──
  const handleAnalyze = async () => {
    if (!userRequest.trim()) return;
    setLoading(true);
    setError(null);
    stopVoice();
    const baseRequest = extraInstructions.trim()
      ? `${userRequest}\n\nExtra instructions / Special clauses to include:\n${extraInstructions}`
      : userRequest;
    const fullRequest = extractedContext
      ? `${baseRequest}\n\nAdditional context from attached documents:\n${extractedContext}`
      : baseRequest;
    try {
      const res = await fetch("/api/ai/smart-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "analyze", userRequest: fullRequest, language }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      if (data.action === "generated") {
        setBlankCount(data.blankCount || 0);
        await saveAndShowDocument(data.html, data.documentType || userRequest.slice(0, 60));
      } else if (data.action === "ask") {
        setDocumentType(data.documentType || "");
        setDocumentTypeUrdu(data.documentTypeUrdu || "");
        setQuestions(data.questions || []);
        if (data.extractedInfo) setAnswers(data.extractedInfo);
        if (data.sectionWarning) { setSectionWarning(data.sectionWarning); setSectionWarningDismissed(false); }
        setStage("asking");
      }
    } catch (err) {
      setError(getFriendlyGenerationError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setStage("generating");
    stopVoice();
    const baseRequest = extraInstructions.trim()
      ? `${userRequest}\n\nExtra instructions / Special clauses to include:\n${extraInstructions}`
      : userRequest;
    const fullRequest = extractedContext
      ? `${baseRequest}\n\nAdditional context from attached documents:\n${extractedContext}`
      : baseRequest;
    try {
      const res = await fetch("/api/ai/smart-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "generate", userRequest: fullRequest, answers, language }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setBlankCount(data.blankCount || 0);
      await saveAndShowDocument(data.html, documentType || userRequest.slice(0, 60));
    } catch (err) {
      setError(getFriendlyGenerationError(err));
      setStage("asking");
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratedContentChange = useCallback((html: string) => {
    setGeneratedHtml(html);
    latestGeneratedHtmlRef.current = html;

    if (documentSaveTimerRef.current) {
      clearTimeout(documentSaveTimerRef.current);
    }

    documentSaveTimerRef.current = setTimeout(() => {
      const docId = savedDocIdRef.current;
      const latestHtml = latestGeneratedHtmlRef.current;
      if (docId && latestHtml.trim()) {
        void updateDocumentContent(docId, latestHtml);
      }
    }, 500);
  }, []);

  const saveAndShowDocument = async (html: string, docTitle: string) => {
    setGeneratedHtml(html);
    latestGeneratedHtmlRef.current = html;
    setDraftTitle(docTitle);
    const saved = await saveDocument({ title: docTitle, category, subType: "smart-draft", language, content: html });
    if (saved) {
      setSavedDocId(saved.id);
      savedDocIdRef.current = saved.id;
    }
    setStage("done");
  };

  const handleMoreChanges = async () => {
    if (!moreInstruction.trim() || !generatedHtml) return;
    setMoreLoading(true);
    setMoreError("");
    try {
      const res = await fetch("/api/ai/edit-document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentContent: generatedHtml, editInstruction: moreInstruction, language }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Edit failed");
      const newHtml = data.html || data.text || data.response || generatedHtml;
      setGeneratedHtml(newHtml);
      latestGeneratedHtmlRef.current = newHtml;
      if (savedDocId) await updateDocumentContent(savedDocId, newHtml);
      setMoreInstruction("");
    } catch (err) {
      setMoreError(err instanceof Error ? err.message : "Could not apply changes");
    } finally {
      setMoreLoading(false);
    }
  };

  // ── STAGES ──

  if (stage === "done") {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={reset}>
            <ArrowLeft className="h-4 w-4" /> New Document
          </Button>
          {(draftTitle || documentType) && <span className="text-[var(--text-tertiary)] text-sm">{draftTitle || documentType}</span>}
        </div>

        <DocumentPreview
          content={generatedHtml}
          title={draftTitle || documentType || title}
          language={language}
          onContentChange={handleGeneratedContentChange}
        />
        <Card className="p-4 space-y-3">
          <p className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary-500" />
            Want to add or change something?
          </p>
          <div className="flex gap-2">
            <textarea
              value={moreInstruction}
              onChange={(e) => setMoreInstruction(e.target.value)}
              placeholder="e.g. Add more grounds for bail... Change the prayer clause... Add Section 497(2) reference... Make it shorter..."
              rows={2}
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface-2)] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm resize-none"
              onKeyDown={(e) => { if (e.key === "Enter" && e.ctrlKey) void handleMoreChanges(); }}
            />
            <Button onClick={handleMoreChanges} loading={moreLoading} disabled={moreLoading || !moreInstruction.trim()} size="sm" className="self-end">
              <Send className="h-4 w-4" /> Update
            </Button>
          </div>
          {moreError && <p className="text-xs text-red-600">{moreError}</p>}
          <p className="text-xs text-[var(--text-tertiary)]">Ctrl+Enter to apply • Describe the change in plain words</p>
        </Card>
      </div>
    );
  }

  if (stage === "generating") {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="p-12 text-center space-y-4">
          <LoadingSpinner size="lg" />
          <p className="text-[var(--text-secondary)] font-medium">Generating your document...</p>
          <p className="text-sm text-[var(--text-tertiary)]" dir="rtl">دستاویز تیار کی جا رہی ہے...</p>
        </Card>
      </div>
    );
  }

  // ── ASKING STAGE ──
  if (stage === "asking") {
    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        <div className="flex items-center gap-3">
          <button onClick={() => { stopVoice(); setStage("input"); }} className="text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-[var(--text-primary)]">{documentType || title}</h1>
            {documentTypeUrdu && <p className="text-sm text-[var(--text-tertiary)] mt-0.5" dir="rtl">{documentTypeUrdu}</p>}
          </div>
        </div>

        {/* Voice status bar — only for categories that support voice */}
        {showMediaFeatures && voiceTarget && voiceTarget !== "request" && (
          <div className="flex items-center gap-2 px-4 py-2.5 bg-red-50 border border-red-200 rounded-xl">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-sm text-red-700 font-medium">
              Listening in {language === "ur" ? "Urdu" : "English"}... Speak now
            </span>
            <button onClick={stopVoice} className="ml-auto text-xs text-red-600 underline">Stop</button>
          </div>
        )}

        <Card className="p-6 space-y-5">
          <div className="flex items-start gap-3 bg-primary-50 rounded-xl p-3.5">
            <Sparkles className="h-4 w-4 text-primary-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-primary-700 font-medium">A little more information is needed — please fill in these fields:</p>
          </div>

          {/* Section Warning */}
          {sectionWarning && !sectionWarningDismissed && (
            <div className="flex items-start gap-3 bg-warning-500/10 border border-warning-500/30 rounded-xl p-3.5">
              <span className="text-warning-500 text-base flex-shrink-0">⚠️</span>
              <div className="flex-1 space-y-2">
                <p className="text-sm text-warning-500 font-medium">{sectionWarning}</p>
                <button
                  onClick={() => setSectionWarningDismissed(true)}
                  className="text-xs text-warning-500 underline hover:text-warning-500"
                >
                  Understood, proceed with my section
                </button>
              </div>
            </div>
          )}

          {questions.map((q) => {
            const isDetail = isVoiceField(q);
            const inputCls = `w-full px-3.5 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm transition-colors ${
              showMediaFeatures && voiceTarget === q.id ? "border-danger-500/50 bg-danger-500/10" : "border-[var(--border-default)] bg-[var(--bg-surface-2)]"
            }`;
            const filled = !!answers[q.id]?.trim();
            return (
              <div key={q.id} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-[var(--text-secondary)]">
                    {q.label}{q.required && <span className="text-red-400 ml-1">*</span>}
                  </label>
                  {showMediaFeatures && isDetail && <MicBtn targetId={q.id} small />}
                </div>

                {isDetail ? (
                  <AutoGrowTextarea
                    minRows={4}
                    placeholder={q.placeholder}
                    value={answers[q.id] || ""}
                    onChange={(e) => setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
                    className={`${inputCls} leading-relaxed`}
                  />
                ) : (
                  <input
                    type="text"
                    placeholder={q.placeholder}
                    value={answers[q.id] || ""}
                    onChange={(e) => setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
                    className={inputCls}
                  />
                )}

                {/* Persistent step-by-step example for detail fields — stays visible while typing */}
                {isDetail && q.placeholder && (
                  <div className="flex items-start gap-2 rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface-2)] px-3 py-2">
                    <Sparkles className="h-3.5 w-3.5 text-primary-500 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] leading-relaxed text-[var(--text-tertiary)]">
                        <span className="font-semibold text-primary-400">Example to follow — </span>
                        {q.placeholder}
                      </p>
                      {!filled && (
                        <button
                          type="button"
                          onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: q.placeholder }))}
                          className="mt-1.5 text-[11px] font-semibold text-primary-400 hover:text-primary-300 transition-colors"
                        >
                          Use this example, then edit the details →
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Extra Instructions */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[var(--text-primary)] flex items-center gap-2">
              <span className="text-[var(--text-secondary)]">Extra Instructions / اضافی ہدایات</span>
              <span className="text-xs font-normal text-[var(--text-tertiary)]">(optional)</span>
            </label>
            <textarea
              value={extraInstructions}
              onChange={(e) => setExtraInstructions(e.target.value)}
              placeholder="Extra instructions..."
              rows={3}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface-2)] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm resize-none"
            />
            <p className="text-xs text-[var(--text-tertiary)]">Any extra clause or condition — AI will include it in the document</p>
          </div>

          {error && <div className="bg-red-50 border border-red-200 rounded-xl p-3"><p className="text-red-700 text-sm">{error}</p></div>}

          <Button
            onClick={() => (category === "affidavit" || category === "agreement") ? handleGenerate() : setStage("confirm")}
            loading={loading}
            disabled={loading}
            className="w-full"
            size="lg"
          >
            <Sparkles className="h-4 w-4" /> Generate Document
          </Button>
        </Card>
      </div>
    );
  }

  // ── CONFIRM STAGE — disclaimer + field status ──
  if (stage === "confirm") {
    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        <div className="flex items-center gap-3">
          <button onClick={() => setStage("asking")} className="text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h2 className="text-lg font-bold text-[var(--text-primary)]">Review Before Generating</h2>
        </div>

        <Card className="p-6 space-y-5">
          {/* Disclaimer banner */}
          <div className="flex items-start gap-3 bg-warning-500/10 border border-warning-500/30 rounded-xl p-4">
            <span className="text-warning-500 text-xl flex-shrink-0">⚠️</span>
            <div>
              <p className="text-sm font-bold text-warning-500 mb-1">AI Generated Draft — Disclaimer</p>
              <p className="text-xs text-warning-500/90 leading-relaxed">
                This is an AI-generated draft. Please have it reviewed by a licensed lawyer before use.
                Missing fields (<span className="font-bold">❌</span>) will be left blank — fill them manually before submission.
              </p>
            </div>
          </div>

          {/* Field status list */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">Field Status</p>
            <div className="space-y-1.5">
              {questions.map((q) => {
                const filled = !!answers[q.id]?.trim();
                return (
                  <div key={q.id} className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg bg-[var(--bg-surface-2)] border border-[var(--border-default)]">
                    <span className={`text-base flex-shrink-0 ${filled ? "text-emerald-400" : "text-red-400"}`}>
                      {filled ? "✅" : "❌"}
                    </span>
                    <span className="text-sm text-[var(--text-secondary)] flex-1">{q.label}</span>
                    {filled ? (
                      <span className="text-xs text-[var(--text-tertiary)] truncate max-w-[140px]">{answers[q.id]}</span>
                    ) : (
                      <span className="text-xs text-red-400/70">will be blank</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Summary */}
          {(() => {
            const filled = questions.filter(q => !!answers[q.id]?.trim()).length;
            const missing = questions.length - filled;
            return (
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium ${
                missing === 0 ? "bg-success-500/10 text-success-500 border border-success-500/25" : "bg-[var(--bg-surface-2)] text-[var(--text-tertiary)] border border-[var(--border-subtle)]"
              }`}>
                {missing === 0
                  ? `✅ All ${filled} fields filled — document will be complete`
                  : `ℹ️ ${filled} filled • ${missing} missing (will be left blank)`}
              </div>
            );
          })()}

          {error && <div className="bg-red-50 border border-red-200 rounded-xl p-3"><p className="text-red-700 text-sm">{error}</p></div>}

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStage("asking")} className="flex-1">
              <ArrowLeft className="h-4 w-4" /> Edit Fields
            </Button>
            <Button onClick={handleGenerate} loading={loading} disabled={loading} className="flex-1" size="lg">
              <Sparkles className="h-4 w-4" /> Generate Document
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // ── INPUT STAGE ──
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2.5">
          {title} / {titleUrdu}
        </h1>
        <p className="text-[var(--text-tertiary)] mt-1">{description}</p>
      </div>

      <Card className="p-6 space-y-5">
        {/* Language */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-[var(--text-tertiary)]">Document language:</span>
          <button onClick={() => setLanguage("en")} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${language === "en" ? "bg-primary-600 text-white" : "bg-[var(--bg-surface-2)] text-[var(--text-secondary)] hover:bg-slate-200"}`}>English</button>
          <button onClick={() => setLanguage("ur")} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${language === "ur" ? "bg-primary-600 text-white" : "bg-[var(--bg-surface-2)] text-[var(--text-secondary)] hover:bg-slate-200"}`}>اردو</button>
        </div>

        {/* Two-column on large screens: writing + attachments on the left,
            quick examples as a side panel on the right (fills the width). */}
        <div className="grid lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] gap-6 lg:gap-8 items-start">
          <div className="space-y-5 min-w-0">

        {/* Main textarea with autocomplete + voice */}
        <div className="space-y-2 relative">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-[var(--text-secondary)]">What do you want to draft? / آپ کیا بنانا چاہتے ہیں؟</label>
            {showMic && <MicBtn targetId="request" />}
          </div>

          {/* Voice active banner */}
          {showMic && voiceTarget === "request" && (
            <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-xl">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs text-red-700 font-medium">
                Listening in {language === "ur" ? "Urdu (اردو)" : "English"}... Speak now — click Stop when done
              </span>
            </div>
          )}

          <textarea
            value={userRequest}
            onChange={(e) => handleRequestChange(e.target.value)}
            placeholder={placeholder}
            rows={4}
            className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm resize-none transition-colors ${
              showMic && voiceTarget === "request" ? "border-danger-500/50 bg-danger-500/10" : "border-[var(--border-default)] bg-[var(--bg-surface-2)]"
            }`}
            onKeyDown={(e) => {
              if (e.key === "Escape") { setShowSuggestions(false); return; }
              if (showSuggestions && e.key === "ArrowDown") { e.preventDefault(); setSuggestionIdx(i => Math.min(i + 1, suggestions.length - 1)); return; }
              if (showSuggestions && e.key === "ArrowUp") { e.preventDefault(); setSuggestionIdx(i => Math.max(i - 1, 0)); return; }
              if (showSuggestions && e.key === "Enter" && suggestionIdx >= 0) { e.preventDefault(); selectSuggestion(suggestions[suggestionIdx]); return; }
              if (e.key === "Enter" && e.ctrlKey) void handleAnalyze();
            }}
            onFocus={() => {
              // Clicking into the box shows the full category list for easy browsing
              justSelectedRef.current = false;
              inputFocusedRef.current = true;
              const matches = getDocSuggestions(userRequest, category);
              setSuggestions(matches);
              setShowSuggestions(matches.length > 0);
              setSuggestionIdx(-1);
            }}
            onBlur={() => {
              inputFocusedRef.current = false;
              setTimeout(() => setShowSuggestions(false), 150);
            }}
          />

          {/* Autocomplete Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute left-0 right-0 bg-[var(--bg-surface-2)] border border-[var(--border-default)] rounded-xl shadow-xl z-50 overflow-hidden">
              <p className="text-[10px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider px-4 py-2 border-b border-[var(--border-default)] bg-[var(--bg-surface-2)] sticky top-0">
                Document Suggestions — click to select
              </p>
              <div className="max-h-72 overflow-y-auto">
              {suggestions.map((doc, i) => (
                <button
                  key={doc.label}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => selectSuggestion(doc)}
                  className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 transition-colors ${
                    i === suggestionIdx
                      ? "bg-primary-900/40 text-primary-400"
                      : "text-[var(--text-secondary)] hover:bg-primary-900/30 hover:text-primary-400"
                  } ${i > 0 ? "border-t border-[var(--border-default)]" : ""}`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-400 flex-shrink-0" />
                  {doc.label}
                </button>
              ))}
              </div>
            </div>
          )}

          <p className="text-xs text-[var(--text-tertiary)]">
            Ctrl+Enter to continue • <Mic className="h-3 w-3 inline mx-1 text-primary-500" />
            Click Speak, dictate in {language === "ur" ? "Urdu" : "English"}
          </p>
        </div>

        {/* ── Attach Documents + Camera — only for court cases, applications, etc. ── */}
        {showMediaFeatures && <div className="space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <label className="text-sm font-medium text-[var(--text-primary)] flex items-center gap-1.5">
              <Paperclip className="h-4 w-4 text-[var(--text-tertiary)]" />
              Attach Documents / Images
            </label>
            <div className="flex items-center gap-2">
              {/* Camera button — triggers file picker with image+camera capture on mobile */}
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-colors"
              >
                <Camera className="h-3.5 w-3.5" /> Camera / Image
              </button>
              {/* General file attach */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-[var(--bg-surface-2)] hover:bg-primary-50 hover:text-primary-700 text-[var(--text-secondary)] transition-colors border border-transparent hover:border-primary-200"
              >
                <Paperclip className="h-3.5 w-3.5" /> File / PDF
              </button>
            </div>
          </div>

          {/* Hidden inputs */}
          <input ref={fileInputRef}   type="file" multiple accept="image/*,.pdf,.doc,.docx,.txt" onChange={handleFileSelect} className="hidden" />
          <input ref={cameraInputRef} type="file" multiple accept="image/*" capture="environment" onChange={handleFileSelect} className="hidden" />

          {attachedFiles.length === 0 ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-[var(--border-default)] rounded-xl p-4 text-center cursor-pointer hover:border-primary-300 hover:bg-primary-50/30 transition-colors group"
            >
              <div className="flex items-center justify-center gap-3 mb-1">
                <Camera className="h-5 w-5 text-[var(--text-tertiary)] group-hover:text-primary-500" />
                <ImageIcon className="h-5 w-5 text-[var(--text-tertiary)] group-hover:text-primary-500" />
                <Paperclip className="h-5 w-5 text-[var(--text-tertiary)] group-hover:text-primary-500" />
              </div>
              <p className="text-xs text-[var(--text-tertiary)]">Take a photo or attach FIR copy, court orders, old case files</p>
              <p className="text-[10px] text-[var(--text-tertiary)] mt-0.5">Images, PDF, DOC • Max 10MB per file</p>
            </div>
          ) : (
            <div className="space-y-2">
              {attachedFiles.map((file) => {
                const isImage = file.type.startsWith("image/");
                return (
                  <div key={file.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-[var(--bg-surface-2)] border border-[var(--border-default)] group/f">
                    {isImage && file.preview ? (
                      <img src={file.preview} alt={file.name} className="w-10 h-10 object-cover rounded-lg border border-[var(--border-default)] flex-shrink-0" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-[var(--bg-surface-2)] flex items-center justify-center flex-shrink-0">
                        <FileIcon className="h-5 w-5 text-[var(--text-tertiary)]" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--text-primary)] truncate">{file.name}</p>
                      <p className="text-[11px] text-[var(--text-tertiary)]">{formatSize(file.size)}</p>
                    </div>
                    <button onClick={() => removeFile(file.id)} className="p-1.5 rounded-lg text-[var(--text-tertiary)] hover:text-red-500 hover:bg-red-50 opacity-0 group-hover/f:opacity-100 transition-all">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="flex-1 flex items-center justify-center gap-2 py-2 text-xs text-indigo-600 hover:text-indigo-700 border border-dashed border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50 rounded-xl transition-colors"
                >
                  <Camera className="h-3.5 w-3.5" /> Add Image / Camera
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 flex items-center justify-center gap-2 py-2 text-xs text-[var(--text-tertiary)] hover:text-primary-600 border border-dashed border-[var(--border-default)] hover:border-primary-300 rounded-xl transition-colors"
                >
                  <Paperclip className="h-3.5 w-3.5" /> Add File
                </button>
              </div>

              {/* Extract from images button */}
              {attachedFiles.some((f) => f.type.startsWith("image/") && f.preview) && (
                <button
                  type="button"
                  onClick={extractFromImages}
                  disabled={extracting}
                  className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 rounded-xl disabled:opacity-50 transition-colors"
                >
                  {extracting ? (
                    <><RefreshCw className="h-3.5 w-3.5 animate-spin" /> Extracting text from images...</>
                  ) : (
                    <><ImageIcon className="h-3.5 w-3.5" /> Extract Information from Images (AI)</>
                  )}
                </button>
              )}

              {/* Extracted context preview */}
              {extractedContext && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-3 space-y-1.5">
                  <p className="text-xs font-semibold text-green-700 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5" /> Extracted from documents — AI will use this context
                  </p>
                  <p className="text-xs text-green-700 line-clamp-3">{extractedContext}</p>
                  <button onClick={() => setExtractedContext("")} className="text-[10px] text-green-600 hover:text-green-800 underline">Clear extracted text</button>
                </div>
              )}
            </div>
          )}
        </div>}

        {/* ── Same Typing (affidavit + agreement only) ── */}
        {!showMediaFeatures && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-[var(--text-tertiary)] flex-shrink-0" />
              <span className="text-sm font-semibold text-[var(--text-secondary)]">Type from Image</span>
              <span className="text-xs text-[var(--text-tertiary)] font-normal">— attach a document photo, AI will type it in English</span>
            </div>

            <input
              ref={sameTypingInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                if (file.size > 10 * 1024 * 1024) { alert("Max 10MB"); return; }
                const reader = new FileReader();
                reader.onload = (ev) => setSameTypingPreview(ev.target?.result as string);
                reader.readAsDataURL(file);
                if (e.target) e.target.value = "";
              }}
            />

            {!sameTypingPreview ? (
              <button
                type="button"
                onClick={() => sameTypingInputRef.current?.click()}
                className="w-full flex flex-col items-center justify-center gap-2 py-5 border-2 border-dashed border-[var(--border-default)] rounded-xl text-[var(--text-tertiary)] hover:border-slate-300 hover:text-[var(--text-secondary)] transition-colors cursor-pointer"
              >
                <Camera className="h-6 w-6" />
                <span className="text-xs font-semibold">Click to attach document image</span>
                <span className="text-[10px] text-[var(--text-tertiary)]">Photo of any handwritten or printed affidavit / agreement</span>
              </button>
            ) : (
              <div className="space-y-3">
                <div className="relative rounded-xl overflow-hidden border border-[var(--border-default)] bg-[var(--bg-surface-2)]">
                  <img src={sameTypingPreview} alt="Document" className="w-full max-h-48 object-contain" />
                  <button
                    type="button"
                    onClick={() => setSameTypingPreview(null)}
                    className="absolute top-2 right-2 p-1 rounded-full bg-[var(--bg-surface-1)]/90 border border-[var(--border-default)] text-[var(--text-tertiary)] hover:text-danger-500 hover:border-danger-500/40 transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
                {error && <p className="text-xs text-red-500">{error}</p>}
                <button
                  type="button"
                  onClick={handleSameTyping}
                  disabled={sameTypingLoading}
                  className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white rounded-xl transition-colors"
                >
                  {sameTypingLoading ? (
                    <><RefreshCw className="h-4 w-4 animate-spin" /> Reading &amp; Typing Document...</>
                  ) : (
                    <><Sparkles className="h-4 w-4" /> Type This Document</>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
          </div>{/* end left column */}

          {/* Quick examples — side panel (fills the right space) */}
          <div className="lg:pt-1">
            <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-primary-500" /> Quick examples
            </p>
            <div className="flex flex-col gap-2">
              {quickExamples.map((ex) => (
                <button
                  key={ex}
                  onClick={() => setUserRequest(ex)}
                  className="text-left px-3.5 py-2.5 text-[13px] rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] text-[var(--text-secondary)] hover:border-primary-500/40 hover:text-primary-300 hover:bg-primary-500/5 transition-colors"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>
        </div>{/* end grid */}

        {error && <div className="bg-red-50 border border-red-200 rounded-xl p-3"><p className="text-red-700 text-sm">{error}</p></div>}

        <Button onClick={handleAnalyze} loading={loading} disabled={loading || !userRequest.trim()} className="w-full" size="lg">
          <Sparkles className="h-4 w-4" /> Continue <ArrowRight className="h-4 w-4" />
        </Button>
      </Card>
    </div>
  );
}
