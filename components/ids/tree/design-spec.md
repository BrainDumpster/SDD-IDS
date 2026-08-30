# Tree Design Spec

## Metadata
- **Storybook path:** `storybook-generated/ids/src/components/Tree.stories.tsx`
- **Deterministic generator:** `generation/deterministic_storybook/ids/tree.py`
- **Component:** Tree
- **Design system:** IDS
- **Category:** Navigation
- **Spec path:** `components/ids/tree/design-spec.md`
- **Description:** Hierarchical tree navigation with expandable branches, optional badges, and single-selection emphasis per row.
- **Version:** 2.2.0
- **Status:** active
- **Created:** 2026-05-20
- **Updated:** 2026-05-20
- **Last verified:** 2026-05-20 (Figma MCP `18571:101904`, `18571:102051`; reference: keyboard + ARIA parity)
- **Storybook examples requested:** yes
- **Generated Storybook:** `storybook/src/components/IdsTree.stories.tsx` (title **`Spec Generated/IDS/Tree`**, primary story **`Spec Accurate Design`**)
- **Implementation reference:** `storybook/src/components/IdsTree.tsx`, `storybook/src/components/IdsTreeItem.tsx`, `storybook/src/components/IdsTree.module.css`
- **Primary Figma URL:** https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=18571-102012&m=dev
- **Primary node id:** `18571:102012` (`Tree-Main` component set)
- **Elements Figma URL:** https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=18571-101903&m=dev
- **Elements node id:** `18571:101903` (`.Tree-Element` component set)
- **Figma file key:** `0bHk3XhrjFhowgFkz9yLr4`
- **Verification method:** Figma MCP (`get_design_context`, `get_metadata`)
- **Verified at:** 2026-05-20

## Anatomy

### Container components (codegen)

| Component | Role | Notes |
| --- | --- | --- |
| **`Tree`** | Root (`role="tree"`) | Owns selection/expand state; emits **`onTreeItemClick`** |
| **`TreeItem`** | One row + optional nested `TreeItem` children | Declarative (Mode B) |
| **`TreeItemLabel`** | Label slot inside `TreeItem` | Maps to `tree-item-label` |

### Row slots (`.Tree-Element` — deterministic order)

1. `TreeRowRoot` (`role="treeitem"`)
2. optional `ExpandChevron` (`chev-down-thick`, 12×12; branch only)
3. optional `NodeIcon` (12×12; omitted when `showIcon=false`)
4. **`LabelCluster`** — groups label + badge
   - `NodeLabel` (`tree-item-label`; single-line ellipsis)
   - optional `CountBadge` — **8px after label** inside cluster (not at row trailing edge)
5. Row end padding (`pr: var(--padding-padding-48)`) — space after cluster, not between label and badge

**`Tree-Main` (Figma samples):** variant axis `treeNodes` (`6` | `12` | `24`) for documentation only; runtime length is data-driven.

## Layout & Measurements
- **Sample row width in Figma:** `260px` (reference only; runtime width is container-driven: `width: 100%`, `box-sizing: border-box`).
- **Row padding:** `py: var(--padding-padding-10)`; `pr: var(--padding-padding-48)`.
- **Horizontal gap** between chevron, icon, and **LabelCluster**: `var(--spacing-space-8)`.
- **LabelCluster:** `display: flex; align-items: center; gap: var(--spacing-space-8); flex: 1; min-width: 0; overflow: hidden`.
- **Label + badge:** badge sits **immediately after** label text (8px gap inside cluster); **do not** use `margin-left: auto` on badge.
- **Optional slots:** omit `NodeIcon` when `showIcon === false`; omit `CountBadge` when `badgeCount` is absent or `0`.
- **Indentation by depth** (left padding on `TreeRowRoot`; Figma `levelTree` axis):
  - Level 1: `pl: var(--padding-padding-16)` (16px)
  - Level 2: `pl: 36px`
  - Level 3: `pl: 56px`
  - Level 4: `pl: 76px`
  - Level 5: `pl: 96px`
  - Level 6: `pl: 116px`
  - Level 6 leaf: `pl: 136px`
- **Chevron / folder icon:** `12px × 12px`.
- **Label typography:** Body 2 — `14px / 20px`, Roboto Regular (`font-weight: 400`; Figma `18571:101904` default row).
- **Badge:** height `18px`, horizontal padding `5.5px`, pill radius `var(--corner-radius-radius-round)`.
- **Selected row leading indicator:** `4px` inset box-shadow on the start edge (brand color); do not use a separate rail node in DOM unless required for accessibility contrast testing.
- **Vertical stacking:** rows are contiguous (no extra gap between siblings in Figma reference).

