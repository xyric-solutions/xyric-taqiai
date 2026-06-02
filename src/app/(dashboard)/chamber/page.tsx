"use client";

import { useState, useEffect, useCallback } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import {
  Briefcase,
  Plus,
  Search,
  Calendar,
  CalendarDays,
  User,
  Scale,
  Edit2,
  Archive,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  X,
  AlertCircle,
  Clock,
  Gavel,
  FileText,
  StickyNote,
  History,
  Bell,
} from "lucide-react";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

interface Hearing {
  id: string;
  matterId: string;
  date: string;
  purpose: string | null;
  result: string | null;
  nextDate: string | null;
  createdAt: string;
}

interface Matter {
  id: string;
  title: string;
  caseNo: string | null;
  court: string;
  caseType: string;
  status: string;
  role: string;
  clientName: string;
  opponentName: string | null;
  judgeName: string | null;
  dateFiled: string | null;
  nextHearing: string | null;
  notes: string | null;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
  hearings: Hearing[];
}

type Tab = "today" | "all" | "calendar" | "deadlines";

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────

const COURTS = [
  { group: "Apex Courts", options: ["Supreme Court of Pakistan", "Federal Shariat Court"] },
  {
    group: "High Courts",
    options: [
      "Lahore High Court",
      "Islamabad High Court",
      "Peshawar High Court",
      "Quetta High Court",
      "Sindh High Court",
    ],
  },
  {
    group: "District Courts",
    options: [
      "District Court Lahore",
      "District Court Karachi",
      "District Court Islamabad",
      "District Court",
    ],
  },
  {
    group: "Special Courts",
    options: [
      "Family Court",
      "Labour Court",
      "Banking Court",
      "Anti-Corruption Court",
      "Special Court",
    ],
  },
  {
    group: "Civil / Revenue",
    options: ["Revenue Court", "Civil Court", "Session Court"],
  },
];

const CASE_TYPES = ["Civil", "Criminal", "Family", "Constitutional", "Administrative", "Tax", "Other"];

const ROLES = [
  "Counsel for Plaintiff",
  "Counsel for Defendant",
  "Counsel for Petitioner",
  "Counsel for Respondent",
  "Counsel for Appellant",
];

const STATUSES = ["active", "pending", "decided", "stayed", "adjourned"];

const STATUS_LABELS: Record<string, string> = {
  active: "Active",
  pending: "Pending",
  decided: "Decided",
  stayed: "Stayed",
  adjourned: "Adjourned",
};

const STATUS_COLORS: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700",
  decided: "bg-[var(--bg-surface-2)] text-[var(--text-secondary)]",
  stayed: "bg-blue-100 text-blue-700",
  adjourned: "bg-orange-100 text-orange-700",
};

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

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

function isTomorrow(dateStr: string | null): boolean {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const t = new Date();
  t.setDate(t.getDate() + 1);
  return (
    d.getFullYear() === t.getFullYear() &&
    d.getMonth() === t.getMonth() &&
    d.getDate() === t.getDate()
  );
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-PK", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function toInputDate(dateStr: string | null): string {
  if (!dateStr) return "";
  return new Date(dateStr).toISOString().substring(0, 10);
}

// S06-05: Build calendar grid — returns null slots for empty leading cells
function buildCalendarGrid(year: number, month: number): (Date | null)[] {
  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const grid: (Date | null)[] = Array(firstDay).fill(null);
  for (let d = 1; d <= daysInMonth; d++) grid.push(new Date(year, month, d));
  return grid;
}

// ─────────────────────────────────────────────
// EMPTY FORM
// ─────────────────────────────────────────────

function emptyForm() {
  return {
    title: "",
    caseNo: "",
    court: "",
    caseType: "Civil",
    status: "active",
    role: "",
    clientName: "",
    opponentName: "",
    judgeName: "",
    dateFiled: "",
    nextHearing: "",
    notes: "",
  };
}

// ─────────────────────────────────────────────
// MATTER FORM COMPONENT
// ─────────────────────────────────────────────

interface MatterFormProps {
  initial?: ReturnType<typeof emptyForm>;
  onSubmit: (data: ReturnType<typeof emptyForm>) => Promise<void>;
  onCancel: () => void;
  saving: boolean;
  title: string;
}

