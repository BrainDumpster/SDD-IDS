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
1. `StatusBarRoot`
2. optional `StatusBarTotalItem`
3. `StatusBarContentViewport`
4. repeated `StatusBarItem`
5. `StatusBarItemIconSlot`
6. `StatusBarItemValue`
7. `StatusBarItemMeta` (`category` + `label`)
8. `StatusBarItemDivider` (separate element)
9. optional `StatusBarOverflowLayer` (must sit above text/icons)
10. optional `StatusBarOverflowLeft`
11. optional `StatusBarOverflowRight`

Inventory-only nested anatomy:
- `InventoryIconTile` — `40x40` circular tile (ellipse): `var(--color-background-component-light)` fill, `1px` `var(--color-border-accessible)` border
- `InventoryMainIcon` — `16x16` `docs-bundle` (default) centered in the tile, tinted `var(--color-icon-accessible)`
- optional `InventoryStatusBadge` (severity icon overlay, `16x16`, top-right, offset ~`-4px/-5px`)
- inventory badge statuses limited to `critical | warning | in-progress` (Default/Complete/Not Applicable = no badge)
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
  - large status icon: `32x32`
  - small status icon: `16x16`
  - overflow arrow icon: `16x16`
- Typography sizing:
  - large numeric value uses `36px` with `44px` line-height (explicit fallback because `--font-size-heading-2` is not available in current token set)
  - numeric value text behavior: `white-space: nowrap`, `overflow: hidden`, `text-overflow: ellipsis`
  - small numeric value uses `24px` with `32px` line-height
  - label uses `18px/25px` in large variant and `16px/24px` in small variant
  - category text uses `14px/20px`
- Borders and separators:
  - container border: `1px` using `var(--color-border-disabled)`
  - divider is a separate element (not a simple item border) to match design overlays.
  - divider geometry: `1px` width, `56px` height, dashed stroke using `var(--color-border-disabled)`.
  - divider placement: vertically centered, rendered at slot edges as needed (including total item edges).
- Overflow layer:
  - overlay controls width: `64px` each side
  - must be above status items (`positioned layer over content`)
  - layer frame follows content bounds using `inset: -1px` in implementation.
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
  - `var(--color-background-component)`
  - `var(--color-background-component-light)`
  - `var(--color-border-disabled)`
  - `var(--color-border-accessible)`
- Text:
  - `var(--color-text-neutral)`
  - `var(--color-text-neutral-strong)`
  - `var(--color-text-brand-base)`
  - `var(--color-text-disabled)`
- Icons:
  - `var(--color-icon-brand-base)`
  - `var(--color-icon-neutral)`
  - `var(--color-icon-alerting-critical)`
  - `var(--color-icon-alerting-minor)`
  - `var(--color-icon-alerting-success)`
  - `var(--color-icon-inverse)`
