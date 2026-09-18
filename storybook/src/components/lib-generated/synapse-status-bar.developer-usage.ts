/** Developer usage + Docs tab copy for IDS StatusBar (React). */

export const SYNAPSE_STATUS_BAR_DOCS_DESCRIPTION = `
## Overview

Synapse Status Bar is an IDS-fork façade over \`lib/react/ids/status-bar\` (\`reexport\` strategy).
Load \`components/synapse-theme.css\` only — do not load \`ids-theme.css\`.

Import from \`@synapse/react/status-bar\`.

Horizontal status summary with inventory items, icons, and overflow.

\`\`\`
SynapseStatusBar
  SynapseStatusBarTotalItem
  SynapseStatusBarContentViewport
  SynapseStatusBarItem
  SynapseStatusBarItemIconSlot
  SynapseStatusBarItemValue
  SynapseStatusBarItemMeta
  SynapseStatusBarItemDivider
  SynapseStatusBarOverflowLayer
  SynapseStatusBarOverflowLeft
  SynapseStatusBarOverflowRight
  SynapseStatusBarInventoryMainIcon
  SynapseStatusBarInventoryStatusBadge
\`\`\`

Import from \`@synapse/react/status-bar\`.

## Props

### \`SynapseStatusBarItemInput\`

| Prop | Type | Default |
|------|------|---------|
| \`id\` | \`string\` | required |
| \`value\` | \`number \\| string\` | required |
| \`category\` | \`string\` | — |
| \`label\` | \`string\` | required |
| \`severity\` | \`SynapseStatusBarSeverity\` | — |
| \`state\` | \`SynapseStatusBarItemState\` | — |
| \`iconShapeName\` | \`string\` | — |

### \`SynapseStatusBarProps\`

| Prop | Type | Default |
|------|------|---------|
| \`type\` | \`SynapseStatusBarType\` | — |
| \`items\` | \`SynapseStatusBarItemInput[]\` | — |
| \`total\` | \`number \\| string\` | — |
| \`totalLabel\` | \`string\` | — |
| \`totalCategory\` | \`string\` | — |
| \`overflowState\` | \`SynapseStatusBarOverflowState\` | — |
| \`children\` | \`ReactNode\` | — |

### \`SynapseStatusBarItemDividerProps\`

| Prop | Type | Default |
|------|------|---------|
| \`side\` | \`"left" \\| "right"\` | — |
| \`className\` | \`string\` | — |

### \`SynapseStatusBarItemValueProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |
| \`className\` | \`string\` | — |

### \`SynapseStatusBarItemMetaProps\`

| Prop | Type | Default |
|------|------|---------|
| \`category\` | \`string\` | — |
| \`children\` | \`ReactNode\` | — |
| \`className\` | \`string\` | — |

## Events

| Callback | On | Signature |
|----------|----|-----------|
| \`onItemSelect\` | \`SynapseStatusBarProps\` | \`(id: string) => void\` |

## API

### Import

\`\`\`tsx
import {
  SynapseStatusBar,
  SynapseStatusBarTotalItem,
  SynapseStatusBarContentViewport,
  SynapseStatusBarItem,
  SynapseStatusBarItemIconSlot,
  SynapseStatusBarItemValue,
} from "@synapse/react/status-bar";
\`\`\`

### Usage

\`\`\`tsx
<SynapseStatusBar>
  {/* project children / slots per anatomy */}
</SynapseStatusBar>
\`\`\`
`.trim();

export const SYNAPSE_STATUS_BAR_SOURCE_CODE = `import {
  SynapseStatusBar,
  SynapseStatusBarTotalItem,
  SynapseStatusBarContentViewport,
  SynapseStatusBarItem,
  SynapseStatusBarItemIconSlot,
  SynapseStatusBarItemValue,
} from "@synapse/react/status-bar";

export function Example() {
  return (
    <SynapseStatusBar>
      {/* project children / slots */}
    </SynapseStatusBar>
  );
}`;
