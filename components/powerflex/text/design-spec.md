# Text Input Design Spec

## Metadata

- **Version:** 1.0.0
- **Description:** Powerflex single-line text input. Supports sizes (small, medium, large), content states (empty, example, filled), interaction states (default, hover, active, disabled), and an error state with an inline error message.
- **Status:** draft
- **Created:** 2026-07-28
- **Updated:** 2026-07-28
- **Design system:** powerflex
- **Programme display name:** Powerflex
- **Figma verification:** Figma REST API (get_metadata, get_design_context, get_variable_defs, slotGeometry)
- **Verification date:** 2026-07-28
- **Figma file key:** 82bDP05ESsiiGe38p5TEQJ
- **Figma node IDs:** Main component set `2723:2611`; variant nodes `2723:2610`, `2723:2608`, `2723:2605`, `2723:2604`, `2723:2598`, `2723:2576`, `2723:2573`, `2723:2572`, `2723:2579`, `2723:2567`, `2723:2403`, `2723:2399`, `2723:2537`, `2694:3714`…`2694:3877` (focus-ring frames); `2723:2533` (input-row), `2723:2398` (error-message).

## Anatomy

```
┌────────────────────────────────────────────────────────────┐
│ [value / placeholder text]                           │  ← Input row
└────────────────────────────────────────────────────────────┘
┌────────────────────────────────────────────────────────────┐
│ [!] Error message                                          │  ← Error message row (error state only)
└────────────────────────────────────────────────────────────┘
```

**Anatomy slots:**
- **Text input root (`text-input`)**: The component set wrapper and main container.
- **Input row (`input-row`)**: The background rectangle + border that contains the text value.
- **Focus ring (`focus-ring`)**: A separate 1px outline frame used for the active/focus state.
- **Value (`value`)**: The current input text.
- **Placeholder**: Shown when no value is present (Content state `empty`).
- **Error message (`error-message`)**: Row containing the leading status icon and error text (error state only).
- **Icon leading (`icon-leading`)**: Container for the status icon in the error message.
- **Status icon (`status-critical-circ-solid`)**: The critical status circle icon.

## Layout & Measurements

### Slot geometry (Figma-verified)

| Slot / layer | Property | Token / contract | Figma node | Live evidence |
|--------------|----------|------------------|------------|---------------|
| `text-input` (component set) | border-radius | `var(--text-input-radius, 5px)` | `2723:2611` | Figma REST `slotGeometry` `borderRadius: 5.0` |
| `text-input` | width × height (component set sample) | 1558px × 1057px (not a runtime size) | `2723:2611` | Figma REST `get_metadata` |
| `State=*, Content state=*, Size=lg` | height | `var(--text-input-height-lg, 40px)` | `2723:2610` … | Figma REST `slotGeometry` `height: 40.0` |
| `State=*, Content state=*, Size=md` | height | `var(--text-input-height-md, 32px)` | `2723:2605` … | Figma REST `slotGeometry` `height: 32.0` |
| `State=*, Content state=*, Size=sm` | height | `var(--text-input-height-sm, 24px)` | `2723:2598` … | Figma REST `slotGeometry` `height: 24.0` |
| `State=*, Content state=*` | padding-x | `var(--text-input-padding-x, 8px)` left/right | `2723:2610` | Figma REST `slotGeometry` `paddingLeft: 8.0` |
| `State=*, Content state=*` | item-spacing | `var(--text-input-gap, 16px)` | `2723:2610` | Figma REST `slotGeometry` `itemSpacing: 16.0` |
| `focus-ring` | size offset | 480px × 44px around lg variant (`+4px` around 476×40 input) | `2694:3714` | Figma REST `slotGeometry` |
| `focus-ring` | stroke | `var(--text-input-focus-ring, #0076ce)` | `2694:3714` | Figma REST `get_design_context` |
| `value` / `placeholder` | typography | `var(--font-size-body-2, 14px)` / `var(--font-line-height-line-height-20, 20px)` / weight 400 / Roboto | `2723:2610` content | Figma REST `get_design_context` |
| `input-row` (error state) | fill | `var(--text-input-background, #ffffff)` | `2723:2533` | Figma REST `get_design_context` |
| `input-row` (error state) | stroke | `var(--text-input-border-error, #af0000)` | `2723:2533` | Figma REST `get_design_context` |
| `error-message` | padding-y | `var(--text-input-error-padding-y, 4px)` top/bottom | `2723:2398` | Figma REST `slotGeometry` `paddingTop: 4.0` |
| `error-message` | item-spacing | `var(--text-input-error-gap, 8px)` | `2723:2398` | Figma REST `slotGeometry` `itemSpacing: 8.0` |
| `icon-leading` | size | 16px × 18px | `2723:2403` | Figma REST `slotGeometry` |
| `status-critical-circ-solid` | size | 16px × 16px | `2723:2399` | Figma REST `slotGeometry` |

