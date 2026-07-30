# Dropdown / Combo Box Design Spec

## Metadata
- **Component:** Dropdown / Combo Box
- **Category:** Formelements
- **Design System:** IDS
- **Variant family scope:** `Dropdown-Combobox` only (single-select + multi-select).  
  `Dropdown-Single-Select` and `Dropdown-Multi-select` are intentionally handled in their dedicated specs.
- **Figma (Combobox Single-select):** `https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=29393-149209&m=dev`
- **Figma (Combobox Multi-select):** `https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=12730-157002&m=dev`
- **Figma (Combobox Multi-select menu — Show Selected):** `https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=29393-146761&m=dev`
- **Figma (Combobox Menu Elements):** `https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=29393-143195&m=dev`
- **Figma (Combobox size/state matrix):** `https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=43415-176785&m=dev`
- **Figma (Multi-select selection element):** `https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=29716-46779&m=dev`
- **Figma (Multi-select selected row element):** `https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=12730-120316&m=dev`
- **Figma file key:** `0bHk3XhrjFhowgFkz9yLr4`
- **Validated nodes:** `29393:149209`, `12730:157002`, `29393:143195`, `43415:176785`, `29716:46779`, `12730:120316`, `12730:120314`, `12730:120315`
- **Last live verification:** Figma MCP `get_design_context` and `get_variable_defs` on the nodes above.
## Anatomy
1. `ComboBoxRoot`
2. optional `Label` (`Label:*`)
3. `FieldContainer` (input trigger shell)
4. `ValueSlot` (placeholder or selected text)
5. `IndicatorSlot` (caret)
6. optional `HelperText`
7. optional `ValidationError` (critical icon + text)
8. optional `MenuPopup`
9. optional `SearchRow` in popup
10. `OptionList` with option rows
11. **Multi-select only:** `SelectAllRow`, `ClearAllAction`, `SelectionSummaryRow`, checkboxes, and optional `ShowSelectedToggle`
## Layout & Measurements
- Field sizes:
  - `Large`: `40px` height, trigger padding `var(--padding-padding-10) var(--padding-padding-16)`.
  - `Small`: `32px` height, trigger padding `var(--padding-padding-6) var(--padding-padding-16)`.
- Label-to-field row gap: `var(--spacing-space-16)` (sample layout shows `16px` between label slot and field slot).
- Field to helper/error gap: `var(--spacing-space-4)`.
- Runtime width behavior:
  - sample width: `300px`
  - sample min-width: `186px`
  - sample max-width: `700px`
  - runtime rule: width is container-driven (`width: 100%` of host), with min/max optional per product context.
- Caret icon slot: `10px`.
- Menu popup:
  - popup opens attached below trigger (`top: fieldHeight - 1px` visual alignment).
  - border `1px`, drop shadow uses IDS shadow tokens.
  - search row wrapper padding: `var(--padding-padding-8)`.
  - search inner field (`Search-Main`, Figma `29393:141946`): `var(--border-width-border-default)` solid `var(--color-border-gray-neutral-base)`, `var(--padding-padding-2)` vertical / `var(--padding-padding-16)` horizontal, **no border-radius** (sharp corners).
  - option row padding: `var(--padding-padding-10) var(--padding-padding-16)`.
- Multi-select summary selection element (Figma `12730:120314` collapsed, `12730:120315` expanded):
  - panel padding: `var(--padding-padding-8) var(--padding-padding-16) var(--padding-padding-8) 0`; expanded bottom `var(--padding-padding-16)`.
  - header row: full width, `justify-content: space-between`, inner right inset `var(--padding-padding-8)`.
  - toggle label (`Show Selected` / `Hide Selected`): `var(--color-text-brand-strong)`, toggle padding `var(--padding-padding-2) var(--padding-padding-16)`.
  - caret (`arrow-drop-tri-caret`, Figma `9662:26612`): **10×10px** frame, `var(--color-icon-brand-base)`.
  - row dismiss (`.Tag-Element-Close` / `shape-x-thick`, Figma `11666:90408`): **10×10px** frame, `var(--color-icon-gray-neutral-accessible)`, **right-aligned** in header row.
  - expanded tag wrap: `gap: var(--spacing-space-4)`, padding `var(--spacing-space-8) var(--padding-padding-8) 0 var(--padding-padding-16)`.
  - dismissible tags use IDS Tag large editable geometry (`components/ids/tag/design-spec.md`).
  - selected-count badge follows IDS badge geometry (`18px` height, pill radius).
