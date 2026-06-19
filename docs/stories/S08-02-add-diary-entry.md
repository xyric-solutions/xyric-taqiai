---
id: S08-02
epic: EPIC-08
title: Add New Case to Diary
status: Done
priority: P0
updated: 2026-06-19
---

> **Built & live (2026-06-19):** POST `/api/diary` creates a `DiaryEntry`. Fields shipped: case number, last date, next date, title, court name, proceeding stage (dropdown), client phone.

# S08-02 — Add New Case to Diary

## User Story

As a lawyer, I want to add a new case to my diary so that I can start tracking it alongside all my other active cases.

## Acceptance Criteria

- [ ] "Add Case" button visible on diary page
- [ ] Form collects all 7 fields: Case Number, Last Date, Title, Court Name, Stage, Proceeding, Next Date
- [ ] Stage field is a dropdown with predefined options: Arguments / Evidence / Bail Hearing / Judgment / Mention / Framing of Charges / Final Arguments / Other
- [ ] Court Name is free-text input (lawyer types court name as used in practice)
- [ ] Case Number is free-text (court-assigned number — optional field)
- [ ] Last Date and Next Date use date picker
- [ ] Proceeding is free-text textarea — lawyer types what happened
- [ ] New entry appears in diary table immediately after saving
- [ ] Form can be submitted in under 60 seconds for a typical entry

## Technical Notes

- POST to `/api/diary` — creates new `DiaryEntry` record scoped to `userId`
- Case Number is optional — some matters may not have a court number yet
- No AI involvement — all fields are manual lawyer input
- Date fields: store as ISO date; display in DD/MM/YYYY format (Pakistani legal practice standard)

## Definition of Done

- [ ] Add Case form works with all 7 fields
- [ ] Stage dropdown has all 8 predefined options
- [ ] Entry appears in table after save
- [ ] Optional Case Number field accepted as blank
- [ ] Abdullah sign-off
