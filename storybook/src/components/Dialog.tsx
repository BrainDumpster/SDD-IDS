import { Dialog as BaseDialog } from "@base-ui-components/react/dialog";
import type { ReactNode } from "react";
import styles from "./Dialog.module.css";
import { Button } from "./Button";

type DialogType = "None" | "Success" | "Warning" | "Major" | "Danger" | "Info";
type DialogSize = "sm" | "lg" | "xl";

interface DialogProps {
  trigger: ReactNode;

  // Visibility
  openDidalog?: boolean; // initial open in uncontrolled dialog demo

  // Header
  dialogTitle: string;
  dialogType?: DialogType;
  dialogSize?: DialogSize;
  dialogClosable?: boolean;
  description?: string;
  children?: ReactNode;

  // Footer buttons
  primaryButtonName: string;
  enableActionButton?: boolean;
  tertiaryButtonName?: string;
  enableTertiaryButtton?: boolean;

  // Events
  onClose?: () => void;
  onPrimaryButtonClick?: () => void;
  onTertiaryButtonClick?: () => void;
}

export function Dialog({
  trigger,
  openDidalog = false,
  dialogTitle,
  dialogType = "None",
  dialogSize = "lg",
  dialogClosable = true,
  description,
  children,
  primaryButtonName,
  enableActionButton = true,
  tertiaryButtonName,
  enableTertiaryButtton = true,
  onClose,
  onPrimaryButtonClick,
  onTertiaryButtonClick,
}: DialogProps) {
  return (
    <BaseDialog.Root defaultOpen={openDidalog}>
      <BaseDialog.Trigger className={styles.triggerReset}>
        {trigger}
      </BaseDialog.Trigger>
      <BaseDialog.Portal>
        <BaseDialog.Backdrop className={styles.backdrop} />
        <BaseDialog.Popup className={`${styles.popup} ${styles[dialogSize]}`}>
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              {dialogType !== "None" && (
                <span
                  className={styles.alertIcon}
                  aria-hidden="true"
                  style={{ color: getDialogTypeIconColor(dialogType) }}
                >
                  <DialogTypeIcon type={dialogType} />
                </span>
              )}
              <BaseDialog.Title className={styles.title}>
                {dialogTitle}
              </BaseDialog.Title>
            </div>

            {dialogClosable && (
              <BaseDialog.Close
                className={styles.close}
                aria-label="Close"
                onClick={() => onClose?.()}
              >
                <CloseIcon />
              </BaseDialog.Close>
            )}
          </div>

          {description && (
            <BaseDialog.Description className={styles.description}>
              {description}
            </BaseDialog.Description>
          )}

          {children && <div className={styles.body}>{children}</div>}

          <div className={styles.footer}>
            {tertiaryButtonName && (
              <Button
                variant="tertiary"
                disabled={!enableTertiaryButtton}
                onClick={() => onTertiaryButtonClick?.()}
              >
                {tertiaryButtonName}
              </Button>
            )}
            <Button
              variant="primary"
              disabled={!enableActionButton}
              onClick={() => onPrimaryButtonClick?.()}
            >
              {primaryButtonName}
            </Button>
          </div>
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M12 4L4 12M4 4L12 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function DialogTypeIcon({ type }: { type: Exclude<DialogType, "None"> }) {
  if (type === "Success") {
    // status-ok-circ-solid (simple check-circle)
    return (
      <svg className={styles.typeIcon} viewBox="0 0 16 16" aria-hidden="true">
        <circle cx="8" cy="8" r="7" fill="currentColor" opacity="0.15" />
        <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" />
        <path
          d="M4.3 8.2 6.9 10.7 11.8 5.6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (type === "Warning") {
    // status-warn-tri-solid (triangle)
    return (
      <svg className={styles.typeIcon} viewBox="0 0 16 16" aria-hidden="true">
        <path
          d="M8 1.3 15 14.2H1z"
          fill="currentColor"
          opacity="0.15"
          stroke="currentColor"
        />
        <path
          d="M8 5.2v4.6M8 11.9h.01"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (type === "Major") {
    // Use a diamond-like icon for Major
    return (
      <svg className={styles.typeIcon} viewBox="0 0 16 16" aria-hidden="true">
        <path
          d="M8 1.6 14.4 8 8 14.4 1.6 8z"
          fill="currentColor"
          opacity="0.15"
          stroke="currentColor"
        />
      </svg>
    );
  }

  if (type === "Danger") {
    // status-critical-square-solid (square)
    return (
      <svg className={styles.typeIcon} viewBox="0 0 16 16" aria-hidden="true">
        <rect
          x="2"
          y="2"
          width="12"
          height="12"
          rx="2"
          fill="currentColor"
          opacity="0.15"
          stroke="currentColor"
        />
        <path
          d="M5.2 5.2 10.8 10.8M10.8 5.2 5.2 10.8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  // Info
  return (
    <svg className={styles.typeIcon} viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="8" cy="8" r="7" fill="currentColor" opacity="0.15" stroke="currentColor" />
      <path
        d="M8 7v4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <circle cx="8" cy="4.8" r="1" fill="currentColor" />
    </svg>
  );
}

function getDialogTypeIconColor(type: DialogType): string {
  switch (type) {
    case "Success":
      return "var(--color-icon-alerting-success-1)";
    case "Warning":
      return "var(--color-icon-alerting-minor-1)";
    case "Major":
      return "var(--color-border-alerting-major-major)";
    case "Danger":
      return "var(--color-icon-alerting-critical)";
    case "Info":
      return "var(--color-icon-brand-base)";
    default:
      return "var(--color-icon-neutral)";
  }
}
