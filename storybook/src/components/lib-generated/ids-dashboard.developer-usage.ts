/** Developer usage + Docs tab copy for IDS Dashboard (React). */

export const DASHBOARD_DOCS_DESCRIPTION = `
## Overview

Responsive grid of dashboard items for summary widgets and panels.

\`\`\`
IdsDashboard
  IdsDashboardGrid
  IdsDashboardItem
\`\`\`

Import from \`@ids/react/dashboard\`.

## Props

### \`IdsDashboardGridProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |

### \`IdsDashboardItemProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |
| \`size\` | \`IdsCardSize\` | — |
| \`itemKey\` | \`string\` | — |

### \`IdsDashboardProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | required |
| \`showDividerInCard\` | \`boolean\` | — |
| \`enableDragAndDrop\` | \`boolean\` | — |
| \`cardsDraggable\` | \`boolean\` | — |
| \`className\` | \`string\` | — |

## Events

| Callback | On | Signature |
|----------|----|-----------|
| \`onCardsReorder\` | \`IdsDashboardProps\` | \`(orderedKeys: string[]) => void\` |

## API

### Import

\`\`\`tsx
import {
  IdsDashboard,
  IdsDashboardGrid,
  IdsDashboardItem,
} from "@ids/react/dashboard";
\`\`\`

### Usage

\`\`\`tsx
<IdsDashboard>
  {/* project children / slots per anatomy */}
</IdsDashboard>
\`\`\`
`.trim();

export const DASHBOARD_SOURCE_CODE = `import {
  IdsDashboard,
  IdsDashboardGrid,
  IdsDashboardItem,
} from "@ids/react/dashboard";

export function Example() {
  return (
    <IdsDashboard>
      {/* project children / slots */}
    </IdsDashboard>
  );
}`;
