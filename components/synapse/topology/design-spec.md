# Topology Design Spec

## Metadata

| Property | Value |
|---|---|
| Component | Topology |
| Design system | Synapse |
| Category | Components |
| Spec pattern | **standalone** |
| Reference implementation | Storybook `storybook/src/components/topology/` — **handoff zip only**; see [`reference/README.md`](./reference/README.md); not duplicated in this spec |
| Status | **active** |
| Version | 1.2.0 |
| Created | 2026-06-22 |
| Updated | 2026-06-23 |
| Description | Synapse network topology canvas — toolbar, SVG viewport, nodes/groups/edges, zoom, search, optional filters, legend |
| Figma file | `Td1bnsvRj1PCGs9RVJkIvJ` (Synapse Hi-Fi components) |
| Theme CSS | `components/synapse-theme.css` |
| V1 handoff README | [`README.md`](./README.md) — delivery package, handoff model |
| Reference layer index | [`reference/README.md`](./reference/README.md) — TS/CSS paths in zip (not in spec body) |
| Agent prompt (Devin / external agents) | [`AGENT_PROMPT.md`](./AGENT_PROMPT.md) — **read first** for Storybook parity |
| Verification method | Figma MCP |
| Last verified | 2026-06-23 (edge anchor + arrowhead geometry `54010:295831`) |
| Storybook examples requested | yes |
| Story source | `storybook/src/components/topology/SynapseTopology.stories.tsx` (`Spec Generated/Synapse/Topology`) |
| Docs code snippets | `storybook/src/spec-contracts/topology/synapse-topology.docs-snippets.ts` (shown in Storybook **Docs** tab) |
| Demo reference | [Common Topology WIP](https://craft-level-03601619.figma.site/) |

### Runtime scenarios

| Scenario | `dataMode` | Description |
|---|---|---|
| Static graph | `eager` | Full `nodes` + `edges` provided upfront |
| Lazy expand | `lazy` | Children loaded via `loadChildren` when count badge expands |

### Live verification evidence

| Check | Node(s) | Method |
|---|---|---|
| Page layout (`Show detail panel=false`) | `54009:293109` / instance `54015:299824` | Figma MCP `get_design_context` |
| Topology documentation board | `55459:151352` | Figma MCP `get_metadata` |
| Topology Toolbar `Show filter=true` | `53993:290064` | Figma MCP `get_design_context` |
| Topology Toolbar `Show filter=false` | `53993:290234` / `54010:295885` | Figma MCP `get_design_context` |
| Viewport controls (slider + actions) | `52586:463196` | Figma MCP `get_design_context` |
| Legend | `53993:290286` / `55459:151350` | Figma MCP `get_design_context` |
| Minimap trigger | `54009:292963` | Figma MCP `get_design_context` |
| Left navigation (context) | `55439:49840` | Figma MCP `get_metadata` — **V2** (no spec in v1) |

### V2 deferred scope

| Item | Figma | v1 status |
|---|---|---|
| **Topology Navigation** (`TopologyNavSlot`) | `55439:49840` | **Deferred** — no `navigation/design-spec.md`; `showNav` reserved; page layout may show nav in Figma context only |

### SDD package hierarchy

This component is a **composed spec**: one parent contract references standalone child specs. Codegen and hand-off can target either the whole package or individual elements.

```
components/synapse/topology/design-spec.md          ← composer (canvas + toolbar + edges)
├── node/design-spec.md                             ← TopologyNode (status, badge, label)
│   └── element/design-spec.md                      ← TopologyElementShell (shape + icon only)
├── node-tooltip/design-spec.md                     ← _node-tooltip hover/info card (not generic Tooltip)
├── group/design-spec.md                            ← TopologyGroup (border frame + group label)
└── library slots (by reference, not duplicated):
    search, slider, button, tag, dropdown-single-select, detail-panel

V2 (deferred): Topology Navigation (`55439:49840`) — no child spec in v1
```

| Spec file | Standalone? | Consumed by |
|---|---|---|
| `topology/design-spec.md` | yes (full canvas) | Storybook `Topology.tsx`; app embed |
| `topology/node/design-spec.md` | yes | Parent canvas; third-party graph libraries |
| `topology/element/design-spec.md` | yes | Node spec; any host needing shape chrome only |
| `topology/node-tooltip/design-spec.md` | yes | Node hover; group info (`onGroupInfo`) |
| `topology/group/design-spec.md` | yes | Parent canvas; grouped layouts |

### Embedded component specs (by reference)

| Slot | Spec / module | Integration |
|---|---|---|
| Canvas nodes | [`node/design-spec.md`](./node/design-spec.md) | `TopologyNode` in `TopologyCanvasLayer` |
| Element shells | [`element/design-spec.md`](./element/design-spec.md) | `TopologyElementShell` inside `TopologyNode` — **do not duplicate shell CSS in node or parent** |
| Group containers | [`group/design-spec.md`](./group/design-spec.md) | `TopologyGroup` wraps child nodes |
| Node hover / info card | [`node-tooltip/design-spec.md`](./node-tooltip/design-spec.md) | `TopologyNodeTooltip` — **not** [`components/synapse/tooltip`](../tooltip/design-spec.md) |
| Search field | [`components/synapse/search/design-spec.md`](../search/design-spec.md) | `Search` `variant="main"`; placeholder `Search node name` |
| Zoom slider + stepper | [`components/synapse/slider/design-spec.md`](../slider/design-spec.md) | `TopologyZoomSlider` → `SynapseSlider` (`showEdgeLabels=false`, `density=viewport`); −/+ icon buttons; `%` readout |
| Toolbar icon buttons | [`components/synapse/button/design-spec.md`](../button/design-spec.md) | Reset, fullscreen, save — icon-only `padding-8`/`padding-6` |
| Filter chip | [`components/synapse/tag/design-spec.md`](../tag/design-spec.md) | Filter pill — `Status:` (medium) + value + `arrow-drop-tri-caret` (`54015:299554`); **not** a numeric badge |
| Add Filter CTA | `TopologyAddFilterButton` — `state-add-circ-solid` + brand-strong label (`54197:38669`) | Opens host `onAddFilter` |
| Status filter menu | [`components/synapse/dropdown-single-select/design-spec.md`](../dropdown-single-select/design-spec.md) | `SynapseDropdownMenu` single-select + radio; detached popup |

## Anatomy

Deterministic slot order:

1. **`TopologyRoot`** — page-level region (`role="region"`).
2. **`TopologyLayout`** — optional page chrome from `Topology Page Layout` (`54012:298596`).
   - **`TopologyPageHeader`** (optional, host-provided).
   - **`TopologyBody`** — main row: optional nav + canvas column.
3. **`TopologyNavSlot`** (optional, **V2**) — `Topology Navigation` tree (`55439:49840`); reserved in API (`showNav`); **not implemented in v1**
4. **`TopologyMainColumn`**
   - **`TopologyToolbar`** (`53993:290235`)
     - **`TopologySearchSlot`** — `Search-Main` 280px (`53991:280912`)
     - **`TopologyFilterSlot`** (optional) — filter chip + **Add Filter** when `showFilter=true`
     - **`TopologyViewportControls`** (`52586:463196`)
   - **`TopologyCanvasViewport`** — pan/zoom surface (SVG host).
     - **`TopologyCanvasLayer`** — transformed `<g>` for zoom/pan.
     - **`TopologyEdgeLayer`** — SVG edges below nodes.
     - **`TopologyNodeLayer`** — [`TopologyNode`](./node/design-spec.md) instances.
     - **`TopologyGroupLayer`** — [`TopologyGroup`](./group/design-spec.md) instances.
   - **`TopologyCanvasFooter`**
     - **`TopologyLegend`** (`53993:290286`)
     - **`TopologyMinimapSlot`** (optional) — `Minimap` (`54009:292963`)
5. **`TopologyDetailPanelSlot`** (optional) — [`SynapseDetailPanel`](../detail-panel/design-spec.md) `attachMode="topology"` when `showDetailPanel=true` (`54102:37235`). Sibling of **`TopologyMainColumn`** in a flex row; main column `flex:1 min-width:0`, panel `398px`.

## Layout & Measurements

> **Codegen index:** Each toolbar/canvas element has a dedicated `### Element:` subsection below with layout, tokens, states, API bindings, and drift guards. Child node/group visuals are **only** in linked child specs.

### Page layout sample (reference only)

Figma `Topology Page Layout` variant **`Show detail panel=false`**: `1600×900px` (`54009:293109`). Variant **`Show detail panel=true`**: `54012:298595` — canvas column shrinks; detail panel `398px` on the right. **Runtime:** `width: 100%`, `height: 100%` of parent container; `box-sizing: border-box`.

### Element: `TopologyRoot` (`54015:299824` / page `54009:293109`)

Outermost topology host — **distinct from** `TopologyLayout` (inner padded column). Storybook: `Topology.module.css` → `.root`; `Topology.tsx` → `<section role="region">`.

| Property | Contract | Figma evidence |
|---|---|---|
| Role | Page-level region; `role="region"` + `aria-label` (e.g. “Topology” / “System topology”) | runtime |
| Display | `flex`; `flex-direction: column` | runtime |
| Width / height | `width: 100%`; `height: 100%`; `flex: 1`; `min-height: 520px` (story host may use `780px`) | `54009:293109` sample |
| Box model | `box-sizing: border-box` | runtime |
| Background | `var(--color-background-surface-2)` | `get_design_context` `54009:293109` |
| Border width | `var(--border-width-border-default)` | `54015:299824` page chrome |
| Border color | `var(--color-border-light)` | `54015:299824` |
| Border radius | `var(--corner-radius-radius-4)` | `54015:299824` |
| Overflow | `hidden` (clips toolbar/canvas/footer to rounded shell) | runtime |
| Implementation | `Topology.module.css` → `.root` | `Topology.tsx` |

**Codegen rule:** Apply border + radius on **`TopologyRoot` only** — do **not** duplicate on `TopologyLayout` or `TopologyCanvasViewport`. Embed host may mirror Figma page sample with `max-width: 1600px` on an **ancestor** wrapper (Storybook story decorator), not on `TopologyRoot` itself.

### Element: `TopologyContentRow` (`54012:298455`)

| Property | Contract | Figma evidence |
|---|---|---|
| Role | Horizontal flex: main canvas column + optional detail panel | `54012:298595` |
| Main column | `flex: 1; min-width: 0` | `54012:298455` |
| Detail panel | `398px`, `flex-shrink: 0`, full height | `54102:37235` |
| Open trigger | Node click opens panel; same-node click toggles closed | runtime |
| Implementation | `Topology.module.css` → `.contentRow` | `Topology.tsx` |

### Element: `TopologyLayout` (`54009:292967`)

| Property | Contract | Figma evidence |
|---|---|---|
| Role | Canvas column wrapper inside page main area | `54009:292967` |
| Background | `var(--color-background-surface-2)` | `get_design_context` `54009:293109` |
| Padding | `var(--padding-padding-24)` all sides | `54009:292967` |
| Column gap | `var(--spacing-space-16)` toolbar ↔ canvas ↔ footer | `54009:292967` |
| Flex | `flex-direction: column`; canvas `flex: 1` | runtime |
| Implementation | `Topology.module.css` → `.layout` | `storybook/src/components/topology/Topology.tsx` |

**Codegen rule:** Do not add toolbar horizontal padding — inset comes from layout padding only.

### Element: `TopologyToolbar` (`53993:290234` / `53993:290064`)

| Property | Contract | Figma evidence |
|---|---|---|
| Role | Single 32px row; left search/filter, right viewport controls | `54010:295885` |
| Layout | `display: flex`; `justify-content: space-between`; `align-items: center` | `53993:290234` |
| Height | `min-height: 32px` | `53993:290151` |
| Gap (left cluster) | `var(--spacing-space-16)` search ↔ filter chip ↔ Add Filter when `showFilter=true` | `54010:295686` |
| Gap (toolbar ends) | `var(--spacing-space-24)` when filter row present | `53993:290064` |
| Border | **none** (no divider under toolbar) | `54010:295885` |
| Implementation | `Topology.module.css` → `.toolbar`, `.toolbarLeft` | |

| Variant | Condition | Left cluster | Right cluster |
|---|---|---|---|
| `showFilter=false` | default story | Search only | Viewport controls |
| `showFilter=true` | filter story | Search + status filter chip + Add Filter | Viewport controls |

### Element: `TopologySearchSlot` — Search-Main (`53993:290152`)

| Property | Contract | Figma evidence |
|---|---|---|
| Library | `Search` with `variant="main"` | `components/synapse/search/design-spec.md` |
| Width | `280px` fixed | `53993:290152` |
| Height | `32px` | `53993:290152` |
| Shell padding | `py var(--padding-padding-2)` `px var(--padding-padding-16)` | `53993:290152` |
| Border radius | `var(--corner-radius-radius-4)` | `53993:290152` |
| Border | `var(--border-width-border-default)` `var(--color-border-accessible)` | `53993:290152` |
| Background | `var(--color-background-component)` | search spec |
| Icon | `search-16` at `16×16`; brand tint | `29393:137074` |
| Input padding | `pl var(--padding-padding-8)` `py var(--padding-padding-4)` | inner row `29393:137075` |
| Placeholder | `Search node name`; `var(--color-text-neutral)` | `29393:137076` |
| Typography | Body 2 — `var(--font-size-body-2)` / `var(--font-line-height-line-height-20)` | |
| Implementation | `Search.tsx` `variant="main"`; slot `.searchSlot` width 280px | |

**Codegen rule:** Do not use default `Search` (radius 0, disabled placeholder) in topology — **must** pass `variant="main"`.

### Element: `TopologyFilterSlot` (optional, `53993:290064`)

| Property | Contract | Figma evidence |
|---|---|---|
| Visibility | `showFilter=true` only | `53993:290064` |
| Filter chip | `TopologyFilterChip` — field `Status` (medium) + `:` + value + `arrow-drop-tri-caret` (10px) | `54015:299554` |
| Chip background | `var(--color-background-surface-2)` | `54015:299554` |
| Chip radius | `var(--corner-radius-radius-24)` | `54015:299554` |
| Chip padding | `px var(--padding-padding-12)` `py var(--padding-padding-4)` | `54015:299554` |
| Gap chip ↔ Add Filter | `var(--spacing-space-8)` | `53993:290064` |
| Status dropdown | `TopologyStatusFilter` → `SynapseDropdownMenu` (`selectionMode=single`, `showSingleSelectRadio`, `detached`) | Synapse Dropdown Single Select pattern |
| Default status value | `All` | `54015:299554` |
| Add Filter | `TopologyAddFilterButton` — `state-add-circ-solid` (16px) + label `Add Filter` | `54197:38669` |
| Add Filter padding | `px var(--padding-padding-8)` `py var(--padding-padding-2)` | `54197:38669` |
| Add Filter text | `var(--color-text-brand-strong)` | `54197:38669` |

### Element: `TopologyZoomSlider` (`53949:279842` / doc `55459:151345`)

| Property | Contract | Figma evidence |
|---|---|---|
| Role | Zoom −, Synapse Slider, Zoom +, percent readout | `53949:279842` |
| Cluster gap | `var(--spacing-space-12)` between −, slider, +, `%` | `53949:279842` |
| Implementation | `SynapseSliderWithButtons.tsx` + `TopologyZoomSlider.tsx` | `storybook/src/components/SynapseSliderWithButtons.tsx` |
| Contract constants | `SYNAPSE_TOPOLOGY_ZOOM_MIN_PERCENT=25`, `MAX=300`, `STEP=10`, `DEFAULT=100` | `synapse-topology.contract.ts` |

#### Sub-element: Zoom out button (`53932:151179`)

| Property | Contract |
|---|---|
| Component | `SynapseSliderWithButtons` → `Button` `programme="synapse"` `variant="tertiary"` `size="sm"` `iconOnly` |
| Icon | `ctrl-minimize-16` (default `mask` — tints via `var(--color-icon-brand-base)`) |
| Size | `32×28px` (`box-sizing: border-box`) |
| Padding | `py var(--padding-padding-6)` `px var(--padding-padding-8)` |
| Border | transparent default; `var(--border-width-border-default)` solid `var(--color-border-brand-base)` on `:hover` / `:active` (tertiary — see [`button`](../button/design-spec.md) + slider § tertiary) |
| Background | transparent default; `var(--color-background-controls-brand-lighter)` on hover | |
| Border radius | `var(--corner-radius-radius-4)` |
| Action | Decrement zoom by `SYNAPSE_TOPOLOGY_ZOOM_STEP_PERCENT` (10), clamp min 25 |
| `aria-label` | `Zoom out` |

#### Sub-element: Synapse Slider (`53932:151178`)

| Property | Contract |
|---|---|
| Library spec | `components/synapse/slider/design-spec.md` |
| Props | `showEdgeLabels={false}` `showStepper={false}` `showValueLabel={false}` `density="viewport"` |
| Host size | `120px × 16px` | `53932:151178` |
| Rail | `6px` pill height; `var(--color-border-light)`; `var(--corner-radius-radius-6)` — no IDS inset frame |
| Thumb | `var(--sizing-size-16)`; `var(--color-icon-brand-base)` (hover/press/focus per slider spec) |
| Thumb position (codegen) | Horizontal: `left: ((value − min) / (max − min)) × 100%` on track. Vertical: `top: 50%`; `transform: translate(-50%, -50%)` — **not** fixed `top` px. Reference: `Slider.module.css` (stepper dots use same pattern); Base UI thumb in `Slider.tsx` | |
| Fill | `var(--color-background-brand-base)` indicator; pill radius `6px` |
| Value range | **25–300** (integer percent); `step={1}` |
| `aria-valuemin` / `max` / `now` | 25 / 300 / current percent |

**Codegen rule:** Slider value **is** zoom percent; `scale = value / 100`. Do not map 0–100 slider index to scale.

#### Sub-element: Zoom in button (`53932:151182`)

| Property | Contract |
|---|---|
| Component | Same as zoom out |
| Icon | `shape-plus` |
| Action | Increment zoom by 10, clamp max 300 |
| `aria-label` | `Zoom in` |

#### Sub-element: Zoom percent label (`53932:151183`)

| Property | Contract |
|---|---|
| Content | `{value}%` (e.g. `100%`) |
| Typography | Body 2 `var(--color-text-neutral)` |
| `aria-live` | `polite` on readout |

### Element: `TopologyViewportActionButtons` (`54015:299140`)

| Property | Contract | Figma evidence |
|---|---|---|
| Gap from zoom cluster | `var(--spacing-space-8)` | `54015:299140` |
| Gap between icons | `var(--spacing-space-8)` | `52586:463196` |
| Button chrome | `py var(--padding-padding-6)` `px var(--padding-padding-8)`; radius `var(--corner-radius-radius-4)` | `53949:279843` |

| Action | Icon slug | Figma node | `aria-label` | Event |
|---|---|---|---|---|
| Reset view | `arrow-reset` | `53949:279843` | `Reset view` | `onViewReset`; sets zoom **100%**, pan **0,0** |
| Full screen | `full-screen` | `53949:279845` | `Full screen` | `requestFullscreen` on canvas host |
| Save | `save-disk` | `54015:300426` | `Save layout` | `onSave` (host-defined) |

### Element: `TopologyCanvasViewport`

| Property | Contract |
|---|---|
| Role | Pan/zoom surface; grid background |
| Flex | `flex: 1`; `min-height: 360px` (story); runtime fills layout |
| Background | `var(--color-background-surface-1)` + dot grid using `var(--color-border-light)` |
| Cursor | `grab` default; `grabbing` while panning |
| Transform stack | Inner `.canvasLayer`: `translate(x,y) scale(s)`; `transform-origin: 0 0` |
| Rendering | **SVG** edges + HTML absolutely positioned nodes — **no D3** |
| Pan | Pointer drag on background; ignore drag starting on `button`, `input`, `[role='group']` (nodes) |
| Zoom | Driven by `TopologyZoomSlider`; optional wheel (host) |

### Element: `TopologyEdgeLayer`

| Property | Contract |
|---|---|
| Layer order | Below nodes; inside transformed `.canvasLayer` |
| Direction | **Source → target** — path starts at source anchor; **filled arrowhead at target** shell intersection (`buildArrowHeadPath` tip on `to` point) |
| Stroke | `var(--color-border-accessible)`; width `1.5px` |
| Arrowhead | Separate filled SVG path (`<path d="… Z">`); `fill: var(--color-border-accessible)`; depth `7px` (`SYNAPSE_TOPOLOGY_EDGE_ARROW_LENGTH_PX`) — **not** SVG `<marker>` with CSS variables |
| Anchor | Horizontal shell intersection: source at `sourceCenter.y`, target at `targetCenter.y`; radius `22px` (`44px` shell) or `24px` (`48px` pentagon) |
| Path end | Line/cubic ends `7px` before target tip so arrowhead base meets shell (no visible gap) |
| Routing | **Flexible cubic** when vertical offset \> `4px`; **straight** when aligned (Figma `54010:295826` / `54010:295831`) |
| Curve contract | Horizontal exit at source + horizontal entry at target; control offset `clamp(40px, 45% × \|Δx\|, 120px)` |
| `edgeType=connectedTo` | Solid stroke (`53993:290059`) |
| `edgeType=dependsOn` | `stroke-dasharray: 6 4` (`53993:290062`) |
| Unknown type fallback | Render as `connectedTo` |
| Reference | `storybook/src/components/topology/utils/topologyEdgePath.ts`, `topologyNodeAnchor.ts` |

### Element: `TopologyNodeTooltip`

> **Full contract:** [`node-tooltip/design-spec.md`](./node-tooltip/design-spec.md) (`55439:46060` / `_node-tooltip`).  
> **Not** the generic Synapse Tooltip (`components/synapse/tooltip/design-spec.md`).

| Property | Contract |
|---|---|
| Role | Hover popup on canvas node; group **info** reuses same chrome |
| Implementation | `TopologyNodeTooltip.tsx`; placement `topologyNodeTooltipPlacement.ts` |
| Parent props | `showNodeTooltip`, `nodeTooltipHoverDelayMs`, `getNodeTooltipTitle`, `getNodeTooltipRows` |
| Contract | `synapse-topology-node-tooltip.contract.ts` |

### Element: `TopologyLegend` (`53993:290286` / doc `55459:151350`)

| Property | Contract | Figma evidence |
|---|---|---|
| Role | Footer-left edge type key | `53993:290286` |
| Implementation | `TopologyLegend.tsx` | `storybook/src/components/topology/TopologyLegend.tsx` |
| Row gap | `var(--spacing-space-32)` between items | `53993:290286` |
| Item layout | **Label first**, then arrow graphic (`space-8` gap) | `53993:290057`, `53993:290060` |
| Typography | Body 2 `var(--color-text-neutral)` | `53993:290058` |
| Arrow size | `48×15px` | `53993:290059`, `53993:290062` |
| Arrow color | `var(--color-border-accessible)` via `currentColor` | Figma `#757575` |
| Connected To arrow | Solid line + chevron — `topology-legend-connected-to.svg` | `53993:290059` |
| Depends On arrow | Dashed segments + chevron — `topology-legend-depends-on.svg` | `53993:290062` |
| Accessibility | `aria-label="Edge legend"`; arrows `aria-hidden` | |

**Codegen rule:** Item order is **`{label}{arrow}`** — not arrow-before-label. Do not use CSS border swatches; use Figma-exported arrow SVGs.

### Element: `TopologyMinimap` (`54009:292963`)

| Property | Contract | Figma evidence |
|---|---|---|
| Visibility | `showMinimap=true` (optional; default **false** in story contract) | |
| Size | `120×80px` | `54009:292963` |
| Border | `var(--color-border-brand-dark)` | `54009:292963` |
| Radius | `var(--corner-radius-radius-8)` | `54009:292963` |
| Background | `var(--color-background-surface-2)` | |
| Trigger icon | `grid-square-9-16` in icon button | `54009:292963` |
| Position | Footer right; layout padding provides inset | `54009:293086` |

### Slot geometry (Figma-verified)

| Slot / layer | Property | Token / contract | Figma node | Live evidence |
|---|---|---|---|---|
| Topology root shell | border width | `var(--border-width-border-default)` | `54015:299824` | `get_design_context` on `54009:293109` |
| Topology root shell | border color | `var(--color-border-light)` | `54015:299824` | `get_design_context` on `54009:293109` |
| Topology root shell | border-radius | `var(--corner-radius-radius-4)` | `54015:299824` | `get_design_context` on `54009:293109` |
| Topology root shell | background | `var(--color-background-surface-2)` | `54015:299824` | `get_design_context` on `54009:293109` |
| Search field | border-radius | `var(--corner-radius-radius-4)` | `53993:290152` | `get_design_context` on `54009:293109` |
| Topology layout | padding | `var(--padding-padding-24)` | `54009:292967` | `get_design_context` on `54009:293109` |
| Topology layout | column gap | `var(--spacing-space-16)` | `54009:292967` | `get_design_context` on `54009:293109` |
| Search field | padding | `py var(--padding-padding-2)` `px var(--padding-padding-16)` | `53993:290152` | `get_design_context` on `54010:295885` |
| Viewport slider host | width × height | `120px × 16px` | `53932:151178` | `get_design_context` on `55459:151345` |
| Viewport slider rail | height | `6px` (Synapse pill track) | `53932:123027` | `components/synapse/slider/design-spec.md` |
| Viewport slider rail fill | token | `var(--color-border-light)` | `53932:123027` | `components/synapse/slider/design-spec.md` |
| Viewport selected segment | token | `var(--color-background-brand-base)` | `53932:123008` | `components/synapse/slider/design-spec.md` |
| Viewport icon button | padding | `py var(--padding-padding-6)` `px var(--padding-padding-8)` | `53949:279843` | `get_design_context` on `54010:295885` |
| Zoom cluster | gap | `var(--spacing-space-12)` | `53949:279842` | `get_design_context` on `54010:295885` |
| Filter chip | border-radius | `var(--corner-radius-radius-24)` | `54015:299554` | `get_design_context` |
| Minimap shell | border-radius | `var(--corner-radius-radius-8)` | `54009:292963` | `get_design_context` |
| Edge arrowhead | depth | `7px` filled triangle at target shell intersection | `54010:295831` | `get_design_context` |
| Edge anchor | routing band | horizontal exit/entry at `sourceCenter.y` / `targetCenter.y` | `54010:295831` | `get_design_context` |

## Tokens

> Per-element token tables prevent codegen from inventing values. Global theme: `components/synapse-theme.css`.

### Element: `TopologyRoot`

| Role | Token |
|---|---|
| Shell background | `var(--color-background-surface-2)` |
| Shell border | `var(--border-width-border-default)` solid `var(--color-border-light)` |
| Shell radius | `var(--corner-radius-radius-4)` |

### Element: `TopologyLayout`

| Role | Token |
|---|---|
| Column background | `var(--color-background-surface-2)` |
| Inset padding | `var(--padding-padding-24)` |
| Section gap | `var(--spacing-space-16)` |

### Element: `TopologySearchSlot`

| Role | Token |
|---|---|
| Field background | `var(--color-background-component)` |
| Border | `var(--border-width-border-default)` `var(--color-border-accessible)` |
| Radius | `var(--corner-radius-radius-4)` |
| Placeholder / value text | `var(--color-text-neutral)` |
| Focus border | `var(--color-border-brand-base)` |
| Focus ring | `var(--border-width-border-thick)` `var(--color-border-brand-base)` |

### Element: `TopologyFilterSlot`

| Role | Token |
|---|---|
| Chip background | `var(--color-background-surface-2)` |
| Chip border | `var(--color-border-accessible)` |
| Chip text | `var(--color-text-neutral)` |
| Add Filter text | `var(--color-text-brand-strong)` |

### Element: `TopologyZoomSlider`

| Role | Token |
|---|---|
| Slider rail (viewport) | `var(--color-border-light)`; `6px` pill; `var(--corner-radius-radius-6)` |
| Slider fill / indicator | `var(--color-background-brand-base)` |
| Slider thumb | `var(--color-icon-brand-base)` (hover/press per slider spec) |
| Zoom label | `var(--color-text-neutral)` |
| Icon buttons | `var(--color-icon-brand-base)` (tertiary button) |

### Element: `TopologyCanvasViewport`

| Role | Token |
|---|---|
| Canvas fill | `var(--color-background-surface-1)` |
| Grid dot | `var(--color-border-light)` |

### Element: `TopologyEdgeLayer`

| Role | Token |
|---|---|
| Stroke | `var(--color-border-accessible)` |

### Element: `TopologyLegend`

| Role | Token |
|---|---|
| Label text | `var(--color-text-neutral)` |
| Swatch stroke | `var(--color-border-accessible)` |

### Element: `TopologyMinimap`

| Role | Token |
|---|---|
| Shell background | `var(--color-background-surface-2)` |
| Shell border | `var(--color-border-brand-dark)` |
| Radius | `var(--corner-radius-radius-8)` |

### Typography (shared toolbar/footer)

| Region | Style |
|---|---|
| Toolbar search / filter | Body 2 — `var(--font-size-body-2)` / `var(--font-line-height-line-height-20)` |
| Zoom percent | Body 2 |
| Legend labels | Body 2 |

## States (Light Theme)

| Region | State | Visual |
|---|---|---|
| Toolbar | `default` | per Figma `53993:290064` |
| Toolbar | `showFilter=false` | search + viewport only (`53993:290234`) |
| Canvas | `empty` | placeholder copy from layout or host empty state |
| Canvas | `loading` | optional spinner overlay (host) |
| Viewport | `default` | scale 100% sample |
| Minimap | `default` | bordered box + gallery icon |

Node/group visual states are owned by child specs.

## States (Dark Theme)

Dark theme uses the same semantic tokens as **States (Light Theme)**. Resolved values for `[data-theme="dark"]` live in `components/synapse-theme.css`.

## Interactions

### Toolbar

| Trigger | Behavior |
|---|---|
| Search input change | Debounced filter/highlight; emit `onSearchChange(query)` |
| Filter chip click | Open status filter dropdown (`TopologyStatusFilter`); default label `Status: All` |
| Status filter change | Emit `onStatusFilterChange(value)`; filter visible nodes by `status` when value ≠ `all` |
| Add Filter | Emit `onAddFilter` when `showFilter=true` |
| Zoom out / in buttons | Decrement/increment `scale` by `zoomStep` (default 10%) |
| Slider change | Set `scale` continuously; label shows `Math.round(scale*100)%` |
| Reset | Restore `scale=1`, `translate` to default; emit `onViewReset` |
| Full screen | Toggle fullscreen on canvas host; emit `onFullscreenChange` |
| Save | Emit `onSave` (persist layout — host-defined) |

### Canvas (SVG)

| Trigger | Behavior |
|---|---|
| Drag background | Pan viewport (`translateX/Y`) |
| Wheel (optional) | Zoom toward cursor |
| Drag node | Update node `x/y`; recompute edge paths; emit `onNodeMove` |
| Hover node | Show `_node-tooltip` after `500ms` dwell; cancel on click/expand/leave |
| Select node | `selected` state on node; emit `onSelectionChange` |

### Edges

| `edgeType` | Rendering |
|---|---|
| `connectedTo` | solid line + arrow (`Legend` Connected To) |
| `dependsOn` | dashed line + arrow (`Legend` Depends On) |

Edges redraw when connected nodes move.

### Lazy expand (`dataMode=lazy`)

| Step | Behavior |
|---|---|
| User clicks node **count badge** | Parent sets node `expanding`; optional `SynapseSpinner` on node |
| Parent calls `loadChildren(nodeId)` | Host returns `{ nodes, edges? }` |
| Success | Merge into graph; badge shows **minus**; `aria-busy=false` |
| Failure | Node `load-error` state; retry on badge click |
| Collapse | Per `collapseMode`: `remove` \| `hide` \| `cache` (default `hide`) |

### Accessibility

| Area | Requirement |
|---|---|
| `TopologyRoot` | `role="region"` + `aria-label` (e.g. “System topology”) |
| Search | combobox or search input with label |
| Zoom slider | Inherit Slider spec (`aria-valuemin/max/now`) |
| Icon buttons | `aria-label` per action (Zoom out, Zoom in, Reset view, Full screen, Save) |
| Canvas | Focusable nodes; keyboard selection policy documented by host |
| Legend | Presentational text + decorative arrows (`aria-hidden` on glyphs) |

### Behavior & guidelines

- **No D3** — layout is host-provided coordinates or simple force-free placement.
- Reuse **existing library** components for toolbar controls; do not duplicate Slider/Search/Button CSS.
- **V2:** **Topology Navigation** (`55439:49840`) — deferred; use canvas-only embed in v1.
- Demo site behavior should align with [Common Topology WIP](https://craft-level-03601619.figma.site/) for pan/zoom/hand-tool expectations.

## Composition & API (runtime)

### SDD delivery modes

Two supported hand-off patterns for development teams:

| Mode | Audience | Primary artifact | Codegen outcome |
|---|---|---|---|
| **A — Composed canvas** | Team building the full Topology feature (matches Storybook) | This spec + `synapse-topology.contract.ts` + Storybook `Topology.tsx` | Generate one root component: toolbar, viewport, edges, legend, optional detail panel; delegate node/group chrome to child specs |
| **B — À la carte elements** | Team using a **third-party graph library** (e.g. React Flow, Cytoscape, D3 wrapper) | Child specs + [`synapse-topology-adapter.contract.ts`](../../../storybook/src/spec-contracts/topology/synapse-topology-adapter.contract.ts) | Implement `TopologyGraphAdapter`; apply Synapse chrome from child specs — **do not** require `Topology.tsx` |

**Mode B rules:**

- Import `components/synapse-theme.css` and set `data-design-system="synapse"` on a root.
- Implement [`TopologyGraphAdapter`](../../../storybook/src/spec-contracts/topology/synapse-topology-adapter.contract.ts) (or equivalent) to map library nodes/edges to `TopologyNodeData` / `TopologyEdgeData`.
- Render **node chrome** per `node/design-spec.md`; resolve **shell geometry** from `element/design-spec.md`.
- **Hover card** per `node-tooltip/design-spec.md` (`TopologyNodeTooltip`) — not generic `Tooltip`.
- **Edges:** implement stroke, dash, and arrowhead per § Element: `TopologyEdgeLayer` (use `SYNAPSE_TOPOLOGY_GRAPH_EDGE_STYLES`).
- **Coordinates:** node `x`/`y` are graph-owned; child specs do not define force layout or routing algorithms.
- **Groups:** optional; use `group/design-spec.md` when clustering — embed `TopologyNode` children in `TopologyGroupContent`.

**Mode A rules:**

- Start from **Developer usage (Spec Accurate Design)** below and `SYNAPSE_TOPOLOGY_SAMPLE_*` contract constants.
- Toolbar slots **must** reuse library Search / Slider / Button / Tag / Dropdown specs — no duplicated CSS.
- Child visuals **must** resolve from linked specs (see **Per-slot style contract** in Codegen).

### Variants

| Prop | Values | Default |
|---|---|---|
| `showFilter` | boolean | `false` |
| `statusFilter` | `all` \| node status | `all` |
| `filterDropdownOpen` | boolean (demo) | `false` |
| `showMinimap` | boolean | `false` |
| `showLegend` | boolean | `true` |
| `showNav` | boolean | `false` | **V2** — reserved; no nav spec in v1 |
| `dataMode` | `eager` \| `lazy` | `eager` |
| `collapseMode` | `remove` \| `hide` \| `cache` | `hide` |

### Runtime API

#### Data types

```ts
interface TopologyNodeData {
  id: string;
  label: string;
  elementType?: string;
  iconSlug?: string;
  status?: string;
  x: number;
  y: number;
  childCount?: number;
  hasChildren?: boolean;
  childrenLoaded?: boolean;
  expanded?: boolean;
  groupId?: string;
}

interface TopologyEdgeData {
  id: string;
  sourceId: string;
  targetId: string;
  edgeType: "connectedTo" | "dependsOn";
}

interface TopologyGroupData {
  id: string;
  typeLabel: string;
  x: number;
  y: number;
  showCount?: boolean;
  childCount?: number;
  expanded?: boolean;
  showInfo?: boolean;
  showMinimize?: boolean;
  /** Child nodes rendered inside the group border — see topology-group spec. */
  nodes: TopologyNodeData[];
}
```

### Topology root props

| Prop | Type | Description |
|---|---|---|
| `nodes` | `TopologyNodeData[]` | Graph nodes |
| `edges` | `TopologyEdgeData[]` | Graph edges |
| `groups` | `TopologyGroupData[]?` | Optional group frames |
| `scale` | `number?` | Controlled zoom (1 = 100%) |
| `translateX`, `translateY` | `number?` | Controlled pan |
| `searchQuery` | `string?` | Toolbar search |
| `showFilter` | `boolean` | Toolbar filter row |
| `showDetailPanel` | `boolean` | Docked detail panel + shrink layout |
| `showNodeTooltip` | `boolean` | Hover `_node-tooltip` popup (default `true`) |
| `nodeTooltipHoverDelayMs` | `number` | Tooltip dwell delay before show (default `500`) |
| `getNodeTooltipTitle` / `getNodeTooltipRows` | fn | Dynamic tooltip header/body |
| `detailPanelOpen` | `boolean?` | Controlled panel open |
| `getNodeDetailTitle` / `getNodeDetailSubtitle` | `(node) => string` | Dynamic panel header |
| `getNodeDetailRows` / `renderNodeDetail` | fn | Dynamic panel body |
| `loadChildren` | `(ctx) => Promise<{ nodes, edges? }>` | Required when `dataMode=lazy` |
| `selectedNodeId` | `string?` | Controlled selection |

### Events

| Event | Payload |
|---|---|
| `onSearchChange` | `string` |
| `onStatusFilterChange` | `TopologyStatusFilterValue` |
| `onAddFilter` | — |
| `onZoomChange` | `{ scale }` |
| `onViewReset` | — |
| `onFullscreenChange` | `boolean` |
| `onSave` | — |
| `onNodeMove` | `{ id, x, y }` |
| `onNodeSelect` | `(id: string) => void` | Node click (Storybook / reference impl) |
| `onDetailPanelOpenChange` | `(open: boolean) => void` | Detail panel open/close |
| `onNodeExpandToggle` | `(id, expanded) => void` | Count-badge expand/collapse |
| `onChildrenLoaded` | `{ nodeId, result }` |
| `onChildrenLoadError` | `{ nodeId, error }` |
| `onGraphChange` | patch summary |

### Developer usage (Spec Accurate Design)

**Spec Accurate Design** is the canonical reference scenario for this component: one Storybook story (and one minimal app integration) that matches Figma `54009:293109` with the default sample graph from the spec contract. Use it for visual QA and as the template for passing real data.

#### Where to find it

| Item | Location |
|---|---|
| Storybook path | **Spec Generated → Synapse → Topology** — start with **Developer Usage** for all copy-paste examples |
| Story source | `storybook/src/components/topology/SynapseTopology.stories.tsx` |
| Docs code snippets | `storybook/src/spec-contracts/topology/synapse-topology.docs-snippets.ts` (Docs tab **Show code**, not auto-extracted render) |
| React component | `storybook/src/components/topology/Topology.tsx` |
| Sample data + constants | `storybook/src/spec-contracts/topology/synapse-topology.contract.ts` |
| Group sample (separate story) | `storybook/src/spec-contracts/topology/synapse-topology-group.contract.ts` → story **Node Group** |
| Element types (all 9 shapes) | `SYNAPSE_TOPOLOGY_ELEMENT_TYPE_SAMPLE_NODES` in contract → story **Element Types** |
| Multi-level expand | `SYNAPSE_TOPOLOGY_EXPAND_ROOT_NODES` + `loadTopologyExpandChildren` → story **Expand Next Level** |
| Element shell spec | `components/synapse/topology/element/design-spec.md` → **Spec Generated → Synapse → Topology Element** |
| Detail panel spec | `components/synapse/detail-panel/design-spec.md` → story **Detail Panel / Node Click** |
| Mode B adapter | `synapse-topology-adapter.contract.ts` + `TOPOLOGY_GRAPH_ADAPTER_SNIPPET` in docs-snippets |
| Node tooltip spec | `components/synapse/topology/node-tooltip/design-spec.md` |
| Theme (required) | `components/synapse-theme.css` on a root with `data-design-system="synapse"` |

Run Storybook from `storybook/`:

```bash
npm run dev
# open Spec Generated / Synapse / Topology / Spec Accurate Design
```

#### Theme and wrapper

Load Synapse theme CSS once at app (or story) root. The reference story wraps the canvas in a frame with `data-design-system="synapse"` and `max-width: 1600px` to mirror the Figma page layout sample.

```tsx
import "../../../components/synapse-theme.css";
import { Topology } from "./Topology";
import {
  SYNAPSE_TOPOLOGY_DEFAULT_ARGS,
  SYNAPSE_TOPOLOGY_SAMPLE_EDGES,
  SYNAPSE_TOPOLOGY_SAMPLE_NODES,
} from "../../spec-contracts/topology/synapse-topology.contract";

export function TopologyPage() {
  return (
    <div data-design-system="synapse" style={{ minHeight: 780 }}>
      <Topology
        nodes={SYNAPSE_TOPOLOGY_SAMPLE_NODES}
        edges={SYNAPSE_TOPOLOGY_SAMPLE_EDGES}
        {...SYNAPSE_TOPOLOGY_DEFAULT_ARGS}
      />
    </div>
  );
}
```

#### Passing graph data

**Nodes** — array of `TopologyNodeData`. Each node needs a unique `id`, display `label`, canvas `x` / `y` (pixels inside the panned/zoomed layer), and optional fields from the [topology-node spec](./node/design-spec.md):

| Field | Required | Purpose |
|---|---|---|
| `id` | yes | Stable key; used by edges and selection |
| `label` | yes | Node label chip text |
| `x`, `y` | yes | Position in canvas coordinates (host layout engine) |
| `elementType` | no | Shape + default icon (`datacenter`, `cluster`, `hostCompute`, …) |
| `status` | no | Status badge (`success`, `warning`, `major`, `critical`, `syncing`, `none`) |
| `childCount` | no | Shows expand badge when &gt; 0 |
| `expanded` | no | Badge shows minus when true |
| `iconSlug` | no | Override icon from `assets/icons/<slug>.svg` |

**Edges** — array of `TopologyEdgeData`:

| Field | Purpose |
|---|---|
| `sourceId`, `targetId` | Must match existing node `id` values |
| `edgeType` | `connectedTo` (solid) or `dependsOn` (dashed) |

**Groups** (optional) — array of `TopologyGroupData` per [topology-group spec](./group/design-spec.md). Each group has its own `x`/`y` on the canvas and embeds `nodes[]` inside the group border. Use story **Node Group** as reference.

#### Spec Accurate Design sample graph

Defined in `synapse-topology.contract.ts` — **do not change without updating this spec**:

- **3 nodes:** Datacenter East (`dc-1`), Compute Cluster (`cluster-1`), Host / Compute (`host-1`)
- **2 edges:** `dc-1` → `cluster-1` (`connectedTo`), `cluster-1` → `host-1` (`dependsOn`)
- **Toolbar:** `showFilter=false`, legend on, minimap off, zoom 100%
- **Default node Figma:** `52497:198366`

```ts
import {
  SYNAPSE_TOPOLOGY_SAMPLE_NODES,
  SYNAPSE_TOPOLOGY_SAMPLE_EDGES,
  SYNAPSE_TOPOLOGY_DEFAULT_ARGS,
} from "../../spec-contracts/topology/synapse-topology.contract";

<Topology
  nodes={SYNAPSE_TOPOLOGY_SAMPLE_NODES}
  edges={SYNAPSE_TOPOLOGY_SAMPLE_EDGES}
  {...SYNAPSE_TOPOLOGY_DEFAULT_ARGS}
/>
```

#### Controlled vs uncontrolled props

| Prop | Uncontrolled (internal state) | Controlled |
|---|---|---|
| `searchQuery` | Omit — component filters/highlight internally | Pass `searchQuery` + `onSearchChange` |
| `statusFilter` | Omit — defaults to `all` | Pass `statusFilter` + `onStatusFilterChange` |
| `selectedNodeId` | Omit — click sets selection internally | Pass `selectedNodeId` + `onNodeSelect` |

#### Common integration patterns

**1. Static graph (eager)** — pass full `nodes` and `edges` up front (Spec Accurate Design).

**2. Toolbar with filters** — set `showFilter={true}`. Optional `statusFilter` / `onStatusFilterChange` filter visible nodes by `status`. `onAddFilter` for Add Filter CTA. Story: **Toolbar / Show Filter**.

**3. Lazy / multi-level expand** — provide `loadChildren(nodeId, { nodes })`; returns `{ nodes, edges? }`. Expand count badge loads the next level; collapse removes the subtree. Stories: **Expand Next Level**, **Lazy / Expand Children**.

```tsx
<Topology
  nodes={SYNAPSE_TOPOLOGY_EXPAND_ROOT_NODES}
  edges={[]}
  loadChildren={async (nodeId, { nodes }) => {
    const response = await fetch(`/api/topology/children/${nodeId}`);
    return response.json(); // { nodes: TopologyNodeData[], edges?: TopologyEdgeData[] }
  }}
  onNodeExpandToggle={(id, expanded) => {
    // optional: track expand state in parent store
  }}
/>
```

**4. Node group** — pass `groups` with embedded `nodes`; standalone nodes in `nodes` can be empty. Import sample from `synapse-topology-group.contract.ts` (under `storybook/src/spec-contracts/topology/`):

```tsx
import { SYNAPSE_TOPOLOGY_GROUP_SAMPLE } from "../../spec-contracts/topology/synapse-topology-group.contract";

<Topology nodes={[]} edges={[]} groups={[SYNAPSE_TOPOLOGY_GROUP_SAMPLE]} showLegend={false} />
```

#### Callbacks (reference implementation)

| Callback | When it fires |
|---|---|
| `onSearchChange(query)` | Toolbar search input changes |
| `onStatusFilterChange(value)` | Status filter dropdown selection (`all` \| node status) |
| `onAddFilter()` | Add Filter button click |
| `onNodeSelect(id)` | User selects a node |
| `onNodeExpandToggle(id, expanded)` | Count badge expand/collapse |
| `onViewReset()` | Reset view control |
| `onSave()` | Save layout control |

Pan/zoom is internal in the reference Storybook component (not fully controlled via `scale` / `translate` props yet).

#### Storybook controls (Spec Accurate Design)

In **Spec Accurate Design**, these props are exposed in the Controls panel:

- `showFilter`, `showLegend`, `showMinimap` (booleans)

Override `nodes` / `edges` in code or duplicate the story with custom args — the contract file is the single source for the canonical sample.

#### Styling rules for consumers

- Import **`components/synapse-theme.css`**; use semantic `var(--...)` only (see **Tokens** and child specs).
- Reuse library components for toolbar slots (Search, Slider, Button, Dropdown) — do not duplicate their CSS in Topology.
- Node and group chrome: follow [node](./node/design-spec.md) and [group](./group/design-spec.md) specs; parent does not redefine child visuals.

#### Spec Accurate Design story defaults (summary)

- Layout variant: `54009:293109` (`Show detail panel=false`)
- Toolbar: `showFilter=false` unless testing filter row (`53993:290064`)
- Sample graph: 3 nodes + 2 edges (one `connectedTo`, one `dependsOn`)
- Default node: [`node`](./node/design-spec.md) `52497:198366`
- Zoom: 100%; theme `components/synapse-theme.css`
- Story title: `Spec Generated/Synapse/Topology` — story name **Spec Accurate Design**

## Codegen Contract (Framework-Agnostic Blueprint)

### Deterministic structure

Emit anatomy slots in order. Child visuals **must** resolve from linked specs — no duplicated node CSS in parent.

### Variant matrix

`showFilter`, `showMinimap`, `showLegend`, `showNav`, `dataMode`, `collapseMode`.

### Per-slot style contract

| Element | Style source | Drift guard |
|---|---|---|
| `TopologyLayout` | This spec § Element: TopologyLayout | Padding must be `padding-24`; gap `space-16` |
| `TopologySearchSlot` | `components/synapse/search/design-spec.md` + `variant="main"` rows | Radius 4; placeholder neutral not disabled |
| `TopologyFilterSlot` | `TopologyFilterChip` + `TopologyStatusFilter` + `TopologyAddFilterButton` | Only when `showFilter=true` |
| `TopologyZoomSlider` | `components/synapse/slider/design-spec.md` + § Element: TopologyZoomSlider | Range 25–300; no edge labels; `density=viewport` |
| `TopologyViewportActionButtons` | `components/synapse/button/design-spec.md` | Icon-only tertiary `sm`; px-8 py-6 |
| `TopologyCanvasViewport` | This spec | SVG + transform; no D3 |
| `TopologyEdgeLayer` | This spec § Element: TopologyEdgeLayer | Dash only for `dependsOn` |
| `TopologyNodeLayer` | [`node`](./node/design-spec.md) + [`element`](./element/design-spec.md) | **No duplicated node/element CSS in parent** |
| `TopologyNodeTooltip` | [`node-tooltip/design-spec.md`](./node-tooltip/design-spec.md) | Not generic Tooltip |
| `TopologyGroupLayer` | [`group/design-spec.md`](./group/design-spec.md) | **No duplicated group CSS in parent** |
| `TopologyLegend` | This spec § Element: TopologyLegend | Two items only |
| `TopologyMinimap` | This spec § Element: TopologyMinimap | Optional; default off in contract |

### CSS implementation contracts (codegen-critical)

Prescriptive layout/CSS from Storybook reference — agents **must not** paraphrase as “top-right” without these values.

| Area | Contract | Reference |
|---|---|---|
| `TopologyRoot` | Border `var(--border-width-border-default)` solid `var(--color-border-light)`; radius `var(--corner-radius-radius-4)`; `overflow: hidden` | `Topology.module.css` → `.root` |
| Zoom −/+ (tertiary) | `border-color: transparent` default; hover/active → `var(--color-border-brand-base)` + `var(--color-background-controls-brand-lighter)` | `Button.module.css` → `.tertiary` |
| Slider thumb | Vertical center: `top: 50%`; `transform: translate(-50%, -50%)`; horizontal `%` from value | `Slider.module.css`; `Slider.tsx` |
| Zoom icons | `ctrl-minimize-16` / `shape-plus`: `Icon` **`variant="mask"`** (tint via `color` / `currentColor`) — not `fill` on SVG | `TopologyZoomSlider.tsx` |
| Node `main` cluster | `position: relative` on `TopologyNodeMain` (`.main`) — required for absolute children | `TopologyNode.module.css` → `.main` |
| Status slot | `position: absolute`; `top: -2px`; `right: -6px`; `z-index: 3` | `TopologyNode.module.css` → `.statusSlot` |
| Count badge wrap | `margin-top: -8px` (overlap shell); `z-index: 2` | `TopologyNode.module.css` → `.countBadgeWrap` |
| Node hover lift | `TopologyNodeRoot` `z-index: 10` when hovered | `TopologyNode.module.css` → `.root[data-hovered]` |
| Node tooltip layer | Sibling of `nodeLayer` **inside** transformed `canvasLayer`; `z-index: 200`; `pointer-events: none` | `Topology.module.css` → `.tooltipLayer` |
| Tooltip card | `position: absolute`; `left`/`top` in canvas space; width `233px`; `pointer-events: none` | `TopologyNodeTooltip.module.css`; `topologyNodeTooltipPlacement.ts` |
| Edges | Arrow at **target**; `sourceId` → `targetId`; port `topologyEdgePath.ts` | § Element: `TopologyEdgeLayer` |

**Node z-order (bottom → top):** element shell → count badge (`z-index: 2`) → status slot (`z-index: 3`) → hovered node root (`z-index: 10`). Full detail: [`node/design-spec.md`](./node/design-spec.md) § Z-index stacking.

### Behavior contract

- SVG pan/zoom with transform stack on `TopologyCanvasLayer`.
- Edge routing: **flexible cubic** (horizontal tangents) when nodes are vertically offset; **straight** when \|Δy\| ≤ `4px`; paths recompute on `onNodeMove`.
- Lazy expand orchestrated only in parent; badge click on node delegates to parent `loadChildren`.
- Zoom slider bound bidirectionally to `scale`.

### Accessibility contract

See **Interactions → Accessibility** + Slider IDS/Synapse contract.

### Asset resolution + bundling contract

Toolbar icons: `search-16`, `arrow-drop-tri-caret`, `state-add-circ-solid`, `ctrl-minimize-16`, `shape-plus`, `arrow-reset`, `full-screen`, `save-disk`, `photos` (minimap).

### Fallback/error rules

- Unknown `edgeType` → `connectedTo`.
- Duplicate node ids → validation error.
- `loadChildren` missing in `lazy` mode → expand shows error state.
- Missing Search/Slider import → fail codegen boundary.

### Validation checklist

- [x] Toolbar matches `53993:290064` / `53993:290234` variants
- [x] Viewport controls match `52586:463196` (slider + 3 icon actions + zoom label)
- [x] Legend matches `53993:290286` (Connected To + Depends On)
- [x] Page layout sample `1600×900` documented as reference-only
- [x] Child specs linked for node, element, group, and node-tooltip
- [x] Mode B `TopologyGraphAdapter` contract documented
- [x] Library reuse documented for Search, Slider, Button, Tag
- [x] `eager` and `lazy` data modes documented
- [x] SVG rendering stated; no D3
- [x] Slot geometry table complete with Figma node citations
- [x] **Developer usage (Spec Accurate Design)** section complete (integration, data shapes, callbacks)
- [x] SDD delivery modes A (composed) and B (à la carte) documented
- [x] CSS implementation contracts (z-index, tertiary buttons, thumb centering, edge direction) documented
- [x] Demo URL recorded in Source Mapping

## Source Mapping

| Source | Location |
|---|---|
| Child node spec | `components/synapse/topology/node/design-spec.md` |
| Child element spec | `components/synapse/topology/element/design-spec.md` |
| Child group spec | `components/synapse/topology/group/design-spec.md` |
| Child node-tooltip spec | `components/synapse/topology/node-tooltip/design-spec.md` |
| Mode B adapter contract | `storybook/src/spec-contracts/topology/synapse-topology-adapter.contract.ts` |
| Node tooltip contract | `storybook/src/spec-contracts/topology/synapse-topology-node-tooltip.contract.ts` |
| Page layout set | `54012:298596` / `54009:293109` |
| Topology board | `55459:151352` |
| Toolbar set | `53993:290235` |
| Viewport controls | `52586:463196` |
| Legend | `53993:290286` |
| Minimap | `54009:292963` |
| Topology Navigation (V2 deferred) | `55439:49840` — no v1 spec |
| Storybook story | `storybook/src/components/topology/SynapseTopology.stories.tsx` |
| Topology implementation | `storybook/src/components/topology/Topology.tsx` |
| Legend arrow assets | `assets/icons/topology-legend-connected-to.svg`, `topology-legend-depends-on.svg` |
| Legend implementation | `storybook/src/components/topology/TopologyLegend.tsx` |
| Spec contract | `storybook/src/spec-contracts/topology/synapse-topology.contract.ts` |
| Viewport controls doc | `55459:151345` |
| Button spec | `components/synapse/button/design-spec.md` |
| Tag spec | `components/synapse/tag/design-spec.md` |
| Theme CSS | `components/synapse-theme.css` |
| Figma map | `data/synapse-component-figma-map.json` |
| Interactive demo | https://craft-level-03601619.figma.site/ |
| Verification | Figma MCP — 2026-06-23 |

**Note:** Legacy map node `48306:5980` is stale; live component sets verified at nodes listed above.
