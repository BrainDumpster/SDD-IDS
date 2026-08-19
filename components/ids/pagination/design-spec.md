# Pagination Design Spec

## Metadata
- Component: Pagination
- Design System: IDS
- Category: Table and Data Grids
- Primary Figma URL: https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=11677-157840&m=dev
- Main row verification URL: https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=11677-157848&m=dev
- Per-page dropdown states URL: https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=37721-115839&m=dev
- Page navigation URL: https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=11677-157817&m=dev
- File key: `0bHk3XhrjFhowgFkz9yLr4`
- Validated nodes: `11677:157840`, `11677:157848`, `37721:115839`, `11677:157817`, `48122:183847` (datagrid), `47962:168577` (datagrid-embedded pagination)
- Verification method: Figma MCP (`get_metadata`, `get_design_context`, `get_variable_defs`)
- Last verified: 2026-07-06 (datagrid `embeddedInDatagrid` / `rootEmbedded` footer borders)
## Anatomy
- `PaginationRoot` (`nav` landmark)
- `ResultsPerPageGroup`
  - `ResultsLabel` ("Show:")
  - `PerPageDropdown` (trigger + menu with `arrow-drop-tri-caret`)
  - `ResultsSuffix` ("per page")
- `PageNavigationGroup`
  - `FirstPageButton` (`double-chev-left`) (always shown when `showFirstLast` is true, disabled at first page with `var(--color-icon-gray-disabled)`)
  - `PrevPageButton` (`chev-left`)
  - `PageInput` (textbox)
  - `PageCountText` (format is `"of {totalPages}"` with exactly one space after `of`; single-page fallback `"1 page"`)
  - `NextPageButton` (`chev-right`)
  - `LastPageButton` (`double-chev-right`)

> **Page number control:** Always a numeric **text input** (`.TextBox`). Do not replace with a dropdown in IDS or Synapse. The only dropdown in the main row is **per-page** (`Show: [n] per page`).
## Layout & Measurements
- Main row (`Pagination - Main`):
  - Height: `48px` (total height including border)
  - Horizontal padding: `24px` left, `32px` right
  - Border: `1px solid var(--color-border-gray-neutral-base)` on all sides (**standalone**). When **`embeddedInDatagrid`** is `true`, **`rootEmbedded`** applies **top border only** — left/right/bottom are owned by the datagrid shell (see **Datagrid footer integration**).
  - Supports `Background=Gray` (default), `Background=White`, and `Background=None`.
- Results-per-page group gap: approximately `15.5px` in Figma; runtime may normalize to nearest spacing token.
- Page-navigation group gap: `16px`.
- Page navigation controls (Figma node `11677:157817`):
  - Icon hit target: `16×16`
  - Glyph size: `16×16` via shared `Icon` component (`style={{ width: 16, height: 16 }}`)
  - Order (when `showFirstLast` is true): `double-chev-left`, `chev-left`, `PageInput`, `of {totalPages}`, `chev-right`, `double-chev-right`
- Page input (`PageInput` / Figma `.TextBox` node `11677:157819`):
  - Width: `40px`
  - Height: `32px`
  - Padding: `5px/6px` vertical, `0px` horizontal
  - Text alignment: `center`
- Page count text:
  - Must render as `of {totalPages}` with one whitespace separator.
  - Example: `of 16`.
- Results-per-page dropdown trigger:
  - Width: `90px`
  - Height: `32px`
  - Horizontal padding: `16px`
  - Caret slot: `10px` (implementation note: Icon component defaults to 16px, must override with `style={{ width: 10, height: 10 }}`)
  - **Border radius: `0` (square corners, per IDS nodes `11677:157848` and `37721:115839`)**
- Results-per-page dropdown menu:
  - Width tracks trigger (`90px` in sample)
  - Opens above or below trigger
  - Option row padding: `10px` vertical, `16px` left, `24px` right
  - Border radius: `0` (square corners)
### Responsiveness
- Runtime width behavior:
  - `PaginationRoot` is container-driven (`width: 100%`, `box-sizing: border-box`) and must not depend on the sample Figma width (`779px`).
  - Horizontal overflow in the root container is not allowed.
- Layout adaptation order (deterministic):
  1. Keep both groups in a single row while space allows.
  2. If insufficient width, hide `ResultsPerPageGroup` first when `showResultsPerPage` is optional in the host context.
  3. Keep `PageNavigationGroup` visible as highest priority.
  4. Preserve control heights (`32px`) and touch targets while adapting spacing.
