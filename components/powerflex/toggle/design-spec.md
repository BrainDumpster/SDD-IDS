# PowerFlex — Toggle

A standalone PowerFlex toggle switch. It uses a pill-shaped track and a circular thumb, with an outer focus ring for keyboard navigation. The packaged Figma evidence contains the `State=default, Checked=on, Size=md` variant (`2754:45`); all other states are derived from the same PowerFlex token contract used by the PowerFlex Text Box.

## Metadata

| Property | Value |
|---|---|
| Component | Toggle |
| Programme | PowerFlex |
| Spec pattern | standalone |
| Figma file key | `82bDP05ESsiiGe38p5TEQJ` |
| Main component node | `2754:45` — `State=default, Checked=on, Size=md` |
| Verification | Figma REST API (`get_metadata`, `get_design_context`, `get_variable_defs`, `get_screenshot`) |
| Evidence date | 2026-08-04 |
| Status | draft |

## Anatomy

- **Toggle (root)** — the component wrapper, including the switch and an optional text label.
- **track** (`FRAME`, `2754:46`) — the pill-shaped background rail.
- **thumb** (`FRAME`, `2754:47`) — the circular knob that slides left/right.
- **focus-ring** (`FRAME`, `2754:48`) — the focus indicator rendered around the track.
- **label** (text slot, not captured in packaged evidence) — the component width of `313 px` implies a label to the right of the `44 px` track. Implementations should expose a `label` prop and associate it with the switch using `aria-labelledby`.

## Layout & Measurements

| Slot | Type | Width | Height | Border-radius |
|---|---|---|---|---|
| Toggle (root) | `COMPONENT` | `313 px` | `24 px` | — |
| track | `FRAME` | `44 px` | `24 px` | `9999 px` (pill) |
| thumb | `FRAME` | `20 px` | `20 px` | `9999 px` (circle) |
| focus-ring | `FRAME` | `50 px` | `30 px` | `9999 px` (pill) |

The thumb sits `2 px` from the track edges (vertical) and travels from a `2 px` left inset in the `off` position to `track width - thumb size - inset = 22 px` in the `on` position. The focus ring is centered on the track with a `3 px` horizontal/vertical offset (`(50 - 44) / 2`, `(30 - 24) / 2`).

### Slot geometry (Figma-verified)

| Slot / layer | Property | Figma value | Token / contract | Figma node | Live evidence |
|---|---|---|---|---|---|
| track | `border-radius` | `9999 px` (pill) | `var(--toggle-track-radius)` | `2754:46` | `cornerRadius=9999.0`; `boundVariableHints`: `VariableID:2453:26` (name not returned by packaged `get_variable_defs`) |
| thumb | `border-radius` | `9999 px` (circle) | `var(--toggle-thumb-radius)` | `2754:47` | `cornerRadius=9999.0`; `boundVariableHints`: `VariableID:2453:4` (`color/background/surface`) |
| focus-ring | `border-radius` | `9999 px` (pill) | `var(--toggle-focus-ring-radius)` | `2754:48` | `cornerRadius=9999.0`; `boundVariableHints`: `VariableID:2453:30` (name not returned by packaged `get_variable_defs`) |

## Tokens

All toggle tokens are scoped under `[data-design-system="powerflex"]` in `components/powerflex-theme.css`.

### Colors

| Token | Light | Dark |
|---|---|---|
| `--toggle-track-background-unchecked` | `#888888` | `#8898a5` |
| `--toggle-track-background-unchecked-hover` | `#333333` | `#e6e9ec` |
| `--toggle-track-background-checked` | `#0076ce` | `#509cda` |
| `--toggle-track-background-checked-hover` | `#005fa3` | `#3a7ab0` |
| `--toggle-track-background-disabled` | `#f4f4f4` | `#1e262c` |
| `--toggle-thumb-background` | `#ffffff` | `#ffffff` |
| `--toggle-thumb-background-disabled` | `#777777` | `#c5c5c5` |
| `--toggle-focus-ring-color` | `#0076ce` | `#509cda` |
| `--toggle-text` | `#333333` | `#e6e9ec` |
| `--toggle-text-disabled` | `#777777` | `#c5c5c5` |
| `--toggle-focus-ring-background` | `transparent` | `transparent` |
| `--toggle-label-background` | `transparent` | `transparent` |

