# App Launcher Design Spec

## Metadata
- **Component:** App Launcher
- **Category:** Navigation
- **Design System:** IDS
- **Figma (usage):** `https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=42266-95085&m=dev`
- **Figma (usage alt scenario):** `https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=42266-95081&m=dev`
- **Figma (component details):** `https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=13231-123761&m=dev`
- **Figma (element states):** `https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=13231-109521&m=dev`
- **Figma file key:** `0bHk3XhrjFhowgFkz9yLr4`
- **Validated nodes:** `42266:95085`, `42266:95081`, `13231:123761`, `13231:109521`, `13231:124200` (2 products), `13231:124054` (3 products), `13231:123908` (4 products), `13231:123730` (8 products)
- **Last live verification:** Figma MCP `get_design_context` on product-count variants (`13231:124200`, `13231:124054`, `13231:123908`, `42266:95081`) — 2026-06-05.
## Anatomy
1. `AppLauncherRoot` — popover shell + trigger.
2. `AppLauncherSurface` — `298px` panel (`13231:123761` variants).
3. `ProductRegion` — stacked `ProductRow` groups.
4. `ProductRow` — up to two `ProductTile` cells per row (`2 Across` frames: `14451:155638`, etc.).
5. `AppLauncherColumnDivider` — **separate flex child between tiles** in the same row (not inside the tile control). Dotted `110px` stroke with `7px` inset top and bottom within the `125px` tile block. Solid full `125px` height (no top/bottom gap) for IDS 2-product / no-options (`13231:124200`). Synapse 2-product uses internal tile rails instead (see Synapse spec). Token: `var(--color-border-accessible)`.
6. `AppLauncherRowDivider` — **separate flex child between rows**; dotted `262px` stroke with `var(--padding-padding-16)` inset left and right, horizontally centered in the parent (`13231:124057`, `13231:123911`). Token: `var(--color-border-accessible)`.
7. `ProductTile` (`.AppLauncher-Element` `13231:109521`) — `148×125` interactive cell; hover/press fills full tile; dividers are siblings so fill does not cover separators.
8. `OptionsRegion` — `Dropdown-SingleSelect-Elements-Menu` block (`42266:95081` when products + options).

## Layout & Measurements
- Launcher surface width: `298px` (menu body width observed in usage/details).
- Product tile footprint: `148px x 125px` per `.AppLauncher-Element`.
- Tile state fill behavior: hover/press fills the complete tile footprint (`148px x 125px`); divider remains a separate element and must not be merged into tile background.
- Separator rule: dividers are rendered as separate row/column elements, so product tile occupancy remains full-size; any visual gap is only from outer edge/separator treatment, not from shrinking the tile content area.
- Product icon slot: `32px x 32px`.
- Product label box: `111px` max width with `Body 2` text.
- Vertical product separators: dotted divider using `var(--color-border-accessible)`; `110px` stroke with `7px` inset top and bottom within the `125px` tile block. In 2-product no-options scenario, separator is solid and spans the full `125px` tile height.
- Between-row divider: dotted horizontal separator `262px` wide with `var(--padding-padding-16)` inset left and right, horizontally centered in the parent container.
- Options block width: `295px` in dropdown menu detail node.
- Option row padding: `10px 16px 10px 16px`.
- Surface stroke/shadow:
  - `1px` border
  - Shadow stack represented by `Shadow 1` tokens (`drop-shadow` pair).
## Tokens
- **Surface + borders**
  - `var(--color-background-surface-2)`
  - `var(--color-background-component)`
  - `var(--color-border-accessible)`
- **Text/icon**
  - `var(--color-text-neutral-strong)` (default tile label)
  - `var(--color-text-neutral)` (option rows)
  - `var(--color-text-brand-strong)` (press/selected tile label)
  - `var(--color-icon-neutral-strong)` (default tile icon)
  - `var(--color-icon-brand-strong)` (press/selected tile icon)
- **Interactive backgrounds**
  - `var(--color-background-brand-lighter)` (hover)
  - `var(--color-background-brand-light)` (press/selected)
- **Shadows**
  - `var(--shadow-shadow-4-drop-shadow-4-x)`
  - `var(--shadow-shadow-4-drop-shadow-4-y)`
  - `var(--shadow-shadow-4-drop-shadow-4-blur)`
  - `var(--shadow-shadow-4-drop-shadow-4-spread)`
  - `var(--shadow-shadow-4-drop-shadow-4-color)`
## States (Light Theme)
| Element | State | Background | Border | Text/Icon |
|---|---|---|---|---|
| Launcher surface | default | `var(--color-background-surface-2)` | `1px var(--color-border-accessible)` | n/a |
| Product tile | default | `var(--color-background-surface-2)` | row/column dividers use `var(--color-border-accessible)` | `var(--color-text-neutral-strong)` / `var(--color-icon-neutral-strong)` |
| Product tile | hover | `var(--color-background-brand-lighter)` (fills entire tile footprint) | divider unchanged and rendered as separate element | neutral strong text/icon |
| Product tile | press/selected | `var(--color-background-brand-light)` | divider unchanged | `var(--color-text-brand-strong)` / `var(--color-icon-brand-strong)` |
| Product tile | no-icon variant | `var(--color-background-surface-2)` | divider unchanged | neutral strong text only |
| Options row | default | `var(--color-background-component)` | none | `var(--color-text-neutral)` |
| Options row | hover | `var(--color-background-brand-lighter)` | row-emphasis top/bottom inset stroke `var(--color-border-brand-neutral)` | `var(--color-text-neutral)` |
| Options row | press | `var(--color-background-brand-light)` | row-emphasis top/bottom inset stroke `var(--color-border-brand-neutral)` | `var(--color-text-brand-strong)` |
## States (Dark Theme)
Dark theme follows the same slot/state matrix as Light Theme, resolved exclusively via semantic tokens. No hardcoded colors are permitted in implementation.

