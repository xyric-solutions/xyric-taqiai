# TaqiAI — Traceability Matrix

- Last updated: 2026-07-02
- Chain: `vision-capability → prd-requirement → architecture-component → phase → segment → forgeflow-batch`

## Forward chain (one row per segment)

| Capability | Requirement | Component(s) | Phase | Segment | Batch (= Segment ID) |
|------------|-------------|--------------|-------|---------|----------------------|
| CAP-12 (foundation, cross-cutting) | R12.1 | C15, C18, C1 | Phase 1 | S1.1 — Auth & Accounts | S1.1 |
| CAP-1 | R1.1, R1.2 | C2, C16, C14, C19 | Phase 1 | S1.2 — Template Drafting Engine | S1.2 |
| CAP-11 | R11.1 | C12, C16 | Phase 1 | S1.3 — Field Suggestions | S1.3 |
| CAP-10 | R10.1 | C11, C16 | Phase 1 | S1.4 — Draft Editor | S1.4 |
| CAP-1, CAP-12 | R1.2, R12.1 | C14, C18 | Phase 1 | S1.5 — Document Vault & PDF Export | S1.5 |
| CAP-4 | R4.1 | C5, C18 | Phase 2 | S2.1 — Judgment Corpus & Keyword Search | S2.1 |
| CAP-4 | R4.2 | C6, C5 | Phase 2 | S2.2 — Semantic Search Service | S2.2 |
| CAP-4 | R4.3 | C5, C16 | Phase 2 | S2.3 — Judgment Intelligence (summary/ratio/verify/graph) | S2.3 |
| CAP-5 | R5.1 | C7, C18 | Phase 2 | S2.4 — Statute Corpus & Search | S2.4 |
| CAP-3 | R3.1, R3.2 | C4, C5, C7, C16, C18 | Phase 2 | S2.5 — AI Legal Advisor (RAG + sessions) | S2.5 |
| CAP-2 | R2.1 | C3, C16 | Phase 2 | S2.6 — Case Analysis (Reverse Mode) | S2.6 |
| CAP-8 | R8.1 | C9, C16 | Phase 3 | S3.1 — Document OCR / Copy-from-Photo | S3.1 |
| CAP-7 | R7.1 | C9, C16 | Phase 3 | S3.2 — Voice Intake & Transcription | S3.2 |
| CAP-7 | R7.2 | C3, C2, C16 | Phase 3 | S3.3 — Voice Case → Draft | S3.3 |
| CAP-9 | R9.1 | C10, C16 | Phase 3 | S3.4 — Legal Translation | S3.4 |
| CAP-12 | R12.1 | C13, C14, C18 | Phase 4 | S4.1 — Case/Matter Management (Chamber) | S4.1 |
| CAP-12 | R12.2 | C13, C18 | Phase 4 | S4.2 — Lawyer Diary | S4.2 |
| CAP-6 | R6.1 | C8 | Phase 4 | S4.3 — Tax & Fee Calculator | S4.3 |
| CAP-12 | R12.2 | C13, C1, C19 | Phase 4 | S4.4 — Dashboard & Cause List | S4.4 |
| CAP-13 | R13.1 | C17, C16 | Phase 5 | S5.1 — AI Confidence Envelope & Indicators | S5.1 |
| CAP-13 | R13.2 | C17 | Phase 5 | S5.2 — Accuracy Validation & Scorecards | S5.2 |
| CAP-13 (+ security NFR) | R13.1 | C15, C16, C18 | Phase 5 | S5.3 — Security Hardening | S5.3 |
| CAP-13 (+ observability NFR) | R13.2 | C1, C16, C18 | Phase 5 | S5.4 — Observability & Production Readiness | S5.4 |

## Orphan check (all must be empty)

| Check | Orphans found |
|-------|---------------|
| Requirements with no parent capability | none |
| Components with no parent requirement | none |
| Phases with no component | none |
| Segments with no phase | none |
| Segments with no requirement satisfied | none |
| Capabilities with no requirement (uncovered intent) | none |

## Coverage roll-up

| Level | Count | Covered | Gap |
|-------|-------|---------|-----|
| Capabilities | 13 | 13 | 0 |
| Requirements | 20 | 20 | 0 |
| Components | 19 | 19 | 0 |
| Segments | 23 | 23 | 0 |

> Note: C1/C15/C16/C18/C19 are cross-cutting foundation components delivered in Phase 1 and hardened in Phase 5; they appear in multiple segment rows by design (shared spine), not as duplicate deliveries.
