import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";

import { Button } from "../Button";
import { Search } from "../Search";
import { SynapseDetailPanel } from "../SynapseDetailPanel";
import { TopologyAddFilterButton } from "./TopologyAddFilterButton";
import { TopologyGroup } from "./TopologyGroup";
import { TopologyLegend } from "./TopologyLegend";
import { TopologyNode } from "./TopologyNode";
import { TopologyNodeTooltip } from "./TopologyNodeTooltip";
import { TopologyStatusFilter } from "./TopologyStatusFilter";
import { TopologyZoomSlider } from "./TopologyZoomSlider";
import type { TopologyGroupData } from "../../spec-contracts/topology/synapse-topology-group.contract";
import type {
  TopologyEdgeData,
  TopologyLoadChildrenContext,
  TopologyLoadChildrenResult,
  TopologyNodeData,
  TopologyNodeTooltipRow,
  TopologyStatusFilterValue,
} from "../../spec-contracts/topology/synapse-topology.contract";
import {
  SYNAPSE_TOPOLOGY_DEFAULT_ZOOM_PERCENT,
  SYNAPSE_TOPOLOGY_ELEMENT_ICONS,
  SYNAPSE_TOPOLOGY_ELEMENT_TYPE_LABELS,
  SYNAPSE_TOPOLOGY_NODE_TOOLTIP_HOVER_DELAY_MS,
  SYNAPSE_TOPOLOGY_NODE_TOOLTIP_WIDTH,
  SYNAPSE_TOPOLOGY_STATUS_ICONS,
  SYNAPSE_TOPOLOGY_STATUS_LABELS,
} from "../../spec-contracts/topology/synapse-topology.contract";
import type { SynapseDetailPanelKeyValueRow } from "../../spec-contracts/synapse-detail-panel.contract";
import styles from "./Topology.module.css";
import { buildTopologyEdgeGeometry } from "./utils/topologyEdgePath";
import { topologyNodeEdgeAnchors } from "./utils/topologyNodeAnchor";
import { collectTopologyDescendantIds } from "./utils/topologyExpandGraph";
import {
  estimateTopologyTooltipHeight,
  getCanvasViewportBounds,
  resolveTopologyTooltipPlacement,
  type TopologyCanvasRect,
  type TopologyTooltipPosition,
} from "./utils/topologyNodeTooltipPlacement";

function nodeAnchorPair(
  source: TopologyNodeData,
  target: TopologyNodeData,
): { from: { x: number; y: number }; to: { x: number; y: number } } {
  return topologyNodeEdgeAnchors(source, target);
}

function defaultNodeDetailRows(node: TopologyNodeData): SynapseDetailPanelKeyValueRow[] {
  const rows: SynapseDetailPanelKeyValueRow[] = [];
  const status = node.status ?? "none";
  if (status !== "none") {
    rows.push({
      label: "Status:",
      value: SYNAPSE_TOPOLOGY_STATUS_LABELS[status],
      variant: "status",
      statusIconSlug: SYNAPSE_TOPOLOGY_STATUS_ICONS[status],
    });
  }
  rows.push({ label: "Node ID:", value: node.id });
  rows.push({ label: "Label:", value: node.label });
  if (node.elementType) {
    rows.push({ label: "Type:", value: SYNAPSE_TOPOLOGY_ELEMENT_TYPE_LABELS[node.elementType] });
  }
  if (node.childCount != null) {
    rows.push({ label: "Children:", value: String(node.childCount) });
  }
  return rows;
}

function defaultNodeTooltipRows(node: TopologyNodeData): TopologyNodeTooltipRow[] {
  if (node.tooltipRows?.length) {
    return node.tooltipRows;
  }

  const rows: TopologyNodeTooltipRow[] = [];
  if (node.elementType) {
    rows.push({ label: "Type:", value: SYNAPSE_TOPOLOGY_ELEMENT_TYPE_LABELS[node.elementType] });
  }
  rows.push({ label: "Placeholder:", value: "Description" });
  rows.push({ label: "Placeholder:", value: "Description" });
  return rows;
}

function buildNodeTooltip(node: TopologyNodeData, title?: string, rows?: TopologyNodeTooltipRow[]) {
  const status = node.status ?? "none";
  return {
    title: title ?? node.label,
    statusIconSlug:
      status !== "none" && status !== "notDeployed" ? SYNAPSE_TOPOLOGY_STATUS_ICONS[status] : undefined,
    rows: rows ?? defaultNodeTooltipRows(node),
  };
}

