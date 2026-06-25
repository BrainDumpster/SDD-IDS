# Topology Node Tooltip Design Spec

## Metadata

| Property | Value |
|---|---|
| Component | Topology Node Tooltip (`_node-tooltip`) |
| Design system | Synapse |
| Category | Components |
| Spec pattern | **standalone** |
| Status | **active** |
| Version | 1.0.0 |
| Created | 2026-06-23 |
| Updated | 2026-06-23 |
| Description | Canvas hover / info card — status icon, title, two-column key-value rows. **Not** the generic Synapse `Tooltip` (`48625:111469`). |
| Figma file | `Td1bnsvRj1PCGs9RVJkIvJ` |
| Figma node | `55439:46060` (`_node-tooltip`) |
| Theme CSS | `components/synapse-theme.css` |
| Verification method | Figma MCP |
| Last verified | 2026-06-23 |

### Live verification evidence

| Check | Node(s) | Method |
|---|---|---|
| Tooltip frame | `55439:46060` | `get_design_context` + `get_metadata` |
| Header row | `54196:37660` | `get_design_context` |
| KV body | `54196:37714` | `get_design_context` |
| Group info reuse | `54196:37735` | `get_metadata` (same pattern) |

### Parent / consumer composition

| Consumer | Usage |
|---|---|
| [`topology/design-spec.md`](../design-spec.md) | Node hover on canvas (`showNodeTooltip`, placement in `tooltipLayer`) |
| [`node/design-spec.md`](../node/design-spec.md) | Optional `tooltipRows` on `TopologyNodeData` |
| [`group/design-spec.md`](../group/design-spec.md) | Group **info** action opens same chrome (`onGroupInfo`) |

**Not a consumer of:** [`components/synapse/tooltip/design-spec.md`](../../tooltip/design-spec.md) — no trigger arrow, no `Tooltip.tsx` wrapper.

## Anatomy

Deterministic slot order:

1. **`TopologyNodeTooltipRoot`** — card shell (`role="tooltip"`).
2. **`TopologyNodeTooltipHeader`** — status icon + title.
3. **`TopologyNodeTooltipStatusIcon`** (optional) — `16×16` full-color status glyph.
4. **`TopologyNodeTooltipTitle`** — Body 2 medium single line.
5. **`TopologyNodeTooltipBody`** (optional) — two-column key-value grid.
6. **`TopologyNodeTooltipLabelColumn`** / **`TopologyNodeTooltipValueColumn`** — aligned rows.

## Layout & Measurements

| Property | Contract | Figma evidence |
|---|---|---|
| Width | `233px` fixed | `55439:46060` |
| Padding | `var(--spacing-space-16)` | `55439:46060` |
| Column gap (header ↔ body) | `var(--spacing-space-6)` | `55439:46060` |
| Header gap (icon ↔ title) | `var(--spacing-space-8)` | `54196:37660` |
| Status icon | `16×16px` | `54196:37654` |
| Title typography | Body 2 medium — `var(--font-size-body-2)` / `var(--font-line-height-line-height-20)` / weight 500 | `54196:37649` |
| Label cell padding | `py var(--padding-padding-4)` `px var(--padding-padding-12)` | `54196:37716` |
| Value cell padding | `py var(--padding-padding-4)` `pl var(--padding-padding-16)` `pr var(--padding-padding-12)` | `54196:37723` |
| Row typography | Body 2 regular — `var(--font-size-body-2)` / `var(--font-line-height-line-height-20)` | `54196:37717` |
| Text overflow | `ellipsis` single line per cell | Figma sample |

### Placement (parent-owned)

Documented in parent [`topology/design-spec.md`](../design-spec.md); summary:

| Rule | Contract |
|---|---|
| Default | Top-center above node, `8px` gap |
| Fallback order | `bottom` → `right` → `left` when clipped |
| Viewport clamp | `8px` margin inside canvas viewport |
| Show delay | `500ms` (`SYNAPSE_TOPOLOGY_NODE_TOOLTIP_HOVER_DELAY_MS`) |
| Dismiss | Pointer leave, node click, count-badge expand |
| Layer | `z-index: 200`; `pointer-events: none` on card |

### Slot geometry (Figma-verified)

| Slot / layer | Property | Token / contract | Figma node | Live evidence |
|---|---|---|---|---|
| Root | border-radius | `var(--corner-radius-radius-8)` | `55439:46060` | `get_design_context` |
| Root | border-width | `var(--border-width-border-default)` | `55439:46060` | `get_design_context` |
| Root | padding | `var(--spacing-space-16)` | `55439:46060` | `get_design_context` |

