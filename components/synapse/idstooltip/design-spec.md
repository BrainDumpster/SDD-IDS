<!-- auto:generated:start -->
<!-- ds:inherits root-spec -->
# IdsTooltip Design Spec

> Generated 2026-06-12T07:10:00Z. Component-specific override spec — inherits global tokens, baselines, and theming from root-spec.md.

<!-- ds:section id=metadata -->
## Metadata

| Property | Value |
|---|---|
| Component | IdsTooltip |
| Category |  |
| Figma Page |  |
| Node ID |  |
| Design System | Synapse |

<!-- ds:section id=anatomy -->
## Anatomy

The component is composed of these structural parts:

- **arrow**
- **arrowFill**
- **arrowStroke**
- **arrowSvg**
- **body**
- **close**
- **closeIcon**
- **content**
- **header**
- **popup**
- **popupClosable**
- **popupStandard**
- **title**
- **trigger**
- **triggerBlock**

Implementations must render these parts in order. Each part maps to a single DOM element (or equivalent in the target framework). Parts can be omitted if marked optional.

<!-- ds:section id=layout -->
## Layout & Measurements

> Layout data not yet extracted. Run `python scripts/figma_layout_enricher.py` to populate.

<!-- ds:section id=tokens -->
## Component Tokens

> Global tokens (colors, spacing, typography, elevation): see [root-spec.md](../root-spec.md).
> Below are tokens referenced by this component's CSS module.

- `var(--border-width-border-default)` = 1px
- `var(--color-background-surface-2)` = #ffffff (light) / #1e262c (dark)
- `var(--color-border-accessible)` = #757575 (light) / #8898a5 (dark)
- `var(--color-text-neutral)` = #4d4d4d (light) / #b8c1c9 (dark)
- `var(--color-text-neutral-strong)` = #252525 (light) / #e6e9ec (dark)
- `var(--font-line-height-line-height-20)` = 20px
- `var(--font-size-body-2)` = 14px
- `var(--padding-padding-12)` = 12px
- `var(--scale-12)` = 12px
- `var(--spacing-space-4)` = 4px
- `var(--spacing-space-8)` = 8px
- `var(--tooltip-control-radius)` = var(--corner-radius-radius-8)

<!-- ds:section id=states-light -->
## States (Light Theme)

| Variant | State | Background | Border | Text / Icon | Other |
|---|---|---|---|---|---|
| default | default | `var(--color-background-surface-2)` (#ffffff) | `var(--border-width-border-default)` (1px) `var(--color-border-accessible)` (#757575) | `var(--color-text-neutral-strong)` (#252525) | radius: `var(--tooltip-control-radius)` |

<!-- ds:section id=states-dark -->
## States (Dark Theme)

| Variant | State | Background | Border | Text / Icon | Other |
|---|---|---|---|---|---|
| default | default | `var(--color-background-surface-2)` (#1e262c) | `var(--border-width-border-default)` (1px) `var(--color-border-accessible)` (#8898a5) | `var(--color-text-neutral-strong)` (#e6e9ec) | radius: `var(--tooltip-control-radius)` |

## Source Mapping

| Source | Location |
|---|---|
| Root spec | `components/synapse/root-spec.md` |
| Figma variables | Extracted via `figma_get_local_variables` MCP tool |
| Theme CSS | `components/synapse-theme.css` |
| Component map | `data/synapse-component-figma-map.json` |
<!-- auto:generated:end -->
