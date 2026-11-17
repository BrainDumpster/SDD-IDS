# IDS Icon Button Design Spec

## Metadata
- Component: Icon Button
- Design system: IDS
- Category: Formelements
- Spec path: `components/ids/icon-button/design-spec.md`
- Spec pattern: ids-native
- Version: 1.0.0
- Description: Square icon-only control (Primary / Secondary / Tertiary / Ghost Neutral) sourced from the IDS Icon Button component set — separate from text / icon+text Button.
- Status: active
- Created: 2026-11-04
- Updated: 2026-11-04
- Primary Figma URL: https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=52172-249499&m=dev
- Primary node id: `52172:249499` (Icon Button component set — Types Primary/Secondary/Tertiary/Ghost — **no Destructive**; docs row label for Ghost is **Ghost Neutral**)
- Focus state reference URL: https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=9662-25541&m=dev
- Focus state node id: `9662:25541` (Icon Button Primary Large Focus — dual drop-shadow rings)
- Docs labels frame: `52188:184316` (row label **Ghost Neutral** for Figma `Type=Ghost`)
- Figma file key: `0bHk3XhrjFhowgFkz9yLr4`
- Verification method: Figma MCP (`get_metadata`, `get_variable_defs`)
- Verified at: 2026-11-04 (session re-verify of set `52172:249499` and evidence nodes below); prior live passes 2026-10-12 / 2026-10-16 retained where still accurate
- Sibling text Button spec: `components/ids/button/design-spec.md` (text / icon+text only; no Icon Button set)

## Anatomy
- `IconButtonRoot` (interactive control surface; native `button` in web targets)
- `IconButtonIcon` (required slot; rendered by the component via the shared **Icon** primitive — not user-projected content)

Deterministic order:
1. `IconButtonRoot`
2. `IconButtonIcon` → internal `IdsIcon` / `ids-icon` with `shape` + size from the Icon Button size contract

Figma component properties (Icon Button set `52172:249499`):
- `Select Icon` (INSTANCE_SWAP) — required icon instance (default demo: `shape-plus`); runtime maps to prop `shape`
- Variant axes: `Type` × `State` × `Size`
- `Type` options: `Primary` | `Secondary` | `Tertiary` | `Ghost` (**no `Destructive`**)
- Docs row label for `Type=Ghost`: **Ghost Neutral** (Labels frame `52188:184316`). Runtime API name: `ghostNeutral` (alias `ghost`).
- `State` options: `Default` | `Hover` | `Press` | `Focus` | `Disabled`
- `Size` options: `Small` | `Medium` | `Large` (default `Large`)

## Layout & Measurements
- Control is always **square**, padding none — not content-width like text Button.
- Control corner radius: `var(--icon-button-control-radius)` (IDS theme resolves to `var(--corner-radius-radius-2)` / 2px).
- Size signatures (Figma Icon Button set `52172:249499`):

  | Size | Control (square) | Glyph (all types, incl. Ghost Neutral) |
  | --- | --- | --- |
  | `small` | **24×24** (`var(--sizing-size-24)`) | **12×12** (`var(--ui-icon-spacing-icon-12)`) |
  | `medium` | **32×32** (`var(--sizing-size-32)`) | **14×14** (`var(--ui-icon-spacing-icon-14)`) |
  | `large` | **40×40** (`var(--sizing-size-40)`) | **16×16** (`var(--ui-icon-spacing-icon-16)`) |

  - Padding bound to `var(--padding-padding-none)` (all sides `0`)
  - Ghost Neutral Large glyph re-verified 2026-11-04 on `52173:249627`: Width/Height → `UI Icon Spacing/icon-16` (**not** `icon-14`)
  - Runtime **requires** `ariaLabel` (or native `aria-label`) — no visible label to name the control
