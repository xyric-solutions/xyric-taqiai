"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Menu, X, Scale } from "lucide-react";

export default function LandingPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  const navLinks = [
    { label: "Platform", href: "#platform" },
    { label: "Solutions", href: "#solutions" },
    { label: "Customers", href: "#customers" },
    { label: "Security", href: "#security" },
    { label: "Resources", href: "#resources" },
    { label: "About", href: "#about" },
  ];

  const lawFirms = [
    "SUPREME COURT",
    "BAR COUNCIL",
    "LAHORE HIGH COURT",
    "SINDH HIGH COURT",
    "ISLAMABAD HIGH COURT",
    "FEDERAL COURT",
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      {/* ============================================
          HERO SECTION with VIDEO BACKGROUND
          ============================================ */}
      <section className="relative min-h-screen w-full overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
            poster="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxIDEiPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAiIHkxPSIwIiB4Mj0iMSIgeTI9IjEiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiMxYTFhMmUiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMwYTBhMTUiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJ1cmwoI2cpIi8+PC9zdmc+"
          >
            {/* Lawyer/Office video sources - multiple fallbacks */}
            <source src="https://cdn.pixabay.com/video/2023/11/14/188999-884574542_large.mp4" type="video/mp4" />
            <source src="https://cdn.pixabay.com/video/2022/10/05/133576-757132203_large.mp4" type="video/mp4" />
            <source src="https://cdn.coverr.co/videos/coverr-lawyer-in-office-8854/1080p.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Dark Overlay - Elegant gradient */}
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/90 via-black/60 to-black/30" />
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/40 via-transparent to-black/70" />

        {/* ============================================
            NAVIGATION
            ============================================ */}
        <nav className="relative z-30 px-6 sm:px-10 py-5">
          <div className="max-w-[1400px] mx-auto flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center">
                <Scale className="h-5 w-5 text-slate-900" strokeWidth={2.2} />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">Advocate</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="px-4 py-2 text-sm font-medium text-white/80 hover:text-white flex items-center gap-1"
                >
                  {link.label}
                  <svg className="w-3 h-3 text-white/40" fill="none" viewBox="0 0 12 12">
                    <path d="M3 5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              ))}
            </div>

            {/* Login + Get Started */}
            <div className="flex items-center gap-3">
              <Link href="/login" className="hidden sm:inline-flex px-4 py-2 text-sm font-medium text-white/90 hover:text-white">
                Login
              </Link>
              <Link
                href="/register"
                className="px-4 sm:px-5 py-2 text-sm font-semibold bg-white text-slate-900 rounded-md hover:bg-white/90"
              >
                Get Started
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-white"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden absolute top-full left-0 right-0 bg-slate-950/95 backdrop-blur-lg border-t border-white/10 p-4">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-sm font-medium text-white/80 hover:text-white hover:bg-white/5 rounded-lg"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-sm font-medium text-white/80 hover:text-white hover:bg-white/5 rounded-lg mt-2 border-t border-white/10 pt-4"
              >
                Login
              </Link>
            </div>
          )}
        </nav>

        {/* ============================================
            HERO CONTENT
            ============================================ */}
        <div className="relative z-20 max-w-[1400px] mx-auto px-6 sm:px-10 pt-16 sm:pt-24 lg:pt-32 pb-32">
          <div className="max-w-2xl">
            {/* Big Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[0.95] tracking-tight text-white mb-6">
              Practice
              <br />
              Made Perfect
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl text-white/80 leading-relaxed max-w-xl mb-10 font-light">
              Pakistan&apos;s top lawyers and advocates trust AI Legal Intelligence to elevate
              their practice and navigate complex legal matters with precision.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/register"
                className="group inline-flex items-center gap-2 px-6 py-3.5 bg-white text-slate-900 rounded-md font-semibold text-sm hover:bg-white/90"
              >
                Request a Demo
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-md font-semibold text-sm hover:bg-white/15"
              >
                Start Now
              </Link>
            </div>
          </div>
        </div>

        {/* ============================================
            BOTTOM BAR - Trusted By Logos
            ============================================ */}
        <div className="absolute bottom-0 left-0 right-0 z-20 bg-black/50 backdrop-blur-sm border-t border-white/10">
          <div className="max-w-[1400px] mx-auto px-6 sm:px-10 py-5">
            <div className="flex items-center gap-8 overflow-x-auto scrollbar-hide">
              <div className="flex-shrink-0">
                <span className="text-[10px] font-bold tracking-[0.2em] text-white/50 uppercase">Trusted By</span>
              </div>
              <div className="flex items-center gap-6 sm:gap-10 overflow-hidden">
                {lawFirms.map((firm) => (
                  <span
                    key={firm}
                    className="text-xs font-bold tracking-widest text-white/60 whitespace-nowrap"
                  >
                    {firm}
                  </span>
                ))}
              </div>
              <div className="flex-shrink-0 ml-auto">
                <Link
                  href="#customers"
                  className="text-xs font-semibold text-white/90 hover:text-white bg-white/10 border border-white/20 px-4 py-2 rounded-md whitespace-nowrap"
                >
                  Our Customers
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          FEATURES SECTION
          ============================================ */}
      <section className="relative py-24 sm:py-32 px-6 sm:px-10 bg-slate-950">
        <div className="max-w-[1400px] mx-auto">
          <div className="max-w-3xl mb-20">
            <span className="text-xs font-bold tracking-widest text-white/50 uppercase">The Platform</span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mt-4 leading-[1.05] tracking-tight">
              Built for Pakistan&apos;s
              <br />
              most demanding lawyers.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5 border border-white/5">
            {[
              { num: "01", title: "Document Drafting", desc: "106+ templates for affidavits, agreements, petitions and court documents. Ready to file." },
              { num: "02", title: "AI Legal Advisor", desc: "Instant research on PPC, CrPC, CPC, Family Laws, Property Laws with cited sections." },
              { num: "03", title: "Court Case Assistant", desc: "Draft petitions, applications, bail applications, and legal notices with context-aware AI." },
              { num: "04", title: "Tax Calculator", desc: "FBR, stamp duty, withholding tax, CVT, and capital gain tax calculations for properties." },
              { num: "05", title: "Urdu + English", desc: "Bilingual document generation. Translate legal documents between Urdu, English, and Arabic." },
              { num: "06", title: "Image OCR", desc: "Upload photo of any legal document - AI extracts and retypes with perfect formatting." },
            ].map((feat) => (
              <div
                key={feat.num}
                className="group bg-slate-950 p-10 hover:bg-slate-900"
              >
                <span className="text-xs font-mono text-white/40">{feat.num}</span>
                <h3 className="text-xl font-semibold text-white mt-6 mb-3">{feat.title}</h3>
                <p className="text-sm text-white/60 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          STATS SECTION
          ============================================ */}
      <section className="relative py-24 px-6 sm:px-10 bg-black border-y border-white/10">
        <div className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {[
            { value: "106+", label: "Legal Templates" },
            { value: "8", label: "Legal Areas" },
            { value: "3", label: "Languages" },
            { value: "24/7", label: "AI Available" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-xs sm:text-sm text-white/60 font-medium tracking-wide uppercase">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================
          CTA SECTION
          ============================================ */}
      <section className="relative py-24 sm:py-32 px-6 sm:px-10 bg-slate-950">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight leading-[1.05]">
            Ready to elevate
            <br />
            your practice?
          </h2>
          <p className="text-white/70 text-lg mb-10 max-w-xl mx-auto font-light">
            Join Pakistani lawyers using AI to draft faster, research smarter, and serve clients better.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-900 rounded-md font-semibold hover:bg-white/90"
            >
              Request a Demo <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-8 py-4 bg-transparent border border-white/20 text-white rounded-md font-semibold hover:bg-white/5"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================
          FOOTER
          ============================================ */}
      <footer className="bg-black border-t border-white/10 py-12 px-6 sm:px-10">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                <Scale className="h-4 w-4 text-slate-900" strokeWidth={2.2} />
              </div>
              <span className="text-lg font-bold text-white">Advocate</span>
            </div>

            <div className="flex flex-wrap gap-6 text-xs text-white/50">
              <Link href="/login" className="hover:text-white">Login</Link>
              <Link href="/register" className="hover:text-white">Register</Link>
              <span>© {new Date().getFullYear()} AI Legal Intelligence</span>
            </div>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
