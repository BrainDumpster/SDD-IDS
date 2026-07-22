import React, { useEffect, useRef } from "react";
import "./Topology.css";
import { TopologyNodeData, TopologyLinkData } from "./types";
import { ITopologyEngine } from "./engine/ITopologyEngine";
import { GoJSTopologyEngine } from "./engine/gojs/GoJSTopologyEngine";

export interface TopologyProps {
  /** 0 or more Nodes to render. */
  nodes: TopologyNodeData[];
  /** Links connecting exactly two Nodes each. Requires at least 2 Nodes to have any effect. */
  links: TopologyLinkData[];
  /** Diameter/side length of a node's shape, in pixels. Defaults to 48. */
  nodeSize?: number;
  /** Base path used to resolve icon/status slugs. Defaults to "assets/icons". */
  iconsBasePath?: string;
  /**
   * Smallest a Node (shape(s) + icon + status + badge, not the
   * Name/Type-Name labels) is ever allowed to render on screen, in
   * viewport pixels, regardless of zoom-out level. Defaults to 16.
   */
  minNodeSize?: number;
  /**
   * Largest a Node (shape(s) + icon + status + badge, not the
   * Name/Type-Name labels) is ever allowed to render on screen, in
   * viewport pixels, regardless of zoom-in level. Defaults to 64.
   */
  maxNodeSize?: number;
  /** Fired after a drag completes and a Node settles at a new position. */
  onNodeMove?: (key: string, x: number, y: number) => void;
  /** Fired whenever the set of selected Node keys changes. */
  onSelectionChange?: (selectedKeys: string[]) => void;
  /** Fired specifically when a Node is clicked and becomes the selected Node. */
  onNodeSelect?: (key: string) => void;
  /**
   * Optional factory for swapping the rendering engine (defaults to GoJS).
   * Supply a factory that returns any object implementing `ITopologyEngine`.
   */
  engine?: () => ITopologyEngine;
}

const Topology: React.FC<TopologyProps> = ({
  nodes,
  links,
  nodeSize = 48,
  iconsBasePath = "assets/icons",
  minNodeSize = 16,
  maxNodeSize = 64,
  onNodeMove,
  onSelectionChange,
  onNodeSelect,
  engine,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<ITopologyEngine | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const instance = engine ? engine() : new GoJSTopologyEngine();
    engineRef.current = instance;

    instance.init(
      containerRef.current,
      { nodeSize, iconsBasePath, minNodeSize, maxNodeSize },
      { onNodeMove, onSelectionChange, onNodeSelect }
    );

    const resizeObserver = new ResizeObserver(() => {
      instance.resize();
    });
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      instance.destroy();
      engineRef.current = null;
    };
    // Engine is only (re)created once on mount; data/handlers flow through
    // the effect below and the live `handlers` object passed at init time.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    engineRef.current?.setData(nodes, links);
  }, [nodes, links]);

  return (
    <div className="topology__wrapper">
      <div ref={containerRef} className="topology" />
      <div className="topology__controls" role="group" aria-label="Zoom controls">
        <button
          type="button"
          className="topology__control-button"
          aria-label="Zoom in"
          title="Zoom in"
          onClick={() => engineRef.current?.zoomIn()}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
        <button
          type="button"
          className="topology__control-button"
          aria-label="Zoom out"
          title="Zoom out"
          onClick={() => engineRef.current?.zoomOut()}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M2 8h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
        <button
          type="button"
          className="topology__control-button"
          aria-label="Fit to screen"
          title="Fit to screen"
          onClick={() => engineRef.current?.zoomToFit()}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M2 6V3a1 1 0 0 1 1-1h3M10 2h3a1 1 0 0 1 1 1v3M14 10v3a1 1 0 0 1-1 1h-3M6 14H3a1 1 0 0 1-1-1v-3"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Topology;
