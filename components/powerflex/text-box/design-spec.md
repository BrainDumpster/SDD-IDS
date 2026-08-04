# Text Box

## Metadata

| Property | Value |
|---|---|
| Spec pattern | standalone |
| Programme | PowerFlex |
| Component slug | `text-box` |
| Display name | Text Box |
| Status | draft |
| Figma file key | `82bDP05ESsiiGe38p5TEQJ` |
| Main component set node | `2723:2611` |
| Verification method | Figma REST API |
| Figma URL | [PowerFlex MCP Design System — text-input](https://www.figma.com/design/82bDP05ESsiiGe38p5TEQJ/PowerFlex-MCP-Design-System?node-id=2723-2611&m=dev) |
| Theme CSS | `components/powerflex-theme.css` |
| Root spec | `components/powerflex/root-spec.md` |
| Packaged evidence | `figma_evidence.json` (mode: `rest`, source: `figma_rest_enriched`) |

## Anatomy

The Text Box is a single-line text input with a focus ring and an optional error state.

- **Root / Input shell** (`text-box`) — the outer component container.
- **Value / Placeholder text** (`text-box__input`) — editable text or placeholder.
- **Focus ring** (`text-box__focus-ring`) — visible on `:focus`/active state.
- **Leading error icon** (`text-box__icon-leading`) — `status-critical-circ-solid` instance shown in error state.
- **Error message** (`text-box__error`) — supplementary text shown below the input in error state.

## Layout & Measurements

- The COMPONENT_SET `text-input` spans `1558x1057` px.
- Default specimen width in Figma is `476` px; height is size-dependent.
- Sizes:
  - `lg`: `40` px height (`2723:2610`)
  - `md`: `32` px height (`2723:2605`)
  - `sm`: `24` px height (`2723:2603`)
- Inline padding: `8` px left and right.
- Horizontal item spacing: `16` px between internal elements (icon/text).
- Focus ring frame is `2` px wider/taller than the input (e.g. `480x44` for `lg`).

### Slot geometry (Figma-verified)

| Slot / layer | Property | Token / contract | Figma node | Live evidence |
|---|---|---|---|---|
| `text-input` COMPONENT_SET | `border-radius` | `--text-box-control-radius` (5px) | `2723:2611` | `get_design_context` reports `cornerRadius=5.0`; no radius `boundVariableHints` returned in packaged `get_variable_defs` for this node. |
| `State=default, Content state=filled, Size=lg` COMPONENT | `min-height` | `--size-component-height-lg` (40px) | `2723:2610` | `slotGeometry` height `40.0`; `boundVariableHints`: `VariableID:2454:3`, `VariableID:2454:2`, `VariableID:2521:3`, `VariableID:2453:4` (`color/background/surface`), `VariableID:2453:8` (not in packaged defs). |
| `State=default, Content state=filled, Size=md` COMPONENT | `min-height` | `--size-component-height-md` (32px) | `2723:2605` | `slotGeometry` height `32.0`; same bound hint set as lg default. |
| `State=default, Content state=filled, Size=sm` COMPONENT | `min-height` | `--size-component-height-sm` (24px) | `2723:2603` | `slotGeometry` height `24.0`; same bound hint set as lg default. |
| `focus-ring` FRAME (lg default) | `width / height` | `--text-box-focus-ring` dimensions (`480x44`) | `2694:3714` | `slotGeometry` width `480.0`, height `44.0`; `boundVariableHints`: `VariableID:2453:30` (not resolved in packaged `get_variable_defs`). |
| `error-message` FRAME | `padding` | `--padding-padding-4` top/bottom (4px) | `2723:2398` | `slotGeometry` paddingTop/Bottom `4.0`, itemSpacing `8.0`, `boundVariableHints`: `VariableID:2454:2`, `VariableID:2521:3`, `VariableID:2521:6` (not in packaged defs). |

## Tokens

### Typography

- Font family: `Roboto` (system sans fallback).
- Value / placeholder / error message: `14px` / `20px` line-height / `400` weight.
- Tokenize with: `--font-size-body-2` (`14px`), `--font-line-height-line-height-20` (`20px`), `font-weight: 400`.

### Colors

| Token | Light value | Dark value | Source / binding |
|---|---|---|---|
| `--text-box-background` | `var(--color-background-component)` (`#ffffff`) | `var(--color-background-component)` (dark: `#111619`) | Figma default fill `#ffffff`; `VariableID:2453:4` `color/background/surface` bound but resolved to `None` in packaged defs; semantic fallback from IDS. |
| `--text-box-background-disabled` | `var(--color-background-component-light)` (`#f4f4f4`) | `var(--color-background-component-light)` (dark: `#1e262c`) | Figma disabled fill `#f4f4f4`. |
| `--text-box-border-default` | `#888888` | `#8898a5` | Figma default stroke `#888888`. |
| `--text-box-border-hover` | `#333333` | `#e6e9ec` | Figma hover stroke `#333333`. |
| `--text-box-border-active` | `#0076ce` | `#509cda` | Figma active/focus stroke `#0076ce`; approximates `--color-border-brand-base`. |
| `--text-box-border-error` | `var(--color-border-alerting-critical-base)` (`#af0000`) | `var(--color-border-alerting-critical-base)` (dark: `#dd9494`) | Figma error `input-row` stroke `#af0000`. |
| `--text-box-text` | `var(--color-text-neutral-strong)` (`#252525`) | `var(--color-text-neutral-strong)` (dark: `#e6e9ec`) | Figma value fill `#333333`; semantic mapping. |
| `--text-box-text-disabled` | `var(--color-text-disabled)` (`#757575`) | `var(--color-text-disabled)` (dark: `#c5c5c5`) | Figma disabled value `#777777`. |
| `--text-box-placeholder` | `#888888` | `#8898a5` | Figma placeholder fill `#888888`. |
| `--text-box-focus-ring` | `#0076ce` | `#509cda` | Figma focus-ring stroke `#0076ce`; close to `--color-border-brand-base`. |
| `--text-box-icon-error` | `var(--color-icon-alerting-critical)` (`#af0000`) | `var(--color-icon-alerting-critical)` (dark: `#c74c4c`) | Figma `status-critical-circ-solid` fill `#af0000`. |
| `--text-box-error-text` | `var(--color-text-critical)` (`#af0000`) | `var(--color-text-critical)` (dark: `#dd9494`) | Error message inferred from `status-critical-circ-solid` color. |

### Spacing & sizing

- Inline padding: `--padding-padding-8` (`8px`).
- Internal item spacing: `--spacing-space-16` (`16px`).
- Heights: `--size-component-height-lg` (`40px`), `--size-component-height-md` (`32px`), `--size-component-height-sm` (`24px`).

### Radius

- Control radius: `--text-box-control-radius` = `5px` (Figma `cornerRadius=5.0` on `2723:2611`).
- Focus-ring radius: `--text-box-focus-ring-radius` = `4px` (no Figma node binding; aligns with IDS convention).

## States (Light Theme)

| State | Background | Border | Text / Icon |
|---|---|---|---|
| `default` (filled/example/empty) | `var(--text-box-background)` | `var(--text-box-border-default)` (`#888888`) | `var(--text-box-text)` or `var(--text-box-placeholder)` |
| `hover` | `var(--text-box-background)` | `var(--text-box-border-hover)` (`#333333`) | `var(--text-box-text)` |
| `active` / `:focus` | `var(--text-box-background)` | `var(--text-box-border-active)` (`#0076ce`) | `var(--text-box-text)` |
| `disabled` | `var(--text-box-background-disabled)` | `var(--text-box-border-default)` (`#888888`) | `var(--text-box-text-disabled)` |
| `error` | `var(--text-box-background)` | `var(--text-box-border-error)` (`#af0000`) | `var(--text-box-text)`; icon `var(--text-box-icon-error)`; message `var(--text-box-error-text)` |

## States (Dark Theme)

Dark mode values are resolved by the PowerFlex theme CSS through the same token set. The semantic tokens (e.g. `--color-text-neutral-strong`, `--color-border-alerting-critical-base`) switch to their dark definitions; component-specific tokens (`--text-box-border-default`, `--text-box-border-hover`, `--text-box-border-active`, `--text-box-placeholder`) are explicitly overridden in `components/powerflex-theme.css`.

| State | Background | Border | Text / Icon |
|---|---|---|---|
| `default` | `var(--text-box-background)` | `var(--text-box-border-default)` | `var(--text-box-text)` or `var(--text-box-placeholder)` |
| `hover` | `var(--text-box-background)` | `var(--text-box-border-hover)` | `var(--text-box-text)` |
| `active` / `:focus` | `var(--text-box-background)` | `var(--text-box-border-active)` | `var(--text-box-text)` |
| `disabled` | `var(--text-box-background-disabled)` | `var(--text-box-border-default)` | `var(--text-box-text-disabled)` |
| `error` | `var(--text-box-background)` | `var(--text-box-border-error)` | `var(--text-box-text)`; icon `var(--text-box-icon-error)`; message `var(--text-box-error-text)` |

## Interactions

### Behavior & guidelines

- Default state shows a value or placeholder.
- Hover darkens the border.
- Active / focused shows a `1px` focus ring in `--text-box-focus-ring` (`#0076ce` light).
- Disabled prevents input and uses the disabled background/border/text colors.
- Error state adds a `1px` critical border, a leading critical icon, and an error message.
- Error and disabled are mutually exclusive; disabled takes precedence.

### Accessibility

- Use a native `<input type="text">` with an associated `<label>`.
- Set `aria-invalid="true"` and `aria-describedby` pointing to the error message when in `error`.
- Focus outline must meet `3:1` contrast; the focus ring uses `--text-box-focus-ring`.

## Composition & API (runtime)

### Variants

| Variant | Options |
|---|---|
| `state` | `default`, `hover`, `active`, `disabled`, `error` |
| `contentState` | `filled`, `example`, `empty` |
| `size` | `sm`, `md`, `lg` |

### Runtime API

React / framework-agnostic props:

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `string` | `''` | Current input value. |
| `defaultValue` | `string` | `''` | Uncontrolled default. |
| `placeholder` | `string` | `''` | Placeholder text. |
| `size` | `'sm' | 'md' | 'lg'` | `'md'` | Visual size. |
| `disabled` | `boolean` | `false` | Disabled state. |
| `invalid` / `error` | `boolean` | `false` | Error state. |
| `errorMessage` | `string` | `''` | Error text. |
| `onChange` | `(value: string) => void` | — | Value change callback. |
| `onFocus` / `onBlur` | `() => void` | — | Focus handlers. |

Slots:

- `root`: `.text-box`
- `input`: `.text-box__input`
- `focus-ring`: `.text-box__focus-ring` (or CSS `box-shadow`)
- `leadingIcon`: `.text-box__icon-leading`
- `errorMessage`: `.text-box__error`

## Codegen Contract (Framework-Agnostic Blueprint)

### Deterministic structure

```html
<div class="text-box text-box--{size} text-box--{state}" data-content-state="{contentState}">
  <div class="text-box__focus-ring">
    <input class="text-box__input" type="text" />
  </div>
  <div class="text-box__error">
    <span class="text-box__icon-leading">...</span>
    <span class="text-box__error-text">...</span>
  </div>
</div>
```
(Icon + error message only rendered when `error` is true.)

### Variant matrix

| Variant | Permutation count | Notes |
|---|---|---|
| `state` × `contentState` × `size` | 5 × 3 × 3 = 45 | Figma component set enumerates all combinations; error is independent of `contentState` in runtime. |
| Error icon | conditional | Rendered only when `error` and `errorMessage` present. |

### Per-slot style contract

| Slot | CSS rules |
|---|---|
| `.text-box` | `display: flex; flex-direction: column;` |
| `.text-box__input` | `height: var(--size-component-height-{size}); padding: 0 var(--padding-padding-8); border: 1px solid var(--text-box-border-default); border-radius: var(--text-box-control-radius); background: var(--text-box-background); color: var(--text-box-text); font: var(--font-size-body-2)/var(--font-line-height-line-height-20) Roboto;` |
| `.text-box__input::placeholder` | `color: var(--text-box-placeholder);` |
| `.text-box--hover .text-box__input` | `border-color: var(--text-box-border-hover);` |
| `.text-box--active .text-box__input, .text-box__input:focus` | `border-color: var(--text-box-border-active); outline: 1px solid var(--text-box-focus-ring); outline-offset: 2px;` |
| `.text-box--disabled .text-box__input` | `background: var(--text-box-background-disabled); color: var(--text-box-text-disabled); border-color: var(--text-box-border-default);` |
| `.text-box--error .text-box__input` | `border-color: var(--text-box-border-error);` |
| `.text-box__icon-leading` | `color: var(--text-box-icon-error); width: 16px; height: 16px;` |
| `.text-box__error` | `color: var(--text-box-error-text); padding: var(--padding-padding-4) 0;` |

### Behavior contract

- On `focus`, apply `active` border color and show focus ring.
- On `hover`, if not disabled/error, switch border to hover color.
- On `disabled`, ignore focus/hover.
- On `error`, border becomes critical; render leading icon + error message.
- Placeholder disappears once user types (`contentState=filled`).

### Accessibility contract

- Native `<input>` is focusable and exposes `required`, `disabled`, `aria-invalid`, `aria-describedby`.
- Error message is linked via `aria-describedby`.
- Focus ring is visible and color-contrasted.

### Asset resolution + bundling contract

- `status-critical-circ-solid` icon must resolve from the design-system icon library.
- Theme CSS `components/powerflex-theme.css` must be imported before component styles.

### Fallback/error rules

- Unknown `size` → `md`.
- Unknown `state` → `default`.
- `disabled=true` overrides `error`.
- Missing `errorMessage` still renders border/icon if `error=true`.

### Validation checklist

- [ ] All 3 sizes (`sm`, `md`, `lg`) render at correct height.
- [ ] Border colors match the state matrices in light and dark.
- [ ] Focus ring is visible and uses `--text-box-focus-ring`.
- [ ] Disabled state prevents interaction and changes colors.
- [ ] Error state shows critical border, leading icon, and message.
- [ ] `aria-invalid` and `aria-describedby` set in error state.

## Source Mapping

| Source | File key | Node ID(s) | Verification |
|---|---|---|---|
| PowerFlex MCP Design System — `text-input` component set | `82bDP05ESsiiGe38p5TEQJ` | `2723:2611` | `Figma REST API` (`get_metadata`, `get_design_context`, `get_variable_defs`) |
| Default `lg` / `md` / `sm` components | `82bDP05ESsiiGe38p5TEQJ` | `2723:2610` / `2723:2605` / `2723:2603` | `slotGeometry` / `get_design_context` |
| Hover variants | `82bDP05ESsiiGe38p5TEQJ` | `2723:2589` (lg), `2723:2587` (md), `2723:2598` (sm) | `slotGeometry` |
| Active variants | `82bDP05ESsiiGe38p5TEQJ` | `2723:2576` (lg), `2723:2573` (md), `2723:2572` (sm) | `slotGeometry` |
| Disabled variants | `82bDP05ESsiiGe38p5TEQJ` | `2723:2608` (lg), `2723:2604` (md), `2723:2602` (sm) | `slotGeometry` |
| Error variants | `82bDP05ESsiiGe38p5TEQJ` | `2723:2579` (sm), `2723:2567` (md), `2723:2533` (input-row), `2723:2398` (error-message), `2723:2403` (icon-leading), `2723:2399` (status-critical-circ-solid) | `slotGeometry` / `get_design_context` |
| Verification method | — | — | `Figma REST API`; packaged evidence only (`figma_evidence.json`) |
