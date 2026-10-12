/**
 * IDS Detail Panel — React implementation generated from design-spec.
 *
 * Path: `lib/react/ids/detail-panel`
 * Source: `components/ids/detail-panel/design-spec.md`
 * Theme: `components/ids-theme.css`
 *
 * Composition (Ids-prefixed):
 *   IdsDetailPanel
 *     IdsDetailPanelContent          — expanded branch wrapper
 *       datagrid: IdsDetailPanelHeader + IdsDetailPanelBody
 *       page:     IdsDetailPanelBody + IdsDetailPanelFooter
 *     IdsDetailPanelCollapsedRail    — collapsed icon-only rail
 *       IdsDetailPanelToggleButton
 *
 * Selectors: ids-detail-panel, ids-detail-panel-header, …
 * No @base-ui-components dependency.
 */

import React, {
  Children,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ComponentPropsWithoutRef,
  type HTMLAttributes,
  type PointerEvent as ReactPointerEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import { IdsIcon } from "../icon";
import styles from "./IdsDetailPanel.module.css";

export type IdsDetailPanelAttachMode = "datagrid" | "page";

/** Data grid panel width limits (IDS guideline): docked or floating, 240–480px. */
const DATAGRID_MIN_WIDTH = 240;
const DATAGRID_MAX_WIDTH = 480;
/** Page panel width (IDS guideline): at most 384px, which is also the default. */
const PAGE_MAX_WIDTH = 384;
/** Floating (detached) panel height limit (IDS guideline). */
const FLOATING_MAX_HEIGHT = 1280;
const FLOATING_MIN_HEIGHT = 160;
/** Gap kept between a floating panel and the viewport edges. */
const FLOATING_VIEWPORT_MARGIN = 16;
/** Part of a dragged floating panel that must stay on screen (its header band). */
const FLOATING_DRAG_HANDLE = 48;

const SLOT = Symbol.for("ids.detailPanel.slot");

type SlotName =
  | "toggle"
  | "detach"
  | "title"
  | "header"
  | "body"
  | "footer"
  | "content"
  | "collapsed-rail";

function getSlot(type: unknown): SlotName | undefined {
  if (typeof type !== "function" && typeof type !== "object") return undefined;
  return (type as { [SLOT]?: SlotName })[SLOT];
}

/* -------------------------------------------------------------------------- */
/* Context                                                                    */
/* -------------------------------------------------------------------------- */

interface IdsDetailPanelContextValue {
  attachMode: IdsDetailPanelAttachMode;
  isExpanded: boolean;
  /** Floating (popped out) — data grid panels only, and only while expanded. */
  isDetached: boolean;
  bodyId: string;
  ariaLabelExpand: string;
  ariaLabelCollapse: string;
  toggle: () => void;
  toggleDetached: () => void;
  /** Moves a floating panel with the pointer (header drag). */
  startDetachedDrag: (event: ReactPointerEvent<HTMLElement>) => void;
}

const IdsDetailPanelContext = createContext<IdsDetailPanelContextValue | null>(
  null,
);

function useDetailPanelContext(slot: string): IdsDetailPanelContextValue {
  const ctx = useContext(IdsDetailPanelContext);
  if (!ctx) {
    throw new Error(`${slot} must be used within IdsDetailPanel`);
  }
  return ctx;
}

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

function resolveAttachMode(mode: unknown): IdsDetailPanelAttachMode {
  return mode === "page" ? "page" : "datagrid";
}

function resolveWidth(value: number | undefined, fallback: number): number {
  if (value == null || !(value > 0)) return fallback;
  return value;
}

function partitionHeaderChildren(children: ReactNode): {
  titleNodes: ReactNode[];
  /** Header controls render in Figma order: pop-out first, the expand/collapse toggle last (right edge). */
  detach: ReactElement | null;
  toggle: ReactElement | null;
  other: ReactNode[];
} {
  const titleNodes: ReactNode[] = [];
  const other: ReactNode[] = [];
  const controls: { detach: ReactElement | null; toggle: ReactElement | null } = {
    detach: null,
    toggle: null,
  };

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) {
      if (child != null && child !== false) titleNodes.push(child);
      return;
    }
    const slot = getSlot(child.type);
    if (slot === "toggle") {
      controls.toggle = child;
      return;
    }
    if (slot === "detach") {
      controls.detach = child;
      return;
    }
    if (slot === "title") {
      titleNodes.push(child);
      return;
    }
    other.push(child);
  });

  return { titleNodes, ...controls, other };
}

