# TaqiAI — Design System

## Theme

**Default:** Dark mode  
**Toggle:** Topbar sun/moon icon + Settings → Appearance  
**Persistence:** localStorage + user profile (syncs across devices)

---

## Color Palette

### Strategy: Restrained (Dark)
Tinted neutrals + amber orange as single accent. Navy-black base with warm undertones.

### Dark Theme

```
bg-base        #080c10   Page background (navy-black)
bg-surface-1   #0d1318   Cards, sidebar panels
bg-surface-2   #131a22   Elevated cards, dropdowns
bg-surface-3   #1a2230   Hover states, selected rows
bg-surface-4   #212d3d   Focus highlights, active nav items

border-subtle   #1e2a38  Dividers, card borders
border-default  #2a3a4d  Most borders
border-strong   #3a4f68  Active/focused borders
border-accent   #f97316  Primary accent borders

text-primary    #e8edf2  Headings, primary labels
text-secondary  #8fa3b8  Subtext, captions, metadata
text-tertiary   #4d6278  Placeholders, disabled text
text-inverse    #080c10  Text on light/accent backgrounds
```

### Light Theme

```
bg-base        #f8f9fa   Page background (warm white)
bg-surface-1   #ffffff   Cards, sidebar panels
bg-surface-2   #f1f3f5   Elevated cards, dropdowns
bg-surface-3   #e9ecef   Hover states, selected rows
bg-surface-4   #dee2e6   Focus highlights, active nav items

border-subtle   #e9ecef
border-default  #dee2e6
border-strong   #ced4da
border-accent   #f97316  (same as dark)

text-primary    #0d1318
text-secondary  #495057
text-tertiary   #868e96
text-inverse    #f8f9fa
```

### Brand Colors

```
primary-500   #f97316   PRIMARY (buttons, links, highlights) — Amber Orange
primary-600   #ea6c0d   Hover
primary-700   #c2550c   Pressed

info-500      #3b82f6   Secondary actions
info-400      #60a5fa   Lighter variant

success-500   #10b981   Completed, verified, saved
warning-500   #f59e0b   Caution, pending, review
danger-500    #ef4444   Errors, destructive actions

ai-500        #a78bfa   AI-generated content (violet)
ai-bg         #1a1430   AI content background tint
```

### Practice Area Colors

```
criminal-law   #ef4444   Red
family-law     #ec4899   Pink
property-law   #f59e0b   Amber
civil-law      #3b82f6   Blue
corporate-law  #8b5cf6   Purple
constitutional #06b6d4   Cyan
tax-law        #10b981   Emerald
immigration    #f97316   Orange
affidavits     #84cc16   Lime
agreements     #14b8a6   Teal
applications   #f97316   Orange
non-muslim     #6366f1   Indigo
```

### Gradients

```
gradient-primary   linear-gradient(135deg, #f97316 0%, #ea580c 100%)
gradient-ai        linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)
gradient-surface   linear-gradient(180deg, #0d1318 0%, #080c10 100%)
gradient-glow      radial-gradient(ellipse at top, rgba(249,115,22,0.08) 0%, transparent 60%)
```

---

## Typography

### Font Families

```
English:  'Inter', system-ui, sans-serif
Mono:     'JetBrains Mono', 'Fira Code', monospace
Urdu:     'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif
```

### Type Scale

```
text-2xs   10px / 1.4   Timestamps, labels, tiny metadata
text-xs    11px / 1.4   Helper text, tags, badges
text-sm    13px / 1.5   Body text (most UI)
text-base  14px / 1.6   Default readable content
text-md    15px / 1.6   Emphasized body
text-lg    17px / 1.5   Section headings
text-xl    20px / 1.4   Page sub-headings
text-2xl   24px / 1.3   Page headings
text-3xl   30px / 1.2   Hero headings
text-4xl   36px / 1.15  Landing page hero
text-5xl   48px / 1.1   Large display text
```

### Font Weights

```
400   Body, metadata
500   Labels, tags, nav items
600   Section headings, button text
700   Page headings, emphasis
800   Hero text, display numbers
```

### Urdu Rules

```
font-family:  'Noto Nastaliq Urdu', serif
font-size:    15px body / 18px heading
line-height:  2.8 body / 2.4 heading / 3.2 legal documents
direction:    rtl
text-align:   right
```

---

## Spacing

```
2px / 4px / 6px / 8px / 12px / 16px / 20px / 24px / 32px / 40px / 48px / 64px / 80px / 96px
```

## Border Radius

```
4px    Tags, badges
6px    Inputs, small buttons
8px    Cards, panels
12px   Modals, large cards
16px   Featured sections
9999px Pills, avatars
```

---

## Layout

### App Shell