- Control border (`1px` / `Border Width/border-default`) is an **inside stroke** and must NOT add to the control's height/width. Render via `box-shadow: inset` (not CSS `border` under global `border-box`).
- Focus ring geometry (focus-visible) — **dual drop shadows** on `IconButtonRoot` (not `::after`, not `outline`). Use **Figma tokens only** (no invented `--icon-button-focus-*` aliases):
  - Inner gap ring spread: `var(--scale-2)` — Figma `Focus Drop Shadow/Spread/Inner Ring` → `Scale/2` (live: **2** on `9662:25541`)
  - Outer brand ring spread: `var(--scale-4)` — Figma `Focus Drop Shadow/Spread/Outer Ring` → `Scale/4` (live: **4** on `9662:25541`)
  - Gap paint: `var(--color-border-gray-white)` — Figma `Color/Border/Focus/Ring 1` resolves to **White** in light (Figma WEB codeSyntax on Ring 1 incorrectly says `brand-base`; do not follow that for the gap)
  - Outer paint: `var(--color-border-brand-base)` — Figma `Color/Border/Focus/Ring 2`
  - Rings follow the control corner radius; legacy Figma `focus` rectangle layer is **hidden** — do not implement it

### Slot geometry (Figma-verified)

| Slot / layer | Property | Token / contract | Figma node | Live evidence |
| --- | --- | --- | --- | --- |
| `IconButtonRoot` | `border-radius` | `var(--icon-button-control-radius)` → `var(--corner-radius-radius-2)` (**2px**) | `9662:25539` | Icon Button Primary Large Default; `Corner Radius/radius-2` via `get_variable_defs` 2026-11-04 |
| Focus rings | inner spread | `var(--scale-2)` (**2px**) | `9662:25541` | `Focus Drop Shadow/Spread/Inner Ring` → **2** |
| Focus rings | outer spread | `var(--scale-4)` (**4px**) | `9662:25541` | `Focus Drop Shadow/Spread/Outer Ring` → **4** |
| Focus rings | gap color | `var(--color-border-gray-white)` | `9662:25541` | Inner DROP_SHADOW → White (ignore WEB codeSyntax `brand-base` on Ring 1) |
| Focus rings | outer color | `var(--color-border-brand-base)` | `9662:25541` | Outer DROP_SHADOW → `Color/Border/Focus/Ring 2` |
| Large box | size + padding | `var(--sizing-size-40)` (**40×40**), `var(--padding-padding-none)` | `9662:25539` | `Sizing/size-40`, `Padding/padding-none` |
| Medium box | size + padding | `var(--sizing-size-32)` (**32×32**), `var(--padding-padding-none)` | `9662:25362` | `Sizing/size-32`, `Padding/padding-none` |
| Small box | size + padding | `var(--sizing-size-24)` (**24×24**), `var(--padding-padding-none)` | `52172:249509` | `Sizing/size-24`, `Padding/padding-none` |
| Large glyph | size | `var(--ui-icon-spacing-icon-16)` (**16×16**) | `9662:25539` | `UI Icon Spacing/icon-16` |
| Medium glyph | size | `var(--ui-icon-spacing-icon-14)` (**14×14**) | `9662:25362` | `UI Icon Spacing/icon-14` |
| Small glyph | size | `var(--ui-icon-spacing-icon-12)` (**12×12**) | `52172:249509` | `UI Icon Spacing/icon-12` |
| Ghost Neutral Large glyph | size | `var(--ui-icon-spacing-icon-16)` (**16×16**) | `52173:249627` | Figma `Type=Ghost`; `UI Icon Spacing/icon-16` (`get_variable_defs` 2026-11-04) |

**Geometry authoring rules (mandatory):**
- Focus is **dual drop shadows** stacked with the inset control stroke on `box-shadow` (inset stroke first, then gap ring, then outer ring).
- Do **not** use `::after` / `outline` for the IDS Icon Button focus ring.
- Do **not** invent component-prefixed CSS variables for focus (`--icon-button-focus-ring-*`). Bind to Figma-synced tokens (`--scale-*`, `--color-border-*`, `--corner-radius-*`).

## Tokens
### Layout aliases (theme-resolvable)
Only programme-overridable control shell radius uses a component alias. Focus geometry uses Figma tokens directly.

| Alias / token | IDS default / Figma source |
|---|---|
| `--icon-button-control-radius` | `var(--corner-radius-radius-2)` — Figma `Corner Radius/radius-2` (programme override point only) |
| Focus inner spread | `var(--scale-2)` — Figma `Scale/2` |
| Focus outer spread | `var(--scale-4)` — Figma `Scale/4` |
| Focus gap paint | `var(--color-border-gray-white)` — Figma Ring 1 → White |
| Focus outer paint | `var(--color-border-brand-base)` — Figma Ring 2 |

