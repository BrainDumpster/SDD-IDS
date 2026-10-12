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
- Icon Button set URL: https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=52172-249499&m=dev
- Icon Button set node id: `52172:249499` (icon-only mode source; Types Primary/Secondary/Tertiary/Ghost — **no Destructive**; docs row label for Ghost is **Ghost Neutral**)
- Focus state reference URL: https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=9662-25507&m=dev
- Focus state node id: `9662:25507` (text Button Primary Large Focus — hover fill + dual drop-shadow rings)
- Icon Button focus reference: `9662:25541` (Icon Button Primary Large Focus — same dual-ring contract)
- Figma file key: `0bHk3XhrjFhowgFkz9yLr4`
- Verification method: Figma MCP (`get_metadata`, `get_variable_defs`, `use_figma` Plugin API)
- Verified at: 2026-10-12 (Icon Button set `52172:249499`; docs label **Ghost Neutral** for `Type=Ghost` live-verified)
## Anatomy
- `ButtonRoot` (interactive control surface; native `button` in web targets)
- `ButtonLabel` (optional for icon-only mode)
- `ButtonLeadingIcon` (optional; toggled by Figma `Show Icon` / runtime projection or `iconSlug`)

Deterministic order:
1. `ButtonRoot`
2. optional `ButtonLeadingIcon`
3. optional `ButtonLabel`

Figma component properties (text Button set `9662:25120`):
- `Show Icon` (BOOLEAN, default `false`) — controls leading-icon visibility
- `Select Icon` (INSTANCE_SWAP) — swaps the leading icon instance
- Variant axes: `Type` × `State` × `Size`
- **Destructive** variants have no leading-icon slot in Figma (do not render `ButtonLeadingIcon` for `destructive`)

Figma component properties (Icon Button set `52172:249499`):
- `Select Icon` (INSTANCE_SWAP) — required icon instance (default demo: `shape-plus`)
- Variant axes: `Type` × `State` × `Size`
- `Type` options: `Primary` | `Secondary` | `Tertiary` | `Ghost` (**no `Destructive`**)
- Docs row label for `Type=Ghost`: **Ghost Neutral** (Labels frame `52188:184316` — text node characters `Ghost Neutral`). Runtime API name: `ghostNeutral` (alias `ghost`).
- `State` options: `Default` | `Hover` | `Press` | `Focus` | `Disabled`
- `Size` options: `Small` | `Medium` | `Large` (default `Large`)
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
- Icon-only signatures (Figma Icon Button set `52172:249499` — square control, padding none):
  - Control box bound to `var(--sizing-size-24)` / `var(--sizing-size-32)` / `var(--sizing-size-40)`
  - Padding bound to `var(--padding-padding-none)` (all sides `0`)
  - Glyph sizes (Primary / Secondary / Tertiary):
    - `small`: `var(--ui-icon-spacing-icon-12)` (**12×12**)
    - `medium`: `var(--ui-icon-spacing-icon-14)` (**14×14**)
    - `large`: `var(--ui-icon-spacing-icon-16)` (**16×16**)
  - Glyph sizes (Ghost Neutral / Figma `Type=Ghost` — Figma-verified):
    - `small`: `var(--ui-icon-spacing-icon-12)` (**12×12**)
    - `medium`: `var(--ui-icon-spacing-icon-14)` (**14×14**)
    - `large`: `var(--ui-icon-spacing-icon-14)` (**14×14**) — Large Ghost Neutral resolves Width/Height → `UI Icon Spacing/icon-14`, not `icon-16`
