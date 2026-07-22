import React, { useState, useRef, useEffect } from "react";
import Pagination from "../Pagination/Pagination";
import "./Datagrid.css";

export type DatagridContentType = 'text' | 'number' | 'icon' | 'icon-text' | 'date-time';

export interface DatagridColumn {
  key: string;
  title: string | React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  minWidth?: number;
  width?: number;
  contentType?: DatagridContentType;
  showOverflowMenu?: boolean;
  resizable?: boolean;
}

export interface DatagridRow {
  id: string;
  cells: (string | React.ReactNode)[];
}

export interface DatagridProps {
  columns: DatagridColumn[];
  rows: DatagridRow[];
  rowSelection?: "none" | "single" | "multiple";
  onRowSelectionChange?: (selectedIds: string[]) => void;
  sortable?: boolean;
  onSort?: (columnKey: string, direction: "asc" | "desc") => void;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
  ariaLabel?: string;
  mode?: "normal" | "compact";
  zebraStriping?: boolean;
  columnsResizable?: boolean;
  columnsReorderable?: boolean;
  columnsFilterable?: boolean;
  showOverflowMenus?: boolean;
  defaultSortColumn?: string;
  defaultSortDirection?: "asc" | "desc";
  toolbarLeft?: React.ReactNode;
  toolbarRight?: React.ReactNode;
  grayHeader?: boolean;
}

