# Text Box

> PowerFlex `text-box` component. The packaged Figma evidence uses the component-set name `text-input` (file key `82bDP05ESsiiGe38p5TEQJ`, node `2723:2611`). This is a standalone PowerFlex component.

## Metadata

| Property | Value |
|---|---|
| Programme | powerflex |
| Slug | text-box |
| Figma component | text-input |
| Spec pattern | standalone |
| Status | draft |
| Created | 2026-08-06 |
| Updated | 2026-08-06 |
| Theme CSS | `components/powerflex-theme.css` |
| Figma file key | `82bDP05ESsiiGe38p5TEQJ` |
| Main Figma node | `2723:2611` |
| Verification method | Figma REST API (packaged evidence) |
| Designer follow-up applied | Text inputs must render as a native `<input type="text">`; the Figma `value`/`placeholder` text layers must not become DOM `<div>` text nodes. |

## Anatomy

The component exposes these slots:

| Slot | Figma type | Purpose | HTML contract |
|---|---|---|---|
| `text-input` | `COMPONENT_SET` | Root container / field wrapper | `<div class="text-box">` |
| `value` | `TEXT` | Current input text (filled state) | Native `<input type="text">` value |
| `placeholder` | `TEXT` | Placeholder text (empty/example state) | Native `<input type="text">` `placeholder` attribute |
| `focus-ring` | `FRAME` | Focus outline visual | Rendered as `:focus` outline / pseudo-element, not a DOM sibling `div` |
| `input-row` | `FRAME` | Field row inside the error state | `<div class="text-box__input-row">` containing the `<input>` |
| `error-message` | `FRAME` | Error text + icon block | `<div class="text-box__error-message">` |
| `icon-leading` | `FRAME` | Status icon wrapper | `<span class="text-box__icon">` |
| `status-critical-circ-solid` | `INSTANCE` | Critical icon | Rendered via the design-system icon component or inline SVG |

**Important:** The editable area is the native `<input type="text">` element. Figma `value` and `placeholder` are represented in code by the `input` element's `value` and `placeholder` properties; they must not be output as separate `div` text nodes.

## Layout & Measurements

### Slot geometry (Figma-verified)

| Slot / layer | Property | Token / contract | Figma node | Live evidence |
|---|---|---|---|---|
| `text-input` (component set) | `border-radius` | `5px` (`cornerRadius=5.0`) | `2723:2611` | `slotGeometry` / `get_design_context` |
| `text-input` (component set) | `stroke-weight` | `1px` | `2723:2611` | `slotGeometry` |
| `State=default, Content state=filled, Size=lg` | `min-height` | `40px` | `2723:2610` | `slotGeometry` |
| `State=default, Content state=filled, Size=md` | `min-height` | `32px` | `2723:2605` | `slotGeometry` |
| `State=default, Content state=filled, Size=sm` | `min-height` | `24px` | `2723:2603` | `slotGeometry` |
| `value` / `placeholder` (lg) | `padding-inline` | `8px` (left / right) | `2694:3711` / `2694:3741` | `slotGeometry` |
| `value` / `placeholder` (lg) | `padding-block` | `10px` (derived: `(40px - 20px line-height) / 2`) | `2694:3711` / `2694:3741` | `slotGeometry` + typography |
| `value` / `placeholder` (md) | `padding-block` | `6px` (derived: `(32px - 20px) / 2`) | `2694:3721` / `2694:3751` | `slotGeometry` + typography |
| `value` / `placeholder` (sm) | `padding-block` | `2px` (derived: `(24px - 20px) / 2`) | `2694:3731` / `2694:3761` | `slotGeometry` + typography |
| `focus-ring` (lg) | `width` / `height` | `480px x 44px` (field + 4px on each axis, centered) | `2694:3714` | `slotGeometry` |
| `focus-ring` (md) | `width` / `height` | `480px x 36px` | `2694:3724` | `slotGeometry` |
| `focus-ring` (sm) | `width` / `height` | `480px x 28px` | `2694:3734` | `slotGeometry` |
| `focus-ring` | `border-radius` | Not independently set in packaged evidence; must inherit field radius (`5px`) and not default to `0` | `2694:3714` | `slotGeometry` |
| `input-row` (error sm) | `min-height` | `24px` | `2723:2533` | `slotGeometry` |
| `error-message` | `padding-block` | `4px` | `2723:2398` | `slotGeometry` |
| `error-message` | `item-spacing` | `8px` | `2723:2398` | `slotGeometry` |
| `icon-leading` | `padding-top` | `2px` | `2723:2403` | `slotGeometry` |

