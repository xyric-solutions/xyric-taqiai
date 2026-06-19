---
type: skills-index
title: "TaqiAI - Legal AI Skills Catalog"
status: Active
owner: Abdullah
last_updated: 2026-06-19
product: taqiai
kb_summary: "Catalog of Claude skills that power TaqiAI modules. Each skill has defined inputs, outputs, accuracy targets, and Pakistani legal context."
---

# TaqiAI — Legal AI Skills Catalog

**Purpose:** This folder defines the AI skills that power TaqiAI's seven product modules. Each skill is a structured capability definition — what it does, when it activates, how it's evaluated, and what Pakistani legal context it must respect.

These skills are authored by Abdullah (practicing Pakistani lawyer + legal drafter) as the domain expert. AI output that violates any skill's rules or quality criteria must be rejected and regenerated — **never shipped to a lawyer as-is**.

---

## Skill Catalog

| ID | Name | Module | Lawyer-facing? | Status |
|----|------|--------|----------------|--------|
| [LEGAL-01](./LEGAL-01-case-analyzer.md) | **Case Analyzer** | Case Analyzer (Reverse Mode) | Yes | Active |
| [LEGAL-02](./LEGAL-02-legal-drafter.md) | **Legal Drafter** | Drafting Engine | Yes | Active |
| [LEGAL-03](./LEGAL-03-legal-comparator.md) | **Legal Comparator** | Validation Mode | No (internal QA) | Active |
| [LEGAL-04](./LEGAL-04-legal-advisor.md) | **Legal Advisor** | AI Legal Advisor | Yes | Active |
| [LEGAL-05](./LEGAL-05-tax-calculator.md) | **Tax Calculator** | Tax Calculator | Yes | Active |
| [LEGAL-06](./LEGAL-06-judgment-intelligence.md) | **Judgment Intelligence** | Judgment Intelligence Library | Yes | Active |
| [LEGAL-07](./LEGAL-07-voice-intake.md) | **Voice Intake & Transcription** | Voice Intake | Yes | Active |
| [LEGAL-08](./LEGAL-08-statute-search.md) | **Statute & Citation Search** | Statute Search | Yes | Active |
| [LEGAL-09](./LEGAL-09-legal-translator.md) | **Legal Document Translator** | Translation Services | Yes | Active |
| [LEGAL-10](./LEGAL-10-document-ocr.md) | **Document Intake & OCR Extraction** | Document Intake | Yes | Active |
| [LEGAL-11](./LEGAL-11-draft-editor.md) | **AI Draft Editor** | Document Editing | Yes | Active |
| [LEGAL-12](./LEGAL-12-field-suggestions.md) | **Drafting Field Suggestions** | Dynamic Form | Yes | Active |

> **LEGAL-07 → LEGAL-12 added 2026-06-02** — these document AI capabilities already built and live in the `ai-legal-system` app (voice transcription, statute search, translation, OCR/document intake, in-place draft editing, form field suggestions). LEGAL-06 promoted to **Active**.

---

## Skill-to-Module Mapping

| PRD Module | Powered By |
|------------|-----------|
| Module 1 — Drafting Engine | LEGAL-02 |
| Module 2 — AI Legal Advisor | LEGAL-04 |
| Module 3 — Tax Calculator | LEGAL-05 |
| Module 4 — Case Analyzer (Reverse Mode) | LEGAL-01 |
| Module 5 — Validation Mode (Internal QA) | LEGAL-03 |
| Module 6 — Judgment Intelligence Library | LEGAL-06 |
| Module 7 — Chamber Management | No AI skill — CRUD + calendar logic (no LLM reasoning required) |
| Voice Intake (Advisor / Smart Draft) | LEGAL-07 |
| Statute Search | LEGAL-08 |
| Translation Services (EPIC-07) | LEGAL-09 |
| Document Intake & OCR | LEGAL-10 |
| Document Editing (revise drafts) | LEGAL-11 |
| Dynamic Form field assist | LEGAL-12 |

> **CRUD / no-AI modules** (no skill required): Authentication, My Documents storage, Court Cases, Lawyer Diary, Chamber matters/hearings — these are storage + calendar logic, no LLM reasoning.

