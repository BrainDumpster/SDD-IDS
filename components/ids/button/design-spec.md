# IDS Button Design Spec

## Metadata
- Component: Button
- Design system: IDS
- Category: Formelements
- Spec path: `components/ids/button/design-spec.md`
- Status: active
- Primary Figma URL: https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=41894-116123&m=dev
- Primary node id: `41894:116123` (Button documentation board)
- States matrix URL: https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=9662-25120&m=dev
- States matrix node id: `9662:25120` (text Button component set — Type × State × Size)
- Focus state reference URL: https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=9662-25507&m=dev
- Focus state node id: `9662:25507` (text Button Primary Large Focus — hover fill + dual drop-shadow rings)
- Figma file key: `0bHk3XhrjFhowgFkz9yLr4`
- Verification method: Figma MCP (`get_metadata`, `get_variable_defs`, `use_figma` Plugin API)
- Verified at: 2026-10-16 (text Button press/hover/disabled/focus nodes); Icon Button extracted to `components/ids/icon-button/design-spec.md` on 2026-11-04
- Sibling Icon Button spec: `components/ids/icon-button/design-spec.md` (icon-only square control; set `52172:249499`)

## Anatomy
- `ButtonRoot` (interactive control surface; native `button` in web targets)
- `ButtonLabel` (required for text / icon+text modes)
- `ButtonLeadingIcon` (optional; toggled by Figma `Show Icon` / runtime projection or `iconSlug`)

Deterministic order:
1. `ButtonRoot`
2. optional `ButtonLeadingIcon`
3. `ButtonLabel`

Figma component properties (text Button set `9662:25120`):
- `Show Icon` (BOOLEAN, default `false`) — controls leading-icon visibility
- `Select Icon` (INSTANCE_SWAP) — swaps the leading icon instance
- Variant axes: `Type` × `State` × `Size`
- **Destructive** variants have no leading-icon slot in Figma (do not render `ButtonLeadingIcon` for `destructive`)

## Layout & Measurements
- Control corner radius: `var(--button-control-radius)` (IDS theme resolves to `var(--corner-radius-radius-2)` / 2px).
- Horizontal gap between icon and label: `var(--spacing-space-8)`.
- Horizontal padding (text and icon+text modes): `16px` left and right.
- Width is content-driven with product-level guidance:
  - minimum width `56px` (text / icon+text)
  - maximum width `320px` (text / icon+text)
- Size signatures (text / icon+text):
  - `small`: height `24px`, vertical padding `2px`
  - `medium`: height `32px`, vertical padding `6px`
  - `large`: height `40px`, vertical padding `10px`
- Icon+text glyph size: `16px × 16px` (all sizes).
- Control border (`1px` / `Border Width/border-default`) is an **inside stroke** and must NOT add to the control's height/width. Render via `box-shadow: inset` (not CSS `border` under global `border-box`).
- Focus ring geometry (focus-visible) — **dual drop shadows** on `ButtonRoot` (not `::after`, not `outline`). Use **Figma tokens only** (no invented `--button-focus-*` aliases):
  - Inner gap ring spread: `var(--scale-2)` — Figma `Focus Drop Shadow/Spread/Inner Ring` → `Scale/2`
  - Outer brand ring spread: `var(--scale-4)` — Figma `Focus Drop Shadow/Spread/Outer Ring` → `Scale/4`
  - Gap paint: `var(--color-border-gray-white)` — Figma `Color/Border/Focus/Ring 1` resolves to **White** in light (Figma WEB codeSyntax on Ring 1 incorrectly says `brand-base`; do not follow that for the gap)
  - Outer paint: `var(--color-border-brand-base)` — Figma `Color/Border/Focus/Ring 2`
  - Rings follow the control corner radius; legacy Figma `focus` rectangle layer is **hidden** — do not implement it

### Slot geometry (Figma-verified)

