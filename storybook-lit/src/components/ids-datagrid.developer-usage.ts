/**
 * Developer usage for IDS Lit Datagrid (design-spec + Angular/React API parity).
 */
export const DATAGRID_DOCS_DESCRIPTION = `
## Overview

Lit \`ids-datagrid\` from \`components/ids/datagrid/design-spec.md\`.
Composition matches Angular \`ids-datagrid\` / React \`IdsDatagrid\` slots.

\`\`\`
ids-datagrid
  ids-datagrid-column+
    ids-datagrid-column-title?
    ids-datagrid-filter?
      ids-datagrid-filter-search-field |
      ids-datagrid-filter-multiselect |
      ids-datagrid-filter-single-select |
      ids-datagrid-filter-numeric |
      ids-datagrid-filter-date |
      ids-datagrid-filter-datetime
  ids-datagrid-body
    ids-datagrid-row+
      ids-datagrid-cell+
  ids-datagrid-footer?            (else host embeds ids-pagination)
  ids-datagrid-detail-panel?      (else host embeds ids-detail-panel when withDetailPanel)
\`\`\`

Grid host owns L-frame filter shell, colgroup, sticky selection/settings chrome,
sort/filter toggles, column resize, settings visibility popup, default
\`ids-pagination\` footer, and default \`ids-detail-panel\` (datagrid attach).

## Props (host)

| Prop | Attribute | Default |
|------|-----------|---------|
| \`rowSelection\` | \`rowselection\` | \`false\` |
| \`selectionMode\` | \`selectionmode\` | \`single\` |
| \`showSingleSelectionRadio\` | \`showsingleselectionradio\` | \`true\` |
| \`withDetailPanel\` | \`withdetailpanel\` | \`false\` |
| \`pageSize\` | \`pagesize\` | \`25\` |
| \`readOnly\` | \`readonly\` | \`false\` |
| \`rowVerticalIndicator\` | \`rowverticalindicator\` | \`false\` |
| \`headerColorAndBorder\` | \`headercolorandborder\` | \`true\` |
| \`columnResizeEnabled\` | \`columnresizeenabled\` | \`false\` |
| \`showSettingsColumn\` | \`showsettingscolumn\` | \`true\` |

## Events

| Event | Detail |
|-------|--------|
| \`sort-change\` | \`{ columnKey, direction }\` |
| \`filter-toggle\` | \`{ columnKey, open }\` |
| \`column-resize\` | \`{ columnKey, widthPx }\` |
| \`column-visibility-change\` | \`{ columnKey, visible }\` |
| \`row-click\` | \`{ rowKey }\` |
| \`row-selection-change\` | \`{ rowId }\` (single) |
| \`selected-rows-change\` | \`{ rowIds }\` (multiple) |

## Theme

\`\`\`ts
import "@ids/core/ids-theme.css";
import { applyIdsTheme } from "@ids/core/theme";
applyIdsTheme({ theme: "light" });
\`\`\`

## Figma

Canonical redesign \`48122:183847\`; Column Header \`37721:114663\`;
row/cell states \`37721:114580\` (file \`0bHk3XhrjFhowgFkz9yLr4\`).
`.trim();

export const DATAGRID_SOURCE_CODE = `<ids-datagrid
  rowselection
  selectionmode="single"
  showsingleselectionradio
  withdetailpanel
  pagesize="6"
  rowverticalindicator
  headercolorandborder
  columnresizeenabled
>
  <ids-datagrid-column field="name" sortable filterable width="200">
    <ids-datagrid-column-title>Name</ids-datagrid-column-title>
    <ids-datagrid-filter>
      <ids-datagrid-filter-search-field arialabel="Search name"></ids-datagrid-filter-search-field>
    </ids-datagrid-filter>
  </ids-datagrid-column>
  <ids-datagrid-body>
    <ids-datagrid-row row-id="r-1">
      <ids-datagrid-cell field="name" value="North America Control Plane"></ids-datagrid-cell>
    </ids-datagrid-row>
  </ids-datagrid-body>
  <ids-datagrid-footer></ids-datagrid-footer>
  <ids-datagrid-detail-panel>
    <span slot="header">Details</span>
    Select a row…
  </ids-datagrid-detail-panel>
</ids-datagrid>`;
