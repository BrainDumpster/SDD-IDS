# Toggle — PowerFlex

## Metadata

| Property | Value |
|---|---|
| Component | Toggle |
| Slug | `toggle` |
| Programme | PowerFlex |
| Status | `draft` |
| Spec pattern | `standalone` |
| Version | 1.0.0 |
| Created | 2026-08-05 |
| Updated | 2026-08-05 |
| Theme CSS | `components/powerflex-theme.css` |
| Verification | Figma REST API (`figma_rest_enriched`) |
| Evidence date | 2026-08-05 |

## Anatomy

A `Toggle` is a binary on/off control. It is composed of the following slots:

1. **Track** — the pill-shaped background that communicates the checked state.
2. **Thumb** — the circular knob that slides to the `on` or `off` side of the track.
3. **Focus ring** — a 1px outline shown when the control has keyboard focus.

No text label is part of the Figma component set; consumers supply an external label and bind it with `aria-labelledby` or `aria-label`.

## Layout & Measurements

### Component set

| Layer | Type | Width | Height | Item spacing | Layout mode | Figma node |
|---|---|---|---|---|---|---|
| `toggle` | COMPONENT_SET | 313px | 728px | 8px | VERTICAL | `2754:109` |

### Per-size dimensions

| Size | Track (w×h) | Thumb (w×h) | Focus ring (w×h) | Thumb inset |
|---|---|---|---|---|
| `sm` | 32px × 16px | 12px × 12px | 38px × 22px | 2px |
| `md` | 44px × 24px | 20px × 20px | 50px × 30px | 2px |
| `lg` | 52px × 28px | 24px × 24px | 58px × 34px | 2px |

The thumb is centered vertically inside the track with a 2px inset on both sides in the resting position; the `on` state translates the thumb horizontally by `track-width - thumb-width - 4px`.

### Slot geometry (Figma-verified)

| Slot / layer | Property | Token / contract | Figma value | Figma node | Live evidence |
|---|---|---|---|---|---|
| `toggle` (component set) | `border-radius` | `var(--corner-radius-radius-4)` | 5.0px | `2754:109` | `get_design_context` cornerRadius=5.0 |
| `track` | `border-radius` | `var(--corner-radius-radius-round)` | 9999.0px | `2754:46` | `boundVariableHint` `VariableID:2453:26`; `get_variable_defs` export did not resolve a name for this binding |
| `thumb` | `border-radius` | `var(--corner-radius-radius-round)` | 9999.0px | `2754:47` | `boundVariableHint` `VariableID:2453:4`; `get_variable_defs` export did not resolve a name for this binding |
| `focus-ring` | `border-radius` | `var(--corner-radius-radius-round)` | 9999.0px | `2754:48` | `boundVariableHint` `VariableID:2453:30`; `get_variable_defs` export did not resolve a name for this binding |
| `track` (off default md) | `border-color` bound variable | `var(--color-border/default)` — inferred from `VariableID:2453:8` (`color/border/default`) | n/a | `2754:62` | `get_variable_defs` `VariableID:2453:8` → `color/border/default` |

## Tokens

### Color tokens (PowerFlex semantic)

| Token | Light theme value | Dark theme value | Source |
|---|---|---|---|
| `--color-background-controls-brand-base` | `#0076ce` | `#4c9ede` | PowerFlex theme CSS override of IDS semantic token |
| `--color-background-controls-brand-strong` | `#005da4` | `#3a8bc7` | PowerFlex theme CSS override |
| `--color-background-controls-brand-stronger` | `#00447c` | `#2a6fa3` | PowerFlex theme CSS override |
| `--color-border-brand-base` | `#0076ce` | `#4c9ede` | PowerFlex theme CSS override |
| `--color-border-brand-dark` | `#005da4` | `#3a8bc7` | PowerFlex theme CSS override |
| `--color-background-gray-light` | `#eeeeee` | `#4d4d4d` | PowerFlex theme CSS override |
| `--color-background-gray-base` | `#888888` | `#9e9e9e` | PowerFlex theme CSS override |
| `--color-background-gray-strong` | `#333333` | `#b8c1c9` | PowerFlex theme CSS override |
| `--color-background-gray-lighter` | `#f4f4f4` | `#393939` | PowerFlex theme CSS override |
| `--color-background-white` | `#ffffff` | `#ffffff` | IDS / PowerFlex theme CSS |

### Layout tokens

| Token | Value | Figma basis |
|---|---|---|
| `--toggle-control-radius` | `var(--corner-radius-radius-round)` | track / thumb / focus-ring `borderRadius=9999.0` |
| `--toggle-focus-ring-offset` | 3px | focus-ring is 6px larger than track on each axis |
| `--toggle-thumb-offset` | 2px | thumb inset from track edge in `off` position |

## States (Light Theme)

