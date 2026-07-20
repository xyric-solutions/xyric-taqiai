"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Home, Bot, Library, PenLine, Handshake, FilePlus,
  HeartHandshake, ShieldAlert, Building2, Scale, Briefcase,
  Calculator, Globe, Landmark, Users, Folder, Gavel,
  Languages, Settings, FileSignature,
  ChevronDown, X, ScrollText, LogOut, ScanLine, Mic, Layers,
} from "lucide-react";
import { useSidebarCollapsed, setSidebarCollapsed } from "@/lib/sidebar-store";

const mainItems = [
  { name: "Dashboard",   href: "/dashboard",  icon: Home },
  { name: "AI Advisor",  href: "/ai-advisor", icon: Bot, badge: "AI" },
];

const researchItems = [
  { name: "Judgments",      href: "/case-law",       icon: ScrollText },
  { name: "Case Builder",   href: "/case-builder",   icon: Layers, badge: "AI" },
  { name: "Statute Search", href: "/statute-search", icon: Library    },
];

const draftItems = [
  { name: "Voice Case",      href: "/voice-case",         icon: Mic           },
  { name: "Copy from Photo", href: "/copy-from-photo",    icon: ScanLine      },
  { name: "Vakalatnama",     href: "/power-of-attorney?draft=Vakalatnama", icon: FileSignature },
  { name: "Affidavits",      href: "/affidavits",        icon: PenLine       },
  { name: "Agreements",      href: "/agreements",         icon: Handshake     },
  { name: "Applications",    href: "/applications",       icon: FilePlus      },
  { name: "Family Law",      href: "/family-law",         icon: HeartHandshake},
  { name: "Criminal Law",    href: "/criminal-law",       icon: ShieldAlert   },
  { name: "Property Law",    href: "/property-law",       icon: Building2     },
  { name: "Civil Law",       href: "/civil-law",          icon: Scale         },
  { name: "Corporate Law",   href: "/corporate-law",      icon: Briefcase     },
  { name: "Tax Law",         href: "/tax-law",            icon: Calculator    },
  { name: "Immigration",     href: "/immigration-law",    icon: Globe         },
  { name: "Constitutional",  href: "/constitutional-law", icon: Landmark      },
  { name: "Non-Muslim Laws", href: "/non-muslim-laws",    icon: Users         },
];

const managementItems = [
  { name: "My Documents", href: "/documents",    icon: Folder          },
  { name: "Lawyer Diary", href: "/lawyer-diary", icon: Gavel           },
];

const toolItems = [
  { name: "Translate",      href: "/translate",                        icon: Languages  },
  { name: "Tax Calculator", href: "/property-transfer/tax-calculator", icon: Calculator },
];

function isActive(href: string, pathname: string) {
  if (href === "/dashboard") return pathname === href;
  return pathname === href || pathname.startsWith(href + "/");
}

// Stable across states: a full-width hairline with the label masking it.
// Collapsing just fades the label out (revealing a clean rail divider) — no
// structural swap, so the width animation stays smooth.
function SectionDivider({ label, collapsed }: { label: string; collapsed?: boolean }) {
  return (
    <div className="relative flex items-center h-4 mx-2 mt-4 mb-1">
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px" style={{ background: "var(--border-subtle)" }} />
      <span
        className="relative pr-2 text-[9px] font-bold uppercase tracking-[0.18em] leading-none whitespace-nowrap transition-opacity duration-200 motion-reduce:transition-none"
        style={{
          color: "var(--text-tertiary)",
          background: "var(--bg-surface-1)",
          opacity: collapsed ? 0 : 1,
        }}
      >
        {label}
      </span>
    </div>
  );
}

