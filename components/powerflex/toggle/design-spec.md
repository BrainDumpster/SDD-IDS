# Toggle — powerflex/toggle

> PowerFlex toggle switch. Framework-agnostic design specification for the `Toggle` component.

## Metadata

| Property | Value |
|---|---|
| Spec pattern | standalone |
| Programme | PowerFlex |
| Component | Toggle |
| Figma file key | 82bDP05ESsiiGe38p5TEQJ |
| Main component set node | 2754:109 |
| Verification method | Figma REST API |
| Status | active |
| Created | 2026-08-05 |
| Updated | 2026-08-05 |

Figma evidence was packaged by the Collab server from the PowerFlex MCP Design System file. No live Figma MCP call was made from the client.

## Anatomy

The toggle consists of three stacked layers inside every state variant:

- **toggle** (`COMPONENT_SET` `2754:109`) — root container for all 24 state/size permutations.
- **track** (`FRAME`) — pill-shaped background that shows the on/off state.
- **thumb** (`FRAME`) — circular indicator positioned at the left or right of the track.
- **focus-ring** (`FRAME`) — visible focus outline surrounding the track.

State variables: `State` (default, hover, active, disabled) × `Checked` (on, off) × `Size` (sm, md, lg).

## Layout & Measurements

### Component set
- **toggle** `2754:109`: 313 × 728 px, vertical auto-layout, itemSpacing `8px`, cornerRadius `5px`.

### Size matrix

| Size | Track (w × h) | Thumb (w × h) | Focus ring (w × h) |
|---|---|---|---|
| sm | 32 × 16 | 12 × 12 | 38 × 22 |
| md | 44 × 24 | 20 × 20 | 50 × 30 |
| lg | 52 × 28 | 24 × 24 | 58 × 34 |

### Slot geometry (Figma-verified)

| Slot / layer | Property | Token / contract | Figma node | Live evidence |
|---|---|---|---|---|
| track | border-radius | `var(--toggle-track-radius)` → `var(--corner-radius-radius-round)` | `2754:46` | `slotGeometry` cornerRadius=9999.0; boundVariableHints `VariableID:2453:26` (`color/action/primary/default` from `get_variable_defs`) |
| thumb | border-radius | `var(--toggle-thumb-radius)` → `var(--corner-radius-radius-round)` | `2754:47` | `slotGeometry` cornerRadius=9999.0; boundVariableHints `VariableID:2453:4` (variable definition not present in packaged evidence) |
| focus-ring | border-radius | `var(--toggle-focus-ring-radius)` → `var(--corner-radius-radius-round)` | `2754:48` | `slotGeometry` cornerRadius=9999.0; boundVariableHints `VariableID:2453:30` (variable definition not present in packaged evidence) |
| track | fill (on default) | `var(--color-action-primary-default)` | `2754:46` | `get_variable_defs` `VariableID:2453:26` → `color/action/primary/default` |
| track | fill (on hover) | `var(--color-action-primary-hover)` | `2754:50` | `slotGeometry` boundVariableHints `VariableID:2453:27` |
| track | fill (on active) | `var(--color-action-primary-active)` | `2754:54` | `slotGeometry` boundVariableHints `VariableID:2453:28` |
| track | fill (on disabled) | `var(--color-action-primary-disabled)` | `2754:58` | `slotGeometry` boundVariableHints `VariableID:2453:29` |
| track | fill (off default) | `var(--color-action-secondary-default)` | `2754:62` | `slotGeometry` boundVariableHints `VariableID:2453:8` |
| track | fill (off hover) | `var(--color-action-secondary-hover)` | `2754:66` | `slotGeometry` boundVariableHints `VariableID:2453:9` (`color/border/strong` from `get_variable_defs`) |
| track | fill (off active) | `var(--color-action-secondary-active)` | `2754:70` | `slotGeometry` boundVariableHints `VariableID:2453:9` (`color/border/strong` from `get_variable_defs`) |
| track | fill (disabled off) | `var(--color-action-secondary-disabled)` | `2754:74` | `slotGeometry` boundVariableHints `VariableID:2694:2477` |
| thumb | fill | `var(--toggle-thumb-color)` → `var(--color-background-white)` | `2754:47` | `specFragments` thumb fill `#ffffff` |
| focus-ring | stroke | `var(--toggle-focus-ring-color)` → `var(--color-action-primary-default)` | `2754:48` | `specFragments` focus-ring stroke `1.0px` `#0076ce` |

