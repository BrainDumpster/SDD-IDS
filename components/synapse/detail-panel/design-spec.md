# Detail Panel Design Spec

## IDS baseline (layout, flow, contracts)

Synapse **Detail Panel** shares the IDS **Detail Panel** component family. Anatomy, datagrid/page attach modes, expand/collapse toggle contract, and `398px` / `40px` width behavior **inherit IDS** unless listed in **Synapse programme deltas** below.

- **IDS source of truth:** [`components/ids/detail-panel/design-spec.md`](../ids/detail-panel/design-spec.md)
- **Shared implementation:** `storybook/src/components/IdsDetailPanel.tsx` (datagrid + page attach modes)
- **Programme wrapper:** `storybook/src/components/SynapseDetailPanel.tsx`
- **Theme CSS:** `components/synapse-theme.css`

## Metadata

| Property | Value |
|---|---|
| Component | Detail Panel |
| Design system | Synapse |
| Category | Tables |
| Spec pattern | **ids-fork** |
| IDS baseline slug | `detail-panel` |
| Status | **draft** |
| Theme CSS | `components/synapse-theme.css` |
| Verification method | Figma MCP |
| Last verified | 2026-06-22 |

### Live verification evidence

| Check | Node(s) | Method |
|---|---|---|
| Topology page layout set | `54012:298596` | Figma MCP `get_metadata` |
| Layout without panel | `54009:293109` | Figma MCP `get_design_context` |
| Layout with panel | `54012:298595` | Figma MCP `get_design_context` |
| Details Panel chrome | `54102:37235` | Figma MCP `get_design_context` |
| Panel header | `54111:39513` | Figma MCP `get_design_context` |

### Synapse programme deltas (vs IDS)

| Topic | IDS | Synapse |
|---|---|---|
| Attach modes | `datagrid`, `page` | **+ `topology`** for canvas/page layouts |
| Collapsed rail | `40px` icon rail + `double-chev-left` | **Topology:** panel fully hidden when closed (no rail) |
| Header (topology) | Plain title `"Details"` + chevron toggle | **Icon shell (44px)** + **title (16px medium)** + **subtitle (14px)** + **close (`ctrl-close-16`)** |
| Border | Full `var(--color-border-accessible)` box | **Topology:** `border-left` only (`var(--color-border-neutral-light)`) |
| Body template | Freeform host content | **Optional key-value rows** + optional footer actions |
| Footer (topology) | Toggle in page mode footer | **Optional primary/secondary Synapse buttons** inside body stack |
| Datagrid / page modes | IDS contract | **Delegate to `IdsDetailPanel` unchanged** |

## Anatomy

### Shared (IDS — datagrid / page)

Inherit IDS anatomy — see [`components/ids/detail-panel/design-spec.md`](../ids/detail-panel/design-spec.md).

### Topology attach mode (`attachMode="topology"`)

1. **`SynapseDetailPanelRoot`** — `398px` docked column; `height: 100%`; `flex-shrink: 0`
2. **`SynapseDetailPanelHeader`** — icon + titles + close
3. **`SynapseDetailPanelBody`** — scrollable content (`rows` or custom `body`)
4. **`SynapseDetailPanelActions`** (optional) — primary + secondary buttons

## Layout & Measurements

| Slot | Value | Figma evidence |
|---|---|---|
| Expanded width | `398px` | `54102:37235` (same as IDS) |
| Collapsed (topology) | not rendered | `54009:293109` vs `54012:298595` |
| Header padding | `14px 12px 14px 24px` | `54111:39513` |
| Header gap | `var(--spacing-space-16)` | `54111:39513` |
| Icon shell | `44×44px` round | `54111:39515` |
| Title | Body 1 medium `16/24` | `54111:39517` |
| Subtitle | Body 2 `14/20` | `54111:39518` |
| Body padding | `var(--padding-padding-24)` | `54111:39522` |
| Key-value row min height | `40px` value column | `54111:39552` |
| Host layout | Flex row: main `flex:1 min-width:0` + panel `398px` | `54012:298595` |

## Tokens

