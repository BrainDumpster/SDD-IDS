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
- Verification method: Figma MCP (`get_design_context`, `get_variable_defs`, `get_metadata`, `get_screenshot`)
- Verified at: 2026-08-10
- Label style verified on: `41895:299551` (unchecked + label), `41895:299550` (checked + label), component source `8505:14297` / text `8505:14299`
- Variant axes covered: selection (`unselected | selected | partial`) x interaction (`default | hover | disabled | focus-visible`) x validation (`default | error`, optional)
## Anatomy
- **groupRoot** (optional): layout/semantic wrapper for multiple checkbox rows (`role="group"`). Checkboxes remain independently toggleable (not single-select).
- **root**: clickable control row, aligns box + label.
- **input**: native `input[type="checkbox"]` (visually hidden or visible depending on implementation).
- **controlBox**: 16x16 visual square.
- **indicator**: checkmark or partial dash glyph rendered only when selected state requires it.
- **label**: text node associated to input (`for`/`id` or `aria-labelledby`). Figma sample copy is `Option`.
- **assistiveText** (optional): helper or error text below/next to root.
## Labels

### Option label
- Option label is also clickable that checks or unchecks the checkbox.
- Checkboxes are placed to the left of the option label.
- Checkboxes should always have an option label, except in some data grids. In a flat data grid, the context around the checkbox is enough to understand its purpose.
- Use sentence case with no period. Punctuation can be used with confirmation label like `I accept.`
- Labels should be clear and concise. Avoid wrapping as much as possible.

### Form label
- Form label belongs to a `CheckboxGroup`, not to an individual `Checkbox`.
- It is placed to the left or top of the checkbox group; the chosen position (left or top) should be common across the product.
- Use `label` (string), `showLabel` (boolean, default `true`), and `ariaLabel` (string) props on `CheckboxGroup`. When `showLabel` is false or `label` is omitted, use `ariaLabel` as the accessible name of the group.
- Form label text is single-line (`nowrap`).
- Use title case with colon for form label text.
- An optional required mark (`*`) can appear inside the form label, placed after the text with a `2px` gap. It uses `var(--color-text-gray-neutral-strong)` and is `aria-hidden`.
- An optional icon (16x16) can appear inside the form label, placed after the text (and after the required mark, if present) with a `8px` gap (`var(--spacing-space-8)`).
- A checkbox group should have a form label with a few exceptions. Exceptions are acceptable when the context makes the checkbox group's purpose clear.
- Labels should be clear and concise. Avoid wrapping as much as possible.

## Layout & Measurements
- Control box visual size: `16px x 16px` with `1px` border outside (effective outer footprint `18px x 18px`).
- Control border radius: `var(--corner-radius-radius-2)`.
- Root spacing between control and label: `var(--spacing-space-8)`.
- Root min tap target: `20px` height.
- Label aligns vertically with control center (`align-items: center` on the control+label row).
- **Label typography (Figma-verified Body 2):**
  - font family: `var(--typography-font-style-primary)` (Roboto)
  - font weight: `400` (`Typography/Font Weight/regular`)
  - font size: `var(--font-size-body-2)` (`14px`)
  - line height: `var(--font-line-height-line-height-20)` (`20px`)
  - letter spacing: `0`
  - `font-variation-settings: "wdth" 100` when the host font supports it
- **Label color (Figma-verified):** `var(--color-text-gray-neutral)` for default, hover, focus-visible, checked, and partial. Disabled uses `var(--color-text-gray-disabled)`. Error does **not** change label color.
- Checked indicator geometry: CSS-drawn thick check mark in an `8px x 8px` lane with sharp corners/edges (no rounded stroke caps), center-aligned to match Figma placement with optical Y nudge `-0.5px`.
- Indeterminate indicator geometry: CSS-drawn horizontal stroke centered within the control (`8px` width, `2px` height), no rounded ends.
- Assistive text row aligns to the left edge of the control (no `margin-left` offset); it occupies the full field width.
- Focus-visible ring:
  - 1px brand ring (`var(--color-border-brand-base)`) drawn outside the control,
  - ring offset outside control by 3px,
  - ring border-radius `var(--corner-radius-radius-4)`.
