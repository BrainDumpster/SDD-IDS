<!-- auto:generated:start -->
<!-- ds:inherits root-spec -->
# DropdownMenu Design Spec

> Generated 2026-06-12T07:10:00Z. Component-specific override spec — inherits global tokens, baselines, and theming from root-spec.md.

<!-- ds:section id=metadata -->
## Metadata

| Property | Value |
|---|---|
| Component | DropdownMenu |
| Category | Components |
| Figma Page | Components |
| Node ID | 49971:54127 |
| Design System | Synapse |

<!-- ds:section id=anatomy -->
## Anatomy

The component is composed of these structural parts:

- **checkboxDash**
- **checkboxOuter**
- **checkboxTick**
- **clearAllButton**
- **footerAction**
- **item**
- **leadingControl**
- **optionsScrollRegion**
- **popup**
- **popupStandalone**
- **radioInner**
- **radioOuter**
- **searchField**
- **searchIcon**
- **searchInput**
- **searchInputWrap**
- **searchRow**
- **sectionDivider**
- **sectionHeader**
- **selectAllButton**
- **selectAllCheckbox**
- **selectAllClearAllRow**
- **triggerFull**
- **triggerMeasure**
- **triggerReset**

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
- `var(--color-background-controls-brand-base)` = #0076ce
- `var(--color-background-controls-brand-strong)` = #0062ab
- `var(--color-background-gray-base)` = #757575 (light) / #9e9e9e (dark)
- `var(--color-background-gray-lighter)` = #f4f4f4 (light) / #393939 (dark)
- `var(--color-border-accessible)` = #757575 (light) / #8898a5 (dark)
- `var(--color-border-brand-base)` = #0076ce (light) / #4c9fdd (dark)
- `var(--color-border-brand-neutral)` = #0076ce (light) / #8898a5 (dark)
- `var(--color-border-disabled)` = #757575 (light) / #9e9e9e (dark)
- `var(--color-border-neutral-light)` = #757575 (light) / #34414c (dark)
- `var(--color-border-strong)` = #252525 (light) / #b8c1c9 (dark)
- `var(--color-border-transparent-brand)` = rgba(255,255,255,0.00) (light) / #4c9fdd (dark)
- `var(--color-icon-brand-base)` = #0076ce (light) / #4c9fdd (dark)
- `var(--color-icon-disabled)` = #757575 (light) / #c5c5c5 (dark)
- `var(--color-icon-inverse)` = #ffffff (light) / #252525 (dark)
- `var(--color-icon-white)` = #ffffff
- `var(--color-text-brand-strong)` = #0062ab (light) / #94c5ea (dark)
- `var(--color-text-disabled)` = #757575 (light) / #9e9e9e (dark)
- `var(--color-text-neutral)` = #4d4d4d (light) / #b8c1c9 (dark)
- `var(--color-text-neutral-strong)` = #252525 (light) / #e6e9ec (dark)
- `var(--dropdown-control-radius)` = var(--corner-radius-radius-4)
- `var(--dropdown-focus-ring-radius)` = var(--corner-radius-radius-4)
- `var(--dropdown-menu-radius)` = var(--corner-radius-radius-4)
- `var(--corner-radius-radius-2)` = 2px (checkbox leading control only)
- `var(--corner-radius-radius-6)` = 6px (search field)
- `var(--font-line-height-line-height-20)` = 20px
- `var(--font-size-body-2)` = 14px
- `var(--padding-padding-10)` = 10px
- `var(--padding-padding-16)` = 16px
- `var(--padding-padding-2)` = 2px
- `var(--padding-padding-4)` = 4px
- `var(--padding-padding-6)` = 6px
- `var(--padding-padding-8)` = 8px
- `var(--spacing-space-16)` = 16px
- `var(--spacing-space-8)` = 8px

<!-- ds:section id=states-light -->
## States (Light Theme)