function partitionToggleOnly(children: ReactNode): {
  toggle: ReactElement | null;
  other: ReactNode[];
} {
  const other: ReactNode[] = [];
  let toggle: ReactElement | null = null;

  Children.forEach(children, (child) => {
    if (isValidElement(child) && getSlot(child.type) === "toggle") {
      toggle = child;
      return;
    }
    if (child != null && child !== false) other.push(child);
  });

  return { toggle, other };
}

/* -------------------------------------------------------------------------- */
/* Root — DetailPanel                                                         */
/* -------------------------------------------------------------------------- */

export interface IdsDetailPanelProps
  extends Omit<ComponentPropsWithoutRef<"aside">, "children" | "title"> {
  children?: ReactNode;
  attachMode: IdsDetailPanelAttachMode;
  /** Controlled expand state. When omitted, uses local / `defaultExpanded` state. */
  isExpanded?: boolean;
  onExpandedChange?: (next: boolean) => void;
  ariaLabelExpand?: string;
  ariaLabelCollapse?: string;
  collapsedWidth?: number;
  /**
   * Expanded width (IDS guideline). Page panels are 384px by default and never
   * wider. Data grid panels size to their content by default and clamp any value
   * to 240–480px.
   */
  expandedWidth?: number;
  /** Default expanded state when `isExpanded` is uncontrolled. */
  defaultExpanded?: boolean;
  /**
   * Data grid panels only: controlled floating (popped out) state, toggled by
   * `IdsDetailPanelDetachButton`. A floating panel leaves the layout, so the grid
   * takes the full width, and can be resized up to 480 × 1280px.
   */
  isDetached?: boolean;
  /** Initial floating state when `isDetached` is uncontrolled. */
  defaultDetached?: boolean;
  onDetachedChange?: (next: boolean) => void;
}