- Spacing adaptation:
  - Group gaps may collapse from design values to the nearest lower spacing token before any control is removed.
  - Do not change tokenized typography or icon sizes during responsive adaptation.
- Dropdown/menu behavior on constrained width:
  - Per-page dropdown menus keep trigger-aligned width and square corners (`border-radius: 0`).
  - Menu placement remains `open-above | open-below` based on available viewport space.
## Tokens
- Surface/background:
  - `var(--color-background-surface-primary)` (`background="gray"`)
  - `var(--color-background-surface-component)` (`background="white"`)
  - transparent (`background="none"`)
  - `var(--color-background-brand-lighter-slate)`
  - `var(--color-background-brand-light-slate)`
- Border:
  - `var(--color-border-gray-neutral-base)`
  - `var(--color-border-brand-base-neutral)`
- Text:
  - `var(--color-text-gray-neutral)`
  - `var(--color-text-gray-neutral-strong)`
  - `var(--color-text-brand-strong)`
- Icon:
  - `var(--color-icon-gray-neutral-base)`
  - `var(--color-icon-brand-base)`
  - `var(--color-icon-gray-disabled)`
- Typography:
  - `Body 2` (`14/20`)
- Elevation:
  - Shadow 1 token stack:
    - `var(--shadow-shadow-4-drop-shadow-4-x)`
    - `var(--shadow-shadow-4-drop-shadow-4-y)`
    - `var(--shadow-shadow-4-drop-shadow-4-blur)`
    - `var(--shadow-shadow-4-drop-shadow-4-spread)`
    - `var(--shadow-shadow-4-drop-shadow-4-color)`
## States (Light Theme)
| Slot | State | Background | Border | Text/Icon |
|---|---|---|---|---|
| Navigation icon buttons | default | transparent | none | disabled/neutral/brand icon based on position |
| Navigation icon buttons | hover | transparent | none | `var(--color-icon-brand-base)` |
| Navigation icon buttons | disabled | transparent | none | `var(--color-icon-gray-disabled)` |
| Page input | default | `var(--color-background-surface-component)` | `1px solid var(--color-border-gray-neutral-base)` | `var(--color-text-gray-neutral)` |
| Page input | focus-visible | `var(--color-background-surface-component)` | `1px solid var(--color-border-gray-neutral-base)` + outer focus treatment | text unchanged |
| Per-page dropdown trigger | default | `var(--color-background-surface-component)` | `1px solid var(--color-border-gray-neutral-base)` | text `var(--color-text-gray-neutral)`, caret `var(--color-icon-gray-neutral-base)` |
| Per-page dropdown trigger | hover | `var(--color-background-surface-component)` | `1px solid var(--color-border-gray-neutral-base)` | text/caret unchanged |
| Per-page dropdown trigger | focus-visible | `var(--color-background-surface-component)` | `1px solid var(--color-border-gray-neutral-base)` + focus outline | text/caret unchanged |
| Dropdown option row | default (layout-stable) | `var(--color-background-surface-component)` | top+bottom `1px solid transparent` | `var(--color-text-gray-neutral)` |
| Dropdown option row | hover | `var(--color-background-brand-lighter-slate)` | top+bottom `1px solid var(--color-border-brand-base-neutral)` | `var(--color-text-gray-neutral)` |
| Dropdown option row | press | `var(--color-background-brand-light-slate)` | top+bottom `1px solid var(--color-border-brand-base-neutral)` | `var(--color-text-brand-strong)` |
| Dropdown option row | selected | `var(--color-background-brand-lighter-slate)` | top+bottom `1px solid var(--color-border-brand-base-neutral)` | `var(--color-text-brand-strong)` |
## States (Dark Theme)
| Slot | State | Background | Border | Text/Icon |
|---|---|---|---|---|
| Navigation icon buttons | default/hover/disabled | semantic token-resolved | semantic token-resolved | semantic token-resolved |
| Page input | default/focus-visible | semantic token-resolved | semantic token-resolved | semantic token-resolved |
| Per-page dropdown trigger | default/hover/focus-visible | semantic token-resolved | semantic token-resolved | semantic token-resolved |
| Dropdown option row | default/hover/press/selected | semantic token-resolved | semantic token-resolved | semantic token-resolved |

Dark table is structurally parallel to light; runtime must not hardcode literal colors.
## Interactions
- First/previous/next/last controls navigate pages when available.
- At first page:
  - first + previous remain visible and are disabled (`var(--color-icon-gray-disabled)`).
