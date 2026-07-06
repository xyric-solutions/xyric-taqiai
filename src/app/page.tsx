"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Scale, ArrowRight, Menu, X, Bot, BookOpen, FileText,
  Gavel, Briefcase, Calculator, Globe, Landmark,
  PenLine, Zap, Check,
} from "lucide-react";

const capabilities = [
  {
    title: "AI Legal Advisor",
    titleUrdu: "AI مشیر",
    body: "Ask any question in Urdu or English. Get answers grounded in Pakistan's statutes, ordinances, and case law.",
    icon: Bot,
    color: "#a78bfa",
  },
  {
    title: "170+ Document Templates",
    titleUrdu: "دستاویزات کے سانچے",
    body: "Affidavits, bail applications, FIR complaints, wills and agreements. All Pakistan-specific, court-ready in minutes.",
    icon: FileText,
    color: "#06b6d4",
  },
  {
    title: "SCMR & PLD Case Law",
    titleUrdu: "مقدمات کی تحقیق",
    body: "Search Supreme Court, High Court, and Federal Shariat Court judgments. Find precedents instantly.",
    icon: BookOpen,
    color: "#10b981",
  },
  {
    title: "Court Case Manager",
    titleUrdu: "مقدمات کا نظم",
    body: "Track FIR numbers, case stages, hearing dates, and court notices. Your docket, always up to date.",
    icon: Gavel,
    color: "#f59e0b",
  },
  {
    title: "Chamber & Calendar",
    titleUrdu: "چیمبر کا نظام",
    body: "Manage your matters, deadlines, and appointments in one place. Never miss a hearing date again.",
    icon: Zap,
    color: "#ec4899",
  },
  {
    title: "Urdu & English",
    titleUrdu: "اردو میں کام",
    body: "Full support for Urdu and English. Draft documents in either language, translate court documents instantly.",
    icon: Globe,
    color: "#f97316",
  },
];

