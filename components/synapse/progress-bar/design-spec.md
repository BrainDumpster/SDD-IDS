# Progress Bar Design Spec

## IDS baseline (layout, flow, contracts)

Synapse **Progress Bar** is a **thin ids-fork** of the IDS **Progress Bar**. Anatomy, type matrix (`with-label` / `inline` / `indeterminate`), thickness signatures, state fills, helper row, interaction contracts, and runtime API **inherit IDS** unless listed in **Synapse programme deltas** below.

- **IDS source of truth:** [`components/ids/progress-bar/design-spec.md`](../ids/progress-bar/design-spec.md)
- **Shared implementation:** `storybook/src/components/ProgressBar.tsx`, `ProgressBar.module.css`
- **Theme CSS:** `components/synapse-theme.css` (overrides `--progress-bar-control-radius`)
- **Base UI mapping:** `data/synapse-baseui-mapping.json` → `progress-bar` (`@base-ui-components/react/progress`)

**Figma scope for this spec:** IDS Figma is authoritative for anatomy, states, and semantic tokens. Programme Figma (`50724:317216`) documents the **radius delta** only (2px vs IDS 0).

## Metadata

| Property | Value |
|---|---|
| Component | Progress Bar |
| Design system | Synapse |
| Category | Loading and Progress |
| Spec pattern | **ids-fork (override-only)** |
| IDS baseline slug | `progress-bar` |
| Status | **active** |
| Version | 1.0.0 |
| Figma node | `50724:317216` |
| Theme CSS | `components/synapse-theme.css` |
| Verification method | IDS baseline spec + theme alias contract |
| Last verified | 2026-06-10 |

### Synapse programme deltas (vs IDS)

| Topic | IDS | Synapse |
|---|---|---|
| Track / fill corner radius | `var(--progress-bar-control-radius)` → `var(--corner-radius-radius-none)` (**0**) | **same alias** → **`var(--corner-radius-radius-2)`** (**2px**) via `components/synapse-theme.css` |
| Thickness / type / state tokens | IDS contract | **Same** (inherit IDS) |
| Runtime API | IDS contract | **Same** (inherit IDS) |

## Anatomy

Inherit IDS **Anatomy** — see [`components/ids/progress-bar/design-spec.md`](../ids/progress-bar/design-spec.md).

## Layout & Measurements

Inherit IDS thickness, spacing, and track geometry — see IDS **Layout & Measurements**.

Synapse-specific layout (alias-driven; resolved in theme CSS):

- Track and fill corner radius: **`var(--progress-bar-control-radius)`** → `var(--corner-radius-radius-2)` in Synapse theme

## Tokens

### Layout aliases (theme-resolvable)

Same alias names as IDS; values overridden in `components/synapse-theme.css`:

| Alias | Synapse resolved value |
|---|---|
| `--progress-bar-control-radius` | `var(--corner-radius-radius-2)` |

### Colors, typography, states

Inherit IDS **Tokens** and **States** tables — same semantic `var(--...)` names.

## States (Light Theme)

Inherit IDS **States (Light Theme)** from [`components/ids/progress-bar/design-spec.md`](../ids/progress-bar/design-spec.md).

Synapse chrome applies only via `--progress-bar-control-radius`; fill/border/text cells are unchanged from IDS.

## States (Dark Theme)

Dark theme uses the same semantic tokens as **States (Light Theme)**. Resolved values for `[data-theme="dark"]` / Synapse dark scope live in `components/synapse-theme.css`.

Duplicate the full state matrix in this section only when a dark row genuinely uses different `var(--...)` references than the corresponding light row.

## Interactions

Inherit IDS **Interactions** and **Accessibility** from [`components/ids/progress-bar/design-spec.md`](../ids/progress-bar/design-spec.md).

## Composition & API (runtime)

### IDS inheritance resolution

Codegen **MUST** resolve props and variant axes from IDS **Composition & API (runtime)** in [`components/ids/progress-bar/design-spec.md`](../ids/progress-bar/design-spec.md) (`value`, `label`, `helperText`, `showHelperText`, `type`, `thickness`, `state`).

### Synapse-only runtime flags

