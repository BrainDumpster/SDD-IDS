# Checkbox Design Spec

## Metadata
- Component: Checkbox
- Category: Formelements
- Design System: IDS
- Primary Figma: `https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=41895-299521&m=dev`
- Primary node ID: `41895:299521`
- State matrix Figma: `https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=42151-53254&m=dev`
- State matrix node ID: `42151:53254`
- Figma file key: `0bHk3XhrjFhowgFkz9yLr4`
- Variant axes covered: selection (`unselected | selected | partial`) x interaction (`default | hover | disabled | focus-visible`) x validation (`default | error`, optional)
## Anatomy
- **root**: clickable control row, aligns box + label.
- **input**: native `input[type="checkbox"]` (visually hidden or visible depending on implementation).
- **controlBox**: 16x16 visual square.
- **indicator**: checkmark or indeterminate dash glyph rendered only when selected state requires it.
- **label**: text node associated to input (`for`/`id` or `aria-labelledby`).
- **assistiveText** (optional): helper or error text below/next to root.
## Layout & Measurements
- Control box visual size: `16px x 16px` with `1px` border outside (effective outer footprint `18px x 18px`).
- Control border radius: `var(--corner-radius-radius-2)`.
- Root spacing between control and label: `var(--spacing-space-8)`.
- Root min tap target: `20px` height.
- Label aligns vertically with control center.
- Checked indicator geometry: CSS-drawn thick check mark in an `8px x 8px` lane with sharp corners/edges (no rounded stroke caps), center-aligned to match Figma placement with optical Y nudge `-0.5px`.
- Indeterminate indicator geometry: CSS-drawn horizontal stroke centered within the control (`8px` width, `2px` height), no rounded ends.
- Assistive text row aligns to the left edge of the control (no `margin-left` offset); it occupies the full field width.
- Focus-visible ring:
  - 1px outline using `var(--color-border-brand-base)`,
  - ring offset outside control by 2px.
## Tokens
Use semantic tokens only.

- Borders:
  - `var(--border-width-border-1)`
  - `var(--border-width-border-2)`
  - `var(--color-border-accessible)`
  - `var(--color-border-strong)`
  - `var(--color-border-brand-base)`
  - `var(--color-border-disabled)`
- Backgrounds:
  - `var(--color-background-component)`
  - `var(--color-background-controls-brand-base)`
  - `var(--color-background-controls-brand-strong)`
  - `var(--color-background-gray-light)`
  - `var(--color-background-gray-base)`
- Text/Icon:
  - `var(--color-text-neutral-strong)`
  - `var(--color-text-disabled)`
  - `var(--color-text-critical)` (error assistive text only — label color does NOT change in error state)
  - `var(--color-icon-white)`
  - `var(--color-icon-inverse)`
  - `var(--color-icon-brand-base)` (focus/semantic emphasis when needed)
- Typography:
  - `var(--font-size-body-2)`
  - `var(--font-line-height-line-height-20)`
  - `font-weight: 400`
