---
id: S01-08
epic: EPIC-01
title: Required vs Optional Fields Indicator
status: Done
priority: P1
updated: 2026-06-19
---

# S01-08 — Required vs Optional Fields Indicator

## User Story

As a lawyer, I want to see which facts are required vs optional before filling the form so that I don't waste time.

## Acceptance Criteria

- [ ] Required fields clearly marked (e.g., asterisk or "Required" label)
- [ ] Optional fields visually distinct from required fields
- [ ] Form cannot be submitted if required fields are empty
- [ ] Indicator visible before the lawyer starts filling, not only on submit error

## Technical Notes

- Form rendering: `src/components/forms/DynamicForm.tsx`
- Schema-driven — required/optional flag must be part of template schema definition

## Definition of Done

- [ ] Required vs optional clearly visible on all template forms
- [ ] Form submission blocked if required fields empty
- [ ] Tested by at least 1 lawyer
- [ ] Abdullah sign-off
