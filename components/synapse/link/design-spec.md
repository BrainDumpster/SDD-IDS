<!-- auto:generated:start -->
<!-- ds:inherits root-spec -->
# Link Design Spec

> Generated 2026-06-12T07:10:00Z. Component-specific override spec — inherits global tokens, baselines, and theming from root-spec.md.

<!-- ds:section id=metadata -->
## Metadata

| Property | Value |
|---|---|
| Component | Link |
| Category | Navigation |
| Figma Page | Navigation |
| Node ID | 11067:54506 |
| Design System | Synapse |

<!-- ds:section id=anatomy -->
## Anatomy

The component is composed of these structural parts:

- **externalIcon**
- **link**

Implementations must render these parts in order. Each part maps to a single DOM element (or equivalent in the target framework). Parts can be omitted if marked optional.

<!-- ds:section id=layout -->
## Layout & Measurements

<!-- ds:section id=tokens -->
## Component Tokens

> Global tokens (colors, spacing, typography, elevation): see [root-spec.md](../root-spec.md).
> Below are tokens referenced by this component's CSS module.

- `var(--color-border-brand-base)` = #0076ce (light) / #4c9fdd (dark)
- `var(--color-border-white)` = #ffffff
- `var(--color-text-link-brand-base)` = #0062ab (light) / #4c9fdd (dark)
- `var(--color-text-link-brand-light)` = #d9eaf8
- `var(--color-text-link-brand-lighter)` = #ebf4fb
- `var(--color-text-link-brand-strong)` = #06528a (light) / #94c5ea (dark)
- `var(--color-text-link-brand-stronger)` = #003a65 (light) / #d9eaf8 (dark)
- `var(--color-text-white)` = #ffffff

<!-- ds:section id=states-light -->
## States (Light Theme)

| Variant | State | Background | Border | Text / Icon | Other |
|---|---|---|---|---|---|
| default | active |  |  | `var(--color-text-link-brand-light)` (#d9eaf8) |  |
| default | default |  |  | `var(--color-text-white)` (#ffffff) |  |
| default | disabled |  |  |  | opacity: 0.5 |
| default | focus |  |  |  | shadow: `var(--color-border-white)` |
| default | hover |  |  | `var(--color-text-link-brand-lighter)` (#ebf4fb) |  |

<!-- ds:section id=states-dark -->
## States (Dark Theme)

| Variant | State | Background | Border | Text / Icon | Other |
|---|---|---|---|---|---|
| default | active |  |  | `var(--color-text-link-brand-light)` (#d9eaf8) |  |
| default | default |  |  | `var(--color-text-white)` (#ffffff) |  |
| default | disabled |  |  |  | opacity: 0.5 |
| default | focus |  |  |  | shadow: `var(--color-border-white)` |
| default | hover |  |  | `var(--color-text-link-brand-lighter)` (#ebf4fb) |  |

<!-- ds:section id=interactions -->
## Interactions (Component-Specific)

> Baseline interactions (focus management, Tab/Enter/Space/Escape, touch targets) are defined in root-spec.md.
> This section documents additional or overriding behaviors for this component.

**Pattern**: navigation

### Behaviors

- Navigates to URL on click
- External links open in a new tab
- Visited state styling for previously visited links

### Keyboard

| Key | Action |
|---|---|
| Enter | Activate the link |

### ARIA

| Element | Attributes |
|---|---|
| root | {'element': '<a>', 'aria-label': "Includes 'opens in new tab' for external links"} |

## Source Mapping

| Source | Location |
|---|---|
| Root spec | `components/synapse/root-spec.md` |
| Figma variables | Extracted via `figma_get_local_variables` MCP tool |
| Theme CSS | `components/synapse-theme.css` |
| Component map | `data/synapse-component-figma-map.json` |
<!-- auto:generated:end -->
