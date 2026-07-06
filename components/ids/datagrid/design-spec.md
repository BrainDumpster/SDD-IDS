# Datagrid Design Spec

## Metadata
- Component: Datagrid
- Design System: IDS
- Category: Table and Data Grids
- Main component + use cases: https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=44398-164837&m=dev
- **Row / cell states & styling (body row chrome):** https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=37721-114580&m=dev — node id **`37721:114580`** (`.Row/Cell: States and styling`)
- Column details: https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=37721-114734&m=dev
- Sort icon states reference: https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=44551-229021&m=dev
- Filter icon + popup structure: https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=37721-114635&m=dev
- **Column filter types (Column Filter-Main):** https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=37822-91069&m=dev — node id **`37822:91069`**
- **Numeric column filter (`.Filter-Element-NumericFilter`):** https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=44360-182265&m=dev — node id **`44360:182265`** (operator matrix + value fields)
- **Column filter library page (`Column Filter`):** https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=44370-173173&m=dev — node id **`44370:173173`** (Date / Numeric / Date and Time filter families)
- **Date column filter (`.Filter-Element-DateFilter`):** https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=37822-90838&m=dev — node id **`37822:90838`** (preset radios + date-only pickers; `Column Filter-Main` **`Type=Date`** **`37822:91078`**)
- **Date and Time column filter (`.Filter-Element-DateAndTimeFilter`):** https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=44360-181306&m=dev — node id **`44360:181306`** (preset radios + date/time pickers)
- **Date-time filter preset panel (`Multi-select Droddown`, Last 24 hours sample):** https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=44360-181713&m=dev — node id **`44360:181713`** (inner list chrome: border, Shadow 1, **480px** width, **8px** vertical / **1px** horizontal padding)
- **Combobox-filter multiselect (`Dropdown Menu`):** https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=44360-147581&m=dev — node id **`44360:147581`** (search + Select All/Clear All + scrollable checkbox list)
- **Combobox-filter single-select (`Single-select + Search`):** https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=44360-179074&m=dev — node id **`44360:179074`** (search + scrollable text option list)
- **Default text filter (`Column Search`):** https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=37822-91073&m=dev — node id **`37822:91073`**
- **Dropdown-SingleSelect filter (`Single-select`):** https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=44360-179200&m=dev — node id **`44360:179201`** (Dropdown Menu)
- **Dropdown-MultiSelect filter (`Multi-select`):** https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=44360-179347&m=dev — node id **`44360:179348`** (Dropdown Menu)
- Sort icon (`.Sort for table`): https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=37721-114646&m=dev — node id **`37721:114646`**
- Filter / header annotations index (library page): https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=44551-229021&m=dev — node id **`44551:229021`**
- **Column header chrome (`.Column Header`):** https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=37721-114663&m=dev — node id **`37721:114663`**
- **Column header title row (text + optional checkbox + sort, spacing):** https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=37721-114673&m=dev — node id **`37721:114673`**
- **`.Filter for table` control (header filter hit target + icon frame):** https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=37721-114677&m=dev — instance **`37721:114677`** (main component **`37721:114635`**)
- **Data Grid — main variants / density matrix (container-sized frames):** https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=37721-112482&m=dev — node id **`37721:112482`** (`Data Grid - Main`)
- **Data Grid library page (pagination in context):** https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=48122-183847&m=dev — node id **`48122:183847`**; embedded pagination **`47962:168577`**
- File key: `0bHk3XhrjFhowgFkz9yLr4`
- Validated nodes: `44398:164837`, `37721:114734`, `37721:114646`, `44551:229021`, `37721:114635`, `37721:114663`, **`37721:114673`**, **`37721:114677`**, **`37721:114682`** (selection header — empty chrome), **`37721:114686`** (settings header), `37721:114887`, `37721:112483`, **`37721:112482`**, **`37721:114580`**, **`37721:113987`**, **`37721:113988`** (selection column), **`37721:113995`**, **`37721:113997`**, **`37721:114944`** (settings column), **`37721:115949`** (column-freeze scenario), **`37721:114144`** (freeze boundary gradient/shadow), **`37721:114143`** (scrollable pane inset), **`44360:179074`** (combobox-singleselect filter), **`37822:91073`** (default text filter), **`37822:90838`** (date filter), **`37822:91078`** (`Column Filter-Main` `Type=Date`), **`44360:181306`** (date-time filter), **`44360:181713`** (date-time preset panel / Shadow 1), **`37822:90943`** (preset filter row — shared by Date + Date and Time), **`48122:183847`** (datagrid library page), **`47962:168306`** (table shell border), **`47962:168577`** (embedded pagination footer), **`47962:168680`** (detail panel sibling)
- Verification method: Figma MCP (`get_metadata`, `get_design_context`, `get_variable_defs`); row/cell frame re-verified with `get_design_context` (**`disableCodeConnect: true`**) on **`37721:114580`**; column header **`37721:114663`**, title row **`37721:114673`**, filter control **`37721:114677`** re-verified same way **2026-05-13**; rows/columns layout **`37721:113987`** **2026-05-14**; column freeze **`37721:115949`**, boundary **`37721:114144`**, sort states **`37721:114646`** **2026-06-05**
- Last verified: **2026-07-06** (table shell + pagination borders `48122:183847` / `47962:168306` / `47962:168577`); prior **2026-06-05** (scroll/freeze blueprint + sort icon states `37721:114646`; column-freeze `37721:115949`; freeze boundary `37721:114144`; implementation parity `IdsDataGrid.tsx`); prior **2026-05-31** (date filter `37822:90838`, date-time `44360:181306`)
- Nested specs (codegen must delegate, not reimplement): `components/ids/checkbox/design-spec.md`, `components/ids/date-picker/design-spec.md`, `components/ids/time-picker/design-spec.md`, `components/ids/radio-button/design-spec.md`, `components/ids/pagination/design-spec.md` (footer), detail panel datagrid attach mode (see `IdsDetailPanel` / product `def-new-dg-detail`)
- Reference implementation (Storybook / React parity target): `storybook/src/components/IdsDataGrid.tsx`, `IdsDataGrid.module.css`, `IdsDataGridComposition.tsx`, `IdsDataGridCompositionStory.tsx`, `IdsDataGridDefaultStoryHost.tsx`, `IdsDataGridSelectionRadio.tsx`, `IdsDataGridSelectionCheckbox.tsx`
- Angular composition port: `storybook-angular/src/components/ids-datagrid/` (`ids-datagrid` → projected columns/rows/cells)
- **Codegen-critical layout:** **Chrome columns & table slack (codegen-critical)** under **Layout & Measurements → Table Layout Algorithm** — required for generators (grow `auto`, chrome **48**/**40** three-layer lock, anti-patterns).
- Implementation guide: [`components/ids/datagrid/README.md`](./README.md) (regeneration, column `width`, Storybook, tips)
- Generated Storybook output: `storybook-generated/ids/src/components/Datagrid.stories.tsx` (title **`Spec Generated/IDS/Datagrid`**, primary story **`Spec Accurate Design`**)
- Component map baseline: `data/component-figma-map.json` includes Datagrid legacy entry; this spec upgrades to IDS Design Library nodes above.
## Anatomy
- `DatagridRoot`
- `DatagridHeader`
  - `SelectionColumn` (optional **48px** leading column — shown when `rowSelection` and (`selectionMode: multiple` or `selectionMode: single` with `showSingleSelectionRadio: true`); header select-all only when `multiple`)
  - repeated `DatagridColumnHeader`
    - `DatagridColumnHeaderContent` (horizontal host: Figma **`37721:114663`** Text variant — **`pl-[16px]`**, **`items-center`**, **no extra vertical padding** on the host; **cell height is exactly `48px`**)
      - `DatagridColumnHeaderTitleRow` (Figma frame **`37721:114673`**: **`flex: 1`**, **`min-width: 0`**, **`gap: 12px`**, **`padding: 0 8px 0 0`** — **8px** right; **`align-items: center`** on the **48px** header track so **title + sort** match Figma’s **9+20+9** optical band without stacking extra host **`py`**; title line **20px** / **Body 2 - Medium**; optional **`SortToggle`**)
      - optional **`FilterToggle`** (Figma **`.Filter for table`** instance **`37721:114677`**: **`38×38`** hit target, **`padding: 12px`**, **`14×14`** icon — **sibling** of the title row, not inside **`37721:114673`**). Implement with the shared **`Icon`** component: **`shapeName`** = **`filter`** | **`filter-solid`** (slugs under **`assets/icons/*.svg`**); tint via **`color`** / ancestor **`color`** using **`var(--color-icon-...)`** tokens.
      - optional **`FilterMenu`** (when the column filter is **open**): **`FilterIconTab`** + **`FilterPanel`** + **`FilterPanelBody`** (`column.filterPanel`) — see **Column filter menu (L-frame baseline)**.
      - optional **`ColumnResizeHandle`** (product / Storybook when **`columnResizeEnabled`**): transparent trailing-edge hit target co-located with the **1×24px** divider rail; **`cursor: col-resize`**; must not steal **`FilterToggle`** clicks.
  - **Last data column** (trailing column before settings): `<col width="auto">` (`.tableGrowCol`) — **only** slack column; settings `<col>` **`40px`** (Figma **`37721:113997`**).
  - `SettingsColumn` (always last visible chrome column, fixed width `40px`, **`Icon`** with **`shapeName="settings-gear"`**; sticky/pinned trailing; Figma *Padding* slot **`37721:113997`**)
- `DatagridBody`
  - repeated `DatagridRow`
  - repeated `DatagridCell`
  - `RowSelectionCell` (optional)
- `DatagridFooter`
  - `DatagridPaginationSlot` (IDS Pagination)
- Optional side attachment:
  - `DatagridDetailPanelSlot` (IDS Detail Panel datagrid variant)
### Framework-agnostic component tree

Codegen emits **one or more table primitives** with **deterministic column order** per layout mode:
- **Unified** (no freeze): header-band table + body-viewport table sharing column tracks.
- **Freeze** (`freezeUntilColumnKey`): up to **six** table sections (frozen / scrollable / settings × header / body) — still one logical column order across the grid.

Child components / projection slots map to framework wrappers; **geometry, tokens, scroll ownership, and interaction precedence** are defined only in this spec (not in framework adapters). See **Codegen Contract → Scroll & viewport blueprint**.

### Ownership boundaries

| Layer | Owner | Responsibility |
|---|---|---|
| **Grid chrome** | `DatagridRoot` | Shell, scroll viewport, `<colgroup>` widths, sticky pins, header/body table structure, L-frame filter shell, settings column, sort/filter icon chrome |
| **Column metadata** | `DatagridColumn` config | `key`, `title`, `sortable`, `filterable`, `filterActive`, `minWidth`, **`width`** (fixed px for header/body), `defaultWidth`, optional **`filterPanel`** (inner UI only) |
| **Cell content** | App / `DatagridRow.values` | Per-cell renderables (text, badges, custom components) inside `DatagridCell` padding box |
| **Filter inner UI** | App / `column.filterPanel` | Search fields, checkbox lists, comboboxes — **never** redraw L-frame borders |
| **Row selection** | IDS Radio / Checkbox spec | `single` + `showSingleSelectionRadio` → optional row radios; `multiple` → row checkboxes + header **select-all** |
| **Filter value lists** | IDS Checkbox spec | Multiselect filter checkboxes via `components/ids/checkbox/design-spec.md` (unchanged) |
| **Footer** | IDS Pagination spec | Page controls below scroll clip |
| **Detail panel** | IDS Detail Panel | Sibling of grid host; not a `<col>` |

### Deterministic slot order (left → right)

1. `SelectionColumn?` (**`48px`**, when `rowSelection` and selection chrome is shown — see `showSingleSelectionRadio` for `single`)
2. `DatagridColumnHeader` × N (data columns, each ≥ **`90px`** base width)
3. `SettingsColumn` (**`40px`**, when `showSettingsColumn: on` — default **on**)

**Forbidden:** spacer / “fill” / “padding” columns between data and settings (Figma **`37721:113987`** uses only real columns + **`40px`** settings). Extra viewport width goes to the **last data column** (see **Table layout algorithm**).

**Vertical stack (top → bottom):**

1. optional `DatagridTopBar` (product; not in Figma baseline)
2. `DatagridHeader` (sticky **`top: 0`**)
3. `DatagridBody` (scrollable rows inside `DatagridScrollViewport`)
4. `DatagridFooter` / `DatagridPaginationSlot` (outside vertical scroll clip)
5. optional `DatagridDetailPanelSlot` — **sibling** of grid shell (`flex` row: grid **`flex: 1`** + panel fixed rail)

### Composition pattern (canonical API)

Preferred pattern: **projected children** inside `DatagridRoot` — not aggregate-only `columns[]` / `rows[]` props.

```
DatagridRoot [rowSelection?, selectionMode?, withDetailPanel?, headerColorAndBorder?, …]
  DatagridColumn [field, title, sortable?, filterable?, width?, …]
    DatagridColumnTitle? (optional projected title override)
    DatagridFilter? (optional)
      FilterPanelBody (text / multiselect / numeric / date / custom)
  DatagridRow [rowId] × N
    DatagridCell [field] × per column
  DatagridFooter?
    DatagridPaginationSlot (IDS Pagination)
  DatagridDetailShell? (optional wrapper when detail panel attached)
    DatagridDetailPanelSlot
```

**Assessment:** Child-component decomposition is **compatible** with framework-agnostic codegen when adapters treat `DatagridColumn` as **metadata + projection** and keep **L-frame / colgroup / sticky / grow-column math** in `DatagridRoot`. Do **not** push table-width or filter-portal logic into individual column components.

| Spec slot | Responsibility |
|---|---|
| `DatagridRoot` | Host table + scroll; owns selection model, column order, freeze, settings popup trigger |
| `DatagridColumn` | Header title, sort, filter toggle, resize handle; **does not** own L-frame portal |
| `DatagridFilter` | Wrapper for projected `FilterPanelBody` only |
| `DatagridRow` | Row click, hover/selected state host |
| `DatagridCell` | Cell projection; ellipsis on text |
| `SelectionColumn` / `RowSelectionCell` | Grid-owned chrome — **single:** row radio, empty header; **multiple:** row checkbox + header select-all |
| `SettingsColumn` | Grid-owned (**40px** gear); not a `DatagridColumn` |
| `DatagridFooter` | Below body scroll; hosts pagination |
| `DatagridDetailPanelSlot` | Sibling of grid host; row click toggle; not a table column |

### Framework adapter mapping (reference ports)

| Spec slot | Angular (`storybook-angular`) | React (`storybook`) |
|---|---|---|
| `DatagridRoot` | `ids-datagrid` | `IdsDataGridComposed` |
| `DatagridColumn` | `ids-datagrid-column` | `IdsDataGridColumn` |
| `DatagridFilter` | `ids-datagrid-filter` | `IdsDataGridFilter` |
| `DatagridRow` | `ids-datagrid-row` | `IdsDataGridRow` |
| `DatagridCell` | `ids-datagrid-cell` | `IdsDataGridCell` |
| `DatagridFooter` | `ids-datagrid-footer` | `IdsDataGridFooter` |
| `FilterPanelBody` | projected in filter slot | `IdsDataGridFilter` children / filter panels |
| `DatagridDetailPanelSlot` | detail rail on `ids-datagrid` | `IdsDetailPanel` `attachMode="datagrid"` |
| Multiselect filter host | story host wiring | `IdsDataGridDefaultStoryHost` |
| Product Angular (`def-dg` family) | `<def-dg>` → `<def-dg-column>` → `<def-datagrid-filter>` → `<def-datagrid-row>` → `<def-dg-cell>` | same slot order as spec |

Aggregate `columns` / `rows` props remain supported for **story hosts** and migration; composition is the **canonical** documented API.

### React reference implementation (render engine)

| Concern | React module | Notes |
|---|---|---|
| Render engine (props API) | `IdsDataGrid` | Monolithic table; used by composition collector |
| Composition API | `IdsDataGridComposition.tsx`, `IdsDataGridCompositionStory.tsx` | Collects projected children → `IdsDataGrid` |
| `FilterPanelBody` | `column.filterPanel` / `IdsDataGridFilter` children | e.g. `IdsDataGridFilterSearchField` |
| `DatagridDetailPanelSlot` | `IdsDetailPanel` `attachMode="datagrid"` | Sibling in `contentRow` flex; **full** `1px solid var(--color-border-accessible)` per detail-panel spec — do **not** strip to left-only `border-light` |
| Multiselect filter host | `IdsDataGridDefaultStoryHost` | Wires `filterActive` + Type checkbox filter |
| Numeric filter host | `IdsDataGridNumericFilterStoryHost` | Wires `numericFilterState` + `IdsDataGridTypeNumericFilterPanel` |
| Numeric filter panel | `IdsDataGridTypeNumericFilterPanel` | Figma `44360:182265`; model in `IdsDataGridNumericFilter.ts` |
| Date filter host | `IdsDataGridDateFilterStoryHost` | Wires `dateFilterState` + `IdsDataGridTypeDateFilterPanel` |
| Date filter panel | `IdsDataGridTypeDateFilterPanel` | Figma `37822:90838`; model in `IdsDataGridDateFilter.ts` |
| Date-time filter host | `IdsDataGridDateAndTimeFilterStoryHost` | Wires `dateTimeFilterState` + `IdsDataGridTypeDateAndTimeFilterPanel` |
| Date-time filter panel | `IdsDataGridTypeDateAndTimeFilterPanel` | Figma `44360:181306`; model in `IdsDataGridDateAndTimeFilter.ts` |
| Column visibility popup | `IdsDataGridColumnVisibilityPanel` | Gear menu; only `columnHideable` columns; min one visible |
| Row selection | `IdsDataGridSelectionRadio` / `IdsDataGridSelectionCheckbox` | `single`: radio + `RadioGroup`; `multiple`: row + header select-all checkboxes |

### Vue / Lit / other frameworks

- Map **`DatagridColumnHeader`** to a **column definition object** + optional **scoped slot** for `filterPanel` and cell renderer.
- Map **`DatagridRow`** to row model + **cell slot** per column key.
- **Unified layout** (no `freezeUntilColumnKey`): one logical table split into **header band** + **body viewport** (see **Codegen Contract → Scroll & viewport blueprint**); adapters may still emit one `<table>` per band.
- **Freeze layout** (`freezeUntilColumnKey` set): **three horizontal panes** (frozen | scrollable data | settings) × **header + body** bands — not a single monolithic scrollport.
- Portals/overlays for **`FilterMenuLayer`** must attach to **`document.body`** (or app overlay root), not inside the scroll clip.

### Column filter menu (L-frame baseline)

### Figma & scope
- **Main:** Column filter chrome **`37721:114635`** (`.Filter for table` / **Column Filter-Main**); header control instance **`37721:114677`**.
- **Purpose:** **`FilterToggle`** opens a **column-scoped** menu. **Outer** geometry is an **L-shaped** shell (invariant). **Inner** UI is **product-defined** (`column.filterPanel`).

### `FilterToggle` (header, menu closed) — icon + interaction states
- **Hit target:** **`38×38`**, **`padding: 12px`**, **14×14** icon (Figma **`37721:114677`**).
- **Icon assets (slug → file):** outline **`filter`** → **`assets/icons/filter.svg`**; solid **`filter-solid`** → **`assets/icons/filter-solid.svg`** for non-default states. Render via the shared **`Icon`** component with **`shapeName`** set to that slug (default **`variant`** = mask/url bundle per app toolchain; do **not** hand-embed ad-hoc SVG paths outside the icon registry).
- **Deterministic precedence** (codegen must implement in this order — **selected must rank above hover** so an active filter stays blue while hovered):
  1. **Press** (`:active` / pointer down): **`shapeName`** **`filter-solid`**, tint **`var(--color-icon-brand-stronger)`**.
  2. **Selected / filter applied** (menu **closed**, column has active filter criteria): **`filter-solid`**, tint **`var(--color-icon-brand-base)`**. Bind to a column-level flag (e.g. **`column.filterActive`**) driven by the app’s filter model. **This must be checked before hover** — otherwise hovering over an active filter icon resets it to neutral-strong.
  3. **Hover** (pointer over toggle, or **keyboard focus** while closed): **`filter-solid`**, tint **`var(--color-icon-neutral-strong)`**.
  4. **Default:** **`shapeName`** **`filter`**, tint **`var(--color-icon-neutral)`**.
- **Menu open:** header shows a **38×38** placeholder (invisible spacer) so layout is stable; the **visible** funnel for “open” lives on **`FilterIconTab`** in the portaled menu (outline + neutral is acceptable for the **Selected with menu** variant per Figma dev readout).
- **Focus-visible:** **`FilterToggle`** button gets a **1px** **`var(--color-border-brand-base)`** outline with **~2px** offset (keyboard), without changing the default/hover/press icon rules above.
- **Pointer up** outside the originating control (e.g. release over portaled panel) must clear **press** state globally.

### `FilterMenuLayer` (open) — stacking & anchor
- Prefer **`position: fixed`** + **portal to `document.body`** so the menu is **not** a child of **`overflow: auto`** on the grid viewport (avoids extra scroll height, column shift, and clipping). **`z-index`** high enough to sit **above** grid body and side panels (e.g. **10000** until a global z-index token exists).
- **Position:** `top = anchor.getBoundingClientRect().top + 5px` (optical **38** in **48** header), `right = document.documentElement.clientWidth - anchorRect.right` (right-align to filter column). Recompute on **resize**, **window scroll (capture)**, **viewport scroll**, and **ResizeObserver** on the viewport.
- **Scroll viewport:** use **`scrollbar-gutter: auto`** on **`.bodyViewport`** (vertical scrollbar only when needed; avoid **`stable`** — it reserves a permanent right gutter). When a **detail panel** is attached, keep **`auto`** so no white strip appears beside **`SettingsColumn`**.

### L-frame geometry (invariant — all filter UIs)
- **`FilterIconTab`:** width/height **38px** (same as header filter hit target). **Top + left + right** border **`1px`** **`var(--color-border-accessible)`**; **no** bottom border; **`margin-bottom: -1px`** overlap onto **`FilterPanel`**. Background **`var(--color-background-component)`**. Inner layout: **`display: inline-flex`**, **`align-items: center`**, **`justify-content: center`**. **Important — use `padding: 11px 11px 12px`** (not `12px`): the 3 visible borders (left 1px + right 1px + top 1px) consume space under `box-sizing: border-box`, so reducing side/top padding by 1px each restores the **14×14** icon content area (38 − 1 − 11 − 11 − 1 = 14px wide; 38 − 1 − 11 − 12 = 14px tall). Using `padding: 12px` leaves only a 12×13 content area and causes the icon to flex-shrink. **`Icon`** (**`shapeName="filter"`** or `"filter-solid"` when filter active; pass `style={{ maskSize: '14px 14px' }}` to prevent the SVG's 12:14 aspect ratio from rendering narrower than 14px under `mask-size: contain`).
- **`FilterPanel`:** **Width is content-driven**, not a fixed pixel from Figma samples. Use **`width: max-content`** with a **floor** and **ceiling** so layouts stay usable:
  - **`min-width`:** product choice; Storybook uses **`200px`** minimum; dense search-only UIs may match Figma sample **~300px** by setting content min-width inside **`filterPanel`**.
  - **`max-width`:** cap to viewport (e.g. **`min(480px, calc(100vw - 24px))`**) for portaled/fixed menus.
- **L top seam:** **No** full-width top border on the panel. Draw **only** the horizontal segment **`width: calc(100% - TAB)`** from **`left: 0`**, where **`TAB = 38px`** (must match **`FilterIconTab`** width). This leaves the strip under the tab **open** so the outer outline is one continuous **L**.
- **Panel borders:** **left + bottom + right** **`1px`** **`var(--color-border-accessible)`**. **`overflow: clip`** on **`FilterPanelBody`** (inner slot), not on the shadow host. **Elevation — Shadow 1** (Figma **`44360:181713`**): `box-shadow: 0 2px 2px 0 <color>, 0 4px 4px 0 <color>` — geometry is **literal px**; colors from `--shadow-shadow-1-drop-shadow-2-color` and `--shadow-shadow-1-drop-shadow-4-color` (FLOAT y/blur tokens in theme are unitless and must not be passed directly to `box-shadow`).
- **`FilterPanelBody`:** horizontal + vertical padding for inner widgets (Storybook: **`6px`** **`16px`**); keeps the **::before** top rule aligned to the **outer** top edge of **`FilterPanel`**.
- **`FilterPanelBody` slot:** **`column.filterPanel`**. Search is **optional**. Checkbox lists must follow **`components/ids/checkbox/design-spec.md`**.

### Column filter composition contract

Filters are **not** built into the datagrid itself. They are **composing elements** attached to individual columns based on product requirements. The datagrid owns only the outer L-frame chrome (toggle, icon tab, panel shell); the inner filter UI is supplied per column via the **`column.filterPanel`** slot.

- **No default filter type.** A column with `filterable: true` but no `filterPanel` shows an empty L-frame (toggle only). The product must explicitly compose a filter panel for each filterable column.
- **Any filter type may be attached to any column.** The datagrid does not restrict which filter type a column uses. A text column may use a multiselect filter; a numeric column may use a single-select; assignment is product-driven.
- **Filter types are independent, reusable components.** Each filter type below is a self-contained panel that:
  - Receives its **options** (user-defined data, not hardcoded).
  - Manages its own **selection state** and **search state**.
  - Exposes a callback to update the host's filter model.
  - Renders entirely within the `FilterPanelBody` slot.
- **Multiple filter types may coexist** in the same grid. Different columns can use different filter types simultaneously.
- **Filter types delegate to IDS component specs** for their inner controls (checkboxes → `components/ids/checkbox/design-spec.md`, dropdowns → `components/ids/dropdown-single-select/design-spec.md`, radio buttons → `components/ids/radio-button/design-spec.md`, text fields → `components/ids/text-box/design-spec.md`). Codegen must use the IDS component for each control, not custom markup.
- **`filterActive` is column-scoped.** Each column independently tracks whether its filter is in a non-default state; the datagrid reads this flag to render the `FilterToggle` selected icon.

### Column filter types (`Column Filter-Main`, `37822:91069`)

Figma documents one **L-frame** shell per column; inner UI varies by **`Type`**. The outer L-frame chrome is grid-owned and invariant. Each filter type defines only the **inner panel content** (`FilterPanelBody` slot).

| Figma `Type` | Runtime filter kind | Status |
|---|---|---|
| `Column Search` | Default text search | Spec'd below |
| `Multi-select + search` | Combobox-Multiselect (checkbox list + search) | Spec'd below |
| `Single-select + Search` | Combobox-SingleSelect (option list + search) | Spec'd below |
| `Single-select` | Dropdown-SingleSelect (option list, no search) | Spec'd below |
| `Multi-select` | Dropdown-MultiSelect (checkbox list, no search) | Spec'd below |
| `Date` | Date-only preset radios + optional DatePicker | Spec'd below |
| `Date and Time` | Date-time preset radios + optional DatePicker/TimePicker | Spec'd below |
| `Numeric` | Operator radio list + value field(s) | Spec'd below |

Reference nodes: **`37822:91069`** (matrix), **`37822:91078`** (`Type=Date`), **`44386:290322`** (`Type=Numeric` instance).

---

### Filter type: Date (`.Filter-Element-DateFilter`, `37822:90838`)

Date-only column filter: same preset radio matrix as **Date and Time**, but summaries and expanded fields use **dates only** (no time pickers). Documented on Figma library page **`44370:173173`** (“Date Filter”).

**Figma:** `37822:90838` (`Column Filter-Main` **`Type=Date`**, `37822:91078`)

#### Anatomy

1. `PresetRadioGroup` — vertical list of preset radio rows (reuses `.DataGrid-Elements-Filter-DateAndTimeItem`, `37822:90943`)
2. `PresetSummary` — optional right-aligned **date-only** summary on the selected preset row (`All` and relative presets; not shown for `specific-date` or `custom-range`)
3. `SpecificDateBlock` — when **Specific date** selected: single **Date:** `DatePicker-Main` (no time field)
4. `CustomRangeBlock` — when **Custom date range** selected: two stacked date rows — **Start:** + picker, **End:** + picker

#### Layout

- **Inner panel (`Multi-select Droddown`):** same chrome as date-time — **`padding: var(--padding-padding-8) var(--padding-padding-1)`** on **`FilterPanelBody` slot**; L-frame **`FilterPanel`** **`min-width` / `max-width` 480px** (content-driven; sample rows **`382px`** inner list width in Figma); **Shadow 1** on shell (`0 2px 2px` + `0 4px 4px` @ 8%, see L-frame baseline).
- **Preset rows** (`37822:90943`): `padding: var(--padding-padding-8) var(--padding-padding-8) var(--padding-padding-8) var(--padding-padding-16)`, `justify-content: space-between`, `align-items: center`, `cursor: pointer`. Left: `16×16` radio + label (`gap: var(--spacing-space-8)`). Label: Body 2 Regular (`font-weight: 400`), `var(--color-text-neutral)`.
- **Preset row states:**
  - **hover:** background `var(--color-background-controls-brand-lighter)`, inset top/bottom `1px` `var(--color-border-brand-base)`.
  - **focus (keyboard only):** `outline: 2px solid var(--color-border-brand-base); outline-offset: -2px` on the row. No focus ring on the radio root when row-level focus is present.
  - **disabled:** radio border `var(--color-border-disabled)`, radio background `var(--color-background-disabled)`, dot `var(--color-icon-disabled)`, label color `var(--color-text-disabled)`, cursor `not-allowed`.
- **Preset summary:** Body 3 Regular — `12px` / line-height `18px`, `var(--color-text-neutral)`, **date-only** strings, single line, no ellipsis.
- **Expanded blocks:** `padding-left: 40px`, `padding-right: var(--padding-padding-16)`, `padding-bottom: var(--padding-padding-8)`; custom range uses vertical `gap: var(--spacing-space-16)` between **Start** and **End** rows.
- **Date picker row:** horizontal flex, `gap: var(--spacing-space-16)`; form label + `DatePicker-Main` (`flex: 1`). Sample inner width **`326px`** for specific-date block (`44370:145354`).

#### Presets (single-select radio group)

| Preset | Figma variant | Summary sample (when selected) | Expanded UI |
|---|---|---|---|
| `All` | `37822:90839` | `Jan 12 2020 - Now` | none |
| `Last 24 hours` | `37822:90852` | `Jan 12 - Jan 13` | none |
| `Last week` | `37822:90865` | computed date range (product) | none |
| `Last month` | `37822:90878` | computed date range (product) | none |
| `Last year` | `37822:90891` | computed date range (product) | none |
| `Specific date` | `37822:90904` | none on preset row | **Date:** + `DatePicker-Main`, hint `MM-DD-YYYY` |
| `Custom date range` | `37822:90922` | none on preset row | **Start:** + picker, **End:** + picker (stacked) |

Label copy differs from **Date and Time**: Figma uses **`Custom date range`** (not “Custom date and time range”) and **`Start:`** / **`End:`** (not “Start Date:”).

#### Delegated specs

- **Radio control:** `components/ids/radio-button/design-spec.md` — same as numeric/date-time filters; keyboard-only focus ring.
- **Date field:** `components/ids/date-picker/design-spec.md` — `40px` field height, `calendar-simple-16`, format hint `MM-DD-YYYY`.
- **No time picker** in this filter type (contrast with `.Filter-Element-DateAndTimeFilter`).

#### Filter model

- `mode`: `all` | `last-24-hours` | `last-week` | `last-month` | `last-year` | `specific-date` | `custom-range` (same enum family as date-time; implementation may share `IdsDataGridDateFilterState` without time fields)
- `specificDate?: Date | null`
- `rangeStartDate?`, `rangeEndDate?` (custom range)
- Header **`filterActive` / `dateFilterState`:** **`false`** when `mode === 'all'`; **`true`** for relative presets or when `specificDate` / `rangeStartDate` / `rangeEndDate` is set. Selecting **All** resets the model.

#### Relationship to Date and Time filter

| Aspect | Date (`37822:90838`) | Date and Time (`44360:181306`) |
|---|---|---|
| Preset list | Same seven presets | Same seven presets |
| Summary | Date-only (`Jan 12 - Jan 13`) | May include times (`Jan 12, 09:00 AM - …`) |
| Specific date | **Date:** picker only | **Date:** + **Time (optional):** |
| Custom range | **Start:** / **End:** date pickers | **Start Date:** / **End Date:** + optional time per row |
| Row component | `37822:90943` | `37822:90943` |

#### Codegen Contract (framework-agnostic)

- **Slot order:** `PresetRadioGroup` → conditional `SpecificDateBlock` | `CustomRangeBlock` (same pattern as date-time, omit all `TimePicker` slots).
- **Variant matrix:** seven `mode` values; expanded UI only for `specific-date` and `custom-range`.
- **Per-slot tokens:** preset row padding/summary typography per above; date picker per `date-picker` spec.
- **Behavior:** single-select radios; selecting `all` clears `filterActive`; relative presets apply date-only range to column values (midnight-to-midnight or product rules).
- **Accessibility:** one `radiogroup`; expanded pickers keep labels **Date:** / **Start:** / **End:** associated with inputs.
- **Validation checklist:** [ ] No time fields rendered; [ ] Summary strings date-only; [ ] `all` → header filter outline icon; [ ] Shadow 1 + 480px panel chrome; [ ] Labels match Figma (`Custom date range`, `Start:`/`End:`).

#### Figma proof nodes

- `44370:173173` (Column Filter library page — “Date Filter” section)
- `37822:90838` (component set)
- `37822:90839` (`Filter by=All`)
- `37822:90852` (`Last 24 hours`)
- `37822:90865` (`Last week`)
- `37822:90878` (`Last month`)
- `37822:90891` (`Last year`)
- `37822:90904` (`Specific Date` + date picker)
- `37822:90922` (`Custom Date Range` + Start/End pickers)
- `37822:91078` (`Column Filter-Main` `Type=Date`)
- `37822:90943` (shared preset row component)

---

### Filter type: Default text search (`Column Search`, `37822:91073`)

Simple inline search field rendered directly inside `FilterPanelBody`.

- **Anatomy:** `SearchIcon` (16×16) + `TextInput` + conditional `DismissButton` in a horizontal row.
- **Panel width:** `300px` (`FilterPanel` `min-width` / `max-width`).
- **Row padding:** `6px` vertical / `16px` horizontal (`padding: 6px 16px`).
- **Search icon:** slug `search-16`, `16×16` (no wrapper), color `var(--color-icon-brand-base)`.
- **Text input:** `font-size: var(--font-size-body-2)`, `font-weight: 400`, `line-height: var(--font-line-height-line-height-20)`, color `var(--color-text-neutral)`, `flex: 1`.
- **Placeholder:** `"Search"`, color `var(--color-text-neutral)`.
- **Dismiss button:** visible only when `query` is non-empty. Icon slug `ctrl-close-16`, rendered `12×12`. `all: unset`, color `var(--color-icon-neutral)`, cursor pointer.
- **Behavior:** typing filters column rows immediately (client-side); empty query shows all rows. Clicking dismiss button clears query. No selection controls.
- **Filter model:** `query: string`; `filterActive` when `query` is non-empty.

---

### Filter type: Combobox-Multiselect (`Multi-select + search`, `44360:147581`)

Multiselect combobox filter with search, Select All / Clear All, and scrollable checkbox option list. Tokens and interaction states follow **`components/ids/dropdown-combo-box/design-spec.md`** (`mode: combobox-multi`).

**Figma:** `44360:147581` (Dropdown Menu within `37822:91087`)

#### Anatomy

1. `SearchRow` — bordered search field
2. `SelectAllClearAllRow` — checkbox + label left, Clear All action right, bottom border divider
3. `OptionList` — scrollable checkbox option rows

#### Layout

- **Container:** `var(--color-background-component)` background, `var(--border-width-border-default)` solid `var(--color-border-accessible)` border, `var(--padding-padding-1)` horizontal padding, Shadow 4 elevation, `overflow: clip`. Sample width `269px`; runtime: content-driven within L-frame `max-width`. Min-width `186px`, max-width `700px`.
- **Container width:** `269px` (`FilterPanel` `min-width` / `max-width`).
- **Search row:** `var(--padding-padding-8)` wrapper padding. Inner field: `var(--border-width-border-default)` solid `var(--color-border-accessible)`, `var(--padding-padding-2)` vertical / `var(--padding-padding-16)` horizontal, **no border-radius** (sharp corners per Figma `Search-Main`). Search icon `search-16` (`16×16`, `var(--color-icon-brand-base)`). Text input left-padded `var(--padding-padding-8)`, `var(--padding-padding-4)` vertical, `font-weight: 400`. **Dismiss button** (conditional, when `searchQuery` non-empty): icon slug `ctrl-close-16`, rendered `12×12`, `all: unset`, color `var(--color-icon-neutral)`, cursor pointer.
- **Select All / Clear All row:** `var(--padding-padding-8)` vertical / `var(--padding-padding-16)` left / **`0` right**; `justify-content: space-between` (Figma `44360:179347`). Bottom border `var(--border-width-border-default)` solid `var(--color-border-accessible)`. **Clear All** is right-aligned; row has no right padding — the button supplies `var(--padding-padding-16)` horizontal inset.
  - Checkbox: `16×16`, `var(--corner-radius-radius-2)` corners, border `var(--color-border-accessible)`. Delegate to `components/ids/checkbox/design-spec.md`.
  - "Select All" label: Body 2 Regular (`font-weight: 400`), `var(--color-text-neutral)`.
  - "Clear All" action: Body 2 Regular (`font-weight: 400`), `var(--color-text-brand-strong)` (enabled) / `var(--color-text-disabled)` (disabled when nothing selected). Padding `var(--padding-padding-2)` vertical / `var(--padding-padding-16)` horizontal.
- **Option list:** scrollable, sample height `366px`, no bottom padding. Custom scrollbar (Figma decorative — use platform scrollbar).
- **Option row:** `var(--padding-padding-10)` vertical / `var(--padding-padding-16)` horizontal, `var(--spacing-space-8)` gap between checkbox and label, min-height `40px`. Checkbox `16×16` per `components/ids/checkbox/design-spec.md`. Label: Body 2 Regular (`font-weight: 400`), `var(--color-text-neutral)`, overflow ellipsis.

#### States (option row)

| State | Background | Border | Text |
|---|---|---|---|
| default | `var(--color-background-component)` | none | `var(--color-text-neutral)` |
| hover | `var(--color-background-brand-lighter)` | inset `0 ±1px var(--color-border-brand-neutral)` | `var(--color-text-neutral)` |
| press | `var(--color-background-brand-light)` | inset `0 ±1px var(--color-border-brand-neutral)` | `var(--color-text-brand-strong)` |
| selected (multi) | `var(--color-background-component)` + checked checkbox | none | `var(--color-text-neutral)` |

#### Behavior

- Search filters visible options without mutating source data.
- Select All toggles all currently visible (filtered) options.
- Clear All deselects all currently visible options.
- Individual checkboxes toggle per-option selection.
- `filterActive` when selected count < total option count (i.e. not all selected).

#### Filter model

- `options: { value: string; label: string }[]` — **user-defined** (product supplies the option list per column; Figma shows sample `"Option 1"…"Option N"` as placeholders only)
- `selectedValues: string[]`
- `searchQuery: string`
- `filterActive` when `selectedValues.length < options.length`

---

### Filter type: Combobox-SingleSelect (`Single-select + Search`, `44360:179074`)

Single-select combobox filter with search and scrollable option list (text-only rows, no radio or checkbox controls). Tokens and interaction states follow **`components/ids/dropdown-combo-box/design-spec.md`** (`mode: combobox-single`).

**Figma:** `44360:179074` (Dropdown Menu within `44360:179070`)

#### Anatomy

1. `SearchRow` — bordered search field (identical to Combobox-Multiselect search)
2. `OptionList` — scrollable plain-text option rows

No Select All / Clear All row (single-select has no batch action).

#### Layout

- **Container width:** `269px` (`FilterPanel` `min-width` / `max-width`).
- **Container:** `var(--color-background-component)` background, `var(--border-width-border-default)` solid `var(--color-border-accessible)` border, `var(--padding-padding-1)` horizontal padding, Shadow 4 elevation, `overflow: clip`. Sample width `269px`; min-width `186px`, max-width `700px`, min-height `212px`.
- **Search row:** identical to Combobox-Multiselect — `var(--padding-padding-8)` wrapper, bordered inner field with **no border-radius** (sharp corners per Figma `Search-Main`), search icon `search-16` (`16×16`, `var(--color-icon-brand-base)`), text input `font-weight: 400`. **Dismiss button** (conditional, when `searchQuery` non-empty): icon slug `ctrl-close-16`, rendered `12×12`, `all: unset`, color `var(--color-icon-neutral)`, cursor pointer.
- **Option list:** scrollable, sample height `406px`, no bottom padding.
- **Option row:** `var(--padding-padding-10)` vertical, `var(--padding-padding-16)` left / `var(--padding-padding-24)` right padding, `var(--spacing-space-8)` gap. Min-height `40px`. Label: Body 2 Regular (`font-weight: 400`), `var(--color-text-neutral)`, overflow ellipsis.

#### States (option row)

| State | Background | Border | Text |
|---|---|---|---|
| default | `var(--color-background-component)` | none | `var(--color-text-neutral)` |
| hover | `var(--color-background-brand-lighter)` | inset `0 ±1px var(--color-border-brand-neutral)` | `var(--color-text-neutral)` |
| press | `var(--color-background-brand-light)` | inset `0 ±1px var(--color-border-brand-neutral)` | `var(--color-text-brand-strong)` |
| selected | `var(--color-background-brand-lighter)` | inset `0 ±1px var(--color-border-brand-neutral)` | `var(--color-text-brand-strong)` |

#### Behavior

- Search filters visible options without mutating source data.
- Selecting an option sets exactly one selected value (replaces any previous selection).
- Selecting an already-selected option is a no-op (remains selected).
- After selection, the panel may close or remain open depending on product configuration.
- `filterActive` when a non-default value is selected.

#### Filter model

- `options: { value: string; label: string }[]` — **user-defined** (product supplies the option list per column; Figma shows sample `"Option 1"…"Option N"` as placeholders only)
- `selectedValue: string | null`
- `searchQuery: string`
- `filterActive` when `selectedValue` is non-null

#### Accessibility

- Option list exposes `role="listbox"`; each option exposes `role="option"` with `aria-selected`.
- Search input has `aria-label` describing its purpose.
- Keyboard: `ArrowUp`/`ArrowDown` navigates options, `Enter` commits selection.

---

### Filter type: Dropdown-SingleSelect (`Single-select`, `44360:179201`)

Simple single-select filter with a scrollable plain-text option list — no search row. Structurally identical to Combobox-SingleSelect minus the `SearchRow`. Codegen must delegate option row tokens and interaction states to **`components/ids/dropdown-single-select/design-spec.md`**.

**Figma:** `44360:179201` (Dropdown Menu within `44360:179197`; uses `.Dropdown-SingleSelect-Elements-Options`)

#### Anatomy

1. `OptionList` — scrollable plain-text option rows (direct child of `FilterPanelBody`)

No search row. No Select All / Clear All row. Single-select semantics.

#### Layout

- **Container:** `var(--color-background-component)` background, `var(--border-width-border-default)` solid `var(--color-border-accessible)` border, Shadow 1 elevation, `overflow: clip`. Sample width `269px`; runtime: content-driven within L-frame `max-width`.
- **Options wrapper:** `var(--padding-padding-1)` horizontal padding.
- **Option row** (`.Dropdown-SingleSelect-Elements-Options`): `var(--padding-padding-10)` vertical, `var(--padding-padding-16)` left / `var(--padding-padding-24)` right, `var(--spacing-space-8)` gap. Label: Body 2 Regular (`font-weight: 400`), `var(--color-text-neutral)`, overflow ellipsis.

#### States (option row)

Delegate to **`components/ids/dropdown-single-select/design-spec.md`** States tables:

| State | Background | Border | Text |
|---|---|---|---|
| default | `var(--color-background-component)` | none | `var(--color-text-neutral)` |
| hover | `var(--color-background-controls-brand-lighter)` | brand emphasis rows | `var(--color-text-neutral)` |
| selected | brand-lighter or tokenized selected row style | tokenized | `var(--color-text-brand-strong)` |
| disabled | `var(--color-background-gray-lighter)` | `var(--color-border-disabled)` | `var(--color-text-disabled)` |

#### Behavior

- Clicking an option sets exactly one selected value (replaces previous).
- `filterActive` when a non-default value is selected.
- Options are **user-defined** (product supplies the option list per column).

#### Filter model

- `options: { value: string; label: string }[]` — **user-defined**
- `selectedValue: string | null`
- `filterActive` when `selectedValue` is non-null

#### Codegen note

Implementations must use the IDS Dropdown Single-Select component (`components/ids/dropdown-single-select/design-spec.md`) for option row rendering, tokens, and interaction states — not custom markup.

---

### Filter type: Dropdown-MultiSelect (`Multi-select`, `44360:179348`)

Multiselect filter with Select All / Clear All row and scrollable checkbox option list — no search row. Structurally identical to Combobox-Multiselect minus the `SearchRow`. Codegen must delegate checkbox rendering to **`components/ids/checkbox/design-spec.md`** and option row patterns to IDS dropdown multi-select conventions.

**Figma:** `44360:179348` (Dropdown Menu within `44360:179344`; uses `.Dropdown-Elements-MultiSelect-Options`)

#### Anatomy

1. `SelectAllClearAllRow` — checkbox + label left, Clear All action right, bottom border divider
2. `OptionList` — scrollable checkbox option rows

No search row.

#### Layout

- **Container:** `var(--color-background-component)` background, `var(--border-width-border-default)` solid `var(--color-border-accessible)` border, `var(--padding-padding-1)` horizontal padding, Shadow 1 elevation, `overflow: clip`. Sample width `269px`.
- **Select All / Clear All row:** `var(--padding-padding-8)` vertical / `var(--padding-padding-16)` left / **`0` right**; `justify-content: space-between` (Figma `44360:179347` / `44360:179348`). Bottom border `var(--border-width-border-default)` solid `var(--color-border-accessible)`.
  - Checkbox: `16×16`, `var(--corner-radius-radius-2)` corners, border `var(--color-border-accessible)`. Delegate to `components/ids/checkbox/design-spec.md`.
  - "Select All" label: Body 2 Regular (`font-weight: 400`), `var(--color-text-neutral)`.
  - "Clear All" action: Body 2 Regular (`font-weight: 400`), `var(--color-text-brand-strong)` (enabled) / `var(--color-text-disabled)` (disabled when nothing selected). Padding `var(--padding-padding-2)` vertical / `var(--padding-padding-16)` horizontal; pinned to the **right** edge of the row.
- **Option row** (`.Dropdown-Elements-MultiSelect-Options`): `var(--padding-padding-10)` vertical / `var(--padding-padding-16)` horizontal, `var(--spacing-space-8)` gap between checkbox and label, min-height `40px`. Checkbox `16×16` per `components/ids/checkbox/design-spec.md`. Label: Body 2 Regular (`font-weight: 400`), `var(--color-text-neutral)`, overflow ellipsis, `white-space: nowrap`.

#### States (option row)

| State | Background | Border | Text |
|---|---|---|---|
| default | `var(--color-background-component)` | none | `var(--color-text-neutral)` |
| hover | `var(--color-background-brand-lighter)` | inset `0 ±1px var(--color-border-brand-neutral)` | `var(--color-text-neutral)` |
| press | `var(--color-background-brand-light)` | inset `0 ±1px var(--color-border-brand-neutral)` | `var(--color-text-brand-strong)` |
| selected (multi) | `var(--color-background-component)` + checked checkbox | none | `var(--color-text-neutral)` |

#### Behavior

- Select All toggles all options.
- Clear All deselects all options.
- Individual checkboxes toggle per-option selection.
- `filterActive` when selected count < total option count.
- Options are **user-defined** (product supplies the option list per column).

#### Filter model

- `options: { value: string; label: string }[]` — **user-defined**
- `selectedValues: string[]`
- `filterActive` when `selectedValues.length < options.length`

#### Codegen note

Implementations must use the IDS Checkbox component (`components/ids/checkbox/design-spec.md`) for option row checkboxes. Option row layout and tokens follow IDS dropdown multi-select conventions.

---

### Filter type: Numeric (`.Filter-Element-NumericFilter`, `44360:182265`)

Operator-based numeric filter with radio group, value field(s), and optional unit dropdown. Uses IDS Radio Button and TextBox spec tokens.

**Figma:** `44360:182265` (within `44386:290322`)

#### Anatomy

1. `OperatorRadioGroup` — vertical list of operator radio rows
2. `ValueBlock` — conditional value input(s) shown when operator requires a value
3. optional `UnitDropdown` — single-select dropdown beside each value field

#### Layout

- **Panel width:** `300px` minimum sample; content-driven within L-frame `max-width` rules.
- **Operator rows** (`.DataGrid-Elements-Filter-Numeric`, `44367:182693`): `padding: var(--padding-padding-8) var(--padding-padding-8) var(--padding-padding-8) var(--padding-padding-16)`, `gap: var(--spacing-space-8)` between `16×16` radio and label, `cursor: pointer`. Label: Body 2 Regular (`font-weight: 400`), `var(--color-text-neutral)`.
- **Operator row states:**
  - **hover:** background `var(--color-background-controls-brand-lighter)`, inset top/bottom `1px` `var(--color-border-brand-base)`.
  - **focus (keyboard only):** `outline: 2px solid var(--color-border-brand-base); outline-offset: -2px` on the row.
  - **disabled:** radio border `var(--color-border-disabled)`, background `var(--color-background-disabled)`, dot `var(--color-icon-disabled)`, label `var(--color-text-disabled)`, cursor `not-allowed`.
- **Operators** (single-select radio group, labels from Figma):
  1. `All` — no value inputs; clears numeric constraint.
  2. `Equals` / `Does not equal` / `Greater than` / `Greater than equal to` / `Less than` / `Less than equal to` — show one value block: `padding-left: 40px`, `padding-right: var(--padding-padding-16)`, `padding-bottom: var(--padding-padding-8)`, gap `16px` between rows.
     - **Text field:** height `40px`, border `var(--border-width-border-default)` solid `var(--color-border-accessible)`, horizontal padding `var(--padding-padding-16)`, vertical padding `var(--padding-padding-8)`, `font-weight: 400`. Width: `242px` sample, flex `1` when unit dropdown present. Delegate states to `components/ids/text-box/design-spec.md`.
     - **Value + helper group:** when unit dropdown present, wrap text field and helper text in a vertical flex group (`gap: var(--spacing-space-4)`) that takes `flex: 1` alongside the unit dropdown. Helper text belongs to the value field group, not to the entire row.
     - **Helper text:** Body 2 Regular (`font-weight: 400`), `var(--color-text-neutral)`, value `"Numeric value"`.
  3. `Between` — two value blocks with helpers `"Starting value"` and `"Ending value"` (Figma `44370:145919` / `44370:145922`), gap `16px` between rows.
- **Value + Unit row** (when `unitOptions` provided): flex row, `gap: 16px`, both children `flex: 1 1 0`. Text field (with helper) and unit dropdown share the `242px` container width equally. The unit dropdown is a sibling of the value+helper group, not of the text field alone.
- **Unit dropdown (optional):** delegate to `components/ids/dropdown-single-select/design-spec.md` — field height `40px` (Large), padding `var(--padding-padding-10)` vertical / `var(--padding-padding-16)` horizontal, border/background/text tokens per that spec. Caret icon `arrow-drop-tri-caret`. Placeholder `"-Select-"`.

#### Delegated specs

- **Radio control:** `components/ids/radio-button/design-spec.md` — `16×16` control, dot `var(--color-icon-brand-base)`, selected border `var(--color-border-brand-base)`, hover border `var(--color-border-strong)`, focus-visible ring `1px var(--color-border-brand-base)` offset `2px`.
- **Text field:** `components/ids/text-box/design-spec.md` — hover `var(--color-border-strong)`, focus `var(--color-border-brand-base)`, focus-visible outer ring `var(--color-border-brand-base)` offset `4px` with `border-radius: 4px`.
- **Unit dropdown:** `components/ids/dropdown-single-select/design-spec.md` — all trigger and popup token contracts per that spec.

#### Filter model

- `operator`: `all` | `equals` | `not-equals` | `greater-than` | `greater-than-equal` | `less-than` | `less-than-equal` | `between`
- `value?: string`, `valueEnd?: string` (for `between`)
- `unit?: string`, `unitEnd?: string` (optional; when `unitOptions` provided)
- Header **`filterActive` / `numericFilterState`:** **`false`** when `operator === 'all'` (outline filter icon); **`true`** when another operator is selected and required value(s) are non-empty. Selecting **All** resets the model to default.

#### Figma proof nodes

- `44360:182266` (`Filter by=All`)
- `44367:182637` (`Equals` + value)
- `44370:145919` (`Between` + range)

---

### Filter type: Date and Time (`.Filter-Element-DateAndTimeFilter`, `44360:181306`)

Preset-based date-time filter — extends **Date** filter (`37822:90838`) with **TimePicker** fields and time-inclusive summaries. Same preset radio matrix; label **Custom date and time range** and **Start Date:** / **End Date:** copy.

**Figma:** `44360:181306` (`Column Filter-Main` **`Type=Date and Time`**, `44360:182218`; library page **`44370:173173`**)

#### Anatomy

1. `PresetRadioGroup` — vertical list of preset radio rows (`.DataGrid-Elements-Filter-DateAndTimeItem`, `37822:90943`)
2. `PresetSummary` — optional right-aligned summary text on the same row as the selected preset (`All` and relative presets; not shown for `specific-date` or `custom-range`)
3. `SpecificDateBlock` — when **Specific date** selected: one row with **Date:** + **Time (optional):** pickers
4. `CustomRangeBlock` — when **Custom date and time range** selected: two rows (**Start Date** + **Time (optional)**, **End Date** + **Time (optional)**)

#### Layout

- **Inner panel (`44360:181713` / `Multi-select Droddown`):** **`480px`** sample width (L-frame **`FilterPanel`** `min-width` / `max-width` **480px** for date-time columns); **`padding: var(--padding-padding-8) var(--padding-padding-1)`** on **`FilterPanelBody` slot** (not extra Storybook body padding); **`overflow: clip`**; full **`1px`** **`var(--color-border-accessible)`** on panel host + **Shadow 1** on L-frame shell (see L-frame baseline). Preset summaries and labels: **no ellipsis** — single line, panel width accommodates copy.
- **Preset rows** (`.DataGrid-Elements-Filter-DateAndTimeItem`, `37822:90943`): `padding: var(--padding-padding-8) var(--padding-padding-8) var(--padding-padding-8) var(--padding-padding-16)`, `justify-content: space-between`, `align-items: center`, `cursor: pointer`. Left cluster: `16×16` radio + label, `gap: var(--spacing-space-8)`. Label: Body 2 Regular (`font-weight: 400`), `var(--color-text-neutral)`.
- **Preset row states:**
  - **hover:** background `var(--color-background-controls-brand-lighter)`, inset top/bottom `1px` `var(--color-border-brand-base)`.
  - **focus (keyboard only):** `outline: 2px solid var(--color-border-brand-base); outline-offset: -2px` on the row. No focus ring on the radio root when row-level focus is present.
  - **disabled:** radio border `var(--color-border-disabled)`, radio background `var(--color-background-disabled)`, dot `var(--color-icon-disabled)`, label color `var(--color-text-disabled)`, cursor `not-allowed`.
- **Preset summary** (right column, visible when preset selected and not in expanded-only modes): Body 3 Regular — `font-size: var(--font-size-body-3)` / `12px`, `line-height: 18px`, `font-weight: 400`, `var(--color-text-neutral)`, **single line, no ellipsis** (panel width expands).
- **Expanded blocks** (**Specific date** / **Custom range**): `padding-left: 40px`, `padding-right: var(--padding-padding-16)`, `padding-bottom: var(--padding-padding-8)`, vertical `gap: var(--spacing-space-16)` between rows.
- **Date + Time row:** horizontal flex, `gap: var(--spacing-space-16)`, `align-items: flex-start`. Date field `flex: 1` (`min-width: 0`). Time field fixed **`177px`** width sample (Figma `TimePicker-Main` in filter context).
- **Presets** (single-select radio group, labels from Figma):
  1. `All` — summary sample `Jan 12 2020 - Now` (product may bind column min/max or app epoch).
  2. `Last 24 hours` — summary shows computed start/end with time (sample `Jan 12, 09:00 AM - Jan 13, 9:00 AM`).
  3. `Last week` / `Last month` / `Last year` — summary shows computed date range endpoints.
  4. `Specific date` — expands **Date:** (`DatePicker-Main`) + **Time (optional):** (`TimePicker-Main`); date alone is sufficient for `filterActive`; no right summary on the preset row while expanded.
  5. `Custom date and time range` — expands two date-time rows: **Start Date:** + **Time (optional):**, **End Date:** + **Time (optional):**; at least one date required for `filterActive`.

#### Delegated specs

- **Radio control:** `components/ids/radio-button/design-spec.md` — same contracts as numeric filter (`16×16`, brand dot). **Focus ring:** keyboard (`:focus-visible`) only; pointer selection must not show focus outline.
- **Date field:** `components/ids/date-picker/design-spec.md` — `40px` field height, `calendar-simple-16`, format hint `MM-DD-YYYY`.
- **Time field:** `components/ids/time-picker/design-spec.md` — `40px` field height, `time-clock-16`, format hint `HH:MM AM/PM`, 12h clock in filter context.

#### Filter model

- `mode`: `all` | `last-24-hours` | `last-week` | `last-month` | `last-year` | `specific-date` | `custom-range`
- `specificDate?: Date | null`, `specificTime?: string | null` (optional 12h display string)
- `rangeStartDate?`, `rangeStartTime?`, `rangeEndDate?`, `rangeEndTime?` (custom range; times optional)
- Header **`filterActive` / `dateTimeFilterState`:** **`false`** when `mode === 'all'` (outline filter icon); **`true`** for relative presets or when specific/custom dates are set. Selecting **All** resets the model to default.

#### Figma proof nodes

- `44360:181307` (`Filter by=All`)
- `44360:181320` (`Last 24 hours`)
- `44360:181333` (`Last week`)
- `44360:181346` (`Last month`)
- `44360:181359` (`Last year`)
- `44360:181372` (`Specific date` + pickers)
- `44360:181390` (`Custom date and time range` + start/end pickers)
- `37822:90943` (`.DataGrid-Elements-Filter-DateAndTimeItem` row component)
- `44360:181713` (inner preset list / `Multi-select Droddown`, Last 24 hours — Shadow 1 + **480px** chrome)

### Behavior & accessibility
- Open/close on **`FilterToggle`**; **Escape** and **pointer down outside** dismiss (when implemented).
- **`aria-expanded`**, **`aria-haspopup="dialog"`** on **`FilterToggle`**; dialog **`aria-label`** from column title. Optional **`data-filter-active`** when **`filterActive`** is useful for tests.
## Layout & Measurements
- Header height: `48px` (`Grid height/Header` / Figma **Standard Density** `48` on **`37721:114663`**).
- **Column header (Figma `.Column Header`, `37721:114663`):**
  - **Variant axes:** `type` (`Text` | `Selection` | `Column Customization`), **`colorAndBorder`** (`false` | `true`).
  - **Text column header layout** (Figma `Type=Text` on **37721:114663**, with inner **37721:114673** + filter **37721:114677**):
    - **Host row (`DatagridColumnHeaderContent`):** horizontal flex, **`align-items: center`**, **`padding-left: 16px`**, **`padding-top` / `padding-bottom: 0`** on the host (do **not** stack **`py-[5px]`** on the host **and** **`py-[9px]`** on the title row — that inflates the header past **`48px`**). **Total header cell height is `48px`** (Figma **`Grid height/Header`**).
    - **Title row (`37721:114673`):** **`flex: 1`**, **`min-width: 0`**, horizontal flex, **`gap: 12px`**, **`align-items: center`**, **`padding: 0 8px 0 0`** — **8px** right padding, **no** left padding on this frame (**`16px`** inset is the host **`padding-left`**). **Vertically center** title + sort in the **48px** header (avoids icons riding high vs. a padded-only inner band). Title text uses **20px** line box (**`Body 2 - Medium`**, **14/20**, weight **500**).
    - **Column title text (`37721:114675`):** **`Body 2 - Medium`** — **`14px`** / **`20px`** line height, **`font-weight: 500`**, color **`var(--color-text-neutral-strong)`**, ellipsis + single line.
    - **Sort icon (Figma `.Sort for table`, `37721:114646`):** use the shared **`Icon`** with **`shapeName`** **`col-sort-up-16`** / **`col-sort-down-16`**. Rendered size **12×12** — the icon button wrapper must also be **`12×12`** (no extra padding/margin that inflates the hit target). Carry a **`data-sorted`** attribute on the button when sorted so CSS selectors can target the active state. **Visual states:** Default → **`var(--color-icon-neutral)`**; Hover → **`var(--color-icon-neutral-strong)`**; Selected (sorted) → **`var(--color-icon-brand-base)`**; Selected+Hover → **`var(--color-icon-brand-stronger)`**. **Visibility:** always visible (product decision — Figma shows hide-on-default but implementation keeps icon always shown).
    - **Filter icon:** use **`Icon`** with **`shapeName`** **`filter`** / **`filter-solid`** (**`assets/icons/filter.svg`**, **`assets/icons/filter-solid.svg`**) — **14×14** inside **`38×38`** control per **`37721:114635`** / **`37721:114677`**; cross-check the **Icons** / **Header Styling** area on the library page (e.g. annotation frame **`44551:229021`**) when auditing against Figma.
    - **Filter (`.Filter for table`, `37721:114677`):** **`shrink-0`**, **`38×38`** outer frame, **`padding: 12px`** on the interactive wrapper (Figma `p-[12px]`), **`14×14`** icon viewport; **default** icon color **`var(--color-icon-neutral)`** (variable binding on default state). State/icon mapping for hover/selected/press remains from **`37721:114635`**.
  - **`colorAndBorder=false` (minimal):** header cell fill **`var(--color-background-component)`**; **no** full-cell **top/bottom** rules on the default Text path in Figma; **leading column separator** only on **data** column headers: **1px** wide **`var(--color-border-light)`**, **24px** tall, **`top: 50%`**, **`transform: translateY(-50%)`**, **`left: 0`** (Figma vertical rail).
  - **`colorAndBorder=true` (styled band):** header cell fill **`var(--color-background-gray-neutral-lighter)`**; **top** and **bottom** rules **`1px`** **`var(--color-border-light)`** across the cell; same **leading** **1px × 24px** centered **`var(--color-border-light)`** rail on data column headers.
  - **`Selection` / `Column Customization` with `colorAndBorder=true`:** nested **`.Header: Styling`** in Figma uses **`var(--color-background-gray-neutral-lighter)`** with **top** + **bottom** **`var(--color-border-light)`** and **leading** **1px** **24px** rail; Selection + styled also shows a **full-height** **1px** trailing edge rule in the export (`37721:114685`) — implementations may mirror for pixel parity with checkbox/settings headers.
- **Header affordance icon sizes:** **`SortToggle`** **`Icon`** **12×12** (Figma **`.Sort for table`**); **`FilterToggle`** **14×14** inside **`38×38`** padded control (Figma **`37721:114677`** / **`37721:114635`**); **`settings-gear`** **`Icon`** **16×16** (Figma / product alignment).
- Row height baseline: **`40px`** — Figma variable **`Grid height/Cell`** (numeric `40`). **`components/ids-theme.css`** does not currently emit **`--grid-height-cell`**; implementations should use **`40px`** until a theme sync adds that alias.
- **Row / cell body chrome (Figma `.Row/Cell: States and styling`, `37721:114580`):**
  - **Purpose:** Defines **full-row background**, **bottom separator**, and optional **left selection accent** for body rows (read-only vs interactive tables share the same geometry; hover differs by state).
  - **Figma variant axes:**
    - **`states`:** `Default` | `Hover` | `Selected` | `Selected and Press` | `Hover on read only table`
    - **`verticalBlueLine`:** `true` | `false` — when **`true`**, **Selected** and **Selected and Press** show a **leading vertical bar**; other states do **not** show the bar.
    - **`background`:** `true` | `false` — when **`true`** in **Default**, row uses **`var(--color-background-component)`** fill; when **`false`**, skip that base fill layer (rare; use only when spec’d by product).
    - **`showBorder`:** `true` | `false` — when **`true`**, draw **1px** bottom rule **`var(--color-border-light)`** across the row width.
  - **Sample frame size:** `348×40` in Figma; **runtime width** is container-driven (`width: 100%`, `box-sizing: border-box`).
  - **Layer model (bottom → top):**
    1. **Default:** full-area fill **`var(--color-background-component)`** when `background=true` / `rowBackgroundLayer` is on (Figma bound token).
    2. **Non-default states** (`Hover`, `Selected`, `Selected and Press`, `Hover on read only table`): full-bleed **overlay** `absolute; inset: 0` **above** the default fill (stack order must match Figma so borders/indicators sit correctly).
    3. **Bottom border** (when `showBorder=true`): **`1px`** tall, **`var(--color-border-light)`**, pinned to **`bottom: 0`**, **`left: 0`**, **`right: 0`** (row divider).
    4. **Vertical selection accent** (when `verticalBlueLine=true` **and** `states` ∈ {`Selected`, `Selected and Press`}): **`4px`** wide bar, **`var(--color-border-brand-base)`**, **`left: 0`**, **`top: 0`**, **`bottom: 0`** (full row height), sits **above** row fill (Figma node name **“Vertical line”**).
  - **HTML/CSS implementation note:** With **`border-collapse: collapse`**, **`background` on `<tr>` is unreliable** across browsers. Apply the **default** row fill **`var(--color-background-component)`** on **each body cell** (`<td>` / `DatagridCell`), not only on the row host, so the default state matches Figma; hover/selected overlays likewise apply per-cell (or an equivalent full-row paint that does not depend on `<tr>` background alone).
  - **Auto-layout note:** Figma dev export wraps overlays in **`flex-direction: column`** with **`gap: 10px`** between internal slots; preserve **visual** stacking (fill → overlay → rules → accent). Do **not** replace semantic row height with the gap value.
  - minimum data column width: `90px` (includes optional sort/filter affordances when present).
  - settings column width: `40px` fixed.
  - row-selection column width follows the IDS selection-column pattern (`48px` sample family).
  - **Selection column (`37721:114682` header variant, `37721:113988` grid column):**
    - **Column width:** **`48px`** (`<colgroup>` only; Figma `37721:113988` width **48**).
    - **Header (`37721:114682`, `colorAndBorder=true`, `type=Selection`):** **`48px`** total column width; **`padding: 16px`** horizontal + **`padding-block: var(--selection-header, 16px)`**; centered **16×16** control host:
      - **`selectionMode: multiple`:** **select-all** IDS Checkbox (`8505:14304` in Figma); **`aria-label`** e.g. “Select all rows on this page”; **checked** when every row on the **current page** is selected; **indeterminate** when some but not all page rows are selected (per `components/ids/checkbox/design-spec.md` indeterminate → checked rule).
      - **`selectionMode: single`:** **empty** header chrome (`aria-label="Selection"`); no select-all.
    - **Body cell (`37721:113988` `.Cell Item`):** **`48px`** wide, **`40px`** row height, **`padding: 12px 16px`**, centered **16×16** **radio** (single) or **checkbox** (multiple) — **no** leading full-height edge on the selection column in Storybook parity.
  - **Settings column (`37721:114686` header variant, `37721:113997` / `37721:114944` grid column):**
    - **Column width:** **`40px`** (`<colgroup>` only; Figma **`37721:113997`** *Padding* slot width **40**, **`37721:114887`**).
    - **Header (`37721:114686` / `37721:114945`, `type=Column Customization`):** **`40px`** total column width; host height **`48px`**; **`padding-block: var(--selection-header, 16px)`**; **16×16** **`settings-gear`** (`37721:114688`) centered horizontally; same **`.Header: Styling`** top/bottom fill — **no** leading **`::before`** rail on this column.
    - **Body (`37721:114944`):** **`40px`** wide × **`40px`** row height, **`padding-block: 12px`**, no icon; bottom **`var(--color-border-light)`** rule per row chrome.
  - **Chrome width rule:** **`48px`** / **`40px`** on **`<colgroup>`**, matching **`th`/`td`**, and inner hosts — **16×16** controls only so **`16 + 16 + 16 = 48`** (header) fits in the selection column.
- Horizontal scrolling:
  - scrollable region: data columns between leading pinned columns and trailing settings column.
  - non-scrollable pinned regions:
    - selection column (when present)
    - settings column (always)
    - optional freeze range (`freezeUntilColumnKey`, inclusive)
- **Viewport / scroll behavior (implementation):**
  - **Header stays stable:** the header row must **not** scroll away with body rows. Storybook uses a **split scroll model**: **`.headerBand`** (non-scrolling, `flex: 0 0 auto`) + **`.bodyViewport`** (`overflow-y: auto` — vertical scrollbar on body only). Horizontal scroll on the body syncs to hidden header tracks via `scrollLeft`. Alternative: **`position: sticky; top: 0`** on header cells inside a single scrollport (not used when split regions are active).
  - **Body fills container height:** **`.gridScrollHost`** is **`flex: 1`** inside the shell; **`.bodyViewport`** / split panes use **`min-height: 100%`** so the body area occupies all space between header and footer even when row count is low. **Horizontal scrollbar** anchors to the **bottom of the body viewport** (above pagination), not immediately under the last row.
  - **Footer / pagination** (when shown): keep outside the vertical scroll clip of the row stack so it remains visible, or pin it below the scroll region in the same shell as Figma’s grid chrome.
- **Height contract (container-driven, Figma `37721:112482`):**
  - The datagrid **fills its parent container** (`height: 100%`, flex child with `min-height: 0`, or equivalent). **Overall height does not grow with row count** — extra rows scroll inside the allotted body area. Figma’s **Data Grid - Main** matrix (`**37721:112482**`) expresses density as “# rows in view” **within a fixed frame**, not an infinitely tall table.
  - Storybook / demos: wrap the grid in a **bounded-height** parent (e.g. flex layout with `flex: 1; min-height: 0`) so `overflow: auto` on the body viewport has a definite clip rect.
- **`colgroup` / table width vs. side “gaps” (implementation note):**
  - A **`colgroup`** with fixed-width `<col>` plus auto-width `<col>` entries **does not** by itself create empty **left/right gutters** inside the table; with **`table-layout: fixed`** and **`width: 100%`**, remaining width is distributed across unspecified columns.
  - **Avoid `display: flex` (or other non-`table-cell` displays) directly on `<th>` / `<td>`** for layout hacks — that **breaks the table formatting context** in browsers and commonly produces **unfilled horizontal space** (white bands) at one or both edges. Keep cells as **`display: table-cell`**; put flex/grid **inside** a wrapper `div` in the cell for icon alignment.
  - **Header/body column alignment:** all `<th>` / `<td>` use **`box-sizing: border-box`**. Data body cells use Figma **`.Cell Item`** padding **`10px 12px 10px 16px`**; **settings** body cells use **`padding: 0`** (**`40px`** column). Column widths are owned by **`<colgroup>`** only — do not set conflicting `width` / `max-width` on individual data cells.
  - Use **`width: 100%`**, **`border-collapse: collapse`**, and **`border-spacing: 0`** on the `<table>` so the grid spans the scroll viewport edge-to-edge unless product padding intentionally insets it.
  - **Full-width vs. horizontal scroll contract (Figma `37721:113987` *Rows and Columns*):**
    - Column stack is **selection (optional `48px`) → data columns → settings (`40px` / Figma *Padding* slot)** — **no empty spacer column** between data and settings.
    - Set table **`min-width`** to the sum of **pinned + data column widths** (selection **`48px`** when `rowSelection`, each data column at least **`90px`** or its declared/default width, settings **`40px`**).
    - When the viewport is **wider** than `min-width`, the table is **`width: 100%`** and the **last data column** (trailing column before settings) **absorbs** the extra width so headers/body stay aligned edge-to-edge.
    - When the viewport is **narrower**, **`.tableViewport`** shows a **horizontal scrollbar**; **selection** (when present) and **settings** use **`position: sticky`** (`left: 0` / `right: 0`) so they remain visible while data columns scroll.
- Column title overflow (`ColumnTitle` in header):
  - **Primary rule:** title string **truncates with ellipsis** when the column is narrower than the text + reserved affordances (sort, filter, trailing divider). Apply **`min-width: 0`** on flex children in the title row so ellipsis can engage under **`flex` / `table-layout: fixed`**.
  - **Affordances do not shrink:** sort (**12×12** icon + hit target) and filter (**38×38** control) keep their sizes; **flex-shrink: 0** on those controls. Shrink comes from the **title** slot first.
  - **Long unbroken strings / URLs:** same ellipsis behavior; if product requires full value access, add **`title` attribute** (native tooltip) and/or a **popover** on focus/hover that does not change the header cell layout width.
  - **Minimum column width (`90px`)** still applies: at the minimum width, title may truncate aggressively; verify **no overlap** with sort/filter icons (increase min width for wide header chrome if needed).
- Column boundary chrome (Figma): the **1px × 24px** **`var(--color-border-light)`** rail on the trailing edge of each data header (**decorative**).
- **Optional column resize (Storybook / product):** when enabled, add a **transparent** trailing-edge hit target (e.g. **~10px** wide) aligned with that rail, **`cursor: col-resize`**, pointer capture, clamp width to **`minWidth`** (default **`90px`**) and a product max (Storybook: **640px**). Emit **`onColumnResize`** with the final width. **Column reorder** drag must **not** start from sort, filter, or resize controls (use **`preventDefault`** on **`dragstart`** or isolate **`draggable`** to the title strip only).
- Column width cannot be reduced below min width (`90px`, or explicit per-column override via **`minWidth`** / resize clamp).
- Row content overflow:
  - when width reaches min and text still overflows, body cell values use ellipsis (example behavior: `Rowval...`).
- View modes:
  - `table` view
  - `treeview` view (hierarchical indent/expand behavior for tree columns)
### Table layout algorithm (codegen)

Implement **exactly** this sequence so header/body columns stay aligned (verified against Figma **`37721:113987`** and `IdsDataGrid.tsx`):

1. **Constants:** `SELECTION_COL_WIDTH = 48`, `SETTINGS_COL_WIDTH = 40`, `DEFAULT_MIN_WIDTH = 90`, optional resize max **`640px`** (product).
2. **Per-column base width:** `columnBaseWidthPx(col) = max(col.minWidth ?? 90, col.width ?? col.defaultWidth ?? 160)`; when `columnResizeEnabled`, use user-resized width clamped to `minWidth`.
3. **`growColumnKey`:** last entry in `orderedColumns` (trailing **data** column before settings). When **`freezeUntilColumnKey`** is set, use the last **scrollable** data column (first column after the freeze boundary), not the last column in the full ordered list.
4. **`tableMinWidthPx`:** `SELECTION? + sum(fixed column widths) + max(minWidth, grow column floor) + SETTINGS` (grow column counts only its **minimum** in the sum, not its expanded auto width).
5. **`fixedColumnsWidthPx`:** `SETTINGS` + `SELECTION?` + sum of **`columnWidthPx`** for every column except **`growColumnKey`** (used for **`tableMinWidthPx`** only).
6. **Grow column `<col>`:** **`width: auto`** (class **`.tableGrowCol`**) on **`growColumnKey`** — the **only** non-fixed column; it absorbs slack when **`table { width: 100% }`**. **Never** use **`width: 0`** on the grow col (browsers then **expand** fixed chrome **48**/**40** cols instead). **Never** put the grow column’s seeded resize width in `<colgroup>` unless the user finished a resize gesture (`growColPinnedWidthPx`). Chrome `<col>` + **`th`/`td`** use **`!important`** **48**/**40** to block stretch.
7. **`<colgroup>`:** explicit **`48px`** / **`40px`** on selection and settings; fixed **`Npx`** on other data columns; grow = **`auto`** (or explicit **`Npx`** after user resize).
8. **Chrome cells (`SelectionColumn`, `SettingsColumn`):** `<colgroup>` + matching **`th`/`td`** **`width` / `min-width` / `max-width`** (**`48px`** / **`40px`** only — same constants). Inner hosts use fixed column width + **`overflow: hidden`**. **No** leading **`::before`** divider on selection/settings chrome. **First data column** leading **1×24px** rail (`.headerDataCell::before`) applies **only when** the selection column is visible; when `showSingleSelectionRadio: false` or `rowSelection: off`, the leftmost data header is **first-child** and **must not** render that rail (CSS: `.headerDataCell:first-child::before { display: none }`). Selection controls **16×16** (radio or checkbox per `selectionMode`; header select-all when `multiple`).
9. **`<table>`:** `width: 100%`, `minWidth: tableMinWidthPx`, `table-layout: fixed`, `border-collapse: collapse`, `border-spacing: 0`.
10. **Data cell widths:** do **not** set `width` / `max-width` on individual **data** `<th>` / `<td>` — **`<colgroup>`** owns data column tracks.
11. **`box-sizing: border-box`** on **all** header/body cells; data body padding **`10px 12px 10px 16px`**; settings body **`padding-block: 12px`**, **`padding-inline: 0`**.
12. **Sticky pins:** when horizontal overflow — selection `left: 0`, settings `right: 0`, header corners also `top: 0` with higher `z-index`.
13. **Header title ellipsis:** title node `display: block` (not flex), `overflow: hidden`, `text-overflow: ellipsis`, `white-space: nowrap`; flex parents use `min-width: 0`; native `title` attribute for full string tooltip.

### Chrome columns & table slack (codegen-critical)

Generators **must** implement this block verbatim. It documents production bugs where inner content measured **48×48** / **16×16** but **`th`** stretched wider (gap before the first data divider).

#### Figma sources (live-verified)

| Slot | Grid column node | Header variant | Column track width |
|---|---|---|---|
| Selection (row radio) | **`37721:113988`** | **`37721:114682`** (empty header) | **48px** |
| Settings | **`37721:113997`** / **`37721:114944`** | **`37721:114686`** | **40px** (not 48 — component-set tile may show 48×48; grid *Padding* slot is **40**) |

#### Table slack invariant (`table-layout: fixed` + `width: 100%`)

When the table is **wider** than the sum of declared column widths, the browser must assign **extra horizontal space to exactly one column**:

| Rule | Requirement |
|---|---|
| **Slack column** | **`growColumnKey`** = last entry in `orderedColumns` (last **data** column, immediately before settings). |
| **`<col>` width** | **`width: auto`** on grow only (class **`.tableGrowCol`**). |
| **Forbidden** | **`width: 0`** on grow — browsers distribute slack into **fixed** columns, stretching selection (**48**) and settings (**40**) **`th`** cells while inner wrappers stay correct size. |
| **Forbidden** | Putting **every** column (including grow) at fixed **`Npx`** in `<colgroup>` when `columnResizeEnabled` seeds width state — leaves **no** slack column; same stretch bug. |
| **After user resize on grow** | Pin grow `<col>` to explicit **`Npx`** only after resize gesture completes (`growColPinnedWidthPx` / equivalent). Until then, grow stays **`auto`**. |

#### Chrome column width lock (selection **48px**, settings **40px**)

Apply **the same three layers** (values must match):

1. **`<colgroup>`:** `<col style={{ width: '48px' }} />` (selection), `<col style={{ width: '40px' }} />` (settings, always last).
2. **`th` / `td`:** `width`, `min-width`, `max-width` = **48** or **40** (use `!important` in CSS if the target stack allows).
3. **Inner host** (wrapper `motion.div` inside chrome cell): `width: 100%`, `max-width: 100%`, `box-sizing: border-box`, `overflow: hidden` — **do not** set inner host to fixed **48px** inside a wider **`th`** (causes visible gap before the first data-column divider).

**Data columns:** width **only** in `<colgroup>` (no `width` on data `th`/`td`).

#### Chrome header/body padding & controls (no assumptions)

**Selection column (`37721:114682` / `37721:113988`):**

| Part | Value |
|---|---|
| Header cell height | **48px** |
| Header padding | **`padding-block: var(--selection-header, 16px)`** + **`padding-inline: 16px`** |
| Header layout | flex row, `justify-content: center`, `align-items: center` |
| Header control (`single`) | **None** — empty chrome |
| Header control (`multiple`) | **16×16** select-all IDS Checkbox (`density="datagrid"`); indeterminate when partial page selection |
| Body row height | **40px** |
| Body padding | **`12px 16px`** (`var(--selection-cell, 12px)` vertical) |
| Body control (`single`) | **16×16** IDS Radio Button per row (`components/ids/radio-button/design-spec.md`) |
| Body control (`multiple`) | **16×16** IDS Checkbox per row (`components/ids/checkbox/design-spec.md`) |
| Leading chrome divider | **None** on selection column; **first data** header leading **1×24px** rail only when selection column is shown (omit when leftmost data column) |

**Settings (`37721:114686` / `37721:114945` / `37721:113997`):**

| Part | Value |
|---|---|
| Column track | **40px** |
| Header cell height | **48px** (row band; column track stays **40px**) |
| Header padding | **`padding-block: var(--selection-header, 16px)`**; icon centered horizontally in **40px** (**12px** inset each side of **16×16** icon) |
| Icon | **16×16** `settings-gear` (`Icon` + `shapeName`) |
| Body | **40px** row, **`padding-block: 12px`**, no icon |
| Leading chrome divider | **None** on settings column |

Theme tokens: **`--selection-header: 16px`**, **`--selection-cell: 12px`** (`components/ids-theme.css`).

#### `<colgroup>` order (must match `<thead>` / `<tbody>` cell order)

```
[SelectionColumn? 48px] → [DataColumn × N fixed Npx] → [GrowColumn auto] → [SettingsColumn 40px]
```

- **Settings** is always the **last** `<col>` / cell — **no** spacer column before it (Figma **`37721:113987`**).
- **Grow** is always **second-to-last** (last data column).

#### Reference pseudocode (`colWidthStyle`)

```ts
const SELECTION_COL_WIDTH = 48;
const SETTINGS_COL_WIDTH = 40;

function colWidthStyle(column: DatagridColumn, ctx: LayoutCtx): CSSProperties {
  if (column.key === ctx.growColumnKey) {
    if (ctx.growColPinnedWidthPx != null) return { width: `${ctx.growColPinnedWidthPx}px` };
    return { width: "auto" }; // sole slack column
  }
  return { width: `${ctx.columnWidthPx(column)}px` };
}

// colgroup:
// rowSelection ? <col width="48px" /> : null
// data cols → colWidthStyle (grow → auto unless pinned)
// <col width="40px" />  // settings always last
```

```ts
// When columnResizeEnabled: seed columnWidths for resize UI, but
// do NOT emit grow column width from seed in <colgroup> unless growColPinnedWidthPx.
```

#### Detail panel + scrollport

- When `withDetailPanel` / `detailsPanel: attached`, set **`scrollbar-gutter: auto`** on **`.tableViewport`** (not `stable`) so a reserved gutter does not appear as a white strip between settings and the **40px** detail rail.

#### Codegen anti-patterns (fail QA)

| Anti-pattern | Symptom |
|---|---|
| `width: 0` on grow `<col>` | Selection/settings **`th`** wider than **48**/**40**; gap before Name divider |
| Grow column fixed **`Npx`** in `<colgroup>` on first paint with `columnResizeEnabled` | Same stretch |
| Inner chrome host `width: 48px` while **`th`** is wider | Green DevTools box **48px** with white gap to divider |
| `::before` leading rail on selection/settings chrome | Extra left divider misaligned with Figma |
| **18×18** checkbox in selection column | Breaks **16+16+16=48** header math |
| Spacer `<col>` before settings | Forbidden by **`37721:113987`** |
## Tokens
- Background/surface:
  - `var(--color-background-component)`
  - `var(--color-background-surface-1)`
  - `var(--color-background-gray-neutral-lighter)`
  - `var(--color-background-brand-lighter)`
  - `var(--color-background-brand-light)`
