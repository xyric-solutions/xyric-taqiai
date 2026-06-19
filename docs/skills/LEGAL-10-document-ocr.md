---
id: LEGAL-10
name: Document Intake & OCR Extraction
category: legal-ai
version: 1.0
status: Active
module: Document Intake (Image → Structured Text)
lawyer_facing: true
owner: Abdullah
last_updated: 2026-06-02
---

# LEGAL-10 — Document Intake & OCR Extraction

> **OCR / extraction skill.** Read a photographed or scanned document — including **handwritten** Pakistani legal papers — strictly line by line, and return exactly what is written. The cardinal rule: transcribe what is visible, never what "should" be there.

Implemented by: `POST /api/ai/extract-document` (multi-step strict OCR). Also the OCR front-end for LEGAL-09 (image translation) and image-typing in drafting.

---

## When to Activate

| Trigger | Example |
|---------|---------|
| Photo/scan of a document uploaded | Handwritten plaint, Fard, FIR, affidavit |
| Image attached to a drafting/translation flow | "Type this for me" / "Translate this photo" |
| Handwriting digitization | Lawyer's handwritten case notes |

Do NOT activate when:
- Input is already digital text → skip OCR
- The user wants translation → run OCR (this skill) then LEGAL-09
- The user wants drafting → run OCR then LEGAL-02

---

## Inputs

| Input | Required | Notes |
|-------|----------|-------|
| Image (≤10MB; JPG/PNG/WebP/GIF) | Yes | Handwritten or printed |
| Language hint (`en` / `ur`) | No | Default `en`; guides script expectation |

---

## Process / Method

A deliberate **multi-step, low-hallucination** pipeline:

1. **Step 1 — Raw line-by-line read.** Go top to bottom; for each line read each word and write *exactly* what is visible.
   - Hard-to-read word → best attempt + `[?]`
   - Unreadable word → `[UNCLEAR]`
   - Unreadable line → `[UNCLEAR LINE]`
   - Never add a word not physically present; never infer from context.
2. **Step 2 — Structure (optional).** Organize the verified text into fields the downstream consumer expects (parties, dates, amounts, section refs) **without** adding new content.
3. Preserve original script (Urdu stays Urdu, English stays English) and all numbers exactly.
4. Surface a confidence signal so the UI can prompt the lawyer to verify flagged spots.

---

## Outputs

- Faithful extracted text with `[?]` / `[UNCLEAR]` markers where applicable
- Optional structured fields (when a consumer requests them)
- Original script and numbers preserved

---

## Quality Criteria

| Criterion | Threshold |
|-----------|-----------|
| Printed-text character accuracy | > 95% |
| Handwriting word accuracy (legible) | > 80% |
| Invented words (hallucination) | < 2% |
| Number/proper-noun fidelity | > 95% |
| Unclear segments correctly flagged (not guessed) | > 95% |

---

## Pakistani Legal Context

- **Handwriting is everywhere** — many filings, Fards, and notes are handwritten in Urdu Nastaliq or hurried English; mixed scripts on one page are common.
- **Registry/land documents** — Khewat, Khatooni, Khasra numbers and kanal/marla areas must be read digit-perfect.
- **Stamp papers & seals** — printed boilerplate around handwritten content; separate the two.
- **NADRA / court formats** — CNIC, FIR numbers, case numbers follow fixed patterns; respect them but never "auto-correct" a number to fit the pattern.

---

## Example

**Input:** photo of a handwritten line, partly smudged.

**LEGAL-10 output:**
> Muddai: Muhammad Aslam walad Ghulam [?] Rasool, sakin Mohallah Islampura, Lahore.
> CNIC: 35202-[UNCLEAR]-7
> (Flagged for lawyer verification.)

---

## Anti-patterns (what this skill must NEVER do)

- ❌ Guess a word "because it sounds right" or fits context
- ❌ Auto-complete a partial CNIC / case number to a valid-looking one
- ❌ Translate during extraction (that is LEGAL-09)
- ❌ Silently drop an unreadable line — mark it `[UNCLEAR LINE]`
- ❌ Re-order or "tidy" content in a way that changes meaning
- ❌ Add legal boilerplate that wasn't in the image

---

## Validation

- Golden set of Pakistani handwritten + printed documents with reference transcriptions; measure accuracy AND false-confidence (penalize invented words heavily).
- Verify markers (`[?]`, `[UNCLEAR]`) appear where the source is genuinely ambiguous.
- End-to-end check: extracted numbers must match when piped into LEGAL-09/LEGAL-02.
