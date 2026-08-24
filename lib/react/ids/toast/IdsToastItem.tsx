/**
 * IDS ToastItem — React implementation from design-spec.
 *
 * Path: `lib/react/ids/toast`
 * Source: `components/ids/toast/design-spec.md`
 * Theme: `components/ids-theme.css`
 *
 * Anatomy:
 *   ToastItem
 *     Content → IconContainer → StatusIcon; Message
 *     ActionContainer → ViewDetailsAction?; CloseAction?
 *
 * No @base-ui-components dependency.
 */

import React, {
  useCallback,
  useEffect,
  useRef,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import {
  IdsButton,
  IdsButtonLabel,
  IdsButtonLeadingIcon,
} from "../button";
import { IdsIcon } from "../icon";
import styles from "./IdsToast.module.css";

export type IdsToastType =
  | "info"
  | "critical"
  | "major-warning"
  | "minor-warning"
  | "success";

export type IdsToastCloseReason = "close-click" | "timeout" | "programmatic";

export interface IdsToastLink {
  label: string;
  href?: string;
  /** Angular-oriented; when present with href, prefer this (React hosts may map to router). */
  routerLink?: string | string[];
  target?: "_self" | "_blank" | "_parent" | "_top";
  onClick?: (event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
}

export interface IdsToastItemProps {
  id?: string;
  type?: IdsToastType | string;
  message: string;
  /** Host timeout ms. Default `8000`. `0` disables auto-dismiss. Invalid → `8000`. */
  duration?: number;
  closable?: boolean;
  link?: IdsToastLink;
  /** Item role. Default `status`; allow `alert` when product rules require. */
  role?: "status" | "alert";
  onClose?: (detail: { id?: string; reason: IdsToastCloseReason }) => void;
  onTimeout?: (detail: { id?: string }) => void;
  className?: string;
}

const TOAST_TYPES = new Set<IdsToastType>([
  "info",
  "critical",
  "major-warning",
  "minor-warning",
  "success",
]);

const TYPE_ICON: Record<IdsToastType, string> = {
  info: "info-circ-solid",
  critical: "status-critical-square-solid",
  "major-warning": "status-error-diamond-solid",
  "minor-warning": "status-warn-tri-solid",
  success: "status-ok-circ-solid",
};

const DEFAULT_DURATION = 8000;

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

function resolveType(value: unknown): IdsToastType {
  if (typeof value === "string" && TOAST_TYPES.has(value as IdsToastType)) {
    return value as IdsToastType;
  }
  return "info";
}

function resolveDuration(value: unknown): number {
  if (typeof value !== "number" || Number.isNaN(value) || value < 0) {
    return DEFAULT_DURATION;
  }
  return value;
}

function warnMissingIcon(shape: string): void {
  if (typeof console !== "undefined" && typeof console.warn === "function") {
    console.warn(`[IdsToast] Missing icon asset for shape "${shape}".`);
  }
}

export function IdsToastItem({
  id,
  type: typeProp,
  message,
  duration: durationProp,
  closable = true,
  link,
  role = "status",
  onClose,
  onTimeout,
  className,
}: IdsToastItemProps) {
  const type = resolveType(typeProp);
  const duration = resolveDuration(durationProp);
  const shape = TYPE_ICON[type];
  const rootRef = useRef<HTMLDivElement>(null);
  const remainingRef = useRef(duration);
  const startedAtRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pausedRef = useRef(false);

  const clearTimer = useCallback(() => {
    if (timerRef.current != null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    startedAtRef.current = null;
  }, []);

  const dismiss = useCallback(
    (reason: IdsToastCloseReason) => {
      clearTimer();
      onClose?.({ id, reason });
      if (reason === "timeout") {
        onTimeout?.({ id });
      }
    },
    [clearTimer, id, onClose, onTimeout],
  );

  const startTimer = useCallback(() => {
    clearTimer();
    if (duration <= 0 || pausedRef.current) return;
    startedAtRef.current = Date.now();
    timerRef.current = setTimeout(() => {
      dismiss("timeout");
    }, remainingRef.current);
  }, [clearTimer, dismiss, duration]);

  const pauseTimer = useCallback(() => {
    if (duration <= 0 || pausedRef.current) return;
    pausedRef.current = true;
    if (startedAtRef.current != null) {
      const elapsed = Date.now() - startedAtRef.current;
      remainingRef.current = Math.max(0, remainingRef.current - elapsed);
    }
    clearTimer();
  }, [clearTimer, duration]);

  const resumeTimer = useCallback(() => {
    if (duration <= 0) return;
    pausedRef.current = false;
    startTimer();
  }, [duration, startTimer]);

  useEffect(() => {
    remainingRef.current = duration;
    pausedRef.current = false;
    startTimer();
    return () => clearTimer();
  }, [duration, startTimer, clearTimer]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Escape") return;
    const root = rootRef.current;
    if (!root) return;
    const active = document.activeElement;
    if (active && root.contains(active)) {
      event.preventDefault();
      dismiss("close-click");
    }
  };

  const showLink = Boolean(link?.label);
  const preferRouter = link?.routerLink != null;
  const hasHref = Boolean(link?.href) && !preferRouter;

  const handleViewDetailsClick = (
    event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
  ) => {
    link?.onClick?.(event);
  };

  const statusIcon = (
    <IdsIcon
      shape={shape}
      variant="img"
      size={16}
      className={styles["ids-toast-status-icon"]}
      aria-hidden
    />
  );

  // Missing-asset contract: IdsIcon renders empty marker; log once via effect-ish check
  // (IdsIcon already exposes data-missing; warn when shape resolve fails at mount).
  useEffect(() => {
    const el = rootRef.current?.querySelector(
      `[data-ids="ids-icon"][data-shape="${shape}"][data-missing="true"]`,
    );
    if (el) warnMissingIcon(shape);
  }, [shape]);

  return (
    <div
      ref={rootRef}
      className={cx(styles["ids-toast-item"], className)}
      data-ids="ids-toast-item"
      data-type={type}
      role={role}
      tabIndex={-1}
      onMouseEnter={pauseTimer}
      onMouseLeave={resumeTimer}
      onFocus={pauseTimer}
      onBlur={(event) => {
        const next = event.relatedTarget as Node | null;
        if (next && rootRef.current?.contains(next)) return;
        resumeTimer();
      }}
      onKeyDown={handleKeyDown}
    >
      <div className={styles["ids-toast-content"]} data-ids="ids-toast-content">
        <div
          className={styles["ids-toast-icon-container"]}
          data-ids="ids-toast-icon-container"
        >
          {statusIcon}
        </div>
        <p className={styles["ids-toast-message"]} data-ids="ids-toast-message">
          {message}
        </p>
      </div>

      <div
        className={styles["ids-toast-action-container"]}
        data-ids="ids-toast-action-container"
      >
        {showLink && link ? (
          hasHref ? (
            <a
              className={styles["ids-toast-view-details-anchor"]}
              href={link.href}
              target={link.target}
              rel={link.target === "_blank" ? "noopener noreferrer" : undefined}
              data-ids="ids-toast-view-details"
              onClick={handleViewDetailsClick}
            >
              {link.label}
            </a>
          ) : (
            <IdsButton
              variant="tertiary"
              size="small"
              className={styles["ids-toast-view-details"]}
              data-ids="ids-toast-view-details"
              onClick={handleViewDetailsClick}
            >
              <IdsButtonLabel>{link.label}</IdsButtonLabel>
            </IdsButton>
          )
        ) : null}

        {closable ? (
          <IdsButton
            variant="tertiary"
            size="medium"
            iconOnly
            ariaLabel="Dismiss notification"
            className={styles["ids-toast-close"]}
            data-ids="ids-toast-close"
            onClick={() => dismiss("close-click")}
          >
            <IdsButtonLeadingIcon>
              <IdsIcon
                shape="shape-x"
                variant="mask"
                color="var(--color-icon-gray-white)"
                size={12}
                className={styles["ids-toast-close-icon"]}
              />
            </IdsButtonLeadingIcon>
          </IdsButton>
        ) : null}
      </div>
    </div>
  );
}

IdsToastItem.displayName = "IdsToastItem";

export default IdsToastItem;
