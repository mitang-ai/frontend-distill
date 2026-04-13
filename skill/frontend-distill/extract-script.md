# Frontend Distill - Browser Extraction Script

This file is the skill-facing entry point for the browser extractor.

## Canonical Source

The single source of truth for the extractor is:

- [`tools/browser/extract_design_tokens.js`](../../tools/browser/extract_design_tokens.js)

Do not maintain a second inline copy here. The skill and the repository should always reference the same JavaScript file.

## What The Current Extractor Captures

The current extractor is designed to collect:

- CSS custom properties from `:root` and scoped selectors
- resolved colors, typography, spacing, radius, shadows, borders, transitions, and z-indexes
- representative component samples
- clustered component variants for major component families
- layout evidence such as containers, grids, sections, reading widths, sticky elements, and touch-target sizes
- responsive evidence from viewport metadata, media queries, and current grid states
- decorative effects such as background images, filters, backdrop filters, text shadows, outlines, and transforms
- a compact `summary` block so an AI can inspect the payload before reading the whole file

## Current Limits

The extractor is stronger than the earlier prototype, but it still has limits:

- multi-viewport responsive capture still requires rerunning at different widths or using a browser-capable agent
- hover and active states are still easier to capture from stylesheet rules than from fully realized computed states
- some layout decisions are only observable after real page interaction
- cross-origin stylesheets may partially block direct `cssRules` access

## Operator Steps

1. Open the target website in a Chromium-based browser.
2. Scroll through the important pages or sections so lazy-loaded content enters the DOM.
3. Open DevTools and switch to `Console`.
4. If Chrome blocks paste, type `allow pasting` and press Enter.
5. Paste the full contents of [`tools/browser/extract_design_tokens.js`](../../tools/browser/extract_design_tokens.js) and run it.
6. Copy the resulting JSON and feed it into the Frontend Distill toolchain.

## Skill Guidance

When using this skill:

1. Prefer the extracted `summary` for fast validation.
2. Use the raw layout and responsive fields before falling back to inference.
3. If the user needs stronger mobile and tablet evidence, request multiple extraction runs at different viewport widths.
