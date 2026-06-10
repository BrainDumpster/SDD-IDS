# Toast Design Spec

## IDS baseline (layout, flow, contracts)

Synapse **Toast** is a **thin ids-fork** of the IDS **Toast** notification stack. Anatomy, variant matrix, queue behavior, link contract, interaction contracts, and runtime API **inherit IDS** unless listed in **Synapse programme deltas** below.

- **IDS source of truth:** [`components/ids/toast/design-spec.md`](../ids/toast/design-spec.md)
- **Shared implementation:** `storybook/src/components/Toast.tsx`, `Toast.module.css`
- **Theme CSS:** `components/synapse-theme.css` (overrides `--toast-control-radius`)
- **Base UI mapping:** `data/synapse-baseui-mapping.json` → `toast` (`@base-ui-components/react/toast`)

**Figma scope for this spec:** IDS Figma is authoritative for anatomy, states, and semantic tokens. Programme Figma (`48467:82945`) documents the **radius delta** only (8px vs IDS 2px).

## Metadata

| Property | Value |
|---|---|
| Component | Toast |
| Design system | Synapse |
| Category | Alerts and Notifications |
| Spec pattern | **ids-fork (override-only)** |
| IDS baseline slug | `toast` |
| Status | **active** |
| Version | 1.0.0 |
| Figma node | `48467:82945` |
| Theme CSS | `components/synapse-theme.css` |
| Verification method | IDS baseline spec + theme alias contract |
| Last verified | 2026-06-10 |

### Synapse programme deltas (vs IDS)

| Topic | IDS | Synapse |
|---|---|---|
| Root corner radius | `var(--toast-control-radius)` → `var(--corner-radius-radius-2)` (**2px**) | **same alias** → **`var(--corner-radius-radius-8)`** (**8px**) via `components/synapse-theme.css` |
| Surface / border / variant tokens | IDS contract | **Same** (inherit IDS) |
| Queue / position / link API | IDS contract | **Same** (inherit IDS) |
| Runtime API | IDS contract | **Same** (inherit IDS) |

## Anatomy

Inherit IDS **Anatomy** — see [`components/ids/toast/design-spec.md`](../ids/toast/design-spec.md).

## Layout & Measurements

Inherit IDS padding, heights, gaps, and icon sizes — see IDS **Layout & Measurements**.

Synapse-specific layout (alias-driven; resolved in theme CSS):

- Root corner radius: **`var(--toast-control-radius)`** → `var(--corner-radius-radius-8)` in Synapse theme

## Tokens

### Layout aliases (theme-resolvable)

Same alias names as IDS; values overridden in `components/synapse-theme.css`:

| Alias | Synapse resolved value |
|---|---|
| `--toast-control-radius` | `var(--corner-radius-radius-8)` |

### Colors, typography, states

Inherit IDS **Tokens** and **States** tables — same semantic `var(--...)` names.

## States (Light Theme)

Inherit IDS **States (Light Theme)** from [`components/ids/toast/design-spec.md`](../ids/toast/design-spec.md).

Synapse chrome applies only via `--toast-control-radius`; **Background / Border / Text/Icon cells are unchanged** from IDS.

## States (Dark Theme)

Dark theme uses the same semantic tokens as **States (Light Theme)**. Resolved values for `[data-theme="dark"]` / Synapse dark scope live in `components/synapse-theme.css`.

Duplicate the full state matrix in this section only when a dark row genuinely uses different `var(--...)` references than the corresponding light row.

## Interactions

Inherit IDS **Interactions** and **Accessibility** from [`components/ids/toast/design-spec.md`](../ids/toast/design-spec.md).

## Composition & API (runtime)

### IDS inheritance resolution

Codegen **MUST** resolve props, events, queue API, and link contract from IDS **Composition & API (runtime)** in [`components/ids/toast/design-spec.md`](../ids/toast/design-spec.md) (`type`, `message`, `duration`, `closable`, `link`, `position`, `maxVisible`, `onClose`, `onTimeout`, etc.).

