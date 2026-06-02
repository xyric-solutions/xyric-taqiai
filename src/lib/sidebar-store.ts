// Desktop sidebar collapsed/expanded state — persisted in localStorage and
// synced across the Topbar (toggle button) and Sidebar (rail rendering),
// mirroring the judgment-store pattern. Collapsed = icon-only rail.

import { useEffect, useState } from "react";

const STORAGE_KEY = "taqiai-sidebar-collapsed";
const EVENT = "sidebar-collapse-changed";

export function getSidebarCollapsed(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(STORAGE_KEY) === "1";
}

export function setSidebarCollapsed(value: boolean): void {
  localStorage.setItem(STORAGE_KEY, value ? "1" : "0");
  window.dispatchEvent(new Event(EVENT));
}

export function toggleSidebarCollapsed(): boolean {
  const next = !getSidebarCollapsed();
  setSidebarCollapsed(next);
  return next;
}

export function onSidebarCollapseChange(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = () => cb();
  window.addEventListener(EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

/** React hook — reads the collapsed state and re-renders on change. */
export function useSidebarCollapsed(): boolean {
  const [collapsed, setCollapsed] = useState(false);
  useEffect(() => {
    setCollapsed(getSidebarCollapsed());
    return onSidebarCollapseChange(() => setCollapsed(getSidebarCollapsed()));
  }, []);
  return collapsed;
}
