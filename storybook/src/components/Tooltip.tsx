import { Tooltip as BaseTooltip } from "@base-ui-components/react/tooltip";
import { useCallback, useMemo, useState } from "react";
import type { ReactNode } from "react";
import styles from "./Tooltip.module.css";

interface TooltipProps {
  content: ReactNode;
  title?: string;
  children: ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  showArrow?: boolean;
  dismissible?: boolean;
}

export function Tooltip({
  content,
  title,
  children,
  side = "bottom",
  align = "center",
  showArrow = true,
  dismissible = false,
}: TooltipProps) {
  const [open, setOpen] = useState(false);
  const [manuallyDismissed, setManuallyDismissed] = useState(false);

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!dismissible) {
        setOpen(nextOpen);
        return;
      }
      if (nextOpen) {
        setManuallyDismissed(false);
        setOpen(true);
        return;
      }
      if (!manuallyDismissed) {
        return;
      }
      setOpen(false);
    },
    [dismissible, manuallyDismissed]
  );

  const dismissTooltip = useCallback(() => {
    setManuallyDismissed(true);
    setOpen(false);
  }, []);

  const popupClassName = useMemo(
    () =>
      [
        styles.popup,
        dismissible ? styles.popupDismissible : styles.popupStandard,
        title ? styles.popupWithTitle : styles.popupNoTitle,
      ]
        .filter(Boolean)
        .join(" "),
    [dismissible, title]
  );

  return (
    <BaseTooltip.Provider>
      <BaseTooltip.Root open={open} onOpenChange={handleOpenChange}>
        <BaseTooltip.Trigger className={styles.trigger} render={<span />}>
          {children}
        </BaseTooltip.Trigger>
        <BaseTooltip.Portal>
          <BaseTooltip.Positioner side={side} align={align} sideOffset={showArrow ? 0 : 8}>
            <BaseTooltip.Popup
              className={popupClassName}
              onKeyDown={(event) => {
                if (event.key === "Escape" && dismissible) {
                  dismissTooltip();
                }
              }}
            >
              {showArrow ? (
                <BaseTooltip.Arrow className={styles.arrow}>
                  <svg className={styles.arrowSvg} viewBox="0 0 10 6" aria-hidden="true">
                    <path className={styles.arrowFill} d="M0.5 5.5L5 0.5L9.5 5.5H0.5Z" />
                    <path className={styles.arrowStroke} d="M0.5 5.5L5 0.5L9.5 5.5" />
                  </svg>
                </BaseTooltip.Arrow>
              ) : null}
              <div className={styles.content}>
                {(title || dismissible) && (
                  <div className={styles.header}>
                    {title ? <div className={styles.title}>{title}</div> : <span />}
                    {dismissible ? (
                      <button
                        className={styles.close}
                        type="button"
                        aria-label="Dismiss tooltip"
                        onClick={dismissTooltip}
                      >
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                          <path d="M9.6 2.4L2.4 9.6M2.4 2.4L9.6 9.6" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
                        </svg>
                      </button>
                    ) : null}
                  </div>
                )}
                <div className={styles.body}>{content}</div>
              </div>
            </BaseTooltip.Popup>
          </BaseTooltip.Positioner>
        </BaseTooltip.Portal>
      </BaseTooltip.Root>
    </BaseTooltip.Provider>
  );
}
