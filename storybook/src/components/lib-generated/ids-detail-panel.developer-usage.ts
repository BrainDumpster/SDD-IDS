/** Developer usage + Docs tab copy for IDS DetailPanel (React). */

export const DETAIL_PANEL_DOCS_DESCRIPTION = `
## Overview

Expandable side panel with header, body, footer, and collapsed rail. Two attach modes:

- **\`datagrid\`** — attached to a data grid. Width follows the content between 240px and 480px. Add \`IdsDetailPanelDetachButton\` to the header to let users pop the panel out into a floating window (drag the header to move it, drag the corner to resize it up to 480 × 1280px).
- **\`page\`** — persistent panel on the right of the page content: full height, 384px wide (the guideline maximum), can only be collapsed. Keep one grid row highlighted at all times (the first by default) with \`IdsDatagrid\`'s \`activeRowId\` + \`onRowClick\`.

\`\`\`
IdsDetailPanel
  IdsDetailPanelContent
    IdsDetailPanelHeader            (datagrid)
      IdsDetailPanelTitle
      IdsDetailPanelDetachButton?   (datagrid pop-out)
      IdsDetailPanelToggleButton
    IdsDetailPanelBody
      IdsDetailPanelSection         (section header + rows)
        IdsDetailPanelField         (label / value row)
      IdsDetailPanelBlock           (padded free-form content: inline alerts, text)
      IdsTabs                       (runs edge to edge)
    IdsDetailPanelFooter            (page)
      IdsDetailPanelToggleButton
  IdsDetailPanelCollapsedRail
    IdsDetailPanelToggleButton
\`\`\`

The body has no padding of its own: sections, blocks and tabs carry the Figma insets.

Import from \`@ids/react/detail-panel\`.

## Props

### \`IdsDetailPanelProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |
| \`attachMode\` | \`IdsDetailPanelAttachMode\` | required |
| \`isExpanded\` | \`boolean\` | — |
| \`defaultExpanded\` | \`boolean\` | \`true\` |
| \`ariaLabelExpand\` | \`string\` | \`"Expand details panel"\` |
| \`ariaLabelCollapse\` | \`string\` | \`"Collapse details panel"\` |
| \`collapsedWidth\` | \`number\` | \`40\` |
| \`expandedWidth\` | \`number\` | datagrid: content (240–480); page: \`384\` (max 384) |
| \`isDetached\` | \`boolean\` | — (datagrid only) |
| \`defaultDetached\` | \`boolean\` | \`false\` |

### \`IdsDetailPanelDetachButtonProps\`

| Prop | Type | Default |
|------|------|---------|
| \`ariaLabelDetach\` | \`string\` | \`"Pop out details panel"\` |
| \`ariaLabelAttach\` | \`string\` | \`"Dock details panel"\` |

### \`IdsDetailPanelSectionProps\`

| Prop | Type | Default |
|------|------|---------|
| \`title\` | \`ReactNode\` | — |
| \`children\` | \`ReactNode\` (\`IdsDetailPanelField\` rows) | — |

### \`IdsDetailPanelFieldProps\`

| Prop | Type | Default |
|------|------|---------|
| \`label\` | \`ReactNode\` | required |
| \`children\` | \`ReactNode\` (value) | — |

### \`IdsDetailPanelBlockProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |

## Events

| Callback | On | Signature |
|----------|----|-----------|
| \`onExpandedChange\` | \`IdsDetailPanelProps\` | \`(next: boolean) => void\` |
| \`onDetachedChange\` | \`IdsDetailPanelProps\` | \`(next: boolean) => void\` |

## API

### Import

\`\`\`tsx
import {
  IdsDetailPanel,
  IdsDetailPanelContent,
  IdsDetailPanelHeader,
  IdsDetailPanelTitle,
  IdsDetailPanelDetachButton,
  IdsDetailPanelToggleButton,
  IdsDetailPanelBody,
  IdsDetailPanelSection,
  IdsDetailPanelField,
  IdsDetailPanelBlock,
  IdsDetailPanelFooter,
  IdsDetailPanelCollapsedRail,
} from "@ids/react/detail-panel";
\`\`\`

### Usage

\`\`\`tsx
<IdsDetailPanel attachMode="datagrid" isExpanded={open} onExpandedChange={setOpen}>
  <IdsDetailPanelContent>
    <IdsDetailPanelHeader>
      <IdsDetailPanelTitle>{row?.name ?? "Details"}</IdsDetailPanelTitle>
      <IdsDetailPanelDetachButton />
      <IdsDetailPanelToggleButton />
    </IdsDetailPanelHeader>
    <IdsDetailPanelBody>
      <IdsDetailPanelSection title="Section Header">
        <IdsDetailPanelField label="Label:">Single line content</IdsDetailPanelField>
      </IdsDetailPanelSection>
    </IdsDetailPanelBody>
  </IdsDetailPanelContent>
  <IdsDetailPanelCollapsedRail>
    <IdsDetailPanelToggleButton />
  </IdsDetailPanelCollapsedRail>
</IdsDetailPanel>
\`\`\`
`.trim();

export const DETAIL_PANEL_SOURCE_CODE = `import {
  IdsDetailPanel,
  IdsDetailPanelBody,
  IdsDetailPanelCollapsedRail,
  IdsDetailPanelContent,
  IdsDetailPanelDetachButton,
  IdsDetailPanelField,
  IdsDetailPanelHeader,
  IdsDetailPanelSection,
  IdsDetailPanelTitle,
  IdsDetailPanelToggleButton,
} from "@ids/react/detail-panel";

export function Example({ open, onOpenChange }: { open: boolean; onOpenChange: (next: boolean) => void }) {
  return (
    <IdsDetailPanel attachMode="datagrid" isExpanded={open} onExpandedChange={onOpenChange}>
      <IdsDetailPanelContent>
        <IdsDetailPanelHeader>
          <IdsDetailPanelTitle>Details</IdsDetailPanelTitle>
          <IdsDetailPanelDetachButton />
          <IdsDetailPanelToggleButton />
        </IdsDetailPanelHeader>
        <IdsDetailPanelBody>
          <IdsDetailPanelSection title="Section Header">
            <IdsDetailPanelField label="Label:">Single line content</IdsDetailPanelField>
            <IdsDetailPanelField label="Label:">Single line content</IdsDetailPanelField>
          </IdsDetailPanelSection>
        </IdsDetailPanelBody>
      </IdsDetailPanelContent>
      <IdsDetailPanelCollapsedRail>
        <IdsDetailPanelToggleButton />
      </IdsDetailPanelCollapsedRail>
    </IdsDetailPanel>
  );
}`;