- Border:
  - `var(--color-border-light)`
  - `var(--color-border-accessible)`
  - `var(--color-border-brand-base)`
- Text:
  - `var(--color-text-neutral-strong)`
  - `var(--color-text-neutral)`
  - `var(--color-text-brand-strong)`
  - `var(--color-text-link-brand-base)`
  - `var(--color-text-white)`
- Icon:
  - `var(--color-icon-neutral)`
  - `var(--color-icon-brand-base)`
  - `var(--color-icon-brand-stronger)`
  - `var(--color-icon-accessible)`
  - `var(--color-icon-disabled)`
- Column-freeze boundary bar (`37721:114144`, **`FreezePaneEdge`**):
  - **Width:** **`20px`**; **`flex-shrink: 0`**; **`align-self: stretch`** (full header+body height in Figma auto-layout; runtime: **`position: absolute`**, **`top: 0`**, **`bottom: 0`** on scroll host).
  - **`border-radius: 0`**
  - **Background (authoritative):** `linear-gradient(270deg, var(--color-gradient-overflow-vertical-end) 0%, var(--color-gradient-overflow-vertical-start) 63.46%, var(--color-gradient-overflow-vertical-start) 100%)`
  - **Tokens:** `var(--color-gradient-overflow-vertical-start)` (gray cast), `var(--color-gradient-overflow-vertical-end)` (fade to transparent at seam)
