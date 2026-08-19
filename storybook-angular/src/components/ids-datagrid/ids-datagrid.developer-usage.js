/** Developer usage + Docs tab copy for IDS Datagrid (Angular composition). */

export const DATAGRID_DOCS_DESCRIPTION = `
IDS Datagrid — Angular 21 standalone **composition** API (\`storybook-angular\`, port **6007**).

**Spec:** \`components/ids/datagrid/design-spec.md\`  
**Contract:** \`component-contracts/ids/datagrid.contract.ts\`

### Anatomy (deterministic child order)

\`\`\`
ids-datagrid
  ids-datagrid-column [field, sortable?, filterable?, width?]
    ids-datagrid-column-title
    ids-datagrid-filter (optional)
  ids-datagrid-body
    ids-datagrid-row [rowId]
      ids-datagrid-cell [field]
  ids-datagrid-footer
  ids-datagrid-detail-panel (optional)
    ids-detail-panel
\`\`\`

Import \`IDS_DATAGRID_IMPORTS\` from \`lib/angular/ids/datagrid\`. Load \`components/ids-theme.css\` on the app root.
`.trim();

export const DATAGRID_SOURCE_CODE = `import { Component } from "@angular/core";
import { IDS_DATAGRID_IMPORTS } from "./datagrid";
import { IDS_DETAIL_PANEL_IMPORTS } from "./detail-panel";
import { DATAGRID_SPEC_ACCURATE_DEFAULTS } from "@component-contracts/ids/datagrid.contract";

@Component({
  standalone: true,
  imports: [...IDS_DATAGRID_IMPORTS, ...IDS_DETAIL_PANEL_IMPORTS],
  template: \`
    <ids-datagrid
      #grid
      [rowSelection]="defaults.rowSelection"
      [selectionMode]="defaults.selectionMode"
      [withDetailPanel]="defaults.withDetailPanel"
      [pageSize]="defaults.pageSize"
    >
      <ids-datagrid-column field="name" [sortable]="true" [filterable]="true" [width]="200">
        <ids-datagrid-column-title>Name</ids-datagrid-column-title>
        <ids-datagrid-filter>
          <input type="search" placeholder="Search" aria-label="Search name column" />
        </ids-datagrid-filter>
      </ids-datagrid-column>
      <ids-datagrid-body>
        <ids-datagrid-row rowId="r-1">
          <ids-datagrid-cell field="name" value="North America Control Plane" />
        </ids-datagrid-row>
      </ids-datagrid-body>
      <ids-datagrid-footer />
      <ids-datagrid-detail-panel>
        <ids-detail-panel
          attachMode="datagrid"
          [expanded]="grid.detailPanelOpen"
          (expandedChange)="grid.onDetailPanelExpandedChange($event)"
        >
          <ids-detail-panel-content>
            <ids-detail-panel-header>
              <ids-detail-panel-title>Details</ids-detail-panel-title>
            </ids-detail-panel-header>
            <ids-detail-panel-body>Select a row.</ids-detail-panel-body>
          </ids-detail-panel-content>
          <ids-detail-panel-collapsed-rail>
            <ids-detail-panel-toggle-button />
          </ids-detail-panel-collapsed-rail>
        </ids-detail-panel>
      </ids-datagrid-detail-panel>
    </ids-datagrid>
  \`,
})
export class AppComponent {
  readonly defaults = DATAGRID_SPEC_ACCURATE_DEFAULTS;
}`;

export const DATAGRID_STORY_SOURCE_CODE = `<ids-datagrid
  [rowSelection]="true"
  selectionMode="single"
  [withDetailPanel]="true"
  [pageSize]="6"
  [headerColorAndBorder]="true"
  [rowVerticalIndicator]="true"
>
  <ids-datagrid-column field="name" [sortable]="true" [filterable]="true" [width]="200">
    <ids-datagrid-column-title>Name</ids-datagrid-column-title>
    <ids-datagrid-filter>
      <input type="search" placeholder="Search" aria-label="Search name column" />
    </ids-datagrid-filter>
  </ids-datagrid-column>
  <ids-datagrid-column field="type" [sortable]="true" [filterable]="true" [width]="140">
    <ids-datagrid-column-title>Type</ids-datagrid-column-title>
  </ids-datagrid-column>
  <ids-datagrid-body>
    <ids-datagrid-row rowId="r-1">
      <ids-datagrid-cell field="name" value="North America Control Plane" />
      <ids-datagrid-cell field="type" value="Service" />
    </ids-datagrid-row>
  </ids-datagrid-body>
  <ids-datagrid-footer />
  <ids-datagrid-detail-panel>
    <ids-detail-panel attachMode="datagrid">
      <ids-detail-panel-content>
        <ids-detail-panel-header>
          <ids-detail-panel-title>Details</ids-detail-panel-title>
        </ids-detail-panel-header>
        <ids-detail-panel-body></ids-detail-panel-body>
      </ids-detail-panel-content>
      <ids-detail-panel-collapsed-rail>
        <ids-detail-panel-toggle-button />
      </ids-detail-panel-collapsed-rail>
    </ids-detail-panel>
  </ids-datagrid-detail-panel>
</ids-datagrid>`;

export const DATAGRID_COMPOSITION_DEMO_TEMPLATE = `
<ids-datagrid
  [rowSelection]="rowSelection"
  [selectionMode]="selectionMode"
  [showSingleSelectionRadio]="showSingleSelectionRadio"
  [withDetailPanel]="withDetailPanel"
  [pageSize]="pageSize"
  [readOnly]="readOnly"
  [rowVerticalIndicator]="rowVerticalIndicator"
  [headerColorAndBorder]="headerColorAndBorder"
>
  @for (column of columns; track column.key) {
    <ids-datagrid-column
      [field]="column.key"
      [sortable]="column.sortable"
      [filterable]="column.filterable"
      [width]="column.width"
      [minWidth]="column.minWidth"
      [columnHideable]="column.columnHideable"
    >
      <ids-datagrid-column-title>{{ column.title }}</ids-datagrid-column-title>
      @if (column.key === 'name') {
        <ids-datagrid-filter>
          <input type="search" placeholder="Search" aria-label="Search name column" />
        </ids-datagrid-filter>
      }
    </ids-datagrid-column>
  }
  <ids-datagrid-body>
    @for (row of rows; track row.id) {
      <ids-datagrid-row [rowId]="row.id">
        @for (column of columns; track column.key) {
          <ids-datagrid-cell [field]="column.key" [value]="row.values[column.key]" />
        }
      </ids-datagrid-row>
    }
  </ids-datagrid-body>
  <ids-datagrid-footer />
</ids-datagrid>`.trim();
