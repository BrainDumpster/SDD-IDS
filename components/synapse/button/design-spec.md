# Button Design Spec

## IDS baseline (layout, flow, contracts)

Synapse **Button** is a **thin ids-fork** of the IDS **Button** component. Anatomy, variant matrix, size signatures, state token bindings, interaction contracts, and runtime API **inherit IDS** unless listed in **Synapse programme deltas** below.

- **IDS source of truth:** [`components/ids/button/design-spec.md`](../ids/button/design-spec.md)
- **Shared implementation:** `storybook/src/components/Button.tsx`, `Button.module.css`
- **Theme CSS:** `components/synapse-theme.css` (layout alias overrides)
- **Base UI mapping:** `data/synapse-baseui-mapping.json` → `button` (`@base-ui-components/react/button`)

**Figma scope for this spec:** IDS Figma is authoritative for anatomy, states, and semantic tokens. Programme Figma evidence is required **only for non-alias deltas** (focus ring geometry below). Do not re-verify the full IDS variant × state × size matrix in Synapse Figma unless a delta row claims a difference.

## Metadata
- Component: Button
- Design System: Synapse
- Category: Components / Form Elements
- Spec pattern: **ids-fork (override-only)**
- IDS baseline slug: `button`
- Status: **draft**
- Version: 1.1.0
- Theme CSS: `components/synapse-theme.css`
- Verification method: IDS baseline spec + theme alias contract; Figma MCP on focus delta node only
- Last verified: 2026-06-09

### Synapse programme deltas (vs IDS)

| Topic | IDS | Synapse |
|---|---|---|
| Control corner radius | `var(--button-control-radius)` → `var(--corner-radius-radius-2)` | **same alias** → `var(--corner-radius-radius-4)` via `components/synapse-theme.css` |
| Focus ring corner radius | `var(--button-focus-ring-radius)` → `var(--corner-radius-radius-4)` | **same alias** → `var(--corner-radius-radius-6)` via `components/synapse-theme.css` |
| Focus ring offset | `var(--button-focus-ring-offset)` (**3px**) | **same alias** (**3px**) |
| Focus ring rendering | `outline` + `outline-offset` (IDS) | **`::after` inset ring** when `programme="synapse"` — evidence node `47808:32113` |
| Size / padding signatures | IDS contract | **Same** (inherit IDS) |
| Icon–label gap | `var(--spacing-space-8)` | **Same** |
| Variant / state color tokens | IDS semantic tokens | **Same semantic `var(--...)` names** (inherit IDS) |
| Runtime API / variant matrix | IDS contract | **Same** (inherit IDS) |

## Anatomy

Inherit IDS **Anatomy** — see [`components/ids/button/design-spec.md`](../ids/button/design-spec.md).

Deterministic slot order: `ButtonRoot` → optional `ButtonLeadingIcon` → optional `ButtonLabel`.

## Layout & Measurements

Inherit IDS padding, height, width, and icon geometry — see IDS **Layout & Measurements**.

Synapse-specific layout (alias-driven; resolved in theme CSS):

- Control corner radius: **`var(--button-control-radius)`** → `var(--corner-radius-radius-4)` in Synapse theme
- Focus ring corner radius: **`var(--button-focus-ring-radius)`** → `var(--corner-radius-radius-6)` in Synapse theme
- Focus ring offset: **`var(--button-focus-ring-offset)`** (**3px**)

## Tokens

### Layout aliases (theme-resolvable)

Same alias names as IDS; values overridden in `components/synapse-theme.css`:

| Alias | Synapse resolved value |
|---|---|
| `--button-control-radius` | `var(--corner-radius-radius-4)` |
| `--button-focus-ring-radius` | `var(--corner-radius-radius-6)` |
| `--button-focus-ring-offset` | `3px` |

### Colors, typography, states

Inherit IDS **Tokens** and **States** tables — same semantic `var(--...)` names. Color resolution uses `components/synapse-theme.css` for Light/Dark values.

## States (Light Theme)

Inherit IDS **States (Light Theme)** from [`components/ids/button/design-spec.md`](../ids/button/design-spec.md).

Synapse chrome applies only via layout aliases and focus ring technique above; **Background / Border / Text/Icon cells are unchanged** from IDS.

## States (Dark Theme)

Inherit IDS **States (Dark Theme)**. Use standard dark-theme boilerplate: same semantic tokens as Light; resolved dark values live in `components/synapse-theme.css`.

## Interactions

Inherit IDS **Interactions**, **Accessibility**, and **Behavior & guidelines** from [`components/ids/button/design-spec.md`](../ids/button/design-spec.md).

Synapse addition:

- Import **`components/synapse-theme.css`** (not `ids-theme.css`) for Synapse Button targets.
- Use **`programme="synapse"`** on the shared `Button` only for the **`::after` focus ring** rendering path; corner radius comes from theme aliases without a per-component radius override.

## Composition & API (runtime)

Inherit IDS **Composition & API (runtime)** — see IDS spec for full prop/event contract.

| Prop | Synapse note |
|---|---|
| `programme` | `"synapse"` — enables `::after` focus ring; radius from theme |
| `variant` / `size` / `iconSlug` / `iconOnly` / etc. | Same as IDS defaults and validation rules |

### Spec Accurate Design story defaults

- `programme: "synapse"`
- `variant: "primary"`; `size: "lg"`
- `children: "Button"`
- Theme: `components/synapse-theme.css`

## Codegen Contract (Framework-Agnostic Blueprint)

### Deterministic structure

Inherit IDS structure — see IDS **Codegen Contract**.

### Theme & programme resolution

- Emit **`var(--button-control-radius)`**, **`var(--button-focus-ring-radius)`**, **`var(--button-focus-ring-offset)`** in component CSS — never hardcoded `px` or programme-specific scale token names.
- Import **`components/synapse-theme.css`** for Synapse targets.
- Do **not** duplicate IDS variant/state tables in generated code paths; read IDS spec layer + this deltas table.

| CSS property | Token |
|---|---|
| `border-radius` | `var(--button-control-radius)` |
| focus ring `border-radius` | `var(--button-focus-ring-radius)` |
| focus ring offset | `var(--button-focus-ring-offset)` |

### Behavior / accessibility / assets / fallbacks

Inherit IDS **Codegen Contract** subsections from [`components/ids/button/design-spec.md`](../ids/button/design-spec.md).

### Validation checklist

- [x] IDS baseline referenced; programme deltas table lists all Synapse differences
- [x] Layout aliases documented and defined in `components/synapse-theme.css`
- [ ] Shared `Button` uses aliases for radius; `programme="synapse"` applies focus `::after` ring only
- [ ] No duplicated IDS state matrix in this spec (inherit by reference)
- [ ] Storybook Synapse Button story imports `components/synapse-theme.css`

## Source Mapping

| Source | Location |
|---|---|
| IDS baseline (authoritative) | `components/ids/button/design-spec.md` |
| IDS Figma | `data/component-figma-map.json` → Button (`41894:116183`, `9662:25120`) |
| Theme aliases | `components/synapse-theme.css` → `--button-control-radius`, `--button-focus-ring-radius`, `--button-focus-ring-offset` |
| Programme delta evidence (focus ring only) | Synapse Hi-Fi `47808:32113` — [Figma](https://www.figma.com/design/Td1bnsvRj1PCGs9RVJkIvJ/Synapse-Hi-Fi-components?node-id=47808-32113&m=dev) |
| Implementation | `storybook/src/components/Button.tsx`, `Button.module.css` |
| Component map | `data/synapse-component-figma-map.json` → Button |
| Programme registry | `data/programme-inheritance-registry.json` → `button` |
