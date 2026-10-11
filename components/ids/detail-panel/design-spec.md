# Detail Panel Design Spec

## Metadata
- Component: Detail Panel
- Design System: IDS
- Category: Table and Data Grids
- Datagrid-attached (expanded): https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=44257-246888&m=dev
- Datagrid-attached (collapsed): https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=44332-174644&m=dev
- Page-attached (expanded): https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=44333-174879&m=dev
- Page-attached (collapsed): https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=44333-174882&m=dev
- Component page (variants + content template): https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=44257-239637&m=dev
- File key: `0bHk3XhrjFhowgFkz9yLr4`
- Validated nodes: `44257:246888`, `44332:174644`, `44333:174879`, `44333:174882`, `44257:239637`
- Verification method: Figma MCP (`get_metadata`, `get_design_context`, `get_variable_defs`)
- Behavior source: IDS website Detail Panel guideline (Usage Rules → For Data Grid / For Page)
- Last verified: 2026-10-11
- Component map baseline: `data/component-figma-map.json` entry exists for "Detail Panel"; this spec is upgraded to IDS Design Library nodes above.
## Anatomy
- `DetailPanel` / `DetailPanelRoot` (host)
- `DetailPanelContent` (expanded branch)
  - `DetailPanelHeader` (`attachMode="datagrid"` expanded)
    - `DetailPanelTitle`
    - `DetailPanelDetachButton` (optional pop-out control, `popout-window-arrow` `16x16`; datagrid only)
    - `DetailPanelToggleButton` (header chrome)
  - `DetailPanelBody`
    - `DetailPanelSection` (Figma `.Section Header for details panel` + rows)
      - `DetailPanelField` (Figma `.Key value for details panel`: label / value row)
    - `DetailPanelBlock` (padded free-form content: inline alerts, text, graphics)
    - Tabs (`IdsTabs`, edge to edge)
  - `DetailPanelFooter` (`attachMode="page"` expanded)
    - `DetailPanelToggleButton` (footer chrome)
- `DetailPanelCollapsedRail` (collapsed branch)
  - `DetailPanelToggleButton`
- Variant branch: `attachMode="datagrid"`
  - expanded: `DetailPanelHeader` + `DetailPanelBody`
  - collapsed: `DetailPanelCollapsedRail` (icon-only)
- Variant branch: `attachMode="page"`
  - expanded: `DetailPanelBody` + `DetailPanelFooter`
  - collapsed: `DetailPanelCollapsedRail` (icon-only)
- Toggle icons:
  - expanded icon: `double-chev-right` (`16x16`)
  - collapsed icon: `double-chev-left` (`16x16`)

Angular composition (canonical child order):

```
ids-detail-panel
  ids-detail-panel-content
    ids-detail-panel-header
      ids-detail-panel-title
    ids-detail-panel-body
    ids-detail-panel-footer
  ids-detail-panel-collapsed-rail
    ids-detail-panel-toggle-button
```

Datagrid expanded projects header + title + body (no footer). Page expanded projects body + footer (no header). Collapsed projects rail + toggle only.
## Layout & Measurements
- Width behavior (IDS guideline; Figma frames draw both modes at `398px`):
  - datagrid expanded (docked): content-driven, `min-width: 240px`, `max-width: 480px`. An explicit `expandedWidth` is clamped to `240–480`.
  - datagrid floating (popped out): starts at the docked rectangle; user-resizable between `240×160` and `480×1280`.
  - page expanded: `384px` (guideline maximum); an explicit `expandedWidth` never exceeds `384`.
  - collapsed (both modes): `40px`.
- Datagrid-attached mode:
  - root height is tied to datagrid height (`height: 100%` of datagrid container at runtime).
  - sample in Figma node `44257:246888` / `44332:174644`: `792px`.
- Page-attached mode:
  - root height is tied to page content region height (`height: 100%` of page container at runtime).
  - sample in Figma node `44333:174879` / `44333:174882`: `1024px`.
