---
type: brainstorm
title: "TaqiAI - Legal AI for Pakistan"
status: Complete
owner: Hamza
last_updated: 2026-02-22
kb_summary: "Pre-vision brainstorm for AI legal drafting and analysis tool for Pakistani lawyers"
---

# TaqiAI — Brainstorm Document

**Created**: 2026-02-22
**Status**: Complete → Vision Document Generated
**Methodology**: EXPERT-26 (Brainstormer) Framework

---

## 1. THE SPARK

### What's the idea?
An AI-powered legal drafting and analysis assistant purpose-built for the Pakistani legal system. It helps lawyers draft statements, arguments, and legal documents for both plaintiffs and defendants — starting with AI accuracy testing using solved cases before any productization.

### What problem does it solve?
Pakistani lawyers have zero AI tools designed for their jurisdiction. They spend hours on manual precedent research, draft documents from scratch, and rely on institutional memory for argument construction. Meanwhile, US/UK lawyers have Harvey, CoCounsel, and Lexis+ AI.

### Who has this problem?
~200,000 practicing lawyers in Pakistan — from sole practitioners handling criminal defense to mid-size firms doing civil litigation. Also paralegals, law students, and potentially judicial officers.

### Why now?
- LLMs have reached the capability threshold for legal reasoning
- Pakistan's legal market is completely untouched by AI
- Even best legal AI tools hallucinate 17-33% — there's room for accuracy-focused approach
- Defense-side tooling is the most underserved niche globally
- Internal-first testing approach reduces risk of shipping bad AI

---

## 2. THE OPPORTUNITY

### Market Size
- 200,000+ licensed lawyers in Pakistan, growing 5-8% annually
- Legal services market estimated at $1-2B (formal sector)
- Zero AI competitors in the Pakistan-specific space

### Why this could be big
1. **First mover** — No one is building for PPC, CrPC, CPC
2. **Expandable** — Pakistan framework transferable to India, Bangladesh, Sri Lanka (shared British common law roots)
3. **Dual capability** — Analysis + Drafting creates a complete workflow
4. **Network effects** — Solved case corpus builds defensible moat
5. **Underserved niche** — Defense-side tooling gap exists globally

### Why this could fail
1. **Hallucination risk** — Legal AI getting citations wrong is malpractice territory
2. **Lawyer trust** — Conservative profession resistant to AI tools
3. **Data scarcity** — Pakistani case law not as digitized as US/UK
4. **Pricing challenge** — Pakistani lawyers earn $300-2,000/month; can't pay $100+/month for tools
5. **Regulatory uncertainty** — Bar Council may resist AI in legal practice

---

## 3. THE TWO-MODE WORKFLOW

### Forward Mode (Facts → Draft)
**Input**: Case facts + party role (plaintiff/defendant) + case type (civil/criminal)
**Process**: AI analyzes facts → identifies applicable law → constructs arguments → drafts document
**Output**: Draft pleading/statement with Pakistani law citations and prayer/relief

**Document types**:
- Civil: Plaints, Written Statements, Appeals, Applications
- Criminal: Bail Applications, Defense Statements, Appeals, Complaints
- Common: Affidavits, Miscellaneous Applications

### Reverse Mode (Judgment → Analysis)
**Input**: Solved court judgment or case file
**Process**: AI decomposes case → extracts facts → maps arguments → catalogs citations → analyzes reasoning
**Output**: Structured breakdown of the entire case

**Analysis outputs**:
- Factual matrix
- Legal issues identified
- Plaintiff/prosecution arguments (separately)
- Defendant arguments (separately)
- Laws cited with sections
- Court's reasoning chain
- Judgment rationale and outcome

### Why Bidirectional?
- Reverse mode **teaches** the AI how Pakistani lawyers actually argue
- Forward mode **applies** that learning to new cases
- Testing both modes against solved cases validates accuracy from two angles
- Lawyers can analyze opposing counsel's likely arguments before court

---

## 4. THE SCOPE

### Civil Coverage
- Property disputes (most common in Pakistan)
- Contract disputes
- Family law (Muslim Family Laws Ordinance)
- Tort claims
- Injunction applications
- Recovery suits

### Criminal Coverage
- Bail applications (most time-pressured)
- Murder defense (Section 302 PPC)
- Fraud cases (Section 420 PPC)
- Cybercrime (PECA 2016)
- Drug offenses (CNS Act)
- Terrorism-related (ATA)

### Both Sides
- **Plaintiff/Prosecution**: Building cases, drafting complaints, prosecution arguments
- **Defendant/Defense**: Bail applications, defense statements, appeals against conviction
- **No bias** — equal capability for both sides

---

## 5. THE TESTING STRATEGY

