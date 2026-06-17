"use client";

import Link from "next/link";
import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import { getAllDocuments, type SavedDocument } from "@/lib/document-store";
import { getSavedJudgments, onSavedJudgmentsChange, type SavedJudgment } from "@/lib/judgment-store";
import {
  getClientNotes, addClientNote, removeClientNote, onClientNotesChange,
  type ClientNote,
} from "@/lib/client-notes-store";
import {
  CalendarPlus, CalendarDays, FileText, BookMarked, FolderCheck,
  AlertTriangle, Clock, FilePen, Search, Languages, Calculator,
  PenLine, Star, ArrowRight, Sparkles, Scale, BadgeCheck, Paperclip, Mic,
  Send, ShieldCheck, Bookmark, ScrollText, ScanLine, Library,
  Plus, Trash2, X, User,
} from "lucide-react";

/* ───────────────────────────── Data ───────────────────────────── */

type CauseItem = { time: string; title: string; ref: string; court: string; status: string; next: string };

// ── Live data from Chamber (/api/matters) ──
interface MatterLite {
  id: string;
  title: string;
  caseNo: string | null;
  court: string;
  status: string;
  nextHearing: string | null;
}

function isToday(dateStr: string | null): boolean {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const t = new Date();
  return (
    d.getFullYear() === t.getFullYear() &&
    d.getMonth() === t.getMonth() &&
    d.getDate() === t.getDate()
  );
}

const PILL_CLS: Record<string, string> = {
  urgent:    "text-danger-500 bg-danger-500/10 border-danger-500/25",
  upcoming:  "text-primary-400 bg-primary-500/10 border-primary-500/25",
  completed: "text-success-500 bg-success-500/10 border-success-500/25",
};

const ACTIONS = [
  { label: "Draft Bail Application", sub: "CrPC 497 · AI assisted drafting",        icon: FilePen,    href: "/draft-review", featured: true },
  { label: "Voice Case",             sub: "Record client discussion · AI drafts it", icon: Mic,        href: "/voice-case" },
  { label: "Copy from Photo",        sub: "Photo of a document · AI types it out",   icon: ScanLine,   href: "/copy-from-photo" },
  { label: "Search Case Law",        sub: "Find judgments and citations",            icon: Search,     href: "/case-law" },
  { label: "Statute Search",         sub: "Search acts, sections and statutes",      icon: Library,    href: "/statute-search" },
  { label: "Translate Urdu Document", sub: "Urdu to English legal translation",      icon: Languages,  href: "/translate" },
  { label: "Create Affidavit",       sub: "Generate affidavits and declarations",    icon: PenLine,    href: "/affidavits" },
  { label: "Calculate Property Tax", sub: "Punjab property tax calculator",          icon: Calculator, href: "/property-transfer/tax-calculator" },
];

const ADVISOR = [
  { label: "Strengthen bail grounds",   sub: "Add stronger legal grounds with citations", icon: Scale,     q: "Strengthen the bail grounds in my draft with citations" },
  { label: "Find latest SCMR citations", sub: "Search recent Supreme Court judgments",    icon: BookMarked, q: "Find the latest SCMR citations on bail" },
  { label: "Generate filing checklist", sub: "Court-wise checklist for your case",         icon: BadgeCheck, q: "Generate a court-wise filing checklist for a bail application" },
];

/* ───────────────────────────── Bits ───────────────────────────── */

