# TaqiAI — Vision

- Status: `locked`
- Last updated: 2026-07-02
- Author: ai (drafted) + Nuoman/Abdullah (reviewer)
- Personalization gate: see `personalization-gate.md` → Vision

## 1. Executive Summary

TaqiAI is an AI-native legal practice platform built specifically for **Pakistani advocates**. It turns the daily work of a chamber — drafting court documents, researching case law and statutes, analysing a client's matter, managing hearings — into fast, grounded, verifiable AI-assisted flows. Unlike generic AI writing tools, every output is grounded in **actual Pakistani law**: a corpus of 100,000+ reported and unreported judgments, the full federal + four-provincial statute book, and a library of verified drafting templates. The differentiator is **accuracy under a lawyer's professional risk**, not novelty — the product exists to make a working advocate faster without ever putting a fabricated citation or a wrong section in front of a court.

## 2. The Problem

A Pakistani advocate's billable hours are consumed by high-volume, repetitive, high-stakes document and research work:

- **Drafting** bail applications, plaints, affidavits, sale deeds, powers of attorney, and dozens of other instruments — each following a rigid structural convention where a missing clause or wrong recital is a real filing risk.
- **Case-law research** across a fragmented body of judgments (Supreme Court, Federal Shariat Court, five High Courts, special and district courts) with no single reliable, searchable index — citations are looked up by memory or by paid, closed services.
- **Statute lookup** in a body of law that is amended constantly, where citing a repealed or superseded section is a live hazard.
- **Client intake** that happens verbally, in Urdu or mixed Urdu-English, and must be turned into a structured case and a court-ready document.
- **Practice management** — tracking which matter has a hearing tomorrow, in which court, for which client.

Today's options fall short: generic LLM tools **hallucinate citations and sections** (unacceptable professional risk); foreign legal-AI products (Harvey, Casetext) do not know Pakistani law, courts, or Urdu; local competitors (e.g. DigiLawyer) offer search but not grounded end-to-end drafting, analysis, and advice; and manual practice is slow. The gap is a product that is **fast like an LLM but trustworthy like a verified reference**, and that speaks the advocate's language and jurisdiction.

## 3. Vision Statement

TaqiAI becomes the **default working surface of a Pakistani legal chamber** — the place an advocate opens to draft, research, analyse, and manage a matter from first client conversation to filed document. It carries the jurisdiction's law inside it (judgments, statutes, verified templates), speaks English and Urdu natively, and shows the advocate *how sure it is* and *what it relied on* for every AI output — so the lawyer stays in control, professional risk stays bounded, and hours of manual drafting and research collapse into minutes of review-and-approve.

## 4. Capabilities (the spine the whole chain traces back to)

> Each capability has an ID. Every PRD requirement traces up to exactly one of these. These correspond to the product's shipped modules.

| ID | Capability | What it lets the user do | Why it matters |
|----|------------|--------------------------|----------------|
| CAP-1 | Template-based Legal Drafting (Forward Mode) | Produce a court-ready Pakistani draft from case facts + a verified master template, in English or Urdu, across 12+ legal categories | Core daily workload; a verified template + no fabricated facts is the accuracy floor |
| CAP-2 | Case Analysis (Reverse Mode) | Decompose a matter — transcript, judgment, FIR, file — into parties, facts, issues, applicable law, and a suggested document | Turns unstructured intake into a structured, draftable case |
| CAP-3 | AI Legal Advisor | Ask conversational, citation-safe Pakistani legal questions and get grounded guidance, procedure, and precedent | An always-available junior that never invents law |
| CAP-4 | Judgment Intelligence Library | Search, retrieve, summarise, and extract ratio from 100K+ Pakistani judgments by citation, section, or meaning | Case-law research without a paid closed service |
| CAP-5 | Statute & Citation Search | Look up a section in a chosen statute (PPC, CrPC, CPC, MFLO, etc.) and get the provision + a citation-safe explanation grounded in the latest Act text | Never cite a repealed or non-existent section |
| CAP-6 | Tax & Fee Calculator | Compute per-province property/transaction charges (Stamp Duty, CVT, PLRA, Registration Fee, FBR WHT §236K/§236C, CGT) with an auditable rate + base for every line | Deterministic, court/registry-defensible numbers — never LLM-guessed |
| CAP-7 | Voice Intake & Case Building | Record or upload an advocate–client discussion, get a faithful verbatim transcript, then an analysis and a drafted case document | Captures the real (spoken, code-switched) intake channel |
| CAP-8 | Document OCR / Copy-from-Photo | Photograph a printed or handwritten legal document and get exactly what is written, line by line | Digitises the paper reality of Pakistani practice |
| CAP-9 | Legal Translation | Translate legal text or document images between Urdu, English, and Arabic, preserving legal meaning and every proper noun/number/date | Bilingual courts and clients; structured deed/certificate translation |
| CAP-10 | Draft Editing | Apply a requested surgical change to an existing draft and get the full updated document with everything else preserved exactly | Revision is as common as creation; must not corrupt the untouched document |
| CAP-11 | Drafting Field Suggestions | Get realistic, Pakistan-appropriate suggested values for the drafting-form field being filled | Speeds entry without fabricating binding identity facts |
| CAP-12 | Case & Matter Management (Chamber + Diary) | Track matters, clients, courts, documents, and hearings; see the next hearing and a unified cause list | The practice-management spine that ties documents to real cases |
| CAP-13 | Accuracy Validation & Trust Layer | Show a confidence signal and the evidence behind every AI output; validate generated drafts against solved cases | Accuracy-first is the core differentiator — it must be *provable*, not asserted |

