# Dropdown: Multiselect Design Spec

## Metadata
- Component: Dropdown: Multiselect
- Category: Formelements
- Design System: IDS
- Figma design: `https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=43406-39370&m=dev`
- Figma component matrix: `https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=12608-93872&m=dev`
- Figma menu elements: `https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=12579-19725&m=dev`
- Figma option states: `https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=12363-13866&m=dev`
- Figma selected badge + tooltip: `https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=12608-95848&m=dev`
- File key: `0bHk3XhrjFhowgFkz9yLr4`
## Anatomy
1. `DropdownMultiSelectRoot`
2. optional `Label`
3. `FieldContainer`
4. `ValueSlot` (placeholder or selected summary)
5. `IndicatorSlot` (caret)
6. optional `HelperText`
7. optional `ValidationError` (critical icon + text)
8. optional `MenuPopup`
9. optional `SearchRow`
10. optional `SelectAllClearAllRow`
11. `OptionList`
12. optional `SectionHeaderRow[]`
13. optional `ActionRow`
14. optional `SelectedCountBadge` (IDS Badge)
15. optional `SelectedCountTooltip` (IDS Tooltip)
## Layout & Measurements
- Field sizes:
  - `Large`: `40px`
  - `Small`: `32px`
- Field horizontal padding: `var(--padding-padding-16)`.
- Field vertical padding:
  - Large: `var(--padding-padding-10)`
  - Small: `var(--padding-padding-6)`
- Checkbox geometry (must follow IDS checkbox spec):
  - outer `16x16`
  - checkmark glyph inside selected control
  - optional indeterminate dash for mixed state.
- Option rows:
  - tokenized visual rhythm (`10px` vertical, `16px` horizontal)
  - minimum hit area: `44px`.
- Menu width:
  - sample `300px`
  - runtime contract: matches trigger width unless host overrides.
- Search row (when `searchable`):
  - wrapper padding: `var(--padding-padding-8)`.
  - inner field (`Search-Main`): `var(--border-width-border-default)` solid `var(--color-border-accessible)`, `var(--padding-padding-2)` vertical / `var(--padding-padding-16)` horizontal, **no border-radius** (sharp corners; Figma `29393:141946`).
- `SelectAllClearAllRow`:
  - fixed/stable row above options
  - not scrollable with options list
  - clear top/bottom border separation.
- Options list:
  - scrollable region for long sets (overflow menu variants).
- Selected count badge:
  - uses IDS Badge size/shape contract (`18px` pill).
- Field corner radius: `var(--dropdown-control-radius)` (IDS theme → `var(--corner-radius-radius-none)` / **0px**).
- Focus ring corner radius: `var(--dropdown-focus-ring-radius)` (IDS theme → `var(--corner-radius-radius-4)` / 4px).
- Detached menu corner radius: `var(--dropdown-menu-radius)` (IDS theme → `0`).

### Slot geometry (Figma-verified)

| Slot / layer | Property | Token / contract | Figma node | Live evidence |
| --- | --- | --- | --- | --- |
| `FieldContainer` | `border-radius` | `var(--dropdown-control-radius)` → `var(--corner-radius-radius-none)` (0px) | `12608:96588` | Figma MCP `get_variable_defs`: `Corner Radius/radius-none` |
| `FocusRing` (`::after`) | `border-radius` | `var(--dropdown-focus-ring-radius)` → `var(--corner-radius-radius-4)` (4px) | `12608:96619` | Figma MCP `get_design_context` on `12608:94149`: focus child `radius-4` |
| `MenuPopup` (detached) | `border-radius` | `var(--dropdown-menu-radius)` → `0` | `12579:19725` | Figma MCP `get_metadata` (square menu shell) |
| `SearchRow` inner field | `border-radius` | `0` (`radius-none`) | `29393:141946` | Figma MCP `get_variable_defs`: `Corner Radius/radius-none` |
| `OptionRow` leading `checkboxOuter` | `border-radius` | `var(--checkbox-control-radius)` → `var(--corner-radius-radius-2)` (2px) | `12363:13866` | Inherit IDS checkbox spec; Figma option matrix |
| `FooterActionButton` (inner span) | `border-radius` | `var(--corner-radius-radius-2)` (2px) | `29392:48797` | Figma MCP `get_design_context` (shared menu action row) |

