<!-- auto:generated:start -->
<!-- ds:inherits root-spec -->
# IdsAccordion Design Spec

> Generated 2026-06-12T07:10:00Z. Component-specific override spec — inherits global tokens, baselines, and theming from root-spec.md.

<!-- ds:section id=metadata -->
## Metadata

| Property | Value |
|---|---|
| Component | IdsAccordion |
| Category |  |
| Figma Page |  |
| Node ID |  |
| Design System | Synapse |

<!-- ds:section id=anatomy -->
## Anatomy

The component is composed of these structural parts:

- **content**
- **contentCard**
- **formSlot**
- **header**
- **icon**
- **item**
- **meta**
- **panel**
- **root**
- **rootForm**
- **title**
- **trigger**
- **triggerLeft**
- **triggerRight**

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
- `var(--color-background-brand-light)` = #d9eaf8 (light) / #34414c (dark)
- `var(--color-background-brand-lighter)` = #ebf4fb (light) / #1e262c (dark)
- `var(--color-background-component)` = #ffffff (light) / #111619 (dark)
- `var(--color-border-accessible)` = #757575 (light) / #8898a5 (dark)
- `var(--color-border-brand-base)` = #0076ce (light) / #4c9fdd (dark)
- `var(--color-border-brand-dark)` = #0062ab (light) / #94c5ea (dark)
- `var(--color-icon-neutral)` = #4d4d4d (light) / #b8c1c9 (dark)
- `var(--color-icon-neutral-strong)` = #252525 (light) / #f2f3f5 (dark)
- `var(--color-text-neutral)` = #4d4d4d (light) / #b8c1c9 (dark)
- `var(--color-text-neutral-strong)` = #252525 (light) / #e6e9ec (dark)
- `var(--font-line-height-line-height-20)` = 20px
- `var(--font-size-body-2)` = 14px
- `var(--padding-padding-12)` = 12px
- `var(--padding-padding-16)` = 16px
- `var(--padding-padding-24)` = 24px
- `var(--padding-padding-32)` = 32px
- `var(--padding-padding-8)` = 8px
- `var(--scale-16)` = 16px
- `var(--scale-40)` = 40px
- `var(--spacing-space-8)` = 8px

<!-- ds:section id=states-light -->
## States (Light Theme)

| Variant | State | Background | Border | Text / Icon | Other |
|---|---|---|---|---|---|
| default | default | `var(--color-background-component)` (#ffffff) | `var(--color-border-brand-dark)` (#0062ab) | `var(--color-text-neutral)` (#4d4d4d) |  |
| default | disabled |  |  |  | opacity: 0.5 |
| default | focus |  |  |  | focus-ring: `var(--border-width-border-2)` `var(--color-border-brand-base)` |
| default | hover | `var(--color-background-brand-light)` (#d9eaf8) |  | `var(--color-icon-neutral-strong)` (#252525) |  |
| default | open | `var(--color-background-component)` (#ffffff) |  | `var(--color-icon-neutral)` (#4d4d4d) |  |

<!-- ds:section id=states-dark -->
## States (Dark Theme)

| Variant | State | Background | Border | Text / Icon | Other |
|---|---|---|---|---|---|
| default | default | `var(--color-background-component)` (#111619) | `var(--color-border-brand-dark)` (#94c5ea) | `var(--color-text-neutral)` (#b8c1c9) |  |
| default | disabled |  |  |  | opacity: 0.5 |
| default | focus |  |  |  | focus-ring: `var(--border-width-border-2)` `var(--color-border-brand-base)` |
| default | hover | `var(--color-background-brand-light)` (#34414c) |  | `var(--color-icon-neutral-strong)` (#f2f3f5) |  |
| default | open | `var(--color-background-component)` (#111619) |  | `var(--color-icon-neutral)` (#b8c1c9) |  |

## Source Mapping

| Source | Location |
|---|---|
| Root spec | `components/synapse/root-spec.md` |
| Figma variables | Extracted via `figma_get_local_variables` MCP tool |
| Theme CSS | `components/synapse-theme.css` |
| Component map | `data/synapse-component-figma-map.json` |
<!-- auto:generated:end -->