- Search dismiss control:
  - visible when query length `> 0`; right-aligned inside search field row.
  - dismiss icon (`shape-x-thick`, same glyph as `.Tag-Element-Close`): **10×10px** frame, `var(--color-icon-gray-neutral-accessible)`.
- Field corner radius: `var(--dropdown-control-radius)` (IDS theme → `var(--corner-radius-radius-none)` / **0px**).
- Focus ring corner radius: `var(--dropdown-focus-ring-radius)` (IDS theme → `var(--corner-radius-radius-4)` / 4px).
- Detached menu corner radius: `var(--dropdown-menu-radius)` (IDS theme → `0`).

### Slot geometry (Figma-verified)

| Slot / layer | Property | Token / contract | Figma node | Live evidence |
| --- | --- | --- | --- | --- |
| `FieldContainer` (combobox single-select) | `border-radius` | `var(--dropdown-control-radius)` → `var(--corner-radius-radius-none)` (0px) | `29393:149487` | Figma MCP `get_variable_defs`: `Corner Radius/radius-none` |
| `FieldContainer` (combobox multi-select) | `border-radius` | `var(--dropdown-control-radius)` → `var(--corner-radius-radius-none)` (0px) | `12730:157290` | Figma MCP `get_variable_defs`: `Corner Radius/radius-none` |
| `FocusRing` (`::after`, single-select) | `border-radius` | `var(--dropdown-focus-ring-radius)` → `var(--corner-radius-radius-4)` (4px) | `29393:149470` | Figma MCP `get_design_context` on `29393:149462` |
| `MenuPopup` (detached) | `border-radius` | `var(--dropdown-menu-radius)` → `0` | `29393:143195` | Figma MCP `get_metadata` (square menu shell) |
| `SearchRow` inner field | `border-radius` | `0` (`radius-none`) | `29393:141946` | Figma MCP `get_variable_defs`: `Corner Radius/radius-none` |
| `OptionRow` leading `checkboxOuter` (multi) | `border-radius` | `var(--checkbox-control-radius)` → `var(--corner-radius-radius-2)` (2px) | `29392:48749` | Figma MCP combobox option matrix `29392:48763` |

**Anti-drift rule:** Combobox field shells are square (`radius-none`) for both single- and multi-select variants. Theme alias must match Figma Container nodes, not Button convention.

## Tokens
- **Core field tokens**
  - `var(--color-background-surface-component)`
  - `var(--color-text-gray-neutral)`
  - `var(--color-text-gray-neutral-strong)`
  - `var(--color-border-gray-neutral-base)`
  - `var(--color-border-gray-neutral-strong)`
  - `var(--color-border-brand-base)`
  - `var(--color-text-gray-disabled)`
  - `var(--color-background-gray-light)`
  - `var(--color-background-gray-lighter)`
- **Interactive/selection tokens**
  - `var(--color-background-brand-lighter-slate)`
  - `var(--color-text-brand-strong)`
  - `var(--color-background-controls-base)`
  - `var(--color-border-brand-transparent-brand)`
  - `var(--color-text-gray-white)`
- **Error tokens**
  - `var(--color-border-alerting-critical-base)`
  - `var(--color-icon-alerting-critical-base)`
  - `var(--color-text-alerting-critical-base)`
- **Icon tokens**
  - `var(--color-icon-gray-neutral-accessible)`
  - `var(--color-icon-brand-base)`
  - `var(--color-icon-gray-white)`
- **Shape/space tokens**
  - `var(--dropdown-control-radius)` (field shell; IDS → `var(--corner-radius-radius-none)` / 0px)
  - `var(--dropdown-focus-ring-radius)` (IDS → `var(--corner-radius-radius-4)`)
  - `var(--dropdown-menu-radius)` (detached menu; IDS → `0`)
  - `var(--corner-radius-radius-2)` (checkbox corner)
  - `var(--corner-radius-radius-8)` (scroll thumb)
  - `var(--spacing-space-4)`, `var(--spacing-space-8)`, `var(--spacing-space-16)`
  - `var(--padding-padding-2)`, `var(--padding-padding-6)`, `var(--padding-padding-8)`, `var(--padding-padding-10)`, `var(--padding-padding-16)`
