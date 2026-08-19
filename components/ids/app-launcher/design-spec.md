# App Launcher Design Spec

Popover app switcher — product tiles in a 2-column grid, optional options/footer list, default or masthead trigger. Programme forks (Synapse) layer on this IDS contract via `components/synapse/app-launcher/design-spec.md`.

## Metadata

| Property | Value |
|---|---|
| Component | App Launcher |
| Design system | IDS |
| Category | Components / Navigation |
| Status | **active** |
| Version | 1.2.0 |
| Created | 2026-06-05 |
| Updated | 2026-07-29 |
| Description | Popover app switcher — product tiles in 2-column grid, optional options/footer, masthead or default trigger |
| Figma file | [IDS Design Library](https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library) |
| File key | `0bHk3XhrjFhowgFkz9yLr4` |
| Usage (masthead) | [`42266:95085`](https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=42266-95085&m=dev) |
| Usage (products + options) | [`42266:95081`](https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=42266-95081&m=dev) |
| Main component set | [`13231:123761`](https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=13231-123761&m=dev) (`AppLauncher-Main`) |
| Element states | [`13231:109521`](https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=13231-109521&m=dev) (`AppLauncher-Element`) |
| Verification method | Figma MCP (`get_metadata`, `get_design_context`, `get_variable_defs`) |
| Last verified | 2026-07-28 (impl fixes verified live in Storybook; see **Implementation Notes**) |
| Theme CSS | `components/ids-theme.css` |
| Shared implementation | `storybook/src/components/AppLauncher.tsx` (`programme="ids"` default) |
| Storybook | `storybook-generated/ids/src/components/AppLauncher.stories.tsx` |
| Programme fork | `components/synapse/app-launcher/design-spec.md` (Synapse deltas) |

### Validated Figma nodes

| Scenario | Node | Size / notes |
|---|---|---|
| Masthead usage | `42266:95085` | Launcher anchored to masthead app action |
| Products + options usage | `42266:95081` | Grid + `Dropdown-SingleSelect-Elements-Menu` |
| Main set | `13231:123761` | `AppLauncher-Main` variant axes |
| 2 products (no options) | `13231:124200` | `298×127`; **internal** dotted tile rail on **leading** tile (`13231:109518`; `110px` / `7px` inset) |
| 3 products | `13231:124054` | `298×254`; dotted column + row dividers |
| 4 products | `13231:123908` | `298×254` |
| 8 products | `13231:123730` | `298×448`; largest variant renders **4 product tiles + options menu** (not 8 tiles) |
| Tile default | `13231:109520` | `148×125` |
| Tile hover | `13231:109522` | full-tile `brand-lighter` fill |
| Tile press | `14141:255626` | full-tile `brand-light` fill; brand-strong text/icon |
| Element set | `13231:109521` | State matrix (`default`, `hover`, `press`, `selected`, `no-icon`) |
| Row divider sample | `13231:124057`, `13231:123911` | Horizontal dotted `262px` / `16px` inset |

## Anatomy

Deterministic slot order. **3+ products:** column dividers are **separate flex siblings** between tiles so hover/press fill does not cover separators. **2 products (no options):** vertical separator is an **internal** `TileDividerRail` on the **leading** tile in each row (`13231:109518`); **no** external `AppLauncherColumnDivider`.

1. `AppLauncherRoot` — popover root + portal (`@base-ui-components/react/popover` in reference impl)
2. `AppLauncherTrigger` — `grid-square-9-16` (`16×16`); `default` or `masthead` variant
3. `AppLauncherSurface` — bordered popover shell (`298px` or `150px` when 1 product)
4. `ProductRegion` — stacked row groups
5. `ProductRowGroup` — wraps optional row divider + product row (`width: 100%`)
6. `AppLauncherRowDivider?` — between row groups when `productCount > 2` (multi-row grid)
7. `ProductRow` — up to two `ProductTile` cells per row (`2 Across` frames: `14451:155638`, etc.)
8. `AppLauncherColumnDivider?` — **between tiles in the same row** when `productCount ≥ 3` only (**dotted** `110px` / `7px` inset)
9. `ProductTile` (`.AppLauncher-Element` `13231:109521`) — `148×125` interactive cell; horizontal flex when 2-product internal rail present; **IDS:** hover/press fills **entire tile footprint**
10. `LabelCluster` — icon + label stack (`147px` inner width in 2-product layout)
11. `TileDividerRail?` — **2-product only** — trailing internal `Div` on **leading** tile (`13231:109518`); dotted `110px` / `7px` inset
12. `ProductIcon?` — `32×32` (`shield-encrypt-alt` default)
13. `ProductLabel` — Body 2, `111px` max width, ellipsis
14. `OptionsRegion?` — `Dropdown-SingleSelect-Elements-Menu` block (`42266:95081`)
15. `OptionRow[]`
16. `FooterAction?`