- Borders:
  - root border: `1px solid var(--color-border-gray-neutral-base)`.
  - sections use same accessible border continuity as shown in source nodes.
  - **Host integration overlap**: when panel shares a border with its host container, the panel wrapper must be offset `−1px` on top/right/bottom (`margin: -1px -1px -1px 0`) so the two borders collapse into a single `1px` line. Figma token: `var(--spacing/space-minus-1, -1px)`.
- Expanded mode composition:
  - toggle control area uses right-side placement (header for datagrid mode, footer for page mode).
  - `DetailPanelHeader` (datagrid expanded): `min-height: 48px`, padding `14px 12px 14px 24px`, border-bottom `1px solid var(--color-border-gray-neutral-base)`, `align-items: flex-start` (Figma items-start: controls sit on the first title line), gap `var(--spacing-space-16)` between title and controls. Inside `IdsDatagrid` the header is pinned to the grid's `48px` column-header band and centered.
  - Header controls cluster: pop-out first, expand/collapse toggle last (right edge), gap `var(--spacing-space-16)` (`16px`).
  - `DetailPanelFooter` (page expanded): `min-height: 44px`, padding `14px 12px`, border-top `1px solid var(--color-border-gray-neutral-base)`, toggle right-aligned.
  - `DetailPanelBody`: no padding of its own (content blocks carry the Figma insets); flex column, gap `var(--spacing-space-8)` (`8px`). Page mode adds `padding-top: var(--padding-padding-16)` (`16px`). Scrollable when content exceeds available vertical space.
- Content blocks (Figma `.Details_Panel-Template`):
  - `DetailPanelSection` header: `min-height: 40px`, padding `10px 12px 10px 24px` (`--padding-padding-10/12/24`), `14/20` medium, `var(--color-text-gray-neutral-strong)`, single line with ellipsis.
  - Consecutive sections are separated by a full-width `1px` rule `var(--color-border-gray-neutral-light)` on the following section's top edge.
  - `DetailPanelField` rows: two-column grid (`fit-content(50%)` label, `minmax(0, 1fr)` value), each cell `min-height: 40px`.
    - label: `min-width: 72px`, padding `10px 12px 10px 24px`, `14/20` regular, `var(--color-text-gray-neutral-strong)`; Figma shows a trailing colon (`Label:`).
    - value: padding `10px 12px 10px 16px`, `14/20` regular, `var(--color-text-gray-neutral)`; long values wrap onto more lines.
  - `DetailPanelBlock`: padding `var(--padding-padding-24)` (`24px`), flex column, gap `8px` — for inline alerts, text, graphics, empty states.
  - Tabs go straight into the body so the tab strip runs edge to edge.
- Collapsed mode composition:
  - icon-only rail of width `40px` with centered/edge-aligned toggle control per mode.
  - Datagrid collapsed rail: padding `var(--spacing-space-16) var(--padding-padding-12)` (`16px 12px`), toggle aligned `flex-start` (top).
  - Page collapsed rail: padding `var(--padding-padding-12)` (`12px`), toggle aligned `flex-end` (bottom).
- Runtime sizing constraints:
  - `DetailPanel` uses `box-sizing: border-box`.
  - width is state-driven: page `384px <-> 40px`; datagrid content width (`240–480px`) `<-> 40px`; floating keeps the user's size until docked.
  - body region must allow vertical scroll when content exceeds available height.
### Responsiveness
- Host-driven height remains authoritative in all breakpoints:
  - datagrid mode follows datagrid host height.
  - page mode follows page host/content container height.
- Width behavior follows state and content, not viewport:
  - datagrid expanded: content width within `240–480px`
  - page expanded: `384px`
  - collapsed: `40px`
- On narrow viewports:
  - panel remains docked to host edge and preserves toggle accessibility.
  - host layout handles remaining content width; the panel never switches to overlay on its own. Floating is user-initiated (datagrid pop-out) and kept inside the viewport.
- Long titles/body content:
  - title must truncate gracefully (no layout break).
  - body must scroll internally without shifting header/footer/toggle placement.
## Tokens
- Surface/background:
  - `var(--color-background-surface-component)`
  - `var(--color-background-controls-base)` (for nested actions shown in template content)
