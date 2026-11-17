<!-- auto:generated:start -->
<!-- ds:inherits root-spec -->
# IdsStatusBar Design Spec

> Generated 2026-06-12T07:10:00Z. Component-specific override spec — inherits global tokens, baselines, and theming from root-spec.md.

<!-- ds:section id=metadata -->
## Metadata

| Property | Value |
|---|---|
| Component | IdsStatusBar |
| Category |  |
| Figma Page |  |
| Node ID |  |
| Design System | Synapse |

<!-- ds:section id=anatomy -->
## Anatomy

The component is composed of these structural parts:

- **badgeIcon**
- **category**
- **content**
- **contentWrap**
- **disabled**
- **divider**
- **hover**
- **icon**
- **iconStack**
- **item**
- **label**
- **large**
- **left**
- **leftDivider**
- **mainIcon**
- **meta**
- **overflowButton**
- **overflowIcon**
- **overflowLayer**
- **right**
- **rightDivider**
- **root**
- **selected**
- **small**
- **totalItem**
- **value**
- **withTotal**

Implementations must render these parts in order. Each part maps to a single DOM element (or equivalent in the target framework). Parts can be omitted if marked optional.

<!-- ds:section id=layout -->
## Layout & Measurements

> Layout data not yet extracted. Run `python scripts/figma_layout_enricher.py` to populate.

<!-- ds:section id=tokens -->
## Component Tokens

> Global tokens (colors, spacing, typography, elevation): see [root-spec.md](../root-spec.md).
> Below are tokens referenced by this component's CSS module.

- `var(--border-width-border-1)` = var(--border-width-border-default)
- `var(--color-background-brand-light)` = #d9eaf8 (light) / #34414c (dark)
- `var(--color-background-brand-lighter)` = #ebf4fb (light) / #1e262c (dark)
- `var(--color-background-component)` = #ffffff (light) / #111619 (dark)
- `var(--color-background-component-light)` = #f4f4f4 (light) / #1e262c (dark)
- `var(--color-border-disabled)` = #757575 (light) / #9e9e9e (dark)
- `var(--color-gradient-overflow-horizontal-inverse-end)` = ?
- `var(--color-gradient-overflow-horizontal-inverse-start)` = ?
- `var(--color-icon-accessible)` = #757575 (light) / #8898a5 (dark)
- `var(--color-icon-brand-base)` = #0076ce (light) / #4c9fdd (dark)
- `var(--color-text-brand-base)` = #0076ce (light) / #4c9fdd (dark)
- `var(--color-text-disabled)` = #757575 (light) / #9e9e9e (dark)
- `var(--color-text-neutral)` = #4d4d4d (light) / #b8c1c9 (dark)
- `var(--font-line-height-line-height-20)` = 20px
- `var(--font-line-height-line-height-24)` = 24px
- `var(--font-line-height-line-height-25)` = 25px
- `var(--font-line-height-line-height-32)` = 32px
- `var(--font-line-height-line-height-44)` = 44px
- `var(--font-size-body-1)` = 16px
- `var(--font-size-body-2)` = 14px
- `var(--font-size-heading-5)` = ?
- `var(--padding-padding-24)` = 24px
- `var(--spacing-space-24)` = 24px
- `var(--spacing-space-8)` = 8px

<!-- ds:section id=states-light -->
## States (Light Theme)

| Variant | State | Background | Border | Text / Icon | Other |
|---|---|---|---|---|---|
| default | default | `var(--color-gradient-overflow-horizontal-inverse-start)` `var(--color-gradient-overflow-horizontal-inverse-end)` | `var(--border-width-border-1)` (var(--border-width-border-default)) `var(--color-border-disabled)` (#757575) | `var(--color-icon-brand-base)` (#0076ce) |  |

<!-- ds:section id=states-dark -->
## States (Dark Theme)

| Variant | State | Background | Border | Text / Icon | Other |
|---|---|---|---|---|---|
| default | default | `var(--color-gradient-overflow-horizontal-inverse-start)` `var(--color-gradient-overflow-horizontal-inverse-end)` | `var(--border-width-border-1)` (var(--border-width-border-default)) `var(--color-border-disabled)` (#9e9e9e) | `var(--color-icon-brand-base)` (#4c9fdd) |  |

## Source Mapping

| Source | Location |
|---|---|
| Root spec | `components/synapse/root-spec.md` |
| Figma variables | Extracted via `figma_get_local_variables` MCP tool |
| Theme CSS | `components/synapse-theme.css` |
| Component map | `data/synapse-component-figma-map.json` |
<!-- auto:generated:end -->