### Container measurements

- **Input row width:** Runtime `width: 100%` (fills parent); sample Figma width 476px.
- **Heights by size:** Small 24px, Medium 32px, Large 40px.
- **Focus ring offset:** 2px on each side (input width + 4px, height + 4px).
- **Error message height:** 28px.

## Tokens

### Typography

- **Font family:** `var(--typography-font-style-primary, 'Roboto')`
- **Font size:** `var(--font-size-body-2, 14px)`
- **Font weight:** `400`
- **Line height:** `var(--font-line-height-line-height-20, 20px)`
- **Letter spacing:** `0`

### Colors

| Token | Light theme value | Usage |
|-------|-------------------|-------|
| `--text-input-radius` | `5px` | Component-level border radius from Figma `borderRadius: 5.0` |
| `--text-input-background` | `#ffffff` | Default, hover, active, error input background |
| `--text-input-background-disabled` | `#f4f4f4` | Disabled input background |
| `--text-input-border-default` | `#888888` | Default and disabled border |
| `--text-input-border-hover` | `#333333` | Hover border |
| `--text-input-border-active` | `#0076ce` | Active/focus border and focus ring |
| `--text-input-border-error` | `#af0000` | Error input border |
| `--text-input-text-value` | `#333333` | Filled / example / active value text |
| `--text-input-text-disabled` | `#777777` | Disabled value text |
| `--text-input-text-placeholder` | `#888888` | Empty-state placeholder text |
| `--text-input-text-error` | `#af0000` | Error message text |
| `--text-input-icon-error` | `#af0000` | Error status icon color |
| `--text-input-focus-ring` | `#0076ce` | Focus-ring outline stroke |

### Spacing

- `--text-input-padding-x`: 8px
- `--text-input-gap`: 16px (inside input row, used if leading icon is present)
- `--text-input-height-sm`: 24px
- `--text-input-height-md`: 32px
- `--text-input-height-lg`: 40px
- `--text-input-error-gap`: 8px
- `--text-input-error-padding-y`: 4px

## States (Light Theme)

| State | Background | Border | Text / Icon |
|-------|------------|--------|-------------|
| **default (filled)** | `var(--text-input-background, #ffffff)` | `var(--text-input-border-default, #888888)` | value `var(--text-input-text-value, #333333)` |
| **default (empty)** | `var(--text-input-background, #ffffff)` | `var(--text-input-border-default, #888888)` | placeholder `var(--text-input-text-placeholder, #888888)` |
| **hover** | `var(--text-input-background, #ffffff)` | `var(--text-input-border-hover, #333333)` | value `var(--text-input-text-value, #333333)` |
| **active** | `var(--text-input-background, #ffffff)` | `var(--text-input-border-active, #0076ce)` + focus ring `var(--text-input-focus-ring, #0076ce)` | value `var(--text-input-text-value, #333333)` |
| **disabled** | `var(--text-input-background-disabled, #f4f4f4)` | `var(--text-input-border-default, #888888)` | value `var(--text-input-text-disabled, #777777)` |
| **error** | `var(--text-input-background, #ffffff)` | `var(--text-input-border-error, #af0000)` | value `var(--text-input-text-value, #333333)`; error icon `var(--text-input-icon-error, #af0000)`; message `var(--text-input-text-error, #af0000)` |

## States (Dark Theme)

All Dark theme states use the same semantic `var(--...)` tokens as the Light theme. The token values themselves are resolved in `components/powerflex-theme.css` under `[data-theme="dark"]`. The structure is identical to the Light theme table above. Dark overrides for Powerflex text input have not yet been supplied by Figma; placeholder values are used until a dark-mode export is available.