- Control border (`1px` / `Border Width/border-default`) is an **inside stroke** and must NOT add to the control's height/width. Render via `box-shadow: inset` (not CSS `border` under global `border-box`).
- Focus ring geometry (focus-visible) — **dual drop shadows** on `ButtonRoot` (not `::after`, not `outline`). Use **Figma tokens only** (no invented `--button-focus-*` aliases):
  - Inner gap ring spread: `var(--scale-2)` — Figma `Focus Drop Shadow/Spread/Inner Ring` → `Scale/2`
  - Outer brand ring spread: `var(--scale-4)` — Figma `Focus Drop Shadow/Spread/Outer Ring` → `Scale/4`
  - Gap paint: `var(--color-border-gray-white)` — Figma `Color/Border/Focus/Ring 1` resolves to **White** in light (Figma WEB codeSyntax on Ring 1 incorrectly says `brand-base`; do not follow that for the gap)
  - Outer paint: `var(--color-border-brand-base)` — Figma `Color/Border/Focus/Ring 2`
  - Rings follow the control corner radius; legacy Figma `focus` rectangle layer is **hidden** — do not implement it
  - Icon Button Focus variants use the same dual-ring contract (evidence: `9662:25541`)

### Slot geometry (Figma-verified)

| Slot / layer | Property | Token / contract | Figma node | Live evidence |
| --- | --- | --- | --- | --- |
| `ButtonRoot` | `border-radius` | `var(--button-control-radius)` → `var(--corner-radius-radius-2)` (**2px**) | `9662:25539` | Icon Button Primary Large Default; `Corner Radius/radius-2` |
| Focus rings | inner spread | `var(--scale-2)` (**2px**) | `9662:25541` | `Focus Drop Shadow/Spread/Inner Ring` → `Scale/2` |
| Focus rings | outer spread | `var(--scale-4)` (**4px**) | `9662:25541` | `Focus Drop Shadow/Spread/Outer Ring` → `Scale/4` |
| Focus rings | gap color | `var(--color-border-gray-white)` | `9662:25541` | Inner DROP_SHADOW → `Color/Border/Focus/Ring 1` → White |
| Focus rings | outer color | `var(--color-border-brand-base)` | `9662:25541` | Outer DROP_SHADOW → `Color/Border/Focus/Ring 2` |
| Icon-only Large | box | `var(--sizing-size-40)` (**40×40**), padding `var(--padding-padding-none)` | `9662:25539` | Plugin API + variable bindings |
| Icon-only Medium | box | `var(--sizing-size-32)` (**32×32**), padding `var(--padding-padding-none)` | `9662:25362` | Plugin API + variable bindings |
| Icon-only Small | box | `var(--sizing-size-24)` (**24×24**), padding `var(--padding-padding-none)` | `52172:249509` | Plugin API + variable bindings |
| Icon-only Large glyph (non-Ghost) | size | `var(--ui-icon-spacing-icon-16)` (**16×16**) | `9662:25539` | `UI Icon Spacing/icon-16` |
| Icon-only Medium glyph | size | `var(--ui-icon-spacing-icon-14)` (**14×14**) | `9662:25362` | `UI Icon Spacing/icon-14` |
| Icon-only Small glyph | size | `var(--ui-icon-spacing-icon-12)` (**12×12**) | `52172:249509` | `UI Icon Spacing/icon-12` |
| Icon-only Ghost Neutral Large glyph | size | `var(--ui-icon-spacing-icon-14)` (**14×14**) | `52173:249627` | Figma `Type=Ghost`; Width/Height → `UI Icon Spacing/icon-14` |

**Geometry authoring rules (mandatory):**
- Focus is **dual drop shadows** stacked with the inset control stroke on `box-shadow` (inset stroke first, then gap ring, then outer ring).
- Do **not** use `::after` / `outline` for the IDS Button focus ring.
- Do **not** invent component-prefixed CSS variables for focus (`--button-focus-ring-*`). Bind to Figma-synced tokens (`--scale-*`, `--color-border-*`, `--corner-radius-*`).
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
  - `var(--color-background-controls-light)`
  - `var(--color-border-brand-base)`
  - `var(--color-border-brand-strong)` (text Button secondary **press** only)
  - `var(--color-text-brand-strong)`
- Destructive tokens:
  - `var(--color-background-alerting-critical-base)`
  - `var(--color-background-alerting-critical-strong)`
  - `var(--color-background-alerting-critical-stronger)`
  - `var(--color-border-alerting-critical-transparent-base)`
