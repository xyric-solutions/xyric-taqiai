# TaqiAI — Blueprint Documentation Set

This folder is the complete **Blueprint**-standard documentation for **TaqiAI** (the Pakistani legal-AI platform in this repo, deployed as `xyric-solutions/xyric-taqiai`). It follows the Xyric **Blueprint** method: an AI-first documentation hierarchy — **Vision → PRD → Architecture → Phases → Segments** — where each stage is drafted with best practice, personalized at a gate, and locked before the next begins. Every segment traces up the chain to a vision capability, and each is written in Forgeflow-batch shape so a build flow can pick it up 1:1.

> TaqiAI is already built and live (13 modules). Phases 1–4 document the shipped product; **Phase 5** (Trust, Governance & Hardening) is the remaining forward work identified by the 2026-06-30 Xyric-framework audit.

## The spine
**Vision → PRD → Architecture → Phases → Segments — draft first, personalize the gate, lock, hand off.**

## File map

| Path | What it is |
|------|------------|
| `vision.md` | Stage 1 — intent, 13 capabilities, principles, quality bar, out-of-scope, risks |
| `prd.md` | Stage 2 — 20 requirements (BDD + metrics + MoSCoW), 100% capability coverage |
| `architecture.md` | Stage 3 — 19 components, data models, integrations, binding standards, NFRs, 7 ADRs |
| `complexity-rubric.md` | The 25/30 score that drove a 5-phase, module-granular cut |
| `phase-plan.md` | Stage 4 — 5 ordered phases with goals, exit conditions, build order |
| `segments/` | Stage 5 — 23 segment files (S1.1 … S5.4), Forgeflow-batch shape |
| `traceability-matrix.md` | `capability → requirement → component → phase → segment → batch`, orphan-checked |
| `personalization-gate.md` | Every gated decision, its AI default, and the answer |
| `blueprint-progress.md` | The durable progress ledger (stage/phase/segment/gate status) |
| `next-steps-handoff.md` | Cold-start handoff — one active next action (build S5.1) |

## The traceability chain
```
vision-capability → prd-requirement → architecture-component → phase → segment → forgeflow-batch
   CAP-1..13            R1.1..R13.2          C1..C19          P1..P5   S1.1..S5.4    (= segment ID)
```

## Non-negotiables
1. Draft before you ask. 2. Personalization-only gates. 3. State the default. 4. Lock to advance. 5. Rubric-derived cuts. 6. Segment = batch. 7. Trace everything. 8. Persist state in the ledgers, not chat.

## Provenance
Produced against the Xyric `WORKFLOW/blueprint` standard (see `xyric-frameworks-main/WORKFLOW/blueprint`). Supersedes the older Epic/Story/Task docs in `xyric-wiki/PRODUCTS/taqiai/`. Reference corpora: app data on Railway Postgres (Prisma); judgments/statutes as read-only SQLite.
