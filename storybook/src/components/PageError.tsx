import type { ReactNode } from "react";
import { Button } from "./Button";
import { Icon } from "./Icon";
import styles from "./PageError.module.css";

export interface PageErrorAction {
  label: string;
  onAction: () => void;
}

export interface PageErrorProps {
  /** Primary error heading (e.g. "Something went wrong"). */
  errorName: string;
  /** Secondary error code or status (e.g. "Error 500"). */
  errorCode?: string;
  /** Body text explaining the probable cause. */
  probableCause?: string;
  /** Guidance on how to resolve the error. */
  resolutions?: string;
  /** Optional action button label and callback. */
  action?: PageErrorAction;
  /** Controls visibility of the resolution section. Defaults to true when resolutions or action is provided. */
  showResolution?: boolean;
  /** Icon slug from assets/icons/<slug>.svg. Defaults to "state-error". */
  iconName?: string;
  /** Additional CSS class for the root. */
  className?: string;
  /** Optional content override used for visual QA only (slots map to Figma placeholder text). */
  children?: ReactNode;
}

export function PageError({
  errorName,
  errorCode,
  probableCause,
  resolutions,
  action,
  showResolution = Boolean(resolutions || action),
  iconName = "state-error",
  className,
  children,
}: PageErrorProps) {
  return (
    <section
      className={[styles.root, className].filter(Boolean).join(" ")}
      aria-labelledby="page-error-name"
    >
      <div className={styles.iconSlot} aria-hidden="true">
        <Icon shapeName={iconName} color="var(--color-icon-disabled, #757575)" style={{ width: 80, height: 80 }} />
      </div>
      <div className={styles.content}>
        {children || (
          <>
            <h1 id="page-error-name" className={styles.errorName}>
              {errorName}
            </h1>
            {errorCode && <p className={styles.errorCode}>{errorCode}</p>}
            {probableCause && <p className={styles.probableCause}>{probableCause}</p>}
            {showResolution && (resolutions || action) && (
              <div className={styles.resolutionSection}>
                {resolutions && <p className={styles.resolutions}>{resolutions}</p>}
                {action && (
                  <Button variant="secondary" size="lg" onClick={action.onAction}>
                    {action.label}
                  </Button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
