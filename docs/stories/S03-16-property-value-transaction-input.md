---
id: S03-16
epic: EPIC-03
title: Property Value & Transaction Input
status: Done
priority: P0
updated: 2026-06-19
---

# S03-16 — Property Value & Transaction Input

## User Story

As a lawyer handling property transactions, I want to enter the property value and transaction type so that I instantly get all applicable taxes calculated.

## Acceptance Criteria

- [x] Input fields: property value, transaction type (Sale / Gift / Inheritance / Mortgage / Exchange)
- [x] Calculation result appears within 30 seconds of submission
- [x] Calculation is stateless — no login required
- [x] Output shows fully itemized tax breakdown: Stamp Duty, PLRA, FBR WHT (buyer + seller), CGT

## Technical Notes

- Live UI route: `/property-transfer/tax-calculator`
- Stateless, rule-based/deterministic calculation — no external API dependency
- Rate tables are hardcoded in the calculator (no DB lookup)

## Definition of Done

- [x] Property value and transaction type inputs working
- [x] Full tax breakdown returned within 30 seconds
- [x] Stateless — works without login
- [x] Calculations verified accurate against manual calculation by legal team
- [x] Abdullah sign-off