- Border:
  - `var(--color-border-gray-neutral-base)`
  - `var(--color-border-gray-neutral-light)` (section divider; Figma `--color-border-light`, not in the theme, same `#c5c5c5`)
  - `var(--color-border-brand-transparent-brand)`
- Elevation (floating datagrid panel):
  - `var(--shadow-drop-shadow-4-x/y/blur/spread/color)` + `var(--shadow-drop-shadow-8-x/y/blur/spread/color)`
- Spacing:
  - `var(--padding-padding-10)`, `var(--padding-padding-12)`, `var(--padding-padding-16)`, `var(--padding-padding-24)`, `var(--spacing-space-8)`, `var(--spacing-space-16)`
- Text:
  - `var(--color-text-gray-neutral-strong)`
  - `var(--color-text-gray-neutral)`
  - `var(--color-text-brand-strong)`
  - `var(--color-text-gray-white)`
  - `var(--color-text-link-brand-base)`
- Icon:
  - `var(--color-icon-gray-neutral-base)` (required for both expand/collapse toggle icons)
  - toggle icon color MUST be token-driven via `currentColor`: set `color: var(--color-icon-gray-neutral-base)` on the button element and render the icon with the default `mask` variant so the glyph inherits the token. Do NOT use a hardcoded CSS `filter` — a fixed filter does not track `[data-theme="dark"]`.
  - `var(--color-icon-gray-neutral-accessible)`
- Typography:
  - `Base Styles/Data Header` (14/20 medium)
  - `Body 2` (14/20 regular)
## States (Light Theme)
| Slot | State | Background | Border | Text/Icon |
|---|---|---|---|---|
| `DetailPanel` | expanded | `var(--color-background-surface-component)` | `1px solid var(--color-border-gray-neutral-base)` | text token-resolved |
| `DetailPanel` | collapsed | `var(--color-background-surface-component)` | `1px solid var(--color-border-gray-neutral-base)` | icon token-resolved |
| `DetailPanelToggleButton` | default | transparent | none | `double-chev-right` or `double-chev-left` in `var(--color-icon-gray-neutral-base)` |
| `DetailPanelToggleButton` | hover | transparent | none | `var(--color-icon-gray-neutral-base)` |
| `DetailPanelToggleButton` | press | transparent | none | `var(--color-icon-gray-neutral-base)` |
| `DetailPanelToggleButton` | focus-visible | transparent | focus outline/focus ring tokenized | icon unchanged |
| `DetailPanelHeader` (datagrid expanded) | default | `var(--color-background-surface-component)` | `1px solid var(--color-border-gray-neutral-base)` | title `var(--color-text-gray-neutral-strong)` |
| `DetailPanelFooter` (page expanded) | default | `var(--color-background-surface-component)` | `1px solid var(--color-border-gray-neutral-base)` | icon `var(--color-icon-gray-neutral-base)` |
| `DetailPanelDetachButton` | default/hover/press | transparent | none | `popout-window-arrow` in `var(--color-icon-gray-neutral-base)` |
| `DetailPanelDetachButton` | focus-visible | transparent | focus outline/focus ring tokenized | icon unchanged |
| `DetailPanel` | floating (datagrid) | `var(--color-background-surface-component)` | `1px solid var(--color-border-gray-neutral-base)` + Shadow 4/8 drop shadows | text token-resolved |
| `DetailPanelSection` | default | transparent | top `1px solid var(--color-border-gray-neutral-light)` when following another section | header `var(--color-text-gray-neutral-strong)` |
| `DetailPanelField` | default | transparent | none | label `var(--color-text-gray-neutral-strong)`, value `var(--color-text-gray-neutral)` |
## States (Dark Theme)
| Slot | State | Background | Border | Text/Icon |
|---|---|---|---|---|
| `DetailPanel` | expanded/collapsed | semantic token-resolved | semantic token-resolved | semantic token-resolved |
| `DetailPanelToggleButton` | default/hover/press/focus-visible | semantic token-resolved | semantic token-resolved | semantic token-resolved |
| `DetailPanelHeader` | default | semantic token-resolved | semantic token-resolved | semantic token-resolved |
| `DetailPanelFooter` | default | semantic token-resolved | semantic token-resolved | semantic token-resolved |
| `DetailPanelDetachButton` | default/hover/press/focus-visible | semantic token-resolved | semantic token-resolved | semantic token-resolved |
| `DetailPanel` | floating (datagrid) | semantic token-resolved | semantic token-resolved | semantic token-resolved |
| `DetailPanelSection` | default | semantic token-resolved | semantic token-resolved | semantic token-resolved |
| `DetailPanelField` | default | semantic token-resolved | semantic token-resolved | semantic token-resolved |

