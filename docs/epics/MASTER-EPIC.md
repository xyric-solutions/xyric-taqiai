# TaqiAI — Master Epic

---

## Epic Metadata

| Field | Detail |
|-------|--------|
| Version | 2.0 |
| Owner | Abdullah |
| Author | Abdullah |
| Status | Built — Live |
| Last Updated | 2026-06-19 |

---

## Product Vision

TaqiAI is an AI-assisted legal drafting platform built exclusively for Pakistani lawyers. It combines a verified template library with controlled AI generation, enabling solo advocates and law firms to produce court-ready documents in minutes — while retaining full legal control. The guiding principle: **AI assists, lawyers verify and finalize.**

---

## Epic Overview

All epics below are **built and live** in the running application unless noted otherwise.

| Epic ID | Title | Priority | Status | Owner | Route | Target Users |
|---------|-------|----------|--------|-------|-------|--------------|
| EPIC-01 | Document Templates & AI Drafting Engine | 1 — Critical | Built — Live | Abdullah | `/affidavits`, `/agreements`, `/applications`, `/power-of-attorney` | All lawyers |
| EPIC-02 | Court Cases & Legal Filings | 2 — High | Built — Live | Abdullah | `/criminal-law`, `/civil-law`, `/family-law`, `/constitutional-law`, `/property-law`, `/corporate-law`, `/tax-law`, `/immigration-law`, `/non-muslim-laws` | Litigation lawyers |
| EPIC-03 | Tax Calculator Module | 3 — High | Built — Live | Abdullah | `/property-transfer/tax-calculator` | Property lawyers |
| EPIC-04 | AI Legal Advisor (Chat) | 4 — Medium | Built — Live | Abdullah | `/ai-advisor` | All lawyers |
| EPIC-05 | Judgment Intelligence Library | 5 — High | Built — Live | Abdullah | `/case-law` | All litigation lawyers |
| EPIC-06 | Chamber Management (Case Management) | 6 — High | Built — Live | Abdullah | `/chamber` | All practicing lawyers |
| EPIC-07 | Legal Document Translation | 7 — High | Built — Live | Abdullah | `/translate` | All lawyers |
| EPIC-08 | Lawyer Diary (Roznamcha) | 8 — Medium | Built — Live | Abdullah | `/lawyer-diary` | Litigation lawyers |
| EPIC-09 | Case Builder (Judgment-Backed Drafting) | 9 — High | Built — Live | Abdullah | `/case-builder` | Litigation lawyers |
| EPIC-10 | Copy from Photo (Document Digitization) | 10 — Medium | Built — Live | Abdullah | `/copy-from-photo` | All lawyers |
| EPIC-11 | Voice Case (Case from Discussion) | 11 — High | Built — Live | Abdullah | `/voice-case` | All lawyers |
| EPIC-12 | Statute Search | 12 — Medium | Built — Live | Abdullah | `/statute-search` | All lawyers |
| EPIC-13 | Document Vault (My Documents) | 13 — Medium | Built — Live | Abdullah | `/documents` | All lawyers |

> Supporting modules also live: Dashboard (`/dashboard`), Authentication (login/register), Settings (`/settings`).

---

## Epic Dependency Map

| Epic | Depends On | Related / Shares Infrastructure With |
|------|-----------|--------------------------|
| EPIC-01 | Auth System, smart-draft engine (`/api/ai/smart-draft`) | EPIC-02 |
| EPIC-02 | EPIC-01 (same drafting engine) | EPIC-09, EPIC-11 |
| EPIC-03 | None — fully standalone (hardcoded rate tables) | — |
| EPIC-04 | Auth System, judgment corpus (EPIC-05) | EPIC-05 |
| EPIC-05 | Auth System, local `judgments.db`, semantic service | EPIC-04, EPIC-09, EPIC-12 |
| EPIC-06 | Auth System | EPIC-08 |
| EPIC-07 | smart-draft / translation APIs, OCR | EPIC-10 |
| EPIC-08 | Auth System | EPIC-06 |
| EPIC-09 | EPIC-01 (drafting) + EPIC-05 (judgment corpus) | EPIC-11 |
| EPIC-10 | OCR (`/api/ai/extract-document`), Document Vault | EPIC-07 |
| EPIC-11 | Voice transcription + case-analysis + smart-draft | EPIC-09 |
| EPIC-12 | Judgment corpus (EPIC-05) | EPIC-05 |
| EPIC-13 | Auth System, Prisma `Document` model | All drafting epics (feed into the vault) |

> **Status:** All thirteen epics are implemented and live. This dependency map now documents how the shipped modules relate, not a future build order.

---

## Overall Success Metrics

| Metric | Target |
|--------|--------|
| Time to draft a standard document | < 5 minutes |
| Lawyer edit ratio (AI output modified) | < 20% |
| PDF export success rate | > 99% |
| AI response accuracy (citations verified) | 100% |
| Monthly active lawyers | Growing MoM |
| Subscription retention at 3 months | > 70% |

---

