# Design-spec authoring contract (IDE-agnostic)

Portable rules for creating or updating `design-spec.md` files. Used by the [design-spec intake wizard](design-spec-intake.md), Cursor skills, and any AI agent (Cursor, Windsurf Cascade, Devin).

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
5. Output file: `{components_dir}/{slug}/design-spec.md`.
6. Update or add a map entry with `designSpecPath`, `figmaUrl`, `nodeId`, `fileKey`, and supplemental node IDs as needed.

DAP components use `components/DAP/<slug>/`, not `components/ids/`, unless the component is IDS-only.

## Synapse when IDS is the base (IDS-fork pattern)

When Synapse Figma reuses the same component family as IDS (same anatomy / component-set name) with programme token or chrome changes:

1. Create **`components/synapse/<slug>/design-spec.md`** (full spec — not deltas-only).
2. Open with **`## IDS baseline (layout, flow, contracts)`** linking to `components/ids/<ids-slug>/design-spec.md`.
3. Add **`### Synapse programme deltas (vs IDS)`** with every verified difference.
4. Live-verify **Synapse** Figma nodes; record evidence in Metadata + Source Mapping.
5. Register the component in [`data/programme-inheritance-registry.json`](../data/programme-inheritance-registry.json).

**User process (all programmes):** [`design-spec-programme-inheritance.md`](design-spec-programme-inheritance.md) · skill: [`.cursor/skills/design-spec-programme-inheritance/SKILL.md`](../.cursor/skills/design-spec-programme-inheritance/SKILL.md). Registry: [`data/programme-inheritance-registry.json`](../data/programme-inheritance-registry.json). Scaffold: `PROGRAMME_IDS_FORK_TEMPLATE`. Synapse walkthrough: [`design-spec-synapse-ids-fork.md`](design-spec-synapse-ids-fork.md).

## Programme standalone (no IDS inheritance)

When a component is **native to a programme** Figma file and has **no IDS counterpart** (e.g. Synapse Suggested Prompt, Chat Input Box, Thinking):

1. Use the [design-spec intake wizard](design-spec-intake.md) with **`Inherits IDS: no`** — not programme inheritance.
2. Create **`{components_dir}/<slug>/design-spec.md`** — full spec, **no** IDS baseline section.
3. Metadata must include **`Spec pattern: standalone`**, programme `display_name`, and `{theme_css_path}`.
4. Live-verify **programme** Figma nodes only; do not copy IDS specs.
5. Figma map: `specPattern: standalone` (no `idsBaselineSpecPath`).
6. Scaffold: `PROGRAMME_STANDALONE_TEMPLATE` in `scripts/design_spec_template.py`.

**Reference:** [`components/synapse/suggested-prompt/design-spec.md`](../components/synapse/suggested-prompt/design-spec.md).

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

Replace cross-refs with concrete contracts before **Status: active**.

## Live Figma verification (mandatory)

Before finalizing a new or updated spec:

- Fetch live data from Figma — **MCP preferred** (`get_design_context`, `get_metadata`, variables) or **REST API** when MCP is unavailable (`FIGMA_TOKEN` in `.env`).
- Do not finalize from repo text or URLs alone without a live fetch.
- Record in **Metadata** and **Source Mapping**: file key, node IDs used, verification method (`Figma MCP` | `Figma REST API`), date/session.

Minimum checks per node: structure/dimensions, variable/token bindings, variant/state evidence.

### Slot geometry gate (mandatory — prevents radius / shell drift)

Every spec **must** include `### Slot geometry (Figma-verified)` under **Layout & Measurements** (scaffold: `scripts/design_spec_template.py` → `SLOT_GEOMETRY_BOILERPLATE`).

| Column | Requirement |
|--------|-------------|
| Slot / layer | Anatomy slot or Figma layer name (e.g. `FieldContainer`, `FocusRing`) |
| Property | e.g. `border-radius`, `min-height`, `padding` when codegen-critical |
| Token / contract | Semantic token or alias **after** Figma value is known |
| Figma node | Concrete node id (e.g. `12579:77895`) |
| Live evidence | MCP method used (`get_variable_defs` **required** for radius bindings) |

**Forbidden:**
- Documenting field/menu `border-radius` from `ids-theme.css`, Button convention, or programme fork tables **without** a Figma node row.
- Treating missing `border-radius` in `get_design_context` code as proof of 0px — always call `get_variable_defs` on the Container node.

**Enforcement:**
```bash
python3 scripts/validate_spec_geometry_gate.py --component dropdown-single-select
python3 scripts/validate_spec_geometry_gate.py --all --warn-only   # audit repo
```

Production-ready specs must pass `SpecContractParser.validate_slot_geometry_gate()` with zero errors.

## Authoring constraints

- Prefer semantic tokens: `` `var(--token-name)` ``.
- Never hardcode colors, spacing, typography, radius, border width, or motion in guidance.
- **Component layout aliases:** When a layout value may differ by programme (radius, focus ring, etc.), IDS specs reference **component aliases** (e.g. `var(--button-control-radius)`). Define IDS defaults in `components/ids-theme.css`; programmes override the **same alias name** in programme theme CSS. Programme fork specs document alias deltas in the programme deltas table — not duplicate values in component CSS. Reference: [`components/ids/button/design-spec.md`](../components/ids/button/design-spec.md).
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
| Synapse | `Spec Generated/Synapse/<Component Display Name>` |

Output path pattern: `storybook-generated/<programme>/src/components/<Component>.stories.tsx`

Import exactly one theme CSS in the story file: `components/ids-theme.css` (IDS), `components/dap-theme.css` (DAP), or `components/synapse-theme.css` (Synapse).

IDS-fork programme components use the programme story path and theme; see [`design-spec-programme-inheritance.md`](design-spec-programme-inheritance.md) and Synapse examples in [`design-spec-synapse-ids-fork.md`](design-spec-synapse-ids-fork.md).

### Spec Accurate Design (primary story)

- **Story name:** `Spec Accurate Design` (required primary story)
- Proves `design-spec.md` is machine-consumable: layout, tokens, states, and codegen contract without guessing
- Story `args` / sample data must align with **Composition & API (runtime)** and any spec subsection titled **Spec Accurate Design story defaults**
- Styles use semantic tokens (`var(--...)`) only
- Additional variant stories may exist under the same Meta title but must not replace Spec Accurate Design as the canonical reference

Reference implementations: `storybook-generated/ids/src/components/MainMenuLeft.stories.tsx`, `generation/deterministic_storybook/ids/main_menu_left.py`, `storybook-generated/synapse/src/components/LeftNav.stories.tsx` (IDS-fork)

### Metadata

Record: `Storybook examples requested: yes`, generated story file path, and `Spec Generated/<PROGRAMME>/<name>` title.

## Scaffold template

When creating a new file, use section order and bootstrap blocks from `scripts/design_spec_template.py` (`NEW_SPEC_TEMPLATE`, `DARK_STATES_BOILERPLATE`, `CODEGEN_BOOTSTRAP`).
