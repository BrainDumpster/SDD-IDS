<!-- auto:generated:start -->
<!-- ds:inherits root-spec -->
# IdsDataGridTypeDateAndTimeFilterPanel Design Spec

> Generated 2026-06-12T07:10:00Z. Component-specific override spec — inherits global tokens, baselines, and theming from root-spec.md.

<!-- ds:section id=metadata -->
## Metadata

| Property | Value |
|---|---|
| Component | IdsDataGridTypeDateAndTimeFilterPanel |
| Category |  |
| Figma Page |  |
| Node ID |  |
| Design System | Synapse |

<!-- ds:section id=anatomy -->
## Anatomy

The component is composed of these structural parts:

- **dateField**
- **dateTimeRow**
- **expandedBlock**
- **labelText**
- **optionLabel**
- **optionRow**
- **radioIndicator**
- **radioInput**
- **radioRoot**
- **root**
- **summary**
- **timeField**

Implementations must render these parts in order. Each part maps to a single DOM element (or equivalent in the target framework). Parts can be omitted if marked optional.

<!-- ds:section id=layout -->
## Layout & Measurements

> Layout data not yet extracted. Run `python scripts/figma_layout_enricher.py` to populate.

<!-- ds:section id=tokens -->
## Component Tokens

> Global tokens (colors, spacing, typography, elevation): see [root-spec.md](../root-spec.md).
> Below are tokens referenced by this component's CSS module.

- `var(--color-background-component)` = #ffffff (light) / #111619 (dark)
- `var(--color-border-accessible)` = #757575 (light) / #8898a5 (dark)
- `var(--color-border-brand-base)` = #0076ce (light) / #4c9fdd (dark)
- `var(--color-icon-brand-base)` = #0076ce (light) / #4c9fdd (dark)
- `var(--color-text-neutral)` = #4d4d4d (light) / #b8c1c9 (dark)
- `var(--font-line-height-line-height-20)` = 20px
- `var(--font-size-body-2)` = 14px
- `var(--padding-padding-16)` = 16px
- `var(--padding-padding-8)` = 8px
- `var(--spacing-space-16)` = 16px
- `var(--spacing-space-8)` = 8px

<!-- ds:section id=states-light -->
## States (Light Theme)

| Variant | State | Background | Border | Text / Icon | Other |
|---|---|---|---|---|---|
| default | checked |  | `var(--color-border-brand-base)` (#0076ce) |  |  |
| default | default | `var(--color-icon-brand-base)` (#0076ce) | `var(--color-border-accessible)` (#757575) | `var(--color-text-neutral)` (#4d4d4d) |  |
| default | focus |  |  |  | focus-ring: `var(--color-border-brand-base)` |

<!-- ds:section id=states-dark -->
## States (Dark Theme)

| Variant | State | Background | Border | Text / Icon | Other |
|---|---|---|---|---|---|
| default | checked |  | `var(--color-border-brand-base)` (#4c9fdd) |  |  |
| default | default | `var(--color-icon-brand-base)` (#4c9fdd) | `var(--color-border-accessible)` (#8898a5) | `var(--color-text-neutral)` (#b8c1c9) |  |
| default | focus |  |  |  | focus-ring: `var(--color-border-brand-base)` |

## Source Mapping

| Source | Location |
|---|---|
| Root spec | `components/synapse/root-spec.md` |
| Figma variables | Extracted via `figma_get_local_variables` MCP tool |
| Theme CSS | `components/synapse-theme.css` |
| Component map | `data/synapse-component-figma-map.json` |
<!-- auto:generated:end -->
