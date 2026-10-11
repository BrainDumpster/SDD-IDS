import {
  Children,
  isValidElement,
  type ComponentProps,
  type CSSProperties,
  type HTMLAttributes,
  type PointerEvent as ReactPointerEvent,
  type ReactElement,
  type ReactNode,
  useCallback,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Icon } from "./Icon";
import styles from "./IdsDetailPanel.module.css";

export type IdsDetailPanelAttachMode = "datagrid" | "page";

/** Data grid panel width limits (IDS guideline): docked or floating, 240–480px. */
const DATAGRID_MIN_WIDTH = 240;
const DATAGRID_MAX_WIDTH = 480;
/** Floating (detached) panel height limits (IDS guideline). */
const FLOATING_MAX_HEIGHT = 1280;
const FLOATING_MIN_HEIGHT = 160;
/** Gap kept between a floating panel and the viewport edges. */
const FLOATING_VIEWPORT_MARGIN = 16;
/** Part of a dragged floating panel that must stay on screen (its header band). */
const FLOATING_DRAG_HANDLE = 48;

export interface IdsDetailPanelProps extends Omit<ComponentProps<"aside">, "children"> {
  attachMode: IdsDetailPanelAttachMode;
  isExpanded: boolean;
  onExpandedChange?: (next: boolean) => void;
  onOpened?: () => void;
  onClosed?: () => void;
  /** @deprecated Prefer composition: `<IdsDetailPanel.Header>` + `<IdsDetailPanel.Body>`. */
  body?: ReactNode;
  /** Shorthand when `IdsDetailPanel.Header` is not used. */
  title?: string;
  showHeader?: boolean;
  showFooter?: boolean;
  ariaLabelExpand?: string;
  ariaLabelCollapse?: string;
  collapsedWidth?: number;
  /**
   * Expanded width. Defaults per attach mode in CSS: under IDS, data grid panels
   * follow their content within 240–480px and page panels are 384px (any value is
   * kept inside those limits); other design systems default to 398px.
   */
  expandedWidth?: number;
  /** Data grid panels only: show the pop-out control in the header (IDS guideline). */
  detachable?: boolean;
  /**
   * Controlled floating (popped out) state. A floating panel leaves the layout, so
   * the grid takes the full width, and can be resized up to 480 × 1280px.
   */
  isDetached?: boolean;
  /** Initial floating state when `isDetached` is uncontrolled. */
  defaultDetached?: boolean;
  onDetachedChange?: (next: boolean) => void;
  ariaLabelDetach?: string;
  ariaLabelAttach?: string;
  children?: ReactNode;
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

function findChild<T>(
  children: ReactNode,
  component: (props: T) => ReactNode,
): ReactElement<T> | undefined {
  return Children.toArray(children).find(
    (child) => isValidElement(child) && child.type === component,
  ) as ReactElement<T> | undefined;
}

function emitExpandedChange(
  next: boolean,
  current: boolean,
  onExpandedChange?: (next: boolean) => void,
  onOpened?: () => void,
  onClosed?: () => void,
): void {
  if (next === current) {
    return;
  }
  onExpandedChange?.(next);
  if (next) {
    onOpened?.();
  } else {
    onClosed?.();
  }
}

export function IdsDetailPanelHeader({ children }: { children?: ReactNode }) {
  return <>{children}</>;
}

export function IdsDetailPanelBody({ children }: { children?: ReactNode }) {
  return <>{children}</>;
}

/* Content blocks (Figma ".Details_Panel-Template") */

export interface IdsDetailPanelSectionProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  /** Section header (Figma ".Section Header for details panel"). */
  title?: ReactNode;
  /** `IdsDetailPanelField` rows. */
  children?: ReactNode;
}

/** A titled group of label / value rows. Consecutive sections are separated by a full-width rule. */
export function IdsDetailPanelSection({ title, children, className, ...rest }: IdsDetailPanelSectionProps) {
  const titleId = `${useId()}-title`;
  return (
    <section
      className={[styles.section, className].filter(Boolean).join(" ")}
      data-ids="ids-detail-panel-section"
      aria-labelledby={title != null ? titleId : undefined}
      {...rest}
    >
      {title != null ? (
        <h4 id={titleId} className={styles.sectionHeader}>
          {title}
        </h4>
      ) : null}
      <dl className={styles.fields}>{children}</dl>
    </section>
  );
}

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
      <dt className={styles.fieldLabel}>{label}</dt>
      <dd className={styles.fieldValue}>{children}</dd>
    </>
  );
}

