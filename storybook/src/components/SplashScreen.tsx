import React, { type ReactNode, type ComponentProps } from "react";
import { Icon } from "./Icon";
import styles from "./SplashScreen.module.css";

export type SplashScreenVariant =
  | "default"
  | "minimal"
  | "with-progress"
  | "with-animation"
  | "with-skip"
  | "with-version"
  | "interactive";

export interface SplashScreenProps extends ComponentProps<"section"> {
  /** Application name shown as the splash title. */
  appName: string;
  /** Optional branded logo node. */
  logo?: ReactNode;
  /** Optional logo URL (e.g. imported SVG). */
  logoSrc?: string;
  /** Optional status/loading text below the spinner. */
  statusText?: string;
  /** Optional version string shown at the bottom. */
  version?: string;
  /** Optional progress value 0–100; triggers the progress bar. */
  progress?: number;
  /** Optional skip-to-content label. */
  skipLabel?: string;
  /** Optional skip-to-content callback. */
  onSkip?: () => void;
  /** Optional interactive action label. */
  interactiveLabel?: string;
  /** Optional interactive action callback. */
  onInteractive?: () => void;
  /** Whether to animate the logo. */
  animated?: boolean;
  /** Variant preset for the splash screen. */
  variant?: SplashScreenVariant;
  /** Accessible label for the splash region. */
  ariaLabel?: string;
}

const DEFAULT_LOGO = (
  <Icon
    shapeName="logo-delltech-stacked-white"
    variant="img"
    style={{ width: 120, height: 120 }}
  />
);

function clampProgress(value: number | undefined): number | undefined {
  if (value === undefined) return undefined;
  return Math.min(100, Math.max(0, value));
}

export function SplashScreen({
  appName,
  logo,
  logoSrc,
  statusText = "Loading...",
  version,
  progress,
  skipLabel = "Skip to content",
  onSkip,
  interactiveLabel = "Continue",
  onInteractive,
  animated = false,
  variant = "default",
  children,
  className,
  ariaLabel,
  ...rest
}: SplashScreenProps) {
  const resolvedProgress = clampProgress(progress);
  const resolvedVersion = version ?? "Version 1.0.0";
  const resolvedAriaLabel = ariaLabel ?? `${appName} splash screen`;

  const isMinimal = variant === "minimal";
  const shouldAnimate = variant === "with-animation" || animated;
  const shouldShowProgress = variant === "with-progress" || resolvedProgress !== undefined;
  const shouldShowVersion = variant === "with-version" || version !== undefined;
  const shouldShowSkip = variant === "with-skip" || onSkip !== undefined;
  const shouldShowInteractive = variant === "interactive" || onInteractive !== undefined;

  const logoNode =
    logo ??
    (logoSrc ? (
      <img src={logoSrc} alt="" className={styles.logo} aria-hidden="true" />
    ) : (
      DEFAULT_LOGO
    ));

  const logoClassName = [styles.logo, shouldAnimate ? styles.logoAnimated : ""]
    .filter(Boolean)
    .join(" ");

  const resolvedLogo =
    typeof logoNode === "object" && logoNode !== null ? (
      <div className={logoClassName}>{logoNode}</div>
    ) : (
      <span className={logoClassName}>{logoNode}</span>
    );

  const progressValue = resolvedProgress ?? 0;
  const isIndeterminate = resolvedProgress === undefined && shouldShowProgress;

  return (
    <section
      {...rest}
      className={[styles.root, className].filter(Boolean).join(" ")}
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={resolvedAriaLabel}
    >
      <div className={styles.content}>
        {resolvedLogo}
        <h1 className={styles.appName}>{appName}</h1>

        {!isMinimal && (
          <>
            <div className={styles.spinner} aria-hidden="true" />
            <p className={styles.statusText}>{statusText}</p>
          </>
        )}

        {shouldShowProgress && (
          <div
            className={styles.progressTrack}
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={isIndeterminate ? undefined : progressValue}
            aria-label="Loading progress"
          >
            {isIndeterminate ? (
              <div className={styles.progressFillIndeterminate} />
            ) : (
              <div
                className={styles.progressFill}
                style={{ width: `${progressValue}%` }}
              />
            )}
          </div>
        )}

        {shouldShowVersion && <p className={styles.version}>{resolvedVersion}</p>}

        {shouldShowSkip && (
          <button
            type="button"
            className={styles.actionButton}
            onClick={onSkip ?? (() => {})}
          >
            {skipLabel}
          </button>
        )}

        {shouldShowInteractive && (
          <button
            type="button"
            className={styles.actionButton}
            onClick={onInteractive ?? (() => {})}
          >
            {interactiveLabel}
          </button>
        )}

        {children}
      </div>
    </section>
  );
}