**Anti-drift rule:** Field shell is square (`radius-none`). Do not document field radius from Button/`radius-2` convention or theme alias alone.

## Tokens
- Field/menu tokens:
  - `var(--color-background-component)`
  - `var(--color-border-accessible)` (field default/show-dropdown border; menu border; section header border)
  - `var(--color-border-strong)` (field hover border)
  - `var(--color-border-brand-base)` (field focus ring; option focus inset border)
  - `var(--color-border-disabled)` (field disabled border; caret disabled color; disabled checkbox border)
  - `var(--color-text-neutral)`
  - `var(--color-text-neutral-strong)` (label text)
  - `var(--color-text-disabled)`
  - `var(--color-background-gray-lighter)` (disabled field background)
- Selection tokens:
  - `var(--color-background-brand-lighter)` (option hover background)
  - `var(--color-border-brand-neutral)` (option hover/press border)
  - `var(--color-background-controls-brand-lighter)`
  - `var(--color-background-controls-brand-base)` (checkbox selected fill)
  - `var(--color-background-controls-brand-strong)` (checkbox selected hover/press fill)
  - `var(--color-text-brand-strong)`
  - `var(--color-border-transparent-brand)` (checkbox selected border)
  - `var(--color-icon-white)` (checkbox tick)
  - `var(--color-icon-inverse)`
- Error tokens:
  - `var(--color-border-alerting-critical-base)`
  - `var(--color-icon-alerting-critical)`
  - `var(--color-text-critical)`
- Geometry/spacing:
  - `var(--dropdown-control-radius)` (field shell; IDS → `var(--corner-radius-radius-none)` / 0px)
  - `var(--dropdown-focus-ring-radius)` (IDS → `var(--corner-radius-radius-4)`)
  - `var(--dropdown-menu-radius)` (detached menu; IDS → `0`)
  - `var(--corner-radius-radius-2)` (checkbox corner)
  - `var(--spacing-space-8)`
  - `var(--padding-padding-2)` (footer button wrapper vertical padding)
  - `var(--padding-padding-6)` (section header vertical padding)
  - `var(--padding-padding-8)`
  - `var(--padding-padding-10)` (option vertical padding)
  - `var(--padding-padding-16)`
## States (Light Theme)
| Element | State | Background | Border | Text/Icon |
|---|---|---|---|---|
| Field container | default | component | accessible border | neutral text + accessible icon |
| Field container | hover | component | strong border | neutral text |
| Field container | show-dropdown | component | accessible border | neutral text |
| Field container | focus-visible | component | brand border + focus ring | neutral text |
| Field container | disabled | `var(--color-background-gray-lighter)` | `var(--color-border-disabled)` | disabled text/icon |
| Field container | error | component | critical border | critical helper/icon |
| Option row | default | component | none | neutral/strong text per checkbox spec |
| Option row | hover | `var(--color-background-brand-lighter)` | `outline: 1px solid var(--color-border-brand-neutral)` | neutral text |
| Option row | selected (multi) | component | none | checkbox selected + neutral text |
| Option row | indeterminate | component | none | checkbox dash token state |
| Option row | disabled | `var(--color-background-component)` | none (checkbox always present; checkbox control itself shows disabled state) | disabled text |
| SelectAll row | default | component | `var(--color-border-accessible)` bottom | neutral text + checkbox |
| SelectAll row | hover (checkbox unchecked/indeterminate) | component | `var(--color-border-accessible)` bottom | checkbox border → `var(--color-border-strong)` |
| SelectAll row | hover (checkbox checked) | component | `var(--color-border-accessible)` bottom | checkbox fill → `var(--color-background-controls-brand-strong)` |
| ClearAll action | default | transparent | none | brand-strong |
| ClearAll action | disabled | transparent | none | disabled text |
| Option row (disabled) | checkbox control | `var(--color-background-gray-light)` | `var(--color-border-disabled)` | `var(--color-text-disabled)` |
## States (Dark Theme)
Dark theme must preserve the same state matrix and resolve values through semantic IDS tokens only.

