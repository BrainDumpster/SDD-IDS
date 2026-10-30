/**
 * IDS Tooltip — React implementation generated from design-spec.
 *
 * Path: `lib/react/ids/tooltip`
 * Source: `components/ids/tooltip/design-spec.md`
 * Theme: `components/ids-theme.css`
 *
 * Anatomy (children composition):
 *   Tooltip                          — positioned root (was TooltipRoot)
 *     TooltipTrigger                 — TriggerAnchor
 *     TooltipPanel                   — bordered surface
 *       TooltipHeader?               — Header (optional; empty slot when closable + no title)
 *       TooltipBody                  — BodyContent (required)
 *       TooltipClose?                — CloseAction (required when closable; auto-emitted if omitted)
 *     Arrow                          — always rendered (directional pointer)
 *
 * No @base-ui-components dependency. Arrow CSS uses `data-side` / `data-align`
 * calibration from design-spec Layout & Measurements.
 */

import React, {
  Children,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { IdsButton, IdsButtonLeadingIcon } from "../button";
import { IdsIcon } from "../icon";
import styles from "./IdsTooltip.module.css";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export type TooltipSide = "top" | "bottom" | "left" | "right";
export type TooltipArrowAlign = "start" | "center" | "end";
export type TooltipCloseReason = "close-click" | "escape" | "programmatic";

export interface TooltipProps {
  children?: ReactNode;
  /** `side` in design-spec. Default `top`. Unknown → `top`. */
  side?: TooltipSide;
  /** `arrowAlign` in design-spec. Default `center`. Unknown → `center`. */
  arrowAlign?: TooltipArrowAlign;
  /** Default `false` — hover/focus transient. */
  closable?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: (reason: TooltipCloseReason) => void;
  /** Default `ctrl-close-16`. */
  closeIconShapeName?: string;
  /** When true, popup width hugs content (skip fixed 240/264). Default `true`. */
  hugContent?: boolean;
  /** Maximum popup width (px) when `hugContent` is true. Default `244`. */
  maxWidth?: number;
  /** Maximum popup height (px); panel scrolls past this. Default `300`. */
  maxHeight?: number;
  /**
   * Hover open delay (ms) — the pointer must rest on the trigger this long
   * before the tooltip appears; sweeping across never opens it. Default `300`.
   */
  delay?: number;
}

export interface TooltipTriggerProps extends HTMLAttributes<HTMLSpanElement> {
  children?: ReactNode;
  /** `block` for full-width row triggers. Default `inline`. */
  display?: "inline" | "block";
}

export interface TooltipPanelProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export interface TooltipHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export interface TooltipBodyProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export interface TooltipCloseProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  children?: ReactNode;
}

/* -------------------------------------------------------------------------- */
/* Slot markers                                                               */
/* -------------------------------------------------------------------------- */

const SLOT = Symbol.for("ids.tooltip.slot");
type SlotName = "trigger" | "panel" | "header" | "body" | "close";

function getSlot(type: unknown): SlotName | undefined {
  if (typeof type !== "function" && typeof type !== "object") return undefined;
  return (type as { [SLOT]?: SlotName })[SLOT];
}

function markSlot<T>(fn: T, name: SlotName): T {
  (fn as { [SLOT]?: SlotName })[SLOT] = name;
  return fn;
}

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

function resolveSide(value: unknown): TooltipSide {
  if (value === "bottom" || value === "left" || value === "right") return value;
  return "top";
}

function resolveAlign(value: unknown): TooltipArrowAlign {
  if (value === "start" || value === "end") return value;
  return "center";
}

/**
 * Visible gap between the object's edge and the tooltip's closest point — the
 * arrow tip: `6px` (`spacing/space-6`). The arrow pokes `5px` past the panel
 * edge toward the trigger, so the positioner offset is 6 + 5 = `11px`.
 */
const OBJECT_TO_ARROW_TIP_GAP = 6;
const ARROW_EXTENSION = 5;
const SIDE_OFFSET = OBJECT_TO_ARROW_TIP_GAP + ARROW_EXTENSION;