## Tokens
Use semantic tokens only.

- Borders:
  - `var(--border-width-border-1)`
  - `var(--border-width-border-2)`
  - `var(--color-border-gray-neutral-base)`
  - `var(--color-border-gray-neutral-strong)`
  - `var(--color-border-brand-base)`
  - `var(--color-border-gray-disabled)`
- Backgrounds:
  - `var(--color-background-surface-component)`
  - `var(--color-background-controls-base)`
  - `var(--color-background-controls-strong)`
  - `var(--color-background-gray-light)`
  - `var(--color-background-gray-base)`
- Text/Icon:
  - `var(--color-text-gray-neutral)` (label — all interactive non-disabled states)
  - `var(--color-text-gray-disabled)` (disabled label)
  - `var(--color-text-alerting-critical-base)` (error assistive text only — label color does NOT change in error state)
  - `var(--color-icon-gray-white)`
  - `var(--color-icon-gray-inverse)`
  - `var(--color-icon-brand-base)` (focus/semantic emphasis when needed)
- Typography (label = **Body 2**):
  - `var(--typography-font-style-primary)`
  - `var(--font-size-body-2)`
  - `var(--font-line-height-line-height-20)`
  - `font-weight: 400`
  - `letter-spacing: 0`
## States (Light Theme)
| Selection | Interaction | Box Background | Box Border | Indicator | Label |
|---|---|---|---|---|---|
| Unchecked | Default | `var(--color-background-surface-component)` | `var(--color-border-gray-neutral-base)` | none | `var(--color-text-gray-neutral)` |
| Unchecked | Hover | `var(--color-background-surface-component)` | `var(--color-border-gray-neutral-strong)` | none | `var(--color-text-gray-neutral)` |
| Unchecked | Focus-visible | `var(--color-background-surface-component)` | `var(--color-border-brand-base)` + 2px focus ring offset | none | `var(--color-text-gray-neutral)` |
| Checked | Default | `var(--color-background-controls-base)` | `var(--color-border-brand-transparent-brand)` | check in `var(--color-icon-gray-white)` | `var(--color-text-gray-neutral)` |
| Checked | Hover | `var(--color-background-controls-base)` | `var(--color-border-brand-transparent-brand)` | check in `var(--color-icon-gray-white)` | `var(--color-text-gray-neutral)` |
| Checked | Focus-visible | `var(--color-background-controls-base)` | `var(--color-border-brand-transparent-brand)` + 2px focus ring offset | check in `var(--color-icon-gray-white)` | `var(--color-text-gray-neutral)` |
| Partial | Default | `var(--color-background-surface-component)` | `var(--color-border-brand-base)` | dash in `var(--color-icon-brand-base)` | `var(--color-text-gray-neutral)` |
| Partial | Hover | `var(--color-background-surface-component)` | `var(--color-border-gray-neutral-strong)` | dash in `var(--color-icon-brand-base)` | `var(--color-text-gray-neutral)` |
| Partial | Focus-visible | `var(--color-background-surface-component)` | `var(--color-border-brand-base)` + 2px focus ring offset | dash in `var(--color-icon-brand-base)` | `var(--color-text-gray-neutral)` |
| Any | Disabled | `var(--color-background-gray-light)` for unselected/partial; `var(--color-background-gray-base)` for checked | `var(--color-border-gray-disabled)` | selected check uses `var(--color-icon-gray-inverse)`; partial dash uses `var(--color-icon-gray-disabled)`; unchecked none | `var(--color-text-gray-disabled)` |
## States (Dark Theme)

Dark theme uses the same semantic tokens as **States (Light Theme)**. Resolved values for `[data-theme="dark"]` / `.ids-theme-dark` (and program overlays) live in theme CSS:

- `components/ids-theme.css`
- `components/<program>-theme.css` when a program overlays IDS (for example `components/dap-theme.css`)

