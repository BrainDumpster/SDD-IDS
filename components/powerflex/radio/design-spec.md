# Radio Design Spec

## Metadata

- **Version:** 1.0.0
- **Description:** Powerflex radio button control. Supports sizes (sm, md, lg, xl) and states (default, hover, active/focus, disabled) for both checked and unchecked variants.
- **Status:** draft
- **Created:** 2026-07-28
- **Updated:** 2026-07-28
- **Design system:** powerflex
- **Programme display name:** Powerflex
- **Figma verification:** Figma REST API (get_metadata, get_design_context, get_variable_defs, slotGeometry)
- **Verification date:** 2026-07-28
- **Figma file key:** 82bDP05ESsiiGe38p5TEQJ
- **Figma node IDs:** Main component set `2760:2562`; state variant nodes `2760:2536`, `2760:2561`, `2760:2559`, `2760:2557`, `2760:2552`, `2760:2556`, `2760:2555`, `2760:2548`, `2760:2551`, `2760:2558`, `2760:2550`, `2760:2549`, `2760:2542`, `2760:2547`, `2760:2545`, `2760:2541`, `2760:2539`, `2760:2553`, `2760:2546`, `2760:2543`, `2760:2537`, `2760:2560`, `2760:2554`, `2760:2540`, `2760:2538`, `2760:2535`, `2760:2534`, `2760:2533`, `2760:2532`; track nodes `2760:2379`, `2760:2468`, `2760:2435`, `2760:2472`, `2760:2451`, `2760:2476`, `2760:2403`, `2760:2480`, `2760:2383`, `2760:2484`, `2760:2439`, `2760:2488`, `2760:2455`, `2760:2492`, `2760:2407`, `2760:2496`, `2760:2385`, `2760:2500`, `2760:2443`, `2760:2504`, `2760:2457`, `2760:2508`, `2760:2409`, `2760:2512`; indicator nodes `2760:2380`, `2760:2469`, `2760:2436`, `2760:2473`, `2760:2452`, `2760:2477`, `2760:2404`, `2760:2481`, `2760:2384`, `2760:2485`, `2760:2440`, `2760:2489`, `2760:2456`, `2760:2493`, `2760:2408`, `2760:2497`, `2760:2386`, `2760:2501`, `2760:2444`, `2760:2505`, `2760:2458`, `2760:2509`, `2760:2410`, `2760:2513`; focus-ring nodes `2760:2390`, `2760:2467`, `2760:2434`, `2760:2471`, `2760:2450`, `2760:2475`, `2760:2402`, `2760:2479`, `2760:2393`, `2760:2483`, `2760:2438`, `2760:2487`, `2760:2454`, `2760:2491`, `2760:2406`, `2760:2495`, `2760:2396`, `2760:2499`, `2760:2442`, `2760:2503`, `2760:2458`, `2760:2507`, `2760:24010`, `2760:2511`.

## Anatomy

```
  ┌───────────────┐
  │   ████████    │  ← checked
  │   ██    ██    │
  │   ████████    │
  └───────────────┘
       track
    indicator
```

```
  ┌───────────────┐
  │  ○           │  ← unchecked
  └───────────────┘
       track
```

**Anatomy slots:**
- **Radio root (`radio`)**: The component set and main container.
- **Track (`track`)**: The outer circular frame that holds the fill and border.
- **Indicator (`indicator`)**: The inner circular dot shown when `checked=true`.
- **Focus ring (`focus-ring`)**: A circular outline shown for the active/focus state.

## Layout & Measurements

### Slot geometry (Figma-verified)