- Typography:
  - `Base Styles/Data Header` (`14/20`, medium)
  - `Body 2` (`14/20`, regular)
  - `Body 2 - Medium` (`14/20`, medium)
- Layout (Figma variables on row chrome `37721:114580`):
  - **`Grid height/Cell`** → row height **40** (use **`40px`** in IDS until **`--grid-height-cell`** is added to `components/ids-theme.css`).
## States (Light Theme)
| Slot | State | Background | Border | Text/Icon |
|---|---|---|---|---|
| `DatagridHeader` (data columns, `colorAndBorder=false`) | default | **`var(--color-background-component)`** | **no** full-cell top/bottom in Figma Text path; **leading** **1px × 24px** **`var(--color-border-light)`** rail **`left: 0`**, vertically centered | header text `var(--color-text-neutral-strong)` |
| `DatagridHeader` (data columns, `colorAndBorder=true`) | default | **`var(--color-background-gray-neutral-lighter)`** | **1px** **`var(--color-border-light)`** **top** + **bottom**; **leading** **1px × 24px** **`var(--color-border-light)`** rail | header text `var(--color-text-neutral-strong)` |
| `DatagridHeader` (Selection / settings, `colorAndBorder=true`) | default | **`var(--color-background-gray-neutral-lighter)`** (nested chrome per Figma) | **top** + **bottom** **`var(--color-border-light)`**; inner rails per **`37721:114663`** | icons / checkbox per column spec |
| `DatagridHeader` (Selection / settings, `colorAndBorder=false`) | default | **`var(--color-background-component)`** | **no** full-cell top/bottom on minimal path; inner rails per **`37721:114663`** where shown in Figma | icons / checkbox per column spec |
| `DatagridRow` | default | **`var(--color-background-component)`** on **each body cell** (idle row; not `transparent` unless `rowBackgroundLayer` / Figma `background` is off) | bottom **1px** `var(--color-border-light)` when `showBorder=true` | `var(--color-text-neutral)` |
| `DatagridRow` | hover (interactive grid) | overlay **`var(--color-background-brand-lighter)`** | bottom **1px** `var(--color-border-light)` when `showBorder=true` | unchanged unless product overrides |
| `DatagridRow` | hover on read-only table | overlay **`var(--color-background-surface-1)`** (distinct from brand hover) | bottom **1px** `var(--color-border-light)` when `showBorder=true` | unchanged unless product overrides |
| `DatagridRow` | selected | overlay **`var(--color-background-brand-lighter)`**; if `verticalBlueLine=true`, add **4px** leading bar **`var(--color-border-brand-base)`** full row height | bottom **1px** `var(--color-border-light)` when `showBorder=true` — **not** a full-width brand border | token-resolved |
| `DatagridRow` | selected and press | overlay **`var(--color-background-brand-light)`**; same optional **4px** leading bar when `verticalBlueLine=true` | bottom **1px** `var(--color-border-light)` when `showBorder=true` | token-resolved |
| `SortToggle` (`col-sort-up-16` / `col-sort-down-16`, Figma **`37721:114646`**) | default | transparent | none | `var(--color-icon-neutral)` (**`37721:114647`** / **`37721:114655`**); **icon 12×12** |
| `SortToggle` | hover (not sorted) | transparent | none | `var(--color-icon-neutral-strong)` (**`37721:114651`** / **`37721:114657`**); **12×12** |
| `SortToggle` | selected (sorted column) | transparent | none | `var(--color-icon-brand-base)` (**`37721:114649`** / **`37721:114659`**); **12×12**; direction = **`col-sort-up-16`** (asc) or **`col-sort-down-16`** (desc) |
| `SortToggle` | selected + hover | transparent | none | `var(--color-icon-brand-stronger)` (**`37721:114653`** / **`37721:114661`**); **12×12** |
| `FilterToggle` (`filter`) | default | hit target fill **transparent**; padding **12px** on **38×38** control | none | **`var(--color-icon-neutral)`**; **icon 14×14** |
| `FilterToggle` (`filter-solid`) | hover | same **38×38** / **12px** padding contract | none | `var(--color-icon-neutral)` (`14x14`) |
| `FilterToggle` (`filter-solid`) | selected | same | none | `var(--color-icon-brand-base)` (`14x14`) |
| `FilterToggle` (`filter-solid`) | press | same | none | `var(--color-icon-brand-stronger)` (`14x14`) |
| `SettingsColumn` | default | header-aligned | `var(--color-border-light)` | **`Icon`** `settings-gear` in `var(--color-icon-neutral)` (`16x16`) |
| `DatagridFooter` | default | **transparent** (pass-through host) | **none** on host | embedded pagination: **top border only** on `IdsPagination` root |
## States (Dark Theme)
| Slot | State | Background | Border | Text/Icon |
|---|---|---|---|---|
| `DatagridHeader` (data columns, `colorAndBorder=false`) | default | **`var(--color-background-component)`** | **no** full-cell top/bottom in Figma Text path; **leading** **1px × 24px** **`var(--color-border-light)`** rail **`left: 0`**, vertically centered | header text `var(--color-text-neutral-strong)` |
| `DatagridHeader` (data columns, `colorAndBorder=true`) | default | **`var(--color-background-gray-neutral-lighter)`** | **1px** **`var(--color-border-light)`** **top** + **bottom**; **leading** **1px × 24px** **`var(--color-border-light)`** rail | header text `var(--color-text-neutral-strong)` |
| `DatagridHeader` (Selection / settings, `colorAndBorder=true`) | default | **`var(--color-background-gray-neutral-lighter)`** (nested chrome per Figma) | **top** + **bottom** **`var(--color-border-light)`**; inner rails per **`37721:114663`** | icons / checkbox per column spec |
| `DatagridHeader` (Selection / settings, `colorAndBorder=false`) | default | **`var(--color-background-component)`** | **no** full-cell top/bottom on minimal path; inner rails per **`37721:114663`** where shown in Figma | icons / checkbox per column spec |
| `DatagridRow` | default | **`var(--color-background-component)`** on **each body cell** (idle row; not `transparent` unless `rowBackgroundLayer` is off) | bottom **1px** `var(--color-border-light)` when `showBorder=true` | `var(--color-text-neutral)` |
| `DatagridRow` | hover (interactive grid) | overlay **`var(--color-background-brand-lighter)`** | bottom **1px** `var(--color-border-light)` when `showBorder=true` | unchanged unless product overrides |
| `DatagridRow` | hover on read-only table | overlay **`var(--color-background-surface-1)`** | bottom **1px** `var(--color-border-light)` when `showBorder=true` | unchanged unless product overrides |
| `DatagridRow` | selected | overlay **`var(--color-background-brand-lighter)`**; optional **4px** leading **`var(--color-border-brand-base)`** when `verticalBlueLine=true` | bottom **1px** `var(--color-border-light)` when `showBorder=true` | token-resolved |
| `DatagridRow` | selected and press | overlay **`var(--color-background-brand-light)`**; optional **4px** leading bar when `verticalBlueLine=true` | bottom **1px** `var(--color-border-light)` when `showBorder=true` | token-resolved |
| `SortToggle` (`col-sort-up-16` / `col-sort-down-16`, Figma **`37721:114646`**) | default | transparent | none | `var(--color-icon-neutral)` (**`37721:114647`** / **`37721:114655`**); **icon 12×12** |
| `SortToggle` | hover (not sorted) | transparent | none | `var(--color-icon-neutral-strong)` (**`37721:114651`** / **`37721:114657`**); **12×12** |
| `SortToggle` | selected (sorted column) | transparent | none | `var(--color-icon-brand-base)` (**`37721:114649`** / **`37721:114659`**); **12×12**; direction = **`col-sort-up-16`** (asc) or **`col-sort-down-16`** (desc) |
| `SortToggle` | selected + hover | transparent | none | `var(--color-icon-brand-stronger)` (**`37721:114653`** / **`37721:114661`**); **12×12** |
| `FilterToggle` (`filter`) | default | hit target fill **transparent**; padding **12px** on **38×38** control | none | **`var(--color-icon-neutral)`**; **icon 14×14** |
| `FilterToggle` (`filter-solid`) | hover | same **38×38** / **12px** padding contract | none | `var(--color-icon-neutral)` (`14x14`) |
| `FilterToggle` (`filter-solid`) | selected | same | none | `var(--color-icon-brand-base)` (`14x14`) |
| `FilterToggle` (`filter-solid`) | press | same | none | `var(--color-icon-brand-stronger)` (`14x14`) |
| `SettingsColumn` | default | header-aligned | `var(--color-border-light)` | **`Icon`** `settings-gear` in `var(--color-icon-neutral)` (`16x16`) |
| `DatagridFooter` | default | **transparent** (pass-through host) | **none** on host | embedded pagination: **top border only** on `IdsPagination` root |

