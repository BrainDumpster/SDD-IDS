/**
 * IDS Footer — React implementation generated from design-spec.
 *
 * Path: `lib/react/ids/footer`
 * Source: `components/ids/footer/design-spec.md`
 * Theme: `components/ids-theme.css`
 *
 * Anatomy:
 *   FooterRoot
 *     FooterLeftRegion
 *       FooterHostName?
 *       FooterSwidGroup? (label + value + FooterCopyControl)
 *     FooterTimeGroup?
 *     FooterTimeZoneGroup? (IdsButton tertiary small + world-globe)
 *
 * Composition: `IdsIcon`, `IdsButton` (+ LeadingIcon/Label), `IdsTooltip` for
 * hostname truncation tooltip. No @base-ui-components dependency.
 */

import React, {
  useEffect,
  useState,
  type ComponentProps,
  type ReactElement,
} from "react";
import {
  IdsButton,
  IdsButtonLabel,
  IdsButtonLeadingIcon,
} from "../button";
import { IdsIcon } from "../icon";
import {
  IdsTooltip,
  TooltipBody,
  TooltipPanel,
  TooltipTrigger,
} from "../tooltip";
import styles from "./IdsFooter.module.css";

const HOSTNAME_MAX_CHARS = 48;

export interface IdsFooterProps
  extends Omit<ComponentProps<"footer">, "children"> {
  hostname?: string;
  swid?: string;
  currentDateTime?: string;
  timeZoneLabel?: string;
  showHostname?: boolean;
  showCurrentDateAndTime?: boolean;
  showTimeZone?: boolean;
  copyDisabled?: boolean;
  timeZoneDisabled?: boolean;
  onCopySwid?: (swid: string) => void;
  onTimeZoneClick?: () => void;
}

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/** Visibility toggles: non-boolean → `true` (design-spec fallback). */
function resolveShowFlag(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  return true;
}

async function copyTextToClipboard(text: string): Promise<void> {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

function truncateHostname(value: string): string {
  if (value.length <= HOSTNAME_MAX_CHARS) return value;
  return `${value.slice(0, HOSTNAME_MAX_CHARS)}...`;
}

export function IdsFooter({
  hostname,
  swid,
  currentDateTime,
  timeZoneLabel,
  showHostname: showHostnameProp = true,
  showCurrentDateAndTime: showCurrentDateAndTimeProp = true,
  showTimeZone: showTimeZoneProp = true,
  copyDisabled = false,
  timeZoneDisabled = false,
  onCopySwid,
  onTimeZoneClick,
  className,
  ...rest
}: IdsFooterProps): ReactElement {
  const showHostname = resolveShowFlag(showHostnameProp);
  const showCurrentDateAndTime = resolveShowFlag(showCurrentDateAndTimeProp);
  const showTimeZone = resolveShowFlag(showTimeZoneProp);

  const hostnameText = hostname ?? "";
  const truncatedHostname = truncateHostname(hostnameText);
  const hasSwid = swid != null && swid !== "";
  const canCopy = hasSwid && !copyDisabled;
  const zoneLabel =
    timeZoneLabel != null && timeZoneLabel !== ""
      ? timeZoneLabel
      : "Time zone";

  const [valueEl, setValueEl] = useState<HTMLSpanElement | null>(null);
  const [isOverflowed, setIsOverflowed] = useState(false);

  useEffect(() => {
    if (!valueEl) return;

    const updateOverflow = () => {
      setIsOverflowed(valueEl.scrollWidth > valueEl.clientWidth);
    };

    updateOverflow();

    const ro =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(updateOverflow)
        : null;
    if (ro) ro.observe(valueEl);

    return () => {
      if (ro) ro.disconnect();
    };
  }, [valueEl, truncatedHostname]);

  const showHostnameTooltip =
    isOverflowed || hostnameText.length >= HOSTNAME_MAX_CHARS;

  const handleCopy = async () => {
    if (!canCopy || !swid) return;
    try {
      await copyTextToClipboard(swid);
    } catch {
      /* Clipboard failure still notifies host via onCopySwid (spec fallback). */
    }
    onCopySwid?.(swid);
  };

  const hostnameValueNode = (
    <span ref={setValueEl} className={styles["ids-footer-hostname-text"]}>
      {truncatedHostname}
    </span>
  );

  return (
    <footer
      {...rest}
      className={cx(styles["ids-footer"], className)}
      aria-label="Application status"
      data-ids="ids-footer"
    >
      <div className={styles["ids-footer-left"]} data-ids="ids-footer-left">
        {showHostname ? (
          <div
            className={cx(
              styles["ids-footer-field"],
              styles["ids-footer-hostname"],
            )}
            data-ids="ids-footer-hostname"
          >
            <span className={styles["ids-footer-label"]}>Host Name:</span>
            <span className={styles["ids-footer-hostname-value"]}>
              {showHostnameTooltip ? (
                <IdsTooltip hugContent side="top">
                  <TooltipTrigger display="block" tabIndex={0}>
                    {hostnameValueNode}
                  </TooltipTrigger>
                  <TooltipPanel>
                    <TooltipBody>
                      <span className={styles["ids-footer-hostname-tooltip"]}>
                        {hostnameText}
                      </span>
                    </TooltipBody>
                  </TooltipPanel>
                </IdsTooltip>
              ) : (
                hostnameValueNode
              )}
            </span>
          </div>
        ) : null}

        {hasSwid ? (
          <div
            className={styles["ids-footer-swid-group"]}
            data-ids="ids-footer-swid-group"
          >
            <div className={styles["ids-footer-field"]}>
              <span className={styles["ids-footer-label"]}>SWID:</span>
              <span className={styles["ids-footer-value"]}>{swid}</span>
            </div>
            <button
              type="button"
              className={styles["ids-footer-copy"]}
              data-ids="ids-footer-copy"
              aria-label="Copy SWID"
              aria-disabled={!canCopy || undefined}
              disabled={!canCopy}
              onClick={() => void handleCopy()}
            >
              <IdsIcon
                shape="copy"
                variant="mask"
                size={14}
                color="currentColor"
              />
            </button>
          </div>
        ) : null}
      </div>

      {showCurrentDateAndTime ? (
        <div
          className={styles["ids-footer-time-group"]}
          data-ids="ids-footer-time-group"
        >
          <IdsIcon
            shape="time-clock"
            variant="mask"
            size={16}
            color="var(--color-icon-gray-neutral-base)"
          />
          <span className={styles["ids-footer-datetime"]}>
            {currentDateTime ?? ""}
          </span>
        </div>
      ) : null}

      {showTimeZone ? (
        <div
          className={styles["ids-footer-timezone-group"]}
          data-ids="ids-footer-timezone-group"
        >
          <IdsButton
            type="button"
            variant="tertiary"
            size="small"
            disabled={timeZoneDisabled}
            onClick={() => onTimeZoneClick?.()}
          >
            <IdsButtonLeadingIcon>
              <IdsIcon
                shape="world-globe"
                variant="mask"
                size={16}
                color="var(--color-icon-brand-base)"
              />
            </IdsButtonLeadingIcon>
            <IdsButtonLabel>{zoneLabel}</IdsButtonLabel>
          </IdsButton>
        </div>
      ) : null}
    </footer>
  );
}

IdsFooter.displayName = "IdsFooter";

export default IdsFooter;
