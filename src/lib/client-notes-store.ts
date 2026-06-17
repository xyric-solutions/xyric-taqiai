// Client notes — quick notes a lawyer records from a client.
// Persisted in localStorage, mirroring judgment-store.

export interface ClientNote {
  id: string;
  client: string;
  caseRef: string;
  note: string;
  createdAt: number;
}

const STORAGE_KEY = "ai-legal-client-notes";
const EVENT = "client-notes-changed";

function getAll(): ClientNote[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ClientNote[]) : [];
  } catch {
    return [];
  }
}

function saveAll(items: ClientNote[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(EVENT));
}

export function getClientNotes(): ClientNote[] {
  return getAll().sort((a, b) => b.createdAt - a.createdAt);
}

export function addClientNote(input: { client: string; caseRef?: string; note: string }): ClientNote {
  const items = getAll();
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${items.length}`;
  const entry: ClientNote = {
    id,
    client: input.client.trim(),
    caseRef: (input.caseRef ?? "").trim(),
    note: input.note.trim(),
    createdAt: Date.now(),
  };
  items.push(entry);
  saveAll(items);
  return entry;
}

export function removeClientNote(id: string): void {
  saveAll(getAll().filter((n) => n.id !== id));
}

/** Subscribe to changes (across components / tabs). Returns an unsubscribe fn. */
export function onClientNotesChange(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = () => cb();
  window.addEventListener(EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

export const CLIENT_NOTES_KEY = STORAGE_KEY;
