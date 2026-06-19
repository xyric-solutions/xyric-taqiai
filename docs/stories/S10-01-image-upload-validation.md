---
id: S10-01
epic: EPIC-10
title: Document Image Upload (Drag-Drop + Validation)
status: Done
priority: P0
created: 2026-06-19
---

# S10-01 — Document Image Upload (Drag-Drop + Validation)

## User Story

As a lawyer, I want to upload a photo of a document by drag-drop or click (JPG/PNG, max 10MB) so that I can digitize paper documents quickly.

## Acceptance Criteria

- [x] Upload zone accepts both drag-drop and click-to-browse
- [x] Only JPG and PNG image files are accepted
- [x] Non-image file types are rejected with a clear message
- [x] Files larger than 10MB are rejected with a size-limit message
- [x] Selected image is previewed before extraction starts

## Technical Notes

- Route: `/copy-from-photo`
- Reuses the `ImageUploadTyping` component for the upload UI
- Client-side validation of file type (JPG/PNG) and size (max 10MB) before any API call
- Skill spec: LEGAL-10 (Document OCR)

## Definition of Done

- [x] Drag-drop and click upload both working
- [x] Type and size validation enforced client-side
- [x] Invalid uploads show a clear error message
- [x] Abdullah sign-off
