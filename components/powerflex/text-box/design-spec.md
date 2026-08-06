# Text Box

> PowerFlex programme component. Figma source name: `text-input` (PowerFlex MCP Design System).

## Metadata

| Property | Value |
|---|---|
| Component | Text Box |
| Slug | text-box |
| Programme | PowerFlex |
| Status | draft |
| Spec pattern | standalone |
| Figma file key | `82bDP05ESsiiGe38p5TEQJ` |
| Main component set | `2723:2611` |
| Verification method | Figma REST API |
| Packaged evidence | `figma_evidence.json` (rest mode) |
| Theme CSS | `components/powerflex-theme.css` |
| Last verified | 2026-08-06 |

## Anatomy

A Text Box is composed of the following slots:

1. **FieldContainer** — the outer rectangular input shell.
2. **Value** — the typed text layer (shown when `Content state=filled`).
3. **Placeholder** — the hint text layer (shown when `Content state=example` or `empty`).
4. **FocusRing** — an outline frame that indicates keyboard focus.
5. **IconLeading** (optional) — icon slot inside the field.
6. **StatusIcon** / **ErrorMessage** (optional) — error chrome shown when `State=error`.

## Layout & Measurements

### Sizes

| Size | Height | Figma node |
|---|---|---|
| sm | 24px | `2723:2603` |
| md | 32px | `2723:2605` |
| lg | 40px | `2723:2610` |

All sizes are 476px wide in the Figma component set; generated code should allow a fluid width.

### Padding & spacing

| Property | Value | Token |
|---|---|---|
| Horizontal padding | 8px | `var(--input-padding-x)` |
| Internal item spacing | 16px | `var(--input-gap)` |
| Border width | 1px | `var(--input-border-width)` |
| Border radius | 5px | `var(--input-border-radius)` |

### Slot geometry (Figma-verified)

| Slot / layer | Property | Token / contract | Figma node | Live evidence |
|---|---|---|---|---|
| TextInput (component set) | `border-radius` | `var(--input-border-radius)` (`5px`) | `2723:2611` | `get_design_context` cornerRadius=5.0 |
| FieldContainer | `min-height` | `var(--input-height-<size>)` | `2723:2610` | `get_design_context` height=40.0 (lg) |
| FieldContainer | `padding-left` / `padding-right` | `var(--input-padding-x)` (`8px`) | `2723:2610` | `get_design_context` paddingLeft=8.0, paddingRight=8.0; boundVariableHints: `VariableID:2454:3`, `VariableID:2454:2`, `VariableID:2521:3`, `VariableID:2453:4`, `VariableID:2453:8` |
| FieldContainer | `border-width` | `var(--input-border-width)` (`1px`) | `2723:2610` | `get_design_context` strokeWeight=1.0; `get_variable_defs` `border-width/thin` (`VariableID:2452:40`) |
| FocusRing | `stroke` (outline) | `var(--input-focus-ring-color)` (`#0076ce`) | `2694:3714` | `get_design_context` stroke=1.0px `#0076ce`; boundVariableHint: `VariableID:2453:30` |
| Value | `fill` | `var(--input-text-color)` (`#333333`) | `2694:3711` | `get_design_context` fill `#333333`; `get_variable_defs` `color/text/primary` (`VariableID:2453:14`) |
| Placeholder | `fill` | `var(--input-placeholder-color)` (`#888888`) | `2694:3741` | `get_design_context` fill `#888888` |
| ErrorMessage | `padding-top` / `padding-bottom` | `var(--input-error-padding-y)` (`4px`) | `2723:2398` | `get_design_context` paddingTop=4.0, paddingBottom=4.0; boundVariableHints: `VariableID:2454:2`, `VariableID:2521:3`, `VariableID:2521:6` |
| IconLeading | `padding-top` | `var(--input-icon-padding-top)` (`2px`) | `2723:2403` | `get_design_context` paddingTop=2.0; boundVariableHint: `VariableID:2521:5` |

## Tokens

### Colors