| Element | State | Background | Border | Text/Icon |
|---|---|---|---|---|
| Launcher surface | default | semantic token resolved | semantic token resolved | n/a |
| Product tile | default | semantic token resolved | semantic token resolved | semantic token resolved |
| Product tile | hover | semantic token resolved | semantic token resolved | semantic token resolved |
| Product tile | press/selected | semantic token resolved | semantic token resolved | semantic token resolved |
| Options row | default/hover | semantic token resolved | semantic token resolved | semantic token resolved |
## Interactions
- Trigger opens launcher dropdown anchored to masthead app-launcher action.
- Product tile click selects product and emits product-selection event.
- Tile hover and press states follow the state table exactly.
- Options rows are selectable actions; each emits option-selection event.
- When product count increases (`1`, `2`, `3`, `4`, `8`), layout expands deterministically with divider rules preserved.
- Keyboard:
  - `Enter` / `Space` activates focused tile/option.
  - `Escape` closes launcher.
  - `Tab` traverses trigger -> tiles -> options in visible order.
## Composition & API (runtime)
| Slot/Prop | Required | Behavior |
|---|---|---|
| `products` | No | Product items: `{ id, name, iconSlug?, href?, onSelect? }[]`. |
| `apps` | No | Backward-compatible alias for `products`. |
| `options` | No | Lower list actions: `{ id, label, onSelect? }[]`. |
| `footerAction` | No | Optional footer CTA: `{ label, onClick }`. |
| `columns` | No | Product columns; IDS samples use `2`. |
| `triggerVariant` | No | `"default"` or `"masthead"` trigger styling. |
| `sideOffset` | No | Popup vertical offset. |
| `open` | No | Controlled open state. |
| `defaultOpen` | No | Uncontrolled initial state. |
| `onOpenChange(open)` | No | Open-state callback. |
| `onProductSelect(payload)` | No | Emits `{ id, name }` on product selection. |
| `onOptionSelect(payload)` | No | Emits `{ id, label }` on option selection. |
## Codegen Contract (Framework-Agnostic Blueprint)
### Deterministic structure
1. `AppLauncherRoot`
2. `AppLauncherTrigger`
3. `AppLauncherSurface`
4. optional `ProductRegion`
5. `ProductRow[]`
6. `ProductTile[]`
7. optional `OptionsRegion`
8. `OptionRow[]`
9. optional `FooterAction`

### Variant matrix
- `productCount`: `0 | 1 | 2 | 3 | 4 | 8`
- tile state: `default | hover | press | selected | no-icon`
- `triggerVariant`: `default | masthead`
- options mode: `none | options-only | products+options | products+options+footer`

### Per-slot style contract
- `ProductTile`: `148x125`, icon `32x32`, label width clamp `111px`.
- `ProductRegion`: dotted row/column dividers from accessible border token; dividers are independent elements (not part of tile fill layer).
  - vertical dotted divider: `110px` stroke with `7px` inset top/bottom in `125px` tile block.
  - horizontal dotted divider: `262px` stroke with `var(--padding-padding-16)` inset left/right, centered in parent.
- Product content container must span the tile (`width: 100%`, `height: 100%`) so hover/press states use the full tile area.
- `OptionsRegion`: simple stacked rows, no custom radius.
- `OptionRow`: mirrors IDS dropdown-combo-box option contract for default/hover/press token behavior.
- `AppLauncherSurface`: `1px` accessible border + Shadow 1 token stack.

### Behavior contract
- Opening launcher does not mutate product order.
- Product selection emits exactly one `onProductSelect({ id, name })`.
- Option row selection emits exactly one `onOptionSelect({ id, label })`.
- If `products` empty, options-only layout renders safely.

### Accessibility contract
- Trigger is semantic `button` with `aria-expanded` and popup relationship (`aria-controls`/equivalent).
- Popup exposes menu/list semantics appropriate for framework primitives.
- Tiles/rows are keyboard reachable and activation parity exists for pointer and keyboard.

### Asset resolution + bundling contract
- Default product icon slug: `shield-encrypt-alt`.
- Trigger icon slug: `grid-square-9-16`.
- Unknown `iconSlug` fallback: use `shield-encrypt-alt`.

### Fallback/error rules
- If both `products` and `apps` supplied, `products` wins.
- Unknown `columns` fallback to `2`.
- Missing product `id` uses stable generated key but should fail strict validation mode.
- Missing callbacks do not break interaction; component remains purely presentational.

### Validation checklist
- [ ] Surface, tile, divider, and option row metrics match validated nodes.
- [ ] Tile states (`default/hover/press/no-icon`) match state node `13231:109521`.
- [ ] Product count layouts (`1/2/3/4/8`) match component node `13231:123761`.
- [ ] Usage-level masthead anchor/open behavior aligns with nodes `42266:95085` and `42266:95081`.
- [ ] Product and option selection callbacks emit deterministic payloads.
- [ ] Light/Dark styles remain semantic-token driven.
## Source Mapping
- **Component map entry:** `data/component-figma-map.json` -> `App Launcher`.
- **Primary usage node:** `42266:95085`.
- **Secondary usage node:** `42266:95081`.
- **Component details node:** `13231:123761`.
- **Element states node:** `13231:109521`.
- **Figma MCP evidence:** `get_design_context` on all three nodes + `get_variable_defs` on `13231:123761`.
