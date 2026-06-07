# Dropdown: Single-select Design Spec

## Metadata
- Component: Dropdown: Single-select
- Category: Formelements
- Design System: IDS
- Figma design: `https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=43264-181428&m=dev`
- Figma component matrix: `https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=11099-58099&m=dev`
- Figma menu elements: `https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=12579-19717&m=dev`
- Figma option states: `https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=12380-16525&m=dev`
- File key: `0bHk3XhrjFhowgFkz9yLr4`
## Anatomy
1. `DropdownSingleSelectRoot`
2. optional `Label`
3. `FieldContainer`
4. `ValueSlot` (placeholder or selected label)
5. `IndicatorSlot` (caret `arrow-drop-tri-caret` 10×10, container padding `1px` horizontal / `5px` vertical)
6. optional `HelperText`
7. optional `ValidationError` (critical icon + text)
8. optional `MenuPopup`
9. optional `SearchRow` (when searchable variant enabled)
10. `OptionList`
11. optional `SectionHeaderRow`
12. optional `ActionRow` (footer action)
## Typography
- All text elements (field value, placeholder, option label, helper text, error message, section header, action label): `font-size: var(--font-size-body-2)`, `line-height: var(--font-line-height-line-height-20)`, `font-weight: 400` (regular).
- Label text: `color: var(--color-text-neutral-strong)`.

## Layout & Measurements
- Field sizes:
  - `Large`: `40px` field height.
  - `Small`: `32px` field height.
- Field horizontal padding: `var(--padding-padding-16)`.
- Vertical field padding:
  - Large: `var(--padding-padding-10)`
  - Small: `var(--padding-padding-6)`
- Field inner gap (content ↔ caret): `var(--spacing-space-10)`
- Option row:
  - visual row: tokenized `10px` vertical + `16px` left / `24px` right padding
  - minimum hit area: `44px`
- Optional radio control:
  - size `16x16`
  - inner dot `8x8`
- Menu width:
  - matches trigger width in component examples (`300px` sample)
  - runtime contract: container-driven with optional min/max constraints.
- Menu elevation: IDS shadow token stack (Shadow 1 family).
- Section header row:
  - `var(--color-border-accessible)` top border on section boundaries
  - first section header top border may be omitted.
- Footer action button inner wrapper: `padding: var(--padding-padding-2) var(--padding-padding-16)`, `border-radius: var(--corner-radius-radius-2)`
- Focus ring: pseudo-element `::after`, `inset: -5px`, `border: 1px solid var(--color-border-brand-base)`, `border-radius: var(--corner-radius-radius-4)` — field itself has no border-radius.
## Tokens
- Field and menu:
  - `var(--color-background-component)`
  - `var(--color-border-accessible)` (field default/show-dropdown border; menu border; section header border)
  - `var(--color-border-strong)` (field hover border)
  - `var(--color-border-brand-base)` (field focus ring; option focus inset border)
  - `var(--color-text-neutral)` (field text; option default/hover text; section header text)
  - `var(--color-text-neutral-strong)` (label text)
  - `var(--color-text-disabled)`
  - `var(--color-background-gray-lighter)` (disabled field; disabled option without radio)
  - `var(--color-border-disabled)` (field disabled border; caret disabled color; disabled option without radio border)
- Selection/interaction:
  - `var(--color-background-brand-lighter)` (option hover/selected-without-radio background)
  - `var(--color-background-brand-light)` (option press/active background)
  - `var(--color-border-brand-neutral)` (option hover/selected/press border — `outline: 1px solid`)
  - `var(--color-background-controls-brand-base)` (radio selected fill)
  - `var(--color-text-brand-strong)` (option selected/press text; action button text)
  - `var(--color-icon-neutral)` (caret default/hover/focus/show-dropdown/error)
  - `var(--color-border-disabled)` (caret disabled)
- Error:
  - `var(--color-border-alerting-critical-base)`
  - `var(--color-icon-alerting-critical)`
  - `var(--color-text-critical)`
- Shadow (menu popup):
  - `var(--shadow-shadow-4-drop-shadow-4-x)` (0)
  - `var(--shadow-shadow-4-drop-shadow-4-y)` (4)
  - `var(--shadow-shadow-4-drop-shadow-4-blur)` (4)
  - `var(--shadow-shadow-4-drop-shadow-4-spread)` (0)
  - `var(--shadow-shadow-4-drop-shadow-4-color)` (rgba(37,37,37,0.08))
