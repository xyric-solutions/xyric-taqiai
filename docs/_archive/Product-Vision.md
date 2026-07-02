---
type: vision
title: "TaqiAI - Executive Vision Document"
status: Built — Live
owner: Hamza
last_updated: 2026-06-19
product: taqiai
lifecycle_stage: Launch & Growth
kb_summary: "Vision for AI legal drafting and advisory platform for the Pakistani legal system — now built and live with 13 modules"
---

<!-- PRD_READY: TAQIAI -->

# TaqiAI — Executive Vision Document

**Product Name**: TaqiAI
**Version**: 3.0
**Last Updated**: 2026-06-19
**Status**: Built — Live (Launch & Growth)
**Owner**: Xyric Solutions
**Contributors**: Hamza (strategy), Abdullah (legal domain + practicing lawyer)

> **Status note (2026-06-19)**: TaqiAI is now **built and live**. The product ships **13 working modules** in a real Next.js application (Gemini-powered, with a local Pakistani judgment corpus and statute database). What follows preserves the original vision narrative and positioning; module descriptions have been updated to reflect what is now shipped. Voice & Image intake — originally deferred to v2 — is **built and live**. Bilingual English/Urdu is **live** (no longer an open decision); Arabic is supported in the Translation module.

---

## 1. EXECUTIVE SUMMARY

TaqiAI is an AI-powered legal drafting and advisory platform purpose-built for the **Pakistani legal system**. It combines a **verified template library** of Pakistani court documents with **controlled AI generation** and **solved-case accuracy validation** to produce court-ready legal drafts in minutes — while keeping lawyers fully in control.

The platform now ships **13 integrated, live modules**: AI Document Drafting (50+ templates across 13 legal categories), Court-Case Drafting (criminal/civil/family/constitutional/property/corporate/tax/immigration/non-Muslim law), a Tax Calculator (stamp duty, PLRA, FBR charges), an AI Legal Advisor (conversational, judgment-grounded), Judgment Intelligence (search/Q&A/PDF analysis over a local judgment corpus), Chamber / Case Management, Legal Translation (Urdu/English/Arabic), Lawyer Diary (Roznamcha), Case Builder (judgment-backed drafting), Copy from Photo (OCR), Voice Case (discussion → draft), Statute Search, and a Document Vault. (See Section 5 for the full module list.) The original four-module concept — Drafting Engine, AI Legal Advisor, Tax Calculator, Case Analyzer — plus internal Validation Mode has been delivered and substantially expanded.

Pakistan's legal market of 200,000+ lawyers remains largely underserved by AI tools. Global players (Harvey, CoCounsel, Lexis+ AI) focus exclusively on US/UK jurisdictions. A Pakistani competitor — **DigiLawyer** (UET Lahore, launched Dec 2025) — now exists, but TaqiAI ships a far broader feature set (voice, image/OCR, bilingual, 13 modules, tax calculator, non-Muslim laws, case management). Pakistani lawyers still largely rely on manual precedent research, institutional memory, and from-scratch document drafting. TaqiAI is built specifically for PPC, CrPC, CPC, and Pakistan's unique hybrid legal system.

**Tagline**: *AI assists, lawyers verify and finalize.*

### The Problem

Pakistani lawyers spend disproportionate time on repetitive drafting — affidavits, agreements, petitions, bail applications — each with dozens of sub-variants. Current AI tools offer generic drafting that is "very poor" and unusable for actual court proceedings (domain expert validation, REC-092). The problem has three dimensions:

1. **No jurisdiction-specific AI** — every AI tool is built for US/UK law, not PPC/CrPC/CPC
2. **No verified templates** — free-form AI generation creates structural and legal errors
3. **No accuracy standard** — no tool validates output against real court documents

### The TaqiAI Solution

A multi-module legal platform designed for the lawyer-in-the-loop workflow. The platform launched with the four core modules below and has since expanded to **13 live modules** (full list in Section 5):

1. **AI Document Drafting** — Verified templates for Pakistani legal documents, with AI filling case-specific facts and arguments. 50+ templates across 13 legal categories (live).

2. **AI Legal Advisor** — Conversational, judgment-grounded legal guidance for Pakistani law. Citation-backed; uncertain cases flagged for manual review (live).

