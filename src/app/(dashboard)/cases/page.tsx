"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import {
  LegalCase, CaseStatus, STATUS_LABELS, STATUS_COLORS,
} from "@/lib/case-store";
import { FolderOpen, Plus, Trash2, Calendar, User, FileText, ChevronRight, Scale } from "lucide-react";

const STATUS_OPTIONS: { value: CaseStatus; label: string }[] = [
  { value: "in-progress", label: "In Progress" },
  { value: "adjourned",   label: "Adjourned" },
  { value: "disposed",    label: "Disposed" },
];

export default function CasesPage() {
  const [cases, setCases]           = useState<LegalCase[]>([]);
  const [upcoming, setUpcoming]     = useState<LegalCase[]>([]);
  const [showForm, setShowForm]     = useState(false);
  const [filterStatus, setFilter]   = useState<CaseStatus | "all">("all");

  // New case form state
  const [name, setName]             = useState("");
  const [status, setStatus]         = useState<CaseStatus>("in-progress");
  const [courtName, setCourtName]   = useState("");
  const [hearingDate, setHearing]   = useState("");
  const [clientName, setClientName] = useState("");
  const [clientCnic, setClientCnic] = useState("");
  const [clientPhone, setClientPhone] = useState("");

  const load = async () => {
    try {
      const res = await fetch("/api/cases");
      if (res.ok) {
        const data = await res.json();
        // Convert Prisma format to display format
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const converted = data.cases.map((c: any) => ({
          id: c.id,
          name: c.name,
          status: c.status as CaseStatus,
          courtName: c.courtName || "",
          nextHearingDate: c.nextHearingDate ? new Date(c.nextHearingDate).toISOString().split("T")[0] : undefined,
          clientName: c.clientName || "",
          clientCnic: c.clientCnic || "",
          clientPhone: c.clientPhone || "",
          documentIds: [],
          createdAt: new Date(c.createdAt).getTime(),
          updatedAt: new Date(c.updatedAt).getTime(),
        }));
        setCases(converted);
        // upcoming hearings
        const now = new Date();
        const limit = new Date(); limit.setDate(limit.getDate() + 30);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setUpcoming(converted.filter((c: any) => {
          if (!c.nextHearingDate || c.status === "disposed") return false;
          const d = new Date(c.nextHearingDate);
          return d >= now && d <= limit;
        }));
      }
    } catch { /* silently fail */ }
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    if (!name.trim()) return;
    await fetch("/api/cases", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim(),
        status,
        courtName,
        nextHearingDate: hearingDate || undefined,
        clientName: clientName || undefined,
        clientCnic: clientCnic || undefined,
        clientPhone: clientPhone || undefined,
      }),
    });
    setName(""); setStatus("in-progress"); setCourtName(""); setHearing(""); setClientName(""); setClientCnic(""); setClientPhone("");
    setShowForm(false);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this case? Documents will not be deleted.")) return;
    await fetch(`/api/cases/${id}`, { method: "DELETE" });
    load();
  };

  const filtered = filterStatus === "all" ? cases : cases.filter((c) => c.status === filterStatus);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" });
  };

  const daysUntil = (iso: string) => {
    const diff = new Date(iso).getTime() - Date.now();
    const days = Math.ceil(diff / 86400000);
    if (days === 0) return "Today";
    if (days === 1) return "Tomorrow";
    return `In ${days} days`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Scale className="h-6 w-6 text-primary-500" /> Case Management
          </h1>
          <p className="text-[var(--text-secondary)] text-sm mt-1">Organize your cases, documents and hearing dates</p>
        </div>
        <Button onClick={() => setShowForm(true)} size="sm">
          <Plus className="h-4 w-4" /> New Case
        </Button>
      </div>

      {/* Upcoming Hearings */}
      {upcoming.length > 0 && (
        <Card className="p-4">
          <p className="text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-wider mb-3 flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 text-primary-500" /> Upcoming Hearings (Next 30 Days)
          </p>
          <div className="space-y-2">
            {upcoming.map((c) => (
              <Link key={c.id} href={`/cases/${c.id}`} className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-primary-900/20 border border-primary-700/30 hover:bg-primary-900/30 transition-colors">
                <div>
                  <p className="text-sm font-semibold text-[var(--text-tertiary)]">{c.name}</p>
                  {c.courtName && <p className="text-xs text-[var(--text-tertiary)]">{c.courtName}</p>}
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  <p className="text-sm font-bold text-primary-400">{daysUntil(c.nextHearingDate!)}</p>
                  <p className="text-xs text-[var(--text-tertiary)]">{formatDate(c.nextHearingDate!)}</p>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      )}

      {/* New Case Form */}
      {showForm && (
        <Card className="p-5 space-y-4">
          <p className="text-sm font-bold text-[var(--text-secondary)]">New Case</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="md:col-span-2">
              <label className="text-xs text-[var(--text-tertiary)] mb-1 block">Case Name *</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Ahmed vs State — Bail Application Section 302"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface-2)] text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="text-xs text-[var(--text-tertiary)] mb-1 block">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value as CaseStatus)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface-2)] text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-[var(--text-tertiary)] mb-1 block">Court Name</label>
              <input value={courtName} onChange={(e) => setCourtName(e.target.value)} placeholder="e.g. Sessions Court Lahore"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface-2)] text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="text-xs text-[var(--text-tertiary)] mb-1 block">Next Hearing Date</label>
              <input type="date" value={hearingDate} onChange={(e) => setHearing(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface-2)] text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="text-xs text-[var(--text-tertiary)] mb-1 block">Client Name (optional)</label>
              <input value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="Muhammad Ahmed"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface-2)] text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="text-xs text-[var(--text-tertiary)] mb-1 block">Client CNIC (optional)</label>
              <input value={clientCnic} onChange={(e) => setClientCnic(e.target.value)} placeholder="35202-XXXXXXX-X"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface-2)] text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="text-xs text-[var(--text-tertiary)] mb-1 block">Client Phone (optional)</label>
              <input value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} placeholder="03XX-XXXXXXX"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface-2)] text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
          </div>
          <div className="flex gap-3 pt-1">
            <Button onClick={handleCreate} disabled={!name.trim()}>Create Case</Button>
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </Card>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {(["all", "in-progress", "adjourned", "disposed"] as const).map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filterStatus === s ? "bg-primary-600 text-white" : "bg-[var(--bg-surface-2)] text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] border border-[var(--border-default)]"
            }`}>
            {s === "all" ? "All Cases" : STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      {/* Cases List */}
      {filtered.length === 0 ? (
        <Card className="p-12 text-center">
          <FolderOpen className="h-10 w-10 text-[var(--text-secondary)] mx-auto mb-3" />
          <p className="text-[var(--text-tertiary)] font-medium">No cases yet</p>
          <p className="text-[var(--text-tertiary)] text-sm mt-1">Click "New Case" to create your first case folder</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((c) => (
            <Card key={c.id} className="p-4 hover:border-[var(--border-default)] transition-colors">
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-primary-900/20 flex-shrink-0">
                  <Scale className="h-5 w-5 text-primary-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <Link href={`/cases/${c.id}`} className="text-sm font-bold text-[var(--text-tertiary)] hover:text-primary-400 transition-colors line-clamp-1">
                      {c.name}
                    </Link>
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border flex-shrink-0 ${STATUS_COLORS[c.status]}`}>
                      {STATUS_LABELS[c.status]}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5">
                    {c.courtName && (
                      <span className="text-xs text-[var(--text-tertiary)] flex items-center gap-1">
                        <Scale className="h-3 w-3" /> {c.courtName}
                      </span>
                    )}
                    {c.clientName && (
                      <span className="text-xs text-[var(--text-tertiary)] flex items-center gap-1">
                        <User className="h-3 w-3" /> {c.clientName}
                      </span>
                    )}
                    <span className="text-xs text-[var(--text-tertiary)] flex items-center gap-1">
                      <FileText className="h-3 w-3" /> {c.documentIds.length} document{c.documentIds.length !== 1 ? "s" : ""}
                    </span>
                    {c.nextHearingDate && (
                      <span className="text-xs text-primary-400 flex items-center gap-1 font-medium">
                        <Calendar className="h-3 w-3" /> Next: {formatDate(c.nextHearingDate)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link href={`/cases/${c.id}`} className="p-1.5 rounded-lg text-[var(--text-tertiary)] hover:text-primary-400 transition-colors">
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                  <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-red-400 transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