| Slot / layer | Property | Token / contract | Figma node | Live evidence |
| --- | --- | --- | --- | --- |
| `ButtonRoot` | `border-radius` | `var(--button-control-radius)` → `var(--corner-radius-radius-2)` (**2px**) | `9662:25507` | text Button Primary Large Focus family; `Corner Radius/radius-2` |
| Focus rings | inner spread | `var(--scale-2)` (**2px**) | `9662:25507` | `Focus Drop Shadow/Spread/Inner Ring` → `Scale/2` |
| Focus rings | outer spread | `var(--scale-4)` (**4px**) | `9662:25507` | `Focus Drop Shadow/Spread/Outer Ring` → `Scale/4` |
| Focus rings | gap color | `var(--color-border-gray-white)` | `9662:25507` | Inner DROP_SHADOW → `Color/Border/Focus/Ring 1` → White |
| Focus rings | outer color | `var(--color-border-brand-base)` | `9662:25507` | Outer DROP_SHADOW → `Color/Border/Focus/Ring 2` |

**Geometry authoring rules (mandatory):**
- Focus is **dual drop shadows** stacked with the inset control stroke on `box-shadow` (inset stroke first, then gap ring, then outer ring).
- Do **not** use `::after` / `outline` for the IDS Button focus ring.
- Do **not** invent component-prefixed CSS variables for focus (`--button-focus-ring-*`). Bind to Figma-synced tokens (`--scale-*`, `--color-border-*`, `--corner-radius-*`).
- Icon-only square geometry lives in `components/ids/icon-button/design-spec.md` — do not document it here.

## Tokens
- Typography:
  - `Body 2` (`14/20`, font-weight: `400`) for button text.
### Layout aliases (theme-resolvable)
Only programme-overridable control shell radius uses a component alias. Focus geometry uses Figma tokens directly.

| Alias / token | IDS default / Figma source |
|---|---|
| `--button-control-radius` | `var(--corner-radius-radius-2)` — Figma `Corner Radius/radius-2` (programme override point only) |
| Focus inner spread | `var(--scale-2)` — Figma `Scale/2` |
| Focus outer spread | `var(--scale-4)` — Figma `Scale/4` |
| Focus gap paint | `var(--color-border-gray-white)` — Figma Ring 1 → White |
| Focus outer paint | `var(--color-border-brand-base)` — Figma Ring 2 |

- Core primary tokens:
  - `var(--color-background-controls-base)`
  - `var(--color-background-controls-strong)`
  - `var(--color-background-controls-stronger)`
  - `var(--color-border-brand-transparent-brand)`
  - `var(--color-text-gray-white)`
- Secondary/tertiary tokens:
  - `var(--color-background-controls-light)` (hover/focus-visible fill)
  - `var(--color-background-controls-press)` (**press** fill) — Figma Press binds a *second* `Background/Controls/light` variable sharing the same codeSyntax; it resolves one step darker (`brand-300` / `#97c4e9` vs hover `brand-200` / `#daeaf7`). The IDS theme exposes the press-step as `--color-background-controls-press` since CSS cannot express the duplicate binding.
  - `var(--color-border-brand-base)`
  - `var(--color-border-brand-strong)` (text Button secondary **press** only)
  - `var(--color-text-brand-strong)`
- Destructive tokens:
  - `var(--color-background-alerting-critical-base)`
  - `var(--color-background-alerting-critical-strong)`
  - `var(--color-background-alerting-critical-stronger)`
  - `var(--color-border-alerting-critical-transparent-base)`
- Disabled tokens:
  - `var(--color-background-gray-lighter)`
  - `var(--color-border-gray-disabled)`
  - `var(--color-text-gray-disabled)`
  - `var(--color-icon-gray-disabled)`
- Icon tokens (leading icon on text / icon+text):
  - `var(--color-icon-gray-white)` (Primary)
  - `var(--color-icon-brand-base)` (Secondary/Tertiary leading icon)
  - `var(--color-icon-gray-disabled)` (Disabled)

