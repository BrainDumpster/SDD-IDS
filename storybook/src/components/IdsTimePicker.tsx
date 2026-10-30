import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { createPortal } from "react-dom";
// Shared label component, consumed from lib the same way IdsBreadcrumb consumes IdsLink.
import { IdsFormLabel } from "../../../lib/react/ids/form-label";
import { Button } from "./Button";
import { Icon } from "./Icon";
import styles from "./IdsTimePicker.module.css";

/** Above DataGrid column filter shell (`filterMenuLayer` z-index 10000). */
const TIME_PORTAL_Z_INDEX = 10050;

export interface IdsTimePickerProps {
  value?: string | null;
  onChange?: (value: string | null) => void;
  size?: "large" | "small";
  placeholder?: string;
  label?: string;
  required?: boolean;
  formatHint?: string;
  clockType?: "12h" | "24h";
  showSeconds?: boolean;
  disabled?: boolean;
  error?: boolean;
  errorMessage?: string;
  forceOpen?: boolean;
  /**
   * Render the time menu in `document.body` with fixed positioning so it is not clipped
   * by overflow/stacking contexts (e.g. DataGrid filter panels). Default: true.
   */
  popupPortal?: boolean;
  /** Id for the text input. Generated when omitted; the label points at it. */
  id?: string;
}

type Period = "AM" | "PM";

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function parseTime12(value: string): { hour: number; minute: number; second: number; period: Period } | null {
  const m = value.trim().match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)$/i);
  if (!m) return null;
  const hour = Number(m[1]);
  const minute = Number(m[2]);
  const second = m[3] ? Number(m[3]) : 0;
  const period = m[4].toUpperCase() as Period;
  if (hour < 1 || hour > 12 || minute > 59 || second > 59) return null;
  return { hour, minute, second, period };
}

function parseTime24(value: string): { hour: number; minute: number; second: number } | null {
  const m = value.trim().match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
  if (!m) return null;
  const hour = Number(m[1]);
  const minute = Number(m[2]);
  const second = m[3] ? Number(m[3]) : 0;
  if (hour > 23 || minute > 59 || second > 59) return null;
  return { hour, minute, second };
}

function formatTime12(hour: number, minute: number, second: number, period: Period, showSeconds: boolean) {
  const base = `${hour}:${pad2(minute)}`;
  const withSec = showSeconds ? `${base}:${pad2(second)}` : base;
  return `${withSec} ${period}`;
}

function formatTime24(hour: number, minute: number, second: number, showSeconds: boolean) {
  const base = `${pad2(hour)}:${pad2(minute)}`;
  return showSeconds ? `${base}:${pad2(second)}` : base;
}

