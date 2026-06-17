# Status Bar (IDS)

Horizontal summary bar for **Severity/Health** counts and **Inventory** category counts. Supports optional pinned total, horizontal overflow with gradient-masked navigation, and composable child primitives for data-driven assembly.

## Metadata

| Property | Value |
|---|---|
| Component | Status Bar |
| Design system | IDS |
| Category | Patterns and Templates |
| Status | active |
| Version | 2.0.2 |
| Created | 2026-06-17 |
| Updated | 2026-06-17 |
| Storybook examples requested | no |
| Component map | `data/component-figma-map.json` → `Status Bar` |

### Figma proof (live verification)

| Property | Value |
|---|---|
| File key | `0bHk3XhrjFhowgFkz9yLr4` |
| Canonical file | https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library |
| Main component set | `15412:10699` (`StatusBar-Main`) |
| Verification method | Figma MCP (`get_metadata`, `get_design_context`, `get_variable_defs`) |
| Last live verification | 2026-06-17 |

## Anatomy

### Component families

| Family | Figma `Type` axis | Runtime `barType` | Purpose |
|---|---|---|---|
| Severity / Health (large) | `Status Bar - Large` | `severity-health-large` | Alert/health summary with 32×32 severity icons |
| Severity / Health (small) | `Status Bar - Small` | `severity-health-small` | Compact health summary with 16×16 severity icons |
| Inventory | `Inventory Bar` | `inventory` | Category/resource counts with optional inventory icon stack |

### Composable child components (codegen-facing)

Implement as **separate reusable primitives**; `StatusBar` orchestrates them but consumers may compose directly.

| Child | Role | Required |
|---|---|---|
| `StatusBarRoot` | Landmark container; owns layout mode + responsive overflow policy | yes |
| `StatusBarTotal` | Pinned aggregate cell (value + optional category + label) | no |
| `StatusBarContent` | Bordered scroll viewport wrapping the item strip | yes |
| `StatusBarContentTrack` | Horizontal flex row; `overflow-x: auto`; hides scrollbar | yes |
| `StatusBarItem` | Interactive cell shell (state, dividers, click target) | per item |
| `StatusBarSeverityIcon` | Severity glyph (size follows `barType`) | severity items |
| `StatusBarInventoryIconStack` | 40×40 inventory disc + centered main icon + optional status badge | inventory when `showIcons` |
| `StatusBarInventoryCounter` | Vertical stack: count (value) above category label | inventory items |
| `StatusBarItemValue` | Numeric or string count (severity + total only) | severity items, total |
| `StatusBarItemMeta` | Text stack (severity/total category + label) | severity items, total |
| `StatusBarItemDivider` | Vertical dashed separator element (not border-collapse) | per item edge |
| `StatusBarOverflowLayer` | Absolute overlay above track (`inset: -1px`) | when overflow active |
| `StatusBarOverflowControl` | Left or right chevron button + gradient fade | 0–2 per layer |
| `StatusBarSelectionCorner` | Frame 3466308: CSS triangle (`clip-path`) + `shape-check-thick` icon; absolute top-right on selected items | when `selected` |

### Deterministic render order (`StatusBar` convenience API)

```
StatusBarRoot
├── [optional] StatusBarTotal
│   ├── StatusBarItemDivider (left)
│   ├── StatusBarItemValue
│   ├── StatusBarItemMeta
│   └── StatusBarItemDivider (right)
└── StatusBarContent
    ├── StatusBarContentTrack
    │   └── StatusBarItem × N
    │       ├── StatusBarItemDivider (left, every item)
    │       ├── [severity] StatusBarSeverityIcon → StatusBarItemValue → StatusBarItemMeta
    │       ├── [inventory+icons] StatusBarInventoryIconStack → StatusBarInventoryCounter
    │       ├── [inventory, no icons] StatusBarInventoryCounter only
    │       ├── [when selected] StatusBarSelectionCorner
    │           ├── corner triangle (CSS clip-path)
    │           └── shape-check-thick icon (16×16)
    └── [when overflow] StatusBarOverflowLayer
        ├── [optional] StatusBarOverflowControl (left)
        └── [optional] StatusBarOverflowControl (right)
```

### Slot content by family

**Severity / Health item** — `StatusBarItemMeta` stacks:
1. `category` — optional secondary line above alert-type label. Figma placeholder text `<Category>` is **not** literal copy; bind the `category` prop (for example `"Alerts"`, `"Jobs"`). Omit or pass empty string to hide the category row.
2. `label` — alert-type name (`"Critical"`, `"Warning"`, …); `var(--color-text-brand-base)`, `var(--font-size-header-6)` (large) or `var(--font-size-body-1)` (small)

