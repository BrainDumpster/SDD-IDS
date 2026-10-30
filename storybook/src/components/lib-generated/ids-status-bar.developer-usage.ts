/** Developer usage + Docs tab copy for IDS StatusBar (React). */

export const STATUS_BAR_DOCS_DESCRIPTION = `
## Overview

Horizontal status summary with inventory items, icons, and overflow.

\`\`\`
IdsStatusBar
  IdsStatusBarTotalItem
  IdsStatusBarContentViewport
  IdsStatusBarItem
  IdsStatusBarItemIconSlot
  IdsStatusBarItemValue
  IdsStatusBarItemMeta
  IdsStatusBarItemDivider
  IdsStatusBarOverflowLayer
  IdsStatusBarOverflowLeft
  IdsStatusBarOverflowRight
  IdsStatusBarInventoryMainIcon
  IdsStatusBarInventoryStatusBadge
\`\`\`

Import from \`@ids/react/status-bar\`.

## Props

### \`IdsStatusBarItemInput\`

| Prop | Type | Default |
|------|------|---------|
| \`id\` | \`string\` | required |
| \`value\` | \`number \\| string\` | required |
| \`category\` | \`string\` | — |
| \`label\` | \`string\` | required |
| \`severity\` | \`IdsStatusBarSeverity\` | — |
| \`state\` | \`IdsStatusBarItemState\` | — |
| \`iconShapeName\` | \`string\` | — |

### \`IdsStatusBarProps\`

| Prop | Type | Default |
|------|------|---------|
| \`type\` | \`IdsStatusBarType\` | — |
| \`items\` | \`IdsStatusBarItemInput[]\` | — |
| \`total\` | \`number \\| string\` | — |
| \`totalLabel\` | \`string\` | — |
| \`totalCategory\` | \`string\` | — |
| \`overflowState\` | \`IdsStatusBarOverflowState\` | — |
| \`children\` | \`ReactNode\` | — |

### \`IdsStatusBarItemDividerProps\`

| Prop | Type | Default |
|------|------|---------|
| \`side\` | \`"left" \\| "right"\` | — |
| \`className\` | \`string\` | — |

### \`IdsStatusBarItemValueProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |
| \`className\` | \`string\` | — |

### \`IdsStatusBarItemMetaProps\`

| Prop | Type | Default |
|------|------|---------|
| \`category\` | \`string\` | — |
| \`children\` | \`ReactNode\` | — |
| \`className\` | \`string\` | — |

## Events

| Callback | On | Signature |
|----------|----|-----------|
| \`onItemSelect\` | \`IdsStatusBarProps\` | \`(id: string) => void\` |

## API

### Import

\`\`\`tsx
import {
  IdsStatusBar,
  IdsStatusBarTotalItem,
  IdsStatusBarContentViewport,
  IdsStatusBarItem,
  IdsStatusBarItemIconSlot,
  IdsStatusBarItemValue,
} from "@ids/react/status-bar";
\`\`\`

### Usage

\`\`\`tsx
<IdsStatusBar>
  {/* project children / slots per anatomy */}
</IdsStatusBar>
\`\`\`
`.trim();

export const STATUS_BAR_SOURCE_CODE = `import {
  IdsStatusBar,
  IdsStatusBarTotalItem,
  IdsStatusBarContentViewport,
  IdsStatusBarItem,
  IdsStatusBarItemIconSlot,
  IdsStatusBarItemValue,
} from "@ids/react/status-bar";

export function Example() {
  return (
    <IdsStatusBar>
      {/* project children / slots */}
    </IdsStatusBar>
  );
}`;