Dark table is structurally parallel to light; runtime must not hardcode color literals.
## Interactions
- Toggle behavior (both modes):
  - clicking the chevron control toggles `expanded <-> collapsed`.
  - expanded shows `double-chev-right`.
  - collapsed shows `double-chev-left`.
- Datagrid-attached mode (with `IdsDatagrid`):
  - toggle control lives in header section.
  - header always remains visible in expanded mode.
  - clicking a row opens the panel on that row; only one row is active at a time; clicking another row swaps the content; clicking the active row again (or the double chevron) collapses the panel and clears the row.
  - title is the row's name, `"Details"` when there is none.
  - pop-out (optional `DetailPanelDetachButton`): toggles docked `<->` floating. The floating panel leaves the layout (the grid takes the full width), starts where the docked panel was, is moved by dragging its header and resized from its bottom-right corner (max `480×1280`). Focus stays on the pop-out control across the switch. Collapsing a floating panel docks the rail.
- Page-attached mode:
  - toggle control lives in footer section.
  - footer always remains visible in expanded mode.
  - the panel is always present beside the page content and can only be collapsed (no close, no pop-out).
  - with a data grid, one row is always highlighted and drives the panel: the first row by default; clicking another row moves the highlight (Secondary Blue 50 background + vertical blue bar via `rowVerticalIndicator`); clicking the highlighted row keeps it. Wire it with `IdsDatagrid` `activeRowId` + `onRowClick`. Collapsing keeps the highlight.
- Keyboard:
  - `Tab` focuses toggle.
  - `Enter` / `Space` toggles expand/collapse.
- Focus:
  - focus-visible styling must be present on toggle control.
## Composition & API (runtime)

### Compound composition

```
DetailPanel
  DetailPanelContent                 — expanded branch (hidden when collapsed)
    datagrid: DetailPanelHeader + DetailPanelBody
    page:     DetailPanelBody + DetailPanelFooter
  DetailPanelCollapsedRail           — collapsed icon-only rail (hidden when expanded)
    DetailPanelToggleButton
```

`DetailPanelHeader` / `DetailPanelFooter` project `DetailPanelToggleButton` (and, in the header, `DetailPanelDetachButton`) into the controls cluster; remaining header children are the title.

Body content blocks:

- `DetailPanelSection` — `title?: ReactNode`, children `DetailPanelField` rows; renders `section[aria-labelledby] > h4 + dl`.
- `DetailPanelField` — `label: ReactNode`, children = value; renders `dt` + `dd`.
- `DetailPanelBlock` — padded container for free-form content.

### `DetailPanel` (root) props

**Required**

- `attachMode: "datagrid" | "page"`

**Optional**

- `isExpanded?: boolean` (controlled); when omitted, uses local / `defaultExpanded` state
- `onExpandedChange?: (next: boolean) => void`
- `defaultExpanded?: boolean` (default `true`)
- `ariaLabelExpand?: string` (default `"Expand details panel"`)
- `ariaLabelCollapse?: string` (default `"Collapse details panel"`)
- `className?: string`
- `collapsedWidth?: number` (default `40`)
- `expandedWidth?: number` — datagrid: content-driven by default, clamped to `240–480`; page: default `384`, max `384`
- `isDetached?: boolean` (controlled floating state; datagrid only, ignored while collapsed)
- `defaultDetached?: boolean` (default `false`)
- `onDetachedChange?: (next: boolean) => void`
- `id?: string` (for deterministic `aria-controls` linkage)