**Inventory item** — `StatusBarInventoryCounter` (Figma node name `Counter`) stacks vertically beside the optional icon:
1. `value` — count on top; `var(--color-text-neutral)`, `var(--font-size-header-5)`, `var(--font-line-height-line-height-32)`
2. `label` — category name below (Figma samples: `"Category"`, `"Category 2"`, …); `var(--color-text-brand-base)`, `var(--font-size-body-2)`, `var(--font-line-height-line-height-20)`

Counter uses `display: flex; flex-direction: column; align-items: flex-start; justify-content: center` — **not** the horizontal value + meta layout used by severity items.

**Total cell** — same typography as severity-large items:
- Value: `var(--font-size-header-2)` / `var(--font-line-height-line-height-44)` (same token as item counts)
- Optional `category` + `label` meta stack identical to severity items

## Layout & Measurements

### Root (`StatusBarRoot`)

- `width: 100%`, `box-sizing: border-box`, `display: flex`, `align-items: flex-start`
- Gap between total and content when total present: `var(--spacing-space-24)` (`24px`)
- Runtime width is **container-driven**; Figma sample widths (784px, 1232px, 2077px) are reference-only

### Bar heights (content box)

| `barType` | Total bar height |
|---|---|
| `severity-health-large` | `77px` |
| `severity-health-small` | `57px` |
| `inventory` | `78px` |

### Total cell (`StatusBarTotal`)

- `flex-shrink: 0` — **never scrolls** with the item strip
- Border: `var(--border-width-border-default)` solid `var(--color-border-disabled)`
- Padding: `var(--padding-padding-16)` vertical, `var(--padding-padding-24)` horizontal
- Internal gap (value ↔ meta): `var(--spacing-space-8)`

### Content group (`StatusBarContent`)

- `flex: 1`, `min-width: 0` — enables horizontal shrink + overflow
- Border: `var(--border-width-border-default)` solid `var(--color-border-disabled)`
- Background: `var(--color-background-component)`
- Inventory-only (no total): root **shrink-wraps** to the item strip (`width: fit-content; max-width: 100%`); no trailing empty slot after the last item

### Item padding

| Family | Padding |
|---|---|
| Severity large | `var(--padding-padding-16)` × `var(--padding-padding-24)` |
| Severity small | `12.5px` × `var(--padding-padding-24)` |
| Inventory | `13px` × `var(--padding-padding-24)` |
| Total | same as severity large |

### Internal item layout

- **Severity / total:** horizontal row — icon (if severity) → value → meta; gap `var(--spacing-space-8)`
- **Inventory:** horizontal row — optional `StatusBarInventoryIconStack` → `StatusBarInventoryCounter` (value above label); gap `var(--spacing-space-8)`
- Adjacent items overlap by `var(--spacing-space-minus-1)` (`-1px`) on the inline axis to preserve continuous border/divider continuity (Figma `mr-[-1px]` pattern)
- Value / counter text: `white-space: nowrap`, `overflow: hidden`, `text-overflow: ellipsis`

### Icon geometry

| Slot | Size | Notes |
|---|---|---|
| Severity / alert icon (large) | `32×32` | All Figma alert-type glyphs (`status-critical-square-solid`, `status-warn-tri-solid`, etc.) render at `32×32` in `severity-health-large` |
| Severity icon (small) | `16×16` | `severity-health-small` only |
| Inventory main icon | `16×16` centered in `40×40` disc (`40.356px` width in Figma) |
| Inventory status badge | `16×16`, offset top-right (`right: -4.64px`, `top: -5px` relative to disc) |
| Overflow chevron | `16×16` |

### Typography

All implementation **must** use semantic tokens below — do not hardcode `36px`, `18px`, or other resolved literals in component CSS.

| Slot | Font size token | Line height token | Color |
|---|---|---|---|
| **Total value** | `var(--font-size-header-2)` | `var(--font-line-height-line-height-44)` | `var(--color-text-neutral)` |
| **Item value (severity large)** | `var(--font-size-header-2)` | `var(--font-line-height-line-height-44)` | `var(--color-text-neutral)` |
| **Item value (severity small)** | `var(--font-size-header-5)` | `var(--font-line-height-line-height-32)` | `var(--color-text-neutral)` |
| **Item value (inventory)** | `var(--font-size-header-5)` | `var(--font-line-height-line-height-32)` | `var(--color-text-neutral)` |
| **Alert-type label** (Critical, Warning, …) — large | `var(--font-size-header-6)` | `var(--font-line-height-line-height-25)` | `var(--color-text-brand-base)` |
| **Alert-type label** — small | `var(--font-size-body-1)` | `var(--font-line-height-line-height-24)` | `var(--color-text-brand-base)` |
| **Category line** (severity / total) | `var(--font-size-body-2)` | `var(--font-line-height-line-height-20)` | `var(--color-text-neutral)` |
| **Inventory label** | `var(--font-size-body-2)` | `var(--font-line-height-line-height-20)` | `var(--color-text-brand-base)` |

