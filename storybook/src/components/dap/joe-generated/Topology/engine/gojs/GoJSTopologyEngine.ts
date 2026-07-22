import * as go from "gojs";
import {
  TopologyNodeData,
  TopologyLinkData,
  TopologyEngineOptions,
  TopologyEngineHandlers,
} from "../../types";
import { ITopologyEngine } from "../ITopologyEngine";
import { makeNodeTemplate } from "./nodeTemplate";
import { makeLinkTemplate } from "./linkTemplate";
import { registerFigures } from "./registerFigures";
import { cssVar, refreshTopologyTheme } from "./theme";

export class GoJSTopologyEngine implements ITopologyEngine {
  private diagram: go.Diagram | null = null;
  private handlers: TopologyEngineHandlers = {};
  /** Smallest allowed on-screen (viewport-pixel) Node size, regardless of zoom-out level. */
  private minNodeSize = 16;
  /** Largest allowed on-screen (viewport-pixel) Node size, regardless of zoom-in level. */
  private maxNodeSize = 64;
  /**
   * Each Node's true *unscaled* width, measured once (the first time
   * applyNodeSizeCap sees it, while its VISUAL panel is still at its
   * template-default scale of 1) and cached here forever after. Recovering
   * this from `actualBounds.width / scale` on every call instead — as a
   * naive per-call approach might — is unsafe: GoJS doesn't re-measure
   * bounds synchronously within the same commit, so that division would
   * read a one-step-stale value and compound a small error every zoom
   * step, causing the counter-scale to drift upward without ever
   * converging. Measuring once and caching sidesteps that entirely.
   */
  private naturalNodeWidths = new WeakMap<go.Panel, number>();
  private hasAppliedInitialSelection = false;
  // Keys of Group-Nodes currently "exploded" (children + parent->child Links
  // revealed). Purely internal view state — not part of the controlled
  // `nodes`/`links` props — and never auto-cleared; a Group-Node only
  // collapses when its badge's "−" is explicitly clicked.
  private expandedKeys = new Set<string>();
  private lastNodes: TopologyNodeData[] = [];
  private lastLinks: TopologyLinkData[] = [];
  private wheelZoomDiv: HTMLDivElement | null = null;
  private wheelZoomListener: ((e: WheelEvent) => void) | null = null;
  private lastWheelZoomTime = 0;
  // Watches <html data-theme> so canvas-rendered colors (Nodes/Links/div
  // background — none of which can see CSS at all) stay in sync with the
  // app-wide Light/Dark toggle in App.tsx.
  private themeObserver: MutationObserver | null = null;

