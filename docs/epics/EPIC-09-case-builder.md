# EPIC-09 — Case Builder

---

## Epic Metadata

| Field | Detail |
|-------|--------|
| Epic ID | EPIC-09 |
| Owner | Abdullah |
| Author | Hamza |
| Status | Built — Live |
| Priority | 5 — High |
| Estimated Effort | 2–3 Sprints |
| Depends On | EPIC-05 (Judgment Intelligence corpus), EPIC-01 (Drafting Engine) |
| Can Run In Parallel With | EPIC-07 |
| Last Updated | 2026-06-19 |

---

## Goal

Combine Pakistani judgment research with AI document drafting in a single guided workflow. The lawyer enters case details once; the AI searches the local judgment database for relevant precedents; the lawyer reviews and curates them; then the AI drafts the required document using those curated judgments as guidance — so case research and drafting happen in one place instead of two disconnected steps.

---

## Background

Before Case Builder, a lawyer had to research precedents in the Judgment Intelligence Library (EPIC-05) and then separately draft a document in the templates/drafting flow (EPIC-01), manually re-typing case facts, party details, court, and city into both. There was no link between the precedents found and the document produced. Case Builder closes that gap with a single multi-stage workflow at route `/case-builder`: input → research → results → asking → generating → done. The AI grounds its draft in judgments the lawyer has actually approved, and reuses the case details captured up front so nothing is re-entered.

---

## Workflow Stages

The implemented flow is a linear, multi-stage wizard. Each stage is described below.

| # | Stage | What Happens |
|---|-------|--------------|
| 1 | **INPUT** | Collect law sections, case facts, parties (client & opponent names / CNICs / addresses), FIR number, police station, court name, district/city, and the document type needed |
| 2 | **RESEARCH** | AI generates search terms and searches the full Pakistani judgment database (Supreme Court, Federal Shariat Court, all High Courts) |
| 3 | **RESULTS** | Judgments shown with citation, court, year, title, reason for relevance, key legal principle, and a stance badge (favorable / adverse / neutral); lawyer can add/remove, run a manual query, and load more |
| 4 | **ASKING** | AI asks for any missing document-specific details; fields are auto pre-filled from the INPUT stage to avoid re-entry |
| 5 | **GENERATING** | AI drafts the document using curated judgments as guidance only; uses ONLY the user-provided court and city — never assumes a location |
| 6 | **DONE** | Preview and inline-edit the generated document; shows a count of unfilled blanks before filing |

---

## Court Coverage

Research draws from the full EPIC-05 corpus across all Pakistani court tiers:

| Tier | Courts |
|------|--------|
| **Apex** | Supreme Court of Pakistan |
| **Constitutional** | Federal Shariat Court |
| **High Courts** | Lahore, Sindh, Peshawar, Balochistan, Islamabad High Courts |

---

## Sub-Modules

| ID | Sub-Module | Description |
|----|-----------|-------------|
| A | Case Intake | Structured input form for facts, parties, sections, court, city, and document type |
| B | Precedent Research & Curation | AI judgment search + stance scoring + add/remove/manual-search/load-more curation |
| C | Judgment-Guided Drafting | Follow-up question gathering + AI draft grounded in curated judgments + preview/edit |

---

## User Stories

| ID | User Story | Priority |
|----|-----------|---------|
| US-09-01 | As a lawyer, I want to enter all my case details (sections, facts, parties, FIR, police station, court, city, document type) in one form so that I provide them only once | Must Have |
| US-09-02 | As a lawyer, I want the AI to read my case facts and automatically search the judgment database for relevant precedents | Must Have |
| US-09-03 | As a lawyer, I want each suggested judgment to show why it is relevant and whether it helps or hurts my case (favorable / adverse / neutral) | Must Have |
| US-09-04 | As a lawyer, I want to remove judgments I don't want and run my own search query to find more | Must Have |
| US-09-05 | As a lawyer, I want to load more results and read the full text of any judgment inline before keeping it | Should Have |
| US-09-06 | As a lawyer, I want the AI to ask me only for the details still missing for this document, with fields pre-filled from what I already entered | Must Have |
| US-09-07 | As a lawyer, I want the AI to draft my document in English or Urdu using the precedents I curated as guidance | Must Have |
| US-09-08 | As a lawyer, I want to preview and inline-edit the draft and see how many blanks are still unfilled before I file it | Must Have |

---

## Acceptance Criteria

