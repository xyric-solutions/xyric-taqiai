export type CaseStatus = "in-progress" | "disposed" | "adjourned";

export interface LegalCase {
  id: string;
  name: string;
  status: CaseStatus;
  courtName?: string;
  nextHearingDate?: string; // ISO date string YYYY-MM-DD
  clientName?: string;
  clientCnic?: string;
  clientPhone?: string;
  documentIds: string[];
  createdAt: number;
  updatedAt: number;
}

const STORAGE_KEY = "ai-legal-cases";

function getAll(): LegalCase[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveAll(cases: LegalCase[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
}

export function getAllCases(): LegalCase[] {
  return getAll().sort((a, b) => b.updatedAt - a.updatedAt);
}

export function getCase(id: string): LegalCase | null {
  return getAll().find((c) => c.id === id) ?? null;
}

export function createCase(data: Omit<LegalCase, "id" | "createdAt" | "updatedAt" | "documentIds">): LegalCase {
  const cases = getAll();
  const newCase: LegalCase = {
    ...data,
    id: Date.now().toString(36) + Math.random().toString(36).slice(2),
    documentIds: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  saveAll([newCase, ...cases]);
  return newCase;
}

export function updateCase(id: string, updates: Partial<Omit<LegalCase, "id" | "createdAt">>): void {
  const cases = getAll().map((c) =>
    c.id === id ? { ...c, ...updates, updatedAt: Date.now() } : c
  );
  saveAll(cases);
}

export function deleteCase(id: string): void {
  saveAll(getAll().filter((c) => c.id !== id));
}

export function addDocumentToCase(caseId: string, docId: string): void {
  const cases = getAll().map((c) => {
    if (c.id !== caseId) return c;
    if (c.documentIds.includes(docId)) return c;
    return { ...c, documentIds: [...c.documentIds, docId], updatedAt: Date.now() };
  });
  saveAll(cases);
}

export function removeDocumentFromCase(caseId: string, docId: string): void {
  const cases = getAll().map((c) =>
    c.id === caseId ? { ...c, documentIds: c.documentIds.filter((d) => d !== docId), updatedAt: Date.now() } : c
  );
  saveAll(cases);
}

export function getUpcomingHearings(days = 30): LegalCase[] {
  const now = new Date();
  const limit = new Date();
  limit.setDate(limit.getDate() + days);
  return getAll()
    .filter((c) => {
      if (!c.nextHearingDate || c.status === "disposed") return false;
      const d = new Date(c.nextHearingDate);
      return d >= now && d <= limit;
    })
    .sort((a, b) => new Date(a.nextHearingDate!).getTime() - new Date(b.nextHearingDate!).getTime());
}

export const STATUS_LABELS: Record<CaseStatus, string> = {
  "in-progress": "In Progress",
  "disposed": "Disposed",
  "adjourned": "Adjourned",
};

export const STATUS_COLORS: Record<CaseStatus, string> = {
  "in-progress": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "disposed": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  "adjourned": "bg-amber-500/20 text-amber-400 border-amber-500/30",
};
