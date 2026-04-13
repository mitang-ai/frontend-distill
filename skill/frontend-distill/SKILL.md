# Frontend Distill

Use this skill when the user wants to distill a live website into AI-usable frontend intelligence.

This skill is not only about visual style. Its target is a multi-layer extraction bundle that captures:

- visual design
- component system
- layout structure
- responsive behavior

The final goal is to reduce model guesswork. The agent should not have to improvise page structure after only reading colors and typography.

## Inputs

The skill works best when you have:

- a target URL or an already-open site
- screenshots of key pages or states
- extraction JSON from the companion script or toolchain
- an output target:
  - `DESIGN.md`
  - `DESIGN.md` + `LAYOUT.md`
  - full bundle plus reusable style skill

## Primary Deliverables

The default deliverable set is:

- `DESIGN.md`
- `LAYOUT.md`
- `design-tokens.json`
- `layout-tokens.json`

If the user only asks for part of the bundle, produce only that part.

## Workflow

### Stage 1. Acquire Evidence

1. Use the extraction script or companion tooling to collect structured evidence from the rendered site.
2. Ask for or capture screenshots for homepage, key inner pages, and important states.
3. Prefer repeated patterns over one-off surfaces.

### Stage 2. Validate Coverage

Read the extraction payload from highest signal to lowest signal:

1. `summary`
2. visual tokens
3. component samples
4. layout and responsive evidence
5. raw supporting fields

Before synthesis, verify that the payload can answer:

- what the site looks like
- how it structures pages
- how it behaves across viewport sizes

If layout or responsive evidence is weak, do not quietly invent it. Mark the gap and request more evidence or reduce confidence.

### Stage 3. Produce The Visual System

Generate `DESIGN.md` using `reference.md`.

Rules:

- exact numeric values come from extraction data
- screenshots help interpret mood and emphasis
- inferred details must be labeled as inferred
- repeated patterns beat outliers

### Stage 4. Produce The Structure System

Generate `LAYOUT.md` using `layout-reference.md`.

Focus on:

- page skeletons
- container widths
- section rhythm
- grid behavior
- reading widths
- CTA placement
- desktop / tablet / mobile changes

This document should make it hard for a future agent to produce a structurally wrong page.

### Stage 5. Emit Machine-Readable Tokens

When requested, emit or preserve:

- `design-tokens.json`
- `layout-tokens.json`

These should be compact, normalized, and easy for other agents or scripts to consume before reading the Markdown guides.

### Stage 6. Optional Skill Packaging

If the user wants a reusable style skill:

1. Use `skill-output-template.md`.
2. Package the final outputs into a reusable folder.
3. Make the generated skill require reading both `DESIGN.md` and `LAYOUT.md` before implementing UI.

## Operating Rules

- Never invent exact visual or structural values when the evidence does not support them.
- Never treat minified source code as the primary truth source. Rendered output is the source of truth.
- Never confuse stylistic resemblance with structural correctness.
- Prefer normalized summaries over raw dumps when speaking to the user.
- Keep reusable system rules separate from one-page content details.
- If the site has both marketing and app surfaces, capture both and name the distinction.

## Companion Files

- `extract-script.md`: current extraction script entry point
- `reference.md`: canonical `DESIGN.md` writing spec
- `layout-reference.md`: canonical `LAYOUT.md` writing spec
- `skill-output-template.md`: packaging template for reusable style skills
