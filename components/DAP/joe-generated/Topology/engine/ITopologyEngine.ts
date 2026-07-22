import { TopologyNodeData, TopologyLinkData, TopologyEngineOptions, TopologyEngineHandlers } from "../types";

/**
 * Adapter interface that decouples the <Topology /> React component from any
 * particular diagramming library. Today `GoJSTopologyEngine` implements this
 * with GoJS; a different engine (e.g. react-flow, cytoscape.js) can implement
 * the same contract and be swapped in via the `engine` prop on <Topology />.
 */
export interface ITopologyEngine {
  /** Create and mount the diagram inside `container`. Called once. */
  init(
    container: HTMLDivElement,
    options: TopologyEngineOptions,
    handlers: TopologyEngineHandlers
  ): void;

  /** Replace the full node/link data set. */
  setData(nodes: TopologyNodeData[], links: TopologyLinkData[]): void;

  /** Notify the engine that its container size may have changed. */
  resize(): void;

  /** Increase zoom by one fixed step. */
  zoomIn(): void;

  /** Decrease zoom by one fixed step. */
  zoomOut(): void;

  /** Scale/pan so all content is fully visible within the viewport. */
  zoomToFit(): void;

  /** Tear down the diagram and release all resources. */
  destroy(): void;
}
