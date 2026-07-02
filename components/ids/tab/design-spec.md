# Tab Design Spec

## Metadata
- **Component:** Tab
- **Category:** Navigation
- **Design System:** IDS
- **Figma (validated):** `https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=30681-9530&m=dev`
- **Figma file key:** `0bHk3XhrjFhowgFkz9yLr4`
- **Validated node id:** `30681:9530` (`text and annotation`)
- **Variant axes observed in Figma:** `style` (`primary` | `secondary`), `state` (`selected` | `unselected-default` | `unselected-hover` | `unselected-press` | `selected-focus` | `unselected-focus`), `transparent` (`true` | `false`), `addTab` (`true` | `false`), `overflow` (`true` | `false`)
- **Runtime scope:** Horizontal tabs with item-level content, optional add-tab, responsive overflow with `More` behavior, optional icon/badge indicators.
- **Runtime contract:** `component-contracts/ids/tab.contract.ts` (defaults, overflow math, overflow caret asset constants, spec-accurate demo data)
- **Codegen source of truth:** this spec + contract — reference Storybook ports verify behavior but must not define undocumented constants.

## Anatomy
- **tabRoot** — horizontal tab group shell: tablist, optional overflow/add controls, active panel region.
- **tabItem** — one tab entry (label metadata + projected panel content).
- **tabPanel** — tab item content region (rendered in the active panel slot when parent item is selected).
- **tabLabel** — visible title on tab trigger (from item `label`).
- **tabIcon** (optional) — icon resolved from `iconSlug`.
- **tabBadge** (optional) — alert/count badge on item.
- **overflowTrigger** (optional) — `More` affordance when `overflow=true` and items exceed viewport: **label** (`moreLabel` or selected hidden tab name) + **caret icon** (`TAB_OVERFLOW_MORE_ICON_SLUG`, `10×10px`).
- **addTabTrigger** (optional) — add-tab affordance when `allowAddTab=true`.

## Layout & Measurements
- Root is container-driven: `width: 100%`, `box-sizing: border-box`.
- Tab row is horizontal and non-wrapping by default.
- Tab item height: `38px`.
- Tab item padding: `9px 24px` (`var(--padding-padding-24)` inline).
- Internal content gap: `var(--spacing-space-8)` between icon/label/badge.
- Bottom indicator thickness for selected tabs: `var(--border-width-border-thick)` (`2px`).
- Primary selected indicator placement: top edge of tab cell.
- Secondary selected indicator placement: bottom edge of tab cell.
- Dividers/baseline use `var(--border-width-border-1)`.
- Label width is content-driven; short labels (1–3 words) are preferred.
- Secondary tabs are left-aligned; overflow behavior manages tabs that do not fit the viewport.
- **Overflow trigger (`overflowTrigger`)**
  - Height: `38px` (row parity with `tabItem`).
  - Padding: `var(--padding-padding-8)` vertical, `var(--padding-padding-12)` horizontal (not tab-item `9px 24px`).
  - Content: inline-flex row — **label** then **caret** with `var(--spacing-space-8)` gap.
  - Caret icon: `arrow-tri-down-solid` at **`10×10px`** (`TAB_OVERFLOW_MORE_ICON_SIZE_PX` in contract).
  - Typography: same Body 2 scale as tab labels.
  - Selected/hover/focus/indicator rules follow the same `type` (`primary` | `secondary`) matrix as peer tab items.
- Primary tab side divider height: `var(--padding-padding-24)` (unselected), `var(--padding-padding-24)` with `var(--padding-padding-2)` top padding for selected state (total `38px`).
- Primary tab right divider height: `var(--padding-padding-24)` (unselected), `var(--padding-padding-24)` with `var(--padding-padding-2)` top padding for selected state (total `38px`).
- Primary selected tab: bottom border removed.
- Primary selected indicator placement:
  - transparent host: top border.
  - white host: top border.
- Secondary selected indicator placement:
  - transparent host: bottom border.
  - white host: bottom border.


## Tokens
- **Typography**
  - `var(--font-size-body-2)` / `var(--font-line-height-line-height-20)` for tab labels.
  - Body 1 scale for section headings/examples only.
- **Tab shell**
  - `var(--color-background-surface-2)` (elevated / white host)
  - `var(--color-border-accessible)` (default divider/baseline)
  - `var(--color-border-brand-base)` (focus ring)
  - `var(--color-border-brand-dark)` (selected indicator)
- **State backgrounds**
  - `var(--color-background-brand-lighter)` (hover unselected)
  - `var(--color-background-brand-light)` (press unselected)
