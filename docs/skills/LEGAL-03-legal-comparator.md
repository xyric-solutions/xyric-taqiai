---
id: LEGAL-03
name: Legal Comparator
category: legal-ai
version: 1.0
status: Active
module: Validation Mode (Internal)
lawyer_facing: false
owner: Abdullah
last_updated: 2026-04-21
---

# LEGAL-03 — Legal Comparator

> **Internal QA skill.** Compare an AI-generated draft (from LEGAL-02) against the actual filed document from a solved Pakistani case. Produce a quantitative accuracy scorecard. Never shown to end-user lawyers — used by TaqiAI team to prove accuracy before productization.

---

## When to Activate

Internal admin / QA workflow only. NOT accessible to Student / Solo Pro / Firm users.

Typical triggers:
- New template added to library → validate against 5+ solved cases
- Prompt change to LEGAL-02 → regression check against existing test corpus
- Monthly accuracy review — aggregate scores per template
- Before moving template from `Draft` → `Verified` status

---

## Inputs

| Input | Required | Notes |
|-------|----------|-------|
| AI-generated draft (from LEGAL-02) | Yes | HTML/text |
| Actual filed document (from solved case) | Yes | PDF/DOCX/text (from solved-case corpus) |
| Case metadata | Yes | Court, date, case type, outcome |
| Template ID used by LEGAL-02 | Yes | For per-template tracking |

---

## Process / Method

1. **Normalize both documents** — strip whitespace, headers, page numbers
2. **Extract structural sections** from each — headings, clauses, prayer, verification
3. **Match sections** — AI's "Grounds" section vs actual's "Grounds" section
4. **Diff citations** — list of cites in AI draft vs list in actual
5. **Diff arguments** — enumerate arguments in each; compute coverage and overlap
6. **Detect hallucinations** — AI citations not present in actual AND not in verified knowledge base → flagged
7. **Score** — calculate 4 metrics (below) + produce annotated diff for human review

---

## Outputs

JSON scorecard + human-readable report:

```json
{
  "caseId": "CASE-001",
  "templateId": "bail-application",
  "timestamp": "2026-04-21T10:30:00Z",
  "metrics": {
    "citationAccuracy": 0.92,
    "argumentCompleteness": 0.85,
    "structuralCompliance": 1.00,
    "hallucinationRate": 0.04,
    "lawyerEditSimulatedRatio": 0.18
  },
  "details": {
    "citationsInAI": ["PPC §302", "CrPC §497", "Muhammad Tanveer v State"],
    "citationsInActual": ["PPC §302", "CrPC §497", "Muhammad Tanveer v State", "State v X (2020 PCrLJ 100)"],
    "missing": ["State v X (2020 PCrLJ 100)"],
    "fabricated": [],
    "argumentsInAI": ["No direct witness", "Ill-health ground", "Long detention"],
    "argumentsInActual": ["No direct witness", "Ill-health ground", "Long detention", "Alibi evidence"],
    "missedArguments": ["Alibi evidence"],
    "flags": []
  },
  "verdict": "ACCEPTABLE — meets thresholds; review missed argument"
}
```

Human-readable report has:
- Side-by-side rendering of AI vs actual
- Highlighted diffs (green = match, yellow = paraphrase, red = missing, purple = fabricated)
- Per-section score breakdown
- Recommended iteration (prompt tweak, template improvement, or no action)

---

## Quality Criteria (for LEGAL-03 itself)

| Criterion | Threshold |
|-----------|-----------|
| False positive (flags real match as fabricated) | < 5% |
| False negative (misses real fabrication) | < 2% |
| Determinism (same inputs → same score) | > 99% |
| Runtime per case | < 60 seconds |

---

## Hard Red Line Checks (additional automatic validators)