  init(
    container: HTMLDivElement,
    options: TopologyEngineOptions,
    handlers: TopologyEngineHandlers
  ): void {
    this.handlers = handlers;
    this.minNodeSize = options.minNodeSize ?? 16;
    this.maxNodeSize = options.maxNodeSize ?? 64;
    registerFigures();
    const $ = go.GraphObject.make;

    const diagram = new go.Diagram(container, {
      "undoManager.isEnabled": true,
      initialAutoScale: go.Diagram.None,
      allowZoom: true,
      allowHorizontalScroll: true,
      allowVerticalScroll: true,
      "clickCreatingTool.isEnabled": false,
      "linkingTool.isEnabled": false,
      "relinkingTool.isEnabled": false,
      // "Only 1 node can be selected at a time": this GoJS build has no
      // Diagram.allowMultiselect property, so disable the rubber-band
      // multi-select gesture here, and enforce single-selection reactively
      // in the "ChangedSelection" listener below (covers shift/ctrl-click too).
      "dragSelectingTool.isEnabled": false,
      // GoJS's built-in WheelZoom scales the zoom step to each wheel event's
      // delta magnitude, which varies a lot by device/browser (trackpad vs.
      // mouse wheel) and gives an inconsistent feel. Disabled here in favor
      // of a fixed-step zoom below: exactly one increase/decrease per wheel
      // "tick", regardless of delta magnitude.
      "toolManager.mouseWheelBehavior": go.WheelMode.None,
      layout: $(go.Layout), // no automatic layout; positions come from data
    });

    if (diagram.div) {
      diagram.div.style.background = cssVar("--color-background-component", "#ffffff");

      this.wheelZoomDiv = diagram.div;
      this.wheelZoomListener = (e: WheelEvent) => {
        e.preventDefault();
        // A single physical wheel "tick" (or trackpad gesture) commonly
        // dispatches several rapid-fire "wheel" DOM events rather than
        // exactly one — coalesce any events within a short window into a
        // single zoom step so the result matches one press of the "+"/"−"
        // (Ctrl-+/Ctrl-- via CommandHandler.increaseZoom/decreaseZoom, the
        // same commands and default zoomFactor this uses).
        const now = performance.now();
        if (now - this.lastWheelZoomTime < 80) return;
        this.lastWheelZoomTime = now;

        // Calling CommandHandler methods directly from a raw DOM event
        // bypasses GoJS's own Tool pipeline, which normally wraps such
        // actions in a transaction. Without that, the scale change *and*
        // any resulting Node/Link position recalculations happen outside
        // any transaction and never properly commit (logged as "Change
        // not within a transaction" and silently dropped from
        // measurement/redraw) — wrap in diagram.commit to fix that.
        if (e.deltaY < 0) diagram.commit((d) => d.commandHandler.increaseZoom(), null);
        else if (e.deltaY > 0) diagram.commit((d) => d.commandHandler.decreaseZoom(), null);
      };
      diagram.div.addEventListener("wheel", this.wheelZoomListener, { passive: false });
    }

    // Set up the model once, up front, fully configured (in particular with
    // linkKeyProperty set) — this GoJS build's Diagram may already default
    // `model` to a GraphLinksModel instance of its own, so we can't reliably
    // detect "first load" in setData() by checking `instanceof
    // GraphLinksModel`; always start from a model we know is correctly
    // configured, and let setData() always merge into it.
    diagram.model = new go.GraphLinksModel([], [], { linkKeyProperty: "key" });

    // Links must never render above a Node — including its Name/Type-Name
    // text — but within a single shared Layer, GoJS draws Parts in the
    // order they're added, and Links normally end up drawn after (i.e. on
    // top of) Nodes. Giving Links their own Layer placed just *before* the
    // default ("") Node layer in z-order guarantees Links are always drawn
    // underneath every Node, regardless of add order.
    const linksLayer = new go.Layer({ name: "Links" });
    diagram.addLayerBefore(linksLayer, diagram.findLayer("")!);

    const explodeHandlers = {
      expand: (key: string) => this.expand(key),
      collapse: (key: string) => this.collapse(key),
    };
    diagram.nodeTemplateMap.add("single", makeNodeTemplate($, "single", options, explodeHandlers));
    diagram.nodeTemplateMap.add("group", makeNodeTemplate($, "group", options, explodeHandlers));
    diagram.nodeTemplate = diagram.nodeTemplateMap.get("single")!;

    diagram.linkTemplate = makeLinkTemplate($, options);

    this.themeObserver = new MutationObserver(() => refreshTopologyTheme(diagram));
    this.themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    diagram.addDiagramListener("SelectionMoved", (e) => {
      e.subject.each((part: go.Part) => {
        if (part instanceof go.Node) {
          this.handlers.onNodeMove?.(part.data.key, part.location.x, part.location.y);
        }
      });
    });

    diagram.addDiagramListener("ChangedSelection", () => {
      // Enforce "only 1 node selected at a time" even for gestures that
      // could otherwise extend the selection (e.g. shift/ctrl-click).
      if (diagram.selection.count > 1) {
        let mostRecent: go.Part | null = null;
        diagram.selection.each((part: go.Part) => {
          mostRecent = part;
        });
        diagram.clearSelection();
        if (mostRecent) diagram.select(mostRecent);
        return; // re-selecting triggers this listener again with count <= 1
      }

      const keys: string[] = [];
      diagram.selection.each((part: go.Part) => {
        if (part instanceof go.Node) keys.push(part.data.key);
      });
      this.handlers.onSelectionChange?.(keys);

      // Single-select mode means exactly one selected key here corresponds
      // precisely to "a Node was clicked and became the selected Node" —
      // fire the more specific event for consumers who only care about that.
      if (keys.length === 1) {
        this.handlers.onNodeSelect?.(keys[0]);
      }
    });

    // Canvas text is measured/painted with whatever font is available at
    // that instant — unlike DOM text, it does NOT automatically repaint once
    // an async web font (e.g. this app's Google Font Roboto 400/500/700)
    // finishes loading. If the diagram's first paint races ahead of the
    // font load, every weight (regular vs. medium) silently falls back to
    // the browser's default sans-serif and looks identical. Force one
    // repaint once the fonts are confirmed loaded so the correct weights
    // always show up, however the timing worked out.
    if (typeof document !== "undefined" && document.fonts?.ready) {
      document.fonts.ready.then(() => diagram.requestUpdate());
    }

    // Re-cap every Node's on-screen size whenever the zoom level changes
    // (mouse wheel, the +/-/Fit-to-screen controls, or keyboard Ctrl-+/-/Shift-Z).
    diagram.addDiagramListener("ViewportBoundsChanged", () => this.applyNodeSizeCap());

    this.diagram = diagram;
  }

