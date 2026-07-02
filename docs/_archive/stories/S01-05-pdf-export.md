---
id: S01-05
epic: EPIC-01
title: PDF Export
status: Done
priority: P0
updated: 2026-06-19
---

# S01-05 — PDF Export

## User Story

As a lawyer, I want to export the final document as a PDF so that I can submit it to court or share with the client.

## Acceptance Criteria

- [ ] PDF export works correctly with Urdu Nastaliq font preserved
- [ ] Lawyer must click "Approve & Export" — no direct export bypass possible
- [ ] PDF export success rate > 99%
- [ ] Every exported document logs: lawyer name + timestamp + template used

## Technical Notes

- PDF generation: `html2pdf.js` (already in package.json — reuse)
- Must test Urdu Nastaliq rendering across Chrome, Firefox, and Edge
- i18n layer: `src/i18n/` for Urdu/English text in PDF

## Definition of Done

- [ ] PDF export works without errors
- [ ] Urdu Nastaliq font preserved in exported PDF
- [ ] Tested across Chrome, Firefox, Edge
- [ ] Audit log entry created on export
- [ ] Abdullah sign-off
