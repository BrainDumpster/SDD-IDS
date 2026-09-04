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
- `Label` (optional): sits to the **left** of the field on the same row, label-to-field gap `var(--spacing-space-16)` (16px). Typography `var(--font-size-body-2)` / `var(--font-line-height-line-height-20)`, weight `400`; color `var(--color-text-gray-neutral-strong)`. An optional trailing required indicator `*` shows only when the field is required. Two sizes track the field height: **Large** `40px` (vertical padding `var(--padding-padding-10)`), **Small** `32px` (vertical padding `var(--padding-padding-6)`). The label is **independent of the menu min/max width** (`186–700px`) — its width does not affect, and is not constrained by, the dropdown menu sizing.

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
  - visual row: tokenized `10px` vertical + `16px` left / `16px` right padding
  - minimum hit area: `44px`
- Optional radio control:
  - size `16x16`
  - inner dot `8x8`
- Menu width (`menuWidth` prop; min `186px`, max `700px`, left-aligned to trigger via `--anchor-width`):
  - `"trigger"` (default): menu = trigger/field width, tracks a resizing container; long labels truncate.
  - `"content"`: menu grows to the widest option (clamped `[trigger, 700px]`), then the option label truncates.
- Option label truncates with an ellipsis when it exceeds the row width; when the **field** value is truncated it is wrapped in the IDS Tooltip showing the full item (only when actually cut off).
- Scrollbar: **overlay** (Base UI `ScrollArea`) so option rows keep full width; always visible while the list overflows (shows ~6 rows then scrolls). Thumb `6px`, `radius-4`, `var(--color-border-gray-neutral-light)`.
- Field corner radius: `var(--dropdown-control-radius)` (IDS theme → `var(--corner-radius-radius-none)` / **0px — square corners**; Figma Container `12579:77895` uses `Corner Radius/radius-none`).
- Focus ring corner radius: `var(--dropdown-focus-ring-radius)` (IDS theme → `var(--corner-radius-radius-4)` / 4px).
- Detached menu corner radius: `var(--dropdown-menu-radius)` (IDS theme → `0`).
- Menu elevation: IDS shadow token stack (Shadow 1 family).
- Section header row:
  - `var(--color-border-gray-neutral-base)` top border on section boundaries
  - first section header top border may be omitted.
- Footer action button inner wrapper: `padding: var(--padding-padding-2) var(--padding-padding-16)`, `border-radius: var(--corner-radius-radius-2)`
- Focus ring: pseudo-element `::after`, `inset: -5px`, `border: 1px solid var(--color-border-brand-base)`, `border-radius: var(--corner-radius-radius-4)` — field shell stays square (`radius-none`); only the outer focus ring is rounded.

### Slot geometry (Figma-verified)

| Slot / layer | Property | Token / contract | Figma node | Live evidence |
| --- | --- | --- | --- | --- |
| `FieldContainer` | `border-radius` | `var(--dropdown-control-radius)` → `var(--corner-radius-radius-none)` (0px) | `12579:77895` | Figma MCP `get_variable_defs`: `Corner Radius/radius-none` |
| `FocusRing` (`::after`) | `border-radius` | `var(--dropdown-focus-ring-radius)` → `var(--corner-radius-radius-4)` (4px) | `11099:58141` | Figma MCP `get_design_context`: focus child `rounded-*-[radius-4]` |
| `MenuPopup` (detached) | `border-radius` | `var(--dropdown-menu-radius)` → `0` | `12579:19717` | Figma MCP `get_metadata` + menu frame (square shell) |
| `FooterActionButton` (inner span) | `border-radius` | `var(--corner-radius-radius-2)` (2px) | `29392:48797` | Figma MCP `get_design_context` (action row element; separate from field shell) |
| `OptionRow` (focus ring) | `border-radius` | `var(--corner-radius-radius-4)` on inset outline | `12380:16525` | Figma MCP `get_design_context` (option focus state) |

