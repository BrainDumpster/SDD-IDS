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
## Anatomy
Document component parts in deterministic order. Add one bullet per slot (root, label, icon, etc.).

## Layout & Measurements
- Root is container-driven: `width: 100%`, `box-sizing: border-box`.
- Tab row is horizontal and non-wrapping by default.
- Tab item height: `38px`.
- Tab item padding: `9px 24px`.
- Internal content gap: `8px` between icon/label/badge.
- Bottom indicator thickness for selected tabs: `2px`.
- Primary selected indicator placement:
  - transparent host: top border.
  - white host: top border.
- Secondary selected indicator placement:
  - transparent host: bottom border.
  - white host: bottom border.
- Dividers/baseline use `1px` borders.
- Label width is content-driven; short labels (1-3 words) are preferred.
- Secondary tabs are left-aligned and may extend beyond viewport; overflow behavior manages hidden tabs.
- Focus ring heights:
  - Primary tabs: `var(--sizing-size-36, 36px)` focus ring height (centered within `var(--sizing-size-38, 38px)` tab with `var(--spacing-space-1, 1px)` top/bottom margin)
  - Secondary tabs: `var(--sizing-size-34, 34px)` focus ring height (centered within `var(--sizing-size-38, 38px)` tab with `var(--spacing-space-2, 2px)` top/bottom margin)
  - Focus ring uses `outline` (not box-shadow) with `var(--border-width-border-2, 2px)` thickness using `var(--color-border-brand-base)`
## Tokens
- **Typography**
  - `Body 2` (`14/20`) for tab labels.
  - `Body 1` (`16/24`) for section headings/examples.
- **Tab shell**
  - `var(--color-background-surface-2)` (white host / tab background)
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
Dark mode follows the exact same structural matrix and interaction semantics as Light mode, with all visual values resolved via semantic tokens and no hardcoded hex values.

| Variant | State | Background | Border | Text/Icon |
|---|---|---|---|---|
| Primary | Selected | semantic token resolved | semantic token resolved | semantic token resolved |
| Primary | Unselected Default | semantic token resolved | semantic token resolved | semantic token resolved |
| Primary | Unselected Hover | semantic token resolved | semantic token resolved | semantic token resolved |
| Primary | Unselected Press | semantic token resolved | semantic token resolved | semantic token resolved |
| Secondary | Selected | semantic token resolved | semantic token resolved | semantic token resolved |
| Secondary | Unselected Default | semantic token resolved | semantic token resolved | semantic token resolved |
| Secondary | Unselected Hover | semantic token resolved | semantic token resolved | semantic token resolved |
| Secondary | Unselected Press | semantic token resolved | semantic token resolved | semantic token resolved |
## Interactions
- Clicking a tab activates exactly one `Tab Item` and displays its `Tab Item Content`.
- Keyboard support:
  - `ArrowLeft` / `ArrowRight` moves focus among visible tab items.
  - `Home` / `End` jumps to first/last visible tab.
  - `Enter` / `Space` activates focused tab.
- Add-tab option:
  - When enabled, add action dynamically appends one tab item.
  - Newly added tab can render as placeholder (product-defined default label/content).
  - Added tab is appended to ordered tab list and participates in overflow calculation.
- Overflow (`More`) option:
  - When tabs cannot fit container width, trailing non-active tabs move into `More` dropdown.
  - Selecting a tab from dropdown makes it active.
  - On selection from dropdown, `More` trigger label becomes selected tab name.
  - If user later selects a visible in-viewport tab, trigger label returns to `More`.
  - Overflow trigger remains last item in tab row.
- Secondary tabs:
  - Should be default variant.
  - Left-aligned.
  - Can be revealed via responsive overflow behavior (and optional drag/swipe patterns where host supports it).
- Data handling:
  - Tab switches must not auto-save data; explicit save action is required.
## Composition & API (runtime)
- **Hierarchy**
  - `Tab`
    - `Tab Item`
      - `Tab Item Content`

| Slot/Prop | Required | Behavior |
|---|---|---|
| `items` | Yes | Ordered tab items. Each item: `{ id, label, content, iconSlug?, badgeCount?, hasAlert?, closable?, disabled? }`. |
| `type` | No | `"secondary"` (default) or `"primary"` tab style. |
| `variant` | No | Backward-compatible alias of `type`; if both are provided, `type` wins. |
| `activeItemId` | Yes (controlled) | Active tab id. |
| `defaultActiveItemId` | No | Initial tab id for uncontrolled mode. |
| `onActiveItemChange(id)` | Yes | Fired on click/keyboard/overflow selection. |
| `onTabSelect(payload)` | No | Emitted when user selects a tab. Payload: `{ id: string, label: string }` and must include selected tab name (`label`). |
| `allowAddTab` | No | Enables dynamic add-tab entry. |
| `onAddTab()` | No | Called when add-tab action is triggered. |
| `addTabLabel` | No | User-defined label text for add-tab action (default `"Add Tab"`). |
| `overflow` | No | Enables responsive overflow-to-`More`; default `true`. |
| `moreLabel` | No | Localized fallback label (default `"More"`). |
| `onOverflowSelection(id)` | No | Fired when item selected from overflow list. |
| `onItemsChange(items)` | No | Optional callback when runtime adds/removes/reorders tabs. |