## States (Light Theme)
| Variant | State | Background | Border | Text/Icon |
|---|---|---|---|---|
| primary | default | `var(--color-background-controls-base)` | `var(--color-border-brand-transparent-brand)` | `var(--color-text-gray-white)` / `var(--color-icon-gray-white)` |
| primary | hover | `var(--color-background-controls-strong)` | `var(--color-border-brand-transparent-brand)` | `var(--color-text-gray-white)` / `var(--color-icon-gray-white)` |
| primary | press | `var(--color-background-controls-stronger)` | `var(--color-border-brand-transparent-brand)` | `var(--color-text-gray-white)` / `var(--color-icon-gray-white)` |
| primary | disabled | `var(--color-background-gray-lighter)` | `var(--color-border-gray-disabled)` | `var(--color-text-gray-disabled)` / `var(--color-icon-gray-disabled)` |
| primary | focus-visible | `var(--color-background-controls-strong)` (same as hover) | control border unchanged + dual focus rings | text/icon unchanged |
| secondary | default | transparent | `var(--color-border-brand-base)` | `var(--color-text-brand-strong)` / `var(--color-icon-brand-base)` |
| secondary | hover | `var(--color-background-controls-light)` | `var(--color-border-brand-base)` | `var(--color-text-brand-strong)` / `var(--color-icon-brand-base)` |
| secondary | press | `var(--color-background-controls-press)` (press-step; Figma duplicate `controls-light` binding → `brand-300`) | `var(--color-border-brand-strong)` | `var(--color-text-brand-strong)` / `var(--color-icon-brand-base)` |
| secondary | disabled | transparent | `var(--color-border-gray-disabled)` | `var(--color-text-gray-disabled)` / `var(--color-icon-gray-disabled)` |
| secondary | focus-visible | `var(--color-background-controls-light)` (same as hover) | `var(--color-border-brand-base)` + dual focus rings | text/icon same as hover |
| tertiary | default | transparent | transparent | `var(--color-text-brand-strong)` / `var(--color-icon-brand-base)` |
| tertiary | hover | `var(--color-background-controls-light)` | transparent | `var(--color-text-brand-strong)` / `var(--color-icon-brand-base)` |
| tertiary | press | `var(--color-background-controls-press)` (press-step; Figma duplicate `controls-light` binding → `brand-300`) | transparent | `var(--color-text-brand-strong)` / `var(--color-icon-brand-base)` |
| tertiary | disabled | transparent | transparent | `var(--color-text-gray-disabled)` / `var(--color-icon-gray-disabled)` |
| tertiary | focus-visible | `var(--color-background-controls-light)` (same as hover) | transparent + dual focus rings | text/icon same as hover |
| destructive | default | `var(--color-background-alerting-critical-base)` | `var(--color-border-alerting-critical-transparent-base)` | `var(--color-text-gray-white)` / n/a (no icon slot) |
| destructive | hover | `var(--color-background-alerting-critical-strong)` | `var(--color-border-alerting-critical-transparent-base)` | `var(--color-text-gray-white)` / n/a |
| destructive | press | `var(--color-background-alerting-critical-stronger)` | `var(--color-border-alerting-critical-transparent-base)` | `var(--color-text-gray-white)` / n/a |
| destructive | disabled | `var(--color-background-gray-lighter)` | `var(--color-border-gray-disabled)` | `var(--color-text-gray-disabled)` / n/a |
| destructive | focus-visible | `var(--color-background-alerting-critical-strong)` (same as hover) | control border unchanged + dual focus rings | text unchanged |

Notes:
- `destructive` is **text / icon+text only** (no leading-icon slot in Figma).
- Icon-only / Ghost Neutral variants belong to `components/ids/icon-button/design-spec.md` — not this component set.

## States (Dark Theme)
Same semantic `var(--...)` names as **States (Light Theme)** for every row. Resolved dark values live in `components/ids-theme.css` under `[data-theme="dark"]` / `.ids-theme-dark`. Do not duplicate the matrix here unless a dark row uses a different `var(--...)` name.

## Interactions
- Trigger: pointer click, `Enter`, and `Space`.
- `hover` appears on pointer hover for interactive buttons.
- `press` appears while pointer or keyboard activation is held.
- `focus-visible` uses **hover fill** + dual drop-shadow focus rings (keyboard / forced `data-state`).
- Disabled state blocks all interaction and event emission (no focus rings while disabled).
- Runtime default must remain interactive.
- Forced state attributes for demo/testing are allowed (`data-state`), but they must not replace runtime interaction logic.
- Forced `data-state="disabled"` must resolve the same disabled styling as native `:disabled` (selectors must cover both).

## Composition & API (runtime)
- Suggested runtime component: `IdsButton`.
- Icon-only controls use `IdsIconButton` — see `components/ids/icon-button/design-spec.md`.

