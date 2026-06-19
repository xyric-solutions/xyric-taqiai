# TaqiAI - Next Steps Queue

> **Purpose**: Work queue — now enhancement & maintenance, not initial build
> **Owner**: Hamza
> **Last Updated**: 2026-06-19
> **Status**: Built — Live (Launch & Growth)
> **Context Documents**: [PROGRESS.md](./PROGRESS.md) | [Product-Vision.md](./Product-Vision.md)

> **REALITY (2026-06-19): TaqiAI is BUILT and LIVE — 13 modules shipped.** The original queue below was the *initial-build / internal-skills-testing* plan. The vast majority of those items now correspond to features that **already exist in the live product**, so they are marked DONE / SUPERSEDED below. Next steps are now **enhancement and maintenance**, plus the genuinely-still-open business decisions (pricing, data-privacy policy). This file is not a new detailed backlog — it simply reconciles the old queue against the live product honestly.

---

## QUICK START: Copy This Prompt

```markdown
# TaqiAI Testing Session

## Session Context
I'm testing TaqiAI skills against solved Pakistani legal cases.

**Reference This Document:** @PRODUCTS/taqiai/NEXT-STEPS.md
**Reference Progress:** @PRODUCTS/taqiai/PROGRESS.md
**Reference Vision:** @PRODUCTS/taqiai/Product-Vision.md

## Activate Claude Skills
LEGAL-01 (Case Analyzer), LEGAL-02 (Legal Drafter), LEGAL-03 (Legal Comparator)

## Current Focus
[First item marked "In Progress" below]

## Session Goal
Execute items in priority order, measuring accuracy on each test.
```

---

## EXECUTION PROTOCOL

### Before Starting
- [ ] Read NEXT-STEPS.md fully
- [ ] Check PROGRESS.md for decisions/patterns
- [ ] Have solved case document ready (PDF or text)
- [ ] Load LEGAL-01/02/03 skills

### During Execution
- Work items in priority order
- Mark items "In Progress" when starting
- Record accuracy scores in Results-Tracker.md
- Add cases to Case-Log.md
- Capture learnings in PROGRESS.md

### After Session
- [ ] Update item statuses in queue
- [ ] Update Results-Tracker.md with scores
- [ ] Update PROGRESS.md with patterns/decisions
- [ ] Commit all changes

---

## ACTIVE QUEUE

### In Progress

*(None — product is built and live; remaining work is enhancement/maintenance + open business decisions.)*

### Done / Superseded — initial-build & internal-skills-testing queue

> All items below were the original build/test plan. The product is now built and live, so they are **completed or superseded by the shipped application**. Retained for record.

| # | Item | Status |
|---|------|--------|
| NS-001 | Collect first 5 solved cases (civil + criminal) | Superseded — product built & live; corpus is the local judgments.db |
| NS-002 | Test LEGAL-01 (Case Analyzer) on first criminal case | Superseded — Judgment Intelligence (EPIC-05) shipped |
| NS-003 | Test LEGAL-01 (Case Analyzer) on first civil case | Superseded — Judgment Intelligence (EPIC-05) shipped |
| NS-004 | Review LEGAL-01 output with lawyer — capture feedback | Superseded — shipped & in use |
| NS-005 | Test LEGAL-02 (Legal Drafter) — bail application | Superseded — Court-Case Drafting (EPIC-02) shipped |
| NS-006 | Test LEGAL-02 (Legal Drafter) — written statement | Superseded — Court-Case Drafting (EPIC-02) shipped |
| NS-007 | Run LEGAL-03 (Legal Comparator) on first pair | Superseded — accuracy now validated in live use |
| NS-008 | Establish accuracy baseline from first 5 cases | Superseded — product live |
| NS-009 | Iterate skills based on lawyer feedback | Done — ongoing as live-product maintenance |
| NS-010 | Expand test corpus to 20+ cases | Done — judgment corpus far exceeds this |
| NS-011 | Collect first 5 solved case files for testing | Superseded — product built & live |
| NS-012 | Review India-based legal AI competitor | Done — competitive analysis complete (DigiLawyer identified) |
| NS-013 | First drafting test session using real solved case | Superseded — drafting modules shipped |
| NS-014 | Compare AI plaint draft against actual filed document | Superseded — drafting modules shipped |

---

### Competitive Response — Beat DigiLawyer (Added 2026-04-29)

> **Context:** DigiLawyer (UET Lahore, Dec 2025) is Pakistan's first AI legal competitor. They have ARK AI (citation research) and MIKE AI (court drafting). Our MVP already beats them on 9+ features. These tasks close the remaining gap and widen our lead.

