<!-- auto:generated:start -->
<!-- ds:inherits root-spec -->
# IdsDataGridColumnVisibilityPanel Design Spec

> Generated 2026-06-12T07:10:00Z. Component-specific override spec — inherits global tokens, baselines, and theming from root-spec.md.

<!-- ds:section id=metadata -->
## Metadata

| Property | Value |
|---|---|
| Component | IdsDataGridColumnVisibilityPanel |
| Category |  |
| Figma Page |  |
| Node ID |  |
| Design System | Synapse |

<!-- ds:section id=anatomy -->
## Anatomy

The component is composed of these structural parts:

- **checkboxHost**
- **optionItem**
- **optionList**
- **root**
- **validation**
- **validationIcon**
- **validationText**

Implementations must render these parts in order. Each part maps to a single DOM element (or equivalent in the target framework). Parts can be omitted if marked optional.

<!-- ds:section id=layout -->
## Layout & Measurements

> Layout data not yet extracted. Run `python scripts/figma_layout_enricher.py` to populate.

<!-- ds:section id=tokens -->
## Component Tokens

> Global tokens (colors, spacing, typography, elevation): see [root-spec.md](../root-spec.md).
> Below are tokens referenced by this component's CSS module.

- `var(--color-background-brand-light)` = #d9eaf8 (light) / #34414c (dark)
- `var(--color-background-brand-lighter)` = #ebf4fb (light) / #1e262c (dark)
- `var(--color-background-component)` = #ffffff (light) / #111619 (dark)
- `var(--color-border-brand-neutral)` = #0076ce (light) / #8898a5 (dark)
- `var(--color-border-light)` = #c5c5c5 (light) / #34414c (dark)
- `var(--color-text-critical)` = #af0000 (light) / #dd9494 (dark)
- `var(--font-line-height-line-height-20)` = 20px
- `var(--font-size-body-2)` = 14px
- `var(--padding-padding-10)` = 10px
- `var(--padding-padding-16)` = 16px
- `var(--padding-padding-4)` = 4px
- `var(--padding-padding-8)` = 8px
- `var(--spacing-space-8)` = 8px

<!-- ds:section id=states-light -->
## States (Light Theme)

| Variant | State | Background | Border | Text / Icon | Other |
|---|---|---|---|---|---|
| default | active | `var(--color-background-brand-light)` (#d9eaf8) |  |  | shadow: `var(--color-border-brand-neutral)` `var(--color-border-brand-neutral)` |
| default | default | `var(--color-background-component)` (#ffffff) |  | `var(--color-text-critical)` (#af0000) |  |
| default | hover | `var(--color-background-brand-lighter)` (#ebf4fb) |  |  | shadow: `var(--color-border-brand-neutral)` `var(--color-border-brand-neutral)` |

<!-- ds:section id=states-dark -->
## States (Dark Theme)

| Variant | State | Background | Border | Text / Icon | Other |
|---|---|---|---|---|---|
| default | active | `var(--color-background-brand-light)` (#34414c) |  |  | shadow: `var(--color-border-brand-neutral)` `var(--color-border-brand-neutral)` |
| default | default | `var(--color-background-component)` (#111619) |  | `var(--color-text-critical)` (#dd9494) |  |
| default | hover | `var(--color-background-brand-lighter)` (#1e262c) |  |  | shadow: `var(--color-border-brand-neutral)` `var(--color-border-brand-neutral)` |

## Source Mapping

| Source | Location |
|---|---|
| Root spec | `components/synapse/root-spec.md` |
| Figma variables | Extracted via `figma_get_local_variables` MCP tool |
| Theme CSS | `components/synapse-theme.css` |
| Component map | `data/synapse-component-figma-map.json` |
<!-- auto:generated:end -->