Duplicate the full state matrix in this section only when a dark row genuinely uses different `var(--...)` references than the corresponding light row.

*(When Light and Dark tables would list identical `var(--...)` cells, keep the matrix under **States (Light Theme)** only and use this pointer section instead of a second table.)*

## Interactions
- Click root/control toggles between checked and unchecked (unless disabled).
- Space and Enter keys toggle when control has focus.
- Partial / mixed behavior:
  - programmatic state (`aria-checked="mixed"`),
  - next user toggle transitions to checked (recommended deterministic rule).
- Hover affects border/icon emphasis only; background remains unchanged from each selection baseline.
- Label style is selection-invariant for interactive states: always Body 2 Regular + `var(--color-text-gray-neutral)`. Checked/partial do **not** change label color or weight.
- Label color remains `var(--color-text-gray-neutral)` in error state (only `assistiveText` turns critical).
- Disabled blocks pointer + keyboard interactions and switches label to `var(--color-text-gray-disabled)`.

## Checkbox group

- Multiple choice form field that contains a list is called a checkbox group.
- A checkbox group should contain a minimum of two and a maximum of six list items. If the list is longer than six items, consider a dropdown.
- All checkboxes should be in the `unselected` state by default.
- Selecting one item in a checkbox group should not affect the state of another item, except if the list items are organized in a hierarchy.
- All items in a checkbox group should be mutually exclusive.
- All labels should be clear, concise, and consistent in tense and meaning. As much as possible, keep the option label length consistent within a group.
- The order of items in the checkbox group should make the list easily scannable. Items can be organized alphabetically or by popularity. If items are arranged alphabetically, localization settings may change the order.
- **Group variants (Figma `Checkbox group`):**
  - **Options alignment:** `vertical` | `horizontal`. Vertical is recommended when there are four or more options or when option labels are long.
  - **Label position:** `left` | `top`. Form label is placed to the left of the options row or above the options stack.
  - **Error state:** `true` | `false`. When `true`, the group renders a validation error message and applies error styling to each checkbox (unchecked boxes use `var(--color-border-gray-neutral-strong)`; individual option labels keep `var(--color-text-gray-neutral)`).
- A `CheckboxGroup` nests a `Form Label` and an optional `Validation Error Message` shared primitive.
- The group surface uses `role="group"` and is labelled by the form label via `aria-labelledby` (or `aria-label` when the label is hidden).

## Composition & API (runtime)
Canonical machine-readable mirror (Storybook + codegen QA): `component-contracts/ids/checkbox.contract.ts`.

**Preferred pattern:** projected children inside a group wrapper — not an `options[]` prop.

```
CheckboxGroup [orientation?, disabled?, name?, idPrefix?]
  Checkbox [label, checked?, defaultChecked?, partial?, disabled?, error?, helperText?, …]
  Checkbox …
```

Angular reference selectors: `ids-checkbox-group` → `ids-checkbox` (`storybook-angular`, port 6007). React reference: `storybook/src/components/Checkbox.tsx` (single item); group layout via composition or field wrapper.

### Group (`CheckboxGroup` / `groupRoot`)
| Prop / Slot | Required | Behavior |
|---|---|---|
| `label` | No | Form label text for the whole group. |
| `showLabel` | No | `true` (default) — render the form label; `false` — hide it but keep it accessible via `aria-label`. |
| `ariaLabel` | No | Accessible name used when `showLabel` is false or `label` is omitted. |
| `labelPosition` | No | `left` (default) or `top`. |
| `required` | No | Renders a `*` required mark inside the form label and sets `aria-required` on the group. |
| `labelIcon` | No | Optional 16x16 icon node rendered after the form label text (and after `*`, if present). |
| `error` | No | `true` applies error styling to child checkboxes and renders `errorText`/`error` slot. |
| `errorText` | No | Validation error message string or node. |
| `orientation` | No | `vertical` (default) or `horizontal`. Both use `var(--spacing-space-16)` between checkbox items. |
| `disabled` | No | When `true`, cascades to all child checkboxes (merged with per-item `disabled`). |
| `name` | No | Optional shared form `name` for child inputs. |
| `idPrefix` | No | Optional id prefix for child control/assistive ids. |

