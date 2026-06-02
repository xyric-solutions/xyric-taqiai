export interface SavedDocument {
  id: string;
  title: string;
  category: string;
  subType: string;
  language: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

const STORAGE_KEY = "ai-legal-docs";
const MIGRATION_FLAG = "ai-legal-docs-migrated";

interface ApiDocument {
  id: string;
  title: string;
  category: string;
  subType: string;
  language: string;
  generatedContent: string;
  createdAt: string;
  updatedAt: string;
}

function fromApi(d: ApiDocument): SavedDocument {
  return {
    id: d.id,
    title: d.title,
    category: d.category,
    subType: d.subType,
    language: d.language,
    content: d.generatedContent,
    createdAt: new Date(d.createdAt).getTime(),
    updatedAt: new Date(d.updatedAt).getTime(),
  };
}

function localGetAll(): SavedDocument[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as SavedDocument[];
  } catch { return []; }
}

function localSave(doc: SavedDocument) {
  const docs = localGetAll().filter(d => d.id !== doc.id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify([doc, ...docs]));
}

function localDelete(id: string) {
  const docs = localGetAll().filter(d => d.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
}

export async function getAllDocuments(): Promise<SavedDocument[]> {
  if (typeof window === "undefined") return [];
  try {
    const res = await fetch("/api/documents", { credentials: "include" });
    if (!res.ok) {
      // Not logged in — return localStorage docs
      return localGetAll();
    }
    const dbDocs = (await res.json() as { documents: ApiDocument[] }).documents.map(fromApi);
    // Also include any local_ docs not yet migrated
    const localDocs = localGetAll().filter(d => d.id.startsWith("local_"));
    return [...dbDocs, ...localDocs];
  } catch {
    return localGetAll();
  }
}

export async function getDocument(id: string): Promise<SavedDocument | null> {
  if (typeof window === "undefined") return null;

  // Local docs: always check localStorage directly
  if (id.startsWith("local_")) {
    return localGetAll().find(d => d.id === id) ?? null;
  }

  try {
    const res = await fetch(`/api/documents/${id}`, { credentials: "include" });
    if (!res.ok) {
      // Fallback: check localStorage (e.g. offline or auth issue)
      return localGetAll().find(d => d.id === id) ?? null;
    }
    const data = (await res.json()) as { document: ApiDocument };
    return fromApi(data.document);
  } catch {
    return localGetAll().find(d => d.id === id) ?? null;
  }
}

export async function saveDocument(
  doc: Omit<SavedDocument, "id" | "createdAt" | "updatedAt"> & { id?: string }
): Promise<SavedDocument | null> {
  if (typeof window === "undefined") return null;

  if (doc.id) {
    try {
      const res = await fetch(`/api/documents/${doc.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ title: doc.title, content: doc.content, language: doc.language }),
      });
      if (res.ok) {
        const data = (await res.json()) as { document: ApiDocument };
        return fromApi(data.document);
      }
    } catch { /* fall through to local */ }
    // Fallback: update in localStorage
    const existing = localGetAll().find(d => d.id === doc.id);
    if (existing) {
      const updated = { ...existing, title: doc.title, content: doc.content, updatedAt: Date.now() };
      localSave(updated);
      return updated;
    }
    return null;
  }

  try {
    const res = await fetch("/api/documents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        title: doc.title,
        category: doc.category || "General",
        subType: doc.subType || "smart-draft",
        language: doc.language,
        content: doc.content,
      }),
    });
    if (res.ok) {
      const data = (await res.json()) as { document: ApiDocument };
      return fromApi(data.document);
    }
  } catch { /* fall through to local */ }

  // Fallback: save to localStorage (user not logged in)
  const now = Date.now();
  const localDoc: SavedDocument = {
    id: `local_${now}_${Math.random().toString(36).slice(2, 7)}`,
    title: doc.title,
    category: doc.category ?? "",
    subType: doc.subType ?? "",
    language: doc.language,
    content: doc.content,
    createdAt: now,
    updatedAt: now,
  };
  localSave(localDoc);
  return localDoc;
}

export async function deleteDocument(id: string): Promise<boolean> {
  if (typeof window === "undefined") return false;
  // Local doc
  if (id.startsWith("local_")) {
    localDelete(id);
    return true;
  }
  const res = await fetch(`/api/documents/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  return res.ok;
}

export async function updateDocumentContent(id: string, content: string): Promise<boolean> {
  if (typeof window === "undefined") return false;
  const res = await fetch(`/api/documents/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ content }),
  });
  return res.ok;
}

// One-time migration: copy existing localStorage docs to DB
export async function migrateLocalStorageDocs(): Promise<number> {
  if (typeof window === "undefined") return 0;
  if (localStorage.getItem(MIGRATION_FLAG)) return 0;

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(MIGRATION_FLAG, "1");
    return 0;
  }

  let docs: SavedDocument[];
  try {
    docs = JSON.parse(raw) as SavedDocument[];
  } catch {
    localStorage.setItem(MIGRATION_FLAG, "1");
    return 0;
  }

  let migrated = 0;
  for (const d of docs) {
    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: d.title,
          category: d.category,
          subType: d.subType,
          language: d.language,
          content: d.content,
        }),
      });
      if (res.ok) migrated++;
    } catch {
      // skip on failure; will retry next session
    }
  }

  if (migrated === docs.length) {
    localStorage.removeItem(STORAGE_KEY);
  }
  localStorage.setItem(MIGRATION_FLAG, "1");
  return migrated;
}
