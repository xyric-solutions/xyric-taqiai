---
id: NS-002
title: Implement Stamp Paper Print Feature
story_ids: [S01-10]
status: completed
priority: P0
created: 2026-05-04
completed: 2026-06-19
---

# NS-002 — Implement Stamp Paper Print Feature

## Objective

Implement "Stamp Paper Print" in `DocumentPreview.tsx` with:
- Page 1 top margin: **4.5 inches** (default) — **manually editable** (e.g. user types 3.2 or 5.0)
- Page 2+ top margin: **1.0 inch** (default) — **manually editable** (e.g. user types 0.5 or 1.5)
- Settings panel with two number inputs, each independently changeable
- Both values convert from inches to mm before applying to CSS `@page` rules

## Implementation Plan

### Step 1 — Add State (`DocumentPreview.tsx`)

```tsx
const [stampPrintOpen, setStampPrintOpen] = useState(false);
const [stampPage1Top, setStampPage1Top] = useState("4.5");
const [stampPage2Top, setStampPage2Top] = useState("1.0");
```

### Step 2 — Stamp Paper Print Button

In the header actions, alongside the existing Print button:

```tsx
<Button variant="outline" size="sm" onClick={() => setStampPrintOpen(true)}>
  <Stamp className="h-3.5 w-3.5" /> Stamp Paper
</Button>
```

### Step 3 — Settings Panel (Modal/Slide-in)

```tsx
{stampPrintOpen && (
  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-3">
    <h3>🖨️ Stamp Paper Print Settings</h3>
    
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label>Page 1 Top Margin (inches)</label>
        <input 
          type="number" 
          step="0.1" 
          value={stampPage1Top}
          onChange={(e) => setStampPage1Top(e.target.value)}
        />
        <p className="text-xs text-slate-500">
          Default 4.5" — for the stamp header
        </p>
      </div>
      <div>
        <label>Page 2+ Top Margin (inches)</label>
        <input 
          type="number" 
          step="0.1"
          value={stampPage2Top}
          onChange={(e) => setStampPage2Top(e.target.value)}
        />
        <p className="text-xs text-slate-500">
          Default 1.0" — normal margin
        </p>
      </div>
    </div>

    <div className="flex gap-2">
      <Button onClick={handleStampPrint}>🖨️ Print Now</Button>
      <Button variant="outline" onClick={() => setStampPrintOpen(false)}>Cancel</Button>
    </div>
  </div>
)}
```

### Step 4 — `handleStampPrint()` Function

```tsx
const handleStampPrint = () => {
  const p1TopMm = (parseFloat(stampPage1Top) * 25.4).toFixed(1); // inches to mm
  const p2TopMm = (parseFloat(stampPage2Top) * 25.4).toFixed(1);
  
  const isUrdu = language === "ur";
  const stampHtml = `<!DOCTYPE html>
<html dir="${isUrdu ? "rtl" : "ltr"}">
<head>
  <title>${title} — Stamp Paper</title>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400;700&display=swap" rel="stylesheet">
  <style>
    @page :first {
      margin-top: ${p1TopMm}mm;
      margin-left: 20mm;
      margin-right: 20mm;
      margin-bottom: 20mm;
    }
    @page {
      margin-top: ${p2TopMm}mm;
      margin-left: 20mm;
      margin-right: 20mm;
      margin-bottom: 20mm;
    }
    body {
      font-family: ${isUrdu ? "'Noto Nastaliq Urdu', serif" : "'Times New Roman', serif"};
      font-size: ${isUrdu ? "16pt" : "13pt"};
      line-height: ${isUrdu ? "2.8" : "1.8"};
      color: #000;
      margin: 0;
      padding: 0;
    }
    /* All other styles same as standard print */
  </style>
</head>
<body>
  ${currentContent}
  <script>
    window.onload = function() {
      window.print();
      window.onafterprint = function() { window.close(); }
    }
  </script>
</body>
</html>`;

  const pw = window.open("", "_blank");
  if (!pw) return;
  pw.document.write(stampHtml);
  pw.document.close();
  setStampPrintOpen(false);
};
```

## Files to Modify

```
src/components/documents/DocumentPreview.tsx
```

## Lucide Icon

Use the `Stamp` icon from lucide-react (if available); otherwise use `FileText` or `Printer` with the label "Stamp Paper".

## Testing Checklist

- [x] Button is visible in DocumentPreview
- [x] Settings panel opens/closes
- [x] Default values are 4.5 and 1.0
- [x] User can change the values
- [x] Print dialog opens
- [x] Page 1 has 4.5" of blank space at the top (verified visually)
- [x] Page 2 has the normal margin
- [x] Urdu document also prints correctly
- [x] Existing Print + Download PDF buttons are not broken

## Definition of Done

- Feature works on all drafting pages
- No regression on existing print/download
- Tested with both English and Urdu documents
