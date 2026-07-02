# TaqiAI — Phase Plan

- Status: `locked`
- Last updated: 2026-07-02
- Source architecture: `architecture.md` (`locked`)
- Rubric scores: see `complexity-rubric.md` (Total 25/30)
- Personalization gate: see `personalization-gate.md` → Phases

## Rubric summary (why five phases)

| Dimension | Score (1–5) | Note |
|-----------|-------------|------|
| Scope size | 5 | 13 capabilities |
| Dependency depth | 4 | advisor/voice chains |
| Uncertainty / novelty | 3 | RAG + PK corpus partly novel |
| Integration count | 4 | Gemini, semantic svc, Postgres, 2 SQLite corpora |
| Blast radius | 4 | shared auth/LLM/persistence; professional risk |
| Context-fit | 5 | large live codebase → finer segments |
| **Total** | **25** | high band → 5 phases, module-granular segments, governance quarantined |

## Phases (ordered)

### Phase 1 — Foundation & Drafting Core
- **Goal:** A user can register/authenticate and produce, edit, save, and export a court-ready draft from a verified template.
- **MoSCoW emphasis:** mostly Must.
- **Components delivered:** C1, C15, C16, C18, C19, C2, C12, C11, C14.
- **Requirements covered:** R1.1, R1.2, R10.1, R11.1 (+ cross-cutting auth/persistence/design).
- **Risk handled / deferred:** resolves the shared-spine blast radius (auth, LLM gateway, persistence, design system) first; defers grounding to Phase 2.
- **Exit condition (proceed / pivot / hold):** Advocate drafts across ≥1 category, edits it surgically, saves it, and exports a PDF. **Proceed.**
- **Depends on:** none.

### Phase 2 — Legal Intelligence & Retrieval
- **Goal:** Ground answers and search in real Pakistani judgments and statutes, with graceful degradation.
- **MoSCoW emphasis:** Must/Should.
- **Components delivered:** C5, C6, C7, C4, C3.
- **Requirements covered:** R4.1, R4.2, R4.3, R5.1, R3.1, R3.2, R2.1.
- **Risk handled / deferred:** proves the RAG grounding backbone and semantic→keyword fallback — the accuracy differentiator.
- **Exit condition:** Advisor returns a grounded, cited answer; judgment search runs and falls back safely when the semantic service is down; statute lookup never invents a section. **Proceed.**
- **Depends on:** Phase 1 (auth, LLM gateway, persistence).

### Phase 3 — Intake & Multimodal
- **Goal:** Faithfully capture spoken, photographed, and foreign-language input and feed it into drafting/analysis.
- **MoSCoW emphasis:** Should.
- **Components delivered:** C9, C10.
- **Requirements covered:** R7.1, R7.2, R8.1, R9.1.
- **Risk handled / deferred:** resolves faithful-capture risk (verbatim transcription, strict OCR, non-corrupting translation).
- **Exit condition:** photo/voice/foreign-language input produces faithful digitised output that flows into case analysis (C3) and drafting (C2). **Proceed.**
- **Depends on:** Phase 1 (drafting/LLM), Phase 2 (case analysis grounding).

### Phase 4 — Practice Management
- **Goal:** An advocate can run their chamber: matters, hearings, diary, dashboard cause list, and deterministic fee calculation.
- **MoSCoW emphasis:** mostly Must.
- **Components delivered:** C13, C8 (+ dashboard views on C1/C19).
- **Requirements covered:** R12.1, R12.2, R6.1.
- **Risk handled / deferred:** low-novelty CRUD + deterministic tax engine; consolidates LegalCase → Matter (legacy retired/redirected).
- **Exit condition:** matter + hearing + diary CRUD reliable; dashboard next-hearing hero + unified cause list correct; tax calculator numbers reproducible by hand. **Proceed.**
- **Depends on:** Phase 1 (auth, persistence, document vault).

### Phase 5 — Trust, Governance & Hardening
- **Goal:** Make the product provably accurate, secure, and production-ready (closes the Xyric-framework audit P0/P1 items).
- **MoSCoW emphasis:** Should (governance-critical).
- **Components delivered:** C17 (+ hardening across C15, C16, C18, C1).
- **Requirements covered:** R13.1, R13.2 (+ NFR security/rate-limit/observability).
- **Risk handled / deferred:** AI confidence contract, JWT fallback removal, persistent rate limiting, security headers, error normalisation, accuracy scorecards.
- **Exit condition:** confidence envelope + indicators live on AI outputs; no fallback JWT secret; persistent rate limiter; CSP/HSTS; scorecards recorded. **Proceed to launch confidence.**
- **Depends on:** Phases 1–4 (hardens the whole surface); quarantined so it never blocks feature delivery.

## Sequencing rationale

Foundation leads because auth, the LLM gateway, persistence, and the design system are the shared blast-radius spine every later capability sits on. Retrieval (Phase 2) precedes intake (Phase 3) because the Advisor and judgment/statute search are the grounding backbone that voice/OCR/translation feed into. Practice management (Phase 4) is Must-heavy but low-novelty, so it follows the proven AI core. Governance/hardening is a **dedicated final phase** — the personalization gate chose to quarantine the audit's P0/P1 items into Phase 5 rather than scatter them, so trust work is tracked as first-class without blocking feature phases. No phase depends on a later phase.

## Build order & parallelization (the speed lever)

| Phase | Parallel-safe groups (build concurrently) | Serial chain (must build in order) | Critical path |
|-------|-------------------------------------------|------------------------------------|---------------|
| Phase 1 | {S1.1 auth}, then {S1.2 drafting, S1.5 vault} | S1.3 suggestions & S1.4 editor after S1.2 | S1.1 → S1.2 → S1.4 |
| Phase 2 | {S2.1 judgment DB, S2.4 statute corpus, S2.6 case analysis} | S2.2 semantic after S2.1; S2.3 after S2.1; S2.5 advisor after S2.1+S2.4 | S2.1 → S2.5 |
| Phase 3 | {S3.1 OCR, S3.4 translation} | S3.3 voice-case after S3.2 + Phase-2 analysis | S3.2 → S3.3 |
| Phase 4 | {S4.1 matters, S4.3 tax} | S4.2 diary & S4.4 dashboard after S4.1 | S4.1 → S4.4 |
| Phase 5 | {S5.1 confidence, S5.3 security, S5.4 observability} | S5.2 scorecards after S5.1 | S5.1 → S5.2 |

## Coverage check (Architecture ↔ Phases)

| Component | Phase |
|-----------|-------|
| C1, C15, C16, C18, C19, C2, C11, C12, C14 | Phase 1 |
| C3, C4, C5, C6, C7 | Phase 2 |
| C9, C10 | Phase 3 |
| C8, C13 | Phase 4 |
| C17 (+ hardening of C15/C16/C18/C1) | Phase 5 |

## Validation gate (before `locked`)

- [x] Every architecture component lands in exactly one phase (C1/C15/C16/C18/C19 delivered in Phase 1, hardened in Phase 5 — no re-delivery).
- [x] No phase depends on a later phase; dependencies respected.
- [x] Each phase has a goal, MoSCoW emphasis, and an exit condition.
- [x] Build order & parallelization filled (parallel-safe groups + critical path).
- [x] Rubric scored; phase count justified by the score.
- [x] Personalization gate (ambition/sequencing) recorded in `personalization-gate.md`.
- [x] `blueprint-progress.md` shows Phases = `locked`; `next-steps-handoff.md` points to Segments.