> **Programme note:** Synapse inherits this 2-product divider placement and geometry; programme deltas are token chrome only (`border-neutral-light` vs `border-accessible`) — see Synapse fork spec.

## Layout & Measurements

### Surface (`AppLauncher-Main`)

| Property | Value |
|---|---|
| Width (2+ products) | fixed **`298px`** (`box-sizing: border-box`); content area `296px` = two `148px` tiles |
| Width (1 product, no options) | **`150px`** |
| Tile footprint | **`148×125`** per `.AppLauncher-Element` |
| Padding | **`1px`** all sides |
| Border | **`1px`** `var(--color-border-gray-neutral-base)`, drawn as an inset box-shadow (does not consume layout) so `298px − 2px padding = 296px` content |
| Shadow | Shadow 4 token stack (`drop-shadow` pair) |

### Product tile

| Property | Value |
|---|---|
| Tile size | `148×125` |
| Icon slot | **`32×32`** |
| Icon color | **`currentColor`** — inherits tile color: `var(--color-icon-gray-neutral-strong)` (default/hover), `var(--color-icon-brand-strong)` (press). Asset SVG must use `fill: currentColor`, **not a hardcoded fill** |
| Label max width | **`111px`**; Body 2; ellipsis |
| Label padding | **`28px 0`** (icon variant); **`52px 0`** (no-icon). Horizontal padding is `0` (Figma `padding-none`) |
| Tile fill (hover/press) | **Full `148×125` footprint**; divider siblings unchanged |

### `AppLauncherColumnDivider` (IDS, 3+ products)

| Variant | When | Stroke | Inset |
|---|---|---|---|
| **dotted** | `productCount ≥ 3` | **`110px`** dotted stroke | **`7px`** top and bottom within `125px` tile block |

Token: `var(--color-border-gray-neutral-base)`.

### `TileDividerRail` (IDS, 2 products, no options)

| Property | Value |
|---|---|
| Placement | Internal trailing slot on **leading** tile in each row (`13231:109518`) |
| Stroke | **`110px`** dotted |
| Inset | **`7px`** top and bottom within `125px` tile block |
| Token | `var(--color-border-gray-neutral-base)` |
| External column divider | **Not emitted** between tiles when `productCount === 2` ∧ `!options` |

### `AppLauncherRowDivider`

| Property | Value |
|---|---|
| Stroke width | **`262px`** dotted |
| Horizontal inset | `var(--padding-padding-16)` left and right |
| Alignment | centered in parent row group |
| Token | `var(--color-border-gray-neutral-base)` |

### Options region

| Property | Value |
|---|---|
| Block width | **`295px`**, centered within the `298px` surface (`margin-inline: auto`); option rows fill the block |
| Options list block padding | **`16px`** bottom (`var(--padding-padding-16)`); `1px` left/right |
| Option row padding | `10px 24px 10px 16px` (top/bottom `10`, left `16`, right `24`) |
| Option text overflow | single-line — truncates on the **first line** with an ellipsis (`text-overflow: ellipsis`; `white-space: nowrap`) |
| Row contract | mirrors `Dropdown-SingleSelect-Elements-Options` (`337:180199`) — **re-implemented locally in App Launcher, not reusing `DropdownMenu`** |

## Tokens

### Surface + borders
- `var(--color-background-surface-secondary)` — launcher surface, default tile shell
- `var(--color-background-surface-component)` — options row default
- `var(--color-border-gray-neutral-base)` — surface border, column/row dividers
- `var(--color-border-brand-base-neutral)` — options row hover/press emphasis stroke
- `var(--border-width-border-1)` — surface, dividers
- `var(--border-width-border-2)` — tile focus outline
- `var(--padding-padding-1)` — surface inset
- `var(--padding-padding-16)` — row divider horizontal inset

