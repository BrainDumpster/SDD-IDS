# Alert Design Spec

## IDS baseline (layout, flow, contracts)

Synapse **Alert** is an **ids-fork** of the unified IDS **Alert** family (`display: global | inline`). Global banner chrome, inline slate/rail treatments, severity palettes, carousel model, and runtime API **inherit IDS** unless listed in **Synapse programme deltas** below.

- **IDS source of truth:** [`components/ids/alert/design-spec.md`](../ids/alert/design-spec.md)
- **Shared implementation:** `storybook/src/components/Alert.tsx`, `Alert.module.css`
- **Theme CSS:** `components/synapse-theme.css` (documents `--alert-action-control-radius`)

**Figma scope:** Synapse documentation boards embed the same component sets as IDS — **Global** `11067:54641` (`GlobalAlert-Main` `10829:75187`) and **Inline** `11067:54645` (`InlineAlert` matrix `11067:55322`).

## Metadata

| Property | Value |
|---|---|
| Component | Alert |
| Design system | Synapse |
| Category | Alerts |
| Spec pattern | **ids-fork (override-only)** |
| IDS baseline slug | `alert` |
| Status | **active** |
| Version | 1.0.0 |
| Global Figma board | `11067:54641` — [Global Alert](https://www.figma.com/design/Td1bnsvRj1PCGs9RVJkIvJ/Synapse-Hi-Fi-components?node-id=11067-54641&m=dev) |
| Global matrix | `10829:75187` |
| Inline Figma board | `11067:54645` — [Inline Alert](https://www.figma.com/design/Td1bnsvRj1PCGs9RVJkIvJ/Synapse-Hi-Fi-components?node-id=11067-54645&m=dev) |
| Inline matrix | `11067:55322` |
| Spec-accurate inline (detailed) | `11946:230644` (`Severity=Critical, Title=True, Link=False, Action=True`) |
| Spec-accurate global | `12060:232902` (`Severity=Informational, Link=True, Actions=True, Carousel=False`) |
| IDS baseline nodes | Global `11067:54641`, Inline `42903:139522` (file `VZJ48bbVYrIynw8DdSukWw`) |
| Theme CSS | `components/synapse-theme.css` |
| Verification method | Figma MCP + IDS baseline |
| Last verified | 2026-06-12 |

### Synapse programme deltas (vs IDS)

| Topic | IDS | Synapse (Figma evidence) |
|---|---|---|
| Inline / global severity tokens | IDS contract | **Same** semantic `var(--...)` names |
| Inline root corner radius | `0` (no radius) | **Same** |
| Outlined action control radius | `var(--corner-radius-radius-2)` | **Same** via `var(--alert-action-control-radius)` — **not** `--button-control-radius` (4px) |
| Inline trailing action ↔ dismiss gap | `var(--spacing-space-16)` | **Same** (inherit IDS) |
| Title / message / action label typography | Body 1 / Body 2 | **Body 1 / Body 2 Regular (`font-weight: 400`)** per Figma `11946:230644` |
| Global carousel / dismiss / link | IDS contract | **Same** (inherit IDS) |
| Runtime API (`display`, `severity`, `density`, carousel) | IDS contract | **Same** (inherit IDS) |

## Anatomy

Inherit IDS **Anatomy** — unified `AlertItem` model, optional `AlertGroup` for global carousel. See [`components/ids/alert/design-spec.md`](../ids/alert/design-spec.md).

## Layout & Measurements

Inherit IDS **Layout & Measurements** for global banner and inline compact/detailed densities.

Synapse-specific:

- Outlined action buttons (global + inline): **`border-radius: var(--alert-action-control-radius)`** → `var(--corner-radius-radius-2)` (Figma `rounded-[2px]` on `11946:230644` action control).
- Inline trailing cluster: **inherit IDS** — `gap: var(--spacing-space-16)` between outlined **action** and **dismiss** when both render in `.inlineTrailing` (Figma compact `11946:230538`); detailed density: trailing cluster keeps `16px` top inset; **action only** offset to align with content `12px` `padding-block` (dismiss unchanged).

## Tokens

### Layout alias (theme-resolvable)

| Alias | Synapse resolved value |
|---|---|
| `--alert-action-control-radius` | `var(--corner-radius-radius-2)` |

### Severity / inline rail / icons

Inherit IDS **Tokens** and **States** tables — same semantic alerting background, border, icon, and text tokens.

## States (Light Theme)

Inherit IDS **States (Light Theme)** for global and inline severity rows from [`components/ids/alert/design-spec.md`](../ids/alert/design-spec.md).

## States (Dark Theme)

Dark theme uses the same semantic tokens as **States (Light Theme)**. Resolved values for `[data-theme="dark"]` live in `components/synapse-theme.css`.

## Interactions

Inherit IDS **Interactions** — dismiss, carousel prev/next, link/action handlers, inline density rules.

Inherit IDS **Button composition contract** for outlined actions; geometry uses **`--alert-action-control-radius`**, not general Button programme radius.

## Composition & API (runtime)

### IDS inheritance resolution

Codegen **MUST** resolve `display`, `severity`, `message`, `title`, `density`, `dismissible`, `link`, `actionLabel`, `onAction`, `carousel`, and `AlertGroup` patterns from IDS **Composition & API (runtime)**.

### Synapse-only runtime flags

None.

### Storybook defaults

Mirror IDS stories under **Spec Generated/Synapse/Alert** with `components/synapse-theme.css` imported.

## Codegen Contract (Framework-Agnostic Blueprint)

### IDS baseline resolution

Generators **MUST** load and merge the IDS baseline contract from [`components/ids/alert/design-spec.md`](../ids/alert/design-spec.md) (`## Codegen Contract`) before applying Synapse programme overrides below.

### Programme override rules

| Rule | IDS | Synapse |
|---|---|---|
| Global / inline severity surfaces | IDS contract | **Inherit IDS** |
| Outlined action `border-radius` | `var(--corner-radius-radius-2)` | **`var(--alert-action-control-radius)`** (same value; isolates from `--button-control-radius` 4px) |
| Typography on title/message/action | per IDS | **Regular 400** where Figma shows Body 1/2 Regular |

### Deterministic structure

Inherit IDS global and inline slot trees from IDS **Codegen Contract → Deterministic structure**.

### Variant matrix

Inherit IDS: `display` × `severity` × optional `link` / `action` / `dismiss` × `density` (inline) × carousel (global only).

### Per-slot style contract

| Slot | Property | Contract |
|---|---|---|
| `globalActionButton` / `inlineActionOutlined` | `border-radius` | `var(--alert-action-control-radius)` |
| `TrailingControls` / `.inlineTrailing` | `gap` (action + dismiss) | `var(--spacing-space-16)` |
| All other slots | per IDS | Inherit IDS **Codegen Contract → Per-slot style contract** |

### Behavior contract

Inherit IDS single-item rendering, carousel index rules, inline `success` severity (inline-only), and dismiss hit targets.

### Accessibility contract

Inherit IDS roles, `aria-*`, dismiss ≥32×32, carousel labeling.

### Asset resolution + bundling contract

Inherit IDS status icon slug map, `Icon` primitive usage, `warning-minor` inline registry pattern.

### Fallback/error rules

Inherit IDS unknown severity/density, `success` on global rejection, carousel on inline error.

Programme additions:

- Import **`components/synapse-theme.css`** for Synapse targets.
- Never use `--button-control-radius` on alert action controls.

### Validation checklist

- [x] IDS baseline linked; programme delta documents action radius alias + typography evidence
- [x] `--alert-action-control-radius` in IDS + Synapse theme CSS
- [x] `Alert.module.css` uses action radius alias on global + inline action buttons
- [x] Inline `.inlineTrailing` uses `var(--spacing-space-16)` between action and dismiss (Figma `11946:230538`)
- [x] Codegen Contract subsections concrete
- [x] Figma MCP evidence on `11946:230644`, `12060:232902`
- [x] Storybook `Spec Generated/Synapse/Alert` loads `components/synapse-theme.css`
- [x] Registry: `data/programme-inheritance-registry.json` → `synapse` / `alert`

## Source Mapping

| Property | Value |
|---|---|
| IDS baseline | `components/ids/alert/design-spec.md` |
| Programme spec | `components/synapse/alert/design-spec.md` |
| Synapse Figma file | `Td1bnsvRj1PCGs9RVJkIvJ` |
| Global board / matrix | `11067:54641`, `10829:75187` |
| Inline board / matrix | `11067:54645`, `11067:55322` |
| Theme | `components/synapse-theme.css` → `--alert-action-control-radius` |
| Implementation | `storybook/src/components/Alert.tsx` |
| Programme wrapper | `storybook/src/components/SynapseAlert.tsx` |
| Spec contract | `storybook/src/spec-contracts/synapse-alert.contract.ts` |
| Storybook | `storybook/src/components/SynapseAlert.stories.tsx` |
| Verification | Figma MCP `get_design_context` on `11946:230644` (2026-06-12) |
