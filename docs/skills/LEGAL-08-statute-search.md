---
id: LEGAL-08
name: Statute & Citation Search
category: legal-ai
version: 1.0
status: Active
module: Statute Search
lawyer_facing: true
owner: Abdullah
last_updated: 2026-06-02
---

# LEGAL-08 — Statute & Citation Search

> **Lookup skill.** Given a section number or a plain-language query against a chosen Pakistani statute (PPC, CrPC, CPC, QSO, etc.), return the relevant provision with a citation-safe explanation. Never invent a section that does not exist.

Implemented by: the Statute Search page (`/statute-search`) querying `POST /api/ai/judgment` against a fixed statute set (`STATUTES`).

---

## When to Activate

| Trigger | Example |
|---------|---------|
| Direct section lookup | "PPC 302" / "Section 497 CrPC" |
| Concept → section | "Which section covers cheque dishonor?" |
| Plain-language query within a chosen statute | "punishment for criminal breach of trust" |
| Cross-reference | "related sections to 420 PPC" |

Do NOT activate when:
- The user wants case law / judgments → LEGAL-06
- The user wants procedural strategy / advice → LEGAL-04
- The user wants a document drafted → LEGAL-02

---

## Inputs

| Input | Required | Notes |
|-------|----------|-------|
| Query (section no. or concept) | Yes | Free text |
| Active statute code | Yes | One of the supported codes (PPC, CrPC, CPC, QSO, …) |

---

## Process / Method

1. Scope the search to the **selected statute only** — do not bleed across codes unless asked.
2. Resolve the query to a specific section (or the closest matching sections).
3. Return the **section number, official heading, and provision text** as it exists in Pakistani law.
4. Add a short plain-language explanation of what the section means in practice.
5. List directly related sections (e.g., 497/498 CrPC for bail).
6. If the section/concept cannot be matched confidently, say so and flag `[CITATION_REQUIRED]` — do not fabricate.

---

## Outputs

- Section number + heading
- Provision text (verified)
- Plain-language explanation (1–3 sentences)
- Related sections (optional)
- Confidence / verification flag where uncertain

---

## Quality Criteria

| Criterion | Threshold |
|-----------|-----------|
| Section-number accuracy | > 95% |
| No invented sections | 100% |
| Jurisdictional accuracy (Pakistan only) | 100% |
| Explanation relevance | > 90% |
| Response time (P95) | < 8 seconds |

---

## Pakistani Legal Context

### Supported statutes (must know section ranges)
- **PPC (1860)** — §§1–511 (offenses & punishments)
- **CrPC (1898)** — §§1–565 + Schedules (criminal procedure)
- **CPC (1908)** — §§1–158 + Orders I–LI (civil procedure)
- **Qanun-e-Shahadat Order 1984** — evidence (replaced the Evidence Act in Pakistan)
- **Contract Act 1872**, **Specific Relief Act 1877**
- **Family Court Act 1964**, **Muslim Family Laws Ordinance 1961**
- **PECA 2016** (cyber), **ATA 1997** (terrorism), **CNS Act 1997** (narcotics)

### Frequently searched sections (answer correctly)
- PPC §302 (qatl-e-amd / murder), §324 (attempt to murder), §420 (cheating), §489-F (cheque dishonor), §354 (assault on woman)
- CrPC §154 (FIR), §497 (post-arrest bail), §498 (pre-arrest bail), §345 (compounding)
- CPC §80 (notice to govt), Order VII (plaint), Order XXXIX (injunction)

> **Provincial variation:** for revenue/tenancy/rent matters, sections differ by province — specify the province or flag the ambiguity.

---

## Example

**User:** `489-F` (statute = PPC)

**LEGAL-08 response:**
> **PPC §489-F — Dishonestly issuing a cheque.**
> "Whoever dishonestly issues a cheque towards repayment of a loan or fulfilment of an obligation which is dishonoured … shall be punishable with imprisonment which may extend to three years, or with fine, or with both."
>
> **In practice:** Commonly invoked when a cheque bounces. Non-bailable but bail is frequently granted; intent ("dishonestly") must be shown.
> **Related:** PPC §420 (cheating); Negotiable Instruments Act provisions on cheques.

---

## Anti-patterns (what this skill must NEVER do)

- ❌ Invent a section number or quote text that does not exist
- ❌ Mix in Indian section numbering or foreign statutes
- ❌ Give case-law citations here (defer to LEGAL-06)
- ❌ Provide definitive case strategy (defer to LEGAL-04)
- ❌ Answer confidently when the match is weak — flag instead

---

## Validation

- Golden set of section lookups (number → text) curated by Abdullah; 95%+ exact-match required.
- Periodic audit against the official bare-acts to catch drift.
- Any hallucinated section reported by a user → immediate prompt/KB fix.
