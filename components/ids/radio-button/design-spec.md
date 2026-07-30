# Radio Button Design Spec

## Metadata
- Component: Radio Button
- Category: Formelements
- Design System: IDS
- Primary Figma: `https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=42077-26737&m=dev`
- Primary node ID: `42077:26737`
- Component/state matrix Figma: `https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=42077-26730&m=dev`
- Component/state matrix node ID: `42077:26730`
- Figma file key: `0bHk3XhrjFhowgFkz9yLr4`
- Verification method: Figma MCP (`get_design_context`, `get_variable_defs`)
- Verified at: 2026-06-18
- Variant axes covered: selection (`unselected | selected`) x interaction (`default | hover | disabled | focus-visible`) x validation (`default | error`, optional)
- Reference implementation: `storybook/src/components/RadioButton.tsx` (shared IDS baseline). Storybook matrices may use **single-option** groups per cell and per-option `simulatedState` for static focus/hover (docs-only).
## Anatomy
- **groupRoot** (optional): semantic grouping wrapper for radio collections.
- **root**: one radio row item (control + label).
- **input**: native `input[type="radio"]`.
- **controlOuter**: circular visual ring (16x16).
- **controlInnerDot**: selected indicator dot (centered).
- **label**: associated text.
- **assistiveText** (optional): helper/error copy.
## Layout & Measurements
- Outer control size: `16px x 16px`.
- Outer shape: circle (`border-radius: 50%`).
- Selected dot size: `8px x 8px`, centered.
- Dot-to-ring inset: `4px` (computed from 16 outer and 8 inner).
- Label gap from control: `var(--spacing-space-8)`.
- Min hit area: `20px` height.
- Focus-visible ring:
  - 1px outline with `var(--color-border-brand-base)`,
  - 2px offset from the outer control.
## Tokens
- Borders:
  - `var(--border-width-border-1)`
  - `var(--border-width-border-2)`
  - `var(--color-border-gray-neutral-base)`
  - `var(--color-border-gray-neutral-strong)`
  - `var(--color-border-brand-base)`
  - `var(--color-border-gray-disabled)`
- Backgrounds:
  - `var(--color-background-surface-component)`
  - `var(--color-background-controls-strong)`
  - `var(--color-background-gray-light)`
  - `var(--color-background-gray-base)`
- Text/Icon:
  - `var(--color-text-gray-neutral)` (default option label)
  - `var(--color-text-gray-neutral-strong)` (optional stronger label emphasis)
  - `var(--color-text-gray-disabled)`
  - `var(--color-text-alerting-critical-base)` (error assistive text only — label color does NOT change in error state)
  - `var(--color-icon-gray-white)`
  - `var(--color-icon-gray-inverse)`
  - `var(--color-icon-brand-strong)` (selected dot hover)
  - `var(--color-icon-gray-disabled)` (disabled selected dot)
- Typography:
  - `var(--font-size-body-2)`
  - `var(--font-line-height-line-height-20)`
  - `font-weight: 400`
## States (Light Theme)
| Selection | Interaction | Outer Background | Outer Border | Inner Dot | Label |
|---|---|---|---|---|---|
| Unselected | Default | `var(--color-background-surface-component)` | `var(--color-border-gray-neutral-base)` | none | `var(--color-text-gray-neutral)` |
| Unselected | Hover | `var(--color-background-surface-component)` | `var(--color-border-gray-neutral-strong)` | none | `var(--color-text-gray-neutral)` |
| Unselected | Focus-visible | `var(--color-background-surface-component)` | `var(--color-border-brand-base)` + focus ring | none | `var(--color-text-gray-neutral)` |
| Selected | Default | `var(--color-background-surface-component)` | `var(--color-border-brand-base)` | dot in `var(--color-icon-brand-base)` | `var(--color-text-gray-neutral)` |
| Selected | Hover | `var(--color-background-surface-component)` | `var(--color-border-gray-neutral-strong)` | dot in `var(--color-icon-brand-strong)` | `var(--color-text-gray-neutral)` |
| Selected | Focus-visible | `var(--color-background-surface-component)` | `var(--color-border-brand-base)` + focus ring | dot in `var(--color-icon-brand-base)` | `var(--color-text-gray-neutral)` |
| Unselected | Disabled | `var(--color-background-gray-light)` | `var(--color-border-gray-disabled)` | none | `var(--color-text-gray-disabled)` |
| Selected | Disabled | `var(--color-background-gray-light)` | `var(--color-border-gray-disabled)` | dot in `var(--color-icon-gray-disabled)` | `var(--color-text-gray-disabled)` |
## States (Dark Theme)

Dark theme uses the same semantic tokens as **States (Light Theme)**. Resolved values for `[data-theme="dark"]` / `.ids-theme-dark` (and program overlays) live in theme CSS:

- `components/ids-theme.css`
- `components/<program>-theme.css` when a program overlays IDS (for example `components/dap-theme.css`)

Duplicate the full state matrix in this section only when a dark row genuinely uses different `var(--...)` references than the corresponding light row.

*(When Light and Dark tables would list identical `var(--...)` cells, keep the matrix under **States (Light Theme)** only and use this pointer section instead of a second table.)*

## Interactions
- Click on a radio selects it and deselects sibling radios with the same `name`.
- Radio is single-select in group; one selected value at a time.
- Hover trigger area is the full radio row hit target (control + label), not only the 16x16 control:
  - Unselected hover: border shifts to `var(--color-border-gray-neutral-strong)` while background remains `var(--color-background-surface-component)`.
  - Selected hover: border/icon shift to hover tokens while fill stays `var(--color-background-surface-component)`.