function MatterForm({ initial, onSubmit, onCancel, saving, title }: MatterFormProps) {
  const [form, setForm] = useState(initial ?? emptyForm());

  const set = (k: keyof typeof form, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  const inputCls =
    "w-full px-3 py-2 text-sm border border-[var(--border-default)] rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 bg-[var(--bg-surface-2)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)]";
  const labelCls = "block text-xs font-semibold text-[var(--text-secondary)] mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-base font-bold text-white flex items-center gap-2">
        <Briefcase className="h-4 w-4 text-primary-500" />
        {title}
      </h3>

      {/* Row: Title + Case No */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>
            Case Title <span className="text-red-500">*</span>
          </label>
          <input
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="e.g. Ali v. Khan Property Dispute"
            className={inputCls}
            required
          />
        </div>
        <div>
          <label className={labelCls}>Case No</label>
          <input
            value={form.caseNo}
            onChange={(e) => set("caseNo", e.target.value)}
            placeholder="e.g. CS-1234/2024"
            className={inputCls}
          />
        </div>
      </div>

      {/* Court */}
      <div>
        <label className={labelCls}>Court</label>
        <select
          value={form.court}
          onChange={(e) => set("court", e.target.value)}
          className={inputCls}
        >
          <option value="">-- Select Court --</option>
          {COURTS.map((g) => (
            <optgroup key={g.group} label={g.group}>
              {g.options.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      {/* Row: Case Type + Role */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>Case Type</label>
          <select
            value={form.caseType}
            onChange={(e) => set("caseType", e.target.value)}
            className={inputCls}
          >
            {CASE_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls}>Your Role</label>
          <select
            value={form.role}
            onChange={(e) => set("role", e.target.value)}
            className={inputCls}
          >
            <option value="">-- Select Role --</option>
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Row: Client + Opponent */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>
            Client Name <span className="text-red-500">*</span>
          </label>
          <input
            value={form.clientName}
            onChange={(e) => set("clientName", e.target.value)}
            placeholder="Client's full name"
            className={inputCls}
            required
          />
        </div>
        <div>
          <label className={labelCls}>Opponent Name</label>
          <input
            value={form.opponentName}
            onChange={(e) => set("opponentName", e.target.value)}
            placeholder="Opposing party"
            className={inputCls}
          />
        </div>
      </div>

      {/* Row: Judge + Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>Judge Name</label>
          <input
            value={form.judgeName}
            onChange={(e) => set("judgeName", e.target.value)}
            placeholder="Presiding judge"
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Status</label>
          <select
            value={form.status}
            onChange={(e) => set("status", e.target.value)}
            className={inputCls}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Row: Date Filed + Next Hearing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>Date Filed</label>
          <input
            type="date"
            value={form.dateFiled}
            onChange={(e) => set("dateFiled", e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Next Hearing Date</label>
          <input
            type="date"
            value={form.nextHearing}
            onChange={(e) => set("nextHearing", e.target.value)}
            className={inputCls}
          />
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className={labelCls}>Notes</label>
        <textarea
          value={form.notes}
          onChange={(e) => set("notes", e.target.value)}
          placeholder="Case notes, strategy, observations..."
          rows={3}
          className={`${inputCls} resize-none`}
        />
      </div>

      <div className="flex gap-2 pt-1">
        <Button type="submit" loading={saving} className="flex-1">
          {saving ? "Saving..." : "Save Case"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={saving}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

// ─────────────────────────────────────────────
// HEARING FORM COMPONENT
// ─────────────────────────────────────────────

interface HearingFormProps {
  matterId: string;
  existingMatters: Matter[];
  onAdded: (h: Hearing) => void;
  onCancel: () => void;
}

function HearingForm({ matterId, existingMatters, onAdded, onCancel }: HearingFormProps) {
  const [date, setDate] = useState("");
  const [purpose, setPurpose] = useState("");
  const [result, setResult] = useState("");
  const [nextDate, setNextDate] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // S06-03: Conflict detection — check if any other matter has nextHearing on same date
  const conflictingMatters = date
    ? existingMatters.filter((m) => m.id !== matterId && m.nextHearing && m.nextHearing.substring(0, 10) === date)
    : [];
  const nextDateConflicts = nextDate
    ? existingMatters.filter((m) => m.id !== matterId && m.nextHearing && m.nextHearing.substring(0, 10) === nextDate)
    : [];

  const inputCls =
    "w-full px-3 py-2 text-sm border border-[var(--border-default)] rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 bg-[var(--bg-surface-2)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)]";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/matters/${matterId}/hearings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, purpose, result, nextDate: nextDate || null }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Failed to add hearing");
      }
      const data = await res.json();
      onAdded(data.hearing);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 p-4 bg-[var(--bg-surface-2)] rounded-xl border border-[var(--border-default)]">
      <h4 className="text-sm font-bold text-white flex items-center gap-2">
        <History className="h-4 w-4 text-primary-500" />
        Add Hearing Record
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
            Hearing Date <span className="text-red-500">*</span>
          </label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputCls} required />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Next Date</label>
          <input type="date" value={nextDate} onChange={(e) => setNextDate(e.target.value)} className={inputCls} />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Purpose</label>
        <input
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          placeholder="e.g. Arguments, Evidence, Witness examination"
          className={inputCls}
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Result / Order</label>
        <input
          value={result}
          onChange={(e) => setResult(e.target.value)}
          placeholder="e.g. Adjourned, Part-heard, Order reserved"
          className={inputCls}
        />
      </div>
      {/* S06-03: Conflict warnings */}
      {conflictingMatters.length > 0 && (
        <div className="flex items-start gap-2 p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
          <AlertCircle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Conflict detected on Hearing Date!</p>
            {conflictingMatters.map((m) => (
              <p key={m.id} className="mt-0.5">• {m.title} — {m.court}</p>
            ))}
          </div>
        </div>
      )}
      {nextDateConflicts.length > 0 && (
        <div className="flex items-start gap-2 p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
          <AlertCircle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Conflict on Next Date!</p>
            {nextDateConflicts.map((m) => (
              <p key={m.id} className="mt-0.5">• {m.title} — {m.court}</p>
            ))}
          </div>
        </div>
      )}
      {error && <p className="text-xs text-red-600">{error}</p>}
      <div className="flex gap-2">
        <Button type="submit" size="sm" loading={saving}>
          Add Hearing
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={onCancel} disabled={saving}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

// ─────────────────────────────────────────────
// MATTER CARD COMPONENT
// ─────────────────────────────────────────────

interface MatterCardProps {
  matter: Matter;
  allMatters: Matter[];
  onEdit: (m: Matter) => void;
  onArchive: (id: string) => void;
  onNoteSave: (id: string, notes: string) => void;
  onHearingAdded: (matterId: string, h: Hearing) => void;
  onAdjourn: (matterId: string, newDate: string, reason: string) => Promise<void>;
}

function MatterCard({ matter, allMatters, onEdit, onArchive, onNoteSave, onHearingAdded, onAdjourn }: MatterCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [showHearingForm, setShowHearingForm] = useState(false);
  const [localNotes, setLocalNotes] = useState(matter.notes ?? "");
  const [archiveConfirm, setArchiveConfirm] = useState(false);
  // S06-06: Adjournment tracking state
  const [showAdjournForm, setShowAdjournForm] = useState(false);
  const [adjournDate, setAdjournDate] = useState("");
  const [adjournReason, setAdjournReason] = useState("");
  const [adjournSaving, setAdjournSaving] = useState(false);
  const [adjournError, setAdjournError] = useState("");

  const adjournCount = matter.hearings.filter(h => h.result?.toLowerCase().includes("adjourned")).length;

  const handleAdjournSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjournDate) return;
    setAdjournSaving(true);
    setAdjournError("");
    try {
      await onAdjourn(matter.id, adjournDate, adjournReason);
      setShowAdjournForm(false);
      setAdjournDate("");
      setAdjournReason("");
    } catch (err) {
      setAdjournError(err instanceof Error ? err.message : "Failed to adjourn");
    } finally {
      setAdjournSaving(false);
    }
  };

  const hearingToday = isToday(matter.nextHearing);
  const hearingTomorrow = isTomorrow(matter.nextHearing);

  let hearingBadge = "";
  if (hearingToday) hearingBadge = "TODAY";
  else if (hearingTomorrow) hearingBadge = "TOMORROW";

  return (
    <Card className={`overflow-hidden ${hearingToday ? "ring-2 ring-primary-400/50" : ""}`}>
      {/* Card Header */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Scale className="h-4 w-4 text-primary-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <div>
                <h3 className="text-sm font-bold text-[var(--text-primary)] leading-snug">{matter.title}</h3>
                {matter.caseNo && (
                  <p className="text-xs text-[var(--text-tertiary)] mt-0.5 font-mono">{matter.caseNo}</p>
                )}
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <span
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${STATUS_COLORS[matter.status] ?? "bg-[var(--bg-surface-2)] text-[var(--text-secondary)]"}`}
                >
                  {STATUS_LABELS[matter.status] ?? matter.status}
                </span>
                {adjournCount > 0 && (
                  <span className="text-[11px] font-semibold px-2 py-1 rounded-full bg-orange-100 text-orange-700 flex items-center gap-1" title={`Adjourned ${adjournCount} time(s)`}>
                    <Clock className="h-2.5 w-2.5" />
                    {adjournCount}×
                  </span>
                )}
              </div>
            </div>

            {/* Meta Row */}
            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-[var(--text-tertiary)]">
              {matter.court && (
                <span className="flex items-center gap-1">
                  <Gavel className="h-3 w-3 text-[var(--text-tertiary)]" />
                  {matter.court}
                </span>
              )}
              {matter.clientName && (
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3 text-[var(--text-tertiary)]" />
                  {matter.clientName}
                </span>
              )}
              {matter.caseType && (
                <span className="flex items-center gap-1">
                  <FileText className="h-3 w-3 text-[var(--text-tertiary)]" />
                  {matter.caseType}
                </span>
              )}
            </div>

            {/* Next Hearing */}
            {matter.nextHearing && (
              <div className="mt-2.5 flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-[var(--text-tertiary)]" />
                <span
                  className={`text-xs font-medium ${
                    hearingToday
                      ? "text-red-600"
                      : hearingTomorrow
                      ? "text-amber-600"
                      : "text-[var(--text-secondary)]"
                  }`}
                >
                  Next Hearing: {formatDate(matter.nextHearing)}
                  {hearingBadge && (
                    <span
                      className={`ml-1.5 px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        hearingToday ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {hearingBadge}
                    </span>
                  )}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Action Row */}
        <div className="mt-3 flex items-center gap-2 flex-wrap border-t border-[var(--border-subtle)] pt-3">
          <button
            onClick={() => setExpanded((p) => !p)}
            className="flex items-center gap-1 text-xs text-[var(--text-tertiary)] hover:text-primary-600 font-medium"
          >
            {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            {expanded ? "Collapse" : "Details"}
          </button>
          <div className="ml-auto flex items-center gap-1.5">
            <button
              onClick={() => onEdit(matter)}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-[var(--bg-surface-2)] text-[var(--text-secondary)] hover:bg-primary-50 hover:text-primary-700"
            >
              <Edit2 className="h-3 w-3" /> Edit
            </button>
            {matter.nextHearing && !showAdjournForm && (
              <button
                onClick={() => setShowAdjournForm(true)}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-orange-50 text-orange-700 hover:bg-orange-100"
                title="Mark this hearing as adjourned and set new date"
              >
                <Clock className="h-3 w-3" /> Adjourn
              </button>
            )}
            {archiveConfirm ? (
              <div className="flex items-center gap-1">
                <span className="text-xs text-[var(--text-tertiary)]">Archive?</span>
                <button
                  onClick={() => { onArchive(matter.id); setArchiveConfirm(false); }}
                  className="px-2 py-1 text-xs font-medium rounded-lg bg-red-100 text-red-700 hover:bg-red-200"
                >
                  Yes
                </button>
                <button
                  onClick={() => setArchiveConfirm(false)}
                  className="px-2 py-1 text-xs font-medium rounded-lg bg-[var(--bg-surface-2)] text-[var(--text-secondary)] hover:bg-slate-200"
                >
                  No
                </button>
              </div>
            ) : (
              <button
                onClick={() => setArchiveConfirm(true)}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-[var(--bg-surface-2)] text-[var(--text-secondary)] hover:bg-red-50 hover:text-red-600"
              >
                <Archive className="h-3 w-3" /> Archive
              </button>
            )}
          </div>
        </div>
      </div>

      {/* S06-06: Inline Adjournment Form */}
      {showAdjournForm && (
        <div className="border-t border-orange-100 p-4 bg-orange-50/50">
          <form onSubmit={handleAdjournSubmit} className="space-y-3">
            <h4 className="text-sm font-bold text-orange-800 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Mark Hearing as Adjourned
            </h4>
            <p className="text-xs text-orange-700">
              Current date ({formatDate(matter.nextHearing)}) will be recorded as adjourned in hearing history.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                  New Hearing Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={adjournDate}
                  onChange={(e) => setAdjournDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[var(--border-default)] rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 bg-[var(--bg-surface-2)] text-[var(--text-primary)]"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Reason (optional)</label>
                <input
                  value={adjournReason}
                  onChange={(e) => setAdjournReason(e.target.value)}
                  placeholder="e.g. Witness unavailable, Counsel busy"
                  className="w-full px-3 py-2 text-sm border border-[var(--border-default)] rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 bg-[var(--bg-surface-2)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)]"
                />
              </div>
            </div>
            {adjournError && <p className="text-xs text-red-600">{adjournError}</p>}
            <div className="flex gap-2">
              <Button type="submit" size="sm" loading={adjournSaving} className="bg-orange-600 hover:bg-orange-700 text-white border-orange-600">
                Confirm Adjournment
              </Button>
              <Button type="button" size="sm" variant="outline" onClick={() => { setShowAdjournForm(false); setAdjournDate(""); setAdjournReason(""); setAdjournError(""); }} disabled={adjournSaving}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Expanded Details */}
      {expanded && (
        <div className="border-t border-[var(--border-default)] p-4 space-y-4 bg-[var(--bg-surface-1)]">
          {/* Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            {matter.role && (
              <div>
                <span className="font-semibold text-[var(--text-tertiary)] block">Role</span>
                <span className="text-[var(--text-primary)]">{matter.role}</span>
              </div>
            )}
            {matter.opponentName && (
              <div>
                <span className="font-semibold text-[var(--text-tertiary)] block">Opponent</span>
                <span className="text-[var(--text-primary)]">{matter.opponentName}</span>
              </div>
            )}
            {matter.judgeName && (
              <div>
                <span className="font-semibold text-[var(--text-tertiary)] block">Judge</span>
                <span className="text-[var(--text-primary)]">{matter.judgeName}</span>
              </div>
            )}
            {matter.dateFiled && (
              <div>
                <span className="font-semibold text-[var(--text-tertiary)] block">Filed</span>
                <span className="text-[var(--text-primary)]">{formatDate(matter.dateFiled)}</span>
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-tertiary)] mb-1.5">
              <StickyNote className="h-3.5 w-3.5" />
              Case Notes
            </label>
            <textarea
              value={localNotes}
              onChange={(e) => setLocalNotes(e.target.value)}
              onBlur={() => onNoteSave(matter.id, localNotes)}
              placeholder="Add case notes, strategy, observations..."
              rows={3}
              className="w-full px-3 py-2 text-sm border border-[var(--border-default)] rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/40 bg-[var(--bg-surface-2)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] resize-none"
            />
            <p className="text-[10px] text-[var(--text-tertiary)] mt-1">Notes auto-save on blur</p>
          </div>

          {/* Hearing History */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-semibold text-[var(--text-secondary)] flex items-center gap-1.5">
                <History className="h-3.5 w-3.5" />
                Hearing History ({matter.hearings.length})
              </h4>
              {!showHearingForm && (
                <button
                  onClick={() => setShowHearingForm(true)}
                  className="flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Hearing
                </button>
              )}
            </div>

            {showHearingForm && (
              <HearingForm
                matterId={matter.id}
                existingMatters={allMatters}
                onAdded={(h) => {
                  onHearingAdded(matter.id, h);
                  setShowHearingForm(false);
                }}
                onCancel={() => setShowHearingForm(false)}
              />
            )}

            {matter.hearings.length === 0 ? (
              <p className="text-xs text-[var(--text-tertiary)] italic">No hearings recorded yet</p>
            ) : (
              <div className="space-y-2 mt-2">
                {matter.hearings.map((h) => (
                  <div key={h.id} className="flex gap-3 text-xs bg-[var(--bg-surface-2)] rounded-lg p-2.5 border border-[var(--border-default)]">
                    <div className="text-[var(--text-tertiary)] font-mono flex-shrink-0">{formatDate(h.date)}</div>
                    <div className="flex-1 space-y-0.5">
                      {h.purpose && <div className="text-[var(--text-secondary)]">{h.purpose}</div>}
                      {h.result && (
                        <div className="text-[var(--text-tertiary)] italic">{h.result}</div>
                      )}
                      {h.nextDate && (
                        <div className="text-primary-600 font-medium">
                          Next: {formatDate(h.nextDate)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}

// ─────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────

export default function ChamberPage() {
  const [matters, setMatters] = useState<Matter[]>([]);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);
  const [error, setError] = useState("");

  const [activeTab, setActiveTab] = useState<Tab>("today");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterCourt, setFilterCourt] = useState("");
  // S06-05: Calendar state
  const [calendarYear, setCalendarYear] = useState(() => new Date().getFullYear());
  const [calendarMonth, setCalendarMonth] = useState(() => new Date().getMonth());
  const [calendarSelected, setCalendarSelected] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editingMatter, setEditingMatter] = useState<Matter | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  // Fetch matters
  const fetchMatters = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/matters");
      if (res.status === 401) {
        setUnauthorized(true);
        setLoading(false);
        return;
      }
      if (!res.ok) throw new Error("Failed to load cases");
      const data = await res.json();
      setMatters(data.matters ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading cases");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMatters();
  }, [fetchMatters]);

  // Create matter
  const handleCreate = async (form: ReturnType<typeof emptyForm>) => {
    setSaving(true);
    setFormError("");
    try {
      const res = await fetch("/api/matters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Failed to create case");
      }
      const data = await res.json();
      setMatters((p) => [{ ...data.matter, hearings: [] }, ...p]);
      setShowForm(false);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed");
    } finally {
      setSaving(false);
    }
  };

  // Update matter
  const handleUpdate = async (form: ReturnType<typeof emptyForm>) => {
    if (!editingMatter) return;
    setSaving(true);
    setFormError("");
    try {
      const res = await fetch(`/api/matters/${editingMatter.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Failed to update case");
      }
      const data = await res.json();
      setMatters((p) =>
        p.map((m) => (m.id === editingMatter.id ? data.matter : m))
      );
      setEditingMatter(null);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed");
    } finally {
      setSaving(false);
    }
  };

  // Archive matter
  const handleArchive = async (id: string) => {
    try {
      const res = await fetch(`/api/matters/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to archive");
      setMatters((p) => p.filter((m) => m.id !== id));
    } catch {
      alert("Could not archive case. Please try again.");
    }
  };

  // Save notes
  const handleNoteSave = async (id: string, notes: string) => {
    try {
      await fetch(`/api/matters/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      });
      setMatters((p) => p.map((m) => (m.id === id ? { ...m, notes } : m)));
    } catch {
      // Silent fail for notes
    }
  };

  // S06-06: Mark matter as adjourned — records old hearing + updates status/nextHearing
  const handleAdjourn = async (matterId: string, newDate: string, reason: string) => {
    const matter = matters.find((m) => m.id === matterId);
    if (!matter) return;
    // 1. Record old hearing as Adjourned
    const hearingRes = await fetch(`/api/matters/${matterId}/hearings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: matter.nextHearing ?? new Date().toISOString().substring(0, 10),
        purpose: "Hearing",
        result: reason ? `Adjourned — ${reason}` : "Adjourned",
        nextDate: newDate,
      }),
    });
    if (!hearingRes.ok) {
      const d = await hearingRes.json();
      throw new Error(d.error || "Failed to record hearing");
    }
    const hearingData = await hearingRes.json();
    // 2. Update matter status + nextHearing
    const matterRes = await fetch(`/api/matters/${matterId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "adjourned", nextHearing: newDate }),
    });
    if (!matterRes.ok) {
      // Rollback: delete the hearing record we just created
      if (hearingData.hearing?.id) {
        await fetch(`/api/matters/${matterId}/hearings/${hearingData.hearing.id}`, {
          method: "DELETE",
        }).catch(() => {});
      }
      const d = await matterRes.json();
      throw new Error(d.error || "Failed to update matter. Hearing record has been rolled back.");
    }
    const matterData = await matterRes.json();
    setMatters((prev) =>
      prev.map((m) => {
        if (m.id !== matterId) return m;
        return {
          ...matterData.matter,
          hearings: [hearingData.hearing, ...m.hearings],
        };
      })
    );
  };

  // Add hearing to a matter
  const handleHearingAdded = (matterId: string, hearing: Hearing) => {
    setMatters((prev) =>
      prev.map((m) => {
        if (m.id !== matterId) return m;
        const updatedHearings = [hearing, ...m.hearings];
        const nextHearing = hearing.nextDate ?? m.nextHearing;
        return { ...m, hearings: updatedHearings, nextHearing };
      })
    );
  };

  // Filtered matters for "All Cases" tab
  const filteredMatters = matters.filter((m) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      m.title.toLowerCase().includes(q) ||
      m.clientName.toLowerCase().includes(q) ||
      (m.caseNo?.toLowerCase().includes(q) ?? false) ||
      (m.court?.toLowerCase().includes(q) ?? false);
    const matchStatus = !filterStatus || m.status === filterStatus;
    const matchCourt = !filterCourt || m.court === filterCourt;
    return matchSearch && matchStatus && matchCourt;
  });

  // Today's matters
  const todayMatters = matters
    .filter((m) => isToday(m.nextHearing))
    .sort((a, b) => (a.court ?? "").localeCompare(b.court ?? ""));

  // All unique courts for filter
  const allCourts = [...new Set(matters.map((m) => m.court).filter(Boolean))].sort();

  const isFormOpen = showForm || editingMatter !== null;

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2.5">
            <Briefcase className="h-6 w-6 text-primary-600" />
            Chamber
          </h1>
          <p className="text-[var(--text-tertiary)] text-sm mt-1">
            Manage your court matters, hearings, and case notes
          </p>
        </div>
        {!unauthorized && (
          <Button
            onClick={() => {
              setEditingMatter(null);
              setShowForm((p) => !p);
              setFormError("");
            }}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Case
          </Button>
        )}
      </div>

      {/* ── Add / Edit Form Panel ── */}
      {isFormOpen && (
        <Card className="p-5 border-l-4 border-l-primary-500">
          {formError && (
            <div className="mb-3 flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-xl px-3 py-2.5">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {formError}
            </div>
          )}
          <MatterForm
            key={editingMatter?.id ?? "new"}
            title={editingMatter ? "Edit Case" : "New Case"}
            initial={
              editingMatter
                ? {
                    title: editingMatter.title,
                    caseNo: editingMatter.caseNo ?? "",
                    court: editingMatter.court ?? "",
                    caseType: editingMatter.caseType ?? "Civil",
                    status: editingMatter.status ?? "active",
                    role: editingMatter.role ?? "",
                    clientName: editingMatter.clientName,
                    opponentName: editingMatter.opponentName ?? "",
                    judgeName: editingMatter.judgeName ?? "",
                    dateFiled: toInputDate(editingMatter.dateFiled),
                    nextHearing: toInputDate(editingMatter.nextHearing),
                    notes: editingMatter.notes ?? "",
                  }
                : undefined
            }
            onSubmit={editingMatter ? handleUpdate : handleCreate}
            onCancel={() => {
              setShowForm(false);
              setEditingMatter(null);
              setFormError("");
            }}
            saving={saving}
          />
        </Card>
      )}

      {/* ── Unauthorized ── */}
      {unauthorized && (
        <Card className="p-8 text-center">
          <Scale className="h-12 w-12 text-[var(--text-secondary)] mx-auto mb-3" />
          <h3 className="text-base font-semibold text-[var(--text-secondary)]">Please Login</h3>
          <p className="text-sm text-[var(--text-tertiary)] mt-1">
            Login to access your Chamber and manage cases.
          </p>
        </Card>
      )}

      {/* ── Tabs ── */}
      {!unauthorized && (
        <>
          <div className="flex items-center gap-1 border-b border-[var(--border-default)] pb-0 overflow-x-auto">
            {(
              [
                { key: "today", label: "Today", count: todayMatters.length, icon: Clock },
                { key: "all", label: "All Cases", count: matters.length, icon: Briefcase },
                { key: "calendar", label: "Calendar", count: null, icon: CalendarDays },
                { key: "deadlines", label: "Deadlines", count: matters.filter(m => m.nextHearing && !m.archived).length, icon: Bell },
              ] as { key: Tab; label: string; count: number | null; icon: React.ElementType }[]
            ).map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors flex-shrink-0 ${
                    activeTab === t.key
                      ? "border-primary-500 text-primary-600"
                      : "border-transparent text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {t.label}
                  {t.count !== null && (
                    <span
                      className={`text-[11px] px-1.5 py-0.5 rounded-full font-bold ${
                        activeTab === t.key
                          ? "bg-primary-100 text-primary-600"
                          : "bg-[var(--bg-surface-2)] text-[var(--text-tertiary)]"
                      }`}
                    >
                      {t.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* ── TODAY TAB ── */}
          {activeTab === "today" && (
            <div>
              {loading ? (
                <LoadingState />
              ) : error ? (
                <ErrorState message={error} onRetry={fetchMatters} />
              ) : todayMatters.length === 0 ? (
                <Card className="p-10 text-center">
                  <Clock className="h-12 w-12 text-[var(--text-tertiary)] mx-auto mb-3" />
                  <h3 className="text-base font-semibold text-[var(--text-tertiary)]">No hearings today</h3>
                  <p className="text-sm text-[var(--text-tertiary)] mt-1">
                    You have no matters scheduled for today. Enjoy the free day.
                  </p>
                </Card>
              ) : (
                <div className="space-y-4">
                  <p className="text-xs text-[var(--text-tertiary)] font-medium uppercase tracking-wide">
                    {todayMatters.length} hearing{todayMatters.length !== 1 ? "s" : ""} scheduled today
                  </p>
                  {todayMatters.map((m) => (
                    <MatterCard
                      key={m.id}
                      matter={m}
                      allMatters={matters}
                      onEdit={(mat) => {
                        setShowForm(false);
                        setEditingMatter(mat);
                        setFormError("");
                      }}
                      onArchive={handleArchive}
                      onNoteSave={handleNoteSave}
                      onHearingAdded={handleHearingAdded}
                      onAdjourn={handleAdjourn}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── CALENDAR TAB (S06-05) ── */}
          {activeTab === "calendar" && (() => {
            const grid = buildCalendarGrid(calendarYear, calendarMonth);
            const prevMonth = () => {
              if (calendarMonth === 0) { setCalendarMonth(11); setCalendarYear(y => y - 1); }
              else setCalendarMonth(m => m - 1);
            };
            const nextMonth = () => {
              if (calendarMonth === 11) { setCalendarMonth(0); setCalendarYear(y => y + 1); }
              else setCalendarMonth(m => m + 1);
            };
            const todayStr = new Date().toISOString().substring(0, 10);
            const selectedDayMatters = calendarSelected ? matters.filter(m => m.nextHearing?.substring(0, 10) === calendarSelected) : [];
            return (
              <div className="space-y-4">
                {/* Month navigation */}
                <Card className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <button onClick={prevMonth} className="p-2 rounded-xl hover:bg-[var(--bg-surface-2)] text-[var(--text-secondary)]">
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <h3 className="text-sm font-bold text-[var(--text-primary)]">
                      {new Date(calendarYear, calendarMonth).toLocaleDateString("en-PK", { month: "long", year: "numeric" })}
                    </h3>
                    <button onClick={nextMonth} className="p-2 rounded-xl hover:bg-[var(--bg-surface-2)] text-[var(--text-secondary)]">
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                  {/* Day labels */}
                  <div className="grid grid-cols-7 gap-1 mb-1">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                      <div key={d} className="text-[10px] font-semibold text-[var(--text-tertiary)] text-center py-1">{d}</div>
                    ))}
                  </div>
                  {/* Day cells */}
                  <div className="grid grid-cols-7 gap-1">
                    {grid.map((day, i) => {
                      if (!day) return <div key={i} />;
                      const dateStr = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, "0")}-${String(day.getDate()).padStart(2, "0")}`;
                      const dayMatters = matters.filter(m => m.nextHearing?.substring(0, 10) === dateStr);
                      const isCurrentDay = dateStr === todayStr;
                      const isSelected = calendarSelected === dateStr;
                      return (
                        <button
                          key={i}
                          onClick={() => setCalendarSelected(isSelected ? null : dateStr)}
                          className={`relative aspect-square rounded-xl text-xs font-medium flex flex-col items-center justify-center transition-all ${
                            isSelected ? "bg-primary-600 text-white shadow-md" :
                            isCurrentDay ? "bg-primary-100 text-primary-700 font-bold ring-2 ring-primary-300" :
                            dayMatters.length > 0 ? "bg-indigo-50 text-indigo-700 hover:bg-indigo-100" :
                            "text-[var(--text-tertiary)] hover:bg-[var(--bg-surface-2)]"
                          }`}
                        >
                          {day.getDate()}
                          {dayMatters.length > 0 && (
                            <span className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${isSelected ? "bg-white" : isCurrentDay ? "bg-primary-500" : "bg-indigo-400"}`} />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </Card>

                {/* Selected day matters */}
                {calendarSelected && (
                  <div>
                    <h4 className="text-xs font-semibold text-[var(--text-secondary)] mb-2 flex items-center gap-1.5">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {new Date(calendarSelected + "T12:00:00").toLocaleDateString("en-PK", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                      {" "}— {selectedDayMatters.length} hearing{selectedDayMatters.length !== 1 ? "s" : ""}
                    </h4>
                    {selectedDayMatters.length === 0 ? (
                      <p className="text-xs text-[var(--text-tertiary)] text-center py-4">No hearings scheduled on this date.</p>
                    ) : (
                      <div className="space-y-2">
                        {selectedDayMatters.map(m => (
                          <Card key={m.id} className="p-3 flex items-start gap-3">
                            <div className="w-7 h-7 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Scale className="h-3.5 w-3.5 text-primary-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{m.title}</p>
                              <p className="text-xs text-[var(--text-tertiary)] mt-0.5">{m.court} · {m.clientName}</p>
                              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${STATUS_COLORS[m.status] ?? "bg-[var(--bg-surface-2)] text-[var(--text-secondary)]"}`}>
                                {STATUS_LABELS[m.status] ?? m.status}
                              </span>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Legend */}
                <div className="flex gap-4 text-[10px] text-[var(--text-tertiary)]">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary-400 inline-block" /> Today</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-400 inline-block" /> Has hearing</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary-600 inline-block" /> Selected</span>
                </div>
              </div>
            );
          })()}

          {/* ── DEADLINES TAB (S06-08/S06-09) ── */}
          {activeTab === "deadlines" && (() => {
            const now = new Date();
            now.setHours(0, 0, 0, 0);
            const upcoming = matters
              .filter(m => m.nextHearing && !m.archived)
              .map(m => {
                const hearingDate = new Date(m.nextHearing!);
                hearingDate.setHours(0, 0, 0, 0);
                const daysUntil = Math.ceil((hearingDate.getTime() - now.getTime()) / 86400000);
                const filingDue = new Date(hearingDate); filingDue.setDate(hearingDate.getDate() - 7);
                const prepDue = new Date(hearingDate); prepDue.setDate(hearingDate.getDate() - 3);
                return { ...m, daysUntil, filingDue, prepDue };
              })
              .sort((a, b) => a.daysUntil - b.daysUntil);

            if (upcoming.length === 0) return (
              <Card className="p-10 text-center">
                <Bell className="h-12 w-12 text-[var(--text-tertiary)] mx-auto mb-3" />
                <h3 className="text-base font-semibold text-[var(--text-tertiary)]">No upcoming deadlines</h3>
                <p className="text-sm text-[var(--text-tertiary)] mt-1">Add cases with hearing dates to see deadlines here.</p>
              </Card>
            );

            const groups = [
              { label: "Overdue", tc: "text-red-700", bg: "bg-red-50", border: "border-red-200", items: upcoming.filter(m => m.daysUntil < 0) },
              { label: "Today", tc: "text-red-600", bg: "bg-red-50", border: "border-red-200", items: upcoming.filter(m => m.daysUntil === 0) },
              { label: "Tomorrow", tc: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200", items: upcoming.filter(m => m.daysUntil === 1) },
              { label: "This Week", tc: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200", items: upcoming.filter(m => m.daysUntil >= 2 && m.daysUntil <= 7) },
              { label: "Later", tc: "text-[var(--text-secondary)]", bg: "bg-[var(--bg-surface-2)]", border: "border-[var(--border-default)]", items: upcoming.filter(m => m.daysUntil > 7) },
            ].filter(g => g.items.length > 0);

            return (
              <div className="space-y-5">
                {groups.map(group => (
                  <div key={group.label}>
                    <h3 className={`text-xs font-bold uppercase tracking-wider mb-2 ${group.tc}`}>
                      {group.label} ({group.items.length})
                    </h3>
                    <div className="space-y-2">
                      {group.items.map(m => (
                        <Card key={m.id} className={`p-3 border ${group.border}`}>
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{m.title}</p>
                              <p className="text-xs text-[var(--text-tertiary)] mt-0.5">{m.court} · {m.clientName}</p>
                            </div>
                            <span className={`text-xs font-bold px-2 py-1 rounded-lg flex-shrink-0 ${group.bg} ${group.tc}`}>
                              {m.daysUntil < 0 ? `${Math.abs(m.daysUntil)}d overdue` : m.daysUntil === 0 ? "Today" : m.daysUntil === 1 ? "Tomorrow" : `In ${m.daysUntil}d`}
                            </span>
                          </div>
                          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[10px]">
                            <span className="flex items-center gap-1 text-[var(--text-tertiary)]">
                              <Calendar className="h-3 w-3" />
                              Hearing: {formatDate(m.nextHearing)}
                            </span>
                            <span className={`flex items-center gap-1 font-medium ${now >= m.filingDue ? "text-red-600" : "text-amber-600"}`}>
                              <Bell className="h-3 w-3" />
                              Filing Due: {formatDate(m.filingDue.toISOString())}
                            </span>
                            <span className={`flex items-center gap-1 ${now >= m.prepDue ? "text-red-600 font-medium" : "text-[var(--text-tertiary)]"}`}>
                              <Clock className="h-3 w-3" />
                              Prep Due: {formatDate(m.prepDue.toISOString())}
                            </span>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}

          {/* ── ALL CASES TAB ── */}
          {activeTab === "all" && (
            <div className="space-y-4">
              {/* Search + Filters */}
              <div className="flex flex-wrap gap-3">
                <div className="relative flex-1 min-w-48">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-tertiary)] pointer-events-none" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search cases, client, case no..."
                    className="w-full pl-9 pr-3 py-2 text-sm border border-[var(--border-default)] rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/40 bg-[var(--bg-surface-2)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)]"
                  />
                  {search && (
                    <button
                      onClick={() => setSearch("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 text-sm border border-[var(--border-default)] rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/40 bg-[var(--bg-surface-2)] text-[var(--text-primary)]"
                >
                  <option value="">All Statuses</option>
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_LABELS[s]}
                    </option>
                  ))}
                </select>
                {allCourts.length > 0 && (
                  <select
                    value={filterCourt}
                    onChange={(e) => setFilterCourt(e.target.value)}
                    className="px-3 py-2 text-sm border border-[var(--border-default)] rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/40 bg-[var(--bg-surface-2)] text-[var(--text-primary)] max-w-[220px]"
                  >
                    <option value="">All Courts</option>
                    {allCourts.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {loading ? (
                <LoadingState />
              ) : error ? (
                <ErrorState message={error} onRetry={fetchMatters} />
              ) : matters.length === 0 ? (
                <Card className="p-10 text-center">
                  <Briefcase className="h-12 w-12 text-[var(--text-tertiary)] mx-auto mb-3" />
                  <h3 className="text-base font-semibold text-[var(--text-tertiary)]">No cases yet</h3>
                  <p className="text-sm text-[var(--text-tertiary)] mt-1">
                    Click &ldquo;Add Case&rdquo; to register your first matter.
                  </p>
                </Card>
              ) : filteredMatters.length === 0 ? (
                <Card className="p-8 text-center">
                  <Search className="h-10 w-10 text-[var(--text-tertiary)] mx-auto mb-3" />
                  <h3 className="text-sm font-semibold text-[var(--text-tertiary)]">No matches found</h3>
                  <p className="text-xs text-[var(--text-tertiary)] mt-1">Try adjusting your search or filters.</p>
                </Card>
              ) : (
                <div className="space-y-4">
                  <p className="text-xs text-[var(--text-tertiary)]">
                    Showing {filteredMatters.length} of {matters.length} cases
                  </p>
                  {filteredMatters.map((m) => (
                    <MatterCard
                      key={m.id}
                      matter={m}
                      allMatters={matters}
                      onEdit={(mat) => {
                        setShowForm(false);
                        setEditingMatter(mat);
                        setFormError("");
                      }}
                      onArchive={handleArchive}
                      onNoteSave={handleNoteSave}
                      onHearingAdded={handleHearingAdded}
                      onAdjourn={handleAdjourn}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// MINOR UTILITY COMPONENTS
// ─────────────────────────────────────────────

function LoadingState() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <div className="relative mx-auto w-12 h-12 mb-3">
          <div className="absolute inset-0 rounded-full border-4 border-[var(--border-subtle)]" />
          <div className="absolute inset-0 rounded-full border-4 border-primary-500 border-t-transparent animate-spin" />
        </div>
        <p className="text-sm text-[var(--text-tertiary)]">Loading cases...</p>
      </div>
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <Card className="p-8 text-center">
      <AlertCircle className="h-10 w-10 text-red-300 mx-auto mb-3" />
      <h3 className="text-sm font-semibold text-[var(--text-secondary)]">{message}</h3>
      <Button size="sm" variant="outline" className="mt-3" onClick={onRetry}>
        Retry
      </Button>
    </Card>
  );
}
