"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Menu, Search, X, Sun, Moon, Bell, ChevronDown,
  Home, Bot, PenLine, Briefcase, Folder, Settings,
  Languages, Calculator, BookMarked, FilePlus, Users, ShieldAlert,
  Scale, BookOpen, Library, Building2, Globe, Landmark,
  Gavel, Calendar, Handshake,
  HeartHandshake, FileText, ScanLine, Mic,
} from "lucide-react";
import { toggleSidebarCollapsed } from "@/lib/sidebar-store";
import { DOCUMENT_SUGGESTIONS } from "@/lib/document-suggestions";

// Map each document category to its drafting page + display title
const CAT_META: Record<string, { route: string; title: string }> = {
  "affidavit":          { route: "/affidavits",         title: "Affidavits" },
  "agreement":          { route: "/agreements",         title: "Agreements" },
  "application":        { route: "/applications",       title: "Applications" },
  "family-law":         { route: "/family-law",         title: "Family Law" },
  "criminal-law":       { route: "/criminal-law",       title: "Criminal Law" },
  "property-law":       { route: "/property-law",       title: "Property Law" },
  "civil-law":          { route: "/civil-law",          title: "Civil Law" },
  "corporate-law":      { route: "/corporate-law",      title: "Corporate Law" },
  "tax-law":            { route: "/tax-law",            title: "Tax Law" },
  "immigration-law":    { route: "/immigration-law",    title: "Immigration" },
  "constitutional-law": { route: "/constitutional-law", title: "Constitutional Law" },
  "non-muslim-laws":    { route: "/non-muslim-laws",    title: "Non-Muslim Laws" },
  "power-of-attorney":  { route: "/power-of-attorney",  title: "Power of Attorney" },
};

const PAGE_TITLES: Record<string, string> = {
  "/dashboard":                        "Dashboard",
  "/ai-advisor":                       "AI Advisor",
  "/cases":                            "Case Management",
  "/chamber":                          "Case Management",
  "/case-law":                         "Case Law",
  "/statute-search":                   "Statute Search",
  "/affidavits":                       "Affidavits",
  "/agreements":                       "Agreements",
  "/applications":                     "Applications",
  "/family-law":                       "Family Law",
  "/criminal-law":                     "Criminal Law",
  "/property-law":                     "Property Law",
  "/civil-law":                        "Civil Law",
  "/corporate-law":                    "Corporate Law",
  "/tax-law":                          "Tax Law",
  "/immigration-law":                  "Immigration",
  "/constitutional-law":               "Constitutional Law",
  "/non-muslim-laws":                  "Non-Muslim Laws",
  "/power-of-attorney":                "Power of Attorney",
  "/voice-case":                       "Voice Case",
  "/copy-from-photo":                  "Copy from Photo",
  "/documents":                        "My Documents",
  "/translate":                        "Translate",
  "/settings":                         "Settings",
  "/lawyer-diary":                     "Lawyer Diary",
  "/property-transfer/tax-calculator": "Tax Calculator",
};

