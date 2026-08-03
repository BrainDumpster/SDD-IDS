# Text Box — PowerFlex Design Spec

## Metadata

| Property | Value |
|---|---|
| Component | Text Box |
| Programme | PowerFlex |
| Slug | `text-box` |
| Figma name | `text-input` |
| Version | 1.0.1 |
| Status | `active` |
| Created | 2026-08-03 |
| Updated | 2026-08-03 |
| Spec pattern | `standalone` |
| Theme CSS | `components/powerflex-theme.css` |
| Figma file key | `82bDP05ESsiiGe38p5TEQJ` |
| Main component set node | `2723:2611` |
| Figma verification | Figma REST API (packaged evidence) |

> Live verification performed from packaged `figma_evidence.json`. No client-side Figma authentication or MCP calls were made.

## Anatomy

The `text-input` component set (`2723:2611`) contains the full state/size/content matrix. Codegen-relevant slots are:

1. **FieldContainer** — the outer `COMPONENT` for each `State` / `Content state` / `Size` permutation. Renders the input border and background.
2. **Value** / **Placeholder** — inner `TEXT` layer:
   - `value` node `2694:3711` (filled content)
   - `placeholder` node `2694:3741` (example/empty placeholder text)
3. **FocusRing** — `FRAME` drawn outside the field on focus/active. Representative verified nodes: `2694:3714` (lg default), `2694:3719` (lg disabled), `2694:3724` (md default), `2694:3734` (sm default), `2723:2537` (error sm).
4. **InputRow** — red-bordered field surface inside `State=error` variants. Node `2723:2533`.
5. **ErrorMessage** — text + critical icon row shown below the field in error variants. Node `2723:2398`.
6. **IconLeading** / **StatusCriticalCircSolid** — critical icon used in error messages. Nodes `2723:2403` and `2723:2399`.

## Layout & Measurements

### Field sizes

| Size | Height | Width | Padding (left/right) | Item spacing |
|---|---|---|---|---|
| `sm` | 24px | 476px | 8px / 8px | 16px |
| `md` | 32px | 476px | 8px / 8px | 16px |
| `lg` | 40px | 476px | 8px / 8px | 16px |

### Error component sizes

| Size | Input row height | Error message height | Total component height |
|---|---|---|---|
| `sm` | 24px | 28px | 52px |
| `md` | 32px | 28px | 60px |

### Focus ring dimensions

| Size | FocusRing dimensions |
|---|---|
| `sm` | 480px × 28px |
| `md` | 480px × 36px |
| `lg` | 480px × 44px |

### Slot geometry (Figma-verified)

| Slot / layer | Property | Token / contract | Figma node | Live evidence |
|---|---|---|---|---|
| `text-input` component set | `border-radius` | `5.0px` (component-set container only) | `2723:2611` | `slotGeometry` — `borderRadius=5.0` |
| `FieldContainer` (default filled lg) | `border-radius` | `var(--text-box-control-radius)` (`0px`); no `cornerRadius` reported on the Figma node | `2723:2610` | `slotGeometry` / `get_design_context` — `boundVariableHints` include `VariableID:2454:3`, `VariableID:2454:2`, `VariableID:2521:3`, `VariableID:2453:4`, `VariableID:2453:8` |
| `FieldContainer` | `min-height` | 24px / 32px / 40px per size | `2723:2603`, `2723:2605`, `2723:2610` | `slotGeometry` — component dimensions |
| `FieldContainer` | `padding` | `0 8px` | `2723:2610` | `slotGeometry` — `paddingLeft=8.0`, `paddingRight=8.0` |
| `FieldContainer` | `border-width` | `1px` | `2723:2610` | `slotGeometry` — `strokeWeight=1.0` |
| `InputRow` (error) | `border-radius` | `var(--text-box-control-radius)` (`0px`); no `cornerRadius` reported | `2723:2533` | `slotGeometry` — `boundVariableHints` include `VariableID:2454:3`, `VariableID:2454:2`, `VariableID:2521:3`, `VariableID:2453:4`, `VariableID:2453:58` |
| `FocusRing` | `border-radius` | `var(--text-box-focus-ring-radius)` (`4px`) bound to `VariableID:2453:30` | `2694:3714` | `slotGeometry` — `boundVariableHint` `VariableID:2453:30` |
| `ErrorMessage` | `padding` | `4px 0` | `2723:2398` | `slotGeometry` — `paddingTop=4.0`, `paddingBottom=4.0` |
| `ErrorMessage` | `item-spacing` | `8px` | `2723:2398` | `slotGeometry` — `itemSpacing=8.0` |
| `IconLeading` | `padding` | `2px` top | `2723:2403` | `slotGeometry` — `paddingTop=2.0` |

## Tokens

### Typography

| Token | Value | Source |
|---|---|---|
| Font family | `Roboto` | `get_design_context` typography — `specFragments.typography` |
| Value / placeholder / error | `14px` / `20px` line-height / `400` weight | `specFragments.typography` |

### Colors

All colors are consumed as CSS custom properties. Parenthesized values are the resolved **Light** theme values from `components/powerflex-theme.css` or the imported IDS theme.