### Item (`Checkbox` / `root`)
| Prop / Slot | Required | Behavior |
|---|---|---|
| `checked` | No (controlled) | Controlled selection state. |
| `defaultChecked` | No (uncontrolled) | Initial selection for uncontrolled usage. |
| `partial` | No | Enables mixed/partial state visual and ARIA `aria-checked="mixed"` mapping. |
| `disabled` | No | Locks interaction and applies disabled state tokens (merged with group `disabled`). |
| `label` | Yes | Visible, associated text. |
| `name` / `value` | No | Native form integration (`name` falls back to group `name` when inside a group). |
| `onChange(checked)` | No | Emits resolved checked value after toggle. |
| `error` | No | Optional validation styling/assistive text mode. |
| `helperText` | No | Secondary descriptive text. |
| `simulateFocusVisible` | No | **Storybook/docs only** — static focus ring for matrices. |

Outputs (item): `onChange(checked)` / `checkedChange`.
## Codegen Contract (Framework-Agnostic Blueprint)
### Deterministic structure
- `groupRoot` (optional)
  - optional `groupLabel` (when `label` is shown)
  - `groupBody`
    - `groupItems`
      - repeated `checkboxItem`
        - `root`
          - `input`
          - `controlBox`
            - optional `indicator`
          - `label`
          - optional `assistiveText`
    - optional `validationErrorMessage` (when `error` is true and `errorText` is provided)

### Variant matrix
- Selection: unchecked | checked | partial.
- Interaction: default | hover | focus-visible | disabled.
- Validation: default | error.
- Mode: controlled | uncontrolled.
- Group layout: standalone item | grouped list (independent toggles per item).

### Per-slot style contract
- Control visual box remains 16x16 in all states, with 1px outer border (effective footprint 18x18).
- Indicator appears only for checked or partial.
- Indicator implementation must be CSS-only (no image or inline SVG):
  - checked: draw with sharp-corner CSS geometry in an `8x8` lane (no rounded caps), using deterministic polygon points:
    - `clip-path: polygon(0 54%, 12% 42%, 39% 67%, 86% 18%, 100% 32%, 39% 94%)`
    - optical placement: `translateY(-0.5px)`
  - partial: draw a centered horizontal stroke (`8x2`), no border-radius.
- Focus-visible ring uses 1px brand outline with 3px offset outside the box and a `var(--corner-radius-radius-4)` border-radius.
- Label gap from control remains `var(--spacing-space-8)`.
- Label style contract (option label):
  - typography: Body 2 — `var(--typography-font-style-primary)`, `var(--font-size-body-2)`, `var(--font-line-height-line-height-20)`, weight `400`, letter-spacing `0`
  - color: `var(--color-text-gray-neutral)` unless disabled (`var(--color-text-gray-disabled)`)
  - do **not** use `var(--color-text-gray-neutral-strong)` for the checkbox option label
- Group label style contract:
  - color: `var(--color-text-gray-neutral-strong)`
  - optional `*` required mark: `margin-left: 2px`, `aria-hidden="true"`
  - optional icon: 16x16, `margin-left: var(--spacing-space-8)`
  - label position left: row gap `var(--spacing-space-16)` between label and items
  - label position top: no gap between label and items
- Group body layout contract:
  - The body wraps the `groupItems` and the optional `validationErrorMessage`.
  - `labelPosition="left"` + `orientation="horizontal"` (no error message): body and label align middle (`align-items: center`), body has no extra padding.
  - `labelPosition="left"` + `orientation="vertical"`: body aligns top with the label, body has `padding: var(--spacing-space-10) 0`.
  - `labelPosition="left"` + error message: body aligns top with the label, body has `padding: var(--spacing-space-10) 0`; gap between `groupItems` and `validationErrorMessage` is `var(--spacing-space-8)` for horizontal and `var(--spacing-space-16)` for vertical.
  - `labelPosition="top"`: body appears directly below the label with no gap.
