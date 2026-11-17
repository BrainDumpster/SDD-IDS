<!-- auto:generated:start -->
<!-- ds:inherits root-spec -->
# IdsTimePicker Design Spec

> Generated 2026-06-12T07:10:00Z. Component-specific override spec — inherits global tokens, baselines, and theming from root-spec.md.

<!-- ds:section id=metadata -->
## Metadata

| Property | Value |
|---|---|
| Component | IdsTimePicker |
| Category |  |
| Figma Page |  |
| Node ID |  |
| Design System | Synapse |

<!-- ds:section id=anatomy -->
## Anatomy

The component is composed of these structural parts:

- **arrowBtn**
- **arrowUp**
- **clockIconBtn**
- **disabled**
- **errorMessage**
- **fieldContainer**
- **fieldGroup**
- **filled**
- **formatHint**
- **label**
- **mouseActivated**
- **open**
- **periodScroll**
- **positionWrapper**
- **root**
- **sizeLarge**
- **sizeSmall**
- **textInput**
- **timeColumn**
- **timePopup**
- **valueCell**
- **widePadding**

Implementations must render these parts in order. Each part maps to a single DOM element (or equivalent in the target framework). Parts can be omitted if marked optional.

<!-- ds:section id=layout -->
## Layout & Measurements

> Layout data not yet extracted. Run `python scripts/figma_layout_enricher.py` to populate.

<!-- ds:section id=tokens -->
## Component Tokens

> Global tokens (colors, spacing, typography, elevation): see [root-spec.md](../root-spec.md).
> Below are tokens referenced by this component's CSS module.

- `var(--time-picker-control-radius)` = var(--corner-radius-radius-4)
- `var(--time-picker-focus-ring-radius)` = var(--corner-radius-radius-4)

<!-- ds:section id=states-light -->
## States (Light Theme)

| Variant | State | Background | Border | Text / Icon | Other |
|---|---|---|---|---|---|
| default | default |  |  |  | radius: `var(--time-picker-control-radius)` |
| default | disabled |  |  |  | opacity: 0.4 |
| default | focus |  |  |  | radius: `var(--time-picker-focus-ring-radius)` |

<!-- ds:section id=states-dark -->
## States (Dark Theme)

| Variant | State | Background | Border | Text / Icon | Other |
|---|---|---|---|---|---|
| default | default |  |  |  | radius: `var(--time-picker-control-radius)` |
| default | disabled |  |  |  | opacity: 0.4 |
| default | focus |  |  |  | radius: `var(--time-picker-focus-ring-radius)` |

## Source Mapping

| Source | Location |
|---|---|
| Root spec | `components/synapse/root-spec.md` |
| Figma variables | Extracted via `figma_get_local_variables` MCP tool |
| Theme CSS | `components/synapse-theme.css` |
| Component map | `data/synapse-component-figma-map.json` |
<!-- auto:generated:end -->