| Token | Light value | Figma source |
|---|---|---|
| `var(--input-background-color)` | `#ffffff` | default fill `2723:2610` |
| `var(--input-disabled-background-color)` | `#f4f4f4` | disabled fill `2723:2608`; `inputs/inputDisabledBackgroundColor` (`VariableID:3260:8770`) |
| `var(--input-border-color)` | `#888888` | default stroke `2723:2610`; `inputs/inputBorder` (`VariableID:3260:8785`) |
| `var(--input-hover-border-color)` | `#333333` | hover stroke `2723:2589`; `color/border/strongest` (`VariableID:2453:10`) |
| `var(--input-active-border-color)` | `#0076ce` | active stroke `2723:2576`; `color/border/action` (`VariableID:2453:11`) |
| `var(--input-disabled-border-color)` | `#888888` | disabled stroke `2723:2608`; `inputs/inputDisabledBorderColor` (`VariableID:3260:8761`) |
| `var(--input-error-border-color)` | `#af0000` | error input-row stroke `2723:2533`; `color/action/danger/default` (`VariableID:2453:36`) |
| `var(--input-text-color)` | `#333333` | value fill `2694:3711`; `color/text/primary` (`VariableID:2453:14`) |
| `var(--input-placeholder-color)` | `#888888` | placeholder fill `2694:3741` |
| `var(--input-disabled-text-color)` | `#777777` | disabled value fill `2694:3716`; `inputs/inputDisabledTextColor` (`VariableID:3260:8764`) |
| `var(--input-error-text-color)` | `#af0000` | error vector fill `2723:2399`; `color/action/danger/default` (`VariableID:2453:36`) |
| `var(--input-focus-ring-color)` | `#0076ce` | focus-ring stroke `2694:3714` |

### Typography

| Token | Value | Figma source |
|---|---|---|
| `var(--input-font-size)` | 14px | `type/size/200` (`VariableID:2452:47`) |
| `var(--input-line-height)` | 20px | `type/line-height/200` (`VariableID:2452:71`) |
| `var(--input-font-weight)` | 400 | Roboto 14.0px / 20.0 / weight 400 |
| `var(--input-error-font-size)` | 14px | Roboto 14.0px / 20.0 / weight 400 |

### Geometry

| Token | Value | Figma source |
|---|---|---|
| `var(--input-border-radius)` | 5px | `2723:2611` cornerRadius=5.0 |
| `var(--input-border-width)` | 1px | `border-width/thin` (`VariableID:2452:40`) |
| `var(--input-padding-x)` | 8px | `2723:2610` paddingLeft/Right=8.0 |
| `var(--input-gap)` | 16px | `2723:2610` itemSpacing=16.0 |
| `var(--input-height-sm)` | 24px | `2723:2603` height=24.0 |
| `var(--input-height-md)` | 32px | `2723:2605` height=32.0 |
| `var(--input-height-lg)` | 40px | `2723:2610` height=40.0; `size/component/height/lg` (`VariableID:2454:14`) |

## States (Light Theme)

### Default

| Size | Background | Border | Text-Icon |
|---|---|---|---|
| sm | `var(--input-background-color)` | `var(--input-border-color)` | `var(--input-text-color)` |
| md | `var(--input-background-color)` | `var(--input-border-color)` | `var(--input-text-color)` |
| lg | `var(--input-background-color)` | `var(--input-border-color)` | `var(--input-text-color)` |

Figma nodes: `2723:2603` (sm), `2723:2605` (md), `2723:2610` (lg).

### Hover

| Size | Background | Border | Text-Icon |
|---|---|---|---|
| sm | `var(--input-background-color)` | `var(--input-hover-border-color)` | `var(--input-text-color)` |
| md | `var(--input-background-color)` | `var(--input-hover-border-color)` | `var(--input-text-color)` |
| lg | `var(--input-background-color)` | `var(--input-hover-border-color)` | `var(--input-text-color)` |

Figma nodes: `2723:2598` (sm), `2723:2587` (md), `2723:2589` (lg).

### Active

| Size | Background | Border | Text-Icon |
|---|---|---|---|
| sm | `var(--input-background-color)` | `var(--input-active-border-color)` | `var(--input-text-color)` |
| md | `var(--input-background-color)` | `var(--input-active-border-color)` | `var(--input-text-color)` |
| lg | `var(--input-background-color)` | `var(--input-active-border-color)` | `var(--input-text-color)` |

Figma nodes: `2723:2572` (sm), `2723:2573` (md), `2723:2576` (lg).

### Disabled

| Size | Background | Border | Text-Icon |
|---|---|---|---|
| sm | `var(--input-disabled-background-color)` | `var(--input-disabled-border-color)` | `var(--input-disabled-text-color)` |
| md | `var(--input-disabled-background-color)` | `var(--input-disabled-border-color)` | `var(--input-disabled-text-color)` |
| lg | `var(--input-disabled-background-color)` | `var(--input-disabled-border-color)` | `var(--input-disabled-text-color)` |