```
Topbar:          56px fixed, z-50, bg-base, border-b border-subtle
Sidebar:         240px (collapsed: 64px), bg-surface-1, border-r border-subtle
Content area:    flex-1, overflow-y-auto
Page header:     56px sticky top-14, z-40
Content padding: px-6 py-6, max-w-screen-xl mx-auto
```

### Responsive Breakpoints

```
Desktop  ≥1280px   Sidebar visible (240px), content max-w 1200px
Tablet   768-1279  Sidebar hidden (drawer), content full-width, padding 20px
Mobile   <768px    Bottom nav or hamburger, 1-column grid, padding 16px
```

---

## Components

### Buttons

```
Primary:    bg-primary-500, text-white, 13px semibold, h-36px px-16px radius-6px
            hover: primary-600 + scale(1.02) / active: primary-700 + scale(0.98)

Secondary:  transparent, border border-default, text-primary
            hover: bg-surface-3

Ghost:      transparent, no border, text-secondary
            hover: bg-surface-2 text-primary

Danger:     transparent, border danger-500, text-danger-500
            hover: bg danger-bg

AI Button:  gradient-ai background, text-white, glow box-shadow rgba(124,58,237,0.3)
            Left icon: sparkles or bot

Icon Button: 36x36px (sm: 28px / lg: 44px), radius-md
             hover: bg-surface-2
```

### Cards

```
Default:    bg-surface-1, border border-subtle, radius-8px, padding 20px
            hover (clickable): border-default + shadow + translateY(-1px)

Featured:   bg-surface-1, border primary-500 20% opacity, left border 3px primary-500

AI Output:  bg ai-bg, border rgba(167,139,250,0.25), header stripe gradient-ai 20%
            "AI Generated" violet pill badge top-right

Stat:       bg-surface-1, border border-subtle, padding 20px 24px
            Number: 32px extrabold / Label: 12px medium / Icon: 24px top-right
```

### Inputs

```
Text input:   bg-surface-2, border border-default, radius-6px, h-38px, px-12px
              focus: border-strong + ring primary-500 1px
              error: border-danger-500

Textarea:     same as input, min-h 120px, resize vertical

Select:       same border/bg, chevron right-aligned
              dropdown: bg-surface-2, shadow 0 8px 32px rgba(0,0,0,0.4)

Search:       bg-surface-1, border border-subtle, search icon left, h-38px

Label:        12px medium text-secondary, mb-6px
```

### Sidebar Navigation

```
Nav group label:  text-2xs uppercase tracking-wide text-tertiary, mt-24px
Nav item:         h-36px, radius-6px, px-8px, gap-10px (icon + label), 13px medium
                  default: text-secondary transparent
                  hover: text-primary bg-surface-3
                  active: text-primary-500 bg-surface-3 + left border 2px primary-500
Nav sub-item:     h-32px, pl-32px, 12px medium
```

### AI Chat

```
User bubble:   right-aligned, bg-surface-3, border border-default, max-w 75%
               radius-lg top-right:radius-sm, padding 12px 16px

AI bubble:     left-aligned, bg ai-bg, border rgba(167,139,250,0.2), max-w 85%
               radius-lg top-left:radius-sm, padding 16px 20px
               header: "TaqiAI" + bot icon, text-ai-500, text-xs
               citation block at bottom: bg-surface-3, border border-strong

Chat input:    bg-surface-1, border border-default, radius-xl, padding 12px 16px
               min-h 48px, max-h 160px (auto-grow)
               right actions: mic + send (primary)
```

### Toasts / Notifications

```
Position:   bottom-right, 16px from edge
Width:      360px
Left accent 4px: success=green / warning=amber / error=red / info=blue
Auto-dismiss: 5s (success/info)
Animation:  slide-in from right, fade-out
```

### Loading States

```
Skeleton:  bg-surface-2, shimmer gradient sweep 1.5s infinite
Spinner:   primary-500, 2px border, spin 0.7s linear
AI typing: 3 violet dots, bounce stagger 0.15s, "TaqiAI is thinking..." italic
```

### Modals

```
Overlay:   rgba(8,12,16,0.8) backdrop
Container: bg-surface-2, radius-12px, border-default, padding 28px
Max-width: 640px default / 480px sm / 800px lg
Animation: scale(0.95)→scale(1), 150ms ease-out
```

---

## Icons

**Library:** lucide-react  
**Stroke width:** always 1.5 (not default 2 — too heavy for dark UI)  
**Gap with label:** always 8px (gap-2)  
**Active:** text-primary-500  
**Inactive:** text-secondary  

---

## Motion

```
Duration:   150ms micro / 200ms standard / 300ms enter / 200ms exit
Easing:     ease-out-quart for enters, ease-in-quart for exits
```

Do not animate CSS layout properties. No bounce, no elastic easing.