### Colors and surfaces
- Core primary tokens:
  - `var(--color-background-controls-base)`
  - `var(--color-background-controls-strong)`
  - `var(--color-background-controls-stronger)`
  - `var(--color-border-brand-transparent-brand)`
- Secondary/tertiary tokens:
  - `var(--color-background-controls-light)` (hover/focus-visible fill) — live Secondary Large Hover `9662:25526` → `#daeaf7`
  - `var(--color-background-controls-press)` (**press** fill) — Figma Press binds a *second* `Background/Controls/light` variable sharing the same codeSyntax; it resolves one step darker (`brand-300` / `#97c4e9` vs hover `brand-200` / `#daeaf7`). Live Secondary/Tertiary Large Press (`9662:25524`, `9662:25513`) surface that press-step as `#97c4e9`. The IDS theme exposes the press-step as `--color-background-controls-press` since CSS cannot express the duplicate binding.
  - `var(--color-border-brand-base)` — Secondary control border including **press** (Icon Button Secondary press keeps `brand-base`; does **not** use text Button `brand-strong` press border). Live `9662:25524`: `var(--color-border-brand-base)` → `#0672cb`.
- Ghost Neutral (Figma `Type=Ghost`) tokens:
  - Hover/focus fill: `var(--ui-palette-slate-600)` at **10%** opacity — Figma binds a `Background/Gray Neutral/lighter` variable that resolves to `#4556661a` (slate-600 RGB + baked alpha); live Ghost Large Hover `52173:249625`. The theme's solid `--color-background-gray-neutral-lighter` (`#f4f4f4`) is a different duplicate and must NOT be used here. Implement as `color-mix(in srgb, var(--ui-palette-slate-600) 10%, transparent)`.
  - Press fill: same binding resolves `#45566633` → `color-mix(in srgb, var(--ui-palette-slate-600) 20%, transparent)` — live Ghost Large Press `52173:249623`.
  - `var(--color-icon-gray-neutral-base)` (default icon)
  - `var(--color-icon-gray-neutral-strong)` (hover/focus/press icon)
- Disabled tokens:
  - `var(--color-background-gray-lighter)`
  - `var(--color-border-gray-disabled)`
  - `var(--color-icon-gray-disabled)`
- Icon tokens:
  - `var(--color-icon-gray-white)` (Primary)
  - `var(--color-icon-brand-base)` (Secondary default) — live `9662:25528`
  - `var(--color-icon-brand-strong)` (Secondary hover/focus; Tertiary default/hover/focus) — live Tertiary Default `9662:25517`, Secondary Hover `9662:25526`
  - `var(--color-icon-brand-stronger)` (Secondary/Tertiary press) — live `9662:25524` / `9662:25513`
  - `var(--color-icon-gray-neutral-base)` / `var(--color-icon-gray-neutral-strong)` (Ghost Neutral)
- Layout size tokens:
  - `var(--sizing-size-24)` / `var(--sizing-size-32)` / `var(--sizing-size-40)`
  - `var(--padding-padding-none)`
  - `var(--ui-icon-spacing-icon-12)` / `var(--ui-icon-spacing-icon-14)` / `var(--ui-icon-spacing-icon-16)`

