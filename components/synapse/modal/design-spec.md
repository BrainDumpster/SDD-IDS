# Modal Design Spec

## IDS baseline (layout, flow, contracts)

Synapse **Modal** is a **thin ids-fork** of the IDS **Modal** component family (dialog, single-page, multi-page). Anatomy, size matrix, padding, borders, shadows, interaction contracts, focus trap, footer action model, severity icon mapping, and runtime API **inherit IDS** unless listed in **Synapse programme deltas** below.

- **IDS source of truth:** [`components/ids/modal/design-spec.md`](../ids/modal/design-spec.md)
- **Shared implementation:** `storybook/src/components/Dialog.tsx`, `Dialog.module.css`
- **Theme CSS:** `components/synapse-theme.css` (overrides `--modal-control-radius`)
- **Base UI mapping:** `data/synapse-baseui-mapping.json` → `dialog` (`@base-ui-components/react/dialog`)

**Figma scope for this spec:** IDS Figma is authoritative for anatomy, states, sizes, and semantic tokens. Programme Figma (`43461:175960`) documents the **radius delta** only (`16px` vs IDS `0`).

## Metadata

| Property | Value |
|---|---|
| Component | Modal / Modal Dialog |
| Design system | Synapse |
| Category | Modals |
| Spec pattern | **ids-fork (override-only)** |
| IDS baseline slug | `modal` |
| Status | **draft** |
| Version | 1.1.0 |
| Theme CSS | `components/synapse-theme.css` |
| Verification method | IDS baseline spec + theme alias contract |
| Last verified | 2026-06-10 |

### Synapse programme deltas (vs IDS)

| Topic | IDS | Synapse |
|---|---|---|
| Surface corner radius | `var(--modal-control-radius)` → `var(--corner-radius-radius-none)` (**0**) | **same alias** → **`var(--corner-radius-radius-16)`** (16px) via `components/synapse-theme.css` |
| Surface border | `var(--color-border-accessible)` | **Same** (inherit IDS) |
| Size matrix / padding / shadows | IDS contract | **Same** (inherit IDS) |
| Dialog `type` matrix | IDS contract | **Same** (inherit IDS) |
| Footer buttons | IDS Button contract | **`programme="synapse"`** on shared `Button` (see [`button`](../button/design-spec.md)) |
| Runtime API | IDS contract | **Same** (inherit IDS) |

## Anatomy

Inherit IDS **Anatomy** — see [`components/ids/modal/design-spec.md`](../ids/modal/design-spec.md).

## Layout & Measurements

Inherit IDS size matrix, header/content/footer padding, and elevation — see IDS **Layout & Measurements**.

Synapse-specific layout (alias-driven; resolved in theme CSS):

- Surface corner radius: **`var(--modal-control-radius)`** → `var(--corner-radius-radius-16)` in Synapse theme

## Tokens

### Layout aliases (theme-resolvable)

Same alias names as IDS; values overridden in `components/synapse-theme.css`:

| Alias | Synapse resolved value |
|---|---|
| `--modal-control-radius` | `var(--corner-radius-radius-16)` |

### Colors, typography, states

Inherit IDS **Tokens** and **States** tables — same semantic `var(--...)` names. Color resolution uses `components/synapse-theme.css` for Light/Dark values.

## States (Light Theme)

Inherit IDS **States (Light Theme)** from [`components/ids/modal/design-spec.md`](../ids/modal/design-spec.md).

Synapse chrome applies only via `--modal-control-radius`; **Background / Border / Text cells are unchanged** from IDS.

## States (Dark Theme)

Inherit IDS **States (Dark Theme)**. Use standard dark-theme boilerplate: same semantic tokens as Light; resolved dark values live in `components/synapse-theme.css`.

## Interactions

Inherit IDS **Interactions** and **Accessibility** from [`components/ids/modal/design-spec.md`](../ids/modal/design-spec.md).

## Composition & API (runtime)

Inherit IDS **Composition & API (runtime)**.

Synapse Storybook defaults (when requested):

| Prop | Synapse note |
|---|---|
| `programme` | `"synapse"` on `Dialog` + footer `Button` |
| `dialogSize` | `"lg"` (640px — IDS `x-small` / `lg` mapping in reference impl) |
| Footer / trigger `Button` | `programme="synapse"`, `size="lg"` |

## Codegen Contract (Framework-Agnostic Blueprint)

### Programme override rules

| Rule | IDS | Synapse |
|---|---|---|
| Surface `border-radius` | `var(--modal-control-radius)` | **Same alias**; theme resolves to `radius-16` |
| All other slots | IDS contract | **Inherit IDS** |

### Deterministic structure / variant matrix / behavior / accessibility / assets

Inherit IDS **Codegen Contract** from [`components/ids/modal/design-spec.md`](../ids/modal/design-spec.md).

Generators **must** emit `border-radius: var(--modal-control-radius)` on the modal surface — never hardcoded `0` or `16px` in component CSS.

### Validation checklist

- [x] IDS baseline linked; programme deltas table lists **radius alias only**
- [x] `--modal-control-radius` documented in IDS + Synapse theme CSS
- [x] Implementation uses `var(--modal-control-radius)` on dialog surface (`Dialog.module.css`)
- [x] All other modal chrome matches IDS (border, padding, shadow, divider)
- [x] Storybook `Spec Generated/Synapse/Modal Dialog` loads `components/synapse-theme.css`

## Source Mapping

| Property | Value |
|---|---|
| IDS baseline | `components/ids/modal/design-spec.md` |
| Programme spec | `components/synapse/modal/design-spec.md` |
| Registry | `data/programme-inheritance-registry.json` → `synapse` / `modal` |
| Synapse Figma (radius evidence) | `43461:175960`, `43461:175961` |
| Theme override | `components/synapse-theme.css` → `--modal-control-radius` |
