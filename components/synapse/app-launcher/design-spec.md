# App Launcher Design Spec

## IDS baseline (layout, flow, contracts)

Synapse **App Launcher** inherits the IDS app-switcher contract (popover surface, 2-column product grid, optional options list, masthead trigger). Synapse verifies the same Figma node IDs in the **Synapse Hi-Fi** file with programme-specific border, divider placement, tile interaction, and focus treatments.

- **IDS source of truth:** [`components/ids/app-launcher/design-spec.md`](../ids/app-launcher/design-spec.md)
- **Masthead host:** [`components/synapse/masthead/design-spec.md`](../masthead/design-spec.md) — `MastheadAppLauncherSlot`, `triggerVariant="masthead"`
- **Shared implementation:** `storybook/src/components/AppLauncher.tsx` with `programme="synapse"`; wrapper `SynapseAppLauncher.tsx`
- **Base UI mapping:** `@base-ui-components/react/popover` (via shared `AppLauncher`)
- **Codegen merge:** load IDS spec first, then apply **Synapse programme deltas** and **Programme override rules** in this file's Codegen Contract (programme rows win on conflict).

**Scope of live Synapse verification:** `AppLauncher-Main` `13231:123761`; `AppLauncher-Element` `13231:109521`; product-count variants `13231:124278`–`13231:123730`; 2-product divider `13231:109518` / `13231:124200`.

## Metadata