- Ghost Neutral (icon-only only; Figma `Type=Ghost`) tokens:
  - `var(--color-background-gray-neutral-lighter)` at **10%** opacity (hover/focus fill)
  - `var(--color-background-gray-neutral-lighter)` at **20%** opacity (press fill)
  - `var(--color-icon-gray-neutral-base)` (default icon)
  - `var(--color-icon-gray-neutral-strong)` (hover/focus/press icon)
- Disabled tokens:
  - `var(--color-background-gray-lighter)`
  - `var(--color-border-gray-disabled)`
  - `var(--color-text-gray-disabled)`
  - `var(--color-icon-gray-disabled)`
- Icon tokens:
  - `var(--color-icon-gray-white)` (Primary)
  - `var(--color-icon-brand-base)` (Secondary default; text Button secondary/tertiary leading icon)
  - `var(--color-icon-brand-strong)` (Icon Button Secondary hover/focus; Tertiary default/hover/focus)
  - `var(--color-icon-brand-stronger)` (Icon Button Secondary/Tertiary press)
  - `var(--color-icon-gray-neutral-base)` / `var(--color-icon-gray-neutral-strong)` (Ghost Neutral)
- Icon-only layout tokens (Figma Icon Button bindings):
  - `var(--sizing-size-24)` / `var(--sizing-size-32)` / `var(--sizing-size-40)`
  - `var(--padding-padding-none)`
  - `var(--ui-icon-spacing-icon-12)` / `var(--ui-icon-spacing-icon-14)` / `var(--ui-icon-spacing-icon-16)`
## States (Light Theme)
| Variant | State | Background | Border | Text/Icon |
|---|---|---|---|---|
| primary | default | `var(--color-background-controls-base)` | `var(--color-border-brand-transparent-brand)` | `var(--color-text-gray-white)` / `var(--color-icon-gray-white)` |
| primary | hover | `var(--color-background-controls-strong)` | `var(--color-border-brand-transparent-brand)` | `var(--color-text-gray-white)` / `var(--color-icon-gray-white)` |
| primary | press | `var(--color-background-controls-stronger)` | `var(--color-border-brand-transparent-brand)` | `var(--color-text-gray-white)` / `var(--color-icon-gray-white)` |
| primary | disabled | `var(--color-background-gray-lighter)` | `var(--color-border-gray-disabled)` | `var(--color-text-gray-disabled)` / `var(--color-icon-gray-disabled)` |
| primary | focus-visible | `var(--color-background-controls-strong)` (same as hover) | control border unchanged + dual focus rings | text/icon unchanged |
| secondary | default | transparent | `var(--color-border-brand-base)` | `var(--color-text-brand-strong)` / `var(--color-icon-brand-base)` |
| secondary | hover | `var(--color-background-controls-light)` | `var(--color-border-brand-base)` | `var(--color-text-brand-strong)` / text: `var(--color-icon-brand-base)` · icon-only: `var(--color-icon-brand-strong)` |
| secondary | press | `var(--color-background-controls-light)` | text Button: `var(--color-border-brand-strong)` · icon-only: `var(--color-border-brand-base)` | `var(--color-text-brand-strong)` / text: `var(--color-icon-brand-base)` · icon-only: `var(--color-icon-brand-stronger)` |
| secondary | disabled | transparent | `var(--color-border-gray-disabled)` | `var(--color-text-gray-disabled)` / `var(--color-icon-gray-disabled)` |
| secondary | focus-visible | `var(--color-background-controls-light)` (same as hover) | `var(--color-border-brand-base)` + dual focus rings | text/icon same as hover for mode |
| tertiary | default | transparent | transparent | `var(--color-text-brand-strong)` / text: `var(--color-icon-brand-base)` · icon-only: `var(--color-icon-brand-strong)` |
| tertiary | hover | `var(--color-background-controls-light)` | transparent | `var(--color-text-brand-strong)` / text: `var(--color-icon-brand-base)` · icon-only: `var(--color-icon-brand-strong)` |
| tertiary | press | `var(--color-background-controls-light)` | transparent | `var(--color-text-brand-strong)` / text: `var(--color-icon-brand-base)` · icon-only: `var(--color-icon-brand-stronger)` |
| tertiary | disabled | transparent | transparent | `var(--color-text-gray-disabled)` / `var(--color-icon-gray-disabled)` |
| tertiary | focus-visible | `var(--color-background-controls-light)` (same as hover) | transparent + dual focus rings | text/icon same as hover for mode |
| destructive | default | `var(--color-background-alerting-critical-base)` | `var(--color-border-alerting-critical-transparent-base)` | `var(--color-text-gray-white)` / n/a (no icon slot) |
| destructive | hover | `var(--color-background-alerting-critical-strong)` | `var(--color-border-alerting-critical-transparent-base)` | `var(--color-text-gray-white)` / n/a |
| destructive | press | `var(--color-background-alerting-critical-stronger)` | `var(--color-border-alerting-critical-transparent-base)` | `var(--color-text-gray-white)` / n/a |
| destructive | disabled | `var(--color-background-gray-lighter)` | `var(--color-border-gray-disabled)` | `var(--color-text-gray-disabled)` / n/a |
| destructive | focus-visible | `var(--color-background-alerting-critical-strong)` (same as hover) | control border unchanged + dual focus rings | text unchanged |
| ghostNeutral | default | transparent | transparent | n/a / `var(--color-icon-gray-neutral-base)` |
| ghostNeutral | hover | `var(--color-background-gray-neutral-lighter)` @ 10% | transparent | n/a / `var(--color-icon-gray-neutral-strong)` |
| ghostNeutral | press | `var(--color-background-gray-neutral-lighter)` @ 20% | transparent | n/a / `var(--color-icon-gray-neutral-strong)` |
| ghostNeutral | disabled | transparent | transparent | n/a / `var(--color-icon-gray-disabled)` |
| ghostNeutral | focus-visible | `var(--color-background-gray-neutral-lighter)` @ 10% (same as hover) | transparent + dual focus rings | n/a / `var(--color-icon-gray-neutral-strong)` |