| # | Criteria | Status |
|---|----------|--------|
| AC-01 | INPUT form captures sections, facts, both parties (names/CNICs/addresses), FIR number, police station, court, district/city, and document type | [x] |
| AC-02 | AI generates search terms from case facts and searches the full corpus (SC + FSC + all HCs) | [x] |
| AC-03 | Each result shows citation, court, year, title, relevance reason, key legal principle, and a stance badge | [x] |
| AC-04 | Lawyer can add and remove judgments and run a manual search query for more | [x] |
| AC-05 | "Load more" pagination works; full judgment text can be read inline | [x] |
| AC-06 | ASKING stage requests only missing fields and pre-fills values from the INPUT stage | [x] |
| AC-07 | Draft is generated using curated judgments as guidance only — no generic "reliance is placed" unless explicitly requested | [x] |
| AC-08 | Draft uses ONLY the user-provided court and city — never assumes a location | [x] |
| AC-09 | Document can be generated in English or Urdu | [x] |
| AC-10 | DONE stage allows inline editing of the generated document | [x] |
| AC-11 | Unfilled-blank count is shown before filing | [x] |
| AC-12 | All AI output clearly labeled "AI-generated — verify before use in court" | [x] |

---

## Success Metrics

| Metric | Target | How to Measure |
|--------|--------|---------------|
| Relevant precedents in top results | ≥ 3 usable judgments per case | Abdullah reviews 10 cases |
| Stance badge accuracy | > 85% correct (favorable/adverse/neutral) | Abdullah spot-checks 30 results |
| Re-entry eliminated | 0 fields re-typed in ASKING stage | Manual flow test |
| Research-to-draft completion time | < 5 minutes end to end | Timing logs |
| Location accuracy in drafts | 100% match user-provided court/city | Manual check on 10 drafts |
| Draft usability without rewrite | > 70% drafts usable after light edit | Abdullah review |

---

## Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| AI surfaces irrelevant or wrong-stance judgments | Medium | High | Lawyer curates (add/remove); stance badge + relevance reason shown; manual search fallback |
| AI assumes a court/city not provided by lawyer | Medium | High | Prompt constrained to use ONLY user-provided location; never infer |
| Generic forced citations clutter the draft | Medium | Medium | Drafting avoids "reliance is placed" boilerplate unless explicitly requested |
| Gemini model unavailable or rate-limited | Medium | High | Multi-model fallback chain across Gemini models |
| Lawyer files draft with blanks still unfilled | Medium | High | Unfilled-blank count shown prominently before filing |
| AI hallucinates a citation not in corpus | Low | High | Research grounded in local judgments.db; output labeled draft, verify before court |

---

## Technical Notes

| Component | Detail |
|-----------|--------|
| Route | `/case-builder` — multi-stage wizard (input → research → results → asking → generating → done) |
| Research API | `POST /api/ai/case-prepare` — research + candidate judgments + strategy (Gemini + judgment DB) |
| Drafting API | `POST /api/ai/smart-draft` — judgment-guided document drafting |
| Search API | `GET /api/judgments/local` — citation/keyword search with pagination |
| AI Model | Google Gemini (multi-model fallback chain) |
| Judgment Data | Local SQLite `judgments.db` (the EPIC-05 corpus) |
| Skills | LEGAL-02 (Legal Drafter), LEGAL-06 (Judgment Intelligence) |
| Pre-fill | ASKING stage fields auto-populated from INPUT stage state to avoid re-entry |
| Drafting constraints | Use ONLY user-provided court/city; judgments are guidance only; avoid generic forced citations |

---

## Definition of Done

| # | Condition |
|---|-----------|
| 1 | All User Stories (US-09-01 to US-09-08) implemented and merged |
| 2 | All Acceptance Criteria (AC-01 to AC-12) verified and checked off |
| 3 | Full six-stage flow works end to end at `/case-builder` |
| 4 | Research returns relevant judgments from the live corpus |
| 5 | Drafts generate in both English and Urdu |
| 6 | Location accuracy verified by Abdullah on 10 drafts |
| 7 | Deployed to live with no critical bugs |
| 8 | Abdullah has reviewed and signed off |

---

## Out of Scope

| Feature | Reason |
|---------|--------|
| Automatic filing / e-court submission | Lawyer files manually after review |
| Saving Case Builder sessions to a Matter | v2 — link to EPIC-06 Chamber later |
| Cross-jurisdiction precedents (India, UK, US) | Pakistan-only |
| Auto-insertion of every citation into the draft | Judgments are guidance only; forced citations avoided |

---

## Dependencies

| Dependency | Why Needed |
|-----------|-----------|
| EPIC-05 (Judgment Intelligence) | Research stage searches the judgment corpus (`judgments.db`) |
| EPIC-01 (Templates & Drafting) | Generating stage reuses the AI drafting engine |
| Google Gemini API | Research, search-term generation, and drafting |
| LEGAL-06 (Judgment Intelligence skill) | Stance scoring + relevance reasoning |
| LEGAL-02 (Legal Drafter skill) | Document drafting instructions |

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-06-19 | Hamza | Initial epic documented from built feature |
