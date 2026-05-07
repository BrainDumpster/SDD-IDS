import { Tooltip as BaseTooltip } from "@base-ui-components/react/tooltip";
import { useCallback, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Icon } from "./Icon";
import styles from "./IdsTooltip.module.css";

export interface IdsTooltipProps {
  content: ReactNode;
  title?: string;
  children: ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  showArrow?: boolean;
  closable?: boolean;
  onClose?: (reason: "close-click") => void;
}

export function IdsTooltip({
  content,
  title,
  children,
  side = "top",
  align = "center",
  showArrow = true,
  closable = false,
  onClose,
}: IdsTooltipProps) {
  const [open, setOpen] = useState(false);
  const [manuallyDismissed, setManuallyDismissed] = useState(false);

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!closable) {
        // Standard tooltip behavior: open/close follows trigger hover/focus lifecycle.
        setOpen(nextOpen);
        return;
      }

      if (nextOpen) {
        setManuallyDismissed(false);
        setOpen(true);
        return;
      }

      // Closable mode ignores leave/blur close unless it was explicitly dismissed.
      if (!manuallyDismissed) {
        return;
      }

      setOpen(false);
    },
    [closable, manuallyDismissed]
  );

  const dismissTooltip = useCallback(() => {
    setManuallyDismissed(true);
    setOpen(false);
    onClose?.("close-click");
  }, [onClose]);

  const popupClassName = useMemo(
    () =>
      [
        styles.popup,
        closable ? styles.popupClosable : styles.popupStandard,
        title ? styles.popupWithTitle : styles.popupNoTitle,
      ]
        .filter(Boolean)
        .join(" "),
    [closable, title]
  );

  return (
    <BaseTooltip.Provider>
      <BaseTooltip.Root open={open} onOpenChange={handleOpenChange}>
        <BaseTooltip.Trigger className={styles.trigger} render={<span />}>
          {children}
        </BaseTooltip.Trigger>
        <BaseTooltip.Portal>
          <BaseTooltip.Positioner side={side} align={align} sideOffset={16}>
            <BaseTooltip.Popup className={popupClassName}>
              {showArrow ? (
                <BaseTooltip.Arrow className={styles.arrow}>
                  <svg className={styles.arrowSvg} viewBox="0 0 10 6" aria-hidden="true">
                    <path className={styles.arrowFill} d="M0.5 5.5L5 0.5L9.5 5.5H0.5Z" />
                    <path className={styles.arrowStroke} d="M0.5 5.5L5 0.5L9.5 5.5" />
                  </svg>
                </BaseTooltip.Arrow>
              ) : null}
              <div className={styles.content}>
                {(title || closable) && (
                  <div className={styles.header}>
                    {title ? <div className={styles.title}>{title}</div> : <span />}
                    {closable ? (
                      <button
                        className={styles.close}
                        type="button"
                        aria-label="Close tooltip"
                        onClick={dismissTooltip}
                      >
                        <Icon shapeName="shape-x" variant="img" className={styles.closeIcon} />
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