- Group items layout contract:
  - `orientation="vertical"`: column layout, gap `var(--spacing-space-16)`
  - `orientation="horizontal"`: row layout, gap `var(--spacing-space-16)`, wrap allowed
- No hardcoded colors; token-only.

### Behavior and accessibility contract
- Native checkbox semantics preferred.
- ARIA:
  - `aria-checked`: `true | false | mixed` (prop `partial` maps to `mixed`),
  - `aria-disabled` when disabled,
  - label association via `for/id` or `aria-labelledby`.
- Keyboard:
  - `Tab` focus traversal,
  - `Space` and `Enter` toggle,
  - Arrow keys do **not** navigate or change focus (unlike radio buttons).

### Fallback/error rules
- If both `checked` and `defaultChecked` provided, controlled `checked` wins.
- If `partial=true` and `checked=true`, partial visual takes precedence until next explicit change.
- Missing label is invalid for accessibility; generator must emit warning.

### Validation checklist
- [ ] All 15 state combinations (selection x interaction, including disabled rows) map to tokens.
- [ ] Partial (indeterminate) visuals and ARIA `mixed` are implemented.
- [ ] Checked indicator uses sharp-corner geometry (no rounded caps) and preserves the inner-left notch shape.
- [ ] Checked and partial indicators remain optically centered inside the control.
- [ ] Focus-visible ring appears only for keyboard focus.
- [ ] Disabled blocks interaction and uses disabled tokens.
- [ ] Label association is screen-reader valid.
- [ ] Label uses Body 2 Regular (`14/20`, weight `400`) and `var(--color-text-gray-neutral)` (not `neutral-strong`) for non-disabled states.
- [ ] Disabled label uses `var(--color-text-gray-disabled)` only.
- [ ] Dark theme resolves only through semantic tokens.
## Source Mapping
- Figma component: Checkbox (`41895:299528` representative instance in board `41895:299521`)
- Label style evidence: `get_design_context` / `get_variable_defs` on `41895:299551` (unchecked+label) and `41895:299550` (checked+label); component text node `8505:14299` binds Body 2 + `var(--color-text-gray-neutral)`
- Component map: `data/component-figma-map.json` → `Checkbox`
- Figma link used for extraction: `https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=41895-299521&m=dev`
- State annotation source: `https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=42151-53254&m=dev`
- Lib React implementation (no Base UI): `lib/react/ids/checkbox/` (`IdsCheckbox.tsx`, `IdsCheckbox.module.css`; selectors `ids-checkbox`, …); stories: `storybook/src/components/lib-generated/Checkbox.stories.tsx`
- Runtime story / codegen contract: `component-contracts/ids/checkbox.contract.ts`
- Angular composition reference: `storybook-angular/src/components/ids-checkbox/` (`IDS_CHECKBOX_IMPORTS`)

---

## Implementation Notes

**2026-09-04 changes:**
- Added `IdsCheckboxGroup` React component with projected `IdsCheckbox` children; form label, label position, orientation, `required` mark, `labelIcon`, and group `error`/`errorText` are managed by the group.
- Removed form label support from single `IdsCheckbox`.
- `IdsCheckboxGroup` uses PascalCase CSS classes/selectors (`IdsCheckboxGroup`, `IdsCheckboxGroupLabel`, `IdsCheckboxGroupBody`, `IdsCheckboxGroupItems`).
- `IdsCheckbox` consumes group context for cascaded `name`, `disabled`, and `error`.
- Renamed public prop `indeterminate` → `partial` (DOM `indeterminate` and ARIA `aria-checked="mixed"` unchanged).
- Updated focus-visible ring to a `::after` pseudo-element with `border-radius: var(--corner-radius-radius-4)` and 3px offset.
- Added `Enter` key toggle in addition to `Space`.