/** Fixed-position geometry of a floating panel, seeded from its docked rectangle. */
interface FloatingRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function IdsDetailPanel({
  attachMode: attachModeProp,
  isExpanded: isExpandedProp,
  onExpandedChange,
  ariaLabelExpand = "Expand details panel",
  ariaLabelCollapse = "Collapse details panel",
  collapsedWidth: collapsedWidthProp,
  expandedWidth: expandedWidthProp,
  defaultExpanded = true,
  isDetached: isDetachedProp,
  defaultDetached = false,
  onDetachedChange,
  className,
  style,
  id: idProp,
  children,
  ...rest
}: IdsDetailPanelProps) {
  const attachMode = resolveAttachMode(attachModeProp);
  const collapsedWidth = resolveWidth(collapsedWidthProp, 40);

  const [uncontrolledExpanded, setUncontrolledExpanded] = useState(defaultExpanded);
  const isControlled = isExpandedProp != null;
  const isExpanded = isControlled ? Boolean(isExpandedProp) : uncontrolledExpanded;

  const [uncontrolledDetached, setUncontrolledDetached] = useState(defaultDetached);
  const isDetachedControlled = isDetachedProp != null;
  const detachedState = isDetachedControlled ? Boolean(isDetachedProp) : uncontrolledDetached;
  // Only an expanded data grid panel floats; the collapsed rail always stays docked.
  const isDetached = attachMode === "datagrid" && isExpanded && detachedState;

  const reactId = useId();
  const rootId = idProp ?? `ids-detail-panel-${reactId}`;
  const bodyId = `${rootId}-body`;
  const rootRef = useRef<HTMLElement>(null);
  const [floatingRect, setFloatingRect] = useState<FloatingRect | null>(null);
  // Focus follows the pop-out button across the docked ↔ floating switch.
  const refocusDetachRef = useRef(false);

  const toggle = useCallback(() => {
    const next = !(isControlled ? Boolean(isExpandedProp) : uncontrolledExpanded);
    if (!isControlled) setUncontrolledExpanded(next);
    onExpandedChange?.(next);
  }, [isControlled, isExpandedProp, uncontrolledExpanded, onExpandedChange]);

  const toggleDetached = useCallback(() => {
    const next = !detachedState;
    if (next && rootRef.current) {
      // Pop out where the docked panel sits, kept inside the viewport.
      const rect = rootRef.current.getBoundingClientRect();
      const width = clamp(rect.width, DATAGRID_MIN_WIDTH, DATAGRID_MAX_WIDTH);
      const top = Math.max(FLOATING_VIEWPORT_MARGIN, rect.top);
      const maxHeight = Math.min(
        FLOATING_MAX_HEIGHT,
        window.innerHeight - top - FLOATING_VIEWPORT_MARGIN,
      );
      setFloatingRect({
        top,
        left: clamp(
          rect.left,
          FLOATING_VIEWPORT_MARGIN,
          window.innerWidth - width - FLOATING_VIEWPORT_MARGIN,
        ),
        width,
        height: clamp(rect.height, FLOATING_MIN_HEIGHT, Math.max(FLOATING_MIN_HEIGHT, maxHeight)),
      });
    }
    refocusDetachRef.current = true;
    if (!isDetachedControlled) setUncontrolledDetached(next);
    onDetachedChange?.(next);
  }, [detachedState, isDetachedControlled, onDetachedChange]);

  const startDetachedDrag = useCallback((event: ReactPointerEvent<HTMLElement>) => {
    const panel = rootRef.current;
    if (!panel) return;
    // Read the live box: the user may have resized the panel with its corner grip.
    const start = panel.getBoundingClientRect();
    const originX = event.clientX;
    const originY = event.clientY;
    const handle = event.currentTarget;
    handle.setPointerCapture(event.pointerId);
    event.preventDefault();

    const onMove = (moveEvent: PointerEvent) => {
      setFloatingRect({
        top: clamp(
          start.top + moveEvent.clientY - originY,
          0,
          Math.max(0, window.innerHeight - FLOATING_DRAG_HANDLE),
        ),
        left: clamp(
          start.left + moveEvent.clientX - originX,
          0,
          Math.max(0, window.innerWidth - start.width),
        ),
        width: start.width,
        height: start.height,
      });
    };
    const onEnd = () => {
      handle.removeEventListener("pointermove", onMove);
      handle.removeEventListener("pointerup", onEnd);
      handle.removeEventListener("pointercancel", onEnd);
    };
    handle.addEventListener("pointermove", onMove);
    handle.addEventListener("pointerup", onEnd);
    handle.addEventListener("pointercancel", onEnd);
  }, []);

  // Floating without a docked rectangle to start from (e.g. `isDetached` set from
  // the start): open against the right edge of the viewport.
  useLayoutEffect(() => {
    if (!isDetached || floatingRect) return;
    const width = clamp(rootRef.current?.offsetWidth ?? DATAGRID_MAX_WIDTH, DATAGRID_MIN_WIDTH, DATAGRID_MAX_WIDTH);
    setFloatingRect({
      top: FLOATING_VIEWPORT_MARGIN,
      left: Math.max(FLOATING_VIEWPORT_MARGIN, window.innerWidth - width - FLOATING_VIEWPORT_MARGIN),
      width,
      height: clamp(
        window.innerHeight - 2 * FLOATING_VIEWPORT_MARGIN,
        FLOATING_MIN_HEIGHT,
        FLOATING_MAX_HEIGHT,
      ),
    });
  }, [isDetached, floatingRect]);

  useLayoutEffect(() => {
    if (!refocusDetachRef.current) return;
    refocusDetachRef.current = false;
    rootRef.current
      ?.querySelector<HTMLElement>('[data-ids="ids-detail-panel-detach"]')
      ?.focus();
  }, [isDetached]);

  const ctx = useMemo<IdsDetailPanelContextValue>(
    () => ({
      attachMode,
      isExpanded,
      isDetached,
      bodyId,
      ariaLabelExpand,
      ariaLabelCollapse,
      toggle,
      toggleDetached,
      startDetachedDrag,
    }),
    [
      attachMode,
      isExpanded,
      isDetached,
      bodyId,
      ariaLabelExpand,
      ariaLabelCollapse,
      toggle,
      toggleDetached,
      startDetachedDrag,
    ],
  );

  // Data grid: content-driven width within 240–480px unless a width is given (then
  // clamped to the same range). Page: fixed width, 384px by default and at most.
  const autoWidth = attachMode === "datagrid" && isExpanded && expandedWidthProp == null;
  let sizeStyle: CSSProperties;
  if (!isExpanded) {
    sizeStyle = { width: collapsedWidth };
  } else if (isDetached && floatingRect) {
    sizeStyle = { ...floatingRect };
  } else if (attachMode === "datagrid") {
    sizeStyle = autoWidth
      ? {}
      : { width: clamp(resolveWidth(expandedWidthProp, DATAGRID_MIN_WIDTH), DATAGRID_MIN_WIDTH, DATAGRID_MAX_WIDTH) };
  } else {
    sizeStyle = { width: Math.min(resolveWidth(expandedWidthProp, PAGE_MAX_WIDTH), PAGE_MAX_WIDTH) };
  }

  return (
    <IdsDetailPanelContext.Provider value={ctx}>
      <aside
        ref={rootRef}
        id={rootId}
        className={cx(
          styles["ids-detail-panel"],
          autoWidth && !isDetached && styles["ids-detail-panel--auto-width"],
          isDetached && styles["ids-detail-panel--detached"],
          className,
        )}
        style={{ ...style, ...sizeStyle }}
        data-ids="ids-detail-panel"
        data-attach-mode={attachMode}
        data-expanded={isExpanded ? "true" : "false"}
        data-detached={isDetached ? "true" : undefined}
        aria-label={`${attachMode} details panel`}
        {...rest}
      >
        {children}
      </aside>
    </IdsDetailPanelContext.Provider>
  );
}

