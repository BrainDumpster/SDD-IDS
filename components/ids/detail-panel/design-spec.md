# Detail Panel Design Spec

## Metadata
- Component: Detail Panel
- Design System: IDS
- Category: Table and Data Grids
- Datagrid-attached (expanded): https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=44257-246888&m=dev
- Datagrid-attached (collapsed): https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=44332-174644&m=dev
- Page-attached (expanded): https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=44333-174879&m=dev
- Page-attached (collapsed): https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=44333-174882&m=dev
- File key: `0bHk3XhrjFhowgFkz9yLr4`
- Validated nodes: `44257:246888`, `44332:174644`, `44333:174879`, `44333:174882`
- Verification method: Figma MCP (`get_metadata`, `get_design_context`, `get_variable_defs`)
- Last verified: 2026-04-30 (current session)
- Component map baseline: `data/component-figma-map.json` entry exists for "Detail Panel"; this spec is upgraded to IDS Design Library nodes above.
## Anatomy
- `DetailPanel` / `DetailPanelRoot` (host)
- `DetailPanelContent` (expanded branch)
  - `DetailPanelHeader` (`attachMode="datagrid"` expanded)
    - `DetailPanelTitle`
    - `DetailPanelToggleButton` (header chrome)
  - `DetailPanelBody`
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
- Shared width behavior:
  - expanded width: `398px`
  - collapsed width: `40px`
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
  - `DetailPanelHeader` (datagrid expanded): `min-height: 48px`, padding `14px 12px 14px 24px`, border-bottom `1px solid var(--color-border-gray-neutral-base)`.
  - `DetailPanelFooter` (page expanded): `min-height: 44px`, padding `14px 12px`, border-top `1px solid var(--color-border-gray-neutral-base)`, toggle right-aligned.
  - body content area is scrollable when content exceeds available vertical space.
- Collapsed mode composition:
  - icon-only rail of width `40px` with centered/edge-aligned toggle control per mode.
  - Datagrid collapsed rail: padding `var(--spacing-space-16) var(--padding-padding-12)` (`16px 12px`), toggle aligned `flex-start` (top).
  - Page collapsed rail: padding `var(--padding-padding-12)` (`12px`), toggle aligned `flex-end` (bottom).
- Runtime sizing constraints:
  - `DetailPanel` uses `box-sizing: border-box`.
  - width transition is state-driven only (`398px <-> 40px`) and must not introduce intermediate non-deterministic layout widths in codegen outputs.
  - body region must allow vertical scroll when content exceeds available height.
### Responsiveness
- Host-driven height remains authoritative in all breakpoints:
  - datagrid mode follows datagrid host height.
  - page mode follows page host/content container height.
- Width behavior is fixed by state, not viewport:
  - expanded stays `398px`
  - collapsed stays `40px`
- On narrow viewports:
  - panel remains docked to host edge and preserves toggle accessibility.
  - host layout handles remaining content width; detail panel contract does not auto-switch to overlay mode.
- Long titles/body content:
  - title must truncate gracefully (no layout break).
  - body must scroll internally without shifting header/footer/toggle placement.
## Tokens
- Surface/background:
  - `var(--color-background-surface-component)`
  - `var(--color-background-controls-base)` (for nested actions shown in template content)
- Border:
  - `var(--color-border-gray-neutral-base)`
  - `var(--color-border-brand-transparent-brand)`
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
## States (Dark Theme)
| Slot | State | Background | Border | Text/Icon |
|---|---|---|---|---|
| `DetailPanel` | expanded/collapsed | semantic token-resolved | semantic token-resolved | semantic token-resolved |
| `DetailPanelToggleButton` | default/hover/press/focus-visible | semantic token-resolved | semantic token-resolved | semantic token-resolved |
| `DetailPanelHeader` | default | semantic token-resolved | semantic token-resolved | semantic token-resolved |
| `DetailPanelFooter` | default | semantic token-resolved | semantic token-resolved | semantic token-resolved |