## States (Light Theme)
| Selection | Interaction | Box Background | Box Border | Indicator | Label |
|---|---|---|---|---|---|
| Unchecked | Default | `var(--color-background-component)` | `var(--color-border-accessible)` | none | `var(--color-text-neutral-strong)` |
| Unchecked | Hover | `var(--color-background-component)` | `var(--color-border-strong)` | none | `var(--color-text-neutral-strong)` |
| Unchecked | Focus-visible | `var(--color-background-component)` | `var(--color-border-brand-base)` + 2px focus ring offset | none | `var(--color-text-neutral-strong)` |
| Checked | Default | `var(--color-background-controls-brand-base)` | `var(--color-border-transparent-brand)` | check in `var(--color-icon-white)` | `var(--color-text-neutral)` |
| Checked | Hover | `var(--color-background-controls-brand-base)` | `var(--color-border-transparent-brand)` | check in `var(--color-icon-white)` | `var(--color-text-neutral)` |
| Checked | Focus-visible | `var(--color-background-controls-brand-base)` | `var(--color-border-transparent-brand)` + 2px focus ring offset | check in `var(--color-icon-white)` | `var(--color-text-neutral)` |
| Partial | Default | `var(--color-background-component)` | `var(--color-border-brand-base)` | dash in `var(--color-icon-brand-base)` | `var(--color-text-neutral)` |
| Partial | Hover | `var(--color-background-component)` | `var(--color-border-strong)` | dash in `var(--color-icon-brand-base)` | `var(--color-text-neutral)` |
| Partial | Focus-visible | `var(--color-background-component)` | `var(--color-border-brand-base)` + 2px focus ring offset | dash in `var(--color-icon-brand-base)` | `var(--color-text-neutral)` |
| Any | Disabled | `var(--color-background-gray-light)` for unselected/partial; `var(--color-background-gray-base)` for checked | `var(--color-border-disabled)` | selected check uses `var(--color-icon-inverse)`; partial dash uses `var(--color-icon-disabled)`; unchecked none | `var(--color-text-disabled)` |
## States (Dark Theme)

Dark theme uses the same semantic tokens as **States (Light Theme)**. Resolved values for `[data-theme="dark"]` / `.ids-theme-dark` (and program overlays) live in theme CSS:

- `components/ids-theme.css`
- `components/<program>-theme.css` when a program overlays IDS (for example `components/dap-theme.css`)

Duplicate the full state matrix in this section only when a dark row genuinely uses different `var(--...)` references than the corresponding light row.

*(When Light and Dark tables would list identical `var(--...)` cells, keep the matrix under **States (Light Theme)** only and use this pointer section instead of a second table.)*

## Interactions
- Click root/control toggles between checked and unchecked (unless disabled).
- Space key toggles when control has focus.
- Indeterminate behavior:
  - programmatic state (`aria-checked="mixed"`),
  - next user toggle transitions to checked (recommended deterministic rule).
- Hover affects border/icon emphasis only; background remains unchanged from each selection baseline. Label color remains `var(--color-text-neutral)` in error state (only `assistiveText` turns critical).
- Disabled blocks pointer + keyboard interactions.
## Composition & API (runtime)
| Prop / Slot | Required | Behavior |
|---|---|---|
| `checked` | No (controlled) | Controlled selection state. |
| `defaultChecked` | No (uncontrolled) | Initial selection for uncontrolled usage. |
| `indeterminate` | No | Enables mixed state visual and ARIA mapping. |
| `disabled` | No | Locks interaction and applies disabled state tokens. |
| `label` | Yes | Visible, associated text. |
| `name` / `value` | No | Native form integration. |
| `onChange(checked)` | No | Emits resolved checked value after toggle. |
| `error` | No | Optional validation styling/assistive text mode. |
| `helperText` | No | Secondary descriptive text. |
## Codegen Contract (Framework-Agnostic Blueprint)
### Deterministic structure
- `root`
  - `input`
  - `controlBox`
    - optional `indicator`
  - `label`
  - optional `assistiveText`

### Variant matrix
- Selection: unchecked | checked | partial.
- Interaction: default | hover | focus-visible | disabled.
- Validation: default | error.
- Mode: controlled | uncontrolled.

### Per-slot style contract
- Control visual box remains 16x16 in all states, with 1px outer border (effective footprint 18x18).
- Indicator appears only for checked or partial.
- Indicator implementation must be CSS-only (no image or inline SVG):
  - checked: draw with sharp-corner CSS geometry in an `8x8` lane (no rounded caps), using deterministic polygon points:
    - `clip-path: polygon(0 54%, 12% 42%, 39% 67%, 86% 18%, 100% 32%, 39% 94%)`
    - optical placement: `translateY(-0.5px)`
  - indeterminate: draw a centered horizontal stroke (`8x2`), no border-radius.
