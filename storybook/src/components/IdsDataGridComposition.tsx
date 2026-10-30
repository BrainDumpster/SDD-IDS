import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  IdsDataGrid,
  IdsDataGridFilterSearchField,
  type IdsDataGridColumn,
  type IdsDataGridProps,
  type IdsDataGridRow,
} from "./IdsDataGrid";
import { IdsDataGridDefaultStoryHost } from "./IdsDataGridDefaultStoryHost";

type ColumnRegistration = {
  key: string;
  title: string;
  minWidth?: number;
  width?: number;
  defaultWidth?: number;
  sortable?: boolean;
  filterable?: boolean;
  filterActive?: boolean;
  columnHideable?: boolean;
  filterPanel?: ReactNode;
};

type RowRegistration = {
  id: string;
  values: Record<string, ReactNode>;
};

type DatagridCompositionContextValue = {
  registerColumn: (column: ColumnRegistration) => void;
  unregisterColumn: (key: string) => void;
  registerRow: (row: RowRegistration) => void;
  unregisterRow: (id: string) => void;
  setRowCell: (rowId: string, field: string, content: ReactNode) => void;
  clearRowCell: (rowId: string, field: string) => void;
};

const DatagridCompositionContext = createContext<DatagridCompositionContextValue | null>(null);

function useDatagridCompositionContext(component: string): DatagridCompositionContextValue {
  const ctx = useContext(DatagridCompositionContext);
  if (!ctx) {
    throw new Error(`${component} must be used inside IdsDataGridComposed.`);
  }
  return ctx;
}

export type IdsDataGridComposedProps = Omit<IdsDataGridProps, "columns" | "rows"> & {
  children: ReactNode;
  /** When true (default), wires filter state for Type/Status/Owner/Region columns like the spec story host. */
  wireDefaultFilters?: boolean;
};