**Layout notes**
- Component width is `476px` in Figma; generated components should be fluid (`width: 100%`) within their container.
- Inline padding is `8px` on left and right for all state components and for the `input-row`.
- Focus-ring frames are `2px` larger than the field on every side and use a `1px` stroke.

## Tokens

### Typography

| Slot | Font | Size / line-height | Weight | Token reference |
|---|---|---|---|---|
| `value`, `placeholder` | Roboto | `14px` / `20px` | `400` | `var(--type-size-200)`, `var(--type-line-height-1100)` |
| `error-message` | Roboto | `14px` / `20px` | `400` | `var(--type-size-200)`, `var(--type-line-height-1100)` |

### Colors (Light theme)

| Layer | State | Fill | Stroke | Text |
|---|---|---|---|---|
| `text-input` (component set) | — | — | `#8a38f5` (`1px`) | — |
| Field (`value`/`placeholder`) | default | `#ffffff` | `#888888` (`1px`) | `#333333` (value), `#888888` (placeholder) |
| Field (`value`/`placeholder`) | hover | `#ffffff` | `#333333` (`1px`) | `#333333` |
| Field (`value`/`placeholder`) | active/focus | `#ffffff` | `#0076ce` (`1px`) | `#333333` |
| Field (`value`) | disabled | `#f4f4f4` | `#888888` (`1px`) | `#777777` |
| `input-row` | error | `#ffffff` | `#af0000` (`1px`) | — |
| `error-message` | error | — | — | `#af0000` |
| `status-critical-circ-solid` | error | `#af0000` | — | — |

### Semantic token mapping

| Figma variable name | Variable ID | Usage | CSS token |
|---|---|---|---|
| `space/component/none` | `VariableID:2521:3` | Bound to most spacing / auto-layout gaps | `var(--space-component-none)` |
| `space/component/2xs` | `VariableID:2521:6` | Error-message gaps | `var(--space-component-2xs)` |
| `color/border/action` | `VariableID:2453:11` | Active/focus border color | `var(--color-border-action)` |
| `color/text/primary` | `VariableID:2453:14` | Value text | `var(--color-text-primary)` |
| `color/action/danger/default` | `VariableID:2453:36` | Critical icon / error message fill | `var(--color-action-danger-default)` |
| `inputs/inputDisabledBackgroundColor` | `VariableID:3260:8770` | Disabled background fallback | `var(--inputs-input-disabled-background-color)` |
| `inputs/inputDisabledBorderColor` | `VariableID:3260:8761` | Disabled border fallback | `var(--inputs-input-disabled-border-color)` |
| `inputs/inputDisabledTextColor` | `VariableID:3260:8764` | Disabled text fallback | `var(--inputs-input-disabled-text-color)` |
| `VariableID:2453:8` | `VariableID:2453:8` | Default border (value not named in packaged defs) | `var(--color-border-default)` (to be resolved) |
| `VariableID:2453:9` | `VariableID:2453:9` | Hover border (value not named in packaged defs) | `var(--color-border-hover)` (to be resolved) |
| `VariableID:2453:30` | `VariableID:2453:30` | Focus-ring stroke (value not named in packaged defs) | `var(--color-border-focus)` (to be resolved) |
| `VariableID:2453:58` | `VariableID:2453:58` | Error input-row border (value not named in packaged defs) | `var(--color-border-error)` (to be resolved) |
| `VariableID:2454:2` | `VariableID:2454:2` | Geometry variable bound to padding/width (value not named in packaged defs) | `var(--size-spacing-inline)` (to be resolved) |
| `VariableID:2454:3` | `VariableID:2454:3` | Geometry variable bound to padding/width (value not named in packaged defs) | `var(--size-spacing-inline)` (to be resolved) |

### Spacing

| Token | Value | Source |
|---|---|---|
| Inline padding | `8px` | `paddingLeft` / `paddingRight` in `slotGeometry` |
| Focus ring offset | `2px` on each side | `focus-ring` width/height minus field width/height |
| Error icon-to-text gap | `8px` | `error-message` `itemSpacing` |

