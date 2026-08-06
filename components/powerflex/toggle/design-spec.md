# Toggle (powerflex/toggle)

## Metadata

| Property | Value |
|---|---|
| Version | 1.0.0 |
| Description | PowerFlex toggle switch. Native standalone component with no IDS counterpart. |
| Status | draft |
| Created | 2026-08-06 |
| Updated | 2026-08-06 |
| Figma verification | Packaged `figma_evidence.json` (`source: figma_rest_enriched`, `verificationMethod: Figma REST API`, file key `82bDP05ESsiiGe38p5TEQJ`, main component set `2754:109`) |
| Spec pattern | standalone |
| Theme CSS | `components/powerflex-theme.css` |

## Anatomy

1. **Toggle input** — native `<input type="checkbox" role="switch" />` carrying `aria-checked`, `aria-disabled`, and focus state.
2. **Track** — the rounded background shell that holds the thumb. Figma node `2754:46` (md on/default).
3. **Thumb** — the circular indicator. Figma node `2754:47` (md on/default).
4. **Focus ring** — the rounded outline shown when the input has focus. Figma node `2754:48` (md on/default).

## Layout & Measurements

### Component set

- Component set artboard: **313 × 728 px**, vertical auto-layout, `itemSpacing = 8 px`, `cornerRadius = 5 px`. Node `2754:109`.
- Variants encoded in the component set: `Size={sm|md|lg}`, `Checked={on|off}`, `State={default|hover|active|disabled}`.

### Slot geometry (Figma-verified)

| Slot / layer | Property | Token / contract | Value | Figma node | Live evidence |
|---|---|---|---|---|---|
| Toggle (component set) | width × height | — | 313 × 728 px | `2754:109` | `get_design_context` layout |
| Toggle (component set) | itemSpacing | — | 8 px | `2754:109` | `get_design_context` layout |
| Toggle (component set) | cornerRadius | — | 5 px | `2754:109` | `get_design_context` layout |
| Track — md | width × height | — | 44 × 24 px | `2754:46` | `slotGeometry` |
| Track — md | border-radius | `--toggle-control-radius` (`var(--corner-radius-radius-round)`) | 9999 px (fully rounded) | `2754:46` | `boundVariableHints` `VariableID:2453:26`; `get_variable_defs` |
| Track — lg | width × height | — | 52 × 28 px | `2754:78` | `slotGeometry` |
| Track — lg | border-radius | `--toggle-control-radius` | 9999 px | `2754:78` | `boundVariableHints` `VariableID:2453:26` |
| Track — sm | width × height | — | 32 × 16 px | `2754:14` | `slotGeometry` |
| Track — sm | border-radius | `--toggle-control-radius` | 9999 px | `2754:14` | `boundVariableHints` `VariableID:2453:26` |
| Thumb — md | width × height | — | 20 × 20 px | `2754:47` | `slotGeometry` |
| Thumb — md | border-radius | `--toggle-control-radius` | 9999 px | `2754:47` | `boundVariableHints` `VariableID:2453:4`; `get_variable_defs` |
| Thumb — lg | width × height | — | 24 × 24 px | `2754:79` | `slotGeometry` |
| Thumb — lg | border-radius | `--toggle-control-radius` | 9999 px | `2754:79` | `boundVariableHints` `VariableID:2453:4` |
| Thumb — sm | width × height | — | 12 × 12 px | `2754:15` | `slotGeometry` |
| Thumb — sm | border-radius | `--toggle-control-radius` | 9999 px | `2754:15` | `boundVariableHints` `VariableID:2453:4` |
| Focus ring — md | width × height | — | 50 × 30 px | `2754:48` | `slotGeometry` |
| Focus ring — md | border-radius | `--toggle-control-radius` | 9999 px | `2754:48` | `boundVariableHints` `VariableID:2453:30`; `get_variable_defs` |
| Focus ring — lg | width × height | — | 58 × 34 px | `2754:80` | `slotGeometry` |
| Focus ring — lg | border-radius | `--toggle-control-radius` | 9999 px | `2754:80` | `boundVariableHints` `VariableID:2453:30` |
| Focus ring — sm | width × height | — | 38 × 22 px | `2754:16` | `slotGeometry` |
| Focus ring — sm | border-radius | `--toggle-control-radius` | 9999 px | `2754:16` | `boundVariableHints` `VariableID:2453:30` |
| Thumb / track inset | left/right inset | `--toggle-thumb-offset` | 2 px | derived from slot dimensions | `slotGeometry` |
| Focus ring offset | outline inset | `--toggle-focus-ring-offset` | 3 px per axis (6 px total) | `50-44` / `30-24` | `slotGeometry` |

