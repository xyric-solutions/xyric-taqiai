---
type: registry
title: "TaqiAI - Case Log"
status: Active
owner: Hamza
last_updated: 2026-02-22
kb_summary: "Registry of solved cases used for TaqiAI accuracy testing"
---

# TaqiAI - Case Log

> **Purpose**: Registry of all solved cases used for testing TaqiAI skills
> **Total Cases**: 0
> **Last Updated**: 2026-02-22

---

## Case Registry

| # | Case Name | Reporter | Year | Type | Court | Key Laws | Tests Run | Avg Score |
|---|-----------|----------|------|------|-------|----------|-----------|-----------|
| — | *No cases registered yet* | — | — | — | — | — | — | — |

---

## Case Distribution Targets

| Category | Target | Current | Gap |
|----------|--------|---------|-----|
| Criminal cases | 5 | 0 | 5 |
| Civil cases | 5 | 0 | 5 |
| Constitutional cases | 2 | 0 | 2 |
| Bail applications | 3 | 0 | 3 |
| Property disputes | 2 | 0 | 2 |
| Murder/homicide | 2 | 0 | 2 |
| **Total** | **10+** | **0** | **10+** |

---

## How to Add a Case

1. Find a solved case with published judgment (PLD, SCMR, CLC, etc.)
2. Prepare test case following format in [Testing-Protocol.md](./Testing-Protocol.md)
3. Add entry to the registry table above
4. Store case materials in `testing/cases/` (to be created when first case added)
5. Run tests and record results in [Results-Tracker.md](./Results-Tracker.md)

---

## Case Sources

| Source | Type | Accessibility |
|--------|------|--------------|
| PLD (Pakistan Legal Decisions) | Supreme Court + High Courts | Published volumes |
| SCMR (Supreme Court Monthly Review) | Supreme Court only | Published volumes |
| Pakistani Case Law databases | Various courts | Online (partial) |
| Lawyer-provided case files | Real cases (anonymized) | By arrangement |

---

## Individual Case Records

*(Add detailed case records below as cases are registered)*

### Template

```markdown
## Case [#]: [Case Title]

**Citation**: [Year] [Reporter] [Page]
**Court**: [Court name]
**Type**: Criminal / Civil
**Key Laws**: [Sections]
**Outcome**: [Who won]
**Date Added**: [Date]
**Tests Run**: [List of test IDs]

### Case Summary
[Brief summary of facts and judgment]

### Test Notes
[Observations from testing this case]
```