3. **Tax Calculator** — Stamp Duty, PLRA, FBR, Withholding, and Capital Gains calculations for property and transactional legal matters (live).

4. **Judgment Intelligence (formerly Case Analyzer)** — Search, Q&A and PDF analysis over a local Pakistani judgment corpus; decomposes judgments into structured breakdowns and informs drafting (live).

### What Makes TaqiAI Different

- **Pakistan-first** — Built for PPC, CrPC, CPC; not adapted from US/UK tools
- **Verified-template + controlled-AI model** — Templates define legal structure; AI fills content; lawyer reviews and approves
- **Bidirectional** — Both drafting (Facts → Document) and analysis (Judgment → Breakdown) in one platform
- **Both sides of the bar** — Equal capability for plaintiff AND defendant; prosecution AND defense
- **Accuracy-first** — Every capability validated against solved cases before productization
- **Lawyer-in-loop by design** — Mandatory review gate before any document export

---

## 2. MISSION STATEMENT

**"To empower Pakistani lawyers with AI that understands their jurisdiction — enabling faster, more thorough legal drafting and analysis across civil and criminal practice, for both plaintiff and defendant."**

---

## 3. VISION STATEMENT

**"By 2028, TaqiAI will be the trusted AI legal platform for Pakistani lawyers — the tool they rely on daily for document drafting, case analysis, and legal guidance, setting the standard for jurisdiction-specific legal AI in emerging markets."**

### Vision Components

**Verified Template Infrastructure:**
- 120–150 master templates covering the full Pakistani legal document landscape (v1 launches 5–8 highest-frequency types)
- Templates pre-reviewed by qualified Pakistani legal experts
- Legal structure fixed and court-compliant; AI fills variable facts only

**Bidirectional Legal Workflow:**
- Forward Mode: Case facts → structured legal documents with appropriate citations
- Reverse Mode: Court judgments → structured analytical breakdowns
- Cross-pollination: Analysis patterns from Reverse Mode inform better Forward Mode drafting

**Accuracy-First Development:**
- Every capability validated against solved cases with known outcomes
- Quantitative accuracy scoring across citation accuracy, argument completeness, structural compliance
- Hallucination rate targeted below 10% (vs industry baseline of 17–33%)
- Multi-stage verification pipeline for every output

**Practical Legal Utilities:**
- Tax Calculator covers the financial calculations tied to every property and transactional matter
- Voice & Image intake (v2) enables natural client-to-lawyer information capture

---

## 4. TARGET USERS

### Primary Users

| Persona | % | Description | Primary Need |
|---------|---|-------------|-------------|
| **Civil Litigation Lawyer** | 40% | Handles property, contract, family law disputes | Written statements, plaints, precedent research |
| **Criminal Defense Lawyer** | 30% | Bail applications, defense arguments, appeals | Fast bail drafting, defense precedents |
| **Prosecution/Plaintiff Lawyer** | 20% | Criminal complaints, charge sheets, prosecution arguments | Case-building, evidence structuring |

### Secondary Users

| Persona | Phase | Description | Primary Need |
|---------|-------|-------------|-------------|
| **Paralegal / Junior Associate** | v1 | Assists senior lawyers with research and first drafts | Efficient first-draft generation, citation verification |
| **Law Student** | v2 | Studying for bar exams, moot court, legal clinics | Understanding case analysis, learning argument construction |
| **Judge / Judicial Officer** | v2 (Read-Only) | Case law research and judgment drafting assistance | Case summaries, precedent compilation |

---

## 5. CORE MODULES

> **Live as of 2026-06-19** — TaqiAI ships **13 working modules** in the production application. The descriptions below preserve the original module design intent; the table here is the authoritative list of what is shipped.