  /**
   * Keeps each Node's *on-screen* (viewport-pixel) size clamped between
   * `minNodeSize` and `maxNodeSize` at all times: as the user zooms in
   * past the point where a Node's natural on-screen size would exceed the
   * max, or zooms out past the point where it would fall below the min,
   * the Node is counter-scaled to hold exactly at that bound instead. Applied
   * as a `scale` transform on the "VISUAL" Spot panel (shapes + icon +
   * status + badge together) rather than resizing individual parts, so
   * everything stays correctly positioned relative to the shape at any
   * cap factor. Name/Type-Name labels live outside "VISUAL" and are
   * unaffected.
   *
   * On top of that per-Node counter-scale, this also clamps the *Diagram's*
   * own `scale` (the actual zoom level) so it stops changing entirely once
   * every Node is already sitting at its cap — without this, the user could
   * keep scrolling/zooming indefinitely past that point with no visible
   * effect on Node size (since the counter-scale absorbs it), which feels
   * like the zoom is "going too far". The bound is derived from whichever
   * Node reaches the cap *last*: the smallest Node determines how far you
   * can zoom in before every Node has hit `maxNodeSize`, and the largest
   * Node determines how far you can zoom out before every Node has hit
   * `minNodeSize`.
   */
  private applyNodeSizeCap(): void {
    const diagram = this.diagram;
    if (!diagram) return;
    // Mutating GraphObject properties outside of a transaction leaves GoJS's
    // layout/bounds stale (logged as "Change not within a transaction" and
    // silently ignored for re-measurement) — wrap in diagram.commit so the
    // scale change is properly committed and immediately re-measured/
    // re-rendered. `null` as the transaction name skips the UndoManager,
    // since this is a derived, non-undoable visual adjustment.
    diagram.commit((d) => {
      // First pass: measure (or reuse the cached) natural width of every
      // Node, tracking the smallest/largest across all of them, so the
      // Diagram-level zoom bound below can be derived before any per-Node
      // counter-scale is applied.
      let minNaturalWidth = Infinity;
      let maxNaturalWidth = 0;
      d.nodes.each((node: go.Node) => {
        const visual = node.findObject("VISUAL") as go.Panel | null;
        if (!visual) return;
        // The VISUAL panel's true *unscaled* width can't be assumed to
        // equal `nodeSize` — Group-Nodes' 3 offset-stacked shapes and a
        // Single-Node's status-icon overhang both push its real footprint
        // wider than the shape's own nodeSize x nodeSize box. Measure it
        // once (see naturalNodeWidths' doc comment) and cache it, rather
        // than a wrong shared constant or a per-call re-derivation.
        let naturalWidth = this.naturalNodeWidths.get(visual);
        if (naturalWidth === undefined) {
          naturalWidth = visual.actualBounds.width / (visual.scale || 1);
          this.naturalNodeWidths.set(visual, naturalWidth);
        }
        minNaturalWidth = Math.min(minNaturalWidth, naturalWidth);
        maxNaturalWidth = Math.max(maxNaturalWidth, naturalWidth);
      });

      // Clamp the Diagram's own zoom scale to the range within which at
      // least one Node's natural (uncapped) on-screen size still falls
      // between minNodeSize and maxNodeSize — beyond that range every Node
      // is already pinned to a bound, so further zooming would have no
      // visible effect and is disallowed outright.
      if (minNaturalWidth < Infinity && maxNaturalWidth > 0) {
        const maxDiagramScale = this.maxNodeSize / minNaturalWidth;
        const minDiagramScale = this.minNodeSize / maxNaturalWidth;
        const clampedScale = Math.min(maxDiagramScale, Math.max(minDiagramScale, d.scale));
        if (d.scale !== clampedScale) {
          d.scale = clampedScale;
        }
      }

      // Second pass: counter-scale each Node's VISUAL panel against the
      // (now-clamped) Diagram scale.
      d.nodes.each((node: go.Node) => {
        const visual = node.findObject("VISUAL") as go.Panel | null;
        if (!visual) return;
        const naturalWidth = this.naturalNodeWidths.get(visual);
        if (naturalWidth === undefined) return;
        const naturalScreenSize = naturalWidth * d.scale;
        const targetScreenSize = Math.min(
          this.maxNodeSize,
          Math.max(this.minNodeSize, naturalScreenSize)
        );
        const capScale = targetScreenSize / naturalScreenSize;
        if (visual.scale !== capScale) {
          visual.scale = capScale;
        }
      });
    }, null);
  }