| # | Item | Status | Owner | Notes |
|---|------|--------|-------|-------|
| NS-029 | **Legal Research Page (MVP)** | DONE | Engineering | Shipped as Statute Search `/statute-search` (EPIC-12) + Judgment Intelligence `/case-law` (EPIC-05) — citation search over local corpora. |
| NS-030 | **Citation Block in AI Advisor response** | DONE | Engineering | AI Advisor `/ai-advisor` (EPIC-04) is conversational + judgment-grounded; surfaces relevant judgments/citations. |
| NS-031 | **Case Tracker Page (Chamber Management lite)** | DONE | Engineering | Shipped as Chamber / Case Management `/chamber` (EPIC-06), full matter + hearing tracking. |
| NS-032 | **Competitive parity audit** — monthly review of DigiLawyer | OPEN (ongoing) | Abdullah + Hamza | Still relevant as live-product maintenance. Check digilawyer.org monthly; update competitive table. |
| NS-033 | **MVP feature matrix vs DigiLawyer** | OPEN (ongoing) | Hamza | Keep PRD competitive table current as both products evolve. |
| NS-034 | **"Why TaqiAI" one-pager** | OPEN | Hamza | Marketing/sales collateral for lawyer pitches — now reflects 13 live modules. |

---

### Module 6 — Judgment Intelligence Library — BUILT (EPIC-05, `/case-law`)

> Shipped: search / Q&A / PDF analysis over the local `judgments.db` corpus with a semantic search service. All items below are done or superseded.

| # | Item | Status | Notes |
|---|------|--------|-------|
| NS-015 | Define judgment corpus seed list | DONE | Live corpus far exceeds the original 50-judgment seed |
| NS-016 | Design judgment ingestion pipeline (PDF → OCR → embeddings) | DONE | OCR + embeddings pipeline built; semantic search service live |
| NS-017 | Build Judgment Search (case no. / citation / keyword) | DONE | Shipped in `/case-law` (+ semantic search) |
| NS-018 | Build AI Judgment Reader (upload → summary + Q&A) | DONE | Shipped — Gemini long-context Q&A |
| NS-019 | Build Judgment Upload + Case Strategy | DONE | Case Builder `/case-builder` (EPIC-09) covers judgment-backed case prep |
| NS-020 | Test judgment analysis against known judgments | DONE | Validated in live use |
| NS-021 | Decide public corpus licensing/scraping strategy | DONE | Resolved — corpus built from free/legal sources (see project memory) |

### Module 7 — Chamber Management — BUILT (EPIC-06, `/chamber`)

> Shipped: full matter + hearing management with document linking and client phone, unified cause list and Next-Hearing dashboard. All items below are done.

| # | Item | Status | Notes |
|---|------|--------|-------|
| NS-022 | Design Matter data model + Prisma schema | DONE | Matter/hearing/diary entities live; doc-linking + clientPhone |
| NS-023 | Build Matter CRUD | DONE | Create/edit/archive with full metadata |
| NS-024 | Build Hearing Date management (add/adjourn) | DONE | Shipped |
| NS-025 | Build Today's List view | DONE | Unified cause list + Next Hearing hero on dashboard |
| NS-026 | Build Timetable / Calendar view | DONE | Shipped |
| NS-027 | Build Deadlines tracker | DONE | Shipped |
| NS-028 | Validate Chamber Management UX with Abdullah | DONE | Validated; in live use |

### Open Decisions

> Most original "before PRD" decisions are now resolved (the product is built and live). Genuinely-open items are business/policy decisions, not build blockers.

| # | Decision | Status | Owner | Notes |
|---|----------|--------|-------|-------|
| D-001 | **Urdu scope** | RESOLVED | Abdullah + Hamza | Bilingual English/Urdu is live; Arabic in Translation |
| D-002 | **V1 document type list** | RESOLVED | Abdullah | 50+ templates across 13 categories shipped |
| D-003 | **PKR pricing tiers** — free trial limits, Solo Pro rate, Firm per-seat | OPEN | Hamza | Still genuinely open. Market constraint: Pakistani lawyer income $300–2,000/month |
| D-004 | **Template verification process** — review ownership & cadence | OPEN (ongoing) | Abdullah | Abdullah is primary legal reviewer; cadence to formalise |
| D-005 | **External "TaqiAI" competitor** | RESOLVED | Abdullah | Clarified; DigiLawyer is the real Pakistani competitor |
| D-006 | **Data privacy model** — case data handling, PDPB compliance | OPEN | Hamza | Still genuinely open. No-training guarantee for client case data |

### Future Candidates / Enhancements

| Item | Status / Notes |
|------|------|
| Legal research feature | DONE — Statute Search + Judgment Intelligence shipped |
| Urdu language support | DONE — bilingual English/Urdu live |
| Voice & Image Intake | DONE — Voice Case (EPIC-11) + Copy from Photo (EPIC-10) live |
| RAG pipeline for case law | DONE — semantic search service over judgments.db live; statute RAG in progress |
| Precedent Finder | DONE — covered by Judgment Intelligence / Case Builder |
| Generate PRD / product architecture | DONE — product built and live |
| Pricing & go-to-market | OPEN — see D-003 (genuinely-open business decision) |
| Data-privacy / PDPB policy | OPEN — see D-006 |

---

## ARCHIVE

*(Completed items moved here)*
