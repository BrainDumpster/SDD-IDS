import { Tooltip as BaseTooltip } from "@base-ui-components/react/tooltip";
import { useCallback, useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { Icon } from "./Icon";
import {
  IdsTooltipArrow,
  IdsTooltipBody,
  IdsTooltipClose,
  IdsTooltipHeader,
  IdsTooltipPanel,
  IdsTooltipTitle,
  IdsTooltipTrigger,
  parseTooltipChildren,
} from "./ids-tooltip.slots";
import buttonStyles from "./Button.module.css";
import styles from "./IdsTooltip.module.css";

type TooltipSide = NonNullable<IdsTooltipProps["side"]>;
type TooltipArrowAlign = NonNullable<IdsTooltipProps["arrowAlign"]>;

/** Attachment-axis calibration only — the arrow's cross-axis position comes
    from Floating UI's arrow middleware, which centers the arrow on the trigger
    object. `arrowAlign` shifts the popup; the arrow always tracks the trigger. */
function arrowOffsetStyle(side: TooltipSide): CSSProperties {
  if (side === "top" || side === "bottom") {
    return side === "bottom"
      ? { top: -5 }
      : { bottom: -5, top: "auto" };
  }
  return side === "right"
    ? { left: -5, right: "auto" }
    : { right: -5, left: "auto" };
}

export {
  IdsTooltipArrow,
  IdsTooltipBody,
  IdsTooltipClose,
  IdsTooltipHeader,
  IdsTooltipPanel,
  IdsTooltipTitle,
  IdsTooltipTrigger,
};

/** Reference: `components/ids/tooltip/design-spec.md` */
export interface IdsTooltipProps {
  /** Shorthand body when `IdsTooltipBody` is not used. */
  content?: ReactNode;
  /** Shorthand title when `IdsTooltipTitle` is not used. */
  title?: ReactNode;
  children: ReactNode;
  /** `side` in design spec. Default `top`. */
  side?: "top" | "bottom" | "left" | "right";
  /** `arrowAlign` in design spec. Default `center`. */
  arrowAlign?: "start" | "center" | "end";
  /** @deprecated Use `arrowAlign`. */
  align?: "start" | "center" | "end";
  /** Default `false` — hover/focus dismiss (standard tooltip). */
  closable?: boolean;
  /** Trigger layout; use `block` for full-width row triggers (e.g. Dual List Box items). */
  triggerDisplay?: "inline" | "block";
  /** When true, the tooltip popup shrinks to fit its content instead of using the standard 240px width. */
  hugContent?: boolean;
  /** Open delay in ms — pointer must rest on the trigger this long. Default `300`. */
  delay?: number;
  /** Close delay in ms. Default is 0. */
  closeDelay?: number;
  onOpenChange?: (open: boolean) => void;
  onClose?: (reason: "close-click" | "escape" | "programmatic") => void;
}

export function IdsTooltip({
  content,
  title,
  children,
  side = "top",
  arrowAlign,
  align,
  closable = false,
  triggerDisplay = "inline",
  hugContent = false,
  delay = 300,
  closeDelay,
  onOpenChange,
  onClose,
}: IdsTooltipProps) {
  const { trigger, titleSlot, bodySlot, hasTitleSlot, hasBodySlot } = parseTooltipChildren(children);
  const resolvedTitle = hasTitleSlot ? titleSlot : title;
  const resolvedContent = hasBodySlot ? bodySlot : content;
  const resolvedAlign = arrowAlign ?? align ?? "center";
  const [open, setOpen] = useState(false);
  const [manuallyDismissed, setManuallyDismissed] = useState(false);

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      onOpenChange?.(nextOpen);

      if (!closable) {
        // Standard tooltip (`closable=false`): hover/focus lifecycle per IDS spec.
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
    [closable, manuallyDismissed, onOpenChange]
  );

  const dismissTooltip = useCallback(() => {
    setManuallyDismissed(true);
    setOpen(false);
    onClose?.("close-click");
  }, [onClose]);

  const dismissTooltipWithEscape = useCallback(() => {
    setManuallyDismissed(true);
    setOpen(false);
    onClose?.("escape");
  }, [onClose]);

  const popupClassName = useMemo(
    () =>
      [
        styles.popup,
        closable ? styles.popupClosable : styles.popupStandard,
        resolvedTitle ? styles.popupWithTitle : styles.popupNoTitle,
        hugContent ? styles.popupHug : null,
      ]
        .filter(Boolean)
        .join(" "),
    [closable, resolvedTitle, hugContent]
  );

  return (
    <BaseTooltip.Provider delay={delay} closeDelay={closeDelay}>
      <BaseTooltip.Root open={closable ? open : undefined} onOpenChange={handleOpenChange}>
        <BaseTooltip.Trigger
          className={
            triggerDisplay === "block" ? styles.triggerBlock : styles.trigger
          }
          render={<span tabIndex={tabIndex} />}
        >
          {trigger}
        </BaseTooltip.Trigger>
        <BaseTooltip.Portal>
          <BaseTooltip.Positioner
            side={side}
            align={resolvedAlign}
            /* 6px visible gap (spacing/space-6) between the object edge and the
               arrow tip; the arrow pokes 5px past the panel, so offset = 11. */
            sideOffset={11}
            /* Keep requested side×arrowAlign (e.g. right-end); default align flip remaps to center. */
            collisionAvoidance={{ side: "none", align: "none", fallbackAxisSide: "none" }}
          >
            <BaseTooltip.Popup
              className={popupClassName}
              role="tooltip"
              onKeyDown={(event) => {
                if (event.key === "Escape" && closable) {
                  dismissTooltipWithEscape();
                }
              }}
            >
              <BaseTooltip.Arrow
                className={styles.arrow}
                style={arrowOffsetStyle(side)}
              >
                <span className={styles.arrowGraphic} aria-hidden="true">
                  <svg className={styles.arrowSvg} viewBox="0 0 10 6">
                    <path className={styles.arrowFill} d="M0.5 5.5L5 0.5L9.5 5.5L9.5 6.5L0.5 6.5Z" />
                    <path className={styles.arrowStroke} d="M0.5 5.5L5 0.5L9.5 5.5" />
                  </svg>
                </span>
              </BaseTooltip.Arrow>
              <div className={styles.panel}>
                <div
                  className={
                    closable
                      ? `${styles.content} ${styles.contentClosable}`
                      : styles.content
                  }
                >
                  {closable ? (
                    <>
                      <div className={styles.contentColumn}>
                        {resolvedTitle ? (
                          <div className={styles.header}>
                            <div className={styles.title}>{resolvedTitle}</div>
                          </div>
                        ) : null}
                        <div className={styles.body}>{resolvedContent}</div>
                      </div>
                      <button
                        type="button"
                        className={[
                          buttonStyles.button,
                          buttonStyles.tertiary,
                          styles.closeButton,
                        ].filter(Boolean).join(" ")}
                        aria-label="Close tooltip"
                        onClick={dismissTooltip}
                      >
                        <Icon
                          shapeName="ctrl-close-16"
                          color="var(--color-icon-gray-neutral-base)"
                          style={{ width: 12, height: 12 }}
                        />
                      </button>
                    </>
                  ) : (
                    <>
                      {resolvedTitle ? (
                        <div className={styles.header}>
                          <div className={styles.title}>{resolvedTitle}</div>
                        </div>
                      ) : null}
                      <div className={styles.body}>{resolvedContent}</div>
                    </>
                  )}
                </div>
              </div>
            </BaseTooltip.Popup>
          </BaseTooltip.Positioner>
        </BaseTooltip.Portal>
      </BaseTooltip.Root>
    </BaseTooltip.Provider>
  );
}