export function IdsDataGridComposed({
  children,
  wireDefaultFilters = true,
  ...gridProps
}: IdsDataGridComposedProps) {
  const [columnsByKey, setColumnsByKey] = useState<Map<string, ColumnRegistration>>(
    () => new Map(),
  );
  const [rowsById, setRowsById] = useState<Map<string, RowRegistration>>(() => new Map());

  const registerColumn = useCallback((column: ColumnRegistration) => {
    setColumnsByKey((prev) => {
      const next = new Map(prev);
      next.set(column.key, column);
      return next;
    });
  }, []);

  const unregisterColumn = useCallback((key: string) => {
    setColumnsByKey((prev) => {
      if (!prev.has(key)) return prev;
      const next = new Map(prev);
      next.delete(key);
      return next;
    });
  }, []);

  const registerRow = useCallback((row: RowRegistration) => {
    setRowsById((prev) => {
      const next = new Map(prev);
      next.set(row.id, row);
      return next;
    });
  }, []);

  const unregisterRow = useCallback((id: string) => {
    setRowsById((prev) => {
      if (!prev.has(id)) return prev;
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const setRowCell = useCallback((rowId: string, field: string, content: ReactNode) => {
    setRowsById((prev) => {
      const existing = prev.get(rowId);
      if (!existing) return prev;
      const next = new Map(prev);
      next.set(rowId, {
        ...existing,
        values: { ...existing.values, [field]: content },
      });
      return next;
    });
  }, []);

  const clearRowCell = useCallback((rowId: string, field: string) => {
    setRowsById((prev) => {
      const existing = prev.get(rowId);
      if (!existing || !(field in existing.values)) return prev;
      const nextValues = { ...existing.values };
      delete nextValues[field];
      const next = new Map(prev);
      next.set(rowId, { ...existing, values: nextValues });
      return next;
    });
  }, []);

  const contextValue = useMemo(
    () => ({
      registerColumn,
      unregisterColumn,
      registerRow,
      unregisterRow,
      setRowCell,
      clearRowCell,
    }),
    [
      registerColumn,
      unregisterColumn,
      registerRow,
      unregisterRow,
      setRowCell,
      clearRowCell,
    ],
  );

  const columns = useMemo((): IdsDataGridColumn[] => {
    return [...columnsByKey.values()].map((column) => ({
      key: column.key,
      title: column.title,
      minWidth: column.minWidth,
      width: column.width,
      defaultWidth: column.defaultWidth,
      sortable: column.sortable,
      filterable: column.filterable,
      filterActive: column.filterActive,
      columnHideable: column.columnHideable,
      filterPanel: column.filterPanel,
    }));
  }, [columnsByKey]);

  const rows = useMemo((): IdsDataGridRow[] => {
    return [...rowsById.values()];
  }, [rowsById]);

  const hostProps = { ...gridProps, columns, rows };
  const GridHost = wireDefaultFilters ? IdsDataGridDefaultStoryHost : IdsDataGrid;

  return (
    <DatagridCompositionContext.Provider value={contextValue}>
      {children}
      {columns.length > 0 && rows.length > 0 ? <GridHost {...hostProps} /> : null}
    </DatagridCompositionContext.Provider>
  );
}

export type IdsDataGridColumnProps = {
  field: string;
  title: string;
  minWidth?: number;
  width?: number;
  defaultWidth?: number;
  sortable?: boolean;
  filterable?: boolean;
  filterActive?: boolean;
  columnHideable?: boolean;
  children?: ReactNode;
};

export function IdsDataGridColumn({
  field,
  title,
  children,
  minWidth,
  width,
  defaultWidth,
  sortable,
  filterable,
  filterActive,
  columnHideable,
}: IdsDataGridColumnProps) {
  const ctx = useDatagridCompositionContext("IdsDataGridColumn");
  const [filterPanel, setFilterPanel] = useState<ReactNode | undefined>(undefined);

  useEffect(() => {
    ctx.registerColumn({
      key: field,
      title,
      minWidth,
      width,
      defaultWidth,
      sortable,
      filterable,
      filterActive,
      columnHideable,
      filterPanel,
    });
    return () => ctx.unregisterColumn(field);
  }, [
    ctx,
    field,
    title,
    minWidth,
    width,
    defaultWidth,
    sortable,
    filterable,
    filterActive,
    columnHideable,
    filterPanel,
  ]);

  return (
    <DatagridFilterPanelContext.Provider value={{ setFilterPanel }}>
      {children}
    </DatagridFilterPanelContext.Provider>
  );
}

type DatagridFilterPanelContextValue = {
  setFilterPanel: (panel: ReactNode | undefined) => void;
};

const DatagridFilterPanelContext = createContext<DatagridFilterPanelContextValue | null>(null);

export type IdsDataGridFilterProps = {
  children: ReactNode;
};

export function IdsDataGridFilter({ children }: IdsDataGridFilterProps) {
  const panelCtx = useContext(DatagridFilterPanelContext);
  useEffect(() => {
    panelCtx?.setFilterPanel(children);
    return () => panelCtx?.setFilterPanel(undefined);
  }, [panelCtx, children]);
  return null;
}

export type IdsDataGridRowProps = {
  rowId: string;
  children: ReactNode;
};

const DatagridRowContext = createContext<string | null>(null);

export function IdsDataGridRow({ rowId, children }: IdsDataGridRowProps) {
  const ctx = useDatagridCompositionContext("IdsDataGridRow");

  useEffect(() => {
    ctx.registerRow({ id: rowId, values: {} });
    return () => ctx.unregisterRow(rowId);
  }, [ctx, rowId]);

  return <DatagridRowContext.Provider value={rowId}>{children}</DatagridRowContext.Provider>;
}

export type IdsDataGridCellProps = {
  field: string;
  children: ReactNode;
};

export function IdsDataGridCell({ field, children }: IdsDataGridCellProps) {
  const rowId = useContext(DatagridRowContext);
  const ctx = useDatagridCompositionContext("IdsDataGridCell");
  const cellId = useId();

  useEffect(() => {
    if (!rowId) return;
    ctx.setRowCell(rowId, field, children);
    return () => ctx.clearRowCell(rowId, field);
  }, [ctx, rowId, field, children, cellId]);

  return null;
}

export type IdsDataGridFooterProps = {
  children?: ReactNode;
};

/** Footer slot marker — pagination is grid-owned; projected content is optional chrome above pagination. */
export function IdsDataGridFooter(_props: IdsDataGridFooterProps) {
  return null;
}

export { IdsDataGridFilterSearchField };