- **Label text**
  - `var(--color-text-neutral)` (unselected default/focus)
  - `var(--color-text-neutral-strong)` (hover unselected)
  - `var(--color-text-brand-strong)` (selected)
- **Badges/alerts**
  - `var(--color-background-alerting-critical)` for alert badge background
  - `var(--color-text-white)` for badge text

## States (Light Theme)
| Variant | State | Background | Border | Text/Icon |
|---|---|---|---|---|
| Primary | Selected | host-dependent (`transparent` or `var(--color-background-surface-2)`) | side divider `var(--color-border-accessible)` + top indicator `2px var(--color-border-brand-dark)` | `var(--color-text-brand-strong)` |
| Primary | Unselected Default | host-dependent | baseline/divider `var(--color-border-accessible)` | `var(--color-text-neutral)` |
| Primary | Unselected Hover | `var(--color-background-brand-lighter)` | baseline/divider `var(--color-border-accessible)` | `var(--color-text-neutral-strong)` |
| Primary | Unselected Press | `var(--color-background-brand-light)` | baseline/divider `var(--color-border-accessible)` | `var(--color-text-brand-strong)` |
| Primary | Focus-visible (selected/unselected) | inherits current visual background | `2px var(--color-border-brand-base)` focus ring + state indicator/borders | inherits selected/unselected text color |
| Secondary | Selected | host-dependent (`transparent` or `var(--color-background-surface-2)`) | bottom indicator `2px var(--color-border-brand-dark)` | `var(--color-text-brand-strong)` |
| Secondary | Unselected Default | host-dependent | baseline/divider `var(--color-border-accessible)` | `var(--color-text-neutral)` |
| Secondary | Unselected Hover | `var(--color-background-brand-lighter)` | baseline/divider `var(--color-border-accessible)` | `var(--color-text-neutral-strong)` |
| Secondary | Unselected Press | `var(--color-background-brand-light)` | baseline/divider `var(--color-border-accessible)` | `var(--color-text-brand-strong)` |
| Secondary | Focus-visible (selected/unselected) | inherits current visual background | `2px var(--color-border-brand-base)` focus ring + state indicator/borders | inherits selected/unselected text color |

## States (Dark Theme)

Dark theme uses the same semantic tokens as **States (Light Theme)**. Resolved values for `[data-theme="dark"]` / `.ids-theme-dark` live in `components/ids-theme.css`.

Duplicate the full state matrix in this section only when a dark row genuinely uses different `var(--...)` references than the corresponding light row.

## Interactions
- Clicking a tab activates exactly one `tabItem` and displays its `tabPanel` content.
- Keyboard support:
  - `ArrowLeft` / `ArrowRight` moves focus among visible tab items.
  - `Home` / `End` jumps to first/last visible tab.
  - `Enter` / `Space` activates focused tab.
- Add-tab option:
  - When enabled, add action dynamically appends one tab item.
  - Newly added tab can render as placeholder (product-defined default label/content).
  - Added tab is appended to ordered tab list and participates in overflow calculation.
- Overflow (`More`) option:
  - When tabs cannot fit container width, trailing tabs move into the overflow collection; a `More` trigger remains in the tab row.
  - Selecting a tab from the overflow menu makes it active.
  - On overflow selection, trigger label becomes the selected tab name; that tab is **omitted** from the menu until a visible tab is selected.
  - If user later selects a visible in-viewport tab, trigger label returns to `moreLabel` (default `"More"`).
- Secondary tabs:
  - Default variant (`type: secondary`).
  - Left-aligned.
- Data handling:
  - Tab switches must not auto-save data; explicit save action is required.

## Composition & API (runtime)

Canonical machine-readable mirror: `component-contracts/ids/tab.contract.ts`.

**Canonical pattern:** projected `tabItem` children inside `tabRoot` — not an aggregate-only `items[]` prop.

```
TabRoot [type, surface, activeItemId?, defaultActiveItemId?, allowAddTab?, overflow?, …]
  TabItem [id, label, iconSlug?, badgeCount?, disabled?]
    TabPanel
  TabItem …
```

### Root (`TabRoot`)
| Prop | Required | Behavior |
|---|---|---|
| `type` | No | `"secondary"` (default) or `"primary"`. |
| `variant` | No | Backward-compatible alias of `type`; `type` wins when both are set. |
| `surface` | No | `"elevated"` (default) or `"transparent"` host background. |
| `activeItemId` | No | Controlled active tab `id`. |
| `defaultActiveItemId` | No | Initial tab `id` when uncontrolled (`TAB_SPEC_ACCURATE_DEFAULTS.defaultActiveItemId`). |
| `allowAddTab` | No | Enables add-tab affordance. |
| `addTabLabel` | No | Localized add action label (`TAB_API_DEFAULTS.addTabLabel`). |
| `overflow` | No | Enables responsive overflow-to-`More` (`TAB_API_DEFAULTS.overflow`). |
| `moreLabel` | No | Overflow trigger fallback label (`TAB_API_DEFAULTS.moreLabel`). |
| `minTabWidth` / `maxTabWidth` | No | Tab cell width bounds (`TAB_API_DEFAULTS.minTabWidth` / `maxTabWidth`). |