## Overall Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| AI generates legally incorrect content | Medium | High | Verified template structure + mandatory lawyer approval before export |
| Gemini API downtime or rate limits | Medium | High | Fallback chain already in `gemini.ts` — extend with retry logic |
| FBR/Provincial tax rates change | High | Medium | Rate tables versioned with update date; legal team reviews quarterly |
| Lawyers not adopting the approval workflow | Low | High | UX design makes bypass impossible — approve button is the only export path |
| Urdu font rendering broken on some devices | Medium | Medium | Test Nastaliq rendering across browsers before launch |
| Low user retention after trial | Medium | High | Ensure core drafting (EPIC-01) works flawlessly before launch |

---

## Guiding Principles

| # | Principle | What It Means |
|---|-----------|---------------|
| 1 | AI assists, lawyers verify | No document reaches a client or court without explicit lawyer approval |
| 2 | Depth over breadth | Deep templates with smart sub-variants — not shallow coverage |
| 3 | Legal structure is sacred | AI fills facts into templates; it never invents legal structure |
| 4 | Pakistani-law-first | All citations and terminology reflect Pakistani jurisdiction only |
| 5 | Bilingual by default | Full Urdu + English support; Roman Urdu input accepted everywhere |
| 6 | Zero made-up citations | AI cannot invent references; uncertain cases flagged for manual review |

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | Next.js + React + TypeScript | Full-stack web application |
| Styling | Tailwind CSS | Responsive "Midnight Qanoon" design system (cyan + violet, dark) |
| AI Provider | Google Gemini API (multi-model fallback chain) | Document generation, legal Q&A, OCR, translation, voice/image processing |
| App Database | Prisma + SQLite (`dev.db`) | Users, documents, chat sessions, matters, hearings, diary, saved judgments |
| Judgment Corpus | Read-only SQLite `judgments.db` (+ `citations.db`) | Full-text judgment search across all Pakistani courts |
| Semantic Search | Embeddings + semantic service (`/api/judgments/semantic`) | Smart/meaning-based judgment retrieval |
| Statute Corpus | `statutes.db` (federal + provincial Acts) | Grounding the Advisor / statute search in current law |
| Auth | JWT (jose) + bcryptjs | Secure lawyer authentication |
| PDF / Print | html2pdf / browser print | Court-ready documents with legal page sizes |
| Validation | Zod | Runtime type safety |
| i18n | Custom Urdu / English / Arabic layer | Bilingual UI; trilingual translation |

---

## Out of Scope — v1

| Feature | Reason Excluded |
|---------|----------------|
| Client CRM | Out of v1 focus |
| Billing & invoicing system | Separate module — post-launch |
| Multi-jurisdiction support | Pakistan only in v1 |
| Mobile app | Web-first approach |
| Real-time collaboration between lawyers | Future iteration |
| Google Calendar / Outlook sync | Chamber Management v1.5 |
| Full digitization of all Pakistani court judgments | Progressive corpus build — starts with landmark cases |

---

## Epic Files

| File | Epic | Priority |
|------|------|----------|
| [EPIC-01-templates-drafting.md](./EPIC-01-templates-drafting.md) | Document Templates & AI Drafting Engine | 1 |
| [EPIC-02-court-cases.md](./EPIC-02-court-cases.md) | Court Cases & Legal Filings | 2 |
| [EPIC-03-tax-calculator.md](./EPIC-03-tax-calculator.md) | Tax Calculator Module | 3 |
| [EPIC-04-ai-legal-advisor.md](./EPIC-04-ai-legal-advisor.md) | AI Legal Advisor (Chat-based) | 4 |
| [EPIC-05-judgment-intelligence.md](./EPIC-05-judgment-intelligence.md) | Judgment Intelligence Library | 5 |
| [EPIC-06-chamber-management.md](./EPIC-06-chamber-management.md) | Chamber Management | 6 |
| [EPIC-07-translation-services.md](./EPIC-07-translation-services.md) | Legal Document Translation | 7 |
| [EPIC-08-lawyer-diary.md](./EPIC-08-lawyer-diary.md) | Lawyer Diary (Roznamcha) | 8 |
| [EPIC-09-case-builder.md](./EPIC-09-case-builder.md) | Case Builder (Judgment-Backed Drafting) | 9 |
| [EPIC-10-copy-from-photo.md](./EPIC-10-copy-from-photo.md) | Copy from Photo (Document Digitization) | 10 |
| [EPIC-11-voice-case.md](./EPIC-11-voice-case.md) | Voice Case (Case from Discussion) | 11 |
| [EPIC-12-statute-search.md](./EPIC-12-statute-search.md) | Statute Search | 12 |
| [EPIC-13-document-vault.md](./EPIC-13-document-vault.md) | Document Vault (My Documents) | 13 |

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-04-27 | Abdullah | Initial Master Epic created |
| 1.1 | 2026-04-27 | Abdullah | Added Dependency Map, Risks table, Tech Stack table, Out of Scope table |
| 1.2 | 2026-04-28 | Hamza | Added EPIC-05 (Judgment Intelligence Library) and EPIC-06 (Chamber Management); updated dependency map and out-of-scope |
| 2.0 | 2026-06-19 | Hamza | Updated to reflect the built & live product: status → Built — Live; added EPIC-07 (Translation), EPIC-08 (Lawyer Diary), EPIC-09 (Case Builder), EPIC-10 (Copy from Photo), EPIC-11 (Voice Case), EPIC-12 (Statute Search), EPIC-13 (Document Vault); added routes; corrected tech stack to actual SQLite + semantic service + statutes corpus |
