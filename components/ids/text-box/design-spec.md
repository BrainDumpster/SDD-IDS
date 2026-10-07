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
- `TextBoxField` (outer wrapper; only rendered when a label is present, lays label left of or above the field group via `labelPosition`)
- `TextBoxLabel` (**optional** form label; `<label>` linked to the input via `for`/`id`)
- `TextBoxRequiredMark` (**optional** `*` shown when `required`, inside the label)
- `TextBoxInfoIcon` (**optional** info icon shown when `showInfoIcon` is true, inside the label)
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
- Runtime width is container-driven (`width: 100%`) with `min-width: 70px` and `max-width: 700px` on the **non-label field area** only. Sample frame width `300px`.
- Width behavior:
  - Numbers (2-3 digits): input must not truncate the value.
  - Text / alphanumeric: ~20-30 visible characters before truncation; consider a text area if the average expected input is longer.
  - Small containers (dialogs / details panel): text box fills the available container width (with padding).
  - Large containers (pages): text box does not span the full page width; it caps at `700px`.
  - Non-label field areas align with other form fields (text boxes, text areas, dropdowns, date/time pickers) so all controls share the same width.
- Input size variants:
  - `large`: control height `40px`
  - `small`: control height `32px`
- Text area sample height: `150px` total component height (control plus helper row).
- `TextBoxTextArea` fills the control's content height (`align-self: stretch`; `resize: none`).
- Horizontal insets:
  - input/text area control: `16px` left and right
  - control content gap: `10px` (text-to-icon)
- Vertical spacing:
  - control to helper row: `4px`
  - helper row icon-to-text gap: `8px`
- Error text: single-line only (`white-space: nowrap`); does not truncate/ellipsis (overflows visibly if wider than the control).
- Label (optional; left position only):
  - label and field group in a row, gap `16px`, aligned to top
  - label vertical padding: `10px` top and bottom for `large` (40px control), `6px` top and bottom for `small` (32px control)
  - label text-to-`*` gap: `2px`
  - label-to-info-icon gap: `8px`
  - asterisk and info icon are optional
  - label text is single-line (`nowrap`)
- Control corner radius: **`var(--text-box-control-radius)`** (IDS theme resolves to `var(--corner-radius-radius-none)` / 0).
- Text area padding aligns to sample: `9px` top and `10px` bottom.
- Trailing icon size: `16px x 16px`.
- Focus draws no outer ring: a focused control looks the same as Selected (brand control border only).
## Tokens

### Layout aliases (theme-resolvable)
Programmes override these **same alias names** in programme theme CSS. Component specs and generated CSS reference aliases only.

| Alias | IDS default (`components/ids-theme.css`) |
|---|---|
| `--text-box-control-radius` | `var(--corner-radius-radius-none)` |
| `--text-box-focus-ring-radius` | `var(--corner-radius-radius-4)` (not used by IDS Text Box since the 2026-10 review; kept for programme / Synapse themes) |

- Surface/background:
  - `var(--color-background-surface-component)` (default)
  - `var(--color-background-gray-light)` (disabled)
