# IDS Text Box Design Spec

## Metadata
- Component: Text Box
- Design system: IDS
- Category: Formelements
- Spec path: `components/ids/text-box/design-spec.md`
- Primary Figma (verified): https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=42065-39424&m=dev
- Figma file key: `0bHk3XhrjFhowgFkz9yLr4`
- Primary node id: `42065:39424`
- Verification method: Figma MCP (`get_metadata`, `get_design_context`, `get_variable_defs`)
- Verified at: 2026-04-20
## Anatomy
- `TextBoxField` (outer wrapper; only rendered when a label is present, lays label left of the field group)
- `TextBoxLabel` (**optional** form label; `<label>` linked to the input via `for`/`id`)
- `TextBoxRequiredMark` (**optional** `*` shown when `required`, inside the label)
- `TextBoxRoot` (field wrapper)
- `TextBoxControl` (input/textarea container)
- `TextBoxInput` (single-line `<input>`)
- `TextBoxTextArea` (multi-line `<textarea>`)
- `TextBoxSuffixIcon` (optional trailing icon, default `mail`)
- `TextBoxHelperRow` (helper/error row)
- `TextBoxHelperText`
- `TextBoxErrorIcon` (critical icon `status-critical-square-solid`)
- `TextBoxErrorText`
## Layout & Measurements
- Runtime width is container-driven (`width: 100%`) with sample frame width `300px`.
- Input size variants:
  - `large`: control height `40px`
  - `small`: control height `32px`
- Text area sample height: `150px` total component height (control plus helper row).
- Horizontal insets:
  - input/text area control: `16px` left and right
  - control content gap: `10px` (text-to-icon)
- Vertical spacing:
  - control to helper row: `4px`
  - helper row icon-to-text gap: `8px`
- Label (optional; left position only):
  - label and field group in a row, gap `16px`, aligned to top
  - label vertical padding: `10px` top and bottom; label text-to-`*` gap: `2px`
  - label text is single-line (`nowrap`)
- Control corner radius: **`var(--text-box-control-radius)`** (IDS theme resolves to `var(--corner-radius-radius-none)` / 0).
- Text area padding aligns to sample: `9px` top and `10px` bottom.
- Trailing icon size: `16px x 16px`.
- Focus-visible ring is outside the control boundary and uses the brand border token.
## Tokens

### Layout aliases (theme-resolvable)
Programmes override these **same alias names** in programme theme CSS. Component specs and generated CSS reference aliases only.

| Alias | IDS default (`components/ids-theme.css`) |
|---|---|
| `--text-box-control-radius` | `var(--corner-radius-radius-none)` |
| `--text-box-focus-ring-radius` | `var(--corner-radius-radius-4)` |

- Surface/background:
  - `var(--color-background-surface-component)` (default)
  - `var(--color-background-gray-light)` (disabled)
- Border:
  - `var(--color-border-gray-neutral-base)` (default)
  - `var(--color-border-gray-neutral-strong)` (hover)
  - `var(--color-border-brand-base)` (selected)
  - `var(--color-border-brand-base)` (focus outline)
  - `var(--color-border-alerting-critical-base)` (error)
- Text:
  - `var(--color-text-gray-neutral)` (input value, helper text)
  - `var(--color-text-gray-neutral-strong)` (label text and required `*`)
  - `var(--color-text-gray-disabled)` (disabled value/placeholder)
  - `var(--color-text-alerting-critical-base)` (error message)
- Icon:
  - `var(--color-icon-gray-neutral-base)` (default suffix icon)
  - `var(--color-icon-gray-neutral-base)` (hover suffix icon)
  - `var(--color-icon-gray-disabled)` (disabled suffix icon)
  - `var(--color-icon-alerting-critical-base)` (error icon)
- Typography:
  - input/helper/error text: Body 2 (`14/20`)