**Anti-drift rule:** Do not set `--dropdown-control-radius` from Button/`radius-2` convention. Theme alias in `components/ids-theme.css` must match this table after every geometry audit.

## Tokens
- Field and menu:
  - `var(--color-background-surface-component)`
  - `var(--color-border-gray-neutral-base)` (field default/show-dropdown border; menu border; section header border)
  - `var(--color-border-gray-neutral-strong)` (field hover border)
  - `var(--color-border-brand-base)` (field focus ring; option focus inset border)
  - `var(--color-text-gray-neutral)` (field text; option default/hover text; section header text)
  - `var(--color-text-gray-neutral-strong)` (label text)
  - `var(--color-text-gray-disabled)`
  - `var(--color-background-gray-lighter)` (disabled field; disabled option without radio)
  - `var(--color-border-gray-disabled)` (field disabled border; caret disabled color; disabled option without radio border)
- Selection/interaction:
  - `var(--color-background-brand-lighter-slate)` (option hover/selected-without-radio background)
  - `var(--color-background-brand-light-slate)` (option press/active background)
  - `var(--color-border-brand-base-neutral)` (option hover/selected/press border — `outline: 1px solid`)
  - `var(--color-background-controls-base)` (radio selected fill)
  - `var(--color-text-brand-strong)` (option selected/press text; action button text)
  - `var(--color-icon-gray-neutral-base)` (caret default/hover/focus/show-dropdown/error)
  - `var(--color-border-gray-disabled)` (caret disabled)
- Error:
  - `var(--color-border-alerting-critical-base)`
  - `var(--color-icon-alerting-critical-base)`
  - `var(--color-text-alerting-critical-base)`
- Shadow (menu popup):
  - `var(--shadow-shadow-4-drop-shadow-4-x)` (0)
  - `var(--shadow-shadow-4-drop-shadow-4-y)` (4)
  - `var(--shadow-shadow-4-drop-shadow-4-blur)` (4)
  - `var(--shadow-shadow-4-drop-shadow-4-spread)` (0)
  - `var(--shadow-shadow-4-drop-shadow-4-color)` (rgba(37,37,37,0.08))
- Geometry:
  - `var(--border-width-border-default)` (field + menu border width, 1px)
  - `var(--dropdown-control-radius)` (field shell; IDS theme → `var(--corner-radius-radius-none)` / 0px)
  - `var(--dropdown-focus-ring-radius)` (focus ring; IDS theme → `var(--corner-radius-radius-4)`)
  - `var(--dropdown-menu-radius)` (detached menu; IDS theme → `0`)
  - `var(--spacing-space-8)` (option gap, label gap)
  - `var(--spacing-space-10)` (field inner gap)
  - `var(--padding-padding-1)` (caret horizontal padding)
  - `var(--padding-padding-2)` (action button wrapper vertical padding)
  - `var(--padding-padding-6)` (small field vertical padding; section header vertical padding)
  - `var(--padding-padding-8)` (footer action row vertical padding)
  - `var(--padding-padding-10)` (large field + option vertical padding)
  - `var(--padding-padding-16)` (field + option + action wrapper horizontal padding; option row uses `16px` on **both** left and right)
