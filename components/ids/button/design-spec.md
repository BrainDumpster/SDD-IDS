# IDS Button Design Spec

## Metadata
- Component: Button
- Design system: IDS
- Category: Formelements
- Spec path: `components/ids/button/design-spec.md`
- Primary Figma URL: https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=41894-116183&m=dev
- Primary node id: `41894:116183`
- States matrix URL: https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=9662-25120&m=dev
- States matrix node id: `9662:25120`
- Figma file key: `0bHk3XhrjFhowgFkz9yLr4`
- Verification method: Figma MCP (`get_design_context`, `get_variable_defs`)
- Verified at: 2026-06-18
## Anatomy
- `ButtonRoot` (interactive control surface; native `button` in web targets)
- `ButtonLabel` (optional for icon-only mode)
- `ButtonLeadingIcon` (optional; icon slug driven)

Deterministic order:
1. `ButtonRoot`
2. optional `ButtonLeadingIcon`
3. optional `ButtonLabel`
## Layout & Measurements
- Control corner radius: `var(--button-control-radius)` (IDS theme resolves to `var(--corner-radius-radius-2)` / 2px).
- Horizontal gap between icon and label: `var(--spacing-space-8)`.
- Horizontal padding (all text and icon-text variants): `16px` left and right.
- Width is content-driven with product-level guidance:
  - minimum width `56px`
  - maximum width `320px`
- Size signatures:
  - `small`: height `24px`, vertical padding `2px`
  - `medium`: height `32px`, vertical padding `6px`
  - `large`: height `40px`, vertical padding `10px`
- Icon-only signatures:
  - `medium`: height `32px`, vertical padding `8px`
  - `large`: height `40px`, vertical padding `12px`
- Icon glyph size: `16px x 16px`.
- Control border (`1px`) is an **inside stroke** and must NOT add to the control's height/width. The size signatures above are total box dimensions, stroke included. Do not use CSS `border` when `box-sizing: border-box` is active globally — render the stroke via `box-shadow: inset` (or `outline`) so heights stay exact.
- Focus ring geometry (focus-visible):
  - outer ring stroke: `var(--border-width-border-1)`
  - ring offset from control edge: `var(--button-focus-ring-offset)`
  - ring corner radius: `var(--button-focus-ring-radius)` (outer ring only; control uses `var(--button-control-radius)`)
  - Render via `::after`, not `outline` — see Implementation Notes → Focus ring for the technique and the offset compensation.
## Tokens
- Typography:
  - `Body 2` (`14/20`, font-weight: `400`) for button text.
### Layout aliases (theme-resolvable)
Programmes override these **same alias names** in programme theme CSS (`components/synapse-theme.css`, `components/dap-theme.css`). Component specs and generated CSS reference aliases only — not programme-specific scale tokens.

| Alias | IDS default (`components/ids-theme.css`) |
|---|---|
| `--button-control-radius` | `var(--corner-radius-radius-2)` |
| `--button-focus-ring-radius` | `var(--corner-radius-radius-4)` |
| `--button-focus-ring-offset` | `2px` |

- Core primary tokens:
  - `var(--color-background-controls-brand-base)`
  - `var(--color-background-controls-brand-strong)`
  - `var(--color-background-controls-brand-stronger)`
  - `var(--color-border-transparent-brand)`
  - `var(--color-text-white)`
- Secondary/tertiary tokens:
  - `var(--color-background-controls-brand-lighter)`
  - `var(--color-background-controls-brand-light)`
  - `var(--color-border-brand-base)`
  - `var(--color-text-brand-strong)`
- Destructive tokens:
  - `var(--color-background-alerting-critical)`
  - `var(--color-background-alerting-critical-strong)`
  - `var(--color-background-alerting-critical-stronger)`
  - `var(--color-border-alerting-transparent-critical)`
- Disabled tokens:
  - `var(--color-background-gray-lighter)`
  - `var(--color-border-disabled)`
  - `var(--color-text-disabled)`
  - `var(--color-icon-disabled)`
- Icon tokens:
  - `var(--color-icon-brand-base)`
  - `var(--color-icon-white)`
