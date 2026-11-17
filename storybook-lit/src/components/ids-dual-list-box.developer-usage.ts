/** Developer usage + Docs tab copy for IDS Lit Dual List Box. */

export const DUAL_LIST_BOX_DOCS_DESCRIPTION = `
## Overview

Lit \`ids-dual-list-box\` — two-pane list builder from
\`components/ids/dual-list-box/design-spec.md\`.

Moves items between available and selected panes via transfer buttons and
optional drag-and-drop (\`arrow-arrange\` handle). API aligned with React
\`lib/react/ids/dual-list-box\`.

Live Figma (file \`0bHk3XhrjFhowgFkz9yLr4\`): Spec Accurate assembly
\`12114:232557\`, list item states \`12114:230677\`, transfer group
\`12337:28658\`.

## Anatomy (shadow DOM)

\`\`\`
ids-dual-list-box (DualListBoxRoot)
  ListsParent
    AvailablePane → AvailablePaneHeader + AvailableMetrics + AvailableListGroup
    TransferButtonGroup → MoveAllRight → MoveSelectedRight → MoveSelectedLeft → MoveAllLeft
    SelectedPane → SelectedPaneHeader + SelectedMetrics + SelectedListGroup
\`\`\`

List rows: \`DragHandle\` → \`ItemContent\` → optional \`SelectionCheck\`.

## Props (\`ids-dual-list-box\`)

| Prop | Attribute | Type | Default |
|------|-----------|------|---------|
| \`availableItems\` | — (property) | \`DualListBoxItem[]\` | \`[]\` |
| \`selectedItems\` | — (property) | \`DualListBoxItem[]\` | \`[]\` |
| \`availableTitle\` | \`available-title\` | \`string\` | \`Available Items\` |
| \`selectedTitle\` | \`selected-title\` | \`string\` | \`Selected Items\` |
| \`availablePlaceholder\` | \`available-placeholder\` | \`string\` | \`Select items on the right to move\` |
| \`selectedPlaceholder\` | \`selected-placeholder\` | \`string\` | \`Select items on the left to move\` |
| \`moveSelectedRightTitle\` | \`move-selected-right-title\` | \`string\` | \`Move right\` |
| \`moveSelectedLeftTitle\` | \`move-selected-left-title\` | \`string\` | \`Move left\` |
| \`moveAllRightTitle\` | \`move-all-right-title\` | \`string?\` | \`Add all from {availableTitle}\` |
| \`moveAllLeftTitle\` | \`move-all-left-title\` | \`string?\` | \`Remove all from {selectedTitle}\` |
| \`availableSelection\` | — (property) | \`string[]?\` | — |
| \`selectedSelection\` | — (property) | \`string[]?\` | — |
| \`defaultAvailableSelection\` | — (property) | \`string[]\` | \`[]\` |
| \`defaultSelectedSelection\` | — (property) | \`string[]\` | \`[]\` |
| \`showMetrics\` | \`show-metrics\` | \`boolean\` | \`true\` |
| \`metricsFormat\` | \`metrics-format\` | \`"total" \\| "total-and-selected"\` | \`total\` |
| \`enableDragDrop\` | \`enable-drag-drop\` | \`boolean\` | \`true\` |
| \`itemTooltipSide\` | \`item-tooltip-side\` | \`IdsTooltipSide\` | \`top\` |
| \`itemTooltipArrowAlign\` | \`item-tooltip-arrow-align\` | \`IdsTooltipArrowAlign\` | \`center\` |
| \`ariaLabel\` | \`aria-label\` | \`string\` | \`Dual list box\` |
| \`onAvailableSelectionChange\` | — | \`(ids: string[]) => void\` | — |
| \`onSelectedSelectionChange\` | — | \`(ids: string[]) => void\` | — |
| \`onItemsChange\` | — | \`(detail) => void\` | — |
| \`onTransfer\` | — | \`(detail) => void\` | — |
| \`onDragDrop\` | — | \`(detail) => void\` | — |

### \`DualListBoxItem\`

| Field | Type |
|-------|------|
| \`id\` | \`string\` (required) |
| \`name\` | \`string\` |
| \`description?\` | \`string\` |
| \`tooltipTitle?\` | \`string\` |
| \`tooltipDescription?\` | \`string\` |

## Events

| Event | Callback prop | Detail |
|-------|---------------|--------|
| \`available-selection-change\` | \`onAvailableSelectionChange\` | \`string[]\` |
| \`selected-selection-change\` | \`onSelectedSelectionChange\` | \`string[]\` |
| \`items-change\` | \`onItemsChange\` | \`DualListBoxItemsChangeDetail\` |
| \`transfer\` | \`onTransfer\` | \`DualListBoxTransferDetail\` |
| \`drag-drop\` | \`onDragDrop\` | \`DualListBoxDragDropDetail\` |

## Theme

\`\`\`ts
import "@ids/core/ids-theme.css";
import { applyIdsTheme } from "@ids/core/theme";
applyIdsTheme({ theme: "light" });
\`\`\`
`;

export const DUAL_LIST_BOX_SOURCE_CODE = `<ids-dual-list-box
  available-title="Available Items"
  selected-title="Selected Items"
  .availableItems=\${[
    { id: "avail-1", name: "List Item" },
    { id: "avail-2", name: "List Item" },
    { id: "avail-3", name: "List Item" },
    { id: "avail-4", name: "List Item" },
    { id: "avail-5", name: "List Item" },
    { id: "avail-6", name: "List Item" },
  ]}
  .selectedItems=\${[]}
  .enableDragDrop=\${true}
  metrics-format="total"
></ids-dual-list-box>`;