## States (Light Theme)
| Element | State | Background | Border | Text/Icon |
|---|---|---|---|---|
| Field container | default | `var(--color-background-surface-component)` | `var(--color-border-gray-neutral-base)` | text `var(--color-text-gray-neutral)`, caret `var(--color-icon-gray-neutral-base)` |
| Field container | hover | `var(--color-background-surface-component)` | `var(--color-border-gray-neutral-strong)` | text `var(--color-text-gray-neutral)`, caret `var(--color-icon-gray-neutral-base)` |
| Field container | show-dropdown | `var(--color-background-surface-component)` | `var(--color-border-gray-neutral-base)` | text `var(--color-text-gray-neutral)`, caret `var(--color-icon-gray-neutral-base)` |
| Field container | focus-visible | `var(--color-background-surface-component)` | inner `var(--color-border-gray-neutral-base)` + outer ring `var(--color-border-brand-base)` (pseudo `::after`, `inset: -5px`, `border-radius: 4px`) | text `var(--color-text-gray-neutral)`, caret `var(--color-icon-gray-neutral-base)` |
| Field container | disabled | `var(--color-background-gray-lighter)` | `var(--color-border-gray-disabled)` | text `var(--color-text-gray-disabled)`, caret `var(--color-border-gray-disabled)` |
| Field container | error | `var(--color-background-surface-component)` | `var(--color-border-alerting-critical-base)` | text `var(--color-text-gray-neutral)`, caret `var(--color-icon-gray-neutral-base)`, error icon `var(--color-icon-alerting-critical-base)`, error text `var(--color-text-alerting-critical-base)` |
| Option row | default | `var(--color-background-surface-component)` | none | `var(--color-text-gray-neutral)` |
| Option row | hover | `var(--color-background-brand-lighter-slate)` | `outline: 1px solid var(--color-border-brand-base-neutral)` | `var(--color-text-gray-neutral)` |
| Option row | press/active | `var(--color-background-brand-light-slate)` | `outline: 1px solid var(--color-border-brand-base-neutral)` | `var(--color-text-brand-strong)` |
| Option row | selected (no radio) | `var(--color-background-brand-lighter-slate)` | `outline: 1px solid var(--color-border-brand-base-neutral)` | `var(--color-text-brand-strong)` |
| Option row | selected (with radio) | `var(--color-background-surface-component)` | none | `var(--color-text-brand-strong)` |
| Option row | focus-visible | `var(--color-background-surface-component)` | `outline: 1px solid var(--color-border-brand-base)` inset (`outline-offset: -1px`) | `var(--color-text-gray-neutral)` |
| Option row | disabled (no radio) | `var(--color-background-gray-lighter)` | `outline: 1px solid var(--color-border-gray-disabled)` | `var(--color-text-gray-disabled)` |
| Option row | disabled (with radio) | `var(--color-background-surface-component)` | none | `var(--color-text-gray-disabled)` |
| Section header | — | `var(--color-background-surface-component)` | `border-top: var(--color-border-gray-neutral-base)` | `var(--color-text-gray-neutral)` |
| Footer action row | — | `var(--color-background-surface-component)` | `border-top: var(--color-border-gray-neutral-base)` | `var(--color-text-brand-strong)` |
## States (Dark Theme)
Dark theme must remain structurally identical to Light Theme with values resolved via semantic IDS tokens only.

| Element | State | Background | Border | Text/Icon |
|---|---|---|---|---|
| Field container | default/hover/focus/disabled/error | semantic token resolved | semantic token resolved | semantic token resolved |
| Option rows | default/hover/selected/disabled | semantic token resolved | semantic token resolved | semantic token resolved |
## Interactions
- Trigger:
  - click/`Enter`/`Space` toggles open/close.
  - when the popup opens, focus remains on the trigger; the implementation explicitly returns focus to the trigger after Base UI mounts the popup.
  - `Tab` from the trigger moves focus to the first tabbable control inside the popup (search input, search clear, option rows, footer action).
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
- Optional Clear All (`showClearAll`, Figma `348:140631`):
  - a "Clear All" row appears **below the search row** whenever a value is selected. Visual matches the action button (`var(--color-text-brand-strong)`, `Body 2`, inner button `padding-2 / padding-16`, `radius-2`) but with a **bottom** border since it sits at the top of the list.
  - the Clear All row is **hidden while a search query is active**, and reappears when the search is cleared.
  - clicking clears the selection; the row then auto-hides. It does **not** collapse the menu.
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
| `menuWidth` | No | `"trigger" \| "content"` | Width mode. `"trigger"` (default) = trigger width; `"content"` = grow to widest option, clamped `[trigger, 700px]`. |
| `showClearAll` | No | `boolean` | Shows a "Clear All" row (below search) when a value is selected; clears the selection on click (row then auto-hides), without collapsing the menu. |
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
- Section headers use `var(--color-border-gray-neutral-base)` top border; first section may omit top border.
- Section header text uses `var(--color-text-gray-neutral)`.
- Action row uses `var(--color-text-brand-strong)` text and `var(--color-border-gray-neutral-base)` top border.
- Action row has inner button wrapper with `padding: var(--padding-padding-2) var(--padding-padding-16)`.
- Option hover/press/selected borders implemented as `outline: 1px solid` (not box-shadow) so they are clipped by popup `overflow: clip` at first/last rows.
- Selected option behavior differs by radio mode:
  - with radio: white background, no outline
  - without radio: `color-background-brand-lighter-slate` background, `outline: 1px solid color-border-brand-base-neutral`
