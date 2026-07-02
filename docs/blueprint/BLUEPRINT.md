# Blueprint

**A reusable, AI-first method for turning an idea into a complete, personalized documentation set — before any code is written — and handing it cleanly to the build flow.**

> One-line thesis: *The AI already carries best practice, so don't make a human re-teach it. Let the AI draft each document, then ask the human only the questions where taste, strategy, or risk make more than one answer correct. Walk five stages — Vision → PRD → Architecture → Phases → Segments — gating each on personalization only, until every segment is a buildable, traceable unit the build flow can pick up one-for-one.*

This document has three parts:

- **Part A — The Method** (the five stages + the personalization gate): the operating procedure for any AI-first documentation run.
- **Part B — A Worked Example** (placeholder-tokened): the same five stages instantiated on a generic product, showing the shape of every artifact.
- **Part C — Mechanics & Contracts**: the complexity/risk rubric, the gate filter, phase/segment derivation, the traceability chain, the two ledgers, and the **Forgeflow handoff contract**.

Beside this guide sit three things:
- **`templates/`** — copy-paste **blank** scaffolds (with `<PLACEHOLDER>` tokens) for every artifact named here.
- **`starter/`** — a **working**, ready-to-drop dual-harness payload: self-activating `CLAUDE.md`/`AGENTS.md`, Claude commands, Codex skills, shared `runbooks/`, and the reused `research-first` skill.
- **`verify/portability-check.mjs`** — scans a Blueprint instance for missing stage docs, open gates, placeholders, a malformed Segment Plan, a missing `BUILD_READY` marker, and orphan traceability rows.

To document a new product, copy the whole folder as one unit, activate the `starter/` payload at the project root (`cp -R blueprint/starter/. .`), then run `/blueprint-draft-vision` and walk the stages in order. See `START-HERE.md` (one screen) and `README.md` for the quickstart.

## Where Blueprint sits

```
  BLUEPRINT  (documentation flow — this method)        FORGEFLOW  (development flow)
  ┌──────────────────────────────────────────┐        ┌─────────────────────────────┐
  │ Vision → PRD → Architecture               │        │ start-batch → build → verify│
  │        → Phases → Segments  ──────────────┼──▶─────┼─ → close-batch → handoff    │
  │ (personalization gate at every stage)     │ Segment│ (segment ID = batch ID)     │
  └──────────────────────────────────────────┘  Plan   └─────────────────────────────┘
```

Blueprint produces the spec set; Forgeflow builds it. The bridge is **one segment = one Forgeflow batch**: Blueprint's terminal Segment Plan is field-compatible with `forgeflow/templates/batch-template.md`, so Forgeflow's `start-batch` consumes it with no translation step.

## What this folder ships and expects you to fill

| | What |
|---|---|
| **Assumes** (you already have) | Claude Code and/or Codex + git. Optionally, the sibling `forgeflow/` folder for the build phase. Nothing else. |
| **Ships** (travels in this folder) | this guide (`BLUEPRINT.md`); blank artifact **templates** (`templates/`); a **working dual-harness payload** (`starter/`); the **portability self-check** (`verify/`). |
| **You fill** (per product) | the five stage docs (vision, prd, architecture, phase-plan, segments), the personalization-gate records, the complexity-rubric scores, the traceability matrix, and the two ledgers (`blueprint-progress.md`, `next-steps-handoff.md`). |

Nothing dangles: every artifact this guide names is either a **blank template** in `templates/` you fill a copy of, or a **working runbook/skill** in `starter/`.

---

# Part A — The Method

Blueprint is **five stages** run in strict order, each wrapped in the **same four-move loop**. The five stages are the documentation hierarchy that replaces the traditional Epic/Story/Task breakdown; the four-move loop is how each stage stays fast, personal, and high-quality.

## The principle that makes Blueprint different

A human team needs best-practice questions answered because individual engineers vary in what they know. **An AI-first team does not.** The AI carries best practice in its skills and applies it by default. So Blueprint inverts the old "interview the user at every step" pattern:

> **The AI drafts the full document itself using best practice. Then it asks the user *only personalization questions* — the decisions where more than one answer is correct and the right one depends on the user's preference, strategy, taste, or risk appetite. Everything best practice settles, the AI just does — and states what it did.**