/** Arrow lane length on the cross axis (10px arrow graphic). */
const ARROW_LANE = 10;
/** Keep the arrow lane clear of the panel's rounded corners. */
const ARROW_EDGE_INSET = 4;

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), Math.max(min, max));
}

/**
 * Measures the painted box of the slotted trigger object (button, badge, chip)
 * rather than the inline wrapper's line box — the inline box follows text
 * metrics and can sit inside the object's padding or be inflated by
 * line-height, which would offset the 6px gap and the arrow from the wrong
 * edge. Falls back to the wrapper rect when the trigger is, or mixes in,
 * plain text — there the text run is the object.
 */
function measureTriggerBox(trigger: HTMLElement): DOMRect {
  const hasText = Array.from(trigger.childNodes).some(
    (node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim(),
  );
  if (hasText || trigger.children.length === 0) {
    return trigger.getBoundingClientRect();
  }
  let top = Infinity;
  let left = Infinity;
  let right = -Infinity;
  let bottom = -Infinity;
  for (const child of trigger.children) {
    const r = child.getBoundingClientRect();
    top = Math.min(top, r.top);
    left = Math.min(left, r.left);
    right = Math.max(right, r.right);
    bottom = Math.max(bottom, r.bottom);
  }
  if (!Number.isFinite(top)) return trigger.getBoundingClientRect();
  return new DOMRect(left, top, right - left, bottom - top);
}

function computePopupPosition(
  trigger: DOMRect,
  popup: DOMRect,
  side: TooltipSide,
  align: TooltipArrowAlign,
): { top: number; left: number; arrowOffset: number } {
  let top = 0;
  let left = 0;

  if (side === "top") {
    top = trigger.top - popup.height - SIDE_OFFSET;
  } else if (side === "bottom") {
    top = trigger.bottom + SIDE_OFFSET;
  } else if (side === "left") {
    left = trigger.left - popup.width - SIDE_OFFSET;
  } else {
    left = trigger.right + SIDE_OFFSET;
  }

  let arrowOffset = 0;

  if (side === "top" || side === "bottom") {
    if (align === "start") left = trigger.left;
    else if (align === "end") left = trigger.right - popup.width;
    else left = trigger.left + trigger.width / 2 - popup.width / 2;

    // Arrow cross-axis: centered on the trigger object, clamped to the panel.
    const triggerCenter = trigger.left + trigger.width / 2;
    arrowOffset = clamp(
      triggerCenter - left - ARROW_LANE / 2,
      ARROW_EDGE_INSET,
      popup.width - ARROW_LANE - ARROW_EDGE_INSET,
    );
  } else {
    if (align === "start") top = trigger.top;
    else if (align === "end") top = trigger.bottom - popup.height;
    else top = trigger.top + trigger.height / 2 - popup.height / 2;

    const triggerCenter = trigger.top + trigger.height / 2;
    arrowOffset = clamp(
      triggerCenter - top - ARROW_LANE / 2,
      ARROW_EDGE_INSET,
      popup.height - ARROW_LANE - ARROW_EDGE_INSET,
    );
  }

  return { top, left, arrowOffset };
}

/* -------------------------------------------------------------------------- */
/* Context                                                                    */
/* -------------------------------------------------------------------------- */

interface TooltipContextValue {
  closable: boolean;
  closeIconShapeName: string;
  tooltipId: string;
  open: boolean;
  dismiss: (reason: TooltipCloseReason) => void;
  triggerRef: React.RefObject<HTMLSpanElement | null>;
  onTriggerEnter: () => void;
  onTriggerLeave: () => void;
  onTriggerFocus: () => void;
  onTriggerBlur: () => void;
}

const TooltipContext = createContext<TooltipContextValue | null>(null);

function useTooltipContext(slot: string): TooltipContextValue {
  const ctx = useContext(TooltipContext);
  if (!ctx) throw new Error(`${slot} must be used within Tooltip`);
  return ctx;
}

/* -------------------------------------------------------------------------- */
/* Partition helpers                                                          */
/* -------------------------------------------------------------------------- */

function partitionRootChildren(children: ReactNode): {
  trigger: ReactElement | null;
  panel: ReactElement | null;
  other: ReactNode[];
} {
  let trigger: ReactElement | null = null;
  let panel: ReactElement | null = null;
  const other: ReactNode[] = [];

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) {
      if (child != null && child !== false) other.push(child);
      return;
    }
    const slot = getSlot(child.type);
    if (slot === "trigger") {
      trigger = child;
      return;
    }
    if (slot === "panel") {
      panel = child;
      return;
    }
    other.push(child);
  });

  return { trigger, panel, other };
}

