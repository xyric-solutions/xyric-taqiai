---
id: LEGAL-11
name: AI Draft Editor
category: legal-ai
version: 1.0
status: Active
module: Document Editing (Drafting Engine)
lawyer_facing: true
owner: Abdullah
last_updated: 2026-06-02
---

# LEGAL-11 — AI Draft Editor

> **Surgical-edit skill.** Given an existing legal document and a plain-language instruction, apply *only* the requested change and return the full updated document — structure, formatting, and every untouched part preserved exactly. The companion to LEGAL-02 (which creates drafts); this one revises them.

Implemented by: `POST /api/ai/edit-document` (HTML in → edited HTML out). Also backs `POST /api/ai/translate-edit` for refining translated output.

---

## When to Activate

| Trigger | Example |
|---------|---------|
| User edits a generated draft conversationally | "Change the rent to Rs. 50,000 and add a 1-year lock-in" |
| Targeted fix | "Fix the respondent's name to Tariq Mehmood" |
| Add/remove a clause | "Add an arbitration clause" / "Remove paragraph 4" |
| Tone/wording tweak | "Make the prayer paragraph stronger" |

Do NOT activate when:
- The user wants a brand-new document → LEGAL-02
- The user wants legal advice about the change → LEGAL-04
- The change is a re-translation → LEGAL-09

---

## Inputs

| Input | Required | Notes |
|-------|----------|-------|
| Current document content (HTML) | Yes | The existing draft |
| Edit instruction (natural language) | Yes | English, Urdu, or Roman Urdu |
| Language (`en` / `ur`) | No | Output language register |

---

## Process / Method

1. Parse the instruction to identify the **minimal** target region(s) of the document.
2. Apply only those changes:
   - **Add** → insert in the correct, legally appropriate place.
   - **Remove** → delete cleanly without orphaning references or numbering.
   - **Change wording** → replace only the targeted span.
3. **Preserve everything else byte-for-intent** — untouched clauses, party blocks, and formatting stay identical.
4. **Keep HTML structure intact** — valid tags, no markdown, no code fences, no commentary.
5. **Never alter proper nouns, CNIC numbers, dates, or amounts** unless the instruction explicitly targets them.
6. Maintain formal legal register and internal consistency (if a defined term changes, update its references).
7. Return the **complete** updated document (not a diff/snippet).

---

## Outputs

- The full updated document as clean HTML
- Only the requested change applied; all else unchanged
- No explanatory text before/after the document

---

## Quality Criteria

| Criterion | Threshold |
|-----------|-----------|
| Unrequested content left unchanged | 100% |
| Requested change correctly applied | > 95% |
| HTML/structure validity preserved | 100% |
| Proper-noun / number safety (no accidental edits) | 100% |
| Clause numbering & cross-refs stay consistent | > 95% |
| Response time (P95) | < 12 seconds |

---

## Pakistani Legal Context

- **Structure is sacred.** Pakistani pleadings/deeds follow fixed skeletons (cause-title, parties, facts, grounds, prayer, verification). Edits must respect that skeleton.
- **Defined-term discipline.** "the Lessee", "the Vendor", "the Petitioner" must stay consistent throughout after an edit.
- **Numbers carry legal weight.** Stamp value, consideration amount, dates of cause of action, limitation — never silently change.
- **Bilingual edits.** An instruction in Roman Urdu may target an English document; apply faithfully without switching the document's language unless asked.

---

## Example

**Current doc:** a rent agreement with "Monthly Rent: Rs. 40,000".
**Instruction:** `rent ko 50,000 kardo aur ek saal ka lock-in add karo`

**LEGAL-11 output:** the same agreement, with the rent line now "Rs. 50,000" and a new lock-in clause inserted in the covenants section — **everything else identical**, returned as full HTML.

---

## Anti-patterns (what this skill must NEVER do)

- ❌ Rewrite or "improve" parts the user did not ask about
- ❌ Drop or reformat untouched clauses
- ❌ Change names/CNIC/dates/amounts that weren't targeted
- ❌ Return a snippet/diff instead of the full document
- ❌ Emit markdown, code fences, or commentary around the HTML
- ❌ Switch the document's language unprompted
- ❌ Break clause numbering or leave dangling cross-references

---

## Validation

- Edit-fidelity test set: (document, instruction) → expected output; score that ONLY the intended span changed (diff-based).
- Regression check: proper nouns/numbers identical pre/post unless targeted.
- HTML validity check on every output.