- Interaction fills:
  - `var(--color-background-brand-lighter)`
  - `var(--color-background-brand-light)`
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
| item | default | `var(--color-background-component)` | dividers only | value `var(--color-text-neutral)`, label `var(--color-text-brand-base)` |
| item | hover | `var(--color-background-brand-lighter)` | `1px` `var(--color-border-brand-neutral)` cell border | label `var(--color-text-brand-base)` |
| item | press | `var(--color-background-brand-light)` | `1px` `var(--color-border-brand-neutral)` cell border | label `var(--color-text-brand-base)` |
| item | selected | `var(--color-background-brand-lighter)` | `1px` `var(--color-border-brand-neutral)` cell border | label `var(--color-text-neutral-strong)`; top-right corner ribbon (`var(--color-background-brand-base)` triangle + `shape-check-thick` in `var(--color-icon-inverse)`) |
| item | disabled | `var(--color-background-component)` | dividers only | `var(--color-text-disabled)`, icons `var(--color-icon-disabled)` |
| inventory tile | default / disabled | `var(--color-background-component-light)` | `1px` `var(--color-border-accessible)` | docs-bundle `var(--color-icon-accessible)` |
| inventory tile | hover / press / selected | `var(--color-background-component-light)` | `1px` `var(--color-border-brand-neutral)` | docs-bundle `var(--color-icon-brand-base)` |
| overflow button | default | `var(--color-background-component)` | side border `var(--color-border-disabled)` | `var(--color-icon-brand-base)` |
## States (Dark Theme)
| Slot | State | Background | Border | Text/Icon |
|---|---|---|---|---|
| item | default | `var(--color-background-component)` | dividers only | value `var(--color-text-neutral)`, label `var(--color-text-brand-base)` |
| item | hover | `var(--color-background-brand-lighter)` | `1px` `var(--color-border-brand-neutral)` cell border | label `var(--color-text-brand-base)` (semantic resolution) |
| item | press | `var(--color-background-brand-light)` | `1px` `var(--color-border-brand-neutral)` cell border | semantic token resolution |
| item | selected | `var(--color-background-brand-lighter)` | `1px` `var(--color-border-brand-neutral)` cell border | label `var(--color-text-neutral-strong)`; corner ribbon (`var(--color-background-brand-base)` + `var(--color-icon-inverse)` check) |
| item | disabled | `var(--color-background-component)` | dividers only | `var(--color-text-disabled)`, icons `var(--color-icon-disabled)` |
| inventory tile | idle vs active | `var(--color-background-component-light)` | `var(--color-border-accessible)` → `var(--color-border-brand-neutral)` | docs-bundle `var(--color-icon-accessible)` → `var(--color-icon-brand-base)` |
| overflow button | default | `var(--color-background-component)` | side border `var(--color-border-disabled)` | `var(--color-icon-brand-base)` |
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
- `total?: number | string` (enables total cell and responsive overflow behavior)
- `totalLabel?: string` (default `"Total"`)
- `totalCategory?: string` (optional, e.g. `"Alerts"`)
## Codegen Contract (Framework-Agnostic Blueprint)
- Deterministic structure:
  - `StatusBarRoot`
  - optional `StatusBarTotalItem`
  - `StatusBarContentViewport`
  - repeated `StatusBarItem`
  - optional `StatusBarOverflowLayer` with `StatusBarOverflowLeft` + `StatusBarOverflowRight`
Variant matrix:
  - type: `status-large | status-small | inventory`
  - item state: `default | hover | press | selected | disabled`
  - content density: `less | more` (from Figma `# items`)
  - total presence: `with-total | no-total`
  - overflow mode: `none | beginning | middle | end`
- Icon mapping contract:
  - critical -> `status-critical-square-solid`
  - warning -> `status-warn-tri-solid`
  - success -> `status-ok-circ-solid`
  - in-progress -> `state-progress-circle`
  - scheduled -> `state-standby-clock-solid`
  - inventory default -> `docs-bundle` (override allowed)
  - overflow left -> `chev-left-thick`
  - overflow right -> `chev-right-thick`
- Per-slot style contract:
  - all colors/spacing/typography must resolve via semantic tokens.
  - no hardcoded visual literals except documented measurement samples above.
- Behavior contract:
  - overflow layer must be rendered above item content.
  - overflow behavior is active only when `total` exists.
  - overflow scenario mapping must match Figma (`Beginning | Middle | End`) based on scroll position.
  - demo/testing may force overflow scenario explicitly (`beginning | middle | end`) to validate visual states.
- Accessibility contract:
  - root uses section/landmark semantics with label.
  - overflow controls are buttons with descriptive `aria-label`.
  - disabled items must be non-interactive and visually distinct.
- Fallback/error rules:
  - missing `items` -> generate mode-specific defaults.
  - missing inventory `iconShapeName` -> use `docs-bundle`.
  - unknown severity -> do not crash; render without severity icon and use provided `label`.
- Validation checklist:
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
