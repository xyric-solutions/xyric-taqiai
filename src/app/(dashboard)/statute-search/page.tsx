"use client";

import { useState } from "react";
import { Search, BookMarked, Copy, Check, X, Sparkles, Library, Scale, ArrowRight } from "lucide-react";

// ── Statute catalogue ──────────────────────────────────────────────────────────

const STATUTES = [
  {
    code: "PPC", name: "Pakistan Penal Code 1860", color: "#ef4444",
    sections: [
      { no: "302", title: "Qatl-e-Amd (Murder)" }, { no: "377", title: "Unnatural Offences" },
      { no: "420", title: "Cheating & Dishonesty" }, { no: "406", title: "Criminal Breach of Trust" },
      { no: "300", title: "Culpable Homicide" }, { no: "34", title: "Common Intention" },
      { no: "107", title: "Abetment" }, { no: "365-B", title: "Kidnapping (Woman)" },
      { no: "295-C", title: "Blasphemy" }, { no: "17", title: "Qisas / Diyat" },
    ],
  },
  {
    code: "CrPC", name: "Code of Criminal Procedure 1898", color: "#f59e0b",
    sections: [
      { no: "497", title: "Bail (Post-Arrest)" }, { no: "498", title: "Bail (Pre-Arrest)" },
      { no: "154", title: "FIR Registration" }, { no: "22-A", title: "Complaint to Sessions Judge" },
      { no: "265-C", title: "Framing of Charges" }, { no: "561-A", title: "High Court Inherent Power" },
      { no: "382-B", title: "Benefit of Doubt" }, { no: "173", title: "Police Report (Challan)" },
    ],
  },
  {
    code: "CPC", name: "Code of Civil Procedure 1908", color: "#06b6d4",
    sections: [
      { no: "9", title: "Civil Court Jurisdiction" }, { no: "151", title: "Inherent Powers" },
      { no: "O.XXXIX", title: "Temporary Injunction" }, { no: "O.XXXVII", title: "Summary Suit" },
      { no: "O.XXXVIII", title: "Attachment Before Judgment" }, { no: "O.XLI", title: "First Appeal" },
      { no: "80", title: "Notice Against Govt" },
    ],
  },
  {
    code: "MFLO", name: "Muslim Family Laws Ordinance 1961", color: "#ec4899",
    sections: [
      { no: "7", title: "Talaq Procedure" }, { no: "9", title: "Maintenance" },
      { no: "6", title: "Polygamy" }, { no: "5", title: "Nikah Registration" },
    ],
  },
  {
    code: "SRA", name: "Specific Relief Act 1877", color: "#10b981",
    sections: [
      { no: "8", title: "Recovery of Possession" }, { no: "12", title: "Specific Performance" },
      { no: "39", title: "Cancellation of Instrument" }, { no: "42", title: "Declaratory Decree" },
    ],
  },
  {
    code: "FCA", name: "Family Courts Act 1964", color: "#a78bfa",
    sections: [
      { no: "5 (Sch)", title: "Family Court Jurisdiction" }, { no: "10", title: "Reconciliation Procedure" },
      { no: "14", title: "Decree Execution" }, { no: "17-A", title: "Interim Maintenance" },
    ],
  },
];

interface Result { raw: string; query: string; }

