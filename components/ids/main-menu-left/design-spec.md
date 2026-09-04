# Main Menu/Left Design Spec

## Metadata
- Component: Main Menu/Left
- Design System: IDS
- Category: Navigation
- Figma file: [IDS Design Library](https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library)
- File key: `0bHk3XhrjFhowgFkz9yLr4`
- Main component set: `MainMenu-Left-Main` (`11099:56205`)
- Expanded component: [11099:56218](https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=11099-56218&m=dev) — node `11099:56218`
- Collapsed component: [11099:56206](https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=11099-56206&m=dev) — node `11099:56206`
- Primary element set: [11099:56244](https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=11099-56244&m=dev) — `.MainMenu-Left-Element-Primary`
- Collapsed primary (icon-only): [11099:56230](https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=11099-56230&m=dev) — `.MainMenu-Left-Element-PrimaryIcon`
- Secondary element states: [11099:56237](https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=11099-56237&m=dev) — `.MainMenu-Left-Element-Secondary`
- Verification method: Figma MCP (`get_metadata`, `get_design_context`, `get_variable_defs`)
- Last verified: 2026-09-01 (secondary Default-Focus `12016:227537` + Selected-Focus `12016:227542`; primary Default-Focus `12016:227840` + Selected-Focus `12016:227912`)
- Reference implementation: `storybook/src/components/MainMenuLeft.tsx`, `storybook/src/components/MainMenuLeft.module.css`, `storybook-angular/src/components/ids-main-menu-left/`
- Spec path constant (imports / tooling): `storybook/src/spec-contracts/ids-main-menu-left.contract.ts`
- Generated Storybook: `storybook-generated/ids/src/components/MainMenuLeft.stories.tsx` (title **`Spec Generated/IDS/Main Menu Left`**, primary story **`Spec Accurate Design`**)
- Implementation guide: [`components/ids/main-menu-left/README.md`](./README.md)

## Anatomy
Deterministic slot order (Figma-aligned + optional product slot):

**Composition API (preferred — Storybook + framework ports):**

```
MainMenuLeftRoot (`ids-main-menu-left` / `<MainMenuLeft>`)
  MainMenuLeftLogo? (`ids-main-menu-left-logo`)
  MainMenuList (scroll region inside root)
    MainMenuLeftItem (`ids-main-menu-left-item`) — primary or secondary (`level`)
      linkHost — projected `<a href>` | `<a routerLink>` | `<button type="button">`
        MainMenuLeftItemIcon? (`ids-main-menu-left-item-icon`) — 16×16, primary only
        label (text node or `<span>`)
    MainMenuLeftGroup (`ids-main-menu-left-group`)
      MainMenuLeftItem (primary trigger — same link/icon/label contract)
      MainMenuLeftChildren (`ids-main-menu-left-children`)
        MainMenuLeftItem (`level="secondary"`) × n
  MainMenuLeftExpandCollapse (footer collapse control — owned by root)
```

**Legacy data adapter (programmatic — Synapse tooling, quick demos):** `items: MainMenuLeftPrimaryItem[]` on root maps to the same visual contract without projection.