Resolved light-theme values (reference only; theme CSS is authoritative): header-2 = 36px, header-6 = 18px, header-5 = 24px, body-2 = 14px, body-1 = 16px.

### Dividers (`StatusBarItemDivider`)

- Separate element (not item `border-right` alone): `1px` dashed `var(--color-border-disabled)`
- Height: `56px`, vertically centered (`top: 50%`, `translateY(-50%)`)
- Each track item: **left** divider only (`left: 0`, vertically centered); adjacent items overlap `-1px` so dividers sit between cells (Figma pattern). **No right divider** on track items — avoids a phantom empty card after the last item.
- Total cell: left + right dividers

### Overflow layer

- Width per side: `64px` total (`.StatusBar-Element-OverflowIcon` frame; Figma `18545:12350`)
- Position: `absolute`, `inset: -1px` over `StatusBarContent`
- `z-index` above items so controls sit on top of text/icons
- Each side is a **horizontal flex row** inside the 64px zone (`18544:13494` left, `18544:13495` right):

**Left side (`Beginning` / `Middle`):**
1. Chevron button — `chev-left-thick` (`16×16`), `var(--color-background-component)`, padding `var(--padding-padding-10)` × `var(--padding-padding-16)`, `z-index: 2`
2. **Solid separator** — `border-right: var(--border-width-border-default) solid var(--color-border-disabled)` on the button cell (not on the gradient)
3. Gradient sibling — `flex: 1`, `linear-gradient(to right, var(--color-gradient-overflow-horizontal-inverse-start) 35%, var(--color-gradient-overflow-horizontal-inverse-end) 100%)`, `z-index: 1`

**Right side (`Middle` / `End`):**
1. Gradient sibling — `flex: 1`, `linear-gradient(to left, …)` (same tokens)
2. Chevron button — `chev-right-thick`, same padding/background
3. **Solid separator** — `border-left: var(--border-width-border-default) solid var(--color-border-disabled)` on the button cell

- Chevron cell is **not** full 64px; button + gradient share the side width. Left uses `margin-right: var(--spacing-space-minus-1)` between button and gradient.

### Selection corner (`StatusBarSelectionCorner`, Figma Frame `15405:9969`)

Implement with **DOM elements + CSS** (no bundled corner SVG). Wrapper is `62.287×62.287px`, absolutely positioned on the item:

| Property | Inventory / default | Severity large |
|---|---|---|
| `top` | `-20.8px` | `-20.8px` |
| `right` | `-21.33px` | `-23.02px` |
| `z-index` | above item content (`4`) | same |

**Child 1 — corner triangle** (fills brand fold):

- Element: empty `span` (or host equivalent)
- `position: absolute; inset: 0`
- `background: var(--color-background-brand-base)`
- `clip-path: polygon(66.76% 33.38%, 66.76% 100%, 0% 33.38%)` — matches Figma polygon in the 62.287 viewBox

**Child 2 — check icon**:

- Slug: `shape-check-thick` (`assets/icons/shape-check-thick.svg`)
- Size: `16×16`
- Position: `left: 21px; top: 25px` within the wrapper
- Color: `var(--color-icon-inverse)`

### Responsive / overflow policy

Overflow navigation is **content-driven**, not gated on total presence.

| Condition | Behavior |
|---|---|
| `scrollWidth <= clientWidth` | No overflow layer |
| Scroll at start (`scrollLeft ≈ 0`) | **Beginning** — right control only |
| Scroll in middle | **Middle** — left + right controls |
| Scroll at end | **End** — left control only |
| Total present | Total stays pinned; only `StatusBarContentTrack` scrolls |
| No total (inventory or severity) | Entire item strip scrolls inside `StatusBarContent` |
| Resize / item count change | Recompute overflow on `resize` and after layout |

Default scroll step: `200px` smooth scroll per chevron click (implementation default; override via `scrollStepPx`).

## Tokens

### Surfaces and borders

- `var(--color-background-component)`
- `var(--color-background-component-light)`
- `var(--color-border-disabled)`
- `var(--color-border-accessible)`
- `var(--color-border-brand-neutral)` — hover, press, selected item borders

### Text

- `var(--color-text-neutral)`
- `var(--color-text-neutral-strong)`
- `var(--color-text-brand-base)`
- `var(--color-text-disabled)`

### Typography (from Figma `Font Size/*` / `Font Line Height/*` bindings)

