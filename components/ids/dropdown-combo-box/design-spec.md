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
2. optional `Label` (with an optional trailing required indicator `*`)
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
- `Label` (optional): sits to the **left** of the field on the same row, label-to-field gap `var(--spacing-space-16)` (16px). Typography `var(--font-size-body-2)` / `var(--font-line-height-line-height-20)`, weight `400`; color `var(--color-text-gray-neutral-strong)`. An optional trailing required indicator `*` shows only when the field is required. Two sizes track the field height: **Large** `40px` (vertical padding `var(--padding-padding-10)`), **Small** `32px` (vertical padding `var(--padding-padding-6)`). The label is **independent of the menu min/max width** (`186–700px`) — its width does not affect, and is not constrained by, the dropdown menu sizing.
- Field to helper/error gap: `var(--spacing-space-4)`.
- Runtime width behavior:
  - sample width: `300px`
  - min-width: `186px`, max-width: `700px`.
  - Two width modes (Figma: dropdown width can inherit the container OR accommodate the longest item), selectable via `menuWidth`:
    - `"trigger"` (default, **container-driven**): the menu matches the trigger/field width and tracks it as the container resizes; long options/tags truncate. Use when the container constrains (e.g. a narrow details panel) — the menu never exceeds the container.
    - `"content"` (**content-driven**): the menu grows to fit its widest option/tag, clamped between the trigger width and `700px`; once it hits `700px` the content truncates. The menu may be wider than the field.
  - The menu is anchored **left-aligned** (`align="start"`) to the trigger; the menu width tracks the field via the positioner's `--anchor-width` (no JS measurement).
- Caret icon slot: `10px`.
- Menu popup:
  - popup opens attached below trigger. It carries a **full 4-sided `1px` border**; a `-1px` vertical offset makes its top border overlap the field's bottom border so the two merge into a single line (attached-dropdown look). Detached usages keep the full border with no overlap.
  - drop shadow uses IDS shadow tokens.
  - search row wrapper padding: `var(--padding-padding-8)`.
  - search inner field (`Search-Main`, Figma `29393:141946`): `var(--border-width-border-default)` solid `var(--color-border-gray-neutral-base)`, `var(--padding-padding-2)` vertical / `var(--padding-padding-16)` horizontal, **no border-radius** (sharp corners).
  - search input wrap gap (input ↔ clear control): `var(--spacing-space-10)`.
  - popup min-height: `212px` (search only), `252px` (search + `SelectAllRow` + `ShowSelectedToggle` row).
  - option row padding: `var(--padding-padding-10) var(--padding-padding-16)` for **all types** (right inset is `16px`; single-select and multi-select share the same horizontal padding). Single-select text-only rows use `align-items: flex-start`; radio and multi rows use `align-items: center`.
  - option label truncates with an ellipsis (`overflow: hidden; text-overflow: ellipsis; white-space: nowrap`) when it exceeds the row width.
  - option row min-height: `40px` (Large) / `32px` (Small).
  - leading control (checkbox/radio) box: `16×16px`; left edge is flush with the `SelectAll` checkbox (no wrapper-centering offset).
  - empty-search result row (`No results found`): **Body 2 - Medium** (weight `500`), `var(--color-text-gray-neutral)`, `font-variation-settings: "wdth" 100`, padding `var(--padding-padding-10) var(--padding-padding-16)`; rendered as the sole list row.
  - selected-content group in the field (optional count badge + value text): `gap: var(--spacing-space-4)`; when the field shows selected option(s) the group gets `padding-right: var(--padding-padding-16)`. Placeholder-only (nothing selected) has no right inset.
