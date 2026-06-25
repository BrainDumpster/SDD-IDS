import { forwardRef } from "react";
import { Icon } from "../Icon";
import type { TopologyNodeTooltipRow } from "../../spec-contracts/topology/synapse-topology.contract";
import styles from "./TopologyNodeTooltip.module.css";

export interface TopologyNodeTooltipProps {
  title: string;
  statusIconSlug?: string;
  rows: TopologyNodeTooltipRow[];
  className?: string;
  style?: React.CSSProperties;
}

/** Hover popup for canvas nodes — Figma `_node-tooltip` (`55439:46060`). */
export const TopologyNodeTooltip = forwardRef<HTMLElement, TopologyNodeTooltipProps>(
  function TopologyNodeTooltip({ title, statusIconSlug, rows, className, style }, ref) {
    return (
      <aside
        ref={ref}
        className={[styles.root, className].filter(Boolean).join(" ")}
        style={style}
        role="tooltip"
        aria-label={title}
      >
      <header className={styles.header}>
        {statusIconSlug ? (
          <Icon shapeName={statusIconSlug} variant="img" className={styles.statusIcon} aria-hidden />
        ) : null}
        <h4 className={styles.title}>{title}</h4>
      </header>
      {rows.length > 0 ? (
        <div className={styles.content}>
          <div className={styles.columns}>
            <div className={styles.labelColumn}>
              {rows.map((row, index) => (
                <div key={`${row.label}-${index}`} className={styles.labelCell}>
                  {row.label}
                </div>
              ))}
            </div>
            <div className={styles.valueColumn}>
              {rows.map((row, index) => (
                <div key={`${row.label}-${index}`} className={styles.valueCell}>
                  {row.value}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </aside>
  );
  },
);
