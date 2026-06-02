"use client";

import { useState, useEffect, useCallback } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import {
  BookOpen, Plus, Pencil, Trash2, X, AlertCircle, ChevronUp, ChevronDown, Filter,
} from "lucide-react";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

interface DiaryEntry {
  id: string;
  caseNumber: string | null;
  lastDate: string | null;
  title: string;
  courtName: string;
  stage: string;
  proceeding: string | null;
  nextDate: string | null;
  createdAt: string;
  updatedAt: string;
}

type SortDir = "asc" | "desc";

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────

const STAGES = [
  "Arguments",
  "Evidence",
  "Bail Hearing",
  "Judgment",
  "Mention",
  "Framing of Charges",
  "Final Arguments",
  "Other",
];

const STAGE_COLORS: Record<string, string> = {
  "Arguments": "bg-blue-100 text-blue-700",
  "Evidence": "bg-purple-100 text-purple-700",
  "Bail Hearing": "bg-orange-100 text-orange-700",
  "Judgment": "bg-red-100 text-red-700",
  "Mention": "bg-slate-100 text-slate-600",
  "Framing of Charges": "bg-yellow-100 text-yellow-700",
  "Final Arguments": "bg-indigo-100 text-indigo-700",
  "Other": "bg-slate-100 text-slate-500",
};

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

function isToday(dateStr: string | null): boolean {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const t = new Date();
  return d.getFullYear() === t.getFullYear() && d.getMonth() === t.getMonth() && d.getDate() === t.getDate();
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-PK", { day: "2-digit", month: "short", year: "numeric" });
}

function toInputDate(dateStr: string | null): string {
  if (!dateStr) return "";
  return new Date(dateStr).toISOString().substring(0, 10);
}

function emptyForm() {
  return { caseNumber: "", lastDate: "", title: "", courtName: "", stage: "Arguments", proceeding: "", nextDate: "" };
}

// ─────────────────────────────────────────────
// DIARY FORM
// ─────────────────────────────────────────────

interface DiaryFormProps {
  initial?: ReturnType<typeof emptyForm>;
  onSubmit: (data: ReturnType<typeof emptyForm>) => Promise<void>;
  onCancel: () => void;
  saving: boolean;
  isEdit: boolean;
}

