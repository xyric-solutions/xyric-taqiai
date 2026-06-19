---
type: prd
title: "TaqiAI - Product Requirements Document"
status: Built — Live
owner: Abdullah
contributors: [Hamza]
last_updated: 2026-06-19
product: taqiai
version: "1.0"
lifecycle_stage: Launch & Growth
kb_summary: "Product Requirements Document for TaqiAI — AI legal drafting and advisory platform for Pakistani lawyers. The product is fully built and live, shipping 13 modules (EPIC-01..EPIC-13). Covers all 27 PRD sections from strategy through launch, reconciled to the built implementation."
---

# TaqiAI — Product Requirements Document

**Document Version:** 1.0 (Built — Live)
**Date:** 2026-06-19
**Owner:** Abdullah (Legal Domain)
**Contributors:** Hamza (Product Strategy)
**Status:** Built — Live. The product is fully built and shipping 13 live modules (EPIC-01..EPIC-13). This document has been reconciled against the live implementation; remaining open items are business decisions only (PKR pricing tiers, data-privacy/PDPB policy, hosting-provider choice).
**Source Documents:**
- [Product-Vision.md](./Product-Vision.md) (v2.0)
- [VISION.md](../../../VISION.md) (Abdullah's input, v1.0)
- [Vision-Analysis.md](./Vision-Analysis.md) (gap analysis)
- [Brainstorm-Vision-QA.md](./Brainstorm-Vision-QA.md) (10 decisions)
- [PROGRESS.md](./PROGRESS.md) (milestones)
- [NEXT-STEPS.md](./NEXT-STEPS.md) (execution queue)

---

## Table of Contents

**Part A — Strategy**
1. Executive Summary
2. Problem Statement & Market Opportunity
3. Goals, Objectives & Success Metrics
4. Target Users & Personas
5. Scope (In/Out, v1 vs v2)

**Part B — Product**
6. Functional Requirements (per Module)
7. User Flows & Journeys
8. Document Template System
9. AI Model Strategy
10. Citation & Legal Knowledge Management
11. Localization (Bilingual EN/UR + Roman Urdu + Nastaliq)

**Part C — User Experience**
12. UI/UX Requirements
13. Onboarding & Help System

**Part D — Engineering**
14. Technical Architecture & Stack
15. Data Model & Schema
16. Authentication, Authorization & User Roles
17. Integrations

**Part E — Quality, Security & Compliance**
18. Non-Functional Requirements
19. Security, Privacy & Data Protection
20. Audit Trail, Versioning & Backup/Recovery
21. Validation, Testing & Quality Assurance

**Part F — Legal & Operations**
22. Legal & Regulatory Compliance
23. Pricing, Billing & Subscription System
24. Monitoring, Analytics & Customer Support
25. Beta Strategy & Phased Launch Plan

**Part G — Reference**
26. Risks, Dependencies & Open Questions
27. Timeline, Milestones & Glossary

---

# PART A — STRATEGY

## 1. Executive Summary

**TaqiAI** is an AI-powered legal drafting and advisory platform purpose-built for the **Pakistani legal system**. It combines a **verified template library** (50+ master templates across 13 legal categories) with **controlled AI generation**, **bilingual (English + Urdu) support** (Arabic additionally supported in Translation), and **lawyer-in-the-loop review** to produce court-ready legal drafts in minutes.

The platform is **built and live**, shipping **13 integrated modules** (each tracked as an epic, EPIC-01..EPIC-13):
1. **AI Document Drafting** (EPIC-01) — 50+ verified templates across 13 legal categories with AI content fill (`/affidavits`, `/agreements`, `/applications`, `/power-of-attorney`)
2. **Court-Case Drafting** (EPIC-02) — criminal, civil, family, constitutional, property, corporate, tax, immigration, and non-Muslim case drafting
3. **Tax Calculator** (EPIC-03) — Stamp Duty, PLRA, FBR, Withholding, Capital Gains (`/property-transfer`, `/tax-calculator`)
4. **AI Legal Advisor** (EPIC-04) — conversational, judgment-grounded guidance; citations/sources shown when relevant (not a forced block every turn) (`/ai-advisor`)
5. **Judgment Intelligence** (EPIC-05) — searchable, AI-analyzed Pakistani court judgments (`/case-law`)
6. **Chamber / Case Management** (EPIC-06) — matter portfolio, hearing timetable, deadlines (`/chamber`)
7. **Legal Translation** (EPIC-07) — Urdu / English / Arabic legal translation (`/translate`)
8. **Lawyer Diary** (EPIC-08) — quick-view daily case register (roznamcha) of all active cases (`/lawyer-diary`)
9. **Case Builder** (EPIC-09) — judgment-backed drafting (`/case-builder`)
10. **Copy from Photo** (EPIC-10) — OCR document capture and same-to-same retyping (`/copy-from-photo`)
11. **Voice Case** (EPIC-11) — advocate-client discussion recording → AI analysis → drafted case document (`/voice-case`)
12. **Statute Search** (EPIC-12) — search grounded in the statutes corpus (`/statute-search`)
13. **Document Vault** (EPIC-13) — saved document history and storage (`/documents`)

Pakistan's market of **200,000+ lawyers** is currently unserved by AI legal tools. Global competitors (Harvey, CoCounsel, Lexis+ AI) focus exclusively on US/UK jurisdictions and price beyond reach of Pakistani advocates ($300–2,000/month income vs $100–500/month tools). TaqiAI is the first AI legal platform built natively for **PPC, CrPC, CPC, Qanun-e-Shahadat, Family Law,** and Pakistan's hybrid legal system.

**Tagline:** *AI assists, lawyers verify and finalize.*

> **Reconciliation note (v1.0, 2026-06-19):** This PRD was originally authored as a forward-looking Vision/Draft (v0.1–v0.2). The product is now fully built and live. The module set has expanded from the originally-planned 8 to **13 shipping modules** (Case Builder, Copy from Photo, Voice Case, Statute Search, Document Vault added; Translation promoted to a first-class live module). Architecture "open questions" around database/search have been resolved to the actual implementation (Prisma + SQLite app DB, read-only SQLite judgments corpus + a semantic search service). Genuinely-open items remaining are business decisions only — PKR pricing tiers, data-privacy/PDPB policy, and final hosting-provider choice.

**Strategic Positioning:**
- **Pakistan-first** — built for PPC/CrPC/CPC, not adapted from foreign tools
- **Verified-template + Controlled-AI** — templates define legal structure; AI fills content; lawyer approves
- **Bilingual Day 1** — English + Urdu (full UI, document output, Nastaliq rendering, Roman Urdu input); Arabic additionally supported in Legal Translation
- **Full-library at launch** — shipped with the complete document landscape (50+ templates across 13 legal categories), not a lean MVP
- **Both sides of the bar** — equal capability for plaintiff and defendant, prosecution and defense
- **Accuracy-first development** — every capability validated against solved cases before productization

---

## 2. Problem Statement & Market Opportunity

### 2.1 The Problem

Pakistani lawyers spend disproportionate time on repetitive legal drafting — affidavits, agreements, plaints, written statements, bail applications, appeals, and miscellaneous applications — each with dozens of jurisdiction-specific sub-variants. The problem has four dimensions:

| Dimension | Description |
|-----------|-------------|
| **No jurisdiction-specific AI** | Every available AI legal tool is built for US/UK law; nothing exists for PPC, CrPC, CPC, or Pakistan's hybrid system |
| **No verified templates** | Free-form AI generation produces structural and citation errors that are unusable in Pakistani courts (validated by internal domain expert review — REC-092) |
| **No accuracy standard** | No tool measures output quality against real Pakistani court documents |
| **No bilingual support** | Existing tools cannot produce professional Urdu legal drafts with proper Nastaliq rendering |

### 2.2 Market Opportunity

| Metric | Value |
|--------|-------|
| Licensed lawyers in Pakistan | 200,000+ |
| Annual lawyer growth rate | 5–8% |
| Estimated formal legal services market | USD 1–2 billion |
| Direct AI competitors in Pakistan | 1 (DigiLawyer — launched December 2025) |
| Indirect competitors (global tools) | Harvey, CoCounsel, Lexis+ AI (US/UK focus, enterprise pricing) |

**Adjacent opportunity:** Pakistan-built framework is transferable to India, Bangladesh, and Sri Lanka (shared British common-law roots) once Pakistan dominance is established.

### 2.3 Competitive Landscape — Pakistani Market (Updated 2026-04-29)

#### DigiLawyer (digilawyer.org) — First Mover (December 2025)

Developed by UET Lahore engineers. Appeared on Shark Tank Pakistan Episode 6. Already adopted by government institutions, judiciary, and leading law firms.

| DigiLawyer Feature | TaqiAI Equivalent | TaqiAI Status |
|-------------------|-------------------|---------------|
| **ARK AI** — citation-backed legal Q&A (1947–2025 corpus) | AI Legal Advisor (EPIC-04) + Judgment Intelligence (EPIC-05) | ✅ Both built & live |
| **MIKE AI** — pleadings, applications, notices, contracts | AI Document Drafting (EPIC-01) + Court-Case Drafting (EPIC-02) | ✅ Built & live; 13 legal categories |
| Pakistani case law corpus 1947–2025 | Judgment Intelligence (EPIC-05) | ✅ Built & live (~200K+ rows: Supreme Court, Federal Shariat Court, all High Courts) |
| 24/7 AI availability | Covered | ✅ Live |
| Document automation | Covered | ✅ Live |
| Court document drafting | Covered | ✅ Live |

#### Where TaqiAI Already Beats DigiLawyer (MVP — April 2026)

| TaqiAI Advantage | DigiLawyer Status |
|-----------------|-------------------|
| Voice input (mic → text → draft) | Not confirmed |
| Image upload (document photo analysis) | Not confirmed |
| Full Urdu output (bilingual Day 1) | Not confirmed |
| 20+ legal categories (Family, Criminal, Property, Civil, Corporate, Tax, Immigration, Constitutional, Non-Muslim Laws, etc.) | General drafting only |
| Tax Calculator (Stamp Duty, FBR 236C/236K, CGT, PLRA) | Not confirmed |
| Non-Muslim / Minority Laws coverage | Not confirmed |
| My Documents (saved drafts history) | Not confirmed |
| Property Transfer Tax Calculator | Not confirmed |
| Real-time Intent Detection in AI chat | Not confirmed |

#### Strategic Response — Features to Add to Beat DigiLawyer

These features closed the gap where DigiLawyer led, and doubled down on our advantages. All product features below are now **built & live**; the parity audit remains an ongoing operational practice:

| Feature | Priority | Module | Status / Notes |
|---------|----------|--------|-------|
| **Statute / Legal Research search** (lightweight citation search) | P0 | Statute Search (EPIC-12) + Judgment Intelligence (EPIC-05) | ✅ Built & live. User types a section or keyword → gets statute text and case citations. |
| **Citations shown when relevant in AI Advisor** | P0 | AI Legal Advisor (EPIC-04) | ✅ Built & live. The Advisor replies conversationally and surfaces cases/sources **when relevant** (on a fresh question or when asked) — NOT a forced citation block on every turn. |
| **Case Tracker (Chamber / Case Management)** | P0 | Chamber (EPIC-06) | ✅ Built & live. Active matters list, hearing dates, today's list, deadlines. |
| **Judgment Intelligence (full)** | P1 | Judgment Intelligence (EPIC-05) | ✅ Built & live. Citation search (SCMR/PLD/PCrLJ), AI summary, ratio decidendi. |
| **Case Law Corpus** | P1 | Judgment Intelligence (EPIC-05) | ✅ Built & live. ~200K+ judgment rows (Supreme Court, Federal Shariat Court, all High Courts), not just a seed set. |
| **Competitor Feature Parity Audit** | P1 | Product | Ongoing — periodic audit: what has DigiLawyer shipped that we haven't? |

### 2.3 Why Now

- LLMs have crossed the capability threshold for structured legal reasoning
- Pakistani legal market is completely untouched by AI
- Best legal AI tools globally still hallucinate 17–33% — clear room for an accuracy-focused approach
- Domain expert validation confirms drafting (not research) is the highest-value first product
- Pakistan's PDPB (Personal Data Protection Bill) is emerging, making compliance-ready architecture an early advantage

---

## 3. Goals, Objectives & Success Metrics

### 3.1 Strategic Goals

| Goal | Description |
|------|-------------|
| **G1 — Be the trusted Pakistani legal AI platform** | Default daily-use tool for solo advocates, law students, and firms by 2028 |
| **G2 — Set the accuracy bar for legal AI** | Hallucination rate below 10% (vs industry 17–33%); citation accuracy above 90% |
| **G3 — Cover the full document landscape** | 120–150 master templates representing all major Pakistani legal document types |
| **G4 — Deliver true bilingual legal drafting** | First platform with court-grade Urdu (Nastaliq) and English parity |
| **G5 — Build defensible advocate trust** | Verified templates + mandatory lawyer review + transparent AI labeling |

### 3.2 Product Objectives (v1)

| Objective | Measurement |
|-----------|-------------|
| O1 — Launch full template library | All 120–150 master templates verified and live at launch |
| O2 — Achieve accuracy targets | >90% citation accuracy, >80% argument completeness, <10% hallucination, 100% structural compliance |
| O3 — Enable bilingual workflow | English + Urdu input/output/UI from Day 1 |
| O4 — Ship the integrated module suite | ✅ Achieved — 13 live modules (EPIC-01..EPIC-13): AI Document Drafting, Court-Case Drafting, Tax Calculator, AI Legal Advisor, Judgment Intelligence, Chamber/Case Management, Legal Translation, Lawyer Diary, Case Builder, Copy from Photo, Voice Case, Statute Search, Document Vault |
| O5 — Capture Pakistani lawyer + student segments | Solo Pro tier + Free/discounted Student tier with verification |

### 3.3 Success Metrics

#### Phase 1 (Internal Skills Validation)

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| Citation accuracy | > 90% | LEGAL-03 scoring on solved cases |
| Argument completeness | > 80% | LEGAL-03 scoring vs filed documents |
| Hallucination rate | < 10% | Manual review of fabricated citations |
| Structural compliance | 100% | Court format adherence check |
| Test corpus size | 50+ solved cases (across all template categories) | Case-Log.md registry |

#### Phase 4+ (Product)

| Metric | Target |
|--------|--------|
| Time-to-draft | < 5 minutes per standard document |
| Lawyer edit ratio | < 20% of AI output modified |
| Lawyer satisfaction (beta) | > 4 / 5 rating |
| Repeat usage | > 3× per week per active lawyer |
| Subscription retention | > 70% at 3 months, > 60% at 6 months |
| Monthly active advocates | Growth metric (target set during PRD finalization) |
| Student tier conversion to Solo Pro | > 25% within 12 months of graduation |

---

## 4. Target Users & Personas

### 4.1 Primary Users (v1 launch audience)

| Persona | % of TAM | Description | Primary Need |
|---------|---------|-------------|--------------|
| **Civil Litigation Lawyer** | ~35% | Property, contract, family-law disputes | Plaints, written statements, applications, precedent research |
| **Criminal Defense Lawyer** | ~25% | Bail applications, defense arguments, appeals | Fast bail drafting, defense precedents |
| **Prosecution / Plaintiff Lawyer** | ~15% | Criminal complaints, charge sheets, prosecution arguments | Case-building, evidence structuring |
| **Solo Advocate (general practice)** | ~15% | Mixed civil + criminal solo practice | All document types; affidavits, agreements, POAs |
| **Law Student** | ~10% | Studying for bar exams, moot court, legal clinics, internships | Understanding case structure, learning argument construction, drafting practice |

**Why Law Students are Primary (not secondary):** Decided in [Brainstorm Q2](./Brainstorm-Vision-QA.md#q2-law-students-as-primary-user). Students are early adopters, build long-term loyalty (today's student = tomorrow's paying advocate), and dedicated free/discounted tier removes pricing friction.

### 4.2 Secondary Users (post-v1)

| Persona | Phase | Description | Primary Need |
|---------|-------|-------------|--------------|
| **Paralegal / Junior Associate** | v1.5 | Assists senior lawyers with research and first drafts | Efficient first-draft generation, citation verification |
| **Law Firm Admin** | v1.5 | Manages firm subscription, user provisioning | Multi-seat license, user roles, usage reporting |
| **Judge / Judicial Officer** (Read-Only) | v2 | Case law research, judgment drafting assistance | Case summaries, precedent compilation |
| **Legal Researcher / Academic** | v2 | Pakistani legal research and publishing | Bulk case analysis, citation export |

### 4.3 Persona Profiles (Detailed)

> **Note:** Detailed persona profiles (demographics, day-in-the-life, jobs-to-be-done, pain points, motivations) live in [context/personas.md](./context/personas.md). To be expanded as part of UX research phase.

### 4.4 User Tiers Summary

| Tier | Users | Sign-up | Pricing |
|------|-------|---------|---------|
| **Free Trial** | All new users | Email or Google account | Free, limited drafts |
| **Student** | Law students | Email or Google account (self-declared, no document upload) | Free or heavily discounted *(amount TBD — Q7)* |
| **Solo Pro** | Individual practicing advocates | Email or Google account (self-declared) | TBD *(Q7)* |
| **Firm** | Law firms (2+ seats) | Email or Google account by firm admin (no firm registration upload) | TBD per-seat *(Q7)* |
| **Pay-per-Draft** | Occasional users | Email or Google account | TBD per document *(Q7)* |

> **Note:** v1 uses self-declared tier selection only — no formal document verification. Optional verification (e.g., Bar Council ID for premium features) may be added post-v1 if abuse signals emerge.

---

## 5. Scope (In/Out, v1 vs v2)

### 5.1 In Scope — v1 Launch

#### Modules — all 13 built & live (EPIC-01..EPIC-13)
- AI Document Drafting, Court-Case Drafting, Tax Calculator, AI Legal Advisor, Judgment Intelligence, Chamber/Case Management, Legal Translation, Lawyer Diary, Case Builder, Copy from Photo, Voice Case, Statute Search, Document Vault
- Internal accuracy validation (LEGAL-03 comparator skill) is retained as an internal QA practice, not a lawyer-facing module
- **Voice Case (built):** discussion recording / upload → AI analysis → drafted case document (full feature, no longer just a "v1 subset")

#### Document Coverage
- **Full library: 120–150 master templates** spanning all major Pakistani legal document categories
- Sub-variant logic: each master template generates multiple sub-types (e.g., one Affidavit master → property, identity, surety, etc.)

#### Languages
- English + Urdu (full bilingual) — LIVE
- Arabic — supported in Legal Translation (EPIC-07)
- Roman Urdu input accepted (transliteration)
- Nastaliq rendering for Urdu output (Jameel Noori or equivalent)
- Bilingual UI with language toggle

#### Document Categories (high-level — driven by USB performa library + court case research)
- Affidavits (all major types)
- Agreements (sale, lease, partnership, employment, NDA, etc.)
- Power of Attorney (general, special, irrevocable)
- Sale Deeds (residential, commercial, agricultural)
- Civil court documents (plaints, written statements, applications, appeals)
- Criminal court documents (bail applications, FIRs, defense statements, appeals)
- Family law (nikahnama, divorce, khula, custody petitions)
- Notarial documents
- Other transactional/notarial documents

#### Geographic Scope
- Pakistan only (all four provinces + ICT)
- Pakistani law system (PPC, CrPC, CPC, Qanun-e-Shahadat, Contract Act, Family Court Act, PECA, ATA, CNS Act, etc.)

#### Platform
- Web application (Next.js + React + TypeScript)
- Responsive design (desktop primary; mobile/tablet supported)

### 5.2 Out of Scope (still excluded)

| Excluded | Reason |
|----------|--------|
| Client CRM | Out of scope; integrate later if needed |
| Billing/invoicing for lawyer's clients | Different product category |
| Native mobile apps (iOS/Android) | Web-first; responsive web covers mobile use today |
| Other jurisdictions (India, Bangladesh, etc.) | Future expansion — Pakistan-first |
| Self-hosted enterprise version | Not before SaaS product matures |

> **Note (reconciled 2026-06-19):** Several items originally listed as out-of-scope or future (v2) are now **built & live**: Voice (as Voice Case — discussion → AI analysis → draft, EPIC-11), Image/document OCR understanding (as Copy from Photo, EPIC-10), Case-law search (Judgment Intelligence, EPIC-05) and statute search (EPIC-12). Chamber/Case Management (EPIC-06) and Judgment Intelligence (EPIC-05) shipped as live modules.

### 5.3 Future Scope — post-v1 (not yet built)

| Item | Target Version |
|------|----------------|
| Native mobile apps | future |
| Multi-user firm collaboration features (team docs) | future |
| Custom template creation by advocates | future |
| API access for firm integrations | future |
| Expansion to other South Asian jurisdictions | future |

> **Built & live (no longer future):** Voice case analysis (EPIC-11), Image/document OCR understanding (EPIC-10), case-law search (EPIC-05), statute search (EPIC-12).

---

# PART B — PRODUCT

## 6. Functional Requirements (per Module)

> **Status (2026-06-19):** Built & live. The 13 shipping modules map to epics EPIC-01..EPIC-13 (see Executive Summary). The functional requirements below describe the live implementation; the original 8-module numbering (Modules 1–8) is retained as historical structure, with the additional live modules (Case Builder, Copy from Photo, Voice Case, Statute Search, Document Vault, Legal Translation) documented in Section 6.10.

### 6.1 Module 1 — Drafting Engine

**Purpose:** Generate court-ready legal drafts from verified templates with AI-filled content, in English or Urdu.

#### Functional Requirements (TBD — needs section walk-through)
- F1.1 — Template selection (browse / search / suggested by case type)
- F1.2 — Four interaction modes per template:
  - (a) Auto-draft → inline edit
  - (b) Clarify-then-draft (AI asks structured questions)
  - (c) Variant selection (AI produces 2–3 variants)
  - (d) Hybrid
- F1.3 — Sub-variant selector within master templates
- F1.4 — Bilingual output choice (English / Urdu / Both)
- F1.5 — **Mandatory lawyer review gate before export** — "Approve" action must be explicitly clicked before Download / Print / Copy-for-InPage / Export buttons become enabled. Approval records user ID, timestamp, doc ID, template version, red-line-checklist acknowledgment. See [LEGAL-02 Hard Red Lines](./skills/LEGAL-02-legal-drafter.md#hard-red-lines-zero-tolerance--malpractice-level-mistakes) for the 10 zero-tolerance validation rules.
- F1.6 — Export formats: PDF, DOCX (court-ready)
- F1.7 — Version history per draft
- F1.8 — Save as draft / resume later
- F1.9 — Watermarked exports for Student tier
- *(more F1.x specs to be defined)*

### 6.2 Module 2 — AI Legal Advisor

**Purpose:** Provide conversational, judgment-grounded legal guidance under Pakistani law via a chat interface (`/ai-advisor`). Built & live (EPIC-04).

#### Functional Requirements (built)
- F2.1 — Chat interface (English + Urdu + Roman Urdu input)
- F2.2 — Conversational, ChatGPT-style replies — no forced template or judgments-every-turn structure
- F2.3 — Case classification on submitted facts (when relevant)
- F2.4 — Applicable law/section identification
- F2.5 — Procedural guidance (court process, filing requirements)
- F2.6 — **Citations/sources shown when relevant** — the Advisor surfaces cases and sections when they add value (a fresh question, or when the user asks), grounded in the judgment corpus; citations are NOT a mandatory block appended to every response. Citation safety still applies: the AI does not invent citations.
- F2.7 — Conversation history per user
- F2.8 — Export advisor session as case notes

### 6.3 Module 3 — Tax Calculator

**Purpose:** Calculate Stamp Duty, PLRA, FBR taxes, Withholding, Capital Gains for property and transactional matters.

#### Functional Requirements

- F3.1 — **DC Rate Wizard (step-by-step location selector):**
  - Step 1: Province → Step 2: District → Step 3: Tehsil → Step 4: Town/Mouza
  - On Town selection: DC rate + malba/structure rate auto-load from estamp corpus
  - Source: estamp.punjab.gov.pk (Punjab); equivalent portals for other provinces
  - Lawyer can manually override auto-loaded rate if needed
- F3.2 — **Property type selector** — three distinct calculation streams:
  - **Plot** — DC rate × area only; malba NOT added
  - **House** — DC rate (land) + malba rate (structure) both applied
  - **Agriculture Land** — agri DC rate; provincial revenue rules; separate tax stream
- F3.3 — **Size input** — accepts Marla or Kanal; auto-converts (1 Kanal = 20 Marla; 1 Acre = 8 Kanal)
- F3.4 — Stamp Duty calculator (per province — Punjab, Sindh, KPK, Balochistan, ICT)
- F3.5 — PLRA charges calculator (Punjab specific)
- F3.6 — FBR §236C / §236K Withholding Tax (buyer + seller; filer vs non-filer rates)
- F3.7 — Capital Gains Tax (CGT) — applies regardless of holding period (new FBR rule 2026)
- F3.8 — Agriculture Land: Mutation fee + provincial agricultural cess; flag FBR 236C/K as typically not applicable
- F3.9 — Commercial property: FED (Federal Excise Duty) added; higher stamp duty rates
- F3.10 — Per-province rate tables (Punjab, Sindh, KP, Balochistan, ICT) with version date
- F3.11 — Full itemized output: buyer liability / seller liability / grand total
- F3.12 — Save calculation to a matter (Chamber Management)
- F3.13 — Export as PDF with disclaimer
- *(more F3.x specs to be defined)*

### 6.4 Module 4 — Case Analyzer (Reverse Mode)

**Purpose:** Decompose court judgments and case files into structured analytical breakdowns.

#### Functional Requirements (TBD)
- F4.1 — File upload (PDF, DOCX, plain text)
- F4.2 — Structured output: facts, issues, plaintiff arguments, defendant arguments, citations, court reasoning, ruling
- F4.3 — Export analysis as report
- F4.4 — Save analysis to a case
- *(more F4.x specs to be defined)*

### 6.5 Module 5 — Validation Mode (Internal)

**Purpose:** Compare AI-generated drafts against actual filed documents from solved cases; produce accuracy scorecards.

#### Functional Requirements (TBD — internal admin tool, not lawyer-facing)
- F5.1 — Pair upload: AI draft + actual filed document
- F5.2 — Accuracy scorecard output: citations matched/missed, arguments matched/missed, structural compliance, hallucination flags
- F5.3 — Aggregate metrics dashboard across all validation runs
- F5.4 — Per-template accuracy tracking (which templates need iteration)
- *(more F5.x specs to be defined)*

### 6.6 Module 6 — Judgment Intelligence Library

**Purpose:** Provide lawyers a searchable, AI-powered library of Pakistani court judgments across all courts (Supreme Court, Federal Shariat Court, all 5 High Courts, District Courts, and Special Courts). Three core capabilities: (1) bulk judgment upload + AI case preparation, (2) AI judgment reader on demand, (3) citation-first search and retrieval.

#### Sub-Module A — Judgment Upload & AI Case Preparation

- F6A.1 — **Bulk judgment upload** — lawyer uploads one or many judgments (PDF, DOCX, plain text); system ingests them into a personal judgment library
- F6A.2 — **AI analysis per judgment** — for each uploaded judgment, AI automatically produces:
  - Structured case brief (parties, court, date, judge, subject matter)
  - Key legal issues identified
  - Arguments by each side (plaintiff/prosecution + defendant/defense)
  - Legal sections / statutes cited
  - Court's reasoning and ruling
  - Ratio decidendi (binding legal principle)
  - Obiter dicta (non-binding observations)
- F6A.3 — **Case strategy preparation** — AI synthesizes across uploaded judgments to generate:
  - Applicable precedents for the lawyer's current case
  - Recommended legal arguments supported by the judgments
  - Counter-argument anticipation (what the other side may cite)
  - Citation list ready for use in drafts
- F6A.4 — **Link judgment analysis to a case** — lawyer can attach judgment analysis results to a specific matter in Chamber Management (Module 7)
- F6A.5 — **Export case strategy report** — PDF/DOCX export of AI-generated case strategy with citations
- *(more F6A.x specs to be defined)*

#### Sub-Module B — AI Judgment Reader

- F6B.1 — **On-demand judgment reading** — lawyer uploads or selects a judgment; AI reads it and provides a plain-language summary
- F6B.2 — **Summary levels** — lawyer can request: (a) one-paragraph executive summary, (b) structured full breakdown, (c) just the ratio decidendi
- F6B.3 — **Question-and-answer on judgment** — lawyer can ask questions about a specific judgment ("What was the court's reasoning on bail?", "Which sections were cited?") and AI answers from the judgment text
- F6B.4 — **Bilingual output** — judgment summary available in English and Urdu
- F6B.5 — **Highlight key passages** — AI flags the most important paragraphs in the original judgment text
- *(more F6B.x specs to be defined)*

#### Sub-Module C — Judgment Search & Retrieval

> **Design Decision (2026-04-28):** In Pakistani legal practice, judgments are NOT reliably retrievable by court case number (e.g., "Criminal Appeal No. 45/2021") — that is a court-internal number. The correct primary search method is **citation format** (SCMR, PLD, PCrLJ, etc.). Case number is a secondary/optional field.

**Primary Search — Citation-Based (How Pakistani lawyers actually find judgments):**

- F6C.1 — **Search by law report citation** — lawyer enters a citation in standard Pakistani format and judgment appears:
  - **SCMR** (Supreme Court Monthly Review) — e.g., "2023 SCMR 1450"
  - **PLD** (Pakistan Legal Decisions) — e.g., "2021 PLD Lahore 234", "2019 PLD SC 45"
  - **PCrLJ** (Pakistan Criminal Law Journal) — e.g., "2022 PCrLJ 890"
  - **MLD** (Monthly Law Digest) — e.g., "2020 MLD 567"
  - **PTD** (Pakistan Tax Decisions) — e.g., "2021 PTD 1200"
  - **CLC** (Civil Law Cases) — e.g., "2022 CLC 340"
  - **YLR** (Yearly Law Reporter) — e.g., "2021 YLR 780"
  - **PLJ** (Pakistan Law Journal) — e.g., "2020 PLJ Lahore 450"
  - **PTCL** (Pakistan Tax Cases Law) — for tax matters
  - **NLR** (National Law Reporter)
  - **SBLR** (Sindh Balochistan Law Reports)
- F6C.2 — **Citation auto-complete** — as lawyer types a citation, system suggests matching judgments from corpus

**Secondary Search — Contextual:**

- F6C.3 — **Search by statute + section** — enter "PPC 302" or "CrPC 497" → all judgments that cited that section across all courts
- F6C.4 — **Search by keyword / legal issue** — full-text semantic search ("bail murder case concurrent sentences")
- F6C.5 — **Search by party names** — plaintiff or defendant name
- F6C.6 — **Search by court + year range** — filter by specific court and year (e.g., Lahore High Court 2018–2023)
- F6C.7 — **Search by judge name** — find all judgments authored by a specific judge
- F6C.8 — **Search by subject matter** — predefined categories: bail, murder, property, family, contract, tax, constitutional, etc.

**Court Coverage — All Pakistani Courts:**

- F6C.9 — **Supreme Court of Pakistan** — apex court; SCMR + PLD SC citations; binding on all courts
- F6C.10 — **Federal Shariat Court** — Islamic law jurisdiction; PLD FSC citations
- F6C.11 — **Lahore High Court** — Punjab province; PLD Lahore, PLJ, NLR citations
- F6C.12 — **Sindh High Court** — Sindh province; PLD Karachi, SBLR citations
- F6C.13 — **Peshawar High Court** — KPK province; PLD Peshawar citations
- F6C.14 — **Balochistan High Court** — Balochistan province; PLD Quetta citations
- F6C.15 — **Islamabad High Court** — ICT; PLD Islamabad citations
- F6C.16 — **Special Courts** — judgments from:
  - Anti-Terrorism Courts (ATC)
  - Accountability Courts (NAB)
  - Banking Courts
  - Labour Courts
  - Family Courts
  - Drug Courts
  - Environmental Courts
  - Commercial Courts
  - Revenue Courts / Board of Revenue
  - Service Tribunals
  - Income Tax Appellate Tribunal
  - Customs Appellate Tribunal
- F6C.17 — **District & Sessions Courts** — where available digitally (coverage limited initially; grows over time via lawyer uploads)

**Results & Retrieval:**

- F6C.18 — **Results with AI summary** — each result shows: court, citation, date, parties, one-line AI summary of ratio
- F6C.19 — **Binding vs persuasive indicator** — system flags whether judgment is binding (same or higher court) or persuasive (different province or lower court) relative to the lawyer's current case court
- F6C.20 — **Judgment not found flow** — if citation not in corpus, system says "not yet ingested" + gives lawyer option to upload the PDF manually
- F6C.21 — **Public corpus** — platform pre-loads landmark judgments starting with Supreme Court (best digitized); High Courts added progressively; Special Courts added as corpus grows; lawyer uploads fill gaps

#### Engineering Notes (Module 6 — as built)
- **Judgment corpus storage (actual):** a read-only **SQLite `judgments.db`** corpus (~200K+ rows across the Supreme Court, Federal Shariat Court, and all High Courts). Semantic search is served by an **optional standalone semantic search service** that holds the precomputed embeddings — NOT pgvector / Postgres.
- OCR is used for scanned PDF judgments (a large share of Pakistani court documents are scanned images, not digital text)
- Chunking strategy: judgment → paragraphs → embeddings for accurate retrieval (semantic service)
- Citation parser: regex + NLP to extract citation components (reporter, year, volume, page) from standard Pakistani formats
- Model: Google Gemini with a multi-model fallback chain — long-context model for judgment analysis; faster model for summaries and Q&A
- Built corpus coverage: Supreme Court, Federal Shariat Court, and all High Courts; lawyer uploads fill remaining gaps

---

### 6.7 Module 7 — Chamber Management

**Purpose:** Give lawyers a structured case portfolio and timetable for managing their chamber's active cases — hearing dates, case status, upcoming deadlines, and daily schedule.

#### Sub-Module A — Case Portfolio (Matter Register)

- F7A.1 — **Create a matter (case)** — lawyer creates a new matter with:
  - Case title / description
  - Case number (court-assigned internal number — optional; not used for judgment search)
  - **Court** — dropdown covering all Pakistani courts:
    - Supreme Court of Pakistan
    - Federal Shariat Court
    - Lahore High Court
    - Sindh High Court (Karachi)
    - Peshawar High Court
    - Balochistan High Court (Quetta)
    - Islamabad High Court
    - District & Sessions Court (+ district name)
    - Civil Court (+ district name)
    - Judicial Magistrate Court (+ district name)
    - Anti-Terrorism Court (ATC)
    - Accountability Court (NAB)
    - Banking Court
    - Labour Court
    - Family Court
    - Drug Court
    - Service Tribunal
    - Revenue Court / Board of Revenue
    - Income Tax Appellate Tribunal
    - Customs Appellate Tribunal
    - Other (free text)
  - Case type (civil / criminal / family / corporate / tax / constitutional / service)
  - Client name(s) (plaintiff/defendant; one or both sides)
  - Lawyer's role (Counsel for Plaintiff / Counsel for Defendant / Prosecutor / Defense Counsel)
  - Opposing counsel (optional)
  - Judge name (optional)
  - Status (Active / Adjourned / Decided / Archived)
  - Date filed / date opened
- F7A.2 — **Matter list view** — paginated list of all matters with quick filters: Active / Adjourned / Decided / Archived; filter by court, case type, date range
- F7A.3 — **Matter detail view** — all info about a case on one screen; tabs for: Overview, Hearing History, Documents, Notes, Judgments
- F7A.4 — **Link documents to matter** — drafts generated in Module 1 (Drafting Engine) can be attached to a matter
- F7A.5 — **Link judgment analysis to matter** — AI analysis from Module 6 can be attached to a matter
- F7A.6 — **Case notes** — lawyer can add free-text notes to any matter (client instructions, court observations, to-dos)
- F7A.7 — **Archive/close matter** — mark matter as decided/closed; stays searchable but removed from active queue
- *(more F7A.x specs to be defined)*

#### Sub-Module B — Hearing Timetable & Calendar

- F7B.1 — **Add hearing date** — for any matter, lawyer adds:
  - Hearing date + time
  - Court / courtroom
  - Hearing type (e.g., arguments, evidence, bail hearing, judgment date, mention)
  - Notes (e.g., "bring original documents", "opposing counsel filing today")
- F7B.2 — **Timetable view** — calendar view (day / week / month) showing all upcoming hearings across all matters; color-coded by case type
- F7B.3 — **Today's list** — one-click "What do I have today?" — lists all hearings for the current day in order of time, with matter name, court, and hearing type
- F7B.4 — **Upcoming hearings list** — next 7 days or 30 days view; sorted chronologically
- F7B.5 — **Hearing reminders** — push notifications or in-app alerts before hearings (configurable: 1 day before, 1 hour before)
- F7B.6 — **Add adjournment** — lawyer marks a hearing as adjourned + adds new date; full adjournment history maintained per matter
- F7B.7 — **Hearing history per matter** — chronological list of all past hearings for a matter (what happened, what was adjourned, outcome notes)
- F7B.8 — **Conflict detection** — warn lawyer if two hearings are scheduled at the same time in different courts
- *(more F7B.x specs to be defined)*

#### Sub-Module C — Deadlines & Reminders

- F7C.1 — **Add deadline to matter** — not a hearing date, but a filing deadline, limitation date, or action item
  - Deadline type: filing deadline / limitation period / response due / order compliance
  - Date + description
  - Priority (urgent / normal)
- F7C.2 — **Deadlines dashboard** — all upcoming deadlines across all matters; sorted by urgency
- F7C.3 — **Limitation period calculator** — for a given filing date or cause of action, calculate the limitation period under the Limitation Act 1908 or CPC
- F7C.4 — **Overdue alerts** — highlight passed deadlines that have not been marked resolved
- *(more F7C.x specs to be defined)*

#### Engineering Notes (Module 7)
- Chamber Management is **per-lawyer** — each lawyer sees only their own cases (consistent with per-user isolation decision Q9)
- Firm tier extension: firm admins can see all matters across assigned lawyers within the firm (v1.5)
- Calendar integration (Google Calendar / Outlook) — v1.5 post-launch
- Data model: `Matter` entity links to `HearingDate`, `Deadline`, `Document`, `JudgmentAnalysis`, `CaseNote`
- Mobile access priority: lawyers heavily use phones in courts — timetable and today's list must be mobile-optimized

---

### 6.8 Voice Intake (v1 subset)

**Purpose:** Capture client/lawyer voice input for case intake; produce transcription + basic AI summary.

#### Functional Requirements
- F6.1 — Browser-based voice recording (microphone permission, record/pause/stop, audio preview)
- F6.2 — **Multi-language speech-to-text transcription** — all commonly-spoken languages in Pakistani legal practice must be supported and transcribed well:
  - **Urdu** (primary)
  - **English** (primary)
  - **Punjabi** (common in Punjab courts/clients)
  - **Sindhi** (common in Sindh)
  - **Pashto** (common in KP)
  - **Balochi** (Balochistan)
  - **Roman Urdu** (transliterated input)
  - **Mixed / code-switched** (e.g., Urdu + Punjabi in same recording, Urdu + English mix — very common in real client intake)
- F6.3 — Detect speaker's language(s) automatically; handle code-switching without forcing a single language
- F6.4 — Basic AI summary (short structured outline of key facts extracted from voice) — summary output language respects user's default (English or Urdu)
- F6.5 — Attach transcript to a case
- F6.6 — Edit transcript manually (lawyer can correct mis-transcription)
- F6.7 — Confidence markers on transcription where quality is low (noisy audio, unclear speech)
- F6.8 — "Best effort" on low-quality audio rather than rejection — lawyer always reviews and edits

> **Decision (2026-04-21):** All commonly-spoken Pakistani languages accepted. AI must transcribe whichever language the speaker uses. Auto-translation to Urdu/English optional (NOT forced). This is the core usability proposition for real Pakistani client intake where Urdu-only assumption fails frequently.

#### Engineering Notes
- Model selection: Gemini Audio (supports multi-lingual) OR OpenAI Whisper (strong multi-lingual) — evaluate accuracy on Urdu + Punjabi + Sindhi + Pashto specifically
- Latency target: transcript available within ~10 seconds of recording stop
- Max recording length v1: 10 minutes per session (chunked upload if longer)

---

### 6.9 Module 8 — Lawyer Diary

**Purpose:** Provide every lawyer a quick-view register of all their active cases in a single table — showing last hearing date, case title, court, stage, what happened at last hearing (proceeding), and next hearing date. This is the digital version of the physical case diary/roznamcha that every Pakistani lawyer maintains manually.

**Difference from Chamber Management (Module 7):** Chamber Management is a detailed case management system (matter creation, documents, notes, hearing history). Lawyer Diary is a fast, read-at-a-glance daily register — one row per case, all key dates visible instantly without opening individual case records.

#### Diary Table Format

| Column | Description |
|--------|-------------|
| **Case Number** | Court-assigned case number |
| **Last Date** | Date of most recent hearing |
| **Title** | Case title (parties involved) |
| **Court Name** | Name of court where case is being heard |
| **Stage** | Current stage of proceedings (e.g., Arguments, Evidence, Bail Hearing, Judgment, Mention) |
| **Proceeding** | What happened at the last hearing (brief note) |
| **Next Date** | Date of next scheduled hearing |

#### Functional Requirements

- FLD.1 — **Diary view** — lawyer sees all their active cases in one table; one row per case; columns: Case Number, Last Date, Title, Court Name, Stage, Proceeding, Next Date
- FLD.2 — **Add entry** — lawyer adds a new case row to the diary with all seven fields
- FLD.3 — **Edit entry** — lawyer updates any field after each hearing (update Last Date, Proceeding, Stage, Next Date)
- FLD.4 — **Delete entry** — lawyer removes a case from diary when case is decided or closed
- FLD.5 — **Sort by Next Date** — diary sorted by upcoming hearing date by default (soonest hearing at top)
- FLD.6 — **Filter by Court Name** — lawyer filters diary to see only cases in a specific court
- FLD.7 — **Today's hearings highlight** — rows where Next Date = today are highlighted for instant visibility
- FLD.8 — **Print / Export diary** — lawyer can print or export diary as PDF (for physical reference in court)
- FLD.9 — **Stage dropdown** — Stage field uses predefined options: Arguments / Evidence / Bail Hearing / Judgment / Mention / Framing of Charges / Final Arguments / Other
- FLD.10 — **Proceeding field** — free-text entry by lawyer; no AI generation (lawyer types what happened)

#### Engineering Notes
- Lawyer Diary is **per-lawyer** — each lawyer sees only their own diary entries
- Data model: `DiaryEntry` entity with fields: case_number, last_date, title, court_name, stage, proceeding, next_date, user_id, created_at, updated_at
- Diary is independent of Chamber Management — a lawyer can use diary without creating a full Matter in Module 7
- Optional future link: diary entry can be linked to a Matter in Chamber Management (v1.5)
- Mobile-optimized table view — lawyers check their diary on phone before entering court

---

### 6.10 Additional Live Modules (EPIC-07, EPIC-09 to EPIC-13)

These modules were added beyond the original 8-module plan and are **built & live**.

#### Legal Translation (EPIC-07) — `/translate`
- Legal translation across **Urdu / English / Arabic**
- Line-spacing controls for output formatting
- Bilingual/Nastaliq rendering consistent with the Drafting module

#### Case Builder (EPIC-09) — `/case-builder`
- Judgment-backed drafting: builds a case document grounded in the judgment corpus (EPIC-05)
- Surfaces supporting precedents and citations for the draft

#### Copy from Photo (EPIC-10) — `/copy-from-photo`
- Upload a photo of a document; AI extracts the text and retypes it same-to-same
- Reuses the document-extraction (OCR) pipeline shared with image-upload typing

#### Voice Case (EPIC-11) — `/voice-case`
- Record or upload an advocate-client discussion
- AI analyzes the discussion and drafts a case document from it (VoiceRecorder + case-analysis pipeline)

#### Statute Search (EPIC-12) — `/statute-search`
- Search the **statutes corpus (`statutes.db`)** — federal and provincial laws — to ground answers and drafting in current statute text

#### Document Vault (EPIC-13) — `/documents`
- Saved-document history and storage for the lawyer's generated drafts and uploads

---

## 7. User Flows & Journeys

> **Status:** TBD — to be walked through with Abdullah in dedicated UX session.

### Key Flows to Specify
- UF1 — New user signup (email or Google OAuth) + tier selection (self-declared)
- UF2 — First-draft creation flow (template selection → mode choice → AI generation → review → export)
- UF3 — Voice intake → draft creation flow
- UF4 — Advisor chat session
- UF5 — Tax Calculator quick-use flow
- UF6 — Case Analyzer judgment upload + analysis flow
- UF7 — Saved-case continuation flow (return to in-progress draft)
- UF8 — Subscription upgrade / downgrade flow
- UF9 — Firm admin user provisioning flow
- UF10 — Judgment search and retrieval flow (search by case no. / citation / keyword → AI summary → read full judgment)
- UF11 — Judgment upload + case strategy flow (upload judgment(s) → AI analysis → case strategy report → attach to matter)
- UF12 — Chamber matter creation flow (new matter → add hearing dates → daily timetable view)
- UF13 — Today's court list flow (lawyer opens app in morning → sees all today's hearings sorted by time)
- UF14 — Lawyer Diary quick-update flow (lawyer returns from court → opens diary → updates Last Date, Proceeding, Stage, Next Date for that case in seconds)

---

## 8. Document Template System

**Purpose:** Defines how the verified template library is structured, versioned, and dynamically renders sub-variants.

### 8.1 Template Architecture (high-level — to be detailed)

- **Master template** = top-level legal framework (e.g., "Affidavit Master")
- **Variants** = parameterized sub-types within a master (e.g., "Property Affidavit", "Identity Affidavit")
- **Schema-driven rendering** = each template has a JSON schema defining fields, validation, conditional logic
- **Bilingual content layer** = each template stores English and Urdu versions with field-level mapping
- **Versioning** = templates have semantic version numbers (e.g., 1.0, 1.1) with change history

### 8.2 Template Sourcing (decided in Brainstorm Q6)

**Two-track approach:**
- **Track 1 — USB Performa Library:** Affidavits, Agreements, POA, Sale Deeds (already field-tested performas, light verification)
- **Track 2 — Court Case Research:** Plaints, written statements, bail applications, appeals (manual construction from real cases)

### 8.3 Template Verification Process (decided in Brainstorm Q6)

- **Primary reviewer:** Abdullah
- **Secondary reviewer (court documents):** Abdullah (expanded review for complex court documents)
- **Review cadence:**
  - New templates: full review before adding to library
  - Existing templates: quarterly check for law amendments
  - Triggered review: any major legislation change

### 8.4 Detailed Specs (TBD)
- T1 — Template file format (JSON, YAML, custom DSL?)
- T2 — Sub-variant logic specification
- T3 — Field validation rules
- T4 — Conditional field logic (show field X if Y is selected)
- T5 — Bilingual content storage model
- T6 — Template versioning strategy
- T7 — Template approval workflow (draft → review → approved → live)
- T8 — Template lifecycle (deprecate, archive, replace)

---

## 9. AI Model Strategy

**Purpose:** Defines which AI models are used, prompt engineering approach, and multi-stage verification pipeline to meet accuracy targets.

### 9.1 Model Selection (as built)

The platform uses the **Google Gemini API with a multi-model fallback chain** — requests fall back across available Gemini models for resilience and cost/latency balance.

| Use Case | Model approach |
|----------|----------------|
| Document drafting (AI Document Drafting / Court-Case Drafting) | Faster Gemini model for structured template fill |
| Legal Advisor chat | Higher-reasoning Gemini model for nuanced, conversational advice |
| Voice case analysis | Gemini (multilingual audio) for transcription + analysis |
| Judgment analysis / Case Builder | Long-context Gemini model for judgment decomposition |
| OCR (Copy from Photo) | Gemini document/vision extraction |

### 9.2 Multi-Stage Verification Pipeline (to be designed)

```
Input → Research Agent → Reasoning Agent → Drafting Agent → Verification Agent → Output
```

- **Research Agent:** identifies applicable Pakistani law sections
- **Reasoning Agent:** constructs argument logic
- **Drafting Agent:** fills template with structured content
- **Verification Agent:** checks citations, hallucination, structure

### 9.3 Prompt Engineering Strategy
- Structured prompts with role + context + constraints + few-shot examples
- Citation safety prompts: "Do NOT invent citations; if unsure, mark as `[CITATION_NEEDED]`"
- Bilingual prompt variants
- Domain-grounding prompts referencing Pakistani law system

### 9.4 Model Specs (TBD)
- M1 — Token limits and context window strategy
- M2 — Model fallback strategy (if primary unavailable)
- M3 — Cost optimization (caching, batching)
- M4 — Self-hosted model evaluation for sensitive data (per Brainstorm Q9 sub-Q9.3)
- M5 — Fine-tuning strategy (when sufficient case data is available)

---

## 10. Citation & Legal Knowledge Management

**Purpose:** Ensure all AI-generated documents cite real, verified Pakistani law sources. Prevent fabricated citations (industry's #1 legal AI risk).

### 10.1 Knowledge Base Sources (to be built)
- Pakistan Penal Code (PPC) — full sections + amendments
- Code of Criminal Procedure (CrPC) — full
- Code of Civil Procedure (CPC) — full
- Qanun-e-Shahadat Order (Evidence Law)
- Contract Act 1872
- Specific Relief Act 1877
- Family Court Act 1964
- Muslim Family Laws Ordinance 1961
- PECA 2016 (cyber crime)
- ATA (Anti-Terrorism Act)
- CNS Act (Control of Narcotic Substances)
- Constitutional provisions
- Supreme Court judgments (well-digitized starting point)
- High Court judgments (Lahore, Sindh, Peshawar, Balochistan, ICT)
- Provincial laws as applicable

### 10.2 Citation Safety Rules
- AI cannot generate a citation not present in the verified knowledge base
- Uncertain citations are flagged as `[CITATION_REQUIRED]` for manual lawyer addition
- Every citation has provenance (source document, version, date)
- Citation format follows Pakistani legal convention

### 10.3 Knowledge Updates (TBD)
- K1 — Update workflow when laws are amended
- K2 — Update workflow when new judgments are published
- K3 — Source ingestion pipeline (PDF / scraping / manual entry)
- K4 — Knowledge base versioning

---

## 11. Localization (Bilingual + Roman Urdu + Nastaliq)

**Purpose:** Deliver true Day-1 bilingual experience as decided in Brainstorm Q3.

### 11.1 Language Support Matrix

| Layer | English | Urdu | Roman Urdu |
|-------|---------|------|------------|
| UI strings (buttons, menus, labels) | ✅ | ✅ | — |
| Document input | ✅ | ✅ | ✅ (transliterated to Urdu) |
| Document output | ✅ | ✅ | — |
| Voice transcription | ✅ | ✅ | — |
| Templates | ✅ | ✅ | — |
| Citations | ✅ (English law text) | ✅ (Urdu translations where official) | — |

### 11.2 Technical Requirements
- **i18n framework:** next-intl (or equivalent for Next.js 16)
- **Nastaliq font:** Jameel Noori Nastaliq (or Mehr Nastaliq) bundled and licensed
- **RTL support:** full right-to-left layout for Urdu mode
- **Roman Urdu parser:** transliteration engine (existing libraries: urduhack, custom rules)
- **Language toggle:** persistent per user; switchable mid-session
- **Per-document language choice:** lawyer chooses output language per draft (independent of UI language)
- **Mixed-language documents:** support documents that contain both English and Urdu sections
- **InPage compatibility (CRITICAL):** Pakistani courts accept Urdu filings prepared in **InPage** (dominant Urdu word processor in legal practice). AI-generated Unicode Urdu does NOT paste cleanly into InPage. Product MUST provide Unicode → InPage-compatible conversion (minimum: "Copy for InPage" button using a reliable Unicode ↔ InPage converter; stretch goal: native `.inp` file export). Without this, lawyers cannot use AI-generated Urdu drafts in actual court filings. See [LEGAL-02 skill](./skills/LEGAL-02-legal-drafter.md#urdu-output--inpage-compatibility-critical) for full engineering spec.

### 11.3 Localization Specs (TBD)
- L1 — Translation memory and term consistency
- L2 — Legal terminology glossary (English ↔ Urdu standardized)
- L3 — Date formats (Gregorian + Islamic Hijri)
- L4 — Number formats (Eastern Arabic vs Western digits)
- L5 — Address formats per province

---

# PART C — USER EXPERIENCE

## 12. UI/UX Requirements

**Status:** TBD — needs UX session. High-level direction below.

### 12.1 Design Principles
- **Lawyer-first:** designed for legal professionals, not general consumers
- **Clarity over cleverness:** legal context demands precision
- **Bilingual native:** UI must feel native in both English and Urdu (not translated afterthought)
- **Trust signals everywhere:** AI-assisted clearly labeled; verified status visible
- **Court-ready aesthetic:** professional, conservative, document-focused
- **Accessibility:** WCAG 2.1 AA minimum

### 12.2 Key UI Specs (TBD)
- UX1 — Design system and component library choice
- UX2 — Core layouts: dashboard, draft editor, advisor chat, calculator, analyzer
- UX3 — Mobile-responsive behavior
- UX4 — Accessibility requirements (screen reader support for both English and Urdu)
- UX5 — Print stylesheets for court-ready document preview
- UX6 — Empty states, loading states, error states
- UX7 — In-app document preview (matching final PDF/DOCX output)

---

## 13. Onboarding & Help System

**Status:** TBD — needs detailed design.

### 13.1 Onboarding Flow (high-level)
- O1 — First-time user welcome tour
- O2 — Tier selection at sign-up (self-declared, no document upload required at v1)
- O3 — Sample case walkthrough (guided first draft)
- O4 — Module discovery prompts

### 13.2 Help System (TBD)
- O5 — In-app contextual help (tooltips, info icons)
- O6 — Knowledge base / help center
- O7 — Video tutorials (English + Urdu)
- O8 — Live chat support (tier-dependent SLA)
- O9 — Community / forum (post-v1 consideration)

---

# PART D — ENGINEERING

## 14. Technical Architecture & Stack

### 14.1 Confirmed Stack (as built)

| Layer | Technology | Notes |
|-------|------------|-------|
| Frontend Framework | Next.js (App Router) | In use |
| UI Library | React | In use |
| Styling | Tailwind CSS — "Midnight Qanoon" dark cyan/violet design system | In use |
| Type Safety | TypeScript | In use |
| ORM | Prisma | In use |
| App database | SQLite (`dev.db`) via Prisma | In use |
| Judgment corpus | Read-only SQLite `judgments.db` (~200K+ rows) | In use |
| Statute corpus | SQLite `statutes.db` (federal + provincial) | In use |
| Semantic search | Optional standalone semantic search service (precomputed embeddings) | In use |
| AI | Google Gemini API with multi-model fallback chain | In use |
| Auth tokens | jose (JWT) | In use |
| Password hashing | bcryptjs | In use |
| Document export | html2pdf / browser print | In use |

### 14.2 Architecture Decisions — RESOLVED (as built)

The following items were originally open. They are now **resolved** to the actual implementation:

- A1 — **Database (RESOLVED):** **Prisma + SQLite** (`dev.db`) for application data. The judgment corpus is a separate **read-only SQLite `judgments.db`**, and statutes are in `statutes.db`. No PostgreSQL; no managed RDS/Supabase/Neon dependency.
- A2 — **Hosting (OPEN — business decision):** deployed to a Node host (a GitHub repo is configured for Railway-style deploy); final provider/region remains a business decision.
- A3 — **AI orchestration (RESOLVED):** **direct Google Gemini API** calls with an in-app multi-model fallback chain — no LangChain.
- A4 — **File storage (RESOLVED):** local / server filesystem with the SQLite databases; no external S3 dependency required.
- A5 — **Search (RESOLVED):** **SQLite queries over the read-only `judgments.db` + an optional semantic search service** (embeddings) for semantic retrieval, plus `statutes.db` for statute search. No Postgres full-text, Elasticsearch, or Algolia.
- A6 — **Background jobs (RESOLVED):** native Next.js / server-side scripts (e.g., corpus ingestion and classification scripts); no external job queue.
- A7 — **CDN (OPEN — deploy detail):** tied to the hosting-provider decision (A2).
- A8 — **Monitoring (OPEN):** not yet standardized; Sentry remains a candidate.

### 14.3 High-Level Architecture (as built)
```
[Browser]
    ↓
[Next.js Web App] — UI, server actions, API routes
    ↓
[Auth Layer] — JWT (jose) + bcryptjs, role-based access
    ↓
[Application Services] — Drafting, Court-Case Drafting, Advisor, Tax, Judgment Intelligence,
                         Chamber, Translation, Diary, Case Builder, Copy-from-Photo,
                         Voice Case, Statute Search, Document Vault
    ↓
[AI Orchestration Layer] — Gemini multi-model fallback chain, prompt management
    ↓
[Data Layer] — Prisma → SQLite (dev.db)  |  read-only judgments.db  |  statutes.db
                         |  optional semantic search service (embeddings)
    ↓
[External Services] — Google Gemini API
```

---

## 15. Data Model & Schema

**Status:** TBD — to be detailed in Tech Architecture phase.

### 15.1 Core Entities (high-level)

| Entity | Description |
|--------|-------------|
| **User** | Lawyer / Student / Firm Admin (with role) |
| **Firm** | Law firm entity (parent for firm seats) |
| **Subscription** | Tier, billing status, trial expiry |
| **Case** | A legal matter (parent for documents within it) |
| **Document** | A draft (linked to template + case + user) |
| **Template** | Master template (with variants and bilingual content) |
| **TemplateVariant** | Sub-variant of a master template |
| **Citation** | Verified Pakistani law citation (with provenance) |
| **CalculatorSession** | Saved tax calculation |
| **AnalysisSession** | Saved Case Analyzer output |
| **VoiceSession** | Recorded voice input + transcript |
| **AdvisorConversation** | AI Legal Advisor chat history |
| **AuditLog** | Every meaningful action by users (who, what, when) |
| **ValidationRun** | Internal accuracy comparison record |
| **PaymentTransaction** | Subscription/per-draft payments |
| **Judgment** | Court judgment stored in the library (PDF/text, metadata, embeddings) |
| **JudgmentAnalysis** | AI-generated analysis of a judgment (brief, issues, arguments, ratio, strategy) |
| **Matter** | A chamber case / legal matter (parent for hearings, deadlines, documents, notes) |
| **HearingDate** | A scheduled hearing for a matter (date, time, court, type, adjournment history) |
| **Deadline** | A filing deadline or limitation date linked to a matter |
| **CaseNote** | Free-text note attached to a matter by the lawyer |

### 15.2 Schema Specs (TBD)
- DM1 — Detailed Prisma schema per entity
- DM2 — Relationships (1:1, 1:N, N:M)
- DM3 — Indexes for performance
- DM4 — Soft-delete strategy
- DM5 — Multi-tenancy (firm-scoped data)
- DM6 — Encryption-at-rest for sensitive fields

---

## 16. Authentication, Authorization & User Roles

**Status:** Per-user isolation confirmed in Brainstorm Q9.

### 16.1 Authentication
- Email + password (primary)
- Optional: phone OTP (Pakistan-friendly)
- Optional: Google OAuth (post-v1)
- Password requirements: minimum 8 chars + complexity rules
- Forgot password flow with email reset
- Account lockout after N failed attempts

### 16.2 Authorization Model
- **Role-based access control (RBAC)**
- Roles: `lawyer`, `student`, `firm_admin`, `firm_member`, `internal_admin`
- Permission matrix per role per resource

### 16.3 User Tier Sign-up
- All tiers: email + password OR Google OAuth
- Tier selection at signup is **self-declared** by the user (no document verification at v1)
- No HEC document upload, no Bar Council ID upload, no firm registration upload required
- **Future option (post-v1):** if abuse is observed, optional verification (e.g., Bar Council ID upload for premium features) can be layered on
- **Rationale:** minimize signup friction → faster adoption; verification can be added later based on actual abuse signals

### 16.4 Session Management
- JWT-based sessions (jose library)
- Session expiry policy
- Multi-device session support
- Forced logout on password change

### 16.5 Data Isolation
- All queries scoped to authenticated user's `user_id` (or `firm_id` for firm-shared resources)
- No cross-user data visibility (per Q9 decision)
- Firm data isolation between firms

---

## 17. Integrations

**Status:** Specifics TBD — to be confirmed in implementation phase.

### 17.1 Required Integrations

| Integration | Purpose | Candidates |
|-------------|---------|------------|
| Payment Gateway | Subscription + pay-per-draft | JazzCash, EasyPaisa, Stripe (international cards), Safepay |
| Email | Transactional emails (verification, receipts, alerts) | Resend, SendGrid, AWS SES |
| SMS | OTP, notifications | Twilio, local Pakistani SMS providers |
| Voice / STT | Voice intake transcription | OpenAI Whisper, Gemini Audio |
| File Storage | Document uploads, PDFs, audio files | AWS S3, Cloudflare R2, Google Cloud Storage |
| AI APIs | Drafting, advisor, analysis | Google Gemini API |
| Error Tracking | Production error monitoring | Sentry |
| Analytics | Usage analytics | PostHog, Plausible (privacy-friendly) |
| Customer Support | Ticketing / chat | Intercom, Crisp, Zendesk |

---

# PART E — QUALITY, SECURITY & COMPLIANCE

## 18. Non-Functional Requirements

### 18.1 Performance
- Page load (P95): < 2 seconds on 4G
- Time-to-interactive: < 3 seconds
- AI draft generation: < 30 seconds (typical document)
- Voice transcription: real-time + < 10 seconds finalization

### 18.2 Scalability
- Support 10,000 concurrent users at v1.5
- Horizontal scaling architecture
- Database connection pooling
- AI request queueing under load

### 18.3 Availability
- Target uptime: 99.5% (v1) → 99.9% (v2)
- Planned maintenance windows: off-peak hours (Pakistan time)
- Status page for outages

### 18.4 Reliability
- Auto-restart via PM2 (production)
- Database backups: every 6 hours (incremental), daily full
- Failed AI request retry with exponential backoff

### 18.5 Browser Support
- Chrome, Edge, Firefox, Safari — last 2 major versions
- Mobile browsers: iOS Safari 16+, Chrome Android

---

## 19. Security, Privacy & Data Protection

**Status:** Partial decisions in Brainstorm Q9 (per-user isolation confirmed). 4 sub-decisions deferred (training use, storage location, Gemini concern, retention).

### 19.1 Confirmed Approach
- Per-user authentication-based data isolation
- Each lawyer sees ONLY their own cases, drafts, and client information
- Firm-internal data isolation between firms

### 19.2 Default Security Posture (proposed — to confirm)
- TLS 1.3 for all connections
- Encryption at rest for sensitive fields (client names, case details)
- Bcrypt password hashing
- JWT with short expiry + refresh token model
- CSRF protection on all mutating endpoints
- Rate limiting per user / IP
- Input sanitization to prevent injection attacks
- Content Security Policy (CSP) headers
- Regular security dependency updates

### 19.3 Open Sub-Decisions (deferred from Brainstorm Q9)
- **Sub-Q19.1 — AI Training Use:** Will lawyer/client data ever be used to improve the AI model? *Recommended default: Never use case/client data for training.*
- **Sub-Q19.2 — Data Storage Location:** Pakistan-local servers vs encrypted cloud (region TBD) vs client-side only?
- **Sub-Q19.3 — Gemini API Concern:** Sensitive case data passes through Google's servers during inference. Options: (a) accept with enterprise terms, (b) move to self-hosted model long-term, (c) hybrid public/private split.
- **Sub-Q19.4 — Data Retention:** Per-document retention controls? Auto-delete schedules? Lawyer-controlled deletion?

### 19.4 PDPB Compliance (Pakistan)
- Data Protection Officer designation (post-launch)
- User consent flows (clear, informed)
- User right to access / export / delete their data
- Data breach notification process
- Privacy policy (legally reviewed)

---

## 20. Audit Trail, Versioning & Backup/Recovery

### 20.1 Audit Trail
- Log every meaningful user action (create, edit, export, delete)
- Log every AI generation request with model + prompt version
- Log every authentication event (login, logout, failed attempts, password changes)
- Audit logs retained minimum 1 year
- Lawyer-viewable activity log for their own actions

### 20.2 Document Versioning
- Every draft saved as immutable version
- Lawyer can view version history of any document
- Restore previous version capability
- Diff view between versions

### 20.3 Backup & Recovery
- Database: incremental backups every 6 hours; full backup daily
- Retention: 30 days rolling
- Off-site backup replication
- Recovery time objective (RTO): < 4 hours
- Recovery point objective (RPO): < 6 hours
- Quarterly disaster recovery drill

---

## 21. Validation, Testing & Quality Assurance

**Purpose:** Operationalize Module 5 (Validation Mode) and define accuracy QA process.

### 21.1 Solved-Case Testing Methodology
- Build test corpus of 50+ solved Pakistani cases
- For each case: facts + party role + actual filed document + judgment
- Run AI through Forward Mode (facts → draft) and compare to actual
- Run AI through Reverse Mode (judgment → analysis) and compare to known facts
- Score using LEGAL-03 (Legal Comparator) skill

### 21.2 Accuracy Scoring Rubric
- Citation accuracy: % of cited references that are correct and verifiable
- Argument completeness: % of expected arguments covered
- Structural compliance: 100% pass/fail (court format adherence)
- Hallucination rate: % of fabricated citations or invented "facts"

### 21.3 Continuous QA
- Every template change triggers re-validation against test corpus
- Monthly accuracy report per template category
- Regression testing on every model update / prompt change

### 21.4 Beta Testing
- 5–10 trusted lawyer partners
- Real-case usage with full lawyer oversight
- Structured feedback collection (rubric + free-form)
- Weekly review of beta findings

---

# PART F — LEGAL & OPERATIONS

## 22. Legal & Regulatory Compliance

### 22.1 Bar Council Positioning
- Tool positioned as **drafting and research assistant** — not a substitute for a lawyer
- All output requires lawyer review before use
- Lawyer always responsible for final document and legal advice
- Clear "AI-assisted" labeling on all outputs

### 22.2 Unauthorized Practice of Law (UPL)
- Tool does not provide legal advice to non-lawyers
- AI Legal Advisor explicitly refuses to act as lawyer for direct consumer use
- For Student tier: outputs watermarked "FOR EDUCATIONAL USE ONLY — NOT FOR COURT FILING"
- Terms of service make user responsibility explicit

### 22.3 Disclaimers
- Every document export carries footer disclaimer
- Tool does not establish attorney-client privilege
- AI may make errors; lawyer must verify

### 22.4 PDPB Compliance (Pakistan Personal Data Protection Bill)
- Data Protection Officer designation
- Privacy policy (legally reviewed)
- User rights: access, export, delete
- Data breach notification process
- Cross-border transfer compliance (relates to Sub-Q19.3 Gemini decision)

### 22.5 Other Regulatory
- Tax compliance (FBR registration as service provider)
- Consumer protection compliance
- Cybercrime law (PECA) compliance for the platform itself

---

## 23. Pricing, Billing & Subscription System

**Status:** Pricing tiers DEFERRED (Brainstorm Q7). System architecture below.

### 23.1 Subscription System Requirements
- Recurring monthly billing
- Annual billing option (with discount)
- Trial period management (auto-conversion or expiration)
- Plan upgrade / downgrade
- Pro-ration on plan changes
- Failed payment retry logic
- Dunning emails for failed payments
- Cancellation flow (with feedback capture)

### 23.2 Per-Draft Billing (TBD)
- Wallet / credits model OR direct charge per document
- Refund policy for failed AI generations

### 23.3 Invoicing
- Auto-generated invoices (PDF) per transaction
- Invoice download from user dashboard
- Tax (GST/sales tax) calculation as required

### 23.4 Pricing Tiers (DEFERRED to dedicated session — Brainstorm Q7)
- Free Trial: TBD limits
- Student: TBD amount (self-declared at signup; abuse-detection layer added post-v1 if needed)
- Solo Pro: TBD monthly
- Firm: TBD per-seat
- Pay-per-Draft: TBD per document

---

## 24. Monitoring, Analytics & Customer Support

### 24.1 Monitoring
- Uptime monitoring (external service)
- Error tracking (Sentry or equivalent)
- Performance monitoring (Web Vitals)
- AI request success/failure tracking
- Cost monitoring (AI API spend)

### 24.2 Analytics
- Privacy-friendly analytics (no PII)
- Feature adoption metrics
- Funnel: signup → first draft → repeat usage → subscription conversion
- Per-tier behavior analysis
- Template usage frequency
- Module engagement

### 24.3 Customer Support
- Email support (all tiers)
- Live chat (Solo Pro + Firm tiers)
- Knowledge base / FAQ
- Tutorial videos (English + Urdu)
- SLA per tier (response time targets TBD)
- Bug report flow with logs attached

---

## 25. Beta Strategy & Phased Launch Plan

### 25.0 Startup / Day Zero Plan

**Purpose:** Bridge strategy and the phased plan with the first 30 days of concrete, operational actions. Answers the question: *"What do we do first? Where does the startup begin?"*

#### 25.0.1 Where We Stand Today (Snapshot — 2026-04-20)
- Vision + Brainstorm Q&A locked: 6 firm decisions, 4 deferred (see [Brainstorm-Vision-QA.md](./Brainstorm-Vision-QA.md))
- Working Next.js MVP exists at `d:/AI legal System/ai-legal-system/` with: 100+ templates, Gemini AI generation, voice intake, AI advisor chat, tax calculator, JWT auth, document dashboard, PM2 auto-restart
- This PRD draft v0.1 — strategic structure complete, functional details still TBD
- Key blockers: solved case files corpus, USB performa inventory

#### 25.0.2 Day 0 (Today / This Week) — Foundation
1. Team comms channel set up (WhatsApp / Slack — Abdullah, Hamza)
2. Shared workspace confirmed (xyric-wiki repo cloned, `PRODUCTS/taqiai/` accessible by team)
3. Daily 15-minute sync schedule agreed (start time + days)
4. Working environment verified — Next.js MVP running locally for Abdullah, accessible for review
5. PRD v0.1 reviewed by Hamza for sign-off / pushback

#### 25.0.3 Week 1 — Unblock Inputs
1. **Collect first 5 solved case files** (civil + criminal mix) — for LEGAL-03 testing
2. **Abdullah inventories USB performa drive** — categorized list (master template name → category → status: ready / needs digitization)
3. **First 1 template digitized end-to-end** as a reference (e.g., one Affidavit) — used to validate format, schema, bilingual approach
4. **Final product name candidate shortlist** (closes Q8 first stage) — 3 names + trademark availability check
5. Resolve Q9 sub-decisions critical for engineering: data storage location, training-use policy

#### 25.0.4 Week 2 — First Sprint
1. Build first 5 master templates from USB performa library (highest-frequency types)
2. Run LEGAL-01/02/03 skills against first 2 collected case files
3. Capture accuracy baseline (citations, arguments, hallucination rate)
4. Hamza drafts pricing tier proposal (closes Q7 first stage)
5. Existing MVP feature audit — what already works vs what needs upgrade for Phase 1

#### 25.0.5 Weeks 3-4 — Cycle In
1. Expand to 10 templates digitized + verified
2. Continue LEGAL-03 validation runs on more cases
3. First weekly accuracy review with Abdullah
4. Lock final product name + start branding work
5. Engineering scoping — what Phase 1 → Phase 4 build needs

#### 25.0.6 First Concrete Action — RIGHT NOW

**The single most important first step:** Abdullah inventories the USB performa drive (Brainstorm Q6 Track 1 dependency). Without this list, the entire template library effort is blocked.

- **Estimated time:** 1-2 hours
- **Output file to create:** `PRODUCTS/taqiai/USB-Performa-Inventory.md`
- **Format:** markdown table — columns: Template Name | Category | Sub-type | Source File on USB | Status (Ready / Needs Digitization / Needs Verification)

#### 25.0.7 Ownership Matrix (First 30 Days)

| Action | Owner | Deadline |
|--------|-------|----------|
| USB performa inventory | Abdullah | Week 1 |
| First 5 case files collected | Abdullah | Week 1 |
| Daily sync schedule | Hamza | Day 0 |
| Pricing proposal draft | Hamza | Week 2 |
| Privacy sub-decisions (Q9.1–Q9.4) | Abdullah + Hamza | Week 1 |
| Product name shortlist | Team | Week 1 |
| First template digitized end-to-end | Abdullah | Week 1 |
| First 5 templates verified | Abdullah | Week 2 |
| LEGAL-01/02/03 first runs | Engineering | Week 2 |
| Accuracy baseline report | Engineering + Abdullah | Week 4 |

#### 25.0.8 Exit Criteria — When Day Zero Ends and Phase 1 Formally Begins

- [ ] Team comms operational
- [ ] USB inventory complete
- [ ] At least 5 solved case files collected
- [ ] At least 5 templates verified
- [ ] LEGAL-01/02/03 baseline accuracy measured on 2+ cases
- [ ] Open decisions Q7, Q8, Q9 reduced to concrete options on the table (not necessarily final)

---

> **Status (2026-06-19):** All phases below are complete — the product is built and live. The phase plan is retained as historical record.

### 25.1 Phase 1 — Internal Skills (✅ Done)
- Build LEGAL-01, LEGAL-02, LEGAL-03 Claude skills
- Establish testing framework
- Validate with first 5–10 solved cases

### 25.2 Phase 2 — Testing & Iteration
- Expand corpus to 50+ solved cases (covering all template categories per Q5 decision)
- Iterate skills based on lawyer feedback
- Targets: >90% citations, >80% arguments, <10% hallucination, 100% structural

### 25.3 Phase 3 — PRD Finalization
- This document → v1.0 final
- Tech Architecture document (EXPERT-27)
- Engineering team kickoff

### 25.4 Phase 4 — Closed Beta

**Beta pool source:** Abdullah's personal professional network — mix of:
- Law students (friends studying at law schools)
- Solo advocates (practicing lawyer friends)
- Senior lawyers (mentors / seasoned practitioners)

All handle mixed case types — civil, criminal, family, property, corporate. Geographic mix emerges naturally from the network (not forced).

**Beta workflow:**
1. Give network access to TaqiAI
2. They use it on real cases / practice scenarios
3. They **find mistakes / flag issues** → report back to Abdullah
4. Team iterates fixes (template corrections, prompt improvements, new templates)
5. Cycle repeats until the network gives collective "OK" on quality

**Launch gate (from beta → public):** When the trusted beta group collectively says the platform is production-quality, THEN TaqiAI launches to the broader Pakistani legal market. No calendar-based launch — quality-gated launch only.

**Feedback capture (to be set up):**
- Dedicated feedback channel (WhatsApp group / Slack) for real-time issue reporting
- Per-document feedback form (rubric + freeform) for structured data
- Weekly short sync (virtual) for grouped discussion and prioritization

**Beta incentive (to be finalized):**
- Free unlimited access during beta
- "Founding Advocate" credit at public launch (name on credits page with consent)
- Lifetime discount on Solo Pro subscription post-launch (exact % TBD)

**Duration:** Open-ended — runs until the beta group certifies quality. Expected: 3-6 months, but timeline is outcome-driven, not date-driven.

### 25.5 Phase 5 — Public Launch (Note: revised from Product-Vision Phase 5)
- **Original Product-Vision plan was "criminal defense first"** — this is REVISED per Brainstorm Q5
- New plan: **Full library launch** (no phased document rollout)
- All 120–150 templates verified and live at launch
- Marketing focused on "complete coverage from Day 1" differentiator
- Geographic launch: all four provinces + ICT simultaneously
- Language launch: English + Urdu both Day 1 (per Q3)

### 25.6 Post-Launch
- v1.5 features (multi-user firm, native mobile)
- v2 features (Voice deep analysis, Image OCR, expanded templates, RAG case law)
- Geographic expansion (India, Bangladesh, Sri Lanka)

---

# PART G — REFERENCE

## 26. Risks, Dependencies & Open Questions

### 26.1 Key Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| AI hallucination of citations | Critical | Verified templates + citation safety + multi-stage verification + mandatory lawyer review |
| Lawyer trust / adoption resistance | High | Internal-first accuracy track record; "assistant not replacement" positioning; proven quality track record before launch |
| Pakistani case law data scarcity | Medium | Start with Supreme Court (well-digitized); incrementally expand to High Courts |
| Regulatory pushback (Bar Council) | Medium | Position as drafting assistant; lawyer always responsible; legal review of positioning |
| Pricing mismatch with market | Medium | PKR-denominated tiers; per-draft option; free trial; firm licensing offsets solo pricing |
| Full-library scope (Q5) timeline | High | Two-track sourcing strategy (USB + research); start template work in parallel with skills validation |
| Bilingual (Q3) technical complexity | Medium | Use proven i18n framework; Nastaliq font well-documented; phased rollout of advanced features (RTL polish, etc.) |
| Data privacy / Gemini API concerns | High | Resolve Sub-Q19.1–19.4 before launch; consider hybrid local model architecture for sensitive data |
| Abdullah availability for template review | Medium | Define review cadence; prepare templates in batches to reduce review burden |
| Competition from global players entering Pakistan | Low | First-mover advantage + jurisdiction depth (PPC/CrPC/CPC) takes years to replicate |

### 26.2 Dependencies

| Dependency | Owner | Status |
|------------|-------|--------|
| Solved case files corpus | Abdullah | In progress |
| USB performa inventory | Abdullah | Not started |
| Bar Council relationship / blessing | Hamza | Not started |
| PDPB compliance review | External legal counsel | Not started |
| Pricing market research | Hamza | Pending (Q7 deferred) |
| Final product name + branding | Team | Pending (Q8 deferred) |
| Pakistani law knowledge base assembly | Abdullah + research team | Not started |
| Nastaliq font licensing | Engineering | Not started |

### 26.3 Open Questions (Aggregated from Brainstorm Q&A)

**Still open (business decisions):**

| # | Question | Source | Owner |
|---|----------|--------|-------|
| OQ-01 | PKR pricing tiers (all tiers) | Q7 | Hamza |
| OQ-03 | AI training use of client data — confirm "never" policy | Q9.1 | Abdullah + Hamza |
| OQ-04 | Data storage location / hosting region (Pakistan-local vs cloud) | Q9.2 | Engineering |
| OQ-05 | Long-term sensitive-data strategy (Gemini vs self-hosted) | Q9.3 | Engineering + Hamza |
| OQ-06 | Data retention controls (per-doc, auto-delete, lawyer-controlled) | Q9.4 | Abdullah + Engineering |

**Resolved (product is built & live):**

| # | Question | Resolution |
|---|----------|-----------|
| OQ-02 | Final product name | RESOLVED — **TaqiAI** |
| OQ-08 | Section 6 functional requirements per module | RESOLVED — all 13 modules built & live (EPIC-01..EPIC-13) |
| OQ-09 | Section 7 user flows | RESOLVED — flows implemented in the live app |
| OQ-10 | Section 12 UI/UX (design system, layouts) | RESOLVED — "Midnight Qanoon" dark cyan/violet Tailwind design system |
| OQ-11 | Section 14.2 architecture (DB, search) | RESOLVED — Prisma + SQLite app DB; read-only `judgments.db` + semantic search service; `statutes.db`; direct Gemini API. (Hosting region OQ-04 still open.) |
| OQ-12 | Section 15 data model | RESOLVED — implemented in the live Prisma schema |
| OQ-13 | Section 17 integration choices | RESOLVED for AI (Google Gemini); payment/SMS providers tie to the still-open pricing/hosting decisions |

---

## 27. Timeline, Milestones & Glossary

### 27.1 High-Level Timeline (indicative — to be firmed up after open-question resolution)

| Phase | Status | Key Deliverable |
|-------|--------|-----------------|
| Phase 1 — Skills validation | ✅ Done | First cases tested; accuracy baseline |
| Phase 2 — Skills iteration | ✅ Done | Accuracy iteration |
| Phase 3 — PRD finalization + Tech Architecture | ✅ Done | This PRD reconciled to v1.0 |
| Phase 4 — Engineering build | ✅ Done | All 13 modules + template library + bilingual UI |
| Phase 5 — Closed beta | ✅ Done | Lawyer-partner feedback cycles |
| Phase 6 — Public launch | ✅ Live | Full library, full bilingual, all 13 modules live |

> **Note:** The product is built and live. Remaining open items are business decisions only (PKR pricing tiers, data-privacy/PDPB policy, final hosting region).

### 27.2 Milestones

| ID | Title | Status |
|----|-------|--------|
| M-001 | Product Discovery Complete | ✅ Done (2026-02-22) |
| M-002 | First Case Testing | Pending NS-011 |
| M-003 | Accuracy Baseline Established | Pending M-002 |
| M-004 | Skills Iteration Complete | Pending M-003 |
| M-005 | Recording Insights: Drafting Pivot Confirmed | ✅ Done (2026-02-22) |
| M-006 | Vision-Brainstorm Decisions Captured | ✅ Done (2026-04-20) |
| M-007 | PRD v0.1 Draft Complete | ✅ Done (2026-04-20) |
| M-008 | PRD v1.0 — Reconciled to Built & Live | ✅ Done (2026-06-19) |
| M-009 | Tech Architecture (Prisma+SQLite, judgments.db, semantic service) | ✅ Done |
| M-010 | Template Library Built & Verified | ✅ Done |
| M-011 | Court-Case Drafting Templates Built & Verified | ✅ Done |
| M-012 | Engineering Build Phase | ✅ Done — 13 modules shipped |
| M-013 | Closed Beta | ✅ Done |
| M-014 | Public Launch | ✅ Live |
| M-015 | Lawyer Diary Module Spec Complete | ✅ Done (2026-05-06) |

### 27.3 Glossary

| Term | Definition |
|------|-----------|
| **Master Template** | Top-level legal framework template (e.g., "Affidavit Master") that supports multiple sub-variants |
| **Template Variant** | Sub-type of a master template (e.g., "Property Affidavit" within Affidavit Master) |
| **Forward Mode** | Workflow direction: case facts → AI → drafted document |
| **Reverse Mode** | Workflow direction: court judgment → AI → structured analysis (Case Analyzer) |
| **Validation Mode** | Internal QA capability comparing AI draft vs actual filed document |
| **Verified Template** | A template reviewed and approved by Abdullah before going live |
| **Citation Safety** | The principle that AI never invents citations; only references the verified knowledge base |
| **Lawyer-in-the-loop** | Mandatory human (lawyer) review gate before any document export |
| **PPC** | Pakistan Penal Code |
| **CrPC** | Code of Criminal Procedure (Pakistan) |
| **CPC** | Code of Civil Procedure (Pakistan) |
| **Qanun-e-Shahadat** | Pakistani Evidence Law |
| **PECA** | Prevention of Electronic Crimes Act 2016 |
| **PLRA** | Punjab Land Records Authority |
| **FBR** | Federal Board of Revenue (Pakistan) |
| **PDPB** | Personal Data Protection Bill (Pakistan) |
| **HEC** | Higher Education Commission (Pakistan — used for student verification) |
| **Bar Council** | Pakistan Bar Council / Provincial Bar Councils |
| **UPL** | Unauthorized Practice of Law |
| **Nastaliq** | The calligraphic Urdu script style required for professional Pakistani Urdu documents |
| **LEGAL-01 / 02 / 03** | Internal Claude skills: Case Analyzer / Legal Drafter / Legal Comparator |
| **Judgment Library** | The platform's searchable corpus of Pakistani court judgments (pre-loaded landmark cases + lawyer-uploaded judgments) |
| **Ratio Decidendi** | The binding legal principle established by a court judgment (the "reason for deciding") |
| **Obiter Dicta** | Non-binding observations made by a court in a judgment (persuasive but not binding) |
| **Matter** | A legal matter / case in a lawyer's chamber portfolio — the top-level unit in Chamber Management |
| **Hearing Date** | A scheduled court hearing for a matter; tracks date, time, court, type, and adjournment history |
| **Chamber Management** | Module 7 — the case portfolio, hearing timetable, and deadline tracker for a lawyer's chamber |
| **Adjournment** | Postponement of a court hearing to a new date; tracked in HearingDate history |
| **Today's List** | The day-view in Chamber Management showing all of a lawyer's hearings for the current day |
| **Limitation Period** | The statutory deadline within which a legal action must be filed (governed by Limitation Act 1908) |
| **SCMR** | Supreme Court Monthly Review — citation format for Supreme Court judgments (e.g., 2023 SCMR 1450) |
| **PLD** | Pakistan Legal Decisions — citation format for Supreme Court + High Court judgments (e.g., 2021 PLD Lahore 234) |
| **PCrLJ** | Pakistan Criminal Law Journal — criminal law judgments citation format |
| **MLD** | Monthly Law Digest — citation format for various court judgments |
| **CLC** | Civil Law Cases — civil law judgments citation format |
| **YLR** | Yearly Law Reporter — citation format for various courts |
| **PLJ** | Pakistan Law Journal — High Court citation format (e.g., 2020 PLJ Lahore 450) |
| **PTD** | Pakistan Tax Decisions — tax-related judgments |
| **NLR** | National Law Reporter — Lahore High Court citations |
| **SBLR** | Sindh Balochistan Law Reports — Sindh and Balochistan High Court citations |
| **ATC** | Anti-Terrorism Court — special court for terrorism-related cases |
| **NAB** | National Accountability Bureau — accountability courts for corruption cases |
| **NS-XXX** | Next Step task identifier |
| **REC-XXX** | Recording / discussion log identifier |
| **M-XXX** | Milestone identifier |
| **D-XXX** | Open Decision identifier |

---

## APPENDIX A — Decision Source Index

All decisions in this PRD trace back to documented sources:

| Decision | Source | Document |
|----------|--------|----------|
| 5 modules (not 3) | Brainstorm Q4 | [Brainstorm-Vision-QA.md](./Brainstorm-Vision-QA.md) |
| Voice phased v1/v2 | Brainstorm Q1 | [Brainstorm-Vision-QA.md](./Brainstorm-Vision-QA.md) |
| Law students primary user | Brainstorm Q2 | [Brainstorm-Vision-QA.md](./Brainstorm-Vision-QA.md) |
| Full bilingual Day 1 | Brainstorm Q3 | [Brainstorm-Vision-QA.md](./Brainstorm-Vision-QA.md) |
| Full library before launch | Brainstorm Q5 | [Brainstorm-Vision-QA.md](./Brainstorm-Vision-QA.md) |
| Two-track template sourcing | Brainstorm Q6 | [Brainstorm-Vision-QA.md](./Brainstorm-Vision-QA.md) |
| Per-user data isolation | Brainstorm Q9 | [Brainstorm-Vision-QA.md](./Brainstorm-Vision-QA.md) |
| Solved case corpus strategy | Brainstorm Q10 | [Brainstorm-Vision-QA.md](./Brainstorm-Vision-QA.md) |
| 120–150 master templates | Vision (both) | [Product-Vision.md](./Product-Vision.md), [VISION.md](../../../VISION.md) |
| Pakistani-only jurisdiction | Vision (both) | [Product-Vision.md](./Product-Vision.md), [VISION.md](../../../VISION.md) |
| Tagline "AI assists, lawyers verify and finalize" | Vision (both) | [Product-Vision.md](./Product-Vision.md), [VISION.md](../../../VISION.md) |
| Accuracy targets (>90% / <10% / etc.) | Product-Vision Section 6 | [Product-Vision.md](./Product-Vision.md) |
| 4 interaction modes | Vision (both) | [Product-Vision.md](./Product-Vision.md), [VISION.md](../../../VISION.md) |

---

## APPENDIX B — Sections Requiring Detailed Walk-through

The following sections have skeleton structure but need section-by-section discussion to finalize:

| Section | Topic | Estimated Discussion Time |
|---------|-------|--------------------------|
| 6 | Functional Requirements per Module | 1–2 sessions per module (5+ sessions total) |
| 7 | User Flows & Journeys | 2 sessions |
| 8 | Document Template System detailed specs | 1 session |
| 9 | AI Model Strategy detailed specs | 1 session |
| 10 | Citation Knowledge Management workflow | 1 session |
| 12 | UI/UX detailed requirements | 2–3 sessions (with design input) |
| 13 | Onboarding & Help System | 1 session |
| 14.2 | Architecture decisions (DB, hosting, etc.) | 1 session (with engineering) |
| 15 | Detailed Data Model / Schema | 1 session (with engineering) |
| 17 | Integration provider selection | 1 session |
| 19 | Privacy sub-decisions (Q9.1–Q9.4) | 1 session (with privacy/legal counsel) |
| 23.4 | Pricing tiers (Q7) | 1 session (with Hamza) |

---

**End of PRD v1.0 — Built & Live.**

The product is fully built and shipping 13 live modules (EPIC-01..EPIC-13). This document has been reconciled to the live implementation. Remaining open items are business decisions only: PKR pricing tiers (OQ-01), data-privacy/PDPB policy and retention (OQ-03–OQ-06), and final hosting region (OQ-04).