- Geometry:
  - `var(--border-width-border-default)` (field + menu border width, 1px)
  - `var(--corner-radius-radius-2)` (action button wrapper border-radius)
  - `var(--corner-radius-radius-4)` (focus ring radius)
  - `var(--spacing-space-8)` (option gap, label gap)
  - `var(--spacing-space-10)` (field inner gap)
  - `var(--padding-padding-1)` (caret horizontal padding)
  - `var(--padding-padding-2)` (action button wrapper vertical padding)
  - `var(--padding-padding-6)` (small field vertical padding; section header vertical padding)
  - `var(--padding-padding-8)` (footer action row vertical padding)
  - `var(--padding-padding-10)` (large field + option vertical padding)
  - `var(--padding-padding-16)` (field + option + action wrapper horizontal padding)
  - `var(--padding-padding-24)` (option right padding)
## States (Light Theme)
| Element | State | Background | Border | Text/Icon |
|---|---|---|---|---|
| Field container | default | `var(--color-background-component)` | `var(--color-border-accessible)` | text `var(--color-text-neutral)`, caret `var(--color-icon-neutral)` |
| Field container | hover | `var(--color-background-component)` | `var(--color-border-strong)` | text `var(--color-text-neutral)`, caret `var(--color-icon-neutral)` |
| Field container | show-dropdown | `var(--color-background-component)` | `var(--color-border-accessible)` | text `var(--color-text-neutral)`, caret `var(--color-icon-neutral)` |
| Field container | focus-visible | `var(--color-background-component)` | inner `var(--color-border-accessible)` + outer ring `var(--color-border-brand-base)` (pseudo `::after`, `inset: -5px`, `border-radius: 4px`) | text `var(--color-text-neutral)`, caret `var(--color-icon-neutral)` |
| Field container | disabled | `var(--color-background-gray-lighter)` | `var(--color-border-disabled)` | text `var(--color-text-disabled)`, caret `var(--color-border-disabled)` |
| Field container | error | `var(--color-background-component)` | `var(--color-border-alerting-critical-base)` | text `var(--color-text-neutral)`, caret `var(--color-icon-neutral)`, error icon `var(--color-icon-alerting-critical)`, error text `var(--color-text-critical)` |
| Option row | default | `var(--color-background-component)` | none | `var(--color-text-neutral)` |
| Option row | hover | `var(--color-background-brand-lighter)` | `outline: 1px solid var(--color-border-brand-neutral)` | `var(--color-text-neutral)` |
| Option row | press/active | `var(--color-background-brand-light)` | `outline: 1px solid var(--color-border-brand-neutral)` | `var(--color-text-brand-strong)` |
| Option row | selected (no radio) | `var(--color-background-brand-lighter)` | `outline: 1px solid var(--color-border-brand-neutral)` | `var(--color-text-brand-strong)` |
| Option row | selected (with radio) | `var(--color-background-component)` | none | `var(--color-text-brand-strong)` |
| Option row | focus-visible | `var(--color-background-component)` | `outline: 1px solid var(--color-border-brand-base)` inset (`outline-offset: -1px`) | `var(--color-text-neutral)` |
| Option row | disabled (no radio) | `var(--color-background-gray-lighter)` | `outline: 1px solid var(--color-border-disabled)` | `var(--color-text-disabled)` |
| Option row | disabled (with radio) | `var(--color-background-component)` | none | `var(--color-text-disabled)` |
| Section header | — | `var(--color-background-component)` | `border-top: var(--color-border-accessible)` | `var(--color-text-neutral)` |
| Footer action row | — | `var(--color-background-component)` | `border-top: var(--color-border-accessible)` | `var(--color-text-brand-strong)` |
## States (Dark Theme)
Dark theme must remain structurally identical to Light Theme with values resolved via semantic IDS tokens only.

| Element | State | Background | Border | Text/Icon |
|---|---|---|---|---|
| Field container | default/hover/focus/disabled/error | semantic token resolved | semantic token resolved | semantic token resolved |
| Option rows | default/hover/selected/disabled | semantic token resolved | semantic token resolved | semantic token resolved |
## Interactions
- Trigger:
  - click/`Enter`/`Space` toggles open/close.
  - `Escape` closes and returns focus to trigger.
- Selection:
  - selecting an option sets exactly one selected value.
  - selecting a new option replaces previous selection.
- Keyboard:
  - `ArrowUp`/`ArrowDown` navigates options.
  - `Enter` commits active option.
- Optional radio mode:
  - radio control visibility is input-driven.
  - radio does not change single-select behavior semantics; it is visual control parity.
  - when option row is focused, only the row-level focus ring shows — radio button does not show its own focus ring simultaneously.
- Optional action row:
  - user-defined label
  - emits action event on click.