Use the same semantic token names in both themes; **do not** hardcode hex — light/dark resolved values come from `components/ids-theme.css` (`html[data-design-system="ids"]` default vs `data-theme="dark"`).
## Interactions
- Sort:
  - clicking sort toggle cycles between ascending and descending for the active column (single-column sort contract).
  - sort **`Icon`** slugs are fixed: **`col-sort-up-16`**, **`col-sort-down-16`**; rendered size **12×12** (filter **`Icon`** **14×14** in the toggle).
- Filter:
  - **`FilterToggle`** uses the **pointer / focus / applied** precedence in **Column filter menu → `FilterToggle` (header)**; see **States** tables for token mapping (`filter` vs `filter-solid`, neutral vs brand).
  - Clicking **`FilterToggle`** opens the column **filter menu** (L-frame + **`column.filterPanel`**).
  - **`column.filterPanel`** supplies **inner** UI only; **outer** L-chrome is **datagrid-owned** across filter types.
  - **`column.filterActive`** (or equivalent) should reflect **non-default** filter criteria while the menu is **closed** so the **selected** icon state can render without keeping the menu open.
  - When a filter uses **checkboxes** (e.g. multiselect value list), controls **must** follow **`components/ids/checkbox/design-spec.md`** (anatomy, tokens, states, focus-visible, indeterminate → checked rule).
