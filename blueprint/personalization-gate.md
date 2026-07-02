# TaqiAI — Personalization Gate Log

- Last updated: 2026-07-02
- Gate status legend: `pending` · `answered` · `accepted-default` · `locked`

## Vision — status: locked
| # | Decision | AI default + reason | Alternatives | User answer |
|---|----------|---------------------|--------------|-------------|
| 1 | Lead persona | **Practising Advocate** (reason: highest-value daily workload; product is a chamber's working surface) | Junior/clerk-led; student-led | default |
| 2 | v1 ambition | **Broad, all 13 capabilities** (reason: product is already built & live; documenting the real surface, not a narrower MVP) | Focused single-capability | default (product is live) |
| 3 | Product stance | **"Grounding over fluency" + "verified templates over free generation"** (reason: professional/court risk demands accuracy over cleverness) | "Speed over caution" | default |
| 4 | Monetization in vision | **Exclude** (reason: Blueprint vision is intent-only) | Include pricing | default |

**Applied silently (best practice — not asked):** anti-hallucination via RAG, refusal behaviour, WCAG AA, secure defaults, bilingual/RTL correctness, graceful degradation.

## PRD — status: locked
| # | Decision | AI default + reason | Alternatives | User answer |
|---|----------|---------------------|--------------|-------------|
| 1 | MoSCoW cut for v1 | **Must = drafting, case analysis, advisor, judgment/statute search, tax, editor, matter/diary; Should = semantic, voice, OCR, translation, confidence; Could = field suggestions** (reason: matches shipped reality + accuracy backbone) | Push confidence/validation to Must | default |
| 2 | Success-metric targets | **Citation >90%, hallucination <10%, completeness >80%, structure 100%** (reason: inherited product accuracy targets) | Stricter/looser | default |
| 3 | Persona priority order | **Advocate > Associate > Student** | Student-first (education play) | default |

**Applied silently (best practice — not asked):** input validation, error handling, accessibility baseline, security defaults, HTML sanitisation, idempotent CRUD.

## Architecture — status: locked
| # | Decision | AI default + reason | Alternatives | User answer |
|---|----------|---------------------|--------------|-------------|
| 1 | App DB (ADR-3) | **Postgres via Prisma for app data; SQLite read-only for reference corpora** (reason: migration already complete; corpora portable/free) | All-Postgres corpora | default (matches code) |
| 2 | LLM strategy (ADR-2) | **Direct Gemini + model fallback chain** (reason: cost/quality fit today) | Multi-provider abstraction | default |
| 3 | Corpus/search (ADR-4) | **SQLite RO + Python semantic svc with keyword fallback** (reason: free, degrades gracefully) | External search service | default |
| 4 | Auth (ADR-5) | **JWT now; remove fallback secret in Phase 5** (reason: ship now, harden in governance phase) | Managed auth now | default |
| 5 | AI confidence contract (ADR-7) | **Standard envelope + confidence dimensions + UI indicators** (reason: accuracy-first must be provable) | Per-route ad hoc | default (Phase 5) |

**Applied silently (best practice — not asked):** observability baseline, retries/fallback, secure defaults, zod validation, dompurify sanitisation, migration/rollback notes.

## Phases — status: locked
| # | Decision | AI default + reason | Alternatives | User answer |
|---|----------|---------------------|--------------|-------------|
| 1 | Phase count | **5 phases** (reason: rubric total 25/30 → high band) | 3–4 phases | default |
| 2 | Governance placement | **Quarantine audit P0/P1 (confidence, security, validation) into a dedicated Phase 5** (reason: track trust as first-class without blocking feature phases) | Scatter governance into each phase | default |
| 3 | Sequencing | **Foundation → Retrieval → Intake → Practice Mgmt → Governance** (reason: shared spine first, grounding before intake) | Practice-mgmt first | default |

## Segments — status: locked
| # | Decision | AI default + reason | Alternatives | User answer |
|---|----------|---------------------|--------------|-------------|
| 1 | Segment granularity | **Module-granular (23 segments), one file each** (reason: context-fit 5 forces finer segments; large live codebase) | Consolidated segment plan only | **User chose: full Segment Plan + one file per segment** |
| 2 | Save location | **`ai-legal-system/blueprint/`** (the xyric-solutions/xyric-taqiai repo) | wiki `PRODUCTS/taqiai/blueprint`; project-root `/blueprint` | **User chose: xyric-solutions xyric-taqiai (app repo)** |
| 3 | First proving-ground build | **S1.2 Template Drafting Engine** (reason: highest-value, exercises drafting+LLM+vault spine) | S2.5 Advisor | default |

## Gate hygiene check (run at every stage)
- [x] No question here could be answered by best practice (best-practice items moved to "Applied silently").
- [x] Every decision has a stated default + reason.
- [x] Question count is small — the few that genuinely shape *this* product (2 of them answered live by the user for Segments).
