import styles from "./Table.module.css";

interface TableColumn {
  key: string;
  header: string;
  width?: string;
}

interface TableProps {
  columns: TableColumn[];
  data: Record<string, React.ReactNode>[];
  striped?: boolean;
  hoverable?: boolean;
}

export function Table({
  columns,
  data,
  striped = false,
  hoverable = false,
}: TableProps) {
  const tableClasses = [
    styles.table,
    striped ? styles.striped : "",
    hoverable ? styles.hoverable : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={styles.wrapper}>
      <table className={tableClasses}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={styles.th}
                style={col.width ? { width: col.width } : undefined}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
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
