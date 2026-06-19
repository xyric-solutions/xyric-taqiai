---
type: protocol
title: "TaqiAI - Testing Protocol"
status: Draft
owner: Hamza
last_updated: 2026-02-22
kb_summary: "Testing methodology for validating TaqiAI legal AI accuracy against solved cases"
---

# TaqiAI - Testing Protocol

## Purpose

This protocol defines how to test TaqiAI's legal AI skills against solved Pakistani court cases. The goal is to quantify accuracy, identify weaknesses, and iterate until output quality meets professional standards.

---

## Testing Philosophy

1. **Solved cases only** — Only test against cases with known outcomes (judgments already delivered)
2. **Bidirectional testing** — Test both Forward (facts → draft) and Reverse (judgment → analysis)
3. **Lawyer validation required** — Every test result must be reviewed by a qualified Pakistani lawyer
4. **Quantitative scoring** — Use LEGAL-03 for consistent, measurable accuracy metrics
5. **Track over time** — Record all scores in Results-Tracker.md to measure improvement

---

## Test Types

### Type A: Reverse Test (Case Analysis)

**Skill**: LEGAL-01 (Case Analyzer)

| Step | Action |
|------|--------|
| 1 | Select a solved case with published judgment |
| 2 | Input the full judgment text into LEGAL-01 |
| 3 | Review AI's structured breakdown |
| 4 | Score: Were all facts captured? All issues identified? All arguments mapped? All citations correct? |
| 5 | Record scores in Results-Tracker.md |

**Scoring Rubric (Type A)**:

| Dimension | Weight | Scoring |
|-----------|--------|---------|
| Factual completeness | 20% | % of material facts correctly extracted |
| Issue identification | 20% | % of legal issues correctly identified |
| Argument mapping | 25% | % of arguments correctly attributed to plaintiff/defendant |
| Citation accuracy | 25% | % of cited laws/cases that are real and correctly referenced |
| Reasoning analysis | 10% | Quality of court's reasoning chain analysis (1-5 scale) |

### Type B: Forward Test (Legal Drafting)

**Skill**: LEGAL-02 (Legal Drafter)

| Step | Action |
|------|--------|
| 1 | From a solved case, extract ONLY the facts (hide the judgment and filed documents) |
| 2 | Input facts + party role + case type into LEGAL-02 |
| 3 | Review AI's drafted document |
| 4 | Compare AI draft to the actual filed document using LEGAL-03 |
| 5 | Record scores in Results-Tracker.md |

**Scoring Rubric (Type B)**:

| Dimension | Weight | Scoring |
|-----------|--------|---------|
| Argument completeness | 25% | % of major arguments present in AI draft vs actual |
| Citation accuracy | 25% | % of cited laws that are real and applicable |
| Structural compliance | 20% | Does document follow court format requirements? (1-5 scale) |
| Legal reasoning quality | 20% | How well does the argument chain hold together? (1-5 scale) |
| Hallucination rate | 10% | % of fabricated citations or non-existent laws |

### Type C: Validation Test (Comparison)

**Skill**: LEGAL-03 (Legal Comparator)

| Step | Action |
|------|--------|
| 1 | Take AI-generated draft from Type B test |
| 2 | Take actual filed document from the same case |
| 3 | Run both through LEGAL-03 |
| 4 | Review accuracy scorecard |
| 5 | Identify patterns in what AI gets right vs wrong |

---

## Test Case Preparation

### Input Format

Each test case should be prepared with:

```markdown
## Case: [Case Name] ([Year] [Reporter] [Page])

### Metadata
- **Case Type**: Civil / Criminal
- **Court**: Supreme Court / High Court / District Court
- **Jurisdiction**: Punjab / Sindh / KPK / Balochistan / ICT
- **Key Laws**: PPC Section X, CrPC Section Y, etc.
- **Outcome**: Plaintiff/Prosecution won / Defendant won / Mixed

### Facts (for Forward testing)
[Extracted facts — what a lawyer would know before drafting]

### Judgment (for Reverse testing)
[Full text or summary of the court's judgment]

### Filed Documents (for Comparison)
[Actual plaint, written statement, bail application, etc.]
```

### Case Selection Criteria

| Criterion | Requirement |
|-----------|-------------|
| **Published judgment** | Must have a citable judgment |
| **Clear facts** | Facts should be extractable from judgment |
| **Mix of types** | Balance civil and criminal cases |
| **Mix of outcomes** | Include wins and losses for both sides |
| **Mix of complexity** | Simple (bail) to complex (murder appeal) |
| **Relevance** | Commonly encountered case types in Pakistani practice |

### Minimum Test Corpus

| Phase | Cases Required | Composition |
|-------|---------------|-------------|
| **Phase 1** | 5-10 | 3 criminal + 3 civil + 2 constitutional |
| **Phase 2** | 20-50 | Equal distribution across practice areas |
| **Phase 3** | 100+ | Comprehensive coverage of common case types |

---

## Review Process

### Lawyer Review Checklist

For each test case, the reviewing lawyer should assess:

- [ ] Are all cited law sections real and correctly numbered?
- [ ] Are case law citations real cases with correct holdings?
- [ ] Would the arguments be acceptable in a Pakistani court?
- [ ] Does the document structure follow court requirements?
- [ ] Are there any hallucinated facts or legal principles?
- [ ] Would you use this draft as a starting point? (Yes/No/With major edits)

### Review Rating Scale

| Rating | Meaning |
|--------|---------|
| **5 — Excellent** | Usable as-is with minor formatting tweaks |
| **4 — Good** | Usable as strong first draft; needs some legal refinement |
| **3 — Acceptable** | Has the right structure but needs significant legal editing |
| **2 — Poor** | Major issues — wrong citations, missing arguments, structural problems |
| **1 — Unusable** | Fundamentally flawed — hallucinated content, wrong area of law |

---

## Accuracy Targets

| Metric | Phase 1 Target | Phase 2 Target | Production Target |
|--------|---------------|---------------|-------------------|
| Citation accuracy | >70% | >85% | >95% |
| Argument completeness | >60% | >75% | >85% |
| Hallucination rate | <20% | <10% | <5% |
| Structural compliance | >80% | >95% | 100% |
| Lawyer review rating | >2.5 | >3.5 | >4.0 |