Notes:
- `ghostNeutral` is **icon-only only**. Figma component-set axis value is `Type=Ghost`; documentation row label is **Ghost Neutral**. Do not use with a label. Alias `ghost` resolves to `ghostNeutral`.
- `destructive` is **text / icon+text only** (not present on Icon Button set `52172:249499`).
- Icon Button actions/states are only those on the set: Default, Hover, Press, Focus, Disabled — no additional actions.
- Ghost Neutral Disabled in Figma Large (`52173:249621`) still carries dual DROP_SHADOW effects (file quirk). Runtime **must not** paint focus rings when disabled.
## States (Dark Theme)
Same semantic `var(--...)` names as **States (Light Theme)** for every row. Resolved dark values live in `components/ids-theme.css` under `[data-theme="dark"]` / `.ids-theme-dark`. Do not duplicate the matrix here unless a dark row uses a different `var(--...)` name.
## Interactions
- Trigger: pointer click, `Enter`, and `Space`.
- `hover` appears on pointer hover for interactive buttons.
- `press` appears while pointer or keyboard activation is held.
- `focus-visible` uses **hover fill** + dual drop-shadow focus rings (keyboard / forced `data-state`).
- Disabled state blocks all interaction and event emission (no focus rings while disabled, even if Figma Ghost Neutral Disabled still shows leftover DROP_SHADOW layers).
- Runtime default must remain interactive.
- Forced state attributes for demo/testing are allowed (`data-state`), but they must not replace runtime interaction logic.
- Icon Button supports only the Figma State axis actions: hover, press, focus-visible, disabled — no other interaction modes.
## Composition & API (runtime)
- Suggested runtime component: `IdsButton`.

