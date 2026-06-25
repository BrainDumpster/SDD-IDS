import { useState } from "react";
import { Icon } from "./Icon";
import styles from "./Alert.module.css";

export type AlertDisplay = "global" | "inline";

/** Global banner severities (Figma global alert matrix). */
export type AlertGlobalSeverity =
  | "critical"
  | "warning-major"
  | "warning-minor"
  | "informational";

/** Inline adds success (slate treatment). */
export type AlertInlineSeverity = AlertGlobalSeverity | "success";

export type AlertSeverityFor<D extends AlertDisplay> = D extends "global"
  ? AlertGlobalSeverity
  : AlertInlineSeverity;

export interface AlertCarouselProps {
  currentItem: number;
  totalItems: number;
  onPrevious?: () => void;
  onNext?: () => void;
}

export interface AlertBaseProps {
  message: string;
  linkLabel?: string;
  linkHref?: string;
  onLinkClick?: () => void;
  actionLabel?: string;
  onAction?: () => void;
  dismissible?: boolean;
  onDismiss?: () => void;
}

export type AlertProps =
  | (AlertBaseProps & {
      display: "global";
      severity?: AlertGlobalSeverity;
      carousel?: AlertCarouselProps;
      title?: never;
      density?: never;
    })
  | (AlertBaseProps & {
      display: "inline";
      severity?: AlertInlineSeverity;
      title?: string;
      density?: "compact" | "detailed";
      carousel?: never;
    });

const globalSeverityToIcon: Record<AlertGlobalSeverity, string> = {
  critical: "status-critical-square-solid-ko",
  "warning-major": "status-error-diamond-solid-ko",
  "warning-minor": "status-warn-tri-solid",
  informational: "info-circ-solid-ko",
};

const globalSeverityToIconVariant: Record<AlertGlobalSeverity, "img" | "mask" | "inline"> = {
  critical: "img",
  "warning-major": "mask",
  "warning-minor": "inline",
  informational: "img",
};

const globalSeverityToIconColor: Partial<Record<AlertGlobalSeverity, string>> = {
  "warning-major": "var(--color-icon-white)",
};

const inlineSeverityToIcon: Record<AlertInlineSeverity, string> = {
  informational: "info-circ-solid",
  success: "status-ok-circ-solid",
  "warning-minor": "status-warn-tri-solid",
  "warning-major": "status-error-diamond-solid",
  critical: "status-critical-square-solid",
};

export function Alert(props: AlertProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  if (props.display === "global") {
    return <AlertGlobalView {...props} onInternalDismiss={() => setDismissed(true)} />;
  }

  return <AlertInlineView {...props} onInternalDismiss={() => setDismissed(true)} />;
}