## States (Light Theme)
| Element | State | Background | Border | Text/Icon |
|---|---|---|---|---|
| Field container | default | `var(--color-background-surface-component)` | `var(--color-border-gray-neutral-base)` | `var(--color-text-gray-neutral)` + `var(--color-icon-gray-neutral-accessible)` |
| Field container | hover | `var(--color-background-surface-component)` | `var(--color-border-gray-neutral-strong)` | neutral text |
| Field container | selected/open | `var(--color-background-surface-component)` | `var(--color-border-gray-neutral-base)` | selected text stays neutral/brand per content state |
| Field container | focus-visible | `var(--color-background-surface-component)` | base border + outer focus ring `var(--color-border-brand-base)` | caret/text may shift to brand token |
| Field container | disabled | `var(--color-background-gray-light)` | `var(--color-border-gray-neutral-base)` | `var(--color-text-gray-disabled)` |
| Field container | error | `var(--color-background-surface-component)` | `var(--color-border-alerting-critical-base)` | error icon/text tokenized critical |
| Option row | default | `var(--color-background-surface-component)` | none | `var(--color-text-gray-neutral)` |
| Option row | hover | `var(--color-background-brand-lighter-slate)` | row-emphasis top/bottom inset stroke `var(--color-border-brand-base-neutral)` | `var(--color-text-gray-neutral)` |
| Option row | press | `var(--color-background-brand-light-slate)` | row-emphasis top/bottom inset stroke `var(--color-border-brand-base-neutral)` | `var(--color-text-brand-strong)` |
| Option row | focus-visible | current-state fill | focus indicator tokenized with `var(--color-border-brand-base)` | text/icon unchanged |
| Option row | selected (single) | `var(--color-background-brand-lighter-slate)` + emphasized row stroke | row-level highlight | `var(--color-text-brand-strong)` |
| Option row | selected (multi) | component background with checked checkbox | none | neutral text + selected checkbox visuals |
## States (Dark Theme)
Dark theme uses the same structural state matrix as Light Theme and resolves all visual values through semantic tokens. No hardcoded color literals are allowed in implementation contracts.

| Element | State | Background | Border | Text/Icon |
|---|---|---|---|---|
| Field container | default | semantic token resolved | semantic token resolved | semantic token resolved |
| Field container | hover | semantic token resolved | semantic token resolved | semantic token resolved |
| Field container | focus-visible | semantic token resolved | semantic token resolved | semantic token resolved |
| Field container | disabled | semantic token resolved | semantic token resolved | semantic token resolved |
| Field container | error | semantic token resolved | semantic token resolved | semantic token resolved |
| Option rows | default/hover/press/focus-visible/selected | semantic token resolved | semantic token resolved | semantic token resolved |
## Interactions
- Trigger interaction:
  - click/`Enter`/`Space` toggles popup open/close.
  - `Escape` closes popup and restores focus to trigger.
- Keyboard list navigation:
  - `ArrowUp`/`ArrowDown` moves active option.
  - `Enter` commits active option in single-select mode.
  - `Space` toggles active option in multi-select mode.
- Search behavior:
  - typing in search row filters option list immediately.
  - when search query is non-empty, a right-aligned dismiss control (`shape-x-thick`, **10×10px** frame) clears the query.
  - empty-result state shows only search + empty content block where configured.
- Multi-select behavior:
  - `Select All` toggles all currently visible filtered options.
  - `Clear All` clears all current selections.
  - `Show Selected` / `Hide Selected` toggles the selection summary panel (Figma `12730:120316`, menu `29393:146761`).
  - when expanded, selected values render as dismissible **Tag** chips per `components/ids/tag/design-spec.md` (`type=editable`, `closable`, large dismissible geometry).
  - selection panel header includes row-level dismiss (`shape-x-thick`, `10px`, right-aligned) that clears all current selections.
  - collapsed field can show badge count + truncated selected labels.
- Validation:
  - error state shows critical icon + "Error message" slot below field.
