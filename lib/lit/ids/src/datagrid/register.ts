import { registerElementSafely } from "../internal/registration.js";
import { IdsDatagrid } from "./datagrid.element.js";
import { IdsDatagridColumn } from "./datagrid-column.element.js";
import { IdsDatagridColumnTitle } from "./datagrid-column-title.element.js";
import { IdsDatagridFilter } from "./datagrid-filter.element.js";
import { IdsDatagridBody } from "./datagrid-body.element.js";
import { IdsDatagridRow } from "./datagrid-row.element.js";
import { IdsDatagridCell } from "./datagrid-cell.element.js";
import { IdsDatagridFooter } from "./datagrid-footer.element.js";
import { IdsDatagridDetailPanel } from "./datagrid-detail-panel.element.js";
import { IdsDatagridFilterSearchField } from "./datagrid-filter-search-field.element.js";
import { IdsDatagridFilterMultiselect } from "./datagrid-filter-multiselect.element.js";
import { IdsDatagridFilterSingleSelect } from "./datagrid-filter-single-select.element.js";
import { IdsDatagridFilterNumeric } from "./datagrid-filter-numeric.element.js";
import { IdsDatagridFilterDate } from "./datagrid-filter-date.element.js";
import { IdsDatagridFilterDateTime } from "./datagrid-filter-datetime.element.js";
import "../icon/register.js";
import "../checkbox/register.js";
import "../pagination/register.js";
import "../detail-panel/register.js";
import "../date-picker/register.js";
import "../time-picker/register.js";

registerElementSafely("ids-datagrid", IdsDatagrid);
registerElementSafely("ids-datagrid-column", IdsDatagridColumn);
registerElementSafely("ids-datagrid-column-title", IdsDatagridColumnTitle);
registerElementSafely("ids-datagrid-filter", IdsDatagridFilter);
registerElementSafely("ids-datagrid-body", IdsDatagridBody);
registerElementSafely("ids-datagrid-row", IdsDatagridRow);
registerElementSafely("ids-datagrid-cell", IdsDatagridCell);
registerElementSafely("ids-datagrid-footer", IdsDatagridFooter);
registerElementSafely("ids-datagrid-detail-panel", IdsDatagridDetailPanel);
registerElementSafely("ids-datagrid-filter-search-field", IdsDatagridFilterSearchField);
registerElementSafely("ids-datagrid-filter-multiselect", IdsDatagridFilterMultiselect);
registerElementSafely("ids-datagrid-filter-single-select", IdsDatagridFilterSingleSelect);
registerElementSafely("ids-datagrid-filter-numeric", IdsDatagridFilterNumeric);
registerElementSafely("ids-datagrid-filter-date", IdsDatagridFilterDate);
registerElementSafely("ids-datagrid-filter-datetime", IdsDatagridFilterDateTime);

export {
  IdsDatagrid,
  IdsDatagridColumn,
  IdsDatagridColumnTitle,
  IdsDatagridFilter,
  IdsDatagridBody,
  IdsDatagridRow,
  IdsDatagridCell,
  IdsDatagridFooter,
  IdsDatagridDetailPanel,
  IdsDatagridFilterSearchField,
  IdsDatagridFilterMultiselect,
  IdsDatagridFilterSingleSelect,
  IdsDatagridFilterNumeric,
  IdsDatagridFilterDate,
  IdsDatagridFilterDateTime,
};
