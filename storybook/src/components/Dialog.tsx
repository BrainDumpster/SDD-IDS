import { Dialog as BaseDialog } from "@base-ui-components/react/dialog";
import { isValidElement, type ReactNode, useEffect, useRef, useState } from "react";
import styles from "./Dialog.module.css";
import buttonStyles from "./Button.module.css";
import { Button } from "./Button";
import shapeXIcon from "../../../assets/icons/shape-x.svg";
import statusCriticalSquareSolidIcon from "../../../assets/icons/status-critical-square-solid.svg";
import statusWarnTriSolidIcon from "../../../assets/icons/status-warn-tri-solid.svg";
import statusErrorDiamondSolidIcon from "../../../assets/icons/status-error-diamond-solid.svg";
import infoCircSolidIcon from "../../../assets/icons/info-circ-solid.svg";

type DialogType =
  | "Non-Alerting"
  | "Informational"
  | "Warning"
  | "Major"
  | "Critical"
  | "Destructive"
  | "None"
  | "Info"
  | "Danger"
  | "Success";
type DialogSize = "sm" | "lg" | "xl";
export type DialogVariant = "default" | "about";

interface DialogProps {
  /** Use `about` for the Synapse About pattern (centered product line, optional slots in children). */
  variant?: DialogVariant;
  /** Omit when controlling visibility with `open` / `onOpenChange`. */
  trigger?: ReactNode;

  // Visibility
  openDidalog?: boolean; // initial open in uncontrolled dialog demo
  open?: boolean;
  onOpenChange?: (open: boolean) => void;

  // Header
  dialogTitle: string;
  dialogType?: DialogType;
  dialogSize?: DialogSize;
  dialogClosable?: boolean;
  description?: string;
  children?: ReactNode;

  // Footer buttons (labels are product/user-defined at runtime)
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
  variant = "default",
  trigger,
  openDidalog = false,
  open,
  onOpenChange,
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
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const [bodyScrollable, setBodyScrollable] = useState(false);
  const [showBodyScrollShadow, setShowBodyScrollShadow] = useState(false);

  const controlled = open !== undefined;
  if (!controlled && trigger == null) {
    throw new Error("Dialog: pass `trigger`, or use controlled mode with `open`.");
  }

  const showTertiary =
    variant !== "about" && Boolean(tertiaryButtonName);

  const popupClassName =
    variant === "about"
      ? `${styles.popup} ${styles.popupAbout}`
      : `${styles.popup} ${styles[dialogSize]}`;

  const triggerRender = trigger != null && isValidElement(trigger) ? (trigger as ReactNode) : undefined;

  useEffect(() => {
    const el = bodyRef.current;
    if (!el) {
      setBodyScrollable(false);
      setShowBodyScrollShadow(false);
      return;
    }

    const updateContentOverflow = () => {
      const scrollable = el.scrollHeight - el.clientHeight > 1;
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
      setBodyScrollable(scrollable);
      setShowBodyScrollShadow(scrollable && !atBottom);
    };

    updateContentOverflow();
    el.addEventListener("scroll", updateContentOverflow, { passive: true });

    const resizeObserver = new ResizeObserver(updateContentOverflow);
    resizeObserver.observe(el);
    if (el.firstElementChild instanceof HTMLElement) {
      resizeObserver.observe(el.firstElementChild);
    }

    return () => {
      el.removeEventListener("scroll", updateContentOverflow);
      resizeObserver.disconnect();
    };
  }, [children, description, dialogSize, dialogType, open, openDidalog, variant]);