## States (Light Theme)
| Variant | State | Background | Border | Text/Icon |
|---|---|---|---|---|
| primary | default | `var(--color-background-controls-brand-base)` | `var(--color-border-transparent-brand)` | `var(--color-text-white)` / `var(--color-icon-white)` |
| primary | hover | `var(--color-background-controls-brand-strong)` | `var(--color-border-transparent-brand)` | `var(--color-text-white)` / `var(--color-icon-white)` |
| primary | press | `var(--color-background-controls-brand-stronger)` | `var(--color-border-transparent-brand)` | `var(--color-text-white)` / `var(--color-icon-white)` |
| primary | disabled | `var(--color-background-gray-lighter)` | `var(--color-border-disabled)` | `var(--color-text-disabled)` / `var(--color-icon-disabled)` |
| primary | focus-visible | same as current interactive base state | control border unchanged + outer brand focus outline | text/icon unchanged |
| secondary | default | transparent | `var(--color-border-brand-base)` | `var(--color-text-brand-strong)` / `var(--color-icon-brand-base)` |
| secondary | hover | `var(--color-background-controls-brand-lighter)` | `var(--color-border-brand-base)` | `var(--color-text-brand-strong)` / `var(--color-icon-brand-base)` |
| secondary | press | `var(--color-background-controls-brand-light)` | `var(--color-border-brand-base)` | `var(--color-text-brand-strong)` / `var(--color-icon-brand-base)` |
| secondary | disabled | transparent | `var(--color-border-disabled)` | `var(--color-text-disabled)` / `var(--color-icon-disabled)` |
| secondary | focus-visible | same as current interactive base state | control border `var(--color-border-brand-base)` + outer brand focus outline | text/icon unchanged |
| tertiary | default | transparent | transparent | `var(--color-text-brand-strong)` / `var(--color-icon-brand-base)` |
| tertiary | hover | `var(--color-background-controls-brand-lighter)` | `var(--color-border-brand-base)` | `var(--color-text-brand-strong)` / `var(--color-icon-brand-base)` |
| tertiary | press | `var(--color-background-controls-brand-light)` | `var(--color-border-brand-base)` | `var(--color-text-brand-strong)` / `var(--color-icon-brand-base)` |
| tertiary | disabled | transparent | transparent | `var(--color-text-disabled)` / `var(--color-icon-disabled)` |
| tertiary | focus-visible | same as current interactive base state | control border by state + outer brand focus outline | text/icon unchanged |
| destructive | default | `var(--color-background-alerting-critical)` | `var(--color-border-alerting-transparent-critical)` | `var(--color-text-white)` / `var(--color-icon-white)` |
| destructive | hover | `var(--color-background-alerting-critical-strong)` | `var(--color-border-alerting-transparent-critical)` | `var(--color-text-white)` / `var(--color-icon-white)` |
| destructive | press | `var(--color-background-alerting-critical-stronger)` | `var(--color-border-alerting-transparent-critical)` | `var(--color-text-white)` / `var(--color-icon-white)` |
| destructive | disabled | `var(--color-background-gray-lighter)` | `var(--color-border-disabled)` | `var(--color-text-disabled)` / `var(--color-icon-disabled)` |
| destructive | focus-visible | same as current interactive base state | control border unchanged + outer brand focus outline | text/icon unchanged |
## States (Dark Theme)
| Variant | State | Background | Border | Text/Icon |
|---|---|---|---|---|
| primary | default | `var(--color-background-controls-brand-base)` | `var(--color-border-transparent-brand)` | `var(--color-text-white)` / `var(--color-icon-white)` |
| primary | hover | `var(--color-background-controls-brand-strong)` | `var(--color-border-transparent-brand)` | `var(--color-text-white)` / `var(--color-icon-white)` |
| primary | press | `var(--color-background-controls-brand-stronger)` | `var(--color-border-transparent-brand)` | `var(--color-text-white)` / `var(--color-icon-white)` |
| primary | disabled | `var(--color-background-gray-lighter)` | `var(--color-border-disabled)` | `var(--color-text-disabled)` / `var(--color-icon-disabled)` |
| primary | focus-visible | same semantic token mapping as light | same semantic token mapping as light | same semantic token mapping as light |
| secondary | default | transparent | `var(--color-border-brand-base)` | `var(--color-text-brand-strong)` / `var(--color-icon-brand-base)` |
| secondary | hover | `var(--color-background-controls-brand-lighter)` | `var(--color-border-brand-base)` | `var(--color-text-brand-strong)` / `var(--color-icon-brand-base)` |
| secondary | press | `var(--color-background-controls-brand-light)` | `var(--color-border-brand-base)` | `var(--color-text-brand-strong)` / `var(--color-icon-brand-base)` |
| secondary | disabled | transparent | `var(--color-border-disabled)` | `var(--color-text-disabled)` / `var(--color-icon-disabled)` |
| secondary | focus-visible | same semantic token mapping as light | same semantic token mapping as light | same semantic token mapping as light |
| tertiary | default | transparent | transparent | `var(--color-text-brand-strong)` / `var(--color-icon-brand-base)` |
| tertiary | hover | `var(--color-background-controls-brand-lighter)` | `var(--color-border-brand-base)` | `var(--color-text-brand-strong)` / `var(--color-icon-brand-base)` |
| tertiary | press | `var(--color-background-controls-brand-light)` | `var(--color-border-brand-base)` | `var(--color-text-brand-strong)` / `var(--color-icon-brand-base)` |
| tertiary | disabled | transparent | transparent | `var(--color-text-disabled)` / `var(--color-icon-disabled)` |
| tertiary | focus-visible | same semantic token mapping as light | same semantic token mapping as light | same semantic token mapping as light |
| destructive | default | `var(--color-background-alerting-critical)` | `var(--color-border-alerting-transparent-critical)` | `var(--color-text-white)` / `var(--color-icon-white)` |
| destructive | hover | `var(--color-background-alerting-critical-strong)` | `var(--color-border-alerting-transparent-critical)` | `var(--color-text-white)` / `var(--color-icon-white)` |
| destructive | press | `var(--color-background-alerting-critical-stronger)` | `var(--color-border-alerting-transparent-critical)` | `var(--color-text-white)` / `var(--color-icon-white)` |
| destructive | disabled | `var(--color-background-gray-lighter)` | `var(--color-border-disabled)` | `var(--color-text-disabled)` / `var(--color-icon-disabled)` |
| destructive | focus-visible | same semantic token mapping as light | same semantic token mapping as light | same semantic token mapping as light |
## Interactions
- Trigger: pointer click, `Enter`, and `Space`.
- `hover` appears on pointer hover for interactive buttons.
- `press` appears while pointer or keyboard activation is held.
- `focus-visible` appears for keyboard modality with an outer brand focus outline.
- Disabled state blocks all interaction and event emission.
- Runtime default must remain interactive.
- Forced state attributes for demo/testing are allowed (`data-state`), but they must not replace runtime interaction logic.
## Composition & API (runtime)
- Suggested runtime component: `IdsButton`.

