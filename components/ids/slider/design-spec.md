# Slider Design Spec

## Metadata
- Component: Slider
- Category: Formelements
- Design System: IDS
- Figma (state matrix): https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=22459-40319&m=dev
- Figma (main matrix with value/state/stepper variants): https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=22459-39022&m=dev
- Figma (size/marker/track parts): https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=22459-38985&m=dev
- Figma (marker states): https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=22505-177044&m=dev
- Figma (slider section context): https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=42114-74026&m=dev
- Figma file key: `0bHk3XhrjFhowgFkz9yLr4`
- Component-map entry: `data/component-figma-map.json` -> `Slider` (legacy exploration link exists in map; this spec is validated against IDS Design Library nodes above).
- Validated nodes: `22459:40319`, `22459:39022`, `22459:38985`, `22505:177044`, `42114:74026`
- Last live verification: Figma MCP (`get_metadata`, `get_design_context`, `get_variable_defs`) in this session.
## Anatomy
Deterministic slider slots:
1. `SliderRoot`
2. optional `SliderMinLabel`
3. `SliderRail`
4. optional `SliderProgressSegment` (single mode)
5. optional `SliderRangeSegment` (range mode)
6. optional `SliderTickList`
7. `SliderThumbMin` (single mode uses only this thumb)
8. optional `SliderThumbMax` (range mode)
9. optional `SliderValueLabelMin`
10. optional `SliderValueLabelMax` (range mode)
11. optional `SliderMaxLabel`
12. optional `SliderValueInputMin`
13. optional `SliderValueInputMax` (range mode)

Element-part references from Figma:
- Marker small (`8px`) and marker large (`16px`) from `.Slider-Element-Parts`.
- Track part (`4px` height) from `.Slider-Element-Parts`.
- Range-selector part (two large markers + selected segment) from `.Slider-Element-Parts`.
- Marker interaction states (`Default | Hover | Press | Focus | Disabled`) from `.Slider-Element-Marker`.
## Layout & Measurements
- State-matrix cell size in showcase frame: `525px x 80px` (`22459:40319`).
- Marker/track/shape part measurements (`22459:38985`):
  - small marker visual dot: `8px` diameter
  - large marker thumb: `16px x 16px`
  - focus halo around marker: `22px x 22px` footprint (`22505:177044`)
  - track thickness: `4px`
  - range selector sample width: `68px` container with two 16px thumbs and center selected rail
- Runtime width: container-driven (`width: 100%`), sample widths are reference only.
- Slider row height in examples: `80px`; runtime can exceed this when value labels and/or value input are enabled.
- Value labels are rendered below the corresponding thumb centerline.
- Optional value input boxes (single/range) follow IDS compact text-input geometry: `32px` height with horizontal padding `var(--padding-padding-16)`.
- Range value input mode renders two `32px` text boxes with a centered separator slot (`"-"`) between them.
## Tokens
Verified slider tokens from `22459:38985` and `22505:177044`:
- `var(--color-icon-brand-base)` (selected marker/track)
- `var(--color-icon-brand-strong)` (hover marker)
- `var(--color-icon-brand-stronger)` (press marker)
- `var(--color-border-brand-base)` (focus ring)
- `var(--color-icon-disabled)` (disabled marker/track)
- `var(--color-text-brand-base)` (enabled value-under-thumb text)
- `var(--color-text-disabled)` (disabled value-under-thumb text)
- `var(--color-background-gray-light)` (unselected rail and disabled unselected small marker fill surface)
- `var(--color-border-disabled)` (unselected small marker border and disabled outlines)
- `var(--color-text-white)` (marker inner/focus contrast asset in marker state component)

Supporting semantic tokens used by slider compositions:
- `var(--color-background-component)`
- `var(--color-border-accessible)`
## States (Light Theme)
| Slot | State | Background | Border | Text/Icon |
|---|---|---|---|---|
| Rail (`SliderRail`) | default | `var(--color-background-gray-light)` | none | n/a |
| Rail (`SliderRail`) | disabled | `var(--color-icon-disabled)` | none | n/a |
| Progress/Range segment | selected | `var(--color-icon-brand-base)` | none | n/a |
| Progress/Range segment | disabled | `var(--color-icon-disabled)` | none | n/a |
| Small marker (`8px`) | selected | `var(--color-icon-brand-base)` | none | n/a |
| Small marker (`8px`) | not-selected | transparent (outline-only) | `var(--color-border-disabled)` | n/a |
| Small marker (`8px`) | disabled selected | `var(--color-icon-disabled)` | `var(--color-icon-disabled)` | n/a |
| Small marker (`8px`) | disabled not-selected | `var(--color-background-gray-light)` | `var(--color-icon-disabled)` | n/a |
| Large marker (`16px`) | default | `var(--color-icon-brand-base)` | none | value label `var(--color-text-brand-base)` |
| Large marker (`16px`) | hover | `var(--color-icon-brand-strong)` | none | value label `var(--color-text-brand-base)` |
| Large marker (`16px`) | press | `var(--color-icon-brand-stronger)` | none | value label `var(--color-text-brand-base)` |
| Large marker (`16px`) | focus-visible | marker uses current interactive fill | outer ring `var(--color-border-brand-base)` | value label unchanged |
| Large marker (`16px`) | disabled | `var(--color-icon-disabled)` | none | value label `var(--color-text-disabled)` |
| Endpoint label (`SliderMinLabel`/`SliderMaxLabel`) | default | n/a | n/a | `var(--color-text-neutral)` |
| Endpoint label (`SliderMinLabel`) | min-active | n/a | n/a | `var(--color-text-brand-base)` |
| Endpoint label (`SliderMaxLabel`) | max-active | n/a | n/a | `var(--color-text-brand-base)` |
| Value input (`32px`) | default | `var(--color-background-component)` | `var(--color-border-accessible)` | `var(--color-text-neutral)` |
| Value input (`32px`) | disabled | `var(--color-background-gray-light)` | `var(--color-border-accessible)` | `var(--color-text-disabled)` |
## States (Dark Theme)
Dark theme uses the same structural state matrix and resolves all values through semantic tokens.

