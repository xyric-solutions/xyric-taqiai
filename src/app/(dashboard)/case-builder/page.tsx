"use client";

import { useEffect, useRef, useState } from "react";
import { saveDocument, updateDocumentContent } from "@/lib/document-store";
import DocumentPreview from "@/components/documents/DocumentPreview";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import {
  Search, Sparkles, ArrowLeft, Scale, BookOpen,
  ChevronRight, TrendingUp, TrendingDown, Minus,
  FileText, AlertTriangle, Eye, Plus, Trash2, X, HelpCircle,
  Mic, Square, Loader2,
} from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────────────

type Stage = "input" | "confirm" | "details" | "parties" | "researching" | "results" | "asking" | "generating" | "done";

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
  "Application under Sections 22-A & 22-B CrPC",
  "Written Statement",
  "Writ Petition",
  "Civil Revision",
  "Criminal Revision / Section 561-A Petition",
  "Order VII Rule 11 Application",
  "Rent Appeal",
  "Guardian Petition",
  "Temporary Injunction Application",
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

const WIZARD_STEPS = ["Case", "Confirm", "Details", "Client"];

// Compact 4-step progress indicator shown across the guided input flow.
function Stepper({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {WIZARD_STEPS.map((label, i) => {
        const n = i + 1;
        const active = n === current;
        const done = n < current;
        return (
          <div key={label} className="flex items-center gap-1.5">
            <div className="flex items-center gap-1.5">
              <span
                className="h-5 w-5 rounded-full grid place-items-center text-[10px] font-bold"
                style={done || active
                  ? { background: "rgba(6,182,212,0.15)", color: "#06b6d4", border: "1px solid rgba(6,182,212,0.3)" }
                  : { background: "var(--bg-surface-2)", color: "var(--text-tertiary)", border: "1px solid var(--border-subtle)" }}
              >
                {done ? "✓" : n}
              </span>
              <span className="text-xs font-medium hidden sm:inline" style={{ color: active ? "var(--text-primary)" : "var(--text-tertiary)" }}>{label}</span>
            </div>
            {n < WIZARD_STEPS.length && <ChevronRight className="h-3 w-3" style={{ color: "var(--text-tertiary)" }} />}
          </div>
        );
      })}
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
  // "How It Works" helper is hidden by default and revealed via the "?" button,
  // so the form gets a clean, uncluttered view (same pattern as AI Advisor).
  const [showHelp, setShowHelp] = useState(false);

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

  // Section intake — confirm what the section is about, then ask section-specific facts
  const [intakeLoading, setIntakeLoading] = useState(false);
  const [sectionInterpretation, setSectionInterpretation] = useState("");
  const [sectionAlternatives, setSectionAlternatives] = useState<string[]>([]);
  const [sectionPurpose, setSectionPurpose] = useState("");
  const [intakeQuestions, setIntakeQuestions] = useState<Question[]>([]);
  const [intakeAnswers, setIntakeAnswers] = useState<Record<string, string>>({});

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
  const [backgroundRecording, setBackgroundRecording] = useState(false);
  const [backgroundTranscribing, setBackgroundTranscribing] = useState(false);
  const [backgroundRecordSeconds, setBackgroundRecordSeconds] = useState(0);
  const [fieldRecordingId, setFieldRecordingId] = useState<string | null>(null);
  const [fieldTranscribingId, setFieldTranscribingId] = useState<string | null>(null);
  const [fieldRecordSeconds, setFieldRecordSeconds] = useState(0);
  const backgroundRecorderRef = useRef<MediaRecorder | null>(null);
  const backgroundChunksRef = useRef<Blob[]>([]);
  const backgroundStreamRef = useRef<MediaStream | null>(null);
  const backgroundTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fieldRecorderRef = useRef<MediaRecorder | null>(null);
  const fieldChunksRef = useRef<Blob[]>([]);
  const fieldStreamRef = useRef<MediaStream | null>(null);
  const fieldTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

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

  useEffect(() => {
    return () => {
      if (backgroundTimerRef.current) clearInterval(backgroundTimerRef.current);
      if (fieldTimerRef.current) clearInterval(fieldTimerRef.current);
      backgroundStreamRef.current?.getTracks().forEach((track) => track.stop());
      fieldStreamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const formatRecordingTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remaining = seconds % 60;
    return `${minutes}:${remaining.toString().padStart(2, "0")}`;
  };

  const blobToBase64 = (blob: Blob): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve((reader.result as string).split(",")[1] || "");
      reader.onerror = () => reject(new Error("Could not read the recording."));
      reader.readAsDataURL(blob);
    });

  const appendBackgroundTranscript = (text: string) => {
    const clean = text.trim();
    if (!clean) return;
    setFacts((prev) => {
      const current = prev.trim();
      return current ? `${current}\n\n${clean}` : clean;
    });
  };

  const transcribeBackgroundRecording = async (audioBlob: Blob) => {
    setBackgroundTranscribing(true);
    setError(null);
    try {
      if (audioBlob.size === 0) throw new Error("Recording was empty. Please try again.");
      const base64Audio = await blobToBase64(audioBlob);
      const res = await fetch("/api/ai/voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ audio: base64Audio, mimeType: audioBlob.type || "audio/webm" }),
      });
      const data = (await res.json().catch(() => ({}))) as { text?: string; error?: string };
      if (!res.ok) throw new Error(data.error || "Transcription failed. Please try again.");
      if (!data.text?.trim()) throw new Error("No speech was detected. Please speak clearly and try again.");
      appendBackgroundTranscript(data.text);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Voice transcription failed. Please try again.");
    } finally {
      setBackgroundTranscribing(false);
      backgroundChunksRef.current = [];
    }
  };

  const startBackgroundRecording = async () => {
    if (backgroundRecording || backgroundTranscribing) return;
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setError("Microphone is available only on localhost or HTTPS. Open the app securely and try again.");
      return;
    }

    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      backgroundStreamRef.current = stream;
      const candidates = ["audio/webm", "audio/mp4", "audio/ogg"];
      const supported = candidates.find(
        (type) => typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported?.(type),
      );
      const recorder = supported ? new MediaRecorder(stream, { mimeType: supported }) : new MediaRecorder(stream);
      backgroundRecorderRef.current = recorder;
      backgroundChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) backgroundChunksRef.current.push(event.data);
      };

      recorder.onstop = () => {
        if (backgroundTimerRef.current) {
          clearInterval(backgroundTimerRef.current);
          backgroundTimerRef.current = null;
        }
        stream.getTracks().forEach((track) => track.stop());
        backgroundStreamRef.current = null;
        setBackgroundRecording(false);
        setBackgroundRecordSeconds(0);
        const audioBlob = new Blob(backgroundChunksRef.current, { type: recorder.mimeType || supported || "audio/webm" });
        void transcribeBackgroundRecording(audioBlob);
      };

      recorder.start();
      setBackgroundRecording(true);
      setBackgroundRecordSeconds(0);
      backgroundTimerRef.current = setInterval(() => setBackgroundRecordSeconds((seconds) => seconds + 1), 1000);
    } catch (err) {
      const name = err instanceof Error ? err.name : "";
      if (name === "NotAllowedError" || name === "SecurityError") {
        setError("Microphone permission denied. Allow mic access in your browser, then try again.");
      } else if (name === "NotFoundError" || name === "DevicesNotFoundError") {
        setError("No microphone found. Connect a microphone and try again.");
      } else {
        setError("Could not start recording. Please check your microphone and try again.");
      }
      backgroundStreamRef.current?.getTracks().forEach((track) => track.stop());
      backgroundStreamRef.current = null;
    }
  };

  const stopBackgroundRecording = () => {
    if (!backgroundRecorderRef.current || backgroundRecorderRef.current.state !== "recording") return;
    backgroundRecorderRef.current.stop();
  };

  const transcribeFieldRecording = async (
    audioBlob: Blob,
    fieldId: string,
    applyTranscript: (text: string) => void
  ) => {
    setFieldTranscribingId(fieldId);
    setError(null);
    try {
      if (audioBlob.size === 0) throw new Error("Recording was empty. Please try again.");
      const base64Audio = await blobToBase64(audioBlob);
      const res = await fetch("/api/ai/voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ audio: base64Audio, mimeType: audioBlob.type || "audio/webm" }),
      });
      const data = (await res.json().catch(() => ({}))) as { text?: string; error?: string };
      if (!res.ok) throw new Error(data.error || "Transcription failed. Please try again.");
      const text = data.text?.trim();
      if (!text) throw new Error("No speech was detected. Please speak clearly and try again.");
      applyTranscript(text);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Voice transcription failed. Please try again.");
    } finally {
      setFieldTranscribingId(null);
      fieldChunksRef.current = [];
    }
  };

  const startFieldRecording = async (
    fieldId: string,
    applyTranscript: (text: string) => void
  ) => {
    if (fieldRecordingId || fieldTranscribingId || backgroundRecording || backgroundTranscribing) return;
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setError("Microphone is available only on localhost or HTTPS. Open the app securely and try again.");
      return;
    }

    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      fieldStreamRef.current = stream;
      const candidates = ["audio/webm", "audio/mp4", "audio/ogg"];
      const supported = candidates.find(
        (type) => typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported?.(type),
      );
      const recorder = supported ? new MediaRecorder(stream, { mimeType: supported }) : new MediaRecorder(stream);
      fieldRecorderRef.current = recorder;
      fieldChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) fieldChunksRef.current.push(event.data);
      };

      recorder.onstop = () => {
        if (fieldTimerRef.current) {
          clearInterval(fieldTimerRef.current);
          fieldTimerRef.current = null;
        }
        stream.getTracks().forEach((track) => track.stop());
        fieldStreamRef.current = null;
        setFieldRecordingId(null);
        setFieldRecordSeconds(0);
        const audioBlob = new Blob(fieldChunksRef.current, { type: recorder.mimeType || supported || "audio/webm" });
        void transcribeFieldRecording(audioBlob, fieldId, applyTranscript);
      };

      recorder.start();
      setFieldRecordingId(fieldId);
      setFieldRecordSeconds(0);
      fieldTimerRef.current = setInterval(() => setFieldRecordSeconds((seconds) => seconds + 1), 1000);
    } catch (err) {
      const name = err instanceof Error ? err.name : "";
      if (name === "NotAllowedError" || name === "SecurityError") {
        setError("Microphone permission denied. Allow mic access in your browser, then try again.");
      } else if (name === "NotFoundError" || name === "DevicesNotFoundError") {
        setError("No microphone found. Connect a microphone and try again.");
      } else {
        setError("Could not start recording. Please check your microphone and try again.");
      }
      fieldStreamRef.current?.getTracks().forEach((track) => track.stop());
      fieldStreamRef.current = null;
    }
  };

  const stopFieldRecording = () => {
    if (!fieldRecorderRef.current || fieldRecorderRef.current.state !== "recording") return;
    fieldRecorderRef.current.stop();
  };

  // Fold the confirmed section purpose + section-specific intake answers into the
  // facts, so both research and drafting see the concrete case details.
  const composeFacts = () => {
    const parts: string[] = [];
    if (facts.trim()) parts.push(facts.trim());
    if (sectionPurpose.trim()) parts.push(`Nature of the matter: ${sectionPurpose.trim()}`);
    const qa = intakeQuestions
      .map((q) => { const v = intakeAnswers[q.id]?.trim(); return v ? `${q.label}: ${v}` : null; })
      .filter(Boolean) as string[];
    if (qa.length) parts.push(qa.join("\n"));
    const missing = intakeQuestions
      .filter((q) => q.required && !intakeAnswers[q.id]?.trim())
      .map((q) => q.label);
    if (missing.length) {
      parts.push(`Missing case details to leave as blanks/placeholders: ${missing.join("; ")}`);
    }
    return parts.join("\n");
  };

  const handleContinueFromDetails = () => {
    setError(null);
    setStage("parties");
  };

  const isNarrativeQuestion = (question: Question) =>
    /\b(fact|detail|description|reason|ground|circumstance)\b/i.test(`${question.id} ${question.label}`);

  const appendIntakeAnswer = (id: string, text: string) => {
    const clean = text.trim();
    if (!clean) return;
    setIntakeAnswers((current) => {
      const previous = current[id]?.trim();
      return { ...current, [id]: previous ? `${previous}\n${clean}` : clean };
    });
  };

  const appendDraftAnswer = (id: string, text: string) => {
    const clean = text.trim();
    if (!clean) return;
    setAnswers((current) => {
      const previous = current[id]?.trim();
      return { ...current, [id]: previous ? `${previous}\n${clean}` : clean };
    });
  };

  const renderFieldMicButton = (
    fieldId: string,
    label: string,
    applyTranscript: (text: string) => void
  ) => {
    const isRecording = fieldRecordingId === fieldId;
    const isTranscribing = fieldTranscribingId === fieldId;
    const disabled = Boolean(
      (fieldRecordingId && !isRecording) ||
      (fieldTranscribingId && !isTranscribing) ||
      backgroundRecording ||
      backgroundTranscribing
    );

    return (
      <button
        type="button"
        onClick={() => isRecording ? stopFieldRecording() : startFieldRecording(fieldId, applyTranscript)}
        disabled={disabled}
        aria-pressed={isRecording}
        title={isRecording ? `Stop recording ${label}` : `Dictate ${label}`}
        className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60"
        style={isRecording
          ? { background: "rgba(239,68,68,0.12)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.35)" }
          : { background: "var(--bg-surface-2)", color: "var(--text-secondary)", border: "1px solid var(--border-default)" }}
      >
        {isTranscribing ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : isRecording ? (
          <Square className="h-3.5 w-3.5" />
        ) : (
          <Mic className="h-3.5 w-3.5" />
        )}
        <span className="hidden sm:inline">
          {isTranscribing ? "Transcribing" : isRecording ? `Stop ${formatRecordingTime(fieldRecordSeconds)}` : "Dictate"}
        </span>
      </button>
    );
  };

  // Step 0a: user clicked "Research" — first confirm what the section is about.
  const handleStartIntake = async () => {
    if (!sections.trim()) { setError("Please enter the law section(s) or case type."); return; }
    setError(null);
    setIntakeLoading(true);
    try {
      const res = await fetch("/api/ai/section-intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "interpret", sections, documentNeeded, language }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not read the section");
      setSectionInterpretation(data.interpretation || "");
      setSectionAlternatives(Array.isArray(data.alternatives) ? data.alternatives : []);
      setSectionPurpose(data.interpretation || sections);
      setStage("confirm");
    } catch {
      // If interpretation fails, keep the same wizard order and let the lawyer
      // confirm the matter in their own words.
      setSectionInterpretation("");
      setSectionAlternatives([]);
      setSectionPurpose(sections);
      setStage("confirm");
    } finally {
      setIntakeLoading(false);
    }
  };

  // Step 0b: user confirmed the purpose — fetch section-specific questions.
  const handleConfirmPurpose = async () => {
    setError(null);
    setIntakeLoading(true);
    try {
      const res = await fetch("/api/ai/section-intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "questions", sections, documentNeeded, purpose: sectionPurpose, facts, language }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not build questions");
      const qs: Question[] = Array.isArray(data.questions) ? data.questions : [];
      setIntakeQuestions(qs);
      setIntakeAnswers({});
      setStage("details");
    } catch {
      setIntakeQuestions([]);
      setIntakeAnswers({});
      setStage("details");
    } finally {
      setIntakeLoading(false);
    }
  };

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
          sections, facts: composeFacts(), documentNeeded, clientName, clientFatherName, clientCnic, clientAddress,
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
    } catch {
      const fallbackTerms = Array.from(new Set(
        [sections, documentNeeded, ...sections.split(/[,;/]+/)]
          .map((term) => term.replace(/\s+/g, " ").trim())
          .filter((term) => term.length >= 2)
      )).slice(0, 5);
      setResult({
        searchTerms: {
          primaryTerms: fallbackTerms.length ? fallbackTerms : [sections.trim()],
          secondaryTerms: [],
          clientPosition: "petitioner",
        },
        totalCandidates: 0,
        judgments: [],
        legalStrategy: "Judgment research was slow or unavailable for this matter. Continue drafting from the provided facts, applicable statutes, legal ingredients, and best Pakistani pleading practice. Missing details will remain as blanks/placeholders, and no case-law citation will be invented.",
      });
      setSelectedMorePage(0);
      setSelectedMoreHasMore(false);
      setSelectedMoreRelated(false);
      setError(null);
      setStage("results");
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
    const adverse = result.judgments.filter((j) => j.stance === "adverse").slice(0, 2);
    const usable = [...favorable, ...neutral].slice(0, 5);

    const citationList = usable.map((j) => `${j.citation} (${j.court}, ${j.year})`).join("; ");
    const adverseList = adverse.map((j) => `${j.citation} (${j.court}, ${j.year})`).join("; ");
    const researchBasis = usable.length > 0 || adverse.length > 0
      ? `Authenticated judgments from the local database are available.${citationList ? ` Supporting or neutral authorities for document-specific grounds: ${citationList}. Apply only materially relevant authorities and tie each citation to the exact proposition it supports.` : ""}${adverseList ? ` Potentially adverse authenticated authorities to address or distinguish: ${adverseList}.` : ""} Case-building strategy: ${result.legalStrategy}`
      : `No actual matching judgments were found in the local database. Build the case from the applicable statutes, legal ingredients, collected facts, analogous legal principles, and AI-generated legal reasoning. Do not invent or fabricate citations. Clearly distinguish AI-generated legal reasoning from actual cited judgments. Strategy: ${result.legalStrategy}`;
    const resolvedDocumentType = documentNeeded || documentType;
    const docRequest = resolvedDocumentType
      ? `Draft a ${resolvedDocumentType} for a case involving ${sections}.`
      : `Identify and draft the procedurally appropriate legal document for a case involving ${sections}.`;

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
      composeFacts() && `Case Facts: ${composeFacts()}`,
    ].filter(Boolean).join("\n");

    const richRequest = `${docRequest}
${alreadyKnown ? `\nALREADY PROVIDED — do NOT ask for these again:\n${alreadyKnown}\n` : ""}
${researchBasis}
Do not add a standalone reliance paragraph or citation list. Integrate each authenticated authority into the exact legal ground it supports.
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
    const adverse = result.judgments.filter((j) => j.stance === "adverse").slice(0, 2);
    const usable = [...favorable, ...neutral].slice(0, 5);

    const citationList = usable.map((j) => `${j.citation} (${j.court}, ${j.year})`).join("; ");
    const adverseList = adverse.map((j) => `${j.citation} (${j.court}, ${j.year})`).join("; ");
    const researchBasis = usable.length > 0 || adverse.length > 0
      ? `Authenticated judgments from the local database are available.${citationList ? ` Supporting or neutral authorities for document-specific grounds: ${citationList}. Apply only materially relevant authorities and tie each citation to the exact proposition it supports.` : ""}${adverseList ? ` Potentially adverse authenticated authorities to address or distinguish: ${adverseList}.` : ""} Case-building strategy: ${result.legalStrategy}`
      : `No actual matching judgments were found in the local database. Build the case from the applicable statutes, legal ingredients, collected facts, analogous legal principles, and AI-generated legal reasoning. Do not invent or fabricate citations. Clearly distinguish AI-generated legal reasoning from actual cited judgments. Strategy: ${result.legalStrategy}`;
    const resolvedDocumentType = documentNeeded || documentType;
    const docRequest = resolvedDocumentType
      ? `Draft a ${resolvedDocumentType} for a case involving ${sections}.`
      : `Identify and draft the procedurally appropriate legal document for a case involving ${sections}.`;

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
      composeFacts() && `Case Facts: ${composeFacts()}`,
    ].filter(Boolean).join("\n");

    const richRequest = `${docRequest}
