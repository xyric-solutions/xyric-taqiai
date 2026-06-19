---
id: LEGAL-09
name: Legal Document Translator
category: legal-ai
version: 1.0
status: Active
module: Translation Services (EPIC-07)
lawyer_facing: true
owner: Abdullah
last_updated: 2026-06-02
---

# LEGAL-09 — Legal Document Translator

> **Translation skill.** Translate Pakistani legal text or document images between Urdu, English, and Arabic — preserving legal meaning, structure, and every proper noun/number exactly. Supports free translation and structured **template-based** translation (Fard, Nikah Nama, ID Card, deeds, certificates).

Implemented by: `POST /api/ai/translate` (text or image), `POST /api/ai/translate-template` (template-bound, e.g. fard, id-card, nikah-nama, sale-deed), `POST /api/ai/translate-edit` (refine a translated result).

---

## When to Activate

| Trigger | Example |
|---------|---------|
| Free text/image translation | Translate an Urdu FIR into English |
| Photographed document | Upload a photo of a Fard → English translation |
| Known document type | "Translate this Nikah Nama" → uses the matching template |
| Refine an existing translation | "Make the address line match the original spelling" |

Do NOT activate when:
- The user wants the audio transcribed first → LEGAL-07, then this skill
- The user wants legal advice on the document → LEGAL-04
- The user wants a new document drafted → LEGAL-02

---

## Inputs

| Input | Required | Notes |
|-------|----------|-------|
| Source language (`ur` / `en` / `ar`) | Yes (free mode) | |
| Target language (`ur` / `en` / `ar`) | Yes (free mode) | |
| Text **or** image (≤10MB; JPG/PNG/WebP/GIF) | Yes | Image is OCR'd then translated |
| Template ID | Yes (template mode) | e.g. `fard`, `id-card`, `nikah-nama`, `sale-deed`, `gift-deed`, `mortgage-deed`, `birth-certificate`, `divorce-certificate` |
| Prior translation + edit instruction | Yes (edit mode) | For `translate-edit` |

---

## Process / Method

1. **If image:** OCR the document first (line by line), then translate the extracted text — see LEGAL-10 for the strict OCR rules.
2. **Translate meaning, not words** — render the legal sense correctly in the target language, not a literal gloss.
3. **Preserve exactly, never translate:** names, CNIC numbers, dates, amounts, Khewat/Khatooni numbers, survey/Khasra numbers, registration numbers.
4. **Template mode:** extract the source into the template's structured fields (JSON), then emit a clean bilingual/target-language document in the template's fixed layout.
5. **Keep domain terms consistent** — use the approved rendering for recurring legal terms (glossary-backed), not a fresh guess each time.
6. **Preserve structure** — headings, clause numbering, party blocks, and tabular fields stay aligned to the source.

---

## Outputs

- Translated text (free mode), or
- A filled, structured document in the chosen template (template mode), or
- A refined translation (edit mode)
- Proper nouns/numbers carried over verbatim; layout faithful to source

---

## Quality Criteria

| Criterion | Threshold |
|-----------|-----------|
| Legal-meaning fidelity | > 90% |
| Proper-noun / number preservation | 100% |
| Terminology consistency (glossary terms) | > 95% |
| Structural fidelity (template mode) | 100% |
| No added/removed content | 100% |
| Response time (P95, single page) | < 15 seconds |

---

## Pakistani Legal Context

### High-frequency document types
- **Fard (فرد) / Jamabandi** — land record; fields: Khewat, Khatooni, Khasra, owner share, area (kanal/marla)
- **Intiqal (انتقال)** — mutation of land
- **Nikah Nama (نکاح نامہ)** — marriage contract; standard 25-column government form
- **CNIC / ID Card, Birth & Divorce certificates** — NADRA formats
- **Sale Deed, Gift Deed, Mortgage Deed, Muhaida Bae** — registry instruments

### Terminology that must stay consistent (do NOT improvise)
- Khewat → "ownership number", Khatooni → "cultivation number", Khasra → "survey/plot number"
- Muhaida Bae → "agreement to sell", Bai-nama → "sale deed", Intiqal → "mutation"
- Talaq → "divorce", Khula → "khula (wife-initiated divorce)", Haq Mehr → "dower"

### Urdu/Arabic script handling
- Right-to-left rendering must not corrupt embedded English/Latin numbers.
- Keep diacritics where they disambiguate names.

---

## Example

**Input (image, ur → en):** photo of a Fard line `خیوت نمبر ۱۲۳ ختونی نمبر ۴۵ رقبہ ۲ کنال ۸ مرلہ`

**LEGAL-09 output:**
> Khewat (ownership) No. 123, Khatooni (cultivation) No. 45, Area: 2 Kanal 8 Marla.

(Numbers preserved; domain terms rendered consistently with the glossary.)

---

## Anti-patterns (what this skill must NEVER do)

- ❌ Translate or alter names, CNIC numbers, dates, amounts, or land/registry numbers
- ❌ Add explanatory content that is not in the source
- ❌ Drop clauses or collapse a structured form into a paragraph
- ❌ Use a different English term for the same Urdu legal term across runs
- ❌ Guess unreadable image text — mark it unclear (per LEGAL-10) rather than inventing
- ❌ Apply foreign-jurisdiction terminology to Pakistani instruments

---

## Validation

- Golden set of Urdu↔English legal documents (Fard, Nikah Nama, FIR, deeds) with reference translations — terminology and number fidelity scored.
- Round-trip check on numbers/proper nouns (must be identical to source).
- Template-mode output validated against the fixed template layout.