## States (Light Theme)
| Variant | State | Background | Border | Icon |
|---|---|---|---|---|
| primary | default | `var(--color-background-controls-base)` | `var(--color-border-brand-transparent-brand)` | `var(--color-icon-gray-white)` |
| primary | hover | `var(--color-background-controls-strong)` | `var(--color-border-brand-transparent-brand)` | `var(--color-icon-gray-white)` |
| primary | press | `var(--color-background-controls-stronger)` | `var(--color-border-brand-transparent-brand)` | `var(--color-icon-gray-white)` |
| primary | disabled | `var(--color-background-gray-lighter)` | `var(--color-border-gray-disabled)` | `var(--color-icon-gray-disabled)` |
| primary | focus-visible | `var(--color-background-controls-strong)` (same as hover) | control border unchanged + dual focus rings | icon unchanged |
| secondary | default | transparent | `var(--color-border-brand-base)` | `var(--color-icon-brand-base)` |
| secondary | hover | `var(--color-background-controls-light)` | `var(--color-border-brand-base)` | `var(--color-icon-brand-strong)` |
| secondary | press | `var(--color-background-controls-press)` (press-step; Figma duplicate `controls-light` binding → `brand-300`) | `var(--color-border-brand-base)` | `var(--color-icon-brand-stronger)` |
| secondary | disabled | transparent | `var(--color-border-gray-disabled)` | `var(--color-icon-gray-disabled)` |
| secondary | focus-visible | `var(--color-background-controls-light)` (same as hover) | `var(--color-border-brand-base)` + dual focus rings | `var(--color-icon-brand-strong)` |
| tertiary | default | transparent | transparent | `var(--color-icon-brand-strong)` |
| tertiary | hover | `var(--color-background-controls-light)` | transparent | `var(--color-icon-brand-strong)` |
| tertiary | press | `var(--color-background-controls-press)` (press-step; Figma duplicate `controls-light` binding → `brand-300`) | transparent | `var(--color-icon-brand-stronger)` |
| tertiary | disabled | transparent | transparent | `var(--color-icon-gray-disabled)` |
| tertiary | focus-visible | `var(--color-background-controls-light)` (same as hover) | transparent + dual focus rings | `var(--color-icon-brand-strong)` |
| ghostNeutral | default | transparent | transparent | `var(--color-icon-gray-neutral-base)` |
| ghostNeutral | hover | `var(--ui-palette-slate-600)` @ 10% (bound `gray-neutral-lighter` var resolves `#4556661a`) | transparent | `var(--color-icon-gray-neutral-strong)` |
| ghostNeutral | press | `var(--ui-palette-slate-600)` @ 20% (bound `gray-neutral-lighter` var resolves `#45566633`) | transparent | `var(--color-icon-gray-neutral-strong)` |
| ghostNeutral | disabled | transparent | transparent | `var(--color-icon-gray-disabled)` |
| ghostNeutral | focus-visible | `var(--ui-palette-slate-600)` @ 10% (same as hover) | transparent + dual focus rings | `var(--color-icon-gray-neutral-strong)` |

Notes:
- `ghostNeutral` is the only Ghost type. Figma axis value is `Type=Ghost`; documentation row label is **Ghost Neutral**. Alias `ghost` resolves to `ghostNeutral`.
- **No Destructive** on set `52172:249499` — do not invent a destructive Icon Button variant.
- Actions/states are only those on the set: Default, Hover, Press, Focus, Disabled — no additional actions.
- Ghost Neutral Disabled in Figma Large (`52173:249621`) still carries dual DROP_SHADOW effects (file quirk). Runtime **must not** paint focus rings when disabled.

## States (Dark Theme)
Dark theme uses the same semantic tokens as **States (Light Theme)**. Resolved values for `[data-theme="dark"]` / `.ids-theme-dark` (and program overlays) live in theme CSS:

- `components/ids-theme.css`
- `components/<program>-theme.css` when a program overlays IDS (for example `components/dap-theme.css`)

Duplicate the full state matrix in this section only when a dark row genuinely uses different `var(--...)` references than the corresponding light row.

*(When Light and Dark tables would list identical `var(--...)` cells, keep the matrix under **States (Light Theme)** only and use this pointer section instead of a second table.)*

## Interactions
- Trigger: pointer click, `Enter`, and `Space`.
- `hover` appears on pointer hover for interactive icon buttons.
- `press` appears while pointer or keyboard activation is held.
- `focus-visible` uses **hover fill** + dual drop-shadow focus rings (keyboard / forced `data-state`).
- Disabled state blocks all interaction and event emission (no focus rings while disabled, even if Figma Ghost Neutral Disabled still shows leftover DROP_SHADOW layers).
- Runtime default must remain interactive.
- Forced state attributes for demo/testing are allowed (`data-state`), but they must not replace runtime interaction logic.
- Forced `data-state="disabled"` must resolve the same disabled styling as native `:disabled` (selectors must cover both).
- Supports only the Figma State axis actions: hover, press, focus-visible, disabled — no other interaction modes.

