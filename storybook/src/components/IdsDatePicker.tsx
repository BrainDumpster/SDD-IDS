import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { createPortal } from "react-dom";
import { Icon } from "./Icon";
import styles from "./IdsDatePicker.module.css";

/** Above DataGrid column filter shell (`filterMenuLayer` z-index 10000). */
const CALENDAR_PORTAL_Z_INDEX = 10050;

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const WEEKDAY_FULL = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
];

/** Stable per-day key (ignores time-of-day) for focus/roving-tabindex lookups. */
function dayKey(d: Date) {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function addDays(d: Date, n: number) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
}

/** Add months/years, clamping the day to the last valid day of the target month. */
function addMonths(d: Date, n: number) {
  const y = d.getFullYear();
  const m = d.getMonth() + n;
  const targetY = y + Math.floor(m / 12);
  const targetM = ((m % 12) + 12) % 12;
  const day = Math.min(d.getDate(), getDaysInMonth(targetY, targetM));
  return new Date(targetY, targetM, day);
}

function addYears(d: Date, n: number) {
  const targetY = d.getFullYear() + n;
  const day = Math.min(d.getDate(), getDaysInMonth(targetY, d.getMonth()));
  return new Date(targetY, d.getMonth(), day);
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function isSameDay(a: Date | null, b: Date | null) {
  if (!a || !b) return false;
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function formatDate(d: Date, format: string = "MM-DD-YYYY") {
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const yyyy = d.getFullYear();

  if (format === "DD/MM/YYYY") {
    return `${dd}/${mm}/${yyyy}`;
  }
  if (format === "YYYY-MM-DD") {
    return `${yyyy}-${mm}-${dd}`;
  }
  // Default: MM-DD-YYYY
  return `${mm}-${dd}-${yyyy}`;
}

/**
 * Parse a date string against the active format. Accepts a range of separators
 * (`-`, `/`, `.`, whitespace) per the a11y guidance ("accept dashes, spaces,
 * slashes, dots"); the caller re-formats to the canonical separator on commit.
 * Rejects overflow dates (e.g. 02-30) via a round-trip check.
 */
function parseDate(s: string, format: string = "MM-DD-YYYY"): Date | null {
  const parts = s.trim().split(/[-/.\s]+/).filter(Boolean);
  if (parts.length !== 3) return null;
  if (parts.some((p) => !/^\d+$/.test(p))) return null;

  let yStr: string;
  let mo: number;
  let da: number;
  if (format === "YYYY-MM-DD") {
    [yStr] = parts;
    mo = +parts[1];
    da = +parts[2];
  } else if (format === "DD/MM/YYYY") {
    da = +parts[0];
    mo = +parts[1];
    yStr = parts[2];
  } else {
    // Default: MM-DD-YYYY
    mo = +parts[0];
    da = +parts[1];
    yStr = parts[2];
  }

  if (yStr.length !== 4) return null;
  const y = +yStr;
  if (mo < 1 || mo > 12 || da < 1 || da > 31) return null;

  const d = new Date(y, mo - 1, da);
  if (isNaN(d.getTime())) return null;
  // Reject overflow (Feb 30 -> Mar 2, etc.)
  if (d.getFullYear() !== y || d.getMonth() !== mo - 1 || d.getDate() !== da) return null;
  return d;
}

export interface IdsDatePickerProps {
  value?: Date | null;
  onChange?: (d: Date | null) => void;
  size?: "large" | "small";
  placeholder?: string;
  label?: string;
  required?: boolean;
  /** Date format for input text display/parsing (e.g., "MM-DD-YYYY", "DD/MM/YYYY", "YYYY-MM-DD"). Default: "MM-DD-YYYY". */
  dateFormat?: string;
  /** Date format hint displayed below the input (e.g. "MM-DD-YYYY"). Always shown unless empty string. */
  formatHint?: string;
  helperText?: string;
  disabled?: boolean;
  error?: boolean;
  errorMessage?: string;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  /** Enable date range selection (two-click model) */
  rangeMode?: boolean;
  /** Controlled range start date */
  rangeStart?: Date | null;
  /** Controlled range end date */
  rangeEnd?: Date | null;
  /** Callback when range start or end changes */
  onRangeChange?: (start: Date | null, end: Date | null) => void;
  /**
   * For a two-field date range picker: bind this field's input text to one range
   * endpoint. Both fields share `rangeStart`/`rangeEnd`, so either calendar
   * highlights the range while selecting.
   */
  rangeField?: "start" | "end";
  /** Force-open state for Storybook demos */
  forceOpen?: boolean;
  /** Force selected-with-dropdown visual (demo only) */
  forceState?: string;
  /**
   * Render the calendar in `document.body` with fixed positioning so it is not clipped
   * by overflow/stacking contexts (e.g. DataGrid filter panels). Default: true.
   */
  popupPortal?: boolean;
}

export function IdsDatePicker({
  value = null,
  onChange,
  size = "large",
  placeholder,
  label,
  required = false,
  dateFormat = "MM-DD-YYYY",
  formatHint = "MM-DD-YYYY",
  helperText,
  disabled = false,
  error = false,
  errorMessage,
  minDate,
  maxDate,
  disabledDates = [],
  rangeMode = false,
  rangeStart: controlledRangeStart,
  rangeEnd: controlledRangeEnd,
  onRangeChange,
  rangeField,
  forceOpen,
  forceState,
  popupPortal = true,
}: IdsDatePickerProps) {
  const today = useMemo(() => new Date(), []);
  const [internalValue, setInternalValue] = useState<Date | null>(value);
  const [open, setOpen] = useState(forceOpen ?? false);
  const [inputText, setInputText] = useState(value ? formatDate(value, dateFormat) : "");
  const [viewMonth, setViewMonth] = useState(value?.getMonth() ?? today.getMonth());
  const [viewYear, setViewYear] = useState(value?.getFullYear() ?? today.getFullYear());
  const effectivePlaceholder = placeholder ?? dateFormat;
  const [monthDropdownOpen, setMonthDropdownOpen] = useState(false);
  const [yearDropdownOpen, setYearDropdownOpen] = useState(false);

  const [internalRangeStart, setInternalRangeStart] = useState<Date | null>(controlledRangeStart ?? null);
  const [internalRangeEnd, setInternalRangeEnd] = useState<Date | null>(controlledRangeEnd ?? null);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  const rangeStart = controlledRangeStart !== undefined ? controlledRangeStart : internalRangeStart;
  const rangeEnd = controlledRangeEnd !== undefined ? controlledRangeEnd : internalRangeEnd;

  const rootRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const calendarPopupRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const calendarBtnRef = useRef<HTMLButtonElement>(null);
  const monthBtnRef = useRef<HTMLButtonElement>(null);
  const yearBtnRef = useRef<HTMLButtonElement>(null);
  const [calendarPos, setCalendarPos] = useState<{ top: number; left: number } | null>(null);
  const [mouseActivated, setMouseActivated] = useState(false);
  /** Roving-tabindex focus target inside the calendar grid (keyboard nav). */
  const [focusedDate, setFocusedDate] = useState<Date | null>(null);
  /** Inline validation message for a typed value that fails to parse (cleared on external `error`). */
  const [inputError, setInputError] = useState<string | null>(null);

  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value);
      setInputText(value ? formatDate(value, dateFormat) : "");
      setInputError(null);
    }
  }, [value, dateFormat]);

  // Two-field range picker: mirror this field's bound endpoint into its input text.
  useEffect(() => {
    if (rangeMode && rangeField) {
      const endpoint = rangeField === "start" ? rangeStart : rangeEnd;
      setInputText(endpoint ? formatDate(endpoint, dateFormat) : "");
    }
  }, [rangeMode, rangeField, rangeStart, rangeEnd, dateFormat]);

  useEffect(() => {
    if (forceOpen !== undefined) setOpen(forceOpen);
  }, [forceOpen]);

  const selectedDate = internalValue;

  // Seed the keyboard focus target when the calendar opens; clear it on close.
  useEffect(() => {
    if (!open) {
      setFocusedDate(null);
      return;
    }
    const seed = selectedDate ?? rangeStart ?? today;
    setFocusedDate((prev) => prev ?? new Date(seed.getFullYear(), seed.getMonth(), seed.getDate()));
    setViewMonth(seed.getMonth());
    setViewYear(seed.getFullYear());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Move DOM focus onto the roving grid cell whenever the focus target changes.
  // Skipped on the initial mount so forceOpen demos don't grab focus on load.
  const didMountRef = useRef(false);
  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }
    if (!open || !focusedDate) return;
    const el = gridRef.current?.querySelector<HTMLElement>(
      `[data-day="${dayKey(focusedDate)}"]`,
    );
    el?.focus();
  }, [open, focusedDate, viewMonth, viewYear]);

  const selectDate = useCallback(
    (d: Date) => {
      setInputError(null);
      if (rangeMode) {
        if (!rangeStart || (rangeStart && rangeEnd)) {
          setInternalRangeStart(d);
          setInternalRangeEnd(null);
          setHoverDate(null);
          onRangeChange?.(d, null);
        } else {
          setInternalRangeEnd(d);
          setHoverDate(null);
          onRangeChange?.(rangeStart, d);
        }
        return;
      }
      setInternalValue(d);
      setInputText(formatDate(d, dateFormat));
      setOpen(false);
      onChange?.(d);
    },
    [onChange, rangeMode, rangeStart, rangeEnd, onRangeChange, dateFormat],
  );

  const isInRange = useCallback(
    (d: Date) => {
      if (!rangeMode || !rangeStart) return false;
      const effectiveEnd = rangeEnd || hoverDate;
      if (!effectiveEnd) return false;
      const start = rangeStart.getTime();
      const end = effectiveEnd.getTime();
      const t = d.getTime();
      const lo = Math.min(start, end);
      const hi = Math.max(start, end);
      return t >= lo && t <= hi;
    },
    [rangeMode, rangeStart, rangeEnd, hoverDate],
  );

  const isRangeEndpoint = useCallback(
    (d: Date, which: "start" | "end") => {
      if (!rangeMode || !rangeStart) return false;
      const effectiveEnd = rangeEnd || hoverDate;
      if (!effectiveEnd) return which === "start" && isSameDay(d, rangeStart);
      const lo = rangeStart.getTime() <= effectiveEnd.getTime() ? rangeStart : effectiveEnd;
      const hi = rangeStart.getTime() <= effectiveEnd.getTime() ? effectiveEnd : rangeStart;
      if (which === "start") return isSameDay(d, lo);
      return isSameDay(d, hi);
    },
    [rangeMode, rangeStart, rangeEnd, hoverDate],
  );

  const isDateDisabled = useCallback(
    (d: Date) => {
      if (minDate && d < minDate) return true;
      if (maxDate && d > maxDate) return true;
      return disabledDates.some((dd) => isSameDay(dd, d));
    },
    [minDate, maxDate, disabledDates],
  );

  const computeRangeBar = useCallback(
    (row: { day: number; month: number; year: number }[]) => {
      if (!rangeMode || !rangeStart) return null;
      const effectiveEnd = rangeEnd || hoverDate;
      if (!effectiveEnd) return null;

      const lo = Math.min(rangeStart.getTime(), effectiveEnd.getTime());
      const hi = Math.max(rangeStart.getTime(), effectiveEnd.getTime());

      let firstIdx = -1;
      let lastIdx = -1;
      for (let i = 0; i < row.length; i++) {
        const t = new Date(row[i].year, row[i].month, row[i].day).getTime();
        if (t >= lo && t <= hi) {
          if (firstIdx === -1) firstIdx = i;
          lastIdx = i;
        }
      }
      if (firstIdx === -1) return null;

      const cellSize = 32;
      const gap = 4;
      const count = lastIdx - firstIdx + 1;
      const left = firstIdx * (cellSize + gap);
      const width = count * cellSize + (count - 1) * gap;
      const isForward = rangeStart.getTime() <= (effectiveEnd.getTime());
      const isFullRow = firstIdx === 0 && lastIdx === 6;

      return { left, width, isForward, isFullRow };
    },
    [rangeMode, rangeStart, rangeEnd, hoverDate],
  );

  const calendarGrid = useMemo(() => {
    const daysInMonth = getDaysInMonth(viewYear, viewMonth);
    const firstDay = getFirstDayOfWeek(viewYear, viewMonth);
    const prevMonthDays = getDaysInMonth(viewYear, viewMonth - 1);
    const rows: { day: number; month: number; year: number; type: "prev" | "current" | "next" }[][] = [];
    let row: typeof rows[number] = [];

    for (let i = 0; i < firstDay; i++) {
      const d = prevMonthDays - firstDay + 1 + i;
      const m = viewMonth === 0 ? 11 : viewMonth - 1;
      const y = viewMonth === 0 ? viewYear - 1 : viewYear;
      row.push({ day: d, month: m, year: y, type: "prev" });
    }

    for (let d = 1; d <= daysInMonth; d++) {
      row.push({ day: d, month: viewMonth, year: viewYear, type: "current" });
      if (row.length === 7) {
        rows.push(row);
        row = [];
      }
    }

    if (row.length > 0) {
      let nextDay = 1;
      const nm = viewMonth === 11 ? 0 : viewMonth + 1;
      const ny = viewMonth === 11 ? viewYear + 1 : viewYear;
      while (row.length < 7) {
        row.push({ day: nextDay++, month: nm, year: ny, type: "next" });
      }
      rows.push(row);
    }

    while (rows.length < 6) {
      const lastRow = rows[rows.length - 1];
      const lastCell = lastRow[lastRow.length - 1];
      let startDay = lastCell.day + 1;
      let nm = lastCell.month;
      let ny = lastCell.year;
      const daysInThatMonth = getDaysInMonth(ny, nm);
      if (startDay > daysInThatMonth) {
        startDay = 1;
        nm = nm === 11 ? 0 : nm + 1;
        ny = nm === 0 ? ny + 1 : ny;
      }
      const newRow: typeof rows[number] = [];
      for (let i = 0; i < 7; i++) {
        const ddim = getDaysInMonth(ny, nm);
        if (startDay > ddim) {
          startDay = 1;
          nm = nm === 11 ? 0 : nm + 1;
          ny = nm === 0 ? ny + 1 : ny;
        }
        newRow.push({ day: startDay++, month: nm, year: ny, type: "next" });
      }
      rows.push(newRow);
    }

    return rows;
  }, [viewYear, viewMonth]);

  const handleInputBlur = () => {
    const text = inputText.trim();
    if (!text) {
      setInputError(null);
      return;
    }
    const d = parseDate(inputText, dateFormat);
    if (d && !isDateDisabled(d)) {
      selectDate(d);
      setViewMonth(d.getMonth());
      setViewYear(d.getFullYear());
    } else {
      // Parsed but out of range/disabled → unavailable; otherwise the format is wrong.
      setInputError(d ? "Date unavailable" : `Invalid date, use ${formatHint || dateFormat}`);
    }
  };

  const updateCalendarPosition = useCallback(() => {
    const anchor = anchorRef.current;
    if (!anchor) return;
    const rect = anchor.getBoundingClientRect();
    const popup = calendarPopupRef.current;
    const popupWidth = popup?.offsetWidth ?? 280;
    const popupHeight = popup?.offsetHeight ?? 340;
    const margin = 8;
    let top = rect.bottom - 1;
    let left = rect.right - popupWidth;
    left = Math.max(margin, Math.min(left, window.innerWidth - popupWidth - margin));
    if (top + popupHeight > window.innerHeight - margin) {
      const above = rect.top - popupHeight + 1;
      if (above >= margin) top = above;
    }
    setCalendarPos({ top, left });
  }, []);

  useLayoutEffect(() => {
    if (!open || !popupPortal) {
      setCalendarPos(null);
      return;
    }

    let cancelled = false;
    const run = () => {
      if (cancelled) return;
      updateCalendarPosition();
    };

    run();
    const raf = requestAnimationFrame(() => {
      run();
      requestAnimationFrame(run);
    });

    const onWin = () => run();
    window.addEventListener("resize", onWin);
    window.addEventListener("scroll", onWin, true);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onWin);
      window.removeEventListener("scroll", onWin, true);
    };
  }, [open, popupPortal, updateCalendarPosition, viewMonth, viewYear, monthDropdownOpen, yearDropdownOpen]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (rootRef.current?.contains(target)) return;
      if (calendarPopupRef.current?.contains(target)) return;
      setOpen(false);
      setMonthDropdownOpen(false);
      setYearDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape" && open) {
      e.preventDefault();
      closeCalendar();
    }
  };

  const closeCalendar = useCallback((returnFocus = true) => {
    setOpen(false);
    setMonthDropdownOpen(false);
    setYearDropdownOpen(false);
    if (returnFocus) calendarBtnRef.current?.focus();
  }, []);

  /** Keyboard navigation within the calendar grid (single focus stop, roving tabindex). */
  const onGridKeyDown = (e: React.KeyboardEvent) => {
    if (!focusedDate) return;
    let next: Date | null = null;
    switch (e.key) {
      // NOTE: the design doc lists Right=previous / Left=next, which is the
      // reverse of the conventional LTR calendar (and of the WAI-ARIA pattern).
      // We follow the conventional mapping so the grid isn't backwards.
      case "ArrowLeft":
        next = addDays(focusedDate, -1);
        break;
      case "ArrowRight":
        next = addDays(focusedDate, 1);
        break;
      case "ArrowUp":
        next = addDays(focusedDate, -7);
        break;
      case "ArrowDown":
        next = addDays(focusedDate, 7);
        break;
      case "Home":
        next = addDays(focusedDate, -focusedDate.getDay());
        break;
      case "End":
        next = addDays(focusedDate, 6 - focusedDate.getDay());
        break;
      case "PageUp":
        next = e.shiftKey ? addYears(focusedDate, -1) : addMonths(focusedDate, -1);
        break;
      case "PageDown":
        next = e.shiftKey ? addYears(focusedDate, 1) : addMonths(focusedDate, 1);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (!isDateDisabled(focusedDate)) selectDate(focusedDate);
        return;
      default:
        return;
    }
    if (next) {
      e.preventDefault();
      setFocusedDate(next);
      setViewMonth(next.getMonth());
      setViewYear(next.getFullYear());
    }
  };

  /** Focusable elements inside the calendar dialog, in DOM order (for the focus trap). */
  const getFocusableEls = () => {
    const rootEl = calendarPopupRef.current;
    if (!rootEl) return [] as HTMLElement[];
    return Array.from(
      rootEl.querySelectorAll<HTMLElement>('button:not([disabled]), [tabindex="0"]'),
    ).filter((el) => el.offsetParent !== null);
  };

  /** Dialog-level keys: Esc, Tab focus trap, Shift-M / Shift-Y dropdown shortcuts. */
  const onDialogKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      closeCalendar();
      return;
    }
    if (e.shiftKey && (e.key === "M" || e.key === "m")) {
      e.preventDefault();
      setYearDropdownOpen(false);
      setMonthDropdownOpen(true);
      monthBtnRef.current?.focus();
      return;
    }
    if (e.shiftKey && (e.key === "Y" || e.key === "y")) {
      e.preventDefault();
      setMonthDropdownOpen(false);
      setYearDropdownOpen(true);
      yearBtnRef.current?.focus();
      return;
    }
    if (e.key === "Tab") {
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
    }
  };

  // External `error` prop wins; otherwise surface the inline typed-value validation message.
  const showError = error || Boolean(inputError);
  const shownErrorMessage = error ? errorMessage : inputError;

  const fieldClasses = [
    styles.fieldContainer,
    size === "large" ? styles.sizeLarge : styles.sizeSmall,
    disabled ? styles.disabled : "",
    showError ? styles.error : "",
    open ? styles.open : "",
    mouseActivated ? styles.mouseActivated : "",
  ]
    .filter(Boolean)
    .join(" ");

  const yearRange = useMemo(() => {
    const start = viewYear - 3;
    return Array.from({ length: 7 }, (_, i) => start + i);
  }, [viewYear]);

  const calendarPopupClasses = [
    styles.calendarPopup,
    popupPortal ? styles.calendarPopupPortaled : "",
  ]
    .filter(Boolean)
    .join(" ");

  const calendarPopupStyle: CSSProperties | undefined =
    popupPortal && calendarPos
      ? { top: calendarPos.top, left: calendarPos.left, zIndex: CALENDAR_PORTAL_Z_INDEX }
      : popupPortal
        ? { visibility: "hidden" as const }
        : undefined;

  const calendarPopup = open && !disabled && (
    <div
      ref={calendarPopupRef}
      className={calendarPopupClasses}
      style={calendarPopupStyle}
      role="dialog"
      aria-modal="true"
      aria-label="Choose date"
      onKeyDown={onDialogKeyDown}
    >
      <div className={styles.calendarHeader}>
        <div className={styles.headerDropdowns}>
          <button
            ref={monthBtnRef}
            type="button"
            className={`${styles.dropdownButton}${monthDropdownOpen ? ` ${styles.menuOpen}` : ""}`}
            aria-haspopup="listbox"
            aria-expanded={monthDropdownOpen}
            aria-label="Month"
            onClick={() => {
              setMonthDropdownOpen((v) => !v);
              setYearDropdownOpen(false);
            }}
          >
            {MONTH_NAMES[viewMonth]}
            <Icon shapeName="arrow-drop-tri-caret" className={styles.caretIcon} style={{ width: 10, height: 10 }} />
            {monthDropdownOpen && (
              <div className={styles.overlayDropdown}>
                {MONTH_NAMES.map((name, i) => (
                  <button
                    key={name}
                    type="button"
                    className={`${styles.overlayOption} ${i === viewMonth ? styles.selectedOption : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setViewMonth(i);
                      setMonthDropdownOpen(false);
                    }}
                  >
                    {name}
                  </button>
                ))}
              </div>
            )}
          </button>
          <button
            ref={yearBtnRef}
            type="button"
            className={`${styles.dropdownButton} ${styles.yearBtn}${yearDropdownOpen ? ` ${styles.menuOpen}` : ""}`}
            aria-haspopup="listbox"
            aria-expanded={yearDropdownOpen}
            aria-label="Year"
            onClick={() => {
              setYearDropdownOpen((v) => !v);
              setMonthDropdownOpen(false);
            }}
          >
            {viewYear}
            <Icon shapeName="arrow-drop-tri-caret" className={styles.caretIcon} style={{ width: 10, height: 10 }} />
            {yearDropdownOpen && (
              <div className={styles.overlayDropdown}>
                {yearRange.map((yr) => (
                  <button
                    key={yr}
                    type="button"
                    className={`${styles.overlayOption} ${yr === viewYear ? styles.selectedOption : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setViewYear(yr);
                      setYearDropdownOpen(false);
                    }}
                  >
                    {yr}
                  </button>
                ))}
              </div>
            )}
          </button>
        </div>

        <div className={styles.navButtons}>
          <button
            type="button"
            className={styles.navBtn}
            onClick={() => {
              if (viewMonth === 0) {
                setViewMonth(11);
                setViewYear((y) => y - 1);
              } else {
                setViewMonth((m) => m - 1);
              }
            }}
            aria-label="Previous month"
          >
            <Icon shapeName="chev-left-thick" className={styles.navIcon} style={{ width: 12, height: 12 }} />
          </button>
          <button
            type="button"
            className={styles.navBtn}
            onClick={() => {
              if (viewMonth === 11) {
                setViewMonth(0);
                setViewYear((y) => y + 1);
              } else {
                setViewMonth((m) => m + 1);
              }
            }}
            aria-label="Next month"
          >
            <Icon shapeName="chev-right-thick" className={styles.navIcon} style={{ width: 12, height: 12 }} />
          </button>
        </div>
      </div>

      <div className={styles.dateSection}>
        <div className={styles.dateContent} role="grid" aria-label="Calendar">
          <div className={styles.weekDayRow}>
            {WEEKDAYS.map((d) => (
              <span key={d} className={styles.weekDayLabel}>
                {d}
              </span>
            ))}
          </div>
          <div className={styles.dateGrid} ref={gridRef} onKeyDown={onGridKeyDown}>
            {calendarGrid.map((row, ri) => {
              const bar = computeRangeBar(row);
              return (
                <div key={ri} className={styles.dateRow} role="row">
                  {bar && (
                    <div
                      className={`${styles.rangeBar} ${bar.isFullRow ? styles.fullRow : bar.isForward ? styles.forward : styles.reverse}`}
                      style={{ left: bar.left, width: bar.width }}
                    />
                  )}
                  {row.map((cell, ci) => {
                    const cellDate = new Date(cell.year, cell.month, cell.day);
                    const isUnavailable = isDateDisabled(cellDate);
                    const isSelected =
                      !isUnavailable &&
                      (rangeMode
                        ? isRangeEndpoint(cellDate, "start") || isRangeEndpoint(cellDate, "end")
                        : isSameDay(cellDate, selectedDate));
                    const isToday = isSameDay(cellDate, today);
                    const isAdjacentMonth = cell.type !== "current";
                    const inRange = !isUnavailable && isInRange(cellDate);
                    const isFocusTarget = isSameDay(cellDate, focusedDate);
                    const ariaLabel = [
                      `${WEEKDAY_FULL[cellDate.getDay()]}, ${MONTH_NAMES[cell.month]} ${cell.day}, ${cell.year}`,
                      isToday ? "today" : "",
                      isSelected ? "selected" : "",
                      isUnavailable ? "unavailable" : "",
                    ]
                      .filter(Boolean)
                      .join(", ");
                    const cellClasses = [
                      styles.dateCell,
                      isSelected ? styles.selected : "",
                      isUnavailable ? styles.unavailable : "",
                      rangeMode && !isUnavailable && isRangeEndpoint(cellDate, "start")
                        ? styles.rangeStart
                        : "",
                      rangeMode && !isUnavailable && isRangeEndpoint(cellDate, "end")
                        ? styles.rangeEnd
                        : "",
                    ]
                      .filter(Boolean)
                      .join(" ");

                    return (
                      <div
                        key={ci}
                        className={cellClasses}
                        role="gridcell"
                        data-day={dayKey(cellDate)}
                        aria-label={ariaLabel}
                        aria-selected={isSelected || inRange}
                        aria-disabled={isUnavailable}
                        tabIndex={isFocusTarget ? 0 : -1}
                        onClick={() => {
                          if (isUnavailable) return;
                          if (isAdjacentMonth) {
                            setViewMonth(cell.month);
                            setViewYear(cell.year);
                          }
                          setFocusedDate(cellDate);
                          selectDate(cellDate);
                        }}
                        onMouseEnter={() => {
                          if (rangeMode && rangeStart && !rangeEnd && !isUnavailable) {
                            setHoverDate(cellDate);
                          }
                        }}
                        onMouseLeave={() => {
                          if (rangeMode) setHoverDate(null);
                        }}
                      >
                        <div
                          className={`${styles.dateCellContainer} ${isToday ? styles.todayType : ""}`}
                        >
                          <span
                            className={`${styles.dateLabel} ${isAdjacentMonth ? styles.adjacentMonth : ""}`}
                          >
                            {cell.day}
                          </span>
                          {isToday && <div className={styles.todayIndicator} />}
                        </div>
                        <div className={styles.focusRing} />
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
        <button
          type="button"
          className={styles.todayLink}
          onClick={() => {
            setViewMonth(today.getMonth());
            setViewYear(today.getFullYear());
            selectDate(today);
          }}
        >
          Today
        </button>
      </div>
    </div>
  );

  return (
    <div className={styles.root} ref={rootRef} onKeyDown={handleKeyDown}>
      {label && (
        <div className={`${styles.label}${size === "small" ? ` ${styles.labelSmall}` : ""}`}>
          <div className={styles.labelInner}>
            <span className={styles.labelText}>{label}</span>
            {required && <span className={styles.labelRequired}>*</span>}
          </div>
        </div>
      )}
      <div className={styles.inputGroup}>
        <div className={styles.positionWrapper} ref={anchorRef}>
          <div className={fieldClasses}>
            <input
              type="text"
              className={styles.textInput}
              placeholder={effectivePlaceholder}
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                if (inputError) setInputError(null);
              }}
              onMouseDown={() => setMouseActivated(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleInputBlur();
                }
              }}
              onBlur={() => { setMouseActivated(false); handleInputBlur(); }}
              disabled={disabled}
              aria-label={label ? (inputText ? label : `${label}, ${effectivePlaceholder}`) : "Date"}
            />
            <button
              ref={calendarBtnRef}
              type="button"
              className={`${styles.calendarIconBtn} ${showError ? styles.error : ""}`}
              onClick={() => {
                if (!disabled) setOpen((v) => !v);
              }}
              disabled={disabled}
              aria-label="Choose date"
              aria-haspopup="dialog"
              aria-expanded={open}
            >
              <Icon shapeName="calendar-simple-16" style={{ width: 16, height: 16 }} />
            </button>
          </div>

          {!popupPortal && calendarPopup}
          {popupPortal &&
            open &&
            !disabled &&
            typeof document !== "undefined" &&
            calendarPopup &&
            createPortal(calendarPopup, document.body)}
        </div>
        {formatHint && !showError && <span className={styles.formatHint}>{formatHint}</span>}
        {showError && shownErrorMessage && (
          <span className={styles.errorMessage}>
            <Icon
              shapeName="status-critical-square-solid"
              variant="img"
              style={{ width: 16, height: 16, flexShrink: 0 }}
            />
            {shownErrorMessage}
          </span>
        )}
      </div>
    </div>
  );
}