### Internal-First Approach
**Phase 1**: Build Claude skills → Test with solved cases → Measure accuracy
**Phase 2**: Iterate on prompts based on lawyer feedback → Improve accuracy
**Phase 3**: Once accuracy is proven, begin productization

### Testing Methodology
1. **Collect solved cases** — Cases with known judgments (Supreme Court, High Court)
2. **Forward test**: Give AI the facts → Compare AI draft to actual filed document
3. **Reverse test**: Give AI the judgment → Compare AI analysis to known facts/arguments
4. **Score both**: Using LEGAL-03 (Legal Comparator) with quantitative metrics
5. **Track over time**: Accuracy, completeness, speed metrics in Results-Tracker

### Success Criteria
| Metric | Target | Why |
|--------|--------|-----|
| Citation accuracy | >90% | Below this, tool creates legal risk |
| Argument completeness | >80% | Must catch major arguments |
| Structural compliance | 100% | Court won't accept improperly formatted documents |
| Hallucination rate | <10% | Must beat current 17-33% industry baseline |

---

## 6. THE PHASED ROADMAP

| Phase | Focus | Deliverables |
|-------|-------|-------------|
| **Phase 1: Skills** | Build internal Claude skills | LEGAL-01, 02, 03 |
| **Phase 2: Testing** | Test with solved cases | Accuracy scores, iteration |
| **Phase 3: PRD** | Product requirements after testing | PRD based on proven capabilities |
| **Phase 4: Beta** | 5-10 lawyer beta partners | Real-world feedback |
| **Phase 5: Launch** | Production product | Criminal defense first (most underserved) |

---

## 7. KEY ASSUMPTIONS TO VALIDATE

| # | Assumption | How to Validate |
|---|-----------|-----------------|
| 1 | LLMs can learn Pakistani legal reasoning patterns | Test LEGAL-01 on 10+ solved cases |
| 2 | AI can cite correct PPC/CrPC/CPC sections | Measure citation accuracy via LEGAL-03 |
| 3 | Multi-stage pipeline reduces hallucination below 10% | Compare single-pass vs pipeline accuracy |
| 4 | Pakistani lawyers will trust AI-assisted drafting | Beta partner interviews after Phase 4 |
| 5 | Defendant-side demand is strong enough for first product | Lawyer interviews in Phase 2 |
| 6 | Solved cases are sufficient for testing (vs live cases) | Compare test accuracy to beta real-world accuracy |
| 7 | English-first is acceptable (vs needing Urdu from day 1) | Beta partner language preference survey |

---

## 8. HARD QUESTIONS

1. **What if hallucination rate can't get below 15%?** → May need to pivot to research-only (no drafting) or add mandatory human verification layer before every citation
2. **What if Pakistani case law data is too sparse for good RAG?** → Start with Supreme Court (well-digitized) and expand; may need manual digitization effort
3. **What if lawyers don't trust AI output?** → Position as "first draft generator" not "legal advisor"; lawyer always makes final call
4. **How do we handle conflicting precedents from different High Courts?** → Flag conflicts explicitly; let lawyer choose which jurisdiction's precedent to follow
5. **What about legal malpractice liability?** → Tool disclaimer + lawyer responsibility + no unauthorized practice of law
6. **Can we monetize at Pakistani price points?** → Per-document pricing instead of subscriptions; or freemium with premium features

---

## 9. DOMAIN EXPERT VALIDATION (REC-091, REC-092)

**Date**: 2026-02-22
**Source**: Domain expert validation (internal legal practice review)

Key validation points:
- **Drafting > Research**: Legal drafting (plaints, written statements) is a higher-value use case than legal research. Drafting is the core creative work of a lawyer.
- **Current AI is inadequate**: Existing AI tools for legal drafting produce output that is "very poor" — unusable for court proceedings. This confirms both the market gap and the quality bar.
- **Dual-perspective essential**: Tool must draft from both plaintiff and defendant perspectives.
- **India-based competitor exists**: Validates market demand for legal AI; TaqiAI differentiates through Pakistan jurisdiction focus.
- **Real case files needed**: Solved Pakistani case files required for benchmarking AI drafting output against actual filed documents.

**Impact on brainstorm**: Legal drafting elevated from equal-to-research to PRIMARY capability. Research repositioned as complementary feature for post-MVP development.

---

## 10. NEXT STEPS

- [x] Create product scaffold in PRODUCTS/taqiai/
- [x] Generate Vision Document (EXPERT-20)
- [x] Build Phase 1 skills (LEGAL-01, 02, 03)
- [x] Create testing framework
- [ ] Collect solved Pakistani case files for testing (P0 blocker)
- [ ] Joint drafting test session with real case
- [ ] Review India-based legal AI competitor
- [ ] Collect first 5 solved cases for testing
- [ ] Run LEGAL-01 on first case → review with lawyer
- [ ] Iterate on skills based on testing feedback
