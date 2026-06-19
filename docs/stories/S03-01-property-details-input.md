---
id: S03-01
epic: EPIC-03
title: Property Details Input
status: Done
priority: P0
updated: 2026-06-19
---

# S03-01 — Property Details Input

## User Story

As a lawyer handling property transactions, I want to enter the property details and transaction type so that AI calculates all applicable taxes correctly.

## Acceptance Criteria

- [x] Input fields: property size (acres / kanals / marlas / sqft), property type (Plot / House / Agriculture), transaction type (Sale / Gift / Inheritance / Mortgage / Exchange)
- [x] Province selector: Punjab / Sindh / KPK / Balochistan / Islamabad
- [x] Market value input (actual transaction price)
- [x] Calculation result appears within 30 seconds of submission
- [x] Calculation is stateless — no login required

## Technical Notes

- Live UI route: `/property-transfer/tax-calculator` (step-by-step form)
- Stateless, rule-based/deterministic calculation — no external API dependency
- No estamp auto-loading — rates entered manually by lawyer; rate tables hardcoded (see S03-07, S03-09)

## Definition of Done

- [x] All property detail inputs working correctly
- [x] Province and transaction type selectors working
- [x] Full tax breakdown returned within 30 seconds
- [x] Stateless — works without login
- [x] Calculations verified accurate by legal team
- [x] Abdullah sign-off
