"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  X, Bookmark, Copy, Check, Sparkles, Scale, Building2,
  ScrollText, Quote, BookText, Loader2, BadgeCheck, Network,
} from "lucide-react";
import {
  isJudgmentSaved, toggleSavedJudgment, onSavedJudgmentsChange,
} from "@/lib/judgment-store";
import {
  extractCitations, extractStatutes, parseParties, toParagraphs,
} from "@/lib/judgment-parse";

export interface ReaderJudgment {
  id: number;
  citation: string;
  reported: boolean;
  court: string;
  year: number;
  title: string | null;
  caseNo: string | null;
}

interface Props {
  judgment: ReaderJudgment;
  onClose: () => void;
  /** Run a fresh citation search for the clicked cited case. */
  onSearchCitation: (citation: string) => void;
}

function authority(court: string): "binding" | "persuasive" | null {
  if (/supreme court/i.test(court)) return "binding";
  if (/high court|shariat/i.test(court)) return "persuasive";
  return null;
}

// Court-judgment serif — gives the reader an authentic "reported page" feel
// that the rest of the (sans) UI deliberately doesn't have.
const SERIF = "'Georgia', 'Times New Roman', 'Noto Serif', serif";

export default function JudgmentReader({ judgment, onClose, onSearchCitation }: Props) {
  const [content, setContent] = useState<string | null>(null);
  const [citedBy, setCitedBy] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const [headnote, setHeadnote] = useState<string | null>(null);
  const [hnLoading, setHnLoading] = useState(false);
  const [hnError, setHnError] = useState("");

  // normalised-citation → judgment id, for cited cases that exist in the archive
  const [verified, setVerified] = useState<Record<string, number>>({});

  // ── saved state sync ──
  useEffect(() => {
    const sync = () => setSaved(isJudgmentSaved(judgment.id));
    sync();
    return onSavedJudgmentsChange(sync);
  }, [judgment.id]);

  // ── lock body scroll + Esc to close ──
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  // ── fetch full text ──
  useEffect(() => {
    let alive = true;
    setLoading(true); setContent(null); setCitedBy(0);
    setHeadnote(null); setHnError("");
    fetch(`/api/judgments/local/${judgment.id}`)
      .then((r) => r.json())
      .then((d) => { if (alive) { setContent(d.judgment?.content || null); setCitedBy(d.citedBy || 0); } })
      .catch(() => { if (alive) setContent(null); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [judgment.id]);

  // ── derived structure ──
  const parties = useMemo(() => parseParties(judgment.title, content), [judgment.title, content]);
  const paragraphs = useMemo(() => (content ? toParagraphs(content) : []), [content]);
  const citations = useMemo(() => (content ? extractCitations(content, judgment.citation) : []), [content, judgment.citation]);
  const statutes = useMemo(() => (content ? extractStatutes(content) : []), [content]);
  const normCite = (s: string) => s.replace(/[^a-z0-9]/gi, "").toUpperCase();
  const verifiedCount = citations.filter((c) => normCite(c) in verified).length;

  // ── verify cited cases against the archive ──
  useEffect(() => {
    setVerified({});
    if (!citations.length) return;
    let alive = true;
    fetch("/api/judgments/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ citations }),
    })
      .then((r) => r.json())
      .then((d) => { if (alive && d.matches) setVerified(d.matches); })
      .catch(() => {});
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [citations.join("|")]);
  const auth = authority(judgment.court);
  const heading = judgment.title || judgment.caseNo || judgment.citation;

  const handleSave = () => {
    toggleSavedJudgment({
      id: judgment.id, citation: judgment.citation, reported: judgment.reported,
      court: judgment.court, year: judgment.year, title: judgment.title, caseNo: judgment.caseNo,
    });
  };

  const handleCopy = async () => {
    if (!content) return;
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleHeadnote = useCallback(async () => {
    if (headnote) { setHeadnote(null); return; }
    if (!content) return;
    setHnLoading(true); setHnError("");
    try {
      const fd = new FormData();
      fd.append("mode", "summarize");
      fd.append("pdfText", content.slice(0, 12000));
      const res = await fetch("/api/ai/judgment", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setHeadnote(data.result);
    } catch (err) {
      setHnError(err instanceof Error ? err.message : "Could not generate headnote.");
    } finally {
      setHnLoading(false);
    }
  }, [headnote, content]);

  const railCard = { background: "var(--bg-surface-1)", border: "1px solid var(--border-subtle)" };

  const modal = (
    <div className="fixed inset-0 z-[100] flex flex-col" style={{ background: "rgba(4,8,12,0.86)", backdropFilter: "blur(6px)" }}>
      {/* ── top toolbar ── */}
      <div className="flex items-center gap-3 px-4 py-3 flex-shrink-0" style={{ background: "var(--bg-surface-1)", borderBottom: "1px solid var(--border-subtle)" }}>
        <button onClick={onClose} aria-label="Close reader"
          className="grid place-items-center w-9 h-9 rounded-lg transition-colors hover:text-[var(--text-primary)]"
          style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border-default)", color: "var(--text-secondary)" }}>
          <X className="h-4 w-4" />
        </button>
        <div className="min-w-0 flex items-center gap-2">
          <BookText className="h-4 w-4 flex-shrink-0 text-primary-400" />
          <span className="truncate text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{heading}</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button onClick={handleHeadnote} disabled={hnLoading || loading || !content}
            className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-medium rounded-lg transition-all disabled:opacity-40"
            style={headnote
              ? { background: "rgba(167,139,250,0.12)", border: "1px solid rgba(167,139,250,0.4)", color: "var(--color-ai-500, #a78bfa)" }
              : { background: "var(--bg-surface-2)", border: "1px solid var(--border-default)", color: "var(--text-secondary)" }}>
            <Sparkles className="h-3.5 w-3.5 text-ai-500" /> {hnLoading ? "Reading…" : headnote ? "Hide Headnote" : "AI Headnote"}
          </button>
          <button onClick={handleCopy} disabled={!content}
            className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-medium rounded-lg transition-all disabled:opacity-40"
            style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border-default)", color: "var(--text-secondary)" }}>
            {copied ? <Check className="h-3.5 w-3.5 text-success-500" /> : <Copy className="h-3.5 w-3.5" />} {copied ? "Copied" : "Copy"}
          </button>
          <button onClick={handleSave}
            className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-semibold rounded-lg transition-all"
            style={saved
              ? { background: "rgba(6,182,212,0.12)", border: "1px solid rgba(6,182,212,0.35)", color: "var(--color-primary-300)" }
              : { background: "var(--bg-surface-2)", border: "1px solid var(--border-default)", color: "var(--text-secondary)" }}>
            <Bookmark className="h-3.5 w-3.5" fill={saved ? "currentColor" : "none"} /> {saved ? "Saved" : "Save"}
          </button>
        </div>
      </div>

      {/* ── body: document + rail ── */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-[1200px] px-4 py-8 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">

          {/* document page */}
          <article className="rounded-2xl overflow-hidden mx-auto w-full max-w-[820px]"
            style={{ background: "var(--bg-surface-1)", border: "1px solid var(--border-subtle)", boxShadow: "0 12px 40px rgba(0,0,0,0.35)" }}>
            <div className="px-8 sm:px-14 py-12" style={{ fontFamily: SERIF }}>

              {/* header */}
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[13px] font-bold font-mono bg-primary-500/12 text-primary-300 border border-primary-500/25">
                  {judgment.citation}
                </div>
                <div className="mt-3 flex items-center justify-center gap-2 text-[13px]" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-sans)" }}>
                  <Building2 className="h-3.5 w-3.5" style={{ color: "var(--text-tertiary)" }} />
                  {judgment.court}{judgment.year ? ` · ${judgment.year}` : ""}
                  {auth && (
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-md ${auth === "binding" ? "bg-success-500/10 text-success-500 border border-success-500/25" : "bg-warning-500/10 text-warning-500 border border-warning-500/25"}`}>
                      <Scale className="h-2.5 w-2.5" />{auth === "binding" ? "Binding" : "Persuasive"}
                    </span>
                  )}
                </div>

                {/* parties */}
                {parties ? (
                  <div className="mt-7">
                    <h2 className="text-[22px] font-bold leading-snug" style={{ color: "var(--text-primary)" }}>{parties.petitioner}</h2>
                    <div className="my-2 text-[13px] italic tracking-wide" style={{ color: "var(--text-tertiary)" }}>versus</div>
                    <h2 className="text-[22px] font-bold leading-snug" style={{ color: "var(--text-primary)" }}>{parties.respondent}</h2>
                  </div>
                ) : (
                  <h2 className="mt-7 text-[22px] font-bold leading-snug" style={{ color: "var(--text-primary)" }}>{heading}</h2>
                )}

                {judgment.caseNo && (
                  <div className="mt-4 text-[13px]" style={{ color: "var(--text-tertiary)", fontFamily: "var(--font-sans)" }}>{judgment.caseNo}</div>
                )}

                <div className="mx-auto mt-7 mb-2 h-px w-2/3" style={{ background: "var(--border-default)" }} />
              </div>

              {/* AI headnote */}
              {(hnLoading || headnote || hnError) && (
                <div className="my-6 rounded-xl p-5 bg-ai-500/[0.06] border border-ai-500/15" style={{ fontFamily: "var(--font-sans)" }}>
                  <div className="flex items-center gap-1.5 mb-2"><Sparkles className="h-3.5 w-3.5 text-ai-500" /><span className="text-[11px] font-semibold text-ai-500 uppercase tracking-wide">AI Headnote</span></div>
                  {hnLoading
                    ? <div className="flex items-center gap-2 text-sm" style={{ color: "var(--text-tertiary)" }}><Loader2 className="h-4 w-4 animate-spin" /> Reading the judgment…</div>
                    : hnError
                      ? <p className="text-sm text-danger-500">{hnError}</p>
                      : <p className="whitespace-pre-wrap text-[13.5px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>{headnote}</p>}
                </div>
              )}

              {/* body */}
              {loading ? (
                <div className="flex flex-col items-center justify-center gap-3 py-20" style={{ fontFamily: "var(--font-sans)" }}>
                  <Loader2 className="h-6 w-6 animate-spin text-primary-400" />
                  <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>Loading judgment text…</p>
                </div>
              ) : paragraphs.length > 0 ? (
                <div className="space-y-4 mt-6">
                  {paragraphs.map((p, i) => (
                    <p key={i} className="text-[15px] leading-[1.85] text-justify" style={{ color: "var(--text-secondary)" }}>{p}</p>
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center" style={{ fontFamily: "var(--font-sans)" }}>
                  <ScrollText className="h-10 w-10 mx-auto mb-3" style={{ color: "var(--border-strong)" }} />
                  <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>Full text not yet extracted for this judgment.</p>
                </div>
              )}
            </div>
          </article>

          {/* right rail */}
          <aside className="space-y-4 lg:sticky lg:top-4 order-first lg:order-none">
            {/* cited-by — "good law" signal from the citation network */}
            {citedBy > 0 && (
              <div className="rounded-2xl p-4 flex items-center gap-3" style={{ background: "rgba(6,182,212,0.07)", border: "1px solid rgba(6,182,212,0.25)" }}>
                <span className="grid place-items-center w-9 h-9 rounded-xl flex-shrink-0 bg-primary-500/15">
                  <Network className="h-4 w-4 text-primary-400" />
                </span>
                <div className="min-w-0">
                  <div className="text-[15px] font-bold" style={{ color: "var(--text-primary)" }}>Cited by {citedBy.toLocaleString()}</div>
                  <div className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>judgment{citedBy > 1 ? "s" : ""} in your archive</div>
                </div>
              </div>
            )}

            {/* meta */}
            <div className="rounded-2xl p-4" style={railCard}>
              <h4 className="text-[11px] font-bold tracking-wide uppercase mb-3" style={{ color: "var(--text-tertiary)" }}>This Judgment</h4>
              <dl className="space-y-2 text-[12px]">
                <div className="flex justify-between gap-3"><dt style={{ color: "var(--text-tertiary)" }}>Court</dt><dd className="text-right font-medium" style={{ color: "var(--text-secondary)" }}>{judgment.court}</dd></div>
                {judgment.year ? <div className="flex justify-between gap-3"><dt style={{ color: "var(--text-tertiary)" }}>Year</dt><dd className="font-medium" style={{ color: "var(--text-secondary)" }}>{judgment.year}</dd></div> : null}
                <div className="flex justify-between gap-3"><dt style={{ color: "var(--text-tertiary)" }}>Status</dt><dd className="font-medium" style={{ color: "var(--text-secondary)" }}>{judgment.reported ? "Reported" : "Unreported"}</dd></div>
                {auth && <div className="flex justify-between gap-3"><dt style={{ color: "var(--text-tertiary)" }}>Authority</dt><dd className={`font-semibold ${auth === "binding" ? "text-success-500" : "text-warning-500"}`}>{auth === "binding" ? "Binding" : "Persuasive"}</dd></div>}
              </dl>
            </div>

            {/* statutes */}
            {statutes.length > 0 && (
              <div className="rounded-2xl p-4" style={railCard}>
                <h4 className="flex items-center gap-1.5 text-[11px] font-bold tracking-wide uppercase mb-3" style={{ color: "var(--text-tertiary)" }}>
                  <ScrollText className="h-3.5 w-3.5" /> Statutes Referenced
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {statutes.map((s) => (
                    <span key={s} className="px-2.5 py-1 text-[11px] rounded-lg" style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border-subtle)", color: "var(--text-secondary)" }}>{s}</span>
                  ))}
                </div>
              </div>
            )}

            {/* cited cases — clickable, searches our own corpus; verified against archive */}
            <div className="rounded-2xl p-4" style={railCard}>
              <h4 className="flex items-center justify-between text-[11px] font-bold tracking-wide uppercase mb-3" style={{ color: "var(--text-tertiary)" }}>
                <span className="flex items-center gap-1.5"><Quote className="h-3.5 w-3.5" /> Cited Cases</span>
                {citations.length > 0 && <span className="text-primary-400">{citations.length}</span>}
              </h4>
              {loading ? (
                <p className="text-[12px]" style={{ color: "var(--text-tertiary)" }}>Scanning…</p>
              ) : citations.length === 0 ? (
                <p className="text-[12px]" style={{ color: "var(--text-tertiary)" }}>No citations detected in this judgment.</p>
              ) : (
                <div className="space-y-1.5">
                  {verifiedCount > 0 && (
                    <p className="flex items-center gap-1.5 text-[10px] mb-1 font-medium text-success-500">
                      <BadgeCheck className="h-3.5 w-3.5" /> {verifiedCount} of {citations.length} found in your archive
                    </p>
                  )}
                  {citations.map((c) => {
                    const inArchive = normCite(c) in verified;
                    return (
                      <button key={c} onClick={() => onSearchCitation(c)} title={inArchive ? "In your archive — tap to open" : "Not in your archive — tap to search"}
                        className="w-full text-left px-3 py-2 rounded-lg text-[12px] font-mono font-medium transition-all group flex items-center justify-between gap-2"
                        style={inArchive
                          ? { background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.3)", color: "var(--text-secondary)" }
                          : { background: "var(--bg-surface-2)", border: "1px solid var(--border-subtle)", color: "var(--text-tertiary)" }}>
                        <span className="flex items-center gap-1.5 min-w-0">
                          {inArchive
                            ? <BadgeCheck className="h-3.5 w-3.5 flex-shrink-0 text-success-500" />
                            : <span className="h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ background: "var(--border-strong)" }} />}
                          <span className="truncate">{c}</span>
                        </span>
                        <Quote className="h-3 w-3 flex-shrink-0 opacity-0 group-hover:opacity-100 text-primary-400" />
                      </button>
                    );
                  })}
                  <p className="text-[10px] pt-1.5" style={{ color: "var(--text-tertiary)" }}>
                    <span className="text-success-500">✓</span> = in your archive. Tap any citation to pull it up.
                  </p>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );

  return typeof document !== "undefined" ? createPortal(modal, document.body) : modal;
}