### Synapse-only runtime flags

None. Programme chrome is applied exclusively via `components/synapse-theme.css` (`--toast-control-radius`).

### Storybook defaults

Mirror IDS toast layout (Figma `42903:139689`) under **Spec Generated/Synapse/Toast** with `components/synapse-theme.css` imported. Primary story: **Spec Accurate Design**.

## Codegen Contract (Framework-Agnostic Blueprint)

### IDS baseline resolution

Generators **MUST** load and merge the IDS baseline contract from [`components/ids/toast/design-spec.md`](../ids/toast/design-spec.md) (`## Codegen Contract`) before applying Synapse programme overrides below.

### Programme override rules

| Rule | IDS | Synapse |
|---|---|---|
| `ToastItem` root `border-radius` | `var(--toast-control-radius)` | **Same alias**; theme resolves to `radius-8` (8px) |
| All other slots | IDS contract | **Inherit IDS** |

### Deterministic structure

Inherit IDS: `ToastViewport` → `ToastItem` → `Content` (icon + message) + `ActionContainer` (optional link + close). Synapse adds **no** slots.

### Variant matrix

Inherit IDS: `type` × optional `link` × `closable` × `position`. See IDS **Codegen Contract → Variant matrix**.

### Per-slot style contract

| Slot | Property | Contract |
|---|---|---|
| `ToastItem` root | `border-radius` | `var(--toast-control-radius)` — Synapse theme → `var(--corner-radius-radius-8)` |
| All other slots | per IDS | Inherit IDS **Codegen Contract → Per-slot style contract** |

### Behavior contract

Inherit IDS queue FIFO, timeout dismissal, close/escape handling, and link activation. See IDS **Codegen Contract → Behavior contract**.

### Accessibility contract

Inherit IDS live-region semantics, focus order, and keyboard dismissal. See IDS **Codegen Contract → Accessibility contract**.

### Asset resolution + bundling contract

Inherit IDS status icon slugs (`shape-*`) and close icon (`shape-x`). See IDS **Codegen Contract → Asset resolution**.

### Fallback/error rules

Inherit IDS variant/type fallbacks. Programme additions:

- Emit `var(--toast-control-radius)` on `ToastItem` root; never hardcode `2px` or `8px` in component CSS.
- Import **`components/synapse-theme.css`** for Synapse targets so `--toast-control-radius` resolves to `var(--corner-radius-radius-8)`.

### Validation checklist

- [x] IDS baseline linked; programme deltas list **root radius alias only**
- [x] `--toast-control-radius` documented in IDS + Synapse theme CSS
- [x] `Toast.module.css` uses alias on toast root
- [x] Codegen Contract subsections concrete (deterministic structure through fallback rules)
- [x] Composition/API resolves via IDS baseline; no Synapse-only props
- [x] Storybook `Spec Generated/Synapse/Toast` loads `components/synapse-theme.css`
- [x] Registry: `data/programme-inheritance-registry.json` → `synapse` / `toast`

## Source Mapping

| Property | Value |
|---|---|
| IDS baseline | `components/ids/toast/design-spec.md` |
| Programme spec | `components/synapse/toast/design-spec.md` |
| Registry | `data/programme-inheritance-registry.json` → `synapse` / `toast` |
| Synapse Figma (radius evidence) | `48467:82945` |
| IDS Figma (layout reference) | `42903:139689` |
| Theme override | `components/synapse-theme.css` → `--toast-control-radius` |
| Implementation | `storybook/src/components/Toast.tsx` |
| Programme wrapper | `storybook/src/components/SynapseToast.tsx` |
| Spec contract | `storybook/src/spec-contracts/synapse-toast.contract.ts` |
| Storybook | `storybook-generated/synapse/src/components/Toast.stories.tsx` |
| Verification | IDS baseline + theme alias contract; Synapse Figma `48467:82945` (radius evidence) |