---

## Shared Principles Across All Skills

1. **Pakistan-first jurisdiction only.** PPC, CrPC, CPC, Qanun-e-Shahadat, Contract Act 1872, Family Court Act, PECA 2016, ATA, CNS Act. Skills must refuse to apply foreign law.
2. **Citation safety is non-negotiable.** Skill must never invent a case name, section number, or judgment. Uncertain → flag `[CITATION_REQUIRED]` for lawyer.
3. **Lawyer-in-the-loop.** Skills produce drafts, never final documents. Lawyer review gate is mandatory.
4. **Bilingual by default.** Input/output supports English, Urdu, and Roman Urdu (transliterated).
5. **Both sides of the bar.** Skills must handle plaintiff/prosecution AND defendant/defense perspectives equally — no bias.
6. **Verified structure, controlled content.** For drafting skills, the structural template is sacred; AI only fills facts, not structure.
7. **Accuracy over speed.** Better to flag uncertainty than to deliver a confident wrong answer.
8. **Skill documentation language is English.** All skill files are written in English so global engineers can implement them. Domain terminology (Urdu legal terms like Khewat, Khatooni, Muhaida Bae) is preserved in Urdu script where exact representation matters. The AI *output* to end-users is bilingual per user choice, but the *skill definitions themselves* stay English.

---

## Activation Rules (when to use which skill)

| User intent | Skill to activate |
|-------------|-------------------|
| "Draft me a bail application / plaint / affidavit / agreement..." | LEGAL-02 |
| "Analyze this judgment" / "What are the key issues in this case?" | LEGAL-01 |
| "What section of PPC applies?" / "Is my case bailable?" / "Guide me on procedure" | LEGAL-04 |
| "Calculate stamp duty / PLRA / CGT on this property" | LEGAL-05 |
| Internal: "Score this AI draft against a real filed document" | LEGAL-03 |
| "Find judgment 2023 SCMR 1450" / "Search PPC 302 cases" / "Summarize this judgment" / "Prepare case strategy from these judgments" | LEGAL-06 |
| "Add a case to my chamber" / "What do I have today?" / "Add hearing date" | No skill — Chamber Management UI (EPIC-06) |
| User records audio / taps the mic | LEGAL-07 (transcribe first, then route) |
| "What does PPC 420 say?" / "Section 497 CrPC" / statute lookup | LEGAL-08 |
| "Translate this document / photo" / "Translate this Nikah Nama" | LEGAL-09 |
| Uploads a photo/scan to digitize ("type this") | LEGAL-10 (then route to translate/draft) |
| "Change X in this draft" / "add/remove a clause" (editing an existing draft) | LEGAL-11 |
| Form field hint while drafting (autocomplete a field) | LEGAL-12 |

If user intent is ambiguous, LEGAL-04 (Legal Advisor) is the default fallback — it can refer to other skills.

---

## Quality Targets (per skill, aligned with PRD Section 21)

| Metric | Target |
|--------|--------|
| Citation accuracy | > 90% |
| Argument completeness | > 80% |
| Structural compliance | 100% |
| Hallucination rate | < 10% |
| Lawyer edit ratio | < 20% |

These are measured via LEGAL-03 (Legal Comparator) against solved Pakistani cases.

---

## Next Skills to Build (backlog)

> The original backlog items LEGAL-07 (Voice Intake), LEGAL-08 (Citation Verifier → Statute Search), and LEGAL-09 (Urdu Translator) are now **built and Active** (see catalog above). Remaining backlog items are renumbered:

- **LEGAL-13 — Precedent Finder:** deep cross-judgment precedent analysis and ranking
- **LEGAL-14 — Template Curator:** manage and version the master template library
- **LEGAL-15 — Citation Verifier (real-time):** live PPC/CrPC/CPC section verification against the knowledge base as text is drafted (complements LEGAL-08 lookup)

> **Note:** LEGAL-06 (Judgment Intelligence) has been promoted from backlog to Active — see [LEGAL-06-judgment-intelligence.md](./LEGAL-06-judgment-intelligence.md)