Outputs:
- `onActiveItemChange(id)`
- `onTabSelect({ id, label })` — `label` must be the selected tab name.
- `onAddTab()`
- `onOverflowSelection(id)`

### Item (`TabItem`)
| Prop | Required | Behavior |
|---|---|---|
| `id` | Yes | Stable tab id within the group. |
| `label` | Yes | Visible tab label (title case, 1–3 words). |
| `iconSlug` | No | Icon from `/assets/icons/<slug>.svg`. |
| `badgeCount` | No | Alert badge count. |
| `hasAlert` | No | Alert indicator flag. |
| `disabled` | No | Disables tab selection. |
| `simulatedState` | No | **Harness only:** `hover` \| `focus-visible` for static matrices. |

### Panel (`TabPanel`)
Projected content for the parent `tabItem`. Shown when that item is active.

### Legacy aggregate (deprecated)
Convenience wrappers that accept `items[]` may exist for demos only. New ports must implement the composition API above.

Runtime rules:
- At least two tabs are recommended.
- First tab should hold the most important content.
- Labels should be title case and ideally 1–3 words.
- Avoid truncating labels where possible; if unavoidable, use deterministic ellipsis at `maxTabWidth`.
- Tabs are not page navigation and not progress indicators.
- For vertical organization, use accordion instead of tabs.

## Codegen Contract (Framework-Agnostic Blueprint)

### Deterministic structure
1. `TabRoot`
2. `TabList` (`role="tablist"`)
3. `TabItem[]` — visible tab triggers (first *N* items per overflow algorithm)
4. optional `OverflowTrigger` (last control in row before add-tab when both present)
5. optional `OverflowMenu` — lists `overflowMenuItems` only
6. optional `AddTabTrigger`
7. `TabPanels` region
8. `ActiveTabPanel` — content from active `TabItem`

### Variant matrix
- `type`: `primary | secondary` (`variant` alias)
- `surface`: `elevated | transparent`
- `overflow`: `true | false`
- `allowAddTab`: `true | false`
- item decorations: `none | icon | badge | icon+badge | alert`
- interaction states per **States (Light Theme)**

### Per-slot style contract
- `TabItem`: `38px` height, `9px 24px` padding, `var(--spacing-space-8)` internal gap.
- `TabLabel`: Body 2 tokenized typography.
- `SelectedIndicator`: `var(--border-width-border-thick)`; `primary` → top, `secondary` → bottom.
- `FocusRing`: `var(--border-width-border-thick)` `var(--color-border-brand-base)`.
- `OverflowTrigger`: `38px` height; padding `var(--padding-padding-8) var(--padding-padding-12)`; label + caret with `var(--spacing-space-8)` gap; caret `arrow-tri-down-solid` at `10×10px`; state/indicator parity with peer `TabItem` for the active `type`.
- `AddTabTrigger`: visual parity with tab row controls.

### Behavior contract
- Exactly one `tabItem` is active; exactly one `tabPanel` is visible.
- Selecting a tab emits `onTabSelect({ id, label })`.
- **Overflow visible-slot algorithm** (use `computeTabOverflowVisibleCount` in `component-contracts/ids/tab.contract.ts`):
  - Input: container width, item count, `overflow`, `allowAddTab`, `addTabLabel`, `minTabWidth`.
  - Reserve `TAB_OVERFLOW_MORE_TRIGGER_RESERVE_PX` (`84px`) for the More trigger when overflow is enabled and `itemCount` exceeds the naive fit.
  - Reserve add-tab width via `estimateTabAddTabReservePx(addTabLabel)` when `allowAddTab` is true.
  - `visibleCount = min(itemCount, max(TAB_OVERFLOW_MIN_VISIBLE_SLOTS, floor((containerWidth - reserves) / minTabWidth)))`.
  - When `overflow` is false, `visibleCount = itemCount`.
- **Overflow collections:**
  - `hiddenItems` = ordered items after the first `visibleCount` slots.
  - `overflowMenuItems` = `hiddenItems` excluding the active tab when the active tab is in `hiddenItems`.