## Interactions

### Accessibility

- **Keyboard navigation:**
  - `Tab` / `Shift+Tab`: Move focus to/from the input.
  - `focus-visible`: Triggers the active/focus visual state with the focus ring.
- **ARIA attributes:**
  - Input: `role="textbox"` (native `<input>` is preferred).
  - When invalid: `aria-invalid="true"` and `aria-describedby` pointing to the error message.
  - Error message: `role="alert"` or `aria-live="polite"`.
- **Focus management:**
  - Focus ring appears on `focus-visible` only.
  - Disabled inputs are not focusable and use `aria-disabled="true"` / `disabled` attribute.

### Behavior & guidelines

- **Typing:** Updates the `value` and removes the placeholder.
- **Placeholder:** Rendered only when `value` is empty and the content state is `empty`.
- **Hover:** Applied on `:hover` for non-disabled inputs.
- **Active/focus:** Applied while the input has focus; border switches to the active color and the focus ring is displayed.
- **Disabled:** Non-interactive; background changes to disabled and text color to disabled value.
- **Error:** The input border turns error red and the error message row is rendered below the input.
- **Sizes:** Fixed heights per `size` prop (sm / md / lg). Width is container-driven (`100%`).

## Composition & API (runtime)

### Variants

- **size:** `sm` | `md` | `lg` (default `md`)
- **state:** `default` | `hover` | `active` | `disabled` | `error`
- **contentState:** `empty` | `example` | `filled` (controls placeholder vs value display)

### Runtime API

```typescript
interface TextInputProps {
  /** Current value of the input */
  value?: string;
  /** Placeholder shown when value is empty */
  placeholder?: string;
  /** Visual size */
  size?: "sm" | "md" | "lg";
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Whether the input is in an error state */
  error?: boolean;
  /** Error message text (rendered when error is true) */
  errorMessage?: string;
  /** Callback on value change */
  onChange?: (value: string) => void;
  /** Optional accessible label (rendered separately from the input) */
  label?: string;
}
```

**Events:**
- `onChange`: Fired on every user input.
- `onFocus` / `onBlur`: Toggles active state.
- `onMouseEnter` / `onMouseLeave`: Toggles hover state.

**Spec Accurate Design story defaults:**
- `size`: `md`
- `value`: "Example value"
- `placeholder`: "Placeholder"
- `disabled`: false
- `error`: false

## Codegen Contract (Framework-Agnostic Blueprint)

### Deterministic structure

```
TextInput (root)
├── InputRow (border + background)
│   ├── Value (native input / text node)
│   └── Placeholder (text node, conditionally rendered)
├── FocusRing (outline, conditionally rendered on active/focus)
└── ErrorMessage (row, conditionally rendered on error)
    ├── IconLeading (status icon container)
    │   └── status-critical-circ-solid
    └── ErrorText
```

**Required DOM hierarchy:**
- Native `<input>` is preferred for the value; otherwise a `<span>`/`<div>` with `role="textbox"`.
- Do not nest interactive elements inside the input row.
- Error message must not be nested inside the `<input>` element.

### Variant matrix

| Prop | Values | Default | CSS class pattern |
|------|--------|---------|-------------------|
| size | `sm`, `md`, `lg` | `md` | `.text-input--{size}` |
| state | `default`, `hover`, `active`, `disabled`, `error` | `default` | `.text-input--{state}` |
| contentState | `empty`, `example`, `filled` | `empty` | `.text-input--{content-state}` |

### Per-slot style contract

**Text input root:**
- `display: flex; flex-direction: column;`
- `width: 100%;` (fills container)
- `box-sizing: border-box;`

**InputRow:**
- `display: flex; align-items: center;`
- `height: var(--text-input-height-{size}, 32px);`
- `padding: 0 var(--text-input-padding-x, 8px);`
- `border: 1px solid var(--text-input-border-{state}, #888888);`
- `border-radius: var(--text-input-radius, 5px);`
- `background-color: var(--text-input-background-{disabled}, #ffffff);`
- `cursor: text` (default/hover/active/error); `not-allowed` (disabled).

