import { IdsDatagridComponent } from "./ids-datagrid.component";
import { IdsDatagridColumnComponent } from "./ids-datagrid-column.component";
import { IdsDatagridRowComponent } from "./ids-datagrid-row.component";
import { IdsDatagridCellComponent } from "./ids-datagrid-cell.component";
import { IdsDatagridFilterComponent } from "./ids-datagrid-filter.component";
import { IdsDatagridFooterComponent } from "./ids-datagrid-footer.component";
import { IdsDatagridFilterSearchFieldComponent } from "./ids-datagrid-filter-search-field.component";
import { IdsDatagridFilterMultiselectComponent } from "./ids-datagrid-filter-multiselect.component";
import { IdsDatagridFilterSingleSelectComponent } from "./ids-datagrid-filter-single-select.component";
import { IdsDatagridColumnVisibilityPanelComponent } from "./ids-datagrid-column-visibility-panel.component";
import { IdsDatagridDemoHostComponent } from "./ids-datagrid-demo-host.component";
import { IdsPaginationComponent } from "../ids-pagination/ids-pagination.component";
import { IdsIconComponent } from "../ids-icon/ids-icon.component";
import { IdsCheckboxComponent } from "../ids-checkbox/ids-checkbox.component";

export const IDS_DATAGRID_IMPORTS = [
  IdsDatagridComponent,
  IdsDatagridColumnComponent,
  IdsDatagridRowComponent,
  IdsDatagridCellComponent,
  IdsDatagridFilterComponent,
  IdsDatagridFooterComponent,
  IdsDatagridFilterSearchFieldComponent,
  IdsDatagridFilterMultiselectComponent,
  IdsDatagridFilterSingleSelectComponent,
  IdsDatagridDemoHostComponent,
  IdsDatagridColumnVisibilityPanelComponent,
  IdsPaginationComponent,
  IdsIconComponent,
  IdsCheckboxComponent,
] as const;

export {
  IdsDatagridComponent,
  IdsDatagridColumnComponent,
  IdsDatagridRowComponent,
  IdsDatagridCellComponent,
  IdsDatagridFilterComponent,
  IdsDatagridFooterComponent,
  IdsDatagridDemoHostComponent,
};
