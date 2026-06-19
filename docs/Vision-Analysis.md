---
type: analysis
title: "TaqiAI - Vision Alignment Analysis"
status: Draft
owner: Abdullah
last_updated: 2026-04-20
product: taqiai
kb_summary: "Side-by-side comparison of Abdullah's VISION.md (2026-04-15) vs Product-Vision.md (Hamza, 2026-04-19). Identifies alignments, gaps, and decisions needed."
---

# TaqiAI — Vision Alignment Analysis

**Date:** 2026-04-20
**Author:** Abdullah
**Purpose:** Compare two vision sources and surface gaps before PRD phase.

**Sources compared:**
- **A** — `d:/AI legal System/VISION.md` (Abdullah, 2026-04-15, v1.0)
- **B** — `PRODUCTS/taqiai/Product-Vision.md` (Hamza, 2026-04-19, v2.0)

---

## 1. WHAT IS ALREADY ALIGNED

Both documents agree on the foundation. No conflict on these points.

| Topic | Both say |
|-------|----------|
| Jurisdiction | Pakistan-only (PPC, CrPC, CPC, Family Court Act, Contract Act, Qanun-e-Shahadat) |
| Tagline | "AI assists, lawyers verify and finalize" |
| Safety model | Verified Template Library + Controlled AI generation + Mandatory lawyer review |
| Citation safety | AI cannot invent citations; pre-approved references only |
| Template depth | 120–150 master templates target |
| Drafting workflow | 4 interaction modes (Auto-draft, Clarify-then-draft, Variant selection, Hybrid) |
| Core modules | Drafting Engine, AI Legal Advisor, Tax Calculator |
| Tax Calculator scope | Stamp Duty, PLRA, FBR, Withholding, Capital Gains |
| Bilingual | English + Urdu |
| Monetization | Solo subscription + Firm per-seat + Free trial |
| Out of scope (v1) | Case tracking, Client CRM, Billing, Court date management |
| Principles | Depth over breadth; Pakistani-law-first; Legal structure is sacred |
| Success metric | Lawyer edit ratio < 20% |

---

## 2. GAPS — Things in MY Vision (A) Missing or De-prioritized in Product-Vision (B)

### Gap A1 — Law Students as Primary Users
- **My vision:** Solo advocates **+ Law students** = primary users
- **Product-Vision:** Law students = secondary v2 only (Civil/Criminal/Prosecution lawyers = primary)
- **Decision needed:** Are law students Day-1 audience or v2 audience?
- **My recommendation:** Keep as primary — law students are early adopters, low friction, build advocacy.

### Gap A2 — Voice + Image as Core Module (not v2)
- **My vision:** "AI Voice + Image Understanding Module" is a **core module** (Section 6)
- **Product-Vision:** Deferred to v2 ("pending v1 drafting engine validation")
- **Decision needed:** Voice/image at launch or after v1?
- **My reasoning:** Voice intake is critical for Pakistani client workflow — clients explain cases verbally, not in writing. Without it, lawyers waste time transcribing.

### Gap A3 — Roman Urdu Input
- **My vision:** Explicit — "Roman Urdu input accepted"
- **Product-Vision:** Not mentioned
- **Why it matters:** Most Pakistani lawyers type in Roman Urdu; ignoring this loses adoption.
- **Action:** Add to Product-Vision Section 4 or 5.

### Gap A4 — Nastaliq Rendering
- **My vision:** "Full Urdu legal drafting with proper Nastaliq rendering" (Section 10 differentiator)
- **Product-Vision:** Mentions Urdu but not Nastaliq specifically
- **Why it matters:** Generic Arabic-script fonts look unprofessional in Pakistani court documents.
- **Action:** Add as a technical requirement in PRD phase.

### Gap A5 — AI Legal Advisor as "First-Level Research Assistant"
- **My vision:** Section 7 explicitly frames AI Advisor as automating research effort (analyze facts → identify issues → suggest sections → guide preparation)
- **Product-Vision:** Has AI Advisor as Module 2 but less emphasis on the research-replacement framing
- **Action:** Strengthen Module 2 description to highlight research-time savings.

---

## 3. GAPS — Things in Product-Vision (B) Missing from MY Vision (A)

These are valid additions Hamza brought in. I should incorporate.

### Gap B1 — Case Analyzer as 4th Core Module (Reverse Mode)
- **Product-Vision:** Module 4 — decompose judgments into facts, issues, arguments, citations, reasoning
- **My vision:** Not mentioned
- **My reaction:** Strong addition. Reverse Mode informs Forward Mode quality. Accept.

### Gap B2 — Validation Mode (LEGAL-03 Comparator)
- **Product-Vision:** Internal capability — measure AI draft vs actual filed document, generate accuracy scorecard
- **My vision:** Not mentioned
- **My reaction:** Critical for proving accuracy before launch. Accept.

### Gap B3 — Both Sides of the Bar (Plaintiff AND Defendant)
- **Product-Vision:** Explicit principle — equal capability for prosecution AND defense
- **My vision:** Implicit but not stated
- **Action:** Add as explicit principle in v1.1 of my vision.

