"use client";

import Link from "next/link";
import { useState, useCallback } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import {
  Check, AlertTriangle, Info, Flag, Wand2, Paperclip, Upload, Mic, Send,
  Lock, MoreHorizontal, Pencil, Bold, Italic, Underline, List, ListOrdered,
  Undo2, Redo2, ShieldCheck, FileText, Image as ImageIcon,
  ArrowRight, ChevronDown, Sparkles, Languages, FolderOpen,
} from "lucide-react";

/* ───────────────────────────── Data ───────────────────────────── */

const STEPS = [
  { n: 1, label: "Intake",   state: "done" },
  { n: 2, label: "Facts",    state: "done" },
  { n: 3, label: "Sections", state: "done" },
  { n: 4, label: "Draft",    state: "done" },
  { n: 5, label: "Review",   state: "active" },
  { n: 6, label: "Export",   state: "locked" },
] as const;

const CASE_FACTS = [
  { k: "Accused",          v: "Ali Raza",              status: "Verified" },
  { k: "FIR No.",          v: "123/2024",              status: "Verified", mono: true },
  { k: "Police Station",   v: "Model Town PS, Lahore", status: "Verified" },
  { k: "Offence Sections", v: "324, 506-II PPC",       status: "Needs Review", mono: true },
  { k: "Court",            v: "Sessions Court, Lahore", status: "Verified" },
  { k: "Next Hearing",     v: "24 May 2024",           status: "Verified", mono: true },
  { k: "CNIC",             v: "Missing",               status: "Missing" },
];

const LINKED_DOCS = [
  { name: "FIR Copy.pdf",        date: "18 May 2024", icon: FileText },
  { name: "Arrest Memo.jpg",     date: "18 May 2024", icon: ImageIcon },
  { name: "CNIC (Front).jpg",    date: "18 May 2024", icon: ImageIcon },
  { name: "Residence Proof.pdf", date: "18 May 2024", icon: FileText },
];

const CITATIONS = ["CrPC 497", "PPC 489-F", "SCMR 197", "PLD 2019 SCMR 1221"];

const NOTES = [
  { who: "TaqiAI", note: "Consider adding a legal reference to CrPC 497(1).", time: "10:21 AM", ai: true },
  { who: "You",    note: "Check the recovery memo and the memo witnesses.",  time: "10:25 AM", ai: false },
  { who: "TaqiAI", note: "Strengthen this ground with supporting case law.",  time: "10:28 AM", ai: true },
];

const REVIEW = [
  { icon: Info, accent: "warning", title: "Missing Information", tag: "2 items",
    items: ["CNIC copy of the accused is missing", "Surety details not provided"] },
  { icon: Flag, accent: "danger", title: "Risk Flags", tag: "1 risk",
    items: ["Section 324 PPC is bailable but grant rests on the satisfaction of the court"] },
  { icon: Wand2, accent: "ai", title: "Suggested Edits", tag: "3 suggestions",
    items: ["Cite PLD 2019 SCMR 1221 on bail principles", "Clarify the delay in lodging the FIR", "Add an undertaking to abide by court conditions"] },
];

/* ───────────────────────────── Bits ───────────────────────────── */

