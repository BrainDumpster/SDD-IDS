# Text Box — PowerFlex

## Metadata

| Property | Value |
|---|---|
| **Slug** | `text-box` |
| **Display name** | Text Box |
| **Programme** | PowerFlex |
| **Description** | Single-line text input with placeholder, value, hover, active, disabled and error states. Supports small, medium and large sizes and an optional leading status icon in the error row. |
| **Status** | `active` |
| **Version** | `1.0.0` |
| **Created** | `2026-08-04` |
| **Updated** | `2026-08-04` |
| **Spec pattern** | `standalone` |
| **Figma verification** | Figma REST API — file `82bDP05ESsiiGe38p5TEQJ`, component set `2723:2611` |

## Anatomy

| Slot / layer | Purpose | Notes |
|---|---|---|
| `FieldContainer` (COMPONENT set) | Outer component set `text-input` | Holds all size/state variants. |
| `input-row` | Text field rectangle | Background + border. Node `2723:2533`. |
| `value` | User-entered text | Node `2694:3711` (lg default filled). |
| `placeholder` | Empty-input hint | Node `2694:3741` (lg default example). |
| `focus-ring` | Focus indicator | 1 px stroke, outset around `input-row`. Node `2694:3714`. |
| `icon-leading` | Leading icon slot | Node `2723:2403`. |
| `error-message` | Inline error text row | Node `2723:2398`, paired with `status-critical-circ-solid` `2723:2399`. |
| `status-critical-circ-solid` | Critical status icon | Node `2723:2399`. |

## Layout & Measurements

### Sizes

| Size | Height | Reference width | Padding | Item spacing |
|---|---|---|---|---|
| `sm` | 24 px | 476 px | 8 px left / 8 px right | 16 px |
| `md` | 32 px | 476 px | 8 px left / 8 px right | 16 px |
| `lg` | 40 px | 476 px | 8 px left / 8 px right | 16 px |

### Focus ring

| Layer | Width | Height | Offset |
|---|---|---|---|
| `focus-ring` (lg) | 480 px | 44 px | +2 px all sides from 476×40 input-row |
| `focus-ring` (md) | 480 px | 36 px | +2 px all sides from 476×32 input-row |
| `focus-ring` (sm) | 480 px | 28 px | +2 px all sides from 476×24 input-row |

### Slot geometry (Figma-verified)

| Slot / layer | Property | Token / contract | Figma node | Live evidence |
|---|---|---|---|---|
| `text-input` (COMPONENT_SET) | `border-radius` | `--text-box-control-radius: 5px` | `2723:2611` | `get_design_context`: cornerRadius = `5.0` |
| `State=default, Content state=filled, Size=lg` | `padding` | `padding-left: 8px; padding-right: 8px` | `2723:2610` | `get_design_context` |
| `State=default, Content state=filled, Size=lg` | `stroke` | `1px` / bound hints `VariableID:2453:4` (`color/background/surface`), `VariableID:2453:8` (`color/border/default`) plus unresolved `VariableID:2454:3`, `VariableID:2454:2`, `VariableID:2521:3` | `2723:2610` | `get_design_context` + `boundVariableHints` |
| `focus-ring` | `stroke` | `1px` / bound hint `VariableID:2453:30` | `2694:3714` | `get_design_context` + `boundVariableHints` |
| `input-row` | `padding` | `8px` left/right | `2723:2533` | `get_design_context` + `boundVariableHints` including `VariableID:2453:4` (`color/background/surface`) and `VariableID:2453:58` |
| `error-message` | `padding` | `4px` top/bottom | `2723:2398` | `get_design_context` + `boundVariableHints` including `VariableID:2521:5` (`space/component/3xs`) |
| `icon-leading` | `padding-top` | `2px` | `2723:2403` | `get_design_context` + `boundVariableHints` including `VariableID:2521:5` (`space/component/3xs`) |

## Tokens

### Typography

| Usage | Font | Size | Line height | Weight |
|---|---|---|---|---|
| Value / placeholder / error message | Roboto | `14px` | `20px` | `400` |

### Geometry tokens

