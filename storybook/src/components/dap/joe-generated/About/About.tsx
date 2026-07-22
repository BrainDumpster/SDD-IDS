import React, { forwardRef, KeyboardEvent } from "react";
import "./About.css";

export interface AboutProps {
  /** Application name */
  appName?: string;
  /** Application version */
  version?: string;
  /** Description text */
  description?: string;
  /** System information */
  systemInfo?: string;
  /** Legal/copyright text */
  legalText?: string;
  /** Links to resources */
  links?: Array<{ label: string; href: string }>;
  /** Close button callback */
  onClose?: () => void;
  /** Variant */
  variant?: "default" | "modal" | "inline" | "minimal" | "detailed" | "branded" | "with-updates" | "with-support";
  /** Logo icon slug */
  logoSlug?: string;
  /** ARIA label */
  "aria-label"?: string;
}

const About = forwardRef<HTMLDivElement, AboutProps>(
  (
    {
      appName = "Application",
      version = "1.0.0",
      description = "Application description",
      systemInfo = "",
      legalText = "© 2024 Company. All rights reserved.",
      links = [],
      onClose,
      variant = "default",
      logoSlug,
      "aria-label": ariaLabel = "About",
      ...rest
    },
    ref
  ) => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && onClose) {
        onClose();
      }
    };

    return (
      <div
        ref={ref}
        className={["about", `about--${variant}`].filter(Boolean).join(" ")}
        role="dialog"
        aria-label={ariaLabel}
        aria-modal={variant === "modal"}
        onKeyDown={handleKeyDown}
        {...rest}
      >
        {onClose && (
          <button
            className="about__close"
            aria-label="Close"
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        )}

        <div className="about__header">
          {logoSlug && (
            <div className="about__logo" aria-hidden="true">
              <img src={`/assets/icons/${logoSlug}.svg`} alt="" width={64} height={64} />
            </div>
          )}
          <h1 className="about__app-name">{appName}</h1>
          {version && <p className="about__version">Version {version}</p>}
        </div>

        <div className="about__content">
          {description && <p className="about__description">{description}</p>}

          {systemInfo && (
            <div className="about__section">
              <h6 className="about__section-header">System Information</h6>
              <p className="about__system-info">{systemInfo}</p>
            </div>
          )}

          {links.length > 0 && (
            <div className="about__section">
              <h6 className="about__section-header">Resources</h6>
              <ul className="about__links">
                {links.map((link, index) => (
                  <li key={index}>
                    <a href={link.href} className="about__link" target="_blank" rel="noopener noreferrer">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {legalText && (
          <div className="about__footer">
            <p className="about__legal">{legalText}</p>
          </div>
        )}
      </div>
    );
  }
);

About.displayName = "About";
export default About;
