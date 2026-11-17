<!-- auto:generated:start -->
<!-- ds:inherits root-spec -->
# IdsGetStarted Design Spec

> Generated 2026-06-12T07:10:00Z. Component-specific override spec — inherits global tokens, baselines, and theming from root-spec.md.

<!-- ds:section id=metadata -->
## Metadata

| Property | Value |
|---|---|
| Component | IdsGetStarted |
| Category |  |
| Figma Page |  |
| Node ID |  |
| Design System | Synapse |

<!-- ds:section id=anatomy -->
## Anatomy

The component is composed of these structural parts:

- **bodyGroup**
- **card**
- **cardIcon**
- **cardIconCompleted**
- **cardRequired**
- **cardTitle**
- **cardTitleBand**
- **cardTitleBandRequired**
- **cardTitleSequential**
- **cardTrack**
- **cardTrackNoOverflow**
- **cardViewport**
- **configureButtonDisabled**
- **container**
- **contentPanel**
- **description**
- **hero**
- **heroBackground**
- **heroCopy**
- **heroShadowBand**
- **heroSubtitle**
- **heroTitle**
- **iconBadge**
- **iconBadgeCompleted**
- **iconBadgeIncomplete**
- **mastheadSlot**
- **note**
- **noteLabel**
- **overflowEdge**
- **overflowEdgeLeft**
- **overflowEdgeRight**
- **overflowGradient**
- **overflowNavButton**
- **shell**
- **skipButton**
- **skipButtonDisabled**
- **skipButtonEnabled**

Implementations must render these parts in order. Each part maps to a single DOM element (or equivalent in the target framework). Parts can be omitted if marked optional.

<!-- ds:section id=layout -->
## Layout & Measurements

> Layout data not yet extracted. Run `python scripts/figma_layout_enricher.py` to populate.

<!-- ds:section id=tokens -->
## Component Tokens

> Global tokens (colors, spacing, typography, elevation): see [root-spec.md](../root-spec.md).
> Below are tokens referenced by this component's CSS module.

- `var(--color-background-controls-brand-base)` = #0076ce
- `var(--color-background-gray-lighter)` = #f4f4f4 (light) / #393939 (dark)
- `var(--color-background-masthead-brand-base)` = #0076ce (light) / #1e262c (dark)
- `var(--color-background-surface-1)` = #f4f4f4 (light) / #111619 (dark)
- `var(--color-background-surface-2)` = #ffffff (light) / #1e262c (dark)
- `var(--color-border-accessible)` = #757575 (light) / #8898a5 (dark)
- `var(--color-border-brand-base)` = #0076ce (light) / #4c9fdd (dark)
- `var(--color-border-disabled)` = #757575 (light) / #9e9e9e (dark)
- `var(--color-border-transparent-brand)` = rgba(255,255,255,0.00) (light) / #4c9fdd (dark)
- `var(--color-gradient-overflow-horizontal-end)` = rgba(244,244,244,0.00) (light) / rgba(17,22,25,0.00) (dark)
- `var(--color-gradient-overflow-horizontal-middle)` = rgba(244,244,244,0.90) (light) / rgba(17,22,25,0.90) (dark)
- `var(--color-gradient-overflow-horizontal-start)` = #f4f4f4 (light) / #111619 (dark)
- `var(--color-icon-accessible)` = #757575 (light) / #8898a5 (dark)
- `var(--color-icon-alerting-success)` = ?
- `var(--color-icon-white)` = #ffffff
- `var(--color-text-brand-strong)` = #0062ab (light) / #94c5ea (dark)
- `var(--color-text-critical)` = #af0000 (light) / #dd9494 (dark)
- `var(--color-text-disabled)` = #757575 (light) / #9e9e9e (dark)
- `var(--color-text-neutral)` = #4d4d4d (light) / #b8c1c9 (dark)
- `var(--color-text-white)` = #ffffff
- `var(--gs-card-width)` = ?
- `var(--gs-hero-height)` = ?
- `var(--gs-masthead-height)` = ?

<!-- ds:section id=states-light -->
## States (Light Theme)

| Variant | State | Background | Border | Text / Icon | Other |
|---|---|---|---|---|---|
| default | default | `var(--color-gradient-overflow-horizontal-start)` (#f4f4f4) `var(--color-gradient-overflow-horizontal-middle)` (rgba(244,244,244,0.90)) `var(--color-gradient-overflow-horizontal-end)` (rgba(244,244,244,0.00)) | `var(--color-border-disabled)` (#757575) | `var(--color-icon-accessible)` (#757575) |  |
| default | focus |  |  |  | focus-ring: `var(--color-border-brand-base)` |

<!-- ds:section id=states-dark -->
## States (Dark Theme)

| Variant | State | Background | Border | Text / Icon | Other |
|---|---|---|---|---|---|
| default | default | `var(--color-gradient-overflow-horizontal-start)` (#111619) `var(--color-gradient-overflow-horizontal-middle)` (rgba(17,22,25,0.90)) `var(--color-gradient-overflow-horizontal-end)` (rgba(17,22,25,0.00)) | `var(--color-border-disabled)` (#9e9e9e) | `var(--color-icon-accessible)` (#8898a5) |  |
| default | focus |  |  |  | focus-ring: `var(--color-border-brand-base)` |

## Source Mapping

| Source | Location |
|---|---|
| Root spec | `components/synapse/root-spec.md` |
| Figma variables | Extracted via `figma_get_local_variables` MCP tool |
| Theme CSS | `components/synapse-theme.css` |
| Component map | `data/synapse-component-figma-map.json` |
<!-- auto:generated:end -->
