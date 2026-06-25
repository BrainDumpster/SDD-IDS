# Topology Node Design Spec

## Metadata

| Property | Value |
|---|---|
| Component | Topology Node |
| Design system | Synapse |
| Category | Components |
| Spec pattern | **standalone** |
| Status | **active** |
| Version | 1.1.0 |
| Created | 2026-06-22 |
| Updated | 2026-06-23 |
| Description | Canvas node chrome — element shell, status, child-count badge, label; consumed by Topology parent |
| Figma file | `Td1bnsvRj1PCGs9RVJkIvJ` (Synapse Hi-Fi components) |
| Theme CSS | `components/synapse-theme.css` |
| Verification method | Figma MCP |
| Last verified | 2026-06-22 |
| Demo reference | [Common Topology WIP](https://craft-level-03601619.figma.site/) |

### Live verification evidence

| Check | Node(s) | Method |
|---|---|---|
| Node component set (`Single/Group` axis) | `53468:227013` | Figma MCP `get_metadata` |
| Spec-accurate variant **`Single/Group=Default`** | `52497:198366` | Figma MCP `get_design_context` + `get_variable_defs` |
| `Single/Group=Group H` | `53468:227012` | Figma MCP `get_design_context` |
| `Single/Group=Group V` | `53468:227037` | Figma MCP `get_design_context` |
| `.Topology Element` type × state matrix | `52497:196934` | Figma MCP `get_metadata` + per-variant `get_design_context` |
| `_node-status` set | `52497:48619` | Figma MCP `get_metadata` + per-status `get_design_context` |
| `_Node-label` | `48308:6128` | Figma MCP `get_design_context` |
| `Count Badge` expand/collapse | `54159:282532` (`54159:282530`, `54159:282543`) | Figma MCP `get_design_context` |

### Parent composition

Consumed by [`components/synapse/topology/design-spec.md`](../topology/design-spec.md) as **`TopologyNode`** inside **`TopologyCanvasLayer`**.

Parent owns: graph coordinates (`x`, `y`), selection in canvas, pan/zoom transform, [edge anchor geometry](../design-spec.md#element-topologyedgelayer) (`topologyNodeEdgeAnchors`), lazy `loadChildren` orchestration, and group membership when node is inside [`group`](../group/design-spec.md).

### SDD standalone usage

Use this spec **without** the parent Topology component when integrating a third-party graph library (SDD **Mode B**). Render `TopologyNode` chrome at library-computed positions; apply edge stroke/arrow rules from the parent § `TopologyEdgeLayer`.

## Anatomy

Deterministic slot order (codegen **must** preserve):

1. **`TopologyNodeRoot`** — positioning wrapper (`position: absolute` in canvas; sample Figma width `44px` for default single node).
2. **`TopologyNodeContainer`** — vertical stack (`isolate` z-ordering per Figma `54221:48949`).
3. **`TopologyNodeMain`** — status + shape/badge cluster + label (`54221:47547`).
4. **`TopologyNodeStatusSlot`** (optional) — `_node-status` overlay, top-trailing on shape (`52497:198356`).
5. **`TopologyNodeElement`** — `.Topology Element` shell + user icon (`52497:198354` → `Object`).
6. **`TopologyNodeCountBadge`** (optional) — child-count / expand control below shape (`54159:283459`).
7. **`TopologyNodeLabel`** — `_Node-label` chip below main cluster (`48308:6128`).
8. **`TopologyNodeGroupStack`** (optional) — collapsed multi-node preview when `singleGroup` is `groupH` or `groupV` (`52505:50688`).

### Embedded library references

| Slot | Reuse spec | Notes |
|---|---|---|
| Count badge chrome | Synapse Badge geometry (18px pill) | Topology uses **`var(--color-background-alerting-info-2)`** fill — not severity `type` axis; see **Count Badge** below |
| Status icons | Shared `Icon` primitive | Slugs from `_node-status` variants |

## Layout & Measurements

> **Codegen index:** Each anatomy slot has a dedicated `### Element:` subsection with layout, tokens, states, and API bindings.

### Sample dimensions (reference only)

Figma variant frames use fixed sizes; **runtime** positions are graph-driven (`x`, `y` in canvas space).

| Variant (`Single/Group`) | Figma frame | Runtime |
|---|---|---|
| `default` | `44×44` shell + label below | `width: fit-content`; label `min-width: 90px` |
| `groupH` | `52×44` with horizontal stack | Overlapping element preview (`mr: -40px` between stacked circles in Figma) |
| `groupV` | `52×44` vertical stack variant | Same overlap model as `groupH` with vertical arrangement |

### Element: `TopologyNodeRoot`

| Property | Contract | Figma evidence |
|---|---|---|
| Role | Absolute canvas positioning wrapper | `52497:198366` |
| Position | `left: x`; `top: y`; `transform: translate(-50%, 0)` | runtime graph coords |
| Width | `fit-content` | |
| Cursor | `grab` when draggable; `grabbing` when selected drag | |
| Implementation | `TopologyNode.module.css` → `.root` | |
| Accessibility | `role="group"`; `aria-label={label}` | |

### Element: `TopologyNodeContainer` / `TopologyNodeMain`

| Property | Contract |
|---|---|
| Role | Vertical stack: status + shape/badge + label |
| Layout | `flex-direction: column`; `align-items: center` |
| **`TopologyNodeMain`** | **`position: relative`** — required so `TopologyNodeStatusSlot` absolute offsets resolve against shape cluster |
| Z-order | Status above shape; badge overlaps shape bottom (`margin-top: -8px`) |
| Implementation | `TopologyNode.module.css` → `.container`, `.main` |

### Element: `TopologyNodeElement` — `.Topology Element` shell

> **Full shape/state contract:** [`components/synapse/topology/element/design-spec.md`](../element/design-spec.md)  
> Implementation: `TopologyElementShell.tsx` (consumed by `TopologyNode`).

| `elementType` | Container shape | Shell size | Border radius token | Figma default node |
|---|---|---|---|---|
| `general` | circle | `44×44` | `var(--corner-radius-radius-round)` | `52497:196935` |
| `hostCompute` | circle | `44×44` | `var(--corner-radius-radius-round)` | `52497:197088` |
| `hostStorage` | circle | `44×44` | `var(--corner-radius-radius-round)` | `52497:198267` |
| `hostNetwork` | circle | `44×44` | `var(--corner-radius-radius-round)` | `52497:198289` |
| `vm` | circle | `44×44` | `var(--corner-radius-radius-round)` | `54153:279997` |
| `applicationService` | circle | `44×44` | `var(--corner-radius-radius-round)` | `52497:198317` |
| `cluster` | rounded square | `44×44` | `var(--corner-radius-radius-8)` | `52497:197085` |
| `datacenter` | rounded square | `44×44` | `var(--corner-radius-radius-8)` | `52497:197044` |
| `hypervisor` | pentagon | `48×42` (polygon shell) | polygon path (not CSS radius) | `52497:196949` |

**Icon slot:** `20×20px` centered inside shell (`var(--sizing-size-20)`). **Host-provided** `iconSlug` or default map in element spec.

| `elementType` | Default icon slug | Figma evidence |
|---|---|---|
| `general` | `objects-square` | `52497:196935` |
| `cluster` | `cluster-badge` | `52497:197085` |
| `datacenter` | `data-center-front` | `52497:197044` |
| `hostCompute` | `device-server-13g` | `52497:197088` |
| `hostStorage` | `storage-array` | `52497:198267` |
| `hostNetwork` | `device-switch-blade` | `52497:198289` |
| `hypervisor` | `virtual-machine` | `52497:196949` |
| `vm` | `app-group-vm` | `54153:279997` |
| `applicationService` | `app-window` | `52497:198317` |

**Codegen rule:** Unknown `elementType` → `general` circle shell + `objects-square`.

### Element: `TopologyNodeStatusSlot`

- Icon: `16×16px`; white circular backing pad on most statuses (`18×18` base in Figma).
- **Containing block:** `TopologyNodeMain` (`position: relative`).
- **Position:** `position: absolute`; `top: -2px`; `right: -6px` (relative to `.main`, top-trailing of element shell).
- **Z-index:** `3` — above element shell and count badge wrap (`2`).
- Icon: `16×16px`; `variant="img"` for full-color status glyphs
- Omit when `status` is `none` or `notDeployed` (notDeployed uses numeric pill — future delta)
- Implementation: `TopologyNode.module.css` → `.statusSlot`

| `status` | Icon slug | Render |
|---|---|---|
| `success` | `status-ok-circ-solid` | show |
| `warning` | `status-warn-tri-solid-16` | show |
| `major` | `status-error-diamond-solid` | show |
| `critical` | `status-critical-square-solid` | show |
| `syncing` | `arrows-circ` | show; spin optional (host) |
| `none` | — | hide slot |

### Element: `TopologyNodeCountBadge`

| Property | Token / value |
|---|---|
| Wrapper | `margin-top: -8px` on badge wrap — overlaps bottom of element shell |
| Z-index | Wrapper `z-index: 2` (above shell, below status slot `3`) |
| Height | `18px` |
| Min width | content-driven; sample count `20` uses `px: 5.5px` |
| Border radius | pill `100px` / `var(--corner-radius-radius-round)` |
| Border | `var(--border-width-border-default)` solid `var(--color-border-white)` |
| Background | `var(--color-background-alerting-info-2)` |
| Text | Body 3 — `12px`, `var(--color-text-white)` |
| Expanded icon | `ctrl-minimize-16` at `8×12px` slot (`54159:282543`) — **not** ASCII `-` |
| Interaction | `<button type="button">`; toggles `expanded`; `aria-expanded` |
| Omit when | `childCount` undefined, `0`, or `showChildCount=false` |
| Implementation | `TopologyNode.module.css` → `.countBadgeWrap`, `.countBadge` |

| `expanded` | Content | Figma node |
|---|---|---|
| `false` | integer count string | `54159:282530` |
| `true` | `ctrl-minimize-16` icon | `54159:282543` |

### Element: `TopologyNodeLabel` — `_Node-label`

| Property | Token / value |
|---|---|
| Min width | `90px` |
| Padding | `var(--padding-padding-16)` horizontal, `var(--padding-padding-2)` vertical |
| Background | `var(--color-background-surface-1)` |
| Border radius | `var(--corner-radius-radius-8)` |
| Typography | Body 3 — `var(--font-size-body-3)` / `18px` line-height, `var(--color-text-neutral-strong)` |
| Text align | center; `word-break: break-word` |

### Element: `TopologyNodeGroupStack` (optional)

| Property | Contract | Figma evidence |
|---|---|---|
| When | `singleGroup` is `groupH` or `groupV` | `53468:227012`, `53468:227037` |
| Role | Collapsed multi-node preview (stacked shells) | `52505:50688` |
| Overlap | `margin-right: -40px` between stacked circles (Figma sample) | `53468:227012` |
| `groupMultiplier` | Optional `x5` text badge on preview | `53468:227012` |
| Codegen | Defer to future story; default story uses `singleGroup=default` only | |

### Slot geometry (Figma-verified)

| Slot / layer | Property | Token / contract | Figma node | Live evidence |
|---|---|---|---|---|
| `Object` (General default) | border-radius | `var(--corner-radius-radius-round)` | `52497:196937` | `get_variable_defs` on `52497:196937` |
| `Object` (General default) | border-width | `var(--border-width-border-default)` | `52497:196937` | `get_variable_defs` |
| `Object` (Cluster default) | border-radius | `var(--corner-radius-radius-8)` | `52497:197086` | `get_design_context` on `52497:197085` |
| `Object` (Datacenter default) | border-radius | `var(--corner-radius-radius-8)` | `52497:197046` | `get_design_context` on `52497:197044` |
| `TopologyNodeLabel` | border-radius | `var(--corner-radius-radius-8)` | `48308:6128` | `get_design_context` |
| `Count Badge` container | border-radius | pill (`100px`) | `54159:282478` | `get_design_context` on `54159:282530` |

## Tokens

> Per-element tables — codegen must resolve from these, not hardcoded hex.

### Element: `TopologyNodeElement` (shell)

| Role | Token |
|---|---|
| Shell background (default) | `var(--color-background-surface-2)` |
| Shell border (default) | `var(--border-width-border-default)` `var(--color-icon-accessible)` |
| Shell background (selected) | `var(--color-background-controls-brand-light)` |
| Shell border (selected/hover) | `var(--border-width-border-thick)` `var(--color-border-brand-dark)` |
| Selected shadow | `var(--color-background-controls-brand-light)` drop-shadow |
| Icon tint | `currentColor` / mask per `Icon` primitive |

### Element: `TopologyNodeStatusSlot`

| Role | Token |
|---|---|
| Icons | Full-color SVG via `Icon` `variant="img"` |

### Element: `TopologyNodeCountBadge`

| Role | Token |
|---|---|
| Background | `var(--color-background-alerting-info-2)` |
| Text | `var(--color-text-white)` |
| Border | `var(--border-width-border-default)` `var(--color-border-white)` |

### Element: `TopologyNodeLabel`

| Role | Token |
|---|---|
| Background | `var(--color-background-surface-1)` |
| Text | `var(--color-text-neutral-strong)` |

### Typography

| Role | Size | Line height | Weight |
|---|---|---|---|
| Label | `var(--font-size-body-3)` (12px) | 18px | 400 |
| Count badge | 12px | ~1.758 | 400 |

### Illustrative Figma icon slugs (host may override)

| `elementType` | Sample slug | Size |
|---|---|---|
| `general` | `objects-square` | 20px |
| `cluster` | `cluster-badge` | 20px |
| `datacenter` | `data-center-front` | 20px |
| `hostCompute` | `device-server-13g` | 20px |
| `hypervisor` | `virtual-machine` | 20px |

## States (Light Theme)

### `.Topology Element` — interaction states (per `elementType`)

Applies to **`Object`** shell. Hover uses enlarged `52×52` hit halo in Figma (`53470:228409`); selected uses brand fill + `2px` brand-dark border.

| State | Background | Border | Shadow / other |
|---|---|---|---|
| `default` | `var(--color-background-surface-2)` | `1px` `var(--color-icon-accessible)` | none |
| `hover` | `var(--color-background-surface-2)` | `2px` `var(--color-border-brand-dark)` | outer halo per Figma `Hover` asset; shell remains `44×44` |
| `selected` | `var(--color-background-controls-brand-light)` | `2px` `var(--color-border-brand-dark)` | `drop-shadow` using `var(--color-background-controls-brand-light)` per `52497:196963` |

Verified nodes: General `52497:196935` (default), `53470:228409` (hover), `52497:196963` (selected). **Same state tokens** apply to circle types (`hostCompute`, `vm`, etc.) and `radius-8` types (`cluster`, `datacenter`) unless a future Figma delta documents otherwise.

### `_node-status` variants

| `status` | Icon slug | Figma node |
|---|---|---|
| `success` | `status-ok-circ-solid` | `52497:48620` |
| `warning` | `status-warn-tri-solid` | `52497:48624` |
| `major` | `status-error-diamond-solid` | `52497:48626` |
| `critical` | `status-critical-square-solid` | `52497:48628` |
| `syncing` | `arrows-circ` | `54195:39259` |
| `notDeployed` | numeric pill on gray (`var(--color-static-gray-500)`) | `54195:39274` |

### `Count Badge` variants

| `expanded` | `interactionState` | Content | Figma node |
|---|---|---|---|
| `false` | `default` | child count string (e.g. `20`) | `54159:282530` |
| `true` | `default` | minus icon (`ctrl-minimize-16`) | `54159:282543` |
| `true` | `hover` | minus icon (same geometry) | `54159:282562` |
| `false` | `hover` | count string | `54159:282531` |

## States (Dark Theme)

Dark theme uses the same semantic tokens as **States (Light Theme)**. Resolved values for `[data-theme="dark"]` / Synapse dark scope live in `components/synapse-theme.css`.

Duplicate the full state matrix in this section only when a dark row genuinely uses different `var(--...)` references than the corresponding light row.

## Interactions

| Trigger | Behavior |
|---|---|
| Click / Enter / Space on **node shell** | Select node; emit `onNodeSelect` (parent handles). |
| Click **count badge** when `childCount > 0` | Toggle expand: `expanded=false → true` invokes parent `onExpandRequest` / `loadChildren`; badge content switches **count → minus** (`54159:282543`). |
| Click **count badge** when `expanded=true` | Collapse per parent `collapseMode`; badge content switches **minus → count**. |
| Hover node | Apply element `hover` row; shape-matched outline per [`element/design-spec.md`](../element/design-spec.md); cursor `pointer` when interactive. |
| `status=syncing` | Show `arrows-circ`; optional spin animation is host-defined (not in Figma static matrix). |

`visualState` / `data-visual-state` are **Storybook and test overrides only**.

### Accessibility

| Element | Requirement |
|---|---|
| Node shell | `role="button"` or canvas-equivalent with `aria-label` from `label` + `elementType`. |
| Count badge | `<button type="button">`; `aria-expanded` mirrors `expanded`; `aria-label` describes action (“Expand N children” / “Collapse children”). |
| Status icon | Decorative when `label` conveys meaning; else `aria-label` from `status`. |
| Selected | `aria-selected="true"` on selected node. |

### Behavior & guidelines

- **`elementType`** and **`iconSlug`** are **host-provided** — Figma type names (General, Cluster, Datacenter, etc.) are presets, not an closed enum at runtime.
- Default spec-accurate story uses **`singleGroup=default`** (`52497:198366`) only.
- Omit **`TopologyNodeCountBadge`** when `childCount` is `undefined`, `0`, or `showChildCount=false`.
- Omit **`TopologyNodeStatusSlot`** when `status` is `none` or `showStatus=false`.

## Composition & API (runtime)

### Variants

| Axis | Values | Default |
|---|---|---|
| `singleGroup` | `default` \| `groupH` \| `groupV` | `default` |
| `elementType` | `general` \| `cluster` \| `datacenter` \| `hostCompute` \| `hostStorage` \| `hostNetwork` \| `hypervisor` \| `vm` \| `applicationService` \| string | `general` |
| `interactionState` | `default` \| `hover` \| `selected` | `default` |
| `status` | `none` \| `success` \| `warning` \| `major` \| `critical` \| `syncing` \| `notDeployed` | `success` in Figma sample |
| `expanded` | boolean | `false` |

### Props — `TopologyNode`

| Prop | Type | Default | Description |
|---|---|---|---|
| `id` | `string` | required | Stable graph id. |
| `label` | `string` | `"Label name"` | Node label (Body 3). |
| `elementType` | `string` | `"general"` | Preset shell shape + default icon mapping. |
| `iconSlug` | `string?` | from `elementType` | User-defined icon override (20×20). |
| `status` | see variants | `none` | Alert/status overlay. |
| `childCount` | `number?` | — | When `> 0`, shows count badge. |
| `expanded` | `boolean` | `false` | Badge shows minus when `true`. |
| `singleGroup` | `default` \| `groupH` \| `groupV` | `default` | Collapsed group preview mode. |
| `groupMultiplier` | `string?` | — | Optional `x5` style badge on group preview (`53468:227012`). |
| `selected` | `boolean` | `false` | Maps to element `selected` state. |
| `disabled` | `boolean` | `false` | Suppresses expand/select. |
| `x`, `y` | `number` | — | Canvas coordinates (parent-owned). |

### Events

| Event | Payload | When |
|---|---|---|
| `onNodeSelect` | `{ id }` | Shell activated. |
| `onExpandRequest` | `{ id, expanded }` | Count badge toggled; parent runs lazy load when expanding. |
| `onCollapseRequest` | `{ id }` | Badge collapse when `expanded` goes `true → false`. |

## Codegen Contract (Framework-Agnostic Blueprint)

### Deterministic structure

Emit slots in **Anatomy** order. `TopologyNodeElement` must resolve shell shape from `elementType` table.

### Variant matrix

Cross product of `singleGroup`, `elementType`, `interactionState`, `status`, `expanded` with rules in **States** — invalid combos fall back to `default`.

### Per-slot style contract

| Element | Contract | Drift guard |
|---|---|---|
| `TopologyNodeRoot` | Absolute position from `x`,`y`; center anchor `translate(-50%,0)` | Coords owned by parent graph |
| `TopologyNodeMain` | `position: relative` | Required for status absolute positioning |
| `TopologyNodeStatusSlot` | `top: -2px`; `right: -6px`; `z-index: 3`; 16px `variant="img"` icons | Hide when `none` |
| `TopologyNodeCountBadge` | `margin-top: -8px` on wrap; `z-index: 2`; 18px pill; minus icon when expanded | Never render `"-"` text for expanded |
| `TopologyNodeElement` | Shape from `elementType` table; states from § States | No hardcoded radius except pentagon clip-path |
| `TopologyNodeLabel` | Body 3; min-width 90px; surface-1 chip | |
| `TopologyNodeGroupStack` | Only when `singleGroup≠default` | Not in default spec-accurate story |

### Z-index stacking (within one node)

| Layer | z-index | Notes |
|---|---|---|
| Element shell (`.shapeRow`) | auto / `0` | Base |
| Count badge wrap | `2` | Overlaps shell via `margin-top: -8px` |
| Status slot | `3` | Top-trailing overlay |
| `TopologyNodeRoot` when hovered | `10` | Lifts node above neighbors for tooltip/selection |

**Codegen rule:** Do not use ad-hoc `z-index: 5` unless updating reference — match table above for Storybook parity.

### Behavior contract

- Count badge is the **only** expand trigger in default node (`52497:198366`).
- Expanded badge **must** render minus icon, not the literal string `"-"`.
- Group modes render stacked element previews without duplicate labels per stacked icon.

### Accessibility contract

See **Interactions → Accessibility**.

### Asset resolution + bundling contract

Resolve icon slugs via shared `Icon` from `assets/icons/`. Status and element icons cited in **Tokens** table.

### Fallback/error rules

- Unknown `elementType` → `general` circle shell.
- Unknown `status` → hide status slot.
- `childCount` missing with `hasChildren=true` → show badge with `…` or spinner (parent policy); document in parent Topology spec.
- Missing `label` → codegen validation error.

### Validation checklist

- [x] Default variant matches Figma `52497:198366` (single node + status + count + label)
- [x] Count badge toggles count ↔ minus per `54159:282530` / `54159:282543`
- [x] All six `_node-status` variants render correct icon slug
- [x] Element type shell shapes match geometry table (circle, radius-8, pentagon)
- [x] Selected/hover use brand tokens from `52497:196963` / `53470:228409`
- [x] Label uses Body 3 tokens from `48308:6128`
- [x] Slot geometry table cites live Figma nodes for radii
- [x] Parent composition pointer to `topology/design-spec.md` present
- [x] `TopologyNodeMain` `position: relative` documented
- [x] Status slot `top/right` + `z-index: 3` documented
- [x] Count badge `margin-top: -8px` + `z-index: 2` documented
- [x] SDD Mode B standalone usage documented

## Source Mapping

| Source | Location |
|---|---|
| Parent spec | `components/synapse/topology/design-spec.md` |
| Node component set | `53468:227013` |
| Spec-accurate node | `52497:198366` |
| Topology elements board | `52497:196934` |
| Topology element spec | `components/synapse/topology/element/design-spec.md` |
| Node status set | `52497:48619` |
| Count badge set | `54159:282532` |
| Node label | `48308:6128` |
| Theme CSS | `components/synapse-theme.css` |
| Figma map | `data/synapse-component-figma-map.json` |
| Implementation | `storybook/src/components/topology/TopologyNode.tsx` |
| CSS module | `storybook/src/components/topology/TopologyNode.module.css` |
| Verification | Figma MCP (`get_metadata`, `get_design_context`, `get_variable_defs`) — 2026-06-22 |
