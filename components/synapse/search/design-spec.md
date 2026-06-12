<!-- auto:generated:start -->
<!-- ds:inherits root-spec -->
# Search Design Spec

> Generated 2026-06-12T07:10:01Z. Component-specific override spec — inherits global tokens, baselines, and theming from root-spec.md.

<!-- ds:section id=metadata -->
## Metadata

| Property | Value |
|---|---|
| Component | Search |
| Category | Form Elements |
| Figma Page | Form Elements |
| Node ID | 43581:121822 |
| Design System | Synapse |

<!-- ds:section id=anatomy -->
## Anatomy

The component is composed of these structural parts:

- **clear**
- **input**
- **searchIcon**
- **wrapper**

Implementations must render these parts in order. Each part maps to a single DOM element (or equivalent in the target framework). Parts can be omitted if marked optional.

<!-- ds:section id=layout -->
## Layout & Measurements

<!-- ds:section id=tokens -->
## Component Tokens

> Global tokens (colors, spacing, typography, elevation): see [root-spec.md](../root-spec.md).
> Below are tokens referenced by this component's CSS module.

- `var(--border-width-border-1)` = var(--border-width-border-default)
- `var(--border-width-border-2)` = var(--border-width-border-thick)
- `var(--color-background-component)` = #ffffff (light) / #111619 (dark)
- `var(--color-border-accessible)` = #757575 (light) / #8898a5 (dark)
- `var(--color-border-brand-base)` = #0076ce (light) / #4c9fdd (dark)
- `var(--color-border-strong)` = #252525 (light) / #b8c1c9 (dark)
- `var(--color-text-disabled)` = #757575 (light) / #9e9e9e (dark)
- `var(--color-text-neutral)` = #4d4d4d (light) / #b8c1c9 (dark)
- `var(--font-line-height-line-height-20)` = 20px
- `var(--font-size-body-2)` = 14px

<!-- ds:section id=states-light -->
## States (Light Theme)

| Variant | State | Background | Border | Text / Icon | Other |
|---|---|---|---|---|---|
| default | default | `var(--color-background-component)` (#ffffff) | `var(--border-width-border-1)` (var(--border-width-border-default)) `var(--color-border-accessible)` (#757575) | `var(--color-text-disabled)` (#757575) |  |
| default | focus |  | `var(--border-width-border-1)` (var(--border-width-border-default)) `var(--color-border-brand-base)` (#0076ce) |  | focus-ring: `var(--border-width-border-2)` `var(--color-border-brand-base)` |
| default | hover |  | `var(--color-border-strong)` (#252525) |  | opacity: 1 |

<!-- ds:section id=states-dark -->
## States (Dark Theme)

| Variant | State | Background | Border | Text / Icon | Other |
|---|---|---|---|---|---|
| default | default | `var(--color-background-component)` (#111619) | `var(--border-width-border-1)` (var(--border-width-border-default)) `var(--color-border-accessible)` (#8898a5) | `var(--color-text-disabled)` (#9e9e9e) |  |
| default | focus |  | `var(--border-width-border-1)` (var(--border-width-border-default)) `var(--color-border-brand-base)` (#4c9fdd) |  | focus-ring: `var(--border-width-border-2)` `var(--color-border-brand-base)` |
| default | hover |  | `var(--color-border-strong)` (#b8c1c9) |  | opacity: 1 |

<!-- ds:section id=interactions -->
## Interactions (Component-Specific)

> Baseline interactions (focus management, Tab/Enter/Space/Escape, touch targets) are defined in root-spec.md.
> This section documents additional or overriding behaviors for this component.

**Pattern**: combobox

### Behaviors

- Text input with search icon
- Shows suggestions dropdown as user types
- Debounced API calls to reduce request frequency
- Clear button to reset input
- Loading state displayed during async result fetch

### Keyboard

| Key | Action |
|---|---|
| ArrowDown | Move focus into suggestions list |
| ArrowUp | Move to previous suggestion |
| Enter | Select highlighted suggestion or submit search query |
| Escape | Close suggestions dropdown |

### ARIA

| Element | Attributes |
|---|---|
| input | {'role': 'combobox', 'aria-expanded': 'true/false based on suggestions visibility', 'aria-autocomplete': 'list', 'aria-controls': 'ID of the suggestions listbox', 'aria-activedescendant': 'ID of the currently highlighted suggestion'} |
| listbox | {'role': 'listbox'} |
| option | {'role': 'option'} |

## Source Mapping

| Source | Location |
|---|---|
| Root spec | `components/synapse/root-spec.md` |
| Figma variables | Extracted via `figma_get_local_variables` MCP tool |
| Theme CSS | `components/synapse-theme.css` |
| Component map | `data/synapse-component-figma-map.json` |
<!-- auto:generated:end -->