- Row selection:
  - when `rowSelection` is enabled, the leading **48px** column shows a per-row control; header chrome depends on **`selectionMode`**.
  - **`selectionMode: single`:** optional per-row **radio** column controlled by **`showSingleSelectionRadio`** (default **`true`**). When **`true`**, one radio per row inside a **`RadioGroup`**; header is **empty** (no select-all). When **`false`**, the **48px** selection column is **omitted** — single-select is row activation / detail panel only (no radio UI); row click does not set `selectedRowId`.
  - **`selectionMode: multiple`:** **checkbox** per row (IDS Checkbox `density="datagrid"`) **and** a header **select-all** checkbox (**`37721:114682`**).
  - **Select-all scope (paginated grid):** toggles selection for all rows on the **current page** only (`visibleRows` / client page slice). Selection on other pages is preserved. Header is **checked** when every row on the current page is selected; **indeterminate** when at least one but not all page rows are selected; **unchecked** when none on the page are selected.
  - **Row body click does not toggle** the radio/checkbox or select-all — only those controls change selection state. Row click activates the row (highlight / detail panel) via **`activeRowId`**.
  - radios follow **`components/ids/radio-button/design-spec.md`**; all checkboxes (header + rows) follow **`components/ids/checkbox/design-spec.md`** (**16×16**, indeterminate on select-all when applicable).
  - control **`click`** uses **`stopPropagation`** so row-click / detail-panel handlers are not double-fired.