Runtime rules:
- At least two tabs are recommended in usage.
- First tab should hold the most important content.
- Labels should be title case and ideally 1-3 words.
- Avoid truncating labels where possible; if truncation is unavoidable, use deterministic clipping behavior.
- Tabs are not page navigation and not progress indicators.
- For vertical organization, use accordion instead of tabs.
## Codegen Contract (Framework-Agnostic Blueprint)
### Deterministic structure
1. `TabRoot`
2. `TabList` (`role=tablist`)
3. `TabItem[]` (visible items)
4. optional `OverflowTrigger` (last item)
5. optional `OverflowMenu` (hidden items)
6. optional `AddTabTrigger`
7. `TabPanels`
8. `ActiveTabPanel`

### Variant matrix
- `type`: `primary | secondary` (`variant` accepted as compatibility alias)
- `hostBackground`: `transparent | white`
- `overflow`: `true | false`
- `addTab`: `true | false`
- item decorations: `none | icon | badge | icon+badge | alert`
- focus and pointer states per state table

### Per-slot style contract
- `TabItem`: `38px` height, `9px 24px` padding, `8px` internal gap.
- `TabLabel`: Body 2 tokenized typography.
- `SelectedIndicator`: `2px`, placement depends on variant (`primary=top`, `secondary=bottom` in validated IDS examples).
- `FocusRing`: `2px` brand border, tokenized.
- `OverflowTrigger`: same sizing and tab affordance as peer tab items.
- `AddTabTrigger`: visual parity with tab row controls.

### Behavior contract
- Exactly one tab item is active.
- Active tab always has one visible panel.
- Selecting a tab must emit `onTabSelect({ id, label })` with selected tab name in `label`.
- Overflow algorithm keeps visible tab slots stable and keeps hidden tabs inside overflow collection.
- Selecting hidden item from overflow:
  1. activates selected hidden item,
  2. updates overflow trigger label to selected tab label,
  3. does **not** replace visible tabs in the viewport row.
- Selecting any visible tab after overflow selection resets overflow trigger label to `More`.
- Add-tab creates deterministic default item payload and appends to list.
- Add-tab label is runtime input (`addTabLabel`) and must not be hardcoded in component implementations.

### Accessibility contract
- `TabList` uses `role="tablist"`.
- Each `TabItem` uses `role="tab"`, `aria-selected`, `aria-controls`, stable `id`.
- Each panel uses `role="tabpanel"` and `aria-labelledby`.
- Overflow trigger uses button semantics and `aria-expanded`.
- Overflow menu uses consistent menu/listbox semantics per framework primitive.
- Focus order includes visible tabs, overflow trigger, overflow menu items, add-tab trigger.

### Asset resolution + bundling contract
- Optional `iconSlug` resolves to `/assets/icons/<iconSlug>.svg`.
- Alert indicators can be rendered as:
  - appended alert icon slug from `/assets/icons/<slug>.svg`, and/or
  - badge count tokenized with alert colors.
- Unknown icon slug fallback: hide icon slot and keep text label/badge.

### Fallback/error rules
- Unknown `type` (or `variant`) falls back to `secondary`.
- Missing `activeItemId` falls back to first non-disabled item.
- Invalid `activeItemId` falls back to first non-disabled item.
- Empty `items` input must produce deterministic placeholder tab item and placeholder content.
- If overflow is disabled and row cannot fit, horizontal scroll is allowed as fallback.

### Validation checklist
- [ ] Primary and secondary variants follow state table and indicator placement.
- [ ] `Tab -> Tab Item -> Tab Item Content` hierarchy is preserved.
- [ ] Overflow selection updates trigger label to selected tab name without replacing visible tabs.
- [ ] Selecting visible tab after overflow selection restores trigger label to `More`.
- [ ] Add-tab dynamically appends one tab item and associated content.
- [ ] Keyboard and ARIA behavior conforms to tabs pattern.
- [ ] Labels and content follow usage rules (title case labels, related content, no autosave on tab switch).
- [ ] Light and dark snapshots remain token-driven with no hardcoded visual values.
## Source Mapping
- **Component map entry:** `data/component-figma-map.json` -> `Tab`.
- **Validated Figma node:** `30681:9530` (IDS Design Library, text and annotation board for primary/secondary, overflow, add-tab, and state examples).
- **Figma MCP evidence:** `get_design_context(fileKey=0bHk3XhrjFhowgFkz9yLr4,nodeId=30681:9530)`, `get_variable_defs(fileKey=0bHk3XhrjFhowgFkz9yLr4,nodeId=30681:9530)`.
