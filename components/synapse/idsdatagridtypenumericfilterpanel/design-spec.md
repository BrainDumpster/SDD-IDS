<!-- auto:generated:start -->
<!-- ds:inherits root-spec -->
# IdsDataGridTypeNumericFilterPanel Design Spec

> Generated 2026-06-12T07:10:00Z. Component-specific override spec — inherits global tokens, baselines, and theming from root-spec.md.

<!-- ds:section id=metadata -->
## Metadata

| Property | Value |
|---|---|
| Component | IdsDataGridTypeNumericFilterPanel |
| Category |  |
| Figma Page |  |
| Node ID |  |
| Design System | Synapse |

<!-- ds:section id=anatomy -->
## Anatomy

The component is composed of these structural parts:

- **optionLabel**
- **optionRow**
- **radioIndicator**
- **radioInput**
- **radioRoot**
- **root**
- **unitDropdownRoot**
- **unitDropdownWrap**
- **unitOption**
- **unitPopup**
- **unitTriggerBtn**
- **unitTriggerCaret**
- **unitTriggerLabel**
- **valueBlock**
- **valueField**
- **valueHelper**
- **valueInput**
- **valueRow**

Implementations must render these parts in order. Each part maps to a single DOM element (or equivalent in the target framework). Parts can be omitted if marked optional.

<!-- ds:section id=layout -->
## Layout & Measurements

> Layout data not yet extracted. Run `python scripts/figma_layout_enricher.py` to populate.

<!-- ds:section id=tokens -->
## Component Tokens

> Global tokens (colors, spacing, typography, elevation): see [root-spec.md](../root-spec.md).
> Below are tokens referenced by this component's CSS module.

- `var(--color-background-brand-lighter)` = #ebf4fb (light) / #1e262c (dark)
- `var(--color-background-component)` = #ffffff (light) / #111619 (dark)
- `var(--color-border-accessible)` = #757575 (light) / #8898a5 (dark)
- `var(--color-border-brand-base)` = #0076ce (light) / #4c9fdd (dark)
- `var(--color-border-brand-neutral)` = #0076ce (light) / #8898a5 (dark)
- `var(--color-border-strong)` = #252525 (light) / #b8c1c9 (dark)
- `var(--color-icon-brand-base)` = #0076ce (light) / #4c9fdd (dark)
- `var(--color-icon-brand-strong)` = #0062ab (light) / #94c5ea (dark)
- `var(--color-icon-neutral)` = #4d4d4d (light) / #b8c1c9 (dark)
- `var(--color-text-brand-strong)` = #0062ab (light) / #94c5ea (dark)
- `var(--color-text-neutral)` = #4d4d4d (light) / #b8c1c9 (dark)
- `var(--font-line-height-line-height-20)` = 20px
- `var(--font-size-body-2)` = 14px
- `var(--padding-padding-1)` = 1px
- `var(--padding-padding-10)` = 10px
- `var(--padding-padding-16)` = 16px
- `var(--padding-padding-8)` = 8px
- `var(--spacing-space-10)` = 10px
- `var(--spacing-space-4)` = 4px
- `var(--spacing-space-8)` = 8px

<!-- ds:section id=states-light -->
## States (Light Theme)

| Variant | State | Background | Border | Text / Icon | Other |
|---|---|---|---|---|---|
| default | checked |  | `var(--color-border-brand-base)` (#0076ce) |  |  |
| default | default | `var(--color-background-component)` (#ffffff) | `var(--color-border-accessible)` (#757575) | `var(--color-text-neutral)` (#4d4d4d) | opacity: 0.7 |
| default | focus |  | `var(--color-border-accessible)` (#757575) |  | shadow: `var(--color-border-brand-base)`; focus-ring: `var(--color-border-brand-base)` |
| default | hover | `var(--color-background-brand-lighter)` (#ebf4fb) | `var(--color-border-strong)` (#252525) |  | shadow: `var(--color-border-brand-base)` `var(--color-border-brand-base)` |
| default | selected | `var(--color-background-brand-lighter)` (#ebf4fb) |  | `var(--color-text-brand-strong)` (#0062ab) | shadow: `var(--color-border-brand-neutral)` `var(--color-border-brand-neutral)` |

<!-- ds:section id=states-dark -->
## States (Dark Theme)

| Variant | State | Background | Border | Text / Icon | Other |
|---|---|---|---|---|---|
| default | checked |  | `var(--color-border-brand-base)` (#4c9fdd) |  |  |
| default | default | `var(--color-background-component)` (#111619) | `var(--color-border-accessible)` (#8898a5) | `var(--color-text-neutral)` (#b8c1c9) | opacity: 0.7 |
| default | focus |  | `var(--color-border-accessible)` (#8898a5) |  | shadow: `var(--color-border-brand-base)`; focus-ring: `var(--color-border-brand-base)` |
| default | hover | `var(--color-background-brand-lighter)` (#1e262c) | `var(--color-border-strong)` (#b8c1c9) |  | shadow: `var(--color-border-brand-base)` `var(--color-border-brand-base)` |
| default | selected | `var(--color-background-brand-lighter)` (#1e262c) |  | `var(--color-text-brand-strong)` (#94c5ea) | shadow: `var(--color-border-brand-neutral)` `var(--color-border-brand-neutral)` |

## Source Mapping

| Source | Location |
|---|---|
| Root spec | `components/synapse/root-spec.md` |
| Figma variables | Extracted via `figma_get_local_variables` MCP tool |
| Theme CSS | `components/synapse-theme.css` |
| Component map | `data/synapse-component-figma-map.json` |
<!-- auto:generated:end -->
