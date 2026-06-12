<!-- auto:generated:start -->
<!-- ds:inherits root-spec -->
# IdsWizard Design Spec

> Generated 2026-06-12T07:10:00Z. Component-specific override spec — inherits global tokens, baselines, and theming from root-spec.md.

<!-- ds:section id=metadata -->
## Metadata

| Property | Value |
|---|---|
| Component | IdsWizard |
| Category |  |
| Figma Page |  |
| Node ID |  |
| Design System | Synapse |

<!-- ds:section id=anatomy -->
## Anatomy

The component is composed of these structural parts:

- **backdrop**
- **body**
- **closeButton**
- **closeIcon**
- **contentPane**
- **fallbackText**
- **footer**
- **footerActions**
- **full-screen**
- **header**
- **headerTitle**
- **large**
- **medium**
- **modalPopup**
- **modalRoot**
- **modalTriggerReset**
- **pageContent**
- **pageContentScroll**
- **pageTitle**
- **pageTitleWrap**
- **primaryButton**
- **progress**
- **root**
- **secondaryButton**
- **statusIcon**
- **statuserror**
- **statusnone**
- **statussuccess**
- **statuswarning**
- **stepItemActive**
- **stepLabel**
- **stepsPane**
- **substepItem**
- **substepItemActive**
- **substepList**
- **x-large**

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
- `var(--color-background-brand-lighter)` = #ebf4fb (light) / #1e262c (dark)
- `var(--color-background-component)` = #ffffff (light) / #111619 (dark)
- `var(--color-background-controls-brand-base)` = #0076ce
- `var(--color-background-gray-lighter)` = #f4f4f4 (light) / #393939 (dark)
- `var(--color-border-accessible)` = #757575 (light) / #8898a5 (dark)
- `var(--color-border-brand-base)` = #0076ce (light) / #4c9fdd (dark)
- `var(--color-border-disabled)` = #757575 (light) / #9e9e9e (dark)
- `var(--color-border-transparent-brand)` = rgba(255,255,255,0.00) (light) / #4c9fdd (dark)
- `var(--color-gradient-overflow-vertical-end)` = rgba(255,255,255,0.00) (light) / rgba(17,22,25,0.00) (dark)
- `var(--color-gradient-overflow-vertical-start)` = rgba(182,182,182,0.30) (light) / rgba(17,22,25,0.40) (dark)
- `var(--color-icon-alerting-critical)` = #af0000 (light) / #c74c4c (dark)
- `var(--color-icon-alerting-minor)` = ?
- `var(--color-icon-alerting-success)` = ?
- `var(--color-icon-neutral)` = #4d4d4d (light) / #b8c1c9 (dark)
- `var(--color-text-brand-strong)` = #0062ab (light) / #94c5ea (dark)
- `var(--color-text-disabled)` = #757575 (light) / #9e9e9e (dark)
- `var(--color-text-neutral)` = #4d4d4d (light) / #b8c1c9 (dark)
- `var(--color-text-neutral-strong)` = #252525 (light) / #e6e9ec (dark)
- `var(--color-text-white)` = #ffffff
- `var(--corner-radius-radius-2)` = 2px
- `var(--modal-control-radius)` = var(--corner-radius-radius-16)

<!-- ds:section id=states-light -->
## States (Light Theme)

| Variant | State | Background | Border | Text / Icon | Other |
|---|---|---|---|---|---|
| default | default | `var(--color-background-controls-brand-base)` (#0076ce) | `var(--border-width-border-1)` (var(--border-width-border-default)) `var(--color-border-transparent-brand)` (rgba(255,255,255,0.00)) | `var(--color-text-white)` (#ffffff) | shadow: `var(--color-text-brand-strong)`; radius: `var(--corner-radius-radius-2)` |
| default | disabled | `var(--color-background-gray-lighter)` (#f4f4f4) | `var(--color-border-disabled)` (#757575) | `var(--color-text-disabled)` (#757575) |  |
| default | focus |  |  |  | focus-ring: `var(--border-width-border-2)` `var(--color-border-brand-base)` |
| default | hover | `var(--color-background-gray-lighter)` (#f4f4f4) |  |  |  |

<!-- ds:section id=states-dark -->
## States (Dark Theme)

| Variant | State | Background | Border | Text / Icon | Other |
|---|---|---|---|---|---|
| default | default | `var(--color-background-controls-brand-base)` (#0076ce) | `var(--border-width-border-1)` (var(--border-width-border-default)) `var(--color-border-transparent-brand)` (#4c9fdd) | `var(--color-text-white)` (#ffffff) | shadow: `var(--color-text-brand-strong)`; radius: `var(--corner-radius-radius-2)` |
| default | disabled | `var(--color-background-gray-lighter)` (#393939) | `var(--color-border-disabled)` (#9e9e9e) | `var(--color-text-disabled)` (#9e9e9e) |  |
| default | focus |  |  |  | focus-ring: `var(--border-width-border-2)` `var(--color-border-brand-base)` |
| default | hover | `var(--color-background-gray-lighter)` (#393939) |  |  |  |

## Source Mapping

| Source | Location |
|---|---|
| Root spec | `components/synapse/root-spec.md` |
| Figma variables | Extracted via `figma_get_local_variables` MCP tool |
| Theme CSS | `components/synapse-theme.css` |
| Component map | `data/synapse-component-figma-map.json` |
<!-- auto:generated:end -->