const SEARCH_ITEMS = [
  { label: "Dashboard",      href: "/dashboard",    category: "Main",       icon: Home,           keywords: ["home","dashboard"] },
  { label: "AI Advisor",     href: "/ai-advisor",   category: "Main",       icon: Bot,            keywords: ["ai","advisor","question","ask","mushwara","salah"] },
  { label: "Case Law",       href: "/case-law",     category: "Research",   icon: BookOpen,       keywords: ["case law","judgment","court","scmr","pld","faisla"] },
  { label: "Statute Search", href: "/statute-search", category: "Research", icon: Library,        keywords: ["statute","law","act","ordinance","qanoon","dhara"] },
  { label: "Voice Case",     href: "/voice-case",   category: "Draft",      icon: Mic,            keywords: ["voice","case","discussion","record","audio","client","mic","awaz","guftagu","talk","meeting"] },
  { label: "Copy from Photo",href: "/copy-from-photo",category: "Draft",     icon: ScanLine,       keywords: ["copy","photo","image","picture","scan","ocr","type from image","tasveer","naqal","same to same"] },
  { label: "Affidavits",     href: "/affidavits",   category: "Draft",      icon: PenLine,        keywords: ["affidavit","halaf nama","sworn"] },
  { label: "Agreements",     href: "/agreements",   category: "Draft",      icon: Handshake,      keywords: ["agreement","contract","muaahida"] },
  { label: "Applications",   href: "/applications", category: "Draft",      icon: FilePlus,       keywords: ["application","darkhast","arzi"] },
  { label: "Family Law",     href: "/family-law",   category: "Draft",      icon: HeartHandshake, keywords: ["family","divorce","talaq","khula","nikah","shadi"] },
  { label: "Criminal Law",   href: "/criminal-law", category: "Draft",      icon: ShieldAlert,    keywords: ["criminal","fir","bail","murder","jurm","qatl"] },
  { label: "Property Law",   href: "/property-law", category: "Draft",      icon: Building2,      keywords: ["property","land","zameen","deed","registry"] },
  { label: "Civil Law",      href: "/civil-law",    category: "Draft",      icon: Scale,          keywords: ["civil","suit","plaint","dawa"] },
  { label: "Corporate Law",  href: "/corporate-law",category: "Draft",      icon: Briefcase,      keywords: ["corporate","company","business","kumpni"] },
  { label: "Tax Law",        href: "/tax-law",      category: "Draft",      icon: Calculator,     keywords: ["tax","income tax","fbr","sales tax"] },
  { label: "Immigration",    href: "/immigration-law",category: "Draft",    icon: Globe,          keywords: ["immigration","visa","passport","overseas"] },
  { label: "Constitutional", href: "/constitutional-law",category: "Draft", icon: Landmark,       keywords: ["constitutional","writ","article","آئین"] },
  { label: "Non-Muslim Laws",href: "/non-muslim-laws",category: "Draft",    icon: Users,          keywords: ["non muslim","christian","hindu","minority"] },
  { label: "My Documents",   href: "/documents",    category: "Management", icon: Folder,         keywords: ["documents","files","saved","meri file"] },
  { label: "Case Management", href: "/chamber",     category: "Management", icon: Gavel,          keywords: ["court","case","hearing","tarikh","case management","mukadma","cases","chamber","matter","deadline","calendar"] },
  { label: "Lawyer Diary",   href: "/lawyer-diary", category: "Management", icon: Calendar,       keywords: ["diary","notes","reminder"] },
  { label: "Translate",      href: "/translate",    category: "Tools",      icon: Languages,      keywords: ["translate","urdu","english","tarjuma"] },
  { label: "Tax Calculator", href: "/property-transfer/tax-calculator",category:"Tools",icon: Calculator,keywords: ["tax calculator","stamp duty","property transfer"] },
  { label: "Settings",       href: "/settings",     category: "Settings",   icon: Settings,       keywords: ["settings","profile","account","password"] },
];

type SearchResult = {
  label: string;
  href: string;
  category: string;
  icon: typeof Home;
};

function useGlobalSearch(query: string): SearchResult[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase();

  // 1) Pages / navigation
  const pages: SearchResult[] = SEARCH_ITEMS.filter(
    (item) =>
      item.label.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.keywords.some((k) => k.includes(q))
  ).map(({ label, href, category, icon }) => ({ label, href, category, icon }));

  // 2) Documents / cases — only for queries of 2+ chars, navigates to the
  //    category page with the document pre-filled in the draft box.
  const docs: SearchResult[] = [];
  if (q.length >= 2) {
    const seen = new Set<string>();
    for (const doc of DOCUMENT_SUGGESTIONS) {
      const meta = CAT_META[doc.cat];
      if (!meta || seen.has(doc.label)) continue;
      const matches =
        doc.label.toLowerCase().includes(q) ||
        doc.kw.some((k) => k.startsWith(q) || k.includes(q)) ||
        doc.label.toLowerCase().split(/[\s\-()/,]+/).some((w) => w.length > 1 && w.startsWith(q));
      if (!matches) continue;
      seen.add(doc.label);
      docs.push({
        label: doc.label,
        href: `${meta.route}?draft=${encodeURIComponent(doc.label)}`,
        category: meta.title,
        icon: FileText,
      });
    }
  }

  return [...pages.slice(0, 6), ...docs.slice(0, 8)];
}