- Multi-select summary selection element (Figma `12730:120314` collapsed, `12730:120315` expanded):
  - panel padding: `var(--padding-padding-8) var(--padding-padding-16) var(--padding-padding-8) 0` (top/bottom `8`, right `16`, left `0`).
  - header row: full width, `justify-content: space-between`, inner right inset `var(--padding-padding-8)`.
  - toggle label (`Show Selected` / `Hide Selected`): `var(--color-text-brand-strong)`, toggle padding `var(--padding-padding-2) var(--padding-padding-16)`.
  - caret (`arrow-drop-tri-caret`, Figma `9662:26612`): **10×10px** frame, `var(--color-icon-brand-base)`.
  - row dismiss (`.Tag-Element-Close` / `shape-x-thick`, Figma `11666:90408`): **10×10px** frame, `var(--color-icon-gray-neutral-accessible)`, **right-aligned** in header row.
  - expanded tag wrap (viewport): `gap: var(--spacing-space-4)`, padding `var(--padding-padding-8) var(--padding-padding-24) 0 var(--padding-padding-16)` (top `8`, right `24`, bottom `0`, left `16`).
  - the tag wrap caps at **3 rows** (`max-height: 100px` = top `8` + 3 × `28px` lg tag + 2 × `4px` row gap) then scrolls; the scroll area spans the full popup width so its overlay scrollbar aligns with the options list scrollbar.
  - the tag wrap uses `contain: inline-size` so the **wrapped tags do not drive the content-driven menu width** — the menu is sized by the options (each tag is a selected option, so the option list is always wide enough), and the tags simply wrap within that width. Without this, a flex-wrap container's `max-content` is the sum of all tags on one line, which would inflate the menu to `700px` even when each tag is short.
  - dismissible tags use IDS Tag large editable geometry (`components/ids/tag/design-spec.md`). Tag width is capped to the panel (`maxWidth: 100%`): a long tag grows the content-driven menu up to `700px`, and once the menu is at max the tag label **truncates** with an ellipsis (dismiss control stays full-size).
  - selected-count badge follows IDS badge geometry (`18px` height, pill radius). The badge does not shrink (`flex-shrink: 0`) so a 2-digit count never overlaps the value text.
- Search dismiss control:
  - visible when query length `> 0`; right-aligned inside search field row.
  - dismiss icon (`ctrl-close-16`, matching the Datagrid filter search clear): **12×12px** frame, `var(--color-icon-accessible)`.
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
  - `var(--corner-radius-radius-4)` (scroll thumb)
  - `var(--spacing-space-4)`, `var(--spacing-space-8)`, `var(--spacing-space-10)`, `var(--spacing-space-16)`
  - `var(--padding-padding-2)`, `var(--padding-padding-6)`, `var(--padding-padding-8)`, `var(--padding-padding-10)`, `var(--padding-padding-16)`, `var(--padding-padding-24)` (Show Selected tag-wrap right inset)
- **Scrollbar** (options list and Show Selected tag wrap)
  - **Overlay** scrollbar (Base UI `ScrollArea`) — absolutely positioned, does **not** take layout space, so option rows and tags keep their full width (a classic space-taking scrollbar would shorten them).
  - Always visible while the region overflows (not hover-reveal); hidden when there is no overflow.
  - Thumb: `6px` wide, `var(--corner-radius-radius-4)`, `var(--color-border-gray-neutral-light)` (→ `var(--color-text-gray-neutral)` on hover).
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
  - the caret indicator rotates `180°` while the popup is open (attached-dropdown affordance).
- Keyboard list navigation:
  - `ArrowUp`/`ArrowDown` moves active option.
  - `Enter` commits active option in single-select mode.
  - `Space` toggles active option in multi-select mode.
- Search behavior:
  - typing in the search row filters the option list immediately by **case-insensitive substring (contains) match** on the option label (e.g. typing `c` shows options containing `c`, then `ca` narrows to those containing `ca`) — same match behavior as the datagrid combobox/multiselect filters. Section headers and dividers are hidden while a query is active.
  - when search query is non-empty, a right-aligned dismiss control (`ctrl-close-16`, **12×12px** frame) clears the query.
  - when no option matches, the list shows a single `No results found` row (see Layout for typography/padding); nothing else is rendered.
  - **Inline autocomplete (ghost text):** when the typed keyword is a **prefix of exactly one** selectable option, the remaining tail of that option's label renders as **greyed-out ghost text** immediately after the caret (the typed characters keep their normal `var(--color-text-gray-neutral)` colour; the suggested tail uses `var(--color-static-gray-400)` = `#9E9E9E`, fixed in both light and dark). The ghost tail is a **non-committed suggestion**, not a text selection — nothing is highlighted. Accept it with `Tab`, `→` (caret at end), or `End`, which commits the full option label (preserving the option's own casing). Any further typing or deletion recomputes/clears the suggestion. Only computed on insertion — deleting never re-completes.
