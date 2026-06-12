<!-- auto:generated:start -->
<!-- ds:inherits root-spec -->
# Tag Design Spec

> Generated 2026-06-12T07:10:01Z. Component-specific override spec — inherits global tokens, baselines, and theming from root-spec.md.

<!-- ds:section id=metadata -->
## Metadata

| Property | Value |
|---|---|
| Component | Tag |
| Category | Components |
| Figma Page | Components |
| Node ID | 38910:57385 |
| Design System | Synapse |

<!-- ds:section id=anatomy -->
## Anatomy

The component is composed of these structural parts:

- **badge**
- **clickable**
- **dismiss**
- **editable**
- **emphasis_light**
- **emphasis_strong**
- **menuCaret**
- **prefix**
- **programmeIds**
- **programmeSynapse**
- **selected**
- **tag**
- **textField**
- **typeBadge**

Implementations must render these parts in order. Each part maps to a single DOM element (or equivalent in the target framework). Parts can be omitted if marked optional.

<!-- ds:section id=layout -->
## Layout & Measurements

<!-- ds:section id=tokens -->
## Component Tokens

> Global tokens (colors, spacing, typography, elevation): see [root-spec.md](../root-spec.md).
> Below are tokens referenced by this component's CSS module.

- `var(--border-width-border-default)` = 1px
- `var(--color-background-alerting-critical)` = #af0000 (light) / #c74c4c (dark)
- `var(--color-background-alerting-critical-slate)` = #f3d9d9 (light) / #1e262c (dark)
- `var(--color-background-alerting-info)` = ?
- `var(--color-background-alerting-info-1)` = #005ece (light) / #4c8edd (dark)
- `var(--color-background-alerting-major)` = #ed6400
- `var(--color-background-alerting-minor)` = #ffc700
- `var(--color-background-alerting-success)` = ?
- `var(--color-background-component)` = #ffffff (light) / #111619 (dark)
- `var(--color-background-controls-brand-base)` = #0076ce
- `var(--color-background-controls-brand-lighter)` = #ebf4fb (light) / #003a65 (dark)
- `var(--color-background-controls-brand-strong)` = #0062ab
- `var(--color-background-gray-light)` = #eaeaea (light) / #393939 (dark)
- `var(--color-background-gray-lighter)` = #f4f4f4 (light) / #393939 (dark)
- `var(--color-border-accessible)` = #757575 (light) / #8898a5 (dark)
- `var(--color-border-alerting-critical-base)` = #af0000 (light) / #dd9494 (dark)
- `var(--color-border-alerting-critical-white)` = #af0000 (light) / #ffffff (dark)
- `var(--color-border-alerting-info-white)` = #005ece (light) / #ffffff (dark)
- `var(--color-border-alerting-major-white)` = #ed6400 (light) / #ffffff (dark)
- `var(--color-border-alerting-minor-transparent)` = #9c622e (light) / rgba(255,255,255,0.00) (dark)
- `var(--color-border-alerting-success-white)` = #1b8500 (light) / #ffffff (dark)
- `var(--color-border-brand-base)` = #0076ce (light) / #4c9fdd (dark)
- `var(--color-border-disabled)` = #757575 (light) / #9e9e9e (dark)
- `var(--color-border-transparent-brand)` = rgba(255,255,255,0.00) (light) / #4c9fdd (dark)
- `var(--color-border-white)` = #ffffff
- `var(--color-icon-neutral-strong)` = #252525 (light) / #f2f3f5 (dark)
- `var(--color-static-gray-500)` = #757575
- `var(--color-text-disabled)` = #757575 (light) / #9e9e9e (dark)
- `var(--color-text-neutral)` = #4d4d4d (light) / #b8c1c9 (dark)
- `var(--color-text-tag-critical)` = #af0000 (light) / #dd9494 (dark)
- `var(--color-text-warning)` = #6d4028
- `var(--color-text-white)` = #ffffff
- `var(--corner-radius-radius-2)` = 2px
- `var(--corner-radius-radius-24)` = 24px
- `var(--font-line-height-line-height-20)` = 20px
- `var(--font-size-body-2)` = 14px
- `var(--font-size-body-3)` = 12px
- `var(--padding-padding-12)` = 12px
- `var(--padding-padding-2)` = 2px
- `var(--padding-padding-4)` = 4px
- `var(--padding-padding-8)` = 8px
- `var(--sizing-size-10)` = 10px
- `var(--sizing-size-18)` = 18px
- `var(--spacing-space-8)` = 8px

<!-- ds:section id=states-light -->
## States (Light Theme)

| Variant | State | Background | Border | Text / Icon | Other |
|---|---|---|---|---|---|
| default | default | `var(--color-background-alerting-critical-slate)` (#f3d9d9) | `var(--color-border-alerting-critical-base)` (#af0000) | `var(--color-text-tag-critical)` (#af0000) | focus-ring: `var(--border-width-border-default)` `var(--color-border-brand-base)`; radius: `var(--corner-radius-radius-2)` |
| default | disabled | `var(--color-static-gray-500)` (#757575) | `var(--color-border-white)` (#ffffff) | `var(--color-text-disabled)` (#757575) |  |
| default | focus |  | `var(--color-border-brand-base)` (#0076ce) |  |  |
| default | hover | `var(--color-background-controls-brand-strong)` (#0062ab) | `var(--color-border-transparent-brand)` (rgba(255,255,255,0.00)) | `var(--color-icon-neutral-strong)` (#252525) |  |

<!-- ds:section id=states-dark -->
## States (Dark Theme)

| Variant | State | Background | Border | Text / Icon | Other |
|---|---|---|---|---|---|
| default | default | `var(--color-background-alerting-critical-slate)` (#1e262c) | `var(--color-border-alerting-critical-base)` (#dd9494) | `var(--color-text-tag-critical)` (#dd9494) | focus-ring: `var(--border-width-border-default)` `var(--color-border-brand-base)`; radius: `var(--corner-radius-radius-2)` |
| default | disabled | `var(--color-static-gray-500)` (#757575) | `var(--color-border-white)` (#ffffff) | `var(--color-text-disabled)` (#9e9e9e) |  |
| default | focus |  | `var(--color-border-brand-base)` (#4c9fdd) |  |  |
| default | hover | `var(--color-background-controls-brand-strong)` (#0062ab) | `var(--color-border-transparent-brand)` (#4c9fdd) | `var(--color-icon-neutral-strong)` (#f2f3f5) |  |

<!-- ds:section id=interactions -->
## Interactions (Component-Specific)

> Baseline interactions (focus management, Tab/Enter/Space/Escape, touch targets) are defined in root-spec.md.
> This section documents additional or overriding behaviors for this component.

**Pattern**: action

### Behaviors

- Displays a label with optional dismiss (remove) action
- Click dismiss button to remove the tag
- Variant colors indicate different categories or states

### Keyboard

| Key | Action |
|---|---|
| Tab | Move focus to the tag or its dismiss button |
| Enter | Remove the tag (if dismissible) |
| Delete | Remove the tag (if dismissible) |

### ARIA

| Element | Attributes |
|---|---|
| root | {'aria-label': 'Meaningful tag text content'} |
| dismissButton | {'aria-label': 'Remove [tag name]'} |

## Source Mapping

| Source | Location |
|---|---|
| Root spec | `components/synapse/root-spec.md` |
| Figma variables | Extracted via `figma_get_local_variables` MCP tool |
| Theme CSS | `components/synapse-theme.css` |
| Component map | `data/synapse-component-figma-map.json` |
<!-- auto:generated:end -->