### Accessibility
- Native `button` semantics.
- **Must** set `ariaLabel` / `aria-label` — validation error if missing.
- `aria-disabled` mirrors disabled state for non-native fallbacks.
- Keyboard parity: `Enter` and `Space` activate.
- Visible `focus-visible` treatment required (dual rings).

### Behavior & guidelines
- Use Icon Button when the control is icon-only; use text Button (`components/ids/button/design-spec.md`) for label or icon+label.
- Do not pair a visible label with this component.
- Prefer `shape-plus` or product icons via `shape` for demos; Icon Button always renders the shared Icon with `variant="mask"` so CSS `color` tints the glyph.

## Composition & API (runtime)
- Suggested runtime component: `IdsIconButton`.
- Icon is **user-defined** via required `shape` (icon name / slug). The component renders the shared Icon primitive and forwards `shape` + glyph size — consumers do **not** project a custom icon node.

### Variants
- `variant`: `primary` | `secondary` | `tertiary` | `ghostNeutral` (alias `ghost`)
- `size`: `small` | `medium` | `large` (default `large`)

### Runtime API
Inputs:
- `variant?: "primary" | "secondary" | "tertiary" | "ghostNeutral" | "ghost"` (default `primary`)
- `size?: "small" | "medium" | "large"` (default `large`)
- `shape: string` (**required**; icon name — maps to Figma `Select Icon` / `assets/icons/<shape>.svg`; passed to Icon `shape`)
- `disabled?: boolean` (default `false`)
- `loading?: boolean` (default `false`; if true, interactions are blocked)
- `type?: "button" | "submit" | "reset"` (default `button`)
- `ariaLabel: string` (**required**; native `aria-label` also satisfies the contract)
- `name?: string`
- `value?: string`
- `autofocus?: boolean`
- `dataState?: "default" | "hover" | "press" | "focus-visible" | "disabled"` (demo/testing override only)

Icon forwarding (deterministic):
- Render shared Icon (`IdsIcon` / `ids-icon`) inside `IconButtonIcon` with `shape={shape}` and `variant="mask"`.
- Glyph size by Icon Button `size`:
  - `small` → **12×12**
  - `medium` → **14×14**
  - `large` → **16×16**

Outputs / events:
- `onClick(event)` — emitted on successful activation (blocked when `disabled` or `loading`). Framework bindings:
  - React: `onClick` on `IdsIconButton` (native button callback)
  - Angular: `(clicked)` on `ids-icon-button` (`EventEmitter<MouseEvent>`)
  - Lit: `ids-icon-button-click` CustomEvent (`detail.originalEvent`)
- `onFocus(event)` — emitted when focus enters the control.
- `onBlur(event)` — emitted when focus leaves the control.
- `onKeyDown(event)` — emitted on key press while focused.
- `onKeyUp(event)` — emitted on key release while focused.
- `onPressStart(event)` — optional convenience event for press lifecycle.
- `onPressEnd(event)` — optional convenience event for press lifecycle.

## Codegen Contract (Framework-Agnostic Blueprint)
### Deterministic structure
  1. `IconButtonRoot`
  2. `IconButtonIcon` (required) → internal Icon with `shape` + size from size contract

### Variant matrix
  - `variant`: `primary | secondary | tertiary | ghostNeutral` (`ghost` alias → `ghostNeutral`)
  - `size`: `small | medium | large`
  - `shape`: required non-empty icon name string
  - states: `default | hover | press | focus-visible | disabled`
  - constraints: no `destructive`; icon always present via `shape`; no visible label; no consumer-projected icon slot

### Per-slot style contract
  - `IconButtonRoot`: square via `var(--sizing-size-24|32|40)` + `var(--padding-padding-none)`, radius, inset border, background from tokens and size contract; focus via dual drop-shadow rings.
  - `IconButtonIcon` / Icon: glyph size **12 / 14 / 16** for `small` / `medium` / `large` (`var(--ui-icon-spacing-icon-12|14|16)`). Colors per States table (Secondary/Tertiary use brand-base → brand-strong → brand-stronger ladders). Mask rendering required (`variant="mask"`).

