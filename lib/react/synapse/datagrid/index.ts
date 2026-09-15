/**
 * Synapse façade — strategy: reexport.
 * IDS implementation: `lib/react/ids/datagrid`.
 * Load `components/synapse-theme.css` only (not `ids-theme.css`).
 */
export {
  IdsDatagrid as SynapseDatagrid,
  type IdsDatagridProps as SynapseDatagridProps,
  type IdsDatagridColumnDef as SynapseDatagridColumnDef,
  type IdsDatagridRowDef as SynapseDatagridRowDef,
  type IdsDatagridViewMode as SynapseDatagridViewMode,
  type IdsDatagridSelectionMode as SynapseDatagridSelectionMode,
  type IdsDatagridSortDirection as SynapseDatagridSortDirection,
} from "../../ids/datagrid";
export {
  IdsDatagridColumn as SynapseDatagridColumn,
  IdsDatagridColumnTitle as SynapseDatagridColumnTitle,
  IdsDatagridFilter as SynapseDatagridFilter,
  IdsDatagridBody as SynapseDatagridBody,
  IdsDatagridRow as SynapseDatagridRow,
  IdsDatagridCell as SynapseDatagridCell,
  IdsDatagridFooter as SynapseDatagridFooter,
  IdsDatagridDetailPanel as SynapseDatagridDetailPanel,
  resolveIdsDatagridColumnFilterActive as resolveSynapseDatagridColumnFilterActive,
  type IdsDatagridColumnProps as SynapseDatagridColumnProps,
  type IdsDatagridColumnTitleProps as SynapseDatagridColumnTitleProps,
  type IdsDatagridFilterProps as SynapseDatagridFilterProps,
  type IdsDatagridBodyProps as SynapseDatagridBodyProps,
  type IdsDatagridRowProps as SynapseDatagridRowProps,
  type IdsDatagridCellProps as SynapseDatagridCellProps,
  type IdsDatagridFooterProps as SynapseDatagridFooterProps,
  type IdsDatagridDetailPanelSlotProps as SynapseDatagridDetailPanelSlotProps,
} from "../../ids/datagrid";
export {
  IdsDatagridTextFilter as SynapseDatagridTextFilter,
  IdsDatagridMultiselectFilter as SynapseDatagridMultiselectFilter,
  IdsDatagridDropdownMultiSelectFilter as SynapseDatagridDropdownMultiSelectFilter,
  IdsDatagridSingleSelectFilter as SynapseDatagridSingleSelectFilter,
  IdsDatagridDropdownSingleSelectFilter as SynapseDatagridDropdownSingleSelectFilter,
  IdsDatagridNumericFilter as SynapseDatagridNumericFilter,
  IdsDatagridDateFilter as SynapseDatagridDateFilter,
  IdsDatagridDateTimeFilter as SynapseDatagridDateTimeFilter,
  type IdsDatagridTextFilterProps as SynapseDatagridTextFilterProps,
  type IdsDatagridMultiselectFilterProps as SynapseDatagridMultiselectFilterProps,
  type IdsDatagridSingleSelectFilterProps as SynapseDatagridSingleSelectFilterProps,
  type IdsDatagridNumericFilterProps as SynapseDatagridNumericFilterProps,
  type IdsDatagridNumericUnitOption as SynapseDatagridNumericUnitOption,
  type IdsDatagridDateFilterProps as SynapseDatagridDateFilterProps,
  type IdsDatagridDateTimeFilterProps as SynapseDatagridDateTimeFilterProps,
} from "../../ids/datagrid";
export {
  defaultIdsDatagridNumericFilterState as defaultSynapseDatagridNumericFilterState,
  isIdsDatagridNumericFilterActive as isSynapseDatagridNumericFilterActive,
  matchesIdsDatagridNumericFilter as matchesSynapseDatagridNumericFilter,
  type IdsDatagridNumericFilterState as SynapseDatagridNumericFilterState,
  type IdsDatagridNumericOperator as SynapseDatagridNumericOperator,
} from "../../ids/datagrid";
export {
  defaultIdsDatagridDateFilterState as defaultSynapseDatagridDateFilterState,
  isIdsDatagridDateFilterActive as isSynapseDatagridDateFilterActive,
  matchesIdsDatagridDateFilter as matchesSynapseDatagridDateFilter,
  formatIdsDatagridDateFilterSummary as formatSynapseDatagridDateFilterSummary,
  type IdsDatagridDateFilterState as SynapseDatagridDateFilterState,
  type IdsDatagridDateFilterMode as SynapseDatagridDateFilterMode,
} from "../../ids/datagrid";
export {
  defaultIdsDatagridDateTimeFilterState as defaultSynapseDatagridDateTimeFilterState,
  isIdsDatagridDateTimeFilterActive as isSynapseDatagridDateTimeFilterActive,
  matchesIdsDatagridDateTimeFilter as matchesSynapseDatagridDateTimeFilter,
  formatIdsDatagridDateTimeFilterSummary as formatSynapseDatagridDateTimeFilterSummary,
  type IdsDatagridDateTimeFilterState as SynapseDatagridDateTimeFilterState,
  type IdsDatagridDateTimeFilterMode as SynapseDatagridDateTimeFilterMode,
} from "../../ids/datagrid";
export {
  flattenIdsDatagridTree as flattenSynapseDatagridTree,
  collectIdsDatagridTreeNodeIds as collectSynapseDatagridTreeNodeIds,
  type IdsDatagridTreeNode as SynapseDatagridTreeNode,
  type IdsDatagridTreeRowSelection as SynapseDatagridTreeRowSelection,
} from "../../ids/datagrid";