- At last page:
  - next + last remain visible and are disabled (`var(--color-icon-gray-disabled)`).
- Page input:
  - accepts numeric input only
  - commit on `Enter` or blur
  - clamp to `[1, totalPages]`.
- Per-page dropdown:
  - click or keyboard activation opens menu above or below depending on available space.
  - selecting an option updates page size and closes menu.
- Dropdown row behavior follows IDS dropdown-item interaction model (`default|hover|press|selected`).
## Composition & API (runtime)

Runtime contract mirror: `component-contracts/ids/pagination.contract.ts`. Reference implementations: `storybook/src/components/IdsPagination.tsx` (React), `storybook-angular/src/components/ids-pagination/` (Angular).

### Inputs

| Input | Type | Default | Description |
|---|---|---|---|
| `currentPage` | `number` | `1` | Active page index (1-based). Clamped to `[1, totalPages]` when out of range. |
| `totalPages` | `number` | `1` | Total page count. Values `< 1` normalize to `1`. |
| `pageSize` | `number` | `25` | Selected results-per-page value shown in the per-page dropdown trigger. |
| `pageSizeOptions` | `number[]` | `[25, 50, 75, 100]` | Positive unique options for the per-page dropdown. Empty/invalid arrays fall back to the default list. |
| `pageOffsetOptions` | `number[]` | all pages `1…totalPages` | When `showPageOffset` is `true`, the page-offset dropdown lists these page numbers (each clamped to `[1, totalPages]`). |
| `showPerPage` | `boolean` | `true` | Show/hide the `Show: [n] per page` group. |
| `showFirstLast` | `boolean` | `true` | Show/hide first (`double-chev-left`) and last (`double-chev-right`) navigation buttons. |
| `showPageOffset` | `boolean` | `false` | When `true`, replace the page-number text input with a page-offset dropdown bound to `pageOffsetOptions`. |
| `background` | `"gray" \| "white" \| "none"` | `"gray"` | Root surface variant. |
| `embeddedInDatagrid` | `boolean` | `false` | When `true` (datagrid footer), applies **`rootEmbedded`**: top border only; no left/right/bottom outer border. |
| `disabled` | `boolean` | `false` | Disables all interactive controls. |
| `dropdownState` | `"collapsed" \| "expanded-below" \| "expanded-above"` | `"collapsed"` | Per-page dropdown visual state (demo/testing; runtime defaults to collapsed until opened). |
| `pageOffsetDropdownState` | `"collapsed" \| "expanded-below" \| "expanded-above"` | `"collapsed"` | Page-offset dropdown visual state (demo/testing). |
| `responsiveMode` | `"auto" \| "keep-inline"` | `"auto"` | Responsive layout strategy (see **Responsiveness**). |
| `collapseOrder` | `("results-per-page" \| "page-input" \| "first-last-buttons")[]` | `["results-per-page"]` | Collapse priority when `responsiveMode="auto"`. |

### Outputs / events

| Output (Angular) | Callback (React) | Payload | Emitted when |
|---|---|---|---|
| `pageChange` | `onPageChange` | `page: number` | Any navigation commits a new page: first, previous, next, last, page input commit (`Enter`/blur), or page-offset option select. |
| `pageSizeChange` | `onPageSizeChange` | `size: number` | User selects a new per-page option from the dropdown. |
| `firstPageNavigate` | `onFirstPageNavigate?` | `void` | First-page button activated (before `pageChange`). |
| `previousPageNavigate` | `onPreviousPageNavigate?` | `void` | Previous-page button activated (before `pageChange`). |
| `nextPageNavigate` | `onNextPageNavigate?` | `void` | Next-page button activated (before `pageChange`). |
| `lastPageNavigate` | `onLastPageNavigate?` | `void` | Last-page button activated (before `pageChange`). |

Navigation buttons at boundaries remain visible and use `disabled` styling; they do not emit navigation events when disabled.

### Datagrid footer integration (`DatagridPaginationSlot`)

When pagination is hosted inside an IDS Datagrid footer (see `components/ids/datagrid/design-spec.md` → `DatagridFooter`; Figma datagrid frame **`48122:183847`**, embedded pagination instance **`47962:168577`**):

