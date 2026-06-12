<!-- auto:generated:start -->
<!-- ds:inherits root-spec -->
# IdsTree Design Spec

> Generated 2026-06-12T07:10:00Z. Component-specific override spec — inherits global tokens, baselines, and theming from root-spec.md.

<!-- ds:section id=metadata -->
## Metadata

| Property | Value |
|---|---|
| Component | IdsTree |
| Category |  |
| Figma Page |  |
| Node ID |  |
| Design System | Synapse |

<!-- ds:section id=anatomy -->
## Anatomy

The component is composed of these structural parts:

- **badge**
- **chevron**
- **chevronButton**
- **chevronExpanded**
- **chevronSpacer**
- **folderIcon**
- **label**
- **labelButton**
- **labelCluster**
- **root**
- **row**
- **rowFocused**
- **rowSelected**

Implementations must render these parts in order. Each part maps to a single DOM element (or equivalent in the target framework). Parts can be omitted if marked optional.

<!-- ds:section id=layout -->
## Layout & Measurements

> Layout data not yet extracted. Run `python scripts/figma_layout_enricher.py` to populate.

<!-- ds:section id=tokens -->
## Component Tokens

> Global tokens (colors, spacing, typography, elevation): see [root-spec.md](../root-spec.md).
> Below are tokens referenced by this component's CSS module.

- `var(--color-background-brand-lighter)` = #ebf4fb (light) / #1e262c (dark)
- `var(--color-background-controls-brand-base)` = #0076ce
- `var(--color-background-gray-lighter)` = #f4f4f4 (light) / #393939 (dark)
- `var(--color-border-brand-base)` = #0076ce (light) / #4c9fdd (dark)
- `var(--color-border-white)` = #ffffff
- `var(--color-text-brand-strong)` = #0062ab (light) / #94c5ea (dark)
- `var(--color-text-neutral)` = #4d4d4d (light) / #b8c1c9 (dark)
- `var(--color-text-white)` = #ffffff
- `var(--corner-radius-radius-round)` = 999999px
- `var(--font-size-body-2)` = 14px
- `var(--padding-padding-10)` = 10px
- `var(--padding-padding-48)` = 48px
- `var(--spacing-space-8)` = 8px

<!-- ds:section id=states-light -->
## States (Light Theme)

| Variant | State | Background | Border | Text / Icon | Other |
|---|---|---|---|---|---|
| default | default | `var(--color-background-controls-brand-base)` (#0076ce) | `var(--color-border-white)` (#ffffff) | `var(--color-text-white)` (#ffffff) | shadow: `var(--color-border-brand-base)`; focus-ring: `var(--color-border-brand-base)`; radius: `var(--corner-radius-radius-round)` |
| default | focus |  |  |  | focus-ring: `var(--color-border-brand-base)` |
| default | hover | `var(--color-background-gray-lighter)` (#f4f4f4) |  |  |  |

<!-- ds:section id=states-dark -->
## States (Dark Theme)

| Variant | State | Background | Border | Text / Icon | Other |
|---|---|---|---|---|---|
| default | default | `var(--color-background-controls-brand-base)` (#0076ce) | `var(--color-border-white)` (#ffffff) | `var(--color-text-white)` (#ffffff) | shadow: `var(--color-border-brand-base)`; focus-ring: `var(--color-border-brand-base)`; radius: `var(--corner-radius-radius-round)` |
| default | focus |  |  |  | focus-ring: `var(--color-border-brand-base)` |
| default | hover | `var(--color-background-gray-lighter)` (#393939) |  |  |  |

## Source Mapping

| Source | Location |
|---|---|
| Root spec | `components/synapse/root-spec.md` |
| Figma variables | Extracted via `figma_get_local_variables` MCP tool |
| Theme CSS | `components/synapse-theme.css` |
| Component map | `data/synapse-component-figma-map.json` |
<!-- auto:generated:end -->
