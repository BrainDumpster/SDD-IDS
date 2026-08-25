/** Developer usage + Docs tab copy for IDS DetailPanel (React). */

export const DETAIL_PANEL_DOCS_DESCRIPTION = `
## Overview

Expandable side panel with header, body, footer, and collapsed rail.

\`\`\`
IdsDetailPanel
  IdsDetailPanelContent
  IdsDetailPanelHeader
  IdsDetailPanelTitle
  IdsDetailPanelBody
  IdsDetailPanelFooter
  IdsDetailPanelCollapsedRail
  IdsDetailPanelToggleButton
\`\`\`

Import from \`@ids/react/detail-panel\`.

## Props

### \`IdsDetailPanelProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |
| \`attachMode\` | \`IdsDetailPanelAttachMode\` | required |
| \`isExpanded\` | \`boolean\` | — |
| \`ariaLabelExpand\` | \`string\` | — |
| \`ariaLabelCollapse\` | \`string\` | — |
| \`collapsedWidth\` | \`number\` | — |
| \`expandedWidth\` | \`number\` | — |
| \`defaultExpanded\` | \`boolean\` | — |

### \`IdsDetailPanelContentProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |

### \`IdsDetailPanelHeaderProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |

### \`IdsDetailPanelTitleProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |

### \`IdsDetailPanelBodyProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |

## Events

| Callback | On | Signature |
|----------|----|-----------|
| \`onExpandedChange\` | \`IdsDetailPanelProps\` | \`(next: boolean) => void\` |

## API

### Import

\`\`\`tsx
import {
  IdsDetailPanel,
  IdsDetailPanelContent,
  IdsDetailPanelHeader,
  IdsDetailPanelTitle,
  IdsDetailPanelBody,
  IdsDetailPanelFooter,
} from "@ids/react/detail-panel";
\`\`\`

### Usage

\`\`\`tsx
<IdsDetailPanel>
  {/* project children / slots per anatomy */}
</IdsDetailPanel>
\`\`\`
`.trim();

export const DETAIL_PANEL_SOURCE_CODE = `import {
  IdsDetailPanel,
  IdsDetailPanelContent,
  IdsDetailPanelHeader,
  IdsDetailPanelTitle,
  IdsDetailPanelBody,
  IdsDetailPanelFooter,
} from "@ids/react/detail-panel";

export function Example() {
  return (
    <IdsDetailPanel>
      {/* project children / slots */}
    </IdsDetailPanel>
  );
}`;