| # | Module | Route(s) | Epic | Status |
|---|--------|----------|------|--------|
| 1 | **AI Document Drafting** — 50+ templates across 13 legal categories | `/affidavits`, `/agreements`, `/applications`, `/power-of-attorney` | EPIC-01 | Live |
| 2 | **Court-Case Drafting** — criminal/civil/family/constitutional/property/corporate/tax/immigration/non-Muslim law | — | EPIC-02 | Live |
| 3 | **Tax Calculator** — stamp duty, PLRA, FBR, withholding, capital gains | `/property-transfer/tax-calculator` | EPIC-03 | Live |
| 4 | **AI Legal Advisor** — conversational + judgment-grounded | `/ai-advisor` | EPIC-04 | Live |
| 5 | **Judgment Intelligence** — search / Q&A / PDF analysis over local judgments.db | `/case-law` | EPIC-05 | Live |
| 6 | **Chamber / Case Management** | `/chamber` | EPIC-06 | Live |
| 7 | **Legal Translation** — Urdu / English / Arabic | `/translate` | EPIC-07 | Live |
| 8 | **Lawyer Diary (Roznamcha)** | `/lawyer-diary` | EPIC-08 | Live |
| 9 | **Case Builder** — judgment-backed drafting | `/case-builder` | EPIC-09 | Live |
| 10 | **Copy from Photo** — OCR | `/copy-from-photo` | EPIC-10 | Live |
| 11 | **Voice Case** — discussion → draft | `/voice-case` | EPIC-11 | Live |
| 12 | **Statute Search** | `/statute-search` | EPIC-12 | Live |
| 13 | **Document Vault** | `/documents` | EPIC-13 | Live |

**Platform tech (live)**: Next.js + React + TypeScript, Tailwind ("Midnight Qanoon" dark cyan/violet design system), Google Gemini (multi-model fallback), Prisma + SQLite application DB, a read-only `judgments.db` corpus with a semantic search service, and a `statutes.db` corpus, JWT authentication. Bilingual English/Urdu is live; Arabic is supported in the Translation module.

The detailed module descriptions that follow reflect the original design intent (now realised and, in several cases, expanded):

### Module 1: Drafting Engine

The core capability. Built on master templates covering all major Pakistani legal document types, with AI filling case-specific content.

**Architecture**: *Verified Template Structure + AI-Powered Content Fill + Solved-Case Accuracy Validation*

**Document Types (v1 — full library per Q5 decision)**:
- Bail Application (Criminal)
- Plaint (Civil)
- Written Statement (Civil)
- Affidavit (Common)
- Bail Reply / Opposition
- Criminal Appeal
- Miscellaneous Application

**Document Types (Target — 120–150 master templates)**:
- Full coverage of Pakistani legal practice areas organized by court and matter type

**Four Interaction Modes** — lawyer picks per document:
- **(a) Auto-draft → inline edit** — AI generates full draft from template, lawyer edits inline
- **(b) Clarify-then-draft** — AI asks clarifying questions before generating draft
- **(c) Variant selection** — AI produces 2–3 variants, lawyer selects preferred approach
- **(d) Hybrid** — combination of above based on case complexity

**Mandatory Review Gate**: No document exports without explicit lawyer approval. Review stage is enforced in the workflow, not optional.

---

### Module 2: AI Legal Advisor

Chat-based assistant trained on Pakistani law, providing legal guidance with verified and citation-backed responses only.

| Aspect | Detail |
|--------|--------|
| **Scope** | PPC, CrPC, CPC, Qanun-e-Shahadat, Family Law, Contract Act, constitutional matters |
| **Citation safety** | AI cannot invent citations; only pre-approved references allowed; uncertain cases flagged |
| **Use cases** | Case classification, applicable section identification, procedural guidance, argument strategy |
| **Positioning** | Drafting tool and legal advisor — NOT a lawyer; all guidance requires qualified review |

---

### Module 3: Tax Calculator

A specialized utility for legal and property transactions — a unique differentiator with no equivalent in the (now single-competitor) Pakistani market.

| Tax Type | Scope |
|----------|-------|
| **Stamp Duty** | Property transfers, agreements, court documents |
| **PLRA Charges** | Punjab Land Records Authority registration fees |
| **FBR Taxes** | Federal Board of Revenue taxes on transactions |
| **Withholding Tax** | Tax deducted at source on property transactions |
| **Capital Gains Tax** | Gains on property disposal |

**Value**: Every property or transactional legal matter requires these calculations. Lawyers currently do this manually or via unofficial tables. Building it into the platform creates a daily-use habit and differentiates from pure-drafting competitors.