Figma nodes: `2723:2602` (sm), `2723:2604` (md), `2723:2608` (lg).

### Error

| Size | Background | Border | Text-Icon |
|---|---|---|---|
| sm | `var(--input-background-color)` | `var(--input-error-border-color)` | `var(--input-error-text-color)` |
| md | `var(--input-background-color)` | `var(--input-error-border-color)` | `var(--input-error-text-color)` |
| lg | `var(--input-background-color)` | `var(--input-error-border-color)` | `var(--input-error-text-color)` |

Figma nodes: `2723:2579` (sm), `2723:2567` (md); `2723:2533` (error `input-row` shell). Error `lg` node is in the Figma component set but not separately captured in the packaged evidence.

## States (Dark Theme)

Dark-mode values are not included in the packaged Figma evidence. The same semantic token contract applies; implement the dark theme overrides in `components/powerflex-theme.css`.

| State | Background | Border | Text-Icon |
|---|---|---|---|
| Default | `var(--input-background-color)` | `var(--input-border-color)` | `var(--input-text-color)` |
| Hover | `var(--input-background-color)` | `var(--input-hover-border-color)` | `var(--input-text-color)` |
| Active | `var(--input-background-color)` | `var(--input-active-border-color)` | `var(--input-text-color)` |
| Disabled | `var(--input-disabled-background-color)` | `var(--input-disabled-border-color)` | `var(--input-disabled-text-color)` |
| Error | `var(--input-background-color)` | `var(--input-error-border-color)` | `var(--input-error-text-color)` |

## Interactions

### Accessibility

- Use a visible 1px focus ring (`var(--input-focus-ring-color)`).
- Keyboard: `Tab` to focus, then type. The component does not activate with `Space`/`Enter`.
- Disabled state: remove from tab order and use `disabled` (or `aria-disabled="true"`).
- Error state: set `aria-invalid="true"` and link `ErrorMessage` via `aria-describedby`.
- Contrast: value text `#333333` on `#ffffff` meets WCAG AA.

### Behavior & guidelines

- Placeholder text is shown only when the input is empty and not focused.
- Hover darkens the border to `var(--input-hover-border-color)`.
- Active/focus uses `var(--input-active-border-color)` / `var(--input-focus-ring-color)`.
- Disabled uses `var(--input-disabled-background-color)` and `var(--input-disabled-text-color)`.
- Error adds `var(--input-error-border-color)`, a leading status icon, and an optional `ErrorMessage`.

## Composition & API (runtime)

### Variants

| Variant | Prop | Values |
|---|---|---|
| Size | `size` | `sm`, `md`, `lg` |
| State | `state` | `default`, `hover`, `active`, `disabled`, `error` |
| Content | `content` | `empty`, `placeholder`, `filled` |

### Runtime API

```ts
interface TextBoxProps {
  size?: 'sm' | 'md' | 'lg';
  state?: 'default' | 'hover' | 'active' | 'disabled' | 'error';
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  leadingIcon?: React.ReactNode;
  helperText?: string;
}
```

## Codegen Contract (Framework-Agnostic Blueprint)

### Deterministic structure

- Root: `<input class="text-box">` (or a wrapping `<div class="text-box">` around an `<input>` if slots are needed).
- Focus ring: a sibling `<span class="text-box__focus-ring">` or `:focus-visible` outline, 1px `var(--input-focus-ring-color)`.
- Error chrome: `<span class="text-box__status-icon">` and `<span class="text-box__error-message">` rendered after the input when `state=error`.

### Variant matrix

| Variant | CSS selector / class | Token effect |
|---|---|---|
| size | `.text-box--sm`, `.text-box--md`, `.text-box--lg` | sets `min-height` to `var(--input-height-<size>)` |
| state | `.text-box--default`, `.text-box--hover`, `.text-box--active`, `.text-box--disabled`, `.text-box--error` | selects background, border, and text tokens |
| content | `.text-box--empty`, `.text-box--placeholder`, `.text-box--filled` | toggles placeholder/value visibility |

### Per-slot style contract

- `.text-box` — `background`, `border`, `border-radius`, `min-height`, `padding-inline: var(--input-padding-x)`, `font-size`, `line-height`, `color`.
- `.text-box__focus-ring` — `position: absolute; inset: -2px; border: 1px solid var(--input-focus-ring-color); border-radius: var(--input-border-radius);` shown on `:focus-visible`.
- `.text-box::placeholder` — `color: var(--input-placeholder-color)`.
- `.text-box__error-message` — `color: var(--input-error-text-color); padding-block: var(--input-error-padding-y)`.
- `.text-box__icon-leading`, `.text-box__status-icon` — `padding-top: var(--input-icon-padding-top); fill: var(--input-error-text-color)` for the status icon.

