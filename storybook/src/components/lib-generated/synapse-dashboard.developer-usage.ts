/** Developer usage + Docs tab copy for IDS Dashboard (React). */

export const SYNAPSE_DASHBOARD_DOCS_DESCRIPTION = `
## Overview

Synapse Dashboard is an IDS-fork façade over \`lib/react/ids/dashboard\` (\`reexport\` strategy).
Load \`components/synapse-theme.css\` only — do not load \`ids-theme.css\`.

Import from \`@synapse/react/dashboard\`.

Responsive grid of dashboard items for summary widgets and panels.

\`\`\`
SynapseDashboard
  SynapseDashboardGrid
  SynapseDashboardItem
\`\`\`

Import from \`@synapse/react/dashboard\`.

## Props

### \`SynapseDashboardGridProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |

### \`SynapseDashboardItemProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |
| \`size\` | \`SynapseCardSize\` | — |
| \`itemKey\` | \`string\` | — |

### \`SynapseDashboardProps\`

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
| \`onCardsReorder\` | \`SynapseDashboardProps\` | \`(orderedKeys: string[]) => void\` |

## API

### Import

\`\`\`tsx
import {
  SynapseDashboard,
  SynapseDashboardGrid,
  SynapseDashboardItem,
} from "@synapse/react/dashboard";
\`\`\`

### Usage

\`\`\`tsx
<SynapseDashboard>
  {/* project children / slots per anatomy */}
</SynapseDashboard>
\`\`\`
`.trim();

export const SYNAPSE_DASHBOARD_SOURCE_CODE = `import {
  SynapseDashboard,
  SynapseDashboardGrid,
  SynapseDashboardItem,
} from "@synapse/react/dashboard";

export function Example() {
  return (
    <SynapseDashboard>
      {/* project children / slots */}
    </SynapseDashboard>
  );
}`;