IdsDetailPanel.displayName = "IdsDetailPanel";

/* -------------------------------------------------------------------------- */
/* Content                                                                    */
/* -------------------------------------------------------------------------- */

export interface IdsDetailPanelContentProps
  extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export function IdsDetailPanelContent({
  children,
  className,
  ...rest
}: IdsDetailPanelContentProps) {
  const { isExpanded } = useDetailPanelContext("IdsDetailPanelContent");
  if (!isExpanded) return null;

  return (
    <div
      className={cx(styles["ids-detail-panel-content"], className)}
      data-ids="ids-detail-panel-content"
      {...rest}
    >
      {children}
    </div>
  );
}

IdsDetailPanelContent.displayName = "IdsDetailPanelContent";
(IdsDetailPanelContent as { [SLOT]?: SlotName })[SLOT] = "content";

/* -------------------------------------------------------------------------- */
/* Header                                                                     */
/* -------------------------------------------------------------------------- */

export interface IdsDetailPanelHeaderProps
  extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
}

export function IdsDetailPanelHeader({
  children,
  className,
  onPointerDown,
  ...rest
}: IdsDetailPanelHeaderProps) {
  const { isDetached, startDetachedDrag } = useDetailPanelContext("IdsDetailPanelHeader");
  const { titleNodes, detach, toggle, other } = partitionHeaderChildren(children);

  return (
    <header
      className={cx(styles["ids-detail-panel-header"], className)}
      data-ids="ids-detail-panel-header"
      onPointerDown={(event) => {
        onPointerDown?.(event);
        if (
          isDetached &&
          !event.defaultPrevented &&
          event.button === 0 &&
          !(event.target as Element).closest("button, a, input, select, textarea")
        ) {
          startDetachedDrag(event);
        }
      }}
      {...rest}
    >
      {titleNodes.length > 0 ? (
        <h3 className={styles["ids-detail-panel-title"]}>{titleNodes}</h3>
      ) : null}
      {other}
      {detach || toggle ? (
        <div className={styles["ids-detail-panel-controls"]}>
          {detach}
          {toggle}
        </div>
      ) : null}
    </header>
  );
}

IdsDetailPanelHeader.displayName = "IdsDetailPanelHeader";
(IdsDetailPanelHeader as { [SLOT]?: SlotName })[SLOT] = "header";

/* -------------------------------------------------------------------------- */
/* Title                                                                      */
/* -------------------------------------------------------------------------- */

export interface IdsDetailPanelTitleProps
  extends HTMLAttributes<HTMLSpanElement> {
  children?: ReactNode;
}

/** Optional title marker inside Header (lifted into the heading). */
export function IdsDetailPanelTitle({ children }: IdsDetailPanelTitleProps) {
  return <>{children}</>;
}

IdsDetailPanelTitle.displayName = "IdsDetailPanelTitle";
(IdsDetailPanelTitle as { [SLOT]?: SlotName })[SLOT] = "title";