- Disabled option behavior differs by radio mode:
  - with radio: white background, no outline
  - without radio: `color-background-gray-lighter` background, `outline: 1px solid color-border-gray-disabled`
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
- Caret icon: `arrow-drop-tri-caret`, 10×10px, container padding `1px` horizontal / `5px` vertical. Color per state: `var(--color-icon-gray-neutral-base)` (default/hover/focus/show-dropdown/error), `var(--color-border-gray-disabled)` (disabled). Resolve from `assets/icons/arrow-drop-tri-caret.svg` via shared Icon primitive.
- Error icon: `status-critical-square-solid`, 16×16px, `var(--color-icon-alerting-critical-base)`. Resolve from `assets/icons/status-critical-square-solid.svg`.
- Optional radio visuals must follow IDS radio design-spec; no hardcoded inline SVG data URIs.

### Fallback/error rules
- Unknown `size` -> `large`.
- Missing `options` -> empty, non-crashing menu.
- Unknown/invalid `value` -> display placeholder with no selected row.
- Unknown action/radio flags -> disabled/off.

### Validation checklist
- [x] **Slot geometry (Figma-verified)** table complete; field `radius-none` verified on `12579:77895`
- [x] `--dropdown-control-radius` in `ids-theme.css` matches geometry table (`radius-none`, not `radius-2`)
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
- Last live verification: 2026-06-19 (Figma MCP `get_variable_defs` on Container `12579:77895` + matrix `11099:58099`; field `radius-none` / 0px; focus ring `radius-4` on node `11099:58141`)

## Implementation Notes
> Last updated: 2026-06-07.

### 2026-08-30
- **Options list 1px inset padding** — `DropdownMenu.module.css` `.optionsScrollViewport` now has `padding-inline: 1px` so the option rows sit 1px inside the menu border, matching the App Launcher options list.

### 2026-08-13
- **Focus management / no auto-focus on open** — `DropdownMenu.tsx` explicitly returns focus to the trigger after Base UI mounts the popup. The user must `Tab` into the popup; `ArrowUp`/`ArrowDown` then move focus between enabled `data-selectable` option rows via `moveOptionFocus`.
- **Section-aware keyboard navigation** — `ArrowUp`/`ArrowDown` move focus between popup sections (option rows, footer action) and stop at section boundaries. `Tab` still traverses every tabbable control.
- **Keyboard-reachable controls only** — `ScrollArea.Viewport` elements (`optionsScrollViewport`) carry `tabIndex={-1}` so they do not receive focus; only interactive controls inside the popup are keyboard reachable.
- **Focus ring geometry** — `triggerReset` uses a `::after` pseudo-element focus ring: `inset: -4px`, `border: var(--border-width-border-default) solid var(--color-border-brand-base)`, `border-radius: var(--corner-radius-radius-4)`, `pointer-events: none`. Option rows use `outline: var(--border-width-border-1) solid var(--color-border-brand-base)` with `outline-offset: -1px` and `border-radius: var(--corner-radius-radius-4)`.
- **Action button focus rings** — Added missing `:focus-visible` focus ring for the `footerAction` button to match IDS Button / Dropdown Button specs.

