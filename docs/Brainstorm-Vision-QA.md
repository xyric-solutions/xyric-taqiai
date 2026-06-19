---
type: brainstorm
title: "TaqiAI - Vision Brainstorm Q&A (Abdullah)"
status: In Progress
owner: Abdullah
last_updated: 2026-04-20
product: taqiai
kb_summary: "Q&A capture from Vision-Analysis decisions. Resolves conflicts and gaps between Abdullah's VISION.md and Hamza's Product-Vision.md."
---

# TaqiAI — Vision Brainstorm Q&A

**Date:** 2026-04-20
**Author:** Abdullah
**Source:** [Vision-Analysis.md](./Vision-Analysis.md)
**Purpose:** Resolve conflicts/gaps from Vision-Analysis. Output feeds into Product-Vision v2.1 update.

---

## Q1 — Voice + Image Module Scope

**Conflict:** C1 (My VISION = core module; Product-Vision = v2 deferred)

**Decision: Option C with slight upgrade — phased rollout**

**Day 1 (v1):**
- Voice recording
- Voice → text transcription
- Basic AI summary (simple, lightweight)

**Later (v2):**
- Deep legal analysis from voice
- Image / document understanding

**Rationale:** Lawyers can capture client input naturally from Day 1 without paying full v1 development cost on advanced analysis. Phased reduces v1 risk while preserving the natural-intake advantage over Hamza's "fully deferred" plan.

**Action items:**
- Update Product-Vision Module 2/3 — split Voice into v1 (capture + transcribe + basic summary) vs v2 (deep analysis + image)
- Add to v1 scope: lightweight transcription model (Whisper or Gemini audio)
- Move Image understanding entirely to v2 module list

---

## Q2 — Law Students as Primary User

**Conflict:** C2 (My VISION = primary; Product-Vision = secondary v2)

**Decision: Option C — Primary user, discounted / free tier with student verification**

**Day 1 (v1):**
- Law students = primary user (alongside solo advocates)
- Dedicated Student tier — free or heavily discounted
- Student verification required (e.g., university email or HEC ID upload)

**Rationale:** Law students are early adopters with low resistance to AI tools. They build long-term loyalty (today's student = tomorrow's paying advocate). Free/discounted access removes pricing friction since students cannot afford Solo Pro tier.

**Action items:**
- Update Product-Vision Section 4 (Target Users) — promote Law Student from secondary v2 to primary v1
- Add Student tier to Section 9 (Monetization)
- Define student verification method (university email allowlist or HEC document upload)
- Decide Student tier limits (e.g., draft cap per month, watermarked exports, no commercial use)

---

## Q3 — Urdu Language Timing

**Conflict:** C4 (My VISION = bilingual by default; Product-Vision = D-001 open decision Day 1 vs v1.5)

**Decision: Option A — Full bilingual Day 1 (English + Urdu, both fully supported)**

**Day 1 (v1) — Both languages, full parity:**
- **Input:** English + Urdu + Roman Urdu (all three accepted; auto-detected)
- **Output:** Document generation in English OR Urdu (lawyer chooses per document)
- **UI:** Bilingual interface with language toggle (English ↔ Urdu)
- **Nastaliq rendering:** Jameel Noori or equivalent for professional Urdu output
- **Voice:** Transcription supports both English and Urdu speech
- **Templates:** Each master template available in both English and Urdu variants

**Rationale (court reality):**
| Court type | Dominant language |
|---|---|
| Supreme Court, High Courts | English |
| Big-city civil (Karachi/Lahore/Isl) | English |
| District/Sessions (smaller cities) | Urdu |
| Family courts | Urdu |
| Lower criminal courts | Urdu (mixed) |
| FIRs, bail apps, affidavits | Urdu preferred |

If Urdu is deferred, 50%+ of the addressable market (smaller cities + lower courts + family law) is lost. Pakistani lawyers expect bilingual at launch — anything less feels like a foreign tool.

**Action items:**
- Update Product-Vision Section 5 — Urdu marked as Day 1 confirmed (close decision D-001)
- Engineering scope: bilingual UI from start (i18n framework: next-intl or similar)
- Engineering scope: Nastaliq font (Jameel Noori) bundled
- Engineering scope: Roman Urdu input parser (transliteration → Urdu script)
- Add per-template language variants to template library design
- Update PROGRESS.md to mark D-001 as resolved