## Tokens
### Typography
- **Node label:** Body 2 — `var(--font-size-body-2)` / `var(--line-height-body-2)` (14/20), regular.
- **Badge label:** `12px` centered (Figma caption scale on badge).

### Colors and surfaces
- **Default row label:** `var(--color-text-gray-neutral)`
- **Selected row label:** `var(--color-text-brand-strong)`
- **Selected row background:** `var(--color-background-brand-lighter-slate)`
- **Selected leading indicator:** `var(--color-border-brand-base)` (4px inset start edge)
- **Badge fill:** `var(--color-background-controls-base)`
- **Badge text:** `var(--color-text-gray-white)`
- **Badge border:** `var(--color-border-gray-white)`
- **Chevron / default folder icon:** neutral icon tokens per theme (Figma default uses neutral folder glyph)

### Spacing and shape
- `var(--spacing-space-8)` — row content gap
- `var(--padding-padding-10)` — row vertical padding
- `var(--padding-padding-16)` — level-1 horizontal padding
- `var(--padding-padding-48)` — row end padding
- `var(--corner-radius-radius-round)` — badge

## States (Light Theme)
| Row type | State | Background | Border / indicator | Text | Icon / chevron |
| --- | --- | --- | --- | --- | --- |
| Branch (`levelTree` 1–6) | default | transparent | none | `var(--color-text-gray-neutral)` | chevron + optional folder |
| Branch | hover | `var(--color-background-gray-lighter)` | none | `var(--color-text-gray-neutral)` | chevron + optional folder |
| Branch | selected | `var(--color-background-brand-lighter-slate)` | 4px inset start `var(--color-border-brand-base)` | `var(--color-text-brand-strong)` | chevron + optional folder |
| Branch | focus-visible | prior row background | `var(--color-border-brand-base)` outline (2px) | prior text token | prior icon token |
| Leaf (`levelTree` *-leaf) | default | transparent | none | `var(--color-text-gray-neutral)` | optional folder; no chevron |
| Leaf | hover | `var(--color-background-gray-lighter)` | none | `var(--color-text-gray-neutral)` | optional folder |
| Leaf | selected | `var(--color-background-brand-lighter-slate)` | 4px inset start `var(--color-border-brand-base)` | `var(--color-text-brand-strong)` | optional folder |
| Leaf | focus-visible | prior row background | `var(--color-border-brand-base)` outline (2px) | prior text token | prior icon token |

## States (Dark Theme)

Dark theme uses the same semantic tokens as **States (Light Theme)**. Resolved values for `[data-theme="dark"]` / `.ids-theme-dark` (and program overlays) live in theme CSS:

- `components/ids-theme.css`
- `components/<program>-theme.css` when a program overlays IDS (for example `components/dap-theme.css`)

Duplicate the full state matrix in this section only when a dark row genuinely uses different `var(--...)` references than the corresponding light row.

*(When Light and Dark tables would list identical `var(--...)` cells, keep the matrix under **States (Light Theme)** only and use this pointer section instead of a second table.)*

## Interactions
- **Expand/collapse:** activating `ExpandChevron` toggles child visibility for branch rows; chevron rotation or direction change is product-defined but must reflect expanded/collapsed state.
- **Selection:** one primary selected row per tree unless product enables multi-select (not in Figma default matrix); selected row uses **selected** token row from state table.
- **Activation:** clicking row label or icon selects the row; chevron click expands without stealing selection when possible (split hit targets).
- **Keyboard (reference implementation):**
  - `ArrowUp` / `ArrowDown` — move roving focus between visible `treeitem` rows
  - `ArrowRight` — expand closed branch, or move focus to next visible row when already expanded
  - `ArrowLeft` — collapse open branch, or move focus to parent row id
  - `Enter` / `Space` — select focused row (`onTreeItemClick`)
  - Root `role="tree"` is focusable (`tabIndex={0}`); focused row uses `tabIndex={0}`, siblings `-1`
- **Badge:** display-only in Figma reference (count `1`); runtime may bind dynamic counts.

### Accessibility
- Container: `role="tree"` on `TreeRoot`.
- Rows: `role="treeitem"`; `aria-expanded` on branches; `aria-level` (1-based depth), `aria-setsize` / `aria-posinset` among visible siblings under the same parent.
- Selected row: `aria-selected="true"`.
- Focus-visible: visible focus ring using `var(--color-border-brand-base)`; do not rely on background color alone.
- Expand control: chevron is a `button` with `aria-label` describing expand/collapse.

