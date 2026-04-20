---
name: design-spec-blueprint
description: Build production-ready, framework-agnostic design-spec blueprints from Figma and token sources.
---

# Design-Spec Blueprint Skill

Use this skill when creating or upgrading design specs for spec-driven code generation, for example **`components/ids/<component>/design-spec.mdx`** (IDS) or **`components/synapse/<component>/design-spec.mdx`** (Synapse).

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
2. Run live Figma verification using MCP tools (preferred) or Figma REST API:
   - metadata/structure for the target node(s)
   - variable/token bindings for those node(s)
   - variant/state evidence from main + elements/component-set nodes
3. Validate Figma nodes/frames used for extraction.
4. Extract variant axes, dimensions, spacing, typography, and token bindings.
5. Document runtime behavior and accessibility requirements.
6. Add deterministic fallback/error rules.
7. Add pass/fail validation checklist.

## Mandatory Live Verification Rule

- For any "create design-spec", "update design-spec", or "verify design-spec" request, you MUST connect to Figma live (MCP/API) before finalizing.
- Do not rely solely on existing repository spec text or user-provided URLs without fetching live node data.
- Capture verification evidence in the spec `Metadata` and `Source Mapping` sections (file key, node IDs, verification method).

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

