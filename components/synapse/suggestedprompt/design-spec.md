<!-- auto:generated:start -->
<!-- ds:inherits root-spec -->
# SuggestedPrompt Design Spec

> Generated 2026-06-12T07:10:01Z. Component-specific override spec — inherits global tokens, baselines, and theming from root-spec.md.

<!-- ds:section id=metadata -->
## Metadata

| Property | Value |
|---|---|
| Component | SuggestedPrompt |
| Category | Components |
| Figma Page | Components |
| Node ID | 48467:26158 |
| Design System | Synapse |

<!-- ds:section id=anatomy -->
## Anatomy

The component is composed of these structural parts:

- **inner**
- **label**
- **listVertical**
- **listWrap**
- **root**

Implementations must render these parts in order. Each part maps to a single DOM element (or equivalent in the target framework). Parts can be omitted if marked optional.

<!-- ds:section id=layout -->
## Layout & Measurements

> Layout data not yet extracted. Run `python scripts/figma_layout_enricher.py` to populate.

<!-- ds:section id=tokens -->
## Component Tokens

> Global tokens (colors, spacing, typography, elevation): see [root-spec.md](../root-spec.md).
> Below are tokens referenced by this component's CSS module.

- `var(--border-width-border-1)` = var(--border-width-border-default)
- `var(--color-border-brand-base)` = #0076ce (light) / #4c9fdd (dark)
- `var(--color-border-neutral-light)` = #757575 (light) / #34414c (dark)
- `var(--color-border-strong)` = #252525 (light) / #b8c1c9 (dark)
- `var(--color-text-neutral-strong)` = #252525 (light) / #e6e9ec (dark)
- `var(--font-line-height-line-height-20)` = 20px
- `var(--font-size-body-2)` = 14px
- `var(--padding-padding-12)` = 12px
- `var(--padding-padding-4)` = 4px
- `var(--scale-2)` = 2px
- `var(--spacing-space-12)` = 12px
- `var(--spacing-space-8)` = 8px
- `var(--suggested-prompt-radius)` = var(--corner-radius-radius-8)

<!-- ds:section id=states-light -->
## States (Light Theme)

| Variant | State | Background | Border | Text / Icon | Other |
|---|---|---|---|---|---|
| default | default |  | `var(--border-width-border-1)` (var(--border-width-border-default)) `var(--color-border-neutral-light)` (#757575) | `var(--color-text-neutral-strong)` (#252525) | radius: `var(--suggested-prompt-radius)` |
| default | disabled |  |  |  | opacity: 0.5 |
| default | focus |  |  |  | focus-ring: `var(--border-width-border-1)` `var(--color-border-brand-base)` |
| default | hover |  | `var(--color-border-strong)` (#252525) |  |  |

<!-- ds:section id=states-dark -->
## States (Dark Theme)

| Variant | State | Background | Border | Text / Icon | Other |
|---|---|---|---|---|---|
| default | default |  | `var(--border-width-border-1)` (var(--border-width-border-default)) `var(--color-border-neutral-light)` (#34414c) | `var(--color-text-neutral-strong)` (#e6e9ec) | radius: `var(--suggested-prompt-radius)` |
| default | disabled |  |  |  | opacity: 0.5 |
| default | focus |  |  |  | focus-ring: `var(--border-width-border-1)` `var(--color-border-brand-base)` |
| default | hover |  | `var(--color-border-strong)` (#b8c1c9) |  |  |

## Source Mapping

| Source | Location |
|---|---|
| Root spec | `components/synapse/root-spec.md` |
| Figma variables | Extracted via `figma_get_local_variables` MCP tool |
| Theme CSS | `components/synapse-theme.css` |
| Component map | `data/synapse-component-figma-map.json` |
<!-- auto:generated:end -->
