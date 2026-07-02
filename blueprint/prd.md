# TaqiAI — PRD

- Status: `locked`
- Last updated: 2026-07-02
- Source vision: `vision.md` (`locked`)
- Personalization gate: see `personalization-gate.md` → PRD

## Personas

| ID | Persona | Goals | Frustrations today | Priority |
|----|---------|-------|--------------------|----------|
| P1 | Practising Advocate | Draft & file fast; research precedent; manage matters; stay court-safe | Manual drafting is slow; generic AI hallucinates; case law is fragmented/paid | **Lead** |
| P2 | Junior Associate / Clerk | Prepare first drafts; gather case law for a senior | No structured intake; repetitive template work | Secondary |
| P3 | Law Student / Researcher | Learn procedure & precedent | Sections/citations hard to verify; no explained answers | Tertiary |

## Requirements (grouped by Vision capability)

> Every requirement carries an ID `R<cap>.<seq>` and traces to a capability. MoSCoW is the v1 cut set at the gate.

### CAP-1 — Template-based Legal Drafting (Forward Mode)
#### R1.1 — Category-based document drafting
- **User story:** As an Advocate, I want to pick a legal category/subtype and fill a form, so that I get a court-ready draft grounded in a verified template.
- **Acceptance criteria (BDD):**
  - Given a selected category (civil/criminal/family/property/corporate/constitutional/immigration/tax/non-muslim/affidavit/agreement/POA/application) and a filled form, when I generate, then a structured HTML draft is produced following the template's clause structure.
  - Given a field the template requires but I left empty, when I generate, then the draft marks the gap rather than fabricating a value.
- **Success metric:** Structural compliance 100%; usable-without-major-edit rate ≥ 80%.
- **MoSCoW:** Must.
- **Best-practice defaults applied (not gated):** verified template gate, no fabricated facts, HTML sanitisation (dompurify), input validation.
- **Dependencies:** R11.1 (field suggestions), R1.2.

#### R1.2 — Bilingual draft output + PDF export
- **User story:** As an Advocate, I want the draft in English or Urdu and exportable to PDF, so that I can file it.
- **Acceptance criteria (BDD):**
  - Given a language choice, when I generate, then the draft renders in that language with correct legal line-spacing (Urdu Nastaliq at 2.8).
  - Given a finished draft, when I export, then a PDF is produced (html2pdf) preserving structure.
- **Success metric:** PDF export success ≥ 99%; no proper-noun/number corruption.
- **MoSCoW:** Must.

### CAP-2 — Case Analysis (Reverse Mode)
#### R2.1 — Matter decomposition → draft request
- **User story:** As an Advocate, I want to submit a transcript/judgment/FIR/file and get parties, facts, legal issues, applicable law, suggested document, and missing info.
- **Acceptance criteria (BDD):**
  - Given a case input, when I analyse, then a structured result lists parties, facts, issues, applicable sections, a suggested document type, and explicitly flagged missing info.
  - Given the analysis, when I accept it, then a `draftRequest` is produced that feeds the drafting engine (CAP-1).
- **Success metric:** Analytical field completeness ≥ 85%; suggested-document acceptance ≥ 70%.
- **MoSCoW:** Must.
- **Dependencies:** R1.1.

### CAP-3 — AI Legal Advisor
#### R3.1 — Grounded conversational guidance
- **User story:** As a user, I want to ask Pakistani legal questions in a chat and get citation-safe, grounded answers.
- **Acceptance criteria (BDD):**
  - Given a legal question, when I ask, then the answer is grounded in retrieved judgments/statutes and names the sources it used.
  - Given a question it cannot ground, when I ask, then it refuses or states uncertainty rather than fabricating.
  - Given a follow-up, when I continue, then it responds conversationally (ChatGPT-style) without forcing a template/judgment list every turn.
- **Success metric:** Citation accuracy > 90%; hallucination < 10%; grounded-source-shown rate 100% for legal claims.
- **MoSCoW:** Must.
- **Dependencies:** R4.x, R5.x (retrieval), R13.1 (confidence).

#### R3.2 — Tier-aware behaviour + persisted sessions
- **User story:** As a lawyer or a student, I want answers pitched to my level, and my chat history saved.
- **Acceptance criteria (BDD):**
  - Given a lawyer vs student tier, when I ask, then depth/terminology adapts accordingly.
  - Given a conversation, when I return, then prior sessions and messages are retrievable.
- **Success metric:** Session persistence 100%.
- **MoSCoW:** Should.

### CAP-4 — Judgment Intelligence Library
#### R4.1 — Citation, keyword & section search
- **User story:** As an Advocate, I want to search 100K+ judgments by citation, keyword, or section.
- **Acceptance criteria (BDD):**
  - Given a query, when I search, then matching judgments return with real citation, court, year, and a summary.
  - Given a citation, when I open it, then the full judgment text loads.
- **Success metric:** Search p95 < 1s (keyword); citation precision high.
- **MoSCoW:** Must.

