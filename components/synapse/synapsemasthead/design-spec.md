<!-- auto:generated:start -->
<!-- ds:inherits root-spec -->
# SynapseMasthead Design Spec

> Generated 2026-06-12T07:10:01Z. Component-specific override spec — inherits global tokens, baselines, and theming from root-spec.md.

<!-- ds:section id=metadata -->
## Metadata

| Property | Value |
|---|---|
| Component | SynapseMasthead |
| Category |  |
| Figma Page |  |
| Node ID |  |
| Design System | Synapse |

<!-- ds:section id=anatomy -->
## Anatomy

The component is composed of these structural parts:

- **actionButtonContainer**
- **actionIconButton**
- **actionIconGlyph**
- **actions**
- **avatarAction**
- **avatarChip**
- **avatarImage**
- **avatarSlot**
- **badgeWrapper**
- **left**
- **logo**
- **masthead**
- **productName**

Implementations must render these parts in order. Each part maps to a single DOM element (or equivalent in the target framework). Parts can be omitted if marked optional.

<!-- ds:section id=layout -->
## Layout & Measurements

> Layout data not yet extracted. Run `python scripts/figma_layout_enricher.py` to populate.

<!-- ds:section id=tokens -->
## Component Tokens

> Global tokens (colors, spacing, typography, elevation): see [root-spec.md](../root-spec.md).
> Below are tokens referenced by this component's CSS module.

- `var(--border-width-border-1)` = var(--border-width-border-default)
- `var(--color-background-controls-brand-strong)` = #0062ab
- `var(--color-background-gradient-masthead-end)` = #0076ce (light) / rgba(19,21,25,0.10) (dark)
- `var(--color-background-gradient-masthead-start)` = #0076ce (light) / rgba(0,118,206,0.50) (dark)
- `var(--color-background-masthead-brand-base)` = #0076ce (light) / #1e262c (dark)
- `var(--color-background-masthead-brand-strong)` = #0062ab (light) / #34414c (dark)
- `var(--color-background-masthead-brand-stronger)` = #06528a (light) / #455666 (dark)
- `var(--color-background-surface-1)` = #f4f4f4 (light) / #111619 (dark)
- `var(--color-border-transparent-neutral-light)` = rgba(255,255,255,0.00) (light) / #34414c (dark)
- `var(--color-border-white)` = #ffffff
- `var(--color-icon-white)` = #ffffff
- `var(--color-text-white)` = #ffffff
- `var(--font-line-height-line-height-20)` = 20px
- `var(--font-line-height-line-height-32)` = 32px
- `var(--font-size-body-1)` = 16px
- `var(--font-size-body-2)` = 14px
- `var(--font-size-header-6)` = 18px
- `var(--padding-padding-12)` = 12px
- `var(--padding-padding-16)` = 16px
- `var(--padding-padding-20)` = 20px
- `var(--padding-padding-8)` = 8px
- `var(--scale-56)` = 56px
- `var(--sizing-size-16)` = 16px
- `var(--sizing-size-32)` = 32px
- `var(--sizing-size-48)` = 48px
- `var(--spacing-space-8)` = 8px

<!-- ds:section id=states-light -->
## States (Light Theme)

| Variant | State | Background | Border | Text / Icon | Other |
|---|---|---|---|---|---|
| default | active | `var(--color-background-masthead-brand-stronger)` (#06528a) |  |  |  |
| default | default | `var(--color-background-masthead-brand-base)` (#0076ce) | `var(--border-width-border-1)` (var(--border-width-border-default)) `var(--color-border-white)` (#ffffff) | `var(--color-text-white)` (#ffffff) |  |
| default | focus | `var(--color-background-masthead-brand-base)` (#0076ce) |  |  | focus-ring: `var(--border-width-border-1)` `var(--color-border-white)` |
| default | hover | `var(--color-background-controls-brand-strong)` (#0062ab) |  |  |  |

<!-- ds:section id=states-dark -->
## States (Dark Theme)

| Variant | State | Background | Border | Text / Icon | Other |
|---|---|---|---|---|---|
| default | active | `var(--color-background-masthead-brand-stronger)` (#455666) |  |  |  |
| default | default | `var(--color-background-masthead-brand-base)` (#1e262c) | `var(--border-width-border-1)` (var(--border-width-border-default)) `var(--color-border-white)` (#ffffff) | `var(--color-text-white)` (#ffffff) |  |
| default | focus | `var(--color-background-masthead-brand-base)` (#1e262c) |  |  | focus-ring: `var(--border-width-border-1)` `var(--color-border-white)` |
| default | hover | `var(--color-background-controls-brand-strong)` (#0062ab) |  |  |  |

## Source Mapping

| Source | Location |
|---|---|
| Root spec | `components/synapse/root-spec.md` |
| Figma variables | Extracted via `figma_get_local_variables` MCP tool |
| Theme CSS | `components/synapse-theme.css` |
| Component map | `data/synapse-component-figma-map.json` |
<!-- auto:generated:end -->