- `var(--font-size-header-2)` — count values (total + severity-large items)
- `var(--font-size-header-5)` — severity-small and inventory counts
- `var(--font-size-header-6)` — alert-type labels on large bar (Critical, Warning, …)
- `var(--font-size-body-1)` — alert-type labels on small bar
- `var(--font-size-body-2)` — category line + inventory labels
- `var(--font-line-height-line-height-44)`, `var(--font-line-height-line-height-32)`, `var(--font-line-height-line-height-25)`, `var(--font-line-height-line-height-24)`, `var(--font-line-height-line-height-20)`

Defined in `components/ids-theme.css` (light + dark blocks).

### Icons

- `var(--color-icon-brand-base)`
- `var(--color-icon-neutral)`
- `var(--color-icon-alerting-critical)`
- `var(--color-icon-alerting-minor)`
- `var(--color-icon-alerting-success)`
- `var(--color-icon-inverse)`

### Interaction fills

- `var(--color-background-brand-lighter)` — hover
- `var(--color-background-brand-light)` — press, selected
- `var(--color-background-brand-base)` — selection corner triangle fill (Frame 3466308)

### Overflow

- `var(--color-gradient-overflow-horizontal-inverse-start)`
- `var(--color-gradient-overflow-horizontal-inverse-end)`

### Spacing / borders (from Figma bindings on `15412:10700`)

- `var(--spacing-space-8)`, `var(--spacing-space-24)`, `var(--spacing-space-minus-1)`
- `var(--padding-padding-none)`, `var(--padding-padding-10)`, `var(--padding-padding-16)`, `var(--padding-padding-24)`
- `var(--border-width-border-default)`

## States (Light Theme)

| Slot | State | Background | Border | Text/Icon |
|---|---|---|---|---|
| `StatusBarItem` | default | `var(--color-background-component)` | transparent item border; dashed divider between cells | value `var(--color-text-neutral)`; severity category `var(--color-text-neutral)`; label `var(--color-text-brand-base)`; icons per severity map |
| `StatusBarItem` | hover | `var(--color-background-brand-lighter)` | `var(--color-border-brand-neutral)` solid + dashed divider | text/icon tokens unchanged |
| `StatusBarItem` | press | `var(--color-background-brand-light)` | `var(--color-border-brand-neutral)` solid + dashed divider | text/icon tokens unchanged |
| `StatusBarItem` | selected | `var(--color-background-brand-lighter)` | `var(--color-border-brand-neutral)` solid + dashed divider | label `var(--color-text-neutral-strong)`; Frame 3466308 corner + `shape-check-thick` 16×16 (`15405:9969`) |
| `StatusBarItem` | disabled | `var(--color-background-component)` | transparent item border; dashed divider | **value** `var(--color-text-disabled)`; **category / label / inventory label** `var(--color-text-neutral)`; severity/inventory icons retain default color (Figma `15405:11115`) |
| `StatusBarOverflowControl` | default | `var(--color-background-component)` | side border `var(--color-border-disabled)` | `var(--color-icon-brand-base)` |
| `StatusBarOverflowControl` | hover | `var(--color-background-brand-lighter)` | same | `var(--color-icon-brand-base)` |
| `StatusBarOverflowControl` | disabled | `var(--color-background-component-light)` | same | `var(--color-text-disabled)` |

Forced `data-state` attributes are **demo/testing only**; runtime must remain interactive unless `disabled`.

## States (Dark Theme)

Dark theme uses the same semantic tokens as **States (Light Theme)**. Resolved values for `[data-theme="dark"]` / `.ids-theme-dark` (and program overlays) live in theme CSS:

- `components/ids-theme.css`
- `components/<program>-theme.css` when a program overlays IDS (for example `components/dap-theme.css`)

Duplicate the full state matrix in this section only when a dark row genuinely uses different `var(--...)` references than the corresponding light row.

*(When Light and Dark tables would list identical `var(--...)` cells, keep the matrix under **States (Light Theme)** only and use this pointer section instead of a second table.)*

## Interactions

### Item interaction

- States: `default | hover | press | selected | disabled`
- Triggers: pointer hover, primary click (press via `:active`), keyboard when item is focusable
- `disabled` items: no pointer events, no selection

### Selection (input / output)

Items may be selectable in two modes (Figma selected chrome: `15405:10991` severity, `15405:9692` inventory element set):

| `selectionMode` | Behavior | Analogy |
|---|---|---|
| `none` (default) | No selection state; items are display-only unless consumer uses forced `state` | — |
| `single` | At most one selected id; clicking another item replaces selection; re-clicking the selected item keeps it selected | Radio group |
| `multiple` | Toggle membership per click; zero or more items may be selected | Checkbox group |

**Input props**

| Prop | Type | Default | Notes |
|---|---|---|---|
| `selectionMode` | `none` \| `single` \| `multiple` | `none` | Enables selection affordances when not `none` |
| `selectedItemIds` | `string[]` | — | Controlled selected ids |
| `defaultSelectedItemIds` | `string[]` | `[]` | Uncontrolled initial selection |

