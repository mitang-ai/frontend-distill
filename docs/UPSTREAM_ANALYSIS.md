# Upstream Analysis

This document explains what the upstream inspiration does well and where it stops.

## Upstream Reviewed

- `awesome-design-md`: a curated repository of `DESIGN.md` files inspired by popular websites
- `getdesign.md`: a hosted catalog and installer flow for those `DESIGN.md` files
- Google Stitch `DESIGN.md` concept: a Markdown-native design system document for AI

## What Upstream Does Well

The upstream project is strong in four areas:

- style inspiration
- design-token articulation
- agent-friendly Markdown packaging
- quick adoption for vibe-matching UI work

This is visible in its own positioning:

- the GitHub repository describes itself as a "Curated collection of DESIGN.md files inspired by developer focused websites"
- the website tells users to "Drop one into your project and let coding agents build matching UI"
- individual design pages describe themselves as "a curated starting point" rather than official design systems

That framing is useful and honest. It makes the product easy to understand.

## Where Upstream Is Intentionally Weak

The weakness is not that the upstream project is bad. The weakness is that it is optimized for a different job.

It is optimized for:

- how the UI should look

It is not optimized for:

- how the page should be structurally composed
- how sections should be spaced
- how layouts should collapse across viewport sizes
- how to constrain an LLM's page architecture decisions

Even the `DESIGN.md` format emphasizes design system language such as:

- visual theme
- color palette
- typography
- component styling
- layout principles
- depth and elevation

That is valuable, but "layout principles" are still principle-level. They are not a full structural contract.

## Practical Result

When an LLM reads a style-heavy but structure-light guide, it tends to do this:

- accurately copy colors and typography
- loosely match component styling
- improvise page layout

That is why style transfer can still lead to:

- cramped desktop layouts
- weak section rhythm
- poor mobile stacking
- implausible CTA placement
- pages that feel visually similar but structurally off

## Product Opportunity

The opportunity for Frontend Distill is not to replace the upstream project.

The opportunity is to add the missing layer:

- extract visual system
- extract layout system
- extract responsive behavior
- package all of it into AI-readable constraints

## Design Principle For This Project

The more explicit the structural constraints are, the less the model needs to improvise.

That means this project should treat the following as first-class outputs:

- `DESIGN.md`
- `LAYOUT.md`
- `design-tokens.json`
- `layout-tokens.json`

## Sources

- [awesome-design-md repository](https://github.com/VoltAgent/awesome-design-md)
- [getdesign.md homepage](https://getdesign.md/)
- [Example design page: Stripe](https://getdesign.md/stripe/design-md)
- [Google Stitch DESIGN.md overview](https://stitch.withgoogle.com/docs/design-md/overview/)
