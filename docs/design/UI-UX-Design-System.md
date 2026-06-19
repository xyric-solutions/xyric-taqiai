# TaqiAI — UI/UX Design System
**Version:** 1.1  
**Date:** 2026-05-14  
**Status:** Reference Document  
**Tagline:** "Your Legal Mind, Amplified"

> **v1.1 Updates:** Landing page fully restructured (10 sections), Harvey.ai competitive analysis added, pricing tiers added, demo section decision documented, static document sample approach defined.

---

## Table of Contents

1. [Design Philosophy](#1-design-philosophy)
2. [Color System](#2-color-system)
3. [Typography](#3-typography)
4. [Spacing & Grid](#4-spacing--grid)
5. [Iconography](#5-iconography)
6. [Component Library](#6-component-library)
7. [Layout Architecture](#7-layout-architecture)
8. [Page Specifications](#8-page-specifications)
9. [Interaction Patterns](#9-interaction-patterns)
10. [Urdu / Bilingual Design](#10-urdu--bilingual-design)
11. [Responsive Design](#11-responsive-design)
12. [Dark Theme Tokens](#12-dark-theme-tokens)
13. [Appendix A: Design Checklist](#appendix-a-design-checklist)
14. [Appendix B: Pages Inventory](#appendix-b-pages-inventory)
15. [Appendix C: Competitive Positioning](#appendix-c-competitive-positioning)
16. [Appendix D: Key Design Decisions](#appendix-d-key-design-decisions)

---

## 1. Design Philosophy

### 1.1 Core Principles

**Authority** — The interface must feel like a tool a senior advocate trusts. No playful gradients, no cartoon illustrations. Clean, confident, precise.

**Speed** — Pakistani lawyers are busy. The UI must surface the most-used actions within 1 click of the dashboard. Every interaction should feel instant.

**Clarity Over Density** — Legal content is already dense. The UI must provide relief: whitespace, clear hierarchy, breathing room between elements.

**Bilingual by Default** — Urdu and English coexist naturally. Neither language feels like a secondary citizen.

**Accuracy Trust Signals** — The app deals with legal documents. Every AI output must visually communicate "reviewed by AI — verify before filing." Trust is built through transparency, not overconfidence.

### 1.2 Design Persona

> "A premium leather-bound law journal — dark, structured, authoritative — but with the speed and intelligence of a modern AI terminal."

**What it should feel like:**  
Linear (for speed) × Notion (for content clarity) × a Lahore High Court chamber (for authority)

**What it should NOT feel like:**  
A government portal · A consumer chat app · A US-market legal tool with Pakistani branding

### 1.3 Emotional Design Goals

| When user does this... | They should feel... |
|------------------------|---------------------|
| Opens the dashboard | In control, informed, powerful |
| Starts AI drafting | Like they have a senior colleague |
| Reads an AI output | Confident it's grounded in Pakistani law |
| Searches case law | Like a research tool, not a search engine |
| Sees Urdu content | At home, not like a translation afterthought |

---

## 2. Color System

### 2.1 Theme System

TaqiAI supports **both Dark and Light mode**. Default is Dark. User can toggle from the Topbar or Settings page. Preference is saved to localStorage and user profile.

```
Default theme:   Dark
Toggle location: Topbar (sun/moon icon button) + Settings → Appearance
Persistence:     localStorage + user profile (syncs across devices)
System detect:   Optional — respect OS prefers-color-scheme on first visit
```

---

### 2.2 Dark Theme Palette

#### Background Scale
```
bg-base       #080c10    — Page background (navy-black)
bg-surface-1  #0d1318    — Cards, sidebar panels
bg-surface-2  #131a22    — Elevated cards, dropdowns
bg-surface-3  #1a2230    — Hover states, selected rows
bg-surface-4  #212d3d    — Focus highlights, active nav items
```

#### Border Scale
```
border-subtle   #1e2a38    — Dividers, card borders (barely visible)
border-default  #2a3a4d    — Most borders
border-strong   #3a4f68    — Active/focused borders
border-accent   #f97316    — Primary accent borders
```

#### Text Scale
```
text-primary    #e8edf2    — Headings, primary labels
text-secondary  #8fa3b8    — Subtext, captions, metadata
text-tertiary   #4d6278    — Placeholders, disabled text
text-inverse    #080c10    — Text on light/accent backgrounds
```

---

### 2.3 Light Theme Palette

#### Background Scale
```
bg-base       #f8f9fa    — Page background (warm white, not pure white)
bg-surface-1  #ffffff    — Cards, sidebar panels
bg-surface-2  #f1f3f5    — Elevated cards, dropdowns
bg-surface-3  #e9ecef    — Hover states, selected rows
bg-surface-4  #dee2e6    — Focus highlights, active nav items
```

#### Border Scale
```
border-subtle   #e9ecef    — Dividers, card borders (barely visible)
border-default  #dee2e6    — Most borders
border-strong   #ced4da    — Active/focused borders
border-accent   #f97316    — Primary accent borders (same as dark)
```

#### Text Scale
```
text-primary    #0d1318    — Headings, primary labels (dark navy)
text-secondary  #495057    — Subtext, captions, metadata
text-tertiary   #868e96    — Placeholders, disabled text
text-inverse    #f8f9fa    — Text on dark/accent backgrounds
```

#### Light Theme Semantic Colors
```
success-500   #10b981    — Same as dark
success-bg    #ecfdf5    — Light green tint (vs dark's #0d2d22)

warning-500   #f59e0b    — Same as dark
warning-bg    #fffbeb    — Light amber tint

danger-500    #ef4444    — Same as dark
danger-bg     #fef2f2    — Light red tint

ai-500        #7c3aed    — Slightly darker violet (better on light)
ai-bg         #f5f3ff    — Light violet tint
```

#### Light Theme Sidebar
```
Background:   #ffffff
Border-right: 1px solid border-subtle (#e9ecef)
Nav item default:   text-secondary (#495057)
Nav item hover:     bg-surface-2 (#f1f3f5), text-primary
Nav item active:    bg-surface-3 (#e9ecef), text-primary, left border primary-500
Logo area bg:       #ffffff
User area bg:       #f8f9fa
```

### 2.2 Brand Colors

#### Primary — Amber Orange (Brand Accent)
```
primary-50    #fff7ed
primary-100   #ffedd5
primary-200   #fed7aa
primary-300   #fdba74
primary-400   #fb923c
primary-500   #f97316    ← PRIMARY (buttons, links, highlights)
primary-600   #ea6c0d    ← Hover state
primary-700   #c2550c    ← Pressed state
primary-800   #9a3f0a
primary-900   #7c3308
```

#### Secondary — Steel Blue (Information, Links)
```
info-400      #60a5fa
info-500      #3b82f6    ← Secondary actions
info-600      #2563eb    ← Hover
```

#### Semantic Colors
```
success-500   #10b981    ← Completed, verified, saved
success-bg    #0d2d22    ← Success background tint

warning-500   #f59e0b    ← Caution, pending, review needed
warning-bg    #2d1f0d    ← Warning background tint

danger-500    #ef4444    ← Errors, destructive actions
danger-bg     #2d1010    ← Error background tint

ai-500        #a78bfa    ← AI-generated content markers (violet)
ai-bg         #1a1430    ← AI content background tint
```

### 2.3 Legal Area Colors

Each legal practice area has a distinct accent used for icons, category badges, and navigation highlights:

```
criminal-law      #ef4444    Red
family-law        #ec4899    Pink
property-law      #f59e0b    Amber
civil-lawrgb(63, 131, 240)    Blue
corporate-law     #8b5cf6    Purple
constitutional    #06b6d4    Cyan
tax-law           #10b981    Emerald
immigration       #f97316    Orange
non-muslim        #6366f1    Indigo
affidavits        #84cc16    Lime
agreements        #14b8a6    Teal
applications      #f97316    Orange (default)
```

### 2.4 Gradients

```
gradient-primary    linear-gradient(135deg, #f97316 0%, #ea580c 100%)
gradient-ai         linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)
gradient-surface    linear-gradient(180deg, #0d1318 0%, #080c10 100%)
gradient-glow       radial-gradient(ellipse at top, rgba(249,115,22,0.08) 0%, transparent 60%)
```

---

## 3. Typography

### 3.1 Font Stack

#### English / Latin Text
```
Primary:   'Inter', system-ui, sans-serif
Mono:      'JetBrains Mono', 'Fira Code', monospace
```

#### Urdu / Nastaliq Text
```
Primary:   'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif
Fallback:  'Mehr Nastaliq', serif
```

### 3.2 Type Scale

```
text-2xs    10px / 1.4    — Timestamps, labels, tiny metadata
text-xs     11px / 1.4    — Helper text, tags, badges
text-sm     13px / 1.5    — Body text (most UI)
text-base   14px / 1.6    — Default readable content
text-md     15px / 1.6    — Emphasized body
text-lg     17px / 1.5    — Section headings
text-xl     20px / 1.4    — Page sub-headings
text-2xl    24px / 1.3    — Page headings
text-3xl    30px / 1.2    — Hero headings
text-4xl    36px / 1.15   — Landing page hero
text-5xl    48px / 1.1    — Large display text
```

### 3.3 Font Weight Scale
```
font-regular    400    — Body, metadata
font-medium     500    — Labels, tags, nav items
font-semibold   600    — Section headings, button text
font-bold       700    — Page headings, emphasis
font-extrabold  800    — Hero text, display numbers
```

### 3.4 Urdu Typography Rules

```
urdu-body:
  font-family: 'Noto Nastaliq Urdu', serif
  font-size: 15px
  line-height: 2.8
  direction: rtl
  text-align: right

urdu-heading:
  font-size: 18px
  line-height: 2.4
  font-weight: 600

urdu-legal-document:
  font-size: 16px
  line-height: 3.2      ← Extra space for Nastaliq descenders
  letter-spacing: 0
```

### 3.5 Hierarchy Examples

| Element | Size | Weight | Color |
|---------|------|--------|-------|
| Page title | 24px | 700 | text-primary |
| Section heading | 17px | 600 | text-primary |
| Card heading | 14px | 600 | text-primary |
| Body text | 13px | 400 | text-secondary |
| Helper / caption | 11px | 400 | text-tertiary |
| Badge text | 10px | 500 | (varies) |
| Sidebar nav | 13px | 500 | text-secondary → text-primary (active) |
| Button text | 13px | 600 | (varies) |

---

## 4. Spacing & Grid

### 4.1 Spacing Tokens
```
space-0.5    2px
space-1      4px
space-1.5    6px
space-2      8px
space-3      12px
space-4      16px
space-5      20px
space-6      24px
space-8      32px
space-10     40px
space-12     48px
space-16     64px
space-20     80px
space-24     96px
```

### 4.2 Border Radius
```
radius-sm      4px     — Tags, badges, inline elements
radius-md      6px     — Inputs, small buttons
radius-lg      8px     — Cards, panels
radius-xl      12px    — Modals, large cards
radius-2xl     16px    — Featured sections
radius-full    9999px  — Pills, avatars, circular buttons
```

### 4.3 Layout Grid

#### Desktop (≥1280px)
```
Sidebar width:       240px (collapsed: 64px)
Content max-width:   1200px
Content padding:     24px (sides)
Content gap:         24px
Column gutter:       16px
```

#### Tablet (768px–1279px)
```
Sidebar:             Hidden (drawer mode)
Content max-width:   100%
Content padding:     20px (sides)
```

#### Mobile (<768px)
```
Sidebar:             Hidden (bottom nav or hamburger drawer)
Content padding:     16px (sides)
Grid:                1 column
```

### 4.4 Content Regions

```
┌─────────────────────────────────────────────┐
│ Topbar (56px fixed)                         │
├────────────┬────────────────────────────────┤
│            │  Page Header (56px)            │
│  Sidebar   │  ───────────────────────────── │
│  (240px)   │  Content Area                  │
│            │  (max-w: 1200px, pad: 24px)    │
│            │                                │
└────────────┴────────────────────────────────┘
```

### 4.5 Card Anatomy
```
Card padding:          20px
Card inner gap:        16px
Card heading margin:   0 0 12px 0
Card section divider:  1px solid border-subtle
```

---

## 5. Iconography

### 5.1 Icon Library
**Primary:** `lucide-react` (already in project)  
**Size scale:**
```
icon-xs    14px    — Inline, badges
icon-sm    16px    — Button icons, form icons
icon-md    18px    — Default nav icons
icon-lg    20px    — Section icons, featured
icon-xl    24px    — Prominent feature icons
icon-2xl   32px    — Empty states, hero icons
icon-3xl   48px    — Large illustrations
```

### 5.2 Icon Usage Rules

- Always use `strokeWidth={1.5}` for all icons (not the default 2 — too heavy for dark UI)
- Never use filled icons next to outline icons in the same group
- Icon + label gap: always 8px (`gap-2`)
- Active nav icons: primary color fill with `text-primary-500`
- Inactive nav icons: `text-text-secondary` (gray)

### 5.3 Legal Area Icons

| Practice Area | Icon (lucide) |
|---------------|---------------|
| Criminal Law | `shield-alert` |
| Family Law | `heart-handshake` |
| Property Law | `building-2` |
| Civil Law | `scale` |
| Corporate Law | `briefcase` |
| Constitutional | `landmark` |
| Tax Law | `calculator` |
| Immigration | `globe-2` |
| Affidavits | `pen-line` |
| Agreements | `handshake` |
| AI Advisor | `bot` |
| Case Law | `book-open` |
| Court Cases | `gavel` |
| Documents | `folder` |
| Chamber | `layout-dashboard` |
| Settings | `settings` |

---

## 6. Component Library

### 6.1 Buttons

#### Primary Button
```
Background:   primary-500 (#f97316)
Text:         white, 13px, semibold
Padding:      8px 16px
Radius:       radius-md (6px)
Height:       36px

Hover:        primary-600, slight scale(1.02)
Active:       primary-700, scale(0.98)
Disabled:     opacity 40%, cursor-not-allowed
Focus:        2px ring primary-500 + 2px offset
```

#### Secondary Button
```
Background:   transparent
Border:       1px solid border-default
Text:         text-primary, 13px, semibold
Padding:      8px 16px
Radius:       radius-md

Hover:        bg-surface-3
Active:       bg-surface-4
```

#### Ghost Button
```
Background:   transparent
Text:         text-secondary, 13px, medium
No border

Hover:        bg-surface-2, text-primary
```

#### Danger Button
```
Background:   transparent
Border:       1px solid danger-500
Text:         danger-500, 13px, semibold

Hover:        danger-bg background
```

#### Icon Button
```
Size:         36x36px (default), 28x28px (sm), 44x44px (lg)
Background:   transparent → bg-surface-2 on hover
Radius:       radius-md
```

#### AI Action Button (Special)
```
Background:   gradient-ai (violet to indigo)
Text:         white, 13px, semibold
Left icon:    sparkles or bot icon
Padding:      8px 20px
Radius:       radius-md
Glow:         subtle box-shadow: 0 0 20px rgba(124,58,237,0.3)
```

### 6.2 Inputs & Forms

#### Text Input
```
Background:       bg-surface-2
Border:           1px solid border-default
Border-radius:    radius-md
Height:           38px
Padding:          8px 12px
Font:             13px, text-primary
Placeholder:      text-tertiary

Focus:            border-strong + ring primary-500 (1px)
Error:            border-danger-500
```

#### Textarea
```
Same as input
Min-height:       120px
Resize:           vertical
```

#### Select / Dropdown
```
Same border/bg as input
Chevron icon right-aligned (text-tertiary)
Options dropdown:
  Background:     bg-surface-2
  Border:         border-default
  Shadow:         0 8px 32px rgba(0,0,0,0.4)
  Item:           14px × 36px, hover bg-surface-3
```

#### Search Input
```
Left icon:        search icon (text-tertiary)
Background:       bg-surface-1
Border:           1px solid border-subtle
Height:           38px
Focus:            border-default + icon text-primary
```

#### Form Label
```
Font:             12px, medium, text-secondary
Margin-bottom:    6px
Optional badge:   "Optional" pill, text-tertiary, text-2xs
```

### 6.3 Cards

#### Default Card
```
Background:       bg-surface-1
Border:           1px solid border-subtle
Border-radius:    radius-lg (8px)
Padding:          20px
Shadow:           none (use border instead)

Hover (clickable):
  Border:         border-default
  Shadow:         0 4px 16px rgba(0,0,0,0.2)
  Transform:      translateY(-1px)
```

#### Featured Card (Primary)
```
Background:       bg-surface-1
Border:           1px solid primary-500 (20% opacity)
Left accent:      3px solid primary-500 left border
Padding:          20px
```

#### AI Output Card
```
Background:       ai-bg
Border:           1px solid rgba(167,139,250,0.25)
Header stripe:    gradient-ai (20% opacity)
AI badge:         Top-right, "AI Generated" violet pill
```

#### Stat Card
```
Background:       bg-surface-1
Border:           1px solid border-subtle
Padding:          20px 24px
Number:           32px, extrabold, text-primary
Label:            12px, medium, text-secondary
Icon:             24px, top-right, text-tertiary
Change badge:     small pill (green = up, red = down)
```

### 6.4 Badges & Tags

#### Status Badge
```
Size:             10px icon + text-xs text, h-5 pill
Border-radius:    radius-full

Active/Success:   success-bg + success-500 text
Pending/Warning:  warning-bg + warning-500 text
Error:            danger-bg + danger-500 text
AI-generated:     ai-bg + ai-500 text
Draft:            bg-surface-2 + text-secondary
```

#### Category Badge
```
Background:       (category color at 15% opacity)
Text:             (category color), text-xs, medium
Border:           1px solid (category color at 30% opacity)
Border-radius:    radius-sm (4px)
Padding:          2px 8px
```

### 6.5 Sidebar Navigation

#### Sidebar Shell
```
Width:            240px
Background:       bg-surface-1
Border-right:     1px solid border-subtle
Padding:          0 12px
Overflow-y:       auto (custom scrollbar)
```

#### Logo Area
```
Height:           56px (matches topbar)
Display:          flex, align-center, gap-3
Logo:             TaqiAI wordmark (24px height)
```

#### Nav Group
```
Label:            text-2xs, uppercase, letter-spacing 0.08em, text-tertiary
Margin-top:       24px
Margin-bottom:    4px
Padding-left:     8px
```

#### Nav Item
```
Height:           36px
Border-radius:    radius-md
Padding:          0 8px
Gap:              10px (icon + label)
Font:             13px, medium

Default:          text-secondary, transparent bg
Hover:            text-primary, bg-surface-3
Active/Selected:  text-primary-500, bg-surface-3, left border 2px primary-500
```

#### Nav Sub-item (Collapsed Group)
```
Height:           32px
Padding-left:     32px (indented)
Font:             12px, medium, text-tertiary → text-secondary hover
```

#### Collapse Toggle
```
Bottom-left of sidebar
Icon:             chevron-left (expanded) / chevron-right (collapsed)
On collapsed:     Show only icons, tooltip on hover
```

### 6.6 Topbar

```
Height:           56px
Background:       bg-base
Border-bottom:    1px solid border-subtle
Padding:          0 24px
Z-index:          50
Position:         sticky top-0

Layout (left → right):
  [Hamburger (mobile)] [Page Title] [Spacer] [Search] [Notifications] [User Avatar]
```

#### Topbar Search
```
Width:            280px desktop, collapsible mobile
Background:       bg-surface-2
Border:           1px solid border-subtle
Border-radius:    radius-md
Height:           34px
Icon:             search-icon left
Shortcut badge:   "Ctrl+K" right (text-tertiary)
```

### 6.7 Modals & Sheets

#### Modal
```
Overlay:          rgba(8,12,16,0.8) backdrop
Container:        bg-surface-2, radius-xl, border-default
Max-width:        640px (default), 480px (sm), 800px (lg)
Padding:          28px
Header:           24px, bold + close button (icon button)
Footer:           flex-row-reverse, gap-3
Animation:        scale(0.95) → scale(1), 150ms ease-out
```

#### Sheet / Drawer (mobile patterns)
```
Position:         fixed right-0
Width:            85vw, max 400px
Background:       bg-surface-1
Border-left:      border-default
Animation:        translateX(100%) → translateX(0), 200ms ease-out
Handle bar:       top center, 32x4px rounded bg-surface-4
```

### 6.8 Tables

```
Table background:   transparent
Header:             bg-surface-2, text-2xs uppercase, text-tertiary, h-10
Row:                h-12, border-bottom border-subtle
Row hover:          bg-surface-2
Cell padding:       12px 16px

Empty state:        Centered, icon-2xl text-tertiary, 13px message
Loading:            Skeleton rows (pulse animation)
```

### 6.9 AI Chat Components

#### Chat Bubble — User
```
Alignment:        right
Background:       bg-surface-3
Border:           1px solid border-default
Border-radius:    radius-lg, top-right: radius-sm
Max-width:        75%
Padding:          12px 16px
Font:             14px, text-primary
```

#### Chat Bubble — AI
```
Alignment:        left
Background:       ai-bg
Border:           1px solid rgba(167,139,250,0.2)
Border-radius:    radius-lg, top-left: radius-sm
Max-width:        85%
Padding:          16px 20px
Font:             14px, text-primary

Header:           "TaqiAI" + bot icon, text-ai-500, text-xs
Citation block:   Separate bordered sub-section at bottom
```

#### Chat Input Area
```
Background:       bg-surface-1
Border:           1px solid border-default
Border-radius:    radius-xl
Padding:          12px 16px
Min-height:       48px
Max-height:       160px (auto-grow)

Actions (right):
  - Voice record button (mic icon)
  - Send button (primary)
```

#### Citation Block (inside AI output)
```
Background:       bg-surface-3
Border:           1px solid border-strong
Border-radius:    radius-md
Padding:          12px 16px
Margin-top:       12px
Header:           "Relevant Citations" + book-open icon, text-xs, semibold
Citation item:    text-xs, text-secondary, bullet style
                  Format: [SCMR 2019 Vol.1 p.234] — Case Name
```

### 6.10 Loading States

#### Skeleton
```
Background:       bg-surface-2
Animation:        shimmer (gradient sweep, 1.5s infinite)
Border-radius:    matches element
```

#### Spinner
```
Size:             16px (sm), 24px (md), 40px (lg)
Color:            primary-500
Border-width:     2px
Animation:        spin 0.7s linear infinite
```

#### AI Typing Indicator
```
Three dots:       bg-ai-500, width 6px, border-radius full
Animation:        bounce with 0.15s stagger
Label:            "TaqiAI is thinking..." text-ai-500, text-xs, italic
```

### 6.11 Empty States

```
Container:        centered, padding 48px
Icon:             32–48px, text-tertiary (relevant lucide icon)
Heading:          16px, semibold, text-secondary
Description:      13px, text-tertiary, max-w: 280px, centered
CTA:              primary button (if applicable)
```

### 6.12 Notifications / Toasts

```
Position:         bottom-right, 16px from edge
Width:            360px
Background:       bg-surface-2
Border:           1px solid border-default
Border-radius:    radius-lg
Padding:          14px 16px
Shadow:           0 8px 32px rgba(0,0,0,0.4)

Left accent border (4px):
  Success:        success-500
  Warning:        warning-500
  Error:          danger-500
  Info:           info-500

Auto-dismiss:     5 seconds (success/info)
Close button:     top-right x icon
Animation:        slide-in from right, fade-out
```

---

## 7. Layout Architecture

### 7.1 App Shell

```
┌─────────────────────────────────────────────────────────┐
│  TOPBAR (h-14, sticky, z-50, bg-base, border-b)        │
├─────────────┬───────────────────────────────────────────┤
│             │                                           │
│  SIDEBAR    │   MAIN CONTENT                           │
│  (w-60,     │   (flex-1, overflow-y-auto)              │
│  sticky,    │                                           │
│  h-screen   │   ┌─────────────────────────────────┐   │
│  overflow-  │   │  PAGE HEADER                    │   │
│  y-auto)    │   │  (h-14, sticky top-14, z-40)    │   │
│             │   ├─────────────────────────────────┤   │
│             │   │  PAGE CONTENT                   │   │
│             │   │  (max-w-screen-xl mx-auto        │   │
│             │   │   px-6 py-6)                    │   │
│             │   └─────────────────────────────────┘   │
└─────────────┴───────────────────────────────────────────┘
```

### 7.2 Sidebar Structure

```
SIDEBAR (w-60)
├── Logo Area (h-14)
│   └── TaqiAI logo + wordmark
│
├── Navigation (flex-1, overflow-y-auto, py-4)
│   ├── [MAIN]
│   │   ├── Dashboard         (home icon)
│   │   └── AI Advisor        (bot icon) ← HIGHLIGHT: most used
│   │
│   ├── [RESEARCH]
│   │   ├── Case Law          (book-open)
│   │   ├── Statute Search    (library)
│   │   └── Legal Research    (search-check)
│   │
│   ├── [DRAFT DOCUMENTS]    ← Collapsible group
│   │   ├── Affidavits        (pen-line)
│   │   ├── Agreements        (handshake)
│   │   ├── Applications      (file-plus)
│   │   ├── Family Law        (heart-handshake)
│   │   ├── Criminal Law      (shield-alert)
│   │   ├── Property Law      (building-2)
│   │   ├── Civil Law         (scale)
│   │   ├── Corporate Law     (briefcase)
│   │   ├── Tax Law           (calculator)
│   │   ├── Immigration       (globe-2)
│   │   ├── Constitutional    (landmark)
│   │   └── Non-Muslim Laws   (users)
│   │
│   ├── [MANAGEMENT]
│   │   ├── My Documents      (folder)
│   │   ├── Court Cases       (gavel)
│   │   ├── Chamber           (layout-dashboard)
│   │   └── Lawyer Diary      (calendar)
│   │
│   └── [TOOLS]
│       ├── Scan Document     (scan)
│       ├── Translate         (languages)
│       └── Tax Calculator    (calculator)
│
└── User Profile Area (h-16, border-t)
    ├── Avatar + Name + Role
    └── Settings link
```

### 7.3 Page Header Pattern

Every page has a consistent page header:
```
┌────────────────────────────────────────────────────┐
│  ← Back (if nested)  │  Page Title   │   Actions  │
│                       │  Sub-label    │  [btn] [btn]│
└────────────────────────────────────────────────────┘
Height: 56px
Background: bg-base (sticky, shows border-b on scroll)
```

---

## 8. Page Specifications

### 8.1 Landing Page

**Purpose:** Convert Pakistani lawyers into registered users  
**Audience:** Lawyers seeing TaqiAI for the first time  
**Design Goal:** Beat Harvey.ai by being warmer, Pakistan-specific, self-serve, and more transparent

> **Competitive Note:** Harvey.ai uses cold blue + enterprise gating ("Request a Demo"). TaqiAI wins with warm orange, Pakistani law specificity, transparent PKR pricing, and direct sign-up. See [Appendix C](#appendix-c-competitive-positioning) for full analysis.

---

#### Section 1: Hero
```
Background:   Full-screen video (Lahore court / legal setting) with dark overlay
              Fallback: gradient bg-base → bg-surface-1 (if video fails)
Overlay:      linear-gradient(180deg, rgba(8,12,16,0.6) 0%, rgba(8,12,16,0.95) 100%)

Layout:       Centered, max-w 800px, py-32

Content:
  - Badge pill:    "Pakistan's First AI Legal Platform"
                   Background: primary-500 at 15% opacity
                   Border: 1px solid primary-500 at 40% opacity
                   Text: primary-400, text-xs, semibold

  - Heading:       "Your Legal Mind, Amplified"
                   Font: 52–60px, extrabold, text-primary
                   Below (Urdu): "آپ کا قانونی ذہن، مضبوط تر"
                   Urdu font: Noto Nastaliq, 28px, text-secondary, RTL

  - Subheading:    20px, text-secondary, max-w 560px, line-height 1.6
                   "Draft court documents, analyze cases, and research
                    Pakistani law — in minutes, not hours."

  - CTAs:          [Get Started Free] (primary button, large: h-44px px-28px)
                   [See How It Works ↓] (ghost button, scroll to section 4)
                   Gap between: 12px

  - Inline trust:  Small text below buttons (text-tertiary, text-xs):
                   "No credit card · Free trial · Works with PPC, CrPC, CPC"

Navigation bar (top):
  - Left:  TaqiAI logo
  - Right: [اردو] language toggle + [Login] + [Get Started] (primary, sm)
```

---

#### Section 2: Pakistani Trust Strip
```
Background:   bg-surface-1
Border-top:   1px solid border-subtle
Border-bottom: 1px solid border-subtle
Padding:      24px 0
Height:       80px

Left label:   "Trusted by lawyers across Pakistan" (text-tertiary, text-xs)

Logos (horizontal row, auto-scroll marquee on mobile):
  - Lahore Bar Association
  - Islamabad Bar Council
  - Karachi Bar Association
  - Sindh High Court Bar
  - Supreme Court Bar Association of Pakistan
  - KPK Bar Council

Style:        Grayscale, 50% opacity → full opacity on hover
              Height: 28px each, max-width: 120px each

NOTE: Do NOT use foreign/enterprise logos (Deutsche Telekom etc.)
      Use only Pakistani legal institutions — locally relevant.
```

---

#### Section 3: Practice Areas Grid
```
Background:   bg-base
Padding:      80px 0
Header:
  - Eyebrow:    "12 Practice Areas" (primary-500, text-xs, uppercase, tracking-wide)
  - Heading:    "Every area of Pakistani law, covered"
  - Sub:        "Civil · Criminal · Family · Property · Corporate · Constitutional · Tax · Immigration"
                (text-secondary, 16px)

Grid:         4-column desktop, 3-column tablet, 2-column mobile
Gap:          16px

Each category card:
  Background:       bg-surface-1
  Border:           1px solid border-subtle
  Border-top:       3px solid (category color)
  Border-radius:    radius-lg
  Padding:          20px
  Hover:            translateY(-2px), border-default, shadow

  Content:
    - Icon:          24px, category color
    - Name (EN):     15px, semibold, text-primary
    - Name (UR):     13px, text-secondary, RTL, Nastaliq
                     e.g. "فوجداری قانون"
    - Count badge:   "24 templates" — text-2xs, text-tertiary
    - Arrow:         → right aligned, text-tertiary → primary on hover
```

| # | English | Urdu | Color | Templates |
|---|---------|------|-------|-----------|
| 1 | Criminal Law | فوجداری قانون | `#ef4444` | 10 |
| 2 | Family Law | خاندانی قانون | `#ec4899` | 15 |
| 3 | Property Law | جائیداد قانون | `#f59e0b` | 10 |
| 4 | Civil Law | دیوانی قانون | `#3b82f6` | 7 |
| 5 | Corporate Law | کارپوریٹ قانون | `#8b5cf6` | 5 |
| 6 | Constitutional | آئینی قانون | `#06b6d4` | 4 |
| 7 | Tax Law | ٹیکس قانون | `#10b981` | 4 |
| 8 | Immigration | امیگریشن | `#f97316` | 5 |
| 9 | Affidavits | حلف نامہ | `#84cc16` | 36 |
| 10 | Agreements | معاہدے | `#14b8a6` | 40+ |
| 11 | Applications | درخواستیں | `#f97316` | 12 |
| 12 | Non-Muslim Laws | غیر مسلم قوانین | `#6366f1` | 16 |

---

#### Section 4: How It Works
```
Background:   bg-surface-1
Padding:      80px 0
Header:
  - Eyebrow:   "Simple Process"
  - Heading:   "From facts to draft in 3 steps"
  - Sub:       "No legal research needed. No hours of typing."

Layout:       3-column horizontal (connected by arrow line)

Step cards:
  Each step:
    - Step number:   Large "01 / 02 / 03", primary-500, 48px, extrabold, opacity 30%
    - Icon:          32px, bg-surface-2, rounded, centered
    - Title:         17px, semibold
    - Description:   13px, text-secondary

Step 01:
  Icon:   file-text
  Title:  "Enter Case Facts"
  Desc:   "Tell TaqiAI the basics — parties, court, charges, or circumstances."

Step 02:
  Icon:   bot (sparkles)
  Title:  "AI Drafts in Seconds"
  Desc:   "Our AI applies Pakistani law — PPC, CrPC, CPC — and drafts your document."

Step 03:
  Icon:   download
  Title:  "Review & Download"
  Desc:   "Edit if needed, then download as PDF or Word — ready for court."

Connector:
  A subtle dashed line (border-dashed, border-surface-3) connecting the 3 steps
  Arrow icon between each step (text-tertiary)
```

---

#### Section 5: Static Document Sample
```
Decision: NO live AI demo on landing page (MVP stage — output quality must be
validated first. A bad live output loses the user permanently.)

Instead: Show a real static sample of TaqiAI output.

Background:   bg-base
Padding:      80px 0
Layout:       2-column (50/50)

Left column (text):
  Eyebrow:    "See the Output"
  Heading:    "A real bail application, drafted by TaqiAI"
  Sub:        "This is an actual AI-generated bail application under Section 302 PPC.
               Abdullah (Senior Advocate) verified it as court-ready."
  Points:
    ✓ Correct PPC + CrPC citations
    ✓ Proper court formatting
    ✓ Plaintiff + defendant arguments
    ✓ Bail jurisprudence from SCMR
  CTA:        [Start Drafting Free] (primary)

Right column (document preview):
  Style:      White/light paper background (exception to dark theme — mimics real document)
  Border:     1px solid border-default
  Border-radius: radius-xl
  Shadow:     0 24px 60px rgba(0,0,0,0.4)
  Padding:    32px
  Content:    Static image or styled HTML of a sample bail application
              Watermark: "SAMPLE — Generated by TaqiAI" (diagonal, 10% opacity)

  Document header:
    IN THE COURT OF SESSION JUDGE LAHORE
    Bail Application
    Under Section 497 CrPC
    In re: [Accused Name] vs State
    FIR No. _____ / 2025

  Highlighted sections:
    - Citations highlighted in primary-500 underline
    - "AI Generated" badge on specific paragraphs

NOTE for future: When AI output quality is validated by Abdullah and tested on
20+ solved cases, replace static sample with interactive live demo.
```

---

#### Section 6: Stats Bar
```
Background:   bg-surface-1
Border-top:   border-subtle
Border-bottom: border-subtle
Padding:      48px 0

4-column grid:

  Stat 1:
    Number:  "170+"
    Label:   "Pakistani Legal Templates"
    Icon:    file-text (text-tertiary)

  Stat 2:
    Number:  "12"
    Label:   "Practice Areas Covered"
    Icon:    scale (text-tertiary)

  Stat 3:
    Number:  "3"
    Label:   "Languages Supported"
    Sub:     "Urdu · English · Roman Urdu"
    Icon:    languages (text-tertiary)

  Stat 4:
    Number:  "24/7"
    Label:   "AI Available — No Waiting"
    Icon:    zap (text-tertiary)

Style:
  Number:    36px, extrabold, text-primary
  Label:     13px, medium, text-secondary
  Sub:       11px, text-tertiary
  Dividers:  1px vertical border-subtle between columns
```

---

#### Section 7: Testimonials
```
Background:   bg-base
Padding:      80px 0
Header:
  Eyebrow:   "From Pakistani Lawyers"
  Heading:   "What advocates are saying"

Layout:      3-column desktop, 1-column (slider) on mobile

Testimonial card:
  Background:     bg-surface-1
  Border:         1px solid border-subtle
  Border-top:     3px solid primary-500
  Border-radius:  radius-lg
  Padding:        24px
  Quote marks:    Large " " in primary-500, 48px, absolute top-left

  Content:
    - Quote text (English):  15px, text-primary, line-height 1.7
    - Quote text (Urdu):     Optional Urdu version below, 13px, text-secondary, RTL
    - Author avatar:         40px circle, initials if no photo
    - Author name:           14px, semibold, text-primary
    - Author title:          12px, text-secondary
                             e.g. "Senior Advocate, Lahore High Court"
    - Star rating:           5 stars, primary-500

Sample testimonials:
  1. "TaqiAI ny meri bail application 20 minute mein draft kar di — jo pehle 3 ghante lagti thi."
     — Adv. [Name], Criminal Lawyer, Lahore
  
  2. "Pakistani case law citations bilkul accurate hain. Pehle mujhe SCMR manually dhundna parta tha."
     — Adv. [Name], Civil Litigation, Karachi
  
  3. "Urdu support ne is tool ko mere clients ko samjhana aasan kar diya."
     — Adv. [Name], Family Law, Islamabad

Mobile slider:
  Navigation: dots below (primary-500 active, surface-3 inactive)
  Swipe:      Touch swipe enabled
```

---

#### Section 8: Pricing
```
Background:   bg-surface-1
Padding:      80px 0
Header:
  Eyebrow:   "Simple Pricing"
  Heading:   "Affordable for every Pakistani lawyer"
  Sub:       "No hidden fees. Cancel anytime. PKR pricing — no dollar conversion needed."

Layout:       3-column desktop, stacked mobile

Plan cards:

─────────────────────────────────────
PLAN 1: Free Trial
─────────────────────────────────────
Badge:       None
Price:       PKR 0
Sub:         Forever free, limited
Border:      border-default
CTA:         [Start Free] (secondary)

Includes:
  ✓ 10 AI document drafts/month
  ✓ 3 AI Advisor questions/day
  ✓ Basic templates only
  ✗ Case Law Research
  ✗ Chamber Management
  ✗ Priority support

─────────────────────────────────────
PLAN 2: Solo Pro          ← MOST POPULAR
─────────────────────────────────────
Badge:       "Most Popular" pill (primary-500)
Price:       PKR 2,999 / month
Sub:         For individual advocates
Border:      2px solid primary-500
Background:  bg-surface-2 (slightly elevated)
CTA:         [Start Solo Pro] (primary)
Glow:        Subtle primary-500 glow on card

Includes:
  ✓ Unlimited AI document drafts
  ✓ Unlimited AI Advisor
  ✓ All 170+ templates
  ✓ Case Law Research (SCMR/PLD)
  ✓ Chamber Management
  ✓ Lawyer Diary
  ✓ Email support
  ✗ Team seats
  ✗ Priority support

─────────────────────────────────────
PLAN 3: Firm
─────────────────────────────────────
Badge:       "For Teams"
Price:       PKR 7,999 / month
Sub:         Up to 5 lawyers
Border:      border-default
CTA:         [Contact Us] (secondary)

Includes:
  ✓ Everything in Solo Pro
  ✓ 5 team seats
  ✓ Shared document library
  ✓ Admin dashboard
  ✓ Priority support
  ✓ Custom templates (on request)
  ✓ Dedicated onboarding

Note below pricing:
  "All prices in Pakistani Rupees. No dollar conversion needed.
   Pricing decided on Pakistani lawyer income context (PKR 50k–200k/month)."

Annual toggle (optional for v2):
  [Monthly] [Annual — Save 20%]
```

---

#### Section 9: CTA Banner
```
Background:   gradient-primary (linear-gradient 135deg, #f97316 → #ea580c)
Padding:      64px 0
Layout:       Centered, max-w 700px

Content:
  - Heading:    "Start Drafting Smarter Today"
                White, 36px, bold
  - Sub:        "Join Pakistani lawyers who are saving hours every week."
                White at 80% opacity, 17px
  - Urdu sub:   "آج ہی شروع کریں — مفت"
                White at 60%, Nastaliq, 15px, RTL
  - CTA:        [Get Started Free] — White button, dark text
  - Fine print: "Free trial · No credit card · Cancel anytime"
                White at 50%, text-xs
```

---

#### Section 10: Footer
```
Background:   bg-surface-1
Border-top:   1px solid border-subtle
Padding:      48px 0 24px

4-column grid (desktop):

  Column 1 — Brand:
    TaqiAI logo
    Tagline: "Your Legal Mind, Amplified"
    Urdu: "آپ کا قانونی معاون"
    Social: LinkedIn · Twitter/X · WhatsApp (Pakistani lawyers use WhatsApp)

  Column 2 — Product:
    Features
    Pricing
    Practice Areas
    AI Advisor
    Case Law

  Column 3 — Company:
    About TaqiAI
    Privacy Policy
    Terms of Service
    Security

  Column 4 — Contact:
    support@xyric.ai
    WhatsApp: [number]
    "Lahore, Pakistan"
    [Contact Form]

Bottom bar:
  Left:  © 2026 Xyric Solutions · All rights reserved
  Right: "Made for Pakistan 🇵🇰 · Built on Pakistani Law"

Mobile: 2-column grid, bottom bar stacked
```

---

### 8.2 Login / Register Page

**Layout:** Split screen (50/50)

```
LEFT PANEL (bg-surface-1, fixed decorative)
  - TaqiAI logo top-left
  - Quote from a Pakistani lawyer (testimonial card)
  - Background: subtle gradient + Urdu calligraphy or law imagery

RIGHT PANEL (bg-base, scrollable)
  - Form centered (max-w: 400px)
```

#### Login Form
```
Heading:      "Welcome back"
Sub:          "Sign in to your TaqiAI account"

Fields:
  - Email address
  - Password (show/hide toggle)

Actions:
  - [Sign In] (primary, full-width)
  - Forgot password? (ghost link)

Footer:       "Don't have an account?" → Register
```

#### Register Form
```
Heading:      "Create your account"
Sub:          "Start with 10 free AI documents"

Fields:
  - Full Name
  - Email address
  - Phone (Pakistan: +92)
  - Password
  - Bar Council enrollment number (optional, trust signal)

Actions:
  - [Create Account] (primary, full-width)

Footer:       "Already registered?" → Login
Terms:        "By registering you agree to our Terms & Privacy Policy"
```

---

### 8.3 Dashboard (Home)

**Purpose:** Daily entry point — what's happening today, quick access to tools

#### Layout (3 Zones)
```
Zone 1: Header Bar
  - Time-based greeting ("Good Morning, Adv. Nuoman" / "خوش آمدید")
  - Date + Day of week
  - Quick action: [Start AI Draft] button (primary)

Zone 2: Today's Overview (2-column)
  Left: Today's Hearings
    - List of court hearings today (from case tracker)
    - Each item: Case name + Court + Time + Status badge
    - Empty: "No hearings today" + [Add Hearing] link
  Right: Recent Documents
    - Last 5 documents with status (Draft/Finalized)
    - [View All] link

Zone 3: Quick Access Grid (3-column desktop)
  6 feature cards:
    [AI Advisor] [Case Law] [Draft Document]
    [My Cases]   [Chamber]  [Scan & Translate]

Zone 4: Law Areas Grid (4-column)
  12 practice area cards, each showing:
  - Category-colored icon
  - Name (English + Urdu sub-label)
  - Template count badge
  - → Arrow on hover
```

---

### 8.4 AI Advisor Page

**Purpose:** Primary AI interaction — ask legal questions, get Pakistani law answers, AND navigate the app  
**Key Feature:** App Navigation Intent — AI can guide users to the right TaqiAI category/page

#### Layout
```
┌──────────────────────────────────────────────┐
│ Page Header: "AI Advisor" + [New Chat] btn   │
├──────────────────┬───────────────────────────┤
│ CHAT HISTORY     │  CHAT AREA               │
│ (w-64, sidebar)  │  (flex-1)                │
│                  │                          │
│ Today            │  ┌────────────────────┐  │
│  • Bail query    │  │ Conversation       │  │
│  • Property case │  │ bubbles            │  │
│                  │  └────────────────────┘  │
│ Yesterday        │  ┌────────────────────┐  │
│  • Divorce Q     │  │ Input area         │  │
│                  │  │ [Type message...]  │  │
│ [New Chat]       │  │ [mic] [send]       │  │
│                  │  └────────────────────┘  │
└──────────────────┴───────────────────────────┘
```

#### Chat Area Specifics

**Welcome State (no messages):**
```
Center of chat area:
  - Bot icon (48px, ai-500)
  - "Ask TaqiAI anything about Pakistani law"
  - Suggested prompts (4 chips):
    "Draft a bail application for Section 302"
    "22A 22B ka case kahan milega?"
    "What is the limitation period for civil suits?"
    "حوالہ جات کی تلاش کریں"  ← Urdu option
```

**Citation Block in AI Response:**
```
At the bottom of every AI response, inside the AI bubble:

┌─────────────────────────────────────────────┐
│ 📚 Relevant Citations                       │
│─────────────────────────────────────────────│
│ • PPC Section 302 — Punishment for Qatl     │
│ • SCMR 2019 Vol.2 p.456 — Bail in 302      │
│ • CrPC Section 497 — Bail Provisions        │
└─────────────────────────────────────────────┘
Disclaimer: "Verify citations before filing. AI may err."
```

**Quick Action after AI Response:**
```
Below each AI response:
[Draft This Document] [Copy] [Save] [Share]
```

---

#### App Navigation Intent — Special Response Type

**What it is:** When a user asks "konsi category mein hai", "kahan milega", "kis section mein jaoon" — the AI detects this as a Navigation Intent and responds with a special UI card instead of a plain text bubble.

**Trigger phrases (English + Urdu):**
```
"konsi category"     "which section"      "kahan milega"
"kis page pe"        "website pe kahan"   "kahan dhoondhon"
"kahan hai ye"       "app mein kahan"     "ye kis mein ata hai"
"where to find"      "which category"     "کون سی کیٹیگری"
"کہاں ملے گا"        "کس سیکشن میں"
```

**Navigation Response Card (special UI):**
```
Instead of normal AI bubble — show a Navigation Card:

┌─────────────────────────────────────────────────┐
│ 🗂️  Found in TaqiAI                             │
│─────────────────────────────────────────────────│
│                                                 │
│  [shield-alert icon]  Criminal Law              │
│  فوجداری قانون                                  │
│                                                 │
│  "CrPC 22A / 22B FIR registration ka mamla      │
│   Criminal Law mein aata hai."                  │
│                                                 │
│  ┌───────────────────────────────────────────┐  │
│  │ Relevant templates in this category:     │  │
│  │  • FIR Draft / Application               │  │
│  │  • Bail Application (CrPC 497)           │  │
│  │  • Criminal Complaint                    │  │
│  └───────────────────────────────────────────┘  │
│                                                 │
│  [Go to Criminal Law →]    [Draft Document]     │
└─────────────────────────────────────────────────┘

Card styling:
  Background:     bg-surface-2
  Border:         1px solid (category color — red for criminal)
  Left stripe:    4px solid (category color)
  Border-radius:  radius-xl
  Category icon:  24px, category color
  Button 1:       [Go to Criminal Law →] — secondary button
                  Links directly to /criminal-law page
  Button 2:       [Draft Document] — primary button
                  Links to /criminal-law template selection
```

---

#### Legal Section → TaqiAI Category Mapping

This mapping is used by the AI to detect which category a legal section belongs to.  
Must be implemented in `intent-handlers.ts` as a lookup table.

| Legal Code / Section | Category | Route |
|---------------------|----------|-------|
| PPC (any section) — 302, 324, 379... | Criminal Law | `/criminal-law` |
| CrPC — 22A, 22B, 154, 497, 498... | Criminal Law | `/criminal-law` |
| Anti-Terrorism Act | Criminal Law | `/criminal-law` |
| PECA (Cyber Crime) | Criminal Law | `/criminal-law` |
| CPC (Civil Procedure Code) | Civil Law | `/civil-law` |
| Contract Act 1872 | Agreements | `/agreements` |
| Specific Relief Act | Civil Law | `/civil-law` |
| Transfer of Property Act | Property Law | `/property-law` |
| Land Acquisition Act | Property Law | `/property-law` |
| Family Courts Act 1964 | Family Law | `/family-law` |
| Muslim Family Laws Ordinance 1961 | Family Law | `/family-law` |
| Dissolution of Muslim Marriages Act | Family Law | `/family-law` |
| Child Marriages Restraint Act | Family Law | `/family-law` |
| Companies Act 2017 | Corporate Law | `/corporate-law` |
| Partnership Act 1932 | Corporate Law | `/corporate-law` |
| Income Tax Ordinance 2001 | Tax Law | `/tax-law` |
| Sales Tax Act 1990 | Tax Law | `/tax-law` |
| FBR regulations | Tax Law | `/tax-law` |
| Constitution of Pakistan | Constitutional Law | `/constitutional-law` |
| Writ / Habeas Corpus | Constitutional Law | `/constitutional-law` |
| Passport Act / Citizenship Act | Immigration | `/immigration-law` |
| Foreigners Act | Immigration | `/immigration-law` |
| Christian Marriage Act | Non-Muslim Laws | `/non-muslim-laws` |
| Hindu Marriage Act | Non-Muslim Laws | `/non-muslim-laws` |
| Blasphemy Laws (295-C PPC) | Non-Muslim Laws | `/non-muslim-laws` |
| Oath / Affidavit | Affidavits | `/affidavits` |
| Power of Attorney | Power of Attorney | `/power-of-attorney` |
| Stamp Act / Registration Act | Property Transfer | `/property-transfer` |

**Also handle common question formats:**
```
"22A 22B"          → Criminal Law (CrPC)
"302 case"         → Criminal Law (PPC)
"khula"            → Family Law
"bail"             → Criminal Law
"property dispute" → Property Law
"divorce"          → Family Law
"company register" → Corporate Law
"FIR"              → Criminal Law
"writ petition"    → Constitutional Law
"tax appeal"       → Tax Law
```

---

#### Navigation Response — Urdu Query Support

Users can ask in Urdu and get the same Navigation Card:

```
User:  "22A 22B کا مقدمہ کس کیٹیگری میں ہے؟"
AI:    → Same Navigation Card (Criminal Law) in Urdu:
       "CrPC کی دفعہ 22A/22B فوجداری قانون میں آتی ہے۔"
       [فوجداری قانون پر جائیں →]  [دستاویز تیار کریں]
```

---

### 8.5 Document Drafting Page

**Purpose:** Select template, fill form, get AI-drafted legal document

#### Step 1: Template Selection
```
Page header:      "Draft a Document"
Search bar:       "Search templates..." (full-width, prominent)

Category tabs:    All | Affidavits | Agreements | Criminal | Family | Property | ...

Template grid (3-column):
  Each card:
    - Category color icon
    - Template name (English)
    - Urdu name (below, smaller)
    - Estimated time: "~2 minutes"
    - [Start Draft] on hover
```

#### Step 2: Form Input
```
Layout: 2-column (60/40)
Left (60%): Dynamic form
  - Field groups with clear labels
  - Urdu labels below English labels
  - Required field markers (*)
  - Smart defaults where possible
  - Inline validation

Right (40%): Live Preview Panel
  - Document preview updates as form fills
  - Watermark: "DRAFT — AI Generated"
  - Format matches court submission format
```

#### Step 3: AI Generation
```
Full-width loading state:
  - AI typing indicator (3-dot bounce)
  - "Generating your document..."
  - Progress: "Analyzing facts → Applying Pakistani law → Drafting..."
```

#### Step 4: Document Preview & Edit
```
Layout: 2-panel (40/60)

Left panel: Document metadata
  - Template name
  - Court / Case details
  - AI confidence indicators per section
  - [Regenerate Section] per paragraph
  - Download options: PDF / DOCX / Print

Right panel: Full document
  - Rich text editor
  - Document formatted as court document
  - Tracked AI sections highlighted
  - Citation sidebar pop-out
```

---

### 8.6 Case Law Research Page

**Purpose:** Search and read Pakistani case law — SCMR, PLD, PCrLJ

#### Layout
```
Page header:  "Case Law Research" + [Upload Judgment] btn

Search section:
  - Large search input (center, prominent)
  - Filters row: Court | Date Range | Reporter (SCMR/PLD/etc.) | Area of Law

Results:
  Left (30%): Filter panel (collapsible)
  Right (70%): Results list

Result card:
  - Case name (bold)
  - Citation: SCMR 2022 Vol.1 p.123
  - Court + Date
  - Summary (2 lines AI-generated)
  - Tags: [Constitutional] [Bail] [302]
  - [Read Full] [AI Summary] [Save]
```

#### Judgment Reader View
```
Split view:
  Left: Full judgment text (scrollable, formatted)
  Right: AI Analysis panel
    - Executive Summary
    - Ratio Decidendi
    - Key Passages (highlighted in left panel)
    - Ask about this judgment [chat input]
```

---

### 8.7 Chamber Management Page

**Purpose:** Case tracker, hearing calendar, deadline management

#### Layout: 3 sub-views (Tab navigation)

**Tab 1: Today's List**
```
Header: Date + "X Hearings Today"
Hearing cards (sorted by time):
  - Time badge (prominent, primary color)
  - Case title + Case number
  - Court name + Court room
  - Status: [Pending] [Adjourned] [Decided]
  - [Mark Adjourned] [Add Note] actions

Bottom: [+ Add Hearing] floating button
```

**Tab 2: All Cases**
```
Table view:
  Columns: Case No. | Title | Court | Type | Status | Next Hearing | Actions
  Row actions: View | Edit | Archive
  
Filters: Court | Case Type | Status | Date range

[+ Add Case] button (primary, top-right)
```

**Tab 3: Calendar**
```
Week view (default, switchable to month)
Color-coded by case type
Conflict detection: red highlight if two hearings overlap
Click day → Add hearing modal
```

---

### 8.8 My Documents Page

**Purpose:** View, manage, and re-edit all saved documents

#### Layout
```
Header: "My Documents" + [Upload] + [New Draft] buttons
Search + Filter row: [Search...] [Type ▼] [Date ▼] [Status ▼]

View toggle: Grid | List (default: Grid)

Grid view (3-column):
  Document card:
    - Document type icon (colored by category)
    - Title (truncated to 2 lines)
    - Date + Status badge
    - [Open] [Edit] [Download] [Delete] on hover

List view:
  Table: Title | Type | Date | Status | Actions
```

---

### 8.9 Settings Page

**Purpose:** Full control over TaqiAI experience — profile, AI behavior, documents, notifications, security, and billing.

#### Layout
```
┌─────────────────────────────────────────────────────┐
│ Page Header: "Settings"                             │
├──────────────────┬──────────────────────────────────┤
│ SETTINGS NAV     │  SECTION CONTENT                │
│ (w-56, sticky)   │  (flex-1, max-w-2xl)            │
│                  │                                  │
│ • Profile        │  Section heading                 │
│ • Appearance     │  Section fields                  │
│ • Language       │  [Save Changes] button           │
│ • AI Preferences │                                  │
│ • Document Setup │                                  │
│ • Notifications  │                                  │
│ • Privacy & Data │                                  │
│ • Security       │                                  │
│ • Shortcuts      │                                  │
│ • Subscription   │                                  │
└──────────────────┴──────────────────────────────────┘

Settings nav items:
  Height: 36px, padding: 0 12px
  Active: primary-500 left border + bg-surface-2
  Icon: 16px left of label
```

---

#### Section 1 — Profile

```
Avatar upload:
  - Circle, 80px
  - Click to upload (jpg/png, max 2MB)
  - Initials fallback if no photo
  - [Change Photo] + [Remove] links below

Personal Information:
  - Full Name *
  - Email Address * (with verified badge ✓)
  - Phone Number (+92 prefix, Pakistan)
  - City (dropdown: Lahore / Karachi / Islamabad / Peshawar / Quetta / Other)

Professional Information:
  - Bar Council Enrollment Number
    Helper: "Used to verify your advocate status"
  - Year of Enrollment (dropdown)
  - Designation (dropdown):
      Advocate / Senior Advocate / Advocate Supreme Court /
      Barrister / Legal Consultant / Paralegal
  - Firm / Chamber Name (optional)
  - Firm Address (optional, used in document headers)

[Save Profile] button (primary)
```

---

#### Section 2 — Appearance

```
Theme:
  Label: "Interface Theme"
  Options (radio cards, side by side):
    ┌──────────────┐  ┌──────────────┐
    │ 🌙 Dark Mode │  │ ☀️ Light Mode│
    │ [preview]    │  │ [preview]    │
    │ ● Active     │  │ ○            │
    └──────────────┘  └──────────────┘

Font Size:
  Label: "Text Size"
  Options (segmented control):
    [Small]  [Medium ●]  [Large]
  Preview: "This is how text will look" (updates live)

Interface Density:
  Label: "Display Density"
  Options (segmented control):
    [Compact]  [Default ●]  [Comfortable]
  Helper: "Compact shows more content. Comfortable adds more spacing."

Sidebar:
  Label: "Sidebar Style"
  Toggle: "Show Urdu labels in sidebar" (on/off)
  Toggle: "Collapse sidebar by default" (on/off)

[Save Appearance]
```

---

#### Section 3 — Language & Region

```
Interface Language:
  Label: "App Language"
  Options (radio):
    ● English
    ○ اردو (Urdu)
    ○ Both (English primary, Urdu secondary labels)
  Note: "Changing language will reload the page"

AI Response Language:
  Label: "AI Replies In"
  Options (radio):
    ● English
    ○ Urdu
    ○ Match my question language (Auto-detect)
  Helper: "When you ask in Urdu, AI replies in Urdu. When in English, English."

Date Format:
  Label: "Date Display"
  Options:
    ● DD/MM/YYYY  (14/05/2026) — Pakistani standard
    ○ MM/DD/YYYY  (05/14/2026)
    ○ DD MMM YYYY (14 May 2026)

Time Format:
  Label: "Time Display"
  Options:
    ● 12-hour (2:30 PM)
    ○ 24-hour (14:30)

Calendar Start Day:
  Options:
    ● Sunday
    ○ Monday

[Save Language & Region]
```

---

#### Section 4 — AI Preferences

```
This section controls how TaqiAI's AI behaves across the app.

Citation Style:
  Label: "Citation Format"
  Options (radio):
    ● SCMR Format   — "2019 SCMR 456"
    ○ PLD Format    — "PLD 2019 SC 123"
    ○ Full Format   — "Supreme Court Monthly Review 2019, Volume 1, Page 456"
  Helper: "Used in AI Advisor responses and drafted documents"

AI Response Length:
  Label: "Response Detail Level"
  Slider: Brief ←────●──→ Detailed
  Options: Brief / Balanced / Detailed
  Helper:
    Brief:    "Short answers, key points only — faster"
    Balanced: "Standard length with explanations"
    Detailed: "Full analysis with all relevant points"

Legal Perspective:
  Label: "Default Drafting Perspective"
  Options (radio):
    ● Balanced (both sides)
    ○ Plaintiff / Prosecution
    ○ Defendant / Defense
  Helper: "AI Advisor always stays balanced. This affects document drafting only."

Bismillah in Documents:
  Label: "Add Bismillah to formal petitions"
  Toggle: ON / OFF
  Helper: "بسم اللہ الرحمن الرحیم — added at top of writ petitions, plaints, and formal applications"

AI Disclaimer:
  Label: "Show AI disclaimer on every document"
  Toggle: ON (recommended) / OFF
  Helper: "Shows 'AI Generated — Verify before filing' watermark on draft documents"

Auto-Save Drafts:
  Label: "Auto-save AI drafts"
  Toggle: ON / OFF
  Helper: "Automatically saves AI-generated documents to My Documents"

[Save AI Preferences]
```

---

#### Section 5 — Document Setup

```
This section sets default values used across all document drafting.

Lawyer Header (appears at top of every document):
  - Advocate Name *        (pre-filled from Profile)
  - Enrollment Number      (pre-filled from Profile)
  - Contact Number         (pre-filled from Profile)
  - Office Address
  - City / High Court jurisdiction

  Preview:
  ┌─────────────────────────────────┐
  │ Adv. [Name]                     │
  │ Enrollment No: [number]         │
  │ [Phone] · [City]                │
  └─────────────────────────────────┘
  Toggle: "Include lawyer header in all documents" ON/OFF

Default Court Settings:
  - Primary Court (dropdown):
      Lahore High Court / Islamabad High Court /
      Sindh High Court / Peshawar High Court /
      Balochistan High Court / Supreme Court / Sessions Court / Other
  - Default District / City
  - Default Judge Salutation:
      "Honourable" / "Learned" / "Respected"

Document Language:
  - Default document output language:
      ● English
      ○ Urdu
      ○ Ask me every time

Paper Size:
  Options: ● A4  ○ Legal (Foolscap)
  Helper: "Pakistani courts commonly use A4. Some courts use Legal size."

Default Font for Documents:
  Options:
    ● Times New Roman (court standard)
    ○ Arial
    ○ Jameel Noori Nastaleeq (for Urdu documents)

[Save Document Setup]
```

---

#### Section 6 — Notifications

```
All notification types with individual toggles.

Hearing Reminders:
  Toggle: "Remind me before hearings" ON/OFF
  If ON → show:
    Lead time: [1 hour] [2 hours] [1 day ●] [2 days] before
    Second reminder: "Also remind [1 hour] before" toggle

Deadline Alerts:
  Toggle: "Alert me about upcoming deadlines" ON/OFF
  If ON → Lead time: [3 days ●] [7 days] [14 days] before

Daily Hearing Summary:
  Toggle: "Send daily list of today's hearings" ON/OFF
  Time: At [8:00 AM ●] every morning

Notification Channels:
  ┌─────────────────────────────────────────────┐
  │ Channel      │ Hearings │ Deadlines │ Docs  │
  │──────────────┼──────────┼───────────┼───────│
  │ In-App       │  ✅ ON   │  ✅ ON    │ ✅ ON │
  │ Email        │  ✅ ON   │  ✅ ON    │ ❌ OFF│
  │ WhatsApp     │  ❌ OFF  │  ❌ OFF   │ ❌ OFF│
  └─────────────────────────────────────────────┘
  Note: WhatsApp requires phone number verification

WhatsApp Setup (if WhatsApp enabled):
  - Enter WhatsApp number (+92...)
  - [Send Test Message] button
  - Verification code input

AI Document Notifications:
  Toggle: "Notify when AI document is ready" ON/OFF
  (useful if generation takes a few seconds on slow connection)

[Save Notifications]
```

---

#### Section 7 — Privacy & Data

```
Data Handling Policy (read-only info card):
  ┌─────────────────────────────────────────────┐
  │ 🔒 Your data is private                     │
  │                                             │
  │ • Your case data is NEVER used to train AI  │
  │ • Documents stored encrypted on our servers │
  │ • We do not share your data with third      │
  │   parties                                   │
  │ • Compliant with Pakistan PDPB guidelines   │
  └─────────────────────────────────────────────┘

Data Controls:
  [Export My Data] — Download all documents, cases, diary entries as ZIP
  Helper: "Generates a ZIP file with all your data. Takes 1–2 minutes."

  [Delete All Documents] — danger button
  Helper: "Permanently delete all AI documents. Cases and diary kept."

  [Delete My Account] — danger button
  Confirmation: Type "DELETE" to confirm
  Helper: "This is permanent. All your data will be deleted within 30 days."

Chat History:
  Toggle: "Save AI Advisor chat history" ON/OFF
  [Clear All Chat History] — danger button

Analytics:
  Toggle: "Share anonymous usage analytics" ON/OFF
  Helper: "Helps us improve TaqiAI. No personal or case data included."

[Save Privacy Settings]
```

---

#### Section 8 — Security

```
Change Password:
  - Current Password
  - New Password (strength meter below)
  - Confirm New Password
  [Update Password]

  Password strength meter:
    Weak → Fair → Good → Strong
    Color: red → orange → yellow → green

Two-Factor Authentication (2FA):
  Status badge: NOT ENABLED / ENABLED (green)
  [Enable 2FA] → opens setup modal:
    - QR code for authenticator app
    - Backup codes (8 codes, download/copy)
    - Verify code input
    - [Activate 2FA]

Active Sessions:
  Table of logged-in sessions:
    Columns: Device | Location | Last Active | Action
    Rows:
      💻 Chrome · Windows (Lahore) · Now · [This device]
      📱 Safari · iPhone (Karachi) · 2 days ago · [Revoke]
  [Revoke All Other Sessions] — danger link

Login History:
  Last 5 logins table:
    Date/Time | Device | Location | Status (Success/Failed)
  [View Full Login History] link

[Save Security Settings]
```

---

#### Section 9 — Keyboard Shortcuts

```
Read-only reference page — no settings to save.

Header: "Keyboard Shortcuts"
Sub: "Use these shortcuts to work faster in TaqiAI"

Shortcuts table (grouped):

NAVIGATION
  Ctrl + K          Open global search
  Ctrl + B          Toggle sidebar
  G then D          Go to Dashboard
  G then A          Go to AI Advisor
  G then Doc        Go to My Documents

DOCUMENTS
  Ctrl + N          New document draft
  Ctrl + S          Save current document
  Ctrl + P          Print / Export PDF
  Ctrl + Z          Undo (in editor)

AI ADVISOR
  Ctrl + Enter      Send message
  Escape            Cancel / close

GENERAL
  ?                 Show this shortcuts page
  Escape            Close modal / dropdown

Toggle shortcuts: ON/OFF globally
  "Enable keyboard shortcuts" toggle (for users who prefer not to use them)
```

---

#### Section 10 — Subscription & Billing

```
Current Plan card:
  ┌─────────────────────────────────────────────┐
  │ 🟠 Solo Pro                                 │
  │ PKR 2,999 / month                           │
  │ Next billing: 14 June 2026                  │
  │                          [Manage Plan]      │
  └─────────────────────────────────────────────┘

Usage This Month:
  AI Documents:    [████████░░] 82 / unlimited
  AI Advisor:      [██░░░░░░░░] Unlimited
  Templates:       170+ available
  Storage:         [███░░░░░░░] 120MB / 1GB

Plan Comparison (compact table):
  Feature           Free    Solo Pro  Firm
  AI Documents      10/mo   Unlimited Unlimited
  Templates         Basic   All 170+  All 170+
  Case Law          ✗       ✓         ✓
  Chamber           ✗       ✓         ✓
  Team seats        1       1         5

  [Upgrade to Firm →]

Billing History:
  Table: Date | Amount | Status | Invoice
  14 May 2026 | PKR 2,999 | Paid ✓ | [Download]
  14 Apr 2026 | PKR 2,999 | Paid ✓ | [Download]

Payment Method:
  Card: •••• •••• •••• 4242 (Visa)
  [Update Payment Method]

[Cancel Subscription] — danger link (with confirmation modal)
```

---

## 9. Interaction Patterns

### 9.1 Navigation

- **Active item highlight:** Left 2px border in primary-500 + bg-surface-3
- **Hover:** bg-surface-2 transition 100ms
- **Breadcrumbs:** Only for 3+ deep navigation. Format: `Draft Documents / Criminal Law / Bail Application`
- **Back button:** Only on nested template/document pages

### 9.2 Loading Patterns

| Situation | Pattern |
|-----------|---------|
| Page load | Skeleton layout (not spinner) |
| AI generation | Typing indicator + progressive text reveal |
| Form submission | Button loading state (spinner in button) |
| Search results | Skeleton cards while searching |
| Document save | Inline "Saving..." → "Saved ✓" |

### 9.3 Transitions

```
Page navigation:     Instant (no animation — speed priority)
Modal open/close:    150ms scale + opacity
Sidebar slide:       200ms ease-out
Dropdown:            100ms fade + slight translateY
Toast notification:  200ms slide from right
Hover states:        100ms ease
```

### 9.4 Error States

```
Form validation:
  - Red border on field
  - Error message below (13px, danger-500)
  - Shake animation (300ms) on submit attempt

API errors:
  - Toast notification (danger)
  - Retry button in toast

AI errors:
  - AI bubble with error state
  - "Could not generate response. Try again." + [Retry] button
  - Never show raw error messages to users
```

### 9.5 Success States

```
Document saved:      Green toast "Document saved"
Form submitted:      Redirect to document view
Draft generated:     Smooth reveal of document text
Copy to clipboard:   "Copied!" mini tooltip on button
```

### 9.6 Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+K` | Open global search |
| `Ctrl+N` | New document draft |
| `Ctrl+S` | Save current document |
| `Escape` | Close modal / sheet |
| `↑ ↓` | Navigate search results |
| `Enter` | Select search result |

---

## 10. Urdu / Bilingual Design

### 10.1 Language Strategy

**Rule:** Urdu is not a translation layer — it is a first-class language in every UI component.

**Implementation:**
- Every page heading has an Urdu sub-label (smaller, muted, RTL)
- Form labels show Urdu below English
- AI Advisor accepts Urdu input naturally
- Documents can be output in Urdu or English
- User can switch interface language in Settings

### 10.2 RTL Handling

```css
/* Urdu text container */
.urdu-text {
  direction: rtl;
  text-align: right;
  font-family: 'Noto Nastaliq Urdu', serif;
  line-height: 2.8;
}

/* Mixed content (Urdu heading, English body) */
.bilingual-block {
  direction: ltr; /* container stays LTR */
}
.bilingual-block .urdu {
  direction: rtl;
  text-align: right;
}
```

### 10.3 Bilingual UI Elements

#### Page Title (Bilingual)
```
Dashboard
ڈیش بورڈ ← 13px, text-tertiary, right-aligned or below
```

#### Sidebar Nav Items (bilingual mode)
```
AI Advisor          ← English primary label (13px, medium)
AI مشیر            ← Urdu secondary (10px, text-tertiary, rtl)
```

#### Law Category Cards
```
Criminal Law        ← English title
فوجداری قانون      ← Urdu subtitle (Nastaliq, 14px, rtl)
```

### 10.4 Urdu Document Output

When outputting legal documents in Urdu:
- Full RTL layout
- Nastaliq font at 16px, line-height 3.2
- Court document header in proper Urdu format
- Bismillah (بسم اللہ الرحمن الرحیم) at top of formal petitions (optional, user-controlled)

---

## 11. Responsive Design

### 11.1 Breakpoints
```
xs:   0–479px      (small phones)
sm:   480–639px    (large phones)
md:   640–767px    (phablets)
lg:   768–1023px   (tablets)
xl:   1024–1279px  (small laptops)
2xl:  1280px+      (desktop)
```

### 11.2 Behavior by Breakpoint

| Element | Mobile (<768px) | Tablet (768–1279px) | Desktop (1280px+) |
|---------|-----------------|---------------------|-------------------|
| Sidebar | Hidden (drawer) | Hidden (drawer) | Fixed 240px |
| Topbar | Hamburger + title | Hamburger + title | Full topbar |
| Dashboard grid | 1-column | 2-column | 3-column |
| Law areas | 2-column | 3-column | 4-column |
| Chat layout | Single column | Single column | Split (history + chat) |
| Drafting form | Single column | Single column | 2-column (form + preview) |
| Tables | Card view | Table (compact) | Full table |

### 11.3 Mobile Navigation

Replace sidebar with:
```
Bottom Tab Bar (mobile only):
  [Home] [AI Advisor] [Draft] [Cases] [More]
  Height: 60px + safe area
  Icons: 22px
  Labels: 10px
  Active: primary-500
```

### 11.4 Touch Targets

Minimum touch target: **44×44px** on all interactive elements (WCAG 2.1 AA)

---

## 12. Theme Tokens (Dark + Light)

Complete CSS variable reference. Variables are the same names in both themes — only values change. This means components never need to be rewritten for theme support.

### Dark Theme (Default)

```css
[data-theme="dark"],
:root {
  /* Backgrounds */
  --bg-base:        #080c10;
  --bg-surface-1:   #0d1318;
  --bg-surface-2:   #131a22;
  --bg-surface-3:   #1a2230;
  --bg-surface-4:   #212d3d;

  /* Borders */
  --border-subtle:  #1e2a38;
  --border-default: #2a3a4d;
  --border-strong:  #3a4f68;

  /* Text */
  --text-primary:   #e8edf2;
  --text-secondary: #8fa3b8;
  --text-tertiary:  #4d6278;

  /* Brand (same in both themes) */
  --primary-500:    #f97316;
  --primary-600:    #ea6c0d;
  --primary-700:    #c2550c;

  /* Semantic */
  --success-500:    #10b981;
  --success-bg:     #0d2d22;
  --warning-500:    #f59e0b;
  --warning-bg:     #2d1f0d;
  --danger-500:     #ef4444;
  --danger-bg:      #2d1010;
  --ai-500:         #a78bfa;
  --ai-bg:          #1a1430;

  /* Spacing (same in both themes) */
  --sidebar-width:  240px;
  --topbar-height:  56px;
  --radius-sm:      4px;
  --radius-md:      6px;
  --radius-lg:      8px;
  --radius-xl:      12px;

  /* Shadows */
  --shadow-card:    0 1px 3px rgba(0,0,0,0.3);
  --shadow-modal:   0 8px 40px rgba(0,0,0,0.5);
  --shadow-dropdown: 0 4px 20px rgba(0,0,0,0.4);

  /* Transitions (same in both themes) */
  --transition-fast:   100ms ease;
  --transition-base:   150ms ease;
  --transition-slow:   200ms ease-out;
}
```

---

### Light Theme

```css
[data-theme="light"] {
  /* Backgrounds */
  --bg-base:        #f8f9fa;
  --bg-surface-1:   #ffffff;
  --bg-surface-2:   #f1f3f5;
  --bg-surface-3:   #e9ecef;
  --bg-surface-4:   #dee2e6;

  /* Borders */
  --border-subtle:  #e9ecef;
  --border-default: #dee2e6;
  --border-strong:  #ced4da;

  /* Text */
  --text-primary:   #0d1318;
  --text-secondary: #495057;
  --text-tertiary:  #868e96;

  /* Brand (unchanged) */
  --primary-500:    #f97316;
  --primary-600:    #ea6c0d;
  --primary-700:    #c2550c;

  /* Semantic */
  --success-500:    #10b981;
  --success-bg:     #ecfdf5;
  --warning-500:    #f59e0b;
  --warning-bg:     #fffbeb;
  --danger-500:     #ef4444;
  --danger-bg:      #fef2f2;
  --ai-500:         #7c3aed;
  --ai-bg:          #f5f3ff;

  /* Shadows (lighter in light mode) */
  --shadow-card:    0 1px 3px rgba(0,0,0,0.08);
  --shadow-modal:   0 8px 40px rgba(0,0,0,0.15);
  --shadow-dropdown: 0 4px 20px rgba(0,0,0,0.1);
}
```

---

### Theme Toggle Component

```
Location:     Topbar — right side, before user avatar
Component:    Icon button (28x28px)

Dark mode:    sun icon (☀️) — "Switch to Light"
Light mode:   moon icon (🌙) — "Switch to Dark"

Tooltip:      "Light mode" / "Dark mode" on hover

Animation:    Icon rotates 180deg on toggle (300ms ease)
              Page transition: 200ms ease (all CSS variables transition)

CSS:
  * { transition: background-color 200ms ease, border-color 200ms ease,
                  color 150ms ease; }

Storage:
  localStorage key: "taqiai-theme"
  Values: "dark" | "light"
  
  Also save to user profile API:
  PATCH /api/auth/profile { theme: "dark" | "light" }
  So preference syncs across devices when logged in.

Default logic:
  1. Check user profile (if logged in)
  2. Check localStorage
  3. Check OS: prefers-color-scheme
  4. Default: dark
```

---

### Settings Page — Appearance Section

```
Section heading: "Appearance"

Theme selector (radio cards, 2 options):

  ┌─────────────────┐  ┌─────────────────┐
  │  🌙 Dark Mode   │  │  ☀️ Light Mode  │
  │                 │  │                 │
  │ [dark preview]  │  │ [light preview] │
  │                 │  │                 │
  │  ● Selected     │  │  ○              │
  └─────────────────┘  └─────────────────┘

Each card:
  - 120x80px preview thumbnail
  - Theme name below
  - Radio indicator
  - Selected: primary-500 border

Note below: "Your preference will sync across all your devices."
```

---

## Appendix A: Design Checklist

Use this checklist when generating any new page or component:

- [ ] Uses correct bg-surface level (not custom hex colors)
- [ ] Text uses only text-primary / text-secondary / text-tertiary tokens
- [ ] All interactive elements have hover + active + focus states
- [ ] Loading state defined (skeleton or spinner)
- [ ] Empty state defined (icon + message + CTA)
- [ ] Error state defined
- [ ] Mobile layout defined
- [ ] Urdu labels present on key elements
- [ ] Touch targets ≥ 44px on mobile
- [ ] AI content clearly marked with ai-bg + ai badge
- [ ] Citations block present in all AI outputs

---

## Appendix B: Pages Inventory

| Page | Route | Status | Priority |
|------|-------|--------|----------|
| Landing | `/` | Needs redesign | P0 |
| Login | `/login` | Needs refinement | P0 |
| Register | `/register` | Needs refinement | P0 |
| Dashboard | `/dashboard` | Needs redesign | P0 |
| AI Advisor | `/ai-advisor` | Needs redesign | P0 |
| Document Drafting (select) | `/[area]` | New pattern | P0 |
| Document Drafting (form) | `/[area]/[type]` | Needs redesign | P0 |
| Document Preview | `/documents/[id]` | Needs redesign | P0 |
| Case Law | `/case-law` | New design | P1 |
| Chamber | `/chamber` | New design | P1 |
| Court Cases | `/court-cases` | New design | P1 |
| My Documents | `/documents` | Needs redesign | P1 |
| Scan Document | `/scan-document` | Needs refinement | P2 |
| Translate | `/translate` | Needs refinement | P2 |
| Settings | `/settings` | Needs redesign | P2 |
| Lawyer Diary | `/lawyer-diary` | New design | P2 |

---

## Appendix C: Competitive Positioning

### Harvey.ai Analysis (Primary Competitor Reference)

Harvey.ai (harvey.ai) is a US-based legal AI platform. It was analyzed on 2026-05-14 to understand market design standards and identify opportunities.

#### What Harvey.ai Does

| Element | Harvey.ai |
|---------|-----------|
| Color scheme | Deep navy/charcoal backgrounds + bright **blue** accent |
| Target market | Enterprise law firms (Deutsche Telekom, Reed Smith) |
| Hero | Video background · "Practice Made Perfect" · "Request a Demo" |
| Trust section | Scrolling enterprise client logos |
| Access model | **Gated** — "Request a Demo" only. No self-serve signup |
| Pricing | **Hidden** — "Contact Sales" |
| Language | English only |
| Jurisdiction | Generic / global — no country-specific depth |
| Demo | None on page — describe only |
| Testimonials | 3 executive quotes with photos |
| Interactions | Expandable menus, carousel elements |
| Overall feel | Cold, enterprise, corporate |

#### Where TaqiAI Beats Harvey.ai

| Area | Harvey.ai | TaqiAI Advantage |
|------|-----------|------------------|
| **Warmth** | Cold blue, enterprise | Warm orange, approachable, lawyer-friendly |
| **Pakistan-specific** | Generic global tool | Built for PPC, CrPC, CPC, Pakistani courts |
| **Language** | English only | Urdu + English — bilingual first-class |
| **Access** | "Request a Demo" gate | Direct self-serve signup — no sales call |
| **Pricing** | Hidden, "Contact Sales" | Transparent PKR pricing — no dollar confusion |
| **Trust signals** | Foreign enterprise logos | Pakistani Bar Councils, local courts |
| **Document sample** | None shown | Real sample bail application (PPC 302) |
| **Testimonials** | CEO-level generic | Real Pakistani lawyer quotes in Urdu + English |
| **Jurisdiction depth** | Breadth over depth | Deep Pakistani law only — SCMR, PLD, PCrLJ |

#### Design Rules Derived from Harvey.ai Analysis

1. **Never use blue as primary** — blue = Harvey. Orange = TaqiAI brand, instantly differentiates.
2. **Never hide pricing** — Pakistani lawyers will not book a "Demo call". Show PKR tiers.
3. **Never use enterprise client logos** — irrelevant to Pakistani lawyers. Use local bar associations.
4. **Never copy their "Practice Made Perfect" copy direction** — too generic. TaqiAI is specific.
5. **Always show the product doing something** — static document sample builds more trust than describing features.

---

## Appendix D: Key Design Decisions

These decisions were made during the TaqiAI UI/UX design session (2026-05-14). Recorded here so future designers understand the WHY behind each choice.

---

### D-01: No Live AI Demo on Landing Page (MVP)

**Decision:** Do NOT add an interactive live AI demo on the landing page for v1.

**Why:**
- MVP stage — AI output quality is still being validated by Abdullah on solved cases
- A poor AI output on the landing page permanently loses the user ("ye bekar hai")
- Harvey.ai also does not have a live demo — industry standard is to describe + show samples
- Live demo adds complexity: API cost, rate limiting, spam handling

**What we use instead:**
- Static image/HTML of a real verified bail application (Section 302 PPC)
- "Verified by Abdullah (Senior Advocate)" trust marker on the sample
- Watermark: "SAMPLE — Generated by TaqiAI"

**When to revisit:**
- After 20+ solved cases validated by Abdullah
- After AI output passes legal quality review
- At that point, replace static sample with live interactive demo — it will be TaqiAI's biggest differentiator vs Harvey.ai

---

### D-02: Both Dark and Light Mode Supported

**Decision:** TaqiAI supports both Dark and Light mode. Dark is default.

**Why:**
- Pakistani lawyers work in different environments — some prefer light mode during day
- Using CSS variables (tokens) means both themes share the same components — no duplication
- User preference syncs across devices via profile API
- Dark remains the brand/default — light is a user choice

**Implementation:**
- `data-theme="dark"` / `data-theme="light"` on `<html>` element
- All colors use CSS variables — components automatically adapt
- Toggle in Topbar (sun/moon icon) + Settings → Appearance
- See Section 12 for full token reference

---

### D-03: Pakistani Bar Council Logos (Not Enterprise Logos)

**Decision:** Trust strip uses only Pakistani legal institution logos.

**Why:**
- Harvey.ai uses Deutsche Telekom, Reed Smith — meaningless to a Lahore lawyer
- Pakistani lawyers will recognize Lahore Bar Association, Supreme Court Bar immediately
- Local relevance = faster trust building

**Logos to use:**
Lahore Bar Association · Islamabad Bar Council · Karachi Bar Association · Sindh High Court Bar · Supreme Court Bar Association of Pakistan · KPK Bar Council

---

### D-04: Transparent PKR Pricing on Landing Page

**Decision:** Show all 3 pricing tiers with PKR amounts on the landing page.

**Why:**
- Harvey.ai hides pricing ("Contact Sales") — Pakistani lawyers will not do a sales call
- Pakistani lawyer income context: PKR 50k–200k/month. They need to see affordability immediately
- Transparency builds trust — hiding price = expensive assumption
- Self-serve is a competitive advantage over Harvey.ai

**Tiers:**
- Free: PKR 0 (10 drafts/month)
- Solo Pro: PKR 2,999/month
- Firm: PKR 7,999/month (5 seats)

---

### D-05: Webflow Law Firm Template (Reference)

**Source reviewed:** webflow.com/templates/html/lawyerfirm-law-firm-website-template

**What it is:** A multi-page Webflow template for law firms marketing to clients. Dark corporate aesthetic, 20+ pages, practice areas CMS, lawyer profiles, case results, slider, 3D transforms.

**Key takeaways:**
- Practice area grid structure → adapted for TaqiAI's 12 law categories
- Testimonials slider layout → adapted for Pakistani lawyer quotes
- "Case Results" section → adapted as "Stats Bar" (170+ templates, 12 areas)
- 3D transforms / interactions → NOT used (decided against animations for clean, fast feel)

---

## Appendix E: Impeccable Design Laws

Rules from the **impeccable** design skill (`pbakaus/impeccable`). Apply to every page, every component, every design decision in TaqiAI.

---

### E-01: Anti-References (What TaqiAI Must NOT Look Like)

These are reference points to actively avoid. If a design choice makes TaqiAI resemble any of these, rework it.

| Reference | Why Avoid |
|-----------|-----------|
| **Harvey.ai** | Cold blue enterprise gating — "Request a Demo" model. TaqiAI wins with warm orange + direct signup |
| **DigiLawyer** | Outdated government portal aesthetic. Low trust, low quality feel |
| **LegalZoom** | American consumer product. No Pakistani law context |
| **Generic SaaS dashboards** | Cookie-cutter admin templates. No personality, no authority |
| **Government e-portals (FBR, NADRA style)** | Heavy, slow, dense, untrustworthy UI |
| **Consumer chat apps (WhatsApp-like)** | Too casual for a legal professional tool |

**First-order reflex check:** If someone can guess the color palette from the category alone ("legal AI → dark blue"), the design has failed. Rework until the answer is not obvious from the domain.

**Second-order reflex check:** If someone can guess the aesthetic family from "Pakistani legal AI that's not navy-blue", that reflex was also avoided but the next trap was not. Keep going until both checks pass.

---

### E-02: Color Strategy

TaqiAI uses the **Restrained** strategy for the product (app UI) and **Committed** for the landing page hero.

**Four strategies — choose before picking colors:**

| Strategy | Coverage | When to use |
|----------|----------|-------------|
| **Restrained** | One accent ≤10% of surface | Product UI, dashboards, settings — default |
| **Committed** | One saturated color 30–60% | Landing hero, CTA banners |
| **Full Palette** | 3–4 named color roles | Practice area grids, data visualization |
| **Drenched** | Surface IS the color | Hero sections, campaign pages only |

The "one accent ≤10%" rule is Restrained only. Do not collapse every surface to Restrained by reflex — landing sections can and should use Committed or Drenched.

**OKLCH note:** Use OKLCH color functions where supported. Reduce chroma as lightness approaches 0 or 100 — high chroma at extremes looks garish. Never use pure `#000` or `#fff`; tint every neutral toward the amber brand hue (chroma 0.005–0.01 is sufficient).

---

### E-03: Theme Decision Rule

Dark vs. light is never a default choice. Before choosing for any new surface, write one sentence of physical scene:

> *"Pakistani advocate checking bail application status at 11pm on a desktop in their chamber."*

If the sentence forces dark — use dark. If it forces light — use light. If it does not force either answer, the sentence is not specific enough. Add detail until it does.

TaqiAI's default is dark because the sentence above forces that answer. Light mode exists as a user preference, not as the "safe" choice.

---

### E-04: Typography Laws

- Cap body line length at **65–75 characters** (ch units). Legal content is dense — do not make it denser with wide columns.
- Hierarchy through **scale + weight contrast**. Minimum 1.25× ratio between type scale steps. Flat scales (everything at 14px) communicate nothing.
- Never use weight alone or size alone to create hierarchy — use both together.

---

### E-05: Layout Laws

- **Vary spacing for rhythm.** Same padding everywhere is visual monotony. Use the spacing scale purposefully.
- **Cards are the lazy answer.** Use them only when they are truly the best affordance for the content. Every time you reach for a card, ask: could this be a list? A table row? Inline content? If yes, use that instead.
- **Nested cards are always wrong.** No exceptions.
- **Do not wrap everything in a container.** Most elements do not need a containing wrapper. Let content breathe in the layout grid directly.

---

### E-06: Motion Laws

- **Never animate CSS layout properties** (`width`, `height`, `top`, `left`, `margin`, `padding`). Animate `transform` and `opacity` only.
- **Ease out with exponential curves** — `ease-out-quart`, `ease-out-quint`, `ease-out-expo`. These feel fast and responsive.
- **No bounce. No elastic.** These feel playful and undermine the authoritative tone.
- Micro-interactions: 100–150ms. Standard transitions: 150–200ms. Page-level: 200–300ms.

---

### E-07: Absolute Bans

Match-and-refuse. If you are about to write any of these, stop and rewrite the element with different structure. No exceptions.

| Banned Element | Why Banned | Use Instead |
|---------------|------------|-------------|
| **Side-stripe borders** — `border-left` or `border-right` > 1px as a colored accent on cards, alerts, callouts | Classic AI-generated slop. Looks decorative, communicates nothing | Full borders, background tints, leading icons, or nothing |
| **Gradient text** — `background-clip: text` + gradient background | Decorative, never meaningful. Impossible to read on some displays | Single solid color. Emphasis via weight or size |
| **Glassmorphism as default** — blur + transparent glass cards used decoratively | Overused design trend. Looks cheap when used everywhere | Use solid surfaces. Reserve blur for genuine overlay contexts only |
| **Hero-metric template** — big number + small label + supporting stats + gradient accent | SaaS cliché. Every AI tool uses this. Instantly telegraphs "AI made this" | Real content, real actions, no vanity stats |
| **Identical card grids** — same-sized cards with icon + heading + text, repeated | Generic AI output pattern. No visual rhythm, no hierarchy | Use varied sizes, mix list rows with cards, add visual weight to priority items |
| **Modal as first thought** — opening a modal before considering alternatives | Laziness. Modals interrupt flow and hide context | Inline expansion, progressive disclosure, side panels, confirmation in-place |
| **Em dashes** — `—` or `--` in UI copy | Creates awkward rhythm in short UI text | Use commas, colons, semicolons, or parentheses |

---

### E-08: The AI Slop Test

Before shipping any page or component, ask:

> *"Could someone look at this and say 'AI made that' without doubt?"*

If yes, it has failed. Common failure signals:
- Any of the absolute bans above (E-07)
- Color palette that is obvious from the product category alone
- Generic illustrations or icon-in-circle patterns
- Copy that restates headings or adds filler intros
- Identical visual weight across all elements — no hierarchy

Run the test at two altitudes:
1. **First-order:** Can someone guess the theme + palette from the category alone? (legal AI → dark blue → fail)
2. **Second-order:** Can someone guess the aesthetic family from the category + anti-references? (Pakistani legal AI that's not navy → editorial typographic → fail if that's what was built)

Both must fail before the design passes.

---

### E-09: Copy Laws

- Every word earns its place. No restated headings, no intros that repeat the title.
- No em dashes anywhere in the UI (see E-07).
- Error messages tell the user what to do, not just what went wrong.
- Button labels are verbs: "Draft Document" not "Document", "Save Changes" not "Save".
- Empty states always have a next action — never a dead end.

---

*Impeccable skill source: github.com/pbakaus/impeccable | License: Apache 2.0*

**What was NOT adopted:**
- Lawyer profiles (TaqiAI is a tool, not a firm)
- Blog section (v2)
- Client-facing copy direction

---

*Document prepared for TaqiAI v1.0 redesign — Xyric Solutions*  
*Version 1.1 — Updated 2026-05-14*  
*Maintained by: Product Design, Xyric Solutions*