**Output**

`onSelectionChange(detail)` where `detail` is:

```typescript
interface StatusBarSelectionChangeDetail {
  selectedIds: string[];
  selectedItems: StatusBarItemData[]; // ordered to match `items`
  changedItem: StatusBarItemData;
  selected: boolean; // whether changedItem is selected after the click
}
```

Legacy `onItemSelect(item)` still fires on activate but does not convey the full selection set — prefer `onSelectionChange`.

**Selected visual** (both families): `var(--color-background-brand-lighter)` + `var(--color-border-brand-neutral)` border + **Frame 3466308** (Figma `15405:9969`): `StatusBarSelectionCorner` wrapper `62.287×62.287px` at `top: -20.8px`, `right: -21.33px` (inventory) or `right: -23.02px` (severity large); CSS triangle (`clip-path` + `var(--color-background-brand-base)`) + `shape-check-thick` `16×16` at `left: 21px; top: 25px` with `var(--color-icon-inverse)`; label uses `var(--color-text-neutral-strong)`.

Forced per-item `state` (Storybook QA) overrides runtime selection visuals for that item only.

### Overflow controls

- Type: `button`
- Triggers: click, `Enter`, `Space`
- `onScrollLeft` / `onScrollRight` callbacks fire after scroll; parent may also listen to track `scroll`
- Demo override: `overflowScenario: 'auto' | 'beginning' | 'middle' | 'end'` forces control visibility for visual QA

### Responsive listeners

- Attach `scroll` on `StatusBarContentTrack` and `resize` on window/container to update overflow scenario
- Re-run overflow detection when `items`, `total`, or `barType` change

### Accessibility

- `StatusBarRoot`: `<section>` (or host equivalent) with `aria-label` (default `"Status bar"`, overridable)
- Items: use `<article>` or `role="listitem"` inside `role="list"` when the bar is a selectable summary list
- Overflow buttons: `aria-label` `"Scroll status bar left"` / `"Scroll status bar right"`
- Disabled items: `aria-disabled="true"`, removed from tab order

### Behavior & guidelines

- Prefer **data-driven** `items[]` assembly for dashboards; use slot/children composition only when custom cell chrome is required
- Keep total optional — use for aggregate + scroll affordance on dense severity dashboards
- Inventory `showIcons: false` removes icon stack but keeps value + label layout
- Do not nest another horizontal scroll container inside the track

## Composition & API (runtime)

### Variants

| Axis | Values | Default |
|---|---|---|
| `barType` | `severity-health-large` \| `severity-health-small` \| `inventory` | `severity-health-large` |
| `showIcons` | `true` \| `false` (inventory only) | `true` |
| `total` | `undefined` \| `StatusBarTotalData` | `undefined` |
| Item `state` | `default` \| `hover` \| `press` \| `selected` \| `disabled` | `default` |
| `overflowScenario` | `auto` \| `beginning` \| `middle` \| `end` | `auto` |
| `selectionMode` | `none` \| `single` \| `multiple` | `none` |
| `selectedItemIds` | `string[]` | — (controlled) |
| `defaultSelectedItemIds` | `string[]` | `[]` |

Legacy alias: `type: "status-large" | "status-small" | "inventory"` maps to `barType` (`status-large` → `severity-health-large`, etc.).

### Framework-agnostic data contracts

Use these interfaces for programmatic composition (TypeScript shown; translate to target language).

```typescript
/** Severity / health alert taxonomy (Figma Alert type axis). */
type StatusBarSeverity =
  | "critical"
  | "warning"
  | "success"
  | "informational"
  | "in-progress"
  | "scheduled"
  | "canceling"
  | "canceled"
  | "skipped"
  | "unknown";

type StatusBarItemState = "default" | "hover" | "press" | "selected" | "disabled";

type StatusBarSelectionMode = "none" | "single" | "multiple";

interface StatusBarSelectionChangeDetail {
  selectedIds: string[];
  selectedItems: StatusBarItemData[];
  changedItem: StatusBarItemData;
  selected: boolean;
}

/** Optional pinned aggregate cell. */
interface StatusBarTotalData {
  value: number | string;
  label?: string;           // default "Total"
  category?: string;        // e.g. "Alerts"
}

/** Base item — shared by all families. */
interface StatusBarItemBase {
  id: string;
  value: number | string;
  label: string;
  state?: StatusBarItemState;
  selected?: boolean;
  disabled?: boolean;
  href?: string;            // when item acts as link
  onSelect?: (id: string) => void;
}

/** Severity / health strip item. */
interface StatusBarSeverityItemData extends StatusBarItemBase {
  kind: "severity";
  severity: StatusBarSeverity;
  category?: string;        // optional; Figma "<Category>" is a placeholder — supply real copy (e.g. "Alerts")
}

/** Inventory strip item. */
interface StatusBarInventoryItemData extends StatusBarItemBase {
  kind: "inventory";
  /** Overlay badge on inventory disc; omit for default/complete. */
  status?: "critical" | "warning" | "in-progress" | "default";
  /** Main icon inside disc; default `docs-bundle`. */
  iconShapeName?: string;
}

type StatusBarItemData = StatusBarSeverityItemData | StatusBarInventoryItemData;

/** Convenience orchestrator props. */
interface StatusBarProps {
  barType?: "severity-health-large" | "severity-health-small" | "inventory";
  showIcons?: boolean;
  items: StatusBarItemData[];
  total?: StatusBarTotalData;
  overflowScenario?: "auto" | "beginning" | "middle" | "end";
  scrollStepPx?: number;
  ariaLabel?: string;
  selectionMode?: StatusBarSelectionMode;
  selectedItemIds?: string[];
  defaultSelectedItemIds?: string[];
  onSelectionChange?: (detail: StatusBarSelectionChangeDetail) => void;
  onItemSelect?: (item: StatusBarItemData) => void;
  onOverflowScroll?: (direction: "left" | "right") => void;
}
```

