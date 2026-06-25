# Topology Element Design Spec

## Metadata

| Property | Value |
|---|---|
| Component | Topology Element (`.Topology Element`) |
| Design system | Synapse |
| Category | Components |
| Spec pattern | **standalone** |
| Status | **active** |
| Version | 1.1.0 |
| Created | 2026-06-22 |
| Updated | 2026-06-23 |
| Description | Typed shape containers for topology canvas nodes — circle, rounded square, and pentagon shells with centered icons |
| Figma URL | https://www.figma.com/design/Td1bnsvRj1PCGs9RVJkIvJ/Synapse-Hi-Fi-components?node-id=52497-196934&m=dev |
| File key | `Td1bnsvRj1PCGs9RVJkIvJ` |
| Board frame | `52497:196934` (`.Topology Element`) |
| Theme CSS | `components/synapse-theme.css` |
| Verification method | Figma MCP |
| Last verified | 2026-06-23 |
| Parent consumer | [`components/synapse/topology/node/design-spec.md`](../node/design-spec.md) → `TopologyNodeElement` slot |

### Live verification evidence

| Check | Node(s) | Method |
|---|---|---|
| Type × state matrix board | `52497:196934` | Figma MCP `get_metadata` |
| General default / hover / selected | `52497:196935`, `53470:228409`, `52497:196963` | `get_design_context` + `get_variable_defs` |
| Cluster hover outline (rounded) | `53470:228412` | `get_design_context` |
| Datacenter hover outline | `53470:228415` | `get_design_context` |
| Hypervisor pentagon default / hover | `52497:196949`, `53470:228405` | `get_design_context` |
| Application/Service violet default border | `52497:198317` | `get_design_context` |
| Host / Compute icon | `52497:197088` | `get_design_context` |
| VM icon | `54153:279997` | `get_design_context` |

## Anatomy

Deterministic slot order:

1. **`TopologyElementFrame`** — layout box (`44×44` circle/rounded; `48×48` pentagon); optional drop shadow on hover/selected.
2. **`TopologyElementHoverOutline`** (hover only, not selected) — shape-matched outer ring, `4px` offset from shell.
3. **`TopologyElementShell`** — filled container with border and centered icon slot.
4. **`TopologyElementIcon`** — `20×20px` shared `Icon` primitive.

## Layout & Measurements

### Element type → container geometry

| `elementType` | Figma type label | Container shape | Shell size | Shell radius / path | Default icon slug | Figma default node |
|---|---|---|---|---|---|---|
| `general` | General | circle | `44×44` | `var(--corner-radius-radius-round)` | `objects-square` | `52497:196935` |
| `hostCompute` | Host / Compute | circle | `44×44` | round | `device-server-13g` | `52497:197088` |
| `hostStorage` | Host / Storage | circle | `44×44` | round | `storage-array` | `52497:198267` |
| `hostNetwork` | Host / Network | circle | `44×44` | round | `device-switch-blade` | `52497:198289` |
| `vm` | VM | circle | `44×44` | round | `app-group-vm` | `54153:279997` |
| `applicationService` | Application/Service | circle | `44×44` | round | `app-window` | `52497:198317` |
| `cluster` | Cluster | rounded square | `44×44` | `var(--corner-radius-radius-8)` | `cluster-badge` | `52497:197085` |
| `datacenter` | Datacenter | rounded square | `44×44` | `var(--corner-radius-radius-8)` | `data-center-front` | `52497:197044` |
| `hypervisor` | Hypervisor | pentagon | `48×48` clip shell | `polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)` | `virtual-machine` | `52497:196949` |

**Icon slot:** `var(--sizing-size-20)` centered in shell.

### Hover outline geometry (shape-matched)

| Shell shape | Outline size | Offset from shell | Outline radius / path |
|---|---|---|---|
| circle | `52×52` | `4px` on all sides (`left/top: -4px`) | `var(--corner-radius-radius-round)` |
| rounded square | `52×52` | `4px` on all sides | `var(--corner-radius-radius-12)` — **larger than shell `radius-8`** per Figma `53470:228412` |
| pentagon | `58×58` | centered on `48×48` shell (`5px` gap) | same pentagon `clip-path` as shell |

**Codegen rule:** Hover outline is a **sibling** behind the shell; it must not change layout box size (outline overflows absolutely).

### Slot geometry (Figma-verified)

| Slot / layer | Property | Token / contract | Figma node | Live evidence |
|---|---|---|---|---|
| General `Object` | border-radius | `var(--corner-radius-radius-round)` | `52497:196937` | `get_design_context` `52497:196935` |
| General `Object` | border (default) | `1px` `var(--color-icon-accessible)` | `52497:196937` | `get_variable_defs` |
| Cluster `Object` | border-radius | `var(--corner-radius-radius-8)` | `52497:197086` | `get_design_context` `52497:197085` |
| Cluster `Hover` outline | size / offset | `52×52` at `-4px`; `radius-12` | `54474:142194` | `get_design_context` `53470:228412` |
| Hypervisor shell | polygon frame | `48×48` | `52497:196951` | `get_design_context` `52497:196949` |
| Hypervisor hover | polygon outline | `58×58` centered | `54466:142137` | `get_design_context` `53470:228405` |

## Tokens

### Shell (default)

| Role | Token |
|---|---|
| Background | `var(--color-background-surface-2)` |
| Border | `var(--border-width-border-default)` `var(--color-icon-accessible)` |
| Application/Service default border accent | `var(--color-border-violet-base-strong)` |