- Surface: `var(--color-background-component)`, `var(--color-background-surface-2)` (icon shell)
- Border: `var(--color-border-neutral-light)` (topology left + header bottom)
- Text: `var(--color-text-neutral)`, `var(--color-text-neutral-strong)`, `var(--color-text-brand-strong)` (links)
- Icon: `var(--color-icon-accessible)`, `var(--color-icon-neutral)` (close)

## States (Light Theme)

| Slot | State | Background | Border | Text/Icon |
|---|---|---|---|---|
| `SynapseDetailPanelRoot` | open | `var(--color-background-component)` | left `var(--color-border-neutral-light)` | — |
| `SynapseDetailPanelHeader` | default | `var(--color-background-component)` | bottom `var(--color-border-neutral-light)` | title/subtitle tokens |
| `SynapseDetailPanelClose` | default | transparent | none | `ctrl-close-16` / `var(--color-icon-neutral)` |
| `SynapseDetailPanelClose` | focus-visible | transparent | focus ring | icon unchanged |

## States (Dark Theme)

Same semantic tokens as Light; resolved values in `components/synapse-theme.css` / `[data-theme="dark"]`.

## Interactions

- **Topology open:** host sets `isExpanded=true` (e.g. on node click).
- **Topology close:** close button or host sets `isExpanded=false`; panel removed from layout (canvas regains width).
- **Node click toggle:** when `showDetailPanel` on Topology, clicking the active node again closes the panel.
- **Datagrid / page:** inherit IDS toggle (`double-chev-right` / `double-chev-left`).

## Composition & API (runtime)

| Prop | Type | Description |
|---|---|---|
| `attachMode` | `"topology"` \| `"datagrid"` \| `"page"` | Branch selector |
| `isExpanded` | `boolean` | Open/expanded state |
| `onExpandedChange` | `(next: boolean) => void` | State callback |
| `title` | `string?` | Header title (topology) |
| `subtitle` | `string?` | Header subtitle (topology) |
| `iconSlug` | `string?` | Topology element icon in header |
| `body` | `ReactNode?` | Custom scrollable content |
| `rows` | `SynapseDetailPanelKeyValueRow[]?` | Key-value template when `body` omitted |
| `primaryAction` / `secondaryAction` | `{ label, onClick? }?` | Optional footer buttons |

### Topology integration (`Topology` props)

| Prop | Description |
|---|---|
| `showDetailPanel` | Enable docked panel + shrink layout |
| `detailPanelOpen` | Controlled open state |
| `onDetailPanelOpenChange` | Open state callback |
| `getNodeDetailTitle` / `getNodeDetailSubtitle` / `getNodeDetailIconSlug` | Per-node header mapping |
| `getNodeDetailRows` / `renderNodeDetail` | Dynamic body content |
| `detailPanelPrimaryAction` / `detailPanelSecondaryAction` | Optional actions |

## Codegen Contract (Framework-Agnostic Blueprint)

- `attachMode=topology` MUST use header + body stack; MUST NOT render IDS collapsed rail.
- Host layout MUST use horizontal flex with main content `flex:1; min-width:0` and panel fixed `398px`.
- Title/subtitle/body MUST be host-driven (dynamic per selected node).
- Unknown `attachMode` → delegate to IDS `datagrid` fallback.
- Validation checklist:
  - [ ] Panel open width is `398px`; closed topology mode removes panel from DOM/layout.
  - [ ] Canvas/main column shrinks when panel open (`54012:298595`).
  - [ ] Header shows icon + title + subtitle + close.
  - [ ] Body scrolls independently; long key-value lists do not shift header.
  - [ ] Datagrid/page modes preserve IDS `Header+Body` / `Body+Footer` invariants.

## Source Mapping

| Source | Reference |
|---|---|
| IDS baseline | `components/ids/detail-panel/design-spec.md` |
| Programme nodes | `54012:298596`, `54012:298595`, `54102:37235`, `54111:39513` |
| Implementation | `storybook/src/components/SynapseDetailPanel.tsx` |
| Contract | `storybook/src/spec-contracts/synapse-detail-panel.contract.ts` |
| Topology consumer | `components/synapse/topology/design-spec.md` |
