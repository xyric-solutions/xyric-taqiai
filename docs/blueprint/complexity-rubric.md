# TaqiAI — Complexity / Risk Rubric

- Last updated: 2026-07-02
- Scored from: `architecture.md` (`locked`)

## Scores

| Dimension | 1 (low) | 3 (medium) | 5 (high) | Score | Evidence |
|-----------|---------|------------|----------|-------|----------|
| Scope size | one capability | several | many interdependent | **5** | 13 capabilities, ~48 routes, 12+ drafting categories |
| Dependency depth | flat | some ordering | deep chains | **4** | Advisor depends on judgment+statute retrieval; voice→analysis→draft; drafting depends on templates + suggestions |
| Uncertainty / novelty | well-trodden | partly novel | research-grade | **3** | CRUD/drafting well-trodden; RAG grounding + accuracy validation + Pakistani corpus building are partly novel |
| Integration count | self-contained | a few | many contracts | **4** | Gemini API, Python semantic service, Postgres, 2 SQLite corpora, PDF export |
| Blast radius | isolated/reversible | moderate coupling | touches core / hard to reverse | **4** | Auth + LLM gateway + persistence are shared; a bad citation/section is a professional-liability event |
| Context-fit | small surface | moderate | large surface / heavy existing-code | **5** | Live, large existing codebase; documenting + hardening means heavy reading of existing modules |
| **Total** | | | | **25 / 30** | High complexity → several phases; finer segments; front-load foundation, quarantine governance/hardening |

> **Context-fit = 5** independently forces **finer segments**: this is a large live codebase, so segments are cut per module/route cluster so no single build pass overflows context.

## Reading the score (guidance, not a rule)

Total 25/30 sits in the **≈23–30** band → several phases, finer segments, risky unknowns front-loaded or quarantined. The five build-shaping dimensions (scope 5, dependency 4, uncertainty 3, integration 4, blast radius 4 = 20) justify a **5-phase** cut. Context-fit 5 forces **module-granular segments** (one module/route-cluster per segment). Governance/hardening risk (confidence layer, security, validation) is **quarantined into Phase 5** so it does not block feature delivery but is explicitly tracked.

## Per-phase emphasis (folds in MoSCoW + stage-gate)

| Phase | MoSCoW emphasis | Risk this phase resolves | Exit gate (proceed / pivot / hold) |
|-------|-----------------|--------------------------|------------------------------------|
| Phase 1 — Foundation & Drafting | mostly Must | Can we auth users and produce a court-ready draft from a template? | Advocate drafts + exports a document end-to-end |
| Phase 2 — Legal Intelligence & Retrieval | Must/Should | Can we ground answers in real judgments + statutes with graceful fallback? | Advisor returns a grounded, cited answer; search degrades safely |
| Phase 3 — Intake & Multimodal | Should | Can we faithfully capture voice/photo/foreign-language input? | Photo/voice/foreign text → faithful digitised output feeding drafting |
| Phase 4 — Practice Management | Must | Can an advocate run their chamber (matters, hearings, fees) in-app? | Matter + hearing + diary + tax flows reliable; dashboard cause list correct |
| Phase 5 — Trust, Governance & Hardening | Should (governance) | Is the product provably accurate, secure, and production-safe? | Confidence envelope live; JWT fallback removed; scorecards + persistent rate limiting in place |

## How this shaped the cut

The high total (25) and especially the shared blast radius of auth/LLM/persistence pushed **Foundation first (Phase 1)** so every later capability builds on a stable spine. Retrieval (Phase 2) precedes multimodal intake (Phase 3) because the Advisor and search are the grounding backbone that intake feeds into. Practice management (Phase 4) is Must-heavy but low-novelty, so it sits after the AI core is proven. The audit's remaining P0/P1 governance items (AI confidence spec, JWT fallback removal, persistent rate limiting, accuracy scorecards) were **quarantined into Phase 5** as a dedicated hardening phase rather than scattered — the personalization gate confirmed treating governance as its own phase (not blocking features). No user answer overrode the dependency ordering.
