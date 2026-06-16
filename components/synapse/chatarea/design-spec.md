<!-- auto:generated:start -->
<!-- ds:inherits root-spec -->
# ChatArea Design Spec

> Generated 2026-06-12T07:10:00Z. Component-specific override spec — inherits global tokens, baselines, and theming from root-spec.md.

<!-- ds:section id=metadata -->
## Metadata

| Property | Value |
|---|---|
| Component | ChatArea |
| Category | Components |
| Figma Page | Components |
| Node ID | 47816:4025 |
| Design System | Synapse |

<!-- ds:section id=anatomy -->
## Anatomy

The component is composed of these structural parts:

- **bubble**
- **content**
- **messages**
- **root**
- **system**
- **timestamp**
- **user**

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
- `var(--color-background-controls-brand-base)` = #0076ce
- `var(--color-background-surface-1)` = #f4f4f4 (light) / #111619 (dark)
- `var(--color-border-lighter)` = #eaeaea (light) / #1e262c (dark)
- `var(--color-text-neutral-strong)` = #252525 (light) / #e6e9ec (dark)
- `var(--color-text-white)` = #ffffff
- `var(--corner-radius-radius-4)` = 4px
- `var(--font-line-height-line-height-20)` = 20px
- `var(--font-size-body-2)` = 14px
- `var(--font-size-body-3)` = 12px
- `var(--padding-padding-12)` = 12px
- `var(--padding-padding-16)` = 16px
- `var(--spacing-space-12)` = 12px
- `var(--spacing-space-4)` = 4px

<!-- ds:section id=states-light -->
## States (Light Theme)

| Variant | State | Background | Border | Text / Icon | Other |
|---|---|---|---|---|---|
| default | default | `var(--color-background-surface-1)` (#f4f4f4) | `var(--border-width-border-1)` (var(--border-width-border-default)) `var(--color-border-lighter)` (#eaeaea) | `var(--color-text-neutral-strong)` (#252525) | opacity: 0.7; radius: `var(--corner-radius-radius-4)` |

<!-- ds:section id=states-dark -->
## States (Dark Theme)

| Variant | State | Background | Border | Text / Icon | Other |
|---|---|---|---|---|---|
| default | default | `var(--color-background-surface-1)` (#111619) | `var(--border-width-border-1)` (var(--border-width-border-default)) `var(--color-border-lighter)` (#1e262c) | `var(--color-text-neutral-strong)` (#e6e9ec) | opacity: 0.7; radius: `var(--corner-radius-radius-4)` |

## Source Mapping

| Source | Location |
|---|---|
| Root spec | `components/synapse/root-spec.md` |
| Figma variables | Extracted via `figma_get_local_variables` MCP tool |
| Theme CSS | `components/synapse-theme.css` |
| Component map | `data/synapse-component-figma-map.json` |
<!-- auto:generated:end -->