| Slot / layer | Property | Token / contract | Figma node | Live evidence |
|--------------|----------|------------------|------------|---------------|
| `radio` (component set) | border-radius | `var(--radio-radius, 5px)` | `2760:2562` | Figma REST `slotGeometry` `borderRadius: 5.0` |
| `track` (Size=sm) | width × height | `var(--radio-track-size-sm, 16px)` | `2760:2379` | Figma REST `slotGeometry` `width: 16.0` |
| `track` (Size=md) | width × height | `var(--radio-track-size-md, 24px)` | `2760:2383` | Figma REST `slotGeometry` `width: 24.0` |
| `track` (Size=lg) | width × height | `var(--radio-track-size-lg, 32px)` | `2760:2385` | Figma REST `slotGeometry` `width: 32.0` |
| `track` (Size=xl) | width × height | `var(--radio-track-size-xl, 40px)` | `2760:2387` | Figma REST `slotGeometry` `width: 40.0` |
| `track` | border-radius | `var(--corner-radius-radius-round, 9999px)` | `2760:2379` | Figma REST `slotGeometry` `borderRadius: 9999.0` |
| `indicator` (Size=sm) | width × height | `var(--radio-indicator-size-sm, 8px)` | `2760:2380` | Figma REST `slotGeometry` `width: 8.0` |
| `indicator` (Size=md) | width × height | `var(--radio-indicator-size-md, 12px)` | `2760:2384` | Figma REST `slotGeometry` `width: 12.0` |
| `indicator` (Size=lg) | width × height | `var(--radio-indicator-size-lg, 16px)` | `2760:2386` | Figma REST `slotGeometry` `width: 16.0` |
| `indicator` (Size=xl) | width × height | `var(--radio-indicator-size-xl, 24px)` | `2760:2388` | Figma REST `slotGeometry` `width: 24.0` |
| `indicator` | border-radius | `var(--corner-radius-radius-round, 9999px)` | `2760:2380` | Figma REST `slotGeometry` `borderRadius: 9999.0` |
| `focus-ring` (Size=sm) | width × height | `var(--radio-focus-ring-size-sm, 20px)` | `2760:2390` | Figma REST `slotGeometry` `width: 20.0` |
| `focus-ring` (Size=md) | width × height | `var(--radio-focus-ring-size-md, 28px)` | `2760:2393` | Figma REST `slotGeometry` `width: 28.0` |
| `focus-ring` (Size=lg) | width × height | `var(--radio-focus-ring-size-lg, 36px)` | `2760:2396` | Figma REST `slotGeometry` `width: 36.0` |
| `focus-ring` (Size=xl) | width × height | `var(--radio-focus-ring-size-xl, 46px)` | `2760:2399` | Figma REST `slotGeometry` `width: 46.0` |
| `focus-ring` | border-radius | `var(--corner-radius-radius-round, 9999px)` | `2760:2390` | Figma REST `slotGeometry` `borderRadius: 9999.0` |
| `focus-ring` | stroke | `var(--radio-focus-ring, #0076ce)` | `2760:2390` | Figma REST `get_design_context` |
| `track` | bound variables | `VariableID:2453:30`, `VariableID:2521:3`, `VariableID:2453:4`, plus state-specific IDs `2453:26`, `2453:27`, `2453:28`, `2453:8`, `2453:9`, `2760:2465`, `2694:2477`, `2596:4230` | `2760:2379`… | Figma REST `slotGeometry` `boundVariableHints` / `get_variable_defs` |

### Container measurements

- **Track sizes:** sm 16px, md 24px, lg 32px, xl 40px.
- **Indicator sizes:** sm 8px, md 12px, lg 16px, xl 24px.
- **Focus ring offset:** `+4px` larger than track (sm 20px, md 28px, lg 36px, xl 46px).
- **Radio is circular:** `border-radius: 9999px` / `50%`.

## Tokens

### Colors

| Token | Light theme value | Usage |
|-------|-------------------|-------|
| `--radio-focus-ring` | `#0076ce` | Active/focus outline ring |
| `--radio-indicator-fill` | `#ffffff` | Checked inner dot |
| `--radio-track-fill-default-unchecked` | `#ffffff` | Default unchecked track background |
| `--radio-track-stroke-default` | `#888888` | Default unchecked track border |
| `--radio-track-fill-default-checked` | `#0076ce` | Default checked track background |
| `--radio-track-stroke-default-checked` | `#0076ce` | Default checked track border |
| `--radio-track-fill-hover-unchecked` | `#f4f4f4` | Hover unchecked track background |
| `--radio-track-stroke-hover` | `#333333` | Hover track border |
| `--radio-track-fill-hover-checked` | `#005da4` | Hover checked track background; bound to `color/action/primary/hover` (`VariableID:2453:27`) |
| `--radio-track-fill-active-unchecked` | `#ffffff` | Active unchecked track background |
| `--radio-track-stroke-active` | `#0076ce` | Active/focus track border |
| `--radio-track-fill-active-checked` | `#00447c` | Active checked track background |
| `--radio-track-fill-disabled-unchecked` | `#f4f4f4` | Disabled unchecked track background |
| `--radio-track-stroke-disabled` | `#bbbbbb` | Disabled track border |
| `--radio-track-fill-disabled-checked` | `#bbbbbb` | Disabled checked track background |

### Sizes

- `--radio-track-size-sm`: 16px
- `--radio-track-size-md`: 24px
- `--radio-track-size-lg`: 32px
- `--radio-track-size-xl`: 40px
- `--radio-indicator-size-sm`: 8px
- `--radio-indicator-size-md`: 12px
- `--radio-indicator-size-lg`: 16px
- `--radio-indicator-size-xl`: 24px
- `--radio-focus-ring-size-sm`: 20px
- `--radio-focus-ring-size-md`: 28px
- `--radio-focus-ring-size-lg`: 36px
- `--radio-focus-ring-size-xl`: 46px

## States (Light Theme)

