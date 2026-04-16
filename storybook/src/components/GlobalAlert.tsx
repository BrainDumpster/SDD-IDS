import { useState } from "react";
import infoIconSolid from "../../../assets/icons/info-circ-solid.svg?url";
import criticalIconSolid from "../../../assets/icons/status-critical-square-solid.svg?url";
import majorIconSolid from "../../../assets/icons/status-error-diamond-solid.svg?url";
import minorIconSolid from "../../../assets/icons/status-warn-tri-solid.svg?url";
import shapeXIcon from "../../../assets/icons/shape-x.svg?url";
import chevLeftIcon from "../../../assets/icons/chev-left-16.svg?url";
import chevRightIcon from "../../../assets/icons/chev-right-16.svg?url";
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

const severityToIconName: Record<GlobalAlertSeverity, string> = {
  critical: "status-critical-square",
  "warning-major": "status-error-diamond",
  "warning-minor": "status-warn-tri",
  informational: "info-circ",
};

const iconAssetByName: Record<string, string> = {
  // Keep canonical names requested for design-spec/codegen, but use
  // the visible solid assets in Storybook so icons don't blend into
  // same-color alert backgrounds.
  "status-critical-square": criticalIconSolid,
  "status-error-diamond": majorIconSolid,
  "status-warn-tri": minorIconSolid,
  "info-circ": infoIconSolid,
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
            <img src={chevLeftIcon} alt="" aria-hidden="true" className={styles.carouselChevron} />
          </button>
          <span className={styles.carouselCount}>{counterText}</span>
          <button
            type="button"
            className={styles.carouselButton}
            aria-label="Next alert"
            onClick={carousel.onNext}
          >
            <img src={chevRightIcon} alt="" aria-hidden="true" className={styles.carouselChevron} />
          </button>
        </div>
      ) : null}

      <div className={styles.content}>
        <div className={styles.iconWrap}>
          <img
            src={iconAssetByName[severityToIconName[severity]]}
            alt=""
            aria-hidden="true"
            className={styles.icon}
          />
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
            <img src={shapeXIcon} alt="" aria-hidden="true" className={styles.dismissIcon} />
          </button>
        ) : null}
      </div>
    </section>
  );
}
