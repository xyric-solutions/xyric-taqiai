# EPIC-12 — Statute Search

---

## Epic Metadata

| Field | Detail |
|-------|--------|
| Epic ID | EPIC-12 |
| Owner | Abdullah |
| Author | Hamza |
| Status | Built — Live |
| Priority | 6 — High |
| Estimated Effort | 1–2 Sprints |
| Depends On | EPIC-05 (Judgment Intelligence) |
| Can Run In Parallel With | EPIC-05 |
| Route | `/statute-search` |
| Skill | LEGAL-08 (Statute & Citation Search) |
| Last Updated | 2026-06-19 |

---

## Goal

Give every lawyer a dedicated page to look up sections from Pakistan's major legal codes, instantly find judgments that cite a section, and read an AI explanation of the section's meaning and judicial interpretation — turning a bare section number into grounded, authority-marked case law.

---

## Background

Pakistani litigation is built around statutory sections — PPC 302, CrPC 497, CPC Order VII Rule 11, and so on. To argue a point a lawyer must (1) know what a section says, (2) know how courts have interpreted it, and (3) cite the right authorities, distinguishing binding Supreme Court rulings from persuasive High Court ones. Today this means flipping through bare-act books and journals. This Epic builds a single page that holds a statute library of the major codes, lets the lawyer click any section to pull every judgment in the local corpus that cites it, gives an AI interpretation of the section, and marks each cited judgment as binding or persuasive — with bookmarks for the sections a lawyer uses most.

---

## Sub-Modules

| ID | Sub-Module | Description |
|----|-----------|-------------|
| A | Statute Library | Browse the major Pakistani codes and their sections |
| B | Section-to-Judgment Search | Click a section to find all judgments citing it |
| C | AI Interpretation & Authority Marking | AI explains the section; judgments marked binding vs persuasive |
| D | Bookmarks | Save frequently-used sections for quick access |

---

## Statute Library (Built-In Codes)

The page ships with a built-in library of sections for Pakistan's major codes:

| Code | Short | Year |
|------|-------|------|
| Pakistan Penal Code | PPC | 1860 |
| Code of Criminal Procedure | CrPC | 1898 |
| Code of Civil Procedure | CPC | 1908 |
| Muslim Family Laws Ordinance | MFLO | 1961 |
| Specific Relief Act | SRA | 1877 |
| Family Courts Act | FCA | 1964 |

---

## Authority Marking

Every judgment returned for a section is marked by the issuing court's binding weight:

| Marking | Issuing Court |
|---------|--------------|
| **Binding** | Supreme Court of Pakistan |
| **Persuasive** | High Courts / Federal Shariat Court |

---

## User Stories

| ID | User Story | Priority | Story File |
|----|-----------|---------|-----------|
| US-12-01 | As a lawyer, I want to browse a statute library of the major codes and their sections so that I can find any section I need | Must Have | [S12-01](../stories/S12-01-statute-library-browse.md) |
| US-12-02 | As a lawyer, I want to click a section and see all judgments citing it so that I find relevant case law instantly | Must Have | [S12-02](../stories/S12-02-section-to-judgments-search.md) |
| US-12-03 | As a lawyer, I want an AI explanation of the section's meaning and judicial interpretation so that I understand it quickly | Must Have | [S12-03](../stories/S12-03-ai-section-interpretation.md) |
| US-12-04 | As a lawyer, I want each cited judgment marked binding or persuasive so that I cite the right authority | Must Have | [S12-04](../stories/S12-04-binding-vs-persuasive.md) |
| US-12-05 | As a lawyer, I want to bookmark frequently-used sections so that I reach them fast | Should Have | [S12-05](../stories/S12-05-bookmark-sections.md) |

---

## Acceptance Criteria

