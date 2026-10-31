# Status Bar Design Spec

## Metadata
- **Storybook path:** `storybook-generated/ids/src/components/StatusBar.stories.tsx`
- **Deterministic generator:** `generation/deterministic_storybook/ids/status_bar.py`
- Component: Status Bar
- Design System: IDS
- Category: Patterns and Templates
- Canonical Figma file: https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library
- File key: `0bHk3XhrjFhowgFkz9yLr4`
- Main node: `15412:10699` (`StatusBar-Main`)
- Evidence nodes:
  - elements (small): `15412:9261`
  - elements (inventory category): `15405:9692`
  - overflow arrows: `18544:13477` (`Left` `Right`)
  - overflow container: `18544:13502`
  - variations/state overview: `43206:189639`
  - dark-mode overflow/state board: `43206:189637`
- Last live verification: Figma MCP (`get_metadata`, `get_design_context`, `get_variable_defs`) in this session.
## Anatomy
Main component:
- `StatusBar`

Deterministic child structure (required order):
1. `StatusBarTotalItem` (optional — only when `total` is provided)
2. `StatusBarContentViewport`
3. repeated `StatusBarItem`
4. `StatusBarItemIconSlot`
5. `StatusBarItemValue`
6. `StatusBarItemMeta` (`category` + `label`) — category line is **large-only**; small and inventory render `label` only
7. `StatusBarItemDivider` (separate element; not an item border)
8. `StatusBarOverflowLayer` (optional — shown when the content overflows, on any variant incl. inventory; must sit above text/icons)
9. `StatusBarOverflowLeft` (optional)
10. `StatusBarOverflowRight` (optional)

Inventory-only nested anatomy (inside `StatusBarItemIconSlot`; omitted entirely in the `showIcons={false}` "No Icon" variant, where items are value + label only):
- `InventoryIconTile` — `40x40` circular tile: `var(--color-background-surface-component-light)` fill, `1px` `var(--color-border-gray-neutral-base)` border (idle) / `var(--color-border-brand-base-neutral)` (hover/press/selected)
- `InventoryMainIcon` — `16x16` `docs-bundle` (default) centered in the tile, `var(--color-icon-gray-neutral-accessible)` (idle) → `var(--color-icon-brand-base)` (active)
- optional `InventoryStatusBadge` (severity icon overlay, `16x16`, top-right, offset ~`-4px/-5px`); badge statuses limited to `critical | warning | in-progress`

Composition nesting (deterministic):
```
StatusBar
  StatusBarTotalItem?
    StatusBarItemDivider          (left edge)
    StatusBarItemValue
    StatusBarItemMeta             (optional category + label)
    StatusBarItemDivider          (right edge)
  StatusBarContentViewport
    StatusBarItem[]
      StatusBarItemDivider?       (left edge on first item)
      StatusBarItemIconSlot
        InventoryMainIcon?        (inventory)
        InventoryStatusBadge?     (inventory + severity)
      StatusBarItemValue
      StatusBarItemMeta
      StatusBarItemDivider        (right edge)
    StatusBarOverflowLayer?       (any variant, when content overflows)
      StatusBarOverflowLeft?
      StatusBarOverflowRight?
```
## Layout & Measurements
- Primary variants:
  - `Status Bar - Large`: total bar height `77px`
  - `Status Bar - Small`: total bar height `57px`
  - `Inventory Bar`: total bar height `78px`
- Item paddings:
  - large status item: `16px 24px`
  - small status item: `12.5px 32px 12.5px 24px` (asymmetric per Figma: 24px leading, 32px trailing)
  - inventory item: `13px 24px`
- Gaps:
  - icon-to-value gap: `8px`
  - status bar total-to-content gap: `24px` when total is present.
- Icon sizes:
  - large status icon: `24x24`
  - small status icon: `16x16`
  - overflow arrow icon: `16x16`
- Content layout per variant:
  - large: `icon | value | [category / label]` (meta is a two-line column)
  - small: `icon | value | label` — all inline, no category
  - inventory: `tile | [value / label]` — value stacked directly over label (one column beside the tile), no category
