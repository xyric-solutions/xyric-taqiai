---
id: S01-06
epic: EPIC-01
title: Bilingual Templates (Urdu & English)
status: Done
priority: P0
updated: 2026-06-19
---

# S01-06 — Bilingual Templates (Urdu & English)

## User Story

As a lawyer, I want templates available in both Urdu and English so that I can serve diverse clients.

## Acceptance Criteria

- [ ] Templates available in both Urdu and English
- [ ] Language selector visible on the form before drafting
- [ ] Switching language does not reset entered facts
- [ ] Urdu Nastaliq font correctly rendered in both preview and PDF export

## Technical Notes

- i18n layer: `src/i18n/` (existing translation layer — extend, do not rebuild)
- PDF export: `html2pdf.js` with font embedding for Nastaliq

## Definition of Done

- [ ] Language selector works on all template forms
- [ ] Urdu and English drafts generate correctly
- [ ] PDF export verified for Urdu output
- [ ] Tested by at least 1 lawyer
- [ ] Abdullah sign-off