### Composition modes

**Mode A — Data-driven (recommended)**

```typescript
<StatusBar
  barType="severity-health-large"
  total={{ value: 90, category: "Alerts", label: "Total" }}
  items={[
    { kind: "severity", id: "crit", severity: "critical", value: 10, category: "Alerts", label: "Critical" },
    { kind: "severity", id: "warn", severity: "warning", value: 10, category: "Alerts", label: "Warning" },
  ]}
/>
```

**Mode B — Child composition (advanced)**

```tsx
<StatusBarRoot barType="inventory" showIcons>
  <StatusBarContent>
    <StatusBarContentTrack>
      <StatusBarItem state="default">
        <StatusBarInventoryIconStack iconShapeName="docs-bundle" status="warning" />
        <StatusBarInventoryCounter value={10} label="Category" />
      </StatusBarItem>
    </StatusBarContentTrack>
    <StatusBarOverflowLayer scenario="beginning" />
  </StatusBarContent>
</StatusBarRoot>
```

### Severity → icon slug map

| `severity` | Icon slug |
|---|---|
| `critical` | `status-critical-square-solid` |
| `warning` | `status-warn-tri-solid` |
| `success` | `status-ok-circ-solid` |
| `informational` | `status-info-circle-solid` |
| `in-progress` | `state-progress-circle` |
| `scheduled` | `state-standby-clock-solid` |
| `canceling` | `state-cancelled-solid` |
| `canceled` | `state-remove-solid` |
| `skipped` | `skip-to-end` |
| `unknown` | `status-unknown-diamond-solid` |

### Inventory status badge map

| `status` | Badge slug |
|---|---|
| `critical` | `status-critical-square-solid` |
| `warning` | `status-warn-tri-solid` |
| `in-progress` | `state-progress-circle` |
| `default` / omitted | no badge |

### Default labels (when `label` omitted but `severity` provided)

| `severity` | Default label |
|---|---|
| `critical` | Critical |
| `warning` | Warning |
| `success` | Success |
| `informational` | Informational |
| `in-progress` | In Progress |
| `scheduled` | Scheduled |
| `canceling` | Canceling |
| `canceled` | Canceled |
| `skipped` | Skipped |
| `unknown` | Unknown |

## Codegen Contract (Framework-Agnostic Blueprint)

### Deterministic structure

Emit stable PascalCase identifiers matching **Anatomy → Composable child components**. Order is fixed:

1. `StatusBarRoot`
2. `StatusBarTotal` (optional branch)
3. `StatusBarContent`
4. `StatusBarContentTrack`
5. `StatusBarItem` × len(items)
6. `StatusBarOverflowLayer` (optional branch)
7. `StatusBarOverflowControl` × (0 | 1 | 2)

Nested inside each `StatusBarItem` (severity): `StatusBarItemDivider` (left) → `StatusBarSeverityIcon` → `StatusBarItemValue` → `StatusBarItemMeta`.

Nested inside each `StatusBarItem` (inventory): `StatusBarItemDivider` (left) → `[optional] StatusBarInventoryIconStack` → `StatusBarInventoryCounter` (value + label stacked).

When `selected`: append `StatusBarSelectionCorner` → corner triangle (`clip-path`) + `shape-check-thick` icon.

### Variant matrix

| barType | showIcons | total | overflowScenario | Valid |
|---|---|---|---|---|
| severity-health-large | n/a | with / without | none / beginning / middle / end | yes |
| severity-health-small | n/a | with / without | none / beginning / middle / end | yes |
| inventory | true | without (typical) | none / beginning / middle / end | yes |
| inventory | false | without | none / beginning / middle / end | yes |
| inventory | true/false | with | none / beginning / middle / end | yes (extension; total pins same as severity) |
| * | * | * | item state × severity/status grid | yes |

