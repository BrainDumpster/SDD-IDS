import React from "react";
import "./Alert.css";

export interface AlertLink {
  label: string;
  href?: string;
  routerLink?: string | any[];
}

export interface AlertProps {
  display: "global" | "inline";
  message: string;
  severity?: "critical" | "warning-major" | "warning-minor" | "informational" | "success";
  link?: AlertLink;
  actionLabel?: string;
  onAction?: () => void;
  dismissible?: boolean;
  onDismiss?: () => void;
  onLinkClick?: () => void;
  title?: string;
  density?: "compact" | "detailed";
  carousel?: {
    currentItem: number;
    totalItems: number;
    onPrevious?: () => void;
    onNext?: () => void;
  };
}

const Alert: React.FC<AlertProps> = ({
  display,
  message,
  severity = "informational",
  link,
  actionLabel,
  onAction,
  dismissible = true,
  onDismiss,
  onLinkClick,
  title,
  density = "compact",
  carousel,
}) => {
  const showCarousel = carousel && carousel.totalItems > 1;
  const showAction = !!actionLabel;
  
  // Dismiss logic: critical shows dismiss only when carousel is present AND no action
  const showDismiss = dismissible && (severity !== "critical" || (showCarousel && !showAction));

  const getIconSlug = () => {
    switch (severity) {
      case "critical":
        return "status-critical-square-solid";
      case "warning-major":
        return "status-error-diamond-solid";
      case "warning-minor":
        return "status-warn-tri-solid";
      case "informational":
        return "info-circ-solid";
      case "success":
        return "status-ok-circ-solid";
      default:
        return "info-circ-solid";
    }
  };

  if (display === "inline") {
    return (
      <div
        className={`alert alert--inline alert--inline--${severity} alert--inline--${density}`}
        role="alert"
      >
        <div className="alert__inline-main">
          <div className="alert__inline-icon">
            <img src={`/assets/icons/${getIconSlug()}.svg`} alt="" width={16} height={16} />
          </div>
          <div className="alert__inline-text">
            {title && density === "detailed" && (
              <div className="alert__inline-title">
                {title}
                {showAction && density === "detailed" && (
                  <button
                    className="alert__action alert__action--inline-title"
                    onClick={onAction}
                    type="button"
                  >
                    {actionLabel}
                  </button>
                )}
              </div>
            )}
            <div className="alert__inline-message">
              {message}
              {link && (
                <a
                  href={link.href}
                  className="alert__inline-link"
                  onClick={onLinkClick}
                >
                  {link.label}
                </a>
              )}
            </div>
          </div>
        </div>
        {(showAction && density === "compact") || showDismiss ? (
          <div className="alert__inline-trailing">
            {showAction && density === "compact" && (
              <button
                className="alert__action alert__action--inline"
                onClick={onAction}
                type="button"
              >
                {actionLabel}
              </button>
            )}
            {showDismiss && (
              <button
                className="alert__dismiss alert__dismiss--inline"
                onClick={onDismiss}
                aria-label="Dismiss alert"
                type="button"
              >
                <svg width={12} height={12} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
                </svg>
              </button>
            )}
          </div>
        ) : null}
      </div>
    );
  }

  // Global display mode
  return (
    <div
      className={`alert alert--global alert--global--${severity}`}
      role="alert"
      aria-live="assertive"
      data-carousel={showCarousel}
      data-has-action={showAction}
    >
      {showCarousel && (
        <div className="alert__carousel-rail">
          <button
            className="alert__carousel-prev"
            onClick={carousel?.onPrevious}
            disabled={carousel?.currentItem === 1}
            aria-label="Previous alert"
            type="button"
          >
            <svg width={12} height={12} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 2L4 6L8 10" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <span className="alert__carousel-count">
            {carousel?.currentItem} / {carousel?.totalItems}
          </span>
          <button
            className="alert__carousel-next"
            onClick={carousel?.onNext}
            disabled={carousel?.currentItem === carousel?.totalItems}
            aria-label="Next alert"
            type="button"
          >
            <svg width={12} height={12} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 2L8 6L4 10" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      )}
      <div className="alert__global-content">
        <div className="alert__global-icon">
          <img src={`/assets/icons/${getIconSlug()}.svg`} alt="" width={16} height={16} />
        </div>
        <div className="alert__global-message">
          {message}
          {link && (
            <a
              href={link.href}
              className="alert__global-link"
              onClick={onLinkClick}
            >
              {link.label}
            </a>
          )}
        </div>
      </div>
      <div className="alert__global-actions">
        {showAction && (
          <button
            className="alert__action alert__action--global"
            onClick={onAction}
            type="button"
          >
            {actionLabel}
          </button>
        )}
        {showDismiss && (
          <button
            className="alert__dismiss alert__dismiss--global"
            onClick={onDismiss}
            aria-label="Dismiss alert"
            type="button"
          >
            <svg width={12} height={12} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;