| Token | Value | Source |
|---|---|---|
| `--text-box-control-radius` | `5px` | Figma `get_design_context` `cornerRadius = 5.0` |
| `--text-box-focus-ring-radius` | `4px` | IDS scale `--corner-radius-radius-4` |
| `--text-box-border-width` | `1px` | `--border-width-border-default` |
| `--text-box-min-height-sm` | `24px` | Component `2723:2603` |
| `--text-box-min-height-md` | `32px` | Component `2723:2605` |
| `--text-box-min-height-lg` | `40px` | Component `2723:2610` |

### Color tokens

| Token | Light | Dark | Figma variable / evidence |
|---|---|---|---|
| `--text-box-background-default` | `#ffffff` | `#111619` | `get_design_context` fill + bound `VariableID:2453:4` (`color/background/surface`) |
| `--text-box-background-disabled` | `#f4f4f4` | `#1e262c` | `get_design_context` disabled fill |
| `--text-box-border-default` | `#888888` | `#34414c` | `get_design_context` default stroke + bound `VariableID:2453:8` (`color/border/default`) |
| `--text-box-border-hover` | `#333333` | `#b8c1c9` | `get_design_context` hover stroke |
| `--text-box-border-active` | `#0076ce` | `#4c8edd` | `get_design_context` active stroke |
| `--text-box-value-text` | `#333333` | `#e6e9ec` | `get_design_context` value fill |
| `--text-box-placeholder-text` | `#888888` | `#8898a5` | `get_design_context` placeholder fill |
| `--text-box-text-disabled` | `#777777` | `#9e9e9e` | `get_design_context` disabled value fill |
| `--text-box-error-border` | `#af0000` | `#dd9494` | `get_design_context` input-row stroke |
| `--text-box-error-text` | `#af0000` | `#dd9494` | `get_design_context` vector / error message fill |
| `--text-box-focus-ring-color` | `#0076ce` | `#4c8edd` | `get_design_context` focus-ring stroke + bound `VariableID:2453:30` |

## States (Light Theme)

| State | Background | Border | Text / Icon |
|---|---|---|---|
| Default (filled) | `var(--text-box-background-default)` `#ffffff` | `var(--text-box-border-default)` `#888888` | `var(--text-box-value-text)` `#333333` |
| Default (placeholder) | `var(--text-box-background-default)` `#ffffff` | `var(--text-box-border-default)` `#888888` | `var(--text-box-placeholder-text)` `#888888` |
| Hover | `var(--text-box-background-default)` `#ffffff` | `var(--text-box-border-hover)` `#333333` | `var(--text-box-value-text)` `#333333` |
| Active / Focus | `var(--text-box-background-default)` `#ffffff` | `var(--text-box-border-active)` `#0076ce` | `var(--text-box-value-text)` `#333333` |
| Disabled | `var(--text-box-background-disabled)` `#f4f4f4` | `var(--text-box-border-default)` `#888888` | `var(--text-box-text-disabled)` `#777777` |
| Error | `var(--text-box-background-default)` `#ffffff` | `var(--text-box-error-border)` `#af0000` | `var(--text-box-error-text)` `#af0000` |

## States (Dark Theme)

| State | Background | Border | Text / Icon |
|---|---|---|---|
| Default (filled) | `var(--text-box-background-default)` `#111619` | `var(--text-box-border-default)` `#34414c` | `var(--text-box-value-text)` `#e6e9ec` |
| Default (placeholder) | `var(--text-box-background-default)` `#111619` | `var(--text-box-border-default)` `#34414c` | `var(--text-box-placeholder-text)` `#8898a5` |
| Hover | `var(--text-box-background-default)` `#111619` | `var(--text-box-border-hover)` `#b8c1c9` | `var(--text-box-value-text)` `#e6e9ec` |
| Active / Focus | `var(--text-box-background-default)` `#111619` | `var(--text-box-border-active)` `#4c8edd` | `var(--text-box-value-text)` `#e6e9ec` |
| Disabled | `var(--text-box-background-disabled)` `#1e262c` | `var(--text-box-border-default)` `#34414c` | `var(--text-box-text-disabled)` `#9e9e9e` |
| Error | `var(--text-box-background-default)` `#111619` | `var(--text-box-error-border)` `#dd9494` | `var(--text-box-error-text)` `#dd9494` |