Figma evidence nodes per scenario:

| Scenario | Node |
|---|---|
| Severity + total | `18545:12347` |
| Severity, no total | `18545:12349` |
| Severity overflow beginning | `18545:12351` |
| Severity overflow middle | `18545:12350` |
| Severity overflow end | `18545:12352` |
| Severity item states | `18545:12348` |
| Inventory + icons | `18545:12343` |
| Inventory, no icons | `18545:12344` |
| Inventory overflow beginning | `18545:12341` |
| Inventory overflow middle | `18545:12340` |
| Inventory overflow end | `18545:12342` |
| Inventory status badges | `18545:12345` |
| Inventory item states | `18545:12346` |

### Per-slot style contract

| Slot | Contract |
|---|---|
| `StatusBarRoot` | flex row; `width: 100%` when total present; `width: fit-content; max-width: 100%` when no total; gap `var(--spacing-space-24)` when total present |
| `StatusBarSelectionCorner` | Wrapper `62.287×62.287px`; `top: -20.8px`; `right: -21.33px` (inventory) or `-23.02px` (severity large); triangle: `clip-path: polygon(66.76% 33.38%, 66.76% 100%, 0% 33.38%)` + `var(--color-background-brand-base)`; check: `shape-check-thick` `16×16` at `left: 21px; top: 25px`, `var(--color-icon-inverse)` |
| `StatusBarTotal` | `flex-shrink: 0`; border + padding per Layout |
| `StatusBarContent` | `flex: 1; min-width: 0; position: relative` |
| `StatusBarContentTrack` | `display: flex; overflow-x: auto; scrollbar-width: none` |
| `StatusBarItem` | background/border/text from States table; no hardcoded hex |
| `StatusBarSeverityIcon` | `32×32` (large) or `16×16` (small); severity glyphs via icon slug map |
| `StatusBarInventoryIconStack` | 40×40 disc; badge 16×16 offset top-right |
| `StatusBarItemValue` | Total + severity-large: `var(--font-size-header-2)` + `var(--font-line-height-line-height-44)`; severity-small: header-5 / line-height-32; `text-overflow: ellipsis` |
| `StatusBarItemMeta` | Category: `var(--font-size-body-2)`; alert-type label (large): `var(--font-size-header-6)`; alert-type label (small): body-1 |
| `StatusBarInventoryCounter` | `flex-direction: column; align-items: flex-start; justify-content: center`; value: header-5 / line-height-32 / neutral; label: body-2 / line-height-20 / brand |
| `StatusBarItemDivider` | 1px dashed `var(--color-border-disabled)`, height 56px, centered |
| `StatusBarOverflowLayer` | absolute `inset: -1px`; above track content |
| `StatusBarOverflowControl` | 64px side width; gradient + chevron tokens |

### Behavior contract

- Overflow layer renders **only** when track content overflows OR `overflowScenario` is forced to a non-`auto` value with implied overflow UI
- Scenario mapping: `beginning` → right only; `middle` → both; `end` → left only; `auto` → derive from `scrollLeft` and `scrollWidth - clientWidth`
- Total cell never scrolls; track scrolls independently
- Item click when `selectionMode !== "none"`: update `selectedItemIds` / invoke `onSelectionChange` with full payload; disabled items ignored
- `selectionMode: "single"` replaces prior selection; `"multiple"` toggles membership
- Item click when `selectionMode === "none"`: invoke legacy `onItemSelect` only if provided
- `showIcons: false` on inventory suppresses `StatusBarInventoryIconStack` branch entirely
- Scroll step default `200px`; smooth behavior preferred

### Accessibility contract

- Root: landmark + configurable `aria-label`
- List semantics when items are selectable (`role="list"` / `role="listitem"`); set `aria-multiselectable="true"` when `selectionMode === "multiple"`
- Selected items: `aria-selected="true"`; unselected selectable items: `aria-selected="false"`
- Overflow controls: native `button`, keyboard activatable, descriptive `aria-label`
- Disabled items: `aria-disabled`, not focusable
- Forced visual states must not block pointer/keyboard interaction unless `disabled`

### Asset resolution + bundling contract

| Asset role | Slug | Bundle rule |
|---|---|---|
| Severity icons | see severity map | Resolve via IDS icon registry / `Icon` component |
| Inventory main icon | `docs-bundle` (default) | Consumer override via `iconShapeName` |
| Inventory disc | `inventory-bar-icon` (Figma composite) | Use IDS inventory disc asset or equivalent CSS background from design system |
| Overflow left | `chev-left-thick` | Shared navigation icon set |
| Overflow right | `chev-right-thick` | Shared navigation icon set |
| Selection corner triangle | CSS `clip-path` polygon | `var(--color-background-brand-base)`; geometry per Layout → Selection corner |
| Selection check | `shape-check-thick` | `16×16` at `left: 21px; top: 25px`; `var(--color-icon-inverse)`; resolve via icon registry |