/* -------------------------------------------------------------------------- */
/* Body                                                                       */
/* -------------------------------------------------------------------------- */

export interface IdsDetailPanelBodyProps
  extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export function IdsDetailPanelBody({
  children,
  className,
  id,
  ...rest
}: IdsDetailPanelBodyProps) {
  const { bodyId, attachMode } = useDetailPanelContext("IdsDetailPanelBody");

  return (
    <div
      id={id ?? bodyId}
      className={cx(
        styles["ids-detail-panel-body"],
        attachMode === "page" && styles["ids-detail-panel-body--page"],
        className,
      )}
      data-ids="ids-detail-panel-body"
      {...rest}
    >
      {children}
    </div>
  );
}

IdsDetailPanelBody.displayName = "IdsDetailPanelBody";
(IdsDetailPanelBody as { [SLOT]?: SlotName })[SLOT] = "body";

/* -------------------------------------------------------------------------- */
/* Footer                                                                     */
/* -------------------------------------------------------------------------- */

export interface IdsDetailPanelFooterProps
  extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
}

export function IdsDetailPanelFooter({
  children,
  className,
  ...rest
}: IdsDetailPanelFooterProps) {
  useDetailPanelContext("IdsDetailPanelFooter");
  const { toggle, other } = partitionToggleOnly(children);

  return (
    <footer
      className={cx(styles["ids-detail-panel-footer"], className)}
      data-ids="ids-detail-panel-footer"
      {...rest}
    >
      {other}
      <div className={styles["ids-detail-panel-controls"]}>
        {toggle ?? null}
      </div>
    </footer>
  );
}

IdsDetailPanelFooter.displayName = "IdsDetailPanelFooter";
(IdsDetailPanelFooter as { [SLOT]?: SlotName })[SLOT] = "footer";

/* -------------------------------------------------------------------------- */
/* Collapsed rail                                                             */
/* -------------------------------------------------------------------------- */

export interface IdsDetailPanelCollapsedRailProps
  extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export function IdsDetailPanelCollapsedRail({
  children,
  className,
  ...rest
}: IdsDetailPanelCollapsedRailProps) {
  const { isExpanded, attachMode } = useDetailPanelContext(
    "IdsDetailPanelCollapsedRail",
  );
  if (isExpanded) return null;

  return (
    <div
      className={cx(
        styles["ids-detail-panel-collapsed-rail"],
        attachMode === "page"
          ? styles["ids-detail-panel-collapsed-rail--page"]
          : styles["ids-detail-panel-collapsed-rail--datagrid"],
        className,
      )}
      data-ids="ids-detail-panel-collapsed-rail"
      {...rest}
    >
      <div className={styles["ids-detail-panel-controls"]}>{children}</div>
    </div>
  );
}

IdsDetailPanelCollapsedRail.displayName = "IdsDetailPanelCollapsedRail";
(IdsDetailPanelCollapsedRail as { [SLOT]?: SlotName })[SLOT] = "collapsed-rail";

/* -------------------------------------------------------------------------- */
/* Toggle                                                                     */
/* -------------------------------------------------------------------------- */

export interface IdsDetailPanelToggleButtonProps
  extends Omit<ComponentPropsWithoutRef<"button">, "children" | "type"> {}

export function IdsDetailPanelToggleButton({
  className,
  onClick,
  ...rest
}: IdsDetailPanelToggleButtonProps) {
  const {
    isExpanded,
    bodyId,
    ariaLabelExpand,
    ariaLabelCollapse,
    toggle,
  } = useDetailPanelContext("IdsDetailPanelToggleButton");

  const toggleIcon = isExpanded ? "double-chev-right" : "double-chev-left";
  const toggleAriaLabel = isExpanded ? ariaLabelCollapse : ariaLabelExpand;

  return (
    <button
      type="button"
      className={cx(styles["ids-detail-panel-toggle"], className)}
      data-ids="ids-detail-panel-toggle"
      aria-label={toggleAriaLabel}
      aria-expanded={isExpanded}
      aria-controls={isExpanded ? bodyId : undefined}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) toggle();
      }}
      {...rest}
    >
      <IdsIcon shape={toggleIcon} variant="mask" size={16} color="currentColor" />
    </button>
  );
}