### Theme & programme resolution
- Generators **must** emit Figma tokens for focus: `var(--scale-2)`, `var(--scale-4)`, `var(--color-border-gray-white)`, `var(--color-border-brand-base)`.
- Control radius may use programme alias `var(--icon-button-control-radius)` (defaults to `var(--corner-radius-radius-2)`).
- Theme selection by programme:
  - IDS → `components/ids-theme.css`
  - Synapse → `components/synapse-theme.css`
  - DAP → `components/dap-theme.css`
- Layer precedence: `program_theme_delta` overrides `ids_theme`.

| CSS property | Token |
|---|---|
| `border-radius` | `var(--icon-button-control-radius)` → `var(--corner-radius-radius-2)` |
| focus gap ring spread | `var(--scale-2)` |
| focus outer ring spread | `var(--scale-4)` |
| focus gap ring color | `var(--color-border-gray-white)` |
| focus outer ring color | `var(--color-border-brand-base)` |

### Behavior contract
  - `disabled || loading` blocks activation and output events.
  - Missing `ariaLabel` / `aria-label` → validation error.
  - Missing / empty `shape` → validation error.
  - `press` state is transient and cleared on pointer/key release.
  - All sizes `small | medium | large` are valid for every variant.
  - Icon glyph size is derived only from Icon Button `size` (12 / 14 / 16) — not a separate consumer prop.

### Accessibility contract
  - Native `button` semantics.
  - Accessible name via `ariaLabel` / `aria-label` required.
  - `aria-disabled` mirrors disabled state for non-native fallbacks.
  - Keyboard parity: `Enter` and `Space` activate.
  - Visible `focus-visible` treatment required (dual rings).
  - Disabled must not paint focus rings (ignore Figma Ghost Disabled DROP_SHADOW quirk).

### Asset resolution + bundling contract
  - Icon input uses `shape` (icon name).
  - Pass `shape` to shared Icon; Icon resolves `assets/icons/<shape>.svg`.
  - Unknown `shape` → Icon missing treatment / validation error (Icon Button has no label fallback).
  - Demo asset: `shape-plus` acceptable; mask variant required for tinting.

### Fallback/error rules
  - Unknown `variant` -> `primary`.
  - Unknown `size` -> `large`.
  - Alias `ghost` -> `ghostNeutral`.
  - Missing `ariaLabel` -> validation error.
  - Missing `shape` -> validation error.
  - `variant=destructive` (if passed) -> validation error (not in Figma set).

### Validation checklist
  - [ ] All variant × size × state combinations resolve tokenized styles.
  - [ ] Focus uses Figma tokens only (`--scale-2`, `--scale-4`, `--color-border-gray-white`, `--color-border-brand-base`) — no invented `--icon-button-focus-*` vars.
  - [ ] Focus uses dual `box-shadow` rings (inner gap + outer brand); **no** `::after` / `outline` focus chrome.
  - [ ] Focus fill matches hover for each variant.
  - [ ] Secondary/tertiary hover/focus use `controls-light`; press uses the press-step fill `controls-press` (Figma Press binds a duplicate `controls-light` variable resolving to `brand-300` / `#97c4e9`); tertiary has no control border on hover/press/focus.
  - [ ] Secondary **press** border stays `var(--color-border-brand-base)`.
  - [ ] Square sizes use `sizing-size-24/32/40` + `padding-padding-none`; glyphs use `ui-icon-spacing-icon-12/14/16` for all types (Ghost Neutral Large = `icon-16`).
  - [ ] Secondary/Tertiary icon colors follow brand-base → brand-strong → brand-stronger ladder from set `52172:249499`.
  - [ ] Ghost Neutral states documented and implemented; disabled has no focus rings.
  - [ ] No Destructive variant.
  - [ ] Disabled/loading modes prevent output events.
  - [ ] Keyboard and pointer activation parity is preserved.
  - [ ] `ariaLabel` required for every instance.
  - [ ] `shape` required; forwarded to Icon `shape`; glyph 12 / 14 / 16 for small / medium / large.