The checked track (`#0076ce` / `#509cda`), thumb (`#ffffff`), and focus ring stroke (`#0076ce` / `#509cda`) values are taken directly from the packaged Figma evidence for node `2754:45`.

### Spacing & sizing

| Token | Value | Notes |
|---|---|---|
| `--toggle-track-width` | `44px` | Figma-verified (`2754:46`) |
| `--toggle-track-height` | `24px` | Figma-verified (`2754:46`) |
| `--toggle-thumb-size` | `20px` | Figma-verified (`2754:47`) |
| `--toggle-focus-ring-width` | `50px` | Figma-verified (`2754:48`) |
| `--toggle-focus-ring-height` | `30px` | Figma-verified (`2754:48`) |
| `--toggle-focus-ring-offset` | `3px` | `(focus-ring - track) / 2` |
| `--toggle-switch-inset` | `2px` | `(track - thumb) / 2`; matches `toggleButtons/toggleButtonSwitchInset` from `get_variable_defs` |

### Shape

| Token | Value |
|---|---|
| `--toggle-track-radius` | `9999px` |
| `--toggle-thumb-radius` | `9999px` |
| `--toggle-focus-ring-radius` | `9999px` |
| `--toggle-track-border` | `0px solid transparent` |
| `--toggle-thumb-border` | `0px solid transparent` |
| `--toggle-focus-ring-border-width` | `1px` |
| `--toggle-focus-ring-border` | `1px solid var(--toggle-focus-ring-color)` |

### Motion

| Token | Value |
|---|---|
| `--toggle-transition-duration` | `200ms` |
| `--toggle-transition-easing` | `ease` |

### Typography

No text nodes were captured in the packaged evidence. The optional label should use the inherited PowerFlex body/label type stack and is colored with `--toggle-text` / `--toggle-text-disabled`.

## States (Light Theme)

