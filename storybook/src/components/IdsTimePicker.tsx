import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "./Icon";
import styles from "./IdsTimePicker.module.css";

export interface IdsTimePickerProps {
  value?: string | null;
  onChange?: (value: string | null) => void;
  size?: "large" | "small";
  placeholder?: string;
  label?: string;
  formatHint?: string;
  clockType?: "12h" | "24h";
  showSeconds?: boolean;
  disabled?: boolean;
  error?: boolean;
  errorMessage?: string;
  forceOpen?: boolean;
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
  onUp,
  onDown,
  disabled,
}: {
  label: string;
  display: string;
  onUp: () => void;
  onDown: () => void;
  disabled?: boolean;
}) {
  return (
    <div className={styles.timeColumn} role="group" aria-label={label}>
      <button type="button" className={`${styles.arrowBtn} ${styles.arrowUp}`} onClick={onUp} disabled={disabled} aria-label={`Increase ${label}`}>
        <Icon shapeName="arrow-tri-down-solid" style={{ width: 10, height: 10 }} />
      </button>
      <div className={styles.valueCell} aria-live="polite">
        {display}
      </div>
      <button type="button" className={styles.arrowBtn} onClick={onDown} disabled={disabled} aria-label={`Decrease ${label}`}>
        <Icon shapeName="arrow-tri-down-solid" style={{ width: 10, height: 10 }} />
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
  formatHint = "HH:MM AM/PM",
  clockType = "12h",
  showSeconds = false,
  disabled = false,
  error = false,
  errorMessage,
  forceOpen,
}: IdsTimePickerProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [mouseActivated, setMouseActivated] = useState(false);
  const [open, setOpen] = useState(forceOpen ?? false);
  const [inputText, setInputText] = useState(value ?? "");

  const defaults12 = { hour: 9, minute: 30, second: 0, period: "PM" as Period };
  const defaults24 = { hour: 13, minute: 30, second: 0 };

  const [hour12, setHour12] = useState(defaults12.hour);
  const [minute, setMinute] = useState(defaults12.minute);
  const [second, setSecond] = useState(0);
  const [period, setPeriod] = useState<Period>(defaults12.period);
  const [hour24, setHour24] = useState(defaults24.hour);

  useEffect(() => {
    if (value !== undefined && value !== null) {
      setInputText(value);
      if (clockType === "12h") {
        const p = parseTime12(value);
        if (p) {
          setHour12(p.hour);
          setMinute(p.minute);
          setSecond(p.second);
          setPeriod(p.period);
        }
      } else {
        const p = parseTime24(value);
        if (p) {
          setHour24(p.hour);
          setMinute(p.minute);
          setSecond(p.second);
        }
      }
    }
  }, [value, clockType]);

  useEffect(() => {
    if (forceOpen !== undefined) setOpen(forceOpen);
  }, [forceOpen]);

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

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
        applyFromColumns();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, applyFromColumns]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape" && open) {
      setOpen(false);
      applyFromColumns();
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

  return (
    <div className={styles.root} ref={rootRef} onKeyDown={handleKeyDown}>
      {label && <span className={styles.label}>{label}</span>}
      <div className={styles.fieldGroup}>
        <div className={styles.positionWrapper}>
          <div className={fieldClasses}>
          <input
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
            aria-label={label || "Time"}
          />
          <button
            type="button"
            className={`${styles.clockIconBtn} ${error ? styles.error : ""}`}
            onClick={() => {
              if (!disabled) setOpen((v) => !v);
            }}
            disabled={disabled}
            aria-label="Open time picker"
            aria-expanded={open}
          >
            <Icon shapeName="time-clock-16" style={{ width: 16, height: 16 }} />
          </button>
        </div>

        {open && !disabled && (
          <div
            className={`${styles.timePopup} ${clockType === "24h" && !showSeconds ? styles.widePadding : ""}`}
            role="dialog"
            aria-modal="true"
            aria-label="Choose time"
          >
            {clockType === "12h" ? (
              <>
                <TimeColumn
                  label="Hour"
                  display={String(hour12)}
                  disabled={disabled}
                  onUp={() => setHour12((h) => wrap(h + 1, 1, 12))}
                  onDown={() => setHour12((h) => wrap(h - 1, 1, 12))}
                />
                <TimeColumn
                  label="Minute"
                  display={pad2(minute)}
                  disabled={disabled}
                  onUp={() => setMinute((m) => wrap(m + 1, 0, 59))}
                  onDown={() => setMinute((m) => wrap(m - 1, 0, 59))}
                />
                {showSeconds && (
                  <TimeColumn
                    label="Second"
                    display={pad2(second)}
                    disabled={disabled}
                    onUp={() => setSecond((s) => wrap(s + 1, 0, 59))}
                    onDown={() => setSecond((s) => wrap(s - 1, 0, 59))}
                  />
                )}
                <TimeColumn
                  label="AM or PM"
                  display={period}
                  disabled={disabled}
                  onUp={() => setPeriod((p) => (p === "AM" ? "PM" : "AM"))}
                  onDown={() => setPeriod((p) => (p === "AM" ? "PM" : "AM"))}
                />
              </>
            ) : (
              <>
                <TimeColumn
                  label="Hour"
                  display={String(hour24)}
                  disabled={disabled}
                  onUp={() => setHour24((h) => wrap(h + 1, 0, 23))}
                  onDown={() => setHour24((h) => wrap(h - 1, 0, 23))}
                />
                <TimeColumn
                  label="Minute"
                  display={pad2(minute)}
                  disabled={disabled}
                  onUp={() => setMinute((m) => wrap(m + 1, 0, 59))}
                  onDown={() => setMinute((m) => wrap(m - 1, 0, 59))}
                />
                {showSeconds && (
                  <TimeColumn
                    label="Second"
                    display={pad2(second)}
                    disabled={disabled}
                    onUp={() => setSecond((s) => wrap(s + 1, 0, 59))}
                    onDown={() => setSecond((s) => wrap(s - 1, 0, 59))}
                  />
                )}
              </>
            )}
          </div>
        )}
        </div>

        {error && errorMessage ? (
          <div className={styles.errorMessage} role="alert">
            <Icon shapeName="status-critical-square-solid" variant="img" style={{ width: 16, height: 16 }} />
            <span>{errorMessage}</span>
          </div>
        ) : (
          showFormatHint && <span className={styles.formatHint}>{formatHint}</span>
        )}
      </div>
    </div>
  );
}
