# Toggle

## Metadata

| Property | Value |
|---|---|
| Component | Toggle |
| Slug | `toggle` |
| Programme | Powerflex |
| Status | `draft` |
| Spec pattern | `standalone` |
| Theme CSS | `components/powerflex-theme.css` |
| Version | 1.0.0 |
| Created | 2026-08-05 |
| Updated | 2026-08-05 |
| Figma verification | File key `82bDP05ESsiiGe38p5TEQJ`, component set node `2754:109`, method `Figma REST API`, session `2026-08-05` |

## Anatomy

The Toggle is a binary switch control.

1. **Toggle** — root component wrapper.
2. **Track** — pill-shaped container that provides the on/off background.
3. **Thumb** — circular indicator that translates horizontally to indicate the checked state.
4. **Focus ring** — visible focus indicator surrounding the track.
5. **Input** — native checkbox or switch input (not rendered by Figma; required for accessibility and form submission).
6. **Label** — optional text rendered adjacent to the control (programme-level; not present in the packaged Figma component set).

## Layout & Measurements

### Control sizes

| Size | Control width | Control height | Track | Thumb | Focus ring | Sample Figma component |
|---|---|---|---|---|---|---|
| `sm` | `32px` | `16px` | `32px x 16px` | `12px x 12px` | `38px x 22px` | `State=default, Checked=on, Size=sm` (`2754:13`) |
| `md` | `44px` | `24px` | `44px x 24px` | `20px x 20px` | `50px x 30px` | `State=default, Checked=on, Size=md` (`2754:45`) |
| `lg` | `52px` | `28px` | `52px x 28px` | `24px x 24px` | `58px x 34px` | `State=default, Checked=on, Size=lg` (`2754:77`) |

*The `md` component bounding box in Figma is `313px x 24px`; the visible switch control itself is `44px x 24px`. The remaining width is the label area used in the Figma layout catalogue.*

### Thumb translation

| Size | Checked `on` thumb inset | Checked `off` thumb inset |
|---|---|---|
| `sm` | `2px` from left | `2px` from right |
| `md` | `2px` from left | `2px` from right |
| `lg` | `2px` from left | `2px` from right |

Translation is animated with a `200ms` ease transition when `prefers-reduced-motion` is not set.

### Slot geometry (Figma-verified)

All track, thumb, and focus-ring slots have a measured `borderRadius` of `9999.0px` in the packaged evidence and are bound to the same radius variable hints across `sm`, `md`, and `lg`. The packaged `get_variable_defs` did not resolve the bound library variable IDs; the IDs are recorded below as captured evidence.

| Slot / layer | Property | Token / contract | Figma node | Live evidence |
|---|---|---|---|---|
| Track | `border-radius` | `var(--toggle-control-radius)` (pill) | `2754:46` | Figma REST API; `boundVariableHints`: `VariableID:2453:26` |
| Track | `border-radius` | `var(--toggle-control-radius)` (pill) | `2754:62` (off `md`) | Figma REST API; `boundVariableHints`: `VariableID:2453:8` |
| Track | `border-radius` | `var(--toggle-control-radius)` (pill) | `2754:78` (`lg` on) | Figma REST API; `boundVariableHints`: `VariableID:2453:26` |
| Track | `border-radius` | `var(--toggle-control-radius)` (pill) | `2754:14` (`sm` on) | Figma REST API; `boundVariableHints`: `VariableID:2453:26` |
| Thumb | `border-radius` | `var(--toggle-thumb-radius)` (circle) | `2754:47` | Figma REST API; `boundVariableHints`: `VariableID:2453:4` |
| Thumb | `border-radius` | `var(--toggle-thumb-radius)` (circle) | `2754:79` (`lg`) | Figma REST API; `boundVariableHints`: `VariableID:2453:4` |
| Thumb | `border-radius` | `var(--toggle-thumb-radius)` (circle) | `2754:15` (`sm`) | Figma REST API; `boundVariableHints`: `VariableID:2453:4` |
| Focus ring | `border-radius` | `var(--toggle-focus-ring-radius)` (pill) | `2754:48` | Figma REST API; `boundVariableHints`: `VariableID:2453:30` |
| Focus ring | `border-radius` | `var(--toggle-focus-ring-radius)` (pill) | `2754:80` (`lg`) | Figma REST API; `boundVariableHints`: `VariableID:2453:30` |
| Focus ring | `border-radius` | `var(--toggle-focus-ring-radius)` (pill) | `2754:16` (`sm`) | Figma REST API; `boundVariableHints`: `VariableID:2453:30` |