Figma slot mapping:
1. `MainMenuLeftRoot` — vertical rail (`nav`)
2. `PrimaryMenuLogo?` — optional branding block **above** the primary list (not in base Figma `11099:56218`; host supplies asset or icon + optional `link`)
3. `MainMenuList` — scrollable primary stack (`Menu`): CSS `overflow-y: auto` + `min-height: 0` on the flex child that wraps primary blocks; vertical gap `var(--spacing-space-8)` between blocks
4. `MainMenuPrimaryItem` — `.MainMenu-Left-Element-Primary` (expanded) or `.MainMenu-Left-Element-PrimaryIcon` (collapsed)
   - `PrimaryIcon` — 16×16 mask icon (`assets/icons/<slug>.svg`)
   - `PrimaryLabel` — Body 1 medium (hidden when collapsed)
   - `PrimaryChevron` — 14×14 `chev-right-thick` / `chev-down-thick` when `children` exist (expanded only)
   - `SelectedInset` — primary only; **4px** leading bar `var(--color-border-brand-base)`; `left: calc(-1 * var(--border-width-border-1))`, `width: calc(4px + var(--border-width-border-1))` (PR #82 — bar extends into rail border zone)
   - `FocusRing` — 1px `var(--color-border-brand-base)` (`var(--corner-radius-radius-4)`).
     - **Assembled rail (primary + secondary):** absolute ring with `inset: 0 var(--border-width-border-1)` — **1px gap** between the Main Menu L/R rail border and the focus ring (flush top/bottom). Applies to Default-Focus and Selected-Focus.
     - **No drop-shadow** in that gap (Figma Selected-Focus has only an **inset** 4px selected bar via `SelectedInset` / `inset 4px 0 0 0`, not an outer/drop shadow).
     - Keyboard focus uses the same geometry via `::after`. Snapshot matrix rows use a `.focusRing` / `__focus-ring` span; forced states use `tabIndex={-1}`. **No** secondary selected-focus inset bar.
5. `MainMenuSecondaryList` — optional, under expanded primary row when `children` exist
   - `MainMenuSecondaryItem` — `.MainMenu-Left-Element-Secondary` (32px row)
6. `ExpandCollapse` — footer control; **16×16** icon (`double-chev-left` when expanded / `double-chev-right` when collapsed)

## Layout & Measurements
- **Expanded rail width:** `min 256px` / `max 356px` (implementation override — pending live Figma re-verification against `11099:56218`)
- **Collapsed rail width:** `64px` (24px inline padding × 2 + 16px icon; Figma `11099:56206`)
- **Sample frame height:** `888px` (container-driven at runtime; Storybook uses `100vh`)
- **Menu top padding:** `var(--padding-padding-8)` on `MainMenuLeftRoot`
- **Menu list gap:** `var(--spacing-space-8)` between primary blocks
- **MainMenuList scroll:** primary stack lives in a flex child with `min-height: 0` and `overflow-y: auto` so long menus scroll inside the rail (footer + optional logo stay fixed)
- **Primary row (expanded):** min-height `40px`; padding `var(--padding-padding-8)` block, `var(--padding-padding-24)` inline; gap `var(--spacing-space-16)`
- **Primary row (collapsed icon):** padding `var(--padding-padding-12)` block, `var(--padding-padding-24)` inline
- **Secondary row:** height `32px` (`box-sizing: border-box`); padding `var(--padding-padding-6)` block, `var(--padding-padding-58)` inline (Figma `11099:56237`: 6px top/bottom, 58px left/right)
- **Primary icon:** 16×16; centered on a single-line row, top-aligned with `4px` (`var(--spacing-space-4)`) vertical padding when the primary label wraps to two lines (total `24px` / `var(--font-line-height-line-height-24)` box)
- **Chevron:** 14×14; same wrap-responsive alignment/padding treatment as the primary icon
- **Primary and secondary labels (expanded):** wrap to a maximum of **2 lines** using `-webkit-line-clamp: 2`, then truncate with `text-overflow: ellipsis`; when truncation occurs, hovering the label reveals an `IdsTooltip` showing the full text (or `tooltip` prop if provided)
- **Collapse footer (`ExpandCollapse`):** **49px** footer block (`box-sizing: border-box`): `1px` **top** border (`var(--color-border-accessible)`) + `var(--padding-padding-16)` block padding + **16×16** icon + `var(--padding-padding-16)` block padding; **no** `border-bottom` on the footer — the **rail bottom stroke** is **`MainMenuLeftRoot` `border-bottom` only** (single 1px line; avoids doubling with the container). Inline padding `var(--padding-padding-24)`; icon slugs `double-chev-left` / `double-chev-right`
- **Borders:** **container chrome** — `MainMenuLeftRoot` uses `var(--color-border-accessible)` on **left, right, and bottom** (single bottom edge for the whole rail). **`ExpandCollapse`** uses **`border-top` only** to separate from the menu list (no extra `border-bottom` on the footer — avoids a double 1px line with the root). **`MainMenuList` (content)** has `margin-left: calc(-1 * var(--border-width-border-1))` and `margin-right: calc(-1 * var(--border-width-border-1))` to extend outside the container. **`MainMenuPrimaryItem` (Element-Primary)** and **`MainMenuSecondaryItem` (Element-Secondary)** carry their own **left + right** `1px` `var(--color-border-accessible)` border with `z-index: 1`, so their side borders read as the rail edges along each row (the content spans the full rail width so these align over the root borders rather than doubling). **`FocusRing`** uses `inset: 0 calc(-1 * var(--border-width-border-1))` to extend outside. **`SelectedInset`** uses `left: calc(-1 * var(--border-width-border-1))` and `width: calc(4px + var(--border-width-border-1))` to extend outside.
- **Primary icon:** 16×16
- **Chevron:** 14×14
- **Collapse footer (`ExpandCollapse`):** **49px** footer block (`box-sizing: border-box`): `1px` **top** border (`var(--color-border-gray-neutral-base)`) + `var(--padding-padding-16)` block padding + **16×16** icon + `var(--padding-padding-16)` block padding; **no** `border-bottom` on the footer — the **rail bottom stroke** is **`MainMenuLeftRoot` `border-bottom` only** (single 1px line; avoids doubling with the container). Inline padding `var(--padding-padding-24)`; icon slugs `double-chev-left` / `double-chev-right`
- **Borders:** **container chrome** — `MainMenuLeftRoot` uses `var(--color-border-gray-neutral-base)` on **left, right, and bottom** (single bottom edge; continuous through the `8px` list gap). Isolated Element-Primary / Element-Secondary frames (`278px`) also bind **left + right** strokes of that token — that is the **same rail chrome**, not a second pair of row borders. **Do not** paint additional left/right borders on primary/secondary rows in the assembled rail (doubles the stroke and breaks the `8px` block gap). **`ExpandCollapse`** uses **`border-top` only**. **`MainMenuList` stays inside the root** (no negative side margins) so hover/selected fills end flush inside the rail stroke.
- **Focus (Figma-verified):**
  - **Secondary Default-Focus** (`12016:227537`): focus ring `inset: 0 1px` — **1px** gap between rail L/R border and blue ring; ring flush on top/bottom; transparent fill; text `var(--color-text-gray-neutral)`; **no** 4px selected bar; **no drop-shadow** in the gap.
  - **Secondary Selected-Focus** (`12016:227542`): fill `var(--color-background-brand-lighter-slate)`; text `var(--color-text-brand-strong)`; same L/R 1px focus inset; **no** 4px bar; **no** drop-shadow.
  - **Primary Default-Focus** (`12016:227840`) / **Selected-Focus** (`12016:227912`): in the **assembled rail**, same `inset: 0 1px` focus gap as secondary (isolated Figma frames paint L/R strokes on the element and use `left/right: -1px` over those strokes; rail chrome is on the root instead). Selected-Focus adds **4px** `SelectedInset` (`var(--color-border-brand-base)`) — Figma expresses this as `inset 4px 0 0 0` shadow, **not** a drop-shadow in the focus gap.
  - Keyboard focus: `::after` (or snapshot `.focusRing`) with `inset: 0 var(--border-width-border-1)`.
- **`SelectedInset`:** primary only; `left: calc(-1 * var(--border-width-border-1))`, `width: calc(4px + var(--border-width-border-1))`, `var(--color-border-brand-base)`.

## Tokens
### Surfaces and borders
- `var(--color-background-surface-component)` — rail background
- `var(--color-border-gray-neutral-base)` — **root** left/right/**bottom** border (closes the rail); footer uses **top** border only to separate from `MainMenuList` (not per-row strokes)
- `var(--color-background-brand-lighter-slate)` — primary/secondary hover, selected, selected-focus backgrounds
- `var(--color-background-brand-light-slate)` — primary/secondary press backgrounds

### Typography
- Primary label: Body 1 — `var(--font-size-body-1)` / `var(--font-line-height-line-height-24)`, weight 400, `var(--color-text-gray-neutral-strong)` default, `var(--color-text-brand-strong)` on hover/press/selected
- Secondary label: Body 2 — `var(--font-size-body-2)` / `var(--font-line-height-line-height-20)`, weight 400

### Icons
- Default primary: `var(--color-icon-gray-neutral-strong)`
- Hover/press primary: `var(--color-icon-brand-strong)`
- Selected primary: `var(--color-icon-brand-base)`
- Chevron: `var(--color-icon-brand-strong)`
- Collapse control: `var(--color-icon-gray-neutral-base)`

## States (Light Theme)
### Primary row (`.MainMenu-Left-Element-Primary`, expanded)

| State | Children list (`childrenMenu` when `forceStates`) | Background | Border / inset | Text | Icon |
|---|---|---|---|---|---|
| Default | Collapsed | transparent | none (container border only) | `var(--color-text-gray-neutral-strong)` | `var(--color-icon-gray-neutral-strong)` |
| Default | Expanded | transparent | none | `var(--color-text-gray-neutral-strong)` | `var(--color-icon-gray-neutral-strong)` |
| Hover | * | `var(--color-background-brand-lighter-slate)` | none | `var(--color-text-brand-strong)` | `var(--color-icon-brand-strong)` |
| Press | * | `var(--color-background-brand-light-slate)` | none | `var(--color-text-brand-strong)` | `var(--color-icon-brand-strong)` |
| Selected | Collapsed | `var(--color-background-brand-lighter-slate)` | **4px inset** `var(--color-border-brand-base)` | `var(--color-text-brand-strong)` | `var(--color-icon-brand-base)` |
| Selected | Expanded | `var(--color-background-brand-lighter-slate)` | **4px inset** `var(--color-border-brand-base)` | `var(--color-text-brand-strong)` | `var(--color-icon-brand-base)` |
| Default-Focus | * | transparent | focus ring `var(--color-border-brand-base)` (`inset: 0 1px` L/R gap); no 4px bar; no drop-shadow | `var(--color-text-gray-neutral-strong)` | `var(--color-icon-gray-neutral-strong)` |
| Selected-Focus | * | `var(--color-background-brand-lighter-slate)` | **4px inset** `var(--color-border-brand-base)` **plus** focus ring | `var(--color-text-brand-strong)` | `var(--color-icon-brand-base)` |

### Primary icon-only (`.MainMenu-Left-Element-PrimaryIcon`, collapsed)

| State | Background | Inset | Icon |
|---|---|---|---|
| Default | transparent | — | `var(--color-icon-gray-neutral-strong)` |
| Selected | `var(--color-background-brand-lighter-slate)` | **4px** `var(--color-border-brand-base)` | `var(--color-icon-brand-base)` |
| Hover / Press | same token mapping as expanded primary | — | brand-strong / brand-base per state |

### Secondary row (`.MainMenu-Left-Element-Secondary`)

| State | Background | Text |
|---|---|---|
| Default | transparent | `var(--color-text-gray-neutral)` |
| Hover | `var(--color-background-brand-lighter-slate)` | `var(--color-text-brand-strong)` |
| Press | `var(--color-background-brand-light-slate)` | `var(--color-text-brand-strong)` |
| Selected | `var(--color-background-brand-lighter-slate)` | `var(--color-text-brand-strong)` |
| Default-Focus | transparent; focus ring `var(--color-border-brand-base)` (`inset: 0 1px` — 1px gap from rail L/R border); **no** 4px bar | `var(--color-text-gray-neutral)` |
| Selected-Focus | `var(--color-background-brand-lighter-slate)`; focus ring only; **no** 4px bar | `var(--color-text-brand-strong)` |

## States (Dark Theme)
Dark theme uses the same semantic tokens as **States (Light Theme)**. Resolved values for `[data-theme="dark"]` / `.ids-theme-dark` (and program overlays) live in theme CSS:

- `components/ids-theme.css`
- `components/<program>-theme.css` when a program overlays IDS (for example `components/dap-theme.css`)

Duplicate the full state matrix in this section only when a dark row genuinely uses different `var(--...)` references than the corresponding light row.

## Interactions
- Primary row click:
  - **Leaf (no `children`, or collapsed rail):** emit navigation payload (see **Link contract**) and select the row.
  - **Parent (`children` present, expanded rail):** acts as a sub-menu accordion — **only toggle the `children` list open/closed; do not navigate or change the active selection.** Expanding/collapsing keeps the user on the current page; navigation happens via the secondary rows.
- Secondary row click: emit navigation; becomes the active page and sets its parent as selected context (clears any prior primary selection). The **parent row reads as selected** — brand-lighter background, brand-strong label, brand icon/chevron, and the 4px inset — while its sub-menu is expanded.
- Parent selected-context persistence: when a secondary child is the active page and its sub-menu is **collapsed**, the parent row **stays in the selected state** (background + inset retained) and takes over `aria-current="page"` from the now-hidden child, so the current-page indicator is never lost.
- Collapsed rail: primary buttons use `title` / tooltip from `tooltip` when set, else visible `name`.
- Collapse footer: toggles expanded (`min 256px` / `max 356px`) ↔ collapsed (`64px`); swaps `double-chev-left` ↔ `double-chev-right`.
- Truncated label tooltips (expanded only): when a primary or secondary label is clipped after 2 lines, hovering the visible text shows an `IdsTooltip` whose body is the full label (or the item's `tooltip` prop if supplied).
- Chevron reflects `children` list open (`chev-down-thick`) vs closed (`chev-right-thick`).
- **`childrenMenu` (runtime):** when `forceStates` is **false**, open/closed state is driven by user interaction (in-memory expand key on the primary row). When `forceStates` is **true** (Storybook matrix only), `childrenMenu` pins the list open or closed for that row.
- Keyboard (expanded rail):
  - `Tab` / `Shift+Tab`: move focus through the active menu buttons (primary, secondary, lead, footer toggle).
  - `↑` / `↓`: move focus to the previous/next focusable row inside the menu content.
  - `Home` / `End`: jump focus to the first/last focusable row.
  - `Enter` / `Space`: activate the focused primary or secondary row. For a parent primary with a collapsed sub-menu, this opens the sub-menu. For a leaf primary, it selects and emits `onSelected`/`onNavigate`. For a secondary row, it selects and emits.
  - `→` on a primary parent: open the `children` list (if closed) or move focus to the first secondary.
  - `←` on a primary parent: close the `children` list. On a secondary row, move focus back to the parent primary.
  - `Escape`: close the currently expanded `children` list and return focus to its parent primary.

### Accessibility
- Root: `<nav aria-label="Main menu left">`
- Primary: `aria-current="page"` when this row is the active destination — i.e. it is a selected leaf, **or** it is a parent whose selected secondary child is currently hidden (sub-menu collapsed). When the sub-menu is expanded, the visible child carries `aria-current="page"` instead. `aria-expanded` when chevron shown
- Secondary: `aria-current="page"` on the active child row when it represents the current route
- Visible focus ring on primary/secondary focus variants
- WCAG AA contrast via semantic tokens

### Behavior & guidelines
- Use for application primary navigation (IDS Design Library pattern).
- Default sample labels from Figma expanded frame: Dashboard, Infrastructure, Protection, Recovery, Alerts and Events, Reports, Administration, Jobs.

## Composition & API (runtime)

Canonical machine-readable mirror: `component-contracts/ids/main-menu-left.contract.ts` (`MAIN_MENU_LEFT_COMPOSITION_ANATOMY`, `MAIN_MENU_LEFT_GROUP_ANATOMY`, `MAIN_MENU_LEFT_ITEM_ANATOMY`).

### Composition pattern (preferred)

| Component | Selector / export | Role |
|-----------|-------------------|------|
| Root | `ids-main-menu-left` / `MainMenuLeft` | Rail chrome, selection state, collapse footer |
| Logo | `ids-main-menu-left-logo` / `MainMenuLeftLogoSlot` | Optional branding above list |
| Item | `ids-main-menu-left-item` / `MainMenuLeftItem` | Row chrome + projected link host |
| Item icon | `ids-main-menu-left-item-icon` / `MainMenuLeftItemIcon` | 16×16 primary glyph |
| Group | `ids-main-menu-left-group` / `MainMenuLeftGroup` | Expandable primary + children |
| Children | `ids-main-menu-left-children` / `MainMenuLeftChildren` | Secondary list container |

**Item link host (projected by consumer):** each `MainMenuLeftItem` accepts **one** interactive child:

| Host | When to use |
|------|-------------|
| `<a href="...">` | External URL or plain navigation |
| `<a routerLink="...">` / `[routerLink]` | Angular in-app routes |
| `<Link to="...">` | React Router |
| `<button type="button">` | Action-only rows (`link.type: action` equivalent) |

Icons and labels live **inside** the link host so focus and activation follow native semantics.

**Group child order (deterministic):**

```
ids-main-menu-left-group [groupId]
  ids-main-menu-left-item [itemId] [level=primary] → linkHost
  ids-main-menu-left-children
    ids-main-menu-left-item [itemId] [level=secondary] → linkHost
    …
```

### Root props / outputs (framework mapping)

| Name | Direction | Type | Notes |
|------|------------|------|--------|
| *(composition)* | Slot | projected `Item` \| `Group` | **Preferred** — omit `items` |
| `logo` | Input / slot | `MainMenuLeftLogo?` / `ids-main-menu-left-logo` | Optional branding |
| `items` | Input | `MainMenuLeftPrimaryItem[]?` | **Legacy adapter** — omit when using composition |
| `compositionMode` | Input | `boolean?` | Angular: force composition (default when `items` omitted) |
| `expanded` | Input | `boolean?` | With `onExpandedChange`: **controlled** rail. Without: **uncontrolled** initial value (default `true`) |
| `onExpandedChange` | Output | `(expanded: boolean) => void` | **Angular:** `@Output() expandedChange` |
| `defaultSelectedItemId` | Input | `string?` | Initial **primary** selection; **Spec Accurate Design:** `"dashboard"` |
| `onSelected` | Output | `(MainMenuLeftSelectionDetail) => void` | **Angular:** `@Output() selectedChange` |
| `onNavigate` | Output | `(MainMenuLeftNavigationTarget) => void` | Optional — link hosts handle routing when projected |
| `forceStates` | Input | `boolean?` | Storybook / QA only — freezes `item.state` / `forceState` |
| `ariaLabel` | Input | `string?` | Default: `"Main menu left"` |

### Item props (`ids-main-menu-left-item` / `MainMenuLeftItem`)

| Name | Type | Notes |
|------|------|-------|
| `itemId` | `string` | Required — selection + `aria-current` key |
| `level` | `'primary' | 'secondary'` | Default `primary`; secondary uses 32px row (no icon slot) |
| `forceState` | `MainMenuLeftPrimaryState?` | Storybook matrix only (with root `forceStates`) |
| `tooltip` | `string?` | Collapsed rail `title` / fallback label for events |
| *(default slot)* | `linkHost` | Project `<a>`, `[routerLink]`, or `<button>` |

### Group props (`ids-main-menu-left-group` / `MainMenuLeftGroup`)

| Name | Type | Notes |
|------|------|-------|
| `groupId` | `string` | Required — expansion + secondary parent key |
| `defaultExpanded` | `boolean?` | When `forceStates`: pins children list (`childrenMenu: "expanded"`) |

### User configuration model (legacy `items[]` adapter)
All menu data is **host-defined**. Types mirror `storybook/src/components/MainMenuLeft.tsx` exports.

**`MainMenuLeftLogo`** (optional)

- `alt: string` (required)
- `src?: string` — image URL
- `iconName?: string` — IDS icon slug if no `src`
- `tooltip?: string`
- `link?: MainMenuLeftLink` — if set, logo is interactive and emits `onNavigate` with `itemId: "__logo__"`

**`MainMenuLeftPrimaryItem`**

- `id?: string` — stable key; **if omitted**, runtime/codegen derives from slugified `name` (fallback: `label`) + disambiguation (`primary-0`, …)
- `name?: string` — visible label (**canonical**); legacy alias `label?: string` (at least one of `name` / `label` should be set)
- `tooltip?: string` — e.g. collapsed rail `title` / accessible description
- `iconName?: string` — IDS slug (`assets/icons/<slug>.svg`); default reference uses `home` if missing
- `link?: MainMenuLeftLink` — navigation contract (see below)
- `children?: MainMenuLeftSecondaryItem[]` — nested rows under this primary item
- `childrenMenu?: "expanded" | "collapsed"` — **only when `forceStates: true`** pins the `children` list for visual QA. **Runtime** (normal app): open/closed follows user toggles on the primary row (implementation detail: expand/collapse state on that row), not this field.
- `state?` — snapshot QA only

**`MainMenuLeftSecondaryItem`**

- `id?: string` — if omitted, derived from parent id + slugified `name`/`label` + index
- `name?` / `label?` — visible text (at least one recommended)
- `tooltip?: string`
- `link?: MainMenuLeftLink`

### Link contract (same pattern as Alert / Toast)

Discriminated union `MainMenuLeftLink`:

| `link.type` | Meaning | Angular | React (example) |
|-------------|---------|---------|-----------------|
| `href` | External or plain URL | `<a [href]>` | `<a href>` |
| `routerLink` | In-app route | `[routerLink]` / `routerLink` | `<Link to>` / router API |
| `action` | No URL — host handles in `onNavigate` only | `<button type="button">` | `<button type="button">` |

**Rules**

- Prefer **`link`** on new code. **`href` / `routeRef` on items** remain supported as **legacy** inputs; implementations map them to `link` equivalents when emitting `onNavigate` (`href` → `{ type: "href", href }`, `routeRef` → `{ type: "routerLink", routerLink: routeRef }`).
- Do **not** set ambiguous combinations: validation should reject `link` + conflicting legacy fields if strict mode is enabled (adapter-defined).
- **Angular codegen:** if `routerLink` is set, emit `RouterLink`; else if `href`, emit anchor.

**`MainMenuLeftNavigationTarget`** (output payload)

- `itemId: string` — primary id, secondary id, or `"__logo__"` for logo
- `parentItemId?: string` — set for secondary rows
- `name: string` — display string at activation time
- `link?: MainMenuLeftLink` — resolved (including legacy mapping)
- `href?` / `routeRef?` — deprecated mirrors for backward compatibility

**`MainMenuLeftSelectionDetail`** (`onSelected` payload)

- `level`: `"primary"` | `"secondary"`
- `itemId`, `parentItemId?`, `name`, `link?`, legacy `href?` / `routeRef?` (same resolution rules as `MainMenuLeftNavigationTarget`)

### Spec Accurate Design story defaults (codegen parity)

Codegen and `MainMenuLeft.stories.tsx` **Spec Accurate Design** must use **composition markup** (canonical):

- `MainMenuLeft` / `ids-main-menu-left` with projected items + one `MainMenuLeftGroup` for Infrastructure
- `defaultSelectedItemId: "dashboard"` on Dashboard primary item
- Figma icon slugs on `MainMenuLeftItemIcon` / `ids-main-menu-left-item-icon`
- Infrastructure group: `defaultExpanded={false}` / `[defaultExpanded]="false"`
- Parent frame: `height: 100vh`, flex row, canvas `var(--color-background-surface-primary)`
- Stories: **Collapsed**, **PrimaryStateSnapshotMatrix** (`forceStates` + `forceState` per primary item), **SecondaryStateSnapshotMatrix** (`forceStates` + `forceState` on secondary items — Default-Focus `12016:227537`, Selected-Focus `12016:227542`), **Legacy items[] adapter** (optional)

Legacy `items[]` story args remain valid for programmatic adapter parity tests.

## Codegen Contract (Framework-Agnostic Blueprint)
### Deterministic structure

```
MainMenuLeftRoot
  [MainMenuLeftLogo?]
  MainMenuList
    ( MainMenuLeftItem [linkHost + MainMenuLeftItemIcon? + label]
    | MainMenuLeftGroup
        MainMenuLeftItem [primary linkHost]
        MainMenuLeftChildren
          MainMenuLeftItem [secondary linkHost]*
    )*
  MainMenuLeftExpandCollapse
```

Legacy adapter: `items[]` on root expands to the same tree at runtime (do not emit `items[]` as canonical in new framework ports).

### Variant matrix
| expanded | childrenMenu (when `forceStates`) | Visual |
|---|---|---|
| true | collapsed | `min 256px` / `max 356px` rail, labels + chevron when `children` |
| true | expanded | `min 256px` / `max 356px` rail + `children` list visible |
| false | n/a | 64px icon-only primary rows |

### Per-slot style contract
Resolve from **Tokens** and **States (Light Theme)** using `var(--...)` only

### Behavior contract
See **Interactions**. Selection changes emit **`onSelected`** (`MainMenuLeftSelectionDetail`); activation (including logo) emits **`onNavigate`** (`MainMenuLeftNavigationTarget`).

### Accessibility contract
See **Interactions → Accessibility**.

### Asset resolution + bundling contract
Icons via shared `Icon` + `assets/icons/<slug>.svg` (Figma slugs above).

### Fallback/error rules
- Unknown `state` → `default`
- `defaultSelectedItemId` not matching any resolved primary id → treat as **no** initial selection (no throw in reference impl.)
- Missing `iconName` on primary → use reference default `home` and log in strict QA (codegen may require icon for production builds)
- Missing both `name` and `label` on an item → empty string label; id falls back to index-based slug
- Missing icon slug when required by product → validation error at codegen boundary

### Validation checklist
- [x] Expanded width **min 256px / max 356px**, collapsed **64px**
- [x] Primary 40px row; secondary 32px with `padding-padding-6` block and `padding-padding-58` inline
- [x] Footer: **49px** footer block + **1px** root bottom border (no stacked footer+root bottom borders); icon control **16×16** with **no** extra UA padding
- [x] Selected 4px inset uses `var(--color-border-brand-base)` with `left: calc(-1 * var(--border-width-border-1))`, `width: calc(4px + var(--border-width-border-1))` (PR #82)
- [x] `MainMenuList` scroll: `overflow-y: auto` + `min-height: 0`; block gap `var(--spacing-space-8)`
- [x] **Spec Accurate Design** uses composition markup (`Item | Group → Children → secondary Items`) from `generation/spec_derived/main_menu_left_composition.py`
- [x] `onExpandedChange` + **`onSelected`** documented; single `aria-current="page"` (deepest active row)
- [ ] Token mapping re-verified against Figma MCP after token/library changes (manual gate)

## Implementation Notes

### Updates (2026-07-30, PR #82)
1. **Selected inset** — `var(--color-border-brand-base)`; `left: calc(-1 * var(--border-width-border-1))`, `width: calc(4px + var(--border-width-border-1))`; primary rows only (secondary never gets the 4px bar).
2. **Expand behavior** — parent rows (with `children`, expanded rail) only toggle the sub-menu; no navigate/select; secondary activation clears primary `selectedKey`.
3. **Parent selected-context** — `.secondaryParentSelected` reads fully selected (brand-lighter bg, brand-strong label, brand icon/chevron, 4px inset when a secondary child is active); parent takes `aria-current="page"` when its selected child is hidden.
4. **Focus ring** — primary + secondary in the rail: `inset: 0 var(--border-width-border-1)` (1px gap from Main Menu L/R border; **no drop-shadow** in the gap). Selected-Focus keeps the solid 4px `SelectedInset` only. Keyboard via `::after`; snapshot `.focusRing`; forced-state rows use `tabIndex={-1}`.

### Bug fixes applied (2026-07-01)
1. **Menu top padding missing** — Original bug: `.root` (MainMenuLeftRoot) was missing top padding. Fix: Added `padding-top: var(--padding-padding-8)`.
2. **Font-weight incorrect** — Original bug: Primary label and secondary label font-weight were 500 instead of 400. Fix: Changed to `font-weight: 400` in `.primaryLabel`, `.secondaryRow`, and `.secondaryRowSelected`.
3. **Toggle color incorrect** — Original bug: Collapse control icon used `color-icon-gray-neutral-strong` instead of `color-icon-gray-neutral-base`. Fix: Changed `.bottomToggleIcon` color to `var(--color-icon-gray-neutral-base)`.
4. **Rail side border + highlight** — Side chrome on `MainMenuLeftRoot` only (continuous through the `8px` gap). `MainMenuList` must **not** use negative side margins — hover/selected backgrounds stay inside the right border (Figma Element-Primary fill). `SelectedInset` extends into the rail border zone per PR #82 geometry above.

### Updates (2026-08-30)
1. **Expanded rail width range** — Implementation override: `min 256px` / `max 356px` (was 278px fixed). `MainMenuLeft.module.css` uses `width: 100%` clamped by `min-width` and `max-width`.
2. **Label wrap / truncate** — Primary and secondary labels support up to 2 lines (`-webkit-line-clamp: 2`) and `text-overflow: ellipsis` overflow. Implemented via `ClampedLabel` with `ResizeObserver` detection.
3. **Truncated-label `IdsTooltip`** — When a primary or secondary label is clipped, hovering it opens an `IdsTooltip` (content = `tooltip` prop or full label, `side="right"`, `arrowAlign="start"`).
4. **Icon/chevron alignment on wrap** — Primary icon and chevron are `align-self: center` on single-line rows and `align-self: flex-start` with `4px` top/bottom padding (total `24px` height) when the primary label wraps to two lines.
5. **Storybook coverage** — Added `Long Primary Label` and `Long Primary with Children` stories in `storybook-generated/ids/src/components/MainMenuLeft.stories.tsx` to QA wrapped/truncated primary and secondary rows.
6. **Keyboard accessibility** — Primary/secondary rows now support `Tab`, `↑`/`↓`, `Home`/`End`, `Enter`/`Space`, `→`/`←`, and `Escape` for focus, activation, expand/collapse, and parent/child navigation.
7. **Reference files** — `storybook/src/components/MainMenuLeft.tsx`, `storybook/src/components/MainMenuLeft.module.css`, `storybook-generated/ids/src/components/MainMenuLeft.stories.tsx`.

## Source Mapping
- Design source: IDS Design Library `0bHk3XhrjFhowgFkz9yLr4`
- Validated nodes: `11099:56218`, `11099:56206`, `11099:56244`, `11099:56230`, `11099:56237`, `11099:56245` (primary default+expanded secondary), `12016:227537` (secondary Default-Focus), `12016:227542` (secondary Selected-Focus), `12016:227840` / `12016:227912` (primary focus, collapsed secondary menu)
- Legacy exploration file (superseded for dimensions): `VZJ48bbVYrIynw8DdSukWw` / `11067:54518`
- Component map: `data/component-figma-map.json` → `Main Menu/Left` (node `11099:56218`)
- Runtime contract: `component-contracts/ids/main-menu-left.contract.ts`
- React composition: `storybook/src/components/MainMenuLeft.tsx`, `MainMenuLeft.compose.tsx`
- Composition codegen: `generation/spec_derived/main_menu_left_composition.py` (deterministic Item | Group emitter)
- Angular composition: `storybook-angular/src/components/ids-main-menu-left/` (`IDS_MAIN_MENU_LEFT_IMPORTS`)
- **Evidence (repo session):** 2026-09-02 — Figma MCP `get_design_context` + `get_metadata` + pixel screenshot on secondary Default-Focus `12016:227537` (1px gap: gray@0, white@1, blue@2) and primary Default-Focus `12016:227840` (`left/right: -1px`)
- **Evidence (repo session):** 2026-09-01 — Figma MCP `get_design_context` + `get_variable_defs` + `get_metadata` on secondary/primary focus variants (file `0bHk3XhrjFhowgFkz9yLr4`)