### Measurements summary

| Size | Track | Thumb | Focus ring | Thumb off X | Thumb on X |
|---|---|---|---|---|---|
| md | 44 × 24 | 20 × 20 | 50 × 30 | 2 px | 22 px |
| lg | 52 × 28 | 24 × 24 | 58 × 34 | 2 px | 26 px |
| sm | 32 × 16 | 12 × 12 | 38 × 22 | 2 px | 18 px |

## Tokens

### Component-specific tokens

| Token | Value | Usage |
|---|---|---|
| `--toggle-control-radius` | `var(--corner-radius-radius-round)` | Track, thumb, and focus ring corner radius (9999 px / fully rounded) |
| `--toggle-focus-ring-offset` | `3px` | Focus ring is 6 px wider/taller than the track on each axis |
| `--toggle-thumb-offset` | `2px` | Thumb inset from the track edge in the off position |
| `--toggle-thumb-fill` | `#ffffff` | Thumb circle fill across all states |

### Semantic color tokens (PowerFlex overrides)

From `components/powerflex-theme.css`:

| Token | Light | Dark |
|---|---|---|
| `--color-background-controls-brand-base` | `#0076ce` | `#4c9ede` |
| `--color-background-controls-brand-strong` | `#005da4` | `#3a8bc7` |
| `--color-background-controls-brand-stronger` | `#00447c` | `#2a6fa3` |
| `--color-background-gray-light` | `#eeeeee` | `#4d4d4d` |
| `--color-background-gray-base` | `#888888` | `#9e9e9e` |
| `--color-background-gray-strong` | `#333333` | `#b8c1c9` |
| `--color-background-gray-lighter` | `#f4f4f4` | `#393939` |
| `--color-border-brand-base` | `#0076ce` | `#4c9ede` |

## States (Light Theme)

### On

| State | Background | Border | Text-Icon |
|---|---|---|---|
| default | `var(--color-background-controls-brand-base)` | `var(--color-border-brand-base)` | `var(--toggle-thumb-fill)` |
| hover | `var(--color-background-controls-brand-strong)` | `var(--color-border-brand-base)` | `var(--toggle-thumb-fill)` |
| active | `var(--color-background-controls-brand-stronger)` | `var(--color-border-brand-base)` | `var(--toggle-thumb-fill)` |
| disabled | `var(--color-background-gray-lighter)` | `var(--color-border-brand-base)` | `var(--toggle-thumb-fill)` |

### Off

| State | Background | Border | Text-Icon |
|---|---|---|---|
| default | `var(--color-background-gray-light)` | `var(--color-border-brand-base)` | `var(--toggle-thumb-fill)` |
| hover | `var(--color-background-gray-base)` | `var(--color-border-brand-base)` | `var(--toggle-thumb-fill)` |
| active | `var(--color-background-gray-strong)` | `var(--color-border-brand-base)` | `var(--toggle-thumb-fill)` |
| disabled | `var(--color-background-gray-lighter)` | `var(--color-border-brand-base)` | `var(--toggle-thumb-fill)` |

## States (Dark Theme)

