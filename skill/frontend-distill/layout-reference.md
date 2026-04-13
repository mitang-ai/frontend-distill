# Frontend Distill - LAYOUT.md Reference

Use this file as the canonical writing contract when converting extraction evidence into a `LAYOUT.md`.

The purpose of `LAYOUT.md` is to remove structural ambiguity for future AI agents. It should describe how pages are organized, not just how they look.

## Evidence Priority

1. Measured layout fields from extraction JSON
2. Repeated container and section patterns
3. Responsive snapshots across viewport sizes
4. Screenshots for composition and rhythm
5. Explicit inference only when evidence is incomplete

## Non-Negotiables

- Prefer measured widths, gaps, and padding values over descriptive language.
- Distinguish marketing surfaces from application surfaces when both exist.
- Treat desktop, tablet, and mobile behavior as part of the layout system, not as an afterthought.
- If a structural rule is inferred rather than measured, label it clearly.

## Required Output Structure

```md
# Layout System Inspired by [Site Name]

## 1. Page Architecture
## 2. Containers And Grids
## 3. Section Rhythm
## 4. Content Patterns
## 5. Responsive Behavior
## 6. Placement Rules
## 7. Failure Modes To Avoid
## 8. Agent Implementation Guide
```

## Section Requirements

## 1. Page Architecture

Describe:

- dominant page skeletons
- hero structure
- navigation placement
- footer density
- whether the product uses landing-page, documentation, dashboard, or hybrid patterns

## 2. Containers And Grids

Include:

- main content widths
- reading widths
- common grid columns
- gap values
- sidebar behavior
- sticky rail or fixed panel behavior if present

Prefer exact values in a table.

## 3. Section Rhythm

Cover:

- vertical section spacing
- internal section padding
- heading-to-body spacing
- body-to-CTA spacing
- card-to-card spacing

Explain how dense or airy the site feels through repeated spacing patterns.

## 4. Content Patterns

Document the main reusable section types such as:

- hero
- feature grid
- logo strip
- pricing
- testimonial
- FAQ
- dashboard overview
- docs article

For each one, describe the structure and stacking order rather than the copy.

## 5. Responsive Behavior

Describe what changes at desktop, tablet, and mobile:

- column collapse rules
- container width changes
- spacing compression
- navigation changes
- CTA relocation
- scrollable or hidden elements

Use measured breakpoints when available. Otherwise call them approximate.

## 6. Placement Rules

State concrete placement constraints for future AI agents, such as:

- where CTAs belong
- how wide text blocks should be
- when imagery sits beside text versus below it
- how many cards should appear per row
- when a section should split into two columns versus one

This section should feel operational, not editorial.

## 7. Failure Modes To Avoid

List 8-10 structural mistakes that would break the target system, such as:

- overpacked hero sections
- too many columns on desktop
- unreadably long text lines
- mobile layouts that preserve desktop ordering
- CTA groups without spacing hierarchy

## 8. Agent Implementation Guide

Include:

- quick structural summary
- 3-5 implementation prompts
- rules for desktop and mobile fallback behavior

The aim is to make a future coding agent produce a structurally plausible page on the first attempt.
