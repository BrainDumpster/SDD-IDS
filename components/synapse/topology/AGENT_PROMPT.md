# Agent prompt — Synapse Topology v1 (Storybook parity)

Use this document as the **primary instruction set** when implementing Topology from the handoff zip.  
**Do not treat `design-spec.md` files as self-executing.** They are contracts. Storybook parity requires **specs + TypeScript contracts + reference source files + theme + icons** read together.

Replace `{FRAMEWORK}` with your target (`Angular`, `React`, `Vue`, `Lit`, …).

---

## 0. What is in the zip (and how to use each layer)

**Principle:** `design-spec.md` files are **framework-agnostic**. Reference React/CSS ships in the zip **only** for Storybook parity — port to `{FRAMEWORK}`, do not embed in specs.

| Layer | Paths | Framework-agnostic? | Your job |
|-------|--------|---------------------|----------|
| **Design specs** | `components/synapse/topology/**/design-spec.md` + embedded library specs | Yes | Structure, tokens, API, validation |
| **Contracts** | `storybook/src/spec-contracts/topology/*.ts` + slider/detail-panel contracts | Yes | **Import constants** — do not guess numbers |
| **Theme** | `components/synapse-theme.css` | Yes | Load **globally** |
| **Reference examples** | `storybook/src/components/topology/**` | No (React) | **Port** CSS/layout/behavior to target framework |
| **Reference deps** | `Button`, `Search`, `Slider`, `Icon`, … (default with reference) | No | Port toolbar/slider chrome |
| **Reference index** | `components/synapse/topology/reference/README.md` | — | File manifest for parity porting |
| **Icons** | `assets/icons/*.svg` (with `--include-icons`) | Yes (assets) | Wire Icon primitive |
| **This prompt** | `AGENT_PROMPT.md` | — | Milestones + reading order |

**Recommended zip command (from SDD-IDS repo root):**

```bash
PYTHONPATH=. python3 scripts/package_component_handoff.py \
  --programme synapse \
  --components Topology \
  --output-dir ./dist \
  --output-name topology-handoff-v1 \
  --include-icons
```

---

## 1. Mental model (read before coding)

Topology is a **composed** component:

```
topology/design-spec.md                    ← composer (toolbar + canvas + edges)
├── node/design-spec.md                    ← TopologyNode
│   └── element/design-spec.md             ← shape shell ONLY (circle / rounded square / pentagon)
├── node-tooltip/design-spec.md            ← hover card (NOT generic Tooltip)
└── group/design-spec.md                   ← optional group frame
```

**Toolbar slots delegate to library components** — do not reinvent from markdown alone:

| Slot | Spec | Reference impl |
|------|------|----------------|
| Search | `components/synapse/search/design-spec.md` | `storybook/src/components/Search.tsx` |
| Zoom slider | `components/synapse/slider/design-spec.md` § viewport | `TopologyZoomSlider.tsx` → `SynapseSliderWithButtons.tsx` |
| Icon buttons | `components/synapse/button/design-spec.md` | `Button.tsx` |
| Filter chip | `components/synapse/tag/design-spec.md` | `TopologyFilterChip.tsx` |
| Filter menu | `components/synapse/dropdown-single-select/design-spec.md` | `TopologyStatusFilter.tsx` → `SynapseDropdownMenu.tsx` |
| Detail panel | `components/synapse/detail-panel/design-spec.md` | `SynapseDetailPanel.tsx` |

**V2 deferred:** Topology Navigation (`55439:49840`) — do **not** implement `showNav`.

---

## 1b. Why a single prompt usually fails

Testing feedback: teams using **one generic prompt** produced partial UI (toolbar skeleton, wrong slider chrome, missing edges) because:

