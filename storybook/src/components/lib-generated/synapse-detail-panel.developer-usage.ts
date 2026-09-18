/** Developer usage + Docs tab copy for IDS DetailPanel (React). */

export const SYNAPSE_DETAIL_PANEL_DOCS_DESCRIPTION = `
## Overview

Synapse Detail Panel is an IDS-fork façade over \`lib/react/ids/detail-panel\` (\`reexport\` strategy).
Load \`components/synapse-theme.css\` only — do not load \`ids-theme.css\`.

Import from \`@synapse/react/detail-panel\`.

Expandable side panel with header, body, footer, and collapsed rail.

\`\`\`
SynapseDetailPanel
  SynapseDetailPanelContent
  SynapseDetailPanelHeader
  SynapseDetailPanelTitle
  SynapseDetailPanelBody
  SynapseDetailPanelFooter
  SynapseDetailPanelCollapsedRail
  SynapseDetailPanelToggleButton
\`\`\`

Import from \`@synapse/react/detail-panel\`.

## Props

### \`SynapseDetailPanelProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |
| \`attachMode\` | \`SynapseDetailPanelAttachMode\` | required |
| \`isExpanded\` | \`boolean\` | — |
| \`ariaLabelExpand\` | \`string\` | — |
| \`ariaLabelCollapse\` | \`string\` | — |
| \`collapsedWidth\` | \`number\` | — |
| \`expandedWidth\` | \`number\` | — |
| \`defaultExpanded\` | \`boolean\` | — |

### \`SynapseDetailPanelContentProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |

### \`SynapseDetailPanelHeaderProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |

### \`SynapseDetailPanelTitleProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |

### \`SynapseDetailPanelBodyProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |

## Events

| Callback | On | Signature |
|----------|----|-----------|
| \`onExpandedChange\` | \`SynapseDetailPanelProps\` | \`(next: boolean) => void\` |

## API

### Import

\`\`\`tsx
import {
  SynapseDetailPanel,
  SynapseDetailPanelContent,
  SynapseDetailPanelHeader,
  SynapseDetailPanelTitle,
  SynapseDetailPanelBody,
  SynapseDetailPanelFooter,
} from "@synapse/react/detail-panel";
\`\`\`

### Usage

\`\`\`tsx
<SynapseDetailPanel>
  {/* project children / slots per anatomy */}
</SynapseDetailPanel>
\`\`\`
`.trim();

export const SYNAPSE_DETAIL_PANEL_SOURCE_CODE = `import {
  SynapseDetailPanel,
  SynapseDetailPanelContent,
  SynapseDetailPanelHeader,
  SynapseDetailPanelTitle,
  SynapseDetailPanelBody,
  SynapseDetailPanelFooter,
} from "@synapse/react/detail-panel";

export function Example() {
  return (
    <SynapseDetailPanel>
      {/* project children / slots */}
    </SynapseDetailPanel>
  );
}`;
