---
id: S03-14
epic: EPIC-03
title: Marla / Kanal Size Input with Auto-Conversion
status: Done
priority: P0
updated: 2026-06-19
---

# S03-14 — Marla / Kanal Size Input with Auto-Conversion

## User Story

As a lawyer, I want to enter property size in Marla or Kanal so that the calculator auto-converts and computes the correct area-based valuation.

## Acceptance Criteria

- [x] Size input accepts acres, kanals, marlas, and sqft
- [x] Auto-conversion between units (e.g. 1 Kanal = 20 Marla)
- [x] Area-based valuation computed correctly after conversion

## Technical Notes

- Size step in the calculator flow
- Conversion handled in deterministic logic; DC rate supports per-Marla or per-Sqft
- Input: size value + unit toggle (acres / kanals / marlas / sqft)

## Definition of Done

- [x] Acres / kanals / marlas / sqft inputs working
- [x] Auto-conversion verified
- [x] Area-based valuation correct after conversion
- [x] Abdullah sign-off