| Gap type | Examples | Fix |
|----------|----------|-----|
| **Specs describe what, not all CSS how** | `z-index`, `top: -2px`, tertiary hover borders | Read § **CSS implementation contracts** in parent `design-spec.md` + port reference `.module.css` |
| **ids-fork / context variants** | Form slider vs viewport slider; secondary vs tertiary buttons | Read **programme deltas** in `synapse/slider/design-spec.md` |
| **Contracts not loaded** | Zoom 0–100 instead of 25–300 | **Must** read `.ts` contract files |
| **Reference not ported** | No edge layer, no pan/zoom | Port `topologyEdgePath.ts`, `Topology.tsx` canvas structure |
| **Scope creep in one pass** | Mixed group + spec-accurate nodes | **Phased milestones** below — one story per phase |
| **Missing features in milestone 1** | Drag, tooltip, detail panel, lazy expand | **Expected** — implement in milestones 2–5, not day one |

**Rule:** One prompt per **milestone**. Do not ask for “full Topology with all stories” in a single agent session.

### CSS contracts agents must copy literally

From parent `design-spec.md` § **CSS implementation contracts** + `node/design-spec.md` § **Z-index stacking**:

- `TopologyNodeMain`: `position: relative`
- Status: `top: -2px`; `right: -6px`; `z-index: 3`
- Badge wrap: `margin-top: -8px`; `z-index: 2`
- Tertiary zoom buttons: `border-color: transparent` → brand border on `:hover`/`:active`
- Slider thumb: `top: 50%`; `transform: translate(-50%, -50%)`; horizontal `%` from value
- Edges: direction **source → target**; filled triangle at **target**; port `topologyEdgePath.ts`

---

## 2. Mandatory reading order

Read **every** file below before writing code. Skipping contracts or reference impl is the main cause of Storybook mismatch.

### Phase A — Contracts (numbers are authoritative)

1. `storybook/src/spec-contracts/topology/synapse-topology.contract.ts`
   - `SYNAPSE_TOPOLOGY_SAMPLE_NODES` / `SYNAPSE_TOPOLOGY_SAMPLE_EDGES` — **first demo only**
   - `SYNAPSE_TOPOLOGY_ZOOM_MIN_PERCENT` (25), `MAX` (300), `STEP` (10)
   - `SYNAPSE_TOPOLOGY_STATUS_ICONS`, status labels
2. `storybook/src/spec-contracts/topology/synapse-topology-element.contract.ts`
   - Nine `elementType` values, shapes, `SYNAPSE_TOPOLOGY_ELEMENT_DEFAULT_ICONS`
3. `storybook/src/spec-contracts/topology/synapse-topology-group.contract.ts` (only for Node Group story)
4. `storybook/src/spec-contracts/topology/synapse-topology-node-tooltip.contract.ts`
5. `storybook/src/spec-contracts/synapse-slider.contract.ts` — viewport dimensions
6. `storybook/src/spec-contracts/topology/synapse-topology.docs-snippets.ts` — integration examples

### Phase B — Design specs (structure + tokens)

1. `components/synapse/topology/design-spec.md` — § Anatomy, § SDD delivery modes (Mode A), § TopologyEdgeLayer, § Developer usage
2. `components/synapse/topology/element/design-spec.md`
3. `components/synapse/topology/node/design-spec.md`
4. `components/synapse/topology/node-tooltip/design-spec.md`
5. Embedded specs referenced in parent § Embedded component specs (search, slider, button, tag, dropdown, detail-panel)
6. For slider: **also** read `components/ids/slider/design-spec.md` for shared thumb/focus — but **viewport rail** follows Synapse § programme deltas (6px pill, not IDS 4px bordered rail)

### Phase C — Reference implementation (behavior + CSS)