### Gap B4 — Specific Accuracy Targets
- **Product-Vision:** >90% citation accuracy, >80% argument completeness, <10% hallucination, 100% structural compliance
- **My vision:** Only "lawyer edit ratio < 20%"
- **Action:** Adopt these targets.

### Gap B5 — Phased Roadmap (5 Phases)
- **Product-Vision:** Internal Skills → Testing → PRD → Beta → Launch
- **My vision:** No roadmap
- **Action:** Adopt the phased roadmap.

### Gap B6 — Domain Expert Validation
- **Product-Vision:** REC-091, REC-092 cited; Abdullah committed to providing real solved case files
- **My vision:** Not mentioned
- **Action:** Document Abdullah's domain expert role and case file collection plan.

### Gap B7 — Pricing Market Constraint
- **Product-Vision:** PKR 80,000–600,000/month lawyer income → must price below global $100–500/month tools
- **My vision:** Pricing details TBD
- **Action:** Lock PKR-denominated tier strategy.

### Gap B8 — V1 Document Type Shortlist
- **Product-Vision:** v1 candidates — Bail Application, Plaint, Written Statement, Affidavit, Bail Reply, Criminal Appeal, Misc Application
- **My vision:** Generic "120–150 templates" only
- **Action:** Confirm v1 list with Abdullah.

---

## 4. CONFLICTS — Where the Two Documents Disagree

| # | Topic | My Vision | Product-Vision | Severity |
|---|-------|-----------|----------------|----------|
| C1 | Voice + Image module | Core (Section 6) | v2 deferred | **High** — affects v1 scope |
| C2 | Law students as primary user | Yes | Secondary v2 only | Medium |
| C3 | Module count | 3 (Drafting, Advisor, Tax) | 5 (+ Case Analyzer, Validation Mode) | Low — additive |
| C4 | Urdu timing | "Bilingual by default" (implied Day 1) | Open decision (Day 1 vs v1.5) | **High** — needs decision |

---

## 5. RECOMMENDED ACTIONS

### Immediate (this week)
- [ ] **Decide C1 (Voice/Image scope):** Discuss with Hamza. My preference = include voice intake at v1, image at v1.5.
- [ ] **Decide C2 (Law students):** Discuss with Hamza. My preference = primary.
- [ ] **Decide C4 (Urdu timing):** Open decision D-001 in NEXT-STEPS.md. My preference = Day 1.
- [ ] **Add to Product-Vision:** Roman Urdu input, Nastaliq rendering, research-replacement framing for AI Advisor.

### Before PRD Phase
- [ ] Confirm v1 document type list with Abdullah
- [ ] Lock PKR pricing tiers (D-003)
- [ ] Define template verification process (D-004)
- [ ] Resolve "external TaqiAI competitor" question (D-005) — is there a real product by this name?

### For My VISION.md (v1.1 update)
- [ ] Add Case Analyzer as Module 4
- [ ] Add Validation Mode as internal capability
- [ ] Add explicit "both sides of the bar" principle
- [ ] Add specific accuracy targets (>90%, >80%, <10%)
- [ ] Add 5-phase roadmap
- [ ] Document Abdullah as primary legal domain expert

---

## 6. CONVERGENCE PATH

**Goal:** Single source of truth = `PRODUCTS/taqiai/Product-Vision.md`

**Steps:**
1. Resolve 4 conflicts (C1–C4) in next sync with Hamza
2. Apply 5 gap-A items (A1–A5) as edits to Product-Vision.md
3. Apply 6 gap-B items (B1–B6) as v1.1 update to my VISION.md
4. Mark my VISION.md as "superseded by Product-Vision.md v2.1" once aligned
5. Move my VISION.md into the wiki at `PRODUCTS/taqiai/source-inputs/VISION-Abdullah-2026-04-15.md` for traceability

---

## 7. OPEN QUESTIONS FOR DISCUSSION

1. Voice + Image — v1 core or v2 module? (currently disagree)
2. Law students — primary or secondary user? (currently disagree)
3. Urdu — Day 1 or v1.5? (open decision D-001)
4. Is there a real "TaqiAI" competitor in Pakistan, or is the product name available? (D-005)
5. Who owns template verification process — Abdullah (decided: primary reviewer) (D-004)

---

## APPENDIX

### Source A — My VISION.md highlights
- 13 sections, draft v1.0, 2026-04-15
- 3 core modules + Voice/Image + Case Understanding sections
- Strong principles, lighter on roadmap and metrics

### Source B — Product-Vision.md highlights
- 14 sections + appendix, v2.0, 2026-04-19
- 5 modules (adds Case Analyzer + Validation Mode)
- Strong roadmap, accuracy targets, market analysis, risks

### Related Documents
- [PROGRESS.md](./PROGRESS.md) — milestones tracker
- [NEXT-STEPS.md](./NEXT-STEPS.md) — execution queue
- [brainstorm.md](./brainstorm.md)
- Source A (my vision): `d:/AI legal System/VISION.md` — to be moved into wiki