## Tokens

| Role | Token |
|---|---|
| Surface | `var(--color-background-surface-1)` |
| Border | `var(--border-width-border-default)` `var(--color-border-accessible)` |
| Radius | `var(--corner-radius-radius-8)` |
| Title / labels | `var(--color-text-neutral-strong)` |
| Values | `var(--color-text-neutral)` |
| Status icons | Full-color via `Icon` `variant="img"` |

## States (Light Theme)

| State | Visual |
|---|---|
| `default` | Card per tokens above |
| `empty-body` | Header only when `rows.length === 0` |

## States (Dark Theme)

Dark theme uses the same semantic tokens as **States (Light Theme)**. Resolved values live in `components/synapse-theme.css` `[data-theme="dark"]`.

## Interactions

| Trigger | Behavior |
|---|---|
| Parent shows card | After hover delay; position via `resolveTopologyTooltipPlacement` |
| Parent hides card | On dismiss rules above |
| No internal focus | Card is presentational (`pointer-events: none`) |

### Accessibility

| Element | Requirement |
|---|---|
| Root | `role="tooltip"`; `aria-label={title}` |
| Status icon | `aria-hidden` when title conveys status |
| KV rows | Decorative; parent may expose details in detail panel |

## Composition & API (runtime)

### Variants

| Variant | Condition |
|---|---|
| `with-status` | `statusIconSlug` provided |
| `with-body` | `rows.length > 0` |

### Runtime API — `TopologyNodeTooltip`

| Prop | Type | Required | Description |
|---|---|---|---|
| `title` | `string` | yes | Header title (node label) |
| `statusIconSlug` | `string?` | no | `16×16` status icon |
| `rows` | `TopologyNodeTooltipRow[]` | no | Key-value body rows |
| `className` | `string?` | no | Host positioning wrapper |
| `style` | `CSSProperties?` | no | Absolute position from parent |

```ts
interface TopologyNodeTooltipRow {
  label: string;
  value: string;
}
```

### SDD standalone usage

Use in **Mode B** (third-party graph) or **group info** without full `Topology` canvas:

```tsx
import { TopologyNodeTooltip } from "./TopologyNodeTooltip";

<TopologyNodeTooltip
  title="Compute Cluster"
  statusIconSlug="status-warn-tri-solid-16"
  rows={[
    { label: "Type:", value: "Cluster" },
    { label: "Status:", value: "Warning" },
  ]}
/>
```

Placement and delay remain **host-owned** unless using parent `Topology`.

## Codegen Contract (Framework-Agnostic Blueprint)

### Deterministic structure

Emit anatomy slots in order. No arrow, no close button, no portal — flat card only.

### Variant matrix

`with-status` × `with-body` (four combinations).

### Per-slot style contract

| Element | Contract |
|---|---|
| Root | `233px` width; surface-1; radius-8; accessible border |
| Header | Flex row; icon 16px; title ellipsis |
| Body | Two columns; label strong / value neutral |

### Behavior contract

- Parent controls visibility, position, and delay.
- Card does not trap focus or accept pointer events.

### Accessibility contract

See **Interactions → Accessibility**.

### Asset resolution + bundling contract

Status icons via shared `Icon` + `assets/icons/`. Same slugs as [`node/design-spec.md`](../node/design-spec.md) status table.

### Fallback/error rules

- Missing `title` → validation error.
- Empty `rows` → render header-only.
- Unknown `statusIconSlug` → omit icon slot.

### Validation checklist

- [x] Matches Figma `55439:46060` dimensions and tokens
- [x] Distinct from generic `components/synapse/tooltip/design-spec.md`
- [x] Placement contract documented (parent + `topologyNodeTooltipPlacement.ts`)
- [x] Group info reuse documented
- [x] Slot geometry cites Figma node

## Source Mapping

| Source | Location |
|---|---|
| Parent topology spec | `components/synapse/topology/design-spec.md` |
| Node consumer spec | `components/synapse/topology/node/design-spec.md` |
| Group consumer spec | `components/synapse/topology/group/design-spec.md` |
| Contract | `storybook/src/spec-contracts/topology/synapse-topology-node-tooltip.contract.ts` |
| Placement utils | `storybook/src/components/topology/utils/topologyNodeTooltipPlacement.ts` |
| Implementation | `storybook/src/components/topology/TopologyNodeTooltip.tsx` |
| CSS module | `storybook/src/components/topology/TopologyNodeTooltip.module.css` |
| Figma map | `data/synapse-component-figma-map.json` → `topologyNodeTooltipSpecPath` |
| Verification | Figma MCP — 2026-06-23 |