1. `storybook/src/components/topology/Topology.tsx` + `Topology.module.css`
2. `TopologyNode.tsx`, `TopologyElementShell.tsx`, `TopologyGroup.tsx`, `TopologyNodeTooltip.tsx`
3. `utils/topologyEdgePath.ts`, `utils/topologyNodeAnchor.ts`, `utils/topologyNodeTooltipPlacement.ts`
4. `TopologyZoomSlider.tsx` → `SynapseSliderWithButtons.tsx` → `SynapseSlider.tsx` → `Slider.tsx`
5. `TopologyLegend.tsx`, `TopologyStatusFilter.tsx`, `TopologyFilterChip.tsx`

---

## 3. Theme (non-negotiable)

Load once at application shell:

```html
<link rel="stylesheet" href="components/synapse-theme.css" />
<div data-design-system="synapse">
  <!-- topology host -->
</div>
```

- **Angular:** add `synapse-theme.css` to `angular.json` `styles` array (global), not only component SCSS.
- Never hardcode Figma hex/px when a `var(--...)` exists in theme CSS.
- Dark mode: `[data-theme="dark"]` on ancestor per theme file.

---

## 4. Milestone 1 — Spec Accurate Design only

Do **not** merge multiple Storybook stories in the first deliverable.

### 4.1 Data fixture (exact)

From `synapse-topology.contract.ts`:

| Node `id` | Label | elementType | x | y | status |
|-----------|-------|-------------|---|---|--------|
| `dc-1` | Datacenter East | datacenter | 180 | 140 | success |
| `cluster-1` | Compute Cluster | cluster | 420 | 160 | warning |
| `host-1` | Host / Compute | hostCompute | 300 | 300 | success |

| Edge `id` | sourceId | targetId | edgeType |
|-----------|----------|----------|----------|
| `e1` | dc-1 | cluster-1 | connectedTo |
| `e2` | cluster-1 | host-1 | dependsOn |

Props: `showFilter=false`, `showLegend=true`, `showMinimap=false`, zoom `100%`.

**Do not** include Compute Group, VM Instance, or App Service in milestone 1.

### 4.2 Canvas architecture

```
TopologyRoot                 ← section; border + radius-4 + surface-2 (see design-spec § TopologyRoot)
  └─ TopologyContentRow      ← flex row when detail panel open
       └─ TopologyLayout     ← padding-24, gap-16 (no outer border here)
            ├─ TopologyToolbar
            ├─ TopologyCanvasViewport     ← clips overflow; pan/zoom handlers
            │    └─ transform layer       ← scale(zoom) translate(panX, panY)
            │         ├─ TopologyEdgeLayer
            │         └─ TopologyNodeLayer
            └─ TopologyCanvasFooter (legend / minimap)
```

**TopologyRoot shell (main container border):**

| Property | Value |
|----------|--------|
| Border | `var(--border-width-border-default)` solid `var(--color-border-light)` |
| Radius | `var(--corner-radius-radius-4)` |
| Background | `var(--color-background-surface-2)` |
| Overflow | `hidden` |

Reference: `Topology.module.css` → `.root`

- Node coordinates are **canvas space** before viewport transform.
- Parent applies pan/zoom on the **layer**, not on individual nodes in screen space.

### 4.3 Edge layer (common failure)

Implement per `topologyEdgePath.ts` + parent § TopologyEdgeLayer:

- Stroke `var(--color-border-accessible)`, width `1.5px`
- `dependsOn`: `stroke-dasharray: 6 4`
- **Filled triangle arrowhead** (7px depth) — not SVG `<marker>` with CSS variables
- Anchors: **horizontal shell intersection** (`topologyNodeAnchor.ts`) — arrow tip must touch node shell (no gap)

### 4.4 Node chrome

Build bottom-up:

1. **TopologyElementShell** — circle / roundedSquare / pentagon per `elementType`
2. **TopologyNode** — status badge, count badge, label chip
3. Do **not** duplicate shell CSS in node or parent

### 4.5 Zoom slider (common failure)

Read `components/synapse/slider/design-spec.md` § **Viewport** and § **Slider with buttons**.

Topology **must** use:

| Property | Value |
|----------|--------|
| `density` | `viewport` |
| `showEdgeLabels` | `false` |
| `min` / `max` | `25` / `300` (from topology contract, not Figma 0–100 sample) |
| `readout` | `` `${value}%` `` live |
| `buttonVariant` | **`tertiary`** (topology toolbar — not default `secondary`) |
| −/+ icons | `ctrl-minimize-16`, `shape-plus` — **mask** variant (not `img` on minus) |

Reference: `TopologyZoomSlider.tsx` lines 19–31.

**Do not** use native `<input type="range">` or Material slider.

### 4.6 Icons

Use slugs from contracts + `assets/icons/<slug>.svg`:

- Element types: `SYNAPSE_TOPOLOGY_ELEMENT_DEFAULT_ICONS`
- Status: `SYNAPSE_TOPOLOGY_STATUS_ICONS`
- Toolbar: `arrow-reset`, `full-screen`, `save-disk`
- Legend: `topology-legend-connected-to.svg`, `topology-legend-depends-on.svg`

If target repo has Synapse `Icon` / `IconService`, **reuse it** — do not draw placeholder lines.

### 4.7 Node tooltip (common failure — M4)

**Not** `components/synapse/tooltip` — use **`TopologyNodeTooltip`** per `node-tooltip/design-spec.md` (`_node-tooltip` / `55439:46060`).

#### DOM placement (required)

```
TopologyCanvasViewport          ← overflow: hidden (clips children)
  └─ canvasLayer                ← transform: translate(pan) scale(zoom); data-topology-canvas-layer
       ├─ edgeLayer
       ├─ nodeLayer
       └─ tooltipLayer          ← z-index: 200; pointer-events: none; position absolute inset 0
            └─ TopologyNodeTooltip  ← position: absolute; left/top in **canvas coordinates**
```

**Do not** portal the tooltip to `document.body` unless you convert screen ↔ canvas coords on every pan/zoom frame.

#### Event flow (parent-owned)

1. **Node** `mouseenter` → `onHoverChange(nodeId, true, nodeRect?)`
2. **Parent** starts **500ms** timer (`SYNAPSE_TOPOLOGY_NODE_TOOLTIP_HOVER_DELAY_MS`)
3. After delay → set `hoveredNodeId` + `hoveredNodeRect`
4. **Parent** renders tooltip; run placement after measure (`useLayoutEffect` pattern in reference)
5. `mouseleave` / node click / count-badge expand → cancel timer + hide

If `nodeRect` is omitted, parent may fall back to `{ x: node.x, y: node.y, width: 44, height: 70 }` — placement will be wrong if label height differs.

#### Positioning

Port `utils/topologyNodeTooltipPlacement.ts`:

| Rule | Value |
|------|--------|
| Card width | `233px` (`SYNAPSE_TOPOLOGY_NODE_TOOLTIP_WIDTH`) |
| Gap from node | `8px` |
| Default placement | Top-center above node |
| Fallback order | `bottom` → `right` → `left` when clipped |
| Viewport bounds | Account for pan/zoom: `getCanvasViewportBounds(viewportEl, scale, translate)` |
| Card | `pointer-events: none` (hover does not “stick” on tooltip) |

Reference uses `visibility: hidden` until first layout measure sets `left`/`top` — avoids a flash at `(0,0)`.

#### Symptom → likely cause

| Symptom | Check |
|---------|--------|
| Nothing appears | `showNodeTooltip` default `true`? `onHoverChange` wired? Wait **full 500ms**? |
| Flash at top-left then gone | Position before measure; missing placement pass |
| Wrong position / drifts on zoom | Tooltip outside transformed layer, or screen coords used as canvas coords |
| Clipped / half hidden | Tooltip rendered outside `canvasLayer` but inside `overflow: hidden` viewport |
| Behind nodes | `tooltipLayer` `z-index: 200` (nodes hover at `10`) |
| Generic popover styling | Wrong component — must match `TopologyNodeTooltip.module.css` (233px, KV columns) |