export interface TopologyNodeDetailContext {
  node: TopologyNodeData;
}

export interface TopologyProps {
  nodes?: TopologyNodeData[];
  edges?: TopologyEdgeData[];
  groups?: TopologyGroupData[];
  showFilter?: boolean;
  showLegend?: boolean;
  showMinimap?: boolean;
  showDetailPanel?: boolean;
  detailPanelOpen?: boolean;
  showNodeTooltip?: boolean;
  /** Ms to wait after pointer enter before showing node tooltip (default 500). */
  nodeTooltipHoverDelayMs?: number;
  searchQuery?: string;
  statusFilter?: TopologyStatusFilterValue;
  filterDropdownOpen?: boolean;
  selectedNodeId?: string;
  onSearchChange?: (query: string) => void;
  onStatusFilterChange?: (value: TopologyStatusFilterValue) => void;
  onAddFilter?: () => void;
  onNodeSelect?: (id: string) => void;
  onDetailPanelOpenChange?: (open: boolean) => void;
  getNodeDetailTitle?: (node: TopologyNodeData) => string;
  getNodeDetailSubtitle?: (node: TopologyNodeData) => string;
  getNodeDetailIconSlug?: (node: TopologyNodeData) => string;
  getNodeDetailRows?: (node: TopologyNodeData) => SynapseDetailPanelKeyValueRow[];
  renderNodeDetail?: (context: TopologyNodeDetailContext) => ReactNode;
  getNodeTooltipTitle?: (node: TopologyNodeData) => string;
  getNodeTooltipRows?: (node: TopologyNodeData) => TopologyNodeTooltipRow[];
  detailPanelPrimaryAction?: { label: string; onClick?: () => void };
  detailPanelSecondaryAction?: { label: string; onClick?: () => void };
  onNodeExpandToggle?: (id: string, expanded: boolean) => void;
  onViewReset?: () => void;
  onSave?: () => void;
  loadChildren?: (
    nodeId: string,
    context: TopologyLoadChildrenContext,
  ) => Promise<TopologyLoadChildrenResult | TopologyNodeData[]>;
}