The same semantic variables are used; the dark theme overrides are defined in `components/powerflex-theme.css`.

### On

| State | Background | Border | Text-Icon |
|---|---|---|---|
| default | `var(--color-background-controls-brand-base)` | `var(--color-border-brand-base)` | `var(--toggle-thumb-fill)` |
| hover | `var(--color-background-controls-brand-strong)` | `var(--color-border-brand-base)` | `var(--toggle-thumb-fill)` |
| active | `var(--color-background-controls-brand-stronger)` | `var(--color-border-brand-base)` | `var(--toggle-thumb-fill)` |
| disabled | `var(--color-background-gray-lighter)` | `var(--color-border-brand-base)` | `var(--toggle-thumb-fill)` |

### Off

| State | Background | Border | Text-Icon |
|---|---|---|---|
| default | `var(--color-background-gray-light)` | `var(--color-border-brand-base)` | `var(--toggle-thumb-fill)` |
| hover | `var(--color-background-gray-base)` | `var(--color-border-brand-base)` | `var(--toggle-thumb-fill)` |
| active | `var(--color-background-gray-strong)` | `var(--color-border-brand-base)` | `var(--toggle-thumb-fill)` |
| disabled | `var(--color-background-gray-lighter)` | `var(--color-border-brand-base)` | `var(--toggle-thumb-fill)` |

> **Note:** The sm `off` state node IDs were truncated in the packaged evidence (see Source Mapping). sm dimensions and token values above are consistent with the packaged sm `on` states and the md/lg pattern.

## Interactions

### Behavior & guidelines

- Click or tap the track to toggle `checked`.
- Keyboard: `Space` toggles; `Enter` may submit a containing form. The input must be focusable.
- `disabled` removes pointer events and uses the disabled color row regardless of hover/active intent.
- Hover/Active states are applied while the pointer is over/pressed on the track; disabled overrides both.

### Accessibility

- Use `<input type="checkbox" role="switch" />` so screen readers announce the switch role.
- Provide an accessible label via `<label>` association or `aria-label`.
- `aria-checked` reflects the `checked` boolean.
- `aria-disabled` is set when `disabled` is true.
- Focus ring must be visible on keyboard focus and meet 3:1 contrast.

## Composition & API (runtime)

### Variants

| Variant | Values | Default |
|---|---|---|
| `size` | `sm`, `md`, `lg` | `md` |
| `checked` | `true`, `false` | `false` |
| `disabled` | `true`, `false` | `false` |

### Runtime API

| Prop | Type | Description |
|---|---|---|
| `size` | `"sm" \| "md" \| "lg"` | Visual size |
| `checked` | `boolean` | Controlled on/off state |
| `defaultChecked` | `boolean` | Uncontrolled default |
| `disabled` | `boolean` | Disables interaction |
| `onChange` | `(checked: boolean) => void` | Change callback |
| `aria-label` / `aria-labelledby` | `string` | Accessible name |
| `className` | `string` | Optional outer class |

## Codegen Contract (Framework-Agnostic Blueprint)

### Deterministic structure

- Root: `<label class="toggle toggle--{size} toggle--{checked} toggle--{disabled}">` wrapping a visually hidden `<input type="checkbox" role="switch" />`.
- Visual children (in DOM order):
  1. `.toggle__track` — track background.
  2. `.toggle__thumb` — thumb circle.
  3. `.toggle__focus-ring` — `aria-hidden="true"` focus outline.
- Label text is provided by an associated `<label>` text node or `aria-label`; the toggle itself has no text slot.

### Variant matrix

| `size` | `checked` | `disabled` | Visual state |
|---|---|---|---|
| sm | true | false | on default / hover / active per user interaction |
| sm | false | false | off default / hover / active per user interaction |
| md | true | false | on default / hover / active |
| md | false | false | off default / hover / active |
| lg | true | false | on default / hover / active |
| lg | false | false | off default / hover / active |
| any | any | true | disabled (checked independent, color from disabled row) |