| Element | State | Background | Border | Text/Icon |
|---|---|---|---|---|
| Field container | default/hover/focus/disabled/error | semantic token resolved | semantic token resolved | semantic token resolved |
| Option rows | default/hover/selected/indeterminate/disabled | semantic token resolved | semantic token resolved | semantic token resolved |
| SelectAll / ClearAll | default/disabled | semantic token resolved | semantic token resolved | semantic token resolved |
## Interactions
- Trigger:
  - click/`Enter`/`Space` toggles menu.
  - `Escape` closes menu and restores trigger focus.
- Option selection:
  - clicking option toggles inclusion in selected set.
  - disabled options cannot be toggled.
- `Select All`:
  - selects all currently visible and enabled options (post-filter semantics).
  - checkbox state:
    - checked when all visible enabled options selected
    - indeterminate when partial
    - unchecked when none.
- `Clear All`:
  - clears entire selected set
  - disabled when selected count is zero.
- Search:
  - filters visible options in real time; source options remain unchanged.
- Badge + tooltip:
  - selected count badge updates with selected length.
  - tooltip content shows selected summary/details when enabled.
- Optional action row:
  - user-defined label
  - emits explicit action event.
## Composition & API (runtime)
| Prop / Slot | Required | Type | Notes |
|---|---|---|---|
| `size` | No | `"small" \| "large"` | Default `large`. |
| `label` | No | `string` | Optional label. |
| `placeholder` | No | `string` | User-defined placeholder. |
| `helperText` | No | `string` | User-defined helper text. |
| `errorText` | No | `string` | User-defined error text. |
| `disabled` | No | `boolean` | Blocks trigger/menu interactions. |
| `searchable` | No | `boolean` | Enables search row. |
| `options` | Yes | `{ id: string; label: string; disabled?: boolean }[]` | Canonical options. |
| `value` | No | `string[]` | Controlled selected values. |
| `onChange` | No | `(values: string[] \| optionObject[]) => void` | Payload strategy app-defined. |
| `showSelectAllClearAll` | No | `boolean` | Enables top controls row. |
| `selectAllLabel` | No | `string` | Default `"Select All"`. |
| `clearAllLabel` | No | `string` | Default `"Clear All"`. |
| `onSelectAll` | No | `() => void` | Select all callback. |
| `onClearAll` | No | `() => void` | Clear callback. |
| `clearAllDisabled` | No | `boolean` | Disabled state for clear action. |
| `showSelectedBadge` | No | `boolean` | Enables selected-count badge. |
| `showSelectedTooltip` | No | `boolean` | Enables selected summary tooltip. |
| `actionLabel` | No | `string` | Optional action row label. |
| `onAction` | No | `() => void` | Optional action row event. |
| `onOpenChange` | No | `(open: boolean) => void` | Open state callback. |
| `onSearch` | No | `(query: string) => void` | Search callback. |
## Codegen Contract (Framework-Agnostic Blueprint)
### Deterministic structure
1. `DropdownMultiSelectRoot`
2. optional `Label`
3. `FieldContainer` -> `ValueSlot` + `CaretSlot`
4. optional `HelperText` or `ValidationError`
5. optional `MenuPopup`
6. optional `SearchRow`
7. optional `SelectAllClearAllRow`
8. `OptionList` -> `OptionRow[]`
9. optional `SectionHeaderRow[]`
10. optional `ActionRow`
11. optional `SelectedCountBadge`
12. optional `SelectedCountTooltip`

### Variant matrix
- `size`: `small | large`
- `content`: `empty | selected-visible | selected-hidden`
- `field-state`: `default | hover | show-dropdown | focus-visible | disabled | error`
- `option-state`: `default | hover | selected | indeterminate | focus-visible | disabled`
- `menu-variant`: `small | overflowing | sectioned | with-action`
- `controls-row`: `enabled | disabled`
- `search`: `enabled | disabled`
- `badge-tooltip`: `badge-off | badge-on-tooltip-off | badge-on-tooltip-on`

