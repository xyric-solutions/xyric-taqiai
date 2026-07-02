---
id: S04-03
epic: EPIC-04
title: Approve / Edit / Reject AI Advice Workflow
status: Done
priority: P0
updated: 2026-06-19
---

# S04-03 — Approve / Edit / Reject AI Advice Workflow

## User Story

As a lawyer, I want to approve, edit, or reject AI-generated advice before acting on it so that I remain fully accountable as the professional.

## Acceptance Criteria

- [ ] Mandatory approval workflow enforced: AI generates → Lawyer sees Approve / Edit / Reject → No action without approval
- [ ] Every approval logged with: lawyer name + timestamp + query summary (full audit trail)
- [ ] No bypass of approval step possible in UI
- [ ] Lawyer approval rate target: > 80% of responses approved as-is

## Technical Notes

- Approval workflow: 6-step flow defined in EPIC-04
- Audit log stored in database — linked to lawyer account
- API routes: `src/app/api/` — extend for approval logging
- Chat sessions: Prisma `ChatSession` + `ChatMessage` models

## Definition of Done

- [ ] Approve / Edit / Reject buttons present on every AI response
- [ ] Approval bypass confirmed impossible
- [ ] Audit log entry created on every approval
- [ ] Tested — no way to act on advice without approval step
- [ ] Abdullah sign-off
