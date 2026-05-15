# IDS Datagrid

Framework-agnostic design contract and React reference implementation for the IDS data grid (table + optional tree view, filters, selection, detail panel).

## Source of truth

| Artifact | Path |
|---|---|
| Design spec (codegen contract) | [`design-spec.mdx`](./design-spec.mdx) |
| Figma — main matrix | [Data Grid - Main `37721:112482`](https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=37721-112482&m=dev) |
| Figma — rows/columns layout | [Rows and Columns `37721:113987`](https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=37721-113987&m=dev) |
| Global theme | [`components/theme.css`](../../theme.css) (import in app shell) |
| Nested specs | [`checkbox`](../checkbox/design-spec.mdx), pagination (footer), detail panel attach mode |

## Reference implementation (Storybook)

| File | Role |
|---|---|
| `storybook/src/components/IdsDataGrid.tsx` | Grid host: table, colgroup widths, filters, sort, resize |
| `storybook/src/components/IdsDataGrid.module.css` | Layout, sticky pins, header/body tokens |
| `storybook/src/components/IdsDataGridDefaultStoryHost.tsx` | Filter state wiring (e.g. Type multiselect) |
| `storybook/src/components/IdsDataGridSelectionCheckbox.tsx` | IDS Checkbox in selection column |

Generated stories (do not hand-edit unless regenerating):

- `storybook-generated/ids/src/components/Datagrid.stories.tsx`
- `storybook-generated/ids/src/spec-contracts/datagrid.spec-layer-hash.json`

Storybook title: **`Spec Generated/IDS/Datagrid`** — primary story **`Spec Accurate Design`**.

## Regenerate Storybook from spec

From repo root (requires Python env per root `README.md`):

```bash
export DESIGN_SYSTEM=ids

# Deterministic stories + spec hash (no LLM)
python3 scripts/strict_spec_storybook_gate.py --component datagrid --spec-only --deterministic-story

# Optional: verify Storybook build
cd storybook && pnpm build
```

After changing [`design-spec.mdx`](./design-spec.mdx), run the gate so `spec_hash` in generated stories matches the layered spec input.

## Column width API

Widths are applied through **`<colgroup>`** so **header and body stay aligned**. Do not set per-cell `width` on data `<th>` / `<td>`.

| Column field | Purpose |
|---|---|
| **`width`** | **Fixed base width (px)** for this column (header + body). Preferred for explicit Figma column sizes. |
| `minWidth` | Floor (default **90**); resize and `width` are clamped to this. |
| `defaultWidth` | Fallback base when `width` is omitted (default **160**). |
| `columnResizeEnabled` (grid prop) | When **true**, user drag overrides stored width per column (still respects `minWidth`). |

**Viewport fill:** the **last data column** (before the **40px** settings column) absorbs extra width when the table is wider than the sum of column bases — see **Table layout algorithm** in the design spec. Explicit `width` on that column is the **minimum** base; extra space is still added so the grid fills the container.

**Chrome column widths (Figma-verified):**
- Select-all: **`48px`** column — header **`37721:114682`** / grid **`37721:113988`** — padding **`16px`** block + **`16px`** inline, **16×16** checkbox, header height **48px**; body padding **`12px 16px`**, row **40px**.
- Settings: **`40px`** column — header **`37721:114686`** / grid **`37721:113997`** — **16×16** gear, **`padding-block: 16px`**, centered in **40px**; body **`padding-block: 12px`**, row **40px**.
- Three-layer lock: `<colgroup>` **48**/**40**, matching `th`/`td`, inner hosts **`width: 100%`** (not fixed 48 inside a wider `th`). Checkbox/gear **16×16** (`density="datagrid"`) so header padding fits (`16+16+16=48`). **No** leading `::before` divider on selection/settings chrome.

**Viewport fill:** only the last **data** column uses **`<col width="auto">`** (`.tableGrowCol`). Do **not** use `width:0` on that col (it stretches chrome **48**/**40** `th` cells). With **`columnResizeEnabled`**, do not seed grow width in `<colgroup>` until the user finishes a resize on the grow column. See **Chrome columns & table slack (codegen-critical)** in the design spec.

**Gap before detail panel:** when **`withDetailPanel`** is on, set **`scrollbar-gutter: auto`** on **`.tableViewport`** (not `stable`) so the settings column sits flush against the **40px** collapsed detail rail.

Example:

```tsx
const columns: IdsDataGridColumn[] = [
  { key: "name", title: "Name", width: 200, sortable: true, filterable: true },
  { key: "type", title: "Type", width: 140, sortable: true, filterable: true },
  { key: "region", title: "Region", width: 100, filterable: true }, // last data col may grow wider
];
```

Angular mapping: set width on `<def-dg-column>` via the same logical field your adapter maps to `DatagridColumn.width`.

## Implementation tips

1. **Bounded height parent** — wrap the grid in `flex: 1; min-height: 0` (or fixed height) so the body viewport scrolls; see Figma `37721:112482`.
2. **No spacer column** — do not add a “fill” column before settings; only selection → data columns → **40px** settings.
3. **Header ellipsis** — title uses `display: block`, `text-overflow: ellipsis`, `min-width: 0` on flex parents; set native `title` for full label tooltip.
4. **Body padding** — data cells: **`10px 12px 10px 16px`**; settings cells: **`padding: 0`**.
5. **Checkboxes** — use IDS Checkbox spec (`components/ids/checkbox/design-spec.mdx`), not native inputs.
6. **Filter menu** — portaled L-frame (`37721:114635`); inner UI only in `column.filterPanel`; set `filterActive` when criteria apply while menu is closed.
7. **Detail panel** — sibling of grid shell, not a table column; row click toggles open/close.
8. **Icons** — `Icon` + `shapeName`: `col-sort-up-16`, `col-sort-down-16`, `filter` / `filter-solid`, `settings-gear`.

## Framework-agnostic codegen

Read [`design-spec.mdx`](./design-spec.mdx) sections in order:

1. **Anatomy** + **Framework-Agnostic Component Tree** (slot order, Angular `def-dg` mapping)
2. **Table Layout Algorithm (codegen)** — especially **Chrome columns & table slack (codegen-critical)**
3. **Composition & API (runtime)**
4. **Codegen Contract** (DOM trees, validation checklist)
5. **Storybook Generation Contract**

Angular child components (`def-dg-column`, `def-datagrid-filter`, `def-dg-cell`) are valid when **table chrome** (colgroup, sticky, filter portal, grow column) stays in the grid host — same split as React `IdsDataGrid`.

## Related commands

```bash
# Index spec into Qdrant (optional)
python3 scripts/index_component_specs.py

# Figma specs API (if running locally)
python3 api/figma_specs_api.py
```

See also the root [README](../../../README.md) — **Component implementation guides** and **Strict Spec-to-Storybook** sections.
