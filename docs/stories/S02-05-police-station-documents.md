---
id: S02-05
epic: EPIC-02
title: Police Station Applications & FIR Documents
status: Done
priority: P0
updated: 2026-06-19
---

# S02-05 — Police Station Applications & FIR Documents

## User Story

As a lawyer, I want to draft police station applications and FIR complaints so that I can assist clients at the earliest legal stage.

## Acceptance Criteria

- [ ] FIR Draft template available and functional
- [ ] Written Complaint template available and functional
- [ ] FIR Cancel Application template available and functional
- [ ] All police station docs use Pakistani police formatting conventions
- [ ] PDF export includes proper police station document layout

## Technical Notes

- Drafting skill: `src/skills/LEGAL-02-legal-drafter.md`
- Dashboard pages: `src/app/(dashboard)/` — add police station document page
- Reuse `src/lib/draft-generator.ts`

## Definition of Done

- [ ] FIR Draft, Written Complaint, FIR Cancel Application all working
- [ ] Formatting verified by a practicing lawyer
- [ ] Tested end-to-end including PDF export
- [ ] Abdullah sign-off
