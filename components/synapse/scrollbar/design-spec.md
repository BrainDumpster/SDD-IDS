<!-- auto:generated:start -->
<!-- ds:inherits root-spec -->
# ScrollBar Design Spec

> Generated 2026-06-12T07:10:01Z. Component-specific override spec — inherits global tokens, baselines, and theming from root-spec.md.

<!-- ds:section id=metadata -->
## Metadata

| Property | Value |
|---|---|
| Component | ScrollBar |
| Category | Components |
| Figma Page | Components |
| Node ID | 48149:7196 |
| Design System | Synapse |

<!-- ds:section id=anatomy -->
## Anatomy

The component is composed of these structural parts:

- **root**
- **scrollbar**
- **thumb**
- **viewport**

Implementations must render these parts in order. Each part maps to a single DOM element (or equivalent in the target framework). Parts can be omitted if marked optional.

<!-- ds:section id=layout -->
## Layout & Measurements

> Layout data not yet extracted. Run `python scripts/figma_layout_enricher.py` to populate.

<!-- ds:section id=tokens -->
## Component Tokens

> Global tokens (colors, spacing, typography, elevation): see [root-spec.md](../root-spec.md).
> Below are tokens referenced by this component's CSS module.

- `var(--border-width-border-1)` = var(--border-width-border-default)
- `var(--color-background-component)` = #ffffff (light) / #111619 (dark)
- `var(--color-border-light)` = #c5c5c5 (light) / #34414c (dark)
- `var(--color-border-lighter)` = #eaeaea (light) / #1e262c (dark)
- `var(--color-text-neutral)` = #4d4d4d (light) / #b8c1c9 (dark)
- `var(--corner-radius-radius-4)` = 4px

<!-- ds:section id=states-light -->
## States (Light Theme)

| Variant | State | Background | Border | Text / Icon | Other |
|---|---|---|---|---|---|
| default | default | `var(--color-border-light)` (#c5c5c5) | `var(--border-width-border-1)` (var(--border-width-border-default)) `var(--color-border-lighter)` (#eaeaea) |  | opacity: 0; radius: `var(--corner-radius-radius-4)` |
| default | hover | `var(--color-text-neutral)` (#4d4d4d) |  |  | opacity: 1 |

<!-- ds:section id=states-dark -->
## States (Dark Theme)

| Variant | State | Background | Border | Text / Icon | Other |
|---|---|---|---|---|---|
| default | default | `var(--color-border-light)` (#34414c) | `var(--border-width-border-1)` (var(--border-width-border-default)) `var(--color-border-lighter)` (#1e262c) |  | opacity: 0; radius: `var(--corner-radius-radius-4)` |
| default | hover | `var(--color-text-neutral)` (#b8c1c9) |  |  | opacity: 1 |

## Source Mapping

| Source | Location |
|---|---|
| Root spec | `components/synapse/root-spec.md` |
| Figma variables | Extracted via `figma_get_local_variables` MCP tool |
| Theme CSS | `components/synapse-theme.css` |
| Component map | `data/synapse-component-figma-map.json` |
<!-- auto:generated:end -->