| State / Checked | Background | Border | Indicator |
|-----------------|------------|--------|-----------|
| **default, unchecked** | `var(--radio-track-fill-default-unchecked, #ffffff)` | `var(--radio-track-stroke-default, #888888)` | hidden |
| **default, checked** | `var(--radio-track-fill-default-checked, #0076ce)` | `var(--radio-track-stroke-default-checked, #0076ce)` | `var(--radio-indicator-fill, #ffffff)` |
| **hover, unchecked** | `var(--radio-track-fill-hover-unchecked, #f4f4f4)` | `var(--radio-track-stroke-hover, #333333)` | hidden |
| **hover, checked** | `var(--radio-track-fill-hover-checked, #005da4)` | `var(--radio-track-stroke-hover, #333333)` | `var(--radio-indicator-fill, #ffffff)` |
| **active, unchecked** | `var(--radio-track-fill-active-unchecked, #ffffff)` | `var(--radio-track-stroke-active, #0076ce)` + `var(--radio-focus-ring, #0076ce)` | hidden |
| **active, checked** | `var(--radio-track-fill-active-checked, #00447c)` | `var(--radio-track-stroke-active, #0076ce)` + `var(--radio-focus-ring, #0076ce)` | `var(--radio-indicator-fill, #ffffff)` |
| **disabled, unchecked** | `var(--radio-track-fill-disabled-unchecked, #f4f4f4)` | `var(--radio-track-stroke-disabled, #bbbbbb)` | hidden |
| **disabled, checked** | `var(--radio-track-fill-disabled-checked, #bbbbbb)` | `var(--radio-track-stroke-disabled, #bbbbbb)` | `var(--radio-indicator-fill, #ffffff)` |

## States (Dark Theme)

All Dark theme states use the same semantic `var(--...)` tokens as the Light theme. The token values themselves are resolved in `components/powerflex-theme.css` under `[data-theme="dark"]`. The structure is identical to the Light theme table above. Dark overrides for Powerflex radio have not yet been supplied by Figma; placeholder values are used until a dark-mode export is available.

## Interactions

### Accessibility

- **Keyboard navigation:**
  - `Tab` / `Shift+Tab`: Move focus to/from the radio control.
  - `Space`: Toggle/select the focused radio when not disabled.
  - `Arrow Up` / `Arrow Left` / `Arrow Down` / `Arrow Right`: Move selection within a radio group.
- **ARIA attributes:**
  - Radio input: `role="radio"`, `aria-checked={checked}`, `aria-disabled={disabled}`.
  - Radio group: `role="radiogroup"` with an accessible `aria-label` or `aria-labelledby`.
- **Focus management:**
  - Focus ring (`var(--radio-focus-ring)`) appears on `focus-visible`.
  - Disabled radios are not focusable and use `aria-disabled`.

### Behavior & guidelines

- **Selection:** A radio within a group is selected by click, `Space`, or arrow navigation.
- **Mutually exclusive:** Only one radio in a group can be checked at a time.
- **Hover:** Applied on `:hover` for non-disabled radios.
- **Active/focus:** Applied on `:active` and `:focus-visible`.
- **Disabled:** Non-interactive; does not receive focus and shows disabled color tokens.
- **Sizes:** `sm`, `md`, `lg`, `xl` scale the track, indicator, and focus ring proportionally.

## Composition & API (runtime)

### Variants

- **size:** `sm` | `md` | `lg` | `xl` (default `md`)
- **checked:** `true` | `false`
- **state:** `default` | `hover` | `active` | `disabled`

### Runtime API

```typescript
interface RadioProps {
  /** Whether the radio is selected */
  checked?: boolean;
  /** Visual size */
  size?: "sm" | "md" | "lg" | "xl";
  /** Whether the radio is disabled */
  disabled?: boolean;
  /** Accessible label text */
  label?: string;
  /** Callback when the radio is selected */
  onChange?: (checked: boolean) => void;
  /** Optional name attribute for grouping */
  name?: string;
}
```

**Events:**
- `onChange`: Fired when the radio becomes selected.
- `onFocus` / `onBlur`: Toggles active/focus state.
- `onMouseEnter` / `onMouseLeave`: Toggles hover state.

**Spec Accurate Design story defaults:**
- `size`: `md`
- `checked`: true
- `disabled`: false

## Codegen Contract (Framework-Agnostic Blueprint)

### Deterministic structure

```
Radio (root, role="radio")
├── FocusRing (circular outline, conditionally rendered)
├── Track (circular frame, fill + border)
│   └── Indicator (circular dot, conditionally rendered when checked)
└── Label (optional text node)
```

**Required DOM hierarchy:**
- Root must be a `<label>` or `<span>` containing an `<input type="radio">` (visually hidden) plus the styled track.
- Alternatively, root may be a `<div role="radio">` with `aria-checked` and `aria-disabled`.
- The focus ring, track, and indicator should be separate DOM nodes for precise token control.

### Variant matrix