**Port these files:** `TopologyNodeTooltip.tsx`, `TopologyNodeTooltip.module.css`, `topologyNodeTooltipPlacement.ts`, and parent handlers in `Topology.tsx` (`handleNodeHoverChange`, tooltip `useLayoutEffect`).

---

## 5. Milestone 2+ (only after milestone 1 passes QA)

Do **not** start these until milestone 1 validation table is green.

| Phase | Storybook story | Scope | Key specs / reference |
|-------|-----------------|-------|---------------------|
| **M2** | Element Types | Nine `elementType` shells | `element/design-spec.md`, `SYNAPSE_TOPOLOGY_ELEMENT_TYPE_SAMPLE_NODES` |
| **M3** | Node drag + pan/zoom | Pointer drag nodes; canvas pan; wheel optional | `Topology.tsx` handlers, `TopologyNode.module.css` cursor |
| **M4** | Node tooltip | 500ms hover delay, placement | `node-tooltip/design-spec.md`, `topologyNodeTooltipPlacement.ts` |
| **M5** | Detail Panel | Node click → 398px panel | `detail-panel/design-spec.md`, `SynapseDetailPanel.tsx` |
| **M6** | Node Group | `TopologyGroup` frame | `group/design-spec.md`, group contract |
| **M7** | Expand Next Level | `dataMode=lazy`, `loadChildren` | `topologyExpandGraph.ts`, parent § lazy expand |
| **M8** | With Filter | Status chip + dropdown | tag + dropdown specs, `TopologyStatusFilter.tsx` |

| Story | Extra fixture | Spec |
|-------|---------------|------|
| Element Types | `SYNAPSE_TOPOLOGY_ELEMENT_TYPE_SAMPLE_NODES` | `element/design-spec.md` |
| Node Group | `synapse-topology-group.contract.ts` | `group/design-spec.md` |
| Expand Next Level | `SYNAPSE_TOPOLOGY_EXPAND_ROOT_NODES` + `loadChildren` | parent § lazy expand |
| Detail Panel | `showDetailPanel=true` | `detail-panel/design-spec.md` |
| With Filter | `showFilter=true` | tag + dropdown specs |

---

## 6. Mode B (third-party graph library)

If using React Flow / Cytoscape / etc.:

1. Implement `TopologyGraphAdapter` from `synapse-topology-adapter.contract.ts`
2. Apply node/group/tooltip chrome from child specs at library node positions
3. Library owns layout/routing; specs do **not** define force layout
4. Edges: use `SYNAPSE_TOPOLOGY_GRAPH_EDGE_STYLES`

---

## 7. Validation checklist (self-test before handoff)

| # | Check | Pass criteria |
|---|--------|----------------|
| 1 | Theme | `synapse-theme.css` global + `data-design-system="synapse"` |
| 2 | Sample graph | Exactly 3 nodes, 2 edges (table §4.1) |
| 3 | Edges visible | Solid + dashed with arrowheads, no gap at nodes |
| 4 | Element shapes | datacenter=rounded square, cluster=rounded square, host=circle |
| 5 | Zoom | 25–300%, tertiary −/+, `%` readout |
| 6 | Slider rail | 6px pill viewport rail (not IDS 4px bordered form rail) |
| 7 | Legend | Connected To + Depends On glyphs |
| 8 | Tokens only | No hardcoded colors/spacing where theme token exists |
| 9 | No V2 nav | `showNav` not implemented |
| 10 | Tooltip | 233px card, 500ms hover delay — **not** generic Tooltip (milestone 4) |
| 11 | Node CSS | `main` relative; status `top:-2px` `right:-6px` `z-index:3`; badge `margin-top:-8px` `z-index:2` |
| 12 | Tertiary zoom | Transparent button border default; brand border on hover |
| 13 | Slider thumb | Vertical `top:50%` + `translate(-50%,-50%)` — not fixed px |
| 14 | Edge direction | Arrow at **target**; `sourceId` → `targetId` |

