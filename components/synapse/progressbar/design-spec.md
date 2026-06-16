<!-- auto:generated:start -->
<!-- ds:inherits root-spec -->
# ProgressBar Design Spec

> Generated 2026-06-12T07:10:00Z. Component-specific override spec — inherits global tokens, baselines, and theming from root-spec.md.

<!-- ds:section id=metadata -->
## Metadata

| Property | Value |
|---|---|
| Component | ProgressBar |
| Category | Components |
| Figma Page | Components |
| Node ID | 50724:317216 |
| Design System | Synapse |

<!-- ds:section id=anatomy -->
## Anatomy

The component is composed of these structural parts:

- **helperIcon**
- **helperRow**
- **helperText**
- **indicator**
- **inlineRow**
- **inlineValue**
- **label**
- **labeledBlock**
- **medium**
- **meta**
- **root**
- **thick**
- **thin**
- **track**
- **trackBg**
- **value**

Implementations must render these parts in order. Each part maps to a single DOM element (or equivalent in the target framework). Parts can be omitted if marked optional.

<!-- ds:section id=layout -->
## Layout & Measurements

<!-- ds:section id=tokens -->
## Component Tokens

> Global tokens (colors, spacing, typography, elevation): see [root-spec.md](../root-spec.md).
> Below are tokens referenced by this component's CSS module.

- `var(--border-width-border-1)` = var(--border-width-border-default)
- `var(--color-background-alerting-critical)` = #af0000 (light) / #c74c4c (dark)
- `var(--color-background-alerting-minor)` = #ffc700
- `var(--color-background-alerting-success)` = ?
- `var(--color-background-brand-base)` = #0076ce (light) / #4c9fdd (dark)
- `var(--color-background-gray-light)` = #eaeaea (light) / #393939 (dark)
- `var(--color-border-accessible)` = #757575 (light) / #8898a5 (dark)
- `var(--color-border-alerting-critical-base)` = #af0000 (light) / #dd9494 (dark)
- `var(--color-border-alerting-minor-transparent)` = #9c622e (light) / rgba(255,255,255,0.00) (dark)
- `var(--color-border-alerting-success-base)` = #1b8500 (light) / #9fcc94 (dark)
- `var(--color-border-brand-base)` = #0076ce (light) / #4c9fdd (dark)
- `var(--color-text-neutral)` = #4d4d4d (light) / #b8c1c9 (dark)
- `var(--color-text-neutral-strong)` = #252525 (light) / #e6e9ec (dark)
- `var(--font-line-height-line-height-20)` = 20px
- `var(--font-size-body-2)` = 14px
- `var(--padding-padding-8)` = 8px
- `var(--progress-bar-control-radius)` = var(--corner-radius-radius-2)
- `var(--sizing-size-16)` = 16px
- `var(--sizing-size-4)` = 4px
- `var(--sizing-size-8)` = 8px
- `var(--spacing-space-4)` = 4px

<!-- ds:section id=states-light -->
## States (Light Theme)

| Variant | State | Background | Border | Text / Icon | Other |
|---|---|---|---|---|---|
| default | default | `var(--color-background-alerting-critical)` (#af0000) | `var(--color-border-alerting-critical-base)` (#af0000) | `var(--color-text-neutral)` (#4d4d4d) | radius: `var(--progress-bar-control-radius)` |

<!-- ds:section id=states-dark -->
## States (Dark Theme)

| Variant | State | Background | Border | Text / Icon | Other |
|---|---|---|---|---|---|
| default | default | `var(--color-background-alerting-critical)` (#c74c4c) | `var(--color-border-alerting-critical-base)` (#dd9494) | `var(--color-text-neutral)` (#b8c1c9) | radius: `var(--progress-bar-control-radius)` |

## Source Mapping

| Source | Location |
|---|---|
| Root spec | `components/synapse/root-spec.md` |
| Figma variables | Extracted via `figma_get_local_variables` MCP tool |
| Theme CSS | `components/synapse-theme.css` |
| Component map | `data/synapse-component-figma-map.json` |
<!-- auto:generated:end -->
