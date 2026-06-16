# Segmented Button Design Spec

## IDS baseline (layout, flow, contracts)

Synapse **Segmented Button** is an **ids-fork** of the IDS **Segmented Button** family. Root shell, segment geometry, text/icon option types, selection model, state token bindings, and runtime API **inherit IDS** unless listed in **Synapse programme deltas** below.

- **IDS source of truth:** [`components/ids/segmented-button/design-spec.md`](../ids/segmented-button/design-spec.md)
- **Shared implementation:** `storybook/src/components/SegmentedButton.tsx`, `SegmentedButton.module.css`
- **Theme CSS:** `components/synapse-theme.css` (documents `--segmented-button-control-radius`)

**Figma scope:** Synapse documentation board `11067:54583` embeds the shared `SegmentedButton-Main` matrix (`8218:13149`) and element symbols (`10148:29600`, `10148:29576`). Live verification confirms **2px** corner radius and **Body 2 Regular (400)** segment labels.

## Metadata

| Property | Value |
|---|---|
| Component | Segmented Button |
| Design system | Synapse |
| Category | Form Elements |
| Spec pattern | **ids-fork (override-only)** |
| IDS baseline slug | `segmented-button` |
| Status | **active** |
| Version | 1.0.0 |
| Figma board node | `11067:54583` — [Segmented Button](https://www.figma.com/design/Td1bnsvRj1PCGs9RVJkIvJ/Synapse-Hi-Fi-components?node-id=11067-54583&m=dev) |
| State matrix node | `8218:13149` (`SegmentedButton-Main`) |
| Spec-accurate instance | `8218:13150` (`Type=Text, # Options=2, Option 2 State=Inactive`) |
| Text segment symbol | `10148:29607` (`Active=No, State=Default`) |
| Icon segment symbol | `10148:29597` (`Active=No, State=Default`) |
| IDS Figma matrix | `42113:67348` (IDS Design Library `0bHk3XhrjFhowgFkz9yLr4`) |
| Theme CSS | `components/synapse-theme.css` |
| Verification method | Figma MCP (`get_metadata`, `get_design_context`, `get_variable_defs`) + IDS baseline |
| Last verified | 2026-06-12 |

### Synapse programme deltas (vs IDS)

| Topic | IDS | Synapse (Figma `8218:13150` / `10148:29607`) |
|---|---|---|
| Root + segment corner radius | `var(--corner-radius-radius-2)` (**2px**) | **Same** via `var(--segmented-button-control-radius)` → `radius-2` |
| Segment label typography | Body 2 | **Body 2 Regular (`font-weight: 400`)** — Figma `Typography/Font Weight/regular` |
| Segment label color (unselected) | `var(--color-text-neutral)` | **Same** |
| Root border, gap, padding, states | IDS contract | **Same** (inherit IDS) |
| Type × option count matrix | text 2–5, icon 2–3 | **Same** |
| Runtime API | IDS contract | **Same** (inherit IDS) |

## Anatomy

Inherit IDS **Anatomy** — see [`components/ids/segmented-button/design-spec.md`](../ids/segmented-button/design-spec.md).

## Layout & Measurements

Inherit IDS root padding `var(--spacing-space-2)`, inter-segment gap, text row height `32px`, icon row height `37px`, and focus ring from IDS **Layout & Measurements**.

Synapse-specific layout (alias-driven):

- Root and segment `border-radius`: **`var(--segmented-button-control-radius)`** → `var(--corner-radius-radius-2)` (unchanged from IDS)

## Tokens

### Layout alias (theme-resolvable)

| Alias | Synapse resolved value |
|---|---|
| `--segmented-button-control-radius` | `var(--corner-radius-radius-2)` |

### Colors, borders, typography, states

Inherit IDS **Tokens** and **States** tables — same semantic `var(--...)` names.

Segment labels use Body 2 Regular (`font-weight: 400`) per Figma; unselected label `var(--color-text-neutral)`, selected `var(--color-text-white)`.

## States (Light Theme)

Inherit IDS **States (Light Theme)** from [`components/ids/segmented-button/design-spec.md`](../ids/segmented-button/design-spec.md) for **Text segments** and **Icon segments** tables.

Synapse chrome applies only via `--segmented-button-control-radius`; **Background / Border / Label / Icon cells are unchanged** from IDS.

## States (Dark Theme)

Dark theme uses the same semantic tokens as **States (Light Theme)**. Resolved values for `[data-theme="dark"]` live in `components/synapse-theme.css`.

Duplicate the full state matrix in this section only when a dark row genuinely uses different `var(--...)` references than the corresponding light row.

## Interactions

Inherit IDS **Interactions** — single-select, hover/press/focus on unselected segments, radiogroup keyboard model, disabled extension.

## Composition & API (runtime)

### IDS inheritance resolution

Codegen **MUST** resolve `type`, `items`, `value` / `defaultValue`, `onChange`, `disabled`, `ariaLabel`, icon slug resolution, and `SegmentedButtonSegment` shapes from IDS **Composition & API (runtime)** in [`components/ids/segmented-button/design-spec.md`](../ids/segmented-button/design-spec.md).

### Synapse-only runtime flags

None.

### Storybook defaults

Mirror Figma matrix `8218:13149` under **Spec Generated/Synapse/Segmented Button** with `components/synapse-theme.css` imported.

## Codegen Contract (Framework-Agnostic Blueprint)

### IDS baseline resolution

Generators **MUST** load and merge the IDS baseline contract from [`components/ids/segmented-button/design-spec.md`](../ids/segmented-button/design-spec.md) (`## Codegen Contract`) before applying Synapse programme overrides below.

### Programme override rules

| Rule | IDS | Synapse |
|---|---|---|
| `root` / `segmentSurface` `border-radius` | `var(--corner-radius-radius-2)` | **`var(--segmented-button-control-radius)`** (same resolved value) |
| `segmentLabel` `font-weight` | Body 2 (implementation: 400) | **400** (Figma Regular — explicit in Synapse evidence) |
| All other slots | IDS contract | **Inherit IDS** |

### Deterministic structure

Inherit IDS: `root` → `segment[]` → `segmentSurface` + (`segmentLabel` | `segmentIcon`).

### Variant matrix

Inherit IDS: `(text × 2..5) ∪ (icon × 2..3)` × per-segment interaction × single selection.

### Per-slot style contract

| Slot | Property | Contract |
|---|---|---|
| `root` | `border-radius` | `var(--segmented-button-control-radius)` |
| `segmentSurface` | `border-radius` | `var(--segmented-button-control-radius)` |
| `segmentLabel` | `font-weight` | `400` (Body 2 Regular) |
| Borders / backgrounds / icons | per IDS | Inherit IDS **Codegen Contract → Per-slot style contract** |

### Behavior contract

Inherit IDS selection, `onChange` meta (`label` | `ariaLabel`), disabled skip, no deselect-all on re-click.

### Accessibility contract

Inherit IDS radiogroup semantics, arrow keys, `aria-checked`, root labeling.

### Asset resolution + bundling contract

Inherit IDS slug → `assets/icons/<slug>.svg` and custom `IconSlot` rules. Reference slugs: `view-hamburger`, `nav-tree`, `view-sort-grid-solid`.

### Fallback/error rules

Inherit IDS invalid count, missing slug, duplicate `value`, and missing label/icon warnings.

Programme additions:

- Import **`components/synapse-theme.css`** for Synapse targets (alias resolves same as IDS).
- Never hardcode `2px` radius; use `--segmented-button-control-radius`.

### Validation checklist

- [x] IDS baseline linked; programme deltas document radius alias + label weight evidence
- [x] `--segmented-button-control-radius` in IDS + Synapse theme CSS
- [x] `SegmentedButton.module.css` uses control radius alias on root and segments
- [x] Codegen Contract subsections concrete
- [x] Figma MCP evidence on `8218:13150` (radius 2px, Body 2 Regular 400)
- [x] Storybook `Spec Generated/Synapse/Segmented Button` loads `components/synapse-theme.css`
- [x] Registry: `data/programme-inheritance-registry.json` → `synapse` / `segmented-button`

## Source Mapping

| Property | Value |
|---|---|
| IDS baseline | `components/ids/segmented-button/design-spec.md` — file `0bHk3XhrjFhowgFkz9yLr4`, node `42113:67348` |
| Programme spec | `components/synapse/segmentedbutton/design-spec.md` |
| Synapse Figma file | `Td1bnsvRj1PCGs9RVJkIvJ` |
| Synapse board | `11067:54583` |
| Synapse state matrix | `8218:13149` |
| Synapse spec-accurate cell | `8218:13150` |
| Theme | `components/synapse-theme.css` → `--segmented-button-control-radius` |
| Implementation | `storybook/src/components/SegmentedButton.tsx` |
| Programme wrapper | `storybook/src/components/SynapseSegmentedButton.tsx` |
| Spec contract | `storybook/src/spec-contracts/synapse-segmented-button.contract.ts` |
| Storybook | `storybook/src/components/SynapseSegmentedButton.stories.tsx` |
| Verification | Figma MCP `get_design_context` on `8218:13150` (2026-06-12); `get_metadata` on `11067:54583` |