| State | Checked | `Background` (track) | `Border` (focus-ring) | `Text/Icon` (thumb) |
|---|---|---|---|---|
| `default` | `on` | `var(--color-background-controls-brand-base)` `#0076ce` | `var(--color-border-brand-base)` `#0076ce` | `var(--color-background-white)` `#ffffff` |
| `hover` | `on` | `var(--color-background-controls-brand-strong)` `#005da4` | `var(--color-border-brand-dark)` `#005da4` | `var(--color-background-white)` `#ffffff` |
| `active` / `press` | `on` | `var(--color-background-controls-brand-stronger)` `#00447c` | `var(--color-border-brand-dark)` `#005da4` | `var(--color-background-white)` `#ffffff` |
| `disabled` | `on` | `var(--color-background-gray-lighter)` `#f4f4f4` | `var(--color-border-brand-base)` `#0076ce` | `var(--color-background-white)` `#ffffff` |
| `default` | `off` | `var(--color-background-gray-light)` `#eeeeee` | `var(--color-border-brand-base)` `#0076ce` | `var(--color-background-white)` `#ffffff` |
| `hover` | `off` | `var(--color-background-gray-base)` `#888888` | `var(--color-border-brand-base)` `#0076ce` | `var(--color-background-white)` `#ffffff` |
| `active` / `press` | `off` | `var(--color-background-gray-strong)` `#333333` | `var(--color-border-brand-base)` `#0076ce` | `var(--color-background-white)` `#ffffff` |
| `disabled` | `off` | `var(--color-background-gray-lighter)` `#f4f4f4` | `var(--color-border-brand-base)` `#0076ce` | `var(--color-background-white)` `#ffffff` |

## States (Dark Theme)

| State | Checked | `Background` (track) | `Border` (focus-ring) | `Text/Icon` (thumb) |
|---|---|---|---|---|
| `default` | `on` | `var(--color-background-controls-brand-base)` `#4c9ede` | `var(--color-border-brand-base)` `#4c9ede` | `var(--color-background-white)` `#ffffff` |
| `hover` | `on` | `var(--color-background-controls-brand-strong)` `#3a8bc7` | `var(--color-border-brand-dark)` `#3a8bc7` | `var(--color-background-white)` `#ffffff` |
| `active` / `press` | `on` | `var(--color-background-controls-brand-stronger)` `#2a6fa3` | `var(--color-border-brand-dark)` `#3a8bc7` | `var(--color-background-white)` `#ffffff` |
| `disabled` | `on` | `var(--color-background-gray-lighter)` `#393939` | `var(--color-border-brand-base)` `#4c9ede` | `var(--color-background-white)` `#ffffff` |
| `default` | `off` | `var(--color-background-gray-light)` `#4d4d4d` | `var(--color-border-brand-base)` `#4c9ede` | `var(--color-background-white)` `#ffffff` |
| `hover` | `off` | `var(--color-background-gray-base)` `#9e9e9e` | `var(--color-border-brand-base)` `#4c9ede` | `var(--color-background-white)` `#ffffff` |
| `active` / `press` | `off` | `var(--color-background-gray-strong)` `#b8c1c9` | `var(--color-border-brand-base)` `#4c9ede` | `var(--color-background-white)` `#ffffff` |
| `disabled` | `off` | `var(--color-background-gray-lighter)` `#393939` | `var(--color-border-brand-base)` `#4c9ede` | `var(--color-background-white)` `#ffffff` |

## Interactions

### Behavior & guidelines

- Clicking anywhere on the track toggles the `checked` state.
- Keyboard `Space` or `Enter` toggles the state when focus is on the control.
- `Tab` moves focus to / from the toggle.
- The thumb animates horizontally between the `off` and `on` positions. Duration and easing are left to the implementation; the design contract is the start/end geometry.
- Disabled toggles do not respond to click, keyboard, or hover state changes and use a `not-allowed` cursor.

### Accessibility

- Role: `switch`.
- `aria-checked` must reflect the current state (`true` / `false`).
- The control must expose an accessible name via `aria-label` or `aria-labelledby`.
- Focus ring must be visible for keyboard focus only (`:focus-visible`).

## Composition & API (runtime)

### Variants

| Variant | Values | Default |
|---|---|---|
| `size` | `sm`, `md`, `lg` | `md` |
| `checked` | `boolean` | `false` |
| `disabled` | `boolean` | `false` |

### Runtime API

| Prop / attribute | Type | Default | Description |
|---|---|---|---|
| `checked` | `boolean` | `false` | Current on/off state. |
| `onChange` | `(checked: boolean) => void` | — | Called when the state changes. |
| `disabled` | `boolean` | `false` | Renders the disabled visual state and blocks interaction. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Visual size variant. |
| `aria-label` / `aria-labelledby` | `string` | — | Accessible name for the toggle. |

## Codegen Contract (Framework-Agnostic Blueprint)

### Deterministic structure

The generated component must render, at minimum:

```html
<div class="powerflex-toggle" data-size="md" data-checked="true" data-disabled="false">
  <span class="powerflex-toggle__track"></span>
  <span class="powerflex-toggle__thumb"></span>
  <span class="powerflex-toggle__focus-ring" aria-hidden="true"></span>
</div>
```