---

## Q4 — Module Count (3 vs 5)

**Conflict:** C3 (My VISION = 3 modules; Product-Vision = 5 modules)

**Decision: Option A — Adopt all 5 modules**

**Final module list:**
1. **Drafting Engine** — verified templates + AI content fill (lawyer-facing)
2. **AI Legal Advisor** — citation-safe chat guidance (lawyer-facing)
3. **Tax Calculator** — Stamp Duty, PLRA, FBR, Withholding, Capital Gains (lawyer-facing)
4. **Case Analyzer (Reverse Mode)** — decompose court judgments into facts, issues, arguments, citations, reasoning (lawyer-facing)
5. **Validation Mode (LEGAL-03)** — internal QA: AI draft vs actual filed document → accuracy scorecard (internal-only, not lawyer-facing)

**Rationale:**
- Case Analyzer saves lawyer significant research time and feeds Reverse → Forward learning loop
- Validation Mode is critical for proving accuracy before launch (>90% citations, <10% hallucination targets) — without it, no credible quality claim
- Both already aligned with existing skills (LEGAL-01, LEGAL-02, LEGAL-03)

**Action items:**
- Update my VISION.md to add Modules 4 and 5
- Confirm Validation Mode stays internal (no UI exposure to lawyers)
- Reverse Mode insights should feed back into template improvements

---

## Q5 — V1 Document Type Shortlist

**Decision: Complete coverage before launch — NOT a lean MVP**

**Position:** Market launch is not viable until the full Pakistani legal document landscape is covered. The lists in both VISION.md (Affidavits 7, Agreements 3, POA 2, Family Law 3, etc.) and Product-Vision.md (Bail App, Plaint, Written Statement, Affidavit, Bail Reply, Criminal Appeal, Misc App) were illustrative examples only — not the v1 launch scope.

**Launch criteria:**
- All major Pakistani legal document types templated and verified
- Target: 120–150 master templates (full library) BEFORE public launch
- Templates organized by real Pakistani legal practice (court-by-court, matter-by-matter)
- Each master template handles its sub-variants dynamically (one Affidavit master → property/identity/surety variants)

**Rationale:** Pakistani lawyers cannot adopt a tool that handles only 7 of their 50+ daily document types. They will hit "tool can't help me" walls within the first week and churn. Partial coverage = no adoption. Full coverage from Day 1 = real switching motivation.

**Strategic implications (acknowledge openly):**
- **Timeline:** Significantly longer pre-launch phase than typical MVP
- **Resource cost:** 120–150 templates × verification cycle = heavy legal review effort
- **Risk mitigation needed:** Run closed with a small advocate group during template build, not after
- **Conflict with PROGRESS.md Phase 5 ("Criminal defense first"):** Need to revise — no phased document rollout; full library at launch

**Action items:**
- Update Product-Vision Section 5 — replace v1 candidate list with "Full library (120–150 templates) at launch"
- Update Product-Vision Section 10 (Phased Roadmap) — Phase 5 "Criminal defense first" needs rethink
- Update PROGRESS.md milestone M-002 — testing must cover all template categories, not just first 5 cases
- Define template prioritization order for build sequence (which categories built first, even if all ship together)
- Plan template verification team capacity (Abdullah + how many other reviewers?)

---

## Q6 — Template Source & Verification Strategy

**Decision: Two-track sourcing — USB performas (fast track) + Court case pattern research (manual track)**

### Track 1 — USB Performa Library (Ready)
Abdullah holds a USB drive containing existing professional performas for:
- **All major Affidavit types**
- **Agreements** (multiple categories)
- **Power of Attorney** (multiple types)
- **Sale Deed**
- **Other transactional/notarial documents**

**Verification approach for Track 1:**
- These are already field-tested performas in legal practice — structurally proven
- Abdullah does primary digitization + light verification (checking for outdated clauses, law amendments)
- Lower verification effort = faster track to template library