- Keyboard:
  - `Tab`: enters/leaves group,
  - `Arrow` keys: move selection among enabled radios in group,
  - `Space`: select focused radio.
- Disabled radios are skipped by selection changes and cannot be activated.
## Composition & API (runtime)

### Aggregate component (`RadioButton` — `storybook/src/components/RadioButton.tsx`)
| Prop | Required | Behavior |
|---|---|---|
| `name` | Yes | Shared group id for single-selection behavior. |
| `options` | Yes | Array of option objects (see below). |
| `value` | No | Controlled selected value (string matching one option `value`). |
| `defaultValue` | No | Initial selected value when uncontrolled. |
| `onChange(value)` | No | Fires with the new value when selection changes. |
| `disabled` | No | When true, disables the entire group (merged with per-option `disabled`). |
| `orientation` | No | `vertical` (default) or `horizontal`. |
| `id` | No | Optional id prefix for assistive text ids. |

### Option object (`options[]` items)
| Field | Required | Behavior |
|---|---|---|
| `value` | Yes | Unique value within the group. |
| `label` | Yes | Visible label for the option row. |
| `disabled` | No | Disables this option only. |
| `error` | No | Error state: ring border shifts to `var(--color-border-gray-neutral-strong)`; label color unchanged; assistive text turns critical with icon. |
| `helperText` | No | Helper or error line under the option row. |
| `simulatedState` | No | **Docs / Storybook only**: `"hover"` or `"focus-visible"` for static matrices; not a substitute for real `:hover` / `:focus-visible` in production. |
## Codegen Contract (Framework-Agnostic Blueprint)
### Deterministic structure
- `groupRoot` (optional)
  - `radioItem[]`
    - `input`
    - `controlOuter`
      - optional `controlInnerDot`
    - `label`
    - optional `assistiveText`

### Variant matrix
- Selection: unselected | selected.
- Interaction: default | hover | focus-visible | disabled.
- Validation: default | error.
- Mode: controlled | uncontrolled.
- Group behavior: standalone | grouped single-select.

### Per-slot style contract
- Control stays circular and 16x16 across states.
- Dot appears only when selected; default dot fill `var(--color-icon-brand-base)`; selected hover dot `var(--color-icon-brand-strong)` per state table.
- Label spacing stays `var(--spacing-space-8)`.
- Focus-visible ring uses 1px brand outline with 2px offset.
- Harness-only simulated state (`data-simulated-state` or equivalent) is allowed for Storybook; omit in production defaults unless documenting fixtures.
- No hardcoded values for color/border/typography.

### Behavior and accessibility contract
- Native radio semantics preferred.
- Group semantics:
  - radios share `name`,
  - optionally wrapped in `fieldset` + `legend`.
- ARIA/semantic expectations:
  - input `type="radio"` handles role/checked state,
  - `aria-disabled` when disabled,
  - helper/error text associated with `aria-describedby` when present.

### Fallback/error rules
- If multiple radios are `checked=true` in controlled data, first checked wins; warn.
- If no radio selected in required group, generator should support explicit validation state.
- Missing `label` on any option is invalid for accessibility; generator must warn.
- `simulatedState` must not be the only focus/hover implementation for end-user UI.

### Validation checklist
- [ ] Single-selection group behavior is deterministic.
- [ ] Full state matrix is token-mapped.
- [ ] Focus-visible and keyboard navigation work for grouped radios.
- [ ] Disabled radios are non-interactive and correctly styled.
- [ ] Label/input association passes accessibility checks.
- [ ] Dark theme values resolve through semantic tokens only.
## Source Mapping
- Component map entry: `data/component-figma-map.json` → `Radio Button`
- Primary extraction source: `https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=42077-26737&m=dev`
- Component/state matrix source: `https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=42077-26730&m=dev`
- Additional state validation board: `https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=8505-14225&m=dev`

---

## Implementation Notes

**Layout & structure**
- **Group gap**: use `var(--spacing-space-16)` between radio items, not `var(--spacing-space-12)`
- **Wrapper min-height**: `20px` — matches the label line-height; do not set `44px` on the wrapper
- **Label font-weight**: `400` — apply on `.wrapper` (the label row), not on the label element alone

**Error state**
- **Ring border in error**: unselected ring uses `var(--color-border-gray-neutral-strong)`, NOT `var(--color-border-alerting-critical-base)`. Error is communicated at the form-group level, not by a red border on the individual control.
- **Label color in error**: label stays `var(--color-text-gray-neutral)` — do NOT apply `var(--color-text-alerting-critical-base)` to the label.
- **Error assistive text icon**: prepend `status-critical-square-solid` icon (16×16, `variant="img"`) before the helper text. Gap between icon and text: `var(--spacing-space-8)`. Icon hidden when `disabled`.
- **Assistive text layout**: `display: flex; align-items: center; gap: var(--spacing-space-8)`. No left offset — row aligns with the left edge of the control.
- **Assistive text spacing from options**: `var(--spacing-space-8)` (8px) when options are laid out horizontally; `var(--spacing-space-16)` (16px) between the last option and the error message when options are stacked vertically.

**Focus-visible ring**
- **Outline offset**: `2px` — applies to both real `:focus-visible` and `data-simulated-state="focus-visible"`

**Selected dot token**
- **Dot fill (default + focus-visible)**: use `var(--color-icon-brand-base)`, not `var(--color-background-controls-base)`. The `-controls-` background token is unused in this component