| Slot | State | Background | Border | Text/Icon |
|---|---|---|---|---|
| Rail (`SliderRail`) | default | semantic token resolved | semantic token resolved | n/a |
| Rail (`SliderRail`) | disabled | semantic token resolved | semantic token resolved | n/a |
| Progress/Range segment | selected | semantic token resolved | semantic token resolved | n/a |
| Progress/Range segment | disabled | semantic token resolved | semantic token resolved | n/a |
| Small marker (`8px`) | selected | semantic token resolved | semantic token resolved | n/a |
| Small marker (`8px`) | not-selected | semantic token resolved | semantic token resolved | n/a |
| Small marker (`8px`) | disabled selected | semantic token resolved | semantic token resolved | n/a |
| Small marker (`8px`) | disabled not-selected | semantic token resolved | semantic token resolved | n/a |
| Large marker (`16px`) | default | semantic token resolved | semantic token resolved | semantic token resolved |
| Large marker (`16px`) | hover | semantic token resolved | semantic token resolved | semantic token resolved |
| Large marker (`16px`) | press | semantic token resolved | semantic token resolved | semantic token resolved |
| Large marker (`16px`) | focus-visible | semantic token resolved | semantic token resolved | semantic token resolved |
| Large marker (`16px`) | disabled | semantic token resolved | semantic token resolved | semantic token resolved |
| Endpoint label (`SliderMinLabel`/`SliderMaxLabel`) | default/min-active/max-active | semantic token resolved | n/a | semantic token resolved |
| Value input (`32px`) | default/disabled | semantic token resolved | semantic token resolved | semantic token resolved |
## Interactions
- Pointer:
  - click rail jumps active thumb to nearest valid step.
  - drag thumb updates value continuously or by `step` increments.
- Keyboard:
  - `ArrowLeft`/`ArrowDown`: decrement by step.
  - `ArrowRight`/`ArrowUp`: increment by step.
  - `Home`: set thumb to `min`.
  - `End`: set thumb to `max`.
- Range behavior:
  - `minThumb` cannot exceed `maxThumb`.
  - `maxThumb` cannot go below `minThumb`.
  - when thumbs meet, both remain keyboard reachable.
- Stepper/ticks:
  - shown only when `showStepper` (or alias `showTicks`) is true.
  - selected ticks use selected marker token; unselected ticks follow not-selected marker token.
  - unselected ticks are outline-only circles (no fill).
  - steppers are distributed at equal frequency controlled by `stepperFrequency` (fallback to `step` when absent).
  - first and last steppers must be anchored at exact track endpoints (`min`, `max`).
  - when steppers are visible, thumb movement snaps to the stepper interval.
- Endpoint label emphasis:
  - when thumb value equals `min`, the min label uses `var(--color-text-brand-base)`.
  - when thumb value equals `max`, the max label uses `var(--color-text-brand-base)`.
  - in range mode, endpoint highlighting is evaluated independently per thumb.
- Disabled behavior:
  - blocks pointer and keyboard interaction.
  - uses disabled marker/rail/value text tokens.