### Track 2 — Court Case Documents (Research Required)
For court-filed documents (plaints, written statements, bail applications, appeals, criminal complaints, miscellaneous applications, etc.):
- **First attempt:** Search for existing pattern libraries / templates from senior advocates / law libraries
- **Fallback:** Abdullah manually constructs templates from similar real cases
- **Strategy insight:** Court cases follow repeating patterns — most cases of the same type are 80% similar with only fact-specific changes. So building one strong master template per court-doc type covers many real cases.

**Verification approach for Track 2:**
- Abdullah primary reviewer
- Cross-reference with multiple real filed documents (solved case corpus)
- Iterate based on first 5-10 solved-case validation tests (LEGAL-03 scoring)

### Reviewer Model
- **Abdullah** = primary legal reviewer for all templates (both tracks)
- **Future:** add specialized reviewers per domain (family law expert, criminal law expert) as scale demands

### Review Cadence
- **New template:** full review before adding to library
- **Existing templates:** quarterly check for law amendments / court rule changes
- **Triggered review:** any major legislation change (e.g., PECA amendment) → immediate review of affected templates

**Rationale:** USB performa library dramatically accelerates Track 1 — templates already exist, just need digitization + verification. Court case templates need more work but pattern-similarity makes the effort tractable. Combined approach makes "120-150 templates before launch" achievable in realistic timeline rather than years.

**Action items:**
- Inventory the USB drive — list every performa type → map to master template categories
- Identify Track 2 gaps — which court-document types need from-scratch construction
- Define a template digitization workflow: USB file → markdown/JSON template → sub-variant logic → verification checklist
- Update PROGRESS.md to reflect two-track sourcing strategy
- Resolve D-004 (template verification process) in Product-Vision.md

---

## Q7 — PKR Pricing Tiers

**Decision: DEFERRED — to be discussed later**

**Status:** Open. Pricing details (Solo Pro rate, Firm per-seat, Pay-per-draft, Student tier amount, Free trial limits) will be decided in a separate session.

**Constraints to remember when revisiting:**
- Pakistani lawyer income: PKR 80,000–600,000/month
- Cannot price near global tools ($100–500/month = PKR 28,000–140,000)
- Student tier needs to be near-free (verified law students)
- Firm tier should offset solo subsidy

**Action items:**
- Schedule dedicated pricing session before PRD phase
- Hamza-led research on Pakistani SaaS pricing benchmarks
- Keep D-003 in Product-Vision.md marked as open

---

## Q8 — Product Name & "TaqiAI" Competitor Question

**Decision: Product name DEFERRED — current "TaqiAI" is a placeholder**

**Status:**
- "TaqiAI" is a **random working name** used for current documentation only — not the final product name
- Final name will be decided later in a dedicated branding session
- The "external TaqiAI competitor" question (D-005) becomes lower priority — we will choose a fresh name regardless

**Implications:**
- All current docs (Product-Vision.md, PROGRESS.md, NEXT-STEPS.md, brainstorm.md) use "TaqiAI" as placeholder
- Once final name is chosen, repo path `PRODUCTS/taqiai/` and all docs will need rename
- Trademark / domain availability check required before final name lock

**Action items:**
- Schedule branding session — generate name candidates (e.g., AdaalatAI, AdvocateAI, LegalAI Pakistan, others)
- Trademark search for top candidates (Pakistan IPO + domain availability)
- Once chosen: rename folder, update all references across wiki + Product-Vision.md
- Mark D-005 in Product-Vision.md as "superseded — name being re-chosen"

---

## Q9 — Data Privacy & Client Confidentiality

**Decision (partial):** Per-user data isolation via authentication — each lawyer sees ONLY their own data

**Confirmed approach:**
- Standard login/authentication system (similar to e-registration portals)
- Each advocate has their own credentials
- Data isolation strictly per-user account
- A logged-in lawyer can only access cases, drafts, and client information they personally created
- No cross-user visibility — even within the same firm, data is account-scoped (firm-sharing features TBD)

**Rationale:** Mirrors the trust model lawyers already understand from existing e-government/registration portals. Simple, predictable, and meets baseline attorney-client privilege expectations.

### Deferred Sub-Decisions (need follow-up session)

The following 3 deeper privacy questions remain open and need explicit decisions before launch:

**Sub-Q9.1 — AI Training Use:** Will lawyer/client data ever be used to improve the AI model?
- Recommended default: **No training use of any case/client data**, ever. Templates and aggregated anonymous usage metrics only.