export function Topology({
  nodes: nodesProp = [],
  edges: edgesProp = [],
  groups: groupsProp = [],
  showFilter = false,
  showLegend = true,
  showMinimap = false,
  showDetailPanel = false,
  detailPanelOpen: detailPanelOpenProp,
  showNodeTooltip = true,
  nodeTooltipHoverDelayMs = SYNAPSE_TOPOLOGY_NODE_TOOLTIP_HOVER_DELAY_MS,
  searchQuery: searchQueryProp,
  statusFilter: statusFilterProp,
  filterDropdownOpen = false,
  selectedNodeId: selectedNodeIdProp,
  onSearchChange,
  onStatusFilterChange,
  onAddFilter,
  onNodeSelect,
  onDetailPanelOpenChange,
  getNodeDetailTitle,
  getNodeDetailSubtitle,
  getNodeDetailIconSlug,
  getNodeDetailRows,
  renderNodeDetail,
  getNodeTooltipTitle,
  getNodeTooltipRows,
  detailPanelPrimaryAction,
  detailPanelSecondaryAction,
  onNodeExpandToggle,
  onViewReset,
  onSave,
  loadChildren,
}: TopologyProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [internalSearch, setInternalSearch] = useState("");
  const [internalStatusFilter, setInternalStatusFilter] = useState<TopologyStatusFilterValue>("all");
  const [nodes, setNodes] = useState<TopologyNodeData[]>(nodesProp);
  const [edges, setEdges] = useState<TopologyEdgeData[]>(edgesProp);
  const nodesRef = useRef(nodes);

  useEffect(() => {
    setNodes(nodesProp);
    setEdges(edgesProp);
  }, [nodesProp, edgesProp]);

  useEffect(() => {
    nodesRef.current = nodes;
  }, [nodes]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | undefined>(selectedNodeIdProp);
  const [internalDetailPanelOpen, setInternalDetailPanelOpen] = useState(false);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [zoomPercent, setZoomPercent] = useState(SYNAPSE_TOPOLOGY_DEFAULT_ZOOM_PERCENT);
  const [panning, setPanning] = useState(false);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [hoveredNodeRect, setHoveredNodeRect] = useState<TopologyCanvasRect | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<TopologyTooltipPosition | null>(null);
  const tooltipRef = useRef<HTMLElement>(null);
  const tooltipHoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismissNodeTooltip = useCallback(() => {
    if (tooltipHoverTimerRef.current) {
      clearTimeout(tooltipHoverTimerRef.current);
      tooltipHoverTimerRef.current = null;
    }
    setHoveredNodeId(null);
    setHoveredNodeRect(null);
    setTooltipPosition(null);
  }, []);

  useEffect(() => {
    return () => {
      if (tooltipHoverTimerRef.current) {
        clearTimeout(tooltipHoverTimerRef.current);
      }
    };
  }, []);

  const searchQuery = searchQueryProp ?? internalSearch;
  const statusFilter = statusFilterProp ?? internalStatusFilter;
  const scale = zoomPercent / 100;

  const visibleNodes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return nodes.filter((node) => {
      const matchesSearch = !q || node.label.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "all" || (node.status ?? "none") === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [nodes, searchQuery, statusFilter]);

  const handleSearchChange = useCallback(
    (value: string) => {
      if (searchQueryProp === undefined) setInternalSearch(value);
      onSearchChange?.(value);
    },
    [onSearchChange, searchQueryProp],
  );

  const handleStatusFilterChange = useCallback(
    (value: TopologyStatusFilterValue) => {
      if (statusFilterProp === undefined) setInternalStatusFilter(value);
      onStatusFilterChange?.(value);
    },
    [onStatusFilterChange, statusFilterProp],
  );

  const handleNodeSelect = useCallback(
    (id: string) => {
      dismissNodeTooltip();

      const currentSelected = selectedNodeIdProp ?? selectedNodeId;
      const isSameNode = currentSelected === id;

      if (selectedNodeIdProp === undefined) {
        setSelectedNodeId(id);
      }

      if (showDetailPanel) {
        const currentlyOpen = detailPanelOpenProp ?? internalDetailPanelOpen;
        const nextOpen = isSameNode ? !currentlyOpen : true;
        if (detailPanelOpenProp === undefined) {
          setInternalDetailPanelOpen(nextOpen);
        }
        onDetailPanelOpenChange?.(nextOpen);
      }

      onNodeSelect?.(id);
    },
    [
      detailPanelOpenProp,
      internalDetailPanelOpen,
      onDetailPanelOpenChange,
      onNodeSelect,
      selectedNodeId,
      selectedNodeIdProp,
      showDetailPanel,
      dismissNodeTooltip,
    ],
  );

  const handleDetailPanelOpenChange = useCallback(
    (open: boolean) => {
      if (detailPanelOpenProp === undefined) {
        setInternalDetailPanelOpen(open);
      }
      onDetailPanelOpenChange?.(open);
    },
    [detailPanelOpenProp, onDetailPanelOpenChange],
  );

  const handlePositionChange = useCallback((id: string, x: number, y: number) => {
    setNodes((prev) => prev.map((node) => (node.id === id ? { ...node, x, y } : node)));
  }, []);

  const handleExpandToggle = useCallback(
    async (id: string, expanded: boolean) => {
      dismissNodeTooltip();

      setNodes((prev) => prev.map((node) => (node.id === id ? { ...node, expanded } : node)));
      onNodeExpandToggle?.(id, expanded);

      if (!expanded) {
        setNodes((prev) => {
          const removeIds = new Set(collectTopologyDescendantIds(id, prev));
          setEdges((edgePrev) =>
            edgePrev.filter((edge) => !removeIds.has(edge.sourceId) && !removeIds.has(edge.targetId)),
          );
          return prev
            .filter((node) => !removeIds.has(node.id))
            .map((node) => (node.id === id ? { ...node, expanded: false } : node));
        });
        return;
      }

      if (!loadChildren) return;

      try {
        const result = await loadChildren(id, { nodes: nodesRef.current });
        const payload: TopologyLoadChildrenResult = Array.isArray(result) ? { nodes: result } : result;
        const childNodes = payload.nodes;
        const childIds = new Set(childNodes.map((node) => node.id));
        const childEdges =
          payload.edges ??
          childNodes.map((child) => ({
            id: `edge-${id}-${child.id}`,
            sourceId: id,
            targetId: child.id,
            edgeType: "connectedTo" as const,
          }));
        const childEdgeIds = new Set(childEdges.map((edge) => edge.id));

        setNodes((prev) => {
          const withoutDup = prev.filter((node) => !childIds.has(node.id));
          return [...withoutDup, ...childNodes];
        });
        setEdges((prev) => {
          const withoutDup = prev.filter((edge) => !childEdgeIds.has(edge.id));
          return [...withoutDup, ...childEdges];
        });
      } catch {
        setNodes((prev) => prev.map((node) => (node.id === id ? { ...node, expanded: false } : node)));
      }
    },
    [dismissNodeTooltip, loadChildren, onNodeExpandToggle],
  );

  const handlePanStart = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (event.button !== 0) return;
      if ((event.target as HTMLElement).closest("button, input, [role='group']")) return;
      event.currentTarget.setPointerCapture(event.pointerId);
      setPanning(true);
      const startX = event.clientX;
      const startY = event.clientY;
      const origin = { ...translate };

      const onMove = (moveEvent: PointerEvent) => {
        setTranslate({
          x: origin.x + (moveEvent.clientX - startX),
          y: origin.y + (moveEvent.clientY - startY),
        });
      };
      const onUp = () => {
        setPanning(false);
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
      };
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    },
    [translate],
  );

  const resetView = useCallback(() => {
    setTranslate({ x: 0, y: 0 });
    setZoomPercent(SYNAPSE_TOPOLOGY_DEFAULT_ZOOM_PERCENT);
    onViewReset?.();
  }, [onViewReset]);

  const edgePaths = useMemo(() => {
    const byId = new Map(nodes.map((node) => [node.id, node]));
    return edges
      .map((edge) => {
        const source = byId.get(edge.sourceId);
        const target = byId.get(edge.targetId);
        if (!source || !target) return null;
        const anchors = nodeAnchorPair(source, target);
        return { ...edge, from: anchors.from, to: anchors.to };
      })
      .filter(Boolean) as Array<
      TopologyEdgeData & { from: { x: number; y: number }; to: { x: number; y: number } }
    >;
  }, [edges, nodes]);

  const resolvedSelected = selectedNodeIdProp ?? selectedNodeId;
  const detailPanelOpen = detailPanelOpenProp ?? internalDetailPanelOpen;

  const selectedNode = useMemo(
    () => nodes.find((node) => node.id === resolvedSelected),
    [nodes, resolvedSelected],
  );

  const detailTitle = selectedNode
    ? (getNodeDetailTitle?.(selectedNode) ?? selectedNode.label)
    : "Details";
  const detailSubtitle = selectedNode
    ? (getNodeDetailSubtitle?.(selectedNode) ??
      (selectedNode.elementType
        ? SYNAPSE_TOPOLOGY_ELEMENT_TYPE_LABELS[selectedNode.elementType]
        : undefined))
    : undefined;
  const detailIconSlug = selectedNode
    ? (getNodeDetailIconSlug?.(selectedNode) ??
      (selectedNode.iconSlug ??
        (selectedNode.elementType
          ? SYNAPSE_TOPOLOGY_ELEMENT_ICONS[selectedNode.elementType]
          : "objects-square")))
    : "objects-square";
  const detailBody = selectedNode
    ? (renderNodeDetail?.({ node: selectedNode }) ??
      undefined)
    : undefined;
  const detailRows = selectedNode
    ? (getNodeDetailRows?.(selectedNode) ?? defaultNodeDetailRows(selectedNode))
    : undefined;

  const resolveNodeTooltip = useCallback(
    (node: TopologyNodeData) =>
      buildNodeTooltip(
        node,
        getNodeTooltipTitle?.(node),
        getNodeTooltipRows?.(node),
      ),
    [getNodeTooltipRows, getNodeTooltipTitle],
  );

  const handleNodeHoverChange = useCallback(
    (id: string, hovered: boolean, nodeRect?: TopologyCanvasRect) => {
      if (!showNodeTooltip) return;

      if (hovered) {
        if (tooltipHoverTimerRef.current) {
          clearTimeout(tooltipHoverTimerRef.current);
        }

        tooltipHoverTimerRef.current = setTimeout(() => {
          tooltipHoverTimerRef.current = null;
          setHoveredNodeId(id);
          if (nodeRect) {
            setHoveredNodeRect(nodeRect);
          } else {
            const node = nodes.find((item) => item.id === id);
            if (node) {
              setHoveredNodeRect({ x: node.x, y: node.y, width: 44, height: 70 });
            }
          }
        }, nodeTooltipHoverDelayMs);
        return;
      }

      if (tooltipHoverTimerRef.current) {
        clearTimeout(tooltipHoverTimerRef.current);
        tooltipHoverTimerRef.current = null;
      }

      setHoveredNodeId((current) => {
        if (current === id) {
          setHoveredNodeRect(null);
          setTooltipPosition(null);
          return null;
        }
        return current;
      });
    },
    [nodeTooltipHoverDelayMs, nodes, showNodeTooltip],
  );

  const hoveredNode = useMemo(() => {
    if (!hoveredNodeId) return null;
    const direct = visibleNodes.find((node) => node.id === hoveredNodeId);
    if (direct) return direct;
    for (const group of groupsProp) {
      const inGroup = group.nodes.find((node) => node.id === hoveredNodeId);
      if (inGroup) return inGroup as TopologyNodeData;
    }
    return null;
  }, [groupsProp, hoveredNodeId, visibleNodes]);

  const hoveredTooltip = useMemo(() => {
    if (!hoveredNode) return null;
    return resolveNodeTooltip(hoveredNode);
  }, [hoveredNode, resolveNodeTooltip]);

  const tooltipRowCount = hoveredTooltip?.rows.length ?? 0;

  useLayoutEffect(() => {
    if (!showNodeTooltip || !hoveredNodeRect || !hoveredNodeId || !viewportRef.current) {
      setTooltipPosition((prev) => (prev === null ? prev : null));
      return;
    }

    const viewport = getCanvasViewportBounds(viewportRef.current, scale, translate);
    const width = tooltipRef.current?.offsetWidth || SYNAPSE_TOPOLOGY_NODE_TOOLTIP_WIDTH;
    const height =
      tooltipRef.current?.offsetHeight || estimateTopologyTooltipHeight(tooltipRowCount);

    const next = resolveTopologyTooltipPlacement(hoveredNodeRect, width, height, viewport);
    setTooltipPosition((prev) => {
      if (
        prev &&
        prev.left === next.left &&
        prev.top === next.top &&
        prev.placement === next.placement
      ) {
        return prev;
      }
      return next;
    });
  }, [hoveredNodeId, hoveredNodeRect, scale, showNodeTooltip, tooltipRowCount, translate.x, translate.y]);

  const preliminaryTooltipPosition =
    hoveredNodeRect && viewportRef.current
      ? resolveTopologyTooltipPlacement(
          hoveredNodeRect,
          SYNAPSE_TOPOLOGY_NODE_TOOLTIP_WIDTH,
          estimateTopologyTooltipHeight(tooltipRowCount),
          getCanvasViewportBounds(viewportRef.current, scale, translate),
        )
      : null;

  return (
    <section className={styles.root} role="region" aria-label="Topology">
      <div className={styles.contentRow}>
      <div className={styles.layout}>
      <div className={styles.toolbar}>
        <div className={[styles.toolbarLeft, showFilter ? styles.toolbarLeftWithFilter : ""].filter(Boolean).join(" ")}>
          <div className={styles.searchSlot}>
            <Search
              variant="main"
              placeholder="Search node name"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          {showFilter ? (
            <div className={styles.filterSlot}>
              <TopologyStatusFilter
                value={statusFilter}
                onValueChange={handleStatusFilterChange}
                defaultOpen={filterDropdownOpen}
              />
              <TopologyAddFilterButton type="button" onClick={() => onAddFilter?.()} />
            </div>
          ) : null}
        </div>
        <div className={styles.viewportControls}>
          <TopologyZoomSlider value={zoomPercent} onChange={setZoomPercent} />
          <Button
            className={styles.viewportIconButton}
            programme="synapse"
            variant="tertiary"
            size="sm"
            iconOnly
            iconSlug="arrow-reset"
            aria-label="Reset view"
            onClick={resetView}
          />
          <Button
            className={styles.viewportIconButton}
            programme="synapse"
            variant="tertiary"
            size="sm"
            iconOnly
            iconSlug="full-screen"
            aria-label="Full screen"
            onClick={() => viewportRef.current?.requestFullscreen?.()}
          />
          <Button
            className={styles.viewportIconButton}
            programme="synapse"
            variant="tertiary"
            size="sm"
            iconOnly
            iconSlug="save-disk"
            iconVariant="img"
            aria-label="Save layout"
            onClick={() => onSave?.()}
          />
        </div>
      </div>

      <div
        ref={viewportRef}
        className={styles.canvasViewport}
        data-panning={panning ? "true" : "false"}
        onPointerDown={handlePanStart}
      >
        <div
          className={styles.canvasLayer}
          data-topology-canvas-layer
          style={{ transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})` }}
        >
          <svg className={styles.edgeLayer} aria-hidden="true">
            {edgePaths.map((edge) => {
              const geometry = buildTopologyEdgeGeometry(edge.from, edge.to);
              return (
                <g key={edge.id}>
                  <path
                    className={styles.edgePath}
                    data-edge-type={edge.edgeType}
                    d={geometry.path}
                  />
                  <path className={styles.edgeArrow} d={geometry.arrowPath} />
                </g>
              );
            })}
          </svg>
          <div className={styles.nodeLayer}>
            {groupsProp.map((group) => (
              <TopologyGroup
                key={group.id}
                id={group.id}
                typeLabel={group.typeLabel}
                x={group.x}
                y={group.y}
                showCount={group.showCount}
                childCount={group.childCount}
                expanded={group.expanded}
                showInfo={group.showInfo}
                showMinimize={group.showMinimize}
                nodes={group.nodes}
                selectedNodeId={resolvedSelected}
                onNodeSelect={handleNodeSelect}
                onNodeExpandToggle={handleExpandToggle}
                onNodeHoverChange={handleNodeHoverChange}
              />
            ))}
            {visibleNodes.map((node) => (
              <TopologyNode
                key={node.id}
                {...node}
                selected={resolvedSelected === node.id}
                onHoverChange={handleNodeHoverChange}
                onSelect={handleNodeSelect}
                onExpandToggle={handleExpandToggle}
                onPositionChange={handlePositionChange}
              />
            ))}
          </div>
          {showNodeTooltip && hoveredNode && hoveredTooltip && hoveredNodeRect ? (
            <div className={styles.tooltipLayer}>
              <TopologyNodeTooltip
                ref={tooltipRef}
                title={hoveredTooltip.title}
                statusIconSlug={hoveredTooltip.statusIconSlug}
                rows={hoveredTooltip.rows}
                className={styles.canvasTooltip}
                style={{
                  left: tooltipPosition?.left ?? preliminaryTooltipPosition?.left ?? 0,
                  top: tooltipPosition?.top ?? preliminaryTooltipPosition?.top ?? 0,
                  visibility: tooltipPosition ? "visible" : "hidden",
                }}
              />
            </div>
          ) : null}
        </div>
        {visibleNodes.length === 0 ? (
          <div className={styles.emptyState}>No nodes match the current search.</div>
        ) : null}
      </div>

      {showLegend || showMinimap ? (
        <div className={styles.footer}>
          {showLegend ? <TopologyLegend /> : <span />}
          {showMinimap ? (
            <div className={styles.minimap} aria-label="Minimap">
              <Button
                programme="synapse"
                variant="tertiary"
                size="sm"
                iconOnly
                iconSlug="grid-square-9-16"
                aria-label="Open minimap"
              />
            </div>
          ) : null}
        </div>
      ) : null}
      </div>

      {showDetailPanel && detailPanelOpen && selectedNode ? (
        <div className={styles.detailPanelSlot}>
          <SynapseDetailPanel
            attachMode="topology"
            isExpanded
            onExpandedChange={handleDetailPanelOpenChange}
            title={detailTitle}
            subtitle={detailSubtitle}
            iconSlug={detailIconSlug}
            body={detailBody}
            rows={detailBody ? undefined : detailRows}
            primaryAction={detailPanelPrimaryAction}
            secondaryAction={detailPanelSecondaryAction}
          />
        </div>
      ) : null}
      </div>
    </section>
  );
}