- Typography sizing:
  - large numeric value uses `36px` with `44px` line-height (explicit fallback because `--font-size-heading-2` is not available in current token set)
  - numeric value text behavior: `white-space: nowrap`, `overflow: hidden`, `text-overflow: ellipsis`
  - small **and inventory** numeric value use `24px` with `32px` line-height (header-5)
  - label uses `18px/25px` in large variant, `16px/24px` in small variant, and `14px/20px` (body-2) in **inventory**
  - category text uses `14px/20px` (large only)
- Width: the bar hugs its content (`width: fit-content`, `max-width: 100%`) — it never leaves trailing whitespace; when the container is narrower than the content the strip scrolls and the overflow arrows appear.
- Borders and separators:
  - container border: `1px` using `var(--color-border-gray-disabled)`
  - divider is a separate element (not a simple item border) to match design overlays.
  - divider geometry: `1px` width, `56px` height, dashed stroke using `var(--color-border-gray-disabled)`.
  - divider placement: vertically centered, rendered at slot edges as needed (including total item edges).
  - on a hover/press/selected cell the dotted dividers touching it (its own and the previous item's trailing divider) are hidden, so the `1px` brand border reads as a clean rectangle.
- Overflow layer:
  - overlay controls width: `64px` each side
  - must be above status items (`positioned layer over content`)
  - layer sits inside the viewport border (`inset: 0`) so the arrows/fade never cover the container border.
  - each arrow draws a `1px` `var(--color-border-gray-disabled)` divider on its content-facing edge, above the gradient fade.
  - gradient mask from `var(--color-gradient-overflow-horizontal-inverse-start)` to `var(--color-gradient-overflow-horizontal-inverse-end)`
  - left arrow icon: `chev-left-thick`
  - right arrow icon: `chev-right-thick`
  - overflow scenarios:
    - `Beginning`: show right arrow only
    - `Middle`: show both left and right arrows
    - `End`: show left arrow only
- Responsiveness rule:
  - status bar horizontal responsiveness/overflow controls are enabled only when `total` item exists.
  - when `total` is omitted, item strip stays static (no overflow arrows).
## Tokens
- Surfaces and borders:
  - `var(--color-background-surface-component)`
  - `var(--color-background-surface-component-light)`
  - `var(--color-border-gray-disabled)`
  - `var(--color-border-gray-neutral-base)`
- Text:
  - `var(--color-text-gray-neutral)`
  - `var(--color-text-gray-neutral-strong)`
  - `var(--color-text-brand-base)`
  - `var(--color-text-gray-disabled)`
- Icons:
  - `var(--color-icon-brand-base)`
  - `var(--color-icon-gray-neutral-base)`
  - `var(--color-icon-alerting-critical-base)`
  - `var(--color-icon-alerting-minor-base)`
  - `var(--color-icon-alerting-success-base)`
  - `var(--color-icon-gray-inverse)`
- Interaction fills:
  - `var(--color-background-brand-lighter-slate)`
  - `var(--color-background-brand-light-slate)`
  - `var(--color-background-brand-base)`
- Overflow gradients:
  - `var(--color-gradient-overflow-horizontal-inverse-start)`
  - `var(--color-gradient-overflow-horizontal-inverse-end)`

MCP variable evidence confirms:
- light theme values for status bar nodes (`15412:10699`, `15412:9261`, `15405:9692`, `18544:13502`)
- dark theme semantic substitutions on variation node (`43206:189639`) while token names remain unchanged.
## States (Light Theme)
| Slot | State | Background | Border | Text/Icon |
|---|---|---|---|---|
| item | default | `var(--color-background-surface-component)` | right divider `var(--color-border-gray-disabled)` | value `var(--color-text-gray-neutral)`, label `var(--color-text-brand-base)` |
| item | hover | `var(--color-background-brand-lighter-slate)` | `1px` `var(--color-border-brand-base-neutral)` cell border | label `var(--color-text-brand-base)` |
| item | press | `var(--color-background-brand-light-slate)` | `1px` `var(--color-border-brand-base-neutral)` cell border | label `var(--color-text-brand-base)` |
| item | selected | `var(--color-background-brand-lighter-slate)` | `1px` `var(--color-border-brand-base-neutral)` cell border | label `var(--color-text-gray-neutral-strong)`; top-right corner ribbon (`var(--color-background-brand-base)` triangle + `shape-check-thick` in `var(--color-icon-gray-white)`) |
| inventory tile | hover / press / selected | `var(--color-background-surface-component-light)` | `1px` `var(--color-border-brand-base-neutral)` | `docs-bundle` `var(--color-icon-brand-base)` |
| item | disabled | `var(--color-background-surface-component-light)` | dividers only | `var(--color-text-gray-disabled)`, icons use accessible/disabled tone |
| overflow button | default | `var(--color-background-surface-component)` | side border `var(--color-border-gray-disabled)` | `var(--color-icon-brand-base)` |
## States (Dark Theme)
| Slot | State | Background | Border | Text/Icon |
|---|---|---|---|---|
| item | default | `var(--color-background-surface-component)` | right divider `var(--color-border-gray-disabled)` | value `var(--color-text-gray-neutral)`, label `var(--color-text-brand-base)` |
| item | hover | `var(--color-background-brand-lighter-slate)` | `1px` `var(--color-border-brand-base-neutral)` cell border | semantic token resolution |
| item | press | `var(--color-background-brand-light-slate)` | `1px` `var(--color-border-brand-base-neutral)` cell border | semantic token resolution |
| item | selected | `var(--color-background-brand-lighter-slate)` | `1px` `var(--color-border-brand-base-neutral)` cell border | label `var(--color-text-gray-neutral-strong)`; corner ribbon (`var(--color-background-brand-base)` + `var(--color-icon-gray-white)` check) |
| inventory tile | hover / press / selected | `var(--color-background-surface-component-light)` | `1px` `var(--color-border-brand-base-neutral)` | `docs-bundle` `var(--color-icon-brand-base)` |
| item | disabled | `var(--color-background-surface-component-light)` | dividers only | `var(--color-text-gray-disabled)` and accessible icons |
| overflow button | default | `var(--color-background-surface-component)` | side border `var(--color-border-gray-disabled)` | `var(--color-icon-brand-base)` |
## Interactions
- Item interactions support `default | hover | press | selected | disabled`.
- Overflow controls:
  - appear only when total item exists and content overflows.
  - left control enabled when scrolled past start.
  - right control enabled when more content exists.
  - layer sits on top of text/icons to preserve editable item content beneath.
- Keyboard:
  - overflow buttons are standard buttons (`Enter` / `Space` trigger scroll).
  - disabled items are non-interactive.
## Composition & API (runtime)
- `type: "status-large" | "status-small" | "inventory"` (default `"status-large"`).
- `items: StatusBarItem[]` where each item supports:
  - `id: string`
  - `value: number | string`
  - `category?: string`
  - `label: string`
  - `severity?: "critical" | "warning" | "success" | "in-progress" | "scheduled" | "canceling" | "canceled" | "skipped" | "unknown"`
  - `state?: "default" | "hover" | "press" | "selected" | "disabled"`
  - `iconShapeName?: string` (inventory mode user-defined; default `docs-bundle`)
- `total?: number | string` (enables the total cell; optional for every variant)
- `totalLabel?: string` (default `"Total"`)
- `totalCategory?: string` (optional, e.g. `"Alerts"`)
- `showIcons?: boolean` (default `true`; inventory-only — `false` renders the "No Icon" variant with no tile, just value + label)
- `overflowState?: "auto" | "beginning" | "middle" | "end"` (overflow arrows appear on any variant — including inventory — whenever content overflows; `auto` derives from scroll position)
## Codegen Contract (Framework-Agnostic Blueprint)
### Deterministic structure
Render order is locked to **Anatomy**. Framework roots map `StatusBar` (not `StatusBarRoot`) — React `IdsStatusBar`, same child slot names with the programme prefix.

Required tree:
- `StatusBar`
  - optional `StatusBarTotalItem` → `StatusBarItemDivider` (left) + `StatusBarItemValue` + `StatusBarItemMeta` + `StatusBarItemDivider` (right)
  - `StatusBarContentViewport`
    - repeated `StatusBarItem` → optional leading `StatusBarItemDivider` (first item) + `StatusBarItemIconSlot` + `StatusBarItemValue` + `StatusBarItemMeta` + trailing `StatusBarItemDivider`
    - optional `StatusBarOverflowLayer` → `StatusBarOverflowLeft?` + `StatusBarOverflowRight?`

Prop-driven `items` / `total` MUST emit this same tree. Compound children MAY replace chrome when `StatusBarContentViewport` (and optional `StatusBarTotalItem`) are projected.

### Variant matrix
- type: `status-large | status-small | inventory`
- item state: `default | hover | press | selected | disabled`
- content density: `less | more` (from Figma `# items`)
- total presence: `with-total | no-total`
- overflow mode: `none | beginning | middle | end`

### Icon mapping contract
- critical -> `status-critical-square-solid`
- warning -> `status-warn-tri-solid`
- success -> `status-ok-circ-solid`
- in-progress -> `state-progress-circle`
- scheduled -> `state-standby-clock-solid`
- inventory default -> `docs-bundle` (override allowed)
- overflow left -> `chev-left-thick` (asset slug; Figma label may read `check-left-thick`)
- overflow right -> `chev-right-thick`

### Per-slot style contract
- all colors/spacing/typography must resolve via semantic tokens.
- no hardcoded visual literals except documented measurement samples above.

### Behavior contract
- overflow layer must be rendered above item content.
- overflow behavior is active only when `total` exists.
- overflow scenario mapping must match Figma (`Beginning | Middle | End`) based on scroll position.
- demo/testing may force overflow scenario explicitly (`beginning | middle | end`) to validate visual states.

### Accessibility contract
- root uses section/landmark semantics with label.
- overflow controls are buttons with descriptive `aria-label`.
- disabled items must be non-interactive and visually distinct.

### Asset resolution + bundling contract
- Icons resolve from `assets/icons/<slug>.svg` via the shared Icon primitive (`IdsIcon` in React).
- Severity glyphs use the full-color (`img`) variant; inventory `docs-bundle` and overflow chevrons use the tintable mask variant.
- Overflow left slug is `chev-left-thick`; overflow right slug is `chev-right-thick`.
- Missing inventory `iconShapeName` resolves to `docs-bundle`. Unknown severity renders no severity icon.

### Fallback/error rules
- missing `items` -> generate mode-specific defaults.
- missing inventory `iconShapeName` -> use `docs-bundle`.
- unknown severity -> do not crash; render without severity icon and use provided `label`.

### Validation checklist
- [ ] All three variants render with correct heights.
- [ ] Item states match tokenized backgrounds.
- [ ] Total item shows dashed dividers on both left and right edges even with full border.
- [ ] Content group shows first-item left divider and last-item right divider.
- [ ] Overflow arrows appear only with total + overflow.
- [ ] Overflow scenario visuals match:
  - Beginning => right arrow only
  - Middle => both arrows
  - End => left arrow only
- [ ] Left/right arrows use required icon slugs.
- [ ] Inventory supports default and user-defined icon.
- [ ] Light/dark both render via semantic tokens.
- [ ] Anatomy order matches Deterministic structure (`StatusBar` root, not `StatusBarRoot`).
## Source Mapping
- Component map source: `data/component-figma-map.json` (`Status Bar`)
- Figma nodes used:
  - `15412:10699` main status bar set
  - `15412:9261` small status item states
  - `15405:9692` inventory item states
  - `18544:13477` overflow arrows
  - `18544:13502` overflow container
  - `43206:189639` variation/state showcase and overflow behavior notes
  - `43206:189637` dark-mode overflow board with Beginning/Middle/End references
- Live verification method: Figma MCP tools `get_metadata`, `get_design_context`, `get_variable_defs`.