## Interactions

### Behavior & guidelines

- **Hover**: `input-row` border switches from `--text-box-border-default` to `--text-box-border-hover`.
- **Active / Focus**: `input-row` border switches to `--text-box-border-active`. A separate `focus-ring` layer is rendered with `box-shadow: 0 0 0 1px var(--text-box-focus-ring-color)` or an equivalent 1 px outline so focus is visible independent of the border color.
- **Disabled**: The field is not interactive. `value` text uses `--text-box-text-disabled` and `input-row` uses `--text-box-background-disabled`.
- **Error**: The `input-row` border and `error-message` text/icon use `--text-box-error-border`. The error row is placed below the input row with 4 px vertical padding and 8 px item spacing between icon and message.
- **Sizes**: `sm`, `md`, `lg` only affect height and min-height; typography stays at 14 px / 20 px.

### Accessibility

- The native `<input>` must have an associated `<label>` (or `aria-label` / `aria-labelledby`) and a unique `id`.
- `aria-invalid="true"` is set in the error state.
- `aria-describedby` must point to the `error-message` id when an error is present.
- Focus state must be visible (focus-ring) and not rely on color alone.

## Composition & API (runtime)

### Variants

| Variant | Values | Notes |
|---|---|---|
| `size` | `sm`, `md`, `lg` | Controls `min-height` and `padding` only. |
| `state` | `default`, `hover`, `active`, `disabled`, `error` | `hover` and `active` are visual states; `disabled` and `error` are boolean. |
| `content` | `empty`, `placeholder`, `filled` | Determines whether `value` or `placeholder` is rendered. |
| `leadingIcon` | `none`, `status` | Error variant uses `status-critical-circ-solid`. |

### Runtime API

| Prop / slot | Type | Default | Description |
|---|---|---|---|
| `value` | `string` | `""` | Current input value. |
| `placeholder` | `string` | `undefined` | Placeholder text. |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Input height. |
| `disabled` | `boolean` | `false` | Disables interaction. |
| `invalid` | `boolean` | `false` | Renders error border and message. |
| `errorMessage` | `string` | `undefined` | Text shown in `error-message` row. |
| `leadingIcon` | `ReactNode` | `undefined` | Optional leading icon inside `input-row`. |
| `onChange` | `(value: string) => void` | `undefined` | Change handler. |

## Codegen Contract (Framework-Agnostic Blueprint)

### Deterministic structure

```
TextBox (wrapper)
├── input-row [data-slot="input-row"]
│   ├── leadingIcon [data-slot="icon-leading"] (optional)
│   ├── value | placeholder [data-slot="text"]
│   └── focus-ring [data-slot="focus-ring"]
└── error-message [data-slot="error-message"]
    ├── status-critical-circ-solid [data-slot="error-icon"]
    └── error-text [data-slot="error-text"]
```

### Variant matrix

| `size` | `content` | `state` | Rendered text | CSS modifier |
|---|---|---|---|---|
| `lg` | `filled` | `default` | `value` | `.pf-text-box--lg` |
| `lg` | `filled` | `hover` | `value` | `.pf-text-box--lg.pf-text-box--hover` |
| `lg` | `filled` | `active` | `value` | `.pf-text-box--lg.pf-text-box--active` |
| `lg` | `filled` | `disabled` | `value` | `.pf-text-box--lg.pf-text-box--disabled` |
| `lg` | `filled` | `error` | `value` + `error-message` | `.pf-text-box--lg.pf-text-box--error` |
| `lg` | `placeholder` | `default` | `placeholder` | `.pf-text-box--placeholder` |
| `md` | * | * | * | `.pf-text-box--md` |
| `sm` | * | * | * | `.pf-text-box--sm` |

### Per-slot style contract

