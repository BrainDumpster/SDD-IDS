# Synapse Topology — V1 handoff

Framework-agnostic design contract and optional **reference examples** (React/Storybook) for parity checking.

## Handoff model (spec vs reference)

| Layer | Location | Framework-agnostic? |
|-------|----------|---------------------|
| **Spec** | `design-spec.md` + child specs | **Yes** — anatomy, tokens, API, validation |
| **Contracts** | `storybook/src/spec-contracts/topology/*.ts` | **Yes** — types & constants |
| **Theme** | `components/synapse-theme.css` | **Yes** — `var(--...)` tokens |
| **Reference examples** | `storybook/src/components/topology/**` (+ deps in zip) | **No** — React/CSS golden master; **port**, do not paste into spec |

Specs stay free of implementation code. Reference TS/CSS ships **only in the handoff zip** (not duplicated inside markdown). Index: [`reference/README.md`](./reference/README.md).

**Parity zip (recommended for Devin / external teams):**

```bash
PYTHONPATH=. python3 scripts/package_component_handoff.py \
  --programme synapse \
  --components Topology \
  --output-dir ./dist \
  --output-name topology-handoff-v1 \
  --include-icons
```

Agent instructions: [`AGENT_PROMPT.md`](./AGENT_PROMPT.md) — read first; one milestone per session.

**V1 scope:** composed canvas + child element specs. **V2 deferred:** left **Topology Navigation** (`55439:49840`) — no `navigation/design-spec.md`; do not implement `showNav` in v1.

## Quick start

