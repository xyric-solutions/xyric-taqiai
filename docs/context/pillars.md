# TaqiAI - Product Pillars

> **Source:** Product Vision — updated 2026-06-19 to reflect the built & live product.

---

## Foundational Pillars

TaqiAI grew from four reinforcing capabilities: **Case Analysis**, **Legal Drafting**, **Tax Calculator**, and **Quality Assurance**. The first three serve lawyers directly; the fourth validates and improves the system internally. Analysis informs drafting, drafting reveals gaps in analysis, and QA validates both. These remain the conceptual foundation — but the shipped product now spans **13 live modules** built on top of them (see the [Live Product Modules](#live-product-modules) map below and [`../epics/MASTER-EPIC.md`](../epics/MASTER-EPIC.md)).

---

## Pillar Structure

### Pillar 1: Case Analysis (Reverse Mode)

| Aspect | Details |
|--------|---------|
| **Purpose** | Decompose judgments and case files into structured legal components |
| **Skill** | LEGAL-01 (Case Analyzer) |
| **Input** | Court judgments, FIRs, case files, evidence summaries |
| **Output** | Structured breakdown: facts, issues, arguments, citations, reasoning |

**Capabilities:**
- Extract factual matrix from case documents
- Identify legal issues and applicable law sections
- Map plaintiff/prosecution arguments separately from defendant arguments
- Catalog cited precedents and statutory authority
- Analyze court's reasoning chain and judgment rationale

### Pillar 2: Legal Drafting (Forward Mode)

| Aspect | Details |
|--------|---------|
| **Purpose** | Generate legal documents from case facts and party instructions |
| **Skill** | LEGAL-02 (Legal Drafter) |
| **Input** | Case facts, party role (plaintiff/defendant), case type (civil/criminal) |
| **Output** | Draft pleadings, statements, applications with Pakistani law citations |

**Document Types:**
- **Civil**: Plaints, Written Statements, Appeals, Applications, Petitions
- **Criminal**: Bail Applications, Defense Statements, Criminal Appeals, Complaints, Charge Sheets
- **Common**: Affidavits, Miscellaneous Applications, Review Petitions

### Pillar 3: Tax Calculator

| Aspect | Details |
|--------|---------|
| **Purpose** | Calculate legal and property transaction taxes for Pakistani practice |
| **Input** | Transaction type, property value, parties |
| **Output** | Calculated stamp duty, PLRA charges, FBR tax, withholding tax, capital gains tax |

**Coverage:**
- Stamp Duty (property transfers, agreements, court documents)
- PLRA Charges (Punjab Land Records Authority registration)
- FBR Taxes (Federal Board of Revenue transaction taxes)
- Withholding Tax (deducted at source on property transactions)
- Capital Gains Tax (gains on property disposal)

**Why a Pillar**: Every property and transactional legal matter requires these calculations. Lawyers currently do this manually or via unofficial tables. A built-in calculator creates daily-use habit and differentiates from pure-drafting competitors.

---

### Pillar 4: Quality Assurance (Validation Mode)

| Aspect | Details |
|--------|---------|
| **Purpose** | Measure AI accuracy against known-good legal outcomes |
| **Skill** | LEGAL-03 (Legal Comparator) |
| **Input** | AI-generated draft + actual filed/accepted document |
| **Output** | Accuracy scorecard with detailed comparison |

**Validation Dimensions:**
- Argument completeness (matched/missed)
- Citation accuracy (correct/incorrect/hallucinated)
- Structural compliance with court requirements
- Legal reasoning quality
- Overall quality score (0-100)

---

## Live Product Modules

The foundational pillars are now delivered through thirteen shipped modules, each documented as an epic:

| # | Module | Route | Epic | Built On Pillar |
|---|--------|-------|------|-----------------|
| 1 | AI Document Drafting (50+ templates, 13 categories) | `/affidavits`, `/agreements`, `/applications`, `/power-of-attorney` | EPIC-01 | Legal Drafting |
| 2 | Court-Case Drafting (criminal/civil/family/etc.) | `/criminal-law`, `/civil-law`, `/family-law`, … | EPIC-02 | Legal Drafting |
| 3 | Tax Calculator | `/property-transfer/tax-calculator` | EPIC-03 | Tax Calculator |
| 4 | AI Legal Advisor (conversational, judgment-grounded) | `/ai-advisor` | EPIC-04 | Case Analysis |
| 5 | Judgment Intelligence (search / Q&A / PDF analysis) | `/case-law` | EPIC-05 | Case Analysis |
| 6 | Chamber / Case Management | `/chamber` | EPIC-06 | (Practice ops) |
| 7 | Legal Translation (Urdu / English / Arabic) | `/translate` | EPIC-07 | Legal Drafting |
| 8 | Lawyer Diary (Roznamcha) | `/lawyer-diary` | EPIC-08 | (Practice ops) |
| 9 | Case Builder (judgment-backed drafting) | `/case-builder` | EPIC-09 | Analysis + Drafting |
| 10 | Copy from Photo (document OCR) | `/copy-from-photo` | EPIC-10 | Legal Drafting |
| 11 | Voice Case (discussion → draft) | `/voice-case` | EPIC-11 | Analysis + Drafting |
| 12 | Statute Search | `/statute-search` | EPIC-12 | Case Analysis |
| 13 | Document Vault (My Documents) | `/documents` | EPIC-13 | (Practice ops) |

> Quality Assurance (Pillar 4, LEGAL-03) remains an internal validation capability and is not a user-facing module.

---

## Cross-Pillar Intelligence

| Connection | Value |
|------------|-------|
| Analysis → Drafting | Patterns from analyzed cases inform argument construction |
| Drafting → Analysis | Draft gaps reveal need for deeper case analysis |
| QA → Both | Accuracy scores drive prompt refinement for both analysis and drafting |
| Solved Cases → All | Test corpus builds institutional knowledge across all pillars |

---

## Jurisdiction Layers

| Layer | Scope | Key Sources |
|-------|-------|-------------|
| **Constitutional** | Fundamental rights, constitutional petitions | Constitution of Pakistan 1973 |
| **Statutory Criminal** | Offenses, procedure, evidence | PPC 1860, CrPC 1898, Qanun-e-Shahadat 1984 |
| **Statutory Civil** | Procedure, contracts, property | CPC 1908, Contract Act 1872, Transfer of Property Act 1882 |
| **Islamic Law** | Hudood, family law, inheritance | Hudood Ordinances, Muslim Family Laws Ordinance 1961 |
| **Case Law** | Supreme Court, High Courts precedents | PLD, SCMR, CLC, PLC, YLR, NLR |