// Icon lives in a fixed-width box pinned to a constant x, so it never shifts
// when the rail collapses. The label is always mounted; it fades out and gets
// clipped by the parent's overflow-hidden as the width shrinks (no reflow, no
// pop). Expanding fades the label back in with a slight delay so text never
// appears before there's room for it.
function NavItem({ href, icon: Icon, name, badge, collapsed }: { href: string; icon: React.ElementType; name: string; badge?: string; collapsed?: boolean }) {
  const pathname = usePathname();
  const active = isActive(href, pathname);
  const labelStyle = { opacity: collapsed ? 0 : 1, transitionDelay: collapsed ? "0ms" : "80ms" };

  return (
    <Link
      href={href}
      onClick={() => {
        if (href === "/agreements" && pathname === "/agreements") {
          window.dispatchEvent(new Event("taqi:show-agreement-library"));
        }
      }}
      aria-label={name}
      title={collapsed ? name : undefined}
      className="relative flex items-center h-9 rounded-md text-[13px] font-medium overflow-hidden transition-colors"
      style={{
        color:      active ? "#06b6d4" : "var(--text-secondary)",
        background: active ? "rgba(6,182,212,0.08)" : "transparent",
        border:     active ? "1px solid rgba(6,182,212,0.15)" : "1px solid transparent",
        boxShadow:  active ? "var(--glow-cyan-sm)" : "none",
      }}
      onMouseEnter={e => {
        if (!active) {
          e.currentTarget.style.background = "var(--bg-surface-3)";
          e.currentTarget.style.color = "var(--text-primary)";
        }
      }}
      onMouseLeave={e => {
        if (!active) {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "var(--text-secondary)";
        }
      }}
    >
      <span className="relative grid place-items-center w-9 h-9 flex-shrink-0">
        <Icon className="h-[16px] w-[16px]" strokeWidth={1.5}
              style={{ color: active ? "#06b6d4" : "inherit" }} />
        {badge && (
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full transition-opacity duration-200 motion-reduce:transition-none"
                style={{ background: "#a78bfa", opacity: collapsed ? 1 : 0 }} />
        )}
      </span>
      <span className="flex-1 min-w-0 truncate transition-opacity duration-200 motion-reduce:transition-none" style={labelStyle}>
        {name}
      </span>
      {badge && (
        <span className="mr-2 flex-shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded leading-none whitespace-nowrap transition-opacity duration-200 motion-reduce:transition-none"
              style={{ background: "rgba(167,139,250,0.15)", color: "#a78bfa", border: "1px solid rgba(167,139,250,0.25)", opacity: collapsed ? 0 : 1 }}>
          {badge}
        </span>
      )}
    </Link>
  );
}

