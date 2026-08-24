export {
  IdsDatagrid,
  type IdsDatagridProps,
  type IdsDatagridColumnDef,
  type IdsDatagridRowDef,
  type IdsDatagridViewMode,
  type IdsDatagridSelectionMode,
  type IdsDatagridSortDirection,
} from "./IdsDatagrid";
export {
  IdsDatagridColumn,
  IdsDatagridColumnTitle,
  IdsDatagridFilter,
  IdsDatagridBody,
  IdsDatagridRow,
  IdsDatagridCell,
  IdsDatagridFooter,
  IdsDatagridDetailPanel,
  collectDatagridAnatomy,
  resolveIdsDatagridColumnFilterActive,
  type IdsDatagridColumnProps,
  type IdsDatagridColumnTitleProps,
  type IdsDatagridFilterProps,
  type IdsDatagridBodyProps,
  type IdsDatagridRowProps,
  type IdsDatagridCellProps,
  type IdsDatagridFooterProps,
  type IdsDatagridDetailPanelSlotProps,
} from "./IdsDatagridSlots";
export {
  IdsDatagridTextFilter,
  IdsDatagridMultiselectFilter,
  IdsDatagridDropdownMultiSelectFilter,
  IdsDatagridSingleSelectFilter,
  IdsDatagridDropdownSingleSelectFilter,
  IdsDatagridNumericFilter,
  IdsDatagridDateFilter,
  IdsDatagridDateTimeFilter,
  type IdsDatagridTextFilterProps,
  type IdsDatagridMultiselectFilterProps,
  type IdsDatagridSingleSelectFilterProps,
  type IdsDatagridNumericFilterProps,
  type IdsDatagridNumericUnitOption,
  type IdsDatagridDateFilterProps,
  type IdsDatagridDateTimeFilterProps,
} from "./IdsDatagridFilters";
export {
  defaultIdsDatagridNumericFilterState,
  isIdsDatagridNumericFilterActive,
  matchesIdsDatagridNumericFilter,
  IDS_DATAGRID_NUMERIC_OPERATOR_LABELS,
  type IdsDatagridNumericFilterState,
  type IdsDatagridNumericOperator,
} from "./IdsDatagridNumericFilter";
export {
  defaultIdsDatagridDateFilterState,
  isIdsDatagridDateFilterActive,
  matchesIdsDatagridDateFilter,
  formatIdsDatagridDateFilterSummary,
  IDS_DATAGRID_DATE_FILTER_MODES,
  IDS_DATAGRID_DATE_MODE_LABELS,
  type IdsDatagridDateFilterState,
  type IdsDatagridDateFilterMode,
} from "./IdsDatagridDateFilter";
export {
  defaultIdsDatagridDateTimeFilterState,
  isIdsDatagridDateTimeFilterActive,
  matchesIdsDatagridDateTimeFilter,
  formatIdsDatagridDateTimeFilterSummary,
  IDS_DATAGRID_DATETIME_FILTER_MODES,
  IDS_DATAGRID_DATETIME_MODE_LABELS,
  type IdsDatagridDateTimeFilterState,
  type IdsDatagridDateTimeFilterMode,
} from "./IdsDatagridDateTimeFilter";
export {
  flattenIdsDatagridTree,
  collectIdsDatagridTreeNodeIds,
  type IdsDatagridTreeNode,
  type IdsDatagridTreeRowSelection,
  type FlatIdsDatagridTreeRow,
} from "./IdsDatagridTree";

import { IdsDatagrid } from "./IdsDatagrid";
import {
  IdsDatagridBody,
  IdsDatagridCell,
  IdsDatagridColumn,
  IdsDatagridColumnTitle,
  IdsDatagridDetailPanel,
  IdsDatagridFilter,
  IdsDatagridFooter,
  IdsDatagridRow,
} from "./IdsDatagridSlots";
import {
  IdsDatagridDateFilter,
  IdsDatagridDateTimeFilter,
  IdsDatagridDropdownMultiSelectFilter,
  IdsDatagridDropdownSingleSelectFilter,
  IdsDatagridMultiselectFilter,
  IdsDatagridNumericFilter,
  IdsDatagridSingleSelectFilter,
  IdsDatagridTextFilter,
} from "./IdsDatagridFilters";

/** Compound namespace matching spec Anatomy + FilterPanelBody types. */
export const IdsDatagridCompound = Object.assign(IdsDatagrid, {
  Column: IdsDatagridColumn,
  ColumnTitle: IdsDatagridColumnTitle,
  Filter: IdsDatagridFilter,
  Body: IdsDatagridBody,
  Row: IdsDatagridRow,
  Cell: IdsDatagridCell,
  Footer: IdsDatagridFooter,
  DetailPanel: IdsDatagridDetailPanel,
});

export const IdsDatagridFilterCompound = Object.assign(IdsDatagridFilter, {
  Text: IdsDatagridTextFilter,
  Multiselect: IdsDatagridMultiselectFilter,
  ComboboxMultiselect: IdsDatagridMultiselectFilter,
  ComboboxSingleSelect: IdsDatagridSingleSelectFilter,
  DropdownMultiSelect: IdsDatagridDropdownMultiSelectFilter,
  DropdownSingleSelect: IdsDatagridDropdownSingleSelectFilter,
  Numeric: IdsDatagridNumericFilter,
  Date: IdsDatagridDateFilter,
  DateTime: IdsDatagridDateTimeFilter,
});

export default IdsDatagridCompound;
