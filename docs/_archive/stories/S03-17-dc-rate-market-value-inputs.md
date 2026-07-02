---
id: S03-17
epic: EPIC-03
title: DC Rate & Market Value Separate Inputs
status: Done
priority: P1
updated: 2026-06-19
---

# S03-17 — DC Rate & Market Value Separate Inputs

## User Story

As a lawyer, I want to enter both DC rate and market value separately so that calculations follow correct FBR valuation methodology.

## Acceptance Criteria

- [x] DC rate entered by lawyer (per Marla or per Sqft)
- [x] Market value override entered separately by lawyer (actual transaction price)
- [x] System uses correct value for each tax type (DC rate for WHT, market rate for Stamp Duty where applicable)

## Technical Notes

- Live UI route: `/property-transfer/tax-calculator`
- DC rate supports per-Marla or per-Sqft entry; market-value override is a separate field
- As built, rate tables are hardcoded — DC rate is entered/overridden manually (no estamp DB auto-load)

## Definition of Done

- [x] DC rate input working (per Marla / per Sqft)
- [x] Market value override input separate and clearly labelled
- [x] Tax calculations use correct value for each tax type
- [x] Abdullah sign-off