*The component set frame (`2754:109`) has `cornerRadius=5.0px` and is used only as the Figma catalogue container; it is not rendered as a control surface.*

## Tokens

### Colors

| Token | Light value | Dark value | Use |
|---|---|---|---|
| `--color-background-controls-brand-base` | `#0672cb` | `#0672cb` | Track `on` default |
| `--color-background-controls-brand-strong` | `#055fa9` | `#055fa9` | Track `on` hover |
| `--color-background-controls-brand-stronger` | `#044b86` | `#044b86` | Track `on` active |
| `--color-background-controls-brand-lighter` | `#ebf4fb` | `#022541` | Track `on` disabled (light theme fallback) |
| `--color-background-gray-light` | `#eaeaea` | `#393939` | Track `off` default |
| `--color-background-gray-base` | `#757575` | `#9e9e9e` | Track `off` hover |
| `--color-background-gray-strong` | `#616161` | `#ffffff` | Track `off` active |
| `--color-background-gray-lighter` | `#f4f4f4` | `#393939` | Track `off` disabled |
| `--color-background-white` | `#ffffff` | `#ffffff` | Thumb |
| `--color-border-brand-base` | `#0672cb` | `#509cda` | Focus ring |
| `--color-border-transparent-brand` | `rgba(255,255,255,0.00)` | `#509cda` | Focus ring when not visible |
| `--color-icon-disabled` | `#757575` | `#9e9e9e` | Disabled thumb tint (if applied) |

### Layout

| Token | Value | Use |
|---|---|---|
| `--toggle-control-radius` | `var(--corner-radius-radius-round, 999999px)` | Track and focus ring pill radius |
| `--toggle-thumb-radius` | `var(--corner-radius-radius-round, 999999px)` | Thumb circle radius |
| `--toggle-focus-ring-radius` | `var(--corner-radius-radius-round, 999999px)` | Focus ring pill radius |
| `--border-width-border-1` | `1px` | Focus ring stroke weight |

## States (Light Theme)

| State | Checked | Track background | Thumb background | Focus ring border |
|---|---|---|---|---|
| `default` | `on` | `var(--color-background-controls-brand-base)` | `var(--color-background-white)` | `transparent` |
| `hover` | `on` | `var(--color-background-controls-brand-strong)` | `var(--color-background-white)` | `transparent` |
| `active` / `press` | `on` | `var(--color-background-controls-brand-stronger)` | `var(--color-background-white)` | `transparent` |
| `focus-visible` | `on` | same as `default` | `var(--color-background-white)` | `var(--color-border-brand-base)` |
| `disabled` | `on` | `var(--color-background-controls-brand-lighter)` | `var(--color-background-white)` | `transparent` |
| `default` | `off` | `var(--color-background-gray-light)` | `var(--color-background-white)` | `transparent` |
| `hover` | `off` | `var(--color-background-gray-base)` | `var(--color-background-white)` | `transparent` |
| `active` / `press` | `off` | `var(--color-background-gray-strong)` | `var(--color-background-white)` | `transparent` |
| `focus-visible` | `off` | same as `default` | `var(--color-background-white)` | `var(--color-border-brand-base)` |
| `disabled` | `off` | `var(--color-background-gray-lighter)` | `var(--color-background-white)` | `transparent` |

## States (Dark Theme)

