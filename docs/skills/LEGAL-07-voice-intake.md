---
id: LEGAL-07
name: Voice Intake & Transcription
category: legal-ai
version: 1.0
status: Active
module: Voice Intake (AI Advisor · Smart Draft · Document Drafting)
lawyer_facing: true
owner: Abdullah
last_updated: 2026-06-02
---

# LEGAL-07 — Voice Intake & Transcription

> **Multimodal intake skill.** Convert a spoken legal recording (lawyer or client) into faithful, verbatim text in the original language spoken — so it can feed the Advisor, Drafting Engine, or Case Analyzer. Transcribe only; never translate, never summarize.

Implemented by: `POST /api/ai/voice-transcribe` (with speaker role) and `POST /api/ai/voice`.

---

## When to Activate

| Trigger | Example |
|---------|---------|
| User taps the mic in AI Advisor | Client dictates "mera bhai ne meri zameen pe qabza kar liya hai" |
| Voice note attached to a drafting request | Lawyer records the case facts instead of typing |
| Client-intake recording uploaded | Office staff record the client's statement for later drafting |

Do NOT activate when:
- The user typed the text → no transcription needed
- The user wants the recording **translated** → transcribe first (this skill), then route to LEGAL-09
- The user wants a summary/analysis → transcribe first, then route to LEGAL-04 / LEGAL-01

---

## Inputs

| Input | Required | Notes |
|-------|----------|-------|
| Audio file (webm/mp3/m4a) or base64 audio | Yes | Sent as multipart form or inline base64 |
| Speaker role (`lawyer` \| `client`) | No | Shifts the transcription register; default `client` |

---

## Process / Method

1. Accept the audio as multimodal input to the Gemini model.
2. Detect the spoken language(s) automatically — **English, Urdu (script), Roman Urdu, or mixed/code-switched**.
3. Transcribe **word by word**, preserving the original language exactly:
   - Urdu script stays Urdu script.
   - Roman Urdu stays Roman Urdu (do not "correct" it into Urdu script).
   - English stays English. Mixed stays mixed.
4. Preserve names, places, CNIC numbers, dates, and amounts exactly as heard.
5. Mark genuinely inaudible segments rather than inventing words.
6. Return clean text only — no commentary, no formatting wrappers.

---

## Outputs

- A verbatim transcription string in the original language(s).
- Speaker role echoed back when provided.
- No translation, no summary, no added punctuation beyond what aids readability.

---

## Quality Criteria

| Criterion | Threshold |
|-----------|-----------|
| Word-level transcription accuracy (clear audio) | > 90% |
| Language preservation (no unwanted translation) | 100% |
| Hallucinated / invented words | < 2% |
| Proper-noun & number fidelity | > 95% |
| Response time (P95, ≤2 min clip) | < 15 seconds |

---

## Pakistani Legal Context

- **Heavy code-switching is the norm** — a single sentence often mixes Urdu, English legal terms, and Roman Urdu. Do not normalize it; capture it as spoken.
- **Regional accents & languages** — speakers may carry Punjabi, Pashto, Sindhi, or Saraiki influence. Transcribe the intended words; flag, don't guess.
- **Legal/registry vocabulary to recognize:** Khewat, Khatooni, Muhaida Bae, Fard, Intiqal, Vakalatnama, FIR, zamanat (bail), qabza (possession), nikah, talaq, khula, jirga.
- **Numbers matter** — CNIC (xxxxx-xxxxxxx-x), case numbers, land area (kanal/marla), and amounts must be captured precisely; they flow downstream into drafts.

---

## Example

**Input:** client audio (Roman Urdu + English).

**LEGAL-07 output:**
> Sir mera masla ye hai ke mere partner ne hamari company ke account se 15 lakh rupees withdraw kar liye without my permission, aur ab wo cheque bhi bounce ho gaya hai. Mujhe 489-F ka case karna hai.

(Returned verbatim — not translated, not summarized.)

---

## Anti-patterns (what this skill must NEVER do)

- ❌ Translate the audio (that is LEGAL-09's job)
- ❌ Summarize or paraphrase ("client says he has a property dispute")
- ❌ "Clean up" Roman Urdu into formal Urdu script
- ❌ Invent words to fill unclear audio — flag instead
- ❌ Alter or "fix" names, CNIC numbers, dates, or amounts
- ❌ Add legal analysis or section suggestions (downstream skills do that)

---

## Validation

- Golden set of Pakistani lawyer/client recordings (mixed-language) with reference transcripts — must hit 90%+ word accuracy.
- Spot-check that numbers and proper nouns survive intact end-to-end into a generated draft.
- Any systematic mis-transcription of a legal term → add to a domain glossary prompt hint.
