<div align="center">
  <h1>Frontend Distill</h1>
  <h2>Capture reusable frontend design references from real websites</h2>
  <h3>frontend-distill skill</h3>
  <p>Extract visual style, layout structure, section rhythm, and responsive behavior.</p>
  <p>Produce reusable DESIGN.md, LAYOUT.md, and structured tokens.</p>

  <p>
    <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="MIT License" />
    <img src="https://img.shields.io/badge/Claude%20Code-Skill-blue" alt="Claude Code Skill" />
    <img src="https://img.shields.io/badge/Frontend-Distill-black" alt="Frontend Distill" />
  </p>

  <p>
    Other Languages / 其他语言:
    <a href="./README.md">简体中文</a> ·
    <a href="./README_JA.md">日本語</a> ·
    <a href="./README_KO.md">한국어</a> ·
    <a href="./README_ES.md">Español</a>
  </p>
</div>

`Frontend Distill` is an open-source skill + toolchain for extracting visual, layout, and responsive information from real websites and turning it into reusable documentation and tokens.

It is not meant to be a raw CSS dump, and it is not just another style showcase.  
The repository includes extraction scripts, normalization tools, and a skill for turning scattered page evidence into a reusable frontend reference set.

The organizational rhythm of this README was inspired by Hua Shu's open-source writing style, but the title, voice, framing, and structure were rewritten specifically for `Frontend Distill`.

---

## The Problem It Solves