### Behavior & guidelines
- Use Tree for hierarchical navigation or selection, not for flat lists (prefer list components).
- Preserve indentation math from **Layout & Measurements** so codegen stays aligned with Figma levels 1–6.
- Truncate long labels with ellipsis; expose full text via `title` tooltip when truncated.
- Do not hardcode `#0076ce` or other literals in implementations — use tokens from **Tokens**.

## Composition & API (runtime)

### Variants (Figma `.Tree-Element`)

- `levelTree`: `1` … `6` (+ `- leaf` variants)
- `state`: `Default` | `Selected`
- `showIcon`: boolean (default `true` in Figma)
- `showBadge`: boolean (default `true` in Figma)

### Hierarchy interface (Mode A)

```ts
interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
  iconShape?: string;   // optional IDS icon slug
  badgeCount?: number;  // optional; omit badge slot when undefined/0
  showIcon?: boolean;   // per-row override
  showBadge?: boolean;  // per-row override
}
```

### Tree root props

| Prop | Type | Notes |
| --- | --- | --- |
| `items` | `TreeNode[]?` | Mode A — iteration / binding |
| (children) | `TreeItem[]` | Mode B — declarative markup only |
| `selectedId` | `string?` | Controlled selection |
| `defaultSelectedId` | `string?` | Initial selection |
| `defaultExpandedIds` | `string[]?` | Initially expanded branch ids |
| `showIcon` | `boolean?` | Tree default (`true`) |
| `showBadge` | `boolean?` | Tree default (`true`) |
| `onTreeItemClick` | `(detail: TreeItemClickDetail) => void` | **Canonical** — root emits on label/icon click |
| `onExpandChange` | `(id, expanded) => void` | Chevron expand/collapse |
| `onSelect` | `(id: string) => void` | **Deprecated** — thin alias; prefer `onTreeItemClick` |

**Mode exclusivity:** if `items` is provided and non-empty, ignore compositional `TreeItem` children; otherwise build hierarchy from nested **`TreeItem`** markup.

### `TreeItemClickDetail` (root event payload)

| Field | Type | Description |
| --- | --- | --- |
| `id` | `string` | Stable item id |
| `label` | `string` | Visible label |
| `depth` | `number` | 0-based depth |
| `parentId` | `string?` | Parent item id |
| `hasChildren` | `boolean` | Branch vs leaf |
| `selected` | `boolean` | Selection after click |
| `path` | `string[]` | Ancestor ids from root → node |

Framework adapters: Angular `@Output() treeItemClick`, React `onTreeItemClick`, Lit `@tree-item-click`.

### Mode B — Declarative markup (no iteration)

```html
<tree onTreeItemClick="handleTreeItemClick($event.detail)">
  <tree-item id="t1" iconShape="folder-closed" badgeCount="1">
    <tree-item-label>Tree1</tree-item-label>
    <tree-item id="t1-1">
      <tree-item-label>Tree 1.1</tree-item-label>
    </tree-item>
  </tree-item>
  <tree-item id="t2">
    <tree-item-label>Tree2</tree-item-label>
  </tree-item>
</tree>
```

- **`Tree`** wraps **`TreeItem`** only (plus tree-level props).
- **`TreeItem`**: optional icon (`iconShape` or child `<icon shape="..."/>`), required **`tree-item-label`**, optional **`badgeCount`**, nested **`tree-item`** for children.
- Nesting depth → indentation table in **Layout & Measurements**; branch vs leaf from nested children.

React reference: `IdsTree` + `IdsTreeItem` + `IdsTreeItemLabel` in `storybook/src/components/`.

### Spec Accurate Design story defaults (codegen parity)

- **Mode A** `items`: six siblings `row-1` … `row-6`, label `"Text"`, `badgeCount: 1`
- `defaultSelectedId: "row-2"`; `showIcon: true`, `showBadge: true`
- Frame: `maxWidth: 320px`, padding `16px`, `var(--color-background-surface-primary)`
- Theme: `components/ids-theme.css` only
- **Figma sample node:** `18571:102051` (`Tree nodes=6`, 260×240)
- Additional stories: **WithHierarchy**, **SelectedBranchRow**, **WithoutBadgeOrIcon**, **DeclarativeMarkup**, **LabelBadgeSpacing**

