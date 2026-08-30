# Topology Group Design Spec

## Metadata

| Property | Value |
|---|---|
| Component | Topology Group |
| Design system | Synapse |
| Category | Components |
| Spec pattern | **standalone** |
| Status | **active** |
| Version | 1.1.0 |
| Created | 2026-06-22 |
| Updated | 2026-06-23 |
| Description | Group container frame + group label for clustered nodes on the topology canvas |
| Figma file | `Td1bnsvRj1PCGs9RVJkIvJ` |
| Theme CSS | `components/synapse-theme.css` |
| Verification method | Figma MCP |
| Last verified | 2026-06-22 |

### Live verification evidence

| Check | Node(s) | Method |
|---|---|---|
| Group frame | `53265:128999` (`_Node_group-frame`) | Figma MCP `get_design_context` |
| Group label set | `54988:41422` (`_topology_group-label`) | Figma MCP `get_metadata` |
| `Show Count=true` | `53265:128979` | Figma MCP `get_design_context` |
| `Show Count=false` | `54988:41421` | Figma MCP `get_design_context` |
| Collapsed `Node Group` chip | `52505:50688` | Figma MCP `get_design_context` on parent node spec |

### Parent composition

Consumed by [`components/synapse/topology/design-spec.md`](../design-spec.md) as **`TopologyGroup`** wrapping one or more [`TopologyNode`](../node/design-spec.md) instances.

Parent owns: group bounds on canvas, expand/collapse of grouped children, connector routing into/out of group, and lazy loading of members.

### SDD standalone usage

Use this spec **without** the parent Topology component when a third-party graph library supports group/container nodes (SDD **Mode B**). Child nodes inside `TopologyGroupContent` must still follow [`node/design-spec.md`](../node/design-spec.md).

## Anatomy

1. **`TopologyGroupRoot`** — positioned container on canvas.
2. **`TopologyGroupChrome`** (optional) — top-trailing icon row (`53283:227105`).
   - **`TopologyGroupInfoAction`** — `info-circ` 16px (`53283:227106`).
   - **`TopologyGroupMinimizeAction`** — `minimize` 12px (`53283:227107`).
3. **`TopologyGroupLabelCluster`** — `_topology_group-label` + optional count badge (`53265:128979`).
   - **`TopologyGroupLabelChip`** — type prefix + name.
   - **`TopologyGroupCountBadge`** (optional) — same contract as node count badge.
4. **`TopologyGroupBorder`** — rounded shell around child nodes (`53265:128986`).
5. **`TopologyGroupContent`** — slot for child **`TopologyNode`** instances (`53265:129225`).

## Layout & Measurements

> **Codegen index:** Each anatomy slot has a dedicated `### Element:` subsection.

### Element: `TopologyGroupRoot`

| Property | Contract | Figma evidence |
|---|---|---|
| Role | Positioned group container on canvas | `53265:128999` |
| Position | Absolute `x`,`y` from parent graph | runtime |
| Size | Derived from child node bounds + border padding | `53265:128999` sample `376px` width |
| Accessibility | `role="group"`; `aria-label` from type + name | |

### Element: `TopologyGroupChrome` (`53283:227105`)

| Property | Contract | Figma evidence |
|---|---|---|
| Role | Top-trailing action icons overlay | `53283:227105` |
| Position | `top: -10px` relative to frame (Figma) | `53265:128999` |
| Gap | `var(--spacing-space-16)` between icons | `53283:227105` |
| Visibility | `showInfo` / `showMinimize` props | |

#### Sub-element: `TopologyGroupInfoAction` (`53283:227106`)

| Property | Contract |
|---|---|
| Icon | `info-circ` `16×16` |
| Component | Icon button; `aria-label="Group information"` |
| Event | `onGroupInfo` |

#### Sub-element: `TopologyGroupMinimizeAction` (`53283:227107`)

| Property | Contract |
|---|---|
| Icon | `minimize` `12×12` |
| Component | Icon button; `aria-label="Collapse group"` |
| Event | `onGroupCollapse` → collapsed `Node Group` chip (`52505:50688`) |

### Element: `TopologyGroupLabelCluster` (`53265:128979` / `54988:41421`)

