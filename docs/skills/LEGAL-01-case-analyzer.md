---
id: LEGAL-01
name: Case Analyzer
category: legal-ai
version: 1.0
status: Active
module: Case Analyzer (Reverse Mode)
lawyer_facing: true
owner: Abdullah
last_updated: 2026-04-21
---

# LEGAL-01 — Case Analyzer

> **Reverse Mode:** Take a Pakistani court judgment or case file and decompose it into structured analytical components so a lawyer can quickly understand facts, legal issues, arguments, citations, reasoning, and outcome.

---

## When to Activate

User provides:
- A court judgment (PDF, DOCX, scanned image, plain text)
- An FIR or charge sheet
- A complete case file (pleadings + judgment together)

Typical user prompts:
- "Analyze this judgment"
- "What did the court decide on this?"
- "What arguments did the plaintiff win on?"
- "Break down this case"
- "Extract the structure of this document"

Do NOT activate when user is asking for a draft from facts — that's LEGAL-02.

---

## Inputs

| Input | Required | Notes |
|-------|----------|-------|
| Source document (text or extracted from file) | Yes | Judgment, FIR, or case file |
| User-stated perspective | No | "I'm representing defendant" etc. — helps highlight relevant arguments |
| Language hint | No | Auto-detect English/Urdu; if mixed, honor both |

---

## Process / Method

1. **Identify document type** — judgment / FIR / charge sheet / pleadings bundle
2. **Extract facts** — parties, dates, acts, location, amounts
3. **Identify legal issues** — what questions the court answered
4. **Separate arguments** — plaintiff/prosecution side vs defendant/defense side (NEVER merge them)
5. **Extract citations** — every section, case name, and precedent cited
6. **Reconstruct court's reasoning** — in order, as logical chain
7. **State final ruling** — decision + relief granted
8. **Flag uncertainty** — any ambiguous passage marked `[UNCLEAR — lawyer review]`

---

## Outputs

Structured markdown report with these sections:

```
## Case Identification
- Case No. / Title / Forum / Date

## Parties
- Plaintiff/Petitioner/Complainant: ...
- Defendant/Respondent/Accused: ...

## Facts (Factual Matrix)
- [Chronological fact list]

## Legal Issues
1. ...
2. ...

## Arguments
### Plaintiff / Prosecution
- ...
### Defendant / Defense
- ...

## Laws & Citations Referenced
- PPC §302 — murder
- CrPC §497 — bail
- [Case Name, Citation] — purpose

## Court's Reasoning
1. ...
2. ...

## Ruling / Relief
- ...

## Abdullah's Notes (flags)
- [UNCLEAR] ...
```

---

## Quality Criteria

| Criterion | Threshold |
|-----------|-----------|
| Facts extracted accurately | 100% — no invented facts |
| Citations match source | 100% — no fabricated section numbers or case names |
| Plaintiff/defendant arguments kept separate | 100% — never blended |
| Key issues captured | > 90% |
| Reasoning chain preserved in order | > 90% |
| Hallucination (invented rulings, fake dates) | 0% |

If citation accuracy drops below 100% in testing, the skill is broken — do not ship.

---

## Pakistani Legal Context

- **Court hierarchy:** recognize Supreme Court → High Courts (Lahore, Sindh, Peshawar, Balochistan, Islamabad) → Sessions/District → Magistrate courts
- **Common statute abbreviations:** PPC, CrPC, CPC, QSO (Qanun-e-Shahadat), MFLO (Muslim Family Laws Ordinance), PECA, ATA, CNS Act
- **Bail terminology:** pre-arrest bail / after-arrest bail / cancellation of bail — do not conflate
- **Ruling language:** "allowed", "dismissed", "set aside", "remanded", "stayed" — preserve exact court language
- **Dates:** Pakistani date formats (DD-MM-YYYY common). Handle both Gregorian and rare Hijri references.
- **Bilingual:** some High Court judgments cite Urdu passages verbatim — preserve, do not auto-translate

---

## Example

**Input (excerpt):**
> "In Crl. Misc. No. 12345/2023, the Lahore High Court granted post-arrest bail to accused X under Section 497 CrPC. The court held that prosecution failed to establish prima facie connection and relied on Muhammad Tanveer v State (2017 SCMR 1332)..."

**Expected LEGAL-01 output (snippet):**
```
## Ruling / Relief
- Post-arrest bail GRANTED to accused X under CrPC §497

## Court's Reasoning
1. Prosecution failed to establish prima facie connection of accused with offence
2. Court relied on Muhammad Tanveer v State (2017 SCMR 1332) for evidentiary threshold

## Laws & Citations Referenced
- CrPC §497 — bail
- Muhammad Tanveer v State (2017 SCMR 1332) — evidentiary threshold for bail
```

---

## Anti-patterns (what this skill must NEVER do)

- ❌ Summarize "in my opinion" — skill is analytical, not advisory
- ❌ Invent a citation that's not in the source
- ❌ Combine plaintiff + defendant arguments into one list
- ❌ Translate Urdu passages if the court wrote them in Urdu (preserve original)
- ❌ Apply non-Pakistani law (Indian, US, UK precedents) unless the source document itself cites them
- ❌ Skip the "Abdullah's Notes (flags)" section even if nothing seems unclear — always include (may be empty list)

---

## Validation

Tested against: solved Pakistani cases (initial target: 50+).
Scoring skill: LEGAL-03 (Legal Comparator).
Current accuracy: TBD — baseline to be established in Phase 1.