| Layer | Background | Border | Notes |
|---|---|---|---|
| `DatagridFooter` host (`.footer`) | **transparent** (pass-through) | **none** | Wrapper only |
| `PaginationRoot` (`ids-pagination` / `IdsPagination`) | `background="gray"` → `var(--color-background-surface-primary)` | **top only** **`1px solid var(--color-border-gray-neutral-base)`** | **No** left, right, or bottom outer border — those edges are owned by the datagrid table shell (`.contentRow` / `.gridWrap`) |
| Pagination interior chrome | per pagination spec | per pagination spec | Per-page dropdown, page input, and nav controls keep their internal borders |

Runtime contract: datagrid implementations pass `background="gray"`, **`embeddedInDatagrid={true}`** / `[embeddedInDatagrid]="true"`, which applies **`rootEmbedded`** — **`border: 0; border-top: 1px solid var(--color-border-gray-neutral-base)`** on `PaginationRoot`.

### Spec Accurate Design defaults

```ts
{
  currentPage: 1,
  totalPages: 16,
  pageSize: 25,
  pageSizeOptions: [25, 50, 75, 100],
  showPerPage: true,
  showFirstLast: true,
  showPageOffset: false,
  background: "gray",
}
```

## Icon Component (implementation)

All glyphs resolve through the shared **`Icon`** primitive (`storybook/src/components/Icon.tsx` in the reference implementation). Slugs map to `assets/icons/<shapeName>.svg`. Use default `variant="mask"` unless the target asset requires `img` or `inline`.

| Slot | `shapeName` | Render size | Color / tint |
|---|---|---|---|
| First page | `double-chev-left` | `16×16` | Parent nav button: `var(--color-icon-brand-base)`; disabled: `var(--color-icon-gray-disabled)` |
| Previous page | `chev-left` | `16×16` | Same as first page |
| Next page | `chev-right` | `16×16` | Same as first page |
| Last page | `double-chev-right` | `16×16` | Same as first page |
| Per-page dropdown caret | `arrow-drop-tri-caret` | `10×10` | `var(--color-icon-gray-neutral-base)`; disabled: `var(--color-icon-gray-disabled)` |

### Rendering rules

- **Navigation arrows:** wrap each `Icon` in a native `<button type="button">` with `aria-label`. Set button `color` to the semantic icon token; `Icon` inherits tint via `currentColor` (mask variant). Always render all four controls on multi-page views; use `disabled` + `var(--color-icon-gray-disabled)` at boundaries — do not remove controls.
- **Dropdown carets:** render inside the dropdown trigger button. Pass explicit `style={{ width: 10, height: 10 }}` on `Icon` — the primitive defaults to `16×16` inline and CSS classes alone cannot override that.
- **Navigation size:** pass explicit `style={{ width: 16, height: 16 }}` on nav `Icon` instances for deterministic sizing across frameworks.
- **Codegen:** when the target library provides a shared `Icon` (or equivalent), generators MUST compose all pagination glyphs through it with `shapeName` (or equivalent prop). Do not emit inline SVG paths, raw `<img>`, or per-component asset globs in pagination source.
- **Fallback:** inline SVG is permitted only when no reusable icon primitive exists in the target library.

### Reference usage (React)

```tsx
<button type="button" className={styles.iconButton} disabled={atFirstPage} aria-label="First page">
  <Icon shapeName="double-chev-left" className={styles.navIcon} style={{ width: 16, height: 16 }} />
</button>

<button type="button" className={styles.dropdownTrigger} aria-label="Items per page">
  <span>{pageSize}</span>
  <Icon shapeName="arrow-drop-tri-caret" className={styles.caretIcon} style={{ width: 10, height: 10 }} />
</button>
```
## Codegen Contract (Framework-Agnostic Blueprint)
Deterministic structure:
  1. `PaginationRoot`
  2. optional `ResultsPerPageGroup`
  3. `PageNavigationGroup` (`PageInput` text field — never a page-number dropdown)
Variant matrix:
  - `background`: `gray | white | none` (default `gray`)
  - `pageNumberState`: `first | middle | last | single-page`
  - `perPageMenu`: `none | open-below | open-above`
  - `rowState`: `default | hover | press | selected`
- Per-slot style contract:
  - Use IDS semantic variables above.
  - Results-per-page dropdown trigger + menu corners are square (`border-radius: 0`).
  - `PageCountText` string contract: `of {totalPages}` (single space).
  - Dropdown rows reserve transparent top/bottom borders in default to prevent jump.
- Behavior contract:
  - Recompute navigation disabled states on every `currentPage`/`totalPages` update.
  - Preserve keyboard focus after page changes where possible.
  - Per-page menu selects and closes deterministically.
  - In `responsiveMode="auto"`, adapt layout using the responsive order defined in `## Responsiveness`.
  - Do not alter semantic states or icon mapping during responsive transitions.
