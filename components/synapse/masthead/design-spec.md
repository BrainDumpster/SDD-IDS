<!-- auto:generated:start -->
<!-- ds:inherits root-spec -->
# Masthead Design Spec

> Generated 2026-06-12T07:10:00Z. Component-specific override spec — inherits global tokens, baselines, and theming from root-spec.md.

<!-- ds:section id=metadata -->
## Metadata

| Property | Value |
|---|---|
| Component | Masthead |
| Category | Components |
| Figma Page | Components |
| Node ID | 47807:7569 |
| Design System | Synapse |

<!-- ds:section id=anatomy -->
## Anatomy

The component is composed of these structural parts:

- **actionButtonContainer**
- **actionIconButton**
- **actionIconGlyph**
- **actions**
- **appLauncherSlot**
- **avatarAction**
- **avatarChip**
- **avatarImage**
- **avatarSlot**
- **iconButton**
- **iconsSlot**
- **left**
- **logo**
- **masthead**
- **productName**

Implementations must render these parts in order. Each part maps to a single DOM element (or equivalent in the target framework). Parts can be omitted if marked optional.

<!-- ds:section id=layout -->
## Layout & Measurements

<!-- ds:section id=tokens -->
## Component Tokens

> Global tokens (colors, spacing, typography, elevation): see [root-spec.md](../root-spec.md).
> Below are tokens referenced by this component's CSS module.

- `var(--border-width-border-1)` = var(--border-width-border-default)
- `var(--border-width-border-default)` = 1px
- `var(--color-background-masthead-brand-base)` = #0076ce (light) / #1e262c (dark)
- `var(--color-background-masthead-brand-strong)` = #0062ab (light) / #34414c (dark)
- `var(--color-background-masthead-brand-stronger)` = #06528a (light) / #455666 (dark)
- `var(--color-border-transparent-neutral)` = rgba(255,255,255,0.00) (light) / #8898a5 (dark)
- `var(--color-border-white)` = #ffffff
- `var(--color-text-white)` = #ffffff
- `var(--corner-radius-radius-4)` = 4px
- `var(--font-line-height-line-height-20)` = 20px
- `var(--font-line-height-line-height-32)` = 32px
- `var(--font-size-body-1)` = 16px
- `var(--font-size-body-2)` = 14px
- `var(--font-size-header-6)` = 18px
- `var(--padding-padding-16)` = 16px
- `var(--padding-padding-8)` = 8px
- `var(--scale-16)` = 16px
- `var(--scale-24)` = 24px
- `var(--scale-32)` = 32px
- `var(--scale-56)` = 56px
- `var(--spacing-space-8)` = 8px

<!-- ds:section id=states-light -->
## States (Light Theme)

| Variant | State | Background | Border | Text / Icon | Other |
|---|---|---|---|---|---|
| default | active | `var(--color-background-masthead-brand-stronger)` (#06528a) |  |  |  |
| default | default | `var(--color-background-masthead-brand-base)` (#0076ce) | `var(--border-width-border-1)` (var(--border-width-border-default)) `var(--color-border-white)` (#ffffff) | `var(--color-text-white)` (#ffffff) | opacity: 1; radius: `var(--corner-radius-radius-4)` |
| default | focus |  |  |  | focus-ring: `var(--border-width-border-default)` `var(--color-border-white)` |
| default | hover | `var(--color-background-masthead-brand-strong)` (#0062ab) |  |  |  |

<!-- ds:section id=states-dark -->
## States (Dark Theme)

| Variant | State | Background | Border | Text / Icon | Other |
|---|---|---|---|---|---|
| default | active | `var(--color-background-masthead-brand-stronger)` (#455666) |  |  |  |
| default | default | `var(--color-background-masthead-brand-base)` (#1e262c) | `var(--border-width-border-1)` (var(--border-width-border-default)) `var(--color-border-white)` (#ffffff) | `var(--color-text-white)` (#ffffff) | opacity: 1; radius: `var(--corner-radius-radius-4)` |
| default | focus |  |  |  | focus-ring: `var(--border-width-border-default)` `var(--color-border-white)` |
| default | hover | `var(--color-background-masthead-brand-strong)` (#34414c) |  |  |  |

## Source Mapping

| Source | Location |
|---|---|
| Root spec | `components/synapse/root-spec.md` |
| Figma variables | Extracted via `figma_get_local_variables` MCP tool |
| Theme CSS | `components/synapse-theme.css` |
| Component map | `data/synapse-component-figma-map.json` |
<!-- auto:generated:end -->