| Property | Contract | Figma evidence |
|---|---|---|
| Role | Type prefix chip above border | `_topology_group-label` set `54988:41422` |
| Overlap | `margin-bottom: -6px` to `-12px` over border (Figma) | `53265:128979` |
| Variant `showCount=true` | Label + count badge | `53265:128979` |
| Variant `showCount=false` | Label only | `54988:41421` |

#### Sub-element: `TopologyGroupLabelChip`

| Property | Contract |
|---|---|
| Min width | `90px` |
| Padding | `px var(--padding-padding-16)` `py var(--padding-padding-6)` |
| Gap | `var(--spacing-space-8)` icon ↔ text |
| Background | `var(--color-background-surface-2)` |
| Border | `var(--border-width-border-default)` `var(--color-border-accessible)` |
| Radius | `var(--corner-radius-radius-8)` |
| Typography | Body 3 — **bold** `Type:` prefix + regular type name |
| Leading icon | `cluster-badge` `16×16` (optional) |

#### Sub-element: `TopologyGroupCountBadge`

| Property | Contract |
|---|---|
| Contract | **Identical** to [`TopologyNodeCountBadge`](../node/design-spec.md) |
| Tokens | `var(--color-background-alerting-info-2)` fill; minus icon when `expanded` |

### Element: `TopologyGroupBorder` (`53265:128986`)

| Property | Contract | Figma evidence |
|---|---|---|
| Role | Rounded rect framing child nodes | `53265:128986` |
| Padding | `var(--padding-padding-16)` | `53265:128986` |
| Border | `var(--border-width-border-default)` `var(--color-border-accessible)` | `53265:128986` |
| Radius | `var(--corner-radius-radius-20)` | `get_design_context` `53265:128999` |
| Background | transparent (stroke only) | |
| Drag | Moves all child nodes; parent updates edges | |

### Element: `TopologyGroupContent` (`53265:129225`)

| Property | Contract |
|---|---|
| Role | Slot for child `TopologyNode` instances |
| Layout | Host layout engine positions nodes inside border padding |
| Sample gap | `80px` horizontal between nodes in Figma (`53265:129054`) — **reference only** |
| Child spec | **Must** use [`node/design-spec.md`](../node/design-spec.md) |

### `_Node_group-frame` sample (reference)

Figma sample width `376px` × content-driven height — **runtime:** `width/height` from child bounds + padding.

### Slot geometry (Figma-verified)

| Slot / layer | Property | Token / contract | Figma node | Live evidence |
|---|---|---|---|---|
| `Border` (group shell) | border-radius | `var(--corner-radius-radius-20)` | `53265:128986` | `get_design_context` on `53265:128999` |
| `Border` | border-width | `var(--border-width-border-default)` | `53265:128986` | `get_design_context` |
| Group label chip | border-radius | `var(--corner-radius-radius-8)` | `54988:41443` | `get_design_context` on `53265:128979` |

## Tokens

### Element: `TopologyGroupBorder`

| Role | Token |
|---|---|
| Border | `var(--color-border-accessible)` |
| Radius | `var(--corner-radius-radius-20)` |
| Padding | `var(--padding-padding-16)` |

### Element: `TopologyGroupLabelChip`

| Role | Token |
|---|---|
| Background | `var(--color-background-surface-2)` |
| Border | `var(--color-border-accessible)` |
| Text | `var(--color-text-neutral-strong)` |
| Radius | `var(--corner-radius-radius-8)` |

### Element: `TopologyGroupCountBadge`

| Role | Token |
|---|---|
| Same as node count badge | `var(--color-background-alerting-info-2)`, `var(--color-text-white)`, `var(--color-border-white)` |

### Element: `TopologyGroupChrome`

| Role | Token |
|---|---|
| Icons | `var(--color-icon-brand-base)` or neutral per button spec |

## States (Light Theme)

| Part | State | Visual |
|---|---|---|
| Group border | `default` | `1px` `var(--color-border-accessible)` |
| Group label | `default` | surface-2 fill + accessible border |
| Chrome `info` / `minimize` | `default` | neutral icon tokens |
| Count badge | `expanded=false` | numeric count |
| Count badge | `expanded=true` | minus icon (inherit node badge) |

## States (Dark Theme)

Dark theme uses the same semantic tokens as **States (Light Theme)**. Resolved values for `[data-theme="dark"]` live in `components/synapse-theme.css`.

## Interactions