const Datagrid: React.FC<DatagridProps> = ({
  columns,
  rows,
  rowSelection = "none",
  onRowSelectionChange,
  sortable = false,
  onSort,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  pageSize = 10,
  onPageSizeChange,
  ariaLabel = "Data grid",
  mode = "normal",
  zebraStriping = false,
  columnsResizable = true,
  columnsReorderable = true,
  columnsFilterable = true,
  showOverflowMenus = true,
  defaultSortColumn,
  defaultSortDirection = "asc",
  toolbarLeft,
  toolbarRight,
  grayHeader = false,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const defaultColumn = columns[0]?.key || "";
  const [sortColumn, setSortColumn] = useState<string | null>(defaultSortColumn || defaultColumn);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">(defaultSortDirection);
  const selectAllRef = useRef<HTMLInputElement>(null);
  const [overflowMenuOpen, setOverflowMenuOpen] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);
  const buttonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const [columnWidths, setColumnWidths] = useState<{ [key: string]: number }>({});
  const [resizingColumn, setResizingColumn] = useState<string | null>(null);
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [hasVerticalScrollbar, setHasVerticalScrollbar] = useState(true);
  const scrollViewportRef = useRef<HTMLDivElement>(null);
  const headerWrapperRef = useRef<HTMLDivElement>(null);
  const [columnOrder, setColumnOrder] = useState<string[]>(columns.map(col => col.key));

  useEffect(() => {
    const header = headerWrapperRef.current;
    const viewport = scrollViewportRef.current;
    if (!header || !viewport) return;

    const syncFromViewport = () => {
      header.scrollLeft = viewport.scrollLeft;
    };
    const syncFromHeader = () => {
      viewport.scrollLeft = header.scrollLeft;
    };

    const checkScrollbar = () => {
      const visibleRowCount = mode === "normal" ? 6 : 6;
      const isLastPage = currentPage === totalPages;
      const hasScrollbar = !(isLastPage && rows.length <= visibleRowCount);
      setHasVerticalScrollbar(hasScrollbar);
    };

    const handleWheel = (e: WheelEvent) => {
      if (!hasVerticalScrollbar && e.deltaY !== 0) {
        e.preventDefault();
      }
    };

    checkScrollbar();
    const resizeObserver = new ResizeObserver(checkScrollbar);
    resizeObserver.observe(viewport);

    viewport.addEventListener('scroll', syncFromViewport);
    header.addEventListener('scroll', syncFromHeader);
    viewport.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      viewport.removeEventListener('scroll', syncFromViewport);
      header.removeEventListener('scroll', syncFromHeader);
      resizeObserver.disconnect();
      viewport.removeEventListener('wheel', handleWheel);
    };
  }, [hasVerticalScrollbar, currentPage, totalPages, rows.length, mode]);

  const handleRowSelect = (rowId: string) => {
    const newSelected = rowSelection === "multiple"
      ? selectedIds.includes(rowId)
        ? selectedIds.filter((id) => id !== rowId)
        : [...selectedIds, rowId]
      : [rowId];
    setSelectedIds(newSelected);
    onRowSelectionChange?.(newSelected);
  };

  const handleOverflowMenuToggle = (rowId: string) => {
    if (overflowMenuOpen === rowId) {
      setOverflowMenuOpen(null);
      setMenuPosition(null);
    } else {
      const button = buttonRefs.current[rowId];
      if (button) {
        const rect = button.getBoundingClientRect();
        setMenuPosition({
          top: rect.bottom + 4,
          left: rect.right - 120,
        });
      }
      setOverflowMenuOpen(rowId);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (overflowMenuOpen && menuPosition) {
        const menuElement = document.querySelector('.datagrid__overflow-menu');
        if (menuElement && !menuElement.contains(e.target as Node)) {
          const button = buttonRefs.current[overflowMenuOpen];
          if (button && !button.contains(e.target as Node)) {
            setOverflowMenuOpen(null);
            setMenuPosition(null);
          }
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [overflowMenuOpen, menuPosition]);

  const handleSelectAll = () => {
    if (selectedIds.length === rows.length) {
      setSelectedIds([]);
      onRowSelectionChange?.([]);
    } else {
      const allIds = rows.map((row) => row.id);
      setSelectedIds(allIds);
      onRowSelectionChange?.(allIds);
    }
  };

  const allSelected = selectedIds.length === rows.length && rows.length > 0;
  const someSelected = selectedIds.length > 0 && selectedIds.length < rows.length;

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = someSelected;
    }
  }, [someSelected]);

  const handleSort = (columnKey: string) => {
    if (!sortable) return;
    const newDirection = sortColumn === columnKey && sortDirection === "asc" ? "desc" : "asc";
    setSortColumn(columnKey);
    setSortDirection(newDirection);
    onSort?.(columnKey, newDirection);
  };

  const renderSortIcon = (columnKey: string) => {
    if (!sortable || sortColumn !== columnKey) return null;
    return (
      <svg width={14} height={14} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d={sortDirection === "asc" ? "M7 2L11 8H3L7 2Z" : "M7 12L3 6H11L7 12Z"}
          fill="currentColor"
        />
      </svg>
    );
  };

  const getAlignmentClass = (contentType?: DatagridContentType) => {
    switch (contentType) {
      case 'number':
        return 'datagrid__cell--right';
      case 'icon':
        return 'datagrid__cell--center';
      default:
        return 'datagrid__cell--left';
    }
  };

  const renderTruncatedText = (text: string) => {
    return (
      <span className="datagrid__truncated-text" title={text}>
        {text}
      </span>
    );
  };

  const handleColumnResize = (columnKey: string, newWidth: number) => {
    setColumnWidths(prev => ({ ...prev, [columnKey]: newWidth }));
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!resizingColumn) return;
      
      const table = document.querySelector('.datagrid__table');
      if (!table) return;
      
      const headerCells = Array.from(table.querySelectorAll('.datagrid__header-cell')) as HTMLElement[];
      const targetCell = headerCells.find(cell => cell.getAttribute('data-column-key') === resizingColumn);
      
      if (targetCell) {
        const rect = targetCell.getBoundingClientRect();
        const newWidth = e.clientX - rect.left;
        const column = columns.find(col => col.key === resizingColumn);
        const minWidth = column?.minWidth || 50;
        
        if (newWidth >= minWidth) {
          handleColumnResize(resizingColumn, newWidth);
        }
      }
    };

    const handleMouseUp = () => {
      setResizingColumn(null);
    };

    if (resizingColumn) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [resizingColumn, columns]);

  const handleColumnDragStart = (columnKey: string) => {
    setDraggedColumn(columnKey);
  };

  const handleColumnDragOver = (columnKey: string) => {
    setDragOverColumn(columnKey);
  };

  const handleColumnDrop = (columnKey: string) => {
    if (!draggedColumn || draggedColumn === columnKey) return;
    
    const newOrder = [...columnOrder];
    const draggedIndex = newOrder.indexOf(draggedColumn);
    const dropIndex = newOrder.indexOf(columnKey);
    
    newOrder.splice(draggedIndex, 1);
    newOrder.splice(dropIndex, 0, draggedColumn);
    
    setColumnOrder(newOrder);
    setDraggedColumn(null);
    setDragOverColumn(null);
  };

  const handleColumnDragEnd = () => {
    setDraggedColumn(null);
    setDragOverColumn(null);
  };

  const getOrderedColumns = () => {
    return columnOrder.map(key => columns.find(col => col.key === key)!).filter(Boolean);
  };

  const orderedColumns = getOrderedColumns();

  const extractText = (node: any): string => {
    if (node === null || node === undefined || typeof node === 'boolean') return '';
    if (typeof node === 'string' || typeof node === 'number') return String(node);
    if (Array.isArray(node)) return node.map(extractText).join(' ');
    if (React.isValidElement(node)) {
      const props = node.props as any;
      const fromChildren = extractText(props?.children).trim();
      if (fromChildren) return fromChildren;
      if (props?.alt) return props.alt;
    }
    return '';
  };

  const parseDateValue = (value: string): number | null => {
    const text = value.trim();
    if (!text) return null;

    // Try "Month Day(th), Year" e.g. "March 15th, 2023"
    const monthNames = [
      'january', 'february', 'march', 'april', 'may', 'june',
      'july', 'august', 'september', 'october', 'november', 'december'
    ];
    const match = text.match(/([a-z]+)\.?\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{4})/i);
    if (match) {
      const monthIndex = monthNames.indexOf(match[1].toLowerCase());
      const day = parseInt(match[2], 10);
      const year = parseInt(match[3], 10);
      if (monthIndex !== -1) {
        return new Date(year, monthIndex, day).getTime();
      }
    }

    // Fallback to native parsing (handles ISO and numeric formats)
    const native = new Date(text.replace(/(\d+)(st|nd|rd|th)/gi, '$1'));
    return isNaN(native.getTime()) ? null : native.getTime();
  };

  const getSortableValue = (cell: any, contentType?: DatagridContentType) => {
    if (typeof cell === 'string') return cell;

    if (contentType === 'icon' && React.isValidElement(cell)) {
      const props = cell.props as any;
      if (props?.alt) return props.alt;
    }

    return extractText(cell).trim();
  };

  const sortedRows = React.useMemo(() => {
    if (!sortColumn || !sortable) return rows;
    
    const sortColumnDef = columns.find(col => col.key === sortColumn);
    if (!sortColumnDef) return rows;
    
    const originalIndex = columns.findIndex(col => col.key === sortColumn);
    if (originalIndex === -1) return rows;
    
    return [...rows].sort((a, b) => {
      const aValue = getSortableValue(a.cells[originalIndex], sortColumnDef.contentType);
      const bValue = getSortableValue(b.cells[originalIndex], sortColumnDef.contentType);
      
      // Special handling for date-time columns
      if (sortColumnDef.contentType === 'date-time') {
        const aTime = parseDateValue(aValue);
        const bTime = parseDateValue(bValue);
        if (aTime === null || bTime === null) {
          return aValue.localeCompare(bValue);
        }
        const comparison = aTime - bTime;
        return sortDirection === 'asc' ? comparison : -comparison;
      }
      
      // Special handling for numeric columns
      if (sortColumnDef.contentType === 'number') {
        const aNum = parseFloat(aValue.replace(/[^0-9.-]/g, ''));
        const bNum = parseFloat(bValue.replace(/[^0-9.-]/g, ''));
        if (!isNaN(aNum) && !isNaN(bNum)) {
          const comparison = aNum - bNum;
          return sortDirection === 'asc' ? comparison : -comparison;
        }
      }
      
      const comparison = aValue.localeCompare(bValue, undefined, { numeric: true });
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [rows, sortColumn, sortDirection, sortable, columns]);

  const paginatedRows = React.useMemo(() => {
    if (totalPages <= 1) return sortedRows;
    
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    
    return sortedRows.slice(startIndex, endIndex);
  }, [sortedRows, currentPage, pageSize, totalPages]);

  const totalCount = rows.length;
  const selectedCount = selectedIds.length;
  const countText = selectedCount > 0 
    ? `${selectedCount} Selected, ${totalCount} Total`
    : `${totalCount} Total`;

  return (
    <div className={`datagrid datagrid--${mode} ${zebraStriping ? 'datagrid--zebra' : ''} ${rowSelection === "none" ? 'datagrid--no-hover' : ''}`} role="region" aria-label={ariaLabel}>
      {(toolbarLeft || toolbarRight) && (
        <div className="datagrid__toolbar">
          <div className="datagrid__toolbar-left">
            {toolbarLeft}
          </div>
          <div className="datagrid__toolbar-right">
            <span className="datagrid__toolbar-count">{countText}</span>
            {toolbarRight}
          </div>
        </div>
      )}
      <div className={`datagrid__header-wrapper ${grayHeader ? 'datagrid__header-wrapper--gray' : ''}`} ref={headerWrapperRef}>
        <table className="datagrid__table datagrid__table--header">
          <colgroup>
            {rowSelection !== "none" && <col width={mode === "normal" ? "48" : "40"} />}
            {orderedColumns.map((col) => (
              <col
                key={col.key}
                width={columnWidths[col.key] || col.width || "auto"}
                style={{ minWidth: col.minWidth }}
              />
            ))}
            <col width={40} />
          </colgroup>
          <thead className="datagrid__header">
            <tr>
              {rowSelection !== "none" && (
                <th className="datagrid__header-cell datagrid__header-cell--selection">
                  {rowSelection === "multiple" && (
                    <input
                      type="checkbox"
                      ref={selectAllRef}
                      checked={allSelected}
                      onChange={handleSelectAll}
                      aria-label="Select all rows"
                    />
                  )}
                </th>
              )}
              {orderedColumns.map((col, index) => (
                <th
                  key={col.key}
                  data-column-key={col.key}
                  className={`datagrid__header-cell ${sortable && (col.sortable !== false) ? "datagrid__header-cell--sortable" : ""} ${getAlignmentClass(col.contentType)} ${col.contentType === 'icon' ? 'datagrid__header-cell--icon' : ''} ${draggedColumn === col.key ? 'datagrid__header-cell--dragging' : ''} ${dragOverColumn === col.key ? 'datagrid__header-cell--drag-over' : ''}`}
                  onClick={() => sortable && (col.sortable !== false) && handleSort(col.key)}
                  draggable={columnsReorderable}
                  onDragStart={() => columnsReorderable && handleColumnDragStart(col.key)}
                  onDragOver={(e) => { e.preventDefault(); columnsReorderable && handleColumnDragOver(col.key); }}
                  onDrop={() => columnsReorderable && handleColumnDrop(col.key)}
                  onDragEnd={handleColumnDragEnd}
                  aria-sort={
                    sortColumn === col.key
                      ? sortDirection === "asc"
                        ? "ascending"
                        : "descending"
                      : undefined
                  }
                >
                  <div className="datagrid__header-title">
                    <span className="datagrid__header-label">
                      {typeof col.title === 'string' ? renderTruncatedText(col.title) : col.title}
                    </span>
                    {renderSortIcon(col.key)}
                  </div>
                  {columnsResizable && col.resizable !== false && (
                    <div
                      className="datagrid__column-resize-handle"
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setResizingColumn(col.key);
                      }}
                      onDragStart={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                      }}
                    />
                  )}
                </th>
              ))}
              <th className="datagrid__header-cell datagrid__header-cell--settings"></th>
            </tr>
          </thead>
        </table>
      </div>
      <div className={`datagrid__scroll-viewport ${hasVerticalScrollbar ? '' : 'datagrid__scroll-viewport--no-scrollbar'}`} ref={scrollViewportRef}>
        <table className="datagrid__table">
          <colgroup>
            {rowSelection !== "none" && <col width={mode === "normal" ? "48" : "40"} />}
            {orderedColumns.map((col) => (
              <col
                key={col.key}
                width={columnWidths[col.key] || col.width || "auto"}
                style={{ minWidth: col.minWidth }}
              />
            ))}
            <col width={40} />
          </colgroup>
          <tbody>
            {paginatedRows.map((row, rowIndex) => (
              <tr
                key={row.id}
                className={`datagrid__row ${selectedIds.includes(row.id) ? "datagrid__row--selected" : ""} ${zebraStriping && rowIndex % 2 === 1 ? "datagrid__row--zebra" : ""}`}
              >
                {rowSelection !== "none" && (
                  <td className="datagrid__cell datagrid__cell--selection">
                    <input
                      type={rowSelection === "multiple" ? "checkbox" : "radio"}
                      checked={selectedIds.includes(row.id)}
                      onChange={() => handleRowSelect(row.id)}
                      name={rowSelection === "single" ? "row-selection" : undefined}
                      aria-label={rowSelection === "single" ? "Select row" : undefined}
                    />
                  </td>
                )}
                {orderedColumns.map((col) => {
                  const originalIndex = columns.findIndex(c => c.key === col.key);
                  const cell = row.cells[originalIndex];
                  const cellText = typeof cell === 'string' ? cell : '';
                  return (
                    <td key={col.key} className={`datagrid__cell ${getAlignmentClass(col.contentType)}`}>
                      {typeof cell === 'string' ? renderTruncatedText(cell) : cell}
                    </td>
                  );
                })}
                <td className="datagrid__cell datagrid__cell--settings">
                  {showOverflowMenus && (
                    <div className="datagrid__row-settings-wrapper">
                      <button
                        type="button"
                        className="datagrid__row-settings"
                        ref={(el) => buttonRefs.current[row.id] = el}
                        onClick={() => handleOverflowMenuToggle(row.id)}
                        aria-label="Row settings"
                      >
                        <svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="2" cy="8" r="1.5" fill="currentColor" />
                          <circle cx="8" cy="8" r="1.5" fill="currentColor" />
                          <circle cx="14" cy="8" r="1.5" fill="currentColor" />
                        </svg>
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {overflowMenuOpen && menuPosition && (
        <div
          className="datagrid__overflow-menu"
          style={{
            position: 'fixed',
            top: menuPosition.top,
            left: menuPosition.left,
            zIndex: 9999,
          }}
        >
          <button type="button" className="datagrid__overflow-menu-item" onClick={() => { setOverflowMenuOpen(null); setMenuPosition(null); }}>Edit</button>
          <button type="button" className="datagrid__overflow-menu-item" onClick={() => { setOverflowMenuOpen(null); setMenuPosition(null); }}>Delete</button>
          <button type="button" className="datagrid__overflow-menu-item" onClick={() => { setOverflowMenuOpen(null); setMenuPosition(null); }}>View Details</button>
        </div>
      )}
      {totalPages > 1 && (
        <div className="datagrid__footer">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange || (() => {})}
            pageSize={pageSize}
            onPageSizeChange={onPageSizeChange}
            pageSizeOptions={[10, 25, 50, 100, 500]}
            backgroundMode={grayHeader ? "gray" : "none"}
            showFirstLast={true}
            showResultsPerPage={true}
          />
        </div>
      )}
    </div>
  );
};

export default Datagrid;
