---
id: S02-01
epic: EPIC-02
title: Court Petition Drafting (Civil, Criminal, Family)
status: Done
priority: P0
updated: 2026-06-19
---

# S02-01 — Court Petition Drafting (Civil, Criminal, Family)

## User Story

As a lawyer, I want to draft civil, criminal, and family court petitions using AI so that I save hours of manual drafting.

## Acceptance Criteria

- [ ] All major court document categories available: civil, criminal, family, police station
- [ ] Court document formatting follows Pakistani court conventions (headers, court name, case number fields)
- [ ] PDF export includes proper court document layout — not generic
- [ ] Lawyer must review and explicitly approve before export
- [ ] Every exported court document logs: lawyer name + timestamp + court type

## Technical Notes

- Drafting skill spec: `src/skills/LEGAL-02-legal-drafter.md` (50KB — primary reference)
- Dashboard pages: `src/app/(dashboard)/` — add court case pages here
- Reuse `src/lib/draft-generator.ts` and `src/lib/gemini.ts`
- Document categories: Civil Suit, Civil Application, Injunction Petition, Appeal, Bail Application (Pre/Post Arrest), Criminal Complaint, Quashing Petition, Divorce Petition (Khula), Maintenance Application, Child Custody, Guardianship

## Definition of Done

- [ ] All 15+ court document types available
- [ ] Court formatting reviewed and approved by a practicing lawyer
- [ ] Exported PDF has court-specific layout
- [ ] Audit log entry created on export
- [ ] Abdullah sign-off
