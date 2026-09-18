/** Developer usage + Docs tab copy for IDS SynapseDualListBox (React). */

export const SYNAPSE_DUAL_LIST_BOX_DOCS_DESCRIPTION = `
## Overview

Synapse Dual List Box is an IDS-fork façade over \`lib/react/ids/dual-list-box\` (\`reexport\` strategy).
Load \`components/synapse-theme.css\` only — do not load \`ids-theme.css\`.

Import from \`@synapse/react/dual-list-box\`.

Transfer list for moving items between available and selected panes.

\`\`\`
SynapseDualListBox
  SynapseDualListBoxListsParent
  SynapseDualListBoxAvailablePane
  SynapseDualListBoxAvailablePaneHeader
  SynapseDualListBoxAvailableMetrics
  SynapseDualListBoxAvailableListGroup
  SynapseDualListBoxTransferButtonGroup
  SynapseDualListBoxMoveAllRight
  SynapseDualListBoxMoveSelectedRight
  SynapseDualListBoxMoveSelectedLeft
  SynapseDualListBoxMoveAllLeft
  SynapseDualListBoxSelectedPane
  SynapseDualListBoxSelectedPaneHeader
  SynapseDualListBoxSelectedMetrics
\`\`\`

Import from \`@synapse/react/dual-list-box\`.

## Props

### \`SynapseDualListBoxProps\`

| Prop | Type | Default |
|------|------|---------|
| \`availableItems\` | \`SynapseDualListBoxItem[]\` | required |
| \`selectedItems\` | \`SynapseDualListBoxItem[]\` | required |
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
| \`metricsFormat\` | \`SynapseDualListBoxMetricsFormat \\| string\` | — |
| \`enableDragDrop\` | \`boolean\` | — |
| \`itemTooltipSide\` | \`TooltipSide\` | — |

### \`SynapseDualListBoxListsParentProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |

### \`SynapseDualListBoxAvailablePaneProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |

### \`SynapseDualListBoxSelectedPaneProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |

### \`SynapseDualListBoxAvailablePaneHeaderProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |

## Events

| Callback | On | Signature |
|----------|----|-----------|
| \`onAvailableSelectionChange\` | \`SynapseDualListBoxProps\` | \`(ids: string[]) => void\` |
| \`onSelectedSelectionChange\` | \`SynapseDualListBoxProps\` | \`(ids: string[]) => void\` |
| \`onItemsChange\` | \`SynapseDualListBoxProps\` | \`(detail: SynapseDualListBoxItemsChangeDetail) => void\` |
| \`onTransfer\` | \`SynapseDualListBoxProps\` | \`(detail: SynapseDualListBoxTransferDetail) => void\` |
| \`onDragDrop\` | \`SynapseDualListBoxProps\` | \`(detail: SynapseDualListBoxDragDropDetail) => void\` |

## API

### Import

\`\`\`tsx
import {
  SynapseDualListBox,
  SynapseDualListBoxListsParent,
  SynapseDualListBoxAvailablePane,
  SynapseDualListBoxAvailablePaneHeader,
  SynapseDualListBoxAvailableMetrics,
  SynapseDualListBoxAvailableListGroup,
} from "@synapse/react/dual-list-box";
\`\`\`

### Usage

\`\`\`tsx
<SynapseDualListBox>
  {/* project children / slots per anatomy */}
</SynapseDualListBox>
\`\`\`
`.trim();

export const SYNAPSE_DUAL_LIST_BOX_SOURCE_CODE = `import {
  SynapseDualListBox,
  SynapseDualListBoxListsParent,
  SynapseDualListBoxAvailablePane,
  SynapseDualListBoxAvailablePaneHeader,
  SynapseDualListBoxAvailableMetrics,
  SynapseDualListBoxAvailableListGroup,
} from "@synapse/react/dual-list-box";

export function Example() {
  return (
    <SynapseDualListBox>
      {/* project children / slots */}
    </SynapseDualListBox>
  );
}`;