---

## 8. What NOT to do

- ❌ Read only `.md` files and ignore `.ts` contracts
- ❌ Regenerate Search/Slider/Button from prose when reference `.tsx` is in the zip
- ❌ Use generic HTML range input for zoom
- ❌ Use `buttonVariant="secondary"` for topology zoom (bordered Figma default)
- ❌ Merge Node Group + Spec Accurate nodes in one demo
- ❌ Implement edges as div borders or omit edge layer
- ❌ Use `components/synapse/tooltip` for node hover
- ❌ Invent icon placeholders when SVG slugs are in the zip

---

## 9. Full agent task prompt (copy-paste)

```text
Task: Implement Synapse Topology v1 in {FRAMEWORK} to match Storybook "Spec Accurate Design".

Package: handoff zip (specs + contracts + reference impl). Read AGENT_PROMPT.md first.

Step 1 — Read (do not skip):
- components/synapse/topology/AGENT_PROMPT.md (this file)
- storybook/src/spec-contracts/topology/synapse-topology.contract.ts
- storybook/src/spec-contracts/topology/synapse-topology-element.contract.ts
- storybook/src/spec-contracts/synapse-slider.contract.ts
- components/synapse/topology/design-spec.md (§ Developer usage, § TopologyEdgeLayer)
- components/synapse/topology/node/design-spec.md
- components/synapse/topology/element/design-spec.md
- components/synapse/slider/design-spec.md (§ Viewport + § Slider with buttons + buttonVariant tertiary for topology)

Step 2 — Port reference behavior to {FRAMEWORK}:
- storybook/src/components/topology/Topology.tsx + Topology.module.css
- TopologyNode.tsx, TopologyElementShell.tsx
- utils/topologyEdgePath.ts, utils/topologyNodeAnchor.ts
- TopologyZoomSlider.tsx → SynapseSliderWithButtons.tsx (buttonVariant=tertiary, zoom 25-300)

Step 3 — Theme:
- Load components/synapse-theme.css globally
- Root wrapper: data-design-system="synapse"

Step 4 — Milestone 1 demo ONLY:
- SYNAPSE_TOPOLOGY_SAMPLE_NODES (3 nodes) + SYNAPSE_TOPOLOGY_SAMPLE_EDGES (2 edges)
- showFilter=false, showLegend=true, showMinimap=false
- SVG edge layer below nodes; filled arrowheads; anchor at horizontal shell intersection

Step 5 — Library slots:
- Reuse existing Synapse {FRAMEWORK} Search/Slider/Button if available in target repo
- Otherwise port from storybook/src/components/ reference deps in zip
- Wire icons from assets/icons/ using contract slugs

Step 6 — Self-check against AGENT_PROMPT.md §7 validation table.

Out of scope: Topology Navigation (V2), showNav.

Output:
1. File tree of created components
2. How theme is loaded
3. Screenshot or description vs validation checklist
4. List of any spec ambiguities — do not silently guess
```

---

## 10. Parity debugging

If output looks like “boxes floating with no edges”:

1. **Edges:** Is `edges` array passed? Do `sourceId`/`targetId` match node `id`? Is SVG edge layer rendered **below** nodes?
2. **Layout:** Are nodes `position:absolute` with contract `x`/`y` inside transformed layer?
3. **Theme:** Is `synapse-theme.css` global? Inspect computed styles for empty CSS variables.
4. **Icons:** Are SVG files on disk for each `shapeName` slug?
5. **Slider:** Is `buttonVariant` tertiary? Is domain 25–300 not 0–100?
6. **Data:** Did you accidentally merge group/expand story nodes?

Reference ground truth: Storybook path `Spec Generated → Synapse → Topology → Spec Accurate Design` in the SDD-IDS monorepo.