- Detail panel (when `withDetailPanel` / `detailsPanel: attached`):
  - **Placement:** sibling of `.gridWrap` inside `.contentRow` flex row — not a table column.
  - **Borders:** delegate to `components/ids/detail-panel/design-spec.md` — **full** `1px solid var(--color-border-accessible)` on `DetailPanelRoot`; datagrid host must **not** strip or replace with left-only `border-light`.
  - **Header band:** align expanded header to **48px** height with datagrid column header row; header bottom rule **`var(--color-border-accessible)`** (or **`var(--color-border-light)`** when `headerColorAndBorder` / styled header band).
  - **Row click** sets the active row and **opens** the attached detail panel if closed.
  - **Row click** on the **same** active row again **closes** the panel (toggle); clearing active row clears detail content.
  - selection radio / sort / filter / resize controls use **`stopPropagation`** so they do not toggle the panel.
  - panel collapse via detail chrome still clears active row (parity with Angular `selectedRow` + `show` flag).
- Column resize (optional — Storybook **`columnResizeEnabled`**):
  - align the **pointer hit target** with the **trailing** header edge (same vertical band as the **1×24px** **`var(--color-border-light)`** rail); hit target may be a **transparent** strip (**~10px**) with **`cursor: col-resize`** so Figma still shows a single rail.
  - clamp widths to **`minWidth`** (default **90px** per column) and a product max; emit **`onColumnResize`** when the gesture completes (or continuously if product requires live layout).
- Column reorder:
  - drag-and-drop header columns to rearrange order; **do not** start a column drag from **sort**, **filter**, or **resize** controls (see **Codegen → behavior**).
- Freeze columns (`freezeUntilColumnKey`, Figma column-freeze scenario **`37721:115949`**):
  - **Split layout:** when freeze is active, render **three horizontal panes** (frozen | scrollable data | settings) in **both** header band and body viewport:
    - **Frozen pane (left):** selection column (when present) + data columns from start through `freezeUntilColumnKey` (**inclusive**). Fixed-width host (`flex: 0 0 auto`); does **not** scroll with the scrollable pane.
    - **Scrollable pane (middle):** remaining **data** columns only. Own **`overflow-x: auto`** region; horizontal scrollbar starts at the freeze boundary (Figma **`37721:114143`** `pl` inset aligns scrollbar with pane edge).
    - **Settings pane (right, `40px`):** gear column only — **never** scrolls horizontally; pinned trailing chrome (same contract as unified **`position: sticky; right: 0`** on **`settingsColumn`**).
    - **Viewport host (`tableViewportSplit`):** **`overflow-y: auto`** + **`overflow-x: hidden`** only — never horizontally scroll the combined row (that would drag frozen columns and the boundary shadow).
    - **Boundary bar (`freezePaneEdge`, Figma `37721:114144`):** **`20px`** wide; pinned at frozen/scrollable seam (`left: calc(var(--datagrid-frozen-pane-width) - 20px)` on scroll host); **`z-index`** above scrollable cells. **Background:** `linear-gradient(270deg, var(--color-gradient-overflow-vertical-end) 0%, var(--color-gradient-overflow-vertical-start) 63.46%, var(--color-gradient-overflow-vertical-start) 100%)`. Stays static while scrollable columns move underneath.
  - **Grow column** when freeze is active: last **scrollable** data column only; frozen pane columns use fixed `<colgroup>` widths.
  - **Header band:** mirrors the three-pane split; header horizontal scroll syncs from the **scrollable data** pane only (frozen + settings hosts do not scroll horizontally with middle content).
  - **Vertical scroll:** only **`.bodyViewport`** scrolls body rows; header band stays fixed (see **Codegen Contract → Scroll & viewport blueprint**).
  - If the frozen pane content is wider than its allocated width, the **frozen pane** may show its own horizontal scrollbar (`overflow-x: auto` on frozen pane).
  - Unknown `freezeUntilColumnKey` → single-table layout (selection/settings sticky only).
- Row click:
  - clicking row emits row click event and may open attached detail panel.
- **Row hover / press (body, Figma `37721:114580`):**
  - **Interactive table:** pointer hover applies **`var(--color-background-brand-lighter)`** overlay (same token as **Selected** idle fill — selection is reinforced by optional **vertical** accent, not by a darker fill alone).
  - **Read-only table:** use **`Hover on read only table`** state — overlay **`var(--color-background-surface-1)`** (neutral band, not brand-tinted).
  - **Selected + press:** overlay **`var(--color-background-brand-light)`** (darker than selected idle).
  - **`verticalBlueLine`:** when enabled, **only** **Selected** and **Selected and Press** render the **4px** **`var(--color-border-brand-base)`** leading indicator; other states omit it.
- Footer:
  - **Omit `DatagridFooter` / pagination** when pagination is not required: **`totalPages ≤ 1`**, or **`totalPages` not supplied** and client row count fits within **`pageSize`** (or **`pageSize`** omitted / invalid). Show all rows without a footer chrome strip.
  - When shown, pagination slot attaches IDS Pagination behavior/component.
  - **Footer host (`.footer` / `DatagridFooter`):** transparent pass-through — **no** background or border on the wrapper.
  - **Pagination root:** `background="gray"` → `var(--color-background-surface-1)`; **`embeddedInDatagrid={true}`** / `[embeddedInDatagrid]="true"` → **`rootEmbedded`** (top border only — no left/right/bottom; shell owns those edges via `.contentRow` / `.gridWrap`).
## Composition & API (runtime)

Canonical machine-readable mirror: `component-contracts/ids/datagrid.contract.ts`.

**Preferred pattern:** projected children inside `DatagridRoot` — not aggregate-only `columns[]` / `rows[]`.

```
DatagridRoot [rowSelection?, selectionMode?, withDetailPanel?, …]
  DatagridColumn [field, title, sortable?, filterable?, width?, …]
    DatagridFilter? → FilterPanelBody
  DatagridRow [rowId] × N
    DatagridCell [field]
  DatagridFooter? → DatagridPaginationSlot
```

Angular reference: `ids-datagrid` → `ids-datagrid-column` / `ids-datagrid-row` / `ids-datagrid-cell` (`storybook-angular`, port 6007).  
React reference: `IdsDataGridComposed` → `IdsDataGridColumn` / `IdsDataGridRow` / `IdsDataGridCell` (`storybook/src/components/IdsDataGridComposition.tsx`).

### Root (`DatagridRoot`) — aggregate types (migration / story hosts)

Framework-agnostic types (map to TypeScript / Angular inputs / Vue props):

```ts
type DatagridViewMode = "table" | "treeview";

interface DatagridColumn {
  key: string;
  title: string;
  minWidth?: number;           // default floor 90
  width?: number;              // fixed base width (px) for header + body via <colgroup>; preferred over defaultWidth
  defaultWidth?: number;       // fallback base 160 when width omitted
  sortable?: boolean;
  filterable?: boolean;
  filterActive?: boolean;      // applied criteria while menu closed → FilterToggle selected icon
  filterPanel?: Renderable;    // inner FilterPanelBody only
  columnHideable?: boolean;    // when true, column appears in settings (gear) popup and may be hidden
}

interface DatagridRow {
  id: string;
  values: Record<string, Renderable>; // keyed by column.key
}

interface DatagridProps {
  columns: DatagridColumn[];
  rows: DatagridRow[];
  viewMode?: DatagridViewMode;              // default "table"
  rowSelection?: boolean;                   // default false (Storybook spec story: true)
  selectionMode?: "single" | "multiple";  // default "single"
  showSingleSelectionRadio?: boolean;   // default true; single only — false hides radio column
  withDetailPanel?: boolean;                // default false (spec story: true)
  pageSize?: number;                        // client page slice; default product-defined
  totalPages?: number | null;               // server-side page count; omit for client-derived count
  readOnly?: boolean;                       // default false → brand hover; true → surface-1 hover
  rowVerticalIndicator?: boolean;           // default false → 4px leading bar when selected
  headerColorAndBorder?: boolean;           // default true → Figma colorAndBorder
  columnResizeEnabled?: boolean;            // default false (spec story: true)
  showSettingsColumn?: boolean;             // default true
  settingsColumnAlwaysVisible?: boolean;    // default true (non-hideable in settings popup)
  freezeUntilColumnKey?: string | null;
  columnMinWidth?: number;                  // default 90
  nonHideableColumnKeys?: string[];
  pagination?: PaginationProps;             // IDS Pagination — see pagination spec
}
```

### Events (emit on user action)

| Event | Payload | When |
|---|---|---|
| `onSortChange` | `(columnKey, "asc" \| "desc")` | Sort toggle on active column |
| `onFilterToggle` | `(columnKey, open: boolean)` | Filter menu open/close |
| `onFilterApply` | `(columnKey, payload: unknown)` | Filter committed (product) |
| `onColumnResize` | `(columnKey, widthPx: number)` | Resize gesture end (when enabled) |
| `onColumnOrderChange` | `(orderedColumnKeys: string[])` | Header reorder drop |
| `onColumnVisibilityChange` | `(columnKey, visible: boolean)` | Settings popup |
| `onRowClick` | `(rowKey: string)` | Row activation (also drives detail panel toggle) |
| `onRowSelectionChange` | `(rowId: string \| null)` | Single-select radio only |
| `onSelectedRowsChange` | `(rowIds: string[])` | Row checkbox or select-all (current page) |

### Column width (header + body)

- Declare **`width`** (px) on each `DatagridColumn` for fixed base sizing; generators emit a single `<col width="…">` per column (header and body share the column track).
- Precedence: **`width`** > **`defaultWidth`** > **160**; all clamped to **`minWidth`** (default **90**).
- **`columnResizeEnabled`:** user drag updates runtime width state; initial state seeds from **`width`** / **`defaultWidth`** for resize handles — **except** grow column **`<colgroup>`** width (see **Chrome columns & table slack**).
- **Chrome columns:** **48px** / **40px** on `<colgroup>` + matching `th`/`td` + inner hosts `width: 100%` (see **Chrome columns & table slack (codegen-critical)**).
- **Grow column:** last data column **`<col width="auto">`** only unless user pinned resize width.

### Spec Accurate Design story defaults (codegen parity)

Codegen and `Datagrid.stories.tsx` **Spec Accurate Design** must use:

- `rowSelection: true`, `selectionMode: "single"`, `showSingleSelectionRadio: true`, `withDetailPanel: true`, `headerColorAndBorder: true`, `rowVerticalIndicator: true`, `columnResizeEnabled: true`, `readOnly: false`, `pageSize: 6`, `viewMode: "table"`
- Parent frame: **`height: 100vh`**, **`flex: 1`**, **`minHeight: 0`**, **`minWidth: 0`** (bounded container per **`37721:112482`**)
- Columns: Name (sort+filter+search panel), Type/Status (sort+filter), Owner (sort), Region (filter only) — see generated story `specColumns`
## Codegen Contract (Framework-Agnostic Blueprint)

### Scroll & viewport blueprint (codegen-critical)

Generators **must** implement this block for **all** frameworks. Reference: `IdsDataGrid.tsx` + `IdsDataGrid.module.css`.

#### Shell geometry (full container)

| Element | Contract |
|---|---|
| `DatagridShell` (`.shell`) | **`width: 100%`**, **`height: 100%`**, **`min-height: 0`**, **`min-width: 0`** — fills parent container/page (**`37721:112482`**); height **not** driven by row count |
| `DatagridGridWrap` (`.gridWrap`) | flex column, **`flex: 1`**, **`min-height: 0`**, **`width: 100%`**; with detail panel: **Table shell** — **`1px solid var(--color-border-accessible)`**, **`margin-right: -1px`** (Figma **`47962:168306`**) |
| `DatagridContentRow` (`.contentRow`) | flex row; **without detail panel:** **`1px solid var(--color-border-accessible)`** outer shell; **with detail panel:** pass-through (table + detail panel each own border) |
| `DatagridFooter` | **`flex: 0 0 auto`** — outside vertical scroll clip; **`var(--color-background-surface-1)`** |
| Storybook / demo host | **`width: 100%`**, **`height: 100dvh`** (or **`100%`** of app shell), **`minHeight: 0`** — **no** arbitrary **`max-width`** on the grid host |

#### Header / body split (vertical scroll)

| Element | Contract |
|---|---|
| `DatagridScrollHost` (`.gridScrollHost`) | flex column, **`flex: 1 1 0%`**, **`min-height: 0`**, **`width: 100%`** |
| `DatagridHeaderBand` (`.headerBand`) | **`flex: 0 0 auto`** — **never** scrolls vertically; hosts **`<thead>`** only |
| `DatagridBodyViewport` (`.bodyViewport`) | **`flex: 1 1 0%`**, **`overflow-y: auto`**, **`min-height: 100%`** on inner fill — **only** body rows scroll vertically |
| `DatagridBodyContent` (`.bodyContent`) | **`min-height: 100%`** — body area fills space between header and footer when row count is low |
| Header horizontal sync | Hidden header track (`.headerBandTrack`, **`scrollbar-width: none`**) mirrors **`scrollLeft`** of body viewport (unified) or scrollable data pane (freeze) |

**Forbidden:** scrolling the **entire** table (header + body) in one vertical scrollport — header must remain stable.

#### Horizontal scroll + pinned chrome

| Layout | Horizontal scroll owner | Pinned chrome |
|---|---|---|
| **Unified** (no freeze) | **`.bodyViewport`** (`overflow: auto`) | **Selection** `sticky left: 0`; **Settings** `sticky right: 0` on body cells; header settings **`sticky right: 0`** (or equivalent pin in header band) |
| **Freeze** (`freezeUntilColumnKey`) | **Middle pane only** (scrollable **data** columns) | **Frozen pane** fixed left; **Settings pane** fixed **`40px`** right — **never** inside horizontal scroll content |

**Horizontal scrollbar position:** scroll containers (`.bodyViewport`, `.scrollablePane`, `.frozenPane`) use **`min-height: 100%`** so the bar anchors to the **bottom of the body viewport** (above footer), not immediately under the last row.