### Radius

| Slot | Radius | Figma node |
|---|---|---|
| Field (`text-input` component set) | `5px` | `2723:2611` |
| Error `input-row` | inherits `5px` from component set | `2723:2533` |
| `focus-ring` | inherits `5px`; do not default to `0` | `2694:3714` |

## States (Light Theme)

| State | Size | Content | Background | Border | Text color | Figma node |
|---|---|---|---|---|---|---|
| Default | lg | filled | `#ffffff` | `#888888` | `#333333` | `2723:2610` |
| Default | md | filled | `#ffffff` | `#888888` | `#333333` | `2723:2605` |
| Default | sm | filled | `#ffffff` | `#888888` | `#333333` | `2723:2603` |
| Default | lg | example (placeholder) | `#ffffff` | `#888888` | `#888888` | `2723:2601` |
| Default | lg | empty | `#ffffff` | `#888888` | — | `2723:2585` |
| Hover | lg | filled | `#ffffff` | `#333333` | `#333333` | `2723:2589` |
| Hover | md | filled | `#ffffff` | `#333333` | `#333333` | `2723:2587` |
| Hover | sm | filled | `#ffffff` | `#333333` | `#333333` | `2723:2598` |
| Active / focus | lg | filled | `#ffffff` | `#0076ce` | `#333333` | `2723:2576` |
| Active / focus | md | filled | `#ffffff` | `#0076ce` | `#333333` | `2723:2573` |
| Active / focus | sm | filled | `#ffffff` | `#0076ce` | `#333333` | `2723:2572` |
| Disabled | lg | filled | `#f4f4f4` | `#888888` | `#777777` | `2723:2608` |
| Disabled | md | filled | `#f4f4f4` | `#888888` | `#777777` | `2723:2604` |
| Disabled | sm | filled | `#f4f4f4` | `#888888` | `#777777` | `2723:2602` |
| Error | sm | filled | `#ffffff` | `#af0000` | `#333333` | `2723:2579` |
| Error | md | filled | `#ffffff` | `#af0000` | `#333333` | `2723:2567` |

**Notes**
- `hover` border color is `#333333`.
- `active` / `focus` border color is `#0076ce` (`color/border/action`, `VariableID:2453:11`).
- `disabled` background is `#f4f4f4` and text is `#777777`.
- `error` border and icon fill are `#af0000`.

## States (Dark Theme)

Dark-mode values are **not present** in the packaged Figma evidence. The tokens listed above should be resolved against the PowerFlex dark theme palette (`components/powerflex-theme.css` under `html[data-design-system="powerflex"][data-theme="dark"]`) when the variables are synced. Until verified, implementations should use the inverse-contrast equivalents of the light tokens and expose the same state matrix.

## Interactions

### Designer follow-up (applied)

The follow-up from the Collab chat asked: **"Why text inputs are rendering as div?"**

In the packaged Figma evidence the editable content is represented by `value` and `placeholder` **TEXT** nodes. Those nodes must not be emitted as separate DOM `<div>` elements. The component's editable control is a native `<input type="text">`, and the Figma text content maps to the input's `value` and `placeholder` attributes/properties. The surrounding `text-box` wrapper is a `<div>` only for layout; the actual text input is the `<input>`.

### Behavior & guidelines

- **Default:** the field shows a `1px` `#888888` border and `#ffffff` background.
- **Hover:** border transitions to `#333333`.
- **Active / Focus:** border changes to `#0076ce` and the `focus-ring` outline (`1px` `#0076ce`) is rendered. The `focus-ring` in Figma is a `FRAME`; in code it must be a focus outline, not a sibling `div`.
- **Disabled:** the field uses `#f4f4f4` background, `#888888` border, and `#777777` text. The `<input>` must receive the `disabled` attribute; pointer and keyboard interaction are blocked.
- **Error:** the `input-row` border is `#af0000` and the `error-message` block is visible. The `<input>` must have `aria-invalid="true"` and reference the error message with `aria-describedby`.
- **Text input rendering:** the editable text area is a native `<input type="text">`. The `value` and `placeholder` Figma text layers are not separate DOM text nodes; they map to the `<input>` `value` and `placeholder` attributes.

### Accessibility

