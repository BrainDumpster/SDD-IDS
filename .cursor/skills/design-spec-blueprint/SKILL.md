---
name: design-spec-blueprint
description: Build production-ready, framework-agnostic design-spec blueprints from Figma and token sources.
---

# Design-Spec Blueprint Skill

Use this skill when creating or upgrading design specs for spec-driven code generation, for example **`components/ids/<component>/design-spec.md`** (IDS) or **`components/synapse/<component>/design-spec.md`** (Synapse).

## New spec? Start with the intake wizard

If the user wants a **new** `design-spec.md` and has not supplied programme, component name, and Figma URLs together, run **design-spec-intake-wizard** first (or point them to `docs/design-spec-intake.md` **base prompt**). Do not skip the interview and confirm step. After the file exists, use this blueprint skill for hardening and updates.

**Programme inheriting from IDS (any programme):** run **design-spec-programme-inheritance** (`PROGRAMME_IDS_FORK_TEMPLATE`, programme deltas table).

## Objective

Produce deterministic, production-ready specs that can generate components across frameworks (React, Angular, Vue, Lit, etc.) without hidden assumptions.

## Required `##` sections (fixed order)

1. `## Metadata` — include Version, Description, Status (`draft` | `active` | `deprecated`), Created, Updated, Figma proof
2. `## Anatomy`
3. `## Layout & Measurements`
4. `## Tokens` (use `### Typography`, `### Colors`, etc. — not a top-level `## Typography`)
5. `## States (Light Theme)`
6. `## States (Dark Theme)`
7. `## Interactions` (use `### Accessibility`, `### Behavior & guidelines` when needed)
8. `## Composition & API (runtime)` (use `### Variants`, `### Runtime API`, component-specific contracts)
9. `## Codegen Contract (Framework-Agnostic Blueprint)` — see subsection list below
10. `## Source Mapping`

Do not add extra top-level `##` headings; use `###` under the nearest parent.

Reference implementations: `components/ids/alert/design-spec.md`, `components/ids/accordion/design-spec.md`.

## Required `###` subsections under Codegen Contract

- `### Deterministic structure`
- `### Variant matrix`
- `### Per-slot style contract`
- `### Behavior contract`
- `### Accessibility contract`
- `### Asset resolution + bundling contract`
- `### Fallback/error rules`
- `### Validation checklist` (pass/fail checkboxes)

Legacy specs may bootstrap Codegen with cross-references to Anatomy / Interactions / Composition until hardened; replace cross-refs with concrete contracts before marking **Status: active**.

## Normalize existing IDS specs

From repository root:

```bash
python3 scripts/normalize_design_spec_headings.py
```

Legacy-only pass (specs that lacked Codegen before):

```bash
python3 scripts/normalize_design_spec_headings.py --legacy-only
```

## New spec scaffold from Figma map

```bash
python3 scripts/generate_specs_from_map.py --overwrite
```

Uses `scripts/design_spec_template.py` (`NEW_SPEC_TEMPLATE`) for canonical headings.

## Extraction Workflow

1. Resolve component source from design-system map file.
2. Run live Figma verification using MCP tools (preferred) or Figma REST API:
   - metadata/structure for the target node(s)
   - variable/token bindings for those node(s)
   - variant/state evidence from main + elements/component-set nodes
3. Validate Figma nodes/frames used for extraction.
4. **Slot geometry gate:** Under Layout & Measurements, add `### Slot geometry (Figma-verified)` with one row per shell/layer (field, focus ring, menu, inner wrappers). For every `border-radius` row, call `get_variable_defs` on the cited Figma node — do not document radius from theme aliases or sibling components alone.
5. Extract variant axes, dimensions, spacing, typography, and token bindings.
6. Document runtime behavior and accessibility requirements.
7. Add deterministic fallback/error rules.
8. Add pass/fail validation checklist (include geometry gate items from template).

Run geometry QA before marking **Status: active**:
```bash
python3 scripts/validate_spec_geometry_gate.py --component <slug>
```

## Mandatory Live Verification Rule

- For any "create design-spec", "update design-spec", or "verify design-spec" request, you MUST connect to Figma live (MCP/API) before finalizing.
- Do not rely solely on existing repository spec text or user-provided URLs without fetching live node data.
- Capture verification evidence in `Metadata` and `Source Mapping` (file key, node IDs, verification method).
- Add **`### Slot geometry (Figma-verified)`** under Layout & Measurements; radius rows require `get_variable_defs` on the cited node (see `docs/design-spec-authoring-contract.md`).

## Authoring Constraints

- Prefer semantic tokens (`var(--...)`) over literals.
- If a literal is unavoidable (e.g., sample-only value), mark it as sample and define runtime rule.
- **States dedupe (new specs):** When Light and Dark would list identical `var(--...)` in every state cell, document the matrix only under **States (Light Theme)**. Under **States (Dark Theme)**, paste `DARK_STATES_BOILERPLATE` from `scripts/design_spec_template.py` (also embedded in `NEW_SPEC_TEMPLATE`). Resolved dark values belong in theme CSS (`components/ids-theme.css`, program overlays), not a duplicate table.
- Keep a full **States (Dark Theme)** table only when dark uses different `var(--...)` per row than light; then both tables must be structurally parallel.
- Do not dedupe specs with authoritative `#hex` / `rgb()` in state cells without `var(--...)` until tokens exist.
- Batch-fix legacy duplicate tables: `python3 scripts/dedupe_states_dark_theme.py --apply` (conservative; skips literal-only cells).
- Avoid ambiguous words: "usually", "maybe", "as needed" without a rule.
- Keep naming normalized:
  - states: `default | hover | press | focus-visible | disabled`
  - booleans: `showX`, `isX`, `enableX`
  - events: `onX`

## Storybook (Spec Generated / Spec Accurate Design)

When generating or updating Storybook for a component with `Storybook examples requested: yes` in Metadata:

- Meta `title`: `Spec Generated/IDS/<Name>` or `Spec Generated/DAP/<Name>` (not `Components/...`).
- Primary story **name**: `Spec Accurate Design` — canonical spec → UI parity for codegen/QA.
- Import one programme theme CSS; story args must match spec **Composition & API** and any **Spec Accurate Design story defaults** section.
- See `docs/design-spec-authoring-contract.md` and `generation/deterministic_storybook/helpers.py`.

## Production-Ready Definition

A spec is production-ready only when:

- All required sections are complete.
- No unresolved TODO/TBD/placeholder text exists.
- Codegen Contract is testable and internally consistent (concrete contracts, not only cross-refs).
- Source mapping is explicit and reproducible.
- When Storybook was requested: **Spec Accurate Design** exists under **Spec Generated/<programme>/...** and references this spec path.
