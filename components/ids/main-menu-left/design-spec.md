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
- Last verified: 2026-05-20 (repo parity: selection API, scroll region, spec/story alignment)
- Reference implementation: `storybook/src/components/MainMenuLeft.tsx`, `storybook/src/components/MainMenuLeft.module.css`
- Spec path constant (imports / tooling): `storybook/src/spec-contracts/ids-main-menu-left.contract.ts`
- Generated Storybook: `storybook-generated/ids/src/components/MainMenuLeft.stories.tsx` (title **`Spec Generated/IDS/Main Menu Left`**, primary story **`Spec Accurate Design`**)
- Implementation guide: [`components/ids/main-menu-left/README.md`](./README.md)

## Anatomy
Deterministic slot order (Figma-aligned + optional product slot):
1. `MainMenuLeftRoot` — vertical rail (`nav`)
2. `PrimaryMenuLogo?` — optional branding block **above** the primary list (not in base Figma `11099:56218`; host supplies asset or icon + optional `link`)
3. `MainMenuList` — scrollable primary stack (`Menu`): CSS `overflow-y: auto` + `min-height: 0` on the flex child that wraps primary blocks; vertical gap `var(--spacing-space-8)` between blocks
4. `MainMenuPrimaryItem` — `.MainMenu-Left-Element-Primary` (expanded) or `.MainMenu-Left-Element-PrimaryIcon` (collapsed)
   - `PrimaryIcon` — 16×16 mask icon (`assets/icons/<slug>.svg`)
   - `PrimaryLabel` — Body 1 medium (hidden when collapsed)
   - `PrimaryChevron` — 14×14 `chev-right-thick` / `chev-down-thick` when `children` exist (expanded only)
   - `SelectedInset` — 4px leading bar (`var(--color-border-brand-base)`)
   - `FocusRing` — 1px `var(--color-border-brand-base)` outline (focus variants)
5. `MainMenuSecondaryList` — optional, under expanded primary row when `children` exist
   - `MainMenuSecondaryItem` — `.MainMenu-Left-Element-Secondary` (32px row)
6. `ExpandCollapse` — footer control; **16×16** icon (`double-chev-left` when expanded / `double-chev-right` when collapsed)

## Layout & Measurements
- **Expanded rail width:** `278px` (Figma `11099:56218`)
- **Collapsed rail width:** `64px` (24px inline padding × 2 + 16px icon; Figma `11099:56206`)
- **Sample frame height:** `888px` (container-driven at runtime; Storybook uses `100vh`)
- **Menu top padding:** `var(--padding-padding-8)` on `MainMenuLeftRoot`
- **Menu list gap:** `var(--spacing-space-8)` between primary blocks
- **MainMenuList scroll:** primary stack lives in a flex child with `min-height: 0` and `overflow-y: auto` so long menus scroll inside the rail (footer + optional logo stay fixed)
- **Primary row (expanded):** min-height `40px`; padding `var(--padding-padding-8)` block, `var(--padding-padding-24)` inline; gap `var(--spacing-space-16)`
- **Primary row (collapsed icon):** padding `var(--padding-padding-12)` block, `var(--padding-padding-24)` inline
- **Secondary row:** height `32px` (`box-sizing: border-box`); padding `var(--padding-padding-6)` block, `var(--padding-padding-58)` inline (Figma `11099:56237`: 6px top/bottom, 58px left/right)
- **Primary icon:** 16×16
- **Chevron:** 14×14
- **Collapse footer (`ExpandCollapse`):** **49px** footer block (`box-sizing: border-box`): `1px` **top** border (`var(--color-border-accessible)`) + `var(--padding-padding-16)` block padding + **16×16** icon + `var(--padding-padding-16)` block padding; **no** `border-bottom` on the footer — the **rail bottom stroke** is **`MainMenuLeftRoot` `border-bottom` only** (single 1px line; avoids doubling with the container). Inline padding `var(--padding-padding-24)`; icon slugs `double-chev-left` / `double-chev-right`
- **Borders:** **container chrome** — `MainMenuLeftRoot` uses `var(--color-border-accessible)` on **left, right, and bottom** (single bottom edge for the whole rail). **`ExpandCollapse`** uses **`border-top` only** to separate from the menu list (no extra `border-bottom` on the footer — avoids a double 1px line with the root). **`MainMenuList` (content)** has `margin-left: calc(-1 * var(--border-width-border-1))` and `margin-right: calc(-1 * var(--border-width-border-1))` to extend outside the container. **`MainMenuPrimaryItem` (Element-Primary)** and **`MainMenuSecondaryItem` (Element-Secondary)** carry their own **left + right** `1px` `var(--color-border-accessible)` border with `z-index: 1`, so their side borders read as the rail edges along each row (the content spans the full rail width so these align over the root borders rather than doubling). **`FocusRing`** uses `inset: 0 calc(-1 * var(--border-width-border-1))` to extend outside. **`SelectedInset`** uses `left: calc(-1 * var(--border-width-border-1))` and `width: calc(4px + var(--border-width-border-1))` to extend outside.