Dark table is structurally parallel to light; runtime must not hardcode color literals.
## Interactions
- Toggle behavior (both modes):
  - clicking the chevron control toggles `expanded <-> collapsed`.
  - expanded shows `double-chev-right`.
  - collapsed shows `double-chev-left`.
- Datagrid-attached mode:
  - toggle control lives in header section.
  - header always remains visible in expanded mode.
- Page-attached mode:
  - toggle control lives in footer section.
  - footer always remains visible in expanded mode.
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

`DetailPanelHeader` / `DetailPanelFooter` project `DetailPanelToggleButton` into the controls cluster; remaining header children are the title.

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
- `expandedWidth?: number` (default `398`)
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
  - root width uses `398px` expanded and `40px` collapsed.
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
  - invalid widths (`<= 0`) -> fallback to `expanded=398`, `collapsed=40`.
  - missing `onExpandedChange` -> component may render but must not throw; local state fallback allowed.
  - `showHeader=false` while `attachMode=datagrid` and expanded -> ignore override and render header to preserve contract.
  - `showFooter=false` while `attachMode=page` and expanded -> ignore override and render footer to preserve contract.
- Validation checklist:
  - [x] expanded/collapsed widths are exactly `398`/`40`.
  - [x] datagrid variant uses `Header + Body`; page variant uses `Body + Footer`.
  - [x] expanded icon is `double-chev-right`; collapsed icon is `double-chev-left`.
  - [x] toggle icon color is `var(--color-icon-gray-neutral-base)` in both variants.
  - [x] toggle click/keyboard activation correctly toggles panel state.
  - [x] root height tracks host container (datagrid/page) rather than fixed sample heights.
  - [x] light/dark state tables remain structurally parallel and token-driven.
  - [x] datagrid/page branch invariants are preserved in expanded and collapsed states.
  - [x] responsive behavior remains host-driven with fixed state widths (`398/40`) and internal body scroll.
## Implementation Notes (2026-07-09)

All validation checklist items verified and passing as of 2026-07-09.

- **Toggle icon color** — Render via `<Icon shapeName={...} />` (default `mask` variant) and set `.toggleButton { color: var(--color-icon-gray-neutral-base); }` so the glyph inherits color through `currentColor`, correctly tracking light/dark token values.
- **Header and footer heights** — `DetailPanelHeader` uses `min-height: 48px`; `DetailPanelFooter` uses `min-height: 44px` — two separate CSS rules.
- **Collapsed rail padding** — Datagrid rail: `var(--spacing-space-16, 16px) var(--padding-padding-12, 12px)` (toggle top-aligned); page rail: `var(--padding-padding-12, 12px)` (toggle bottom-aligned).
- **Host border overlap** — Wrap the panel in `margin: -1px -1px -1px 0` so the panel border collapses onto the host border into a single `1px` line (Figma `space-minus-1`); left edge retains its `1px` as the divider against host content.

## Source Mapping
- Component map baseline:
  - `data/component-figma-map.json` -> component `"Detail Panel"` (legacy exploration node)
- IDS authoritative nodes used for this spec:
  - Datagrid expanded: `44257:246888`
  - Datagrid collapsed: `44332:174644`
  - Page expanded: `44333:174879`
  - Page collapsed: `44333:174882`
- Live verification evidence:
  - `get_metadata` on all four nodes (dimensions/structure)
  - `get_design_context` on all four nodes (layout + icon placement/sections)
  - `get_variable_defs` on expanded nodes (`44257:246888`, `44333:174879`) for token validation
- Storybook reference: `storybook/src/components/IdsDetailPanel.tsx` / `IdsDetailPanel.stories.tsx`
- Lib React implementation (no Base UI): `lib/react/ids/detail-panel/` (`IdsDetailPanel.tsx`, `IdsDetailPanel.module.css`; selectors `ids-detail-panel`, …); stories: `storybook/src/components/lib-generated/DetailPanel.stories.tsx`
- Runtime contract: `component-contracts/ids/detail-panel.contract.ts`
- Angular library: `lib/angular/ids/detail-panel/`
- Angular Storybook: `storybook-angular/src/components/ids-detail-panel/`