- Accessibility contract:
  - Root `nav` with label `"Pagination"` (or consumer override).
  - Disabled controls expose `aria-disabled` where native `disabled` not available.
  - Current page context must be available to assistive tech via summary text or equivalent.
  - Dropdown trigger exposes `aria-expanded` and `aria-controls`.
- Asset/bundling:
  - See **Icon Component (implementation)** for the authoritative `shapeName` → size → color mapping.
  - Icon slugs (summary):
    - Per-page dropdown caret: `arrow-drop-tri-caret` (`10×10`)
    - First page: `double-chev-left` (`16×16`)
    - Previous page: `chev-left` (`16×16`)
    - Next page: `chev-right` (`16×16`)
    - Last page: `double-chev-right` (`16×16`)
  - Codegen icon resolution rule:
    - Generator MUST use the library `Icon` component with `shapeName`/icon-name mapping above instead of inlining SVG paths.
    - Inline SVG is fallback-only when no reusable icon component exists in the target library.
- Fallback/error rules:
  - `totalPages < 1` -> normalize to `1`.
  - `currentPage` out of range -> clamp.
  - Empty/invalid `pageSizeOptions` -> fallback to `[25, 50, 75, 100]`.
### Validation checklist
- [ ] Navigation arrows and dropdown carets render via shared `Icon` with documented `shapeName` and explicit sizes (`16×16` nav, `10×10` carets).
- [ ] `Pagination - Main` layout from `11677:157840` is represented with all three background modes (`gray`, `white`, `none`).
- [ ] Per-page dropdown states/placements from `37721:115839` are represented.
- [ ] Page-number states from `11677:157817` use `.TextBox` input (not a dropdown).
- [ ] IDS token names are used (no DAP-only variable names).
- [ ] Results-per-page dropdown trigger/menu border radius remains `0` (square corners).
- [ ] Dropdown rows use stable top/bottom border reservation and IDS row interaction contract.
- [ ] Light/Dark states are structurally parallel and token-driven.
- [ ] Spec defines deterministic responsive behavior for narrow containers (`width: 100%` container-driven runtime).
- [ ] `embeddedInDatagrid` / `rootEmbedded` datagrid footer uses **top border only** on `PaginationRoot` (no left/right/bottom double-border with shell).
## Source Mapping
- Runtime contract: `component-contracts/ids/pagination.contract.ts`
- Reference implementation (React): `storybook/src/components/IdsPagination.tsx`
- Reference implementation (Angular): `storybook-angular/src/components/ids-pagination/`
- Baseline reference reused: `components/DAP/pagination/design-spec.md` (structure/behavior contract).
- IDS authoritative nodes:
  - Main: `11677:157840`
  - Main row verification: `11677:157848`
  - Page navigation states: `11677:157817`
  - Per-page dropdown states: `37721:115839`
  - Datagrid-embedded footer: `48122:183847` / `47962:168577`
- Live verification evidence:
  - `get_metadata`, `get_design_context`, `get_variable_defs` run on all nodes above.

## Implementation Notes
- **Background variants (2026-06-19)**: Three `background` prop values — `gray` (default, `var(--color-background-surface-primary)`), `white` (`var(--color-background-surface-component)`), `none` (transparent). Matches Figma `Pagination - Main` property `Background=Gray | White | None`.
- **Height (2026-06-19)**: Root uses `box-sizing: border-box` and `height: 48px` so total height including border is 48px.
- **Caret icon (2026-06-19)**: Per-page dropdown caret (`arrow-drop-tri-caret`) must render at 10×10px via explicit `style={{ width: 10, height: 10 }}` on `Icon` (inline default is 16px).
- **Page number (2026-06-19)**: Figma `.TextBox` (`11677:157819`) — numeric text input only; no page-number dropdown in IDS or Synapse.
- **Navigation arrows (2026-06-19)**: First/previous/next/last controls always render on multi-page views; boundary positions use disabled styling instead of hiding controls. All four use shared `Icon` with `style={{ width: 16, height: 16 }}`; button `color` drives `var(--color-icon-brand-base)` / `var(--color-icon-gray-disabled)`.
- **Datagrid embed (2026-07-06)**: Pass **`embeddedInDatagrid`** when hosted in datagrid footer; **`rootEmbedded`** class sets `border: 0; border-top: 1px solid var(--color-border-gray-neutral-base)` so shell owns left/right/bottom edges.
