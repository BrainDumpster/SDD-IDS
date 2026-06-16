<!-- auto:generated:start -->
<!-- ds:inherits root-spec -->
# RecommendationFeedback Design Spec

> Generated 2026-06-12T07:10:01Z. Component-specific override spec — inherits global tokens, baselines, and theming from root-spec.md.

<!-- ds:section id=metadata -->
## Metadata

| Property | Value |
|---|---|
| Component | RecommendationFeedback |
| Category | Components |
| Figma Page | Components |
| Node ID | 53259:126112 |
| Design System | Synapse |

<!-- ds:section id=anatomy -->
## Anatomy

The component is composed of these structural parts:

- **actionButton**
- **actions**
- **prompt**
- **root**
- **timestamp**

Implementations must render these parts in order. Each part maps to a single DOM element (or equivalent in the target framework). Parts can be omitted if marked optional.

<!-- ds:section id=layout -->
## Layout & Measurements

> Layout data not yet extracted. Run `python scripts/figma_layout_enricher.py` to populate.

<!-- ds:section id=tokens -->
## Component Tokens

> Global tokens (colors, spacing, typography, elevation): see [root-spec.md](../root-spec.md).
> Below are tokens referenced by this component's CSS module.

- `var(--border-width-border-1)` = var(--border-width-border-default)
- `var(--color-background-surface-1)` = #f4f4f4 (light) / #111619 (dark)
- `var(--color-border-brand-base)` = #0076ce (light) / #4c9fdd (dark)
- `var(--color-text-disabled)` = #757575 (light) / #9e9e9e (dark)
- `var(--color-text-neutral)` = #4d4d4d (light) / #b8c1c9 (dark)
- `var(--corner-radius-radius-4)` = 4px
- `var(--corner-radius-radius-6)` = 6px
- `var(--font-line-height-line-height-18)` = 18px
- `var(--font-line-height-line-height-24)` = 24px
- `var(--font-size-body-1)` = 16px
- `var(--font-size-body-3)` = 12px
- `var(--padding-padding-6)` = 6px
- `var(--padding-padding-8)` = 8px
- `var(--scale-2)` = 2px
- `var(--spacing-space-12)` = 12px
- `var(--spacing-space-8)` = 8px

<!-- ds:section id=states-light -->
## States (Light Theme)

| Variant | State | Background | Border | Text / Icon | Other |
|---|---|---|---|---|---|
| default | default |  |  | `var(--color-text-disabled)` (#757575) | radius: `var(--corner-radius-radius-4)` |
| default | focus |  |  |  | focus-ring: `var(--border-width-border-1)` `var(--color-border-brand-base)` |
| default | hover | `var(--color-background-surface-1)` (#f4f4f4) |  |  |  |

<!-- ds:section id=states-dark -->
## States (Dark Theme)

| Variant | State | Background | Border | Text / Icon | Other |
|---|---|---|---|---|---|
| default | default |  |  | `var(--color-text-disabled)` (#9e9e9e) | radius: `var(--corner-radius-radius-4)` |
| default | focus |  |  |  | focus-ring: `var(--border-width-border-1)` `var(--color-border-brand-base)` |
| default | hover | `var(--color-background-surface-1)` (#111619) |  |  |  |

## Source Mapping

| Source | Location |
|---|---|
| Root spec | `components/synapse/root-spec.md` |
| Figma variables | Extracted via `figma_get_local_variables` MCP tool |
| Theme CSS | `components/synapse-theme.css` |
| Component map | `data/synapse-component-figma-map.json` |
<!-- auto:generated:end -->
