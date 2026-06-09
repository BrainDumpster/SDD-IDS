# Text Input Design Spec

## IDS baseline (layout, flow, contracts)

Synapse **Text Input** inherits the IDS **Text Box** field contract (single-line input, optional text area, suffix icon, helper/error row, size variants, interactive state model). Synapse verifies the same variant axes in the **Synapse Hi-Fi** file with programme-specific control radius and focus-ring geometry.

- **IDS source of truth:** [`components/ids/text-box/design-spec.md`](../ids/text-box/design-spec.md)
- **Shared implementation:** `storybook/src/components/IdsTextBox.tsx` with `programme="synapse"`; wrapper `SynapseTextInput.tsx`
- **Base UI mapping:** `data/synapse-baseui-mapping.json` → `text-input` (native `<input>` / `<textarea>` field pattern)
- **Codegen merge:** load IDS `text-box` spec first, then apply **Synapse programme deltas** and **Programme override rules** below (programme wins on conflict).

**Scope of live Synapse verification:** component set `47833:47770`; scenario boards `47834:48520`, `47834:48553`, `47834:48653`, `47834:48457`; state symbols `47833:48063`–`47833:48022`, `47833:47972`–`47833:47931`.

## Metadata

| Property | Value |
|---|---|
| Component | Text Input |
| Design system | Synapse |
| Category | Components / Form elements |
| Spec pattern | **ids-fork** (`data/programme-inheritance-registry.json` → `programme: synapse`, `slug: text-input`) |
| IDS baseline slug | `text-box` |
| Status | **active** |
| Version | 1.1.0 |
| Created | 2026-06-05 |
| Updated | 2026-06-05 |
| Description | Single-line text field and text area with optional suffix icon, helper text, and validation error row |
| Figma file | [Synapse Hi-Fi components](https://www.figma.com/design/Td1bnsvRj1PCGs9RVJkIvJ/Synapse-Hi-Fi-components) |
| File key | `Td1bnsvRj1PCGs9RVJkIvJ` |
| Main component set | [`47833:47770`](https://www.figma.com/design/Td1bnsvRj1PCGs9RVJkIvJ/Synapse-Hi-Fi-components?node-id=47833-47770&m=dev) (`Text Input`) |
| Documentation board | [`47833:48165`](https://www.figma.com/design/Td1bnsvRj1PCGs9RVJkIvJ/Synapse-Hi-Fi-components?node-id=47833-48165&m=dev) |
| Verification method | Figma MCP (`get_metadata`, `get_design_context`, `get_variable_defs`) |
| Last verified | 2026-06-05 |
| Theme CSS | `components/synapse-theme.css` |
| Spec contract | `storybook/src/spec-contracts/synapse-text-input.contract.ts` |
| Storybook | `storybook/src/components/SynapseTextInput.stories.tsx` (main story glob — avoids stale `importers[path]` on hot-add) |
| Programme wrapper | `storybook/src/components/SynapseTextInput.tsx` |

### Synapse programme deltas (vs IDS Text Box)

| Topic | IDS (`text-box`) | Synapse (verified) |
|---|---|---|
| Control corner radius | **`0`** (`var(--corner-radius-radius-none)`) | **`var(--corner-radius-radius-4)`** (`4px`) on `TextBoxControl` |
| Focus outer ring radius | `4px` (`var(--corner-radius-radius-4)`) | **`var(--corner-radius-radius-6)`** (`6px`) on focus overlay (`47833:48038`) |
| Focus ring inset | `inset: -5px` (shared implementation) | Same **`inset: -5px`**; ring uses **`radius-6`** |
| Border / text / icon tokens | `border-accessible`, `border-strong`, `brand-base`, `critical-base`, etc. | **Same semantic `var(--...)` names** (verified `get_variable_defs` on `47833:48063`, `47833:48038`, `47833:48022`) |
| Size heights | large `40px`, small `32px` | Same |
| Control horizontal padding | `var(--padding-padding-16)` | Same |
| Text ↔ icon gap | `var(--spacing-space-10)` | Same |
| Control ↔ helper gap | `var(--spacing-space-4)` | Same |
| Error row icon ↔ text gap | `var(--spacing-space-8)` | Same |
| Sample frame width | `300px` | Same |
| Text area | large only; ~`150px` total frame height | Same (`Type=Text Area`, `Size=Large` only in set) |
| Optional form label | not in IDS anatomy | optional `FormLabel` row (`showLabel` axis in Figma); **not yet in Storybook impl** — document for codegen only |
| Component naming | Text Box | Text Input (Figma); maps to same runtime slots |

### Validated Figma nodes

| Scenario | Node | Notes |
|---|---|---|
| Component set | `47833:47770` | Axes: `Size`, `Content`, `State`, `Type` |
| Large (filled + helper) | `47834:48520` | `Size=Large`, `Content=Filled`, `State=Default`, `Type=Text Input` |
| Small (filled + helper) | `47834:48553` | `Size=Small`, height `32px` |
| With suffix icon | `47834:48653` | `mail` icon `16×16` trailing |
| Error (empty + message) | `47834:48457` | critical border + validation row |
| Large empty default | `47833:48063` | placeholder + optional icon |
| Large empty hover | `47833:48055` | `border-strong` |
| Large empty selected | `47833:48047` | `border-brand-base` + caret |
| Large empty focus | `47833:48038` | accessible border + outer `brand-base` ring `radius-6` |
| Large empty disabled | `47833:48030` | `background-gray-light` |
| Large empty error | `47833:48022` | `border-alerting-critical-base` |
| Small empty default | `47833:47972` | height `32px` |
| Text area large empty default | `47833:47872` | `300×150` frame |

## Anatomy

Deterministic slot order (IDS-aligned unless noted):

1. `TextInputRoot` / `TextBoxRoot` — field wrapper (`width: 100%`; sample max `300px`)
2. `FormLabel?` — optional external label (`showLabel`); Body 2, `text-neutral-strong`
3. `TextBoxControl` — bordered input container (**Synapse:** `radius-4`)
4. `TextBoxInput` | `TextBoxTextArea` — native control (transparent, borderless)
5. `TextBoxSuffixIcon?` — trailing `16×16` icon (default `mail`)
6. `TextBoxFocusRing?` — outer focus overlay (`inset: -5px`, **Synapse:** `radius-6`)
7. `TextBoxHelperRow?` — helper or error row (`4px` below control)
8. `TextBoxHelperText` | `TextBoxErrorText`
9. `TextBoxErrorIcon?` — `status-critical-square-solid` (`16×16`)

## Layout & Measurements

### Field wrapper

| Property | Value |
|---|---|
| Runtime width | `width: 100%` (container-driven) |
| Sample / story width | **`300px`** max (Figma frames) |
| Control ↔ helper vertical gap | `var(--spacing-space-4)` |

### `TextBoxControl` — text input

| Property | Large | Small |
|---|---|---|
| Height | **`40px`** | **`32px`** |
| Horizontal padding | `var(--padding-padding-16)` | same |
| Content gap (value ↔ icon) | `var(--spacing-space-10)` | same |
| Border width | `var(--border-width-border-1)` | same |
| Corner radius (Synapse) | **`var(--corner-radius-radius-4)`** | same |

### `TextBoxControl` — text area (large only)

| Property | Value |
|---|---|
| Frame height (sample) | **`150px`** total (`47833:47872`) |
| Control min-height | **`126px`** (implementation parity) |
| Block padding | `9px` top / `var(--padding-padding-10)` bottom (IDS parity) |
| Corner radius | `var(--corner-radius-radius-4)` |

### Suffix icon

| Property | Value |
|---|---|
| Size | **`16×16`** |
| Default slug | `mail` (`29515:170009`) |

### Helper / error row

| Property | Value |
|---|---|
| Helper text | Body 2; `var(--color-text-neutral)` |
| Error icon | `16×16`; `status-critical-square-solid` |
| Error text | `var(--color-text-critical)` |
| Icon ↔ error text gap | `var(--spacing-space-8)` |

### Focus ring (Synapse)

| Property | Value |
|---|---|
| Position | absolute overlay on `TextBoxControl` |
| Inset | **`-5px`** all sides |
| Border | `var(--border-width-border-1)` solid `var(--color-border-brand-base)` |
| Radius | **`var(--corner-radius-radius-6)`** |
| When | keyboard `:focus-visible` (and Figma `State=Focus`); pointer-only focus uses **selected** border without ring (inherit IDS behavior contract) |

## Tokens

### Surface + border
- `var(--color-background-component)` — default control background
- `var(--color-background-gray-light)` — disabled control background
- `var(--color-border-accessible)` — default / keyboard-focus control border
- `var(--color-border-strong)` — hover border
- `var(--color-border-brand-base)` — selected border + focus ring
- `var(--color-border-alerting-critical-base)` — error control border
- `var(--border-width-border-1)` — control and focus ring stroke
- `var(--corner-radius-radius-4)` — control corners (Synapse)
- `var(--corner-radius-radius-6)` — focus ring corners (Synapse)

### Text
- `var(--color-text-neutral)` — value, helper text
- `var(--color-text-disabled)` — placeholder, disabled value
- `var(--color-text-critical)` — error message

### Icon
- `var(--color-icon-neutral)` — default / hover suffix icon
- `var(--color-icon-disabled)` — disabled suffix icon
- `var(--color-icon-alerting-critical)` — error row icon

### Typography + spacing
- `var(--font-size-body-2)` / `var(--font-line-height-line-height-20)` — input, helper, error
- `var(--spacing-space-4)`, `var(--spacing-space-8)`, `var(--spacing-space-10)`, `var(--spacing-space-16)`
- `var(--padding-padding-16)`, `var(--padding-padding-10)`, `var(--padding-padding-none)`

## States (Light Theme)

| Slot | State | Background | Border | Text / icon |
|---|---|---|---|---|
| `TextBoxControl` | default | `var(--color-background-component)` | `var(--color-border-accessible)` | value `var(--color-text-neutral)`; placeholder `var(--color-text-disabled)`; icon `var(--color-icon-neutral)` |
| `TextBoxControl` | hover | `var(--color-background-component)` | `var(--color-border-strong)` | value `var(--color-text-neutral)`; icon `var(--color-icon-neutral)` |
| `TextBoxControl` | selected | `var(--color-background-component)` | `var(--color-border-brand-base)` | value `var(--color-text-neutral)`; caret visible; icon `var(--color-icon-neutral)` |
| `TextBoxControl` | focus-visible | `var(--color-background-component)` | control `var(--color-border-accessible)` + outer ring `var(--color-border-brand-base)` (`radius-6`, `inset -5px`) | value `var(--color-text-neutral)`; icon `var(--color-icon-neutral)` |
| `TextBoxControl` | disabled | `var(--color-background-gray-light)` | `var(--color-border-accessible)` | value/placeholder `var(--color-text-disabled)`; icon `var(--color-icon-disabled)` |
| `TextBoxControl` | error | `var(--color-background-component)` | `var(--color-border-alerting-critical-base)` | value/placeholder per content; suffix icon `var(--color-icon-neutral)` when shown |
| `TextBoxHelperRow` | helper | transparent | none | `var(--color-text-neutral)` |
| `TextBoxHelperRow` | error | transparent | none | icon `var(--color-icon-alerting-critical)`; text `var(--color-text-critical)` |

## States (Dark Theme)

Dark theme uses the same semantic tokens as **States (Light Theme)**. Resolved values for `[data-theme="dark"]` / Synapse dark scope live in theme CSS:

- `components/synapse-theme.css`

Duplicate the full state matrix in this section only when a dark row genuinely uses different `var(--...)` references than the corresponding light row.

## Interactions

(Inherit IDS [`text-box`](../ids/text-box/design-spec.md) unless noted.)

- Click/focus places caret in input/textarea.
- Hover updates border `accessible` → `strong`.
- Pointer focus (click inside field) → **selected** visual: `border-brand-base`, no outer ring.
- Keyboard `:focus-visible` → control border stays `accessible`; outer **Synapse** ring (`brand-base`, `radius-6`, `inset -5px`).
- `disabled` blocks editing; applies disabled background/text/icon tokens.
- `invalid` / `errorText` → error border + error helper row (mutually exclusive with neutral helper text).
- `data-state` forced values are Storybook/demo-only; runtime interaction must not be blocked.

### Accessibility

- Native `<input>` / `<textarea>` semantics.
- `aria-invalid="true"` when `invalid` or `errorText` present.
- Helper/error row linked via `aria-describedby`.
- Suffix icon decorative unless host supplies `aria-label` on icon button pattern (default: decorative).

### Behavior & guidelines

- Use `programme="synapse"` when emitting Synapse chrome (`radius-4` control, `radius-6` focus ring).
- Default suffix icon slug: **`mail`**; override via `iconName`.
- Error icon slug: **`status-critical-square-solid`**.
- Host **`components/synapse-theme.css`** at application root.
- `componentType="text-area"` ignores `size="small"` (large / textarea layout only).

## Composition & API (runtime)

### Programme merge (codegen)

1. Parse IDS [`text-box`](../ids/text-box/design-spec.md) **Composition & API** and **Codegen Contract** as base.
2. Apply **Synapse programme deltas** and **Programme override rules** (this spec).
3. Emit `programme: "synapse"` on root when generating Synapse targets.

### Root props (merged)

| Prop | Type / default | Behavior |
|---|---|---|
| `programme` | `"synapse"` | Enables Synapse radius + focus ring |
| `componentType` | `"text-input"` \| `"text-area"` | default `"text-input"` |
| `size` | `"large"` \| `"small"` | default `"large"`; `small` invalid for text-area |
| `state` | `default` \| `hover` \| `selected` \| `focus` \| `disabled` \| `error` | demo override only |
| `value` / `defaultValue` | `string?` | controlled / uncontrolled value |
| `placeholder` | `string?` | empty-state placeholder |
| `disabled` | `boolean?` | disables input |
| `invalid` | `boolean?` | error styling |
| `helperText` | `string?` | neutral helper row |
| `errorText` | `string?` | error row (wins over helper) |
| `showHelperText` | `boolean` | default `true` |
| `showIcon` | `boolean` | default `true` |
| `iconName` | `string?` | default `"mail"` |
| `showLabel` | `boolean?` | optional `FormLabel` (Figma axis) |
| `label` | `string?` | label text when `showLabel` |
| `required` | `boolean?` | shows `*` in label cluster |
| `rows` | `number?` | textarea rows (default `4`) |
| `inputType` | `string?` | text-input `type` (default `"text"`) |
| `id`, `name`, `ariaLabel`, `ariaDescribedBy` | strings | a11y wiring |
| `onValueChange` | `(value: string) => void` | change callback |

### Spec scenario references (Figma)

| Story / QA label | Node | Variant |
|---|---|---|
| Large default | `47834:48520` | Large, filled, helper |
| Small default | `47834:48553` | Small, filled, helper |
| With icon | `47834:48653` | Large, suffix `mail` |
| Error | `47834:48457` | Large, empty, error message |

## Codegen Contract (Framework-Agnostic Blueprint)

### IDS merge strategy

```
effectiveSpec = merge(
  load("components/ids/text-box/design-spec.md"),
  load("components/synapse/text-input/design-spec.md"),
  precedence: "programme-overrides-ids"
)
```

### Deterministic structure

1. `TextInputRoot`
2. `FormLabel?`
3. `TextBoxControl` (**Synapse:** `border-radius: var(--corner-radius-radius-4)`)
4. `TextBoxInput | TextBoxTextArea`
5. `TextBoxSuffixIcon?`
6. `TextBoxFocusRing?` (**Synapse:** `inset -5px`, `radius-6`, `border-brand-base`)
7. `TextBoxHelperRow?`
8. `TextBoxErrorIcon?` (error only)
9. `TextBoxHelperText | TextBoxErrorText`

### Variant matrix

| Axis | Values |
|---|---|
| `programme` | `ids` \| `synapse` |
| `componentType` | `text-input` \| `text-area` |
| `size` | `large` \| `small` (`small` → text-input only) |
| `content` | `empty` \| `filled` |
| `visualState` | `default` \| `hover` \| `selected` \| `focus-visible` \| `disabled` \| `error` |
| `helperMode` | `none` \| `helper` \| `error` |
| `suffixIcon` | `hidden` \| `visible` (default slug `mail`) |
| `showLabel` | `false` \| `true` |

### Programme override rules

| Rule | IDS | Synapse |
|---|---|---|
| Control `border-radius` | `0` | `var(--corner-radius-radius-4)` |
| Focus ring `border-radius` | `var(--corner-radius-radius-4)` | `var(--corner-radius-radius-6)` |
| Border/text/icon tokens | IDS token set | **Same** semantic names (theme via `synapse-theme.css`) |
| Pointer vs keyboard focus | inherit IDS contract | inherit IDS contract |

### Per-slot style contract

| Slot | Synapse rule |
|---|---|
| `TextBoxControl` | heights `40`/`32`; padding `padding-16`; gap `space-10`; **radius-4** |
| `TextBoxFocusRing` | `inset: -5px`; **radius-6**; `border-brand-base` |
| `TextBoxSuffixIcon` | `16×16`; `icon-neutral` / `icon-disabled` |
| `TextBoxHelperText` | Body 2; `text-neutral` |
| `TextBoxErrorText` | Body 2; `text-critical` |
| `TextBoxErrorIcon` | `status-critical-square-solid`; `icon-alerting-critical` |

### Behavior contract

- `onValueChange` on every text change.
- `disabled` overrides all interactive visuals to disabled model.
- `invalid || errorText` → error helper row; suppress neutral helper text.
- Pointer focus → selected border only (no outer ring).
- Keyboard `:focus-visible` → accessible border + Synapse outer ring.
- `showHelperText=false` → hide helper and error rows.
- `componentType=text-area` + `size=small` → ignore small height; use textarea layout.

### Accessibility contract

See **Interactions → Accessibility**.

### Asset resolution + bundling contract

| Slug | Size | Usage |
|---|---|---|
| `mail` | `16×16` | Default suffix icon |
| `status-critical-square-solid` | `16×16` | Error row icon |

Resolve from `assets/icons/<slug>.svg` via shared `Icon`. Missing slug → no icon (layout preserved).

### Fallback/error rules

- Unknown `size` → `large`
- Unknown `componentType` → `text-input`
- Unknown `programme` → `ids`
- `errorText` present → error row over helper
- Missing `iconName` asset → omit icon

### Validation checklist

- [x] IDS baseline linked; programme deltas table complete
- [x] Live Figma MCP on `47833:47770`, `47834:48520`, `47834:48553`, `47834:48653`, `47834:48457`
- [x] `get_variable_defs` on default/focus/error symbols (`47833:48063`, `47833:48038`, `47833:48022`)
- [x] Large `40px` / small `32px` heights match Figma
- [x] Synapse control **radius-4** documented vs IDS `0`
- [x] Synapse focus ring **radius-6** at `inset -5px` documented
- [x] Error row icon + critical text tokens match `47834:48457`
- [x] Suffix icon `mail` `16×16` on `47834:48653`
- [x] State matrix axes match component set (`Size`, `Content`, `State`, `Type`)
- [x] Programme merge strategy documented for framework-agnostic codegen
- [x] Light/Dark via `synapse-theme.css` semantic tokens only
- [x] Spec contract + Storybook stories wired (`synapse-text-input.contract.ts`, `SynapseTextInput.stories.tsx`)
- [x] `programme="synapse"` applies control `radius-4` + focus ring `radius-6` in `IdsTextBox.module.css`
- [x] `SynapseTextInput` wrapper exports programme default for Synapse targets

## Source Mapping

| Property | Value |
|---|---|
| Design source | Synapse Hi-Fi `Td1bnsvRj1PCGs9RVJkIvJ` |
| Component set | `47833:47770` |
| Scenario — large | `47834:48520` |
| Scenario — small | `47834:48553` |
| Scenario — with icon | `47834:48653` |
| Scenario — error | `47834:48457` |
| IDS baseline | `components/ids/text-box/design-spec.md` — node `42065:39424` (`0bHk3XhrjFhowgFkz9yLr4`) |
| Component map | `data/synapse-component-figma-map.json` → Text Input |
| Registry | `data/programme-inheritance-registry.json` → `synapse` / `text-input` |
| Spec contract | `storybook/src/spec-contracts/synapse-text-input.contract.ts` |
| Storybook | `storybook/src/components/SynapseTextInput.stories.tsx` (main story glob — avoids stale `importers[path]` on hot-add) |
| Shared implementation | `storybook/src/components/IdsTextBox.tsx` |
| Programme wrapper | `storybook/src/components/SynapseTextInput.tsx` |
| Verification | Figma MCP — **2026-06-05** |
