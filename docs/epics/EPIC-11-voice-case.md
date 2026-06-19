# EPIC-11 — Voice Case (Case from Discussion)

---

## Epic Metadata

| Field | Detail |
|-------|--------|
| Epic ID | EPIC-11 |
| Owner | Abdullah |
| Author | Hamza |
| Product | TaqiAI |
| Status | Built — Live |
| Priority | P1 — High |
| Route | `/voice-case` |
| Last Updated | 2026-06-19 |

---

## Goal

Turn a recorded advocate-client conversation into a ready legal document. A lawyer records or uploads the discussion (or pastes a transcript), the AI analyzes it into a structured case breakdown, detects the correct document type, drafts that document, and presents it for inline editing — auto-saved to My Documents. The lawyer goes from "talking to the client" to "draft in hand" without manually structuring the case first.

---

## Background

In Pakistani legal practice, a case usually starts as a conversation: the client narrates their problem, the advocate asks questions, and somewhere in that discussion are all the facts, parties, and legal issues needed to draft. Today the advocate has to mentally extract that, decide what document to file (bail application, writ petition, khula petition, etc.), and draft it by hand. This Epic compresses that pipeline: capture the discussion as audio or text, let the AI extract the case structure and missing information, recommend and draft the right document, and hand back an editable, saved draft. It reuses the app's voice transcription, case-analysis, and smart-draft capabilities behind a single guided `/voice-case` flow.

---

## Sub-Modules

| ID | Sub-Module | Description |
|----|-----------|-------------|
| A | Record / Upload Intake | Built-in voice recorder, audio file upload, or paste a transcript |
| B | AI Case Analysis | Extract summary, parties, facts, legal issues, suggested document type, applicable law sections, and missing information |
| C | AI Drafting | Draft the recommended document type based on the analysis |
| D | Preview, Edit & Save | Display and inline-edit the draft; auto-save to My Documents; English/Urdu output |

---

## Real Implemented Stages

| Stage | Name | What Happens |
|-------|------|-------------|
| 1 | Record / Upload | Built-in voice recorder, audio file upload, or paste transcript |
| 2 | Analysis | AI extracts case summary, parties, facts, legal issues, suggested document type, applicable law sections, and missing information |
| 3 | Drafting | AI drafts the recommended document type (e.g. Bail Application, Writ Petition, Khula Petition) based on the analysis |
| 4 | Preview | Display and inline-edit the generated document; auto-save to My Documents; output in English or Urdu |

---

## User Stories

| ID | User Story | Priority |
|----|-----------|---------|
| US-11-01 | As a lawyer, I want to record audio, upload an audio file, or paste a transcript of an advocate-client discussion so that I can start a case from a conversation | Must Have |
| US-11-02 | As a lawyer, I want the AI to analyze the discussion and extract parties, facts, legal issues, applicable law, and missing information so that I see a structured case breakdown | Must Have |
| US-11-03 | As a lawyer, I want the AI to detect and suggest the appropriate document type so that I know what to file | Must Have |
| US-11-04 | As a lawyer, I want the AI to draft the recommended document based on the analysis so that I get a usable first draft | Must Have |
| US-11-05 | As a lawyer, I want the drafted document in English or Urdu so that it matches the language I need | Must Have |
| US-11-06 | As a lawyer, I want to preview and inline-edit the draft with auto-save to My Documents so that I can refine and keep it | Must Have |

---

## Acceptance Criteria

| # | Criteria | Status |
|---|----------|--------|
| AC-01 | Lawyer can record audio with a built-in voice recorder | [x] |
| AC-02 | Lawyer can upload an existing audio file | [x] |
| AC-03 | Lawyer can paste a transcript instead of audio | [x] |
| AC-04 | Audio is transcribed via `POST /api/ai/voice-transcribe` | [x] |
| AC-05 | AI analysis returns case summary, parties, facts, legal issues, suggested document type, applicable law sections, and missing information via `POST /api/ai/case-analysis` | [x] |
| AC-06 | Suggested document type is detected and shown (e.g. Bail Application, Writ Petition, Khula Petition) | [x] |
| AC-07 | AI drafts the recommended document via `POST /api/ai/smart-draft` | [x] |
| AC-08 | Draft output can be produced in English or Urdu | [x] |
| AC-09 | Draft is shown in a preview and can be inline-edited | [x] |
| AC-10 | Draft auto-saves to "My Documents" | [x] |