## Composition & API (runtime)
| Prop | Required | Type | Default | Notes |
|---|---|---|---|---|
| `mode` | No | `"single" \| "range"` | `"single"` | Range mode uses two thumbs. |
| `min` | Yes | `number` | — | Lower bound. |
| `max` | Yes | `number` | — | Upper bound. |
| `step` | No | `number` | `1` | Positive step interval. |
| `value` | Yes | `number \| [number, number]` | — | Controlled value. |
| `defaultValue` | No | `number \| [number, number]` | — | Uncontrolled initialization. |
| `disabled` | No | `boolean` | `false` | Applies disabled visual/interaction state. |
| `showStepper` | No | `boolean` | `false` | Shows tick markers on rail. |
| `showTicks` | No | `boolean` | `false` | Alias of `showStepper`. |
| `stepperFrequency` | No | `number` | `step` | Stepper spacing interval; when steppers are shown, this interval drives snapping. |
| `showValueLabel` | No | `boolean` | `true` | Show value text under marker(s). |
| `showValueInput` | No | `boolean` | `false` | Show numeric input(s) for value entry. |
| `minLabel` | No | `string` | — | Optional left label. |
| `maxLabel` | No | `string` | — | Optional right label. |
| `onValueChange` | No | `(value: number \| [number, number]) => void` | — | Fires on value updates. |
| `onValueCommit` | No | `(value: number \| [number, number]) => void` | — | Fires on pointer/key commit. |
## Codegen Contract (Framework-Agnostic Blueprint)
### Deterministic structure
1. `SliderRoot`
2. optional labels row (`SliderMinLabel`, `SliderMaxLabel`)
3. `SliderRail`
4. optional selected segment (`SliderProgressSegment` or `SliderRangeSegment`)
5. optional `SliderTickList`
6. marker layer (`SliderThumbMin`, optional `SliderThumbMax`)
7. optional value-label layer (`SliderValueLabelMin`, optional `SliderValueLabelMax`)
8. optional input row (`SliderValueInputMin`, optional `SliderValueInputMax`)

### Variant matrix
- `mode`: `single | range`
- `state`: `default | hover | press | focus-visible | disabled`
- `stepper`: `off | on`
- `endpointLabelState`: `default | min-active | max-active | both-active (range edges)`
- `valueDisplay`: `none | value-label | value-input | both`
- `inputMode`: `none | single-input | range-input-with-separator`
- `markerShape`: `small-tick | large-thumb`

### Per-slot style contract
- `SliderRail` height is `4px`, tokenized via rail tokens.
- `SliderThumb` size is `16px`; focus ring footprint extends to `22px`.
- `SliderTick` (small marker) uses `8px` visual dot style.
- `SliderTick` not-selected state is outline-only (transparent fill + tokenized border).
- Selected track segment and selected ticks use `var(--color-icon-brand-base)`.
- Disabled rail/segment/ticks/thumbs use `var(--color-icon-disabled)`.
- Value-under-thumb text maps to `var(--color-text-brand-base)` in enabled states and `var(--color-text-disabled)` when disabled.
- Endpoint label color switches to `var(--color-text-brand-base)` when a thumb is exactly at that endpoint.
- Range input mode uses two `32px` inputs and a centered separator slot (`"-"`).

### Behavior contract
- Clamp all values to `[min, max]`.
- Quantize values to nearest valid step.
- If `showStepper=true`, quantize/snapping interval is `stepperFrequency` (or `step` when `stepperFrequency` is absent).
- In range mode, preserve sorted order and prevent crossing.
- Emit `onValueChange` on interactive updates and `onValueCommit` on interaction completion.

### Accessibility contract
- Use slider semantics per thumb (`role="slider"` where applicable).
- Expose `aria-valuemin`, `aria-valuemax`, `aria-valuenow`, and `aria-disabled`.
- In range mode, each thumb must have distinct accessible name (e.g., "Minimum value", "Maximum value").
- Focus indicator must remain visible in all themes.
- Value input controls must remain programmatically associated with slider values (single or min/max in range).

### Asset resolution + bundling contract
- No external icon assets are required for slider rendering.
- Marker shapes are tokenized vector/circle primitives.

### Fallback/error rules
- Unknown `mode` falls back to `single`.
- Invalid range value (wrong length or NaN) falls back to `[min, min]` then normalized.
- `step <= 0` falls back to `1`.
- `stepperFrequency <= 0` falls back to `step`.
- If `min > max`, swap and normalize once during initialization.
- Unknown `showTicks`/`showStepper` conflicts resolve by OR behavior (`showStepper || showTicks`).
- Code generation must use this spec as the only source of runtime behavior/styling contracts; do not require live Figma fetch at generation time.

### Validation checklist
- [ ] State matrix parity matches `22459:40319` (default vs disabled, value variants, stepper on/off).
- [ ] Marker/track/shape sizes match `22459:38985` (`8`, `16`, `4` and range-selector composition).
- [ ] Marker interaction states match `22505:177044` (`default | hover | press | focus | disabled`).
- [ ] Main matrix behavior matches `22459:39022` (value variants, range, stepper on/off, default/disabled).
- [ ] Light/dark outputs are semantic-token driven.
- [ ] Range no-crossing and keyboard behavior are implemented.
## Source Mapping
| Source | Location |
|---|---|
| Component map | `data/component-figma-map.json` |
| IDS slider state matrix | https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=22459-40319&m=dev (`22459:40319`) |
| IDS slider main matrix | https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=22459-39022&m=dev (`22459:39022`) |
| IDS slider parts (size/shape) | https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=22459-38985&m=dev (`22459:38985`) |
| IDS marker states | https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=22505-177044&m=dev (`22505:177044`) |
| IDS slider section context | https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=42114-74026&m=dev (`42114:74026`) |
| Live verification method | Figma MCP: `get_metadata`, `get_design_context`, `get_variable_defs` |