## Composition & API (runtime)
| Prop / Slot | Required | Type | Notes |
|---|---|---|---|
| `mode` | Yes | `"combobox-single" \| "combobox-multi"` | This spec supports these two combobox modes only. |
| `size` | No | `"small" \| "large"` | Maps to `32px` / `40px`. Default `large`. |
| `label` | No | `string` | Optional field label. |
| `placeholder` | No | `string` | Default sample `"Select"`. |
| `helperText` | No | `string` | Default sample `"Helper text"`. |
| `errorText` | No | `string` | Default sample `"Error message"`. |
| `disabled` | No | `boolean` | Prevents interaction. |
| `searchable` | No | `boolean` | Enables search row in popup. |
| `options` | Yes | `{ id: string; label: string; disabled?: boolean }[]` | Canonical option model. |
| `value` | No | `string \| string[]` | Controlled selected value(s). |
| `onChange` | No | `(payload) => void` | Emits selected value(s). |
| `onSearch` | No | `(query: string) => void` | Emits search query. |
| `onOpenChange` | No | `(open: boolean) => void` | Open state callback. |
| `onSelectAll` | No | `() => void` | Multi-select only. |
| `onClearAll` | No | `() => void` | Multi-select only. |
| `showSelectedPanel` | No | `boolean` | Multi-select only; enables Show/Hide Selected row + tag chips. |
| `showSelectedExpanded` | No | `boolean` | Controlled expanded state for selection tag panel. |
| `onShowSelectedExpandedChange` | No | `(expanded: boolean) => void` | Toggle callback for Show/Hide Selected. |
| `onRemoveSelectedTag` | No | `(value: string) => void` | Removes one selected value when a tag dismiss control is activated. |
| `onShowSelectedPanelClear` | No | `() => void` | Clears all selections from panel header dismiss; defaults to `onClearAll`. |
## Codegen Contract (Framework-Agnostic Blueprint)
### Deterministic structure
1. `ComboBoxRoot`
2. optional `Label`
3. `FieldContainer` -> `ValueSlot` + `CaretSlot`
4. optional `HelperText` or `ValidationError`
5. optional `Popup` -> optional `SearchRow` -> `ListRows`
6. optional `MultiSelectControls` (`SelectAll`, `ClearAll`, `ShowSelected`)

### Variant matrix
- `mode`: `combobox-single | combobox-multi`
- `size`: `small | large`
- `content`: `empty | filled`
- `state`: `default | hover | selected | focus-visible | disabled | error`
  - option-row interaction subset: `default | hover | press | focus-visible | selected`
- `search`: `enabled | disabled`

### Per-slot style contract
- Field container must keep tokenized border/background/text for all states.
- Focus-visible uses an outer ring tokenized with brand border color.
- Menu rows use tokenized row padding and explicit interaction mapping:
  - hover: `var(--color-background-brand-lighter-slate)` + inset row emphasis strokes
  - press: `var(--color-background-brand-light-slate)` + inset row emphasis strokes + brand-strong text
  - focus-visible: visible focus indicator using brand-base border token
- Multi-select checkbox uses `2px` corner token and control-brand tokens for checked state.

### Behavior contract
- Single mode emits one selected id.
- Multi mode emits deterministic ordered selected id list.
- Filtering never mutates source options array; it derives visible options.
- Disabled state blocks popup open and selection mutations.

### Accessibility contract
- Root trigger must expose combobox semantics (`role="combobox"`, `aria-expanded`, `aria-controls`).
- Popup list must expose listbox semantics; option rows must expose option semantics and selected state.
- Multi-select rows include checkbox semantics (`aria-checked`).
- Validation message must be linked with `aria-describedby` when error is active.

### Asset resolution + bundling contract
- Caret icon slug: `arrow-drop-tri-caret`.
- Search icon slug: `search-16` (Masthead-Web/search-16).
- Error icon slug: `status-critical-square-solid`.
- Multi-select glyph slugs: `shape-check-checkbox`, `shape-dash-thick`, `shape-x-thick` where applicable.

### Fallback/error rules
- Unknown `mode` falls back to `combobox-single`.
- Unknown `size` falls back to `large`.
- Missing option `id` fails strict validation mode (non-strict may derive stable key from index).
- Empty `options` renders an empty-state list panel without runtime crash.

### Validation checklist
- [x] **Slot geometry (Figma-verified)** table complete; field containers `29393:149487` + `12730:157290` use `radius-none`
- [x] `--dropdown-control-radius` in `ids-theme.css` matches geometry table (`radius-none`)
- [ ] Combobox single-select states match `29393:149209`.
- [ ] Combobox multi-select states match `12730:157002`.
- [ ] Size/state matrix parity for `Large (40)` and `Small (32)` matches `43415:176785`.
- [ ] Menu element patterns (search/list/select-all/clear-all/show-selected) match `29393:143195`.
- [ ] Multi-select selection row/tag behavior matches `29716:46779` and `12730:120316`.
- [ ] Light and dark outputs remain semantic-token driven.
- [ ] Accessibility semantics and keyboard behavior pass parity checks.
## Source Mapping
- **Component map entry:** `data/component-figma-map.json` -> `Dropdown / Combo Box`.
- **Primary nodes:** `29393:149209` (single), `12730:157002` (multi).
- **Element nodes:** `29393:143195`, `29716:46779`, `12730:120316`.
- **Figma MCP evidence:** `get_design_context` + `get_variable_defs` on all listed nodes.
- **Last live verification:** 2026-06-19 (geometry audit: field `29393:149487`, `12730:157290` `radius-none`; focus `29393:149470`; search `29393:141946`).
