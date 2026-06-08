# Dropdown / Combo Box Design Spec

## IDS baseline (layout, flow, contracts)

Synapse **Dropdown / Combo Box** shares the IDS **Dropdown-Combobox** family (single-select + multi-select field + menu popup). Field shell, search row, multi-select controls, and interaction contracts match the IDS spec unless noted in **Synapse programme deltas** below.

- **IDS source of truth:** [`components/ids/dropdown-combo-box/design-spec.md`](../ids/dropdown-combo-box/design-spec.md)
- **Shared implementation:** `storybook/src/components/DropdownMenu.tsx` + `IdsDropdownTriggerShell` (combobox field stories)
- **Synapse detached action menu:** `storybook/src/components/SynapseDropdownActionMenu.module.css` + `LeftNavSecondaryContextMenu.tsx`
- **Left Nav usage:** overflow trigger on secondary rows → detached `Dropdown-SingleSelect-Elements-Menu`

**Scope of live Synapse verification (this spec):** detached action menu `53325:280088` (Left Nav context popup). Combobox **field** matrix (`11067:54551`) still inherits IDS until verified node-by-node.

## Metadata
- Component: Dropdown / Combo Box
- Design System: Synapse
- Category: Form Elements
- Spec pattern: **ids-fork** (registry: `data/programme-inheritance-registry.json` → `programme: synapse`, `slug: dropdown-combo-box`)
- IDS baseline slug: `dropdown-combo-box`
- Variant family scope: **`combobox-single`**, **`combobox-multi`**, and **detached action menu** (no field trigger)
- Status: **draft**
- Version: 1.1.0
- Figma file: [Synapse Hi-Fi components](https://www.figma.com/design/Td1bnsvRj1PCGs9RVJkIvJ/Synapse-Hi-Fi-components)
- File key: `Td1bnsvRj1PCGs9RVJkIvJ`
- **Verified detached menu:** `Dropdown-SingleSelect-Elements-Menu` — [53325:280088](https://www.figma.com/design/Td1bnsvRj1PCGs9RVJkIvJ/Synapse-Hi-Fi-components?node-id=53325-280088&m=dev) (185×120, Left Nav context popup)
- Left Nav frame (trigger + menu): [53325:280087](https://www.figma.com/design/Td1bnsvRj1PCGs9RVJkIvJ/Synapse-Hi-Fi-components?node-id=53325-280087&m=dev)
- Synapse Form Elements entry: `Dropdown/Combo` — [11067:54551](https://www.figma.com/design/Td1bnsvRj1PCGs9RVJkIvJ/Synapse-Hi-Fi-components?node-id=11067-54551&m=dev) (field — inherit IDS pending verification)
- IDS menu elements reference: `29393:143195` (IDS Design Library)
- Verification method: Figma MCP (`get_metadata`, `get_design_context`, `get_variable_defs`)
- Last verified: 2026-06-05 (`53325:280088` detached menu; variable defs on popup + option rows)
- Theme CSS: `components/synapse-theme.css` (not `ids-theme.css`)

### Synapse programme deltas (vs IDS)

| Topic | IDS | Synapse (verified `53325:280088`) |
|---|---|---|
| Detached menu border | `var(--color-border-accessible)` | **`var(--color-border-neutral-light)`** |
| Detached menu radius | `0` (field-attached popup); detached IDS stories use `186px` min-width, square corners | **`var(--corner-radius-radius-4)`** (4px; Figma token `Drowdown Menu`) |
| Detached menu min-width | `186px` | **`185px`** (Figma frame width) |
| Detached menu shadow | drop-shadow 4 + 2 stack | Same tokens; **2px layer listed before 4px** in Figma export |
| Option row padding | `var(--padding-padding-10) var(--padding-padding-16)` | **Same** |
| Option row min-height | `40px` | **Same** (`120px` popup ÷ 3 rows) |
| Option label typography | Body 2 | **Body 2 Regular (`font-weight: 400`)**, `var(--color-text-neutral)` |
| Option row hover inset | `var(--color-border-brand-base)` top/bottom | **`var(--color-border-brand-neutral)`** top/bottom (Synapse detached pattern; aligns masthead help menu) |
| Option row press | `var(--color-background-brand-light)` + brand-strong text | **Same semantic tokens** |
| Field trigger border | `var(--color-border-accessible)` | **Inherit IDS** until `11067:54551` verified |
| Combobox-single / multi field | IDS size matrix | **Inherit IDS** |
| Theme resolution | `components/ids-theme.css` | `components/synapse-theme.css` |

### Figma sample options (Left Nav context menu, `53325:280088`)

Runtime options are **user-defined**. Figma reference labels:

1. **Open In a New Tab**
2. **Rename**
3. **Delete**

## Anatomy

Deterministic slot order (IDS-aligned + Synapse detached menu):

1. `ComboBoxRoot`
2. optional `Label`
3. `FieldContainer` → `ValueSlot` + `CaretSlot`
4. optional `HelperText` / `ValidationError`
5. optional `MenuPopup`
6. optional `SearchRow` in popup
7. `OptionList` with option rows
8. **Multi-select only:** `SelectAllRow`, `ClearAllAction`, checkboxes, optional `ShowSelectedToggle`

### Menu-only slice (detached action list — verified `53325:280088`)

1. `MenuPopup` — `Dropdown-SingleSelect-Elements-Menu`
2. `OptionList` — `.Dropdown-SingleSelect-Elements-Options` rows
3. `OptionRow` — user-defined `{ id, label, disabled? }[]`

No search row, no radio/checkbox leading controls, no field trigger in this usage.

## Layout & Measurements

### Detached action menu (verified `53325:280088`)

| Property | Value |
|---|---|
| Sample size | **185×120** px (3 options) |
| Min width | **185px** (runtime; may grow with longer labels) |
| Border | `1px` `var(--color-border-neutral-light)` all sides |
| Corner radius | `var(--corner-radius-radius-4)` |
| Shadow | `0 2px 2px` + `0 4px 4px` `var(--shadow-shadow-4-drop-shadow-4-color)` |
| Option row padding | `var(--padding-padding-10)` block / `var(--padding-padding-16)` inline |
| Option row min-height | `40px` |
| Positioning (Left Nav) | `side: bottom`, `align: end`, `sideOffset: 4px` relative to overflow trigger |

### Combobox field (inherit IDS)

See [`components/ids/dropdown-combo-box/design-spec.md`](../ids/dropdown-combo-box/design-spec.md) until Synapse `11067:54551` is verified.

## Tokens

### Detached menu popup + option rows (verified `53325:280088`)

- `var(--color-background-component)` — popup + row default
- `var(--color-border-neutral-light)` — popup border
- `var(--corner-radius-radius-4)` — popup radius
- `var(--color-text-neutral)` — row label (Body 2 Regular)
- `var(--font-size-body-2)` / `var(--font-line-height-line-height-20)` — typography
- `var(--padding-padding-10)` / `var(--padding-padding-16)` — row padding
- `var(--shadow-shadow-4-drop-shadow-4-color)` — elevation
- `var(--color-background-brand-lighter)` — row hover
- `var(--color-border-brand-neutral)` — row hover/press inset emphasis
- `var(--color-background-brand-light)` — row press
- `var(--color-text-brand-strong)` — row press text
- `var(--color-text-disabled)` / `var(--color-background-gray-lighter)` — disabled row

### Combobox field (inherit IDS)

Full IDS token list in [`components/ids/dropdown-combo-box/design-spec.md`](../ids/dropdown-combo-box/design-spec.md).

## States (Light Theme)

### Option row (detached action list — verified default; hover/press per Synapse detached pattern)

| State | Background | Border | Text/Icon |
|---|---|---|---|
| Default | `var(--color-background-component)` | none | `var(--color-text-neutral)` Body 2 Regular |
| Hover | `var(--color-background-brand-lighter)` | inset top/bottom `var(--color-border-brand-neutral)` | `var(--color-text-neutral)` |
| Press | `var(--color-background-brand-light)` | inset top/bottom `var(--color-border-brand-neutral)` | `var(--color-text-brand-strong)` |
| Focus-visible | current fill + focus ring `var(--color-border-brand-base)` | — | unchanged |
| Disabled | `var(--color-background-gray-lighter)` | — | `var(--color-text-disabled)` |

### Field + selectable rows (combobox-single / multi)

Inherit IDS state matrices until Synapse field nodes verified.

## States (Dark Theme)

Dark theme uses the same semantic tokens as **States (Light Theme)**. Resolved values for `[data-theme="dark"]` / Synapse dark scope live in `components/synapse-theme.css`.

Duplicate the full state matrix in this section only when a dark row genuinely uses different `var(--...)` references than the corresponding light row.

## Interactions

### Combobox field (inherit IDS)

- Trigger click / `Enter` / `Space` toggles popup
- `Escape` closes popup; arrow keys navigate options
- Single-select commits one `id`; multi-select toggles selection set

### Detached action-list menu (Left Nav context menu)

- Overflow trigger click opens popup; does **not** navigate the secondary row
- `Enter` / `Space` on option executes `onSelect` and closes menu
- `Escape` closes menu; focus returns to trigger
- Click outside closes menu (Base UI Menu default)
- User supplies option list via `contextMenuOptions` or `getSecondaryContextMenuOptions`
- Figma sample actions: Open In a New Tab, Rename, Delete

### Accessibility

- Trigger: `aria-label="More actions for {child name}"`, `aria-haspopup="menu"`
- Popup: menu semantics; items `role="menuitem"`
- Keyboard: roving focus within menu; disabled items skipped

## Composition & API (runtime)

Inherit IDS combobox API from [`components/ids/dropdown-combo-box/design-spec.md`](../ids/dropdown-combo-box/design-spec.md) for full field usage.

### Action-list menu option model

| Prop | Required | Type | Notes |
|---|---|---|---|
| `id` | No | `string` | Stable key |
| `label` | Yes | `string` | Visible row text |
| `disabled` | No | `boolean` | Blocks activation |
| `onSelect` | No | `() => void` | Fires before close |

Hosts:

| Host | Input | Notes |
|---|---|---|
| `MainMenuLeftSecondaryItem` | `contextMenuOptions?` | Per-row static options |
| `MainMenuLeft` / `SynapseLeftNav` | `getSecondaryContextMenuOptions?` | Dynamic options from `{ parentItemId, childId, name }` |

## Codegen Contract (Framework-Agnostic Blueprint)

### Deterministic structure (detached action menu)

1. `MenuRoot`
2. `MenuTrigger` (overflow icon button)
3. `MenuPortal` → `MenuPositioner` → `MenuPopup`
4. `OptionList` → `OptionRow*` (map user options)

### Variant matrix

| usage | selectionMode | search | leading control | chrome |
|---|---|---|---|---|
| combobox-single (field) | single | optional | optional radio | inherit IDS |
| combobox-multi (field) | multi | optional | checkbox | inherit IDS |
| detached action-list | none | false | none | Synapse `53325:280088` |

### Per-slot style contract

- Popup + rows: `SynapseDropdownActionMenu.module.css` (`.popup`, `.optionRow`)
- All colors/spacing via `var(--...)` from `components/synapse-theme.css`
- Do **not** use IDS `DropdownMenu.module.css` `.popupStandalone` for Synapse detached menus

### Behavior contract

- Action-list: selecting an option closes menu; does not change nav selection
- Empty `options` → host-only callback (`onSecondaryContextMenu`) without built-in popup

### Accessibility contract

See **Interactions → Accessibility**.

### Asset resolution

- Caret (field): `arrow-drop-tri-caret`
- Search: `search-16`
- Context trigger (Left Nav): `overflow-menu-dots`

### Fallback/error rules

- Unknown `mode` → `combobox-single` (inherit IDS)
- Missing option `id` → derive from index in non-strict mode
- Empty options on action menu → validation warn; no popup render

### Validation checklist

- [x] Detached menu matches Figma `53325:280088` (185px, `radius-4`, `border-neutral-light`)
- [x] Option rows: `padding-10`/`padding-16`, Body 2 Regular, `text-neutral`
- [x] Left Nav story uses Figma sample labels (Open In a New Tab, Rename, Delete)
- [ ] IDS combobox single/multi field matrices referenced when `11067:54551` verified
- [ ] Light/dark outputs remain semantic-token driven via `synapse-theme.css`

## Source Mapping

- **IDS baseline:** `components/ids/dropdown-combo-box/design-spec.md` — file `0bHk3XhrjFhowgFkz9yLr4`, nodes `29393:149209`, `29393:143195`
- **Synapse verified menu:** `53325:280088` (`Dropdown-SingleSelect-Elements-Menu`); parent frame `53325:280087`
- **Synapse map:** `data/synapse-component-figma-map.json` → `Dropdown/Combo` (`11067:54551`)
- **Programme inheritance:** `data/programme-inheritance-registry.json` → `dropdown-combo-box`
- **Left Nav:** [`components/synapse/left-nav/design-spec.md`](../left-nav/design-spec.md)
- **Implementation:** `SynapseDropdownActionMenu.module.css`, `LeftNavSecondaryContextMenu.tsx`
- **Evidence (2026-06-05):** Figma MCP — `get_metadata`/`get_design_context`/`get_variable_defs` on `53325:280088`; option instances `I53325:280088;22472:147638` (Open In a New Tab), `…147650` (Rename), `…147662` (Delete)