---

### Module 4: Case Analyzer (Reverse Mode)

Decompose court judgments and case files into structured analytical components.

| Aspect | Detail |
|--------|--------|
| **Skill** | LEGAL-01 (Case Analyzer) |
| **Input** | Court judgments, FIRs, case files (PDF or text) |
| **Output** | Structured breakdown: facts, issues, arguments from both sides, applicable law citations, court reasoning |
| **Value** | Understand how successful arguments were constructed in similar cases; informs Forward Mode drafting |

---

### Module 5: Accuracy Validation (Validation Mode — Internal)

Internal capability for measuring and improving AI output quality against solved cases.

| Aspect | Detail |
|--------|--------|
| **Skill** | LEGAL-03 (Legal Comparator) |
| **Input** | AI-generated draft + actual filed document from a solved case |
| **Output** | Accuracy scorecard: arguments matched/missed, citations correct/incorrect, structural compliance |
| **Value** | Continuous quality improvement through data-driven iteration; proves accuracy before productization |

---

### Module 6: Voice & Image Intake — BUILT & LIVE

*(Originally deferred to v2 — now shipped as two live modules: **Voice Case** `/voice-case` (EPIC-11) and **Copy from Photo** `/copy-from-photo` (EPIC-10).)*

Lets lawyers capture client input naturally:
- **Voice input (Voice Case)**: Record or upload an advocate-client discussion → AI extracts key legal facts and issues → drafts a case document
- **Image/document understanding (Copy from Photo)**: Upload a photo of a document → AI OCRs and reproduces it same-to-same

**Workflow**: Client Voice/Image → AI Analysis → Structured Case Summary → Legal Draft Generation

---

## 6. TRUST & ACCURACY (HYBRID SAFETY MODEL)

| Layer | Description |
|-------|-------------|
| **Verified Template Core** | All templates pre-reviewed by qualified Pakistani legal experts. Legal structure is fixed and court-compliant. |
| **Controlled AI Generation** | AI fills structured templates with user-provided case facts — it does not freely generate legal structure. |
| **Citation Safety** | AI cannot invent citations. Only pre-approved references are allowed. Uncertain cases are flagged for manual lawyer research. |
| **Mandatory Lawyer Review** | No document exports without explicit lawyer approval. Review stage is enforced in the workflow. |
| **Solved-Case Validation** | Every capability tested against solved cases with known outcomes before any productization. |
| **Multi-Stage Verification Pipeline** | Research → Reasoning → Drafting → Verification. Reduces hallucination across the output chain. |

**Accuracy Targets**:

| Metric | Target |
|--------|--------|
| Citation accuracy | > 90% |
| Argument completeness | > 80% |
| Hallucination rate | < 10% (vs industry 17–33%) |
| Structural compliance | 100% |
| Lawyer edit ratio | < 20% of AI output modified (indicates template quality) |

---

## 7. DOMAIN EXPERT VALIDATION

TaqiAI's positioning has been validated through internal domain expert review (Abdullah — practicing Pakistani lawyer):

| Claim | Validation | Source |
|-------|-----------|--------|
| **Drafting is the primary pain point** | Abdullah confirmed drafting (plaints, written statements) is higher value than research for practicing lawyers | REC-092 |
| **Current AI drafting is inadequate** | Abdullah tested existing AI tools and found output "very poor" — unusable for court proceedings | REC-092 |
| **Dual-perspective is essential** | Abdullah confirmed the tool must draft from both plaintiff and defendant perspectives | REC-092 |
| **Market opportunity exists** | India-based competitor validates demand; Pakistan has zero localized alternatives | REC-091 |
| **Real case testing is the right approach** | Abdullah committed to providing real solved case files for benchmarking AI output against actual filed documents | REC-092 |

**Drafting-First Strategy**: Legal drafting (Forward Mode) is the primary capability. Legal research is positioned as a complementary feature developed after drafting accuracy is proven. This is a validated inversion of the initial assumption (REC-091) that research would be primary.

---

## 8. COMPETITIVE POSITIONING

### The Market Gap