interface TopbarProps {
  onMenuClick: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const router   = useRouter();
  const pathname = usePathname();
  const [query,      setQuery]      = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [open,       setOpen]       = useState(false);
  const [activeIdx,  setActiveIdx]  = useState(0);
  const [theme,      setTheme]      = useState<"dark"|"light">("dark");
  const inputRef    = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = document.documentElement.getAttribute("data-theme") as "dark"|"light" | null;
    if (t) setTheme(t);
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("taqiai-theme", next);
  };

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(query), 180);
    return () => clearTimeout(t);
  }, [query]);

  const results = useGlobalSearch(debouncedQ);

  const pageTitle = Object.entries(PAGE_TITLES).find(
    ([key]) => pathname === key || pathname.startsWith(key + "/")
  )?.[1] ?? "TaqiAI";

  const selectItem = useCallback((href: string) => {
    router.push(href);
    setQuery("");
    setOpen(false);
    inputRef.current?.blur();
  }, [router]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open || results.length === 0) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setActiveIdx((i) => (i + 1) % results.length); }
    else if (e.key === "ArrowUp")  { e.preventDefault(); setActiveIdx((i) => (i - 1 + results.length) % results.length); }
    else if (e.key === "Enter")    { e.preventDefault(); if (results[activeIdx]) selectItem(results[activeIdx].href); }
    else if (e.key === "Escape")   { setQuery(""); setOpen(false); inputRef.current?.blur(); }
  };

  useEffect(() => { setActiveIdx(0); }, [query]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current  && !inputRef.current.contains(e.target as Node)
      ) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const grouped = results.reduce<Record<string, typeof results>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  let globalIdx = 0;

  return (
    <header
      className="h-14 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-40 flex-shrink-0 gap-3"
      style={{
        background:   "var(--bg-base)",
        borderBottom: "1px solid var(--border-subtle)",
      }}
    >
      {/* Left: hamburger + page title */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {/* Mobile: open drawer */}
        <button
          onClick={onMenuClick}
          aria-label="Open sidebar"
          className="lg:hidden p-2 rounded-md transition-colors"
          style={{ color: "var(--text-tertiary)" }}
          onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-surface-3)")}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
        >
          <Menu className="h-4 w-4" strokeWidth={1.5} />
        </button>
        {/* Desktop: collapse / expand sidebar to icon rail */}
        <button
          onClick={() => toggleSidebarCollapsed()}
          aria-label="Collapse sidebar"
          title="Collapse / expand sidebar"
          className="hidden lg:block p-2 rounded-md transition-colors"
          style={{ color: "var(--text-tertiary)" }}
          onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-surface-3)")}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
        >
          <Menu className="h-4 w-4" strokeWidth={1.5} />
        </button>
        <span className="hidden lg:block text-[14px] font-semibold"
              style={{ color: "var(--text-primary)" }}>
          {pageTitle}
        </span>
      </div>

      {/* Center: Global Search */}
      <div className="flex-1 max-w-[480px] relative">
        <div
          className="flex items-center gap-2 px-3 h-[34px] rounded-md border transition-all"
          style={{
            background:  "var(--bg-surface-2)",
            borderColor: open ? "#06b6d4" : "var(--border-subtle)",
            boxShadow:   open ? "var(--glow-cyan-sm)" : "none",
          }}
        >
          <Search className="h-3.5 w-3.5 flex-shrink-0" strokeWidth={1.5}
                  style={{ color: "var(--text-tertiary)" }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search client, FIR, citation, document..."
            role="combobox"
            aria-expanded={open}
            aria-haspopup="listbox"
            aria-autocomplete="list"
            className="flex-1 bg-transparent text-[13px] outline-none min-w-0"
            style={{ color: "var(--text-primary)" }}
          />
          {query ? (
            <button
              type="button"
              onClick={() => { setQuery(""); setOpen(false); inputRef.current?.focus(); }}
              className="flex-shrink-0 transition-colors"
              style={{ color: "var(--text-tertiary)" }}
            >
              <X className="h-3.5 w-3.5" strokeWidth={1.5} />
            </button>
          ) : (
            <span
              className="hidden sm:flex items-center gap-0.5 text-[10px] font-medium flex-shrink-0 px-1 py-0.5 rounded"
              style={{ color: "var(--text-tertiary)", background: "var(--bg-surface-3)", border: "1px solid var(--border-subtle)" }}
            >
              Ctrl K
            </span>
          )}
        </div>

        {open && query.trim().length > 0 && (
          <div
            ref={dropdownRef}
            role="listbox"
            className="absolute top-full left-0 right-0 mt-1.5 rounded-lg overflow-hidden z-50"
            style={{
              background:  "var(--bg-surface-2)",
              border:      "1px solid var(--border-default)",
              boxShadow:   "var(--shadow-dropdown)",
            }}
          >
            {results.length === 0 ? (
              <div className="px-4 py-5 text-center text-[12px]"
                   style={{ color: "var(--text-tertiary)" }}>
                No results for &quot;{query}&quot;
              </div>
            ) : (
              <div className="py-1.5 max-h-80 overflow-y-auto">
                {Object.entries(grouped).map(([category, items]) => (
                  <div key={category}>
                    <p className="px-3 pt-2.5 pb-1 text-[10px] font-bold uppercase tracking-[0.12em]"
                       style={{ color: "var(--text-tertiary)" }}>
                      {category}
                    </p>
                    {items.map((item) => {
                      const idx = globalIdx++;
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.href}
                          type="button"
                          onMouseEnter={() => setActiveIdx(idx)}
                          onClick={() => selectItem(item.href)}
                          className="w-full flex items-center gap-3 px-3 py-2 text-left transition-colors"
                          style={{
                            background: activeIdx === idx ? "var(--bg-surface-3)" : "transparent",
                            color:      activeIdx === idx ? "var(--text-primary)"  : "var(--text-secondary)",
                          }}
                        >
                          <Icon className="h-3.5 w-3.5 flex-shrink-0" strokeWidth={1.5}
                                style={{ color: activeIdx === idx ? "#06b6d4" : "var(--text-tertiary)" }} />
                          <span className="text-[13px] font-medium">{item.label}</span>
                          <span className="ml-auto text-[10px]"
                                style={{ color: "var(--text-tertiary)" }}>{item.category}</span>
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right: notifications + theme + user */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <button
          aria-label="Notifications"
          className="relative p-2 rounded-md transition-colors"
          style={{ color: "var(--text-secondary)" }}
          onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-surface-3)")}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
        >
          <Bell className="h-4 w-4" strokeWidth={1.5} />
          <span
            className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full text-[8px] font-bold flex items-center justify-center"
            style={{ background: "#06b6d4", color: "#07090f" }}
          >
            3
          </span>
        </button>

        <button
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          className="p-2 rounded-md transition-colors"
          style={{ color: "var(--text-secondary)" }}
          onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-surface-3)")}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
        >
          {theme === "dark"
            ? <Sun  className="h-4 w-4" strokeWidth={1.5} />
            : <Moon className="h-4 w-4" strokeWidth={1.5} />
          }
        </button>

        <div className="w-px h-5 mx-1" style={{ background: "var(--border-subtle)" }} />

        <Link
          href="/settings"
          aria-label="Account"
          className="flex items-center gap-2.5 pl-1 pr-2 py-1 rounded-lg transition-colors"
          onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-surface-3)")}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #06b6d4 0%, #0e7490 100%)" }}
          >
            <span className="text-white text-[12px] font-bold">A</span>
          </div>
          <div className="hidden sm:block leading-tight">
            <p className="text-[12px] font-semibold" style={{ color: "var(--text-primary)" }}>Advocate</p>
            <p className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>Free Plan</p>
          </div>
          <ChevronDown className="hidden sm:block h-4 w-4 flex-shrink-0" strokeWidth={1.5} style={{ color: "var(--text-tertiary)" }} />
        </Link>
      </div>
    </header>
  );
}