const pricingPlans = [
  {
    name: "Free Trial",
    price: "PKR 0",
    sub: "Forever free · Limited use",
    popular: false,
    cta: "Start Free",
    ctaHref: "/register",
    features: [
      { text: "10 AI drafts / month",           on: true  },
      { text: "3 AI Advisor questions / day",   on: true  },
      { text: "Basic templates",                on: true  },
      { text: "Case Law Research",              on: false },
      { text: "Chamber Management",             on: false },
    ],
  },
  {
    name: "Solo Pro",
    price: "PKR 2,999",
    sub: "per month · For individual advocates",
    popular: true,
    cta: "Start Solo Pro",
    ctaHref: "/register",
    features: [
      { text: "Unlimited AI drafts",            on: true },
      { text: "Unlimited AI Advisor",           on: true },
      { text: "All 170+ templates",             on: true },
      { text: "Case Law Research (SCMR/PLD)",   on: true },
      { text: "Chamber + Lawyer Diary",         on: true },
    ],
  },
  {
    name: "Firm",
    price: "PKR 7,999",
    sub: "per month · Up to 5 lawyers",
    popular: false,
    cta: "Contact Us",
    ctaHref: "mailto:support@xyric.ai",
    features: [
      { text: "Everything in Solo Pro",         on: true },
      { text: "5 team seats",                   on: true },
      { text: "Shared document library",        on: true },
      { text: "Admin dashboard",                on: true },
      { text: "Custom templates",               on: true },
    ],
  },
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{ background: "#07090f", color: "#e2e8f0" }}
    >

      {/* ── Navbar ── */}
      <nav
        className="sticky top-0 z-50 px-6 sm:px-10 h-16 flex items-center justify-between"
        style={{
          background:   "rgba(7,9,15,0.92)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(20,30,53,0.8)",
        }}
      >
        <Link href="/" className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
              boxShadow:  "0 0 16px rgba(6,182,212,0.25)",
            }}
          >
            <Scale className="h-4 w-4 text-white" strokeWidth={2} />
          </div>
          <span className="font-display text-[17px] font-extrabold tracking-tight" style={{ color: "#e2e8f0" }}>
            TaqiAI
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          {[
            { label: "Capabilities", id: "capabilities" },
            { label: "How It Works", id: "how-it-works" },
            { label: "Pricing", id: "pricing" },
          ].map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="px-3 py-2 rounded-md text-[13px] font-medium transition-colors"
              style={{ color: "#94a3b8" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#e2e8f0")}
              onMouseLeave={e => (e.currentTarget.style.color = "#94a3b8")}
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-2">
          <Link
            href="/login"
            className="px-3 h-8 flex items-center rounded-md text-[13px] font-medium transition-colors"
            style={{ color: "#94a3b8" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#e2e8f0")}
            onMouseLeave={e => (e.currentTarget.style.color = "#94a3b8")}
          >
            Login
          </Link>
          <Link
            href="/register"
            className="px-4 h-8 flex items-center rounded-md text-[13px] font-semibold transition-all"
            style={{
              background: "#06b6d4",
              color:      "#07090f",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "#0891b2")}
            onMouseLeave={e => (e.currentTarget.style.background = "#06b6d4")}
          >
            Get Started
          </Link>
        </div>

        <button
          className="lg:hidden p-2 rounded-md"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{ color: "#94a3b8" }}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        {mobileMenuOpen && (
          <div
            className="absolute top-16 left-0 right-0 px-6 py-4 flex flex-col gap-1"
            style={{ background: "#0b0f1a", borderBottom: "1px solid #141e35" }}
          >
            {[
              { label: "Capabilities", id: "capabilities" },
              { label: "How It Works", id: "how-it-works" },
              { label: "Pricing", id: "pricing" },
            ].map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="py-2 text-[14px] font-medium"
                style={{ color: "#94a3b8" }}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <div className="flex gap-2 pt-2 border-t mt-2" style={{ borderColor: "#141e35" }}>
              <Link href="/login" className="flex-1 text-center py-2 rounded-md text-[13px] font-medium"
                    style={{ color: "#e2e8f0", background: "#141d32" }}>
                Login
              </Link>
              <Link href="/register" className="flex-1 text-center py-2 rounded-md text-[13px] font-semibold"
                    style={{ background: "#06b6d4", color: "#07090f" }}>
                Get Started
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* ── § 01: Hero (typographic, no video) ── */}
      <section className="relative px-6 sm:px-10 pt-24 pb-20 max-w-6xl mx-auto">
        {/* Section indicator */}
        <div className="flex items-center gap-3 mb-10">
          <span
            className="text-[11px] font-mono font-bold tracking-[0.2em] uppercase"
            style={{ color: "#06b6d4" }}
          >
            § 01
          </span>
          <div className="flex-1 h-px" style={{ background: "#141e35" }} />
        </div>

        <div className="max-w-4xl">
          {/* Docket-style caption */}
          <p
            className="reveal-up text-[11px] font-mono uppercase tracking-[0.2em] mb-5"
            style={{ color: "#475569", animationDelay: "0.05s" }}
          >
            In re: Pakistan&apos;s Legal Profession · AI-Powered Platform · Est. 2025
          </p>

          <h1
            className="reveal-up font-display text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold leading-[1.03] tracking-[-0.03em] mb-6"
            style={{ color: "#e2e8f0", animationDelay: "0.12s" }}
          >
            AI that understands<br />
            <span style={{ color: "#06b6d4" }}>Pakistani courts.</span>
          </h1>

          <p
            className="reveal-up text-[clamp(1rem,2vw,1.25rem)] leading-relaxed max-w-2xl mb-3"
            style={{ color: "#94a3b8", animationDelay: "0.2s" }}
          >
            The first legal intelligence platform built exclusively for Pakistani advocates.
            Draft documents, research case law, and manage your practice in Urdu and English.
          </p>

          <p
            className="reveal-up text-[18px] leading-relaxed mb-10 text-urdu"
            style={{ color: "#475569", animationDelay: "0.28s" }}
          >
            پاکستانی وکلاء کا اپنا AI قانونی نظام
          </p>

          <div className="reveal-up flex flex-wrap gap-3" style={{ animationDelay: "0.36s" }}>
            <Link
              href="/register"
              className="flex items-center gap-2 px-6 h-11 rounded-md text-[14px] font-bold transition-all"
              style={{ background: "#06b6d4", color: "#07090f" }}
              onMouseEnter={e => (e.currentTarget.style.background = "#0891b2")}
              onMouseLeave={e => (e.currentTarget.style.background = "#06b6d4")}
            >
              Open your workspace
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </Link>
            <Link
              href="/ai-advisor"
              className="flex items-center gap-2 px-6 h-11 rounded-md text-[14px] font-medium transition-all"
              style={{
                background: "rgba(6,182,212,0.08)",
                border:     "1px solid rgba(6,182,212,0.25)",
                color:      "#06b6d4",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(6,182,212,0.14)")}
              onMouseLeave={e => (e.currentTarget.style.background = "rgba(6,182,212,0.08)")}
            >
              <Bot className="h-4 w-4" strokeWidth={1.5} />
              Try AI Advisor free
            </Link>
          </div>
        </div>

        {/* Stats strip */}
        <div
          className="reveal-up mt-16 grid grid-cols-2 sm:grid-cols-4 gap-0 rounded-xl overflow-hidden"
          style={{ border: "1px solid #141e35", animationDelay: "0.44s" }}
        >
          {[
            { n: "Case Law",    label: "Searchable Archive", sub: "SC, High Court & FSC judgments" },
            { n: "Grounded",    label: "In Pakistani Law",   sub: "PPC, CrPC, CPC & SCMR"          },
            { n: "Bilingual",   label: "Urdu + English",     sub: "Draft in either language"       },
            { n: "Court-Ready", label: "Every Draft",        sub: "Bail to writ petitions"         },
          ].map((stat, i) => (
            <div
              key={i}
              className="px-5 py-5"
              style={{
                background:   "rgba(11,15,26,0.6)",
                borderRight:  i < 3 ? "1px solid #141e35" : "none",
              }}
            >
              <p
                className="font-display text-[28px] font-extrabold tabular-nums leading-none"
                style={{ color: "#06b6d4" }}
              >
                {stat.n}
              </p>
              <p className="text-[13px] font-semibold mt-1" style={{ color: "#e2e8f0" }}>
                {stat.label}
              </p>
              <p className="text-[11px] mt-0.5" style={{ color: "#475569" }}>
                {stat.sub}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── § 02: Capabilities ── */}
      <section id="capabilities" className="px-6 sm:px-10 py-20 max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-12">
          <span className="text-[11px] font-mono font-bold tracking-[0.2em] uppercase" style={{ color: "#06b6d4" }}>
            § 02
          </span>
          <div className="flex-1 h-px" style={{ background: "#141e35" }} />
          <span className="text-[11px] font-mono uppercase tracking-[0.14em]" style={{ color: "#475569" }}>
            Capabilities
          </span>
        </div>

        <div className="mb-10">
          <h2 className="font-display text-[clamp(1.8rem,4vw,3rem)] font-extrabold leading-tight tracking-[-0.02em]" style={{ color: "#e2e8f0" }}>
            Everything a Pakistani<br />advocate needs.
          </h2>
          <p className="mt-3 text-[16px]" style={{ color: "#94a3b8" }}>
            Built from the ground up for Pakistan&apos;s courts, statutes, and legal traditions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {capabilities.map((cap, i) => {
            const Icon = cap.icon;
            return (
              <div
                key={i}
                className="p-5 rounded-xl"
                style={{
                  background: "#0b0f1a",
                  border:     "1px solid #141e35",
                }}
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center mb-4"
                  style={{ background: `${cap.color}18`, border: `1px solid ${cap.color}30` }}
                >
                  <Icon className="h-4.5 w-4.5" strokeWidth={1.5} style={{ color: cap.color }} />
                </div>
                <p className="text-[14px] font-bold mb-0.5" style={{ color: "#e2e8f0" }}>
                  {cap.title}
                </p>
                <p className="text-[11px] mb-2 text-urdu" style={{ color: "#475569" }}>
                  {cap.titleUrdu}
                </p>
                <p className="text-[13px] leading-relaxed" style={{ color: "#94a3b8" }}>
                  {cap.body}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── § 03: How It Works ── */}
      <section id="how-it-works" className="px-6 sm:px-10 py-20 max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-12">
          <span className="text-[11px] font-mono font-bold tracking-[0.2em] uppercase" style={{ color: "#06b6d4" }}>
            § 03
          </span>
          <div className="flex-1 h-px" style={{ background: "#141e35" }} />
          <span className="text-[11px] font-mono uppercase tracking-[0.14em]" style={{ color: "#475569" }}>
            Procedure
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              step: "01",
              title: "Register your chamber",
              body: "Create your account in under 2 minutes. No credit card. No bar council paperwork.",
            },
            {
              step: "02",
              title: "Select a document type",
              body: "Choose from 170+ templates: affidavits, bail applications, agreements, petitions.",
            },
            {
              step: "03",
              title: "AI drafts. You finalise.",
              body: "Enter matter details in Urdu or English. The AI generates a complete, court-ready draft.",
            },
          ].map((step) => (
            <div key={step.step} className="relative">
              <p
                className="font-display text-[52px] font-extrabold leading-none mb-4 tabular-nums"
                style={{ color: "#1e2d4a" }}
              >
                {step.step}
              </p>
              <p
                className="text-[16px] font-bold mb-2"
                style={{ color: "#e2e8f0" }}
              >
                {step.title}
              </p>
              <p className="text-[14px] leading-relaxed" style={{ color: "#94a3b8" }}>
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── § 05: Pricing ── */}
      <section id="pricing" className="px-6 sm:px-10 py-20 max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-12">
          <span className="text-[11px] font-mono font-bold tracking-[0.2em] uppercase" style={{ color: "#06b6d4" }}>
            § 04
          </span>
          <div className="flex-1 h-px" style={{ background: "#141e35" }} />
          <span className="text-[11px] font-mono uppercase tracking-[0.14em]" style={{ color: "#475569" }}>
            Tariff Schedule
          </span>
        </div>

        <h2 className="font-display text-[clamp(1.8rem,4vw,3rem)] font-extrabold leading-tight tracking-[-0.02em] mb-3" style={{ color: "#e2e8f0" }}>
          Simple pricing.<br />No hidden fees.
        </h2>
        <p className="text-[16px] mb-10" style={{ color: "#94a3b8" }}>
          All amounts in Pakistani Rupees. Cancel any time.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {pricingPlans.map((plan) => (
            <div
              key={plan.name}
              className="rounded-xl p-6 flex flex-col"
              style={{
                background: plan.popular ? "rgba(6,182,212,0.06)" : "#0b0f1a",
                border:     plan.popular ? "1px solid rgba(6,182,212,0.3)" : "1px solid #141e35",
              }}
            >
              {plan.popular && (
                <div className="mb-4">
                  <span
                    className="text-[10px] font-bold uppercase tracking-[0.14em] px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(6,182,212,0.15)", color: "#06b6d4", border: "1px solid rgba(6,182,212,0.3)" }}
                  >
                    Most Popular
                  </span>
                </div>
              )}
              <p className="text-[16px] font-bold mb-1" style={{ color: "#e2e8f0" }}>
                {plan.name}
              </p>
              <p
                className="font-display text-[32px] font-extrabold tabular-nums leading-none mb-1"
                style={{ color: plan.popular ? "#06b6d4" : "#e2e8f0" }}
              >
                {plan.price}
              </p>
              <p className="text-[12px] mb-6" style={{ color: "#475569" }}>
                {plan.sub}
              </p>
              <ul className="space-y-2.5 flex-1 mb-6">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-[13px]"
                      style={{ color: f.on ? "#94a3b8" : "#475569" }}>
                    <Check
                      className="h-3.5 w-3.5 mt-0.5 flex-shrink-0"
                      strokeWidth={2.5}
                      style={{ color: f.on ? "#06b6d4" : "#1e2d4a" }}
                    />
                    <span>{f.text}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={plan.ctaHref}
                className="w-full text-center py-2.5 rounded-md text-[13px] font-bold transition-all"
                style={{
                  background: plan.popular ? "#06b6d4" : "rgba(6,182,212,0.08)",
                  color:      plan.popular ? "#07090f"  : "#06b6d4",
                  border:     plan.popular ? "none"     : "1px solid rgba(6,182,212,0.2)",
                }}
                onMouseEnter={e => {
                  if (plan.popular) e.currentTarget.style.background = "#0891b2";
                  else e.currentTarget.style.background = "rgba(6,182,212,0.14)";
                }}
                onMouseLeave={e => {
                  if (plan.popular) e.currentTarget.style.background = "#06b6d4";
                  else e.currentTarget.style.background = "rgba(6,182,212,0.08)";
                }}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── § 06: CTA ── */}
      <section className="px-6 sm:px-10 py-20 max-w-6xl mx-auto">
        <div
          className="rounded-2xl px-8 sm:px-12 py-12 relative overflow-hidden"
          style={{ background: "#0b0f1a", border: "1px solid #141e35" }}
        >
          {/* Subtle background accent */}
          <div
            className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%)",
              transform: "translate(30%, -30%)",
            }}
          />

          <div className="relative z-10 max-w-2xl">
            <p className="text-[11px] font-mono uppercase tracking-[0.2em] mb-4" style={{ color: "#06b6d4" }}>
              § 05 · Start Today
            </p>
            <h2 className="font-display text-[clamp(1.8rem,4vw,3rem)] font-extrabold leading-tight tracking-[-0.02em] mb-4" style={{ color: "#e2e8f0" }}>
              Your legal practice,<br />amplified by AI.
            </h2>
            <p className="text-[16px] mb-8" style={{ color: "#94a3b8" }}>
              Join Pakistan&apos;s most forward-thinking advocates using TaqiAI to save time,
              draft faster, and research smarter.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/register"
                className="flex items-center gap-2 px-6 h-11 rounded-md text-[14px] font-bold transition-all"
                style={{ background: "#06b6d4", color: "#07090f" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#0891b2")}
                onMouseLeave={e => (e.currentTarget.style.background = "#06b6d4")}
              >
                Create free account
                <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </Link>
              <Link
                href="/login"
                className="flex items-center gap-2 px-6 h-11 rounded-md text-[14px] font-medium transition-all"
                style={{
                  background: "transparent",
                  border:     "1px solid rgba(6,182,212,0.25)",
                  color:      "#06b6d4",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(6,182,212,0.08)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                Login to your workspace
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        className="px-6 sm:px-10 py-12 border-t"
        style={{ borderColor: "#141e35" }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div
                  className="w-7 h-7 rounded-md flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)" }}
                >
                  <Scale className="h-3.5 w-3.5 text-white" strokeWidth={2} />
                </div>
                <span className="font-display text-[16px] font-extrabold tracking-tight" style={{ color: "#e2e8f0" }}>
                  TaqiAI
                </span>
              </div>
              <p className="text-[13px] leading-relaxed" style={{ color: "#475569" }}>
                Pakistan&apos;s first AI-powered legal operating system for advocates.
              </p>
            </div>
            {[
              {
                title: "Platform",
                links: [
                  { label: "AI Advisor",     href: "/ai-advisor"   },
                  { label: "Case Law",       href: "/case-law"     },
                  { label: "Draft Documents",href: "/affidavits"   },
                  { label: "Lawyer Diary",   href: "/lawyer-diary" },
                ],
              },
              {
                title: "Practice Areas",
                links: [
                  { label: "Criminal Law",  href: "/criminal-law"  },
                  { label: "Family Law",    href: "/family-law"    },
                  { label: "Property Law",  href: "/property-law"  },
                  { label: "Corporate Law", href: "/corporate-law" },
                ],
              },
              {
                title: "Company",
                links: [
                  { label: "Login",        href: "/login"                    },
                  { label: "Register",     href: "/register"                 },
                  { label: "Settings",     href: "/settings"                 },
                  { label: "Support",      href: "mailto:support@xyric.ai"   },
                ],
              },
            ].map((col) => (
              <div key={col.title}>
                <p
                  className="text-[11px] font-bold uppercase tracking-[0.14em] mb-3"
                  style={{ color: "#475569" }}
                >
                  {col.title}
                </p>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-[13px] transition-colors"
                        style={{ color: "#94a3b8" }}
                        onMouseEnter={e => (e.currentTarget.style.color = "#e2e8f0")}
                        onMouseLeave={e => (e.currentTarget.style.color = "#94a3b8")}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div
            className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 border-t"
            style={{ borderColor: "#141e35" }}
          >
            <p className="text-[12px] font-mono" style={{ color: "#475569" }}>
              © 2025 TaqiAI · Xyric.ai · All rights reserved
            </p>
            <p className="text-[12px] font-mono text-urdu" style={{ color: "#475569" }}>
              پاکستانی وکلاء کی خدمت میں
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