| # | Criteria | Status |
|---|----------|--------|
| AC-01 | Built-in statute library includes 6 codes: PPC 1860, CrPC 1898, CPC 1908, MFLO 1961, SRA 1877, FCA 1964 — each with sections | [x] |
| AC-02 | Lawyer can browse codes and their sections | [x] |
| AC-03 | Clicking a section searches all judgments citing that section | [x] |
| AC-04 | Section-to-judgment search uses `POST /api/ai/judgment` with section-specific queries | [x] |
| AC-05 | Judgment data is sourced from the local `judgments.db` corpus | [x] |
| AC-06 | AI explains the section's meaning and judicial interpretation | [x] |
| AC-07 | Each returned judgment is marked binding (Supreme Court) or persuasive (High Court / Shariat) | [x] |
| AC-08 | Lawyer can bookmark frequently-used sections | [x] |
| AC-09 | Page is usable on mobile screen (375px+) | [x] |

---

## Success Metrics

| Metric | Target | How to Measure |
|--------|--------|---------------|
| Section-to-judgment search time | < 5 seconds | Performance logs |
| Relevance of returned judgments | Abdullah confirms relevant | Manual review |
| Binding/persuasive marking accuracy | 100% | Test against known Supreme Court / High Court judgments |
| Bookmark usage | Track in analytics | Dashboard analytics |
| Daily active use | Track in analytics | Dashboard analytics |

---

## Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Local corpus missing judgments for a section | Medium | Medium | Show AI interpretation even when few judgments found; expand corpus over time |
| AI interpretation inaccurate or hallucinated | Medium | High | Ground AI on retrieved judgments; mark as AI-generated; lawyer verifies |
| Binding/persuasive misclassification | Low | High | Derive marking from the issuing court field, not from AI guess |
| Statute library incomplete (sections missing) | Medium | Medium | Start with most-cited sections of the 6 codes; expand iteratively |

---

## Technical Notes

| Component | Detail |
|-----------|--------|
| Route / Page | `/statute-search` |
| Statute library | Built-in sections for 6 codes (PPC, CrPC, CPC, MFLO, SRA, FCA) |
| Judgment search API | `POST /api/ai/judgment` with section-specific queries |
| Judgment data source | Local `judgments.db` corpus |
| Authority marking | Binding = Supreme Court; Persuasive = High Court / Federal Shariat Court — derived from issuing court |
| AI interpretation | Explains section meaning + judicial interpretation, grounded on retrieved judgments |
| Bookmarks | Per-user saved sections |
| Skill | LEGAL-08 (Statute & Citation Search) |
| Related | EPIC-05 (Judgment Intelligence) — shares judgment corpus and AI judgment API |

---

## Definition of Done

| # | Condition |
|---|-----------|
| 1 | All User Stories (US-12-01 to US-12-05) implemented and merged |
| 2 | All Acceptance Criteria (AC-01 to AC-09) verified and checked off |
| 3 | All 6 codes browsable with sections |
| 4 | Section click returns citing judgments from `judgments.db` |
| 5 | AI interpretation renders for a section |
| 6 | Binding vs persuasive marking verified against known judgments |
| 7 | Bookmarks save and recall correctly |
| 8 | Deployed to production (live) with no critical bugs |
| 9 | Abdullah has reviewed and signed off |

---

## Out of Scope

| Feature | Reason |
|---------|--------|
| Full bare-act text of every section of every code | Library covers major codes' sections; full statute corpus is a separate effort |
| Provincial Acts and subordinate legislation | Covered by the statute-corpus scraping track, not this page |
| Editing / annotating section text | Read + bookmark only in v1 |
| Cross-referencing amendments / repeals history | v1.5 |

---

## Dependencies

| Dependency | Why Needed |
|-----------|-----------|
| EPIC-05 (Judgment Intelligence) | Shares `judgments.db` corpus and `/api/ai/judgment` |
| Local `judgments.db` | Source of citing judgments |
| Skill LEGAL-08 | Statute & Citation Search behaviour |
| Abdullah UX validation | Section search + authority marking must match real practice |

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-06-19 | Hamza | Initial epic documented from built feature |
