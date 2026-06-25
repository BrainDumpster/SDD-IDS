# Topology reference layer (handoff zip only)

Design specs under `components/synapse/topology/` stay **framework-agnostic** (anatomy, tokens, API, validation).

**Reference examples** ship in the handoff zip at their Storybook paths — for visual/behavior parity only. Recipients **port** these to their target framework; they are not part of the spec markdown.

## Handoff model

| Layer | In zip? | Purpose |
|-------|---------|---------|
| `design-spec.md` + child specs | Yes | Contract — what to build |
| `storybook/src/spec-contracts/topology/*.ts` | Yes | Numbers, types, sample data |
| `components/synapse-theme.css` | Yes | Tokens (`var(--...)`) |
| `storybook/src/components/topology/**` | Yes (recommended) | Golden React reference |
| Shared deps (`Button`, `Slider`, `Search`, …) | Yes with `--include-reference-deps` | Toolbar/slider parity |
| `assets/icons/*.svg` | Yes with `--include-icons` | Icon slugs |
| `AGENT_PROMPT.md` | Yes | Agent reading order + milestones |

**Not in spec files:** React/TS/CSS implementation details beyond summary tables (§ CSS implementation contracts in parent spec lists critical values; full rules live in reference CSS below).

## Package command (parity handoff)

```bash
PYTHONPATH=. python3 scripts/package_component_handoff.py \
  --programme synapse \
  --components Topology \
  --output-dir ./dist \
  --output-name topology-handoff-v1 \
  --include-reference-deps \
  --include-icons
```

## Reference file index (Storybook parity)

### Topology composer

| Role | TypeScript | Stylesheet |
|------|------------|------------|
| Root canvas | `storybook/src/components/topology/Topology.tsx` | `Topology.module.css` |
| Node | `TopologyNode.tsx` | `TopologyNode.module.css` |
| Element shell | `TopologyElementShell.tsx` | `TopologyElementShell.module.css` |
| Group | `TopologyGroup.tsx` | `TopologyGroup.module.css` |
| Node tooltip | `TopologyNodeTooltip.tsx` | `TopologyNodeTooltip.module.css` |
| Zoom cluster | `TopologyZoomSlider.tsx` | — (delegates to slider deps) |
| Filter chip | `TopologyFilterChip.tsx` | `TopologyFilterChip.module.css` |
| Add filter | `TopologyAddFilterButton.tsx` | `TopologyAddFilterButton.module.css` |
| Legend | `TopologyLegend.tsx` | `TopologyLegend.module.css` |
| Status filter | `TopologyStatusFilter.tsx` | — |

### Behavior utilities (port logic, not only CSS)

| File | Topic |
|------|--------|
| `utils/topologyEdgePath.ts` | Edge paths + filled arrowheads (source → target) |
| `utils/topologyNodeAnchor.ts` | Shell intersection anchors |
| `utils/topologyNodeTooltipPlacement.ts` | Hover delay + placement |
| `utils/topologyExpandGraph.ts` | Lazy expand / collapse |

### Shared toolbar / slider (with `--include-reference-deps`)

| Role | TypeScript | Stylesheet |
|------|------------|------------|
| Search | `storybook/src/components/Search.tsx` | `Search.module.css` |
| Button (tertiary) | `Button.tsx` | `Button.module.css` |
| Slider + viewport | `Slider.tsx`, `SynapseSlider.tsx` | `Slider.module.css` (`[data-density="viewport"]`) |
| Slider with buttons | `SynapseSliderWithButtons.tsx` | `SynapseSliderWithButtons.module.css` |
| Detail panel | `SynapseDetailPanel.tsx` | `SynapseDetailPanel.module.css` |
| Dropdown | `SynapseDropdownMenu.tsx` → `DropdownMenu.tsx` | matching `.module.css` |
| Icon | `Icon.tsx` | `Icon.module.css` |

### Stories (QA baseline names)

| Story | File |
|-------|------|
| Spec Accurate Design | `SynapseTopology.stories.tsx` |
| Element Types | `SynapseTopologyElement.stories.tsx` |

## Porting rules (Angular / Vue / Lit / …)

1. **Specs** define structure and tokens — use `var(--...)` from `synapse-theme.css`.
2. **Reference CSS** defines layout, z-index, positioning, interaction — re-express in target framework styles (e.g. Angular component SCSS), same property values.
3. **Do not** embed reference CSS into design-spec markdown.
4. **Do not** treat reference TSX as the only API — follow Composition & API sections in specs + contracts.
5. Compare milestone output to Storybook **Spec Accurate Design** before later milestones.

See [`../AGENT_PROMPT.md`](../AGENT_PROMPT.md) for phased agent instructions.
