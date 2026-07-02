---
id: NS-003
title: Court Cases — AI Edit & Improved PDF Print
story_ids: [S02-09]
status: completed
priority: P2
created: 2026-05-04
completed: 2026-06-19
---

# NS-003 — Court Cases: AI Edit & Improved PDF Print

## Objective

In `court-cases/page.tsx`:
1. Add an AI Edit button + panel
2. Improve the PDF print output (proper court formatting)

## Implementation Plan

### Step 1 — Add AI Edit State

```tsx
const [aiEditMode, setAiEditMode] = useState(false);
const [aiInstruction, setAiInstruction] = useState("");
const [aiEditing, setAiEditing] = useState(false);
const [aiEditError, setAiEditError] = useState("");
```

### Step 2 — AI Edit Button (in the Output Panel action bar)

Alongside the existing action buttons:
```tsx
<button onClick={() => setAiEditMode(true)} className="...bg-purple-50 text-purple-700...">
  <Sparkles className="h-3.5 w-3.5" /> AI Edit
</button>
```

### Step 3 — AI Edit Panel (above the Output Panel)

```tsx
{aiEditMode && (
  <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-4 space-y-3">
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-purple-600" />
        AI Edit
      </h3>
      <button onClick={() => setAiEditMode(false)}>
        <X className="h-4 w-4" />
      </button>
    </div>

    <textarea
      value={aiInstruction}
      onChange={(e) => setAiInstruction(e.target.value)}
      placeholder="Example:
- Change the petitioner's name to Ahmad Ali
- Add Section 497 CrPC to the bail section
- Add another relief to the prayer clause"
      rows={3}
      className="w-full border rounded-lg px-3 py-2 text-sm"
    />

    {/* Quick suggestions */}
    <div className="flex flex-wrap gap-1.5">
      {["Change name", "Add clause", "Add law section", "Shorten", "Fix date"].map(s => (
        <button key={s} onClick={() => setAiInstruction(s)} className="px-2 py-1 text-xs rounded-full bg-white border">
          {s}
        </button>
      ))}
    </div>

    {aiEditError && <p className="text-xs text-red-600">{aiEditError}</p>}

    <div className="flex gap-2">
      <Button onClick={handleAiEdit} loading={aiEditing} disabled={!aiInstruction.trim()}>
        <Sparkles className="h-4 w-4" />
        {aiEditing ? "AI is editing..." : "Apply AI Edit"}
      </Button>
      <Button variant="outline" onClick={() => setAiEditMode(false)}>Cancel</Button>
    </div>
  </div>
)}
```

### Step 4 — `handleAiEdit()` Function

```tsx
const handleAiEdit = async () => {
  if (!aiInstruction.trim()) return;
  setAiEditing(true);
  setAiEditError("");
  try {
    const res = await fetch("/api/ai/edit-document", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentContent: aiResponse,  // plain text or HTML
        editInstruction: aiInstruction,
        language,
      }),
    });
    if (!res.ok) throw new Error("Edit failed");
    const data = await res.json();
    setAiResponse(data.html || data.response);
    setAiInstruction("");
    setAiEditMode(false);
  } catch (err) {
    setAiEditError("AI edit failed. Please try again.");
  } finally {
    setAiEditing(false);
  }
};
```

### Step 5 — Improved PDF Print Function

Replace the existing `handleDownloadPDF()`:

```tsx
const handleDownloadPDF = () => {
  const content = isEditing ? editedDraft : aiResponse;
  const docLabel = documentTypes.find(d => d.value === documentType)?.label || "Legal Document";
  
  // Convert plain text to formatted HTML
  const formattedLines = content.split("\n").map((line) => {
    const trimmed = line.trim();
    if (!trimmed) return "<div style='height:8px'></div>";
    // ALL CAPS line → bold centered heading
    if (trimmed === trimmed.toUpperCase() && trimmed.length > 3 && /[A-Z]/.test(trimmed)) {
      return `<p style="text-align:center;font-weight:bold;font-size:14pt;margin:12px 0">${trimmed}</p>`;
    }
    // **bold** markers
    const withBold = trimmed.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    // Numbered paragraphs
    if (/^\d+[\.\)]/.test(trimmed)) {
      return `<p style="margin-left:20px;margin-bottom:8px;text-align:justify">${withBold}</p>`;
    }
    return `<p style="margin-bottom:8px;text-align:justify">${withBold}</p>`;
  }).join("");

  const printWindow = window.open("", "_blank");
  if (!printWindow) return;
  printWindow.document.write(`<!DOCTYPE html>
<html>
<head>
  <title>${docLabel}</title>
  <style>
    @page { size: A4; margin: 25mm 20mm; }
    body {
      font-family: 'Times New Roman', Georgia, serif;
      font-size: 13pt;
      line-height: 1.8;
      color: #000;
      max-width: 210mm;
      margin: 0 auto;
    }
    @media print { body { padding: 0; } }
  </style>
</head>
<body>
  ${formattedLines}
  <script>
    window.onload = function() {
      window.print();
      window.onafterprint = function() { window.close(); }
    }
  </script>
</body>
</html>`);
  printWindow.document.close();
};
```

## Files to Modify

```
src/app/(dashboard)/court-cases/page.tsx
```

## Testing Checklist

- [x] "AI Edit" button is visible in the output panel
- [x] AI Edit panel opens/closes
- [x] Instructions are accepted
- [x] Clicking a quick suggestion puts text into the instruction field
- [x] After applying an AI Edit, the draft updates
- [x] Manual edit (textarea) works as before
- [x] Download PDF produces formatted output
- [x] ALL CAPS lines are bold and centered in the PDF
- [x] Numbered paragraphs are formatted properly
- [x] The Print button also produces the same formatted output

## Definition of Done

- AI Edit functional
- Improved PDF print with proper court formatting
- No regression on existing features