## Source Mapping
- Component map entry: `data/component-figma-map.json` → `Icon Button`.
- Icon Button component set: `52172:249499`.
- Primary Large Default / Focus evidence: `9662:25539` / `9662:25541`.
- Primary Medium / Small Default: `9662:25362` / `52172:249509`.
- Secondary Large Default / Hover / Press: `9662:25528` / `9662:25526` / `9662:25524`.
- Tertiary Large Default / Press: `9662:25517` / `9662:25513`.
- Ghost Neutral Large Default / Hover / Press / Focus / Disabled: `52173:249627` / `52173:249625` / `52173:249623` / `52173:249618` / `52173:249621` (Figma `Type=Ghost`; docs label Ghost Neutral).
- Docs Labels frame: `52188:184316`.
- Sibling text Button: `components/ids/button/design-spec.md` (set `9662:25120`).
- Runtime contract: `component-contracts/ids/icon-button.contract.ts`.
- Reference implementations:
  - React: `lib/react/ids/icon-button/`
  - Angular: `lib/angular/ids/icon-button/`
  - Lit: `lib/lit/ids/src/icon-button/`
- Storybook:
  - React lib: `storybook/src/components/lib-generated/IconButton.stories.tsx`
  - Angular: `storybook-angular/src/components/ids-icon-button/`
  - Lit: `storybook-lit/src/components/IconButton.stories.ts`
  - Spec Generated IDS: `storybook-generated/ids/src/components/IconButton.stories.tsx`
- Live verification (2026-11-04): Figma MCP `create_session` + `get_metadata` on `52172:249499`; `get_variable_defs` on `9662:25539`, `9662:25541`, `9662:25362`, `52172:249509`, `9662:25528`, `9662:25526`, `9662:25524`, `9662:25517`, `9662:25513`, `52173:249627`, `52173:249625`, `52173:249623`, `52173:249618` (file `0bHk3XhrjFhowgFkz9yLr4`).
- Prior verification retained: 2026-10-12 / 2026-10-16 Ghost fill alpha + Storybook-Test cross-checks.

## Implementation Notes

**Icon color**
- Primary: `var(--color-icon-gray-white)` (all interactive states); disabled → `var(--color-icon-gray-disabled)`.
- Secondary: default `brand-base` → hover/focus `brand-strong` → press `brand-stronger`.
- Tertiary: default/hover/focus `brand-strong` → press `brand-stronger`.
- Ghost Neutral: default `var(--color-icon-gray-neutral-base)`; hover/press/focus `var(--color-icon-gray-neutral-strong)`.
- Disabled (all): `var(--color-icon-gray-disabled)`.

**Icon rendering**
- Mask rendering required so CSS `color` tints the icon.

**Control border**
- Inside stroke via `box-shadow: inset 0 0 0 var(--border-width-border-1) <color>`.
- Tertiary never shows a brand control border (default/hover/press/focus).
- Secondary **press** keeps `var(--color-border-brand-base)`.

**Focus**
- Fill matches **hover** for every variant.
- Dual drop shadows (Figma tokens): `0 0 0 var(--scale-2) var(--color-border-gray-white)` then `0 0 0 var(--scale-4) var(--color-border-brand-base)`, stacked after the inset stroke.
- Do not invent `--icon-button-focus-ring-*` aliases; do not use `::after` or CSS `outline` for focus chrome.
- Demo focus via `data-state="focus-visible"` must hit the same `box-shadow` rules.

**Secondary / tertiary fill**
- Hover/focus-visible backgrounds use `var(--color-background-controls-light)` (`brand-200` / `#daeaf7`).
- **Press** backgrounds use `var(--color-background-controls-press)` (`brand-300` / `#97c4e9`).

**Ghost Neutral fills**
- Hover/focus and press fills bind a `Background/Gray Neutral/lighter` variable with baked alpha: `#4556661a` (10%) / `#45566633` (20%).
- Implement as `color-mix(in srgb, var(--ui-palette-slate-600) 10%/20%, transparent)`; do NOT mix the theme's solid `--color-background-gray-neutral-lighter` (`#f4f4f4`).

**Set constraints**
- Types: Primary, Secondary, Tertiary, Ghost (docs label **Ghost Neutral**) — no Destructive, no extra actions beyond Default/Hover/Press/Focus/Disabled.
- Runtime variant: `ghostNeutral` (alias `ghost`).
- Square control + `padding-none`; sizing tokens `size-24/32/40`; glyphs `icon-12/14/16` for all types (Ghost Neutral Large = `icon-16`).
