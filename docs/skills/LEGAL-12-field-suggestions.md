---
id: LEGAL-12
name: Drafting Field Suggestions
category: legal-ai
version: 1.0
status: Active
module: Dynamic Form (Drafting Engine)
lawyer_facing: true
owner: Abdullah
last_updated: 2026-06-02
---

# LEGAL-12 — Drafting Field Suggestions

> **Assist skill.** While a lawyer fills a dynamic drafting form, suggest realistic, Pakistan-appropriate values for the field being completed — to speed data entry, not to fabricate binding facts. Suggestions are hints; the lawyer always confirms.

Implemented by: `POST /api/ai/suggest` → `getFieldSuggestions(fieldName, documentType, context)`.

---

## When to Activate

| Trigger | Example |
|---------|---------|
| User focuses a form field | Field "Relief Sought" on a stay application |
| Field needs common-value hints | "Court Name", "Cause of Action", "Property Description" |
| Repetitive/boilerplate fields | "Grounds", "Prayer", standard clauses |

Do NOT activate for:
- Identity fields where a real value is mandatory and must not be guessed (CNIC, exact names, account numbers) → suggest **format/placeholder only**
- Full document generation → LEGAL-02

---

## Inputs

| Input | Required | Notes |
|-------|----------|-------|
| `fieldName` | Yes | The field being filled |
| `documentType` | Yes | e.g. affidavit, rent-agreement, bail-application |
| `context` | No | Other already-entered field values for coherence |

---

## Process / Method

1. Interpret the field in the context of the **document type** and any sibling values already entered.
2. Generate a small set (typically 3–6) of **plausible, jurisdiction-correct** suggestions.
3. Keep suggestions consistent with prior context (e.g., if the court is a Sessions Court, don't suggest High Court reliefs).
4. For sensitive identity/number fields, return **format templates or placeholders**, never invented real-looking values.
5. Phrase legal-content suggestions (grounds, prayer, clauses) in correct formal register, ready to edit.

---

## Outputs

- A short list of suggestion strings appropriate to the field
- For identity/number fields: format hints (e.g., `35202-XXXXXXX-X`) rather than fabricated data
- Suggestions are editable defaults, never auto-committed

---

## Quality Criteria

| Criterion | Threshold |
|-----------|-----------|
| Contextual relevance to field + doc type | > 90% |
| Jurisdictional correctness (Pakistan) | 100% |
| No fabricated identity/financial values | 100% |
| Consistency with already-entered context | > 90% |
| Response time (P95) | < 6 seconds |

---

## Pakistani Legal Context

- **Court hierarchy** — Civil Judge, Senior Civil Judge, Additional District Judge, District Judge, Sessions Court, High Court, Supreme Court; suggest the right forum for the document.
- **Common reliefs/prayers** — permanent/temporary injunction, specific performance, recovery, stay, bail; phrase per Pakistani practice.
- **Standard grounds** — "balance of convenience", "prima facie case", "irreparable loss" (the injunction trinity); "further inquiry" (bail).
- **Property descriptions** — Khasra/Khewat/Khatooni, kanal/marla, boundaries (north/south/east/west) — suggest the *structure* to fill, not invented numbers.
- **Tier awareness** — for student users, suggestions may include a brief "why this field matters" hint; for lawyers, keep it terse (see LEGAL-04 tier rules).

---

## Example

**Field:** `Relief Sought` · **documentType:** `stay-application` · **context:** civil suit, Senior Civil Judge

**LEGAL-12 suggestions:**
> - "Grant of temporary injunction restraining the respondents from alienating or creating any third-party interest in the suit property till final disposal."
> - "Restraining the respondents from dispossessing the applicant from the suit property."
> - "Status quo regarding possession and construction over the suit property."

---

## Anti-patterns (what this skill must NEVER do)

- ❌ Fabricate a real-looking CNIC, account number, or specific person's name
- ❌ Suggest a forum/relief that doesn't fit the document type
- ❌ Apply foreign-law concepts
- ❌ Auto-fill without lawyer confirmation
- ❌ Produce verbose paragraphs where a short value is expected
- ❌ Contradict values the user has already entered

---

## Validation

- Relevance review of suggestions per (field, documentType) by Abdullah.
- Hard check: identity/number fields never return fabricated values.
- Coherence test: suggestions respect provided context fields.