### Per-slot style contract

| Slot | CSS selector | Tokens / styles |
|---|---|---|
| Track | `.toggle__track` | `width`, `height`, `border-radius: var(--toggle-control-radius)`, `background-color` from state matrix |
| Thumb | `.toggle__thumb` | `width`, `height`, `border-radius: var(--toggle-control-radius)`, `background-color: var(--toggle-thumb-fill)`, `transform/left` from `checked` and `--toggle-thumb-offset` |
| Focus ring | `.toggle__focus-ring` | `width = track width + 6 px`, `height = track height + 6 px`, `border-radius: var(--toggle-control-radius)`, `border: 1px solid var(--color-border-brand-base)`, shown on `:focus-within` or forced via `data-focus` |
| Input | `input[type="checkbox"]` | visually hidden but focusable; `opacity: 0; position: absolute;` |

### Behavior contract

- On click/Space, the input toggles; `checked` drives thumb position and track background.
- Hover and active visuals are applied via `:hover` and `:active` (or `data-hover`/`data-active` for deterministic tests).
- Disabled removes `pointer-events` and applies the disabled track color regardless of checked/hover/active intent.
- Focus ring appears when the input has focus; it is not tied to a checked state.

### Accessibility contract

- Render `<input type="checkbox" role="switch" />`.
- Expose `aria-checked` (`true`/`false`) and `aria-disabled` (`true`/`false`).
- Expose `aria-label` or wrap in an associated `<label>` so the switch has an accessible name.
- Focus ring must be visible on keyboard focus (`:focus-visible`/`:focus-within`).

### Asset resolution + bundling contract

- No image assets; all rendering is CSS-driven.
- `components/powerflex-theme.css` must be imported by consuming apps/stories for the semantic variables to resolve.

### Fallback/error rules

- If an unsupported `size` is supplied, fall back to `md`.
- If `checked` and `disabled` are both set, use the disabled token row.
- If the theme CSS is missing, default to the raw light hex values (runtime fallback). This is a defensive fallback only.

### Validation checklist

- [ ] Slot geometry table cites Figma node IDs and `boundVariableHints` for every rounded slot.
- [ ] State matrices use `var(--...)` for Background / Border / Text-Icon.
- [ ] md and lg on/off states map to the four track colors in `specFragments.colors`.
- [ ] Thumb size and track dimensions match the md/lg/sm rows in `slotGeometry`.
- [ ] Focus ring is 6 px wider/taller than the track on each axis.
- [ ] `<input type="checkbox" role="switch" />` is rendered; thumb/track are spans/divs.
- [ ] Theme CSS is loaded and variables resolve.

## Source Mapping

| Source | Path / Key / Node ID |
|---|---|
| Figma file key | `82bDP05ESsiiGe38p5TEQJ` |
| Figma URL | `https://www.figma.com/design/82bDP05ESsiiGe38p5TEQJ/PowerFlex-MCP-Design-System?node-id=2754-109&m=dev` |
| Main component set | `2754:109` |
| Verification method | `Figma REST API` (packaged evidence, `source: figma_rest_enriched`) |
| md on/default | `2754:45` |
| md on/hover | `2754:49` |
| md on/active | `2754:53` |
| md on/disabled | `2754:57` |
| md off/default | `2754:61` |
| md off/hover | `2754:65` |
| md off/active | `2754:69` |
| md off/disabled | `2754:73` |
| md track | `2754:46` |
| md thumb | `2754:47` |
| md focus ring | `2754:48` |
| lg on/default | `2754:77` |
| lg off/default | `2754:93` |
| sm on/default | `2754:13` |
| sm on/hover | `2754:17` |
| sm on/active | `2754:21` |
| sm on/disabled | `2754:25` |
| Note | sm `off` state node IDs were truncated in the packaged evidence; retrieve directly from Figma node `2754:109` when hardening the sm variant. |