| Token | Light value | Usage |
|---|---|---|
| `var(--color-background-component)` | `#ffffff` | default field background |
| `var(--color-background-component-light)` | `#f4f4f4` | disabled field background |
| `var(--color-text-neutral-strong)` | `#252525` | filled value text |
| `var(--text-box-placeholder-color)` | `#888888` | placeholder text (PowerFlex override) |
| `var(--text-box-disabled-value-color)` | `#777777` | disabled value text (PowerFlex override) |
| `var(--text-box-border-default)` | `#888888` | default border (PowerFlex override) |
| `var(--text-box-border-hover)` | `#333333` | hover border (PowerFlex override) |
| `var(--text-box-border-active)` | `#0076ce` | active/focus border (PowerFlex override) |
| `var(--text-box-border-error)` | `#af0000` | error border (PowerFlex override) |
| `var(--text-box-error-icon-color)` | `#af0000` | error icon (PowerFlex override) |
| `var(--color-border-brand-base)` | `#0672cb` | fallback focus-ring stroke token |

### Component aliases

| Alias | Value | Figma evidence |
|---|---|---|
| `var(--text-box-control-radius)` | `0px` | FieldContainer/InputRow components do not report `cornerRadius`; captured as a PowerFlex component alias |
| `var(--text-box-focus-ring-radius)` | `4px` | Focus ring bound to `VariableID:2453:30`; `4px` verified from `slotGeometry` |

## States (Light Theme)

### State matrix — `filled` content

| State | Background | Border | Text-Icon |
|---|---|---|---|
| `default` | `var(--color-background-component)` | `var(--text-box-border-default)` | `var(--color-text-neutral-strong)` |
| `hover` | `var(--color-background-component)` | `var(--text-box-border-hover)` | `var(--color-text-neutral-strong)` |
| `active` | `var(--color-background-component)` | `var(--text-box-border-active)` | `var(--color-text-neutral-strong)` |
| `disabled` | `var(--color-background-component-light)` | `var(--text-box-border-default)` | `var(--text-box-disabled-value-color)` |
| `error` | `var(--color-background-component)` | `var(--text-box-border-error)` | `var(--color-text-neutral-strong)` + `var(--text-box-error-icon-color)` icon |

### Placeholder state

| Content | Text token |
|---|---|
| `example` (placeholder) | `var(--text-box-placeholder-color)` |
| `empty` | `var(--text-box-placeholder-color)` |
| `filled` | `var(--color-text-neutral-strong)` |

## States (Dark Theme)

Dark theme values resolve from the imported IDS dark palette (`components/ids-theme.css` under `data-theme="dark"`). No PowerFlex-specific dark overrides were packaged for the `text-input` states.

| State | Background | Border | Text-Icon |
|---|---|---|---|
| `default` | `var(--color-background-component)` | `var(--text-box-border-default)` | `var(--color-text-neutral-strong)` |
| `hover` | `var(--color-background-component)` | `var(--text-box-border-hover)` | `var(--color-text-neutral-strong)` |
| `active` | `var(--color-background-component)` | `var(--text-box-border-active)` | `var(--color-text-neutral-strong)` |
| `disabled` | `var(--color-background-component-light)` | `var(--text-box-border-default)` | `var(--text-box-disabled-value-color)` |
| `error` | `var(--color-background-component)` | `var(--text-box-border-error)` | `var(--color-text-neutral-strong)` + `var(--text-box-error-icon-color)` icon |

## Interactions

### Accessibility

- Visible focus indicator via `FocusRing` layer (`var(--text-box-focus-ring-radius)`, `var(--text-box-border-active)`).
- Keyboard `Tab` moves focus into the field.
- Error state exposes `aria-invalid="true"` and associates `ErrorMessage` with `aria-describedby`.
- Placeholder text must not replace a visible label.

### Behavior & guidelines

- `hover` and `active` states are independent of `Content state` (filled/empty/example).
- `disabled` blocks pointer and keyboard interaction.
- `error` state renders an additional `ErrorMessage` frame below the field with the critical icon.
- Sizes are fixed heights (`sm`=24px, `md`=32px, `lg`=40px); width is 476px in Figma and fluid in generated code unless constrained.

## Composition & API (runtime)

### Variants

Variants are the cross product of three properties:

| Variant | Values | Notes |
|---|---|---|
| `state` | `default`, `hover`, `active`, `disabled`, `error` | drives border and background tokens |
| `content` | `filled`, `empty`, `example` | switches `value` vs `placeholder` text |
| `size` | `sm`, `md`, `lg` | drives height and focus-ring dimensions |

### Runtime API

Recommended props for generated components:

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `string` | `''` | current input value |
| `placeholder` | `string` | `''` | placeholder text shown when `content='empty'` or `content='example'` |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | visual size |
| `disabled` | `boolean` | `false` | sets `disabled` and disabled tokens |
| `invalid` / `error` | `boolean` | `false` | sets error border and message |
| `onChange` | `(value: string) => void` | — | value change callback |

## Codegen Contract (Framework-Agnostic Blueprint)

