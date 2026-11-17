<!-- auto:generated:start -->
<!-- ds:inherits root-spec -->
# MainMenuTop Design Spec

> Generated 2026-06-12T07:10:00Z. Component-specific override spec — inherits global tokens, baselines, and theming from root-spec.md.

<!-- ds:section id=metadata -->
## Metadata

| Property | Value |
|---|---|
| Component | MainMenuTop |
| Category | Navigation |
| Figma Page | Navigation |
| Node ID | 11067:54522 |
| Design System | Synapse |

<!-- ds:section id=anatomy -->
## Anatomy

The component is composed of these structural parts:

- **bar**
- **barItem**
- **chevronGlyph**
- **chevronSlot**
- **chevronSlotSmall**
- **container**
- **iconGlyph**
- **iconSlot**
- **item**
- **itemCluster**
- **itemClusterSmall**
- **itemSelected**
- **itemSmall**
- **label**
- **labelSmall**
- **menuSubmenuPopup**
- **root**

Implementations must render these parts in order. Each part maps to a single DOM element (or equivalent in the target framework). Parts can be omitted if marked optional.

<!-- ds:section id=layout -->
## Layout & Measurements

> Layout data not yet extracted. Run `python scripts/figma_layout_enricher.py` to populate.

<!-- ds:section id=tokens -->
## Component Tokens

> Global tokens (colors, spacing, typography, elevation): see [root-spec.md](../root-spec.md).
> Below are tokens referenced by this component's CSS module.

- `var(--color-background-brand-light)` = #d9eaf8 (light) / #34414c (dark)
- `var(--color-background-brand-lighter)` = #ebf4fb (light) / #1e262c (dark)
- `var(--color-background-surface-1)` = #f4f4f4 (light) / #111619 (dark)
- `var(--color-border-brand-base)` = #0076ce (light) / #4c9fdd (dark)
- `var(--color-border-brand-dark)` = #0062ab (light) / #94c5ea (dark)
- `var(--color-icon-brand-strong)` = #0062ab (light) / #94c5ea (dark)
- `var(--color-icon-neutral-strong)` = #252525 (light) / #f2f3f5 (dark)
- `var(--color-text-brand-strong)` = #0062ab (light) / #94c5ea (dark)
- `var(--color-text-neutral-strong)` = #252525 (light) / #e6e9ec (dark)
- `var(--corner-radius-radius-4)` = 4px
- `var(--padding-padding-12)` = 12px
- `var(--padding-padding-8)` = 8px
- `var(--spacing-space-16)` = 16px
- `var(--spacing-space-8)` = 8px

<!-- ds:section id=states-light -->
## States (Light Theme)

| Variant | State | Background | Border | Text / Icon | Other |
|---|---|---|---|---|---|
| default | active | `var(--color-background-brand-light)` (#d9eaf8) |  |  |  |
| default | default | `var(--color-background-brand-lighter)` (#ebf4fb) |  | `var(--color-text-neutral-strong)` (#252525) | shadow: `var(--color-border-brand-dark)` |
| default | focus |  |  |  | focus-ring: `var(--color-border-brand-base)`; radius: `var(--corner-radius-radius-4)` |
| default | hover | `var(--color-background-brand-lighter)` (#ebf4fb) |  | `var(--color-text-neutral-strong)` (#252525) |  |

<!-- ds:section id=states-dark -->
## States (Dark Theme)

| Variant | State | Background | Border | Text / Icon | Other |
|---|---|---|---|---|---|
| default | active | `var(--color-background-brand-light)` (#34414c) |  |  |  |
| default | default | `var(--color-background-brand-lighter)` (#1e262c) |  | `var(--color-text-neutral-strong)` (#e6e9ec) | shadow: `var(--color-border-brand-dark)` |
| default | focus |  |  |  | focus-ring: `var(--color-border-brand-base)`; radius: `var(--corner-radius-radius-4)` |
| default | hover | `var(--color-background-brand-lighter)` (#1e262c) |  | `var(--color-text-neutral-strong)` (#e6e9ec) |  |

## Source Mapping

| Source | Location |
|---|---|
| Root spec | `components/synapse/root-spec.md` |
| Figma variables | Extracted via `figma_get_local_variables` MCP tool |
| Theme CSS | `components/synapse-theme.css` |
| Component map | `data/synapse-component-figma-map.json` |
<!-- auto:generated:end -->