| Prop | Values | Default | CSS class pattern |
|------|--------|---------|-------------------|
| size | `sm`, `md`, `lg`, `xl` | `md` | `.radio--{size}` |
| checked | `true`, `false` | `false` | `.radio--checked` / `.radio--unchecked` |
| disabled | `true`, `false` | `false` | `.radio--disabled` |

### Per-slot style contract

**Radio root:**
- `display: inline-flex; align-items: center; gap: 8px;`
- `cursor: pointer` (default/hover/active); `cursor: not-allowed` (disabled).

**Track:**
- `width: var(--radio-track-size-{size}, 24px);`
- `height: var(--radio-track-size-{size}, 24px);`
- `border-radius: var(--corner-radius-radius-round, 9999px);`
- `box-sizing: border-box;`
- `background-color` and `border-color` by state and checked values from the state matrix.
- `border-width: 1px` (or `0` for filled checked states where fill equals border).

**Indicator:**
- `width: var(--radio-indicator-size-{size}, 12px);`
- `height: var(--radio-indicator-size-{size}, 12px);`
- `border-radius: var(--corner-radius-radius-round, 9999px);`
- `background-color: var(--radio-indicator-fill, #ffffff);`
- Rendered only when `checked=true`.
- Centered inside the track with `position: absolute` or `margin: auto`.

**Focus ring:**
- `width: var(--radio-focus-ring-size-{size}, 28px);`
- `height: var(--radio-focus-ring-size-{size}, 28px);`
- `border-radius: var(--corner-radius-radius-round, 9999px);`
- `border: 1px solid var(--radio-focus-ring, #0076ce);`
- Centered around the track; rendered on `active`/`focus-visible`.

### Behavior contract

- `checked` is a boolean controlled prop.
- Click/Space selects the radio; within a group, only one may be checked.
- `disabled` suppresses all interactions and focus.
- Hover/Active visual states are driven by CSS pseudo-classes and `data-state` attributes for demo purposes only.

### Accessibility contract

- Native `<input type="radio">` is preferred, visually hidden but focusable.
- Styled track uses `aria-hidden="true"` and does not receive focus.
- Group uses `role="radiogroup"` or `<fieldset>`.
- `aria-checked` and `aria-disabled` are set correctly for non-native implementations.

### Asset resolution + bundling contract

- No external images or icon fonts are required. The radio is built entirely with CSS shapes (circles).
- Roboto and base sizing/spacing tokens are inherited from `components/powerflex-theme.css` and `components/ids-theme.css`.

### Fallback/error rules

- Unknown `size`: default to `md`.
- Missing `checked`: treat as `false`.
- Missing `disabled`: treat as `false`.
- Missing tokens: use the documented `#hex` fallbacks.

### Validation checklist

- [ ] Track and indicator are perfect circles (`border-radius: 9999px` / `50%`).
- [ ] Sizes match sm 16/8/20, md 24/12/28, lg 32/16/36, xl 40/24/46 (track/indicator/focus-ring).
- [ ] Default checked track is `#0076ce` with white indicator.
- [ ] Hover checked track is `#005da4` with `VariableID:2453:27` (`color/action/primary/hover`).
- [ ] Active/focus ring is `#0076ce`.
- [ ] Disabled unchecked is `#f4f4f4` fill with `#bbbbbb` border; disabled checked is `#bbbbbb` fill.
- [ ] Indicator is hidden when `checked=false`.
- [ ] ARIA `role="radio"` and `aria-checked` are set.

## Source Mapping

| Source | File key / node id | Verification method |
|--------|-------------------|---------------------|
| Main component set | `82bDP05ESsiiGe38p5TEQJ` / `2760:2562` | Figma REST `get_metadata` + `slotGeometry` |
| State variants (sm) | `82bDP05ESsiiGe38p5TEQJ` / `2760:2536`, `2760:2561`, `2760:2559`, `2760:2557`, `2760:2552`, `2760:2556`, `2760:2555`, `2760:2548` | Figma REST `slotGeometry` |
| State variants (md/lg/xl) | `82bDP05ESsiiGe38p5TEQJ` / `2760:2551`…`2760:2532` | Figma REST `slotGeometry` |
| Track nodes | `82bDP05ESsiiGe38p5TEQJ` / `2760:2379`…`2760:2512` | Figma REST `slotGeometry` |
| Indicator nodes | `82bDP05ESsiiGe38p5TEQJ` / `2760:2380`…`2760:2513` | Figma REST `slotGeometry` |
| Focus ring nodes | `82bDP05ESsiiGe38p5TEQJ` / `2760:2390`…`2760:2511` | Figma REST `slotGeometry` |
| Hover checked variable | `VariableID:2453:27` (`color/action/primary/hover`) | Figma REST `get_variable_defs` + `slotGeometry` `boundVariableHints` |