Classes must be stable. Framework-specific wrappers (React, Angular, Vue, Lit) may add attributes but must preserve the slot class names.

### Variant matrix

| Variant combination | Render flags | Geometry source |
|---|---|---|
| `size=sm`, `checked=false` | `data-size="sm" data-checked="false"` | `toggle` sm track/thumb/focus-ring nodes |
| `size=sm`, `checked=true` | `data-size="sm" data-checked="true"` | same; thumb translated |
| `size=md`, `checked=false` | `data-size="md" data-checked="false"` | `State=default, Checked=off, Size=md` (`2754:61`) |
| `size=md`, `checked=true` | `data-size="md" data-checked="true"` | `State=default, Checked=on, Size=md` (`2754:45`) |
| `size=lg`, `checked=false` | `data-size="lg" data-checked="false"` | `State=default, Checked=off, Size=lg` |
| `size=lg`, `checked=true` | `data-size="lg" data-checked="true"` | `State=default, Checked=on, Size=lg` |
| `disabled=true` | `data-disabled="true"` | disabled variants in the component set |

### Per-slot style contract

| Slot | CSS selectors | Required declarations |
|---|---|---|
| `track` | `.powerflex-toggle__track` | `width`, `height`, `border-radius: var(--toggle-control-radius)`, `background` from state matrix |
| `thumb` | `.powerflex-toggle__thumb` | `width`, `height`, `border-radius: var(--toggle-control-radius)`, `background: var(--color-background-white)`, `transform: translateX(...)` based on `checked` and size |
| `focus-ring` | `.powerflex-toggle__focus-ring` | `position: absolute`, sized +6px around track, `border: 1px solid var(--color-border-brand-base)`, `border-radius: var(--toggle-control-radius)`, shown only on `:focus-visible` |

### Behavior contract

- Toggle state changes only through user-initiated click, `Space`, or `Enter`.
- `onChange` must emit the new `checked` value.
- Disabled state prevents state changes and suppresses hover/active styles.
- Focus ring must not appear on pointer interaction unless the platform uses `:focus-visible` for pointer focus.

### Accessibility contract

- The root element must have `role="switch"`.
- The root element must expose `aria-checked`.
- An accessible name is required (`aria-label` or `aria-labelledby`).
- Keyboard interaction follows the switch pattern: `Space` toggles, `Tab` moves focus.

### Asset resolution + bundling contract

- No image assets are required; the toggle is rendered entirely with CSS geometry and semantic tokens.
- Theme CSS `components/powerflex-theme.css` must be imported by any Storybook or application entry that renders the component.

### Fallback/error rules

- If an unsupported `size` is supplied, fall back to `md`.
- If `aria-label` and `aria-labelledby` are both missing, the generator must emit a lint warning and supply a default `aria-label="Toggle"`.
- If theme CSS is not loaded, the component renders using browser defaults; generators should warn at build time when the design system CSS import is missing.

### Validation checklist

- [ ] `border-radius` on `track`, `thumb`, and `focus-ring` uses `var(--toggle-control-radius)` / `var(--corner-radius-radius-round)`.
- [ ] Light and Dark state tables are structurally parallel and use `var(--...)` values.
- [ ] `aria-checked` is bound to the component state.
- [ ] Keyboard `Space` toggles state.
- [ ] Disabled state blocks interaction and uses `var(--color-background-gray-lighter)` for the track.
- [ ] Storybook story set imports `components/powerflex-theme.css` and renders `sm`, `md`, `lg`, checked, and disabled states.

## Source Mapping

| Source | Key / ID | URL / Method |
|---|---|---|
| Figma file | `82bDP05ESsiiGe38p5TEQJ` | [PowerFlex MCP Design System — toggle](https://www.figma.com/design/82bDP05ESsiiGe38p5TEQJ/PowerFlex-MCP-Design-System?node-id=2754-109&m=dev) |
| Main component set node | `2754:109` | Figma REST API `get_metadata` / `get_design_context` |
| State nodes (md) | `2754:45` (on default), `2754:49` (on hover), `2754:53` (on active), `2754:57` (on disabled), `2754:61` (off default), `2754:65` (off hover), `2754:69` (off active), `2754:73` (off disabled) | Figma REST API `get_design_context` |
| Element nodes | `2754:46` / `2754:50` / `2754:54` / `2754:58` / `2754:62` / `2754:66` / `2754:70` / `2754:74` (track), `2754:47` / `2754:51` / `2754:55` / `2754:59` / `2754:63` / `2754:67` / `2754:71` / `2754:75` (thumb), `2754:48` / `2754:52` / `2754:56` / `2754:60` / `2754:64` / `2754:68` / `2754:72` / `2754:76` (focus-ring) | Figma REST API `get_metadata` structure |
| Verification method | `Figma REST API` | `verificationMethod` in packaged evidence; no client MCP call |