**`scrollbar-gutter`:** **`auto`** on **`.bodyViewport`** (not **`stable`**).

#### Freeze layout — three-pane model (`freezeUntilColumnKey`)

When **`freezeUntilColumnKey`** resolves to a visible column index **`≥ 0`**:

```
DatagridScrollHost
  DatagridHeaderBand
    row: [ FrozenHeaderHost | ScrollableHeaderHost | SettingsHeaderHost (40px) ]
  DatagridBodyViewport (overflow-y auto, overflow-x hidden)
    row: [ FrozenPaneHost | ScrollablePane | SettingsPaneHost (40px) ]
  FreezePaneEdge (absolute; spans header+body height; Figma 37721:114144)
```

| Pane | Contents | Horizontal scroll | Width |
|---|---|---|---|
| **Frozen** | Selection? + data cols **`[0 … freezeIndex]`** | Only if frozen block wider than host (`overflow-x: auto`) | sum of pinned col widths |
| **Scrollable data** | data cols **`[freezeIndex+1 … end]`** | **`overflow-x: auto`** | **`flex: 1`** |
| **Settings** | gear column only | **None** — **never** place settings inside scrollable pane | **`40px`** fixed |

- **`growColumnKey`** = last column in **scrollable data** slice only.
- **`freezePaneEdge`:** **`20px`** wide; **`flex-shrink: 0`**; **`align-self: stretch`**; **`border-radius: 0`**; **`left: calc(var(--datagrid-frozen-pane-width) - 20px)`** on scroll host (absolute pin). **Background:** `linear-gradient(270deg, var(--color-gradient-overflow-vertical-end) 0%, var(--color-gradient-overflow-vertical-start) 63.46%, var(--color-gradient-overflow-vertical-start) 100%)`.
- Unknown / missing **`freezeUntilColumnKey`** → fall back to **unified** layout (sticky selection/settings only).

#### Sort toggle (codegen — Figma `37721:114646`)

| State | `shapeName` | Token | Attribute / a11y |
|---|---|---|---|
| Default (unsorted or inactive col) | `col-sort-up-16` | `var(--color-icon-neutral)` | — |
| Hover (not sorted) | unchanged shape | `var(--color-icon-neutral-strong)` | — |
| Selected asc | `col-sort-up-16` | `var(--color-icon-brand-base)` | **`data-sorted="true"`** on button; **`aria-sort="ascending"`** on **`th`** |
| Selected desc | `col-sort-down-16` | `var(--color-icon-brand-base)` | **`data-sorted="true"`**; **`aria-sort="descending"`** |
| Selected + hover | per direction | `var(--color-icon-brand-stronger)` | — |

- Rendered icon box: **12×12**; button hit area may be **20×20**.
- **Visibility:** always shown (product decision; Figma default notes hide-on-header-hover — **do not** implement hide-on-default in codegen unless product overrides).

### Deterministic structure

**Composition (canonical):**

```
DatagridRoot
  DatagridColumn* → optional DatagridFilter → FilterPanelBody
  DatagridRow* → DatagridCell* (per column field)
  DatagridFooter? → DatagridPaginationSlot
  DatagridDetailShell? → DatagridDetailPanelSlot (sibling, not <col>)
```

**Render tree (all frameworks):**

1. `DatagridRoot` (`DatagridShell` → `DatagridGridWrap` → `DatagridScrollHost`)
2. `DatagridHeaderBand` (`<thead>` tables / sections — portaled **`FilterMenuLayer`** per open filter)
3. `DatagridBodyViewport` (`<tbody>` tables / sections — vertical scroll clip)
4. optional `DatagridDetailPanelSlot` (sibling, not `<col>`)
5. `DatagridFooter` (below scroll host)

### DOM trees (HTML reference — adapters must preserve structure)

**`DatagridColumnHeader` / data `<th>`** (keep `display: table-cell`; flex only inside wrappers):

```
th.headerCell.headerDataCell [sticky top]
  div.headerCellRow [flex row, pl 16px, h 48px]
    div.headerTitleRow [flex 1, min-w 0, gap 12px, pr 8px]
      button.titleButton [flex 1, min-w 0, overflow hidden]
        span.headerTitle [block, ellipsis, title attr]
      button.iconButton? [sort, flex-shrink 0, 12x12 Icon]
    div.filterAnchor? [38x38, flex-shrink 0]
      button.filterToggleButton OR spacer when menu open
  span.columnHeaderDivider [absolute right, 1x24 rail]
  button.columnResizeHandle? [optional, absolute right edge]
```

**`DatagridCell` / data `<td>`:**

```
td.bodyCell [box-border, padding 10px 12px 10px 16px, h 40px]
  span.cellText [block, ellipsis]
```

**`SelectionColumn` / selection `<th>` / `<td>`** (chrome — keep `display: table-cell`):

```
// Selection column omitted when selectionMode single && showSingleSelectionRadio false
RadioGroup [wraps table when single + showSingleSelectionRadio]
col [width 48px]
th|td.selectionColumn ...
  single + showSingleSelectionRadio: empty header + IdsDataGridSelectionRadio per row
  multiple: select-all header + IdsDataGridSelectionCheckbox per row
```

**`SettingsColumn`:**

```
col [width 40px]  /* always last col */
th|td.settingsColumn [width/min/max 40px, sticky right, overflow hidden]
  div.settingsHeaderInner [width 100%, h 48, padding-block 16px, flex center]
    Icon settings-gear 16x16
td.bodyCell.settingsColumn [h 40, padding-block 12px]
```

**`FilterMenuLayer` (portal to body, not inside table):**

```
div.filterMenuLayer [fixed, z-index 10000]
  button.filterPopupIconTab [38x38, L-frame tab]
  div.filterPopupPanel [max-content width, L borders + shadow]
    div.filterPopupPanelBody [padding 6px 16px]
      {column.filterPanel}
```

**Freeze layout (`freezeUntilColumnKey` set) — header + body bands:**

```
div.gridScrollHost [flex column, position relative]
  div.headerBand [flex 0 0 auto]
    div.headerBandRow [flex row]
      div.frozenHeaderHost [flex 0 0 auto, overflow hidden]
        table > thead > frozen cols only
      div.scrollableHeaderHost [flex 1, overflow hidden]
        div.headerBandTrack [overflow-x auto, scrollbar hidden]
          table > thead > scrollable data cols only
      div.settingsHeaderHost [flex 0 0 40px]
        table > thead > settings col only
  div.bodyViewport [flex 1, overflow-y auto, overflow-x hidden]
    div.bodyContent [min-height 100%]
      div.bodyBandRow [flex row, min-height 100%]
        div.frozenPane [flex 0 0 auto, overflow-x auto, min-height 100%]
          table > tbody > frozen cols
        div.scrollablePane [flex 1, overflow-x auto, min-height 100%]
          table > tbody > scrollable data cols
        div.settingsPane [flex 0 0 40px, overflow hidden]
          table > tbody > settings col
  div.freezePaneEdge [absolute, 20px wide, z-index above scrollable]
```

### Per-slot style contract

| Slot | Size / layout | Tokens (default) |
|---|---|---|
| `DatagridColumnHeader` host | **48px** height, `pl: 16px` | bg/border per `headerColorAndBorder`; leading **1×24** rail `var(--color-border-light)` |
| `ColumnTitle` | **14/20** medium, ellipsis | `var(--color-text-neutral-strong)` |
| `SortToggle` | **12×12** icon, **20×20** button ok | default **`var(--color-icon-neutral)`**; hover (unsorted) **`var(--color-icon-neutral-strong)`**; sorted **`var(--color-icon-brand-base)`** + **`data-sorted="true"`**; sorted+hover **`var(--color-icon-brand-stronger)`** (Figma **`37721:114646`**) |
| `FilterToggle` | **38×38**, **14×14** icon | see **States** + precedence |
| `DatagridCell` | **40px** row, padding **10/12/10/16** | text `var(--color-text-neutral)`; bottom `var(--color-border-light)` |
| `DatagridRow` hover | full-cell overlay | brand-lighter or `surface-1` if readOnly |
| `DatagridRow` selected | full-cell overlay + optional **4px** left bar | `brand-lighter` / `brand-light` press |
| `SettingsColumn` | **40px** fixed | header band matches `headerColorAndBorder` |
| `SelectionColumn` | **48px** fixed | **single:** empty header + row radio; **multiple:** select-all header + row checkbox (**16×16**) |
| `GrowColumn` (`growColumnKey`) | `<col width="auto">` only | absorbs `table width:100%` slack; never `width:0` |

### Table layout behavior contract

- Emit **`<table class="grid" style={{ width: '100%', minWidth: tableMinWidthPx }}">`** with **`table-layout: fixed`**, **`border-collapse: collapse`**, **`border-spacing: 0`**.
- Emit **`<colgroup>`** before **`<thead>`** with column count = cell count per row; order per **Chrome columns & table slack**.
- Implement **`growColumnKey`** = last data column in the active slice: `orderedColumns[orderedColumns.length - 1].key` (unified), or last **scrollable** data column when **`freezeUntilColumnKey`** is set.
- Implement **`colWidthStyle`** per reference pseudocode in **Table layout algorithm**.
- When **`columnResizeEnabled`**, still emit grow as **`auto`** in `<colgroup>` until **`growColPinnedWidthPx`** is set by completed resize on grow column.
- Chrome CSS constants (emit as theme or component vars): `--datagrid-selection-col-width: 48px`, `--datagrid-settings-col-width: 40px`, `--selection-header: 16px`, `--selection-cell: 12px`.
- **Validation target:** DevTools on selection **`th`** = **48px** wide; **`.selectionHeaderContent`** = **100%** of cell (no gap before first data divider); settings **`th`** = **40px**.

Variant matrix:
  - `viewMode`: `table | treeview`
  - `rowSelection`: `on | off`
  - `selectionMode`: `single | multiple`
  - `showSingleSelectionRadio`: `on | off` (single only; when `off`, no 48px selection column)
  - `detailsPanel`: `attached | none`
  - `filterPopup`: `closed | open` (open state shows **`FilterMenuLayer`**: **`FilterIconTab`** + **`FilterPanel`** + optional **`FilterPanelBody`** from **`column.filterPanel`**)
  - `sortState`: `asc | desc`
  - `rowState`: `default | hover | hover-readonly | selected | selected-press` (maps to Figma **`states`** on `.Row/Cell: States and styling`; **`hover-readonly`** ↔ **`Hover on read only table`**)
  - `rowVerticalIndicator` (Figma **`verticalBlueLine`**): `on | off` — when **`on`**, **Selected** / **Selected-press** show the **4px** leading **`var(--color-border-brand-base)`** bar; when **`off`**, selected rows use fill only.
  - `rowShowBottomBorder` (Figma **`showBorder`**): `on | off` (default **`on`**) — **1px** bottom **`var(--color-border-light)`**
  - `rowBackgroundLayer` (Figma **`background`**): `on | off` (default **`on`**) — toggles default **`var(--color-background-component)`** base fill
  - `headerColorAndBorder` (Figma **`colorAndBorder`**): `on | off` (maps from boolean; default **`on`** / **`true`**)
  - `columnResizeEnabled` (product / Storybook): `on | off` (default **`off`**) — trailing-edge resize hit target + width state; Figma still shows only the **1×24** divider rail as visible chrome.
  - `freezeUntilColumnKey`: `string | null` — when set, enables **three-pane** freeze layout (see **Scroll & viewport blueprint**); inclusive freeze through this column key.
  - **Column header chrome** (`DatagridColumnHeader` / `th`): **height `48px` total** (no **51px** drift); **host** **`padding-left: 16px`**, **`padding-top` / `bottom: 0`**; **title row** (**37721:114673**): **`padding: 0 8px 0 0`**, **`gap: 12px`**, **`align-items: center`** in **48px** row, title **20px** line box; **trailing column edge** draws the **1px × 24px** **`var(--color-border-light)`** rail (**decorative**); optional **transparent** resize strip when **`columnResizeEnabled`** (see **Layout → Resize**); **no** extra vertical rule **between** **sort** and **filter**; **filter** (**37721:114677**): **`38×38`**, **`padding: 12px`**, **14×14** **`Icon`**; **`colorAndBorder=true`**: fill **`var(--color-background-gray-neutral-lighter)`**, **1px** **`var(--color-border-light)`** **top** + **bottom**; **data** headers add **leading** **1px × 24px** **`var(--color-border-light)`** rail per **`37721:114663`**; **`colorAndBorder=false`**: fill **`var(--color-background-component)`**, same **leading** rail on data headers, **no** full-cell top/bottom on Text minimal path.
  - data columns honor min-width `90px`.
  - **Body row chrome** (`DatagridRow` / body `td`): height **40px** (Figma **`Grid height/Cell`**); **idle** fill **`var(--color-background-component)`** on **each cell** (not `transparent` when `rowBackgroundLayer` is on); bottom divider **1px** **`var(--color-border-light)`** when `rowShowBottomBorder` is on; hover/selected/press fills and vertical accent per **States** tables and Figma **`37721:114580`**.
  - `SettingsColumn` width is fixed `40px` and pinned.
  - **Last data column** `<col>` uses **`width: auto`** (sole slack column); chrome **48**/**40** (Figma **`37721:113987`**).
  - selection column and settings column do not participate in horizontal scrolling.
  - **Chrome + slack (codegen):** implement **Chrome columns & table slack (codegen-critical)** — grow **`auto`**, chrome **48**/**40** on `<colgroup>` + `th`/`td`, inner hosts **`width:100%`**, **16×16** row radio, no **`width:0`**, no grow width in `<colgroup>` until user resize completes.
  - title/value overflow uses ellipsis in constrained widths (see **Column title overflow** above).
  - **Sort** icons: **`Icon`** with **`shapeName`** **`col-sort-up-16`** / **`col-sort-down-16`** (files **`assets/icons/col-sort-up-16.svg`**, **`assets/icons/col-sort-down-16.svg`**); rendered box **12×12**; hit area may be larger (e.g. **20×20** button).
  - **FilterToggle** (`.Filter for table`, **`37721:114677`** / **`37721:114635`**): **38×38** control, **12px** padding, **14×14** **`Icon`**; state/**`shapeName`** mapping (see **States** tables):
    - default: `filter` + **`var(--color-icon-neutral)`**
    - hover (pointer or keyboard focus while closed): `filter-solid` + **`var(--color-icon-neutral)`**
    - selected (**`filterActive`** / applied criteria, menu closed): `filter-solid` + **`var(--color-icon-brand-base)`**
    - press (`:active` / pointer down): `filter-solid` + **`var(--color-icon-brand-stronger)`**
    - **Precedence (codegen):** press **>** hover|focus **>** filterActive **>** default; clear press on **global** `pointerup` / `pointercancel`.
  - **Filter menu (open):** **`FilterMenuLayer`** portaled + **`position: fixed`**; keep the portal mounted while open and use **`visibility` / `pointer-events`** (or equivalent) only until anchor **`getBoundingClientRect()`** is available so the menu never stays permanently hidden on first open; **`FilterPanel`** width **`max-content`** with **min**/**max** clamps (not a single fixed Figma pixel); **L** top rule length **`calc(100% - 38px)`** where **38px** equals **`FilterIconTab`** width.
