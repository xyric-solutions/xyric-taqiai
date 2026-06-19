# Impeccable Design Skill — Quick Reference
**Source:** `pbakaus/impeccable`  
**Install:** `npx skills add pbakaus/impeccable`  
**Use in Claude Code:** `/impeccable [command] [target]`

---

## What is this skill?

A Claude Code design skill that builds **production-grade frontend interfaces** — real working code, committed design choices, exceptional craft.

---

## Commands

### Build
| Command | Description |
|---|---|
| `/impeccable craft [feature]` | Shape then build a feature end-to-end |
| `/impeccable shape [feature]` | Plan UX/UI before writing any code |
| `/impeccable teach` | Set up PRODUCT.md and DESIGN.md context files |
| `/impeccable document` | Generate DESIGN.md from existing project code |
| `/impeccable extract [target]` | Pull reusable tokens and components into a design system |

### Evaluate
| Command | Description |
|---|---|
| `/impeccable critique [target]` | UX design review with heuristic scoring |
| `/impeccable audit [target]` | Technical checks — accessibility, performance, responsive |

### Refine
| Command | Description |
|---|---|
| `/impeccable polish [target]` | Final quality pass before shipping |
| `/impeccable bolder [target]` | Amplify safe or bland designs |
| `/impeccable quieter [target]` | Tone down aggressive or overstimulating designs |
| `/impeccable distill [target]` | Strip to essence, remove complexity |
| `/impeccable harden [target]` | Production-ready: errors, i18n, edge cases |
| `/impeccable onboard [target]` | Design first-run flows and empty states |

### Enhance
| Command | Description |
|---|---|
| `/impeccable animate [target]` | Add purposeful animations and motion |
| `/impeccable colorize [target]` | Add strategic color to monochromatic UIs |
| `/impeccable typeset [target]` | Improve typography hierarchy and fonts |
| `/impeccable layout [target]` | Fix spacing, rhythm, and visual hierarchy |
| `/impeccable delight [target]` | Add personality and memorable touches |
| `/impeccable overdrive [target]` | Push past conventional design limits |

### Fix
| Command | Description |
|---|---|
| `/impeccable clarify [target]` | Improve UX copy, labels, and error messages |
| `/impeccable adapt [target]` | Adapt for different devices and screen sizes |
| `/impeccable optimize [target]` | Diagnose and fix UI performance issues |

### Iterate
| Command | Description |
|---|---|
| `/impeccable live` | Visual variant mode — pick elements in the browser, generate alternatives |

---

## Setup

The skill requires **2 context files** in the project root to work properly:

### PRODUCT.md (Required)
Include:
- Who the users are
- Brand tone and voice
- Anti-references (what the design should NOT look like)
- Strategic principles

### DESIGN.md (Optional but Recommended)
Include:
- Color palette
- Typography choices
- Elevation and shadows
- Component patterns

**Auto-generate both files:**
```bash
/impeccable teach     # Creates PRODUCT.md interactively
/impeccable document  # Generates DESIGN.md from existing code
```

---

## Design Laws

### Color
- Use OKLCH color system
- Never use pure `#000` or `#fff` — tint every neutral toward the brand hue
- Choose a **color strategy** before picking colors:
  - **Restrained** — tinted neutrals + one accent ≤10% (product default)
  - **Committed** — one saturated color covers 30–60% of the surface
  - **Full palette** — 3–4 named color roles used deliberately
  - **Drenched** — the surface IS the color (hero/campaign pages)

### Typography
- Cap body line length at **65–75 characters**
- Hierarchy through scale + weight contrast (minimum 1.25x ratio between steps)

### Layout
- Vary spacing for rhythm — same padding everywhere is monotony
- **Use cards only when they are truly the best affordance** — nested cards are always wrong
- Do not wrap everything in a container

### Motion
- Never animate CSS layout properties
- Use ease-out exponential curves (ease-out-quart / quint / expo) — no bounce, no elastic

---

## Absolute Bans

| Element | Why Not |
|---|---|
| Side-stripe borders (border-left/right > 1px as colored accent) | AI cliché — use background tints, icons, or nothing |
| Gradient text (`background-clip: text` + gradient) | Decorative, never meaningful — use a solid color |
| Glassmorphism as default | Overused — use it rarely and purposefully only |
| Hero-metric template (big number + small label + gradient accent) | SaaS cliché |
| Identical card grids (icon + heading + text repeated endlessly) | Generic AI output |
| Modal as first thought | Usually laziness — exhaust inline/progressive alternatives first |
| Em dashes (— or --) | Use commas, colons, semicolons, or parentheses instead |

---

## Useful Commands for TaqiAI

```bash
# Audit existing pages
/impeccable audit src/app/dashboard

# Improve typography
/impeccable typeset src/app/translate

# Check dark theme colors
/impeccable colorize src/components

# Final pass before shipping
/impeccable polish src/app

# Live browser iteration
/impeccable live
```

---

## Pin Shortcuts

Create short aliases for frequently used commands:
```bash
# Create shortcut
/impeccable pin audit
# Now you can just type /audit

# Remove shortcut
/impeccable unpin audit
```

---

*Skill source: github.com/pbakaus/impeccable | License: Apache 2.0*