## States (Light Theme)
| Slot | State | Background | Border | Text/Icon |
|---|---|---|---|---|
| TextBoxControl | default | `var(--color-background-surface-component)` | `var(--color-border-gray-neutral-base)` | text `var(--color-text-gray-neutral)`, icon `var(--color-icon-gray-neutral-base)` |
| TextBoxControl | hover | `var(--color-background-surface-component)` | `var(--color-border-gray-neutral-strong)` | text `var(--color-text-gray-neutral)`, icon `var(--color-icon-gray-neutral-base)` |
| TextBoxControl | selected | `var(--color-background-surface-component)` | `var(--color-border-brand-base)` | text `var(--color-text-gray-neutral)`, icon `var(--color-icon-gray-neutral-base)` |
| TextBoxControl | focus-visible | `var(--color-background-surface-component)` | control border `var(--color-border-gray-neutral-base)` + outer outline `var(--color-border-brand-base)` (radius `var(--text-box-focus-ring-radius)`) | text `var(--color-text-gray-neutral)`, icon `var(--color-icon-gray-neutral-base)` |
| TextBoxControl | disabled | `var(--color-background-gray-light)` | `var(--color-border-gray-neutral-base)` | text `var(--color-text-gray-disabled)`, icon `var(--color-icon-gray-disabled)` |
| TextBoxControl | error | `var(--color-background-surface-component)` | `var(--color-border-alerting-critical-base)` | text `var(--color-text-gray-neutral)`, helper row icon/text critical |
| TextBoxHelperRow | helper | transparent | none | `var(--color-text-gray-neutral)` |
| TextBoxHelperRow | error | transparent | none | icon `var(--color-icon-alerting-critical-base)`, text `var(--color-text-alerting-critical-base)` |
## States (Dark Theme)

Dark theme uses the same semantic tokens as **States (Light Theme)**. Resolved values for `[data-theme="dark"]` / `.ids-theme-dark` (and program overlays) live in theme CSS:

- `components/ids-theme.css`
- `components/<program>-theme.css` when a program overlays IDS (for example `components/dap-theme.css`)

Duplicate the full state matrix in this section only when a dark row genuinely uses different `var(--...)` references than the corresponding light row.

*(When Light and Dark tables would list identical `var(--...)` cells, keep the matrix under **States (Light Theme)** only and use this pointer section instead of a second table.)*

## Interactions
- Default runtime mode is interactive and token-driven.
- Click/focus places caret in input/textarea.
- Hover updates control border from accessible to strong.
- Pointer focus (click inside input) is treated as active/selected visual: control border `var(--color-border-brand-base)` with no outline.
- Keyboard focus-visible keeps control border `var(--color-border-gray-neutral-base)` and draws an outer 1px `var(--color-border-brand-base)` ring with `var(--text-box-focus-ring-radius)`.
- Disabled removes interaction and uses disabled text/icon/background tokens.
- Error state keeps control interactive (unless separately disabled) and shows critical helper row.
- Demo/testing mode may force visual states with `data-state`; this must not block runtime pointer/keyboard behavior.
## Composition & API (runtime)
- `componentType: "text-input" | "text-area"` (default `"text-input"`)
- `size: "large" | "small"` (default `"large"`; `small` valid for text-input)
- `label?: string` (**optional**; when omitted no label renders and output is the bare field group)
- `showLabel?: boolean` (default `true`; toggles label visibility when `label` is set)
- `required?: boolean` (default `false`; renders the `*` mark and sets `aria-required`)
- `state: "default" | "hover" | "selected" | "focus" | "disabled" | "error"` (default `"default"`; demo override)
- `value?: string` / `defaultValue?: string`
- `placeholder?: string`
- `disabled?: boolean`
- `invalid?: boolean`
- `helperText?: string`
- `errorText?: string`
- `showHelperText?: boolean` (default `true`)
- `showIcon?: boolean` (default `true`)
- `iconName?: string` (default `"mail"`; user-defined icon slug from `assets/icons`)
- `rows?: number` (textarea only; default `4`)
- `inputType?: string` (text-input only; default `"text"`)
- `id?: string`, `name?: string`, `ariaLabel?: string`, `ariaDescribedBy?: string`
- `onValueChange?: (value: string) => void`
## Codegen Contract (Framework-Agnostic Blueprint)
- Deterministic slot order:
  1. `TextBoxRoot`
  2. `TextBoxControl`
  3. `TextBoxInput | TextBoxTextArea`
  4. `TextBoxSuffixIcon?`
  5. `TextBoxHelperRow?`
  6. `TextBoxErrorIcon?`
  7. `TextBoxHelperText | TextBoxErrorText`