## Composition & API (runtime)
| Prop / Slot | Required | Type | Notes |
|---|---|---|---|
| `size` | No | `"small" \| "large"` | Default `large`. |
| `label` | No | `string` | Optional label slot. |
| `placeholder` | No | `string` | User-defined placeholder. |
| `helperText` | No | `string` | User-defined helper text. |
| `errorText` | No | `string` | User-defined error text. |
| `disabled` | No | `boolean` | Blocks interactions. |
| `searchable` | No | `boolean` | Enables search row. |
| `showRadio` | No | `boolean` | Optional radio visual in option rows. |
| `options` | Yes | `{ id: string; label: string; disabled?: boolean }[]` | Canonical option list. |
| `value` | No | `string` | Controlled selected value. |
| `onChange` | No | `(value: string \| optionObject) => void` | Selection event payload strategy is app-defined. |
| `actionLabel` | No | `string` | Optional action row label. |
| `onAction` | No | `() => void` | Optional action row event. |
| `onOpenChange` | No | `(open: boolean) => void` | Open state callback. |
| `onSearch` | No | `(query: string) => void` | Search callback. |
## Codegen Contract (Framework-Agnostic Blueprint)
### Deterministic structure
1. `DropdownSingleSelectRoot`
2. optional `Label`
3. `FieldContainer` -> `ValueSlot` + `CaretSlot`
4. optional `HelperText` or `ValidationError`
5. optional `MenuPopup`
6. optional `SearchRow`
7. `OptionList` -> `OptionRow[]`
8. optional `SectionHeaderRow[]`
9. optional `ActionRow`

### Variant matrix
- `size`: `small | large`
- `content`: `empty | filled`
- `field-state`: `default | hover | show-dropdown | focus-visible | disabled | error`
- `option-state`: `default | hover | press | selected | focus-visible | disabled`
- `radio-visibility`: `on | off`
- `search`: `enabled | disabled`
- `sections`: `none | enabled`
- `action-row`: `none | enabled`

### Per-slot style contract
- Field/menu/option styles must be token-driven.
- `OptionRow` minimum hit target `44px`.
- Radio visual (if shown) must follow IDS radio design-spec geometry and token behavior.
- Section headers use `var(--color-border-accessible)` top border; first section may omit top border.
- Section header text uses `var(--color-text-neutral)`.
- Action row uses `var(--color-text-brand-strong)` text and `var(--color-border-accessible)` top border.
- Action row has inner button wrapper with `padding: var(--padding-padding-2) var(--padding-padding-16)`.
- Option hover/press/selected borders implemented as `outline: 1px solid` (not box-shadow) so they are clipped by popup `overflow: clip` at first/last rows.
- Selected option behavior differs by radio mode:
  - with radio: white background, no outline
  - without radio: `color-background-brand-lighter` background, `outline: 1px solid color-border-brand-neutral`
- Disabled option behavior differs by radio mode:
  - with radio: white background, no outline
  - without radio: `color-background-gray-lighter` background, `outline: 1px solid color-border-disabled`
- Focus ring on field: pseudo-element `::after` with `inset: -5px` (4px gap), `border: 1px solid color-border-brand-base`, `border-radius: var(--corner-radius-radius-4)`. Field element itself has no border-radius.
- Option focus ring: inset `outline: 1px solid color-border-brand-base` with `outline-offset: -1px`.
- When option row is focused, radio button must not render its own focus ring.
- Font weight: `400` (regular) for all text elements (field value, option label, helper text, error message, section header, action label).

### Behavior contract
- Single selection is deterministic and mutually exclusive.
- Disabled option rows are non-interactive.
- Disabled field blocks open/close and selection.
- Search filters visible options without mutating source data.
- Action row emits `onAction` only when enabled.

### Accessibility contract
- Trigger exposes combobox semantics (`role="combobox"`, `aria-expanded`, `aria-controls`).
- Menu exposes listbox/menu semantics aligned with implementation library.
- Active selected option has programmatic selected state.
- Error/helper is linked using `aria-describedby`.

### Asset resolution + bundling contract
- Caret icon: `arrow-drop-tri-caret`, 10×10px, container padding `1px` horizontal / `5px` vertical. Color per state: `var(--color-icon-neutral)` (default/hover/focus/show-dropdown/error), `var(--color-border-disabled)` (disabled). Resolve from `assets/icons/arrow-drop-tri-caret.svg` via shared Icon primitive.
- Error icon: `status-critical-square-solid`, 16×16px, `var(--color-icon-alerting-critical)`. Resolve from `assets/icons/status-critical-square-solid.svg`.
- Optional radio visuals must follow IDS radio design-spec; no hardcoded inline SVG data URIs.

### Fallback/error rules
- Unknown `size` -> `large`.
- Missing `options` -> empty, non-crashing menu.
- Unknown/invalid `value` -> display placeholder with no selected row.
- Unknown action/radio flags -> disabled/off.

