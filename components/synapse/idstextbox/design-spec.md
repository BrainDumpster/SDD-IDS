<!-- auto:generated:start -->
<!-- ds:inherits root-spec -->
# IdsTextBox Design Spec

> Generated 2026-06-12T07:10:00Z. Component-specific override spec — inherits global tokens, baselines, and theming from root-spec.md.

<!-- ds:section id=metadata -->
## Metadata

| Property | Value |
|---|---|
| Component | IdsTextBox |
| Category |  |
| Figma Page |  |
| Node ID |  |
| Design System | Synapse |

<!-- ds:section id=anatomy -->
## Anatomy

The component is composed of these structural parts:

- **control**
- **errorIcon**
- **errorText**
- **helperRow**
- **helperText**
- **large**
- **root**
- **small**
- **suffixIcon**
- **textArea**
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
- `var(--color-background-component)` = #ffffff (light) / #111619 (dark)
- `var(--color-background-gray-light)` = #eaeaea (light) / #393939 (dark)
- `var(--color-border-accessible)` = #757575 (light) / #8898a5 (dark)
- `var(--color-border-alerting-critical-base)` = #af0000 (light) / #dd9494 (dark)
- `var(--color-border-brand-base)` = #0076ce (light) / #4c9fdd (dark)
- `var(--color-border-strong)` = #252525 (light) / #b8c1c9 (dark)
- `var(--color-text-critical)` = #af0000 (light) / #dd9494 (dark)
- `var(--color-text-disabled)` = #757575 (light) / #9e9e9e (dark)
- `var(--color-text-neutral)` = #4d4d4d (light) / #b8c1c9 (dark)
- `var(--font-line-height-line-height-20)` = 20px
- `var(--font-size-body-2)` = 14px
- `var(--padding-padding-10)` = 10px
- `var(--padding-padding-16)` = 16px
- `var(--spacing-space-10)` = 10px
- `var(--spacing-space-4)` = 4px
- `var(--spacing-space-8)` = 8px
- `var(--text-box-control-radius)` = var(--corner-radius-radius-4)
- `var(--text-box-focus-ring-radius)` = var(--corner-radius-radius-4)

<!-- ds:section id=states-light -->
## States (Light Theme)

| Variant | State | Background | Border | Text / Icon | Other |
|---|---|---|---|---|---|
| default | default | `var(--color-background-gray-light)` (#eaeaea) | `var(--color-border-alerting-critical-base)` (#af0000) | `var(--color-text-critical)` (#af0000) | opacity: 0.6; radius: `var(--text-box-control-radius)` |
| default | focus |  | `var(--border-width-border-1)` (var(--border-width-border-default)) `var(--color-border-brand-base)` (#0076ce) |  | radius: `var(--text-box-focus-ring-radius)` |
| default | hover |  | `var(--color-border-strong)` (#252525) |  |  |

<!-- ds:section id=states-dark -->
## States (Dark Theme)

| Variant | State | Background | Border | Text / Icon | Other |
|---|---|---|---|---|---|
| default | default | `var(--color-background-gray-light)` (#393939) | `var(--color-border-alerting-critical-base)` (#dd9494) | `var(--color-text-critical)` (#dd9494) | opacity: 0.6; radius: `var(--text-box-control-radius)` |
| default | focus |  | `var(--border-width-border-1)` (var(--border-width-border-default)) `var(--color-border-brand-base)` (#4c9fdd) |  | radius: `var(--text-box-focus-ring-radius)` |
| default | hover |  | `var(--color-border-strong)` (#b8c1c9) |  |  |

## Source Mapping

| Source | Location |
|---|---|
| Root spec | `components/synapse/root-spec.md` |
| Figma variables | Extracted via `figma_get_local_variables` MCP tool |
| Theme CSS | `components/synapse-theme.css` |
| Component map | `data/synapse-component-figma-map.json` |
<!-- auto:generated:end -->