### Deterministic structure

Emit a single root element with three visual children:
1. `Field` — `<input>` (or framework equivalent) wrapped in the border/background shell.
2. `FocusRing` — absolutely positioned pseudo-element or sibling frame drawn outside the field on `:focus-visible` and `active`.
3. `ErrorMessage` — rendered conditionally below the field when `state='error'`.

### Variant matrix

| Variant combination | DOM state | CSS modifiers |
|---|---|---|
| `state=default` | default | none |
| `state=hover` | not `:hover` in DOM; use `.hover` class for Storybook | `.state-hover` |
| `state=active` | `:focus` / `:active` | `.state-active` |
| `state=disabled` | `disabled` attribute | `[disabled]` |
| `state=error` | `aria-invalid="true"` | `.state-error` |
| `content=example` | empty value, placeholder visible | `.content-example` |
| `content=empty` | empty value | `.content-empty` |
| `content=filled` | value present | `.content-filled` |
| `size=sm\|md\|lg` | — | `.size-sm`, `.size-md`, `.size-lg` |

### Per-slot style contract

| Slot | CSS selector | Contract |
|---|---|---|
| `Field` | `.text-box__field` | `min-height` per size; `padding: 0 8px`; `border: 1px solid var(--text-box-border-default)`; `border-radius: var(--text-box-control-radius)`; `background: var(--color-background-component)` |
| `FocusRing` | `.text-box__focus-ring` | `position: absolute`; inset `-2px`; `border-radius: var(--text-box-focus-ring-radius)`; `border: 1px solid var(--text-box-border-active)` |
| `ErrorMessage` | `.text-box__error` | `display: flex`; `gap: 8px`; `padding: 4px 0`; `color: var(--text-box-border-error)`; `font: 14px/20px Roboto` |
| `IconLeading` | `.text-box__error-icon` | `width: 16px; height: 16px`; `color: var(--text-box-error-icon-color)` |

### Behavior contract

- Focus: when the field receives focus, apply the active border and render the focus ring.
- Hover: switch border to `var(--text-box-border-hover)` when pointer is over the field.
- Disabled: set `disabled` and apply disabled background/text tokens.
- Error: apply `var(--text-box-border-error)` to the field and render `ErrorMessage` below.
- Placeholder: only visible when `value` is empty.

### Accessibility contract

- Use a native `<input>` element (or equivalent with `role="textbox"`).
- Expose `aria-invalid` when `state='error'`.
- Associate the `ErrorMessage` element via `aria-describedby`.
- Focus ring must be visible for keyboard focus (`:focus-visible`) and meet 3:1 contrast against the field background.

### Asset resolution + bundling contract

- The critical icon (`status-critical-circ-solid`) must be resolved from the project's `Icon` component or `assets/icons/status-critical-circ-solid.svg`.
- `components/powerflex-theme.css` must be imported in the component or story bundle.
- No additional image assets are required.

### Fallback/error rules

- If an unknown `state` or `content` value is supplied, render `state=default` and log a validation warning.
- If the `FocusRing` layer cannot be generated, fall back to the host element's `:focus-visible` outline using `var(--text-box-border-active)`.
- If the critical icon asset is missing, render a `span` with the text `!` and the same error colour.

### Validation checklist

- [ ] `border-radius` uses `var(--text-box-control-radius)` and cites Figma node `2723:2610`.
- [ ] Focus ring uses `var(--text-box-focus-ring-radius)` and cites `2694:3714`.
- [ ] All state colours are `var(--...)` tokens, not raw hex values in generated code.
- [ ] Light and Dark theme matrices are structurally parallel.
- [ ] Error state renders `ErrorMessage` and `aria-invalid="true"`.
- [ ] Disabled state sets the `disabled` attribute and uses disabled tokens.
- [ ] Storybook title is exactly `Spec Generated/Powerflex/Text Box` and imports `components/powerflex-theme.css`.

## Source Mapping

| Source | File key / path / node id |
|---|---|
| Figma file | `82bDP05ESsiiGe38p5TEQJ` |
| Figma URL | `https://www.figma.com/design/82bDP05ESsiiGe38p5TEQJ/PowerFlex-MCP-Design-System?node-id=2723-2611&m=dev` |
| Main component set node | `2723:2611` (`text-input`) |
| Default `filled` `lg` node | `2723:2610` |
| Disabled `filled` `lg` node | `2723:2608` |
| Hover `filled` `lg` node | `2723:2589` |
| Active `filled` `lg` node | `2723:2576` |
| Error `filled` `sm` node | `2723:2579` |
| Error `filled` `md` node | `2723:2567` |
| Error input-row node | `2723:2533` |
| Error focus-ring node (sm) | `2723:2537` |
| Error message node | `2723:2398` |
| Icon leading node | `2723:2403` |
| Status critical icon node | `2723:2399` |
| Focus ring node (lg default) | `2694:3714` |
| Focus ring node (lg disabled) | `2694:3719` |
| Verification method | Figma REST API (packaged evidence) |
| Packaged evidence | `figma_evidence.json` in this Bridge session |
