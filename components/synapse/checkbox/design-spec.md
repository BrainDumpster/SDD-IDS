# Checkbox Design Spec

## IDS baseline (layout, flow, contracts)

Synapse **Checkbox** is an **ids-fork** of the IDS **Checkbox** family. Control geometry (16×16, `radius-2`), selection states (unchecked / checked / partial), indicator CSS geometry, focus ring, assistive text, and runtime API **inherit IDS** unless listed in **Synapse programme deltas** below.

- **IDS source of truth:** [`components/ids/checkbox/design-spec.md`](../ids/checkbox/design-spec.md)
- **Shared implementation:** `storybook/src/components/Checkbox.tsx`, `Checkbox.module.css`
- **Theme CSS:** `components/synapse-theme.css` (overrides `--checkbox-label-font-weight`; documents `--checkbox-control-radius`)
- **Base UI mapping:** native checkbox semantics (no Base UI primitive)

**Figma scope for this spec:** Synapse state matrix `8505:14296` and representative instance `8505:14297` (unchecked + label). Control tokens match IDS; programme delta is **label typography**.

## Metadata

| Property | Value |
|---|---|
| Component | Checkbox |
| Design system | Synapse |
| Category | Form Elements |
| Spec pattern | **ids-fork (override-only)** |
| IDS baseline slug | `checkbox` |
| Status | **active** |
| Version | 1.0.0 |
| Figma board node | `11067:54543` — [Checkbox](https://www.figma.com/design/Td1bnsvRj1PCGs9RVJkIvJ/Synapse-Hi-Fi-components?node-id=11067-54543&m=dev) |
| State matrix node | `8505:14296` |
| Spec-accurate instance | `8505:14297` (`Selected=No, State=Default, Option=Yes`) |
| IDS Figma matrix | `42151:53254` (IDS Design Library `0bHk3XhrjFhowgFkz9yLr4`) |
| Theme CSS | `components/synapse-theme.css` |
| Verification method | Figma MCP (`get_metadata`, `get_variable_defs`) + IDS baseline |
| Last verified | 2026-06-12 |

### Synapse programme deltas (vs IDS)

| Topic | IDS | Synapse (Figma `8505:14297`) |
|---|---|---|
| Label font-weight | `500` (Medium) | **`400`** (Body 2 Regular) via `var(--checkbox-label-font-weight)` |
| Label color (all selection rows) | Unchecked default: `var(--color-text-neutral-strong)`; checked/partial: `var(--color-text-neutral)` | **`var(--color-text-neutral)`** for all rows (Figma Body 2 Regular) |
| Control corner radius | `var(--corner-radius-radius-2)` (2px) | **Same** via `var(--checkbox-control-radius)` → `radius-2` |
| Control / indicator / border tokens | IDS contract | **Same** (inherit IDS) |
| State matrix structure | selection × interaction × optional validation | **Same** |
| Runtime API | IDS contract | **Same** (inherit IDS) |

## Anatomy

Inherit IDS **Anatomy** — see [`components/ids/checkbox/design-spec.md`](../ids/checkbox/design-spec.md).

## Layout & Measurements

Inherit IDS control size (16×16 + 1px border), gap `var(--spacing-space-8)`, min tap target 20px, indicator geometry, and focus ring from IDS **Layout & Measurements**.

Synapse-specific layout (alias-driven):

- Control corner radius: **`var(--checkbox-control-radius)`** → `var(--corner-radius-radius-2)` (unchanged from IDS)

## Tokens

### Layout / typography aliases (theme-resolvable)

| Alias | Synapse resolved value |
|---|---|
| `--checkbox-control-radius` | `var(--corner-radius-radius-2)` |
| `--checkbox-label-font-weight` | `400` |

### Colors, borders, states

Inherit IDS **Tokens** and **States** tables — same semantic `var(--...)` names for control box, border, background, and indicator.

Label typography resolves through `--checkbox-label-font-weight` on the wrapper row; color uses `var(--color-text-neutral)` per shared implementation.

## States (Light Theme)

Inherit IDS **States (Light Theme)** from [`components/ids/checkbox/design-spec.md`](../ids/checkbox/design-spec.md) for **Box Background / Box Border / Indicator** columns.

**Label column (Synapse override):** all rows use `var(--color-text-neutral)` (including unchecked default). Disabled row remains `var(--color-text-disabled)`.

## States (Dark Theme)

Dark theme uses the same semantic tokens as **States (Light Theme)**. Resolved values for `[data-theme="dark"]` / Synapse dark scope live in `components/synapse-theme.css`.

Duplicate the full state matrix in this section only when a dark row genuinely uses different `var(--...)` references than the corresponding light row.

## Interactions

Inherit IDS **Interactions**, error/assistive-text rules, and **Accessibility** from [`components/ids/checkbox/design-spec.md`](../ids/checkbox/design-spec.md).

## Composition & API (runtime)

### IDS inheritance resolution

Codegen **MUST** resolve the **group + projected item** composition API from IDS **Composition & API (runtime)** in [`components/ids/checkbox/design-spec.md`](../ids/checkbox/design-spec.md):

- **Group** (`CheckboxGroup` / `groupRoot`): `orientation`, group-level `disabled`, optional shared `name` / `idPrefix`
- **Item** (`ids-checkbox` / single checkbox row): `checked`, `defaultChecked`, `indeterminate`, `disabled`, `label`, `error`, `helperText`, `onCheckedChange`, etc.

Synapse adds **no** group- or item-level props beyond IDS. Programme typography is applied via `components/synapse-theme.css` (`--checkbox-label-font-weight`).

**IDS-fork note:** When IDS baseline adopts composition (e.g. `ids-checkbox-group` → `ids-checkbox`), Synapse specs inherit that API shape; update this section to point at the IDS group/item tables — do not document a flat `options[]` API as canonical.

### Storybook defaults

Mirror IDS Figma matrix `8505:14296` under **Spec Generated/Synapse/Checkbox** with `components/synapse-theme.css` imported.

## Codegen Contract (Framework-Agnostic Blueprint)

### IDS baseline resolution

Generators **MUST** load and merge the IDS baseline contract from [`components/ids/checkbox/design-spec.md`](../ids/checkbox/design-spec.md) (`## Codegen Contract`) before applying Synapse programme overrides below.

### Programme override rules

| Rule | IDS | Synapse |
|---|---|---|
| `label` row `font-weight` | `500` | **`var(--checkbox-label-font-weight)`** → `400` |
| `label` row `color` (non-disabled) | unchecked: `neutral-strong`; checked/partial: `neutral` | **`var(--color-text-neutral)`** all rows |
| `controlBox` `border-radius` | `var(--corner-radius-radius-2)` | **`var(--checkbox-control-radius)`** (same resolved value) |
| All other slots | IDS contract | **Inherit IDS** |

### Deterministic structure

Inherit IDS: optional `groupRoot` → repeated `checkboxItem` → `root` → `input` → `controlBox` → optional `indicator` → `label` → optional `assistiveText`.

### Variant matrix

Inherit IDS: selection (`unchecked | checked | partial`) × interaction (`default | hover | focus-visible | disabled`) × validation (`default | error`) × mode (`controlled | uncontrolled`).

### Per-slot style contract

| Slot | Property | Contract |
|---|---|---|
| `controlBox` | `border-radius` | `var(--checkbox-control-radius)` |
| `label` | `font-weight` | `var(--checkbox-label-font-weight, 500)` |
| `label` | `color` (enabled) | `var(--color-text-neutral)` |
| Indicator / borders / backgrounds | per IDS | Inherit IDS **Codegen Contract → Per-slot style contract** |

### Behavior contract

Inherit IDS toggle, indeterminate → checked transition, disabled blocking, and error assistive-text behavior.

### Accessibility contract

Inherit IDS native checkbox semantics, `aria-checked` (`true | false | mixed`), label association, `Space` toggle, focus-visible ring.

### Asset resolution + bundling contract

No image assets for control indicators — CSS-only check and indeterminate dash per IDS contract. Error assistive row may use `status-critical-square-solid` icon slug per IDS implementation notes.

### Fallback/error rules

Inherit IDS controlled/uncontrolled precedence, indeterminate precedence, and missing-label warning.

Programme additions:

- Import **`components/synapse-theme.css`** for Synapse targets so `--checkbox-label-font-weight` resolves to `400`.
- Never hardcode `400` / `500` in component CSS; use the alias.

### Validation checklist

- [x] IDS baseline linked; programme deltas list label typography + control radius alias
- [x] `--checkbox-label-font-weight` and `--checkbox-control-radius` in IDS + Synapse theme CSS
- [x] `Checkbox.module.css` uses typography and radius aliases
- [x] Codegen Contract subsections concrete (structure through fallback rules)
- [x] Composition/API resolves via IDS baseline; no Synapse-only props
- [x] Figma MCP evidence on `8505:14296` / `8505:14297` (radius-2, Body 2 Regular 400, text-neutral)
- [x] Storybook `Spec Generated/Synapse/Checkbox` loads `components/synapse-theme.css`
- [x] Registry: `data/programme-inheritance-registry.json` → `synapse` / `checkbox`

## Source Mapping

| Property | Value |
|---|---|
| IDS baseline | `components/ids/checkbox/design-spec.md` — file `0bHk3XhrjFhowgFkz9yLr4`, nodes `41895:299521`, matrix `42151:53254` |
| Programme spec | `components/synapse/checkbox/design-spec.md` |
| Synapse Figma file | `Td1bnsvRj1PCGs9RVJkIvJ` |
| Synapse board | `11067:54543` |
| Synapse state matrix | `8505:14296` |
| Synapse spec-accurate cell | `8505:14297` |
| Theme overrides | `components/synapse-theme.css` → `--checkbox-label-font-weight`, `--checkbox-control-radius` |
| Implementation | `storybook/src/components/Checkbox.tsx` |
| Programme wrapper | `storybook/src/components/SynapseCheckbox.tsx` |
| Spec contract | `storybook/src/spec-contracts/synapse-checkbox.contract.ts` |
| Storybook | `storybook/src/components/SynapseCheckbox.stories.tsx` |
| Verification | Figma MCP `get_variable_defs` on `8505:14297` (2026-06-12); `get_metadata` on `8505:14296` |
