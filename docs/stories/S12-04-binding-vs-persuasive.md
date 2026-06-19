---
id: S12-04
epic: EPIC-12
title: Binding vs Persuasive Authority Marking
status: Done
priority: P0
---

# S12-04 — Binding vs Persuasive Authority Marking

## User Story

As a lawyer, I want each cited judgment marked binding or persuasive so that I cite the right authority in court.

## Acceptance Criteria

- [x] Each returned judgment is marked binding (Supreme Court) or persuasive (High Court / Federal Shariat Court)
- [x] Marking is derived from the issuing court, not from an AI guess
- [x] Marking is clearly visible on each judgment in the results

## Technical Notes

- Binding = Supreme Court of Pakistan; Persuasive = High Courts / Federal Shariat Court
- Marking derived from the issuing court field on the judgment record

## Definition of Done

- [x] Binding vs persuasive marking shown per judgment
- [x] Verified against known Supreme Court and High Court judgments
- [x] Abdullah sign-off
