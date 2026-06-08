# Left Nav Design Spec

## IDS baseline (layout, flow, contracts)

Synapse **Left Nav** is the same component family as IDS **Main Menu/Left**. Layout, scroll model, selection/navigation contracts, link discriminated union, footer **49px** block, and primary/secondary row geometry match the IDS spec unless noted in **Synapse programme deltas** below.

- **IDS source of truth:** [`components/ids/main-menu-left/design-spec.md`](../ids/main-menu-left/design-spec.md)
- **Shared implementation:** `storybook/src/components/MainMenuLeft.tsx`, `MainMenuLeft.module.css` (`programme="synapse"` applies Synapse chrome)
- **Synapse wrapper:** `storybook/src/components/SynapseLeftNav.tsx` (passes `menuLead` / `newChat` into `MainMenuList`)

## Metadata
- Component: Left Nav
- Design System: Synapse
- Category: Navigation
- Spec pattern: **ids-fork** (registry: `data/programme-inheritance-registry.json` → `programme: synapse`, `slug: left-nav`)
- IDS baseline slug: `main-menu-left`
- Status: **active**
- Version: 1.0.0
- Figma file: [Synapse Hi-Fi components](https://www.figma.com/design/Td1bnsvRj1PCGs9RVJkIvJ/Synapse-Hi-Fi-components)
- File key: `Td1bnsvRj1PCGs9RVJkIvJ`
- Main component set: `MainMenu-Left-Main` (`47807:8153`) — same Figma naming as IDS `11099:56205`
- Expanded reference: [47807:8154](https://www.figma.com/design/Td1bnsvRj1PCGs9RVJkIvJ/Synapse-Hi-Fi-components?node-id=47807-8154) — `State=Expanded, Initial State=false` (`250×700`)
- Collapsed reference: [47807:8166](https://www.figma.com/design/Td1bnsvRj1PCGs9RVJkIvJ/Synapse-Hi-Fi-components?node-id=47807-8166) — `State=Collapsed, Initial State=false` (`64×700`)
- Primary element set: [47807:8058](https://www.figma.com/design/Td1bnsvRj1PCGs9RVJkIvJ/Synapse-Hi-Fi-components?node-id=47807-8058) — `.MainMenu-Left-Element-Primary`
- Primary icon-only: [47807:8043](https://www.figma.com/design/Td1bnsvRj1PCGs9RVJkIvJ/Synapse-Hi-Fi-components?node-id=47807-8043) — `.MainMenu-Left-Element-PrimaryIcon`
- Secondary element set: [47807:8028](https://www.figma.com/design/Td1bnsvRj1PCGs9RVJkIvJ/Synapse-Hi-Fi-components?node-id=47807-8028) — `.MainMenu-Left-Element-Secondary`
- Secondary **selected** usage: [50512:84338](https://www.figma.com/design/Td1bnsvRj1PCGs9RVJkIvJ/Synapse-Hi-Fi-components?node-id=50512-84338&m=dev) — Recent chats expanded, one secondary row selected
- Secondary **hover** usage: [50514:23038](https://www.figma.com/design/Td1bnsvRj1PCGs9RVJkIvJ/Synapse-Hi-Fi-components?node-id=50514-23038&m=dev) — hovered secondary row
- Secondary **context-menu** usage: [50514:23038](https://www.figma.com/design/Td1bnsvRj1PCGs9RVJkIvJ/Synapse-Hi-Fi-components?node-id=50514-23038&m=dev) — hover row shows overflow trigger (`overflow-menu-dots`)
- Overflow trigger (Left Nav Button): [50516:35461](https://www.figma.com/design/Td1bnsvRj1PCGs9RVJkIvJ/Synapse-Hi-Fi-components?node-id=50516-35461&m=dev) — `State=Default|Hover|Press|Disabled|Focused`
- Verification method: Figma MCP (`get_metadata`, `get_design_context`, `get_variable_defs`)
- Last verified: 2026-06-05 (includes `50512:84338`, `50514:23038`, `50516:35461` secondary + overflow evidence)
- Reference implementation: `SynapseLeftNav.tsx` → `MainMenuLeft` (`programme="synapse"`, `menuLead` for New Chat)
- Generated Storybook: `storybook-generated/synapse/src/components/LeftNav.stories.tsx` (title **`Spec Generated/Synapse/Left Nav`**, primary story **`Spec Accurate Design`**)
- Theme CSS: `components/synapse-theme.css` (not `ids-theme.css`)

### Synapse programme deltas (vs IDS)

| Topic | IDS | Synapse |
|---|---|---|
| Expanded rail width | `278px` | **`250px`** (`min-width: 250px`, `max-width: 500px`) |
| Collapsed width | `64px` | **`64px`** (same) |
| Root borders | L/R/bottom `var(--color-border-accessible)` | **Right only** `var(--color-border-neutral-light)`; no L/top/bottom on rail |
| Footer top border | `var(--color-border-accessible)` | **`var(--color-border-neutral-light)`** |
| Rail background | `var(--color-background-component)` | Component + **gradient** `var(--color-background-gradient-left-nav-start/end)` (see `MainMenuLeft.module.css`) |
| Sample labels | Dashboard, Infrastructure, … | Home, Recommendations, Workspace, Favorites, Recent (+ optional **Category** rows in Figma sample) |
| Root top padding | none on rail | **`var(--padding-padding-8)`** on expanded/collapsed rail (`47807:8154`, `47807:8166`) |
| Product slot | — | **`NewChatAction`** first in `MainMenuList` — expanded: label + icon; collapsed: **icon-only** `shape-plus` (`47807:8168`) |
| Element-set frame width | `278px` (authoring + IDS rail) | Primary/secondary **state matrix** still authored at **`278px`** (`47807:8058`); **runtime rail** is **`250px`** |
| Default selection (stories) | `defaultSelectedItemId: "dashboard"` | **`"home"`** |
| `aria-label` default | `"Main menu left"` | **`"Left navigation"`** |
| Collapsed primary **hover** icon | `brand-strong` (expanded) | **`neutral-strong`** (icon unchanged; Figma `47807:8054`) |
| Collapsed primary **selected** icon | `brand-base` (expanded) | **`brand-strong`** (Figma `47807:8050`) |
| Expanded primary **selected** icon | `brand-base` | **`brand-strong`** (Figma `47807:8060`) |
| Expanded primary **selected** inset | `brand-dark` (IDS) | **`brand-base`** (Figma `47807:8060`; selected-focus keeps **`brand-dark`**) |
| Selected row background | `brand-lighter` | **`controls-brand-lighter`** (selected-focus expanded: `brand-lighter`) |
| Collapsed hover/selected fill | `brand-lighter` / `brand-light` | Same semantic names; Figma binds **`controls-brand-lighter`** / **`controls-brand-light`** (resolved in `synapse-theme.css`) |
| Secondary hover/selected **text** | `var(--color-text-brand-strong)` | **`var(--color-text-neutral-strong)`** — Figma `50514:23038` (hover), `50512:84338` (selected) |
| Secondary selected **inset** | IDS may use inset on focus | **No left inset** on secondary rows (primary only) |
| Secondary row padding | `6px` block / `58px` inline | **`0` block** / `58px` left / `16px` right (`py-0`, `h=32px`) |
| Secondary overflow menu | — | Parent `childrenContextMenu: true` → hover reveals **`overflow-menu-dots`** trigger (`50514:23038`); button states `50516:35461` |

Resolved hover/selected fills may map to Synapse theme aliases (e.g. controls tokens); **contract token names** in tables below match IDS (`--color-background-brand-lighter`, `--color-border-brand-dark` inset).

## Anatomy
Deterministic slot order (IDS-aligned + Synapse lead row inside menu list):
1. `MainMenuLeftRoot` — vertical rail (`nav`, `programme="synapse"`)
2. `PrimaryMenuLogo?` — optional branding **above** `MainMenuList` (host-supplied; not in base Figma frame)
3. `MainMenuList` — scrollable stack: `overflow-y: auto` + `min-height: 0`; gap `var(--spacing-space-8)` between blocks
   - `NewChatAction?` — **first block** in list (Figma `shape-plus` + “New Chat” when expanded; **icon-only** `shape-plus` when collapsed — `47807:8168`; CTA, not a selectable primary row)
   - `MainMenuPrimaryItem` — `.MainMenu-Left-Element-Primary` (expanded) or `.MainMenu-Left-Element-PrimaryIcon` (collapsed)
     - `PrimaryIcon`, `PrimaryLabel`, `PrimaryChevron`, `SelectedInset`, `FocusRing`
   - `MainMenuSecondaryList?` — under expanded primary when `children` exist
     - `MainMenuSecondaryItem` — `.MainMenu-Left-Element-Secondary` (32px row)
     - `SecondaryContextButton?` — `Left Nav Button` (`overflow-menu-dots`); visible on row hover when parent `childrenContextMenu: true`
4. `ExpandCollapse` — footer control; **16×16** icon (`double-chev-left` / `double-chev-right`)

## Layout & Measurements
(Same flow as IDS [`main-menu-left`](../ids/main-menu-left/design-spec.md) except widths/borders in **Synapse programme deltas**.)

- **Expanded rail width:** `250px` (`min-width: 250px`, `max-width: 500px`; Figma `47807:8154`)
- **Collapsed rail width:** `64px` (`min-width`/`max-width: 64px`; Figma `47807:8166`)
- **Rail top padding:** `var(--padding-padding-8)` on `MainMenuLeftRoot` (Synapse only; IDS rail has no top padding)
- **Sample frame height:** container-driven; Storybook uses `100vh`
- **Menu list gap:** `var(--spacing-space-8)` between primary blocks
- **MainMenuList scroll:** flex child with `min-height: 0` and `overflow-y: auto`; logo + footer stay fixed
- **Primary row (expanded):** min-height `40px`; padding `var(--padding-padding-8)` block, `var(--padding-padding-24)` inline; gap `var(--spacing-space-16)`
- **Primary row (collapsed icon):** padding `var(--padding-padding-12)` block, `var(--padding-padding-24)` inline
- **Secondary row:** height `32px` (`box-sizing: border-box`); padding `var(--padding-padding-6)` block, `var(--padding-padding-58)` inline
- **Primary icon:** 16×16; **Chevron:** 14×14
- **Collapse footer (`ExpandCollapse`):** **49px** footer block: `1px` **top** border (`var(--color-border-neutral-light)`) + `var(--padding-padding-16)` block padding + **16×16** icon + `var(--padding-padding-16)` block padding; inline `var(--padding-padding-24)`; **no** stacked double bottom line on footer (Synapse rail has no root bottom stroke)
- **New Chat row (expanded only):** host wrapper padding `var(--padding-padding-8)`; button padding `var(--padding-padding-6)` / `var(--padding-padding-16)`; gap `var(--spacing-space-16)`; radius `var(--corner-radius-radius-4)`

## Tokens
### Surfaces and borders
- `var(--color-background-component)` — rail base
- `var(--color-background-gradient-left-nav-start)` / `var(--color-background-gradient-left-nav-end)` — vertical wash (Synapse theme)
- `var(--color-border-neutral-light)` — rail **right** border + footer **top** border
- `var(--color-background-brand-lighter)` — primary/secondary hover, selected, selected-focus backgrounds
- `var(--color-background-brand-light)` — primary/secondary press backgrounds

### Typography
- Primary label: Body 1 — `var(--font-size-body-1)` / `var(--font-line-height-line-height-24)`, weight 500, `var(--color-text-neutral-strong)` default, `var(--color-text-brand-strong)` on hover/press/selected
- Secondary label: Body 2 — `var(--font-size-body-2)` / `var(--font-line-height-line-height-20)`, weight 500, `var(--color-text-neutral)` default
- New Chat label: `var(--font-size-body-2)` / `var(--font-line-height-line-height-20)`, `var(--color-text-brand-strong)`

### Icons
- Default primary: `var(--color-icon-neutral-strong)`
- Hover/press primary: `var(--color-icon-brand-strong)`
- Selected primary (expanded + collapsed): `var(--color-icon-brand-strong)` (IDS uses `brand-base` on selected)
- Chevron: `var(--color-icon-brand-strong)`
- Collapse control: `var(--color-icon-neutral-strong)`
- New Chat: `shape-plus`, `var(--color-icon-brand-strong)`

## States (Light Theme)
### Primary row (`.MainMenu-Left-Element-Primary`, expanded)

| State | Children list (`childrenMenu` when `forceStates`) | Background | Border / inset | Text | Icon |
|---|---|---|---|---|---|
| Default | Collapsed | transparent | none (container border only) | `var(--color-text-neutral-strong)` | `var(--color-icon-neutral-strong)` |
| Default | Expanded | transparent | none | `var(--color-text-neutral-strong)` | `var(--color-icon-neutral-strong)` |
| Hover | * | `var(--color-background-brand-lighter)` | none | `var(--color-text-brand-strong)` | `var(--color-icon-brand-strong)` |
| Press | * | `var(--color-background-brand-light)` | none | `var(--color-text-brand-strong)` | `var(--color-icon-brand-strong)` |
| Selected | Collapsed | `var(--color-background-controls-brand-lighter)` | **4px inset** `var(--color-border-brand-base)` | `var(--color-text-brand-strong)` | `var(--color-icon-brand-strong)` |
| Selected | Expanded | `var(--color-background-controls-brand-lighter)` | **4px inset** `var(--color-border-brand-base)` | `var(--color-text-brand-strong)` | `var(--color-icon-brand-strong)` |
| Default-Focus | * | transparent | focus ring `var(--color-border-brand-base)` (not a side border) | `var(--color-text-neutral-strong)` | `var(--color-icon-neutral-strong)` |
| Selected-Focus | * | `var(--color-background-brand-lighter)` | **4px inset** `var(--color-border-brand-dark)` + focus ring | `var(--color-text-brand-strong)` | `var(--color-icon-brand-strong)` |

### Primary icon-only (`.MainMenu-Left-Element-PrimaryIcon`, collapsed)

Figma component set [`47807:8043`](https://www.figma.com/design/Td1bnsvRj1PCGs9RVJkIvJ/Synapse-Hi-Fi-components?node-id=47807-8043&m=dev). Each variant is **64×40px**; padding `var(--padding-padding-12)` block, `var(--padding-padding-24)` inline; 16×16 icon centered.

| State | Figma node | Background | Inset / focus | Icon |
|---|---|---|---|---|
| Default | `47807:8056` | transparent | — | `var(--color-icon-neutral-strong)` |
| Hover | `47807:8054` | `var(--color-background-controls-brand-lighter)` | — | **`var(--color-icon-neutral-strong)`** (no brand shift on hover) |
| Press | `47807:8052` | `var(--color-background-controls-brand-light)` | — | `var(--color-icon-brand-strong)` |
| Selected | `47807:8050` | `var(--color-background-controls-brand-lighter)` | **4px inset** `var(--color-border-brand-dark)` | `var(--color-icon-brand-strong)` |
| Default-Focus | `47807:8047` | transparent | focus ring `var(--color-border-brand-base)` on 40px row | `var(--color-icon-neutral-strong)` |
| Selected-Focus | `47807:8044` | `var(--color-background-controls-brand-lighter)` | inset `var(--color-border-brand-dark)` + focus ring `var(--color-border-brand-base)` | `var(--color-icon-brand-strong)` |

`--color-background-controls-brand-*` resolve to the same values as `--color-background-brand-lighter` / `--light` in `components/synapse-theme.css`; use either family in CSS as long as theme is loaded.

### Secondary row (`.MainMenu-Left-Element-Secondary`)

Verified on composed frames **`50512:84338`** (selected) and **`50514:23038`** (hover).

| State | Background | Text | Notes |
|---|---|---|---|
| Default | transparent | `var(--color-text-neutral-strong)` | No inset |
| Hover | `var(--color-background-controls-brand-lighter)` | `var(--color-text-neutral-strong)` | Figma `50514:23038`; when `childrenContextMenu`, overflow trigger visible |
| Press | `var(--color-background-controls-brand-light)` | `var(--color-text-neutral-strong)` | Inherit IDS press pattern |
| Selected | `var(--color-background-controls-brand-lighter)` | `var(--color-text-neutral-strong)` | Figma `50512:84338`; **no** left inset |
| Default-Focus | transparent + outline `var(--color-border-brand-base)` | `var(--color-text-neutral-strong)` | |
| Selected-Focus | `var(--color-background-controls-brand-lighter)` + outline | `var(--color-text-neutral-strong)` | **No** inset (`box-shadow` none) |

### Secondary overflow trigger (`Left Nav Button`, `50516:35461`)

Icon: **`overflow-menu-dots`** (16×16). Hit area: padding `var(--padding-padding-4)` block / `var(--padding-padding-8)` inline; radius `var(--corner-radius-radius-4)`.

| State | Figma node | Background | Icon |
|---|---|---|---|
| Default | `50516:35456` | transparent | `var(--color-icon-brand-base)` |
| Hover | `50516:35457` | `var(--color-background-controls-brand-light)` | `var(--color-icon-brand-strong)` |
| Press | `50516:35458` | `var(--color-background-controls-brand-light)` | `var(--color-icon-brand-strong)` |
| Disabled | `50516:35459` | transparent | `var(--color-icon-disabled)` |
| Focused | `50516:35460` | transparent + outline `var(--color-border-brand-base)` | `var(--color-icon-brand-base)` |

Trigger is **hidden** until the secondary row is hovered or focus is within the row (`50514:23038`). Click emits `onSecondaryContextMenu`; does not navigate the row.

### New Chat action (Synapse-only slot)

Expanded (`47807:8154` / `50516:35461`): label + icon. Collapsed (`47807:8168`): icon-only `shape-plus` with `title` from `newChat.label`.

| State | Background | Text / icon |
|---|---|---|
| Default | transparent | `var(--color-text-brand-strong)` / `var(--color-icon-brand-strong)` (label hidden when collapsed) |
| Hover | `var(--color-background-brand-lighter)` | `var(--color-text-brand-strong)` |
| Press | `var(--color-background-brand-light)` | `var(--color-text-brand-strong)` |
| Focus-visible | transparent + ring `var(--color-border-brand-base)` | `var(--color-text-brand-strong)` |

## States (Dark Theme)
Dark theme uses the same semantic tokens as **States (Light Theme)**. Resolved values for `[data-theme="dark"]` / Synapse dark scope live in theme CSS:

- `components/synapse-theme.css`

Duplicate the full state matrix in this section only when a dark row genuinely uses different `var(--...)` references than the corresponding light row.

*(When Light and Dark tables would list identical `var(--...)` cells, keep the matrix under **States (Light Theme)** only and use this pointer section instead of a second table.)*

## Interactions
(Same as IDS unless noted.)

- **New Chat (Synapse):** `newChat.onAction` or `newChat.link` → `onNavigate`. Expanded: label + icon. Collapsed: icon-only `shape-plus` with tooltip from `newChat.label` (Figma `47807:8168`).
- Primary row click: emit navigation payload (see **Link contract**); toggle `children` list when `children` exist (expanded rail only).
- Secondary row click: emit navigation; sets parent as selected context for inset.
- **Secondary context menu (Synapse):** when a primary item has `childrenContextMenu: true`, each child row shows `SecondaryContextButton` on hover/focus-within. Button click calls `onSecondaryContextMenu({ parentItemId, childId, name })` and does **not** change selection or navigate. Host renders the actual menu/popover.
- Collapsed rail: primary buttons use `title` / tooltip from `tooltip` when set, else visible `name`.
- Collapse footer: toggles expanded (`250px`) ↔ collapsed (`64px`); swaps `double-chev-left` ↔ `double-chev-right`.
- Chevron reflects `children` list open (`chev-down-thick`) vs closed (`chev-right-thick`).
- **`childrenMenu` (runtime):** when `forceStates` is **false**, open/closed follows user interaction. When `forceStates` is **true** (Storybook matrix only), `childrenMenu` pins the list for that row.
- Keyboard: arrow keys move focus; Enter/Space activate; Escape closes `children` list (product-defined).

### Accessibility
- Root: `<nav aria-label="Left navigation">` (overridable)
- Primary: `aria-current="page"` when this row is the active destination **and** no secondary child is `aria-current="page"`; `aria-expanded` when chevron shown
- Secondary: `aria-current="page"` on the active child row
- Overflow trigger: `aria-label="More actions for {child name}"`, `aria-haspopup="menu"`; keyboard-focusable and revealed on row `:focus-within`
- Visible focus ring on primary/secondary/New Chat/footer focus variants
- WCAG AA contrast via semantic tokens

### Behavior & guidelines
- Use for Synapse application primary navigation (AI workspace pattern).
- Default sample labels from Figma expanded frame (`47807:8154`): Home, Recommendations, Workspace, Favorites, Recent; Figma sample also includes duplicate **Category** rows (`folder-closed` icon) for overflow/scroll demos.
- Do not hardcode colors/spacing — use `components/synapse-theme.css`.

## Composition & API (runtime)

Types are **`MainMenuLeft*`** exports from `MainMenuLeft.tsx`. `SynapseLeftNav` extends `MainMenuLeftProps` and adds `newChat?`. Type aliases: `SynapseLeftNavPrimaryItem`, `SynapseLeftNavSecondaryItem`.

### Root props / outputs (framework mapping)

| Name | Direction | Type | Notes |
|------|------------|------|--------|
| `logo` | Input | `MainMenuLeftLogo?` | Optional slot above list |
| `items` | Input | `MainMenuLeftPrimaryItem[]` | User-defined tree; order = render order |
| `expanded` | Input | `boolean?` | With `onExpandedChange`: **controlled**. Without: **uncontrolled** (default `true`) |
| `onExpandedChange` | Output | `(expanded: boolean) => void` | Footer toggle |
| `defaultSelectedItemId` | Input | `string?` | Initial primary selection. **Spec Accurate Design:** `"home"` |
| `onSelected` | Output | `(MainMenuLeftSelectionDetail) => void` | Active row changed; **not** emitted solely from `defaultSelectedItemId` on mount |
| `onNavigate` | Output | `(MainMenuLeftNavigationTarget) => void` | Primary, secondary, logo, or New Chat activation |
| `onSecondaryContextMenu` | Output | `(MainMenuLeftSecondaryContextMenuDetail) => void` | Overflow trigger on secondary row (`childrenContextMenu` parent) |
| `forceStates` | Input | `boolean?` | Storybook / QA only — freezes `item.state` |
| `ariaLabel` | Input | `string?` | Default: `"Left navigation"` |
| `programme` | Input | `"ids" \| "synapse"` | Set to **`synapse`** by `SynapseLeftNav` (do not override in hosts) |
| `newChat` / `menuLead` | Input | `SynapseLeftNavNewChat?` | Rendered as **first block in `MainMenuList`** (`menuLead` on `MainMenuLeft`); `{ label?: string; onAction?: () => void }` |

### User configuration model (codegen source)

**`MainMenuLeftLogo`** (optional): `alt` (required), `src?`, `iconName?`, `tooltip?`, `link?`

**`MainMenuLeftPrimaryItem`**

- `id?` — stable key; derived from slugified `name` / `label` if omitted
- `name?` / `label?` — visible label (at least one recommended)
- `tooltip?` — collapsed rail `title`
- `iconName?` — slug under `assets/icons/`; reference default `home` if missing
- `link?` — navigation contract (see below)
- `children?` — nested secondary rows
- `childrenContextMenu?: boolean` — when **true** (Synapse), secondary rows show overflow trigger on hover
- `childrenMenu?: "expanded" | "collapsed"` — **only when `forceStates: true`**
- `state?` — snapshot QA only

**`MainMenuLeftSecondaryItem`**

- `id?`, `name?` / `label?`, `tooltip?`, `link?`

### Link contract (same pattern as IDS Main Menu/Left)

Discriminated union `MainMenuLeftLink`:

| `link.type` | Meaning | Angular | React (example) |
|-------------|---------|---------|-----------------|
| `href` | External or plain URL | `<a [href]>` | `<a href>` |
| `routerLink` | In-app route | `[routerLink]` | `<Link to>` |
| `action` | Host handles in `onNavigate` only | `<button type="button">` | `<button type="button">` |

**Rules**

- Prefer **`link`** on new code. Legacy **`href` / `routeRef`** on items remain supported and map into `onNavigate` payloads.
- **Angular codegen:** `routerLink` → `RouterLink`; else `href` → anchor.

**`MainMenuLeftNavigationTarget`:** `itemId`, `parentItemId?`, `name`, `link?`, legacy `href?` / `routeRef?`

**`MainMenuLeftSelectionDetail`:** `level`: `"primary"` \| `"secondary"`, plus `itemId`, `parentItemId?`, `name`, `link?`, legacy fields

### Spec Accurate Design story defaults (codegen parity)

Codegen and `LeftNav.stories.tsx` **Spec Accurate Design** must use:

- `expanded: true`; **`defaultSelectedItemId: "home"`**
- `newChat: { label: "New Chat" }` (or `onAction` stub)
- `items` matching Figma `47807:8154`: `home`, `light-bulb`, `grid-square-9` (with **`children`** + `childrenMenu: "collapsed"`), `star-fav`, `time-clock`
- Canonical **`children`** / **`childrenMenu`** (not `secondaryItems`)
- Parent frame: `height: 100vh`, flex row, canvas `var(--color-background-surface-1)`
- Stories: **Collapsed** (`expanded: false`; New Chat icon-only per Figma), **PrimaryStateSnapshotMatrix** (expanded, `47807:8058`), **CollapsedPrimaryStateSnapshotMatrix** (collapsed icon-only, `47807:8043`)

## Codegen Contract (Framework-Agnostic Blueprint)
### Deterministic structure
Emit slots in **Anatomy** order. `SynapseLeftNavHost` → optional `NewChatAction` → `MainMenuLeft*` slots per IDS contract.

### Variant matrix
| expanded | childrenMenu (when `forceStates`) | NewChatAction | Visual |
|---|---|---|---|
| true | collapsed | visible | 250px rail, labels + chevron when `children` |
| true | expanded | visible | 250px + `children` list visible |
| false | n/a | icon-only | 64px icon-only primary rows + icon-only New Chat |

### Per-slot style contract
Resolve from **Tokens** and **States (Light Theme)** using `var(--...)` only.

### Behavior contract
See **Interactions**. Selection changes emit **`onSelected`**; activation emits **`onNavigate`**. Footer toggles **`onExpandedChange`**.

### Accessibility contract
See **Interactions → Accessibility**. Focus order when New Chat present: New Chat → primaries → footer.

### Asset resolution + bundling contract
Icons via shared `Icon` + `assets/icons/<slug>.svg`. Spec slugs: `shape-plus`, `home`, `light-bulb`, `grid-square-9`, `star-fav`, `time-clock`, `folder-closed`, `chev-right-thick`, `chev-down-thick`, `double-chev-left`, `double-chev-right`, **`overflow-menu-dots`** (secondary context trigger).

### Fallback/error rules
- Unknown `state` → `default`
- `defaultSelectedItemId` not matching any primary id → no initial selection
- Missing `iconName` on primary → reference default `home` (+ strict QA log)
- Missing both `name` and `label` → empty label; index-based id fallback
- Missing theme CSS → validation fail at QA boundary

### Validation checklist
- [x] IDS contract referenced; shared `MainMenuLeft` + `programme="synapse"`
- [x] Expanded width **250px**, collapsed **64px**
- [x] Primary 40px row; secondary 32px with `padding-padding-6` / `padding-padding-58`
- [x] Footer **49px** block; footer top `var(--color-border-neutral-light)`; rail right border neutral-light
- [x] Collapsed primary-icon matrix matches Figma `47807:8043` (hover icon stays neutral-strong; selected icon brand-strong)
- [x] Selected expanded inset `var(--color-border-brand-base)`; selected-focus + collapsed-selected inset `var(--color-border-brand-dark)`
- [x] `MainMenuList` scroll: `overflow-y: auto` + `min-height: 0`; gap `var(--spacing-space-8)`
- [x] **Spec Accurate Design** uses `defaultSelectedItemId: "home"` + **`children`** / **`childrenMenu`**
- [x] `onExpandedChange` + **`onSelected`** documented; single `aria-current="page"` (deepest active row)
- [x] New Chat collapsed = icon-only `shape-plus` (Figma `47807:8168`)
- [x] Storybook title `Spec Generated/Synapse/Left Nav`
- [x] Token mapping re-verified against Figma MCP (2026-06-05)

## Source Mapping
- Design source: Synapse Hi-Fi `Td1bnsvRj1PCGs9RVJkIvJ`
- Validated nodes: `47807:8153`, `47807:8154`, `47807:8166`, `47807:8058`, `47807:8043`, `47807:8028`, `50512:84338`, `50514:23038`, `50516:35461`
- IDS parity reference: `components/ids/main-menu-left/design-spec.md` (`0bHk3XhrjFhowgFkz9yLr4`, nodes `11099:56218`, `11099:56244`, …)
- Component map: `data/synapse-component-figma-map.json` → Left Nav / Main Menu/Left (`specPattern: ids-fork`)
- Programme inheritance registry: `data/programme-inheritance-registry.json` → `left-nav`
- Spec contract: `storybook/src/spec-contracts/synapse-left-nav.contract.ts`
- Registry slug: `leftnav` in `data/synapse-component-registry.json`
- **Evidence (2026-06-05):** Figma MCP — `get_metadata`/`get_design_context` on `47807:8154` (250px expanded), `47807:8166` (64px collapsed); `get_variable_defs` on selected expanded (`47807:8080` area), selected-focus (`47807:8069`), collapsed hover (`47807:8054`), collapsed selected (`47807:8050`); `get_design_context` `disableCodeConnect: true`
- Storybook: `storybook-generated/synapse/src/components/LeftNav.stories.tsx`