function partitionPanelChildren(children: ReactNode): {
  header: ReactElement | null;
  body: ReactElement | null;
  close: ReactElement | null;
  other: ReactNode[];
} {
  let header: ReactElement | null = null;
  let body: ReactElement | null = null;
  let close: ReactElement | null = null;
  const other: ReactNode[] = [];

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) {
      if (child != null && child !== false) other.push(child);
      return;
    }
    const slot = getSlot(child.type);
    if (slot === "header") {
      header = child;
      return;
    }
    if (slot === "body") {
      body = child;
      return;
    }
    if (slot === "close") {
      close = child;
      return;
    }
    other.push(child);
  });

  return { header, body, close, other };
}

function headerHasVisibleTitle(header: ReactElement | null): boolean {
  if (!header) return false;
  const kids = (header.props as { children?: ReactNode }).children;
  if (kids == null || kids === false || kids === "") return false;
  if (typeof kids === "string" && kids.trim() === "") return false;
  return true;
}

/* -------------------------------------------------------------------------- */
/* TooltipTrigger — TriggerAnchor                                             */
/* -------------------------------------------------------------------------- */

export function TooltipTrigger({
  children,
  className,
  display = "inline",
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  ...rest
}: TooltipTriggerProps) {
  const {
    tooltipId,
    open,
    triggerRef,
    onTriggerEnter,
    onTriggerLeave,
    onTriggerFocus,
    onTriggerBlur,
  } = useTooltipContext("TooltipTrigger");

  return (
    <span
      ref={triggerRef}
      className={cx(
        display === "block"
          ? styles["ids-tooltip-trigger--block"]
          : styles["ids-tooltip-trigger"],
        className,
      )}
      data-ids="ids-tooltip-trigger"
      aria-describedby={open ? tooltipId : undefined}
      onMouseEnter={(event) => {
        onTriggerEnter();
        onMouseEnter?.(event);
      }}
      onMouseLeave={(event) => {
        onTriggerLeave();
        onMouseLeave?.(event);
      }}
      onFocus={(event) => {
        onTriggerFocus();
        onFocus?.(event);
      }}
      onBlur={(event) => {
        onTriggerBlur();
        onBlur?.(event);
      }}
      {...rest}
    >
      {children}
    </span>
  );
}
markSlot(TooltipTrigger, "trigger");
TooltipTrigger.displayName = "TooltipTrigger";

/* -------------------------------------------------------------------------- */
/* TooltipHeader — Header                                                     */
/* -------------------------------------------------------------------------- */

export function TooltipHeader({
  children,
  className,
  ...rest
}: TooltipHeaderProps) {
  const { closable } = useTooltipContext("TooltipHeader");
  const visible = children != null && children !== false && children !== "";

  if (!closable && !visible) return null;

  return (
    <div
      className={cx(styles["ids-tooltip-header"], className)}
      data-ids="ids-tooltip-header"
      aria-hidden={!visible}
      {...rest}
    >
      {visible ? (
        <div className={styles["ids-tooltip-title"]} data-ids="ids-tooltip-title">
          {children}
        </div>
      ) : null}
    </div>
  );
}
markSlot(TooltipHeader, "header");
TooltipHeader.displayName = "TooltipHeader";

/* -------------------------------------------------------------------------- */
/* TooltipBody — BodyContent                                                  */
/* -------------------------------------------------------------------------- */

export function TooltipBody({
  children,
  className,
  ...rest
}: TooltipBodyProps) {
  useTooltipContext("TooltipBody");

  if (children == null || children === false) return null;

  return (
    <div
      className={cx(styles["ids-tooltip-body"], className)}
      data-ids="ids-tooltip-body"
      {...rest}
    >
      {children}
    </div>
  );
}
markSlot(TooltipBody, "body");
TooltipBody.displayName = "TooltipBody";