**Form label (group only)**
- The form label belongs to `IdsCheckboxGroup`, not to an individual `IdsCheckbox`.
- Typography: Body 2 Regular — `var(--typography-font-style-primary)`, `var(--font-size-body-2)`, `var(--font-line-height-line-height-20)`, weight `400`, letter-spacing `0`.
- Color: `var(--color-text-gray-neutral-strong)`.
- Height: `40px` (`padding: 10px 0` on a `20px` line-height).
- Single-line (`white-space: nowrap`), title case with colon.
- Optional `*` required mark after the text with `2px` left margin, `aria-hidden="true"`.
- Optional `16×16` icon after the text (and after `*`, if present) with `8px` left margin.
- `labelPosition="left"`: label and group body are in a row with `var(--spacing-space-16)` gap.
  - `orientation="horizontal"` (no error message): label and group body align middle (`align-items: center`).
  - `orientation="vertical"` or with error message: label and group body align top; group body has `padding: var(--spacing-space-10) 0`.
- `labelPosition="top"`: label appears directly above the group body with no gap.

**Group layout & structure**
- `IdsCheckboxGroupBody` wraps `IdsCheckboxGroupItems` and the optional `ValidationErrorMessage`.
- `IdsCheckboxGroupItems` gap: `var(--spacing-space-16)` for both vertical and horizontal orientations.
- Gap between `IdsCheckboxGroupItems` and `ValidationErrorMessage`:
  - `var(--spacing-space-8)` when `orientation="horizontal"`.
  - `var(--spacing-space-16)` when `orientation="vertical"`.
- `IdsCheckboxGroupBody` has `padding: var(--spacing-space-10) 0` whenever `labelPosition="left"` and either `orientation="vertical"` or an error message is rendered.
- `IdsCheckboxGroup` selectors are PascalCase: `IdsCheckboxGroup`, `IdsCheckboxGroupLabel`, `IdsCheckboxGroupBody`, `IdsCheckboxGroupItems`.

**Single checkbox label**
- Option label typography: Body 2 Regular — `var(--typography-font-style-primary)`, `var(--font-size-body-2)`, `var(--font-line-height-line-height-20)`, weight `400`, letter-spacing `0`.
- Option label color: `var(--color-text-gray-neutral)` for all non-disabled states (including unchecked). Do not use `var(--color-text-gray-neutral-strong)` on the option label.
- An `IdsCheckboxLabel` is required unless `density="datagrid"`.

**Error state**
- Error is communicated at the group level via `ValidationErrorMessage`.
- Unchecked box border in error uses `var(--color-border-gray-neutral-strong)` (same as hover), NOT `var(--color-border-alerting-critical-base)`.
- Option label color stays `var(--color-text-gray-neutral)` in error; do not apply `var(--color-text-alerting-critical-base)` to the label.
- Error assistive text icon: `status-critical-square-solid` (16×16, `variant="img"`) inline before the helper text. Gap between icon and text: `var(--spacing-space-8)`. Icon hidden when `disabled`.
- Assistive text row aligns to the left edge of the control (no left offset). Use `display: flex; align-items: center; gap: var(--spacing-space-8)` on the assistive text container.

**Focus-visible ring**
- Drawn via a `::after` pseudo-element on `.ids-checkbox-control`.
- 1px brand outline (`var(--color-border-brand-base)`), `3px` outside the control, with `border-radius: var(--corner-radius-radius-4)`.
- Applies to both real `:focus-visible` and simulated focus states (`data-state="focus-visible"`).

**Partial / indeterminate naming**
- Figma variant uses `partial` (`unselected | selected | partial`).
- Code prop is `partial`; native DOM property remains `indeterminate`; ARIA maps to `aria-checked="mixed"`.
- Storybook labels and column headers must display `"Partial"` (not `"Indeterminate"`).

**Partial indicator**
- Horizontal dash `8px × 2px`, centered inside the control.
- No `border-radius`; do not add rounded ends.
- Disabled partial dash uses `var(--color-icon-gray-disabled)`.
