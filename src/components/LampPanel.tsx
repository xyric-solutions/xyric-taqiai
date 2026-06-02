"use client";

import { useState } from "react";
import { Scale, Check } from "lucide-react";

const POINTS = [
  "Grounded in PPC, CrPC, CPC & SCMR",
  "Court judgments, instantly searchable",
  "Drafts natively in Urdu and English",
  "Bail applications to writ petitions, court-ready",
];

/**
 * Auth branding panel with an interactive pull-cord lamp.
 * Lamp OFF → the content sits in darkness (barely visible).
 * Pull the cord → the light floods in and the content is revealed.
 */
export default function LampPanel() {
  const [on, setOn] = useState(false);
  const [pulling, setPulling] = useState(false);

  const pull = () => {
    setPulling(true);
    setOn((v) => !v);
    window.setTimeout(() => setPulling(false), 400);
  };

  return (
    <div
      className="hidden lg:flex lg:w-1/2 p-12 flex-col relative overflow-hidden"
      style={{ background: "#07090f", borderRight: "1px solid #141e35" }}
    >
      {/* Light flood (only visible when the lamp is on) */}
      <div className={`lamp-light ${on ? "on" : ""}`} aria-hidden="true" />

      {/* The lamp rig: ceiling mount + bulb + pull cord */}
      <div className={`lamp-rig ${on ? "on" : ""}`}>
        <span className="lamp-mount" aria-hidden="true" />
        <span className="lamp-bulb" aria-hidden="true" />
        <button
          type="button"
          onClick={pull}
          aria-pressed={on}
          aria-label={on ? "Turn lamp off" : "Turn lamp on"}
          className={`lamp-cord ${pulling ? "pull" : ""}`}
          title="Pull the cord"
        >
          <span className="lamp-cord-line" aria-hidden="true" />
          <span className="lamp-cord-knob" aria-hidden="true" />
        </button>
      </div>

      {/* Content stage: dim in the dark, revealed when the lamp turns on */}
      <div className={`lamp-stage relative z-[2] flex-1 flex flex-col justify-between ${on ? "lit" : ""}`}>
        {/* Logo */}
        <div>
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)", boxShadow: "0 0 16px rgba(6,182,212,0.25)" }}
            >
              <Scale className="h-5 w-5 text-white" strokeWidth={2} />
            </div>
            <div>
              <h1 className="font-display text-xl font-extrabold tracking-tight" style={{ color: "#e2e8f0" }}>TaqiAI</h1>
              <p className="text-sm" style={{ color: "#475569" }}>Pakistani Law Assistant</p>
            </div>
          </div>
        </div>

        {/* Headline + points */}
        <div>
          <p className="text-[11px] font-mono uppercase tracking-[0.2em] mb-5" style={{ color: "#475569" }}>
            In re: Pakistan&apos;s Legal Profession
          </p>
          <h2
            className="font-display font-extrabold leading-[1.05] tracking-[-0.025em] mb-4"
            style={{ color: "#e2e8f0", fontSize: "clamp(2.75rem, 5.2vw, 4.5rem)" }}
          >
            AI that understands<br /><span style={{ color: "#06b6d4" }}>Pakistani courts.</span>
          </h2>
          <p className="text-lg max-w-md leading-relaxed" style={{ color: "#94a3b8" }}>
            Draft documents, research case law, and manage your practice in Urdu and English.
          </p>
          <ul className="mt-10 space-y-3">
            {POINTS.map((t) => (
              <li key={t} className="flex items-center gap-3 text-[15px]" style={{ color: "#94a3b8" }}>
                <Check className="h-4 w-4 flex-shrink-0" strokeWidth={2.5} style={{ color: "#06b6d4" }} />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Urdu line */}
        <p className="text-sm text-urdu" style={{ color: "#475569" }} dir="rtl">
          پاکستانی وکلاء کا اپنا AI قانونی نظام
        </p>
      </div>
    </div>
  );
}