| Variant | State | Background | Border | Text / Icon | Other |
|---|---|---|---|---|---|
| default | active | `var(--color-background-brand-light)` (#d9eaf8) |  | `var(--color-text-brand-strong)` (#0062ab) | shadow: `var(--color-border-brand-neutral)` `var(--color-border-brand-neutral)` |
| default | default | `var(--color-icon-brand-base)` (#0076ce) | `var(--border-width-border-1)` (var(--border-width-border-default)) `var(--color-border-accessible)` (#757575) | `var(--color-text-brand-strong)` (#0062ab) | radius: `var(--dropdown-control-radius)` |
| default | disabled | `var(--color-background-gray-base)` (#757575) | `var(--color-border-disabled)` (#757575) | `var(--color-icon-inverse)` (#ffffff) | shadow: `var(--color-border-neutral-light)` `var(--color-border-disabled)` |
| default | focus |  | `var(--border-width-border-1)` (var(--border-width-border-default)) `var(--color-border-brand-base)` (#0076ce) |  | radius: `var(--dropdown-focus-ring-radius)` |
| default | highlighted | `var(--color-background-brand-lighter)` (#ebf4fb) |  | `var(--color-text-neutral)` (#4d4d4d) | shadow: `var(--color-border-brand-base)` `var(--color-border-brand-base)` |
| default | hover | `var(--color-background-controls-brand-strong)` (#0062ab) | `var(--color-border-strong)` (#252525) | `var(--color-text-neutral)` (#4d4d4d) | shadow: `var(--color-border-brand-base)` `var(--color-border-brand-base)` |
| default | indeterminate | `var(--color-background-component)` (#ffffff) | `var(--color-border-brand-base)` (#0076ce) |  |  |
| default | selected | `var(--color-background-component)` (#ffffff) | `var(--color-border-brand-base)` (#0076ce) | `var(--color-text-neutral)` (#4d4d4d) | shadow: `var(--color-border-brand-neutral)` `var(--color-border-brand-neutral)` |

<!-- ds:section id=states-dark -->
## States (Dark Theme)

| Variant | State | Background | Border | Text / Icon | Other |
|---|---|---|---|---|---|
| default | active | `var(--color-background-brand-light)` (#34414c) |  | `var(--color-text-brand-strong)` (#94c5ea) | shadow: `var(--color-border-brand-neutral)` `var(--color-border-brand-neutral)` |
| default | default | `var(--color-icon-brand-base)` (#4c9fdd) | `var(--border-width-border-1)` (var(--border-width-border-default)) `var(--color-border-accessible)` (#8898a5) | `var(--color-text-brand-strong)` (#94c5ea) | radius: `var(--dropdown-control-radius)` |
| default | disabled | `var(--color-background-gray-base)` (#9e9e9e) | `var(--color-border-disabled)` (#9e9e9e) | `var(--color-icon-inverse)` (#252525) | shadow: `var(--color-border-neutral-light)` `var(--color-border-disabled)` |
| default | focus |  | `var(--border-width-border-1)` (var(--border-width-border-default)) `var(--color-border-brand-base)` (#4c9fdd) |  | radius: `var(--dropdown-focus-ring-radius)` |
| default | highlighted | `var(--color-background-brand-lighter)` (#1e262c) |  | `var(--color-text-neutral)` (#b8c1c9) | shadow: `var(--color-border-brand-base)` `var(--color-border-brand-base)` |
| default | hover | `var(--color-background-controls-brand-strong)` (#0062ab) | `var(--color-border-strong)` (#b8c1c9) | `var(--color-text-neutral)` (#b8c1c9) | shadow: `var(--color-border-brand-base)` `var(--color-border-brand-base)` |
| default | indeterminate | `var(--color-background-component)` (#111619) | `var(--color-border-brand-base)` (#4c9fdd) |  |  |
| default | selected | `var(--color-background-component)` (#111619) | `var(--color-border-brand-base)` (#4c9fdd) | `var(--color-text-neutral)` (#b8c1c9) | shadow: `var(--color-border-brand-neutral)` `var(--color-border-brand-neutral)` |

## Source Mapping

| Source | Location |
|---|---|
| Root spec | `components/synapse/root-spec.md` |
| Figma variables | Extracted via `figma_get_local_variables` MCP tool |
| Theme CSS | `components/synapse-theme.css` |
| Component map | `data/synapse-component-figma-map.json` |
<!-- auto:generated:end -->