**FocusRing:**
- Absolute/fixed overlay or CSS `outline` / `box-shadow`.
- `border: 1px solid var(--text-input-focus-ring, #0076ce);`
- `border-radius: var(--text-input-radius, 5px);`
- Offset `2px` outside the input row on all sides.
- Rendered only for `active`/`focus-visible`.

**Value / Placeholder:**
- `font-family: var(--typography-font-style-primary, 'Roboto');`
- `font-size: var(--font-size-body-2, 14px);`
- `line-height: var(--font-line-height-line-height-20, 20px);`
- `font-weight: 400;`
- `color: var(--text-input-text-value, #333333)` (value)
- `color: var(--text-input-text-placeholder, #888888)` (placeholder)
- `color: var(--text-input-text-disabled, #777777)` (value when disabled)

**ErrorMessage:**
- `display: flex; align-items: center; gap: var(--text-input-error-gap, 8px);`
- `padding: var(--text-input-error-padding-y, 4px) 0;`
- `color: var(--text-input-text-error, #af0000);`
- `font-size: var(--font-size-body-2, 14px);`

**IconLeading / Status icon:**
- `width: 16px; height: 16px;`
- `fill: var(--text-input-icon-error, #af0000);`

### Behavior contract

- `value` controls the value text; `placeholder` is shown when `value` is empty.
- `disabled` suppresses focus, input, hover, and active states.
- `error` takes precedence over hover/active border color.
- `onChange` updates `value`.
- Focus ring only appears for `active`/`focus-visible`.

### Accessibility contract

- `<input>` is the primary element with `type="text"`.
- `aria-invalid="true"` and `aria-describedby` to the error message when `error` is true.
- Error message uses `role="alert"`.
- Disabled state uses the HTML `disabled` attribute.

### Asset resolution + bundling contract

- The error status icon is the `status-critical-circ-solid` vector asset from the Figma file (`2723:2399`).
- Inline SVG is preferred; path data may be copied from the Figma `vector` node or loaded from the design system icon library.
- Roboto is inherited from `components/powerflex-theme.css`.

### Fallback/error rules

- Unknown `size`: default to `md`.
- Unknown `state`: default to `default`.
- Missing `value` and `placeholder`: render an empty input.
- Missing error message: render the icon only with no text.
- Missing tokens: use the documented `#hex` fallbacks.

### Validation checklist

- [ ] Slot geometry matches Figma nodes `2723:2611` and size variants.
- [ ] Heights are 24px / 32px / 40px for sm / md / lg.
- [ ] Horizontal padding is `8px`.
- [ ] Border colors by state: default `#888888`, hover `#333333`, active `#0076ce`, disabled `#888888`, error `#af0000`.
- [ ] Background `#ffffff` (default/hover/active/error) and `#f4f4f4` (disabled).
- [ ] Value text `#333333`, placeholder `#888888`, disabled value `#777777`.
- [ ] Focus ring is `#0076ce` and offset `2px` outside the input row.
- [ ] Error message uses `#af0000` text and icon.
- [ ] ARIA `aria-invalid` and `aria-describedby` wired for error state.

## Source Mapping

| Source | File key / node id | Verification method |
|--------|-------------------|---------------------|
| Main component set | `82bDP05ESsiiGe38p5TEQJ` / `2723:2611` | Figma REST `get_metadata` + `slotGeometry` |
| Size/state variants | `82bDP05ESsiiGe38p5TEQJ` / `2723:2610`, `2723:2605`, `2723:2598`, `2723:2576`, `2723:2573`, `2723:2572`, `2723:2579`, `2723:2567` … | Figma REST `slotGeometry` + `get_design_context` |
| Focus ring frames | `82bDP05ESsiiGe38p5TEQJ` / `2694:3714`…`2694:3877` | Figma REST `slotGeometry` |
| Input row (error) | `82bDP05ESsiiGe38p5TEQJ` / `2723:2533` | Figma REST `slotGeometry` |
| Error message | `82bDP05ESsiiGe38p5TEQJ` / `2723:2398` | Figma REST `slotGeometry` |
| Error icon | `82bDP05ESsiiGe38p5TEQJ` / `2723:2399` | Figma REST `slotGeometry` |
| Disabled background variable | `VariableID:2694:2477` (`color/background/disabled`) | Figma REST `get_variable_defs` + `slotGeometry` `boundVariableHints` |