/* -------------------------------------------------------------------------- */
/* TooltipClose — CloseAction                                                 */
/* -------------------------------------------------------------------------- */

export function TooltipClose({
  className,
  onClick,
  ...rest
}: TooltipCloseProps) {
  const { closable, closeIconShapeName, dismiss } =
    useTooltipContext("TooltipClose");

  if (!closable) return null;

  return (
    <IdsButton
      type="button"
      variant="tertiary"
      iconOnly
      size="medium"
      ariaLabel="Close tooltip"
      className={cx(styles["ids-tooltip-close"], className)}
      data-ids="ids-tooltip-close"
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) dismiss("close-click");
      }}
      {...rest}
    >
      <IdsButtonLeadingIcon className={styles["ids-tooltip-close-icon"]}>
        <IdsIcon
          shape={closeIconShapeName}
          size={12}
          color="var(--color-icon-gray-neutral-base)"
        />
      </IdsButtonLeadingIcon>
    </IdsButton>
  );
}
markSlot(TooltipClose, "close");
TooltipClose.displayName = "TooltipClose";

/* -------------------------------------------------------------------------- */
/* TooltipPanel                                                               */
/* -------------------------------------------------------------------------- */

/**
 * Measure the rendered scrollbar width for `scrollbar-width: thin` so the
 * closable scroll region can keep an exact `spacing/space-4` gap while
 * `scrollbar-gutter: stable` reserves the track permanently.
 */
function measureThinScrollbarWidth(): number {
  const probe = document.createElement("div");
  probe.style.position = "absolute";
  probe.style.top = "-9999px";
  probe.style.visibility = "hidden";
  probe.style.overflow = "scroll";
  probe.style.scrollbarWidth = "thin";
  probe.style.width = "100px";
  probe.style.height = "100px";
  document.body.appendChild(probe);
  const width = Math.max(probe.offsetWidth - probe.clientWidth, 0);
  probe.remove();
  return width;
}

export function TooltipPanel({
  children,
  className,
  ...rest
}: TooltipPanelProps) {
  const { closable } = useTooltipContext("TooltipPanel");
  const { header, body, close, other } = partitionPanelChildren(children);
  const [scrollbarWidth, setScrollbarWidth] = useState(0);

  useLayoutEffect(() => {
    if (closable) setScrollbarWidth(measureThinScrollbarWidth());
  }, [closable]);

  const hasTitle = headerHasVisibleTitle(header);
  const closeNode = closable ? close ?? <TooltipClose /> : null;
  // When a title or close icon exists, pin them in a top bar so the
  // scrollable region (and its scrollbar) starts below them.
  const hasTopBar = closable || hasTitle;

  return (
    <div
      className={cx(styles["ids-tooltip-panel"], className)}
      data-ids="ids-tooltip-panel"
      data-closable={closable ? "true" : "false"}
      {...rest}
    >
      {hasTopBar ? (
        <div
          className={styles["ids-tooltip-top"]}
          data-ids="ids-tooltip-top"
        >
          <div
            className={styles["ids-tooltip-content-column"]}
            data-ids="ids-tooltip-content-column"
          >
            {header ?? (closable ? <TooltipHeader /> : null)}
          </div>
          {closeNode}
        </div>
      ) : null}
      <div
        className={cx(
          styles["ids-tooltip-scroll"],
          hasTopBar && styles["ids-tooltip-scroll--under-top"],
        )}
        data-ids="ids-tooltip-scroll"
      >
        <div
          className={cx(
            styles["ids-tooltip-content"],
            closable && styles["ids-tooltip-content--closable"],
          )}
          style={
            closable
              ? ({
                  "--ids-scrollbar-width": `${scrollbarWidth}px`,
                } as CSSProperties)
              : undefined
          }
          data-ids="ids-tooltip-content"
        >
          {body}
          {other}
        </div>
      </div>
    </div>
  );
}
markSlot(TooltipPanel, "panel");
TooltipPanel.displayName = "TooltipPanel";

/* -------------------------------------------------------------------------- */
/* Arrow (always rendered)                                                    */
/* -------------------------------------------------------------------------- */

