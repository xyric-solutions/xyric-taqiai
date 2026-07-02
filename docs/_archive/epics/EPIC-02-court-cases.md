# EPIC-02 — Court Cases & Legal Filings

---

## Epic Metadata

| Field | Detail |
|-------|--------|
| Epic ID | EPIC-02 |
| Owner | Abdullah |
| Author | Abdullah |
| Status | Built — Live |
| Priority | 2 — High |
| Estimated Effort | 2–3 Sprints |
| Depends On | EPIC-01 (uses same drafting infrastructure) |
| Can Run In Parallel With | EPIC-03 |
| Last Updated | 2026-06-19 |

---

## Goal

Enable lawyers to draft civil, criminal, and family court petitions, applications, and police station complaints using AI — with proper Pakistani court formatting and accurate law section references.

---

## Background

Court filings in Pakistan are highly formatted and must reference specific legal sections (CrPC, CPC, PPC, Family Courts Act). An incorrect section reference or formatting error damages a lawyer's credibility and can harm a client's case. TaqiAI auto-suggests the relevant law sections based on case type — the lawyer provides the facts, AI handles the legal structure. Court drafting is **built and live** through the same smart-draft engine as EPIC-01, spanning the criminal, civil, family, constitutional, and related categories.

> **Built status note:** Voice intake and image OCR — both originally described within this Epic — are now shipped as their own dedicated features. Voice narration → structured draft is live at `/voice-case` (see **EPIC-11 — Voice Case**), and document-image OCR/typing is live at `/copy-from-photo` (see **EPIC-10 — Copy from Photo**). The voice/image references below are retained for context and cross-referenced to those epics.

---

## Document Categories Covered

| Category | Document Types |
|----------|---------------|
| Civil Court | Civil Suit, Civil Application, Injunction Petition, Appeal |
| Criminal Court | Bail Application (Pre/Post Arrest), Criminal Complaint, Quashing Petition |
| Family Court | Divorce Petition (Khula), Maintenance Application, Child Custody, Guardianship |
| High Court / Supreme Court | Constitutional Petition (Writ), Revision Petition |
| Police Station | FIR Draft, Written Complaint, FIR Cancel Application |
| General Applications | Court Applications, Misc Petitions |

---

## User Stories

| ID | User Story | Priority |
|----|-----------|---------|
| US-02-01 | As a lawyer, I want to draft civil, criminal, and family court petitions using AI so that I save hours of manual drafting | Must Have |
| US-02-02 | As a lawyer, I want the system to automatically suggest relevant law sections (CrPC, CPC, PPC) based on case type so that my filings are legally accurate | Must Have |
| US-02-03 | As a lawyer, I want to upload a client voice recording so that AI extracts case facts automatically and pre-fills the drafting form | Should Have |
| US-02-04 | As a lawyer, I want to upload images of handwritten notes or existing documents so that AI reads and uses that information in the draft | Should Have |
| US-02-05 | As a lawyer, I want to draft police station applications and FIR complaints so that I can assist clients at the earliest legal stage | Must Have |
| US-02-06 | As a lawyer, I want a formatted court document preview that matches Pakistani court standards so that I know exactly what will be filed | Must Have |
| US-02-07 | As a lawyer, I want AI to flag any missing critical information before I finalize so that I don't file an incomplete document | Should Have |
| US-02-08 | As a lawyer, I want a manual text entry option as a fallback if voice quality is poor so that I am never stuck and can always complete the draft | Must Have |

---

## Acceptance Criteria

| # | Criteria | Status |
|---|----------|--------|
| AC-01 | All major court document categories are available (civil, criminal, family, police station) | [ ] |
| AC-02 | AI automatically suggests relevant Pakistani law sections per case type | [ ] |
| AC-03 | Voice upload → speech-to-text → fact extraction pipeline works correctly | [ ] |
| AC-04 | Image upload → OCR/text extraction → fact pre-fill works correctly | [ ] |
| AC-05 | If voice quality is poor or fails, manual text entry fallback is available immediately | [ ] |
| AC-06 | Court document formatting follows Pakistani court conventions (headers, court name, case number fields) | [ ] |
| AC-07 | PDF export includes proper court document layout — not generic | [ ] |
| AC-08 | AI flags missing critical fields before lawyer approves export | [ ] |
| AC-09 | Lawyer must review and explicitly approve before export | [ ] |
| AC-10 | Every exported court document logs: lawyer name + timestamp + court type | [ ] |

---

## Success Metrics