### Shell (hover — not selected)

| Role | Token |
|---|---|
| Border | `var(--border-width-border-thick)` `var(--color-border-brand-dark)` |
| Frame shadow | `drop-shadow(0 3px 1.5px var(--color-background-controls-brand-light))` |

### Hover outline

| Role | Token |
|---|---|
| Stroke | `var(--border-width-border-default)` `var(--color-border-brand-dark)` |

### Shell (selected)

| Role | Token |
|---|---|
| Background | `var(--color-background-controls-brand-light)` |
| Border | `var(--border-width-border-thick)` `var(--color-border-brand-dark)` |
| Frame shadow | same as hover |

## States (Light Theme)

| State | Background | Border | Hover outline | Shadow |
|---|---|---|---|---|
| `default` | `var(--color-background-surface-2)` | `1px` `var(--color-icon-accessible)`* | hidden | none |
| `hover` | `var(--color-background-surface-2)` | `2px` `var(--color-border-brand-dark)` | visible; shape-matched `52×52` / pentagon `58×58` | brand-light drop shadow |
| `selected` | `var(--color-background-controls-brand-light)` | `2px` `var(--color-border-brand-dark)` | hidden | brand-light drop shadow |

\* `applicationService` default uses `var(--color-border-violet-base-strong)` instead of accessible gray.

**States dedupe:** Dark theme uses the same semantic `var(--...)` names; resolved values in `components/synapse-theme.css` `[data-theme="dark"]`.

## States (Dark Theme)

Dark theme uses the same semantic tokens as **States (Light Theme)**. Resolved values for `[data-theme="dark"]` / Synapse dark scope live in `components/synapse-theme.css`.

## Interactions

| Trigger | Behavior |
|---|---|
| Parent sets `hovered=true` | Show shape-matched hover outline + thick brand border on shell |
| Parent sets `selected=true` | Brand fill + thick border; suppress hover outline |
| Unknown `elementType` | Fall back to `general` circle |

## Composition & API (runtime)

### Variants

| Axis | Values | Default |
|---|---|---|
| `elementType` | nine presets + string fallback | `general` |
| `interactionState` | `default` \| `hover` \| `selected` | `default` |

### Runtime API — `TopologyElementShell`

| Prop | Type | Default | Description |
|---|---|---|---|
| `elementType` | `TopologyElementType` \| string | `general` | Preset shape + default icon |
| `iconSlug` | `string?` | from type map | Override centered icon (`20×20`) |
| `hovered` | `boolean` | `false` | Hover outline + border |
| `selected` | `boolean` | `false` | Selected fill + border |

## Codegen Contract (Framework-Agnostic Blueprint)

### Deterministic structure

`TopologyElementFrame` → optional `TopologyElementHoverOutline` → `TopologyElementShell` → `TopologyElementIcon`.

### Variant matrix

All `elementType` values × `default` \| `hover` \| `selected` with rules in **States**.

### Per-slot style contract

| Element | Contract |
|---|---|
| `TopologyElementFrame` | Fixed layout box; overflow visible for hover ring |
| `TopologyElementHoverOutline` | Absolute; `4px` gap; shape-specific radius/path |
| `TopologyElementShell` | Tokens from § Tokens; pentagon uses `clip-path` + inset shadow border |
| `TopologyElementIcon` | `20×20`; slug from type map or `iconSlug` prop |

### Behavior contract

- `hovered` and `selected` are **parent-driven** — shell does not manage pointer state internally.
- Hover outline renders only when `hovered=true` and `selected=false`.
- Pentagon shell uses SVG `polygon` + `clip-path`; do not approximate with CSS `border-radius`.

### Accessibility contract

- Decorative when parent node supplies `aria-label`; set `aria-hidden="true"` on shell when embedded in labeled node group.
- Icon slot is decorative unless parent exposes name via `aria-label`.

### Asset resolution + bundling contract

Resolve icons via shared `Icon` primitive from `assets/icons/<slug>.svg`. Default slugs per **Layout & Measurements** type table.

### Fallback/error rules

- Unknown `elementType` → `general` circle + `objects-square`.
- Missing `iconSlug` and unknown type → `objects-square`.
- Missing theme CSS → validation error at codegen boundary.

### Validation checklist

- [x] All nine Figma types render correct shape geometry
- [x] Hover outline matches container shape with `4px` spacing
- [x] Selected state matches `52497:196963` brand fill/border
- [x] Application/Service default violet border (`52497:198317`)
- [x] Hypervisor pentagon hover uses `58×58` outline (`53470:228405`)
- [x] Unknown type falls back to `general` circle
- [x] Codegen Contract subsections complete

## Source Mapping

| Source | Location |
|---|---|
| Figma board | `52497:196934` |
| Node consumer spec | `components/synapse/topology/node/design-spec.md` |
| Parent topology spec | `components/synapse/topology/design-spec.md` |
| Theme CSS | `components/synapse-theme.css` |
| Contract | `storybook/src/spec-contracts/topology/synapse-topology-element.contract.ts` |
| Implementation | `storybook/src/components/topology/TopologyElementShell.tsx` |
| CSS module | `storybook/src/components/topology/TopologyElementShell.module.css` |
| Storybook | `storybook/src/components/SynapseTopologyElement.stories.tsx` |
| Verification | Figma MCP — 2026-06-23 |