Variant matrix:
  - componentType: `text-input | text-area`
  - size: `large | small` (small only for text-input)
  - content: `empty | filled`
  - visualState: `default | hover | selected | focus-visible | disabled | error`
  - helperMode: `none | helper | error`
  - suffixIcon: `hidden | visible(mail or custom slug)`
- Per-slot style contract:
  - `TextBoxControl` owns all border/background state styling; `border-radius: var(--text-box-control-radius)`; focus ring `border-radius: var(--text-box-focus-ring-radius)`.
  - text field slot is transparent, borderless, inherits typography/color tokens.
  - helper/error row is always outside control with 4px vertical gap.
- Behavior contract:
  - `onValueChange` emits on every text change.
  - `disabled` overrides hover/focus/selected/error visuals to disabled visual model.
  - `invalid || errorText` activates error helper row styling.
  - runtime focus semantics:
    - pointer focus (`:focus:not(:focus-visible)`) -> active border only (`var(--color-border-brand-base)`), no outline ring
    - keyboard focus (`:focus-visible`) -> control border `var(--color-border-gray-neutral-base)` + visible outer focus ring (`var(--text-box-focus-ring-radius)`)
- Accessibility contract:
  - input/textarea must expose `aria-invalid` when invalid.
  - a visible label must be programmatically linked to the input via `for`/`id`; `aria-label` is the fallback when no visible label is shown (placeholder is never the label).
  - `required` exposes `aria-required`.
  - helper/error row must be linked via `aria-describedby`, combined with any caller-provided `aria-describedby` (not replaced by it).
  - keyboard operations use native input semantics (Tab/Shift-Tab tab stops, arrow keys within the field, typing on focus with no extra action).
- Asset resolution + bundling:
  - suffix icon is user-defined via `iconName` and resolves from `assets/icons/<slug>.svg` (default `mail`).
  - error helper icon slug is `status-critical-square-solid` and resolves from `assets/icons/status-critical-square-solid.svg`.
  - if icon asset missing, render no icon and preserve text layout.
- Fallback/error rules:
  - unknown `size` -> `large`
  - unknown `componentType` -> `text-input`
  - if `showHelperText=false`, suppress helper/error row.
  - if `componentType="text-area"` and `size="small"`, keep text-area height behavior and ignore small height constraint.
- Validation checklist (pass/fail):
  - [ ] layout uses component aliases (`--text-box-control-radius`, `--text-box-focus-ring-radius`), not hardcoded px
  - [ ] all visual states match tokenized border/background/text/icon model
  - [ ] helper and error rows are mutually exclusive in render output
  - [ ] disabled prevents editing and pointer interaction
  - [ ] focus-visible ring appears only when focused
  - [ ] dark theme uses same semantic tokens (no hardcoded literals)
  - [ ] unknown icon slug does not crash rendering
## Source Mapping
- Map source: `data/component-figma-map.json` -> component `"Text Box"`.
- IDS design library source:
  - file key: `0bHk3XhrjFhowgFkz9yLr4`
  - node id: `42065:39424`
  - URL: https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=42065-39424&m=dev
- Verified instance evidence includes:
  - Text input states (`default`, `hover`, `selected`, `focus`, `disabled`, `error`)
  - Text area states (`default`, `hover`, `selected`, `focus`, `disabled`, `error`)
  - Size examples (`large 40`, `small 32`)
- Variable evidence extracted via `get_variable_defs` for border/text/icon/background tokens listed in this spec.
