<!-- auto:generated:start -->
<!-- ds:inherits root-spec -->
# IdsFooter Design Spec

> Generated 2026-06-12T07:10:00Z. Component-specific override spec — inherits global tokens, baselines, and theming from root-spec.md.

<!-- ds:section id=metadata -->
## Metadata

| Property | Value |
|---|---|
| Component | IdsFooter |
| Category |  |
| Figma Page |  |
| Node ID |  |
| Design System | Synapse |

<!-- ds:section id=anatomy -->
## Anatomy

The component is composed of these structural parts:

- **copyButton**
- **dateTime**
- **field**
- **label**
- **left**
- **root**
- **swidGroup**
- **timeGroup**
- **timeZoneButton**
- **timeZoneGroup**
- **value**

Implementations must render these parts in order. Each part maps to a single DOM element (or equivalent in the target framework). Parts can be omitted if marked optional.

<!-- ds:section id=layout -->
## Layout & Measurements

> Layout data not yet extracted. Run `python scripts/figma_layout_enricher.py` to populate.

<!-- ds:section id=tokens -->
## Component Tokens

> Global tokens (colors, spacing, typography, elevation): see [root-spec.md](../root-spec.md).
> Below are tokens referenced by this component's CSS module.

- `var(--border-width-border-1)` = var(--border-width-border-default)
- `var(--border-width-border-2)` = var(--border-width-border-thick)
- `var(--color-background-surface-1)` = #f4f4f4 (light) / #111619 (dark)
- `var(--color-border-brand-base)` = #0076ce (light) / #4c9fdd (dark)
- `var(--color-border-light)` = #c5c5c5 (light) / #34414c (dark)
- `var(--color-text-brand-strong)` = #0062ab (light) / #94c5ea (dark)
- `var(--color-text-disabled)` = #757575 (light) / #9e9e9e (dark)
- `var(--color-text-link-brand-base)` = #0062ab (light) / #4c9fdd (dark)
- `var(--color-text-neutral)` = #4d4d4d (light) / #b8c1c9 (dark)
- `var(--color-text-neutral-strong)` = #252525 (light) / #e6e9ec (dark)
- `var(--font-line-height-line-height-20)` = 20px
- `var(--font-size-body-2)` = 14px
- `var(--padding-padding-16)` = 16px
- `var(--padding-padding-4)` = 4px
- `var(--padding-padding-8)` = 8px
- `var(--spacing-space-24)` = 24px
- `var(--spacing-space-8)` = 8px

<!-- ds:section id=states-light -->
## States (Light Theme)

| Variant | State | Background | Border | Text / Icon | Other |
|---|---|---|---|---|---|
| default | default | `var(--color-background-surface-1)` (#f4f4f4) | `var(--border-width-border-1)` (var(--border-width-border-default)) `var(--color-border-light)` (#c5c5c5) | `var(--color-text-brand-strong)` (#0062ab) |  |
| default | disabled |  |  | `var(--color-text-disabled)` (#757575) |  |
| default | focus |  |  |  | focus-ring: `var(--border-width-border-2)` `var(--color-border-brand-base)` |
| default | hover |  |  | `var(--color-text-link-brand-base)` (#0062ab) |  |

<!-- ds:section id=states-dark -->
## States (Dark Theme)

| Variant | State | Background | Border | Text / Icon | Other |
|---|---|---|---|---|---|
| default | default | `var(--color-background-surface-1)` (#111619) | `var(--border-width-border-1)` (var(--border-width-border-default)) `var(--color-border-light)` (#34414c) | `var(--color-text-brand-strong)` (#94c5ea) |  |
| default | disabled |  |  | `var(--color-text-disabled)` (#9e9e9e) |  |
| default | focus |  |  |  | focus-ring: `var(--border-width-border-2)` `var(--color-border-brand-base)` |
| default | hover |  |  | `var(--color-text-link-brand-base)` (#4c9fdd) |  |

## Source Mapping

| Source | Location |
|---|---|
| Root spec | `components/synapse/root-spec.md` |
| Figma variables | Extracted via `figma_get_local_variables` MCP tool |
| Theme CSS | `components/synapse-theme.css` |
| Component map | `data/synapse-component-figma-map.json` |
<!-- auto:generated:end -->
