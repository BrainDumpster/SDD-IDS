import { useCallback, useRef, useState } from "react";

import { Icon } from "../Icon";
import { TopologyElementShell } from "./TopologyElementShell";
import type { TopologyElementType, TopologyNodeStatus } from "../../spec-contracts/topology/synapse-topology.contract";
import { topologyNodeCanvasRect, type TopologyCanvasRect } from "./utils/topologyNodeTooltipPlacement";
import styles from "./TopologyNode.module.css";

const STATUS_ICON: Partial<Record<TopologyNodeStatus, string>> = {
  success: "status-ok-circ-solid",
  warning: "status-warn-tri-solid-16",
  major: "status-error-diamond-solid",
  critical: "status-critical-square-solid",
  syncing: "arrows-circ",
};

export interface TopologyNodeProps {
  id: string;
  label: string;
  elementType?: TopologyElementType;
  iconSlug?: string;
  status?: TopologyNodeStatus;
  childCount?: number;
  expanded?: boolean;
  selected?: boolean;
  x: number;
  y: number;
  /** When true, node flows in a group/content row (no absolute canvas positioning). */
  embedded?: boolean;
  onHoverChange?: (id: string, hovered: boolean, nodeRect?: TopologyCanvasRect) => void;
  onSelect?: (id: string) => void;
  onExpandToggle?: (id: string, expanded: boolean) => void;
  onPositionChange?: (id: string, x: number, y: number) => void;
}

export function TopologyNode({
  id,
  label,
  elementType = "general",
  iconSlug,
  status = "none",
  childCount,
  expanded = false,
  selected = false,
  x,
  y,
  embedded = false,
  onHoverChange,
  onSelect,
  onExpandToggle,
  onPositionChange,
}: TopologyNodeProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const statusSlug = status !== "none" && status !== "notDeployed" ? STATUS_ICON[status] : undefined;
  const showBadge = childCount != null && childCount > 0;

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if ((event.target as HTMLElement).closest("button")) return;
      event.stopPropagation();
      onSelect?.(id);
      if (embedded || !onPositionChange) return;
      const startX = event.clientX;
      const startY = event.clientY;
      const originX = x;
      const originY = y;

      const onMove = (moveEvent: PointerEvent) => {
        onPositionChange?.(id, originX + (moveEvent.clientX - startX), originY + (moveEvent.clientY - startY));
      };
      const onUp = () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
      };
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    },
    [embedded, id, onPositionChange, onSelect, x, y],
  );

  const handleMouseEnter = useCallback(() => {
    setHovered(true);
    const nodeRect = rootRef.current ? topologyNodeCanvasRect(rootRef.current) : undefined;
    onHoverChange?.(id, true, nodeRect);
  }, [id, onHoverChange]);

  const handleMouseLeave = useCallback(() => {
    setHovered(false);
    onHoverChange?.(id, false);
  }, [id, onHoverChange]);

  return (
    <div
      ref={rootRef}
      className={styles.root}
      style={
        embedded
          ? hovered
            ? { zIndex: 10 }
            : undefined
          : { left: x, top: y, zIndex: hovered ? 10 : undefined }
      }
      data-embedded={embedded ? "true" : undefined}
      data-selected={selected ? "true" : "false"}
      data-hovered={hovered ? "true" : "false"}
      onPointerDown={handlePointerDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="group"
      aria-label={label}
    >
      <div className={styles.container}>
        <div className={styles.main}>
          {statusSlug ? (
            <div className={styles.statusSlot} aria-hidden="true">
              <Icon shapeName={statusSlug} variant="img" style={{ width: 16, height: 16 }} aria-hidden />
            </div>
          ) : null}
          <div className={styles.shapeRow}>
            <TopologyElementShell
              elementType={elementType}
              iconSlug={iconSlug}
              selected={selected}
              hovered={hovered}
            />
            {showBadge ? (
              <div className={styles.countBadgeWrap}>
                <button
                  type="button"
                  className={styles.countBadge}
                  aria-expanded={expanded}
                  aria-label={expanded ? "Collapse children" : `Expand ${childCount} children`}
                  onClick={(event) => {
                    event.stopPropagation();
                    onExpandToggle?.(id, !expanded);
                  }}
                >
                  {expanded ? (
                    <Icon shapeName="ctrl-minimize-16" style={{ width: 8, height: 12 }} />
                  ) : (
                    childCount
                  )}
                </button>
              </div>
            ) : null}
          </div>
        </div>
        <div className={styles.label}>{label}</div>
      </div>
    </div>
  );
}