### Text + icon
- `var(--color-text-gray-neutral-strong)` — default tile label
- `var(--color-text-gray-neutral)` — options rows
- `var(--color-text-brand-strong)` — press/selected tile label and options press
- `var(--color-text-gray-white)` — masthead trigger icon
- `var(--color-icon-gray-neutral-strong)` — default tile icon
- `var(--color-icon-brand-strong)` — press/selected tile icon

### Interactive backgrounds
- `var(--color-background-brand-lighter-slate)` — tile/options hover
- `var(--color-background-brand-light-slate)` — tile/options press/selected

### Shadows
- `var(--shadow-shadow-4-drop-shadow-4-x)`
- `var(--shadow-shadow-4-drop-shadow-4-y)`
- `var(--shadow-shadow-4-drop-shadow-4-blur)`
- `var(--shadow-shadow-4-drop-shadow-4-spread)`
- `var(--shadow-shadow-4-drop-shadow-4-color)`

## States (Light Theme)

| Element | State | Background | Border | Text/Icon |
|---|---|---|---|---|
| Launcher surface | default | `var(--color-background-surface-secondary)` | `1px var(--color-border-gray-neutral-base)` | n/a |
| Product tile | default | `var(--color-background-surface-secondary)` | dividers: `var(--color-border-gray-neutral-base)` | `var(--color-text-gray-neutral-strong)` / `var(--color-icon-gray-neutral-strong)` |
| Product tile | hover | `var(--color-background-brand-lighter-slate)` (full tile) | dividers unchanged (separate elements) | `var(--color-text-gray-neutral-strong)` / `var(--color-icon-gray-neutral-strong)` |
| Product tile | press/selected | `var(--color-background-brand-light-slate)` | dividers unchanged | `var(--color-text-brand-strong)` / `var(--color-icon-brand-strong)` |
| Product tile | focus | `var(--color-background-surface-secondary)` | `outline: var(--border-width-border-2) var(--color-border-brand-base)`; `outline-offset: -2px` | neutral strong |
| Product tile | no-icon | `var(--color-background-surface-secondary)` | dividers unchanged | `var(--color-text-gray-neutral-strong)` only |
| Options row | default | `var(--color-background-surface-component)` | none | `var(--color-text-gray-neutral)` |
| Options row | hover | `var(--color-background-brand-lighter-slate)` | inset top/bottom `var(--color-border-brand-base-neutral)` | `var(--color-text-gray-neutral)` |
| Options row | press | `var(--color-background-brand-light-slate)` | inset top/bottom `var(--color-border-brand-base-neutral)` | `var(--color-text-brand-strong)` |

## States (Dark Theme)

Dark theme uses the same semantic tokens as **States (Light Theme)**. Resolved values for `[data-theme="dark"]` / `.ids-theme-dark` (and program overlays) live in theme CSS:

- `components/ids-theme.css`
- `components/<program>-theme.css` when a program overlays IDS (for example `components/dap-theme.css`)

Duplicate the full state matrix in this section only when a dark row genuinely uses different `var(--...)` references than the corresponding light row.

## Interactions

- Trigger opens launcher popover anchored to trigger (masthead usage: `42266:95085`).
- Product tile click selects product and emits `onProductSelect({ id, name })`.
- Tile hover and press states follow the state table; fill covers **full tile** (IDS).
- Options rows are selectable; each emits `onOptionSelect({ id, label })`.
- Product count layouts (`1`, `2`, `3`, `4`, `8`) expand deterministically; divider rules preserved per **Layout & Measurements**.
- `data-state` / `demoState` forced values are Storybook/demo-only; runtime interaction must not be blocked.

### Keyboard
- `Enter` / `Space` activates focused tile/option.
- `Escape` closes launcher.
- `Tab` traverses trigger → tiles → options in visible order.

### Accessibility

- Trigger: semantic `button`, `aria-label="App launcher"`, `aria-expanded`, popup id relationship per host primitive.
- Tiles: `button` or `a`; accessible name from product `name`.
- Dividers: `aria-hidden="true"`.
- Focus ring on tile per IDS outline contract; keyboard activation parity with pointer.
- Popup: menu/list semantics appropriate for host framework primitive.

### Behavior & guidelines

- Default `programme` is **`ids`** (or omit prop).
- Masthead: `triggerVariant="masthead"`, `sideOffset={0}` (implementation coerces minimum **`1px`** offset).
- Host **`components/ids-theme.css`** at application root.
- Programme forks: load Synapse spec when `programme="synapse"` — see `components/synapse/app-launcher/design-spec.md`.

## Composition & API (runtime)

