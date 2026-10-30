# Radio Button Design Spec

## IDS baseline (layout, flow, contracts)

Synapse **Radio Button** is an **ids-fork** of the IDS **Radio Button** family. Circular control (16×16, 8px dot), group single-selection behavior, option-row hover hit target, assistive text, and runtime API **inherit IDS** unless listed in **Synapse programme deltas** below.

- **IDS source of truth:** [`components/ids/radio-button/design-spec.md`](../ids/radio-button/design-spec.md)
- **Shared implementation:** `storybook/src/components/RadioButton.tsx`, `RadioButton.module.css`
- **Theme CSS:** `components/synapse-theme.css` (overrides `--radio-label-font-weight`)

**Figma scope:** Synapse state matrix `8505:14225` and representative instance `11537:97665` (unselected + label). Control tokens match IDS; programme delta is **label typography**.

## Metadata

| Property | Value |
|---|---|
| Component | Radio Button |
| Design system | Synapse |
| Category | Form Elements |
| Spec pattern | **ids-fork (override-only)** |
| IDS baseline slug | `radio-button` |
| Status | **active** |
| Version | 1.0.0 |
| Figma board node | `11067:54579` — [Radio Button](https://www.figma.com/design/Td1bnsvRj1PCGs9RVJkIvJ/Synapse-Hi-Fi-components?node-id=11067-54579&m=dev) |
| State matrix node | `8505:14225` |
| Spec-accurate instance | `11537:97665` (`Selected=False, State=Default, Option=Yes`) |
| IDS Figma matrix | `42077:26730` (IDS Design Library `0bHk3XhrjFhowgFkz9yLr4`) |
| Theme CSS | `components/synapse-theme.css` |
| Verification method | Figma MCP (`get_metadata`, `get_variable_defs`) + IDS baseline |
| Last verified | 2026-06-12 |

### Synapse programme deltas (vs IDS)

| Topic | IDS | Synapse (Figma `11537:97665`) |
|---|---|---|
| Label font-weight | `500` (Medium) | **`400`** (Body 2 Regular) via `var(--radio-label-font-weight)` |
| Label color | `var(--color-text-neutral)` | **Same** (inherit IDS) |
| Control geometry / tokens | IDS contract | **Same** (inherit IDS) |
| Group keyboard model | IDS contract | **Same** (inherit IDS) |
| Runtime API | IDS contract | **Same** (inherit IDS) |

## Anatomy

Inherit IDS **Anatomy** — see [`components/ids/radio-button/design-spec.md`](../ids/radio-button/design-spec.md).

## Layout & Measurements

Inherit IDS outer ring 16×16, inner dot 8×8, gap `var(--spacing-space-8)`, min hit area 20px, and focus ring from IDS **Layout & Measurements**.

## Tokens

### Typography alias (theme-resolvable)

| Alias | Synapse resolved value |
|---|---|
| `--radio-label-font-weight` | `400` |

### Colors, borders, states

Inherit IDS **Tokens** and **States** tables — same semantic `var(--...)` names.

## States (Light Theme)

Inherit IDS **States (Light Theme)** from [`components/ids/radio-button/design-spec.md`](../ids/radio-button/design-spec.md).

Synapse applies only label `font-weight` via `--radio-label-font-weight`; **Background / Border / Inner Dot / Label color cells are unchanged** from IDS.

## States (Dark Theme)

Dark theme uses the same semantic tokens as **States (Light Theme)**. Resolved values for `[data-theme="dark"]` live in `components/synapse-theme.css`.

## Interactions

Inherit IDS **Interactions** and **Accessibility** from [`components/ids/radio-button/design-spec.md`](../ids/radio-button/design-spec.md).

## Composition & API (runtime)

### IDS inheritance resolution

Codegen **MUST** resolve the **group + projected item** composition API from IDS **Composition & API (runtime)** in [`components/ids/radio-button/design-spec.md`](../ids/radio-button/design-spec.md):

- **Group** (`RadioButtonGroup` / `groupRoot`): `name`, `value` / `defaultValue`, `valueChange`, `orientation`, group-level `disabled`
- **Item** (`ids-radio-button` / single option row): `value`, `label`, `disabled`, `error`, `helperText`, etc.

Synapse adds **no** group- or item-level props beyond IDS. Programme typography is applied via `components/synapse-theme.css` (`--radio-label-font-weight`).

**Legacy aggregate (React only):** `RadioButton` with `options[]` in `storybook/src/components/RadioButton.tsx` remains a convenience wrapper for Synapse React Storybook; composition is canonical for new ports (see IDS **Legacy aggregate**).

### Storybook defaults

Mirror IDS / Synapse Figma matrix `8505:14225` under **Spec Generated/Synapse/Radio Button** with `components/synapse-theme.css` imported.

## Codegen Contract (Framework-Agnostic Blueprint)

### IDS baseline resolution

Generators **MUST** load and merge the IDS baseline contract from [`components/ids/radio-button/design-spec.md`](../ids/radio-button/design-spec.md) (`## Codegen Contract`) before applying Synapse programme overrides below.

### Programme override rules

| Rule | IDS | Synapse |
|---|---|---|
| Option row `label` `font-weight` | `500` | **`var(--radio-label-font-weight)`** → `400` |
| Control / dot / border tokens | IDS contract | **Inherit IDS** |

### Deterministic structure

Inherit IDS: optional `groupRoot` → `radioItem[]` → `input` → `controlOuter` → `controlInnerDot` → `label` → optional `assistiveText`.

### Variant matrix

Inherit IDS: selection (`unselected | selected`) × interaction (`default | hover | focus-visible | disabled`) × validation (`default | error`) × orientation (`vertical | horizontal`).

### Per-slot style contract

| Slot | Property | Contract |
|---|---|---|
| `label` | `font-weight` | `var(--radio-label-font-weight, 500)` |
| `controlOuter` / `controlInnerDot` | per IDS | Inherit IDS **Codegen Contract → Per-slot style contract** |

### Behavior contract

Inherit IDS single-select group behavior, arrow-key navigation, hover on full row, and disabled skip rules.

### Accessibility contract

Inherit IDS `radiogroup` semantics, roving tabindex or native radio group pattern, `aria-*` on disabled options, keyboard model.

### Asset resolution + bundling contract

No control image assets. Error assistive row may use `status-critical-square-solid` per IDS implementation notes.

### Fallback/error rules

Inherit IDS unknown value, empty options, and duplicate `value` warnings.

Programme additions:

- Import **`components/synapse-theme.css`** for Synapse targets.
- Never hardcode `400` / `500` in component CSS; use `--radio-label-font-weight`.

### Validation checklist

- [x] IDS baseline linked; programme delta lists label font-weight alias only
- [x] `--radio-label-font-weight` in IDS + Synapse theme CSS
- [x] `RadioButton.module.css` uses typography alias on `.wrapper`
- [x] Codegen Contract subsections concrete
- [x] Composition/API resolves via IDS baseline; no Synapse-only props
- [x] Figma MCP evidence on `8505:14225` / `11537:97665` (Body 2 Regular 400, accessible border, text-neutral)
- [x] Storybook `Spec Generated/Synapse/Radio Button` loads `components/synapse-theme.css`
- [x] Registry: `data/programme-inheritance-registry.json` → `synapse` / `radio-button`

## Source Mapping

| Property | Value |
|---|---|
| IDS baseline | `components/ids/radio-button/design-spec.md` — file `0bHk3XhrjFhowgFkz9yLr4`, nodes `42077:26737`, matrix `42077:26730` |
| Programme spec | `components/synapse/radio-button/design-spec.md` |
| Synapse Figma file | `Td1bnsvRj1PCGs9RVJkIvJ` |
| Synapse board | `11067:54579` |
| Synapse state matrix | `8505:14225` |
| Synapse spec-accurate cell | `11537:97665` |
| Theme override | `components/synapse-theme.css` → `--radio-label-font-weight` |
| Implementation | `storybook/src/components/RadioButton.tsx` |
| Programme wrapper | `storybook/src/components/SynapseRadioButton.tsx` |
| Spec contract | `storybook/src/spec-contracts/synapse-radio-button.contract.ts` |
| Storybook | `storybook/src/components/SynapseRadioButton.stories.tsx` |
| Verification | Figma MCP `get_variable_defs` on `11537:97665` (2026-06-12); `get_metadata` on `8505:14225` |