Beyond the 4 quantitative metrics above, LEGAL-03 runs automated checks against the 10 hard red lines declared in [LEGAL-02](./LEGAL-02-legal-drafter.md#hard-red-lines-zero-tolerance--malpractice-level-mistakes):

| # | Red Line | LEGAL-03 check |
|---|----------|---------------|
| 1 | Wrong statute/section | Cross-reference every cited section against verified knowledge base |
| 2 | Wrong jurisdiction | Match provincial law source against forum/property province |
| 3 | Limitation missed | Calculate limitation from cause-of-action date vs filing date |
| 4 | Unenforceable prayer | Match prayer against valid relief categories per document type |
| 5 | Gender/pronoun mismatch (Urdu) | Check deponent/plaintiff gender against all inflected Urdu pronouns in body |
| 6 | Amount / date typo | Numeric vs word form consistency; date ISO vs written form consistency |
| 7 | Heir omission (succession cert) | Checklist confirmation present + expected count per personal-law heirship |
| 8 | Counter-claim in WS | Flag any counter-claim phrasing inside a WS template |
| 9 | Witness count wrong | Enforce per-doc-type witness requirement (0/2/etc.) |
| 10 | §80 CPC notice skipped (vs government) | If respondent is government/officer: require notice reference |

Any red-line failure → draft is REJECTED (not a score deduction — binary reject). The skill generating the draft (LEGAL-02) must regenerate before the output can ever reach the lawyer.

---

## Accuracy Thresholds Enforced

LEGAL-02's output is considered acceptable if ALL of the following hold on a given case:

| Metric | Pass threshold |
|--------|----------------|
| Citation accuracy | ≥ 90% |
| Argument completeness | ≥ 80% |
| Structural compliance | 100% |
| Hallucination rate | ≤ 10% |
| Lawyer edit ratio | ≤ 20% |

If ANY metric fails → template/prompt needs iteration; document does NOT advance to production.

---

## Pakistani Legal Context

### Citation matching nuances
- `PPC §302` and `Section 302 Pakistan Penal Code` are the same → match
- `Muhammad Tanveer v State (2017 SCMR 1332)` and `Muhammad Tanveer v. State, 2017 SCMR 1332` are the same → match (punctuation tolerant)
- `State v X (2020 PCrLJ 100)` and `State v. Y (2020 PCrLJ 100)` are DIFFERENT → no match (party name matters)

### Argument matching nuances
- Paraphrases of same ground → match (e.g., "no direct witness" ≈ "absence of eyewitness")
- Structurally different arguments → separate (e.g., "alibi" and "ill-health" are different)
- Use embedding-based similarity with threshold 0.75 to bucket paraphrases, but flag anything 0.75–0.85 for human review

### Structural compliance
- Missing "Verification" section in affidavit → 0% structural (not partial credit)
- Missing "Prayer" in plaint → 0% structural
- Missing optional sections (e.g., "Preliminary Objections" when actual had none) → no penalty

---

## Example

**Input:**
- AI draft: generated bail application for accused Ali Ahmed, FIR 55/2023
- Actual filed: the real bail application filed by Ali's lawyer that was granted in Lahore High Court

**Output (summary):**
```
Citation accuracy: 92% (missing: 1 precedent)
Argument completeness: 85% (missed: alibi evidence argument)
Structural compliance: 100%
Hallucination rate: 4% (1 borderline citation flagged)
Verdict: ACCEPTABLE

Action: Prompt tweak recommended to encourage broader argument surfacing; template OK.
```

---

## Anti-patterns (what this skill must NEVER do)

- ❌ Show scores to end-users (this is internal QA only)
- ❌ Use US / UK citation-matching rules (Pakistani format is specific)
- ❌ Mark paraphrased arguments as "missing" — they're matches
- ❌ Give partial credit for missing mandatory sections
- ❌ Aggregate scores across templates (score per-case, per-template)
- ❌ Be optimistic — default bias toward flagging (false positive ≤ 5% is acceptable cost)

---

## Validation

LEGAL-03 itself is calibrated against a small set of known-good AI/actual pairs (golden set) where the correct score is manually determined by Abdullah. Any change to LEGAL-03 must pass the golden set before being deployed.