| Prop | Type / default | Behavior |
|---|---|---|
| `programme` | `"ids"` \| `"synapse"` | default **`"ids"`**; Synapse chrome via fork spec |
| `products` | `{ id?, name, icon?, href?, onSelect? }[]` | Product grid; wins over `apps` |
| `apps` | same as `products` | Deprecated alias |
| `options` | `{ id?, label, onSelect? }[]` | Lower options list |
| `footerAction` | `{ label, onClick }` | Optional footer CTA |
| `columns` | `number` | default **`2`** |
| `triggerVariant` | `"default"` \| `"masthead"` | default **`"default"`** |
| `sideOffset` | `number` | default **`8`**; masthead coerces **`≥1`** |
| `open` | `boolean?` | Controlled open state |
| `defaultOpen` | `boolean?` | Uncontrolled initial open |
| `onOpenChange` | `(open: boolean) => void` | Open-state callback |
| `onProductSelect` | `({ id, name }) => void` | Product tile activated (host wiring) |
| `onOptionSelect` | `({ id, label }) => void` | Option row activated |

### Exported sub-components

| Component | Purpose |
|---|---|
| `AppLauncherProductTile` | Standalone tile for state-matrix stories |
| `AppLauncherColumnDivider` | Vertical separator (`variant: solid \| dotted`) |
| `AppLauncherRowDivider` | Horizontal row separator |

## Codegen Contract (Framework-Agnostic Blueprint)

### Deterministic structure

Emit slots in **Anatomy** order. Conditional branches (IDS):

| Condition | Emit |
|---|---|
| `productCount === 2` ∧ `!options` | `TileDividerRail` (**dotted**) on **leading** tile only; horizontal tile flex; **no** external `AppLauncherColumnDivider` |
| `productCount ≥ 3` | `AppLauncherColumnDivider` (**dotted**) between tiles in row |
| `rowIndex > 0` | `AppLauncherRowDivider` before product row |
| `options.length > 0` ∨ `footerAction` | `OptionsRegion` after `ProductRegion` |
| `programme=synapse` | defer tile hover/focus chrome to Synapse fork spec; **divider placement inherits IDS** |

Ordered slot list:

1. `AppLauncherRoot`
2. `AppLauncherTrigger`
3. `AppLauncherSurface`
4. `ProductRegion`
5. `ProductRowGroup[]`
6. `AppLauncherRowDivider?`
7. `ProductRow`
8. `AppLauncherColumnDivider?`
9. `ProductTile[]`
10. `OptionsRegion?`
11. `OptionRow[]`
12. `FooterAction?`

### Variant matrix

| Axis | Values |
|---|---|
| `programme` | `ids` (default) \| `synapse` (fork) |
| `productCount` | `0` \| `1` \| `2` \| `3` \| `4` \| `8` |
| `optionsMode` | `none` \| `options-only` \| `products+options` \| `products+options+footer` |
| `triggerVariant` | `default` \| `masthead` |
| column divider `variant` | `dotted` (3+ external) |
| tile rail `variant` | `dotted` (2-product internal, leading tile only) |
| tile `state` | `default` \| `hover` \| `press` \| `selected` \| `focus` \| `no-icon` |

### Per-slot style contract

| Slot | IDS rule |
|---|---|
| `AppLauncherSurface` | `surface-2`, `border-accessible`, shadow 4; width `150` (1 product) or `298` (2+) |
| `ProductTile` | `148×125`; icon `32×32`; label clamp `111px`; **full-tile** hover/press fill |
| `AppLauncherColumnDivider` | **dotted:** `110px` stroke, `7px` inset; token `border-accessible` (3+ only) |
| `TileDividerRail` | **dotted:** `110px` stroke, `7px` inset; token `border-accessible` (2-product leading tile) |
| `AppLauncherRowDivider` | `262px` dotted; `padding-16` horizontal inset; centered |
| `OptionRow` | IDS dropdown-combo-box option token contract |
| `AppLauncherTrigger` | `grid-square-9-16`; masthead → white icon |

### Behavior contract

- Opening launcher does not mutate product order.
- Product selection emits exactly one `onProductSelect({ id, name })` when host wires callback.
- Option row selection emits exactly one `onOptionSelect({ id, label })`.
- If `products` empty, options-only layout renders safely.
- `products` wins when both `products` and `apps` supplied.
- Dividers remain non-interactive siblings; tile fill must not paint over dividers.

