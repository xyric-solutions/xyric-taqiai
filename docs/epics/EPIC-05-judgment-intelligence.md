# EPIC-05 — Judgment Intelligence Library

---

## Epic Metadata

| Field | Detail |
|-------|--------|
| Epic ID | EPIC-05 |
| Owner | Abdullah |
| Author | Hamza |
| Status | Built — Live |
| Priority | 5 — High |
| Estimated Effort | 3–4 Sprints |
| Depends On | Auth System, judgments.db (SQLite), optional semantic search service, OCR pipeline |
| Can Run In Parallel With | EPIC-06 |
| Last Updated | 2026-06-19 |

---

## Goal

Give every Pakistani lawyer instant access to a searchable, AI-powered library of court judgments — searchable by citation (SCMR/PLD/PCrLJ), statute section, keyword, or parties — and let AI analyze those judgments to prepare case strategy automatically.

---

## Background

Pakistani lawyers currently find judgments through physical law reporters (SCMR, PLD, PCrLJ volumes) or expensive subscription databases. There is no free, AI-powered, Pakistan-specific judgment library. The primary retrieval method in Pakistani legal practice is **citation format** (e.g., "2023 SCMR 1450") — NOT court case number, which is an internal court identifier and not publicly searchable.

> **Built status:** This is **built and live at `/case-law`**. The corpus is large — ~200K+ judgment rows across the Supreme Court, Federal Shariat Court, and all High Courts (the true unique-judgment count is smaller, as the raw rows include duplicates). Live capabilities: smart AI search, keyword search, and citation search; filters by court / year / reported; sort by relevance / newest / oldest; PDF upload analysis; judgment Q&A chat; and save/bookmark judgments. It is backed by a local **SQLite `judgments.db`** (not pgvector/Postgres) plus an **optional semantic search service**. Live APIs: `GET /api/judgments/local`, `GET /api/judgments/semantic`, and `POST /api/ai/judgment`.

---

## Court Coverage

All Pakistani courts are covered in the judgment corpus:

| Tier | Courts | Citation Formats |
|------|--------|-----------------|
| **Apex** | Supreme Court of Pakistan | SCMR, PLD SC, PTCL |
| **Constitutional** | Federal Shariat Court | PLD FSC |
| **High Courts** | Lahore High Court | PLD Lahore, PLJ, NLR |
| | Sindh High Court | PLD Karachi, SBLR |
| | Peshawar High Court | PLD Peshawar |
| | Balochistan High Court | PLD Quetta |
| | Islamabad High Court | PLD Islamabad |
| **Special Courts** | Anti-Terrorism Court (ATC) | — |
| | Accountability Court (NAB) | — |
| | Banking Court | — |
| | Labour Court | — |
| | Family Court | — |
| | Drug Court | — |
| | Service Tribunal | — |
| | Revenue Court / Board of Revenue | — |
| | Income Tax Appellate Tribunal | — |
| | Customs Appellate Tribunal | — |
| **District Courts** | District & Sessions Courts (all districts) | — |

> **Corpus build priority:** Supreme Court → Lahore HC → Sindh HC → Peshawar HC → Balochistan HC → Islamabad HC → Special Courts → District Courts

---

## Sub-Modules

| ID | Sub-Module | Description |
|----|-----------|-------------|
| A | Judgment Upload & AI Case Preparation | Bulk upload judgments → AI analyzes → generates case strategy |
| B | AI Judgment Reader | On-demand summary, Q&A, key passage highlighting on any judgment |
| C | Judgment Search & Retrieval | Citation-first search across all courts + full-text + statute section |

---

## User Stories

| ID | User Story | Priority |
|----|-----------|---------|
| US-05-01 | As a lawyer, I want to search for a judgment by its citation (e.g., "2023 SCMR 1450") so that it appears on my screen immediately | Must Have |
| US-05-02 | As a lawyer, I want to search judgments by statute section (e.g., "PPC 302") so that I find all cases that cited that section | Must Have |
| US-05-03 | As a lawyer, I want to upload a judgment PDF and have AI give me a plain-language summary so that I understand it quickly | Must Have |
| US-05-04 | As a lawyer, I want to ask AI questions about a specific judgment (e.g., "What was the reasoning on bail?") so that I extract the information I need | Must Have |
| US-05-05 | As a lawyer, I want to upload multiple judgments and get an AI-prepared case strategy with recommended arguments and citations | Should Have |
| US-05-06 | As a lawyer, I want to search judgments by keyword or legal issue so that I find relevant precedents for my case | Must Have |
| US-05-07 | As a lawyer, I want to filter judgments by court and year so that I find jurisdiction-specific and recent precedents | Must Have |
| US-05-08 | As a lawyer, I want to see whether a judgment is binding or persuasive for my current case's court so that I know how to argue it | Should Have |
| US-05-09 | As a lawyer, I want to attach judgment analysis to a matter in my chamber so that all research for a case is in one place | Should Have |
| US-05-10 | As a lawyer, if a judgment is not in the library, I want to upload it myself so that it becomes searchable for me | Must Have |

---

## Acceptance Criteria