- Use a native `<input type="text">`.
- Associate a visible `<label>` or `aria-label`/`aria-labelledby`.
- On error, set `aria-invalid="true"` and `aria-describedby` pointing to `error-message`.
- Disabled state must block keyboard focus and set `disabled` (or `aria-disabled="true"`).
- Focus outline (`focus-ring`) must be visible and meet WCAG AA contrast.

## Composition & API (runtime)

### Variants

| Variant prop | Values | Notes |
|---|---|---|
| `size` | `sm`, `md`, `lg` | Maps to `min-height` `24px` / `32px` / `40px` |
| `state` | `default`, `hover`, `active`, `disabled`, `error` | `active` and `focus` share the same visual treatment |
| `contentState` | `empty`, `example`, `filled` | `example` shows placeholder text; `empty` has no value; `filled` has a value |

### Runtime API

```ts
interface TextBoxProps {
  size?: 'sm' | 'md' | 'lg';
  state?: 'default' | 'hover' | 'active' | 'disabled' | 'error';
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  errorMessage?: string;
  id?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  onChange?: (value: string) => void;
}
```

## Codegen Contract (Framework-Agnostic Blueprint)

### Deterministic structure

```html
<div class="text-box" data-size="md" data-state="default" data-content="filled">
  <div class="text-box__input-row">
    <input
      type="text"
      class="text-box__input"
      value="..."
      placeholder="..."
      aria-label="..."
    />
  </div>
  <div class="text-box__error-message" id="...-error">
    <span class="text-box__icon"><!-- status-critical-circ-solid --></span>
    <span class="text-box__error-text">Error message</span>
  </div>
</div>
```

- `text-box` is a `div`.
- `text-box__input` must be a native `<input type="text">`; the value/placeholder are `value` and `placeholder` attributes, not separate `div` text nodes.
- `text-box__error-message` is rendered only when `state="error"` and `errorMessage` is provided.
- `focus-ring` is not a DOM node; it is rendered as a CSS `:focus` outline on `text-box__input` or `text-box__input-row`.

### Variant matrix

| size | state | contentState | Host classes | Notes |
|---|---|---|---|---|
| sm | default | empty | `text-box text-box--sm text-box--default` | Placeholder shown, no value |
| sm | default | example | `text-box text-box--sm text-box--default` | Placeholder text shown |
| sm | default | filled | `text-box text-box--sm text-box--default` | Value shown |
| sm | hover | * | `text-box text-box--sm text-box--hover` | Border darkens to `#333333` |
| sm | active | * | `text-box text-box--sm text-box--active` | Border/action `#0076ce`, focus ring visible |
| sm | disabled | * | `text-box text-box--sm text-box--disabled` | `<input disabled>` |
| sm | error | * | `text-box text-box--sm text-box--error` | `aria-invalid="true"` |
| md | default | * | `text-box text-box--md text-box--default` | `min-height: 32px` |
| md | hover | * | `text-box text-box--md text-box--hover` | |
| md | active | * | `text-box text-box--md text-box--active` | |
| md | disabled | * | `text-box text-box--md text-box--disabled` | |
| md | error | * | `text-box text-box--md text-box--error` | |
| lg | default | * | `text-box text-box--lg text-box--default` | `min-height: 40px` |
| lg | hover | * | `text-box text-box--lg text-box--hover` | |
| lg | active | * | `text-box text-box--lg text-box--active` | |
| lg | disabled | * | `text-box text-box--lg text-box--disabled` | |

### Per-slot style contract

| Slot | HTML element | Required CSS | Bound variable (from evidence) |
|---|---|---|---|
| `text-box` | `<div>` | `display: block; width: 100%;` | — |
| `text-box__input-row` | `<div>` | `display: flex; align-items: center; min-height: <size>; padding: 0 8px; border: 1px solid <border-color>; border-radius: 5px;` | `VariableID:2454:2`, `VariableID:2454:3`, `VariableID:2521:3` |
| `text-box__input` | `<input type="text">` | `flex: 1; background: transparent; border: 0; padding: 0; font: var(--type-size-200) / var(--type-line-height-1100) Roboto; color: var(--color-text-primary);` | `VariableID:2453:14` (text), `VariableID:2453:8` (default border) |
| `text-box__input` placeholder | `<input>` pseudo | `color: #888888;` | — |
| `text-box__input:focus` | `<input>` pseudo | `outline: 1px solid #0076ce; outline-offset: 2px; border-color: #0076ce;` | `VariableID:2453:11`, `VariableID:2453:30` |
| `text-box__error-message` | `<div>` | `display: flex; gap: 8px; padding: 4px 0; color: #af0000;` | `VariableID:2521:3`, `VariableID:2521:6` |
| `text-box__icon` | `<span>` | `display: inline-flex; width: 16px; height: 16px; padding-top: 2px; color: #af0000;` | `VariableID:2521:5` |