function detectBinding(text: string): "binding" | "persuasive" | null {
  if (/supreme court|SCMR/i.test(text)) return "binding";
  if (/(high court|PCrLJ|MLD|CLC|YLR|lahore high court|sindh high court)/i.test(text)) return "persuasive";
  return null;
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function StatuteSearchPage() {
  const [query, setQuery] = useState("");
  const [activeStatute, setActiveStatute] = useState<string>("PPC");
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const current = STATUTES.find((s) => s.code === activeStatute)!;

  const handleSearch = async (q?: string) => {
    const finalQuery = q ?? query;
    if (!finalQuery.trim()) return;
    setLoading(true); setError(""); setResult(null);
    try {
      const fd = new FormData();
      fd.append("query", `Find Pakistani court judgments that cited and interpreted ${finalQuery}. List key judgments, their citations, courts, and the legal principle established regarding this section.`);
      fd.append("mode", "search");
      const res = await fetch("/api/ai/judgment", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Search failed");
      setResult({ raw: data.result, query: finalQuery });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSectionClick = (no: string) => { const q = `${activeStatute} Section ${no}`; setQuery(q); handleSearch(q); };
  const handleCopy = () => { if (result) navigator.clipboard.writeText(result.raw); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const binding = result ? detectBinding(result.raw) : null;

  const card = { background: "var(--bg-surface-1)", border: "1px solid var(--border-subtle)" };

  return (
    <div className="space-y-5">

      {/* ── Header ── */}
      <div>
        <h1 className="font-display text-2xl font-extrabold tracking-tight flex items-center gap-2.5" style={{ color: "var(--text-primary)" }}>
          <span className="w-9 h-9 rounded-xl grid place-items-center bg-primary-500/10"><Library className="h-5 w-5 text-primary-400" strokeWidth={1.75} /></span>
          Statute Search
        </h1>
        <p className="text-[13px] mt-1.5" style={{ color: "var(--text-secondary)" }}>Pick a section, find every judgment that cited and interpreted it.</p>
      </div>

      {/* ── Search bar ── */}
      <div className="flex gap-2">
        <div className="flex items-center gap-3 flex-1 rounded-xl px-4 focus-within:border-primary-500/40 transition-colors" style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border-default)" }}>
          <Search className="h-5 w-5 flex-shrink-0" strokeWidth={1.75} style={{ color: "var(--text-tertiary)" }} />
          <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Type a section, e.g. PPC 302, CrPC 497, MFLO Section 7"
            className="flex-1 bg-transparent text-sm py-3.5 focus:outline-none border-0" style={{ color: "var(--text-primary)" }} />
          {query && <button onClick={() => setQuery("")} style={{ color: "var(--text-tertiary)" }} className="hover:text-[var(--text-primary)]"><X className="h-4 w-4" /></button>}
        </div>
        <button onClick={() => handleSearch()} disabled={!query.trim() || loading}
          className="flex items-center gap-2 px-6 bg-primary-500 hover:bg-primary-400 text-[#07090f] font-semibold text-sm rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0">
          <Search className="h-4 w-4" strokeWidth={2.25} /> Search
        </button>
      </div>

      {/* ── Statute tabs (horizontal) ── */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mb-1">
        {STATUTES.map((s) => {
          const on = activeStatute === s.code;
          return (
            <button key={s.code} onClick={() => setActiveStatute(s.code)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl flex-shrink-0 transition-all"
              style={on
                ? { background: `${s.color}1a`, border: `1px solid ${s.color}66`, color: s.color }
                : { background: "var(--bg-surface-1)", border: "1px solid var(--border-subtle)", color: "var(--text-secondary)" }}>
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: s.color, opacity: on ? 1 : 0.45 }} />
              <span className="text-[13px] font-bold">{s.code}</span>
              <span className="text-[11px] hidden md:inline" style={{ color: on ? s.color : "var(--text-tertiary)", opacity: on ? 0.8 : 1 }}>{s.name.replace(/ \d{4}$/, "")}</span>
            </button>
          );
        })}
      </div>

      {/* ── Section chip grid for active statute ── */}
      <div className="rounded-2xl p-4" style={card}>
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full" style={{ background: current.color }} />
          <h2 className="text-[13px] font-bold" style={{ color: "var(--text-primary)" }}>{current.name}</h2>
          <span className="text-[11px] ml-auto font-mono" style={{ color: "var(--text-tertiary)" }}>{current.sections.length} common sections</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {current.sections.map((sec) => (
            <button key={sec.no} onClick={() => handleSectionClick(sec.no)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left group transition-all hover:bg-[var(--bg-surface-2)]"
              style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border-subtle)" }}>
              <span className="text-[12px] font-bold font-mono flex-shrink-0 px-1.5 py-0.5 rounded-md" style={{ color: current.color, background: `${current.color}14` }}>§{sec.no}</span>
              <span className="flex-1 text-[12.5px] truncate" style={{ color: "var(--text-secondary)" }}>{sec.title}</span>
              <ArrowRight className="h-3.5 w-3.5 flex-shrink-0 opacity-0 group-hover:opacity-100 group-hover:text-primary-400 transition-all" style={{ color: "var(--text-tertiary)" }} strokeWidth={2} />
            </button>
          ))}
        </div>
      </div>

      {/* ── Results (full width) ── */}
      {error && (
        <div className="flex items-center justify-between p-4 rounded-xl text-sm text-danger-500 bg-danger-500/10 border border-danger-500/20">
          <span>{error}</span><button onClick={() => setError("")}><X className="h-4 w-4" /></button>
        </div>
      )}

      {loading && (
        <div className="rounded-xl p-12 flex flex-col items-center gap-4" style={card}>
          <div className="flex items-center gap-1.5">{[0, 150, 300].map((d) => <div key={d} className="w-2.5 h-2.5 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />)}</div>
          <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>Searching Pakistani case law…</p>
        </div>
      )}

      {result && !loading && (
        <div className="rounded-xl overflow-hidden" style={card}>
          <div className="flex items-center justify-between px-5 py-3.5 gap-3 flex-wrap" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
            <div className="flex items-center gap-2.5 flex-wrap min-w-0">
              <Sparkles className="h-4 w-4 text-ai-500 flex-shrink-0" strokeWidth={2} />
              <span className="text-sm font-bold font-mono truncate" style={{ color: "var(--text-primary)" }}>{result.query}</span>
              {binding === "binding" && <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-md bg-success-500/10 text-success-500 border border-success-500/25"><Scale className="h-2.5 w-2.5" strokeWidth={2.5} />Binding · SC</span>}
              {binding === "persuasive" && <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-md bg-warning-500/10 text-warning-500 border border-warning-500/25"><Scale className="h-2.5 w-2.5" strokeWidth={2.5} />Persuasive · HC</span>}
            </div>
            <button onClick={handleCopy} className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium rounded-lg hover:text-[var(--text-primary)] transition-all" style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border-default)", color: "var(--text-secondary)" }}>
              {copied ? <Check className="h-3.5 w-3.5 text-success-500" /> : <Copy className="h-3.5 w-3.5" />}{copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <div className="p-5"><div className="whitespace-pre-wrap text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{result.raw}</div></div>
        </div>
      )}

      {!result && !loading && !error && (
        <div className="rounded-xl p-10 flex flex-col items-center text-center" style={card}>
          <div className="w-16 h-16 rounded-2xl grid place-items-center mb-4" style={{ background: "var(--bg-surface-2)" }}><BookMarked className="h-7 w-7" style={{ color: "var(--text-tertiary)" }} /></div>
          <h3 className="text-sm font-bold" style={{ color: "var(--text-secondary)" }}>Tap a section above, or type one to search</h3>
          <p className="text-[12px] mt-1.5 max-w-sm" style={{ color: "var(--text-tertiary)" }}>Find every reported judgment that cited and interpreted a statute section, with its citation and the principle it established.</p>
          <div className="flex flex-wrap justify-center gap-2 mt-5">
            {["PPC 302", "CrPC 497", "CPC O.XXXIX", "MFLO Section 7", "SRA Section 12"].map((ex) => (
              <button key={ex} onClick={() => { setQuery(ex); handleSearch(ex); }} className="px-3 py-1.5 text-[11px] font-medium rounded-lg font-mono hover:text-primary-400 hover:border-primary-500/30 transition-all" style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border-subtle)", color: "var(--text-secondary)" }}>{ex}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