| State | Slot | Background | Border | Text/Icon |
|---|---|---|---|---|
| Default On | Track | `var(--toggle-track-background-checked)` | `var(--toggle-track-border)` | — |
| Default On | Thumb | `var(--toggle-thumb-background)` | `var(--toggle-thumb-border)` | — |
| Default On | Focus ring | `var(--toggle-focus-ring-background)` | — | — |
| Default On | Label | `var(--toggle-label-background)` | — | `var(--toggle-text)` |
| Default Off | Track | `var(--toggle-track-background-unchecked)` | `var(--toggle-track-border)` | — |
| Default Off | Thumb | `var(--toggle-thumb-background)` | `var(--toggle-thumb-border)` | — |
| Default Off | Focus ring | `var(--toggle-focus-ring-background)` | — | — |
| Default Off | Label | `var(--toggle-label-background)` | — | `var(--toggle-text)` |
| Hover On | Track | `var(--toggle-track-background-checked-hover)` | `var(--toggle-track-border)` | — |
| Hover On | Thumb | `var(--toggle-thumb-background)` | `var(--toggle-thumb-border)` | — |
| Hover On | Focus ring | `var(--toggle-focus-ring-background)` | — | — |
| Hover On | Label | `var(--toggle-label-background)` | — | `var(--toggle-text)` |
| Hover Off | Track | `var(--toggle-track-background-unchecked-hover)` | `var(--toggle-track-border)` | — |
| Hover Off | Thumb | `var(--toggle-thumb-background)` | `var(--toggle-thumb-border)` | — |
| Hover Off | Focus ring | `var(--toggle-focus-ring-background)` | — | — |
| Hover Off | Label | `var(--toggle-label-background)` | — | `var(--toggle-text)` |
| Focus (On) | Track | `var(--toggle-track-background-checked)` | `var(--toggle-track-border)` | — |
| Focus (On) | Thumb | `var(--toggle-thumb-background)` | `var(--toggle-thumb-border)` | — |
| Focus (On) | Focus ring | `var(--toggle-focus-ring-background)` | `var(--toggle-focus-ring-border)` | — |
| Focus (On) | Label | `var(--toggle-label-background)` | — | `var(--toggle-text)` |
| Focus (Off) | Track | `var(--toggle-track-background-unchecked)` | `var(--toggle-track-border)` | — |
| Focus (Off) | Thumb | `var(--toggle-thumb-background)` | `var(--toggle-thumb-border)` | — |
| Focus (Off) | Focus ring | `var(--toggle-focus-ring-background)` | `var(--toggle-focus-ring-border)` | — |
| Focus (Off) | Label | `var(--toggle-label-background)` | — | `var(--toggle-text)` |
| Disabled On | Track | `var(--toggle-track-background-disabled)` | `var(--toggle-track-border)` | — |
| Disabled On | Thumb | `var(--toggle-thumb-background-disabled)` | `var(--toggle-thumb-border)` | — |
| Disabled On | Focus ring | `var(--toggle-focus-ring-background)` | — | — |
| Disabled On | Label | `var(--toggle-label-background)` | — | `var(--toggle-text-disabled)` |
| Disabled Off | Track | `var(--toggle-track-background-disabled)` | `var(--toggle-track-border)` | — |
| Disabled Off | Thumb | `var(--toggle-thumb-background-disabled)` | `var(--toggle-thumb-border)` | — |
| Disabled Off | Focus ring | `var(--toggle-focus-ring-background)` | — | — |
| Disabled Off | Label | `var(--toggle-label-background)` | — | `var(--toggle-text-disabled)` |

## States (Dark Theme)

| State | Slot | Background | Border | Text/Icon |
|---|---|---|---|---|
| Default On | Track | `var(--toggle-track-background-checked)` | `var(--toggle-track-border)` | — |
| Default On | Thumb | `var(--toggle-thumb-background)` | `var(--toggle-thumb-border)` | — |
| Default On | Focus ring | `var(--toggle-focus-ring-background)` | — | — |
| Default On | Label | `var(--toggle-label-background)` | — | `var(--toggle-text)` |
| Default Off | Track | `var(--toggle-track-background-unchecked)` | `var(--toggle-track-border)` | — |
| Default Off | Thumb | `var(--toggle-thumb-background)` | `var(--toggle-thumb-border)` | — |
| Default Off | Focus ring | `var(--toggle-focus-ring-background)` | — | — |
| Default Off | Label | `var(--toggle-label-background)` | — | `var(--toggle-text)` |
| Hover On | Track | `var(--toggle-track-background-checked-hover)` | `var(--toggle-track-border)` | — |
| Hover On | Thumb | `var(--toggle-thumb-background)` | `var(--toggle-thumb-border)` | — |
| Hover On | Focus ring | `var(--toggle-focus-ring-background)` | — | — |
| Hover On | Label | `var(--toggle-label-background)` | — | `var(--toggle-text)` |
| Hover Off | Track | `var(--toggle-track-background-unchecked-hover)` | `var(--toggle-track-border)` | — |
| Hover Off | Thumb | `var(--toggle-thumb-background)` | `var(--toggle-thumb-border)` | — |
| Hover Off | Focus ring | `var(--toggle-focus-ring-background)` | — | — |
| Hover Off | Label | `var(--toggle-label-background)` | — | `var(--toggle-text)` |
| Focus (On) | Track | `var(--toggle-track-background-checked)` | `var(--toggle-track-border)` | — |
| Focus (On) | Thumb | `var(--toggle-thumb-background)` | `var(--toggle-thumb-border)` | — |
| Focus (On) | Focus ring | `var(--toggle-focus-ring-background)` | `var(--toggle-focus-ring-border)` | — |
| Focus (On) | Label | `var(--toggle-label-background)` | — | `var(--toggle-text)` |
| Focus (Off) | Track | `var(--toggle-track-background-unchecked)` | `var(--toggle-track-border)` | — |
| Focus (Off) | Thumb | `var(--toggle-thumb-background)` | `var(--toggle-thumb-border)` | — |
| Focus (Off) | Focus ring | `var(--toggle-focus-ring-background)` | `var(--toggle-focus-ring-border)` | — |
| Focus (Off) | Label | `var(--toggle-label-background)` | — | `var(--toggle-text)` |
| Disabled On | Track | `var(--toggle-track-background-disabled)` | `var(--toggle-track-border)` | — |
| Disabled On | Thumb | `var(--toggle-thumb-background-disabled)` | `var(--toggle-thumb-border)` | — |
| Disabled On | Focus ring | `var(--toggle-focus-ring-background)` | — | — |
| Disabled On | Label | `var(--toggle-label-background)` | — | `var(--toggle-text-disabled)` |
| Disabled Off | Track | `var(--toggle-track-background-disabled)` | `var(--toggle-track-border)` | — |
| Disabled Off | Thumb | `var(--toggle-thumb-background-disabled)` | `var(--toggle-thumb-border)` | — |
| Disabled Off | Focus ring | `var(--toggle-focus-ring-background)` | — | — |
| Disabled Off | Label | `var(--toggle-label-background)` | — | `var(--toggle-text-disabled)` |

