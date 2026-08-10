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
- Tab item padding: `9px 24px` (default); `9px var(--padding-padding-20) 9px 24px` when a close control is present (`hasClose`).
- Internal content gap: `8px` between icon/label/badge.
- Content-to-close gap: `var(--spacing-space-20)` between the tab content and the close control.
- Bottom indicator thickness for selected tabs: `2px`.
- Primary selected indicator placement:
  - transparent host: top border.
  - white host: top border.
- Secondary selected indicator placement:
  - transparent host: bottom border.
  - white host: bottom border.
- Dividers/baseline use `1px` borders (`var(--border-width-border-1)` + `var(--color-border-accessible)`).
- Primary tab side divider height: `24px` (unselected), `36px` with `2px` top padding for selected state (total `38px`).
- Primary tab right divider height: `24px` (unselected), `36px` with `2px` top padding for selected state (total `38px`).
- **Row baseline / selected bottom-border contract (mandatory for codegen):**
  - Unselected tab items, overflow trigger (idle), and add-tab control draw the accessible baseline via their own `border-bottom`.
  - Remaining width after the last tab/control continues the baseline with a flex filler on the tab list (e.g. `TabList::after`), not via the panel.
  - **Selected** tab item (and selected overflow trigger) must use `border-bottom: none` — never `border-bottom-color: transparent` alone, and never an overlapping panel `border-top` underlay.
  - This applies for **both** `surface` / host values (`elevated` / opaque host and `transparent`) and for **both** light and dark themes. Transparent selected fills must not reveal any baseline under the active tab.
  - **Forbidden:** `ActiveTabPanel` (or equivalent) `border-top` + negative `margin-top` used to fake a continuous baseline. That underlay shows through transparent selected tabs (especially dark + Primary + `surface=transparent`).
  - Primary selected: accessible bottom border removed; only the top `2px` brand indicator remains.
  - Secondary selected: accessible bottom border removed; the `2px` brand **bottom indicator** replaces it (not the accessible baseline token).
- Tab / overflow / add controls use `box-sizing: border-box` so the `38px` height includes the baseline border.
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
| Primary | Selected | host-dependent (`transparent` or `var(--color-background-surface-2)`) | side divider `var(--color-border-accessible)` + top indicator `2px var(--color-border-brand-dark)`; **no accessible bottom baseline** (`border-bottom: none`) | `var(--color-text-brand-strong)` |
| Primary | Unselected Default | host-dependent | baseline/divider `var(--color-border-accessible)` | `var(--color-text-neutral)` |
| Primary | Unselected Hover | `var(--color-background-brand-lighter)` | baseline/divider `var(--color-border-accessible)` | `var(--color-text-neutral-strong)` |
| Primary | Unselected Press | `var(--color-background-brand-light)` | baseline/divider `var(--color-border-accessible)` | `var(--color-text-brand-strong)` |
| Primary | Focus-visible (selected/unselected) | inherits current visual background | `2px var(--color-border-brand-base)` focus ring + state indicator/borders | inherits selected/unselected text color |
| Secondary | Selected | host-dependent (`transparent` or `var(--color-background-surface-2)`) | bottom indicator `2px var(--color-border-brand-dark)`; **no accessible bottom baseline** (`border-bottom: none`) | `var(--color-text-brand-strong)` |
| Secondary | Unselected Default | host-dependent | baseline/divider `var(--color-border-accessible)` | `var(--color-text-neutral)` |
| Secondary | Unselected Hover | `var(--color-background-brand-lighter)` | baseline/divider `var(--color-border-accessible)` | `var(--color-text-neutral-strong)` |
| Secondary | Unselected Press | `var(--color-background-brand-light)` | baseline/divider `var(--color-border-accessible)` | `var(--color-text-brand-strong)` |
| Secondary | Focus-visible (selected/unselected) | inherits current visual background | `2px var(--color-border-brand-base)` focus ring + state indicator/borders | inherits selected/unselected text color |
## States (Dark Theme)
Dark theme uses the same semantic tokens as **States (Light Theme)**. Resolved values for `[data-theme="dark"]` / `.ids-theme-dark` (and program overlays) live in theme CSS:
- `components/ids-theme.css`