This is what the user asked for: questions that are *personal*, not generic; that *personalize the vision* rather than re-derive it. It makes the flow **faster** (far fewer questions) and **higher quality** (the AI's full draft is the floor, not a blank page the human fills in).

## The four-move loop (runs at every stage)

```
  1. DRAFT      → research + write the full document with best practice. No questions yet.
  2. GATE       → extract only personalization decisions; present each with the AI's default + reason; ask.
  3. APPLY      → fold the user's answers (or "accept defaults") back into the document; re-validate.
  4. LOCK       → record the gate Q/A; mark the stage locked in the ledger. The next stage unlocks.
```

**Move 1 — Draft.** Ground the work (use the `research-first` skill for anything strategic or architectural — 3+ cited, recent sources, never assumptions). Write the *entire* document to the template's structure, applying best practice silently. Produce a real draft, not an outline.

**Move 2 — Gate (personalization-only).** This is the heart. Walk the draft and extract the decision points that qualify as **personalization** (see the filter below). For each, write: the decision, the AI's **recommended default + one-line reason**, and the real alternatives. Present them as one numbered list and **WAIT** for the user. The user answers, or says "accept defaults" — both are complete answers.

> **The personalization filter — a question is allowed only if BOTH are true:**
> 1. **More than one answer is defensible under best practice** (it is genuinely open), **and**
> 2. **The right answer depends on preference / strategy / taste / brand / risk appetite — not on correctness.**
>
> If best practice settles the answer, the AI **applies it silently and notes it** — it does not ask. Examples that *qualify*: target persona priority, scope ambition for v1, tone/brand stance, build-vs-buy risk appetite, which capability leads. Examples that *do not* (AI just does them): input validation, error handling, test coverage, accessibility baseline, secure defaults, idempotency, schema normalization.

**Move 3 — Apply.** Fold answers into the document. Re-run the stage's validation checklist (in the template). If anything the user chose changes downstream assumptions, note it so later stages inherit it.

**Move 4 — Lock.** Record the gate in `personalization-gate.md` (decision, default, chosen answer). Set the stage `locked` in `blueprint-progress.md`. Update `next-steps-handoff.md` with the single next action. **A stage cannot begin until the previous stage is `locked`** — that is the quality ratchet that stops drift from compounding.

## The five stages

### Stage 1 — Vision (`vision.md`)
**Owns the intent.** The bigger picture: the problem, the capabilities, the target output, the principles. *What* and *why*, deliberately not *how* and not business/monetization detail. The Vision states the capabilities the product must have — these become the spine the whole chain traces back to.

**Personalization gate examples:** which user segment leads; how ambitious v1 is; the product's stance/principles ("X over Y"); what is explicitly out of scope.

### Stage 2 — PRD (`prd.md`)
**Owns how the vision becomes achievable.** Turns each Vision capability into concrete, testable requirements: personas, features with acceptance criteria, success metrics, and MoSCoW scope. Every requirement traces up to a Vision capability; coverage is 100% (no capability left unrequired, no requirement without a parent capability).

**Personalization gate examples:** MoSCoW cut for v1 (what's Must vs Should); which metrics define success; persona priority order; depth-vs-breadth for the first release.

### Stage 3 — Architecture (`architecture.md`)
**Owns the design of the possible functionalities.** Given the PRD, design the components, data models, integrations, and cross-cutting concerns that make the requirements buildable. Flag the decisions that deserve an ADR (Architecture Decision Record). Each component traces up to one or more PRD requirements.

**Personalization gate examples:** build vs buy for a given capability; stack/platform preference where several are valid; hosting/data-residency stance; how much to invest now vs defer (risk appetite on technical debt).

### Stage 4 — Phases (`phase-plan.md`)
**Owns the ordered split of the work.** The AI scores the architecture on the **complexity/risk rubric** (Part C) and uses its judgment to cut the work into ordered **phases**. No fixed number — phases follow complexity, dependency, and risk. Each phase has a goal, an exit condition, and the architecture components it delivers.

**Personalization gate examples:** what ships in the first phase vs later (ambition/risk trade-off); whether to front-load a risky unknown or a quick win; any hard sequencing the user requires for business reasons.

### Stage 5 — Segments (`segments/` + the Segment Plan)
**Owns the buildable units.** Within each phase, the AI cuts **segments** — each one independently **buildable + verifiable in a single build pass**, and **traceable** up the chain. Segment count and size are AI-derived from the rubric, not a template. Each segment is written in **Forgeflow-batch shape** (`templates/segment.md`, field-compatible with `forgeflow/templates/batch-template.md`). The collected segments are the **Segment Plan** — the artifact Forgeflow builds from.

**Personalization gate examples:** segment ordering preference within a phase; which segment is the proving-ground first build; any segment the user wants split finer or held back.

After Stage 5 locks, run the **handoff** (Part C): emit the `BUILD_READY` marker, finalize the Segment Plan, and hand the batch list to Forgeflow.

---

# Part B — A Worked Example (placeholder-tokened)

This walks the five stages on a generic product, `<PRODUCT_NAME>`. Replace every `<TOKEN>`; the shapes are real, the values are illustrative. (In a live run these artifacts are *filled copies* of the `templates/` scaffolds, written under your product's docs folder, e.g. `<DOCS_ROOT>/<PRODUCT_NAME>/`.)

### Stage 1 — Vision
The AI researches the space (via `research-first`) and drafts `vision.md`: executive summary, the problem, the capabilities `<CAP-1 … CAP-N>`, target users, principles, the target output. **Draft done — then the gate:**

```
Personalization questions for <PRODUCT_NAME> — Vision
1. Lead segment — Default: <SEGMENT_A> (reason: <why>). Alternatives: <SEGMENT_B>, <SEGMENT_C>.
2. v1 ambition — Default: <focused single capability CAP-1> (reason: de-risk). Alt: <broad multi-capability>.
3. Product stance — Default: "<X over Y>" (reason: <why>). Alt: "<W over Z>".
Reply with numbers, or "accept defaults".
```

User answers → AI applies → validates (all capabilities stated, no business content, no contradictions) → **locks** Stage 1.

### Stage 2 — PRD
AI drafts `prd.md`: personas, and for each Vision capability a set of requirements `<R1.1 …>` with BDD acceptance criteria, success metrics, MoSCoW. Gate asks only the open *personal* calls (MoSCoW cut, metric targets, persona priority). Apply → validate (100% capability coverage, no orphan requirements) → **lock**.

### Stage 3 — Architecture
AI drafts `architecture.md`: components `<C1 …>`, data models, integrations, ADR flags, each mapped to PRD requirements. Gate asks build-vs-buy / stack / residency where genuinely open. Apply → validate (every requirement has a component; ADR flags raised) → **lock**.

### Stage 4 — Phases
AI scores the architecture on the rubric and drafts `phase-plan.md`: `<Phase 1 … Phase M>`, each with goal, exit condition, components delivered, and rubric scores. Gate asks the ambition/sequencing calls. Apply → validate (every component lands in exactly one phase; dependencies respected) → **lock**.

### Stage 5 — Segments
For each phase, AI cuts segments `<S1.1 …>` in batch shape and drafts the Segment Plan + `traceability-matrix.md`. Gate asks ordering / first-build / split preferences. Apply → validate (each segment buildable + verifiable; every segment traces to a phase → component → requirement → capability) → **lock** → **handoff** (`BUILD_READY`).

The result handed to Forgeflow:

```markdown
<!-- BUILD_READY: <PRODUCT_NAME> -->
Segment Plan: <DOCS_ROOT>/<PRODUCT_NAME>/segments/
Segments → batches (1:1): S1.1, S1.2, S2.1, …
```

Forgeflow's `start-batch` reads `S1.1` as batch `S1.1`. No translation.

---

# Part C — Mechanics & Contracts

## C1 · The complexity/risk rubric (drives phases + segments)

The AI scores the work on these dimensions to decide how many phases there are and how segments are cut. Higher total → more phases, finer segments. The blank scoring sheet is `templates/complexity-rubric.md`.

| Dimension | 1 (low) | 3 (medium) | 5 (high) |
|-----------|---------|------------|----------|
| **Scope size** | one capability, few requirements | several capabilities | many interdependent capabilities |
| **Dependency depth** | flat, independent parts | some ordering required | deep chains, must-build-before |
| **Uncertainty / novelty** | well-trodden pattern | partly novel | research-grade unknowns |
| **Integration count** | self-contained | a few external systems | many integrations / contracts |
| **Blast radius** | isolated, reversible | moderate coupling | touches core / hard to reverse |

**How the score is used:** the AI uses judgment, not a formula — but as a guide, a low total (≈5–10) is often one phase of a few segments; a high total (≈20–25) is several phases with finer segments and risky unknowns front-loaded or quarantined. The rubric is also where the **MoSCoW** prioritization and **stage-gate** thinking folded in from the former Product-Manager skill now live: each phase carries a MoSCoW emphasis and an explicit proceed/pivot/hold exit condition.

## C2 · The personalization gate filter (full)

A candidate question passes the gate only if it clears **both** tests (see Part A). To keep gates lean and *personal*:

- **Default-or-personalize.** Every question carries the AI's recommended default + reason. "Accept defaults" must always be a valid complete answer — so a run can proceed at full speed when the user has no strong preference.
- **No best-practice questions.** If you catch yourself asking the user something the skills already answer (validation, testing, accessibility, security defaults, normalization, idempotency), delete it and apply the best practice silently — note it in the doc so it's visible, but don't gate on it.
- **Cap the count.** Aim for the few decisions that genuinely shape *this* product. A stage with 15 questions is almost always smuggling best-practice questions back in.
- **Record every gate.** `personalization-gate.md` keeps the decision, the default, and the chosen answer, so a later session (or Forgeflow) sees *why* the product is shaped the way it is.

## C3 · Phase & segment derivation

- **Phases** are the AI's ordered cut of the architecture by rubric score: each has a goal, the components it delivers, an exit condition, and a MoSCoW emphasis. Dependencies are respected (a phase never depends on a later phase).
- **Segments** are the buildable units inside a phase. Each must be:
  - **Independently buildable + verifiable in one build pass** (this is what makes it equal a Forgeflow batch),
  - **Traceable** up the chain (Part C4),
  - **Sized by the rubric**, not a fixed count.
- A segment that can't be verified on its own is too big or wrongly cut — split it.

## C4 · The traceability chain (one gate per arrow)

```
vision-capability → prd-requirement → architecture-component → phase → segment → forgeflow-batch
```

`templates/traceability-matrix.md` holds one row per leaf, greppable end-to-end. **Validation rule:** no orphans — every requirement has a parent capability, every component a parent requirement, every segment a parent phase and a clear set of requirements it satisfies. An orphan row is a finding, not a detail. This is what guarantees the build can't drift from the intent.

## C5 · The two ledgers (PROGRESS + NEXT-STEPS)

Blueprint tracks a run with two committed markdown files — the same discipline Forgeflow uses, scoped to documentation:

- **`blueprint-progress.md`** (the PROGRESS ledger) — the durable state of the run: per-stage status (`not-started → drafted → gate-open → locked`), per-phase and per-segment status, each gate's Q/A status (`pending / answered / accepted-default / locked`), and a verification-evidence log. Its status tables *are* the "visually seen" view — a scannable board, no separate dashboard needed.
- **`next-steps-handoff.md`** (the NEXT-STEPS handoff) — the cold-start screen: exactly **one** active next action (which stage/segment is next and what blocks it), read-first order, and what *not* to do yet. Written at the end of every meaningful session so the next session resumes without chat history.

These are Blueprint's ledgers. At handoff, the **segment list crosses over into Forgeflow's** `_progress.md` shape, so the build flow tracks the build with its own ledger — no double bookkeeping, a clean role boundary.

## C6 · The Forgeflow handoff contract (segment = batch, 1:1)

This is the bridge that makes two methods feel like one pipeline.

1. **Shape.** Every segment is authored with `templates/segment.md`, whose fields mirror `forgeflow/templates/batch-template.md` (`ID`, `Theme`, item checklist, source links, verify-evidence slots, completion gate). A segment *is* a batch deliverable with its build not yet run.
2. **Marker.** The handoff writes `<!-- BUILD_READY: <PRODUCT_NAME> -->` plus the Segment Plan path and the ordered segment→batch ID list.
3. **IDs.** Segment IDs are reused verbatim as batch IDs (`S1.1` → batch `S1.1`). No renaming, no mapping table.
4. **Consumption.** In the same project, Forgeflow's `start-batch` reads the Segment Plan as its batch source; `_progress.md` seeds from the segment list. The Blueprint traceability matrix remains the source of intent the build verifies against.
5. **Input map.** The Segment Plan is necessary but not sufficient — Forgeflow `/onboard` also expects a founding brief, a shared canon, hard gates, a verification matrix, and a source hierarchy. Blueprint already holds that intent, so the handoff seeds it across rather than letting the build start cold:

   | Blueprint artifact | Seeds Forgeflow input |
   |--------------------|-----------------------|
   | `vision.md` (intent, users, quality bar, out-of-scope) | `FOUNDING-BRIEF.md` |
   | architecture **Binding standards** + **Data models** + **Integrations & contracts** | `_shared-canon.md` |
   | vision quality bar + architecture **NFR targets** | `hard-gates.md` (candidates) |
   | `traceability-matrix.md` | `verification-matrix.md` |

   Declare the build-phase **source hierarchy + tie-breaker** in one line: the locked Blueprint docs are canonical for *intent*; once code exists, **live code wins ties** and any doc disagreement is itself a finding. (See `starter/runbooks/handoff.md` step 4 for the procedure.)

> Run `verify/portability-check.mjs` before handoff: it fails if any stage is unlocked, any gate is still open, any placeholder remains, the Segment Plan isn't batch-shaped, the `BUILD_READY` marker is missing, or the traceability matrix has an orphan row. Green means Forgeflow can pick it up cold.

## C7 · Provenance

Blueprint supersedes the former `SKILL-BANK/skills/product-planning/EXPERT-*` pipeline (Brainstorm → Vision → PRD → Architecture → Epic → Epic-PRD → Story → Story-Spec → Task) and folds in `EXPERT-10` (Product Manager: MoSCoW, stage-gates, metrics — now living in the rubric and the phase exit conditions). Those skills are marked `deprecated` in the skill bank and kept for reference; their strong document structures (vision sections, the PRD feature/persona/BDD template, the architecture/ADR structure) were migrated into `templates/` here, stripped of their best-practice question banks per the personalization principle.
