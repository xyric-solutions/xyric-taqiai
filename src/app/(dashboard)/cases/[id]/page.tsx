"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import DocumentPreview from "@/components/documents/DocumentPreview";
import {
  getCase, updateCase, removeDocumentFromCase,
  LegalCase, CaseStatus, STATUS_LABELS, STATUS_COLORS,
} from "@/lib/case-store";
import { getAllDocuments, updateDocumentContent } from "@/lib/document-store";
import { SavedDocument } from "@/lib/document-store";
import { ArrowLeft, Calendar, User, Scale, Edit2, Check, X, FileText, Trash2, Eye } from "lucide-react";

const STATUS_OPTIONS: { value: CaseStatus; label: string }[] = [
  { value: "in-progress", label: "In Progress" },
  { value: "adjourned",   label: "Adjourned" },
  { value: "disposed",    label: "Disposed" },
];

export default function CaseDetailPage() {
  const params   = useParams();
  const router   = useRouter();
  const id       = params.id as string;

  const [legalCase, setLegalCase]   = useState<LegalCase | null>(null);
  const [docs, setDocs]             = useState<SavedDocument[]>([]);
  const [editing, setEditing]       = useState(false);
  const [previewDoc, setPreviewDoc] = useState<SavedDocument | null>(null);

  // Edit fields
  const [name, setName]             = useState("");
  const [status, setStatus]         = useState<CaseStatus>("in-progress");
  const [courtName, setCourtName]   = useState("");
  const [hearingDate, setHearing]   = useState("");
  const [clientName, setClientName] = useState("");
  const [clientCnic, setClientCnic] = useState("");
  const [clientPhone, setClientPhone] = useState("");

  const load = () => {
    const c = getCase(id);
    if (!c) { router.push("/cases"); return; }
    setLegalCase(c);
    setName(c.name);
    setStatus(c.status);
    setCourtName(c.courtName || "");
    setHearing(c.nextHearingDate || "");
    setClientName(c.clientName || "");
    setClientCnic(c.clientCnic || "");
    setClientPhone(c.clientPhone || "");

    getAllDocuments().then((allDocs) => {
      setDocs(allDocs.filter((d) => c.documentIds.includes(d.id)));
    });
  };

  useEffect(() => { load(); }, [id]);

  const handleSave = () => {
    updateCase(id, { name, status, courtName: courtName || undefined, nextHearingDate: hearingDate || undefined, clientName: clientName || undefined, clientCnic: clientCnic || undefined, clientPhone: clientPhone || undefined });
    setEditing(false);
    load();
  };

  const handleRemoveDoc = (docId: string) => {
    removeDocumentFromCase(id, docId);
    load();
  };

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString("en-PK", { day: "numeric", month: "long", year: "numeric" });

  if (!legalCase) return null;

  if (previewDoc) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => setPreviewDoc(null)}>
            <ArrowLeft className="h-4 w-4" /> Back to Case
          </Button>
          <span className="text-[var(--text-tertiary)] text-sm">{previewDoc.title}</span>
        </div>
        <DocumentPreview content={previewDoc.content} title={previewDoc.title} language={previewDoc.language}
          onContentChange={(c) => { void updateDocumentContent(previewDoc.id, c); }} />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Back */}
      <div className="flex items-center gap-3">
        <Link href="/cases" className="text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <span className="text-[var(--text-tertiary)] text-sm">Cases</span>
        <span className="text-[var(--text-secondary)]">/</span>
        <span className="text-[var(--text-secondary)] text-sm font-medium truncate">{legalCase.name}</span>
      </div>

      {/* Case Info Card */}
      <Card className="p-5 space-y-4">
        <div className="flex items-start justify-between gap-4">
          {editing ? (
            <input value={name} onChange={(e) => setName(e.target.value)}
              className="flex-1 px-3.5 py-2 rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface-2)] text-base font-bold text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-primary-500" />
          ) : (
            <h1 className="text-lg font-bold text-[var(--text-tertiary)] flex-1">{legalCase.name}</h1>
          )}
          <div className="flex items-center gap-2 flex-shrink-0">
            {editing ? (
              <>
                <button onClick={handleSave} className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors"><Check className="h-4 w-4" /></button>
                <button onClick={() => { setEditing(false); load(); }} className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"><X className="h-4 w-4" /></button>
              </>
            ) : (
              <button onClick={() => setEditing(true)} className="p-1.5 rounded-lg text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors"><Edit2 className="h-4 w-4" /></button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Status */}
          <div className="space-y-1">
            <label className="text-xs text-[var(--text-tertiary)]">Status</label>
            {editing ? (
              <select value={status} onChange={(e) => setStatus(e.target.value as CaseStatus)}
                className="w-full px-3 py-2 rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface-2)] text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            ) : (
              <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border ${STATUS_COLORS[legalCase.status]}`}>
                {STATUS_LABELS[legalCase.status]}
              </span>
            )}
          </div>

          {/* Court */}
          <div className="space-y-1">
            <label className="text-xs text-[var(--text-tertiary)] flex items-center gap-1"><Scale className="h-3 w-3" /> Court</label>
            {editing ? (
              <input value={courtName} onChange={(e) => setCourtName(e.target.value)} placeholder="e.g. Sessions Court Lahore"
                className="w-full px-3 py-2 rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface-2)] text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            ) : (
              <p className="text-sm text-[var(--text-secondary)]">{legalCase.courtName || <span className="text-[var(--text-secondary)]">—</span>}</p>
            )}
          </div>

          {/* Hearing Date */}
          <div className="space-y-1">
            <label className="text-xs text-[var(--text-tertiary)] flex items-center gap-1"><Calendar className="h-3 w-3" /> Next Hearing Date</label>
            {editing ? (
              <input type="date" value={hearingDate} onChange={(e) => setHearing(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface-2)] text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            ) : (
              <p className={`text-sm font-medium ${legalCase.nextHearingDate ? "text-primary-400" : "text-[var(--text-secondary)]"}`}>
                {legalCase.nextHearingDate ? formatDate(legalCase.nextHearingDate) : "—"}
              </p>
            )}
          </div>

          {/* Client Name */}
          <div className="space-y-1">
            <label className="text-xs text-[var(--text-tertiary)] flex items-center gap-1"><User className="h-3 w-3" /> Client Name</label>
            {editing ? (
              <input value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="Optional"
                className="w-full px-3 py-2 rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface-2)] text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            ) : (
              <p className="text-sm text-[var(--text-secondary)]">{legalCase.clientName || <span className="text-[var(--text-secondary)]">—</span>}</p>
            )}
          </div>

          {editing && (
            <>
              <div className="space-y-1">
                <label className="text-xs text-[var(--text-tertiary)]">Client CNIC</label>
                <input value={clientCnic} onChange={(e) => setClientCnic(e.target.value)} placeholder="Optional"
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface-2)] text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-[var(--text-tertiary)]">Client Phone</label>
                <input value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} placeholder="Optional"
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface-2)] text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
            </>
          )}

          {!editing && (legalCase.clientCnic || legalCase.clientPhone) && (
            <>
              {legalCase.clientCnic && (
                <div className="space-y-1">
                  <label className="text-xs text-[var(--text-tertiary)]">Client CNIC</label>
                  <p className="text-sm text-[var(--text-secondary)] font-mono">{legalCase.clientCnic}</p>
                </div>
              )}
              {legalCase.clientPhone && (
                <div className="space-y-1">
                  <label className="text-xs text-[var(--text-tertiary)]">Client Phone</label>
                  <p className="text-sm text-[var(--text-secondary)]">{legalCase.clientPhone}</p>
                </div>
              )}
            </>
          )}
        </div>
      </Card>

      {/* Documents */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[var(--text-tertiary)] uppercase tracking-wider flex items-center gap-2">
            <FileText className="h-4 w-4" /> Documents ({docs.length})
          </h2>
          <Link href="/documents" className="text-xs text-primary-400 hover:text-primary-300 transition-colors">
            + Add from Documents
          </Link>
        </div>

        {docs.length === 0 ? (
          <Card className="p-8 text-center">
            <FileText className="h-8 w-8 text-[var(--text-secondary)] mx-auto mb-2" />
            <p className="text-[var(--text-tertiary)] text-sm">No documents in this case yet</p>
            <p className="text-[var(--text-secondary)] text-xs mt-1">Go to Documents and link them to this case</p>
          </Card>
        ) : (
          <div className="space-y-2">
            {docs.map((doc) => (
              <Card key={doc.id} className="p-3.5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[var(--bg-surface-2)] flex-shrink-0">
                    <FileText className="h-4 w-4 text-[var(--text-tertiary)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[var(--text-tertiary)] truncate">{doc.title}</p>
                    <p className="text-xs text-[var(--text-tertiary)]">{doc.category} • {new Date(doc.updatedAt).toLocaleDateString("en-PK")}</p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button onClick={() => setPreviewDoc(doc)} className="p-1.5 rounded-lg text-[var(--text-tertiary)] hover:text-primary-400 transition-colors" title="View document">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleRemoveDoc(doc.id)} className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-red-400 transition-colors" title="Remove from case">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