function StatusBadge({ status }: { status: string }) {
  const cls: Record<string, string> = {
    Verified:       "text-success-500 bg-success-500/10 border-success-500/20",
    "Needs Review": "text-warning-500 bg-warning-500/10 border-warning-500/25",
    Missing:        "text-danger-500 bg-danger-500/10 border-danger-500/25",
  };
  const icon = status === "Verified"
    ? <Check className="h-3 w-3" strokeWidth={2.5} />
    : status === "Missing"
    ? <AlertTriangle className="h-3 w-3" strokeWidth={2} />
    : <Info className="h-3 w-3" strokeWidth={2} />;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold border whitespace-nowrap ${cls[status]}`}>
      {icon}{status === "Missing" ? "Missing CNIC" : status}
    </span>
  );
}

function Panel({ title, icon: Icon, action, children, noPad }: {
  title: string; icon?: React.ElementType; action?: React.ReactNode; children: React.ReactNode; noPad?: boolean;
}) {
  return (
    <section className="rounded-xl overflow-hidden" style={{ background: "var(--bg-surface-1)", border: "1px solid var(--border-subtle)" }}>
      <header className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
        <div className="flex items-center gap-2">
          {Icon && <Icon className="h-4 w-4 text-primary-400" strokeWidth={1.5} />}
          <h3 className="text-[13px] font-bold" style={{ color: "var(--text-primary)" }}>{title}</h3>
        </div>
        {action}
      </header>
      <div className={noPad ? "" : ""}>{children}</div>
    </section>
  );
}

const ACCENT_TEXT: Record<string, string> = { warning: "text-warning-500", danger: "text-danger-500", ai: "text-ai-500" };
const ACCENT_DOT: Record<string, string> = { warning: "bg-warning-500", danger: "bg-danger-500", ai: "bg-ai-500" };
const ACCENT_TAGBG: Record<string, string> = { warning: "bg-warning-500/10", danger: "bg-danger-500/10", ai: "bg-ai-500/10" };

/* ───────────────────────────── Page ───────────────────────────── */

export default function DraftReviewPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--bg-base)" }}>
      <Sidebar open={sidebarOpen} onClose={closeSidebar} />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* ── Page header ── */}
          <div className="flex items-start justify-between gap-4 px-6 pt-5 pb-3 flex-shrink-0">
            <div>
              <h1 className="font-display text-2xl font-extrabold tracking-tight" style={{ color: "var(--text-primary)" }}>Bail Application Review</h1>
              <p className="text-[12px] mt-0.5 font-mono" style={{ color: "var(--text-tertiary)" }}>Criminal Law · CrPC 497 · Lahore Sessions Court</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-warning-500 bg-warning-500/10 border border-warning-500/25">
                <AlertTriangle className="h-3.5 w-3.5" strokeWidth={2} /> AI Generated · Verify before filing
              </span>
              <button className="p-2 rounded-lg transition-colors hover:bg-[var(--bg-surface-2)]" style={{ color: "var(--text-secondary)", border: "1px solid var(--border-default)" }}>
                <MoreHorizontal className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>
          </div>

          {/* ── Stepper ── */}
          <div className="flex items-stretch gap-2 px-6 py-3 flex-shrink-0" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
            {STEPS.map((s, i) => {
              const active = s.state === "active", done = s.state === "done", locked = s.state === "locked";
              return (
                <div key={s.n} className="flex items-center gap-2 flex-1">
                  <div
                    className="flex items-center gap-2.5 flex-1 px-3 py-2 rounded-lg"
                    style={{
                      border: active ? "1px solid #06b6d4" : "1px solid var(--border-subtle)",
                      background: active ? "rgba(6,182,212,0.1)" : "var(--bg-surface-1)",
                    }}
                  >
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                      done ? "text-success-500 bg-success-500/15 border border-success-500/30"
                      : active ? "text-[#07090f] bg-primary-500"
                      : ""}`}
                      style={locked ? { background: "var(--bg-surface-3)", color: "var(--text-tertiary)" } : undefined}>
                      {done ? <Check className="h-3 w-3" strokeWidth={3} /> : s.n}
                    </span>
                    <span className="text-[12px] font-semibold flex-1" style={{ color: active ? "var(--text-primary)" : locked ? "var(--text-tertiary)" : "var(--text-secondary)" }}>{s.label}</span>
                    {done && <Check className="h-3.5 w-3.5 text-success-500" strokeWidth={2.5} />}
                    {locked && <Lock className="h-3 w-3" strokeWidth={2} style={{ color: "var(--text-tertiary)" }} />}
                  </div>
                  {i < STEPS.length - 1 && <ArrowRight className="h-3.5 w-3.5 flex-shrink-0" strokeWidth={2} style={{ color: "var(--border-strong)" }} />}
                </div>
              );
            })}
          </div>

          {/* ── Three columns ── */}
          <div className="flex-1 grid grid-cols-1 xl:grid-cols-[20rem_1fr_19rem] gap-4 px-6 py-4 overflow-y-auto">
            {/* Left: facts + note + docs */}
            <div className="space-y-4">
              <Panel title="Case Facts" action={
                <button className="flex items-center gap-1 text-[11px] font-medium text-primary-400 hover:text-primary-300"><Pencil className="h-3 w-3" strokeWidth={2} /> Edit</button>
              }>
                <div style={{ borderColor: "var(--border-subtle)" }}>
                  {CASE_FACTS.map((f, i) => (
                    <div key={f.k} className="flex items-center justify-between px-4 py-2.5" style={{ borderTop: i === 0 ? "none" : "1px solid var(--border-subtle)" }}>
                      <div className="min-w-0">
                        <p className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>{f.k}</p>
                        <p className={`text-[13px] font-medium ${f.mono ? "font-mono" : ""} ${f.status === "Missing" ? "italic" : ""}`} style={{ color: f.status === "Missing" ? "var(--text-tertiary)" : "var(--text-primary)" }}>{f.v}</p>
                      </div>
                      <StatusBadge status={f.status} />
                    </div>
                  ))}
                </div>
              </Panel>

              <Panel title="Client Note (Urdu)" action={
                <button className="flex items-center gap-1 text-[11px] font-medium text-primary-400 hover:text-primary-300"><Languages className="h-3 w-3" strokeWidth={2} /> Translate</button>
              }>
                <div className="px-4 py-3">
                  <p className="text-urdu text-[15px]" dir="rtl" style={{ color: "var(--text-secondary)" }}>
                    میری گرفتاری بلاجواز اور بدنیتی پر مبنی ہے۔ میں بے قصور ہوں۔ میری درخواست ہے کہ ضمانت فراہم کی جائے تاکہ میں اپنے گھر اور خاندان کے ساتھ رہ سکوں۔
                  </p>
                  <p className="mt-3 text-[10px] font-mono" style={{ color: "var(--text-tertiary)" }}>18 May 2024, 10:35 AM · Ali Raza</p>
                </div>
              </Panel>

              <Panel title="Linked Documents" icon={FolderOpen} action={
                <button className="text-[11px] font-medium text-primary-400 hover:text-primary-300">Manage</button>
              }>
                <div>
                  {LINKED_DOCS.map(({ name, date, icon: Icon }, i) => (
                    <div key={name} className="flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-[var(--bg-surface-2)]" style={{ borderTop: i === 0 ? "none" : "1px solid var(--border-subtle)" }}>
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "var(--bg-surface-3)" }}>
                        <Icon className="h-3.5 w-3.5 text-primary-300" strokeWidth={1.5} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-medium truncate" style={{ color: "var(--text-primary)" }}>{name}</p>
                        <p className="text-[10px] font-mono" style={{ color: "var(--text-tertiary)" }}>{date}</p>
                      </div>
                      <Check className="h-3.5 w-3.5 text-success-500 flex-shrink-0" strokeWidth={2.5} />
                    </div>
                  ))}
                  <button className="w-full flex items-center justify-between px-4 py-2.5 text-[12px] transition-colors hover:bg-[var(--bg-surface-2)] hover:text-primary-400" style={{ color: "var(--text-tertiary)", borderTop: "1px solid var(--border-subtle)" }}>
                    <span>+2 more documents</span>
                    <Upload className="h-3.5 w-3.5" strokeWidth={1.5} />
                  </button>
                </div>
              </Panel>
            </div>

            {/* Center: document + annotations + toolbar */}
            <Panel title="Document Draft" action={
              <div className="flex items-center gap-2">
                {["100%", "Fit Width"].map((t) => (
                  <button key={t} className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] transition-colors hover:border-[var(--border-strong)]" style={{ color: "var(--text-secondary)", border: "1px solid var(--border-default)" }}>
                    {t}<ChevronDown className="h-3 w-3" strokeWidth={1.5} />
                  </button>
                ))}
              </div>
            }>
              <div className="flex">
                {/* The document */}
                <div className="flex-1 p-6 min-w-0" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
                  <div className="text-center mb-5" style={{ color: "var(--text-primary)" }}>
                    <p className="text-[15px] font-bold underline">IN THE COURT OF THE LEARNED SESSIONS JUDGE, LAHORE</p>
                    <p className="text-[14px] font-bold underline mt-1">Bail Application Under Section 497 Cr.P.C.</p>
                  </div>
                  <div className="flex justify-between text-[13px] mb-4" style={{ color: "var(--text-secondary)" }}>
                    <span>The State</span>
                    <span className="text-right font-mono text-[12px]">FIR No. 123/2024<br />PS Model Town, Lahore</span>
                  </div>
                  <p className="text-center text-[13px] italic mb-4" style={{ color: "var(--text-tertiary)" }}>Versus</p>
                  <div className="flex justify-between text-[13px] mb-6" style={{ color: "var(--text-secondary)" }}>
                    <span>Ali Raza S/o Muhammad Yousaf<br />R/o House No. 45, Street No. 3,<br />Model Town, Lahore.</span>
                    <span className="text-right self-end">… Applicant / Accused</span>
                  </div>
                  <p className="text-[13px] font-bold mb-3" style={{ color: "var(--text-primary)" }}>MOST RESPECTFULLY SHOWETH:</p>
                  <ol className="space-y-2.5 text-[13px] leading-relaxed list-decimal pl-5" style={{ color: "var(--text-secondary)" }}>
                    <li>That the applicant is falsely implicated in the above FIR. He is innocent and has been falsely accused owing to personal enmity.</li>
                    <li>That the applicant has deep roots in society, is a law-abiding citizen, and there is no likelihood of his absconding or tampering with the prosecution evidence.</li>
                    <li className="rounded -mx-1 px-1 bg-primary-500/10" style={{ borderBottom: "1px dashed rgba(6,182,212,0.4)" }}>That the alleged recovery is doubtful and was effected in violation of legal procedure.</li>
                    <li>That the applicant undertakes to cooperate with the investigation and shall abide by any condition imposed by this Hon&apos;ble Court.</li>
                  </ol>
                  <p className="text-[13px] font-bold mt-5 mb-2" style={{ color: "var(--text-primary)" }}>PRAYER</p>
                  <p className="text-[13px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>It is, therefore, most humbly prayed that this Hon&apos;ble Court may be pleased to grant bail to the applicant in the above-mentioned case. And for this act of kindness, the applicant shall ever pray.</p>
                  <div className="flex justify-between items-end mt-8 text-[13px]" style={{ color: "var(--text-secondary)" }}>
                    <span>Dated: 18 May 2024</span>
                    <span className="text-right">Applicant<br /><span className="text-[12px]" style={{ color: "var(--text-tertiary)" }}>(Through Counsel)</span></span>
                  </div>
                </div>

                {/* Margin annotations */}
                <div className="w-52 flex-shrink-0 p-3 space-y-3 hidden xl:block" style={{ borderLeft: "1px solid var(--border-subtle)", background: "var(--bg-surface-2)" }}>
                  {NOTES.map((a, i) => (
                    <div key={i} className="rounded-lg p-3 border" style={a.ai ? { background: "rgba(167,139,250,0.07)", borderColor: "rgba(167,139,250,0.2)" } : { background: "var(--bg-surface-1)", borderColor: "var(--border-default)" }}>
                      <div className="flex items-center gap-1.5 mb-1">
                        {a.ai ? <Sparkles className="h-3 w-3 text-ai-500" strokeWidth={2} /> : <span className="w-3 h-3 rounded-full" style={{ background: "var(--border-strong)" }} />}
                        <span className={`text-[11px] font-bold ${a.ai ? "text-ai-500" : ""}`} style={a.ai ? undefined : { color: "var(--text-secondary)" }}>{a.who}</span>
                      </div>
                      <p className="text-[11px] leading-snug" style={{ color: "var(--text-secondary)" }}>{a.note}</p>
                      <p className="text-[9px] mt-1.5 font-mono" style={{ color: "var(--text-tertiary)" }}>{a.time}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Editor toolbar */}
              <div className="flex items-center gap-1 px-3 py-2 flex-wrap" style={{ borderTop: "1px solid var(--border-subtle)", background: "var(--bg-surface-1)" }}>
                {[Undo2, Redo2].map((Icon, i) => (
                  <button key={i} className="p-1.5 rounded transition-colors hover:bg-[var(--bg-surface-3)]" style={{ color: "var(--text-secondary)" }}><Icon className="h-3.5 w-3.5" strokeWidth={1.5} /></button>
                ))}
                <span className="w-px h-4 mx-1" style={{ background: "var(--border-default)" }} />
                {["Body Text", "Times New Roman", "11"].map((t) => (
                  <button key={t} className="flex items-center gap-1 px-2 py-1 rounded text-[11px] transition-colors hover:bg-[var(--bg-surface-3)]" style={{ color: "var(--text-secondary)" }}>{t}<ChevronDown className="h-3 w-3" /></button>
                ))}
                <span className="w-px h-4 mx-1" style={{ background: "var(--border-default)" }} />
                {[Bold, Italic, Underline].map((Icon, i) => (
                  <button key={i} className="p-1.5 rounded transition-colors hover:bg-[var(--bg-surface-3)]" style={{ color: "var(--text-secondary)" }}><Icon className="h-3.5 w-3.5" strokeWidth={2} /></button>
                ))}
                <span className="w-px h-4 mx-1" style={{ background: "var(--border-default)" }} />
                {[List, ListOrdered].map((Icon, i) => (
                  <button key={i} className="p-1.5 rounded transition-colors hover:bg-[var(--bg-surface-3)]" style={{ color: "var(--text-secondary)" }}><Icon className="h-3.5 w-3.5" strokeWidth={1.5} /></button>
                ))}
                <button className="ml-auto p-1.5 rounded text-primary-400 transition-colors hover:bg-[var(--bg-surface-3)]"><Pencil className="h-3.5 w-3.5" strokeWidth={1.5} /></button>
              </div>
            </Panel>

            {/* Right: verification */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 px-1">
                <Sparkles className="h-4 w-4 text-primary-400" strokeWidth={1.5} />
                <h3 className="text-[13px] font-bold" style={{ color: "var(--text-primary)" }}>TaqiAI Verification</h3>
              </div>

              <div className="rounded-xl p-4" style={{ background: "var(--bg-surface-1)", border: "1px solid var(--border-subtle)" }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-success-500" strokeWidth={1.5} />
                    <span className="text-[12px] font-bold" style={{ color: "var(--text-primary)" }}>Citation Check</span>
                  </div>
                  <span className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>Confidence <span className="text-success-500 font-bold">92%</span></span>
                </div>
                <p className="text-[11px] mb-2.5" style={{ color: "var(--text-secondary)" }}>Citations found relevant to this matter.</p>
                <div className="flex flex-wrap gap-1.5">
                  {CITATIONS.map((c) => (
                    <span key={c} className="px-2 py-0.5 rounded-md text-[10px] font-mono font-medium text-primary-300 bg-primary-500/10 border border-primary-500/20">{c}</span>
                  ))}
                </div>
              </div>

              {REVIEW.map((b) => {
                const Icon = b.icon;
                return (
                  <div key={b.title} className="rounded-xl p-4" style={{ background: "var(--bg-surface-1)", border: "1px solid var(--border-subtle)" }}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Icon className={`h-4 w-4 ${ACCENT_TEXT[b.accent]}`} strokeWidth={1.5} />
                        <span className="text-[12px] font-bold" style={{ color: "var(--text-primary)" }}>{b.title}</span>
                      </div>
                      <span className={`text-[10px] font-semibold flex items-center gap-1 px-2 py-0.5 rounded ${ACCENT_TEXT[b.accent]} ${ACCENT_TAGBG[b.accent]}`}>{b.tag}</span>
                    </div>
                    <ul className="space-y-1.5">
                      {b.items.map((it) => (
                        <li key={it} className="flex items-start gap-2 text-[11px] leading-snug" style={{ color: "var(--text-secondary)" }}>
                          <span className={`mt-1 w-1 h-1 rounded-full flex-shrink-0 ${ACCENT_DOT[b.accent]}`} />
                          {it}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}

              <div className="rounded-xl p-3.5 flex items-start gap-2.5 text-warning-500 bg-warning-500/[0.06] border border-warning-500/25">
                <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                <div>
                  <p className="text-[12px] font-bold">Lawyer approval required before export</p>
                  <p className="text-[11px] mt-0.5" style={{ color: "var(--text-secondary)" }}>Please verify the facts, law, and citations carefully.</p>
                </div>
              </div>

              <button className="w-full flex items-center justify-center gap-2 h-11 rounded-xl text-[13px] font-bold bg-primary-500 hover:bg-primary-400 transition-colors" style={{ color: "#07090f", boxShadow: "var(--glow-cyan-sm)" }}>
                <ShieldCheck className="h-4 w-4" strokeWidth={2} /> Approve Draft
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button className="flex items-center justify-center gap-2 h-10 rounded-xl text-[12px] font-semibold transition-colors hover:border-[var(--border-strong)]" style={{ color: "var(--text-secondary)", background: "var(--bg-surface-1)", border: "1px solid var(--border-default)" }}>
                  <Redo2 className="h-3.5 w-3.5" strokeWidth={2} /> Request Revision
                </button>
                <button className="flex items-center justify-center gap-2 h-10 rounded-xl text-[12px] font-semibold text-danger-500 bg-danger-500/[0.06] border border-danger-500/25 hover:bg-danger-500/10 transition-colors">
                  <AlertTriangle className="h-3.5 w-3.5" strokeWidth={2} /> Reject
                </button>
              </div>
            </div>
          </div>

          {/* ── Ask bar ── */}
          <div className="flex-shrink-0 px-6 py-3" style={{ borderTop: "1px solid var(--border-subtle)" }}>
            <div className="flex items-center gap-3 h-12 px-4 rounded-xl focus-within:border-primary-500/40 transition-colors" style={{ background: "var(--bg-surface-1)", border: "1px solid var(--border-default)" }}>
              <Sparkles className="h-4 w-4 text-primary-400 flex-shrink-0" strokeWidth={1.5} />
              <input placeholder="Ask TaqiAI to strengthen grounds, add citations, or translate" className="flex-1 bg-transparent border-0 outline-none text-[13px] min-w-0" style={{ color: "var(--text-primary)" }} />
              {[Paperclip, Upload, Mic].map((Icon, i) => (
                <button key={i} className="p-1.5 rounded-lg transition-colors hover:bg-[var(--bg-surface-3)]" style={{ color: "var(--text-tertiary)" }}><Icon className="h-4 w-4" strokeWidth={1.5} /></button>
              ))}
              <button className="w-9 h-9 rounded-lg flex items-center justify-center text-white flex-shrink-0 bg-primary-500 hover:bg-primary-400 transition-colors" style={{ color: "#07090f" }}>
                <Send className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
