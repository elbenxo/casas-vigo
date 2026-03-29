---
name: frontend-design
description: Create distinctive, production-grade frontend interfaces with high design quality. Covers typography, color, layout, motion, and avoiding generic AI aesthetics.
origin: ECC (everything-claude-code)
---

# Frontend Design

Create intentional, production-grade interfaces — not generic AI UI.

## When to Activate

- Building new web pages or components
- Designing landing pages or marketing sites
- Creating dashboards or admin interfaces
- Reviewing UI for design quality
- User asks for "beautiful", "polished", or "production-ready" UI

## Core Philosophy

**Pick a direction and commit to it.** Safe-average UI is usually worse than a strong, coherent aesthetic with a few bold choices.

## Workflow

### Step 1: Frame the Interface

Before writing any code, establish:
- **Purpose**: What is this page/component trying to achieve?
- **Audience**: Who will use this? What do they expect?
- **Tone**: Professional, playful, minimal, bold, warm, technical?
- **Visual direction**: Pick 2-3 reference designs that capture the feel

### Step 2: Build the Visual System

Define your tokens before composing layouts:

```css
:root {
  /* Typography */
  --font-display: 'Inter', system-ui, sans-serif;
  --font-body: 'Inter', system-ui, sans-serif;
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 2rem;
  --text-4xl: 2.5rem;

  /* Color */
  --color-primary: #2563eb;
  --color-primary-light: #3b82f6;
  --color-primary-dark: #1d4ed8;
  --color-surface: #ffffff;
  --color-surface-alt: #f8fafc;
  --color-text: #0f172a;
  --color-text-muted: #64748b;
  --color-border: #e2e8f0;

  /* Spacing */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-12: 3rem;
  --space-16: 4rem;

  /* Motion */
  --duration-fast: 150ms;
  --duration-normal: 250ms;
  --duration-slow: 400ms;
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
}
```

### Step 3: Compose with Intention

- Use **asymmetry** to create visual interest
- Use **whitespace** as a design element, not empty space
- Break the grid **intentionally** when composition benefits
- Maintain obvious **reading flow**

### Step 4: Make Motion Meaningful

- Animation should **reveal hierarchy** and **reinforce actions**
- Don't scatter random effects
- Entrance animations: fade + subtle translate (8-16px)
- Interaction feedback: scale, color shift, shadow change
- Loading states: skeleton screens over spinners

## Strong Defaults

### Typography
- Pick fonts with character, not just system defaults
- Pair a distinctive display face with a readable body font
- Establish clear hierarchy: display > heading > subheading > body > caption

### Color
- Commit to a clear palette with one dominant tone
- Use selective accents — not evenly weighted rainbow palettes
- Dark mode: don't just invert. Reduce contrast, shift hues

### Backgrounds & Atmosphere
- Use gradients, textures, and layered transparency
- Avoid flat, empty white backgrounds
- Subtle grain, mesh gradients, or geometric patterns add depth

### Layout
- Cards should have purpose, not just be default containers
- Vary section rhythms — not every section needs the same structure
- Use negative space aggressively to focus attention

## Anti-Patterns to Avoid

| Anti-Pattern | Why It Fails |
|---|---|
| Interchangeable SaaS templates | No identity, feels generic |
| Undifferentiated card grids | Boring, no hierarchy |
| Unmotivated accent colors | Random color choices lack cohesion |
| Placeholder-like typography | System fonts at default sizes feel unfinished |
| Animation for animation's sake | Distracts without adding meaning |
| Equal weight everywhere | Nothing stands out, nothing is primary |

## Quality Checklist

Before shipping UI:

- [ ] Clear visual point of view (not generic)
- [ ] Intentional spacing and typography
- [ ] Color supports the product purpose
- [ ] Motion is meaningful, not decorative
- [ ] Works on mobile and desktop
- [ ] Accessible (contrast ratios, focus states, screen readers)
- [ ] Loading states and empty states designed
- [ ] Error states are helpful, not ugly