> Note: `boundVariableHints` for `VariableID:2453:4` (thumb) and `VariableID:2453:30` (focus-ring) did not have matching entries in the packaged `get_variable_defs` slice. They are recorded by ID and used as opaque bindings.

### Spacing
- Track padding inferred from geometry: `(track height − thumb height) / 2` = `2px` on all sides. Token: `var(--toggle-track-padding)` (`2px`).

## Tokens

### Colors

| Figma variable / role | CSS token | Light value | Bound variable id |
|---|---|---|---|
| `color/action/primary/default` | `--color-action-primary-default` | `#0076ce` | `VariableID:2453:26` |
| `color/action/primary/hover` (inferred from evidence) | `--color-action-primary-hover` | `#005da4` | `VariableID:2453:27` |
| `color/action/primary/active` (inferred from evidence) | `--color-action-primary-active` | `#00447c` | `VariableID:2453:28` |
| `color/action/primary/disabled` (inferred from evidence) | `--color-action-primary-disabled` | `#f4f4f4` | `VariableID:2453:29` |
| `color/action/secondary/default` (inferred from evidence) | `--color-action-secondary-default` | `#eeeeee` | `VariableID:2453:8` |
| `color/border/strong` (`off active` reuse) | `--color-action-secondary-active` | `#333333` | `VariableID:2453:9` |
| `color/border/strong` (`off hover` reuse) | `--color-action-secondary-hover` | `#888888` | `VariableID:2453:9` |
| disabled off track | `--color-action-secondary-disabled` | `#f4f4f4` | `VariableID:2694:2477` |
| thumb fill | `--toggle-thumb-color` | `#ffffff` | `VariableID:2453:4` |
| focus-ring stroke | `--toggle-focus-ring-color` | `#0076ce` | n/a |

### Geometry / radius

| Token | Value |
|---|---|
| `--corner-radius-radius-round` | `999999px` (full pill) |
| `--toggle-track-radius` | `var(--corner-radius-radius-round)` |
| `--toggle-thumb-radius` | `var(--corner-radius-radius-round)` |
| `--toggle-focus-ring-radius` | `var(--corner-radius-radius-round)` |
| `--toggle-track-padding` | `2px` |
| `--toggle-focus-ring-stroke` | `1px` |

## States (Light Theme)

| State | Checked | Background | Border | Text-Icon |
|---|---|---|---|---|
| default | on | `var(--color-action-primary-default)` | `var(--toggle-focus-ring-color)` | `var(--toggle-thumb-color)` |
| hover | on | `var(--color-action-primary-hover)` | `var(--toggle-focus-ring-color)` | `var(--toggle-thumb-color)` |
| active | on | `var(--color-action-primary-active)` | `var(--toggle-focus-ring-color)` | `var(--toggle-thumb-color)` |
| disabled | on | `var(--color-action-primary-disabled)` | `var(--color-border-light)` | `var(--toggle-thumb-color)` |
| default | off | `var(--color-action-secondary-default)` | `var(--toggle-focus-ring-color)` | `var(--toggle-thumb-color)` |
| hover | off | `var(--color-action-secondary-hover)` | `var(--toggle-focus-ring-color)` | `var(--toggle-thumb-color)` |
| active | off | `var(--color-action-secondary-active)` | `var(--toggle-focus-ring-color)` | `var(--toggle-thumb-color)` |
| disabled | off | `var(--color-action-secondary-disabled)` | `var(--color-border-light)` | `var(--toggle-thumb-color)` |

## States (Dark Theme)

The PowerFlex packaged evidence did not include a dark-mode variable collection. The same semantic token contract is used; dark values are resolved from `components/powerflex-theme.css` and should be updated when a verified PowerFlex dark library is synced.

| State | Checked | Background | Border | Text-Icon |
|---|---|---|---|---|
| default | on | `var(--color-action-primary-default)` | `var(--toggle-focus-ring-color)` | `var(--toggle-thumb-color)` |
| hover | on | `var(--color-action-primary-hover)` | `var(--toggle-focus-ring-color)` | `var(--toggle-thumb-color)` |
| active | on | `var(--color-action-primary-active)` | `var(--toggle-focus-ring-color)` | `var(--toggle-thumb-color)` |
| disabled | on | `var(--color-action-primary-disabled)` | `var(--color-border-light)` | `var(--toggle-thumb-color)` |
| default | off | `var(--color-action-secondary-default)` | `var(--toggle-focus-ring-color)` | `var(--toggle-thumb-color)` |
| hover | off | `var(--color-action-secondary-hover)` | `var(--toggle-focus-ring-color)` | `var(--toggle-thumb-color)` |
| active | off | `var(--color-action-secondary-active)` | `var(--toggle-focus-ring-color)` | `var(--toggle-thumb-color)` |
| disabled | off | `var(--color-action-secondary-disabled)` | `var(--color-border-light)` | `var(--toggle-thumb-color)` |