Inputs:
- `label?: string` (required unless label is projected via `IdsButtonLabel` / default slot)
- `variant?: "primary" | "secondary" | "tertiary" | "destructive"` (default `primary`)
- `size?: "small" | "medium" | "large"` (default `large`)
- `iconSlug?: string` (optional; maps to Figma `Select Icon` / `/asset/icons/<slug>.svg` for leading icon)
- `showIcon?: boolean` (optional convenience; when false, hide leading icon even if projected/`iconSlug` present — Figma `Show Icon` default false)
- `disabled?: boolean` (default `false`)
- `loading?: boolean` (default `false`; if true, interactions are blocked)
- `type?: "button" | "submit" | "reset"` (default `button`)
- `ariaLabel?: string` (optional accessible name override when visible label is insufficient)
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
### Deterministic structure
  1. `ButtonRoot`
  2. optional `ButtonLeadingIcon`
  3. `ButtonLabel`
### Variant matrix
  - `variant`: `primary | secondary | tertiary | destructive`
  - `size`: `small | medium | large`
  - icon modes: label-only / icon+label (`Show Icon`)
  - states: `default | hover | press | focus-visible | disabled`
  - constraints: `destructive` ⇒ no leading icon; icon-only is **out of scope** (use Icon Button)
### Per-slot style contract
  - `ButtonRoot`: height/padding, radius, inset border, background, typography from tokens and size contract; focus via dual drop-shadow rings.
  - `ButtonLeadingIcon`: icon+text `16×16`. Colors per States table. Mask rendering required.
  - `ButtonLabel`: `Body 2` (`14/20`, font-weight: `400`).
### Theme & programme resolution
- Generators **must** emit Figma tokens for focus: `var(--scale-2)`, `var(--scale-4)`, `var(--color-border-gray-white)`, `var(--color-border-brand-base)`.
- Control radius may use programme alias `var(--button-control-radius)` (defaults to `var(--corner-radius-radius-2)`).
- Theme selection by programme:
  - IDS → `components/ids-theme.css`
  - Synapse → `components/synapse-theme.css`
  - DAP → `components/dap-theme.css`
- Layer precedence: `program_theme_delta` overrides `ids_theme`.

| CSS property | Token |
|---|---|
| `border-radius` | `var(--button-control-radius)` → `var(--corner-radius-radius-2)` |
| focus gap ring spread | `var(--scale-2)` |
| focus outer ring spread | `var(--scale-4)` |
| focus gap ring color | `var(--color-border-gray-white)` |
| focus outer ring color | `var(--color-border-brand-base)` |
### Behavior contract
  - `disabled || loading` blocks activation and output events.
  - `press` state is transient and cleared on pointer/key release.
  - Missing `label` (and no projected label) → validation error.
### Accessibility contract
  - Native `button` semantics.
  - Visible label preferred; `ariaLabel` / `aria-label` when the visible text is insufficient.
  - `aria-disabled` mirrors disabled state for non-native fallbacks.
  - Keyboard parity: `Enter` and `Space` activate.
  - Visible `focus-visible` treatment required (dual rings).
### Asset resolution + bundling contract
  - Icon input uses slug: `iconSlug`.
  - Resolve icon from `/asset/icons/<iconSlug>.svg`.
  - Unknown slug fallback: hide icon slot and continue rendering label.
### Fallback/error rules
  - Unknown `variant` -> `primary`.
  - Unknown `size` -> `large`.
  - `variant=destructive` with leading icon -> hide icon (Figma has no destructive icon slot).
  - Requests for icon-only / `ghostNeutral` -> route to Icon Button (`components/ids/icon-button/design-spec.md`); do not invent Button modes.
### Validation checklist
  - [ ] All variant × size × state combinations resolve tokenized styles.
  - [ ] Focus uses Figma tokens only (`--scale-2`, `--scale-4`, `--color-border-gray-white`, `--color-border-brand-base`) — no invented `--button-focus-*` vars.
  - [ ] Focus uses dual `box-shadow` rings (inner gap + outer brand); **no** `::after` / `outline` focus chrome.
  - [ ] Focus fill matches hover for each variant.
  - [ ] Secondary/tertiary hover/focus use `controls-light`; press uses the press-step fill `controls-press` (Figma Press binds a duplicate `controls-light` variable resolving to `brand-300` / `#97c4e9`); tertiary has no control border on hover/press/focus.
  - [ ] Text Button secondary **press** border uses `var(--color-border-brand-strong)`.
  - [ ] No icon-only / Ghost Neutral rows in this matrix (owned by Icon Button).
  - [ ] Disabled/loading modes prevent output events.
  - [ ] Keyboard and pointer activation parity is preserved.