### Per-slot style contract
- Field/menu/option styling must be token-only.
- Checkbox visuals must match IDS checkbox design-spec (including indeterminate).
- `SelectAllClearAllRow` must be fixed and outside scroll region.
- `Clear All` disabled style uses disabled token.
- Badge and tooltip must use IDS badge/tooltip specs respectively.

### Behavior contract
- Multi-select list is deterministic ordered selection set.
- `Select All` and `Clear All` semantics are deterministic and filter-aware.
- Indeterminate state reflects partial selection.
- Disabled options are excluded from `Select All`.
- Disabled field blocks open and mutation events.
- Action row emits only `onAction` when present.

### Accessibility contract
- Trigger exposes combobox semantics.
- Option rows expose checkbox semantics (`aria-checked=true|false|mixed`).
- Validation text linked via `aria-describedby`.
- `Select All` and `Clear All` are keyboard-activatable controls.

### Asset resolution + bundling contract
- Caret icon: `arrow-drop-tri-caret`.
- Error icon: `status-critical-square-solid`.
- Checkbox glyphs: `shape-check-checkbox`, `shape-dash-thick`.
- Badge + tooltip are component dependencies, not duplicated custom visuals.

### Fallback/error rules
- Unknown `size` -> `large`.
- Missing/empty options -> empty option list, no crash.
- Unknown selected ids -> ignore and render remaining valid selections.
- `clearAllDisabled` defaults true when no selection.
- Unknown labels/events fallback to defaults/no-op callbacks.

### Validation checklist
- [x] **Slot geometry (Figma-verified)** table complete; field `radius-none` on `12608:96588`
- [x] `--dropdown-control-radius` in `ids-theme.css` matches geometry table (`radius-none`)
- [ ] Main multi-select examples match `43406:39370`.
- [ ] Component matrix matches `12608:93872`.
- [ ] Menu structure matches `12579:19725`.
- [ ] Option state matrix matches `12363:13866`.
- [ ] `Select All` checked/unchecked/indeterminate and `Clear All` disabled states are correct.
- [ ] `SelectAllClearAllRow` remains fixed while options scroll.
- [ ] Badge uses IDS Badge spec and tooltip uses IDS Tooltip spec.
- [ ] Light/dark outputs remain semantic-token driven.
## Source Mapping
- Figma design frame: `43406:39370`
- Figma component matrix: `12608:93872`
- Figma menu elements: `12579:19725`
- Figma option state elements: `12363:13866`
- Figma badge + tooltip reference: `12608:95848`
- Badge dependency spec: `components/ids/badge/design-spec.md`
- Tooltip dependency spec: `components/ids/tooltip/design-spec.md`
- Checkbox dependency spec: `components/ids/checkbox/design-spec.md`
- Verification method: Figma MCP (`get_design_context` + `get_variable_defs`)
- Last live verification: 2026-06-19 (geometry audit: field `12608:96588` `radius-none`; focus `12608:96619`; search `29393:141946`)

---

## Implementation Notes
> Last updated: 2026-06-15.

**Focus ring must not add border-radius to the field element.**
The field is square in all states including focus. The ring has `border-radius: var(--corner-radius-radius-4)` and a 4px gap from the field border. Implementation: `IdsDropdownTriggerShell.module.css` — use `::after` pseudo-element (`position: absolute; inset: -5px; border: 1px solid var(--color-border-brand-base); border-radius: var(--corner-radius-radius-4); pointer-events: none`) instead of `outline` + `border-radius` on the element itself.

**Caret disabled color is `var(--color-border-disabled)`, not `var(--color-icon-disabled)`.**
Both tokens resolve to the same value in light mode but differ in dark mode. Implementation: `IdsDropdownTriggerShell.module.css` — `.field[data-disabled] .caretWrap { color: var(--color-border-disabled) }`.

**Font weight for all text elements is 400 (regular).**
Do not set `font-weight` explicitly in component CSS — browser default (400) is correct. Implementation: `IdsDropdownTriggerShell.module.css`, `DropdownMenu.module.css` — no `font-weight` on `.field`, `.item`, `.sectionHeader`, `.footerAction`.