None. Programme chrome is applied exclusively via `components/synapse-theme.css` (`--progress-bar-control-radius`).

### Storybook defaults

Mirror IDS **Spec Accurate Design** (Figma `11099:57210`) under **Spec Generated/Synapse/Progress Bar** with `components/synapse-theme.css` imported.

## Codegen Contract (Framework-Agnostic Blueprint)

### IDS baseline resolution

Generators **MUST** load and merge the IDS baseline contract from [`components/ids/progress-bar/design-spec.md`](../ids/progress-bar/design-spec.md) (`## Codegen Contract`) before applying Synapse programme overrides below.

### Programme override rules

| Rule | IDS | Synapse |
|---|---|---|
| `ProgressTrack` / `ProgressIndicator` `border-radius` | `var(--progress-bar-control-radius)` | **Same alias**; theme resolves to `radius-2` (2px) |
| All other slots | IDS contract | **Inherit IDS** |

### Deterministic structure

Inherit IDS: `ProgressRoot` → optional meta row → `ProgressTrack` + `ProgressIndicator` → optional helper row. Synapse adds **no** slots.

### Variant matrix

Inherit IDS: `type` (`inline` \| `with-label` \| `indeterminate`) × `thickness` × `state` × optional helper. See IDS **Codegen Contract → Variant matrix**.

### Per-slot style contract

| Slot | Property | Contract |
|---|---|---|
| `ProgressTrack`, `ProgressIndicator` | `border-radius` | `var(--progress-bar-control-radius)` — Synapse theme → `var(--corner-radius-radius-2)` |
| All other slots | per IDS | Inherit IDS **Codegen Contract → Per-slot style contract** |

### Behavior contract

Inherit IDS value clamping, indeterminate animation, and `data-value-full` semantics. See IDS **Codegen Contract → Behavior contract**.

### Accessibility contract

Inherit IDS `role="progressbar"`, `aria-valuenow` / `aria-valuetext`, and label association. See IDS **Codegen Contract → Accessibility contract**.

### Asset resolution + bundling contract

Inherit IDS helper status icon slugs (`status-ok-circ-solid`, etc.). See IDS **Codegen Contract → Asset resolution**.

### Fallback/error rules

Inherit IDS unknown `type`/`thickness`/`state` fallbacks. Programme additions:

- Emit `var(--progress-bar-control-radius)` on track and indicator; never hardcode `0` or `2px` in component CSS.
- Import **`components/synapse-theme.css`** for Synapse targets so `--progress-bar-control-radius` resolves to `var(--corner-radius-radius-2)`.

### Validation checklist

- [x] IDS baseline linked; programme deltas list **radius alias only**
- [x] `--progress-bar-control-radius` documented in IDS + Synapse theme CSS
- [x] `ProgressBar.module.css` uses alias on track and indicator
- [x] Codegen Contract subsections concrete (deterministic structure through fallback rules)
- [x] Composition/API resolves via IDS baseline; no Synapse-only props
- [x] Storybook `Spec Generated/Synapse/Progress Bar` loads `components/synapse-theme.css`
- [x] Registry: `data/programme-inheritance-registry.json` → `synapse` / `progress-bar`

## Source Mapping

| Property | Value |
|---|---|
| IDS baseline | `components/ids/progress-bar/design-spec.md` |
| Programme spec | `components/synapse/progress-bar/design-spec.md` |
| Registry | `data/programme-inheritance-registry.json` → `synapse` / `progress-bar` |
| Synapse Figma (radius evidence) | `50724:317216` |
| IDS Figma (layout reference) | `11099:57210` |
| Theme override | `components/synapse-theme.css` → `--progress-bar-control-radius` |
| Implementation | `storybook/src/components/ProgressBar.tsx` |
| Programme wrapper | `storybook/src/components/SynapseProgressBar.tsx` |
| Spec contract | `storybook/src/spec-contracts/synapse-progress-bar.contract.ts` |
| Storybook | `storybook-generated/synapse/src/components/ProgressBar.stories.tsx` |
| Verification | IDS baseline + theme alias contract; Synapse Figma `50724:317216` (radius evidence) |
