import { useState } from "react";
import { Icon } from "./Icon";
import styles from "./GlobalAlert.module.css";

export type GlobalAlertSeverity =
  | "critical"
  | "warning-major"
  | "warning-minor"
  | "informational";

export interface GlobalAlertCarouselProps {
  currentItem: number;
  totalItems: number;
  onPrevious?: () => void;
  onNext?: () => void;
}

export interface GlobalAlertProps {
  severity?: GlobalAlertSeverity;
  message: string;
  linkLabel?: string;
  linkHref?: string;
  onLinkClick?: () => void;
  actionLabel?: string;
  /** Emitted when the optional action button is clicked. */
  onAction?: () => void;
  dismissible?: boolean;
  onDismiss?: () => void;
  carousel?: GlobalAlertCarouselProps;
}

/** Canonical `shapeName` values; assets resolve under `assets/icons/<slug>.svg`. */
const severityToIconName: Record<GlobalAlertSeverity, string> = {
  critical: "status-critical-square",
  "warning-major": "status-error-diamond",
  "warning-minor": "status-warn-tri",
  informational: "info-circ",
};

export function GlobalAlert({
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
}: GlobalAlertProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const showAction = Boolean(actionLabel);
  const showLink = Boolean(linkLabel);
  const showCarousel = Boolean(carousel);
  const showDismiss = dismissible ?? (severity !== "critical" || showAction);
  const counterText = showCarousel && carousel
    ? `${Math.max(1, carousel.currentItem)} of ${Math.max(1, carousel.totalItems)}`
    : "";

  return (
    <section
      className={[styles.banner, styles[severity]].join(" ")}
      role="alert"
      aria-live="assertive"
      data-carousel={showCarousel ? "true" : "false"}
    >
      {showCarousel && carousel ? (
        <div className={styles.carouselRail}>
          <button
            type="button"
            className={styles.carouselButton}
            aria-label="Previous alert"
            onClick={carousel.onPrevious}
          >
            <Icon shapeName="chev-left-16" variant="img" className={styles.carouselChevron} />
          </button>
          <span className={styles.carouselCount}>{counterText}</span>
          <button
            type="button"
            className={styles.carouselButton}
            aria-label="Next alert"
            onClick={carousel.onNext}
          >
            <Icon shapeName="chev-right-16" variant="img" className={styles.carouselChevron} />
          </button>
        </div>
      ) : null}

      <div className={styles.content}>
        <div className={styles.iconWrap}>
          <Icon shapeName={severityToIconName[severity]} variant="img" className={styles.icon} />
        </div>
        <p className={styles.message}>
          {message}
          {showLink ? " " : null}
          {showLink ? (
            linkHref ? (
              <a href={linkHref} className={styles.link} onClick={onLinkClick}>
                {linkLabel}
              </a>
            ) : (
              <button type="button" className={styles.linkButton} onClick={onLinkClick}>
                {linkLabel}
              </button>
            )
          ) : null}
        </p>
      </div>

      <div className={styles.actions}>
        {showAction ? (
          <button type="button" className={styles.actionButton} onClick={onAction}>
            {actionLabel}
          </button>
        ) : null}
        {showDismiss ? (
          <button
            type="button"
            className={styles.dismissButton}
            aria-label="Dismiss alert"
            onClick={() => {
              setDismissed(true);
              onDismiss?.();
            }}
          >
            <Icon shapeName="shape-x" variant="img" className={styles.dismissIcon} />
          </button>
        ) : null}
      </div>
    </section>
  );
}