## Storybook proof & codegen consumers

**Spec Generated** stories prove that `design-spec.md` is machine-consumable.

1. Read this spec as the single source of truth.
2. Emit styles **only** via semantic `var(--...)` from the correct theme file.
3. Keep lib ports and Storybook examples aligned with this spec.

### Icon Implementation Details (Spec Generated Stories)

- **Demo icon asset**: `assets/icons/settings-gear-detailed.svg` (leading icon on text Button)
- **Icon variant**: `variant="mask"`
- **Color token mapping**: per States tables

## Source Mapping
- Component map entry: `data/component-figma-map.json` -> `Button`.
- Primary board: `41894:116123`.
- Text Button component set: `9662:25120`.
- Focus evidence (text Button): `9662:25507` (Primary Large Focus).
- Sibling Icon Button: `data/component-figma-map.json` -> `Icon Button` / `components/ids/icon-button/design-spec.md` (set `52172:249499`).
- Runtime contract: `component-contracts/ids/button.contract.ts`.
- Reference implementations:
  - React: `lib/react/ids/button/`
  - Angular: `lib/angular/ids/button/`
  - Lit: `lib/lit/ids/src/button/`
- Storybook:
  - React lib: `storybook/src/components/lib-generated/Button.stories.tsx`
  - Angular: `storybook-angular/src/components/ids-button/`
  - Lit: `storybook-lit/src/components/Button.stories.ts`
  - Spec Generated IDS/DAP: `storybook-generated/ids|dap/src/components/Button.stories.tsx`
- Live verification (2026-10-16): `get_variable_defs` on text Button press/hover nodes `9662:25482`, `9662:25466` (Secondary/Tertiary Press fills).
- Spec split (2026-11-04): Icon Button metadata, states, tokens, and API removed from this file into `components/ids/icon-button/design-spec.md` after live MCP re-verify of set `52172:249499`. Lib/Storybook ports for icon-only moved to `IdsIconButton` / `ids-icon-button`.

## Implementation Notes

**Typography**
- **Label font-weight**: `400` — do NOT use `500`; `Body 2` is `14/20` at weight `400`.

**Icon color (leading icon)**
- Primary: `var(--color-icon-gray-white)` (all interactive states); disabled → `var(--color-icon-gray-disabled)`.
- Secondary/tertiary leading icon: `var(--color-icon-brand-base)`.
- Disabled (all): `var(--color-icon-gray-disabled)`.

**Icon rendering**
- Mask rendering required so CSS `color` tints the icon.

**Control border**
- Inside stroke via `box-shadow: inset 0 0 0 var(--border-width-border-1) <color>`.
- Tertiary never shows a brand control border (default/hover/press/focus).
- Text Button secondary **press** border: `var(--color-border-brand-strong)`.

**Focus**
- Fill matches **hover** for every variant.
- Dual drop shadows (Figma tokens): `0 0 0 var(--scale-2) var(--color-border-gray-white)` then `0 0 0 var(--scale-4) var(--color-border-brand-base)`, stacked after the inset stroke.
- Do not invent `--button-focus-ring-*` aliases; do not use `::after` or CSS `outline` for focus chrome.
- Demo focus via `data-state="focus-visible"` must hit the same `box-shadow` rules.

**Secondary / tertiary fill (updated 2026-10-16)**
- Hover/focus-visible backgrounds use `var(--color-background-controls-light)` (`brand-200` / `#daeaf7`, not `controls-lighter`).
- **Press** backgrounds are one step darker: `var(--color-background-controls-press)` (`brand-300` / `#97c4e9`). Figma Press binds a second `Background/Controls/light` variable sharing the `controls-light` codeSyntax — verified on `9662:25482` (text Secondary Press), `9662:25466` (text Tertiary Press).

**Icon-only**
- Do not implement icon-only on `IdsButton`. Use `IdsIconButton` per `components/ids/icon-button/design-spec.md`.
