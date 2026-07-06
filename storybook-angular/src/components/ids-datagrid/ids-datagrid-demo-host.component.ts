import { Component, Input } from "@angular/core";
import {
  DATAGRID_SPEC_ACCURATE_DEFAULTS,
  DATAGRID_SPEC_COLUMNS,
  DATAGRID_SPEC_ROWS,
  type DatagridColumnInput,
  type DatagridRowInput,
  type DatagridSelectionMode,
} from "@component-contracts/ids/datagrid.contract";
import { IdsDatagridComponent } from "./ids-datagrid.component";
import { IdsDatagridColumnComponent } from "./ids-datagrid-column.component";
import { IdsDatagridRowComponent } from "./ids-datagrid-row.component";
import { IdsDatagridCellComponent } from "./ids-datagrid-cell.component";
import { IdsDatagridFilterComponent } from "./ids-datagrid-filter.component";
import { IdsDatagridFooterComponent } from "./ids-datagrid-footer.component";
import { IdsDatagridFilterSearchFieldComponent } from "./ids-datagrid-filter-search-field.component";
import { IdsDatagridFilterMultiselectComponent } from "./ids-datagrid-filter-multiselect.component";
import { IdsDatagridFilterSingleSelectComponent } from "./ids-datagrid-filter-single-select.component";

@Component({
  selector: "ids-datagrid-demo-host",
  standalone: true,
  imports: [
    IdsDatagridComponent,
    IdsDatagridColumnComponent,
    IdsDatagridRowComponent,
    IdsDatagridCellComponent,
    IdsDatagridFilterComponent,
    IdsDatagridFooterComponent,
    IdsDatagridFilterSearchFieldComponent,
    IdsDatagridFilterMultiselectComponent,
    IdsDatagridFilterSingleSelectComponent,
  ],
  templateUrl: "./ids-datagrid-demo-host.component.html",
})
export class IdsDatagridDemoHostComponent {
  readonly columns: DatagridColumnInput[] = DATAGRID_SPEC_COLUMNS;
  readonly allRows: DatagridRowInput[] = DATAGRID_SPEC_ROWS;

  @Input() rowSelection = DATAGRID_SPEC_ACCURATE_DEFAULTS.rowSelection;
  @Input() selectionMode: DatagridSelectionMode = DATAGRID_SPEC_ACCURATE_DEFAULTS.selectionMode;
  @Input() showSingleSelectionRadio = DATAGRID_SPEC_ACCURATE_DEFAULTS.showSingleSelectionRadio;
  @Input() withDetailPanel = DATAGRID_SPEC_ACCURATE_DEFAULTS.withDetailPanel;
  @Input() pageSize = DATAGRID_SPEC_ACCURATE_DEFAULTS.pageSize;
  @Input() readOnly = DATAGRID_SPEC_ACCURATE_DEFAULTS.readOnly;
  @Input() rowVerticalIndicator = DATAGRID_SPEC_ACCURATE_DEFAULTS.rowVerticalIndicator;
  @Input() headerColorAndBorder = DATAGRID_SPEC_ACCURATE_DEFAULTS.headerColorAndBorder;
  @Input() columnResizeEnabled = DATAGRID_SPEC_ACCURATE_DEFAULTS.columnResizeEnabled;

  nameQuery = "";
  selectedTypes: string[] = [];
  selectedStatuses: string[] = [];
  selectedOwner: string | null = null;
  selectedRegion: string | null = null;

  readonly typeOptions = this.distinctValues("type");
  readonly statusOptions = this.distinctValues("status");
  readonly ownerOptions = this.distinctValues("owner");
  readonly regionOptions = this.distinctValues("region");

  constructor() {
    this.selectedTypes = [...this.typeOptions];
    this.selectedStatuses = [...this.statusOptions];
  }

  get filteredRows(): DatagridRowInput[] {
    return this.allRows.filter((row) => {
      const name = String(row.values.name ?? "");
      if (this.nameQuery.trim() && !name.toLowerCase().includes(this.nameQuery.trim().toLowerCase())) {
        return false;
      }
      const type = String(row.values.type ?? "");
      if (this.selectedTypes.length > 0 && !this.selectedTypes.includes(type)) {
        return false;
      }
      const status = String(row.values.status ?? "");
      if (this.selectedStatuses.length > 0 && !this.selectedStatuses.includes(status)) {
        return false;
      }
      const owner = String(row.values.owner ?? "");
      if (this.selectedOwner != null && owner !== this.selectedOwner) {
        return false;
      }
      const region = String(row.values.region ?? "");
      if (this.selectedRegion != null && region !== this.selectedRegion) {
        return false;
      }
      return true;
    });
  }

  get nameFilterActive(): boolean {
    return this.nameQuery.trim().length > 0;
  }

  get typeFilterActive(): boolean {
    return (
      this.typeOptions.length > 0 &&
      (this.selectedTypes.length === 0 || this.selectedTypes.length < this.typeOptions.length)
    );
  }

  get statusFilterActive(): boolean {
    return (
      this.statusOptions.length > 0 &&
      (this.selectedStatuses.length === 0 ||
        this.selectedStatuses.length < this.statusOptions.length)
    );
  }

  get ownerFilterActive(): boolean {
    return this.selectedOwner != null;
  }

  get regionFilterActive(): boolean {
    return this.selectedRegion != null;
  }

  private distinctValues(key: string): string[] {
    const values = new Set<string>();
    for (const row of this.allRows) {
      const value = row.values[key];
      if (value != null && String(value) !== "") {
        values.add(String(value));
      }
    }
    return [...values].sort((a, b) => a.localeCompare(b));
  }
}