function DiaryForm({ initial, onSubmit, onCancel, saving, isEdit }: DiaryFormProps) {
  const [form, setForm] = useState(initial ?? emptyForm());
  const set = (k: keyof typeof form, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const inputCls = "w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400/40 focus:border-primary-300 bg-white text-slate-800 placeholder-slate-400";
  const labelCls = "block text-xs font-semibold text-slate-600 mb-1";

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="space-y-4">
      <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
        <BookOpen className="h-4 w-4 text-primary-500" />
        {isEdit ? "Edit Diary Entry" : "Add Case to Diary"}
      </h3>

      {/* Row: Title + Case Number */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>Case Title <span className="text-red-500">*</span></label>
          <input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Ali v. Khan" className={inputCls} required />
        </div>
        <div>
          <label className={labelCls}>Case Number</label>
          <input value={form.caseNumber} onChange={(e) => set("caseNumber", e.target.value)} placeholder="e.g. CS-1234/2024" className={inputCls} />
        </div>
      </div>

      {/* Row: Court + Stage */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>Court Name <span className="text-red-500">*</span></label>
          <input value={form.courtName} onChange={(e) => set("courtName", e.target.value)} placeholder="e.g. Lahore High Court" className={inputCls} required />
        </div>
        <div>
          <label className={labelCls}>Stage <span className="text-red-500">*</span></label>
          <select value={form.stage} onChange={(e) => set("stage", e.target.value)} className={inputCls}>
            {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Row: Last Date + Next Date */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>Last Date</label>
          <input type="date" value={form.lastDate} onChange={(e) => set("lastDate", e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Next Date</label>
          <input type="date" value={form.nextDate} onChange={(e) => set("nextDate", e.target.value)} className={inputCls} />
        </div>
      </div>

      {/* Proceeding */}
      <div>
        <label className={labelCls}>Proceeding (what happened at last hearing)</label>
        <textarea value={form.proceeding} onChange={(e) => set("proceeding", e.target.value)} placeholder="e.g. Arguments heard, adjourned for next date..." rows={2} className={`${inputCls} resize-none`} />
      </div>

      <div className="flex gap-2 pt-1">
        <Button type="submit" loading={saving} className="flex-1">{saving ? "Saving..." : isEdit ? "Update Entry" : "Add to Diary"}</Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={saving}>Cancel</Button>
      </div>
    </form>
  );
}

// ─────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────

export default function LawyerDiaryPage() {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<DiaryEntry | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [filterCourt, setFilterCourt] = useState("");

  // Fetch entries
  const fetchEntries = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/diary");
      if (res.status === 401) { setUnauthorized(true); setLoading(false); return; }
      if (!res.ok) throw new Error("Failed to load diary");
      const data = await res.json();
      setEntries(data.entries ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading diary");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchEntries(); }, [fetchEntries]);

  // Create entry
  const handleCreate = async (form: ReturnType<typeof emptyForm>) => {
    setSaving(true);
    setFormError("");
    try {
      const res = await fetch("/api/diary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || "Failed to add entry"); }
      const data = await res.json();
      setEntries((p) => [...p, data.entry].sort((a, b) => sortByNextDate(a, b, "asc")));
      setShowForm(false);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed");
    } finally {
      setSaving(false);
    }
  };

  // Update entry
  const handleUpdate = async (form: ReturnType<typeof emptyForm>) => {
    if (!editingEntry) return;
    setSaving(true);
    setFormError("");
    try {
      const res = await fetch(`/api/diary/${editingEntry.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || "Failed to update entry"); }
      const data = await res.json();
      setEntries((p) => p.map((e) => (e.id === editingEntry.id ? data.entry : e)));
      setEditingEntry(null);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed");
    } finally {
      setSaving(false);
    }
  };

  // Delete entry
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/diary/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setEntries((p) => p.filter((e) => e.id !== id));
      setDeleteConfirmId(null);
    } catch {
      alert("Could not delete entry. Please try again.");
    }
  };

  // Sort + filter
  function sortByNextDate(a: DiaryEntry, b: DiaryEntry, dir: SortDir): number {
    const da = a.nextDate ? new Date(a.nextDate).getTime() : Infinity;
    const db = b.nextDate ? new Date(b.nextDate).getTime() : Infinity;
    return dir === "asc" ? da - db : db - da;
  }

  const allCourts = [...new Set(entries.map((e) => e.courtName).filter(Boolean))].sort();

  const todayEntries = entries.filter((e) => isToday(e.nextDate));
  const displayEntries = entries
    .filter((e) => !filterCourt || e.courtName === filterCourt)
    .sort((a, b) => {
      // Today's hearings always at top
      const aToday = isToday(a.nextDate) ? 0 : 1;
      const bToday = isToday(b.nextDate) ? 0 : 1;
      if (aToday !== bToday) return aToday - bToday;
      return sortByNextDate(a, b, sortDir);
    });

  const isFormOpen = showForm || editingEntry !== null;

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2.5">
            <BookOpen className="h-6 w-6 text-primary-600" />
            Lawyer Diary
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Your daily case register — all active cases at a glance
          </p>
        </div>
        {!unauthorized && (
          <Button onClick={() => { setEditingEntry(null); setShowForm((p) => !p); setFormError(""); }} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Case
          </Button>
        )}
      </div>

      {/* ── Today's banner ── */}
      {todayEntries.length > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 font-medium">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {todayEntries.length} hearing{todayEntries.length !== 1 ? "s" : ""} today —{" "}
          {todayEntries.map((e) => e.title).join(", ")}
        </div>
      )}

      {/* ── Add / Edit Form ── */}
      {isFormOpen && (
        <Card className="p-5 border-l-4 border-l-primary-500">
          {formError && (
            <div className="mb-3 flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-xl px-3 py-2.5">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {formError}
            </div>
          )}
          <DiaryForm
            key={editingEntry?.id ?? "new"}
            isEdit={!!editingEntry}
            initial={
              editingEntry
                ? {
                    caseNumber: editingEntry.caseNumber ?? "",
                    lastDate: toInputDate(editingEntry.lastDate),
                    title: editingEntry.title,
                    courtName: editingEntry.courtName,
                    stage: editingEntry.stage,
                    proceeding: editingEntry.proceeding ?? "",
                    nextDate: toInputDate(editingEntry.nextDate),
                  }
                : undefined
            }
            onSubmit={editingEntry ? handleUpdate : handleCreate}
            onCancel={() => { setShowForm(false); setEditingEntry(null); setFormError(""); }}
            saving={saving}
          />
        </Card>
      )}

      {/* ── Unauthorized ── */}
      {unauthorized && (
        <Card className="p-8 text-center">
          <BookOpen className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-600">Please Login</h3>
          <p className="text-sm text-slate-400 mt-1">Login to access your Lawyer Diary.</p>
        </Card>
      )}

      {/* ── Diary Table ── */}
      {!unauthorized && (
        <>
          {/* Filters row */}
          {entries.length > 0 && (
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Filter className="h-3.5 w-3.5" />
                <span className="font-medium">Filter:</span>
              </div>
              <select
                value={filterCourt}
                onChange={(e) => setFilterCourt(e.target.value)}
                className="px-3 py-1.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400/40 bg-white text-slate-700"
              >
                <option value="">All Courts</option>
                {allCourts.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <span className="ml-auto text-xs text-slate-400">
                {displayEntries.length} case{displayEntries.length !== 1 ? "s" : ""}
              </span>
            </div>
          )}

          {/* Table */}
          {loading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState message={error} onRetry={fetchEntries} />
          ) : entries.length === 0 ? (
            <Card className="p-12 text-center">
              <BookOpen className="h-14 w-14 text-slate-200 mx-auto mb-4" />
              <h3 className="text-base font-semibold text-slate-500">Diary is empty</h3>
              <p className="text-sm text-slate-400 mt-1 mb-4">
                Add your first case to start tracking your hearings.
              </p>
              <Button onClick={() => setShowForm(true)} className="mx-auto">
                <Plus className="h-4 w-4 mr-1.5" />
                Add First Case
              </Button>
            </Card>
          ) : (
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50">
                      <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Case No.</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Last Date</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Title</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Court Name</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Stage</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Proceeding</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                        <button
                          onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
                          className="flex items-center gap-1 hover:text-primary-600 transition-colors"
                        >
                          Next Date
                          {sortDir === "asc" ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                        </button>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {displayEntries.map((entry) => {
                      const today = isToday(entry.nextDate);
                      return (
                        <tr
                          key={entry.id}
                          className={`transition-colors hover:bg-slate-50 ${today ? "bg-red-50/60" : ""}`}
                        >
                          {/* Case No */}
                          <td className="px-4 py-3 text-slate-500 font-mono text-xs whitespace-nowrap">
                            {entry.caseNumber || <span className="text-slate-300">—</span>}
                          </td>

                          {/* Last Date */}
                          <td className="px-4 py-3 text-slate-600 whitespace-nowrap text-xs">
                            {formatDate(entry.lastDate)}
                          </td>

                          {/* Title */}
                          <td className="px-4 py-3">
                            <span className="font-semibold text-slate-800 leading-snug">{entry.title}</span>
                          </td>

                          {/* Court Name */}
                          <td className="px-4 py-3 text-slate-600 text-xs whitespace-nowrap">
                            {entry.courtName}
                          </td>

                          {/* Stage */}
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${STAGE_COLORS[entry.stage] ?? "bg-slate-100 text-slate-600"}`}>
                              {entry.stage}
                            </span>
                          </td>

                          {/* Proceeding */}
                          <td className="px-4 py-3 text-slate-500 text-xs max-w-[200px]">
                            <span className="line-clamp-2">{entry.proceeding || <span className="text-slate-300">—</span>}</span>
                          </td>

                          {/* Next Date */}
                          <td className="px-4 py-3 whitespace-nowrap">
                            {entry.nextDate ? (
                              <span className={`text-xs font-semibold ${today ? "text-red-600" : "text-slate-700"}`}>
                                {formatDate(entry.nextDate)}
                                {today && (
                                  <span className="ml-1.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700">TODAY</span>
                                )}
                              </span>
                            ) : (
                              <span className="text-slate-300 text-xs">—</span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="px-4 py-3 whitespace-nowrap">
                            {deleteConfirmId === entry.id ? (
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-slate-500">Remove?</span>
                                <button onClick={() => handleDelete(entry.id)} className="px-2 py-1 text-xs font-medium rounded-lg bg-red-100 text-red-700 hover:bg-red-200">Yes</button>
                                <button onClick={() => setDeleteConfirmId(null)} className="px-2 py-1 text-xs font-medium rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200">No</button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => { setShowForm(false); setEditingEntry(entry); setFormError(""); }}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                                  title="Edit"
                                >
                                  <Pencil className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={() => setDeleteConfirmId(entry.id)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// UTILITY COMPONENTS
// ─────────────────────────────────────────────

function LoadingState() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <div className="relative mx-auto w-12 h-12 mb-3">
          <div className="absolute inset-0 rounded-full border-4 border-slate-100" />
          <div className="absolute inset-0 rounded-full border-4 border-primary-500 border-t-transparent animate-spin" />
        </div>
        <p className="text-sm text-slate-500">Loading diary...</p>
      </div>
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <Card className="p-8 text-center">
      <AlertCircle className="h-10 w-10 text-red-300 mx-auto mb-3" />
      <h3 className="text-sm font-semibold text-slate-600">{message}</h3>
      <Button size="sm" variant="outline" className="mt-3" onClick={onRetry}>Retry</Button>
    </Card>
  );
}
