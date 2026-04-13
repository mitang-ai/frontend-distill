# Architecture

Frontend Distill is organized around a layered pipeline.

## Layer 1. Evidence Collection

Purpose:

- inspect the rendered site
- collect deterministic style and layout evidence
- minimize repeated reasoning by the model

Evidence sources:

- computed styles
- CSS variables
- component samples
- pseudo-state rules
- screenshots
- viewport-specific observations

## Layer 2. Normalization

Purpose:

- deduplicate noisy raw data
- group repeated patterns
- separate visual tokens from layout tokens
- compress high-volume evidence into AI-readable summaries

Main outputs:

- `design-tokens.json`
- `layout-tokens.json`
- compact summary fields for low-token inspection

## Layer 3. Documentation Synthesis

Purpose:

- turn normalized evidence into reusable constraints
- keep narrative explanation separate from machine-readable values

Main outputs:

- `DESIGN.md`
- `LAYOUT.md`

## Layer 4. Reusable Skill Packaging

Purpose:

- allow future agents to preload a style plus structure bundle
- reduce repeated extraction work across projects

Main output:

- a reusable style skill package containing design and layout documents

## Data Domains

### Visual System

Includes:

- color roles
- typography
- border radius
- shadows
- borders
- decorative treatments

### Component System

Includes:

- button variants
- card variants
- form controls
- navigation patterns
- badges
- overlays
- tabs and menus

### Layout System

Includes:

- container widths
- grid rules
- section rhythm
- reading widths
- alignment patterns
- hero and feature layouts

### Responsive System

Includes:

- breakpoint behavior
- collapse rules
- spacing compression
- nav transformation
- module reorder or hide rules

## Guiding Constraint

Style and layout should never be mixed into one vague narrative blob.

The model should be able to answer separately:

- what does this site look like
- how is this site structurally organized
- how does it change across screens