The dark theme uses the same semantic token contracts; values resolve through the `powerflex-theme.css` dark selector. The matrix below is structurally parallel to the light theme.

| State | Checked | Track background | Thumb background | Focus ring border |
|---|---|---|---|---|
| `default` | `on` | `var(--color-background-controls-brand-base)` | `var(--color-background-white)` | `transparent` |
| `hover` | `on` | `var(--color-background-controls-brand-strong)` | `var(--color-background-white)` | `transparent` |
| `active` / `press` | `on` | `var(--color-background-controls-brand-stronger)` | `var(--color-background-white)` | `transparent` |
| `focus-visible` | `on` | same as `default` | `var(--color-background-white)` | `var(--color-border-brand-base)` |
| `disabled` | `on` | `var(--color-background-controls-brand-lighter)` | `var(--color-background-white)` | `transparent` |
| `default` | `off` | `var(--color-background-gray-light)` | `var(--color-background-white)` | `transparent` |
| `hover` | `off` | `var(--color-background-gray-base)` | `var(--color-background-white)` | `transparent` |
| `active` / `press` | `off` | `var(--color-background-gray-strong)` | `var(--color-background-white)` | `transparent` |
| `focus-visible` | `off` | same as `default` | `var(--color-background-white)` | `var(--color-border-brand-base)` |
| `disabled` | `off` | `var(--color-background-gray-lighter)` | `var(--color-background-white)` | `transparent` |

## Interactions

### Behavior & guidelines

- Clicking the track, thumb, or label toggles the checked state.
- The thumb animates horizontally between the `on` and `off` positions.
- Disabled Toggles do not respond to pointer, keyboard, or form events.
- Programmes may optionally display on/off text labels inside or beside the track; this spec covers the no-label variant.

### Accessibility

- Use a native `<input type="checkbox">` (visually hidden) or `role="switch"` with `aria-checked`.
- Provide an associated `<label>` using `htmlFor` / `id`.
- Keyboard: `Tab` moves focus; `Space` toggles state; `Enter` may also toggle if the control is a button.
- Focus-visible must show the focus ring with `var(--color-border-brand-base)`.
- Disabled state sets `aria-disabled="true"` or `disabled` on the input.

## Composition & API (runtime)

### Variants

| Variant | Options | Default |
|---|---|---|
| `size` | `sm`, `md`, `lg` | `md` |
| `checked` / `defaultChecked` | `true`, `false` | `false` |
| `disabled` | `true`, `false` | `false` |

### Runtime API

```ts
interface ToggleProps {
  /** Controlled checked state. */
  checked?: boolean;
  /** Uncontrolled default checked state. */
  defaultChecked?: boolean;
  /** Disable interaction. */
  disabled?: boolean;
  /** Visual size. */
  size?: 'sm' | 'md' | 'lg';
  /** Change callback. */
  onChange?: (checked: boolean) => void;
  /** Accessible label. */
  label?: string;
  /** Input id; auto-generated if omitted. */
  id?: string;
  /** Form name. */
  name?: string;
  /** Form value when checked. */
  value?: string;
  /** Required for form validation. */
  required?: boolean;
}
```

## Codegen Contract (Framework-Agnostic Blueprint)

### Deterministic structure

```
<Toggle>
  <input type="checkbox" role="switch" />
  <Track>
    <Thumb />
  </Track>
  <FocusRing />
  {label && <Label>{label}</Label>}
</Toggle>
```

- `Track` and `Thumb` are styled `<span>`/`<div>` elements.
- `FocusRing` is a separate element rendered behind or around `Track`; it is shown only on `:focus-visible`.
- The native input remains keyboard-focusable and clickable.

### Variant matrix