| Property | Value |
|---|---|
| Component | App Launcher |
| Design system | Synapse |
| Category | Components / Navigation |
| Spec pattern | **ids-fork** (`data/programme-inheritance-registry.json` → `programme: synapse`, `slug: app-launcher`) |
| IDS baseline slug | `app-launcher` |
| Status | **active** |
| Version | 1.1.0 |
| Created | 2026-06-08 |
| Updated | 2026-06-05 |
| Description | Popover app switcher — product tiles in 2-column grid, optional options/footer, masthead or default trigger |
| Figma file | [Synapse Hi-Fi components](https://www.figma.com/design/Td1bnsvRj1PCGs9RVJkIvJ/Synapse-Hi-Fi-components) |
| File key | `Td1bnsvRj1PCGs9RVJkIvJ` |
| Main component set | [`13231:123761`](https://www.figma.com/design/Td1bnsvRj1PCGs9RVJkIvJ/Synapse-Hi-Fi-components?node-id=13231-123761&m=dev) (`AppLauncher-Main`) |
| Element states | [`13231:109521`](https://www.figma.com/design/Td1bnsvRj1PCGs9RVJkIvJ/Synapse-Hi-Fi-components?node-id=13231-109521&m=dev) (`AppLauncher-Element`) |
| Verification method | Figma MCP (`get_metadata`, `get_design_context`, screenshot on `13231:124200`) |
| Last verified | 2026-06-05 |
| Theme CSS | `components/synapse-theme.css` |
| Spec contract | `storybook/src/spec-contracts/synapse-app-launcher.contract.ts` |
| Storybook | `storybook-generated/synapse/src/components/AppLauncher.stories.tsx` |

### Synapse programme deltas (vs IDS)

| Topic | IDS | Synapse (verified) |
|---|---|---|
| Surface border | `var(--color-border-accessible)` | **`var(--color-border-neutral-light)`** |
| Row/column divider token | `var(--color-border-accessible)` | **`var(--color-border-neutral-light)`** |
| Surface padding | `var(--padding-padding-1)` | Same (`1px` inset) — **including 2-product** |
| Multi-row surface gap | implicit | **`var(--spacing-space-1)`** between row groups (`13231:123908`) |
| Tile hover/press fill | **Full `148×125` tile footprint** | **`LabelCluster` only** (`147px` wide inner stack); tile shell stays `surface-2` |
| Tile hover label/icon | neutral strong | neutral strong (unchanged on hover) |
| Tile press label/icon | brand-strong on full tile | **brand-strong** on label + icon when `LabelCluster` has `brand-light` fill |
| Tile focus | outline on tile (`outline-offset: -2px`) | **Inset ring** on tile: `inset 2px 2px 2px 3px`, `var(--corner-radius-radius-4)`, `var(--color-border-brand-base)` (`54003:292178`) |
| 1-product surface width | `298px` (2-col grid) | **`150px`** (`13231:124278`) |
| **2-product vertical divider** | **Internal** `TileDividerRail` on **leading** tile (`13231:109518`) — **dotted** **`110px`** / **`7px`** inset; **no** external column divider | **Same placement as IDS**; token **`var(--color-border-neutral-light)`** |
| 3/4/8 products | external dotted column dividers | Same placement as IDS; **neutral-light** token |
| Options row contract | IDS dropdown option rows | Same structure/tokens as IDS; Synapse surface/divider tokens above |
| Trigger (masthead) | IDS masthead action | Synapse masthead brand fill/hover (`masthead/design-spec.md`) |
| Element `State` axis | default, hover, press, selected, no-icon | **default, hover, press, focus** (`13231:109521`; no separate `selected` symbol) |

### Validated Figma nodes

| Scenario | Node | Size / notes |
|---|---|---|
| Main set | `13231:123761` | `AppLauncher-Main` |
| 1 product | `13231:124278` | `150×127` |
| 2 products | `13231:124200` | `298×127`; IDS internal dotted tile rail on leading tile (`13231:109518`; `110px` / `7px` inset) |
| 3 products | `13231:124054` | `298×254` |
| 4 products | `13231:123908` | `298×254` |
| 8 products | `13231:123730` | `298×416` |
| Tile default | `13231:109520` | `148×125` |
| Tile hover | `13231:109522` | `label` → `brand-lighter` |
| Tile press | `14141:255626` | `label` → `brand-light`; brand-strong text |
| Tile focus | `54003:292178` | inset brand ring; `label` `surface-2` |
| Element set | `13231:109521` | State matrix |
| Divider rail slot | `13231:109518` | Trailing `Div` inside leading `.AppLauncher-Element` (2-product dotted; IDS parity) |

## Anatomy

Deterministic slot order. **Divider placement is programme- and count-dependent** (see Codegen Contract → Programme override rules).

1. `AppLauncherRoot` — popover root + portal
2. `AppLauncherTrigger` — `grid-square-9-16` (`16×16`); `default` or `masthead` variant
3. `AppLauncherSurface` — bordered popover shell
4. `ProductRegion`
5. `ProductRowGroup` — wraps optional row divider + product row (width `100%`)
6. `AppLauncherRowDivider?` — between row groups when `productCount > 2` (or multi-row grid)
7. `ProductRow` — up to two `ProductTile` cells (last row may be single, centered)
8. `AppLauncherColumnDivider?` — when `productCount ≥ 3` only (inherits IDS; **never** on 2-product)
9. `ProductTile` (`TileShell`) — `148×125`; horizontal flex when 2-product internal rail present (inherits IDS)
10. `LabelCluster` — icon + label stack (`147px` content width in Figma)
11. `TileDividerRail?` — **2-product only** — trailing internal `Div` on **leading** tile (`13231:109518`; inherits IDS)
12. `ProductIcon?` — `32×32` (`shield-encrypt-alt` default)
13. `ProductLabel` — Body 2, `111px` max, ellipsis
14. `OptionsRegion?` — options menu block (`Dropdown-SingleSelect-Elements-Menu` pattern)
15. `OptionRow[]`
16. `FooterAction?`

## Layout & Measurements

### Surface (`AppLauncher-Main`)

| Property | Value |
|---|---|
| Width (2+ products) | **`298px`** content (+ `1px` padding) |
| Width (1 product) | **`150px`** |
| Tile footprint | **`148×125`** |
| Surface padding | **`var(--padding-padding-1)`** (all product counts, including 2-product) |
| Border | `var(--border-width-border-1)` `var(--color-border-neutral-light)` |
| Radius | **`0`** |
| Row gap (3+ products) | `var(--spacing-space-1)` between `ProductRowGroup` children |

### `AppLauncher-Element` / `LabelCluster`

| Property | Value |
|---|---|
| Tile size | `148×125` |
| Label cluster width | **`147px`** (Figma inner) |
| Icon | **`32×32`** |
| Label max width | **`111px`**; ellipsis |
| Icon ↔ label gap | `var(--spacing-space-12)` |
| Label stack padding | `var(--padding-padding-28)` block |
| No-icon padding | `var(--padding-padding-52)` block (IDS parity) |

### Dividers

| Type | IDS | Synapse |
|---|---|---|
| Column dotted (3+) | External sibling; `110px` / `7px` inset; `border-accessible` | Same placement; `border-neutral-light` |
| Tile rail (2-product) | Internal on **leading** tile; dotted `110px` / `7px` inset; `border-accessible` | **Same placement as IDS**; `border-neutral-light` |
| Row dotted | `262px` stroke; `16px` parent inset; centered; `border-accessible` | Same geometry; `border-neutral-light` |

### Options region

| Property | Value |
|---|---|
| Block width | **`295px`** (Figma `13231:123642` in 8-product + options usage) |
| Row padding | `var(--padding-padding-10)` block / `var(--padding-padding-16)` left / `var(--padding-padding-24)` right |
| Row min-height | **`40px`** |
| Top separator (when products above) | dashed `var(--color-border-neutral-light)`; inset `var(--padding-padding-16)` |
| List padding | `var(--padding-padding-16)` block when options-only top region |

## Tokens

### Surface + dividers
- `var(--color-background-surface-2)` — launcher + default tile shell
- `var(--color-background-component)` — options region
- `var(--color-border-neutral-light)` — surface border + all dividers (Synapse programme)
- `var(--border-width-border-1)` — borders/dividers
- `var(--shadow-drop-shadow-2-*)`, `var(--shadow-drop-shadow-4-*)` — elevation stack

### Product tile
- Default shell: `var(--color-background-surface-2)`
- Hover cluster: `var(--color-background-brand-lighter)`
- Press cluster: `var(--color-background-brand-light)`
- Default text/icon: `var(--color-text-neutral-strong)` / `var(--color-icon-neutral-strong)`
- Press text/icon: `var(--color-text-brand-strong)` / `var(--color-icon-brand-strong)`
- Focus ring: `var(--color-border-brand-base)`, `var(--corner-radius-radius-4)`

### Options rows (Synapse programme)
- Default background: `var(--color-background-component)`
- Default text: `var(--color-text-neutral)`
- Hover background: `var(--color-background-brand-lighter)`
- Press background: `var(--color-background-brand-light)`
- Press text: `var(--color-text-brand-strong)`
- Row emphasis stroke (hover/press): `var(--color-border-brand-neutral)` inset top/bottom

### Typography
- Product label: `var(--font-size-body-2)` / `var(--font-line-height-line-height-20)`
- Option label: same Body 2 stack

### Spacing
- `var(--spacing-space-1)`, `var(--spacing-space-12)`, `var(--spacing-space-16)`
- `var(--padding-padding-1)`, `var(--padding-padding-10)`, `var(--padding-padding-16)`, `var(--padding-padding-24)`, `var(--padding-padding-28)`, `var(--padding-padding-52)`

## States (Light Theme)

| Element | State | Background | Border / divider | Text / icon |
|---|---|---|---|---|
| `AppLauncherSurface` | default | `var(--color-background-surface-2)` | `1px var(--color-border-neutral-light)` | — |
| `ProductTile` shell | default | `var(--color-background-surface-2)` | dividers `var(--color-border-neutral-light)` | `var(--color-text-neutral-strong)` / `var(--color-icon-neutral-strong)` |
| `LabelCluster` | hover | `var(--color-background-brand-lighter)` | dividers unchanged (never receive fill) | neutral strong |
| `LabelCluster` | press | `var(--color-background-brand-light)` | dividers unchanged | `var(--color-text-brand-strong)` / `var(--color-icon-brand-strong)` |
| `ProductTile` | focus | shell `surface-2`; inset ring `var(--color-border-brand-base)` | dividers unchanged | neutral strong |
| `ProductTile` | no-icon | shell `surface-2` | dividers unchanged | neutral strong text only |
| `OptionRow` | default | `var(--color-background-component)` | none | `var(--color-text-neutral)` |
| `OptionRow` | hover | `var(--color-background-brand-lighter)` | inset stroke `var(--color-border-brand-neutral)` | `var(--color-text-neutral)` |
| `OptionRow` | press | `var(--color-background-brand-light)` | inset stroke `var(--color-border-brand-neutral)` | `var(--color-text-brand-strong)` |

## States (Dark Theme)

Dark theme uses the same semantic tokens as **States (Light Theme)**. Resolved values for `[data-theme="dark"]` / Synapse dark scope live in theme CSS:

- `components/synapse-theme.css`

Duplicate the full state matrix in this section only when a dark row genuinely uses different `var(--...)` references than the corresponding light row.

## Interactions

- Trigger opens popover anchored to trigger (`align: end`; `sideOffset` host-defined; masthead uses effective offset `≥1px`).
- Product tile activates `onSelect` / `href` navigation; host may wire `onProductSelect`.
- **Synapse:** hover/press visual targets **`LabelCluster`** only; **`TileDividerRail`**, **`AppLauncherColumnDivider`**, and **`AppLauncherRowDivider`** never receive interactive fill.
- **Synapse focus:** inset `brand-base` ring on `ProductTile` shell (`54003:292178`).
- Options rows emit `onOptionSelect` / per-row `onSelect`.
- Product count layouts (`1`, `2`, `3`, `4`, `8`) expand deterministically per divider rules below.
- Keyboard: `Enter` / `Space` activates focused tile/option; `Escape` closes popover; `Tab` order: trigger → tiles → options.

### Accessibility

- Trigger: `button`, `aria-label="App launcher"`, `aria-expanded` (and popup id relationship per host primitive).
- Tiles: `button` or `a`; accessible name from product `name`.
- Focus ring per Synapse inset contract; keyboard activation parity with pointer.
- Popup: menu/list semantics appropriate for host framework primitive (`@base-ui-components/react/popover`).

### Behavior & guidelines

- Use `programme="synapse"` or `SynapseAppLauncher` in Synapse apps.
- Masthead: `triggerVariant="masthead"`, `sideOffset={0}` (implementation coerces minimum `1px` offset).
- Figma sample product label: **"Product Name"** — use in spec-accurate stories.
- Host `components/synapse-theme.css` at application root.
- Do not apply IDS full-tile hover when `programme="synapse"`.

## Composition & API (runtime)

### Programme merge (codegen)

1. Parse IDS [`app-launcher`](../ids/app-launcher/design-spec.md) **Composition & API** and **Codegen Contract** as base.
2. Apply rows in **Synapse programme deltas** and **Programme override rules** (this spec) where they conflict.
3. Emit `programme: "synapse"` on root/wrapper unless host overrides (unknown programme → IDS per fallback rules).

### Root props

| Prop | Required | Type / values | Behavior |
|---|---|---|---|
| `programme` | No | `"synapse"` (via `SynapseAppLauncher`) | Enables Synapse tile + divider chrome |
| `products` | No | `{ id?, name, icon?, href?, onSelect? }[]` | Product grid source; wins over `apps` |
| `apps` | No | same shape as `products` | Deprecated alias |
| `options` | No | `{ id?, label, onSelect? }[]` | Lower options list |
| `footerAction` | No | `{ label, onClick }` | Optional footer CTA below options |
| `columns` | No | `number` (default **`2`**) | Product grid columns |
| `triggerVariant` | No | `"default"` \| `"masthead"` | Trigger chrome |
| `sideOffset` | No | `number` (default **`8`**) | Popover offset; masthead coerces **`≥1`** |
| `open` | No | `boolean` | Controlled open state |
| `defaultOpen` | No | `boolean` | Uncontrolled initial open |
| `onOpenChange` | No | `(open: boolean) => void` | Open-state callback |

### Events (host wiring)

| Event | Payload | When |
|---|---|---|
| `onProductSelect` | `{ id, name }` | Product tile activated (if host wires from `onSelect`) |
| `onOptionSelect` | `{ id, label }` | Option row activated |
| `onOpenChange` | `boolean` | Popover open state changes |

### `AppLauncherProductTile` (exported sub-component)

| Prop | Notes |
|---|---|
| `tileDivider` | **`"dotted"`** on **leading** tile when 2-product internal rail (inherits IDS); **`"none"`** otherwise |
| `demoState` | **`"hover"` \| `"press"` \| `"focus"`** — Storybook/state matrix only; maps to `data-state` |

### Spec Accurate Design story defaults

- Component: `SynapseAppLauncher`
- `products`: 2 × `{ name: "Product Name" }`
- `columns`: `2`
- `defaultOpen: true` on demo canvas
- Figma node: **`13231:124200`**

## Codegen Contract (Framework-Agnostic Blueprint)

### IDS merge strategy

```
effectiveSpec = merge(
  load("components/ids/app-launcher/design-spec.md"),
  load("components/synapse/app-launcher/design-spec.md"),
  precedence: "programme-overrides-ids"
)
```

- Programme **deltas table**, **Anatomy** divider rules, **States**, and **Programme override rules** below win over IDS on conflict.
- IDS sections not listed in deltas remain authoritative (popover open/close, options list structure, keyboard traversal, callback payloads).

### Deterministic structure

Emit slots in **Anatomy** order. Conditional branches:

| Condition | Emit |
|---|---|
| `productCount=2` ∧ `!options` (any programme) | `ProductTile` horizontal flex + internal `TileDividerRail` (dotted) on **leading** tile only; **no** `AppLauncherColumnDivider` |
| `productCount ≥ 3` (any programme) | `AppLauncherColumnDivider` (dotted) between tiles in row; `AppLauncherRowDivider` between row groups |
| `options.length > 0` ∨ `footerAction` | `OptionsRegion` after `ProductRegion` |

### Variant matrix

| Axis | Values |
|---|---|
| `programme` | `ids` \| `synapse` |
| `productCount` | `0` \| `1` \| `2` \| `3` \| `4` \| `8` |
| `optionsMode` | `none` \| `options-only` \| `products+options` \| `products+options+footer` |
| `triggerVariant` | `default` \| `masthead` |
| tile `state` | `default` \| `hover` \| `press` \| `focus` \| `no-icon` |

### Programme override rules

| Rule | IDS | Synapse |
|---|---|---|
| 2-product vertical divider | Internal dotted `110px` / `7px` inset on leading tile | **Same as IDS**; token `border-neutral-light` |
| 2-product surface padding | `padding-1` | `padding-1` (same) |
| Tile hover/press target | Full `148×125` tile | `LabelCluster` only |
| Tile focus | Outline on tile | Inset ring on tile shell |
| Divider token | `border-accessible` | `border-neutral-light` |
| 1-product width | `298px` | `150px` |

### Per-slot style contract

| Slot | Synapse tokens / rules |
|---|---|
| `AppLauncherSurface` | `surface-2`, `border-neutral-light`, shadow 2+4; width `150` (1 product) or `298` (2+) |
| `AppLauncherColumnDivider` | 3+ only: dotted `110px` / `7px` inset; `border-neutral-light` |
| `TileDividerRail` | 2-product only: dotted `110px` / `7px` inset on **leading** tile; `border-neutral-light`; inside `ProductTile` (inherits IDS placement) |
| `AppLauncherRowDivider` | dotted `262px` / `16px` parent inset; `border-neutral-light` |
| `LabelCluster` | `space-12` gap, `padding-28`; hover/press backgrounds |
| `ProductLabel` | body-2, `text-neutral-strong`, max `111px`, ellipsis |
| `ProductIcon` | `32×32`, `icon-neutral-strong` / `icon-brand-strong` on press |
| `ProductTile` focus | inset ring `border-brand-base`, `radius-4` |
| `OptionRow` | IDS row metrics; Synapse tokens from **States (Light Theme)** |

### Behavior contract

- Opening launcher does not reorder products.
- Product selection emits at most one `onProductSelect({ id, name })` per activation.
- Option selection emits at most one `onOptionSelect({ id, label })` per activation.
- Divider elements are non-interactive; never inherit hover/press fill.
- **`productCount=2` ∧ `!options`:** render internal dotted `TileDividerRail` on **leading** tile only; **do not** render external `AppLauncherColumnDivider` (IDS + Synapse).
- **`productCount=1` ∧ `!options`:** surface width **`150px`** when `programme=synapse`; IDS uses **`298px`** grid (see IDS spec).
- If `products` empty, options-only layout renders safely.

### Accessibility contract

See **Interactions → Accessibility**. Programme-specific: Synapse focus uses inset ring, not full-tile outline.

### Asset resolution + bundling contract

| Slug | Size | Usage |
|---|---|---|
| `grid-square-9-16` | `16×16` | Trigger |
| `shield-encrypt-alt` | `32×32` | Default product icon |

Resolve via shared `Icon` / `assets/icons/<slug>.svg`. Unknown slug → `shield-encrypt-alt`.

### Fallback/error rules

- If both `products` and `apps` supplied, `products` wins.
- Unknown `columns` → `2`.
- Unknown `programme` → `ids`.
- Missing product `id` → stable generated key in UI; strict codegen mode should warn.
- Missing callbacks → presentational mode (clicks no-op at host layer).

### Validation checklist

- [x] IDS baseline linked; programme deltas table complete and internally consistent
- [x] Live Figma MCP on `13231:123761`, `13231:124200`, `13231:109520`–`54003:292178`, `13231:109518`
- [x] Synapse `border-neutral-light` on surface + dividers
- [x] Label-cluster hover/press (not full tile) when `programme="synapse"`
- [x] Inset focus ring on tile (`54003:292178`)
- [x] Product counts `1/2/3/4/8` layouts match main set (`synapse-app-launcher.contract.ts` nodes)
- [x] 2-product: internal dotted tile rail on leading tile (`110px` / `7px`); inherits IDS placement
- [x] Masthead trigger story with `triggerVariant="masthead"`
- [x] Storybook `Spec Generated/Synapse/App Launcher`
- [x] Light/Dark via `synapse-theme.css` semantic tokens only
- [x] Programme merge strategy documented for framework-agnostic codegen
- [x] No contradictory behavior rules between IDS baseline and Synapse programme deltas

## Source Mapping

| Property | Value |
|---|---|
| Design source | Synapse Hi-Fi `Td1bnsvRj1PCGs9RVJkIvJ` |
| Main component | `13231:123761` |
| Element states | `13231:109521` |
| 2-product variant | `13231:124200` (internal dotted rail on leading tile `13231:109518`) |
| IDS baseline | `components/ids/app-launcher/design-spec.md` |
| IDS usage nodes (parity) | `42266:95085`, `42266:95081` (IDS file `0bHk3XhrjFhowgFkz9yLr4`) |
| Component map | `data/synapse-component-figma-map.json` → App Launcher |
| Registry | `data/programme-inheritance-registry.json` → `synapse` / `app-launcher` |
| Verification | Figma MCP + visual check on `13231:124200` — **2026-06-05** |