IdsDetailPanelToggleButton.displayName = "IdsDetailPanelToggleButton";
(IdsDetailPanelToggleButton as { [SLOT]?: SlotName })[SLOT] = "toggle";

/* -------------------------------------------------------------------------- */
/* Detach (pop-out) button                                                    */
/* -------------------------------------------------------------------------- */

export interface IdsDetailPanelDetachButtonProps
  extends Omit<ComponentPropsWithoutRef<"button">, "children" | "type"> {
  ariaLabelDetach?: string;
  ariaLabelAttach?: string;
}

/**
 * Pop-out window control (IDS guideline, data grid panels): switches the panel
 * between docked and floating. Place it in `IdsDetailPanelHeader`; it renders
 * nothing for page panels.
 */
export function IdsDetailPanelDetachButton({
  className,
  onClick,
  ariaLabelDetach = "Pop out details panel",
  ariaLabelAttach = "Dock details panel",
  ...rest
}: IdsDetailPanelDetachButtonProps) {
  const { attachMode, isDetached, toggleDetached } = useDetailPanelContext(
    "IdsDetailPanelDetachButton",
  );
  if (attachMode !== "datagrid") return null;

  return (
    <button
      type="button"
      className={cx(styles["ids-detail-panel-toggle"], className)}
      data-ids="ids-detail-panel-detach"
      aria-label={isDetached ? ariaLabelAttach : ariaLabelDetach}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) toggleDetached();
      }}
      {...rest}
    >
      <IdsIcon shape="popout-window-arrow" variant="mask" size={16} color="currentColor" />
    </button>
  );
}

IdsDetailPanelDetachButton.displayName = "IdsDetailPanelDetachButton";
(IdsDetailPanelDetachButton as { [SLOT]?: SlotName })[SLOT] = "detach";

/* -------------------------------------------------------------------------- */
/* Content blocks (Figma ".Details Panel Content" / ".Details_Panel-Template") */
/* -------------------------------------------------------------------------- */

export interface IdsDetailPanelSectionProps
  extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  /** Section header (Figma ".Section Header for details panel"). */
  title?: ReactNode;
  /** `IdsDetailPanelField` rows. */
  children?: ReactNode;
}

/**
 * A titled group of label / value rows. Consecutive sections are separated by a
 * full-width rule.
 */
export function IdsDetailPanelSection({
  title,
  children,
  className,
  ...rest
}: IdsDetailPanelSectionProps) {
  const titleId = `${useId()}-title`;
  return (
    <section
      className={cx(styles["ids-detail-panel-section"], className)}
      data-ids="ids-detail-panel-section"
      aria-labelledby={title != null ? titleId : undefined}
      {...rest}
    >
      {title != null ? (
        <h4 id={titleId} className={styles["ids-detail-panel-section-header"]}>
          {title}
        </h4>
      ) : null}
      <dl className={styles["ids-detail-panel-fields"]}>{children}</dl>
    </section>
  );
}

IdsDetailPanelSection.displayName = "IdsDetailPanelSection";

export interface IdsDetailPanelFieldProps {
  /** Label cell, e.g. `"Status:"` (Figma shows the trailing colon). */
  label: ReactNode;
  /** Value cell; wraps onto more lines when long. */
  children?: ReactNode;
}

/** One label / value row (Figma ".Key value for details panel"). Use inside `IdsDetailPanelSection`. */
export function IdsDetailPanelField({ label, children }: IdsDetailPanelFieldProps) {
  return (
    <>
      <dt className={styles["ids-detail-panel-field-label"]}>{label}</dt>
      <dd className={styles["ids-detail-panel-field-value"]}>{children}</dd>
    </>
  );
}

IdsDetailPanelField.displayName = "IdsDetailPanelField";

export interface IdsDetailPanelBlockProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

/**
 * Padded block for free-form content — inline alerts, text, graphics (Figma
 * ".Details_Panel-Template": 24px padding). Tabs and sections go straight in
 * the body so they run edge to edge.
 */
export function IdsDetailPanelBlock({ children, className, ...rest }: IdsDetailPanelBlockProps) {
  return (
    <div
      className={cx(styles["ids-detail-panel-block"], className)}
      data-ids="ids-detail-panel-block"
      {...rest}
    >
      {children}
    </div>
  );
}

IdsDetailPanelBlock.displayName = "IdsDetailPanelBlock";

export default IdsDetailPanel;