#### R4.2 — Semantic (meaning) search with fallback
- **User story:** As a user, I want to search by meaning, not just keywords.
- **Acceptance criteria (BDD):**
  - Given a natural-language query, when the embedding service is up, then semantic nearest-neighbour results return.
  - Given the embedding service is down, when I search, then it transparently falls back to keyword search (no error to the user).
- **Success metric:** Zero user-facing failures on service outage (graceful degradation).
- **MoSCoW:** Should.

#### R4.3 — Summary, ratio & citation verification
- **User story:** As a user, I want a plain-language summary, ratio extraction, and a check that a cited case actually exists.
- **Acceptance criteria (BDD):**
  - Given a judgment, when I request a summary, then a grounded plain-language summary + ratio is returned.
  - Given a citation string, when I verify, then the system confirms whether it exists in the corpus.
- **Success metric:** Verified-citation correctness ≥ 95%.
- **MoSCoW:** Should.

### CAP-5 — Statute & Citation Search
#### R5.1 — Section lookup grounded in latest Act text
- **User story:** As a user, I want to look up a section in a chosen statute and get the provision + a citation-safe explanation.
- **Acceptance criteria (BDD):**
  - Given a statute + section query, when I search, then the actual provision text (FTS on statutes corpus) is returned with a plain-language explanation.
  - Given a section that does not exist, when I search, then the system says so rather than inventing one.
  - Given an amended/repealed provision, when returned, then its status (in-force/amended/superseded) is shown.
- **Success metric:** Zero invented sections; province/status shown 100%.
- **MoSCoW:** Must.

### CAP-6 — Tax & Fee Calculator
#### R6.1 — Deterministic per-province charge computation
- **User story:** As an Advocate, I want to compute property/transaction charges per province with a rate and base shown for each line.
- **Acceptance criteria (BDD):**
  - Given a province, transaction value, and party role, when I calculate, then Stamp Duty, CVT, PLRA, Registration Fee, FBR WHT (§236K buyer / §236C seller), and CGT are computed deterministically (no LLM).
  - Given any charge line, when shown, then its rate and its base are displayed and reproducible by hand.
- **Success metric:** 100% deterministic; numbers reproducible by manual calculation.
- **MoSCoW:** Must.
- **Best-practice defaults applied (not gated):** rules-based engine only, never an LLM for numbers.

### CAP-7 — Voice Intake & Case Building
#### R7.1 — Verbatim transcription
- **User story:** As an Advocate, I want to record/upload a client discussion and get a faithful verbatim transcript in the language spoken.
- **Acceptance criteria (BDD):**
  - Given an audio recording (English/Urdu/Roman-Urdu/mixed), when I transcribe, then verbatim text in the original language is returned (no translation, no summarisation).
- **Success metric:** Transcript faithfulness high; language preserved 100%.
- **MoSCoW:** Should.

#### R7.2 — Voice → case analysis → draft
- **User story:** As an Advocate, I want the transcript analysed into a case and drafted into a document.
- **Acceptance criteria (BDD):**
  - Given a transcript, when I analyse, then it flows into CAP-2 analysis and produces a drafted case document.
- **Success metric:** End-to-end voice→draft completion ≥ 70%.
- **MoSCoW:** Should.
- **Dependencies:** R2.1, R1.1.

### CAP-8 — Document OCR / Copy-from-Photo
#### R8.1 — Strict line-by-line extraction (incl. handwriting)
- **User story:** As an Advocate, I want to photograph a document (printed or handwritten) and get exactly what is written.
- **Acceptance criteria (BDD):**
  - Given a document image, when I extract, then text is transcribed line by line as written, with unclear parts marked, never "corrected" to what it should be.
  - Given the extracted text, when I choose, then it can feed image-typing in drafting or image translation (CAP-9).
- **Success metric:** Exact-extraction fidelity high; false-confidence (silent guessing) low.
- **MoSCoW:** Should.

### CAP-9 — Legal Translation
#### R9.1 — Meaning-preserving translation (free + structured)
- **User story:** As a user, I want to translate legal text or a document image between Urdu/English/Arabic, preserving every proper noun, number, and date.
- **Acceptance criteria (BDD):**
  - Given text or an image, when I translate, then legal meaning and structure are preserved and no proper noun/number/date is altered.
  - Given a structured document (Fard, Nikah Nama, ID Card, deed, certificate), when I translate, then a template-structured translation is produced.
  - Given a prior result, when I refine, then the edit is applied without corrupting the rest.
- **Success metric:** Proper-noun/number preservation 100%.
- **MoSCoW:** Should.

### CAP-10 — Draft Editing
#### R10.1 — Surgical in-place edit
- **User story:** As an Advocate, I want to request a change to an existing draft and get the full updated document with everything else preserved.
- **Acceptance criteria (BDD):**
  - Given a draft (HTML) + an edit request, when I apply, then only the requested change is made and the full document returns with structure/formatting and untouched parts intact.
- **Success metric:** Untouched-content preservation 100%; requested-change success ≥ 95%.
- **MoSCoW:** Must.