### Behavior contract

- `value` updates on user input and reflects back in the `<input>` `value`.
- `placeholder` is shown when `value` is empty; it is the `placeholder` attribute of the `<input>`, not a `div`.
- `focus-ring` appears on `:focus` and on `active`/`focus` states; it must not be an absolutely positioned sibling `div`.
- `disabled` blocks all interaction and applies disabled visual tokens.
- `error` renders the `error-message` slot and sets `aria-invalid="true"`.

### Accessibility contract

- Native `<input type="text">` is required.
- The component must have an associated label (`<label for="id">` or `aria-label`/`aria-labelledby`).
- `error-message` must be referenced with `aria-describedby`.
- Focus ring must be visible and meet WCAG AA contrast.

### Asset resolution + bundling contract

- The `status-critical-circ-solid` icon (`2723:2399`) should be emitted via the design-system icon component. If unavailable, fallback to an inline SVG with `fill="#af0000"`.
- No raster images are required.

### Fallback/error rules

- If the `value` slot is absent, render an empty `<input>`.
- If `placeholder` is absent and `value` is empty, render an empty `<input>`.
- If `state="error"` but no `errorMessage` is provided, still apply error border but do not render the `error-message` block.
- If `focus-ring` geometry is missing from a Figma export, default to a `1px solid #0076ce` outline at `2px` offset; do not default radius to `0`.

### Validation checklist

- [ ] `text-box__input` is a native `<input type="text">`, not a `div`.
- [ ] `value` and `placeholder` are carried by the `<input>` attributes, not as separate DOM text nodes.
- [ ] `focus-ring` is rendered via CSS outline, not a sibling `div`.
- [ ] `min-height` matches sm `24px`, md `32px`, lg `40px`.
- [ ] Inline padding is `8px` left/right for all sizes.
- [ ] Border radius of the field is `5px`.
- [ ] Default border is `#888888`, hover `#333333`, active/focus `#0076ce`, disabled `#888888`, error `#af0000`.
- [ ] Disabled state uses `#f4f4f4` background and `#777777` text.
- [ ] Error state renders `error-message` with `#af0000` text and icon.
- [ ] `aria-invalid` and `aria-describedby` are set on the `<input>` in the error state.

## Source Mapping

| Source | File key / Node id | Purpose | Verification |
|---|---|---|---|
| PowerFlex MCP Design System | `82bDP05ESsiiGe38p5TEQJ` | File | Figma REST API |
| `text-input` component set | `2723:2611` | Main component | `get_design_context` / `slotGeometry` |
| Default filled lg | `2723:2610` | Default state | `slotGeometry` |
| Disabled filled lg | `2723:2608` | Disabled state | `slotGeometry` |
| Hover filled lg | `2723:2589` | Hover state | `slotGeometry` |
| Active filled lg | `2723:2576` | Active state | `slotGeometry` |
| Default empty lg | `2723:2585` | Empty state | `slotGeometry` |
| Active empty lg | `2723:2569` | Active empty | `slotGeometry` |
| Error filled sm | `2723:2579` | Error state sm | `slotGeometry` |
| Error filled md | `2723:2567` | Error state md | `slotGeometry` |
| `value` text lg | `2694:3711` | Value slot | `slotGeometry` |
| `placeholder` text lg | `2694:3741` | Placeholder slot | `slotGeometry` |
| `focus-ring` lg | `2694:3714` | Focus ring | `slotGeometry` |
| `input-row` | `2723:2533` | Error field row | `slotGeometry` |
| `error-message` | `2723:2398` | Error message block | `slotGeometry` |
| `icon-leading` | `2723:2403` | Error icon wrapper | `slotGeometry` |
| `status-critical-circ-solid` | `2723:2399` | Critical icon | `slotGeometry` |
| Screenshot | `2723:2611` | Visual reference | `get_screenshot` |