function AlertGlobalView(
  props: Extract<AlertProps, { display: "global" }> & {
    onInternalDismiss: () => void;
  }
) {
  const {
    severity = "critical",
    message,
    linkLabel,
    linkHref,
    onLinkClick,
    actionLabel,
    onAction,
    dismissible,
    onDismiss,
    carousel,
    onInternalDismiss,
  } = props;

  const showAction = Boolean(actionLabel);
  const showLink = Boolean(linkLabel);
  const showCarousel = Boolean(carousel);
  const showDismiss = dismissible ?? (severity !== "critical" || showAction);
  const counterText =
    showCarousel && carousel
      ? `${Math.max(1, carousel.currentItem)} of ${Math.max(1, carousel.totalItems)}`
      : "";

  return (
    <section
      className={styles.globalRoot}
      data-severity={severity}
      role="alert"
      aria-live="assertive"
      data-carousel={showCarousel ? "true" : "false"}
    >
      {showCarousel && carousel ? (
        <div className={styles.globalCarouselRail}>
          <button
            type="button"
            className={styles.globalCarouselButton}
            aria-label="Previous alert"
            onClick={carousel.onPrevious}
          >
            <Icon shapeName="chev-left-16" variant="img" className={styles.globalCarouselChevron} />
          </button>
          <span className={styles.globalCarouselCount}>{counterText}</span>
          <button
            type="button"
            className={styles.globalCarouselButton}
            aria-label="Next alert"
            onClick={carousel.onNext}
          >
            <Icon shapeName="chev-right-16" variant="img" className={styles.globalCarouselChevron} />
          </button>
        </div>
      ) : null}

      <div className={styles.globalContent}>
        <div className={styles.globalIconWrap}>
          <Icon
            shapeName={globalSeverityToIcon[severity]}
            variant={globalSeverityToIconVariant[severity]}
            color={globalSeverityToIconColor[severity]}
            className={styles.globalIcon}
          />
        </div>
        <p className={styles.globalMessage}>
          {message}
          {showLink ? " " : null}
          {showLink ? (
            linkHref ? (
              <a href={linkHref} className={styles.globalLink} onClick={onLinkClick}>
                {linkLabel}
              </a>
            ) : (
              <button type="button" className={styles.globalLinkButton} onClick={onLinkClick}>
                {linkLabel}
              </button>
            )
          ) : null}
        </p>
      </div>

      <div className={styles.globalActions}>
        {showAction ? (
          <button type="button" className={styles.globalActionButton} onClick={onAction}>
            {actionLabel}
          </button>
        ) : null}
        {showDismiss ? (
          <button
            type="button"
            className={styles.globalDismissButton}
            aria-label="Dismiss alert"
            onClick={() => {
              onInternalDismiss();
              onDismiss?.();
            }}
          >
            <Icon shapeName="shape-x" variant="img" className={styles.globalDismissIcon} />
          </button>
        ) : null}
      </div>
    </section>
  );
}

function AlertInlineView(
  props: Extract<AlertProps, { display: "inline" }> & {
    onInternalDismiss: () => void;
  }
) {
  const {
    severity = "informational",
    message,
    title,
    density = "compact",
    linkLabel,
    linkHref,
    onLinkClick,
    actionLabel,
    onAction,
    dismissible,
    onDismiss,
    onInternalDismiss,
  } = props;

  const showTitle = density === "detailed" && Boolean(title);
  const showLink = Boolean(linkLabel);
  const showAction = Boolean(actionLabel);
  const showDismiss = dismissible ?? (severity !== "critical" || !showAction);

  const densityClass =
    density === "detailed" ? styles.inlineDensityDetailed : styles.inlineDensityCompact;
  const showTrailing = showAction || showDismiss;

  return (
    <div
      className={[styles.inlineRoot, densityClass].filter(Boolean).join(" ")}
      data-severity={severity}
      data-density={density}
      role="alert"
    >
      <div className={styles.inlineMain}>
        <span className={styles.inlineIconWrap}>
          <Icon
            shapeName={inlineSeverityToIcon[severity]}
            variant="img"
            className={styles.inlineIcon}
          />
        </span>
        <div className={styles.inlineText}>
          {showTitle ? <p className={styles.inlineTitle}>{title}</p> : null}
          <p className={styles.inlineMessage}>
            {message}
            {showLink ? " " : null}
            {showLink ? (
              linkHref ? (
                <a href={linkHref} className={styles.inlineLink} onClick={onLinkClick}>
                  {linkLabel}
                </a>
              ) : (
                <button type="button" className={styles.inlineLinkButton} onClick={onLinkClick}>
                  {linkLabel}
                </button>
              )
            ) : null}
          </p>
        </div>
      </div>
      {showTrailing ? (
        <div
          className={styles.inlineTrailing}
          data-has-action={showAction ? "true" : "false"}
        >
          {showAction ? (
            <button
              type="button"
              className={styles.inlineActionOutlined}
              onClick={onAction}
            >
              {actionLabel}
            </button>
          ) : null}
          {showDismiss ? (
            <button
              type="button"
              className={styles.inlineClose}
              onClick={() => {
                onInternalDismiss();
                onDismiss?.();
              }}
              aria-label="Dismiss alert"
            >
              <Icon shapeName="shape-x" variant="img" className={styles.inlineCloseIcon} />
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
