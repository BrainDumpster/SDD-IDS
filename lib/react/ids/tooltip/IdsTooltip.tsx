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
  /** When true, popup width hugs content (skip fixed 240/264). Default `false`. */
  hugContent?: boolean;
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

/** Trigger-to-tooltip spacing (with arrow): 16px — design-spec sideOffset. */
const SIDE_OFFSET = 16;

function computePopupPosition(
  trigger: DOMRect,
  popup: DOMRect,
  side: TooltipSide,
  align: TooltipArrowAlign,
): { top: number; left: number } {
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

  if (side === "top" || side === "bottom") {
    if (align === "start") left = trigger.left;
    else if (align === "end") left = trigger.right - popup.width;
    else left = trigger.left + trigger.width / 2 - popup.width / 2;
  } else {
    if (align === "start") top = trigger.top;
    else if (align === "end") top = trigger.bottom - popup.height;
    else top = trigger.top + trigger.height / 2 - popup.height / 2;
  }

  return { top, left };
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

export function TooltipPanel({
  children,
  className,
  ...rest
}: TooltipPanelProps) {
  const { closable } = useTooltipContext("TooltipPanel");
  const { header, body, close, other } = partitionPanelChildren(children);

  const hasTitle = headerHasVisibleTitle(header);
  const closeNode = closable ? close ?? <TooltipClose /> : null;

  const content = closable ? (
    <>
      <div
        className={styles["ids-tooltip-content-column"]}
        data-ids="ids-tooltip-content-column"
      >
        {header ?? <TooltipHeader />}
        {body}
        {other}
      </div>
      {closeNode}
    </>
  ) : (
    <>
      {hasTitle ? header : null}
      {body}
      {other}
    </>
  );

  return (
    <div
      className={cx(styles["ids-tooltip-panel"], className)}
      data-ids="ids-tooltip-panel"
      data-closable={closable ? "true" : "false"}
      {...rest}
    >
      <div
        className={cx(
          styles["ids-tooltip-content"],
          closable && styles["ids-tooltip-content--closable"],
        )}
        data-ids="ids-tooltip-content"
      >
        {content}
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
}: {
  side: TooltipSide;
  align: TooltipArrowAlign;
}) {
  return (
    <span
      className={styles["ids-tooltip-arrow"]}
      data-ids="ids-tooltip-arrow"
      data-side={side}
      data-align={align}
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
  hugContent = false,
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
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(
    null,
  );

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current != null) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
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
      setOpenValue(false);
      onClose?.(reason);
    },
    [clearCloseTimer, setOpenValue, onClose],
  );

  const requestOpen = useCallback(() => {
    clearCloseTimer();
    setOpenValue(true);
  }, [clearCloseTimer, setOpenValue]);

  const requestClose = useCallback(() => {
    if (closable) {
      // Closable ignores leave/blur unless explicitly dismissed.
      return;
    }
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => {
      setOpenValue(false);
    }, 100);
  }, [closable, clearCloseTimer, setOpenValue]);

  const onTriggerEnter = useCallback(() => {
    requestOpen();
  }, [requestOpen]);

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

  useEffect(() => () => clearCloseTimer(), [clearCloseTimer]);

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
        triggerEl.getBoundingClientRect(),
        popupEl.getBoundingClientRect(),
        side,
        arrowAlign,
      );
      setCoords(next);
    };

    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [open, side, arrowAlign, children, hugContent, closable]);

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
  };

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
            <TooltipArrowGraphic side={side} align={arrowAlign} />
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