## Interactions

### Accessibility

- Use `role="switch"` (or a native checkbox with `type="checkbox"`) and set `aria-checked` to `"true"` / `"false"`.
- The visible label must be linked to the switch via `aria-labelledby` or wrapped in a `<label>`.
- The focus ring is visible only on keyboard focus (`:focus-visible`) to avoid showing it on mouse interactions.
- When `disabled` is true, set `aria-disabled="true"` (or the native `disabled` attribute) and ignore activation events.
- The checked track (`#0076ce` light / `#509cda` dark) against the white thumb exceeds a 4.5:1 contrast ratio.

### Behavior & guidelines

- Activation (click, tap, or `Space` on a focused switch) toggles the `checked` state immediately.
- The thumb should transition between the `off` and `on` positions using `transform: translateX(...)` (or `left` with `var(--toggle-transition-duration)`) to keep animation compositor-only.
- The track background and focus ring color are independent of the label; use the PowerFlex text tokens only for the label.
- Disabled states remove pointer events and use the disabled background/text tokens.

## Composition & API (runtime)

### Variants

| Variant | Type | Default | Notes |
|---|---|---|---|
| `checked` | `boolean` | `false` | Whether the switch is on or off. |
| `disabled` | `boolean` | `false` | Disables user interaction and applies disabled styling. |
| `size` | `'md'` | `'md'` | Only `md` is verified from the packaged Figma evidence. `sm`/`lg` may be added after live verification. |
| `label` | `ReactNode` | `undefined` | Optional label rendered next to the switch. |
| `onChange` | `(checked: boolean) => void` | `undefined` | Called when the user toggles the switch. |

### Runtime API

```ts
interface ToggleProps {
  checked?: boolean;
  disabled?: boolean;
  size?: 'md';
  label?: React.ReactNode;
  onChange?: (checked: boolean) => void;
}
```

## Codegen Contract (Framework-Agnostic Blueprint)

### Deterministic structure

```
<Toggle>
  <ToggleSwitch>
    <Track />
    <Thumb />
    <FocusRing />
  </ToggleSwitch>
  <Label />
</Toggle>
```

All visible elements are rendered as `div`/`span` or the framework's equivalent. No icon or image assets are required.

### Variant matrix

