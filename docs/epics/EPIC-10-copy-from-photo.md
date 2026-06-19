# EPIC-10 — Copy from Photo (Document Digitization)

---

## Epic Metadata

| Field | Detail |
|-------|--------|
| Epic ID | EPIC-10 |
| Owner | Abdullah |
| Author | Hamza |
| Product | TaqiAI |
| Status | Built — Live |
| Priority | P1 — High |
| Route | `/copy-from-photo` |
| Last Updated | 2026-06-19 |

---

## Goal

Let a lawyer photograph any paper document and have the AI retype it exactly as shown — same-to-same, not summarized — so the typed text becomes an editable, saveable digital document in seconds. The lawyer uploads an image, the AI performs OCR, reproduces the document text preserving its formatting and content, and the result auto-saves to "My Documents" ready for editing, printing, or reuse.

---

## Background

Pakistani lawyers handle large volumes of paper: handwritten notes, old typed agreements, scanned affidavits, photocopied judgments, and physical performas. Retyping these by hand is slow and error-prone, and free-form AI tools tend to paraphrase or "improve" the text instead of reproducing it faithfully. Lawyers need a literal digitization tool — point the phone camera at a document, and get back the exact same text, ready to edit. This Epic builds that as a dedicated `/copy-from-photo` segment that reuses the existing document-extraction API and the image-upload typing component, with an English/Urdu output toggle and automatic save to the lawyer's document library.

---

## Sub-Modules

| ID | Sub-Module | Description |
|----|-----------|-------------|
| A | Image Capture & Upload | Drag-drop or click to upload a document photo (JPG/PNG, max 10MB) with validation |
| B | AI OCR Digitization | Gemini vision OCR retypes the document same-to-same, preserving formatting and content |
| C | Output, Edit & Save | English/Urdu output toggle, post-extraction edit and preview, auto-save to My Documents |

---

## User Stories

| ID | User Story | Priority |
|----|-----------|---------|
| US-10-01 | As a lawyer, I want to upload a photo of a document by drag-drop or click (JPG/PNG, max 10MB) so that I can digitize paper documents | Must Have |
| US-10-02 | As a lawyer, I want the AI to type out the document text exactly as shown — same-to-same, not summarized — so that the digital copy faithfully matches the original | Must Have |
| US-10-03 | As a lawyer, I want to choose whether the output is in English or Urdu so that the typed document matches the language I need | Must Have |
| US-10-04 | As a lawyer, I want the generated document to auto-save to My Documents so that I don't lose my work and can find it later | Must Have |
| US-10-05 | As a lawyer, I want to edit and preview the extracted text after generation so that I can correct any OCR errors before using it | Must Have |

---

## Acceptance Criteria

| # | Criteria | Status |
|---|----------|--------|
| AC-01 | Upload zone accepts drag-drop and click-to-browse for document images | [x] |
| AC-02 | Only JPG/PNG files accepted; other file types rejected with a clear message | [x] |
| AC-03 | Files larger than 10MB rejected with a size-limit message | [x] |
| AC-04 | AI performs OCR and reproduces the document text exactly as shown, preserving formatting and content (same-to-same, not summarized) | [x] |
| AC-05 | Output language toggle switches the generated text between English and Urdu | [x] |
| AC-06 | Generated document auto-saves to "My Documents" without a manual save step | [x] |
| AC-07 | After generation, the extracted text can be edited inline and previewed | [x] |
| AC-08 | Extraction completes via `POST /api/ai/extract-document` (Gemini vision/OCR) | [x] |

---

## Success Metrics

| Metric | Target | How to Measure |
|--------|--------|---------------|
| OCR same-to-same fidelity | Lawyer confirms output matches original | Manual review on sample documents |
| Time to digitize one page | < 30 seconds | UX timing in beta testing |
| Upload success rate | > 95% | Error logs |
| Auto-save reliability | 100% of generated docs land in My Documents | Document library audit |
| Daily active use (documents digitized) | Track in analytics | Dashboard analytics |

---

## Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| OCR misreads handwriting or poor-quality photos | Medium | Medium | Post-extraction edit mode lets lawyer fix errors before saving/using |
| AI summarizes instead of reproducing text | Medium | High | Prompt enforces literal same-to-same retyping; no paraphrasing allowed |
| Large image uploads slow or fail | Low | Medium | 10MB size cap enforced client-side before upload |
| Urdu output rendering issues (RTL/script) | Low | Medium | Reuse existing Urdu rendering used elsewhere in the app |

---

## Technical Notes

| Component | Detail |
|-----------|--------|
| Route | `/copy-from-photo` (dashboard segment) |
| API | `POST /api/ai/extract-document` — Gemini vision/OCR extraction |
| Skill | LEGAL-10 (Document OCR) |
| Reused component | `ImageUploadTyping` — shared upload + typing UI |
| Reused API | Same `extract-document` endpoint used by the drafting OCR flow |
| Output languages | English / Urdu toggle |
| Persistence | Auto-save to "My Documents" document library |
| Validation | Client-side file type (JPG/PNG) and size (max 10MB) checks |

---

## Definition of Done

| # | Condition |
|---|-----------|
| 1 | All User Stories (US-10-01 to US-10-05) implemented and merged |
| 2 | All Acceptance Criteria (AC-01 to AC-08) verified and checked off |
| 3 | Image upload (drag-drop + click) with type/size validation working |
| 4 | OCR same-to-same extraction tested on real document photos |
| 5 | English/Urdu output toggle working |
| 6 | Auto-save to My Documents confirmed |
| 7 | Post-extraction edit and preview working |
| 8 | Abdullah has reviewed and signed off |

---

## Out of Scope

| Feature | Reason |
|---------|--------|
| PDF upload for OCR | This segment is photo/image-first; PDF handling is covered elsewhere |
| Multi-page batch digitization | v1.5 — single image per run for now |
| AI summarization or rewriting of the document | Deliberately excluded — output must be same-to-same |
| Translation of the extracted content | Output toggle is language of typing, not translation of meaning |

---

## Dependencies

| Dependency | Why Needed |
|-----------|-----------|
| `POST /api/ai/extract-document` | Performs the Gemini vision OCR extraction |
| `ImageUploadTyping` component | Provides the upload + typing UI reused by this segment |
| My Documents library | Target for auto-save of generated documents |
| Auth System | Documents scoped per logged-in lawyer |
| Abdullah UX validation | Confirm same-to-same fidelity matches real document needs |

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-06-19 | Hamza | Initial epic documented from built feature |