| Size | Checked | State | Track background | Thumb position | Focus ring |
|---|---|---|---|---|---|
| `sm` | `on` | `default` | controls-brand-base | left inset | hidden |
| `sm` | `on` | `hover` | controls-brand-strong | left inset | hidden |
| `sm` | `on` | `active` | controls-brand-stronger | left inset | hidden |
| `sm` | `on` | `disabled` | controls-brand-lighter | left inset | hidden |
| `sm` | `off` | `default` | gray-light | right inset | hidden |
| `sm` | `off` | `hover` | gray-base | right inset | hidden |
| `sm` | `off` | `active` | gray-strong | right inset | hidden |
| `sm` | `off` | `disabled` | gray-lighter | right inset | hidden |
| `md` | `on`/`off` | all | same as `sm` | same as `sm` | hidden |
| `lg` | `on`/`off` | all | same as `sm`/`md` | same as `sm`/`md` | hidden |
| any | any | `focus-visible` | same as `default` | same as `default` | border-brand-base |

### Per-slot style contract

| Slot | Property | Value |
|---|---|---|
| Root | `display` | `inline-flex` |
| Root | `align-items` | `center` |
| Track | `width` / `height` | per size table |
| Track | `border-radius` | `var(--toggle-control-radius)` |
| Track | `transition` | `background-color 150ms ease` |
| Thumb | `width` / `height` | per size table |
| Thumb | `border-radius` | `var(--toggle-thumb-radius)` |
| Thumb | `background-color` | `var(--color-background-white)` |
| Thumb | `transition` | `transform 200ms ease` |
| Focus ring | `width` / `height` | per size table |
| Focus ring | `border-radius` | `var(--toggle-focus-ring-radius)` |
| Focus ring | `border` | `var(--border-width-border-1) solid var(--color-border-brand-base)` |
| Focus ring | `opacity` | `0` normally; `1` on `:focus-visible` |

### Behavior contract

- Toggle changes `checked` state on click, tap, `Space`, or `Enter`.
- Support controlled (`checked` + `onChange`) and uncontrolled (`defaultChecked`) modes.
- `disabled` prevents state changes and removes pointer events.
- Respect `prefers-reduced-motion` by disabling the thumb translation animation.

### Accessibility contract

- `role="switch"` or `<input type="checkbox">`.
- `aria-checked` reflects the checked state.
- `aria-disabled` or `disabled` attribute when disabled.
- Label must be programmatically associated.
- Focus ring must be visible on keyboard focus and meet minimum 3:1 contrast against the track.

### Asset resolution + bundling contract

- No icons or images are required for the base Toggle.
- Optional on/off text labels use the inherited body type style; no additional assets.

### Fallback/error rules

- Unknown `size` → render `md`.
- Missing `checked`/`defaultChecked` → render `off` (`checked=false`).
- Unknown `state` → render `default`.
- If theme tokens are missing, render the control with default browser/UA styling rather than failing to render.

### Validation checklist

- [ ] `border-radius` values use `var(--toggle-control-radius)`, `var(--toggle-thumb-radius)`, and `var(--toggle-focus-ring-radius)`.
- [ ] Track and thumb sizes match the `sm`/`md`/`lg` table for at least one representative variant.
- [ ] All state rows have distinct track backgrounds for `default`, `hover`, `active`, and `disabled`.
- [ ] Thumb remains `var(--color-background-white)` across all states.
- [ ] Focus ring is visible only on `:focus-visible`.
- [ ] Disabled Toggle is not interactive and uses disabled tokens.
- [ ] Component is keyboard operable.
- [ ] Light and dark state matrices are structurally parallel.

## Source Mapping

| Source | Value |
|---|---|
| Figma file key | `82bDP05ESsiiGe38p5TEQJ` |
| Figma component set | `2754:109` (`toggle`) |
| Figma URL | `https://www.figma.com/design/82bDP05ESsiiGe38p5TEQJ/toggle?node-id=2754%3A109` |
| Verification method | `Figma REST API` (server-packaged evidence) |
| Session date | `2026-08-05` |
| Representative nodes | Track `2754:46`, Thumb `2754:47`, Focus ring `2754:48` (md on default) |
| Bound variable hints | `VariableID:2453:26` (track), `VariableID:2453:4` (thumb), `VariableID:2453:30` (focus ring) |