Do **not** duplicate the light matrix. Selected-tab baseline rules are identical in dark mode: with Primary + `surface=transparent`, the accessible bottom line must not appear under the selected tab (no panel `border-top` bleed-through).
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
| `surface` | No | `"elevated"` (default; opaque `var(--color-background-surface-2)` fills) or `"transparent"` (idle/selected fills clear). Maps to Figma `transparent` axis / codegen `hostBackground`. |
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
- `surface` / `hostBackground`: `elevated` (opaque / Figma `transparent=false`) | `transparent` (Figma `transparent=true`). Treat `white` as legacy alias of `elevated`.
- `overflow`: `true | false`
- `addTab`: `true | false`
- item decorations: `none | icon | badge | icon+badge | alert`
- focus and pointer states per state table
- Valid combinations must include **Primary × transparent × selected** and **Primary × elevated × selected** in dark and light — both omit the accessible bottom baseline under the selected tab.

### Per-slot style contract
- `TabItem`: `38px` height (`box-sizing: border-box`), `9px 24px` padding (`padding-right: var(--padding-padding-20)` when a `TabClose` is shown), `8px` internal gap between icon/label/badge, `var(--spacing-space-20)` gap between the tab content and the `TabClose` control.
- `TabItem` unselected: `border-bottom` = `var(--border-width-border-1)` solid `var(--color-border-accessible)`.
- `TabItem` selected: `border-bottom: none` (elevated **and** transparent). Do not rely on opaque fill to hide a baseline drawn elsewhere.
- `TabLabel`: Body 2 tokenized typography.
- `SelectedIndicator`: `2px`, placement depends on variant (`primary=top`, `secondary=bottom` in validated IDS examples).
- `FocusRing`: `2px` brand border, tokenized.
- `TabClose` (IDS tabs only): rendered as an `IdsButton` tertiary icon-only control (`variant="tertiary"`, `size="sm"`, `iconOnly`, `iconSlug="ctrl-close-16"`). The control is `24px` × `24px` (`var(--sizing-size-24)`) with `var(--padding-padding-4)` padding on all sides; the icon is tinted `var(--color-icon-neutral)`. Synapse tabs continue to use the previous `shape-x` 12px icon in a padded span.
- `OverflowTrigger`: same sizing and tab affordance as peer tab items; selected overflow trigger also uses `border-bottom: none`.
- `AddTabTrigger`: visual parity with tab row controls; keeps accessible baseline.
- `TabList` trailing filler: flex-grow pseudo/spacer with the same accessible `border-bottom` to continue the baseline past the last control.
- `ActiveTabPanel`: **no** `border-top` used as the row baseline; panel must not overlap the tab row with a negative-margin top border.

### Behavior contract
- Exactly one tab item is active.
- Active tab always has one visible panel.
- Selected tab must visually interrupt the row baseline (gap under selected / connect to panel) for every `surface` value; transparent selected must not show a continuous accessible line under the active tab.
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
- [ ] Selected tab has `border-bottom: none` (not transparent-only) for Primary and Secondary.
- [ ] `surface=transparent` + selected (light and dark) shows **no** accessible baseline under the selected tab.
- [ ] `surface=elevated` + selected likewise shows no accessible baseline under the selected tab.
- [ ] `ActiveTabPanel` does not use `border-top` + negative margin as a baseline underlay.
- [ ] Tab list trailing filler (or equivalent) continues the baseline only in non-selected remaining width.
## Source Mapping
- **Component map entry:** `data/component-figma-map.json` -> `Tab`.
- **Validated Figma node:** `30681:9530` (IDS Design Library, text and annotation board for primary/secondary, overflow, add-tab, and state examples).
- **Figma MCP evidence:** `get_design_context(fileKey=0bHk3XhrjFhowgFkz9yLr4,nodeId=30681:9530)`, `get_variable_defs(fileKey=0bHk3XhrjFhowgFkz9yLr4,nodeId=30681:9530)`.
## Implementation Notes
- **Caret icon size:** Overflow trigger caret icon (`moreIcon`) is set to `var(--sizing-size-10, 10px)` width and height.
- **Selected baseline (Storybook reference):** `storybook/src/components/Tabs.module.css` — selected / overflow-selected use `border-bottom: none`; panel has no top border underlay; `.list::after` continues the row baseline. Required so Primary + dark + `surface=transparent` does not show a bottom line under the selected tab.