function CollapsibleGroup({
  label,
  items,
  defaultOpen = false,
  collapsed = false,
}: {
  label: string;
  items: { name: string; href: string; icon: React.ElementType }[];
  defaultOpen?: boolean;
  collapsed?: boolean;
}) {
  const pathname = usePathname();
  const hasActive = items.some((i) => isActive(i.href, pathname));
  const [open, setOpen] = useState(defaultOpen || hasActive);
  // Sub-items show only when open AND the rail is expanded. Collapsing the rail
  // smoothly rolls them up via a grid-rows height animation rather than an
  // abrupt unmount. The header keeps the same fixed-icon-box layout as NavItem.
  const expanded = open && !collapsed;
  const labelStyle = { opacity: collapsed ? 0 : 1, transitionDelay: collapsed ? "0ms" : "80ms" };

  return (
    <div>
      <button
        onClick={() => (collapsed ? setSidebarCollapsed(false) : setOpen((p) => !p))}
        aria-expanded={expanded}
        title={collapsed ? label : undefined}
        className="relative w-full flex items-center h-9 rounded-md text-[13px] font-medium overflow-hidden transition-colors"
        style={{
          color:      hasActive ? "#06b6d4" : "var(--text-secondary)",
          background: hasActive && expanded ? "rgba(6,182,212,0.04)" : "transparent",
        }}
        onMouseEnter={e => { if (!hasActive) e.currentTarget.style.background = "var(--bg-surface-3)"; }}
        onMouseLeave={e => { if (!(hasActive && expanded)) e.currentTarget.style.background = "transparent"; }}
      >
        <span className="grid place-items-center w-9 h-9 flex-shrink-0">
          <PenLine className="h-[16px] w-[16px]" strokeWidth={1.5}
                   style={{ color: hasActive ? "#06b6d4" : "inherit" }} />
        </span>
        <span className="flex-1 min-w-0 text-left truncate transition-opacity duration-200 motion-reduce:transition-none" style={labelStyle}>{label}</span>
        <ChevronDown
          className="mr-2 h-3 w-3 flex-shrink-0 transition-[transform,opacity] duration-200 motion-reduce:transition-none"
          style={{ color: "var(--text-tertiary)", opacity: collapsed ? 0 : 1, transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}
          strokeWidth={1.5}
        />
      </button>

      <div
        className="grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
        style={{ gridTemplateRows: expanded ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div
            className="ml-[18px] mt-0.5 pl-3 space-y-0.5"
            style={{ borderLeft: "1px solid var(--border-subtle)" }}
          >
            {items.map((item) => {
              const active = isActive(item.href, pathname);
              const ItemIcon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  aria-label={item.name}
                  className="flex items-center gap-2 h-7 px-2 rounded-md text-[12px] font-medium whitespace-nowrap transition-colors"
                  style={{
                    color:      active ? "#06b6d4" : "var(--text-secondary)",
                    background: active ? "rgba(6,182,212,0.08)" : "transparent",
                    border:     active ? "1px solid rgba(6,182,212,0.12)" : "1px solid transparent",
                  }}
                  onMouseEnter={e => {
                    if (!active) {
                      e.currentTarget.style.background = "var(--bg-surface-3)";
                      e.currentTarget.style.color = "var(--text-primary)";
                    }
                  }}
                  onMouseLeave={e => {
                    if (!active) {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "var(--text-secondary)";
                    }
                  }}
                >
                  <ItemIcon className="h-3.5 w-3.5 flex-shrink-0" strokeWidth={1.5}
                            style={{ color: active ? "#06b6d4" : "inherit" }} />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  user?: { name?: string; plan?: string };
}

function SidebarContent({ onClose, user, collapsed = false }: { onClose: () => void; user?: { name?: string; plan?: string }; collapsed?: boolean }) {
  const router = useRouter();
  const handleLogout = async () => {
    await fetch("/api/auth/session", { method: "DELETE" });
    router.push("/login");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Logo — icon stays put, wordmark fades so the rail collapse is smooth */}
      <div
        className="h-14 flex items-center gap-2 pl-2.5 pr-2 flex-shrink-0 overflow-hidden"
        style={{ borderBottom: "1px solid var(--border-subtle)" }}
      >
        <Link href="/dashboard" className="flex items-center gap-3 min-w-0 flex-1" title={collapsed ? "TaqiAI" : undefined}>
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
              boxShadow: "0 0 16px rgba(6,182,212,0.25)",
            }}
          >
            <Scale className="h-4 w-4 text-white" strokeWidth={2} />
          </div>
          <div className="min-w-0 whitespace-nowrap transition-opacity duration-200 motion-reduce:transition-none"
               style={{ opacity: collapsed ? 0 : 1, transitionDelay: collapsed ? "0ms" : "80ms" }}>
            <p className="text-[14px] font-extrabold leading-none tracking-tight" style={{ color: "var(--text-primary)" }}>
              TaqiAI
            </p>
            <p className="text-[10px] font-medium mt-0.5" style={{ color: "var(--text-tertiary)" }}>
              AI for Pakistani Lawyers
            </p>
          </div>
        </Link>
        <button
          onClick={onClose}
          aria-label="Close sidebar"
          className="lg:hidden p-1.5 rounded-md transition-colors flex-shrink-0"
          style={{ color: "var(--text-tertiary)" }}
          onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-surface-3)")}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-2 px-2 overflow-y-auto overflow-x-hidden space-y-0.5">
        <SectionDivider label="Main" collapsed={collapsed} />
        {mainItems.map((item) => (
          <NavItem key={item.name} {...item} collapsed={collapsed} />
        ))}

        <SectionDivider label="Research" collapsed={collapsed} />
        {researchItems.map((item) => (
          <NavItem key={item.name} {...item} collapsed={collapsed} />
        ))}

        <SectionDivider label="Draft Documents" collapsed={collapsed} />
        <CollapsibleGroup label="All Document Types" items={draftItems} collapsed={collapsed} />

        <SectionDivider label="Management" collapsed={collapsed} />
        {managementItems.map((item) => (
          <NavItem key={item.name} {...item} collapsed={collapsed} />
        ))}

        <SectionDivider label="Tools" collapsed={collapsed} />
        {toolItems.map((item) => (
          <NavItem key={item.name} {...item} collapsed={collapsed} />
        ))}
      </nav>

      {/* Footer — full layout stays in flow (holds the height) and fades out;
          the compact rail layout cross-fades in over it. No structural pop. */}
      <div className="relative flex-shrink-0 overflow-hidden" style={{ borderTop: "1px solid var(--border-subtle)" }}>
        {/* Full */}
        <div
          className="px-3 py-3 space-y-3 transition-opacity duration-200 motion-reduce:transition-none"
          style={{ opacity: collapsed ? 0 : 1, pointerEvents: collapsed ? "none" : "auto" }}
          aria-hidden={collapsed}
        >
          {/* Workspace selector */}
          <button
            className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-colors"
            style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border-default)" }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--border-strong)")}
            onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border-default)")}
          >
            <div
              className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #06b6d4 0%, #0e7490 100%)" }}
            >
              <span className="text-white text-[11px] font-bold">{user?.name?.charAt(0).toUpperCase() ?? "A"}</span>
            </div>
            <div className="flex-1 min-w-0 text-left leading-tight">
              <p className="text-[9px] uppercase tracking-wider whitespace-nowrap" style={{ color: "var(--text-tertiary)" }}>Workspace</p>
              <p className="text-[12px] font-semibold truncate" style={{ color: "var(--text-primary)" }}>
                {user?.name ? `Chamber of ${user.name}` : "My Chamber"}
              </p>
            </div>
            <ChevronDown className="h-4 w-4 flex-shrink-0" strokeWidth={1.5} style={{ color: "var(--text-tertiary)" }} />
          </button>

          {/* Plan + actions */}
          <div className="flex items-center justify-between">
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap"
              style={{ background: "rgba(6,182,212,0.1)", color: "#06b6d4", border: "1px solid rgba(6,182,212,0.2)" }}
            >
              {user?.plan ?? "Free Plan"}
            </span>
            <div className="flex items-center gap-0.5">
              <Link
                href="/settings"
                aria-label="Settings"
                className="p-1.5 rounded-md transition-colors"
                style={{ color: "var(--text-tertiary)" }}
                onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-surface-3)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                <Settings className="h-4 w-4" strokeWidth={1.5} />
              </Link>
              <button
                onClick={handleLogout}
                aria-label="Logout"
                className="p-1.5 rounded-md transition-colors"
                style={{ color: "var(--text-tertiary)" }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; e.currentTarget.style.color = "#ef4444"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-tertiary)"; }}
              >
                <LogOut className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center justify-between text-[10px] whitespace-nowrap" style={{ color: "var(--text-tertiary)" }}>
            <span className="font-mono">v1.2.4</span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#10b981" }} />
              All systems operational
            </span>
          </div>
        </div>

        {/* Rail */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 transition-opacity duration-200 motion-reduce:transition-none"
          style={{ opacity: collapsed ? 1 : 0, pointerEvents: collapsed ? "auto" : "none" }}
          aria-hidden={!collapsed}
        >
          <div
            className="w-8 h-8 rounded-md flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #06b6d4 0%, #0e7490 100%)" }}
            title={user?.name ? `Chamber of ${user.name}` : "My Chamber"}
          >
            <span className="text-white text-[12px] font-bold">{user?.name?.charAt(0).toUpperCase() ?? "A"}</span>
          </div>
          <Link
            href="/settings"
            aria-label="Settings"
            title="Settings"
            tabIndex={collapsed ? 0 : -1}
            className="p-2 rounded-md transition-colors"
            style={{ color: "var(--text-tertiary)" }}
            onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-surface-3)")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >
            <Settings className="h-4 w-4" strokeWidth={1.5} />
          </Link>
          <button
            onClick={handleLogout}
            aria-label="Logout"
            title="Logout"
            tabIndex={collapsed ? 0 : -1}
            className="p-2 rounded-md transition-colors"
            style={{ color: "var(--text-tertiary)" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; e.currentTarget.style.color = "#ef4444"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-tertiary)"; }}
          >
            <LogOut className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Sidebar({ open, onClose, user }: SidebarProps) {
  const pathname = usePathname();
  const collapsed = useSidebarCollapsed();

  useEffect(() => { onClose(); }, [pathname, onClose]);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <aside
        className={`hidden lg:flex flex-col flex-shrink-0 min-h-screen overflow-hidden transition-[width] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${collapsed ? "w-[64px]" : "w-[240px]"}`}
        style={{
          background:  "var(--bg-surface-1)",
          borderRight: "1px solid var(--border-subtle)",
          willChange: "width",
        }}
      >
        <SidebarContent onClose={onClose} user={user} collapsed={collapsed} />
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 backdrop-blur-sm"
            style={{ background: "rgba(7,9,15,0.85)" }}
            onClick={onClose}
          />
          <aside
            className="absolute left-0 top-0 bottom-0 w-[260px] flex flex-col shadow-2xl animate-slide-in"
            style={{
              background:  "var(--bg-surface-1)",
              borderRight: "1px solid var(--border-subtle)",
            }}
          >
            <SidebarContent onClose={onClose} user={user} />
          </aside>
        </div>
      )}
    </>
  );
}