### Behavior contract

- Focus: apply `var(--input-active-border-color)` to the field and show the focus ring.
- Hover: apply `var(--input-hover-border-color)` unless disabled or focused.
- Disabled: suppress hover/active, apply disabled tokens, and remove from tab order.
- Error: overrides active border with `var(--input-error-border-color)` and renders error chrome.
- Placeholder: visible when value is empty and not focused.

### Accessibility contract

- Render `<input type="text">` (or `textarea` for multiline variants) with semantic attributes.
- `aria-invalid="true"` when `state=error`.
- `aria-describedby` referencing the `ErrorMessage` id.
- Visible focus ring for keyboard users.

### Asset resolution + bundling contract

- Import `components/powerflex-theme.css` so tokens resolve.
- No raster assets; icons are resolved by the framework icon system.

### Fallback/error rules

- Default `size` is `md`.
- `disabled` wins over `error` if both are set.
- Empty `value` with no `placeholder` renders the empty state.
- Missing tokens fall back to the raw light values listed in the Tokens section.

### Validation checklist

- [ ] `border-radius` is `var(--input-border-radius)` (5px) and verified against node `2723:2611`.
- [ ] Light theme state matrices match the Figma nodes in Source Mapping.
- [ ] Focus ring is 1px `var(--input-focus-ring-color)` and visible on `:focus-visible`.
- [ ] Disabled state uses `var(--input-disabled-background-color)` and `var(--input-disabled-text-color)`.
- [ ] Error state uses `var(--input-error-border-color)` and `var(--input-error-text-color)`.
- [ ] Heights are `24px` / `32px` / `40px` for `sm` / `md` / `lg`.
- [ ] All color values are exposed as CSS custom properties in `components/powerflex-theme.css`.

## Source Mapping

| Item | Figma file key / node ID |
|---|---|
| Figma file | `82bDP05ESsiiGe38p5TEQJ` |
| Verification method | Figma REST API |
| Component set (`text-input`) | `2723:2611` |
| Default / filled / lg | `2723:2610` |
| Default / filled / md | `2723:2605` |
| Default / filled / sm | `2723:2603` |
| Default / example / lg | `2723:2601` |
| Default / example / md | `2723:2597` |
| Default / example / sm | `2723:2590` |
| Default / empty / lg | `2723:2585` |
| Default / empty / md | `2723:2586` |
| Default / empty / sm | `2723:2596` |
| Hover / filled / lg | `2723:2589` |
| Hover / filled / md | `2723:2587` |
| Hover / filled / sm | `2723:2598` |
| Hover / example / lg | `2723:2594` |
| Hover / example / md | `2723:2591` |
| Hover / example / sm | `2723:2581` |
| Hover / empty / lg | `2723:2580` |
| Hover / empty / md | `2723:2578` |
| Hover / empty / sm | `2723:2577` |
| Active / filled / lg | `2723:2576` |
| Active / filled / md | `2723:2573` |
| Active / filled / sm | `2723:2572` |
| Active / example / lg | `2723:2584` |
| Active / example / md | `2723:2571` |
| Active / example / sm | `2723:2570` |
| Active / empty / lg | `2723:2569` |
| Active / empty / md | `2723:2592` |
| Active / empty / sm | `2723:2568` |
| Disabled / filled / lg | `2723:2608` |
| Disabled / filled / md | `2723:2604` |
| Disabled / filled / sm | `2723:2602` |
| Disabled / example / lg | `2723:2599` |
| Disabled / example / md | `2723:2593` |
| Disabled / example / sm | `2723:2588` |
| Disabled / empty / lg | `2723:2600` |
| Disabled / empty / md | `2723:2583` |
| Disabled / empty / sm | `2723:2582` |
| Error / filled / md | `2723:2567` |
| Error / filled / sm | `2723:2579` |
| Error input-row shell | `2723:2533` |
| Error message | `2723:2398` |
| Error icon-leading | `2723:2403` |
| Error status icon | `2723:2399` |
| Focus ring (default lg) | `2694:3714` |
| Focus ring (default md) | `2694:3724` |
| Focus ring (default sm) | `2694:3734` |
| Value (default lg) | `2694:3711` |
| Placeholder (default lg) | `2694:3741` |

