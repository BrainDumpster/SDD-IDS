<!-- auto:generated:start -->
<!-- ds:inherits root-spec -->
# IdsDataGrid Design Spec

> Generated 2026-06-12T07:10:00Z. Component-specific override spec — inherits global tokens, baselines, and theming from root-spec.md.

<!-- ds:section id=metadata -->
## Metadata

| Property | Value |
|---|---|
| Component | IdsDataGrid |
| Category |  |
| Figma Page |  |
| Node ID |  |
| Design System | Synapse |

<!-- ds:section id=anatomy -->
## Anatomy

The component is composed of these structural parts:

- **bodyCell**
- **bodyRow**
- **cellText**
- **colSelection**
- **colSettings**
- **columnHeaderDivider**
- **columnResizeHandle**
- **contentRow**
- **detailBody**
- **detailPanel**
- **filter-default**
- **filter-hover**
- **filter-press**
- **filter-selected**
- **filterAnchor**
- **filterAnchorOpenSpacer**
- **filterIcon**
- **filterMenuLayer**
- **filterPopupIconTab**
- **filterPopupPanel**
- **filterPopupPanelBody**
- **filterPopupSearchIcon**
- **filterPopupSearchInput**
- **filterPopupSearchRow**
- **filterToggleButton**
- **footer**
- **grid**
- **gridWrap**
- **headerCell**
- **headerCellRow**
- **headerDataCell**
- **headerSelectionColumn**
- **headerTitle**
- **headerTitleRow**
- **iconButton**
- **modeLabel**
- **rowSelectionCell**
- **rowSelectionGroup**
- **selectionColumn**
- **selectionHeaderContent**
- **selectionRowContent**
- **settingsColumn**
- **settingsHeaderInner**
- **settingsIcon**
- **settingsIconActive**
- **settingsMenuLayer**
- **settingsPopupPanel**
- **settingsPopupPanelBody**
- **settingsToggleButton**
- **shell**
- **sortIcon**
- **sortIconSelected**
- **tableGrowCol**
- **tableViewport**
- **titleButton**
- **topBar**

Implementations must render these parts in order. Each part maps to a single DOM element (or equivalent in the target framework). Parts can be omitted if marked optional.

<!-- ds:section id=layout -->
## Layout & Measurements

> Layout data not yet extracted. Run `python scripts/figma_layout_enricher.py` to populate.

<!-- ds:section id=tokens -->
## Component Tokens

> Global tokens (colors, spacing, typography, elevation): see [root-spec.md](../root-spec.md).
> Below are tokens referenced by this component's CSS module.

- `var(--border-width-border-1)` = var(--border-width-border-default)
- `var(--color-background-brand-light)` = #d9eaf8 (light) / #34414c (dark)
- `var(--color-background-brand-lighter)` = #ebf4fb (light) / #1e262c (dark)
- `var(--color-background-component)` = #ffffff (light) / #111619 (dark)
- `var(--color-background-gray-neutral-lighter)` = #f4f4f4 (light) / #1e262c (dark)
- `var(--color-background-surface-1)` = #f4f4f4 (light) / #111619 (dark)
- `var(--color-border-accessible)` = #757575 (light) / #8898a5 (dark)
- `var(--color-border-brand-base)` = #0076ce (light) / #4c9fdd (dark)
- `var(--color-border-light)` = #c5c5c5 (light) / #34414c (dark)
- `var(--color-border-strong)` = #252525 (light) / #b8c1c9 (dark)
- `var(--color-icon-brand-base)` = #0076ce (light) / #4c9fdd (dark)
- `var(--color-icon-brand-stronger)` = #06528a (light) / #d9eaf8 (dark)
- `var(--color-icon-neutral)` = #4d4d4d (light) / #b8c1c9 (dark)
- `var(--color-text-neutral)` = #4d4d4d (light) / #b8c1c9 (dark)
- `var(--color-text-neutral-strong)` = #252525 (light) / #e6e9ec (dark)
- `var(--corner-radius-radius-2)` = 2px
- `var(--datagrid-chrome-icon-size)` = ?
- `var(--datagrid-selection-cell-px)` = ?
- `var(--datagrid-selection-cell-py)` = ?
- `var(--datagrid-selection-col-width)` = ?
- `var(--datagrid-selection-header-px)` = ?
- `var(--datagrid-selection-header-py)` = ?
- `var(--datagrid-settings-col-width)` = ?

<!-- ds:section id=states-light -->
## States (Light Theme)

| Variant | State | Background | Border | Text / Icon | Other |
|---|---|---|---|---|---|
| default | active | `var(--color-background-brand-light)` (#d9eaf8) |  |  |  |
| default | default | `var(--color-background-component)` (#ffffff) | `var(--color-border-accessible)` (#757575) | `var(--color-text-neutral)` (#4d4d4d) |  |
| default | disabled |  |  |  | opacity: 0.5 |
| default | focus |  |  |  | focus-ring: `var(--color-border-brand-base)`; radius: `var(--corner-radius-radius-2)` |
| default | hover | `var(--color-background-surface-1)` (#f4f4f4) |  | `var(--color-icon-brand-base)` (#0076ce) | shadow: `var(--color-border-brand-base)` |

<!-- ds:section id=states-dark -->
## States (Dark Theme)

| Variant | State | Background | Border | Text / Icon | Other |
|---|---|---|---|---|---|
| default | active | `var(--color-background-brand-light)` (#34414c) |  |  |  |
| default | default | `var(--color-background-component)` (#111619) | `var(--color-border-accessible)` (#8898a5) | `var(--color-text-neutral)` (#b8c1c9) |  |
| default | disabled |  |  |  | opacity: 0.5 |
| default | focus |  |  |  | focus-ring: `var(--color-border-brand-base)`; radius: `var(--corner-radius-radius-2)` |
| default | hover | `var(--color-background-surface-1)` (#111619) |  | `var(--color-icon-brand-base)` (#4c9fdd) | shadow: `var(--color-border-brand-base)` |

## Source Mapping

| Source | Location |
|---|---|
| Root spec | `components/synapse/root-spec.md` |
| Figma variables | Extracted via `figma_get_local_variables` MCP tool |
| Theme CSS | `components/synapse-theme.css` |
| Component map | `data/synapse-component-figma-map.json` |
<!-- auto:generated:end -->
