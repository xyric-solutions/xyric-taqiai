---
id: S03-05
epic: EPIC-03
title: Tax Summary PDF Export
status: Done
priority: P1
updated: 2026-06-19
---

# S03-05 — Tax Summary PDF Export

## User Story

As a lawyer, I want to export a tax summary as PDF so that I can share a formal document with my client.

## Acceptance Criteria

- [x] Printable summary of full tax breakdown available
- [x] Printable summary includes all itemized tax lines, subtotals, grand total
- [x] Printable summary includes legal disclaimer (see S03-08)
- [x] Printable summary includes rate source labels and last-updated date

## Technical Notes

- Live UI route: `/property-transfer/tax-calculator`
- As built, a printable summary (browser print/PDF) renders the full breakdown
- Disclaimer included in the printable summary

## Definition of Done

- [x] Printable summary works without errors
- [x] Printed content matches on-screen breakdown exactly
- [x] Disclaimer present in printable summary
- [x] Abdullah sign-off
