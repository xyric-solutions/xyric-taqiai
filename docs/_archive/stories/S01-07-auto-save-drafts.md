---
id: S01-07
epic: EPIC-01
title: Auto-save Drafts
status: Done
priority: P0
updated: 2026-06-19
---

# S01-07 — Auto-save Drafts

## User Story

As a lawyer, I want my drafts saved automatically so that I can access them later from my dashboard.

## Acceptance Criteria

- [ ] Documents saved to Prisma `Document` model after generation
- [ ] Saved drafts accessible from the lawyer's dashboard
- [ ] Draft state preserved (pre-approval edits retained)
- [ ] Every exported document logs: lawyer name + timestamp + template used

## Technical Notes

- Database: Prisma `Document` model (already exists — verify schema)
- Dashboard pages: `src/app/(dashboard)/`
- Save should trigger after AI generation completes, not after export only

## Definition of Done

- [ ] Draft saved to database automatically after generation
- [ ] Saved draft retrievable from dashboard
- [ ] Lawyer can resume editing a saved draft
- [ ] Abdullah sign-off
