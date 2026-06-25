import type { ReactNode } from "react";

import { Icon } from "../Icon";
import { TopologyNode, type TopologyNodeProps } from "./TopologyNode";
import type { TopologyCanvasRect } from "./utils/topologyNodeTooltipPlacement";
import styles from "./TopologyGroup.module.css";

export interface TopologyGroupProps {
  id: string;
  typeLabel?: string;
  x: number;
  y: number;
  showCount?: boolean;
  childCount?: number;
  expanded?: boolean;
  showInfo?: boolean;
  showMinimize?: boolean;
  nodes?: Array<Omit<TopologyNodeProps, "onSelect" | "onExpandToggle" | "onPositionChange" | "onHoverChange">>;
  onNodeHoverChange?: (id: string, hovered: boolean, nodeRect?: TopologyCanvasRect) => void;
  onGroupInfo?: (id: string) => void;
  onGroupCollapse?: (id: string) => void;
  onGroupExpandToggle?: (id: string, expanded: boolean) => void;
  onNodeSelect?: (id: string) => void;
  onNodeExpandToggle?: (id: string, expanded: boolean) => void;
  selectedNodeId?: string;
}

export function TopologyGroup({
  id,
  typeLabel = "Type name",
  x,
  y,
  showCount = true,
  childCount,
  expanded = false,
  showInfo = true,
  showMinimize = true,
  nodes = [],
  onNodeHoverChange,
  onGroupInfo,
  onGroupCollapse,
  onGroupExpandToggle,
  onNodeSelect,
  onNodeExpandToggle,
  selectedNodeId,
}: TopologyGroupProps) {
  const ariaLabel = `Type: ${typeLabel}`;
  const showGroupCount = showCount && childCount != null && childCount > 0;

  let labelCluster: ReactNode;
  if (showCount) {
    labelCluster = (
      <>
        <div className={`${styles.labelChip} ${styles.labelChipWithCount}`}>
          <Icon shapeName="cluster-badge" className={styles.clusterBadge} />
          <span>
            <span className={styles.labelPrefix}>Type:</span> {typeLabel}
          </span>
        </div>
        {showGroupCount ? (
          <div className={styles.groupCountBadgeWrap}>
            <button
              type="button"
              className={styles.groupCountBadge}
              aria-expanded={expanded}
              aria-label={expanded ? "Collapse group" : `Expand ${childCount} group members`}
              onClick={() => onGroupExpandToggle?.(id, !expanded)}
            >
              {expanded ? <Icon shapeName="ctrl-minimize-16" style={{ width: 8, height: 12 }} /> : childCount}
            </button>
          </div>
        ) : null}
      </>
    );
  } else {
    labelCluster = (
      <div className={styles.labelClusterNoCount}>
        <Icon shapeName="cluster-badge" className={styles.clusterBadge} />
        <span>
          <span className={styles.labelPrefix}>Type:</span> {typeLabel}
        </span>
      </div>
    );
  }

  return (
    <div
      className={styles.root}
      style={{ left: x, top: y }}
      role="group"
      aria-label={ariaLabel}
      data-topology-group-id={id}
    >
      {showInfo || showMinimize ? (
        <div className={styles.chrome}>
          {showInfo ? (
            <button
              type="button"
              className={styles.chromeButton}
              aria-label="Group information"
              onClick={() => onGroupInfo?.(id)}
            >
              <Icon shapeName="info-circ" className={styles.infoIcon} />
            </button>
          ) : null}
          {showMinimize ? (
            <button
              type="button"
              className={styles.chromeButton}
              aria-label="Collapse group"
              onClick={() => onGroupCollapse?.(id)}
            >
              <Icon shapeName="minimize" className={styles.minimizeIcon} />
            </button>
          ) : null}
        </div>
      ) : null}

      <div className={styles.body}>
        <div className={styles.labelCluster}>{labelCluster}</div>
        <div className={styles.border}>
          <div className={styles.content}>
            <div className={styles.contentInner}>
              {nodes.map((node) => (
                <div key={node.id} className={styles.nodeWrap}>
                  <TopologyNode
                    {...node}
                    embedded
                    x={0}
                    y={0}
                    selected={selectedNodeId === node.id}
                    onHoverChange={onNodeHoverChange}
                    onSelect={onNodeSelect}
                    onExpandToggle={onNodeExpandToggle}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
