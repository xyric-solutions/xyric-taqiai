"use client";

import { useEffect, useState, useCallback } from "react";
import {
  User, Palette, Globe, Bot, FileText, Bell,
  Shield, Keyboard, CreditCard, Save, Check,
  Sun, Moon, ChevronRight, Lock, Eye, EyeOff,
  LogOut, Smartphone, AlertTriangle, Download,
  Zap, Scale, BookOpen, Languages
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Profile {
  id: string; name: string; email: string;
  barCouncilId: string; phone: string; city: string; language: string;
}

interface Prefs {
  theme: "dark" | "light";
  fontSize: "small" | "medium" | "large";
  density: "compact" | "default" | "comfortable";
  sidebarUrdu: boolean;
  uiLanguage: "en" | "ur" | "both";
  aiLanguage: "en" | "ur" | "auto";
  dateFormat: "DD/MM/YYYY" | "MM/DD/YYYY" | "DD MMM YYYY";
  timeFormat: "12" | "24";
  citationStyle: "scmr" | "pld" | "full";
  aiResponseLength: "brief" | "balanced" | "detailed";
  legalPerspective: "balanced" | "plaintiff" | "defendant";
  bismillah: boolean;
  aiDisclaimer: boolean;
  autoSaveDrafts: boolean;
  defaultCourt: string;
  defaultCity: string;
  paperSize: "A4" | "Legal";
  documentLanguage: "en" | "ur" | "ask";
  hearingReminders: boolean;
  reminderLeadTime: string;
  deadlineAlerts: boolean;
  dailySummary: boolean;
  emailNotifications: boolean;
  whatsappNotifications: boolean;
  showShortcuts: boolean;
}

const DEFAULT_PREFS: Prefs = {
  theme: "dark", fontSize: "medium", density: "default",
  sidebarUrdu: true, uiLanguage: "en", aiLanguage: "auto",
  dateFormat: "DD/MM/YYYY", timeFormat: "12",
  citationStyle: "scmr", aiResponseLength: "balanced",
  legalPerspective: "balanced", bismillah: false,
  aiDisclaimer: true, autoSaveDrafts: true,
  defaultCourt: "Lahore High Court", defaultCity: "Lahore",
  paperSize: "A4", documentLanguage: "en",
  hearingReminders: true, reminderLeadTime: "1 day",
  deadlineAlerts: true, dailySummary: false,
  emailNotifications: true, whatsappNotifications: false,
  showShortcuts: true,
};

// ─── Nav sections ──────────────────────────────────────────────────────────────

const NAV = [
  { id: "profile",       icon: User,       label: "Profile" },
  { id: "appearance",    icon: Palette,     label: "Appearance" },
  { id: "language",      icon: Globe,       label: "Language & Region" },
  { id: "ai",            icon: Bot,         label: "AI Preferences" },
  { id: "documents",     icon: FileText,    label: "Document Setup" },
  { id: "notifications", icon: Bell,        label: "Notifications" },
  { id: "security",      icon: Shield,      label: "Security" },
  { id: "shortcuts",     icon: Keyboard,    label: "Shortcuts" },
  { id: "subscription",  icon: CreditCard,  label: "Subscription" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const COURTS = [
  "Lahore High Court", "Islamabad High Court", "Sindh High Court",
  "Peshawar High Court", "Balochistan High Court",
  "Supreme Court of Pakistan", "Sessions Court", "Other",
];

const CITIES = ["Lahore", "Karachi", "Islamabad", "Rawalpindi", "Peshawar", "Quetta", "Multan", "Faisalabad", "Other"];

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!on)}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 focus:outline-none ${on ? "bg-primary-500" : "bg-[var(--border-default)]"}`}
    >
      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform duration-200 ${on ? "translate-x-4" : "translate-x-1"}`} />
    </button>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[var(--bg-surface-1)] border border-[var(--border-subtle)] rounded-xl p-6 space-y-5">
      <h2 className="text-base font-semibold text-[var(--text-primary)]">{title}</h2>
      {children}
    </div>
  );
}

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-[var(--text-secondary)]">{label}</label>
      {children}
    </div>
  );
}