Inputs:
- `label?: string` (required unless `iconOnly=true`; React/Angular may project `IdsButtonLabel` / default slot instead)
- `variant?: "primary" | "secondary" | "tertiary" | "destructive" | "ghostNeutral" | "ghost"` (default `primary`; `ghostNeutral` / alias `ghost` requires `iconOnly=true`)
- `size?: "small" | "medium" | "large"` (default `large`; icon-only supports all three)
- `iconSlug?: string` (optional; maps to Figma `Select Icon` / `/asset/icons/<slug>.svg`)
- `iconOnly?: boolean` (default `false`; maps to Icon Button set when true)
- `showIcon?: boolean` (optional convenience; when false, hide leading icon even if projected/`iconSlug` present — Figma `Show Icon` default false)
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
### Deterministic structure
  1. `ButtonRoot`
  2. optional `ButtonLeadingIcon`
  3. optional `ButtonLabel`
### Variant matrix
  - `variant`: `primary | secondary | tertiary | destructive | ghostNeutral` (`ghost` alias → `ghostNeutral`)
  - `size`: `small | medium | large`
  - icon modes: label-only / icon+label (`Show Icon`) / icon-only
  - states: `default | hover | press | focus-visible | disabled`
  - constraints: `ghostNeutral` ⇒ `iconOnly`; `destructive` ⇒ no leading icon; `iconOnly` ⇒ no `destructive`
### Per-slot style contract
  - `ButtonRoot`: height/padding (or square icon-only via `var(--sizing-size-*)` + `var(--padding-padding-none)`), radius, inset border, background, typography from tokens and size contract; focus via dual drop-shadow rings.
  - `ButtonLeadingIcon`: icon+text `16×16`; icon-only Primary/Secondary/Tertiary `var(--ui-icon-spacing-icon-12|14|16)` by size; Ghost Neutral Large/Medium `icon-14`, Small `icon-12`. Colors per States table (icon-only Secondary/Tertiary use brand-strong / brand-stronger ladders). Mask rendering required.
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
  - `iconOnly=true` requires accessible label.
  - `press` state is transient and cleared on pointer/key release.
  - `iconOnly=true` supports `small | medium | large`.
  - `ghostNeutral` (or alias `ghost`) without `iconOnly` → validation error (or coerce `iconOnly=true` only if product enables coercion).
### Accessibility contract
  - Native `button` semantics.
  - `aria-disabled` mirrors disabled state for non-native fallbacks.
  - Keyboard parity: `Enter` and `Space` activate.
  - Visible `focus-visible` treatment required (dual rings).
### Asset resolution + bundling contract
  - Icon input uses slug: `iconSlug`.
  - Resolve icon from `/asset/icons/<iconSlug>.svg`.
  - Unknown slug fallback: hide icon slot and continue rendering label (text mode).
### Fallback/error rules
  - Unknown `variant` -> `primary`.
  - Unknown `size` -> `large`.
  - Alias `ghost` -> `ghostNeutral`.
  - `iconOnly=true` and missing `ariaLabel` -> validation error.
  - `iconOnly=true` and missing icon -> validation error.
  - `variant=ghostNeutral` (or `ghost`) without `iconOnly` -> validation error.
  - `variant=destructive` with leading icon -> hide icon (Figma has no destructive icon slot).
### Validation checklist
  - [ ] All variant × size × state combinations resolve tokenized styles.
  - [ ] Focus uses Figma tokens only (`--scale-2`, `--scale-4`, `--color-border-gray-white`, `--color-border-brand-base`) — no invented `--button-focus-*` vars.
  - [ ] Focus uses dual `box-shadow` rings (inner gap + outer brand); **no** `::after` / `outline` focus chrome.
  - [ ] Focus fill matches hover for each variant.
  - [ ] Secondary/tertiary hover/press use `controls-light`; tertiary has no control border on hover/press/focus.
  - [ ] Icon-only square sizes use `sizing-size-24/32/40` + `padding-padding-none`; glyphs use `ui-icon-spacing-icon-12/14/16` (Ghost Neutral Large = `icon-14`).
  - [ ] Icon-only Secondary/Tertiary icon colors follow brand-base → brand-strong → brand-stronger ladder from set `52172:249499`.
  - [ ] Ghost Neutral icon-only states documented and implemented; disabled has no focus rings.
  - [ ] Disabled/loading modes prevent output events.
  - [ ] Keyboard and pointer activation parity is preserved.