- Border:
  - `var(--color-border-gray-neutral-base)` (default)
  - `var(--color-border-gray-neutral-strong)` (hover)
  - `var(--color-border-brand-base)` (selected, and focus — click or keyboard)
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
| TextBoxControl | focus (same as selected) | `var(--color-background-surface-component)` | `var(--color-border-brand-base)` (no outer outline) | text `var(--color-text-gray-neutral)`, icon `var(--color-icon-gray-neutral-base)` |
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
- Focus uses the Selected visual whether the field is clicked or reached with `Tab` / `Shift-Tab`: control border `var(--color-border-brand-base)`, no outer ring. Text input and text area are identical.
- When a field that already holds text takes focus — by click (Selected) or by `Tab` / `Shift-Tab` — the caret follows `selectTextOnFocus` (Figma property *Select text when in focus*), the same way for both:
  - `true` (default): the whole value is selected, so typing replaces it. For simple values that are usually re-entered (e.g. Location `Boston`, a person's name).
  - `false`: the caret is placed at the end of the value. For important values that are usually edited in part, where an accidental keystroke would wipe the value (e.g. IP address `190.10.1.100`).
  - The field never restores a selection the user made before leaving it: coming back applies the same rule again.
  - Clicking inside a field that is already focused only moves the caret.
  - An empty field shows the caret at the start either way (placeholder text is not a value).
- `selectTextOnFocus` belongs to Text Box / Text Area only. Components that embed the field (Pagination page input, Slider value inputs) pass `null` and keep the browser's own caret behaviour.
- Disabled removes interaction and uses disabled text/icon/background tokens.
- Error state keeps control interactive (unless separately disabled) and shows critical helper row.
- Demo/testing mode may force visual states with `data-state`; this must not block runtime pointer/keyboard behavior.
## Composition & API (runtime)
- `componentType: "text-input" | "text-area"` (default `"text-input"`)
- `size: "large" | "small"` (default `"large"`; `small` valid for text-input)
- `label?: string` (**optional**; when omitted no label renders and output is the bare field group)
- `showLabel?: boolean` (default `true`; toggles label visibility when `label` is set)
- `labelPosition?: "left" | "top"` (default `"left"`)
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
- `showInfoIcon?: boolean` (default `false`)
- `infoTooltip?: string` (tooltip content for the info icon)
- `rows?: number` (textarea only; default `4`)
- `inputType?: string` (text-input only; default `"text"`)
- `selectTextOnFocus?: boolean | null` (default `true`; Figma property *Select text when in focus*; text-input and text-area; click and keyboard focus; `null` = browser default for embedding components — see **Interactions**)
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
  - visualState: `default | hover | selected | focus (= selected) | disabled | error`
  - helperMode: `none | helper | error`
  - suffixIcon: `hidden | visible(mail or custom slug)`
- Per-slot style contract:
  - `TextBoxControl` owns all border/background state styling; `border-radius: var(--text-box-control-radius)`; no focus ring.
  - text field slot is transparent, borderless, inherits typography/color tokens.
  - `TextBoxTextArea` fills the control's content height (`align-self: stretch`) with `resize: none`.
  - `TextBoxErrorText` is single-line (`white-space: nowrap`) and does not truncate with ellipsis.
  - helper/error row is always outside control with 4px vertical gap.
- Behavior contract:
  - `onValueChange` emits on every text change.
  - `disabled` overrides hover/focus/selected/error visuals to disabled visual model.
  - `invalid || errorText` activates error helper row styling.
  - runtime focus semantics (identical for text-input and text-area):
    - pointer and keyboard focus -> selected border (`var(--color-border-brand-base)`, `TextBoxControl:focus-within`), no outline ring
  - focus with a value (click or keyboard): `selectTextOnFocus` -> select all; `false` -> caret at end; `null` -> browser default; no restored selection
  - on a click the selection is applied again after the pointer is released, because the browser places the caret under the pointer on release
- Accessibility contract:
  - input/textarea must expose `aria-invalid` when invalid.
  - a visible label must be programmatically linked to the input via `for`/`id`; `aria-label` is the fallback when no visible label is shown (placeholder is never the label).
  - `required` exposes `aria-required`.
  - helper/error row must be linked via `aria-describedby`, combined with any caller-provided `aria-describedby` (not replaced by it).
  - keyboard operations use native input semantics (Tab/Shift-Tab tab stops, arrow keys within the field, typing on focus with no extra action).
  - preceding information icons are focusable tab stops and are reached before the input when pressing `Tab`.
  - important requirements must not rely on placeholder text alone (not all screen readers read it); use visible helper text or instructions.

## Accessibility

### Keyboard Navigation
Common keystrokes used to navigate text boxes:
- `Tab`: Moves focus between tab stops. Each text box is a tab stop, as are any preceding information icons.
- `Shift-Tab`: Moves focus to the previous tab stop.
- `Arrow keys`: Used to navigate within a text input or text area.

### Behavior
- When a text box receives focus, the user can begin typing in the text box with no additional actions.
- Focus shows the brand border (the Selected style) for both text input and text area; there is no separate outer focus ring.
- When the field already holds text, focus by click or keyboard either selects the whole value (`selectTextOnFocus`, default) or places the caret at the end (`selectTextOnFocus={false}`). Choose per field: turn it off for values that are usually edited in part.
- All text boxes should have labels. These labels should be programmatically associated with the text box using the `for` attribute.
- Placeholder text is not a replacement for labels.
- Not all screen readers recognize and read placeholder text, so it should not contain important requirements such as field formatting. Important information should be visible on the screen in instructions or helper text.
- Use `aria-describedby` to associate helper text with the text box.
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
  - [ ] layout uses component aliases (`--text-box-control-radius`), not hardcoded px
  - [ ] all visual states match tokenized border/background/text/icon model
  - [ ] helper and error rows are mutually exclusive in render output
  - [ ] disabled prevents editing and pointer interaction
  - [ ] focus (click or keyboard) shows the selected brand border and no outer ring
  - [ ] text area focus visuals match text input
  - [ ] focus by click or keyboard selects the value when `selectTextOnFocus` is on, puts the caret at the end when off, and never restores an earlier selection
  - [ ] Pagination and Slider keep the browser's caret behaviour (`selectTextOnFocus={null}`)
  - [ ] dark theme uses same semantic tokens (no hardcoded literals)
  - [ ] unknown icon slug does not crash rendering
## Implementation Notes
- Width constraints (`70px` min / `700px` max) apply to the non-label field area only (`TextBoxRoot`), using `width: 100%` so it fills its container in small panels and caps at `700px` on wide pages.
- Label vertical padding tracks control size: `10px` for `large` (40px), `6px` for `small` (32px). Label text, asterisk, and info icon are grouped with `2px` text-to-asterisk gap and `8px` label-to-icon gap.
- `<textarea>` fills the control height (`align-self: stretch`) and `cols={1}` is set so CSS `width: 100%` controls the rendered width instead of the browser default `cols`.
- `TextBoxErrorText` is constrained to one line (`white-space: nowrap`) without ellipsis truncation; it overflows visibly if longer than the field.
- Focus (2026-10 review): the focus state is the Selected state — brand border, no outer ring — for click and Tab alike, so a field reached by Tab no longer looks different from one that was clicked. `selectTextOnFocus` (Figma *Select text when in focus*) lets each Text Box / Text Area choose select-all or caret-at-end, and applies to click focus the same way as to Tab.
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
