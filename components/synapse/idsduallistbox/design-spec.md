<!-- auto:generated:start -->
<!-- ds:inherits root-spec -->
# IdsDualListBox Design Spec

> Generated 2026-06-12T07:10:00Z. Component-specific override spec — inherits global tokens, baselines, and theming from root-spec.md.

<!-- ds:section id=metadata -->
## Metadata

| Property | Value |
|---|---|
| Component | IdsDualListBox |
| Category |  |
| Figma Page |  |
| Node ID |  |
| Design System | Synapse |

<!-- ds:section id=anatomy -->
## Anatomy

The component is composed of these structural parts:

- **dragHandle**
- **dropPreview**
- **dropPreviewInner**
- **emptyStatus**
- **itemCheck**
- **itemContent**
- **itemDescription**
- **itemMain**
- **itemName**
- **listGroup**
- **listGroupAvailable**
- **listGroupDragOver**
- **listGroupEmpty**
- **listGroupSelected**
- **listItem**
- **listItemDragWithoutSelection**
- **listItemDragging**
- **listItemFocused**
- **listItemSelected**
- **listItemWrap**
- **listScroll**
- **listsParent**
- **metricsDivider**
- **metricsSelected**
- **metricsTotal**
- **metricsTotalValue**
- **paneHeader**
- **paneHeaderAvailable**
- **paneHeaderSelected**
- **paneMetrics**
- **paneTitle**
- **root**
- **transferBtn**
- **transferBtnDefault**
- **transferBtnDisabled**
- **transferColumn**

Implementations must render these parts in order. Each part maps to a single DOM element (or equivalent in the target framework). Parts can be omitted if marked optional.

<!-- ds:section id=layout -->
## Layout & Measurements

> Layout data not yet extracted. Run `python scripts/figma_layout_enricher.py` to populate.

<!-- ds:section id=tokens -->
## Component Tokens

> Global tokens (colors, spacing, typography, elevation): see [root-spec.md](../root-spec.md).
> Below are tokens referenced by this component's CSS module.

- `var(--color-background-component)` = #ffffff (light) / #111619 (dark)
- `var(--color-background-controls-brand-base)` = #0076ce
- `var(--color-background-controls-brand-light)` = #d9eaf8 (light) / #002642 (dark)
- `var(--color-background-controls-brand-lighter)` = #ebf4fb (light) / #003a65 (dark)
- `var(--color-background-gray-light)` = #eaeaea (light) / #393939 (dark)
- `var(--color-border-accessible)` = #757575 (light) / #8898a5 (dark)
- `var(--color-border-brand-base)` = #0076ce (light) / #4c9fdd (dark)
- `var(--color-border-disabled)` = #757575 (light) / #9e9e9e (dark)
- `var(--color-border-transparent-brand)` = rgba(255,255,255,0.00) (light) / #4c9fdd (dark)
- `var(--color-text-brand-strong)` = #0062ab (light) / #94c5ea (dark)
- `var(--color-text-neutral)` = #4d4d4d (light) / #b8c1c9 (dark)
- `var(--color-text-neutral-strong)` = #252525 (light) / #e6e9ec (dark)
- `var(--font-size-body-2)` = 14px
- `var(--padding-padding-12)` = 12px
- `var(--padding-padding-14)` = 14px
- `var(--padding-padding-16)` = 16px
- `var(--padding-padding-2)` = 2px
- `var(--padding-padding-24)` = 24px
- `var(--padding-padding-32)` = 32px
- `var(--padding-padding-8)` = 8px
- `var(--spacing-space-16)` = 16px
- `var(--spacing-space-4)` = 4px
- `var(--spacing-space-8)` = 8px

<!-- ds:section id=states-light -->
## States (Light Theme)

| Variant | State | Background | Border | Text / Icon | Other |
|---|---|---|---|---|---|
| default | default | `var(--color-background-controls-brand-base)` (#0076ce) | `var(--color-border-transparent-brand)` (rgba(255,255,255,0.00)) | `var(--color-text-neutral)` (#4d4d4d) | focus-ring: `var(--color-border-brand-base)`; opacity: 0.45 |
| default | disabled | `var(--color-background-gray-light)` (#eaeaea) | `var(--color-border-disabled)` (#757575) |  |  |
| default | focus |  |  |  | focus-ring: `var(--color-border-brand-base)` |
| default | hover | `var(--color-background-controls-brand-lighter)` (#ebf4fb) | `var(--color-border-brand-base)` (#0076ce) |  |  |

<!-- ds:section id=states-dark -->
## States (Dark Theme)

| Variant | State | Background | Border | Text / Icon | Other |
|---|---|---|---|---|---|
| default | default | `var(--color-background-controls-brand-base)` (#0076ce) | `var(--color-border-transparent-brand)` (#4c9fdd) | `var(--color-text-neutral)` (#b8c1c9) | focus-ring: `var(--color-border-brand-base)`; opacity: 0.45 |
| default | disabled | `var(--color-background-gray-light)` (#393939) | `var(--color-border-disabled)` (#9e9e9e) |  |  |
| default | focus |  |  |  | focus-ring: `var(--color-border-brand-base)` |
| default | hover | `var(--color-background-controls-brand-lighter)` (#003a65) | `var(--color-border-brand-base)` (#4c9fdd) |  |  |

## Source Mapping

| Source | Location |
|---|---|
| Root spec | `components/synapse/root-spec.md` |
| Figma variables | Extracted via `figma_get_local_variables` MCP tool |
| Theme CSS | `components/synapse-theme.css` |
| Component map | `data/synapse-component-figma-map.json` |
<!-- auto:generated:end -->