---

## Success Metrics

| Metric | Target | How to Measure |
|--------|--------|---------------|
| Analysis accuracy (parties/facts/issues) | Lawyer confirms breakdown is correct | Manual review on sample discussions |
| Correct document-type detection rate | Lawyer accepts suggested type | Acceptance tracking in beta |
| Time from discussion to first draft | < 2 minutes | UX timing in beta testing |
| Transcription success rate | > 95% | Error logs |
| Draft usability (minimal manual rework) | Abdullah confirms usable first draft | Manual review |
| Auto-save reliability | 100% of drafts land in My Documents | Document library audit |

---

## Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Transcription errors on noisy audio or accents | Medium | Medium | Allow paste-transcript fallback; analysis surfaces missing information |
| AI suggests wrong document type | Medium | High | Show analysis breakdown so lawyer can verify before drafting; draft is editable |
| Missing facts produce an incomplete draft | Medium | Medium | Analysis explicitly lists missing information for the lawyer to fill |
| Long recordings slow transcription/analysis | Low | Medium | Staged pipeline (transcribe → analyze → draft) keeps each step bounded |
| Sensitive client data in audio | Low | High | Data scoped per lawyer; standard app auth and privacy handling |

---

## Technical Notes

| Component | Detail |
|-----------|--------|
| Route | `/voice-case` (dashboard segment) |
| Intake component | `VoiceRecorder` — built-in recording + upload + paste transcript |
| Transcription API | `POST /api/ai/voice-transcribe` — audio → transcript |
| Analysis API | `POST /api/ai/case-analysis` — discussion → structured breakdown (summary, parties, facts, issues, suggested doc type, applicable law sections, missing info) |
| Drafting API | `POST /api/ai/smart-draft` — drafts the recommended document |
| Skills | LEGAL-07 (Voice Intake), LEGAL-02 (Legal Drafter) |
| Output languages | English / Urdu |
| Persistence | Auto-save to "My Documents" document library |

---

## Definition of Done

| # | Condition |
|---|-----------|
| 1 | All User Stories (US-11-01 to US-11-06) implemented and merged |
| 2 | All Acceptance Criteria (AC-01 to AC-10) verified and checked off |
| 3 | Record, upload, and paste-transcript intake all working |
| 4 | Voice transcription working via `voice-transcribe` |
| 5 | Case analysis returns full structured breakdown |
| 6 | Document-type detection and drafting working end-to-end |
| 7 | English/Urdu output and inline edit with auto-save confirmed |
| 8 | Abdullah has reviewed and signed off |

---

## Out of Scope

| Feature | Reason |
|---------|--------|
| Multi-speaker diarization (label who said what) | Not required for v1 analysis |
| Filing the document directly to a court portal | Different product scope |
| Real-time live transcription during a hearing | Intake is post-discussion, not live |
| Automatic linking of the draft to a Matter | Future enhancement (see Chamber Management) |

---

## Dependencies

| Dependency | Why Needed |
|-----------|-----------|
| `POST /api/ai/voice-transcribe` | Converts recorded/uploaded audio to a transcript |
| `POST /api/ai/case-analysis` | Produces the structured case breakdown |
| `POST /api/ai/smart-draft` | Drafts the recommended document |
| `VoiceRecorder` component | Provides the record/upload/paste intake UI |
| My Documents library | Target for auto-save of generated drafts |
| Auth System | Drafts and case data scoped per logged-in lawyer |
| Abdullah UX validation | Confirm analysis and drafts match real practice |

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-06-19 | Hamza | Initial epic documented from built feature |