## Storybook proof & codegen consumers

**Spec Generated** stories prove that `design-spec.md` is machine-consumable.

1. Read this spec as the single source of truth.
2. Emit styles **only** via semantic `var(--...)` from the correct theme file.
3. Keep lib ports and Storybook examples aligned with this spec.

### Icon Implementation Details (Spec Generated Stories)

- **Demo icon asset**: `assets/icons/settings-gear-detailed.svg` (text Button) / `shape-plus` acceptable for Icon Button demos
- **Icon variant**: `variant="mask"`
- **Color token mapping**: per States tables (including Ghost Neutral icons)

## Source Mapping
- Component map entry: `data/component-figma-map.json` -> `Button`.
- Primary board: `41894:116123`.
- Text Button component set: `9662:25120`.
- Icon Button component set: `52172:249499`.
- Icon Button Primary Large Default / Focus evidence: `9662:25539` / `9662:25541`.
- Icon Button Ghost Neutral Large Default evidence: `52173:249627` (Figma `Type=Ghost`; glyph `icon-14`; docs label Ghost Neutral).
- Focus evidence (text Button): `9662:25507` (Primary Large Focus).
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
- Live verification (2026-10-12): Figma MCP `get_metadata` / `get_variable_defs` / `use_figma` on Icon Button set `52172:249499` (file `0bHk3XhrjFhowgFkz9yLr4`).

## Implementation Notes

**Typography**
- **Label font-weight**: `400` — do NOT use `500`; `Body 2` is `14/20` at weight `400`.

**Icon color**
- Primary: `var(--color-icon-gray-white)` (all interactive states); disabled → `var(--color-icon-gray-disabled)`.
- Text Button secondary/tertiary leading icon: `var(--color-icon-brand-base)`.
- Icon Button Secondary: default `brand-base` → hover/focus `brand-strong` → press `brand-stronger`.
- Icon Button Tertiary: default/hover/focus `brand-strong` → press `brand-stronger`.
- Ghost Neutral: default `var(--color-icon-gray-neutral-base)`; hover/press/focus `var(--color-icon-gray-neutral-strong)`.
- Disabled (all): `var(--color-icon-gray-disabled)`.

**Icon rendering**
- Mask rendering required so CSS `color` tints the icon.

**Control border**
- Inside stroke via `box-shadow: inset 0 0 0 var(--border-width-border-1) <color>`.
- Tertiary never shows a brand control border (default/hover/press/focus).
- Icon Button Secondary **press** keeps `var(--color-border-brand-base)` (does not use text Button `brand-strong` press border).

**Focus (2026-10-12)**
- Fill matches **hover** for every variant (including Icon Button Focus variants).
- Dual drop shadows (Figma tokens): `0 0 0 var(--scale-2) var(--color-border-gray-white)` then `0 0 0 var(--scale-4) var(--color-border-brand-base)`, stacked after the inset stroke.
- Do not invent `--button-focus-ring-*` aliases; do not use `::after` or CSS `outline` for focus chrome.
- Demo focus via `data-state="focus-visible"` must hit the same `box-shadow` rules.

**Secondary / tertiary fill (2026-10-12)**
- Hover/press backgrounds use `var(--color-background-controls-light)` (not `controls-lighter`).
- Text Button secondary **press** border: `var(--color-border-brand-strong)`.

**Icon Button / Ghost Neutral (set `52172:249499`)**
- Types: Primary, Secondary, Tertiary, Ghost (docs label **Ghost Neutral**) — no Destructive, no extra actions beyond Default/Hover/Press/Focus/Disabled.
- Runtime variant: `ghostNeutral` (alias `ghost`).
- Square control + `padding-none`; sizing tokens `size-24/32/40`; glyphs `icon-12/14/16` (Ghost Neutral Large = `icon-14`).
- Ghost Neutral is icon-only-only.
- Keep `lib/react|angular|lit/ids/button` as canonical ports.