| Goal | Start here |
|---|---|
| Full feature (matches Storybook) | [Mode A](#mode-a--composed-canvas) + [`design-spec.md`](./design-spec.md) |
| Third-party graph library (React Flow, Cytoscape, …) | [Mode B](#mode-b--à-la-carte-with-graph-library) + [`synapse-topology-adapter.contract.ts`](../../../storybook/src/spec-contracts/topology/synapse-topology-adapter.contract.ts) |
| Single chrome piece only | Child spec under this folder (`node/`, `element/`, `group/`, `node-tooltip/`) |
| Visual QA baseline | Storybook **`Spec Generated → Synapse → Topology → Spec Accurate Design`** |

Demo behavior reference: [Common Topology WIP](https://craft-level-03601619.figma.site/)

---

## Source of truth

| Artifact | Path |
|---|---|
| Parent design spec (composer) | [`design-spec.md`](./design-spec.md) |
| Node chrome | [`node/design-spec.md`](./node/design-spec.md) |
| Element shell (shape + icon) | [`element/design-spec.md`](./element/design-spec.md) |
| Group frame | [`group/design-spec.md`](./group/design-spec.md) |
| Node hover / info card | [`node-tooltip/design-spec.md`](./node-tooltip/design-spec.md) — **not** generic [`tooltip`](../tooltip/design-spec.md) |
| Global theme (required) | [`components/synapse-theme.css`](../../synapse-theme.css) |
| Figma map entry | `data/synapse-component-figma-map.json` → `"component": "Topology"` |
| Figma file | `Td1bnsvRj1PCGs9RVJkIvJ` — page layout `54009:293109` |

### SDD hierarchy

```
topology/design-spec.md          ← canvas + toolbar + edges + delivery modes
├── node/design-spec.md
│   └── element/design-spec.md   ← shell geometry only; do not duplicate in node/parent CSS
├── node-tooltip/design-spec.md
└── group/design-spec.md
```

---

## Delivery package (files to ship)

Assume recipients get **only** the paths below (not the full monorepo). Paths are relative to the repository root.

### 1. Required — design specs (always)

| Path | Role |
|---|---|
| `components/synapse/topology/README.md` | This handoff doc |
| `components/synapse/topology/design-spec.md` | Parent composer spec |
| `components/synapse/topology/node/design-spec.md` | `TopologyNode` |
| `components/synapse/topology/element/design-spec.md` | `TopologyElementShell` |
| `components/synapse/topology/group/design-spec.md` | `TopologyGroup` |
| `components/synapse/topology/node-tooltip/design-spec.md` | `TopologyNodeTooltip` |
| `components/synapse-theme.css` | Semantic tokens (`var(--...)`) for light + dark |

### 2. Required — data contracts (framework-agnostic TypeScript)

Portable types, sample graphs, and constants. Implementers may translate to their language; shapes must match.

| Path | Role |
|---|---|
| `storybook/src/spec-contracts/topology/synapse-topology.contract.ts` | `TopologyNodeData`, `TopologyEdgeData`, sample nodes/edges, zoom/filter constants |
| `storybook/src/spec-contracts/topology/synapse-topology-element.contract.ts` | Nine element types, shapes, default icon slugs, Figma node ids |
| `storybook/src/spec-contracts/topology/synapse-topology-group.contract.ts` | `TopologyGroupData`, group sample |
| `storybook/src/spec-contracts/topology/synapse-topology-node-tooltip.contract.ts` | Tooltip dimensions, hover delay, row model |
| `storybook/src/spec-contracts/topology/synapse-topology-adapter.contract.ts` | Mode B `TopologyGraphAdapter`, edge styles, `SYNAPSE_TOPOLOGY_MODE_B_SPEC_PATHS` |
| `storybook/src/spec-contracts/topology/synapse-topology.docs-snippets.ts` | Copy-paste integration examples (Docs tab source) |

### 3. Required for Mode A — embedded library specs

Toolbar and detail panel **must** reuse these specs (no duplicated Search/Slider/Button CSS in topology).

| Path | Topology slot |
|---|---|
| `components/synapse/search/design-spec.md` | `TopologySearchSlot` |
| `components/synapse/slider/design-spec.md` | Zoom slider (−/+ stepper, viewport density) |
| `components/synapse/button/design-spec.md` | Toolbar icon actions (reset, fullscreen, save) |
| `components/synapse/tag/design-spec.md` | Status filter chip |
| `components/synapse/dropdown-single-select/design-spec.md` | Status filter menu |
| `components/synapse/detail-panel/design-spec.md` | Node-click side panel (`attachMode="topology"`) |
| `storybook/src/spec-contracts/synapse-slider.contract.ts` | Slider viewport variant constants (zoom host) |
| `storybook/src/spec-contracts/synapse-detail-panel.contract.ts` | Detail panel row model + topology attach constants |

### 4. Recommended — reference implementation (React / Storybook)

Working examples that satisfy the validation checklist. Use for visual diff, not as the only allowed stack.

| Path | Role |
|---|---|
| `storybook/src/components/topology/Topology.tsx` | Mode A root component |
| `storybook/src/components/topology/Topology.module.css` | Canvas, toolbar, edges |
| `storybook/src/components/topology/TopologyNode.tsx` | Node chrome |
| `storybook/src/components/topology/TopologyNode.module.css` | |
| `storybook/src/components/topology/TopologyElementShell.tsx` | Element shells |
| `storybook/src/components/topology/TopologyElementShell.module.css` | |
| `storybook/src/components/topology/TopologyGroup.tsx` | Group frame |
| `storybook/src/components/topology/TopologyGroup.module.css` | |
| `storybook/src/components/topology/TopologyNodeTooltip.tsx` | Hover card |
| `storybook/src/components/topology/TopologyNodeTooltip.module.css` | |
| `storybook/src/components/topology/TopologyZoomSlider.tsx` | Slider delegate |
| `storybook/src/components/topology/TopologyLegend.tsx` | Edge legend |
| `storybook/src/components/topology/TopologyLegend.module.css` | |
| `storybook/src/components/topology/TopologyFilterChip.tsx` | Filter chip |
| `storybook/src/components/topology/TopologyFilterChip.module.css` | |
| `storybook/src/components/topology/TopologyAddFilterButton.tsx` | Add Filter CTA |
| `storybook/src/components/topology/TopologyAddFilterButton.module.css` | |
| `storybook/src/components/topology/TopologyStatusFilter.tsx` | Filter + dropdown wiring |
| `storybook/src/components/topology/utils/topologyEdgePath.ts` | Edge path + arrowhead geometry |
| `storybook/src/components/topology/utils/topologyNodeAnchor.ts` | Horizontal shell intersection anchors |
| `storybook/src/components/topology/utils/topologyNodeTooltipPlacement.ts` | Tooltip placement + 500ms delay |
| `storybook/src/components/topology/utils/topologyExpandGraph.ts` | Lazy expand / collapse |
| `storybook/src/components/topology/SynapseTopology.stories.tsx` | Stories: Spec Accurate, filters, expand, detail panel |
| `storybook/src/components/topology/SynapseTopologyElement.stories.tsx` | All nine element types |

**Behavioral tests (optional but precise):**

- `storybook/src/components/topology/utils/topologyEdgePath.test.ts`
- `storybook/src/components/topology/utils/topologyNodeTooltipPlacement.test.ts`
- `storybook/src/components/topology/utils/topologyExpandGraph.test.ts`

### 5. Assets

Reference React code expects an icon system with `shapeName` slugs. Deliver either your existing Synapse icon bundle or document slug → SVG mapping.

| Asset | Used for |
|---|---|
| `assets/icons/topology-legend-connected-to.svg` | Legend “Connected To” |
| `assets/icons/topology-legend-depends-on.svg` | Legend “Depends On” |
| Icon slugs from `SYNAPSE_TOPOLOGY_ELEMENT_DEFAULT_ICONS` | Element shells |
| Icon slugs from `SYNAPSE_TOPOLOGY_STATUS_ICONS` | Status badges + tooltip |
| Toolbar: `arrow-reset`, `full-screen`, `save-disk`, `ctrl-minimize-16` | Viewport controls |
| Filter: `arrow-drop-tri-caret`, `state-add-circ-solid` | Filter chip + Add Filter |
| Group: `cluster-badge`, `info-circ`, `minimize`, `ctrl-minimize-16` | Group chrome |

### 6. Optional context

| Path | Role |
|---|---|
| `data/synapse-component-figma-map.json` | Figma node ids for live verification (Topology entry only is enough) |

### Suggested zip layout

```
topology-handoff-v1/
├── README.md                          ← copy of this file
├── components/
│   ├── synapse-theme.css
│   └── synapse/
│       ├── topology/                  ← all design-spec.md files
│       ├── search/design-spec.md
│       ├── slider/design-spec.md
│       ├── button/design-spec.md
│       ├── tag/design-spec.md
│       ├── dropdown-single-select/design-spec.md
│       └── detail-panel/design-spec.md
├── contracts/
│   └── topology/                      ← all synapse-topology*.contract.ts + docs-snippets
├── reference/                         ← optional React Storybook sources
│   └── topology/
└── data/
    └── synapse-topology-figma-map.json  ← excerpt or full map
```

---

## Delivery modes

### Mode A — Composed canvas

**Audience:** Team shipping the full Topology feature (Storybook parity).

**Primary artifacts:** `design-spec.md` + `synapse-topology.contract.ts` + library specs (§3) + optional `reference/topology/`.

**Outcome:** One root component — toolbar, SVG viewport, edges, legend, optional detail panel — delegating node/group/tooltip chrome to child specs.

### Mode B — À la carte with graph library

**Audience:** Team using React Flow, Cytoscape, or another layout/routing engine.

**Primary artifacts:** Child specs + `synapse-topology-adapter.contract.ts` + `synapse-theme.css`. Parent spec § `TopologyEdgeLayer` for edge stroke/dash/arrowhead only.

**Outcome:** Implement `TopologyGraphAdapter`; render Synapse chrome in library node slots. **Do not** require `Topology.tsx`.

Spec paths enum: `SYNAPSE_TOPOLOGY_MODE_B_SPEC_PATHS` in the adapter contract.

---

## Agent prompts (copy-paste)

**Primary instruction set:** [`AGENT_PROMPT.md`](./AGENT_PROMPT.md) — detailed reading order, milestones, slider/edge/icon rules, validation checklist, and full copy-paste task for Devin or other agents.

**Give agents the zip built with reference deps + icons:**

```bash
PYTHONPATH=. python3 scripts/package_component_handoff.py \
  --programme synapse \
  --components Topology \
  --output-dir ./dist \
  --output-name topology-handoff-v1 \
  --include-icons
```

Tell the agent: **“Read `components/synapse/topology/AGENT_PROMPT.md` first, then follow §9 task prompt.”**

### Short prompts (if AGENT_PROMPT.md is in the zip)

Replace `{FRAMEWORK}` (`React`, `Angular`, `Vue`, `Lit`, …), `{MODE}` (`A` or `B`), and `{GRAPH_LIBRARY}` when applicable.

### Prompt — Mode A (full Topology)

```text
Implement Synapse Topology v1 in {FRAMEWORK} from the attached handoff package only.

Source of truth (read in order):
1. components/synapse/topology/design-spec.md — parent composer; follow § SDD delivery modes (Mode A)
2. Child specs: node/, element/, group/, node-tooltip/ under components/synapse/topology/
3. contracts/topology/synapse-topology.contract.ts — data types and SYNAPSE_TOPOLOGY_SAMPLE_* fixtures
4. Embedded library specs: search, slider, button, tag, dropdown-single-select, detail-panel
5. components/synapse-theme.css — all colors/spacing/typography via var(--token); never hardcode hex/px from Figma

Reference (behavior + layout, adapt to {FRAMEWORK}):
- reference/topology/Topology.tsx and sibling modules if provided
- contracts/topology/synapse-topology.docs-snippets.ts

Hard constraints:
- Load synapse-theme.css once; root wrapper data-design-system="synapse"
- TopologyNodeTooltip is topology-specific (node-tooltip spec) — NOT generic Tooltip
- Element shell CSS lives only in element spec; do not duplicate in node or parent
- Edges: SVG paths with explicit filled arrowheads; anchors at horizontal shell intersection (see topologyEdgePath + topologyNodeAnchor reference)
- Toolbar controls reuse library Search/Slider/Button/Tag/Dropdown — no duplicated control CSS
- Layout: width/height 100% of parent; page 1600×900 is sample-only
- dataMode eager (full graph) and lazy (loadChildren on badge expand) both required
- showNav / Topology Navigation is V2 — do not implement

Deliverables:
1. {FRAMEWORK} components matching anatomy slot order in design-spec.md
2. Working demo using SYNAPSE_TOPOLOGY_SAMPLE_NODES and SYNAPSE_TOPOLOGY_SAMPLE_EDGES
3. Optional stories: Spec Accurate Design, Element Types (9 shapes), Expand Next Level, Detail Panel on node click
4. Self-check against Validation checklist in design-spec.md § Codegen Contract

Ask before inventing: unknown elementType, missing icon slug, or ambiguous token → flag; do not guess colors.
```

### Prompt — Mode B (graph library + Synapse chrome)

```text
Integrate {GRAPH_LIBRARY} with Synapse Topology v1 chrome in {FRAMEWORK} using the attached handoff package only.

Source of truth:
1. contracts/topology/synapse-topology-adapter.contract.ts — implement TopologyGraphAdapter
2. SYNAPSE_TOPOLOGY_MODE_B_SPEC_PATHS — load every listed design-spec.md
3. components/synapse-theme.css + data-design-system="synapse" on root
4. Parent design-spec.md § Element: TopologyEdgeLayer — edge stroke, dash (dependsOn), arrowhead depth 7px
5. Do NOT require or port Topology.tsx — library owns layout, pan, zoom, and routing

Implement:
- TopologyGraphAdapter mapping library nodes/edges to TopologyNodeData / TopologyEdgeData
- Node slot: TopologyNode per node/design-spec.md (element shell from element/design-spec.md)
- Hover: TopologyNodeTooltip per node-tooltip/design-spec.md (500ms delay, placement fallback top→bottom→right→left)
- Optional groups: TopologyGroup per group/design-spec.md
- Edge styles from SYNAPSE_TOPOLOGY_GRAPH_EDGE_STYLES

Reference utilities (port logic, not necessarily file names):
- topologyNodeAnchor — horizontal shell intersection for arrow endpoints
- topologyEdgePath — path + filled triangle arrowhead

Hard constraints:
- Coordinates: node x/y are graph-owned; specs do not define force layout
- No generic Tooltip component for node hover
- No Topology Navigation (V2 deferred)
- CSS variables only for visual tokens

Deliverables:
1. Adapter interface + {GRAPH_LIBRARY} bridge
2. Demo graph equivalent to SYNAPSE_TOPOLOGY_SAMPLE_NODES / SAMPLE_EDGES
3. Brief matrix: which adapter methods map to which library APIs
```

### Prompt — Single child component

```text
Implement Synapse {COMPONENT} for Topology v1 in {FRAMEWORK} from:
- components/synapse/topology/{slug}/design-spec.md
- contracts/topology/synapse-topology-{slug}.contract.ts (if present)
- components/synapse-theme.css

{COMPONENT} is one of: TopologyNode, TopologyElementShell, TopologyGroup, TopologyNodeTooltip.

If TopologyNode: compose TopologyElementShell internally; do not inline shell geometry CSS.
If TopologyNodeTooltip: 233px card, KV rows, no pointer arrow — not generic Tooltip.

Provide: component, styles using var(--...), and a minimal demo fixture from the contract file.
Match Validation checklist in the child spec's Codegen Contract section.
```

### Prompt — Visual parity check

```text
Compare my {FRAMEWORK} Topology implementation against the Synapse v1 handoff package.

Inputs:
- My code: [paths or paste]
- Reference: reference/topology/ (if available) or design-spec.md Validation checklist

Check:
1. Toolbar variants showFilter true/false (Figma 53993:290064 / 53993:290234)
2. Viewport controls: slider 25–300%, −/+ tertiary buttons, % label, reset/fullscreen/save icons
3. Legend: Connected To (solid) + Depends On (dashed) with correct arrow glyphs
4. Edges: arrow tip touches node shell (no gap); dependsOn uses stroke-dasharray 6 4
5. Node statuses and nine element types match element board 52497:196934
6. Node tooltip: 233px, 500ms hover delay, placement rules
7. Detail panel: 398px, attachMode topology, sibling flex layout when open
8. Theme tokens only — list any hardcoded color/spacing violations

Output: pass/fail table per checklist item with spec section citations and suggested fixes.
```

---

## Framework-agnostic codegen (reading order)

Read [`design-spec.md`](./design-spec.md) sections in this order:

1. **Metadata** + **SDD package hierarchy** + **V2 deferred scope**
2. **Anatomy** — deterministic slot order
3. **Layout & Measurements** — including **Slot geometry (Figma-verified)** tables
4. **States (Light Theme)** — dark uses same semantic tokens unless spec says otherwise
5. **Interactions** + **Composition & API (runtime)** — including **SDD delivery modes**
6. **Codegen Contract** — per-slot style, behavior, accessibility, validation checklist
7. **Developer usage (Spec Accurate Design)** — integration and sample data

For Mode B, child specs replace most of §6 for node/group/tooltip; parent § `TopologyEdgeLayer` remains authoritative for edges.

---

## Theme and wrapper

```html
<!-- Load once at app shell -->
<link rel="stylesheet" href="path/to/synapse-theme.css" />
<div data-design-system="synapse">
  <!-- Topology root -->
</div>
```

Dark theme: `[data-theme="dark"]` on an ancestor or `.synapse-theme-dark` per theme CSS.

---

## Reference implementation (Storybook)

| Item | Location |
|---|---|
| Storybook path | **Spec Generated → Synapse → Topology** |
| Canonical story | **Spec Accurate Design** |
| Story source | `storybook/src/components/topology/SynapseTopology.stories.tsx` |
| Docs snippets | `storybook/src/spec-contracts/topology/synapse-topology.docs-snippets.ts` |

```bash
cd storybook && npm run dev
# open Spec Generated / Synapse / Topology / Spec Accurate Design
```

Stories to mirror for QA:

| Story | Exercises |
|---|---|
| Spec Accurate Design | Default 3-node graph, toolbar, legend, edges |
| Element Types | All nine `TopologyElementType` shells |
| Node Group | `TopologyGroup` + minimize/info actions |
| Expand Next Level | `dataMode=lazy`, `loadChildren` |
| Detail Panel / Node Click | `SynapseDetailPanel` topology attach |
| With Filter | Status filter chip + dropdown |

---

## Out of scope (V2)

| Item | Figma | v1 action |
|---|---|---|
| Topology Navigation (`TopologyNavSlot`) | `55439:49840` | Do not implement; `showNav` reserved |
| `navigation/design-spec.md` | — | Not included in handoff |

---

## Packaging a handoff zip

From the repository root:

```bash
PYTHONPATH=. python3 scripts/package_component_handoff.py \
  --programme synapse \
  --components Topology \
  --output-dir ./dist \
  --output-name topology-handoff-v1 \
  --include-icons
```

| Flag | Description |
|---|---|
| `-p` / `--programme` | Design system id: `synapse`, `ids`, or `dap` |
| `-c` / `--components` | Comma-separated names or slugs (`Topology`, `topology`, `Data Grid,Button`) |
| `-o` / `--output-dir` | Directory for the output zip |
| `-n` / `--output-name` | Zip base name **without** `.zip` |
| `--skip-reference-deps` | Component reference only — omit transitive Button, Search, Slider, Icon, … |
| `--include-icons` | **Recommended** — `assets/icons/*.svg` slugs referenced by packaged sources |
| `--dry-run` | List resolved files without writing the zip |
| `--skip-reference` | Omit Storybook `storybook/src/components/<slug>/` sources |
| `--skip-tests` | Omit `*.test.ts` from reference sources |

### Storybook parity bundle

| Flag combo | Use when |
|---|---|
| Default (specs + contracts + theme + reference + deps) | **Standard parity handoff** for any component |
| `--include-icons` | Adds icon SVG assets referenced by contracts/reference |
| `--skip-reference` | Blueprint-only — specs and contracts, no Storybook sources |
| `--skip-reference-deps` | Reference folder/files for target component only |
| `+ reference/README.md` | Included in component folder — index of TS/CSS paths |

Specs remain framework-agnostic. Reference React/CSS is **not** copied into `design-spec.md`.

The script collects:

- Component spec tree (`design-spec.md`, `README.md`, child specs)
- Programme theme CSS (+ baseline theme when configured)
- Spec contracts under `storybook/src/spec-contracts/<slug>/`
- Embedded specs/contracts/assets referenced from those markdown files
- Optional React reference implementation + shared Storybook deps (included by default; `--skip-reference-deps` to omit)
- Icon SVGs (with `--include-icons`)
- `AGENT_PROMPT.md` when present in component folder
- `HANDOFF_MANIFEST.json` + figma-map excerpt inside the zip

---

## Related links

| Resource | URL / path |
|---|---|
| Design spec | [`design-spec.md`](./design-spec.md) |
| Adapter contract | [`synapse-topology-adapter.contract.ts`](../../../storybook/src/spec-contracts/topology/synapse-topology-adapter.contract.ts) |
| Demo site | https://craft-level-03601619.figma.site/ |
| Figma page layout | `54009:293109` in file `Td1bnsvRj1PCGs9RVJkIvJ` |