- Focus-visible ring uses 1px brand outline with 2px offset outside the box.
- Label gap from control remains `var(--spacing-space-8)`.
- No hardcoded colors; token-only.

### Behavior and accessibility contract
- Native checkbox semantics preferred.
- ARIA:
  - `aria-checked`: `true | false | mixed`,
  - `aria-disabled` when disabled,
  - label association via `for/id` or `aria-labelledby`.
- Keyboard:
  - `Tab` focus traversal,
  - `Space` toggles.

### Fallback/error rules
- If both `checked` and `defaultChecked` provided, controlled `checked` wins.
- If `indeterminate=true` and `checked=true`, indeterminate visual takes precedence until next explicit change.
- Missing label is invalid for accessibility; generator must emit warning.

### Validation checklist
- [ ] All 15 state combinations (selection x interaction, including disabled rows) map to tokens.
- [ ] Partial (indeterminate) visuals and ARIA `mixed` are implemented.
- [ ] Checked indicator uses sharp-corner geometry (no rounded caps) and preserves the inner-left notch shape.
- [ ] Checked and partial indicators remain optically centered inside the control.
- [ ] Focus-visible ring appears only for keyboard focus.
- [ ] Disabled blocks interaction and uses disabled tokens.
- [ ] Label association is screen-reader valid.
- [ ] Dark theme resolves only through semantic tokens.
## Source Mapping
- Figma component: Checkbox (`41895:299528` representative instance in board `41895:299521`)
- Component map: `data/component-figma-map.json` → `Checkbox`
- Figma link used for extraction: `https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=41895-299521&m=dev`
- State annotation source: `https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=42151-53254&m=dev`

---

## Implementation Notes

**Layout & structure**
- **Wrapper min-height**: `20px` — matches the label line-height; do not set `44px` on the wrapper
- **Label font-weight**: `400` — apply on the wrapper label row

**Error state**
- **Box border in error**: unchecked box uses `var(--color-border-strong)` (same as hover), NOT `var(--color-border-alerting-critical-base)`. Error is communicated at the form-group level via `ValidationErrorMessage`, not by a red border on the individual checkbox.
- **Label color in error**: label stays `var(--color-text-neutral)` — do NOT apply `var(--color-text-critical)` to the label.
- **Error assistive text icon**: prepend `status-critical-square-solid` icon (16×16, `variant="img"` to preserve the red fill + white × from the SVG) inline before the helper text. Gap between icon and text: `var(--spacing-space-8)`. Icon hidden when `disabled`.
- **Assistive text alignment**: the assistive text row aligns to the left edge of the control (no left offset). Use `display: flex; align-items: center; gap: var(--spacing-space-8)` on the assistive text container.
- **Assistive text spacing from options**: `var(--spacing-space-8)` (8px) when options are laid out horizontally (short list, single row); `var(--spacing-space-16)` (16px) between the last option and the error message when options are stacked vertically (long list).

**Focus-visible ring**
- **Outline offset**: `2px` — applies to both real `:focus-visible` and `.rootSimulatedFocus` (Storybook static demos)

**Partial vs indeterminate naming**
- **Figma variant** uses `partial` as the selection value (`unselected | selected | partial`); **code/ARIA** uses `indeterminate` (prop name `indeterminate`, `aria-checked="mixed"`). These refer to the same visual state — do not rename the prop or ARIA attribute.
- **Storybook labels and column headers** must display `"Partial"` (not `"Indeterminate"`) to match Figma naming. The prop passed to the component remains `indeterminate={true}`.

**Indeterminate indicator**
- **No border-radius**: the horizontal dash (`8x2`) uses no `border-radius`; do not add rounded ends

**Disabled indicator token**
- **Indeterminate and mixed disabled**: use `var(--color-icon-disabled)` for the dash color, not `var(--color-border-disabled)`
