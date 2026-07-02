---
id: S02-09
epic: EPIC-02
title: AI Edit for Court Case Drafts
status: Done
priority: P0
created: 2026-05-04
updated: 2026-06-19
---

# S02-09 — AI Edit for Court Case Drafts

## User Story

As a lawyer, I want to edit AI-generated court case drafts using AI instructions (e.g., "Change petitioner name to Ahmad Ali"), so that I can refine the document without rewriting it from scratch.

---

## Background

The Court Cases page generates an AI plain-text draft. Basic textarea editing is currently available, but:
- AI-instruction-based editing (as available on the drafting pages) is not present
- PDF print formatting is basic — ALL CAPS headings and numbered paragraphs do not render properly

This story adds AI Edit for court cases and improves the PDF print output.

> **Note:** Court case documents are not printed on stamp paper — they are filed on plain A4. Therefore the stamp paper print feature is not required for this page.

---

## Acceptance Criteria

- [x] Court Cases output panel has an "AI Edit ✨" button (alongside Edit Draft)
- [x] Clicking AI Edit opens the instruction panel
- [x] The advocate writes the instruction in the instruction textarea
- [x] Quick suggestions are available: "Change name", "Add clause", "Add law section", "Shorten", "Fix date"
- [x] Clicking "Apply AI Edit" calls `/api/ai/edit-document`
- [x] The draft updates from the AI response (textarea content is replaced)
- [x] A loading state is shown: "AI is editing..."
- [x] Error handling: an error message is shown on failure
- [x] Manual edit (textarea) continues to work as before (no regression)
- [x] Improved PDF Print:
  - ALL CAPS lines → bold centered headings
  - `**bold**` markers → actual bold text
  - Numbered paragraphs → properly indented
  - Proper A4 margins (25mm top, 20mm sides)

---

## Technical Notes

- File: `src/app/(dashboard)/court-cases/page.tsx`
- AI Edit API: `POST /api/ai/edit-document` — `{currentContent, editInstruction, language}`
- `aiResponse` is currently plain text — the updated content must be stored after the AI edit
- Improve `handleDownloadPDF()`: from plain `<pre>` to formatted HTML
- Create a `buildCourtHtml(content)` helper function that converts:
  - Uppercase lines → `<p style="text-align:center;font-weight:bold">`
  - `**text**` → `<strong>text</strong>`
  - `1. text` → `<p style="margin-left:20px">`

---

## Definition of Done

- [x] AI Edit button visible in Court Cases output panel
- [x] Instructions accepted and AI updates draft
- [x] Quick suggestions work
- [x] Improved PDF formatting verified
- [x] Manual edit still works
- [x] Error case handled
- [ ] Abdullah sign-off