### Fallback/error rules

| Input | Fallback |
|---|---|
| `items` empty | Render empty track with border; no overflow |
| `items` omitted | Use family-specific sample items (3 severity or 4 inventory) in Storybook only; production callers should pass explicit data |
| Unknown `severity` | Render item without severity icon; use provided `label` |
| Missing inventory `iconShapeName` | `docs-bundle` |
| Missing `label` with known `severity` | Default label from table |
| Unknown `barType` | Coerce to `severity-health-large` |
| `showIcons` on non-inventory | Ignore (no-op) |
| Missing theme tokens | Use CSS var fallbacks from `components/ids-theme.css` |

### Validation checklist

- [x] Total value and severity-large item values both use `var(--font-size-header-2)` (not hardcoded `36px`)
- [x] Alert-type labels (Critical, Warning, …) use `var(--font-size-header-6)` on large bar (not hardcoded `18px`)
- [x] Severity-large alert icons render at `32×32`; small uses `16×16`
- [x] `category` prop drives category line; Figma `<Category>` placeholder is not rendered literally
- [x] Inventory `showIcons: true` shows disc + badge; `false` shows counter only
- [x] Inventory count stacks **above** label in `StatusBarInventoryCounter` (Figma `Counter`); not horizontal like severity
- [x] Total cell shows left + right dashed dividers; every track item shows left divider only (no trailing empty slot)
- [x] Root shrink-wraps (`fit-content`) when no total; `width: 100%` when total present
- [x] Overflow appears for both severity (with total) and inventory (without total) when content overflows
- [x] Overflow scenarios match Figma: beginning → right only; middle → both; end → left only
- [x] Chevrons use `chev-left-thick` / `chev-right-thick`; gradient uses inverse horizontal overflow tokens
- [x] Item states: default/disabled → `var(--color-background-component)`; hover/selected → `brand-lighter`; press → `brand-light`; interactive borders → `var(--color-border-brand-neutral)`
- [x] Disabled: value `text-disabled`; category/label `text-neutral`; icons retain default color
- [x] Selected items render `StatusBarSelectionCorner` (CSS triangle + `shape-check-thick`) + `aria-selected="true"`
- [x] `selectionMode: "single"` keeps at most one selected id; `"multiple"` toggles membership; `aria-multiselectable` when multiple
- [x] `onSelectionChange` returns `selectedIds`, `selectedItems`, `changedItem`, and `selected`
- [x] Child primitives are independently importable for custom composition
- [x] Light and dark themes resolve via semantic tokens only (`components/ids-theme.css`)

## Source Mapping

| Role | Node ID | URL |
|---|---|---|
| Main component set | `15412:10699` | https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=15412-10699 |
| Elements — severity large | `15405:10610` | https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=15405-10610 |
| Elements — severity small | `15412:9261` | https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=15412-9261 |
| Elements — inventory category | `15405:9692` | https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=15405-9692 |
| Elements — severity selected | `15405:10991` | https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=15405-10991 |
| Elements — severity disabled | `15405:11115` | https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=15405-11115 |
| Elements — inventory selected | `15405:9923` | https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=15405-9923 |
| Selection frame (check + corner) | `15405:9969` | https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=15405-9969 |
| Overflow icon (left/right) | `18544:13477`, `18544:13502` | https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=18544-13477 |
| Severity — with total | `18545:12347` | https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=18545-12347 |
| Severity — no total | `18545:12349` | https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=18545-12349 |
| Severity — overflow beginning / middle / end | `18545:12351` / `18545:12350` / `18545:12352` | see user scenario links |
| Severity — item states | `18545:12348` | https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=18545-12348 |
| Inventory — with icons | `18545:12343` | https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=18545-12343 |
| Inventory — no icons | `18545:12344` | https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=18545-12344 |
| Inventory — overflow beginning / middle / end | `18545:12341` / `18545:12340` / `18545:12342` | see user scenario links |
| Inventory — status badges | `18545:12345` | https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=18545-12345 |
| Inventory — item states | `18545:12346` | https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=18545-12346 |

- Component map: `data/component-figma-map.json` → `Status Bar`
- Contract reference: `storybook/src/spec-contracts/ids-status-bar.contract.ts`
- Theme import: `components/ids-theme.css` (`[data-design-system="ids"]`)
- Verification: Figma MCP `get_metadata`, `get_design_context`, `get_variable_defs` — 2026-06-17
