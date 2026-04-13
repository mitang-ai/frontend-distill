# Frontend Distill - DESIGN.md Reference

Use this file as the canonical writing contract when converting screenshots plus extraction JSON into a `DESIGN.md`.

This file governs the visual system only. Structural and responsive rules belong in `layout-reference.md`.

## Evidence Priority

1. Exact token values from JSON
2. Resolved CSS variables from JSON
3. Representative component samples from JSON
4. Screenshots for qualitative interpretation
5. Explicit inference only when evidence is incomplete

## Non-Negotiables

- Give exact color values whenever they exist in the JSON.
- Give exact size values whenever they exist in the JSON.
- Prefer concrete CSS wording over vague adjectives.
- Preserve the standard 9-section structure.
- If a detail is inferred, say so plainly instead of presenting it as measured fact.

## Required Output Structure

```md
# Design System Inspired by [Site Name]

## 1. Visual Theme & Atmosphere
## 2. Color Palette & Roles
## 3. Typography Rules
## 4. Component Stylings
## 5. Layout Principles
## 6. Depth & Elevation
## 7. Do's and Don'ts
## 8. Responsive Behavior
## 9. Agent Prompt Guide
```

## Section Requirements

## 1. Visual Theme & Atmosphere

Describe:

- overall style direction
- emotional tone of the palette
- information density
- composition style
- 3-6 key characteristics

Use screenshots heavily here, but keep the claims tied to visible evidence.

## 2. Color Palette & Roles

Group colors into:

- Primary
- Brand & Dark
- Accent Colors
- Interactive
- Neutral Scale
- Surface & Borders
- Shadow Colors

Preferred format:

```md
- **Token Name** (`#hex`): usage and design role
```

Rules:

- prefer JSON values
- keep semantically redundant colors grouped
- include alpha notation when shadows or translucent surfaces matter

## 3. Typography Rules

Include:

- primary font stack
- secondary font stack
- monospace stack if present
- a hierarchy table
- 3-5 typography principles

Hierarchy table format:

| Role | Font | Size | Weight | Line Height | Letter Spacing | Notes |
|------|------|------|--------|-------------|----------------|-------|

Rules:

- use measured values when available
- separate body, heading, button, code, and label roles when possible
- note special features such as tabular numerals or OpenType settings

## 4. Component Stylings

Cover the most reusable patterns from the evidence:

- Buttons
- Cards & Containers
- Badges / Tags / Pills
- Inputs & Forms
- Navigation
- Decorative Elements

For each component family, describe:

- background
- text color
- border
- radius
- padding
- shadow
- state changes such as hover, focus, selected, or disabled

## 5. Layout Principles

Include:

- spacing system
- grid and container behavior
- whitespace philosophy
- border-radius scale

Do not just list numbers. Explain how the numbers affect the visual rhythm.

## 6. Depth & Elevation

Provide a table:

| Level | Treatment | Use |
|-------|-----------|-----|

Also add a short `Shadow Philosophy` paragraph explaining how elevation behaves across the system.

## 7. Do's and Don'ts

Create:

- 8-10 concrete `Do` rules
- 8-10 concrete `Don't` rules

Rules should be actionable by an agent building UI, not generic design advice.

## 8. Responsive Behavior

Cover:

- breakpoints
- touch target expectations
- collapsing or stacking strategy
- image and media behavior

If exact breakpoints are not present, infer conservatively from screenshots and say the values are approximate.

## 9. Agent Prompt Guide

Include:

- quick color reference
- 3-5 example component prompts
- 5-8 iteration guidelines for future agents

This section should make it easy for another AI agent to build matching UI immediately.

## Merge Rules For Conflicts

- If screenshots look warmer than the JSON colors, trust the JSON and describe the warmer feel as visual atmosphere only.
- If component samples disagree, prefer the dominant or repeated pattern, not the outlier.
- If multiple spacing or radius values exist, derive a scale from the recurring ones.
- If the site contains both marketing pages and app surfaces, mention both and explain where each pattern appears.

## Output Quality Bar

The final `DESIGN.md` should feel like a reusable design system document, not a page recap.

Good:

- reusable
- token-aware
- concrete
- structured for agents

Bad:

- copywritten marketing summary
- vague adjectives with no numbers
- one-off component descriptions that do not generalize
