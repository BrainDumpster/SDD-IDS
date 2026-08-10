import { useEffect, useState, type ComponentProps } from "react";

import { Button } from "./Button";
import { Icon } from "./Icon";
import { IdsTooltip } from "./IdsTooltip";
import styles from "./IdsFooter.module.css";

export interface IdsFooterProps extends Omit<ComponentProps<"footer">, "children"> {
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

export function IdsFooter({
  hostname = "short_name_first_domain_name",
  swid = "ELMCR00222GBPB",
  currentDateTime = "Tue, 2023-04-23 12:30 AM",
  timeZoneLabel = "Eastern Time (US & Canada)",
  showHostname = true,
  showCurrentDateAndTime = true,
  showTimeZone = true,
  copyDisabled = false,
  timeZoneDisabled = false,
  onCopySwid,
  onTimeZoneClick,
  className,
  ...rest
}: IdsFooterProps) {
  const canCopy = Boolean(swid) && !copyDisabled;

  const truncatedHostname = hostname.length > 48 ? `${hostname.slice(0, 48)}...` : hostname;

  const [valueEl, setValueEl] = useState<HTMLSpanElement | null>(null);
  const [isOverflowed, setIsOverflowed] = useState(false);

  useEffect(() => {
    if (!valueEl) return;

    const updateOverflow = () => {
      setIsOverflowed(valueEl.scrollWidth > valueEl.clientWidth);
    };

    updateOverflow();

    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(updateOverflow) : null;
    if (ro) ro.observe(valueEl);

    return () => {
      if (ro) ro.disconnect();
    };
  }, [valueEl, truncatedHostname]);

  const showTooltip = isOverflowed || hostname.length >= 48;

  const handleCopy = async () => {
    if (!canCopy || !swid) return;
    try {
      await copyTextToClipboard(swid);
    } catch {
      /* host may surface errors via onCopySwid */
    }
    onCopySwid?.(swid);
  };

  return (
    <footer
      className={[styles.root, className].filter(Boolean).join(" ")}
      aria-label="Application status"
      {...rest}
    >
      <div className={styles.left}>
        {showHostname && (
          <div className={[styles.field, styles.hostnameField].join(' ')}>
            <span className={styles.label}>Host Name:</span>
            <span className={styles.hostnameValue}>
              {showTooltip ? (
                <IdsTooltip
                  content={<span style={{ overflowWrap: "break-word" }}>{hostname}</span>}
                  triggerDisplay="block"
                >
                  <span ref={setValueEl} className={styles.hostnameText}>{truncatedHostname}</span>
                </IdsTooltip>
              ) : (
                <span ref={setValueEl} className={styles.hostnameText}>{truncatedHostname}</span>
              )}
            </span>
          </div>
        )}
        {swid != null && swid !== "" && (
          <div className={styles.swidGroup}>
            <div className={styles.field}>
              <span className={styles.label}>SWID:</span>
              <span className={styles.value}>{swid}</span>
            </div>
            <button
              type="button"
              className={styles.copyButton}
              aria-label="Copy SWID"
              disabled={!canCopy}
              onClick={() => void handleCopy()}
            >
              <Icon
                shapeName="copy"
                variant="mask"
                color="var(--color-icon-brand-base)"
                style={{ width: 14, height: 14 }}
              />
            </button>
          </div>
        )}
      </div>
      {showCurrentDateAndTime && currentDateTime != null && currentDateTime !== "" && (
        <div className={styles.timeGroup}>
          <Icon
            shapeName="time-clock"
            variant="mask"
            color="var(--color-icon-neutral)"
            style={{ width: 16, height: 16 }}
          />
          <span className={styles.dateTime}>{currentDateTime}</span>
        </div>
      )}
      {showTimeZone && (
        <Button
          type="button"
          variant="tertiary"
          size="sm"
          iconSlug="world-globe"
          disabled={timeZoneDisabled}
          onClick={() => onTimeZoneClick?.()}
        >
          {timeZoneLabel || "Time zone"}
        </Button>
      )}
    </footer>
  );
}