Global legal AI is built for US/UK:
- **Harvey AI**: Enterprise pricing, US/UK focus, contract-heavy
- **CoCounsel**: US legal research, $100+/user/month
- **Lexis+ AI**: US/UK research, enterprise only
- **Pakistan**: One local competitor — **DigiLawyer** (UET Lahore, Dec 2025) with ARK AI (citation research) and MIKE AI (court drafting). Otherwise still a near-whitespace market of 200,000+ lawyers. TaqiAI now ships 13 live modules and leads on voice, image/OCR, bilingual coverage, tax calculator, non-Muslim laws, and case management.

### TaqiAI's Position

**"The first AI legal platform that speaks Pakistani law."**

| Axis | TaqiAI | Global Competitors |
|------|--------|-------------------|
| **Jurisdiction** | Pakistan-first (PPC/CrPC/CPC) | US/UK only |
| **Safety model** | Verified templates + controlled AI | Free-form AI generation |
| **Capability** | Drafting + Analysis + Tax Calculator | Research-only or contract-only |
| **Coverage** | Both sides of the bar | Prosecution/plaintiff biased |
| **Development** | Accuracy-first, solved-case validated | Ship-fast |
| **Pricing** | Accessible PKR-denominated tiers | Enterprise ($500–1,000+/month) |
| **Urdu** | Live (bilingual English/Urdu; Arabic in Translation) | Not supported |

---

## 9. MONETIZATION

| Tier | Target | Model |
|------|--------|-------|
| **Free Trial** | All users | 10 drafts/month, no credit card required |
| **Solo Pro** | Individual advocates | Affordable PKR-denominated monthly subscription *(pricing TBD — see Open Decisions)* |
| **Firm** | Small–large law firms | Per-seat licensing or flat firm subscription |
| **Pay-per-draft** | Occasional users | Per-document pricing for those who can't commit to subscription |

**Market Constraint**: Pakistani lawyers earn PKR 80,000–600,000/month ($300–2,000). Pricing must be set well below global tool benchmarks ($100–500/month) to achieve meaningful adoption. PKR-denominated pricing with local payment methods is required.

---

## 10. PHASED ROADMAP

### Phase 1: Internal Skills (Current)
- Build LEGAL-01 (Case Analyzer), LEGAL-02 (Legal Drafter), LEGAL-03 (Legal Comparator) as Claude skills
- Create testing framework with scoring rubrics
- Validate approach with 5–10 solved cases from Abdullah's practice
- **Blocked on**: Case files collection (Abdullah)

### Phase 2: Testing & Iteration
- Expand test corpus to 50+ solved cases
- Iterate on skills based on lawyer feedback
- Target: Hallucination rate < 10%, argument completeness > 80%, citation accuracy > 90%
- Confirm v1 document type list with Abdullah

### Phase 3: Product Requirements
- Generate PRD based on proven capabilities
- Define product architecture (web app, API)
- Lock pricing model and language scope (Urdu decision)
- Design verified template library and creation process

### Phase 4: Beta
- 5–10 trusted lawyer partners
- Real-world case testing with full lawyer oversight
- Gather feedback on usability, accuracy, and workflow integration

### Phase 5: Launch
- Criminal defense first (most underserved, most time-pressured)
- Expand to civil litigation
- Build case law corpus for deeper RAG capabilities
- v2 modules: Voice & Image Intake, expanded template library (50+)

---

## 11. STRATEGIC PRINCIPLES

| Principle | Application |
|-----------|-------------|
| **AI assists, lawyers verify** | Every document passes mandatory lawyer review before export |
| **Depth over breadth** | Master Pakistan before expanding; template quality over template count |
| **Legal structure is sacred** | Templates define structure; AI never generates legal format from scratch |
| **Pakistani-law-first, always** | PPC/CrPC/CPC native — never adapted from foreign law tools |
| **Accuracy over speed** | Better right slowly than wrong quickly; legal errors have real consequences |
| **Internal-first** | Prove capability with solved cases before any productization |
| **Both sides of the bar** | Equal capability for plaintiff AND defendant; never biased |
| **Transparent AI** | All output clearly labeled as AI-assisted; no hiding the machine |
| **Bilingual by design** | Live — English/Urdu bilingual shipped; Arabic supported in Translation |

---

## 12. SUCCESS METRICS