### Validation checklist
- [ ] Main state matrix matches `11099:58099`.
- [ ] Menu scenarios match `43264:181428` (`small`, `overflow`, `section`, `action`).
- [ ] Option states match `12380:16525`.
- [ ] Radio optional mode and behavior are deterministic.
- [ ] Error and disabled states align to IDS tokens.
- [ ] Output remains token-only in both light and dark themes.
## Source Mapping
- Figma design frame: `43264:181428`
- Figma component matrix: `11099:58099`
- Figma menu elements: `12579:19717`
- Figma option state elements: `12380:16525`
- Figma annotation frame: `43264:181450`
- Radio dependency spec: `components/ids/radio-button/design-spec.md`
- Component map: `data/component-figma-map.json` -> `Dropdown-Single-Select`
- Verification method: Figma MCP (`get_design_context` + `get_variable_defs`)
- Last live verification: 2026-05-25 (states audit: default, hover, show-dropdown, focus-visible, disabled, error; caret icon per-state; field tokens)

## Implementation Notes
> Last updated: 2026-06-07.

**Focus ring must not add border-radius to the field element.**
The field is square in all states including focus. The ring has `border-radius: var(--corner-radius-radius-4)` and a 4px gap from the field border. Implementation: `IdsDropdownTriggerShell.module.css` — use `::after` pseudo-element (`position: absolute; inset: -5px; border: 1px solid var(--color-border-brand-base); border-radius: var(--corner-radius-radius-4); pointer-events: none`) instead of `outline` + `border-radius` on the element itself.

**Caret disabled color is `var(--color-border-disabled)`, not `var(--color-icon-disabled)`.**
Both tokens resolve to the same value in light mode but differ in dark mode. Implementation: `IdsDropdownTriggerShell.module.css` — `.field[data-disabled] .caretWrap { color: var(--color-border-disabled) }`.

**Font weight for all text elements is 400 (regular).**
Do not set `font-weight` explicitly in component CSS — browser default (400) is correct. Implementation: `IdsDropdownTriggerShell.module.css`, `DropdownMenu.module.css` — no `font-weight` on `.field`, `.item`, `.sectionHeader`, `.footerAction`.

**Option hover/press/selected/active borders must use `outline`, not `box-shadow: inset`.**
`box-shadow` is not clipped by `overflow: clip` on the popup container, causing the border to visually overlap the popup's outer border on the first and last rows. `outline` is clipped correctly. Implementation: `DropdownMenu.module.css` — `outline: 1px solid var(--color-border-brand-neutral)` on hover, press, selected, and active states.

**Option focus state requires an inset ring.**
Spec defines a 1px inset border using `var(--color-border-brand-base)` with `border-radius: var(--corner-radius-radius-4)`. Was previously suppressed with `outline: none`. Implementation: `DropdownMenu.module.css` — `.item:focus-visible { outline: 1px solid var(--color-border-brand-base); outline-offset: -1px; border-radius: var(--corner-radius-radius-4) }`.

**Radio button must not show its own focus ring when the option row is focused.**
Only the row-level ring should appear. Implementation: `DropdownMenu.module.css` — `.item:focus-visible .radioOuter::after { content: none }`.

**Selected and disabled option states differ depending on radio presence.**
With radio button: `var(--color-background-component)`, no outline. Without radio button: `var(--color-background-brand-lighter)` + outline (selected) or `var(--color-background-gray-lighter)` + `var(--color-border-disabled)` outline (disabled). Implementation: `DropdownMenu.module.css` — use `:has(.radioOuter)` selector to split the two cases.

**Section header border and text color were incorrect.**
Spec uses `var(--color-border-accessible)` for `border-top` and `var(--color-text-neutral)` for text. Implementation: `DropdownMenu.module.css` — update `.sectionHeader` accordingly.

**Footer action row requires an inner button wrapper.**
Outer row padding is `var(--padding-padding-8) 0` (no horizontal padding). The label sits inside a `<span>` wrapper with `padding: var(--padding-padding-2) var(--padding-padding-16); border-radius: var(--corner-radius-radius-2)`. Implementation: `DropdownMenu.module.css` `.footerAction` + `.footerActionButton`; `DropdownMenu.tsx` wraps `footerActionLabel` in `<span className={styles.footerActionButton}>`.

**FieldStatesMatrix story: cell width was too narrow.**
`cellStyle.width: 240` caused the 300px field to overflow and appear merged with adjacent columns; focus rings spanned all four fields as one. Implementation: `IdsDropdownSingleSelect.stories.tsx` — `cellStyle.width: 332`.

**FieldStatesMatrix story: helper text and error message font weight was 500.**
Spec is 400. Implementation: `IdsDropdownSingleSelect.stories.tsx` — `helperStyle.fontWeight: 400`, `errorMsgStyle.fontWeight: 400`.