function Spark({ accent, data }: { accent: string; data?: number[] }) {
  if (!data || data.length < 2 || Math.max(...data) === Math.min(...data)) {
    return (
      <svg viewBox="0 0 100 32" preserveAspectRatio="none" className="w-full h-8 mt-2 block">
        <line x1="0" y1="26" x2="100" y2="26" stroke="var(--border-default)" strokeWidth="1.5" strokeDasharray="3 4" vectorEffect="non-scaling-stroke" />
      </svg>
    );
  }
  const max = Math.max(...data), min = Math.min(...data), range = max - min || 1;
  const line = data.map((d, i) => `${(i / (data.length - 1)) * 100},${30 - ((d - min) / range) * 24 - 3}`).join(" ");
  return (
    <svg viewBox="0 0 100 32" preserveAspectRatio="none" className="w-full h-8 mt-2 block">
      <polygon points={`0,32 ${line} 100,32`} fill={accent} opacity="0.1" />
      <polyline points={line} fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function Empty({ icon: Icon, text, cta, href }: { icon: React.ElementType; text: string; cta?: string; href?: string }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center gap-2.5 px-5 py-9">
      <span
        className="w-10 h-10 rounded-xl grid place-items-center"
        style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border-subtle)", color: "var(--text-tertiary)" }}
      >
        <Icon className="h-5 w-5" strokeWidth={1.5} />
      </span>
      <p className="text-[12px] leading-relaxed max-w-[32ch]" style={{ color: "var(--text-tertiary)" }}>{text}</p>
      {cta && href && (
        <Link href={href} className="inline-flex items-center gap-1 text-[12px] font-semibold text-primary-400 hover:text-primary-300 transition-colors">
          {cta} <ArrowRight className="h-3 w-3" strokeWidth={2.25} />
        </Link>
      )}
    </div>
  );
}

function CardHead({ title, action }: { title: string; action: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
      <h2 className="font-display text-[14px] font-bold" style={{ color: "var(--text-primary)" }}>{title}</h2>
      {action}
    </div>
  );
}

function timeAgo(ts: number): string {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(ts).toLocaleDateString("en-PK", { day: "numeric", month: "short" });
}