[`awesome-design-md`](https://github.com/VoltAgent/awesome-design-md) already proved that `DESIGN.md` is a strong way to transfer visual style to AI.

But in real use, the pain is often not color fidelity. The pain is:

- unstable page skeletons
- weak section rhythm
- cramped desktop layouts
- awkward mobile stacking
- CTA, nav, and content structure being left to model improvisation

In other words, many resources tell an AI what a UI should look like, but not clearly enough how the page should be structurally composed.

`Frontend Distill` is built for that missing layer.

## Positioning

This project is not just an extractor. It combines three things:

- a precision-prompt-driven skill
- deterministic tooling for extraction and normalization
- reusable outputs designed for AI consumption

The goal is to keep repetitive work in scripts and reserve model reasoning for the parts that actually need judgment.

## Core Outputs

`Frontend Distill` currently centers around four output artifacts:

- `DESIGN.md`
- `LAYOUT.md`
- `design-tokens.json`
- `layout-tokens.json`

They serve different roles:

- Markdown provides high-level guidance for both humans and agents
- JSON provides lower-ambiguity, lower-token structured inputs for tools and workflows

## Why It Saves Tokens

If you rely on a long prompt and ask an AI to inspect a site, infer the system, and summarize everything on its own, the usual problems are:

- flow drift
- higher randomness
- expensive token usage

This project flips that model:

- prompts handle orchestration and constraints
- scripts handle extraction, clustering, deduplication, and trimming
- AI reads the cleaned result at the end

That makes it closer to a frontend distillation pipeline than a one-shot vibe prompt.

## Install

Clone the repository:

```bash
git clone <your-repo-url>
cd frontend-distill
```

Install dependencies:

```bash
npm install
npx playwright install chromium
```

`playwright` powers the automated site visit, and `npx playwright install chromium` installs the browser runtime used by the extraction command.

Install the skill into your local skills directory:

```bash
npm run skill:install -- --target "C:\\Users\\your-name\\.claude\\skills"
```

The installer also writes a `RUNTIME.md` file into the installed skill directory so the agent can find the real tool paths from the cloned project.

If your agent can load a skill directly from a repository path, you can also use:

- [`skill/frontend-distill`](./skill/frontend-distill)

## Workflow

1. Let the agent or tool open the target URL.
2. Run the automated extraction command to generate the screenshot, raw extraction, bundle, and tokens.
3. Feed those outputs into the `frontend-distill` skill.

Primary command:

```bash
npm run site:distill -- --url "https://example.com" --output-dir "./output/example"
```

This command automatically:

- opens the page
- scrolls to trigger lazy-loaded content
- injects the extractor
- saves a screenshot
- writes `raw-extraction.json`
- writes `extraction-bundle.json`
- writes `design-tokens.json`
- writes `layout-tokens.json`

If you already have raw extraction JSON, you can still run the normalization tools separately:

```bash
npm run bundle:normalize -- --input ./examples/sample-raw-extraction.json --output ./output/extraction-bundle.json
npm run bundle:validate -- --input ./output/extraction-bundle.json
npm run bundle:split -- --input ./output/extraction-bundle.json --design-output ./output/design-tokens.json --layout-output ./output/layout-tokens.json
```

Manually pasting [`tools/browser/extract_design_tokens.js`](./tools/browser/extract_design_tokens.js) into DevTools is now fallback-only, not the primary workflow.

## What It Distills

Frontend systems are not single-layer systems. This project currently works across five layers:

Layer | Main content | Why it matters
--- | --- | ---
Visual | color, type, shadow, radius, decorative effects | determines whether the style feels right
Component | buttons, cards, inputs, nav, tags, and variants | stabilizes component-level detail
Layout | containers, grids, section rhythm, reading widths, page skeletons | determines whether the page breathes well
Responsive | breakpoints, collapse rules, spacing compression, nav changes, viewport evidence | determines whether the design survives across devices
Reuse | `DESIGN.md`, `LAYOUT.md`, structured tokens | determines whether AI can reuse the system cheaply

If you only distill the first two layers, AI often produces UI that looks similar.  
Once the other three layers become explicit, AI has a much better chance of producing something structurally correct as well.

## How It Works

For a target website, `Frontend Distill` moves through four stages:

1. Collect frontend evidence  
   It captures visual tokens, component samples, layout signals, responsive clues, CSS variables, decorative effects, and state-related evidence.

2. Normalize the raw output  
   Colors, spacing values, style signatures, and component variants are deduplicated, clustered, trimmed, and standardized.

3. Build reusable artifacts  
   The toolchain emits an `extraction-bundle`, then splits it into `design-tokens.json` and `layout-tokens.json`, while also preparing inputs for `DESIGN.md` and `LAYOUT.md`.

4. Let the skill consume it  
   The skill reads structured summaries and tokens first, then the Markdown guidance, which reduces improvisation and token waste.

## What Already Exists

The repository already includes:

- a repo-local skill
- a browser extraction script
- normalization, validation, and split tooling
- a structured schema
- `DESIGN.md` guidance
- `LAYOUT.md` guidance
- upstream analysis

So this is no longer just a prompt idea. It is already a working foundation for a real skill toolchain.

## Honest Boundaries

This project intentionally keeps its boundaries visible:

- it reads public rendered output, not private source design files
- it is good at extracting repeated frontend patterns, not business strategy or brand intent
- it can record structural evidence, but not every interaction state in a single run
- multi-viewport responsive capture still benefits from browser-capable agents and repeated extraction

Stating those limits clearly makes the output more trustworthy.

## Repository Structure

```text
frontend-distill/
├── skill/
│   └── frontend-distill/
│       ├── SKILL.md
│       ├── extract-script.md
│       ├── reference.md
│       ├── layout-reference.md
│       └── skill-output-template.md
├── tools/
│   ├── browser/
│   │   └── extract_design_tokens.js
│   ├── install-skill.mjs
│   ├── normalize-extraction-bundle.mjs
│   ├── split-extraction-bundle.mjs
│   ├── validate-extraction-bundle.mjs
│   └── lib/
│       └── bundle-utils.mjs
├── schemas/
│   └── extraction-bundle.schema.json
├── docs/
│   ├── ARCHITECTURE.md
│   ├── ROADMAP.md
│   └── UPSTREAM_ANALYSIS.md
├── examples/
│   └── sample-raw-extraction.json
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