function TimeColumn({
  label,
  display,
  onIncrement,
  onDecrement,
  disabled,
  className,
}: {
  label: string;
  display: string;
  onIncrement: () => void;
  onDecrement: () => void;
  disabled?: boolean;
  className?: string;
}) {
  const colRef = useRef<HTMLDivElement>(null);
  const incRef = useRef(onIncrement);
  const decRef = useRef(onDecrement);
  const disabledRef = useRef(disabled);
  incRef.current = onIncrement;
  decRef.current = onDecrement;
  disabledRef.current = disabled;

  // Scroll a column (wheel / trackpad) to change its value, per the spec
  // ("Scroll column list → change hour/minute/seconds/period").
  useEffect(() => {
    const el = colRef.current;
    if (!el) return;
    let acc = 0;
    const STEP = 24;
    const onWheel = (e: WheelEvent) => {
      if (disabledRef.current) return;
      e.preventDefault();
      acc += e.deltaY;
      while (acc >= STEP) {
        incRef.current();
        acc -= STEP;
      }
      while (acc <= -STEP) {
        decRef.current();
        acc += STEP;
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <div ref={colRef} className={className ? `${styles.timeColumn} ${className}` : styles.timeColumn} role="group" aria-label={label}>
      {/* Per spec: the up arrow is the "Previous" control — navigates backward (decrement). */}
      <button type="button" className={`${styles.arrowBtn} ${styles.arrowUp}`} onClick={onDecrement} disabled={disabled} aria-label={`Previous ${label}`}>
        <Icon shapeName="arrow-tri-down-solid" color="var(--color-icon-gray-neutral-base)" style={{ width: 10, height: 10 }} />
      </button>
      {/* Not a live region: the popup announces the full time instead (see `role="status"`). */}
      <div className={styles.valueCell}>{display}</div>
      {/* Per spec: the down arrow is the "Next" control — navigates forward (increment). */}
      <button type="button" className={styles.arrowBtn} onClick={onIncrement} disabled={disabled} aria-label={`Next ${label}`}>
        <Icon shapeName="arrow-tri-down-solid" color="var(--color-icon-gray-neutral-base)" style={{ width: 10, height: 10 }} />
      </button>
    </div>
  );
}

export function IdsTimePicker({
  value = null,
  onChange,
  size = "large",
  placeholder = "HH:MM AM/PM",
  label,
  required = false,
  formatHint = "HH:MM AM/PM",
  clockType = "12h",
  showSeconds = false,
  disabled = false,
  error = false,
  errorMessage,
  forceOpen,
  popupPortal = true,
  id: idProp,
}: IdsTimePickerProps) {
  const reactId = useId();
  const inputId = idProp ?? `ids-time-picker-${reactId}`;
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;
  const rootRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const clockBtnRef = useRef<HTMLButtonElement>(null);
  const didMountRef = useRef(false);
  const [mouseActivated, setMouseActivated] = useState(false);
  const [open, setOpen] = useState(forceOpen ?? false);
  const [inputText, setInputText] = useState(value ?? "");
  const [popupPos, setPopupPos] = useState<{ top: number; left: number } | null>(null);

  // The columns are re-seeded by `syncColumns` every time the selector opens,
  // so these initial values are never shown.
  const [hour12, setHour12] = useState(12);
  const [minute, setMinute] = useState(0);
  const [second, setSecond] = useState(0);
  const [period, setPeriod] = useState<Period>("AM");
  const [hour24, setHour24] = useState(0);

  useEffect(() => {
    if (value !== undefined && value !== null) setInputText(value);
  }, [value]);

  useEffect(() => {
    if (forceOpen !== undefined) setOpen(forceOpen);
  }, [forceOpen]);

  /**
   * Point the columns at `text` — the time in the field, typed or selected. When
   * the field holds no valid time, start from the current time instead.
   */
  const syncColumns = useCallback(
    (text: string) => {
      const now = new Date();
      const nowSecond = showSeconds ? now.getSeconds() : 0;
      if (clockType === "12h") {
        const p = parseTime12(text) ?? {
          hour: now.getHours() % 12 || 12,
          minute: now.getMinutes(),
          second: nowSecond,
          period: (now.getHours() < 12 ? "AM" : "PM") as Period,
        };
        setHour12(p.hour);
        setMinute(p.minute);
        setSecond(p.second);
        setPeriod(p.period);
      } else {
        const p = parseTime24(text) ?? { hour: now.getHours(), minute: now.getMinutes(), second: nowSecond };
        setHour24(p.hour);
        setMinute(p.minute);
        setSecond(p.second);
      }
    },
    [clockType, showSeconds],
  );

  // Every open starts from the field, so the selector shows the time the user
  // sees there (and edits abandoned with Esc don't linger). Layout effect: the
  // columns are corrected before the popup is painted.
  useLayoutEffect(() => {
    if (open) syncColumns(inputText);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const updatePopupPosition = useCallback(() => {
    const anchor = anchorRef.current;
    if (!anchor) return;
    const rect = anchor.getBoundingClientRect();
    const popup = popupRef.current;
    const popupWidth = popup?.offsetWidth ?? 220;
    const popupHeight = popup?.offsetHeight ?? 220;
    const margin = 8;
    let top = rect.bottom - 1;
    let left = rect.right - popupWidth;
    left = Math.max(margin, Math.min(left, window.innerWidth - popupWidth - margin));
    if (top + popupHeight > window.innerHeight - margin) {
      const above = rect.top - popupHeight + 1;
      if (above >= margin) top = above;
    }
    setPopupPos({ top, left });
  }, []);

  useLayoutEffect(() => {
    if (!open || !popupPortal) {
      setPopupPos(null);
      return;
    }
    let cancelled = false;
    const run = () => {
      if (cancelled) return;
      updatePopupPosition();
    };
    run();
    const raf = requestAnimationFrame(run);
    const onWin = () => run();
    window.addEventListener("resize", onWin);
    window.addEventListener("scroll", onWin, true);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onWin);
      window.removeEventListener("scroll", onWin, true);
    };
  }, [open, popupPortal, updatePopupPosition]);

  const formatted = useMemo(() => {
    if (clockType === "12h") return formatTime12(hour12, minute, second, period, showSeconds);
    return formatTime24(hour24, minute, second, showSeconds);
  }, [clockType, hour12, hour24, minute, second, period, showSeconds]);

  const commit = useCallback(
    (text: string) => {
      setInputText(text);
      onChange?.(text || null);
    },
    [onChange],
  );

  const applyFromColumns = useCallback(() => {
    commit(formatted);
  }, [commit, formatted]);

  /** Clicking outside keeps the time picked in the columns. */
  const closePopupAndApply = useCallback(() => {
    setOpen(false);
    applyFromColumns();
  }, [applyFromColumns]);

  /** Esc closes without selecting a time and returns focus to the Choose Time button. */
  const cancelPopup = () => {
    setOpen(false);
    clockBtnRef.current?.focus();
  };

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (rootRef.current?.contains(target)) return;
      if (popupRef.current?.contains(target)) return;
      closePopupAndApply();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, closePopupAndApply]);

  /** Focusable controls inside the popup, in DOM order (for the focus trap). */
  const getFocusableEls = () =>
    popupRef.current
      ? Array.from(
          popupRef.current.querySelectorAll<HTMLElement>("button:not([disabled])"),
        ).filter((el) => el.offsetParent !== null)
      : [];

  // On open, move focus to the first control in the popup, whose columns show the
  // selected time (or the current time when the field is empty) — per the spec's
  // "Space/Enter opens the selector and moves focus to the currently selected
  // time". Skipped on the initial mount so forceOpen demos don't grab focus on load.
  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }
    if (open && !disabled) {
      // The portaled popup stays `visibility: hidden` until it has been positioned,
      // and hidden elements can't take focus — wait a frame.
      const raf = requestAnimationFrame(() => getFocusableEls()[0]?.focus());
      return () => cancelAnimationFrame(raf);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, disabled]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape" && open) {
      e.preventDefault();
      // Esc belongs to the time selector: don't let it also close an overlay the
      // picker sits in (e.g. the DataGrid filter menu listens on `window`).
      e.stopPropagation();
      cancelPopup();
    }
  };

  /** Selector is a single tab stop: Tab / Shift+Tab cycle within the popup (focus trap). */
  const onPopupKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "Tab") return;
    const els = getFocusableEls();
    if (els.length === 0) return;
    const first = els[0];
    const last = els[els.length - 1];
    const active = document.activeElement as HTMLElement | null;
    if (e.shiftKey && active === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const wrap = (n: number, min: number, max: number) => {
    if (n > max) return min;
    if (n < min) return max;
    return n;
  };

  const fieldClasses = [
    styles.fieldContainer,
    size === "large" ? styles.sizeLarge : styles.sizeSmall,
    disabled ? styles.disabled : "",
    error ? styles.error : "",
    open ? styles.open : "",
    mouseActivated ? styles.mouseActivated : "",
  ]
    .filter(Boolean)
    .join(" ");

  const showFormatHint = formatHint !== "" && !error;
  const inputFilled = inputText.trim().length > 0;
  const showError = Boolean(error && errorMessage);
  // The format used to be folded into the input's `aria-label`, which only read
  // it out while the field was empty. As a description it is announced either way.
  const describedBy =
    [showError ? errorId : undefined, showFormatHint ? hintId : undefined]
      .filter(Boolean)
      .join(" ") || undefined;

  const popupClasses = [
    styles.timePopup,
    popupPortal ? styles.timePopupPortaled : "",
    // 24h has no AM/PM column; the wider side padding keeps the popup as wide as the 12h one (Figma).
    clockType === "24h" ? styles.widePadding : "",
  ]
    .filter(Boolean)
    .join(" ");

  const popupStyle: CSSProperties | undefined =
    popupPortal && popupPos
      ? { top: popupPos.top, left: popupPos.left, zIndex: TIME_PORTAL_Z_INDEX }
      : popupPortal
        ? { visibility: "hidden" as const }
        : undefined;

  const popup = open && !disabled && (
    <div
      ref={popupRef}
      className={popupClasses}
      style={popupStyle}
      role="dialog"
      aria-modal="true"
      aria-label="Choose time"
      onKeyDown={onPopupKeyDown}
      onMouseDown={popupPortal ? (e) => e.stopPropagation() : undefined}
    >
      {clockType === "12h" ? (
        <>
          <TimeColumn
            label="Hour"
            display={String(hour12)}
            disabled={disabled}
            onIncrement={() => setHour12((h) => wrap(h + 1, 1, 12))}
            onDecrement={() => setHour12((h) => wrap(h - 1, 1, 12))}
          />
          <TimeColumn
            label="Minute"
            display={pad2(minute)}
            disabled={disabled}
            onIncrement={() => setMinute((m) => wrap(m + 1, 0, 59))}
            onDecrement={() => setMinute((m) => wrap(m - 1, 0, 59))}
          />
          {showSeconds && (
            <TimeColumn
              label="Second"
              display={pad2(second)}
              disabled={disabled}
              onIncrement={() => setSecond((s) => wrap(s + 1, 0, 59))}
              onDecrement={() => setSecond((s) => wrap(s - 1, 0, 59))}
            />
          )}
          <TimeColumn
            className={styles.periodColumn}
            label="AM or PM"
            display={period}
            disabled={disabled}
            onIncrement={() => setPeriod((p) => (p === "AM" ? "PM" : "AM"))}
            onDecrement={() => setPeriod((p) => (p === "AM" ? "PM" : "AM"))}
          />
        </>
      ) : (
        <>
          <TimeColumn
            label="Hour"
            display={String(hour24)}
            disabled={disabled}
            onIncrement={() => setHour24((h) => wrap(h + 1, 0, 23))}
            onDecrement={() => setHour24((h) => wrap(h - 1, 0, 23))}
          />
          <TimeColumn
            label="Minute"
            display={pad2(minute)}
            disabled={disabled}
            onIncrement={() => setMinute((m) => wrap(m + 1, 0, 59))}
            onDecrement={() => setMinute((m) => wrap(m - 1, 0, 59))}
          />
          {showSeconds && (
            <TimeColumn
              label="Second"
              display={pad2(second)}
              disabled={disabled}
              onIncrement={() => setSecond((s) => wrap(s + 1, 0, 59))}
              onDecrement={() => setSecond((s) => wrap(s - 1, 0, 59))}
            />
          )}
        </>
      )}
      {/* Announces the whole time on every change ("7:30 PM" → "seven thirty p m"),
          not just the column that moved. */}
      <span className={styles.visuallyHidden} role="status">
        {formatted}
      </span>
    </div>
  );

  return (
    <div className={styles.root} ref={rootRef} onKeyDown={handleKeyDown}>
      {label && (
        <span className={styles.label}>
          <IdsFormLabel
            htmlFor={inputId}
            required={required}
            // Time Picker sizes are `large` / `small`; Form Label's padding-block
            // matches them at `lg` / `md`, not `lg` / `sm`.
            size={size === "small" ? "md" : "lg"}
          >
            {label}
          </IdsFormLabel>
        </span>
      )}
      <div className={styles.fieldGroup}>
        <div className={styles.positionWrapper} ref={anchorRef}>
          <div className={fieldClasses}>
          <input
            id={inputId}
            type="text"
            className={`${styles.textInput} ${inputFilled ? styles.filled : ""}`}
            placeholder={placeholder}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onMouseDown={() => setMouseActivated(true)}
            onBlur={() => {
              setMouseActivated(false);
              if (inputText.trim()) commit(inputText.trim());
            }}
            disabled={disabled}
            // A visible label names the field through `htmlFor`. `aria-label`
            // would override it, so it is only the fallback when there is none.
            aria-label={label ? undefined : "Time"}
            aria-required={required || undefined}
            aria-describedby={describedBy}
          />
          <Button
            ref={clockBtnRef}
            type="button"
            variant="tertiary"
            size={size === "large" ? "lg" : "md"}
            iconOnly
            icon={<Icon shapeName="time-clock-16" style={{ width: 16, height: 16 }} />}
            onMouseDown={() => {
              if (!disabled) {
                window.getSelection()?.removeAllRanges();
              }
            }}
            onClick={() => {
              if (!disabled) {
                setOpen((v) => !v);
              }
            }}
            disabled={disabled}
            aria-label="Open time picker"
            aria-expanded={open}
            className={styles.clockButton}
          />
        </div>

        {!popupPortal && popup}
        {popupPortal &&
          open &&
          !disabled &&
          typeof document !== "undefined" &&
          popup &&
          createPortal(popup, document.body)}
        </div>

        {showError ? (
          <div className={styles.errorMessage} id={errorId} role="alert">
            <Icon shapeName="status-critical-square-solid" variant="img" style={{ width: 16, height: 16 }} />
            <span>{errorMessage}</span>
          </div>
        ) : (
          showFormatHint && (
            <span className={styles.formatHint} id={hintId}>
              {formatHint}
            </span>
          )
        )}
      </div>
    </div>
  );
}
