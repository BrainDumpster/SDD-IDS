<!-- auto:generated:start -->
<!-- ds:inherits root-spec -->
# CardHeaderMenu Design Spec

> Generated 2026-06-12T07:10:00Z. Component-specific override spec — inherits global tokens, baselines, and theming from root-spec.md.

<!-- ds:section id=metadata -->
## Metadata

| Property | Value |
|---|---|
| Component | CardHeaderMenu |
| Category |  |
| Figma Page |  |
| Node ID |  |
| Design System | Synapse |

<!-- ds:section id=anatomy -->
## Anatomy

The component is composed of these structural parts:

- **kebabIcon**
- **kebabTrigger**

Implementations must render these parts in order. Each part maps to a single DOM element (or equivalent in the target framework). Parts can be omitted if marked optional.

<!-- ds:section id=layout -->
## Layout & Measurements

> Layout data not yet extracted. Run `python scripts/figma_layout_enricher.py` to populate.

<!-- ds:section id=tokens -->
## Component Tokens

> Global tokens (colors, spacing, typography, elevation): see [root-spec.md](../root-spec.md).
> Below are tokens referenced by this component's CSS module.

- `var(--border-width-border-2)` = var(--border-width-border-thick)
- `var(--color-background-brand-lighter)` = #ebf4fb (light) / #1e262c (dark)
- `var(--color-border-brand-base)` = #0076ce (light) / #4c9fdd (dark)
- `var(--color-icon-brand-base)` = #0076ce (light) / #4c9fdd (dark)
- `var(--color-icon-neutral)` = #4d4d4d (light) / #b8c1c9 (dark)
- `var(--corner-radius-radius-4)` = 4px
- `var(--icon-standard-gray)` = #616161
- `var(--padding-padding-32)` = 32px
- `var(--padding-padding-4)` = 4px

<!-- ds:section id=states-light -->
## States (Light Theme)

| Variant | State | Background | Border | Text / Icon | Other |
|---|---|---|---|---|---|
| default | default |  |  | `var(--color-icon-neutral)` (#4d4d4d) | radius: `var(--corner-radius-radius-4)` |
| default | focus |  |  |  | focus-ring: `var(--border-width-border-2)` `var(--color-border-brand-base)` |
| default | hover | `var(--color-background-brand-lighter)` (#ebf4fb) |  | `var(--color-icon-brand-base)` (#0076ce) |  |

<!-- ds:section id=states-dark -->
## States (Dark Theme)

| Variant | State | Background | Border | Text / Icon | Other |
|---|---|---|---|---|---|
| default | default |  |  | `var(--color-icon-neutral)` (#b8c1c9) | radius: `var(--corner-radius-radius-4)` |
| default | focus |  |  |  | focus-ring: `var(--border-width-border-2)` `var(--color-border-brand-base)` |
| default | hover | `var(--color-background-brand-lighter)` (#1e262c) |  | `var(--color-icon-brand-base)` (#4c9fdd) |  |

## Source Mapping

| Source | Location |
|---|---|
| Root spec | `components/synapse/root-spec.md` |
| Figma variables | Extracted via `figma_get_local_variables` MCP tool |
| Theme CSS | `components/synapse-theme.css` |
| Component map | `data/synapse-component-figma-map.json` |
<!-- auto:generated:end -->
