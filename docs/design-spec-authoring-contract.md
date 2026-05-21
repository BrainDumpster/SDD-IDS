# Design-spec authoring contract (IDE-agnostic)

Portable rules for creating or updating `design-spec.mdx` files. Used by the [design-spec intake wizard](design-spec-intake.md), Cursor skills, and any AI agent (Cursor, Windsurf Cascade, Devin).

## Programmes and output paths

Resolve the programme from `config/design_systems/<name>.yaml`. Valid programmes: **IDS**, **DAP**, **Synapse** (case-insensitive slug: `ids`, `dap`, `synapse`).

| Programme | Components directory | Figma map (typical) |
|-----------|----------------------|---------------------|
| IDS | `components/ids` | `data/component-figma-map.json` |
| DAP | `components/DAP` | `data/component-figma-map.json` |
| Synapse | `components/synapse` | `data/synapse-component-figma-map.json` |

**Path provisioning (before writing the spec):**

1. Reject unknown programme names; list valid options from `config/design_systems/*.yaml`.
2. `mkdir -p` `{components_dir}` if missing.
3. Slugify component display name (lowercase, spaces/slashes → `-`, e.g. `Datagrid` → `datagrid`).
4. `mkdir -p` `{components_dir}/{slug}/`.
5. Output file: `{components_dir}/{slug}/design-spec.mdx`.
6. Update or add a map entry with `designSpecPath`, `figmaUrl`, `nodeId`, `fileKey`, and supplemental node IDs as needed.

DAP components use `components/DAP/<slug>/`, not `components/ids/`, unless the component is IDS-only.

## Required `##` sections (fixed order)

1. `## Metadata` — Version, Description, Status (`draft` | `active` | `deprecated`), Created, Updated, Figma verification evidence
2. `## Anatomy`
3. `## Layout & Measurements`
4. `## Tokens` (use `### Typography`, `### Colors`, etc.)
5. `## States (Light Theme)`
6. `## States (Dark Theme)`
7. `## Interactions` (`### Accessibility`, `### Behavior & guidelines` when needed)
8. `## Composition & API (runtime)` (`### Variants`, `### Runtime API`)
9. `## Codegen Contract (Framework-Agnostic Blueprint)`
10. `## Source Mapping`

Do not add extra top-level `##` headings.

Reference implementations: `components/ids/alert/design-spec.mdx`, `components/ids/accordion/design-spec.mdx`.

## Required `###` subsections under Codegen Contract

- `### Deterministic structure`
- `### Variant matrix`
- `### Per-slot style contract`
- `### Behavior contract`
- `### Accessibility contract`
- `### Asset resolution + bundling contract`
- `### Fallback/error rules`
- `### Validation checklist` (pass/fail checkboxes)

Replace cross-refs with concrete contracts before **Status: active**.

## Live Figma verification (mandatory)

Before finalizing a new or updated spec:

- Fetch live data from Figma — **MCP preferred** (`get_design_context`, `get_metadata`, variables) or **REST API** when MCP is unavailable (`FIGMA_TOKEN` in `.env`).
- Do not finalize from repo text or URLs alone without a live fetch.
- Record in **Metadata** and **Source Mapping**: file key, node IDs used, verification method (`Figma MCP` | `Figma REST API`), date/session.

Minimum checks per node: structure/dimensions, variable/token bindings, variant/state evidence.

## Authoring constraints

- Prefer semantic tokens: `` `var(--token-name)` ``.
- Never hardcode colors, spacing, typography, radius, border width, or motion in guidance.
- **States dedupe:** When Light and Dark use the same `var(--...)` in every cell, matrix only under **States (Light Theme)**; use `DARK_STATES_BOILERPLATE` from `scripts/design_spec_template.py` under Dark.
- Full Dark table only when dark rows use different `var(--...)` than light (parallel row/column structure).
- State names: `default | hover | press | focus-visible | disabled`.
- Avoid TBD, “usually”, “maybe” without a rule.

## Production-ready gate

A spec is production-ready only when:

- All required sections are complete.
- No unresolved TODO/TBD in behavior-critical content.
- Codegen Contract is testable (concrete, not only “see above”).
- Source mapping is explicit and reproducible.
- Live Figma evidence is documented.

New specs should use **Status: draft** until the validation checklist passes.

## Storybook (Spec Generated + Spec Accurate Design)

When the user requests Storybook examples (intake wizard question 7 = `yes`), generate or update stories using the **Spec Accurate Design** principle under the **Spec Generated** Storybook group.

### Spec Generated group

| Programme | Meta `title` |
|-----------|----------------|
| IDS | `Spec Generated/IDS/<Component Display Name>` |
| DAP | `Spec Generated/DAP/<Component Display Name>` |

Output path pattern: `storybook-generated/<programme>/src/components/<Component>.stories.tsx`

Import exactly one theme CSS in the story file: `components/ids-theme.css` (IDS) or `components/dap-theme.css` (DAP).

### Spec Accurate Design (primary story)

- **Story name:** `Spec Accurate Design` (required primary story)
- Proves `design-spec.mdx` is machine-consumable: layout, tokens, states, and codegen contract without guessing
- Story `args` / sample data must align with **Composition & API (runtime)** and any spec subsection titled **Spec Accurate Design story defaults**
- Styles use semantic tokens (`var(--...)`) only
- Additional variant stories may exist under the same Meta title but must not replace Spec Accurate Design as the canonical reference

Reference implementations: `storybook-generated/ids/src/components/MainMenuLeft.stories.tsx`, `generation/deterministic_storybook/ids/main_menu_left.py`

### Metadata

Record: `Storybook examples requested: yes`, generated story file path, and `Spec Generated/<PROGRAMME>/<name>` title.

## Scaffold template

When creating a new file, use section order and bootstrap blocks from `scripts/design_spec_template.py` (`NEW_SPEC_TEMPLATE`, `DARK_STATES_BOILERPLATE`, `CODEGEN_BOOTSTRAP`).