**Sub-Q9.2 — Storage Location:** Where does the data physically live?
- Options: Pakistan-local servers / Encrypted cloud (AWS/GCP, region TBD) / Client-side only (no cloud storage)
- Implication: Local hosting = PDPB-safer but costlier. Cloud = cheaper but needs compliance review.

**Sub-Q9.3 — Gemini API Concern:** Lawyer case data passing through Google's Gemini API.
- Risk: Even with enterprise terms, sensitive case data leaves Pakistani jurisdiction during inference.
- Options: (a) Accept with Gemini Enterprise data terms / (b) Move to self-hosted local LLM long-term / (c) Hybrid — public-legal-advice via Gemini, private case data via local model

**Sub-Q9.4 — Data Retention:**
- Per-document retention controls? Auto-delete schedules? Lawyer-controlled deletion?

**Action items:**
- Schedule a dedicated privacy/security session to resolve Sub-Q9.1 through Sub-Q9.4
- Engage a Pakistani lawyer with PDPB / data privacy expertise for compliance review
- Document the per-user isolation model in the technical architecture (PRD phase)
- Update D-006 in Product-Vision.md — partial decision recorded, deeper questions still open

---

## Q10 — Solved Case Files Corpus Strategy

**Decision: Abdullah collects real solved case files for LEGAL-03 testing**

**Approach:**
- Abdullah provides solved Pakistani case files (civil + criminal mix) from his own practice
- Files used exclusively for internal benchmarking via LEGAL-03 (Legal Comparator)
- Target volume: 50+ cases across all major document categories

**Action items:**
- Abdullah collects first 5 solved case files (civil + criminal) — target Week 1
- Define required metadata per case: court, date, case type, outcome, document type
- Establish secure storage for case files (separate from client-facing app data)

---

## SUMMARY OF DECISIONS

| Q# | Topic | Decision | Status |
|----|-------|----------|--------|
| Q1 | Voice + Image module | Phased: v1 = voice capture + transcription + basic summary; v2 = deep analysis + image | ✅ Decided |
| Q2 | Law students user | Primary user; discounted/free tier with verification | ✅ Decided |
| Q3 | Urdu language timing | Full bilingual Day 1 (input + output + UI + Nastaliq) | ✅ Decided |
| Q4 | Module count | 5 modules (Drafting, Advisor, Tax, Case Analyzer, Validation) | ✅ Decided |
| Q5 | V1 document scope | Full library (120–150 templates) before launch — no lean MVP | ✅ Decided |
| Q6 | Template sourcing | Two-track: USB performas (fast) + court case research (manual) | ✅ Decided |
| Q7 | PKR pricing tiers | Deferred to dedicated pricing session | ⏸ Deferred |
| Q8 | Product name | "TaqiAI" is placeholder; final name TBD in branding session | ⏸ Deferred |
| Q9 | Data privacy | Per-user login isolation confirmed; 4 deeper sub-questions deferred | 🟡 Partial |
| Q10 | Case files corpus | Abdullah collects solved cases for LEGAL-03 testing; target 50+ cases | 🟡 In Progress |

---

## NEXT STEPS

### Immediate (this week)
- [ ] Review this brainstorm with Hamza
- [ ] Apply decisions Q1–Q6 to Product-Vision.md (create v2.1 update)
- [ ] Update PROGRESS.md to close resolved decisions (D-001, D-002, D-004)
- [ ] Mark D-003, D-005, D-006 as still-open with revised context

### Short-term (next 2 weeks)
- [ ] Pricing session (Q7) — Hamza-led research + decision
- [ ] Branding session (Q8) — name candidates + trademark check
- [ ] Privacy/security session (Q9 follow-ups) — engage PDPB-aware lawyer
- [ ] Solved case files corpus plan confirmed (Q10)

### Before PRD Phase
- [ ] All deferred items resolved
- [ ] USB performa inventory complete (Q6 action)
- [ ] First solved case files collected (NS-011)
- [ ] V1 document scope finalized (full library plan committed)
- [ ] Final product name locked

---

**End of Q&A. Ready to feed into Product-Vision.md v2.1 update.**