| Slot | Deterministic style |
|---|---|
| `input-row` | `min-height` by size; `background: var(--text-box-background-default)`; `border: var(--text-box-border-width) solid var(--text-box-border-default)`; `border-radius: var(--text-box-control-radius)`; `padding: 0 8px`; `display: flex`; `align-items: center`; `gap: 16px`. |
| `focus-ring` | Rendered as an absolute inset/outset `1px` ring. `border-radius: var(--text-box-focus-ring-radius)`; `box-shadow: 0 0 0 1px var(--text-box-focus-ring-color)` when focused. |
| `value` / `placeholder` | `font: 400 14px/20px Roboto`; `color: var(--text-box-value-text)` / `var(--text-box-placeholder-text)`. |
| `error-message` | `font: 400 14px/20px Roboto`; `color: var(--text-box-error-text)`; `padding: 4px 0`; `gap: 8px`; `display: flex`; `align-items: center`. |
| `icon-leading` | `padding-top: 2px`; size `16px × 18px`; `color: var(--text-box-error-text)` in error state. |
| `status-critical-circ-solid` | `16px × 16px`; `color: var(--text-box-error-text)`. |

### Behavior contract

- Generators must emit a stateful wrapper that toggles classes for `hover`, `active`, `disabled` and `error`.
- `focus-ring` is always present in the DOM and visually hidden until `:focus-visible` or `active` state.
- Error text is only rendered when `invalid` is `true` and `errorMessage` is non-empty.
- `placeholder` color is shown when `value` is empty and `placeholder` is provided.

### Accessibility contract

- Native `<input>` is nested inside `input-row` or associated with it; all accessibility attributes live on the native input.
- `aria-invalid="true"` when `invalid`.
- `aria-describedby` points to `error-message` id.
- Focus outline (`focus-ring`) meets a minimum 2:1 contrast against the page background.

### Asset resolution + bundling contract

- Theme CSS `components/powerflex-theme.css` must be imported before any component-specific CSS.
- The `status-critical-circ-solid` icon is an SVG icon asset; bundlers may inline it or load from `@powerflex/icons/status-critical-circ-solid`.
- No fonts are bundled; `Roboto` is expected to be loaded by the consuming application.

### Fallback/error rules

- If `size` is unrecognized, default to `md`.
- If `value` and `placeholder` are both empty, render an empty `input-row` and reserve the `value` slot.
- If `invalid` is `true` but `errorMessage` is empty, render the error border but no `error-message` row.
- If a CSS custom property is missing, generators must log a warning and fall back to the light-theme hex from this spec.

### Validation checklist

- [ ] All 9 required `##` sections are present and in order.
- [ ] `### Slot geometry (Figma-verified)` table includes node `2723:2611` and bound hints.
- [ ] Light and Dark state matrices are parallel and use `var(--...)` tokens.
- [ ] Tokens reference Figma `get_design_context` / `boundVariableHints` where applicable.
- [ ] Source Mapping contains file key, node ids and verification method.
- [ ] Component heights match `sm=24px`, `md=32px`, `lg=40px`.
- [ ] Error state shows red border and red error message with leading icon.
- [ ] Focus ring is visible and independent of border color.

## Source Mapping

| Source | File key / path | Node ids | Verification |
|---|---|---|---|
| Figma component set `text-input` | `82bDP05ESsiiGe38p5TEQJ` | `2723:2611` (main component set) | Figma REST API `get_metadata` + `get_design_context` + `get_variable_defs` |
| Default filled `lg` variant | `82bDP05ESsiiGe38p5TEQJ` | `2723:2610` (component), `2694:3711` (value), `2694:3714` (focus-ring) | Figma REST API `get_design_context` + `slotGeometry` |
| Error anatomy | `82bDP05ESsiiGe38p5TEQJ` | `2723:2533` (input-row), `2723:2398` (error-message), `2723:2403` (icon-leading), `2723:2399` (status-critical-circ-solid) | Figma REST API `get_design_context` + `slotGeometry` |
| Figma URL | `https://www.figma.com/design/82bDP05ESsiiGe38p5TEQJ/PowerFlex-MCP-Design-System?node-id=2723-2611&m=dev` | — | Packaged server evidence (clientGuidance: `usePackagedEvidenceOnly`) |