## 5. Target Output / What "good" looks like

- A **court-ready draft** an advocate can review, approve, and file with only minor personalisation — correct structure, correct recitals, no fabricated facts, no invented citations, exportable to PDF.
- A **grounded answer** in the Advisor that names the actual sections and judgments it relied on, refuses when it cannot ground, and adapts to a lawyer vs a student.
- A **judgment search result** that returns real citations (SCMR/PLD/PCrLJ/MLD/CLC/YLR/PLJ/NLR) with plain-language summaries and a "verify citation exists" check.
- An **auditable calculation** where every charge shows its rate and its base, reproducible by hand.
- A **confidence signal** beside every AI output so the lawyer knows how far to trust it.

Concretely: an advocate opens TaqiAI in the morning, sees today's hearings, drafts a bail application in minutes with grounded sections, checks one precedent, and files — without leaving the app or risking a hallucinated citation.

## 6. Target Users

| Persona | Context | Primary need | Lead? |
|---------|---------|--------------|-------|
| Practising Advocate | Runs a chamber; drafts and files daily across civil/criminal/family/property | Fast, grounded, court-safe drafting + research + practice management | **Yes** (set at gate) |
| Junior Associate / Clerk | Prepares first drafts and gathers case law for a senior | Structured intake, template drafting, judgment search | No |
| Law Student / Researcher | Learning procedure and precedent | Explained answers, statute/section lookup, judgment summaries | No |
| Client (indirect) | Provides facts, often verbally in Urdu | To be understood and have their matter captured faithfully | No |

## 7. Product Principles ("X over Y")

- **Grounding over fluency** — an answer with a real citation beats a well-written guess; refuse rather than fabricate.
- **Verified templates over free generation** — never draft a legal instrument without a verified master template behind it.
- **Lawyer-in-control over automation** — every AI output is a reviewable draft with an approval gate, never an auto-filed action.
- **Auditable over magical** — deterministic numbers (tax/fees) and shown evidence (citations, confidence) over opaque output.
- **Jurisdiction-native over generic** — Pakistani courts, sections, citation formats, Urdu/Roman-Urdu, provincial variation are first-class, not an afterthought.
- **Faithful capture over helpful embellishment** — OCR, transcription, and translation reproduce what exists; they never "improve" the source.

## 8. Quality Bar

> Best-practice defaults the AI applies by default — listed for visibility, not gated.

- **Accuracy targets:** citation accuracy > 90%, argument completeness > 80%, hallucination rate < 10%, structural compliance 100% (see CAP-13).
- **Anti-hallucination:** grounded retrieval (RAG) before any legal claim; no invented sections or citations; explicit refusal when grounding is unavailable.
- **Security defaults:** authentication on all non-public routes, secrets never logged, rate limiting on expensive AI endpoints, input validation on all payloads.
- **Bilingual + RTL:** correct Urdu (Nastaliq) rendering, proper legal line-spacing, no proper-noun/number corruption in translation.
- **Reliability:** graceful degradation (e.g. semantic search falls back to keyword search when the embedding service is down).
- **Accessibility:** WCAG 2.1 AA on interactive UI; reduced-motion support.

## 9. Explicitly Out of Scope (this version)

- Automated e-filing or direct submission to any court/registry system.
- Binding legal advice without lawyer review — TaqiAI assists; the advocate remains the professional of record.
- Jurisdictions outside Pakistan.
- Paid closed-source judgment/journal scraping (e.g. DigiLawyer, paid reporters) — corpus is built only from free/legal sources.
- Model fine-tuning — grounding is via retrieval (RAG), not custom-trained weights.
- Billing/accounting, client CRM beyond matter+contact, and courtroom scheduling integrations.

## 10. Risks & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| AI hallucinates a citation or section | Med | High | RAG grounding in real judgments/statutes; citation-verify endpoint; confidence layer (CAP-13); refusal behaviour |
| Corpus incompleteness (missing courts/years) | High | Med | Free/legal multi-source scraping pipeline; keyword fallback; label reported/unreported and reliability |
| Doc–code drift (docs claim SQLite while code is Postgres) | Med | Med | This Blueprint set is the current-state source of truth; traceability matrix; alignment as a maintenance habit |
| Auth/secret fallback (default JWT secret) | Med | High | Governance phase (Phase 5) removes fallback, fails fast, rotates secret |
| Gemini API outage/quota | Med | Med | Model fallback chain (2.5-flash → lite → 1.5 → 2.0); user-safe error normalisation |
| Legal/professional liability from a bad output | Low | High | Lawyer-approval gate on every draft; "AI assists, does not advise" stance; out-of-scope e-filing |
| Provincial legal variation errors | Med | Med | Per-province statute corpus and per-province tax rules; deterministic calculator |

## What NOT to include here

- Revenue models, TAM, unit economics, pricing, go-to-market, business KPIs. Intent only. (Pricing/monetisation are tracked separately in product-management docs, not this vision.)

## Validation gate (before `locked`)

- [x] Every capability has an ID and a clear user outcome.
- [x] No contradictions; no placeholder text remains.
- [x] No business/monetization content.
- [x] Personalization gate recorded and answered in `personalization-gate.md`.
- [x] `blueprint-progress.md` shows Vision = `locked`; `next-steps-handoff.md` points to PRD.
