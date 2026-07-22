import React, { useState } from "react";
import "./Table.css";

export interface TableColumn {
  id: string;
  label: string;
  sortable?: boolean;
  resizable?: boolean;
  width?: string;
}

export interface TableRow {
  id: string;
  cells: (string | React.ReactNode)[];
  selected?: boolean;
}

export interface TableProps {
  columns: TableColumn[];
  rows: TableRow[];
  selectable?: boolean;
  sortable?: boolean;
  hoverable?: boolean;
  striped?: boolean;
  bordered?: boolean;
  compact?: boolean;
  loading?: boolean;
  empty?: boolean;
  emptyMessage?: string;
  onRowSelect?: (rowId: string, selected: boolean) => void;
  onSort?: (columnId: string, direction: "asc" | "desc") => void;
  onPageChange?: (page: number) => void;
  currentPage?: number;
  totalPages?: number;
}

const Table: React.FC<TableProps> = ({
  columns,
  rows,
  selectable = false,
  sortable = false,
  hoverable = true,
  striped = false,
  bordered = false,
  compact = false,
  loading = false,
  empty = false,
  emptyMessage = "No data available",
  onRowSelect,
  onSort,
  onPageChange,
  currentPage = 1,
  totalPages = 1,
}) => {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const handleSort = (columnId: string) => {
    if (!sortable) return;

    const newDirection = sortColumn === columnId && sortDirection === "asc" ? "desc" : "asc";
    setSortColumn(columnId);
    setSortDirection(newDirection);
    onSort?.(columnId, newDirection);
  };

  const handleRowSelect = (rowId: string) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(rowId)) {
      newSelected.delete(rowId);
    } else {
      newSelected.add(rowId);
    }
    setSelectedRows(newSelected);
    onRowSelect?.(rowId, newSelected.has(rowId));
  };

  const handleSelectAll = () => {
    if (selectedRows.size === rows.length) {
      setSelectedRows(new Set());
      rows.forEach((row) => onRowSelect?.(row.id, false));
    } else {
      const allIds = new Set(rows.map((r) => r.id));
      setSelectedRows(allIds);
      rows.forEach((row) => onRowSelect?.(row.id, true));
    }
  };

  const renderSortIcon = (columnId: string) => {
    if (!sortable || sortColumn !== columnId) return null;
    return (
      <span className="table__sort-icon">
        {sortDirection === "asc" ? "↑" : "↓"}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="table-container">
        <div className="table__loading">Loading...</div>
      </div>
    );
  }

  if (empty || rows.length === 0) {
    return (
      <div className="table-container">
        <div className="table__empty">{emptyMessage}</div>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className={`table ${hoverable ? "table--hoverable" : ""} ${striped ? "table--striped" : ""} ${bordered ? "table--bordered" : ""} ${compact ? "table--compact" : ""}`}>
        <thead>
          <tr className="table__header-row">
            {selectable && (
              <th className="table__header-cell table__header-cell--checkbox">
                <input
                  type="checkbox"
                  checked={selectedRows.size === rows.length && rows.length > 0}
                  onChange={handleSelectAll}
                  aria-label="Select all rows"
                />
              </th>
            )}
            {columns.map((column) => (
              <th
                key={column.id}
                className={`table__header-cell ${sortable ? "table__header-cell--sortable" : ""}`}
                style={{ width: column.width }}
                onClick={() => handleSort(column.id)}
                aria-sort={sortColumn === column.id ? (sortDirection === "asc" ? "ascending" : "descending") : undefined}
              >
                {column.label}
                {renderSortIcon(column.id)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.id}
              className={`table__row ${selectedRows.has(row.id) ? "table__row--selected" : ""}`}
              onClick={() => selectable && handleRowSelect(row.id)}
            >
              {selectable && (
                <td className="table__cell table__cell--checkbox">
                  <input
                    type="checkbox"
                    checked={selectedRows.has(row.id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleRowSelect(row.id);
                    }}
                    aria-label={`Select row ${row.id}`}
                  />
                </td>
              )}
              {row.cells.map((cell, index) => (
                <td key={index} className="table__cell">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {totalPages > 1 && onPageChange && (
        <div className="table__pagination">
          <button
            type="button"
            className="table__pagination-button"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            Previous
          </button>
          <span className="table__pagination-info">
            Page {currentPage} of {totalPages}
          </span>
          <button
            type="button"
            className="table__pagination-button"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Table;