Inputs:
- `label?: string` (required unless `iconOnly=true`)
- `variant?: "primary" | "secondary" | "tertiary" | "destructive"` (default `primary`)
- `size?: "small" | "medium" | "large"` (default `large`)
- `iconSlug?: string` (optional; user-defined icon slug from `/asset/icons/<slug>.svg`)
- `iconOnly?: boolean` (default `false`)
- `disabled?: boolean` (default `false`)
- `loading?: boolean` (default `false`; if true, interactions are blocked)
- `type?: "button" | "submit" | "reset"` (default `button`)
- `ariaLabel?: string` (required when `iconOnly=true`)
- `name?: string`
- `value?: string`
- `autofocus?: boolean`
- `dataState?: "default" | "hover" | "press" | "focus-visible" | "disabled"` (demo/testing override only)

Outputs / events:
- `onClick(event)` — emitted on successful activation.
- `onFocus(event)` — emitted when focus enters the button.
- `onBlur(event)` — emitted when focus leaves the button.
- `onKeyDown(event)` — emitted on key press while focused.
- `onKeyUp(event)` — emitted on key release while focused.
- `onPressStart(event)` — optional convenience event for press lifecycle.
- `onPressEnd(event)` — optional convenience event for press lifecycle.
## Codegen Contract (Framework-Agnostic Blueprint)
Deterministic structure:
  1. `ButtonRoot`
  2. optional `ButtonLeadingIcon`
  3. optional `ButtonLabel`
Variant matrix:
  - `variant`: `primary | secondary | tertiary | destructive`
  - `size`: `small | medium | large`
  - icon modes: `iconSlug omitted` / `iconSlug present with label` / `iconOnly with iconSlug`
  - states: `default | hover | press | focus-visible | disabled`