- Behavior contract:
  - **Shell layout:** `DatagridRoot` occupies the **container box** (**`37721:112482`**); **only** the **body row stack** scrolls vertically; **header** (and optional **footer** outside the scroll clip) remain **stable** in view.
  - sort toggles ascending/descending for active column.
  - column resize (optional): pointer-drag on the trailing resize zone updates column widths (**`<col>`** / **`th`**/**`td`** as applicable), clamps to **`minWidth`**, emits **`onColumnResize`**; the **1×24** **`var(--color-border-light)`** rail remains the only **visible** divider (resize handle is non-painted or uses a subtle focus/hover affordance only).
  - reorder emits updated column order; suppress **`dragstart`** when the event target is inside **sort**, **filter**, or **resize** controls so filters remain clickable.
  - settings popup controls column visibility and enforces always-visible columns.
  - row click toggles optional detail panel (open on first click, close on second click on same row); emits `onRowClick` with row key.
- Accessibility contract:
  - use semantic table/treegrid roles as applicable to mode.
  - sortable headers expose `aria-sort`.
  - **single:** row radios expose correct selected state within `RadioGroup` (`aria-checked` on each radio); radio semantics delegated to `components/ids/radio-button/design-spec.md`.
  - **multiple:** select-all and row checkboxes expose **checked** / **indeterminate** / **unchecked** per IDS Checkbox spec; select-all **`aria-label`** describes page scope.
  - filter and settings controls expose `aria-haspopup` + `aria-expanded` when popup is used.
- Asset/bundling:
  - sort icons: **`assets/icons/col-sort-up-16.svg`**, **`assets/icons/col-sort-down-16.svg`** — **`Icon.shapeName`** slugs **`col-sort-up-16`**, **`col-sort-down-16`**; **12×12** rendered box (Figma **`37721:114646`**)
  - filter icons: **`assets/icons/filter.svg`**, **`assets/icons/filter-solid.svg`** — **`Icon.shapeName`** **`filter`** / **`filter-solid`**; **14×14** inside **38×38** hit target with **12px** padding (Figma **`37721:114677`** / **`37721:114635`**; audit vs **Icons** on library page **`44551:229021`**)
  - settings icon: **`assets/icons/settings-gear.svg`** — **`Icon.shapeName`** **`settings-gear`** (**16×16**, neutral)
  - implementations may use **`Icon`** **`mask`** (bundled URL) or **inline**/**`<img>`** as long as **`shapeName`** resolves through the canonical **`assets/icons`** registry and dimensions/tokens match Figma.
- Fallback/error rules:
  - unknown view mode -> fallback to `table`.
  - invalid min width (`<=0`) -> fallback to `90`.
  - unknown `rowVerticalIndicator` -> **`off`** (leading bar is opt-in; Figma state matrix still documents **`verticalBlueLine=true`** variants at **`37721:114580`**).
  - unknown `headerColorAndBorder` -> **`on`** (styled header band per **`37721:114663`** default column).
  - unknown `rowShowBottomBorder` / `rowBackgroundLayer` -> **`on`** / **`on`** (match Figma defaults on **`37721:114580`**).
  - missing column key in freeze config -> ignore freeze boundary.
  - hidden column requested for non-hideable key -> ignore and keep visible.
- Validation checklist:
  - [ ] table + treeview modes are both represented.
  - [ ] Body row idle: **each** `td` uses **`var(--color-background-component)`** (not `transparent`) when `rowBackgroundLayer` is on.
  - [ ] Body row hover (interactive): **`var(--color-background-brand-lighter)`**; read-only hover: **`var(--color-background-surface-1)`**.
  - [ ] Body row selected: **`var(--color-background-brand-lighter)`**; selected+press: **`var(--color-background-brand-light)`**.
  - [ ] When `rowVerticalIndicator` on: **4px** leading **`var(--color-border-brand-base)`** only for **selected** / **selected-press**; never for default/hover/hover-readonly.
  - [ ] **Chrome + slack (codegen-critical):** grow sole **`<col width="auto">`**; never **`width:0`**; with **`columnResizeEnabled`**, grow not fixed **`Npx`** in `<colgroup>` until user resize completes.
  - [ ] **Selection** **`th`** = **48px** in DevTools; inner host **`width:100%`** (no gap before Name divider); body **`12px 16px`** + **16×16** control.
  - [ ] **`selectionMode: single` + `showSingleSelectionRadio: on`:** empty header; row radios in `RadioGroup` per `components/ids/radio-button/design-spec.md`.
  - [ ] **`selectionMode: single` + `showSingleSelectionRadio: off`:** no selection column; row highlight from row click / detail panel only; **no** leading **1×24px** rail on first data header (**Name**).
  - [ ] **`selectionMode: multiple`:** header **select-all** checkbox (**16×16**, indeterminate when partial current-page selection); row checkboxes per `components/ids/checkbox/design-spec.md`; select-all toggles **current page** rows only.
  - [ ] Row body click does **not** toggle radio/checkbox/select-all; controls use **`stopPropagation`**.
  - [ ] **Settings** **`th`** = **40px**; **16×16** gear centered; **no** leading chrome `::before` divider; body **`padding-block: 12px`**.
  - [ ] Last data column absorbs extra width; no spacer column before `SettingsColumn`; no trailing white gutter when viewport is wider than sum of fixed columns (Figma **`37721:113987`**).
  - [ ] row click toggles detail panel open/closed when `detailsPanel: attached`; interactive controls do not bubble row click.
  - [ ] Column header: **`colorAndBorder=true`** uses **`var(--color-background-gray-neutral-lighter)`** + **top/bottom** **`var(--color-border-light)`**; **`false`** uses **`var(--color-background-component)`** without full-cell top/bottom on Text path; data columns show **leading** **1px × 24px** **`var(--color-border-light)`** rail.
  - [ ] Column header: **cell height exactly `48px`**; host **`pl-16`** only (no stacked host **`py-5`** + title **`py-9`**); title row **`pr-8`**, **`align-items: center`** in **48px** row, title **20px** line box; **no** divider **between** sort and filter; **trailing** **1×24** **`var(--color-border-light)`** column rail; optional **transparent** resize strip when **`columnResizeEnabled`**; filter **`37721:114677`** **38×38** **`p-12`** **14×14** **`Icon`**; sort/filter/settings use **`Icon`** + **`shapeName`** from **`assets/icons`**; **selection radio** + **settings** use **inner** flex wrappers for centering (**`th`/`td`** stay **`table-cell`**).
  - [ ] **Scroll (split):** **`.headerBand`** fixed — **no** vertical scroll; **`.bodyViewport`** owns **`overflow-y: auto`**; horizontal scroll on **`.bodyViewport`** (unified) or **`.scrollablePane`** only (freeze).
  - [ ] **Horizontal scrollbar:** anchored to **bottom of body viewport** (above footer), not under last row — body panes use **`min-height: 100%`**.
  - [ ] **`scrollbar-gutter: auto`** on body viewport — **no** permanent right gutter strip beside settings column.
  - [ ] **Height / width:** grid shell **`width/height: 100%`**; fills container (**`37721:112482`**); demo host **`100dvh`** without arbitrary **`max-width`** cap.
  - [ ] **Freeze (`freezeUntilColumnKey`):** three panes (frozen | scrollable data | settings **`40px`**); settings **never** in scrollable pane; **`freezePaneEdge`** **`20px`** with `linear-gradient(270deg, var(--color-gradient-overflow-vertical-end) 0%, var(--color-gradient-overflow-vertical-start) 63.46%, var(--color-gradient-overflow-vertical-start) 100%)` pinned at seam (**`37721:114144`**); **`growColumnKey`** = last scrollable data column only.
  - [ ] **Sort (`37721:114646`):** unsorted hover **`neutral-strong`** (not brand); sorted **`brand-base`** + **`data-sorted="true"`**; sorted+hover **`brand-stronger`**; **`aria-sort`** on **`th`**; icons **12×12**.
  - [ ] **Header titles:** **`text-overflow: ellipsis`** on title text (**`display: block`** or equivalent — not **`display: flex`** on the title node); **`min-width: 0`** on flex title slot; sort/filter **`flex-shrink: 0`**; native **`title`** tooltip when truncated; no icon/title overlap at **`90px`** min width.
  - [ ] **Table layout:** **no** `display: flex` on **`th`/`td`**; `<table>` **`width: 100%`**, **`border-spacing: 0`** — **no** spurious side gutters from broken table-cell display.
  - [ ] column min-width (`90px`) and ellipsis behavior are enforced.
  - [ ] **Column filter (open):** **L-frame** matches **`37721:114635`** — **38×38** tab (**12px** padding, **14×14** **`Icon`**, **top/left/right** border only, **`margin-bottom: -1px`**), **`FilterPanel`** **content-driven width** (**`max-content`** + min/max), **partial** top border **`calc(100% - 38px)`** (no seam under tab), token borders + elevation; portal stays mounted with safe **pre-measure** visibility; **`filterPanel`** slot optional; **`FilterToggle`** hover / focus / **`filterActive`** / press states match **States** table + precedence rules.
  - [ ] **Column filter (checkbox lists):** options use IDS Checkbox spec (`components/ids/checkbox/design-spec.md`) without drift.
  - [ ] settings column remains fixed `40px` and non-scrollable.
  - [ ] selection/settings pinned behavior is preserved during horizontal scrolling.
  - [ ] reorder/filter/sort/selection events are emitted; **`onColumnResize`** when **`columnResizeEnabled`** is on.
  - [ ] detail panel attaches with **full accessible border** (no host left-only `border-light` override); header aligns to **48px** when expanded.
  - [ ] footer pagination uses IDS Pagination with **`embeddedInDatagrid`** / **`rootEmbedded`** (top border only).
  - [ ] **Grow column:** `growColumnKey` = last data column (unified) or last **scrollable** data column (freeze); sole `<col width="auto">` in that slice; settings **`40px`** in dedicated pane (freeze) or trailing chrome (unified); selection/settings **`th`** = **48**/**40**.
  - [ ] **Header ellipsis:** title `display: block` + `text-overflow: ellipsis`; `title` attribute on truncated labels.
  - [ ] **Body padding:** `10px 12px 10px 16px` on data cells; settings body **`12px 0`** (Figma `37721:114944`); selection body **`12px 16px`**.
## Source Mapping
- Component map baseline:
  - `data/component-figma-map.json` -> Datagrid legacy exploration entry.
- IDS authoritative nodes used:
  - Main use cases: `44398:164837`
  - Column definitions: `37721:114734`
  - Sort states/elements: **`37721:114646`** (`.Sort for table`; see also sort reference **`44551:229021`**)
  - Filter states/popup base: `37721:114635`
  - Column header structure: `37721:114663` (title row frame `37721:114673`, filter instance `37721:114677`)
  - Selection header (select-all when `multiple`, empty when `single`): **`37721:114682`**; selection grid column: **`37721:113988`** (**48px**)
  - Settings header variant: **`37721:114686`**; settings grid column: **`37721:114944`** / layout slot **`37721:113997`** (**40px** in **`37721:113987`**); column def **`37721:114887`**
  - Rows and columns layout reference: **`37721:113987`** (column widths, no spacer before settings)
  - Main variant sample: `37721:112483` (child of **`37721:112482`** *Data Grid - Main*)
  - **Row/cell states & styling:** `37721:114580`
  - **Column freeze (pinned data columns + boundary shadow):** **`37721:115949`** (horizontal scroll **`37721:114143`**, boundary gradient **`37721:114144`**)
  - **Column filter type matrix:** `37822:91069` (Column Filter-Main)
  - **Default text filter (Column Search):** `37822:91073`
  - **Combobox-Multiselect filter:** `44360:147581` (Dropdown Menu, search + Select All/Clear All + checkbox list)
  - **Combobox-SingleSelect filter:** `44360:179074` (Dropdown Menu, search + plain text option list)
  - **Dropdown-SingleSelect filter:** `44360:179201` (`.Dropdown-SingleSelect-Elements-Options`, no search)
  - **Dropdown-MultiSelect filter:** `44360:179348` (`.Dropdown-Elements-MultiSelect-Options`, no search, Select All/Clear All)
  - **Numeric filter:** `44360:182265` (`.Filter-Element-NumericFilter`); operator rows `44367:182693`; proof nodes `44360:182266`, `44367:182637`, `44370:145919`
- Live verification evidence:
  - `get_metadata`, `get_design_context`, `get_variable_defs` on nodes above; sort icon matrix **`37721:114646`** (symbols **`37721:114647`**–**`37721:114661`**) re-checked **`2026-06-05`** (Figma MCP); column freeze scenario **`37721:115949`** re-checked **`2026-06-05`**; row/cell frame **`37721:114580`** re-checked **`2026-05-13`**; column header **`37721:114663`**, title row **`37721:114673`**, filter **`37721:114677`** same method **`2026-05-13`**; **rows/columns layout** **`37721:113987`** + column instance **`37721:113995`**, settings **`37721:113997`** re-checked **`2026-05-14`**; chrome headers **`37721:114682`**, **`37721:114686`**, grid columns **`37721:113988`**, **`37721:114944`** re-checked **`2026-05-14`**; filter types **`37822:91069`**, **`44360:147581`**, **`44360:179074`**, **`44360:182265`**, **`37822:91073`** re-checked **`2026-05-25`** (Figma MCP — file key **`0bHk3XhrjFhowgFkz9yLr4`**).
### Storybook generation contract

**Root Storybook scope:** `storybook/.storybook/main.ts` includes **Spec Generated** only for **IDS** (`storybook-generated/ids`) and **DAP** (`storybook-generated/dap`). Each generated story imports exactly one program theme: **`components/ids-theme.css`** (IDS) or **`components/dap-theme.css`** (DAP).

Generators (`strict_spec_storybook_gate.py --deterministic-story`, spec-driven pipelines) must:

1. **Read** `components/ids/datagrid/design-spec.md` as sole source of truth; emit `spec_hash` in `storybook-generated/ids/src/spec-contracts/datagrid.spec-layer-hash.json`.
2. **Import** composition story from `storybook/src/components/IdsDataGridCompositionStory` (primary) and render engine from `IdsDataGrid` / `IdsDataGridDefaultStoryHost` for filter/freeze demos (do not fork layout logic into the story file).
3. **Title:** `Spec Generated/IDS/Datagrid`.
4. **Required stories:**

| Story export | Purpose | Args override |
|---|---|---|
| `SpecAccurateDesign` | Canonical Figma parity (`37721:112482` bounded frame) — **composition API** | spec defaults (see **Composition & API**) |
| `CompositionApi` | Explicit composition markup demo | same as Spec Accurate Design |
| `HeaderMinimal` | `headerColorAndBorder: false` | `headerColorAndBorder: false` |
| `ReadOnlyTableHover` | Figma hover-readonly row | `readOnly: true` |
| `WithoutVerticalSelectionIndicator` | `verticalBlueLine: false` | `rowVerticalIndicator: false` |
| `WithDetailPanel` | Detail panel attached | `withDetailPanel: true` |
| `ColumnFreeze` | Single frozen column through key | `freezeUntilColumnKey: "<key>"` (e.g. Name) |
| `ColumnFreezeTwoSections` | Multiple frozen columns + scrollable section | `freezeUntilColumnKey` through second data column |
| `TokenInspector` | Optional token swatches from spec | auto-appended by gate when tokens listed |

5. **Host wrapper:** `IdsDataGridDefaultStoryHost` for filter state (e.g. Type multiselect + `filterActive`); **`width: 100%`**, **`height: 100dvh`** flex parent with **`minHeight: 0`** (no **`maxWidth`** cap on grid host).
6. **Do not** generate a separate spacer/fill column in stories — column set must match **Table layout algorithm** and **Chrome columns & table slack (codegen-critical)**.
7. Generated components must implement **grow `auto`**, chrome **48**/**40** three-layer lock, and **`columnResizeEnabled`** grow pinning per **Table layout behavior contract (generators)**.
8. **Theme:** Spec Generated stories import **`components/ids-theme.css` only** (not `theme.css`, not other program themes). Document that import in story `parameters.docs.description`.
9. **Regenerate** when spec hash changes; visual QA against Figma nodes in **Source Mapping**.

---

## Implementation Notes

**Column-freeze boundary bar (`freezePaneEdge`, `37721:114144`)**
- **Width:** `20px`; **do NOT** substitute `box-shadow` or a reversed `to right` gradient — Figma uses a single **`linear-gradient(270deg, var(--color-gradient-overflow-vertical-end) 0%, var(--color-gradient-overflow-vertical-start) 63.46%, var(--color-gradient-overflow-vertical-start) 100%)`** fill on the bar.
- **Pin:** `position: absolute; top: 0; bottom: 0; left: calc(var(--datagrid-frozen-pane-width) - 20px)` on `.gridScrollHost[data-split-freeze="true"]` so the bar spans header + body and stays fixed while scrollable columns move.

**Sort icon**
- **Wrapper size**: `12×12px` — do NOT use `20×20px`; a larger wrapper inflates the hit target and shifts layout
- **Hover color**: use `var(--color-icon-neutral-strong)` on hover, `var(--color-icon-brand-stronger)` on selected+hover — add `.iconButton:hover .sortIcon` and `.iconButton[data-sorted="true"]:hover` rules in `IdsDataGrid.module.css`
- **`data-sorted` attribute**: add `data-sorted={isSorted ? "true" : undefined}` to the sort `<button>` in `IdsDataGrid.tsx`; required for CSS `[data-sorted="true"]` selectors to work
- **Visibility**: always visible — do NOT apply `opacity: 0` hide-on-default (product decision)

**Filter icon**
- **Hover color**: `var(--color-icon-neutral-strong)` — do NOT use `var(--color-icon-neutral)` (identical to default, no visual feedback)
- **Selected vs hover priority**: in `resolveFilterToggleVisual`, check `resolveIdsDataGridColumnFilterActive()` BEFORE `filterHoverKey`/`filterFocusKey`; wrong order causes the icon to show gray instead of blue when an active filter column is hovered
- **Size in open menu tab**: use `padding: 11px 11px 12px` on `.filterPopupIconTab`, NOT `padding: 12px` — the tab has 3×1px borders; with `box-sizing: border-box` and `padding: 12px` the content area is only 12×13px, causing the icon to flex-shrink below 14×14
- **Mask size on filter icon**: the filter SVG has a 12:14 natural ratio; the `Icon` default `mask-size: contain` renders it 12px wide instead of 14×14. Fix: add `.filterIcon span, .filterPopupIconTab span { mask-size: 14px 14px !important; -webkit-mask-size: 14px 14px !important; }` in `IdsDataGrid.module.css` — applies to both the header toggle icon and the open-menu tab icon

**Pagination / Footer**
- **Footer host (`.footer`)**: transparent pass-through — no background, no border
- **Pagination root**: `background="gray"`; pass **`embeddedInDatagrid`** — **top border only** via `rootEmbedded` class

**Table / detail shell borders**
- **`.contentRow`** (no detail panel): `1px solid var(--color-border-accessible)`
- **`.gridWrap`** (with detail panel): `1px solid var(--color-border-accessible)`; `margin-right: -1px`
- **Detail panel**: full accessible border per detail-panel spec

**Filter panels — common issues**
- **Font-weight**: all filter text elements (labels, inputs, options) use `font-weight: 400` — do NOT use `font-weight: 500`
- **Search icon**: slug `search-16`, rendered `16×16px` with no wrapper styles (no display/align-items/justify-content on the icon itself)
- **Dismiss/clear button**: icon slug `ctrl-close-16`, rendered `12×12px`, visible only when search query is non-empty; added to column search, single-select, and multi-select filter search inputs

**Date / Date and Time filters — preset row summary**
- **Bug (fixed)**: `modeShowsSummary` incorrectly excluded `"all"` — correct guard is `mode !== "specific-date" && mode !== "custom-range"`. Do NOT add `mode !== "all"`.
- **Summary display** (optional feature): `showSummary = (checked || isHovered) && modeShowsSummary(mode)`. On hover for a non-selected row, compute summary from `{ ...state, mode }` so the hovered mode's range is shown regardless of the current checked mode.
- **Hover tracking**: add `const [hoverMode, setHoverMode] = useState<Mode | null>(null)` in the panel component; attach `onMouseEnter={() => setHoverMode(mode)}` / `onMouseLeave={() => setHoverMode(null)}` to each `.optionRow` div.

**Date / Date and Time / Numeric filters — option row states**
- **hover**: `.optionRow:not(:has(.radioInput:disabled)):hover` — `background: var(--color-background-controls-brand-lighter)` + `box-shadow: inset 0 1px 0 0 var(--color-border-brand-base), inset 0 -1px 0 0 var(--color-border-brand-base)`. Exclude disabled rows via `:not(:has(.radioInput:disabled))`.
- **focus (keyboard only)**: `.optionRow:has(.radioInput:focus-visible)` — `outline: 2px solid var(--color-border-brand-base); outline-offset: -2px` on the row. Remove any `.radioRoot`-level focus ring — row-level ring supersedes it.
- **disabled**: `.optionRow:has(.radioInput:disabled)` — radio: `border-color: var(--color-border-disabled)`, `background: var(--color-background-disabled)`; dot: `background: var(--color-icon-disabled)`; label: `color: var(--color-text-disabled)`, `cursor: not-allowed`.

**Column Search filter**
- **Panel width**: `300px` (min-width/max-width)
- **Padding**: `6px` top/bottom, `16px` left/right on `.filterPopupSearchRow`

**Multiselect / Single-select filters**
- **Panel width**: `269px` (min-width/max-width)
- **Select All / Clear All row**: `justify-content: space-between`; row padding `8px 0 8px 16px`; Clear All right-aligned with its own `16px` horizontal padding (Figma `44360:179347`)
- **Option list padding**: no bottom padding (removed `padding-bottom`)

**Numeric filter**
- **Value + helper grouping**: when unit dropdown is present, wrap text field and helper text in a vertical flex group (`gap: var(--spacing-space-4)`) that takes `flex: 1` alongside the unit dropdown — helper text belongs to the value field group, not to the entire row