- Option selection:
  - single-select commits the option and **closes** the popup.
  - multi-select toggles the option and **keeps the popup open** for further selection.
- Single-select Clear All (`showClearAll`, Figma `348:140631`):
  - a "Clear All" row appears **below the search row** whenever a value is selected. Visual matches the footer action button (`var(--color-text-brand-strong)`, `Body 2`, inner button `padding: var(--padding-padding-2) var(--padding-padding-16)`, `radius-2`) but with a **bottom** border (not the footer's top border) since it sits at the top of the list.
  - the Clear All row is **hidden while a search query is active** (same as the multi-select `SelectAllRow`), and reappears when the search is cleared.
  - clicking it clears the selection; the row then **auto-hides** (no value remains). It does **not** collapse the menu.
- Menu sizing:
  - the option list shows up to **6 rows** before it scrolls; ≤6 options render with no scroll, >6 introduce a vertical scroll region.
- Multi-select behavior:
  - `Select All` **toggles** the currently-visible (filtered) scope: if not all visible options are selected it selects them (added to any off-filter selections); if every visible option is already selected, clicking again **deselects** the visible scope. It does **not** collapse the menu. While a filter is active its checked/indeterminate state reflects only the visible options.
  - the `SelectAll` row is **hidden while searching when fewer than 2 options match**.
  - **No results found:** when the query matches no options, the `SelectAll` / `Clear All` row **and** the `Show Selected` / `Hide Selected` panel are both hidden — only the search row and the "No results found" row remain, and the popup min-height falls back to `212px`.
  - `Clear All` clears selections **and collapses the menu**; while a filter is active it clears **only the currently-visible options** (off-filter selections are kept), and is disabled when no visible option is selected. With no filter it clears everything. Clicking it also **resets the options list scroll to the top** (both the multi-select row and the single-select Clear All row).
  - `Show Selected` / `Hide Selected` toggles the selection summary panel (Figma `12730:120316`, menu `29393:146761`). It **defaults to collapsed** (`Show Selected`) and expands to `Hide Selected` on click.
  - when expanded, selected values render as dismissible **Tag** chips per `components/ids/tag/design-spec.md` (`type=editable`, `closable`, large dismissible geometry).
  - the panel auto-hides when no option is selected (e.g. after `Clear All`); there is **no separate panel dismiss (X) control** — clearing is done via `Clear All`.
  - the field shows the selection on one line; when the text is **truncated** it is wrapped in the IDS Tooltip revealing the full value (single-select: the selected item; multi-select: the badge tooltip reveals the full list). The tooltip appears only when the text is actually cut off.
  - collapsed multi-select field shows badge count + truncated selected labels.
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
| `menuWidth` | No | `"trigger" \| "content"` | Width mode. `"trigger"` (default): menu = trigger width (container-driven, truncates). `"content"`: menu grows to widest option/tag, clamped `[trigger, 700px]`, then truncates. |
| `showClearAll` | No | `boolean` | Single-select only. Shows a "Clear All" row (below the search) when a value is selected; clicking clears the selection (the row then auto-hides). Does **not** collapse the menu. |
| `maxVisibleItems` | No | `number` | Option rows shown before the list scrolls. Default `6`. |
| `noResultsLabel` | No | `string` | Row text when a query matches no options. Default `"No results found"`. |
| `options` | Yes | `{ id: string; label: string; disabled?: boolean }[]` | Canonical option model. |
| `value` | No | `string \| string[]` | Controlled selected value(s). |
| `onChange` | No | `(payload) => void` | Emits selected value(s). |
| `onSearch` | No | `(query: string) => void` | Emits search query. |
| `onOpenChange` | No | `(open: boolean) => void` | Open state callback. |
| `onSelectAll` | No | `(visibleValues?: string[]) => void` | Multi-select only. While filtering, receives the visible option values so the consumer adds only those; `undefined` when no filter. |
| `onClearAll` | No | `(visibleValues?: string[]) => void` | Multi-select only. While filtering, receives the visible option values so the consumer clears only those; `undefined` when no filter (clears all). |
| `showSelectedPanel` | No | `boolean` | Multi-select only; enables Show/Hide Selected row + tag chips. |
| `showSelectedExpanded` | No | `boolean` | Controlled expanded state for selection tag panel. |
| `onShowSelectedExpandedChange` | No | `(expanded: boolean) => void` | Toggle callback for Show/Hide Selected. |
| `onRemoveSelectedTag` | No | `(value: string) => void` | Removes one selected value when a tag dismiss control is activated. |
| `onShowSelectedPanelClear` | No | `() => void` | **Deprecated** — the panel dismiss (X) control was removed. Use `onClearAll`; the panel auto-hides when nothing is selected. |
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
## Implementation Notes

### 2026-08-30
- **Field text tooltip with section header (multi-select)** — `IdsDropdownComboBox.stories.tsx` `TruncatingValue` now accepts a `tooltipTitle` and renders an `IdsTooltip` on the truncated field text with the same `${selectedCount} Items` header as the badge. The tooltip only appears when the text is actually cut off.
- **Show Selected panel above Select All / Clear All** — `IdsDropdownComboBox.stories.tsx` multi-select stories pass `showSelectedFirst` to `DropdownMenu` so the `Show Selected / Hide Selected` toggle is rendered before the `Select All | Clear All` row.
- **Options list 1px inset padding** — `DropdownMenu.module.css` `.optionsScrollViewport` now has `padding-inline: 1px` so the option rows sit 1px inside the menu border, matching the App Launcher options list.

### 2026-08-13
- **Focus management / no auto-focus on open** — `DropdownMenu.tsx` explicitly returns focus to the trigger after Base UI mounts the popup. The user must `Tab` into the popup; `ArrowUp`/`ArrowDown` then move focus between enabled `data-selectable` option rows via `moveOptionFocus`.
- **Cross-section keyboard navigation** — `ArrowUp`/`ArrowDown` move focus between popup sections and inside the Show Selected panel (toggle → tags); `ArrowLeft`/`ArrowRight` move horizontally within the Select All / Clear All row and between Show Selected tags. `Tab` still traverses every tabbable control.
- **Keyboard-reachable controls only** — `ScrollArea.Viewport` elements (`optionsScrollViewport` and `showSelectedTags`) carry `tabIndex={-1}` so they do not receive focus; `searchClearButton` is kept in the tab order.
- **Focus ring geometry** — `triggerReset` and `searchField` use a `::after` pseudo-element focus ring: `inset: -4px`, `border: var(--border-width-border-default) solid var(--color-border-brand-base)`, `border-radius: var(--corner-radius-radius-4)`, `pointer-events: none`. The `searchField` ring is rendered only when `data-focus-visible` is set (keyboard `Tab` focus) and is hidden while typing. Option rows use `outline: var(--border-width-border-1) solid var(--color-border-brand-base)` with `outline-offset: -1px` and `border-radius: var(--corner-radius-radius-4)`.
- **Action button focus rings** — Added missing `:focus-visible` focus rings for popup action buttons (`selectAllButton`, `clearAllButton`, `showSelectedToggle`, `footerAction`, `clearAllAction`) to match IDS Checkbox / Button / Dropdown Button specs.
- **Select All / Clear All row** — `.selectAllClearAllRow` `padding-right` is `0`.

Design-level implementation contract for the shared component (`DropdownMenu.tsx` / `DropdownMenu.module.css`, `IdsDropdownTriggerShell.*`) and `ids-theme.css`. Shared with single-/multi-select — verify all three after edits.

- **Popup border** — full 4-sided `1px` border (`var(--color-border-gray-neutral-base)`); `sideOffset: -1` so the top border overlaps the field's bottom border into a single line.
- **`--padding-padding-24` token** — defined in `ids-theme.css` (`24px`, light + dark); drives the **Show Selected tag-wrap right inset** (`padding: 8 24 0 16`), not the single-select option.
- **Single-select option** — `min-height: 40px`; padding `10 16 10 16`; text-only rows use `align-items: flex-start` (radio rows stay centered).
- **Leading control (checkbox/radio)** — `16×16px`, left edge flush with the `Select All` checkbox.
- **Search input wrap gap** — `var(--spacing-space-10)`.
- **Empty-search row (`No results found`)** — Body 2 - Medium (`500`), `var(--color-text-gray-neutral)`, `wdth 100`, padding `pl-16 pr-16 py-10`; rendered as the sole list row.
- **Caret** — rotates `180°` while the popup is open (`[data-popup-open]`).
- **Popup min-height** — `212px` (search only) / `252px` (search + Select All + Show Selected). The `252px` applies only while the `Select All` row is shown; when it collapses (no results, or `<2` matches) the popup falls back to `212px`.
- **Option list scroll** — caps at `maxVisibleItems` rows (default `6`); ≤6 no scroll, >6 scrolls.
- **Search filter** — case-insensitive substring (contains) match on the option label; sections/dividers hidden while filtering.
- **`Select All`** — selects only the visible (filtered) options, added to any off-filter selections; checked/indeterminate state reflects the visible set; the row is hidden when `<2` options match.
- **`Clear All`** — while filtering, clears only the visible options (keeps off-filter selections) and is disabled when none are visibly selected; with no filter, clears all. For multi-select, the popup closes after `Clear All` is clicked.
- **`Show Selected` panel** — defaults collapsed (`Show Selected`); has no dismiss (X) control; auto-hides when nothing is selected.
- **Option selection** — single-select closes the popup on commit; multi-select keeps it open.
- **Filled field content group** — badge + value with `gap: 4`; `padding-right: 16` when a selection is shown (none for placeholder-only).
- **Trigger width** — `width: max-content` so the popup matches the field, not a wider container.

### Implementation updates (2026-08-05)

- **Label** — optional; sits to the left of the field on the same row with `gap: var(--spacing-space-16)`. Uses `body-2` typography (`var(--font-size-body-2)` / `var(--font-line-height-line-height-20)`), `var(--color-text-gray-neutral-strong)`, and an optional trailing required `*`. The label is rendered outside `DropdownMenu` by the consuming `IdsDropdownComboBox` wrapper and does not constrain the menu width.
- **Ghost text autocomplete** — when the typed keyword is a prefix of exactly one option, the remaining suffix is rendered as greyed-out ghost text. It is accepted with `Tab`, `ArrowRight`, or `End` while the cursor is at the end of the input; IME composition is deferred until `compositionend`; deletions always clear the suggestion.
- **Field attached dropdown radius** — when the popup opens, Base UI sets `data-popup-open` on the trigger, causing the field's bottom-left/right radii to become `0` and the caret to rotate `180°`.
- **Tooltip** — truncated field value is wrapped in the IDS Tooltip: single-select shows the full selected item, multi-select shows the full selected list via the badge tooltip. The tooltip only appears when the text is actually cut off. Implementation: `IdsDropdownTriggerShell` consumer wraps the truncated field content with `components/ids/tooltip/design-spec.md`.
- **Content-driven menu width (`menuWidth="content"`)** — the popup grows to the width of its widest option/tag, clamped between the trigger width (`--dropdown-trigger-width`, aliased to Base UI `--anchor-width`) and `700px` (`--dropdown-menu-max-width`). Content beyond `700px` truncates with an ellipsis. The selected tag wrap uses `contain: inline-size` so wrapped tags do not inflate the menu width. Implementation: `DropdownMenu.tsx` — `contentWidthMode`; `DropdownMenu.module.css` — `.popupContentWidth` and `.showSelectedTags` `contain: inline-size`.

## Source Mapping
- **Component map entry:** `data/component-figma-map.json` -> `Dropdown / Combo Box`.
- **Primary nodes:** `29393:149209` (single), `12730:157002` (multi).
- **Element nodes:** `29393:143195`, `29716:46779`, `12730:120316`.
- **Figma MCP evidence:** `get_design_context` + `get_variable_defs` on all listed nodes.
- **Last live verification:** 2026-06-19 (geometry audit: field `29393:149487`, `12730:157290` `radius-none`; focus `29393:149470`; search `29393:141946`).
