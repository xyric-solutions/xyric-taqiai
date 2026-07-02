---
type: milestone
id: M-003
title: Template-Based Translation Engine
product: taqiai
status: completed
planned: 2026-05-04
achieved: 2026-06-19
milestone_type: feature
---

# [M-003] Template-Based Translation Engine

## Summary

Upgrade the translation page — shift from free-form AI translation to template-based translation. Use fixed, pre-approved English templates for Nikah Nama, Sale Deed, CNIC, and Birth Certificate, where only the variable data (name, CNIC, dates, property details) changes while the rest of the wording and tables stay the same. **Status: completed and live** — delivered across three modes (free text, document image OCR + translate, structured legal template) with roughly 10 templates and Urdu/English/Arabic support.

## Scope

| Story | Feature | Priority |
|-------|---------|----------|
| [S07-01](../stories/S07-01-template-based-legal-translation.md) | Template-Based Legal Document Translation | P0 |

## Work Items

| Task | Story | Status |
|------|-------|--------|
| [NS-005](../work-items/NS-005-template-based-translation.md) | S07-01 | completed |

## Key Decisions Made

| Decision | Rationale |
|----------|-----------|
| Template-based not free translation | Legal wording must be consistent — pre-approved by Nuoman |
| AI fills variables only | Names, CNIC, dates extracted and inserted — wording never changed |
| Tables preserved as-is | Existing English templates have table formatting that is legally standard |
| Templates must be provided first | Implementation depended on the physical templates from Nuoman — these were provided and coded (blocker resolved) |

## Acceptance Criteria

- [x] Document type selector on translation page
- [x] Nikah Nama template translation working (variable fields filled, wording unchanged)
- [x] Sale Deed, CNIC, Birth Certificate templates working
- [x] Additional templates delivered (~10 total, incl. Divorce Certificate, Fard, Mortgage Deed, Agriculture Land, Gift Deed, Nikah Nama modern)
- [x] Tables render correctly in output and print
- [x] Print: Times New Roman 13pt, proper layout
- [x] General Translation (free-form) still works as fallback
- [x] Missing fields show "[NOT PROVIDED]"

## Context

**Why:** Lawyers need consistent, legally reliable translations. Free-form AI generates different wording each time which is not acceptable for official legal documents. Nuoman has pre-approved English translation templates that lawyers already trust and use.

**How it was applied:** Nuoman provided the physical template documents from the "english data" folder, and they were coded exactly as TypeScript template files — no paraphrasing or modification of wording. The feature is built and live at `/translate`.

## Session Reference

| Field | Value |
|-------|-------|
| **Session Date** | 2026-05-04 |
| **Related Milestone** | M-002 (Document Editing & Print) |
| **Epic** | [E-07 — Legal Document Translation Services](../epics/EPIC-07-translation-services.md) |
