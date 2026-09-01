/**
 * IDS Alert — React implementation generated from design-spec.
 *
 * Path: `lib/react/ids/alert`
 * Source: `components/ids/alert/design-spec.md`
 * Theme: `components/ids-theme.css`
 *
 * Unified `display: "global" | "inline"`. Multi-item global carousel: `IdsAlertGroup`.
 * Selectors: ids-alert-global, ids-alert-inline, …
 * No @base-ui-components dependency.
 */

import React, { useState, type MouseEvent } from "react";
import { IdsIcon } from "../icon";
import styles from "./IdsAlert.module.css";

export type IdsAlertDisplay = "global" | "inline";

export type IdsAlertGlobalSeverity =
  | "critical"
  | "warning-major"
  | "warning-minor"
  | "informational";

export type IdsAlertInlineSeverity = IdsAlertGlobalSeverity | "success";

export type IdsAlertSeverityFor<D extends IdsAlertDisplay> = D extends "global"
  ? IdsAlertGlobalSeverity
  : IdsAlertInlineSeverity;

export interface IdsAlertCarouselProps {
  currentItem: number;
  totalItems: number;
  onPrevious?: () => void;
  onNext?: () => void;
}

export interface IdsAlertLink {
  label: string;
  href?: string;
}

export interface IdsAlertBaseProps {
  message: string;
  /** Preferred link contract (design-spec). */
  link?: IdsAlertLink;
  /** Convenience aliases matching Storybook Alert examples. */
  linkLabel?: string;
  linkHref?: string;
  onLinkClick?: (event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
  actionLabel?: string;
  onAction?: () => void;
  dismissible?: boolean;
  onDismiss?: () => void;
}

export type IdsAlertProps =
  | (IdsAlertBaseProps & {
      display: "global";
      severity?: IdsAlertGlobalSeverity;
      carousel?: IdsAlertCarouselProps;
      title?: never;
      density?: never;
    })
  | (IdsAlertBaseProps & {
      display: "inline";
      severity?: IdsAlertInlineSeverity;
      title?: string;
      density?: "compact" | "detailed";
      carousel?: never;
    });

const globalSeverityToIcon: Record<
  IdsAlertGlobalSeverity,
  { shape: string; variant: "img" | "mask" | "inline"; color?: string }
> = {
  critical: { shape: "status-critical-square-solid-ko", variant: "img" },
  "warning-major": {
    shape: "status-error-diamond-solid-ko",
    variant: "mask",
    color: "var(--color-icon-gray-white)",
  },
  "warning-minor": { shape: "status-warn-tri-solid", variant: "inline" },
  informational: { shape: "info-circ-solid-ko", variant: "img" },
};

const inlineSeverityToIcon: Record<IdsAlertInlineSeverity, string> = {
  informational: "info-circ-solid",
  success: "status-ok-circ-solid",
  "warning-minor": "status-warn-tri-solid",
  "warning-major": "status-error-diamond-solid",
  critical: "status-critical-square-solid",
};

function resolveLink(props: IdsAlertBaseProps): IdsAlertLink | undefined {
  if (props.link?.label) return props.link;
  if (props.linkLabel) {
    return { label: props.linkLabel, href: props.linkHref };
  }
  return undefined;
}

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export function IdsAlert(props: IdsAlertProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  if (props.display === "global") {
    return (
      <IdsAlertGlobalView {...props} onInternalDismiss={() => setDismissed(true)} />
    );
  }

  return (
    <IdsAlertInlineView {...props} onInternalDismiss={() => setDismissed(true)} />
  );
}

function IdsAlertGlobalView(
  props: Extract<IdsAlertProps, { display: "global" }> & {
    onInternalDismiss: () => void;
  },
) {
  const {
    severity = "critical",
    message,
    onLinkClick,
    actionLabel,
    onAction,
    dismissible,
    onDismiss,
    carousel,
    onInternalDismiss,
  } = props;

  const link = resolveLink(props);
  const showAction = Boolean(actionLabel);
  const showLink = Boolean(link?.label);
  const showCarousel = Boolean(carousel);
  const showDismiss =
    (dismissible ?? true) &&
    (severity !== "critical" || (showCarousel && !showAction));
  const counterText =
    showCarousel && carousel
      ? `${Math.max(1, carousel.currentItem)} of ${Math.max(1, carousel.totalItems)}`
      : "";
  const icon = globalSeverityToIcon[severity];

  return (
    <section
      className={styles["ids-alert-global"]}
      data-ids="ids-alert"
      data-display="global"
      data-severity={severity}
      role="alert"
      aria-live="assertive"
      data-carousel={showCarousel ? "true" : "false"}
    >
      {showCarousel && carousel ? (
        <div className={styles["ids-alert-global-carousel-rail"]}>
          <button
            type="button"
            className={styles["ids-alert-global-carousel-button"]}
            aria-label="Previous alert"
            onClick={carousel.onPrevious}
          >
            <IdsIcon
              shape="chev-left-16"
              variant="img"
              size={12}
              className={styles["ids-alert-global-carousel-chevron"]}
            />
          </button>
          <span className={styles["ids-alert-global-carousel-count"]}>{counterText}</span>
          <button
            type="button"
            className={styles["ids-alert-global-carousel-button"]}
            aria-label="Next alert"
            onClick={carousel.onNext}
          >
            <IdsIcon
              shape="chev-right-16"
              variant="img"
              size={12}
              className={styles["ids-alert-global-carousel-chevron"]}
            />
          </button>
        </div>
      ) : null}

      <div className={styles["ids-alert-global-content"]}>
        <div className={styles["ids-alert-global-icon-wrap"]}>
          <IdsIcon
            shape={icon.shape}
            variant={icon.variant}
            color={icon.color}
            size={16}
            className={styles["ids-alert-global-icon"]}
          />
        </div>
        <p className={styles["ids-alert-global-message"]}>
          {message}
          {showLink ? " " : null}
          {showLink && link ? (
            link.href ? (
              <a
                href={link.href}
                className={styles["ids-alert-global-link"]}
                onClick={onLinkClick}
              >
                {link.label}
              </a>
            ) : (
              <button
                type="button"
                className={styles["ids-alert-global-link-button"]}
                onClick={onLinkClick}
              >
                {link.label}
              </button>
            )
          ) : null}
        </p>
      </div>

      <div
        className={styles["ids-alert-global-actions"]}
        data-has-action={showAction ? "true" : "false"}
      >
        {showAction ? (
          <button
            type="button"
            className={styles["ids-alert-global-action"]}
            onClick={onAction}
          >
            {actionLabel}
          </button>
        ) : null}
        {showDismiss ? (
          <button
            type="button"
            className={styles["ids-alert-global-dismiss"]}
            aria-label="Dismiss alert"
            onClick={() => {
              onInternalDismiss();
              onDismiss?.();
            }}
          >
            <IdsIcon
              shape="shape-x"
              variant="mask"
              size={12}
              className={styles["ids-alert-global-dismiss-icon"]}
            />
          </button>
        ) : null}
      </div>
    </section>
  );
}

function IdsAlertInlineView(
  props: Extract<IdsAlertProps, { display: "inline" }> & {
    onInternalDismiss: () => void;
  },
) {
  const {
    severity = "informational",
    message,
    title,
    density = "compact",
    onLinkClick,
    actionLabel,
    onAction,
    dismissible,
    onDismiss,
    onInternalDismiss,
  } = props;

  const link = resolveLink(props);
  const showTitle = density === "detailed" && Boolean(title);
  const showLink = Boolean(link?.label);
  const showAction = Boolean(actionLabel);
  const showDismiss = (dismissible ?? true) && severity !== "critical";
  const densityClass =
    density === "detailed"
      ? styles["ids-alert-inline--detailed"]
      : styles["ids-alert-inline--compact"];
  const actionInTitleRow = showTitle && showAction;
  const showTrailing = (!showTitle && showAction) || showDismiss;

  const actionButton = showAction ? (
    <button
      type="button"
      className={styles["ids-alert-inline-action"]}
      onClick={onAction}
    >
      {actionLabel}
    </button>
  ) : null;

  return (
    <div
      className={cx(styles["ids-alert-inline"], densityClass)}
      data-ids="ids-alert"
      data-display="inline"
      data-severity={severity}
      data-density={density}
      role="alert"
    >
      <div className={styles["ids-alert-inline-main"]}>
        <span className={styles["ids-alert-inline-icon-wrap"]}>
          <IdsIcon
            shape={inlineSeverityToIcon[severity]}
            variant="img"
            size={16}
            className={styles["ids-alert-inline-icon"]}
          />
        </span>
        <div className={styles["ids-alert-inline-text"]}>
          {showTitle ? (
            <div className={styles["ids-alert-inline-title-row"]}>
              <p className={styles["ids-alert-inline-title"]}>{title}</p>
              {actionInTitleRow ? actionButton : null}
            </div>
          ) : null}
          <p className={styles["ids-alert-inline-message"]}>
            {message}
            {showLink ? " " : null}
            {showLink && link ? (
              link.href ? (
                <a
                  href={link.href}
                  className={styles["ids-alert-inline-link"]}
                  onClick={onLinkClick}
                >
                  {link.label}
                </a>
              ) : (
                <button
                  type="button"
                  className={styles["ids-alert-inline-link-button"]}
                  onClick={onLinkClick}
                >
                  {link.label}
                </button>
              )
            ) : null}
          </p>
        </div>
      </div>
      {showTrailing ? (
        <div
          className={styles["ids-alert-inline-trailing"]}
          data-has-action={!showTitle && showAction ? "true" : "false"}
        >
          {!showTitle && showAction ? actionButton : null}
          {showDismiss ? (
            <button
              type="button"
              className={styles["ids-alert-inline-dismiss"]}
              onClick={() => {
                onInternalDismiss();
                onDismiss?.();
              }}
              aria-label="Dismiss alert"
            >
              <IdsIcon
                shape="shape-x"
                variant="img"
                size={12}
                className={styles["ids-alert-inline-dismiss-icon"]}
              />
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export default IdsAlert;
