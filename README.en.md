<div align="center">
  <h1>Frontend Distill</h1>
  <h2>Distill websites into reusable AI frontend systems</h2>
  <h3>frontend-distillation skill</h3>
  <p>Not just colors. Structure too.</p>
  <p>Turn real websites into reusable AI-ready frontend assets by distilling their visual language, layout rules, and responsive behavior.</p>

  <p>
    <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="MIT License" />
    <img src="https://img.shields.io/badge/Claude%20Code-Skill-blue" alt="Claude Code Skill" />
    <img src="https://img.shields.io/badge/Frontend-Distill-black" alt="Frontend Distill" />
  </p>

  <p>
    Other Languages / 其他语言:
    <a href="./README.md">简体中文</a> ·
    <a href="./README.en.md">English</a> ·
    <a href="./README.ja.md">日本語</a> ·
    <a href="./README.ko.md">한국어</a> ·
    <a href="./README.es.md">Español</a>
  </p>
</div>

`Frontend Distill` is an open-source frontend-distillation skill + toolchain for turning real websites into reusable AI-ready frontend assets.

It is not only about extracting colors, typography, and button styles. It is built to distill three layers together:

- visual design
- layout structure
- responsive behavior

That is the difference between UI that only looks similar and UI that is also structurally plausible.

This README's presentation style was inspired by Hua Shu's project storytelling style, but the title language, messaging, and structure were rewritten specifically for this project.

---

## Why This Exists

Projects like [`awesome-design-md`](https://github.com/VoltAgent/awesome-design-md) and [`getdesign.md`](https://getdesign.md/) already proved that `DESIGN.md` is a strong medium for passing visual style to AI agents.

But they are mostly:

- style systems
- visual constraints
- component language

not:

- page-structure systems
- layout skeleton systems
- responsive constraint systems

That is why an AI can often reproduce the color palette and typography while still producing pages that feel cramped, weakly paced, or awkward on mobile.

`Frontend Distill` exists to close that gap.

## What It Is

`Frontend Distill` is:

- a precision-prompt-driven skill
- a deterministic extraction and normalization toolchain
- a reusable frontend distillation workflow for AI

Its goal is not to dump raw CSS values, but to generate reusable frontend assets such as:

- `DESIGN.md`
- `LAYOUT.md`
- `design-tokens.json`
- `layout-tokens.json`

## Install

Clone the repository:

```bash
git clone <your-repo-url>
cd frontend-distill
```

Install the skill into your local skill directory:

```bash
npm run skill:install -- --target "C:\\Users\\your-name\\.claude\\skills"
```

If your agent can load the skill directly from this repository, you can also use:

- [`skill/frontend-distill`](./skill/frontend-distill)

## Quick Start

Open the target website in a browser and run:

- [`tools/browser/extract_design_tokens.js`](./tools/browser/extract_design_tokens.js)

Then pass the extracted JSON through the toolchain:

```bash
npm run bundle:normalize -- --input ./examples/sample-raw-extraction.json --output ./output/extraction-bundle.json
npm run bundle:validate -- --input ./output/extraction-bundle.json
npm run bundle:split -- --input ./output/extraction-bundle.json --design-output ./output/design-tokens.json --layout-output ./output/layout-tokens.json
```

Then use `frontend-distill` inside your skill-enabled agent environment.

## What It Distills

Frontend systems are not one-layer systems. This project currently distills five layers:

Layer | Extracted content | Why it matters
--- | --- | ---
Visual | color, type, shadow, radius, decorative effects | determines whether the result looks right
Component | buttons, cards, inputs, nav, tags, variants | stabilizes UI detail
Layout | containers, grids, section rhythm, reading widths, page skeletons | determines whether the page breathes well
Responsive | breakpoints, collapse rules, spacing compression, nav changes, current viewport evidence | determines whether desktop and mobile both hold up
Reuse | `DESIGN.md`, `LAYOUT.md`, structured tokens | determines whether AI can reuse the system cheaply

If you only distill the first two layers, AI often creates UI that looks similar.  
With the remaining layers, AI has a much better chance of building something structurally correct too.

## Honest Boundaries

This project has clear limits:

- it reads public rendered output, not private design systems
- it is good at extracting repeated frontend patterns, not product intent
- it can capture structural evidence, but not every interaction state in one run
- multi-viewport responsive evidence still works better with repeated extraction or browser-capable agents

A distillation tool without honest boundaries is not trustworthy.

## How It Works

For a target website, `Frontend Distill` does four things:

1. Extract frontend evidence  
   visual tokens, component samples, layout evidence, responsive evidence, decorative effects, pseudo states, CSS variables

2. Normalize the output  
   deduplicate, cluster, trim, and convert raw extraction into a stable bundle

3. Emit reusable assets  
   split into `design-tokens.json` and `layout-tokens.json`, and prepare inputs for `DESIGN.md` and `LAYOUT.md`

4. Let the skill consume the result  
   the skill reads summaries and structured tokens first, then Markdown guides, reducing token waste and model improvisation

## What Already Exists

The repository already includes:

- a repo-local skill
- a browser extraction script
- bundle normalization / validation / split tooling
- a structured extraction schema
- `DESIGN.md` guidance
- `LAYOUT.md` guidance
- upstream analysis

So this is no longer just a prompt idea. It is already the beginning of a real skill toolchain.

## Repository Structure

```text
frontend-distill/
├── skill/
│   └── frontend-distill/
├── tools/
│   └── browser/
├── schemas/
├── docs/
├── examples/
├── package.json
├── .gitignore
└── LICENSE
```

## Public Docs

- Architecture: [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md)
- Roadmap: [`docs/ROADMAP.md`](./docs/ROADMAP.md)
- Upstream analysis: [`docs/UPSTREAM_ANALYSIS.md`](./docs/UPSTREAM_ANALYSIS.md)

## License

MIT License. See [`LICENSE`](./LICENSE).