## Tokens
### Surfaces and borders
- `var(--color-background-component)` — rail background
- `var(--color-border-accessible)` — **root** left/right/**bottom** border (closes the rail); footer uses **top** border only to separate from `MainMenuList` (not per-row strokes)
- `var(--color-background-brand-lighter)` — primary/secondary hover, selected, selected-focus backgrounds
- `var(--color-background-brand-light)` — primary/secondary press backgrounds

### Typography
- Primary label: Body 1 — `var(--font-size-body-1)` / `var(--font-line-height-line-height-24)`, weight 400, `var(--color-text-neutral-strong)` default, `var(--color-text-brand-strong)` on hover/press/selected
- Secondary label: Body 2 — `var(--font-size-body-2)` / `var(--font-line-height-line-height-20)`, weight 400

### Icons
- Default primary: `var(--color-icon-neutral-strong)`
- Hover/press primary: `var(--color-icon-brand-strong)`
- Selected primary: `var(--color-icon-brand-base)`
- Chevron: `var(--color-icon-brand-strong)`
- Collapse control: `var(--color-icon-neutral)`

## States (Light Theme)
### Primary row (`.MainMenu-Left-Element-Primary`, expanded)

| State | Children list (`childrenMenu` when `forceStates`) | Background | Border / inset | Text | Icon |
|---|---|---|---|---|---|
| Default | Collapsed | transparent | none (container border only) | `var(--color-text-neutral-strong)` | `var(--color-icon-neutral-strong)` |
| Default | Expanded | transparent | none | `var(--color-text-neutral-strong)` | `var(--color-icon-neutral-strong)` |
| Hover | * | `var(--color-background-brand-lighter)` | none | `var(--color-text-brand-strong)` | `var(--color-icon-brand-strong)` |
| Press | * | `var(--color-background-brand-light)` | none | `var(--color-text-brand-strong)` | `var(--color-icon-brand-strong)` |
| Selected | Collapsed | `var(--color-background-brand-lighter)` | **4px inset** `var(--color-border-brand-base)` | `var(--color-text-brand-strong)` | `var(--color-icon-brand-base)` |
| Selected | Expanded | `var(--color-background-brand-lighter)` | **4px inset** `var(--color-border-brand-base)` | `var(--color-text-brand-strong)` | `var(--color-icon-brand-base)` |
| Default-Focus | * | transparent | focus ring `var(--color-border-brand-base)` (not a side border) | `var(--color-text-neutral-strong)` | `var(--color-icon-neutral-strong)` |
| Selected-Focus | * | `var(--color-background-brand-lighter)` | inset + focus ring | `var(--color-text-brand-strong)` | `var(--color-icon-brand-base)` |

### Primary icon-only (`.MainMenu-Left-Element-PrimaryIcon`, collapsed)

| State | Background | Inset | Icon |
|---|---|---|---|
| Default | transparent | — | `var(--color-icon-neutral-strong)` |
| Selected | `var(--color-background-brand-lighter)` | **4px** `var(--color-border-brand-base)` | `var(--color-icon-brand-base)` |
| Hover / Press | same token mapping as expanded primary | — | brand-strong / brand-base per state |

### Secondary row (`.MainMenu-Left-Element-Secondary`)

| State | Background | Text |
|---|---|---|
| Default | transparent | `var(--color-text-neutral)` |
| Hover | `var(--color-background-brand-lighter)` | `var(--color-text-brand-strong)` |
| Press | `var(--color-background-brand-light)` | `var(--color-text-brand-strong)` |
| Selected | `var(--color-background-brand-lighter)` | `var(--color-text-brand-strong)` |
| Default-Focus | transparent + outline `var(--color-border-brand-base)` | `var(--color-text-neutral)` |
| Selected-Focus | `var(--color-background-brand-lighter)` + outline | `var(--color-text-brand-strong)` |

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
- Collapse footer: toggles expanded (`278px`) ↔ collapsed (`64px`); swaps `double-chev-left` ↔ `double-chev-right`.
- Chevron reflects `children` list open (`chev-down-thick`) vs closed (`chev-right-thick`).
- **`childrenMenu` (runtime):** when `forceStates` is **false**, open/closed state is driven by user interaction (in-memory expand key on the primary row). When `forceStates` is **true** (Storybook matrix only), `childrenMenu` pins the list open or closed for that row.
- Keyboard: arrow keys move focus; Enter/Space activate; Escape closes `children` list (product-defined).

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

### Root props / outputs (framework mapping)

| Name | Direction | Type | Notes |
|------|------------|------|--------|
| `logo` | Input | `MainMenuLeftLogo?` | Optional slot: `src` and/or `iconName`, required `alt`, optional `tooltip`, optional `link` |
| `items` | Input | `MainMenuLeftPrimaryItem[]` | User-defined tree; order = render order |
| `expanded` | Input | `boolean?` | With `onExpandedChange`: **controlled** rail. Without: **uncontrolled** initial value (default `true`) |
| `onExpandedChange` | Output | `(expanded: boolean) => void` | **Angular:** `@Output() expandedChange` (or product naming). Fired when footer toggles expanded ↔ collapsed |
| `defaultSelectedItemId` | Input | `string?` | Initial **primary** selection; must match resolved primary `id`. **Spec Accurate Design:** `"dashboard"` |
| `onSelected` | Output | `(MainMenuLeftSelectionDetail) => void` | Active row changed (primary or secondary). **Angular:** `@Output() selectedChange` (or product naming). Fires on user interaction — **not** emitted solely because `defaultSelectedItemId` was applied on mount |
| `onNavigate` | Output | `(MainMenuLeftNavigationTarget) => void` | Primary, secondary, or logo activation |
| `forceStates` | Input | `boolean?` | Storybook / QA only — freezes `item.state` |
| `ariaLabel` | Input | `string?` | Default: `"Main menu left"` |

### User configuration model (codegen source)

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

Codegen and `MainMenuLeft.stories.tsx` **Spec Accurate Design** must use:

- `expanded: true`; **`defaultSelectedItemId: "dashboard"`** so the first primary row matches Figma selected state (`home` icon row)
- `items` matching Figma `11099:56218` labels and icon slugs: `home`, `network-share`, `shield-encrypt-alt`, `arrows-spin`, `alert-bell`, `productivity-alt`, `user-settings`, `time-detail`
- Use canonical field **`children`** (not `secondaryItems`) and **`childrenMenu`** for forced matrix state
- Parent frame: `height: 100vh`, flex row, canvas `var(--color-background-surface-1)`
- Stories: **Collapsed** (`expanded: false`), **PrimaryStateSnapshotMatrix** (`forceStates` with all primary states from `11099:56244`)

## Codegen Contract (Framework-Agnostic Blueprint)
### Deterministic structure
Emit slots in **Anatomy** order. Primary/secondary PascalCase names must match codegen contract.

### Variant matrix
| expanded | childrenMenu (when `forceStates`) | Visual |
|---|---|---|
| true | collapsed | 278px rail, labels + chevron when `children` |
| true | expanded | 278px + `children` list visible |
| false | n/a | 64px icon-only primary rows |

### Per-slot style contract
Resolve from **Tokens** and **States (Light Theme)** using `var(--...)` only.

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
- [x] Expanded width **278px**, collapsed **64px**
- [x] Primary 40px row; secondary 32px with `padding-padding-6` block and `padding-padding-58` inline
- [x] Footer: **49px** footer block + **1px** root bottom border (no stacked footer+root bottom borders); icon control **16×16** with **no** extra UA padding
- [x] Selected 4px inset uses `var(--color-border-brand-base)`
- [x] `MainMenuList` scroll: `overflow-y: auto` + `min-height: 0`; block gap `var(--spacing-space-8)`
- [x] **Spec Accurate Design** uses `defaultSelectedItemId: "dashboard"` + canonical **`children`** / **`childrenMenu`**
- [x] `onExpandedChange` + **`onSelected`** documented; single `aria-current="page"` (deepest active row)
- [ ] Token mapping re-verified against Figma MCP after token/library changes (manual gate)

## Implementation Notes

### Updates (2026-07-29)
1. **Selected inset color** — the primary `.selectedInset` bar uses `--color-border-brand-base` in **every** state; expanded and collapsed match (no state-specific override). Also removed the stray 4px `box-shadow` inset on secondary selected-focus rows — per spec only primary rows have the inset bar; secondary selected-focus shows just the focus outline.
2. **Expand behavior** — parent rows (with `children`, expanded rail) only toggle the sub-menu, no navigate/select; secondary activation clears the primary `selectedKey`.
3. **Parent selected-context** — `.secondaryParentSelected` reads fully selected (brand-lighter bg, brand-strong label, brand icon/chevron), and the parent takes `aria-current="page"` when its selected child is hidden.
4. **Primary focus ring** — real keyboard focus on a primary row uses `.interactive:focus-visible` → 1px `--color-border-brand-base` outline, `outline-offset: -1px`, `radius-4`, so the ring is uniform on all four sides.

### Bug fixes applied (2026-07-01)
1. **Menu top padding missing** — Original bug: `.root` (MainMenuLeftRoot) was missing top padding. Fix: Added `padding-top: var(--padding-padding-8)`.
2. **Font-weight incorrect** — Original bug: Primary label and secondary label font-weight were 500 instead of 400. Fix: Changed to `font-weight: 400` in `.primaryLabel`, `.secondaryRow`, and `.secondaryRowSelected`.
3. **Toggle color incorrect** — Original bug: Collapse control icon used `color-icon-neutral-strong` instead of `color-icon-neutral`. Fix: Changed `.bottomToggleIcon` color to `var(--color-icon-neutral)`.
4. **Row borders missing** — Original bug: Primary and secondary rows lacked left/right borders to stack above container border. Fix: Added left/right borders to `.primaryRow` and `.secondaryRow` with `color-border-accessible` and `z-index: 1`. `.content` uses `margin-left: calc(-1 * var(--border-width-border-1))` and `margin-right: calc(-1 * var(--border-width-border-1))` to extend outside container. `.focusRing` uses `inset: 0 calc(-1 * var(--border-width-border-1))` to extend outside. `.selectedInset` uses `left: calc(-1 * var(--border-width-border-1))` and `width: calc(4px + var(--border-width-border-1))` to extend outside. This creates the visual effect where row borders read as the rail edges along each row, aligning over the root borders rather than doubling.

## Source Mapping
- Design source: IDS Design Library `0bHk3XhrjFhowgFkz9yLr4`
- Validated nodes: `11099:56218`, `11099:56206`, `11099:56244`, `11099:56230`, `11099:56237`, `11099:56245` (primary default+expanded secondary)
- Legacy exploration file (superseded for dimensions): `VZJ48bbVYrIynw8DdSukWw` / `11067:54518`
- Component map: `data/component-figma-map.json` → `Main Menu/Left` (node `11099:56218`)
- **Evidence (repo session):** 2026-05-20 — spec/story/API parity pass (selection + scroll + outputs); live Figma MCP re-check recommended after library token edits
