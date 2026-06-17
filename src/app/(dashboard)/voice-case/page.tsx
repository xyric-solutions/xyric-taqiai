"use client";

import { useState } from "react";
import { saveDocument, updateDocumentContent } from "@/lib/document-store";
import VoiceRecorder from "@/components/documents/VoiceRecorder";
import DocumentPreview from "@/components/documents/DocumentPreview";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import {
  Mic, Sparkles, ArrowLeft, FileText, Scale, Users,
  AlertTriangle, BookOpen, ListChecks,
} from "lucide-react";

interface Party { role: string; name: string; details: string; }
interface CaseAnalysis {
  caseSummary: string;
  parties: Party[];
  facts: string[];
  legalIssues: string[];
  suggestedDocument: string;
  applicableLaw: string[];
  missingInfo: string[];
  draftRequest: string;
}

type Stage = "record" | "analyzing" | "analysis" | "generating" | "document";

export default function VoiceCasePage() {
  const [stage, setStage] = useState<Stage>("record");
  const [transcript, setTranscript] = useState("");
  const [language, setLanguage] = useState("en");
  const [analysis, setAnalysis] = useState<CaseAnalysis | null>(null);
  const [generatedHtml, setGeneratedHtml] = useState("");
  const [savedDocId, setSavedDocId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!transcript.trim()) {
      setError("Please record, upload, or type the discussion first.");
      return;
    }
    setError(null);
    setStage("analyzing");
    try {
      const res = await fetch("/api/ai/case-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript, language }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");
      setAnalysis(data.analysis);
      setStage("analysis");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
      setStage("record");
    }
  };

  const handleGenerate = async () => {
    if (!analysis) return;
    setError(null);
    setStage("generating");
    try {
      const userRequest =
        `${analysis.suggestedDocument}\n\n${analysis.draftRequest}\n\nBased on this advocate–client discussion:\n${transcript}`;
      const res = await fetch("/api/ai/smart-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "generate", userRequest, answers: {}, language }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Document generation failed");
      setGeneratedHtml(data.html);
      const saved = await saveDocument({
        title: analysis.suggestedDocument || "Case from Discussion",
        category: "voice-case",
        subType: "voice",
        language,
        content: data.html,
      });
      if (saved) setSavedDocId(saved.id);
      setStage("document");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Document generation failed");
      setStage("analysis");
    }
  };

  const reset = () => {
    setStage("record");
    setAnalysis(null);
    setGeneratedHtml("");
    setSavedDocId(null);
    setError(null);
  };

  // ── Document preview ──
  if (stage === "document") {
    return (
      <div className="space-y-4">
        <Button variant="outline" onClick={reset}>
          <ArrowLeft className="h-4 w-4" /> New Discussion
        </Button>
        <DocumentPreview
          content={generatedHtml}
          title={analysis?.suggestedDocument || "Case Document"}
          language={language}
          onContentChange={(c) => { if (savedDocId) void updateDocumentContent(savedDocId, c); }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-5 sm:space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-primary-500/15 text-primary-400 flex-shrink-0">
          <Mic className="h-5 w-5" strokeWidth={1.5} />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
            Case from Discussion / گفتگو سے کیس
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-0.5">
            Record (or upload) your discussion with the client — AI listens, analyses the case, and prepares the document.
          </p>
          <p className="text-xs text-[var(--text-tertiary)] mt-0.5" dir="rtl">
            موکل سے گفتگو ریکارڈ کریں — AI سن کر کیس کا تجزیہ کرے گا اور دستاویز تیار کرے گا
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-danger-500/10 border border-danger-500/30 rounded-xl p-3 text-sm text-danger-500">
          {error}
        </div>
      )}

      {/* ── Stage: analyzing / generating ── */}
      {(stage === "analyzing" || stage === "generating") && (
        <Card className="p-12">
          <div className="text-center space-y-4">
            <LoadingSpinner size="lg" />
            <p className="text-[var(--text-secondary)]">
              {stage === "analyzing" ? "AI is analysing the discussion and preparing the case..." : "Drafting the document..."}
            </p>
          </div>
        </Card>
      )}

      {/* ── Stage: record ── */}
      {stage === "record" && (
        <>
          {/* Language toggle */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--text-tertiary)]">Document language:</span>
            <div className="flex gap-2">
              {(["en", "ur"] as const).map((lng) => (
                <button
                  key={lng}
                  onClick={() => setLanguage(lng)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    language === lng
                      ? "bg-primary-600 text-white"
                      : "bg-[var(--bg-surface-2)] text-[var(--text-secondary)] border border-[var(--border-default)]"
                  }`}
                >
                  {lng === "en" ? "English" : "اردو"}
                </button>
              ))}
            </div>
          </div>

          <Card className="p-4 sm:p-6">
            <VoiceRecorder onTranscriptionsReady={(text) => { if (text) setTranscript(text); }} />
          </Card>

          {/* Editable combined transcript */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--text-secondary)]">
              Discussion transcript / گفتگو کا متن
              <span className="text-xs text-[var(--text-tertiary)] font-normal ml-2">— review or edit before analysis</span>
            </label>
            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              rows={6}
              placeholder="The transcript of your recordings appears here. You can also type or paste the discussion directly..."
              className="w-full px-4 py-3 rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface-2)] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm leading-relaxed resize-y"
            />
          </div>

          <Button onClick={handleAnalyze} disabled={!transcript.trim()} className="w-full" size="lg">
            <Sparkles className="h-4 w-4" /> Analyse Case
          </Button>
        </>
      )}

      {/* ── Stage: analysis ── */}
      {stage === "analysis" && analysis && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-primary-400">
            <Scale className="h-4 w-4" />
            <span className="text-sm font-semibold uppercase tracking-wider">Case Analysis</span>
          </div>

          {analysis.caseSummary && (
            <Card className="p-4 sm:p-5">
              <p className="text-sm text-[var(--text-primary)] leading-relaxed">{analysis.caseSummary}</p>
            </Card>
          )}

          {/* Suggested document — highlighted */}
          {analysis.suggestedDocument && (
            <Card className="p-4 sm:p-5 border border-primary-500/30 bg-primary-500/5">
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-primary-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider">Recommended document</p>
                  <p className="text-base font-semibold text-[var(--text-primary)]">{analysis.suggestedDocument}</p>
                  {analysis.applicableLaw?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {analysis.applicableLaw.map((law, i) => (
                        <span key={i} className="text-[11px] px-2 py-0.5 rounded-full bg-[var(--bg-surface-3)] text-primary-400 inline-flex items-center gap-1">
                          <BookOpen className="h-2.5 w-2.5" /> {law}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Parties */}
            {analysis.parties?.length > 0 && (
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2 text-[var(--text-secondary)]"><Users className="h-4 w-4" /><span className="text-xs font-semibold uppercase tracking-wider">Parties</span></div>
                <ul className="space-y-1.5">
                  {analysis.parties.map((p, i) => (
                    <li key={i} className="text-sm text-[var(--text-primary)]">
                      <span className="text-[var(--text-tertiary)]">{p.role}:</span> {p.name}
                      {p.details && <span className="block text-xs text-[var(--text-tertiary)]">{p.details}</span>}
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* Legal issues */}
            {analysis.legalIssues?.length > 0 && (
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2 text-[var(--text-secondary)]"><Scale className="h-4 w-4" /><span className="text-xs font-semibold uppercase tracking-wider">Legal Issues</span></div>
                <ul className="space-y-1 list-disc list-inside">
                  {analysis.legalIssues.map((x, i) => <li key={i} className="text-sm text-[var(--text-primary)]">{x}</li>)}
                </ul>
              </Card>
            )}
          </div>

          {/* Facts */}
          {analysis.facts?.length > 0 && (
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2 text-[var(--text-secondary)]"><ListChecks className="h-4 w-4" /><span className="text-xs font-semibold uppercase tracking-wider">Facts</span></div>
              <ol className="space-y-1 list-decimal list-inside">
                {analysis.facts.map((x, i) => <li key={i} className="text-sm text-[var(--text-primary)] leading-relaxed">{x}</li>)}
              </ol>
            </Card>
          )}

          {/* Missing info */}
          {analysis.missingInfo?.length > 0 && (
            <Card className="p-4 border border-warning-500/30 bg-warning-500/5">
              <div className="flex items-center gap-2 mb-2 text-warning-500"><AlertTriangle className="h-4 w-4" /><span className="text-xs font-semibold uppercase tracking-wider">Missing — confirm with client</span></div>
              <ul className="space-y-1 list-disc list-inside">
                {analysis.missingInfo.map((x, i) => <li key={i} className="text-sm text-[var(--text-secondary)]">{x}</li>)}
              </ul>
              <p className="text-xs text-[var(--text-tertiary)] mt-2">These will be left as blanks (___________) in the document.</p>
            </Card>
          )}

          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setStage("record")} className="sm:w-auto">
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            <Button onClick={handleGenerate} className="flex-1" size="lg">
              <FileText className="h-4 w-4" /> Generate Document
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
