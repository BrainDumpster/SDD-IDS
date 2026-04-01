---
name: design-spec-blueprint
description: Build production-ready, framework-agnostic design-spec blueprints from Figma and token sources.
---

# Design-Spec Blueprint Skill

Use this skill when creating or upgrading `components/<design-system>/<component>/design-spec.mdx` for spec-driven code generation.

## Objective

Produce deterministic, production-ready specs that can generate components across frameworks (React, Angular, Vue, Lit, etc.) without hidden assumptions.

## Required Sections (must exist)

- `## Metadata`
- `## Anatomy`
- `## Layout & Measurements`
- `## Tokens`
- `## States (Light Theme)`
- `## States (Dark Theme)`
- `## Interactions`
- `## Composition & API (runtime)`
- `## Codegen Contract (Framework-Agnostic Blueprint)`
- `## Source Mapping`

## Extraction Workflow

1. Resolve component source from design-system map file.
2. Validate Figma nodes/frames used for extraction.
3. Extract variant axes, dimensions, spacing, typography, and token bindings.
4. Document runtime behavior and accessibility requirements.
5. Add deterministic fallback/error rules.
6. Add pass/fail validation checklist.

## Codegen Contract Requirements

Include all of the following:

- Deterministic slot schema (required order and optional branches)
- Full variant/option matrix (all valid combinations)
- Per-slot style contract (tokenized)
- Behavior contract (transitions, timing, triggers)
- Accessibility contract (roles, keyboard, ARIA)
- Asset + bundling contract (if icons/images are used)
- Fallback/error handling
- Validation checklist

## Authoring Constraints

- Prefer semantic tokens (`var(--...)`) over literals.
- If a literal is unavoidable (e.g., sample-only value), mark it as sample and define runtime rule.
- Keep light/dark tables structurally parallel.
- Avoid ambiguous words: "usually", "maybe", "as needed" without a rule.
- Keep naming normalized:
  - states: `default | hover | press | focus-visible | disabled`
  - booleans: `showX`, `isX`, `enableX`
  - events: `onX`

## Production-Ready Definition

A spec is production-ready only when:

- All required sections are complete.
- No unresolved TODO/TBD/placeholder text exists.
- Codegen Contract is testable and internally consistent.
- Source mapping is explicit and reproducible.

