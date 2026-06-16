<!-- auto:generated:start -->
<!-- ds:inherits root-spec -->
# DataGrid Design Spec

> Generated 2026-06-12T07:10:00Z. Component-specific override spec — inherits global tokens, baselines, and theming from root-spec.md.

<!-- ds:section id=metadata -->
## Metadata

| Property | Value |
|---|---|
| Component | DataGrid |
| Category | Tables |
| Figma Page | Tables |
| Node ID | 37721:112481 |
| Design System | Synapse |

<!-- ds:section id=anatomy -->
## Anatomy

The component is composed of these structural parts:

- **sortButton**
- **sortIcon**
- **table**
- **td**
- **th**
- **tr**
- **wrapper**

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
- `var(--color-background-surface-1)` = #f4f4f4 (light) / #111619 (dark)
- `var(--color-border-brand-base)` = #0076ce (light) / #4c9fdd (dark)
- `var(--color-border-light)` = #c5c5c5 (light) / #34414c (dark)
- `var(--color-border-lighter)` = #eaeaea (light) / #1e262c (dark)
- `var(--color-icon-neutral)` = #4d4d4d (light) / #b8c1c9 (dark)
- `var(--color-text-brand-base)` = #0076ce (light) / #4c9fdd (dark)
- `var(--color-text-neutral)` = #4d4d4d (light) / #b8c1c9 (dark)
- `var(--color-text-neutral-strong)` = #252525 (light) / #e6e9ec (dark)
- `var(--corner-radius-radius-2)` = 2px
- `var(--font-line-height-line-height-20)` = 20px
- `var(--font-size-body-2)` = 14px
- `var(--padding-padding-10)` = 10px
- `var(--padding-padding-16)` = 16px
- `var(--spacing-space-4)` = 4px

<!-- ds:section id=states-light -->
## States (Light Theme)

| Variant | State | Background | Border | Text / Icon | Other |
|---|---|---|---|---|---|
| default | default | `var(--color-background-surface-1)` (#f4f4f4) |  | `var(--color-icon-neutral)` (#4d4d4d) |  |
| default | focus |  |  |  | focus-ring: `var(--border-width-border-2)` `var(--color-border-brand-base)`; radius: `var(--corner-radius-radius-2)` |
| default | hover | `var(--color-background-brand-lighter)` (#ebf4fb) |  | `var(--color-text-brand-base)` (#0076ce) |  |

<!-- ds:section id=states-dark -->
## States (Dark Theme)

| Variant | State | Background | Border | Text / Icon | Other |
|---|---|---|---|---|---|
| default | default | `var(--color-background-surface-1)` (#111619) |  | `var(--color-icon-neutral)` (#b8c1c9) |  |
| default | focus |  |  |  | focus-ring: `var(--border-width-border-2)` `var(--color-border-brand-base)`; radius: `var(--corner-radius-radius-2)` |
| default | hover | `var(--color-background-brand-lighter)` (#1e262c) |  | `var(--color-text-brand-base)` (#4c9fdd) |  |

<!-- ds:section id=interactions -->
## Interactions (Component-Specific)

> Baseline interactions (focus management, Tab/Enter/Space/Escape, touch targets) are defined in root-spec.md.
> This section documents additional or overriding behaviors for this component.

**Pattern**: grid

### Behaviors

- Virtualized row rendering for large datasets
- Sortable and filterable columns
- Editable cells with inline editing
- Row selection (single or multi-select)
- Column reordering via drag

### Keyboard

| Key | Action |
|---|---|
| ArrowUp | Navigate to cell above |
| ArrowDown | Navigate to cell below |
| ArrowLeft | Navigate to cell left |
| ArrowRight | Navigate to cell right |
| Enter | Enter edit mode on focused cell |
| Escape | Cancel cell edit and revert |
| Space | Toggle row selection |
| Ctrl+A | Select all rows |

### ARIA

| Element | Attributes |
|---|---|
| root | {'role': 'grid', 'aria-rowcount': 'Total row count (including virtualized/off-screen rows)', 'aria-colcount': 'Total column count'} |
| header | {'aria-sort': 'ascending | descending | none'} |
| row | {'aria-selected': 'true/false on selectable rows', 'aria-rowindex': '1-based index in full dataset'} |

## Source Mapping

| Source | Location |
|---|---|
| Root spec | `components/synapse/root-spec.md` |
| Figma variables | Extracted via `figma_get_local_variables` MCP tool |
| Theme CSS | `components/synapse-theme.css` |
| Component map | `data/synapse-component-figma-map.json` |
<!-- auto:generated:end -->