## Codegen Contract (Framework-Agnostic Blueprint)

### Component types

Emit **`Tree`** (root) + **`TreeItem`** (+ **`TreeItemLabel`** slot). Support **Mode A** (`items[]`) and **Mode B** (nested `TreeItem` markup).

### Deterministic row structure

1. `Tree` / `TreeRoot` (`role="tree"`) — wires **`onTreeItemClick`** on root only
2. Per visible node (depth-first):
   - `TreeRowRoot` (`role="treeitem"`)
   - optional `ExpandChevron` (branch only)
   - optional `NodeIcon`
   - `LabelCluster` → `NodeLabel` + optional `CountBadge` (8px gap, no `margin-left: auto` on badge)

### Variant matrix
- Cross product documented in **Composition → Variants**; invalid `levelTree` + leaf/chevron combinations must follow Figma rules (leaf rows never render chevron).
- `treeNodes` is not a runtime constraint on data length.

### Per-slot style contract
- Indentation: map `depth` 1–6 to padding tokens in **Layout & Measurements**.
- Default vs selected: apply **States (Light Theme)** token columns only.
- Badge: `var(--color-background-controls-base)` + `var(--color-text-gray-white)` when `badgeCount` present and `showBadge` allows.
- **LabelCluster** required for correct label/badge spacing.

### Behavior contract
- See **Interactions**; selection and expand are orthogonal state machines.
- Unknown `levelTree` → clamp depth to 1–6 padding table; unknown `state` → `Default`.

### Accessibility contract
- See **Interactions → Accessibility**; keyboard section is mandatory for interactive trees.

### Asset resolution + bundling contract
- Chevron: `chev-down-thick` via shared Icon primitive (`12×12`).
- Folder: `Folders / folder-closed` or mapped slug `folder-closed` under `assets/icons/`.
- Resolve icon color from row state tokens, not hardcoded hex.

### Fallback/error rules
- Unknown variant combination → branch vs leaf inferred from presence of `children` in data.
- Missing label → codegen validation error at boundary.
- `showBadge` with no count → hide badge slot.
- Missing token → fail validation report; do not substitute hex literals.

### Validation checklist
- [x] Row padding and per-level indentation match Figma (16 / 36 / 56 / 76 / 96 / 116 / 136 px start padding)
- [x] Selected row uses `var(--color-background-brand-lighter-slate)` and 4px inset start indicator
- [x] Default label `var(--color-text-gray-neutral)`; selected label `var(--color-text-brand-strong)`
- [x] Leaf rows omit expand chevron
- [x] Badge 8px after label inside LabelCluster (not row trailing edge)
- [x] Icon and badge slots optional (`showIcon` / `showBadge` / per-row overrides)
- [x] Mode A `TreeNode[]` and Mode B declarative `TreeItem` documented and implemented (React reference)
- [x] Root **`onTreeItemClick`** emits `TreeItemClickDetail`
- [x] No hardcoded color literals in generated styles
- [x] `role="tree"` / `treeitem` / `aria-expanded` / `aria-selected` wired
- [x] Keyboard navigation (roving focus + arrows/Enter/Space) in reference `IdsTree`
- [x] `aria-level`, `aria-setsize`, `aria-posinset` on visible siblings
- [x] **Spec Accurate Design** story: six flat rows, `defaultSelectedId: "row-2"`, `Spec Generated/IDS/Tree`
- [x] Spec Accurate Figma evidence: `18571:102051`

## Source Mapping
| Role | Figma node | URL |
| --- | --- | --- |
| Tree-Main (component set) | `18571:102012` | https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=18571-102012&m=dev |
| Tree-Main variant 6 nodes | `18571:102051` | (child of component set) |
| Tree-Main variant 12 nodes | `18571:102038` | (child of component set) |
| Tree-Main variant 24 nodes | `18571:102013` | (child of component set) |
| Tree-Element (component set) | `18571:101903` | https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=18571-101903&m=dev |
| Tree-Element default L1 | `18571:101904` | |
| Tree-Element selected L1 | `18571:101909` | |

- **Component map:** `data/component-figma-map.json` → `Tree` (Navigation)
- **Intake session:** design-spec intake wizard, confirmed 2026-05-20
- **Evidence (Spec Accurate Design):** Figma MCP on `18571:102051` (Tree-Main `treeNodes=6`), `18571:101904` (default `.Tree-Element` L1), `18571:101909` (selected L1); reference Storybook `IdsTree.stories.tsx` **Spec Accurate Design**