**Focus ring must not add border-radius to the field element.**
Only the outer ring is rounded (`radius-4`). Implementation: `IdsDropdownTriggerShell.module.css` — field uses `border-radius: var(--dropdown-control-radius)`; focus uses `::after` (`position: absolute; inset: -5px; border: 1px solid var(--color-border-brand-base); border-radius: var(--corner-radius-radius-4); pointer-events: none`).

**Caret disabled color is `var(--color-border-gray-disabled)`, not `var(--color-icon-gray-disabled)`.**
Both tokens resolve to the same value in light mode but differ in dark mode. Implementation: `IdsDropdownTriggerShell.module.css` — `.field[data-disabled] .caretWrap { color: var(--color-border-gray-disabled) }`.

**Font weight for all text elements is 400 (regular).**
Do not set `font-weight` explicitly in component CSS — browser default (400) is correct. Implementation: `IdsDropdownTriggerShell.module.css`, `DropdownMenu.module.css` — no `font-weight` on `.field`, `.item`, `.sectionHeader`, `.footerAction`.

**Option hover/press/selected/active borders must use `outline`, not `box-shadow: inset`.**
`box-shadow` is not clipped by `overflow: clip` on the popup container, causing the border to visually overlap the popup's outer border on the first and last rows. `outline` is clipped correctly. Implementation: `DropdownMenu.module.css` — `outline: 1px solid var(--color-border-brand-base-neutral)` on hover, press, selected, and active states.

**Option focus state requires an inset ring.**
Spec defines a 1px inset border using `var(--color-border-brand-base)` with `border-radius: var(--corner-radius-radius-4)`. Was previously suppressed with `outline: none`. Implementation: `DropdownMenu.module.css` — `.item:focus-visible { outline: 1px solid var(--color-border-brand-base); outline-offset: -1px; border-radius: var(--corner-radius-radius-4) }`.

**Radio button must not show its own focus ring when the option row is focused.**
Only the row-level ring should appear. Implementation: `DropdownMenu.module.css` — `.item:focus-visible .radioOuter::after { content: none }`.

**Selected and disabled option states differ depending on radio presence.**
With radio button: `var(--color-background-surface-component)`, no outline. Without radio button: `var(--color-background-brand-lighter-slate)` + outline (selected) or `var(--color-background-gray-lighter)` + `var(--color-border-gray-disabled)` outline (disabled). Implementation: `DropdownMenu.module.css` — use `:has(.radioOuter)` selector to split the two cases.

**Section header border and text color were incorrect.**
Spec uses `var(--color-border-gray-neutral-base)` for `border-top` and `var(--color-text-gray-neutral)` for text. Implementation: `DropdownMenu.module.css` — update `.sectionHeader` accordingly.

**Footer action row requires an inner button wrapper.**
Outer row padding is `var(--padding-padding-8) 0` (no horizontal padding). The label sits inside a `<span>` wrapper with `padding: var(--padding-padding-2) var(--padding-padding-16); border-radius: var(--corner-radius-radius-2)`. Implementation: `DropdownMenu.module.css` `.footerAction` + `.footerActionButton`; `DropdownMenu.tsx` wraps `footerActionLabel` in `<span className={styles.footerActionButton}>`.

**FieldStatesMatrix story: cell width was too narrow.**
`cellStyle.width: 240` caused the 300px field to overflow and appear merged with adjacent columns; focus rings spanned all four fields as one. Implementation: `IdsDropdownSingleSelect.stories.tsx` — `cellStyle.width: 332`.

**FieldStatesMatrix story: helper text and error message font weight was 500.**
Spec is 400. Implementation: `IdsDropdownSingleSelect.stories.tsx` — `helperStyle.fontWeight: 400`, `errorMsgStyle.fontWeight: 400`.

