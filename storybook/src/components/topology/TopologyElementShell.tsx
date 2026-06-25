import { Icon } from "../Icon";
import type { TopologyElementType } from "../../spec-contracts/topology/synapse-topology.contract";
import {
  SYNAPSE_TOPOLOGY_ELEMENT_DEFAULT_ICONS,
  SYNAPSE_TOPOLOGY_ELEMENT_ICON_SIZE_PX,
  SYNAPSE_TOPOLOGY_ELEMENT_PENTAGON_HOVER_SIZE_PX,
  SYNAPSE_TOPOLOGY_ELEMENT_PENTAGON_SHELL_SIZE_PX,
  SYNAPSE_TOPOLOGY_ELEMENT_SHAPES,
  type TopologyElementShape,
} from "../../spec-contracts/topology/synapse-topology-element.contract";
import styles from "./TopologyElementShell.module.css";

/** Matches Figma hypervisor polygon (`52497:196951`) on a 48×48 grid. */
const PENTAGON_CENTER = SYNAPSE_TOPOLOGY_ELEMENT_PENTAGON_SHELL_SIZE_PX / 2;
const PENTAGON_HOVER_SCALE =
  SYNAPSE_TOPOLOGY_ELEMENT_PENTAGON_HOVER_SIZE_PX / SYNAPSE_TOPOLOGY_ELEMENT_PENTAGON_SHELL_SIZE_PX;

const PENTAGON_POINTS_RAW: ReadonlyArray<readonly [number, number]> = [
  [PENTAGON_CENTER, 0],
  [SYNAPSE_TOPOLOGY_ELEMENT_PENTAGON_SHELL_SIZE_PX, PENTAGON_CENTER * 0.76],
  [PENTAGON_CENTER * 1.64, SYNAPSE_TOPOLOGY_ELEMENT_PENTAGON_SHELL_SIZE_PX],
  [PENTAGON_CENTER * 0.36, SYNAPSE_TOPOLOGY_ELEMENT_PENTAGON_SHELL_SIZE_PX],
  [0, PENTAGON_CENTER * 0.76],
];

function pentagonPoints(scale = 1): string {
  return PENTAGON_POINTS_RAW.map(([x, y]) => {
    const sx = PENTAGON_CENTER + (x - PENTAGON_CENTER) * scale;
    const sy = PENTAGON_CENTER + (y - PENTAGON_CENTER) * scale;
    return `${sx},${sy}`;
  }).join(" ");
}

interface PentagonShellProps {
  iconSlug: string;
  hovered: boolean;
  selected: boolean;
  showHoverOutline: boolean;
}

function PentagonShell({ iconSlug, hovered, selected, showHoverOutline }: PentagonShellProps) {
  const shellStroke =
    hovered || selected ? "var(--color-border-brand-dark)" : "var(--color-icon-accessible)";
  const shellStrokeWidth = hovered || selected ? 2 : 1;
  const shellFill = selected
    ? "var(--color-background-controls-brand-light)"
    : "var(--color-background-surface-2)";

  return (
    <div
      className={styles.pentagonFrame}
      data-hovered={hovered ? "true" : "false"}
      data-selected={selected ? "true" : "false"}
    >
      <svg
        className={styles.pentagonSvg}
        viewBox={`0 0 ${SYNAPSE_TOPOLOGY_ELEMENT_PENTAGON_SHELL_SIZE_PX} ${SYNAPSE_TOPOLOGY_ELEMENT_PENTAGON_SHELL_SIZE_PX}`}
        width={SYNAPSE_TOPOLOGY_ELEMENT_PENTAGON_SHELL_SIZE_PX}
        height={SYNAPSE_TOPOLOGY_ELEMENT_PENTAGON_SHELL_SIZE_PX}
        aria-hidden
        overflow="visible"
      >
        {showHoverOutline ? (
          <polygon
            className={styles.pentagonHoverOutline}
            points={pentagonPoints(PENTAGON_HOVER_SCALE)}
            fill="none"
            stroke="var(--color-border-brand-dark)"
            strokeWidth={1}
          />
        ) : null}
        <polygon
          className={styles.pentagonShellShape}
          points={pentagonPoints(1)}
          fill={shellFill}
          stroke={shellStroke}
          strokeWidth={shellStrokeWidth}
          strokeLinejoin="round"
        />
      </svg>
      <span className={styles.pentagonIconSlot}>
        <Icon
          shapeName={iconSlug}
          style={{ width: SYNAPSE_TOPOLOGY_ELEMENT_ICON_SIZE_PX, height: SYNAPSE_TOPOLOGY_ELEMENT_ICON_SIZE_PX }}
        />
      </span>
    </div>
  );
}

export interface TopologyElementShellProps {
  elementType?: TopologyElementType;
  iconSlug?: string;
  selected?: boolean;
  hovered?: boolean;
  className?: string;
  "aria-hidden"?: boolean;
}

function resolveShape(elementType: TopologyElementType): TopologyElementShape {
  return SYNAPSE_TOPOLOGY_ELEMENT_SHAPES[elementType] ?? SYNAPSE_TOPOLOGY_ELEMENT_SHAPES.general;
}

function resolveIcon(elementType: TopologyElementType, iconSlug?: string): string {
  return iconSlug ?? SYNAPSE_TOPOLOGY_ELEMENT_DEFAULT_ICONS[elementType] ?? SYNAPSE_TOPOLOGY_ELEMENT_DEFAULT_ICONS.general;
}

/** Figma `.Topology Element` (`52497:196934`) — typed shape container with icon slot. */
export function TopologyElementShell({
  elementType = "general",
  iconSlug,
  selected = false,
  hovered = false,
  className,
  "aria-hidden": ariaHidden,
}: TopologyElementShellProps) {
  const shape = resolveShape(elementType);
  const resolvedIcon = resolveIcon(elementType, iconSlug);
  const showHoverOutline = hovered && !selected;
  const accent = elementType === "applicationService" ? "violet" : undefined;

  if (shape === "pentagon") {
    return (
      <div
        className={[styles.frame, className].filter(Boolean).join(" ")}
        data-shape="pentagon"
        data-hovered={hovered ? "true" : "false"}
        data-selected={selected ? "true" : "false"}
        aria-hidden={ariaHidden}
      >
        <PentagonShell
          iconSlug={resolvedIcon}
          hovered={hovered}
          selected={selected}
          showHoverOutline={showHoverOutline}
        />
      </div>
    );
  }

  return (
    <div
      className={[styles.frame, className].filter(Boolean).join(" ")}
      data-shape={shape}
      data-hovered={hovered ? "true" : "false"}
      data-selected={selected ? "true" : "false"}
      aria-hidden={ariaHidden}
    >
      {showHoverOutline ? <div className={styles.hoverOutline} aria-hidden /> : null}
      <div
        className={styles.shell}
        data-shape={shape}
        data-accent={accent}
        data-hovered={hovered ? "true" : "false"}
        data-selected={selected ? "true" : "false"}
      >
        <span className={styles.iconSlot}>
          <Icon
            shapeName={resolvedIcon}
            style={{ width: SYNAPSE_TOPOLOGY_ELEMENT_ICON_SIZE_PX, height: SYNAPSE_TOPOLOGY_ELEMENT_ICON_SIZE_PX }}
          />
        </span>
      </div>
    </div>
  );
}