Body content is projected via `DetailPanelBody` children (not a root `body` prop). Header title is projected as `DetailPanelHeader` children (or optional `DetailPanelTitle`).
## Codegen Contract (Framework-Agnostic Blueprint)
Deterministic structure:
  1. `DetailPanel`
  2. `DetailPanelContent` (expanded only)
     - datagrid: `DetailPanelHeader` + `DetailPanelBody` (+ `DetailPanelToggleButton` in header)
     - page: `DetailPanelBody` + `DetailPanelFooter` (+ `DetailPanelToggleButton` in footer)
  3. `DetailPanelCollapsedRail` (collapsed only) + `DetailPanelToggleButton`
- Branch invariants:
  - datagrid expanded branch MUST include header.
  - page expanded branch MUST include footer.
  - collapsed branch MUST be icon-only rail (body/content hidden).
Variant matrix:
  - `attachMode`: `datagrid | page`
  - `panelState`: `expanded | collapsed`
  - `toggleState`: `default | hover | press | focus-visible`
- Per-slot style contract:
  - root width: datagrid expanded content-driven `240–480px`; page expanded `384px`; collapsed `40px`.
  - root border uses `1px solid var(--color-border-gray-neutral-base)`.
  - toggle icon size is fixed `16px`.
  - toggle icon color uses `var(--color-icon-gray-neutral-base)`.
  - datagrid-expanded uses header+body; page-expanded uses body+footer.
- Behavior contract:
  - toggle action is deterministic and idempotent (`onExpandedChange(!isExpanded)` once per activation).
  - datagrid mode root height follows datagrid container height.
  - page mode root height follows page container height.
  - collapsed mode hides body content from layout and assistive tech flow (unless explicitly configured otherwise).
  - expanded mode restores the correct mode-specific branch (`Header+Body` or `Body+Footer`) without losing body scroll position unless host explicitly resets content.
- Accessibility contract:
  - root should be an `aside` landmark (or equivalent region role) with accessible label.
  - toggle button exposes `aria-expanded` reflecting panel state.
  - toggle button SHOULD expose `aria-controls` linking to body container id when body is present.
  - toggle button accessible name switches between expand/collapse labels.
  - keyboard activation supports `Enter` and `Space`.
  - collapsed rail must remain reachable in tab order via toggle button.
- Asset/bundling:
  - expanded state icon: `double-chev-right`
  - collapsed state icon: `double-chev-left`
  - generator MUST use project/library `Icon` component with `shapeName`/icon-name mapping when available; inline SVG is fallback-only.
- Fallback/error rules:
  - unknown `attachMode` -> fallback to `datagrid`.
  - invalid widths (`<= 0`) -> fallback to datagrid content width / page `384`, `collapsed=40`.
  - `isDetached` on a page panel -> ignored (page panels never float).
  - missing `onExpandedChange` -> component may render but must not throw; local state fallback allowed.
  - `showHeader=false` while `attachMode=datagrid` and expanded -> ignore override and render header to preserve contract.
  - `showFooter=false` while `attachMode=page` and expanded -> ignore override and render footer to preserve contract.
- Validation checklist:
  - [x] datagrid expanded width follows content within `240–480`; page expanded is `384`; collapsed is `40`.
  - [x] datagrid variant uses `Header + Body`; page variant uses `Body + Footer`.
  - [x] expanded icon is `double-chev-right`; collapsed icon is `double-chev-left`.
  - [x] toggle icon color is `var(--color-icon-gray-neutral-base)` in both variants.
  - [x] toggle click/keyboard activation correctly toggles panel state.
  - [x] root height tracks host container (datagrid/page) rather than fixed sample heights.
  - [x] light/dark state tables remain structurally parallel and token-driven.
  - [x] datagrid/page branch invariants are preserved in expanded and collapsed states.
  - [x] responsive behavior remains host-driven with internal body scroll.
  - [x] body has no padding; sections / fields / blocks carry the Figma insets; section divider uses `var(--color-border-gray-neutral-light)`.
  - [x] datagrid pop-out floats, moves by header drag, resizes up to `480×1280`, and docks back with focus kept on the control.
  - [x] page panel with a data grid keeps one row highlighted (first by default).