- **Overflow menu open rule:** open only when `overflowMenuItems.length > 0`.
- **Overflow menu presentation:** must not be clipped by the tab row shell (`overflow: hidden` on the row container is invalid for the menu popup).
- Selecting from overflow:
  1. activate the hidden item,
  2. set overflow trigger label to that item's `label`,
  3. do **not** move visible in-row tabs,
  4. omit active item from `overflowMenuItems` on subsequent opens.
- Selecting any visible tab resets overflow trigger label to `moreLabel`.
- Add-tab appends one item; `addTabLabel` is host-supplied (never hardcoded in generated components).

### Accessibility contract
- `TabList`: `role="tablist"`.
- `TabItem` trigger: `role="tab"`, `aria-selected`, `aria-controls`, stable `id`.
- `TabPanel`: `role="tabpanel"`, `aria-labelledby`.
- `OverflowTrigger`: button semantics, `aria-expanded`, `aria-haspopup`.
- `OverflowMenu`: menu/listbox semantics appropriate to the target platform.
- Focus order: visible tabs → overflow trigger → overflow menu items → add-tab trigger.

### Asset resolution + bundling contract
- `iconSlug` (tab item) → `/assets/icons/<iconSlug>.svg`.
- **Overflow caret (fixed):** `TAB_OVERFLOW_MORE_ICON_SLUG` (`arrow-tri-down-solid`) → `assets/icons/arrow-tri-down-solid.svg`; render at **`TAB_OVERFLOW_MORE_ICON_SIZE_PX` (`10×10`)** — not the tab-item default `16×16` icon size.
- Alert: optional icon slug and/or `badgeCount` with alert tokens.
- Unknown `iconSlug`: hide icon slot; keep label/badge.

**Overflow trigger rendering (codegen)**

```
OverflowTrigger (button)
  overflowLabel (text: moreLabel | selected hidden tab label)
  overflowCaretIcon (arrow-tri-down-solid, 10×10px, currentColor / label text token)
```

- Tint caret via the same text color tokens as the trigger label (`var(--color-text-neutral)` default, `var(--color-text-neutral-strong)` hover, `var(--color-text-brand-strong)` selected / menu open).
- React reference: render via shared `Icon` (`variant="mask"` default) so the glyph inherits `currentColor` — do **not** use raw `<img>` on fixed-fill SVG assets.
- Import slug and size from `component-contracts/ids/tab.contract.ts`; do not hardcode in framework ports.

### Fallback/error rules
- Unknown `type` / `variant` → `secondary`.
- Missing / invalid `activeItemId` → first non-disabled item.
- Empty item list → deterministic placeholder tab + content.
- If `overflow` is false and row cannot fit → horizontal scroll permitted.

### Validation checklist
- [ ] Primary and secondary variants follow state table and indicator placement.
- [ ] `TabRoot → TabItem → TabPanel` hierarchy is preserved.
- [ ] `computeTabOverflowVisibleCount` matches visible tab slots in overflow demos.
- [ ] Overflow selection updates trigger label without replacing visible tabs.
- [ ] Active overflow-selected tab is omitted from `overflowMenuItems`.
- [ ] Selecting a visible tab restores trigger label to `moreLabel`.
- [ ] More menu is not clipped; opens only when `overflowMenuItems.length > 0`.
- [ ] Add-tab appends one item; `addTabLabel` is configurable.
- [ ] Keyboard and ARIA behavior conforms to tabs pattern.
- [ ] Labels follow usage rules; no autosave on tab switch.
- [ ] Light and dark values resolve through semantic tokens only.
- [ ] Overflow trigger renders `moreLabel` (or selected hidden tab label) + `arrow-tri-down-solid` at `10×10px` per contract constants.

## Source Mapping
| Source | Location |
|---|---|
| Component map | `data/component-figma-map.json` → `Tab` |
| Validated Figma node | `30681:9530` (primary/secondary, overflow, add-tab, states) |
| Figma MCP evidence | `get_design_context` + `get_variable_defs` on `30681:9530`; overflow caret `10×10` on `arrow-tri-down-solid` (2026-07-02) |
| Theme CSS | `components/ids-theme.css` |
| Runtime / codegen contract | `component-contracts/ids/tab.contract.ts` |
| Programme inheritance | `data/programme-inheritance-registry.json` → `tab` (Synapse IDS-fork) |

Reference implementations (verification only — not part of the codegen contract):
| Port | Location |
|---|---|
| Angular composition | `storybook-angular/src/components/ids-tab/` |
| React aggregate demo | `storybook/src/components/Tabs.tsx` · `storybook-generated/ids/src/components/Tab.stories.tsx` |
| Synapse Nav Tab | `components/synapse/tab/design-spec.md` |