| Trigger | Behavior |
|---|---|
| Click **minimize** chrome icon | Collapse group to `Node Group` chip on canvas (parent state); emit `onGroupCollapse`. |
| Click **info** | Host [`node-tooltip`](../node-tooltip/design-spec.md) (`54196:37735`); emit `onGroupInfo`. |
| Click **group count badge** | Same expand/collapse contract as node count badge; may load children via parent `loadChildren`. |
| Drag group border | Moves all child nodes; parent updates edges. |

### Accessibility

- Group region: `role="group"` with `aria-label` from group type + name.
- Minimize/info: icon buttons with `aria-label`.
- Count badge: same as node badge (`aria-expanded`).

## Composition & API (runtime)

### Variants

| Axis | Values | Default |
|---|---|---|
| `showCount` | boolean | `true` |
| `expanded` | boolean | `false` |
| `showInfo` / `showMinimize` | boolean | `true` |

### Runtime API — `TopologyGroup`

| Prop | Type | Default | Description |
|---|---|---|---|
| `id` | `string` | required | Group id. |
| `typeLabel` | `string` | `"Type name"` | Text after `Type:` prefix. |
| `showCount` | `boolean` | `true` | Figma `Show Count` axis (`53265:128979` vs `54988:41421`). |
| `childCount` | `number?` | — | Group-level badge count. |
| `expanded` | `boolean` | `false` | Badge minus vs count. |
| `showInfo` | `boolean` | `true` | Top chrome info icon. |
| `showMinimize` | `boolean` | `true` | Top chrome minimize. |
| `children` | `TopologyNode[]` | — | Nodes inside border. |

### Events

| Event | When |
|---|---|
| `onGroupCollapse` | Minimize clicked |
| `onGroupExpand` | Badge expand |
| `onGroupInfo` | Info clicked |

## Codegen Contract (Framework-Agnostic Blueprint)

### Deterministic structure

`TopologyGroupLabelCluster` → `TopologyGroupBorder` → `TopologyGroupContent` (nodes). Chrome is sibling overlay (`z-index` above border).

### Variant matrix

`showCount: true | false`; `expanded: true | false`.

### Per-slot style contract

| Element | Contract | Drift guard |
|---|---|---|
| `TopologyGroupRoot` | Bounds from children + padding | Empty group → hide border |
| `TopologyGroupChrome` | `top: -10px`; icons 16px / 12px | Respect `showInfo`/`showMinimize` |
| `TopologyGroupLabelCluster` | `showCount` axis matches Figma variants | Two label Figma nodes required in QA |
| `TopologyGroupLabelChip` | Bold `Type:` + name; radius-8 | |
| `TopologyGroupCountBadge` | Reuse node badge contract | No duplicate CSS |
| `TopologyGroupBorder` | radius-20; accessible border | |
| `TopologyGroupContent` | Child nodes from node spec only | |

### Behavior contract

- Child node positions are relative to group content box unless parent uses absolute graph coords.
- Collapsed group may render as [`TopologyNode`](../node/design-spec.md) `singleGroup=groupH|groupV` without full border frame.

### Accessibility contract

See **Interactions → Accessibility**.

### Asset resolution + bundling contract

`cluster-badge`, `info-circ`, `minimize` via `Icon` primitive.

### Fallback/error rules

- Empty group → hide border; show label only or placeholder per parent policy.
- Unknown `typeLabel` → validation warning, render `Type: —`.

### Validation checklist

- [x] `Show Count=true` matches `53265:128979`
- [x] `Show Count=false` matches `54988:41421`
- [x] Border radius `radius-20` on `53265:128986`
- [x] Chrome icons 16px / 12px at `top: -10px`
- [x] Child nodes use node spec inside content area
- [x] Parent composition link present
- [x] SDD Mode B standalone usage documented

## Source Mapping

| Source | Location |
|---|---|
| Parent spec | `components/synapse/topology/design-spec.md` |
| Child node spec | `components/synapse/topology/node/design-spec.md` |
| Group frame | `53265:128999` |
| Group label set | `54988:41422` |
| Theme CSS | `components/synapse-theme.css` |
| Implementation | `storybook/src/components/topology/TopologyGroup.tsx` |
| Contract | `storybook/src/spec-contracts/topology/synapse-topology-group.contract.ts` |
| Storybook | `storybook/src/components/topology/SynapseTopology.stories.tsx` (story **Node Group**) |
| Verification | Figma MCP — 2026-06-23 |
