/** Developer usage + Docs tab copy for IDS Lit Detail Panel. */

export const DETAIL_PANEL_DOCS_DESCRIPTION = `
## Overview

Lit \`ids-detail-panel\` — from \`components/ids/detail-panel/design-spec.md\`.

Composition aligned with React \`@ids/react/detail-panel\` and Angular
\`lib/angular/ids/detail-panel/\` child selectors.

\`\`\`
ids-detail-panel
  ids-detail-panel-content          — expanded branch
    datagrid: header + body
    page: body + footer
  ids-detail-panel-collapsed-rail   — collapsed icon rail
    ids-detail-panel-toggle-button
\`\`\`

Body content blocks: \`ids-detail-panel-section\` / \`ids-detail-panel-field\` /
\`ids-detail-panel-block\`. Optional datagrid pop-out: \`ids-detail-panel-detach-button\`.

## Root props

| Prop | Binding | Type | Default |
|------|---------|------|---------|
| \`attachMode\` | \`attachmode\` | \`datagrid \\| page\` | \`datagrid\` |
| \`isExpanded\` | \`.isExpanded=\` | \`boolean \\| undefined\` | uncontrolled |
| \`defaultExpanded\` | \`.defaultExpanded=\` | \`boolean\` | \`true\` |
| \`expandedWidth\` | \`expandedwidth\` | \`number\` | datagrid content / page \`384\` |
| \`collapsedWidth\` | \`collapsedwidth\` | \`number\` | \`40\` |
| \`isDetached\` | \`.isDetached=\` | \`boolean \\| undefined\` | uncontrolled |
| \`defaultDetached\` | \`.defaultDetached=\` | \`boolean\` | \`false\` |
| \`ariaLabelExpand\` / \`ariaLabelCollapse\` | attrs | \`string\` | Expand/Collapse labels |
| \`onExpandedChange\` / \`onDetachedChange\` | properties | callbacks | — |

## Events

| Event | Detail |
|-------|--------|
| \`expanded-change\` / \`onExpandedChange\` | \`boolean\` |
| \`detached-change\` / \`onDetachedChange\` | \`boolean\` |
| \`opened\` / \`closed\` | — |

## Theme

\`\`\`ts
import "@ids/core/ids-theme.css";
import { applyIdsTheme } from "@ids/core/theme";
applyIdsTheme({ theme: "light" });
\`\`\`
`.trim();

export const DETAIL_PANEL_SOURCE_CODE = `<ids-detail-panel attachmode="datagrid" .defaultExpanded=\${true}>
  <ids-detail-panel-content>
    <ids-detail-panel-header>
      Details
      <ids-detail-panel-toggle-button></ids-detail-panel-toggle-button>
    </ids-detail-panel-header>
    <ids-detail-panel-body>
      <ids-detail-panel-section title="Section Header">
        <ids-detail-panel-field label="Label:">Single line content</ids-detail-panel-field>
      </ids-detail-panel-section>
    </ids-detail-panel-body>
  </ids-detail-panel-content>
  <ids-detail-panel-collapsed-rail>
    <ids-detail-panel-toggle-button></ids-detail-panel-toggle-button>
  </ids-detail-panel-collapsed-rail>
</ids-detail-panel>`;