  setData(nodes: TopologyNodeData[], links: TopologyLinkData[]): void {
    this.lastNodes = nodes;
    this.lastLinks = links;
    this.render();
  }

  /** Reveal a Group-Node's children (+ parent->child Links). Idempotent. */
  private expand(key: string): void {
    if (this.expandedKeys.has(key)) return;
    this.expandedKeys.add(key);
    this.render();
  }

  /** Hide a Group-Node's children (+ parent->child Links). Idempotent. */
  private collapse(key: string): void {
    if (!this.expandedKeys.has(key)) return;
    this.expandedKeys.delete(key);
    this.render();
  }

  /**
   * Flattens `nodes` (recursively pulling in any expanded Group-Node's
   * `children`, plus a synthetic Link from each parent to each revealed
   * child) and merges the result into the diagram's model.
   */
  private render(): void {
    const diagram = this.diagram;
    if (!diagram) return;

    const nodeDataArray: Record<string, unknown>[] = [];
    const linkDataArray: Record<string, unknown>[] = [];
    const nodeKeys = new Set<string>();

    const addNode = (n: TopologyNodeData, parentKey: string | null) => {
      const hasChildren = !!(n.children && n.children.length);
      const isExpanded = hasChildren && this.expandedKeys.has(n.key);
      // The badge must always reflect exactly how many Nodes expanding will
      // reveal, so it's derived from `children.length` whenever `children`
      // is provided — `childCount` is only used as a fallback count-only
      // badge (no explode capability) when `children` is omitted entirely.
      const displayChildCount = n.children ? n.children.length : n.childCount || 0;

      nodeDataArray.push({
        key: n.key,
        name: n.name,
        typeName: n.typeName,
        shape: n.shape || "circle",
        icon: n.icon,
        status: n.status,
        category: n.kind === "group" ? "group" : "single",
        loc: go.Point.stringify(new go.Point(n.x, n.y)),
        showName: n.showName !== false,
        showTypeName: n.showTypeName !== false,
        childCount: displayChildCount,
        isSelectedInitially: !!n.selected,
        hasChildren,
        isExpanded,
      });
      nodeKeys.add(n.key);

      if (parentKey) {
        linkDataArray.push({
          key: `__explode__${parentKey}__${n.key}`,
          from: parentKey,
          to: n.key,
          style: "solid",
        });
      }

      if (isExpanded && n.children) {
        for (const child of n.children) addNode(child, n.key);
      }
    };

    for (const n of this.lastNodes) addNode(n, null);

    // Only two Nodes may be connected by any given Link.
    for (const l of this.lastLinks) {
      if (nodeKeys.has(l.from) && nodeKeys.has(l.to)) {
        linkDataArray.push({
          key: l.key,
          from: l.from,
          to: l.to,
          // Fallback color is applied by the link template itself.
          color: l.color,
          style: l.style || "solid",
        });
      }
    }

    // Always merge into the existing model (set up once in init()) instead
    // of replacing it outright. Replacing the whole model would destroy and
    // recreate every Node/Link Part on each render (including ones triggered
    // by clicking to select a Node, since that round-trips through
    // onSelectionChange -> parent state -> this method), which both breaks
    // GoJS's own click-to-select handling and is unnecessarily expensive.
    // Merging preserves existing Part identity (and therefore selection)
    // while still updating any changed data (position, shape, icon, etc.),
    // and — crucially for explode/collapse — also removes any node/link data
    // no longer present in the given array (e.g. a just-collapsed Group-
    // Node's children), per GoJS's documented merge behavior.
    // mergeNodeDataArray/mergeLinkDataArray mutate the model but — unlike
    // the CommandHandler/Tool-driven changes elsewhere in this file — were
    // never wrapped in a transaction here. Outside a transaction, GoJS
    // defers rebuilding/re-measuring the affected Nodes' visual trees, so
    // the immediate applyNodeSizeCap() call below would read stale (often
    // zero-sized, pre-layout) actualBounds for any newly added/changed
    // Node and cache a wrong "natural width" forever. Wrapping the merge
    // in diagram.commit forces GoJS to fully rebuild and re-measure every
    // affected Part synchronously before this function returns.
    diagram.commit((d) => {
      const model = d.model as go.GraphLinksModel;
      model.mergeNodeDataArray(nodeDataArray);
      model.mergeLinkDataArray(linkDataArray);
    }, null);

    if (!this.hasAppliedInitialSelection) {
      this.hasAppliedInitialSelection = true;
      diagram.nodes.each((node: go.Node) => {
        if (node.data.isSelectedInitially) {
          diagram.select(node);
        }
      });
    }

    this.applyNodeSizeCap();
  }

  resize(): void {
    this.diagram?.requestUpdate();
  }

  zoomIn(): void {
    // Wrapped in a transaction for the same reason as the wheel handler
    // above — see its comment.
    this.diagram?.commit((d) => d.commandHandler.increaseZoom(), null);
  }

  zoomOut(): void {
    this.diagram?.commit((d) => d.commandHandler.decreaseZoom(), null);
  }

  zoomToFit(): void {
    this.diagram?.commit((d) => d.zoomToFit(), null);
  }

  destroy(): void {
    this.themeObserver?.disconnect();
    this.themeObserver = null;
    if (this.wheelZoomDiv && this.wheelZoomListener) {
      this.wheelZoomDiv.removeEventListener("wheel", this.wheelZoomListener);
    }
    this.wheelZoomDiv = null;
    this.wheelZoomListener = null;
    this.lastWheelZoomTime = 0;
    if (this.diagram) {
      this.diagram.div = null;
    }
    this.diagram = null;
  }
}