function ClientNoteCard() {
  const [notes, setNotes] = useState<ClientNote[]>([]);
  const [adding, setAdding] = useState(false);
  const [client, setClient] = useState("");
  const [caseRef, setCaseRef] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    const sync = () => setNotes(getClientNotes());
    sync();
    return onClientNotesChange(sync);
  }, []);

  const save = () => {
    if (!client.trim() || !note.trim()) return;
    addClientNote({ client, caseRef, note });
    setClient(""); setCaseRef(""); setNote(""); setAdding(false);
  };

  return (
    <section className="rounded-xl flex flex-col overflow-hidden" style={{ background: "var(--bg-surface-1)", border: "1px solid var(--border-subtle)" }}>
      <CardHead title="Client Note" action={
        <button
          onClick={() => setAdding((v) => !v)}
          className="inline-flex items-center gap-1 text-[11px] font-semibold transition-colors hover:text-primary-400"
          style={{ color: adding ? "var(--text-secondary)" : "var(--text-tertiary)" }}
        >
          {adding ? <><X className="h-3 w-3" strokeWidth={2.25} /> Cancel</> : <><Plus className="h-3 w-3" strokeWidth={2.5} /> Add Note</>}
        </button>
      } />

      {adding && (
        <div className="flex flex-col gap-2 px-3 pt-3" style={{ borderBottom: "1px solid var(--border-subtle)", paddingBottom: "12px" }}>
          <div className="flex gap-2">
            <input
              value={client}
              onChange={(e) => setClient(e.target.value)}
              placeholder="Client name"
              className="flex-1 h-9 px-3 rounded-lg bg-transparent border-0 outline-none text-[12px]"
              style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }}
            />
            <input
              value={caseRef}
              onChange={(e) => setCaseRef(e.target.value)}
              placeholder="Case ref (optional)"
              className="w-[40%] h-9 px-3 rounded-lg bg-transparent border-0 outline-none text-[12px]"
              style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }}
            />
          </div>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="What did the client say? Record the key points…"
            rows={3}
            className="w-full px-3 py-2 rounded-lg bg-transparent border-0 outline-none text-[12px] resize-none leading-relaxed"
            style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }}
          />
          <button
            onClick={save}
            disabled={!client.trim() || !note.trim()}
            className="self-end inline-flex items-center gap-1.5 h-9 px-4 rounded-lg text-[12px] font-semibold text-white transition-opacity disabled:opacity-40"
            style={{ background: "linear-gradient(135deg,#06b6d4,#0891b2)" }}
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={2.5} /> Save Note
          </button>
        </div>
      )}

      {notes.length === 0 ? (
        !adding && <Empty icon={ScrollText} text="No client notes yet. Click “Add Note” to record what a client tells you." />
      ) : (
        <div className="flex flex-col p-2 gap-0.5 overflow-y-auto">
          {notes.map((n) => (
            <div key={n.id} className="group flex items-start gap-2.5 p-2.5 rounded-lg hover:bg-[var(--bg-surface-2)] transition-colors">
              <span className="w-7 h-7 rounded-md grid place-items-center flex-shrink-0" style={{ background: "var(--bg-surface-2)", color: "var(--text-secondary)" }}>
                <User className="h-3.5 w-3.5" strokeWidth={1.75} />
              </span>
              <span className="flex-1 min-w-0">
                <span className="flex items-center gap-2">
                  <span className="text-[12.5px] font-semibold truncate" style={{ color: "var(--text-primary)" }}>{n.client}</span>
                  {n.caseRef && <span className="text-[9.5px] font-mono px-1.5 py-0.5 rounded text-primary-300 bg-primary-500/10 border border-primary-500/20 flex-shrink-0">{n.caseRef}</span>}
                </span>
                <span className="block text-[11px] mt-0.5 leading-relaxed line-clamp-2" style={{ color: "var(--text-tertiary)" }}>{n.note}</span>
                <span className="block text-[9.5px] mt-1" style={{ color: "var(--text-tertiary)" }}>{timeAgo(n.createdAt)}</span>
              </span>
              <button
                onClick={() => removeClientNote(n.id)}
                aria-label="Delete note"
                className="w-6 h-6 rounded grid place-items-center flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-danger-500/10"
                style={{ color: "var(--text-tertiary)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-tertiary)")}
              >
                <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

/* ───────────────────────────── Page ───────────────────────────── */

export default function DashboardPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // ── Live data: Chamber matters, generated documents, saved case law ──
  const [matters, setMatters] = useState<MatterLite[]>([]);
  const [docs, setDocs] = useState<SavedDocument[]>([]);
  const [saved, setSaved] = useState<SavedJudgment[]>([]);
  const docCount = docs.length;
  const savedCount = saved.length;

  useEffect(() => {
    let active = true;

    // Today's hearings — from Chamber
    fetch("/api/matters")
      .then((res) => (res.ok ? res.json() : { matters: [] }))
      .then((data) => { if (active) setMatters(data.matters ?? []); })
      .catch(() => { if (active) setMatters([]); });

    // Generated documents (DB + local)
    getAllDocuments()
      .then((d) => { if (active) setDocs(d); })
      .catch(() => { if (active) setDocs([]); });

    // Saved case law (localStorage) + live updates when bookmarks change
    const syncSaved = () => setSaved(getSavedJudgments());
    syncSaved();
    const unsub = onSavedJudgmentsChange(syncSaved);

    return () => { active = false; unsub(); };
  }, []);

  // Most-recent first, top 5 for the dashboard cards
  const recentDrafts = [...docs].sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 5);
  const recentSaved = saved.slice(0, 5);

  const todayMatters = matters.filter((m) => isToday(m.nextHearing));

  const STATS = [
    {
      label: "Hearings Today",
      value: String(todayMatters.length),
      note: todayMatters.length === 0 ? "Nothing scheduled" : todayMatters.length === 1 ? "1 hearing today" : `${todayMatters.length} hearings today`,
      icon: CalendarDays, accent: "#06b6d4", iconCls: "text-primary-400 bg-primary-500/10",
    },
    {
      label: "Drafts Pending Review",
      value: String(docCount),
      note: docCount === 0 ? "Nothing pending" : docCount === 1 ? "1 draft" : `${docCount} drafts`,
      icon: FileText, accent: "#a78bfa", iconCls: "text-ai-500 bg-ai-500/10",
    },
    {
      label: "Case Law Saved",
      value: String(savedCount),
      note: savedCount === 0 ? "None saved yet" : savedCount === 1 ? "1 judgment" : `${savedCount} judgments`,
      icon: BookMarked, accent: "#10b981", iconCls: "text-success-500 bg-success-500/10",
    },
    {
      label: "Documents Ready",
      value: String(docCount),
      note: docCount === 0 ? "None yet" : docCount === 1 ? "1 document" : `${docCount} documents`,
      icon: FolderCheck, accent: "#f59e0b", iconCls: "text-warning-500 bg-warning-500/10",
    },
  ];

  const CAUSE_LIST: CauseItem[] = todayMatters.map((m) => ({
    time: "Today",
    title: m.title,
    ref: m.caseNo ?? "—",
    court: m.court || "—",
    status: "urgent",
    next: "Hearing today",
  }));

  const now = new Date();
  const greeting = now.getHours() < 12 ? "Good morning" : now.getHours() < 17 ? "Good afternoon" : "Good evening";
  const gregorian = now.toLocaleDateString("en-PK", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  let hijri = "";
  try { hijri = new Intl.DateTimeFormat("en-u-ca-islamic", { day: "numeric", month: "long", year: "numeric" }).format(now) + " AH"; } catch { hijri = ""; }

  const ask = (q?: string) => {
    const text = (q ?? query).trim();
    if (!text) return;
    router.push(`/ai-advisor?q=${encodeURIComponent(text)}`);
  };

  const cardStyle = { background: "var(--bg-surface-1)", border: "1px solid var(--border-subtle)" };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--bg-base)" }}>
      <Sidebar open={sidebarOpen} onClose={closeSidebar} />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1380px] mx-auto px-6 py-6">

            {/* ── Header ── */}
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h1 className="font-display text-[26px] font-extrabold leading-tight tracking-tight" style={{ color: "var(--text-primary)" }}>
                  {greeting}, <span className="text-primary-400">Advocate</span>
                </h1>
                <p className="text-[12px] font-mono mt-1.5" style={{ color: "var(--text-tertiary)" }}>
                  {gregorian}{hijri && <span className="text-primary-400/70"> · {hijri}</span>}
                </p>
              </div>
              <div className="flex items-center gap-2.5 flex-shrink-0">
                <Link
                  href="/chamber"
                  className="inline-flex items-center gap-1.5 h-10 px-3.5 rounded-lg text-[13px] font-semibold transition-colors"
                  style={{ color: "var(--text-secondary)", background: "var(--bg-surface-1)", border: "1px solid var(--border-default)" }}
                >
                  <CalendarPlus className="h-4 w-4" strokeWidth={2} /> Add Hearing
                </Link>
              </div>
            </div>

            {/* ── Stats ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
              {STATS.map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="rounded-xl px-4 pt-4 pb-2 overflow-hidden" style={cardStyle}>
                    <div className="flex items-start gap-3">
                      <span className={`w-9 h-9 rounded-lg grid place-items-center flex-shrink-0 ${s.iconCls}`}>
                        <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
                      </span>
                      <div className="min-w-0">
                        <p className="text-[11.5px]" style={{ color: "var(--text-tertiary)" }}>{s.label}</p>
                        <p className="font-display text-[24px] font-bold leading-tight" style={{ color: "var(--text-primary)" }}>
                          {s.value} <span className="text-[11px] font-sans font-semibold align-middle" style={{ color: s.accent }}>{s.note}</span>
                        </p>
                      </div>
                    </div>
                    <Spark accent={s.accent} />
                  </div>
                );
              })}
            </div>

            {/* ── Row 1 ── */}
            <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.9fr_1.1fr] gap-5 mb-5">
              {/* Cause list */}
              <section className="rounded-xl flex flex-col overflow-hidden" style={cardStyle}>
                <CardHead title="Today's Cause List" action={
                  <Link href="/chamber" className="text-[11px] font-semibold transition-colors hover:text-primary-400" style={{ color: "var(--text-tertiary)" }}>View Full List</Link>
                } />
                {CAUSE_LIST.length === 0 ? (
                  <Empty icon={CalendarDays} text="No hearings scheduled. Add a case and today's cause list will appear here." cta="Add a hearing" href="/chamber" />
                ) : (
                  <>
                    <div className="px-2 py-1">
                      <div className="grid grid-cols-[64px_1.5fr_1.3fr_84px_1fr] gap-2.5 px-2.5 py-2 text-[9.5px] uppercase tracking-[0.1em]" style={{ color: "var(--text-tertiary)", borderBottom: "1px solid var(--border-subtle)" }}>
                        <span>Time</span><span>Case</span><span>Court</span><span>Status</span><span>Next Action</span>
                      </div>
                      {CAUSE_LIST.map((c) => (
                        <Link key={c.title} href="/chamber" className="grid grid-cols-[64px_1.5fr_1.3fr_84px_1fr] gap-2.5 items-center px-2.5 py-2.5 rounded-lg hover:bg-[var(--bg-surface-2)] transition-colors">
                          <span className="text-[11px] font-mono" style={{ color: "var(--text-secondary)" }}>{c.time}</span>
                          <span className="min-w-0"><span className="block text-[12.5px] font-semibold truncate" style={{ color: "var(--text-primary)" }}>{c.title}</span><span className="text-[10px] font-mono" style={{ color: "var(--text-tertiary)" }}>{c.ref}</span></span>
                          <span className="text-[11px]" style={{ color: "var(--text-secondary)" }}>{c.court}</span>
                          <span><span className={`inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wide px-2 py-1 rounded border ${PILL_CLS[c.status]}`}>{c.status === "urgent" && <AlertTriangle className="h-2.5 w-2.5" strokeWidth={2.5} />}{c.status}</span></span>
                          <span className="text-[11px]" style={{ color: "var(--text-secondary)" }}>{c.next}</span>
                        </Link>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 px-4 py-3 mt-auto text-[11px]" style={{ borderTop: "1px solid var(--border-subtle)", color: "var(--text-tertiary)" }}>
                      <Clock className="h-3.5 w-3.5" strokeWidth={1.75} /> Upcoming hearings will appear here
                    </div>
                  </>
                )}
              </section>

              {/* Quick actions */}
              <section className="rounded-xl flex flex-col overflow-hidden" style={cardStyle}>
                <CardHead title="Quick Legal Actions" action={
                  <button className="text-[11px] font-semibold transition-colors hover:text-primary-400" style={{ color: "var(--text-tertiary)" }}>Edit</button>
                } />
                <div className="flex flex-col gap-0.5 p-2">
                  {ACTIONS.map((a) => {
                    const Icon = a.icon;
                    return (
                      <Link
                        key={a.label}
                        href={a.href}
                        className={`flex items-center gap-2.5 px-2.5 py-[7px] rounded-lg border transition-colors ${a.featured ? "bg-primary-500/10 border-primary-500/30" : "border-transparent hover:bg-[var(--bg-surface-2)]"}`}
                      >
                        <span className={`w-7 h-7 rounded-md grid place-items-center flex-shrink-0 ${a.featured ? "bg-primary-500/15 text-primary-400" : ""}`} style={a.featured ? undefined : { background: "var(--bg-surface-2)", color: "var(--text-secondary)" }}>
                          <Icon className="h-[15px] w-[15px]" strokeWidth={1.75} />
                        </span>
                        <span className="flex-1 min-w-0">
                          <span className="block text-[12px] font-semibold leading-tight" style={{ color: "var(--text-primary)" }}>{a.label}</span>
                          <span className="block text-[10px] leading-tight mt-0.5" style={{ color: "var(--text-tertiary)" }}>{a.sub}</span>
                        </span>
                        {a.featured
                          ? <Star className="h-3.5 w-3.5 text-primary-400 flex-shrink-0" strokeWidth={2} fill="currentColor" />
                          : <ArrowRight className="h-3.5 w-3.5 flex-shrink-0" strokeWidth={2} style={{ color: "var(--text-tertiary)" }} />}
                      </Link>
                    );
                  })}
                </div>
              </section>

              {/* Advisor */}
              <section className="rounded-xl flex flex-col overflow-hidden" style={{ background: "var(--bg-surface-1)", border: "1px solid rgba(167,139,250,0.2)" }}>
                <CardHead title="TaqiAI Advisor" action={<span className="text-[9.5px] text-ai-500 tracking-wide">Powered by Xyric</span>} />
                <div className="px-4 pt-3.5">
                  <p className="font-display text-[15px] font-semibold" style={{ color: "var(--text-primary)" }}>What do you want to prepare today?</p>
                  <p className="text-[11px] mt-1 mb-3" style={{ color: "var(--text-tertiary)" }}>Smart suggestions based on your recent work.</p>
                </div>
                <div className="flex flex-col gap-2 px-3">
                  {ADVISOR.map((a) => {
                    const Icon = a.icon;
                    return (
                      <button key={a.label} onClick={() => ask(a.q)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-left border transition-colors hover:border-ai-500/40 hover:bg-[var(--bg-surface-2)]" style={{ background: "var(--bg-surface-2)", borderColor: "var(--border-subtle)" }}>
                        <span className="w-8 h-8 rounded-lg grid place-items-center flex-shrink-0 bg-ai-500/12 text-ai-500"><Icon className="h-4 w-4" strokeWidth={1.75} /></span>
                        <span className="flex-1 min-w-0">
                          <span className="block text-[12.5px] font-semibold" style={{ color: "var(--text-primary)" }}>{a.label}</span>
                          <span className="block text-[10.5px]" style={{ color: "var(--text-tertiary)" }}>{a.sub}</span>
                        </span>
                        <ArrowRight className="h-3.5 w-3.5 flex-shrink-0" strokeWidth={2} style={{ color: "var(--text-tertiary)" }} />
                      </button>
                    );
                  })}
                </div>
                <div className="px-3 mt-3.5">
                  <div className="flex items-center gap-1.5 h-11 px-3 rounded-lg focus-within:border-ai-500/50 transition-colors" style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border-default)" }}>
                    <input
                      ref={inputRef}
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") ask(); }}
                      placeholder="Ask anything about law, drafting, research"
                      className="flex-1 bg-transparent border-0 outline-none text-[12.5px] min-w-0"
                      style={{ color: "var(--text-primary)" }}
                    />
                    <button className="w-8 h-8 rounded-md grid place-items-center transition-colors hover:bg-[var(--bg-surface-3)]" style={{ color: "var(--text-tertiary)" }} aria-label="Attach"><Paperclip className="h-4 w-4" strokeWidth={1.75} /></button>
                    <button className="w-8 h-8 rounded-md grid place-items-center transition-colors hover:bg-[var(--bg-surface-3)]" style={{ color: "var(--text-tertiary)" }} aria-label="Dictate"><Mic className="h-4 w-4" strokeWidth={1.75} /></button>
                    <button onClick={() => ask()} className="w-8 h-8 rounded-md grid place-items-center text-white flex-shrink-0" style={{ background: "linear-gradient(135deg,#a78bfa,#7c3aed)" }} aria-label="Send"><Send className="h-4 w-4" strokeWidth={2} /></button>
                  </div>
                </div>
                <p className="text-[10px] px-4 mt-2.5 mb-4" style={{ color: "var(--text-tertiary)" }}>AI responses may contain errors. Verify before relying.</p>
              </section>
            </div>

            {/* ── Row 2 ── */}
            <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr_0.9fr] gap-5 mb-5">
              {/* Recent drafts */}
              <section className="rounded-xl flex flex-col overflow-hidden" style={cardStyle}>
                <CardHead title="Recent Drafts" action={<Link href="/documents" className="text-[11px] font-semibold transition-colors hover:text-primary-400" style={{ color: "var(--text-tertiary)" }}>View All</Link>} />
                {recentDrafts.length === 0 ? (
                  <Empty icon={FilePen} text="No drafts yet. Start a new draft and it will show up here." cta="Create your first draft" href="/draft-review" />
                ) : (
                  <div className="flex flex-col p-2">
                    {recentDrafts.map((d) => (
                      <Link key={d.id} href={`/documents/${d.id}`} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-[var(--bg-surface-2)] transition-colors">
                        <span className="w-8 h-8 rounded-lg grid place-items-center flex-shrink-0" style={{ background: "var(--bg-surface-2)", color: "var(--text-secondary)" }}><FileText className="h-4 w-4" strokeWidth={1.75} /></span>
                        <span className="flex-1 min-w-0">
                          <span className="block text-[12.5px] font-semibold truncate" style={{ color: "var(--text-primary)" }}>{d.title || "Untitled draft"}</span>
                          <span className="block text-[10.5px] truncate" style={{ color: "var(--text-tertiary)" }}>{[d.category, d.subType].filter(Boolean).join(" · ") || "Document"} · {timeAgo(d.updatedAt)}</span>
                        </span>
                        {d.language && <span className="text-[10px] font-semibold px-2 py-1 rounded text-primary-300 bg-primary-500/10 flex-shrink-0 uppercase">{d.language}</span>}
                        <ArrowRight className="h-3.5 w-3.5 flex-shrink-0" strokeWidth={2} style={{ color: "var(--text-tertiary)" }} />
                      </Link>
                    ))}
                  </div>
                )}
              </section>

              {/* Case law watch */}
              <section className="rounded-xl flex flex-col overflow-hidden" style={cardStyle}>
                <CardHead title="Case Law Watch" action={<Link href="/case-law" className="text-[11px] font-semibold transition-colors hover:text-primary-400" style={{ color: "var(--text-tertiary)" }}>View All</Link>} />
                {recentSaved.length === 0 ? (
                  <Empty icon={BookMarked} text="No saved judgments yet. Bookmark case law to track it here." cta="Browse case law" href="/case-law" />
                ) : (
                  <div className="flex flex-col p-2">
                    {recentSaved.map((w) => (
                      <Link key={w.id} href="/case-law" className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-[var(--bg-surface-2)] transition-colors">
                        <span className="flex-1 min-w-0">
                          <span className="block text-[12.5px] font-semibold truncate" style={{ color: "var(--text-primary)" }}>{w.title || w.citation}</span>
                          <span className="text-[10.5px]" style={{ color: "var(--text-tertiary)" }}>{[w.court, w.year].filter(Boolean).join(" · ")} · {timeAgo(w.savedAt)}</span>
                        </span>
                        <span className="flex flex-col items-end gap-1 flex-shrink-0">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded text-primary-300 bg-primary-500/10 border border-primary-500/20">{w.citation}</span>
                          {w.reported && <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-success-500"><ShieldCheck className="h-3 w-3" strokeWidth={2} />Reported</span>}
                        </span>
                        <Bookmark className="h-4 w-4 flex-shrink-0 mt-0.5 text-primary-400" strokeWidth={1.75} fill="currentColor" />
                      </Link>
                    ))}
                  </div>
                )}
              </section>

              {/* Client note */}
              <ClientNoteCard />
            </div>

            {/* ── Footer ── */}
            <footer className="flex items-center justify-between gap-4 pt-4" style={{ borderTop: "1px solid var(--border-subtle)" }}>
              <span className="inline-flex items-center gap-2 text-[11.5px]" style={{ color: "var(--text-tertiary)" }}>
                <ShieldCheck className="h-3.5 w-3.5 text-success-500" strokeWidth={1.75} /> Verify before filing. TaqiAI is your assistant; the final responsibility is yours.
              </span>
              <span className="flex gap-5 text-[11.5px]">
                <Link href="/settings" className="transition-colors hover:text-[var(--text-secondary)]" style={{ color: "var(--text-tertiary)" }}>User Guide</Link>
                <Link href="/settings" className="transition-colors hover:text-[var(--text-secondary)]" style={{ color: "var(--text-tertiary)" }}>Shortcuts</Link>
                <Link href="/settings" className="transition-colors hover:text-[var(--text-secondary)]" style={{ color: "var(--text-tertiary)" }}>Support</Link>
              </span>
            </footer>

          </div>
        </main>
      </div>
    </div>
  );
}