### CAP-11 — Drafting Field Suggestions
#### R11.1 — Context-appropriate field hints
- **User story:** As a user filling a drafting form, I want realistic, Pakistan-appropriate suggestions for the current field.
- **Acceptance criteria (BDD):**
  - Given a form field, when I request a suggestion, then a realistic Pakistan-appropriate value is offered as a hint the user confirms.
  - Given an identity field (CNIC, exact name, account number), when suggested, then only format/placeholder is offered, never a fabricated binding value.
- **Success metric:** Suggestion acceptance ≥ 50%; zero fabricated identity values.
- **MoSCoW:** Could.

### CAP-12 — Case & Matter Management (Chamber + Diary)
#### R12.1 — Matter & hearing management
- **User story:** As an Advocate, I want to create and track matters (client, court, case no., role, opponent, next hearing) with linked documents and hearings.
- **Acceptance criteria (BDD):**
  - Given a matter, when I create/edit it, then it stores client name/CNIC/phone, court, case type, role, opponent, judge, dates, notes, and linked document IDs.
  - Given a matter, when I add a hearing, then date/purpose/result/next-date are recorded.
- **Success metric:** CRUD reliability 100%; document-link integrity maintained.
- **MoSCoW:** Must.

#### R12.2 — Diary + dashboard cause list
- **User story:** As an Advocate, I want a diary and a dashboard showing the next hearing and a unified cause list.
- **Acceptance criteria (BDD):**
  - Given diary entries (case no., court, stage, proceeding, dates, client phone), when I open the dashboard, then the next hearing is shown as a hero and hearings roll up into a cause list.
- **Success metric:** Next-hearing accuracy 100%.
- **MoSCoW:** Must.

### CAP-13 — Accuracy Validation & Trust Layer
#### R13.1 — AI confidence envelope + indicators
- **User story:** As a user, I want to see how reliable each AI output is and what it relied on.
- **Acceptance criteria (BDD):**
  - Given any AI-generated output (draft, OCR, answer, judgment interpretation), when returned, then a confidence signal (band + dimensions) and its evidence are available.
  - Given a low-confidence output, when shown, then the UI flags it distinctly.
- **Success metric:** Confidence present on 100% of AI outputs (target state).
- **MoSCoW:** Should (governance phase — see Phase 5).

#### R13.2 — Draft validation & accuracy scorecards
- **User story:** As an internal QA operator, I want to score generated drafts against solved cases and track accuracy over time.
- **Acceptance criteria (BDD):**
  - Given a generated draft and the actual filed document, when compared, then a quantitative scorecard (citation accuracy, argument completeness, structural compliance, hallucination rate) is emitted.
  - Given validation runs, when aggregated, then module-level accuracy trends are visible.
- **Success metric:** Scorecard coverage of core modules; targets met (see Vision Quality Bar).
- **MoSCoW:** Should (internal/admin, never lawyer-facing).

## Scope summary (MoSCoW)

| MoSCoW | Requirements | Notes |
|--------|--------------|-------|
| Must | R1.1, R1.2, R2.1, R3.1, R4.1, R5.1, R6.1, R10.1, R12.1, R12.2 | v1 core — shipped/live |
| Should | R3.2, R4.2, R4.3, R7.1, R7.2, R8.1, R9.1, R13.1, R13.2 | shipped or in governance hardening |
| Could | R11.1 | assist feature, non-blocking |
| Won't (this version) | e-filing, billing/CRM, non-PK jurisdictions, model fine-tuning | see Vision §9 |

## Success metrics roll-up

| Metric | Target | Source requirement |
|--------|--------|--------------------|
| Citation accuracy | > 90% | R3.1, R4.3 |
| Hallucination rate | < 10% | R3.1 |
| Argument completeness | > 80% | R2.1, R13.2 |
| Structural compliance | 100% | R1.1, R13.2 |
| Invented sections | 0 | R5.1 |
| Deterministic tax numbers | 100% | R6.1 |
| Graceful degradation (search) | 0 user-facing failures | R4.2 |
| Proper-noun/number preservation | 100% | R9.1 |
| Confidence coverage of AI outputs | 100% (target) | R13.1 |

## Coverage check (Vision ↔ PRD)

| Capability | Requirements covering it |
|------------|--------------------------|
| CAP-1 | R1.1, R1.2 |
| CAP-2 | R2.1 |
| CAP-3 | R3.1, R3.2 |
| CAP-4 | R4.1, R4.2, R4.3 |
| CAP-5 | R5.1 |
| CAP-6 | R6.1 |
| CAP-7 | R7.1, R7.2 |
| CAP-8 | R8.1 |
| CAP-9 | R9.1 |
| CAP-10 | R10.1 |
| CAP-11 | R11.1 |
| CAP-12 | R12.1, R12.2 |
| CAP-13 | R13.1, R13.2 |

## Validation gate (before `locked`)

- [x] 100% capability coverage — every capability has ≥1 requirement; every requirement has a parent capability.
- [x] Every requirement has BDD acceptance criteria and a quantified success metric.
- [x] MoSCoW cut decided at the gate; no `TBD`.
- [x] No best-practice questions asked of the user (defaults applied silently and listed).
- [x] Personalization gate recorded in `personalization-gate.md`.
- [x] `blueprint-progress.md` shows PRD = `locked`; `next-steps-handoff.md` points to Architecture.
