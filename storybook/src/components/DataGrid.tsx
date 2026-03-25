import { useState, useMemo, useCallback } from "react";
import styles from "./DataGrid.module.css";

type SortDirection = "asc" | "desc" | null;

interface DataGridColumn {
  key: string;
  header: string;
  sortable?: boolean;
}

interface DataGridProps {
  columns: DataGridColumn[];
  data: Record<string, React.ReactNode>[];
  onSort?: (key: string, direction: SortDirection) => void;
}

export function DataGrid({ columns, data, onSort }: DataGridProps) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDirection>(null);

  const handleSort = useCallback(
    (key: string) => {
      let nextDir: SortDirection;
      if (sortKey !== key) {
        nextDir = "asc";
      } else if (sortDir === "asc") {
        nextDir = "desc";
      } else {
        nextDir = null;
      }
      setSortKey(nextDir ? key : null);
      setSortDir(nextDir);
      onSort?.(key, nextDir);
    },
    [sortKey, sortDir, onSort],
  );

  const sortedData = useMemo(() => {
    if (!sortKey || !sortDir) return data;
    return [...data].sort((a, b) => {
      const aVal = String(a[sortKey] ?? "");
      const bVal = String(b[sortKey] ?? "");
      const cmp = aVal.localeCompare(bVal, undefined, { numeric: true });
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [data, sortKey, sortDir]);

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col) => {
              const isSorted = sortKey === col.key;
              return (
                <th key={col.key} className={styles.th}>
                  {col.sortable ? (
                    <button
                      type="button"
                      className={styles.sortButton}
                      onClick={() => handleSort(col.key)}
                      aria-sort={
                        isSorted
                          ? sortDir === "asc"
                            ? "ascending"
                            : "descending"
                          : "none"
                      }
                    >
                      <span>{col.header}</span>
                      <SortIcon
                        active={isSorted}
                        direction={isSorted ? sortDir : null}
                      />
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, i) => (
            <tr key={i} className={styles.tr}>
              {columns.map((col) => (
                <td key={col.key} className={styles.td}>
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SortIcon({
  active,
  direction,
}: {
  active: boolean;
  direction: SortDirection;
}) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      className={styles.sortIcon}
    >
      <path
        d="M7 2L10 6H4L7 2Z"
        fill="currentColor"
        opacity={active && direction === "asc" ? 1 : 0.3}
      />
      <path
        d="M7 12L4 8H10L7 12Z"
        fill="currentColor"
        opacity={active && direction === "desc" ? 1 : 0.3}
      />
    </svg>
  );
}