${alreadyKnown2 ? `\nALREADY PROVIDED — do NOT ask for these again:\n${alreadyKnown2}\n` : ""}
${researchBasis}
Do not add a standalone reliance paragraph or citation list. Integrate each authenticated authority into the exact legal ground it supports.
Court heading policy: Use only the provided Court Name and District/City. Never assume Lahore or any other city.
Client Position: ${result.searchTerms.clientPosition}`;

    const enrichedAnswers = {
      ...answers,
      ...(usable.length > 0 || adverse.length > 0 ? {
        research_guidance_from_judgments: usable.map((j) => `${j.citation} — ${j.ratio}`).join("; "),
        adverse_judgments_to_distinguish: adverse.map((j) => `${j.citation} — ${j.ratio}`).join("; "),
        citation_policy: "Use only these authenticated judgments where materially applicable. Tie each citation and supplied ratio to the exact legal ground it supports; never add a generic reliance paragraph or citation list.",
      } : {
        no_matching_judgments: "No actual matching judgments were found in the local database.",
        ai_generated_legal_reasoning: result.legalStrategy,
        citation_policy: "Do not invent citations. Use statutory ingredients and AI-generated legal reasoning only, clearly separated from any actual cited judgment.",
      }),
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
    setIntakeLoading(false);
    setSectionInterpretation("");
    setSectionAlternatives([]);
    setSectionPurpose("");
    setIntakeQuestions([]);
    setIntakeAnswers({});
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
              <div className="rounded-lg px-3 py-2 text-xs" style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.22)", color: "var(--text-secondary)" }}>
                You may generate now even if some fields are empty. Missing information will appear as <span className="font-semibold" style={{ color: "var(--text-primary)" }}>___________</span> in the draft.
              </div>

              {questions.map((q) => (
                <div key={q.id} className="space-y-1.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label className="block text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                      {q.label}
                      {q.required && <span style={{ color: "#ef4444" }}> *</span>}
                    </label>
                    {renderFieldMicButton(`draft:${q.id}`, q.label, (text) => appendDraftAnswer(q.id, text))}
                  </div>
                  <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                    Example format: {q.placeholder}
                  </p>
                  {isNarrativeQuestion(q) ? (
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
                  {(fieldRecordingId === `draft:${q.id}` || fieldTranscribingId === `draft:${q.id}`) && (
                    <div className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs" style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border-subtle)", color: "var(--text-secondary)" }}>
                      {fieldRecordingId === `draft:${q.id}` ? <span className="h-2 w-2 rounded-full bg-danger-500 animate-pulse" /> : <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                      <span>{fieldRecordingId === `draft:${q.id}` ? `Recording ${formatRecordingTime(fieldRecordSeconds)}` : "Transcribing voice..."}</span>
                    </div>
                  )}
                </div>
              ))}

              <Button onClick={handleGenerate} className="w-full flex items-center justify-center gap-2 mt-2">
                <Sparkles className="h-4 w-4" />
                Generate Document, blanks are okay
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
          <Card className="p-6 space-y-4">
            <div className="flex items-start gap-3">
              <BookOpen className="h-5 w-5 mt-0.5 flex-shrink-0" style={{ color: "#06b6d4" }} />
              <div className="space-y-1">
                <p className="font-semibold" style={{ color: "var(--text-primary)" }}>No direct judgments found</p>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{result.legalStrategy}</p>
                <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                  The draft will use statutes, essential legal ingredients, collected facts, and AI-generated legal reasoning. Actual citations will be used only when judgments are selected.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button onClick={handleDraftWithJudgments} className="flex flex-1 items-center justify-center gap-2">
                <FileText className="h-4 w-4" />
                Draft {documentNeeded || "Document"} Without Direct Judgments
              </Button>
              <Button variant="outline" onClick={() => setChangeJudgmentsOpen(true)} className="flex items-center justify-center gap-2">
                <Search className="h-4 w-4" />
                Search Manually
              </Button>
            </div>
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

  // Confirm: what is this section about?
  if (stage === "confirm") {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Stepper current={2} />
        <div className="flex items-center gap-3">
          <button onClick={() => setStage("input")} style={{ color: "var(--text-tertiary)" }}>
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>Confirm the Matter</h1>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Confirm what this section is about so the right questions are asked.</p>
          </div>
        </div>

        {error && (
          <div className="rounded-lg px-4 py-3 text-sm" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444" }}>
            {error}
          </div>
        )}

        <Card className="p-6 space-y-5">
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(6,182,212,0.15)" }}>
              <Scale className="h-4 w-4" style={{ color: "#06b6d4" }} />
            </div>
            <div className="space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: "var(--text-tertiary)" }}>You entered</p>
              <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{sections}</p>
            </div>
          </div>

          {sectionInterpretation && (
            <div className="rounded-lg px-4 py-3 text-sm" style={{ background: "rgba(6,182,212,0.06)", border: "1px solid rgba(6,182,212,0.2)", color: "var(--text-secondary)" }}>
              <span className="font-semibold" style={{ color: "var(--text-primary)" }}>AI understands: </span>{sectionInterpretation}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              What is this case about? <span style={{ color: "var(--text-tertiary)", fontWeight: 400 }}>(edit if the AI got it wrong)</span>
            </label>
            <textarea
              rows={2}
              value={sectionPurpose}
              onChange={(e) => setSectionPurpose(e.target.value)}
              placeholder="e.g. Theft of my client's car"
              className="w-full rounded-lg px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary-500/50"
              style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }}
            />
          </div>

          {sectionAlternatives.length > 0 && (
            <div className="space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: "var(--text-tertiary)" }}>Or pick one</p>
              <div className="flex flex-wrap gap-2">
                {sectionAlternatives.map((alt) => (
                  <button
                    key={alt}
                    type="button"
                    onClick={() => setSectionPurpose(alt)}
                    className="px-2.5 py-1 rounded-full text-xs font-medium transition-colors"
                    style={sectionPurpose === alt
                      ? { background: "rgba(6,182,212,0.15)", color: "#06b6d4", border: "1px solid rgba(6,182,212,0.3)" }
                      : { background: "var(--bg-surface-2)", color: "var(--text-secondary)", border: "1px solid var(--border-subtle)" }}
                  >
                    {alt}
                  </button>
                ))}
              </div>
            </div>
          )}

          <Button onClick={handleConfirmPurpose} disabled={intakeLoading || !sectionPurpose.trim()} className="w-full flex items-center justify-center gap-2">
            <Sparkles className="h-4 w-4" />
            {intakeLoading ? "Preparing questions…" : "Yes, ask the related questions"}
          </Button>
          <button
            type="button"
            onClick={() => {
              setIntakeQuestions([]);
              setIntakeAnswers({});
              setStage("details");
            }}
            disabled={intakeLoading}
            className="w-full text-center text-xs font-medium"
            style={{ color: "var(--text-tertiary)" }}
          >
            Continue without related questions
          </button>
        </Card>
      </div>
    );
  }

  // Case Details: background facts first, with optional section-specific questions.
  if (stage === "details") {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Stepper current={3} />
        <div className="flex items-center gap-3">
          <button onClick={() => setStage("confirm")} style={{ color: "var(--text-tertiary)" }}>
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>Case Details</h1>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              {intakeQuestions.length > 0
                ? `${intakeQuestions.length} matter-specific question${intakeQuestions.length !== 1 ? "s" : ""}. Fill what you know, leave the rest blank.`
                : "Add the case background before client information."}
            </p>
          </div>
        </div>

        {sectionPurpose.trim() && (
          <div className="rounded-lg px-4 py-3 text-sm" style={{ background: "rgba(6,182,212,0.06)", border: "1px solid rgba(6,182,212,0.2)", color: "var(--text-secondary)" }}>
            <span className="font-semibold" style={{ color: "var(--text-primary)" }}>Matter: </span>{sectionPurpose}
          </div>
        )}

        {error && (
          <div className="rounded-lg px-4 py-3 text-sm" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444" }}>
            {error}
          </div>
        )}

        <Card className="p-6 space-y-5">
          <div className="rounded-lg px-3 py-2 text-xs" style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.22)", color: "var(--text-secondary)" }}>
            Missing details will not stop drafting. TaqiAI will prepare the full case and place blanks like <span className="font-semibold" style={{ color: "var(--text-primary)" }}>___________</span> wherever information is still needed.
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="block text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                Case background / additional facts <span style={{ color: "var(--text-tertiary)", fontWeight: 400 }}>(optional)</span>
              </label>
              <button
                type="button"
                onClick={backgroundRecording ? stopBackgroundRecording : startBackgroundRecording}
                disabled={backgroundTranscribing}
                aria-pressed={backgroundRecording}
                title={backgroundRecording ? "Stop recording" : "Dictate case background"}
                className="inline-flex h-9 items-center gap-2 rounded-lg px-3 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60"
                style={backgroundRecording
                  ? { background: "rgba(239,68,68,0.12)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.35)" }
                  : { background: "var(--bg-surface-2)", color: "var(--text-secondary)", border: "1px solid var(--border-default)" }}
              >
                {backgroundTranscribing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : backgroundRecording ? (
                  <Square className="h-4 w-4" />
                ) : (
                  <Mic className="h-4 w-4" />
                )}
                <span className="hidden sm:inline">
                  {backgroundTranscribing ? "Transcribing" : backgroundRecording ? `Stop ${formatRecordingTime(backgroundRecordSeconds)}` : "Dictate"}
                </span>
              </button>
            </div>
            <textarea
              rows={5}
              value={facts}
              onChange={(e) => setFacts(e.target.value)}
              placeholder={`Anything not already covered above:\n- What happened and when\n- Important documents or dates\n- Your side's main grounds and the relief you want`}
              className="w-full rounded-lg px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary-500/50"
              style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }}
            />
            {(backgroundRecording || backgroundTranscribing) && (
              <div className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs" style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border-subtle)", color: "var(--text-secondary)" }}>
                {backgroundRecording ? <span className="h-2 w-2 rounded-full bg-danger-500 animate-pulse" /> : <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                <span>{backgroundRecording ? `Recording ${formatRecordingTime(backgroundRecordSeconds)}` : "Transcribing voice..."}</span>
              </div>
            )}
          </div>

          {intakeQuestions.length === 0 && (
            <div className="rounded-lg px-3 py-2 text-xs" style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border-subtle)", color: "var(--text-tertiary)" }}>
              No extra section-specific questions were needed for this matter.
            </div>
          )}

          {intakeQuestions.map((q) => (
            <div key={q.id} className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="block text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                  {q.label}
                  {q.required && <span style={{ color: "#ef4444" }}> *</span>}
                  {!q.required && <span style={{ color: "var(--text-tertiary)", fontWeight: 400 }}> (optional)</span>}
                </label>
                {renderFieldMicButton(`intake:${q.id}`, q.label, (text) => appendIntakeAnswer(q.id, text))}
              </div>
              <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                Example format: {q.placeholder}
              </p>
              {isNarrativeQuestion(q) ? (
                <textarea
                  rows={3}
                  value={intakeAnswers[q.id] || ""}
                  onChange={(e) => setIntakeAnswers((a) => ({ ...a, [q.id]: e.target.value }))}
                  placeholder={q.placeholder}
                  className="w-full rounded-lg px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary-500/50"
                  style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }}
                />
              ) : (
                <input
                  type="text"
                  value={intakeAnswers[q.id] || ""}
                  onChange={(e) => setIntakeAnswers((a) => ({ ...a, [q.id]: e.target.value }))}
                  placeholder={q.placeholder}
                  className="w-full rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500/50"
                  style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }}
                />
              )}
              {(fieldRecordingId === `intake:${q.id}` || fieldTranscribingId === `intake:${q.id}`) && (
                <div className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs" style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border-subtle)", color: "var(--text-secondary)" }}>
                  {fieldRecordingId === `intake:${q.id}` ? <span className="h-2 w-2 rounded-full bg-danger-500 animate-pulse" /> : <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  <span>{fieldRecordingId === `intake:${q.id}` ? `Recording ${formatRecordingTime(fieldRecordSeconds)}` : "Transcribing voice..."}</span>
                </div>
              )}
            </div>
          ))}

          <Button onClick={handleContinueFromDetails} className="w-full flex items-center justify-center gap-2">
            Continue to Client Information, blanks are okay
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Card>
      </div>
    );
  }

  // Parties & court heading details (step 4)
  if (stage === "parties") {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Stepper current={4} />
        <div className="flex items-center gap-3">
          <button onClick={() => setStage("details")} style={{ color: "var(--text-tertiary)" }}>
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>Client Information</h1>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Add party, opponent, and court details. Blank fields become ___ in the draft.</p>
          </div>
        </div>

        {error && (
          <div className="rounded-lg px-4 py-3 text-sm" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444" }}>
            {error}
          </div>
        )}

        <Card className="p-6 space-y-6">
          {/* Court & case number */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest mb-3 pb-1.5" style={{ color: "var(--text-tertiary)", borderBottom: "1px solid var(--border-subtle)" }}>Court &amp; Case No.</p>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium" style={{ color: "var(--text-primary)" }}>FIR / Case No.</label>
                  <input type="text" value={firNo} onChange={(e) => setFirNo(e.target.value)} placeholder="e.g. 123/2024 or Crl. A. 45/2023" className="w-full rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500/50" style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }} />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium" style={{ color: "var(--text-primary)" }}>Police Station</label>
                  <input type="text" value={policeStation} onChange={(e) => setPoliceStation(e.target.value)} placeholder="e.g. PS City, Faisalabad" className="w-full rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500/50" style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium" style={{ color: "var(--text-primary)" }}>Court Name <span style={{ color: "var(--text-tertiary)", fontWeight: 400 }}>(for heading)</span></label>
                  <input type="text" value={courtName} onChange={(e) => setCourtName(e.target.value)} placeholder="e.g. Court of Sessions Judge" className="w-full rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500/50" style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }} />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium" style={{ color: "var(--text-primary)" }}>District / City <span style={{ color: "var(--text-tertiary)", fontWeight: 400 }}>(for heading)</span></label>
                  <input type="text" value={districtName} onChange={(e) => setDistrictName(e.target.value)} placeholder="e.g. Faisalabad / Multan / Sahiwal" className="w-full rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500/50" style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }} />
                </div>
              </div>
            </div>
          </div>

          {/* Parties */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest mb-3 pb-1.5" style={{ color: "var(--text-tertiary)", borderBottom: "1px solid var(--border-subtle)" }}>Parties</p>
            <div className="space-y-3">
              <div className="grid gap-3 md:grid-cols-2">
                <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-tertiary)" }}>Client / Petitioner / Accused</p>
                <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-tertiary)" }}>Opponent / Respondent / Complainant</p>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium" style={{ color: "var(--text-primary)" }}>Name</label>
                  <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="e.g. Muhammad Aslam" className="w-full rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500/50" style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }} />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium" style={{ color: "var(--text-primary)" }}>Name</label>
                  <input type="text" value={opponentName} onChange={(e) => setOpponentName(e.target.value)} placeholder="e.g. State / Tariq Mehmood" className="w-full rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500/50" style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }} />
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium" style={{ color: "var(--text-primary)" }}>Father Name</label>
                  <input type="text" value={clientFatherName} onChange={(e) => setClientFatherName(e.target.value)} placeholder="e.g. Muhammad Ali" className="w-full rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500/50" style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }} />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium" style={{ color: "var(--text-primary)" }}>Father Name</label>
                  <input type="text" value={opponentFatherName} onChange={(e) => setOpponentFatherName(e.target.value)} placeholder="e.g. Muhammad Yousaf" className="w-full rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500/50" style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }} />
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium" style={{ color: "var(--text-primary)" }}>CNIC</label>
                  <input type="text" value={clientCnic} onChange={(e) => setClientCnic(e.target.value)} placeholder="e.g. 35201-1234567-1" className="w-full rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500/50" style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }} />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium" style={{ color: "var(--text-primary)" }}>CNIC</label>
                  <input type="text" value={opponentCnic} onChange={(e) => setOpponentCnic(e.target.value)} placeholder="e.g. 35202-1234567-1" className="w-full rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500/50" style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }} />
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium" style={{ color: "var(--text-primary)" }}>Address</label>
                  <input type="text" value={clientAddress} onChange={(e) => setClientAddress(e.target.value)} placeholder="e.g. House 12, Civil Lines, Faisalabad" className="w-full rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500/50" style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }} />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium" style={{ color: "var(--text-primary)" }}>Address</label>
                  <input type="text" value={opponentAddress} onChange={(e) => setOpponentAddress(e.target.value)} placeholder="e.g. House 20, Cantt Road, Multan" className="w-full rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500/50" style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }} />
                </div>
              </div>
            </div>
          </div>

          {/* Search scope */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest mb-3 pb-1.5" style={{ color: "var(--text-tertiary)", borderBottom: "1px solid var(--border-subtle)" }}>Search Scope</p>
            <div className="space-y-4">
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
            </div>
          </div>

          <button
            onClick={() => void handleResearch()}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all"
            style={{ background: "linear-gradient(135deg, #06b6d4, #7c3aed)", color: "white", boxShadow: "0 0 20px rgba(6,182,212,0.3)" }}
          >
            <Search className="h-4 w-4" />
            Research Judgments &amp; Build Case
          </button>
        </Card>
      </div>
    );
  }

  // Input stage (default) — step 1: what's the case about?
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Stepper current={1} />
      {/* Page header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(6,182,212,0.15)" }}>
            <Search className="h-4 w-4" style={{ color: "#06b6d4" }} />
          </div>
          <h1 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>Case Builder</h1>
          {/* Reveal the "How It Works" helper on demand — keeps the form clean */}
          <div className="relative ml-auto">
            <button
              onClick={() => setShowHelp((v) => !v)}
              title="How It Works"
              aria-label="How It Works"
              className={`grid place-items-center h-8 w-8 rounded-lg border transition-all ${
                showHelp
                  ? "bg-primary-500/15 border-primary-500/40 text-primary-300"
                  : "border-[var(--border-default)] bg-[var(--bg-surface-2)] text-[var(--text-tertiary)] hover:text-primary-400 hover:border-primary-500/40"
              }`}
            >
              <HelpCircle className="h-4 w-4" />
            </button>

            {showHelp && (
              <>
                {/* click-outside backdrop */}
                <div className="fixed inset-0 z-10" onClick={() => setShowHelp(false)} />
                <div
                  className="absolute right-0 top-full mt-2 w-72 z-20 rounded-xl p-4 space-y-3"
                  style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border-default)", boxShadow: "0 12px 32px rgba(0,0,0,0.5)" }}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-tertiary)" }}>How It Works</p>
                    <button onClick={() => setShowHelp(false)} title="Close" aria-label="Close" className="grid place-items-center h-6 w-6 rounded-lg transition-colors hover:bg-[var(--bg-surface-1)]">
                      <X className="h-3.5 w-3.5" style={{ color: "var(--text-tertiary)" }} />
                    </button>
                  </div>
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
                </div>
              </>
            )}
          </div>
        </div>
        <p className="text-sm pl-0.5" style={{ color: "var(--text-secondary)" }}>
          Start with your case — AI will guide you step by step, find relevant judgments, and draft your document.
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-2.5 rounded-lg px-4 py-3 text-sm" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444" }}>
          <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          {error}
        </div>
      )}

      <Card className="p-6 space-y-6">

        {/* ── Law sections / case type ── */}
        <div className="space-y-1.5">
          <label className="block text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            Law Section(s) / Case Type <span style={{ color: "#ef4444" }}>*</span>
          </label>
          <input
            type="text"
            value={sections}
            onChange={(e) => setSections(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && sections.trim() && !intakeLoading) void handleStartIntake(); }}
            placeholder="e.g. 489-F PPC / 497 CrPC / custody / maintenance / car theft"
            className="w-full rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500/50"
            style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }}
          />
          <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>Use sections with law name, or a short case type if the section is not known.</p>
        </div>

        {/* ── Document needed ── */}
        <div className="space-y-1.5">
          <label className="block text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            Document Needed <span style={{ color: "var(--text-tertiary)", fontWeight: 400 }}>(optional)</span>
          </label>
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
          <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>What you want to prepare — you can change this later.</p>
        </div>

        {/* ── Draft language ── */}
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

        {/* Continue */}
        <button
          onClick={handleStartIntake}
          disabled={!sections.trim() || intakeLoading}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: "linear-gradient(135deg, #06b6d4, #7c3aed)",
            color: "white",
            boxShadow: sections.trim() ? "0 0 20px rgba(6,182,212,0.3)" : "none",
          }}
        >
          {intakeLoading ? "Reading section…" : "Continue"}
          {!intakeLoading && <ChevronRight className="h-4 w-4" />}
        </button>
      </Card>
    </div>
  );
}