### Accessibility contract

See **Interactions → Accessibility**.

### Asset resolution + bundling contract

| Slug | File | Size | Usage |
|---|---|---|---|
| `shield-encrypt-alt` | `assets/icons/shield-encrypt-alt.svg` | `32×32` (displayed in `16×16` trigger context for grid icon at `16×16`) | Default product tile icon |
| `grid-square-9-16` | `assets/icons/grid-square-9-16.svg` | `16×16` | Trigger icon |

Resolve via shared `Icon` component (`import.meta.glob` on `assets/icons/*.svg` in reference impl). Unknown `iconSlug` → fallback **`shield-encrypt-alt`**. Missing asset → omit icon slot (layout preserved).

### Fallback/error rules

- If both `products` and `apps` supplied, `products` wins.
- Unknown `columns` → `2`.
- Unknown `programme` → `ids`.
- Missing product `id` → stable generated key; strict validation mode should fail.
- Missing callbacks → component remains presentational; interactions still work locally.

### Validation checklist

- [x] Metadata complete with Figma file key + validated node IDs
- [x] Live Figma MCP on `13231:124200`, `13231:124054`, `13231:123908`, `42266:95081` (2026-06-05)
- [x] Surface `298px` / tile `148×125` / icon `32×32` / label `111px` match Figma
- [x] IDS 2-product **internal dotted** tile rail `110px` / `7px` inset on leading tile documented (`13231:124200`, `13231:109518`)
- [x] 3+ product **dotted** column divider `110px` / `7px` inset documented
- [x] Row divider `262px` / `padding-16` inset documented
- [x] Dividers as separate flex siblings in anatomy + codegen structure
- [x] Tile states (`default/hover/press/selected/no-icon/focus`) match `13231:109521`
- [x] Product count layouts (`1/2/3/4/8`) match `13231:123761` variants
- [x] Usage masthead + products+options align with `42266:95085`, `42266:95081`
- [x] Composition/API props, events, and defaults explicit
- [x] Asset slug → `assets/icons/<slug>.svg` mapping documented
- [x] Light/Dark via `ids-theme.css` semantic tokens only
- [x] Storybook reference: `storybook-generated/ids/src/components/AppLauncher.stories.tsx`
- [x] Synapse fork documented at `components/synapse/app-launcher/design-spec.md`

## Implementation Notes

_Updated 2026-07-29._

- **Product icon color** — the product icon inherits the tile color via `currentColor`: `var(--color-icon-gray-neutral-strong)` for default and hover, `var(--color-icon-brand-strong)` for press. The icon asset uses `fill: currentColor` so it tracks theme and state (light `#252525`, dark `#b8c1c9`, press `#055fa9`).
- **Label padding** — label cluster is `28px 0` (icon variant) / `52px 0` (no-icon); horizontal padding is `0`.
- **Surface width & border** — fixed **`298px`** with **`1px`** padding; the `1px` border is an inset box-shadow (not `border`) so it does not consume layout, leaving `296px` content (two `148px` tiles). Never stretches with option text. The options menu is a **`295px`** block centered within it (`margin-inline: auto`); option rows are **`293px`** (`1px` inset each side).
- **Options list padding** — `16px` above the first option row and below the last.
- **Option text overflow** — long option text truncates on the **first line** with an ellipsis (single line, no wrap).
- **Option row** — follows the `Dropdown-SingleSelect-Elements-Options` contract as a standalone element (not a shared dropdown component).
- **Demo matrix** — demo panels keep their natural height (grid `align-items: start`); the products-plus-options variant shows `4` products + `4` options.

## Source Mapping

| Property | Value |
|---|---|
| Design source | IDS Design Library `0bHk3XhrjFhowgFkz9yLr4` |
| Component map | `data/component-figma-map.json` → `App Launcher` |
| Usage (masthead) | `42266:95085` |
| Usage (products + options) | `42266:95081` |
| Main component set | `13231:123761` |
| Element states | `13231:109521` |
| 2 products | `13231:124200` |
| 3 products | `13231:124054` |
| 4 products | `13231:123908` |
| 8 products | `13231:123730` |
| Shared implementation | `storybook/src/components/AppLauncher.tsx` |
| Storybook | `storybook-generated/ids/src/components/AppLauncher.stories.tsx` |
| Programme fork | `components/synapse/app-launcher/design-spec.md` |
| Verification | Figma MCP — **2026-06-05** |
