"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { FolderOpen, FileText, Trash2, Eye, Search } from "lucide-react";
import { getAllDocuments, deleteDocument, migrateLocalStorageDocs, SavedDocument } from "@/lib/document-store";

export default function DocumentsPage() {
  const [docs, setDocs] = useState<SavedDocument[]>([]);
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      await migrateLocalStorageDocs();
      const list = await getAllDocuments();
      setDocs(list);
      setLoading(false);
    })();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this document? / یہ دستاویز حذف کریں؟")) return;
    await deleteDocument(id);
    const list = await getAllDocuments();
    setDocs(list);
  };

  const categories = Array.from(new Set(docs.map((d) => d.category)));

  const filtered = docs.filter((d) => {
    const matchesCategory = categoryFilter === "all" || d.category === categoryFilter;
    const matchesQuery =
      !query ||
      d.title.toLowerCase().includes(query.toLowerCase()) ||
      d.subType.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleDateString() + " " + d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">My Documents / میری دستاویزات</h1>
        <p className="text-slate-500 mt-1">All your generated legal documents</p>
      </div>

      {loading ? (
        <Card className="p-12">
          <div className="text-center text-slate-400">
            <FolderOpen className="h-12 w-12 mx-auto mb-3 opacity-30 animate-pulse" />
            <p className="text-sm">Loading documents...</p>
          </div>
        </Card>
      ) : docs.length === 0 ? (
        <Card className="p-12">
          <div className="text-center text-slate-400">
            <FolderOpen className="h-16 w-16 mx-auto mb-4 opacity-30" />
            <h3 className="text-lg font-medium">No documents yet</h3>
            <p className="text-sm mt-2">Documents you generate will appear here</p>
            <p className="text-sm mt-1" dir="rtl">آپ کی بنائی گئی دستاویزات یہاں نظر آئیں گی</p>
          </div>
        </Card>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search documents..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30"
            >
              <option value="all">All categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((doc) => (
              <Card key={doc.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center flex-shrink-0">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-slate-800 truncate">{doc.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5 capitalize">
                      {doc.category} · {doc.subType}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">{formatDate(doc.updatedAt)}</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Link href={`/documents/${doc.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <Eye className="h-3.5 w-3.5" /> Open
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(doc.id)}
                    className="text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {filtered.length === 0 && (
            <Card className="p-8 text-center text-slate-400">
              <p className="text-sm">No documents match your search</p>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