function StyledInput({ value, onChange, placeholder, type = "text", readOnly }: {
  value: string; onChange?: (v: string) => void;
  placeholder?: string; type?: string; readOnly?: boolean;
}) {
  return (
    <input
      type={type}
      value={value}
      readOnly={readOnly}
      onChange={e => onChange?.(e.target.value)}
      placeholder={placeholder}
      className={`w-full px-3 py-2 bg-[var(--bg-surface-2)] border border-[var(--border-default)] rounded-lg text-sm text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:border-[var(--border-strong)] focus:ring-1 focus:ring-primary-500/30 transition-colors ${readOnly ? "opacity-50 cursor-not-allowed" : ""}`}
    />
  );
}

function StyledSelect({ value, onChange, options }: {
  value: string; onChange: (v: string) => void; options: string[];
}) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full px-3 py-2 bg-[var(--bg-surface-2)] border border-[var(--border-default)] rounded-lg text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-strong)] transition-colors"
    >
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function SegmentedControl<T extends string>({ value, onChange, options }: {
  value: T; onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div className="inline-flex bg-[var(--bg-surface-2)] border border-[var(--border-default)] rounded-lg p-0.5 gap-0.5">
      {options.map(o => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150 ${
            value === o.value
              ? "bg-primary-500 text-white shadow"
              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-3)]"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function RadioGroup<T extends string>({ value, onChange, options }: {
  value: T; onChange: (v: T) => void;
  options: { value: T; label: string; desc?: string }[];
}) {
  return (
    <div className="space-y-2">
      {options.map(o => (
        <label key={o.value} className="flex items-start gap-3 cursor-pointer group">
          <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
            value === o.value ? "border-primary-500" : "border-[var(--border-strong)] group-hover:border-[var(--border-strong)]"
          }`}>
            {value === o.value && <div className="w-2 h-2 rounded-full bg-primary-500" />}
          </div>
          <input type="radio" className="sr-only" checked={value === o.value} onChange={() => onChange(o.value)} />
          <div>
            <span className="text-sm text-[var(--text-primary)]">{o.label}</span>
            {o.desc && <p className="text-xs text-[var(--text-tertiary)] mt-0.5">{o.desc}</p>}
          </div>
        </label>
      ))}
    </div>
  );
}

function SaveRow({ onSave, saving, saved }: { onSave: () => void; saving: boolean; saved: boolean }) {
  return (
    <div className="flex items-center gap-3 pt-2 border-t border-[var(--border-subtle)]">
      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors"
      >
        {saving ? (
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : <Save className="h-4 w-4" />}
        Save Changes
      </button>
      {saved && (
        <span className="text-sm text-emerald-400 flex items-center gap-1.5">
          <Check className="h-4 w-4" /> Saved
        </span>
      )}
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const [active, setActive] = useState("profile");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS);
  const [loading, setLoading] = useState(true);

  // Per-section save state
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [saved, setSaved]   = useState<Record<string, boolean>>({});

  // Password change state
  const [pwCurrent, setPwCurrent] = useState("");
  const [pwNew, setPwNew]         = useState("");
  const [pwConfirm, setPwConfirm] = useState("");
  const [showPw, setShowPw]       = useState(false);
  const [pwError, setPwError]     = useState("");

  // ── Load profile + prefs ──────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/auth/profile", { credentials: "include" });
        if (res.ok) {
          const data = await res.json() as { profile: Profile };
          setProfile(data.profile);
        }
      } finally {
        setLoading(false);
      }
    })();
    const stored = localStorage.getItem("taqiai-prefs");
    if (stored) {
      try { setPrefs({ ...DEFAULT_PREFS, ...JSON.parse(stored) as Partial<Prefs> }); }
      catch { /* ignore */ }
    }
  }, []);

  // ── Apply theme + font + density ─────────────────────────────────────────
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", prefs.theme);
    root.setAttribute("data-font-size", prefs.fontSize);
    root.setAttribute("data-density", prefs.density);
    localStorage.setItem("taqiai-prefs", JSON.stringify(prefs));
  }, [prefs]);

  const setPref = useCallback(<K extends keyof Prefs>(key: K, val: Prefs[K]) => {
    setPrefs(p => ({ ...p, [key]: val }));
  }, []);

  // ── Save helpers ──────────────────────────────────────────────────────────
  const markSave = (section: string) => {
    setSaving(s => ({ ...s, [section]: false }));
    setSaved(s => ({ ...s, [section]: true }));
    setTimeout(() => setSaved(s => ({ ...s, [section]: false })), 2500);
  };

  const saveProfile = async () => {
    if (!profile) return;
    setSaving(s => ({ ...s, profile: true }));
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: profile.name, barCouncilId: profile.barCouncilId,
          phone: profile.phone, city: profile.city, language: profile.language,
        }),
      });
      if (res.ok) {
        const data = await res.json() as { profile: Profile };
        setProfile(data.profile);
      }
    } finally { markSave("profile"); }
  };

  const savePrefs = (section: string) => {
    setSaving(s => ({ ...s, [section]: true }));
    localStorage.setItem("taqiai-prefs", JSON.stringify(prefs));
    markSave(section);
  };

  const changePassword = async () => {
    setPwError("");
    if (!pwNew || !pwCurrent) { setPwError("All fields are required"); return; }
    if (pwNew !== pwConfirm)  { setPwError("Passwords do not match"); return; }
    if (pwNew.length < 8)     { setPwError("Password must be at least 8 characters"); return; }
    setSaving(s => ({ ...s, security: true }));
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ currentPassword: pwCurrent, newPassword: pwNew }),
      });
      const data = await res.json() as { error?: string };
      if (!res.ok) {
        setPwError(data.error || "Failed to update password");
        setSaving(s => ({ ...s, security: false }));
        return;
      }
      setPwCurrent(""); setPwNew(""); setPwConfirm("");
      markSave("security");
    } catch {
      setPwError("Network error — please try again");
      setSaving(s => ({ ...s, security: false }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-[var(--text-tertiary)]">Loading settings...</p>
        </div>
      </div>
    );
  }

  // ─── Render sections ───────────────────────────────────────────────────────

  const renderSection = () => {
    switch (active) {

      // ── 1. Profile ──────────────────────────────────────────────────────────
      case "profile": return (
        <div className="space-y-5">
          <SectionCard title="Personal Information">
            <FieldRow label="Full Name">
              <StyledInput value={profile?.name ?? ""} onChange={v => setProfile(p => p ? { ...p, name: v } : p)} placeholder="Adv. Muhammad Ali" />
            </FieldRow>
            <FieldRow label="Email Address">
              <StyledInput value={profile?.email ?? ""} readOnly />
              <p className="text-xs text-[var(--text-tertiary)]">Email cannot be changed</p>
            </FieldRow>
            <FieldRow label="Phone Number">
              <StyledInput value={profile?.phone ?? ""} onChange={v => setProfile(p => p ? { ...p, phone: v } : p)} placeholder="+92 300 1234567" />
            </FieldRow>
            <FieldRow label="City">
              <select
                value={profile?.city ?? ""}
                onChange={e => setProfile(p => p ? { ...p, city: e.target.value } : p)}
                className="w-full px-3 py-2 bg-[var(--bg-surface-2)] border border-[var(--border-default)] rounded-lg text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-strong)] transition-colors"
              >
                <option value="">Select city</option>
                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </FieldRow>
          </SectionCard>

          <SectionCard title="Professional Information">
            <FieldRow label="Bar Council Enrollment Number">
              <StyledInput value={profile?.barCouncilId ?? ""} onChange={v => setProfile(p => p ? { ...p, barCouncilId: v } : p)} placeholder="e.g. PBC-12345" />
            </FieldRow>
            <FieldRow label="Preferred Language">
              <div className="flex gap-2">
                {["en", "ur"].map(lang => (
                  <button key={lang} type="button"
                    onClick={() => setProfile(p => p ? { ...p, language: lang } : p)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      profile?.language === lang
                        ? "bg-primary-500 text-white"
                        : "bg-[var(--bg-surface-2)] border border-[var(--border-default)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    {lang === "en" ? "English" : "اردو Urdu"}
                  </button>
                ))}
              </div>
            </FieldRow>
          </SectionCard>

          <SaveRow onSave={saveProfile} saving={!!saving.profile} saved={!!saved.profile} />
        </div>
      );

      // ── 2. Appearance ───────────────────────────────────────────────────────
      case "appearance": return (
        <div className="space-y-5">
          <SectionCard title="Theme">
            <div className="flex gap-3">
              {([
                { value: "dark",  icon: Moon, label: "Dark Mode",  urdu: "ڈارک" },
                { value: "light", icon: Sun,  label: "Light Mode", urdu: "لائٹ" },
              ] as const).map(t => (
                <button key={t.value} type="button" onClick={() => setPref("theme", t.value)}
                  className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    prefs.theme === t.value
                      ? "border-primary-500 bg-[var(--bg-surface-3)]"
                      : "border-[var(--border-default)] bg-[var(--bg-surface-2)] hover:border-[var(--border-strong)]"
                  }`}
                >
                  <t.icon className={`h-5 w-5 ${prefs.theme === t.value ? "text-primary-500" : "text-[var(--text-tertiary)]"}`} />
                  <span className="text-sm font-medium text-[var(--text-primary)]">{t.label}</span>
                </button>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Text Size">
            <SegmentedControl
              value={prefs.fontSize}
              onChange={v => setPref("fontSize", v)}
              options={[{ value: "small", label: "Small" }, { value: "medium", label: "Medium" }, { value: "large", label: "Large" }]}
            />
            <p className="text-xs text-[var(--text-tertiary)] mt-1">Preview text at selected size</p>
          </SectionCard>

          <SectionCard title="Display Density">
            <SegmentedControl
              value={prefs.density}
              onChange={v => setPref("density", v)}
              options={[{ value: "compact", label: "Compact" }, { value: "default", label: "Default" }, { value: "comfortable", label: "Comfortable" }]}
            />
            <p className="text-xs text-[var(--text-tertiary)] mt-1">Compact shows more content. Comfortable adds more spacing.</p>
          </SectionCard>

          <SectionCard title="Sidebar Options">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--text-primary)]">Collapse sidebar by default</p>
                <p className="text-xs text-[var(--text-tertiary)] mt-0.5">Sidebar will start collapsed on page load</p>
              </div>
              <Toggle on={prefs.sidebarUrdu} onChange={v => setPref("sidebarUrdu", v)} />
            </div>
          </SectionCard>

          <SaveRow onSave={() => savePrefs("appearance")} saving={!!saving.appearance} saved={!!saved.appearance} />
        </div>
      );

      // ── 3. Language & Region ────────────────────────────────────────────────
      case "language": return (
        <div className="space-y-5">
          <SectionCard title="AI Response Language">
            <RadioGroup
              value={prefs.aiLanguage}
              onChange={v => setPref("aiLanguage", v)}
              options={[
                { value: "en",   label: "English",                  desc: "AI always replies in English" },
                { value: "auto", label: "Auto-detect (Recommended)", desc: "AI matches the language of your question automatically" },
              ]}
            />
          </SectionCard>

          <SectionCard title="Date & Time">
            <FieldRow label="Date Format">
              <RadioGroup
                value={prefs.dateFormat}
                onChange={v => setPref("dateFormat", v)}
                options={[
                  { value: "DD/MM/YYYY",   label: "DD/MM/YYYY",   desc: "14/05/2026 — Pakistani standard" },
                  { value: "DD MMM YYYY",  label: "DD MMM YYYY",  desc: "14 May 2026" },
                  { value: "MM/DD/YYYY",   label: "MM/DD/YYYY",   desc: "05/14/2026" },
                ]}
              />
            </FieldRow>
            <FieldRow label="Time Format">
              <SegmentedControl
                value={prefs.timeFormat}
                onChange={v => setPref("timeFormat", v)}
                options={[{ value: "12", label: "12-hour (2:30 PM)" }, { value: "24", label: "24-hour (14:30)" }]}
              />
            </FieldRow>
          </SectionCard>

          <SaveRow onSave={() => savePrefs("language")} saving={!!saving.language} saved={!!saved.language} />
        </div>
      );

      // ── 4. AI Preferences ───────────────────────────────────────────────────
      case "ai": return (
        <div className="space-y-5">
          <SectionCard title="Citation Style">
            <RadioGroup
              value={prefs.citationStyle}
              onChange={v => setPref("citationStyle", v)}
              options={[
                { value: "scmr", label: "SCMR Format", desc: "2019 SCMR 456" },
                { value: "pld",  label: "PLD Format",  desc: "PLD 2019 SC 123" },
                { value: "full", label: "Full Format",  desc: "Supreme Court Monthly Review 2019, Volume 1, Page 456" },
              ]}
            />
          </SectionCard>

          <SectionCard title="AI Response Detail">
            <RadioGroup
              value={prefs.aiResponseLength}
              onChange={v => setPref("aiResponseLength", v)}
              options={[
                { value: "brief",    label: "Brief",    desc: "Short answers, key points only — faster" },
                { value: "balanced", label: "Balanced", desc: "Standard length with explanations (recommended)" },
                { value: "detailed", label: "Detailed", desc: "Full analysis with all relevant points and citations" },
              ]}
            />
          </SectionCard>

          <SectionCard title="Default Drafting Perspective">
            <RadioGroup
              value={prefs.legalPerspective}
              onChange={v => setPref("legalPerspective", v)}
              options={[
                { value: "balanced",  label: "Balanced (both sides)",      desc: "AI shows both plaintiff and defendant arguments" },
                { value: "plaintiff", label: "Plaintiff / Prosecution",     desc: "Draft arguments in favour of plaintiff or prosecution" },
                { value: "defendant", label: "Defendant / Defense",         desc: "Draft arguments in favour of defendant or defense" },
              ]}
            />
            <p className="text-xs text-[var(--text-tertiary)]">AI Advisor always stays balanced. This only affects document drafting.</p>
          </SectionCard>

          <SectionCard title="Document Options">
            {[
              { key: "aiDisclaimer",   label: "Show AI disclaimer on documents", desc: "Shows 'AI Generated — Verify before filing' on draft documents" },
              { key: "autoSaveDrafts", label: "Auto-save AI drafts",              desc: "Automatically saves AI-generated documents to My Documents" },
            ].map(item => (
              <div key={item.key} className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-[var(--text-primary)]">{item.label}</p>
                  <p className="text-xs text-[var(--text-tertiary)] mt-0.5">{item.desc}</p>
                </div>
                <Toggle on={!!prefs[item.key as keyof Prefs]} onChange={v => setPref(item.key as keyof Prefs, v as never)} />
              </div>
            ))}
          </SectionCard>

          <SaveRow onSave={() => savePrefs("ai")} saving={!!saving.ai} saved={!!saved.ai} />
        </div>
      );

      // ── 5. Document Setup ───────────────────────────────────────────────────
      case "documents": return (
        <div className="space-y-5">
          <SectionCard title="Lawyer Header">
            <p className="text-xs text-[var(--text-tertiary)]">This appears at the top of every drafted document.</p>
            <div className="bg-[var(--bg-surface-2)] border border-[var(--border-default)] rounded-lg p-4 text-sm space-y-0.5">
              <p className="text-[var(--text-primary)] font-medium">Adv. {profile?.name || "[Your Name]"}</p>
              <p className="text-[var(--text-secondary)]">Enrollment No: {profile?.barCouncilId || "[Enrollment]"}</p>
              <p className="text-[var(--text-secondary)]">{profile?.phone || "[Phone]"} · {prefs.defaultCity}</p>
            </div>
          </SectionCard>

          <SectionCard title="Default Court Settings">
            <FieldRow label="Primary Court">
              <StyledSelect value={prefs.defaultCourt} onChange={v => setPref("defaultCourt", v)} options={COURTS} />
            </FieldRow>
            <FieldRow label="Default City / District">
              <StyledSelect value={prefs.defaultCity} onChange={v => setPref("defaultCity", v)} options={CITIES} />
            </FieldRow>
          </SectionCard>

          <SectionCard title="Document Format">
            <FieldRow label="Paper Size">
              <SegmentedControl
                value={prefs.paperSize}
                onChange={v => setPref("paperSize", v)}
                options={[{ value: "A4", label: "A4 (Standard)" }, { value: "Legal", label: "Legal / Foolscap" }]}
              />
              <p className="text-xs text-[var(--text-tertiary)] mt-1">Pakistani courts commonly use A4. Some courts use Legal size.</p>
            </FieldRow>
            <FieldRow label="Default Document Language">
              <RadioGroup
                value={prefs.documentLanguage}
                onChange={v => setPref("documentLanguage", v)}
                options={[
                  { value: "en",  label: "English" },
                  { value: "ur",  label: "اردو (Urdu)" },
                  { value: "ask", label: "Ask me every time" },
                ]}
              />
            </FieldRow>
          </SectionCard>

          <SaveRow onSave={() => savePrefs("documents")} saving={!!saving.documents} saved={!!saved.documents} />
        </div>
      );

      // ── 6. Notifications ────────────────────────────────────────────────────
      case "notifications": return (
        <div className="space-y-5">
          <SectionCard title="Hearing Reminders">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--text-primary)]">Remind me before hearings</p>
                <p className="text-xs text-[var(--text-tertiary)] mt-0.5">Get notified before your court hearings</p>
              </div>
              <Toggle on={prefs.hearingReminders} onChange={v => setPref("hearingReminders", v)} />
            </div>
            {prefs.hearingReminders && (
              <FieldRow label="Reminder lead time">
                <SegmentedControl
                  value={prefs.reminderLeadTime}
                  onChange={v => setPref("reminderLeadTime", v)}
                  options={[
                    { value: "1 hour",  label: "1 hour" },
                    { value: "2 hours", label: "2 hours" },
                    { value: "1 day",   label: "1 day" },
                    { value: "2 days",  label: "2 days" },
                  ]}
                />
              </FieldRow>
            )}
          </SectionCard>

          <SectionCard title="Deadline Alerts">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--text-primary)]">Alert me about upcoming deadlines</p>
                <p className="text-xs text-[var(--text-tertiary)] mt-0.5">Limitation periods, filing deadlines</p>
              </div>
              <Toggle on={prefs.deadlineAlerts} onChange={v => setPref("deadlineAlerts", v)} />
            </div>
          </SectionCard>

          <SectionCard title="Daily Summary">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--text-primary)]">Send daily list of today&apos;s hearings</p>
                <p className="text-xs text-[var(--text-tertiary)] mt-0.5">Sent at 8:00 AM every morning</p>
              </div>
              <Toggle on={prefs.dailySummary} onChange={v => setPref("dailySummary", v)} />
            </div>
          </SectionCard>

          <SectionCard title="Notification Channels">
            <div className="space-y-3">
              {[
                { key: "emailNotifications",    icon: "@",  label: "Email Notifications",    desc: profile?.email || "Not set" },
                { key: "whatsappNotifications", icon: "📱", label: "WhatsApp Notifications",  desc: profile?.phone || "Add phone number in Profile" },
              ].map(ch => (
                <div key={ch.key} className="flex items-center justify-between p-3 bg-[var(--bg-surface-2)] rounded-lg border border-[var(--border-default)]">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{ch.icon}</span>
                    <div>
                      <p className="text-sm font-medium text-[var(--text-primary)]">{ch.label}</p>
                      <p className="text-xs text-[var(--text-tertiary)]">{ch.desc}</p>
                    </div>
                  </div>
                  <Toggle on={!!prefs[ch.key as keyof Prefs]} onChange={v => setPref(ch.key as keyof Prefs, v as never)} />
                </div>
              ))}
            </div>
          </SectionCard>

          <SaveRow onSave={() => savePrefs("notifications")} saving={!!saving.notifications} saved={!!saved.notifications} />
        </div>
      );

      // ── 7. Security ─────────────────────────────────────────────────────────
      case "security": return (
        <div className="space-y-5">
          <SectionCard title="Change Password">
            <FieldRow label="Current Password">
              <div className="relative">
                <StyledInput value={pwCurrent} onChange={setPwCurrent} type={showPw ? "text" : "password"} placeholder="Enter current password" />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]">
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </FieldRow>
            <FieldRow label="New Password">
              <StyledInput value={pwNew} onChange={setPwNew} type={showPw ? "text" : "password"} placeholder="Min. 8 characters" />
              {pwNew && (
                <div className="flex gap-1 mt-1">
                  {["Weak","Fair","Good","Strong"].map((s, i) => (
                    <div key={s} className={`h-1 flex-1 rounded-full transition-colors ${
                      pwNew.length > i * 3
                        ? i < 1 ? "bg-red-500" : i < 2 ? "bg-amber-500" : i < 3 ? "bg-yellow-400" : "bg-emerald-500"
                        : "bg-[var(--border-default)]"
                    }`} />
                  ))}
                </div>
              )}
            </FieldRow>
            <FieldRow label="Confirm New Password">
              <StyledInput value={pwConfirm} onChange={setPwConfirm} type={showPw ? "text" : "password"} placeholder="Repeat new password" />
            </FieldRow>
            {pwError && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                <AlertTriangle className="h-4 w-4 flex-shrink-0" /> {pwError}
              </div>
            )}
            <button type="button" onClick={changePassword} disabled={!!saving.security}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors">
              <Lock className="h-4 w-4" />
              {saving.security ? "Updating..." : "Update Password"}
            </button>
            {saved.security && <p className="text-emerald-400 text-sm flex items-center gap-1.5"><Check className="h-4 w-4" /> Password updated</p>}
          </SectionCard>

          <SectionCard title="Active Sessions">
            <div className="space-y-2">
              {[
                { device: "Chrome · Windows", location: "Lahore, Pakistan", time: "Now", current: true },
                { device: "Safari · iPhone",   location: "Karachi, Pakistan", time: "2 days ago", current: false },
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-[var(--bg-surface-2)] rounded-lg border border-[var(--border-default)]">
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-4 w-4 text-[var(--text-tertiary)]" />
                    <div>
                      <p className="text-sm text-[var(--text-primary)]">{s.device}</p>
                      <p className="text-xs text-[var(--text-tertiary)]">{s.location} · {s.time}</p>
                    </div>
                  </div>
                  {s.current
                    ? <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">This device</span>
                    : <button className="text-xs text-red-400 hover:text-red-300 transition-colors">Revoke</button>
                  }
                </div>
              ))}
            </div>
            <button className="text-sm text-red-400 hover:text-red-300 flex items-center gap-1.5 transition-colors">
              <LogOut className="h-4 w-4" /> Revoke all other sessions
            </button>
          </SectionCard>
        </div>
      );

      // ── 8. Shortcuts ────────────────────────────────────────────────────────
      case "shortcuts": return (
        <div className="space-y-5">
          <SectionCard title="Keyboard Shortcuts">
            {[
              { group: "Navigation", items: [
                { key: "Ctrl + K",     action: "Open global search" },
                { key: "Ctrl + B",     action: "Toggle sidebar" },
                { key: "G then D",     action: "Go to Dashboard" },
                { key: "G then A",     action: "Go to AI Advisor" },
              ]},
              { group: "Documents", items: [
                { key: "Ctrl + N",     action: "New document draft" },
                { key: "Ctrl + S",     action: "Save current document" },
                { key: "Ctrl + P",     action: "Print / Export PDF" },
              ]},
              { group: "AI Advisor", items: [
                { key: "Ctrl + Enter", action: "Send message" },
                { key: "Escape",       action: "Close modal / cancel" },
              ]},
              { group: "General", items: [
                { key: "?",            action: "Show keyboard shortcuts" },
              ]},
            ].map(group => (
              <div key={group.group}>
                <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-widest mb-2">{group.group}</p>
                <div className="space-y-1">
                  {group.items.map(item => (
                    <div key={item.key} className="flex items-center justify-between py-1.5 border-b border-[var(--border-subtle)] last:border-0">
                      <span className="text-sm text-[var(--text-secondary)]">{item.action}</span>
                      <kbd className="px-2 py-0.5 bg-[var(--bg-surface-2)] border border-[var(--border-default)] rounded text-xs text-[var(--text-primary)] font-mono">{item.key}</kbd>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </SectionCard>
        </div>
      );

      // ── 9. Subscription ─────────────────────────────────────────────────────
      case "subscription": return (
        <div className="space-y-5">
          <SectionCard title="Current Plan">
            <div className="bg-gradient-to-r from-primary-500/10 to-primary-600/5 border border-primary-500/30 rounded-xl p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-primary-500" />
                    <span className="text-base font-bold text-[var(--text-primary)]">Solo Pro</span>
                    <span className="text-xs bg-primary-500/20 text-primary-400 border border-primary-500/30 px-2 py-0.5 rounded-full">Active</span>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">PKR 2,999 / month</p>
                  <p className="text-xs text-[var(--text-tertiary)] mt-0.5">Next billing: 14 June 2026</p>
                </div>
                <button className="text-sm text-primary-400 hover:text-primary-300 transition-colors">Manage</button>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Usage This Month">
            {[
              { label: "AI Documents",  used: 82, total: "Unlimited", pct: 60, icon: FileText },
              { label: "Templates",     used: 170, total: "170+",     pct: 100, icon: BookOpen },
              { label: "Storage",       used: 120, total: "1024 MB",  pct: 12, icon: Download },
            ].map(item => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <item.icon className="h-3.5 w-3.5 text-[var(--text-tertiary)]" />
                    <span className="text-sm text-[var(--text-secondary)]">{item.label}</span>
                  </div>
                  <span className="text-xs text-[var(--text-tertiary)]">{item.used} / {item.total}</span>
                </div>
                <div className="h-1.5 bg-[var(--bg-surface-3)] rounded-full overflow-hidden">
                  <div className="h-full bg-primary-500 rounded-full transition-all" style={{ width: `${Math.min(item.pct, 100)}%` }} />
                </div>
              </div>
            ))}
          </SectionCard>

          <SectionCard title="Billing History">
            <div className="space-y-2">
              {[
                { date: "14 May 2026", amount: "PKR 2,999" },
                { date: "14 Apr 2026", amount: "PKR 2,999" },
                { date: "14 Mar 2026", amount: "PKR 2,999" },
              ].map(inv => (
                <div key={inv.date} className="flex items-center justify-between py-2 border-b border-[var(--border-subtle)] last:border-0">
                  <div>
                    <p className="text-sm text-[var(--text-primary)]">{inv.date}</p>
                    <p className="text-xs text-[var(--text-tertiary)]">{inv.amount}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-emerald-400 flex items-center gap-1"><Check className="h-3 w-3" /> Paid</span>
                    <button className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-1 transition-colors">
                      <Download className="h-3 w-3" /> Invoice
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <div className="pt-2">
            <button className="text-sm text-red-400 hover:text-red-300 transition-colors">Cancel subscription</button>
          </div>
        </div>
      );

      default: return null;
    }
  };

  // ─── Page render ───────────────────────────────────────────────────────────
  return (
    <div className="flex gap-6 max-w-5xl">

      {/* Left nav */}
      <aside className="w-52 flex-shrink-0">
        <div className="sticky top-20 bg-[var(--bg-surface-1)] border border-[var(--border-subtle)] rounded-xl p-2">
          {NAV.map(item => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActive(item.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left transition-all duration-150 group ${
                active === item.id
                  ? "bg-[var(--bg-surface-3)] border-l-2 border-primary-500 text-[var(--text-primary)]"
                  : "text-[var(--text-secondary)] hover:bg-[var(--bg-surface-2)] hover:text-[var(--text-primary)] border-l-2 border-transparent"
              }`}
            >
              <item.icon className={`h-4 w-4 flex-shrink-0 ${active === item.id ? "text-primary-500" : "text-[var(--text-tertiary)] group-hover:text-[var(--text-secondary)]"}`} />
              <span className="text-xs font-medium truncate">{item.label}</span>
              {active === item.id && <ChevronRight className="h-3 w-3 ml-auto text-[var(--text-tertiary)]" />}
            </button>
          ))}
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 min-w-0">
        <div className="mb-5">
          <h1 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
            {(() => { const n = NAV.find(n => n.id === active); return n ? <n.icon className="h-5 w-5 text-primary-500" /> : null; })()}
            {NAV.find(n => n.id === active)?.label}
          </h1>
        </div>
        {renderSection()}
      </main>
    </div>
  );
}
