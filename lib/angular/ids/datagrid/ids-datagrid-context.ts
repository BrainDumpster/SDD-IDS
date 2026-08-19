import { InjectionToken } from "@angular/core";
import type { TemplateRef } from "@angular/core";

export interface IdsDatagridColumnModel {
  field: string;
  title: string;
  minWidth?: number;
  width?: number;
  sortable?: boolean;
  filterable?: boolean;
  filterActive?: boolean;
  columnHideable?: boolean;
  filterTemplate?: TemplateRef<unknown> | null;
}

export interface IdsDatagridRowModel {
  rowId: string;
  cells: Map<string, string>;
}

export interface IdsDatagridContext {
  registerColumn(column: IdsDatagridColumnModel): void;
  unregisterColumn(field: string): void;
  registerRow(row: IdsDatagridRowModel): void;
  unregisterRow(rowId: string): void;
  setRowCell(rowId: string, field: string, value: string): void;
}

export const IDS_DATAGRID_CONTEXT = new InjectionToken<IdsDatagridContext>("IDS_DATAGRID_CONTEXT");