| Metric | Target | How to Measure |
|--------|--------|---------------|
| Court document types covered | 15+ | Template count |
| Law section suggestion accuracy | > 90% | Lawyer-verified testing sessions |
| Voice recording → structured draft (end-to-end) | No time limit on recording — process completes as fast as possible after submission | Timing logs |
| Image → fact extraction accuracy | > 85% | Test with sample documents |
| Lawyer edit ratio on court docs | < 25% | Track edits before approval |
| Voice fallback usage rate | Track | Feature analytics |

---

## Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Voice transcription accuracy is low | High | Medium | Manual text entry fallback always available (US-02-08) |
| OCR fails on low-quality images | High | Medium | Show clear error + allow manual re-entry of facts |
| AI suggests wrong law section | Medium | High | Lawyer must review and edit before approval — no auto-submit |
| Court formatting varies by court/city | Medium | Medium | Build flexible formatting templates per court type |
| Voice recording file size too large | Medium | Low | No time limit on recording — auto-compress large files before upload to avoid upload failures |

---

## Technical Notes

> Reuse existing code — do not rebuild from scratch.

| Component | File Path | Purpose |
|-----------|-----------|---------|
| Voice Input | `src/components/documents/VoiceRecorder.tsx` | Voice recording — shipped as built feature at `/voice-case` (EPIC-11) |
| Image Upload | `src/components/documents/ImageUploadTyping.tsx` | Image upload + typing — shipped as built feature at `/copy-from-photo` (EPIC-10) |
| Smart Draft API | `POST /api/ai/smart-draft` | Live court-drafting endpoint (shared with EPIC-01) |
| Intent Detection | `src/lib/intent-detection.ts` | 480+ line legal intent classifier — determines case type |
| Intent Handlers | `src/lib/intent-handlers.ts` | Handles routing after intent is detected |
| Drafting Skill | `src/skills/LEGAL-02-legal-drafter.md` | 50KB full skill spec — primary reference |
| AI Generation | `src/lib/gemini.ts` | Gemini API for transcription, OCR, and legal analysis |
| AI Helper | `src/lib/gemini-helper.ts` | Helper functions for structured prompting |
| Database | Prisma `Document` model | Save court case drafts |
| Dashboard Pages | `src/app/(dashboard)/` | Existing routes — add court case pages here |

---

## Key Technical Flow

| Step | Action | Component Used |
|------|--------|---------------|
| 1 | Lawyer selects court type and case type | Dashboard UI |
| 2 | System classifies legal intent | `intent-detection.ts` |
| 3 | AI asks clarifying questions OR accepts voice/image input | `VoiceRecorder.tsx` / `ImageUploadTyping.tsx` |
| 4 | Facts structured → relevant law sections auto-suggested | Gemini API |
| 5 | Draft generated using legal drafter skill | `LEGAL-02-legal-drafter.md` |
| 6 | Lawyer reviews inline → approves → PDF exported | `DocumentPreview.tsx` |

---

## Definition of Done

This Epic is complete when **all** of the following are true:

| # | Condition |
|---|-----------|
| 1 | All User Stories (US-02-01 to US-02-08) are implemented and merged |
| 2 | All Acceptance Criteria (AC-01 to AC-10) are verified and checked off |
| 3 | Voice-to-draft pipeline tested with real voice samples |
| 4 | Image upload tested with real scanned documents |
| 5 | Court formatting reviewed and approved by a practicing lawyer |
| 6 | Deployed to staging with no critical bugs |
| 7 | Product Owner (Abdullah) has reviewed and signed off |

---

## Out of Scope

| Feature | Reason |
|---------|--------|
| Actual court e-filing integration | Not available via API in Pakistan yet |
| Case outcome tracking | Separate product scope |
| Court date management | Out of v1 focus |
| Client portal access to court documents | Client-facing features excluded in v1 |

---

## Dependencies

| Dependency | Why Needed |
|-----------|-----------|
| EPIC-01 complete | Court cases use the same drafting infrastructure |
| Gemini API with voice transcription enabled | Required for voice-to-text pipeline |
| Gemini API with vision capability enabled | Required for image/OCR pipeline |
| VoiceRecorder + ImageUploadTyping tested | Components must be stable before integration |

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-04-27 | Abdullah | Initial Epic created |
| 1.1 | 2026-04-27 | Abdullah | Added voice fallback story (US-02-08), Metadata, Risks, DoD, Version History, converted all sections to tables |
| 1.2 | 2026-06-19 | Hamza | Updated to reflect built & live implementation |