### Design spec errors fixed (2026-07-25)

**Menu popup has a full 4-sided `1px` border.**
`sideOffset: -1` so the top border overlaps the field's bottom border into a single line. Implementation: `DropdownMenu.module.css` `.popup`; `DropdownMenu.tsx` `sideOffset` default `-1`.

**Option row horizontal padding is `16px` on both sides (`var(--padding-padding-10) var(--padding-padding-16)`).**
Updated from the earlier `24px` right inset — the right padding of the option row is `16px` for all dropdown types (single/multi/combo). Implementation: `DropdownMenu.module.css` — `.item[data-selection-mode="single"]` and `.noResults`.

**Single-select option `min-height` is `40px`.**
Implementation: `DropdownMenu.module.css` — `.item[data-selection-mode="single"] { min-height: 40px }`.

**Text-only single-select option aligns to the top (`align-items: flex-start`); radio rows stay centered.**
Implementation: `DropdownMenu.module.css` — `.item[data-selection-mode="single"]:not(:has(.radioOuter)) { align-items: flex-start }`.

**Caret stays down-pointing while the popup is open** (Figma show-dropdown / component matrix — no 180° flip).
Implementation: `IdsDropdownTriggerShell` uses `arrow-drop-tri-caret` without open-state rotation.

### Implementation updates (2026-08-05)

- **Label** — optional; sits to the left of the field on the same row with `gap: var(--spacing-space-16)`. Uses `body-2` typography (`var(--font-size-body-2)` / `var(--font-line-height-line-height-20)`), `var(--color-text-gray-neutral-strong)`, and an optional trailing required `*`. The label is rendered outside `DropdownMenu` by the consuming `IdsDropdownSingleSelect` wrapper and does not constrain the menu width.
- **Single-select `Clear All` row** — visible above the option list whenever a value is selected (enabled via `showClearAll`). Clicking it fires `onClearAllClick`, clears the selection and the row auto-hides; the popup stays open (does **not** collapse the menu). Implementation: `DropdownMenu.tsx` — `showSingleClearAllRow`; `DropdownMenu.module.css` — `.clearAllAction`.
- **Field attached dropdown radius** — when the popup opens, Base UI sets `data-popup-open` on the trigger, causing the field's bottom-left/right radii to become `0` (square edge meeting the popup). Caret direction is unchanged (still down). Implementation: `IdsDropdownTriggerShell.module.css` — `:global([data-popup-open]) .field`.
- **Tooltip** — when the field value is truncated, it is wrapped in the IDS Tooltip showing the full item. The tooltip only appears when the text is actually cut off. Implementation: `IdsDropdownTriggerShell` consumer wraps the truncated field content with `components/ids/tooltip/design-spec.md`.
- **Content-driven menu width (`menuWidth="content"`)** — the popup grows to the width of its widest option, clamped between the trigger width (`--dropdown-trigger-width`, aliased to Base UI `--anchor-width`) and `700px` (`--dropdown-menu-max-width`). Content beyond `700px` truncates with an ellipsis. Implementation: `DropdownMenu.tsx` — `contentWidthMode`; `DropdownMenu.module.css` — `.popupContentWidth`.
- **Options list scroll** — caps at `maxVisibleItems` rows (default `6`); the list only scrolls when the number of rows exceeds the threshold. Implementation: `DropdownMenu.tsx` — `scrollRegionStyle`.
- **Filled field content group** — selected value and caret with `gap: var(--spacing-space-4)`; the group gets `padding-right: var(--padding-padding-16)` when a selection is shown. Implementation: `IdsDropdownTriggerShell.module.css` — `.main` and `.field[data-filled="true"] .main`.
- **Trigger width** — `width: max-content` so the popup tracks the field width, not a wider container. Implementation: `DropdownMenu.module.css` — `.triggerReset`.
