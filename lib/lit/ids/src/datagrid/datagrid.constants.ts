/**
 * IDS Datagrid constants — aligned with
 * `component-contracts/ids/datagrid.contract.ts` and Angular/React ports.
 */

export type IdsDatagridViewMode = "table" | "treeview";
export type IdsDatagridSelectionMode = "single" | "multiple";
export type IdsDatagridSortDirection = "asc" | "desc";
export type IdsDatagridColumnAlign = "left" | "right";

export const DATAGRID_SELECTION_COL_WIDTH = 48;
export const DATAGRID_SETTINGS_COL_WIDTH = 40;
export const DATAGRID_DEFAULT_MIN_WIDTH = 90;
export const DATAGRID_DEFAULT_COLUMN_WIDTH = 160;

export const IDS_DATAGRID_COLUMN_VISIBILITY_MIN_ERROR =
  "At least one column must remain visible.";

/** Spec Accurate Design defaults — design-spec Composition & API. */
export const DATAGRID_SPEC_ACCURATE_DEFAULTS = {
  viewMode: "table" as IdsDatagridViewMode,
  rowSelection: true,
  selectionMode: "single" as IdsDatagridSelectionMode,
  showSingleSelectionRadio: true,
  withDetailPanel: true,
  pageSize: 6,
  readOnly: false,
  rowVerticalIndicator: true,
  headerColorAndBorder: true,
  columnResizeEnabled: true,
  showSettingsColumn: true,
} as const;

export const DATAGRID_API_DEFAULTS = {
  viewMode: "table" as IdsDatagridViewMode,
  rowSelection: false,
  selectionMode: "single" as IdsDatagridSelectionMode,
  showSingleSelectionRadio: true,
  withDetailPanel: false,
  pageSize: 25,
  readOnly: false,
  rowVerticalIndicator: false,
  headerColorAndBorder: true,
  columnResizeEnabled: false,
  showSettingsColumn: true,
} as const;

export interface IdsDatagridColumnModel {
  field: string;
  title: string;
  minWidth?: number;
  width?: number;
  defaultWidth?: number;
  sortable?: boolean;
  filterable?: boolean;
  filterActive?: boolean;
  columnHideable?: boolean;
  align?: IdsDatagridColumnAlign;
  /** Light-DOM filter host (`ids-datagrid-filter`) for L-frame body. */
  filterEl?: HTMLElement | null;
}

export interface IdsDatagridRowModel {
  rowId: string;
  cells: Map<string, string>;
}

export interface IdsDatagridHostContext {
  registerColumn(column: IdsDatagridColumnModel): void;
  unregisterColumn(field: string): void;
  registerRow(row: IdsDatagridRowModel): void;
  unregisterRow(rowId: string): void;
  setRowCell(rowId: string, field: string, value: string): void;
  requestSync(): void;
}
