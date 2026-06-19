---
id: S06-07
epic: EPIC-06
title: Hearing Conflict Detection
status: Done
priority: P1
updated: 2026-06-19
---

# S06-07 — Hearing Conflict Detection

## User Story

As a lawyer, I want the system to warn me if I have two hearings at the same time in different courts so that I catch scheduling conflicts.

## Acceptance Criteria

- [ ] System warns if two hearings overlap in time
- [ ] Warning shown when adding or editing a hearing date
- [ ] Warning does not block entry — lawyer can override (hearings sometimes run short)
- [ ] Conflict detection runs server-side (not client-side — multi-device safe)
- [ ] Conflict detection accuracy: 100%

## Technical Notes

- Conflict detection: server-side query on `MatterHearing` entities per user for the given date/time
- Warning is advisory — not a hard block
- Multi-device: all data in Prisma, not localStorage

## Definition of Done

- [ ] Conflict detection triggers when overlapping hearing added
- [ ] Warning shown clearly — not subtle
- [ ] Lawyer can still save despite conflict (override allowed)
- [ ] Tested with known overlapping hearing dates
- [ ] Abdullah sign-off
