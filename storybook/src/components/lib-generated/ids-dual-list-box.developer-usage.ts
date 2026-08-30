/** Developer usage + Docs tab copy for IDS DualListBox (React). */

export const DUAL_LIST_BOX_DOCS_DESCRIPTION = `
## Overview

Transfer list for moving items between available and selected panes.

\`\`\`
IdsDualListBox
  IdsDualListBoxListsParent
  IdsDualListBoxAvailablePane
  IdsDualListBoxAvailablePaneHeader
  IdsDualListBoxAvailableMetrics
  IdsDualListBoxAvailableListGroup
  IdsDualListBoxTransferButtonGroup
  IdsDualListBoxMoveAllRight
  IdsDualListBoxMoveSelectedRight
  IdsDualListBoxMoveSelectedLeft
  IdsDualListBoxMoveAllLeft
  IdsDualListBoxSelectedPane
  IdsDualListBoxSelectedPaneHeader
  IdsDualListBoxSelectedMetrics
\`\`\`

Import from \`@ids/react/dual-list-box\`.

## Props

### \`IdsDualListBoxProps\`

| Prop | Type | Default |
|------|------|---------|
| \`availableItems\` | \`DualListBoxItem[]\` | required |
| \`selectedItems\` | \`DualListBoxItem[]\` | required |
| \`availableTitle\` | \`string\` | — |
| \`selectedTitle\` | \`string\` | — |
| \`availablePlaceholder\` | \`string\` | — |
| \`selectedPlaceholder\` | \`string\` | — |
| \`moveSelectedRightTitle\` | \`string\` | — |
| \`moveSelectedLeftTitle\` | \`string\` | — |
| \`moveAllRightTitle\` | \`string\` | — |
| \`moveAllLeftTitle\` | \`string\` | — |
| \`availableSelection\` | \`string[]\` | — |
| \`selectedSelection\` | \`string[]\` | — |
| \`defaultAvailableSelection\` | \`string[]\` | — |
| \`defaultSelectedSelection\` | \`string[]\` | — |
| \`showMetrics\` | \`boolean\` | — |
| \`metricsFormat\` | \`DualListBoxMetricsFormat \\| string\` | — |
| \`enableDragDrop\` | \`boolean\` | — |
| \`itemTooltipSide\` | \`TooltipSide\` | — |

### \`IdsDualListBoxListsParentProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |

### \`IdsDualListBoxAvailablePaneProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |

### \`IdsDualListBoxSelectedPaneProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |

### \`IdsDualListBoxAvailablePaneHeaderProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |

## Events

| Callback | On | Signature |
|----------|----|-----------|
| \`onAvailableSelectionChange\` | \`IdsDualListBoxProps\` | \`(ids: string[]) => void\` |
| \`onSelectedSelectionChange\` | \`IdsDualListBoxProps\` | \`(ids: string[]) => void\` |
| \`onItemsChange\` | \`IdsDualListBoxProps\` | \`(detail: DualListBoxItemsChangeDetail) => void\` |
| \`onTransfer\` | \`IdsDualListBoxProps\` | \`(detail: DualListBoxTransferDetail) => void\` |
| \`onDragDrop\` | \`IdsDualListBoxProps\` | \`(detail: DualListBoxDragDropDetail) => void\` |

## API

### Import

\`\`\`tsx
import {
  IdsDualListBox,
  IdsDualListBoxListsParent,
  IdsDualListBoxAvailablePane,
  IdsDualListBoxAvailablePaneHeader,
  IdsDualListBoxAvailableMetrics,
  IdsDualListBoxAvailableListGroup,
} from "@ids/react/dual-list-box";
\`\`\`

### Usage

\`\`\`tsx
<IdsDualListBox>
  {/* project children / slots per anatomy */}
</IdsDualListBox>
\`\`\`
`.trim();

export const DUAL_LIST_BOX_SOURCE_CODE = `import {
  IdsDualListBox,
  IdsDualListBoxListsParent,
  IdsDualListBoxAvailablePane,
  IdsDualListBoxAvailablePaneHeader,
  IdsDualListBoxAvailableMetrics,
  IdsDualListBoxAvailableListGroup,
} from "@ids/react/dual-list-box";

export function Example() {
  return (
    <IdsDualListBox>
      {/* project children / slots */}
    </IdsDualListBox>
  );
}`;
