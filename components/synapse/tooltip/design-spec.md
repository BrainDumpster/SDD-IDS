# Tooltip Design Spec

## IDS baseline (layout, flow, contracts)

Synapse **Tooltip** is a **thin ids-fork** of the IDS **Tooltip** overlay. Anatomy, arrow matrix, closable behavior, interaction contracts, and runtime API **inherit IDS** unless listed in **Synapse programme deltas** below.

- **IDS source of truth:** [`components/ids/tooltip/design-spec.md`](../ids/tooltip/design-spec.md)
- **Shared implementation:** `storybook/src/components/IdsTooltip.tsx`, `IdsTooltip.module.css`
- **Theme CSS:** `components/synapse-theme.css` (overrides `--tooltip-control-radius`)
- **Base UI mapping:** `data/synapse-baseui-mapping.json` → `tooltip` (`@base-ui-components/react/tooltip`)

**Figma scope for this spec:** IDS Figma is authoritative for anatomy, states, and semantic tokens. Programme Figma (`11067:54657`) documents the **radius delta** only (8px vs IDS 0).

## Metadata

| Property | Value |
|---|---|
| Component | Tooltip |
| Design system | Synapse |
| Category | Alerts and Notifications |
| Spec pattern | **ids-fork (override-only)** |
| IDS baseline slug | `tooltip` |
| Status | **active** |
| Version | 1.0.0 |
| Figma node | `11067:54657` |
| Theme CSS | `components/synapse-theme.css` |
| Verification method | IDS baseline spec + theme alias contract |
| Last verified | 2026-06-10 |

### Synapse programme deltas (vs IDS)

| Topic | IDS | Synapse |
|---|---|---|
| Panel corner radius | `var(--tooltip-control-radius)` → `var(--corner-radius-radius-none)` (**0**) | **same alias** → **`var(--corner-radius-radius-8)`** (**8px**) via `components/synapse-theme.css` |
| Surface / border / arrow tokens | IDS contract | **Same** (inherit IDS) |
| Arrow placement matrix | IDS contract | **Same** (inherit IDS) |
| Closable / hover behavior | IDS contract | **Same** (inherit IDS) |
| Runtime API | IDS contract | **Same** (inherit IDS) |

## Anatomy

Inherit IDS **Anatomy** — see [`components/ids/tooltip/design-spec.md`](../ids/tooltip/design-spec.md).

## Layout & Measurements

Inherit IDS padding, arrow geometry, and panel dimensions — see IDS **Layout & Measurements**.

Synapse-specific layout (alias-driven; resolved in theme CSS):

- Panel corner radius: **`var(--tooltip-control-radius)`** → `var(--corner-radius-radius-8)` in Synapse theme

## Tokens

### Layout aliases (theme-resolvable)

Same alias names as IDS; values overridden in `components/synapse-theme.css`:

| Alias | Synapse resolved value |
|---|---|
| `--tooltip-control-radius` | `var(--corner-radius-radius-8)` |

### Colors, typography, states

Inherit IDS **Tokens** and **States** tables — same semantic `var(--...)` names.

## States (Light Theme)

Inherit IDS **States (Light Theme)** from [`components/ids/tooltip/design-spec.md`](../ids/tooltip/design-spec.md).

Synapse chrome applies only via `--tooltip-control-radius`; **Background / Border / Text/Icon cells are unchanged** from IDS.

## States (Dark Theme)

Dark theme uses the same semantic tokens as **States (Light Theme)**. Resolved values for `[data-theme="dark"]` / Synapse dark scope live in `components/synapse-theme.css`.

Duplicate the full state matrix in this section only when a dark row genuinely uses different `var(--...)` references than the corresponding light row.

## Interactions

Inherit IDS **Interactions** and **Accessibility** from [`components/ids/tooltip/design-spec.md`](../ids/tooltip/design-spec.md).

## Composition & API (runtime)

### IDS inheritance resolution

Codegen **MUST** resolve props, events, and variant axes from IDS **Composition & API (runtime)** in [`components/ids/tooltip/design-spec.md`](../ids/tooltip/design-spec.md) (`content`, `title`, `closable`, `showArrow`, `side`, `arrowAlign`, `open` / `defaultOpen`, `onOpenChange`, `onClose`).

### Synapse-only runtime flags

