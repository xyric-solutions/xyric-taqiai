// Saved (bookmarked) judgments — persisted in localStorage, mirroring case-store.

export interface SavedJudgment {
  id: number;
  citation: string;
  reported: boolean;
  court: string;
  year: number;
  title: string | null;
  caseNo: string | null;
  savedAt: number;
}

const STORAGE_KEY = "ai-legal-saved-judgments";
const EVENT = "saved-judgments-changed";

function getAll(): SavedJudgment[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SavedJudgment[]) : [];
  } catch {
    return [];
  }
}

function saveAll(items: SavedJudgment[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(EVENT));
}

export function getSavedJudgments(): SavedJudgment[] {
  return getAll().sort((a, b) => b.savedAt - a.savedAt);
}

export function isJudgmentSaved(id: number): boolean {
  return getAll().some((j) => j.id === id);
}

/** Add if absent, remove if present. Returns the new saved state. */
export function toggleSavedJudgment(j: Omit<SavedJudgment, "savedAt">): boolean {
  const items = getAll();
  const idx = items.findIndex((x) => x.id === j.id);
  if (idx !== -1) {
    items.splice(idx, 1);
    saveAll(items);
    return false;
  }
  items.push({ ...j, savedAt: Date.now() });
  saveAll(items);
  return true;
}

export function removeSavedJudgment(id: number): void {
  saveAll(getAll().filter((j) => j.id !== id));
}

/** Subscribe to changes (across components / tabs). Returns an unsubscribe fn. */
export function onSavedJudgmentsChange(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = () => cb();
  window.addEventListener(EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

export const SAVED_JUDGMENTS_KEY = STORAGE_KEY;