/**
 * Padded block for free-form content — inline alerts, text, graphics (Figma
 * ".Details_Panel-Template": 24px padding). Tabs and sections go straight in the
 * body so they run edge to edge.
 */
export function IdsDetailPanelBlock({ children, className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={[styles.block, className].filter(Boolean).join(" ")}
      data-ids="ids-detail-panel-block"
      {...rest}
    >
      {children}
    </div>
  );
}

export function IdsDetailPanel({
  attachMode,
  isExpanded,
  onExpandedChange,
  onOpened,
  onClosed,
  body,
  title = "Details",
  showHeader = true,
  showFooter = true,
  ariaLabelExpand = "Expand details panel",
  ariaLabelCollapse = "Collapse details panel",
  collapsedWidth = 40,
  expandedWidth,
  detachable = false,
  isDetached: isDetachedProp,
  defaultDetached = false,
  onDetachedChange,
  ariaLabelDetach = "Pop out details panel",
  ariaLabelAttach = "Dock details panel",
  className,
  style,
  children,
  ...rest
}: IdsDetailPanelProps) {
  const bodyId = useId();
  const headerChild = children ? findChild(children, IdsDetailPanelHeader) : undefined;
  const bodyChild = children ? findChild(children, IdsDetailPanelBody) : undefined;
  const resolvedBody = bodyChild?.props.children ?? body;
  const resolvedTitle = headerChild?.props.children ?? title;

  const [uncontrolledDetached, setUncontrolledDetached] = useState(defaultDetached);
  const isDetachedControlled = isDetachedProp != null;
  const detachedState = isDetachedControlled ? Boolean(isDetachedProp) : uncontrolledDetached;
  // Only an expanded data grid panel floats; the collapsed rail always stays docked.
  const isDetached = attachMode === "datagrid" && isExpanded && detachedState;

  const rootRef = useRef<HTMLElement>(null);
  const detachButtonRef = useRef<HTMLButtonElement>(null);
  const [floatingRect, setFloatingRect] = useState<FloatingRect | null>(null);
  // Focus follows the pop-out button across the docked ↔ floating switch.
  const refocusDetachRef = useRef(false);

  const toggleIcon = isExpanded ? "double-chev-right" : "double-chev-left";
  const toggleAriaLabel = isExpanded ? ariaLabelCollapse : ariaLabelExpand;

  const handleToggle = () => {
    emitExpandedChange(!isExpanded, isExpanded, onExpandedChange, onOpened, onClosed);
  };

  const toggleDetached = useCallback(() => {
    const next = !detachedState;
    if (next && rootRef.current) {
      // Pop out where the docked panel sits, kept inside the viewport.
      const rect = rootRef.current.getBoundingClientRect();
      const width = clamp(rect.width, DATAGRID_MIN_WIDTH, DATAGRID_MAX_WIDTH);
      const top = Math.max(FLOATING_VIEWPORT_MARGIN, rect.top);
      const maxHeight = Math.min(FLOATING_MAX_HEIGHT, window.innerHeight - top - FLOATING_VIEWPORT_MARGIN);
      setFloatingRect({
        top,
        left: clamp(rect.left, FLOATING_VIEWPORT_MARGIN, window.innerWidth - width - FLOATING_VIEWPORT_MARGIN),
        width,
        height: clamp(rect.height, FLOATING_MIN_HEIGHT, Math.max(FLOATING_MIN_HEIGHT, maxHeight)),
      });
    }
    refocusDetachRef.current = true;
    if (!isDetachedControlled) setUncontrolledDetached(next);
    onDetachedChange?.(next);
  }, [detachedState, isDetachedControlled, onDetachedChange]);

  const startDetachedDrag = (event: ReactPointerEvent<HTMLElement>) => {
    const panel = rootRef.current;
    if (!isDetached || !panel || event.button !== 0) return;
    if ((event.target as Element).closest("button, a, input, select, textarea")) return;
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
        left: clamp(start.left + moveEvent.clientX - originX, 0, Math.max(0, window.innerWidth - start.width)),
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
  };

  // Floating without a docked rectangle to start from (e.g. `isDetached` set from
  // the start): open against the right edge of the viewport.
  useLayoutEffect(() => {
    if (!isDetached || floatingRect) return;
    const width = clamp(rootRef.current?.offsetWidth ?? DATAGRID_MAX_WIDTH, DATAGRID_MIN_WIDTH, DATAGRID_MAX_WIDTH);
    setFloatingRect({
      top: FLOATING_VIEWPORT_MARGIN,
      left: Math.max(FLOATING_VIEWPORT_MARGIN, window.innerWidth - width - FLOATING_VIEWPORT_MARGIN),
      width,
      height: clamp(window.innerHeight - 2 * FLOATING_VIEWPORT_MARGIN, FLOATING_MIN_HEIGHT, FLOATING_MAX_HEIGHT),
    });
  }, [isDetached, floatingRect]);

  useLayoutEffect(() => {
    if (!refocusDetachRef.current) return;
    refocusDetachRef.current = false;
    detachButtonRef.current?.focus();
  }, [isDetached]);

  let sizeStyle: CSSProperties;
  if (!isExpanded) {
    sizeStyle = { width: collapsedWidth };
  } else if (isDetached && floatingRect) {
    sizeStyle = { ...floatingRect };
  } else {
    // Mode defaults (and the IDS limits) come from `.expandedDatagrid` / `.expandedPage`.
    sizeStyle = expandedWidth != null && expandedWidth > 0 ? { width: expandedWidth } : {};
  }

  const toggleButton = (
    <button
      type="button"
      className={styles.toggleButton}
      aria-label={toggleAriaLabel}
      aria-expanded={isExpanded}
      aria-controls={isExpanded ? bodyId : undefined}
      onClick={handleToggle}
    >
      <Icon shapeName={toggleIcon} />
    </button>
  );

  const detachButton =
    detachable && attachMode === "datagrid" ? (
      <button
        ref={detachButtonRef}
        type="button"
        className={styles.toggleButton}
        data-ids="ids-detail-panel-detach"
        aria-label={isDetached ? ariaLabelAttach : ariaLabelDetach}
        onClick={toggleDetached}
      >
        <Icon shapeName="popout-window-arrow" />
      </button>
    ) : null;

  return (
    <aside
        ref={rootRef}
        className={[
          styles.root,
          isExpanded && !isDetached
            ? attachMode === "page"
              ? styles.expandedPage
              : styles.expandedDatagrid
            : null,
          isDetached ? styles.detached : null,
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        style={{ ...style, ...sizeStyle }}
        aria-label={`${attachMode} details panel`}
        data-detached={isDetached ? "true" : undefined}
        {...rest}
      >
        {isExpanded ? (
          <>
            {attachMode === "datagrid" && showHeader ? (
              <header
                className={styles.header}
                data-ids="ids-detail-panel-header"
                onPointerDown={startDetachedDrag}
              >
                <h3 className={styles.title}>{resolvedTitle}</h3>
                <div className={styles.controls}>
                  {detachButton}
                  {toggleButton}
                </div>
              </header>
            ) : null}

            <div
              id={bodyId}
              className={[styles.body, attachMode === "page" ? styles.bodyPage : null]
                .filter(Boolean)
                .join(" ")}
            >
              {resolvedBody}
            </div>

            {attachMode === "page" && showFooter ? (
              <footer className={styles.footer}>
                <div className={styles.controls}>{toggleButton}</div>
              </footer>
            ) : null}
          </>
        ) : (
          <div
            className={[
              styles.collapsedRail,
              attachMode === "page" ? styles.collapsedRailPage : styles.collapsedRailDatagrid,
            ].join(" ")}
          >
            <div className={styles.controls}>{toggleButton}</div>
          </div>
        )}
      </aside>
  );
}

IdsDetailPanel.Header = IdsDetailPanelHeader;
IdsDetailPanel.Body = IdsDetailPanelBody;
IdsDetailPanel.Section = IdsDetailPanelSection;
IdsDetailPanel.Field = IdsDetailPanelField;
IdsDetailPanel.Block = IdsDetailPanelBlock;