  return (
    <BaseDialog.Root
      modal
      disablePointerDismissal={variant === "about"}
      open={controlled ? open : undefined}
      defaultOpen={controlled ? undefined : openDidalog}
      onOpenChange={(next) => onOpenChange?.(next)}
    >
      {trigger != null ? (
        triggerRender ? (
          <BaseDialog.Trigger className={styles.triggerReset} render={triggerRender} />
        ) : (
          <BaseDialog.Trigger className={styles.triggerReset}>{trigger}</BaseDialog.Trigger>
        )
      ) : null}
      <BaseDialog.Portal>
        <BaseDialog.Backdrop
          className={variant === "about" ? styles.backdropAbout : styles.backdrop}
        />
        <BaseDialog.Popup className={popupClassName}>
          {variant === "about" ? (
            <>
              <div className={styles.modalMainAbout}>
                <header className={styles.aboutHeader}>
                  <div className={styles.aboutHeaderSpacer} aria-hidden="true" />
                  {dialogClosable ? (
                    <div
                      className={styles.close}
                      role="button"
                      tabIndex={0}
                      aria-label="Close"
                      onClick={() => {
                        onClose?.();
                        onOpenChange?.(false);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          onClose?.();
                          onOpenChange?.(false);
                        }
                      }}
                    >
                      <DialogCloseGlyph />
                    </div>
                  ) : null}
                </header>
                <div className={styles.aboutBody}>
                  <BaseDialog.Title className={styles.aboutProductTitle}>
                    {dialogTitle}
                  </BaseDialog.Title>
                  {children}
                </div>
                <footer className={styles.aboutFooter}>
                  <BaseDialog.Close
                    className={[
                      buttonStyles.button,
                      buttonStyles.primary,
                      buttonStyles.lg,
                    ].join(" ")}
                    disabled={!enableActionButton}
                    onClick={() => onPrimaryButtonClick?.()}
                  >
                    {primaryButtonName}
                  </BaseDialog.Close>
                </footer>
              </div>
            </>
          ) : (
            <>
              <div className={styles.header}>
                <div className={styles.headerLeft}>
                  {normalizeDialogType(dialogType) !== "Non-Alerting" && (
                    <span
                      className={styles.alertIcon}
                      aria-hidden="true"
                    >
                      <DialogTypeIcon type={normalizeDialogType(dialogType)} />
                    </span>
                  )}
                  <BaseDialog.Title className={styles.title}>
                    {dialogTitle}
                  </BaseDialog.Title>
                </div>

                {dialogClosable && (
                  <div
                    className={styles.close}
                    role="button"
                    tabIndex={0}
                    aria-label="Close"
                    onClick={() => onClose?.()}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onClose?.();
                      }
                    }}
                  >
                    <DialogCloseGlyph />
                  </div>
                )}
              </div>

              {description ? (
                <BaseDialog.Description className={styles.description}>
                  {description}
                </BaseDialog.Description>
              ) : null}

              {children ? (
                <div
                  ref={bodyRef}
                  className={[
                    styles.body,
                    bodyScrollable ? styles.bodyScrollable : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {children}
                </div>
              ) : null}

              <div
                className={
                  showBodyScrollShadow
                    ? styles.contentScrollShadow
                    : styles.contentSeparator
                }
                aria-hidden="true"
              />

              <div className={styles.footer}>
                {showTertiary ? (
                  <Button
                    variant="tertiary"
                    disabled={!enableTertiaryButtton}
                    onClick={() => onTertiaryButtonClick?.()}
                  >
                    {tertiaryButtonName}
                  </Button>
                ) : null}
                <Button
                  variant={
                    normalizeDialogType(dialogType) === "Destructive"
                      ? "destructive"
                      : "primary"
                  }
                  disabled={!enableActionButton}
                  onClick={() => onPrimaryButtonClick?.()}
                >
                  {primaryButtonName}
                </Button>
              </div>
            </>
          )}
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
}

/** Canonical asset: `assets/icons/shape-x.svg` */
function DialogCloseGlyph() {
  return (
    <img
      src={shapeXIcon}
      alt=""
      className={styles.closeIcon}
      width={16}
      height={16}
      aria-hidden="true"
    />
  );
}

function DialogTypeIcon({
  type,
}: {
  type: "Informational" | "Warning" | "Major" | "Critical" | "Destructive";
}) {
  const iconByType = {
    Warning: statusWarnTriSolidIcon,
    Major: statusErrorDiamondSolidIcon,
    Critical: statusCriticalSquareSolidIcon,
    Destructive: statusCriticalSquareSolidIcon,
    Informational: infoCircSolidIcon,
  } as const;

  return (
    <img
      src={iconByType[type]}
      alt=""
      className={styles.typeIconImage}
      width={24}
      height={24}
      aria-hidden="true"
    />
  );
}

function normalizeDialogType(type: DialogType):
  | "Non-Alerting"
  | "Informational"
  | "Warning"
  | "Major"
  | "Critical"
  | "Destructive" {
  switch (type) {
    case "Info":
      return "Informational";
    case "Danger":
      return "Destructive";
    case "None":
      return "Non-Alerting";
    case "Success":
      return "Informational";
    default:
      return type;
  }
}