## Interactions

### Behavior & guidelines
- The toggle changes `checked` state when clicked or activated with `Space` / `Enter`.
- Hover darkens the track fill (`hover` tokens); active/press darkens further.
- Disabled toggles keep the thumb visible but use the disabled track fill and do not respond to input.
- The focus ring appears on keyboard focus and is a full-pill stroke outside the track.

### Accessibility
- Native checkbox behavior must be preserved (or an `aria-checked`/`role="switch"` equivalent).
- Focus indicator must be visible and color-contrasted.
- Disabled state must communicate non-interactivity (`disabled`/`aria-disabled`).

## Composition & API (runtime)

### Variants
| Variant | Type | Default | Notes |
|---|---|---|---|
| `checked` | `boolean` | `false` | Controls thumb position and track background. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Track and thumb dimensions scale. |
| `disabled` | `boolean` | `false` | Prevents interaction and applies disabled tokens. |

### Runtime API
- `onChange(checked: boolean)` — user toggled the control.
- `inputRef` — access to the underlying `<input type="checkbox">` or switch element.
- Optional `aria-label` or visible label association.

## Codegen Contract (Framework-Agnostic Blueprint)

### Deterministic structure
- Root: `<label>` or `<span>` wrapping a visually hidden `<input type="checkbox">` and two presentational `<span>` slots (`track`, `thumb`). Focus ring is a separate `<span>` rendered behind or around the track.
- Slot order in DOM: `focus-ring` (optional, absolute), `track`, `thumb`.

### Variant matrix
| Variant | Values | Node example |
|---|---|---|
| `checked` | `true`, `false` | `2754:45` (on default md), `2754:61` (off default md) |
| `size` | `sm`, `md`, `lg` | `2754:45` md, `2754:77` lg |
| `state` | `default`, `hover`, `active`, `disabled` | `2754:45` default, `2754:49` hover, `2754:53` active, `2754:57` disabled |

### Per-slot style contract
- **track**: `border-radius: var(--toggle-track-radius); width/height from size matrix; background: var(--color-action-...);`
- **thumb**: `border-radius: var(--toggle-thumb-radius); width/height from size matrix; background: var(--toggle-thumb-color); position absolute; left/right padding var(--toggle-track-padding);`
- **focus-ring**: `border-radius: var(--toggle-focus-ring-radius); border: var(--toggle-focus-ring-stroke) solid var(--toggle-focus-ring-color); width/height from size matrix;`

### Behavior contract
- Click/tap toggles `checked`.
- Keyboard `Space` toggles; `Tab` moves focus.
- Disabled state suppresses state changes and hover styling.
- Focus ring only visible on keyboard focus.

### Accessibility contract
- Hidden checkbox must carry `checked`, `disabled`, `aria-checked` (or use `role="switch"`).
- Label must be programmatically associated (`for`/`id` or wrapping `<label>`).

### Asset resolution + bundling contract
- No icons or image assets required.
- Theme CSS import: `components/powerflex-theme.css`.

### Fallback/error rules
- If `size` is missing, default to `md`.
- If `checked` is missing, default to `false`.
- If a token is missing, fall back to the `default`/`off` token and warn.

### Validation checklist
- [ ] `track` and `thumb` border-radius are full pill (`999999px` equivalent) for all sizes/states.
- [ ] State classes match `default`, `hover`, `active`, `disabled` and apply the tokens from the light/dark matrices.
- [ ] Hidden input is wired to `checked` and `disabled`.
- [ ] Focus ring is visible on keyboard focus.
- [ ] Theme CSS is imported and `data-design-system="powerflex"` is set.

## Source Mapping

| Source | File key / Node id | Verification method |
|---|---|---|
| Figma file | `82bDP05ESsiiGe38p5TEQJ` | Figma REST API |
| Main component set | `2754:109` | Figma REST API `get_metadata` + `slotGeometry` |
| md on default (track/thumb/focus) | `2754:46` / `2754:47` / `2754:48` | Figma REST API |
| md off default (track) | `2754:62` | Figma REST API |
| md off hover / active (track) | `2754:66` / `2754:70` | Figma REST API |
| md disabled on / off (track) | `2754:58` / `2754:74` | Figma REST API |