- Per-slot style contract:
  - `ButtonRoot`: height, padding, radius, border, background, and typography from tokens and size contract.
  - `ButtonLeadingIcon`: `16x16`. Icon color per variant: primary → `var(--color-icon-white)`; secondary/tertiary → `var(--color-icon-brand-base)`; destructive → `var(--color-icon-white)`; disabled (all variants) → `var(--color-icon-disabled)`. Must render via mask (not `<img>`) so CSS `color` applies.
  - `ButtonLabel`: `Body 2` (`14/20`, font-weight: `400`).
### Theme & programme resolution
- Generators **must** emit component layout aliases (`var(--button-control-radius)`, `var(--button-focus-ring-radius)`, `var(--button-focus-ring-offset)`), never raw `px` or programme-specific scale token names in component CSS.
- Theme selection by programme:
  - IDS → `components/ids-theme.css`
  - Synapse → `components/synapse-theme.css`
  - DAP → `components/dap-theme.css`
- Layer precedence: `program_theme_delta` overrides `ids_theme` (see `generation/component_context_compiler.py`).
- Programme fork specs document **which aliases differ** in the programme deltas table; implementations rely on programme theme CSS — not duplicate alias values in component CSS.
- `ButtonRoot` layout bindings:

| CSS property | Token |
|---|---|
| `border-radius` | `var(--button-control-radius)` |
| focus ring `border-radius` | `var(--button-focus-ring-radius)` |
| focus ring offset | `var(--button-focus-ring-offset)` |
- Behavior contract:
  - `disabled || loading` blocks activation and output events.
  - `iconOnly=true` requires accessible label.
  - `press` state is transient and cleared on pointer/key release.
  - `iconOnly=true` is supported for `medium` and `large` sizes only.
- Accessibility contract:
  - Native `button` semantics.
  - `aria-disabled` mirrors disabled state for non-native fallbacks.
  - Keyboard parity: `Enter` and `Space` activate.
  - Visible `focus-visible` treatment required.
- Asset resolution + bundling:
  - Icon input uses slug: `iconSlug`.
  - Resolve icon from `/asset/icons/<iconSlug>.svg`.
  - Unknown slug fallback: hide icon slot and continue rendering label.
- Fallback/error rules:
  - Unknown `variant` -> `primary`.
  - Unknown `size` -> `large`.
  - `iconOnly=true` and missing `ariaLabel` -> validation error.
  - `iconOnly=true` and missing `iconSlug` -> validation error.
  - `iconOnly=true` with `size=small` -> validation error (or coerce to `medium` only if product explicitly enables coercion).
- Validation checklist:
  - [ ] All variant x size x state combinations resolve tokenized styles.
  - [ ] Layout uses component aliases (`--button-control-radius`, etc.), not hardcoded px.
  - [ ] Aliases defined in `components/ids-theme.css` and documented in Tokens.
  - [ ] Programme fork deltas list alias overrides when values differ (Synapse/DAP).
  - [ ] Icon slug path resolution works and gracefully handles missing slugs.
  - [ ] Disabled/loading modes prevent output events.
  - [ ] Keyboard and pointer activation parity is preserved.
  - [ ] Light/Dark tables remain structurally parallel.

## Storybook proof & codegen consumers

**Spec Generated** stories in this repo prove that `design-spec.md` is machine-consumable: generators and humans must be able to produce components that match **Layout & Measurements**, **Tokens**, **States**, and **Codegen Contract** without guessing. Downstream codegen must:

1. Read this spec (and layered root/theme for program deltas) as the single source of truth.
2. Emit styles **only** via semantic `var(--...)` from the correct theme file: **`components/ids-theme.css`** for IDS, **`components/dap-theme.css`** for DAP (do not mix program themes in one bundle).
3. Keep the reference implementation (`storybook/src/components/...`) aligned with the spec when discrepancies are found (stories validate the contract; drift is a spec or implementation bug).

Root Storybook **Spec Generated** includes **IDS** and **DAP** only.

### Icon Implementation Details (Spec Generated Stories)

The spec-generated Button stories (`storybook-generated/ids/src/components/Button.stories.tsx`) implement icons with the following configuration:

- **Icon asset**: All icons use `assets/icons/settings-gear-detailed.svg`
- **Icon variant**: All icons use `variant="mask"` (mask-based coloring)
- **Color token mapping**:
  - `primary` variant (default/hover/press states): `var(--color-icon-white)`
  - `secondary` variant (default/hover/press states): `var(--color-icon-brand-base)`
  - `tertiary` variant (default/hover/press states): `var(--color-icon-brand-base)`
  - All variants (disabled state): `var(--color-icon-disabled)`

This implementation aligns with the **States (Light Theme)** and **States (Dark Theme)** tables above, which specify icon colors per variant and state.

## Source Mapping
- Component map entry: `data/component-figma-map.json` -> `Button`.
- Primary node: `41894:116183` (IDS library button board).
- States matrix node: `9662:25120` (style x state x size matrix evidence).
- Figma MCP calls used:
  - `get_design_context(fileKey=0bHk3XhrjFhowgFkz9yLr4,nodeId=41894:116183)`
  - `get_design_context(fileKey=0bHk3XhrjFhowgFkz9yLr4,nodeId=9662:25120)`
  - `get_variable_defs(fileKey=0bHk3XhrjFhowgFkz9yLr4,nodeId=41894:116183)`
  - `get_variable_defs(fileKey=0bHk3XhrjFhowgFkz9yLr4,nodeId=9662:25120)`
### Storybook proof and codegen consumers

**Spec Generated** stories in this repo prove that `design-spec.md` is machine-consumable: generators and humans must be able to produce components that match **Layout & Measurements**, **Tokens**, **States**, and **Codegen Contract** without guessing. Downstream codegen must:

1. Read this spec (and layered root/theme for program deltas) as the single source of truth.
2. Emit styles **only** via semantic `var(--...)` from the correct theme file: **`components/ids-theme.css`** for IDS, **`components/dap-theme.css`** for DAP (do not mix program themes in one bundle).
3. Keep the reference implementation (`storybook/src/components/...`) aligned with the spec when discrepancies are found (stories validate the contract; drift is a spec or implementation bug).

Root Storybook **Spec Generated** includes **IDS** and **DAP** only.

## Implementation Notes

**Typography**
- **Label font-weight**: `400` — do NOT use `500`; `Body 2` spec is `14/20` at weight `400`.

**Icon color**
- **Primary button icon**: `var(--color-icon-white)` — do NOT use `var(--color-icon-brand-base)`.
- **Secondary, tertiary, and icon-only button icon**: `var(--color-icon-brand-base)` — do NOT use `var(--color-icon-white)`.

**Icon rendering**
- **Icon slot must use mask rendering**: render `iconSlug` via `Icon` component with `variant="mask"` so CSS `color` tokens tint the icon. An `<img>` tag ignores `color` and will break icon color for all variants.

**Control border (added 2026-07-17)**
- The `1px` control border is an **inside stroke** — render it with `box-shadow: inset 0 0 0 var(--border-width-border-1) <color>` (or `outline`), never CSS `border`. Under the global `box-sizing: border-box`, a real `border` adds `+2px` to every size.
- On focus, `tertiary` keeps its control border **by state** (transparent in the default state) — only the outer ring is blue. Do not force a brand-base inner border on `tertiary` focus (secondary's base already has one; tertiary's does not).

**Focus ring (added 2026-07-21)**
- Corrected to match Figma: IDS `--button-focus-ring-offset` `3px` → `2px`, and the ring corner radius now resolves to `--button-focus-ring-radius` (`4px`) instead of following the `2px` control radius.
- Don't use CSS `outline` (it inherits the control's `border-radius`, but the ring radius must differ). Render the ring as an absolutely-positioned `::after` (`outline: none` on the control) with `border` + `border-radius: var(--button-focus-ring-radius)`.
- Offset: `inset: calc(-1 * (var(--button-focus-ring-offset) + var(--border-width-border-1)))`. The `+ border-width` is needed because `::after`'s `inset` positions the ring's **outer** edge (the `border` draws inward), whereas the offset is defined as the gap to the ring's **inner** edge. Plain `-offset` leaves the gap short by 1px. (With `outline` this compensation wasn't needed — `outline-offset` measures to the inner edge directly — but `outline` can't carry its own radius, hence `::after`.)
