# EPIC-04 — AI Legal Advisor (Chat-based)

---

## Epic Metadata

| Field | Detail |
|-------|--------|
| Epic ID | EPIC-04 |
| Owner | Abdullah |
| Author | Abdullah |
| Status | Built — Live |
| Priority | 4 — Medium |
| Estimated Effort | 2–3 Sprints |
| Depends On | Auth System (chat history tied to lawyer account) |
| Can Run In Parallel With | EPIC-03 |
| Last Updated | 2026-06-19 |

---

## Goal

Provide lawyers with a grounded, conversational AI Q&A advisor for Pakistani law — available in both Urdu and English — that surfaces judgment/statute citations when relevant, with a lawyer-in-the-loop approve/edit/reject workflow to ensure professional accountability is never compromised.

---

## Background

Lawyers spend significant time on daily law research — identifying which section applies, finding relevant case law, and understanding legal options for a given situation. TaqiAI's AI Legal Advisor makes this fast and reliable. However, there is a critical constraint by design: AI never delivers advice directly to a client. The lawyer always reviews and approves first. This is intentional — to protect professional liability and remain aligned with Pakistan Bar Council ethical standards.

> **Built status:** The AI Legal Advisor is **built and live at `/ai-advisor`**. It is conversational and judgment-grounded, with session persistence (Prisma `ChatSession` / `ChatMessage`), voice input, image upload, an approve/edit/reject workflow, an uncertainty flag, save-as-note, and display of judgment sources. APIs: `/api/chat/sessions*` and `/api/ai/advisor` (Gemini + judgment grounding). The advisor replies in a ChatGPT-style conversational manner — it does **not** force a citation/judgment block on every turn; citations and judgment sources surface when they are relevant to the question.

> **Important:** Every AI-generated advice includes a mandatory disclaimer: *"This advice is AI-generated. Please confirm with a senior lawyer before taking any action."*

---

## User Stories

| ID | User Story | Priority |
|----|-----------|---------|
| US-04-01 | As a lawyer, I want to ask legal questions in plain Urdu or English so that I get quick, relevant guidance on Pakistani law without a language barrier | Must Have |
| US-04-02 | As a lawyer, I want AI responses to include verified citations (PPC section, CrPC section, case law) when they are relevant so that I can use the information professionally | Must Have |
| US-04-03 | As a lawyer, I want to approve, edit, or reject AI-generated advice before acting on it so that I remain fully accountable as the professional | Must Have |
| US-04-04 | As a lawyer, I want my chat history saved so that I can refer back to past legal consultations without re-asking | Must Have |
| US-04-05 | As a lawyer, I want AI to clearly flag when it is uncertain so that I know when not to rely on the AI output | Must Have |
| US-04-06 | As a lawyer, I want to ask follow-up questions in the same thread so that I can go deeper on a legal issue without losing context | Should Have |
| US-04-07 | As a lawyer, I want to save a useful AI response as a note linked to a specific case or draft so that I can reference it during drafting | Could Have |
| US-04-08 | As a lawyer, I want every AI-generated advice to include a disclaimer recommending confirmation with a senior lawyer so that professional standards are always maintained | Must Have |

---

## Acceptance Criteria

| # | Criteria | Status |
|---|----------|--------|
| AC-01 | Bilingual input accepted: English, Urdu, and Roman Urdu | [ ] |
| AC-02 | Relevant Pakistani law citations / judgment sources (PPC, CrPC, CPC, Family Courts Act, etc.) are shown when relevant to the question — not forced on every conversational turn | [ ] |
| AC-03 | Zero made-up citations — AI only references pre-approved legal sources; uncertain cases explicitly flagged | [ ] |
| AC-04 | Mandatory approval workflow enforced: AI generates → Lawyer sees Approve / Edit / Reject → No action without approval | [ ] |
| AC-05 | Every approval logged with: lawyer name + timestamp + query summary (full audit trail) | [ ] |
| AC-06 | Chat history saved in Prisma (`ChatSession` + `ChatMessage` models) | [ ] |
| AC-07 | Uncertainty flagging clearly visible in the UI — not hidden or subtle | [ ] |
| AC-08 | Every AI advice response includes fixed disclaimer: *"This advice is AI-generated. Please confirm with a senior lawyer before taking any action."* | [ ] |
| AC-09 | Follow-up questions maintain full conversation context within the same session | [ ] |
| AC-10 | AI response time: reply appears within 10 seconds of submitting a question | [ ] |

---

## Success Metrics

| Metric | Target | How to Measure |
|--------|--------|---------------|
| AI response time | < 10 seconds | Response timing logs |
| Citation accuracy | 100% — verified citations only, no hallucinations | Manual verification by legal team |
| Lawyer approval rate | > 80% of responses approved as-is | Approval/reject tracking |
| Monthly active users using Advisor | 60%+ of total user base | Feature analytics |
| AI uncertainty flag rate | Track — should decrease over time | Flag occurrence logs |
| Chat sessions per lawyer per month | Track & grow | Session analytics |

---

## Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| AI generates hallucinated legal citations | Medium | High | Pre-approved reference set only; no free-form citation generation |
| Pre-approved reference set becomes outdated | Medium | High | Legal team reviews and updates reference set quarterly |
| Lawyer bypasses approval and acts on unverified advice | Low | High | UI makes approval the only path — no bypass possible |
| Response time exceeds 10 seconds on complex queries | Medium | Medium | Loading state shown; Gemini API timeout handling with retry |
| Chat history grows too large — performance issues | Low | Medium | Session pagination; archive old sessions after 90 days |

---

## Legal Reference Set Management

| Item | Detail |
|------|--------|
| What it is | A pre-approved set of Pakistani law references AI can cite (PPC, CrPC, CPC, Family Courts Act, Contract Act, etc.) |
| Who manages it | Abdullah / Legal Team |
| How it is stored | Maintained in `src/skills/LEGAL-04-legal-advisor.md` skill spec |
| Update frequency | Reviewed quarterly or after major law amendments |
| What AI cannot do | Cite anything outside this approved set — uncertainty must be flagged instead |
| Version tracking | Each update logged with date and law amendment reference |

---

## Mandatory Approval Workflow

| Step | Action | Who |
|------|--------|-----|
| 1 | Lawyer submits a legal question | Lawyer |
| 2 | AI generates response with citations | System (Gemini API) |
| 3 | Response shown to lawyer with disclaimer | System UI |
| 4 | Lawyer selects: Approve / Edit / Reject | Lawyer |
| 5 | On Approve: response logged with name + timestamp | System |
| 6 | Lawyer can now act on the advice | Lawyer |

> No AI advice proceeds to action without explicit lawyer approval at Step 4.

---

## Technical Notes

> Reuse existing code — do not rebuild from scratch.

| Component | File Path | Purpose |
|-----------|-----------|---------|
| Live UI Page | `/ai-advisor` | Live conversational advisor (voice input + image upload + approve/edit/reject) |
| Advisor API | `POST /api/ai/advisor` | Gemini + judgment-grounded advisor endpoint |
| Sessions API | `/api/chat/sessions*` | Chat session/message persistence endpoints |
| Advisor Skill | `src/skills/LEGAL-04-legal-advisor.md` | Full advisor skill spec — PRIMARY reference |
| Case Analyzer Skill | `src/skills/LEGAL-01-case-analyzer.md` | Initial case classification before advising |
| Legal Comparator | `src/skills/LEGAL-03-legal-comparator.md` | Comparing legal options in advice |
| AI Generation | `src/lib/gemini.ts` | Gemini API wrapper with fallback chain |
| AI Helper | `src/lib/gemini-helper.ts` | Helper functions for structured legal prompting |
| Intent Detection | `src/lib/intent-detection.ts` | Classifies legal query type before routing |
| Database — Sessions | Prisma `ChatSession` model | Save chat sessions (already in schema) |
| Database — Messages | Prisma `ChatMessage` model | Save individual messages (already in schema) |
| API Routes | `src/app/api/` | Existing AI endpoint routes to extend for chat |
| i18n | `src/i18n/` | Urdu/English response formatting |

---

## Definition of Done

This Epic is complete when **all** of the following are true:

| # | Condition |
|---|-----------|
| 1 | All User Stories (US-04-01 to US-04-08) are implemented and merged |
| 2 | All Acceptance Criteria (AC-01 to AC-10) are verified and checked off |
| 3 | Approval workflow tested — bypass is confirmed impossible |
| 4 | Citation accuracy verified by legal team — zero hallucinations |
| 5 | Disclaimer shown on every response — confirmed in UI and PDF |
| 6 | Chat history saving and retrieval confirmed working |
| 7 | Response time verified < 10 seconds on standard queries |
| 8 | Deployed to staging with no critical bugs |
| 9 | Product Owner (Abdullah) has reviewed and signed off |

---

## Out of Scope

| Feature | Reason |
|---------|--------|
| Direct client-facing chat | Lawyers only in v1 — no client portal |
| Real-time case law database | Static reference set in v1 — updated manually |
| AI auto-drafting from advisor output | Separate flow handled in EPIC-01 |

> Note: Voice input for legal questions, previously listed as out of scope, is now **built and live** in the advisor (alongside image upload).

---

## Dependencies

| Dependency | Why Needed |
|-----------|-----------|
| Auth System working | Chat history is tied to individual lawyer account |
| Prisma `ChatSession` + `ChatMessage` models confirmed in schema | Required for saving chat history |
| Gemini API key with sufficient context window | Required for legal Q&A with full conversation context |
| `LEGAL-04-legal-advisor.md` skill spec reviewed and finalized | Must be complete before development starts |
| Legal reference set reviewed and approved | AI must only cite pre-approved sources |

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-04-27 | Abdullah | Initial Epic created |
| 1.1 | 2026-04-27 | Abdullah | Added Legal Reference Set Management table, Approval Workflow table, Metadata, Risks, DoD, Version History, converted all sections to tables, added senior lawyer disclaimer (US-04-08 + AC-08) |
| 1.2 | 2026-06-19 | Hamza | Updated to reflect built & live implementation |