**Option hover/press borders must use `outline`, not `box-shadow: inset`.**
`box-shadow` is not clipped by `overflow: clip` on the popup container, causing the border to visually overlap the popup's outer border on the first and last rows. `outline` is clipped correctly. Implementation: `DropdownMenu.module.css` — `outline: 1px solid var(--color-border-brand-neutral)` on hover and press states (not `box-shadow: inset`).

**Option focus state requires an inset ring.**
Spec defines a 1px inset border using `var(--color-border-brand-base)` with `border-radius: var(--corner-radius-radius-4)`. Was previously suppressed with `outline: none`. Implementation: `DropdownMenu.module.css` — `.item:focus-visible { outline: 1px solid var(--color-border-brand-base); outline-offset: -1px; border-radius: var(--corner-radius-radius-4) }`.

**Checkbox must not show its own focus ring when the option row is focused.**
Only the row-level inset ring should appear. Implementation: `DropdownMenu.module.css` — `.item[data-selection-mode="multi"]:focus-visible .checkboxOuter::after { content: none }`.

**Selected option row: component background, no row outline.**
Multi-select option rows always have a checkbox; the checkbox fill conveys selection visually. The row itself must use `var(--color-background-component)` with neutral text and no row-level outline. Do NOT apply `var(--color-background-brand-lighter)` + outline to multi rows. Implementation: `DropdownMenu.module.css` — `.item[data-selection-mode="multi"][data-selected]` overrides the base selected rule (`background: component; color: text-neutral; outline: none`).

**Disabled option row: component background, no row outline.**
A disabled multi-select row always has a checkbox. Use `var(--color-background-component)` with disabled text. The `gray-lighter` background + disabled border applies only to single-select rows without a leading control. Implementation: `DropdownMenu.module.css` — `.item[data-selectable="true"][data-disabled]:has(.checkboxOuter)` → `background: var(--color-background-component)`.

**Disabled checkbox control background was `gray-lighter`; correct value is `gray-light`.**
The checkbox control (not the row) in a disabled option row must use `var(--color-background-gray-light)` as background and `var(--color-text-disabled)` as color (for icon/text inside). Was incorrectly set to `var(--color-background-gray-lighter)`. Implementation: `DropdownMenu.module.css` — `.item[data-selectable="true"][data-disabled] .checkboxOuter { background: var(--color-background-gray-light); color: var(--color-text-disabled) }`. Same fix applies to the indeterminate+disabled case.

**SelectAll/ClearAll row bottom border was `color-border-neutral-light`; correct value is `color-border-accessible`.**
The row separator must use `var(--color-border-accessible)` to match section header and footer action borders. Implementation: `DropdownMenu.module.css` — `.selectAllClearAllRow { border-bottom: ... var(--color-border-accessible) }`.

**SelectAll checkbox hover border was missing.**
On hover, the unchecked and indeterminate Select All checkbox must strengthen its border to `var(--color-border-strong)` (matching option-row checkbox hover behavior). Checked hover keeps `var(--color-border-transparent-brand)`. Implementation: `DropdownMenu.module.css` — `.selectAllButton:not([data-checked="true"]):hover .selectAllCheckbox { border-color: var(--color-border-strong) }`.

**Disabled field must not show helper text.**
The disabled state suppresses helper/validation text — it is not applicable when the field is disabled. Implementation: `IdsDropdownMultiSelect.stories.tsx` — remove helper text span from the disabled state example in `StatesAndDetails`.

**Section header border and text color were incorrect.**
Spec uses `var(--color-border-accessible)` for `border-top` and `var(--color-text-neutral)` for text (not `color-border-neutral-light` / `color-text-neutral-strong`). Implementation: `DropdownMenu.module.css` — `.sectionHeader { border-top: ... var(--color-border-accessible); color: var(--color-text-neutral) }`.

**Footer action row requires an inner button wrapper.**
Outer row padding is `var(--padding-padding-8) 0` (no horizontal padding). The label sits inside a `<span>` wrapper with `padding: var(--padding-padding-2) var(--padding-padding-16); border-radius: var(--corner-radius-radius-2)`. Implementation: `DropdownMenu.module.css` `.footerAction` + `.footerActionButton`; `DropdownMenu.tsx` wraps `footerActionLabel` in `<span className={styles.footerActionButton}>`.
