## IDS baseline (layout, flow, contracts)

Synapse **Tooltip** is an **ids-fork** of the IDS **Tooltip** family. Anatomy, arrow matrix (12 placements), closable content layout, interaction model, and runtime API **inherit IDS** unless listed in **Synapse programme deltas** below.

Canonical composition (inherited):

```
SynapseTooltip
  SynapseTooltip.Trigger
  SynapseTooltip.Panel
    SynapseTooltip.Header
      SynapseTooltip.Title
    SynapseTooltip.Body
    SynapseTooltip.Close
    SynapseTooltip.Arrow
```

| Property | Value |
|---|---|
| Pattern | `ids-fork` |
| IDS baseline slug | `tooltip` |
| IDS baseline spec | [`components/ids/tooltip/design-spec.md`](../ids/tooltip/design-spec.md) |
| Storybook reference | `storybook/src/components/SynapseTooltip.tsx` (re-exports `IdsTooltip` + composition slots); stories: `SynapseTooltip.stories.tsx` |
| Verification method | IDS baseline + programme radius alias contract |

### Synapse programme deltas (vs IDS)

| Area | IDS | Synapse |
|---|---|---|
| Panel corner radius | `var(--tooltip-control-radius)` → `0` (square) | `var(--tooltip-control-radius)` → `var(--corner-radius-radius-8)` (`8px`) |
| Theme CSS | `components/ids-theme.css` | `components/synapse-theme.css` |

### Closable layout (inherited from IDS — no Synapse override)

Generators **MUST** apply the IDS closable contract unchanged:

- `closable=true` → horizontal `Content` row: `ContentColumn` (optional `Header` + `BodyContent`) + `CloseAction` sibling.
- `ContentColumn`: `padding-right: var(--spacing-space-8)` so body/title wrap before the close icon column.
- `CloseAction`: `12×12` button; shared `Icon` with `shapeName="ctrl-close-16"` at `12×12`.
- `popupClosable` shell width `264px` (vs standard `240px`).

See IDS spec **Closable content layout** and **Codegen Contract** for full deterministic structure.

### IDS baseline resolution

Generators **MUST** load and merge the IDS baseline contract from [`components/ids/tooltip/design-spec.md`](../ids/tooltip/design-spec.md) (`## Codegen Contract`) before applying Synapse programme overrides (panel radius only).

<!-- auto:generated:start -->
<!-- ds:inherits root-spec -->
# Tooltip Design Spec

> Generated 2026-06-12T07:10:01Z. Component-specific override spec — inherits global tokens, baselines, and theming from root-spec.md.

<!-- ds:section id=metadata -->
## Metadata

| Property | Value |
|---|---|
| Component | Tooltip |
| Category | Components |
| Figma Page | Components |
| Node ID | 48625:111469 |
| Design System | Synapse |

<!-- ds:section id=anatomy -->
## Anatomy

The component is composed of these structural parts:

- **arrow**
- **arrowFill**
- **arrowStroke**
- **arrowSvg**
- **body**
- **close**
- **content**
- **header**
- **popup**
- **popupDismissible**
- **popupStandard**
- **title**
- **trigger**

Implementations must render these parts in order. Each part maps to a single DOM element (or equivalent in the target framework). Parts can be omitted if marked optional.

<!-- ds:section id=layout -->
## Layout & Measurements

<!-- ds:section id=tokens -->
## Component Tokens

> Global tokens (colors, spacing, typography, elevation): see [root-spec.md](../root-spec.md).
> Below are tokens referenced by this component's CSS module.

- `var(--border-width-border-1)` = var(--border-width-border-default)
- `var(--color-background-surface-2)` = #ffffff (light) / #1e262c (dark)
- `var(--color-border-accessible)` = #757575 (light) / #8898a5 (dark)
- `var(--color-icon-neutral)` = #4d4d4d (light) / #b8c1c9 (dark)
- `var(--color-text-neutral)` = #4d4d4d (light) / #b8c1c9 (dark)
- `var(--color-text-neutral-strong)` = #252525 (light) / #e6e9ec (dark)
- `var(--corner-radius-radius-8)` = 8px
- `var(--font-line-height-line-height-20)` = 20px
- `var(--font-size-body-2)` = 14px
- `var(--padding-padding-12)` = 12px
- `var(--spacing-space-4)` = 4px
- `var(--spacing-space-8)` = 8px

<!-- ds:section id=states-light -->
## States (Light Theme)

| Variant | State | Background | Border | Text / Icon | Other |
|---|---|---|---|---|---|
| default | default | `var(--color-background-surface-2)` (#ffffff) | `var(--border-width-border-1)` (var(--border-width-border-default)) `var(--color-border-accessible)` (#757575) | `var(--color-icon-neutral)` (#4d4d4d) | radius: `var(--corner-radius-radius-8)` |

<!-- ds:section id=states-dark -->
## States (Dark Theme)

| Variant | State | Background | Border | Text / Icon | Other |
|---|---|---|---|---|---|
| default | default | `var(--color-background-surface-2)` (#1e262c) | `var(--border-width-border-1)` (var(--border-width-border-default)) `var(--color-border-accessible)` (#8898a5) | `var(--color-icon-neutral)` (#b8c1c9) | radius: `var(--corner-radius-radius-8)` |

<!-- ds:section id=interactions -->
## Interactions (Component-Specific)

> Baseline interactions (focus management, Tab/Enter/Space/Escape, touch targets) are defined in root-spec.md.
> This section documents additional or overriding behaviors for this component.

**Pattern**: tooltip

### Behaviors

- Appears on hover (mouse) after ~200ms delay
- Appears on focus (keyboard) without delay
- Disappears on mouse leave or blur
- Contains no interactive content (text only)

### Keyboard

| Key | Action |
|---|---|
| Escape | Dismiss the tooltip when trigger is focused |

### ARIA

| Element | Attributes |
|---|---|
| tooltip | {'role': 'tooltip'} |
| trigger | {'aria-describedby': 'ID of the tooltip element'} |

## Source Mapping

| Source | Location |
|---|---|
| Root spec | `components/synapse/root-spec.md` |
| Figma variables | Extracted via `figma_get_local_variables` MCP tool |
| Theme CSS | `components/synapse-theme.css` |
| Component map | `data/synapse-component-figma-map.json` |

## Changelog

- **2026-08-19**: Inherited IDS composition slots (`Trigger` / `Panel` / `Header` / `Title` / `Body` / `Close` / `Arrow`); Synapse React stories updated.
- **2026-07-02**: Synapse React Storybook stories aligned with IDS/Angular composition pattern (`SynapseTooltipTitle` + `SynapseTooltipBody`, same story set as IDS Tooltip).
- **2026-06-19**: Added IDS baseline + closable layout inheritance (from IDS spec); documented Synapse programme delta (8px panel radius only).
<!-- auto:generated:end -->