| # | Criteria | Status |
|---|----------|--------|
| AC-01 | Citation search (SCMR, PLD, PCrLJ, MLD, CLC, YLR, PLJ, NLR, SBLR formats) returns correct judgment | [ ] |
| AC-02 | Statute section search (e.g., "PPC 302") returns all judgments in corpus that cited that section | [ ] |
| AC-03 | Keyword / full-text search works across all ingested judgments | [ ] |
| AC-04 | Court + year range filter works correctly for all 7 high courts + Supreme Court | [ ] |
| AC-05 | AI summary produced within 30 seconds of judgment upload/selection | [ ] |
| AC-06 | AI summary covers: parties, court, date, issues, arguments, ratio decidendi, ruling | [ ] |
| AC-07 | Lawyer can ask follow-up questions about a judgment and get accurate answers grounded in judgment text | [ ] |
| AC-08 | Binding vs persuasive indicator shown based on selected matter's court | [ ] |
| AC-09 | Judgment not in library → "not found" message + upload option shown | [ ] |
| AC-10 | Lawyer-uploaded judgment is OCR-processed and made searchable | [ ] |
| AC-11 | Judgment analysis can be linked to a Matter (EPIC-06) | [ ] |
| AC-12 | All AI output clearly labeled "AI-generated — verify before use in court" | [ ] |

---

## Success Metrics

| Metric | Target | How to Measure |
|--------|--------|---------------|
| Citation search accuracy | 100% correct match | Manual spot-check on 20 citations |
| AI summary accuracy on ratio decidendi | > 90% | Abdullah reviews 10 summaries vs actual judgments |
| Corpus size (live) | ~200K+ judgment rows across SC, FSC, all High Courts (smaller unique count) | Corpus count |
| Judgment search response time | < 5 seconds | Performance logs |
| AI summary generation time | < 30 seconds | Timing logs |
| Lawyer upload success rate | > 95% | Upload error logs |

---

## Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Most Pakistani court PDFs are scanned images (not digital text) | High | High | Mandatory OCR pipeline before ingestion; use Google Vision or Tesseract |
| Citation format parsing fails on variant formats | Medium | High | Regex + NLP citation parser with fallback to fuzzy match |
| AI hallucinates ratio or misattributes reasoning | Medium | High | AI output labeled as draft summary; lawyer must verify before citing in court |
| Supreme Court website scraping blocked | Medium | Medium | Manual upload pipeline as fallback; build scraping with respectful rate limits |
| Corpus too small at launch (low value) | High | Medium | Pre-load minimum 500 landmark SC + HC judgments before launch; lawyer uploads fill gaps |
| Outdated judgments mislead lawyers | Low | High | Show date + court prominently; flag if older than 10 years on constitutional/criminal matters |

---

## Technical Notes

| Component | Detail |
|-----------|--------|
| Corpus Store | Local **SQLite `judgments.db`** (not pgvector/Postgres) — holds judgment rows and metadata |
| Semantic Search | **Optional semantic search service** layered over the corpus for AI/smart search |
| Live APIs | `GET /api/judgments/local`, `GET /api/judgments/semantic`, `POST /api/ai/judgment` |
| Live UI | `/case-law` — smart/keyword/citation search, filters, sort, PDF analysis, Q&A chat, bookmark |
| OCR Pipeline | Scanned PDF → PyMuPDF/Gemini OCR → plain text → ingestion into judgments.db |
| Citation Parser | Regex patterns for SCMR/PLD/PCrLJ/MLD/CLC/YLR/PLJ/NLR/SBLR formats |
| AI Model | Gemini (long context) for judgment analysis; Gemini for summaries and Q&A |
| Search | Citation/keyword match over SQLite (primary) + optional semantic service (smart AI search) |
| Skill | LEGAL-06-judgment-intelligence.md — AI analysis instructions |

---

## Definition of Done

| # | Condition |
|---|-----------|
| 1 | All User Stories (US-05-01 to US-05-10) implemented and merged |
| 2 | All Acceptance Criteria (AC-01 to AC-12) verified and checked off |
| 3 | Minimum 500 judgments ingested and searchable |
| 4 | Citation search tested on 20 real citations by Abdullah |
| 5 | AI summary accuracy verified by Abdullah on 10 judgments |
| 6 | OCR pipeline tested on 10 scanned PDF judgments |
| 7 | Deployed to staging with no critical bugs |
| 8 | Abdullah has reviewed and signed off |

---

## Out of Scope

| Feature | Reason |
|---------|--------|
| Full digitization of all Pakistani court judgments | Progressive build — start with landmark cases |
| Real-time judgment ingestion from court websites | v2 — needs scraping infrastructure and legal clearance |
| Cross-jurisdiction judgments (India, UK, US) | Pakistan-only in v1 |
| Automated citation insertion into drafts | v2 — after judgment library is stable |

---

## Dependencies

| Dependency | Why Needed |
|-----------|-----------|
| Auth System | Judgment library and uploads scoped per user |
| SQLite `judgments.db` + optional semantic service | Corpus storage and semantic/smart search |
| OCR service (PyMuPDF / Gemini OCR) | Most Pakistani court PDFs are scanned images |
| EPIC-06 (Chamber Management) | US-05-09 requires Matter entity to link judgment analysis |
| Abdullah — seed judgment corpus | 500+ landmark judgments need legal review before pre-loading |

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-04-28 | Hamza | Initial Epic created — Judgment Intelligence Library |
| 1.1 | 2026-06-19 | Hamza | Updated to reflect built & live implementation |