### Phase 1 (Internal Skills Validation)

| Metric | Target | Measurement |
|--------|--------|-------------|
| Citation accuracy | > 90% | LEGAL-03 scoring on solved cases |
| Argument completeness | > 80% | LEGAL-03 scoring vs filed documents |
| Hallucination rate | < 10% | Manual review of fabricated citations |
| Structural compliance | 100% | Court format adherence check |
| Test corpus size | 10+ solved cases | Case-Log.md registry |

### Phase 4+ (Product)

| Metric | Target |
|--------|--------|
| Time-to-draft | < 5 minutes per standard document |
| Lawyer edit ratio | < 20% of AI output modified |
| Lawyer satisfaction (beta) | > 4/5 rating |
| Repeat usage | > 3x/week by beta lawyers |
| Subscription retention | > 70% at 3 months, > 60% at 6 months |
| Monthly active advocates | Growth metric (target TBD at PRD phase) |

---

## 13. RISKS AND MITIGATIONS

| Risk | Severity | Mitigation |
|------|----------|------------|
| AI hallucination of citations | Critical | Verified templates + citation safety layer; multi-stage verification; mandatory lawyer review |
| Lawyer trust/adoption | High | Internal-first accuracy track record; "assistant not replacement" positioning; free trial |
| Pakistani case law data scarcity | Medium | Start with Supreme Court (well-digitized); expand to High Courts incrementally |
| Regulatory pushback from Bar Council | Medium | Tool positioned as drafting assistant; lawyer always responsible for final output |
| Pricing mismatch with market | Medium | PKR-denominated tiers; per-document option; free trial; firm licensing offsets solo pricing |
| Urdu scope underestimated | Medium | Commit to Urdu as a milestone with defined timeline; don't defer indefinitely |
| Competition from global players entering Pakistan | Low | First-mover advantage; jurisdiction depth (PPC/CrPC expertise) takes years to replicate |

---

## 14. OPEN DECISIONS

These must be resolved before the PRD phase begins:

| Decision | Options | Owner | Priority |
|----------|---------|-------|----------|
| ~~**Urdu scope**~~ | RESOLVED (2026-06-19) — bilingual English/Urdu is live; Arabic supported in Translation | Abdullah + Hamza | Done |
| **V1 document type list** | RESOLVED — 50+ templates across 13 categories shipped | Abdullah | Done |
| **PKR pricing tiers** | Free trial limits, Solo Pro monthly rate, Firm per-seat rate | Hamza | P1 |
| **Template verification process** | Who reviews each template for legal accuracy? Review cadence? | Abdullah | P1 |
| **External "TaqiAI" competitor** | Is there a real market product by this name in Pakistan? | Abdullah | P1 |
| **Data privacy model** | Case data handling policy; PDPB compliance approach | Hamza | P1 |

---

## APPENDIX

### Version History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-02 | Initial vision (4 modules + internal validation) |
| 2.0 | 2026-04-19 | Vision refinement; DigiLawyer competitor identified; Urdu/pricing open decisions |
| 3.0 | 2026-06-19 | Updated to reflect built & live product — 13 modules shipped |

### Related Documents

- [Brainstorm Document](./brainstorm.md)
- [Vision Analysis & Gap Report](../../PLAYGROUND/VISION-ANALYSIS.md)
- [Abdullah's Vision Input](../../PLAYGROUND/VISION.md)
- [Market Landscape](./research/Market-Landscape.md)
- [Pakistan Legal System Reference](./research/Pakistan-Legal-System.md)
- [Product Identity](./context/product-identity.md)
- [Personas](./context/personas.md)
- [Pillars](./context/pillars.md)
- [Constraints](./context/constraints.md)
- [Terminology](./context/terminology.md)
- [Discussion Log (REC-091, REC-092)](./context/discussion-log.md)

### Xyric Portfolio Context

TaqiAI is part of Xyric Solutions' product portfolio — a moonshot targeting an AI-first vertical in an underserved market. The internal-first testing methodology (prove accuracy before productizing) aligns with Xyric's Research-First Development and AI-Native with Quality Gates principles. Abdullah (practicing lawyer + legal domain expert) is the primary domain expert anchoring the product.
