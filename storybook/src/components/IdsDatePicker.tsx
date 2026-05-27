import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "./Icon";
import styles from "./IdsDatePicker.module.css";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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

function formatDate(d: Date) {
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${mm}/${dd}/${d.getFullYear()}`;
}

function parseDate(s: string): Date | null {
  const m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!m) return null;
  const d = new Date(+m[3], +m[1] - 1, +m[2]);
  if (isNaN(d.getTime())) return null;
  return d;
}

export interface IdsDatePickerProps {
  value?: Date | null;
  onChange?: (d: Date | null) => void;
  size?: "large" | "small";
  placeholder?: string;
  label?: string;
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
  /** Force-open state for Storybook demos */
  forceOpen?: boolean;
  /** Force selected-with-dropdown visual (demo only) */
  forceState?: string;
}

export function IdsDatePicker({
  value = null,
  onChange,
  size = "large",
  placeholder = "MM/DD/YYYY",
  label,
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
  forceOpen,
  forceState,
}: IdsDatePickerProps) {
  const today = useMemo(() => new Date(), []);
  const [internalValue, setInternalValue] = useState<Date | null>(value);
  const [open, setOpen] = useState(forceOpen ?? false);
  const [inputText, setInputText] = useState(value ? formatDate(value) : "");
  const [viewMonth, setViewMonth] = useState(value?.getMonth() ?? today.getMonth());
  const [viewYear, setViewYear] = useState(value?.getFullYear() ?? today.getFullYear());
  const [monthDropdownOpen, setMonthDropdownOpen] = useState(false);
  const [yearDropdownOpen, setYearDropdownOpen] = useState(false);

  const [internalRangeStart, setInternalRangeStart] = useState<Date | null>(controlledRangeStart ?? null);
  const [internalRangeEnd, setInternalRangeEnd] = useState<Date | null>(controlledRangeEnd ?? null);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  const rangeStart = controlledRangeStart !== undefined ? controlledRangeStart : internalRangeStart;
  const rangeEnd = controlledRangeEnd !== undefined ? controlledRangeEnd : internalRangeEnd;

  const rootRef = useRef<HTMLDivElement>(null);
  const [mouseActivated, setMouseActivated] = useState(false);

  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value);
      setInputText(value ? formatDate(value) : "");
    }
  }, [value]);

  useEffect(() => {
    if (forceOpen !== undefined) setOpen(forceOpen);
  }, [forceOpen]);

  const selectedDate = internalValue;

  const selectDate = useCallback(
    (d: Date) => {
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
      setInputText(formatDate(d));
      setOpen(false);
      onChange?.(d);
    },
    [onChange, rangeMode, rangeStart, rangeEnd, onRangeChange],
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
    if (inputText.trim()) {
      const d = parseDate(inputText);
      if (d && !isDateDisabled(d)) {
        selectDate(d);
        setViewMonth(d.getMonth());
        setViewYear(d.getFullYear());
      }
    }
  };

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
        setMonthDropdownOpen(false);
        setYearDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape" && open) {
      setOpen(false);
      setMonthDropdownOpen(false);
      setYearDropdownOpen(false);
    }
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

  const yearRange = useMemo(() => {
    const start = viewYear - 3;
    return Array.from({ length: 7 }, (_, i) => start + i);
  }, [viewYear]);

  return (
    <div className={styles.root} ref={rootRef} onKeyDown={handleKeyDown}>
      {label && <span className={styles.label}>{label}</span>}
      <div className={styles.positionWrapper}>
        <div className={fieldClasses}>
          <input
            type="text"
            className={styles.textInput}
            placeholder={placeholder}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onMouseDown={() => setMouseActivated(true)}
            onBlur={() => { setMouseActivated(false); handleInputBlur(); }}
            disabled={disabled}
            aria-label={label || "Date"}
          />
          <button
            type="button"
            className={`${styles.calendarIconBtn} ${error ? styles.error : ""}`}
            onClick={() => {
              if (!disabled) setOpen((v) => !v);
            }}
            disabled={disabled}
            aria-label="Open calendar"
            aria-expanded={open}
          >
            <Icon shapeName="calendar-simple-16" style={{ width: 16, height: 16 }} />
          </button>
        </div>

        {open && !disabled && (
          <div className={styles.calendarPopup} role="dialog" aria-modal="true" aria-label="Choose date">
            <div className={styles.calendarHeader}>
              <div className={styles.headerDropdowns}>
                <button
                  type="button"
                  className={styles.dropdownButton}
                  onClick={() => {
                    setMonthDropdownOpen((v) => !v);
                    setYearDropdownOpen(false);
                  }}
                >
                  {MONTH_NAMES[viewMonth]}
                  <svg className={styles.caretIcon} viewBox="0 0 10 10">
                    <path d="M2 3.5L5 7L8 3.5" fill="currentColor" />
                  </svg>
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
                  type="button"
                  className={`${styles.dropdownButton} ${styles.yearBtn}`}
                  onClick={() => {
                    setYearDropdownOpen((v) => !v);
                    setMonthDropdownOpen(false);
                  }}
                >
                  {viewYear}
                  <svg className={styles.caretIcon} viewBox="0 0 10 10">
                    <path d="M2 3.5L5 7L8 3.5" fill="currentColor" />
                  </svg>
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
                  <Icon
                    shapeName="chev-left-thick"
                    className={styles.navIcon}
                    style={{ width: 12, height: 12 }}
                  />
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
                  <Icon
                    shapeName="chev-right-thick"
                    className={styles.navIcon}
                    style={{ width: 12, height: 12 }}
                  />
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
                <div className={styles.dateGrid}>
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
                              aria-selected={isSelected || inRange}
                              aria-disabled={isUnavailable}
                              tabIndex={isUnavailable ? -1 : 0}
                              onClick={() => {
                                if (isUnavailable) return;
                                if (isAdjacentMonth) {
                                  setViewMonth(cell.month);
                                  setViewYear(cell.year);
                                }
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
                              onKeyDown={(e) => {
                                if ((e.key === "Enter" || e.key === " ") && !isUnavailable) {
                                  e.preventDefault();
                                  if (isAdjacentMonth) {
                                    setViewMonth(cell.month);
                                    setViewYear(cell.year);
                                  }
                                  selectDate(cellDate);
                                }
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
        )}
      </div>
      {formatHint && <span className={styles.formatHint}>{formatHint}</span>}
      {error && errorMessage && (
        <span className={styles.errorMessage}>
          <Icon
            shapeName="status-critical-square-solid"
            variant="img"
            style={{ width: 16, height: 16, flexShrink: 0 }}
          />
          {errorMessage}
        </span>
      )}
    </div>
  );
}