| Variant | Values |
|---|---|
| `checked` | `true`, `false` |
| `disabled` | `true`, `false` |
| `size` | `md` (`sm`/`lg` reserved) |

### Per-slot style contract

| Slot | Selector | Geometry | Color / border |
|---|---|---|---|
| Track | `.pf-toggle__track` | `width: var(--toggle-track-width)`; `height: var(--toggle-track-height)`; `border-radius: var(--toggle-track-radius)` | `background` driven by state tokens (`--toggle-track-background-*`); `border: var(--toggle-track-border)` |
| Thumb | `.pf-toggle__thumb` | `width/height: var(--toggle-thumb-size)`; `border-radius: var(--toggle-thumb-radius)`; translate `0`/`calc(var(--toggle-track-width) - var(--toggle-thumb-size) - 2 * var(--toggle-switch-inset))` | `background: var(--toggle-thumb-background)` / `var(--toggle-thumb-background-disabled)`; `border: var(--toggle-thumb-border)` |
| Focus ring | `.pf-toggle__focus-ring` | `width: var(--toggle-focus-ring-width)`; `height: var(--toggle-focus-ring-height)`; `border-radius: var(--toggle-focus-ring-radius)`; centered around track | `border: var(--toggle-focus-ring-border)`; hidden by default, shown on `:focus-visible` |
| Label | `.pf-toggle__label` | Body/label type from inherited theme | `color: var(--toggle-text)` / `var(--toggle-text-disabled)` |

### Behavior contract

- User activation toggles `checked` unless `disabled` is true.
- Thumb position interpolates with `var(--toggle-transition-duration) var(--toggle-transition-easing)`.
- Focus ring is rendered only when the switch has `:focus-visible`.
- Click/tap on the label should also toggle the switch.

### Accessibility contract

- Root element carries `role="switch"` and `aria-checked`.
- Label is associated with the switch via `for`/`id` or `aria-labelledby`.
- `Space` key toggles the switch; `disabled` prevents activation.

### Asset resolution + bundling contract

No image or icon assets are required. The component is implemented entirely with CSS custom properties and vector geometry. Theme CSS must be imported wherever the component is rendered (e.g., `components/powerflex-theme.css`).

### Fallback/error rules

- If `checked` is omitted, render the `off` state.
- If `size` is not supported, fall back to `md`.
- If `disabled` is true, ignore `onChange`.
- If theme CSS is missing, the component should still render with browser defaults for the missing tokens; implementers are encouraged to import `components/powerflex-theme.css`.

### Validation checklist

- [ ] `Track` dimensions are `44px × 24px` with `border-radius: var(--toggle-track-radius)`.
- [ ] `Thumb` is `20px × 20px` with `border-radius: var(--toggle-thumb-radius)`.
- [ ] `Focus ring` is `50px × 30px` with `border-radius: var(--toggle-focus-ring-radius)`.
- [ ] Default `checked=on` renders track `#0076ce` (light) / `#509cda` (dark) and thumb `#ffffff`.
- [ ] Focus ring stroke matches `var(--toggle-focus-ring-color)` at `1px`.
- [ ] State matrices are implemented for light and dark themes.
- [ ] Label is associated with the switch for screen readers.
- [ ] Keyboard `Space` toggles the switch.
- [ ] Disabled states prevent activation and use disabled tokens.

## Source Mapping

| Asset | Source |
|---|---|
| Figma file | `82bDP05ESsiiGe38p5TEQJ` |
| Main component / component set | `2754:45` (`State=default, Checked=on, Size=md`) |
| track | `2754:46` |
| thumb | `2754:47` |
| focus-ring | `2754:48` |
| Verification method | Figma REST API (`get_metadata`, `get_design_context`, `get_variable_defs`, `get_screenshot`) |
| Packaged evidence | `figma_evidence.json` in the current Collab Bridge sandbox |
| Screenshot | `https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/ab8fb31d-45d6-4c47-9e53-d506709466bc` (node `2754:45`) |