None. Programme chrome is applied exclusively via `components/synapse-theme.css` (`--tooltip-control-radius`).

### Storybook defaults

Mirror IDS generated gate stories under **Spec Generated/Synapse/Tooltip** with `components/synapse-theme.css` imported. Primary story: **Spec Accurate Design** (Figma `38201:109592` layout).

## Codegen Contract (Framework-Agnostic Blueprint)

### IDS baseline resolution

Generators **MUST** load and merge the IDS baseline contract from [`components/ids/tooltip/design-spec.md`](../ids/tooltip/design-spec.md) (`## Codegen Contract`) before applying Synapse programme overrides below.

### Programme override rules

| Rule | IDS | Synapse |
|---|---|---|
| `TooltipPanel` `border-radius` | `var(--tooltip-control-radius)` | **Same alias**; theme resolves to `radius-8` (8px) |
| All other slots | IDS contract | **Inherit IDS** |

### Deterministic structure

Inherit IDS slot order: `TriggerAnchor` → `TooltipPortal` → `TooltipRoot` → optional `Arrow` → `TooltipPanel` → optional `Header` → `BodyContent` → optional `CloseAction`. Synapse adds **no** slots.

### Variant matrix

Inherit IDS: `header` on/off × `closable` × `showArrow` × `side` × `arrowAlign` (12 arrow permutations). See IDS **Codegen Contract → Variant matrix**.

### Per-slot style contract

| Slot | Property | Contract |
|---|---|---|
| `TooltipPanel` | `border-radius` | `var(--tooltip-control-radius)` — Synapse theme → `var(--corner-radius-radius-8)` |
| All other slots | per IDS | Inherit IDS **Codegen Contract → Per-slot style contract** |

### Behavior contract

Inherit IDS closable vs standard hover/focus lifecycle, arrow placement, and `onClose` reason payloads. See IDS **Interactions** and IDS **Codegen Contract → Behavior contract**.

### Accessibility contract

Inherit IDS: `role="tooltip"`, `aria-describedby`, close button label (`Close tooltip`), keyboard focus lifecycle. See IDS **Codegen Contract → Accessibility contract**.

### Asset resolution + bundling contract

Inherit IDS: `ctrl-close-16` → `assets/icons/ctrl-close-16.svg` via shared Icon primitive. See IDS **Codegen Contract → Asset resolution**.

### Fallback/error rules

Inherit IDS rules (`unknown side` → `top`, `unknown arrowAlign` → `center`, missing `content` → validation error, etc.). Programme additions:

- Emit `var(--tooltip-control-radius)` on `TooltipPanel`; never hardcode `0` or `8px` in component CSS.
- Import **`components/synapse-theme.css`** for Synapse targets so `--tooltip-control-radius` resolves to `var(--corner-radius-radius-8)`.

### Validation checklist

- [x] IDS baseline linked; programme deltas list **panel radius alias only**
- [x] `--tooltip-control-radius` documented in IDS + Synapse theme CSS
- [x] `IdsTooltip.module.css` uses alias on `.popup` (`TooltipPanel`)
- [x] Codegen Contract subsections concrete (deterministic structure through fallback rules)
- [x] Composition/API resolves via IDS baseline; no Synapse-only props
- [x] Storybook `Spec Generated/Synapse/Tooltip` loads `components/synapse-theme.css`
- [x] Registry: `data/programme-inheritance-registry.json` → `synapse` / `tooltip`

## Source Mapping

| Property | Value |
|---|---|
| IDS baseline | `components/ids/tooltip/design-spec.md` |
| Programme spec | `components/synapse/tooltip/design-spec.md` |
| Synapse Figma (radius evidence) | `11067:54657` |
| IDS Figma (layout reference) | `38201:109592` |
| Theme override | `components/synapse-theme.css` → `--tooltip-control-radius` |
| Implementation | `storybook/src/components/IdsTooltip.tsx` |
| Programme wrapper | `storybook/src/components/SynapseTooltip.tsx` |
| Spec contract | `storybook/src/spec-contracts/synapse-tooltip.contract.ts` |
| Registry | `data/programme-inheritance-registry.json` → `synapse` / `tooltip` |
| Storybook | `storybook-generated/synapse/src/components/Tooltip.stories.tsx` |
| Verification | IDS baseline + theme alias contract; Synapse Figma `11067:54657` (radius evidence) |
