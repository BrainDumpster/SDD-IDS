/** Developer usage + Docs tab copy for IDS Datagrid (Angular composition). */

export const DATAGRID_DOCS_DESCRIPTION = `
IDS Datagrid — Angular 21 standalone **composition** API (\`storybook-angular\`, port **6007**).

**Spec:** \`components/ids/datagrid/design-spec.md\`  
**Contract:** \`component-contracts/ids/datagrid.contract.ts\`

### Anatomy (deterministic child order)

\`\`\`
ids-datagrid [rowSelection, selectionMode, withDetailPanel, …]
  ids-datagrid-column [field, title, sortable?, filterable?, width?]
    ng-container idsColumnTitle (optional)
    ids-datagrid-filter (optional)
      <!-- inner filter UI -->
  ids-datagrid-row [rowId]
    ids-datagrid-cell [field]
  ids-datagrid-footer (optional)
\`\`\`

Import \`IDS_DATAGRID_IMPORTS\` from \`ids-datagrid.imports.ts\`. Load \`components/ids-theme.css\` on the app root.
`.trim();

export const DATAGRID_SOURCE_CODE = `import { Component } from "@angular/core";
import { IDS_DATAGRID_IMPORTS } from "./ids-datagrid/ids-datagrid.imports";
import { DATAGRID_SPEC_ACCURATE_DEFAULTS } from "@component-contracts/ids/datagrid.contract";

@Component({
  standalone: true,
  imports: [...IDS_DATAGRID_IMPORTS],
  template: \`
    <ids-datagrid
      [rowSelection]="defaults.rowSelection"
      [selectionMode]="defaults.selectionMode"
      [withDetailPanel]="defaults.withDetailPanel"
      [pageSize]="defaults.pageSize"
    >
      <ids-datagrid-column field="name" title="Name" [sortable]="true" [filterable]="true" [width]="200">
        <ids-datagrid-filter>
          <input type="search" placeholder="Search" aria-label="Search name column" />
        </ids-datagrid-filter>
      </ids-datagrid-column>
      <ids-datagrid-row rowId="r-1">
        <ids-datagrid-cell field="name">North America Control Plane</ids-datagrid-cell>
      </ids-datagrid-row>
      <ids-datagrid-footer />
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
  <ids-datagrid-column field="name" title="Name" [sortable]="true" [filterable]="true" [width]="200">
    <ids-datagrid-filter>
      <input type="search" placeholder="Search" aria-label="Search name column" />
    </ids-datagrid-filter>
  </ids-datagrid-column>
  <ids-datagrid-column field="type" title="Type" [sortable]="true" [filterable]="true" [width]="140" />
  <ids-datagrid-row rowId="r-1">
    <ids-datagrid-cell field="name">North America Control Plane</ids-datagrid-cell>
    <ids-datagrid-cell field="type">Service</ids-datagrid-cell>
  </ids-datagrid-row>
  <ids-datagrid-footer />
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
      [title]="column.title"
      [sortable]="column.sortable"
      [filterable]="column.filterable"
      [width]="column.width"
      [minWidth]="column.minWidth"
      [columnHideable]="column.columnHideable"
    >
      @if (column.key === 'name') {
        <ids-datagrid-filter>
          <input type="search" placeholder="Search" aria-label="Search name column" />
        </ids-datagrid-filter>
      }
    </ids-datagrid-column>
  }
  @for (row of rows; track row.id) {
    <ids-datagrid-row [rowId]="row.id">
      @for (column of columns; track column.key) {
        <ids-datagrid-cell [field]="column.key">{{ row.values[column.key] }}</ids-datagrid-cell>
      }
    </ids-datagrid-row>
  }
  <ids-datagrid-footer />
</ids-datagrid>`.trim();