## Implementation Notes (2026-07-09)

All validation checklist items verified and passing as of 2026-07-09.

- **Toggle icon color** — Render via `<Icon shapeName={...} />` (default `mask` variant) and set `.toggleButton { color: var(--color-icon-gray-neutral-base); }` so the glyph inherits color through `currentColor`, correctly tracking light/dark token values.
- **Header and footer heights** — `DetailPanelHeader` uses `min-height: 48px`; `DetailPanelFooter` uses `min-height: 44px` — two separate CSS rules.
- **Collapsed rail padding** — Datagrid rail: `var(--spacing-space-16, 16px) var(--padding-padding-12, 12px)` (toggle top-aligned); page rail: `var(--padding-padding-12, 12px)` (toggle bottom-aligned).
- **Host border overlap** — Wrap the panel in `margin: -1px -1px -1px 0` so the panel border collapses onto the host border into a single `1px` line (Figma `space-minus-1`); left edge retains its `1px` as the divider against host content.

## Implementation Notes (2026-10-11)

- **Body insets** — `DetailPanelBody` has no padding; sections, fields and blocks carry the Figma insets so tabs run edge to edge. Page bodies add `padding-top: var(--padding-padding-16)`.
- **Content blocks** — Use `IdsDetailPanelSection` / `IdsDetailPanelField` / `IdsDetailPanelBlock` (Figma `.Details_Panel-Template`). `IdsDatagrid`'s default panel renders the active row as one section of `Column:` / value fields, and its empty state ("Select a row to view details.") inside a block.
- **Divider token** — Section divider uses `--color-border-gray-neutral-light` (Figma's `--color-border-light` is not in the theme; both resolve to `#c5c5c5`).
- **Header alignment** — `align-items: flex-start` (Figma items-start); `IdsDatagrid` centers its pinned `48px` header.
- **Widths follow the guideline over the `398px` Figma frames** — datagrid content-driven `240–480px`; page `384px` max. `component-contracts/ids/detail-panel.contract.ts` and the Angular library are still on `398` until Angular is updated.
- **Pop-out** — `IdsDetailPanelDetachButton` is opt-in (guideline feature, not a Figma variant). The floating panel stays in place in the DOM (`position: fixed`, no portal) so body state and scroll survive docking and undocking.
- **Page + data grid** — Pass the shown row to `IdsDatagrid` `activeRowId` (first row by default) and update it from `onRowClick`, so one row is always highlighted.

## Source Mapping
- Component map baseline:
  - `data/component-figma-map.json` -> component `"Detail Panel"` (legacy exploration node)
- IDS authoritative nodes used for this spec:
  - Datagrid expanded: `44257:246888`
  - Datagrid collapsed: `44332:174644`
  - Page expanded: `44333:174879`
  - Page collapsed: `44333:174882`
  - Component page / content template: `44257:239637`
- Live verification evidence:
  - `get_metadata` on all four nodes (dimensions/structure)
  - `get_design_context` on all four nodes (layout + icon placement/sections)
  - `get_variable_defs` on expanded nodes (`44257:246888`, `44333:174879`) for token validation
- Storybook reference: `storybook/src/components/IdsDetailPanel.tsx` / `IdsDetailPanel.stories.tsx`
- Lib React implementation (no Base UI): `lib/react/ids/detail-panel/` (`IdsDetailPanel.tsx`, `IdsDetailPanel.module.css`; selectors `ids-detail-panel`, …); stories: `storybook/src/components/lib-generated/DetailPanel.stories.tsx` (Datagrid Attached, With Tabs, With Inline Alert, Pop-out, Page Attached, Page With Datagrid, Collapsed States)
- Runtime contract: `component-contracts/ids/detail-panel.contract.ts`
- Angular library: `lib/angular/ids/detail-panel/`
- Angular Storybook: `storybook-angular/src/components/ids-detail-panel/`