function TooltipArrowGraphic({
  side,
  align,
  offset,
}: {
  side: TooltipSide;
  align: TooltipArrowAlign;
  /** Cross-axis arrow position in px — centered on the trigger object. */
  offset?: number;
}) {
  return (
    <span
      className={styles["ids-tooltip-arrow"]}
      data-ids="ids-tooltip-arrow"
      data-side={side}
      data-align={align}
      style={
        offset != null
          ? ({ "--ids-tooltip-arrow-offset": `${offset}px` } as CSSProperties)
          : undefined
      }
      aria-hidden="true"
    >
      <span className={styles["ids-tooltip-arrow-graphic"]}>
        <svg className={styles["ids-tooltip-arrow-svg"]} viewBox="0 0 10 6">
          <path
            className={styles["ids-tooltip-arrow-fill"]}
            d="M0.5 5.5L5 0.5L9.5 5.5L9.5 6.5L0.5 6.5Z"
          />
          <path
            className={styles["ids-tooltip-arrow-stroke"]}
            d="M0.5 5.5L5 0.5L9.5 5.5"
          />
        </svg>
      </span>
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Tooltip — root (was TooltipRoot)                                           */
/* -------------------------------------------------------------------------- */

function TooltipRoot({
  children,
  side: sideProp,
  arrowAlign: alignProp,
  closable = false,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  onClose,
  closeIconShapeName = "ctrl-close-16",
  hugContent = true,
  maxWidth = 244,
  maxHeight = 300,
  delay = 300,
}: TooltipProps) {
  const side = resolveSide(sideProp);
  const arrowAlign = resolveAlign(alignProp);
  const reactId = useId();
  const tooltipId = `ids-tooltip-${reactId}`;

  const isControlled = openProp != null;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const open = isControlled ? Boolean(openProp) : uncontrolledOpen;

  const triggerRef = useRef<HTMLSpanElement | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [coords, setCoords] = useState<{
    top: number;
    left: number;
    arrowOffset: number;
  } | null>(null);

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current != null) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const clearOpenTimer = useCallback(() => {
    if (openTimerRef.current != null) {
      clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }
  }, []);

  const setOpenValue = useCallback(
    (next: boolean) => {
      if (!isControlled) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  const dismiss = useCallback(
    (reason: TooltipCloseReason) => {
      clearCloseTimer();
      clearOpenTimer();
      setOpenValue(false);
      onClose?.(reason);
    },
    [clearCloseTimer, clearOpenTimer, setOpenValue, onClose],
  );

  const requestOpen = useCallback(() => {
    clearCloseTimer();
    clearOpenTimer();
    setOpenValue(true);
  }, [clearCloseTimer, clearOpenTimer, setOpenValue]);

  /** Hover path — only opens after the pointer rests `delay` ms. */
  const scheduleOpen = useCallback(() => {
    clearCloseTimer();
    clearOpenTimer();
    if (delay <= 0) {
      setOpenValue(true);
      return;
    }
    openTimerRef.current = setTimeout(() => {
      openTimerRef.current = null;
      setOpenValue(true);
    }, delay);
  }, [delay, clearCloseTimer, clearOpenTimer, setOpenValue]);

  const requestClose = useCallback(() => {
    // A pending scheduled open is always cancelled on leave/blur — even for
    // closable tooltips — so a quick sweep across the trigger never opens it.
    clearOpenTimer();
    if (closable) {
      // Closable ignores leave/blur unless explicitly dismissed.
      return;
    }
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => {
      setOpenValue(false);
    }, 100);
  }, [closable, clearOpenTimer, clearCloseTimer, setOpenValue]);

  const onTriggerEnter = useCallback(() => {
    scheduleOpen();
  }, [scheduleOpen]);

  const onTriggerLeave = useCallback(() => {
    requestClose();
  }, [requestClose]);

  const onTriggerFocus = useCallback(() => {
    requestOpen();
  }, [requestOpen]);

  const onTriggerBlur = useCallback(() => {
    requestClose();
  }, [requestClose]);

  const onPopupEnter = useCallback(() => {
    if (!closable) clearCloseTimer();
  }, [closable, clearCloseTimer]);

  const onPopupLeave = useCallback(() => {
    requestClose();
  }, [requestClose]);

  useEffect(
    () => () => {
      clearCloseTimer();
      clearOpenTimer();
    },
    [clearCloseTimer, clearOpenTimer],
  );

  useLayoutEffect(() => {
    if (!open) {
      setCoords(null);
      return;
    }

    const update = () => {
      const triggerEl = triggerRef.current;
      const popupEl = popupRef.current;
      if (!triggerEl || !popupEl) return;
      const next = computePopupPosition(
        measureTriggerBox(triggerEl),
        popupEl.getBoundingClientRect(),
        side,
        arrowAlign,
      );
      setCoords((prev) =>
        prev &&
        prev.top === next.top &&
        prev.left === next.left &&
        prev.arrowOffset === next.arrowOffset
          ? prev
          : next,
      );
    };

    update();

    // Closable tooltips resize right after open — the scrollbar-width
    // measurement changes the content padding (and thus panel height). For
    // side=top/left a stale height pushes the panel edge off its anchor, so
    // reposition whenever the trigger or popup box changes.
    const resizeObserver = new ResizeObserver(update);
    if (triggerRef.current) resizeObserver.observe(triggerRef.current);
    if (popupRef.current) resizeObserver.observe(popupRef.current);

    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [open, side, arrowAlign, children, hugContent, maxWidth, maxHeight, closable]);

  useEffect(() => {
    if (!open || !closable) return;
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") dismiss("escape");
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, closable, dismiss]);

  const { trigger, panel, other } = partitionRootChildren(children);

  const ctx = useMemo<TooltipContextValue>(
    () => ({
      closable,
      closeIconShapeName,
      tooltipId,
      open,
      dismiss,
      triggerRef,
      onTriggerEnter,
      onTriggerLeave,
      onTriggerFocus,
      onTriggerBlur,
    }),
    [
      closable,
      closeIconShapeName,
      tooltipId,
      open,
      dismiss,
      onTriggerEnter,
      onTriggerLeave,
      onTriggerFocus,
      onTriggerBlur,
    ],
  );

  const popupClassName = cx(
    styles["ids-tooltip-popup"],
    closable
      ? styles["ids-tooltip-popup--closable"]
      : styles["ids-tooltip-popup--standard"],
    hugContent && styles["ids-tooltip-popup--hug"],
  );

  const popupStyle: CSSProperties = {
    position: "fixed",
    top: coords?.top ?? 0,
    left: coords?.left ?? 0,
    visibility: coords ? "visible" : "hidden",
    ...(hugContent ? { "--tooltip-max-width": `${maxWidth}px` } : {}),
    "--tooltip-max-height": `${maxHeight}px`,
  } as CSSProperties;

  const handlePopupKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape" && closable) {
      dismiss("escape");
    }
  };

  const portal =
    open && typeof document !== "undefined"
      ? createPortal(
          <div
            ref={popupRef}
            id={tooltipId}
            className={popupClassName}
            role="tooltip"
            data-ids="ids-tooltip"
            data-side={side}
            data-arrow-align={arrowAlign}
            data-closable={closable ? "true" : "false"}
            style={popupStyle}
            onMouseEnter={onPopupEnter}
            onMouseLeave={onPopupLeave}
            onKeyDown={handlePopupKeyDown}
          >
            <TooltipArrowGraphic
              side={side}
              align={arrowAlign}
              offset={coords?.arrowOffset}
            />
            {panel}
            {other}
          </div>,
          document.body,
        )
      : null;

  return (
    <TooltipContext.Provider value={ctx}>
      {trigger}
      {portal}
    </TooltipContext.Provider>
  );
}

TooltipRoot.displayName = "Tooltip";

export const Tooltip = Object.assign(TooltipRoot, {
  Trigger: TooltipTrigger,
  Panel: TooltipPanel,
  Header: TooltipHeader,
  Body: TooltipBody,
  Close: TooltipClose,
});

/** Ids-prefixed alias for barrel consistency with other `lib/react/ids/*` exports. */
export const IdsTooltip = Tooltip;

export default Tooltip;
