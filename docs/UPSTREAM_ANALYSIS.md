# Upstream Analysis

This document explains what the upstream inspiration does well and where its scope intentionally stops.

## Upstream Reviewed

- `awesome-design-md`: the broader `DESIGN.md` project around curated AI-readable design references
- Google Stitch `DESIGN.md` concept: a Markdown-native design system document for AI

## What Upstream Does Well

The upstream direction is strong in four areas:

- style inspiration
- design-token articulation
- agent-friendly Markdown packaging
- quick adoption for vibe-matching UI work

That framing is useful because it makes the product easy to understand: pick a design reference, drop it into a project, and let an agent imitate the visual system.

## Where Upstream Is Intentionally Weak

The weakness is not poor execution. The weakness is scope.

It is optimized for:

- how the UI should look

It is not optimized for:

- how the page should be structurally composed
- how sections should be spaced
- how layouts should collapse across viewport sizes
- how to constrain an LLM's page architecture decisions

Even when the format includes layout guidance, that guidance is typically principle-level rather than structure-level.

## Practical Result

When an LLM reads a style-heavy but structure-light guide, it tends to:

- copy colors and typography accurately
- loosely match component styling
- improvise page layout

That is why style transfer can still produce:

- cramped desktop layouts
- weak section rhythm
- poor mobile stacking
- implausible CTA placement
- pages that feel visually similar but structurally off

## Product Opportunity

The opportunity for `Frontend Distill` is not to replace the upstream project.

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
- [Google Stitch DESIGN.md overview](https://stitch.withgoogle.com/docs/design-md/overview/)
