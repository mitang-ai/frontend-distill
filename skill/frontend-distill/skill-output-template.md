# Frontend Distill - Reusable Skill Template

Use this template when a user wants the generated system bundle turned into a reusable Claude Code style skill.

## Recommended Output Structure

```text
[site-style-skill]/
├── SKILL.md
├── DESIGN.md
└── LAYOUT.md
```

## Generated Skill Behavior

The generated skill should:

- read the local `DESIGN.md` and `LAYOUT.md` before proposing UI
- treat token values, component rules, and layout constraints as the source of truth
- preserve the target brand's typography, spacing, color, elevation, and structural rhythm
- refuse generic substitutions that break the design language

## Template: Generated `SKILL.md`

```md
# [Site Name] Style

Use this skill when the user asks for UI that should feel like [Site Name].

## First Step

Read `DESIGN.md` and `LAYOUT.md` in the same folder before making any design decisions.

## What To Preserve

- core palette and semantic color roles
- typography system and font hierarchy
- spacing rhythm and section behavior
- page skeletons and container behavior
- grid and responsive collapse rules
- border-radius scale
- shadow and elevation treatment
- component state behavior

## Working Rules

- Prefer the exact token values from `DESIGN.md`.
- Prefer structural rules from `LAYOUT.md` over generic page-building habits.
- Match the brand's density and composition, not just its colors.
- Reuse the documented component rules before inventing new patterns.
- If a requested UI pattern is missing from the docs, extend the system conservatively in the same style and structure.
- Avoid drifting into generic UI conventions that conflict with the documented design system.

## Output Expectations

When building or revising UI:

1. Summarize the relevant parts of `DESIGN.md` and `LAYOUT.md`.
2. Name the components and page sections you are about to create or restyle.
3. Implement the UI in the documented design language and structural system.
4. Call out any necessary inferences briefly.
```

## Packaging Checklist

- Replace all placeholder names.
- Put the final generated design system into the sibling `DESIGN.md`.
- Put the final generated structural system into the sibling `LAYOUT.md`.
- Make sure the skill references the local files, not an external URL.
- Keep the generated `SKILL.md` short enough to preload comfortably.

## Optional Additions

If useful, you may also add a short `README.md` to the generated skill package with:

- where the design came from
- when it was extracted
- any notable limitations
